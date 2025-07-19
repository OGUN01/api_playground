import React from 'react';
import { Bot, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThinkingAnimationProps {
  model: string;
}

export function ThinkingAnimation({ model }: ThinkingAnimationProps) {
  const isReasoningModel = model.includes('deepseek') || model.includes('thinking');

  return (
    <div className="flex items-center gap-3 text-gray-400 animate-in fade-in-50 duration-200">
      <div className="relative">
        {isReasoningModel ? (
          <Brain className="h-6 w-6 text-purple-400" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
        <div className="absolute -bottom-1 -right-1">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
      <p className={cn(
        "font-medium",
        isReasoningModel && "text-purple-400"
      )}>
        {isReasoningModel ? 'Thinking...' : 'Generating response...'}
      </p>
    </div>
  );
}