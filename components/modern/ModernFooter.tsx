import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDISI, IG_UTAMA } from '../../lib/edisi';
import { FooterWordmark } from './FooterWordmark';

const jakartaTime = () =>
  new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());

export const ModernFooter = () => {
  const [time, setTime] = useState(jakartaTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(jakartaTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="mt-[clamp(40px,6vw,90px)] overflow-hidden bg-[#0E0E0F] text-[#EDEDEB]">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-6 px-4 pb-8 pt-8 font-mono text-[11px] leading-relaxed md:grid-cols-12 md:gap-x-6 md:px-8">
        <div className="md:col-span-4">
          <img src="/brand/oc-mark.png" alt="OurCreativity" width={52} height={26} className="mb-3 h-[26px] w-auto invert" />
          <p>.Inspired, .Inspiring</p>
          <p className="mt-1 text-[#8A8A8F]">Jakarta, Indonesia &middot; {time} WIB</p>
        </div>
        <div className="grid gap-0.5 md:col-span-4">
          <a href={`https://www.instagram.com/${IG_UTAMA}/`} target="_blank" rel="noopener noreferrer" className="hover:underline">@{IG_UTAMA}</a>
          {EDISI.filter((e) => e.handle !== IG_UTAMA).map((e) => (
            <a key={e.key} href={`https://www.instagram.com/${e.handle}/`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              @{e.handle}
            </a>
          ))}
        </div>
        <div className="grid content-start gap-0.5 md:col-span-4">
          <Link to="/karya" className="hover:underline">Katalog karya</Link>
          <Link to="/edisi" className="hover:underline">Edisi</Link>
          <Link to={{ pathname: '/', hash: '#program' }} className="hover:underline">Program</Link>
          <Link to="/tim" className="hover:underline">Tim</Link>
          <Link to="/info" className="hover:underline">Info</Link>
          <Link to="/cerita" className="hover:underline">Cerita</Link>
          <Link to="/pengumuman" className="hover:underline">Pengumuman</Link>
          <Link to="/kotak-surat" className="hover:underline">Kotak surat</Link>
          <Link to="/gabung" className="hover:underline">Gabung</Link>
          <a href="https://www.tiktok.com/@ourcreativity.ofc" target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-2 w-fit border-b border-[#EDEDEB] pb-0.5 text-left" data-cursor="Naik">
            Kembali ke atas ↑
          </button>
        </div>
      </div>
      <div className="px-3 md:px-6">
        <FooterWordmark text="OurCreativity" />
      </div>
      <p className="mx-auto max-w-[1560px] px-4 pb-4 pt-3 font-mono text-[10px] text-[#8A8A8F] md:px-8">
        Karya milik masing-masing kreator, dikutip dari post publik dengan kredit. Hubungi kami untuk menurunkan karya. © 2025 Hak Cipta Dilindungi.
      </p>
    </footer>
  );
};
