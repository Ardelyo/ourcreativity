import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10, // Data dianggap seger selama 10 menit (naik dari 5m)
            gcTime: 1000 * 60 * 60, // Data gak dipake bakal diapus setelah 60 menit (naik dari 30m)
            retry: 1, // Coba lagi sekali kalo request gagal
            refetchOnWindowFocus: false, // Tetap false biar gak ganggu UX
            refetchOnMount: true, // Pastikan fetch ulang saat component mount (navigasi)
            refetchOnReconnect: true, // Fetch ulang saat koneksi nyambung lagi
            enabled: true, // Default enabled true
        },
    },
});
