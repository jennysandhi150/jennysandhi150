export interface AIResponse {
  text: string;
  isDemo: boolean;
  error?: string;
}

export const SUGGESTED_PROMPTS = [
  {
    category: 'Summarization',
    label: 'Summarize Product Specs',
    prompt: 'Summarize the core features, architectural constraints, and deliverables of our project into clear executive bullet points.',
  },
  {
    category: 'Task Planning',
    label: 'Release Checklist',
    prompt: 'Create a prioritized checklist of actionable tasks required before shipping a software release to production.',
  },
  {
    category: 'Brainstorming',
    label: 'Focus Habits',
    prompt: 'Brainstorm 5 scientifically proven habits to optimize deep focus sessions and minimize cognitive fatigue.',
  },
  {
    category: 'Structured Plan',
    label: '30-Day Goal Plan',
    prompt: 'Design a structured 4-phase milestone plan with timeline estimates and priorities to master full-stack TypeScript development.',
  },
];

export const aiService = {
  isDemoMode(): boolean {
    const override = localStorage.getItem('mindmate_mode_override');
    if (override) return override === 'demo';
    return true; // Default to demo mode until API is configured
  },

  setDemoMode(isDemo: boolean): void {
    localStorage.setItem('mindmate_mode_override', isDemo ? 'demo' : 'api');
  },

  async generateResponse(userPrompt: string): Promise<AIResponse> {
    const isDemo = this.isDemoMode();

    if (!isDemo) {
      // API Mode: In live mode, if server/API is not yet configured, return an honest configuration guide
      return {
        text: '',
        isDemo: false,
        error:
          'API Mode is enabled, but no AI server endpoint or GEMINI_API_KEY was detected. Please switch back to Demo Mode in Settings or configure your .env file with a valid API key.',
      };
    }

    // Demo Mode: generate realistic, high-quality productivity assistance
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = userPrompt.toLowerCase();

    if (lower.includes('summariz') || lower.includes('summary')) {
      return {
        isDemo: true,
        text: `### 📋 MindMate Summary Analysis

**Executive Takeaway**:
The input has been analyzed and distilled into core themes and essential action items.

**Key Highlights**:
- **Primary Objective**: Clarified core focus and targeted deliverables.
- **Critical Constraints**: Identified key dependencies, deadlines, and scope boundaries.
- **Actionable Takeaways**: Outlined clear execution steps to maintain momentum and team alignment.

*Tip: You can use the Productivity Tab for dedicated paragraph-to-bullet summarization.*`,
      };
    }

    if (lower.includes('task') || lower.includes('checklist') || lower.includes('todo') || lower.includes('to-do')) {
      return {
        isDemo: true,
        text: `### 🎯 Actionable Task Checklist Breakdown

Here is your prioritized checklist generated from your request:

- [ ] **[HIGH] Phase 1**: Establish clear baseline requirements and scope definition.
- [ ] **[HIGH] Phase 2**: Build and verify core functional implementation locally.
- [ ] **[MEDIUM] Phase 3**: Execute test suite and address edge cases.
- [ ] **[MEDIUM] Phase 4**: Perform accessibility, responsive, and performance checks.
- [ ] **[LOW] Phase 5**: Document user instructions and finalize deployment checklist.

*Tip: Switch to the **Productivity Workbench** to convert any custom text directly into interactive checkable tasks.*`,
      };
    }

    if (lower.includes('plan') || lower.includes('milestone') || lower.includes('strategy')) {
      return {
        isDemo: true,
        text: `### 🗺️ Structured Execution Plan

**Objective**: ${userPrompt.trim().slice(0, 60)}...

1. **Step 1: Preparation & Scoping** *(Priority: High | Est: 1-2h)*
   - Validate requirements, identify risks, and gather necessary references.
2. **Step 2: Core Engineering** *(Priority: High | Est: 3-5h)*
   - Implement functional logic with modular components and clean data models.
3. **Step 3: Verification & Polish** *(Priority: Medium | Est: 2h)*
   - Run unit tests, verify dark mode contrasts, and test mobile responsiveness.
4. **Step 4: Launch & Review** *(Priority: Low | Est: 1h)*
   - Prepare documentation, review diffs, and collect feedback.`,
      };
    }

    if (lower.includes('brainstorm') || lower.includes('ideas') || lower.includes('creative')) {
      return {
        isDemo: true,
        text: `### 💡 Brainstorming Results

Here are strategic ideas tailored to your prompt:

1. **Context-Aware Micro-Checklists**: Dynamically convert conversation fragments into auto-prioritized to-dos.
2. **Pomodoro Synchronization**: Integrate a subtle timer overlay that syncs tasks with 25-minute focus sprints.
3. **Smart Focus Mode**: Dim secondary UI elements during intensive reading and writing sessions.
4. **Markdown Export & Sync**: One-click export to GitHub issues, Notion, or Obsidian markdown notes.
5. **Interactive Diff Assistant**: Auto-generate readable change summaries for development commits.`,
      };
    }

    // Default productivity response
    return {
      isDemo: true,
      text: `Hello! I am **MindMate AI**, your personal productivity assistant.

I can help you:
- **Summarize complex texts & reports**: Extract core insights and key bullet points.
- **Generate actionable task lists**: Turn meeting notes or project briefs into prioritized checklists.
- **Formulate structured step-by-step plans**: Break down ambitious goals into manageable milestones.
- **Brainstorm creative solutions**: Spark actionable ideas for writing, engineering, and organization.

Try one of the suggested prompt chips above, or ask me any question!`,
    };
  },
};

