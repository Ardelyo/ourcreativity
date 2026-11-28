// Model karya untuk tampilan publik (landing + galeri Karya). Murni, tanpa efek samping, supaya mudah diuji.

export interface WorkRow {
  id: string;
  title: string | null;
  author: string | null;
  author_id: string | null;
  division: string | null;
  type: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface PublicWork {
  id: string;
  title: string;
  author: string;
  username: string | null;
  division: string;
  type: string;
  /** Gambar yang aman dipasang di <img>, atau null bila karya tidak punya pratinjau gambar. */
  image: string | null;
  /** URL video bila karya bertipe video dan berkas aslinya bisa diputar. */
  video: string | null;
  createdAt: string;
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i;

export const isVideoUrl = (url: string | null | undefined): boolean => !!url && VIDEO_EXT.test(url);

/** Pilih gambar pratinjau: thumbnail dulu, lalu image_url selama bukan berkas video. */
export const pickImage = (row: Pick<WorkRow, 'thumbnail_url' | 'image_url'>): string | null => {
  const thumb = row.thumbnail_url?.trim();
  if (thumb && !isVideoUrl(thumb)) return thumb;
  const img = row.image_url?.trim();
  if (img && !isVideoUrl(img)) return img;
  return null;
};

export const toPublicWork = (row: WorkRow, username: string | null): PublicWork => ({
  id: row.id,
  title: row.title?.trim() || 'Tanpa judul',
  author: row.author?.trim() || username || 'Anonim',
  username,
  division: row.division || 'graphics',
  type: row.type || 'image',
  image: pickImage(row),
  video: isVideoUrl(row.image_url) ? row.image_url : null,
  createdAt: row.created_at,
});

/** Hash string kecil yang stabil, dipakai untuk variasi ukuran tanpa perlu mengukur gambar. */
export const hashString = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const RATIOS = [0.8, 1, 1.25, 0.75, 1.5, 0.9];

/** Rasio lebar/tinggi tiap karya di kanvas. Stabil per id, jadi tata letak tidak berubah antar kunjungan. */
export const ratioFor = (id: string): number => RATIOS[hashString(id) % RATIOS.length];

export const formatNo = (n: number): string => String(n).padStart(3, '0');
