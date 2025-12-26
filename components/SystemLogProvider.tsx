import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LogContainer, LogEntry } from './CreationStudio/ControlCenter/LogContainer';
import { useLocation } from 'react-router-dom';

interface SystemLogContextType {
    logs: LogEntry[];
    addLog: (message: string, type?: LogEntry['type']) => void;
    clearLogs: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

export const SystemLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();

    // Check if we are on a mobile path/device (simplified, can be improved)
    const isMobile = window.innerWidth < 768;

    const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            type,
            message
        };
        setLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50
        setIsOpen(true);
        setIsVisible(true);
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    const handleVanish = () => {
        setIsVisible(false);
        setIsOpen(false);
    };

    return (
        <SystemLogContext.Provider value={{
            logs,
            addLog,
            clearLogs,
            isOpen,
            setIsOpen,
            isVisible,
            setIsVisible
        }}>
            {children}
            {isVisible && logs.length > 0 && (
                <LogContainer
                    logs={logs}
                    isOpen={isOpen}
                    onToggle={() => setIsOpen(!isOpen)}
                    onClear={clearLogs}
                    isMobile={isMobile}
                    onVanish={handleVanish}
                />
            )}
        </SystemLogContext.Provider>
    );
};

export const useSystemLog = () => {
    const context = useContext(SystemLogContext);
    if (!context) {
        throw new Error('useSystemLog must be used within a SystemLogProvider');
    }
    return context;
};
