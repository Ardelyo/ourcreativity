import React from 'react';
import { Link } from 'react-router-dom';

// Primitif tampilan sistem desain "Katalog". Dipakai bersama oleh semua halaman bertema modernis
// supaya judul, label, tombol, dan state kosong/galat/memuat konsisten.

export const PAGE_X = 'mx-auto w-full max-w-[1560px] px-4 md:px-8';

interface HeaderProps {
  /** Label mono kecil di atas judul, mis. "(Edisi)". */
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<HeaderProps> = ({ label, title, lede, children }) => (
  <header className={`${PAGE_X} pb-[clamp(28px,5vw,64px)] pt-[clamp(28px,5vw,72px)]`}>
    <div className="border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">{label}</div>
    <h1 className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(2.8rem,8vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.06em]">{title}</h1>
    {lede && <p className="mt-6 max-w-[58ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#2B2B2E]">{lede}</p>}
    {children}
  </header>
);

export const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">{children}</em>
);

export const SectionRule: React.FC<{ label: string; aside?: React.ReactNode }> = ({ label, aside }) => (
  <div className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
    <span>{label}</span>
    {aside && <span className="text-right text-[#55555A]">{aside}</span>}
  </div>
);

const linkBase = 'oc-link inline-flex items-center gap-1.5 border-b border-[#0E0E0F] pb-0.5 font-display text-[15px] font-semibold tracking-tight';

export const LinkButton: React.FC<{ to?: string; href?: string; children: React.ReactNode; cursor?: string }> = ({ to, href, children, cursor }) =>
  to ? (
    <Link to={to} className={linkBase} data-cursor={cursor}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkBase} data-cursor={cursor}>
      {children}
    </a>
  );

export const Arrow: React.FC = () => (
  <span className="oc-arrow inline-block" aria-hidden>
    ↗
  </span>
);

// State memuat: tanda mono kecil dengan garis yang berjalan, netral terhadap warna latar (pakai currentColor).
export const LoadingMark: React.FC<{ label?: string }> = ({ label = 'Memuat' }) => (
  <div className="grid min-h-[50vh] place-content-center justify-items-center gap-3 font-mono text-[11px]" role="status" aria-live="polite">
    <span>{label}</span>
    <span className="relative block h-px w-28 overflow-hidden bg-[rgba(128,128,128,0.35)]">
      <span className="absolute inset-y-0 left-0 w-1/3 animate-[oc-load_1.1s_ease-in-out_infinite] bg-current" />
    </span>
  </div>
);

export const EmptyState: React.FC<{ title: string; hint?: string; action?: React.ReactNode }> = ({ title, hint, action }) => (
  <div className="grid place-content-center justify-items-center gap-2 border border-dashed border-[#0E0E0F]/25 px-6 py-14 text-center">
    <p className="font-display text-xl font-bold tracking-tight">{title}</p>
    {hint && <p className="max-w-[42ch] font-mono text-[11px] text-[#55555A]">{hint}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);
