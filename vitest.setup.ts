import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement Element.prototype.scrollIntoView
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}
