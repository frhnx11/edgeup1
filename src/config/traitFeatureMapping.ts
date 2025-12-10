/**
 * PASCO Trait Definitions
 *
 * Defines all personality traits used in the PASCO system.
 * Each trait has a value from 0.0 to 1.0 determined by the assessment quiz.
 */

export type TraitCategory =
  | 'social'
  | 'learning'
  | 'pace'
  | 'communication'
  | 'content'
  | 'motivation'
  | 'ui';

export interface TraitDefinition {
  name: string;
  category: TraitCategory;
  description: string;
  lowLabel: string; // Label for score < 0.4
  highLabel: string; // Label for score >= 0.7
}

export const TRAIT_DEFINITIONS = {
  // ============================================
  // SOCIAL & COLLABORATION TRAITS
  // ============================================
  group_study_preference: {
    name: 'Group Study Preference',
    category: 'social' as TraitCategory,
    description: 'Preference for studying with others vs alone',
    lowLabel: 'Prefers Solo Study',
    highLabel: 'Thrives in Groups'
  },
  social_energy_extroversion: {
    name: 'Social Energy',
    category: 'social' as TraitCategory,
    description: 'Energy derived from social interactions',
    lowLabel: 'Introverted',
    highLabel: 'Extroverted'
  },
  peer_recognition_need: {
    name: 'Peer Recognition',
    category: 'social' as TraitCategory,
    description: 'Need for acknowledgment and validation from peers',
    lowLabel: 'Self-motivated',
    highLabel: 'Recognition-driven'
  },
  collaboration_comfort: {
    name: 'Collaboration Comfort',
    category: 'social' as TraitCategory,
    description: 'Comfort level in collaborative and team settings',
    lowLabel: 'Independent Worker',
    highLabel: 'Team Player'
  },
  competition_drive: {
    name: 'Competition Drive',
    category: 'social' as TraitCategory,
    description: 'Motivation derived from competitive environments',
    lowLabel: 'Non-competitive',
    highLabel: 'Highly Competitive'
  },

  // ============================================
  // LEARNING STYLE TRAITS
  // ============================================
  visual_learning: {
    name: 'Visual Learning',
    category: 'learning' as TraitCategory,
    description: 'Preference for visual content like diagrams, videos, infographics',
    lowLabel: 'Non-visual Learner',
    highLabel: 'Visual Learner'
  },
  auditory_learning: {
    name: 'Auditory Learning',
    category: 'learning' as TraitCategory,
    description: 'Preference for audio content like lectures, podcasts',
    lowLabel: 'Non-auditory Learner',
    highLabel: 'Auditory Learner'
  },
  kinesthetic_learning: {
    name: 'Kinesthetic Learning',
    category: 'learning' as TraitCategory,
    description: 'Preference for hands-on activities and interactive learning',
    lowLabel: 'Passive Learner',
    highLabel: 'Hands-on Learner'
  },
  reading_writing_learning: {
    name: 'Reading/Writing',
    category: 'learning' as TraitCategory,
    description: 'Preference for text-based learning and note-taking',
    lowLabel: 'Non-reader',
    highLabel: 'Text-focused Learner'
  },
  gamification_response: {
    name: 'Gamification Response',
    category: 'learning' as TraitCategory,
    description: 'Response to game-like elements (points, badges, streaks)',
    lowLabel: 'Prefers Clean Interface',
    highLabel: 'Loves Gamification'
  },

  // ============================================
  // PACE & FOCUS TRAITS
  // ============================================
  deep_focus_ability: {
    name: 'Deep Focus Ability',
    category: 'pace' as TraitCategory,
    description: 'Ability to maintain extended periods of concentration',
    lowLabel: 'Short Attention Span',
    highLabel: 'Deep Focus Master'
  },
  learning_velocity: {
    name: 'Learning Velocity',
    category: 'pace' as TraitCategory,
    description: 'Speed of grasping and retaining new concepts',
    lowLabel: 'Methodical Learner',
    highLabel: 'Quick Learner'
  },
  immediate_results_need: {
    name: 'Immediate Results Need',
    category: 'pace' as TraitCategory,
    description: 'Need for quick feedback and visible progress',
    lowLabel: 'Patient',
    highLabel: 'Needs Quick Wins'
  },
  long_term_planning: {
    name: 'Long-term Planning',
    category: 'pace' as TraitCategory,
    description: 'Preference for planning ahead and tracking long-term goals',
    lowLabel: 'Day-by-day',
    highLabel: 'Strategic Planner'
  },

  // ============================================
  // COMMUNICATION & TONE TRAITS
  // ============================================
  formal_tone_preference: {
    name: 'Formal Tone',
    category: 'communication' as TraitCategory,
    description: 'Preference for professional, academic communication style',
    lowLabel: 'Casual Communicator',
    highLabel: 'Formal Communicator'
  },
  casual_tone_preference: {
    name: 'Casual Tone',
    category: 'communication' as TraitCategory,
    description: 'Preference for friendly, conversational style',
    lowLabel: 'Formal Style',
    highLabel: 'Casual Style'
  },
  genz_tone_preference: {
    name: 'Gen-Z Tone',
    category: 'communication' as TraitCategory,
    description: 'Preference for trendy language, emojis, memes',
    lowLabel: 'Traditional',
    highLabel: 'Gen-Z Vibes'
  },
  encouragement_need: {
    name: 'Encouragement Need',
    category: 'communication' as TraitCategory,
    description: 'Need for frequent praise and celebration',
    lowLabel: 'Self-assured',
    highLabel: 'Needs Encouragement'
  },
  direct_feedback_preference: {
    name: 'Direct Feedback',
    category: 'communication' as TraitCategory,
    description: 'Preference for straightforward, no-sugarcoating feedback',
    lowLabel: 'Gentle Feedback',
    highLabel: 'Direct Feedback'
  },

  // ============================================
  // CONTENT & DIFFICULTY TRAITS
  // ============================================
  current_knowledge_level: {
    name: 'Knowledge Level',
    category: 'content' as TraitCategory,
    description: 'Current subject matter expertise and familiarity',
    lowLabel: 'Beginner',
    highLabel: 'Advanced'
  },
  creative_problem_solving: {
    name: 'Creative Problem Solving',
    category: 'content' as TraitCategory,
    description: 'Approach to solving problems through creative thinking',
    lowLabel: 'Conventional Thinker',
    highLabel: 'Creative Thinker'
  },
  structured_approach: {
    name: 'Structured Approach',
    category: 'content' as TraitCategory,
    description: 'Preference for step-by-step methods and templates',
    lowLabel: 'Flexible Approach',
    highLabel: 'Structured Approach'
  },
  challenge_appetite: {
    name: 'Challenge Appetite',
    category: 'content' as TraitCategory,
    description: 'Desire for difficult content and challenging problems',
    lowLabel: 'Prefers Comfort Zone',
    highLabel: 'Loves Challenges'
  },

  // ============================================
  // MOTIVATION & CHARACTER TRAITS
  // ============================================
  achievement_motivation: {
    name: 'Achievement Motivation',
    category: 'motivation' as TraitCategory,
    description: 'Driven by achievements, metrics, and targets',
    lowLabel: 'Process-focused',
    highLabel: 'Achievement-driven'
  },
  mastery_motivation: {
    name: 'Mastery Motivation',
    category: 'motivation' as TraitCategory,
    description: 'Driven by deep understanding and expertise',
    lowLabel: 'Surface Learner',
    highLabel: 'Mastery-focused'
  },
  social_motivation: {
    name: 'Social Motivation',
    category: 'motivation' as TraitCategory,
    description: 'Driven by social connections and peer relationships',
    lowLabel: 'Self-reliant',
    highLabel: 'Socially Motivated'
  },
  resilience_level: {
    name: 'Resilience Level',
    category: 'motivation' as TraitCategory,
    description: 'Ability to bounce back from setbacks and failures',
    lowLabel: 'Needs Support',
    highLabel: 'Highly Resilient'
  },
  persistence_level: {
    name: 'Persistence Level',
    category: 'motivation' as TraitCategory,
    description: 'Ability to continue despite difficulties',
    lowLabel: 'Easily Discouraged',
    highLabel: 'Highly Persistent'
  },
  growth_mindset: {
    name: 'Growth Mindset',
    category: 'motivation' as TraitCategory,
    description: 'Belief in ability to improve through effort',
    lowLabel: 'Fixed Mindset',
    highLabel: 'Growth Mindset'
  },
  confidence_level: {
    name: 'Confidence Level',
    category: 'motivation' as TraitCategory,
    description: 'Self-confidence in academic abilities',
    lowLabel: 'Low Confidence',
    highLabel: 'High Confidence'
  },

  // ============================================
  // UI & EXPERIENCE TRAITS
  // ============================================
  ui_complexity_comfort: {
    name: 'UI Complexity Comfort',
    category: 'ui' as TraitCategory,
    description: 'Comfort with complex, feature-rich interfaces',
    lowLabel: 'Simple UI Preferred',
    highLabel: 'Advanced UI Comfortable'
  },
  dark_mode_preference: {
    name: 'Dark Mode',
    category: 'ui' as TraitCategory,
    description: 'Preference for dark theme',
    lowLabel: 'Light Mode',
    highLabel: 'Dark Mode'
  },
  animation_preference: {
    name: 'Animation Preference',
    category: 'ui' as TraitCategory,
    description: 'Preference for celebrations, transitions, visual effects',
    lowLabel: 'Minimal Animations',
    highLabel: 'Loves Animations'
  },
  minimalist_preference: {
    name: 'Minimalist UI',
    category: 'ui' as TraitCategory,
    description: 'Preference for clean, uncluttered interfaces',
    lowLabel: 'Feature-rich UI',
    highLabel: 'Minimalist UI'
  },
  mobile_first_usage: {
    name: 'Mobile First',
    category: 'ui' as TraitCategory,
    description: 'Primary usage on mobile devices',
    lowLabel: 'Desktop User',
    highLabel: 'Mobile User'
  }
} as const;

export type TraitKey = keyof typeof TRAIT_DEFINITIONS;

// Get all trait keys as array
export const ALL_TRAIT_KEYS = Object.keys(TRAIT_DEFINITIONS) as TraitKey[];

// Get traits by category
export const getTraitsByCategory = (category: TraitCategory): TraitKey[] => {
  return ALL_TRAIT_KEYS.filter(key => TRAIT_DEFINITIONS[key].category === category);
};

// Category metadata for display
export const TRAIT_CATEGORY_META: Record<TraitCategory, { name: string; icon: string; color: string }> = {
  social: {
    name: 'Social & Collaboration',
    icon: 'Users',
    color: 'purple'
  },
  learning: {
    name: 'Learning Style',
    icon: 'BookOpen',
    color: 'blue'
  },
  pace: {
    name: 'Pace & Focus',
    icon: 'Clock',
    color: 'green'
  },
  communication: {
    name: 'Communication & Tone',
    icon: 'MessageSquare',
    color: 'orange'
  },
  content: {
    name: 'Content & Difficulty',
    icon: 'FileText',
    color: 'red'
  },
  motivation: {
    name: 'Motivation & Character',
    icon: 'Heart',
    color: 'pink'
  },
  ui: {
    name: 'UI & Experience',
    icon: 'Layout',
    color: 'gray'
  }
};

// Default trait values (used when quiz hasn't been completed)
export const DEFAULT_TRAIT_VALUES: Record<TraitKey, number> = {
  // Social - neutral defaults
  group_study_preference: 0.5,
  social_energy_extroversion: 0.5,
  peer_recognition_need: 0.5,
  collaboration_comfort: 0.5,
  competition_drive: 0.5,

  // Learning - neutral defaults
  visual_learning: 0.5,
  auditory_learning: 0.5,
  kinesthetic_learning: 0.5,
  reading_writing_learning: 0.5,
  gamification_response: 0.5,

  // Pace - neutral defaults
  deep_focus_ability: 0.5,
  learning_velocity: 0.5,
  immediate_results_need: 0.5,
  long_term_planning: 0.5,

  // Communication - neutral defaults
  formal_tone_preference: 0.5,
  casual_tone_preference: 0.5,
  genz_tone_preference: 0.3,
  encouragement_need: 0.5,
  direct_feedback_preference: 0.5,

  // Content - neutral defaults
  current_knowledge_level: 0.5,
  creative_problem_solving: 0.5,
  structured_approach: 0.5,
  challenge_appetite: 0.5,

  // Motivation - slightly positive defaults
  achievement_motivation: 0.5,
  mastery_motivation: 0.5,
  social_motivation: 0.5,
  resilience_level: 0.6,
  persistence_level: 0.6,
  growth_mindset: 0.6,
  confidence_level: 0.5,

  // UI - neutral defaults
  ui_complexity_comfort: 0.5,
  dark_mode_preference: 0.5,
  animation_preference: 0.5,
  minimalist_preference: 0.5,
  mobile_first_usage: 0.5
};
