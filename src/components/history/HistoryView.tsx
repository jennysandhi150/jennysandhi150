import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Trash2,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Conversation } from '../../types';
import { ConfirmationModal } from '../layout/ConfirmationModal';

interface HistoryViewProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onNewChat: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onDeleteConversation,
  onClearAll,
  onNewChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const confirmDeleteSingle = () => {
    if (deleteTargetId) {
      onDeleteConversation(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Local Archive</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Saved Conversations
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Revisit past sessions or clear previous chats from your local browser store.
          </p>
        </div>

        {conversations.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearAllModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 rounded-xl transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {conversations.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved conversations by title or message content..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy-850 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus-ring"
          />
        </div>
      )}

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="p-8 md:p-12 text-center bg-navy-850 border border-navy-700/80 rounded-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Saved Conversations Yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Conversations you have with MindMate are automatically saved here so you can revisit them anytime.
          </p>
          <button
            type="button"
            onClick={onNewChat}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all focus-ring"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a New Chat</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-navy-850 border border-navy-700 rounded-2xl text-slate-400 text-sm">
          No conversations match "{searchTerm}". Try a different keyword.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((convo) => {
            const isCurrent = convo.id === activeId;
            const lastMsg = convo.messages[convo.messages.length - 1];

            return (
              <div
                key={convo.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-navy-800 border-violet-500/60 shadow-md shadow-violet-900/10'
                    : 'bg-navy-850 border-navy-700/80 hover:border-navy-600'
                }`}
              >
                <div
                  onClick={() => onSelectConversation(convo.id)}
                  className="cursor-pointer flex-1 pr-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100 hover:text-violet-300 transition-colors">
                      {convo.title}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600/30 text-violet-300 border border-violet-500/40">
                        Active
                      </span>
                    )}
                  </div>

                  {lastMsg && (
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 leading-relaxed">
                      {lastMsg.content}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(convo.updatedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{convo.messages.length} messages</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-navy-750">
                  <button
                    type="button"
                    onClick={() => onSelectConversation(convo.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-300 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-800/50 rounded-lg transition-colors"
                  >
                    <span>Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(convo.id)}
                    aria-label="Delete conversation"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-navy-750 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Single Conversation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Delete Conversation"
        message="Are you sure you want to permanently delete this saved conversation? This action cannot be reversed."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDeleteSingle}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Clear All Modal */}
      <ConfirmationModal
        isOpen={showClearAllModal}
        title="Clear All Conversations"
        message="Are you sure you want to clear your entire local conversation history? All saved sessions will be permanently removed."
        confirmText="Clear All History"
        isDestructive={true}
        onConfirm={() => {
          onClearAll();
          setShowClearAllModal(false);
        }}
        onCancel={() => setShowClearAllModal(false)}
      />
    </div>
  );
};

