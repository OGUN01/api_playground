import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSlideOut(true);
    setTimeout(() => {
      setSlideOut(false);
      onClose();
    }, 200);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!', {
          icon: '🎉',
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #232323',
          },
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!', {
          icon: '👋',
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #232323',
          },
        });
      }
      handleClose();
    } catch (error: any) {
      toast.error(error.message, {
        icon: '❌',
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #232323',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      toast.success('Welcome to the community!', {
        icon: '🚀',
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #232323',
        },
      });
      handleClose();
    } catch (error: any) {
      toast.error(error.message, {
        icon: '❌',
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #232323',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />
      <div 
        className={`relative w-full max-w-md transform ${
          slideOut ? 'animate-out slide-out-to-bottom-4 fade-out-0' : 'animate-in slide-in-from-bottom-4 fade-in-0'
        } duration-200`}
      >
        <div className="bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x" style={{ padding: '1px' }}>
            <div className="absolute inset-0 bg-[#141414] rounded-2xl" />
          </div>

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <div className="p-6 pb-0">
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl animate-pulse" />
                  <div className="absolute inset-1 bg-[#141414] rounded-xl flex items-center justify-center">
                    <LogIn className="h-8 w-8 text-white animate-bounce" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  {isSignUp ? 'Join the Journey' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400">
                  {isSignUp 
                    ? 'Create an account to unlock all features' 
                    : 'Sign in to continue your adventure'}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-xl mb-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" 
                />
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#232323]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#141414] text-gray-400">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-400 group-focus-within:text-purple-400 transition-colors">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-400 group-focus-within:text-purple-400 transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-all duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}