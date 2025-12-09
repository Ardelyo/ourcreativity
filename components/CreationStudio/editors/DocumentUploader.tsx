import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileType, Check, AlertCircle, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';

interface DocumentUploaderProps {
    onContentExtracted: (html: string, filename: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onContentExtracted }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                onContentExtracted(result.value, file.name);
            } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
                const text = await file.text();
                // Simple conversion for now. For markdown, we could use a parser library
                // But for Tiptap, properly formatted HTML is best. 
                // We'll pass raw text for now, Tiptap handles basic markdown on paste usually,
                // but here we might need consistent HTML. 
                // For simplicity: wrapping paragraphs.
                const html = text.split('\n\n').map(p => `<p>${p}</p>`).join('');
                onContentExtracted(html, file.name);
            } else {
                throw new Error("Unsupported file type");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process document. Please try copying the content manually.");
        } finally {
            setIsProcessing(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/markdown': ['.md'],
            'text/plain': ['.txt']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive
                    ? 'border-accent-purple bg-accent-purple/10'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
        >
            <input {...getInputProps()} />

            {isProcessing ? (
                <>
                    <Loader2 className="animate-spin text-accent-purple mb-4" size={32} />
                    <p className="text-gray-400">Converting document...</p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400 group-hover:text-white transition-colors">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Upload Document</h3>
                    <p className="text-gray-500 text-sm max-w-xs mb-4">
                        Supports .docx, .md, .txt. Content will be converted to editable format.
                    </p>
                    <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
                        Select File
                    </button>
                </>
            )}

            {error && (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}
        </div>
    );
};
