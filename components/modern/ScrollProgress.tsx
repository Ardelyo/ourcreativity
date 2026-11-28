import React, { useEffect, useRef } from 'react';

// Garis tipis di puncak layar yang memanjang sesuai seberapa jauh halaman sudah digulir.
export const ScrollProgress: React.FC = () => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let cur = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.min(1, window.scrollY / max);
      cur += (target - cur) * 0.15;
      if (bar.current) bar.current.style.transform = `scaleX(${cur.toFixed(4)})`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[2px]">
      <div ref={bar} className="h-full origin-left bg-[#0E0E0F]" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
};
