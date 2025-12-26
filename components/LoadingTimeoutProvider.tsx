import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoadingTimeoutPopup } from './LoadingTimeoutPopup';
import { useLoadingTimeout } from '../hooks/useLoadingTimeout';

interface LoadingTimeoutContextType {
    setIsLoading: (loading: boolean) => void;
    reportLoadingComplete: () => void;
    logs: string[];
}

const LoadingTimeoutContext = createContext<LoadingTimeoutContextType | undefined>(undefined);

export const LoadingTimeoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeLoadingCount, setActiveLoadingCount] = useState(0);
    const [internalLoading, setInternalLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Effectively track if anything is loading
    useEffect(() => {
        setInternalLoading(activeLoadingCount > 0);
    }, [activeLoadingCount]);

    // Intercept console logs
    useEffect(() => {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const addLog = (type: string, args: any[]) => {
            const time = new Date().toLocaleTimeString();
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
            setLogs(prev => [...prev.slice(-49), `[${time}] ${type}: ${message}`]); // Keep last 50 logs
        };

        console.log = (...args) => {
            addLog('LOG', args);
            originalLog.apply(console, args);
        };
        console.error = (...args) => {
            addLog('ERROR', args);
            originalError.apply(console, args);
        };
        console.warn = (...args) => {
            addLog('WARN', args);
            originalWarn.apply(console, args);
        };

        return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    const { isVisible, countdown, startCountdown, reset, showOptions } = useLoadingTimeout(internalLoading);

    const setIsLoading = (loading: boolean) => {
        if (loading) {
            setActiveLoadingCount(prev => prev + 1);
        } else {
            setActiveLoadingCount(prev => Math.max(0, prev - 1));
        }
    };

    const reportLoadingComplete = () => {
        setActiveLoadingCount(0);
        reset();
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <LoadingTimeoutContext.Provider value={{
            setIsLoading,
            reportLoadingComplete,
            logs
        }}
        >
            {children}
            <LoadingTimeoutPopup
                isVisible={isVisible}
                countdown={countdown}
                onRefresh={handleRefresh}
                onWait={startCountdown}
                showOptions={showOptions}
                logs={logs}
            />
        </LoadingTimeoutContext.Provider>
    );
};

export const useLoadingStatus = () => {
    const context = useContext(LoadingTimeoutContext);
    if (!context) {
        throw new Error('useLoadingStatus must be used within a LoadingTimeoutProvider');
    }
    return context;
};
