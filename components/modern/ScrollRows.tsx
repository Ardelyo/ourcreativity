import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { PublicWork } from '../../lib/works';

interface Props {
  rowA: PublicWork[];
  rowB: PublicWork[];
}

// Dua baris karya yang bergeser berlawanan arah mengikuti gulir (bukan waktu), sehingga terasa "ditarik" oleh gulir.
export const ScrollRows: React.FC<Props> = ({ rowA, rowB }) => {
  const host = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || !a.current || !b.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let cur = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      cur += (p - cur) * 0.1;
      const wa = a.current ? a.current.scrollWidth - window.innerWidth : 0;
      const wb = b.current ? b.current.scrollWidth - window.innerWidth : 0;
      if (a.current) a.current.style.transform = `translate3d(${(-cur * Math.max(0, wa)).toFixed(1)}px,0,0)`;
      if (b.current) b.current.style.transform = `translate3d(${(-(1 - cur) * Math.max(0, wb)).toFixed(1)}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rowA, rowB]);

  const row = (items: PublicWork[], ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="flex w-max gap-2 will-change-transform">
      {items.map((w) => (
        <Link key={w.id} to="/karya" data-cursor="Katalog" className="group relative block flex-none overflow-hidden" aria-label={`${w.title} oleh ${w.username ?? w.author}`}>
          <img src={w.image as string} alt="" loading="lazy" decoding="async" className="block h-[clamp(120px,15vw,230px)] w-auto bg-[#D6D6D3] transition-transform duration-500 group-hover:scale-[1.06]" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            @{w.username ?? w.author}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <div ref={host} className="grid gap-2 overflow-hidden py-[clamp(40px,6vw,90px)]" aria-label="Sorotan karya">
      {row(rowA, a)}
      {row(rowB, b)}
    </div>
  );
};
