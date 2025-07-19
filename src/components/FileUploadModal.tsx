import React, { useState, useRef } from 'react';
import { X, Upload, File, FileText, Image as ImageIcon, Archive, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const MAX_FILES = 4;

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const ALLOWED_TYPES = {
  'image/*': {
    icon: <ImageIcon className="h-5 w-5 text-blue-400" />,
    label: 'Images',
  },
  'application/pdf': {
    icon: <FileText className="h-5 w-5 text-red-400" />,
    label: 'PDF Documents',
  },
  'application/zip': {
    icon: <Archive className="h-5 w-5 text-yellow-400" />,
    label: 'ZIP Archives',
  },
  'text/*': {
    icon: <File className="h-5 w-5 text-green-400" />,
    label: 'Text Files',
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUploadModal({ isOpen, onClose, onUpload }: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSlideOut(true);
    setTimeout(() => {
      setSlideOut(false);
      onClose();
    }, 200);
  };

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
      return false;
    }

    const isValidType = Object.keys(ALLOWED_TYPES).some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast.error(`File type ${file.type} is not supported.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files at a time`, {
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #232323',
        },
      });
      return;
    }

    const validFiles = Array.from(selectedFiles).filter(validateFile);
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    onUpload(files);
    handleClose();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl px-4">
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
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Upload Files</h2>
                <p className="text-sm text-gray-400">Share files with the AI assistant</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Upload Area */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl p-8 transition-colors text-center",
                isDragging ? "border-purple-500 bg-purple-500/10" : "border-[#232323]",
                files.length > 0 ? "bg-[#1A1A1A]" : "bg-transparent"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                accept={Object.keys(ALLOWED_TYPES).join(',')}
              />

              {files.length === 0 ? (
                <div>
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2 text-white">Drop up to {MAX_FILES} files here or click to upload</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Support for images, PDFs, text files, and ZIP archives
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors"
                  >
                    Select Files
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 bg-[#141414] rounded-lg border border-[#232323] group"
                    >
                      {Object.entries(ALLOWED_TYPES).find(([type]) => 
                        type.endsWith('/*') 
                          ? file.type.startsWith(type.replace('/*', ''))
                          : file.type === type
                      )?.[1].icon}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-[#232323] rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 border border-[#232323] hover:bg-[#1A1A1A] rounded-lg text-sm font-medium transition-colors"
                    >
                      Add More Files ({MAX_FILES - files.length} remaining)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* File Type Info */}
            <div className="mt-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#232323]">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-white">
                <AlertCircle className="h-4 w-4 text-purple-400" />
                Supported File Types
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ALLOWED_TYPES).map(([type, { icon, label }]) => (
                  <div key={type} className="flex items-center gap-2 text-sm text-gray-400">
                    {icon}
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 border border-[#232323] hover:bg-[#1A1A1A] rounded-lg text-sm font-medium text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={files.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}