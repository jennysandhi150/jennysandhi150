import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-800/80 border border-navy-700 animate-pulse">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/30 text-violet-400 shrink-0">
        <Sparkles className="w-4 h-4 animate-spin text-violet-400" />
      </div>
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-violet-500/20 rounded w-28"></div>
          <div className="h-3 bg-navy-700 rounded w-16"></div>
        </div>
        <div className="h-3 bg-navy-700/80 rounded w-5/6"></div>
        <div className="h-3 bg-navy-700/60 rounded w-3/4"></div>
        <div className="h-3 bg-navy-700/40 rounded w-1/2"></div>
      </div>
    </div>
  );
};

