## 🎯 Deskripsi

Beberapa aspek keamanan perlu diperkuat untuk mencegah potensi kerentanan.

## 📍 Temuan Keamanan

### 1. RLS Policies Belum Lengkap

File `supabase_schema.sql` hanya memiliki policy **read-only** untuk semua tabel:

```sql
CREATE POLICY "Public read access for works" ON works FOR SELECT USING (true);
```

**Masalah:**

- Tidak ada policy untuk INSERT/UPDATE/DELETE
- Jika RLS diaktifkan tapi policy tidak ada, operasi write akan gagal
- Jika ditambahkan fitur "user submit karya", perlu policy yang tepat

### 2. Iframe Sandbox Untuk Code Preview

File `components/CodePreview.tsx` dan `sandbox/IframeSandbox.tsx` menjalankan user code di iframe. Perlu dipastikan:

- sandbox attributes sudah benar
- CSP (Content Security Policy) dikonfigurasi
- Tidak ada risiko XSS dari embedded code

### 3. Environment Variables di Vite Config

```typescript
// vite.config.ts line 14-15
'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
```

**Potensi Masalah:**

- API key bisa terekspos di client bundle
- Perlu dipastikan ini hanya untuk development

## ✅ Solusi yang Diharapkan

### 1. Lengkapi RLS Policies

```sql
-- Contoh policy untuk authenticated insert
CREATE POLICY "Authenticated users can insert works"
ON works FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy untuk owner update
CREATE POLICY "Users can update own works"
ON works FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

### 2. Review Iframe Sandboxing

Pastikan iframe memiliki:

```html
<iframe sandbox="allow-scripts" csp="default-src 'self'"></iframe>
```

### 3. Audit Environment Variable Exposure

- Review apa saja yang di-expose ke client
- Pindahkan sensitive keys ke server-side/edge function

## 📋 Kriteria Selesai

- [ ] RLS policies lengkap untuk semua operasi
- [ ] Iframe sandbox sudah aman
- [ ] Tidak ada API key sensitif di client bundle
- [ ] Security advisor Supabase hijau
