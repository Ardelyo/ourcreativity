import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Clock, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChangelogEntry {
    id: string;
    version: string;
    major_version: number;
    title: string;
    subtitle?: string; // Added optional subtitle support if data exists
    date: string;
    description: string;
    content?: string; // Full story content
    changes?: string[]; // Assuming this field exists based on previous file content or intention
    highlights?: string[];
    color: string;
    category?: string;
}

export const ChangelogTimeline = () => {
    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchChangelogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('type', 'changelog')
                    .order('major_version', { ascending: false })
                    .order('date', { ascending: false });

                if (error) throw error;
                if (data) setChangelogs(data);
            } catch (error) {
                console.error('Error fetching changelogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChangelogs();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Group by Major Version
    const groupedChangelogs = changelogs.reduce((acc, entry) => {
        const major = entry.major_version || 0;
        if (!acc[major]) acc[major] = [];
        acc[major].push(entry);
        return acc;
    }, {} as Record<number, ChangelogEntry[]>);

    const sortedMajorVersions = Object.keys(groupedChangelogs)
        .map(Number)
        .sort((a, b) => b - a);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative max-w-3xl mx-auto px-4 pb-20">
            {/* Main Timeline Line - Designed to look like a "Story Path" */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-full" />

            <div className="space-y-16">
                {sortedMajorVersions.map((majorVer) => {
                    // Era-specific theming
                    const eraTheme = {
                        5: { gradient: 'from-purple-500 to-rose-500', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]', name: 'Luminous Revolution', borderColor: 'border-purple-500/50' },
                        4: { gradient: 'from-cyan-500 to-teal-500', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]', name: 'Glowar Neon', borderColor: 'border-cyan-500/50' },
                        3: { gradient: 'from-indigo-500 to-violet-500', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.4)]', name: 'Constellation', borderColor: 'border-indigo-500/50' },
                        2: { gradient: 'from-orange-500 to-red-500', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]', name: 'Industrial', borderColor: 'border-orange-500/50' },
                        1: { gradient: 'from-gray-400 to-white', glow: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]', name: 'Genesis', borderColor: 'border-gray-400/50' },
                        0: { gradient: 'from-gray-600 to-gray-800', glow: 'shadow-[0_0_15px_rgba(100,100,100,0.3)]', name: 'Project Zero', borderColor: 'border-gray-600/50' },
                    }[majorVer] || { gradient: 'from-white/20 to-transparent', glow: '', name: `Era ${majorVer}`, borderColor: 'border-white/10' };

                    return (
                        <div key={majorVer} className="relative">
                            {/* Major Version Marker - Sticky Header with Era Theme */}
                            <div className="sticky top-24 z-30 flex items-center gap-4 mb-8 pl-2">
                                {/* Era Badge */}
                                <div className={`relative z-10 w-14 h-14 md:w-18 md:h-18 rounded-full bg-[#0a0a0a] border-4 border-[#0a0a0a] flex items-center justify-center ${eraTheme.glow}`}>
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${eraTheme.gradient} flex items-center justify-center`}>
                                        <span className="font-black text-white text-base md:text-xl drop-shadow-lg">v{majorVer}</span>
                                    </div>
                                </div>
                                {/* Era Name Pill */}
                                <div className={`bg-[#0a0a0a]/90 border ${eraTheme.borderColor} px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg`}>
                                    <span className={`font-serif text-lg md:text-xl font-bold bg-gradient-to-r ${eraTheme.gradient} bg-clip-text text-transparent`}>
                                        {eraTheme.name}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 pl-12 md:pl-20">
                                {groupedChangelogs[majorVer].map((entry, index) => {
                                    const isExpanded = expandedId === entry.id;
                                    const isMajorVersion = entry.version.endsWith('.0') && !entry.version.includes('.0.');
                                    const isPatch = entry.version.includes('.0.') || entry.category === 'Patch';

                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.4, delay: index * 0.08 }}
                                            className="relative group"
                                        >
                                            {/* Connector Line to Node */}
                                            <div className={`absolute -left-[2.5rem] md:-left-[3.5rem] top-8 w-6 md:w-10 h-px bg-gradient-to-r ${eraTheme.gradient} opacity-30 group-hover:opacity-60 transition-opacity`} />

                                            {/* Connector Node - Era Themed */}
                                            <div className={`absolute -left-[3rem] md:-left-[4rem] top-5 w-7 h-7 rounded-full bg-[#0a0a0a] border-2 ${isExpanded ? eraTheme.borderColor : 'border-white/20'} ring-4 ring-[#0a0a0a] flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 ${isExpanded ? eraTheme.glow : ''}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isExpanded ? `bg-gradient-to-br ${eraTheme.gradient}` : 'bg-white/30 group-hover:bg-white/60'}`} />
                                            </div>

                                            {/* Content Card - Enhanced */}
                                            <motion.div
                                                layout
                                                onClick={() => toggleExpand(entry.id)}
                                                className={`
                                                    relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                                                    ${isExpanded
                                                        ? `bg-[#0d0d0d] ${eraTheme.borderColor} ${eraTheme.glow}`
                                                        : `bg-[#080808] border-white/5 hover:border-white/15 hover:bg-[#0c0c0c]`
                                                    }
                                                    ${isMajorVersion && !isExpanded ? 'border-l-4' : ''}
                                                `}
                                                style={isMajorVersion && !isExpanded ? { borderLeftColor: `var(--tw-gradient-from)` } : {}}
                                            >
                                                {/* Decorative Corner Accent */}
                                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${entry.color || eraTheme.gradient} opacity-5 rounded-bl-full pointer-events-none`} />

                                                {/* Glow Effect Background when Expanded */}
                                                {isExpanded && (
                                                    <>
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${entry.color || eraTheme.gradient} opacity-[0.03] pointer-events-none`} />
                                                        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${entry.color || eraTheme.gradient} opacity-10 blur-3xl pointer-events-none`} />
                                                    </>
                                                )}

                                                {/* Category Ribbon for Major Versions */}
                                                {isMajorVersion && (
                                                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-gradient-to-r ${entry.color || eraTheme.gradient} text-white shadow-lg`}>
                                                        ★ MAJOR
                                                    </div>
                                                )}
                                                {isPatch && !isMajorVersion && (
                                                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white/10 text-gray-400">
                                                        PATCH
                                                    </div>
                                                )}

                                                <div className="p-5 md:p-6">
                                                    {/* Card Header Section */}
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-2 flex-1">
                                                            {/* Version & Date Row */}
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${entry.color ? `bg-gradient-to-r ${entry.color} text-white border-transparent` : 'bg-white/10 text-gray-300 border-white/10'}`}>
                                                                    {entry.version}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                                                                    <Calendar size={11} />
                                                                    {new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                                {entry.subtitle && (
                                                                    <span className="text-xs text-gray-600 italic hidden md:inline">
                                                                        — {entry.subtitle}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Title */}
                                                            <h3 className={`font-serif text-xl md:text-2xl font-bold leading-tight transition-colors ${isExpanded ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                                                {entry.title}
                                                            </h3>
                                                            {/* Description Preview */}
                                                            {!isExpanded && (
                                                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                                                    {entry.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Expand/Collapse Button */}
                                                        <button
                                                            className={`
                                                                p-2.5 rounded-xl transition-all duration-300 shrink-0
                                                                ${isExpanded
                                                                    ? `bg-gradient-to-br ${entry.color || eraTheme.gradient} text-white shadow-lg`
                                                                    : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white group-hover:scale-105'
                                                                }
                                                            `}
                                                        >
                                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </button>
                                                    </div>

                                                    {/* Expanded Content Section */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pt-6 space-y-5">
                                                                    {/* Decorative Divider */}
                                                                    <div className={`h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

                                                                    {/* Main Story Content */}
                                                                    <div className="relative pl-4 border-l-2 border-white/10">
                                                                        <div className="absolute -left-2 -top-1 text-2xl text-white/20 font-serif">"</div>
                                                                        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                                                            {entry.content || entry.description}
                                                                        </p>
                                                                    </div>

                                                                    {/* Changes List (if available) */}
                                                                    {entry.changes && entry.changes.length > 0 && (
                                                                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                                <Tag size={12} /> Log Perubahan
                                                                            </h4>
                                                                            <ul className="space-y-2">
                                                                                {entry.changes.map((change, idx) => (
                                                                                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                                                                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-gradient-to-r ${entry.color || eraTheme.gradient}`} />
                                                                                        <span className="flex-1">{change}</span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Highlights Tags - Enhanced */}
                                                                    {entry.highlights && entry.highlights.length > 0 && (
                                                                        <div className="space-y-2">
                                                                            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Fitur Utama</h4>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {entry.highlights.map((h, idx) => (
                                                                                    <span
                                                                                        key={idx}
                                                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                                                                            ${idx === 0
                                                                                                ? `bg-gradient-to-r ${entry.color || eraTheme.gradient} text-white border-transparent shadow-sm`
                                                                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                                                                            }
                                                                                        `}
                                                                                    >
                                                                                        {idx === 0 ? '★ ' : ''}{h}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Footer/Meta */}
                                                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-600 font-mono">
                                                                        <span>ID: {entry.id.slice(0, 8)}</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock size={12} />
                                                                            <span>Released</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* End of Timeline Indicator */}
            <div className="absolute left-8 md:left-12 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-white to-gray-500 blur-[2px] animate-pulse" />
            </div>
        </div>
    );
};

