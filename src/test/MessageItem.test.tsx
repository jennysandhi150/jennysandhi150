import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageItem } from '../components/chat/MessageItem';
import { Message } from '../types';

describe('MessageItem Component - Interactive Checklist Checkboxes', () => {
  it('renders real HTML checkboxes with associated labels for markdown checklists', () => {
    const message: Message = {
      id: 'msg_checklist',
      role: 'assistant',
      content: `### Task Breakdown
- [ ] First task to complete
- [x] Second task already done`,
      timestamp: new Date().toISOString(),
    };

    render(<MessageItem message={message} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();

    // Check associated labels and styling
    const firstLabel = screen.getByText('First task to complete');
    const secondLabel = screen.getByText('Second task already done');

    expect(firstLabel).toBeInTheDocument();
    expect(secondLabel).toHaveClass('line-through');
  });

  it('triggers onUpdateContent with toggled line when clicking an unchecked checkbox', () => {
    const onUpdateMock = vi.fn();
    const message: Message = {
      id: 'msg_checklist_toggle',
      role: 'assistant',
      content: `### Tasks
- [ ] Task Alpha
- [ ] Task Beta`,
      timestamp: new Date().toISOString(),
    };

    render(<MessageItem message={message} onUpdateContent={onUpdateMock} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const [msgId, updatedContent] = onUpdateMock.mock.calls[0];
    expect(msgId).toBe('msg_checklist_toggle');
    expect(updatedContent).toContain('- [x] Task Alpha');
    expect(updatedContent).toContain('- [ ] Task Beta');
  });

  it('unchecks a checked checkbox when clicked again', () => {
    const onUpdateMock = vi.fn();
    const message: Message = {
      id: 'msg_checklist_uncheck',
      role: 'assistant',
      content: `### Tasks
- [x] Task Alpha
- [ ] Task Beta`,
      timestamp: new Date().toISOString(),
    };

    render(<MessageItem message={message} onUpdateContent={onUpdateMock} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const [, updatedContent] = onUpdateMock.mock.calls[0];
    expect(updatedContent).toContain('- [ ] Task Alpha');
    expect(updatedContent).toContain('- [ ] Task Beta');
  });

  it('ensures checking one item does not affect another item', () => {
    const onUpdateMock = vi.fn();
    const message: Message = {
      id: 'msg_checklist_isolation',
      role: 'assistant',
      content: `### Multi-step Plan
- [ ] Step 1: Initialize
- [ ] Step 2: Implement
- [ ] Step 3: Verify`,
      timestamp: new Date().toISOString(),
    };

    render(<MessageItem message={message} onUpdateContent={onUpdateMock} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click Step 2

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const [, updatedContent] = onUpdateMock.mock.calls[0];
    expect(updatedContent).toContain('- [ ] Step 1: Initialize');
    expect(updatedContent).toContain('- [x] Step 2: Implement');
    expect(updatedContent).toContain('- [ ] Step 3: Verify');
  });
});

