import React, { useState } from 'react';
import type { PublicWork } from '../../lib/works';

interface Props {
  work: PublicWork;
  className?: string;
  /** Lebar/tinggi yang dipaksakan. Tanpa ini gambar memakai rasio aslinya. */
  ratio?: number;
  eager?: boolean;
  /** Dipanggil sekali gambar termuat, dengan rasio asli (lebar/tinggi). */
  onNaturalRatio?: (ratio: number) => void;
}

// Menampilkan gambar karya. Karya tanpa pratinjau gambar (tulisan, kode) atau gambar yang gagal dimuat
// tampil sebagai kartu tipografi.
export const WorkImage: React.FC<Props> = ({ work, className = '', ratio, eager, onNaturalRatio }) => {
  const [failed, setFailed] = useState(false);

  if (work.image && !failed) {
    return (
      <img
        src={work.image}
        alt={`${work.title} oleh ${work.author}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`block bg-[#D6D6D3] object-cover ${className}`}
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
        onLoad={(e) => {
          const el = e.currentTarget;
          if (onNaturalRatio && el.naturalWidth > 0 && el.naturalHeight > 0) {
            onNaturalRatio(el.naturalWidth / el.naturalHeight);
          }
        }}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`flex flex-col justify-between overflow-hidden bg-[#0E0E0F] p-3 text-[#EDEDEB] ${className}`}
      style={{ aspectRatio: String(ratio ?? 0.8) }}
      role="img"
      aria-label={`${work.title} oleh ${work.author}`}
    >
      <span className="font-mono text-[9px] uppercase tracking-wide opacity-60">{work.type}</span>
      <span className="line-clamp-4 font-display text-[clamp(0.9rem,1.6vw,1.3rem)] font-bold leading-[1.05] tracking-tight">{work.title}</span>
    </div>
  );
};
