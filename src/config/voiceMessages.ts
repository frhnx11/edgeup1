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
    text: 'Welcome to the Leaderboard! See your rank among top performers, track your progress, and compete with the best minds preparing for UPSC!'
  },
  'readiness-score': {
    key: 'readiness-score',
    text: 'Your Exam Readiness Dashboard! Get AI-powered analysis of your preparation level, identify weak areas, and receive personalized recommendations to boost your score!'
  },
  'test-analytics': {
    key: 'test-analytics',
    text: 'Deep dive into Mock Test Analytics! Analyze your performance patterns, question-wise breakdown, time management insights, and compare with toppers to refine your strategy!'
  },
  'quizzes': {
    key: 'quizzes',
    text: 'Smart Quizzes await! Practice with adaptive quizzes tailored to your learning pace, covering all UPSC topics with instant feedback and detailed explanations!'
  },

  // Study Pages
  'calendar': {
    key: 'calendar',
    text: 'Your Study Calendar! Plan your preparation with scheduled classes, assignments, and study sessions. Stay organized and never miss important deadlines!'
  },
  'classes': {
    key: 'classes',
    text: 'Welcome to Classes! Join live interactive sessions with expert faculty, access recorded lectures, download notes, and participate in doubt-clearing discussions!'
  },
  'performance': {
    key: 'performance',
    text: 'Your Performance Dashboard! Comprehensive analysis of your test scores, subject-wise strengths and weaknesses, progress trends, and detailed improvement recommendations!'
  },
  'tasks': {
    key: 'tasks',
    text: 'Task Management Hub! Track all your assignments, practice problems, revision tasks, and essay submissions. Stay on top of your preparation with smart prioritization!'
  },
  'resources': {
    key: 'resources',
    text: 'Study Resources Library! Access curated UPSC materials including NCERT notes, current affairs compilations, previous year papers, video lectures, and expert-recommended study guides!'
  },
  'syllabus': {
    key: 'syllabus',
    text: 'Syllabus Tracker! Monitor your coverage across all UPSC subjects, track topic-wise completion, identify gaps, and get AI-powered suggestions for optimal coverage!'
  },
  'tests': {
    key: 'tests',
    text: 'Test Suite! Challenge yourself with topic tests, sectional tests, full-length mock exams, and previous year papers. Get instant evaluation with detailed analytics!'
  },

  // Development Pages
  'skills': {
    key: 'skills',
    text: 'Skills Development Center! Enhance your critical thinking, analytical reasoning, time management, and answer writing skills with structured practice modules and expert guidance!'
  },
  'question-generation': {
    key: 'question-generation',
    text: 'AI Question Generator! Create unlimited custom practice papers by selecting topics, difficulty levels, and question patterns. Get UPSC-style questions tailored to your preparation needs!'
  },
  'exam-correction': {
    key: 'exam-correction',
    text: 'Intelligent Exam Correction! Upload your answer sheets and get AI-powered evaluation with detailed feedback, scoring insights, and specific suggestions to improve your writing quality!'
  },

  // Personal Pages
  'mentor': {
    key: 'mentor',
    text: 'Your Personal Mentor! Connect with experienced UPSC mentors for one-on-one guidance, strategy sessions, answer writing reviews, and motivational support throughout your journey!'
  },
  'smart-gadgets': {
    key: 'smart-gadgets',
    text: 'Smart Gadgets Integration! Connect fitness trackers, sleep monitors, and study tools to optimize your preparation. Track study hours, health metrics, and get AI-powered wellness recommendations!'
  },
  'pasco': {
    key: 'pasco',
    text: 'PASCO Skills Assessment! Comprehensive evaluation of your Problem-solving, Analytical reasoning, Spatial intelligence, Conceptual understanding, and Overall readiness for UPSC Civil Services!'
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
