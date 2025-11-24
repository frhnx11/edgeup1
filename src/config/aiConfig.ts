// AI Configuration
export const AI_CONFIG = {
  // Default provider - can be 'openai' or 'claude'
  defaultProvider: 'openai' as 'openai' | 'claude',
  
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper responses
    maxTokens: 2000,
    temperature: 0.7,
    streamEnabled: true
  },
  
  // Claude Configuration
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
    model: 'claude-3-opus-20240229', // or 'claude-3-sonnet-20240229' for faster responses
    maxTokens: 2000,
    temperature: 0.7,
    streamEnabled: true
  },
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2
  },
  
  // Cache configuration
  cache: {
    enabled: true,
    ttlMs: 5 * 60 * 1000, // 5 minutes
    maxSize: 100 // Maximum number of cached responses
  }
};

// Helper to get current AI provider config
export function getAIProviderConfig() {
  const provider = AI_CONFIG.defaultProvider;
  return {
    provider,
    ...AI_CONFIG[provider]
  };
}