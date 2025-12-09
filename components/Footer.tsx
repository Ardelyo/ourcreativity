import React from 'react';
import { Github, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-12 content-visibility-auto">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-white mb-2">Our Creativity.</h3>
          <p className="text-xs text-gray-500 tracking-wide uppercase">Jakarta, Indonesia.</p>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Youtube size={20} /></a>
        </div>

        <div className="text-xs text-gray-600">
          © 2025 Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
};