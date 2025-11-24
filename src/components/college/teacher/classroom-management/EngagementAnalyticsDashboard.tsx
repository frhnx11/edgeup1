import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart } from 'recharts';

const EngagementAnalyticsDashboard = () => {
  // State for real-time data simulation
  const [participationData, setParticipationData] = useState([
    { time: '9:00', participation: 85, questions: 12, activeStudents: 142 },
    { time: '9:15', participation: 87, questions: 15, activeStudents: 148 },
    { time: '9:30', participation: 89, questions: 18, activeStudents: 152 },
    { time: '9:45', participation: 91, questions: 22, activeStudents: 156 },
    { time: '10:00', participation: 88, questions: 19, activeStudents: 150 },
    { time: '10:15', participation: 86, questions: 16, activeStudents: 145 },
    { time: '10:30', participation: 87, questions: 20, activeStudents: 149 }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Real-time update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipationData(prev => {
        const newData = [...prev];
        const lastEntry = newData[newData.length - 1];
        const newTime = new Date(new Date('2025-01-01 ' + lastEntry.time).getTime() + 15 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        newData.push({
          time: newTime,
          participation: Math.min(100, Math.max(60, lastEntry.participation + (Math.random() - 0.5) * 8)),
          questions: Math.max(0, lastEntry.questions + Math.floor((Math.random() - 0.5) * 6)),
          activeStudents: Math.min(187, Math.max(120, lastEntry.activeStudents + Math.floor((Math.random() - 0.5) * 12)))
        });

        if (newData.length > 15) newData.shift();
        return newData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Learning Pattern Data
  const learningPatternData = [
    { timeSlot: 'Morning\n(9-11 AM)', engagement: 92, students: 165 },
    { timeSlot: 'Pre-Lunch\n(11 AM-1 PM)', engagement: 78, students: 142 },
    { timeSlot: 'Afternoon\n(2-4 PM)', engagement: 85, students: 156 },
    { timeSlot: 'Evening\n(4-6 PM)', engagement: 65, students: 118 }
  ];

  // Learning Styles Data
  const learningStylesData = [
    { name: 'Visual', value: 89, color: '#094d88' },
    { name: 'Auditory', value: 52, color: '#10ac8b' },
    { name: 'Kinesthetic', value: 46, color: '#f59e0b' }
  ];

  // Student Learning Patterns (Scatter Plot)
  const studentPatternsData = Array.from({ length: 50 }, (_, i) => ({
    engagement: 60 + Math.random() * 40,
    performance: 55 + Math.random() * 45,
    name: `Student ${i + 1}`,
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
  }));

  // Content Effectiveness Data
  const contentEffectivenessData = [
    { type: 'Interactive Labs', effectiveness: 94, engagement: 96, comprehension: 92, students: 178 },
    { type: 'Group Discussions', effectiveness: 88, engagement: 91, comprehension: 85, students: 165 },
    { type: 'Video Lectures', effectiveness: 82, engagement: 85, comprehension: 79, students: 171 },
    { type: 'Traditional Lectures', effectiveness: 71, engagement: 68, comprehension: 74, students: 158 },
    { type: 'Reading Assignments', effectiveness: 65, engagement: 62, comprehension: 68, students: 142 }
  ];

  // Topic Engagement Trends
  const topicEngagementData = [
    { week: 'Week 1', ml: 78, web: 82, db: 75, ds: 80, testing: 68 },
    { week: 'Week 2', ml: 82, web: 85, db: 78, ds: 83, testing: 71 },
    { week: 'Week 3', ml: 88, web: 87, db: 82, ds: 86, testing: 74 },
    { week: 'Week 4', ml: 92, web: 89, db: 85, ds: 88, testing: 77 },
    { week: 'Week 5', ml: 96, web: 91, db: 87, ds: 90, testing: 76 }
  ];

  // Attention Span Data (with real curve)
  const attentionSpanData = [
    { minute: 0, attention: 95, optimal: 90 },
    { minute: 5, attention: 96, optimal: 90 },
    { minute: 10, attention: 94, optimal: 90 },
    { minute: 15, attention: 92, optimal: 90 },
    { minute: 20, attention: 88, optimal: 90 },
    { minute: 25, attention: 84, optimal: 90 },
    { minute: 30, attention: 79, optimal: 90 },
    { minute: 35, attention: 73, optimal: 90 },
    { minute: 40, attention: 68, optimal: 90 },
    { minute: 45, attention: 62, optimal: 90 },
    { minute: 50, attention: 56, optimal: 90 },
    { minute: 55, attention: 51, optimal: 90 },
    { minute: 60, attention: 47, optimal: 90 }
  ];

  // Attention by Time of Day
  const attentionByTimeData = [
    { period: 'Morning', score: 92 },
    { period: 'Midday', score: 76 },
    { period: 'Afternoon', score: 84 },
    { period: 'Evening', score: 68 }
  ];

  // Dropout Risk Data
  const riskDistributionData = [
    { risk: 'Low Risk', count: 147, fill: '#10ac8b' },
    { risk: 'Medium Risk', count: 28, fill: '#f59e0b' },
    { risk: 'High Risk', count: 12, fill: '#ef4444' }
  ];

  // Risk Trend Over Time
  const riskTrendData = [
    { week: 'Week 1', high: 8, medium: 22, low: 157 },
    { week: 'Week 2', high: 10, medium: 25, low: 152 },
    { week: 'Week 3', high: 9, medium: 27, low: 151 },
    { week: 'Week 4', high: 11, medium: 26, low: 150 },
    { week: 'Week 5', high: 12, medium: 28, low: 147 }
  ];

  // Individual Student Risk Factors (Radar)
  const studentRiskFactors = [
    { factor: 'Attendance', value: 68, fullMark: 100 },
    { factor: 'Engagement', value: 45, fullMark: 100 },
    { factor: 'Participation', value: 32, fullMark: 100 },
    { factor: 'Comprehension', value: 55, fullMark: 100 },
    { factor: 'Assignment Completion', value: 62, fullMark: 100 }
  ];

  const COLORS = ['#094d88', '#10ac8b', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '12px',
          borderRadius: '8px',
          border: '2px solid #094d88',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#212529' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', fontSize: '13px', color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value}{entry.unit || '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Section 1: Real-Time Class Participation Metrics */}
      <div className="dashboard-card">
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
            <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Real-Time Class Participation Metrics
          </h3>
          <p style={{ fontSize: '14px', color: '#6c757d' }}>
            Live engagement tracking with interactive visualizations
            <span style={{ marginLeft: '12px', padding: '4px 8px', backgroundColor: '#10ac8b', borderRadius: '4px', fontSize: '11px', color: 'white', fontWeight: '600' }}>
              <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '4px', animation: 'pulse 2s infinite' }}></i>
              LIVE
            </span>
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(16, 172, 139, 0.1) 0%, rgba(16, 172, 139, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(16, 172, 139, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>
              Current Participation
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10ac8b' }}>
              {participationData[participationData.length - 1]?.participation.toFixed(0)}%
            </div>
            <div style={{ fontSize: '11px', color: '#10ac8b', marginTop: '4px' }}>
              <i className="fas fa-arrow-up" style={{ marginRight: '4px' }}></i>
              +5% from last session
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.1) 0%, rgba(9, 77, 136, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(9, 77, 136, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>
              Questions This Session
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#094d88' }}>
              {participationData.reduce((sum, d) => sum + d.questions, 0)}
            </div>
            <div style={{ fontSize: '11px', color: '#094d88', marginTop: '4px' }}>
              Trending up
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>
              Response Rate
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#f59e0b' }}>73%</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>
              Active responses
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>
              Active Students
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#6366f1' }}>
              {participationData[participationData.length - 1]?.activeStudents}
            </div>
            <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}>
              {((participationData[participationData.length - 1]?.activeStudents / 187) * 100).toFixed(0)}% of total
            </div>
          </div>
        </div>

        {/* Real-Time Participation Line Chart */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
            Participation Over Time (Live Updates Every 3s)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="time" stroke="#6c757d" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
              <Line type="monotone" dataKey="participation" stroke="#10ac8b" strokeWidth={3} name="Participation %" dot={{ fill: '#10ac8b', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="activeStudents" stroke="#094d88" strokeWidth={2} name="Active Students" dot={{ fill: '#094d88', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Questions Volume Area Chart */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
            Questions Volume Trend
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="time" stroke="#6c757d" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="questions" stroke="#f59e0b" fill="url(#colorQuestions)" name="Questions Asked" />
              <defs>
                <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sections 2 & 3: Side by Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Section 2: Learning Pattern Analysis */}
        <div className="dashboard-card">
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              <i className="fas fa-brain" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Learning Pattern Analysis
            </h3>
            <p style={{ fontSize: '13px', color: '#6c757d' }}>
              Individual student behaviors and engagement patterns
            </p>
          </div>

          {/* Peak Engagement by Time Slot */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Peak Engagement by Time Slot
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={learningPatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="timeSlot" stroke="#6c757d" style={{ fontSize: '11px' }} />
                <YAxis stroke="#6c757d" style={{ fontSize: '11px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" fill="#10ac8b" name="Engagement %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Styles Distribution - Pie Chart */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Learning Style Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={learningStylesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {learningStylesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Student Engagement vs Performance Scatter */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Student Engagement vs Performance Correlation
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis type="number" dataKey="engagement" name="Engagement" unit="%" stroke="#6c757d" style={{ fontSize: '11px' }} />
                <YAxis type="number" dataKey="performance" name="Performance" unit="%" stroke="#6c757d" style={{ fontSize: '11px' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Students" data={studentPatternsData} fill="#094d88">
                  {studentPatternsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.riskLevel === 'high' ? '#ef4444' : entry.riskLevel === 'medium' ? '#f59e0b' : '#10ac8b'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 3: Content Effectiveness */}
        <div className="dashboard-card">
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              <i className="fas fa-book-open" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Content Effectiveness Analysis
            </h3>
            <p style={{ fontSize: '13px', color: '#6c757d' }}>
              Multi-dimensional content performance metrics
            </p>
          </div>

          {/* Content Type Effectiveness - Composed Chart */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Content Type Performance Matrix
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={contentEffectivenessData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis type="number" stroke="#6c757d" style={{ fontSize: '11px' }} />
                <YAxis dataKey="type" type="category" stroke="#6c757d" style={{ fontSize: '11px' }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="effectiveness" fill="#10ac8b" name="Effectiveness %" radius={[0, 4, 4, 0]} />
                <Bar dataKey="engagement" fill="#094d88" name="Engagement %" radius={[0, 4, 4, 0]} />
                <Bar dataKey="comprehension" fill="#f59e0b" name="Comprehension %" radius={[0, 4, 4, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Engagement Trends - Multi-Line Chart */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Topic Engagement Trends Over Semester
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={topicEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="week" stroke="#6c757d" style={{ fontSize: '11px' }} />
                <YAxis stroke="#6c757d" style={{ fontSize: '11px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="ml" stroke="#ef4444" strokeWidth={2} name="Machine Learning" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="web" stroke="#10ac8b" strokeWidth={2} name="Web Dev" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="db" stroke="#094d88" strokeWidth={2} name="Database" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ds" stroke="#6366f1" strokeWidth={2} name="Data Structures" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="testing" stroke="#f59e0b" strokeWidth={2} name="Testing" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 4: Attention Span Tracking */}
      <div className="dashboard-card">
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
            <i className="fas fa-clock" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Attention Span Tracking & Analysis
          </h3>
          <p style={{ fontSize: '14px', color: '#6c757d' }}>
            Real-time attention decay patterns and optimal lecture duration recommendations
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Attention Decay Curve */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Attention Decay Curve with Optimal Zone
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attentionSpanData}>
                <defs>
                  <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#094d88" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#094d88" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorOptimal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10ac8b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10ac8b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="minute" label={{ value: 'Minutes', position: 'insideBottom', offset: -5 }} stroke="#6c757d" style={{ fontSize: '11px' }} />
                <YAxis label={{ value: 'Attention %', angle: -90, position: 'insideLeft' }} stroke="#6c757d" style={{ fontSize: '11px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="optimal" stroke="#10ac8b" fillOpacity={1} fill="url(#colorOptimal)" name="Optimal Zone" />
                <Area type="monotone" dataKey="attention" stroke="#094d88" strokeWidth={3} fillOpacity={1} fill="url(#colorAttention)" name="Actual Attention %" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Attention by Time of Day */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
                Attention Levels by Time of Day
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={attentionByTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="period" stroke="#6c757d" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6c757d" style={{ fontSize: '11px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Attention Score %" radius={[8, 8, 0, 0]}>
                    {attentionByTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 85 ? '#10ac8b' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(16, 172, 139, 0.1) 0%, rgba(16, 172, 139, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(16, 172, 139, 0.2)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#6c757d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Avg Attention Span
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10ac8b', marginBottom: '4px' }}>
                42 min
              </div>
              <div style={{ fontSize: '11px', color: '#10ac8b' }}>
                <i className="fas fa-arrow-up" style={{ marginRight: '4px' }}></i>
                +3 min from last month
              </div>
            </div>

            <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.1) 0%, rgba(9, 77, 136, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(9, 77, 136, 0.2)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#6c757d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Optimal Duration
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#094d88', marginBottom: '4px' }}>
                35-45 min
              </div>
              <div style={{ fontSize: '11px', color: '#6c757d' }}>
                Recommended lecture length
              </div>
            </div>

            <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#6c757d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Break Frequency
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                Every 35m
              </div>
              <div style={{ fontSize: '11px', color: '#6c757d' }}>
                5-minute break recommended
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#fff3cd', borderRadius: '10px', border: '1px solid #ffc107' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <i className="fas fa-lightbulb" style={{ fontSize: '16px', color: '#f59e0b', marginTop: '2px' }}></i>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>
                    AI Recommendation
                  </div>
                  <div style={{ fontSize: '10px', color: '#6c757d', lineHeight: 1.4 }}>
                    Schedule high-complexity topics in morning sessions (9-11 AM) for maximum attention
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Predictive Dropout Risk Analytics */}
      <div className="dashboard-card">
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px', color: '#ef4444' }}></i>
            Predictive Dropout Risk Analytics
          </h3>
          <p style={{ fontSize: '14px', color: '#6c757d' }}>
            ML-powered risk assessment with multi-factor analysis and intervention tracking
          </p>
        </div>

        {/* Risk Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>High Risk</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>12</div>
            <div style={{ fontSize: '11px', color: '#ef4444' }}>
              <i className="fas fa-arrow-up" style={{ marginRight: '4px' }}></i>
              +2 this week
            </div>
          </div>

          <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>Medium Risk</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>28</div>
            <div style={{ fontSize: '11px', color: '#f59e0b' }}>
              Stable
            </div>
          </div>

          <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 172, 139, 0.1) 0%, rgba(16, 172, 139, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(16, 172, 139, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>Low Risk</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10ac8b', marginBottom: '4px' }}>147</div>
            <div style={{ fontSize: '11px', color: '#10ac8b' }}>
              <i className="fas fa-arrow-down" style={{ marginRight: '4px' }}></i>
              -3 this week
            </div>
          </div>

          <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)', borderRadius: '12px', border: '2px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '8px' }}>Success Rate</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>87%</div>
            <div style={{ fontSize: '11px', color: '#6c757d' }}>
              With interventions
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {/* Risk Distribution Pie Chart */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Risk Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Trend Over Time */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Risk Trend Over Time
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="week" stroke="#6c757d" style={{ fontSize: '10px' }} />
                <YAxis stroke="#6c757d" style={{ fontSize: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" name="High Risk" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Medium Risk" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#10ac8b" fill="#10ac8b" name="Low Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Risk Factors Radar */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
              Sample Student Risk Profile
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={studentRiskFactors}>
                <PolarGrid stroke="#e9ecef" />
                <PolarAngleAxis dataKey="factor" stroke="#6c757d" style={{ fontSize: '10px' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6c757d" style={{ fontSize: '10px' }} />
                <Radar name="Risk Factors" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#6c757d', marginTop: '8px' }}>
              Click on a student to view their profile
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default EngagementAnalyticsDashboard;
