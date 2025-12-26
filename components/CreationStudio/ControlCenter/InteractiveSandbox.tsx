import React, { useEffect, useRef, useState } from 'react';
import { ConsoleMessage, CodeFile } from './types';
import { RefreshCw } from 'lucide-react';

interface InteractiveSandboxProps {
    files: CodeFile[];
    triggerRun: number;
    onConsole: (msg: ConsoleMessage) => void;
    isPaused?: boolean;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({ files, triggerRun, onConsole, isPaused = false }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(0); // paksa re-render iframe

    useEffect(() => {
        // paksa refresh iframe pas ada trigger run, kecuali lagi di-pause
        if (!isPaused) {
            setKey(prev => prev + 1);
        }
    }, [triggerRun, isPaused]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'console') {
                onConsole({
                    type: event.data.level || 'log',
                    content: event.data.args || [],
                    timestamp: Date.now()
                });
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onConsole]);

    const getIframeContent = () => {
        // Find main file with a fallback to the first file if none marked as isMain
        const mainFile = files.find(f => f.isMain) || files[0];
        if (!mainFile) return '';

        // Helper to escape </script> to prevent breaking out of the container script tag
        const escapeScript = (str: any) => {
            if (typeof str !== 'string') return '';
            return str.replace(/<\/script>/gi, '<\\/script>');
        };

        // masukin script buat nangkep log konsol
        const consoleScript = `
        <script>
            (function(){
                const oldLog = console.log;
                const oldWarn = console.warn;
                const oldError = console.error;
                const oldInfo = console.info;

                const send = (level, ...args) => {
                    try {
                        // Convert arguments to safely serializable format
                        const safeArgs = args.map(arg => {
                            if (arg === null) return 'null';
                            if (arg === undefined) return 'undefined';
                            if (typeof arg === 'function') return '[Function]';
                            if (typeof arg === 'symbol') return arg.toString();
                            
                            if (typeof arg === 'object') {
                                try {
                                    // Handle circular references
                                    const seen = new WeakSet();
                                    return JSON.stringify(arg, (key, value) => {
                                        if (typeof value === 'object' && value !== null) {
                                            if (seen.has(value)) return '[Circular]';
                                            seen.add(value);
                                        }
                                        return value;
                                    });
                                } catch (e) {
                                    return '[Object: ' + (arg.constructor?.name || 'Unknown') + ']';
                                }
                            }
                            return String(arg);
                        });

                        window.parent.postMessage({
                            type: 'console',
                            level: level,
                            args: safeArgs
                        }, '*');
                    } catch (e) {
                        // Silently fail if postMessage doesn't work
                    }
                };

                console.log = (...args) => {
                    oldLog.apply(console, args);
                    send('log', ...args);
                };
                console.warn = (...args) => {
                    oldWarn.apply(console, args);
                    send('warn', ...args);
                };
                console.error = (...args) => {
                    oldError.apply(console, args);
                    send('error', ...args);
                };
                console.info = (...args) => {
                    oldInfo.apply(console, args);
                    send('info', ...args);
                };

                window.onerror = function(msg, url, line, col, error) {
                    send('error', 'Uncaught Error: ' + msg + ' (Line: ' + line + ')');
                    return false; // Let default handler run too
                };

                window.onunhandledrejection = function(event) {
                    send('error', 'Unhandled Promise Rejection: ' + (event.reason || 'Unknown error'));
                };
            })();
        </script>
        `;

        if (mainFile.language === 'javascript') {
            // anggep aja mode p5.js buat sekarang kalo filenya cuma satu atau emang p5
            const jsCode = mainFile.content;
            const isP5 = jsCode.includes('createCanvas') || jsCode.includes('setup()') || jsCode.includes('draw()');

            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    ${isP5 ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>' : ''}
                    ${consoleScript}
                    <style>body { margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: #000; height: 100vh; color: white; }</style>
                </head>
                <body>
                    <script>
                        try {
                            ${escapeScript(jsCode)}
                        } catch(e) {
                            console.error(e);
                        }
                    </script>
                </body>
                </html>
            `;
        }

        if (mainFile.language === 'html') {
            // masukin script konsol ke bagian Head
            let content = mainFile.content || '';
            if (content.includes('<head>')) {
                content = content.replace('<head>', `<head>${consoleScript}`);
            } else {
                content = `${consoleScript}${content}`;
            }

            // masukin file css sama js kalo ada hubungannya (cara simpel: masukin semua css/js lain)
            const cssFiles = files.filter(f => f.language === 'css');
            const jsFiles = files.filter(f => f.language === 'javascript' && f.id !== mainFile.id);

            const styles = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            const scripts = jsFiles.map(f => `<script>${escapeScript(f.content)}</script>`).join('\n');

            content = content.replace('</head>', `${styles}</head>`);
            content = content.replace('</body>', `${scripts}</body>`);

            return content;
        }

        if (mainFile.language === 'svg') {
            return `
                <!DOCTYPE html>
                <html>
                <head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #111; }</style></head>
                <body>${mainFile.content}</body>
                </html>
            `;
        }

        return '';
    };

    return (
        <iframe
            key={key}
            ref={iframeRef}
            srcDoc={getIframeContent()}
            className="w-full h-full border-none bg-black"
            sandbox="allow-scripts allow-modals allow-same-origin"
            title="Preview"
        />
    );
};
