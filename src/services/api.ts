import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.accessToken);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const response = await this.client.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async updateProfile(updates: any): Promise<ApiResponse> {
    const response = await this.client.patch('/auth/update-profile', updates);
    return response.data;
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/auth/change-password', passwords);
    return response.data;
  }

  // AI methods
  async chatWithAI(messages: any[], options: any = {}): Promise<ApiResponse> {
    const response = await this.client.post('/ai/chat', { messages, options });
    return response.data;
  }

  async generateQuiz(topic: string, options: any = {}): Promise<ApiResponse> {
    const response = await this.client.post('/ai/generate-quiz', {
      topic,
      options,
    });
    return response.data;
  }

  async analyzePerformance(
    studentData: any,
    detailed = true
  ): Promise<ApiResponse> {
    const response = await this.client.post('/ai/analyze-performance', {
      studentData,
      detailed,
    });
    return response.data;
  }

  async textToSpeech(
    text: string,
    options: { voice?: string; speed?: number } = {}
  ): Promise<Blob> {
    const response = await this.client.post(
      '/ai/text-to-speech',
      { text, ...options },
      { responseType: 'blob' }
    );
    return response.data;
  }

  async speechToText(
    audioFile: File,
    language = 'en'
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    const response = await this.client.post('/ai/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async analyzeImage(imageUrl: string, prompt: string): Promise<ApiResponse> {
    const response = await this.client.post('/ai/analyze-image', {
      imageUrl,
      prompt,
    });
    return response.data;
  }

  async generateLearningPath(
    studentProfile: any,
    goals: any
  ): Promise<ApiResponse> {
    const response = await this.client.post('/ai/generate-learning-path', {
      studentProfile,
      goals,
    });
    return response.data;
  }

  async semanticSearch(query: string, options: any = {}): Promise<ApiResponse> {
    const response = await this.client.post('/ai/search', { query, options });
    return response.data;
  }

  // Streaming chat method
  async streamChat(
    messages: any[],
    options: any = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        messages,
        options: { ...options, stream: true },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start streaming chat');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (error) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export types
export type { ApiResponse };