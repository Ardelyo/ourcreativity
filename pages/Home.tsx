import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { EDISI, EDISI_ASOF, PROGRAM, DISCORD_URL, IG_UTAMA } from '../lib/edisi';
import { WorksGlobe, type GlobeHandle } from '../components/modern/WorksGlobe';
import { WorkLightbox } from '../components/modern/WorkLightbox';
import { CountUp, HoverPreview, Magnet, ProximityText, ScrollBadge } from '../components/modern/micro';
import { Reveal } from '../components/modern/Reveal';
import { HomeIntro } from '../components/modern/HomeIntro';
import { ScrollStatement, type StatementToken } from '../components/modern/ScrollStatement';
import { EdisiTrack } from '../components/modern/EdisiTrack';
import { ScrollRows } from '../components/modern/ScrollRows';

const Arrow = () => <span className="oc-arrow inline-block">↗</span>;

// Intro hanya diputar sekali per pemuatan halaman, bukan setiap kembali ke Home lewat navigasi.
let introPlayed = false;

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useWide = () => {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return wide;
};

type Phase = 'intro' | 'dock' | 'done';

export const Home = () => {
  const { data: works = [], isLoading, isFetched } = useWorks(240);
  const { hash } = useLocation();
  const wide = useWide();
  const [phase, setPhase] = useState<Phase>(() => (introPlayed || reducedMotion() ? 'done' : 'intro'));
  const [openId, setOpenId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);

  const globe = useRef<GlobeHandle>(null);
  const globeWrap = useRef<HTMLDivElement>(null);
  const loadProgress = useRef({ done: 0, total: 0 });
  const onProgress = useCallback((done: number, total: number) => {
    loadProgress.current = { done, total };
  }, []);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const withImage = useMemo(() => works.filter((w) => w.image), [works]);
  const globeItems = useMemo(() => withImage.slice(0, 150), [withImage]);
  const numbers = useMemo(() => new Map([...works].reverse().map((w, i) => [w.id, i + 1] as [string, number])), [works]);
  const creators = useMemo(() => new Set(works.map((w) => w.username ?? w.author)).size, [works]);
  const openIndex = openId ? withImage.findIndex((w) => w.id === openId) : -1;
  const step = (d: number) =>
    setOpenId((cur) => {
      if (!withImage.length) return null;
      const i = withImage.findIndex((w) => w.id === cur);
      return withImage[(i + d + withImage.length) % withImage.length].id;
    });

  // Intro selesai: bola meluncur ke header, lalu halaman bisa digulir.
  const dock = useCallback(() => {
    introPlayed = true;
    setPhase('dock');
    window.setTimeout(() => setPhase('done'), 1800);
  }, []);

  // Bola ikut bereaksi pada gulir: terdorong naik, mengecil, dan berputar sesuai kecepatan gulir.
  useEffect(() => {
    if (reducedMotion()) return;
    let last = window.scrollY;
    let raf = 0;
    let p = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const d = y - last;
      last = y;
      if (d !== 0) globe.current?.kick(Math.max(-0.05, Math.min(0.05, d * 0.0007)));
      const target = Math.max(0, Math.min(1, y / (window.innerHeight * 0.9)));
      p += (target - p) * 0.12;
      const el = globeWrap.current;
      if (el) {
        el.style.transform = `translate3d(0, ${(p * 14).toFixed(2)}%, 0) scale(${(1 - p * 0.2).toFixed(3)})`;
        el.style.opacity = String(1 - p * 0.55);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const intro = phase === 'intro';
  const docked = phase !== 'intro';
  // Posisi bola: penuh di tengah saat intro, lalu mendarat di sisi kanan header (atau di atas pada layar sempit).
  const radius = intro ? (wide ? 0.47 : 0.42) : wide ? 0.37 : 0.34;
  const offX = intro ? 0 : wide ? 0.27 : 0;
  const offY = intro ? 0 : wide ? -0.03 : -0.14;

  const statement = useMemo<StatementToken[]>(() => {
    const pick = (i: number) => withImage[(i * 23 + 5) % Math.max(1, withImage.length)]?.image;
    const img = (i: number): StatementToken[] => {
      const s = pick(i);
      return s ? [{ img: s }] : [];
    };
    return [
      'Desainer,', ...img(0), 'ilustrator,', ...img(1), 'pembuat meme,', ...img(2), 'programmer,', ...img(3),
      'editor video,', ...img(4), 'fotografer,', ...img(5), 'dan penulis', 'berkarya', 'di', 'satu', 'rumah.',
      'Setiap', 'karya', 'dapat', 'panggung,', 'setiap', 'member', 'dapat', 'teman.',
    ];
  }, [withImage]);

  const programPool = (edisiName: string): string[] => {
    const key = EDISI.find((e) => e.nama === edisiName)?.key;
    const pool = key ? withImage.filter((w) => w.edisi === key) : withImage;
    return pool.slice(0, 5).map((w) => w.image as string);
  };

  const scrollDown = () => window.scrollTo({ top: window.innerHeight * 0.92, behavior: 'smooth' });

  return (
    <div className="text-[#0E0E0F]">
      {/* Hero. Bola karya mulai besar di tengah (intro), lalu mendarat di posisi header. */}
      <section className="oc-grid-paper relative overflow-hidden" style={{ height: '100svh', minHeight: 640 }}>
        <div ref={globeWrap} className="absolute inset-0 will-change-transform">
          <WorksGlobe
            ref={globe}
            items={globeItems}
            mode="globe"
            onOpen={setOpenId}
            captureWheel={false}
            className="absolute inset-0"
            radiusScale={radius}
            offsetX={offX}
            offsetY={offY}
            onProgress={onProgress}
          />
        </div>

        {intro && (
          <HomeIntro progress={loadProgress} settled={isFetched} hasWorks={withImage.length > 0} totalWorks={works.length} onDock={dock} />
        )}

        <div
          className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-4 pb-5 pt-[calc(var(--nav-h)+16px)] text-white mix-blend-difference transition-opacity duration-700 md:px-8 md:pb-8 ${docked ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex justify-between font-mono text-[11px]">
            <span>(Katalog) <CountUp to={works.length} /> karya · {EDISI.length} edisi</span>
            <span className="hidden md:block">Seret bola untuk memutar ↻</span>
          </div>
          <div>
            {docked && (
              <h1 className="max-w-[11ch] font-display text-[clamp(3rem,8.4vw,9rem)] leading-[0.86] tracking-[-0.055em]">
                <ProximityText text="Para member yang" riseDelay={200} />
                <br />
                <span className="font-editorial font-normal italic tracking-[-0.03em]"><ProximityText text="berkarya." riseDelay={640} baseWght={400} maxWght={400} baseWdth={100} maxWdth={100} /></span>
              </h1>
            )}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
              <p className="max-w-[34ch] text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.4]">
                Komunitas desainer, ilustrator, pembuat meme, programmer, editor video, fotografer, dan penulis. Semua karyanya dikumpulkan di satu katalog.
              </p>
              <div className="pointer-events-auto flex flex-wrap items-center gap-6">
                <Magnet><Link to="/karya" className="oc-link" data-cursor="Masuk">Jelajahi katalog <Arrow /></Link></Magnet>
                <Magnet><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link">Masuk Discord <Arrow /></a></Magnet>
                <div className="hidden md:block"><ScrollBadge onClick={scrollDown} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pernyataan yang menyala mengikuti gulir */}
      <section className="mx-auto max-w-[1560px] px-4 py-[clamp(70px,12vw,200px)] md:px-8">
        <div className="mb-8 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">(Tentang)</div>
        <ScrollStatement
          tokens={statement}
          className="max-w-[18ch] font-display text-[clamp(2.2rem,6.6vw,6.6rem)] font-bold leading-[1.0] tracking-[-0.05em] md:max-w-[22ch]"
        />
      </section>

      {/* Angka */}
      <section className="mx-auto max-w-[1560px] px-4 pb-[clamp(60px,9vw,140px)] md:px-8">
        <dl className="grid grid-cols-2 border-t border-[#0E0E0F]/20 md:grid-cols-4">
          {[
            { k: 'Pengikut @' + IG_UTAMA, v: <CountUp to={31.3} decimals={1} suffix="K" /> },
            { k: 'Karya terbit di Instagram', v: <CountUp to={8402} /> },
            { k: 'Karya di katalog ini', v: <CountUp to={works.length} /> },
            { k: 'Kreator yang tampil', v: <CountUp to={creators} /> },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 80} className="border-b border-[#0E0E0F]/20 py-5 pr-4 md:border-b-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-5">
              <dd className="font-display text-[clamp(2.6rem,6.6vw,6.2rem)] font-bold leading-[0.9] tracking-[-0.06em]">{s.v}</dd>
              <dt className="mt-2 font-mono text-[11px] text-[#55555A]">{s.k}</dt>
            </Reveal>
          ))}
        </dl>
        <p className="mt-3 font-mono text-[10px] text-[#8A8A8F]">Instagram per {EDISI_ASOF}.</p>
      </section>

      {/* Edisi: trek horizontal yang disematkan */}
      <EdisiTrack works={works} loading={isLoading} />

      {/* Sorotan karya yang bergeser mengikuti gulir */}
      <ScrollRows rowA={withImage.filter((_, i) => i % 2 === 0).slice(0, 24)} rowB={withImage.filter((_, i) => i % 2 === 1).slice(0, 24)} />

      {/* Program */}
      <section id="program" className="scroll-mt-16 pt-[clamp(30px,5vw,80px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <Reveal className="oc-rule flex items-baseline justify-between gap-4 pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Program)</h2>
            <span>Dari highlight Instagram. Arahkan kursor untuk mengintip.</span>
          </Reveal>
          <Reveal className="mb-[clamp(26px,4vw,56px)] mt-[clamp(20px,3vw,40px)] max-w-[16ch] text-balance font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Selalu ada yang <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">jalan</em>.
          </Reveal>
          <div className="border-t border-[#0E0E0F]/15" onPointerLeave={() => setPreview(null)}>
            {PROGRAM.map((p, i) => (
              <Reveal
                key={p.nama}
                delay={(i % 4) * 50}
                className="group grid cursor-default grid-cols-1 items-baseline gap-x-6 gap-y-1 border-b border-[#0E0E0F]/15 py-4 transition-colors hover:bg-[#0E0E0F] hover:text-[#EDEDEB] md:grid-cols-12"
              >
                <div className="contents" onPointerEnter={() => setPreview(programPool(p.edisi))}>
                  <h3 className="font-display text-[clamp(1.3rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-3 md:col-span-5">{p.nama}</h3>
                  <span className="font-mono text-[11px] opacity-60 md:col-span-2">{p.edisi}</span>
                  <p className="text-[0.98rem] leading-[1.45] opacity-80 md:col-span-5">{p.ket}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gabung */}
      <section id="gabung" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <Reveal className="oc-rule flex items-baseline justify-between gap-4 pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Gabung)</h2>
            <span>Tidak perlu portofolio besar</span>
          </Reveal>
          <div className="mt-[clamp(20px,3vw,40px)] font-display text-[clamp(4.4rem,17vw,17rem)] leading-[0.8] tracking-[-0.07em]">
            <ProximityText text="Gabung." baseWght={700} maxWght={900} range={420} />
          </div>
          <div className="mt-[clamp(26px,4vw,56px)] grid grid-cols-1 gap-7 md:grid-cols-12 md:gap-x-6">
            <ol className="border-t border-[#0E0E0F]/15 md:col-span-7">
              {[
                ['Pilih edisi', 'Buka profil edisi yang paling dekat dengan keahlianmu.'],
                ['Isi formulir di bio', 'Tiap edisi menaruh tautan pendaftarannya sendiri.'],
                ['Pamerkan', 'Kenalan di Discord, ikut kegiatan, kirim karya pertamamu.'],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 80} className="group grid grid-cols-[48px_1fr] border-b border-[#0E0E0F]/15 py-3.5 text-[1.05rem]">
                  <span className="font-mono text-[11px] text-[#8A8A8F] transition-transform duration-300 group-hover:translate-x-1">{i + 1}</span>
                  <div><b className="block font-semibold">{t}</b>{d}</div>
                </Reveal>
              ))}
            </ol>
            <div className="grid content-start gap-3 md:col-span-4 md:col-start-9">
              <Magnet strength={0.12}><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link-lg w-full">Masuk Discord <Arrow /></a></Magnet>
              <Magnet strength={0.12}><a href={`https://www.instagram.com/${IG_UTAMA}/`} target="_blank" rel="noopener noreferrer" className="oc-link-lg w-full">@{IG_UTAMA} <Arrow /></a></Magnet>
              <Magnet strength={0.12}><Link to="/register" className="oc-link-lg w-full">Buat akun platform <Arrow /></Link></Magnet>
            </div>
          </div>
        </div>
      </section>

      <HoverPreview images={preview} />
      {openIndex >= 0 && <WorkLightbox items={withImage} index={openIndex} numbers={numbers} onClose={() => setOpenId(null)} onStep={step} />}
    </div>
  );
};
