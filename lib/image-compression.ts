import imageCompression from 'browser-image-compression';

interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
    fileType?: string;
}

export const compressImage = async (
    file: File,
    options: CompressionOptions = {}
): Promise<File> => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        quality: 0.85,
        fileType: 'image/webp',
        useWebWorker: true,
        ...options,
    };

    try {
        console.log('[Compression] Original file:', {
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type,
        });

        const compressedFile = await imageCompression(file, defaultOptions);

        // Convert to WebP if not already
        const webpFile = await convertToWebP(compressedFile, defaultOptions.quality);

        console.log('[Compression] Compressed file:', {
            name: webpFile.name,
            size: `${(webpFile.size / 1024 / 1024).toFixed(2)} MB`,
            reduction: `${(((file.size - webpFile.size) / file.size) * 100).toFixed(1)}%`,
        });

        return webpFile;
    } catch (error) {
        console.error('[Compression] Error:', error);
        throw error;
    }
};

export const convertToWebP = async (
    file: File,
    quality: number = 0.85
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to convert to WebP'));
                            return;
                        }

                        const webpFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, '.webp'),
                            { type: 'image/webp' }
                        );
                        resolve(webpFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export const createThumbnail = async (
    file: File,
    maxSize: number = 400
): Promise<File> => {
    return compressImage(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: maxSize,
        quality: 0.8,
        fileType: 'image/webp',
    });
};

export const createAvatar = async (
    file: File,
    size: number = 200
): Promise<File> => {
    return compressImage(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: size,
        quality: 0.8,
        fileType: 'image/webp',
    });
};

export const optimizeForWeb = async (file: File): Promise<File> => {
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
        return compressImage(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            quality: 0.85,
        });
    }

    return file;
};
