import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { Reveal } from '../components/modern/Reveal';
import { EmptyState, Em, LoadingMark, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

type Letter = {
  id: string;
  from_name?: string;
  social_handle?: string;
  message: string;
  created_at?: string;
};

const MAX = 600;
const field = 'w-full border border-[#0E0E0F] bg-transparent px-3 py-2.5 text-[15px] outline-none transition-shadow focus:shadow-[3px_3px_0_#0E0E0F]';

const tanggal = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// /kotak-surat: pesan dan saran terbuka dari anggota. Formulir di kiri, surat terbaru di kanan.
export const KotakSurat: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [letters, setLetters] = useState<Letter[]>([]);
  const [form, setForm] = useState({ name: profile?.username || '', social: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: err } = await supabase.from('letters').select('*').order('created_at', { ascending: false }).limit(50);
        if (err) setError('Gagal memuat surat: ' + err.message);
        else if (data) setLetters(data);
      } catch {
        setError('Terjadi kesalahan sistem saat memuat surat.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('letters')
        .insert([{ message: form.message.trim(), from_name: form.name.trim() || 'Anonim', social_handle: form.social.trim(), x: 0, y: 0, rotation: 0, variant: 0 }])
        .select()
        .single();
      if (err) setError('Gagal mengirim: ' + err.message);
      else if (data) {
        setLetters((prev) => [data as Letter, ...prev]);
        setForm((f) => ({ ...f, social: '', message: '' }));
        setSent(true);
      }
    } catch {
      setError('Terjadi kesalahan saat mengirim.');
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: err } = await supabase.from('letters').delete().eq('id', id);
      if (err) setError('Gagal menghapus: ' + err.message);
      else setLetters((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError('Terjadi kesalahan saat menghapus.');
    }
  };

  return (
    <>
      <PageHeader
        label="(Kotak surat) Pesan dan saran terbuka"
        title={<>Tulis sesuatu, <Em>kami baca.</Em></>}
        lede="Kritik, saran, ide program, atau sekadar sapaan. Nama boleh dikosongkan, dan semua surat yang masuk tampil di bawah."
      />

      <div className={`${PAGE_X} grid gap-12 pb-[clamp(48px,8vw,120px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16`}>
        <form onSubmit={send} className="self-start">
          <SectionRule label="(Surat baru)" />
          <div className="mt-5 grid gap-5">
            <label className="grid gap-1.5">
              <span className="font-mono text-[11px]">Nama (opsional)</span>
              <input className={field} value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Anonim" autoComplete="nickname" />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[11px]">Akun sosial (opsional)</span>
              <input className={field} value={form.social} maxLength={60} onChange={(e) => setForm({ ...form, social: e.target.value })} placeholder="@namamu" autoComplete="off" />
            </label>
            <label className="grid gap-1.5">
              <span className="flex justify-between font-mono text-[11px]">
                <span>Pesan</span>
                <span className="text-[#55555A]">
                  {form.message.length}/{MAX}
                </span>
              </span>
              <textarea className={`${field} min-h-40 resize-y`} value={form.message} maxLength={MAX} required onChange={(e) => { setForm({ ...form, message: e.target.value }); setSent(false); }} placeholder="Tulis pesanmu di sini" />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={sending || !form.message.trim()} className="border border-[#0E0E0F] bg-[#0E0E0F] px-6 py-3 font-display text-[15px] font-semibold text-[#EDEDEB] transition-colors hover:bg-transparent hover:text-[#0E0E0F] disabled:opacity-40">
                {sending ? 'Mengirim…' : 'Kirim surat'}
              </button>
              {sent && (
                <span className="font-mono text-[11px]" role="status">
                  Terkirim. Terima kasih!
                </span>
              )}
            </div>
            {error && (
              <p className="font-mono text-[11px] text-[#9B1218]" role="alert">
                {error}
              </p>
            )}
          </div>
        </form>

        <section aria-label="Surat terbaru">
          <SectionRule label="(Surat terbaru)" aside={loading ? '…' : `${letters.length} surat`} />
          {loading ? (
            <LoadingMark label="Memuat surat" />
          ) : letters.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="Belum ada surat" hint="Jadilah yang pertama menulis." />
            </div>
          ) : (
            <ul>
              {letters.map((l, i) => (
                <Reveal as="li" key={l.id} delay={Math.min(i, 6) * 40} className="border-b border-[#0E0E0F]/15 py-5">
                  <p className="whitespace-pre-wrap break-words text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed">{l.message}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#55555A]">
                    <span className="text-[#0E0E0F]">{l.from_name || 'Anonim'}</span>
                    {l.social_handle && <span>{l.social_handle}</span>}
                    <span>{tanggal(l.created_at)}</span>
                    {isAdmin && (
                      <button type="button" onClick={() => remove(l.id)} className="ml-auto border-b border-[#9B1218] text-[#9B1218]">
                        Hapus
                      </button>
                    )}
                  </div>
                </Reveal>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};
