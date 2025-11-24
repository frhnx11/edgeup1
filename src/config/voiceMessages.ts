// Voice messages configuration for different pages
// Maps route paths to voice messages for ElevenLabs TTS

export interface VoiceMessage {
  key: string;
  text: string;
}

export const PAGE_VOICE_MESSAGES: Record<string, VoiceMessage> = {
  // Dashboard
  'dashboard': {
    key: 'dashboard',
    text: 'Welcome back! Continue your learning journey with personalized resources and track your progress!'
  },

  // Academic Achiever Pages
  'advanced-analytics': {
    key: 'advanced-analytics',
    text: 'Advanced insights await! Discover hidden patterns in your learning with AI-powered analytics!'
  },
  'leaderboard': {
    key: 'leaderboard',
    text: 'See where you stand! Compare your performance with peers and get motivated to climb higher!'
  },
  'readiness-score': {
    key: 'readiness-score',
    text: 'Check your exam readiness! I will calculate your preparedness based on syllabus coverage and test scores!'
  },
  'test-analytics': {
    key: 'test-analytics',
    text: 'Master your test strategy! See which topics need attention and which question types to focus on!'
  },
  'quizzes': {
    key: 'quizzes',
    text: 'Quick learning checks! Test your knowledge with bite-sized quizzes on every topic!'
  },

  // Study Pages
  'calendar': {
    key: 'calendar',
    text: 'Your study calendar! You have 2 live classes today and 1 assignment due tomorrow - stay on track!'
  },
  'classes': {
    key: 'classes',
    text: 'Virtual classroom hub! Attend live sessions, watch recordings, and never miss a class!'
  },
  'performance': {
    key: 'performance',
    text: 'Deep dive into your performance! Analyze trends, identify patterns, and track your growth over time!'
  },
  'tasks': {
    key: 'tasks',
    text: 'Task management central! You have 5 pending tasks - let us prioritize and complete them!'
  },
  'resources': {
    key: 'resources',
    text: 'Your comprehensive resource hub! Access PDFs, videos, audio lectures, and practice materials all in one place!'
  },
  'syllabus': {
    key: 'syllabus',
    text: 'Track your syllabus coverage! Stay organized and ensure you complete every topic before the exam!'
  },
  'tests': {
    key: 'tests',
    text: 'Your complete testing suite! Choose from topic-wise tests, full-length mocks, or quick revision quizzes!'
  },

  // Development Pages
  'skills': {
    key: 'skills',
    text: 'Develop essential skills! Work on critical thinking, time management, and problem-solving abilities!'
  },
  'question-generation': {
    key: 'question-generation',
    text: 'Create custom question papers! Select topics, difficulty, and question types - I will generate them instantly!'
  },
  'exam-correction': {
    key: 'exam-correction',
    text: 'AI-powered answer evaluation! Get instant feedback on your subjective answers with improvement tips!'
  },

  // Personal Pages
  'mentor': {
    key: 'mentor',
    text: 'Connect with your mentor! Get personalized guidance, career advice, and motivation from experts!'
  },
  'smart-gadgets': {
    key: 'smart-gadgets',
    text: 'Integrate your smart devices! Connect wearables and study tools for enhanced learning analytics!'
  },
  'pasco': {
    key: 'pasco',
    text: 'PASCO Assessment Center! Evaluate your Problem-solving, Analytical, Spatial, and Confidence skills!'
  },

  // AI Learning Pages
  'ai-learning': {
    key: 'ai-learning',
    text: 'Personalized AI-powered learning! Get customized study plans and content tailored to your needs!'
  },
  'ai-lesson-plan': {
    key: 'ai-lesson-plan',
    text: 'AI-generated lesson plans! Get structured study schedules designed specifically for you!'
  },
  'test-page': {
    key: 'test-page',
    text: 'Ready to test your knowledge? Let us see how well prepared you are!'
  },

  // Main section pages
  'social-learner': {
    key: 'dashboard',
    text: 'Welcome to Social Learner! Explore collaborative learning and connect with peers to enhance your studies!'
  },
  'academic-achiever': {
    key: 'advanced-analytics',
    text: 'Welcome to Academic Achiever! Focus on performance analytics and advanced study strategies!'
  },

  // Default fallback
  'default': {
    key: 'default',
    text: "Hello! I'm here to help. Click me anytime you need assistance!"
  }
};

/**
 * Get voice message for a given route path
 * @param pathname - Current route pathname
 * @returns Voice message object
 */
export function getVoiceMessageForRoute(pathname: string): VoiceMessage {
  console.log('🔍 getVoiceMessageForRoute: Checking path:', pathname);

  // Extract the last part of the path (the page name)
  const pathParts = pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  console.log('🔍 Path parts:', pathParts);
  console.log('🔍 Last part:', lastPart);

  // PRIORITY 1: Check for exact matches first
  if (PAGE_VOICE_MESSAGES[lastPart]) {
    console.log('✅ Found exact match for:', lastPart);
    return PAGE_VOICE_MESSAGES[lastPart];
  }

  // PRIORITY 2: Check for study/development/personal sections FIRST (more specific)
  if (pathname.includes('/study')) {
    // Default to calendar for study section
    console.log('✅ Study section detected, using calendar audio');
    return PAGE_VOICE_MESSAGES['calendar'];
  }

  if (pathname.includes('/development')) {
    // Default to skills for development section
    console.log('✅ Development section detected, using skills audio');
    return PAGE_VOICE_MESSAGES['skills'];
  }

  if (pathname.includes('/personal')) {
    // Default to mentor for personal section
    console.log('✅ Personal section detected, using mentor audio');
    return PAGE_VOICE_MESSAGES['mentor'];
  }

  // PRIORITY 3: Check specific page paths
  // Check for specific pages (more specific patterns first)
  const specificPages = [
    'dashboard',
    'advanced-analytics',
    'leaderboard',
    'readiness-score',
    'test-analytics',
    'quizzes',
    'calendar',
    'classes',
    'performance',
    'tasks',
    'resources',
    'syllabus',
    'tests',
    'skills',
    'question-generation',
    'exam-correction',
    'mentor',
    'smart-gadgets',
    'pasco',
    'ai-learning',
    'ai-lesson-plan',
    'test-page'
  ];

  for (const page of specificPages) {
    if (pathname.includes(`/${page}`) || pathname.endsWith(page)) {
      console.log('✅ Found specific page:', page);
      return PAGE_VOICE_MESSAGES[page];
    }
  }

  // PRIORITY 4: Check for main section pages (least specific)
  if (pathname.includes('/academic-achiever') && !pathname.includes('/dashboard')) {
    // Default to advanced-analytics for academic achiever overview page
    console.log('✅ Academic Achiever overview page, using advanced-analytics audio');
    return PAGE_VOICE_MESSAGES['advanced-analytics'];
  }

  if (pathname.includes('/social-learner') && !pathname.includes('/dashboard')) {
    // Default to dashboard for social learner overview
    console.log('✅ Social Learner overview page, using dashboard audio');
    return PAGE_VOICE_MESSAGES['dashboard'];
  }

  // PRIORITY 4: Only return dashboard for actual dashboard pages
  if (pathname.includes('/dashboard') || pathname.endsWith('/student')) {
    console.log('✅ Dashboard page detected');
    return PAGE_VOICE_MESSAGES['dashboard'];
  }

  // Return default message
  console.log('⚠️ No match found, using default message');
  return PAGE_VOICE_MESSAGES['default'];
}
