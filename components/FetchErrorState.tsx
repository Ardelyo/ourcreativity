// Tampilan buat ngasih tau kalo ada error pas ambil data.
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FetchErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const FetchErrorState: React.FC<FetchErrorStateProps> = ({
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
        <AlertCircle size={40} className="text-rose-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">Terjadi Kesalahan</h3>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} /> Coba Lagi
        </button>
      )}
    </div>
  );
};
