import React, { useEffect, useRef } from 'react';

interface IframeSandboxProps {
  code: string;
  triggerRun: number; // Increment to run
  language?: string;
}

/**
 * IframeSandbox - Executes code in a sandboxed iframe.
 * 
 * Supports:
 * - HTML (with inline CSS/JS)
 * - JavaScript (wrapped in HTML)
 * - p5.js (auto-includes p5.js library)
 */
export const IframeSandbox: React.FC<IframeSandboxProps> = ({ code, triggerRun, language = 'html' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateHTML = (inputCode: string, lang: string): string => {
    const baseStyles = `
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
        `;

    switch (lang) {
      case 'p5js':
      case 'p5':
        return `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>${baseStyles}</style>
                        <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
                    </head>
                    <body>
                        <script>
                            try {
                                ${inputCode}
                            } catch (e) {
                                document.body.innerHTML = '<pre style="color:red;padding:20px;">' + e.message + '</pre>';
                            }
                        </script>
                    </body>
                    </html>
                `;

      case 'javascript':
      case 'js':
        return `
                    <!DOCTYPE html>
                    <html>
                    <head><style>${baseStyles}</style></head>
                    <body>
                        <div id="app"></div>
                        <script>
                            try {
                                ${inputCode}
                            } catch (e) {
                                document.body.innerHTML = '<pre style="color:red;padding:20px;">' + e.message + '</pre>';
                            }
                        </script>
                    </body>
                    </html>
                `;

      case 'html':
      default:
        // If code already has DOCTYPE, use as-is
        if (inputCode.trim().toLowerCase().startsWith('<!doctype') || inputCode.trim().toLowerCase().startsWith('<html')) {
          return inputCode;
        }
        return `
                    <!DOCTYPE html>
                    <html>
                    <head><style>${baseStyles}</style></head>
                    <body>
                        ${inputCode}
                        <script>
                            window.onerror = function(msg) {
                                console.error(msg);
                            };
                        </script>
                    </body>
                    </html>
                `;
    }
  };

  useEffect(() => {
    if (triggerRun > 0 && iframeRef.current) {
      iframeRef.current.srcdoc = generateHTML(code, language);
    }
  }, [triggerRun, code, language]);

  // Auto-run on first render if code exists
  useEffect(() => {
    if (code && iframeRef.current) {
      iframeRef.current.srcdoc = generateHTML(code, language);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="sandbox"
      className="w-full h-full border-none bg-white rounded-xl"
      sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
    />
  );
};
