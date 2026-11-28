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
