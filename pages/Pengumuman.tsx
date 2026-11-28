import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Reveal } from '../components/modern/Reveal';
import { EmptyState, Em, LoadingMark, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

interface Item {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  content?: string | null;
  date: string;
  category?: string | null;
  status?: string | null;
  highlights?: string[] | null;
}

const tanggal = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// /pengumuman: kabar komunitas, terbaru di atas. Isi lengkap terbuka lewat <details> (bisa dipakai keyboard).
export const Pengumuman: React.FC = () => {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async (): Promise<Item[]> => {
      const { data: rows, error: err } = await supabase
        .from('announcements')
        .select('id, title, subtitle, description, content, date, category, status, highlights')
        .eq('type', 'announcement')
        .order('date', { ascending: false });
      if (err) throw err;
      return rows ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <PageHeader
        label="(Pengumuman) Kabar dari komunitas"
        title={<>Ada apa yang <Em>baru?</Em></>}
        lede="Program, event, dan pembaruan platform. Yang terbaru ada di paling atas."
      />
      <section className={`${PAGE_X} pb-[clamp(48px,8vw,120px)]`}>
        <SectionRule label="(Terbaru)" aside={isLoading ? '…' : `${data.length} pengumuman`} />
        {isLoading ? (
          <LoadingMark label="Memuat pengumuman" />
        ) : error ? (
          <div className="mt-6">
            <EmptyState
              title="Pengumuman belum bisa dimuat"
              hint="Periksa koneksimu lalu coba lagi."
              action={
                <button type="button" onClick={() => refetch()} className="oc-link border-b border-[#0E0E0F] font-display font-semibold">
                  Coba lagi
                </button>
              }
            />
          </div>
        ) : data.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="Belum ada pengumuman" hint="Kembali lagi nanti, atau pantau Instagram @ourcreativity.ofc." />
          </div>
        ) : (
          <ul>
            {data.map((a, i) => (
              <Reveal as="li" key={a.id} delay={Math.min(i, 6) * 40} className="border-b border-[#0E0E0F]/15">
                <details className="group py-5" open={i === 0}>
                  <summary className="grid cursor-pointer list-none gap-x-8 gap-y-1 md:grid-cols-[9rem_minmax(0,1fr)_auto] [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[11px] text-[#55555A]">
                      {tanggal(a.date)}
                      {a.status === 'Baru' && <b className="ml-2 bg-[#0E0E0F] px-1.5 py-0.5 font-normal text-[#EDEDEB]">Baru</b>}
                    </span>
                    <span>
                      <span className="block font-display text-[clamp(1.4rem,3vw,2.6rem)] font-bold leading-[1] tracking-[-0.04em]">{a.title}</span>
                      {a.subtitle && <span className="mt-1 block text-[#55555A]">{a.subtitle}</span>}
                    </span>
                    <span className="font-mono text-lg transition-transform duration-300 group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                    <span className="font-mono text-[11px] text-[#55555A]">{a.category}</span>
                    <div className="max-w-[64ch] space-y-3 leading-relaxed text-[#2B2B2E]">
                      {a.description && <p className="text-[1.1rem] text-[#0E0E0F]">{a.description}</p>}
                      {a.content && <p className="whitespace-pre-line">{a.content}</p>}
                      {a.highlights && a.highlights.length > 0 && (
                        <ul className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                          {a.highlights.map((h) => (
                            <li key={h} className="border border-[#0E0E0F]/40 px-2 py-0.5">
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Pengumuman;
