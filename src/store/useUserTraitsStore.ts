import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FEATURE_REGISTRY } from '../config/featureRegistry';
import type { Feature } from '../config/featureRegistry';
import type { TraitKey } from '../config/traitFeatureMapping';
import { DEFAULT_TRAIT_VALUES, TRAIT_DEFINITIONS } from '../config/traitFeatureMapping';

// User trait values (0.0 to 1.0)
export type UserTraits = Partial<Record<TraitKey, number>>;

// Personality review generated after quiz
export interface PersonalityReview {
  // Top traits (highest scores)
  strengths: {
    trait: TraitKey;
    value: number;
    description: string;
  }[];

  // Low traits (areas to improve)
  areasToImprove: {
    trait: TraitKey;
    value: number;
    description: string;
  }[];

  // Determined learning style
  primaryLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | 'mixed';

  // Communication preference
  communicationStyle: 'formal' | 'casual' | 'genz' | 'mixed';

  // Study approach recommendation
  studyApproach: 'solo' | 'collaborative' | 'competitive' | 'balanced';

  // Pace preference
  pacePreference: 'deep_focus' | 'micro_sessions' | 'balanced';

  // Overall summary text
  summary: string;

  // When review was generated
  generatedAt: string;
}

interface UserTraitsState {
  // User's trait values
  traits: UserTraits;

  // Personality review from quiz
  personalityReview: PersonalityReview | null;

  // When quiz was completed
  quizCompletedAt: string | null;

  // Manually enabled/disabled features by user
  manuallyEnabled: string[];
  manuallyDisabled: string[];

  // Actions
  setTraits: (traits: UserTraits) => void;
  setTrait: (trait: TraitKey, value: number) => void;
  setPersonalityReview: (review: PersonalityReview) => void;
  getTraitValue: (trait: TraitKey) => number;
  getEnabledFeatures: () => Feature[];
  isFeatureEnabled: (featureId: string) => boolean;
  getEnabledFeaturesByCategory: (category: Feature['category']) => Feature[];
  enableFeature: (featureId: string) => void;
  disableFeature: (featureId: string) => void;
  clearTraits: () => void;
  hasCompletedQuiz: () => boolean;
}

export const useUserTraitsStore = create<UserTraitsState>()(
  persist(
    (set, get) => ({
      traits: {},
      personalityReview: null,
      quizCompletedAt: null,
      manuallyEnabled: [],
      manuallyDisabled: [],

      setTraits: (traits) => set({
        // Clear all previous data and set fresh traits
        traits,
        personalityReview: null,
        quizCompletedAt: new Date().toISOString(),
        manuallyEnabled: [],
        manuallyDisabled: []
      }),

      setTrait: (trait, value) => set((state) => ({
        traits: {
          ...state.traits,
          [trait]: Math.max(0, Math.min(1, value)) // Clamp between 0 and 1
        }
      })),

      setPersonalityReview: (review) => set({ personalityReview: review }),

      getTraitValue: (trait) => {
        const { traits } = get();
        return traits[trait] ?? DEFAULT_TRAIT_VALUES[trait] ?? 0.5;
      },

      getEnabledFeatures: () => {
        const { traits, manuallyEnabled, manuallyDisabled } = get();
        const INITIAL_FEATURE_COUNT = 5;

        // Calculate how well each feature matches the user's traits
        const featureScores = FEATURE_REGISTRY.map(feature => {
          let totalScore = 0;

          feature.requiredTraits.forEach(req => {
            const traitValue = traits[req.trait as TraitKey] ?? DEFAULT_TRAIT_VALUES[req.trait as TraitKey] ?? 0.5;
            let isMet = false;

            switch (req.comparison) {
              case '>=': isMet = traitValue >= req.threshold; break;
              case '>': isMet = traitValue > req.threshold; break;
              case '<=': isMet = traitValue <= req.threshold; break;
              case '<': isMet = traitValue < req.threshold; break;
            }

            if (isMet) {
              totalScore += 1;
            } else {
              // Partial score based on how close they are
              const diff = Math.abs(traitValue - req.threshold);
              totalScore += Math.max(0, 1 - diff);
            }
          });

          const avgScore = feature.requiredTraits.length > 0
            ? totalScore / feature.requiredTraits.length
            : 1;

          return { feature, avgScore };
        });

        // Sort by score (best matches first), excluding manually disabled
        const sortedFeatures = featureScores
          .filter(f => !manuallyDisabled.includes(f.feature.id))
          .sort((a, b) => b.avgScore - a.avgScore);

        // Take top 5 as initial set
        const initialFeatures = sortedFeatures
          .slice(0, INITIAL_FEATURE_COUNT)
          .map(f => f.feature);

        // Add manually enabled features (user can expand beyond 5)
        const manuallyEnabledFeatures = FEATURE_REGISTRY.filter(
          f => manuallyEnabled.includes(f.id) && !manuallyDisabled.includes(f.id)
        );

        // Combine and deduplicate
        const enabledSet = new Set([...initialFeatures, ...manuallyEnabledFeatures]);
        return Array.from(enabledSet);
      },

      isFeatureEnabled: (featureId) => {
        const enabledFeatures = get().getEnabledFeatures();
        return enabledFeatures.some(f => f.id === featureId);
      },

      getEnabledFeaturesByCategory: (category) => {
        const enabledFeatures = get().getEnabledFeatures();
        return enabledFeatures.filter(f => f.category === category);
      },

      enableFeature: (featureId) => set((state) => ({
        manuallyEnabled: state.manuallyEnabled.includes(featureId)
          ? state.manuallyEnabled
          : [...state.manuallyEnabled, featureId],
        manuallyDisabled: state.manuallyDisabled.filter(id => id !== featureId)
      })),

      disableFeature: (featureId) => set((state) => ({
        manuallyDisabled: state.manuallyDisabled.includes(featureId)
          ? state.manuallyDisabled
          : [...state.manuallyDisabled, featureId],
        manuallyEnabled: state.manuallyEnabled.filter(id => id !== featureId)
      })),

      clearTraits: () => set({
        traits: {},
        personalityReview: null,
        quizCompletedAt: null,
        manuallyEnabled: [],
        manuallyDisabled: []
      }),

      hasCompletedQuiz: () => {
        return get().quizCompletedAt !== null;
      }
    }),
    {
      name: 'user-traits-storage'
    }
  )
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a personality review from trait values
 */
export function generatePersonalityReview(traits: UserTraits): PersonalityReview {
  // Get all trait entries with their values
  const traitEntries = Object.entries(traits) as [TraitKey, number][];

  // Sort by value descending to find strengths
  const sortedByValue = [...traitEntries].sort((a, b) => b[1] - a[1]);

  // Top 5 strengths (highest scoring traits)
  const strengths = sortedByValue
    .slice(0, 5)
    .map(([trait, value]) => ({
      trait,
      value,
      description: TRAIT_DEFINITIONS[trait]?.highLabel || ''
    }));

  // Bottom 5 traits as areas to improve (lowest scoring traits)
  const areasToImprove = [...sortedByValue]
    .reverse()
    .slice(0, 5)
    .map(([trait, value]) => ({
      trait,
      value,
      description: TRAIT_DEFINITIONS[trait]?.lowLabel || ''
    }));

  // Determine primary learning style
  const learningTraits = {
    visual: traits.visual_learning ?? 0.5,
    auditory: traits.auditory_learning ?? 0.5,
    kinesthetic: traits.kinesthetic_learning ?? 0.5,
    reading_writing: traits.reading_writing_learning ?? 0.5
  };

  const maxLearning = Math.max(...Object.values(learningTraits));
  const primaryLearningStyle = maxLearning < 0.6 ? 'mixed' :
    learningTraits.visual === maxLearning ? 'visual' :
    learningTraits.auditory === maxLearning ? 'auditory' :
    learningTraits.kinesthetic === maxLearning ? 'kinesthetic' :
    'reading_writing';

  // Determine communication style
  const commTraits = {
    formal: traits.formal_tone_preference ?? 0.5,
    casual: traits.casual_tone_preference ?? 0.5,
    genz: traits.genz_tone_preference ?? 0.3
  };

  const maxComm = Math.max(...Object.values(commTraits));
  const communicationStyle = maxComm < 0.6 ? 'mixed' :
    commTraits.formal === maxComm ? 'formal' :
    commTraits.casual === maxComm ? 'casual' :
    'genz';

  // Determine study approach
  const groupPref = traits.group_study_preference ?? 0.5;
  const competitionDrive = traits.competition_drive ?? 0.5;

  const studyApproach =
    groupPref >= 0.7 ? 'collaborative' :
    groupPref < 0.4 ? 'solo' :
    competitionDrive >= 0.7 ? 'competitive' :
    'balanced';

  // Determine pace preference
  const deepFocus = traits.deep_focus_ability ?? 0.5;
  const pacePreference =
    deepFocus >= 0.7 ? 'deep_focus' :
    deepFocus < 0.4 ? 'micro_sessions' :
    'balanced';

  // Generate summary
  const learningStyleText = {
    visual: 'visual content like diagrams and videos',
    auditory: 'audio content like lectures and podcasts',
    kinesthetic: 'hands-on activities and interactive learning',
    reading_writing: 'text-based materials and note-taking',
    mixed: 'a variety of learning formats'
  };

  const studyApproachText = {
    solo: 'prefer focused individual study sessions',
    collaborative: 'thrive in group study environments',
    competitive: 'are motivated by competition and rankings',
    balanced: 'adapt well to both solo and group settings'
  };

  const summary = `You learn best through ${learningStyleText[primaryLearningStyle]} and ${studyApproachText[studyApproach]}. ${
    pacePreference === 'deep_focus'
      ? 'You excel at maintaining long periods of concentration.'
      : pacePreference === 'micro_sessions'
      ? 'You work best in shorter, focused bursts with frequent breaks.'
      : 'You can adapt your study sessions to match the task at hand.'
  }`;

  return {
    strengths,
    areasToImprove,
    primaryLearningStyle,
    communicationStyle,
    studyApproach,
    pacePreference,
    summary,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Get mock traits for testing (simulates a completed quiz)
 */
export function getMockTraits(): UserTraits {
  return {
    // Social - Creative Explorer profile (prefers solo/small groups)
    group_study_preference: 0.4,
    social_energy_extroversion: 0.5,
    peer_recognition_need: 0.4,
    collaboration_comfort: 0.6,
    competition_drive: 0.5,

    // Learning - Visual & Kinesthetic learner
    visual_learning: 0.85,
    auditory_learning: 0.5,
    kinesthetic_learning: 0.7,
    reading_writing_learning: 0.6,
    gamification_response: 0.7,

    // Pace - Deep focus ability
    deep_focus_ability: 0.75,
    learning_velocity: 0.65,
    immediate_results_need: 0.6,
    long_term_planning: 0.7,

    // Communication - Casual
    formal_tone_preference: 0.4,
    casual_tone_preference: 0.7,
    genz_tone_preference: 0.5,
    encouragement_need: 0.6,
    direct_feedback_preference: 0.6,

    // Content - Creative problem solver
    current_knowledge_level: 0.6,
    creative_problem_solving: 0.8,
    structured_approach: 0.5,
    challenge_appetite: 0.7,

    // Motivation - Growth oriented
    achievement_motivation: 0.65,
    mastery_motivation: 0.75,
    social_motivation: 0.5,
    resilience_level: 0.7,
    persistence_level: 0.7,
    growth_mindset: 0.8,
    confidence_level: 0.65,

    // UI - Prefers clean interfaces
    ui_complexity_comfort: 0.6,
    dark_mode_preference: 0.7,
    animation_preference: 0.6,
    minimalist_preference: 0.6,
    mobile_first_usage: 0.5
  };
}
