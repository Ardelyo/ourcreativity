
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, FileText, Mail, ChevronDown, PenTool, Video, Smile, Type, ExternalLink, Instagram, ChevronRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const divisions = [
  { name: "Desain Grafis", icon: PenTool, color: "text-purple-400", bg: "bg-purple-500/5", border: "hover:border-purple-500/50", link: "/division/graphics" },
  { name: "Video Editing", icon: Video, color: "text-blue-400", bg: "bg-blue-500/5", border: "hover:border-blue-500/50", link: "/division/video" },
  { name: "Meme Creator", icon: Smile, color: "text-yellow-400", bg: "bg-yellow-500/5", border: "hover:border-yellow-500/50", link: "/division/meme" },
  { name: "Karya Tulis", icon: Type, color: "text-rose-400", bg: "bg-rose-500/5", border: "hover:border-rose-500/50", link: "/division/writing" },
  { name: "Coding", icon: Terminal, color: "text-green-500", bg: "bg-green-500/5", border: "hover:border-green-500/50", link: "/division/coding" },
];

const faqs = [
  { q: "Apakah komunitas ini gratis?", a: "Ya, 100% gratis. Kami menyelenggarakan diskusi, event eksklusif, dan proyek kolaboratif tanpa biaya untuk pengembangan keterampilan anggota." },
  { q: "Bagaimana cara bergabung?", a: "Cukup ikuti tautan di Linktree kami atau pantau Instagram @ourcreativity.ofc. Perekrutan biasanya diumumkan melalui konten media sosial." },
  { q: "Apakah pemula boleh ikut?", a: "Sangat boleh. Komunitas ini dibentuk sebagai wadah belajar bagi mereka yang ingin mempelajari sesuatu namun tidak memiliki tempat bertanya." },
  { q: "Apa itu sistem 'The Loop'?", a: "Itu adalah ekosistem kami: Terpicu konten -> Bergabung -> Berkarya -> Kolaborasi -> Konsistensi -> Menjadi inspirasi baru (Regenerasi)." },
];

const Noise = () => (
  <div
    className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
  ></div>
);

export const Info = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="pt-36 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 block">Pusat Informasi</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Hub Komunitas</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Panduan lengkap, akses divisi, dan pertanyaan umum seputar ekosistem OurCreativity.
        </p>
      </motion.div>

      {/* Tata Letak Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">

        {/* Bagian Divisi */}
        <div className="md:col-span-8 space-y-4">
          <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-white/20"></div> Divisi Aktif
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {divisions.map((div, i) => (
              <Link to={div.link} key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:bg-[#111] transition-all group overflow-hidden ${div.border} h-full`}
                >
                  <Noise />
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${div.bg} ${div.color} mb-4`}>
                      <div.icon size={24} />
                    </div>
                    <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="relative z-10 text-white font-bold text-lg mb-1">{div.name}</h3>
                  <p className="relative z-10 text-xs text-gray-500">Group Eksklusif</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Kontak/Dukungan */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <h2 className="text-xl font-serif text-white mb-2 md:mb-6 md:mt-0 mt-8 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-white/20"></div> Kontak
          </h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group"
          >
            <Noise />
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-[60px] group-hover:bg-rose-500/20 transition-all"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-8">
                <Mail className="text-rose-400 mb-4" size={32} />
                <h3 className="text-2xl font-serif text-white mb-2">Connect</h3>
                <p className="text-sm text-gray-400">Punya tawaran kolaborasi atau pertanyaan mendesak?</p>
              </div>

              <div className="space-y-3 mt-auto">
                <a href="https://instagram.com/ourcreativity.ofc" className="flex items-center gap-3 text-sm text-white hover:text-rose-400 transition-colors p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20">
                  <Instagram size={16} /> @ourcreativity.ofc
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-white hover:text-rose-400 transition-colors p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20">
                  <ExternalLink size={16} /> Linktree Profile
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Akordeon FAQ */}
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-3xl font-serif text-white mb-10 text-center">Frequent Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white text-lg">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
