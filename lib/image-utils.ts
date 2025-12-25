
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to WebP format with optimized settings.
 * Target size: < 1MB
 * Max dimension: 1920px
 * Format: WebP
 */
export const compressImage = async (file: File): Promise<File> => {
    // If it's already a small WebP, return as is (optional optimization)
    if (file.type === 'image/webp' && file.size < 0.5 * 1024 * 1024) {
        return file;
    }

    const options = {
        maxSizeMB: 0.8, // Target under 800KB
        maxWidthOrHeight: 1920, // Full HD is sufficient for most web content
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        return compressedFile;
    } catch (error) {
        console.error("Compression failed, using original file:", error);
        return file;
    }
};

/**
 * Validates video file size.
 * Limit: 50MB
 */
export const validateVideoSize = (file: File): boolean => {
    const MAX_SIZE_MB = 50;
    const isValid = file.size / 1024 / 1024 <= MAX_SIZE_MB;
    if (!isValid) {
        alert(`File video terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Batas maksimal adalah ${MAX_SIZE_MB}MB.`);
    }
    return isValid;
};
