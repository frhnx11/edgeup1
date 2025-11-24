/**
 * AI Context Service
 * Manages conversation context, user learning patterns, and personalized AI interactions
 */

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    subject?: string;
    topic?: string;
    sentiment?: 'positive' | 'neutral' | 'confused' | 'frustrated';
    difficulty?: 'easy' | 'medium' | 'hard';
    concepts?: string[];
  };
}

interface UserLearningProfile {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  preferences: {
    learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    difficultyPreference?: 'easy' | 'medium' | 'hard';
    language?: string;
    ttsProvider?: string;
    voicePreference?: string;
  };
  recentTopics: Array<{
    subject: string;
    topic: string;
    timestamp: number;
    performanceScore?: number;
  }>;
  conversationHistory: Map<string, ConversationMessage[]>; // sessionId -> messages
  lastActive: number;
}

interface ConversationSession {
  sessionId: string;
  subject: string;
  topic: string;
  startTime: number;
  messages: ConversationMessage[];
  contextSummary?: string; // AI-generated summary of the conversation
  keyTopicsCovered: string[];
  questionsAsked: number;
  clarificationsNeeded: number;
}

class AIContextService {
  private static instance: AIContextService;
  private userProfile: UserLearningProfile | null = null;
  private currentSession: ConversationSession | null = null;
  private readonly MAX_CONTEXT_MESSAGES = 20; // Keep last 20 messages for context
  private readonly MAX_SESSION_HISTORY = 10; // Keep last 10 sessions

  private constructor() {
    this.loadUserProfile();
  }

  static getInstance(): AIContextService {
    if (!AIContextService.instance) {
      AIContextService.instance = new AIContextService();
    }
    return AIContextService.instance;
  }

  /**
   * Initialize or load user learning profile
   */
  private loadUserProfile(): void {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.id || 'guest';

    const stored = localStorage.getItem(`aiProfile_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.userProfile = {
        ...parsed,
        conversationHistory: new Map(Object.entries(parsed.conversationHistory || {}))
      };
    } else {
      this.userProfile = {
        userId,
        strengths: [],
        weaknesses: [],
        preferences: {
          language: localStorage.getItem('lastUsedLanguage') || 'en',
          ttsProvider: localStorage.getItem('preferredTTSProvider') || 'elevenlabs',
          voicePreference: localStorage.getItem('preferredVoice') || 'nova'
        },
        recentTopics: [],
        conversationHistory: new Map(),
        lastActive: Date.now()
      };
    }
  }

  /**
   * Save user profile to localStorage
   */
  private saveUserProfile(): void {
    if (!this.userProfile) return;

    const toSave = {
      ...this.userProfile,
      conversationHistory: Object.fromEntries(this.userProfile.conversationHistory)
    };

    localStorage.setItem(`aiProfile_${this.userProfile.userId}`, JSON.stringify(toSave));
  }

  /**
   * Start a new conversation session
   */
  startSession(subject: string, topic: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.currentSession = {
      sessionId,
      subject,
      topic,
      startTime: Date.now(),
      messages: [],
      keyTopicsCovered: [],
      questionsAsked: 0,
      clarificationsNeeded: 0
    };

    // Update recent topics
    if (this.userProfile) {
      this.userProfile.recentTopics.unshift({
        subject,
        topic,
        timestamp: Date.now()
      });

      // Keep only last 20 topics
      this.userProfile.recentTopics = this.userProfile.recentTopics.slice(0, 20);
      this.userProfile.lastActive = Date.now();
      this.saveUserProfile();
    }

    return sessionId;
  }

  /**
   * Add message to current session with metadata
   */
  addMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: ConversationMessage['metadata']
  ): void {
    if (!this.currentSession) return;

    const message: ConversationMessage = {
      role,
      content,
      timestamp: Date.now(),
      metadata
    };

    this.currentSession.messages.push(message);

    // Update session statistics
    if (role === 'user') {
      this.currentSession.questionsAsked++;

      // Detect if user is asking for clarification
      const clarificationKeywords = ['what', 'how', 'why', 'explain', 'clarify', 'confused', 'don\'t understand'];
      if (clarificationKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
        this.currentSession.clarificationsNeeded++;
      }
    }

    // Extract and track key topics mentioned
    if (metadata?.concepts) {
      metadata.concepts.forEach(concept => {
        if (!this.currentSession!.keyTopicsCovered.includes(concept)) {
          this.currentSession!.keyTopicsCovered.push(concept);
        }
      });
    }

    // Store in user profile
    if (this.userProfile) {
      this.userProfile.conversationHistory.set(
        this.currentSession.sessionId,
        this.currentSession.messages
      );

      // Trim old sessions if needed
      if (this.userProfile.conversationHistory.size > this.MAX_SESSION_HISTORY) {
        const sessions = Array.from(this.userProfile.conversationHistory.keys());
        const oldestSession = sessions[0];
        this.userProfile.conversationHistory.delete(oldestSession);
      }

      this.saveUserProfile();
    }
  }

  /**
   * Get context for AI including conversation history and user profile
   */
  getContext(): {
    recentMessages: ConversationMessage[];
    userStrengths: string[];
    userWeaknesses: string[];
    recentTopics: string[];
    learningStyle?: string;
    sessionStats: {
      questionsAsked: number;
      clarificationsNeeded: number;
      topicsCovered: string[];
    };
  } {
    const recentMessages = this.currentSession
      ? this.currentSession.messages.slice(-this.MAX_CONTEXT_MESSAGES)
      : [];

    return {
      recentMessages,
      userStrengths: this.userProfile?.strengths || [],
      userWeaknesses: this.userProfile?.weaknesses || [],
      recentTopics: this.userProfile?.recentTopics.map(t => `${t.subject}: ${t.topic}`).slice(0, 5) || [],
      learningStyle: this.userProfile?.preferences.learningStyle,
      sessionStats: this.currentSession ? {
        questionsAsked: this.currentSession.questionsAsked,
        clarificationsNeeded: this.currentSession.clarificationsNeeded,
        topicsCovered: this.currentSession.keyTopicsCovered
      } : {
        questionsAsked: 0,
        clarificationsNeeded: 0,
        topicsCovered: []
      }
    };
  }

  /**
   * Get enhanced system prompt with user context
   */
  getEnhancedSystemPrompt(subject: string, topic: string, language: string = 'en'): string {
    const context = this.getContext();

    let prompt = `You are an expert AI tutor specializing in ${subject}, particularly knowledgeable about ${topic}.

CONTEXT AWARENESS:
`;

    // Add user strengths if available
    if (context.userStrengths.length > 0) {
      prompt += `The student excels at: ${context.userStrengths.join(', ')}\n`;
    }

    // Add user weaknesses if available
    if (context.userWeaknesses.length > 0) {
      prompt += `The student needs help with: ${context.userWeaknesses.join(', ')}\n`;
    }

    // Add recent topics context
    if (context.recentTopics.length > 0) {
      prompt += `Recently studied: ${context.recentTopics.join(', ')}\n`;
    }

    // Add learning style if available
    if (context.learningStyle) {
      prompt += `Preferred learning style: ${context.learningStyle}\n`;
    }

    // Add session statistics
    if (context.sessionStats.clarificationsNeeded > 2) {
      prompt += `\nNOTE: The student has asked for clarification ${context.sessionStats.clarificationsNeeded} times. Please provide extra-clear explanations with more examples.\n`;
    }

    prompt += `\nINSTRUCTIONAL APPROACH:
1. Build on what the student already knows
2. Connect new concepts to previously studied topics
3. Provide examples tailored to their learning style
4. Be patient and thorough in explanations
5. Encourage critical thinking and active learning
6. Respond in ${language}
7. Use plain text formatting (no markdown)

Your goal is to provide personalized, context-aware education that adapts to this specific student's needs and learning journey.`;

    return prompt;
  }

  /**
   * Update user strengths based on performance
   */
  updateStrengths(concepts: string[]): void {
    if (!this.userProfile) return;

    concepts.forEach(concept => {
      if (!this.userProfile!.strengths.includes(concept)) {
        this.userProfile!.strengths.push(concept);
      }
      // Remove from weaknesses if present
      this.userProfile!.weaknesses = this.userProfile!.weaknesses.filter(w => w !== concept);
    });

    this.saveUserProfile();
  }

  /**
   * Update user weaknesses based on struggles
   */
  updateWeaknesses(concepts: string[]): void {
    if (!this.userProfile) return;

    concepts.forEach(concept => {
      if (!this.userProfile!.weaknesses.includes(concept) && !this.userProfile!.strengths.includes(concept)) {
        this.userProfile!.weaknesses.push(concept);
      }
    });

    // Keep only top 10 weaknesses
    this.userProfile.weaknesses = this.userProfile.weaknesses.slice(0, 10);
    this.saveUserProfile();
  }

  /**
   * Get personalized topic suggestions based on user profile
   */
  getPersonalizedSuggestions(): string[] {
    if (!this.userProfile) return [];

    const suggestions: string[] = [];

    // Suggest review of weak areas
    if (this.userProfile.weaknesses.length > 0) {
      suggestions.push(`Review: ${this.userProfile.weaknesses[0]}`);
    }

    // Suggest building on strengths
    if (this.userProfile.strengths.length > 0) {
      suggestions.push(`Advanced topic in: ${this.userProfile.strengths[0]}`);
    }

    // Suggest related topics to recent studies
    if (this.userProfile.recentTopics.length > 0) {
      const recentTopic = this.userProfile.recentTopics[0];
      suggestions.push(`Continue with: ${recentTopic.topic}`);
    }

    return suggestions;
  }

  /**
   * Get conversation summary for review
   */
  getSessionSummary(): {
    duration: number;
    messageCount: number;
    topicsCovered: string[];
    questionsAsked: number;
    clarificationsNeeded: number;
  } | null {
    if (!this.currentSession) return null;

    return {
      duration: Date.now() - this.currentSession.startTime,
      messageCount: this.currentSession.messages.length,
      topicsCovered: this.currentSession.keyTopicsCovered,
      questionsAsked: this.currentSession.questionsAsked,
      clarificationsNeeded: this.currentSession.clarificationsNeeded
    };
  }

  /**
   * End current session
   */
  endSession(): void {
    if (this.currentSession && this.userProfile) {
      // Store final session state
      this.userProfile.conversationHistory.set(
        this.currentSession.sessionId,
        this.currentSession.messages
      );
      this.saveUserProfile();
    }
    this.currentSession = null;
  }

  /**
   * Clear all data (for privacy/logout)
   */
  clearUserData(): void {
    if (this.userProfile) {
      localStorage.removeItem(`aiProfile_${this.userProfile.userId}`);
    }
    this.userProfile = null;
    this.currentSession = null;
  }

  /**
   * Get user preferences
   */
  getPreferences() {
    return this.userProfile?.preferences || {
      language: 'en',
      ttsProvider: 'elevenlabs',
      voicePreference: 'nova'
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserLearningProfile['preferences']>): void {
    if (!this.userProfile) return;

    this.userProfile.preferences = {
      ...this.userProfile.preferences,
      ...preferences
    };

    // Also update localStorage for immediate use
    if (preferences.language) {
      localStorage.setItem('lastUsedLanguage', preferences.language);
    }
    if (preferences.ttsProvider) {
      localStorage.setItem('preferredTTSProvider', preferences.ttsProvider);
    }
    if (preferences.voicePreference) {
      localStorage.setItem('preferredVoice', preferences.voicePreference);
    }

    this.saveUserProfile();
  }
}

export default AIContextService;
export type { ConversationMessage, UserLearningProfile, ConversationSession };
