import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface FeedbackMarqueeProps {
    children: React.ReactNode;
    speed?: number; // Duration in seconds for one full loop
    direction?: 'left' | 'right';
}

export const FeedbackMarquee: React.FC<FeedbackMarqueeProps> = ({
    children,
    speed = 40,
    direction = 'left'
}) => {
    const [contentWidth, setContentWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.offsetWidth);
        }
    }, [children]);

    // Duplicate children to ensure seamless loop
    // minimal 2 sets, maybe 3 to be safe for wide screens

    return (
        <div className="w-full overflow-hidden relative group">
            <div className="absolute inset-y-0 left-0 w-20 md:w-60 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-60 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            <div
                className="flex"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',

                }}
            >
                <div
                    className="flex animate-marquee hover:[animation-play-state:paused]"
                    style={{
                        animationDuration: `${speed}s`,
                        animationDirection: direction === 'right' ? 'reverse' : 'normal'
                    }}
                >
                    <div className="flex">
                        {children}
                    </div>
                </div>
                <div
                    className="flex animate-marquee hover:[animation-play-state:paused]"
                    style={{
                        animationDuration: `${speed}s`,
                        animationDirection: direction === 'right' ? 'reverse' : 'normal'
                    }}
                >
                    <div className="flex">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
