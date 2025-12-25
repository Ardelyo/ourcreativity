
import imageCompression from 'browser-image-compression';

/**
 * Kompres file gambar jadi format WebP dengan settingan optimal.
 * Target ukuran: < 1MB
 * Dimensi max: 1920px
 * Format: WebP
 */
export const compressImage = async (file: File): Promise<File> => {
    // Kalo emang udah WebP kecil, balikin aja langsung (optimasi opsional)
    if (file.type === 'image/webp' && file.size < 0.5 * 1024 * 1024) {
        return file;
    }

    const options = {
        maxSizeMB: 0.8, // Target di bawah 800KB
        maxWidthOrHeight: 1920, // Full HD udah cukup buat konten web kebanyakan
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        return compressedFile;
    } catch (error) {
        console.error("Kompresi gagal, pake file asli aja:", error);
        return file;
    }
};

/**
 * Validasi ukuran file video.
 * Batas: 50MB
 */
export const validateVideoSize = (file: File): boolean => {
    const MAX_SIZE_MB = 50;
    const isValid = file.size / 1024 / 1024 <= MAX_SIZE_MB;
    if (!isValid) {
        alert(`File video terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Batas maksimal adalah ${MAX_SIZE_MB}MB.`);
    }
    return isValid;
};
