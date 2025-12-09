import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Upload, Globe, FileText } from 'lucide-react';

import { Medium, CreationData, SlideContent } from './types';
import { MediumSelector } from './MediumSelector';
import { CodeEditor } from './editors/CodeEditor';
import { TextEditor } from './editors/TextEditor';
import { IframeSandbox } from './sandbox/IframeSandbox';
import { PyodideSandbox } from './sandbox/PyodideSandbox';
import { WebsiteEmbed } from './embed/WebsiteEmbed';
import { DocumentUploader } from './editors/DocumentUploader';
import { SlideBuilder } from './carousel/SlideBuilder';

// Re-using the props interface
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (data: any) => void;
}

type Step = 'selection' | 'editor' | 'details';

const divisions = [
    { id: 'graphics', name: 'Grafis' },
    { id: 'video', name: 'Video' },
    { id: 'writing', name: 'Tulisan' },
    { id: 'meme', name: 'Meme' },
    { id: 'coding', name: 'Coding' },
];

export const CreationStudio: React.FC<Props> = ({ isOpen, onClose, onPublish }) => {
    const [step, setStep] = useState<Step>('selection');
    const [medium, setMedium] = useState<Medium | null>(null);
    const [subMode, setSubMode] = useState<'default' | 'embed' | 'document' | 'slide'>('default');

    // Form Data State
    const [formData, setFormData] = useState<Partial<CreationData>>({
        title: '',
        description: '',
        author: '',
        division: 'graphics',
        tags: [],
        content: '',
        slides: [],
        code_language: 'javascript',
        embed_url: ''
    });

    // Execution State
    const [triggerRun, setTriggerRun] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMediumSelect = (m: Medium) => {
        setMedium(m);
        setStep('editor');
        setSubMode('default');

        // Auto-set division
        let div = 'graphics';
        if (m === 'narasi') div = 'writing';
        if (m === 'kode') div = 'coding';
        if (m === 'sinema') div = 'video';

        setFormData(prev => ({ ...prev, division: div as any }));
    };

    const handlePublish = () => {
        // Prepare final data based on medium
        let finalType = 'image';
        if (medium === 'kode') finalType = 'code';
        if (medium === 'narasi') finalType = subMode === 'document' ? 'document' : 'text';
        if (medium === 'sinema') finalType = subMode === 'embed' ? 'embed' : 'video';
        if (medium === 'visual' && (formData.slides && formData.slides.length > 1)) finalType = 'slide';

        onPublish({
            ...formData,
            id: Date.now(),
            type: finalType,
            role: "Member",
            created_at: new Date().toISOString()
        });
        onClose();
        setTimeout(() => {
            setStep('selection');
            setMedium(null);
            setSubMode('default');
            setFormData({
                title: '', description: '', author: '', division: 'graphics', tags: [], content: '', slides: []
            });
        }, 500);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setFormData(prev => ({ ...prev, image: url, image_url: url }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-[70] w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto mx-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/50 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                {step !== 'selection' && (
                                    <button onClick={() => setStep(step === 'details' ? 'editor' : 'selection')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-white">
                                        {step === 'selection' && 'Creation Studio'}
                                        {step === 'editor' && `Editor: ${medium?.toUpperCase()}`}
                                        {step === 'details' && 'Final Details'}
                                    </h2>
                                </div>
                            </div>

                            {/* Sub-mode Toggles inside Editor */}
                            {step === 'editor' && (
                                <div className="flex gap-2">
                                    {medium === 'sinema' && (
                                        <button
                                            onClick={() => setSubMode(subMode === 'embed' ? 'default' : 'embed')}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${subMode === 'embed' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                                        >
                                            <Globe size={12} /> {subMode === 'embed' ? 'Embedding Mode' : 'Embed Website'}
                                        </button>
                                    )}
                                    {medium === 'narasi' && (
                                        <button
                                            onClick={() => setSubMode(subMode === 'document' ? 'default' : 'document')}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${subMode === 'document' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                                        >
                                            <FileText size={12} /> {subMode === 'document' ? 'Upload Doc' : 'Upload Document'}
                                        </button>
                                    )}
                                </div>
                            )}

                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden relative flex">
                            {/* Step 1: Selection */}
                            {step === 'selection' && (
                                <div className="w-full h-full overflow-y-auto">
                                    <MediumSelector onSelect={handleMediumSelect} />
                                </div>
                            )}

                            {/* Step 2: Editor */}
                            {step === 'editor' && (
                                <div className="w-full h-full flex flex-col md:flex-row">
                                    {/* Main Editor Surface */}
                                    <div className={`flex-1 p-4 relative flex flex-col ${medium === 'kode' ? 'w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-white/5' : 'h-full'}`}>

                                        {/* --- KODE EDITOR --- */}
                                        {medium === 'kode' && (
                                            <CodeEditor
                                                value={formData.content || ''}
                                                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                                language={formData.code_language || 'javascript'}
                                                onLanguageChange={(lang) => setFormData(prev => ({ ...prev, code_language: lang }))}
                                                onRun={() => setTriggerRun(prev => prev + 1)}
                                                isExecuting={isExecuting}
                                            />
                                        )}

                                        {/* --- NARASI EDITOR --- */}
                                        {medium === 'narasi' && (
                                            subMode === 'document' ? (
                                                <DocumentUploader
                                                    onContentExtracted={(html, filename) => {
                                                        setFormData(prev => ({ ...prev, content: html, document_source: filename }));
                                                        setSubMode('default'); // Switch back to editor to show content
                                                    }}
                                                />
                                            ) : (
                                                <TextEditor
                                                    content={formData.content || ''}
                                                    onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                                    className="h-full"
                                                />
                                            )
                                        )}

                                        {/* --- VISUAL (SLIDES) EDITOR --- */}
                                        {medium === 'visual' && (
                                            <SlideBuilder
                                                slides={formData.slides || []}
                                                onChange={(slides) => setFormData(prev => ({ ...prev, slides }))}
                                            />
                                        )}

                                        {/* --- SINEMA / EMBED --- */}
                                        {medium === 'sinema' && (
                                            subMode === 'embed' ? (
                                                <div className="h-full flex flex-col gap-4">
                                                    <input
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        value={formData.embed_url || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, embed_url: e.target.value }))}
                                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                                                    />
                                                    <div className="flex-1">
                                                        <WebsiteEmbed url={formData.embed_url || ''} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`h-full rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all group relative overflow-hidden`}
                                                >
                                                    {formData.image ? (
                                                        <video src={formData.image} controls className="max-h-full max-w-full" />
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                                                <Upload className="text-gray-400 group-hover:text-white" size={32} />
                                                            </div>
                                                            <h3 className="text-xl font-bold text-white mb-2">Upload Video</h3>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleImageUpload}
                                                        accept="video/*"
                                                        className="hidden"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Code Preview Panel (Only for Kode) */}
                                    {medium === 'kode' && (
                                        <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 bg-[#050505] flex flex-col">
                                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex justify-between">
                                                <span>Live Preview</span>
                                                {/* Hidden Pyodide Bridge */}
                                                <PyodideSandbox
                                                    code={formData.code_language === 'python' ? (formData.content || '') : ''}
                                                    triggerRun={formData.code_language === 'python' ? triggerRun : 0}
                                                    onOutput={(out) => setConsoleOutput(prev => prev + out)}
                                                    onError={(err) => setConsoleOutput(prev => prev + `\n🛑 Error: ${err}`)}
                                                />
                                            </div>

                                            <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white relative">
                                                <IframeSandbox
                                                    code={formData.content || ''}
                                                    triggerRun={triggerRun}
                                                    language={formData.code_language || 'html'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Details */}
                            {step === 'details' && (
                                <div className="w-full h-full overflow-y-auto p-8">
                                    <div className="max-w-2xl mx-auto space-y-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full bg-transparent text-4xl font-serif font-bold text-white placeholder:text-gray-800 focus:outline-none border-b border-white/10 focus:border-white/50 pb-2"
                                                placeholder="Your Title..."
                                                autoFocus
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Division</label>
                                                <select
                                                    value={formData.division}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value as any }))}
                                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                >
                                                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.tags?.join(', ')}
                                                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                placeholder="design, tutorial, snippet"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-32 resize-none"
                                                placeholder="Tell us about your work..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {step !== 'selection' && (
                            <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-end gap-4">
                                {step === 'editor' ? (
                                    <button
                                        onClick={() => setStep('details')}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePublish}
                                        className="bg-accent-rose text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors flex items-center gap-2"
                                    >
                                        <Check size={18} /> Publish to Feed
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
