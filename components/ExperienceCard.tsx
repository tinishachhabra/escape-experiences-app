
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Users, ImageOff, Heart } from 'lucide-react';
import { Experience, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { motion } from 'framer-motion';
import { backend } from '../services/mockBackend';

interface Props {
  experience: Experience;
  onClick: () => void;
  featured?: boolean;
  className?: string; // Allow parent to inject classes
}

export const ExperienceCard: React.FC<Props> = ({ experience, onClick, featured, className = '' }) => {
  const startPrice = Math.min(...experience.slots.map(s => s.price));
  const availableSeats = experience.slots.reduce((acc, curr) => acc + curr.seatsAvailable, 0);
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Reset error state if experience changes
  useEffect(() => {
    setImgError(false);
  }, [experience.image]);

  // Check if user has liked this experience on mount
  useEffect(() => {
    backend.getCurrentUser().then(user => {
      setIsLiked(user.favorites?.includes(experience.id) || false);
    });
  }, [experience.id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const newState = !isLiked;
    setIsLiked(newState); // Optimistic update
    await backend.toggleFavorite(experience.id);
  };

  // Robust fallback images based on category if specific image fails
  const getFallbackImage = () => {
      const cat = experience.categories[0];
      if (cat === Category.FOOD) return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"; // Restaurant
      if (cat === Category.MUSIC) return "https://images.unsplash.com/photo-1514525253440-b393452e3383?auto=format&fit=crop&w=800&q=80"; // Concert
      if (cat === Category.ADVENTURE) return "https://images.unsplash.com/photo-1522163114539-1c66023666cd?auto=format&fit=crop&w=800&q=80"; // Climbing/Hiking
      if (cat === Category.ART) return "https://images.unsplash.com/photo-1460661418454-0df4cfc3de06?auto=format&fit=crop&w=800&q=80"; // Paint
      if (cat === Category.WORKSHOP) return "https://images.unsplash.com/photo-1452860606245-16fb10c94958?auto=format&fit=crop&w=800&q=80"; // Craft
      if (cat === Category.WELLNESS) return "https://images.unsplash.com/photo-1544161513-0179fe746f36?auto=format&fit=crop&w=800&q=80"; // Spa
      
      return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"; // Generic Party
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[2rem] bg-card border border-glassBorder cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(57,227,255,0.15)] h-full flex flex-col ${featured ? 'md:h-[600px]' : 'h-[420px]'} ${className}`}
    >
      {/* Image Background */}
      <div className={`relative ${featured ? 'h-[60%]' : 'h-[55%]'} w-full overflow-hidden bg-gray-900`}>
        {imgError ? (
           <img 
              src={getFallbackImage()} 
              alt="Fallback" 
              className="h-full w-full object-cover opacity-80"
           />
        ) : (
          <img 
            key={experience.image}
            src={experience.image} 
            alt={experience.title} 
            onError={(e) => {
              // Prevent infinite loop if fallback fails
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              setImgError(true);
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent opacity-80" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap max-w-[70%]">
          {experience.categories.slice(0, 3).map(cat => (
            <span key={cat} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-xl border border-white/10 ${CATEGORY_COLORS[cat]}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* Like Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-glass/80 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all z-20 group/btn shadow-lg"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-warmPink text-warmPink scale-110' : 'text-white group-hover/btn:text-warmPink'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between bg-gradient-to-b from-midnight/80 to-midnight">
        <div>
            <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-softWhite">{experience.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({experience.reviewCount})</span>
            </div>

            <h3 className={`font-bold text-softWhite mb-2 leading-tight line-clamp-2 ${featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {experience.title}
            </h3>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-1">
            <MapPin className="w-4 h-4 mr-1 text-cyan shrink-0" />
            <span className="truncate">{experience.location}</span>
            </div>
        </div>

        <div className="flex items-center justify-between border-t border-glassBorder pt-4 mt-auto">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Starting at</span>
             <span className="font-bold text-lg text-cyan">₹{startPrice.toLocaleString()}</span>
          </div>
          
          {availableSeats < 5 && availableSeats > 0 ? (
            <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse px-3 py-1 bg-red-400/10 rounded-full">
              <Users className="w-3 h-3" />
              Only {availableSeats} left
            </div>
          ) : availableSeats === 0 ? (
             <span className="text-gray-500 text-xs font-bold bg-glass px-3 py-1 rounded-full">SOLD OUT</span>
          ) : (
            <div className="text-xs font-bold text-softWhite bg-glass px-4 py-2 rounded-full border border-glassBorder group-hover:bg-cyan group-hover:text-midnight group-hover:border-cyan transition-all">
              Book
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
