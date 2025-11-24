// eUstaad Personal AI Agent Types

export type EUstaadAnimationState =
  | 'idle'                // Normal floating state
  | 'analyzing'           // Processing user activity
  | 'celebrating'         // Achievement unlocked
  | 'concerned'           // Low performance detected
  | 'navigating'          // User is navigating
  | 'interacting'         // User clicked something
  | 'thinking'            // Deep processing/problem solving
  | 'sleeping'            // Inactive/resting state
  | 'excited'             // High energy/new session
  | 'encouraging'         // Motivational state
  | 'learning'            // Active study mode
  | 'warning'             // Deadline/alert state
  | 'focus'               // Concentration mode
  | 'celebrating-streak'  // Streak achievement
  | 'typing';             // User is typing

export interface UserActivity {
  id: string;
  type: 'navigation' | 'click' | 'test' | 'class' | 'resource' | 'quiz';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DigitalUsageMetrics {
  totalScreenTime: number; // in minutes
  learningTime: number;
  socialTime: number;
  breakTime: number;
  lastUpdated: Date;
}

export interface HealthMetrics {
  activityLevel: 'low' | 'moderate' | 'high';
  sleepQuality: number; // 0-100
  stressLevel: number; // 0-100
  wellnessScore: number; // 0-100
}

export interface MentalHealthMetrics {
  moodScore: number; // 0-100
  stressLevel: number; // 0-100
  anxietyLevel: number; // 0-100
  copingEffectiveness: number; // 0-100
  recentMoods: Array<{
    date: Date;
    mood: 'happy' | 'neutral' | 'sad' | 'stressed' | 'anxious';
    note?: string;
  }>;
}

export interface BehavioralTrait {
  trait: string;
  score: number; // 0-100
  description: string;
  celebMatches: Array<{
    name: string;
    profession: string;
    matchPercentage: number;
    reasoning: string;
  }>;
  improvementTips: string[];
}

export interface RedFlag {
  id: string;
  category: 'performance' | 'engagement' | 'health' | 'mental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: Date;
  actionItems: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  gap: number;
  priority: 'high' | 'medium' | 'low';
  improvementPlan: {
    steps: string[];
    estimatedTime: string;
    resources: string[];
  };
}

export interface EUstaadState {
  // Agent state
  animationState: EUstaadAnimationState;
  isVisible: boolean;
  consentGiven: boolean;

  // Position
  position: { x: number; y: number };

  // Activity tracking
  recentActivities: UserActivity[];
  totalInteractions: number;
  navigationCount: number;

  // Metrics
  digitalUsage: DigitalUsageMetrics;
  health: HealthMetrics;
  mentalHealth: MentalHealthMetrics;

  // Analytics
  skillGaps: SkillGap[];
  behavioralTraits: BehavioralTrait[];
  redFlags: RedFlag[];

  // Actions
  setAnimationState: (state: EUstaadAnimationState) => void;
  recordActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  giveConsent: () => void;
  revokeConsent: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateDigitalUsage: (metrics: Partial<DigitalUsageMetrics>) => void;
  updateHealth: (metrics: Partial<HealthMetrics>) => void;
  updateMentalHealth: (metrics: Partial<MentalHealthMetrics>) => void;
  addRedFlag: (flag: Omit<RedFlag, 'id' | 'detectedAt'>) => void;
  removeRedFlag: (id: string) => void;
  updateSkillGaps: (gaps: SkillGap[]) => void;
}
