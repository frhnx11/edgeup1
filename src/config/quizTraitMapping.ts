/**
 * Quiz Trait Mapping
 *
 * Maps current quiz traits (from AssessmentQuiz.tsx) to the new 30+ trait system.
 * Used to normalize quiz scores into trait values (0.0 to 1.0).
 */

import type { TraitKey } from './traitFeatureMapping';

/**
 * Maps old quiz trait names to new trait system keys.
 * Some mappings are direct, others are conceptually similar.
 * Inverse mappings (where high old trait = low new trait) are marked with 'inverse'
 */
export const QUIZ_TRAIT_MAPPING: Record<string, { traits: TraitKey[], weight?: number, inverse?: boolean }> = {
  // ============================================
  // SOCIAL & COLLABORATION MAPPINGS
  // ============================================
  'social': { traits: ['social_energy_extroversion', 'social_motivation'] },
  'social_dependent': { traits: ['group_study_preference', 'social_motivation'] },
  'collaborative': { traits: ['collaboration_comfort', 'group_study_preference'] },
  'extroverted': { traits: ['social_energy_extroversion'] },
  'introverted': { traits: ['group_study_preference'], inverse: true }, // High introverted = low group preference
  'individual': { traits: ['group_study_preference'], inverse: true },
  'prefers_alone': { traits: ['group_study_preference'], inverse: true },
  'learns_from_others': { traits: ['collaboration_comfort', 'social_motivation'] },
  'social_anxiety': { traits: ['social_energy_extroversion'], inverse: true },

  // Competition & Recognition
  'competitive': { traits: ['competition_drive', 'peer_recognition_need'] },
  'achievement': { traits: ['achievement_motivation', 'competition_drive'] },
  'performance_focus': { traits: ['achievement_motivation', 'immediate_results_need'] },

  // ============================================
  // LEARNING STYLE MAPPINGS
  // ============================================
  'visual_learning': { traits: ['visual_learning'] },
  'auditory_learning': { traits: ['auditory_learning'] },
  'reading_learning': { traits: ['reading_writing_learning'] },
  'hands_on': { traits: ['kinesthetic_learning'] },
  'creative': { traits: ['creative_problem_solving'] },
  'innovation': { traits: ['creative_problem_solving'] },
  'unconventional': { traits: ['creative_problem_solving'] },
  'genz_style': { traits: ['gamification_response', 'genz_tone_preference'] },
  'tech_savvy': { traits: ['gamification_response'] },
  'modern_methods': { traits: ['gamification_response'] },

  // ============================================
  // PACE & FOCUS MAPPINGS
  // ============================================
  'deep_focus': { traits: ['deep_focus_ability'] },
  'deep_mastery': { traits: ['deep_focus_ability', 'mastery_motivation'] },
  'short_bursts': { traits: ['deep_focus_ability'], inverse: true },
  'interval_focus': { traits: ['deep_focus_ability'], weight: 0.6 },
  'fast_paced': { traits: ['learning_velocity'] },
  'efficiency_focus': { traits: ['learning_velocity'] },
  'slow_paced': { traits: ['learning_velocity'], inverse: true },
  'strategic': { traits: ['long_term_planning'] },
  'long_term': { traits: ['long_term_planning'] },
  'immediate_results': { traits: ['immediate_results_need'] },

  // ============================================
  // COMMUNICATION & TONE MAPPINGS
  // ============================================
  'articulate': { traits: ['direct_feedback_preference'] },
  'communication_struggle': { traits: ['encouragement_need'] },

  // ============================================
  // CONTENT & DIFFICULTY MAPPINGS
  // ============================================
  'high_ability': { traits: ['current_knowledge_level'] },
  'above_level': { traits: ['current_knowledge_level'] },
  'at_level': { traits: ['current_knowledge_level'], weight: 0.5 },
  'below_level': { traits: ['current_knowledge_level'], inverse: true },
  'analytical': { traits: ['structured_approach', 'creative_problem_solving'] },
  'methodical': { traits: ['structured_approach'] },
  'systematic': { traits: ['structured_approach'] },
  'organized': { traits: ['structured_approach', 'long_term_planning'] },
  'structured': { traits: ['structured_approach'] },
  'process_focus': { traits: ['structured_approach', 'mastery_motivation'] },
  'chaotic': { traits: ['structured_approach'], inverse: true },
  'spontaneous': { traits: ['structured_approach'], inverse: true },
  'curious': { traits: ['challenge_appetite'] },

  // ============================================
  // MOTIVATION & CHARACTER MAPPINGS
  // ============================================
  'growth_mindset': { traits: ['growth_mindset'] },
  'fixed_mindset': { traits: ['growth_mindset'], inverse: true },
  'growth_developing': { traits: ['growth_mindset'], weight: 0.6 },
  'resilient': { traits: ['resilience_level', 'persistence_level'] },
  'persistent': { traits: ['persistence_level'] },
  'high_motivation': { traits: ['achievement_motivation', 'persistence_level'] },
  'low_motivation': { traits: ['persistence_level'], inverse: true },
  'eager': { traits: ['achievement_motivation'] },
  'positive_energy': { traits: ['resilience_level'] },
  'cynical': { traits: ['growth_mindset', 'resilience_level'], inverse: true },
  'wants_improvement': { traits: ['growth_mindset', 'mastery_motivation'] },
  'effort_despite_difficulty': { traits: ['persistence_level', 'resilience_level'] },
  'intrinsic_motivation': { traits: ['mastery_motivation'] },

  // Confidence
  'confident_ability': { traits: ['confidence_level'] },
  'low_confidence': { traits: ['confidence_level'], inverse: true },
  'performance_anxiety': { traits: ['confidence_level'], inverse: true },
  'needs_support': { traits: ['confidence_level', 'encouragement_need'], inverse: true },

  // Balance/Consistency (map to moderate values)
  'balanced': { traits: ['resilience_level'], weight: 0.5 },
  'consistent': { traits: ['persistence_level'] },
  'sustainable': { traits: ['resilience_level', 'deep_focus_ability'], weight: 0.6 },
  'moderate_all': { traits: ['resilience_level'], weight: 0.5 },
  'reliable': { traits: ['persistence_level'] },
  'ambiverted': { traits: ['social_energy_extroversion'], weight: 0.5 },

  // Negative traits (penalties)
  'extremes': { traits: ['resilience_level'], inverse: true, weight: 0.3 },
  'inconsistent': { traits: ['persistence_level'], inverse: true },
  'one_dimensional': { traits: ['creative_problem_solving'], inverse: true },
  'rigid_thinking': { traits: ['creative_problem_solving'], inverse: true },
  'fear_of_creativity': { traits: ['creative_problem_solving'], inverse: true },
  'methodical_only': { traits: ['creative_problem_solving'], inverse: true },
  'lacks_depth': { traits: ['mastery_motivation'], inverse: true },
  'high_performer': { traits: ['current_knowledge_level'] },
  'already_expert': { traits: ['current_knowledge_level'] },
  'process_over_results': { traits: ['mastery_motivation'] },
  'performance_only': { traits: ['mastery_motivation'], inverse: true },
  'tech_averse': { traits: ['gamification_response'], inverse: true },
  'traditional_only': { traits: ['gamification_response'], inverse: true },
};

/**
 * Maximum possible score for each quiz trait.
 * Used for normalization to 0.0-1.0 range.
 */
export const QUIZ_TRAIT_MAX_SCORES: Record<string, number> = {
  // Social traits
  social: 15,
  social_dependent: 30,
  collaborative: 25,
  extroverted: 20,
  introverted: 25,
  individual: 20,
  prefers_alone: 15,
  learns_from_others: 20,

  // Achievement traits
  competitive: 20,
  achievement: 30,
  performance_focus: 25,

  // Learning style
  visual_learning: 10,
  auditory_learning: 10,
  reading_learning: 10,
  hands_on: 10,
  creative: 15,
  innovation: 15,
  tech_savvy: 15,
  modern_methods: 15,
  genz_style: 15,

  // Pace & Focus
  deep_focus: 15,
  deep_mastery: 30,
  fast_paced: 20,
  efficiency_focus: 15,
  methodical: 30,
  organized: 25,
  systematic: 20,
  process_focus: 25,
  long_term: 15,

  // Motivation
  growth_mindset: 25,
  resilient: 20,
  high_motivation: 20,
  wants_improvement: 20,
  confident_ability: 25,
  low_confidence: 30,
  needs_support: 20,
  performance_anxiety: 20,

  // Balance
  balanced: 20,
  consistent: 20,
  sustainable: 15,

  // Default for unmapped traits
  default: 20
};

/**
 * Calculate normalized trait values from raw quiz scores.
 * @param rawScores - Raw scores from quiz answers
 * @returns Normalized traits (0.0 to 1.0)
 */
export function calculateNormalizedTraits(rawScores: Record<string, number>): Record<TraitKey, number> {
  const normalizedTraits: Partial<Record<TraitKey, number>> = {};
  const traitContributions: Record<TraitKey, { sum: number; count: number }> = {} as any;

  // Initialize trait contributions
  const allTraitKeys: TraitKey[] = [
    'group_study_preference', 'social_energy_extroversion', 'peer_recognition_need',
    'collaboration_comfort', 'competition_drive', 'visual_learning', 'auditory_learning',
    'kinesthetic_learning', 'reading_writing_learning', 'gamification_response',
    'deep_focus_ability', 'learning_velocity', 'immediate_results_need', 'long_term_planning',
    'formal_tone_preference', 'casual_tone_preference', 'genz_tone_preference',
    'encouragement_need', 'direct_feedback_preference', 'current_knowledge_level',
    'creative_problem_solving', 'structured_approach', 'challenge_appetite',
    'achievement_motivation', 'mastery_motivation', 'social_motivation',
    'resilience_level', 'persistence_level', 'growth_mindset', 'confidence_level',
    'ui_complexity_comfort', 'dark_mode_preference', 'animation_preference',
    'minimalist_preference', 'mobile_first_usage'
  ];

  allTraitKeys.forEach(key => {
    traitContributions[key] = { sum: 0, count: 0 };
  });

  // Process each raw score
  Object.entries(rawScores).forEach(([quizTrait, score]) => {
    const mapping = QUIZ_TRAIT_MAPPING[quizTrait];
    if (!mapping) return;

    const maxScore = QUIZ_TRAIT_MAX_SCORES[quizTrait] || QUIZ_TRAIT_MAX_SCORES.default;
    const weight = mapping.weight ?? 1.0;

    // Normalize to 0-1 range
    let normalizedValue = Math.max(0, Math.min(1, score / maxScore)) * weight;

    // Apply inverse if needed
    if (mapping.inverse) {
      normalizedValue = 1 - normalizedValue;
    }

    // Distribute to mapped traits
    mapping.traits.forEach(traitKey => {
      if (traitContributions[traitKey]) {
        traitContributions[traitKey].sum += normalizedValue;
        traitContributions[traitKey].count += 1;
      }
    });
  });

  // Calculate final trait values (average of contributions)
  allTraitKeys.forEach(traitKey => {
    const contribution = traitContributions[traitKey];
    if (contribution.count > 0) {
      normalizedTraits[traitKey] = Math.max(0, Math.min(1, contribution.sum / contribution.count));
    } else {
      // Default to 0.5 if no data
      normalizedTraits[traitKey] = 0.5;
    }
  });

  return normalizedTraits as Record<TraitKey, number>;
}

/**
 * Get a human-readable summary of trait calculation
 */
export function getTraitCalculationSummary(
  rawScores: Record<string, number>,
  normalizedTraits: Record<TraitKey, number>
): {
  strongTraits: TraitKey[];
  weakTraits: TraitKey[];
  averageTraits: TraitKey[];
} {
  const strongTraits: TraitKey[] = [];
  const weakTraits: TraitKey[] = [];
  const averageTraits: TraitKey[] = [];

  Object.entries(normalizedTraits).forEach(([trait, value]) => {
    if (value >= 0.7) {
      strongTraits.push(trait as TraitKey);
    } else if (value < 0.4) {
      weakTraits.push(trait as TraitKey);
    } else {
      averageTraits.push(trait as TraitKey);
    }
  });

  return { strongTraits, weakTraits, averageTraits };
}
