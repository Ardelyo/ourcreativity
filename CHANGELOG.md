# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Belum dirilis]

### Desain modernis untuk Home dan Karya

- **Home** ditulis ulang: grid 12 kolom, judul grotesk besar, hero dua baris karya terbaru, daftar tujuh edisi dengan miniatur karya, tabel program, dan ajakan gabung.
- **Karya** (`/karya`) kini berupa galeri kanvas yang bisa digeser, dengan tampilan Daftar dan Galeri, filter divisi (`?divisi=`), pencarian kreator, dan lightbox yang bisa dioperasikan lewat keyboard.
- Halaman Karya lama (suka, komentar, detail) dipindah ke `/karya/arsip` tanpa perubahan fitur.
- Komponen baru: `ModernNav`, `ModernFooter`, `WorkImage`, hook `useWorks`, dan modul murni `lib/works.ts` dan `lib/karyaLayout.ts` dengan uji unit.
- Aset logo dan ikon di `public/brand/` diekstrak dari header Instagram @ourcreativity.ofc.
- Font baru: Archivo, Instrument Serif, JetBrains Mono. Halaman lain tetap memakai tema gelap lama.
- Dokumentasi: [docs/DESAIN_MODERNIS.md](docs/DESAIN_MODERNIS.md).

---

## [5.0.0] - 2025-11-01

### 🎨 Revolution Edition — Complete Design Overhaul

This release marks a transformative redesign of OurCreativity with the implementation of the **Luminous Design** philosophy. Every visual element, interaction pattern, and user experience has been reimagined for a premium, fluid, and futuristic feel.

**See detailed release notes:** [v5.0.0 Release Details](docs/versions/v5.0.md)

#### Added

- **Creation Studio v2** — All-in-one multi-mode editor:
  - Text editor dengan Tiptap rich formatting
  - Code IDE dengan Monaco editor (multi-file support)
  - Visual builder dengan drag-and-drop slides
  - Video upload dengan 50MB validation
  - Website embed mode (YouTube/Vimeo/external sites)
  - Document upload support
- **Storage Optimization System** — Client-side WebP compression (90%+ reduction)
  - browser-image-compression integration
  - Automatic WebP conversion (<800KB target)
  - Video size validation (50MB limit)
  - Smart draft auto-save (debounced, change-detected)
- **Mobile UX Overhaul** — Complete reorganization:
  - Global safe-area handling (notch/home bar)
  - Keyboard-aware UI (toolbar positioning)
  - Touch-optimized controls (min 44×44px)
  - Contextual action dock per mode
- **Luminous Design System** — New design language with deep dark backgrounds, glowing accents, and atmospheric lighting
- **Glassmorphism UI** — Premium glass effects pada cards, modals, navigation
- **Hero Section Redesign** — Aurora-inspired gradient backgrounds with smooth mesh animations
- **Enhanced Animations** — Framer Motion choreography for fluid transitions and interactions
- **Improved Typography** — Refined hierarchy using Inter and Playfair Display with optimal readability
- **Dynamic Island Navigation** — Smooth, contextual navigation yang beradaptasi dengan status
- **Draft Management** — Smart auto-save dengan mode-specific drafts
- **Error Boundaries** — User-friendly error handling dengan retry functionality
- **Responsive Excellence** — Optimized layouts for desktop, tablet, and mobile devices

#### Changed

- Complete overhaul of color palette for the Luminous era
- Updated component styling with glass morphism effects
- Refined spacing and sizing scales
- Improved motion and easing functions across interactions
- Enhanced accessibility with better color contrast ratios

#### Technical Improvements

- Lighthouse scores improved to 96/100
- Optimized rendering performance
- Enhanced CSS-in-JS efficiency
- Better code splitting and lazy loading

---

## [4.x.x] - 2025-08-01 to 2025-10-31

Previous releases in the Evolution era. See [Full Version History](docs/versions/RIWAYAT_VERSI_LENGKAP.md) for comprehensive details.

---

## Legend

- **🎨** — Design/UI changes
- **✨** — New features
- **🐛** — Bug fixes
- **📚** — Documentation updates
- **🚀** — Performance improvements
- **💥** — Breaking changes
- **🔐** — Security fixes

---

## Versioning Policy

- **Major** (X.0.0) — Breaking changes or significant redesigns
- **Minor** (0.X.0) — New features and non-breaking additions
- **Patch** (0.0.X) — Bug fixes and documentation updates

---

## For More Information

- **Current Release Details:** [Release v5.0.0](docs/versions/v5.0.md)
- **Full Version Archive:** [Complete Version History](docs/versions/RIWAYAT_VERSI_LENGKAP.md)
- **Future Plans:** [Roadmap](./ROADMAP.md)
- **Contributors:** [Authors & Contributors](./AUTHORS.md)

---

<div align="center">

**OurCreativity** — Built with ❤️ and ☕

*Merangkai Imajinasi, Menghidupkan Karya.*

</div>
