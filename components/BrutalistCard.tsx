import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Link as LinkIcon, Crown, Bug } from 'lucide-react';
import { motionConfig } from '../lib/motion';

interface BrutalistCardProps {
    login: string;
    avatar_url: string;
    bio?: string;
    contributions?: number;
    html_url: string;
    isOwner?: boolean;
    isReporter?: boolean;
    socials?: {
        twitter?: string;
        website?: string;
    };
    issueCount?: number;
    issueTitle?: string;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
    login,
    avatar_url,
    bio,
    contributions,
    html_url,
    isOwner = false,
    isReporter = false,
    socials,
    issueCount,
    issueTitle
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: motionConfig.durations.normal, ease: motionConfig.easings.smooth }}
            whileHover={{ y: -5, transition: { duration: motionConfig.durations.fast } }}
            className={`relative group p-6 rounded-3xl transition-all duration-500 overflow-hidden ${isOwner
                ? 'bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]'
                : isReporter
                    ? 'bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]'
                    : 'bg-white/5 border border-white/10 backdrop-blur-sm'
                }`}
        >
            {/* Efek Cahaya Halus (Ambient) */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 rounded-full pointer-events-none ${isOwner ? 'bg-rose-500' : isReporter ? 'bg-purple-500' : 'bg-white'
                }`} />

            <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${isOwner ? 'bg-rose-500' : 'bg-purple-500'}`} />
                    <img
                        src={avatar_url}
                        alt={login}
                        className={`w-28 h-28 rounded-2xl object-cover relative z-10 border-2 ${isOwner ? 'border-rose-500/50' : 'border-white/20'
                            } grayscale group-hover:grayscale-0 transition-all duration-700`}
                    />
                    {isOwner && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full z-20 shadow-lg border-2 border-black">
                            <Crown size={14} />
                        </div>
                    )}
                </div>

                <h3 className="text-3xl font-serif italic mb-2 text-white group-hover:text-rose-400 transition-colors duration-500">
                    {login}
                </h3>

                <div className="flex gap-2 mb-6">
                    {contributions !== undefined && (
                        <span className="text-[10px] font-mono tracking-widest uppercase py-1 px-3 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                            {contributions} Komitmen
                        </span>
                    )}
                    {issueCount !== undefined && (
                        <span className="text-[10px] font-mono tracking-widest uppercase py-1 px-3 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                            {issueCount} Laporan
                        </span>
                    )}
                </div>

                {bio && (
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 max-w-[240px]">
                        {bio}
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <a
                        href={html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                        title="GitHub Profile"
                    >
                        <Github size={20} />
                    </a>
                    {socials?.twitter && (
                        <a
                            href={`https://twitter.com/${socials.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Twitter"
                        >
                            <Twitter size={20} />
                        </a>
                    )}
                    {socials?.website && (
                        <a
                            href={socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Situs Web"
                        >
                            <LinkIcon size={20} />
                        </a>
                    )}
                </div>
            </div>

            {/* Dekorasi Bagian Bawah */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isOwner ? 'text-rose-500' : isReporter ? 'text-purple-500' : 'text-white'
                }`} />
        </motion.div>
    );
};
