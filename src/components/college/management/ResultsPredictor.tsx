import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  enrollmentNo: string;
  department: string;
  year: number;
  semester: number;
  currentAverage: number;
}

interface PredictionResult {
  studentId: string;
  studentName: string;
  predictedScore: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  subjects: SubjectPrediction[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

interface SubjectPrediction {
  subject: string;
  currentScore: number;
  predictedScore: number;
  trend: 'improving' | 'stable' | 'declining';
  riskFactors: string[];
}

interface BoardTopper {
  id: string;
  name: string;
  year: number;
  boardScore: number;
  class: string;
  stream: string;
  subjects: {
    subject: string;
    score: number;
  }[];
  schoolRank: number;
  districtRank?: number;
  achievements: string[];
  studyPattern?: string;
  photo?: string;
}

interface ComparisonMetrics {
  scoreGap: number;
  percentile: number;
  similarToppers: BoardTopper[];
  subjectGaps: {
    subject: string;
    gap: number;
    topperAvgScore: number;
    studentScore: number;
  }[];
  improvementRequired: number;
  rankingPosition: number;
}

const ResultsPredictor = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Track action button states
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [progressTracking, setProgressTracking] = useState(false);

  // Comparison section states
  const [showComparison, setShowComparison] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetrics | null>(null);
  const [selectedTopperStream, setSelectedTopperStream] = useState<string>('all');

  // Animated pass prediction counter
  const [accuracy, setAccuracy] = useState(0);
  const targetAccuracy = 92;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAccuracy(Math.floor(targetAccuracy * progress));

      if (currentStep >= steps) {
        setAccuracy(targetAccuracy);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const students: Student[] = [
    { id: '1', name: 'Aarav Sharma', enrollmentNo: 'CS2021045', department: 'Computer Science Engineering', year: 4, semester: 7, currentAverage: 86 },
    { id: '2', name: 'Priya Patel', enrollmentNo: 'ME2022012', department: 'Mechanical Engineering', year: 3, semester: 5, currentAverage: 92 },
    { id: '3', name: 'Rohan Singh', enrollmentNo: 'EE2021089', department: 'Electrical Engineering', year: 4, semester: 8, currentAverage: 78 },
    { id: '4', name: 'Ananya Desai', enrollmentNo: 'IT2023034', department: 'Information Technology', year: 2, semester: 3, currentAverage: 88 },
    { id: '5', name: 'Vikram Reddy', enrollmentNo: 'CE2022067', department: 'Civil Engineering', year: 3, semester: 6, currentAverage: 85 },
    { id: '6', name: 'Ishita Kumar', enrollmentNo: 'CS2021078', department: 'Computer Science Engineering', year: 4, semester: 7, currentAverage: 94 }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate department-specific subjects
  const getDepartmentSubjects = (department: string, year: number, semester: number): SubjectPrediction[] => {
    const baseScore = 70 + Math.random() * 20;
    const variance = -5 + Math.random() * 10;

    const subjectsByDepartment: { [key: string]: string[] } = {
      'Computer Science Engineering': [
        'Data Structures',
        'Operating Systems',
        'Database Management',
        'Computer Networks',
        'Software Engineering'
      ],
      'Mechanical Engineering': [
        'Thermodynamics',
        'Fluid Mechanics',
        'Machine Design',
        'Manufacturing Processes',
        'Heat Transfer'
      ],
      'Electrical Engineering': [
        'Power Systems',
        'Electrical Machines',
        'Control Systems',
        'Power Electronics',
        'Electrical Circuits'
      ],
      'Information Technology': [
        'Web Technologies',
        'Software Testing',
        'Network Security',
        'Mobile Computing',
        'Cloud Computing'
      ],
      'Civil Engineering': [
        'Structural Analysis',
        'Geotechnical Engineering',
        'Transportation Engineering',
        'Environmental Engineering',
        'Construction Management'
      ]
    };

    const subjects = subjectsByDepartment[department] || subjectsByDepartment['Computer Science Engineering'];

    return subjects.map((subject, idx) => {
      const currentScore = baseScore + (idx * 2) - 5;
      const predictedScore = currentScore + variance;
      const trend: 'improving' | 'stable' | 'declining' =
        predictedScore > currentScore + 2 ? 'improving' :
        predictedScore < currentScore - 2 ? 'declining' : 'stable';

      const riskFactors: string[] = [];
      if (predictedScore < 60) {
        riskFactors.push('Below passing threshold', 'Requires immediate attention');
      } else if (predictedScore < 70) {
        riskFactors.push('Weak understanding of concepts', 'Additional practice needed');
      }

      return {
        subject,
        currentScore,
        predictedScore,
        trend,
        riskFactors
      };
    });
  };

  // Historical Board Toppers Data (2020-2024)
  const boardToppers: BoardTopper[] = [
    // 2024 Toppers
    {
      id: 'T1',
      name: 'Aryan Mehta',
      year: 2024,
      boardScore: 98.2,
      class: 'Class 12',
      stream: 'Science',
      subjects: [
        { subject: 'Mathematics', score: 100 },
        { subject: 'Physics', score: 98 },
        { subject: 'Chemistry', score: 97 },
        { subject: 'English', score: 95 },
        { subject: 'Computer Science', score: 99 }
      ],
      schoolRank: 1,
      districtRank: 3,
      achievements: ['Perfect score in Math', 'National Science Olympiad Gold', 'School Topper'],
      studyPattern: '6 hours daily, focused on problem-solving and past papers'
    },
    {
      id: 'T2',
      name: 'Kavya Sharma',
      year: 2024,
      boardScore: 97.4,
      class: 'Class 12',
      stream: 'Commerce',
      subjects: [
        { subject: 'Accountancy', score: 99 },
        { subject: 'Business Studies', score: 98 },
        { subject: 'Economics', score: 96 },
        { subject: 'English', score: 96 },
        { subject: 'Mathematics', score: 98 }
      ],
      schoolRank: 1,
      districtRank: 5,
      achievements: ['State rank in Accountancy', 'Perfect attendance', 'Commerce Society President'],
      studyPattern: '5 hours daily with emphasis on case studies and practical applications'
    },
    {
      id: 'T3',
      name: 'Riya Kapoor',
      year: 2024,
      boardScore: 96.8,
      class: 'Class 10',
      stream: 'General',
      subjects: [
        { subject: 'Mathematics', score: 100 },
        { subject: 'Science', score: 97 },
        { subject: 'Social Science', score: 96 },
        { subject: 'English', score: 95 },
        { subject: 'Hindi', score: 96 }
      ],
      schoolRank: 1,
      districtRank: 8,
      achievements: ['100% in Math', 'School Debating Champion', 'Perfect project scores'],
      studyPattern: 'Balanced 4-5 hours study with focus on conceptual clarity'
    },
    // 2023 Toppers
    {
      id: 'T4',
      name: 'Aditya Gupta',
      year: 2023,
      boardScore: 97.6,
      class: 'Class 12',
      stream: 'Science',
      subjects: [
        { subject: 'Mathematics', score: 99 },
        { subject: 'Physics', score: 98 },
        { subject: 'Chemistry', score: 96 },
        { subject: 'English', score: 97 },
        { subject: 'Computer Science', score: 98 }
      ],
      schoolRank: 1,
      districtRank: 7,
      achievements: ['IIT-JEE Qualified', 'District Science Fair Winner', 'Coding Champion'],
      studyPattern: '7 hours daily including practical experiments and coding practice'
    },
    {
      id: 'T5',
      name: 'Sneha Patel',
      year: 2023,
      boardScore: 96.2,
      class: 'Class 12',
      stream: 'Commerce',
      subjects: [
        { subject: 'Accountancy', score: 98 },
        { subject: 'Business Studies', score: 97 },
        { subject: 'Economics', score: 94 },
        { subject: 'English', score: 96 },
        { subject: 'Mathematics', score: 96 }
      ],
      schoolRank: 1,
      achievements: ['Young Entrepreneur Award', 'Best Business Project', 'Merit Scholarship'],
      studyPattern: '5-6 hours with group study sessions and mock tests'
    },
    {
      id: 'T6',
      name: 'Karan Singh',
      year: 2023,
      boardScore: 95.4,
      class: 'Class 10',
      stream: 'General',
      subjects: [
        { subject: 'Mathematics', score: 98 },
        { subject: 'Science', score: 96 },
        { subject: 'Social Science', score: 94 },
        { subject: 'English', score: 94 },
        { subject: 'Hindi', score: 95 }
      ],
      schoolRank: 1,
      achievements: ['Math Olympiad State Rank', 'Sports Captain', 'All-rounder Award'],
      studyPattern: '4 hours focused study with balanced extracurricular activities'
    },
    // 2022 Toppers
    {
      id: 'T7',
      name: 'Neha Reddy',
      year: 2022,
      boardScore: 96.8,
      class: 'Class 12',
      stream: 'Science',
      subjects: [
        { subject: 'Mathematics', score: 98 },
        { subject: 'Physics', score: 97 },
        { subject: 'Chemistry', score: 95 },
        { subject: 'English', score: 96 },
        { subject: 'Computer Science', score: 98 }
      ],
      schoolRank: 1,
      districtRank: 12,
      achievements: ['KVPY Scholar', 'Research Project Published', 'Science Exhibition Gold'],
      studyPattern: '6-7 hours with emphasis on research and practical work'
    },
    {
      id: 'T8',
      name: 'Rahul Joshi',
      year: 2022,
      boardScore: 95.8,
      class: 'Class 12',
      stream: 'Commerce',
      subjects: [
        { subject: 'Accountancy', score: 97 },
        { subject: 'Business Studies', score: 96 },
        { subject: 'Economics', score: 95 },
        { subject: 'English', score: 95 },
        { subject: 'Mathematics', score: 96 }
      ],
      schoolRank: 1,
      achievements: ['CA Foundation Cleared', 'Best Economics Project', 'Quiz Champion'],
      studyPattern: 'Consistent 5 hours daily with regular revision cycles'
    },
    // 2021 Toppers
    {
      id: 'T9',
      name: 'Priya Nair',
      year: 2021,
      boardScore: 97.2,
      class: 'Class 12',
      stream: 'Science',
      subjects: [
        { subject: 'Mathematics', score: 99 },
        { subject: 'Physics', score: 98 },
        { subject: 'Chemistry', score: 96 },
        { subject: 'English', score: 95 },
        { subject: 'Computer Science', score: 98 }
      ],
      schoolRank: 1,
      districtRank: 5,
      achievements: ['NEET Top Scorer', 'Biology Olympiad Gold', 'Research Intern'],
      studyPattern: '6 hours daily with NEET preparation alongside boards'
    },
    {
      id: 'T10',
      name: 'Sanjay Verma',
      year: 2021,
      boardScore: 96.6,
      class: 'Class 10',
      stream: 'General',
      subjects: [
        { subject: 'Mathematics', score: 100 },
        { subject: 'Science', score: 97 },
        { subject: 'Social Science', score: 95 },
        { subject: 'English', score: 94 },
        { subject: 'Hindi', score: 97 }
      ],
      schoolRank: 1,
      achievements: ['Perfect Math Score', 'Best Student Award', 'Leadership Excellence'],
      studyPattern: '4-5 hours with focus on time management and smart study'
    },
    // 2020 Toppers
    {
      id: 'T11',
      name: 'Ananya Desai',
      year: 2020,
      boardScore: 95.6,
      class: 'Class 12',
      stream: 'Science',
      subjects: [
        { subject: 'Mathematics', score: 97 },
        { subject: 'Physics', score: 96 },
        { subject: 'Chemistry', score: 94 },
        { subject: 'English', score: 96 },
        { subject: 'Computer Science', score: 95 }
      ],
      schoolRank: 1,
      achievements: ['Google Code-in Finalist', 'Hackathon Winner', 'Tech Club President'],
      studyPattern: 'Balanced approach with 5 hours study and coding projects'
    },
    {
      id: 'T12',
      name: 'Vikram Malhotra',
      year: 2020,
      boardScore: 94.8,
      class: 'Class 12',
      stream: 'Commerce',
      subjects: [
        { subject: 'Accountancy', score: 96 },
        { subject: 'Business Studies', score: 95 },
        { subject: 'Economics', score: 94 },
        { subject: 'English', score: 94 },
        { subject: 'Mathematics', score: 95 }
      ],
      schoolRank: 1,
      achievements: ['Stock Market Club Founder', 'Business Plan Competition Winner', 'Merit Scholar'],
      studyPattern: 'Practical learning approach with 5 hours daily study'
    }
  ];

  const generatePrediction = (student: Student) => {
    setIsPredicting(true);

    setTimeout(() => {
      const baseScore = student.currentAverage;
      const variation = Math.random() * 10 - 5;
      const predictedScore = Math.max(40, Math.min(100, baseScore + variation));

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (predictedScore < 60) riskLevel = 'high';
      else if (predictedScore < 75) riskLevel = 'medium';

      // Get department-specific subjects
      const subjects: SubjectPrediction[] = getDepartmentSubjects(
        student.department,
        student.year,
        student.semester
      );

      const recommendations: string[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (riskLevel === 'high') {
        recommendations.push('Immediate intervention required - schedule parent-faculty meeting');
        recommendations.push('Assign peer mentor for daily support');
        recommendations.push('Enroll in remedial classes for weak subjects');
        recommendations.push('Weekly progress monitoring with academic counselor');

        strengths.push('Shows willingness to improve', 'Responds to guidance');
        weaknesses.push(
          'Low attendance rate (below 75%)',
          'Incomplete assignment submissions',
          'Weak foundational concepts in core subjects',
          'Exam anxiety affecting performance'
        );
      } else if (riskLevel === 'medium') {
        recommendations.push('Regular doubt-clearing sessions with faculty');
        recommendations.push('Focus on time management and study planning');
        recommendations.push('Complete all pending assignments before deadline');
        recommendations.push('Attend additional tutorial sessions for weak subjects');

        strengths.push('Good attendance record', 'Participates in class discussions', 'Completes most assignments');
        weaknesses.push(
          'Inconsistent performance in some subjects',
          'Needs better exam preparation strategies',
          'Lab work requires more attention',
          'Time management during assessments'
        );
      } else {
        recommendations.push('Continue current learning pace and study schedule');
        recommendations.push('Consider advanced topics and enrichment programs');
        recommendations.push('Participate in peer teaching and mentoring');
        recommendations.push('Explore research projects and technical competitions');

        strengths.push(
          'Excellent attendance (95%+)',
          'Strong theoretical understanding',
          'Consistent high performance across subjects',
          'Good assignment completion record'
        );
        weaknesses.push(
          'Can further improve lab practical skills',
          'Opportunity to take up leadership roles',
          'Consider advanced certifications',
          'Minor gaps in some advanced concepts'
        );
      }

      setPredictionResult({
        studentId: student.id,
        studentName: student.name,
        predictedScore: Math.round(predictedScore),
        confidence: 93 + Math.floor(Math.random() * 5),
        riskLevel,
        subjects,
        recommendations,
        strengths,
        weaknesses
      });

      setIsPredicting(false);

      // Calculate comparison metrics after prediction
      setTimeout(() => {
        const metrics = calculateComparison({
          studentId: student.id,
          studentName: student.name,
          predictedScore: Math.round(predictedScore),
          confidence: 93 + Math.floor(Math.random() * 5),
          riskLevel,
          subjects,
          recommendations,
          strengths,
          weaknesses
        }, student);
        setComparisonMetrics(metrics);
        setShowComparison(true);
      }, 500);
    }, 2500);
  };

  // Helper Functions for Comparison
  const filterToppers = () => {
    let filtered = boardToppers.filter(topper => {
      const matchesClass = topper.class === (selectedStudent?.class.includes('10') ? 'Class 10' : 'Class 12');
      const matchesYear = selectedYear === 'all' || topper.year === selectedYear;
      const matchesStream = selectedTopperStream === 'all' || topper.stream === selectedTopperStream;
      return matchesClass && matchesYear && matchesStream;
    });
    return filtered.sort((a, b) => b.boardScore - a.boardScore);
  };

  const getTopTopper = (toppers: BoardTopper[]) => {
    return toppers.length > 0 ? toppers[0] : null;
  };

  const calculateSubjectAverage = (subject: string, toppers: BoardTopper[]) => {
    if (toppers.length === 0) return 0;
    const total = toppers.reduce((sum, topper) => {
      const subj = topper.subjects.find(s => s.subject === subject);
      return sum + (subj?.score || 0);
    }, 0);
    return total / toppers.length;
  };

  const findSimilarToppers = (predictedScore: number, toppers: BoardTopper[]) => {
    return toppers.filter(topper => {
      const scoreDiff = Math.abs(topper.boardScore - predictedScore);
      return scoreDiff <= 10;
    }).slice(0, 3);
  };

  const getGapColor = (gap: number) => {
    if (gap <= 10) return 'small';
    if (gap <= 20) return 'medium';
    return 'large';
  };

  // Calculate Comparison Metrics
  const calculateComparison = (prediction: PredictionResult, student: Student): ComparisonMetrics => {
    const relevantToppers = boardToppers.filter(topper => {
      const matchesClass = topper.class === (student.class.includes('10') ? 'Class 10' : 'Class 12');
      const studentStream = student.class.includes('Science') ? 'Science' :
                           student.class.includes('Commerce') ? 'Commerce' : 'General';
      const matchesStream = topper.stream === studentStream;
      return matchesClass && matchesStream;
    });

    const topTopper = relevantToppers.length > 0 ? relevantToppers.reduce((max, topper) =>
      topper.boardScore > max.boardScore ? topper : max
    ) : null;

    const scoreGap = topTopper ? topTopper.boardScore - prediction.predictedScore : 0;

    // Calculate percentile
    const allScores = relevantToppers.map(t => t.boardScore).concat([prediction.predictedScore]);
    allScores.sort((a, b) => b - a);
    const rank = allScores.indexOf(prediction.predictedScore) + 1;
    const percentile = ((allScores.length - rank + 1) / allScores.length) * 100;

    // Find similar toppers (within ±10% range)
    const similarToppers = findSimilarToppers(prediction.predictedScore, relevantToppers);

    // Calculate subject gaps
    const subjectGaps = prediction.subjects.map(subject => {
      const topperAvg = calculateSubjectAverage(subject.subject, relevantToppers);
      return {
        subject: subject.subject,
        gap: topperAvg - subject.predictedScore,
        topperAvgScore: topperAvg,
        studentScore: subject.predictedScore
      };
    });

    return {
      scoreGap: Math.max(0, scoreGap),
      percentile: Math.round(percentile),
      similarToppers,
      subjectGaps,
      improvementRequired: Math.max(0, scoreGap),
      rankingPosition: rank
    };
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setPredictionResult(null);
    // Reset action button states when selecting a new student
    setReportDownloaded(false);
    setMeetingScheduled(false);
    setProgressTracking(false);
    generatePrediction(student);
  };

  // Download Full Report functionality
  const downloadReport = () => {
    if (!predictionResult) return;

    const reportContent = `
BOARD EXAM PERFORMANCE PREDICTION REPORT
=========================================

Student Information
-------------------
Name: ${predictionResult.studentName}
Student ID: ${predictionResult.studentId}
Report Generated: ${new Date().toLocaleString()}

Prediction Summary
------------------
Predicted Board Score: ${predictionResult.predictedScore}%
Confidence Level: ${predictionResult.confidence}%
Risk Level: ${predictionResult.riskLevel.toUpperCase()}

Subject-wise Analysis
---------------------
${predictionResult.subjects.map(subject => `
${subject.subject}:
  Current Score: ${Math.round(subject.currentScore)}%
  Predicted Score: ${Math.round(subject.predictedScore)}%
  Trend: ${subject.trend}
  ${subject.riskFactors.length > 0 ? `Risk Factors: ${subject.riskFactors.join(', ')}` : 'No risk factors identified'}
`).join('\n')}

Strengths
---------
${predictionResult.strengths.map((strength, idx) => `${idx + 1}. ${strength}`).join('\n')}

Areas of Concern
----------------
${predictionResult.weaknesses.map((weakness, idx) => `${idx + 1}. ${weakness}`).join('\n')}

Intervention Recommendations
----------------------------
${predictionResult.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

---
This report was generated by EdgeUp AI-Powered Results Predictor
Model Accuracy: 95%
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Board_Exam_Prediction_${predictionResult.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Update button state
    setReportDownloaded(true);
  };

  // Download Comparison Report functionality
  const downloadComparisonReport = () => {
    if (!predictionResult || !comparisonMetrics) return;

    const filteredToppers = filterToppers();
    const topTopper = getTopTopper(filteredToppers);

    const reportContent = `
BOARD TOPPER COMPARISON REPORT
================================

Student Information
-------------------
Name: ${predictionResult.studentName}
Class: ${selectedStudent?.class}
Predicted Score: ${predictionResult.predictedScore}%
Report Generated: ${new Date().toLocaleString()}

TOP TOPPER COMPARISON
---------------------
Highest Scorer: ${topTopper?.name || 'N/A'} (${topTopper?.year || 'N/A'})
Top Score: ${topTopper?.boardScore.toFixed(1) || 'N/A'}%
Score Gap: ${comparisonMetrics.scoreGap.toFixed(1)}%
Your Percentile Ranking: ${comparisonMetrics.percentile}th percentile
Historical Position: Rank ${comparisonMetrics.rankingPosition}

SUBJECT-WISE COMPARISON
-----------------------
${comparisonMetrics.subjectGaps.map(gap => `
${gap.subject}:
  Your Predicted Score: ${gap.studentScore.toFixed(1)}%
  Topper Average Score: ${gap.topperAvgScore.toFixed(1)}%
  Gap: ${gap.gap >= 0 ? '+' : ''}${gap.gap.toFixed(1)}%
  Status: ${gap.gap <= 0 ? '✓ Ahead of average' : '⚠ Below average'}`).join('\n')}

SIMILAR SUCCESS STORIES
-----------------------
${comparisonMetrics.similarToppers.length > 0 ? comparisonMetrics.similarToppers.map(topper => `
${topper.name} (${topper.year})
  - Final Score: ${topper.boardScore}%
  - School Rank: ${topper.schoolRank}
  - Achievements: ${topper.achievements.join(', ')}
  - Study Pattern: ${topper.studyPattern || 'N/A'}`).join('\n') : 'No similar profiles found in historical data'}

IMPROVEMENT PATH
----------------
Current Predicted Score: ${predictionResult.predictedScore}%
Target Score (Top Topper): ${topTopper?.boardScore.toFixed(1) || 'N/A'}%
Required Improvement: +${comparisonMetrics.improvementRequired.toFixed(1)}%

Recommended Action Plan:
${predictionResult.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

TOPPER INSIGHTS
---------------
Common Success Patterns from Historical Toppers:
- Average Study Hours: 5-6 hours daily
- Focus Areas: Strong foundation in core subjects
- Key Strategies: Regular practice, mock tests, consistent revision
- Resources: NCERT textbooks, reference books, past papers

---
Generated by EdgeUp Board Results Predictor with Topper Comparison
Model Accuracy: 95% | Historical Data: 2020-2024
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Topper_Comparison_${predictionResult.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Schedule Parent Meeting functionality
  const scheduleParentMeeting = () => {
    if (!predictionResult) return;

    const meetingSubject = `Parent-Teacher Meeting: ${predictionResult.studentName} - Board Exam Discussion`;
    const meetingBody = `Dear Parent,

We would like to schedule a meeting to discuss ${predictionResult.studentName}'s predicted board exam performance.

Current Prediction: ${predictionResult.predictedScore}%
Risk Level: ${predictionResult.riskLevel.charAt(0).toUpperCase() + predictionResult.riskLevel.slice(1)}

Key discussion points:
${predictionResult.recommendations.slice(0, 3).map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

Please let us know your availability for a meeting this week.

Best regards,
${getRoleContent().userName}
${getRoleContent().userTitle}`;

    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(meetingSubject)}&body=${encodeURIComponent(meetingBody)}`;
    window.location.href = mailtoLink;

    // Update button state
    setMeetingScheduled(true);
  };

  // Track Progress functionality
  const trackProgress = () => {
    if (!predictionResult) return;

    const progressData = {
      studentId: predictionResult.studentId,
      studentName: predictionResult.studentName,
      predictedScore: predictionResult.predictedScore,
      confidence: predictionResult.confidence,
      riskLevel: predictionResult.riskLevel,
      timestamp: new Date().toISOString(),
      subjects: predictionResult.subjects.map(s => ({
        subject: s.subject,
        currentScore: s.currentScore,
        predictedScore: s.predictedScore,
        trend: s.trend
      }))
    };

    // Store in localStorage for tracking
    const existingData = localStorage.getItem('studentProgressTracking');
    const trackingData = existingData ? JSON.parse(existingData) : [];

    trackingData.push(progressData);
    localStorage.setItem('studentProgressTracking', JSON.stringify(trackingData));

    alert(`Progress tracking started for ${predictionResult.studentName}!\n\nTracking includes:\n• Predicted score: ${predictionResult.predictedScore}%\n• Subject-wise performance\n• Risk level monitoring\n• Recommendation follow-ups\n\nYou will receive weekly updates on progress.`);

    // Update button state
    setProgressTracking(true);
  };

  // Helper function to get role content (for email)
  const getRoleContent = () => {
    return {
      userName: 'Dr. Robert Williams',
      userTitle: 'School Principal'
    };
  };

  return (
    <div className="results-predictor-page">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-graduation-cap"></i> Semester Result Predictor</h1>
          <p>AI-powered academic performance forecasting and intervention planning</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Predict Results functionality')}>
            <i className="fas fa-brain"></i>
            Run Prediction
          </button>
          <button className="btn-secondary" onClick={() => alert('Export Report functionality')}>
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="predictor-stats-grid">
        <div className="predictor-stat-card accuracy">
          <div className="stat-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Pass Prediction Rate</span>
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-trend"><i className="fas fa-check-circle"></i> Expected to pass semester</span>
          </div>
        </div>

        <div className="predictor-stat-card improvement">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">At-Risk Students</span>
            <span className="stat-value">18%</span>
            <span className="stat-trend"><i className="fas fa-exclamation-triangle"></i> Require academic intervention</span>
          </div>
        </div>

        <div className="predictor-stat-card predictions">
          <div className="stat-icon">
            <i className="fas fa-brain"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Predictions</span>
            <span className="stat-value">1,247</span>
            <span className="stat-trend"><i className="fas fa-calendar"></i> Historical semester predictions</span>
          </div>
        </div>
      </div>

      {/* Student Search and Selection */}
      <div className="student-selection-section">
        <div className="selection-header">
          <div className="selection-title">
            <i className="fas fa-user-graduate"></i>
            <h3>Select Student for Prediction</h3>
          </div>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, roll no, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="students-grid">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
              onClick={() => handleStudentSelect(student)}
            >
              <div className="student-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="student-info">
                <h4>{student.name}</h4>
                <p className="student-class">{student.enrollmentNo}</p>
                <p className="student-roll">{student.department} - {student.year}{student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year Sem {student.semester}</p>
                <div className="student-average">
                  <span className="average-label">Current Average:</span>
                  <span className="average-value">{student.currentAverage}%</span>
                </div>
              </div>
              <div className="predict-indicator">
                {selectedStudent?.id === student.id && isPredicting && (
                  <i className="fas fa-spinner fa-spin"></i>
                )}
                {selectedStudent?.id === student.id && !isPredicting && predictionResult && (
                  <i className="fas fa-check-circle"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Results */}
      {isPredicting && (
        <div className="prediction-loading-overlay">
          <div className="prediction-loading-content">
            <div className="loading-animation">
              <i className="fas fa-brain"></i>
              <div className="loading-spinner"></div>
            </div>
            <h3>AI Model Analyzing Performance Data...</h3>
            <p>Processing historical scores, attendance, assignment completion, and behavioral patterns</p>
            <div className="progress-bar-animated">
              <div className="progress-fill-animated"></div>
            </div>
          </div>
        </div>
      )}

      {predictionResult && !isPredicting && (
        <>
          {/* Prediction Overview */}
          <div className="prediction-overview-grid">
            <div className="prediction-score-card">
              <div className="score-header">
                <i className="fas fa-award"></i>
                <h3>Predicted Board Score</h3>
              </div>
              <div className="score-display">
                <span className="score-value">{predictionResult.predictedScore}%</span>
                <span className={`risk-badge ${predictionResult.riskLevel}`}>
                  {predictionResult.riskLevel === 'high' && <><i className="fas fa-exclamation-circle"></i> High Risk</>}
                  {predictionResult.riskLevel === 'medium' && <><i className="fas fa-exclamation-triangle"></i> Medium Risk</>}
                  {predictionResult.riskLevel === 'low' && <><i className="fas fa-check-circle"></i> Low Risk</>}
                </span>
              </div>
              <div className="confidence-meter">
                <span className="confidence-label">Confidence Level</span>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${predictionResult.confidence}%` }}></div>
                </div>
                <span className="confidence-value">{predictionResult.confidence}%</span>
              </div>
            </div>

            <div className="prediction-insights-card">
              <div className="insights-section">
                <h4><i className="fas fa-star"></i> Strengths</h4>
                <ul className="insights-list strengths">
                  {predictionResult.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="insights-section">
                <h4><i className="fas fa-exclamation-triangle"></i> Areas of Concern</h4>
                <ul className="insights-list weaknesses">
                  {predictionResult.weaknesses.map((weakness, idx) => (
                    <li key={idx}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Subject-wise Analysis */}
          <div className="subject-analysis-card">
            <div className="analysis-header">
              <div className="analysis-title">
                <i className="fas fa-chart-bar"></i>
                <h3>Subject-wise Performance Analysis</h3>
              </div>
            </div>

            <div className="subjects-grid">
              {predictionResult.subjects.map((subject, idx) => (
                <div key={idx} className="subject-prediction-card">
                  <div className="subject-header">
                    <h4>{subject.subject}</h4>
                    <span className={`trend-badge ${subject.trend}`}>
                      {subject.trend === 'improving' && <><i className="fas fa-arrow-up"></i> Improving</>}
                      {subject.trend === 'stable' && <><i className="fas fa-minus"></i> Stable</>}
                      {subject.trend === 'declining' && <><i className="fas fa-arrow-down"></i> Declining</>}
                    </span>
                  </div>

                  <div className="score-comparison">
                    <div className="score-item current">
                      <span className="score-label">Current</span>
                      <span className="score-number">{Math.round(subject.currentScore)}%</span>
                    </div>
                    <div className="score-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="score-item predicted">
                      <span className="score-label">Predicted</span>
                      <span className="score-number">{Math.round(subject.predictedScore)}%</span>
                    </div>
                  </div>

                  {subject.riskFactors.length > 0 && (
                    <div className="risk-factors">
                      <span className="risk-label"><i className="fas fa-info-circle"></i> Risk Factors:</span>
                      <ul>
                        {subject.riskFactors.map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI-Powered Intervention Recommendations */}
          <div className="intervention-section">
            <div className="section-header">
              <h3><i className="fas fa-robot"></i> AI-Powered Intervention Recommendations</h3>
              <span className="action-required-badge">
                {predictionResult.riskLevel === 'high' ? 'IMMEDIATE ACTION REQUIRED' :
                 predictionResult.riskLevel === 'medium' ? 'ACTION RECOMMENDED' :
                 'MONITORING SUGGESTED'}
              </span>
            </div>

            <div className="recommendations-list">
              {predictionResult.recommendations.map((recommendation, idx) => {
                const priority = idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low';
                const category =
                  recommendation.includes('intervention') || recommendation.includes('immediate') ? 'Academic Support' :
                  recommendation.includes('enrichment') || recommendation.includes('advanced') ? 'Skill Enhancement' :
                  recommendation.includes('peer') || recommendation.includes('teaching') ? 'Career Guidance' :
                  'General Guidance';

                return (
                  <div key={idx} className={`recommendation-card ${priority}-priority`}>
                    {/* Header */}
                    <div className="recommendation-header">
                      <div className="header-left">
                        {/* Number Badge */}
                        <div className="number-badge">{idx + 1}</div>

                        {/* Title Section */}
                        <div className="title-section">
                          <span className={`priority-badge ${priority}`}>
                            {priority === 'high' ? 'HIGH PRIORITY' :
                             priority === 'medium' ? 'MEDIUM PRIORITY' :
                             'LOW PRIORITY'}
                          </span>
                          <h4 className="recommendation-title">{recommendation}</h4>
                          <p className="category-label">{category}</p>
                        </div>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="header-right">
                        <button className="btn-done" title="Mark as completed">
                          <i className="fas fa-check"></i> Done
                        </button>
                        <button className="btn-dismiss" title="Dismiss recommendation">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="meta-information">
                      <div className="meta-item">
                        <span className="meta-item-icon"><i className="fas fa-bullseye"></i></span>
                        <span className="meta-item-label">Impact:</span>
                        <span className="meta-item-value">
                          {priority === 'high' ? 'Critical' : priority === 'medium' ? 'Significant' : 'Moderate'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-item-icon"><i className="fas fa-clock"></i></span>
                        <span className="meta-item-label">Effort:</span>
                        <span className="meta-item-value">
                          {priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-item-icon"><i className="fas fa-chart-line"></i></span>
                        <span className="meta-item-label">Success Rate:</span>
                        <span className="meta-item-value">
                          {priority === 'high' ? '85%' : priority === 'medium' ? '90%' : '95%'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons-container">
                      <button className="btn-view-details">
                        <i className="fas fa-eye"></i> View Details
                      </button>
                      {category === 'Academic Support' && (
                        <button className="btn-primary-action">
                          <i className="fas fa-calendar"></i> Schedule Session
                        </button>
                      )}
                      {category === 'Skill Enhancement' && (
                        <button className="btn-primary-action">
                          <i className="fas fa-graduation-cap"></i> Enroll in Program
                        </button>
                      )}
                      {category === 'Career Guidance' && (
                        <button className="btn-primary-action">
                          <i className="fas fa-user-plus"></i> Nominate Student
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-footer">
              <button
                className={`btn-export-recommendations ${reportDownloaded ? 'completed' : ''}`}
                onClick={downloadReport}
                disabled={reportDownloaded}
              >
                <i className={`fas ${reportDownloaded ? 'fa-check-circle' : 'fa-download'}`}></i>
                {reportDownloaded ? 'Report Downloaded' : 'Export All Recommendations'}
              </button>
            </div>
          </div>

          {/* Board Toppers Comparison Section */}
          {comparisonMetrics && (
            <div className="comparison-section">
              <div className="comparison-section-toggle">
                <button onClick={() => setShowComparison(!showComparison)} className="comparison-toggle-btn">
                  <i className="fas fa-trophy"></i>
                  <span>Compare with Board Toppers</span>
                  <i className={`fas fa-chevron-${showComparison ? 'up' : 'down'}`}></i>
                </button>
                {showComparison && (
                  <button className="download-comparison-btn" onClick={downloadComparisonReport}>
                    <i className="fas fa-file-download"></i>
                    Download Comparison Report
                  </button>
                )}
              </div>

              {showComparison && (
                <div className="comparison-content">
                  {/* Gap Analysis Card */}
                  <div className={`gap-analysis-card gap-${getGapColor(comparisonMetrics.scoreGap)}`}>
                    <div className="gap-score-left">
                      <span className="gap-label">Your Predicted Score</span>
                      <span className="gap-score">{predictionResult.predictedScore}%</span>
                    </div>
                    <div className="gap-indicator">
                      <i className="fas fa-arrow-right"></i>
                      <span className="gap-value">{comparisonMetrics.scoreGap.toFixed(1)}% Gap</span>
                    </div>
                    <div className="gap-score-right">
                      <span className="gap-label">Top Topper Score</span>
                      <span className="gap-score">{(predictionResult.predictedScore + comparisonMetrics.scoreGap).toFixed(1)}%</span>
                    </div>
                    <div className="percentile-meter">
                      <div className="percentile-label">Percentile Ranking</div>
                      <div className="percentile-bar">
                        <div className="percentile-fill" style={{ width: `${comparisonMetrics.percentile}%` }}></div>
                      </div>
                      <div className="percentile-value">{comparisonMetrics.percentile}th Percentile</div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="comparison-filters">
                    <div className="filter-group">
                      <span className="filter-label">Year:</span>
                      {['all', 2024, 2023, 2022, 2021, 2020].map(year => (
                        <button
                          key={year}
                          className={`filter-btn ${selectedYear === year ? 'active' : ''}`}
                          onClick={() => setSelectedYear(year as number | 'all')}
                        >
                          {year === 'all' ? 'All Years' : year}
                        </button>
                      ))}
                    </div>
                    <div className="filter-group">
                      <span className="filter-label">Stream:</span>
                      {['all', 'Science', 'Commerce', 'General'].map(stream => (
                        <button
                          key={stream}
                          className={`filter-btn ${selectedTopperStream === stream ? 'active' : ''}`}
                          onClick={() => setSelectedTopperStream(stream)}
                        >
                          {stream === 'all' ? 'All Streams' : stream}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toppers Gallery */}
                  <div className="toppers-gallery">
                    <h3><i className="fas fa-trophy"></i> Board Toppers Hall of Fame</h3>
                    <div className="toppers-scroll-container">
                      {filterToppers().slice(0, 6).map((topper) => (
                        <div key={topper.id} className="topper-card">
                          <div className="topper-avatar">
                            {topper.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <h4>{topper.name}</h4>
                          <div className="topper-score-badge">{topper.boardScore}%</div>
                          <div className="topper-year">Class of {topper.year}</div>
                          <div className="topper-rank-badge">
                            <i className="fas fa-medal"></i> Rank {topper.schoolRank}
                          </div>
                          <div className="topper-stream-badge">{topper.stream}</div>
                          <div className="topper-achievements">
                            {topper.achievements.slice(0, 2).map((achievement, idx) => (
                              <div key={idx} className="achievement-item">
                                <i className="fas fa-star"></i> {achievement}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject-wise Comparison Chart */}
                  <div className="subject-comparison-chart">
                    <h3><i className="fas fa-chart-bar"></i> Subject-wise Performance Comparison</h3>
                    <div className="chart-legend">
                      <span><span className="legend-dot student"></span> Your Predicted Score</span>
                      <span><span className="legend-dot topper"></span> Topper Average</span>
                    </div>
                    <div className="subject-rows">
                      {comparisonMetrics.subjectGaps.map((gap) => (
                        <div key={gap.subject} className="subject-row">
                          <div className="subject-label">{gap.subject}</div>
                          <div className="comparison-bars-container">
                            <div className="comparison-bar student-bar">
                              <div className="bar-fill" style={{ width: `${gap.studentScore}%` }}>
                                <span className="bar-label">{gap.studentScore.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="comparison-bar topper-bar">
                              <div className="bar-fill" style={{ width: `${gap.topperAvgScore}%` }}>
                                <span className="bar-label">{gap.topperAvgScore.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className={`gap-badge ${gap.gap <= 0 ? 'ahead' : 'behind'}`}>
                            <i className={`fas ${gap.gap <= 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                            {Math.abs(gap.gap).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similar Toppers Section */}
                  {comparisonMetrics.similarToppers.length > 0 && (
                    <div className="similar-toppers-section">
                      <h3><i className="fas fa-users"></i> Success Stories - Similar Mid-Year Scores</h3>
                      <div className="success-stories-grid">
                        {comparisonMetrics.similarToppers.map((topper) => (
                          <div key={topper.id} className="success-story-card">
                            <div className="story-header">
                              <h4>{topper.name}</h4>
                              <span className="story-year">{topper.year}</span>
                            </div>
                            <div className="improvement-stats">
                              <div className="stat-item">
                                <span className="stat-label">Final Score</span>
                                <span className="stat-value">{topper.boardScore}%</span>
                              </div>
                              <div className="improvement-badge">
                                <i className="fas fa-arrow-up"></i>
                                Top Performer
                              </div>
                            </div>
                            <div className="success-quote">
                              <i className="fas fa-quote-left"></i>
                              <p>{topper.studyPattern}</p>
                            </div>
                            <div className="topper-highlights">
                              <div className="highlight-label">Key Achievements:</div>
                              {topper.achievements.slice(0, 2).map((achievement, idx) => (
                                <div key={idx} className="highlight-item">
                                  <i className="fas fa-check"></i> {achievement}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Timeline */}
                  <div className="success-timeline">
                    <h3><i className="fas fa-route"></i> Path to Top Score</h3>
                    <div className="timeline-container">
                      <div className="timeline-path">
                        <div className="timeline-marker current">
                          <div className="marker-dot"></div>
                          <div className="marker-label">
                            <span className="marker-title">Current Position</span>
                            <span className="marker-value">{predictionResult.predictedScore}%</span>
                          </div>
                        </div>
                        <div className="timeline-marker milestone">
                          <div className="marker-dot"></div>
                          <div className="marker-label">
                            <span className="marker-title">Month 3 Target</span>
                            <span className="marker-value">{(predictionResult.predictedScore + comparisonMetrics.scoreGap / 2).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="timeline-marker target">
                          <div className="marker-dot"></div>
                          <div className="marker-label">
                            <span className="marker-title">Target Score</span>
                            <span className="marker-value">{(predictionResult.predictedScore + comparisonMetrics.scoreGap).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="timeline-message">
                        You need <strong>+{comparisonMetrics.improvementRequired.toFixed(1)}%</strong> improvement to match the top topper
                      </div>
                    </div>
                  </div>

                  {/* Topper Insights Panel */}
                  <div className="topper-insights-panel">
                    <h3><i className="fas fa-lightbulb"></i> Common Success Patterns from Toppers</h3>
                    <div className="insights-grid">
                      <div className="insight-card">
                        <div className="insight-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div className="insight-content">
                          <h4>Study Hours</h4>
                          <p>Average 5-6 hours daily with consistent routine</p>
                        </div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-icon">
                          <i className="fas fa-bullseye"></i>
                        </div>
                        <div className="insight-content">
                          <h4>Focus Areas</h4>
                          <p>Strong foundation in Mathematics and core subjects</p>
                        </div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-icon">
                          <i className="fas fa-tasks"></i>
                        </div>
                        <div className="insight-content">
                          <h4>Key Strategies</h4>
                          <p>Regular practice, mock tests, and systematic revision</p>
                        </div>
                      </div>
                      <div className="insight-card">
                        <div className="insight-icon">
                          <i className="fas fa-book"></i>
                        </div>
                        <div className="insight-content">
                          <h4>Resources Used</h4>
                          <p>NCERT, reference books, past papers, online platforms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!selectedStudent && !isPredicting && (
        <div className="predictor-empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h3>Select a Student to Generate Prediction</h3>
          <p>Choose from the student list above to get AI-powered board exam performance predictions with 95% accuracy</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPredictor;
