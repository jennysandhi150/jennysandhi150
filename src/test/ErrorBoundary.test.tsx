import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';

const BombComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Simulated crash for testing');
  }
  return <div>Normal App Content</div>;
};

describe('ErrorBoundary', () => {
  it('renders normal children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal App Content')).toBeInTheDocument();
  });

  it('catches render errors and renders fallback recovery UI', () => {
    // Suppress console.error during expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload App')).toBeInTheDocument();
    expect(screen.getByText('Reset Local Data')).toBeInTheDocument();
    expect(screen.getByText(/Simulated crash for testing/)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});

