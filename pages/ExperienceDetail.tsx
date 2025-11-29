
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend } from '../services/mockBackend';
import { Experience, Slot } from '../types';
import { Button } from '../components/ui/Button';
import { MapPin, Clock, ShieldCheck, User, ChevronLeft, Star, Heart, CreditCard, Smartphone, Globe, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';

export const ExperienceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | undefined>();
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const imageOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);
  
  // Social State
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [participants, setParticipants] = useState(1);
  const [bookingStep, setBookingStep] = useState<'slot' | 'processing_init' | 'razorpay' | 'processing_final' | 'success'>('slot');
  const [tempBookingId, setTempBookingId] = useState<string | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({ 
      upiId: '', 
      cardNumber: '', 
      cardName: '',
      expiry: '', 
      cvv: '', 
      bank: '',
      customerId: '' 
  });

  useEffect(() => {
    if (id) {
      Promise.all([
          backend.getExperienceById(id),
          backend.getCurrentUser()
      ]).then(([data, user]) => {
        setExperience(data);
        if (data) {
            setIsLiked(user.favorites?.includes(data.id) || false);
            setIsFollowing(user.following?.includes(data.hostName) || false);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const toggleLike = async () => {
      if (!experience) return;
      const newState = !isLiked;
      setIsLiked(newState);
      await backend.toggleFavorite(experience.id);
  };

  const toggleFollow = async () => {
      if (!experience) return;
      const newState = !isFollowing;
      setIsFollowing(newState);
      await backend.toggleFollow(experience.hostName);
  };

  const handleInitiateBooking = async () => {
    if (!selectedSlot || !experience) return;
    setBookingStep('processing_init');
    
    // 1. Get current user
    const user = await backend.getCurrentUser();

    // 2. Reserve Tentative Slot
    const booking = await backend.reserveSlot(user.id, experience.id, selectedSlot.id, participants);
    setTempBookingId(booking.id);

    // 3. Create Mock Order
    await backend.createPaymentOrder(booking.id, selectedSlot.price * participants);
    
    // 4. Show Razorpay UI
    setBookingStep('razorpay');
  };

  const isPaymentValid = () => {
      if (paymentMethod === 'upi') return paymentDetails.upiId.includes('@');
      if (paymentMethod === 'card') return paymentDetails.cardNumber.length >= 12 && paymentDetails.cvv.length === 3 && paymentDetails.cardName.length > 2;
      if (paymentMethod === 'netbanking') return paymentDetails.bank.length > 0 && paymentDetails.customerId.length > 3;
      return false;
  };

  const handlePaymentSuccess = async () => {
      if (!tempBookingId) return;
      setBookingStep('processing_final');
      
      // 5. Confirm Booking on Backend
      await backend.confirmBooking(tempBookingId, `pay_${Date.now()}`);
      
      // 6. Show Success
      setBookingStep('success');
  };

  if (loading || !experience) return <div className="p-8 text-center mt-20 text-softWhite">Loading portal...</div>;

  return (
    <div className="relative min-h-screen bg-midnight pb-32">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
          <button 
            onClick={() => navigate(-1)} 
            className="pointer-events-auto p-3 bg-glass backdrop-blur-md border border-glassBorder rounded-full text-softWhite hover:bg-glassBorder transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={toggleLike}
            className={`pointer-events-auto p-3 backdrop-blur-md border rounded-full transition-all ${
                isLiked 
                ? 'bg-warmPink/20 border-warmPink/50 text-warmPink' 
                : 'bg-glass border-glassBorder text-softWhite hover:bg-glassBorder'
            }`}
          >
             <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
      </div>

      {/* Hero Image Parallax */}
      <div className="h-[70vh] w-full relative overflow-hidden">
        <motion.div style={{ scale: imageScale, opacity: imageOpacity }} className="w-full h-full">
             <img src={experience.image} className="w-full h-full object-cover" alt="Hero" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-40 relative z-10">
        
        {/* Title Card */}
        <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card/80 backdrop-blur-2xl border border-glassBorder p-8 rounded-3xl mb-12 shadow-2xl"
        >
            <div className="flex flex-wrap gap-2 mb-4">
                {experience.categories.map(c => (
                    <span key={c} className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-glass rounded-full text-cyan shadow-[0_0_10px_rgba(57,227,255,0.2)]">{c}</span>
                ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-softWhite mb-6 leading-none tracking-tight">{experience.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-cyan" /> {experience.location}</div>
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" /> 
                    {experience.rating.toFixed(1)} ({experience.reviewCount} reviews)
                </div>
            </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
                {/* Host */}
                <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-glassBorder hover:border-cyan/50 transition-all">
                    <img src={experience.hostAvatar} className="w-16 h-16 rounded-full border border-glassBorder object-cover" alt="Host" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Curated by</p>
                        <p className="font-bold text-xl text-softWhite">{experience.hostName}</p>
                    </div>
                    <Button 
                        variant={isFollowing ? "glass" : "secondary"} 
                        size="sm"
                        onClick={toggleFollow}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </div>

                {/* Description */}
                <section>
                    <h3 className="text-2xl font-bold text-softWhite mb-6">The Experience</h3>
                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed text-lg font-light">{experience.description}</p>
                </section>

                {/* Reviews */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-softWhite">Guest Reviews</h3>
                    </div>
                    <div className="space-y-6">
                        {experience.reviews?.map(review => (
                            <div key={review.id} className="bg-card p-6 rounded-2xl border border-glassBorder">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={review.userAvatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <div>
                                            <p className="font-bold text-sm text-softWhite">{review.userName}</p>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-300 italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="space-y-6">
                <div className="bg-card p-8 rounded-3xl border border-glassBorder sticky top-24">
                    <h4 className="font-bold text-xl mb-6 text-softWhite">Details</h4>
                    <ul className="space-y-6 text-gray-500 dark:text-gray-300">
                        <li className="flex gap-4 items-center">
                            <div className="p-2 bg-glass rounded-lg"><Clock className="w-5 h-5 text-cyan"/></div>
                            <span>2-3 Hours</span>
                        </li>
                        <li className="flex gap-4 items-center">
                            <div className="p-2 bg-glass rounded-lg"><User className="w-5 h-5 text-cyan"/></div>
                            <span>Max 12 Guests</span>
                        </li>
                        <li className="flex gap-4 items-center">
                            <div className="p-2 bg-glass rounded-lg"><ShieldCheck className="w-5 h-5 text-cyan"/></div>
                            <span>Vetted Host</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-midnight/90 backdrop-blur-xl border-t border-glassBorder z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex flex-col">
                <span className="text-sm text-gray-500">Total Price</span>
                <span className="text-3xl font-bold text-softWhite">₹{Math.min(...experience.slots.map(s => s.price)).toLocaleString()}</span>
            </div>
            <Button 
                onClick={() => {
                    setIsBookingOpen(true);
                    setBookingStep('slot');
                }} 
                className="w-full md:w-auto px-12 py-4 text-lg shadow-[0_0_20px_rgba(57,227,255,0.3)] hover:shadow-[0_0_30px_rgba(57,227,255,0.5)]"
            >
                Reserve a Spot
            </Button>
          </div>
      </div>

      {/* Booking Drawer */}
      <AnimatePresence>
        {isBookingOpen && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
                onClick={() => setIsBookingOpen(false)}
            >
                <motion.div 
                    initial={{ y: '100%' }} 
                    animate={{ y: 0 }} 
                    exit={{ y: '100%' }}
                    className="bg-midnight w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border border-glassBorder max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {bookingStep === 'slot' && (
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-softWhite">Select Date</h2>
                                <button onClick={() => setIsBookingOpen(false)} className="text-gray-400 hover:text-softWhite">Close</button>
                            </div>
                            
                            <div className="grid gap-3 mb-8 max-h-64 overflow-y-auto">
                                {experience.slots.map(slot => (
                                    <div 
                                        key={slot.id}
                                        onClick={() => slot.seatsAvailable > 0 && setSelectedSlot(slot)}
                                        className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                                            selectedSlot?.id === slot.id 
                                            ? 'bg-cyan/10 border-cyan shadow-[0_0_15px_rgba(57,227,255,0.2)]' 
                                            : 'bg-glass border-glassBorder hover:bg-glassBorder'
                                        } ${slot.seatsAvailable === 0 ? 'opacity-40 pointer-events-none' : ''}`}
                                    >
                                        <div>
                                            <p className="font-semibold text-softWhite">{format(new Date(slot.time), 'EEE, MMM d • h:mm a')}</p>
                                            <p className="text-sm text-gray-500">₹{slot.price} / person</p>
                                        </div>
                                        {slot.seatsAvailable < 5 ? (
                                            <span className="text-xs text-red-400 font-bold bg-red-400/10 px-2 py-1 rounded">Only {slot.seatsAvailable} left</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">{slot.seatsAvailable} spots</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {selectedSlot && (
                                <div className="mb-8 p-4 bg-glass rounded-xl border border-glassBorder">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-gray-300">Guests</label>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-8 h-8 rounded-full bg-glassBorder flex items-center justify-center hover:bg-glass text-softWhite">-</button>
                                            <span className="text-lg font-bold w-6 text-center text-softWhite">{participants}</span>
                                            <button onClick={() => setParticipants(Math.min(selectedSlot.seatsAvailable, participants + 1))} className="w-8 h-8 rounded-full bg-glassBorder flex items-center justify-center hover:bg-glass text-softWhite">+</button>
                                        </div>
                                    </div>
                                    <div className="border-t border-glassBorder pt-4 flex justify-between items-end">
                                        <span className="text-gray-500 text-sm">Total</span>
                                        <span className="text-2xl font-bold text-softWhite">₹{(selectedSlot.price * participants).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <Button 
                                variant="primary" 
                                size="lg" 
                                disabled={!selectedSlot} 
                                onClick={handleInitiateBooking}
                                className="w-full py-4 text-lg"
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    )}

                    {(bookingStep === 'processing_init' || bookingStep === 'processing_final') && (
                        <div className="p-12 text-center flex flex-col items-center justify-center h-80">
                             <div className="relative w-20 h-20 mb-6">
                                <div className="absolute inset-0 border-4 border-cyan/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
                             </div>
                             <h3 className="text-xl font-bold mb-2 text-softWhite">
                                 {bookingStep === 'processing_init' ? 'Reserving your slot...' : 'Confirming booking...'}
                             </h3>
                             <p className="text-gray-500">Please wait</p>
                        </div>
                    )}

                    {bookingStep === 'razorpay' && selectedSlot && (
                        <div className="bg-white w-full h-full min-h-[500px] text-gray-800 flex flex-col">
                             <div className="bg-[#2b2f3e] px-6 py-4 flex items-center justify-between shrink-0">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic">R</div>
                                     <div className="text-white text-sm">
                                         <p className="font-bold">Razorpay</p>
                                         <p className="text-xs opacity-70">Trusted Business</p>
                                     </div>
                                 </div>
                                 <div className="text-white text-right">
                                     <p className="text-xs opacity-70">Payable Amount</p>
                                     <p className="font-bold">₹{(selectedSlot.price * participants).toLocaleString()}</p>
                                 </div>
                             </div>

                             <div className="p-6 flex-1 overflow-y-auto">
                                 {!paymentMethod ? (
                                     <>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Select Payment Method</p>
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => setPaymentMethod('upi')}
                                                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all group text-left"
                                            >
                                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">UPI / QR</p>
                                                    <p className="text-xs text-gray-500">GooglePay, PhonePe, Paytm</p>
                                                </div>
                                            </button>

                                            <button 
                                                onClick={() => setPaymentMethod('card')}
                                                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all group text-left"
                                            >
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">Card</p>
                                                    <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                                                </div>
                                            </button>

                                            <button 
                                                onClick={() => setPaymentMethod('netbanking')}
                                                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all group text-left"
                                            >
                                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">Netbanking</p>
                                                    <p className="text-xs text-gray-500">All Indian banks</p>
                                                </div>
                                            </button>
                                        </div>
                                     </>
                                 ) : (
                                     <div className="space-y-4">
                                        <button onClick={() => setPaymentMethod(null)} className="text-sm text-blue-600 font-bold mb-4 flex items-center gap-1">
                                            <ChevronLeft className="w-4 h-4" /> Change Method
                                        </button>

                                        {paymentMethod === 'upi' && (
                                            <div>
                                                <h4 className="font-bold mb-4">Enter UPI ID</h4>
                                                <input 
                                                    type="text" 
                                                    placeholder="example@upi" 
                                                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={paymentDetails.upiId}
                                                    onChange={e => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                                                />
                                                <p className="text-xs text-gray-500">A payment request will be sent to your UPI app.</p>
                                            </div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-3">
                                                <h4 className="font-bold mb-2">Card Details</h4>
                                                <input 
                                                    type="text" 
                                                    placeholder="Cardholder Name" 
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={paymentDetails.cardName}
                                                    onChange={e => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Card Number" 
                                                    maxLength={16}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={paymentDetails.cardNumber}
                                                    onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value.replace(/\D/g,'')})}
                                                />
                                                <div className="flex gap-3">
                                                    <input 
                                                        type="text" 
                                                        placeholder="MM/YY" 
                                                        className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={paymentDetails.expiry}
                                                        onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                                    />
                                                    <input 
                                                        type="password" 
                                                        placeholder="CVV" 
                                                        maxLength={3}
                                                        className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={paymentDetails.cvv}
                                                        onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g,'')})}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <div className="space-y-3">
                                                <h4 className="font-bold mb-2">Netbanking Login</h4>
                                                <select 
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                    value={paymentDetails.bank}
                                                    onChange={e => setPaymentDetails({...paymentDetails, bank: e.target.value})}
                                                >
                                                    <option value="">Choose a bank...</option>
                                                    <option value="hdfc">HDFC Bank</option>
                                                    <option value="sbi">SBI</option>
                                                    <option value="icici">ICICI Bank</option>
                                                    <option value="axis">Axis Bank</option>
                                                </select>
                                                <input 
                                                    type="text" 
                                                    placeholder="Customer ID / User ID" 
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={paymentDetails.customerId}
                                                    onChange={e => setPaymentDetails({...paymentDetails, customerId: e.target.value})}
                                                />
                                            </div>
                                        )}

                                        <button 
                                            onClick={handlePaymentSuccess}
                                            disabled={!isPaymentValid()}
                                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                                        >
                                            Pay ₹{(selectedSlot.price * participants).toLocaleString()}
                                        </button>
                                     </div>
                                 )}
                                 
                                 <div className="text-center mt-6">
                                     <button onClick={() => setBookingStep('slot')} className="text-xs text-gray-400 hover:text-gray-600">Cancel Payment</button>
                                 </div>
                             </div>
                        </div>
                    )}

                    {bookingStep === 'success' && (
                        <div className="p-12 text-center flex flex-col items-center justify-center h-96 relative overflow-hidden bg-midnight">
                             <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                             >
                                <ShieldCheck className="w-12 h-12 text-white" />
                             </motion.div>
                             <h3 className="text-3xl font-bold text-softWhite mb-2">You're In!</h3>
                             <p className="text-gray-500 mb-8 max-w-xs mx-auto">Booking confirmed for {experience.title}. A confirmation email has been sent.</p>
                             <div className="flex gap-4 w-full">
                                <Button onClick={() => navigate(`/chat/${experience.id}`)} variant="secondary" className="flex-1">Open Chat</Button>
                                <Button onClick={() => navigate('/profile')} variant="primary" className="flex-1">View Ticket</Button>
                             </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
