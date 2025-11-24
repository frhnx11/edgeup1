import React, { useState, useEffect } from 'react';

type MainTab = 'dashboard' | 'teaching-analytics' | 'peer-comparison' | 'research-publications' | 'faculty-programs' | 'collaboration-skills';

interface Publication {
  id: string;
  title: string;
  journal: string;
  publicationDate: string;
  citations: number;
  impactFactor: number;
  status: 'Published' | 'Under Review' | 'Drafted';
  authors: string[];
  url: string;
}

interface Conference {
  id: string;
  name: string;
  date: string;
  location: string;
  deadline: string;
  status: 'Registered' | 'Interested' | 'Paper Submitted';
  type: 'National' | 'International';
}

interface DevelopmentProgram {
  id: string;
  title: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  endDate: string;
  skills: string[];
  registrationStatus: 'Open' | 'Closed' | 'Registered' | 'Completed';
  provider: string;
  description: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  teamMembers: { name: string; role: string; photo: string }[];
  progress: number;
  startDate: string;
  expectedEnd: string;
  status: 'Active' | 'Completed' | 'On Hold';
  lastUpdate: string;
}

interface SubjectPerformance {
  subject: string;
  className: string;
  studentsCount: number;
  avgAttendance: number;
  feedbackRating: number;
  feedbackCount: number;
  trend: 'up' | 'down' | 'stable';
}

const ProfessionalDevelopmentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<DevelopmentProgram | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

  // Interactive Chart States
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: string }>({
    visible: false, x: 0, y: 0, content: ''
  });
  const [hoveredDataPoint, setHoveredDataPoint] = useState<string | null>(null);
  const [legendVisibility, setLegendVisibility] = useState<{ [key: string]: boolean }>({
    you: true,
    department: true,
    college: true
  });
  const [chartsAnimated, setChartsAnimated] = useState(false);

  // Mock Data
  const teachingStats = {
    overallEffectiveness: 87,
    studentFeedbackRating: 4.5,
    avgAttendance: 82,
    totalTrainingHours: 156,
    activeCertifications: 8,
    publicationsThisYear: 5,
    upcomingPrograms: 3
  };

  const recentActivity = [
    { id: '1', type: 'achievement', icon: 'fa-trophy', text: 'Received "Best Teacher Award" for Academic Year 2024', date: '2 days ago', color: '#10ac8b' },
    { id: '2', type: 'publication', icon: 'fa-file-alt', text: 'Research paper published in International Journal of AI', date: '5 days ago', color: '#9c27b0' },
    { id: '3', type: 'training', icon: 'fa-graduation-cap', text: 'Completed "Advanced Pedagogy Techniques" certification', date: '1 week ago', color: '#ff9800' },
    { id: '4', type: 'feedback', icon: 'fa-star', text: 'Student feedback improved by 12% this semester', date: '2 weeks ago', color: '#094d88' }
  ];

  const subjectPerformance: SubjectPerformance[] = [
    { subject: 'Data Structures', className: 'CS-2A', studentsCount: 65, avgAttendance: 85, feedbackRating: 4.6, feedbackCount: 58, trend: 'up' },
    { subject: 'Algorithms', className: 'CS-2B', studentsCount: 60, avgAttendance: 78, feedbackRating: 4.3, feedbackCount: 55, trend: 'stable' },
    { subject: 'Database Systems', className: 'CS-3A', studentsCount: 58, avgAttendance: 80, feedbackRating: 4.7, feedbackCount: 52, trend: 'up' },
    { subject: 'Machine Learning', className: 'CS-4A', studentsCount: 45, avgAttendance: 88, feedbackRating: 4.8, feedbackCount: 43, trend: 'up' }
  ];

  const peerBenchmarks = {
    yourPercentile: 92,
    effectivenessYou: 87,
    effectivenessDept: 78,
    effectivenessCollege: 75,
    satisfactionYou: 4.5,
    satisfactionDept: 4.1,
    satisfactionCollege: 3.9,
    publicationsYou: 5,
    publicationsDept: 3.2,
    publicationsCollege: 2.8
  };

  const publications: Publication[] = [
    {
      id: '1',
      title: 'Deep Learning Approaches for Student Performance Prediction in Higher Education',
      journal: 'International Journal of Artificial Intelligence in Education',
      publicationDate: '2024-09-15',
      citations: 23,
      impactFactor: 4.2,
      status: 'Published',
      authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'You'],
      url: '#'
    },
    {
      id: '2',
      title: 'Adaptive Learning Systems: A Comprehensive Review',
      journal: 'IEEE Transactions on Learning Technologies',
      publicationDate: '2024-06-20',
      citations: 45,
      impactFactor: 5.1,
      status: 'Published',
      authors: ['You', 'Dr. Emily Davis'],
      url: '#'
    },
    {
      id: '3',
      title: 'Gamification in Computer Science Education: Impact and Effectiveness',
      journal: 'ACM Conference on Innovation and Technology in CS Education',
      publicationDate: '2024-03-10',
      citations: 12,
      impactFactor: 3.8,
      status: 'Published',
      authors: ['You', 'Prof. Robert Williams', 'Dr. Lisa Anderson'],
      url: '#'
    },
    {
      id: '4',
      title: 'Automated Grading Systems using Natural Language Processing',
      journal: 'Journal of Educational Technology',
      publicationDate: 'Under Review',
      citations: 0,
      impactFactor: 3.5,
      status: 'Under Review',
      authors: ['You', 'Dr. James Wilson'],
      url: '#'
    },
    {
      id: '5',
      title: 'Virtual Reality Applications in Engineering Education',
      journal: 'Draft',
      publicationDate: 'Draft',
      citations: 0,
      impactFactor: 0,
      status: 'Drafted',
      authors: ['You'],
      url: '#'
    }
  ];

  const conferences: Conference[] = [
    { id: '1', name: 'International Conference on AI in Education', date: '2025-01-15', location: 'Singapore', deadline: '2024-11-30', status: 'Paper Submitted', type: 'International' },
    { id: '2', name: 'National Symposium on Computer Science Education', date: '2025-02-20', location: 'Mumbai, India', deadline: '2024-12-15', status: 'Interested', type: 'National' },
    { id: '3', name: 'IEEE Global Engineering Education Conference', date: '2025-03-10', location: 'Dubai, UAE', deadline: '2024-12-01', status: 'Registered', type: 'International' }
  ];

  const developmentPrograms: DevelopmentProgram[] = [
    {
      id: '1',
      title: 'AI-Powered Teaching Methodologies',
      duration: '6 weeks',
      mode: 'Online',
      startDate: '2024-12-01',
      endDate: '2025-01-15',
      skills: ['AI in Education', 'Adaptive Learning', 'Data Analytics'],
      registrationStatus: 'Open',
      provider: 'EdTech University',
      description: 'Learn how to integrate AI tools into your teaching methodology'
    },
    {
      id: '2',
      title: 'Research Methodology and Publication Ethics',
      duration: '4 weeks',
      mode: 'Hybrid',
      startDate: '2024-11-25',
      endDate: '2024-12-20',
      skills: ['Research Methods', 'Publication Ethics', 'Academic Writing'],
      registrationStatus: 'Registered',
      provider: 'National Research Institute',
      description: 'Comprehensive training on research methodology and ethical publication practices'
    },
    {
      id: '3',
      title: 'Effective Classroom Management',
      duration: '3 weeks',
      mode: 'Offline',
      startDate: '2025-01-05',
      endDate: '2025-01-25',
      skills: ['Classroom Management', 'Student Engagement', 'Conflict Resolution'],
      registrationStatus: 'Open',
      provider: 'Teacher Training Academy',
      description: 'Master techniques for managing diverse classrooms effectively'
    },
    {
      id: '4',
      title: 'Advanced Pedagogical Techniques',
      duration: '8 weeks',
      mode: 'Online',
      startDate: '2024-09-01',
      endDate: '2024-10-31',
      skills: ['Pedagogy', 'Assessment Design', 'Learning Outcomes'],
      registrationStatus: 'Completed',
      provider: 'Global Faculty Development Center',
      description: 'Advanced training in modern pedagogical approaches'
    }
  ];

  const researchProjects: ResearchProject[] = [
    {
      id: '1',
      title: 'AI-Based Student Performance Prediction System',
      description: 'Developing machine learning models to predict student performance and identify at-risk students early',
      teamMembers: [
        { name: 'You (Lead)', role: 'Principal Investigator', photo: '' },
        { name: 'Dr. Priya Sharma', role: 'Co-Investigator', photo: '' },
        { name: 'Raj Kumar', role: 'Research Assistant', photo: '' }
      ],
      progress: 65,
      startDate: '2024-06-01',
      expectedEnd: '2025-05-31',
      status: 'Active',
      lastUpdate: 'Completed data collection from 500+ students'
    },
    {
      id: '2',
      title: 'Gamification in Engineering Education',
      description: 'Studying the impact of gamification elements on student engagement and learning outcomes',
      teamMembers: [
        { name: 'You', role: 'Co-Investigator', photo: '' },
        { name: 'Prof. Anita Desai', role: 'Principal Investigator', photo: '' }
      ],
      progress: 40,
      startDate: '2024-08-15',
      expectedEnd: '2025-07-31',
      status: 'Active',
      lastUpdate: 'Literature review completed, pilot study in progress'
    },
    {
      id: '3',
      title: 'Virtual Lab Development for CS Courses',
      description: 'Creating virtual laboratory environments for computer science practical courses',
      teamMembers: [
        { name: 'You (Lead)', role: 'Principal Investigator', photo: '' },
        { name: 'Suresh Reddy', role: 'Developer', photo: '' },
        { name: 'Meera Nair', role: 'UX Designer', photo: '' }
      ],
      progress: 85,
      startDate: '2024-01-10',
      expectedEnd: '2024-12-31',
      status: 'Active',
      lastUpdate: 'Beta testing with students in progress'
    }
  ];

  const skillsDimensions = [
    { name: 'Teaching Expertise', current: 87, target: 95, max: 100 },
    { name: 'Research Skills', current: 75, target: 85, max: 100 },
    { name: 'Technology Integration', current: 82, target: 90, max: 100 },
    { name: 'Communication', current: 90, target: 95, max: 100 },
    { name: 'Leadership', current: 68, target: 80, max: 100 },
    { name: 'Innovation', current: 78, target: 88, max: 100 },
    { name: 'Assessment Design', current: 85, target: 92, max: 100 },
    { name: 'Mentoring', current: 80, target: 90, max: 100 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Completed':
      case 'Registered':
        return '#10ac8b';
      case 'Under Review':
      case 'Interested':
      case 'Active':
        return '#ff9800';
      case 'Drafted':
      case 'On Hold':
        return '#666';
      case 'Paper Submitted':
        return '#094d88';
      default:
        return '#666';
    }
  };

  const getRegistrationColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#10ac8b';
      case 'Registered':
        return '#094d88';
      case 'Completed':
        return '#9c27b0';
      case 'Closed':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return { icon: 'fa-arrow-up', color: '#10ac8b' };
      case 'down':
        return { icon: 'fa-arrow-down', color: '#f44336' };
      default:
        return { icon: 'fa-minus', color: '#ff9800' };
    }
  };

  const renderSkillsRadarChart = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    const angleStep = (2 * Math.PI) / skillsDimensions.length;

    const currentPoints = skillsDimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (dim.current / dim.max) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    const targetPoints = skillsDimensions.map((dim, i) => {
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
      <svg width="400" height="400" style={{ margin: '0 auto', display: 'block' }}>
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {skillsDimensions.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          );
        })}

        {/* Target polygon (dashed) */}
        <path
          d={targetPath}
          fill="#094d8820"
          stroke="#094d88"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Current polygon (solid) */}
        <path
          d={currentPath}
          fill="#10ac8b30"
          stroke="#10ac8b"
          strokeWidth="3"
        />

        {/* Current points */}
        {currentPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#10ac8b"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {skillsDimensions.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 30;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#2c3e50' }}
            >
              {dim.name}
            </text>
          );
        })}
      </svg>
    );
  };

  const renderDashboard = () => (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { icon: 'fa-clock', label: 'Training Hours', value: teachingStats.totalTrainingHours, color: '#094d88', suffix: 'hrs' },
          { icon: 'fa-certificate', label: 'Active Certifications', value: teachingStats.activeCertifications, color: '#10ac8b', suffix: '' },
          { icon: 'fa-file-alt', label: 'Publications (2024)', value: teachingStats.publicationsThisYear, color: '#9c27b0', suffix: '' },
          { icon: 'fa-calendar-check', label: 'Upcoming Programs', value: teachingStats.upcomingPrograms, color: '#ff9800', suffix: '' }
        ].map((stat, index) => (
          <div key={index} style={{
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
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>
                {stat.value}{stat.suffix}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Activity */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
            <i className="fas fa-history" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={{
                padding: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = activity.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: `${activity.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.color,
                  flexShrink: 0
                }}>
                  <i className={`fas ${activity.icon}`} style={{ fontSize: '18px' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>{activity.text}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
            <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#ff9800' }}></i>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: 'fa-user-plus', label: 'Register for Program', color: '#094d88', action: () => setActiveTab('faculty-programs') },
              { icon: 'fa-file-upload', label: 'Submit Publication', color: '#9c27b0', action: () => { setActiveTab('research-publications'); setShowAddPublication(true); } },
              { icon: 'fa-chart-line', label: 'View Analytics', color: '#10ac8b', action: () => setActiveTab('teaching-analytics') },
              { icon: 'fa-users', label: 'Find Collaborators', color: '#ff9800', action: () => setActiveTab('collaboration-skills') }
            ].map((action, index) => (
              <button key={index} style={{
                padding: '16px',
                background: `${action.color}10`,
                border: `2px solid ${action.color}30`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                color: action.color,
                fontWeight: '600',
                fontSize: '14px'
              }}
              onClick={action.action}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${action.color}20`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${action.color}10`;
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <i className={`fas ${action.icon}`} style={{ fontSize: '18px' }}></i>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Trigger animations on tab change
  useEffect(() => {
    setChartsAnimated(false);
    const timer = setTimeout(() => setChartsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTeachingAnalytics = () => {
    // Performance Trend Data
    const performanceTrendData = [
      { month: 'Jun', effectiveness: 82, feedback: 4.1, attendance: 78 },
      { month: 'Jul', effectiveness: 84, feedback: 4.2, attendance: 80 },
      { month: 'Aug', effectiveness: 85, feedback: 4.3, attendance: 81 },
      { month: 'Sep', effectiveness: 86, feedback: 4.4, attendance: 82 },
      { month: 'Oct', effectiveness: 87, feedback: 4.5, attendance: 82 },
      { month: 'Nov', effectiveness: 87, feedback: 4.5, attendance: 82 }
    ];

    // Subject Distribution Data (for donut chart)
    const subjectDistribution = [
      { subject: 'Data Structures', students: 65, color: '#094d88' },
      { subject: 'Algorithms', students: 60, color: '#10ac8b' },
      { subject: 'Database Systems', students: 58, color: '#9c27b0' },
      { subject: 'Machine Learning', students: 45, color: '#ff9800' }
    ];

    const totalStudents = subjectDistribution.reduce((sum, s) => sum + s.students, 0);

    return (
      <div>
        {/* Effectiveness Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {/* Overall Effectiveness */}
          <div style={{
            background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(9, 77, 136, 0.3)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Overall Effectiveness</h3>
              <i className="fas fa-chart-line" style={{ fontSize: '24px', opacity: 0.8 }}></i>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '56px', fontWeight: 'bold' }}>{teachingStats.overallEffectiveness}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>out of 100</div>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${teachingStats.overallEffectiveness}%`,
                height: '100%',
                background: '#ffffff',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}></div>
            </div>
          </div>

          {/* Student Feedback */}
          <div style={{
            background: 'linear-gradient(135deg, #10ac8b 0%, #0ed9a8 100%)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(16, 172, 139, 0.3)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Student Feedback</h3>
              <i className="fas fa-star" style={{ fontSize: '24px', opacity: 0.8 }}></i>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '56px', fontWeight: 'bold' }}>{teachingStats.studentFeedbackRating}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>out of 5.0</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className="fas fa-star" style={{
                  fontSize: '20px',
                  color: star <= Math.floor(teachingStats.studentFeedbackRating) ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  filter: star <= Math.floor(teachingStats.studentFeedbackRating) ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))' : 'none'
                }}></i>
              ))}
            </div>
          </div>

          {/* Average Attendance */}
          <div style={{
            background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Avg Attendance</h3>
              <i className="fas fa-users" style={{ fontSize: '24px', opacity: 0.8 }}></i>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '56px', fontWeight: 'bold' }}>{teachingStats.avgAttendance}%</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>across all classes</div>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${teachingStats.avgAttendance}%`,
                height: '100%',
                background: '#ffffff',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}></div>
            </div>
          </div>
        </div>

        {/* Performance Trend Line Chart & Subject Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Performance Trend Chart */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
              <i className="fas fa-chart-area" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Performance Trends (6 Months)
            </h3>

            {/* Line Chart */}
            <div style={{ position: 'relative', height: '280px' }}>
              {/* Y-axis labels */}
              <div style={{ position: 'absolute', left: '0', top: '0', bottom: '40px', width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px', color: '#666', paddingRight: '8px' }}>
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div style={{ marginLeft: '50px', height: '240px', position: 'relative', borderLeft: '2px solid #e0e0e0', borderBottom: '2px solid #e0e0e0', padding: '10px 10px 30px 10px' }}>
                {/* Grid lines */}
                {[0, 25, 50, 75].map((val) => (
                  <div key={val} style={{ position: 'absolute', left: 0, right: 0, bottom: `${30 + (val / 100) * 200}px`, borderTop: '1px dashed #e0e0e0' }}></div>
                ))}

                {/* Effectiveness Line (Blue) */}
                <svg style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '30px', width: 'calc(100% - 20px)', height: '200px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="effectivenessGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#094d88', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#094d88', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0,${200 - (performanceTrendData[0].effectiveness * 2)} ${performanceTrendData.map((d, i) => `L ${(i / (performanceTrendData.length - 1)) * 100}%,${200 - (d.effectiveness * 2)}`).join(' ')}`}
                    fill="none"
                    stroke="#094d88"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: chartsAnimated ? 'none' : '1000',
                      strokeDashoffset: chartsAnimated ? '0' : '1000',
                      transition: 'stroke-dashoffset 2s ease-in-out'
                    }}
                  />
                  <path
                    d={`M 0,${200 - (performanceTrendData[0].effectiveness * 2)} ${performanceTrendData.map((d, i) => `L ${(i / (performanceTrendData.length - 1)) * 100}%,${200 - (d.effectiveness * 2)}`).join(' ')} L 100%,200 L 0,200 Z`}
                    fill="url(#effectivenessGradient)"
                    style={{
                      opacity: chartsAnimated ? 1 : 0,
                      transition: 'opacity 1s ease-in-out 0.5s'
                    }}
                  />
                  {performanceTrendData.map((d, i) => (
                    <circle
                      key={i}
                      cx={`${(i / (performanceTrendData.length - 1)) * 100}%`}
                      cy={200 - (d.effectiveness * 2)}
                      r={hoveredDataPoint === `trend-${i}` ? 8 : 5}
                      fill={hoveredDataPoint === `trend-${i}` ? '#10ac8b' : '#094d88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: chartsAnimated ? 1 : 0,
                        transform: chartsAnimated ? 'scale(1)' : 'scale(0)',
                        transitionDelay: `${i * 0.1}s`
                      }}
                      onMouseEnter={(e) => {
                        setHoveredDataPoint(`trend-${i}`);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                          content: `${d.month}: ${d.effectiveness}% Effectiveness`
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredDataPoint(null);
                        setTooltip({ ...tooltip, visible: false });
                      }}
                      onClick={() => alert(`Details for ${d.month}: Effectiveness ${d.effectiveness}%, Feedback ${d.feedback}, Attendance ${d.attendance}%`)}
                    />
                  ))}
                </svg>

                {/* X-axis labels */}
                <div style={{ position: 'absolute', bottom: '0', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  {performanceTrendData.map((d, i) => (
                    <span key={i} style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '3px', background: '#094d88', borderRadius: '2px' }}></div>
                <span style={{ color: '#666' }}>Effectiveness Score</span>
              </div>
            </div>
          </div>

          {/* Subject Distribution Donut Chart */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
              Class Distribution
            </h3>

            {/* Donut Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                {(() => {
                  let currentAngle = 0;
                  return subjectDistribution.map((subject, idx) => {
                    const percentage = (subject.students / totalStudents);
                    const angle = percentage * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;

                    const startX = 90 + 70 * Math.cos((startAngle * Math.PI) / 180);
                    const startY = 90 + 70 * Math.sin((startAngle * Math.PI) / 180);
                    const endX = 90 + 70 * Math.cos((currentAngle * Math.PI) / 180);
                    const endY = 90 + 70 * Math.sin((currentAngle * Math.PI) / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;

                    return (
                      <path
                        key={idx}
                        d={`M 90,90 L ${startX},${startY} A 70,70 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                        fill={subject.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                        style={{
                          cursor: 'pointer',
                          opacity: hoveredDataPoint === `donut-${idx}` ? 0.8 : (chartsAnimated ? 1 : 0),
                          transform: hoveredDataPoint === `donut-${idx}` ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '90px 90px',
                          transition: 'all 0.3s ease',
                          transitionDelay: chartsAnimated ? `${idx * 0.15}s` : '0s'
                        }}
                        onMouseEnter={(e) => {
                          setHoveredDataPoint(`donut-${idx}`);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            visible: true,
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            content: `${subject.subject}: ${subject.students} students (${Math.round((subject.students / totalStudents) * 100)}%)`
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredDataPoint(null);
                          setTooltip({ ...tooltip, visible: false });
                        }}
                        onClick={() => alert(`${subject.subject} Details:\nStudents: ${subject.students}\nPercentage: ${Math.round((subject.students / totalStudents) * 100)}%`)}
                      />
                    );
                  });
                })()}
                {/* Inner white circle to create donut */}
                <circle cx="90" cy="90" r="45" fill="#ffffff" />
                {/* Center text */}
                <text x="90" y="85" textAnchor="middle" fill="#2c3e50" fontSize="24" fontWeight="bold" transform="rotate(90 90 90)">{totalStudents}</text>
                <text x="90" y="100" textAnchor="middle" fill="#666" fontSize="11" transform="rotate(90 90 90)">Students</text>
              </svg>

              {/* Legend */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {subjectDistribution.map((subject, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: subject.color }}></div>
                    <span style={{ flex: 1, color: '#2c3e50', fontWeight: '600' }}>{subject.subject}</span>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>{subject.students}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Subject-wise Performance */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-book" style={{ marginRight: '8px', color: '#094d88' }}></i>
          Subject-wise Performance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {subjectPerformance.map((subject, index) => {
            const trend = getTrendIcon(subject.trend);
            return (
              <div key={index} style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#094d88';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' }}>
                      {subject.subject}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {subject.className} • {subject.studentsCount} students
                    </div>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `${trend.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: trend.color
                  }}>
                    <i className={`fas ${trend.icon}`} style={{ fontSize: '14px' }}></i>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Attendance</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: subject.avgAttendance >= 75 ? '#10ac8b' : '#ff9800' }}>
                      {subject.avgAttendance}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Feedback</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fas fa-star" style={{ fontSize: '16px' }}></i>
                      {subject.feedbackRating}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                  Based on {subject.feedbackCount} student responses
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Trends */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
          Feedback Trends (Last 6 Months)
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', padding: '20px 0' }}>
          {[
            { month: 'Jun', value: 4.1 },
            { month: 'Jul', value: 4.2 },
            { month: 'Aug', value: 4.3 },
            { month: 'Sep', value: 4.4 },
            { month: 'Oct', value: 4.5 },
            { month: 'Nov', value: 4.5 }
          ].map((data, index) => {
            const height = (data.value / 5) * 160;
            return (
              <div key={index} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                  {data.value}
                </div>
                <div style={{
                  width: '60px',
                  height: `${height}px`,
                  background: 'linear-gradient(180deg, #094d88 0%, #10ac8b 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}></div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{data.month}</div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#10ac8b10',
          borderLeft: '3px solid #10ac8b',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
            <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
            AI-Generated Insights
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666' }}>
            <li>Your teaching effectiveness has improved by 12% this semester</li>
            <li>Student engagement is highest in Machine Learning classes (88% avg attendance)</li>
            <li>Consider incorporating more interactive elements in Database Systems lectures</li>
            <li>Students appreciate your practical examples and real-world applications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

  const renderPeerComparison = () => {
    // Radar Chart Data
    const radarDimensions = [
      { name: 'Teaching', you: 87, dept: 78, college: 75 },
      { name: 'Satisfaction', you: 90, dept: 82, college: 78 },
      { name: 'Publications', you: 83, dept: 64, college: 56 },
      { name: 'Innovation', you: 85, dept: 75, college: 70 },
      { name: 'Attendance', you: 82, dept: 80, college: 76 }
    ];

    return (
      <div>
        {/* Disclaimer */}
        <div style={{
          background: '#ff980015',
          border: '2px solid #ff980030',
          borderLeft: '4px solid #ff9800',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <i className="fas fa-info-circle" style={{ fontSize: '24px', color: '#ff9800' }}></i>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>
            <strong>Privacy Notice:</strong> All peer comparison data is completely anonymized to maintain confidentiality.
            Individual faculty members cannot be identified.
          </div>
        </div>

        {/* Your Percentile Rank */}
        <div style={{
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(9, 77, 136, 0.25)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '18px', opacity: 0.95, marginBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>
              <i className="fas fa-trophy" style={{ marginRight: '8px' }}></i>
              Your Performance Percentile
            </div>
            <div style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '12px', lineHeight: 1 }}>{peerBenchmarks.yourPercentile}
              <sup style={{ fontSize: '32px', fontWeight: '600' }}>th</sup>
            </div>
            <div style={{ fontSize: '16px', opacity: 0.95, maxWidth: '500px', margin: '0 auto' }}>
              You are performing better than {peerBenchmarks.yourPercentile}% of faculty members in the college
            </div>
          </div>
        </div>

        {/* Radar Chart & Grouped Bar Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Radar Chart Comparison */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
              <i className="fas fa-chart-radar" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Multi-Dimensional Comparison
            </h3>

            {/* Radar Chart */}
            <svg width="320" height="320" style={{ display: 'block', margin: '0 auto' }}>
              {(() => {
                const centerX = 160;
                const centerY = 160;
                const radius = 120;
                const angleStep = (2 * Math.PI) / radarDimensions.length;

                // Helper function to get points
                const getPoints = (dataKey: 'you' | 'dept' | 'college') => {
                  return radarDimensions.map((dim, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const value = dim[dataKey];
                    const r = (value / 100) * radius;
                    return { x: centerX + r * Math.cos(angle), y: centerY + r * Math.sin(angle) };
                  });
                };

                const youPoints = getPoints('you');
                const deptPoints = getPoints('dept');
                const collegePoints = getPoints('college');

                return (
                  <>
                    {/* Grid circles */}
                    {[0.25, 0.5, 0.75, 1].map((scale) => (
                      <circle
                        key={scale}
                        cx={centerX}
                        cy={centerY}
                        r={radius * scale}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Axes */}
                    {radarDimensions.map((dim, i) => {
                      const angle = i * angleStep - Math.PI / 2;
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={centerX}
                          y1={centerY}
                          x2={x}
                          y2={y}
                          stroke="#e0e0e0"
                          strokeWidth="1.5"
                        />
                      );
                    })}

                    {/* College polygon (lightest) */}
                    <path
                      d={`M ${collegePoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
                      fill="rgba(255, 152, 0, 0.15)"
                      stroke="#ff9800"
                      strokeWidth="2"
                    />

                    {/* Department polygon */}
                    <path
                      d={`M ${deptPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
                      fill="rgba(16, 172, 139, 0.15)"
                      stroke="#10ac8b"
                      strokeWidth="2"
                    />

                    {/* You polygon (darkest) */}
                    <path
                      d={`M ${youPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
                      fill="rgba(9, 77, 136, 0.25)"
                      stroke="#094d88"
                      strokeWidth="3"
                    />

                    {/* Data points for "You" */}
                    {youPoints.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="4" fill="#094d88" />
                    ))}

                    {/* Labels */}
                    {radarDimensions.map((dim, i) => {
                      const angle = i * angleStep - Math.PI / 2;
                      const labelRadius = radius + 30;
                      const x = centerX + labelRadius * Math.cos(angle);
                      const y = centerY + labelRadius * Math.sin(angle);
                      return (
                        <text
                          key={i}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fontSize: '13px', fontWeight: '700', fill: '#2c3e50' }}
                        >
                          {dim.name}
                        </text>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Legend */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '3px', background: '#094d88', borderRadius: '2px' }}></div>
                <span style={{ color: '#2c3e50', fontWeight: '600' }}>You</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '3px', background: '#10ac8b', borderRadius: '2px' }}></div>
                <span style={{ color: '#2c3e50', fontWeight: '600' }}>Department</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '3px', background: '#ff9800', borderRadius: '2px' }}></div>
                <span style={{ color: '#2c3e50', fontWeight: '600' }}>College</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
              Performance Metrics Comparison
            </h3>

            {/* Grouped Bar Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { label: 'Teaching Effectiveness', you: 87, dept: 78, college: 75, max: 100 },
                { label: 'Student Satisfaction', you: 4.5, dept: 4.1, college: 3.9, max: 5 },
                { label: 'Research Publications', you: 5, dept: 3.2, college: 2.8, max: 10 }
              ].map((metric, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px' }}>
                    {metric.label}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', height: '100px', alignItems: 'flex-end' }}>
                    {/* You */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#094d88', marginBottom: '6px' }}>
                        {metric.you}
                      </div>
                      <div style={{
                        width: '100%',
                        height: `${(metric.you / metric.max) * 80}px`,
                        background: 'linear-gradient(180deg, #094d88 0%, #10ac8b 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(9, 77, 136, 0.3)'
                      }}></div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontWeight: '600' }}>You</div>
                    </div>

                    {/* Department */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10ac8b', marginBottom: '6px' }}>
                        {metric.dept}
                      </div>
                      <div style={{
                        width: '100%',
                        height: `${(metric.dept / metric.max) * 80}px`,
                        background: '#10ac8b',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(16, 172, 139, 0.3)'
                      }}></div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontWeight: '600' }}>Dept</div>
                    </div>

                    {/* College */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff9800', marginBottom: '6px' }}>
                        {metric.college}
                      </div>
                      <div style={{
                        width: '100%',
                        height: `${(metric.college / metric.max) * 80}px`,
                        background: '#ff9800',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                      }}></div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontWeight: '600' }}>College</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Distribution & Best Practices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Performance Distribution */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
            <i className="fas fa-users" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
            Performance Distribution
          </h3>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              Teaching Effectiveness Distribution
            </div>
            {/* Simple bell curve visualization */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '120px', marginBottom: '16px' }}>
              {[10, 25, 45, 70, 85, 95, 100, 95, 85, 70, 45, 25, 10].map((height, index) => (
                <div key={index} style={{
                  width: '20px',
                  height: `${height}px`,
                  background: index === 10 ? '#094d88' : '#e0e0e0',
                  borderRadius: '3px 3px 0 0',
                  position: 'relative'
                }}>
                  {index === 10 && (
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '20px',
                      color: '#094d88'
                    }}>
                      <i className="fas fa-arrow-down"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              You are in the <strong style={{ color: '#094d88' }}>92nd percentile</strong>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
            <i className="fas fa-trophy" style={{ marginRight: '8px', color: '#ffc107' }}></i>
            Best Practices from Top Performers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Use interactive teaching methods to increase engagement',
              'Provide regular feedback on student performance',
              'Incorporate real-world examples and case studies',
              'Maintain consistent office hours for student queries',
              'Use technology effectively for content delivery'
            ].map((practice, index) => (
              <div key={index} style={{
                padding: '12px',
                background: '#10ac8b10',
                borderLeft: '3px solid #10ac8b',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#2c3e50'
              }}>
                <i className="fas fa-check-circle" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                {practice}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  };

  const renderResearchPublications = () => (
    <div>
      {/* Add Publication Modal */}
      {showAddPublication && (
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
        onClick={() => setShowAddPublication(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>Add Publication</h3>
              <button onClick={() => setShowAddPublication(false)} style={{
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Publication Title *
                </label>
                <input type="text" placeholder="Enter publication title" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Journal/Conference Name *
                </label>
                <input type="text" placeholder="Enter journal or conference name" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    Publication Date
                  </label>
                  <input type="date" style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    Status *
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}>
                    <option value="">Select Status</option>
                    <option value="Published">Published</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Drafted">Drafted</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Co-Authors
                </label>
                <input type="text" placeholder="Enter co-author names (comma separated)" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Publication URL
                </label>
                <input type="url" placeholder="https://" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

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
                  cursor: 'pointer'
                }}
                onClick={() => setShowAddPublication(false)}>
                  <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                  Save Publication
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
                }}
                onClick={() => setShowAddPublication(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { icon: 'fa-file-alt', label: 'Total Publications', value: publications.length, color: '#9c27b0' },
          { icon: 'fa-check-circle', label: 'Published', value: publications.filter(p => p.status === 'Published').length, color: '#10ac8b' },
          { icon: 'fa-clock', label: 'Under Review', value: publications.filter(p => p.status === 'Under Review').length, color: '#ff9800' },
          { icon: 'fa-quote-right', label: 'Total Citations', value: publications.reduce((sum, p) => sum + p.citations, 0), color: '#094d88' }
        ].map((stat, index) => (
          <div key={index} style={{
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

      {/* Add Publication Button */}
      <div style={{ marginBottom: '24px' }}>
        <button style={{
          padding: '14px 24px',
          background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
        }}
        onClick={() => setShowAddPublication(true)}>
          <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
          Add New Publication
        </button>
      </div>

      {/* Publications List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-book" style={{ marginRight: '8px', color: '#9c27b0' }}></i>
          My Publications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {publications.map((pub) => (
            <div key={pub.id} style={{
              padding: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedPublication(pub)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9c27b0';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(156, 39, 176, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                    {pub.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <i className="fas fa-journal-whills" style={{ marginRight: '6px', color: '#9c27b0' }}></i>
                    {pub.journal}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
                    {pub.authors.join(', ')}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: `${getStatusColor(pub.status)}15`,
                  color: getStatusColor(pub.status),
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {pub.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '24px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <i className="fas fa-calendar" style={{ marginRight: '6px', color: '#094d88' }}></i>
                  {pub.publicationDate}
                </div>
                {pub.status === 'Published' && (
                  <>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-quote-right" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                      {pub.citations} citations
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-star" style={{ marginRight: '6px', color: '#ffc107' }}></i>
                      IF: {pub.impactFactor}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conferences */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-users" style={{ marginRight: '8px', color: '#094d88' }}></i>
          Upcoming Conferences
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {conferences.map((conf) => (
            <div key={conf.id} style={{
              padding: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#094d88';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(9, 77, 136, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#094d8815',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#094d88',
                marginBottom: '12px'
              }}>
                <i className="fas fa-globe" style={{ fontSize: '20px' }}></i>
              </div>

              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                {conf.name}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                {conf.date}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                {conf.location}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: conf.type === 'International' ? '#094d8815' : '#10ac8b15',
                  color: conf.type === 'International' ? '#094d88' : '#10ac8b',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {conf.type}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: `${getStatusColor(conf.status)}15`,
                  color: getStatusColor(conf.status),
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {conf.status}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#f44336', fontWeight: '600' }}>
                <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                Deadline: {conf.deadline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFacultyPrograms = () => (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { icon: 'fa-calendar-check', label: 'Registered Programs', value: developmentPrograms.filter(p => p.registrationStatus === 'Registered').length, color: '#094d88' },
          { icon: 'fa-check-circle', label: 'Completed Programs', value: developmentPrograms.filter(p => p.registrationStatus === 'Completed').length, color: '#10ac8b' },
          { icon: 'fa-door-open', label: 'Available Programs', value: developmentPrograms.filter(p => p.registrationStatus === 'Open').length, color: '#ff9800' }
        ].map((stat, index) => (
          <div key={index} style={{
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

      {/* Available Programs */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '8px', color: '#ff9800' }}></i>
          Available Development Programs
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {developmentPrograms.filter(p => p.registrationStatus === 'Open').map((program) => (
            <div key={program.id} style={{
              padding: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() => setSelectedProgram(program)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff9800';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 152, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: '#ff980015',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff9800',
                marginBottom: '16px'
              }}>
                <i className="fas fa-book-reader" style={{ fontSize: '24px' }}></i>
              </div>

              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                {program.title}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', flex: 1 }}>
                {program.description}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <i className="fas fa-clock" style={{ marginRight: '6px', color: '#ff9800' }}></i>
                Duration: {program.duration}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <i className="fas fa-laptop" style={{ marginRight: '6px', color: '#094d88' }}></i>
                Mode: {program.mode}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                <i className="fas fa-calendar" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                Starts: {program.startDate}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {program.skills.slice(0, 2).map((skill, index) => (
                  <span key={index} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: '#094d8815',
                    color: '#094d88',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {skill}
                  </span>
                ))}
                {program.skills.length > 2 && (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: '#e0e0e0',
                    color: '#666',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    +{program.skills.length - 2}
                  </span>
                )}
              </div>

              <button style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Registered Programs */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-clipboard-list" style={{ marginRight: '8px', color: '#094d88' }}></i>
          My Registered Programs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {developmentPrograms.filter(p => p.registrationStatus === 'Registered').map((program) => (
            <div key={program.id} style={{
              padding: '20px',
              border: '2px solid #094d8830',
              borderLeft: '4px solid #094d88',
              borderRadius: '8px',
              background: '#094d8805'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                    {program.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                    {program.provider}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666' }}>
                    <div>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '6px', color: '#094d88' }}></i>
                      {program.startDate} - {program.endDate}
                    </div>
                    <div>
                      <i className="fas fa-laptop" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                      {program.mode}
                    </div>
                    <div>
                      <i className="fas fa-clock" style={{ marginRight: '6px', color: '#ff9800' }}></i>
                      {program.duration}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: '12px',
                  background: '#094d88',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Registered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Programs */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-trophy" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
          Completed Programs & Certifications
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {developmentPrograms.filter(p => p.registrationStatus === 'Completed').map((program) => (
            <div key={program.id} style={{
              padding: '20px',
              border: '2px solid #10ac8b30',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10ac8b05 0%, #10ac8b10 100%)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 172, 139, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: '#10ac8b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  <i className="fas fa-certificate" style={{ fontSize: '24px' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '6px' }}>
                    {program.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    {program.provider}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    <i className="fas fa-calendar-check" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                    Completed: {program.endDate}
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    background: '#10ac8b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    <i className="fas fa-download" style={{ marginRight: '6px' }}></i>
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCollaborationSkills = () => (
    <div>
      {/* New Project Modal */}
      {showNewProject && (
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
        onClick={() => setShowNewProject(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>Create Research Project</h3>
              <button onClick={() => setShowNewProject(false)} style={{
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Project Title *
                </label>
                <input type="text" placeholder="Enter project title" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Description *
                </label>
                <textarea placeholder="Describe your research project" rows={4} style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Invite Collaborators
                </label>
                <input type="text" placeholder="Enter email addresses (comma separated)" style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    Start Date
                  </label>
                  <input type="date" style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                    Expected End Date
                  </label>
                  <input type="date" style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }} />
                </div>
              </div>

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
                  cursor: 'pointer'
                }}
                onClick={() => setShowNewProject(false)}>
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Create Project
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
                }}
                onClick={() => setShowNewProject(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Skills Development Matrix - Enhanced */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Skills Radar Chart */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
              <i className="fas fa-chart-radar" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Professional Skills Matrix
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              {renderSkillsRadarChart()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '3px', background: '#10ac8b', borderRadius: '2px' }}></div>
                <span style={{ color: '#2c3e50', fontWeight: '600' }}>Current Level</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '3px', border: '2px dashed #094d88', borderRadius: '2px' }}></div>
                <span style={{ color: '#2c3e50', fontWeight: '600' }}>Target Level</span>
              </div>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'linear-gradient(135deg, #094d8808 0%, #10ac8b08 100%)',
              borderLeft: '4px solid #094d88',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                AI-Powered Recommendations
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                <li>Focus on <strong>Leadership skills</strong> - consider management training programs</li>
                <li><strong>Innovation</strong> can be improved through hackathons and workshops</li>
                <li>Your <strong>Teaching Expertise</strong> and <strong>Communication</strong> are excellent!</li>
              </ul>
            </div>
          </div>

          {/* Skill Development Progress Bars */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
              Skill Development Progress
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { skill: 'Teaching Expertise', current: 92, target: 95, color: '#094d88' },
                { skill: 'Communication', current: 88, target: 90, color: '#10ac8b' },
                { skill: 'Leadership', current: 65, target: 85, color: '#ff9800' },
                { skill: 'Innovation', current: 70, target: 85, color: '#9c27b0' },
                { skill: 'Technical Skills', current: 82, target: 90, color: '#e91e63' },
                { skill: 'Research', current: 78, target: 85, color: '#00bcd4' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{item.skill}</span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                      <span style={{ color: item.color, fontWeight: 'bold' }}>{item.current}%</span>
                      <span style={{ color: '#999' }}>→</span>
                      <span style={{ color: '#666', fontWeight: '600' }}>Target: {item.target}%</span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: '12px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
                    {/* Target indicator */}
                    <div style={{
                      position: 'absolute',
                      left: `${item.target}%`,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: '#2c3e50',
                      zIndex: 2
                    }}></div>
                    {/* Current progress */}
                    <div style={{
                      width: `${item.current}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease',
                      boxShadow: `0 0 10px ${item.color}50`,
                      position: 'relative',
                      zIndex: 1
                    }}></div>
                  </div>
                  {item.current < item.target && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                      <i className="fas fa-arrow-up" style={{ marginRight: '4px', color: item.color }}></i>
                      {item.target - item.current}% to reach target
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Research Projects - Enhanced */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
              <i className="fas fa-project-diagram" style={{ marginRight: '10px', color: '#9c27b0' }}></i>
              Active Research Projects
            </h3>
            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(156, 39, 176, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(156, 39, 176, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(156, 39, 176, 0.3)';
            }}
            onClick={() => setShowNewProject(true)}>
              <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i>
              New Project
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {researchProjects.map((project) => (
              <div key={project.id} style={{
                padding: '24px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedProject(project)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9c27b0';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(156, 39, 176, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#fafafa';
              }}>
                {/* Top color bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)'
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
                      {project.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                      {project.description}
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${getStatusColor(project.status)}15 0%, ${getStatusColor(project.status)}25 100%)`,
                    color: getStatusColor(project.status),
                    fontSize: '12px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    marginLeft: '16px',
                    border: `1px solid ${getStatusColor(project.status)}30`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <i className="fas fa-circle" style={{ fontSize: '6px' }}></i>
                    {project.status}
                  </span>
                </div>

                {/* Team Members */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {project.teamMembers.map((member, index) => (
                    <div key={index} style={{
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #094d8808 0%, #10ac8b08 100%)',
                      border: '1px solid #094d8820',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: '#2c3e50',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#ffffff',
                        fontWeight: 'bold'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                      <span style={{ color: '#999', fontSize: '12px' }}>• {member.role}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                      <i className="fas fa-tasks" style={{ marginRight: '6px', color: '#9c27b0' }}></i>
                      Project Progress
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#9c27b0' }}>{project.progress}%</span>
                  </div>
                  <div style={{
                    height: '12px',
                    background: '#f0f0f0',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)',
                      transition: 'width 0.8s ease',
                      boxShadow: '0 0 10px rgba(156, 39, 176, 0.4)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'rgba(255, 255, 255, 0.5)'
                      }}></div>
                    </div>
                  </div>
                </div>

              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666' }}>
                <div>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '6px', color: '#094d88' }}></i>
                  {project.startDate} - {project.expectedEnd}
                </div>
                <div>
                  <i className="fas fa-clock" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                  {project.lastUpdate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Development Plan */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="fas fa-road" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
          Personalized Skill Development Plan
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {skillsDimensions.filter(dim => dim.current < dim.target).map((skill, index) => {
            const gap = skill.target - skill.current;
            return (
              <div key={index} style={{
                padding: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {skill.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Gap: {gap} points to reach target
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#094d88' }}>
                      {skill.current} → {skill.target}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  background: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  <strong style={{ color: '#2c3e50' }}>Recommended Actions:</strong>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                    {skill.name === 'Leadership' && (
                      <>
                        <li>Enroll in "Management & Leadership" faculty development program</li>
                        <li>Take on department coordination responsibilities</li>
                        <li>Mentor junior faculty members</li>
                      </>
                    )}
                    {skill.name === 'Innovation' && (
                      <>
                        <li>Participate in hackathons and innovation challenges</li>
                        <li>Attend workshops on "Design Thinking" and "Creative Problem Solving"</li>
                        <li>Collaborate on interdisciplinary research projects</li>
                      </>
                    )}
                    {skill.name === 'Research Skills' && (
                      <>
                        <li>Complete "Research Methodology" certification</li>
                        <li>Publish in higher impact factor journals</li>
                        <li>Apply for research grants and funding</li>
                      </>
                    )}
                    {skill.name === 'Assessment Design' && (
                      <>
                        <li>Attend "Advanced Assessment Techniques" workshop</li>
                        <li>Explore outcome-based assessment methods</li>
                        <li>Collaborate with peers on rubric development</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Arial, sans-serif' }}>
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
              Professional Development Hub
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              Track your growth, research, and teaching excellence
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
            <i className="fas fa-chart-line" style={{ fontSize: '32px' }}></i>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{teachingStats.overallEffectiveness}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Effectiveness Score</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: 'fa-graduation-cap', label: 'Active Programs', value: teachingStats.upcomingPrograms },
            { icon: 'fa-file-alt', label: 'Publications (2024)', value: teachingStats.publicationsThisYear },
            { icon: 'fa-certificate', label: 'Certifications', value: teachingStats.activeCertifications }
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

      {/* Tab Navigation */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
          { id: 'teaching-analytics', icon: 'fa-chart-line', label: 'Teaching Analytics' },
          { id: 'peer-comparison', icon: 'fa-users', label: 'Peer Comparison' },
          { id: 'research-publications', icon: 'fa-file-alt', label: 'Research & Publications' },
          { id: 'faculty-programs', icon: 'fa-graduation-cap', label: 'Development Programs' },
          { id: 'collaboration-skills', icon: 'fa-project-diagram', label: 'Collaboration & Skills' }
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
      {activeTab === 'teaching-analytics' && renderTeachingAnalytics()}
      {activeTab === 'peer-comparison' && renderPeerComparison()}
      {activeTab === 'research-publications' && renderResearchPublications()}
      {activeTab === 'faculty-programs' && renderFacultyPrograms()}
      {activeTab === 'collaboration-skills' && renderCollaborationSkills()}

      {/* Global Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: 'translate(-50%, -100%)',
          background: 'rgba(44, 62, 80, 0.95)',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          pointerEvents: 'none',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
          animation: 'tooltipFadeIn 0.2s ease-in-out'
        }}>
          {tooltip.content}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(44, 62, 80, 0.95)'
          }}></div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDevelopmentHub;
