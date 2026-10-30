import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AppView, Conversation, Message } from './types';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ChatView } from './components/chat/ChatView';
import { ProductivityView } from './components/productivity/ProductivityView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Load initial conversations on mount
  useEffect(() => {
    const loaded = storageService.getConversations();
    setConversations(loaded);
    setIsDemoMode(aiService.isDemoMode());

    const activeId = storageService.getActiveConversationId();
    if (activeId) {
      const found = loaded.find((c) => c.id === activeId);
      if (found) {
        setActiveConversation(found);
      } else {
        const fresh = storageService.createEmptyConversation();
        setActiveConversation(fresh);
        storageService.setActiveConversationId(fresh.id);
      }
    } else {
      const fresh = storageService.createEmptyConversation();
      setActiveConversation(fresh);
      storageService.setActiveConversationId(fresh.id);
    }

    // Configure native status bar safely if running on mobile
    try {
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#070b14' }).catch(() => {});
      }
    } catch (err) {
      console.warn('Native status bar setup warning:', err);
    }
  }, []);

  // Handle native Android hardware back button safely
  useEffect(() => {
    try {
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('App')) return;

      const backListener = CapApp.addListener('backButton', () => {
        if (sidebarOpen) {
          setSidebarOpen(false);
        } else if (currentView !== 'chat') {
          setCurrentView('chat');
        } else {
          CapApp.exitApp();
        }
      });

      return () => {
        backListener.then((handle) => handle.remove()).catch(() => {});
      };
    } catch (err) {
      console.warn('Native hardware back button setup warning:', err);
    }
  }, [sidebarOpen, currentView]);

  const handleNewChat = () => {
    const newConvo = storageService.createEmptyConversation();
    storageService.saveConversation(newConvo);
    storageService.setActiveConversationId(newConvo.id);
    setActiveConversation(newConvo);
    setConversations(storageService.getConversations());
    setCurrentView('chat');
    setErrorMessage(null);
  };

  const handleSelectConversation = (id: string) => {
    const found = storageService.getConversationById(id);
    if (found) {
      setActiveConversation(found);
      storageService.setActiveConversationId(found.id);
      setCurrentView('chat');
      setErrorMessage(null);
    }
  };

  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    const updated = storageService.getConversations();
    setConversations(updated);

    if (activeConversation?.id === id) {
      if (updated.length > 0) {
        setActiveConversation(updated[0]);
        storageService.setActiveConversationId(updated[0].id);
      } else {
        const fresh = storageService.createEmptyConversation();
        setActiveConversation(fresh);
        storageService.setActiveConversationId(fresh.id);
      }
    }
  };

  const handleClearAllConversations = () => {
    storageService.clearAllConversations();
    setConversations([]);
    const fresh = storageService.createEmptyConversation();
    setActiveConversation(fresh);
    storageService.setActiveConversationId(fresh.id);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let convo = activeConversation;
    if (!convo) {
      convo = storageService.createEmptyConversation();
      setActiveConversation(convo);
      storageService.setActiveConversationId(convo.id);
    }

    const userMessage: Message = {
      id: 'msg_' + Date.now() + '_user',
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Append user message immediately
    const updatedConvo = storageService.appendMessage(convo.id, userMessage);
    if (updatedConvo) {
      setActiveConversation({ ...updatedConvo });
      setConversations(storageService.getConversations());
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await aiService.generateResponse(text);

      if (response.error) {
        setErrorMessage(response.error);
      } else {
        const assistantMessage: Message = {
          id: 'msg_' + Date.now() + '_assistant',
          role: 'assistant',
          content: response.text,
          timestamp: new Date().toISOString(),
        };

        const postConvo = storageService.appendMessage(convo.id, assistantMessage);
        if (postConvo) {
          setActiveConversation({ ...postConvo });
          setConversations(storageService.getConversations());
        }
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to communicate with the AI engine. Please verify connectivity or switch to Demo Mode in Settings.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCurrentChat = () => {
    if (!activeConversation) return;
    const cleared: Conversation = {
      ...activeConversation,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    storageService.saveConversation(cleared);
    setActiveConversation(cleared);
    setConversations(storageService.getConversations());
    setErrorMessage(null);
  };

  const handleUpdateMessage = (messageId: string, updatedContent: string) => {
    if (!activeConversation) return;

    const updatedMessages = activeConversation.messages.map((msg) =>
      msg.id === messageId ? { ...msg, content: updatedContent } : msg
    );

    const updatedConvo: Conversation = {
      ...activeConversation,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveConversation(updatedConvo);
    setActiveConversation(updatedConvo);
    setConversations(storageService.getConversations());
  };

  const handleToggleDemoMode = (demo: boolean) => {
    aiService.setDemoMode(demo);
    setIsDemoMode(demo);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-navy-950 text-slate-100 overflow-hidden">
      <Header
        currentView={currentView}
        isDemoMode={isDemoMode}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar
          currentView={currentView}
          isOpen={sidebarOpen}
          savedCount={conversations.length}
          onSelectView={(view) => setCurrentView(view)}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-navy-900/60 relative">
          {currentView === 'chat' && (
            <ChatView
              activeConversation={activeConversation}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearCurrentChat}
              onUpdateMessage={handleUpdateMessage}
            />
          )}

          {currentView === 'productivity' && <ProductivityView />}

          {currentView === 'history' && (
            <HistoryView
              conversations={conversations}
              activeId={activeConversation?.id || null}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onClearAll={handleClearAllConversations}
              onNewChat={handleNewChat}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              isDemoMode={isDemoMode}
              onToggleDemoMode={handleToggleDemoMode}
              savedCount={conversations.length}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        savedCount={conversations.length}
        onSelectView={setCurrentView}
      />
    </div>
  );
};

export default App;
