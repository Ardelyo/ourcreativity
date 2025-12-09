
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Briefcase } from 'lucide-react';

const members = [
  { name: "Alex Santoso", role: "Founder", color: "text-rose-400", border: "group-hover:border-rose-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]", img: "https://i.pravatar.cc/150?img=11" },
  { name: "Budi Pratama", role: "Community Mgr", color: "text-emerald-400", border: "group-hover:border-emerald-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Citra Dewi", role: "Art Director", color: "text-purple-400", border: "group-hover:border-purple-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]", img: "https://i.pravatar.cc/150?img=5" },
  { name: "Diana Putri", role: "Events", color: "text-yellow-400", border: "group-hover:border-yellow-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]", img: "https://i.pravatar.cc/150?img=9" },
  { name: "Erik Wijaya", role: "Tech Lead", color: "text-blue-400", border: "group-hover:border-blue-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", img: "https://i.pravatar.cc/150?img=3" },
  { name: "Fani Larasati", role: "Editor", color: "text-pink-400", border: "group-hover:border-pink-500/50", glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]", img: "https://i.pravatar.cc/150?img=1" },
];

const Noise = () => (
  <div
    className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
  ></div>
);

export const Tim = () => {
  return (
    <div className="pt-36 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-4 block">Core Team</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Kontributor</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Individu yang mendedikasikan waktu dan tenaga untuk membangun ekosistem ini.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 ${member.border} ${member.glow}`}
          >
            {/* Hamparan Noise */}
            <Noise />

            {/* Info Atas */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-white/20 transition-all duration-500 grayscale group-hover:grayscale-0">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {/* Lencana Peran */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap shadow-xl">
                  <Briefcase size={12} className={member.color} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">{member.role}</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mt-4 mb-1 group-hover:scale-105 transition-transform duration-300">{member.name}</h3>

              {/* Sosial - Tampilkan saat hover */}
              <div className="flex gap-4 mt-6 opacity-40 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"><Twitter size={18} /></a>
                <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"><Linkedin size={18} /></a>
                <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"><Github size={18} /></a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
