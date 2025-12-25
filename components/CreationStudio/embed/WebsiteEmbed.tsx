import React, { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface WebsiteEmbedProps {
    url: string;
}

/**
 * WebsiteEmbed - Naro website luar di dalem sandbox yang terbatas.
 * 
 * BATASAN KEAMANAN:
 * - Pake sandbox ketat cuma "allow-scripts" sama "allow-forms"
 * - "allow-same-origin" diapus biar gak bisa akses lintas-asal
 * - "allow-popups" diapus biar gak bisa buka window popup
 * - Kebijakan konten sama batasan CORS tetep berlaku
 * - Kadang website masih bisa ngeblokir embed lewat X-Frame-Options atau CSP
 */

export const WebsiteEmbed: React.FC<WebsiteEmbedProps> = ({ url }) => {
    const [key, setKey] = useState(0); // Buat maksa muat ulang
    const [loadError, setLoadError] = useState(false);

    // Validasi URL
    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    if (!url) return null;
    if (!isValidUrl(url)) return <div className="p-4 text-red-500 bg-red-500/10 rounded-xl">URL Gak Valid</div>;

    const reload = () => {
        setKey(prev => prev + 1);
        setLoadError(false);
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden">
            {/* Header / Bar Alamat */}
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
                    Buka <ExternalLink size={12} />
                </a>
            </div>

            {/* Konten Iframe */}
            <div className="flex-1 relative bg-white">
                {loadError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] text-gray-400">
                        <ExternalLink size={32} className="mb-4 opacity-50" />
                        <p className="mb-2">Website ini mungkin ngeblokir buat dipasang (embed).</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent-blue hover:underline"
                        >
                            Klik di sini buat buka langsung
                        </a>
                    </div>
                ) : (
                    <iframe
                        key={key}
                        src={url}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts allow-forms"
                        onError={() => setLoadError(true)}
                    /* Catetan: onError di iframe gak bener-bener akurat buat deteksi blokir X-Frame-Options */
                    /* Kita cuma ngandelin UI fallback kalo keliatannya rusak, atau user buka manual */
                    />
                )}
            </div>
        </div>
    );
};
