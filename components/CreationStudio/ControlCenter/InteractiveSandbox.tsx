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
    const [key, setKey] = useState(0); // Force re-render iframe

    useEffect(() => {
        // Force refresh iframe on run trigger, unless paused
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
        const mainFile = files.find(f => f.isMain) || files[0];
        if (!mainFile) return '';

        // Inject Console Capture Script
        const consoleScript = `
        <script>
            (function(){
                const oldLog = console.log;
                const oldError = console.error;
                const oldWarn = console.warn;
                const oldInfo = console.info;

                function send(level, args) {
                    try {
                        // Convert args to safe strings/JSON
                        const safeArgs = args.map(arg => {
                            try { return JSON.parse(JSON.stringify(arg)); }
                            catch(e) { return String(arg); }
                        });
                        window.parent.postMessage({ type: 'console', level, args: safeArgs }, '*');
                    } catch(e) {}
                }

                console.log = (...args) => { oldLog.apply(console, args); send('log', args); };
                console.error = (...args) => { oldError.apply(console, args); send('error', args); };
                console.warn = (...args) => { oldWarn.apply(console, args); send('warn', args); };
                console.info = (...args) => { oldInfo.apply(console, args); send('info', args); };
                
                window.onerror = function(msg, url, line, col, error) {
                     send('error', [msg, 'Line: ' + line]);
                };
            })();
        </script>
        `;

        if (mainFile.language === 'javascript') {
            // Assume p5.js mode for now if it's a single JS file or explicitly p5
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
                    ${consoleScript}
                    <style>body { margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: #000; height: 100vh; color: white; }</style>
                </head>
                <body>
                    <script>
                        try {
                            ${mainFile.content}
                        } catch(e) {
                            console.error(e);
                        }
                    </script>
                </body>
                </html>
            `;
        }

        if (mainFile.language === 'html') {
            // Inject console script into Head
            let content = mainFile.content;
            if (content.includes('<head>')) {
                content = content.replace('<head>', `<head>${consoleScript}`);
            } else {
                content = `${consoleScript}${content}`;
            }

            // Inject CSS and JS files if related (Naive approach: inject all other CSS/JS)
            const cssFiles = files.filter(f => f.language === 'css');
            const jsFiles = files.filter(f => f.language === 'javascript' && f.id !== mainFile.id);

            const styles = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            const scripts = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');

            content = content.replace('</head>', `${styles}</head>`);
            content = content.replace('</body>', `${scripts}</body>`);

            return content;
        }

        if (mainFile.language === 'svg') {
            return `
                <!DOCTYPE html>
                <html>
                <head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; heights: 100vh; background: #111; }</style></head>
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
