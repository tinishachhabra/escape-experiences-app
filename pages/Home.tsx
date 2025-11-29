
import React, { useEffect, useState, useMemo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { backend } from '../services/mockBackend';
import { Experience, Category, Testimonial } from '../types';
import { TESTIMONIALS } from '../constants';
import { ExperienceCard } from '../components/ExperienceCard';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, User, MapPin, Mail, Phone, MessageSquare } from 'lucide-react';
import { getGeminiRecommendation } from '../services/geminiService';
import { useLocationContext } from '../contexts/LocationContext';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useTheme } from '../contexts/ThemeContext';

const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <motion.div
    style={style}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0],
    }}
    transition={{ 
      duration: Math.random() * 2 + 1.5, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay: Math.random() * 2 
    }}
    className="absolute pointer-events-none z-0"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan drop-shadow-[0_0_8px_rgba(57,227,255,0.8)]">
      <path d="M12 0L14.5 9.41L24 12L14.5 14.5L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
    </svg>
  </motion.div>
);

const SparkleBackground: React.FC = () => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    // Generate static random positions on mount
    const newSparkles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `scale(${Math.random() * 0.5 + 0.5})`, // Varied sizes
      }
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <Sparkle key={s.id} style={s.style} />
      ))}
    </div>
  );
};

const TestimonialsCarousel = ({ items }: { items: Testimonial[] }) => (
    <div className="w-full overflow-hidden py-24 relative z-10 border-t border-glassBorder bg-glass backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold mb-10 flex items-center gap-2 tracking-widest uppercase text-gray-500"
            >
              <User className="text-softWhite" /> Voices
            </motion.h3>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
                {items.map((t, i) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="min-w-[300px] md:min-w-[400px] bg-card p-8 rounded-3xl border border-glassBorder snap-center hover:bg-glass transition-colors shadow-xl"
                    >
                        <p className="text-gray-500 dark:text-gray-200 italic mb-6 text-xl font-light leading-relaxed">"{t.quote}"</p>
                        <div className="flex items-center gap-4">
                            <img src={t.avatar} className="w-12 h-12 rounded-full object-cover border border-glassBorder" alt={t.name} />
                            <div>
                                <p className="font-bold text-base text-softWhite">{t.name}</p>
                                <p className="text-xs text-cyan font-bold uppercase tracking-wider">{t.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

const ContactSection: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'host',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', topic: 'host', message: '' });
        }, 1500);
    };

    return (
        <section className="relative z-10 py-24 border-t border-glassBorder bg-midnight">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-softWhite mb-6 tracking-tight"
                        >
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-neonPurple">Touch</span>
                        </motion.h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                            Looking to organize a unique experience? Have a question about your booking? 
                            We're here to help you escape the ordinary.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-300">
                                <div className="p-3 bg-glass rounded-full border border-glassBorder text-cyan">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Us</p>
                                    <p className="font-medium text-softWhite">hello@escape.app</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-300">
                                <div className="p-3 bg-glass rounded-full border border-glassBorder text-neonPurple">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Call Us</p>
                                    <p className="font-medium text-softWhite">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-300">
                                <div className="p-3 bg-glass rounded-full border border-glassBorder text-warmPink">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">HQ</p>
                                    <p className="font-medium text-softWhite">Indiranagar, Bangalore, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card backdrop-blur-xl border border-glassBorder p-8 rounded-3xl shadow-2xl">
                        {status === 'success' ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-12"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-softWhite mb-2">Message Sent!</h3>
                                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-cyan hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-glass border border-glassBorder rounded-xl p-3 text-softWhite focus:outline-none focus:border-cyan transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Phone</label>
                                        <input 
                                            type="tel" 
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-glass border border-glassBorder rounded-xl p-3 text-softWhite focus:outline-none focus:border-cyan transition-colors"
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-glass border border-glassBorder rounded-xl p-3 text-softWhite focus:outline-none focus:border-cyan transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Topic</label>
                                    <select 
                                        value={formData.topic}
                                        onChange={e => setFormData({...formData, topic: e.target.value})}
                                        className="w-full bg-glass border border-glassBorder rounded-xl p-3 text-softWhite focus:outline-none focus:border-cyan transition-colors appearance-none"
                                    >
                                        <option value="host">I want to Host an Event</option>
                                        <option value="support">Customer Support / Issue</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="partnership">Brand Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Message</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-glass border border-glassBorder rounded-xl p-3 text-softWhite focus:outline-none focus:border-cyan transition-colors resize-none"
                                        placeholder="Tell us more details..."
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    loading={status === 'loading'}
                                    className="w-full mt-2"
                                >
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 bg-midnight py-16 border-t border-glassBorder text-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <Logo size="md" />
                            <span className="font-bold text-xl tracking-tighter text-softWhite">ESCAPE</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                            Curated experiences for the modern explorer. Discover the extraordinary in your city, from secret suppers to midnight adventures.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-softWhite mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-cyan transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-cyan transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-cyan transition-colors">Become a Host</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-softWhite mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-cyan transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-cyan transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-cyan transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-glassBorder flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
                    <p>© {new Date().getFullYear()} Escape Technologies Pvt Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50 } 
  }
};

export const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const { location: currentLocation } = useLocationContext();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const load = async () => {
      // Backend now caches data, so this will be fast on subsequent loads
      const data = await backend.getExperiences();
      setExperiences(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleGeminiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setAiSuggestion(null);
    const suggestion = await getGeminiRecommendation(searchQuery, ['Adventure', 'Wellness']); 
    setAiSuggestion(suggestion);
  };

  // Optimize filtering with useMemo to ensure instant location switching
  const filtered = useMemo(() => {
    return experiences.filter(exp => {
        const matchesFilter = filter === 'All' || exp.categories.includes(filter as Category);
        const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Improved location matching
        const matchesLocation = exp.location.toLowerCase().includes(currentLocation.toLowerCase()) || 
                                currentLocation.toLowerCase().includes(exp.location.split(',')[1]?.trim().toLowerCase() || 'xxxxx');

        return matchesFilter && matchesSearch && matchesLocation;
      });
  }, [experiences, filter, searchQuery, currentLocation]);

  // Derived lists
  const trending = useMemo(() => filtered.filter(e => e.isTrending).slice(0, 6), [filtered]);
  const mainFeed = useMemo(() => (filter === 'All' && !searchQuery ? filtered.slice(6) : filtered), [filtered, filter, searchQuery]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-midnight"><div className="w-1 h-24 bg-softWhite animate-pulse"></div></div>;

  return (
    <div className="bg-midnight min-h-screen overflow-hidden selection:bg-cyan/30 selection:text-softWhite relative flex flex-col transition-colors duration-300">
      
      {/* 
          Gradient Background
      */}
      <div className={`fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme === 'dark' ? 'from-[#1e1b4b] via-[#0D0F1A] to-[#0D0F1A]' : 'from-blue-50 via-white to-gray-50'}`} />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cyan/5 via-neonPurple/5 to-warmPink/5 mix-blend-screen pointer-events-none" />
      
      {/* RESTORED SPARKLES */}
      <SparkleBackground />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden mb-12 border-b border-glassBorder shrink-0">
        
        <div className="relative z-20 w-full max-w-5xl px-6 text-center">
            <motion.div
                 initial={{ y: 20, opacity: 0 }} 
                 animate={{ y: 0, opacity: 1 }} 
                 transition={{ duration: 0.8 }}
                 className="mb-6 flex justify-center"
            >
                <span className="px-4 py-1.5 rounded-full border border-glassBorder bg-glass text-xs font-bold tracking-widest text-cyan uppercase backdrop-blur-md shadow-lg">
                    Live in {currentLocation}
                </span>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.1 }}
                className={`text-6xl md:text-8xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b drop-shadow-2xl ${theme === 'dark' ? 'from-white via-white to-white/50' : 'from-black via-black to-gray-500'}`}
            >
                ESCAPE THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-neonPurple">ORDINARY</span>
            </motion.h1>
            
            {/* Search Bar */}
            <motion.form 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.8 }}
                onSubmit={handleGeminiSearch} 
                className="relative max-w-2xl mx-auto group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-neonPurple/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
                <div className="relative flex items-center bg-glass backdrop-blur-xl border border-glassBorder rounded-full p-2 pl-6 shadow-2xl transition-all duration-300 group-hover:bg-glass/80">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Type 'date night' or 'adventure'..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-softWhite placeholder-gray-400 focus:outline-none text-lg font-medium"
                    />
                    <button type="submit" className="p-3 bg-gradient-to-r from-cyan to-neonPurple rounded-full text-midnight hover:shadow-[0_0_20px_rgba(57,227,255,0.5)] transition-all active:scale-95">
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>
            </motion.form>

            {/* AI Result */}
            <AnimatePresence>
            {aiSuggestion && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, height: 0 }} 
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 mx-auto max-w-xl overflow-hidden"
                >
                    <div className="p-5 bg-gradient-to-br from-cyan/10 to-neonPurple/10 border border-glassBorder rounded-2xl backdrop-blur-md text-left flex gap-4">
                        <div className="p-2 bg-cyan/20 rounded-lg h-fit"><Sparkles className="w-5 h-5 text-cyan" /></div>
                        <div>
                            <p className="text-xs text-cyan font-bold uppercase tracking-wider mb-1">AI Concierge</p>
                            <p className="text-softWhite text-sm leading-relaxed">{aiSuggestion}</p>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-24 relative z-10 flex-1 w-full">

        {/* Categories */}
        <div className="flex justify-center flex-wrap gap-3">
            {['All', ...Object.values(Category)].map((cat, i) => (
            <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-md ${
                filter === cat 
                    ? `bg-softWhite text-midnight border-softWhite shadow-[0_0_20px_rgba(255,255,255,0.3)]` 
                    : 'bg-glass text-gray-400 border-glassBorder hover:bg-glassBorder hover:text-softWhite'
                }`}
            >
                {cat}
            </motion.button>
            ))}
        </div>

        {/* Trending Section - Only shown on All */}
        {filter === 'All' && !searchQuery && (
            <section>
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-8"
                 >
                     <h2 className="text-3xl font-bold text-softWhite flex items-center gap-3">
                         <TrendingUp className="text-neonPurple" /> Trending in {currentLocation}
                     </h2>
                 </motion.div>
                 
                 {trending.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {trending.map((exp) => (
                            <motion.div key={exp.id} variants={itemVariants}>
                                <ExperienceCard experience={exp} onClick={() => navigate(`/experience/${exp.id}`)} />
                            </motion.div>
                        ))}
                    </motion.div>
                 ) : (
                    <div className="text-gray-500 font-mono text-center py-12">
                        <p>No trending events in {currentLocation} right now.</p>
                    </div>
                 )}
            </section>
        )}

        {/* Main Grid - Filtered Results */}
        <section className="flex-1 min-h-[500px]">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold text-softWhite mb-2">
                    {filter === 'All' ? 'All Experiences' : `${filter} Experiences`}
                </h2>
                <p className="text-gray-400">Curated specifically for you in {currentLocation}.</p>
            </motion.div>
            
            {mainFeed.length > 0 ? (
              <motion.div 
                  key={filter}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                  {mainFeed.map((exp, idx) => (
                      <motion.div key={exp.id} variants={itemVariants} className={idx === 0 && filter === 'All' && !searchQuery ? 'col-span-1 md:col-span-2 row-span-2' : ''}>
                          <ExperienceCard 
                              experience={exp} 
                              onClick={() => navigate(`/experience/${exp.id}`)}
                              featured={idx === 0 && filter === 'All' && !searchQuery} 
                          />
                      </motion.div>
                  ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-glass rounded-3xl border border-dashed border-glassBorder">
                  <MapPin className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-medium text-lg">No experiences found in {currentLocation} yet.</p>
                  <button onClick={() => setFilter('All')} className="mt-4 text-cyan hover:underline">Clear filters</button>
              </div>
            )}
        </section>

      </div>
      
      {/* Testimonials Section */}
      <TestimonialsCarousel items={TESTIMONIALS} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

    </div>
  );
};
