import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import { EDISI, EDISI_ASOF, PROGRAM, DISCORD_URL, IG_UTAMA } from '../lib/edisi';
import type { PublicWork } from '../lib/works';
import { WorkImage } from '../components/modern/WorkImage';

const Arrow = () => <span className="oc-arrow inline-block">↗</span>;

const Marquee = ({ items, reverse }: { items: PublicWork[]; reverse?: boolean }) => {
  const row = items.map((w) => (
    <Link key={w.id} to="/karya" className="group relative block flex-none" aria-label={`${w.title} oleh ${w.author}`}>
      <WorkImage work={w} className="h-[clamp(130px,16vw,250px)] w-auto" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        @{w.username ?? w.author}
      </span>
    </Link>
  ));
  return (
    <div className={`oc-marquee flex w-max gap-2 ${reverse ? 'oc-marquee-rev' : ''}`}>
      {row}
      {row.map((el, i) => React.cloneElement(el, { key: `dup-${i}`, 'aria-hidden': true, tabIndex: -1 }))}
    </div>
  );
};

export const Home = () => {
  const { data: works = [], isLoading } = useWorks(120);
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const withImage = useMemo(() => works.filter((w) => w.image), [works]);
  const rowA = useMemo(() => withImage.filter((_, i) => i % 2 === 0).slice(0, 30), [withImage]);
  const rowB = useMemo(() => withImage.filter((_, i) => i % 2 === 1).slice(0, 30), [withImage]);

  return (
    <div className="text-[#0E0E0F]">
      {/* Hero */}
      <section className="oc-grid-paper">
        <div className="mx-auto max-w-[1560px] px-4 pt-[clamp(40px,7vw,110px)] md:px-8">
          <h1 className="max-w-[12ch] text-balance font-display text-[clamp(3.2rem,10.6vw,11rem)] font-bold leading-[0.86] tracking-[-0.055em]">
            Para member yang <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">berkarya</em>.
          </h1>
          <div className="mt-[clamp(26px,4vw,56px)] grid grid-cols-1 gap-x-6 gap-y-5 pb-[clamp(28px,4vw,56px)] md:grid-cols-12">
            <p className="max-w-[30em] text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.45] text-[#55555A] md:col-span-5">
              OurCreativity adalah komunitas desainer, ilustrator, pembuat meme, programmer, editor video, fotografer, dan penulis.{' '}
              <b className="font-semibold text-[#0E0E0F]">Kami tidak menjelaskan kreativitas. Kami memajangnya.</b>
            </p>
            <dl className="grid grid-cols-[auto_1fr] content-start gap-x-6 gap-y-1.5 font-mono text-[11px] md:col-span-5 md:col-start-8">
              <dt className="text-[#8A8A8F]">Pengikut @{IG_UTAMA}</dt><dd className="text-right tabular-nums">31.3K</dd>
              <dt className="text-[#8A8A8F]">Karya terbit di Instagram</dt><dd className="text-right tabular-nums">8,402</dd>
              <dt className="text-[#8A8A8F]">Edisi</dt><dd className="text-right tabular-nums">{EDISI.length}</dd>
              <dt className="text-[#8A8A8F]">Karya di platform ini</dt><dd className="text-right tabular-nums">{isLoading ? '…' : works.length}</dd>
              <dt className="col-span-2 pt-1 text-[10px] text-[#8A8A8F]">Instagram per {EDISI_ASOF}.</dt>
            </dl>
            <div className="flex flex-wrap gap-7 pt-2 md:col-span-12">
              <Link to="/karya" className="oc-link">Lihat semua karya <Arrow /></Link>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link">Masuk Discord <Arrow /></a>
            </div>
          </div>
        </div>

        {withImage.length >= 6 ? (
          <div className="grid gap-2 overflow-hidden pb-2" aria-label="Karya anggota">
            <Marquee items={rowA} />
            {rowB.length >= 4 && <Marquee items={rowB} reverse />}
          </div>
        ) : (
          <div className="mx-auto max-w-[1560px] px-4 pb-8 font-mono text-[11px] text-[#8A8A8F] md:px-8">
            {isLoading ? 'Memuat karya…' : 'Belum ada karya bergambar. Jadilah yang pertama.'}
          </div>
        )}
      </section>

      {/* Edisi */}
      <section id="edisi" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Edisi)</h2>
            <span>{EDISI.length} edisi, tiap edisi punya akun sendiri</span>
          </div>
          <p className="mb-[clamp(26px,4vw,56px)] mt-[clamp(20px,3vw,40px)] max-w-[16ch] text-balance font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Tujuh cara untuk <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">membuat</em> sesuatu.
          </p>
          <ul className="border-t border-[#0E0E0F]/15">
            {EDISI.map((e) => {
              const pool = withImage.filter((w) => (e.divisi ? w.division === e.divisi : true));
              const thumbs = (e.key === 'ilus' ? pool.slice(4, 9) : pool.slice(0, 5)).slice(0, 5);
              const inner = (
                <>
                  <h3 className="flex items-center gap-[0.28em] font-display text-[clamp(1.9rem,4.6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                    <span aria-hidden className="h-[0.2em] w-[0.2em] flex-none rounded-full" style={{ background: e.warna }} />
                    {e.nama}
                  </h3>
                  <div className="grid gap-0.5 font-mono text-[11px] opacity-70">
                    <span>@{e.handle}</span>
                    <span>{e.pengikut} pengikut</span>
                  </div>
                  <div className="hidden justify-end gap-1.5 overflow-hidden md:flex" aria-hidden>
                    {thumbs.map((w) => (
                      <WorkImage key={w.id} work={w} className="h-[clamp(46px,5.4vw,76px)] w-auto transition-transform duration-300 group-hover:-translate-y-1.5" />
                    ))}
                  </div>
                  <span className="justify-self-end text-2xl" aria-hidden>↗</span>
                </>
              );
              const cls = 'group grid grid-cols-[1fr_28px] items-center gap-3 border-b border-[#0E0E0F]/15 py-[clamp(14px,1.6vw,22px)] transition-colors hover:bg-[#0E0E0F] hover:px-3 hover:text-[#EDEDEB] md:grid-cols-[5.2fr_2.6fr_4.2fr_28px] md:gap-7';
              return (
                <li key={e.key}>
                  {e.divisi ? (
                    <Link to={`/karya?divisi=${e.divisi}`} className={cls}>{inner}</Link>
                  ) : (
                    <a href={`https://www.instagram.com/${e.handle}/`} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="scroll-mt-16 pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Program)</h2>
            <span>Dari highlight Instagram</span>
          </div>
          <p className="mb-[clamp(26px,4vw,56px)] mt-[clamp(20px,3vw,40px)] max-w-[16ch] text-balance font-display text-[clamp(2.4rem,6.4vw,6.4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Selalu ada yang <em className="font-editorial text-[1.08em] font-normal italic tracking-[-0.03em]">jalan</em>.
          </p>
          <div className="border-t border-[#0E0E0F]/15">
            {PROGRAM.map((p) => (
              <div key={p.nama} className="grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-b border-[#0E0E0F]/15 py-4 md:grid-cols-12">
                <h3 className="font-display text-[clamp(1.3rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.035em] md:col-span-5">{p.nama}</h3>
                <span className="font-mono text-[11px] text-[#8A8A8F] md:col-span-2">{p.edisi}</span>
                <p className="text-[0.98rem] leading-[1.45] text-[#55555A] md:col-span-5">{p.ket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gabung */}
      <section id="gabung" className="scroll-mt-16 pb-[clamp(40px,6vw,80px)] pt-[clamp(54px,8vw,120px)]">
        <div className="mx-auto max-w-[1560px] px-4 md:px-8">
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-[#0E0E0F] pt-3 font-mono text-[11px]">
            <h2 className="font-semibold">(Gabung)</h2>
            <span>Tidak perlu portofolio besar</span>
          </div>
          <p className="mt-[clamp(20px,3vw,40px)] font-display text-[clamp(4.4rem,17vw,17rem)] font-bold leading-[0.8] tracking-[-0.07em]">
            Gabung<em className="font-editorial font-normal italic tracking-[-0.03em]">.</em>
          </p>
          <div className="mt-[clamp(26px,4vw,56px)] grid grid-cols-1 gap-7 md:grid-cols-12 md:gap-x-6">
            <ol className="border-t border-[#0E0E0F]/15 md:col-span-7">
              {[
                ['Pilih edisi', 'Buka profil edisi yang paling dekat dengan keahlianmu.'],
                ['Isi formulir di bio', 'Tiap edisi menaruh tautan pendaftarannya sendiri.'],
                ['Pamerkan', 'Kenalan di Discord, ikut kegiatan, kirim karya pertamamu.'],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[48px_1fr] border-b border-[#0E0E0F]/15 py-3.5 text-[1.05rem]">
                  <span className="font-mono text-[11px] text-[#8A8A8F]">{i + 1}</span>
                  <div><b className="block font-semibold">{t}</b>{d}</div>
                </li>
              ))}
            </ol>
            <div className="grid content-start gap-2.5 md:col-span-4 md:col-start-9">
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link-lg">Masuk Discord <Arrow /></a>
              <a href={`https://www.instagram.com/${IG_UTAMA}/`} target="_blank" rel="noopener noreferrer" className="oc-link-lg">@{IG_UTAMA} <Arrow /></a>
              <Link to="/register" className="oc-link-lg">Buat akun platform <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
