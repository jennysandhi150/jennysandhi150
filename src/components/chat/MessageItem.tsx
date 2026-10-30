import React, { useState } from 'react';
import { Copy, Check, User, Sparkles } from 'lucide-react';
import { Message } from '../../types';

interface MessageItemProps {
  message: Message;
  onUpdateContent?: (messageId: string, newContent: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onUpdateContent }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const toggleCheckbox = (lineIndex: number) => {
    const lines = message.content.split('\n');
    const targetLine = lines[lineIndex];
    if (!targetLine) return;

    if (targetLine.match(/^-\s*\[\s*\]/)) {
      lines[lineIndex] = targetLine.replace(/^-\s*\[\s*\]/, '- [x]');
    } else if (targetLine.match(/^-\s*\[[xX]\]/)) {
      lines[lineIndex] = targetLine.replace(/^-\s*\[[xX]\]/, '- [ ]');
    }

    const newContent = lines.join('\n');
    if (onUpdateContent) {
      onUpdateContent(message.id, newContent);
    }
  };

  // Basic markdown parser for headings, lists, bold text, checkboxes
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-violet-300 mt-3 mb-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-violet-200 mt-3 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }

      // Checkboxes (- [ ] or - [x])
      if (line.match(/^-\s*\[([ xX])\]/)) {
        const isChecked = line.includes('[x]') || line.includes('[X]');
        const textPart = line.replace(/^-\s*\[([ xX])\]\s*/, '');
        const inputId = `chk-${message.id}-${idx}`;

        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 text-slate-200 group/task">
            <input
              type="checkbox"
              id={inputId}
              checked={isChecked}
              onChange={() => toggleCheckbox(idx)}
              aria-label={`Mark task as ${isChecked ? 'incomplete' : 'complete'}`}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-violet-600 bg-navy-900/80 focus:ring-2 focus:ring-violet-500 cursor-pointer accent-violet-600"
            />
            <label
              htmlFor={inputId}
              className={`cursor-pointer select-none leading-relaxed text-sm ${
                isChecked ? 'line-through text-slate-400' : 'text-slate-200'
              }`}
            >
              {parseInlineMarkdown(textPart)}
            </label>
          </div>
        );
      }

      // Bullet items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-200 pl-1">
            <span className="text-violet-400 font-bold mt-0.5">•</span>
            <span>{parseInlineMarkdown(line.slice(2))}</span>
          </div>
        );
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+\.)\s*(.*)$/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1 text-slate-200 pl-1">
              <span className="text-violet-400 font-semibold">{match[1]}</span>
              <span>{parseInlineMarkdown(match[2])}</span>
            </div>
          );
        }
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Regular text
      return (
        <p key={idx} className="my-1 text-slate-200 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    // Basic bold **text** parser
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl transition-colors ${
        isUser
          ? 'bg-navy-800/40 border border-navy-700/60 ml-auto max-w-2xl'
          : 'bg-navy-850/90 border border-navy-700/80 mr-auto max-w-3xl'
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          isUser
            ? 'bg-slate-700/80 text-slate-200'
            : 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300">
            {isUser ? 'You' : 'MindMate AI'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy message"
              title="Copy message to clipboard"
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-navy-700 transition-colors opacity-80 group-hover:opacity-100"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="text-sm font-normal">{renderFormattedContent(message.content)}</div>
      </div>
    </div>
  );
};

