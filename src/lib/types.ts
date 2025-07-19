export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  attachments?: {
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}