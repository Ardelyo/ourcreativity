// Impor katalog karya (hasil kurasi Instagram) ke Supabase: unggah gambar ke bucket "works", lalu isi tabel works.
//
// Pakai (PowerShell), dari akar repo:
//   $env:SUPABASE_URL="https://<ref>.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY="<kunci service_role>"   # JANGAN ditempel ke chat atau di-commit
//   node tools/import_works.mjs            # simulasi, tidak menulis apa pun
//   node tools/import_works.mjs --apply    # unggah dan isi tabel
//
// Aman diulang: gambar ditimpa di path yang sama, dan baris yang tautan sumbernya sudah ada dilewati.
// Setiap baris diberi tag 'katalog-ig'. Untuk menarik kembali:
//   delete from public.works where 'katalog-ig' = any(tags);
import { readFile } from 'node:fs/promises';

const APPLY = process.argv.includes('--apply');
const URL_ = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = 'works';
const TAG = 'katalog-ig';

if (!URL_ || !KEY) {
  console.error('Set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY dulu (lihat komentar di atas berkas ini).');
  process.exit(1);
}
// Kunci baru (sb_secret_...) bukan JWT: cukup di header apikey. Kunci lama (service_role JWT) juga dikirim sebagai Bearer.
const H = KEY.startsWith('sb_') ? { apikey: KEY } : { apikey: KEY, Authorization: `Bearer ${KEY}` };

const demo = JSON.parse(await readFile('public/demo/works.json', 'utf8'));
console.log(`${demo.length} karya di manifest. Mode: ${APPLY ? 'TERAPKAN' : 'simulasi'}`);

const pub = (p) => `${URL_}/storage/v1/object/public/${BUCKET}/${p}`;
async function upload(path, localFile) {
  const body = await readFile(localFile);
  const r = await fetch(`${URL_}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'image/jpeg', 'x-upsert': 'true', 'Cache-Control': 'max-age=31536000' },
    body,
  });
  if (!r.ok) throw new Error(`unggah ${path}: ${r.status} ${await r.text()}`);
}

// Lewati yang sudah ada.
const links = demo.map((w) => w.source).filter(Boolean);
const have = new Set();
for (let i = 0; i < links.length; i += 40) {
  const q = links.slice(i, i + 40).map((l) => `"${l}"`).join(',');
  const r = await fetch(`${URL_}/rest/v1/works?select=link&link=in.(${encodeURIComponent(q)})`, { headers: H });
  if (!r.ok) throw new Error(`cek duplikat: ${r.status} ${await r.text()}`);
  (await r.json()).forEach((x) => have.add(x.link));
}
const todo = demo.filter((w) => !have.has(w.source));
console.log(`${have.size} sudah ada, ${todo.length} akan diimpor.`);
if (!APPLY) {
  console.log('Contoh baris:', JSON.stringify({ title: todo[0]?.title, author: todo[0]?.author, division: todo[0]?.division, image: pub(`katalog/${todo[0]?.id}.jpg`) }));
  console.log('Simulasi selesai. Jalankan lagi dengan --apply.');
  process.exit(0);
}

const rows = [];
let n = 0;
for (const w of todo) {
  const file = w.image_url.split('/').pop();
  await upload(`katalog/${w.id}.jpg`, `public/demo/m/${file}`);
  await upload(`katalog/t/${w.id}.jpg`, `public/demo/t/${file}`);
  rows.push({
    title: w.title,
    author: w.username || w.author,
    division: w.division,
    type: 'image',
    image_url: pub(`katalog/${w.id}.jpg`),
    thumbnail_url: pub(`katalog/t/${w.id}.jpg`),
    link: w.source,
    tags: [TAG],
    created_at: w.created_at,
  });
  if (++n % 20 === 0) console.log(`  diunggah ${n}/${todo.length}`);
}
for (let i = 0; i < rows.length; i += 50) {
  const r = await fetch(`${URL_}/rest/v1/works`, {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(rows.slice(i, i + 50)),
  });
  if (!r.ok) throw new Error(`isi tabel: ${r.status} ${await r.text()}`);
}
console.log(`Selesai: ${rows.length} karya diimpor.`);
