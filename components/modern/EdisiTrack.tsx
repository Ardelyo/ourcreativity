import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDISI } from '../../lib/edisi';
import type { PublicWork } from '../../lib/works';

interface Props {
  works: PublicWork[];
  loading: boolean;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Tujuh edisi sebagai trek horizontal. Di layar lebar, bagian ini disematkan (sticky) dan gulir vertikal
// menggeser trek ke samping, sementara gambar di tiap kartu bergerak dengan kecepatan berbeda (paralaks).
// Di layar sempit trek menjadi carousel geser biasa.
export const EdisiTrack: React.FC<Props> = ({ works, loading }) => {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const byEdisi = useMemo(() => {
    const m = new Map<string, PublicWork[]>();
    works.filter((w) => w.image).forEach((w) => m.set(w.edisi, [...(m.get(w.edisi) ?? []), w]));
    return m;
  }, [works]);

  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr || !desktop) {
      setHeight(undefined);
      if (tr) tr.style.transform = '';
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let trackW = 0;
    let vw = 0;
    let vh = 0;
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      trackW = tr.scrollWidth;
      setHeight(Math.max(vh, trackW - vw + vh));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener('resize', measure);

    const cards = Array.from(tr.querySelectorAll<HTMLElement>('[data-card]'));
    let x = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = sec.getBoundingClientRect();
      const total = Math.max(1, r.height - vh);
      const p = clamp01(-r.top / total);
      const target = -p * Math.max(0, trackW - vw);
      x += (target - x) * (reduce ? 1 : 0.12);
      tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((c, i) => {
        const b = c.getBoundingClientRect();
        const d = (b.left + b.width / 2 - vw / 2) / vw;
        if (Math.abs(d) < best) {
          best = Math.abs(d);
          nearest = i;
        }
        if (reduce) return;
        c.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
          const f = parseFloat(el.dataset.par ?? '0');
          el.style.transform = `translate3d(${(-d * f * 90).toFixed(1)}px,0,0)`;
        });
      });
      if (label.current) label.current.textContent = nearest === 0 ? 'Pengantar' : (EDISI[nearest - 1]?.nama ?? 'Semua karya');
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [desktop, works]);

  const cards = (
    <div
      ref={track}
      className={desktop ? 'flex h-full w-max items-center gap-0 will-change-transform' : 'flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4'}
    >
      <div data-card className="flex h-[min(72svh,620px)] w-[min(86vw,820px)] flex-none snap-center flex-col justify-between px-4 md:px-8">
        <div className="border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">(Edisi) {EDISI.length} edisi, tiap edisi punya akun sendiri</div>
        <h2 className="max-w-[12ch] text-balance font-display text-[clamp(2.8rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em]">
          Tujuh cara untuk <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">membuat</em> sesuatu.
        </h2>
        <p className="font-mono text-[11px] text-[#55555A]">{desktop ? 'Gulir untuk menggeser →' : 'Geser ke samping →'}</p>
      </div>

      {EDISI.map((e) => {
        const pool = byEdisi.get(e.key) ?? [];
        const a = pool[0];
        const b = pool[1];
        const c = pool[2];
        return (
          <Link
            key={e.key}
            to={`/edisi/${e.key}`}
            data-card
            data-cursor="Lihat"
            className="group relative mx-3 flex h-[min(72svh,620px)] w-[min(78vw,640px)] flex-none snap-center flex-col justify-between overflow-hidden border border-[#0E0E0F]/15 bg-[#E4E4E1] p-4 transition-colors duration-300 hover:bg-[#0E0E0F] hover:text-[#EDEDEB] md:p-6"
          >
            <div className="relative z-10 flex items-center justify-between font-mono text-[11px]">
              <span className="flex items-center gap-2"><i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: e.warna === '#161616' ? '#8A8A8F' : e.warna }} />@{e.handle}</span>
              <span>{loading ? '…' : `${pool.length} karya`}</span>
            </div>

            <div className="pointer-events-none absolute inset-x-6 bottom-24 top-14">
              {a && (
                <div data-par="0.5" className="absolute bottom-0 left-0 w-[52%] transition-transform duration-500 group-hover:-translate-y-2">
                  <img src={a.image as string} alt="" loading="lazy" decoding="async" className="h-full max-h-[48svh] w-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]" style={{ aspectRatio: '4 / 5' }} />
                </div>
              )}
              {b && (
                <div data-par="1.1" className="absolute right-0 top-0 w-[34%] transition-transform duration-500 group-hover:translate-x-1">
                  <img src={b.image as string} alt="" loading="lazy" decoding="async" className="w-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]" style={{ aspectRatio: '1 / 1' }} />
                </div>
              )}
              {c && (
                <div data-par="0.8" className="absolute bottom-6 right-4 w-[40%] transition-transform duration-500 group-hover:translate-y-1">
                  <img src={c.image as string} alt="" loading="lazy" decoding="async" className="w-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]" style={{ aspectRatio: '3 / 4' }} />
                </div>
              )}
            </div>

            <div className="relative z-10 flex items-end justify-between gap-3">
              <h3 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] font-bold leading-[0.9] tracking-[-0.055em] text-[#0E0E0F] transition-colors duration-300 group-hover:text-[#EDEDEB]">{e.nama}</h3>
              <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden>↗</span>
            </div>
          </Link>
        );
      })}

      <div data-card className="flex h-[min(72svh,620px)] w-[min(70vw,520px)] flex-none snap-center flex-col justify-end px-6 md:px-10">
        <Link to="/edisi" data-cursor="Masuk" className="font-display text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[0.92] tracking-[-0.05em] underline decoration-2 underline-offset-8">
          Lihat semua edisi <span className="oc-arrow inline-block">↗</span>
        </Link>
      </div>
    </div>
  );

  if (!desktop) {
    return (
      <section id="edisi" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]" aria-label="Edisi">
        {cards}
      </section>
    );
  }

  return (
    <section id="edisi" ref={section} style={{ height }} className="relative" aria-label="Edisi">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]">
        {cards}
        <div className="pointer-events-none absolute inset-x-8 bottom-6 flex items-center gap-4 font-mono text-[11px]">
          <span ref={label} className="min-w-[110px]">Pengantar</span>
          <div className="h-px flex-1 bg-[#0E0E0F]/20"><div ref={bar} className="h-px origin-left bg-[#0E0E0F]" style={{ transform: 'scaleX(0)' }} /></div>
        </div>
      </div>
    </section>
  );
};
