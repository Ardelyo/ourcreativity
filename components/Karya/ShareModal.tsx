import React, { useRef, useState } from 'react';
import { X, Link as LinkIcon, Download, Loader2, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    art: any;
    user?: any;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, art, user }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/karya/${art.id}`; // Assuming this route exists or similar

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    const handleDownloadImage = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            // Tunggu bentar biar gambar ke-load (kalo ada)
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2, // Biar tajem (Retina like)
                backgroundColor: '#000000',
                logging: false,
            });

            const dataUrl = canvas.toDataURL('image/png');

            // Trigger download
            const link = document.createElement('a');
            link.download = `OurCreativity-${art.title.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();

            // Optional: Close modal after download begins
            // onClose();
        } catch (error) {
            console.error('Failed to generate image', error);
            alert('Gagal membuat gambar. Coba lagi.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 z-[120]">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white font-serif">Bagikan Karya</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Copy Link Section */}
                <div className="mb-6">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Link Karya</label>
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                        <div className="flex-1 px-2 text-sm text-gray-300 truncate font-mono">
                            {shareUrl}
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className={`p-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${hasCopied
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {hasCopied ? <Check size={16} /> : <LinkIcon size={16} />}
                            {hasCopied ? 'Disalin' : 'Salin'}
                        </button>
                    </div>
                </div>

                {/* Download Image Section */}
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Export Gambar</label>
                    <button
                        onClick={handleDownloadImage}
                        disabled={isGenerating}
                        className="w-full py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                <span>Download Kartu Visual</span>
                            </>
                        )}
                    </button>
                </div>

                {/* HIDDEN GENERATION AREA */}
                {/* Ini yang bakal di-screenshot sama html2canvas */}
                <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none overflow-hidden">
                    <div
                        ref={cardRef}
                        className="w-[1080px] h-[1350px] bg-black text-white relative flex flex-col p-16"
                        style={{ fontFamily: 'serif' }} // Pastiin font ke-load
                    >
                        {/* Background Image / content */}
                        <div className="absolute inset-0 z-0">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
                            <img
                                src={art.image_url || art.thumbnail_url}
                                className="w-full h-full object-cover"
                                alt="Background"
                                crossOrigin="anonymous" // Penting buat html2canvas
                            />
                        </div>

                        {/* Branding Top */}
                        <div className="relative z-20 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-white animate-pulse" /> {/* Logo Absurd OC */}
                                <span className="text-3xl font-bold tracking-tighter uppercase font-sans">OurCreativity</span>
                            </div>
                        </div>

                        {/* Content Bottom */}
                        <div className="relative z-20 mt-auto">
                            <div className="flex items-end justify-between">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                                            <span className="text-2xl font-sans uppercase tracking-widest">{art.division}</span>
                                        </div>
                                    </div>
                                    <h1 className="text-8xl font-serif font-bold leading-tight mb-8 drop-shadow-2xl">
                                        {art.title}
                                    </h1>
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 overflow-hidden">
                                            <img
                                                src={art.author_profile?.avatar_url || `https://ui-avatars.com/api/?name=${art.author}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-2xl text-gray-300 font-sans">Created by</p>
                                            <p className="text-4xl font-bold">{art.author}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* QRCode Placeholder or Logo */}
                                {/* QRCode Placeholder or Logo */}
                                <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2">
                                    <div className="w-32 h-32 bg-black flex items-center justify-center relative overflow-hidden">
                                        {/* Simple QR Code Simulation or Logo */}
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
                                            className="w-full h-full object-contain"
                                            alt="QR Code"
                                            crossOrigin="anonymous"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-black font-bold text-xs uppercase tracking-widest">Scan to View</p>
                                        <p className="text-black/60 text-[10px] font-mono mt-1">ourcreativity.id</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/40 font-mono text-sm tracking-widest uppercase">
                            www.ourcreativity.id
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
