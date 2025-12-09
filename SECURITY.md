# Kebijakan Keamanan

## Versi yang Didukung

| Versi | Didukung          |
| ----- | ----------------- |
| 5.x   | ✅ Ya             |
| 4.x   | ❌ Tidak          |
| < 4.0 | ❌ Tidak          |

## Melaporkan Kerentanan

Jika Anda menemukan kerentanan keamanan di OurCreativities, silakan laporkan melalui:

1. **Email**: Hubungi maintainer langsung (informasi di profil GitHub)
2. **GitHub Security Advisories**: Gunakan fitur "Report a vulnerability" di tab Security

### Yang Harus Dilaporkan

- Eksposur data sensitif
- Cross-site scripting (XSS)
- Kebocoran kredensial
- Kerentanan dependency
- Masalah autentikasi/otorisasi

### Proses Penanganan

1. **Konfirmasi** - Kami akan mengkonfirmasi penerimaan laporan dalam 48 jam
2. **Investigasi** - Tim akan menginvestigasi dalam 7 hari
3. **Perbaikan** - Patch akan dikembangkan dan diuji
4. **Rilis** - Update keamanan akan dirilis
5. **Pengakuan** - Kontributor akan mendapat kredit (jika diinginkan)

### Yang Tidak Termasuk

- Masalah pada instance Supabase yang bukan milik kami
- Kerentanan pada dependency pihak ketiga (laporkan ke maintainer asli)
- Serangan denial of service (DoS)

## Praktik Keamanan

### Environment Variables

```bash
# JANGAN PERNAH commit file .env
# Gunakan .env.example sebagai template
cp .env.example .env
```

### Supabase Row Level Security

Proyek ini menggunakan RLS (Row Level Security) untuk melindungi data. Pastikan:

- Semua tabel memiliki RLS enabled
- Policy didefinisikan dengan benar
- Anon key hanya memiliki akses yang diperlukan

## Kontak

Untuk pertanyaan keamanan, hubungi maintainer melalui GitHub.
