import React, { useState } from 'react';
import { Image, Sparkles, Download, RefreshCw, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface ImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slideOut, setSlideOut] = useState(false);
  const [results, setResults] = useState<string[]>([]);



  const handleClose = () => {
    window.history.back();
  };
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageBlob = await generateImage(prompt.trim());
      const dataUrl = await blobToDataUrl(imageBlob);
      setGeneratedImage(dataUrl);
      setResults(prev => [dataUrl, ...prev]);
      toast.success('Image generated successfully!');
    } catch (error: any) {
      console.error('Error generating image:', error);
      setError(error.message);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="relative w-full max-w-2xl px-4">
        <div className="bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden transform transition-all duration-200">
          {/* Header */}
          <div className="relative p-6 border-b border-[#232323]">
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#1A1A1A] flex items-center justify-center">
                  <Image className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Image Generator</h2>
                <p className="text-sm text-gray-400">Create unique images with AI</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Input Area */}
            <div className="mb-6">
              <div className="relative">
                <textarea
                  disabled={!isLoaded || isGenerating}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)} 
                  placeholder="Describe the image you want to generate..."
                  className={cn(
                    "w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 placeholder:text-gray-500 resize-none",
                    (isGenerating || !isLoaded) && "opacity-50 cursor-not-allowed"
                  )}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || !isLoaded}
                  className={cn(
                    "absolute bottom-3 right-3 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200",
                    isGenerating || !prompt.trim() || !isLoaded
                      ? "bg-[#232323] opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Generated Image Display */}
            {generatedImage && (
              <div className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-[#1A1A1A] relative">
                  <img 
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  /> 
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'generated-image.png';
                      link.click();
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    <Download className="h-6 w-6 text-white" />
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    <RefreshCw className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Generation Loading State */}
            {isGenerating && (
              <div className="aspect-square rounded-xl overflow-hidden bg-[#1A1A1A] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 justify-center text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-purple-400">
                      Generating your masterpiece...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Generations */}
            {results.length > 1 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Image className="h-4 w-4 text-purple-400" />
                  Previous Generations
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {results.slice(1).map((src, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
                      <img src={src} alt={`Generated ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = src;
                            link.download = `generated-image-${index + 1}.png`;
                            link.click();
                          }}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                        >
                          <Download className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#232323] sticky bottom-0 
              backdrop-blur-xl shadow-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Tips for better results
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Be specific and detailed in your descriptions</li>
                <li>• Include style preferences (e.g., realistic, cartoon, watercolor)</li>
                <li>• Specify lighting and atmosphere</li>
                <li>• Mention colors and composition</li>
                <li>• Add context and setting details</li>
                <li>• Use descriptive adjectives</li>
                <li>• Consider perspective and framing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}