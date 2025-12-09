# Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi ke **OurCreativities**! 🎨

## 📋 Daftar Isi

- [Memulai](#-memulai)
- [Proses Kontribusi](#-proses-kontribusi)
- [Standar Kode](#-standar-kode)
- [Commit Messages](#-commit-messages)
- [Pull Request](#-pull-request)

---

## 🚀 Memulai

### Prerequisites

- Node.js v18+
- npm atau yarn
- Git

### Setup Lokal

```bash
# 1. Fork repositori ini di GitHub

# 2. Clone fork kamu
git clone https://github.com/USERNAME_KAMU/ourcreativities.git
cd ourcreativities

# 3. Install dependencies
npm install

# 4. Copy environment file
cp .env.example .env
# Edit .env dengan kredensial Supabase kamu

# 5. Jalankan development server
npm run dev
```

### Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan SQL dari `supabase_schema.sql` di SQL Editor
3. Copy URL dan Anon Key ke file `.env`

---

## 🔄 Proses Kontribusi

### 1. Cari atau Buat Issue

- Cek [Issues](https://github.com/ardelyo/ourcreativities/issues) yang ada
- Untuk fitur baru, buat issue dulu untuk diskusi
- Untuk bug, pastikan belum dilaporkan sebelumnya

### 2. Buat Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Buat branch baru
git checkout -b tipe/deskripsi-singkat

# Contoh:
git checkout -b fitur/dark-mode
git checkout -b perbaikan/navbar-mobile
git checkout -b docs/update-readme
```

### 3. Kerjakan Perubahan

- Ikuti standar kode yang ada
- Tulis kode yang bersih dan terdokumentasi
- Test perubahan kamu secara lokal

### 4. Commit dan Push

```bash
git add .
git commit -m "tipe: deskripsi perubahan"
git push origin nama-branch
```

### 5. Buat Pull Request

- Buka GitHub dan buat Pull Request
- Isi template PR dengan lengkap
- Tunggu review dari maintainer

---

## 📝 Standar Kode

### TypeScript

```typescript
// ✅ Baik: Gunakan type yang jelas
interface UserProps {
  name: string;
  email: string;
  isActive?: boolean;
}

// ❌ Hindari: any type
const user: any = { ... };
```

### React Components

```tsx
// ✅ Baik: Functional component dengan TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### CSS/Tailwind

```tsx
// ✅ Baik: Gunakan kelas yang terorganisir
<div className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg">

// ❌ Hindari: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

---

## 💬 Commit Messages

Gunakan format konvensional:

```
tipe: deskripsi singkat

[body opsional]

[footer opsional]
```

### Tipe Commit

| Tipe | Deskripsi |
|------|-----------|
| `fitur` | Fitur baru |
| `perbaikan` | Bug fix |
| `docs` | Dokumentasi |
| `style` | Formatting, tanpa perubahan kode |
| `refactor` | Refactoring kode |
| `test` | Menambah atau memperbaiki test |
| `chore` | Maintenance, dependencies |

### Contoh

```
fitur: tambah dark mode toggle

- Implementasi toggle di navbar
- Simpan preferensi di localStorage
- Animasi transisi smooth

Closes #123
```

---

## 🔍 Pull Request

### Checklist PR

- [ ] Kode mengikuti standar proyek
- [ ] Sudah di-test secara lokal
- [ ] Dokumentasi diperbarui (jika perlu)
- [ ] Tidak ada console.log yang tertinggal
- [ ] Branch sudah up-to-date dengan main

### Review Process

1. **Automated Checks** - Pastikan semua checks pass
2. **Code Review** - Maintainer akan review kode
3. **Feedback** - Lakukan perubahan jika diminta
4. **Merge** - PR akan di-merge setelah approved

---

## ❓ Bantuan

Ada pertanyaan? Buat issue dengan label `question` atau hubungi maintainer.

---

**Terima kasih sudah berkontribusi!** 🙏
