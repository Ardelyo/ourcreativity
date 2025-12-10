# 🚀 Git Workflow Cheat Sheet

> Quick reference untuk workflow Git sehari-hari di OurCreativities

## 📋 Workflow Lengkap (With Pull Request)

### 1️⃣ Mulai Fitur/Fix Baru

```bash
# Update master dulu
git checkout master
git pull origin master

# Buat branch baru
git checkout -b feature/nama-fitur
# atau: fix/nama-bug
# atau: docs/nama-doc
```

### 2️⃣ Coding

```bash
# Edit file di VS Code...

# Cek apa yang berubah
git status
git diff
```

### 3️⃣ Commit Perubahan

```bash
# Add semua perubahan
git add .

# Atau add file spesifik
git add path/to/file.tsx

# Commit dengan pesan jelas
git commit -m "feat: tambah fitur xyz"
```

### 4️⃣ Push ke GitHub

```bash
# Push branch baru
git push origin feature/nama-fitur

# Jika error, gunakan:
git push --set-upstream origin feature/nama-fitur
```

### 5️⃣ Buat Pull Request

```
1. Buka GitHub.com/Ardelyo/ourcreativity
2. Klik banner "Compare & pull request"
3. Isi title dan description
4. Klik "Create pull request"
```

### 6️⃣ Review & Merge (Admin)

```
1. Review code di tab "Files changed"
2. Klik "Review changes" → "Approve"
3. Klik "Merge pull request"
4. Klik "Confirm merge"
5. (Opsional) Delete branch
```

### 7️⃣ Update Local setelah Merge

```bash
# Balik ke master
git checkout master

# Pull perubahan terbaru
git pull origin master

# Hapus branch lokal
git branch -d feature/nama-fitur
```

---

## ⚡ Shortcuts & Aliases

### Setup Aliases (Run Once)

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.st status
```

### Workflow dengan Aliases

```bash
git co master
git pull origin master
git co -b feature/nama
# coding...
git add .
git cm -m "feat: update"
git push origin feature/nama
```

---

## 🎯 Commit Message Conventions

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Update dokumentasi
- `style`: Format kode (tidak mengubah logic)
- `refactor`: Refactoring
- `perf`: Peningkatan performa
- `test`: Tambah/update test
- `chore`: Update dependencies, build, dll

### Contoh

```bash
git commit -m "feat(navbar): tambah animasi hover"
git commit -m "fix(mobile): perbaiki responsive layout"
git commit -m "docs(readme): update instalasi"
git commit -m "chore(deps): update react to v19"
```

---

## 🔧 Troubleshooting

### Branch sudah ada

```bash
# Jika branch sudah ada, switch aja
git checkout feature/nama-fitur

# Atau hapus dulu lalu buat baru
git branch -D feature/nama-fitur
git checkout -b feature/nama-fitur
```

### Uncommitted changes saat switch branch

```bash
# Simpan sementara
git stash

# Switch branch
git checkout master

# Ambil kembali
git stash pop
```

### Pull conflict

```bash
# Jika ada conflict saat pull
git pull origin master

# Resolve conflict di VS Code
# Edit file yang conflict
# Pilih "Accept Current" atau "Accept Incoming"

# Setelah resolve
git add .
git commit -m "merge: resolve conflict"
```

### Undo commit terakhir

```bash
# Undo commit, keep changes
git reset --soft HEAD~1

# Undo commit, discard changes
git reset --hard HEAD~1
```

---

## 📊 Useful Commands

### Cek Info

```bash
# Lihat branch saat ini
git branch

# Lihat semua branch (termasuk remote)
git branch -a

# Lihat history commit
git log --oneline

# Lihat perbedaan
git diff
git diff --staged
```

### Cleanup

```bash
# Hapus branch lokal
git branch -d nama-branch

# Force hapus (jika belum di-merge)
git branch -D nama-branch

# Hapus branch remote
git push origin --delete nama-branch
```

---

## 🎨 VS Code Git GUI

### Shortcuts

- `Ctrl+Shift+G`: Buka Source Control panel
- `Ctrl+Enter`: Commit
- Click `...` → Push

### Workflow di VS Code

1. Edit file
2. `Ctrl+Shift+G`
3. Stage changes (klik +)
4. Ketik commit message
5. `Ctrl+Enter` untuk commit
6. Click `...` → Push

---

## 💡 Best Practices

### DO's ✅

- Commit sering (small commits)
- Pesan commit jelas dan deskriptif
- Pull sebelum push
- Test di local sebelum push
- Review PR sendiri sebelum approve

### DON'Ts ❌

- Commit langsung ke master
- Commit file .env
- Pesan commit tidak jelas ("update", "fix")
- Push kode yang error
- Force push ke branch orang lain

---

## 🔗 Quick Links

- Repository: https://github.com/Ardelyo/ourcreativity
- Pull Requests: https://github.com/Ardelyo/ourcreativity/pulls
- Issues: https://github.com/Ardelyo/ourcreativity/issues

---

**Terakhir Diperbarui:** Desember 2025  
**Version:** 1.0
