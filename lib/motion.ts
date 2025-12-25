export const motionConfig = {
    durations: {
        fast: 0.2,
        normal: 0.4,
        slow: 0.8,
        ultraSlow: 1.2
    },
    // Custom cubic-bezier curves for premium feel
    easings: {
        smooth: [0.25, 0.1, 0.25, 1], // ease-in-out
        bounce: [0.34, 1.56, 0.64, 1], // spring-like
        power: [0.4, 0, 0.2, 1], // strong accent
        outExpo: [0.19, 1, 0.22, 1] // text reveal
    },
    // Standardized stagger times
    stagger: {
        fast: 0.05,
        normal: 0.1,
        slow: 0.2
    },
    // Common animation variants
    springs: {
        smooth: { type: "spring", stiffness: 350, damping: 30, mass: 1 },
        bouncy: { type: "spring", stiffness: 400, damping: 15, mass: 1 },
        stiff: { type: "spring", stiffness: 500, damping: 50, mass: 1 } // for clean snaps
    },
    variants: {
        fadeInUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        },
        fadeInScale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        },
        staggerContainer: {
            animate: {
                transition: {
                    staggerChildren: 0.1
                }
            }
        }
    }
} as const;
