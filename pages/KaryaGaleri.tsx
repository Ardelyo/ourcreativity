import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { DIVISION_LABELS } from '../lib/division-labels';
import { CAPTION_HEIGHT, clampPan, initialPan, layoutCanvas } from '../lib/karyaLayout';
import { formatNo, ratioFor, type PublicWork } from '../lib/works';
import { WorkImage } from '../components/modern/WorkImage';

type View = 'canvas' | 'list' | 'gallery';

const DIVISION_ICON: Record<string, string> = {
  graphics: 'desain',
  video: 'video',
  writing: 'tulis',
  coding: 'kode',
  meme: 'meme',
};

const handleOf = (w: PublicWork) => w.username ?? w.author;

/* ---------------------------------- Kanvas ---------------------------------- */

interface CanvasProps {
  items: PublicWork[];
  numbers: Map<string, number>;
  onOpen: (id: string) => void;
}

const WorksCanvas: React.FC<CanvasProps> = ({ items, numbers, onOpen }) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pan = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0 });
  const content = useRef({ w: 0, h: 0 });
  const drag = useRef({ on: false, sx: 0, sy: 0, ox: 0, oy: 0, lx: 0, ly: 0, vx: 0, vy: 0, moved: 0, captured: false });
  const raf = useRef(0);
  const [viewW, setViewW] = useState(0);
  // Rasio asli gambar dilaporkan setelah termuat; sampai saat itu dipakai tebakan stabil per id.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const pendingRatios = useRef<Record<string, number>>({});
  const flushTimer = useRef<number>(0);

  const reportRatio = useCallback((id: string, r: number) => {
    const clamped = Math.max(0.5, Math.min(2.2, r));
    pendingRatios.current[id] = clamped;
    window.clearTimeout(flushTimer.current);
    flushTimer.current = window.setTimeout(() => {
      const batch = pendingRatios.current;
      pendingRatios.current = {};
      setRatios((cur) => {
        let changed = false;
        const next = { ...cur };
        for (const [k, v] of Object.entries(batch)) {
          if (Math.abs((cur[k] ?? 0) - v) > 0.01) { next[k] = v; changed = true; }
        }
        return changed ? next : cur;
      });
    }, 200);
  }, []);

  useEffect(() => () => window.clearTimeout(flushTimer.current), []);

  const layout = useMemo(
    () => layoutCanvas(items.map((w) => ({ id: w.id, ratio: ratios[w.id] ?? ratioFor(w.id) })), viewW || 1200),
    [items, viewW, ratios],
  );

  const apply = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = `translate3d(${pan.current.x}px, ${pan.current.y}px, 0)`;
  }, []);

  const clamp = useCallback(() => {
    pan.current = clampPan(pan.current.x, pan.current.y, size.current.w, size.current.h, content.current.w, content.current.h);
  }, []);

  // Ukuran isi berubah setiap rasio gambar masuk; cukup batasi ulang geseran, jangan reset posisi.
  useEffect(() => {
    content.current = { w: layout.width, h: layout.height };
    clamp();
    apply();
  }, [layout, clamp, apply]);

  // Ukur wadah, lalu atur ulang posisi awal setiap kali kumpulan karya atau lebar layar berubah.
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const measure = () => {
      size.current = { w: el.clientWidth, h: el.clientHeight };
      setViewW(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Posisi awal hanya diatur ulang saat kumpulan karya atau lebar layar berganti.
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    pan.current = { x: initialPan(size.current.w, content.current.w), y: 0 };
    clamp();
    apply();
  }, [items, viewW, clamp, apply]);

  // Roda mouse menggeser kanvas (perlu listener non-pasif agar bisa preventDefault).
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pan.current = { x: pan.current.x - e.deltaX, y: pan.current.y - e.deltaY };
      clamp();
      apply();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clamp, apply]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(raf.current);
    const d = drag.current;
    d.on = true;
    d.sx = d.lx = e.clientX;
    d.sy = d.ly = e.clientY;
    d.ox = pan.current.x;
    d.oy = pan.current.y;
    d.vx = d.vy = 0;
    d.moved = 0;
    d.captured = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.on) return;
    pan.current = { x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) };
    d.vx = e.clientX - d.lx;
    d.vy = e.clientY - d.ly;
    d.lx = e.clientX;
    d.ly = e.clientY;
    d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.sx, e.clientY - d.sy));
    // Tangkap pointer hanya saat benar-benar menggeser, supaya klik biasa tetap sampai ke tile.
    if (!d.captured && d.moved > 4) {
      e.currentTarget.setPointerCapture(e.pointerId);
      d.captured = true;
    }
    clamp();
    apply();
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const glide = () => {
      if (Math.abs(d.vx) < 0.3 && Math.abs(d.vy) < 0.3) return;
      pan.current = { x: pan.current.x + d.vx, y: pan.current.y + d.vy };
      d.vx *= 0.93;
      d.vy *= 0.93;
      clamp();
      apply();
      raf.current = requestAnimationFrame(glide);
    };
    raf.current = requestAnimationFrame(glide);
  };

  // Fokus keyboard pada karya yang di luar layar: geser kanvas agar karya itu terlihat.
  const revealOnFocus = (id: string) => {
    const p = layout.placed[id];
    if (!p) return;
    const { w, h } = size.current;
    let { x, y } = pan.current;
    if (p.x + x < 40) x = 40 - p.x;
    else if (p.x + p.w + x > w - 40) x = w - 40 - (p.x + p.w);
    if (p.y + y < 80) y = 80 - p.y;
    else if (p.y + p.h + y > h - 40) y = h - 40 - (p.y + p.h);
    pan.current = { x, y };
    clamp();
    apply();
  };

  return (
    <div
      ref={viewRef}
      className="oc-dots absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => {
        if (drag.current.moved > 6) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <div ref={innerRef} className="absolute left-0 top-0 will-change-transform">
        {items.map((w) => {
          const p = layout.placed[w.id];
          if (!p) return null;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onOpen(w.id)}
              onFocus={() => revealOnFocus(w.id)}
              aria-label={`Karya ${formatNo(numbers.get(w.id) ?? 0)}: ${w.title} oleh ${handleOf(w)}`}
              className="oc-tile absolute left-0 top-0 block text-left"
              style={{ width: p.w, transform: `translate(${p.x}px, ${p.y}px)` }}
            >
              <span className="mb-1.5 flex justify-between gap-2 overflow-hidden whitespace-nowrap font-mono text-[10px] leading-none text-[#55555A]" style={{ height: CAPTION_HEIGHT - 16 }}>
                <span>{formatNo(numbers.get(w.id) ?? 0)}.</span>
                <span className="truncate">@{handleOf(w)}</span>
              </span>
              <WorkImage work={w} ratio={p.w / p.h} className="w-full" onNaturalRatio={(r) => reportRatio(w.id, r)} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------- Daftar ---------------------------------- */

const ListView: React.FC<CanvasProps> = ({ items, numbers, onOpen }) => {
  const [hover, setHover] = useState<{ w: PublicWork; x: number; y: number } | null>(null);
  return (
    <div className="absolute inset-0 overflow-auto px-4 pb-10 pt-[84px] md:px-7" onPointerLeave={() => setHover(null)}>
      <div className="grid grid-cols-[44px_1fr_28px] gap-4 border-b-2 border-[#0E0E0F] pb-2 font-mono text-[11px] text-[#8A8A8F] md:grid-cols-[64px_3fr_2fr_40px]">
        <span>No.</span><span>Kreator</span><span className="hidden md:block">Divisi</span><span />
      </div>
      {items.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => onOpen(w.id)}
          onPointerMove={(e) => setHover({ w, x: e.clientX, y: e.clientY })}
          onFocus={() => setHover(null)}
          className="grid w-full grid-cols-[44px_1fr_28px] items-center gap-4 border-b border-[#0E0E0F]/15 py-3 text-left transition-all hover:bg-[#0E0E0F] hover:px-2.5 hover:text-[#EDEDEB] focus-visible:bg-[#0E0E0F] focus-visible:text-[#EDEDEB] md:grid-cols-[64px_3fr_2fr_40px]"
        >
          <span className="font-mono text-[11px] opacity-60">{formatNo(numbers.get(w.id) ?? 0)}</span>
          <b className="truncate font-display text-[clamp(1.1rem,2.2vw,1.9rem)] font-semibold tracking-[-0.03em]">@{handleOf(w)}</b>
          <span className="hidden font-mono text-[11px] md:block">{DIVISION_LABELS[w.division] ?? w.division}</span>
          <span className="font-mono text-[11px]" aria-hidden>↗</span>
        </button>
      ))}
      {hover && (
        <div className="pointer-events-none fixed z-40 w-[200px] -translate-y-1/2 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)]" style={{ left: hover.x + 130, top: hover.y }} aria-hidden>
          <WorkImage work={hover.w} className="w-full" />
        </div>
      )}
    </div>
  );
};

/* ---------------------------------- Galeri ---------------------------------- */

const GalleryView: React.FC<CanvasProps> = ({ items, numbers, onOpen }) => (
  <div className="absolute inset-0 flex snap-x snap-mandatory items-center gap-[clamp(18px,3vw,48px)] overflow-x-auto px-4 pb-6 pt-24 md:px-7">
    {items.map((w) => (
      <figure key={w.id} className="m-0 flex h-full max-h-[calc(100%-40px)] flex-none snap-center flex-col gap-2.5">
        <button type="button" onClick={() => onOpen(w.id)} className="min-h-0 flex-1 text-left" aria-label={`Buka karya ${formatNo(numbers.get(w.id) ?? 0)}: ${w.title}`}>
          <WorkImage work={w} className="h-full w-auto max-w-[86vw] object-contain" />
        </button>
        <figcaption className="flex justify-between gap-5 font-mono text-[11px]">
          <span>{formatNo(numbers.get(w.id) ?? 0)}. @{handleOf(w)}</span>
          <span className="text-[#8A8A8F]">{DIVISION_LABELS[w.division] ?? w.division}</span>
        </figcaption>
      </figure>
    ))}
  </div>
);

/* --------------------------------- Lightbox --------------------------------- */

interface LightboxProps {
  items: PublicWork[];
  index: number;
  numbers: Map<string, number>;
  onClose: () => void;
  onStep: (d: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, index, numbers, onClose, onStep }) => {
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
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Karya ${formatNo(numbers.get(w.id) ?? 0)}: ${w.title}`}
      className="fixed inset-0 z-[90] grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-4 bg-[#EDEDEB] p-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,22vw)] md:grid-rows-1 md:gap-12 md:p-9"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" onClick={onClose} className="absolute right-4 top-4 border-b border-[#0E0E0F] pb-0.5 font-mono text-[11px] md:right-6 md:top-6">[ Tutup ]</button>
      <div className="flex min-h-0 items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {w.video ? (
          <video src={w.video} poster={w.image ?? undefined} controls playsInline className="max-h-[calc(100svh-80px)] max-w-full bg-black shadow-[0_24px_50px_-24px_rgba(0,0,0,0.5)]" />
        ) : (
          <WorkImage work={w} eager className="max-h-[calc(100svh-80px)] max-w-full object-contain shadow-[0_24px_50px_-24px_rgba(0,0,0,0.5)]" />
        )}
      </div>
      <aside className="flex min-w-0 flex-col gap-3.5 border-[#0E0E0F]/15 pt-2 font-mono text-[11px] md:border-l md:pl-7">
        <div className="font-display text-[clamp(2rem,5vw,4.4rem)] font-bold leading-[0.9] tracking-[-0.06em]">{formatNo(numbers.get(w.id) ?? 0)}</div>
        <div className="break-words font-display text-xl font-semibold tracking-tight">{w.title}</div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-[#8A8A8F]">Kreator</dt>
          <dd>{w.username ? <Link to={`/profile/${w.username}`} className="underline">@{w.username}</Link> : w.author}</dd>
          <dt className="text-[#8A8A8F]">Divisi</dt>
          <dd>{DIVISION_LABELS[w.division] ?? w.division}</dd>
          <dt className="text-[#8A8A8F]">Tanggal</dt>
          <dd>{new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
        </dl>
        <Link to="/karya/arsip" className="underline">Detail, suka, dan komentar ↗</Link>
        <div className="mt-auto flex gap-5">
          <button type="button" onClick={() => onStep(-1)} className="border-b border-[#0E0E0F] pb-0.5">← Sebelumnya</button>
          <button type="button" onClick={() => onStep(1)} className="border-b border-[#0E0E0F] pb-0.5">Berikutnya →</button>
        </div>
      </aside>
    </div>
  );
};

/* ---------------------------------- Halaman --------------------------------- */

const VIEWS: { key: View; label: string }[] = [
  { key: 'canvas', label: 'Kanvas' },
  { key: 'list', label: 'Daftar' },
  { key: 'gallery', label: 'Galeri' },
];

export default function KaryaGaleri() {
  const { data: works = [], isLoading, isError, refetch } = useWorks(160);
  const [params, setParams] = useSearchParams();
  const division = params.get('divisi') ?? 'all';
  const [view, setView] = useState<View>('canvas');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // Nomor urut: karya paling lama = 001, seperti katalog.
  const numbers = useMemo(() => new Map([...works].reverse().map((w, i) => [w.id, i + 1] as [string, number])), [works]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    works.forEach((w) => { c[w.division] = (c[w.division] ?? 0) + 1; });
    return c;
  }, [works]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      if (division !== 'all' && w.division !== division) return false;
      if (!q) return true;
      return `${w.author} ${w.username ?? ''} ${w.title}`.toLowerCase().includes(q);
    });
  }, [works, division, query]);

  const setDivision = (d: string) => {
    const next = new URLSearchParams(params);
    if (d === 'all') next.delete('divisi'); else next.set('divisi', d);
    setParams(next, { replace: true });
  };

  const openIndex = openId ? visible.findIndex((w) => w.id === openId) : -1;
  const step = useCallback(
    (d: number) => {
      setOpenId((cur) => {
        if (!visible.length) return null;
        const i = visible.findIndex((w) => w.id === cur);
        return visible[(i + d + visible.length) % visible.length].id;
      });
    },
    [visible],
  );
  const close = useCallback(() => setOpenId(null), []);

  const divisions = Object.keys(DIVISION_LABELS).filter((k) => k !== 'all');
  const props: CanvasProps = { items: visible, numbers, onOpen: setOpenId };

  return (
    <section className="oc-karya relative overflow-hidden bg-[#EDEDEB] text-[#0E0E0F]" aria-label="Karya">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto] items-start gap-3 bg-gradient-to-b from-[#EDEDEB] from-55% to-transparent px-4 pt-3.5 md:grid-cols-[1fr_auto_1fr] md:px-7 [&>*]:pointer-events-auto">
        <div className="hidden gap-1 font-mono text-[11px] md:grid">
          <b className="font-display text-base font-bold tracking-tight">OurCreativity Karya</b>
          <span className="text-[#8A8A8F]">{isLoading ? 'Memuat…' : `${visible.length} karya`}{division !== 'all' ? ` di ${DIVISION_LABELS[division] ?? division}` : ''}</span>
        </div>
        <div className="flex gap-1 font-mono text-[11px]" role="group" aria-label="Tampilan">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={view === v.key}
              onClick={() => setView(v.key)}
              className={`border-b px-1.5 py-1 ${view === v.key ? 'border-[#0E0E0F] text-[#0E0E0F]' : 'border-transparent text-[#8A8A8F] hover:text-[#0E0E0F]'}`}
            >
              [ {v.label} ]
            </button>
          ))}
        </div>
        <div className="flex items-start justify-end gap-3.5 font-mono text-[11px]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kreator"
            aria-label="Cari kreator atau judul"
            className="w-[clamp(80px,12vw,160px)] border-b border-[#0E0E0F] bg-transparent px-0.5 py-1 outline-none placeholder:text-[#8A8A8F]"
          />
          <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((v) => !v)} className="py-1 text-[#8A8A8F] hover:text-[#0E0E0F]">
            Filter [{filterOpen ? '−' : '+'}]
          </button>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 top-[52px] z-[5] flex flex-wrap gap-1.5 border-b border-[#0E0E0F]/15 bg-[#EDEDEB] px-4 py-3 transition-all duration-300 md:px-7 ${filterOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
        aria-hidden={!filterOpen}
      >
        <button type="button" tabIndex={filterOpen ? 0 : -1} aria-pressed={division === 'all'} onClick={() => setDivision('all')} className={`border px-3 py-1.5 font-mono text-[11px] ${division === 'all' ? 'border-[#0E0E0F] bg-[#0E0E0F] text-[#EDEDEB]' : 'border-[#0E0E0F]/15'}`}>
          Semua <em className="not-italic opacity-60">{works.length}</em>
        </button>
        {divisions.map((d) => (
          <button
            key={d}
            type="button"
            tabIndex={filterOpen ? 0 : -1}
            aria-pressed={division === d}
            onClick={() => setDivision(d)}
            className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] ${division === d ? 'border-[#0E0E0F] bg-[#0E0E0F] text-[#EDEDEB]' : 'border-[#0E0E0F]/15'}`}
          >
            {DIVISION_ICON[d] && (
              <i
                aria-hidden
                className="inline-block h-3.5 w-3.5"
                style={{
                  backgroundColor: division === d ? '#EDEDEB' : '#0E0E0F',
                  WebkitMask: `url(/brand/icons/${DIVISION_ICON[d]}.png) center/contain no-repeat`,
                  mask: `url(/brand/icons/${DIVISION_ICON[d]}.png) center/contain no-repeat`,
                }}
              />
            )}
            {DIVISION_LABELS[d]} <em className="not-italic opacity-60">{counts[d] ?? 0}</em>
          </button>
        ))}
      </div>

      {isError ? (
        <div className="absolute inset-0 grid place-content-center gap-3 text-center font-mono text-[11px]">
          <p>Karya belum bisa dimuat. Periksa koneksi lalu coba lagi.</p>
          <button type="button" onClick={() => refetch()} className="mx-auto border-b border-[#0E0E0F] pb-0.5">Coba lagi</button>
        </div>
      ) : !isLoading && visible.length === 0 ? (
        <div className="absolute inset-0 grid place-content-center gap-3 text-center font-mono text-[11px]">
          <p>{works.length === 0 ? 'Belum ada karya yang terbit.' : 'Tidak ada karya yang cocok dengan pencarian ini.'}</p>
          {division !== 'all' && <button type="button" onClick={() => setDivision('all')} className="mx-auto border-b border-[#0E0E0F] pb-0.5">Tampilkan semua</button>}
        </div>
      ) : view === 'canvas' ? (
        <WorksCanvas {...props} />
      ) : view === 'list' ? (
        <ListView {...props} />
      ) : (
        <GalleryView {...props} />
      )}

      {openIndex >= 0 && <Lightbox items={visible} index={openIndex} numbers={numbers} onClose={close} onStep={step} />}
    </section>
  );
}
