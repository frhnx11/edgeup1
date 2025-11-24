// Student Module Type Definitions

// ============================================================================
// PERFORMANCE TRACKER TYPES
// ============================================================================

export interface OverallMetrics {
  currentGPA: number;
  averageScore: number;
  classRank: number;
  totalStudents: number;
  percentile: number;
  schoolPercentile: number;
  attendanceRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
}

export interface TrendData {
  month: string;
  score: number;
  gpa: number;
  rank: number;
  events?: string[]; // Major events that month (exams, competitions)
}

export interface ComparisonData {
  classAverage: number;
  schoolAverage: number;
  topScore: number;
  yourPercentile: number;
  schoolPercentile: number;
}

export interface ChapterData {
  id: string;
  name: string;
  mastery: number; // 0-100
  topics: {
    name: string;
    completed: boolean;
  }[];
}

export interface QuestionAccuracy {
  mcq: number;
  shortAnswer: number;
  longAnswer: number;
  practical: number;
}

export interface TestScore {
  date: string;
  score: number;
  testName: string;
}

export interface SubjectPerformance {
  id: string;
  name: string;
  color: string;
  currentScore: number;
  lastTenScores: TestScore[];
  trend: 'up' | 'down' | 'stable';
  improvementRate: number; // Percentage
  grade: string;
  classRank: number;
  totalStudents: number;
  classAverage: number;
  topScore: number;
  chapters: ChapterData[];
  questionAccuracy: QuestionAccuracy;
  strengths: { chapter: string; score: number }[];
  weaknesses: { chapter: string; score: number }[];
}

export interface RankHistory {
  month: string;
  rank: number;
  totalStudents: number;
  milestone?: string; // Optional event marker
}

export interface PeerComparison {
  subject: string;
  min: number;
  q1: number; // 25th percentile
  median: number;
  q3: number; // 75th percentile
  max: number;
  yourScore: number;
  outliers: number[];
}

export interface StudyTimeBySubject {
  subject: string;
  actual: number; // hours
  recommended: number; // hours
}

export interface HourlyStudyPattern {
  hour: number; // 0-23
  minutes: number;
}

export interface DailyStudyPattern {
  day: string; // 'Monday', 'Tuesday', etc.
  hourly: HourlyStudyPattern[];
}

export interface StudyStreakDay {
  date: string;
  studied: boolean;
  hours: number;
}

export interface StudyTimeData {
  total: number;
  bySubject: StudyTimeBySubject[];
  weeklyPattern: DailyStudyPattern[];
  peakHours: {
    start: number;
    end: number;
  };
  streak: {
    current: number;
    longest: number;
    last30Days: StudyStreakDay[];
  };
}

export interface StudyCorrelation {
  subject: string;
  hours: number;
  score: number;
  tests: number;
  color: string;
}

export interface BoardExamPrediction {
  subject: string;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[]; // What influenced prediction
}

export interface ImprovementPotential {
  subject: string;
  currentScore: number;
  potential: number; // 0-100
  weightage: number; // Importance/size of bubble
}

export interface ForecastData {
  month: string;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
  isHistorical: boolean;
}

export interface PredictionsData {
  boardExam: BoardExamPrediction[];
  improvementMatrix: ImprovementPotential[];
  forecast: ForecastData[];
}

export interface AIRecommendation {
  id: string;
  type: 'improvement' | 'strength' | 'recommendation' | 'achievement';
  subject: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string; // e.g., "+5% improvement"
  timeRequired: string; // e.g., "30 mins/day"
  difficulty: 'easy' | 'medium' | 'hard';
  actionPlan: string[];
  resources: { title: string; link: string }[];
  icon: string;
}

export interface QuickAction {
  id: string;
  action: string;
  estimatedTime: number; // minutes
  impact: string;
  deadline: string;
  priority: number; // 1-5
  completed: boolean;
}

// Main Performance Data Interface
export interface PerformanceData {
  overall: OverallMetrics;
  performanceTrend: TrendData[];
  comparison: ComparisonData;
  subjects: SubjectPerformance[];
  rankHistory: RankHistory[];
  peerComparison: PeerComparison[];
  studyTime: StudyTimeData;
  studyCorrelation: StudyCorrelation[];
  predictions: PredictionsData;
  recommendations: AIRecommendation[];
  quickActions: QuickAction[];
}

// ============================================================================
// AI STUDY PLAN TYPES
// ============================================================================

export type StudyPlanMode = 'daily' | 'weekly' | 'exam-prep' | 'performance';
export type TimeView = 'daily' | 'weekly' | 'monthly';

export interface StudyTask {
  id: string;
  subject: string;
  subjectColor: string;
  title: string;
  description: string;
  chapter: string;
  duration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  date: string;
  time?: string; // Optional time slot
  tags: string[]; // e.g., ['revision', 'practice', 'theory']
  resources?: { title: string; link: string }[];
}

export interface WeeklySchedule {
  day: string;
  date: string;
  tasks: StudyTask[];
  totalStudyTime: number; // minutes
  subjects: string[]; // subjects covered that day
}

export interface ExamPrepTask {
  subject: string;
  subjectColor: string;
  exam: string;
  examDate: string;
  daysRemaining: number;
  preparedness: number; // 0-100
  chapters: {
    name: string;
    mastery: number; // 0-100
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number; // minutes
  }[];
  mockTests: {
    name: string;
    date: string;
    completed: boolean;
    score?: number;
  }[];
}

export interface PerformanceGoal {
  subject: string;
  subjectColor: string;
  currentScore: number;
  targetScore: number;
  progress: number; // 0-100
  weeklyTasks: number;
  completedTasks: number;
  estimatedAchievementDate: string;
}

export interface AIStudyPlanData {
  studentProfile: {
    name: string;
    class: string;
    overallPercentage: number;
    rank: number;
    totalStudents: number;
    studyHoursPerWeek: number;
  };
  dailyTasks: StudyTask[];
  weeklySchedule: WeeklySchedule[];
  examPrep: ExamPrepTask[];
  performanceGoals: PerformanceGoal[];
  completedTasks: StudyTask[];
  suggestedChanges: string[]; // User's feedback/suggestions
}

// ============================================================================
// PASCO TYPES (Personality, Attitude, Skills, Character, Optimization)
// ============================================================================

export interface Big5Personality {
  openness: number; // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface LearningStyle {
  visual: number; // 0-100
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
}

export interface CommunicationStyle {
  assertive: number; // 0-100
  passive: number;
  collaborative: number;
  independent: number;
}

export interface PersonalityData {
  big5: Big5Personality;
  learningStyle: LearningStyle;
  communicationStyle: CommunicationStyle;
  strengths: string[];
  preferences: string[];
  summary: string;
}

export interface AttitudeMetrics {
  growthMindset: number; // 0-100
  motivation: number;
  resilience: number;
  positiveThinking: number;
  perseverance: number;
  goalOrientation: number;
}

export interface AttitudeData {
  metrics: AttitudeMetrics;
  trendData: { month: string; score: number }[];
  insights: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number; trend: 'up' | 'stable' | 'down' }[];
  overallScore: number;
}

export interface SkillsData {
  academic: SkillCategory;
  soft: SkillCategory;
  technical: SkillCategory;
  subjectSpecific: SkillCategory;
  overallScore: number;
}

export interface CharacterTrait {
  name: string;
  score: number; // 0-100
  description: string;
}

export interface CharacterData {
  coreValues: CharacterTrait[];
  emotionalIntelligence: {
    selfAwareness: number;
    empathy: number;
    emotionalRegulation: number;
    socialSkills: number;
  };
  workEthic: {
    diligence: number;
    punctuality: number;
    reliability: number;
    commitment: number;
  };
  compassion: number;
  overallScore: number;
}

export interface OptimizationRecommendation {
  id: string;
  category: 'personality' | 'attitude' | 'skills' | 'character';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionSteps: string[];
  expectedImpact: string;
}

export interface GrowthArea {
  component: string;
  currentScore: number;
  targetScore: number;
  improvementPlan: string[];
  timeline: string;
}

export interface OptimizationData {
  recommendations: OptimizationRecommendation[];
  growthAreas: GrowthArea[];
  progressTracking: {
    month: string;
    personality: number;
    attitude: number;
    skills: number;
    character: number;
  }[];
  goals: {
    component: string;
    target: number;
    deadline: string;
    progress: number;
  }[];
}

export interface PASCOData {
  code: string; // e.g., "PASCO-8592788890"
  personality: PersonalityData;
  attitude: AttitudeData;
  skills: SkillsData;
  character: CharacterData;
  optimization: OptimizationData;
  overallScores: {
    personality: number;
    attitude: number;
    skills: number;
    character: number;
    optimization: number;
  };
  lastUpdated: string;
}

// ============================================================================
// OTHER STUDENT MODULE TYPES (for future use)
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'class' | 'test' | 'assignment' | 'event' | 'holiday';
  description?: string;
}

export interface ClassData {
  id: string;
  name: string;
  teacher: string;
  time: string;
  duration: string;
  platform: 'zoom' | 'google-meet' | 'teams';
  meetingLink: string;
  status: 'live' | 'upcoming' | 'completed';
}

// Add more types as needed for other student features...
