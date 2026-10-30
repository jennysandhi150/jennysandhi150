import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatView } from '../components/chat/ChatView';
import { Conversation } from '../types';

describe('ChatView Component', () => {
  it('renders suggested prompts when conversation has no messages', () => {
    const emptyConvo: Conversation = {
      id: 'convo_1',
      title: 'Empty Convo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    render(
      <ChatView
        activeConversation={emptyConvo}
        isLoading={false}
        errorMessage={null}
        onSendMessage={vi.fn()}
        onClearChat={vi.fn()}
      />
    );

    expect(screen.getByText(/How can MindMate assist you today/i)).toBeInTheDocument();
  });

  it('renders messages and copy buttons when conversation has messages', () => {
    const convoWithMessages: Conversation = {
      id: 'convo_2',
      title: 'Active Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_1',
          role: 'user',
          content: 'Hello MindMate assistant',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'msg_2',
          role: 'assistant',
          content: 'Hello! How can I assist your productivity?',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    render(
      <ChatView
        activeConversation={convoWithMessages}
        isLoading={false}
        errorMessage={null}
        onSendMessage={vi.fn()}
        onClearChat={vi.fn()}
      />
    );

    expect(screen.getByText('Hello MindMate assistant')).toBeInTheDocument();
    expect(screen.getByText(/How can I assist your productivity/i)).toBeInTheDocument();
  });

  it('displays error notification when errorMessage is provided', () => {
    const { container } = render(
      <ChatView
        activeConversation={null}
        isLoading={false}
        errorMessage="API Key configuration required"
        onSendMessage={vi.fn()}
        onClearChat={vi.fn()}
      />
    );
    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('AI Service Notice');
    expect(container.textContent).toContain('API Key configuration required');
  });

  it('triggers onSendMessage when user types and submits message', () => {
    const onSendMock = vi.fn();
    render(
      <ChatView
        activeConversation={null}
        isLoading={false}
        errorMessage={null}
        onSendMessage={onSendMock}
        onClearChat={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Message input');
    fireEvent.change(input, { target: { value: 'Draft a project roadmap' } });
    fireEvent.submit(screen.getByLabelText('Send message'));

    expect(onSendMock).toHaveBeenCalledWith('Draft a project roadmap');
  });

  it('forwards onUpdateMessage when a checklist checkbox is clicked in a message', () => {
    const onUpdateMock = vi.fn();
    const convoWithChecklist: Conversation = {
      id: 'convo_checklist',
      title: 'Checklist Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_checklist_1',
          role: 'assistant',
          content: `### Release Checklist\n- [ ] Run test suite\n- [ ] Build production assets`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    render(
      <ChatView
        activeConversation={convoWithChecklist}
        isLoading={false}
        errorMessage={null}
        onSendMessage={vi.fn()}
        onClearChat={vi.fn()}
        onUpdateMessage={onUpdateMock}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);

    fireEvent.click(checkboxes[0]);
    expect(onUpdateMock).toHaveBeenCalledWith(
      'msg_checklist_1',
      expect.stringContaining('- [x] Run test suite')
    );
  });
});

