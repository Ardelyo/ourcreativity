import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data dianggap seger selama 5 menit
            gcTime: 1000 * 60 * 30, // Data gak dipake bakal diapus setelah 30 menit
            retry: 1, // Coba lagi sekali kalo request gagal
            refetchOnWindowFocus: false, // Gak usah refetch pas window fokus lagi (opsional, cocok buat admin)
        },
    },
});
