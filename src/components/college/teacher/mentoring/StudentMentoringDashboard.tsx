import { useState, useRef, useEffect } from 'react';

type MainTab = 'dashboard' | 'my-mentees' | 'meetings' | 'improvement-plans' | 'communication' | 'parent-interactions' | 'career-development';

interface Mentee {
  id: string;
  name: string;
  studentId: string;
  photo: string;
  program: string;
  year: number;
  cgpa: number;
  attendance: number;
  behaviorScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastInteraction: string;
  email: string;
  phone: string;
}

interface Meeting {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  type: 'Regular Check-in' | 'Performance Review' | 'Crisis Intervention' | 'Career Counseling' | 'Parent-Teacher-Student';
  mode: 'In-person' | 'Online';
  agenda: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

interface ImprovementPlan {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  focusAreas: string[];
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Active' | 'On Track' | 'Delayed' | 'Completed';
  goals: {
    description: string;
    progress: number;
    actionItems: string[];
  }[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'sent' | 'received';
}

interface ParentInteraction {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  date: string;
  type: 'Meeting' | 'Call' | 'Email' | 'Message';
  mode: string;
  summary: string;
  followUpRequired: boolean;
}

interface CareerPath {
  id: string;
  title: string;
  matchPercentage: number;
  requiredSkills: string[];
  recommendedCourses: string[];
  industryOutlook: string;
  sampleRoles: string[];
}

interface EngagementAnalytics {
  menteeId: string;
  overallScore: number;
  participationMetrics: {
    polls: number;
    quizzes: number;
    qa: number;
    discussions: number;
    trend: { date: string; score: number }[];
  };
  learningPatterns: {
    peakTime: string;
    preferredType: string;
    avgDuration: number;
    studyHeatmap: { day: number; hour: number; intensity: number }[];
    topicEngagement: { topic: string; level: number }[];
  };
  attentionTracking: {
    avgSpan: number;
    lectures: {
      name: string;
      date: string;
      timeline: { minute: number; level: number }[];
    }[];
    contentEffectiveness: {
      title: string;
      type: string;
      engagementScore: number;
      attentionScore: number;
    }[];
  };
  dropoutRisk: {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    factors: { name: string; impact: number; status: 'Critical' | 'Warning' | 'Normal' }[];
    trend: { month: string; score: number }[];
    recommendations: string[];
  };
}

const StudentMentoringDashboard = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [selectedAnalyticsMentee, setSelectedAnalyticsMentee] = useState<string>('m1');
  const [planView, setPlanView] = useState<'list' | 'select-student' | 'create-plan'>('list');
  const [selectedStudentForPlan, setSelectedStudentForPlan] = useState<Mentee | null>(null);
  const [newPlanData, setNewPlanData] = useState({
    title: '',
    focusAreas: [] as string[],
    startDate: '',
    endDate: '',
    goals: [{ description: '', actionItems: [''] }]
  });

  // Parent Interaction states
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showLogInteractionModal, setShowLogInteractionModal] = useState(false);
  const [selectedParentContact, setSelectedParentContact] = useState<ParentInteraction | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'in-call'>('dialing');
  const [smsMessage, setSmsMessage] = useState('');
  const [newInteractionData, setNewInteractionData] = useState({
    studentId: '',
    parentName: '',
    type: 'Call' as 'Meeting' | 'Call' | 'Email' | 'Message',
    mode: '',
    summary: '',
    followUpRequired: false
  });
  const [newMeetingData, setNewMeetingData] = useState({
    type: 'In-person',
    date: '',
    time: '',
    agenda: '',
    location: ''
  });

  // Career & Development states
  const [careerView, setCareerView] = useState<'select-student' | 'show-predictions'>('select-student');
  const [selectedCareerStudent, setSelectedCareerStudent] = useState<Mentee | null>(null);

  // Call modal timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCallModal && callStatus === 'in-call') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCallModal, callStatus]);

  // Mock Data
  const mentees: Mentee[] = [
    {
      id: 'm1',
      name: 'Aravind Kumar',
      studentId: 'CS21001',
      photo: '',
      program: 'B.Tech Computer Science',
      year: 3,
      cgpa: 6.8,
      attendance: 72,
      behaviorScore: 75,
      riskLevel: 'High',
      lastInteraction: '2025-11-15',
      email: 'aravind@college.edu',
      phone: '+91 98765 43210'
    },
    {
      id: 'm2',
      name: 'Priya Sharma',
      studentId: 'CS21002',
      photo: '',
      program: 'B.Tech Computer Science',
      year: 3,
      cgpa: 8.5,
      attendance: 92,
      behaviorScore: 90,
      riskLevel: 'Low',
      lastInteraction: '2025-11-18',
      email: 'priya@college.edu',
      phone: '+91 98765 43211'
    },
    {
      id: 'm3',
      name: 'Rahul Mehta',
      studentId: 'CS21003',
      photo: '',
      program: 'B.Tech Computer Science',
      year: 3,
      cgpa: 7.2,
      attendance: 68,
      behaviorScore: 70,
      riskLevel: 'Medium',
      lastInteraction: '2025-11-10',
      email: 'rahul@college.edu',
      phone: '+91 98765 43212'
    },
    {
      id: 'm4',
      name: 'Sneha Patel',
      studentId: 'CS21004',
      photo: '',
      program: 'B.Tech Computer Science',
      year: 3,
      cgpa: 9.1,
      attendance: 95,
      behaviorScore: 95,
      riskLevel: 'Low',
      lastInteraction: '2025-11-19',
      email: 'sneha@college.edu',
      phone: '+91 98765 43213'
    }
  ];

  const meetings: Meeting[] = [
    {
      id: 'meet1',
      studentId: 'm1',
      studentName: 'Aravind Kumar',
      date: '2025-11-25',
      time: '10:00',
      type: 'Performance Review',
      mode: 'In-person',
      agenda: 'Discuss declining grades and attendance issues',
      status: 'Scheduled'
    },
    {
      id: 'meet2',
      studentId: 'm3',
      studentName: 'Rahul Mehta',
      date: '2025-11-26',
      time: '14:00',
      type: 'Career Counseling',
      mode: 'Online',
      agenda: 'Explore internship opportunities and skill development',
      status: 'Scheduled'
    }
  ];

  const improvementPlans: ImprovementPlan[] = [
    {
      id: 'plan1',
      studentId: 'm1',
      studentName: 'Aravind Kumar',
      title: 'Academic Recovery Plan',
      focusAreas: ['Academic', 'Attendance'],
      startDate: '2025-11-01',
      endDate: '2025-12-31',
      progress: 35,
      status: 'Active',
      goals: [
        {
          description: 'Improve attendance to above 80%',
          progress: 40,
          actionItems: ['Attend all morning classes', 'Submit medical certificates', 'Set daily alarms']
        },
        {
          description: 'Complete all pending assignments',
          progress: 60,
          actionItems: ['Finish DS assignment', 'Submit OS lab report', 'Complete DBMS project']
        },
        {
          description: 'Achieve minimum 7.0 CGPA this semester',
          progress: 20,
          actionItems: ['Regular study schedule', 'Attend doubt sessions', 'Form study group']
        }
      ]
    }
  ];

  const parentInteractions: ParentInteraction[] = [
    {
      id: 'pi1',
      studentId: 'm1',
      studentName: 'Aravind Kumar',
      parentName: 'Mr. Kumar',
      date: '2025-11-10',
      type: 'Call',
      mode: 'Phone',
      summary: 'Discussed concerns about declining attendance and grades. Parent committed to monitoring study hours at home.',
      followUpRequired: true
    },
    {
      id: 'pi2',
      studentId: 'm2',
      studentName: 'Priya Sharma',
      parentName: 'Mrs. Sharma',
      date: '2025-11-12',
      type: 'Meeting',
      mode: 'In-person',
      summary: 'Appreciation meeting for excellent academic performance. Discussed scholarship opportunities.',
      followUpRequired: false
    }
  ];

  const careerPaths: CareerPath[] = [
    {
      id: 'cp1',
      title: 'Full Stack Developer',
      matchPercentage: 92,
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
      recommendedCourses: ['Advanced Web Development', 'Cloud Computing', 'DevOps Fundamentals'],
      industryOutlook: 'High demand, 15% growth expected',
      sampleRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer']
    },
    {
      id: 'cp2',
      title: 'Data Scientist',
      matchPercentage: 85,
      requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
      recommendedCourses: ['Machine Learning', 'Big Data Analytics', 'Statistical Methods'],
      industryOutlook: 'Very high demand, 25% growth expected',
      sampleRoles: ['Data Analyst', 'ML Engineer', 'Data Scientist']
    },
    {
      id: 'cp3',
      title: 'Cloud Solutions Architect',
      matchPercentage: 78,
      requiredSkills: ['AWS/Azure', 'Networking', 'Security', 'Docker', 'Kubernetes'],
      recommendedCourses: ['Cloud Architecture', 'Containerization', 'System Design'],
      industryOutlook: 'High demand, 20% growth expected',
      sampleRoles: ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect']
    }
  ];

  const developmentDimensions = [
    { name: 'Academic', current: 68, target: 85, max: 100 },
    { name: 'Technical', current: 75, target: 85, max: 100 },
    { name: 'Soft Skills', current: 60, target: 80, max: 100 },
    { name: 'Co-curricular', current: 45, target: 70, max: 100 },
    { name: 'Leadership', current: 50, target: 75, max: 100 },
    { name: 'Wellness', current: 70, target: 85, max: 100 }
  ];

  const engagementAnalytics: EngagementAnalytics[] = [
    {
      menteeId: 'm1',
      overallScore: 78,
      participationMetrics: {
        polls: 85,
        quizzes: 72,
        qa: 65,
        discussions: 80,
        trend: [
          { date: '2024-10-20', score: 65 },
          { date: '2024-10-23', score: 70 },
          { date: '2024-10-26', score: 72 },
          { date: '2024-10-29', score: 75 },
          { date: '2024-11-01', score: 76 },
          { date: '2024-11-04', score: 78 },
          { date: '2024-11-07', score: 77 },
          { date: '2024-11-10', score: 80 },
          { date: '2024-11-13', score: 78 },
          { date: '2024-11-16', score: 82 }
        ]
      },
      learningPatterns: {
        peakTime: 'Morning (8-10 AM)',
        preferredType: 'Videos',
        avgDuration: 45,
        studyHeatmap: [
          { day: 0, hour: 8, intensity: 80 }, { day: 0, hour: 9, intensity: 90 },
          { day: 1, hour: 8, intensity: 75 }, { day: 1, hour: 9, intensity: 85 },
          { day: 2, hour: 8, intensity: 70 }, { day: 2, hour: 9, intensity: 80 },
          { day: 3, hour: 8, intensity: 85 }, { day: 3, hour: 9, intensity: 95 },
          { day: 4, hour: 8, intensity: 90 }, { day: 4, hour: 9, intensity: 85 },
          { day: 5, hour: 10, intensity: 60 }, { day: 5, hour: 11, intensity: 55 }
        ],
        topicEngagement: [
          { topic: 'Data Structures', level: 85 },
          { topic: 'Algorithms', level: 78 },
          { topic: 'Database Systems', level: 72 },
          { topic: 'Web Development', level: 90 },
          { topic: 'Machine Learning', level: 68 }
        ]
      },
      attentionTracking: {
        avgSpan: 35,
        lectures: [
          {
            name: 'Data Structures - Trees',
            date: '2024-11-15',
            timeline: [
              { minute: 0, level: 90 }, { minute: 10, level: 85 }, { minute: 20, level: 75 },
              { minute: 30, level: 65 }, { minute: 40, level: 70 }, { minute: 50, level: 80 }
            ]
          },
          {
            name: 'Algorithms - Sorting',
            date: '2024-11-14',
            timeline: [
              { minute: 0, level: 95 }, { minute: 10, level: 90 }, { minute: 20, level: 80 },
              { minute: 30, level: 70 }, { minute: 40, level: 60 }, { minute: 50, level: 65 }
            ]
          }
        ],
        contentEffectiveness: [
          { title: 'Introduction to React', type: 'Video', engagementScore: 92, attentionScore: 88 },
          { title: 'Binary Search Trees', type: 'Slides', engagementScore: 75, attentionScore: 70 },
          { title: 'Database Normalization', type: 'Reading', engagementScore: 68, attentionScore: 65 },
          { title: 'Sorting Algorithms Demo', type: 'Video', engagementScore: 90, attentionScore: 85 },
          { title: 'SQL Queries Practice', type: 'Slides', engagementScore: 72, attentionScore: 68 }
        ]
      },
      dropoutRisk: {
        score: 25,
        level: 'Low',
        factors: [
          { name: 'Attendance Rate', impact: 10, status: 'Normal' },
          { name: 'Academic Performance', impact: 8, status: 'Normal' },
          { name: 'Engagement Level', impact: 5, status: 'Normal' },
          { name: 'Behavioral Issues', impact: 2, status: 'Normal' }
        ],
        trend: [
          { month: 'Jun', score: 30 },
          { month: 'Jul', score: 28 },
          { month: 'Aug', score: 26 },
          { month: 'Sep', score: 24 },
          { month: 'Oct', score: 23 },
          { month: 'Nov', score: 25 }
        ],
        recommendations: [
          'Continue current study patterns - performing well',
          'Maintain consistent attendance and participation',
          'Consider joining advanced projects to stay challenged'
        ]
      }
    },
    {
      menteeId: 'm2',
      overallScore: 52,
      participationMetrics: {
        polls: 45,
        quizzes: 50,
        qa: 38,
        discussions: 55,
        trend: [
          { date: '2024-10-20', score: 60 },
          { date: '2024-10-23', score: 58 },
          { date: '2024-10-26', score: 55 },
          { date: '2024-10-29', score: 52 },
          { date: '2024-11-01', score: 50 },
          { date: '2024-11-04', score: 48 },
          { date: '2024-11-07', score: 50 },
          { date: '2024-11-10', score: 52 },
          { date: '2024-11-13', score: 51 },
          { date: '2024-11-16', score: 53 }
        ]
      },
      learningPatterns: {
        peakTime: 'Evening (6-8 PM)',
        preferredType: 'Readings',
        avgDuration: 30,
        studyHeatmap: [
          { day: 0, hour: 18, intensity: 70 }, { day: 0, hour: 19, intensity: 80 },
          { day: 1, hour: 18, intensity: 65 }, { day: 1, hour: 19, intensity: 75 },
          { day: 2, hour: 18, intensity: 60 }, { day: 2, hour: 19, intensity: 70 },
          { day: 3, hour: 18, intensity: 75 }, { day: 3, hour: 19, intensity: 85 },
          { day: 4, hour: 18, intensity: 70 }, { day: 4, hour: 19, intensity: 75 },
          { day: 5, hour: 20, intensity: 50 }, { day: 5, hour: 21, intensity: 45 }
        ],
        topicEngagement: [
          { topic: 'Data Structures', level: 55 },
          { topic: 'Algorithms', level: 48 },
          { topic: 'Database Systems', level: 62 },
          { topic: 'Web Development', level: 50 },
          { topic: 'Machine Learning', level: 45 }
        ]
      },
      attentionTracking: {
        avgSpan: 25,
        lectures: [
          {
            name: 'Data Structures - Trees',
            date: '2024-11-15',
            timeline: [
              { minute: 0, level: 70 }, { minute: 10, level: 65 }, { minute: 20, level: 55 },
              { minute: 30, level: 45 }, { minute: 40, level: 50 }, { minute: 50, level: 40 }
            ]
          },
          {
            name: 'Algorithms - Sorting',
            date: '2024-11-14',
            timeline: [
              { minute: 0, level: 75 }, { minute: 10, level: 70 }, { minute: 20, level: 60 },
              { minute: 30, level: 50 }, { minute: 40, level: 45 }, { minute: 50, level: 40 }
            ]
          }
        ],
        contentEffectiveness: [
          { title: 'Introduction to React', type: 'Video', engagementScore: 52, attentionScore: 48 },
          { title: 'Binary Search Trees', type: 'Slides', engagementScore: 55, attentionScore: 50 },
          { title: 'Database Normalization', type: 'Reading', engagementScore: 65, attentionScore: 60 },
          { title: 'Sorting Algorithms Demo', type: 'Video', engagementScore: 50, attentionScore: 45 },
          { title: 'SQL Queries Practice', type: 'Slides', engagementScore: 58, attentionScore: 52 }
        ]
      },
      dropoutRisk: {
        score: 68,
        level: 'High',
        factors: [
          { name: 'Attendance Rate', impact: 28, status: 'Warning' },
          { name: 'Academic Performance', impact: 25, status: 'Critical' },
          { name: 'Engagement Level', impact: 10, status: 'Warning' },
          { name: 'Behavioral Issues', impact: 5, status: 'Normal' }
        ],
        trend: [
          { month: 'Jun', score: 55 },
          { month: 'Jul', score: 58 },
          { month: 'Aug', score: 62 },
          { month: 'Sep', score: 65 },
          { month: 'Oct', score: 67 },
          { month: 'Nov', score: 68 }
        ],
        recommendations: [
          'Schedule immediate one-on-one intervention meeting',
          'Review study materials and offer additional tutoring',
          'Connect with peer study group for support',
          'Discuss personal challenges affecting attendance',
          'Set short-term achievable goals to boost motivation'
        ]
      }
    },
    {
      menteeId: 'm3',
      overallScore: 68,
      participationMetrics: {
        polls: 72,
        quizzes: 65,
        qa: 58,
        discussions: 70,
        trend: [
          { date: '2024-10-20', score: 62 },
          { date: '2024-10-23', score: 64 },
          { date: '2024-10-26', score: 66 },
          { date: '2024-10-29', score: 67 },
          { date: '2024-11-01', score: 68 },
          { date: '2024-11-04', score: 69 },
          { date: '2024-11-07', score: 68 },
          { date: '2024-11-10', score: 70 },
          { date: '2024-11-13', score: 69 },
          { date: '2024-11-16', score: 71 }
        ]
      },
      learningPatterns: {
        peakTime: 'Afternoon (2-4 PM)',
        preferredType: 'Slides',
        avgDuration: 40,
        studyHeatmap: [
          { day: 0, hour: 14, intensity: 75 }, { day: 0, hour: 15, intensity: 85 },
          { day: 1, hour: 14, intensity: 70 }, { day: 1, hour: 15, intensity: 80 },
          { day: 2, hour: 14, intensity: 72 }, { day: 2, hour: 15, intensity: 82 },
          { day: 3, hour: 14, intensity: 78 }, { day: 3, hour: 15, intensity: 88 },
          { day: 4, hour: 14, intensity: 75 }, { day: 4, hour: 15, intensity: 80 },
          { day: 5, hour: 16, intensity: 60 }, { day: 5, hour: 17, intensity: 55 }
        ],
        topicEngagement: [
          { topic: 'Data Structures', level: 70 },
          { topic: 'Algorithms', level: 65 },
          { topic: 'Database Systems', level: 75 },
          { topic: 'Web Development', level: 68 },
          { topic: 'Machine Learning', level: 62 }
        ]
      },
      attentionTracking: {
        avgSpan: 30,
        lectures: [
          {
            name: 'Data Structures - Trees',
            date: '2024-11-15',
            timeline: [
              { minute: 0, level: 85 }, { minute: 10, level: 80 }, { minute: 20, level: 70 },
              { minute: 30, level: 60 }, { minute: 40, level: 65 }, { minute: 50, level: 70 }
            ]
          },
          {
            name: 'Algorithms - Sorting',
            date: '2024-11-14',
            timeline: [
              { minute: 0, level: 88 }, { minute: 10, level: 82 }, { minute: 20, level: 72 },
              { minute: 30, level: 65 }, { minute: 40, level: 60 }, { minute: 50, level: 62 }
            ]
          }
        ],
        contentEffectiveness: [
          { title: 'Introduction to React', type: 'Video', engagementScore: 70, attentionScore: 65 },
          { title: 'Binary Search Trees', type: 'Slides', engagementScore: 78, attentionScore: 72 },
          { title: 'Database Normalization', type: 'Reading', engagementScore: 65, attentionScore: 60 },
          { title: 'Sorting Algorithms Demo', type: 'Video', engagementScore: 72, attentionScore: 68 },
          { title: 'SQL Queries Practice', type: 'Slides', engagementScore: 75, attentionScore: 70 }
        ]
      },
      dropoutRisk: {
        score: 42,
        level: 'Medium',
        factors: [
          { name: 'Attendance Rate', impact: 15, status: 'Warning' },
          { name: 'Academic Performance', impact: 12, status: 'Normal' },
          { name: 'Engagement Level', impact: 10, status: 'Normal' },
          { name: 'Behavioral Issues', impact: 5, status: 'Normal' }
        ],
        trend: [
          { month: 'Jun', score: 35 },
          { month: 'Jul', score: 38 },
          { month: 'Aug', score: 40 },
          { month: 'Sep', score: 41 },
          { month: 'Oct', score: 42 },
          { month: 'Nov', score: 42 }
        ],
        recommendations: [
          'Monitor attendance patterns - showing improvement',
          'Encourage consistent participation in class discussions',
          'Provide additional resources for challenging topics',
          'Regular check-ins to maintain positive trajectory'
        ]
      }
    },
    {
      menteeId: 'm4',
      overallScore: 85,
      participationMetrics: {
        polls: 92,
        quizzes: 88,
        qa: 78,
        discussions: 90,
        trend: [
          { date: '2024-10-20', score: 80 },
          { date: '2024-10-23', score: 82 },
          { date: '2024-10-26', score: 83 },
          { date: '2024-10-29', score: 84 },
          { date: '2024-11-01', score: 85 },
          { date: '2024-11-04', score: 86 },
          { date: '2024-11-07', score: 85 },
          { date: '2024-11-10', score: 87 },
          { date: '2024-11-13', score: 86 },
          { date: '2024-11-16', score: 88 }
        ]
      },
      learningPatterns: {
        peakTime: 'Morning (6-8 AM)',
        preferredType: 'Interactive Labs',
        avgDuration: 60,
        studyHeatmap: [
          { day: 0, hour: 6, intensity: 85 }, { day: 0, hour: 7, intensity: 95 },
          { day: 1, hour: 6, intensity: 80 }, { day: 1, hour: 7, intensity: 90 },
          { day: 2, hour: 6, intensity: 82 }, { day: 2, hour: 7, intensity: 92 },
          { day: 3, hour: 6, intensity: 88 }, { day: 3, hour: 7, intensity: 98 },
          { day: 4, hour: 6, intensity: 90 }, { day: 4, hour: 7, intensity: 95 },
          { day: 5, hour: 8, intensity: 75 }, { day: 5, hour: 9, intensity: 70 }
        ],
        topicEngagement: [
          { topic: 'Data Structures', level: 90 },
          { topic: 'Algorithms', level: 88 },
          { topic: 'Database Systems', level: 82 },
          { topic: 'Web Development', level: 95 },
          { topic: 'Machine Learning', level: 85 }
        ]
      },
      attentionTracking: {
        avgSpan: 45,
        lectures: [
          {
            name: 'Data Structures - Trees',
            date: '2024-11-15',
            timeline: [
              { minute: 0, level: 95 }, { minute: 10, level: 92 }, { minute: 20, level: 88 },
              { minute: 30, level: 85 }, { minute: 40, level: 87 }, { minute: 50, level: 90 }
            ]
          },
          {
            name: 'Algorithms - Sorting',
            date: '2024-11-14',
            timeline: [
              { minute: 0, level: 98 }, { minute: 10, level: 95 }, { minute: 20, level: 90 },
              { minute: 30, level: 88 }, { minute: 40, level: 85 }, { minute: 50, level: 87 }
            ]
          }
        ],
        contentEffectiveness: [
          { title: 'Introduction to React', type: 'Video', engagementScore: 95, attentionScore: 92 },
          { title: 'Binary Search Trees', type: 'Slides', engagementScore: 85, attentionScore: 82 },
          { title: 'Database Normalization', type: 'Reading', engagementScore: 80, attentionScore: 78 },
          { title: 'Sorting Algorithms Demo', type: 'Video', engagementScore: 98, attentionScore: 95 },
          { title: 'SQL Queries Practice', type: 'Slides', engagementScore: 88, attentionScore: 85 }
        ]
      },
      dropoutRisk: {
        score: 15,
        level: 'Low',
        factors: [
          { name: 'Attendance Rate', impact: 5, status: 'Normal' },
          { name: 'Academic Performance', impact: 3, status: 'Normal' },
          { name: 'Engagement Level', impact: 5, status: 'Normal' },
          { name: 'Behavioral Issues', impact: 2, status: 'Normal' }
        ],
        trend: [
          { month: 'Jun', score: 18 },
          { month: 'Jul', score: 17 },
          { month: 'Aug', score: 16 },
          { month: 'Sep', score: 15 },
          { month: 'Oct', score: 14 },
          { month: 'Nov', score: 15 }
        ],
        recommendations: [
          'Excellent performance - continue current approach',
          'Consider leadership roles in peer study groups',
          'Explore advanced learning opportunities and projects',
          'Potential candidate for teaching assistant positions'
        ]
      }
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#10ac8b';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'On Track': return '#10ac8b';
      case 'Scheduled': case 'Active': return '#ff9800';
      case 'Cancelled': case 'Delayed': return '#f44336';
      default: return '#666';
    }
  };

  // Career Prediction Algorithm
  const getCareerPredictions = (student: Mentee) => {
    const allCareers = [
      {
        id: 'cs1',
        title: 'Full Stack Developer',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
        recommendedCourses: ['Advanced Web Development', 'Cloud Computing', 'DevOps Fundamentals'],
        industryOutlook: 'High demand, 15% growth expected',
        sampleRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer'],
        academicWeight: 0.3,
        technicalWeight: 0.5,
        interestWeight: 0.2
      },
      {
        id: 'cs2',
        title: 'Data Scientist',
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
        recommendedCourses: ['Machine Learning', 'Big Data Analytics', 'Statistical Methods'],
        industryOutlook: 'Very high demand, 25% growth expected',
        sampleRoles: ['Data Analyst', 'ML Engineer', 'Data Scientist'],
        academicWeight: 0.5,
        technicalWeight: 0.3,
        interestWeight: 0.2
      },
      {
        id: 'cs3',
        title: 'Cloud Solutions Architect',
        requiredSkills: ['AWS/Azure', 'Networking', 'Security', 'Docker', 'Kubernetes'],
        recommendedCourses: ['Cloud Architecture', 'Containerization', 'System Design'],
        industryOutlook: 'High demand, 20% growth expected',
        sampleRoles: ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
        academicWeight: 0.3,
        technicalWeight: 0.4,
        interestWeight: 0.3
      },
      {
        id: 'cs4',
        title: 'Mobile App Developer',
        requiredSkills: ['React Native', 'Flutter', 'iOS/Android', 'API Integration'],
        recommendedCourses: ['Mobile Development', 'UI/UX Design', 'Cross-platform Development'],
        industryOutlook: 'High demand, 18% growth expected',
        sampleRoles: ['Mobile Developer', 'iOS Developer', 'Android Developer'],
        academicWeight: 0.2,
        technicalWeight: 0.6,
        interestWeight: 0.2
      },
      {
        id: 'cs5',
        title: 'AI/ML Engineer',
        requiredSkills: ['Python', 'TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'],
        recommendedCourses: ['Artificial Intelligence', 'Neural Networks', 'Advanced ML'],
        industryOutlook: 'Explosive growth, 35% expected',
        sampleRoles: ['AI Engineer', 'ML Researcher', 'Data Scientist'],
        academicWeight: 0.6,
        technicalWeight: 0.3,
        interestWeight: 0.1
      },
      {
        id: 'cs6',
        title: 'Product Manager (Tech)',
        requiredSkills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis'],
        recommendedCourses: ['Product Management', 'Business Strategy', 'Leadership'],
        industryOutlook: 'Growing demand, 12% expected',
        sampleRoles: ['Product Manager', 'Product Owner', 'Technical PM'],
        academicWeight: 0.3,
        technicalWeight: 0.2,
        interestWeight: 0.5
      }
    ];

    // Calculate match scores
    const careerMatches = allCareers.map(career => {
      // Academic score (based on CGPA)
      const academicScore = (student.cgpa / 10) * 100;

      // Technical score (estimated from CGPA and program)
      const technicalScore = student.cgpa >= 8 ? 85 : student.cgpa >= 7 ? 70 : student.cgpa >= 6 ? 55 : 40;

      // Interest/Behavior score (based on attendance and behavior)
      const interestScore = (student.attendance * 0.6) + (student.behaviorScore * 0.4);

      // Weighted match calculation
      const matchPercentage = Math.round(
        (academicScore * career.academicWeight) +
        (technicalScore * career.technicalWeight) +
        (interestScore * career.interestWeight)
      );

      return {
        ...career,
        matchPercentage,
        explanation: `Based on CGPA: ${student.cgpa}, Attendance: ${student.attendance}%, Technical aptitude, and behavioral patterns.`
      };
    });

    // Sort by match percentage and return top 4
    return careerMatches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4);
  };

  // Get personalized development dimensions for a student
  const getStudentDevelopment = (student: Mentee) => {
    return [
      {
        name: 'Academic',
        current: Math.round((student.cgpa / 10) * 100),
        target: 85,
        max: 100
      },
      {
        name: 'Technical',
        current: student.cgpa >= 8 ? 85 : student.cgpa >= 7 ? 70 : student.cgpa >= 6 ? 60 : 45,
        target: 85,
        max: 100
      },
      {
        name: 'Soft Skills',
        current: student.behaviorScore,
        target: 80,
        max: 100
      },
      {
        name: 'Co-curricular',
        current: student.attendance >= 90 ? 70 : student.attendance >= 75 ? 55 : 40,
        target: 70,
        max: 100
      },
      {
        name: 'Leadership',
        current: student.behaviorScore >= 85 ? 65 : student.behaviorScore >= 70 ? 50 : 35,
        target: 75,
        max: 100
      },
      {
        name: 'Wellness',
        current: student.attendance,
        target: 85,
        max: 100
      }
    ];
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { icon: 'fa-users', label: 'Total Mentees', value: mentees.length, color: '#094d88' },
          { icon: 'fa-exclamation-triangle', label: 'At-Risk Students', value: mentees.filter(m => m.riskLevel === 'High').length, color: '#f44336' },
          { icon: 'fa-calendar-check', label: 'Upcoming Meetings', value: meetings.filter(m => m.status === 'Scheduled').length, color: '#10ac8b' },
          { icon: 'fa-tasks', label: 'Active Plans', value: improvementPlans.filter(p => p.status === 'Active').length, color: '#9c27b0' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color
            }}>
              <i className={`fas ${stat.icon}`} style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Risk Alerts */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px', color: '#f44336' }}></i>
            Students Needing Attention
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mentees.filter(m => m.riskLevel !== 'Low').map((student) => (
              <div key={student.id} style={{
                padding: '16px',
                border: `2px solid ${getRiskColor(student.riskLevel)}30`,
                borderLeft: `4px solid ${getRiskColor(student.riskLevel)}`,
                borderRadius: '8px',
                background: `${getRiskColor(student.riskLevel)}05`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => { setSelectedMentee(student); setActiveTab('my-mentees'); }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#2c3e50' }}>
                    {student.name} ({student.studentId})
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: getRiskColor(student.riskLevel),
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {student.riskLevel} Risk
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  CGPA: {student.cgpa} | Attendance: {student.attendance}%
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  Last interaction: {student.lastInteraction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-history" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: 'fa-calendar-check', text: 'Meeting scheduled with Aravind Kumar', time: '2 hours ago', color: '#094d88' },
              { icon: 'fa-tasks', text: 'Created improvement plan for Rahul Mehta', time: '1 day ago', color: '#9c27b0' },
              { icon: 'fa-phone', text: 'Parent call with Mr. Kumar', time: '2 days ago', color: '#ff9800' },
              { icon: 'fa-comments', text: 'Message from Priya Sharma', time: '3 days ago', color: '#10ac8b' }
            ].map((activity, idx) => (
              <div key={idx} style={{
                padding: '14px',
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `${activity.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.color,
                  flexShrink: 0
                }}>
                  <i className={`fas ${activity.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>{activity.text}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#094d88' }}></i>
          Upcoming Meetings
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {meetings.filter(m => m.status === 'Scheduled').map((meeting) => (
            <div key={meeting.id} style={{
              padding: '18px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#094d88'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
              <div style={{ display: 'flex', justifyContent: 'between', marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50' }}>
                  {meeting.studentName}
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#094d8815',
                  color: '#094d88',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {meeting.type}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                {meeting.date} at {meeting.time}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                {meeting.mode}
              </div>
              <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                {meeting.agenda}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // My Mentees Tab
  const renderMyMentees = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: '24px' }}>
      {/* Mentee List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxHeight: '800px',
        overflow: 'auto'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
          My Mentees ({mentees.length})
        </h3>
        <input
          type="text"
          placeholder="Search mentees..."
          style={{
            width: '100%',
            padding: '10px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mentees.map((mentee) => (
            <div
              key={mentee.id}
              onClick={() => setSelectedMentee(mentee)}
              style={{
                padding: '12px',
                border: selectedMentee?.id === mentee.id ? '2px solid #094d88' : '2px solid #e0e0e0',
                borderRadius: '8px',
                background: selectedMentee?.id === mentee.id ? '#094d8810' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedMentee?.id !== mentee.id) {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMentee?.id !== mentee.id) {
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {mentee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{mentee.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{mentee.studentId}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{mentee.program}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: getRiskColor(mentee.riskLevel),
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {mentee.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Profile */}
      {selectedMentee ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '28px'
            }}>
              {selectedMentee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#2c3e50' }}>{selectedMentee.name}</h2>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                {selectedMentee.studentId} | {selectedMentee.program} - Year {selectedMentee.year}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#999' }}>
                <span><i className="fas fa-envelope" style={{ marginRight: '4px' }}></i>{selectedMentee.email}</span>
                <span><i className="fas fa-phone" style={{ marginRight: '4px' }}></i>{selectedMentee.phone}</span>
              </div>
            </div>
            <div style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: getRiskColor(selectedMentee.riskLevel),
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {selectedMentee.riskLevel} Risk
            </div>
          </div>

          {/* Performance Metrics */}
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Performance Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'CGPA', value: selectedMentee.cgpa.toFixed(2), max: '10.0', color: selectedMentee.cgpa >= 7 ? '#10ac8b' : '#f44336' },
              { label: 'Attendance', value: `${selectedMentee.attendance}%`, max: '100%', color: selectedMentee.attendance >= 75 ? '#10ac8b' : '#f44336' },
              { label: 'Behavior', value: selectedMentee.behaviorScore, max: '100', color: '#094d88' }
            ].map((metric, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: `${metric.color}10`,
                borderRadius: '12px',
                border: `2px solid ${metric.color}30`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: metric.color, marginBottom: '4px' }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>out of {metric.max}</div>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-history" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '4px' }}>
                Last Meeting: Performance Review
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Date: {selectedMentee.lastInteraction} | Discussed attendance issues and created action plan
              </div>
            </div>
            {improvementPlans.filter(p => p.studentId === selectedMentee.id).map(plan => (
              <div key={plan.id} style={{ padding: '12px', background: '#10ac8b15', borderRadius: '8px', border: '2px solid #10ac8b30' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '4px' }}>
                  Active Plan: {plan.title}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  Progress: {plan.progress}% | Status: {plan.status}
                </div>
                <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${plan.progress}%`,
                    height: '100%',
                    background: '#10ac8b',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '60px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#999'
        }}>
          <i className="fas fa-user-friends" style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}></i>
          <div style={{ fontSize: '16px' }}>Select a mentee to view details</div>
        </div>
      )}

      {/* Quick Actions */}
      {selectedMentee && (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#ff9800' }}></i>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: 'fa-calendar-plus', label: 'Schedule Meeting', tab: 'meetings' as MainTab, color: '#094d88' },
              { icon: 'fa-tasks', label: 'Create Plan', tab: 'improvement-plans' as MainTab, color: '#9c27b0' },
              { icon: 'fa-comments', label: 'Send Message', tab: 'communication' as MainTab, color: '#10ac8b' },
              { icon: 'fa-video', label: 'Start Video Call', action: 'video-call', color: '#f44336' }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action.action === 'video-call') {
                    setInVideoCall(true);
                    setActiveTab('communication');
                  } else if (action.tab) {
                    setActiveTab(action.tab);
                  }
                }}
                style={{
                  background: '#f8f9fa',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${action.color}15`;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <i className={`fas ${action.icon}`} style={{ color: action.color, fontSize: '18px' }}></i>
                <span style={{ color: '#2c3e50', fontWeight: '500' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Meetings Tab
  const renderMeetings = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      {/* Meeting Form & List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Schedule Meeting */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-calendar-plus" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Schedule New Meeting
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Select Mentee *
              </label>
              <select style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <option value="">Choose mentee...</option>
                {mentees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Meeting Type *
              </label>
              <select style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <option>Regular Check-in</option>
                <option>Performance Review</option>
                <option>Crisis Intervention</option>
                <option>Career Counseling</option>
                <option>Parent-Teacher-Student</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Date *
              </label>
              <input type="date" style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}/>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Time *
              </label>
              <input type="time" style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Agenda / Topics
              </label>
              <textarea
                placeholder="Enter meeting agenda..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button style={{
              gridColumn: 'span 2',
              padding: '14px',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-list" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
            Scheduled Meetings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {meetings.map((meeting) => (
              <div key={meeting.id} style={{
                padding: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#094d88'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50', marginBottom: '4px' }}>
                      {meeting.studentName}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                      {meeting.date} at {meeting.time} | {meeting.mode}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: '#094d8815',
                      color: '#094d88',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {meeting.type}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: `${getStatusColor(meeting.status)}15`,
                      color: getStatusColor(meeting.status),
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {meeting.status}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontStyle: 'italic' }}>
                  {meeting.agenda}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    style={{
                    padding: '8px 16px',
                    background: '#10ac8b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    <i className="fas fa-play" style={{ marginRight: '6px' }}></i>
                    Start Meeting
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: '#f8f9fa',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Widget */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#9c27b0' }}></i>
          November 2025
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} style={{ fontSize: '12px', fontWeight: '600', color: '#999', padding: '8px 0' }}>
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const hasMeeting = [25, 26].includes(day);
            return (
              <div
                key={day}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: hasMeeting ? '#094d8815' : day === 19 ? '#10ac8b' : '#f8f9fa',
                  color: day === 19 ? '#ffffff' : '#2c3e50',
                  fontSize: '13px',
                  fontWeight: day === 19 ? '600' : '500',
                  cursor: 'pointer',
                  border: hasMeeting ? '2px solid #094d88' : 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (day !== 19) {
                    e.currentTarget.style.background = '#e0e0e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day !== 19) {
                    e.currentTarget.style.background = hasMeeting ? '#094d8815' : '#f8f9fa';
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10ac8b' }}></div>
            <span>Today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#094d8815', border: '2px solid #094d88' }}></div>
            <span>Has Meeting</span>
          </div>
        </div>
      </div>

      {/* Meeting Notes Modal */}
      {selectedMeeting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedMeeting(null)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
                Meeting Notes: {selectedMeeting.studentName}
              </h3>
              <button
                onClick={() => setSelectedMeeting(null)}
                style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
              {selectedMeeting.date} at {selectedMeeting.time} | {selectedMeeting.type} | {selectedMeeting.mode}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Discussion Notes
              </label>
              <textarea
                placeholder="Enter detailed meeting notes..."
                rows={10}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                Action Items
              </label>
              <textarea
                placeholder="List action items (one per line)..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: '16px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                Complete Meeting
              </button>
              <button style={{
                padding: '14px 24px',
                background: '#f8f9fa',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Improvement Plans Tab
  const renderImprovementPlans = () => {
    // Get struggling students (High and Medium risk)
    const strugglingStudents = mentees.filter(m => m.riskLevel === 'High' || m.riskLevel === 'Medium');

    // List View - Show existing plans
    if (planView === 'list') {
      return (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-tasks" style={{ marginRight: '10px', color: '#9c27b0' }}></i>
              Student Improvement Plans
            </h3>
            <button
              onClick={() => setPlanView('select-student')}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Create New Plan
            </button>
          </div>

          {improvementPlans.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <i className="fas fa-tasks" style={{ fontSize: '64px', color: '#e0e0e0', marginBottom: '16px' }}></i>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>No Improvement Plans Yet</h4>
              <p style={{ margin: '0 0 20px 0' }}>Create recovery plans for struggling students</p>
              <button
                onClick={() => setPlanView('select-student')}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                Create First Plan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {improvementPlans.map((plan) => (
                <div key={plan.id} style={{
                  padding: '24px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9c27b0'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                  {/* Plan Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2c3e50' }}>{plan.title}</h4>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        Student: {plan.studentName} | {plan.startDate} to {plan.endDate}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {plan.focusAreas.map((area, idx) => (
                          <span key={idx} style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: '#9c27b015',
                            color: '#9c27b0',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: `${getStatusColor(plan.status)}15`,
                      color: getStatusColor(plan.status),
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {plan.status}
                    </span>
                  </div>

                  {/* Overall Progress */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>Overall Progress</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#9c27b0' }}>{plan.progress}%</span>
                    </div>
                    <div style={{
                      height: '10px',
                      background: '#e0e0e0',
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${plan.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Goals */}
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50' }}>Goals & Action Items</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plan.goals.map((goal, idx) => (
                      <div key={idx} style={{
                        padding: '14px',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                            {idx + 1}. {goal.description}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#9c27b0' }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          background: '#e0e0e0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginBottom: '10px'
                        }}>
                          <div style={{
                            width: `${goal.progress}%`,
                            height: '100%',
                            background: '#9c27b0',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          <strong>Action Items:</strong>
                          <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                            {goal.actionItems.map((item, itemIdx) => (
                              <li key={itemIdx} style={{ marginBottom: '2px' }}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Select Student View - Show struggling students
    if (planView === 'select-student') {
      return (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => setPlanView('list')}
              style={{
                padding: '8px 12px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '16px',
                color: '#666'
              }}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-user-graduate" style={{ marginRight: '10px', color: '#f44336' }}></i>
              Select Struggling Student
            </h3>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>High Risk Students</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {mentees.filter(m => m.riskLevel === 'High').length}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Medium Risk Students</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {mentees.filter(m => m.riskLevel === 'Medium').length}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active Plans</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {improvementPlans.filter(p => p.status === 'Active').length}
              </div>
            </div>
          </div>

          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#666' }}>
            Students needing attention ({strugglingStudents.length})
          </h4>

          {/* Student Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {strugglingStudents.map((student) => {
              const hasExistingPlan = improvementPlans.some(p => p.studentId === student.id);

              return (
                <div key={student.id} style={{
                  padding: '20px',
                  border: `2px solid ${student.riskLevel === 'High' ? '#f4433615' : '#ff980015'}`,
                  borderRadius: '12px',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  cursor: hasExistingPlan ? 'not-allowed' : 'pointer',
                  opacity: hasExistingPlan ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!hasExistingPlan) {
                    e.currentTarget.style.borderColor = student.riskLevel === 'High' ? '#f44336' : '#ff9800';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = student.riskLevel === 'High' ? '#f4433615' : '#ff980015';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  if (!hasExistingPlan) {
                    setSelectedStudentForPlan(student);
                    setPlanView('create-plan');
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#2c3e50' }}>{student.name}</h4>
                      <div style={{ fontSize: '13px', color: '#666' }}>{student.studentId} • {student.program}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: student.riskLevel === 'High' ? '#f4433615' : '#ff980015',
                      color: student.riskLevel === 'High' ? '#f44336' : '#ff9800',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {student.riskLevel} Risk
                    </span>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>CGPA</div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: student.cgpa < 7.0 ? '#f44336' : '#ff9800'
                      }}>
                        {student.cgpa}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Attendance</div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: student.attendance < 75 ? '#f44336' : '#ff9800'
                      }}>
                        {student.attendance}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Behavior</div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: student.behaviorScore < 75 ? '#f44336' : '#ff9800'
                      }}>
                        {student.behaviorScore}
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                      Key Issues:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {student.cgpa < 7.0 && (
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: '#f4433610',
                          color: '#f44336',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          <i className="fas fa-exclamation-circle" style={{ marginRight: '4px' }}></i>
                          Low CGPA
                        </span>
                      )}
                      {student.attendance < 75 && (
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: '#f4433610',
                          color: '#f44336',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          <i className="fas fa-exclamation-circle" style={{ marginRight: '4px' }}></i>
                          Poor Attendance
                        </span>
                      )}
                      {student.behaviorScore < 75 && (
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: '#ff980010',
                          color: '#ff9800',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          <i className="fas fa-user-times" style={{ marginRight: '4px' }}></i>
                          Behavior Concerns
                        </span>
                      )}
                    </div>
                  </div>

                  {hasExistingPlan ? (
                    <div style={{
                      padding: '10px',
                      background: '#10ac8b10',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#10ac8b',
                      fontWeight: '600'
                    }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                      Active Plan Exists
                    </div>
                  ) : (
                    <div style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}>
                      <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                      Create Recovery Plan
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {strugglingStudents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <i className="fas fa-check-circle" style={{ fontSize: '64px', color: '#10ac8b', marginBottom: '16px' }}></i>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>All Students Performing Well</h4>
              <p style={{ margin: 0 }}>No students currently need intervention plans</p>
            </div>
          )}
        </div>
      );
    }

    // Create Plan View - Form to create recovery plan
    if (planView === 'create-plan' && selectedStudentForPlan) {
      const student = selectedStudentForPlan;

      // Auto-suggest focus areas based on student metrics
      const suggestedFocusAreas = [];
      if (student.cgpa < 7.0) suggestedFocusAreas.push('Academic Performance');
      if (student.attendance < 75) suggestedFocusAreas.push('Attendance');
      if (student.behaviorScore < 75) suggestedFocusAreas.push('Behavior & Discipline');

      return (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => {
                setPlanView('select-student');
                setSelectedStudentForPlan(null);
                setNewPlanData({
                  title: '',
                  focusAreas: [],
                  startDate: '',
                  endDate: '',
                  goals: [{ description: '', actionItems: [''] }]
                });
              }}
              style={{
                padding: '8px 12px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '16px',
                color: '#666'
              }}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-file-medical" style={{ marginRight: '10px', color: '#9c27b0' }}></i>
              Create Recovery Plan
            </h3>
          </div>

          {/* Student Info Card */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #094d8815 0%, #10ac8b15 100%)',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '2px solid #094d8830'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2c3e50' }}>{student.name}</h4>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  {student.studentId} • {student.program} • Year {student.year}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>CGPA</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.cgpa < 7.0 ? '#f44336' : '#10ac8b' }}>
                      {student.cgpa}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Attendance</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.attendance < 75 ? '#f44336' : '#10ac8b' }}>
                      {student.attendance}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Behavior</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.behaviorScore < 75 ? '#f44336' : '#10ac8b' }}>
                      {student.behaviorScore}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Risk Level</div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: student.riskLevel === 'High' ? '#f44336' : '#ff9800',
                      padding: '4px 8px',
                      background: student.riskLevel === 'High' ? '#f4433615' : '#ff980015',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      {student.riskLevel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Focus Areas */}
          {suggestedFocusAreas.length > 0 && (
            <div style={{
              padding: '16px',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: '8px' }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                Suggested Focus Areas Based on Performance
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {suggestedFocusAreas.map((area, idx) => (
                  <span key={idx} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#856404',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: '1px solid #ffc107'
                  }}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Plan Title */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                Plan Title <span style={{ color: '#f44336' }}>*</span>
              </label>
              <input
                type="text"
                value={newPlanData.title}
                onChange={(e) => setNewPlanData({ ...newPlanData, title: e.target.value })}
                placeholder="e.g., Academic Recovery Plan, Attendance Improvement Plan"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                  Start Date <span style={{ color: '#f44336' }}>*</span>
                </label>
                <input
                  type="date"
                  value={newPlanData.startDate}
                  onChange={(e) => setNewPlanData({ ...newPlanData, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                  End Date <span style={{ color: '#f44336' }}>*</span>
                </label>
                <input
                  type="date"
                  value={newPlanData.endDate}
                  onChange={(e) => setNewPlanData({ ...newPlanData, endDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                Focus Areas <span style={{ color: '#f44336' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {['Academic Performance', 'Attendance', 'Behavior & Discipline', 'Mental Health', 'Participation', 'Assignment Completion'].map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      const areas = newPlanData.focusAreas.includes(area)
                        ? newPlanData.focusAreas.filter(a => a !== area)
                        : [...newPlanData.focusAreas, area];
                      setNewPlanData({ ...newPlanData, focusAreas: areas });
                    }}
                    style={{
                      padding: '8px 16px',
                      border: newPlanData.focusAreas.includes(area) ? '2px solid #9c27b0' : '2px solid #e0e0e0',
                      background: newPlanData.focusAreas.includes(area) ? '#9c27b015' : '#ffffff',
                      color: newPlanData.focusAreas.includes(area) ? '#9c27b0' : '#666',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}>
                    {newPlanData.focusAreas.includes(area) && (
                      <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                    )}
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                Goals & Action Items <span style={{ color: '#f44336' }}>*</span>
              </label>
              {newPlanData.goals.map((goal, goalIdx) => (
                <div key={goalIdx} style={{
                  padding: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h5 style={{ margin: 0, fontSize: '15px', color: '#2c3e50' }}>Goal {goalIdx + 1}</h5>
                    {newPlanData.goals.length > 1 && (
                      <button
                        onClick={() => {
                          const goals = newPlanData.goals.filter((_, idx) => idx !== goalIdx);
                          setNewPlanData({ ...newPlanData, goals });
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#f4433615',
                          color: '#f44336',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={goal.description}
                    onChange={(e) => {
                      const goals = [...newPlanData.goals];
                      goals[goalIdx].description = e.target.value;
                      setNewPlanData({ ...newPlanData, goals });
                    }}
                    placeholder="Enter goal description"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginBottom: '12px',
                      outline: 'none'
                    }}
                  />

                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                    Action Items:
                  </div>
                  {goal.actionItems.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const goals = [...newPlanData.goals];
                          goals[goalIdx].actionItems[itemIdx] = e.target.value;
                          setNewPlanData({ ...newPlanData, goals });
                        }}
                        placeholder={`Action item ${itemIdx + 1}`}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      {goal.actionItems.length > 1 && (
                        <button
                          onClick={() => {
                            const goals = [...newPlanData.goals];
                            goals[goalIdx].actionItems = goals[goalIdx].actionItems.filter((_, idx) => idx !== itemIdx);
                            setNewPlanData({ ...newPlanData, goals });
                          }}
                          style={{
                            padding: '8px 12px',
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#666'
                          }}>
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const goals = [...newPlanData.goals];
                      goals[goalIdx].actionItems.push('');
                      setNewPlanData({ ...newPlanData, goals });
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#f5f5f5',
                      border: '1px dashed #ccc',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#666',
                      marginTop: '4px'
                    }}>
                    <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
                    Add Action Item
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewPlanData({
                    ...newPlanData,
                    goals: [...newPlanData.goals, { description: '', actionItems: [''] }]
                  });
                }}
                style={{
                  padding: '10px 16px',
                  background: '#ffffff',
                  border: '2px dashed #9c27b0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#9c27b0',
                  fontWeight: '600',
                  width: '100%'
                }}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                Add Another Goal
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  setPlanView('select-student');
                  setSelectedStudentForPlan(null);
                  setNewPlanData({
                    title: '',
                    focusAreas: [],
                    startDate: '',
                    endDate: '',
                    goals: [{ description: '', actionItems: [''] }]
                  });
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#666'
                }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would save the plan
                  alert('Plan created successfully! (In production, this would save to database)');
                  setPlanView('list');
                  setSelectedStudentForPlan(null);
                  setNewPlanData({
                    title: '',
                    focusAreas: [],
                    startDate: '',
                    endDate: '',
                    goals: [{ description: '', actionItems: [''] }]
                  });
                }}
                disabled={
                  !newPlanData.title ||
                  !newPlanData.startDate ||
                  !newPlanData.endDate ||
                  newPlanData.focusAreas.length === 0 ||
                  newPlanData.goals.some(g => !g.description || g.actionItems.some(a => !a))
                }
                style={{
                  flex: 2,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  opacity: (
                    !newPlanData.title ||
                    !newPlanData.startDate ||
                    !newPlanData.endDate ||
                    newPlanData.focusAreas.length === 0 ||
                    newPlanData.goals.some(g => !g.description || g.actionItems.some(a => !a))
                  ) ? 0.5 : 1
                }}>
                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                Create Recovery Plan
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Communication Hub Tab
  const renderCommunication = () => {
    if (inVideoCall) {
      return (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-video" style={{ marginRight: '10px', color: '#f44336' }}></i>
              Video Call: {selectedMentee?.name || 'Student'}
            </h3>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>
              <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
              00:05:32
            </div>
          </div>

          {/* Video Area */}
          <div style={{
            width: '100%',
            height: '500px',
            background: '#000000',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                margin: '0 auto 16px'
              }}>
                {selectedMentee?.name.split(' ').map(n => n[0]).join('') || 'ST'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                {selectedMentee?.name || 'Student Name'}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.7 }}>
                Call in progress...
              </div>
            </div>

            {/* Self View */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '200px',
              height: '150px',
              background: '#1a1a1a',
              borderRadius: '8px',
              border: '3px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px'
            }}>
              You (Camera Off)
            </div>
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#666',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#666'}>
              <i className="fas fa-microphone-slash"></i>
            </button>
            <button style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#666',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#666'}>
              <i className="fas fa-video-slash"></i>
            </button>
            <button style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#10ac8b',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#0d9170'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#10ac8b'}>
              <i className="fas fa-desktop"></i>
            </button>
            <button
              onClick={() => setInVideoCall(false)}
              style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#f44336',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}>
              <i className="fas fa-phone-slash"></i>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: '24px' }}>
        {/* Conversation List */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '700px',
          overflow: 'auto'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>Messages</h3>
          <input
            type="text"
            placeholder="Search conversations..."
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mentees.slice(0, 5).map((mentee) => (
              <div
                key={mentee.id}
                onClick={() => setSelectedConversation(mentee.id)}
                style={{
                  padding: '12px',
                  border: selectedConversation === mentee.id ? '2px solid #10ac8b' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  background: selectedConversation === mentee.id ? '#10ac8b10' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedConversation !== mentee.id) {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConversation !== mentee.id) {
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    flexShrink: 0
                  }}>
                    {mentee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mentee.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Thank you for the guidance...
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#999', textAlign: 'right' }}>2h ago</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '16px', borderBottom: '2px solid #f0f0f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                {mentees.find(m => m.id === selectedConversation)?.name}
              </div>
              <div style={{ fontSize: '13px', color: '#999' }}>
                {mentees.find(m => m.id === selectedConversation)?.studentId}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  color: '#ffffff',
                  borderRadius: '12px 12px 0 12px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Hi! I noticed your attendance has been low this week. Is everything okay?
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>10:30 AM</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  color: '#2c3e50',
                  borderRadius: '12px 12px 12px 0',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Yes sir, I had some family issues. I'll make up for the missed classes.
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>10:45 AM</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  color: '#ffffff',
                  borderRadius: '12px 12px 0 12px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  I understand. Let's schedule a meeting to discuss how you can catch up. ✓✓
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>11:00 AM</div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    setMessageInput('');
                  }
                }}
              />
              <button style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '60px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#999'
          }}>
            <i className="fas fa-comments" style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}></i>
            <div style={{ fontSize: '16px' }}>Select a conversation to start messaging</div>
          </div>
        )}

        {/* Quick Info */}
        {selectedConversation && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#2c3e50' }}>Student Info</h3>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '20px',
              margin: '0 auto 12px'
            }}>
              {mentees.find(m => m.id === selectedConversation)?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                {mentees.find(m => m.id === selectedConversation)?.name}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {mentees.find(m => m.id === selectedConversation)?.studentId}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setInVideoCall(true);
                  setSelectedMentee(mentees.find(m => m.id === selectedConversation) || null);
                }}
                style={{
                background: '#f44336',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <i className="fas fa-video" style={{ marginRight: '8px' }}></i>
                Start Video Call
              </button>
              <button style={{
                background: '#f8f9fa',
                color: '#666',
                border: '2px solid #e0e0e0',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <i className="fas fa-calendar" style={{ marginRight: '8px' }}></i>
                Schedule Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Parent Interactions Tab
  const renderParentInteractions = () => {
    const formatCallDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleCall = (interaction: ParentInteraction) => {
      setSelectedParentContact(interaction);
      setCallStatus('dialing');
      setCallDuration(0);
      setShowCallModal(true);

      // Simulate call progression
      setTimeout(() => setCallStatus('connected'), 2000);
      setTimeout(() => setCallStatus('in-call'), 3500);
    };

    const handleEndCall = () => {
      setShowCallModal(false);
      setCallStatus('dialing');
      setCallDuration(0);
      alert('Call logged to interaction history!');
    };

    const handleSendSMS = () => {
      if (smsMessage.trim()) {
        alert(`SMS sent to ${selectedParentContact?.parentName}: "${smsMessage}"`);
        setSmsMessage('');
        setShowSMSModal(false);
      }
    };

    const handleScheduleMeeting = () => {
      if (newMeetingData.date && newMeetingData.time && newMeetingData.agenda) {
        alert(`Meeting scheduled with ${selectedParentContact?.parentName} on ${newMeetingData.date} at ${newMeetingData.time}`);
        setNewMeetingData({ type: 'In-person', date: '', time: '', agenda: '', location: '' });
        setShowMeetingModal(false);
      }
    };

    const handleLogInteraction = () => {
      if (newInteractionData.studentId && newInteractionData.parentName && newInteractionData.summary) {
        alert('New interaction logged successfully!');
        setNewInteractionData({
          studentId: '',
          parentName: '',
          type: 'Call',
          mode: '',
          summary: '',
          followUpRequired: false
        });
        setShowLogInteractionModal(false);
      }
    };

    return (
      <div>
        {/* Main Content */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-users" style={{ marginRight: '10px', color: '#ff9800' }}></i>
              Parent Interaction Log
            </h3>
            <button
              onClick={() => setShowLogInteractionModal(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Log New Interaction
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {parentInteractions.map((interaction) => (
              <div key={interaction.id} style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff9800'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                      {interaction.parentName} ({interaction.studentName})
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                      {interaction.date} | {interaction.type} ({interaction.mode})
                    </div>
                  </div>
                  {interaction.followUpRequired && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: '#f4433615',
                      color: '#f44336',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Follow-up Required
                    </span>
                  )}
                </div>
                <div style={{
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  {interaction.summary}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCall(interaction)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                    <i className="fas fa-phone" style={{ marginRight: '6px' }}></i>
                    Call
                  </button>
                  <button
                    onClick={() => {
                      setSelectedParentContact(interaction);
                      setSmsMessage('');
                      setShowSMSModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #10ac8b 0%, #0e9570 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                    <i className="fas fa-sms" style={{ marginRight: '6px' }}></i>
                    SMS
                  </button>
                  <button
                    onClick={() => {
                      setSelectedParentContact(interaction);
                      setNewMeetingData({ type: 'In-person', date: '', time: '', agenda: '', location: '' });
                      setShowMeetingModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                    <i className="fas fa-calendar-plus" style={{ marginRight: '6px' }}></i>
                    Schedule Meeting
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Modal */}
        {showCallModal && selectedParentContact && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '400px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#2c3e50' }}>
                {callStatus === 'dialing' && 'Calling...'}
                {callStatus === 'connected' && 'Connecting...'}
                {callStatus === 'in-call' && 'Call in Progress'}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#666' }}>
                {selectedParentContact.parentName}
              </p>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#999' }}>
                {selectedParentContact.studentName}
              </p>

              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#2196f3',
                marginBottom: '32px'
              }}>
                {callStatus === 'in-call' ? formatCallDuration(callDuration) : '00:00'}
              </div>

              {callStatus === 'in-call' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
                  <button style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e0e0e0',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-microphone-slash" style={{ fontSize: '18px', color: '#666' }}></i>
                  </button>
                  <button style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e0e0e0',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-volume-up" style={{ fontSize: '18px', color: '#666' }}></i>
                  </button>
                  <button style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e0e0e0',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-th" style={{ fontSize: '18px', color: '#666' }}></i>
                  </button>
                </div>
              )}

              <button
                onClick={handleEndCall}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#f44336',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                <i className="fas fa-phone-slash" style={{ marginRight: '8px' }}></i>
                End Call
              </button>
            </div>
          </div>
        )}

        {/* SMS Modal */}
        {showSMSModal && selectedParentContact && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '500px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
                  <i className="fas fa-sms" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
                  Send SMS
                </h3>
                <button
                  onClick={() => setShowSMSModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    color: '#999',
                    cursor: 'pointer'
                  }}>
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                  {selectedParentContact.parentName}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Parent of {selectedParentContact.studentName}
                </div>
              </div>

              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '8px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: smsMessage.length > 160 ? '#f44336' : '#999' }}>
                  {smsMessage.length}/160 characters
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowSMSModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={handleSendSMS}
                  disabled={!smsMessage.trim()}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: smsMessage.trim() ? 'linear-gradient(135deg, #10ac8b 0%, #0e9570 100%)' : '#e0e0e0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: smsMessage.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                  <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                  Send SMS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Meeting Modal */}
        {showMeetingModal && selectedParentContact && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '550px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
                  <i className="fas fa-calendar-plus" style={{ marginRight: '10px', color: '#ff9800' }}></i>
                  Schedule Meeting
                </h3>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    color: '#999',
                    cursor: 'pointer'
                  }}>
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                  {selectedParentContact.parentName}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Parent of {selectedParentContact.studentName}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                    Meeting Type
                  </label>
                  <select
                    value={newMeetingData.type}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}>
                    <option value="In-person">In-person</option>
                    <option value="Online">Online (Video Call)</option>
                    <option value="Phone">Phone Call</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={newMeetingData.date}
                      onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                      Time
                    </label>
                    <input
                      type="time"
                      value={newMeetingData.time}
                      onChange={(e) => setNewMeetingData({ ...newMeetingData, time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {newMeetingData.type === 'In-person' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={newMeetingData.location}
                      onChange={(e) => setNewMeetingData({ ...newMeetingData, location: e.target.value })}
                      placeholder="e.g., Principal's Office, Room 201"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                    Agenda/Purpose
                  </label>
                  <textarea
                    value={newMeetingData.agenda}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, agenda: e.target.value })}
                    placeholder="What will be discussed in this meeting?"
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  disabled={!newMeetingData.date || !newMeetingData.time || !newMeetingData.agenda}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: (newMeetingData.date && newMeetingData.time && newMeetingData.agenda)
                      ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                      : '#e0e0e0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (newMeetingData.date && newMeetingData.time && newMeetingData.agenda) ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                  <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Log New Interaction Modal */}
        {showLogInteractionModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '550px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
                  <i className="fas fa-plus-circle" style={{ marginRight: '10px', color: '#ff9800' }}></i>
                  Log New Interaction
                </h3>
                <button
                  onClick={() => setShowLogInteractionModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    color: '#999',
                    cursor: 'pointer'
                  }}>
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                    Student
                  </label>
                  <select
                    value={newInteractionData.studentId}
                    onChange={(e) => setNewInteractionData({ ...newInteractionData, studentId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}>
                    <option value="">Select Student</option>
                    {mentees.map((mentee) => (
                      <option key={mentee.id} value={mentee.id}>{mentee.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={newInteractionData.parentName}
                    onChange={(e) => setNewInteractionData({ ...newInteractionData, parentName: e.target.value })}
                    placeholder="e.g., Mr. Kumar, Mrs. Sharma"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                      Interaction Type
                    </label>
                    <select
                      value={newInteractionData.type}
                      onChange={(e) => setNewInteractionData({ ...newInteractionData, type: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}>
                      <option value="Call">Call</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Email">Email</option>
                      <option value="Message">Message</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                      Mode
                    </label>
                    <input
                      type="text"
                      value={newInteractionData.mode}
                      onChange={(e) => setNewInteractionData({ ...newInteractionData, mode: e.target.value })}
                      placeholder="e.g., Phone, In-person"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                    Summary
                  </label>
                  <textarea
                    value={newInteractionData.summary}
                    onChange={(e) => setNewInteractionData({ ...newInteractionData, summary: e.target.value })}
                    placeholder="Describe what was discussed..."
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={newInteractionData.followUpRequired}
                    onChange={(e) => setNewInteractionData({ ...newInteractionData, followUpRequired: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="followUp" style={{ fontSize: '14px', color: '#2c3e50', cursor: 'pointer' }}>
                    Follow-up Required
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowLogInteractionModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={handleLogInteraction}
                  disabled={!newInteractionData.studentId || !newInteractionData.parentName || !newInteractionData.summary}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: (newInteractionData.studentId && newInteractionData.parentName && newInteractionData.summary)
                      ? 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)'
                      : '#e0e0e0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (newInteractionData.studentId && newInteractionData.parentName && newInteractionData.summary) ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                  <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                  Log Interaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Career & Development Tab - Spider Chart
  const renderSpiderChart = (developmentDimensions: any[]) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const angleStep = (2 * Math.PI) / developmentDimensions.length;

    const currentPoints = developmentDimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (dim.current / dim.max) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    const targetPoints = developmentDimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (dim.target / dim.max) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    const currentPath = currentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
      <svg width="300" height="300" style={{ margin: '0 auto', display: 'block' }}>
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle key={i} cx={centerX} cy={centerY} r={radius * scale} fill="none" stroke="#e0e0e0" strokeWidth="1" />
        ))}
        {developmentDimensions.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          const labelX = centerX + (radius + 30) * Math.cos(angle);
          const labelY = centerY + (radius + 30) * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={centerX} y1={centerY} x2={x2} y2={y2} stroke="#e0e0e0" strokeWidth="1" />
              <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#666">
                {dim.name}
              </text>
            </g>
          );
        })}
        <path d={targetPath} fill="#ff980020" stroke="#ff9800" strokeWidth="2" strokeDasharray="5,5" />
        <path d={currentPath} fill="#094d8820" stroke="#094d88" strokeWidth="3" />
        {currentPoints.map((point, i) => (
          <circle key={i} cx={point.x} cy={point.y} r="5" fill="#094d88" stroke="#ffffff" strokeWidth="2">
            <title>{`${developmentDimensions[i].name}: ${developmentDimensions[i].current}/${developmentDimensions[i].max}`}</title>
          </circle>
        ))}
      </svg>
    );
  };

  // Career & Development Tab
  const renderCareerDevelopment = () => {
    const strugglingStudents = mentees.filter(m => m.riskLevel !== 'Low');

    // Student Selection View
    if (careerView === 'select-student') {
      return (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-briefcase" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Career & Development - Select Student
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { icon: 'fa-users', label: 'Total Mentees', value: mentees.length, color: '#094d88' },
              { icon: 'fa-graduation-cap', label: 'Career Plans Needed', value: mentees.length, color: '#10ac8b' },
              { icon: 'fa-chart-line', label: 'High Performers', value: mentees.filter(m => m.cgpa >= 8).length, color: '#9c27b0' }
            ].map((stat, idx) => (
              <div key={idx} style={{ padding: '20px', background: `${stat.color}15`, borderRadius: '12px' }}>
                <i className={`fas ${stat.icon}`} style={{ fontSize: '32px', color: stat.color, marginBottom: '12px' }}></i>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {mentees.map((student) => (
              <div key={student.id} style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#094d88';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                setSelectedCareerStudent(student);
                setCareerView('show-predictions');
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#2c3e50' }}>{student.name}</h4>
                    <div style={{ fontSize: '13px', color: '#666' }}>{student.studentId} • Year {student.year}</div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: student.riskLevel === 'High' ? '#f4433615' : student.riskLevel === 'Medium' ? '#ff980015' : '#10ac8b15',
                    color: student.riskLevel === 'High' ? '#f44336' : student.riskLevel === 'Medium' ? '#ff9800' : '#10ac8b',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {student.riskLevel} Risk
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>CGPA</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.cgpa >= 8 ? '#10ac8b' : student.cgpa >= 7 ? '#ff9800' : '#f44336' }}>
                      {student.cgpa}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Attendance</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.attendance >= 85 ? '#10ac8b' : student.attendance >= 75 ? '#ff9800' : '#f44336' }}>
                      {student.attendance}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Behavior</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: student.behaviorScore >= 85 ? '#10ac8b' : student.behaviorScore >= 70 ? '#ff9800' : '#f44336' }}>
                      {student.behaviorScore}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '6px' }}></i>
                  View Career Predictions
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Show Predictions View
    if (careerView === 'show-predictions' && selectedCareerStudent) {
      const predictions = getCareerPredictions(selectedCareerStudent);
      const studentDevelopment = getStudentDevelopment(selectedCareerStudent);

      return (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => {
                setCareerView('select-student');
                setSelectedCareerStudent(null);
              }}
              style={{
                padding: '8px 16px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
                fontWeight: '600'
              }}>
              <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
              Back to Students
            </button>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #094d8815 0%, #10ac8b15 100%)',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '2px solid #094d8830'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#2c3e50' }}>{selectedCareerStudent.name}</h3>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              {selectedCareerStudent.studentId} • {selectedCareerStudent.program} • Year {selectedCareerStudent.year}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>CGPA</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#094d88' }}>{selectedCareerStudent.cgpa}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Attendance</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#094d88' }}>{selectedCareerStudent.attendance}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Behavior</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#094d88' }}>{selectedCareerStudent.behaviorScore}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Risk Level</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: selectedCareerStudent.riskLevel === 'High' ? '#f44336' : selectedCareerStudent.riskLevel === 'Medium' ? '#ff9800' : '#10ac8b',
                  padding: '4px 8px',
                  background: selectedCareerStudent.riskLevel === 'High' ? '#f4433615' : selectedCareerStudent.riskLevel === 'Medium' ? '#ff980015' : '#10ac8b15',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  {selectedCareerStudent.riskLevel}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2c3e50' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '10px', color: '#094d88' }}></i>
                AI Career Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {predictions.map((career) => (
                  <div key={career.id} style={{
                    padding: '18px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#094d88'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '17px', color: '#2c3e50' }}>{career.title}</h4>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {career.matchPercentage}% Match
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px', fontStyle: 'italic' }}>
                      {career.explanation}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      <i className="fas fa-chart-line" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                      {career.industryOutlook}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50', marginBottom: '6px' }}>Required Skills:</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {career.requiredSkills.map((skill: string, idx: number) => (
                          <span key={idx} style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            background: '#094d8815',
                            color: '#094d88',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50', marginBottom: '6px' }}>Recommended Courses:</div>
                      <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px', color: '#666' }}>
                        {career.recommendedCourses.map((course: string, idx: number) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2c3e50' }}>
                <i className="fas fa-chart-radar" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
                Holistic Development Tracker
              </h3>

              {renderSpiderChart(studentDevelopment)}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '4px', background: '#094d88', borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '13px', color: '#666' }}>Current</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '4px', background: '#ff9800', borderRadius: '2px', border: '1px dashed #ff9800' }}></div>
                  <span style={{ fontSize: '13px', color: '#666' }}>Target</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {studentDevelopment.map((dim, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{dim.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#094d88' }}>
                        {dim.current}/{dim.max}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(dim.current / dim.max) * 100}%`,
                        height: '100%',
                        background: dim.current >= dim.target ? '#10ac8b' : '#ff9800',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#856404' }}>
                  <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                  AI Recommendations
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404', fontSize: '13px' }}>
                  {studentDevelopment
                    .filter(d => d.current < d.target)
                    .slice(0, 3)
                    .map((d, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>
                        Focus on improving <strong>{d.name}</strong> - currently at {d.current}%, target: {d.target}%
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };


  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(9, 77, 136, 0.2)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>
              Student Mentoring Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              Guide, track, and support student development holistically
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="fas fa-users" style={{ fontSize: '32px' }}></i>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{mentees.length}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Mentees</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: 'fa-exclamation-triangle', label: 'At-Risk', value: mentees.filter(m => m.riskLevel === 'High').length },
            { icon: 'fa-calendar-check', label: 'Meetings This Week', value: meetings.filter(m => m.status === 'Scheduled').length },
            { icon: 'fa-comments', label: 'Unread Messages', value: '3' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className={`fas ${stat.icon}`} style={{ fontSize: '24px' }}></i>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
        {[
          { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
          { id: 'my-mentees', icon: 'fa-user-friends', label: 'My Mentees' },
          { id: 'meetings', icon: 'fa-calendar-check', label: 'Meetings' },
          { id: 'improvement-plans', icon: 'fa-tasks', label: 'Improvement Plans' },
          { id: 'communication', icon: 'fa-comments', label: 'Communication' },
          { id: 'parent-interactions', icon: 'fa-users', label: 'Parent Interactions' },
          { id: 'career-development', icon: 'fa-briefcase', label: 'Career & Development' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MainTab)}
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#666',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(9, 77, 136, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '13px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: '20px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'my-mentees' && renderMyMentees()}
      {activeTab === 'meetings' && renderMeetings()}
      {activeTab === 'improvement-plans' && renderImprovementPlans()}
      {activeTab === 'communication' && renderCommunication()}
      {activeTab === 'parent-interactions' && renderParentInteractions()}
      {activeTab === 'career-development' && renderCareerDevelopment()}
    </div>
  );
};

export default StudentMentoringDashboard;
