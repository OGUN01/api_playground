import type { Model } from './models';
import React from 'react';
import { Brain, Bot, Zap, Cpu, Network, Lightbulb, Sparkles, Star } from 'lucide-react';

interface ApiModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  supported_endpoint_types: string[];
}

interface ModelsResponse {
  data: ApiModel[];
  success: boolean;
}

// Configuration
const API_CONFIG = {
  url: 'https://samuraiapi.in/v1',
  apiKey: import.meta.env.VITE_SAMURAI_API_KEY || 'sk-bZwySr9L176ivKuLddL56IRrrXMl2QhCj6Q6AkI5hFT7C10B'
};

// Cache for models to avoid repeated API calls
let cachedModels: Model[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 0; // Disable cache for debugging - set to 5 * 60 * 1000 for 5 minutes

// Test message for model validation
const TEST_MESSAGE = "hi";

// Known working models from comprehensive testing
const WORKING_MODELS = [
  'groq/moonshotai/kimi-k2-instruct',
  'provider3-gemini-2.0-flash',
  'provider3-gemini-2.0-flash-lite',
  'provider3-gemini-2.5-flash-preview-04-17',
  'provider3-gemini-2.5-flash-preview-05-20',
  'provider3-gemini-2.5-pro-preview-05-06',
  'provider3-gemini-2.5-pro-preview-06-05',
  'provider4-deepseek/deepseek-chat-v3-0324:free',
  'provider4-deepseek/deepseek-r1:free',
  'SamuraiX-1776'
];

// Only test known working models to save time
function shouldTestModel(modelId: string): boolean {
  return WORKING_MODELS.includes(modelId);
}

// Helper function to get appropriate icon for model
function getModelIcon(modelId: string) {
  const id = modelId.toLowerCase();
  
  if (id.includes('gpt') || id.includes('openai')) {
    return <Brain className="h-5 w-5 text-blue-400" />;
  }
  if (id.includes('claude')) {
    return <Brain className="h-5 w-5 text-purple-400" />;
  }
  if (id.includes('gemini')) {
    return <Zap className="h-5 w-5 text-yellow-400" />;
  }
  if (id.includes('deepseek')) {
    return <Brain className="h-5 w-5 text-indigo-400" />;
  }
  if (id.includes('grok')) {
    return <Star className="h-5 w-5 text-green-400" />;
  }
  if (id.includes('kimi') || id.includes('moonshot')) {
    return <Brain className="h-5 w-5 text-blue-400" />;
  }
  if (id.includes('mistral') || id.includes('mixtral')) {
    return <Bot className="h-5 w-5 text-purple-400" />;
  }
  if (id.includes('qwen')) {
    return <Network className="h-5 w-5 text-green-400" />;
  }
  if (id.includes('llama')) {
    return <Cpu className="h-5 w-5 text-orange-400" />;
  }
  if (id.includes('sonar')) {
    return <Lightbulb className="h-5 w-5 text-cyan-400" />;
  }
  
  return <Brain className="h-5 w-5 text-gray-400" />;
}

// Helper function to generate human-readable name
function generateModelName(modelId: string): string {
  // Remove provider prefixes and clean up the name
  let name = modelId
    .replace(/^provider\d+-/, '')
    .replace(/\(clinesp\)$/, '')
    .replace(/^groq\/moonshotai\//, '')
    .replace(/^deepseek\//, '')
    .replace(/^mistralai\//, '')
    .replace(/^anthropic\//, '')
    .replace(/^google\//, '')
    .replace(/^openai\//, '');

  // Convert to title case and clean up
  name = name
    .split(/[-_\/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Special cases
  if (name.includes('Gpt')) name = name.replace('Gpt', 'GPT');
  if (name.includes('Ai')) name = name.replace('Ai', 'AI');
  if (name.includes('Vl')) name = name.replace('Vl', 'VL');
  if (name.includes('Llama')) name = name.replace('Llama', 'LLaMA');
  
  return name;
}

// Helper function to generate description
function generateDescription(modelId: string): string {
  const id = modelId.toLowerCase();
  
  if (id.includes('mini') || id.includes('small')) {
    return 'Compact and efficient model for quick responses';
  }
  if (id.includes('large') || id.includes('pro')) {
    return 'Advanced model with enhanced capabilities';
  }
  if (id.includes('thinking') || id.includes('reasoning')) {
    return 'Specialized model for complex reasoning tasks';
  }
  if (id.includes('vision') || id.includes('vl')) {
    return 'Vision-language model with multimodal capabilities';
  }
  if (id.includes('coder') || id.includes('code')) {
    return 'Specialized model for coding and development';
  }
  if (id.includes('instruct')) {
    return 'Instruction-following model with high accuracy';
  }
  if (id.includes('chat')) {
    return 'Conversational AI model for natural dialogue';
  }
  if (id.includes('preview') || id.includes('beta')) {
    return 'Experimental model with cutting-edge features';
  }
  if (id.includes('turbo')) {
    return 'High-speed model optimized for performance';
  }
  if (id.includes('sonar')) {
    return 'Search-enhanced model with real-time information';
  }
  
  return 'Advanced AI model with versatile capabilities';
}

// Test if a model is working and return detailed result
async function testModel(modelId: string): Promise<{isWorking: boolean, response?: string, error?: string}> {
  console.log(`🔍 Testing model: ${modelId}`);

  try {
    const response = await fetch(`${API_CONFIG.url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: TEST_MESSAGE
          }
        ],
        max_tokens: 100,
        temperature: 0.1
      }),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`❌ ${modelId} failed with status ${response.status}: ${errorText}`);
      return { isWorking: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Check if we got a valid response
    if (content && typeof content === 'string' && content.length > 0) {
      console.log(`✅ ${modelId} is working! Response: "${content.substring(0, 50)}..."`);
      return { isWorking: true, response: content };
    }

    console.warn(`❌ ${modelId} returned invalid response:`, content);
    return { isWorking: false, error: 'Invalid response format' };
  } catch (error: any) {
    console.warn(`❌ ${modelId} test failed:`, error.message);
    return { isWorking: false, error: error.message };
  }
}

// Fetch available models from API
async function fetchAvailableModels(): Promise<ApiModel[]> {
  try {
    const response = await fetch(`${API_CONFIG.url}/models`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data: ModelsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

// Main function to test ALL models and return only working ones
export async function fetchAndTestModels(): Promise<Model[]> {
  // Check cache first
  const now = Date.now();
  if (cachedModels && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached models:', cachedModels.length);
    return cachedModels;
  }

  console.log('🚀 Starting comprehensive model testing...');

  try {
    // Fetch all available models
    const apiModels = await fetchAvailableModels();
    console.log(`📊 Found ${apiModels.length} total models to test`);

    if (apiModels.length === 0) {
      console.warn('⚠️ No models found, returning fallback');
      return [{
        id: 'groq/moonshotai/kimi-k2-instruct',
        name: 'Kimi K2 Instruct',
        provider: 'Moonshot AI',
        apiProvider: 'samuraiapi',
        description: 'Advanced instruction-following model with excellent reasoning capabilities',
        supportsLiveSearch: true,
        icon: <Brain className="h-5 w-5 text-blue-400" />,
      }];
    }

    // Filter for known working models only
    const workingApiModels = apiModels.filter(model => shouldTestModel(model.id));
    const workingModels: Model[] = [];

    console.log(`🧪 Found ${workingApiModels.length} known working models out of ${apiModels.length} total`);
    console.log('📋 Working API models found:', workingApiModels.map(m => m.id));
    console.log(`🚀 Testing confirmed working models with message: "${TEST_MESSAGE}"`);

    // Test known working models in parallel for speed
    const testPromises = workingApiModels.map(async (apiModel) => {
      const result = await testModel(apiModel.id);
      return { apiModel, result };
    });

    const testResults = await Promise.all(testPromises);

    // Add working models to our list
    for (const { apiModel, result } of testResults) {
      if (result.isWorking) {
        const model: Model = {
          id: apiModel.id,
          name: generateModelName(apiModel.id),
          provider: 'Samurai API',
          apiProvider: 'samuraiapi' as const,
          description: generateDescription(apiModel.id),
          supportsLiveSearch: true,
          icon: getModelIcon(apiModel.id),
          isReasoning: apiModel.id.toLowerCase().includes('thinking') ||
                      apiModel.id.toLowerCase().includes('reasoning') ||
                      apiModel.id.toLowerCase().includes('r1') ||
                      apiModel.id.toLowerCase().includes('samuraix'),
        };
        workingModels.push(model);
        console.log(`✅ Confirmed working model: ${model.name} (${apiModel.id})`);
      } else {
        console.warn(`⚠️ Previously working model now failing: ${apiModel.id}`);
      }
    }

    console.log(`🎉 Testing complete! Found ${workingModels.length} working models out of ${apiModels.length} total`);

    // Log working models with detailed info
    console.log('✅ Working models:');
    workingModels.forEach((model, index) => {
      console.log(`  ${index + 1}. ${model.name} (${model.id})`);
      console.log(`      Provider: ${model.provider}`);
      console.log(`      Description: ${model.description}`);
    });

    // Cache the results
    cachedModels = workingModels.length > 0 ? workingModels : [{
      id: 'groq/moonshotai/kimi-k2-instruct',
      name: 'Kimi K2 Instruct',
      provider: 'Moonshot AI',
      apiProvider: 'samuraiapi',
      description: 'Advanced instruction-following model with excellent reasoning capabilities',
      supportsLiveSearch: true,
      icon: <Brain className="h-5 w-5 text-blue-400" />,
    }];
    lastFetchTime = now;

    return cachedModels;
  } catch (error) {
    console.error('❌ Error in comprehensive model testing:', error);

    // Return fallback model if everything fails
    return [{
      id: 'groq/moonshotai/kimi-k2-instruct',
      name: 'Kimi K2 Instruct',
      provider: 'Moonshot AI',
      apiProvider: 'samuraiapi',
      description: 'Advanced instruction-following model with excellent reasoning capabilities',
      supportsLiveSearch: true,
      icon: <Brain className="h-5 w-5 text-blue-400" />,
    }];
  }
}

// Clear cache (useful for manual refresh)
export function clearModelCache(): void {
  console.log('🗑️ Clearing model cache');
  cachedModels = null;
  lastFetchTime = 0;
}
