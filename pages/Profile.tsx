
import React, { useEffect, useState } from 'react';
import { backend } from '../services/mockBackend';
import { User, Booking, Experience } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, MessageCircle, LogOut, X, Download, Share2, Ticket, Clock, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [experiences, setExperiences] = useState<Record<string, Experience>>({});
  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const u = await backend.getCurrentUser();
      setUser(u);
      const bks = await backend.getUserBookings(u.id);
      setBookings(bks);
      
      // Load associated experiences
      const expMap: Record<string, Experience> = {};
      for (const bk of bks) {
        if (!expMap[bk.experienceId]) {
           const exp = await backend.getExperienceById(bk.experienceId);
           if (exp) expMap[bk.experienceId] = exp;
        }
      }
      setExperiences(expMap);
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleShare = (method: 'whatsapp' | 'sms' | 'copy') => {
    if (!viewingTicket || !experiences[viewingTicket.experienceId]) return;
    
    const exp = experiences[viewingTicket.experienceId];
    const slot = exp.slots.find(s => s.id === viewingTicket.slotId);
    const dateStr = slot ? format(new Date(slot.time), 'EEE, MMM d • h:mm a') : '';
    
    const text = `I'm going to ${exp.title} on ${dateStr}! Join me on ESCAPE.`;
    const url = window.location.origin;

    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (method === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(text + ' ' + url);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  // Helper to render barcode lines
  const Barcode = () => (
    <div className="flex h-12 w-full justify-between items-end gap-1 opacity-80 mt-4">
       {[...Array(40)].map((_, i) => (
         <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'w-1' : 'w-2'} ${Math.random() > 0.5 ? 'h-full' : 'h-3/4'}`} />
       ))}
    </div>
  );

  const filterBookings = (type: 'upcoming' | 'past') => {
    const now = new Date();
    return bookings.filter(b => {
      const exp = experiences[b.experienceId];
      if (!exp) return false;
      const slot = exp.slots.find(s => s.id === b.slotId);
      if (!slot) return false;
      
      const slotTime = new Date(slot.time);
      return type === 'upcoming' ? slotTime >= now : slotTime < now;
    });
  };

  if (!user) return <div className="p-8 text-center text-softWhite">Loading profile...</div>;

  const displayedBookings = filterBookings(activeTab);

  return (
    <div className="pt-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-2 border-cyan p-1 object-cover" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-midnight rounded-full" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-softWhite mb-1">{user.name}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                    {user.email}
                </p>
                <div className="flex gap-4 mt-3">
                    <div className="text-sm">
                        <span className="font-bold text-softWhite">{bookings.length}</span> <span className="text-gray-500">Adventures</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-bold text-softWhite">{user.following?.length || 0}</span> <span className="text-gray-500">Following</span>
                    </div>
                </div>
            </div>
          </div>
          <Button variant="glass" size="sm" onClick={handleLogout} className="flex items-center gap-2 self-start md:self-center">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-glassBorder mb-8">
          <button 
             onClick={() => setActiveTab('upcoming')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'upcoming' ? 'text-cyan' : 'text-gray-500 hover:text-softWhite'}`}
          >
             Upcoming
             {activeTab === 'upcoming' && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan" />}
          </button>
          <button 
             onClick={() => setActiveTab('past')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'past' ? 'text-cyan' : 'text-gray-500 hover:text-softWhite'}`}
          >
             Past Events
             {activeTab === 'past' && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan" />}
          </button>
      </div>

      <div className="space-y-6">
        {displayedBookings.length === 0 ? (
            <div className="p-12 border border-dashed border-gray-700 rounded-3xl text-center bg-card">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                    {activeTab === 'upcoming' ? "No upcoming plans." : "No past adventures."}
                </p>
                {activeTab === 'upcoming' && (
                    <Link to="/" className="text-cyan font-bold hover:underline">Find your next escape</Link>
                )}
            </div>
        ) : (
            displayedBookings.map(booking => {
                const exp = experiences[booking.experienceId];
                if (!exp) return null;
                const slot = exp.slots.find(s => s.id === booking.slotId);

                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={booking.id} 
                        className={`bg-card border border-glassBorder rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${activeTab === 'past' ? 'opacity-70 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:border-cyan/30'}`}
                    >
                        <div className="h-48 md:h-auto md:w-64 relative">
                            <img src={exp.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
                            {activeTab === 'upcoming' && (
                                <div className="absolute top-4 left-4 bg-cyan text-midnight px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan/20">
                                    Confirmed
                                </div>
                            )}
                            {activeTab === 'past' && (
                                <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Completed
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-softWhite mb-2">{exp.title}</h3>
                            <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-cyan" />
                                    {slot ? format(new Date(slot.time), 'MMM d, h:mm a') : 'Date Unknown'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-cyan" />
                                    {exp.location}
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setViewingTicket(booking)}
                                    className="flex-1 bg-glass hover:bg-glassBorder text-softWhite py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Ticket className="w-4 h-4" /> {activeTab === 'upcoming' ? 'View Ticket' : 'View Details'}
                                </button>
                                {activeTab === 'upcoming' && (
                                    <Link to={`/chat/${exp.id}`} className="flex-1 bg-gradient-to-r from-cyan/20 to-neonPurple/20 hover:from-cyan/30 hover:to-neonPurple/30 text-cyan border border-cyan/30 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                                        <MessageCircle className="w-4 h-4" /> Group Chat
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {viewingTicket && experiences[viewingTicket.experienceId] && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
             onClick={() => {
                 setViewingTicket(null);
                 setShowShareMenu(false);
             }}
           >
              <motion.div
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 exit={{ scale: 0.9, y: 20 }}
                 onClick={e => e.stopPropagation()}
                 className="w-full max-w-sm bg-white text-midnight rounded-3xl overflow-hidden shadow-2xl relative"
              >
                  {/* Digital Pass Header */}
                  <div className="bg-gradient-to-r from-cyan to-neonPurple p-6 relative overflow-hidden">
                      <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                      <div className="flex justify-between items-start mb-4 relative z-10">
                          <Logo size="sm" /> 
                          <button onClick={() => setViewingTicket(null)} className="p-1 bg-black/10 rounded-full hover:bg-black/20 text-white">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      <h2 className="text-2xl font-black text-midnight mb-1 relative z-10 tracking-tight">DIGITAL PASS</h2>
                      <p className="text-midnight/70 font-bold text-xs uppercase tracking-widest relative z-10">Admit One</p>
                  </div>

                  {/* Ticket Content */}
                  <div className="p-6 relative">
                      {/* Rip notches */}
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-black/90 rounded-full" />
                      <div className="absolute -right-3 top-0 w-6 h-6 bg-black/90 rounded-full" />
                      
                      <div className="border-b-2 border-dashed border-gray-200 pb-6 mb-6">
                           <h3 className="text-2xl font-bold leading-tight mb-2">{experiences[viewingTicket.experienceId].title}</h3>
                           <p className="text-gray-500 font-medium text-sm flex items-center gap-1 mb-1">
                              <MapPin className="w-4 h-4" /> {experiences[viewingTicket.experienceId].location}
                           </p>
                           {(() => {
                               const exp = experiences[viewingTicket.experienceId];
                               const slot = exp.slots.find(s => s.id === viewingTicket.slotId);
                               return slot ? (
                                   <p className="text-neonPurple font-bold text-lg flex items-center gap-2 mt-2">
                                       <Calendar className="w-4 h-4" /> 
                                       {format(new Date(slot.time), 'EEE, MMM d • h:mm a')}
                                   </p>
                               ) : null;
                           })()}
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Guest</p>
                              <p className="font-bold text-lg truncate">{user.name}</p>
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Participants</p>
                              <p className="font-bold text-lg">{viewingTicket.participants}</p>
                          </div>
                          <div className="col-span-2">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Booking Reference</p>
                              <p className="font-mono font-bold text-gray-800 tracking-widest">{viewingTicket.id.toUpperCase()}</p>
                          </div>
                      </div>

                      <Barcode />
                      <p className="text-center text-[10px] text-gray-400 mt-2 font-mono">{viewingTicket.paymentId || 'PENDING_SCAN'}</p>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-gray-50 p-4 flex gap-3 border-t relative">
                      {/* Share Menu */}
                      <AnimatePresence>
                          {showShareMenu && (
                              <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bottom-full right-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-48 z-20"
                              >
                                  <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                      <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                                  </button>
                                  <div className="h-px bg-gray-100" />
                                  <button onClick={() => handleShare('sms')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                      <MessageCircle className="w-4 h-4 text-blue-500" /> Text Message
                                  </button>
                                  <div className="h-px bg-gray-100" />
                                  <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-gray-500" /> Copy Link
                                  </button>
                              </motion.div>
                          )}
                      </AnimatePresence>

                      <button className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-100">
                          <Download className="w-4 h-4" /> Save
                      </button>
                      <button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex-1 py-3 rounded-xl bg-midnight text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
                      >
                          <Share2 className="w-4 h-4" /> Share
                      </button>
                  </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
