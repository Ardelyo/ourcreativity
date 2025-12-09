import React from 'react';

interface PyodideSandboxProps {
    code: string;
    triggerRun: number;
    onOutput: (output: string) => void;
    onError: (error: string) => void;
}

/**
 * PyodideSandbox - Placeholder component
 * 
 * Python execution via Pyodide is temporarily disabled due to CDN loading
 * conflicts with the Vite development server. This component now acts as
 * a placeholder that informs users about the limitation.
 * 
 * For full Python support, consider:
 * - Using a backend service (e.g., Supabase Edge Function with Deno)
 * - Or deploying Pyodide assets locally
 */
export const PyodideSandbox: React.FC<PyodideSandboxProps> = ({ code, triggerRun, onOutput, onError }) => {
    React.useEffect(() => {
        if (triggerRun > 0 && code) {
            onError("Python execution is currently unavailable. Please use HTML/JS mode.");
        }
    }, [triggerRun, code, onError]);

    return null; // Invisible component
};
