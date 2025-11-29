
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export const ForgotPassword: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-midnight overflow-hidden p-6">
      <motion.div 
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-white">Reset Access</h2>
        <p className="text-center text-gray-400 mb-8">Enter your email to receive a recovery key.</p>

        {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input 
                type="email" 
                placeholder="explorer@escape.app"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
                required
                />
            </div>
            <Button variant="primary" size="lg" loading={loading} className="w-full mt-4">
                Send Recovery Key
            </Button>
            </form>
        ) : (
            <div className="text-center">
                <div className="mb-4 text-cyan text-lg font-medium">Check your inbox.</div>
                <p className="text-gray-400 text-sm mb-6">We've sent a magic link to your email.</p>
                <Link to="/login">
                    <Button variant="secondary" className="w-full">Return to Login</Button>
                </Link>
            </div>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};
