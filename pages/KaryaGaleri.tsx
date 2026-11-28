import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { EDISI } from '../lib/edisi';
import { formatNo, type PublicWork } from '../lib/works';
import { WorkImage } from '../components/modern/WorkImage';
import { WorkLightbox } from '../components/modern/WorkLightbox';
import { WorksGlobe, type GlobeHandle } from '../components/modern/WorksGlobe';

type View = 'globe' | 'wall' | 'list' | 'gallery';

const handleOf = (w: PublicWork) => w.username ?? w.author;
const edisiName = (key: string) => EDISI.find((e) => e.key === key)?.nama ?? key;

interface ViewProps {
  items: PublicWork[];
  numbers: Map<string, number>;
  onOpen: (id: string) => void;
}

/* ---------------------------------- Daftar ---------------------------------- */

const ListView: React.FC<ViewProps> = ({ items, numbers, onOpen }) => {
  const [hover, setHover] = useState<{ w: PublicWork; x: number; y: number } | null>(null);
  return (
    <div className="absolute inset-0 overflow-auto px-4 pb-10 pt-[116px] md:px-7 md:pt-[84px]" onPointerLeave={() => setHover(null)}>
      <div className="grid grid-cols-[44px_1fr_28px] gap-4 border-b-2 border-[#0E0E0F] pb-2 font-mono text-[11px] text-[#8A8A8F] md:grid-cols-[64px_3fr_2fr_40px]">
        <span>No.</span><span>Kreator</span><span className="hidden md:block">Edisi</span><span />
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
          <span className="hidden font-mono text-[11px] md:block">{edisiName(w.edisi)}</span>
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

const GalleryView: React.FC<ViewProps> = ({ items, numbers, onOpen }) => (
  <div className="absolute inset-0 flex snap-x snap-mandatory items-center gap-[clamp(18px,3vw,48px)] overflow-x-auto px-4 pb-6 pt-[132px] md:px-7 md:pt-24">
    {items.map((w) => (
      <figure key={w.id} className="m-0 flex h-full max-h-[calc(100%-40px)] flex-none snap-center flex-col gap-2.5">
        <button type="button" onClick={() => onOpen(w.id)} className="min-h-0 flex-1 text-left" aria-label={`Buka karya ${formatNo(numbers.get(w.id) ?? 0)}: ${w.title}`}>
          <WorkImage work={w} className="h-full w-auto max-w-[86vw] object-contain" />
        </button>
        <figcaption className="flex justify-between gap-5 font-mono text-[11px]">
          <span>{formatNo(numbers.get(w.id) ?? 0)}. @{handleOf(w)}</span>
          <span className="text-[#8A8A8F]">{edisiName(w.edisi)}</span>
        </figcaption>
      </figure>
    ))}
  </div>
);

/* ---------------------------------- Halaman --------------------------------- */

const VIEWS: { key: View; label: string }[] = [
  { key: 'globe', label: 'Bola' },
  { key: 'wall', label: 'Peta' },
  { key: 'list', label: 'Daftar' },
  { key: 'gallery', label: 'Galeri' },
];

export default function KaryaGaleri() {
  const { data: works = [], isLoading, isError, refetch } = useWorks(240);
  const [params, setParams] = useSearchParams();
  const edisi = params.get('edisi') ?? 'all';
  const [view, setView] = useState<View>('globe');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const globe = useRef<GlobeHandle>(null);

  // Tautan bagikan lama (/karya?id=...) membuka karya terkait begitu datanya termuat.
  const idParam = params.get('id');
  useEffect(() => {
    if (idParam && works.some((w) => w.id === idParam)) setOpenId(idParam);
  }, [idParam, works]);

  // Nomor urut: karya paling lama = 001, seperti katalog.
  const numbers = useMemo(() => new Map([...works].reverse().map((w, i) => [w.id, i + 1] as [string, number])), [works]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    works.forEach((w) => { c[w.edisi] = (c[w.edisi] ?? 0) + 1; });
    return c;
  }, [works]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      if (edisi !== 'all' && w.edisi !== edisi) return false;
      if (!q) return true;
      return `${w.author} ${w.username ?? ''} ${w.title}`.toLowerCase().includes(q);
    });
  }, [works, edisi, query]);

  const setEdisi = (d: string) => {
    const next = new URLSearchParams(params);
    if (d === 'all') next.delete('edisi'); else next.set('edisi', d);
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

  const isGlobe = view === 'globe' || view === 'wall';
  // Bola dan peta hanya menampilkan karya bergambar; karya tanpa gambar tetap ada di Daftar.
  const pictured = useMemo(() => visible.filter((w) => w.image), [visible]);
  const props: ViewProps = { items: visible, numbers, onOpen: setOpenId };
  const chips = EDISI.filter((e) => (counts[e.key] ?? 0) > 0);

  return (
    <section className="oc-karya relative overflow-hidden bg-[#EDEDEB] text-[#0E0E0F]" aria-label="Katalog karya">
      <div className="oc-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {isError ? (
        <div className="absolute inset-0 grid place-content-center gap-3 text-center font-mono text-[11px]">
          <p>Karya belum bisa dimuat. Periksa koneksi lalu coba lagi.</p>
          <button type="button" onClick={() => refetch()} className="mx-auto border-b border-[#0E0E0F] pb-0.5">Coba lagi</button>
        </div>
      ) : !isLoading && visible.length === 0 ? (
        <div className="absolute inset-0 grid place-content-center gap-3 text-center font-mono text-[11px]">
          <p>{works.length === 0 ? 'Belum ada karya yang terbit.' : 'Tidak ada karya yang cocok dengan pencarian ini.'}</p>
          {edisi !== 'all' && <button type="button" onClick={() => setEdisi('all')} className="mx-auto border-b border-[#0E0E0F] pb-0.5">Tampilkan semua</button>}
        </div>
      ) : isGlobe ? (
        <WorksGlobe ref={globe} items={pictured} mode={view === 'wall' ? 'wall' : 'globe'} onOpen={setOpenId} className="absolute inset-0" radiusScale={0.4} />
      ) : view === 'list' ? (
        <ListView {...props} />
      ) : (
        <GalleryView {...props} />
      )}

      {/* Bilah atas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] grid grid-cols-1 items-start gap-1.5 bg-gradient-to-b from-[#EDEDEB] from-65% to-transparent px-4 pb-3 pt-3 md:grid-cols-[1fr_auto_1fr] md:gap-3 md:px-7 md:pb-0 md:pt-3.5 [&>*]:pointer-events-auto">
        <div className="hidden gap-1 font-mono text-[11px] md:grid">
          <b className="font-display text-base font-bold tracking-tight">OurCreativity Katalog</b>
          <span className="text-[#8A8A8F]">
            {isLoading ? 'Memuat…' : `${visible.length} karya`}
            {edisi !== 'all' ? ` di ${edisiName(edisi)}` : ''}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-1 font-mono text-[11px]" role="group" aria-label="Tampilan">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={view === v.key}
              onClick={() => setView(v.key)}
              className={`whitespace-nowrap border-b px-1.5 py-1 transition-colors ${view === v.key ? 'border-[#0E0E0F] text-[#0E0E0F]' : 'border-transparent text-[#8A8A8F] hover:text-[#0E0E0F]'}`}
            >
              [ {v.label} ]
            </button>
          ))}
        </div>
        <div className="flex items-start justify-between gap-3 font-mono text-[11px] md:justify-end md:gap-3.5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kreator"
            aria-label="Cari kreator atau judul"
            className="w-[38vw] min-w-0 border-b md:w-[clamp(80px,12vw,160px)] border-[#0E0E0F] bg-transparent px-0.5 py-1 outline-none placeholder:text-[#8A8A8F]"
          />
          {isGlobe && (
            <button type="button" onClick={() => globe.current?.shuffle()} className="whitespace-nowrap py-1 text-[#8A8A8F] transition-colors hover:text-[#0E0E0F]" data-cursor="Acak">
              Acak ↻
            </button>
          )}
          <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((v) => !v)} className="whitespace-nowrap py-1 text-[#8A8A8F] transition-colors hover:text-[#0E0E0F]">
            Filter [{filterOpen ? '−' : '+'}]
          </button>
        </div>
      </div>

      {/* Filter edisi */}
      <div
        className={`absolute inset-x-0 top-[92px] z-[5] flex flex-wrap md:top-[52px] gap-1.5 border-b border-[#0E0E0F]/15 bg-[#EDEDEB] px-4 py-3 transition-all duration-300 md:px-7 ${filterOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
        aria-hidden={!filterOpen}
      >
        <button type="button" tabIndex={filterOpen ? 0 : -1} aria-pressed={edisi === 'all'} onClick={() => setEdisi('all')} className={`border px-3 py-1.5 font-mono text-[11px] transition-colors ${edisi === 'all' ? 'border-[#0E0E0F] bg-[#0E0E0F] text-[#EDEDEB]' : 'border-[#0E0E0F]/15 hover:border-[#0E0E0F]'}`}>
          Semua <em className="not-italic opacity-60">{works.length}</em>
        </button>
        {chips.map((e) => (
          <button
            key={e.key}
            type="button"
            tabIndex={filterOpen ? 0 : -1}
            aria-pressed={edisi === e.key}
            onClick={() => setEdisi(e.key)}
            className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] transition-colors ${edisi === e.key ? 'border-[#0E0E0F] bg-[#0E0E0F] text-[#EDEDEB]' : 'border-[#0E0E0F]/15 hover:border-[#0E0E0F]'}`}
          >
            {e.ikon ? (
              <i
                aria-hidden
                className="inline-block h-3.5 w-3.5"
                style={{
                  backgroundColor: edisi === e.key ? '#EDEDEB' : '#0E0E0F',
                  WebkitMask: `url(/brand/icons/${e.ikon}.png) center/contain no-repeat`,
                  mask: `url(/brand/icons/${e.ikon}.png) center/contain no-repeat`,
                }}
              />
            ) : (
              <i aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: e.warna }} />
            )}
            {e.nama} <em className="not-italic opacity-60">{counts[e.key] ?? 0}</em>
          </button>
        ))}
      </div>

      {isGlobe && !isError && visible.length > 0 && (
        <p className="pointer-events-none absolute bottom-3 left-4 z-[5] font-mono text-[10px] text-[#8A8A8F] md:left-7">
          {view === 'globe' ? 'Seret untuk memutar · roda untuk zoom · klik karya untuk membuka' : 'Seret untuk menggeser peta tanpa ujung · klik karya untuk membuka'}
        </p>
      )}

      {openIndex >= 0 && <WorkLightbox items={visible} index={openIndex} numbers={numbers} onClose={close} onStep={step} />}
    </section>
  );
}
