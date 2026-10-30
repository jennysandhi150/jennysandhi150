import { describe, it, expect } from 'vitest';
import { productivityService } from '../services/productivityService';

describe('productivityService', () => {
  describe('summarizeText', () => {
    it('returns empty summary when input is blank', () => {
      const res = productivityService.summarizeText('   ');
      expect(res.summary).toBe('');
      expect(res.keyPoints).toEqual([]);
      expect(res.wordCount).toBe(0);
    });

    it('extracts word count and highlights from multi-sentence input', () => {
      const text =
        'React 18 introduced automatic batching to improve rendering performance. Vite leverages esbuild for ultra fast module bundling during local development. TypeScript provides compile-time safety and self-documenting codebases.';

      const res = productivityService.summarizeText(text);
      expect(res.wordCount).toBeGreaterThan(15);
      expect(res.keyPoints.length).toBeGreaterThan(0);
      expect(res.summary).toBeDefined();
    });
  });

  describe('extractTasks', () => {
    it('returns empty list for blank text', () => {
      expect(productivityService.extractTasks('')).toEqual([]);
    });

    it('identifies high priority for urgent keywords or action verbs', () => {
      const input = `
        1. Deploy urgent security patch to production
        2. Optional: explore new color palettes later
        3. Write unit tests for storage service
      `;

      const tasks = productivityService.extractTasks(input);
      expect(tasks.length).toBe(3);
      expect(tasks[0].priority).toBe('high');
      expect(tasks[1].priority).toBe('low');
      expect(tasks[2].completed).toBe(false);
    });

    it('formats tasks into markdown checkboxes correctly', () => {
      const tasks = [
        { id: '1', text: 'Task Alpha', completed: true, priority: 'high' as const },
        { id: '2', text: 'Task Beta', completed: false, priority: 'medium' as const },
      ];
      const md = productivityService.formatTasksAsMarkdown(tasks);
      expect(md).toContain('- [x] [HIGH] Task Alpha');
      expect(md).toContain('- [ ] [MEDIUM] Task Beta');
    });
  });

  describe('createStructuredPlan', () => {
    it('generates a 5-step phased plan with goals and timeline estimates', () => {
      const plan = productivityService.createStructuredPlan(
        'Launch MindMate AI Productivity Web App'
      );
      expect(plan.goal).toBe('Launch MindMate AI Productivity Web App');
      expect(plan.steps.length).toBe(5);
      expect(plan.steps[0].title).toContain('Phase 1');
      expect(plan.steps[0].priority).toBe('high');
      expect(plan.steps[0].estimatedTime).toBeDefined();

      const md = productivityService.formatPlanAsMarkdown(plan);
      expect(md).toContain('# Structured Plan: Launch MindMate AI Productivity Web App');
      expect(md).toContain('Phase 1');
    });
  });
});

