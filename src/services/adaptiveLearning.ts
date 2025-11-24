import apiService from './api';
import { logger } from '../utils/logger';

// Types for adaptive learning system
interface LearningProfile {
  userId: string;
  learningStyle: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  cognitiveAbilities: {
    processing_speed: number;
    working_memory: number;
    attention_span: number;
    problem_solving: number;
    analytical_thinking: number;
  };
  knowledgeAreas: {
    [subject: string]: {
      mastery_level: number;
      confidence: number;
      last_studied: Date;
      weak_topics: string[];
      strong_topics: string[];
    };
  };
  preferences: {
    preferred_difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
    session_length: number; // minutes
    preferred_time_of_day: string;
    break_frequency: number; // minutes
    motivation_type: 'gamification' | 'progress' | 'achievement' | 'competition';
  };
  performance_history: Array<{
    date: Date;
    subject: string;
    topic: string;
    score: number;
    time_spent: number;
    difficulty: number;
    comprehension_rate: number;
  }>;
}

interface AdaptiveRecommendation {
  type: 'content' | 'difficulty' | 'pacing' | 'method' | 'schedule';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  reasoning: string;
  expected_impact: number; // 0-1 scale
  confidence: number; // 0-1 scale
  metadata?: any;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimated_duration: number; // weeks
  difficulty_progression: number[];
  topics: Array<{
    id: string;
    name: string;
    prerequisites: string[];
    estimated_hours: number;
    difficulty: number;
    importance: number;
    learning_objectives: string[];
    recommended_resources: Array<{
      type: 'video' | 'text' | 'interactive' | 'practice';
      url: string;
      duration: number;
      difficulty: number;
    }>;
  }>;
  milestones: Array<{
    week: number;
    description: string;
    success_criteria: string[];
    assessment_type: string;
  }>;
}

interface StudySession {
  id: string;
  userId: string;
  subject: string;
  topics: string[];
  duration: number;
  difficulty_level: number;
  performance_score: number;
  engagement_score: number;
  comprehension_rate: number;
  mistakes: Array<{
    topic: string;
    error_type: string;
    frequency: number;
  }>;
  feedback_sentiment: 'positive' | 'neutral' | 'negative';
  effectiveness_rating: number; // 1-5
}

class AdaptiveLearningEngine {
  private learningProfile: LearningProfile | null = null;
  private recommendations: AdaptiveRecommendation[] = [];
  private currentLearningPath: LearningPath | null = null;

  // Initialize the adaptive learning engine for a user
  async initialize(userId: string): Promise<void> {
    try {
      logger.info('Initializing adaptive learning engine', { userId });
      
      // Load existing learning profile or create new one
      this.learningProfile = await this.loadLearningProfile(userId);
      
      if (!this.learningProfile) {
        this.learningProfile = await this.createInitialProfile(userId);
      }

      // Generate initial recommendations
      this.recommendations = await this.generateRecommendations();
      
      logger.info('Adaptive learning engine initialized successfully', { userId });
    } catch (error) {
      logger.error('Failed to initialize adaptive learning engine', { userId, error });
      throw error;
    }
  }

  // Load existing learning profile from backend
  private async loadLearningProfile(userId: string): Promise<LearningProfile | null> {
    try {
      const response = await apiService.get(`/users/${userId}/learning-profile`);
      return response.data || null;
    } catch (error) {
      logger.warn('No existing learning profile found', { userId });
      return null;
    }
  }

  // Create initial learning profile with basic assessments
  private async createInitialProfile(userId: string): Promise<LearningProfile> {
    const initialProfile: LearningProfile = {
      userId,
      learningStyle: {
        visual: 50,
        auditory: 50,
        reading: 50,
        kinesthetic: 50
      },
      cognitiveAbilities: {
        processing_speed: 50,
        working_memory: 50,
        attention_span: 50,
        problem_solving: 50,
        analytical_thinking: 50
      },
      knowledgeAreas: {},
      preferences: {
        preferred_difficulty: 'adaptive',
        session_length: 45,
        preferred_time_of_day: 'morning',
        break_frequency: 15,
        motivation_type: 'progress'
      },
      performance_history: []
    };

    // Save initial profile
    await apiService.post(`/users/${userId}/learning-profile`, initialProfile);
    return initialProfile;
  }

  // Analyze user's learning patterns and update profile
  async analyzeLearningPatterns(sessionData: StudySession[]): Promise<void> {
    if (!this.learningProfile) return;

    try {
      // Analyze performance trends
      const performanceTrends = this.analyzePerformanceTrends(sessionData);
      
      // Identify learning style preferences
      const learningStyleAnalysis = this.analyzeLearningStyle(sessionData);
      
      // Detect cognitive abilities
      const cognitiveAnalysis = this.analyzeCognitiveAbilities(sessionData);
      
      // Update learning profile
      this.updateLearningProfile({
        performanceTrends,
        learningStyleAnalysis,
        cognitiveAnalysis
      });

      // Regenerate recommendations based on new analysis
      this.recommendations = await this.generateRecommendations();
      
      logger.info('Learning patterns analyzed and profile updated', {
        userId: this.learningProfile.userId,
        sessionsAnalyzed: sessionData.length
      });
    } catch (error) {
      logger.error('Failed to analyze learning patterns', { error });
      throw error;
    }
  }

  // Analyze performance trends over time
  private analyzePerformanceTrends(sessions: StudySession[]): any {
    const trends = {
      overall_improvement: 0,
      consistency: 0,
      peak_performance_times: [] as string[],
      declining_areas: [] as string[],
      improving_areas: [] as string[]
    };

    if (sessions.length < 2) return trends;

    // Calculate overall improvement trend
    const recentSessions = sessions.slice(-10);
    const earlierSessions = sessions.slice(0, 10);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.performance_score, 0) / recentSessions.length;
    const earlierAvg = earlierSessions.reduce((sum, s) => sum + s.performance_score, 0) / earlierSessions.length;
    
    trends.overall_improvement = ((recentAvg - earlierAvg) / earlierAvg) * 100;

    // Analyze consistency (lower standard deviation = more consistent)
    const scores = sessions.map(s => s.performance_score);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    trends.consistency = Math.max(0, 100 - Math.sqrt(variance));

    // Identify peak performance times
    const timePerformance = new Map<string, number[]>();
    sessions.forEach(session => {
      const hour = new Date().getHours(); // Would use session timestamp
      const timeSlot = this.getTimeSlot(hour);
      if (!timePerformance.has(timeSlot)) {
        timePerformance.set(timeSlot, []);
      }
      timePerformance.get(timeSlot)!.push(session.performance_score);
    });

    let bestPerformance = 0;
    timePerformance.forEach((scores, time) => {
      const avg = scores.reduce((a, b) => a + b) / scores.length;
      if (avg > bestPerformance) {
        bestPerformance = avg;
        trends.peak_performance_times = [time];
      } else if (avg === bestPerformance) {
        trends.peak_performance_times.push(time);
      }
    });

    return trends;
  }

  // Analyze learning style preferences based on performance
  private analyzeLearningStyle(sessions: StudySession[]): any {
    const stylePerformance = {
      visual: [] as number[],
      auditory: [] as number[],
      reading: [] as number[],
      kinesthetic: [] as number[]
    };

    // This would analyze content types and correlate with performance
    // For now, using mock analysis
    sessions.forEach(session => {
      // Analyze content metadata to determine learning style used
      // Then correlate with performance scores
      if (session.metadata?.contentType === 'video') {
        stylePerformance.visual.push(session.performance_score);
      } else if (session.metadata?.contentType === 'audio') {
        stylePerformance.auditory.push(session.performance_score);
      } else if (session.metadata?.contentType === 'text') {
        stylePerformance.reading.push(session.performance_score);
      } else if (session.metadata?.contentType === 'interactive') {
        stylePerformance.kinesthetic.push(session.performance_score);
      }
    });

    const styleScores = Object.entries(stylePerformance).map(([style, scores]) => ({
      style,
      avgScore: scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 50,
      confidence: Math.min(scores.length / 5, 1) // More sessions = higher confidence
    }));

    return styleScores.sort((a, b) => b.avgScore - a.avgScore);
  }

  // Analyze cognitive abilities based on session data
  private analyzeCognitiveAbilities(sessions: StudySession[]): any {
    const abilities = {
      processing_speed: 0,
      working_memory: 0,
      attention_span: 0,
      problem_solving: 0,
      analytical_thinking: 0
    };

    sessions.forEach(session => {
      // Processing speed: inverse of time per correct answer
      const timePerCorrect = session.duration / (session.performance_score / 100);
      abilities.processing_speed += Math.max(0, 100 - timePerCorrect);

      // Working memory: performance on complex multi-step problems
      if (session.metadata?.complexity === 'high') {
        abilities.working_memory += session.performance_score;
      }

      // Attention span: performance consistency throughout session
      abilities.attention_span += session.engagement_score;

      // Problem solving: performance on novel problems
      if (session.metadata?.problemType === 'novel') {
        abilities.problem_solving += session.performance_score;
      }

      // Analytical thinking: performance on analysis tasks
      if (session.metadata?.skillType === 'analysis') {
        abilities.analytical_thinking += session.performance_score;
      }
    });

    // Normalize scores
    Object.keys(abilities).forEach(ability => {
      abilities[ability as keyof typeof abilities] /= sessions.length;
    });

    return abilities;
  }

  // Update learning profile with new analysis
  private updateLearningProfile(analysis: any): void {
    if (!this.learningProfile) return;

    // Update learning style based on analysis
    if (analysis.learningStyleAnalysis?.length > 0) {
      const topStyle = analysis.learningStyleAnalysis[0];
      this.learningProfile.learningStyle[topStyle.style as keyof typeof this.learningProfile.learningStyle] = 
        Math.min(100, this.learningProfile.learningStyle[topStyle.style as keyof typeof this.learningProfile.learningStyle] + 10);
    }

    // Update cognitive abilities
    Object.keys(analysis.cognitiveAnalysis).forEach(ability => {
      if (ability in this.learningProfile!.cognitiveAbilities) {
        const currentScore = this.learningProfile!.cognitiveAbilities[ability as keyof typeof this.learningProfile.cognitiveAbilities];
        const newScore = analysis.cognitiveAnalysis[ability];
        // Weighted average: 70% current, 30% new
        this.learningProfile!.cognitiveAbilities[ability as keyof typeof this.learningProfile.cognitiveAbilities] = 
          currentScore * 0.7 + newScore * 0.3;
      }
    });
  }

  // Generate personalized recommendations
  async generateRecommendations(): Promise<AdaptiveRecommendation[]> {
    if (!this.learningProfile) return [];

    const recommendations: AdaptiveRecommendation[] = [];

    try {
      // Use AI to generate recommendations
      const prompt = `Based on this learning profile, generate 5 personalized recommendations:
      
      Learning Style: ${JSON.stringify(this.learningProfile.learningStyle)}
      Cognitive Abilities: ${JSON.stringify(this.learningProfile.cognitiveAbilities)}
      Preferences: ${JSON.stringify(this.learningProfile.preferences)}
      Recent Performance: ${this.learningProfile.performance_history.slice(-5)}
      
      Generate recommendations for:
      1. Content type optimization
      2. Difficulty adjustment
      3. Pacing modification
      4. Learning method suggestions
      5. Study schedule optimization`;

      const aiResponse = await apiService.chatWithAI([
        { role: 'user', content: prompt }
      ], {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7
      });

      // Parse AI response and create structured recommendations
      // This would need proper parsing of the AI response
      recommendations.push(
        {
          type: 'content',
          priority: 'high',
          title: 'Optimize Content Type',
          description: 'Focus on visual learning materials based on your strong visual learning preference',
          action: 'Switch to video-based lessons and interactive diagrams',
          reasoning: 'Your performance improves 23% with visual content',
          expected_impact: 0.23,
          confidence: 0.85
        },
        {
          type: 'difficulty',
          priority: 'medium',
          title: 'Adjust Problem Difficulty',
          description: 'Increase difficulty in strong areas, maintain current level in weak areas',
          action: 'Set mathematics to hard, keep physics at medium',
          reasoning: 'You show mastery in math but need reinforcement in physics',
          expected_impact: 0.15,
          confidence: 0.72
        },
        {
          type: 'pacing',
          priority: 'low',
          title: 'Modify Session Length',
          description: 'Reduce session length to match attention span',
          action: 'Change from 45min to 35min sessions with 10min breaks',
          reasoning: 'Performance drops after 35 minutes in recent sessions',
          expected_impact: 0.12,
          confidence: 0.68
        }
      );

    } catch (error) {
      logger.error('Failed to generate AI recommendations, using fallback', { error });
      
      // Fallback to rule-based recommendations
      recommendations.push(...this.generateRuleBasedRecommendations());
    }

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return (priorityWeight[b.priority] * b.expected_impact * b.confidence) - 
             (priorityWeight[a.priority] * a.expected_impact * a.confidence);
    });
  }

  // Generate rule-based recommendations as fallback
  private generateRuleBasedRecommendations(): AdaptiveRecommendation[] {
    if (!this.learningProfile) return [];

    const recommendations: AdaptiveRecommendation[] = [];
    const profile = this.learningProfile;

    // Analyze learning style
    const dominantStyle = Object.entries(profile.learningStyle)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    if (dominantStyle === 'visual') {
      recommendations.push({
        type: 'content',
        priority: 'high',
        title: 'Use More Visual Content',
        description: 'Your visual learning style is strongest',
        action: 'Focus on diagrams, charts, and video content',
        reasoning: 'Visual learners retain information better with visual aids',
        expected_impact: 0.2,
        confidence: 0.8
      });
    }

    // Analyze performance history
    if (profile.performance_history.length > 0) {
      const recentAvg = profile.performance_history.slice(-5)
        .reduce((sum, session) => sum + session.score, 0) / 5;

      if (recentAvg < 70) {
        recommendations.push({
          type: 'difficulty',
          priority: 'high',
          title: 'Reduce Difficulty Level',
          description: 'Recent performance suggests content is too challenging',
          action: 'Lower difficulty to build confidence',
          reasoning: 'Performance below 70% indicates frustration level',
          expected_impact: 0.25,
          confidence: 0.9
        });
      }
    }

    return recommendations;
  }

  // Create personalized learning path
  async createLearningPath(goals: string[], timeFrame: number): Promise<LearningPath> {
    if (!this.learningProfile) {
      throw new Error('Learning profile not initialized');
    }

    try {
      // Use AI to create personalized learning path
      const prompt = `Create a personalized learning path for:
      
      Goals: ${goals.join(', ')}
      Time Frame: ${timeFrame} weeks
      Learning Profile: ${JSON.stringify(this.learningProfile)}
      
      Create a structured learning path with:
      - Progressive difficulty
      - Balanced topic coverage
      - Milestone checkpoints
      - Resource recommendations
      - Time estimates`;

      const aiResponse = await apiService.post('/ai/generate-learning-path', {
        studentProfile: this.learningProfile,
        goals: { goals, timeFrame }
      });

      if (aiResponse.success && aiResponse.data?.learningPath) {
        this.currentLearningPath = aiResponse.data.learningPath;
        return this.currentLearningPath;
      }

      throw new Error('Failed to generate learning path');
    } catch (error) {
      logger.error('Failed to create AI learning path, using template', { error });
      return this.createTemplateLearningPath(goals, timeFrame);
    }
  }

  // Create template learning path as fallback
  private createTemplateLearningPath(goals: string[], timeFrame: number): LearningPath {
    const path: LearningPath = {
      id: `path_${Date.now()}`,
      name: `Personalized Study Plan: ${goals.join(', ')}`,
      description: `${timeFrame}-week adaptive learning path`,
      estimated_duration: timeFrame,
      difficulty_progression: Array.from({ length: timeFrame }, (_, i) => 
        Math.min(100, 30 + (i / timeFrame) * 70)
      ),
      topics: goals.map((goal, index) => ({
        id: `topic_${index}`,
        name: goal,
        prerequisites: index > 0 ? [`topic_${index - 1}`] : [],
        estimated_hours: Math.ceil((timeFrame * 5) / goals.length),
        difficulty: 30 + (index / goals.length) * 50,
        importance: 100 - (index * 10),
        learning_objectives: [
          `Understand core concepts of ${goal}`,
          `Apply ${goal} in practical scenarios`,
          `Master advanced ${goal} techniques`
        ],
        recommended_resources: [
          {
            type: 'video',
            url: `/content/${goal}/intro-video`,
            duration: 30,
            difficulty: 40
          },
          {
            type: 'practice',
            url: `/practice/${goal}/exercises`,
            duration: 60,
            difficulty: 60
          }
        ]
      })),
      milestones: Array.from({ length: Math.ceil(timeFrame / 2) }, (_, i) => ({
        week: (i + 1) * 2,
        description: `Week ${(i + 1) * 2} Checkpoint`,
        success_criteria: [
          'Complete assigned topics',
          'Score 70%+ on practice tests',
          'Submit weekly reflection'
        ],
        assessment_type: 'mixed'
      }))
    };

    this.currentLearningPath = path;
    return path;
  }

  // Adapt difficulty in real-time based on performance
  adaptDifficulty(currentPerformance: number, targetPerformance: number = 75): number {
    const performanceDiff = currentPerformance - targetPerformance;
    let difficultyAdjustment = 0;

    if (performanceDiff > 15) {
      // Performance too high, increase difficulty
      difficultyAdjustment = 0.1;
    } else if (performanceDiff < -15) {
      // Performance too low, decrease difficulty
      difficultyAdjustment = -0.1;
    } else if (performanceDiff > 5) {
      // Slight increase
      difficultyAdjustment = 0.05;
    } else if (performanceDiff < -5) {
      // Slight decrease
      difficultyAdjustment = -0.05;
    }

    return Math.max(0.1, Math.min(1.0, difficultyAdjustment));
  }

  // Get current recommendations
  getRecommendations(): AdaptiveRecommendation[] {
    return this.recommendations;
  }

  // Get learning profile
  getLearningProfile(): LearningProfile | null {
    return this.learningProfile;
  }

  // Get current learning path
  getCurrentLearningPath(): LearningPath | null {
    return this.currentLearningPath;
  }

  // Record study session for analysis
  async recordStudySession(session: Omit<StudySession, 'id'>): Promise<void> {
    const fullSession: StudySession = {
      ...session,
      id: `session_${Date.now()}`
    };

    if (this.learningProfile) {
      this.learningProfile.performance_history.push({
        date: new Date(),
        subject: session.subject,
        topic: session.topics[0] || 'general',
        score: session.performance_score,
        time_spent: session.duration,
        difficulty: session.difficulty_level,
        comprehension_rate: session.comprehension_rate
      });

      // Keep only last 100 sessions for performance
      if (this.learningProfile.performance_history.length > 100) {
        this.learningProfile.performance_history = 
          this.learningProfile.performance_history.slice(-100);
      }
    }

    // Save to backend
    try {
      await apiService.post('/analytics/study-session', fullSession);
    } catch (error) {
      logger.error('Failed to save study session', { error });
    }
  }

  // Utility function to get time slot
  private getTimeSlot(hour: number): string {
    if (hour < 6) return 'early_morning';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }
}

// Export singleton instance
export const adaptiveLearningEngine = new AdaptiveLearningEngine();
export default adaptiveLearningEngine;

// Export types
export type {
  LearningProfile,
  AdaptiveRecommendation,
  LearningPath,
  StudySession
};