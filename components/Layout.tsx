
import React, { useState, useEffect } from 'react';
import { Home, Heart, MessageCircle, User as UserIcon, MapPin, ChevronDown, Crosshair, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './ui/Logo';
import { useLocationContext } from '../contexts/LocationContext';
import { INDIAN_CITIES } from '../constants';
import { backend } from '../services/mockBackend';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const NavItem = ({ to, icon: Icon, active }: { to: string, icon: any, active: boolean }) => (
  <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${active ? 'text-cyan' : 'text-gray-500'}`}>
    <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(57,227,255,0.5)]' : ''}`} />
    {active && <motion.div layoutId="nav-pill" className="w-1 h-1 bg-cyan rounded-full absolute bottom-2 shadow-[0_0_8px_rgba(57,227,255,1)]" />}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { location: currentCity, setLocation, detectLocation, isLocating } = useLocationContext();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isExperienceDetail = location.pathname.includes('/experience/');

  useEffect(() => {
    const loadUser = async () => {
      const u = await backend.getCurrentUser();
      setUser(u);
    };
    loadUser();
  }, []);

  // Hide header/nav on auth pages
  const isAuthPage = ['/login', '/signup', '/onboarding', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-midnight text-softWhite pb-24 md:pb-0 relative selection:bg-cyan/30 transition-colors duration-300">
      
      {/* Global Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neonPurple/5 rounded-full blur-[120px]" />
      </div>

      {/* Desktop/Tablet Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-midnight/60 backdrop-blur-xl border-b border-glassBorder h-20 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="md" />
            <span className="font-bold text-2xl tracking-tighter text-softWhite group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan group-hover:to-neonPurple transition-all">ESCAPE</span>
          </Link>

          {/* Location Selector */}
          <div className="relative">
             <button 
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className="flex items-center gap-2 bg-glass hover:bg-glassBorder px-4 py-2 rounded-full border border-glassBorder transition-colors text-softWhite"
             >
                <MapPin className="w-4 h-4 text-cyan" />
                <span className="text-sm font-semibold">{currentCity}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
             </button>

             <AnimatePresence>
                {isLocationMenuOpen && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-midnight border border-glassBorder rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl z-50"
                   >
                      <button 
                         onClick={() => {
                             detectLocation();
                             setIsLocationMenuOpen(false);
                         }}
                         className="w-full text-left px-4 py-3 hover:bg-glass flex items-center gap-2 text-cyan font-semibold border-b border-glassBorder"
                      >
                         <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                         {isLocating ? 'Detecting...' : 'Use Current Location'}
                      </button>
                      <div className="max-h-60 overflow-y-auto">
                         {INDIAN_CITIES.map(city => (
                             <button
                                key={city}
                                onClick={() => {
                                    setLocation(city);
                                    setIsLocationMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-glass text-sm transition-colors ${currentCity === city ? 'bg-glass text-softWhite' : 'text-gray-500 dark:text-gray-400'}`}
                             >
                                 {city}
                             </button>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-cyan transition-colors">Discover</Link>
          <Link to="/favorites" className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-cyan transition-colors">Favorites</Link>
          <Link to="/profile" className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-cyan transition-colors">My Bookings</Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-glass hover:bg-glassBorder text-softWhite transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {user ? (
            <Link to="/profile" className="relative group">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-glassBorder object-cover group-hover:border-cyan transition-all"
              />
              <div className="absolute inset-0 rounded-full bg-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ) : (
            <div className="w-10 h-10 rounded-full bg-glass animate-pulse" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`pt-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative z-10 ${isExperienceDetail ? 'px-0 pt-0' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-midnight/90 backdrop-blur-2xl border-t border-glassBorder z-[60] md:hidden pb-safe">
        <div className="grid grid-cols-5 h-full items-center">
          <NavItem to="/" icon={Home} active={location.pathname === '/'} />
          <NavItem to="/favorites" icon={Heart} active={location.pathname === '/favorites'} />
          <div className="flex items-center justify-center">
             <button onClick={toggleTheme} className="p-3 bg-glass rounded-full text-softWhite">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
          <NavItem to="/chat" icon={MessageCircle} active={location.pathname.startsWith('/chat')} />
          <NavItem to="/profile" icon={UserIcon} active={location.pathname === '/profile'} />
        </div>
      </nav>
    </div>
  );
};
