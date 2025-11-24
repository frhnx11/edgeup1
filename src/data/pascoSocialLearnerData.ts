export interface PASCOAttribute {
  label: string;
  value: string | number;
  score?: number;
  description?: string;
}

export interface PASCOCategory {
  name: string;
  score: number;
  color: string;
  attributes: PASCOAttribute[];
}

export interface PASCOHistoryEntry {
  date: string;
  overallScore: number;
  categoryScores: {
    personality: number;
    aptitude: number;
    skills: number;
    character: number;
  };
}

export interface PASCOTimelineActivity {
  id: string;
  date: string;
  type: 'achievement' | 'session' | 'milestone' | 'collaboration';
  title: string;
  description: string;
  participants?: string[];
  icon: string;
}

export const socialLearnerPASCO = {
  // Overall PASCO Score
  overallScore: 78,
  personalityType: 'Social Learner',
  tagline: 'Thrives in collaborative learning environments',

  // Quick Stats for Header
  quickStats: [
    {
      label: 'Learning Style',
      value: 'Auditory',
      icon: 'ear',
      color: 'from-orange-500 to-amber-500'
    },
    {
      label: 'Social Energy',
      value: 'Extroverted',
      icon: 'users',
      color: 'from-pink-500 to-rose-500'
    },
    {
      label: 'Study Preference',
      value: 'Large Group (4+)',
      icon: 'user-group',
      color: 'from-purple-500 to-violet-500'
    },
    {
      label: 'Motivation',
      value: 'Peer Recognition',
      icon: 'trophy',
      color: 'from-amber-500 to-yellow-500'
    }
  ],

  // Main Categories
  categories: [
    {
      name: 'Personality',
      score: 82,
      color: 'purple',
      attributes: [
        { label: 'Learning Preference', value: 'Auditory', score: 90 },
        { label: 'Social Energy', value: 'Extroverted', score: 85 },
        { label: 'Study Preference', value: 'Large Group (4+)', score: 88 },
        { label: 'Chatbot Tone', value: 'Casual (Friendly)', score: 80 },
        { label: 'Motivation Triggers', value: 'Social (Peer recognition)', score: 75 }
      ]
    },
    {
      name: 'Aptitude',
      score: 70,
      color: 'blue',
      attributes: [
        { label: 'Logical Thinking', value: 'Proficient', score: 75 },
        { label: 'Spatial-Visual Intelligence', value: 'Medium', score: 60 },
        { label: 'Verbal Capabilities', value: 'Average', score: 65 },
        { label: 'Mathematical Reasoning', value: 'Intermediate', score: 70 },
        { label: 'Creative Problem-Solving', value: 'Conventional', score: 65 }
      ]
    },
    {
      name: 'Skills',
      score: 78,
      color: 'green',
      attributes: [
        { label: 'Current Knowledge Level', value: 'At Grade Level', score: 100 },
        { label: 'Technical Competencies', value: 'Intermediate', score: 70 },
        { label: 'Learning Velocity', value: 'Steady Pace', score: 75 },
        { label: 'Communication Skills', value: 'Articulate', score: 85 }
      ]
    },
    {
      name: 'Character',
      score: 68,
      color: 'amber',
      attributes: [
        { label: 'Growth Mindset', value: 'Developing (Open to growth)', score: 60 },
        { label: 'Resilience Level', value: 'Moderate (Normal recovery)', score: 65 },
        { label: 'Persistence', value: 'Moderately Persistent', score: 70 },
        { label: 'Focus Pattern', value: 'Interval Focus (Breaks needed)', score: 68 },
        { label: 'Goal Orientation', value: 'Short-term Focused', score: 75 }
      ]
    }
  ],

  // Profile Summary
  profileSummary: {
    description: `The Social Learner thrives in collaborative environments where learning becomes a shared social experience. As an auditory learner with strong communication skills, they excel in discussion-based learning and verbal exchanges. They're extroverted and naturally articulate, making them the life of study groups and collaborative sessions.

Their social motivation means peer recognition and group achievement drive their efforts. They prefer casual, friendly communication that feels like conversations with friends rather than formal instruction. With moderate abilities across all areas, they represent the balanced, well-rounded student who succeeds through consistent effort and peer support.

Their interval focus pattern and short-term goal orientation mean they work best with regular breaks and achievable milestones. Moderately persistent with developing growth mindset, they benefit from group accountability and social reinforcement to maintain motivation and handle challenges.`,

    strengths: [
      'Team Player',
      'Great Communicator',
      'Discussion Leader',
      'Peer Motivator',
      'Collaborative Spirit'
    ],

    recommendations: [
      'Join discussion forums and study groups regularly',
      'Use peer teaching to boost understanding',
      'Schedule group study sessions for difficult topics',
      'Take regular breaks to maintain focus',
      'Set short-term goals with peer accountability'
    ]
  },

  // UI/UX Recommendations
  uiRecommendations: {
    interfaceDesign: 'Social-first interface with prominent friend activity feeds',
    layoutStructure: 'Live group study sessions on homepage. Friend leaderboards and team challenges',
    colorScheme: 'Friendly, warm colors with social media aesthetics',
    navigation: 'Social hub as central navigation point',
    features: [
      'Virtual study lounges with voice chat',
      'Friend-based study groups and teams',
      'Social learning feed and activity stream',
      'Group achievement tracking'
    ]
  },

  // Learning Structure
  learningStructure: {
    contentDelivery: 'Discussion-based lessons with group activities',
    sessionFormat: '45-minute group sessions with discussion breaks',
    assessmentStrategy: 'Group quizzes with team scores',
    specialFeatures: [
      'Peer-to-peer teaching opportunities',
      'Collaborative note-taking',
      'Scheduled study parties',
      'Social accountability check-ins'
    ]
  },

  // History Data (Mock test history)
  history: [
    {
      date: '2025-01-15',
      overallScore: 78,
      categoryScores: {
        personality: 82,
        aptitude: 70,
        skills: 78,
        character: 68
      }
    },
    {
      date: '2024-12-01',
      overallScore: 75,
      categoryScores: {
        personality: 80,
        aptitude: 68,
        skills: 75,
        character: 65
      }
    },
    {
      date: '2024-10-15',
      overallScore: 72,
      categoryScores: {
        personality: 78,
        aptitude: 65,
        skills: 73,
        character: 62
      }
    },
    {
      date: '2024-09-01',
      overallScore: 70,
      categoryScores: {
        personality: 75,
        aptitude: 63,
        skills: 70,
        character: 60
      }
    }
  ] as PASCOHistoryEntry[],

  // Performance Analytics
  performance: {
    peerComparison: {
      averageScore: 75,
      yourScore: 78,
      percentile: 68,
      totalStudents: 1250
    },
    studyGroupStats: {
      groupName: 'UPSC Warriors 2025',
      groupSize: 8,
      groupAverageScore: 76,
      collaborationRate: 85,
      weeklyStudySessions: 5
    },
    socialLearningIndex: {
      score: 92,
      forumParticipation: 88,
      peerTeachingRate: 85,
      groupEngagement: 95,
      discussionQuality: 90
    },
    focusPatternAnalysis: {
      bestFocusTime: '10:00 AM - 12:00 PM',
      averageSessionLength: 45,
      breakFrequency: 'Every 45 minutes',
      peakProductivityDays: ['Tuesday', 'Thursday', 'Saturday'],
      heatmapData: [
        { hour: 6, day: 'Mon', value: 20 },
        { hour: 7, day: 'Mon', value: 35 },
        { hour: 8, day: 'Mon', value: 50 },
        { hour: 9, day: 'Mon', value: 70 },
        { hour: 10, day: 'Mon', value: 90 },
        { hour: 11, day: 'Mon', value: 95 },
        { hour: 12, day: 'Mon', value: 85 },
        { hour: 13, day: 'Mon', value: 60 },
        { hour: 14, day: 'Mon', value: 40 },
        { hour: 15, day: 'Mon', value: 55 },
        { hour: 16, day: 'Mon', value: 75 },
        { hour: 17, day: 'Mon', value: 80 },
        { hour: 18, day: 'Mon', value: 70 },
        { hour: 19, day: 'Mon', value: 50 },
        { hour: 20, day: 'Mon', value: 30 },
        // Similar patterns for other days...
      ]
    }
  },

  // Timeline Activities
  timeline: [
    {
      id: '1',
      date: '2025-01-21',
      type: 'achievement',
      title: 'Earned "Team Player" Badge',
      description: 'Participated in 10 consecutive group study sessions',
      icon: 'trophy',
      participants: []
    },
    {
      id: '2',
      date: '2025-01-20',
      type: 'session',
      title: 'Completed Polity Chapter with Study Group',
      description: 'Discussed Constitutional Amendments with 6 peers',
      icon: 'users',
      participants: ['Priya S.', 'Rahul V.', 'Anita K.', 'Vikram P.', 'Neha M.', 'Arjun T.']
    },
    {
      id: '3',
      date: '2025-01-19',
      type: 'collaboration',
      title: 'Helped 3 Peers Understand Physics Concept',
      description: 'Led peer teaching session on Thermodynamics',
      icon: 'message-circle',
      participants: ['Raj K.', 'Sita M.', 'Kumar S.']
    },
    {
      id: '4',
      date: '2025-01-18',
      type: 'milestone',
      title: 'Completed 5 Group Study Sessions This Week',
      description: 'Maintained consistent group learning schedule',
      icon: 'calendar',
      participants: []
    },
    {
      id: '5',
      date: '2025-01-17',
      type: 'achievement',
      title: 'Top Contributor in Discussion Forum',
      description: 'Posted 15 helpful responses in Economics forum',
      icon: 'message-square',
      participants: []
    },
    {
      id: '6',
      date: '2025-01-15',
      type: 'session',
      title: 'Group Quiz Competition',
      description: 'Team scored 85% in Current Affairs quiz',
      icon: 'trophy',
      participants: ['UPSC Warriors 2025 Team']
    },
    {
      id: '7',
      date: '2025-01-14',
      type: 'collaboration',
      title: 'Created Collaborative Study Notes',
      description: 'Co-authored detailed notes on Modern History with study group',
      icon: 'file-text',
      participants: ['Study Group Members']
    },
    {
      id: '8',
      date: '2025-01-12',
      type: 'milestone',
      title: '50 Days Study Streak with Group',
      description: 'Maintained consistent daily group sessions',
      icon: 'award',
      participants: []
    }
  ] as PASCOTimelineActivity[],

  // Upcoming Milestones
  upcomingMilestones: [
    {
      date: '2025-01-25',
      title: 'Group Mock Test',
      description: 'Full-length prelims mock with study group',
      type: 'test'
    },
    {
      date: '2025-01-28',
      title: 'Peer Review Session',
      description: 'Review each other\'s answer writing',
      type: 'collaboration'
    },
    {
      date: '2025-02-01',
      title: 'Team Challenge Deadline',
      description: 'Complete Geography module as a team',
      type: 'challenge'
    },
    {
      date: '2025-02-05',
      title: 'Study Group Meetup',
      description: 'Monthly in-person group study session',
      type: 'event'
    }
  ]
};
