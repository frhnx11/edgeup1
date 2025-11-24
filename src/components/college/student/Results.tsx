import { useState } from 'react';

interface Result {
  id: string;
  testTitle: string;
  subject: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'practice';
  status: 'passed' | 'failed';
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  passingMarks: number;
  teacher: string;
  questions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeSpent: string;
  percentile: number;
  remarks?: string;
}

const Results = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const results: Result[] = [
    // Mathematics Results
    {
      id: '1',
      testTitle: 'Relations and Functions Quiz',
      subject: 'Mathematics',
      type: 'quiz',
      status: 'passed',
      date: '2024-12-01',
      totalMarks: 25,
      obtainedMarks: 23,
      percentage: 92,
      grade: 'A+',
      passingMarks: 10,
      teacher: 'Mr. Karthik Subramanian',
      questions: 10,
      correctAnswers: 9,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '42 mins',
      percentile: 95,
      remarks: 'Excellent grasp of functions and composition. Well done!'
    },
    {
      id: '2',
      testTitle: 'Trigonometry Unit Test',
      subject: 'Mathematics',
      type: 'midterm',
      status: 'passed',
      date: '2024-11-10',
      totalMarks: 50,
      obtainedMarks: 46,
      percentage: 92,
      grade: 'A+',
      passingMarks: 20,
      teacher: 'Mr. Karthik Subramanian',
      questions: 20,
      correctAnswers: 18,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '85 mins',
      percentile: 94,
      remarks: 'Outstanding problem-solving in heights and distances. Keep it up!'
    },
    {
      id: '3',
      testTitle: 'Algebra Mid-semester Test',
      subject: 'Mathematics',
      type: 'midterm',
      status: 'passed',
      date: '2024-10-15',
      totalMarks: 40,
      obtainedMarks: 36,
      percentage: 90,
      grade: 'A',
      passingMarks: 16,
      teacher: 'Mr. Karthik Subramanian',
      questions: 18,
      correctAnswers: 16,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '72 mins',
      percentile: 91,
      remarks: 'Strong performance in quadratic equations and matrices.'
    },

    // Science Results
    {
      id: '4',
      testTitle: 'Physics - Laws of Motion Quiz',
      subject: 'Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-12-01',
      totalMarks: 20,
      obtainedMarks: 18,
      percentage: 90,
      grade: 'A',
      passingMarks: 8,
      teacher: 'Dr. Lakshmi Narayanan',
      questions: 10,
      correctAnswers: 9,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '40 mins',
      percentile: 89,
      remarks: 'Good application of Newton\'s laws. Well prepared!'
    },
    {
      id: '5',
      testTitle: 'Chemistry - Periodic Table Test',
      subject: 'Science',
      type: 'midterm',
      status: 'passed',
      date: '2024-11-24',
      totalMarks: 35,
      obtainedMarks: 31,
      percentage: 88.57,
      grade: 'A',
      passingMarks: 14,
      teacher: 'Mrs. Sangeetha Mohan',
      questions: 15,
      correctAnswers: 13,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '70 mins',
      percentile: 87,
      remarks: 'Excellent understanding of periodic trends and properties.'
    },
    {
      id: '6',
      testTitle: 'Biology - Reproduction Chapter Test',
      subject: 'Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-11-17',
      totalMarks: 30,
      obtainedMarks: 28,
      percentage: 93.33,
      grade: 'A+',
      passingMarks: 12,
      teacher: 'Dr. Ramesh Babu',
      questions: 12,
      correctAnswers: 11,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '55 mins',
      percentile: 96,
      remarks: 'Outstanding knowledge of reproduction concepts. Excellent work!'
    },
    {
      id: '7',
      testTitle: 'Physics - Optics Unit Test',
      subject: 'Science',
      type: 'midterm',
      status: 'passed',
      date: '2024-10-28',
      totalMarks: 35,
      obtainedMarks: 30,
      percentage: 85.71,
      grade: 'A',
      passingMarks: 14,
      teacher: 'Dr. Lakshmi Narayanan',
      questions: 16,
      correctAnswers: 14,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '68 mins',
      percentile: 84,
      remarks: 'Good grasp of reflection and refraction. Practice lens problems more.'
    },
    {
      id: '8',
      testTitle: 'Chemistry - Carbon Compounds Test',
      subject: 'Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-10-20',
      totalMarks: 25,
      obtainedMarks: 23,
      percentage: 92,
      grade: 'A+',
      passingMarks: 10,
      teacher: 'Mrs. Sangeetha Mohan',
      questions: 12,
      correctAnswers: 11,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '48 mins',
      percentile: 93,
      remarks: 'Excellent work on hydrocarbons and functional groups!'
    },

    // Tamil Results
    {
      id: '9',
      testTitle: 'தமிழ் இலக்கணம் (Grammar) Test',
      subject: 'Tamil',
      type: 'quiz',
      status: 'passed',
      date: '2024-12-06',
      totalMarks: 25,
      obtainedMarks: 22,
      percentage: 88,
      grade: 'A',
      passingMarks: 10,
      teacher: 'திரு. முருகேசன்',
      questions: 15,
      correctAnswers: 13,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '58 mins',
      percentile: 86,
      remarks: 'நல்ல புரிதல். எழுத்து மற்றும் சொல் பகுதிகளில் சிறப்பாக செய்துள்ளீர்கள்.'
    },
    {
      id: '10',
      testTitle: 'திருக்குறள் (Thirukkural) Analysis Test',
      subject: 'Tamil',
      type: 'midterm',
      status: 'passed',
      date: '2024-11-25',
      totalMarks: 40,
      obtainedMarks: 34,
      percentage: 85,
      grade: 'A',
      passingMarks: 16,
      teacher: 'திருமதி. கமலா',
      questions: 20,
      correctAnswers: 17,
      incorrectAnswers: 3,
      unattempted: 0,
      timeSpent: '85 mins',
      percentile: 83,
      remarks: 'திருக்குறள் பொருள் விளக்கம் நன்றாக உள்ளது. தொடர்ந்து முயற்சி செய்யுங்கள்.'
    },
    {
      id: '11',
      testTitle: 'உரைநடை (Prose) Assessment',
      subject: 'Tamil',
      type: 'quiz',
      status: 'passed',
      date: '2024-10-18',
      totalMarks: 30,
      obtainedMarks: 26,
      percentage: 86.67,
      grade: 'A',
      passingMarks: 12,
      teacher: 'திரு. முருகேசன்',
      questions: 14,
      correctAnswers: 12,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '62 mins',
      percentile: 85,
      remarks: 'கதை மற்றும் கட்டுரை பகுப்பாய்வு மிகவும் நன்றாக உள்ளது.'
    },

    // English Results
    {
      id: '12',
      testTitle: 'Prose and Poetry Quiz',
      subject: 'English',
      type: 'quiz',
      status: 'passed',
      date: '2024-12-01',
      totalMarks: 20,
      obtainedMarks: 16,
      percentage: 80,
      grade: 'B+',
      passingMarks: 8,
      teacher: 'Mrs. Jennifer Thomas',
      questions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '42 mins',
      percentile: 78,
      remarks: 'Good analysis of prose. Work on poetry interpretation for better scores.'
    },
    {
      id: '13',
      testTitle: 'Grammar and Composition Test',
      subject: 'English',
      type: 'midterm',
      status: 'passed',
      date: '2024-11-24',
      totalMarks: 35,
      obtainedMarks: 29,
      percentage: 82.86,
      grade: 'A',
      passingMarks: 14,
      teacher: 'Mr. David Raj',
      questions: 15,
      correctAnswers: 12,
      incorrectAnswers: 3,
      unattempted: 0,
      timeSpent: '72 mins',
      percentile: 81,
      remarks: 'Strong grammar skills. Focus on reported speech and voice conversions.'
    },
    {
      id: '14',
      testTitle: 'Supplementary Reading Assessment',
      subject: 'English',
      type: 'quiz',
      status: 'passed',
      date: '2024-11-17',
      totalMarks: 30,
      obtainedMarks: 26,
      percentage: 86.67,
      grade: 'A',
      passingMarks: 12,
      teacher: 'Mrs. Jennifer Thomas',
      questions: 12,
      correctAnswers: 10,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '58 mins',
      percentile: 85,
      remarks: 'Excellent understanding of "The Tempest" and "After Twenty Years".'
    },
    {
      id: '15',
      testTitle: 'Vocabulary and Reading Quiz',
      subject: 'English',
      type: 'quiz',
      status: 'passed',
      date: '2024-10-25',
      totalMarks: 25,
      obtainedMarks: 22,
      percentage: 88,
      grade: 'A',
      passingMarks: 10,
      teacher: 'Mrs. Jennifer Thomas',
      questions: 12,
      correctAnswers: 11,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '45 mins',
      percentile: 90,
      remarks: 'Outstanding vocabulary! Keep reading to expand further.'
    },

    // Social Science Results
    {
      id: '16',
      testTitle: 'History - Freedom Struggle Test',
      subject: 'Social Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-12-05',
      totalMarks: 25,
      obtainedMarks: 22,
      percentage: 88,
      grade: 'A',
      passingMarks: 10,
      teacher: 'Mr. Vijay Shankar',
      questions: 12,
      correctAnswers: 10,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '56 mins',
      percentile: 87,
      remarks: 'Good knowledge of Indian Independence Movement. Well prepared!'
    },
    {
      id: '17',
      testTitle: 'Geography Unit Test',
      subject: 'Social Science',
      type: 'midterm',
      status: 'passed',
      date: '2024-11-24',
      totalMarks: 40,
      obtainedMarks: 34,
      percentage: 85,
      grade: 'A',
      passingMarks: 16,
      teacher: 'Mrs. Meena Sundaram',
      questions: 18,
      correctAnswers: 15,
      incorrectAnswers: 3,
      unattempted: 0,
      timeSpent: '82 mins',
      percentile: 84,
      remarks: 'Strong understanding of physiographic divisions. Practice map work more.'
    },
    {
      id: '18',
      testTitle: 'Civics - Democratic Politics Quiz',
      subject: 'Social Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-11-17',
      totalMarks: 20,
      obtainedMarks: 18,
      percentage: 90,
      grade: 'A',
      passingMarks: 8,
      teacher: 'Dr. Anand Krishnan',
      questions: 10,
      correctAnswers: 9,
      incorrectAnswers: 1,
      unattempted: 0,
      timeSpent: '42 mins',
      percentile: 92,
      remarks: 'Excellent grasp of federalism and power sharing concepts!'
    },
    {
      id: '19',
      testTitle: 'Economics - Development Quiz',
      subject: 'Social Science',
      type: 'quiz',
      status: 'passed',
      date: '2024-10-22',
      totalMarks: 20,
      obtainedMarks: 17,
      percentage: 85,
      grade: 'A',
      passingMarks: 8,
      teacher: 'Mr. Raghavan Iyer',
      questions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      unattempted: 0,
      timeSpent: '38 mins',
      percentile: 83,
      remarks: 'Good understanding of economic sectors. Keep up the effort!'
    },

    // Quarterly Exams
    {
      id: '20',
      testTitle: 'Quarterly Examination - September 2024',
      subject: 'All Subjects',
      type: 'final',
      status: 'passed',
      date: '2024-09-29',
      totalMarks: 500,
      obtainedMarks: 435,
      percentage: 87,
      grade: 'A',
      passingMarks: 175,
      teacher: 'All Teachers',
      questions: 200,
      correctAnswers: 174,
      incorrectAnswers: 26,
      unattempted: 0,
      timeSpent: '15 hours',
      percentile: 95,
      remarks: 'Excellent overall performance! Rank 5 out of 45. Keep maintaining this standard.'
    }
  ];

  const typeColors = {
    quiz: '#06b6d4',
    midterm: '#8b5cf6',
    final: '#ef4444',
    assignment: '#10ac8b',
    practice: '#f59e0b'
  };

  const typeIcons = {
    quiz: 'fa-question-circle',
    midterm: 'fa-file-alt',
    final: 'fa-trophy',
    assignment: 'fa-tasks',
    practice: 'fa-dumbbell'
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return '#10ac8b';
    if (grade === 'B+' || grade === 'B') return '#3b82f6';
    if (grade === 'C+' || grade === 'C') return '#f59e0b';
    if (grade === 'D') return '#f97316';
    return '#ef4444';
  };

  const filteredResults = results.filter(result => {
    const matchesStatus = selectedFilter === 'all' || result.status === selectedFilter;
    const matchesType = selectedType === 'all' || result.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || result.subject === selectedSubject;

    if (selectedPeriod === 'all') return matchesStatus && matchesType && matchesSubject;

    const resultDate = new Date(result.date);
    const now = new Date();

    if (selectedPeriod === 'month') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return matchesStatus && matchesType && matchesSubject && resultDate >= oneMonthAgo;
    }
    if (selectedPeriod === 'lastMonth') {
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return matchesStatus && matchesType && matchesSubject && resultDate >= twoMonthsAgo && resultDate < oneMonthAgo;
    }
    if (selectedPeriod === 'semester') {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      return matchesStatus && matchesType && matchesSubject && resultDate >= sixMonthsAgo;
    }

    return matchesStatus && matchesType && matchesSubject;
  });

  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const overallAverage = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);
  const highestScore = Math.max(...results.map(r => r.percentage));
  const passRate = Math.round((passedTests / results.length) * 100);

  const subjects = ['all', ...Array.from(new Set(results.map(r => r.subject)))];

  const handleViewDetails = (result: Result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const handleDownloadCertificate = (result: Result) => {
    alert(`Downloading certificate for: ${result.testTitle}`);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-chart-bar" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Test Results & Performance
            </h1>
            <p>Track your academic progress and view detailed test results</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-info">
              <h4>Overall Average</h4>
              <p className="stat-value">
                {overallAverage}% <span className="stat-total">score</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${overallAverage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-double"></i>
            </div>
            <div className="stat-info">
              <h4>Tests Completed</h4>
              <p className="stat-value">
                {results.length} <span className="stat-total">total</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-info">
              <h4>Highest Score</h4>
              <p className="stat-value">
                {highestScore}% <span className="stat-total">achieved</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${highestScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Pass Rate</h4>
              <p className="stat-value">
                {passRate}% <span className="stat-total">passed</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${passRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1rem', fontWeight: 600 }}>
          <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
          Performance Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Passed Tests</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#10ac8b' }}>{passedTests}</p>
          </div>

          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Failed Tests</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{failedTests}</p>
          </div>

          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Average Percentile</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#094d88' }}>
              {Math.round(results.reduce((sum, r) => sum + r.percentile, 0) / results.length)}
            </p>
          </div>

          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Total Marks Obtained</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#094d88' }}>
              {results.reduce((sum, r) => sum + r.obtainedMarks, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section - Professional */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-filter"></i> Filter by Status
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Results</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-layer-group"></i> Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="assignment">Assignment</option>
              <option value="practice">Practice</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-book"></i> Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Subjects</option>
              {subjects.filter(s => s !== 'all').map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-calendar"></i> Filter by Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedType('all');
                setSelectedSubject('all');
                setSelectedPeriod('all');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-redo"></i> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: '#718096', fontSize: '1rem', fontWeight: 600 }}>
          Showing <span style={{ color: '#10ac8b', fontWeight: 700 }}>{filteredResults.length}</span> of {results.length} results
        </p>
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredResults.map((result) => (
            <div
              key={result.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: `2px solid ${result.status === 'passed' ? '#10ac8b20' : '#ef444420'}`,
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = result.status === 'passed' ? '#10ac8b' : '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = result.status === 'passed' ? '#10ac8b20' : '#ef444420';
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: result.status === 'passed' ? '#10ac8b' : '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}>
                <i className={`fas ${result.status === 'passed' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {result.status}
              </div>

              {/* Result Header */}
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                paddingTop: '3.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#094d88',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${typeIcons[result.type]}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {result.testTitle}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#e2e8f0',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '6px',
                        color: '#2d3748',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {result.subject}
                      </span>
                      <span style={{
                        background: '#e2e8f0',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '6px',
                        color: '#2d3748',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {result.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Score Display */}
                <div style={{
                  background: `linear-gradient(135deg, ${getGradeColor(result.grade)}10 0%, ${getGradeColor(result.grade)}05 100%)`,
                  border: `3px solid ${getGradeColor(result.grade)}30`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '80px',
                    height: '80px',
                    background: getGradeColor(result.grade),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${getGradeColor(result.grade)}40`,
                    border: '4px solid white'
                  }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>{result.grade}</span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>
                      Score Achieved
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: getGradeColor(result.grade) }}>
                        {result.obtainedMarks}
                      </p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#718096' }}>
                        / {result.totalMarks}
                      </p>
                      <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: getGradeColor(result.grade), marginLeft: 'auto' }}>
                        {result.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${result.percentage}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${getGradeColor(result.grade)} 0%, ${getGradeColor(result.grade)}dd 100%)`,
                        borderRadius: '10px',
                        transition: 'width 1s ease',
                        boxShadow: `0 0 10px ${getGradeColor(result.grade)}60`
                      }}></div>
                      {/* Passing marks indicator */}
                      <div style={{
                        position: 'absolute',
                        left: `${(result.passingMarks / result.totalMarks) * 100}%`,
                        top: '-4px',
                        width: '2px',
                        height: '20px',
                        background: '#718096',
                        borderRadius: '2px'
                      }}></div>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Passing marks: {result.passingMarks}/{result.totalMarks}
                    </p>
                  </div>
                </div>

                {/* Performance Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                        Correct Answers
                      </p>
                      <i className="fas fa-check" style={{ color: '#10ac8b', fontSize: '1rem' }}></i>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.5rem', color: '#10ac8b', fontWeight: 700 }}>
                      {result.correctAnswers}/{result.questions}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                        Incorrect
                      </p>
                      <i className="fas fa-times" style={{ color: '#ef4444', fontSize: '1rem' }}></i>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.5rem', color: '#ef4444', fontWeight: 700 }}>
                      {result.incorrectAnswers}/{result.questions}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                        Time Spent
                      </p>
                      <i className="fas fa-clock" style={{ color: '#094d88', fontSize: '1rem' }}></i>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.25rem', color: '#094d88', fontWeight: 700 }}>
                      {result.timeSpent}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                        Percentile
                      </p>
                      <i className="fas fa-chart-line" style={{ color: '#8b5cf6', fontSize: '1rem' }}></i>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.5rem', color: '#8b5cf6', fontWeight: 700 }}>
                      {result.percentile}th
                    </p>
                  </div>
                </div>

                {/* Teacher Remarks */}
                {result.remarks && (
                  <div style={{
                    background: '#fef3c7',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <i className="fas fa-comment-dots" style={{ color: '#f59e0b', fontSize: '1.25rem', marginTop: '0.25rem' }}></i>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                          Teacher's Remarks
                        </p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#78350f', lineHeight: 1.6, fontStyle: 'italic' }}>
                          "{result.remarks}"
                        </p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>
                          - {result.teacher}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Info */}
                <div style={{
                  background: '#f7fafc',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#094d88', fontSize: '1rem' }}></i>
                    <span style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 600 }}>
                      {new Date(result.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-chalkboard-teacher" style={{ color: '#094d88', fontSize: '1rem' }}></i>
                    <span style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 600 }}>
                      {result.teacher}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleViewDetails(result)}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>

                  {result.status === 'passed' && (
                    <button
                      onClick={() => handleDownloadCertificate(result)}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'white',
                        border: '2px solid #10ac8b',
                        borderRadius: '12px',
                        color: '#10ac8b',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#10ac8b';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#10ac8b';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="fas fa-download"></i>
                      Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f7fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#718096' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Results Found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            Try adjusting your filters to see more results
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedResult && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: `linear-gradient(135deg, ${typeColors[selectedResult.type]} 0%, ${typeColors[selectedResult.type]}dd 100%)`,
              padding: '2rem',
              borderRadius: '24px 24px 0 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '180px',
                height: '180px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '1.75rem', fontWeight: 700, flex: 1 }}>
                    {selectedResult.testTitle}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>
                    {selectedResult.subject}
                  </span>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {selectedResult.type}
                  </span>
                  <span style={{
                    background: selectedResult.status === 'passed' ? '#10ac8b' : '#ef4444',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {selectedResult.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                Detailed Performance Analysis
              </h3>

              {/* Detailed Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10ac8b 0%, #0d8b70 100%)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.9 }}>Correct</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{selectedResult.correctAnswers}</p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-times-circle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.9 }}>Incorrect</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{selectedResult.incorrectAnswers}</p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-minus-circle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.9 }}>Unattempted</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{selectedResult.unattempted}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div style={{
                background: '#f7fafc',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1rem', fontWeight: 700 }}>
                  Test Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Date Taken
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      {new Date(selectedResult.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Time Spent
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      {selectedResult.timeSpent}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Teacher
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      {selectedResult.teacher}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Percentile Rank
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      {selectedResult.percentile}th percentile
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Message */}
              <div style={{
                background: selectedResult.status === 'passed' ? '#d1fae5' : '#fee2e2',
                border: `3px solid ${selectedResult.status === 'passed' ? '#10ac8b' : '#ef4444'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <i className={`fas ${selectedResult.status === 'passed' ? 'fa-trophy' : 'fa-exclamation-triangle'}`} style={{
                  fontSize: '3rem',
                  color: selectedResult.status === 'passed' ? '#10ac8b' : '#ef4444',
                  marginBottom: '1rem'
                }}></i>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: selectedResult.status === 'passed' ? '#065f46' : '#7f1d1d',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {selectedResult.status === 'passed' ? 'Congratulations!' : 'Keep Practicing!'}
                </h3>
                <p style={{
                  margin: 0,
                  color: selectedResult.status === 'passed' ? '#047857' : '#991b1b',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  {selectedResult.status === 'passed'
                    ? `You've successfully passed this test with ${selectedResult.percentage.toFixed(1)}%. Great job!`
                    : `You scored ${selectedResult.percentage.toFixed(1)}%. Review the material and try again.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Results;
