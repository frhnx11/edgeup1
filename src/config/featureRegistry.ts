/**
 * PASCO Feature Registry
 *
 * Contains ACTUAL features from Social Learner, Academic Achiever, and Creative Explorer tabs.
 * Features are enabled/disabled based on user's trait values.
 */

export type TraitRequirement = {
  trait: string;
  threshold: number;
  comparison: '>=' | '<' | '>' | '<=';
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  component: string; // component path identifier
  category: 'social' | 'analytics' | 'productivity';
  source: 'social-learner' | 'academic-achiever' | 'creative-explorer'; // Original student type
  requiredTraits: TraitRequirement[];
};

export const FEATURE_REGISTRY: Feature[] = [
  // ============================================
  // SOCIAL LEARNER FEATURES
  // ============================================
  {
    id: 'reels',
    name: 'Reels',
    description: 'Educational video content with real videos, like/comment/share features',
    icon: 'Play',
    component: 'ReelsPage',
    category: 'social',
    source: 'social-learner',
    requiredTraits: [
      { trait: 'social_energy_extroversion', threshold: 0.5, comparison: '>=' },
      { trait: 'visual_learning', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'messages',
    name: 'Messages',
    description: 'Direct messaging system between learners with online status and read receipts',
    icon: 'MessageCircle',
    component: 'MessagesPage',
    category: 'social',
    source: 'social-learner',
    requiredTraits: [
      { trait: 'collaboration_comfort', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'study-groups',
    name: 'Study Groups',
    description: 'Topic-based study groups with member management and group messaging',
    icon: 'Users',
    component: 'StudyGroupsPage',
    category: 'social',
    source: 'social-learner',
    requiredTraits: [
      { trait: 'group_study_preference', threshold: 0.6, comparison: '>=' }
    ]
  },
  {
    id: 'quizzes',
    name: 'Quizzes',
    description: 'Live and upcoming quizzes with real-time leaderboards and participant tracking',
    icon: 'Trophy',
    component: 'QuizzesPage',
    category: 'social',
    source: 'social-learner',
    requiredTraits: [
      { trait: 'competition_drive', threshold: 0.5, comparison: '>=' }
    ]
  },

  // ============================================
  // ACADEMIC ACHIEVER FEATURES
  // ============================================
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed performance insights with subject-wise analysis, trends, and accuracy metrics',
    icon: 'BarChart3',
    component: 'AdvancedAnalyticsPage',
    category: 'analytics',
    source: 'academic-achiever',
    requiredTraits: [
      { trait: 'achievement_motivation', threshold: 0.6, comparison: '>=' }
    ]
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    description: 'Competitive rankings at National/State/City level with animated badges',
    icon: 'Award',
    component: 'LeaderboardPage',
    category: 'analytics',
    source: 'academic-achiever',
    requiredTraits: [
      { trait: 'competition_drive', threshold: 0.7, comparison: '>=' },
      { trait: 'peer_recognition_need', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'readiness-score',
    name: 'Readiness Score',
    description: 'Exam preparation progress gauge with subject-wise readiness and actionable insights',
    icon: 'Gauge',
    component: 'ReadinessScorePage',
    category: 'analytics',
    source: 'academic-achiever',
    requiredTraits: [
      { trait: 'immediate_results_need', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'test-analytics',
    name: 'Mock Test Analysis',
    description: 'Detailed mock test performance with speed vs accuracy comparison and topic analysis',
    icon: 'ClipboardList',
    component: 'TestAnalyticsPage',
    category: 'analytics',
    source: 'academic-achiever',
    requiredTraits: [
      { trait: 'achievement_motivation', threshold: 0.5, comparison: '>=' },
      { trait: 'structured_approach', threshold: 0.5, comparison: '>=' }
    ]
  },

  // ============================================
  // CREATIVE EXPLORER FEATURES
  // ============================================
  {
    id: 'mind-maps',
    name: 'Mind Maps',
    description: 'Interactive mind map creation with color-coded nodes, templates, and zoom/pan controls',
    icon: 'Map',
    component: 'MindMapStudio',
    category: 'productivity',
    source: 'creative-explorer',
    requiredTraits: [
      { trait: 'visual_learning', threshold: 0.6, comparison: '>=' },
      { trait: 'creative_problem_solving', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro-style timer with Focus/Short Break/Long Break modes, streak tracking, and stats',
    icon: 'Clock',
    component: 'FocusTimer',
    category: 'productivity',
    source: 'creative-explorer',
    requiredTraits: [
      { trait: 'deep_focus_ability', threshold: 0.5, comparison: '>=' }
    ]
  },
  {
    id: 'calendar',
    name: 'Smart Calendar',
    description: 'Monthly calendar with event management, task lists, and status tracking',
    icon: 'Calendar',
    component: 'SmartCalendar',
    category: 'productivity',
    source: 'creative-explorer',
    requiredTraits: [
      { trait: 'long_term_planning', threshold: 0.5, comparison: '>=' }
    ]
  }
];

// Helper function to get features by category
export const getFeaturesByCategory = (category: Feature['category']): Feature[] => {
  return FEATURE_REGISTRY.filter(f => f.category === category);
};

// Helper function to get features by source (original student type)
export const getFeaturesBySource = (source: Feature['source']): Feature[] => {
  return FEATURE_REGISTRY.filter(f => f.source === source);
};

// Helper function to get a feature by ID
export const getFeatureById = (id: string): Feature | undefined => {
  return FEATURE_REGISTRY.find(f => f.id === id);
};

// Category labels for display
export const CATEGORY_LABELS: Record<Feature['category'], { name: string; icon: string; color: string }> = {
  social: { name: 'Social & Collaboration', icon: 'Users', color: 'purple' },
  analytics: { name: 'Analytics & Performance', icon: 'BarChart3', color: 'blue' },
  productivity: { name: 'Productivity & Tools', icon: 'Clock', color: 'green' }
};

// Source labels for display
export const SOURCE_LABELS: Record<Feature['source'], { name: string; color: string }> = {
  'social-learner': { name: 'Social Learner', color: 'pink' },
  'academic-achiever': { name: 'Academic Achiever', color: 'blue' },
  'creative-explorer': { name: 'Creative Explorer', color: 'green' }
};
