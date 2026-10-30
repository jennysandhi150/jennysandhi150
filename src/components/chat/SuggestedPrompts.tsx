import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../../services/aiService';

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-800/60 text-violet-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Productivity Accelerator</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          How can MindMate assist you today?
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Choose a starter prompt or ask any question to brainstorm, summarize text, or build a task plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group flex flex-col justify-between p-4 rounded-xl bg-navy-800/90 hover:bg-navy-750 border border-navy-700 hover:border-violet-600/60 text-left transition-all duration-150 shadow-sm hover:shadow-violet-900/10 focus-ring"
          >
            <div>
              <span className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-violet-900/40 text-violet-300 border border-violet-700/40 mb-2">
                {item.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-violet-300 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-violet-400 group-hover:text-violet-300">
              <span>Use Prompt</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

