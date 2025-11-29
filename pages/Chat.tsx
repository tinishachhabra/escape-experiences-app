import React, { useState, useEffect } from 'react';
import { Send, Users, ChevronLeft, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend } from '../services/mockBackend';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'me' | 'other';
    name: string;
    time: string;
}

export const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [eventName, setEventName] = useState('Experience Group');
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
      // Simulate loading specific chat context
      const loadContext = async () => {
          if (id) {
              const exp = await backend.getExperienceById(id);
              if (exp) setEventName(exp.title);
              const mems = await backend.getChatMembers(id);
              setMembers(mems);
              
              setMessages([
                  { id: '1', text: `Welcome to the ${exp?.title || 'Group'} chat!`, sender: 'other', name: 'System', time: 'Just now' },
                  { id: '2', text: 'Hey everyone! Excited for this.', sender: 'other', name: 'Sarah', time: '10:00 AM' }
              ]);
          } else {
              // Default view if no ID passed (e.g. from tab bar)
              // In real app, load list of active chats.
              setMessages([
                  { id: '1', text: 'Please select a confirmed booking from your profile to join its group chat.', sender: 'other', name: 'System', time: 'Now' }
              ]);
          }
      };
      loadContext();
  }, [id]);

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if(!input.trim()) return;
      
      const newMsg: ChatMessage = {
          id: Date.now().toString(),
          text: input,
          sender: 'me',
          name: 'You',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
      };
      
      setMessages([...messages, newMsg]);
      setInput('');
  };

  return (
    <div className="relative h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-2xl mx-auto border border-white/10 rounded-2xl bg-white/5 overflow-hidden mt-4 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div>
                    <h2 className="font-bold text-white truncate max-w-[200px]">{eventName}</h2>
                    {id && (
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> {members.length + 1} Online
                        </p>
                    )}
                </div>
            </div>
            {id && (
                <button 
                    onClick={() => setShowMembers(true)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <Users className="w-5 h-5 text-gray-300" />
                </button>
            )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-500 mb-1 px-1">{msg.name}</span>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.sender === 'me' 
                        ? 'bg-cyan text-midnight rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 px-1">{msg.time}</span>
                </div>
            ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2 shrink-0">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={id ? "Type a message..." : "Select a booking first..."}
                disabled={!id}
                className="flex-1 bg-midnight border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan disabled:opacity-50"
            />
            <button type="submit" disabled={!id} className="p-2 bg-gradient-to-r from-cyan to-neonPurple rounded-xl text-midnight hover:opacity-90 transition-opacity disabled:opacity-50">
                <Send className="w-5 h-5" />
            </button>
        </form>

        {/* Members Sidebar / Modal */}
        <AnimatePresence>
            {showMembers && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm"
                        onClick={() => setShowMembers(false)}
                    />
                    <motion.div 
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }}
                        className="absolute top-0 right-0 bottom-0 w-64 bg-[#151926] border-l border-white/10 z-20 shadow-2xl p-4 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Members</h3>
                            <button onClick={() => setShowMembers(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-xs text-gray-500 font-bold uppercase">Host</h4>
                            {members.filter(m => m.role === 'host').map(m => (
                                <div key={m.id} className="flex items-center gap-3">
                                    <img src={m.avatar} className="w-10 h-10 rounded-full border border-cyan" alt="" />
                                    <div>
                                        <p className="text-sm font-bold text-white">{m.name}</p>
                                        <p className="text-xs text-cyan">Organizer</p>
                                    </div>
                                </div>
                            ))}

                            <div className="h-px bg-white/10 my-2" />
                            
                            <h4 className="text-xs text-gray-500 font-bold uppercase">Attendees</h4>
                            {members.filter(m => m.role !== 'host').map(m => (
                                <div key={m.id} className="flex items-center gap-3">
                                    <img src={m.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                    <p className="text-sm text-gray-300">{m.name}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </div>
  );
};