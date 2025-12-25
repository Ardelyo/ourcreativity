import React from 'react';
import { motion } from 'framer-motion';
import { motionConfig } from '../lib/motion';

export const MotionPage = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={motionConfig.variants.fadeInUp}
            transition={{ duration: motionConfig.durations.normal, ease: motionConfig.easings.smooth }}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
};
