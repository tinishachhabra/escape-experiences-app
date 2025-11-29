

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../App';
import { backend } from '../../services/mockBackend';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate backend login
    await backend.login(email);
    
    login(); // Update global auth state
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-midnight overflow-hidden p-6">
      {/* Abstract Background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-cyan/20 rounded-full blur-[100px]" 
      />
      <motion.div 
         animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neonPurple/10 rounded-full blur-[120px]" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white tracking-tight">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Enter the portal to your next adventure.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@escape.app"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider ml-1 block">Password</label>
              <Link to="/forgot-password" className="text-xs text-cyan hover:text-white transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
              required
            />
          </div>

          <Button variant="primary" size="lg" loading={loading} className="w-full mt-4">
            Login
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          New here? <Link to="/signup" className="text-white font-semibold hover:text-cyan transition-colors">Create account</Link>
        </div>
      </motion.div>
    </div>
  );
};
