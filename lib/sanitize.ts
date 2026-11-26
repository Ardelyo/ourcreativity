// Sanitasi HTML buatan user sebelum dirender lewat dangerouslySetInnerHTML.
// Konfigurasi ini juga dipakai tools/xss_smoke.py; ubah keduanya bersamaan.
import DOMPurify from 'dompurify';

// Konten karya hanya teks kaya (paragraf, judul, tautan, gambar). Elemen form
// tidak dibutuhkan dan bisa dipakai untuk phishing di dalam halaman.
export const SANITIZE_CONFIG = {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['form', 'input', 'textarea', 'select', 'button', 'option'],
} as const;

export const sanitizeHtml = (html: string | null | undefined): string =>
    DOMPurify.sanitize(html ?? '', SANITIZE_CONFIG as unknown as Parameters<typeof DOMPurify.sanitize>[1]) as string;
