import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, AlertTriangle } from 'lucide-react';

const Noise = () => (
  <div
    className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
  ></div>
);

export const LicenseBrand = () => {
  return (
    <div className="pt-36 pb-20 px-4 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <span className="text-rose-400 font-bold tracking-widest text-xs uppercase mb-4 block">Legal & Guidelines</span>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Lisensi & Brand</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Panduan penggunaan kode sumber dan identitas visual OurCreativity.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* TL;DR Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
        >
          <Noise />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-rose-500" size={24} />
              <h2 className="text-2xl font-serif text-white">Ringkasan (TL;DR)</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Kode boleh dipakai bebas (<span className="text-white font-semibold">MIT License</span>), tapi jangan pakai nama dan logo <span className="text-white font-semibold">"OurCreativity"</span> untuk project kamu sendiri ya! 🙏
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boleh Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden"
          >
            <Noise />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Check size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Boleh (Silakan!)</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Pakai kode untuk belajar & modifikasi",
                  "Fork repository untuk development",
                  "Copy fitur-fitur untuk project kamu",
                  "Sebutkan 'terinspirasi dari OurCreativity'",
                  "Contribute ke project ini"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Tidak Boleh Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden"
          >
            <Noise />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <X size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Tidak Boleh</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Pakai nama 'OurCreativity' untuk project kamu",
                  "Copy logo kami mentah-mentah",
                  "Klaim sebagai website official",
                  "Deploy dengan branding yang sama persis",
                  "Membuat kebingungan identitas brand"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <X size={16} className="text-rose-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Why Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
        >
          <Noise />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-500" size={24} />
              <h2 className="text-xl font-serif text-white">Kenapa Ada Aturan Ini?</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Bayangkan kalau ada 10 website dengan nama "OurCreativity" - mana yang asli? 🤔
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Tujuan Kami</h4>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>Menghindari kebingungan komunitas</li>
                  <li>Melindungi identitas brand</li>
                  <li>Memastikan orang tahu mana yang official</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Bukan Untuk</h4>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>Membatasi kamu belajar</li>
                  <li>Melarang bikin project serupa</li>
                  <li>Mempersulit kontribusi</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
