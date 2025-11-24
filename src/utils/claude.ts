import Anthropic from '@anthropic-ai/sdk';
import { getDemoResponse, getDemoFAQs, getDemoSpeechResponse } from './demo-fallbacks';

// Check if we're in demo mode (no API keys)
const isDemoMode = !import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.VITE_ANTHROPIC_API_KEY;

// Initialize Claude client with proper browser configuration (only if API key available)
let anthropic: Anthropic | null = null;
if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true, // Only for demo, in production use backend
    defaultHeaders: {
      'anthropic-dangerous-direct-browser-access': 'true',
    },
  });
}

// Language configuration with enhanced support
const supportedLanguages = {
  en: { name: 'English', voice: 'alloy', code: 'en', prompt: 'English' },
  hi: { name: 'हिंदी', voice: 'nova', code: 'hi', prompt: 'Hindi (हिंदी)' },
  ta: { name: 'தமிழ்', voice: 'shimmer', code: 'ta', prompt: 'Tamil (தமிழ்)' },
  te: { name: 'తెలుగు', voice: 'echo', code: 'te', prompt: 'Telugu (తెలుগు)' },
  ml: { name: 'Malayalam', voice: 'onyx', code: 'ml', prompt: 'Malayalam' }
};

// OpenAI for speech services (only if API key available)
import OpenAI from 'openai';
let openai: OpenAI | null = null;
if (import.meta.env.VITE_OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Fast Claude chat response - Using OpenAI as fallback due to CORS
export async function getClaudeChatResponse(
  messages: ChatMessage[],
  subject: string,
  topic: string,
  language?: string
): Promise<string> {
  try {
    // Use demo mode if no API keys available
    if (isDemoMode) {
      console.log('Demo mode: Using demo response instead of API call');
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // Simulate API delay
      return getDemoResponse(subject, topic, language || 'en');
    }

    // Validate API key
    if (!openai) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const languageConfig = supportedLanguages[userLanguage as keyof typeof supportedLanguages];
    const languageName = languageConfig?.prompt || 'English';

    // Create system prompt with enhanced multilingual support
    const systemPrompt = `You are an expert AI tutor specializing in ${subject}, particularly knowledgeable about ${topic}. 

IMPORTANT FORMATTING RULES:
1. You MUST respond ONLY in ${languageName}. Do not mix languages unless specifically requested.
2. DO NOT use any markdown formatting in your responses. No asterisks (*), underscores (_), backticks (\`), or other markdown symbols.
3. Use plain text only. For emphasis, use CAPITAL LETTERS or descriptive language instead of formatting.
4. For lists, use simple dashes (-) or numbers (1., 2., etc.) without any special formatting.

Your responses should be:
1. Comprehensive and Detailed: Provide thorough explanations that cover all aspects of the topic
2. Well-Structured: Organize your response with clear sections, bullet points, or numbered lists when appropriate
3. Rich with Examples: Include multiple relevant examples, case studies, and real-world applications
4. Educational Depth: Explain not just the "what" but also the "why" and "how" behind concepts
5. Progressive Learning: Start with fundamentals and build up to more complex ideas
6. Interactive and Engaging: Suggest exercises, thought experiments, or questions for deeper understanding
7. Visual Descriptions: When applicable, describe diagrams, charts, or visual representations that would help understanding
8. Common Misconceptions: Address typical errors or misunderstandings students might have
9. Connections: Link concepts to related topics and show how they fit into the broader subject area
10. Practical Applications: Emphasize real-world uses and career relevance

${userLanguage === 'hi' ? 'कृपया केवल हिंदी में उत्तर दें। विस्तृत और व्यापक उत्तर प्रदान करें।' : ''}
${userLanguage === 'ta' ? 'தயவுசெய்து தமிழில் மட்டுமே பதிலளிக்கவும். விரிவான மற்றும் முழுமையான பதில்களை வழங்கவும்.' : ''}
${userLanguage === 'te' ? 'దయచేసి తెలుగులో మాత్రమే సమాధానం ఇవ్వండి. వివరణాత్మక మరియు సమగ్ర సమాధానాలు అందించండి.' : ''}

Remember: This is an educational platform, so prioritize learning outcomes. Your responses should be thorough enough that students gain a deep understanding of the topic. Don't hesitate to provide lengthy explanations when needed - comprehensive education is more important than brevity.`;

    // Ensure we have valid messages
    if (!messages || messages.length === 0) {
      return `Hello! I'm your AI tutor for ${topic} in ${subject}. How can I help you learn today?`;
    }

    // Convert messages to OpenAI format
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Use OpenAI GPT-4-turbo for fast, high-quality responses with streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Latest fast model
      messages: openAIMessages,
      max_tokens: 2000,
      temperature: 0.7,
      stream: true, // Enable streaming for faster perceived response
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    // Collect the streamed response
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }

    return fullResponse || "I apologize, but I couldn't generate a response. Please try again.";

  } catch (error: any) {
    console.error('Error getting AI response:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      error_code: error.error?.error_code
    });
    
    // Try Claude as fallback if OpenAI fails
    try {
      const claudeMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        temperature: 0.7,
        system: `You are an expert AI tutor for ${topic} in ${subject}. 
        
IMPORTANT: DO NOT use any markdown formatting. Use plain text only. No asterisks, underscores, backticks, or other markdown symbols.

Provide comprehensive, detailed educational responses with examples, explanations, and practical applications. Focus on helping students deeply understand the concepts.`,
        messages: claudeMessages
      });

      const textContent = response.content.find(content => content.type === 'text');
      return textContent?.text || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (claudeError) {
      console.error('Claude fallback also failed:', claudeError);
    }
    
    if (error.message?.includes('API key')) {
      return "Please check your API key configuration. The API key may be missing or invalid.";
    }
    
    if (error.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }
    
    if (error.status === 401) {
      return "Authentication failed. Please check your API key configuration.";
    }
    
    return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
  }
}

// Fast FAQ generation - Using OpenAI due to CORS
export async function generateClaudeFAQs(subject: string, topic: string, language?: string): Promise<Array<{
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}>> {
  try {
    // Use demo mode if no API keys available
    if (isDemoMode) {
      console.log('Demo mode: Using demo FAQs instead of API call');
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000)); // Simulate API delay
      return getDemoFAQs();
    }

    if (!openai) {
      return getDemoFAQs();
    }
    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const languageConfig = supportedLanguages[userLanguage as keyof typeof supportedLanguages];
    const languageName = languageConfig?.prompt || 'English';
    
    const prompt = `Generate 5 frequently asked questions and comprehensive, detailed answers about ${topic} in ${subject}.

IMPORTANT: Generate questions and answers ONLY in ${languageName}.

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here",
    "answer": "Detailed answer here"
  }
]

For each answer, ensure you:
1. Provide a thorough explanation (at least 3-5 paragraphs)
2. Include multiple examples and real-world applications
3. Address common misconceptions or difficulties
4. Explain the underlying principles and theory
5. Connect to related concepts and broader context
6. Suggest further exploration or practice exercises

Focus on:
- Fundamental concepts that form the foundation of understanding
- Common areas where students face difficulties or confusion
- Important relationships and connections between ideas
- Practical applications in real-world scenarios
- Advanced insights for deeper comprehension
- Step-by-step explanations for complex processes

Make your answers educational masterpieces that truly help students grasp the material deeply.`;

    // Use OpenAI for FAQ generation
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert educator specializing in creating comprehensive, detailed educational content. Generate thorough, in-depth FAQs in JSON format that truly help students understand complex topics.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      return defaultFAQs;
    }

    // Parse response
    try {
      const cleanedResponse = textContent
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const faqs = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(faqs)) {
        return defaultFAQs;
      }
      
      return faqs.map((faq: any, index: number) => ({
        id: `faq-${Date.now()}-${index}`,
        question: faq.question || 'Question not available',
        answer: faq.answer || 'Answer not available',
        isOpen: false
      }));
    } catch (parseError) {
      console.error('Error parsing FAQs:', parseError);
      return defaultFAQs;
    }
  } catch (error) {
    console.error('Error generating FAQs:', error);
    return defaultFAQs;
  }
}

// Voice-to-text using OpenAI Whisper (fastest available)
export async function speechToText(audioFile: File | Blob, language?: string): Promise<string> {
  try {
    console.log('STT: Starting speech-to-text processing...');

    // Convert Blob to File if needed (RecordRTC returns Blob)
    let file: File;
    if (audioFile instanceof Blob && !(audioFile instanceof File)) {
      console.log('STT: Converting Blob to File...');
      file = new File([audioFile], `recording-${Date.now()}.webm`, {
        type: audioFile.type || 'audio/webm'
      });
    } else {
      file = audioFile as File;
    }

    console.log('STT: Audio file details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Use demo mode if no API key available
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using demo speech-to-text response');
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // Simulate processing time
      return getDemoSpeechResponse(`Audio file: ${file.name}`);
    }

    const lastLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const languageCode = supportedLanguages[lastLanguage as keyof typeof supportedLanguages]?.code;

    console.log('STT: Using language:', lastLanguage, 'code:', languageCode);

    if (!languageCode) {
      throw new Error('Unsupported language');
    }

    // Validate audio file
    if (!file || file.size === 0) {
      console.error('STT: Invalid audio file - size is 0 or file is null');
      throw new Error('Invalid audio file - no audio data recorded');
    }

    // Check if file size is reasonable (not too small or too large)
    if (file.size < 1000) { // Less than 1KB
      console.error('STT: Audio file too small:', file.size, 'bytes');
      throw new Error('Audio recording too short. Please try speaking for longer.');
    }

    if (file.size > 25000000) { // More than 25MB
      console.error('STT: Audio file too large:', file.size, 'bytes');
      throw new Error('Audio recording too long. Please keep it under 25MB.');
    }

    console.log('STT: Sending to OpenAI Whisper...');
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: languageCode,
      response_format: 'text', // Fastest response format
      prompt: 'This is a conversation about educational topics.' // Helps with context
    });

    const transcription = response as string;
    console.log('STT: Transcription result:', transcription);

    if (!transcription || transcription.trim().length === 0) {
      throw new Error('No speech detected in the audio. Please try speaking more clearly.');
    }

    return transcription.trim();
  } catch (error: any) {
    console.error('Error in speech to text:', error);
    console.error('STT Error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      error_code: error.error?.error_code
    });
    
    if (error.message?.includes('API key')) {
      throw new Error('OpenAI API key configuration error');
    }
    
    if (error.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    
    if (error.status === 401) {
      throw new Error('OpenAI authentication failed. Please check your API key.');
    }

    if (error.message?.includes('audio')) {
      throw new Error(error.message); // Pass through specific audio errors
    }
    
    throw new Error('Failed to process speech. Please try again or type your message.');
  }
}

// Text-to-speech using hybrid approach for minimal latency
let currentAudio: HTMLAudioElement | null = null;
let currentAudioResolver: (() => void) | null = null;
let audioQueue: { audio: HTMLAudioElement; url: string }[] = [];
let isPlayingQueue = false;

// Speech synthesis as instant fallback
const speechSynthesis = window.speechSynthesis;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Global audio tracking for better stop control
let allActiveAudios: Set<HTMLAudioElement> = new Set();
let allActiveAudioSources: WeakMap<HTMLAudioElement, MediaElementAudioSourceNode> = new WeakMap();

function stopCurrentAudio(): void {
  console.log('Force stopping all audio...');
  
  // 1. Stop Web Speech API
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    // Force multiple cancels to ensure it stops
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }, i * 10);
    }
  }
  
  // 2. Clear current utterance
  if (currentUtterance) {
    currentUtterance = null;
  }
  
  // 3. Stop current audio element
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
      currentAudio.load();
      currentAudio.remove();
    } catch (error) {
      console.error('Error stopping current audio:', error);
    }
    currentAudio = null;
  }
  
  // 4. Stop ALL active audio elements
  allActiveAudios.forEach(audio => {
    try {
      audio.pause();
      audio.currentTime = 0;
      
      // Disconnect from Web Audio API if connected
      const source = allActiveAudioSources.get(audio);
      if (source) {
        try {
          source.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }
      
      audio.src = '';
      audio.load();
      audio.remove();
    } catch (error) {
      console.error('Error stopping audio element:', error);
    }
  });
  allActiveAudios.clear();
  
  // 5. Clear audio queue
  audioQueue.forEach(({ audio, url }) => {
    try {
      audio.pause();
      audio.src = '';
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  });
  audioQueue = [];
  isPlayingQueue = false;
  
  // 6. Clear all audio elements from the pool
  audioPool.forEach(audio => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    } catch (error) {
      console.error('Error clearing pool:', error);
    }
  });
  audioPool.length = 0;
  
  // 7. Clear TTS request queue
  if (window.ttsRequestQueue) {
    window.ttsRequestQueue.length = 0;
  }
  ttsRequestQueue.length = 0;
  isProcessingTTSQueue = false;
  
  if (currentAudioResolver) {
    currentAudioResolver();
    currentAudioResolver = null;
  }
  
  console.log('All audio forcefully stopped');
}

// Export stop function and audio tracking for external use
export { stopCurrentAudio, allActiveAudios };

// Test function to verify TTS is working
export async function testTTS(): Promise<void> {
  console.log('Testing TTS...');
  try {
    const testText = 'Hello, this is a test of the text to speech system. I can speak naturally now.';
    await textToSpeech(testText, 'en');
    console.log('Test TTS: Completed');
  } catch (error) {
    console.error('Test TTS failed:', error);
  }
}

// Preload voices and audio elements for faster response
export function preloadVoices(): void {
  // Preload browser voices
  if (speechSynthesis) {
    // Load voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('TTS: Preloaded', voices.length, 'voices');
    };

    // Some browsers load voices asynchronously
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else {
      loadVoices();
    }
    
    // Warm up the speech engine with a silent utterance
    const warmup = new SpeechSynthesisUtterance('');
    warmup.volume = 0;
    speechSynthesis.speak(warmup);
    setTimeout(() => speechSynthesis.cancel(), 100);
  }

  // Pre-create optimized audio elements for instant playback
  if (audioPool.length === 0) {
    console.log('TTS: Pre-creating audio elements for instant playback');
    
    // Create Web Audio context for lowest latency
    let audioContext: AudioContext | null = null;
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContext();
      
      // Resume context to ensure it's ready
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
    
    for (let i = 0; i < 5; i++) { // More elements for better concurrency
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 1.0;
      
      // Connect to Web Audio API for lower latency
      if (audioContext) {
        try {
          const source = audioContext.createMediaElementSource(audio);
          source.connect(audioContext.destination);
          allActiveAudioSources.set(audio, source);
        } catch (e) {
          // Ignore if already connected
        }
      }
      
      audioPool.push(audio);
    }
  }

  // Warm up TTS connections with tiny requests
  if (!isPreloading) {
    isPreloading = true;
    
    // Warm up ElevenLabs connection (prioritize this)
    if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
      console.log('TTS: Warming up ElevenLabs connection...');
      const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
      
      fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: 'Hi',
          model_id: 'eleven_multilingual_v3',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
          optimize_streaming_latency: 4,
          output_format: 'mp3_44100_64'
        })
      }).then(response => {
        if (response.ok) {
          console.log('TTS: ElevenLabs connection warmed up');
          return response.arrayBuffer();
        }
      }).catch(error => {
        console.error('TTS: Failed to warm up ElevenLabs connection', error);
      });
    }
    
    // Warm up OpenAI connection as backup
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('TTS: Warming up OpenAI connection...');
      
      openai.audio.speech.create({
        model: 'tts-1',
        voice: 'nova',
        input: 'Hi',
        speed: 1.0
      }).then(() => {
        console.log('TTS: OpenAI connection warmed up');
      }).catch(error => {
        console.error('TTS: Failed to warm up OpenAI connection', error);
      });
    }
  }
}

// Fast browser-based TTS using Web Speech API with better voices
async function browserTTS(text: string, language: string = 'en'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log('BrowserTTS: Starting with text:', text.substring(0, 50) + '...');
      
      if (!window.speechSynthesis) {
        console.error('Browser does not support speech synthesis');
        resolve(); // Don't reject, just resolve silently
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance = utterance;
      
      console.log('BrowserTTS: Created utterance');

      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      console.log('BrowserTTS: Available voices:', voices.length);
      
      
      // Function to set voice and speak
      const setVoiceAndSpeak = () => {
        voices = window.speechSynthesis.getVoices();
        console.log('BrowserTTS: Got voices:', voices.length);
        
        // Select best voice for language with enhanced support
        const languageMap: { [key: string]: string[] } = {
          'en': ['Google US English', 'Microsoft David', 'Google UK English Female', 'Google UK English Male', 'en-US', 'en-GB', 'Samantha', 'Alex', 'Daniel'],
          'hi': ['Google हिन्दी', 'Microsoft Hemant', 'hi-IN', 'Hindi', 'Lekha (Hindi)', 'Microsoft Swara - Hindi (India)', 'Google हिन्दी Female'],
          'ta': ['Microsoft Valluvar', 'ta-IN', 'Tamil', 'Lekha (Tamil)', 'Microsoft Heera - Tamil (India)', 'Google தமிழ्'],
          'te': ['te-IN', 'Telugu', 'Lekha (Telugu)', 'Microsoft Chitra - Telugu (India)', 'Google తెలుగు'],
          'ml': ['ml-IN', 'Malayalam', 'Lekha (Malayalam)', 'Microsoft Sabina - Malayalam (India)']
        };

        const preferredVoices = languageMap[language] || languageMap['en'];
        const selectedVoice = voices.find(voice => 
          preferredVoices.some(pref => voice.name.includes(pref) || voice.lang.includes(pref))
        ) || voices.find(voice => voice.lang.startsWith(language)) || voices[0];

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('BrowserTTS: Using voice:', selectedVoice.name, selectedVoice.lang);
        } else {
          console.log('BrowserTTS: Using default voice');
        }

        // Optimize speech settings for clarity and natural speech
        utterance.rate = 1.0; // Normal speed for better clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = language;

        utterance.onstart = () => {
          console.log('BrowserTTS: Speech started');
        };

        utterance.onend = () => {
          currentUtterance = null;
          console.log('BrowserTTS: Speech completed');
          resolve();
        };

        utterance.onerror = (event) => {
          currentUtterance = null;
          console.error('BrowserTTS: Speech error:', event.error, event);
          resolve(); // Don't reject, just resolve to prevent blocking
        };

        // Start speaking
        console.log('BrowserTTS: About to speak text');
        window.speechSynthesis.speak(utterance);
      };

      // If voices aren't loaded yet, wait for them
      if (voices.length === 0) {
        console.log('BrowserTTS: Voices not loaded, waiting...');
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          console.log('BrowserTTS: Voices changed event fired');
          setVoiceAndSpeak();
        }, { once: true });
        
        // Also try after a short delay
        setTimeout(() => {
          if (voices.length === 0) {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
              setVoiceAndSpeak();
            } else {
              // Speak with default voice
              console.log('BrowserTTS: No voices found, using default');
              window.speechSynthesis.speak(utterance);
              utterance.onend = () => resolve();
              utterance.onerror = () => resolve();
            }
          }
        }, 100);
      } else {
        setVoiceAndSpeak();
      }
    } catch (error) {
      currentUtterance = null;
      console.error('BrowserTTS: Error:', error);
      resolve(); // Don't reject, just resolve to prevent blocking
    }
  });
}

// Process audio queue for smoother playback
async function playAudioQueue(): Promise<void> {
  if (isPlayingQueue || audioQueue.length === 0) return;
  
  isPlayingQueue = true;
  
  // Stop any browser TTS that might be playing
  if (currentUtterance) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
  
  while (audioQueue.length > 0) {
    const { audio, url } = audioQueue.shift()!;
    
    try {
      currentAudio = audio;
      await audio.play();
      
      // Wait for audio to finish
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudio = null;
          resolve();
        };
        
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          currentAudio = null;
          resolve();
        };
      });
    } catch (error) {
      console.error('TTS: Queue playback error:', error);
      URL.revokeObjectURL(url);
    }
  }
  
  isPlayingQueue = false;
}

// Split text into smaller chunks for faster processing
function splitTextIntoChunks(text: string, maxLength: number = 800): string[] {
  // For longer educational content, we can use larger chunks
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Audio element pool for instant playback
const audioPool: HTMLAudioElement[] = [];
let isPreloading = false;

// Preload audio element for instant playback
function getAudioElement(): HTMLAudioElement {
  let audio = audioPool.pop();
  
  if (!audio) {
    audio = new Audio();
    audio.volume = 1.0;
    
    // Enable Web Audio API for lower latency if available
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        const source = context.createMediaElementSource(audio);
        source.connect(context.destination);
        allActiveAudioSources.set(audio, source);
      } catch (e) {
        // Ignore - element might already be connected
      }
    }
  }
  
  // Reset audio element for reuse
  if (audio.src) {
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  }
  audio.playbackRate = 1.0;
  audio.preload = 'auto';
  audio.autoplay = false;
  audio.loop = false;
  
  return audio;
}

// Return audio element to pool
function returnAudioToPool(audio: HTMLAudioElement) {
  audio.pause();
  audio.currentTime = 0;
  audio.src = '';
  if (audioPool.length < 3) {
    audioPool.push(audio);
  }
}

// ElevenLabs TTS - Ultra-fast streaming for instant playback
async function elevenLabsTTS(text: string, language: string = 'en'): Promise<void> {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const startTime = Date.now();

    // Clean text quickly
    const cleanText = text
      .replace(/[*`#\[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Get user's preferred voice
    const userPreferredVoice = localStorage.getItem('preferredElevenLabsVoice');
    
    const voiceMap: { [key: string]: string } = {
      'rachel': '21m00Tcm4TlvDq8ikWAM',
      'bella': 'EXAVITQu4vr4xnSDxMaL',
      'emily': 'LcfcDJNUP1GQjkzn1xUU',
      'elli': 'MF3mGyEYCl7XYWbV9V6O',
      'nicole': 'piTKgcLEGmPE4e6mEKli',
      'charlotte': 'XB0fDUnXU5powFXDhCwa',
      'matilda': 'XrExE9yKIg1WjnnlVkGX',
      'laura': 'FGY2WhTYpPnrIDTdsKH5',
      'lily': 'pFZP5JQG7iQjIQuC4Bku',
      'sarah': 'EXAVITQu4vr4xnSDxMaL',
      'jessica': 'cgSgspJ2msm6clMCkdW9',
      'adam': 'pNInz6obpgDQGcFmaJgB',
      'antoni': 'ErXwobaYiN019PkySvjV',
      'josh': 'TxGEqnHWrfWFTfGW9XjX',
      'daniel': 'onwK4e9ZLuTAKqWW03F9',
      'alice': 'Xb7hH8MSUJpSbSDYk0k2',
    };

    const selectedVoiceId = voiceMap[userPreferredVoice || 'rachel'] || voiceMap['rachel'];
    
    // Create new audio element for this chunk
    const audio = new Audio();
    audio.volume = 1.0;
    audio.crossOrigin = 'anonymous';
    allActiveAudios.add(audio);

    // Make the API call with streaming enabled
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v3', // V3 model for better quality and natural sound
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
        optimize_streaming_latency: 4, // Balance between quality and speed
        output_format: 'mp3_44100_64' // Better quality for V3
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    // Pre-create blob URL for faster playback
    const audioData = await response.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Pre-load the audio
    audio.src = audioUrl;
    audio.load(); // Force load to start immediately
    
    return new Promise((resolve, reject) => {
      let playAttempts = 0;
      const maxAttempts = 3;
      
      const attemptPlay = async () => {
        try {
          await audio.play();
          console.log(`ElevenLabs: Playback started in ${Date.now() - startTime}ms`);
        } catch (error: any) {
          playAttempts++;
          if (playAttempts < maxAttempts && error.name === 'NotAllowedError') {
            // Retry after a short delay
            setTimeout(attemptPlay, 100);
          } else {
            console.error('Play error after attempts:', error);
            reject(error);
          }
        }
      };

      // Set up event handlers first
      audio.oncanplaythrough = () => {
        console.log(`ElevenLabs: Audio ready in ${Date.now() - startTime}ms`);
        attemptPlay();
      };
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        allActiveAudios.delete(audio);
        audio.src = '';
        console.log(`ElevenLabs: Playback completed`);
        resolve();
      };
      
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        allActiveAudios.delete(audio);
        audio.src = '';
        console.error('Audio error:', e);
        reject(new Error('Audio playback failed'));
      };
      
      // Handle abort/pause
      audio.onpause = () => {
        if (!audio.ended) {
          console.log('ElevenLabs: Audio paused/stopped');
          URL.revokeObjectURL(audioUrl);
          allActiveAudios.delete(audio);
          audio.src = '';
          resolve(); // Resolve instead of reject when paused
        }
      };

      // If already ready, play immediately
      if (audio.readyState >= 3) {
        attemptPlay();
      }
    });
    
  } catch (error) {
    console.error('ElevenLabs failed:', error);
    throw error;
  }
}

// Fallback with v3 alpha for quality
async function elevenLabsV3Fallback(text: string, language: string = 'en'): Promise<void> {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const selectedVoiceId = localStorage.getItem('preferredElevenLabsVoice') || 'nicole';
  
  const voiceMap: { [key: string]: string } = {
    'rachel': '21m00Tcm4TlvDq8ikWAM',
    'bella': 'EXAVITQu4vr4xnSDxMaL',
    'emily': 'LcfcDJNUP1GQjkzn1xUU',
    'elli': 'MF3mGyEYCl7XYWbV9V6O',
    'nicole': 'piTKgcLEGmPE4e6mEKli',
    'charlotte': 'XB0fDUnXU5powFXDhCwa',
    'matilda': 'XrExE9yKIg1WjnnlVkGX',
    'laura': 'FGY2WhTYpPnrIDTdsKH5',
    'lily': 'pFZP5JQG7iQjIQuC4Bku',
    'sarah': 'EXAVITQu4vr4xnSDxMaL',
    'jessica': 'cgSgspJ2msm6clMCkdW9',
    'adam': 'pNInz6obpgDQGcFmaJgB',
    'antoni': 'ErXwobaYiN019PkySvjV',
    'josh': 'TxGEqnHWrfWFTfGW9XjX',
    'daniel': 'onwK4e9ZLuTAKqWW03F9',
    'alice': 'Xb7hH8MSUJpSbSDYk0k2',
  };
  
  const voiceId = voiceMap[selectedVoiceId] || voiceMap['rachel'];
  const audio = getAudioElement();
  currentAudio = audio;
  allActiveAudios.add(audio);
  
  const cleanText = text.replace(/[*`#\[\]]/g, '').trim();
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: cleanText,
      model_id: 'eleven_multilingual_v3_alpha',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      optimize_streaming_latency: 4
    })
  });

  const audioData = await response.arrayBuffer();
  const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  
  audio.src = audioUrl;
  await audio.play();
  
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
    allActiveAudios.delete(audio);
    returnAudioToPool(audio);
    currentAudio = null;
  };
}

// Google Cloud Text-to-Speech - High quality natural voices
async function googleCloudTTS(text: string, language: string = 'en'): Promise<void> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    const startTime = Date.now();

    // Clean the text
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

    // Language codes for Google Cloud
    const languageCodeMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'ml': 'ml-IN'
    };

    const languageCode = languageCodeMap[language] || 'en-US';
    
    // Select voice based on language
    const voiceMap: { [key: string]: { name: string, ssmlGender: string } } = {
      'en-US': { name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' }, // Natural female
      'hi-IN': { name: 'hi-IN-Neural2-A', ssmlGender: 'FEMALE' },
      'ta-IN': { name: 'ta-IN-Wavenet-A', ssmlGender: 'FEMALE' },
      'te-IN': { name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
      'ml-IN': { name: 'ml-IN-Wavenet-A', ssmlGender: 'FEMALE' }
    };

    const voice = voiceMap[languageCode] || voiceMap['en-US'];

    console.log('Google Cloud TTS: Starting natural speech generation...');

    const audio = getAudioElement();
    currentAudio = audio;

    // Google Cloud TTS API
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: cleanText },
        voice: {
          languageCode: languageCode,
          name: voice.name,
          ssmlGender: voice.ssmlGender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0,
          volumeGainDb: 0
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google Cloud TTS error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Google Cloud TTS: Response received in ${Date.now() - startTime}ms`);

    // Decode base64 audio
    const audioData = atob(data.audioContent);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }

    const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    audio.src = audioUrl;
    const playPromise = audio.play();

    return new Promise((resolve, reject) => {
      playPromise.then(() => {
        console.log(`Google Cloud TTS: Playback started in ${Date.now() - startTime}ms`);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          returnAudioToPool(audio);
          currentAudio = null;
          resolve();
        };
      }).catch(error => {
        console.error('Google Cloud TTS: Failed to play audio', error);
        URL.revokeObjectURL(audioUrl);
        returnAudioToPool(audio);
        currentAudio = null;
        reject(error);
      });
    });
  } catch (error) {
    console.error('Google Cloud TTS failed:', error);
    throw error;
  }
}

// Microsoft Azure Speech - Natural neural voices
async function azureTTS(text: string, language: string = 'en'): Promise<void> {
  try {
    const apiKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    const region = import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus';
    
    if (!apiKey) {
      throw new Error('Azure Speech API key not configured');
    }

    const startTime = Date.now();

    // Clean the text
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

    // Azure voice names
    const voiceMap: { [key: string]: string } = {
      'en': 'en-US-JennyNeural', // Natural female voice
      'hi': 'hi-IN-SwaraNeural',
      'ta': 'ta-IN-PallaviNeural',
      'te': 'te-IN-ShrutiNeural',
      'ml': 'ml-IN-SobhanaNeural'
    };

    const voiceName = voiceMap[language] || voiceMap['en'];

    console.log('Azure TTS: Starting neural speech generation...');

    const audio = getAudioElement();
    currentAudio = audio;

    // Create SSML
    const ssml = `<speak version='1.0' xml:lang='${language}'>
      <voice xml:lang='${language}' name='${voiceName}'>
        ${cleanText}
      </voice>
    </speak>`;

    // Azure Speech API
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
      },
      body: ssml
    });

    if (!response.ok) {
      throw new Error(`Azure TTS error: ${response.statusText}`);
    }

    console.log(`Azure TTS: Response received in ${Date.now() - startTime}ms`);

    const audioData = await response.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    audio.src = audioUrl;
    const playPromise = audio.play();

    return new Promise((resolve, reject) => {
      playPromise.then(() => {
        console.log(`Azure TTS: Playback started in ${Date.now() - startTime}ms`);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          returnAudioToPool(audio);
          currentAudio = null;
          resolve();
        };
      }).catch(error => {
        console.error('Azure TTS: Failed to play audio', error);
        URL.revokeObjectURL(audioUrl);
        returnAudioToPool(audio);
        currentAudio = null;
        reject(error);
      });
    });
  } catch (error) {
    console.error('Azure TTS failed:', error);
    throw error;
  }
}

// High-quality OpenAI TTS for natural human-like voices - OPTIMIZED FOR SPEED
async function openAITextToSpeech(text: string, language: string = 'en'): Promise<void> {
  try {
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using browser TTS instead of OpenAI API');
      return browserTTS(text, language);
    }

    const startTime = Date.now();

    // Clean the text - do this in parallel with API call
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

    // For very long text, truncate to prevent delays
    const maxLength = 4000; // Optimal length for speed
    const finalText = cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...' 
      : cleanText;

    // Get user's preferred voice or use defaults
    const userPreferredVoice = localStorage.getItem('preferredVoice');
    
    // Select voice based on language
    const voiceMap: { [key: string]: string } = {
      'en': userPreferredVoice || 'nova',
      'hi': 'shimmer',
      'ta': 'nova',
      'te': 'nova',
      'ml': 'nova'
    };

    const selectedVoice = voiceMap[language] || 'nova';
    
    console.log('OpenAI TTS: Starting fast speech generation...');

    // Create a fresh audio element for OpenAI (don't reuse)
    const audio = new Audio();
    audio.volume = 1.0;
    currentAudio = audio;
    allActiveAudios.add(audio);

    // Use standard quality for faster response (tts-1 instead of tts-1-hd)
    const response = await openai.audio.speech.create({
      model: 'tts-1', // Standard quality for 2x faster generation
      voice: selectedVoice as any,
      input: finalText,
      speed: 1.0,
      response_format: 'mp3' // MP3 is faster than other formats
    });

    console.log(`OpenAI TTS: API response received in ${Date.now() - startTime}ms`);

    // Start processing audio data immediately
    const audioData = await response.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Set source
    audio.src = audioUrl;
    
    // Wait for audio to be ready before playing
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = async () => {
        try {
          await audio.play();
          console.log(`OpenAI TTS: Playback started in ${Date.now() - startTime}ms`);
        } catch (playError) {
          console.error('OpenAI TTS: Play failed', playError);
          reject(playError);
          return;
        }
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        allActiveAudios.delete(audio);
        currentAudio = null;
        audio.src = '';
        console.log('OpenAI TTS: Playback completed');
        resolve();
      };

      audio.onerror = (event) => {
        console.error('OpenAI TTS: Audio error', event);
        URL.revokeObjectURL(audioUrl);
        allActiveAudios.delete(audio);
        currentAudio = null;
        audio.src = '';
        reject(new Error('Audio playback failed'));
      };
      
      // Handle abort/pause
      audio.onpause = () => {
        if (!audio.ended) {
          console.log('OpenAI TTS: Audio paused/stopped');
          URL.revokeObjectURL(audioUrl);
          allActiveAudios.delete(audio);
          currentAudio = null;
          audio.src = '';
          resolve(); // Resolve instead of reject when paused
        }
      };
    });
  } catch (error) {
    console.error('OpenAI TTS failed:', error);
    throw error;
  }
}

// Queue for managing concurrent TTS requests - make it global for access

const ttsRequestQueue: Array<() => Promise<void>> = [];
window.ttsRequestQueue = ttsRequestQueue;
let isProcessingTTSQueue = false;

async function processTTSRequestQueue() {
  if (isProcessingTTSQueue || ttsRequestQueue.length === 0) return;
  
  isProcessingTTSQueue = true;
  
  while (ttsRequestQueue.length > 0) {
    const request = ttsRequestQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('TTS queue processing error:', error);
      }
    }
  }
  
  isProcessingTTSQueue = false;
}

export async function textToSpeech(text: string, language?: string, skipQueue: boolean = false): Promise<void> {
  // If skipQueue is true, process immediately (for progressive TTS)
  if (!skipQueue) {
    // Add to queue for sequential processing
    return new Promise((resolve, reject) => {
      ttsRequestQueue.push(async () => {
        try {
          await textToSpeech(text, language, true);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      processTTSRequestQueue();
    });
  }

  try {
    console.log('TTS called with text length:', text.length, 'chars');
    
    if (!text || text.trim() === '') {
      console.log('TTS: Empty text, skipping');
      return;
    }
    
    // Check if audio was stopped (for progressive TTS)
    if (allActiveAudios.size === 0 && !window.speechSynthesis.speaking && !currentAudio) {
      console.log('TTS: Audio was stopped, not starting new playback');
      return;
    }

    // Don't stop audio for progressive playback
    // Only stop if it's a new message (not progressive)
    if (text.length > 200 && !skipQueue) {
      stopCurrentAudio();
    }

    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const preferredProvider = localStorage.getItem('preferredTTSProvider') || 'elevenlabs';
    
    // Try preferred provider first
    console.log(`TTS: Using ${preferredProvider} provider for chunk`);
    
    // ElevenLabs - Ultra realistic voices
    if (preferredProvider === 'elevenlabs' && import.meta.env.VITE_ELEVENLABS_API_KEY) {
      try {
        console.log('TTS: Processing chunk with ElevenLabs...');
        await elevenLabsTTS(text, userLanguage);
        console.log('TTS: Chunk completed successfully');
        return;
      } catch (error) {
        console.error('TTS: ElevenLabs failed', error);
      }
    }
    
    // Google Cloud - High quality neural voices
    if (preferredProvider === 'google' && import.meta.env.VITE_GOOGLE_CLOUD_API_KEY) {
      try {
        console.log('TTS: Attempting Google Cloud neural voice...');
        await googleCloudTTS(text, userLanguage);
        console.log('TTS: Google Cloud completed successfully');
        return;
      } catch (error) {
        console.error('TTS: Google Cloud failed', error);
        // Continue to next provider
      }
    }
    
    // Azure - Microsoft neural voices
    if (preferredProvider === 'azure' && import.meta.env.VITE_AZURE_SPEECH_KEY) {
      try {
        console.log('TTS: Attempting Azure neural voice...');
        await azureTTS(text, userLanguage);
        console.log('TTS: Azure completed successfully');
        return;
      } catch (error) {
        console.error('TTS: Azure failed', error);
        // Continue to next provider
      }
    }
    
    // OpenAI - Natural voices (fallback if preferred provider fails)
    if (preferredProvider === 'openai' && import.meta.env.VITE_OPENAI_API_KEY) {
      try {
        console.log('TTS: Attempting OpenAI natural voice...');
        await openAITextToSpeech(text, userLanguage);
        console.log('TTS: OpenAI completed successfully');
        return;
      } catch (error) {
        console.error('TTS: OpenAI failed', error);
        // Continue to next provider
      }
    }
    
    // Try any available provider as fallback
    if (preferredProvider !== 'elevenlabs' && import.meta.env.VITE_ELEVENLABS_API_KEY) {
      try {
        console.log('TTS: Falling back to ElevenLabs...');
        await elevenLabsTTS(text, userLanguage);
        return;
      } catch (error) {
        console.error('TTS: ElevenLabs fallback failed', error);
      }
    }
    
    if (preferredProvider !== 'openai' && import.meta.env.VITE_OPENAI_API_KEY) {
      try {
        console.log('TTS: Falling back to OpenAI...');
        await openAITextToSpeech(text, userLanguage);
        return;
      } catch (error) {
        console.error('TTS: OpenAI fallback failed', error);
      }
    }

    // Fallback to browser TTS - DISABLED when OpenAI is available
    console.log('TTS: Browser TTS fallback is disabled when OpenAI API is configured');
    
    // If we're in demo mode or no API keys, always use browser TTS  
    if (isDemoMode) {
      console.log('TTS: Demo mode, using browser TTS');
      
      // Clean the text by removing markdown and special characters
      const cleanText = text
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '') // Remove italic markers
        .replace(/`/g, '') // Remove code markers
        .replace(/#/g, '') // Remove heading markers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/\n\n/g, '. ') // Replace double newlines with periods
        .replace(/\n/g, ' ') // Replace single newlines with spaces
        .trim();
      
      console.log('TTS: Cleaned text:', cleanText.substring(0, 100) + '...');
      
      // For debugging, let's try a simple approach first
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = userLanguage;
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      currentUtterance = utterance;
      
      utterance.onstart = () => {
        console.log('TTS: Browser speech started successfully');
      };
      
      utterance.onend = () => {
        console.log('TTS: Browser speech ended');
        currentUtterance = null;
      };
      
      utterance.onerror = (event) => {
        console.error('TTS: Browser speech error:', event);
        currentUtterance = null;
      };
      
      // Add a small delay before speaking
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        console.log('TTS: Browser speak command issued after delay');
      }, 100);
      
      // Wait for speech to complete
      await new Promise<void>((resolve) => {
        utterance.onend = () => {
          currentUtterance = null;
          resolve();
        };
        utterance.onerror = () => {
          currentUtterance = null;
          resolve();
        };
      });
    }
    
  } catch (error) {
    console.error('Error in text to speech:', error);
    stopCurrentAudio();
    throw error;
  }
}

// Streaming chat response for faster perceived performance
export async function getClaudeChatResponseStream(
  messages: ChatMessage[],
  subject: string,
  topic: string,
  language: string = 'en',
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  try {
    // Use demo mode if no API keys available
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using demo streaming response');
      const demoResponse = getDemoResponse(subject, topic, language);
      
      // Simulate streaming by sending chunks
      const words = demoResponse.split(' ');
      let fullResponse = '';
      
      for (const word of words) {
        if (signal?.aborted) break;
        
        const chunk = word + ' ';
        fullResponse += chunk;
        onChunk(chunk);
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }
      
      return fullResponse.trim();
    }

    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const languageConfig = supportedLanguages[userLanguage as keyof typeof supportedLanguages];
    const languageName = languageConfig?.prompt || 'English';

    // Create system prompt with enhanced multilingual support
    const systemPrompt = `You are an expert AI tutor specializing in ${subject}, particularly knowledgeable about ${topic}. 

IMPORTANT FORMATTING RULES:
1. You MUST respond ONLY in ${languageName}. Do not mix languages unless specifically requested.
2. DO NOT use any markdown formatting in your responses. No asterisks (*), underscores (_), backticks (\`), or other markdown symbols.
3. Use plain text only. For emphasis, use CAPITAL LETTERS or descriptive language instead of formatting.
4. For lists, use simple dashes (-) or numbers (1., 2., etc.) without any special formatting.

Your responses should be:
1. Comprehensive and Detailed: Provide thorough explanations that cover all aspects of the topic
2. Well-Structured: Organize your response with clear sections, bullet points, or numbered lists when appropriate
3. Rich with Examples: Include multiple relevant examples, case studies, and real-world applications
4. Educational Depth: Explain not just the "what" but also the "why" and "how" behind concepts
5. Progressive Learning: Start with fundamentals and build up to more complex ideas
6. Interactive and Engaging: Suggest exercises, thought experiments, or questions for deeper understanding
7. Visual Descriptions: When applicable, describe diagrams, charts, or visual representations that would help understanding
8. Common Misconceptions: Address typical errors or misunderstandings students might have
9. Connections: Link concepts to related topics and show how they fit into the broader subject area
10. Practical Applications: Emphasize real-world uses and career relevance

${userLanguage === 'hi' ? 'कृपया केवल हिंदी में उत्तर दें। विस्तृत और व्यापक उत्तर प्रदान करें।' : ''}
${userLanguage === 'ta' ? 'தயவுசெய்து தமிழில் மட்டுமே பதிலளிக்கவும். விரிவான மற்றும் முழுமையான பதில்களை வழங்கவும்.' : ''}
${userLanguage === 'te' ? 'దయచేసి తెలుగులో మాత్రమే సమాధానం ఇవ్వండి. వివరణాత్మక మరియు సమగ్ర సమాధానాలు అందించండి.' : ''}

Remember: This is an educational platform, so prioritize learning outcomes. Your responses should be thorough enough that students gain a deep understanding of the topic. Don't hesitate to provide lengthy explanations when needed - comprehensive education is more important than brevity.`;

    // Ensure we have valid messages
    if (!messages || messages.length === 0) {
      const defaultMessage = `Hello! I'm your AI tutor for ${topic} in ${subject}. How can I help you learn today?`;
      onChunk(defaultMessage);
      return defaultMessage;
    }

    // Convert messages to OpenAI format
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Use OpenAI GPT-4-turbo for fast, high-quality responses with streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Latest fast model
      messages: openAIMessages,
      max_tokens: 2000,
      temperature: 0.7,
      stream: true, // Enable streaming for faster perceived response
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    // Collect the streamed response
    let fullResponse = '';
    for await (const chunk of stream) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log('Stream aborted by user');
        break;
      }
      
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunk(content); // Send chunk to UI immediately
      }
    }

    return fullResponse || "I apologize, but I couldn't generate a response. Please try again.";

  } catch (error: any) {
    console.error('Error getting AI response:', error);
    
    // If aborted, return what we have so far
    if (signal?.aborted) {
      return '';
    }
    
    // Try Claude as fallback if OpenAI fails
    try {
      const claudeMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        temperature: 0.7,
        system: `You are an expert AI tutor for ${topic} in ${subject}. 
        
IMPORTANT: DO NOT use any markdown formatting. Use plain text only. No asterisks, underscores, backticks, or other markdown symbols.

Provide comprehensive, detailed educational responses with examples, explanations, and practical applications. Focus on helping students deeply understand the concepts.`,
        messages: claudeMessages
      });

      const textContent = response.content.find(content => content.type === 'text');
      const fallbackResponse = textContent?.text || "I apologize, but I couldn't generate a response. Please try again.";
      onChunk(fallbackResponse);
      return fallbackResponse;
    } catch (claudeError) {
      console.error('Claude fallback also failed:', claudeError);
    }
    
    if (error.message?.includes('API key')) {
      const errorMsg = "Please check your API key configuration. The API key may be missing or invalid.";
      onChunk(errorMsg);
      return errorMsg;
    }
    
    if (error.status === 429) {
      const errorMsg = "I'm receiving too many requests right now. Please wait a moment and try again.";
      onChunk(errorMsg);
      return errorMsg;
    }
    
    if (error.status === 401) {
      const errorMsg = "Authentication failed. Please check your API key configuration.";
      onChunk(errorMsg);
      return errorMsg;
    }
    
    const errorMsg = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    onChunk(errorMsg);
    return errorMsg;
  }
}

// Default FAQs fallback
const defaultFAQs = [
  {
    id: 'default-1',
    question: 'What are the key concepts I should focus on?',
    answer: 'Focus on understanding the fundamental principles, main theories, and how they apply in practice. Build a strong foundation before moving to advanced topics.',
    isOpen: false
  },
  {
    id: 'default-2',
    question: 'How can I better understand this topic?',
    answer: 'Try connecting the concepts to real-world examples, practice with different scenarios, and ask questions about anything that seems unclear.',
    isOpen: false
  },
  {
    id: 'default-3',
    question: 'What should I study next?',
    answer: 'Consider the prerequisites and logical progression of topics. Build on what you have learned and gradually tackle more complex concepts.',
    isOpen: false
  }
];