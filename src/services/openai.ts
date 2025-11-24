/**
 * OpenAI API Service
 *
 * This service provides a centralized way to interact with the OpenAI API.
 * All components (Student, Teacher, Parent, Management, Admin) should use this service
 * to ensure consistent API calls and easy maintenance.
 *
 * Usage:
 * import { callOpenAI, streamOpenAI } from '@/services/openai';
 *
 * const response = await callOpenAI('Your prompt here');
 */

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model?: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get the OpenAI API key from environment variables
 */
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.'
    );
  }

  return apiKey;
};

/**
 * Get the default OpenAI model from environment variables
 */
const getModel = (): string => {
  return import.meta.env.VITE_OPENAI_MODEL || 'gpt-4';
};

/**
 * Call OpenAI API with a simple prompt
 *
 * @param prompt - The user's prompt/question
 * @param systemPrompt - Optional system context to guide the AI's behavior
 * @param options - Additional OpenAI API options
 * @returns The AI's response text
 *
 * @example
 * const response = await callOpenAI('Explain photosynthesis');
 * console.log(response);
 */
export const callOpenAI = async (
  prompt: string,
  systemPrompt?: string,
  options?: Partial<OpenAIRequest>
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const model = options?.model || getModel();

    const messages: OpenAIMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Add user prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    const requestBody: OpenAIRequest = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
      ...options
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Call OpenAI API with full conversation history
 * Useful for chatbots that need context from previous messages
 *
 * @param messages - Array of conversation messages
 * @param options - Additional OpenAI API options
 * @returns The AI's response text
 *
 * @example
 * const messages = [
 *   { role: 'system', content: 'You are a helpful teacher' },
 *   { role: 'user', content: 'What is 2+2?' },
 *   { role: 'assistant', content: '2+2 equals 4' },
 *   { role: 'user', content: 'What about 3+3?' }
 * ];
 * const response = await callOpenAIWithHistory(messages);
 */
export const callOpenAIWithHistory = async (
  messages: OpenAIMessage[],
  options?: Partial<OpenAIRequest>
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const model = options?.model || getModel();

    const requestBody: OpenAIRequest = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
      ...options
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Stream OpenAI API responses for real-time chat experiences
 *
 * @param prompt - The user's prompt/question
 * @param onChunk - Callback function called for each chunk of the response
 * @param systemPrompt - Optional system context
 * @param options - Additional OpenAI API options
 *
 * @example
 * await streamOpenAI(
 *   'Write a story',
 *   (chunk) => console.log(chunk),
 *   'You are a creative writer'
 * );
 */
export const streamOpenAI = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  systemPrompt?: string,
  options?: Partial<OpenAIRequest>
): Promise<void> => {
  try {
    const apiKey = getApiKey();
    const model = options?.model || getModel();

    const messages: OpenAIMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    const requestBody = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
      stream: true,
      ...options
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to get response reader');
    }

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

            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming OpenAI API:', error);
    throw error;
  }
};

/**
 * Check if OpenAI API key is configured
 */
export const isOpenAIConfigured = (): boolean => {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
};

// Export types for use in components
export type { OpenAIMessage, OpenAIRequest, OpenAIResponse };
