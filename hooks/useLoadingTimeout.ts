import { useState, useEffect, useCallback, useRef } from 'react';

export const useLoadingTimeout = (isLoading: boolean) => {
    const [isVisible, setIsVisible] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initial 10s delay to show the popup
    useEffect(() => {
        if (isLoading && !isVisible && countdown === null) {
            timeoutRef.current = setTimeout(() => {
                setIsVisible(true);
                setShowOptions(true); // Show options immediately
            }, 10000); // 10 seconds
        } else if (!isLoading) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsVisible(false);
            setCountdown(null);
            setShowOptions(false);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isLoading, isVisible, countdown]);

    const startCountdown = useCallback(() => {
        setIsVisible(true);
        setCountdown(30);
        setShowOptions(false); // Hide options during countdown

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev !== null && prev > 1) {
                    return prev - 1;
                } else {
                    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                    setShowOptions(true); // Re-show options when countdown ends
                    return null; // Stop countdown
                }
            });
        }, 1000);
    }, []);

    const reset = useCallback(() => {
        setIsVisible(false);
        setCountdown(null);
        setShowOptions(false);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return {
        isVisible,
        countdown,
        showOptions,
        startCountdown,
        reset
    };
};
