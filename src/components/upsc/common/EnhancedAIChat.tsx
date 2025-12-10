import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Image,
  FileText,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
  Camera,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'audio' | 'file';
  metadata?: any;
}

interface ChatSettings {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
  provider: 'openai';
  temperature: number;
  maxTokens: number;
  enableVision: boolean;
  enableVoice: boolean;
  language: string;
}

interface EnhancedAIChatProps {
  subject?: string;
  topic?: string;
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => void;
  showSettings?: boolean;
  embedded?: boolean;
  height?: string;
}

export function EnhancedAIChat({
  subject = 'General Knowledge',
  topic = 'Study Assistant',
  initialMessages = [],
  onMessageSent,
  showSettings = true,
  embedded = false,
  height = '600px'
}: EnhancedAIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'gpt-4',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 2000,
    enableVision: true,
    enableVoice: true,
    language: 'en'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Generate unique message ID
  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Send message with demo response (backend optional)
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');

    onMessageSent?.(userMessage);

    try {
      // Try to use backend API if available
      if (import.meta.env.VITE_API_URL) {
        const messageHistory = [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        try {
          await apiService.streamChat(
            messageHistory,
            {
              ...settings,
              subject,
              topic,
              systemPrompt: generateSystemPrompt()
            },
            (chunk: string) => {
              setStreamingMessage(prev => prev + chunk);
            }
          );

          const assistantMessage: Message = {
            id: generateMessageId(),
            role: 'assistant',
            content: streamingMessage,
            timestamp: new Date(),
            type: 'text'
          };

          setMessages(prev => [...prev, assistantMessage]);
          setStreamingMessage('');
          return;
        } catch (apiError) {
          console.warn('Backend API not available, using demo mode:', apiError);
        }
      }

      // Fallback to demo mode with simulated streaming
      const demoResponses = [
        `Great question about ${topic}! Let me help you understand this concept better.`,
        `In ${subject}, this is a fundamental topic that requires careful analysis. Let me break it down for you step by step.`,
        `I'd be happy to explain ${topic} in detail. This is an important concept for your UPSC preparation.`,
        `That's an excellent question! ${topic} is indeed crucial for understanding ${subject}. Let me provide you with a comprehensive explanation.`,
        `Let me help you master ${topic}. This concept is often tested in competitive exams, so it's important to understand it thoroughly.`
      ];

      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      // Simulate streaming
      let currentText = '';
      const words = randomResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentText += (i === 0 ? '' : ' ') + words[i];
        setStreamingMessage(currentText);
      }

      // Convert to permanent message
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [messages, settings, subject, topic, streamingMessage]);

  // Generate contextual system prompt
  const generateSystemPrompt = () => {
    return `You are an advanced AI tutor specializing in ${subject}, particularly focused on ${topic}. 

Key capabilities:
- Provide detailed, educational explanations
- Use examples and analogies to clarify concepts
- Adapt your teaching style to the student's needs
- Encourage critical thinking with follow-up questions
- Support multiple learning styles (visual, auditory, kinesthetic)

Current context:
- Subject: ${subject}
- Topic: ${topic}
- Language: ${settings.language}

Guidelines:
1. Be encouraging and patient
2. Break down complex topics into digestible parts
3. Use real-world examples when possible
4. Ask clarifying questions to ensure understanding
5. Provide additional resources when helpful
6. Maintain an engaging, conversational tone`;
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        try {
          const response = await apiService.speechToText(audioFile, settings.language);
          if (response.success && response.data?.transcription) {
            await sendMessage(response.data.transcription, 'audio');
          }
        } catch (error) {
          console.error('Speech-to-text error:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith('image/') && settings.enableVision) {
      // Convert image to base64 for vision AI
      const reader = new FileReader();
      reader.onload = async () => {
        const imageUrl = reader.result as string;
        await sendMessage(`[Image uploaded: ${file.name}]`, 'image');
        // You would also send the image to the vision API here
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      try {
        const response = await apiService.speechToText(file, settings.language);
        if (response.success && response.data?.transcription) {
          await sendMessage(response.data.transcription, 'audio');
        }
      } catch (error) {
        console.error('Audio processing error:', error);
      }
    }
  };

  // Speak message aloud (demo mode - uses browser TTS)
  const speakMessage = async (content: string) => {
    if (!settings.enableVoice) return;

    try {
      // Use browser's speech synthesis API instead of external API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported in this browser');
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  // Copy message to clipboard
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could show a toast notification here
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    };

    const inputElement = inputRef.current;
    inputElement?.addEventListener('keydown', handleKeyDown);
    return () => inputElement?.removeEventListener('keydown', handleKeyDown);
  }, [input, sendMessage]);

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg ${embedded ? '' : 'border border-gray-200'}`} style={{ height }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Study Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subject} - {topic}</p>
          </div>
        </div>
        
        {showSettings && (
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message bubble */}
                <div className={`px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Message actions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => speakMessage(message.content)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="Good response"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Poor response"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming message */}
        {isStreaming && streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] space-x-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl">
                <p className="whitespace-pre-wrap">{streamingMessage}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            
            {/* Quick actions */}
            <div className="absolute right-2 top-2 flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*,.pdf,.txt,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Upload file"
              >
                <FileText className="w-4 h-4" />
              </button>
              
              {settings.enableVision && (
                <button
                  onClick={() => {
                    fileInputRef.current?.setAttribute('accept', 'image/*');
                    fileInputRef.current?.click();
                  }}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Add image"
                >
                  <Image className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Voice recording button */}
          {settings.enableVoice && (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              disabled={isLoading}
              title="Hold to record"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
            
            <div className="space-y-4">
              {/* AI Provider */}
              <div>
                <label className="block text-sm font-medium mb-2">AI Provider</label>
                <div className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-gray-100 text-gray-700">
                  OpenAI
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Creativity (Temperature): {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Feature toggles */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableVision}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableVision: e.target.checked }))}
                    className="mr-2"
                  />
                  Enable Vision AI
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableVoice}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableVoice: e.target.checked }))}
                    className="mr-2"
                  />
                  Enable Voice Features
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}