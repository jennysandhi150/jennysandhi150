import { Conversation, Message } from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'mindmate_conversations_v1',
  ACTIVE_ID: 'mindmate_active_convo_v1',
};

export const storageService = {
  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to read conversations from localStorage', err);
      return [];
    }
  },

  getConversationById(id: string): Conversation | null {
    const list = this.getConversations();
    return list.find((c) => c.id === id) || null;
  },

  saveConversation(convo: Conversation): void {
    try {
      const list = this.getConversations();
      const existingIndex = list.findIndex((c) => c.id === convo.id);
      let updated: Conversation[];

      const toSave: Conversation = {
        ...convo,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        updated = [...list];
        updated[existingIndex] = toSave;
      } else {
        updated = [toSave, ...list];
      }

      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save conversation to localStorage', err);
    }
  },

  deleteConversation(id: string): boolean {
    try {
      const list = this.getConversations();
      const filtered = list.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));

      if (this.getActiveConversationId() === id) {
        this.setActiveConversationId(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete conversation', err);
      return false;
    }
  },

  clearAllConversations(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    } catch (err) {
      console.error('Failed to clear conversations', err);
    }
  },

  getActiveConversationId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    } catch {
      return null;
    }
  },

  setActiveConversationId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      }
    } catch (err) {
      console.error('Failed to set active conversation ID', err);
    }
  },

  createEmptyConversation(initialTitle = 'New Conversation'): Conversation {
    const newConvo: Conversation = {
      id: 'convo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: initialTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    return newConvo;
  },

  appendMessage(convoId: string, message: Message): Conversation | null {
    let convo = this.getConversationById(convoId);
    if (!convo) {
      convo = this.createEmptyConversation('Productivity Session');
      convo.id = convoId;
    }

    // Auto-derive title from first user message if default
    if (convo.messages.length === 0 && message.role === 'user') {
      const rawText = message.content.trim();
      const shortTitle = rawText.length > 35 ? rawText.slice(0, 35) + '...' : rawText;
      convo.title = shortTitle || 'New Conversation';
    }

    convo.messages.push(message);
    this.saveConversation(convo);
    return convo;
  },
};

