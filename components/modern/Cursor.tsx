import React, { useEffect, useRef } from 'react';

// Kursor kustom untuk halaman bertema modernis: cincin yang mengikuti pointer dengan sedikit kelembaman,
// membesar di atas elemen interaktif, dan menampilkan label dari atribut data-cursor ("Putar", "Buka", dst).
// Hanya aktif untuk pointer halus (mouse) dan saat pengguna tidak meminta gerak berkurang.
export const Cursor: React.FC = () => {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ring.current;
    const text = label.current;
    if (!fine || reduce || !el || !text) return;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let scale = 1;
    let target = 1;
    let raf = 0;
    let current = '';

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const host = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const interactive = (e.target as HTMLElement | null)?.closest?.('a,button,[role="button"],input,select,textarea') as HTMLElement | null;
      const next = host?.dataset.cursor ?? '';
      if (next !== current) {
        current = next;
        text.textContent = next;
      }
      target = next ? 3.2 : interactive ? 1.9 : 1;
      el.style.opacity = '1';
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (target - scale) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      text.style.transform = `scale(${1 / Math.max(1, scale)})`;
      text.style.opacity = current ? '1' : '0';
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] grid h-5 w-5 place-items-center rounded-full border border-white opacity-0 mix-blend-difference transition-opacity duration-300 [@media(hover:none)]:hidden"
      style={{ willChange: 'transform' }}
    >
      <span ref={label} className="whitespace-nowrap font-mono text-[4px] uppercase tracking-wider text-white opacity-0" />
    </div>
  );
};
