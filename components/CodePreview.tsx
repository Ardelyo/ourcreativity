import React from 'react';

interface CodePreviewProps {
    code: string;
    language?: string;
    className?: string;
}

/**
 * CodePreview - Renders live HTML/JS/p5.js code in a sandboxed iframe.
 * 
 * Supports:
 * - HTML (with inline CSS/JS)
 * - JavaScript (wrapped in HTML)
 * - p5.js (auto-includes p5.js library)
 */
export const CodePreview: React.FC<CodePreviewProps> = ({ code, language = 'html', className = '' }) => {

    const generatePreviewHTML = (): string => {
        // Base HTML template
        const baseStyles = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: system-ui, sans-serif; 
                    background: #0a0a0a; 
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                canvas { display: block; }
            </style>
        `;

        switch (language) {
            case 'p5js':
            case 'p5':
                // p5.js: Include library and wrap code
                return `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        ${baseStyles}
                        <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
                    </head>
                    <body>
                        <script>
                            ${code}
                        </script>
                    </body>
                    </html>
                `;

            case 'javascript':
            case 'js':
                // Pure JS: Wrap in HTML with a container
                return `
                    <!DOCTYPE html>
                    <html>
                    <head>${baseStyles}</head>
                    <body>
                        <div id="app"></div>
                        <script>
                            try {
                                ${code}
                            } catch (e) {
                                document.body.innerHTML = '<pre style="color:red;padding:20px;">' + e.message + '</pre>';
                            }
                        </script>
                    </body>
                    </html>
                `;

            case 'html':
            default:
                // HTML: Render as-is (could contain its own CSS/JS)
                // Wrap if it doesn't have DOCTYPE
                if (code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html')) {
                    return code;
                }
                return `
                    <!DOCTYPE html>
                    <html>
                    <head>${baseStyles}</head>
                    <body>
                        ${code}
                    </body>
                    </html>
                `;
        }
    };

    const previewHTML = generatePreviewHTML();

    return (
        <iframe
            srcDoc={previewHTML}
            sandbox="allow-scripts allow-same-origin"
            className={`w-full h-full border-0 bg-white ${className}`}
            title="Code Preview"
        />
    );
};
