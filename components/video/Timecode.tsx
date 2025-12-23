import React, { useState } from 'react';
import { useTransform } from 'framer-motion';

interface TimecodeProps {
    scrollProgress: any;
}

/**
 * Komponen Timecode - Menampilkan waktu video berdasarkan scroll
 * Format: HH:MM:SS:FF (Hours:Minutes:Seconds:Frames)
 */
export const Timecode = ({ scrollProgress }: TimecodeProps) => {
    const [time, setTime] = useState("00:00:00:00");

    useTransform(scrollProgress, (latest: number) => {
        const totalFrames = Math.floor(latest * 8000);
        const frames = totalFrames % 60;
        const seconds = Math.floor((totalFrames / 60) % 60);
        const minutes = Math.floor((totalFrames / 3600) % 60);
        const hours = Math.floor(totalFrames / 216000);

        const f = frames.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const h = hours.toString().padStart(2, '0');

        return `${h}:${m}:${s}:${f}`;
    }).on("change", (latest) => setTime(latest));

    return (
        <div className="font-mono text-blue-400 text-sm md:text-lg tracking-widest font-bold drop-shadow-md">
            {time}
        </div>
    );
};
