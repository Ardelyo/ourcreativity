# 🤝 Panduan Kolaborasi Tim - OurCreativities

> Panduan lengkap untuk berkolaborasi dengan tim dan menjaga keamanan kredensial Supabase.

## 📋 Daftar Isi

- [Mengundang Kontributor](#-mengundang-kontributor)
- [Alur Kerja Pull Request](#-alur-kerja-pull-request)
- [Keamanan Environment Variables](#-keamanan-environment-variables)
- [Setup Vercel dengan Supabase](#-setup-vercel-dengan-supabase)
- [Panduan untuk Admin](#-panduan-untuk-admin)

---

## 👥 Mengundang Kontributor

### Langkah 1: Tambahkan Collaborator di GitHub

1. Buka repository GitHub kamu
2. Pergi ke **Settings** → **Collaborators** → **Add people**
3. Masukkan username atau email teman/tim
4. Pilih permission level:
   - **Read**: Hanya bisa melihat kode
   - **Triage**: Bisa manage issues dan PR
   - **Write**: Bisa push langsung ke repo (**TIDAK DISARANKAN untuk main**)
   - **Maintain**: Bisa manage repo tanpa akses sensitif
   - **Admin**: Akses penuh

### Langkah 2: Setup Branch Protection (SANGAT PENTING!)

1. Pergi ke **Settings** → **Branches**
2. Klik **Add rule**
3. Branch name pattern: `main` atau `master`
4. Centang:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (set minimal 1)
   - ✅ **Dismiss stale pull request approvals when new commits are pushed**
   - ✅ (Opsional) **Require review from Code Owners**

Ini memastikan semua perubahan HARUS melalui Pull Request!

---

## 🔄 Alur Kerja Pull Request

### Untuk Kontributor (Bukan Admin)

```bash
# 1. Fork repository (jika bukan collaborator langsung)
# Klik "Fork" di GitHub

# 2. Clone fork kamu
git clone https://github.com/USERNAME_KAMU/ourcreativities.git
cd ourcreativities

# 3. Tambahkan upstream (repo original)
git remote add upstream https://github.com/ADMIN_USERNAME/ourcreativities.git

# 4. Buat branch baru untuk fitur/fix
git checkout -b feature/nama-fitur

# 5. Lakukan perubahan...
# Edit file, tambah fitur, dll

# 6. Commit perubahan
git add .
git commit -m "feat: tambah fitur baru"

# 7. Push ke fork kamu
git push origin feature/nama-fitur

# 8. Buat Pull Request di GitHub
# - Pergi ke repo original
# - Klik "New Pull Request"
# - Pilih branch kamu
# - Isi deskripsi
# - Submit!
```

### Sync Fork dengan Upstream

```bash
# Jika repo original sudah ada update baru:
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Untuk Admin (Me-review Pull Request)

1. Buka tab **Pull Requests** di GitHub
2. Klik PR yang ingin di-review
3. Klik **Files changed** untuk melihat perubahan
4. Tambahkan komentar jika perlu
5. Klik **Review changes**:
   - **Comment**: Hanya komentar biasa
   - **Approve**: Setuju untuk merge
   - **Request changes**: Minta perubahan dulu
6. Jika approved, klik **Merge pull request**

---

## 🔒 Keamanan Environment Variables

### ⚠️ SANGAT PENTING: `.env` TIDAK AKAN Di-push!

Lihat `.gitignore` kamu sudah benar:

```gitignore
# Environment variables - JANGAN PERNAH COMMIT!
.env
.env.production
.env.staging
```

> ✅ File `.env` **TIDAK** akan ter-push ke GitHub selama ada di `.gitignore`

### Apa yang Di-commit vs Tidak

| File           | Di-commit? | Penjelasan                   |
| -------------- | ---------- | ---------------------------- |
| `.env`         | ❌ TIDAK   | Berisi kredensial rahasia    |
| `.env.example` | ✅ YA      | Template tanpa nilai rahasia |
| `.env.local`   | ❌ TIDAK   | Untuk development lokal      |

### Setup untuk Kontributor Baru

Setiap kontributor baru harus:

1. Copy `.env.example` ke `.env`
2. Isi dengan kredensial **masing-masing** (atau minta ke admin)

```bash
cp .env.example .env
# Edit .env dengan kredensial yang diberikan admin
```

---

## 🚀 Setup Vercel dengan Supabase (Admin Only)

### Langkah 1: Tambahkan Environment Variables di Vercel

1. Login ke [vercel.com](https://vercel.com)
2. Buka project **ourcreativities**
3. Pergi ke **Settings** → **Environment Variables**
4. Tambahkan variabel berikut:

| Key                      | Value                                      | Environment                      |
| ------------------------ | ------------------------------------------ | -------------------------------- |
| `VITE_SUPABASE_URL`      | `https://didjpfzpxwvamtlzgcbt.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `[KUNCI ANON BARU]`                        | Production, Preview, Development |

5. Klik **Save**

### Langkah 2: Redeploy Setelah Update Key

```bash
# Dari Vercel Dashboard:
# Deployments → Klik "..." → Redeploy

# Atau via CLI:
vercel --prod
```

### Langkah 3: Verifikasi Koneksi

Setelah deploy, buka website dan cek:

- Console browser (F12) tidak ada error Supabase
- Data dari database tampil dengan benar

---

## 👑 Panduan untuk Admin

### Mengelola API Keys Supabase

| Key Type             | Akses       | Penggunaan                 |
| -------------------- | ----------- | -------------------------- |
| `anon` (publishable) | Read only\* | Frontend, bisa di-expose   |
| `service_role`       | Full access | **RAHASIA** - Backend only |

> \*`anon` key aman di-expose KARENA sudah ada Row Level Security (RLS)

### Rotasi API Key

Jika key bocor atau sebagai keamanan rutin:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Project → **Settings** → **API**
3. Klik **Regenerate** pada key yang ingin dirotasi
4. Update di:
   - ✅ Vercel Environment Variables
   - ✅ `.env` lokal kamu
   - ❌ JANGAN commit ke Git!

### Berbagi Kredensial dengan Tim (Aman)

**JANGAN:**

- ❌ Kirim lewat WhatsApp/Telegram
- ❌ Tulis di file yang di-commit
- ❌ Share di Discord/grup publik

**LAKUKAN:**

- ✅ Gunakan password manager (1Password, Bitwarden)
- ✅ Kirim lewat DM terenkripsi
- ✅ Buat Supabase project terpisah untuk development
- ✅ Gunakan environment variables berbeda per environment

### Setup Development Environment Terpisah

Untuk keamanan maksimal, buat 2 Supabase project:

1. **Production**: Data real, koneksi ke Vercel production
2. **Development**: Data testing, untuk pengembangan lokal

Kontributor development cukup dapat akses ke project Development.

---

## 📊 Diagram Alur Kerja

```
┌──────────────────────────────────────────────────────────────┐
│                     KONTRIBUTOR                               │
├──────────────────────────────────────────────────────────────┤
│  1. Fork Repo                                                 │
│  2. Clone ke lokal                                           │
│  3. Buat branch: feature/xxx                                 │
│  4. Koding...                                                │
│  5. Commit dengan pesan konvensional                         │
│  6. Push ke fork                                             │
│  7. Buat Pull Request                                        │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                        ADMIN                                  │
├──────────────────────────────────────────────────────────────┤
│  8. Review Pull Request                                       │
│  9. Request changes (jika perlu)                             │
│  10. Approve & Merge                                         │
│  11. Auto-deploy ke Vercel ✨                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔑 Checklist Keamanan

### Sebelum Mengundang Kontributor

- [ ] Branch protection sudah aktif di `main`
- [ ] `.gitignore` sudah include semua file `.env*`
- [ ] `.env.example` sudah dibuat tanpa nilai rahasia
- [ ] Environment variables sudah di-set di Vercel
- [ ] RLS sudah aktif di Supabase

### Setelah Rotasi API Key

- [ ] Update di Vercel
- [ ] Update `.env` lokal
- [ ] Redeploy website
- [ ] Test koneksi database
- [ ] Beritahu tim development (berikan key baru via channel aman)

---

## ❓ FAQ

### Q: Apakah anon key aman di-expose di frontend?

**A:** Ya, ASALKAN RLS (Row Level Security) sudah diaktifkan. Anon key hanya bisa melakukan apa yang policy izinkan.

### Q: Bagaimana jika ada commit berisi `.env`?

**A:**

1. Segera rotasi ALL keys yang terexpose
2. Remove file dari Git history menggunakan BFG atau git filter-branch
3. Force push perubahan
4. Update semua environment

### Q: Teman saya mau develop, apakah harus share key production?

**A:** TIDAK. Buat Supabase project terpisah untuk development, atau minta mereka buat project sendiri.

---

## 📚 Referensi

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merging-pull-requests/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Terakhir Diperbarui:** Desember 2025  
**Versi:** 1.0  
**Pemelihara:** Tim OurCreativities
