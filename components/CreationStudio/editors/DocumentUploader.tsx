import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Eye, Edit3, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentUploaderProps {
    content: string;
    onChange: (content: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ content, onChange }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'pdf' | 'editable' | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);
        const ext = file.name.split('.').pop()?.toLowerCase();

        if (ext === 'pdf') {
            setFileType('pdf');
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onChange(url); // For PDF, we store the URL/Blob for now
        } else if (['docx', 'md', 'txt'].includes(ext || '')) {
            setFileType('editable');
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                onChange(text);
            };
            if (ext === 'docx') {
                // Future: Add mammoth.js for DOCX to HTML conversion if needed
                alert("Format .docx akan dikonversi ke teks mentah. Format visual mungkin terbatas.");
            }
            reader.readAsText(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/markdown': ['.md'],
            'text/plain': ['.txt']
        },
        multiple: false
    });

    const reset = () => {
        setFileName(null);
        setFileType(null);
        setPreviewUrl(null);
        onChange('');
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12">
            <AnimatePresence mode="wait">
                {!fileName ? (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full flex items-center justify-center p-4"
                    >
                        <div
                            {...getRootProps()}
                            className={`w-full max-w-2xl aspect-video border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all cursor-pointer relative ${isDragActive ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 shadow-2xl">
                                <Upload className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upload Dokumen</h3>
                            <p className="text-sm text-gray-500 text-center px-8">
                                Mendukung .pdf, .docx, .md, .txt<br />
                                <span className="opacity-50 text-[10px] mt-2 block">PDF = Pratinjau | DOCX/MD/TXT = Edit</span>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl text-rose-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white leading-tight">{fileName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${fileType === 'pdf' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {fileType === 'pdf' ? 'Pratinjau PDF' : 'Dapat Diedit'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={reset} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 min-h-[500px] md:min-h-[700px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group">
                            {fileType === 'pdf' ? (
                                <iframe src={previewUrl!} className="w-full h-full border-none min-h-[500px] md:min-h-[700px]" title="PDF Preview" />
                            ) : (
                                <div className="p-8 h-full overflow-y-auto custom-scrollbar font-serif text-lg leading-relaxed text-gray-300">
                                    {content || <span className="opacity-20 italic">Memproses teks...</span>}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                                            <Edit3 size={12} />
                                            MODE EDIT
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
