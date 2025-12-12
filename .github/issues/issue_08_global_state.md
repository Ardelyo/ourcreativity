## 🎯 Deskripsi

Aplikasi saat ini **tidak memiliki state management global**. Semua state dikelola secara lokal di komponen, yang akan menjadi masalah seiring pertumbuhan aplikasi.

## 📍 Situasi Saat Ini

Dari dokumen `ARSITEKTUR.md`:

> **State Lokal:**
>
> - React `useState` untuk state komponen
> - **Belum ada manajemen state global**
> - Props drilling untuk state bersama
>
> **Pertimbangan Masa Depan:**
>
> - Context API untuk tema
> - React Query untuk pengambilan data
> - Zustand/Jotai untuk state global

## ❓ Mengapa Ini Penting

1. **Data Fetching**: Data dari Supabase di-fetch ulang setiap kali komponen mount
2. **User State**: Jika ada autentikasi, user info perlu global
3. **UI State**: Theme, language preference, notification perlu persisted

## ✅ Rencana Implementasi Bertahap

### Fase 1: React Query untuk Data Fetching

```bash
npm install @tanstack/react-query
```

```tsx
// lib/queryClient.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// hooks/useWorks.ts
export function useWorks(division?: string) {
  return useQuery({
    queryKey: ['works', division],
    queryFn: () => supabase.from('works').select('*'),
  });
}
```

### Fase 2: Zustand untuk UI State

```bash
npm install zustand
```

```tsx
// store/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      theme: 'dark',
      sidebarOpen: false,
      setTheme: theme => set({ theme }),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'ui-storage' }
  )
);
```

## 📋 Kriteria Selesai

- [ ] React Query terinstall dan terkonfigurasi
- [ ] Supabase queries menggunakan React Query
- [ ] Caching berfungsi (tidak re-fetch setiap mount)
- [ ] DevTools tersedia untuk debugging
