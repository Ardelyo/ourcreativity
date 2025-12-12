# Panduan Routing

> Dokumentasi lengkap tentang sistem routing di OurCreativity

## Ringkasan

OurCreativity menggunakan **React Router v6** dengan `BrowserRouter` untuk navigasi client-side dengan URL yang persisten dan shareable.

## Arsitektur Routing

### BrowserRouter vs MemoryRouter

**Mengapa BrowserRouter?**
- ✅ URL yang persisten dan dapat dibookmark
- ✅ Mendukung deep linking (langsung ke halaman spesifik)
- ✅ URL dapat dibagikan ke pengguna lain
- ✅ SEO-friendly (dengan SSR/SSG di masa depan)
- ✅ Browser history navigation (tombol back/forward)

**Trade-off:**
- ⚠️ Memerlukan konfigurasi server untuk SPA fallback
- ⚠️ Harus handle 404 dengan benar pada level server

### Struktur Rute

```typescript
<BrowserRouter>
  <Routes>
    {/* Halaman Utama */}
    <Route path="/" element={<Home />} />
    
    {/* Halaman Fitur */}
    <Route path="/karya" element={<Karya />} />
    <Route path="/tim" element={<Tim />} />
    <Route path="/story" element={<Story />} />
    <Route path="/info" element={<Info />} />
    <Route path="/announcement" element={<Announcement />} />
    
    {/* Halaman Divisi */}
    <Route path="/division/graphics" element={<Graphics />} />
    <Route path="/division/video" element={<VideoPage />} />
    <Route path="/division/writing" element={<Writing />} />
    <Route path="/division/meme" element={<Meme />} />
    <Route path="/division/coding" element={<Coding />} />
    
    {/* Fallback 404 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

## Lazy Loading

Semua halaman kecuali `Home` dimuat secara lazy untuk optimasi performa:

```typescript
// Home dimuat eagerly (langsung)
import { Home } from './pages/Home';

// Halaman lain dimuat lazy
const Karya = React.lazy(() => 
  import('./pages/Karya').then(module => ({ default: module.Karya }))
);
const Tim = React.lazy(() => 
  import('./pages/Tim').then(module => ({ default: module.Tim }))
);
// ... dst
```

**Manfaat:**
- Reduced initial bundle size
- Faster first paint
- Better Core Web Vitals

**Loading Fallback:**
```typescript
<Suspense fallback={<Loading />}>
  <Routes>...</Routes>
</Suspense>
```

## Fitur Routing

### 1. Scroll to Top

Otomatis scroll ke atas saat navigasi:

```typescript
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
```

### 2. Animated Transitions

Menggunakan Framer Motion `AnimatePresence`:

```typescript
<AnimatePresence mode="wait">
  <motion.div key={location.pathname}>
    <Routes location={location}>...</Routes>
  </motion.div>
</AnimatePresence>
```

### 3. Error Boundary

Semua rute dibungkus dengan ErrorBoundary:

```typescript
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <Routes>...</Routes>
  </Suspense>
</ErrorBoundary>
```

## SPA Fallback Configuration

**PENTING:** Karena client-side routing, server harus mengarahkan semua request ke `index.html`.

### Vercel

File `vercel.json` di root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

**Opsi 1:** File `netlify.toml` di root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Opsi 2:** File `_redirects` di folder `public/`:

```
/*    /index.html   200
```

### Cloudflare Pages

File `_redirects` di folder `public/`:

```
/*    /index.html   200
```

### Apache

File `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx

Konfigurasi server block:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Navigasi Programmatic

### Menggunakan Link

```typescript
import { Link } from 'react-router-dom';

<Link to="/karya">Lihat Karya</Link>
```

### Menggunakan Navigate Hook

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/tim');
  };
  
  return <button onClick={handleClick}>Tim</button>;
}
```

### Redirect Component

```typescript
import { Navigate } from 'react-router-dom';

<Route path="*" element={<Navigate to="/" replace />} />
```

## Best Practices

### 1. Gunakan Link untuk Navigasi Internal

❌ **Jangan:**
```typescript
<a href="/karya">Karya</a>
```

✅ **Lakukan:**
```typescript
<Link to="/karya">Karya</Link>
```

### 2. Lazy Load Non-Critical Routes

Home page dimuat eagerly, sisanya lazy:

```typescript
// Eager
import { Home } from './pages/Home';

// Lazy
const Karya = React.lazy(() => import('./pages/Karya'));
```

### 3. Handle Loading States

Selalu berikan fallback untuk lazy routes:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

### 4. Wrap with Error Boundary

Tangani error routing dengan ErrorBoundary:

```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <Routes>...</Routes>
</ErrorBoundary>
```

## Testing Routes Locally

### Development Server

```bash
npm run dev
```

Server dev Vite sudah dikonfigurasi untuk handle SPA routing.

### Preview Production Build

```bash
npm run build
npm run preview
```

Preview server juga sudah dikonfigurasi untuk SPA fallback.

## Troubleshooting

### Masalah: 404 pada Refresh

**Gejala:** Navigasi works, tapi refresh halaman returns 404.

**Solusi:** Pastikan SPA fallback config sudah terpasang di server hosting.

### Masalah: Assets tidak load

**Gejala:** CSS/JS tidak load setelah navigasi.

**Solusi:** Check `base` config di `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // untuk root domain
  // base: '/subfolder/', // untuk subfolder
})
```

### Masalah: Lazy routes tidak load

**Gejala:** Infinite loading atau error saat navigasi.

**Solusi:** 
1. Check console untuk module import errors
2. Pastikan export named di page module:
   ```typescript
   export const Karya = () => { ... }
   ```
3. Import dengan named export:
   ```typescript
   React.lazy(() => import('./pages/Karya').then(m => ({ default: m.Karya })))
   ```

## Migration dari MemoryRouter

Jika upgrade dari versi lama yang pakai MemoryRouter:

1. Update import di `App.tsx`:
   ```typescript
   // Sebelum
   import { MemoryRouter } from 'react-router-dom';
   
   // Sesudah
   import { BrowserRouter } from 'react-router-dom';
   ```

2. Deploy dengan SPA fallback config
3. Test semua routes:
   - Direct navigation (klik link)
   - Refresh page
   - Back/forward browser
   - Deep link (paste URL)

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [Vite SPA Configuration](https://vitejs.dev/guide/static-deploy.html)
- [Vercel SPA Routing](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)

---

**Terakhir Diperbarui:** November 2025  
**Versi:** 5.0  
**Pemelihara:** Tim OurCreativity
