import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface CreditModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditModalMobile({ isOpen, onClose }: CreditModalMobileProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50 animate-in fade-in-50 duration-200 sm:hidden"
    >
      <div className="w-full">
        <div className="bg-[#141414] rounded-t-2xl border-t border-x border-[#232323] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0 max-h-[90vh] overflow-y-auto">
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-2">
            <div className="w-12 h-1 bg-[#232323] rounded-full" />
          </div>

          {/* Header */}
          <div className="relative p-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] active:bg-[#2a2a2a] rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <h2 className="text-xl font-bold mb-1 text-white">Credits</h2>
            <p className="text-sm text-gray-400">Meet the creator behind Strawberry AI</p>
          </div>

          {/* Content */}
          <div className="px-4 pb-6">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 mb-4">
                <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://w0.peakpx.com/wallpaper/331/150/HD-wallpaper-sad-boy-hotaro-art-cartoon-sadboy-dark-hotarooreki-feeling-anime-thumbnail.jpg"
                    alt="Sam's Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Name with Animated Gradient */}
              <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text animate-gradient-x">
                <h3 className="text-3xl font-extrabold mb-1 text-transparent">Sam</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Full Stack Developer & AI Enthusiast</p>
              
              {/* Portfolio Link */}
              <a
                href="https://samvibes.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium active:opacity-90 transition-opacity"
              >
                Visit Portfolio
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                <button className="p-3 bg-[#1A1A1A] rounded-xl text-sm font-medium border border-[#232323] active:bg-[#232323] transition-colors">
                  GitHub
                </button>
                <button className="p-3 bg-[#1A1A1A] rounded-xl text-sm font-medium border border-[#232323] active:bg-[#232323] transition-colors">
                  Twitter
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#232323]">
              <p className="text-center text-xs text-gray-400">
                Made with ❤️ using React, TypeScript, and Tailwind CSS.<br />
                © 2024 Sam. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}