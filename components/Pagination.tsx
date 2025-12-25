// Komponen paginasi simpel buat navigasi halaman.
import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    hasMore: boolean;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    hasMore,
    onPageChange,
    loading = false
}) => {
    return (
        <div className="flex items-center justify-between border-t border-white/[0.05] pt-6 mt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Halaman {page}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Sebelumnya"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasMore || loading}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Selanjutnya"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                </button>
            </div>
        </div>
    );
};
