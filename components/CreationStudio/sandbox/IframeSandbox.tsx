import React, { useEffect, useRef } from 'react';

interface IframeSandboxProps {
  code: string;
  triggerRun: number; // Increment to run
  language?: string;
}

/**
 * IframeSandbox - Buat jalanin kode di dalem iframe yang terisolasi.
 * 
 * BATASAN KEAMANAN:
 * - Pake sandbox yang ketat cuma "allow-scripts" sama "allow-forms"
 * - "allow-same-origin" diapus biar gak bisa ngakses window utama (parent)
 * - "allow-popups" sama "allow-modals" diapus demi keamanan
 * - Semua konten yang dijalanin terisolasi, gak bisa kabur dari iframe
 * 
 * Support buat:
 * - HTML (sama CSS/JS inline)
 * - JavaScript (dibungkus HTML)
 * - p5.js (otomatis masukin library p5.js)
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
        // Kalo kodenya udah ada DOCTYPE, pake apa adanya aja
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

  // Auto-run pas render pertama kalo emang ada kodenya
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
      sandbox="allow-scripts allow-forms"
    />
  );
};
