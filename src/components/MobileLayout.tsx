import React, { useState } from 'react';
import { Menu, X, MessageSquare, Image as ImageIcon, FileText, Bot, Settings, User, LogOut } from 'lucide-react';
import { ImageGeneratorPage } from './ImageGeneratorPage';
import { DocumentAnalyzer } from './DocumentAnalyzer';
import { ToolsPage } from './ToolsPage';
import { AccountSettingsModal } from './AccountSettingsModal';
import { AuthModal } from './AuthModal';
import { CreditModal } from './CreditModal';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

interface MobileLayoutProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  onShowComingSoon: (feature: string, description: string) => void;
}

export function MobileLayout({ activeTool, setActiveTool, onShowComingSoon }: MobileLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    setIsSidebarOpen(false);
  };

  // Render active tool component
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'image-generator':
        return <ImageGeneratorPage setActiveTool={setActiveTool} />;
      case 'document-analyzer':
        return <DocumentAnalyzer setActiveTool={setActiveTool} />;
      default:
        return <ToolsPage onShowComingSoon={onShowComingSoon} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white sm:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-[#141414]/95 to-[#141414]/80 backdrop-blur-xl border-b border-[#232323]">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#232323] rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-[6px] bg-[#1A1A1A] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="font-bold">Strawberry AI</span>
          </div>

          {auth.currentUser ? (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center"
            >
              {auth.currentUser.photoURL ? (
                <img
                  src={auth.currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-gray-400" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300",
          isSidebarOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <div 
          className={cn(
            "absolute top-0 left-0 bottom-0 w-72 bg-[#141414] border-r border-[#232323] transition-transform duration-300 flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#232323] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#1A1A1A] flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold">Strawberry AI</h1>
                <p className="text-xs text-gray-400">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-[#232323] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Tools List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => handleToolSelect('chat')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                activeTool === 'chat' 
                  ? "bg-purple-500/20 text-purple-400"
                  : "hover:bg-[#1A1A1A]"
              )}
            >
              <MessageSquare className="h-5 w-5" />
              Chat
            </button>
            <button
              onClick={() => handleToolSelect('image-generator')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                activeTool === 'image-generator' 
                  ? "bg-purple-500/20 text-purple-400"
                  : "hover:bg-[#1A1A1A]"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              Image Generator
            </button>
            <button
              onClick={() => handleToolSelect('document-analyzer')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                activeTool === 'document-analyzer' 
                  ? "bg-purple-500/20 text-purple-400"
                  : "hover:bg-[#1A1A1A]"
              )}
            >
              <FileText className="h-5 w-5" />
              Document Analyzer
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="p-2 border-t border-[#232323]">
            <button
              onClick={() => setShowCreditModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <User className="h-5 w-5 text-gray-400" />
              Credits
            </button>
            {auth.currentUser && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A1A1A] text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {renderActiveTool()}
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <AccountSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </div>
  );
}