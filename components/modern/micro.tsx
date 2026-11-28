import React, { useEffect, useRef, useState } from 'react';

// Kumpulan micro-interaction kecil yang dipakai di landing dan galeri.

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Teks yang naik huruf demi huruf dari balik garis. Selesai berarti teks tampil normal. */
export const RiseText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = '' }) => {
  const words = text.split(' ');
  let n = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          {w.split('').map((c) => {
            const i = n++;
            return (
              <span key={i} className="oc-rise inline-block" style={{ animationDelay: `${delay + i * 28}ms` }}>
                {c}
              </span>
            );
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
};

/** Elemen yang tertarik ke arah pointer saat didekati, lalu kembali dengan pegas. */
export const Magnet: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({ children, strength = 0.28, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      const reach = Math.max(b.width, b.height) * 0.9 + 40;
      if (Math.hypot(dx, dy) < reach) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0;
        ty = 0;
      }
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [strength]);
  return <div ref={ref} className={`inline-block will-change-transform ${className}`}>{children}</div>;
};

/** Memiringkan elemen mengikuti kecepatan gulir halaman. */
export const useScrollSkew = (max = 7) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let last = window.scrollY;
    let v = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const d = y - last;
      last = y;
      v += (Math.max(-max, Math.min(max, d * 0.35)) - v) * 0.12;
      el.style.transform = `skewX(${(-v).toFixed(2)}deg)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [max]);
  return ref;
};

interface PreviewProps {
  images: string[] | null;
}

/** Gambar yang mengikuti kursor dengan kelembaman dan bergantian setiap beberapa saat selama baris disorot. */
export const HoverPreview: React.FC<PreviewProps> = ({ images }) => {
  const box = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const active = !!images && images.length > 0;

  useEffect(() => {
    const el = box.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    let x = -300;
    let y = -300;
    let tx = -300;
    let ty = -300;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      const rot = Math.max(-8, Math.min(8, (tx - x) * 0.05));
      el.style.transform = `translate3d(${x + 28}px, ${y - 110}px, 0) rotate(${rot.toFixed(2)}deg)`;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  useEffect(() => {
    setIdx(0);
    if (!images || images.length < 2) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % images.length), 650);
    return () => window.clearInterval(id);
  }, [images]);

  return (
    <div ref={box} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" style={{ width: 220 }}>
      <div className={`origin-bottom-left overflow-hidden bg-[#D6D6D3] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.5)] transition-all duration-300 ${active ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        {images?.map((src, i) => (
          <img key={src} src={src} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${i === idx ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div style={{ aspectRatio: '4 / 5' }} />
      </div>
    </div>
  );
};

interface ProximityProps {
  text: string;
  className?: string;
  /** Jeda animasi naik (ms). Tanpa ini huruf langsung tampil. */
  riseDelay?: number;
  baseWght?: number;
  maxWght?: number;
  baseWdth?: number;
  maxWdth?: number;
  /** Jangkauan pengaruh kursor dalam px. */
  range?: number;
}

/**
 * Teks yang hurufnya menebal dan melebar saat kursor mendekat (sumbu wght dan wdth Archivo variabel).
 * Dengan `riseDelay`, huruf juga naik dari balik garis saat pertama muncul.
 */
export const ProximityText: React.FC<ProximityProps> = ({
  text, className = '', riseDelay, baseWght = 700, maxWght = 900, baseWdth = 100, maxWdth = 118, range = 260,
}) => {
  const box = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');
  let n = 0;

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    const spans = Array.from(host.querySelectorAll<HTMLSpanElement>('span[data-l]'));
    const set = (i: number, k: number) => {
      spans[i].style.fontVariationSettings = `"wght" ${Math.round(baseWght + k * (maxWght - baseWght))}, "wdth" ${Math.round(baseWdth + k * (maxWdth - baseWdth))}`;
    };
    spans.forEach((_, i) => set(i, 0));
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    const cur = spans.map(() => 0);
    let px: number | null = null;
    let py = 0;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; });
    io.observe(host);
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      spans.forEach((s, i) => {
        let target = 0;
        if (px !== null) {
          const b = s.getBoundingClientRect();
          target = Math.max(0, 1 - Math.hypot(px - (b.left + b.width / 2), (py - (b.top + b.height / 2)) * 0.5) / range);
        }
        cur[i] += (target - cur[i]) * 0.14;
        if (Math.abs(target - cur[i]) > 0.002 || target > 0) set(i, cur[i]);
      });
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [text, baseWght, maxWght, baseWdth, maxWdth, range]);

  return (
    <span ref={box} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.24em] -mb-[0.14em] align-bottom">
          {w.split('').map((c) => {
            const i = n++;
            return (
              <span
                key={i}
                data-l
                className={`inline-block ${riseDelay !== undefined ? 'oc-rise' : ''}`}
                style={riseDelay !== undefined ? { animationDelay: `${riseDelay + i * 28}ms` } : undefined}
              >
                {c}
              </span>
            );
          })}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
};

/** Angka yang menghitung naik saat pertama terlihat. */
export const CountUp: React.FC<{ to: number; decimals?: number; suffix?: string; className?: string }> = ({ to, decimals = 0, suffix = '', className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    setV(0);
    const io = new IntersectionObserver((e) => {
      if (!e[0]?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 1500);
        setV(to * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US');
  return <span ref={ref} className={`tabular-nums ${className}`}>{shown}{suffix}</span>;
};

/** Lencana bulat dengan teks melingkar yang berputar mengikuti gulir. Klik untuk turun ke bagian berikutnya. */
export const ScrollBadge: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Gulir ke bawah • Gulir ke bawah • ' }) => {
  const ring = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ring.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let cur = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      cur += (window.scrollY * 0.35 - cur) * 0.1;
      el.style.transform = `rotate(${(cur + performance.now() * 0.012).toFixed(1)}deg)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <button type="button" onClick={onClick} aria-label="Gulir ke bawah" data-cursor="Turun" className="group relative grid h-[88px] w-[88px] place-items-center rounded-full">
      <svg ref={ring} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs><path id="oc-badge-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
        <text className="fill-current font-mono text-[9.5px] uppercase tracking-[0.18em]"><textPath href="#oc-badge-path">{label.repeat(2)}</textPath></text>
      </svg>
      <span className="text-xl transition-transform duration-300 group-hover:translate-y-1" aria-hidden>↓</span>
    </button>
  );
};
