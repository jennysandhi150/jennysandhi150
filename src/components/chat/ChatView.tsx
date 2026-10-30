import React, { useRef, useEffect } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Conversation } from '../../types';
import { MessageItem } from './MessageItem';
import { SuggestedPrompts } from './SuggestedPrompts';
import { ChatInput } from './ChatInput';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ChatViewProps {
  activeConversation: Conversation | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onUpdateMessage?: (messageId: string, updatedContent: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  activeConversation,
  isLoading,
  errorMessage,
  onSendMessage,
  onClearChat,
  onUpdateMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full max-w-5xl mx-auto w-full">
      {/* Optional Top Conversation Header */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700/60 bg-navy-900/40 text-xs text-slate-400">
          <div className="truncate font-medium text-slate-300">
            {activeConversation?.title || 'Current Session'}
          </div>
          <button
            type="button"
            onClick={onClearChat}
            className="flex items-center gap-1 text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-navy-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      )}

      {/* Message Feed / Empty State */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <SuggestedPrompts onSelectPrompt={onSendMessage} />
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onUpdateContent={onUpdateMessage}
            />
          ))
        )}

        {/* AI Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block text-red-200">AI Service Notice</strong>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Input Box */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-navy-950 via-navy-950/90 to-transparent">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

