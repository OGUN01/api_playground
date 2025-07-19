import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function LiveSearchAnimation() {
  return (
    <div className="flex items-center gap-2 text-purple-400 animate-in fade-in-0 duration-200">
      <div className="relative">
        <Search className="h-5 w-5" />
        <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm font-medium">Live Search Active</span>
    </div>
  );
}