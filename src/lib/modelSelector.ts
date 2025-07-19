import { models, type Model } from './models';

interface ModelScore {
  model: Model;
  score: number;
}

function scoreModelForQuery(model: Model, query: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // Base score for all models
  score += model.supportsLiveSearch ? 10 : 0;
  
  // Code-related queries
  if (queryLower.includes('code') || 
      queryLower.includes('programming') || 
      queryLower.includes('function') ||
      queryLower.includes('debug')) {
    score += model.id.includes('codestral') ? 30 : 0;
  }

  // Complex reasoning queries
  if (queryLower.includes('explain') || 
      queryLower.includes('why') || 
      queryLower.includes('how') ||
      queryLower.includes('analyze')) {
    score += model.isReasoning ? 25 : 0;
  }

  // Quick response needs
  if (queryLower.includes('quick') || 
      queryLower.includes('fast') || 
      queryLower.includes('simple')) {
    score += model.name.toLowerCase().includes('flash') ? 20 : 0;
  }

  // Visual or multimodal queries
  if (queryLower.includes('image') || 
      queryLower.includes('picture') || 
      queryLower.includes('visual')) {
    score += model.name.toLowerCase().includes('vl') ? 25 : 0;
  }

  // Penalize coming soon models
  score -= model.comingSoon ? 1000 : 0;

  return score;
}

export function selectBestModel(query: string): Model {
  const availableModels = models.filter(m => !m.comingSoon);
  
  const modelScores: ModelScore[] = availableModels.map(model => ({
    model,
    score: scoreModelForQuery(model, query)
  }));

  // Sort by score descending
  modelScores.sort((a, b) => b.score - a.score);

  // Return the highest scoring model
  return modelScores[0].model;
}