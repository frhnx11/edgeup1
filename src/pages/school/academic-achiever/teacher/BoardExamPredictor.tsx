import { useState } from 'react';
import '../Dashboard.css';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  predictedScore: number;
  confidence: number;
  rank: number;
  subjects: {
    [key: string]: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      strength: 'strong' | 'moderate' | 'weak';
    };
  };
  riskLevel: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface Class {
  id: string;
  name: string;
  section: string;
  totalStudents: number;
  avgPredictedScore: number;
  topPerformer: string;
  atRiskCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface Batch {
  id: string;
  name: string;
  year: string;
  totalClasses: number;
  totalStudents: number;
  avgPredictedScore: number;
  classes: Class[];
}

const BoardExamPredictor = () => {
  const [activeTab, setActiveTab] = useState<'batches' | 'classes' | 'students'>('batches');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'name'>('rank');
  const [showHistorical, setShowHistorical] = useState(false);

  // Sample data - In production, this would come from API
  const batches: Batch[] = [
    {
      id: 'batch-2025',
      name: 'Batch 2025',
      year: '2024-2025',
      totalClasses: 4,
      totalStudents: 142,
      avgPredictedScore: 88.5,
      classes: [
        {
          id: 'class-10a',
          name: 'Class 10-A',
          section: 'A',
          totalStudents: 35,
          avgPredictedScore: 91.2,
          topPerformer: 'Rajesh Kumar',
          atRiskCount: 2,
          trend: 'up'
        },
        {
          id: 'class-10b',
          name: 'Class 10-B',
          section: 'B',
          totalStudents: 38,
          avgPredictedScore: 87.5,
          topPerformer: 'Priya Sharma',
          atRiskCount: 4,
          trend: 'stable'
        },
        {
          id: 'class-10c',
          name: 'Class 10-C',
          section: 'C',
          totalStudents: 36,
          avgPredictedScore: 86.8,
          topPerformer: 'Arun Patel',
          atRiskCount: 5,
          trend: 'up'
        },
        {
          id: 'class-10d',
          name: 'Class 10-D',
          section: 'D',
          totalStudents: 33,
          avgPredictedScore: 88.9,
          topPerformer: 'Sneha Reddy',
          atRiskCount: 3,
          trend: 'down'
        }
      ]
    },
    {
      id: 'batch-2024',
      name: 'Batch 2024',
      year: '2023-2024',
      totalClasses: 4,
      totalStudents: 156,
      avgPredictedScore: 85.3,
      classes: []
    }
  ];

  const students: Student[] = [
    {
      id: 'stu-001',
      name: 'Rajesh Kumar',
      rollNumber: '10A-001',
      predictedScore: 96.5,
      confidence: 94,
      rank: 1,
      subjects: {
        Mathematics: { score: 98, trend: 'up', strength: 'strong' },
        Science: { score: 97, trend: 'up', strength: 'strong' },
        English: { score: 95, trend: 'stable', strength: 'strong' },
        'Social Science': { score: 94, trend: 'up', strength: 'strong' },
        Tamil: { score: 96, trend: 'stable', strength: 'strong' }
      },
      riskLevel: 'low',
      recommendation: 'Excellent performance across all subjects. Continue with current study pattern and focus on maintaining consistency.'
    },
    {
      id: 'stu-002',
      name: 'Priya Sharma',
      rollNumber: '10B-002',
      predictedScore: 94.8,
      confidence: 92,
      rank: 2,
      subjects: {
        Mathematics: { score: 96, trend: 'up', strength: 'strong' },
        Science: { score: 95, trend: 'stable', strength: 'strong' },
        English: { score: 97, trend: 'up', strength: 'strong' },
        'Social Science': { score: 92, trend: 'stable', strength: 'strong' },
        Tamil: { score: 94, trend: 'up', strength: 'strong' }
      },
      riskLevel: 'low',
      recommendation: 'Strong performer with excellent English skills. Consider advanced reading materials to further enhance comprehension.'
    },
    {
      id: 'stu-003',
      name: 'Arun Patel',
      rollNumber: '10C-003',
      predictedScore: 93.2,
      confidence: 89,
      rank: 3,
      subjects: {
        Mathematics: { score: 97, trend: 'up', strength: 'strong' },
        Science: { score: 94, trend: 'stable', strength: 'strong' },
        English: { score: 89, trend: 'down', strength: 'moderate' },
        'Social Science': { score: 93, trend: 'up', strength: 'strong' },
        Tamil: { score: 93, trend: 'stable', strength: 'strong' }
      },
      riskLevel: 'low',
      recommendation: 'Excellent in STEM subjects. English shows declining trend - recommend additional reading practice and grammar exercises.'
    },
    {
      id: 'stu-004',
      name: 'Sneha Reddy',
      rollNumber: '10D-004',
      predictedScore: 91.5,
      confidence: 88,
      rank: 4,
      subjects: {
        Mathematics: { score: 89, trend: 'stable', strength: 'strong' },
        Science: { score: 92, trend: 'up', strength: 'strong' },
        English: { score: 94, trend: 'up', strength: 'strong' },
        'Social Science': { score: 91, trend: 'stable', strength: 'strong' },
        Tamil: { score: 92, trend: 'up', strength: 'strong' }
      },
      riskLevel: 'low',
      recommendation: 'Well-balanced performance. Focus on advanced mathematics problem-solving to boost overall score.'
    },
    {
      id: 'stu-005',
      name: 'Vikram Singh',
      rollNumber: '10A-005',
      predictedScore: 89.7,
      confidence: 85,
      rank: 5,
      subjects: {
        Mathematics: { score: 92, trend: 'up', strength: 'strong' },
        Science: { score: 91, trend: 'stable', strength: 'strong' },
        English: { score: 85, trend: 'stable', strength: 'moderate' },
        'Social Science': { score: 89, trend: 'up', strength: 'strong' },
        Tamil: { score: 91, trend: 'up', strength: 'strong' }
      },
      riskLevel: 'low',
      recommendation: 'Strong in core subjects. English needs improvement - suggest vocabulary building and essay writing practice.'
    },
    {
      id: 'stu-006',
      name: 'Meera Iyer',
      rollNumber: '10B-006',
      predictedScore: 75.3,
      confidence: 78,
      rank: 28,
      subjects: {
        Mathematics: { score: 68, trend: 'down', strength: 'weak' },
        Science: { score: 72, trend: 'stable', strength: 'moderate' },
        English: { score: 82, trend: 'up', strength: 'strong' },
        'Social Science': { score: 79, trend: 'stable', strength: 'moderate' },
        Tamil: { score: 76, trend: 'down', strength: 'moderate' }
      },
      riskLevel: 'high',
      recommendation: 'URGENT: Mathematics showing declining trend. Immediate intervention needed with extra tutoring sessions. Schedule parent meeting and create personalized study plan.'
    },
    {
      id: 'stu-007',
      name: 'Karthik Nair',
      rollNumber: '10C-007',
      predictedScore: 73.8,
      confidence: 76,
      rank: 32,
      subjects: {
        Mathematics: { score: 71, trend: 'stable', strength: 'moderate' },
        Science: { score: 69, trend: 'down', strength: 'weak' },
        English: { score: 78, trend: 'up', strength: 'moderate' },
        'Social Science': { score: 75, trend: 'stable', strength: 'moderate' },
        Tamil: { score: 76, trend: 'stable', strength: 'moderate' }
      },
      riskLevel: 'high',
      recommendation: 'AT RISK: Science performance declining. Recommend hands-on lab practice, concept revision sessions, and peer study groups.'
    },
    {
      id: 'stu-008',
      name: 'Divya Krishnan',
      rollNumber: '10D-008',
      predictedScore: 81.5,
      confidence: 82,
      rank: 15,
      subjects: {
        Mathematics: { score: 79, trend: 'stable', strength: 'moderate' },
        Science: { score: 81, trend: 'up', strength: 'moderate' },
        English: { score: 86, trend: 'up', strength: 'strong' },
        'Social Science': { score: 82, trend: 'stable', strength: 'moderate' },
        Tamil: { score: 80, trend: 'stable', strength: 'moderate' }
      },
      riskLevel: 'medium',
      recommendation: 'Moderate performer with potential. Focus on mathematics fundamentals and provide additional problem-solving worksheets.'
    }
  ];

  const getFilteredStudents = () => {
    let filtered = students;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by risk level
    if (filterRisk !== 'all') {
      filtered = filtered.filter((s) => s.riskLevel === filterRisk);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'score') return b.predictedScore - a.predictedScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  };

  const topPerformers = students.slice(0, 10);
  const atRiskStudents = students.filter((s) => s.riskLevel === 'high');

  const handleDownloadReport = () => {
    alert('Downloading comprehensive prediction report...\n\nThis will generate a PDF with:\n- Overall batch analysis\n- Class-wise comparisons\n- Individual student predictions\n- Subject-wise insights\n- AI recommendations');
  };

  const handleShowRecommendations = (student: Student) => {
    setSelectedStudent(student);
    setShowRecommendations(true);
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return '#ef4444';
    if (risk === 'medium') return '#f59e0b';
    return '#10ac8b';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return 'fa-arrow-up';
    if (trend === 'down') return 'fa-arrow-down';
    return 'fa-minus';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return '#10ac8b';
    if (trend === 'down') return '#ef4444';
    return '#6c757d';
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #094d88 0%, #0a6aa1 50%, #10ac8b 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '12px' }}></i>
              Board Exam Predictor
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0' }}>
              AI-powered prediction and analysis for board exam performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowHistorical(!showHistorical)}
              style={{
                padding: '12px 24px',
                backgroundColor: showHistorical ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-history" style={{ marginRight: '8px' }}></i>
              {showHistorical ? 'Current View' : 'Historical Compare'}
            </button>
            <button
              onClick={handleDownloadReport}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#094d88',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Download Report
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Total Students Analyzed
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>142</div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Average Predicted Score
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>88.5%</div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Predicted Top Scorer
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
              Rajesh Kumar
              <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>96.5%</div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Students At Risk
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffa500' }}>
              {atRiskStudents.length}
              <span style={{ fontSize: '14px', marginLeft: '8px', opacity: 0.9 }}>need attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {/* Top Performers */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 172, 139, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}
            >
              <i className="fas fa-trophy" style={{ fontSize: '24px', color: '#10ac8b' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                Top 10 Predicted Performers
              </h3>
              <p style={{ fontSize: '13px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Students likely to score highest in board exams
              </p>
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {topPerformers.slice(0, 5).map((student, index) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e9ecef',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: index < 3 ? '#ffffff' : '#6c757d',
                    marginRight: '12px'
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>{student.name}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{student.rollNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#10ac8b' }}>
                    {student.predictedScore}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#6c757d' }}>{student.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Students */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}
            >
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px', color: '#ef4444' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                Students At Risk
              </h3>
              <p style={{ fontSize: '13px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Requires immediate intervention and support
              </p>
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {atRiskStudents.map((student, index) => (
              <div
                key={student.id}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>{student.rollNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>
                      {student.predictedScore}%
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}
                    >
                      HIGH RISK
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleShowRecommendations(student)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#094d88',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-brain" style={{ marginRight: '6px' }}></i>
                  View AI Recommendations
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Class Performance Comparison */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(9, 77, 136, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}
            >
              <i className="fas fa-chart-bar" style={{ fontSize: '24px', color: '#094d88' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                Class Performance Comparison
              </h3>
              <p style={{ fontSize: '13px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Average predicted scores across classes
              </p>
            </div>
          </div>
          <div>
            {batches[0].classes.map((cls) => (
              <div
                key={cls.id}
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>{cls.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i
                      className={`fas ${getTrendIcon(cls.trend)}`}
                      style={{ fontSize: '12px', color: getTrendColor(cls.trend) }}
                    ></i>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#094d88' }}>
                      {cls.avgPredictedScore}%
                    </span>
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cls.avgPredictedScore}%`,
                      backgroundColor: '#10ac8b',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6c757d'
                  }}
                >
                  <span>{cls.totalStudents} students</span>
                  <span>
                    {cls.atRiskCount} at risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Analysis */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}
            >
              <i className="fas fa-book-open" style={{ fontSize: '24px', color: '#f59e0b' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                Subject-wise Analysis
              </h3>
              <p style={{ fontSize: '13px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Performance trends across subjects
              </p>
            </div>
          </div>
          <div>
            {[
              { name: 'Mathematics', avg: 87.5, trend: 'up', color: '#3b82f6' },
              { name: 'Science', avg: 89.2, trend: 'up', color: '#10ac8b' },
              { name: 'English', avg: 88.8, trend: 'stable', color: '#8b5cf6' },
              { name: 'Social Science', avg: 86.3, trend: 'down', color: '#f59e0b' },
              { name: 'Tamil', avg: 88.1, trend: 'up', color: '#ec4899' }
            ].map((subject) => (
              <div
                key={subject.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div
                    style={{
                      width: '8px',
                      height: '40px',
                      backgroundColor: subject.color,
                      borderRadius: '4px'
                    }}
                  ></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>{subject.name}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Batch average</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i
                    className={`fas ${getTrendIcon(subject.trend)}`}
                    style={{ fontSize: '14px', color: getTrendColor(subject.trend) }}
                  ></i>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#212529', minWidth: '60px', textAlign: 'right' }}>
                    {subject.avg}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e9ecef',
            marginBottom: '24px'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('batches');
              setSelectedBatch(null);
              setSelectedClass(null);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'batches' ? '#094d88' : '#6c757d',
              border: 'none',
              borderBottom: activeTab === 'batches' ? '3px solid #094d88' : 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '-2px'
            }}
          >
            <i className="fas fa-layer-group" style={{ marginRight: '8px' }}></i>
            All Batches
          </button>
          <button
            onClick={() => {
              setActiveTab('classes');
              setSelectedClass(null);
            }}
            disabled={!selectedBatch}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'classes' ? '#094d88' : '#6c757d',
              border: 'none',
              borderBottom: activeTab === 'classes' ? '3px solid #094d88' : 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: selectedBatch ? 'pointer' : 'not-allowed',
              opacity: selectedBatch ? 1 : 0.5,
              transition: 'all 0.3s ease',
              marginBottom: '-2px'
            }}
          >
            <i className="fas fa-chalkboard" style={{ marginRight: '8px' }}></i>
            Class Details
          </button>
          <button
            onClick={() => setActiveTab('students')}
            disabled={!selectedClass}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'students' ? '#094d88' : '#6c757d',
              border: 'none',
              borderBottom: activeTab === 'students' ? '3px solid #094d88' : 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: selectedClass ? 'pointer' : 'not-allowed',
              opacity: selectedClass ? 1 : 0.5,
              transition: 'all 0.3s ease',
              marginBottom: '-2px'
            }}
          >
            <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
            Student Analysis
          </button>
        </div>

        {/* Batches Tab */}
        {activeTab === 'batches' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '20px' }}>
              All Batches Overview
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Batch
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Academic Year
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Classes
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Students
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Avg Predicted Score
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                      {batch.name}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6c757d' }}>{batch.year}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                      {batch.totalClasses}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                      {batch.totalStudents}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(16, 172, 139, 0.1)',
                          color: '#10ac8b',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}
                      >
                        {batch.avgPredictedScore}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedBatch(batch.id);
                          setActiveTab('classes');
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#094d88',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        View Classes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && selectedBatch && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                Classes in {batches.find((b) => b.id === selectedBatch)?.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedBatch(null);
                  setActiveTab('batches');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                Back to Batches
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Students
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Top Performer
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Avg Score
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    At Risk
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Trend
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches
                  .find((b) => b.id === selectedBatch)
                  ?.classes.map((cls) => (
                    <tr key={cls.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                        {cls.name}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                        {cls.totalStudents}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6c757d' }}>{cls.topPerformer}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'rgba(16, 172, 139, 0.1)',
                            color: '#10ac8b',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}
                        >
                          {cls.avgPredictedScore}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}
                        >
                          {cls.atRiskCount}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <i
                          className={`fas ${getTrendIcon(cls.trend)}`}
                          style={{ fontSize: '16px', color: getTrendColor(cls.trend) }}
                        ></i>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedClass(cls.id);
                            setActiveTab('students');
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#094d88',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          View Students
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', margin: '0' }}>
                  Student Predictions
                  {selectedClass && (
                    <span style={{ fontSize: '14px', fontWeight: '400', color: '#6c757d', marginLeft: '12px' }}>
                      ({batches.find((b) => b.id === selectedBatch)?.classes.find((c) => c.id === selectedClass)?.name})
                    </span>
                  )}
                </h3>
                {selectedClass && (
                  <button
                    onClick={() => {
                      setSelectedClass(null);
                      setActiveTab('classes');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f8f9fa',
                      color: '#6c757d',
                      border: '1px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                    Back to Classes
                  </button>
                )}
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="rank">Sort by Rank</option>
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Student
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Roll Number
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Predicted Score
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Confidence
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Risk Level
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6c757d',
                      borderBottom: '2px solid #e9ecef'
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredStudents().map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor:
                            student.rank === 1
                              ? '#ffd700'
                              : student.rank === 2
                              ? '#c0c0c0'
                              : student.rank === 3
                              ? '#cd7f32'
                              : '#e9ecef',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: student.rank <= 3 ? '#ffffff' : '#6c757d'
                        }}
                      >
                        {student.rank}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                      {student.name}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                      {student.rollNumber}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          backgroundColor:
                            student.predictedScore >= 90
                              ? 'rgba(16, 172, 139, 0.1)'
                              : student.predictedScore >= 75
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(239, 68, 68, 0.1)',
                          color:
                            student.predictedScore >= 90
                              ? '#10ac8b'
                              : student.predictedScore >= 75
                              ? '#f59e0b'
                              : '#ef4444',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}
                      >
                        {student.predictedScore}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                      {student.confidence}%
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          backgroundColor: `${getRiskColor(student.riskLevel)}15`,
                          color: getRiskColor(student.riskLevel),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {student.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleShowRecommendations(student)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#094d88',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-eye" style={{ marginRight: '6px' }}></i>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Recommendations Modal */}
      {showRecommendations && selectedStudent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowRecommendations(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                padding: '24px',
                borderRadius: '16px 16px 0 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>
                    <i className="fas fa-brain" style={{ marginRight: '12px' }}></i>
                    AI Recommendations
                  </h2>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: '0' }}>
                    Personalized insights for {selectedStudent.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowRecommendations(false)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Student Overview */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Student</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                    {selectedStudent.rollNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Predicted Score</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10ac8b' }}>
                    {selectedStudent.predictedScore}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                    Rank #{selectedStudent.rank} · {selectedStudent.confidence}% confidence
                  </div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '16px' }}>
                  Subject-wise Performance
                </h3>
                {Object.entries(selectedStudent.subjects).map(([subject, data]) => (
                  <div
                    key={subject}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>{subject}</div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            backgroundColor:
                              data.strength === 'strong'
                                ? 'rgba(16, 172, 139, 0.1)'
                                : data.strength === 'moderate'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            color:
                              data.strength === 'strong'
                                ? '#10ac8b'
                                : data.strength === 'moderate'
                                ? '#f59e0b'
                                : '#ef4444',
                            borderRadius: '4px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}
                        >
                          {data.strength}
                        </span>
                        <i
                          className={`fas ${getTrendIcon(data.trend)}`}
                          style={{ fontSize: '12px', color: getTrendColor(data.trend) }}
                        ></i>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: data.score >= 90 ? '#10ac8b' : data.score >= 75 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {data.score}%
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recommendation */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(9, 77, 136, 0.05)',
                  border: '2px solid rgba(9, 77, 136, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#094d88',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}
                  >
                    <i className="fas fa-lightbulb" style={{ fontSize: '20px', color: '#ffffff' }}></i>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', margin: '0' }}>
                    Personalized Recommendation
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#212529', lineHeight: '1.6', margin: '0' }}>
                  {selectedStudent.recommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#094d88',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>
                  Schedule Meeting
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#10ac8b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardExamPredictor;
