import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storageService';
import { Message } from '../types';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates an empty conversation with unique ID', () => {
    const convo = storageService.createEmptyConversation('Project Alpha');
    expect(convo.title).toBe('Project Alpha');
    expect(convo.id).toBeDefined();
    expect(convo.messages).toEqual([]);
  });

  it('saves and retrieves conversations from localStorage', () => {
    const convo = storageService.createEmptyConversation('Test Conversation');
    storageService.saveConversation(convo);

    const retrieved = storageService.getConversations();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe(convo.id);
    expect(retrieved[0].title).toBe('Test Conversation');
  });

  it('appends messages and auto-derives title from first user message', () => {
    const convo = storageService.createEmptyConversation();
    storageService.saveConversation(convo);

    const message: Message = {
      id: 'msg_1',
      role: 'user',
      content: 'Brainstorm 5 productivity features for remote teams',
      timestamp: new Date().toISOString(),
    };

    const updated = storageService.appendMessage(convo.id, message);
    expect(updated).not.toBeNull();
    expect(updated?.messages.length).toBe(1);
    expect(updated?.title).toBe('Brainstorm 5 productivity features ...');
  });

  it('deletes conversations and resets active ID if active was deleted', () => {
    const convo1 = storageService.createEmptyConversation('First');
    const convo2 = storageService.createEmptyConversation('Second');

    storageService.saveConversation(convo1);
    storageService.saveConversation(convo2);
    storageService.setActiveConversationId(convo1.id);

    storageService.deleteConversation(convo1.id);

    const remaining = storageService.getConversations();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(convo2.id);
    expect(storageService.getActiveConversationId()).toBeNull();
  });

  it('clears all conversations', () => {
    const convo = storageService.createEmptyConversation('Temporary');
    storageService.saveConversation(convo);
    expect(storageService.getConversations().length).toBe(1);

    storageService.clearAllConversations();
    expect(storageService.getConversations()).toEqual([]);
  });
});

