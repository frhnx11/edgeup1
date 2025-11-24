import { useState } from 'react';
import QuestionPaperGenerator from '../QuestionPaperGenerator';
import OCRCorrection from '../OCRCorrection';
import AssignmentGenerator from './AssignmentGenerator';

type MainTab = 'dashboard' | 'create' | 'question-papers' | 'evaluate-mcq' | 'evaluate-descriptive' | 'ocr-correction' | 'plagiarism' | 'tracker';

interface Assessment {
  id: string;
  title: string;
  type: 'MCQ' | 'Descriptive' | 'Mixed';
  subject: string;
  topic: string;
  courseOutcomes: string[];
  dueDate: string;
  totalMarks: number;
  totalSubmissions: number;
  evaluated: number;
  status: 'Draft' | 'Published' | 'Completed';
  createdAt: string;
}

interface Submission {
  id: string;
  assessmentId: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: 'Pending' | 'Evaluated' | 'Flagged';
  marksObtained?: number;
  totalMarks: number;
  plagiarismScore?: number;
  answers: any;
}

interface Template {
  id: string;
  name: string;
  type: 'MCQ' | 'Descriptive' | 'Mixed';
  subject: string;
  description: string;
  questionsCount: number;
  duration: number;
  bloomLevel: string;
}

const SmartAssessmentSuite = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [evaluationFilter, setEvaluationFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewingResults, setViewingResults] = useState<Assessment | null>(null);

  // Create Assessment Form State
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    type: 'MCQ' as 'MCQ' | 'Descriptive' | 'Mixed',
    subject: '',
    topic: '',
    courseOutcomes: [] as string[],
    dueDate: '',
    totalMarks: 100,
    duration: 60,
    template: ''
  });

  // Mock Data
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Data Structures - Mid Term Exam',
      type: 'MCQ',
      subject: 'Data Structures',
      topic: 'Trees and Graphs',
      courseOutcomes: ['CO1', 'CO2', 'CO3'],
      dueDate: '2025-12-01',
      totalMarks: 100,
      totalSubmissions: 45,
      evaluated: 45,
      status: 'Completed',
      createdAt: '2025-11-10'
    },
    {
      id: '2',
      title: 'Operating Systems - Assignment 3',
      type: 'Descriptive',
      subject: 'Operating Systems',
      topic: 'Process Synchronization',
      courseOutcomes: ['CO2', 'CO4'],
      dueDate: '2025-11-25',
      totalMarks: 50,
      totalSubmissions: 38,
      evaluated: 12,
      status: 'Published',
      createdAt: '2025-11-15'
    },
    {
      id: '3',
      title: 'Database Systems - Quiz 2',
      type: 'Mixed',
      subject: 'Database Systems',
      topic: 'Normalization',
      courseOutcomes: ['CO1', 'CO3'],
      dueDate: '2025-11-28',
      totalMarks: 30,
      totalSubmissions: 42,
      evaluated: 0,
      status: 'Published',
      createdAt: '2025-11-18'
    },
    {
      id: '4',
      title: 'Computer Networks - Case Study',
      type: 'Descriptive',
      subject: 'Computer Networks',
      topic: 'Network Security',
      courseOutcomes: ['CO3', 'CO5'],
      dueDate: '2025-12-05',
      totalMarks: 40,
      totalSubmissions: 0,
      evaluated: 0,
      status: 'Draft',
      createdAt: '2025-11-19'
    }
  ]);

  const submissions: Submission[] = [
    {
      id: 'sub1',
      assessmentId: '2',
      studentName: 'Aravind Kumar',
      studentId: 'CS21001',
      submittedAt: '2025-11-20 14:30',
      status: 'Pending',
      totalMarks: 50,
      plagiarismScore: 8,
      answers: {}
    },
    {
      id: 'sub2',
      assessmentId: '2',
      studentName: 'Priya Sharma',
      studentId: 'CS21002',
      submittedAt: '2025-11-20 15:45',
      status: 'Evaluated',
      marksObtained: 42,
      totalMarks: 50,
      plagiarismScore: 5,
      answers: {}
    },
    {
      id: 'sub3',
      assessmentId: '2',
      studentName: 'Rahul Mehta',
      studentId: 'CS21003',
      submittedAt: '2025-11-21 10:20',
      status: 'Flagged',
      totalMarks: 50,
      plagiarismScore: 45,
      answers: {}
    }
  ];

  const templates: Template[] = [
    {
      id: 't1',
      name: 'Quick MCQ - 20 Questions',
      type: 'MCQ',
      subject: 'General',
      description: 'Standard MCQ template with 20 multiple choice questions',
      questionsCount: 20,
      duration: 30,
      bloomLevel: 'Remembering, Understanding'
    },
    {
      id: 't2',
      name: 'Comprehensive Mid-Term Exam',
      type: 'Mixed',
      subject: 'General',
      description: 'Mix of MCQ and descriptive questions for mid-term evaluation',
      questionsCount: 40,
      duration: 120,
      bloomLevel: 'All Levels'
    },
    {
      id: 't3',
      name: 'Assignment - Problem Solving',
      type: 'Descriptive',
      subject: 'General',
      description: 'Long-form answers for complex problem-solving',
      questionsCount: 5,
      duration: 180,
      bloomLevel: 'Applying, Analyzing, Creating'
    },
    {
      id: 't4',
      name: 'Quick Quiz - 10 Questions',
      type: 'MCQ',
      subject: 'General',
      description: 'Short quiz for quick assessment',
      questionsCount: 10,
      duration: 15,
      bloomLevel: 'Remembering'
    }
  ];

  const courseOutcomes = [
    { id: 'CO1', name: 'Understand fundamental concepts', attainment: 78 },
    { id: 'CO2', name: 'Apply knowledge to solve problems', attainment: 72 },
    { id: 'CO3', name: 'Analyze complex scenarios', attainment: 65 },
    { id: 'CO4', name: 'Design solutions', attainment: 70 },
    { id: 'CO5', name: 'Evaluate and critique', attainment: 68 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Evaluated': return '#10ac8b';
      case 'Published': case 'Pending': return '#ff9800';
      case 'Draft': case 'Flagged': return '#f44336';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return 'fa-list-check';
      case 'Descriptive': return 'fa-file-lines';
      case 'Mixed': return 'fa-layer-group';
      default: return 'fa-file-alt';
    }
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { icon: 'fa-clipboard-list', label: 'Total Assessments', value: assessments.length, color: '#094d88' },
          { icon: 'fa-clock', label: 'Pending Evaluations', value: assessments.reduce((acc, a) => acc + (a.totalSubmissions - a.evaluated), 0), color: '#ff9800' },
          { icon: 'fa-check-circle', label: 'Evaluated This Week', value: '45', color: '#10ac8b' },
          { icon: 'fa-star', label: 'Average Score', value: '76%', color: '#9c27b0' }
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Assessments */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>
              <i className="fas fa-clipboard-list" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Recent Assessments
            </h3>
            <button onClick={() => setActiveTab('create')} style={{
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
              Create New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assessments.map((assessment) => (
              <div key={assessment.id} style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: `${getStatusColor(assessment.status)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getStatusColor(assessment.status)
                  }}>
                    <i className={`fas ${getTypeIcon(assessment.type)}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>{assessment.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {assessment.subject} • {assessment.topic} • Due: {assessment.dueDate}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {assessment.evaluated}/{assessment.totalSubmissions}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Evaluated</div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: `${getStatusColor(assessment.status)}15`,
                    color: getStatusColor(assessment.status),
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {assessment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
              <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#ff9800' }}></i>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: 'fa-plus-circle', label: 'Create Assessment', tab: 'create' as MainTab, color: '#094d88' },
                { icon: 'fa-check-double', label: 'Evaluate MCQ', tab: 'evaluate-mcq' as MainTab, color: '#10ac8b' },
                { icon: 'fa-pen-to-square', label: 'Evaluate Descriptive', tab: 'evaluate-descriptive' as MainTab, color: '#9c27b0' },
                { icon: 'fa-shield-halved', label: 'Check Plagiarism', tab: 'plagiarism' as MainTab, color: '#f44336' }
              ].map((action, idx) => (
                <button key={idx} onClick={() => setActiveTab(action.tab)} style={{
                  background: '#f8f9fa',
                  border: 'none',
                  padding: '12px 16px',
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
                }}>
                  <i className={`fas ${action.icon}`} style={{ color: action.color, fontSize: '18px' }}></i>
                  <span style={{ color: '#2c3e50', fontWeight: '500' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Evaluation Progress */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Evaluation Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {assessments.filter(a => a.status === 'Published').map((assessment) => {
                const progress = (assessment.evaluated / assessment.totalSubmissions) * 100;
                return (
                  <div key={assessment.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#2c3e50', fontWeight: '500' }}>
                        {assessment.title.length > 25 ? assessment.title.substring(0, 25) + '...' : assessment.title}
                      </span>
                      <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                        {assessment.evaluated}/{assessment.totalSubmissions}
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: progress === 100 ? '#10ac8b' : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Create Assessment Tab - Now using Assignment Generator
  const renderCreateAssessment = () => (
    <AssignmentGenerator onSave={(assignment) => {
      console.log('Assignment saved:', assignment);
      // You can add assignment to state or send to backend here
    }} />
  );

  // Legacy Create Assessment Tab (keeping for reference but not used)
  const renderCreateAssessmentOld = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      {/* Assessment Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-file-circle-plus" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Create New Assessment
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Assessment Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
              Assessment Title *
            </label>
            <input
              type="text"
              value={assessmentForm.title}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
              placeholder="e.g., Data Structures - Mid Term Exam"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#094d88'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Assessment Type */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
              Assessment Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {['MCQ', 'Descriptive', 'Mixed'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAssessmentForm({ ...assessmentForm, type: type as any })}
                  style={{
                    padding: '16px',
                    border: assessmentForm.type === type ? '2px solid #094d88' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    background: assessmentForm.type === type ? '#094d8810' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                  <i className={`fas ${getTypeIcon(type)}`} style={{
                    fontSize: '24px',
                    color: assessmentForm.type === type ? '#094d88' : '#666'
                  }}></i>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: assessmentForm.type === type ? '#094d88' : '#666'
                  }}>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Topic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Subject *
              </label>
              <select
                value={assessmentForm.subject}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                <option value="">Select Subject</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Database Systems">Database Systems</option>
                <option value="Computer Networks">Computer Networks</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Topic
              </label>
              <input
                type="text"
                value={assessmentForm.topic}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, topic: e.target.value })}
                placeholder="e.g., Trees and Graphs"
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

          {/* Course Outcomes */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
              Map to Course Outcomes
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {courseOutcomes.map((co) => (
                <button
                  key={co.id}
                  onClick={() => {
                    const updated = assessmentForm.courseOutcomes.includes(co.id)
                      ? assessmentForm.courseOutcomes.filter(c => c !== co.id)
                      : [...assessmentForm.courseOutcomes, co.id];
                    setAssessmentForm({ ...assessmentForm, courseOutcomes: updated });
                  }}
                  style={{
                    padding: '8px 16px',
                    border: assessmentForm.courseOutcomes.includes(co.id) ? '2px solid #10ac8b' : '2px solid #e0e0e0',
                    borderRadius: '20px',
                    background: assessmentForm.courseOutcomes.includes(co.id) ? '#10ac8b15' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: assessmentForm.courseOutcomes.includes(co.id) ? '#10ac8b' : '#666',
                    transition: 'all 0.3s ease'
                  }}>
                  {co.id}
                  {assessmentForm.courseOutcomes.includes(co.id) && (
                    <i className="fas fa-check" style={{ marginLeft: '6px' }}></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Marks, Duration, Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Total Marks *
              </label>
              <input
                type="number"
                value={assessmentForm.totalMarks}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, totalMarks: parseInt(e.target.value) })}
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Duration (min)
              </label>
              <input
                type="number"
                value={assessmentForm.duration}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, duration: parseInt(e.target.value) })}
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Due Date *
              </label>
              <input
                type="date"
                value={assessmentForm.dueDate}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
              Publish Assessment
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
              <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Template Library */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
          <i className="fas fa-layer-group" style={{ marginRight: '8px', color: '#9c27b0' }}></i>
          Template Library
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {templates.map((template) => (
            <div key={template.id} style={{
              padding: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9c27b0';
              e.currentTarget.style.background = '#9c27b015';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.background = '#ffffff';
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: '#9c27b015',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9c27b0',
                  flexShrink: 0
                }}>
                  <i className={`fas ${getTypeIcon(template.type)}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px', fontSize: '14px' }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {template.description}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#999' }}>
                    <span><i className="fas fa-question-circle"></i> {template.questionsCount} Q</span>
                    <span><i className="fas fa-clock"></i> {template.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Evaluate MCQ Tab
  const renderEvaluateMCQ = () => {
    const mcqAssessments = assessments.filter(a => a.type === 'MCQ' || a.type === 'Mixed');

    const filteredAssessments = mcqAssessments.filter(a => {
      if (evaluationFilter === 'pending') return a.totalSubmissions - a.evaluated > 0;
      if (evaluationFilter === 'completed') return a.totalSubmissions - a.evaluated === 0;
      return true;
    });

    const totalPending = mcqAssessments.reduce((sum, a) => sum + (a.totalSubmissions - a.evaluated), 0);
    const totalCompleted = mcqAssessments.filter(a => a.totalSubmissions - a.evaluated === 0).length;

    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              <i className="fas fa-check-double" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
              Evaluate MCQ Assessments
            </h3>
            <button style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(9, 77, 136, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>
              Auto-Evaluate All
            </button>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(9, 77, 136, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Total Assessments</div>
                  <div style={{ fontSize: '28px', fontWeight: '700' }}>{mcqAssessments.length}</div>
                </div>
                <i className="fas fa-clipboard-list" style={{ fontSize: '32px', opacity: 0.3 }}></i>
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Pending Evaluation</div>
                  <div style={{ fontSize: '28px', fontWeight: '700' }}>{totalPending}</div>
                </div>
                <i className="fas fa-hourglass-half" style={{ fontSize: '32px', opacity: 0.3 }}></i>
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 172, 139, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Completed</div>
                  <div style={{ fontSize: '28px', fontWeight: '700' }}>{totalCompleted}</div>
                </div>
                <i className="fas fa-check-circle" style={{ fontSize: '32px', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => setEvaluationFilter('all')}
              style={{
                padding: '10px 20px',
                background: evaluationFilter === 'all' ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#f8f9fa',
                color: evaluationFilter === 'all' ? '#ffffff' : '#666',
                border: evaluationFilter === 'all' ? 'none' : '2px solid #e9ecef',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
              <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
              All ({mcqAssessments.length})
            </button>
            <button
              onClick={() => setEvaluationFilter('pending')}
              style={{
                padding: '10px 20px',
                background: evaluationFilter === 'pending' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f8f9fa',
                color: evaluationFilter === 'pending' ? '#ffffff' : '#666',
                border: evaluationFilter === 'pending' ? 'none' : '2px solid #e9ecef',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
              <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
              Pending ({mcqAssessments.filter(a => a.totalSubmissions - a.evaluated > 0).length})
            </button>
            <button
              onClick={() => setEvaluationFilter('completed')}
              style={{
                padding: '10px 20px',
                background: evaluationFilter === 'completed' ? 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)' : '#f8f9fa',
                color: evaluationFilter === 'completed' ? '#ffffff' : '#666',
                border: evaluationFilter === 'completed' ? 'none' : '2px solid #e9ecef',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
              <i className="fas fa-check-double" style={{ marginRight: '8px' }}></i>
              Completed ({totalCompleted})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredAssessments.map((assessment) => {
            const progressPercentage = (assessment.evaluated / assessment.totalSubmissions) * 100;
            const isPending = assessment.totalSubmissions - assessment.evaluated > 0;

            return (
            <div key={assessment.id} style={{
              padding: '24px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2c3e50' }}>
                    {assessment.title}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                    {assessment.subject} • {assessment.topic} • {assessment.totalMarks} marks • Due: {assessment.dueDate}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {assessment.courseOutcomes.map(co => (
                      <span key={co} style={{
                        padding: '4px 10px',
                        background: '#10ac8b15',
                        color: '#10ac8b',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{co}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: `${getStatusColor(assessment.status)}15`,
                  color: getStatusColor(assessment.status),
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {assessment.status}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#094d88' }}>
                    {assessment.totalSubmissions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Total Submissions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10ac8b' }}>
                    {assessment.evaluated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Evaluated</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                    {assessment.totalSubmissions - assessment.evaluated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Pending</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
                    {assessment.evaluated > 0 ? '76%' : '-'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Avg Score</div>
                </div>
              </div>

              {/* Evaluation Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Evaluation Progress</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: isPending ? '#f59e0b' : '#10ac8b' }}>
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    background: isPending ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(90deg, #10ac8b 0%, #0e9f7f 100%)',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    // Auto-evaluate function
                    const pendingCount = assessment.totalSubmissions - assessment.evaluated;
                    if (pendingCount > 0) {
                      setAssessments(prevAssessments =>
                        prevAssessments.map(a =>
                          a.id === assessment.id
                            ? { ...a, evaluated: a.totalSubmissions }
                            : a
                        )
                      );
                      // Show success message
                      alert(`Successfully auto-evaluated ${pendingCount} submission${pendingCount > 1 ? 's' : ''}!`);
                    }
                  }}
                  style={{
                  flex: 1,
                  padding: '12px',
                  background: assessment.totalSubmissions - assessment.evaluated > 0 ? '#10ac8b' : '#e0e0e0',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: assessment.totalSubmissions - assessment.evaluated > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (assessment.totalSubmissions - assessment.evaluated > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 172, 139, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                disabled={assessment.totalSubmissions - assessment.evaluated === 0}>
                  <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>
                  Auto-Evaluate ({assessment.totalSubmissions - assessment.evaluated} pending)
                </button>
                <button
                  onClick={() => setViewingResults(assessment)}
                  style={{
                  padding: '12px 20px',
                  background: '#ffffff',
                  color: '#094d88',
                  border: '2px solid #094d88',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#094d88';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#094d88';
                }}>
                  <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                  View Results
                </button>
                <button style={{
                  padding: '12px 20px',
                  background: '#ffffff',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                  Export
                </button>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    );
  };

  // Evaluate Descriptive Tab
  const renderEvaluateDescriptive = () => {
    const descriptiveSubmissions = submissions.filter(s => {
      const assessment = assessments.find(a => a.id === s.assessmentId);
      return assessment && (assessment.type === 'Descriptive' || assessment.type === 'Mixed');
    });

    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-pen-to-square" style={{ marginRight: '10px', color: '#9c27b0' }}></i>
            Evaluate Descriptive Submissions
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{
              padding: '10px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}>
              <option value="">All Assessments</option>
              {assessments.filter(a => a.type === 'Descriptive' || a.type === 'Mixed').map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <select style={{
              padding: '10px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Evaluated">Evaluated</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {descriptiveSubmissions.map((submission) => {
            const assessment = assessments.find(a => a.id === submission.assessmentId);
            return (
              <div key={submission.id} style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9c27b0'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}>
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50' }}>
                          {submission.studentName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {submission.studentId} • Submitted: {submission.submittedAt}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      <i className="fas fa-file-alt" style={{ marginRight: '6px', color: '#9c27b0' }}></i>
                      {assessment?.title}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: `${getStatusColor(submission.status)}15`,
                        color: getStatusColor(submission.status),
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {submission.status}
                      </span>
                      {submission.plagiarismScore !== undefined && (
                        <span style={{ fontSize: '13px', color: '#666' }}>
                          <i className="fas fa-shield-halved" style={{
                            marginRight: '6px',
                            color: submission.plagiarismScore > 30 ? '#f44336' : '#10ac8b'
                          }}></i>
                          Plagiarism: {submission.plagiarismScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    {submission.status === 'Evaluated' && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10ac8b' }}>
                          {submission.marksObtained}/{submission.totalMarks}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Marks</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {submission.status === 'Pending' && (
                        <button style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          <i className="fas fa-robot" style={{ marginRight: '8px' }}></i>
                          AI Assist
                        </button>
                      )}
                      <button style={{
                        padding: '10px 20px',
                        background: '#ffffff',
                        color: '#094d88',
                        border: '2px solid #094d88',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {descriptiveSubmissions.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
            <div style={{ fontSize: '16px' }}>No descriptive submissions to evaluate</div>
          </div>
        )}
      </div>
    );
  };

  // Plagiarism Check Tab
  const renderPlagiarismCheck = () => (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-shield-halved" style={{ marginRight: '10px', color: '#f44336' }}></i>
          Plagiarism Detection
        </h3>
        <button style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #f44336 0%, #ff9800 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
          Scan New Batch
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Scanned', value: '38', icon: 'fa-file-alt', color: '#094d88' },
          { label: 'High Risk', value: '3', icon: 'fa-exclamation-triangle', color: '#f44336' },
          { label: 'Medium Risk', value: '7', icon: 'fa-exclamation-circle', color: '#ff9800' },
          { label: 'Low Risk', value: '28', icon: 'fa-check-circle', color: '#10ac8b' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            padding: '20px',
            background: `${stat.color}10`,
            borderRadius: '12px',
            border: `2px solid ${stat.color}30`,
            textAlign: 'center'
          }}>
            <i className={`fas ${stat.icon}`} style={{ fontSize: '28px', color: stat.color, marginBottom: '8px' }}></i>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Submissions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {submissions.map((submission) => {
          const riskLevel = submission.plagiarismScore! > 30 ? 'High' : submission.plagiarismScore! > 15 ? 'Medium' : 'Low';
          const riskColor = riskLevel === 'High' ? '#f44336' : riskLevel === 'Medium' ? '#ff9800' : '#10ac8b';

          return (
            <div key={submission.id} style={{
              padding: '20px',
              border: `2px solid ${riskColor}30`,
              borderRadius: '12px',
              background: `${riskColor}05`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: `${riskColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: riskColor
                }}>
                  {submission.plagiarismScore}%
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50', marginBottom: '4px' }}>
                    {submission.studentName} ({submission.studentId})
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {assessments.find(a => a.id === submission.assessmentId)?.title}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: riskColor,
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {riskLevel} Risk
                </div>
                <button style={{
                  padding: '10px 20px',
                  background: '#ffffff',
                  color: '#094d88',
                  border: '2px solid #094d88',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                  View Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Evaluation Tracker Tab
  const renderEvaluationTracker = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          {
            icon: 'fa-clipboard-check',
            label: 'Evaluations Completed',
            value: '127/150',
            percentage: 85,
            color: '#10ac8b',
            bgColor: '#10ac8b15'
          },
          {
            icon: 'fa-clock',
            label: 'Pending Evaluations',
            value: '23',
            percentage: 15,
            color: '#ff9800',
            bgColor: '#ff980015'
          },
          {
            icon: 'fa-chart-line',
            label: 'Average Score',
            value: '73.5%',
            percentage: 73.5,
            color: '#094d88',
            bgColor: '#094d8815'
          },
          {
            icon: 'fa-user-graduate',
            label: 'Students at Risk',
            value: '8/150',
            percentage: 5.3,
            color: '#f44336',
            bgColor: '#f4433615'
          }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: stat.color
            }}></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={`fas ${stat.icon}`} style={{ fontSize: '24px', color: stat.color }}></i>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Assessment Timeline & Pending Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Assessment Timeline */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-calendar-check" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Assessment Timeline
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Mid-Term Exam - Data Structures', date: '2025-11-15', status: 'Completed', evaluated: 45, total: 45, color: '#10ac8b' },
              { title: 'Quiz 3 - Operating Systems', date: '2025-11-18', status: 'In Progress', evaluated: 38, total: 42, color: '#ff9800' },
              { title: 'Assignment 4 - DBMS', date: '2025-11-20', status: 'In Progress', evaluated: 22, total: 45, color: '#ff9800' },
              { title: 'Lab Test - Computer Networks', date: '2025-11-22', status: 'Upcoming', evaluated: 0, total: 40, color: '#666' },
              { title: 'Final Project - Software Engineering', date: '2025-11-25', status: 'Upcoming', evaluated: 0, total: 45, color: '#666' }
            ].map((assessment, idx) => (
              <div key={idx} style={{
                padding: '16px',
                border: '2px solid #f0f0f0',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderLeft: `4px solid ${assessment.color}`
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '15px', marginBottom: '6px' }}>
                      {assessment.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                      {assessment.date}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: `${assessment.color}15`,
                    color: assessment.color
                  }}>
                    {assessment.status}
                  </span>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>Evaluation Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
                      {assessment.evaluated}/{assessment.total}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(assessment.evaluated / assessment.total) * 100}%`,
                      height: '100%',
                      background: assessment.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks & Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-tasks" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
            Pending Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { task: 'Review plagiarism flags', count: 5, priority: 'High', icon: 'fa-shield-halved', color: '#f44336' },
              { task: 'Grade descriptive answers', count: 18, priority: 'High', icon: 'fa-pen-to-square', color: '#f44336' },
              { task: 'Approve OCR corrections', count: 12, priority: 'Medium', icon: 'fa-file-prescription', color: '#ff9800' },
              { task: 'Export grade reports', count: 3, priority: 'Low', icon: 'fa-download', color: '#10ac8b' },
              { task: 'Update rubrics', count: 2, priority: 'Low', icon: 'fa-clipboard-check', color: '#10ac8b' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '14px',
                border: `2px solid ${item.color}30`,
                borderRadius: '10px',
                background: `${item.color}08`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.color}15`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${item.color}08`;
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`fas ${item.icon}`} style={{ fontSize: '18px', color: item.color }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                      {item.task}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {item.count} pending items
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: item.color,
                    color: 'white'
                  }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Outcomes Overview */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-bullseye" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Course Outcomes Attainment
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '8px 16px',
              background: '#f8f9fa',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <i className="fas fa-filter" style={{ marginRight: '8px' }}></i>
              Filter by Semester
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <i className="fas fa-file-export" style={{ marginRight: '8px' }}></i>
              Export Report
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {courseOutcomes.map((co) => (
            <div key={co.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '15px' }}>{co.id}</span>
                  <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>{co.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    background: co.attainment >= 75 ? '#10ac8b15' : co.attainment >= 60 ? '#ff980015' : '#f4433615',
                    color: co.attainment >= 75 ? '#10ac8b' : co.attainment >= 60 ? '#ff9800' : '#f44336',
                    fontWeight: '600'
                  }}>
                    {co.attainment >= 75 ? 'Achieved' : co.attainment >= 60 ? 'Moderate' : 'Needs Attention'}
                  </span>
                  <span style={{ fontWeight: 'bold', color: '#094d88', fontSize: '16px' }}>{co.attainment}%</span>
                </div>
              </div>
              <div style={{
                height: '12px',
                background: '#e0e0e0',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${co.attainment}%`,
                  height: '100%',
                  background: co.attainment >= 75 ? 'linear-gradient(90deg, #10ac8b 0%, #4caf50 100%)' : co.attainment >= 60 ? 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)' : 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-chart-area" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
          Performance Trends (Last 5 Assessments)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {[
            { name: 'Quiz 1', avgScore: 68, topScore: 95, lowScore: 42 },
            { name: 'Assignment 2', avgScore: 72, topScore: 98, lowScore: 55 },
            { name: 'Mid-Term', avgScore: 71, topScore: 92, lowScore: 48 },
            { name: 'Quiz 2', avgScore: 76, topScore: 100, lowScore: 58 },
            { name: 'Assignment 3', avgScore: 74, topScore: 96, lowScore: 52 }
          ].map((trend, idx) => (
            <div key={idx} style={{
              padding: '20px',
              border: '2px solid #f0f0f0',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '16px' }}>
                {trend.name}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#094d88', marginBottom: '8px' }}>
                {trend.avgScore}%
              </div>
              <div style={{ fontSize: '11px', color: '#10ac8b', marginBottom: '4px' }}>
                <i className="fas fa-arrow-up" style={{ marginRight: '4px' }}></i>
                High: {trend.topScore}%
              </div>
              <div style={{ fontSize: '11px', color: '#f44336' }}>
                <i className="fas fa-arrow-down" style={{ marginRight: '4px' }}></i>
                Low: {trend.lowScore}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student-wise Progress Matrix */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-table" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
            Student Progress Matrix
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '8px 16px',
              background: '#f8f9fa',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
              Search Student
            </button>
            <button style={{
              padding: '8px 16px',
              background: '#f8f9fa',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Export Matrix
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '2px solid #e0e0e0' }}>
                  Student ID
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '2px solid #e0e0e0' }}>
                  Student Name
                </th>
                {courseOutcomes.map(co => (
                  <th key={co.id} style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '2px solid #e0e0e0' }}>
                    {co.id}
                  </th>
                ))}
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '2px solid #e0e0e0' }}>
                  Overall
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '2px solid #e0e0e0' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'CS21001', name: 'Aravind Kumar' },
                { id: 'CS21002', name: 'Priya Sharma' },
                { id: 'CS21003', name: 'Rahul Mehta' },
                { id: 'CS21004', name: 'Sneha Patel' },
                { id: 'CS21005', name: 'Karthik Raj' },
                { id: 'CS21006', name: 'Divya Reddy' },
                { id: 'CS21007', name: 'Arjun Singh' },
                { id: 'CS21008', name: 'Meera Iyer' }
              ].map((student, idx) => {
                const scores = courseOutcomes.map(() => Math.floor(Math.random() * 35) + 55);
                const overall = Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
                const status = overall >= 75 ? 'On Track' : overall >= 60 ? 'Average' : 'At Risk';
                const statusColor = overall >= 75 ? '#10ac8b' : overall >= 60 ? '#ff9800' : '#f44336';
                return (
                  <tr key={idx} style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      {student.id}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#2c3e50', fontWeight: '600' }}>
                      {student.name}
                    </td>
                    {scores.map((score, sIdx) => (
                      <td key={sIdx} style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: score >= 75 ? '#10ac8b15' : score >= 60 ? '#ff980015' : '#f4433615',
                          color: score >= 75 ? '#10ac8b' : score >= 60 ? '#ff9800' : '#f44336'
                        }}>
                          {score}%
                        </span>
                      </td>
                    ))}
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: overall >= 75 ? '#10ac8b' : overall >= 60 ? '#ff9800' : '#f44336',
                        color: '#ffffff'
                      }}>
                        {overall}%
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${statusColor}20`,
                        color: statusColor
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


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
              Smart Assessment & Evaluation Suite
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              Create, evaluate, and track assessments with AI-powered insights
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
            <i className="fas fa-clipboard-list" style={{ fontSize: '32px' }}></i>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{assessments.length}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Assessments</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: 'fa-clock', label: 'Pending Evaluations', value: assessments.reduce((acc, a) => acc + (a.totalSubmissions - a.evaluated), 0) },
            { icon: 'fa-star', label: 'Average Score', value: '76%' },
            { icon: 'fa-chart-line', label: 'CO Attainment', value: '71%' }
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
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
        {[
          { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
          { id: 'create', icon: 'fa-plus-circle', label: 'Create Assessment' },
          { id: 'question-papers', icon: 'fa-file-alt', label: 'Question Papers' },
          { id: 'evaluate-mcq', icon: 'fa-check-double', label: 'Evaluate MCQ' },
          { id: 'evaluate-descriptive', icon: 'fa-pen-to-square', label: 'Evaluate Descriptive' },
          { id: 'ocr-correction', icon: 'fa-file-prescription', label: 'OCR Correction' },
          { id: 'plagiarism', icon: 'fa-shield-halved', label: 'Plagiarism Check' },
          { id: 'tracker', icon: 'fa-bullseye', label: 'Evaluation Tracker' }
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
      {activeTab === 'create' && renderCreateAssessment()}
      {activeTab === 'question-papers' && <QuestionPaperGenerator />}
      {activeTab === 'evaluate-mcq' && renderEvaluateMCQ()}
      {activeTab === 'evaluate-descriptive' && renderEvaluateDescriptive()}
      {activeTab === 'ocr-correction' && <OCRCorrection />}
      {activeTab === 'plagiarism' && renderPlagiarismCheck()}
      {activeTab === 'tracker' && renderEvaluationTracker()}

      {/* Results View Modal */}
      {viewingResults && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setViewingResults(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              padding: '24px 32px',
              borderRadius: '16px 16px 0 0',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
                  {viewingResults.title}
                </h2>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {viewingResults.subject} • {viewingResults.topic} • {viewingResults.totalMarks} marks
                </div>
              </div>
              <button
                onClick={() => setViewingResults(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#094d88', marginBottom: '4px' }}>
                    {viewingResults.totalSubmissions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Submissions</div>
                </div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10ac8b', marginBottom: '4px' }}>
                    {viewingResults.evaluated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Evaluated</div>
                </div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                    {viewingResults.totalSubmissions - viewingResults.evaluated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pending</div>
                </div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#9c27b0', marginBottom: '4px' }}>
                    {viewingResults.evaluated > 0 ? '76%' : '-'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Average Score</div>
                </div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
                    {viewingResults.evaluated > 0 ? '2' : '0'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
                </div>
              </div>

              {/* Student Results Table */}
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
                Student Submissions
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Roll No.</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Student Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Submitted At</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>Marks Obtained</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>Percentage</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Generate mock student results */}
                    {Array.from({ length: Math.min(viewingResults.totalSubmissions, 15) }, (_, i) => {
                      const isEvaluated = i < viewingResults.evaluated;
                      const marksObtained = isEvaluated ? Math.floor(Math.random() * 30 + 60) : null;
                      const percentage = marksObtained ? Math.round((marksObtained / viewingResults.totalMarks) * 100) : null;

                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#2c3e50' }}>CS210{String(i + 1).padStart(2, '0')}</td>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#2c3e50' }}>
                            {['Aravind Kumar', 'Priya Sharma', 'Rahul Mehta', 'Sneha Reddy', 'Karthik Iyer', 'Divya Nair', 'Rohan Das', 'Anjali Pillai', 'Vikram Singh', 'Meera Joshi', 'Arjun Verma', 'Pooja Gupta', 'Sanjay Kumar', 'Kavya Rao', 'Nikhil Patel'][i % 15]}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                            2025-11-{20 + Math.floor(i / 5)} {10 + i}:{30 + (i * 5) % 30}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: isEvaluated ? '#10ac8b' : '#666' }}>
                            {isEvaluated ? `${marksObtained}/${viewingResults.totalMarks}` : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: isEvaluated ? (percentage! >= 40 ? '#10ac8b' : '#ef4444') : '#666' }}>
                            {isEvaluated ? `${percentage}%` : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: isEvaluated ? '#10ac8b15' : '#f59e0b15',
                              color: isEvaluated ? '#10ac8b' : '#f59e0b'
                            }}>
                              {isEvaluated ? 'Evaluated' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button style={{
                  padding: '12px 24px',
                  background: '#ffffff',
                  color: '#666',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e0'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e9ecef'}>
                  <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                  Export Results
                </button>
                <button
                  onClick={() => setViewingResults(null)}
                  style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(9, 77, 136, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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

export default SmartAssessmentSuite;
