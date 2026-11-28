import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { EDISI, EDISI_ASOF, PROGRAM } from '../lib/edisi';
import { WorkImage } from '../components/modern/WorkImage';
import { WorkLightbox } from '../components/modern/WorkLightbox';
import { Reveal } from '../components/modern/Reveal';
import { Arrow, EmptyState, Em, LinkButton, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';
import { NotFound } from './NotFound';

const dot = (warna: string) => (warna === '#161616' ? '#8A8A8F' : warna);

// /edisi: tujuh edisi sebagai daftar bernomor besar, tiap baris membuka profil edisinya.
export const EdisiIndex: React.FC = () => {
  const { data: works = [], isLoading } = useWorks(240);
  const byEdisi = useMemo(() => {
    const m = new Map<string, typeof works>();
    works.filter((w) => w.image).forEach((w) => m.set(w.edisi, [...(m.get(w.edisi) ?? []), w]));
    return m;
  }, [works]);

  return (
    <>
      <PageHeader
        label={`(Edisi) ${EDISI.length} edisi, tiap edisi punya akun Instagram sendiri`}
        title={<>Tujuh cara untuk <Em>membuat</Em> sesuatu.</>}
        lede="OurCreativity terdiri dari beberapa edisi. Masing-masing mengelola akun, program, dan aturannya sendiri. Pilih yang paling dekat dengan keahlianmu."
      />
      <section className={`${PAGE_X} pb-8`}>
        <ul className="border-t border-[#0E0E0F]/20">
          {EDISI.map((e, i) => {
            const pool = byEdisi.get(e.key) ?? [];
            return (
              <li key={e.key} className="border-b border-[#0E0E0F]/20">
                <Link
                  to={`/edisi/${e.key}`}
                  data-cursor="Buka"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 py-5 transition-colors duration-300 hover:bg-[#0E0E0F] hover:text-[#EDEDEB] md:grid-cols-[3rem_minmax(0,1fr)_14rem_auto] md:gap-x-8 md:px-3"
                >
                  <span className="font-mono text-[11px] text-[#8A8A8F]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(2rem,6vw,5.4rem)] font-bold leading-[0.92] tracking-[-0.055em]">{e.nama}</span>
                    <span className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#55555A] group-hover:text-[#B9B9BD]">
                      <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: dot(e.warna) }} />@{e.handle}
                      <span className="hidden sm:inline">· {e.pengikut} pengikut</span>
                    </span>
                  </span>
                  <span className="hidden h-16 items-center justify-end gap-1.5 md:flex" aria-hidden>
                    {pool.slice(0, 3).map((w, k) => (
                      <img
                        key={w.id}
                        src={w.image as string}
                        alt=""
                        loading="lazy"
                        className="h-full w-12 translate-y-2 object-cover opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{ transitionDelay: `${k * 60}ms` }}
                      />
                    ))}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[11px]">
                    <span>{isLoading ? '…' : `${pool.length} karya`}</span>
                    <span className="text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-mono text-[10px] text-[#8A8A8F]">Jumlah pengikut per {EDISI_ASOF}, potret dari profil publik.</p>
      </section>
    </>
  );
};

// /edisi/:key: profil satu edisi: akun, program, dan karyanya.
export const EdisiDetail: React.FC = () => {
  const { key } = useParams();
  const index = EDISI.findIndex((e) => e.key === key);
  const edisi = EDISI[index];
  const { data: works = [], isLoading } = useWorks(240);
  const [openId, setOpenId] = useState<string | null>(null);

  const mine = useMemo(() => works.filter((w) => w.edisi === key && w.image), [works, key]);
  const numbers = useMemo(() => new Map([...works].reverse().map((w, i) => [w.id, i + 1] as [string, number])), [works]);
  const openIndex = openId ? mine.findIndex((w) => w.id === openId) : -1;
  const step = (d: number) =>
    setOpenId((cur) => {
      if (!mine.length) return null;
      const i = mine.findIndex((w) => w.id === cur);
      return mine[(i + d + mine.length) % mine.length].id;
    });

  if (!edisi) return <NotFound />;
  const programs = PROGRAM.filter((p) => p.edisi === edisi.nama);
  const prev = EDISI[(index - 1 + EDISI.length) % EDISI.length];
  const next = EDISI[(index + 1) % EDISI.length];

  return (
    <>
      <PageHeader label={`(Edisi ${String(index + 1).padStart(2, '0')}/${String(EDISI.length).padStart(2, '0')})`} title={edisi.nama}>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px]">
          <span className="flex items-center gap-2">
            <i className="inline-block h-3 w-3 rounded-full" style={{ background: dot(edisi.warna) }} />
            @{edisi.handle}
          </span>
          <span className="text-[#55555A]">
            {edisi.pengikut} pengikut · per {EDISI_ASOF}
          </span>
          <span className="text-[#55555A]">{isLoading ? '…' : `${mine.length} karya di katalog`}</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
          <LinkButton href={`https://www.instagram.com/${edisi.handle}/`} cursor="Buka">
            Buka di Instagram <Arrow />
          </LinkButton>
          <LinkButton to={`/karya?edisi=${edisi.key}`}>Lihat di bola karya</LinkButton>
        </div>
      </PageHeader>

      {programs.length > 0 && (
        <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
          <SectionRule label="(Program)" aside={`${programs.length} program`} />
          <ul>
            {programs.map((p, i) => (
              <Reveal as="li" key={p.nama} delay={i * 0.05} className="grid grid-cols-1 gap-1 border-b border-[#0E0E0F]/15 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
                <span className="font-display text-2xl font-bold tracking-tight">{p.nama}</span>
                <span className="text-[#2B2B2E]">{p.ket}</span>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
        <SectionRule label="(Karya)" aside="Klik untuk memperbesar" />
        {mine.length === 0 && !isLoading ? (
          <div className="mt-6">
            <EmptyState
              title="Belum ada karya edisi ini di katalog"
              hint="Karya dikurasi dari postingan publik. Edisi ini belum punya yang masuk."
              action={<LinkButton href={`https://www.instagram.com/${edisi.handle}/`}>Lihat akunnya</LinkButton>}
            />
          </div>
        ) : (
          <div className="mt-6 columns-2 gap-3 md:columns-3 lg:columns-4">
            {mine.map((w, i) => (
              <Reveal key={w.id} delay={(i % 4) * 0.05} className="mb-3 break-inside-avoid">
                <button type="button" onClick={() => setOpenId(w.id)} className="group block w-full text-left" data-cursor="Buka" aria-label={`Buka karya ${w.title} oleh ${w.author}`}>
                  <WorkImage work={w} className="w-full transition-transform duration-500 group-hover:-translate-y-1" />
                  <span className="mt-1 block font-mono text-[10px] text-[#55555A]">@{w.username ?? w.author}</span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <nav className={`${PAGE_X} grid grid-cols-2 gap-4 border-t border-[#0E0E0F]/20 py-6`} aria-label="Edisi lain">
        <Link to={`/edisi/${prev.key}`} className="group" data-cursor="Sebelumnya">
          <span className="font-mono text-[10px] text-[#8A8A8F]">← Sebelumnya</span>
          <span className="block font-display text-[clamp(1.4rem,3vw,2.6rem)] font-bold tracking-tight transition-transform group-hover:-translate-x-1">{prev.nama}</span>
        </Link>
        <Link to={`/edisi/${next.key}`} className="group text-right" data-cursor="Berikutnya">
          <span className="font-mono text-[10px] text-[#8A8A8F]">Berikutnya →</span>
          <span className="block font-display text-[clamp(1.4rem,3vw,2.6rem)] font-bold tracking-tight transition-transform group-hover:translate-x-1">{next.nama}</span>
        </Link>
      </nav>

      {openIndex >= 0 && <WorkLightbox items={mine} index={openIndex} numbers={numbers} onClose={() => setOpenId(null)} onStep={step} />}
    </>
  );
};
