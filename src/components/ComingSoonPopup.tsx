import React, { useState } from 'react';
import { X, Sparkles, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface ComingSoonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description: string;
}

export function ComingSoonPopup({ isOpen, onClose, feature, description }: ComingSoonPopupProps) {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSlideOut(true);
    setTimeout(() => {
      setSlideOut(false);
      onClose();
    }, 200);
  };

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setNotified(true);
    toast.success('You will be notified when this feature launches!', {
      icon: '🎉',
      style: {
        background: '#1A1A1A',
        color: '#fff',
        border: '1px solid #232323',
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md px-4">
        <div 
          className={cn(
            "bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden transform transition-all duration-200",
            slideOut ? 'animate-out slide-out-to-bottom-4 fade-out-0' : 'animate-in slide-in-from-bottom-4 fade-in-0'
          )}
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x" style={{ padding: '1px' }}>
            <div className="absolute inset-0 bg-[#141414] rounded-2xl" />
          </div>

          {/* Content */}
          <div className="relative p-6">
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 mb-4">
                <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                {feature} <span className="text-purple-400">Coming Soon</span>
              </h2>
              <p className="text-gray-300 mb-6">{description}</p>

              {notified ? (
                <div className="w-full p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-center gap-2 text-purple-400 font-medium">
                    <Bell className="h-5 w-5" />
                    We'll notify you when it's ready!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNotifyMe} className="w-full space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to get notified"
                    className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Bell className="h-5 w-5" />
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}