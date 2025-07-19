import React from 'react';
import { Brain } from 'lucide-react';
import type { ReactNode } from 'react';
import { fetchAndTestModels } from './modelFetcher';

export type ModelProvider = 'samuraiapi';

export interface Model {
  id: string;
  name: string;
  provider: string;
  apiProvider: ModelProvider;
  description: string;
  supportsLiveSearch: boolean;
  icon: ReactNode;
  isReasoning?: boolean;
  thinkingSteps?: string[];
  comingSoon?: boolean;
}

// Fallback model in case dynamic loading fails
const fallbackModel: Model = {
  id: 'groq/moonshotai/kimi-k2-instruct',
  name: 'Kimi K2 Instruct',
  provider: 'Moonshot AI',
  apiProvider: 'samuraiapi',
  description: 'Advanced instruction-following model with excellent reasoning capabilities',
  supportsLiveSearch: true,
  icon: <Brain className="h-5 w-5 text-blue-400" />,
};

// Dynamic models array - will be populated by the model fetcher
let dynamicModels: Model[] = [fallbackModel];
let isLoading = false;
let hasLoaded = false;

// Get current models (synchronous)
export function getModels(): Model[] {
  return dynamicModels;
}

// Load models dynamically (asynchronous)
export async function loadModels(): Promise<Model[]> {
  if (hasLoaded || isLoading) {
    return dynamicModels;
  }

  isLoading = true;

  try {
    console.log('🔄 Loading available models...');
    const fetchedModels = await fetchAndTestModels();

    if (fetchedModels.length > 0) {
      dynamicModels = fetchedModels;
      console.log(`✅ Loaded ${fetchedModels.length} working models`);
    } else {
      console.warn('⚠️ No models found, using fallback');
      dynamicModels = [fallbackModel];
    }

    hasLoaded = true;
  } catch (error) {
    console.error('❌ Failed to load models:', error);
    dynamicModels = [fallbackModel];
  } finally {
    isLoading = false;
  }

  return dynamicModels;
}

// Check if models are currently loading
export function isLoadingModels(): boolean {
  return isLoading;
}

// Force reload models
export async function reloadModels(): Promise<Model[]> {
  console.log('🔄 Force reloading models...');
  hasLoaded = false;
  isLoading = false;
  dynamicModels = [fallbackModel]; // Reset to fallback while loading
  return loadModels();
}

// Legacy export for backward compatibility
export const models = dynamicModels;