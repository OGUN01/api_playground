import React, { useState } from 'react';
import { FileText, Upload, Image as ImageIcon, File, Archive, AlertCircle, ChevronLeft, Info, Loader2, Bot, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface DocumentAnalyzerProps {
  setActiveTool: (tool: string | null) => void;
}

export function DocumentAnalyzer({ setActiveTool }: DocumentAnalyzerProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ filename: string; text: string; }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveTool(null);
    }, 200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' ||
                         file.type === 'text/plain';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}`);
      }
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}`);
      }

      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    try {
      for (const file of files) {
        // Convert file to data URL
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Process with Puter OCR
        const text = await window.puter.ai.img2txt(dataUrl);
        
        setResults(prev => [...prev, {
          filename: file.name,
          text: text || 'No text found in document'
        }]);

        toast.success(`Processed: ${file.name}`);
      }
    } catch (error: any) {
      console.error('Error processing files:', error);
      toast.error('Error processing files');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredResults = results.filter(result => 
    result.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "min-h-screen bg-[#0A0A0A] text-white transition-opacity duration-200",
      isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
    )}>
      {/* Header */}
      <div className="bg-gradient-to-b from-[#141414]/95 to-[#141414]/80 backdrop-blur-xl border-b border-[#232323] sticky top-0 z-20">
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
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                    Document Analyzer
                  </h1>
                  <p className="text-sm text-gray-400">Extract text from images and documents</p>
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
            {/* File Upload Area */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#141414] border border-[#232323] rounded-xl p-8 text-center">
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,text/plain"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
                <label
                  htmlFor="file-input"
                  className="block cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Support for images, PDFs, and text files (max 10MB)
                  </p>
                  <button className="px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors">
                    Select Files
                  </button>
                </label>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Selected Files</h3>
                  <button
                    onClick={processFiles}
                    disabled={isProcessing}
                    className={cn(
                      "px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200",
                      isProcessing
                        ? "bg-[#232323] cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Analyze Files
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-[#141414] rounded-lg border border-[#232323]"
                    >
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-5 w-5 text-blue-400" />
                      ) : file.type === 'application/pdf' ? (
                        <FileText className="h-5 w-5 text-red-400" />
                      ) : (
                        <File className="h-5 w-5 text-green-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="p-2 hover:bg-[#232323] rounded-lg transition-colors"
                      >
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Analysis Results</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search results..."
                      className="w-64 bg-[#1A1A1A] border border-[#232323] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-6 bg-[#141414] rounded-xl border border-[#232323]"
                    >
                      <h4 className="font-medium mb-4">{result.filename}</h4>
                      <pre className="text-sm text-gray-400 whitespace-pre-wrap font-mono bg-[#1A1A1A] p-4 rounded-lg border border-[#232323]">
                        {result.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          {showTips && (
            <div className="space-y-6">
              <div className="bg-[#141414] rounded-xl border border-[#232323] p-6 hover:border-purple-500/30 transition-colors duration-300">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-purple-400" />
                  Tips for better results
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Ensure images are clear and well-lit
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Text should be clearly visible and readable
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Avoid blurry or distorted images
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Keep file sizes under 10MB
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Supported formats: Images, PDFs, Text files
                  </li>
                </ul>
              </div>

              <div className="bg-[#141414] rounded-xl border border-[#232323] p-6 hover:border-purple-500/30 transition-colors duration-300">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-400" />
                  Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Extract text from images and documents
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Support for multiple file formats
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Batch processing capabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Search through extracted text
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Copy and export results
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}