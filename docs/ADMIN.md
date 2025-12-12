# 👑 Panduan Admin - OurCreativity

Panduan lengkap untuk admin dalam mengelola konten dan database.

## 📋 Daftar Isi

- [Akses Dashboard](#-akses-dashboard)
- [Mengelola Konten](#-mengelola-konten)
- [Supabase API](#-supabase-api)
- [Keamanan](#-keamanan)

---

## 🔐 Akses Dashboard

### Supabase Dashboard

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard)
2. Login dengan akun yang memiliki akses project
3. Pilih project **ourcreativity**

### Quick Links

| Dashboard | Link |
|-----------|------|
| 📊 Table Editor | [Buka](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/editor) |
| 📝 SQL Editor | [Buka](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/sql) |
| ⚙️ API Settings | [Buka](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/settings/api) |
| 📈 Logs | [Buka](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/logs) |

---

## 📝 Mengelola Konten

### Menambah Karya Baru

**Via Table Editor (Recommended):**

1. Buka [Table Editor](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/editor)
2. Pilih tabel `works`
3. Klik **+ Insert Row**
4. Isi field yang diperlukan:

| Field | Required | Contoh |
|-------|----------|--------|
| `title` | ✅ Ya | "Poster Event 2025" |
| `description` | Tidak | "Desain poster..." |
| `author` | Tidak | "Ardelyo" |
| `division` | Tidak | graphics / video / writing / coding / meme |
| `type` | Tidak | image / video / text / code / slide |
| `image_url` | Tidak | "https://..." |

**Via SQL:**

```sql
INSERT INTO works (title, description, author, division, type, image_url)
VALUES (
  'Judul Karya',
  'Deskripsi singkat',
  'Nama Author',
  'graphics',
  'image',
  'https://link-gambar.com/image.jpg'
);
```

### Menambah Pengumuman

```sql
INSERT INTO announcements (title, content, type, category)
VALUES (
  'Judul Pengumuman',
  'Konten lengkap pengumuman...',
  'announcement',  -- atau 'changelog'
  'Event'
);
```

### Menambah Changelog

```sql
INSERT INTO announcements (
  title, 
  content, 
  type, 
  version,
  major_version,
  minor_version,
  patch_version
)
VALUES (
  'Update v5.1.0',
  'Deskripsi update...',
  'changelog',
  '5.1.0',
  5,
  1,
  0
);
```

### Mengedit Data

**Via Table Editor:**
1. Klik row yang ingin diedit
2. Ubah nilai di panel samping
3. Klik **Save**

**Via SQL:**

```sql
UPDATE works 
SET title = 'Judul Baru', description = 'Deskripsi baru'
WHERE id = 'uuid-karya';
```

### Menghapus Data

```sql
DELETE FROM works WHERE id = 'uuid-karya';
```

---

## 🔌 Supabase API

### Menggunakan API dari Aplikasi Lain

**Base URL:**
```
https://didjpfzpxwvamtlzgcbt.supabase.co
```

### Contoh Request (JavaScript)

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://didjpfzpxwvamtlzgcbt.supabase.co',
  'YOUR_ANON_KEY'
)

// GET semua karya
const { data, error } = await supabase
  .from('works')
  .select('*')
  .order('created_at', { ascending: false })

// GET karya by division
const graphics = await supabase
  .from('works')
  .select('*')
  .eq('division', 'graphics')

// INSERT karya baru
const { data, error } = await supabase
  .from('works')
  .insert([
    { title: 'Karya Baru', author: 'Admin' }
  ])
```

### Contoh Request (cURL)

```bash
# GET semua karya
curl 'https://didjpfzpxwvamtlzgcbt.supabase.co/rest/v1/works' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# POST karya baru
curl 'https://didjpfzpxwvamtlzgcbt.supabase.co/rest/v1/works' \
  -X POST \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Karya Baru", "author": "Admin"}'
```

---

## 🔒 Keamanan

### RLS (Row Level Security)

Semua tabel sudah dilindungi RLS dengan policy:
- **Public Read**: Semua orang bisa baca
- **No Public Write**: Hanya via dashboard/service key yang bisa tulis

### Menambah Write Access untuk Admin

Jika ingin admin bisa write via API:

```sql
-- Buat policy untuk authenticated users
CREATE POLICY "Admins can insert"
ON works FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update"
ON works FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete"
ON works FOR DELETE
USING (auth.role() = 'authenticated');
```

### API Keys

| Key Type | Akses | Gunakan Untuk |
|----------|-------|---------------|
| `anon` (public) | Read only | Frontend public |
| `service_role` | Full access | Backend/Admin only |

> ⚠️ **JANGAN** gunakan `service_role` key di frontend!

---

## 🚀 Tips & Tricks

### Bulk Insert via CSV

1. Siapkan file CSV dengan header yang match kolom tabel
2. Di Table Editor, klik **Import data from CSV**
3. Upload file

### Backup Data

```sql
-- Export ke JSON
SELECT json_agg(works) FROM works;
```

### Monitor Usage

- Cek [Dashboard → Reports](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/reports)
- Lihat request count dan database size

---

## ❓ Troubleshooting

### Data tidak muncul di website

1. Cek apakah data sudah ada di Table Editor
2. Pastikan field `type` dan `division` sesuai format
3. Cek browser console untuk error

### API request gagal

1. Pastikan API key benar
2. Cek RLS policy
3. Lihat logs di [Dashboard → Logs](https://supabase.com/dashboard/project/didjpfzpxwvamtlzgcbt/logs)
