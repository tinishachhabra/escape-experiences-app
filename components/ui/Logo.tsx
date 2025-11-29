
import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-cyan/30 blur-xl rounded-full animate-pulse-slow" />
      
      {/* Star Shape */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-cyan z-10"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <path 
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
          fill="url(#paint0_linear)" 
          className="drop-shadow-[0_0_15px_rgba(57,227,255,0.8)]"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#39E3FF" />
            <stop offset="1" stopColor="#C65CFF" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      {/* Center Portal Core */}
      <motion.div 
        className="absolute w-[20%] h-[20%] bg-white rounded-full mix-blend-overlay"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
};
