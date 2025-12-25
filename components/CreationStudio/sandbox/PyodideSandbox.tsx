import React from 'react';

interface PyodideSandboxProps {
    code: string;
    triggerRun: number;
    onOutput: (output: string) => void;
    onError: (error: string) => void;
}

/**
 * PyodideSandbox - Komponen placeholder aja
 * 
 * Eksekusi Python lewat Pyodide lagi dimatiin dulu gara-gara ada konflik
 * CDN pas lagi di mode development Vite. Komponen ini cuma ditaro
 * buat ngasih tau user soal batasan ini.
 * 
 * Kalo pengen support Python beneran, pertimbangin:
 * - Pake service backend (misal: Supabase Edge Function pake Deno)
 * - Atau naro file Pyodide di lokal
 */
export const PyodideSandbox: React.FC<PyodideSandboxProps> = ({ code, triggerRun, onOutput, onError }) => {
    React.useEffect(() => {
        if (triggerRun > 0 && code) {
            onError("Eksekusi Python lagi gak bisa dipake. Pake mode HTML/JS aja ya.");
        }
    }, [triggerRun, code, onError]);

    return null; // Komponen gak keliatan
};
