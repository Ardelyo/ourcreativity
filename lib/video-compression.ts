import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg) return ffmpeg;

    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm';

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    return ffmpeg;
};

export const compressVideo = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<File> => {
    try {
        console.log('[Video] Starting compression:', {
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        });

        const ffmpegInstance = await loadFFmpeg();

        // Set up progress listener
        if (onProgress) {
            ffmpegInstance.on('progress', ({ progress }) => {
                onProgress(Math.round(progress * 100));
            });
        }

        const inputName = 'input.mp4';
        const outputName = 'output.mp4';

        // Write input file
        await ffmpegInstance.writeFile(inputName, await fetchFile(file));

        // Compress video with H.264 codec, CRF 28, and 1080p max resolution
        await ffmpegInstance.exec([
            '-i', inputName,
            '-c:v', 'libx264',
            '-crf', '28',
            '-preset', 'medium',
            '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,scale=\'min(1920,iw)\':-2',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            outputName
        ]);

        // Read compressed file
        const data = await ffmpegInstance.readFile(outputName);
        const compressedBlob = new Blob([data], { type: 'video/mp4' });
        const compressedFile = new File(
            [compressedBlob],
            file.name.replace(/\.[^.]+$/, '_compressed.mp4'),
            { type: 'video/mp4' }
        );

        // Cleanup
        await ffmpegInstance.deleteFile(inputName);
        await ffmpegInstance.deleteFile(outputName);

        console.log('[Video] Compression complete:', {
            originalSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
            reduction: `${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`,
        });

        return compressedFile;
    } catch (error) {
        console.error('[Video] Compression error:', error);
        throw error;
    }
};

export const generateVideoThumbnail = async (
    file: File,
    timeInSeconds: number = 1
): Promise<File> => {
    try {
        const ffmpegInstance = await loadFFmpeg();
        const inputName = 'input.mp4';
        const outputName = 'thumbnail.webp';

        await ffmpegInstance.writeFile(inputName, await fetchFile(file));

        await ffmpegInstance.exec([
            '-i', inputName,
            '-ss', timeInSeconds.toString(),
            '-vframes', '1',
            '-vf', 'scale=400:-2',
            '-q:v', '5',
            outputName
        ]);

        const data = await ffmpegInstance.readFile(outputName);
        const thumbnailBlob = new Blob([data], { type: 'image/webp' });
        const thumbnailFile = new File([thumbnailBlob], 'thumbnail.webp', { type: 'image/webp' });

        await ffmpegInstance.deleteFile(inputName);
        await ffmpegInstance.deleteFile(outputName);

        return thumbnailFile;
    } catch (error) {
        console.error('[Video] Thumbnail generation error:', error);
        throw error;
    }
};
