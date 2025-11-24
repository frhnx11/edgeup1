import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  currentGPA: number;
  classRank: number;
  totalStudents: number;
  attendance: number;
}

interface SubjectPerformance {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  classAverage: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  teacherRemark: string;
  attendance: number;
}

interface ReportCard {
  id: string;
  term: string;
  academicYear: string;
  dateIssued: string;
  overallPercentage: number;
  overallGrade: string;
  classRank: number;
  subjects: SubjectPerformance[];
  classTeacherRemark: string;
  principalRemark: string;
  attendance: number;
}

interface Achievement {
  id: string;
  title: string;
  category: 'academic' | 'sports' | 'cultural' | 'leadership';
  date: string;
  description: string;
}

interface AIInsight {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  predictions: {
    nextTermGPA: number;
    rankPrediction: number;
    boardExamPrediction: string;
  };
  studyPlan: {
    subject: string;
    hoursPerWeek: number;
    focus: string[];
    resources: string[];
  }[];
}

interface AISubjectAnalysis {
  subject: string;
  topicBreakdown: {
    topic: string;
    performance: number;
    status: 'excellent' | 'good' | 'needs-work' | 'critical';
  }[];
  marksLostIn: string[];
  suggestions: string[];
  predictedImprovement: number;
}

interface AIAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

const ProgressReports = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [selectedTerm, setSelectedTerm] = useState<string>('term4');
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null);
  const [animatedGPA, setAnimatedGPA] = useState(0);
  const [animatedRank, setAnimatedRank] = useState(0);
  const [animatedAttendance, setAnimatedAttendance] = useState(0);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPTMModal, setShowPTMModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTutoringModal, setShowTutoringModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubjectForModal, setSelectedSubjectForModal] = useState<SubjectPerformance | null>(null);

  // Loading states
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: 'Aarav Sharma',
      class: '10',
      section: 'A',
      rollNumber: '15',
      currentGPA: 8.7,
      classRank: 5,
      totalStudents: 45,
      attendance: 94
    },
    {
      id: '2',
      name: 'Diya Sharma',
      class: '7',
      section: 'B',
      rollNumber: '22',
      currentGPA: 9.2,
      classRank: 2,
      totalStudents: 42,
      attendance: 96
    }
  ];

  const reportCards: { [key: string]: ReportCard[] } = {
    '1': [
      {
        id: 'rc1',
        term: 'Term 1',
        academicYear: '2024-25',
        dateIssued: '30 Jun 2024',
        overallPercentage: 82,
        overallGrade: 'B+',
        classRank: 8,
        attendance: 91,
        classTeacherRemark: 'Good overall performance. Shows consistent effort in most subjects.',
        principalRemark: 'Keep up the good work.',
        subjects: [
          { subject: 'Mathematics', marksObtained: 78, totalMarks: 100, grade: 'B+', classAverage: 72, rank: 6, trend: 'stable', teacherRemark: 'Good grasp of concepts. Needs practice in geometry.', attendance: 90 },
          { subject: 'English', marksObtained: 85, totalMarks: 100, grade: 'A', classAverage: 75, rank: 4, trend: 'up', teacherRemark: 'Excellent writing skills. Good participation in class.', attendance: 92 },
          { subject: 'Science', marksObtained: 80, totalMarks: 100, grade: 'A-', classAverage: 70, rank: 5, trend: 'stable', teacherRemark: 'Strong in theory. Lab work needs improvement.', attendance: 91 },
          { subject: 'Social Studies', marksObtained: 83, totalMarks: 100, grade: 'A-', classAverage: 74, rank: 5, trend: 'up', teacherRemark: 'Well-researched projects. Good analytical skills.', attendance: 89 },
          { subject: 'Hindi', marksObtained: 79, totalMarks: 100, grade: 'B+', classAverage: 76, rank: 12, trend: 'stable', teacherRemark: 'Good comprehension. Grammar needs attention.', attendance: 93 },
          { subject: 'Computer Science', marksObtained: 88, totalMarks: 100, grade: 'A', classAverage: 78, rank: 3, trend: 'up', teacherRemark: 'Exceptional coding skills. Very creative projects.', attendance: 94 },
          { subject: 'Physical Education', marksObtained: 90, totalMarks: 100, grade: 'A+', classAverage: 82, rank: 2, trend: 'up', teacherRemark: 'Outstanding performance in athletics.', attendance: 95 },
          { subject: 'Art & Craft', marksObtained: 87, totalMarks: 100, grade: 'A', classAverage: 80, rank: 4, trend: 'stable', teacherRemark: 'Creative and imaginative work.', attendance: 90 }
        ]
      },
      {
        id: 'rc2',
        term: 'Term 2',
        academicYear: '2024-25',
        dateIssued: '30 Sep 2024',
        overallPercentage: 85,
        overallGrade: 'A-',
        classRank: 6,
        attendance: 93,
        classTeacherRemark: 'Significant improvement this term. More focused in class.',
        principalRemark: 'Excellent progress. Well done!',
        subjects: [
          { subject: 'Mathematics', marksObtained: 82, totalMarks: 100, grade: 'A-', classAverage: 74, rank: 5, trend: 'up', teacherRemark: 'Notable improvement. Keep practicing.', attendance: 93 },
          { subject: 'English', marksObtained: 87, totalMarks: 100, grade: 'A', classAverage: 76, rank: 3, trend: 'up', teacherRemark: 'Outstanding essay writing. Excellent vocabulary.', attendance: 94 },
          { subject: 'Science', marksObtained: 84, totalMarks: 100, grade: 'A-', classAverage: 72, rank: 4, trend: 'up', teacherRemark: 'Great improvement in lab work.', attendance: 92 },
          { subject: 'Social Studies', marksObtained: 85, totalMarks: 100, grade: 'A', classAverage: 75, rank: 4, trend: 'up', teacherRemark: 'Excellent map work and presentation skills.', attendance: 91 },
          { subject: 'Hindi', marksObtained: 81, totalMarks: 100, grade: 'A-', classAverage: 77, rank: 10, trend: 'up', teacherRemark: 'Better effort in grammar. Good progress.', attendance: 94 },
          { subject: 'Computer Science', marksObtained: 91, totalMarks: 100, grade: 'A+', classAverage: 79, rank: 2, trend: 'up', teacherRemark: 'Brilliant project work. Natural programmer.', attendance: 95 },
          { subject: 'Physical Education', marksObtained: 92, totalMarks: 100, grade: 'A+', classAverage: 83, rank: 1, trend: 'up', teacherRemark: 'District level champion in 100m sprint!', attendance: 96 },
          { subject: 'Art & Craft', marksObtained: 88, totalMarks: 100, grade: 'A', classAverage: 81, rank: 3, trend: 'up', teacherRemark: 'Beautiful watercolor paintings.', attendance: 92 }
        ]
      },
      {
        id: 'rc3',
        term: 'Term 3',
        academicYear: '2024-25',
        dateIssued: '31 Dec 2024',
        overallPercentage: 87,
        overallGrade: 'A',
        classRank: 5,
        attendance: 94,
        classTeacherRemark: 'Consistent performer. Shows leadership qualities in group activities.',
        principalRemark: 'Commendable performance throughout.',
        subjects: [
          { subject: 'Mathematics', marksObtained: 85, totalMarks: 100, grade: 'A', classAverage: 75, rank: 4, trend: 'up', teacherRemark: 'Excellent problem-solving skills.', attendance: 94 },
          { subject: 'English', marksObtained: 89, totalMarks: 100, grade: 'A+', classAverage: 77, rank: 2, trend: 'up', teacherRemark: 'Outstanding literature analysis.', attendance: 95 },
          { subject: 'Science', marksObtained: 86, totalMarks: 100, grade: 'A', classAverage: 73, rank: 3, trend: 'up', teacherRemark: 'Excellent experiment design and execution.', attendance: 93 },
          { subject: 'Social Studies', marksObtained: 87, totalMarks: 100, grade: 'A', classAverage: 76, rank: 3, trend: 'up', teacherRemark: 'Thoughtful answers. Good critical thinking.', attendance: 92 },
          { subject: 'Hindi', marksObtained: 83, totalMarks: 100, grade: 'A-', classAverage: 78, rank: 9, trend: 'up', teacherRemark: 'Much improved. Good creative writing.', attendance: 95 },
          { subject: 'Computer Science', marksObtained: 93, totalMarks: 100, grade: 'A+', classAverage: 80, rank: 1, trend: 'up', teacherRemark: 'Top performer. Won school coding competition!', attendance: 96 },
          { subject: 'Physical Education', marksObtained: 93, totalMarks: 100, grade: 'A+', classAverage: 84, rank: 1, trend: 'stable', teacherRemark: 'Consistent excellence in sports.', attendance: 97 },
          { subject: 'Art & Craft', marksObtained: 89, totalMarks: 100, grade: 'A', classAverage: 82, rank: 2, trend: 'up', teacherRemark: 'Innovative designs. Very talented.', attendance: 93 }
        ]
      },
      {
        id: 'rc4',
        term: 'Term 4',
        academicYear: '2024-25',
        dateIssued: '31 Mar 2025',
        overallPercentage: 87,
        overallGrade: 'A',
        classRank: 5,
        attendance: 94,
        classTeacherRemark: 'Outstanding year overall. Ready for board exams next year!',
        principalRemark: 'Proud of your achievements. Keep it up!',
        subjects: [
          { subject: 'Mathematics', marksObtained: 87, totalMarks: 100, grade: 'A', classAverage: 76, rank: 3, trend: 'up', teacherRemark: 'Ready for advanced mathematics. Excellent!', attendance: 95 },
          { subject: 'English', marksObtained: 90, totalMarks: 100, grade: 'A+', classAverage: 78, rank: 1, trend: 'up', teacherRemark: 'Top of the class! Brilliant communicator.', attendance: 96 },
          { subject: 'Science', marksObtained: 88, totalMarks: 100, grade: 'A', classAverage: 74, rank: 2, trend: 'up', teacherRemark: 'Science project won inter-school competition!', attendance: 94 },
          { subject: 'Social Studies', marksObtained: 88, totalMarks: 100, grade: 'A', classAverage: 77, rank: 2, trend: 'up', teacherRemark: 'Excellent understanding of concepts.', attendance: 93 },
          { subject: 'Hindi', marksObtained: 84, totalMarks: 100, grade: 'A-', classAverage: 79, rank: 8, trend: 'up', teacherRemark: 'Consistent improvement throughout the year.', attendance: 96 },
          { subject: 'Computer Science', marksObtained: 95, totalMarks: 100, grade: 'A+', classAverage: 81, rank: 1, trend: 'up', teacherRemark: 'Exceptional talent. Consider coding competitions.', attendance: 97 },
          { subject: 'Physical Education', marksObtained: 94, totalMarks: 100, grade: 'A+', classAverage: 85, rank: 1, trend: 'up', teacherRemark: 'State level qualifier in athletics!', attendance: 98 },
          { subject: 'Art & Craft', marksObtained: 90, totalMarks: 100, grade: 'A+', classAverage: 83, rank: 1, trend: 'up', teacherRemark: 'Outstanding portfolio. Art exhibition winner.', attendance: 94 }
        ]
      }
    ],
    '2': [
      {
        id: 'rc5',
        term: 'Term 4',
        academicYear: '2024-25',
        dateIssued: '31 Mar 2025',
        overallPercentage: 92,
        overallGrade: 'A+',
        classRank: 2,
        attendance: 96,
        classTeacherRemark: 'Exceptional student. Consistently performs at the top level.',
        principalRemark: 'Outstanding performance. Keep shining!',
        subjects: [
          { subject: 'Mathematics', marksObtained: 94, totalMarks: 100, grade: 'A+', classAverage: 78, rank: 2, trend: 'up', teacherRemark: 'Brilliant mathematical mind.', attendance: 97 },
          { subject: 'English', marksObtained: 93, totalMarks: 100, grade: 'A+', classAverage: 80, rank: 1, trend: 'stable', teacherRemark: 'Outstanding language skills.', attendance: 96 },
          { subject: 'Science', marksObtained: 92, totalMarks: 100, grade: 'A+', classAverage: 76, rank: 2, trend: 'up', teacherRemark: 'Curious and engaged learner.', attendance: 95 },
          { subject: 'Social Studies', marksObtained: 91, totalMarks: 100, grade: 'A+', classAverage: 77, rank: 2, trend: 'up', teacherRemark: 'Excellent general knowledge.', attendance: 96 },
          { subject: 'Hindi', marksObtained: 90, totalMarks: 100, grade: 'A+', classAverage: 81, rank: 3, trend: 'stable', teacherRemark: 'Very good language proficiency.', attendance: 97 },
          { subject: 'Computer Science', marksObtained: 96, totalMarks: 100, grade: 'A+', classAverage: 82, rank: 1, trend: 'up', teacherRemark: 'Young coding prodigy!', attendance: 98 }
        ]
      }
    ]
  };

  const achievements: { [key: string]: Achievement[] } = {
    '1': [
      { id: 'a1', title: 'School Coding Competition - 1st Place', category: 'academic', date: 'Dec 2024', description: 'Won first prize in inter-school coding hackathon' },
      { id: 'a2', title: 'District Athletics - 100m Sprint Champion', category: 'sports', date: 'Sep 2024', description: 'Gold medal in district level athletics meet' },
      { id: 'a3', title: 'Science Project Exhibition - Best Project', category: 'academic', date: 'Feb 2025', description: 'Won best project award for renewable energy model' },
      { id: 'a4', title: 'Art Competition - Merit Award', category: 'cultural', date: 'Jan 2025', description: 'Selected for state-level art exhibition' }
    ],
    '2': [
      { id: 'a5', title: 'Mathematics Olympiad - Gold Medal', category: 'academic', date: 'Nov 2024', description: 'Secured gold medal in regional mathematics olympiad' },
      { id: 'a6', title: 'Young Coder Award', category: 'academic', date: 'Jan 2025', description: 'Recognized for exceptional programming skills' },
      { id: 'a7', title: 'School Captain', category: 'leadership', date: 'Apr 2024', description: 'Elected as school head girl for academic year 2024-25' }
    ]
  };

  const aiInsights: { [key: string]: AIInsight } = {
    '1': {
      summary: "Based on Aarav's Term 4 performance analysis, our AI identifies exceptional potential with strategic improvement opportunities. Overall trajectory shows consistent upward trend across 4 terms.",
      strengths: [
        'Computer Science excellence (95/100) - Ranked #1, exceptional coding skills',
        'Strong improvement in Mathematics (+9 marks from Term 1 to Term 4)',
        'Consistent top performer in Physical Education and Art & Craft',
        'English language skills - Top of class with outstanding writing ability'
      ],
      weaknesses: [
        'Hindi performance (84/100) - Rank #8, below potential based on other subjects',
        'Mathematics geometry concepts need focused practice',
        'Science lab work execution could be improved for practical exams'
      ],
      recommendations: [
        'Enroll in advanced Computer Science program to leverage natural talent',
        'Allocate 2 hours/week for Hindi language tutoring focusing on grammar',
        'Join mathematics problem-solving workshops for geometry mastery',
        'Participate in coding competitions (high probability of success)',
        'Consider STEM career counseling given strong science-tech aptitude'
      ],
      predictions: {
        nextTermGPA: 8.9,
        rankPrediction: 3,
        boardExamPrediction: 'On track for 90%+ in Class 12 boards if current trajectory continues. Predicted aggregate: 92-94%'
      },
      studyPlan: [
        {
          subject: 'Hindi',
          hoursPerWeek: 2,
          focus: ['Grammar fundamentals', 'Essay writing practice', 'Read Hindi newspapers daily'],
          resources: ['Hindi Grammar Workbook by R.K. Sharma', 'Daily 15-min Hindi news', 'One Hindi story per week']
        },
        {
          subject: 'Mathematics',
          hoursPerWeek: 3,
          focus: ['Geometry proofs and theorems', 'Mensuration word problems', 'Daily practice problems'],
          resources: ['Khan Academy Geometry Module', 'R.D. Sharma Class 10', '30 mins daily practice after school']
        },
        {
          subject: 'Science',
          hoursPerWeek: 2,
          focus: ['Lab experiment techniques', 'Practical exam preparation', 'Theory-practical correlation'],
          resources: ['Lab manual comprehensive reading', 'YouTube: Science practical demonstrations', 'Weekly lab practice sessions']
        }
      ]
    },
    '2': {
      summary: "Diya demonstrates exceptional academic excellence across all subjects with consistent top-tier performance. AI analysis shows sustained high achievement with minimal intervention needed.",
      strengths: [
        'Overall academic excellence (92% aggregate) - Rank #2',
        'Computer Science prodigy (96/100) - Natural programming talent',
        'Mathematics exceptional performance (94/100)',
        'Consistent 90+ scores across all subjects'
      ],
      weaknesses: [
        'Minor opportunity in English to reach #1 position',
        'Can optimize study time allocation for better work-life balance'
      ],
      recommendations: [
        'Challenge with advanced placement courses',
        'Participate in national-level olympiads (Math, Science, Coding)',
        'Explore leadership opportunities - already School Captain',
        'Consider mentoring peers in Computer Science',
        'Maintain current excellence while exploring extra-curricular depth'
      ],
      predictions: {
        nextTermGPA: 9.4,
        rankPrediction: 1,
        boardExamPrediction: 'Extremely high probability of 95%+ in boards. Potential for 98%+ with current momentum.'
      },
      studyPlan: [
        {
          subject: 'English',
          hoursPerWeek: 1.5,
          focus: ['Advanced literature analysis', 'Creative writing enhancement'],
          resources: ['Classic literature reading', 'Writing competitions']
        },
        {
          subject: 'Advanced Topics',
          hoursPerWeek: 3,
          focus: ['Olympiad preparation', 'Competitive programming', 'Advanced mathematics'],
          resources: ['Codeforces practice', 'Mathematics olympiad books', 'Online courses']
        }
      ]
    }
  };

  const aiAlerts: { [key: string]: AIAlert[] } = {
    '1': [
      {
        id: 'alert1',
        type: 'warning',
        title: 'Attendance Impact Detected',
        message: 'Mathematics attendance dropped from 98% (Term 2) to 95% (Term 4). AI correlation analysis shows 1% attendance drop ≈ 0.5 marks impact on performance.',
        priority: 'medium',
        actionable: true,
        action: 'Monitor attendance closely'
      },
      {
        id: 'alert2',
        type: 'success',
        title: 'Exceptional Improvement Trajectory',
        message: 'Computer Science shows remarkable progress: +7 marks improvement over 3 terms (88→91→93→95). AI predicts continued excellence.',
        priority: 'low',
        actionable: false
      },
      {
        id: 'alert3',
        type: 'info',
        title: 'Rank Advancement Opportunity',
        message: 'Currently #5 with 87%. Gap to Rank #3 is only 4.2 marks average. Focused effort in Hindi (+6 marks) and Mathematics (+3 marks) can achieve this by next term.',
        priority: 'high',
        actionable: true,
        action: 'View AI Study Plan'
      },
      {
        id: 'alert4',
        type: 'success',
        title: 'Consistent Excellence Maintained',
        message: 'Physical Education: Maintained #1 rank for 3 consecutive terms. Outstanding athletic performance recognized at district level.',
        priority: 'low',
        actionable: false
      }
    ],
    '2': [
      {
        id: 'alert5',
        type: 'success',
        title: 'Top Tier Performance',
        message: 'Diya maintains exceptional 92% aggregate with #2 rank. All subjects above 90 marks - outstanding consistency.',
        priority: 'low',
        actionable: false
      },
      {
        id: 'alert6',
        type: 'info',
        title: 'Leadership Excellence',
        message: 'As School Captain, leadership skills complement academic excellence. AI suggests exploring advanced leadership programs.',
        priority: 'medium',
        actionable: true,
        action: 'Explore Programs'
      }
    ]
  };

  const aiSubjectAnalysis: { [key: string]: { [subject: string]: AISubjectAnalysis } } = {
    '1': {
      'Mathematics': {
        subject: 'Mathematics',
        topicBreakdown: [
          { topic: 'Algebra', performance: 95, status: 'excellent' },
          { topic: 'Trigonometry', performance: 88, status: 'good' },
          { topic: 'Geometry', performance: 72, status: 'needs-work' },
          { topic: 'Mensuration', performance: 65, status: 'critical' },
          { topic: 'Statistics', performance: 90, status: 'excellent' }
        ],
        marksLostIn: ['12 marks in geometry proofs', '8 marks in mensuration word problems', '5 marks in calculation errors'],
        suggestions: [
          'Focus on geometry theorem applications - practice 5 problems daily',
          'Mensuration formulas need memorization and application practice',
          'Use step-by-step approach to minimize calculation errors',
          'Recommended: Join weekend geometry workshop'
        ],
        predictedImprovement: 15
      },
      'Hindi': {
        subject: 'Hindi',
        topicBreakdown: [
          { topic: 'Reading Comprehension', performance: 90, status: 'excellent' },
          { topic: 'Grammar', performance: 75, status: 'needs-work' },
          { topic: 'Essay Writing', performance: 85, status: 'good' },
          { topic: 'Literature', performance: 82, status: 'good' }
        ],
        marksLostIn: ['10 marks in grammar rules', '6 marks in sentence formation', '4 marks in vocabulary'],
        suggestions: [
          'Daily grammar practice - 20 minutes',
          'Read Hindi newspapers to improve vocabulary',
          'Practice essay writing weekly with teacher review',
          'Grammar workbook completion recommended'
        ],
        predictedImprovement: 10
      }
    }
  };

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];
  const currentReports = reportCards[selectedStudent] || [];
  const currentReport = currentReports.find(r => r.id === selectedTerm) || currentReports[currentReports.length - 1];
  const currentAchievements = achievements[selectedStudent] || [];

  // Animated stats
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedGPA(prev => prev < currentStudent.currentGPA ? Math.min(prev + 0.1, currentStudent.currentGPA) : currentStudent.currentGPA);
      setAnimatedRank(prev => prev < currentStudent.classRank ? prev + 1 : currentStudent.classRank);
      setAnimatedAttendance(prev => prev < currentStudent.attendance ? prev + 1 : currentStudent.attendance);
    }, 20);
    return () => clearInterval(interval);
  }, [currentStudent]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A+')) return '#10ac8b';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#f59e0b';
    if (grade.startsWith('C')) return '#f97316';
    return '#ef4444';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return { icon: '↑', color: '#10ac8b' };
    if (trend === 'down') return { icon: '↓', color: '#ef4444' };
    return { icon: '→', color: '#6b7280' };
  };

  const currentAIInsights = aiInsights[selectedStudent];
  const currentAIAlerts = aiAlerts[selectedStudent]?.filter(alert => !dismissedAlerts.includes(alert.id)) || [];

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handler Functions
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsDownloading(false);
      showToast(`${currentReport?.term} Report Card downloaded successfully!`, 'success');
      // In real implementation, use libraries like jsPDF or html2pdf.js
      console.log('Downloading PDF for:', currentReport?.term, currentStudent.name);
    }, 1500);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      showToast('Print dialog opened', 'info');
    }, 300);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleSchedulePTM = () => {
    setShowPTMModal(true);
  };

  const handleMessageTeachers = () => {
    setShowMessageModal(true);
  };

  const handleDownloadAllReports = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast('All reports downloaded successfully!', 'success');
      console.log('Downloading all reports for:', currentStudent.name);
    }, 2000);
  };

  const handleRequestTutoring = () => {
    setShowTutoringModal(true);
  };

  const handleAlertAction = (action: string) => {
    if (action === 'View AI Study Plan') {
      // Smooth scroll to study plan section
      const studyPlanSection = document.querySelector('.study-plan-section');
      if (studyPlanSection) {
        studyPlanSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Showing personalized study plan', 'info');
      }
    } else if (action === 'Monitor attendance closely') {
      showToast('Attendance monitoring alert noted', 'info');
    } else if (action === 'Explore Programs') {
      showToast('Leadership programs coming soon!', 'info');
    }
  };

  const handleShareOption = (option: 'email' | 'whatsapp' | 'copy') => {
    const reportLink = `https://edgeup.app/reports/${selectedStudent}/${selectedTerm}`;

    if (option === 'email') {
      const subject = `Report Card - ${currentStudent.name} - ${currentReport?.term}`;
      const body = `View the report card for ${currentStudent.name} (${currentReport?.term}): ${reportLink}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast('Opening email client...', 'info');
    } else if (option === 'whatsapp') {
      const text = `Report Card for ${currentStudent.name} - ${currentReport?.term}: ${reportLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      showToast('Opening WhatsApp...', 'info');
    } else if (option === 'copy') {
      navigator.clipboard.writeText(reportLink);
      showToast('Link copied to clipboard!', 'success');
    }
    setShowShareModal(false);
  };

  const handleSubmitPTM = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('PTM scheduled successfully! You will receive a confirmation email.', 'success');
    setShowPTMModal(false);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message sent successfully to teacher(s)!', 'success');
    setShowMessageModal(false);
  };

  const handleSubmitTutoring = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Tutoring request submitted! We will contact you within 24 hours.', 'success');
    setShowTutoringModal(false);
  };

  const handleViewDetails = (subject: SubjectPerformance) => {
    setSelectedSubjectForModal(subject);
    setShowDetailsModal(true);
  };

  return (
    <div className="progress-reports-page">
      {/* Notification Bell Icon */}
      {currentAIAlerts.length > 0 && (
        <div className="notification-bell-container">
          <button
            className="notification-bell-btn"
            onClick={() => setShowAlerts(!showAlerts)}
            title="View notifications"
          >
            <i className="fas fa-bell"></i>
            <span className="notification-count">{currentAIAlerts.length}</span>
          </button>
        </div>
      )}

      {/* AI Alerts Banner - Show only when bell is clicked */}
      {showAlerts && currentAIAlerts.length > 0 && (
        <div className="ai-alerts-banner">
          <div className="alerts-banner-header">
            <h3>
              <i className="fas fa-bell"></i>
              Notifications ({currentAIAlerts.length})
            </h3>
            <button className="close-alerts-btn" onClick={() => setShowAlerts(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          {currentAIAlerts.map(alert => (
            <div key={alert.id} className={`ai-alert ${alert.type} ${alert.priority}`}>
              <div className="alert-icon">
                {alert.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                {alert.type === 'success' && <i className="fas fa-check-circle"></i>}
                {alert.type === 'info' && <i className="fas fa-info-circle"></i>}
              </div>
              <div className="alert-content">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
                {alert.actionable && alert.action && (
                  <button className="alert-action-btn" onClick={() => handleAlertAction(alert.action!)}>{alert.action}</button>
                )}
              </div>
              <button className="alert-dismiss" onClick={() => dismissAlert(alert.id)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Student Selector */}
      <div className="student-selector-section">
        <div className="selector-header">
          <div className="selector-left">
            <i className="fas fa-user-graduate"></i>
            <div>
              <label>Select Child</label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - Class {student.class}{student.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="quick-stats">
            <div className="quick-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10ac8b 0%, #059669 100%)' }}>
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <h3>{animatedGPA.toFixed(1)}</h3>
                <p>Current GPA</p>
              </div>
            </div>
            <div className="quick-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #094d88 0%, #0c5fa3 100%)' }}>
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-content">
                <h3>#{animatedRank}</h3>
                <p>Class Rank</p>
              </div>
            </div>
            <div className="quick-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h3>{animatedAttendance}%</h3>
                <p>Attendance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Insights Panel */}
      {showAIInsights && currentAIInsights && (
        <div className="ai-insights-panel">
          <div className="insights-header">
            <div className="insights-title">
              <i className="fas fa-brain"></i>
              <h2>Performance Insights</h2>
            </div>
            <button className="toggle-insights-btn" onClick={() => setShowAIInsights(false)}>
              <i className="fas fa-eye-slash"></i>
              Hide Insights
            </button>
          </div>

          <div className="insights-summary">
            <p>{currentAIInsights.summary}</p>
          </div>

          <div className="insights-grid">
            {/* Strengths */}
            <div className="insight-card strengths">
              <div className="insight-card-header">
                <i className="fas fa-thumbs-up"></i>
                <h3>Key Strengths</h3>
              </div>
              <ul className="insight-list">
                {currentAIInsights.strengths.map((strength, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="insight-card weaknesses">
              <div className="insight-card-header">
                <i className="fas fa-chart-line"></i>
                <h3>Growth Opportunities</h3>
              </div>
              <ul className="insight-list">
                {currentAIInsights.weaknesses.map((weakness, index) => (
                  <li key={index}>
                    <i className="fas fa-arrow-up"></i>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="insight-card recommendations">
              <div className="insight-card-header">
                <i className="fas fa-lightbulb"></i>
                <h3>Recommended Actions</h3>
              </div>
              <ul className="insight-list">
                {currentAIInsights.recommendations.map((rec, index) => (
                  <li key={index}>
                    <i className="fas fa-star"></i>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Predictions */}
            <div className="insight-card predictions">
              <div className="insight-card-header">
                <i className="fas fa-crystal-ball"></i>
                <h3>Future Projections</h3>
              </div>
              <div className="predictions-content">
                <div className="prediction-item">
                  <span className="prediction-label">Next Term GPA:</span>
                  <span className="prediction-value">{currentAIInsights.predictions.nextTermGPA}</span>
                </div>
                <div className="prediction-item">
                  <span className="prediction-label">Predicted Rank:</span>
                  <span className="prediction-value">#{currentAIInsights.predictions.rankPrediction}</span>
                </div>
                <div className="prediction-board">
                  <span className="prediction-label">Board Exam Outlook:</span>
                  <p>{currentAIInsights.predictions.boardExamPrediction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Study Plan */}
          <div className="study-plan-section">
            <div className="study-plan-header">
              <i className="fas fa-tasks"></i>
              <h3>Personalized Study Plan</h3>
            </div>
            <div className="study-plan-grid">
              {currentAIInsights.studyPlan.map((plan, index) => (
                <div key={index} className="study-plan-card">
                  <div className="plan-header">
                    <h4>{plan.subject}</h4>
                    <span className="hours-badge">{plan.hoursPerWeek} hrs/week</span>
                  </div>
                  <div className="plan-focus">
                    <h5>Focus Areas:</h5>
                    <ul>
                      {plan.focus.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-resources">
                    <h5>Recommended Resources:</h5>
                    <ul>
                      {plan.resources.map((resource, idx) => (
                        <li key={idx}>
                          <i className="fas fa-book"></i>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showAIInsights && (
        <div className="show-insights-prompt">
          <button className="show-insights-btn" onClick={() => setShowAIInsights(true)}>
            <i className="fas fa-brain"></i>
            Show Performance Insights
          </button>
        </div>
      )}

      {/* Report Cards Overview */}
      <div className="report-cards-section">
        <div className="section-header">
          <div className="section-title">
            <i className="fas fa-file-alt"></i>
            <h2>Report Cards - Academic Year {currentReport?.academicYear}</h2>
          </div>
          <div className="term-selector">
            <label>Select Term:</label>
            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
              {currentReports.map(report => (
                <option key={report.id} value={report.id}>{report.term}</option>
              ))}
            </select>
          </div>
        </div>

        {currentReport && (
          <div className="current-report-card">
            <div className="report-card-header">
              <div className="report-info">
                <h3>{currentReport.term} Report Card</h3>
                <p>Issued on: {currentReport.dateIssued}</p>
              </div>
              <div className="report-actions">
                <button className="action-btn download" onClick={handleDownloadPDF} disabled={isDownloading}>
                  <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'download'}`}></i>
                  {isDownloading ? 'Downloading...' : 'Download PDF'}
                </button>
                <button className="action-btn print" onClick={handlePrint} disabled={isPrinting}>
                  <i className={`fas fa-${isPrinting ? 'spinner fa-spin' : 'print'}`}></i>
                  {isPrinting ? 'Printing...' : 'Print'}
                </button>
                <button className="action-btn share" onClick={handleShare}>
                  <i className="fas fa-share-alt"></i>
                  Share
                </button>
              </div>
            </div>

            <div className="report-summary">
              <div className="summary-card overall">
                <div className="summary-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="summary-content">
                  <h4>Overall Performance</h4>
                  <div className="performance-value">
                    <span className="percentage" style={{ color: getGradeColor(currentReport.overallGrade) }}>
                      {currentReport.overallPercentage}%
                    </span>
                    <span className="grade" style={{ background: getGradeColor(currentReport.overallGrade) }}>
                      {currentReport.overallGrade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="summary-card rank">
                <div className="summary-icon">
                  <i className="fas fa-medal"></i>
                </div>
                <div className="summary-content">
                  <h4>Class Rank</h4>
                  <div className="rank-value">
                    <span className="rank-number">#{currentReport.classRank}</span>
                    <span className="rank-total">out of {currentStudent.totalStudents}</span>
                  </div>
                </div>
              </div>

              <div className="summary-card attendance">
                <div className="summary-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="summary-content">
                  <h4>Attendance</h4>
                  <div className="attendance-value">
                    <span className="attendance-percent">{currentReport.attendance}%</span>
                    <div className="attendance-bar">
                      <div className="attendance-fill" style={{ width: `${currentReport.attendance}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subject-wise Performance */}
      {currentReport && (
        <div className="subjects-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-book"></i>
              <h2>Subject-wise Performance</h2>
            </div>
          </div>

          <div className="subjects-grid">
            {currentReport.subjects.map((subject, index) => {
              const trend = getTrendIcon(subject.trend);
              return (
                <div key={index} className="subject-card">
                  <div className="subject-header">
                    <h4>{subject.subject}</h4>
                    <span className="subject-grade" style={{ background: getGradeColor(subject.grade) }}>
                      {subject.grade}
                    </span>
                  </div>

                  <div className="subject-scores">
                    <div className="score-main">
                      <span className="marks">{subject.marksObtained}</span>
                      <span className="total">/ {subject.totalMarks}</span>
                    </div>
                    <div className="score-stats">
                      <div className="stat-item">
                        <span className="stat-label">Class Avg</span>
                        <span className="stat-value">{subject.classAverage}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">#{subject.rank}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Trend</span>
                        <span className="stat-value" style={{ color: trend.color }}>
                          {trend.icon}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(subject.marksObtained / subject.totalMarks) * 100}%`,
                          background: getGradeColor(subject.grade)
                        }}
                      ></div>
                    </div>
                    <div className="attendance-indicator">
                      <i className="fas fa-user-clock"></i>
                      <span>{subject.attendance}% attendance</span>
                    </div>
                  </div>

                  <div className="teacher-remark">
                    <i className="fas fa-comment-dots"></i>
                    <p>{subject.teacherRemark}</p>
                  </div>

                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(subject)}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Comparison Widget */}
      {currentReport && (
        <div className="comparison-widget">
          <div className="widget-header">
            <i className="fas fa-chart-bar"></i>
            <h3>Performance vs Class Average</h3>
          </div>
          <div className="comparison-chart">
            {currentReport.subjects.map((subject, index) => {
              const difference = subject.marksObtained - subject.classAverage;
              const isAbove = difference >= 0;
              return (
                <div key={index} className="comparison-item">
                  <div className="comparison-subject">
                    <span className="subject-name">{subject.subject}</span>
                    <span className={`difference ${isAbove ? 'positive' : 'negative'}`}>
                      {isAbove ? '+' : ''}{difference.toFixed(1)}
                    </span>
                  </div>
                  <div className="comparison-bars">
                    <div className="bar-container">
                      <div className="bar-label">Student</div>
                      <div className="bar-wrapper">
                        <div
                          className="bar student-bar"
                          style={{
                            width: `${(subject.marksObtained / subject.totalMarks) * 100}%`,
                            background: getGradeColor(subject.grade)
                          }}
                        ></div>
                        <span className="bar-value">{subject.marksObtained}</span>
                      </div>
                    </div>
                    <div className="bar-container">
                      <div className="bar-label">Class Avg</div>
                      <div className="bar-wrapper">
                        <div
                          className="bar class-bar"
                          style={{ width: `${(subject.classAverage / subject.totalMarks) * 100}%` }}
                        ></div>
                        <span className="bar-value">{subject.classAverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="comparison-summary">
            <div className="summary-stat">
              <i className="fas fa-arrow-up"></i>
              <span>
                Above average in <strong>{currentReport.subjects.filter(s => s.marksObtained >= s.classAverage).length}</strong> subjects
              </span>
            </div>
            <div className="summary-stat">
              <i className="fas fa-trophy"></i>
              <span>
                Top 3 rank in <strong>{currentReport.subjects.filter(s => s.rank <= 3).length}</strong> subjects
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Remarks Section */}
      {currentReport && (
        <div className="remarks-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-comments"></i>
              <h2>Teacher Remarks & Feedback</h2>
            </div>
          </div>

          <div className="remarks-grid">
            <div className="remark-card class-teacher">
              <div className="remark-header">
                <div className="teacher-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div>
                  <h4>Class Teacher's Remark</h4>
                  <p className="teacher-name">Mrs. Priya Mehta</p>
                </div>
              </div>
              <div className="remark-content">
                <p>{currentReport.classTeacherRemark}</p>
              </div>
            </div>

            <div className="remark-card principal">
              <div className="remark-header">
                <div className="teacher-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h4>Principal's Remark</h4>
                  <p className="teacher-name">Dr. Rajesh Kumar</p>
                </div>
              </div>
              <div className="remark-content">
                <p>{currentReport.principalRemark}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {currentAchievements.length > 0 && (
        <div className="achievements-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-award"></i>
              <h2>Achievements & Awards</h2>
            </div>
          </div>

          <div className="achievements-grid">
            {currentAchievements.map(achievement => (
              <div key={achievement.id} className={`achievement-card ${achievement.category}`}>
                <div className="achievement-icon">
                  {achievement.category === 'academic' && <i className="fas fa-graduation-cap"></i>}
                  {achievement.category === 'sports' && <i className="fas fa-running"></i>}
                  {achievement.category === 'cultural' && <i className="fas fa-palette"></i>}
                  {achievement.category === 'leadership' && <i className="fas fa-star"></i>}
                </div>
                <div className="achievement-content">
                  <h4>{achievement.title}</h4>
                  <p className="achievement-date">{achievement.date}</p>
                  <p className="achievement-desc">{achievement.description}</p>
                </div>
                <span className={`achievement-badge ${achievement.category}`}>
                  {achievement.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={handleSchedulePTM}>
            <i className="fas fa-calendar-alt"></i>
            <span>Schedule PTM</span>
          </button>
          <button className="action-card" onClick={handleMessageTeachers}>
            <i className="fas fa-envelope"></i>
            <span>Message Teachers</span>
          </button>
          <button className="action-card" onClick={handleDownloadAllReports} disabled={isDownloading}>
            <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'download'}`}></i>
            <span>{isDownloading ? 'Downloading...' : 'Download All Reports'}</span>
          </button>
          <button className="action-card" onClick={handleRequestTutoring}>
            <i className="fas fa-user-plus"></i>
            <span>Request Tutoring</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
          </div>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Report Card</h3>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Share {currentStudent.name}'s {currentReport?.term} Report Card</p>
              <div className="share-options">
                <button className="share-option email" onClick={() => handleShareOption('email')}>
                  <i className="fas fa-envelope"></i>
                  <span>Email</span>
                </button>
                <button className="share-option whatsapp" onClick={() => handleShareOption('whatsapp')}>
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp</span>
                </button>
                <button className="share-option copy" onClick={() => handleShareOption('copy')}>
                  <i className="fas fa-link"></i>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PTM Modal */}
      {showPTMModal && (
        <div className="modal-overlay" onClick={() => setShowPTMModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Parent-Teacher Meeting</h3>
              <button className="modal-close" onClick={() => setShowPTMModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitPTM}>
                <div className="form-group">
                  <label>Student</label>
                  <input type="text" value={currentStudent.name} disabled />
                </div>
                <div className="form-group">
                  <label>Select Teacher</label>
                  <select required>
                    <option value="">Choose teacher...</option>
                    <option value="class">Class Teacher - Mrs. Priya Mehta</option>
                    <option value="math">Mathematics - Mr. Rajesh Kumar</option>
                    <option value="english">English - Ms. Sarah Johnson</option>
                    <option value="science">Science - Dr. Amit Patel</option>
                    <option value="hindi">Hindi - Mrs. Meera Sharma</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select required>
                    <option value="">Choose time...</option>
                    <option value="9am">9:00 AM - 10:00 AM</option>
                    <option value="10am">10:00 AM - 11:00 AM</option>
                    <option value="11am">11:00 AM - 12:00 PM</option>
                    <option value="2pm">2:00 PM - 3:00 PM</option>
                    <option value="3pm">3:00 PM - 4:00 PM</option>
                    <option value="4pm">4:00 PM - 5:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purpose of Meeting</label>
                  <textarea required placeholder="Briefly describe what you'd like to discuss..." rows={3}></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowPTMModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Message Teachers Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message Teachers</h3>
              <button className="modal-close" onClick={() => setShowMessageModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitMessage}>
                <div className="form-group">
                  <label>Student</label>
                  <input type="text" value={currentStudent.name} disabled />
                </div>
                <div className="form-group">
                  <label>Select Teacher(s)</label>
                  <select required multiple size={5}>
                    <option value="class">Class Teacher - Mrs. Priya Mehta</option>
                    <option value="math">Mathematics - Mr. Rajesh Kumar</option>
                    <option value="english">English - Ms. Sarah Johnson</option>
                    <option value="science">Science - Dr. Amit Patel</option>
                    <option value="hindi">Hindi - Mrs. Meera Sharma</option>
                    <option value="cs">Computer Science - Mr. Arjun Singh</option>
                    <option value="pe">Physical Education - Coach Vikram</option>
                    <option value="art">Art & Craft - Ms. Kavita Reddy</option>
                  </select>
                  <small>Hold Ctrl (Cmd on Mac) to select multiple teachers</small>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" required placeholder="Message subject..." />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea required placeholder="Type your message here..." rows={5}></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowMessageModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tutoring Request Modal */}
      {showTutoringModal && (
        <div className="modal-overlay" onClick={() => setShowTutoringModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Tutoring</h3>
              <button className="modal-close" onClick={() => setShowTutoringModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitTutoring}>
                <div className="form-group">
                  <label>Student</label>
                  <input type="text" value={currentStudent.name} disabled />
                </div>
                <div className="form-group">
                  <label>Subject(s) Needed</label>
                  <select required multiple size={5}>
                    <option value="math">Mathematics</option>
                    <option value="english">English</option>
                    <option value="science">Science</option>
                    <option value="social">Social Studies</option>
                    <option value="hindi">Hindi</option>
                    <option value="cs">Computer Science</option>
                  </select>
                  <small>Hold Ctrl (Cmd on Mac) to select multiple subjects</small>
                </div>
                <div className="form-group">
                  <label>Preferred Schedule</label>
                  <select required>
                    <option value="">Choose schedule...</option>
                    <option value="weekday-morning">Weekday Mornings</option>
                    <option value="weekday-afternoon">Weekday Afternoons</option>
                    <option value="weekday-evening">Weekday Evenings</option>
                    <option value="weekend">Weekends</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sessions per Week</label>
                  <select required>
                    <option value="">Choose frequency...</option>
                    <option value="1">1 session per week</option>
                    <option value="2">2 sessions per week</option>
                    <option value="3">3 sessions per week</option>
                    <option value="4">4 sessions per week</option>
                    <option value="5">5 sessions per week</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Additional Requirements</label>
                  <textarea placeholder="Any specific requirements or concerns..." rows={3}></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowTutoringModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subject Details Modal */}
      {showDetailsModal && selectedSubjectForModal && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h3>{selectedSubjectForModal.subject} - Detailed Analysis</h3>
                <div className="modal-header-stats">
                  <span className="modal-grade" style={{ background: getGradeColor(selectedSubjectForModal.grade) }}>
                    {selectedSubjectForModal.grade}
                  </span>
                  <span className="modal-marks">
                    {selectedSubjectForModal.marksObtained}/{selectedSubjectForModal.totalMarks}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body modal-body-details">
              {/* Performance Overview */}
              <div className="details-section">
                <h4><i className="fas fa-chart-line"></i> Performance Overview</h4>
                <div className="details-stats-grid">
                  <div className="detail-stat-card">
                    <span className="stat-label">Your Marks</span>
                    <span className="stat-value large">{selectedSubjectForModal.marksObtained}</span>
                  </div>
                  <div className="detail-stat-card">
                    <span className="stat-label">Class Average</span>
                    <span className="stat-value">{selectedSubjectForModal.classAverage}</span>
                  </div>
                  <div className="detail-stat-card">
                    <span className="stat-label">Class Rank</span>
                    <span className="stat-value">#{selectedSubjectForModal.rank}</span>
                  </div>
                  <div className="detail-stat-card">
                    <span className="stat-label">Attendance</span>
                    <span className="stat-value">{selectedSubjectForModal.attendance}%</span>
                  </div>
                </div>
                <div className="performance-comparison-bar">
                  <div className="comparison-label">Performance vs Class Average:</div>
                  <div className="comparison-bars-horizontal">
                    <div className="bar-item">
                      <span className="bar-name">You</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill student"
                          style={{
                            width: `${(selectedSubjectForModal.marksObtained / selectedSubjectForModal.totalMarks) * 100}%`,
                            background: getGradeColor(selectedSubjectForModal.grade)
                          }}
                        ></div>
                      </div>
                      <span className="bar-value">{selectedSubjectForModal.marksObtained}</span>
                    </div>
                    <div className="bar-item">
                      <span className="bar-name">Class Avg</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill average"
                          style={{ width: `${(selectedSubjectForModal.classAverage / selectedSubjectForModal.totalMarks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="bar-value">{selectedSubjectForModal.classAverage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Remark */}
              <div className="details-section">
                <h4><i className="fas fa-comment-dots"></i> Teacher's Feedback</h4>
                <div className="teacher-remark-box">
                  <p>{selectedSubjectForModal.teacherRemark}</p>
                </div>
              </div>

              {/* AI Analysis - Only if available */}
              {aiSubjectAnalysis[selectedStudent]?.[selectedSubjectForModal.subject] && (
                <>
                  {/* Topic Breakdown */}
                  <div className="details-section">
                    <h4><i className="fas fa-chart-pie"></i> Topic-wise Performance</h4>
                    <div className="topics-grid-modal">
                      {aiSubjectAnalysis[selectedStudent][selectedSubjectForModal.subject].topicBreakdown.map((topic, idx) => (
                        <div key={idx} className={`topic-item-modal ${topic.status}`}>
                          <div className="topic-header-modal">
                            <span className="topic-name">{topic.topic}</span>
                            <span className="topic-percentage">{topic.performance}%</span>
                          </div>
                          <div className="topic-bar-wrapper">
                            <div className="topic-bar">
                              <div
                                className="topic-bar-fill"
                                style={{ width: `${topic.performance}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`topic-status-badge ${topic.status}`}>
                            {topic.status === 'excellent' && '⭐ Excellent'}
                            {topic.status === 'good' && '✓ Good'}
                            {topic.status === 'needs-work' && '⚠ Needs Work'}
                            {topic.status === 'critical' && '❗ Critical'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marks Lost Analysis */}
                  <div className="details-section">
                    <h4><i className="fas fa-minus-circle"></i> Where Marks Were Lost</h4>
                    <ul className="marks-lost-list">
                      {aiSubjectAnalysis[selectedStudent][selectedSubjectForModal.subject].marksLostIn.map((item, idx) => (
                        <li key={idx}>
                          <i className="fas fa-exclamation-triangle"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvement Suggestions */}
                  <div className="details-section">
                    <h4><i className="fas fa-lightbulb"></i> Suggested Actions for Improvement</h4>
                    <ul className="suggestions-list">
                      {aiSubjectAnalysis[selectedStudent][selectedSubjectForModal.subject].suggestions.map((suggestion, idx) => (
                        <li key={idx}>
                          <i className="fas fa-check-circle"></i>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Predicted Improvement */}
                  <div className="details-section prediction-banner">
                    <div className="prediction-icon">
                      <i className="fas fa-trending-up"></i>
                    </div>
                    <div className="prediction-content">
                      <h4>Potential for Growth</h4>
                      <p>
                        With focused effort on the suggested areas, potential improvement of
                        <strong> +{aiSubjectAnalysis[selectedStudent][selectedSubjectForModal.subject].predictedImprovement} marks</strong> is achievable!
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Close Button */}
              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressReports;
