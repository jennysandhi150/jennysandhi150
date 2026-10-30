import React from 'react';
import { Sparkles, Menu, Plus, ShieldCheck, Zap } from 'lucide-react';
import { AppView } from '../../types';

interface HeaderProps {
  currentView: AppView;
  isDemoMode: boolean;
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  isDemoMode,
  onNewChat,
  onToggleSidebar,
}) => {
  const getTitle = () => {
    switch (currentView) {
      case 'chat':
        return 'AI Assistant';
      case 'productivity':
        return 'Productivity Workbench';
      case 'history':
        return 'Saved Conversations';
      case 'settings':
        return 'Settings & Configuration';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between min-h-[4rem] px-4 md:px-6 bg-navy-900/95 backdrop-blur border-b border-navy-700/80 shadow-md safe-top">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 text-slate-400 hover:text-white bg-navy-800/80 hover:bg-navy-750 border border-navy-700 rounded-lg md:hidden transition-colors focus-ring"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-violet-400 text-white shadow-lg shadow-violet-600/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              MindMate <span className="text-violet-400">AI</span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-400 font-medium">
              {getTitle()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Status Badge */}
        <div
          title={
            isDemoMode
              ? 'Demo mode active: Realistic AI responses generated locally'
              : 'Live API mode enabled'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
            isDemoMode
              ? 'bg-violet-950/60 text-violet-300 border-violet-800/60'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
          }`}
        >
          {isDemoMode ? (
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden xs:inline">
            {isDemoMode ? 'Demo Mode Active' : 'Live API Mode'}
          </span>
          <span className="xs:hidden">{isDemoMode ? 'Demo' : 'Live'}</span>
        </div>

        {/* Quick New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-sm hover:shadow-violet-600/25 transition-all focus-ring active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>
    </header>
  );
};

