import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';

// --- Types ---
interface ContributorProps {
  login: string;
  avatar_url: string;
  contributions: number;
  personaTitle: string;
  isOwner?: boolean;
  onClick: () => void;
}

// --- Component ---
export const ContributorCard: React.FC<ContributorProps> = ({
  login,
  avatar_url,
  personaTitle,
  isOwner = false,
  onClick,
}) => {
  return (
    <motion.div
      layoutId={`card-${login}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group cursor-pointer relative'
    >
      {/* Organic Glow Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10 ${
          isOwner
            ? 'from-amber-500/20 via-rose-500/20 to-purple-500/20'
            : 'from-blue-500/20 via-purple-500/20 to-cyan-500/20'
        }`}
      />

      {/* Main Container - Glossy Abstract Shape */}
      <div className='relative bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-[2rem] p-6 transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/10 overflow-hidden'>
        {/* Subtle Noise Texture */}
        <div
          className='absolute inset-0 opacity-[0.05]'
          style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
          }}
        ></div>

        <div className='relative z-10 flex flex-col items-center text-center'>
          {/* Avatar Container */}
          <div
            className={`relative w-20 h-20 mb-4 rounded-full p-1 transition-transform duration-500 group-hover:scale-105 ${
              isOwner
                ? 'bg-gradient-to-tr from-amber-500 to-rose-500'
                : 'bg-gradient-to-tr from-white/10 to-white/5'
            }`}
          >
            <img
              src={avatar_url}
              alt={login}
              className='w-full h-full rounded-full object-cover border border-black/50'
            />
            {isOwner && (
              <div className='absolute -top-2 -right-2 bg-amber-500 p-1.5 rounded-full shadow-lg'>
                <Crown size={12} className='text-black' />
              </div>
            )}
          </div>

          {/* Typography */}
          <h3 className='text-xl font-serif text-white mb-1 group-hover:text-rose-200 transition-colors'>
            {login}
          </h3>

          <div className='flex items-center gap-1.5 text-xs text-white/40 tracking-wide font-light'>
            <Sparkles
              size={10}
              className={isOwner ? 'text-amber-400' : 'text-purple-400'}
            />
            <span>{personaTitle}</span>
          </div>

          {/* Decoration */}
          <div className='mt-6 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-rose-500/50 transition-all duration-500' />
        </div>
      </div>
    </motion.div>
  );
};
