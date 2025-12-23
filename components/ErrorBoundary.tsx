import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

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
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-white font-sans">
                    <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                            <AlertCircle size={40} className="text-rose-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold">Terjadi Kesalahan</h1>
                            <p className="text-gray-400 text-sm">
                                Aplikasi mengalami masalah tak terduga. Kami telah mencatat masalah ini.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl text-left">
                                <p className="text-xs font-mono text-rose-300 break-words">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-white text-black py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                            >
                                <RefreshCw size={18} /> Coba Lagi
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full bg-white/5 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/5"
                            >
                                <Home size={18} /> Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
