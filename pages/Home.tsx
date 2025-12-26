import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
// Halaman Home - Komponen berat di-lazy load karena di bawah fold
const BentoGrid = React.lazy(() => import('../components/BentoGrid').then(module => ({ default: module.BentoGrid })));
const BottomCTA = React.lazy(() => import('../components/BottomCTA').then(module => ({ default: module.BottomCTA })));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" as const } }
};

export const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-32 pb-20"
    >
      <Hero />

      <React.Suspense fallback={<div className="h-96" />}>
        <div className="mt-24 md:mt-32">
          <BentoGrid />
        </div>
        <div className="mt-32 md:mt-48">
          <BottomCTA />
        </div>
      </React.Suspense>
    </motion.div>
  );
};