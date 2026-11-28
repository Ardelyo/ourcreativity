import React, { useEffect, useRef, useState } from 'react';
import type { PublicWork } from '../../lib/works';

interface Props {
  work: PublicWork;
  className?: string;
  /** Lebar/tinggi yang dipaksakan. Tanpa ini gambar memakai rasio aslinya. */
  ratio?: number;
  eager?: boolean;
  /** Pakai gambar resolusi penuh (untuk lightbox) alih-alih thumbnail. */
  full?: boolean;
}

// Menampilkan gambar karya. Karya tanpa pratinjau gambar (tulisan, kode) atau gambar yang gagal dimuat
// tampil sebagai kartu tipografi. Gambar masuk dengan efek "fokus" halus (blur ke tajam) saat selesai dimuat.
export const WorkImage: React.FC<Props> = ({ work, className = '', ratio, eager, full }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const src = full ? work.full ?? work.image : work.image;

  // Gambar yang sudah ada di cache bisa selesai dimuat sebelum handler terpasang.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt={`${work.title} oleh ${work.author}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`block bg-[#D6D6D3] object-cover transition-[filter,opacity] duration-700 ${loaded ? 'blur-0 opacity-100' : 'opacity-0 blur-md'} ${className}`}
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
        onLoad={() => setLoaded(true)}
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
