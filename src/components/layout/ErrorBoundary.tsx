import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MindMate Uncaught Error:', error, errorInfo);
  }

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-navy-950 text-slate-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-950/50">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            MindMate encountered an unexpected error during display. You can reload the app or reset local data to recover.
          </p>
          {this.state.error && (
            <div className="max-w-md w-full p-3 bg-navy-900 border border-navy-800 rounded-xl text-left text-[11px] text-red-300 font-mono mb-6 overflow-x-auto">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload App</span>
            </button>
            <button
              type="button"
              onClick={this.handleResetStorage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-800 hover:bg-navy-750 border border-navy-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Data</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
