import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Video, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaUpload } from '@/hooks/useMediaUpload';

interface MediaUploaderProps {
    accept?: 'image' | 'video' | 'both';
    onUploadComplete: (url: string, thumbnailUrl?: string) => void;
    bucket: string;
    folder?: string;
    generateThumbnail?: boolean;
}

const MediaUploader = ({
    accept = 'both',
    onUploadComplete,
    bucket,
    folder,
    generateThumbnail = true,
}: MediaUploaderProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const { uploadMedia, uploading, progress } = useMediaUpload();

    const acceptTypes = {
        image: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
        video: { 'video/*': ['.mp4', '.webm', '.mov'] },
        both: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
            'video/*': ['.mp4', '.webm', '.mov'],
        },
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        try {
            const result = await uploadMedia(file, {
                bucket,
                folder,
                generateThumbnail,
            });

            onUploadComplete(result.url, result.thumbnailUrl);
        } catch (error) {
            setPreview(null);
        }
    }, [uploadMedia, bucket, folder, generateThumbnail, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptTypes[accept],
        maxFiles: 1,
        disabled: uploading,
    });

    return (
        <div className="w-full">
            <motion.div
                {...getRootProps()}
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {progress < 60 ? 'Mengkompress...' : 'Mengupload...'}
                                </p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                            </div>
                        </motion.div>
                    ) : preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-center">
                                <Check className="w-12 h-12 text-green-500" />
                            </div>
                            <p className="text-sm font-medium text-green-600">
                                Upload berhasil!
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-center gap-2">
                                {accept === 'image' || accept === 'both' ? (
                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                ) : null}
                                {accept === 'video' || accept === 'both' ? (
                                    <Video className="w-12 h-12 text-gray-400" />
                                ) : null}
                                {accept === 'both' && <Upload className="w-12 h-12 text-gray-400" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {isDragActive ? 'Drop file di sini' : 'Drag & drop atau klik untuk upload'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {accept === 'image' && 'Gambar akan otomatis dikonversi ke WebP'}
                                    {accept === 'video' && 'Video akan otomatis dikompress'}
                                    {accept === 'both' && 'File akan otomatis dioptimasi'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default MediaUploader;
