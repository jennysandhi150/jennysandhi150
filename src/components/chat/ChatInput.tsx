import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Ask MindMate anything or request a summary, task list, or plan...',
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col p-2 bg-navy-850 border border-navy-700 rounded-2xl shadow-lg focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        aria-label="Message input"
        className="w-full px-3 py-2 bg-transparent text-slate-100 placeholder-slate-500 resize-none text-sm focus:outline-none min-h-[44px] max-h-[180px]"
      />

      <div className="flex items-center justify-between pt-2 px-2 border-t border-navy-750 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-[10px] text-slate-400 font-mono">
            Enter ↵
          </kbd>
          <span className="hidden sm:inline">to send,</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-[10px] text-slate-400 font-mono">
            Shift + Enter
          </kbd>
          <span className="hidden sm:inline">for newline</span>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:bg-navy-700 disabled:text-slate-500 rounded-lg transition-all focus-ring active:scale-95 shadow-sm"
        >
          <span>Send</span>
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </form>
  );
};

