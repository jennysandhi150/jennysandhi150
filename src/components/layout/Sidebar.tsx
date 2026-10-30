import React from 'react';
import {
  MessageSquare,
  Sparkles,
  History,
  Settings,
  X,
  FileText,
  ListTodo,
  CalendarCheck,
} from 'lucide-react';
import { AppView } from '../../types';

interface SidebarProps {
  currentView: AppView;
  isOpen: boolean;
  savedCount: number;
  onSelectView: (view: AppView) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  isOpen,
  savedCount,
  onSelectView,
  onClose,
}) => {
  const navItems = [
    {
      id: 'chat' as AppView,
      label: 'AI Chat Assistant',
      description: 'Conversational assistant & prompts',
      icon: MessageSquare,
    },
    {
      id: 'productivity' as AppView,
      label: 'Productivity Workbench',
      description: 'Summaries, task lists & roadmaps',
      icon: Sparkles,
      badge: 'Tools',
    },
    {
      id: 'history' as AppView,
      label: 'Saved Conversations',
      description: 'Revisit & manage past chats',
      icon: History,
      counter: savedCount,
    },
    {
      id: 'settings' as AppView,
      label: 'Settings',
      description: 'Mode toggle & API guide',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-navy-850 border-r border-navy-700/80 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding (Mobile only) */}
        <div className="flex items-center justify-between p-4 border-b border-navy-700/80 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">MindMate AI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-navy-750 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'
                    }`}
                  />
                  <div>
                    <div className="text-sm">{item.label}</div>
                    <div
                      className={`text-xs ${
                        isActive ? 'text-violet-200' : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.counter !== undefined && item.counter > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-navy-700 text-slate-300'
                    }`}
                  >
                    {item.counter}
                  </span>
                )}

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded ${
                      isActive ? 'bg-violet-800 text-white' : 'bg-violet-500/20 text-violet-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Productivity Shortcuts Section */}
          <div className="pt-6 px-3">
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
              Capabilities
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-navy-800/60 border border-navy-700/50">
                <FileText className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>Executive Summaries</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-navy-800/60 border border-navy-700/50">
                <ListTodo className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>Checklist Task Extraction</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-navy-800/60 border border-navy-700/50">
                <CalendarCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>Structured Milestone Plans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & Local Disclosure */}
        <div className="p-3.5 border-t border-navy-700/80 bg-navy-900/40 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-300">Storage Scope</span>
            <span className="px-1.5 py-0.5 rounded bg-navy-750 text-slate-400 text-[10px]">
              Local Browser
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Conversations are stored locally and are not synced across devices.
          </p>
        </div>
      </aside>
    </>
  );
};

