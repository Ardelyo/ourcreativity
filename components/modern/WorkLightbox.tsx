import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EDISI } from '../../lib/edisi';
import { formatNo, type PublicWork } from '../../lib/works';
import { WorkImage } from './WorkImage';

interface Props {
  items: PublicWork[];
  index: number;
  numbers: Map<string, number>;
  onClose: () => void;
  onStep: (d: number) => void;
}

const edisiName = (key: string) => EDISI.find((e) => e.key === key)?.nama ?? key;

// Detail karya: gambar besar, nomor katalog, kredit kreator, dan tautan ke sumber asli. Tanpa fitur sosial.
export const WorkLightbox: React.FC<Props> = ({ items, index, numbers, onClose, onStep }) => {
  const w = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  if (!w) return null;
  const no = formatNo(numbers.get(w.id) ?? 0);
  const handle = w.username ?? w.author;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Karya ${no}: ${w.title}`}
      className="oc-lightbox fixed inset-0 z-[90] grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-4 bg-[#EDEDEB] p-4 md:grid-cols-[minmax(0,1fr)_minmax(240px,24vw)] md:grid-rows-1 md:gap-12 md:p-9"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" onClick={onClose} className="absolute right-4 top-4 z-10 border-b border-[#0E0E0F] pb-0.5 font-mono text-[11px] md:right-6 md:top-6">[ Tutup ]</button>
      <div className="flex min-h-0 items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {w.video ? (
          <video src={w.video} poster={w.image ?? undefined} controls playsInline className="max-h-[calc(100svh-80px)] max-w-full bg-black shadow-[0_24px_50px_-24px_rgba(0,0,0,0.5)]" />
        ) : (
          <WorkImage key={w.id} work={w} eager full className="oc-lightbox-img max-h-[calc(100svh-80px)] max-w-full object-contain shadow-[0_24px_50px_-24px_rgba(0,0,0,0.5)]" />
        )}
      </div>
      <aside className="flex min-w-0 flex-col gap-3.5 border-[#0E0E0F]/15 pt-2 font-mono text-[11px] md:border-l md:pl-7">
        <div className="font-display text-[clamp(2.4rem,6vw,5.4rem)] font-bold leading-[0.88] tracking-[-0.06em]">{no}</div>
        <div className="break-words font-display text-xl font-semibold tracking-tight">{w.title}</div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-[#8A8A8F]">Kreator</dt>
          <dd>
            {w.source ? (
              <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noopener noreferrer" className="underline">@{handle}</a>
            ) : w.username ? (
              <Link to={`/profile/${w.username}`} className="underline">@{w.username}</Link>
            ) : (
              w.author
            )}
          </dd>
          <dt className="text-[#8A8A8F]">Edisi</dt>
          <dd>{edisiName(w.edisi)}</dd>
          {w.source && (
            <>
              <dt className="text-[#8A8A8F]">Sumber</dt>
              <dd><a href={w.source} target="_blank" rel="noopener noreferrer" className="underline">Post di Instagram ↗</a></dd>
            </>
          )}
        </dl>
        <div className="mt-auto flex gap-5">
          <button type="button" onClick={() => onStep(-1)} className="border-b border-[#0E0E0F] pb-0.5">← Sebelumnya</button>
          <button type="button" onClick={() => onStep(1)} className="border-b border-[#0E0E0F] pb-0.5">Berikutnya →</button>
        </div>
      </aside>
    </div>
  );
};
