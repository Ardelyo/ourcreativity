import React, { useEffect, useMemo, useRef } from 'react';

// Wordmark raksasa di footer. Tiap huruf melebar dan menebal saat pointer mendekat (sumbu wdth dan wght
// dari Archivo variabel), lalu kembali pelan saat pointer pergi.
export const FooterWordmark: React.FC<{ text: string }> = ({ text }) => {
  const box = useRef<HTMLDivElement>(null);
  const letters = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    const spans = Array.from(host.querySelectorAll<HTMLSpanElement>('span[data-l]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cur = spans.map(() => 0);
    let px: number | null = null;
    let py = 0;
    let raf = 0;
    let visible = false;

    const apply = (i: number, k: number) => {
      spans[i].style.fontVariationSettings = `"wght" ${Math.round(520 + k * 380)}, "wdth" ${Math.round(80 + k * 45)}`;
    };
    spans.forEach((_, i) => apply(i, 0));
    if (reduce) return;

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
          const d = Math.hypot(px - (b.left + b.width / 2), (py - (b.top + b.height / 2)) * 0.45);
          target = Math.max(0, 1 - d / 320);
        }
        cur[i] += (target - cur[i]) * 0.12;
        apply(i, cur[i]);
      });
    };
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? false; });
    io.observe(host);
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [letters]);

  return (
    <div ref={box} aria-hidden className="select-none overflow-hidden whitespace-nowrap font-display leading-[0.8] tracking-[-0.05em]" style={{ fontSize: 'min(17.2vw, 280px)' }}>
      {letters.map((c, i) => (
        <span key={i} data-l className="inline-block" style={{ fontVariationSettings: '"wght" 520, "wdth" 80' }}>{c}</span>
      ))}
    </div>
  );
};
