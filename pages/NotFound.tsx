import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EDISI } from '../lib/edisi';
import { Em, LinkButton, PAGE_X } from '../components/modern/ui';

// Halaman 404 sungguhan (sebelumnya semua alamat salah dialihkan diam-diam ke beranda).
export const NotFound: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <section className={`${PAGE_X} grid min-h-[70svh] content-center gap-8 py-16`}>
      <div className="border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">(404) Halaman tidak ditemukan</div>
      <h1 className="max-w-[12ch] text-balance font-display text-[clamp(3.4rem,13vw,13rem)] font-bold leading-[0.82] tracking-[-0.07em]">
        Tersesat di <Em>katalog.</Em>
      </h1>
      <p className="max-w-[52ch] font-mono text-[11px] leading-relaxed text-[#55555A]">
        Tidak ada halaman di <span className="break-all text-[#0E0E0F]">{pathname}</span>. Alamatnya mungkin sudah pindah atau salah ketik.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <LinkButton to="/">Ke beranda</LinkButton>
        <LinkButton to="/karya">Jelajahi karya</LinkButton>
        <LinkButton to="/edisi">Lihat edisi</LinkButton>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[#55555A]">
        {EDISI.map((e) => (
          <li key={e.key}>
            <Link to={`/edisi/${e.key}`} className="hover:text-[#0E0E0F] hover:underline">
              {e.nama}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotFound;
