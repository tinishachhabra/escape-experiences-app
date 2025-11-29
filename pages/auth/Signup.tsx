

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../App';
import { backend } from '../../services/mockBackend';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Register the user with the mock backend
    await backend.signup(`${formData.firstName} ${formData.lastName}`, formData.email);
    
    // Simulate API delay
    login(); // Set auth state to true
    navigate('/onboarding');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-midnight overflow-hidden p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/90 to-midnight/50" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white tracking-tight">Join the Inner Circle</h2>
        <p className="text-center text-gray-400 mb-8">Access curated experiences, secret locations, and more.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text" 
                placeholder="First Name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan" 
                required 
             />
             <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text" 
                placeholder="Last Name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan" 
                required 
             />
          </div>
          <input 
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan" 
            required 
          />
          <input 
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password" 
            placeholder="Create Password" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan" 
            required 
          />

          <Button variant="primary" size="lg" loading={loading} className="w-full">
            Start Journey
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already a member? <Link to="/login" className="text-white font-semibold hover:text-cyan transition-colors">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};
