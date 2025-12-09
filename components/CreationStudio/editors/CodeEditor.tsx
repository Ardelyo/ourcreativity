import React, { useState } from 'react';
import { Play, Loader2, Copy, Check } from 'lucide-react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    onLanguageChange: (lang: string) => void;
    onRun: () => void;
    isExecuting: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    language,
    onLanguageChange,
    onRun,
    isExecuting
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const languages = [
        { id: 'html', label: 'HTML/CSS/JS' },
        { id: 'javascript', label: 'JavaScript' },
        { id: 'p5js', label: 'p5.js (Creative)' },
    ];

    // Line numbers calculation
    const lineCount = value.split('\n').length;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 10) }, (_, i) => i + 1);

    return (
        <div className="flex flex-col h-full border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0f0f0f] shrink-0">
                <div className="flex items-center gap-4">
                    {/* Window Dots */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                    </div>

                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="bg-[#1a1a1a] border border-white/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-white/30"
                    >
                        {languages.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={onRun}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isExecuting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                        Run
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                        title="Copy Code"
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {/* Editor Area with Line Numbers */}
            <div className="flex-1 flex overflow-hidden">
                {/* Line Numbers */}
                <div className="w-12 bg-[#0a0a0a] border-r border-white/5 py-4 text-right pr-3 select-none shrink-0 overflow-hidden">
                    {lineNumbers.map(num => (
                        <div key={num} className="text-xs text-gray-600 leading-6 font-mono">{num}</div>
                    ))}
                </div>

                {/* Code Input */}
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="// Start coding here..."
                    spellCheck={false}
                    className="flex-1 bg-transparent text-gray-100 font-mono text-sm leading-6 p-4 resize-none focus:outline-none placeholder:text-gray-700"
                    style={{
                        tabSize: 4,
                        MozTabSize: 4,
                    }}
                />
            </div>
        </div>
    );
};
