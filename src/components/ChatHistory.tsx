import React from 'react';
import { MessageCircle as Message, Bot, Trash2, Calendar } from 'lucide-react';
import type { ChatHistory } from '../lib/types';

interface ChatHistoryProps {
  history: ChatHistory[];
  onSelectChat: (chat: ChatHistory) => void;
}

export function ChatHistoryView({ history, onSelectChat }: ChatHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
          <Message className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No chat history yet</h3>
        <p className="text-gray-400">Start a new chat to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className="w-full bg-[#141414] hover:bg-[#1A1A1A] border border-[#232323] rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium mb-1 truncate">{chat.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                {new Date(chat.createdAt).toLocaleDateString()}
                <span className="text-gray-600">•</span>
                <span>{chat.messages.length} messages</span>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#232323] rounded-lg transition-all duration-200">
              <Trash2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
}