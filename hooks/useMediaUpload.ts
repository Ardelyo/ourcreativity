import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImage, createThumbnail } from '@/lib/image-compression';
import { compressVideo, generateVideoThumbnail } from '@/lib/video-compression';
import { toast } from 'react-hot-toast';

interface UploadOptions {
    bucket: string;
    folder?: string;
    generateThumbnail?: boolean;
    onProgress?: (progress: number) => void;
}

interface UploadResult {
    url: string;
    thumbnailUrl?: string;
    path: string;
}

export const useMediaUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadImage = async (
        file: File,
        options: UploadOptions
    ): Promise<UploadResult> => {
        try {
            setUploading(true);
            setProgress(0);

            // Compress and convert to WebP
            const compressedImage = await compressImage(file);
            setProgress(30);

            // Generate filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const fileName = `${timestamp}_${randomString}.webp`;
            const filePath = options.folder
                ? `${options.folder}/${fileName}`
                : fileName;

            // Upload main image
            const { error: uploadError } = await supabase.storage
                .from(options.bucket)
                .upload(filePath, compressedImage, {
                    contentType: 'image/webp',
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;
            setProgress(70);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(options.bucket)
                .getPublicUrl(filePath);

            let thumbnailUrl: string | undefined;

            // Generate thumbnail if requested
            if (options.generateThumbnail) {
                const thumbnail = await createThumbnail(file);
                const thumbPath = options.folder
                    ? `${options.folder}/thumbnails/${fileName}`
                    : `thumbnails/${fileName}`;

                const { error: thumbError } = await supabase.storage
                    .from(options.bucket)
                    .upload(thumbPath, thumbnail, {
                        contentType: 'image/webp',
                        cacheControl: '3600',
                    });

                if (!thumbError) {
                    const { data: thumbUrlData } = supabase.storage
                        .from(options.bucket)
                        .getPublicUrl(thumbPath);
                    thumbnailUrl = thumbUrlData.publicUrl;
                }
            }

            setProgress(100);
            return {
                url: urlData.publicUrl,
                thumbnailUrl,
                path: filePath,
            };
        } catch (error: any) {
            console.error('[Upload] Image upload error:', error);
            toast.error('Gagal upload gambar: ' + error.message);
            throw error;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const uploadVideo = async (
        file: File,
        options: UploadOptions
    ): Promise<UploadResult> => {
        try {
            setUploading(true);
            setProgress(0);

            // Check file size - if > 50MB, compress it
            let videoToUpload = file;
            if (file.size > 50 * 1024 * 1024) {
                toast.loading('Mengkompress video...', { id: 'compress' });
                videoToUpload = await compressVideo(file, (p) => {
                    setProgress(Math.round(p * 0.6)); // 0-60% for compression
                    options.onProgress?.(Math.round(p * 0.6));
                });
                toast.success('Video berhasil dikompress!', { id: 'compress' });
            }

            setProgress(60);

            // Generate filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const fileName = `${timestamp}_${randomString}.mp4`;
            const filePath = options.folder
                ? `${options.folder}/${fileName}`
                : fileName;

            // Upload video
            const { error: uploadError } = await supabase.storage
                .from(options.bucket)
                .upload(filePath, videoToUpload, {
                    contentType: 'video/mp4',
                    cacheControl: '3600',
                });

            if (uploadError) throw uploadError;
            setProgress(80);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(options.bucket)
                .getPublicUrl(filePath);

            let thumbnailUrl: string | undefined;

            // Generate thumbnail
            if (options.generateThumbnail) {
                try {
                    const thumbnail = await generateVideoThumbnail(file);
                    const thumbPath = options.folder
                        ? `${options.folder}/thumbnails/${timestamp}_${randomString}.webp`
                        : `thumbnails/${timestamp}_${randomString}.webp`;

                    const { error: thumbError } = await supabase.storage
                        .from(options.bucket)
                        .upload(thumbPath, thumbnail, {
                            contentType: 'image/webp',
                            cacheControl: '3600',
                        });

                    if (!thumbError) {
                        const { data: thumbUrlData } = supabase.storage
                            .from(options.bucket)
                            .getPublicUrl(thumbPath);
                        thumbnailUrl = thumbUrlData.publicUrl;
                    }
                } catch (error) {
                    console.error('[Upload] Thumbnail generation failed:', error);
                }
            }

            setProgress(100);
            return {
                url: urlData.publicUrl,
                thumbnailUrl,
                path: filePath,
            };
        } catch (error: any) {
            console.error('[Upload] Video upload error:', error);
            toast.error('Gagal upload video: ' + error.message);
            throw error;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const uploadMedia = async (
        file: File,
        options: UploadOptions
    ): Promise<UploadResult> => {
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (isVideo) {
            return uploadVideo(file, options);
        } else if (isImage) {
            return uploadImage(file, options);
        } else {
            throw new Error('Unsupported file type');
        }
    };

    return {
        uploadMedia,
        uploadImage,
        uploadVideo,
        uploading,
        progress,
    };
};
