import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/*
=== REBALANCING CHANGES APPLIED ===
1. STEADY PROGRESSER REQUIREMENTS: Increased from 15/12/12 to 22/16/16 (+47% harder)
2. NEW PENALTIES: Added achievement:-8, deep_mastery:-8, social_dependent:-8, methodical:-6 to prevent crossover
3. BALANCED SCORING REDUCED: Cut by 70% across 10 questions
   - Q2: 4→1, Q3: 4→1, Q4: 5→1, Q8: 4→0 (removed!)
   - Q11: 5→1, Q13: 5→1, Q15: 3→0 (removed!)
   - Q19: 4→1, Q20: 6→1 (biggest fix!)
   - Q6/Q12/Q16 sliders: 3-4→1
4. OTHER ARCHETYPES: Reduced requirements by 15-20% to make them more accessible
5. QUESTION REWORDING: Made 7 questions more polarizing, removed "safe middle" answers
6. SCORE BOOSTS: Increased achievement, deep_mastery, social_dependent by 15-20% across questions

RESULT: Steady Progresser now requires genuine balance WITHOUT strong tendencies in ANY direction
*/

interface AssessmentQuizProps {
  onComplete?: (archetype: string) => void;
}

const AssessmentQuiz = ({ onComplete }: AssessmentQuizProps) => {
  const [stage, setStage] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState<any>(null);
  const [pathway, setPathway] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [rankingItems, setRankingItems] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [reactionQuestionVersion, setReactionQuestionVersion] = useState(0);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [showArchetypeSelection, setShowArchetypeSelection] = useState(false);

  // REBALANCED: Much stricter requirements to prevent Steady Progresser dominance
  const archetypeSignatures = {
    'Academic Achiever': {
      required: { achievement: 10, performance_focus: 8 }, // REDUCED from 12/10
      bonus: { competitive: 4, methodical: 2, long_term: 3 },
      penalty: { low_motivation: -15, process_over_results: -8, low_confidence: -10 },
      description: 'Must show strong achievement drive AND performance focus'
    },
    'Creative Explorer': {
      required: { creative: 10, innovation: 8, hands_on: 6 }, // REDUCED from 12/10/8
      bonus: { social: 3, unconventional: 4, visual_learning: 3 },
      penalty: { rigid_thinking: -15, fear_of_creativity: -10, methodical_only: -8 },
      description: 'Must demonstrate creativity in multiple ways'
    },
    'Quiet Genius': {
      required: { introverted: 10, deep_mastery: 10, confident_ability: 8 }, // REDUCED from 12/12/10
      bonus: { individual: 4, analytical: 4, high_ability: 3 },
      penalty: { social_dependent: -15, low_confidence: -12, lacks_depth: -10 },
      description: 'Must be BOTH introverted AND confident in abilities'
    },
    'Struggling Fighter': {
      required: { needs_support: 10, below_level: 8 }, // REDUCED from 12/10
      bonus: { wants_improvement: 4, effort_despite_difficulty: 4, growth_developing: 3 },
      penalty: { high_performer: -15, confident_ability: -12, above_level: -10 },
      description: 'Must show genuine academic challenges'
    },
    'Social Learner': {
      required: { social_dependent: 12, extroverted: 10, learns_from_others: 8 }, // REDUCED from 14/12/10
      bonus: { collaborative: 4, auditory_learning: 3 },
      penalty: { prefers_alone: -15, social_anxiety: -10, introverted: -12 },
      description: 'Must be highly social AND learn better with others'
    },
    'Methodical Planner': {
      required: { methodical: 13, process_focus: 10, organized: 8 }, // REDUCED from 15/12/10
      bonus: { systematic: 4, long_term: 3, structured: 3 },
      penalty: { chaotic: -15, spontaneous: -10, performance_only: -8 },
      description: 'Must show exceptional organization AND process focus'
    },
    'Gen-Z Maverick': {
      required: { tech_savvy: 10, fast_paced: 8, modern_methods: 8 }, // REDUCED from 12/10/10
      bonus: { genz_style: 4, efficiency_focus: 4, visual_learning: 2 },
      penalty: { tech_averse: -15, traditional_only: -12, slow_paced: -8 },
      description: 'Must embrace technology AND modern learning methods'
    },
    'Steady Progresser': {
      required: { balanced: 22, consistent: 16, sustainable: 16 }, // INCREASED from 15/12/12 - MUCH HARDER
      bonus: { moderate_all: 4, reliable: 3 },
      penalty: { 
        extremes: -15, 
        inconsistent: -12, 
        one_dimensional: -10,
        achievement: -8,        // NEW: Strong achievement disqualifies
        deep_mastery: -8,       // NEW: Strong mastery focus disqualifies  
        social_dependent: -8,   // NEW: Strong social dependency disqualifies
        methodical: -6          // NEW: Strong planning disqualifies
      },
      description: 'Must show balance across ALL dimensions without strong tendencies'
    },
    'Underconfident Talent': {
      required: { high_ability: 10, low_confidence: 10, performance_anxiety: 6 }, // REDUCED from 12/12/8
      bonus: { introverted: 3, analytical: 3 },
      penalty: { confident_ability: -15, low_ability: -12, extroverted_confident: -10 },
      description: 'Must have HIGH ability but LOW confidence (imposter syndrome)'
    },
    'Enthusiastic Beginner': {
      required: { growth_mindset: 13, high_motivation: 10, eager: 8 }, // REDUCED from 15/12/10
      bonus: { resilient: 4, wants_improvement: 4, positive_energy: 3 },
      penalty: { fixed_mindset: -15, low_motivation: -12, already_expert: -10, cynical: -8 },
      description: 'Must show exceptional growth mindset AND high motivation'
    }
  };

  const questions = [
    // Q1: Text-based question (Branching starter)
    {
      id: 'q1',
      type: 'text',
      scenario: "Major exam in 3 weeks. 6 topics/chapters pending. Friends planning group study. Important test tomorrow.",
      question: "Which reaction feels most like YOU?",
      options: [
        {
          text: '📊 Create detailed hour-by-hour schedule covering everything strategically',
          scores: { methodical: 5, organized: 4, process_focus: 4, achievement: 2 },
          pathway: 'planner'
        },
        {
          text: '👥 Join group study! We\'ll divide topics and teach each other',
          scores: { social_dependent: 5, collaborative: 4, extroverted: 4, learns_from_others: 3 },
          pathway: 'social'
        },
        {
          text: '🤫 Study alone systematically. Groups waste time. I need deep focus.',
          scores: { introverted: 5, individual: 4, deep_mastery: 4, analytical: 2 },
          pathway: 'independent'
        },
        {
          text: '😰 Honestly feeling lost. Not sure where to start or if I can manage',
          scores: { needs_support: 5, below_level: 4, low_confidence: 4 },
          pathway: 'support'
        }
      ]
    },

    // Q2-5: Follow-up scenario questions (no longer pathway-specific)
    {
      id: 'q2',
      type: 'text',
      scenario: "Your perfect plan is failing. Day 3: You're 2 hours behind schedule.",
      question: "What actually happens?",
      options: [
        { text: "Revise plan immediately. Adjust timeline, optimize. Plans must be flexible.", scores: { methodical: 5, systematic: 4, organized: 4, balanced: 1 } }, // REDUCED balanced 2→1
        { text: "Stick to it! I'll pull all-nighter to catch up. The plan must work.", scores: { methodical: 5, achievement: 4, performance_focus: 3, extremes: 3 } },
        { text: "Plans are overrated. I'll just study naturally from now on.", scores: { spontaneous: 5, balanced: 1, sustainable: 2 } }, // REDUCED balanced 3→1, REWORDED
        { text: "Getting stressed. I need help restructuring this approach.", scores: { needs_support: 4, low_confidence: 3, wants_improvement: 2 } }
      ]
    },
    {
      id: 'q3',
      type: 'text',
      scenario: "Group study: 6 friends. After 30 mins, 2 on phones, 3 chatting about movies, 1 person (you) wants to study.",
      question: "Your move?",
      options: [
        { text: "Take charge: 'Guys focus! 1-hour study blocks then break.' Lead them.", scores: { achievement: 5, competitive: 4, organized: 4, extroverted: 3 } }, // BOOSTED achievement
        { text: "Chat a bit to keep the vibe, then gently suggest getting back to work.", scores: { social: 4, collaborative: 3, sustainable: 2, balanced: 1 } }, // REDUCED balanced 4→1
        { text: "This isn't working. Leave politely and study alone. Need actual focus.", scores: { individual: 5, introverted: 4, prefers_alone: 4, deep_mastery: 2 } },
        { text: "If everyone's relaxed, maybe we all needed this break. I'll go with it.", scores: { social_dependent: 6, extroverted: 4, spontaneous: 3 } } // BOOSTED social_dependent
      ]
    },
    {
      id: 'q4',
      type: 'text',
      scenario: "3 hours of solo study. You completed 1 chapter deeply with perfect notes. Friends finished 5 chapters (superficially).",
      question: "Your honest feeling?",
      options: [
        { text: "Doesn't matter. Depth > speed. I'll ace exam with proper understanding.", scores: { deep_mastery: 6, confident_ability: 5, analytical: 4, introverted: 2 } }, // BOOSTED
        { text: "Worried I'm too slow. Should I speed up to match them?", scores: { low_confidence: 4, performance_focus: 3, competitive: 2 } },
        { text: "My pace is working. One quality chapter beats five rushed ones.", scores: { consistent: 4, confident_ability: 3, sustainable: 3, balanced: 1 } }, // REDUCED balanced 5→1
        { text: "Maybe joining them would be more efficient after all?", scores: { social_dependent: 4, learns_from_others: 3, collaborative: 2 } }
      ]
    },
    {
      id: 'q5',
      type: 'text',
      scenario: "Recent test: You got 45/100. You studied but underperformed. Friend got 89/100.",
      question: "What goes through your mind?",
      options: [
        { text: "I'm not smart enough. Some people get it, I don't. That's reality.", scores: { fixed_mindset: 5, low_confidence: 5, below_level: 4 } },
        { text: "I need different study method. This isn't working. Let me try new approach.", scores: { growth_mindset: 5, wants_improvement: 4, resilient: 4, high_motivation: 3 } },
        { text: "Studied wrong topics. Need to ask instructor what's actually important.", scores: { needs_support: 4, wants_improvement: 3, effort_despite_difficulty: 2 } },
        { text: "Disappointing but let me analyze what went wrong scientifically.", scores: { analytical: 4, balanced: 3, confident_ability: 2 } }
      ]
    },

    // Q6: Slider - Ability Level
    {
      id: 'q6',
      type: 'slider',
      question: "Compared to your peers, where would you honestly place your academic ability?",
      instruction: "Drag the slider to your honest self-assessment:",
      min: 0,
      max: 100,
      leftLabel: "Way Behind Everyone",
      rightLabel: "Way Ahead of Most",
      scoreMap: (value) => {
        if (value < 25) return { below_level: 5, needs_support: 4, low_confidence: 3, high_ability: -5 };
        if (value < 40) return { below_level: 3, needs_support: 2, at_level: 2 };
        if (value < 60) return { at_level: 4, consistent: 2, balanced: 1 }; // REDUCED balanced 3→1
        if (value < 75) return { above_level: 3, confident_ability: 3, high_ability: 3 };
        return { high_ability: 5, confident_ability: 5, above_level: 4, achievement: 2 };
      }
    },

    // Q7: Visual Study Space Preference
    {
      id: 'q7',
      type: 'visual-space',
      question: "Which study environment makes you feel most productive and comfortable?",
      instruction: "Click the image that calls to you:",
      options: [
        {
          image: '🏛️',
          title: 'Silent Library',
          description: 'Complete silence, organized shelves, solo desks',
          scores: { introverted: 5, individual: 4, deep_mastery: 3, prefers_alone: 4 }
        },
        {
          image: '☕',
          title: 'Busy Café',
          description: 'Ambient noise, people around, casual vibe',
          scores: { balanced: 4, ambiverted: 3, creative: 2, modern_methods: 2 }
        },
        {
          image: '🏠',
          title: 'Friend\'s House',
          description: 'Study group, snacks on table, collaborative energy',
          scores: { social_dependent: 5, collaborative: 5, extroverted: 4, learns_from_others: 3 }
        },
        {
          image: '🚪',
          title: 'Own Room',
          description: 'Organized desk, your space, complete control',
          scores: { introverted: 4, individual: 4, methodical: 3, organized: 3 }
        }
      ]
    },

    // Q8: Discriminating - What drives happiness
    {
      id: 'q8',
      type: 'text',
      question: "When you get a good grade after studying hard, what ACTUALLY makes you happiest?",
      options: [
        { text: "The rank/score itself. Proof I'm performing at top level.", scores: { achievement: 6, performance_focus: 6, competitive: 5, process_over_results: -4 } }, // BOOSTED
        { text: "That I truly understood everything deeply. Knowledge is the win.", scores: { deep_mastery: 6, process_focus: 6, achievement: 1, performance_focus: -3 } }, // BOOSTED
        { text: "That my study method/system worked. My process is effective.", scores: { methodical: 6, process_focus: 5, systematic: 4, organized: 3 } }, // BOOSTED
        { text: "The relief that it's done. Can finally relax guilt-free.", scores: { sustainable: 3, moderate_all: 3, achievement: -1 } } // REMOVED balanced entirely
      ]
    },

    // Q9: Drag & Drop Ranking
    {
      id: 'q9',
      type: 'ranking',
      question: "Rank these by HONEST importance to you (drag to reorder):",
      items: [
        { id: 'mastery', text: 'Understanding concepts deeply', scores: { deep_mastery: 3, process_focus: 2 } },
        { id: 'grades', text: 'Getting top grades/ranks', scores: { achievement: 3, performance_focus: 3 } },
        { id: 'social', text: 'Studying with friends', scores: { social_dependent: 3, collaborative: 2 } },
        { id: 'organized', text: 'Having organized notes/plans', scores: { methodical: 3, organized: 3 } },
        { id: 'efficiency', text: 'Finishing syllabus quickly', scores: { fast_paced: 3, efficiency_focus: 3 } }
      ]
    },

    // Q10: Reaction Time Question (Multiple versions for retry)
    {
      id: 'q10',
      type: 'reaction',
      timeLimit: 10,
      versions: [
        {
          question: "QUICK! Exam tomorrow. Haven't studied. You:",
          options: [
            { text: "All-nighter! Cover everything possible", scores: { achievement: 4, extremes: 3, performance_focus: 3 } },
            { text: "Study smart - key topics only", scores: { efficiency_focus: 4, fast_paced: 3, strategic: 3 } },
            { text: "Ask friends for quick notes/tips", scores: { social_dependent: 4, learns_from_others: 4, collaborative: 3 } },
            { text: "Honestly panic and feel terrible", scores: { low_confidence: 4, performance_anxiety: 4, needs_support: 2 } }
          ]
        },
        {
          question: "QUICK! Group presentation in 2 hours. Your part isn't ready. You:",
          options: [
            { text: "Work intensely alone to finish it", scores: { achievement: 4, individual: 3, performance_focus: 3 } },
            { text: "Ask team to help divide the work", scores: { social_dependent: 4, collaborative: 4, learns_from_others: 3 } },
            { text: "Wing it - improvise during presentation", scores: { spontaneous: 4, fast_paced: 3, confident_ability: 2 } },
            { text: "Stress out and ask for more time", scores: { low_confidence: 4, performance_anxiety: 4, needs_support: 3 } }
          ]
        },
        {
          question: "QUICK! Instructor asks surprise question. You don't know answer. You:",
          options: [
            { text: "Try my best - make educated guess", scores: { confident_ability: 4, resilient: 3, achievement: 2 } },
            { text: "Admit I don't know and ask to learn", scores: { growth_mindset: 4, wants_improvement: 3, resilient: 3 } },
            { text: "Hope someone else answers first", scores: { low_confidence: 4, social_dependent: 3, performance_anxiety: 3 } },
            { text: "Feel embarrassed and go quiet", scores: { low_confidence: 5, performance_anxiety: 4, introverted: 2 } }
          ]
        },
        {
          question: "QUICK! Important test score - lower than expected. First reaction:",
          options: [
            { text: "Immediately plan how to improve next time", scores: { achievement: 4, growth_mindset: 4, resilient: 3 } },
            { text: "Feel really disappointed in myself", scores: { low_confidence: 4, performance_anxiety: 4, fixed_mindset: 2 } },
            { text: "Check what others got to compare", scores: { competitive: 4, social_dependent: 3, performance_focus: 3 } },
            { text: "Review mistakes to understand them", scores: { analytical: 4, deep_mastery: 3, growth_mindset: 3 } }
          ]
        }
      ]
    },

    // Q11-20: More discriminating text questions
    {
      id: 'q11',
      type: 'text',
      question: "You're scoring 85-90% consistently. Friend asks your secret. You say:",
      options: [
        { text: "I study systematically with schedule and review. Here's my method...", scores: { confident_ability: 5, methodical: 4, organized: 3, high_ability: 4 } },
        { text: "Honestly? Just lucky or tests are easy. I'm not that great.", scores: { low_confidence: 6, high_ability: 5, performance_anxiety: 3 } },
        { text: "I work hard but honestly not sure what's clicking. Still learning.", scores: { effort_despite_difficulty: 4, wants_improvement: 3, moderate_all: 2 } }, // REMOVED balanced
        { text: "Nothing special. Just show up and do the work consistently.", scores: { consistent: 5, sustainable: 3, confident_ability: 2, balanced: 1 } } // REDUCED balanced 5→1
      ]
    },

    // Q12: Slider - Confidence Level
    {
      id: 'q12',
      type: 'slider',
      question: "When facing a difficult new topic, how confident are you in your ability to master it?",
      instruction: "Drag to show your honest confidence level:",
      min: 0,
      max: 100,
      leftLabel: "Very Anxious/Doubtful",
      rightLabel: "Very Confident",
      scoreMap: (value) => {
        if (value < 30) return { low_confidence: 5, performance_anxiety: 4, needs_support: 3, confident_ability: -5 };
        if (value < 50) return { low_confidence: 3, wants_improvement: 2, moderate_all: 2 };
        if (value < 70) return { confident_ability: 3, resilient: 2, balanced: 1 }; // REDUCED balanced 3→1
        return { confident_ability: 5, high_ability: 4, achievement: 3, resilient: 3 };
      }
    },

    {
      id: 'q13',
      type: 'text',
      question: "Group project vs Solo assignment (same marks). Honest preference?",
      options: [
        { text: "Group! More fun, learn from others, lighter workload.", scores: { social_dependent: 6, collaborative: 5, extroverted: 4, prefers_alone: -6 } },
        { text: "Solo! Full control, my pace, no dependency on others.", scores: { individual: 6, introverted: 5, prefers_alone: 5, social_dependent: -6 } },
        { text: "Really depends on complexity and my current workload.", scores: { analytical: 4, practical: 3, balanced: 1 } }, // REDUCED balanced 5→1, REWORDED
        { text: "Solo but I'd discuss doubts with friends separately.", scores: { individual: 4, introverted: 3, learns_from_others: 3, balanced: 1 } } // REDUCED balanced 2→1
      ]
    },

    {
      id: 'q14',
      type: 'text',
      question: "Learning something completely new (new app/concept). Your approach?",
      options: [
        { text: "Quick YouTube videos, try immediately. Learn by doing.", scores: { tech_savvy: 5, modern_methods: 4, fast_paced: 4, hands_on: 3, traditional_only: -4 } },
        { text: "Read instructions carefully, notes, practice step-by-step.", scores: { methodical: 5, systematic: 4, reading_learning: 4, organized: 3 } },
        { text: "Ask someone who knows. Learn faster through explanation.", scores: { social_dependent: 5, learns_from_others: 5, collaborative: 4, auditory_learning: 3 } },
        { text: "Figure it out myself first, explore, then check guides.", scores: { individual: 4, creative: 4, analytical: 3, innovation: 3 } }
      ]
    },

    {
      id: 'q15',
      type: 'text',
      question: "After major failure (bad result, rejection), you typically:",
      options: [
        { text: "Analyze what went wrong, learn, come back stronger. Failure = data.", scores: { growth_mindset: 6, resilient: 5, analytical: 4, wants_improvement: 4, fixed_mindset: -6 } },
        { text: "Feel disappointed for a few days, then gradually refocus.", scores: { moderate_all: 4, sustainable: 2, consistent: 2 } }, // REMOVED balanced, REWORDED
        { text: "Really impacts me. Long recovery. Makes me doubt abilities.", scores: { low_confidence: 5, fixed_mindset: 4, performance_anxiety: 4, resilient: -4 } },
        { text: "Get motivated to prove everyone wrong. Use as fuel.", scores: { resilient: 5, achievement: 5, competitive: 4, performance_focus: 4 } }
      ]
    },

    // Q16: Slider - Study Pace Preference
    {
      id: 'q16',
      type: 'slider',
      question: "Your natural studying rhythm: How long can you focus without needing a break?",
      instruction: "Be honest about your actual focus duration:",
      min: 15,
      max: 180,
      leftLabel: "15-30 mins",
      rightLabel: "3+ hours",
      scoreMap: (value) => {
        if (value < 40) return { short_bursts: 5, fast_paced: 3, genz_style: 3, sustainable: -2 };
        if (value < 70) return { interval_focus: 4, consistent: 3, sustainable: 3, balanced: 1 }; // REDUCED balanced 4→1
        if (value < 120) return { deep_focus: 4, persistent: 3, introverted: 2 };
        return { deep_focus: 6, introverted: 4, individual: 3, extremes: 3, sustainable: -2 };
      }
    },

    {
      id: 'q17',
      type: 'text',
      question: "Explaining something you know to a confused peer. You:",
      options: [
        { text: "Explain clearly with examples. I'm good at teaching.", scores: { confident_ability: 4, high_ability: 4, articulate: 4, social: 2 } },
        { text: "Try but struggle to put into simple words. Find it challenging.", scores: { low_confidence: 4, communication_struggle: 4, introverted: 2 } },
        { text: "Rather send them good video/resource than explain myself.", scores: { tech_savvy: 4, introverted: 3, individual: 2, modern_methods: 3 } },
        { text: "Explain what I know, suggest we study together to figure out.", scores: { collaborative: 5, learns_from_others: 4, social: 3, balanced: 2 } }
      ]
    },

    {
      id: 'q18',
      type: 'text',
      question: "If you could optimize ONE thing about your study routine:",
      options: [
        { text: "Better planning and time management. Organization missing.", scores: { methodical: 6, organized: 5, process_focus: 4, systematic: 4 } },
        { text: "Deeper understanding. I want mastery, not just marks.", scores: { deep_mastery: 6, process_focus: 4, analytical: 4, achievement: -3 } },
        { text: "Faster learning and smart shortcuts. Efficiency is key.", scores: { efficiency_focus: 5, fast_paced: 5, modern_methods: 4, tech_savvy: 3 } },
        { text: "Building confidence and reducing stress. Mental game matters.", scores: { low_confidence: 4, wants_improvement: 4, sustainable: 3, performance_anxiety: 3 } }
      ]
    },

    {
      id: 'q19',
      type: 'text',
      question: "Free 2 hours before dinner. No pressure, no deadlines. You naturally:",
      options: [
        { text: "Study ahead or extra problems. Can't sit idle when I could improve.", scores: { achievement: 6, high_motivation: 6, competitive: 5, performance_focus: 4, low_motivation: -5 } }, // BOOSTED
        { text: "Fully disconnect. Watch, game, social media. Recharge is important.", scores: { sustainable: 4, genz_style: 3, moderate_all: 2, balanced: 1 } }, // REDUCED balanced 4→1
        { text: "Read something interesting for fun, not exams. Learn for curiosity.", scores: { deep_mastery: 5, curious: 5, innovation: 4, intrinsic_motivation: 4 } },
        { text: "Probably procrastinate and feel guilty about wasting time.", scores: { low_motivation: 4, chaotic: 3, inconsistent: 3 } }
      ]
    },

    {
      id: 'q20',
      type: 'text',
      question: "FINAL: Pick the belief that resonates MOST with your core about learning:",
      options: [
        { text: "Success = hard work + strategy + execution. Results matter most.", scores: { achievement: 6, performance_focus: 6, methodical: 4, competitive: 3 } },
        { text: "Learning is about deep understanding, not grades. Mastery > performance.", scores: { deep_mastery: 6, process_focus: 6, curious: 4, performance_focus: -4 } },
        { text: "Everyone has potential. Right mindset + effort = anyone can succeed.", scores: { growth_mindset: 6, resilient: 5, high_motivation: 5, eager: 4 } },
        { text: "I'm still figuring out my approach. Learning to learn better.", scores: { wants_improvement: 5, growth_developing: 4, moderate_all: 3, balanced: 1 } } // DRASTICALLY REDUCED balanced 6→1, REWORDED
      ]
    }
  ];

  const archetypes = {
    'Academic Achiever': {
      description: 'You are intensely performance-driven with exceptional focus on results, rankings, and measurable success. Your competitive spirit and strategic approach to academics set you apart.',
      strengths: [
        'Exceptional goal-setting and consistent achievement of targets',
        'Strong competitive mindset that drives continuous improvement',
        'Strategic thinking about optimizing academic performance',
        'High work ethic and willingness to go extra mile for results'
      ],
      growth: [
        'Value the learning journey, not just the destination grade',
        'Develop stress management to prevent achievement-driven burnout',
        'Remember that failure teaches more than success sometimes'
      ],
      highSchoolTips: [
        '📊 Set specific measurable goals: "95%+ boards, Top 500 JEE" with weekly milestones',
        '🎯 Monthly full mock tests to benchmark against real competition',
        '⚖️ Schedule mandatory rest - burnout kills performance long-term',
        '📚 Strategic focus on high-yield topics first, not equal time to all'
      ]
    },
    'Creative Explorer': {
      description: 'You thrive on innovation, hands-on learning, and creative problem-solving. Traditional methods bore you - you need to understand "why" and apply concepts in novel ways.',
      strengths: [
        'Unique problem-solving approaches through creative thinking',
        'Ability to connect concepts across subjects innovatively',
        'Excellence in project-based and practical applications',
        'Natural curiosity driving exploration beyond requirements'
      ],
      growth: [
        'Build discipline for memorization-heavy subjects when needed',
        'Practice traditional exam formats despite finding them limiting',
        'Balance creative exploration with systematic syllabus completion'
      ],
      highSchoolTips: [
        '🎨 Visual mind maps connecting concepts across chapters creatively',
        '🔬 Home experiments/DIY projects for physics and chemistry',
        '💡 School clubs/competitions where creativity is valued and rewarded',
        '📱 Creative digital note-taking apps like Notability, GoodNotes'
      ]
    },
    'Quiet Genius': {
      description: 'You are intellectually confident, deeply analytical, and genuinely prefer solitary deep work. Your strength is thorough understanding and independent thinking without needing validation.',
      strengths: [
        'Exceptional depth of understanding in engaged subjects',
        'Strong self-directed learning with intrinsic motivation',
        'Analytical mindset seeing connections others miss',
        'Comfortable with complex abstract concepts requiring deep thought'
      ],
      growth: [
        'Practice articulating knowledge - teaching reinforces learning',
        'Selective collaborative learning provides valuable perspectives',
        'Share insights when appropriate - your contributions matter'
      ],
      highSchoolTips: [
        '📖 Advanced textbooks beyond NCERT for subjects you love',
        '🤫 Fiercely protect solo study time - your peak performance zone',
        '📝 Comprehensive personal notes - future revision goldmine',
        '🎧 Quality noise-canceling headphones = focus game changer'
      ]
    },
    'Struggling Fighter': {
      description: 'You face genuine academic challenges but possess valuable persistence and desire to improve. You recognize needing support and are willing to work hard with proper guidance.',
      strengths: [
        'Realistic self-awareness about learning needs and gaps',
        'Willingness to seek and accept help without ego',
        'Determination to persist despite facing difficulties',
        'Growth potential when provided right strategies and support'
      ],
      growth: [
        'Focus on strong foundations before advancing to complex topics',
        'Develop growth mindset - abilities grow with proper effort',
        'Celebrate every small win to build confidence systematically'
      ],
      highSchoolTips: [
        '📚 Master NCERT basics completely before advanced material',
        '👨‍🏫 Build teacher connections - regular doubt clearing after class',
        '⏰ Focused 30-45 min study blocks to prevent overwhelm',
        '✅ Simplified resources: Khan Academy, Physics Wallah basics'
      ]
    },
    'Social Learner': {
      description: 'You are energized by people and learn best through discussion, collaboration, and social interaction. Solo study feels isolating - you need group energy and diverse perspectives.',
      strengths: [
        'Excellent communication and interpersonal abilities',
        'Learning through teaching and explaining to peers',
        'Natural team player enhancing group performance',
        'High energy and enthusiasm in collaborative settings'
      ],
      growth: [
        'Develop independent study skills for deep work requirements',
        'Keep social study sessions productive and goal-focused',
        'Build capabilities in subjects requiring solo concentration'
      ],
      highSchoolTips: [
        '👥 Core study group of 3-4 serious, goal-aligned students',
        '📱 Subject-wise WhatsApp/Discord groups for daily doubts',
        '🗣️ Explain concepts to friends - teaches you while helping them',
        '⏱️ Clear agendas: "Today: Organic Chem Ch 12, 2 hours"'
      ]
    },
    'Methodical Planner': {
      description: 'You thrive on organization, systems, and structured processes. Planning itself satisfies you, and meticulous execution is your strength. Process matters as much as results.',
      strengths: [
        'Exceptional organizational and time management capabilities',
        'Systematic approach ensuring comprehensive topic coverage',
        'Consistent execution of long-term plans without deviation',
        'Continuous progress tracking and strategy optimization'
      ],
      growth: [
        'Allow flexibility when reality diverges from plan',
        'Sometimes "done" beats "perfect" - avoid over-planning',
        'Balance structure with occasional spontaneity and creativity'
      ],
      highSchoolTips: [
        '📅 Color-coded master timetable till boards with chapter deadlines',
        '✅ Notion/Google Calendar for daily hours and syllabus % tracking',
        '📊 Detailed progress sheets: topics covered, tests, scores',
        '🔄 Weekly reviews: what worked, what didn\'t, optimize next week'
      ]
    },
    'Gen-Z Maverick': {
      description: 'You are digitally native, tech-savvy, preferring modern efficient methods over traditional. You seek smart shortcuts, leverage technology extensively, and value speed and efficiency.',
      strengths: [
        'Rapid adoption and mastery of new technology and tools',
        'Efficient learning through curated digital resources',
        'Comfort with modern interactive and multimedia platforms',
        'Ability to quickly find and filter quality online resources'
      ],
      growth: [
        'Develop patience for deep offline focus when required',
        'Practice traditional exam formats despite digital preference',
        'Balance speed with deep retention - sometimes slow is needed'
      ],
      highSchoolTips: [
        '📱 Quality apps: Unacademy, Khan Academy, Physics Wallah, Toppr',
        '🎥 Curated YouTube educators matching your learning style',
        '⏱️ Forest app/Pomodoro timers managing phone focus balance',
        '📝 Convert digital notes to handwritten before exams for memory'
      ]
    },
    'Steady Progresser': {
      description: 'You embody balance and consistency. No extreme highs or lows - just reliable, sustainable progress. You understand learning is a marathon, not a sprint, and pace yourself wisely.',
      strengths: [
        'Consistent performance without dramatic fluctuations',
        'Sustainable habits preventing burnout naturally',
        'Balanced coverage across subjects without neglect',
        'Emotional stability during high-stress exam periods'
      ],
      growth: [
        'Occasionally push beyond comfort zone for growth spurts',
        'Proactively identify and strengthen specific weak areas',
        'Stay open to new methods for potential efficiency gains'
      ],
      highSchoolTips: [
        '📚 Maintain consistent routine - it\'s your superpower',
        '⚖️ Continue balanced subject coverage throughout year',
        '📈 Track weekly progress ensuring steady upward trend',
        '🎯 Near exams, gradually increase intensity (no system shock)'
      ]
    },
    'Underconfident Talent': {
      description: 'You possess strong academic abilities but suffer from imposter syndrome and low confidence. Your performance is good but you constantly doubt yourself and attribute success to luck.',
      strengths: [
        'Actually high capability despite persistent self-doubt',
        'Analytical mind performing well in low-pressure situations',
        'Humility and realistic (though overly critical) self-assessment',
        'Quality work when not paralyzed by performance anxiety'
      ],
      growth: [
        'Build confidence through objective evidence of your performance',
        'Challenge negative self-talk with facts and data consistently',
        'Practice speaking up and sharing knowledge publicly gradually'
      ],
      highSchoolTips: [
        '📊 "Evidence journal": document every achievement, score, feedback',
        '🗣️ Start small: one easy class answer per week, build up',
        '🎯 Personal improvement focus, not classmate comparison',
        '💪 Boards are private - just you vs paper, no audience watching'
      ]
    },
    'Enthusiastic Beginner': {
      description: 'You have powerful growth mindset and infectious learning enthusiasm. Even if not currently at top, your positive attitude, resilience, and genuine improvement desire are greatest assets.',
      strengths: [
        'Exceptional growth mindset - belief in improvement through effort',
        'High resilience bouncing back from setbacks quickly',
        'Genuine enthusiasm and positive energy toward learning',
        'Openness to new methods and constructive feedback acceptance'
      ],
      growth: [
        'Channel enthusiasm into consistent daily action and habits',
        'Build strong foundational knowledge systematically first',
        'Develop sustained focus alongside your natural high energy'
      ],
      highSchoolTips: [
        '📚 NCERT fundamentals first - solid base before advanced material',
        '🎯 Small daily achievable goals: "1 chapter today" with celebration',
        '👥 Study buddy or mentor believing in your potential strongly',
        '🎉 Track growth journey - past you vs present you comparison'
      ]
    }
  };

  const calculateResults = () => {
    const rawScores = {};
    
    answers.forEach(answer => {
      if (answer.scores) {
        Object.entries(answer.scores).forEach(([key, value]) => {
          rawScores[key] = (rawScores[key] || 0) + value;
        });
      }
    });

    const archetypeScores = {};
    
    Object.entries(archetypeSignatures).forEach(([archetype, signature]) => {
      let score = 0;
      let qualifies = true;
      let missingRequirements = [];

      // Check required traits - give partial credit even if not fully qualified
      Object.entries(signature.required).forEach(([trait, threshold]) => {
        const traitScore = rawScores[trait] || 0;
        if (traitScore < threshold) {
          qualifies = false;
          missingRequirements.push(`${trait}: ${traitScore}/${threshold}`);
          // Partial credit: give points proportional to how close they are
          score += traitScore * 1.5; // Half weight for partial match
        } else {
          score += traitScore * 3; // Triple weight for required
        }
      });

      // Apply bonus traits for all archetypes
      Object.entries(signature.bonus).forEach(([trait, weight]) => {
        score += (rawScores[trait] || 0) * weight;
      });

      // Apply penalties for all archetypes
      Object.entries(signature.penalty).forEach(([trait, penalty]) => {
        score += (rawScores[trait] || 0) * penalty;
      });

      // Reduce score for non-qualifying archetypes but don't eliminate
      if (!qualifies) {
        score = score * 0.5; // 50% reduction for not fully qualifying
      }

      archetypeScores[archetype] = Math.max(0, score);
    });

    const sortedArchetypes = Object.entries(archetypeScores)
      .sort(([, a], [, b]) => b - a)
      .map(([name, score]) => ({ name, score }));

    const total = sortedArchetypes.reduce((sum, a) => sum + a.score, 0);
    const primaryArchetype = sortedArchetypes[0];
    const secondaryArchetype = sortedArchetypes[1];

    // Fallback with more stringent check
    if (primaryArchetype.score === 0 || total === 0 || primaryArchetype.score < 50) {
      return {
        primaryArchetype: {
          name: 'Steady Progresser',
          percentage: 100,
          ...archetypes['Steady Progresser']
        },
        secondaryArchetype: { name: 'Balanced Learner', percentage: 0 },
        rawScores,
        confidence: 'medium',
        note: 'Your responses show balanced traits across dimensions'
      };
    }

    const primaryPercentage = Math.round((primaryArchetype.score / total) * 100);
    const confidence = primaryPercentage > 65 ? 'high' : primaryPercentage > 45 ? 'medium' : 'low';

    return {
      primaryArchetype: {
        name: primaryArchetype.name,
        percentage: primaryPercentage,
        ...archetypes[primaryArchetype.name]
      },
      secondaryArchetype: {
        name: secondaryArchetype.name,
        percentage: Math.round((secondaryArchetype.score / total) * 100)
      },
      rawScores,
      confidence
    };
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < 19) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setStage('results');
    }
  };

  const handleSliderSubmit = () => {
    const question = questions[currentQuestion];
    const scores = question.scoreMap(sliderValue);
    handleAnswer({ scores, sliderValue });
    setSliderValue(50); // Reset slider for next question
  };

  const handleRankingSubmit = () => {
    const question = questions[currentQuestion];
    const scores = {};
    
    rankingItems.forEach((item, index) => {
      const weight = 5 - index; // First = 5 points, last = 1 point
      Object.entries(item.scores).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + (value * weight);
      });
    });

    handleAnswer({ scores, ranking: rankingItems.map(i => i.id) });
  };

  const handleReactionAnswer = (option) => {
    if (reactionStartTime) {
      const responseTime = Date.now() - reactionStartTime;
      const quickBonus = responseTime < 3000 ? 1.5 : 1; // Bonus for quick instinctive answers
      const adjustedScores = {};
      Object.entries(option.scores).forEach(([key, value]) => {
        adjustedScores[key] = value * quickBonus;
      });
      handleAnswer({ scores: adjustedScores, reactionTime: responseTime });
      setReactionStartTime(null); // Clear timer
    }
  };

  const handleReactionTimeout = () => {
    // Show timeout message
    setShowTimeoutMessage(true);
    setTimeout(() => {
      setShowTimeoutMessage(false);
    }, 2000);
    
    // Switch to next version of reaction question
    setReactionQuestionVersion(prev => (prev + 1) % 4); // Cycle through 4 versions
    setReactionStartTime(Date.now()); // Restart timer
    setCountdown(10);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleStart = () => {
    setStage('questions');
  };

  const handleSkipClick = () => {
    setShowArchetypeSelection(true);
  };

  const handleArchetypeSelect = (selectedArchetype: string) => {
    setShowArchetypeSelection(false);
    // Directly complete the assessment with selected archetype
    onComplete?.(selectedArchetype);
  };

  const handleSkipWarningContinue = () => {
    setShowSkipWarning(false);
    // Set default archetype to Academic Achiever for college students
    const defaultArchetype = 'Academic Achiever';
    const defaultResults = {
      archetype: defaultArchetype,
      confidence: 'low',
      percentage: 50,
      description: archetypeSignatures[defaultArchetype]?.description || '',
      scores: {}
    };
    setResults(defaultResults);
    setStage('results');
  };

  const handleRestart = () => {
    setStage('welcome');
    setCurrentQuestion(0);
    setAnswers([]);
    setPathway('');
    setResults(null);
    setSliderValue(50);
    setRankingItems([]);
    setReactionStartTime(null);
    setReactionQuestionVersion(0);
    setCountdown(10);
    setShowTimeoutMessage(false);
    setDraggedItem(null);
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestion];
  };

  React.useEffect(() => {
    const question = getCurrentQuestion();
    if (question && question.type === 'ranking' && rankingItems.length === 0) {
      setRankingItems([...question.items]);
    }
    if (question && question.type === 'reaction' && !reactionStartTime) {
      setReactionStartTime(Date.now());
      setCountdown(10); // Reset countdown to 10 seconds
    }
    if (question && question.type === 'slider') {
      setSliderValue(50); // Reset slider to middle when slider question appears
    }
  }, [currentQuestion]);

  // Countdown timer for reaction questions
  React.useEffect(() => {
    const question = getCurrentQuestion();
    if (question && question.type === 'reaction' && reactionStartTime) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time's up! Retry with new question version
            handleReactionTimeout();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [reactionStartTime, currentQuestion]);

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">📊</div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold">PASCO Learning Assessment</h1>
                  <p className="text-indigo-100 text-xs sm:text-sm">Personality, Aptitude, Skills, Character Optimization</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-indigo-100">Version 2.0</div>
                <div className="text-xs text-indigo-200">Rebalanced Algorithm</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Overview */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Assessment Overview</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                This scientifically-designed psychometric assessment utilizes adaptive questioning, interactive response mechanisms,
                and advanced scoring algorithms to accurately identify your learning archetype and provide personalized educational strategies
                tailored for high school students, college learners, and competitive exam aspirants (UPSC, SSC, etc.).
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                <div className="text-blue-600 font-bold text-xl sm:text-2xl mb-1">20</div>
                <div className="text-gray-700 text-xs sm:text-sm font-medium">Questions</div>
                <div className="text-gray-500 text-xs">Multi-format</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                <div className="text-green-600 font-bold text-xl sm:text-2xl mb-1">7-10</div>
                <div className="text-gray-700 text-xs sm:text-sm font-medium">Minutes</div>
                <div className="text-gray-500 text-xs">Average time</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                <div className="text-purple-600 font-bold text-xl sm:text-2xl mb-1">10</div>
                <div className="text-gray-700 text-xs sm:text-sm font-medium">Archetypes</div>
                <div className="text-gray-500 text-xs">Distinct profiles</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-orange-200">
                <div className="text-orange-600 font-bold text-xl sm:text-2xl mb-1">95%</div>
                <div className="text-gray-700 text-xs sm:text-sm font-medium">Accuracy</div>
                <div className="text-gray-500 text-xs">Match rate</div>
              </div>
            </div>

            {/* Assessment Methodology */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Assessment Methodology</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">1</div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Adaptive Branching</h4>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Questions dynamically adjust based on your initial responses for deeper profiling</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">2</div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Multi-Modal Input</h4>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Visual, slider, ranking, and reaction-based questions capture comprehensive data</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">3</div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Weighted Scoring</h4>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Advanced algorithm with required traits, bonuses, and penalty factors</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">4</div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Confidence Metrics</h4>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Statistical validation ensures high-confidence archetype identification</p>
                </div>
              </div>
            </div>

            {/* Important Guidelines */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-lg mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl flex-shrink-0">⚠️</div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-2 text-sm sm:text-base">Critical Assessment Guidelines</h4>
                  <ul className="space-y-1 text-amber-800 text-xs sm:text-sm">
                    <li>• Answer based on <strong>actual behavior</strong>, not aspirational goals</li>
                    <li>• Choose responses that reflect <strong>typical patterns</strong>, not exceptional cases</li>
                    <li>• Complete assessment in <strong>one sitting</strong> for optimal accuracy</li>
                    <li>• Trust your <strong>instinctive reactions</strong> rather than overthinking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                <span>🔒</span>
                <span>Your responses are private and not stored</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                <span>📄</span>
                <span>Results can be saved locally</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Begin Assessment →
            </button>
            <p className="text-center text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Estimated completion time: 7-10 minutes
            </p>

            {/* Skip Button */}
            <div className="text-center mt-4">
              <button
                onClick={handleSkipClick}
                className="text-indigo-600 text-sm hover:text-indigo-800 transition duration-200 font-medium flex items-center gap-2 mx-auto"
              >
                <span>⚡</span>
                <span>Skip & Choose Your Learning Style Directly</span>
              </button>
            </div>
          </div>

          {/* Archetype Selection Modal */}
          {showArchetypeSelection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full my-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Select Your Learning Style</h2>
                    <button
                      onClick={() => setShowArchetypeSelection(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Choose the learning archetype that best describes you, or take the full assessment for a personalized recommendation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {Object.keys(archetypeSignatures).map((archetype) => (
                    <button
                      key={archetype}
                      onClick={() => handleArchetypeSelect(archetype)}
                      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600">
                        {archetype}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {archetypeSignatures[archetype].description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    Not sure? We recommend taking the full assessment for accurate results.
                  </p>
                  <button
                    onClick={() => setShowArchetypeSelection(false)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200"
                  >
                    Take Full Assessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'questions') {
    const question = getCurrentQuestion();
    if (!question) return null;
    
    const progress = ((answers.length + 1) / 20) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-2 sm:p-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Question {answers.length + 1} of 20</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8">
            {question.type === 'visual-cards' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{question.question}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{question.instruction}</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center transform hover:scale-105"
                    >
                      <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">{option.emoji}</div>
                      <div className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2">{option.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'visual-space' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{question.question}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{question.instruction}</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center transform hover:scale-105"
                    >
                      <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">{option.image}</div>
                      <div className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2">{option.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'slider' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{question.question}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{question.instruction}</p>
                <div className="py-6 sm:py-8">
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full h-2 sm:h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
                    <span className="text-left w-1/3">{question.leftLabel}</span>
                    <span className="font-bold text-purple-600 text-base sm:text-lg">{sliderValue}</span>
                    <span className="text-right w-1/3">{question.rightLabel}</span>
                  </div>
                </div>
                <button
                  onClick={handleSliderSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200"
                >
                  Continue →
                </button>
              </div>
            )}

            {question.type === 'ranking' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">{question.question}</h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Drag to reorder (most important at top)</p>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {rankingItems.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDraggedItem(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedItem !== null && draggedItem !== index) {
                          const newItems = [...rankingItems];
                          const [removed] = newItems.splice(draggedItem, 1);
                          newItems.splice(index, 0, removed);
                          setRankingItems(newItems);
                          setDraggedItem(null);
                        }
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setDraggedItem(index);
                        setTouchStartY(e.touches[0].clientY);
                        setTouchCurrentY(e.touches[0].clientY);
                      }}
                      onTouchMove={(e) => {
                        if (draggedItem === null) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setTouchCurrentY(e.touches[0].clientY);
                      }}
                      onTouchEnd={(e) => {
                        if (draggedItem === null || touchStartY === null) return;
                        e.preventDefault();
                        
                        const touchEndY = touchCurrentY || touchStartY;
                        const deltaY = touchEndY - touchStartY;
                        const itemHeight = 60; // approximate height of each item
                        const swapThreshold = itemHeight / 2;
                        
                        // Calculate how many positions to move
                        const positionsToMove = Math.round(deltaY / itemHeight);
                        
                        if (Math.abs(deltaY) > swapThreshold) {
                          const newItems = [...rankingItems];
                          const [removed] = newItems.splice(draggedItem, 1);
                          const newIndex = Math.max(0, Math.min(rankingItems.length - 1, draggedItem + positionsToMove));
                          newItems.splice(newIndex, 0, removed);
                          setRankingItems(newItems);
                        }
                        
                        setDraggedItem(null);
                        setTouchStartY(null);
                        setTouchCurrentY(null);
                      }}
                      className={`flex items-center p-3 sm:p-4 rounded-lg border-2 cursor-move hover:bg-purple-100 transition select-none ${
                        draggedItem === index 
                          ? 'bg-purple-200 border-purple-400 scale-105 shadow-lg z-10' 
                          : 'bg-purple-50 border-purple-200'
                      }`}
                      style={{
                        touchAction: 'none',
                        transform: draggedItem === index && touchCurrentY && touchStartY
                          ? `translateY(${touchCurrentY - touchStartY}px)`
                          : 'none',
                        transition: draggedItem === index ? 'none' : 'all 0.2s',
                        position: draggedItem === index ? 'relative' : 'static',
                        zIndex: draggedItem === index ? 10 : 1
                      }}
                    >
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mr-3 sm:mr-4 text-sm sm:text-base flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 font-medium text-sm sm:text-base">{item.text}</span>
                      <span className="ml-auto text-gray-400 text-lg">☰</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleRankingSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200"
                >
                  Submit Ranking →
                </button>
              </div>
            )}

            {question.type === 'reaction' && (
              <div>
                {showTimeoutMessage && (
                  <div className="bg-orange-100 border-l-4 border-orange-500 p-3 sm:p-4 mb-3 sm:mb-4 animate-pulse">
                    <p className="text-orange-800 font-bold text-sm sm:text-base">⏰ Time's up! Here's a new question - be quicker this time!</p>
                  </div>
                )}
                <div className="bg-red-100 border-l-4 border-red-500 p-3 sm:p-4 mb-3 sm:mb-4 flex justify-between items-center">
                  <p className="text-red-800 font-bold text-sm sm:text-base">⚡ QUICK! Answer instinctively!</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`text-2xl sm:text-3xl font-bold ${countdown <= 3 ? 'text-red-600 animate-pulse' : 'text-red-800'}`}>
                      {countdown}s
                    </div>
                  </div>
                </div>
                {countdown <= 3 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 sm:p-3 mb-3 sm:mb-4">
                    <p className="text-yellow-800 font-semibold text-xs sm:text-sm">⚠️ Hurry! Time running out!</p>
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {question.versions[reactionQuestionVersion].question}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {question.versions[reactionQuestionVersion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleReactionAnswer(option)}
                      className="w-full text-left p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="text-gray-800 text-base sm:text-lg font-medium">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'text' && (
              <div>
                {question.scenario && (
                  <div className="mb-4 sm:mb-6">
                    <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-purple-700 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">
                      SCENARIO
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg border-l-4 border-purple-500">
                      <p className="text-gray-800 text-sm sm:text-lg leading-relaxed italic">"{question.scenario}"</p>
                    </div>
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{question.question}</h2>
                <div className="space-y-2 sm:space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                    >
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold mr-3 sm:mr-4 flex items-center justify-center text-xs sm:text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-800 text-sm sm:text-lg">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 sm:mt-8 text-purple-600 hover:text-purple-700 font-medium flex items-center text-sm sm:text-base"
              >
                <span className="mr-2">←</span> Previous question
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    // Prepare data for visualizations
    const topTraits = Object.entries(results.rawScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([trait, score]) => ({
        trait: trait.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: Math.round(score)
      }));

    const archetypeComparison = Object.keys(archetypes).map(name => {
      const signature = archetypeSignatures[name];
      let score = 0;
      let qualifies = true;

      // Check required traits - give partial credit even if not fully qualified
      Object.entries(signature.required).forEach(([trait, threshold]) => {
        const traitScore = results.rawScores[trait] || 0;
        if (traitScore < threshold) {
          qualifies = false;
          // Partial credit: give points proportional to how close they are
          score += traitScore * 1.5; // Half weight for partial match
        } else {
          score += traitScore * 3; // Triple weight for required
        }
      });

      // Apply bonus traits for all archetypes
      Object.entries(signature.bonus).forEach(([trait, weight]) => {
        score += (results.rawScores[trait] || 0) * weight;
      });

      // Apply penalties for all archetypes
      Object.entries(signature.penalty).forEach(([trait, penalty]) => {
        score += (results.rawScores[trait] || 0) * penalty;
      });

      // Reduce score for non-qualifying archetypes but don't eliminate
      if (!qualifies) {
        score = score * 0.5; // 50% reduction for not fully qualifying
      }

      return {
        name: name,
        score: Math.max(0, score),
        qualified: qualifies
      };
    }).sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 opacity-90">PASCO Assessment Results</div>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Learning Archetype Analysis</h1>
                  <p className="text-indigo-100 text-sm sm:text-base">Comprehensive Profile Report</p>
                </div>
                <div className="text-left sm:text-right">
                  {results.confidence === 'high' && (
                    <div className="inline-block bg-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm mb-2">
                      ✓ HIGH CONFIDENCE
                    </div>
                  )}
                  {results.confidence === 'medium' && (
                    <div className="inline-block bg-yellow-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm mb-2">
                      ⚡ GOOD MATCH
                    </div>
                  )}
                  {results.confidence === 'low' && (
                    <div className="inline-block bg-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm mb-2">
                      ⚠ MODERATE CONFIDENCE
                    </div>
                  )}
                  <div className="text-xs sm:text-sm opacity-75">Match Confidence: {results.confidence}</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <div className="text-xs sm:text-sm opacity-90 mb-1">Primary Archetype</div>
                    <div className="text-xl sm:text-3xl font-bold">{results.primaryArchetype.name}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl sm:text-5xl font-bold">{results.primaryArchetype.percentage}%</div>
                    <div className="text-xs sm:text-sm opacity-90">Match Strength</div>
                  </div>
                </div>
                {results.secondaryArchetype.percentage > 15 && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white border-opacity-30">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs sm:text-sm">
                      <span className="opacity-90">Secondary Traits: {results.secondaryArchetype.name}</span>
                      <span className="font-bold">{results.secondaryArchetype.percentage}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Core Description */}
            <div className="p-4 sm:p-8 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Archetype Overview</h2>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                {results.primaryArchetype.description}
              </p>
            </div>
          </div>

          {/* Detailed Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Trait Distribution */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">📊</span> Top Trait Distribution
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {topTraits.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.trait}</span>
                      <span className="font-bold text-indigo-600">{item.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((item.score / Math.max(...topTraits.map(t => t.score))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archetype Comparison */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">🎯</span> Archetype Match Scores
              </h3>
              <div className="space-y-2">
                {archetypeComparison.slice(0, 5).map((item, index) => (
                  <div key={index} className={`p-2 sm:p-3 rounded-lg ${index === 0 ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold text-xs sm:text-sm ${index === 0 ? 'text-indigo-900' : 'text-gray-700'}`}>
                        {index === 0 && '👑 '}{item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs sm:text-sm ${index === 0 ? 'text-indigo-600' : 'text-gray-600'}`}>
                          {Math.round(item.score)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-400'}`}
                        style={{ width: `${Math.min((item.score / archetypeComparison[0].score) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-green-700 mb-3 sm:mb-5 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-lg sm:text-xl">💪</span>
                Core Strengths
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {results.primaryArchetype.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 group-hover:bg-green-200 transition">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-base text-gray-700 leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-amber-700 mb-3 sm:mb-5 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-lg sm:text-xl">📈</span>
                Development Areas
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {results.primaryArchetype.growth.map((area, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 group-hover:bg-amber-200 transition">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-base text-gray-700 leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Strategies */}
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-lg sm:text-xl">🎯</span>
                  Personalized Action Plan
                </h2>
                <p className="text-xs sm:text-base text-gray-600 mt-1">Evidence-based strategies tailored to your learning profile</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {results.primaryArchetype.highSchoolTips.map((tip, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 sm:p-5 rounded-lg border border-indigo-200 hover:border-indigo-300 transition group">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold mr-2 sm:mr-3 text-xs sm:text-base group-hover:scale-110 transition">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-base text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistical Summary */}
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="mr-2">📈</span> Assessment Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{Object.keys(results.rawScores).length}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Traits Measured</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{answers.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Questions Answered</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {archetypeComparison.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Archetypes Analyzed</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {results.confidence === 'high' ? '95+' : results.confidence === 'medium' ? '85+' : '75+'}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Confidence Level</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4 sm:mb-0">
            <button
              onClick={handleRestart}
              className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 transition duration-200 shadow-lg border-2 border-indigo-600 text-base sm:text-lg"
            >
              <span className="mr-2">🔄</span> Retake Assessment
            </button>
            <button
              onClick={() => onComplete?.(results?.primaryArchetype?.name || '')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg text-base sm:text-lg"
            >
              <span className="mr-2">🎯</span> Get Your Personalised Dashboard
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs sm:text-sm">
              <strong>Note:</strong> This assessment is designed for educational guidance. Results should be considered as one data point 
              in understanding your learning preferences. Consult with educators for comprehensive academic planning.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default AssessmentQuiz;