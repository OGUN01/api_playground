import React from 'react';
import { X } from 'lucide-react';
import { CreditModalMobile } from './CreditModalMobile';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditModal({ isOpen, onClose }: CreditModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <>
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm hidden sm:flex items-center justify-center z-50 animate-in fade-in-50 duration-200"
    >
      <div className="relative w-full max-w-md px-4">
        <div className="bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0">
          {/* Header */}
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-white">Credits</h2>
            <p className="text-gray-400">Meet the creator behind Strawberry AI</p>
          </div>

          {/* Content */}
          <div className="p-6 pt-0">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 mb-4">
                <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://w0.peakpx.com/wallpaper/331/150/HD-wallpaper-sad-boy-hotaro-art-cartoon-sadboy-dark-hotarooreki-feeling-anime-thumbnail.jpg"
                    alt="Sam's Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text animate-gradient-x">
                <h3 className="text-4xl font-extrabold mb-2 text-transparent">Sam</h3>
              </div>
              <p className="text-gray-400 mb-6">Full Stack Developer & AI Enthusiast</p>
              
              <a
                href="https://samvibes.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Visit Portfolio
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-[#232323]">
              <p className="text-center text-sm text-gray-400">
                Made with ❤️ using React, TypeScript, and Tailwind CSS.<br />
                © 2024 Sam. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreditModalMobile isOpen={isOpen} onClose={onClose} />
    </>
  );
}
