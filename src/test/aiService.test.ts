import { describe, it, expect, beforeEach } from 'vitest';
import { aiService, SUGGESTED_PROMPTS } from '../services/aiService';

describe('aiService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('suggested prompts array contains starter prompts', () => {
    expect(SUGGESTED_PROMPTS.length).toBeGreaterThan(0);
    expect(SUGGESTED_PROMPTS[0].category).toBeDefined();
    expect(SUGGESTED_PROMPTS[0].prompt).toBeDefined();
  });

  it('generates demo response for summarization queries', async () => {
    aiService.setDemoMode(true);
    const res = await aiService.generateResponse('Summarize this meeting for me');
    expect(res.isDemo).toBe(true);
    expect(res.error).toBeUndefined();
    expect(res.text).toContain('Summary');
  });

  it('generates demo response for task checklist requests', async () => {
    aiService.setDemoMode(true);
    const res = await aiService.generateResponse('Create a task checklist for launch');
    expect(res.isDemo).toBe(true);
    expect(res.text).toContain('Checklist');
  });

  it('returns setup error when in API mode without credentials', async () => {
    aiService.setDemoMode(false);
    const res = await aiService.generateResponse('Hello');
    expect(res.isDemo).toBe(false);
    expect(res.error).toContain('API Mode is enabled');
    expect(res.text).toBe('');
  });
});

