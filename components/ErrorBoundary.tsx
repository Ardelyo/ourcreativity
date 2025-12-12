import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-rose-500" size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-3">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Maaf, terjadi kesalahan saat memuat konten. Silakan coba muat ulang halaman.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 text-xs text-gray-500 bg-black/30 rounded-lg p-4 overflow-auto max-h-32">
                <summary className="cursor-pointer font-mono mb-2">Detail teknis</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={18} /> Coba Lagi
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-white/10 text-white rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
              >
                <Home size={18} /> Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
