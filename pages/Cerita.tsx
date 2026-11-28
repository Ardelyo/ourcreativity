import React from 'react';
import { EDISI } from '../lib/edisi';
import { Reveal } from '../components/modern/Reveal';
import { Em, LinkButton, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

const LOGO = [
  { k: 'Infinity', v: 'Kreativitas manusia tidak seharusnya dibatasi: terus berkembang, makin baik, dan punya ciri khas sendiri.' },
  { k: 'Inisial O.C', v: 'Singkatan OurCreativity. Wadah inklusif tempat setiap orang menjelajahi bakatnya bersama-sama.' },
  { k: 'Warna merah', v: 'Keberanian yang dibutuhkan dalam berkarya. Tanpa keberanian, tak ada yang berkembang atau menciptakan hal baru.' },
];

const MISI = [
  'Menghubungkan anak muda berbakat lewat media sosial untuk bergabung dalam komunitas.',
  'Menyediakan ruang diskusi dan kolaborasi agar anggota saling berbagi ilmu.',
  'Mempublikasikan karya anggota agar mendapat apresiasi yang luas.',
  'Menyelenggarakan program gratis: diskusi, event, dan proyek kolaboratif.',
  'Mendorong anggota menguasai berbagai bidang kreatif demi karya yang inovatif dan bernilai.',
];

const LINIMASA = [
  { t: 'Januari 2024', k: 'Kelahiran', v: 'Didirikan sebagai wadah bagi mereka yang punya kemauan belajar tetapi belum punya tempat bertanya.' },
  { t: 'Februari 2024', k: 'Pergerakan', v: 'Media sosial dipakai untuk menjaring anak muda berbakat lewat konten kreatif yang menginspirasi.' },
  { t: '2024', k: 'Ribuan anggota', v: 'Kurang dari setahun, ribuan anggota kreatif dari berbagai penjuru Indonesia bergabung.' },
  { t: '2024', k: 'Ekspansi edisi', v: 'Edisi Desain, Video, Meme, dan Karya Tulis diresmikan agar anggota mulai berkolaborasi.' },
  { t: '2025', k: 'Situs dan edisi Koding', v: 'Platform resmi diluncurkan bersama edisi Koding sebagai pilar teknologi komunitas.' },
  { t: '2026', k: 'Katalog', v: 'Karya anggota dikurasi menjadi Katalog yang bisa dijelajahi: bola karya, profil edisi, dan kredit untuk tiap kreator.' },
];

// /cerita: asal-usul, visi, dan makna logo, dalam satu halaman bergaya katalog.
export const Cerita: React.FC = () => (
  <>
    <PageHeader
      label="(Cerita) Dari mana kami datang"
      title={<>Wadah untuk yang ingin <Em>belajar</Em> dan berkarya.</>}
      lede="OurCreativity tumbuh dari satu keyakinan: banyak anak muda punya kemauan, tetapi tak punya tempat untuk bertanya dan mencoba. Komunitas ini dibuat untuk mengisi celah itu."
    />

    <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
      <SectionRule label="(Linimasa)" aside={`${LINIMASA.length} titik`} />
      <ol>
        {LINIMASA.map((m, i) => (
          <Reveal as="li" key={m.k} delay={i * 50} className="grid gap-1 border-b border-[#0E0E0F]/15 py-5 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
            <span className="font-mono text-[11px] text-[#55555A]">{m.t}</span>
            <span className="font-display text-2xl font-bold tracking-tight">{m.k}</span>
            <span className="text-[#2B2B2E]">{m.v}</span>
          </Reveal>
        ))}
      </ol>
    </section>

    <section className={`${PAGE_X} grid gap-10 pb-[clamp(36px,6vw,80px)] lg:grid-cols-2 lg:gap-16`}>
      <div>
        <SectionRule label="(Visi)" />
        <h2 className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(2rem,4.4vw,4rem)] font-bold leading-[0.92] tracking-[-0.05em]">
          Mengasah bakat, <Em>mencipta karya.</Em>
        </h2>
        <p className="mt-4 max-w-[54ch] text-[#2B2B2E]">Mengembangkan jiwa kreatif anak muda Indonesia dengan menyediakan wadah untuk berdiskusi, berkolaborasi, dan menghasilkan karya.</p>
      </div>
      <div>
        <SectionRule label="(Misi)" aside={`${MISI.length} butir`} />
        <ol className="mt-1">
          {MISI.map((m, i) => (
            <li key={m} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-[#0E0E0F]/15 py-3 text-[15px] leading-relaxed">
              <span className="font-mono text-[11px] text-[#8A8A8F]">{String(i + 1).padStart(2, '0')}</span>
              {m}
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
      <SectionRule label="(Filosofi logo)" />
      <div className="grid gap-8 pt-6 md:grid-cols-3">
        {LOGO.map((l) => (
          <div key={l.k}>
            <h3 className="font-display text-2xl font-bold tracking-tight">{l.k}</h3>
            <p className="mt-2 text-[#2B2B2E]">{l.v}</p>
          </div>
        ))}
      </div>
    </section>

    <section className={`${PAGE_X} pb-[clamp(48px,8vw,120px)]`}>
      <div className="border-t-2 border-[#0E0E0F] pt-6">
        <p className="max-w-[40ch] font-display text-[clamp(1.6rem,3.4vw,3rem)] font-bold leading-[1] tracking-[-0.04em]">
          Sekarang ada {EDISI.length} edisi. Temukan yang paling dekat dengan keahlianmu.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <LinkButton to="/edisi">Lihat semua edisi</LinkButton>
          <LinkButton to="/gabung">Gabung komunitas</LinkButton>
        </div>
      </div>
    </section>
  </>
);

export default Cerita;
