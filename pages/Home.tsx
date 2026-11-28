import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { EDISI, EDISI_ASOF, PROGRAM, DISCORD_URL, IG_UTAMA } from '../lib/edisi';
import { WorksGlobe } from '../components/modern/WorksGlobe';
import { WorkLightbox } from '../components/modern/WorkLightbox';
import { HoverPreview, Magnet, RiseText, useScrollSkew } from '../components/modern/micro';
import { Reveal } from '../components/modern/Reveal';

const Arrow = () => <span className="oc-arrow inline-block">↗</span>;

const useWide = () => {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return wide;
};

export const Home = () => {
  const { data: works = [], isLoading } = useWorks(240);
  const { hash } = useLocation();
  const wide = useWide();
  const [openId, setOpenId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
  const skew = useScrollSkew(6);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const withImage = useMemo(() => works.filter((w) => w.image), [works]);
  const globeItems = useMemo(() => withImage.slice(0, 150), [withImage]);
  const numbers = useMemo(() => new Map([...works].reverse().map((w, i) => [w.id, i + 1] as [string, number])), [works]);
  const openIndex = openId ? withImage.findIndex((w) => w.id === openId) : -1;
  const step = (d: number) =>
    setOpenId((cur) => {
      if (!withImage.length) return null;
      const i = withImage.findIndex((w) => w.id === cur);
      return withImage[(i + d + withImage.length) % withImage.length].id;
    });

  const byEdisi = useMemo(() => {
    const m = new Map<string, typeof withImage>();
    withImage.forEach((w) => m.set(w.edisi, [...(m.get(w.edisi) ?? []), w]));
    return m;
  }, [withImage]);

  return (
    <div className="text-[#0E0E0F]">
      {/* Hero: globe karya, judul di atasnya memakai blend difference supaya terbaca di atas gambar apa pun. */}
      <section className="oc-grid-paper relative overflow-hidden" style={{ height: 'calc(100svh - var(--nav-h))', minHeight: 620 }}>
        <WorksGlobe
          items={globeItems}
          mode="globe"
          onOpen={setOpenId}
          captureWheel={false}
          className="absolute inset-0"
          radiusScale={wide ? 0.39 : 0.34}
          offsetX={wide ? 0.17 : 0}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white mix-blend-difference md:p-8">
          <div className="flex justify-between font-mono text-[11px]">
            <span>(Katalog) {isLoading ? '…' : works.length} karya · {EDISI.length} edisi</span>
            <span className="hidden md:block">Seret bola untuk memutar ↻</span>
          </div>
          <div>
            <h1 className="max-w-[11ch] font-display text-[clamp(3.2rem,10.4vw,10.6rem)] font-bold leading-[0.86] tracking-[-0.055em]">
              <RiseText text="Para member yang" delay={120} />
              <br />
              <span className="font-editorial font-normal italic tracking-[-0.03em]"><RiseText text="berkarya." delay={560} /></span>
            </h1>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
              <p className="max-w-[34ch] text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.4]">
                Komunitas desainer, ilustrator, pembuat meme, programmer, editor video, fotografer, dan penulis. Semua karyanya dikumpulkan di satu katalog.
              </p>
              <div className="pointer-events-auto flex flex-wrap gap-6">
                <Magnet><Link to="/karya" className="oc-link" data-cursor="Masuk">Jelajahi katalog <Arrow /></Link></Magnet>
                <Magnet><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link">Masuk Discord <Arrow /></a></Magnet>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker akun */}
      <div className="overflow-hidden border-y border-[#0E0E0F] bg-[#0E0E0F] py-3 text-[#EDEDEB]" aria-hidden>
        <div ref={skew} className="will-change-transform">
          <div className="oc-marquee flex w-max gap-10 font-display text-[clamp(1.2rem,2.2vw,2rem)] font-semibold tracking-[-0.03em]">
            {[0, 1].map((k) => (
              <div key={k} className="flex gap-10">
                {EDISI.map((e) => (
                  <span key={`${k}-${e.key}`} className="flex items-center gap-10 whitespace-nowrap">
                    @{e.handle}
                    <i className="inline-block h-2 w-2 rounded-full" style={{ background: e.warna === '#161616' ? '#EDEDEB' : e.warna }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edisi */}
      <section id="edisi" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <Reveal className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Edisi)</h2>
            <span>{EDISI.length} edisi, tiap edisi punya akun sendiri. Arahkan kursor untuk mengintip.</span>
          </Reveal>
          <Reveal className="mb-[clamp(26px,4vw,56px)] mt-[clamp(20px,3vw,40px)] max-w-[16ch] text-balance font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Tujuh cara untuk <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">membuat</em> sesuatu.
          </Reveal>
          <ul className="border-t border-[#0E0E0F]/15" onPointerLeave={() => setPreview(null)}>
            {EDISI.map((e, i) => {
              const pool = byEdisi.get(e.key) ?? [];
              const imgs = pool.slice(0, 6).map((w) => w.image as string);
              return (
                <Reveal as="li" key={e.key} delay={i * 40}>
                  <Link
                    to={`/karya?edisi=${e.key}`}
                    onPointerEnter={() => setPreview(imgs)}
                    onFocus={() => setPreview(imgs)}
                    onBlur={() => setPreview(null)}
                    className="group grid grid-cols-[1fr_28px] items-center gap-3 border-b border-[#0E0E0F]/15 py-[clamp(14px,1.6vw,22px)] transition-all duration-300 hover:bg-[#0E0E0F] hover:px-3 hover:text-[#EDEDEB] focus-visible:bg-[#0E0E0F] focus-visible:px-3 focus-visible:text-[#EDEDEB] md:grid-cols-[6fr_3fr_3fr_28px] md:gap-7"
                  >
                    <h3 className="flex items-center gap-[0.28em] font-display text-[clamp(1.9rem,4.6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] transition-transform duration-300 group-hover:translate-x-2">
                      <span aria-hidden className="h-[0.2em] w-[0.2em] flex-none rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: e.warna }} />
                      {e.nama}
                    </h3>
                    <div className="hidden gap-0.5 font-mono text-[11px] opacity-70 md:grid">
                      <span>@{e.handle}</span>
                      <span>{e.pengikut} pengikut</span>
                    </div>
                    <div className="hidden font-mono text-[11px] opacity-70 md:block">{isLoading ? '…' : `${pool.length} karya di katalog`}</div>
                    <span className="justify-self-end text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden>↗</span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-[10px] text-[#8A8A8F]">Pengikut Instagram per {EDISI_ASOF}.</p>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <Reveal className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Program)</h2>
            <span>Dari highlight Instagram</span>
          </Reveal>
          <Reveal className="mb-[clamp(26px,4vw,56px)] mt-[clamp(20px,3vw,40px)] max-w-[16ch] text-balance font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Selalu ada yang <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">jalan</em>.
          </Reveal>
          <div className="border-t border-[#0E0E0F]/15">
            {PROGRAM.map((p, i) => (
              <Reveal key={p.nama} delay={(i % 4) * 50} className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-b border-[#0E0E0F]/15 py-4 transition-colors hover:bg-[#0E0E0F]/[0.04] md:grid-cols-12">
                <h3 className="font-display text-[clamp(1.3rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-transform duration-300 group-hover:translate-x-2 md:col-span-5">{p.nama}</h3>
                <span className="font-mono text-[11px] text-[#8A8A8F] md:col-span-2">{p.edisi}</span>
                <p className="text-[0.98rem] leading-[1.45] text-[#55555A] md:col-span-5">{p.ket}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gabung */}
      <section id="gabung" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <Reveal className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Gabung)</h2>
            <span>Tidak perlu portofolio besar</span>
          </Reveal>
          <Reveal className="mt-[clamp(20px,3vw,40px)] font-display text-[clamp(4.4rem,17vw,17rem)] font-bold leading-[0.8] tracking-[-0.07em]">
            Gabung<em className="font-editorial font-normal italic tracking-[-0.03em]">.</em>
          </Reveal>
          <div className="mt-[clamp(26px,4vw,56px)] grid grid-cols-1 gap-7 md:grid-cols-12 md:gap-x-6">
            <ol className="border-t border-[#0E0E0F]/15 md:col-span-7">
              {[
                ['Pilih edisi', 'Buka profil edisi yang paling dekat dengan keahlianmu.'],
                ['Isi formulir di bio', 'Tiap edisi menaruh tautan pendaftarannya sendiri.'],
                ['Pamerkan', 'Kenalan di Discord, ikut kegiatan, kirim karya pertamamu.'],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 80} className="grid grid-cols-[48px_1fr] border-b border-[#0E0E0F]/15 py-3.5 text-[1.05rem]">
                  <span className="font-mono text-[11px] text-[#8A8A8F]">{i + 1}</span>
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
