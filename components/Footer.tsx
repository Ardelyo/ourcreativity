import React from 'react';
import { Github, Instagram, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-12 content-visibility-auto">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-white mb-2">Our Creativity.</h3>
          <p className="text-[10px] text-gray-500 tracking-wider uppercase mb-1">Jakarta, Indonesia.</p>
          <p className="text-[10px] text-rose-500/80 font-mono tracking-widest uppercase">Founder @hakyyofficial</p>
        </div>

        <div className="flex items-center gap-8">
          <a href="https://www.instagram.com/ourcreativity.ofc/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="Instagram">
            <Instagram size={20} />
          </a>
          <a href="https://www.tiktok.com/@ourcreativity.ofc" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="TikTok">
            <Music2 size={20} />
          </a>
        </div>

        <div className="text-xs text-gray-600 flex flex-col md:flex-row items-center gap-4">
          <span>© 2025 Hak Cipta Dilindungi.</span>
          <Link to="/license" className="hover:text-rose-500 transition-colors">
            Lisensi & Brand
          </Link>
        </div>
      </div>
    </footer>
  );
};
