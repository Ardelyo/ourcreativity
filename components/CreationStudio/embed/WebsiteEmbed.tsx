import React, { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface WebsiteEmbedProps {
    url: string;
}

export const WebsiteEmbed: React.FC<WebsiteEmbedProps> = ({ url }) => {
    const [key, setKey] = useState(0); // To force reload
    const [loadError, setLoadError] = useState(false);

    // Validate URL
    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    if (!url) return null;
    if (!isValidUrl(url)) return <div className="p-4 text-red-500 bg-red-500/10 rounded-xl">Invalid URL</div>;

    const reload = () => {
        setKey(prev => prev + 1);
        setLoadError(false);
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden">
            {/* Header / Address Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-white/5 text-xs text-gray-400">
                <button onClick={reload} className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <RefreshCw size={12} />
                </button>
                <div className="flex-1 truncate px-2 font-mono opacity-70">
                    {url}
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                >
                    Open <ExternalLink size={12} />
                </a>
            </div>

            {/* Iframe Content */}
            <div className="flex-1 relative bg-white">
                {loadError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] text-gray-400">
                        <ExternalLink size={32} className="mb-4 opacity-50" />
                        <p className="mb-2">Website might be blocking embeds.</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent-blue hover:underline"
                        >
                            Click here to open directly
                        </a>
                    </div>
                ) : (
                    <iframe
                        key={key}
                        src={url}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        onError={() => setLoadError(true)}
                    // Note: onError on iframe isn't reliable for X-Frame-Options blocks
                    // We mainly rely on the fallback UI if it looks broken, or users open manually
                    />
                )}
            </div>
        </div>
    );
};
