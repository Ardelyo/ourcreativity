import React from 'react';
import { DISCORD_URL, EDISI, IG_UTAMA } from '../lib/edisi';
import { Reveal } from '../components/modern/Reveal';
import { Arrow, Em, LinkButton, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

// Tautan pendaftaran per edisi (dipindah dari halaman Gerbang lama). Edisi tanpa tautan: lewat DM Instagram edisinya.
const DAFTAR: Record<string, { href: string; via: string }> = {
  tulis: { href: 'https://chat.whatsapp.com/CQz2xHzSxGT4YojQ3EWrbE', via: 'Grup WhatsApp' },
  grafis: { href: 'https://forms.gle/d1SBHkeCWdDfYLGHA', via: 'Formulir' },
  video: { href: 'https://forms.gle/RZJgCeZWgBQF8DDd8', via: 'Formulir' },
  meme: { href: 'https://chat.whatsapp.com/BVTsqKqYa9UL2CykAsMmJZ', via: 'Grup WhatsApp' },
  kode: { href: 'https://forms.gle/koA7J9giDqtokfBq7', via: 'Formulir' },
};

// /gabung: tiga langkah, menggantikan halaman Gerbang dan V5 Launch.
export const Gabung: React.FC = () => (
  <>
    <PageHeader
      label="(Gabung) Gratis, pemula boleh"
      title={<>Pilih edisimu, lalu <Em>mulai berkarya.</Em></>}
      lede="Tidak ada seleksi rumit. Pilih edisi yang paling dekat dengan minatmu, daftar lewat tautannya, dan masuk ke grup untuk berkenalan."
    />

    <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
      <SectionRule label="(Langkah 1) Pilih edisi" aside={`${EDISI.length} edisi`} />
      <ul>
        {EDISI.map((e, i) => {
          const d = DAFTAR[e.key];
          return (
            <Reveal as="li" key={e.key} delay={Math.min(i, 6) * 40} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-[#0E0E0F]/15 py-5 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <span className="hidden font-mono text-[11px] text-[#8A8A8F] md:block">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block font-display text-[clamp(1.6rem,3.6vw,3rem)] font-bold leading-none tracking-[-0.04em]">{e.nama}</span>
                <span className="font-mono text-[11px] text-[#55555A]">@{e.handle}</span>
              </span>
              <span className="col-span-2 font-mono text-[11px] text-[#55555A] md:col-span-1">{d ? `Daftar lewat ${d.via.toLowerCase()}` : 'Kirim DM ke akun edisinya'}</span>
              <span className="row-start-1 col-start-2 md:row-start-auto md:col-start-auto">
                {d ? (
                  <LinkButton href={d.href} cursor="Daftar">
                    Daftar <Arrow />
                  </LinkButton>
                ) : (
                  <LinkButton href={`https://www.instagram.com/${e.handle}/`} cursor="Buka">
                    Instagram <Arrow />
                  </LinkButton>
                )}
              </span>
            </Reveal>
          );
        })}
      </ul>
    </section>

    <section className={`${PAGE_X} grid gap-10 pb-[clamp(48px,8vw,120px)] md:grid-cols-2 md:gap-16`}>
      <div>
        <SectionRule label="(Langkah 2) Masuk Discord" />
        <p className="mt-4 max-w-[48ch] text-[#2B2B2E]">Tempat ngobrol, bertanya, dan mencari teman kolaborasi lintas edisi.</p>
        <div className="mt-5">
          <LinkButton href={DISCORD_URL} cursor="Buka">
            Buka Discord <Arrow />
          </LinkButton>
        </div>
      </div>
      <div>
        <SectionRule label="(Langkah 3) Ikuti dan berkarya" />
        <p className="mt-4 max-w-[48ch] text-[#2B2B2E]">Pantau @{IG_UTAMA} untuk program dan perekrutan. Karya terbaikmu bisa dikurasi masuk Katalog.</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <LinkButton href={`https://instagram.com/${IG_UTAMA}`}>
            Instagram <Arrow />
          </LinkButton>
          <LinkButton to="/karya">Lihat Katalog</LinkButton>
        </div>
      </div>
    </section>
  </>
);

export default Gabung;
