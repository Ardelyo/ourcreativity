import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Link as LinkIcon, Crown, Bug } from 'lucide-react';

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
            viewport={{ once: true }}
            whileHover={{ x: -4, y: -4 }}
            className={`relative backdrop-blur-md border-4 p-6 transition-all group ${isOwner
                ? 'bg-rose-950/20 border-rose-500 shadow-brutalist-rose hover:shadow-brutalist-rose-lg'
                : isReporter
                    ? 'bg-purple-950/20 border-purple-500 shadow-brutalist-purple hover:shadow-brutalist-purple-lg'
                    : 'bg-white/5 border-white/20 shadow-brutalist hover:shadow-brutalist-lg'
                }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="relative">
                    <div className={`absolute inset-0 blur-xl opacity-20 -z-10 ${isOwner ? 'bg-rose-500' : 'bg-purple-500'}`} />
                    <img
                        src={avatar_url}
                        alt={login}
                        className={`w-20 h-20 border-4 bg-black object-cover ${isOwner ? 'border-rose-500' : 'border-white/20'}`}
                    />
                    {isOwner && (
                        <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 border-2 border-black">
                            <Crown size={18} />
                        </div>
                    )}
                    {isReporter && (
                        <div className="absolute -top-3 -right-3 bg-purple-500 text-white p-1.5 border-2 border-black">
                            <Bug size={18} />
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 text-white group-hover:text-rose-400 transition-colors">
                        {login}
                    </h3>
                    {contributions !== undefined && (
                        <span className="bg-rose-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                            {contributions} KONTRIBUSI
                        </span>
                    )}
                    {issueCount !== undefined && (
                        <span className="bg-purple-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                            {issueCount} LAPORAN
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {bio && (
                    <p className="font-mono text-xs text-white/60 border-l-2 border-white/20 pl-3 py-1 bg-white/5 leading-relaxed">
                        {bio}
                    </p>
                )}

                {issueTitle && (
                    <div className="bg-purple-500/10 border border-purple-500/30 text-white p-3 font-mono text-[10px]">
                        <span className="text-purple-400 font-black uppercase block mb-1">LAPORAN TERAKHIR:</span>
                        <span className="opacity-80">{issueTitle}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <a
                        href={html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 text-white p-2 hover:bg-rose-500 hover:text-white border-2 border-white/10 transition-all"
                        title="GitHub Profile"
                    >
                        <Github size={18} />
                    </a>
                    {socials?.twitter && (
                        <a
                            href={`https://twitter.com/${socials.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 text-white p-2 hover:bg-[#1DA1F2] hover:text-white border-2 border-white/10 transition-all"
                            title="Twitter"
                        >
                            <Twitter size={18} />
                        </a>
                    )}
                    {socials?.website && (
                        <a
                            href={socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 text-white p-2 hover:bg-purple-500 hover:text-white border-2 border-white/10 transition-all"
                            title="Situs Web"
                        >
                            <LinkIcon size={18} />
                        </a>
                    )}
                </div>
            </div>

            {/* Decoration */}
            <div className={`absolute bottom-2 right-2 w-4 h-4 border-r-4 border-b-4 transition-colors ${isOwner ? 'border-rose-500' : 'border-white/10'}`} />
        </motion.div>
    );
};
