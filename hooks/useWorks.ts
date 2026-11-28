import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toPublicWork, type PublicWork, type WorkRow } from '../lib/works';

const COLUMNS = 'id, title, author, author_id, division, type, image_url, thumbnail_url, created_at';

/**
 * Karya terbaru untuk tampilan publik (landing dan galeri Karya).
 * Hanya membaca kolom yang dibutuhkan, tanpa hitungan like/komentar, supaya ringan.
 */
export function useWorks(limit = 120) {
  return useQuery<PublicWork[]>({
    queryKey: ['public-works', limit],
    queryFn: async () => {
      // Mode demo (pengembangan): baca manifest lokal supaya UI bisa dilihat tanpa Supabase.
      if (import.meta.env.VITE_DEMO_WORKS === '1') {
        const res = await fetch('/demo/works.json');
        if (!res.ok) throw new Error('Data demo tidak ditemukan di /demo/works.json');
        const demo = (await res.json()) as WorkRow[];
        return demo.slice(0, limit).map((r) => toPublicWork(r, null));
      }
      const { data, error } = await supabase
        .from('works')
        .select(COLUMNS)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;

      const rows = (data ?? []) as WorkRow[];
      const authorIds = [...new Set(rows.map((r) => r.author_id).filter((id): id is string => !!id))];
      const usernames = new Map<string, string>();
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', authorIds);
        (profiles ?? []).forEach((p: { id: string; username: string | null }) => {
          if (p.username) usernames.set(p.id, p.username);
        });
      }
      return rows.map((r) => toPublicWork(r, r.author_id ? usernames.get(r.author_id) ?? null : null));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
