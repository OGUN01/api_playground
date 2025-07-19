import React, { useState, useEffect } from 'react';
import { Image, Sparkles, Download, RefreshCw, X, Loader2, ChevronLeft, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

import { generateImage, blobToDataUrl } from '../lib/imageGeneration';

interface ImageGeneratorPageProps {
  setActiveTool: (tool: string | null) => void;
}

export function ImageGeneratorPage({ setActiveTool }: { setActiveTool: (tool: string | null) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(true);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveTool(null);
    }, 200);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const enhancedPrompt = `${prompt.trim()}, high quality, photorealistic, detailed, 8k uhd, professional photography, masterpiece`;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setResults([]);

    try {
      const imageBlob = await generateImage(enhancedPrompt);
      const dataUrl = await blobToDataUrl(imageBlob);
      setGeneratedImage(dataUrl);
      setResults(prev => [dataUrl, ...prev]);
      toast.success('Image generated successfully!');
    } catch (error: any) {
      console.error('Error generating image:', error);
      setError(error.message || 'Failed to generate image');
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-[#0A0A0A] text-white transition-opacity duration-200",
      isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
    )}>
      {/* Header */}
      <div className="bg-gradient-to-b from-[#141414]/95 to-[#141414]/80 backdrop-blur-xl border-b border-[#232323] z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[#232323] rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rotate-6 transform hover:rotate-12 transition-transform duration-300">
                  <div className="w-full h-full rounded-[10px] bg-[#1A1A1A] flex items-center justify-center">
                    <Image className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">AI Image Generator</h1>
                  <p className="text-sm text-gray-400">Create unique images with AI</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTips(!showTips)}
              className={cn(
                "p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95",
                showTips ? "bg-purple-500/20 text-purple-400" : "hover:bg-[#232323] text-gray-400"
              )}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-[1fr,320px] gap-8">
          <div className="space-y-6">
            {/* Input Area */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <textarea
                disabled={isGenerating}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your image in detail (e.g., 'A serene Japanese garden at sunset with cherry blossoms, a small wooden bridge over a koi pond, and traditional lanterns casting a warm glow')..."
                className={cn(
                  "relative w-full bg-[#141414] border border-[#232323] rounded-xl px-6 py-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 placeholder:text-gray-500 resize-none text-base",
                  isGenerating && "opacity-50 cursor-not-allowed"
                )}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  "absolute bottom-4 right-4 px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95",
                  isGenerating || !prompt.trim()
                    ? "bg-[#232323] opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-1">Error</h4>
                  <p className="text-sm text-red-300/90">{error}</p>
                </div>
              </div>
            )}

            {/* Generated Image Display */}
            {generatedImage && (
              <div className="relative group max-w-2xl mx-auto">
                <div className="aspect-square rounded-xl overflow-hidden bg-[#141414] relative border border-[#232323] shadow-2xl">
                  <img 
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = 'generated-image.png';
                        link.click();
                      }}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Download className="h-6 w-6 text-white" />
                    </button>
                    <button 
                      onClick={handleGenerate}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <RefreshCw className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generation Loading State */}
            {isGenerating && (
              <div className="aspect-square rounded-xl overflow-hidden bg-[#141414] relative max-w-2xl mx-auto border border-[#232323]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin duration-1000"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 justify-center text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-purple-400">
                      Creating your masterpiece with Strawberry V0...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          {showTips && (
            <div className="space-y-6">
              <div className="bg-[#141414] rounded-xl border border-[#232323] p-6 hover:border-purple-500/30 transition-colors duration-300">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Tips for better results
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Be specific and detailed in your descriptions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Include style preferences (e.g., realistic, artistic, anime)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Specify mood and atmosphere
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Mention colors and composition
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Add context and setting details
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Use descriptive adjectives
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Consider perspective and framing
                  </li>
                </ul>
              </div>

              <div className="bg-[#141414] rounded-xl border border-[#232323] p-6 hover:border-purple-500/30 transition-colors duration-300">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  Example Prompts
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setPrompt("A serene Japanese garden at sunset with cherry blossoms, a small wooden bridge over a koi pond, and traditional lanterns casting a warm glow")}
                    className="w-full p-4 bg-[#1A1A1A] hover:bg-[#232323] rounded-lg text-sm text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Japanese garden at sunset
                  </button>
                  <button 
                    onClick={() => setPrompt("A cozy coffee shop interior in a cyberpunk style, with neon lights reflecting off rain-streaked windows, and holographic menus floating above marble counters")}
                    className="w-full p-4 bg-[#1A1A1A] hover:bg-[#232323] rounded-lg text-sm text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cyberpunk coffee shop
                  </button>
                  <button 
                    onClick={() => setPrompt("An enchanted forest clearing under a starlit sky, with bioluminescent mushrooms, fairy lights dancing between ancient trees, and a mystical fog rolling across the ground")}
                    className="w-full p-4 bg-[#1A1A1A] hover:bg-[#232323] rounded-lg text-sm text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Enchanted forest at night
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}