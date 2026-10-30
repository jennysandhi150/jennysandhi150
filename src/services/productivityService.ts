import { ExtractedTask, StructuredPlan, PlanStep, Priority } from '../types';

export const productivityService = {
  /**
   * Summarizes input text into key points and actionable takeaways.
   */
  summarizeText(input: string): { summary: string; keyPoints: string[]; wordCount: number } {
    const trimmed = input.trim();
    if (!trimmed) {
      return { summary: '', keyPoints: [], wordCount: 0 };
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    const sentences = trimmed
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    // Identify key highlights
    const keyPoints: string[] = [];

    if (sentences.length <= 2) {
      keyPoints.push(`Core Concept: ${sentences[0] || trimmed}`);
      if (sentences[1]) keyPoints.push(`Supporting Detail: ${sentences[1]}`);
    } else {
      // Pick key topic sentences
      keyPoints.push(sentences[0]);
      if (sentences.length > 2) {
        keyPoints.push(sentences[Math.floor(sentences.length / 2)]);
      }
      keyPoints.push(sentences[sentences.length - 1]);
    }

    const executiveSummary =
      sentences.length > 3
        ? `This text addresses ${words.length} words covering key aspects: ${sentences[0]}`
        : trimmed;

    return {
      summary: executiveSummary,
      keyPoints: keyPoints.slice(0, 4),
      wordCount: words.length,
    };
  },

  /**
   * Converts unstructured text or prompts into an actionable task checklist with priorities.
   */
  extractTasks(input: string): ExtractedTask[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const tasks: ExtractedTask[] = [];

    const actionKeywords = /^(review|create|build|write|test|deploy|design|send|finalize|refactor|update|schedule|prepare|audit|check|verify|fix|inspect)\b/i;

    lines.forEach((line, idx) => {
      // Strip bullets, numbers, hyphens
      const cleaned = line.replace(/^(\d+[\.\)]|\*|\-|\•|\[\s*\])\s*/, '').trim();
      if (!cleaned) return;

      let priority: Priority = 'medium';
      if (/urgent|critical|asap|today|must|high/i.test(cleaned)) {
        priority = 'high';
      } else if (/optional|later|eventually|low|nice to have/i.test(cleaned)) {
        priority = 'low';
      } else if (actionKeywords.test(cleaned) || idx === 0) {
        priority = 'high';
      }

      tasks.push({
        id: 'task_' + (idx + 1) + '_' + Date.now().toString(36),
        text: cleaned,
        completed: false,
        priority,
      });
    });

    // If no distinct lines were found, split by commas or sentence boundaries
    if (tasks.length === 1 && trimmed.includes(',')) {
      const parts = trimmed.split(',').map((p) => p.trim()).filter((p) => p.length > 3);
      if (parts.length > 1) {
        return parts.map((part, i) => ({
          id: 'task_split_' + i + '_' + Date.now().toString(36),
          text: part.replace(/^(and\s+)/i, ''),
          completed: false,
          priority: i === 0 ? 'high' : 'medium',
        }));
      }
    }

    return tasks;
  },

  /**
   * Builds a structured multi-phase plan based on a high-level goal and context.
   */
  createStructuredPlan(goal: string, context?: string): StructuredPlan {
    const cleanGoal = goal.trim() || 'Achieve Project Milestone';
    const planId = 'plan_' + Date.now();

    const steps: PlanStep[] = [
      {
        id: 'step_1',
        title: 'Phase 1: Discovery & Requirements Analysis',
        description: `Define target outcomes, scope constraints, and align criteria for "${cleanGoal}".`,
        priority: 'high',
        completed: false,
        estimatedTime: '1 - 2 hours',
      },
      {
        id: 'step_2',
        title: 'Phase 2: Architecture & Foundation Setup',
        description: 'Set up components, verify dependencies, and draft the core data flow.',
        priority: 'high',
        completed: false,
        estimatedTime: '2 - 4 hours',
      },
      {
        id: 'step_3',
        title: 'Phase 3: Implementation & Core Execution',
        description: context
          ? `Implement key logic taking into account: "${context.slice(0, 80)}...".`
          : 'Develop core functional logic, refine user interactions, and handle edge cases.',
        priority: 'high',
        completed: false,
        estimatedTime: '4 - 6 hours',
      },
      {
        id: 'step_4',
        title: 'Phase 4: Testing, Verification & Quality Assurance',
        description: 'Execute unit tests, verify edge conditions, inspect styling, and validate responsive layouts.',
        priority: 'medium',
        completed: false,
        estimatedTime: '1 - 2 hours',
      },
      {
        id: 'step_5',
        title: 'Phase 5: Deployment, Review & Next Steps',
        description: 'Review final outputs, document user instructions, and prepare production handoff.',
        priority: 'low',
        completed: false,
        estimatedTime: '30 mins',
      },
    ];

    return {
      id: planId,
      goal: cleanGoal,
      overview: `A 5-phase structured plan designed to achieve "${cleanGoal}" effectively with clear milestones and prioritized actions.`,
      steps,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Formats a structured plan into clean Markdown suitable for copying.
   */
  formatPlanAsMarkdown(plan: StructuredPlan): string {
    let md = `# Structured Plan: ${plan.goal}\n\n`;
    md += `> ${plan.overview}\n\n`;
    md += `### Action Steps:\n`;
    plan.steps.forEach((step, index) => {
      const status = step.completed ? '[x]' : '[ ]';
      md += `${index + 1}. ${status} **${step.title}** (Priority: ${step.priority.toUpperCase()})\n`;
      md += `   - ${step.description}\n`;
      if (step.estimatedTime) {
        md += `   - Estimated Time: ${step.estimatedTime}\n`;
      }
    });
    return md;
  },

  /**
   * Formats tasks into Markdown checkbox format.
   */
  formatTasksAsMarkdown(tasks: ExtractedTask[]): string {
    return tasks
      .map((t) => `- [${t.completed ? 'x' : ' '}] [${t.priority.toUpperCase()}] ${t.text}`)
      .join('\n');
  },
};

