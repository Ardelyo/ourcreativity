import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Zap, Globe, Users, Share2, Info, ChevronRight, Activity } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- Assets ---
const ASSETS = {
  logoGeneric: '/assets/logo-infinity-gradient.png',
  logoMain: '/assets/logo-oc-main.jpg',
  divisions: {
    coding: '/logo-oc-coding.jpg',
    desain: '/logo-oc-desain.jpg',
    video: '/logo-oc-video.jpg',
    meme: '/logo-oc-meme.jpg',
    karya: '/logo-oc-karyatulis.jpg',
  },
  tagwalls: [
    '/tagwall-brutalism.webp',
    '/tagwall-kemerdekaan.webp',
    '/tagwall-superhero.webp',
    '/tagwall-90s-design.jpg',
    '/assets/gallery/v_gallery_1.png',
    '/assets/gallery/v_gallery_2.png',
    '/assets/divisions/writing/poet_box.png',
    '/assets/divisions/writing/rabu_dan_sihir.png',
    '/assets/divisions/writing/story_voting.png',
  ]
};

// --- Sub-components ---

const AnimatedNumber = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useGSAP(() => {
    if (!elementRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericValue,
      duration: duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 90%",
      },
      onUpdate: () => {
        if (elementRef.current) {
          const formatted = obj.val % 1 === 0 ? obj.val.toFixed(0) : obj.val.toFixed(1);
          elementRef.current.innerText = formatted + suffix;
        }
      }
    });
  }, { scope: elementRef });

  return <span ref={elementRef}>0{suffix}</span>;
};

const BackgroundOrbs = () => {
  const orbContainer = useRef(null);

  useGSAP(() => {
    gsap.to(".aura-orb", {
      x: "random(-150, 150)",
      y: "random(-150, 150)",
      scale: "random(0.5, 1.5)",
      duration: "random(8, 15)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });
  }, { scope: orbContainer });

  return (
    <div ref={orbContainer} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
      <div className="aura-orb absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-rose-600/10 blur-[150px] rounded-full mix-blend-screen" />
      <div className="aura-orb absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="aura-orb absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
    </div>
  );
};

const SectionHeader = ({ subtitle, title, description }: { subtitle: string, title: string, description?: string }) => (
  <div className="mb-16 md:mb-24 text-left">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-[2px] bg-accentRed" />
      <span className="text-xs font-bold tracking-[0.4em] uppercase text-accentRed">{subtitle}</span>
    </div>
    <h2 className="text-5xl md:text-8xl font-serif font-black text-white leading-none tracking-tighter mb-6">{title}</h2>
    {description && <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light">{description}</p>}
  </div>
);

// --- Sections ---

const Hero = () => {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".hero-logo-frame", { scale: 0.5, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.75)" })
      .from(".hero-title-line", { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out" }, "-=1")
      .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");

    gsap.to(".hero-logo-pulse", {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero-scroll", {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      },
      y: 200,
      opacity: 0
    });
  }, { scope: container });

  return (
    <section ref={container} className="h-screen relative flex flex-col items-center justify-center z-10 overflow-hidden px-6">
      <div className="hero-logo-frame relative mb-16 select-none shadow-hero-glow rounded-full p-2 bg-gradient-to-br from-white/10 to-transparent">
        <div className="hero-logo-pulse absolute inset-0 bg-accentRed/20 blur-2xl rounded-full" />
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-surface border border-white/10 p-4 flex items-center justify-center backdrop-blur-3xl overflow-hidden aspect-square">
          <img
            src={ASSETS.logoGeneric}
            alt="Infinity OurCreativity"
            className="w-full h-full object-contain relative z-10 rounded-full"
            style={{ borderRadius: '50%' }}
          />
        </div>
      </div>

      <div className="text-center z-20">
        <h1 className="hero-title font-serif text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter text-white mb-8">
          <span className="hero-title-line block">OUR</span>
          <span className="hero-title-line block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase">CREATIVITY.</span>
        </h1>
        <div className="hero-desc flex flex-col items-center">
          <p className="text-xl md:text-3xl text-gray-400 font-light tracking-widest uppercase mb-2">
            Masa Depan <span className="text-accentRed font-bold">Kreativitas</span> Indonesia
          </p>
          <span className="text-xs font-mono text-accentRed/60 tracking-[0.5em] uppercase">Founded 2024</span>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-12 flex flex-col items-center gap-4 opacity-40">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Scroll down</div>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

const LogoPhilosophy = () => {
  const section = useRef(null);

  useGSAP(() => {
    gsap.from(".logo-card", {
      scrollTrigger: {
        trigger: section.current,
        start: "top 80%",
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out"
    });
  }, { scope: section });

  return (
    <section ref={section} className="py-24 md:py-48 relative z-10 px-6">
      <div className="container mx-auto">
        <SectionHeader
          subtitle="Identitas"
          title="Filosofi Logo"
          description="Logo kami bukan sekadar simbol, melainkan manifestasi dari semangat kreativitas tanpa batas dan keberanian untuk berekspresi."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="logo-card p-10 rounded-[3rem] bg-surface border border-white/5 shadow-brutalist-sm">
            <h4 className="text-2xl font-serif font-black text-white mb-4">Infinity</h4>
            <p className="text-gray-400 leading-relaxed">Melambangkan kreativitas manusia yang tidak seharusnya dibatasi. Terus berkembang, menjadi lebih baik, dan memiliki ciri khas tersendiri.</p>
          </div>
          <div className="logo-card p-10 rounded-[3rem] bg-surface border border-white/5 shadow-brutalist-sm">
            <h4 className="text-2xl font-serif font-black text-white mb-4">O.C Initials</h4>
            <p className="text-gray-400 leading-relaxed">Representasi dari OurCreativity. Wadah inklusif di mana setiap individu dapat mengeksplorasi bakat mereka secara bersama.</p>
          </div>
          <div className="logo-card p-10 rounded-[3rem] bg-surface border border-white/5 shadow-brutalist-rose">
            <h4 className="text-2xl font-serif font-black text-accentRed mb-4">Warna Merah</h4>
            <p className="text-gray-400 leading-relaxed">Makna keberanian yang dibutuhkan dalam berkarya. Tanpa keberanian, seseorang tidak akan pernah berkembang dan menciptakan sesuatu yang baru.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const VisionSection = () => {
  const section = useRef(null);

  useGSAP(() => {
    gsap.from(".vision-text", {
      scrollTrigger: {
        trigger: section.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2
    });
  }, { scope: section });

  return (
    <section ref={section} className="py-24 md:py-48 relative z-10 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeader
              subtitle="Visi Kami"
              title="Mengasah Bakat, Mencipta Karya"
              description="OurCreativityIDN bertujuan untuk mengembangkan jiwa kreatif anak muda Indonesia dengan menciptakan wadah bagi mereka untuk berdiskusi, berkolaborasi, dan menghasilkan karya."
            />
            <div className="space-y-6 vision-text">
              {[
                "Menghubungkan anak muda berbakat melalui media sosial untuk bergabung dalam komunitas.",
                "Menyedikan platform diskusi dan kolaborasi agar anggota dapat berbagi ilmu.",
                "Mempublikasikan setiap karya anggota melalui media sosial agar mendapatkan apresiasi luas.",
                "Menyelenggarakan program gratis (diskusi, event, proyek kolaboratif) untuk pengembangan diri.",
                "Mendorong anggota menguasai berbagai bidang kreatif demi karya yang inovatif & bernilai."
              ].map((misi, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1.5 w-4 h-4 rounded-full border border-accentRed flex items-center justify-center p-1">
                    <div className="w-full h-full bg-accentRed rounded-full" />
                  </div>
                  <p className="text-gray-400 text-sm md:text-base">{misi}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative vision-text">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-surface shadow-brutalist-rose">
              <img src={ASSETS.tagwalls[0]} alt="OurCreativity Vision" className="w-full h-full object-cover grayscale opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <p className="text-3xl md:text-5xl font-serif text-white text-center leading-tight">"Creativity is the <span className="text-accentRed italic">new currency</span> of the era."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PillarItem = ({ title, desc, mission, img, index }: { title: string, desc: string, mission: string, img: string, index: number }) => (
  <div className="pillar-card flex-shrink-0 w-[90vw] md:w-[700px] h-[75vh] md:h-[80vh] bg-surface border border-white/5 rounded-[3rem] overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-500 shadow-brutalist">
    <div className="h-2/5 relative overflow-hidden bg-[#0a0a0a]">
      <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40 group-hover:opacity-100" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-surface/80 backdrop-blur-xl border border-white/20 p-4 overflow-hidden flex items-center justify-center shadow-2xl z-20">
        <img
          src={img}
          className="w-full h-full object-contain rounded-full"
          alt={`${title} Icon`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = ASSETS.logoGeneric;
          }}
        />
      </div>
    </div>
    <div className="p-8 md:p-12 h-3/5 flex flex-col">
      <div className="mb-auto">
        <h3 className="text-4xl md:text-6xl font-serif font-black text-white mb-4 leading-none tracking-tighter">
          <span className="text-accentRed mr-4 leading-none inline-block">0{index + 1}</span>
          {title}
        </h3>
        <p className="text-gray-300 text-lg md:text-2xl italic font-serif opacity-80 mb-6">{desc}</p>
        <div className="h-[2px] w-12 bg-accentRed mb-6" />
        <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-4">{mission}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full bg-surfaceHighlight border-2 border-surface flex items-center justify-center text-[10px] font-bold">K{i}</div>
          ))}
          <div className="w-10 h-10 rounded-full bg-accentRed border-2 border-surface flex items-center justify-center text-[10px] font-bold text-white">+</div>
        </div>
        <button className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs group">
          Eksplorasi <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
        </button>
      </div>
    </div>
  </div>
);

const PillarsSection = () => {
  const container = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    const t = track.current;
    if (!t) return;

    const scrollWidth = t.scrollWidth - window.innerWidth;

    gsap.to(t, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: () => `+=${t.scrollWidth}`,
        pin: true,
        scrub: 1,
      }
    });
  }, { scope: container });

  const pillars = [
    { title: "Koding", desc: "Digital & Engineering", mission: "Membangun solusi masa depan melalui rekayasa perangkat lunak, eksplorasi AI, dan pengembangan teknologi web inovatif.", img: ASSETS.divisions.coding },
    { title: "Desain", desc: "Visual Aesthetics", mission: "Mengeksplorasi batas estetika visual melalui desain grafis, ilustrasi, UI/UX, dan komunikasi visual yang berdampak.", img: ASSETS.divisions.desain },
    { title: "Video", desc: "Cinematography", mission: "Menangkap esensi cerita melalui penceritaan visual, teknik pengambilan gambar profesional, dan penyuntingan sinematik.", img: ASSETS.divisions.video },
    { title: "Meme", desc: "Social Satire", mission: "Membangun kritik sosial yang cerdas melalui media humor, satir, dan pemahaman mendalam akan budaya pop modern.", img: ASSETS.divisions.meme },
    { title: "Karya Tulis", desc: "Critical Literacy", mission: "Mengasah ketajaman berpikir melalui literasi, jurnalisme investigasi, dan penulisan deskriptif yang menggugah.", img: ASSETS.divisions.karya }
  ];

  return (
    <section ref={container} className="h-screen bg-[#080808] relative z-20 overflow-hidden flex flex-col justify-center">
      <div className="absolute top-12 left-12 md:left-24 z-30">
        <h2 className="text-xl md:text-3xl font-serif text-white flex items-center gap-4">
          <Activity className="text-accentRed animate-pulse" />
          Pilar Kinerja Kami
        </h2>
      </div>
      <div ref={track} className="flex gap-12 px-12 md:px-24 w-max items-center h-full pt-20">
        {pillars.map((p, i) => <PillarItem key={i} index={i} {...p} />)}
        <div className="w-[20vw] h-full" /> {/* Buffer space */}
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const section = useRef(null);

  useGSAP(() => {
    gsap.from(".timeline-item", {
      scrollTrigger: {
        trigger: section.current,
        start: "top 70%",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });
  }, { scope: section });

  const milestones = [
    { year: "2024", title: "Januari: Kelahiran", desc: "Didirikan sebagai wadah bagi mereka yang memiliki kemauan belajar namun tidak memiliki tempat untuk bertanya.", color: "from-rose-500" },
    { year: "2024", title: "Februari: Pergerakan", desc: "Memanfaatkan media sosial untuk menarik minat pemuda berbakat dengan konten kreatif yang menginspirasi.", color: "from-purple-500" },
    { year: "2024", title: "Milestone: 3000+ Member", desc: "Dalam waktu kurang dari setahun, berhasil mengumpulkan ribuan anggota kreatif dari seluruh penjuru Indonesia.", color: "from-blue-500" },
    { year: "2024", title: "Ekspansi Divisi", desc: "Formalisasi Edisi Desain, Video, Meme, dan Karya Tulis untuk mengarahkan anggota mulai berkolaborasi.", color: "from-emerald-500" },
    { year: "2025", title: "Website & Divisi Coding", desc: "Peluncuran platform resmi OurCreativity sekaligus peresmian Divisi Coding sebagai pilar pendukung ekosistem teknologi.", color: "from-yellow-500" }
  ];

  return (
    <section ref={section} className="py-32 md:py-48 relative z-10 px-8 bg-[#020202]">
      <div className="container mx-auto">
        <SectionHeader subtitle="Perjalanan Kami" title="Timeline Evolusi" description="Dari mimpi kecil menjadi ekosistem kreativitas terbesar di kalangan siswa Indonesia. Setiap milestone adalah bukti dedikasi komunitas." />

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accentRed via-purple-500 to-transparent" />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((milestone, i) => (
              <div key={i} className={`timeline-item flex flex-col md:flex-row gap-8 items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 flex justify-start md:justify-end">
                  <div className={`relative group ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block px-8 py-4 rounded-[2rem] border border-white/10 bg-surface backdrop-blur-xl shadow-brutalist-sm ${i % 2 === 0 ? '' : 'md:ml-auto'}`}>
                      <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${milestone.color} to-white mb-2`}>{milestone.year}</div>
                      <h3 className="text-2xl font-serif font-black text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-md">{milestone.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 w-6 h-6 -ml-3 rounded-full bg-surface border-4 border-accentRed shadow-[0_0_20px_rgba(225,29,72,0.5)] z-10" />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImpactSection = () => {
  const section = useRef(null);

  useGSAP(() => {
    gsap.from(".stat-card", {
      scrollTrigger: {
        trigger: section.current,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.2)"
    });
  }, { scope: section });

  const stats = [
    { val: "3000+", label: "Member Terdaftar", color: "text-rose-500", desc: "Kreator dari seluruh Indonesia yang bergabung dalam kurun < 1 tahun", icon: Users },
    { val: "500+", label: "Karya Terkurasi", color: "text-purple-500", desc: "Karya berkualitas tinggi yang telah melewati proses kurasi di @ourcreativity.ofc", icon: Share2 },
    { val: "4", label: "Edisi Grup", color: "text-emerald-500", desc: "Grup spesialis: Desain Grafis, Video Editing, Meme, dan Karya Tulis", icon: Globe },
    { val: "24/7", label: "Wadah Diskusi", color: "text-blue-500", desc: "Tempat bertanya dan berbagi ilmu tanpa batas waktu", icon: Activity }
  ];

  return (
    <section ref={section} className="py-32 md:py-48 relative z-10 px-6">
      <div className="container mx-auto">
        <SectionHeader subtitle="Dampak Nyata" title="Statistik Pertumbuhan" description="Angka-angka yang mencerminkan dedikasi dan semangat kolektif komunitas OurCreativity dalam memajukan ekosistem kreativitas siswa Indonesia." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="stat-card group p-10 md:p-14 rounded-[4rem] bg-surface border border-white/5 flex flex-col hover:bg-surfaceHighlight hover:border-white/10 transition-all duration-700 shadow-brutalist-rose-sm relative overflow-hidden">
              {/* Background Glow */}
              <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${s.color.replace('text-', 'from-')}/20 to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              {/* Background Icon */}
              <div className="absolute top-12 right-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <s.icon size={160} />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${s.color} shadow-inner`}>
                    <s.icon size={36} />
                  </div>
                  <div className={`text-7xl md:text-8xl font-black tracking-tighter ${s.color}`}>
                    <AnimatedNumber value={s.val} />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-black text-3xl mb-4 tracking-tight group-hover:text-accentRed transition-colors">{s.label}</h4>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm">{s.desc}</p>
                </div>

                {/* Progress Bar Visual */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Performance Level</span>
                    <span className={`text-xs font-mono ${s.color}`}>ACTIVE_GROWTH</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className={`h-full bg-gradient-to-r ${s.color.replace('text-', 'from-')} to-rose-500 group-hover:w-full transition-all duration-[2000ms] shadow-[0_0_15px_rgba(225,29,72,0.3)]`}
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-accentRed/5 to-purple-500/10 border border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:scale-110 transition-transform">
                <AnimatedNumber value="12+" />
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">Jam Aktivitas Harian</div>
            </div>
            <div className="text-center group border-y md:border-y-0 md:border-x border-white/5 py-8 md:py-0">
              <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:scale-110 transition-transform">
                <AnimatedNumber value="5" />
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">Divisi Spesialis</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:scale-110 transition-transform uppercase">
                ACTIVE
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">Community Status</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GalllerySection = () => {
  const galleryItems = [
    { src: ASSETS.tagwalls[0], title: "Brutalism Design Tagwall", category: "Graphic Design" },
    { src: ASSETS.tagwalls[1], title: "Edisi Kemerdekaan", category: "Event Identity" },
    { src: ASSETS.tagwalls[2], title: "Superheroes Universe", category: "Illustration" },
    { src: ASSETS.tagwalls[3], title: "90s Retro Aesthetic", category: "Visual Style" },
    { src: ASSETS.tagwalls[4], title: "Visual Exploration Vol. 1", category: "Video Assets" },
    { src: ASSETS.tagwalls[5], title: "Cinematic Motion Study", category: "Motion Graphics" },
    { src: ASSETS.tagwalls[6], title: "Poet Box Collection", category: "Literature" },
    { src: ASSETS.tagwalls[7], title: "Rabu dan Sihir", category: "Fiction Story" },
    { src: ASSETS.tagwalls[8], title: "Interactive Story Voting", category: "Community Project" },
  ];

  return (
    <section className="py-32 bg-black relative z-10 px-6">
      <div className="container mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeader subtitle="Eksibisi" title="Galeri Karya" />
          <button className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs h-fit hover:scale-105 transition-transform flex items-center gap-2">
            Galeri Lengkap <ArrowRight size={16} />
          </button>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryItems.map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <span className="text-accentRed text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.category}</span>
                <h4 className="text-2xl font-serif text-white font-black leading-tight">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-24 md:py-48 relative z-10 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-5 blur-[150px]" />
      <div className="container mx-auto relative text-center">
        <div className="mb-12">
          <h2 className="text-6xl md:text-[10rem] font-serif font-black text-white leading-[0.85] tracking-tighter mb-12">
            SIAP UNTUK <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentRed to-accentPurple">TERLIBAT?</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 items-center mb-24">
          <button className="px-12 py-6 bg-accentRed text-white font-bold text-xl rounded-full shadow-brutalist-rose-lg hover:-translate-y-2 hover:-translate-x-1 transition-all duration-300 flex items-center gap-4 group">
            JADI MEMBER <Zap size={24} fill="white" className="group-hover:animate-bounce" />
          </button>
          <button className="px-12 py-6 bg-white text-black font-bold text-xl rounded-full shadow-brutalist-lg hover:-translate-y-2 hover:-translate-x-1 transition-all duration-300">
            KOLABORASI
          </button>
        </div>

        <div className="flex justify-center gap-12 text-gray-600 font-bold uppercase tracking-widest text-xs">
          <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
          <span className="hover:text-white transition-colors cursor-pointer">Discord</span>
          <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
        </div>
      </div>
    </section>
  );
};

// --- Main Page ---

export const Story = () => {
  useGSAP(() => {
    gsap.to(".scroll-progress-bar", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  });

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-accentRed selection:text-white">
      <BackgroundOrbs />
      <Hero />
      <VisionSection />
      <LogoPhilosophy />
      <TimelineSection />
      <PillarsSection />
      <ImpactSection />
      <GalllerySection />
      <CtaSection />

      {/* Scroll Indicator Custom */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 mix-blend-difference hidden md:flex">
        <div className="w-[2px] h-24 bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-accentRed h-0 scroll-progress-bar" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest rotate-90 origin-bottom-right mt-12">OC.V5.0</span>
      </div>
    </div>
  );
};
