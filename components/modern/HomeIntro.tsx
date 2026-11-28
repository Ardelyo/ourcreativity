import React, { useEffect, useRef, useState } from 'react';

interface Props {
  /** Referensi ke kemajuan muat gambar globe: { done, total }. */
  progress: React.MutableRefObject<{ done: number; total: number }>;
  /** True bila data sudah selesai diambil (berhasil atau gagal). */
  settled: boolean;
  hasWorks: boolean;
  totalWorks: number;
  /** Dipanggil saat intro selesai dan bola harus "mendarat" ke posisi header. */
  onDock: () => void;
}

const MIN_MS = 2600;
const MAX_MS = 4500; // di koneksi lambat, jangan tahan pengunjung lebih lama; sisa gambar muat sambil jalan

// Lapisan intro: bola karya memenuhi layar sementara penghitung memuat naik dari 000 ke 100.
// Saat selesai, onDock dipanggil dan bola meluncur ke tempatnya di header. Halaman tidak bisa digulir selama intro.
export const HomeIntro: React.FC<Props> = ({ progress, settled, hasWorks, totalWorks, onDock }) => {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  const finish = useRef(onDock);
  finish.current = onDock;

  useEffect(() => {
    document.documentElement.dataset.intro = '1';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      delete document.documentElement.dataset.intro;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const end = () => {
      if (done.current) return;
      done.current = true;
      setCount(100);
      finish.current();
    };
    const tick = (now: number) => {
      const el = now - t0;
      const { done: d, total } = progress.current;
      // 80% gambar termuat sudah cukup untuk bola yang meyakinkan
      const loadP = total > 0 ? Math.min(1, d / (total * 0.8)) : settled && !hasWorks ? 1 : 0;
      const timeP = Math.min(1, el / MIN_MS);
      const p = Math.min(timeP, 0.08 + loadP * 0.92);
      setCount(Math.round(p * 100));
      if ((p >= 1 && el >= MIN_MS) || el > MAX_MS || (settled && !hasWorks && el > 600)) {
        end();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') end();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [progress, settled, hasWorks]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 text-white mix-blend-difference md:p-8" aria-live="polite">
      <div className="flex justify-between font-mono text-[11px]">
        <span>OurCreativity Katalog</span>
        <span>{totalWorks > 0 ? `${totalWorks} karya` : 'Memuat karya'}</span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="font-display text-[clamp(6rem,24vw,24rem)] font-bold leading-[0.78] tracking-[-0.07em] tabular-nums" aria-label={`Memuat ${count} persen`}>
          {String(count).padStart(3, '0')}
        </div>
        <button
          type="button"
          onClick={() => { if (!done.current) { done.current = true; setCount(100); finish.current(); } }}
          className="pointer-events-auto mb-2 border-b border-white pb-0.5 font-mono text-[11px]"
          data-cursor="Lewati"
        >
          Lewati ↘
        </button>
      </div>
    </div>
  );
};
