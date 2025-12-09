import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { BentoGrid } from '../components/BentoGrid';
import { BottomCTA } from '../components/BottomCTA';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
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

      <div className="mt-24 md:mt-32">
        <BentoGrid />
      </div>
      <div className="mt-32 md:mt-48">
        <BottomCTA />
      </div>
    </motion.div>
  );
};