import { retryWithBackoff } from '../utils/retryWithBackoff';
import { AI_CONFIG } from '../config/aiConfig';

interface AIConfig {
  provider: 'openai' | 'claude';
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private config: AIConfig;
  private defaultModels = {
    openai: 'gpt-4-turbo-preview',
    claude: 'claude-3-opus-20240229'
  };

  constructor(config: AIConfig) {
    this.config = {
      ...config,
      model: config.model || this.defaultModels[config.provider],
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7
    };
  }

  async generateResponse(messages: AIMessage[]): Promise<string> {
    return retryWithBackoff(
      async () => {
        if (this.config.provider === 'openai') {
          return this.generateOpenAIResponse(messages);
        } else if (this.config.provider === 'claude') {
          return this.generateClaudeResponse(messages);
        }
        throw new Error('Invalid AI provider');
      },
      {
        maxAttempts: AI_CONFIG.retry.maxAttempts,
        initialDelayMs: AI_CONFIG.retry.delayMs,
        backoffMultiplier: AI_CONFIG.retry.backoffMultiplier,
        onRetry: (attempt, error) => {
          console.log(`AI request failed, retrying attempt ${attempt}:`, error);
        }
      }
    );
  }

  private async generateOpenAIResponse(messages: AIMessage[]): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  private async generateClaudeResponse(messages: AIMessage[]): Promise<string> {
    try {
      // Convert messages format for Claude API
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          system: systemMessage,
          messages: userMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  // Stream response for better UX
  async *streamResponse(messages: AIMessage[]): AsyncGenerator<string> {
    if (this.config.provider === 'openai') {
      yield* this.streamOpenAIResponse(messages);
    } else if (this.config.provider === 'claude') {
      yield* this.streamClaudeResponse(messages);
    }
  }

  private async *streamOpenAIResponse(messages: AIMessage[]): AsyncGenerator<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) yield content;
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenAI Stream Error:', error);
      throw error;
    }
  }

  private async *streamClaudeResponse(messages: AIMessage[]): AsyncGenerator<string> {
    // Claude doesn't support streaming in the same way, so we'll simulate it
    const response = await this.generateClaudeResponse(messages);
    const words = response.split(' ');
    
    for (const word of words) {
      yield word + ' ';
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
}

// Factory function to create AI service
export function createAIService(provider: 'openai' | 'claude', apiKey: string): AIService {
  // Get API key from environment or parameter
  const key = apiKey || 
    (provider === 'openai' ? import.meta.env.VITE_OPENAI_API_KEY : import.meta.env.VITE_CLAUDE_API_KEY);

  if (!key) {
    throw new Error(`API key for ${provider} not found`);
  }

  return new AIService({
    provider,
    apiKey: key,
    model: provider === 'openai' ? 'gpt-4-turbo-preview' : 'claude-3-opus-20240229',
    maxTokens: 2000,
    temperature: 0.7
  });
}

// Export types
export type { AIMessage, AIConfig };