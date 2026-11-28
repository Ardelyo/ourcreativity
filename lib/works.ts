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
  /** Hanya ada pada data demo lokal (lihat docs/DESAIN_MODERNIS.md). */
  edisi?: string;
  username?: string | null;
  source?: string | null;
}

/** Padanan divisi platform ke edisi Instagram. Dipakai bila karya tidak membawa `edisi` sendiri. */
export const DIVISION_TO_EDISI: Record<string, string> = {
  graphics: 'grafis',
  video: 'video',
  writing: 'tulis',
  coding: 'kode',
  meme: 'meme',
};

export const edisiOf = (division: string): string => DIVISION_TO_EDISI[division] ?? 'grafis';

export interface PublicWork {
  id: string;
  title: string;
  author: string;
  username: string | null;
  division: string;
  /** Kunci edisi (grafis, ilus, meme, kode, video, foto, tulis). */
  edisi: string;
  type: string;
  /** Tautan ke sumber asli (post Instagram), bila ada. */
  source: string | null;
  /** Gambar yang aman dipasang di <img>, atau null bila karya tidak punya pratinjau gambar. */
  image: string | null;
  /** Gambar resolusi penuh untuk lightbox (image_url), atau null bila bukan gambar. */
  full: string | null;
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

export const toPublicWork = (row: WorkRow, username: string | null): PublicWork => {
  const division = row.division || 'graphics';
  const handle = username ?? row.username ?? null;
  return {
  id: row.id,
  title: row.title?.trim() || 'Tanpa judul',
  author: row.author?.trim() || handle || 'Anonim',
  username: handle,
  division,
  edisi: row.edisi || edisiOf(division),
  source: row.source ?? null,
  type: row.type || 'image',
  image: pickImage(row),
  full: row.image_url && !isVideoUrl(row.image_url) ? row.image_url.trim() : null,
  video: isVideoUrl(row.image_url) ? row.image_url : null,
  createdAt: row.created_at,
  };
};

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
