import React from 'react';
import { Link } from 'react-router-dom';
import { EDISI, IG_UTAMA } from '../../lib/edisi';

export const ModernFooter = () => (
  <footer className="border-t-2 border-[#0E0E0F] py-5 text-[#0E0E0F]">
    <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-6 px-4 font-mono text-[11px] leading-relaxed md:grid-cols-12 md:gap-x-6 md:px-8">
      <div className="md:col-span-4">
        <img src="/brand/oc-mark.png" alt="OurCreativity" width={52} height={26} className="mb-3 h-[26px] w-auto" />
        <p>.Inspired, .Inspiring</p>
        <p className="mt-1 text-[#6E6E6E]">Jakarta, Indonesia.</p>
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
        <Link to="/karya" className="hover:underline">Karya</Link>
        <Link to="/tim" className="hover:underline">Tim</Link>
        <Link to="/info" className="hover:underline">Info</Link>
        <a href="https://www.tiktok.com/@ourcreativity.ofc" target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</a>
        <p className="mt-3 text-[#6E6E6E]">Karya milik masing-masing kreator. © 2025 Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </footer>
);
