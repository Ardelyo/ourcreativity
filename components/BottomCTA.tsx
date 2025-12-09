import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const BottomCTA = () => {
  return (
    <section className="relative py-24 rounded-[3rem] bg-[#0a0a0a] border border-white/5 overflow-hidden">
      {/* Gradien Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]" />

      <div className="relative z-10 text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-7xl mb-8"
        >
          <span className="block text-white mb-2">Siap Menciptakan</span>
          <span className="block text-white">
            Sesuatu yang <span className="text-sky-500 italic">Baru?</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-xl mx-auto mb-12 text-lg font-light leading-relaxed"
        >
          Bergabunglah dengan ribuan kreator lainnya. Tanpa biaya,
          tanpa birokrasi, hanya kreativitas murni.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="px-10 py-4 bg-[#111] border border-white/20 hover:border-white/50 hover:bg-[#1a1a1a] text-white rounded-full font-bold text-sm transition-all flex items-center gap-3 mx-auto group shadow-lg"
        >
          Gabung Sekarang
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};