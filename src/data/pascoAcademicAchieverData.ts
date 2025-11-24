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

export interface PASCOPerformance {
  peerComparison: {
    yourScore: number;
    averageScore: number;
    percentile: number;
    totalStudents: number;
  };
  studyGroupStats: {
    groupName: string;
    groupSize: number;
    groupAverageScore: number;
    collaborationRate: number;
    weeklyStudySessions: number;
  };
  academicIndex: {
    score: number;
    focusQuality: number;
    challengeCompletion: number;
    performanceConsistency: number;
    competitiveRanking: number;
  };
}

export interface PASCOTimelineActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'achievement' | 'session' | 'collaboration' | 'milestone';
  icon: string;
  participants?: string[];
}

export interface PASCOUpcomingMilestone {
  title: string;
  description: string;
  date: string;
}

export interface PASCOProfileSummary {
  description: string;
  strengths: string[];
  recommendations: string[];
}

export interface PASCOData {
  personalityType: string;
  tagline: string;
  overallScore: number;
  quickStats: {
    learningPreference: string;
    socialEnergy: string;
    studyPreference: string;
    motivation: string;
  };
  categories: PASCOCategory[];
  profileSummary: PASCOProfileSummary;
  history: PASCOHistoryEntry[];
  performance: PASCOPerformance;
  timeline: PASCOTimelineActivity[];
  upcomingMilestones: PASCOUpcomingMilestone[];
}

export const academicAchieverPASCO: PASCOData = {
  personalityType: 'Academic Achiever',
  tagline: 'High-performing student who thrives on challenges and competition',
  overallScore: 88,
  quickStats: {
    learningPreference: 'Visual',
    socialEnergy: 'Extroverted',
    studyPreference: 'Small Group (2-3)',
    motivation: 'Achievement (Grades/Ranks)'
  },
  categories: [
    {
      name: 'Personality',
      score: 85,
      color: 'purple',
      attributes: [
        { label: 'Learning Preference', value: 'Visual', score: 90 },
        { label: 'Social Energy', value: 'Extroverted', score: 85 },
        { label: 'Study Preference', value: 'Small Group (2-3)', score: 80 },
        { label: 'Conversation Tone', value: 'Formal', score: 88 },
        { label: 'Motivation', value: 'Achievement', score: 95 }
      ]
    },
    {
      name: 'Aptitude',
      score: 92,
      color: 'blue',
      attributes: [
        { label: 'Logical Thinking', value: 'Advanced', score: 95 },
        { label: 'Spatial-Visual Intelligence', value: 'High', score: 88 },
        { label: 'Verbal Capabilities', value: 'Strong', score: 90 },
        { label: 'Mathematical Reasoning', value: 'Advanced', score: 94 },
        { label: 'Creative Problem-Solving', value: 'Conventional', score: 85 }
      ]
    },
    {
      name: 'Skills',
      score: 90,
      color: 'green',
      attributes: [
        { label: 'Knowledge Level', value: 'Above Grade Level', score: 92 },
        { label: 'Technical Competencies', value: 'Advanced', score: 90 },
        { label: 'Learning Velocity', value: 'Fast Learner', score: 88 },
        { label: 'Communication Skills', value: 'Articulate', score: 90 }
      ]
    },
    {
      name: 'Character',
      score: 87,
      color: 'amber',
      attributes: [
        { label: 'Growth Mindset', value: 'Strong', score: 90 },
        { label: 'Resilience Level', value: 'High', score: 88 },
        { label: 'Persistence', value: 'Highly Persistent', score: 92 },
        { label: 'Focus Pattern', value: 'Deep Focus', score: 85 },
        { label: 'Goal Orientation', value: 'Long-term Focused', score: 90 }
      ]
    }
  ],
  profileSummary: {
    description: `The Academic Achiever is a high-performing student who thrives on challenges and competition. With advanced logical thinking and strong verbal capabilities, they excel in traditional academic settings. They are extroverted yet prefer small group studies where they can engage in meaningful discussions without distractions.

Their achievement-driven motivation combined with high persistence and deep focus abilities makes them natural leaders in academic pursuits. They appreciate structure, formal communication, and data-driven feedback. They set long-term goals and work systematically toward them, often exceeding expectations.

Visual learners by nature, they benefit from charts, diagrams, and well-organized content. Their conventional problem-solving approach means they excel with proven methods and established strategies rather than experimental techniques.`,
    strengths: [
      'Advanced Logical Thinking',
      'High Academic Performance',
      'Deep Focus Abilities',
      'Goal-Oriented Mindset',
      'Strong Persistence',
      'Fast Learning Velocity'
    ],
    recommendations: [
      'Utilize visual learning materials like charts, diagrams, and infographics for better retention',
      'Join small study groups (2-3 people) for focused academic discussions',
      'Set challenging long-term goals with measurable milestones',
      'Participate in academic competitions to leverage competitive motivation',
      'Schedule 90-minute deep focus study sessions with minimal breaks',
      'Track performance metrics and rankings to maintain motivation'
    ]
  },
  history: [
    {
      date: '2025-01-15',
      overallScore: 88,
      categoryScores: {
        personality: 85,
        aptitude: 92,
        skills: 90,
        character: 87
      }
    },
    {
      date: '2024-12-15',
      overallScore: 85,
      categoryScores: {
        personality: 83,
        aptitude: 90,
        skills: 87,
        character: 85
      }
    },
    {
      date: '2024-11-15',
      overallScore: 82,
      categoryScores: {
        personality: 80,
        aptitude: 88,
        skills: 85,
        character: 82
      }
    },
    {
      date: '2024-10-15',
      overallScore: 80,
      categoryScores: {
        personality: 78,
        aptitude: 85,
        skills: 82,
        character: 80
      }
    }
  ],
  performance: {
    peerComparison: {
      yourScore: 88,
      averageScore: 72,
      percentile: 95,
      totalStudents: 15420
    },
    studyGroupStats: {
      groupName: 'Excellence Achievers',
      groupSize: 3,
      groupAverageScore: 86,
      collaborationRate: 88,
      weeklyStudySessions: 5
    },
    academicIndex: {
      score: 90,
      focusQuality: 92,
      challengeCompletion: 88,
      performanceConsistency: 90,
      competitiveRanking: 95
    }
  },
  timeline: [
    {
      id: '1',
      title: 'Top Rank Achievement',
      description: 'Secured 1st rank in the Advanced Mathematics Mock Test with 98% score',
      date: '2025-01-18',
      type: 'achievement',
      icon: 'trophy'
    },
    {
      id: '2',
      title: 'Study Group Session',
      description: 'Completed intensive Constitutional Law revision with study group',
      date: '2025-01-16',
      type: 'session',
      icon: 'users',
      participants: ['Priya Sharma', 'Rahul Verma']
    },
    {
      id: '3',
      title: 'Challenge Mode Completed',
      description: 'Successfully completed Expert Level Indian Polity challenge questions',
      date: '2025-01-14',
      type: 'achievement',
      icon: 'award'
    },
    {
      id: '4',
      title: 'Academic Milestone',
      description: 'Completed 1000 hours of focused study time this year',
      date: '2025-01-12',
      type: 'milestone',
      icon: 'calendar'
    },
    {
      id: '5',
      title: 'Mock Test Excellence',
      description: 'Scored in 98th percentile on All India Mock Test Series',
      date: '2025-01-10',
      type: 'achievement',
      icon: 'trophy'
    },
    {
      id: '6',
      title: 'Peer Discussion',
      description: 'Led group discussion on Current Affairs and Analysis',
      date: '2025-01-08',
      type: 'collaboration',
      icon: 'message-circle',
      participants: ['Anjali Gupta', 'Vikram Singh']
    },
    {
      id: '7',
      title: 'Performance Record',
      description: 'Maintained 90+ average for 6 consecutive weeks',
      date: '2025-01-05',
      type: 'milestone',
      icon: 'calendar'
    },
    {
      id: '8',
      title: 'Advanced Module Unlocked',
      description: 'Unlocked expert-level International Relations content',
      date: '2025-01-03',
      type: 'achievement',
      icon: 'award'
    }
  ],
  upcomingMilestones: [
    {
      title: 'Prelims Mock Test Series',
      description: 'All India Prelims Mock Test - Final Round',
      date: '2025-01-25'
    },
    {
      title: 'Advanced Analytics Review',
      description: 'Quarterly performance analysis and goal setting session',
      date: '2025-01-30'
    },
    {
      title: 'Challenge Competition',
      description: 'National Level Academic Challenge Competition',
      date: '2025-02-05'
    },
    {
      title: 'Study Group Leadership',
      description: 'Lead peer study session on Essay Writing strategies',
      date: '2025-02-10'
    }
  ]
};
