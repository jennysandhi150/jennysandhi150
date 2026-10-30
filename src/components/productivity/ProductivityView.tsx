import React, { useState } from 'react';
import {
  FileText,
  ListTodo,
  CalendarCheck,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { productivityService } from '../../services/productivityService';
import { ExtractedTask, StructuredPlan, Priority } from '../../types';

export const ProductivityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summarizer' | 'tasks' | 'planner'>('summarizer');

  // Summarizer state
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryResult, setSummaryResult] = useState<{
    summary: string;
    keyPoints: string[];
    wordCount: number;
  } | null>(null);

  // Tasks state
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Planner state
  const [planGoal, setPlanGoal] = useState('');
  const [planContext, setPlanContext] = useState('');
  const [plan, setPlan] = useState<StructuredPlan | null>(null);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Handlers
  const handleSummarize = () => {
    if (!summaryInput.trim()) return;
    const res = productivityService.summarizeText(summaryInput);
    setSummaryResult(res);
  };

  const handleExtractTasks = () => {
    if (!taskInput.trim()) return;
    const res = productivityService.extractTasks(taskInput);
    setTasks(res);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const added: ExtractedTask = {
      id: 'task_' + Date.now(),
      text: newTaskText.trim(),
      completed: false,
      priority: 'medium',
    };
    setTasks((prev) => [added, ...prev]);
    setNewTaskText('');
  };

  const handleBuildPlan = () => {
    if (!planGoal.trim()) return;
    const built = productivityService.createStructuredPlan(planGoal, planContext);
    setPlan(built);
  };

  const togglePlanStep = (id: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      steps: plan.steps.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    });
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Workbench Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Productivity Engine</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Productivity Workbench
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Distill content into executive summaries, generate actionable checklists, and author phased project plans.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1 mb-6 bg-navy-850 border border-navy-700/80 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('summarizer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'summarizer'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-navy-750'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Text Summarizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-navy-750'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Actionable Task Extractor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'planner'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-navy-750'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Structured Plan Builder</span>
        </button>
      </div>

      {/* 1. TEXT SUMMARIZER TAB */}
      {activeTab === 'summarizer' && (
        <div className="space-y-6">
          <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm">
            <label
              htmlFor="summary-input"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Paste or type text to summarize:
            </label>
            <textarea
              id="summary-input"
              rows={6}
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="Paste article text, meeting transcripts, design specifications, or long emails here..."
              className="w-full p-3.5 bg-navy-900 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus-ring resize-y"
            />
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>{summaryInput.trim().split(/\s+/).filter(Boolean).length} words</span>
              <button
                type="button"
                onClick={handleSummarize}
                disabled={!summaryInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-navy-700 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-sm transition-all focus-ring"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Summary</span>
              </button>
            </div>
          </div>

          {summaryResult && (
            <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-700">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>Executive Takeaway</span>
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `${summaryResult.summary}\n\nKey Points:\n${summaryResult.keyPoints
                        .map((p) => `- ${p}`)
                        .join('\n')}`,
                      'summary'
                    )
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-navy-750 hover:bg-navy-700 border border-navy-600 rounded-lg transition-colors"
                >
                  {copiedKey === 'summary' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-navy-900/60 rounded-xl border border-navy-750 text-slate-200 text-sm leading-relaxed">
                {summaryResult.summary}
              </div>

              {summaryResult.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                    Core Key Points
                  </h4>
                  <ul className="space-y-2">
                    {summaryResult.keyPoints.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-navy-900/40 border border-navy-750/70 text-sm text-slate-200"
                      >
                        <span className="text-violet-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. TASK EXTRACTOR TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm">
            <label
              htmlFor="task-input"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              Enter notes, goals, or instructions to extract tasks:
            </label>
            <textarea
              id="task-input"
              rows={4}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Need to review the pull request, fix the navigation bug ASAP, write unit tests for the auth service, and deploy to staging."
              className="w-full p-3.5 bg-navy-900 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus-ring resize-y"
            />
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={handleExtractTasks}
                disabled={!taskInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-navy-700 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-sm transition-all focus-ring"
              >
                <ListTodo className="w-4 h-4" />
                <span>Extract Actionable Tasks</span>
              </button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-700">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Actionable Checklist</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-900/50 text-violet-300 font-medium">
                    {tasks.filter((t) => t.completed).length} / {tasks.length} Done
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(productivityService.formatTasksAsMarkdown(tasks), 'tasks')
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-navy-750 hover:bg-navy-700 border border-navy-600 rounded-lg transition-colors"
                >
                  {copiedKey === 'tasks' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* Task list items */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      task.completed
                        ? 'bg-navy-900/30 border-navy-800 text-slate-500'
                        : 'bg-navy-900/70 border-navy-750 text-slate-100 hover:border-navy-600'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded border-slate-600 text-violet-600 bg-navy-800 focus:ring-violet-500 cursor-pointer"
                      />
                      <span
                        className={`text-sm select-none ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.text}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityBadgeClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Delete task"
                        className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-navy-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add Custom Task Form */}
              <form onSubmit={handleAddNewTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add another task item..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-navy-900 border border-navy-750 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus-ring"
                />
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-navy-750 hover:bg-navy-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold border border-navy-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. STRUCTURED PLAN BUILDER TAB */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm space-y-4">
            <div>
              <label htmlFor="goal-input" className="block text-sm font-semibold text-slate-200 mb-1">
                Primary Goal or Milestone:
              </label>
              <input
                id="goal-input"
                type="text"
                value={planGoal}
                onChange={(e) => setPlanGoal(e.target.value)}
                placeholder="e.g. Launch a new portfolio website with dark theme"
                className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus-ring"
              />
            </div>

            <div>
              <label htmlFor="context-input" className="block text-sm font-semibold text-slate-200 mb-1">
                Context & Requirements (Optional):
              </label>
              <textarea
                id="context-input"
                rows={3}
                value={planContext}
                onChange={(e) => setPlanContext(e.target.value)}
                placeholder="Include tech stack preferences, team size, timeline restrictions, or specific deliverables..."
                className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus-ring resize-y"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleBuildPlan}
                disabled={!planGoal.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-navy-700 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-sm transition-all focus-ring"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Generate Structured Plan</span>
              </button>
            </div>
          </div>

          {plan && (
            <div className="p-5 bg-navy-850 border border-navy-700 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-700">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.goal}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.overview}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(productivityService.formatPlanAsMarkdown(plan), 'plan')
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-navy-750 hover:bg-navy-700 border border-navy-600 rounded-lg transition-colors shrink-0"
                >
                  {copiedKey === 'plan' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Steps Roadmap */}
              <div className="space-y-3">
                {plan.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      step.completed
                        ? 'bg-navy-900/30 border-navy-800'
                        : 'bg-navy-900/70 border-navy-750 hover:border-violet-600/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={() => togglePlanStep(step.id)}
                          className="mt-1 w-4 h-4 rounded border-slate-600 text-violet-600 bg-navy-800 focus:ring-violet-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-400">Step {idx + 1}</span>
                            <h4
                              className={`text-sm font-semibold ${
                                step.completed ? 'line-through text-slate-500' : 'text-slate-100'
                              }`}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              step.completed ? 'text-slate-500' : 'text-slate-300'
                            }`}
                          >
                            {step.description}
                          </p>
                          {step.estimatedTime && (
                            <div className="mt-2 text-[11px] text-slate-500">
                              Estimated Time: {step.estimatedTime}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${getPriorityBadgeClass(
                          step.priority
                        )}`}
                      >
                        {step.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

