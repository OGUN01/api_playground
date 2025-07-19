import React, { useState, useEffect } from 'react';
import { Search, Bot, Sparkles, Brain, Zap, Cpu, Network, Lightbulb, ChevronRight, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { getModels, type Model } from '../lib/models';
import { selectBestModel } from '../lib/modelSelector';
import { ComingSoonPopup } from './ComingSoonPopup';

interface ModelSelectProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  isThinking?: boolean;
  availableModels?: Model[];
}

export function ModelSelect({ isOpen, onClose, selectedModel, onSelectModel, isThinking, availableModels }: ModelSelectProps) {
  const models = availableModels || getModels();
  const [modelSearch, setModelSearch] = useState('');
  const [showThinkingSteps, setShowThinkingSteps] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Model[]>(models);
  const [slideOut, setSlideOut] = useState(false);
  const [autoSelectEnabled, setAutoSelectEnabled] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState<{
    isOpen: boolean;
    feature: string;
    description: string;
  }>({ isOpen: false, feature: '', description: '' });

  // Update search results when models change
  useEffect(() => {
    console.log('ModelSelect: Models updated, count:', models.length);
    setSearchResults(models);
  }, [models]);

  // Enhanced search functionality
  useEffect(() => {
    console.log('ModelSelect: Search effect triggered, models count:', models.length);
    console.log('ModelSelect: Available models:', models.map(m => m.name));

    const query = modelSearch.toLowerCase();
    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query) ||
      (model.isReasoning && query.includes('reason')) ||
      (model.supportsLiveSearch && query.includes('live'))
    );

    console.log('ModelSelect: Filtered models:', filtered.length, filtered.map(m => m.name));

    // Sort results to prioritize matches
    const sorted = filtered.sort((a, b) => {
      // Coming soon models at top
      if (a.comingSoon && !b.comingSoon) return -1;
      if (!a.comingSoon && b.comingSoon) return 1;
      
      // Default model (Claude 3.5) next
      if (a.id === 'claude-3-5-sonnet-20240620') return -1;
      if (b.id === 'claude-3-5-sonnet-20240620') return 1;
      
      // Exact name matches
      const aNameMatch = a.name.toLowerCase().includes(query);
      const bNameMatch = b.name.toLowerCase().includes(query);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return 0;
    });

    setSearchResults(sorted);
  }, [modelSearch]);

  // Handle auto-select when enabled
  const handleAutoSelect = React.useCallback((query: string) => {
    if (!autoSelectEnabled) return;
    const bestModel = selectBestModel(query);
    onSelectModel(bestModel.id);
  }, [autoSelectEnabled, onSelectModel]);

  // Expose auto-select handler to parent
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__handleAutoSelect = handleAutoSelect;
    }
  }, [handleAutoSelect]);
  if (!isOpen) return null;

  const handleClose = () => {
    setSlideOut(true);
    setTimeout(() => {
      setSlideOut(false);
      onClose();
    }, 200);
  };

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.description.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl px-4">
        {/* Thinking Steps Sidebar */}
        {showThinkingSteps && (
          <div className="absolute -right-80 top-0 w-72 bg-[#141414] rounded-xl border border-[#232323] shadow-2xl p-4 animate-in slide-in-from-right-2 duration-200">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Thinking Process
            </h3>
            <div className="space-y-3">
              {models.find(m => m.id === showThinkingSteps)?.thinkingSteps?.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border text-sm transition-all duration-200",
                    isThinking && index === 0 
                      ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                      : "bg-[#1A1A1A] border-[#232323]",
                    isThinking && "animate-pulse"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Modal */}
        <div 
          className={cn(
            "bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden transform transition-all duration-200",
            slideOut ? 'animate-out slide-out-to-bottom-4 fade-out-0' : 'animate-in slide-in-from-bottom-4 fade-in-0'
          )}
        >
          {/* Header */}
          <div className="relative p-6 pb-0">
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#1A1A1A] flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Select AI Model</h2>
                <p className="text-sm text-gray-400">Choose the perfect model for your needs</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search models by name, provider, or description..."
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="p-6">
            {/* Auto-select Toggle */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-[#1A1A1A] rounded-xl border border-[#232323]">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Turn on the Magic</p>
                <p className="text-xs text-gray-400">Let AI choose the best model for your query</p>
              </div>
              <div className="ml-auto">
                <div
                  onClick={() => setAutoSelectEnabled(!autoSelectEnabled)}
                  className={cn(
                    "w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-200",
                    autoSelectEnabled ? "bg-purple-500" : "bg-[#232323] hover:bg-[#2A2A2A]"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-200",
                      autoSelectEnabled 
                        ? "bg-white translate-x-5" 
                        : "bg-gray-400 translate-x-0"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Model List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-[#232323] scrollbar-track-transparent">
              {searchResults.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    if (model.comingSoon) {
                      setShowComingSoon({
                        isOpen: true,
                        feature: `${model.name}`,
                        description: `${model.name} is coming soon! This advanced AI model will bring new capabilities to enhance your chat experience.`
                      });
                    } else {
                      onSelectModel(model.id);
                      handleClose();
                    }
                  }}
                  disabled={model.comingSoon}
                  onMouseEnter={() => model.isReasoning && setShowThinkingSteps(model.id)}
                  onMouseLeave={() => setShowThinkingSteps(null)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group relative hover:bg-[#1A1A1A]",
                    model.id === selectedModel
                      ? "bg-purple-500/10 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      : "hover:bg-[#1A1A1A] border border-transparent hover:border-[#232323]",
                    model.comingSoon && "opacity-50 cursor-not-allowed hover:bg-transparent",
                    model.id === 'claude-3-5-sonnet-20240620' && !selectedModel && "bg-purple-500/5 border-purple-500/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl border border-[#232323] flex items-center justify-center transition-all duration-200 group-hover:scale-110",
                    model.id === selectedModel ? "bg-purple-500/20" : "bg-[#1A1A1A]"
                  )}>
                    {model.icon}
                    {model.id === 'claude-3-5-sonnet-20240620' && !selectedModel && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-purple-500 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{model.name}</span>
                      {model.comingSoon && (
                        <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-400 font-medium">
                          Coming Soon
                        </span>
                      )}
                      {model.isReasoning && (
                        <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-400 font-medium">
                          Reasoning
                        </span>
                      )}
                      <span className="text-xs text-gray-500">• {model.provider}</span>
                    </div>
                    <p className="text-sm text-gray-400">{model.description}</p>
                  </div>
                  {!model.supportsLiveSearch && (
                    <span className="absolute top-2 right-2 text-xs text-gray-400 px-2 py-1 bg-[#232323] rounded-full">
                      Live Search not supported
                    </span>
                  )}
                  {model.isReasoning && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ComingSoonPopup
        isOpen={showComingSoon.isOpen}
        onClose={() => setShowComingSoon(prev => ({ ...prev, isOpen: false }))}
        feature={showComingSoon.feature}
        description={showComingSoon.description}
      />
    </div>
  );
}