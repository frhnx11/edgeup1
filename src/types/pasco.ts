// PASCO Assessment Types
export interface PASCOTestState {
  answers: Record<string, any>;
  scores: {
    cognitive: Record<string, number>;
    personality: Record<string, number>;
    emotional: Record<string, number>;
    psychological: Record<string, number>;
  };
  startTime: Date;
  endTime?: Date;
  completedSections: string[];
}

export interface CognitiveProfile {
  overallIQ: number;
  fluidIQ: number;
  crystallizedIQ: number;
  workingMemory: number;
  processingSpeed: number;
  logicalReasoning: number;
  spatialReasoning: number;
  verbalComprehension: number;
}

export interface PersonalityProfile {
  vark: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
    dominantStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    multimodal: boolean;
  };
  grit: {
    overall: number;
    perseverance: number;
    passion: number;
    resilienceScore: number;
  };
  bigFive?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export interface EmotionalProfile {
  overallEQ: number;
  selfAwareness: number;
  selfRegulation: number;
  empathy: number;
  socialSkills: number;
  motivation: number;
  emotionalRegulation: 'strong' | 'developing' | 'needs_support';
  interpersonalEffectiveness: 'high' | 'moderate' | 'developing';
}

export interface PsychologicalProfile {
  overallWellness: number;
  engagement: {
    overall: number;
    excitementLevel: number;
  };
  clarity: {
    overall: number;
    helpSeekingBehavior: 'proactive' | 'moderate' | 'reluctant';
  };
  confidence: {
    overall: number;
    calibration: number;
  };
  stressIndicators: {
    level: 'low' | 'moderate' | 'high';
    primarySources: string[];
    copingEffectiveness: number;
  };
  needsCheck: {
    supportRecommended: boolean;
    urgency: 'none' | 'low' | 'moderate' | 'high';
  };
}

export interface AptitudeProfile {
  recommendedFields: Array<{
    field: string;
    score: number;
    reasoning: string;
  }>;
}

export interface SkillsProfile {
  studySkills: {
    timeManagement: number;
    noteTaking: number;
    informationRetention: number;
    conceptApplication: number;
  };
  technicalSkills?: Record<string, number>;
}

export interface LearnerProfile {
  cognitive: CognitiveProfile;
  personality: PersonalityProfile;
  emotional: EmotionalProfile;
  psychological: PsychologicalProfile;
  aptitude: AptitudeProfile;
  skills: SkillsProfile;
  timestamp: Date;
}

export interface InsightItem {
  dimension: string;
  score: number;
  description: string;
  actionableAdvice?: string;
  supportiveGuidance?: string;
  resources?: string[];
}

export interface LearningStrategy {
  strategy: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyEnvironment {
  optimalSetting: string;
  timeOfDay: string;
  duration: string;
  breakStrategy: string;
}

export interface Recommendations {
  learningStrategies: LearningStrategy[];
  studyEnvironment: StudyEnvironment;
  supportServices?: string[];
}

export interface Insights {
  strengths: InsightItem[];
  growthAreas: InsightItem[];
  uniqueTraits: string[];
}

export interface ProgressIndicators {
  baselineEstablished: boolean;
  nextAssessmentRecommended: Date;
  focusAreas: string[];
}

export interface PASCOResults {
  learnerProfile: LearnerProfile;
  insights: Insights;
  recommendations: Recommendations;
  progressIndicators: ProgressIndicators;
}
