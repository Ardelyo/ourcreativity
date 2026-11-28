import React from 'react';
import { Link } from 'react-router-dom';
import { DISCORD_URL, EDISI, IG_UTAMA } from '../lib/edisi';
import { Reveal } from '../components/modern/Reveal';
import { Arrow, Em, LinkButton, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

const FAQ = [
  { q: 'Apakah komunitas ini gratis?', a: 'Ya, gratis. Diskusi, event, dan proyek kolaborasi berjalan tanpa biaya supaya siapa pun bisa mengembangkan keterampilannya.' },
  { q: 'Bagaimana cara bergabung?', a: 'Buka halaman Gabung, pilih edisi yang paling dekat dengan keahlianmu, lalu ikuti tautan pendaftarannya. Pengumuman perekrutan juga muncul di Instagram @ourcreativity.ofc.' },
  { q: 'Apakah pemula boleh ikut?', a: 'Boleh. Komunitas ini dibentuk sebagai tempat belajar bagi yang ingin mencoba sesuatu tetapi belum punya tempat bertanya.' },
  { q: 'Apa itu sistem "The Loop"?', a: 'Ekosistem kami: terpicu oleh konten, bergabung, berkarya, berkolaborasi, konsisten, lalu menjadi inspirasi baru bagi orang berikutnya.' },
  { q: 'Karya saya muncul di Katalog tanpa izin. Bagaimana?', a: 'Katalog hanya memuat postingan publik, lengkap dengan nama kreator dan tautan sumber. Kalau kamu ingin karyamu dicabut atau kreditnya diperbaiki, hubungi kami lewat Kotak Surat atau DM Instagram, dan kami proses secepatnya.' },
];

export const Info: React.FC = () => (
  <>
    <PageHeader
      label="(Info) Pusat informasi"
      title={<>Semua yang perlu kamu <Em>tahu.</Em></>}
      lede="Cara kerja komunitas, cara bergabung, dan tempat bertanya. Kalau jawabannya belum ada di sini, tanyakan lewat Kotak Surat."
    />

    <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
      <SectionRule label="(Edisi)" aside={`${EDISI.length} edisi aktif`} />
      <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        {EDISI.map((e) => (
          <li key={e.key} className="border-b border-[#0E0E0F]/15">
            <Link to={`/edisi/${e.key}`} className="group flex items-center justify-between gap-4 py-4" data-cursor="Buka">
              <span>
                <span className="block font-display text-2xl font-bold tracking-tight">{e.nama}</span>
                <span className="font-mono text-[11px] text-[#55555A]">@{e.handle}</span>
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden>
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <section className={`${PAGE_X} grid gap-10 pb-[clamp(36px,6vw,80px)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16`}>
      <div>
        <SectionRule label="(Pertanyaan umum)" aside={`${FAQ.length} pertanyaan`} />
        <div>
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="group border-b border-[#0E0E0F]/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-[clamp(1.1rem,2vw,1.5rem)] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="font-mono text-lg transition-transform duration-300 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-5 leading-relaxed text-[#2B2B2E]">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>

      <aside>
        <SectionRule label="(Hubungi kami)" />
        <ul className="font-display text-lg font-semibold tracking-tight">
          <li className="border-b border-[#0E0E0F]/15 py-4">
            <a href={`https://instagram.com/${IG_UTAMA}`} target="_blank" rel="noopener noreferrer" className="oc-link flex items-center justify-between">
              Instagram @{IG_UTAMA} <Arrow />
            </a>
          </li>
          <li className="border-b border-[#0E0E0F]/15 py-4">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="oc-link flex items-center justify-between">
              Discord <Arrow />
            </a>
          </li>
          <li className="border-b border-[#0E0E0F]/15 py-4">
            <a href="https://linktr.ee/ourcreativity.ofc" target="_blank" rel="noopener noreferrer" className="oc-link flex items-center justify-between">
              Linktree <Arrow />
            </a>
          </li>
          <li className="border-b border-[#0E0E0F]/15 py-4">
            <Link to="/kotak-surat" className="oc-link flex items-center justify-between">
              Kotak Surat (pesan anonim) <Arrow />
            </Link>
          </li>
        </ul>
        <div className="mt-8">
          <LinkButton to="/gabung">Gabung komunitas</LinkButton>
        </div>
      </aside>
    </section>
  </>
);
