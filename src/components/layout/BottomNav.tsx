import React from 'react';
import { MessageSquare, Sparkles, History, Settings } from 'lucide-react';
import { AppView } from '../../types';

interface BottomNavProps {
  currentView: AppView;
  savedCount: number;
  onSelectView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  savedCount,
  onSelectView,
}) => {
  const items = [
    {
      id: 'chat' as AppView,
      label: 'Assistant',
      icon: MessageSquare,
    },
    {
      id: 'productivity' as AppView,
      label: 'Tools',
      icon: Sparkles,
    },
    {
      id: 'history' as AppView,
      label: 'History',
      icon: History,
      counter: savedCount,
    },
    {
      id: 'settings' as AppView,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden sticky bottom-0 z-40 bg-navy-900/95 backdrop-blur border-t border-navy-700/80 px-2 py-1 safe-bottom shadow-lg"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-violet-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-violet-400' : 'text-slate-400'
                  }`}
                />
                {item.counter !== undefined && item.counter > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-violet-600 text-white">
                    {item.counter}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 leading-none">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

