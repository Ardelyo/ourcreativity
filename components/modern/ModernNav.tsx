import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

// Navigasi untuk halaman bertema modernis (Home dan Karya). Tinggi tetap 53px (var --nav-h di index.css).
const linkCls = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-[11px] border-b pb-0.5 transition-colors ${isActive ? 'border-[#0E0E0F]' : 'border-transparent hover:border-[#0E0E0F]'}`;

export const ModernNav = () => {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#0E0E0F]/15 bg-[#EDEDEB]/95 backdrop-blur" style={{ height: 'var(--nav-h)' }}>
      <div className="mx-auto flex h-full max-w-[1560px] items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-display text-[15px] font-bold tracking-tight" onClick={() => setOpen(false)}>
          <img src="/brand/oc-mark.png" alt="" width={40} height={22} className="h-[22px] w-auto" />
          OurCreativity
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          <NavLink to="/karya" className={linkCls}>Karya</NavLink>
          <Link to={{ pathname: '/', hash: '#edisi' }} className={linkCls({ isActive: false })}>Edisi</Link>
          <Link to={{ pathname: '/', hash: '#program' }} className={linkCls({ isActive: false })}>Program</Link>
          <NavLink to="/tim" className={linkCls}>Tim</NavLink>
          <NavLink to="/info" className={linkCls}>Info</NavLink>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              <Link to="/studio" className="font-mono text-[11px] border-b border-transparent pb-0.5 hover:border-[#0E0E0F]">Studio</Link>
              <Link to={`/profile/${profile?.username ?? ''}`} className="font-mono text-[11px] border-b border-[#0E0E0F] pb-0.5">
                @{profile?.username ?? 'saya'}
              </Link>
            </>
          ) : (
            <Link to="/login" className="font-mono text-[11px] border-b border-[#0E0E0F] pb-0.5">Masuk</Link>
          )}
        </div>

        <button
          type="button"
          className="font-mono text-[11px] md:hidden"
          aria-expanded={open}
          aria-controls="modern-nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '[ Tutup ]' : '[ Menu ]'}
        </button>
      </div>

      {open && (
        <nav id="modern-nav-menu" aria-label="Menu" className="absolute inset-x-0 top-full grid gap-1 border-b border-[#0E0E0F]/15 bg-[#EDEDEB] px-4 py-3 font-display text-2xl font-bold tracking-tight md:hidden">
          <Link to="/karya" onClick={() => setOpen(false)} className="py-1.5">Karya</Link>
          <Link to={{ pathname: '/', hash: '#edisi' }} onClick={() => setOpen(false)} className="py-1.5">Edisi</Link>
          <Link to={{ pathname: '/', hash: '#program' }} onClick={() => setOpen(false)} className="py-1.5">Program</Link>
          <Link to="/tim" onClick={() => setOpen(false)} className="py-1.5">Tim</Link>
          <Link to="/info" onClick={() => setOpen(false)} className="py-1.5">Info</Link>
          {user ? (
            <Link to={`/profile/${profile?.username ?? ''}`} onClick={() => setOpen(false)} className="py-1.5">@{profile?.username ?? 'saya'}</Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="py-1.5">Masuk</Link>
          )}
        </nav>
      )}
    </header>
  );
};
