// Exercise content and logic for different skill types
import type { Question } from './questionBank';

export interface MemoryExercise {
  id: string;
  type: 'number' | 'word' | 'image' | 'sequence';
  content: string | string[];
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  tips: string[];
}

export interface MeditationExercise {
  id: string;
  title: string;
  duration: number; // in seconds
  type: 'focus' | 'mindfulness' | 'visualization' | 'study';
  audioUrl?: string;
  instructions: string[];
  benefits: string[];
}

export interface LogicalExercise {
  id: string;
  type: 'syllogism' | 'pattern' | 'sequence' | 'analogy';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

// Memory Exercises
export const memoryExercises: MemoryExercise[] = [
  {
    id: 'num-seq-1',
    type: 'number',
    content: '739481265',
    duration: 30,
    difficulty: 'beginner',
    instructions: 'Memorize this sequence of numbers in 30 seconds. Try to create patterns or chunks to help remember.',
    tips: [
      'Break the number into chunks of 3',
      'Look for patterns or relationships',
      'Create a story with the numbers',
      'Visualize the numbers in your mind'
    ]
  },
  {
    id: 'num-seq-2',
    type: 'number',
    content: '8472916354',
    duration: 30,
    difficulty: 'intermediate',
    instructions: 'Study this 10-digit sequence. Try to notice any patterns or relationships between numbers.',
    tips: [
      'Group numbers by pairs',
      'Find mathematical relationships',
      'Use visualization techniques',
      'Create memorable patterns'
    ]
  },
  {
    id: 'word-seq-1',
    type: 'word',
    content: ['Democracy', 'Parliament', 'Constitution', 'Judiciary', 'Federation'],
    duration: 45,
    difficulty: 'intermediate',
    instructions: 'Memorize these key terms in order. Create connections between the words.',
    tips: [
      'Create a story linking the words',
      'Visualize each concept',
      'Make acronyms',
      'Find logical connections'
    ]
  },
  {
    id: 'image-seq-1',
    type: 'image',
    content: [
      'https://images.unsplash.com/photo-1533922922960-9fceb9ef4733?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1577017040065-650ee4d43339?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
    ],
    duration: 60,
    difficulty: 'advanced',
    instructions: 'Study these images and their details. Try to remember specific elements and their order.',
    tips: [
      'Focus on distinctive features',
      'Create a story connecting images',
      'Notice colors and patterns',
      'Use spatial memory techniques'
    ]
  }
];

// Meditation Exercises
export const meditationExercises: MeditationExercise[] = [
  {
    id: 'focus-1',
    title: 'Pre-Study Focus Meditation',
    duration: 300, // 5 minutes
    type: 'focus',
    instructions: [
      'Find a quiet, comfortable place to sit',
      'Close your eyes and take deep breaths',
      'Focus your attention on your breath',
      'When your mind wanders, gently bring it back',
      'Gradually expand awareness to your study intentions'
    ],
    benefits: [
      'Improved concentration',
      'Reduced study anxiety',
      'Enhanced mental clarity',
      'Better information retention'
    ]
  },
  {
    id: 'mindful-1',
    title: 'Mindful Learning Practice',
    duration: 600, // 10 minutes
    type: 'mindfulness',
    instructions: [
      'Sit comfortably with your study materials',
      'Take three deep breaths',
      'Notice physical sensations and thoughts',
      'Observe your learning environment',
      'Set clear intentions for your study session'
    ],
    benefits: [
      'Increased learning awareness',
      'Better focus on study materials',
      'Reduced mental fatigue',
      'Improved learning efficiency'
    ]
  },
  {
    id: 'visual-1',
    title: 'Memory Palace Visualization',
    duration: 900, // 15 minutes
    type: 'visualization',
    instructions: [
      'Close your eyes and visualize a familiar place',
      'Walk through this space mentally',
      'Place key concepts at specific locations',
      'Create vivid associations',
      'Practice recalling the information spatially'
    ],
    benefits: [
      'Enhanced memory retention',
      'Improved spatial memory',
      'Better information organization',
      'Stronger recall abilities'
    ]
  }
];

// Logical Reasoning Exercises
export const logicalExercises: LogicalExercise[] = [
  {
    id: 'syl-1',
    type: 'syllogism',
    question: 'All UPSC toppers are hardworking. Some hardworking people are early risers. What can we conclude?',
    options: [
      'All UPSC toppers are early risers',
      'Some UPSC toppers may be early risers',
      'No UPSC toppers are early risers',
      'None of the above'
    ],
    correct: 1,
    explanation: 'Since we only know that "some" hardworking people are early risers, we can only conclude that some UPSC toppers "may" be early risers. We cannot make a definitive statement about all toppers.',
    difficulty: 'intermediate',
    category: 'Deductive Reasoning'
  },
  {
    id: 'pat-1',
    type: 'pattern',
    question: 'What number comes next in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['42', '40', '36', '44'],
    correct: 0,
    explanation: 'The pattern adds consecutive even numbers: +4, +6, +8, +10, +12. Therefore, 30 + 12 = 42',
    difficulty: 'intermediate',
    category: 'Pattern Recognition'
  },
  {
    id: 'seq-1',
    type: 'sequence',
    question: 'Complete the analogy: Book is to Reading as Lecture is to _____',
    options: ['Writing', 'Speaking', 'Listening', 'Teaching'],
    correct: 2,
    explanation: 'A book is consumed by reading, similarly a lecture is consumed by listening',
    difficulty: 'beginner',
    category: 'Analogical Reasoning'
  }
];

// Helper functions for exercise generation
export function generateMemoryExercise(difficulty: string): MemoryExercise {
  // Generate a random exercise based on difficulty
  const exercises = memoryExercises.filter(ex => ex.difficulty === difficulty);
  return exercises[Math.floor(Math.random() * exercises.length)];
}

export function generateMeditationExercise(type: string): MeditationExercise {
  // Get meditation exercise by type
  return meditationExercises.find(ex => ex.type === type) || meditationExercises[0];
}

export function generateLogicalExercise(type: string, difficulty: string): LogicalExercise {
  // Get logical exercise by type and difficulty
  return logicalExercises.find(ex => ex.type === type && ex.difficulty === difficulty) || logicalExercises[0];
}