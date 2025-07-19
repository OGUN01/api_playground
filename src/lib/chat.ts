import type { Message } from './types';

export type ModelProvider = 'samuraiapi';

interface ChatResponse {
  content: string;
  error?: string;
}

// API configuration
const API_CONFIG = {
  samuraiapi: {
    url: 'https://samuraiapi.in/v1/chat/completions',
    apiKey: import.meta.env.VITE_SAMURAI_API_KEY || 'sk-bZwySr9L176ivKuLddL56IRrrXMl2QhCj6Q6AkI5hFT7C10B'
  }
} as const;

// No need for complex key encryption since we're using a single API

export async function sendChatMessage(
  messages: Message[],
  model: string,
  provider: ModelProvider,
  signal?: AbortSignal
): Promise<ChatResponse> {
  try {
    if (provider !== 'samuraiapi') {
      throw new Error('Unsupported provider');
    }

    const config = API_CONFIG.samuraiapi;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'Accept': 'application/json',
    };

    const payload = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    };

    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message ||
                          errorData.message ||
                          errorData.error ||
                          `Failed to get response (${response.status})`;
      console.error('Samurai API error:', errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response:', data);
      throw new Error('Invalid response format from API');
    }

    const content = data.choices[0].message.content;
    return {
      content: typeof content === 'string' ? content : JSON.stringify(content)
    };
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error.name === 'AbortError') {
      return { content: '', error: 'Request was cancelled' };
    }
    // Provide more user-friendly error messages
    const errorMessage = error.message.includes('API')
      ? error.message
      : 'Failed to get response from AI. Please try again.';
    return { content: '', error: errorMessage };
  }
}