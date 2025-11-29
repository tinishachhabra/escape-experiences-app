import React, { useEffect, useState } from 'react';
import { backend } from '../services/mockBackend';
import { Experience } from '../types';
import { ExperienceCard } from '../components/ExperienceCard';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await backend.getFavorites();
      setFavorites(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-white">Loading favorites...</div>;

  return (
    <div className="min-h-screen pt-4 pb-32">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <Heart className="text-warmPink fill-current" /> Favorites
        </h1>
        <p className="text-gray-400 mb-8">The experiences you've saved for later.</p>
        
        {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map(exp => (
                    <ExperienceCard 
                        key={exp.id} 
                        experience={exp} 
                        onClick={() => navigate(`/experience/${exp.id}`)}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Heart className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-medium text-lg">No favorites yet.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-cyan hover:underline">Start exploring</button>
            </div>
        )}
    </div>
  );
};