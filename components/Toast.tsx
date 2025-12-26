import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <AlertCircle className="text-rose-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        warning: <AlertCircle className="text-amber-500" size={20} />
    };

    const colors = {
        success: 'border-emerald-500/50 bg-emerald-500/5',
        error: 'border-rose-500/50 bg-rose-500/5',
        info: 'border-blue-500/50 bg-blue-500/5',
        warning: 'border-amber-500/50 bg-amber-500/5'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                    className={`fixed bottom-8 right-8 z-[100] min-w-[320px] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${colors[type]}`}
                >
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white leading-tight">
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-white"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress bar line */}
                    {duration > 0 && (
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={`absolute bottom-0 left-4 right-4 h-[2px] origin-left rounded-full ${type === 'success' ? 'bg-emerald-500' :
                                    type === 'error' ? 'bg-rose-500' :
                                        type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
