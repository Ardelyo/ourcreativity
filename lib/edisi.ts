// Tujuh edisi OurCreativity di Instagram. Data publik dari bio dan profil tiap akun.
// Jumlah pengikut adalah potret pada tanggal ASOF, bukan data langsung.

export const EDISI_ASOF = '28 Nov 2026';

export interface Edisi {
  key: string;
  nama: string;
  handle: string;
  pengikut: string;
  /** Kunci divisi di tabel `works`, bila ada padanannya di platform. */
  divisi?: 'graphics' | 'video' | 'writing' | 'coding' | 'meme';
  /** Berkas ikon di /brand/icons (diambil dari header Instagram). Ilustrasi belum punya. */
  ikon?: string;
  warna: string;
}

export const EDISI: Edisi[] = [
  { key: 'video', nama: 'Video Editing', handle: 'ocevideoediting', pengikut: '3,716', divisi: 'video', ikon: 'video', warna: '#9B1218' },
  { key: 'foto', nama: 'Fotografi', handle: 'oc.fotografi', pengikut: '1,253', ikon: 'foto', warna: '#16802C' },
  { key: 'grafis', nama: 'Desain Grafis', handle: 'ocdesaingrafis', pengikut: '5,429', divisi: 'graphics', ikon: 'desain', warna: '#6D2AF2' },
  { key: 'ilus', nama: 'Ilustrasi', handle: 'ocillustrasi', pengikut: '203', divisi: 'graphics', warna: '#14B8E8' },
  { key: 'tulis', nama: 'Karya Tulis', handle: 'ourcreativity.ofc', pengikut: '—', divisi: 'writing', ikon: 'tulis', warna: '#161616' },
  { key: 'meme', nama: 'Meme', handle: 'ocedisimeme.id', pengikut: '166K', divisi: 'meme', ikon: 'meme', warna: '#E0252B' },
  { key: 'kode', nama: 'Koding', handle: 'oc.koding', pengikut: '931', divisi: 'coding', ikon: 'kode', warna: '#148562' },
];

export const PROGRAM = [
  { nama: 'Weekly Design', edisi: 'Desain Grafis', ket: 'Satu karya terbaik dipajang sebagai Visual Spotlight.' },
  { nama: 'Tagwall', edisi: 'Desain Grafis', ket: 'Tempel namamu di dinding komunitas.' },
  { nama: 'MEP', edisi: 'Video Editing', ket: 'Multi Editor Project: banyak editor, satu karya.' },
  { nama: 'Hall of Fame', edisi: 'Video Editing', ket: 'Karya terbaik tersimpan permanen, tidak tenggelam di feed.' },
  { nama: 'Our Gallery', edisi: 'Fotografi', ket: 'Foto anggota dikurasi di satu rak, lengkap dengan Our Rules.' },
  { nama: 'CodeQuest', edisi: 'Koding', ket: 'Belajar coding sambil main peran.' },
  { nama: 'Promote & Collab', edisi: 'Meme', ket: 'Slot endorse dan kolaborasi dengan aturan tertulis.' },
  { nama: 'Activity & Growth', edisi: 'Akun utama', ket: 'Rangkuman kegiatan dan pencapaian komunitas.' },
];

export const DISCORD_URL = 'https://discord.gg/YrUSt4kjBm';
export const IG_UTAMA = 'ourcreativity.ofc';
