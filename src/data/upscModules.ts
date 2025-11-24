import { 
  Scale,
  Wallet,
  Globe2,
  Landmark
} from 'lucide-react';

export interface LearningModule {
  id: string;
  title: string;
  subject: string;
  icon: any;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completion: number;
  resources: {
    type: 'video' | 'document' | 'quiz' | 'interactive' | 'audio' | 'practice';
    title: string;
    duration: string;
    format?: string;
  }[];
  aiInsights: string[];
  topics: string[];
  learningPath: {
    stage: string;
    activities: string[];
  }[];
  prerequisites?: string[];
  keyTerms?: string[];
}

export const upscModules: LearningModule[] = [
  {
    id: 'polity-1',
    title: 'Indian Constitution & Political System',
    subject: 'Indian Polity',
    icon: Scale,
    description: 'Comprehensive study of Indian Constitution, federal structure, and governance',
    duration: '40 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Constitutional Framework Masterclass', duration: '2 hours' },
      { type: 'interactive', title: 'Federal Structure Simulation', duration: '1.5 hours' },
      { type: 'document', title: 'Supreme Court Case Studies', duration: '3 hours' },
      { type: 'quiz', title: 'Constitution MCQ Challenge', duration: '1 hour' },
      { type: 'practice', title: 'Previous Year Questions', duration: '2 hours' }
    ],
    aiInsights: [
      'Strong visual learning potential detected',
      'Recommended focus on case study approach',
      'Optimal revision cycle: Every 4 days',
      'Peak learning time: Early morning'
    ],
    topics: [
      'Preamble & Basic Structure',
      'Fundamental Rights & Duties',
      'Directive Principles',
      'Federal Structure',
      'Union & State Legislature',
      'Executive & Judiciary',
      'Constitutional Bodies'
    ],
    learningPath: [
      {
        stage: 'Foundation',
        activities: [
          'Watch overview lectures',
          'Read NCERT material',
          'Basic concept mapping'
        ]
      },
      {
        stage: 'Deep Dive',
        activities: [
          'Case study analysis',
          'Constitutional amendments study',
          'Current affairs integration'
        ]
      },
      {
        stage: 'Mastery',
        activities: [
          'Mock tests',
          'Answer writing practice',
          'Peer discussions'
        ]
      }
    ]
  },
  {
    id: 'economy-1',
    title: 'Indian Economy & Development',
    subject: 'Economics',
    icon: Wallet,
    description: 'Analysis of Indian economic system, policies, and development',
    duration: '35 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Economic Survey Analysis', duration: '3 hours' },
      { type: 'document', title: 'Policy Framework Study', duration: '2 hours' },
      { type: 'interactive', title: 'Budget Analysis Tool', duration: '1.5 hours' },
      { type: 'practice', title: 'Economic Data Interpretation', duration: '2 hours' },
      { type: 'audio', title: 'Expert Lectures Series', duration: '4 hours' }
    ],
    aiInsights: [
      'High analytical capability detected',
      'Focus on data interpretation needed',
      'Recommended practice with real economic data',
      'Integrate current economic news daily'
    ],
    topics: [
      'Economic Planning & Models',
      'Fiscal & Monetary Policy',
      'Banking System & Financial Markets',
      'Agriculture & Food Security',
      'Industrial Policy & Growth',
      'External Sector',
      'Poverty & Unemployment'
    ],
    learningPath: [
      {
        stage: 'Concepts',
        activities: [
          'Basic economic principles',
          'Indian economic features',
          'Policy framework understanding'
        ]
      },
      {
        stage: 'Application',
        activities: [
          'Case study analysis',
          'Data interpretation practice',
          'Current economic issues'
        ]
      },
      {
        stage: 'Advanced',
        activities: [
          'Economic survey analysis',
          'Budget document study',
          'Policy impact assessment'
        ]
      }
    ]
  },
  {
    id: 'geography-1',
    title: 'Indian & World Geography',
    subject: 'Geography',
    icon: Globe2,
    description: 'Physical, economic, and social geography of India and the World',
    duration: '30 hours',
    difficulty: 'Intermediate',
    completion: 0,
    resources: [
      { type: 'interactive', title: '3D Terrain Mapping', duration: '2 hours' },
      { type: 'video', title: 'Climate Patterns', duration: '2.5 hours' },
      { type: 'document', title: 'Resource Distribution', duration: '2 hours' },
      { type: 'quiz', title: 'Geography Challenge', duration: '1 hour' },
      { type: 'practice', title: 'Map-based Questions', duration: '2 hours' }
    ],
    aiInsights: [
      'Strong spatial intelligence detected',
      'Visual learning approach recommended',
      'Focus on map-based learning',
      'Regular revision with visual aids'
    ],
    topics: [
      'Physical Geography of India',
      'Climate & Natural Resources',
      'Economic Geography',
      'Population & Settlements',
      'Environmental Geography',
      'World Geography',
      'Geopolitics'
    ],
    learningPath: [
      {
        stage: 'Basic Mapping',
        activities: [
          'Physical features identification',
          'Climate pattern study',
          'Resource mapping'
        ]
      },
      {
        stage: 'Advanced Analysis',
        activities: [
          'Geographical phenomenon study',
          'Economic geography integration',
          'Environmental impact analysis'
        ]
      },
      {
        stage: 'Practical Application',
        activities: [
          'Map-based questions practice',
          'Case studies of regions',
          'Current geographical issues'
        ]
      }
    ]
  },
  {
    id: 'history-1',
    title: 'Indian History & Culture',
    subject: 'History',
    icon: Landmark,
    description: 'Comprehensive study of Indian history from ancient to modern times',
    duration: '45 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Timeline Masterclass', duration: '3 hours' },
      { type: 'interactive', title: 'Historical Events Simulation', duration: '2 hours' },
      { type: 'document', title: 'Art & Culture Guide', duration: '2.5 hours' },
      { type: 'quiz', title: 'History Challenge', duration: '1.5 hours' },
      { type: 'audio', title: 'Historical Narratives', duration: '3 hours' }
    ],
    aiInsights: [
      'Strong chronological learning pattern',
      'Focus on cause-effect relationships',
      'Interactive timeline approach recommended',
      'Regular theme-based revision needed'
    ],
    topics: [
      'Ancient India',
      'Medieval India',
      'Modern India',
      'Indian National Movement',
      'Post-Independence India',
      'Art & Culture',
      'World History'
    ],
    learningPath: [
      {
        stage: 'Chronological Understanding',
        activities: [
          'Timeline creation',
          'Period-wise study',
          'Source analysis'
        ]
      },
      {
        stage: 'Thematic Study',
        activities: [
          'Movement analysis',
          'Cultural evolution study',
          'Historical interpretation'
        ]
      },
      {
        stage: 'Advanced Integration',
        activities: [
          'Cross-cultural analysis',
          'Contemporary relevance',
          'Historical debates'
        ]
      }
    ]
  }
];