
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Target, Users, Zap, MessageSquare, Share2, Gift, Infinity, ChevronDown, ArrowRight } from 'lucide-react';

// --- Komponen Bersama ---

const Noise = () => (
  <div 
    className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
  ></div>
);

// --- Bagian 1: Intro Sinematik ---

const IntroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={ref} className="h-screen relative flex items-center justify-center overflow-hidden">
      <Noise />
      {/* Latar Belakang Dinamis */}
      <motion.div 
        style={{ scale: scaleImg }}
        className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000] z-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
      </motion.div>

      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 text-center px-4"
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-200">The Origins</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 tracking-tight leading-none mix-blend-difference">
          Our <br /> Creativity<span className="text-rose-500">.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          Bukan sekadar presensi, tapi sebuah gerakan. <br />
          <span className="text-white font-medium italic">"Kreativitas Kita"</span> untuk masa depan Indonesia.
        </p>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-[-150px] left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="text-white/30" size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- Bagian 2: Filosofi (Infinity Animasi) ---

const PhilosophySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Gambar jalur SVG berdasarkan gulir
  const pathLength = useSpring(useTransform(scrollYProgress, [0.1, 0.6], [0, 1]), { stiffness: 40, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <section ref={ref} className="min-h-[150vh] relative py-32 flex flex-col items-center">
      <div className="sticky top-32 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.div style={{ opacity }} className="mb-12">
           <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">Filosofi Kami</h2>
           <p className="text-gray-400">Sebuah simbol keberanian tanpa batas.</p>
        </motion.div>

        <div className="relative w-full aspect-video flex items-center justify-center">
           {/* Efek Cahaya */}
           <div className="absolute inset-0 bg-rose-500/5 blur-[100px] rounded-full"></div>
           
           {/* Animasi Infinity SVG */}
           <svg width="100%" height="100%" viewBox="0 0 400 200" className="w-full max-w-[600px] overflow-visible">
              {/* Jalur Latar Belakang (Redup) */}
              <path 
                d="M100,100 C100,155.23 55.23,200 0,200 C-55.23,200 -100,155.23 -100,100 C-100,44.77 -55.23,0 0,0 C55.23,0 100,44.77 100,100 Z" 
                transform="translate(100,0)"
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="40"
              />
               <path 
                d="M300,100 C300,155.23 255.23,200 200,200 C144.77,200 100,155.23 100,100 C100,44.77 144.77,0 200,0 C255.23,0 300,44.77 300,100 Z" 
                transform="translate(100,0)"
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="40"
              />

              {/* Jalur Depan (Animasi) - Bentuk Infinity Perkiraan untuk efek visual */}
              <motion.path
                 d="M90 100 C 90 20 190 20 200 100 C 210 180 310 180 310 100 C 310 20 210 20 200 100 C 190 180 90 180 90 100"
                 fill="none"
                 stroke="#e11d48"
                 strokeWidth="12"
                 strokeLinecap="round"
                 style={{ pathLength }}
              />
           </svg>

           {/* Hamparan Teks Tengah */}
           <motion.div 
             style={{ opacity: pathLength }}
             className="absolute inset-0 flex items-center justify-center"
           >
              <div className="bg-black/80 backdrop-blur-md border border-rose-500/30 px-8 py-4 rounded-2xl">
                 <h3 className="text-3xl font-bold text-white tracking-widest uppercase">Unlimited</h3>
                 <p className="text-rose-400 text-xs tracking-[0.5em] uppercase text-center mt-1">Creativity</p>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Bagian 3: The Loop (Scrollytelling Vertikal) ---

const LoopStep: React.FC<{ number: string; title: string; desc: string; progress: any; range: number[] }> = ({ number, title, desc, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1, 0.2]); // Memudar masuk lalu keluar
  const scale = useTransform(progress, range, [0.8, 1.1, 0.9]);
  const color = useTransform(progress, range, ["#333", "#fff", "#555"]);
  const glow = useTransform(progress, range, ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 40px rgba(16, 185, 129, 0.4)", "0px 0px 0px rgba(0,0,0,0)"]);

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="flex items-center gap-8 py-16 md:py-24 relative z-10"
    >
      <motion.div 
        style={{ color: color, textShadow: glow }}
        className="text-6xl md:text-8xl font-serif font-bold transition-colors duration-300"
      >
        {number}
      </motion.div>
      <div className="max-w-md">
        <motion.h3 style={{ color }} className="text-2xl md:text-4xl font-bold mb-2 transition-colors duration-300">{title}</motion.h3>
        <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

const TheLoopSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  // Menggambar garis vertikal
  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]), { stiffness: 60, damping: 20 });

  const steps = [
    { id: "01", title: "Pemicu", desc: "Konten inspiratif di Media Sosial menarik minat audiens untuk mencari tahu lebih lanjut." },
    { id: "02", title: "Bergabung", desc: "Audiens merasa terpanggil dan bergabung ke dalam ekosistem OurCreativity." },
    { id: "03", title: "Aktivitas", desc: "Anggota mulai berkarya, berdiskusi, dan berbagi ilmu dalam lingkungan yang suportif." },
    { id: "04", title: "Kolaborasi", desc: "Publikasi karya di akun resmi untuk mendapatkan apresiasi, kritik membangun, dan branding." },
    { id: "05", title: "Regenerasi", desc: "Member yang matang menjadi inspirasi baru, menutup siklus dengan menarik minat generasi berikutnya." },
  ];

  return (
    <section className="bg-[#080808] relative py-32 overflow-hidden" ref={containerRef}>
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
       
       <div className="container mx-auto px-6 max-w-5xl relative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-24"
          >
             <span className="text-emerald-500 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Ekosistem Kami</span>
             <h2 className="text-5xl md:text-7xl font-serif text-white">The Loop</h2>
             <p className="text-gray-500 mt-4">Scroll ke bawah untuk melihat bagaimana siklus ini bekerja.</p>
          </motion.div>

          <div className="relative pl-4 md:pl-20">
             {/* Jalur Garis Vertikal */}
             <div className="absolute left-[2.25rem] md:left-[6.25rem] top-0 bottom-0 w-[2px] bg-white/5"></div>
             
             {/* Garis Animasi */}
             <motion.div 
                style={{ height: lineHeight }}
                className="absolute left-[2.25rem] md:left-[6.25rem] top-0 w-[2px] bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-900 shadow-[0_0_15px_#10b981]"
             />

             {/* Langkah-langkah */}
             <div className="space-y-12">
                {steps.map((step, index) => {
                  // Hitung rentang secara dinamis berdasarkan indeks
                  const start = index * 0.15;
                  const end = start + 0.25;
                  return (
                    <LoopStep 
                      key={step.id}
                      number={step.id}
                      title={step.title}
                      desc={step.desc}
                      progress={scrollYProgress}
                      range={[start, index * 0.15 + 0.1, end]} 
                    />
                  );
                })}
             </div>
          </div>
       </div>
    </section>
  );
};

// --- Bagian 4: Statistik & Dampak ---

const StatsSection = () => {
  return (
    <section className="py-32 relative bg-black">
      <Noise />
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-16">Dampak Nyata</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Member Bergabung", val: "3,000+", icon: Users, color: "text-blue-400" },
             { label: "Waktu Terbentuk", val: "< 1 Thn", icon: Zap, color: "text-yellow-400" },
             { label: "Karya Terpublikasi", val: "500+", icon: Share2, color: "text-rose-400" }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               viewport={{ once: true }}
               className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] relative group hover:bg-[#111] transition-colors"
             >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-4 mx-auto`} />
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">{stat.val}</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{stat.label}</div>
             </motion.div>
           ))}
        </div>
        
        <div className="mt-24 p-8 md:p-12 rounded-[3rem] bg-gradient-to-r from-gray-900 to-black border border-white/10 text-center max-w-4xl mx-auto">
           <h3 className="text-2xl font-serif text-white mb-4">Bergabunglah dengan Generasi Baru</h3>
           <p className="text-gray-400 mb-8 max-w-lg mx-auto">
             Jadilah bagian dari siklus. Dari penikmat konten, menjadi pencipta konten.
           </p>
           <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
             Gabung Sekarang <ArrowRight size={16} />
           </button>
        </div>
      </div>
    </section>
  );
};

export const Story = () => {
  return (
    <div className="bg-[#050505] min-h-screen">
      <IntroSection />
      <PhilosophySection />
      <TheLoopSection />
      <StatsSection />
    </div>
  );
};
