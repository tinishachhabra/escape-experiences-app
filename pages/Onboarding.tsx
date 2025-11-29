
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../types';
import { INDIAN_CITIES } from '../constants';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { backend } from '../services/mockBackend';
import { Logo } from '../components/ui/Logo';
import { useLocationContext } from '../contexts/LocationContext';
import { MapPin, Crosshair } from 'lucide-react';

const interestsList = Object.values(Category);

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<'interests' | 'location'>('interests');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { setLocation, detectLocation, isLocating, location: currentLocation } = useLocationContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = async () => {
    if (step === 'interests') {
        setStep('location');
    } else {
        setLoading(true);
        const user = await backend.getCurrentUser();
        await backend.updateUserInterests(user.id, selectedInterests);
        setLoading(false);
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonPurple/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="z-10 w-full max-w-5xl text-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8 flex justify-center"
        >
            <Logo size="xl" />
        </motion.div>

        {step === 'interests' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="interests-step"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                  Curate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-neonPurple">Reality</span>
                </h1>
                <p className="text-gray-400 mb-12 text-lg md:text-xl max-w-xl mx-auto">
                  Select 3 or more interests to help us tailor your feed.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-16 mx-auto">
                    {interestsList.map((interest, index) => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                            <motion.button
                                key={interest}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: isSelected ? 1.1 : 1 }}
                                whileHover={{ scale: 1.15, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
                                onClick={() => toggleInterest(interest)}
                                className={`
                                    relative px-6 py-6 md:px-8 md:py-8 rounded-full text-sm md:text-base font-bold transition-all duration-300
                                    ${isSelected 
                                    ? 'bg-gradient-to-br from-cyan/80 to-neonPurple/80 text-white shadow-[0_0_30px_rgba(57,227,255,0.4)] z-10' 
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:border-cyan/50'
                                    }
                                `}
                            >
                                {interest}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        )}

        {step === 'location' && (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                key="location-step"
                className="max-w-md mx-auto"
            >
                <h1 className="text-4xl font-bold mb-4 tracking-tighter">Where are you based?</h1>
                <p className="text-gray-400 mb-8 text-lg">We'll show you experiences happening nearby.</p>

                <div className="space-y-4 mb-12">
                    <button 
                        onClick={() => detectLocation()}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan rounded-2xl p-6 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan/10 rounded-full group-hover:bg-cyan/20">
                                <Crosshair className={`w-6 h-6 text-cyan ${isLocating ? 'animate-spin' : ''}`} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white">Use Current Location</p>
                                <p className="text-sm text-gray-500">{isLocating ? 'Detecting...' : 'GPS Detect'}</p>
                            </div>
                        </div>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        {INDIAN_CITIES.slice(0, 6).map(city => (
                            <button
                                key={city}
                                onClick={() => setLocation(city)}
                                className={`p-4 rounded-2xl border transition-all font-semibold ${
                                    currentLocation === city 
                                    ? 'bg-cyan/10 border-cyan text-cyan' 
                                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}

        <motion.div
            className="fixed bottom-10 left-0 right-0 px-6 flex justify-center pointer-events-none"
        >
             <div className="pointer-events-auto">
                <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleNext}
                    disabled={step === 'interests' ? selectedInterests.length < 3 : false}
                    loading={loading}
                    className="min-w-[200px] shadow-2xl shadow-cyan/20 scale-125"
                >
                    {step === 'interests' 
                        ? (selectedInterests.length < 3 ? `Select ${3 - selectedInterests.length} more` : 'Next') 
                        : "Enter ESCAPE"
                    }
                </Button>
             </div>
        </motion.div>
      </div>
    </div>
  );
};
