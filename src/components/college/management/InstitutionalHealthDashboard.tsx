import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './InstitutionalHealthDashboard.css';

// TypeScript Interfaces
interface HealthKPI {
  label: string;
  value: string | number;
  icon: string;
  trend: {
    direction: 'up' | 'down' | 'stable';
    value: number;
  };
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface HealthAlert {
  id: string;
  severity: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  category: string;
  timestamp: string;
}

interface DropoutRisk {
  studentId: string;
  studentName: string;
  department: string;
  semester: number;
  cgpa: number;
  attendance: number;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  factors: string[];
  interventions: string[];
}

interface FinancialMetric {
  totalFees: number;
  collectedFees: number;
  pendingFees: number;
  overdueFees: number;
  collectionRate: number;
  monthlyGrowth: number;
}

interface DepartmentFinance {
  department: string;
  totalStudents: number;
  totalFees: number;
  collected: number;
  pending: number;
  collectionRate: number;
}

interface ComplianceItem {
  body: string;
  status: 'compliant' | 'due-soon' | 'overdue';
  expiryDate: string;
  daysRemaining: number;
  campus: string;
}

interface AccreditationCriterion {
  id: string;
  number: string;
  name: string;
  body: 'NAAC' | 'NBA';
  currentScore: number;
  targetScore: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  lastUpdated: string;
  topRecommendation: string;
}

interface CampusPerformance {
  campusName: string;
  healthScore: number;
  enrollment: number;
  facultyStrength: number;
  passPercentage: number;
  collectionRate: number;
  infrastructureScore: number;
  metrics: {
    academic: number;
    financial: number;
    infrastructure: number;
    compliance: number;
    studentSatisfaction: number;
    facultyPerformance: number;
  };
}

const InstitutionalHealthDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'academic' | 'compliance' | 'campus'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>(['Main Campus', 'North Campus']);
  const [lastUpdated] = useState(new Date().toLocaleString());

  // Mock Data - KPIs
  const healthKPIs: HealthKPI[] = [
    {
      label: 'Overall Health Score',
      value: 87,
      icon: 'fa-heartbeat',
      trend: { direction: 'up', value: 5 },
      status: 'excellent'
    },
    {
      label: 'Financial Health',
      value: '92%',
      icon: 'fa-dollar-sign',
      trend: { direction: 'up', value: 3 },
      status: 'excellent'
    },
    {
      label: 'Academic Excellence',
      value: 85,
      icon: 'fa-graduation-cap',
      trend: { direction: 'up', value: 2 },
      status: 'good'
    },
    {
      label: 'Compliance Status',
      value: '78%',
      icon: 'fa-clipboard-check',
      trend: { direction: 'down', value: 1 },
      status: 'fair'
    }
  ];

  // Mock Data - Alerts
  const healthAlerts: HealthAlert[] = [
    {
      id: '1',
      severity: 'urgent',
      title: 'NAAC Renewal Due',
      message: 'NAAC accreditation renewal deadline in 30 days - Main Campus',
      category: 'Compliance',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      severity: 'warning',
      title: 'High Dropout Risk',
      message: '10 students identified with high dropout risk across all departments',
      category: 'Academic',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      severity: 'warning',
      title: 'Fee Collection Delay',
      message: 'Pending fee collection of ₹12.5L from final year students',
      category: 'Financial',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      severity: 'info',
      title: 'Infrastructure Maintenance',
      message: 'Scheduled maintenance for Block A - North Campus this weekend',
      category: 'Infrastructure',
      timestamp: '2 days ago'
    },
    {
      id: '5',
      severity: 'urgent',
      title: 'Faculty Shortage',
      message: 'ECE department has 3 vacant positions affecting student-faculty ratio',
      category: 'HR',
      timestamp: '3 days ago'
    }
  ];

  // Mock Data - Dropout Risk Students
  const dropoutRiskStudents: DropoutRisk[] = [
    // HIGH RISK STUDENTS (10 total)
    {
      studentId: 'ST2021001',
      studentName: 'Rahul Kumar',
      department: 'CSE',
      semester: 4,
      cgpa: 5.2,
      attendance: 68,
      riskScore: 85,
      riskLevel: 'high',
      factors: ['Low attendance', 'Declining grades', 'No participation in activities'],
      interventions: ['Schedule counseling session', 'Peer mentoring', 'Academic support program']
    },
    {
      studentId: 'ST2021042',
      studentName: 'Priya Sharma',
      department: 'ECE',
      semester: 6,
      cgpa: 6.1,
      attendance: 72,
      riskScore: 72,
      riskLevel: 'high',
      factors: ['Financial difficulties', 'Irregular attendance', 'Family issues'],
      interventions: ['Financial aid counseling', 'Flexible attendance options', 'Mental health support']
    },
    {
      studentId: 'ST2021078',
      studentName: 'Neha Gupta',
      department: 'CSE',
      semester: 5,
      cgpa: 5.8,
      attendance: 70,
      riskScore: 78,
      riskLevel: 'high',
      factors: ['Financial stress', 'Part-time job affecting studies', 'Poor time management'],
      interventions: ['Scholarship application support', 'Time management workshop', 'Career counseling']
    },
    {
      studentId: 'ST2022034',
      studentName: 'Arjun Singh',
      department: 'CSE',
      semester: 4,
      cgpa: 5.1,
      attendance: 65,
      riskScore: 88,
      riskLevel: 'high',
      factors: ['Mental health concerns', 'Social isolation', 'Academic performance decline'],
      interventions: ['Mental health counseling', 'Peer support group', 'Academic recovery plan']
    },
    {
      studentId: 'ST2021115',
      studentName: 'Kavya Reddy',
      department: 'ECE',
      semester: 6,
      cgpa: 6.0,
      attendance: 68,
      riskScore: 75,
      riskLevel: 'high',
      factors: ['Family health issues', 'Missed classes', 'Low engagement in labs'],
      interventions: ['Flexible attendance policy', 'Lab catch-up sessions', 'Family counseling resources']
    },
    {
      studentId: 'ST2022089',
      studentName: 'Rohan Verma',
      department: 'MECH',
      semester: 3,
      cgpa: 5.5,
      attendance: 72,
      riskScore: 80,
      riskLevel: 'high',
      factors: ['Difficulty in core subjects', 'Low lab performance', 'Lack of interest'],
      interventions: ['Subject-specific tutoring', 'Hands-on workshop', 'Career interest assessment']
    },
    {
      studentId: 'ST2023012',
      studentName: 'Ananya Joshi',
      department: 'CSE',
      semester: 2,
      cgpa: 4.8,
      attendance: 62,
      riskScore: 92,
      riskLevel: 'high',
      factors: ['Poor foundation', 'Language barriers', 'Overwhelmed by coursework'],
      interventions: ['Foundation strengthening program', 'Communication skills training', 'Reduced course load']
    },
    {
      studentId: 'ST2021156',
      studentName: 'Vikram Nair',
      department: 'CIVIL',
      semester: 7,
      cgpa: 5.9,
      attendance: 71,
      riskScore: 74,
      riskLevel: 'high',
      factors: ['Placement stress', 'Backlogs in previous semesters', 'Low confidence'],
      interventions: ['Backlog clearance support', 'Placement training', 'Confidence building sessions']
    },
    {
      studentId: 'ST2022067',
      studentName: 'Shreya Desai',
      department: 'MECH',
      semester: 4,
      cgpa: 5.6,
      attendance: 69,
      riskScore: 77,
      riskLevel: 'high',
      factors: ['Health issues', 'Frequent absences', 'Missed assessments'],
      interventions: ['Medical support coordination', 'Make-up assessment options', 'Health monitoring']
    },
    {
      studentId: 'ST2021203',
      studentName: 'Aditya Iyer',
      department: 'IT',
      semester: 5,
      cgpa: 5.4,
      attendance: 67,
      riskScore: 81,
      riskLevel: 'high',
      factors: ['Weak programming skills', 'Assignment submission delays', 'Low project scores'],
      interventions: ['Coding bootcamp enrollment', 'Project mentorship', 'Deadline management training']
    },

    // MEDIUM RISK STUDENTS (7 total)
    {
      studentId: 'ST2022015',
      studentName: 'Amit Patel',
      department: 'MECH',
      semester: 3,
      cgpa: 6.8,
      attendance: 75,
      riskScore: 58,
      riskLevel: 'medium',
      factors: ['Subject difficulty', 'Low test scores'],
      interventions: ['Tutoring sessions', 'Study group assignment']
    },
    {
      studentId: 'ST2021134',
      studentName: 'Divya Krishnan',
      department: 'CSE',
      semester: 6,
      cgpa: 6.5,
      attendance: 77,
      riskScore: 55,
      riskLevel: 'medium',
      factors: ['Inconsistent performance', 'Weak in algorithms'],
      interventions: ['Algorithm workshop', 'Regular progress monitoring', 'Practice problem sets']
    },
    {
      studentId: 'ST2022098',
      studentName: 'Karthik Menon',
      department: 'ECE',
      semester: 4,
      cgpa: 6.7,
      attendance: 76,
      riskScore: 52,
      riskLevel: 'medium',
      factors: ['Electronics lab challenges', 'Theory-practical gap'],
      interventions: ['Extra lab hours', 'Practical demonstrations', 'Theory revision sessions']
    },
    {
      studentId: 'ST2023045',
      studentName: 'Meera Bhat',
      department: 'IT',
      semester: 2,
      cgpa: 6.6,
      attendance: 78,
      riskScore: 50,
      riskLevel: 'medium',
      factors: ['Adjustment to college life', 'Time management issues'],
      interventions: ['Orientation mentoring', 'Study skills workshop', 'Buddy system']
    },
    {
      studentId: 'ST2021187',
      studentName: 'Sanjay Kumar',
      department: 'CIVIL',
      semester: 5,
      cgpa: 6.9,
      attendance: 74,
      riskScore: 54,
      riskLevel: 'medium',
      factors: ['Attendance border-line', 'Occasional missed submissions'],
      interventions: ['Attendance tracking app', 'Submission reminder system', 'Accountability partner']
    },
    {
      studentId: 'ST2022121',
      studentName: 'Pooja Rao',
      department: 'ECE',
      semester: 3,
      cgpa: 6.4,
      attendance: 79,
      riskScore: 56,
      riskLevel: 'medium',
      factors: ['Mathematics weakness', 'Signal processing challenges'],
      interventions: ['Math foundation course', 'Signal processing tutorial', 'MATLAB training']
    },
    {
      studentId: 'ST2021076',
      studentName: 'Harish Reddy',
      department: 'MECH',
      semester: 7,
      cgpa: 7.0,
      attendance: 73,
      riskScore: 48,
      riskLevel: 'medium',
      factors: ['Internship search stress', 'Final year project concerns'],
      interventions: ['Career guidance', 'Project proposal support', 'Industry mentorship']
    },

    // LOW RISK STUDENTS (3 total)
    {
      studentId: 'ST2022045',
      studentName: 'Aarav Sharma',
      department: 'CSE',
      semester: 3,
      cgpa: 8.2,
      attendance: 88,
      riskScore: 25,
      riskLevel: 'low',
      factors: ['Strong academic performance', 'Active in coding clubs'],
      interventions: ['Advanced project opportunities', 'Research internship guidance', 'Leadership roles']
    },
    {
      studentId: 'ST2021098',
      studentName: 'Ishita Malhotra',
      department: 'IT',
      semester: 6,
      cgpa: 7.8,
      attendance: 85,
      riskScore: 30,
      riskLevel: 'low',
      factors: ['Consistent performer', 'Good extracurricular balance'],
      interventions: ['Career advancement workshops', 'Networking opportunities', 'Skill enhancement programs']
    },
    {
      studentId: 'ST2023008',
      studentName: 'Rishi Kapoor',
      department: 'ECE',
      semester: 2,
      cgpa: 7.5,
      attendance: 82,
      riskScore: 35,
      riskLevel: 'low',
      factors: ['Adapting well', 'Positive attitude', 'Regular assignments'],
      interventions: ['Maintain support', 'Encourage participation', 'Advanced courses access']
    }
  ];

  // Mock Data - Financial Metrics
  const financialMetrics: FinancialMetric = {
    totalFees: 25000000,
    collectedFees: 23000000,
    pendingFees: 2000000,
    overdueFees: 500000,
    collectionRate: 92,
    monthlyGrowth: 3.5
  };

  // Mock Data - Department Finance
  const departmentFinance: DepartmentFinance[] = [
    { department: 'CSE', totalStudents: 480, totalFees: 9600000, collected: 9100000, pending: 500000, collectionRate: 94.8 },
    { department: 'ECE', totalStudents: 360, totalFees: 7200000, collected: 6700000, pending: 500000, collectionRate: 93.1 },
    { department: 'MECH', totalStudents: 320, totalFees: 6400000, collected: 5800000, pending: 600000, collectionRate: 90.6 },
    { department: 'CIVIL', totalStudents: 240, totalFees: 4800000, collected: 4200000, pending: 600000, collectionRate: 87.5 },
    { department: 'IT', totalStudents: 200, totalFees: 4000000, collected: 3700000, pending: 300000, collectionRate: 92.5 }
  ];

  // Mock Data - Compliance Items
  const complianceItems: ComplianceItem[] = [
    { body: 'NAAC', status: 'due-soon', expiryDate: '2025-01-15', daysRemaining: 28, campus: 'Main Campus' },
    { body: 'NBA - CSE', status: 'compliant', expiryDate: '2026-03-20', daysRemaining: 487, campus: 'Main Campus' },
    { body: 'NBA - ECE', status: 'compliant', expiryDate: '2025-08-10', daysRemaining: 235, campus: 'Main Campus' },
    { body: 'AICTE', status: 'compliant', expiryDate: '2025-06-30', daysRemaining: 194, campus: 'All Campuses' },
    { body: 'UGC', status: 'overdue', expiryDate: '2024-11-01', daysRemaining: -17, campus: 'North Campus' },
    { body: 'State Board', status: 'compliant', expiryDate: '2025-09-15', daysRemaining: 271, campus: 'South Campus' }
  ];

  // Mock Data - Accreditation Criteria
  const accreditationCriteria: AccreditationCriterion[] = [
    {
      id: 'naac-1',
      number: 'Criterion 1',
      name: 'Curricular Aspects',
      body: 'NAAC',
      currentScore: 85,
      targetScore: 90,
      maxScore: 100,
      status: 'excellent',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Enhance outcome-based curriculum design and implementation'
    },
    {
      id: 'naac-2',
      number: 'Criterion 2',
      name: 'Teaching-Learning and Evaluation',
      body: 'NAAC',
      currentScore: 78,
      targetScore: 85,
      maxScore: 100,
      status: 'good',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Implement more interactive teaching methodologies and continuous assessment'
    },
    {
      id: 'naac-3',
      number: 'Criterion 3',
      name: 'Research, Innovations and Extension',
      body: 'NAAC',
      currentScore: 72,
      targetScore: 85,
      maxScore: 100,
      status: 'needs-improvement',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Increase research funding, publications, and patents filing'
    },
    {
      id: 'naac-4',
      number: 'Criterion 4',
      name: 'Infrastructure and Learning Resources',
      body: 'NAAC',
      currentScore: 88,
      targetScore: 90,
      maxScore: 100,
      status: 'excellent',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Upgrade laboratory equipment and expand digital library resources'
    },
    {
      id: 'naac-5',
      number: 'Criterion 5',
      name: 'Student Support and Progression',
      body: 'NAAC',
      currentScore: 80,
      targetScore: 85,
      maxScore: 100,
      status: 'good',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Strengthen placement training and alumni engagement programs'
    },
    {
      id: 'naac-6',
      number: 'Criterion 6',
      name: 'Governance, Leadership and Management',
      body: 'NAAC',
      currentScore: 82,
      targetScore: 88,
      maxScore: 100,
      status: 'good',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Enhance decentralized governance and stakeholder participation'
    },
    {
      id: 'naac-7',
      number: 'Criterion 7',
      name: 'Institutional Values and Best Practices',
      body: 'NAAC',
      currentScore: 75,
      targetScore: 85,
      maxScore: 100,
      status: 'needs-improvement',
      lastUpdated: '2024-11-10',
      topRecommendation: 'Strengthen environmental sustainability and social responsibility initiatives'
    }
  ];

  // Mock Data - Campus Performance
  const campusPerformance: CampusPerformance[] = [
    {
      campusName: 'Main Campus',
      healthScore: 87,
      enrollment: 1600,
      facultyStrength: 120,
      passPercentage: 89,
      collectionRate: 94,
      infrastructureScore: 85,
      metrics: { academic: 89, financial: 94, infrastructure: 85, compliance: 82, studentSatisfaction: 88, facultyPerformance: 86 }
    },
    {
      campusName: 'North Campus',
      healthScore: 82,
      enrollment: 1200,
      facultyStrength: 85,
      passPercentage: 85,
      collectionRate: 90,
      infrastructureScore: 80,
      metrics: { academic: 85, financial: 90, infrastructure: 80, compliance: 75, studentSatisfaction: 84, facultyPerformance: 82 }
    },
    {
      campusName: 'South Campus',
      healthScore: 78,
      enrollment: 800,
      facultyStrength: 60,
      passPercentage: 82,
      collectionRate: 88,
      infrastructureScore: 75,
      metrics: { academic: 82, financial: 88, infrastructure: 75, compliance: 80, studentSatisfaction: 80, facultyPerformance: 78 }
    },
    {
      campusName: 'East Campus',
      healthScore: 75,
      enrollment: 600,
      facultyStrength: 45,
      passPercentage: 80,
      collectionRate: 85,
      infrastructureScore: 72,
      metrics: { academic: 80, financial: 85, infrastructure: 72, compliance: 78, studentSatisfaction: 76, facultyPerformance: 75 }
    }
  ];

  // Helper Functions
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6c757d';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'urgent': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getCriterionStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs-improvement': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6c757d';
    }
  };

  // Chart Options
  const getHealthTrendChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#2d3748' }
    },
    legend: {
      data: ['Overall Health', 'Financial', 'Academic', 'Compliance'],
      bottom: 0,
      textStyle: { color: '#2d3748' }
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096' },
      splitLine: { lineStyle: { color: '#f7fafc' } }
    },
    series: [
      {
        name: 'Overall Health',
        type: 'line',
        smooth: true,
        data: [78, 80, 82, 84, 85, 87],
        lineStyle: { color: '#094d88', width: 3 },
        itemStyle: { color: '#094d88' },
        areaStyle: { color: 'rgba(9, 77, 136, 0.1)' }
      },
      {
        name: 'Financial',
        type: 'line',
        smooth: true,
        data: [85, 87, 89, 90, 91, 92],
        lineStyle: { color: '#10ac8b', width: 2 },
        itemStyle: { color: '#10ac8b' }
      },
      {
        name: 'Academic',
        type: 'line',
        smooth: true,
        data: [80, 81, 82, 83, 84, 85],
        lineStyle: { color: '#667eea', width: 2 },
        itemStyle: { color: '#667eea' }
      },
      {
        name: 'Compliance',
        type: 'line',
        smooth: true,
        data: [82, 81, 80, 79, 79, 78],
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' }
      }
    ]
  });

  const getHealthGaugeOption = (value: number) => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#ef4444'],
              [0.7, '#f59e0b'],
              [0.9, '#3b82f6'],
              [1, '#10b981']
            ]
          }
        },
        pointer: {
          itemStyle: { color: '#094d88' },
          width: 5
        },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: '#fff' } },
        axisLabel: { distance: 25, color: '#718096', fontSize: 10 },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#2d3748',
          fontSize: 32,
          fontWeight: 700,
          offsetCenter: [0, '70%']
        },
        data: [{ value, name: '' }]
      }
    ]
  });

  const getFeeCollectionPieOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#2d3748' }
    },
    series: [
      {
        name: 'Fee Collection',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: financialMetrics.collectedFees, name: 'Collected', itemStyle: { color: '#10b981' } },
          { value: financialMetrics.pendingFees - financialMetrics.overdueFees, name: 'Pending', itemStyle: { color: '#f59e0b' } },
          { value: financialMetrics.overdueFees, name: 'Overdue', itemStyle: { color: '#ef4444' } }
        ]
      }
    ]
  });

  const getMonthlyCollectionBarOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Collected', 'Pending'],
      bottom: 0,
      textStyle: { color: '#2d3748' }
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096', formatter: (value: number) => formatCurrency(value) },
      splitLine: { lineStyle: { color: '#f7fafc' } }
    },
    series: [
      {
        name: 'Collected',
        type: 'bar',
        stack: 'total',
        data: [1.8, 1.9, 1.95, 1.85, 1.9, 1.95, 1.92, 1.98, 2.0, 2.05, 2.1, 2.15].map(v => v * 1000000),
        itemStyle: { color: '#10b981' }
      },
      {
        name: 'Pending',
        type: 'bar',
        stack: 'total',
        data: [0.2, 0.18, 0.15, 0.2, 0.18, 0.15, 0.16, 0.14, 0.12, 0.1, 0.15, 0.17].map(v => v * 1000000),
        itemStyle: { color: '#f59e0b' }
      }
    ]
  });

  const getDepartmentHeatmapOption = () => {
    const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'];
    const metrics = ['Pass%', 'Attendance%', 'CGPA', 'Placement%'];
    const data = [
      [0, 0, 92], [0, 1, 88], [0, 2, 8.2], [0, 3, 85],
      [1, 0, 88], [1, 1, 85], [1, 2, 7.8], [1, 3, 82],
      [2, 0, 85], [2, 1, 82], [2, 2, 7.5], [2, 3, 78],
      [3, 0, 82], [3, 1, 80], [3, 2, 7.2], [3, 3, 75],
      [4, 0, 90], [4, 1, 87], [4, 2, 8.0], [4, 3, 83]
    ];

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const dept = departments[params.data[0]];
          const metric = metrics[params.data[1]];
          const value = params.data[2];
          return `${dept} - ${metric}: ${value}${metric === 'CGPA' ? '' : '%'}`;
        }
      },
      grid: { height: '60%', top: '10%' },
      xAxis: {
        type: 'category',
        data: departments,
        splitArea: { show: true },
        axisLabel: { color: '#2d3748', fontWeight: 600 }
      },
      yAxis: {
        type: 'category',
        data: metrics,
        splitArea: { show: true },
        axisLabel: { color: '#2d3748', fontWeight: 600 }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
        },
        text: ['High', 'Low'],
        textStyle: { color: '#2d3748' }
      },
      series: [
        {
          name: 'Performance',
          type: 'heatmap',
          data: data.map(item => {
            if (item[1] === 2) {
              return [item[0], item[1], (item[2] / 10) * 100];
            }
            return item;
          }),
          label: { show: true, color: '#fff', fontWeight: 600 },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  const getCampusComparisonHeatmapOption = () => {
    const selectedData = campusPerformance.filter(c => selectedCampuses.includes(c.campusName));
    const campusNames = selectedData.map(c => c.campusName);
    const metricNames = ['Academic', 'Financial', 'Infrastructure', 'Compliance', 'Student Satisfaction', 'Faculty Performance'];

    const data: number[][] = [];
    selectedData.forEach((campus, campusIdx) => {
      metricNames.forEach((_, metricIdx) => {
        const metricValues = [
          campus.metrics.academic,
          campus.metrics.financial,
          campus.metrics.infrastructure,
          campus.metrics.compliance,
          campus.metrics.studentSatisfaction,
          campus.metrics.facultyPerformance
        ];
        data.push([campusIdx, metricIdx, metricValues[metricIdx]]);
      });
    });

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const campus = campusNames[params.data[0]];
          const metric = metricNames[params.data[1]];
          const value = params.data[2];
          return `${campus}<br/>${metric}: ${value}/100`;
        }
      },
      grid: { height: '70%', top: '5%' },
      xAxis: {
        type: 'category',
        data: campusNames,
        splitArea: { show: true },
        axisLabel: { color: '#2d3748', fontWeight: 600, interval: 0, rotate: campusNames.length > 3 ? 15 : 0 }
      },
      yAxis: {
        type: 'category',
        data: metricNames,
        splitArea: { show: true },
        axisLabel: { color: '#2d3748', fontWeight: 600 }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#ef4444', '#f59e0b', '#fbbf24', '#3b82f6', '#10b981']
        },
        text: ['High', 'Low'],
        textStyle: { color: '#2d3748' }
      },
      series: [
        {
          name: 'Performance',
          type: 'heatmap',
          data: data,
          label: { show: true, color: '#fff', fontWeight: 600 },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented in Phase 8');
  };

  const handleRefreshData = () => {
    alert('Data refresh functionality - simulating real-time update');
  };

  return (
    <div className="institutional-health-dashboard">
      {/* Header Section */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1>
            <i className="fas fa-heartbeat"></i>
            Institutional Health Dashboard
          </h1>
          <p className="header-subtitle">Real-time comprehensive institutional analytics and AI-powered insights</p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            <button
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              className={`time-btn ${timeRange === 'quarter' ? 'active' : ''}`}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </button>
            <button
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
          <button className="btn-secondary" onClick={handleExportPDF}>
            <i className="fas fa-download"></i>
            Export Report
          </button>
          <button className="btn-primary" onClick={handleRefreshData}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Last Updated Timestamp */}
      <div className="last-updated">
        <i className="fas fa-clock"></i>
        Last updated: {lastUpdated}
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-stats-grid">
        {healthKPIs.map((kpi, index) => (
          <div key={index} className="kpi-card" style={{ borderLeftColor: getStatusColor(kpi.status) }}>
            <div className="kpi-header">
              <div className="kpi-icon" style={{ backgroundColor: `${getStatusColor(kpi.status)}20`, color: getStatusColor(kpi.status) }}>
                <i className={`fas ${kpi.icon}`}></i>
              </div>
              <div className="kpi-trend">
                <i className={`fas fa-arrow-${kpi.trend.direction === 'up' ? 'up' : kpi.trend.direction === 'down' ? 'down' : 'right'}`}
                   style={{ color: kpi.trend.direction === 'up' ? '#10b981' : kpi.trend.direction === 'down' ? '#ef4444' : '#6c757d' }}
                ></i>
                <span style={{ color: kpi.trend.direction === 'up' ? '#10b981' : kpi.trend.direction === 'down' ? '#ef4444' : '#6c757d' }}>
                  {kpi.trend.value}%
                </span>
              </div>
            </div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
            </div>
            {index === 0 && (
              <div className="kpi-gauge">
                <ReactECharts option={getHealthGaugeOption(Number(kpi.value))} style={{ height: '150px' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-th-large"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <i className="fas fa-dollar-sign"></i>
            Financial Health
          </button>
          <button
            className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            <i className="fas fa-graduation-cap"></i>
            Academic Performance
          </button>
          <button
            className={`tab-button ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            <i className="fas fa-clipboard-check"></i>
            Compliance Tracking
          </button>
          <button
            className={`tab-button ${activeTab === 'campus' ? 'active' : ''}`}
            onClick={() => setActiveTab('campus')}
          >
            <i className="fas fa-building"></i>
            Campus Comparison
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Critical Alerts Section */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-exclamation-triangle"></i>
                    Critical Alerts & Notifications
                  </h2>
                  <button className="btn-link">View All ({healthAlerts.length})</button>
                </div>
                <div className="alerts-container">
                  {healthAlerts.map((alert) => (
                    <div key={alert.id} className="alert-item" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
                      <div className="alert-icon" style={{ backgroundColor: `${getSeverityColor(alert.severity)}20`, color: getSeverityColor(alert.severity) }}>
                        <i className={`fas ${alert.severity === 'urgent' ? 'fa-exclamation-circle' : alert.severity === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                      </div>
                      <div className="alert-content">
                        <div className="alert-header">
                          <span className="alert-title">{alert.title}</span>
                          <span className="alert-category">{alert.category}</span>
                        </div>
                        <p className="alert-message">{alert.message}</p>
                        <span className="alert-timestamp">
                          <i className="fas fa-clock"></i>
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights Section */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-brain"></i>
                    AI-Powered Insights & Predictions
                  </h2>
                </div>
                <div className="ai-insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                      <i className="fas fa-user-times"></i>
                    </div>
                    <div className="insight-content">
                      <h3>Dropout Risk Analysis</h3>
                      <div className="insight-stat">
                        <span className="stat-value">{dropoutRiskStudents.filter(s => s.riskLevel === 'high').length}</span>
                        <span className="stat-label">High Risk Students</span>
                      </div>
                      <p className="insight-description">
                        AI has identified students at high risk of dropping out. CSE department shows highest concentration.
                      </p>
                      <div className="insight-confidence">
                        <span>Confidence: </span>
                        <div className="confidence-bar">
                          <div className="confidence-fill" style={{ width: '87%', backgroundColor: '#10b981' }}></div>
                        </div>
                        <span>87%</span>
                      </div>
                    </div>
                  </div>

                  <div className="insight-card">
                    <div className="insight-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="insight-content">
                      <h3>Enrollment Forecast</h3>
                      <div className="insight-stat">
                        <span className="stat-value">+12%</span>
                        <span className="stat-label">Predicted Growth</span>
                      </div>
                      <p className="insight-description">
                        Based on historical trends and market analysis, expecting 12% increase in enrollments for next academic year.
                      </p>
                      <div className="insight-confidence">
                        <span>Confidence: </span>
                        <div className="confidence-bar">
                          <div className="confidence-fill" style={{ width: '82%', backgroundColor: '#10b981' }}></div>
                        </div>
                        <span>82%</span>
                      </div>
                    </div>
                  </div>

                  <div className="insight-card">
                    <div className="insight-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div className="insight-content">
                      <h3>Resource Optimization</h3>
                      <div className="insight-stat">
                        <span className="stat-value">₹2.5L</span>
                        <span className="stat-label">Potential Savings</span>
                      </div>
                      <p className="insight-description">
                        Optimize lab scheduling and faculty allocation to reduce operational costs while maintaining quality.
                      </p>
                      <div className="insight-confidence">
                        <span>Confidence: </span>
                        <div className="confidence-bar">
                          <div className="confidence-fill" style={{ width: '78%', backgroundColor: '#f59e0b' }}></div>
                        </div>
                        <span>78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Trend Chart */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-chart-area"></i>
                    6-Month Health Trend Analysis
                  </h2>
                </div>
                <div className="chart-container">
                  <ReactECharts option={getHealthTrendChartOption()} style={{ height: '400px' }} />
                </div>
              </div>
            </div>
          )}

          {/* FINANCIAL HEALTH TAB */}
          {activeTab === 'financial' && (
            <div className="financial-tab">
              {/* Financial KPIs */}
              <div className="financial-kpi-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                    <i className="fas fa-hand-holding-usd"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{formatCurrency(financialMetrics.totalFees)}</div>
                    <div className="metric-label">Total Fees</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{formatCurrency(financialMetrics.collectedFees)}</div>
                    <div className="metric-label">Collected Fees</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <span style={{ color: '#10b981' }}>{financialMetrics.monthlyGrowth}% this month</span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{formatCurrency(financialMetrics.pendingFees)}</div>
                    <div className="metric-label">Pending Fees</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{formatCurrency(financialMetrics.overdueFees)}</div>
                    <div className="metric-label">Overdue Fees</div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="charts-row">
                <div className="section-card chart-card">
                  <div className="section-header">
                    <h2>
                      <i className="fas fa-chart-pie"></i>
                      Fee Collection Distribution
                    </h2>
                  </div>
                  <div className="chart-container">
                    <ReactECharts option={getFeeCollectionPieOption()} style={{ height: '350px' }} />
                  </div>
                </div>

                <div className="section-card chart-card">
                  <div className="section-header">
                    <h2>
                      <i className="fas fa-chart-bar"></i>
                      Monthly Collection Trend
                    </h2>
                  </div>
                  <div className="chart-container">
                    <ReactECharts option={getMonthlyCollectionBarOption()} style={{ height: '350px' }} />
                  </div>
                </div>
              </div>

              {/* Department-wise Collection Table */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-table"></i>
                    Department-wise Fee Collection
                  </h2>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Total Students</th>
                        <th>Total Fees</th>
                        <th>Collected</th>
                        <th>Pending</th>
                        <th>Collection Rate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentFinance.map((dept, index) => (
                        <tr key={index}>
                          <td className="dept-name">
                            <i className="fas fa-building"></i>
                            {dept.department}
                          </td>
                          <td>{dept.totalStudents}</td>
                          <td>{formatCurrency(dept.totalFees)}</td>
                          <td className="positive-value">{formatCurrency(dept.collected)}</td>
                          <td className="negative-value">{formatCurrency(dept.pending)}</td>
                          <td>
                            <div className="rate-cell">
                              <span className="rate-value">{dept.collectionRate.toFixed(1)}%</span>
                              <div className="rate-bar">
                                <div className="rate-fill" style={{
                                  width: `${dept.collectionRate}%`,
                                  backgroundColor: dept.collectionRate >= 90 ? '#10b981' : dept.collectionRate >= 80 ? '#f59e0b' : '#ef4444'
                                }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${dept.collectionRate >= 90 ? 'success' : dept.collectionRate >= 80 ? 'warning' : 'danger'}`}>
                              {dept.collectionRate >= 90 ? 'Completed' : dept.collectionRate >= 80 ? 'In Progress' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ACADEMIC PERFORMANCE TAB */}
          {activeTab === 'academic' && (
            <div className="academic-tab">
              {/* Academic KPIs */}
              <div className="academic-kpi-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">87%</div>
                    <div className="metric-label">Overall Pass Percentage</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <span style={{ color: '#10b981' }}>+2% from last semester</span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#10ac8b20', color: '#10ac8b' }}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">7.8</div>
                    <div className="metric-label">Average CGPA</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <span style={{ color: '#10b981' }}>+0.3 improvement</span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">82%</div>
                    <div className="metric-label">Placement Rate</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <span style={{ color: '#10b981' }}>+5% YoY growth</span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#ec489920', color: '#ec4899' }}>
                    <i className="fas fa-flask"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">125</div>
                    <div className="metric-label">Research Publications</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <span style={{ color: '#10b981' }}>+18 this year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Performance Heatmap */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-fire"></i>
                    Department Performance Heatmap
                  </h2>
                  <p className="section-description">
                    Visual representation of department-wise performance across key academic metrics
                  </p>
                </div>
                <div className="chart-container">
                  <ReactECharts option={getDepartmentHeatmapOption()} style={{ height: '400px' }} />
                </div>
              </div>

              {/* Dropout Risk Section */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-user-shield"></i>
                    Student Retention & Dropout Risk Analysis
                  </h2>
                </div>

                <div className="retention-grid">
                  <div className="retention-card">
                    <div className="retention-stat">
                      <div className="stat-value">94.5%</div>
                      <div className="stat-label">Retention Rate</div>
                      <div className="stat-trend">
                        <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                        <span style={{ color: '#10b981' }}>+1.2% from last year</span>
                      </div>
                    </div>
                  </div>

                  <div className="risk-breakdown-grid">
                    <div className="risk-card high-risk">
                      <div className="risk-header">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>High Risk</span>
                      </div>
                      <div className="risk-value">{dropoutRiskStudents.filter(s => s.riskLevel === 'high').length}</div>
                      <div className="risk-percentage">
                        {((dropoutRiskStudents.filter(s => s.riskLevel === 'high').length / dropoutRiskStudents.length) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="risk-card medium-risk">
                      <div className="risk-header">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>Medium Risk</span>
                      </div>
                      <div className="risk-value">{dropoutRiskStudents.filter(s => s.riskLevel === 'medium').length}</div>
                      <div className="risk-percentage">
                        {((dropoutRiskStudents.filter(s => s.riskLevel === 'medium').length / dropoutRiskStudents.length) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="risk-card low-risk">
                      <div className="risk-header">
                        <i className="fas fa-check-circle"></i>
                        <span>Low Risk</span>
                      </div>
                      <div className="risk-value">{dropoutRiskStudents.length - dropoutRiskStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium').length}</div>
                      <div className="risk-percentage">
                        {(((dropoutRiskStudents.length - dropoutRiskStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium').length) / dropoutRiskStudents.length) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* At-Risk Students Table */}
                <div className="section-header" style={{ marginTop: '24px' }}>
                  <h3>High Risk Students Requiring Intervention</h3>
                  <button className="btn-secondary">
                    <i className="fas fa-download"></i>
                    Export List
                  </button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>CGPA</th>
                        <th>Attendance</th>
                        <th>Risk Score</th>
                        <th>Risk Level</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dropoutRiskStudents.filter(s => s.riskLevel === 'high').map((student, index) => (
                        <tr key={index}>
                          <td className="student-id">{student.studentId}</td>
                          <td className="student-name">
                            <i className="fas fa-user-circle"></i>
                            {student.studentName}
                          </td>
                          <td>{student.department}</td>
                          <td>{student.semester}</td>
                          <td className={student.cgpa < 6 ? 'negative-value' : ''}>{student.cgpa.toFixed(1)}</td>
                          <td className={student.attendance < 75 ? 'negative-value' : ''}>{student.attendance}%</td>
                          <td>
                            <div className="risk-score-cell">
                              <span className="risk-score-value">{student.riskScore}/100</span>
                              <div className="risk-score-bar">
                                <div className="risk-score-fill" style={{
                                  width: `${student.riskScore}%`,
                                  backgroundColor: student.riskScore >= 70 ? '#ef4444' : student.riskScore >= 50 ? '#f59e0b' : '#10b981'
                                }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${student.riskLevel === 'high' ? 'danger' : student.riskLevel === 'medium' ? 'warning' : 'success'}`}>
                              {student.riskLevel.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <button className="btn-icon" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn-icon" title="Schedule Intervention">
                              <i className="fas fa-user-plus"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* COMPLIANCE TRACKING TAB */}
          {activeTab === 'compliance' && (
            <div className="compliance-tab">
              {/* Compliance KPIs */}
              <div className="compliance-kpi-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                    <i className="fas fa-award"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">A+</div>
                    <div className="metric-label">NAAC Grade</div>
                    <div className="metric-detail">Valid until Jan 15, 2025</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                    <i className="fas fa-check-double"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">3/5</div>
                    <div className="metric-label">NBA Accredited Programs</div>
                    <div className="metric-detail">CSE, ECE, IT departments</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">Active</div>
                    <div className="metric-label">AICTE Approval</div>
                    <div className="metric-detail">All programs approved</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
                    <i className="fas fa-percent"></i>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">78%</div>
                    <div className="metric-label">Overall Compliance Score</div>
                    <div className="metric-trend">
                      <i className="fas fa-arrow-down" style={{ color: '#ef4444' }}></i>
                      <span style={{ color: '#ef4444' }}>-1% needs attention</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accreditation Criteria Progress Dashboard */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-chart-bar"></i>
                    Accreditation Criteria Progress
                  </h2>
                  <p className="section-description">
                    Detailed breakdown of NAAC and NBA criteria performance with actionable insights
                  </p>
                </div>

                {/* NAAC Criteria Grid */}
                <div className="criteria-grid">
                  {accreditationCriteria.map((criterion) => (
                    <div key={criterion.id} className="criterion-card">
                      <div className="criterion-header">
                        <div className="criterion-title">
                          <span className="criterion-number">{criterion.number}</span>
                          <h3>{criterion.name}</h3>
                        </div>
                        <span
                          className={`status-badge ${criterion.status === 'excellent' ? 'success' : criterion.status === 'good' ? 'info' : 'warning'}`}
                        >
                          {criterion.status === 'excellent' ? 'Excellent' : criterion.status === 'good' ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>

                      <div className="criterion-score-section">
                        <div className="score-display">
                          <span className="current-score">{criterion.currentScore}</span>
                          <span className="score-separator">/</span>
                          <span className="max-score">{criterion.maxScore}</span>
                        </div>
                        <div className="score-gap" style={{
                          color: criterion.currentScore >= criterion.targetScore ? '#10b981' : '#f59e0b'
                        }}>
                          Gap: {criterion.currentScore >= criterion.targetScore ? '✓' : `-${criterion.targetScore - criterion.currentScore}`}
                        </div>
                      </div>

                      <div className="criterion-progress">
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${(criterion.currentScore / criterion.maxScore) * 100}%`,
                              backgroundColor: getCriterionStatusColor(criterion.status)
                            }}
                          ></div>
                        </div>
                        <span className="progress-percentage">{((criterion.currentScore / criterion.maxScore) * 100).toFixed(0)}%</span>
                      </div>

                      <div className="criterion-recommendation">
                        <i className="fas fa-lightbulb"></i>
                        <p>{criterion.topRecommendation}</p>
                      </div>

                      <div className="criterion-footer">
                        <span className="last-updated">
                          <i className="fas fa-clock"></i>
                          Updated: {new Date(criterion.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* NBA Summary */}
                <div className="nba-summary-card">
                  <div className="nba-summary-header">
                    <h3>
                      <i className="fas fa-certificate"></i>
                      NBA Accreditation Summary
                    </h3>
                  </div>
                  <div className="nba-summary-content">
                    <div className="nba-stat">
                      <span className="nba-stat-value">3/5</span>
                      <span className="nba-stat-label">Accredited Programs</span>
                      <span className="nba-stat-detail">CSE, ECE, IT</span>
                    </div>
                    <div className="nba-stat">
                      <span className="nba-stat-value">2</span>
                      <span className="nba-stat-label">Pending Accreditation</span>
                      <span className="nba-stat-detail">MECH, CIVIL</span>
                    </div>
                    <div className="nba-stat">
                      <span className="nba-stat-value">82%</span>
                      <span className="nba-stat-label">Overall Compliance</span>
                      <span className="nba-stat-detail">Good standing</span>
                    </div>
                    <div className="nba-stat">
                      <span className="nba-stat-value">Mar 2025</span>
                      <span className="nba-stat-label">Next Audit</span>
                      <span className="nba-stat-detail">MECH Department</span>
                    </div>
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="gap-analysis-section">
                  <h3>
                    <i className="fas fa-exclamation-circle"></i>
                    Top Areas Needing Attention
                  </h3>
                  <div className="gap-analysis-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Criterion</th>
                          <th>Current Score</th>
                          <th>Target Score</th>
                          <th>Gap</th>
                          <th>Priority</th>
                          <th>Action Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accreditationCriteria
                          .filter(c => c.currentScore < c.targetScore)
                          .sort((a, b) => (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore))
                          .slice(0, 3)
                          .map((criterion) => {
                            const gap = criterion.targetScore - criterion.currentScore;
                            return (
                              <tr key={criterion.id}>
                                <td className="criterion-name-cell">
                                  <strong>{criterion.number}:</strong> {criterion.name}
                                </td>
                                <td>{criterion.currentScore}/{criterion.maxScore}</td>
                                <td>{criterion.targetScore}/{criterion.maxScore}</td>
                                <td className="gap-value" style={{ color: gap >= 10 ? '#ef4444' : '#f59e0b' }}>
                                  -{gap}
                                </td>
                                <td>
                                  <span className={`priority-badge ${gap >= 10 ? 'high' : 'medium'}`}>
                                    {gap >= 10 ? '🔴 High' : '🟡 Medium'}
                                  </span>
                                </td>
                                <td className="action-cell">
                                  {criterion.topRecommendation}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Upcoming Renewals & Deadlines */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-calendar-alt"></i>
                    Upcoming Renewals & Deadlines
                  </h2>
                </div>
                <div className="compliance-timeline">
                  {complianceItems
                    .sort((a, b) => a.daysRemaining - b.daysRemaining)
                    .map((item, index) => (
                      <div key={index} className={`timeline-item ${item.status}`}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h3>{item.body}</h3>
                            <span className={`status-badge ${item.status === 'compliant' ? 'success' : item.status === 'due-soon' ? 'warning' : 'danger'}`}>
                              {item.status === 'compliant' ? 'Compliant' : item.status === 'due-soon' ? 'Due Soon' : 'Overdue'}
                            </span>
                          </div>
                          <div className="timeline-details">
                            <span className="timeline-campus">
                              <i className="fas fa-building"></i>
                              {item.campus}
                            </span>
                            <span className="timeline-date">
                              <i className="fas fa-calendar"></i>
                              {item.expiryDate}
                            </span>
                            <span className={`timeline-days ${item.daysRemaining < 0 ? 'overdue' : item.daysRemaining < 30 ? 'urgent' : ''}`}>
                              <i className="fas fa-clock"></i>
                              {item.daysRemaining < 0
                                ? `${Math.abs(item.daysRemaining)} days overdue`
                                : `${item.daysRemaining} days remaining`}
                            </span>
                          </div>
                          <div className="timeline-actions">
                            <button className="btn-small btn-primary">
                              <i className="fas fa-tasks"></i>
                              View Requirements
                            </button>
                            <button className="btn-small btn-secondary">
                              <i className="fas fa-upload"></i>
                              Upload Documents
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* CAMPUS COMPARISON TAB */}
          {activeTab === 'campus' && (
            <div className="campus-tab">
              {/* Campus Selection */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-sliders-h"></i>
                    Select Campuses to Compare
                  </h2>
                </div>
                <div className="campus-selector">
                  {campusPerformance.map((campus, index) => (
                    <label key={index} className="campus-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCampuses.includes(campus.campusName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedCampuses.length < 5) {
                              setSelectedCampuses([...selectedCampuses, campus.campusName]);
                            } else {
                              alert('Maximum 5 campuses can be selected');
                            }
                          } else {
                            if (selectedCampuses.length > 2) {
                              setSelectedCampuses(selectedCampuses.filter(c => c !== campus.campusName));
                            } else {
                              alert('Minimum 2 campuses must be selected');
                            }
                          }
                        }}
                      />
                      <span className="checkbox-label">{campus.campusName}</span>
                    </label>
                  ))}
                  <div className="selector-actions">
                    <button className="btn-link" onClick={() => setSelectedCampuses(campusPerformance.map(c => c.campusName))}>
                      Select All
                    </button>
                    <button className="btn-link" onClick={() => setSelectedCampuses(['Main Campus', 'North Campus'])}>
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparative Metrics */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-balance-scale"></i>
                    Comparative Performance Metrics
                  </h2>
                </div>
                <div className="campus-comparison-grid">
                  {campusPerformance
                    .filter(c => selectedCampuses.includes(c.campusName))
                    .map((campus, index) => (
                      <div key={index} className="campus-card" style={{ borderTopColor: getStatusColor(campus.healthScore >= 85 ? 'excellent' : campus.healthScore >= 75 ? 'good' : 'fair') }}>
                        <div className="campus-card-header">
                          <h3>{campus.campusName}</h3>
                          <div className="campus-score" style={{ color: getStatusColor(campus.healthScore >= 85 ? 'excellent' : campus.healthScore >= 75 ? 'good' : 'fair') }}>
                            {campus.healthScore}
                          </div>
                        </div>
                        <div className="campus-metrics">
                          <div className="campus-metric">
                            <i className="fas fa-users"></i>
                            <span className="metric-label">Enrollment</span>
                            <span className="metric-value">{campus.enrollment}</span>
                          </div>
                          <div className="campus-metric">
                            <i className="fas fa-chalkboard-teacher"></i>
                            <span className="metric-label">Faculty</span>
                            <span className="metric-value">{campus.facultyStrength}</span>
                          </div>
                          <div className="campus-metric">
                            <i className="fas fa-graduation-cap"></i>
                            <span className="metric-label">Pass %</span>
                            <span className="metric-value">{campus.passPercentage}%</span>
                          </div>
                          <div className="campus-metric">
                            <i className="fas fa-dollar-sign"></i>
                            <span className="metric-label">Collection</span>
                            <span className="metric-value">{campus.collectionRate}%</span>
                          </div>
                          <div className="campus-metric">
                            <i className="fas fa-building"></i>
                            <span className="metric-label">Infrastructure</span>
                            <span className="metric-value">{campus.infrastructureScore}/100</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Multi-Campus Performance Heatmap */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-fire"></i>
                    Multi-Campus Performance Heatmap
                  </h2>
                  <p className="section-description">
                    Comparative analysis across all performance categories
                  </p>
                  <button className="btn-secondary">
                    <i className="fas fa-download"></i>
                    Export Heatmap
                  </button>
                </div>
                <div className="chart-container">
                  <ReactECharts option={getCampusComparisonHeatmapOption()} style={{ height: '450px' }} />
                </div>
              </div>

              {/* Campus Ranking */}
              <div className="section-card">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-trophy"></i>
                    Campus Rankings & Insights
                  </h2>
                </div>
                <div className="ranking-container">
                  {campusPerformance
                    .sort((a, b) => b.healthScore - a.healthScore)
                    .map((campus, index) => (
                      <div key={index} className="ranking-item">
                        <div className="ranking-position">
                          <span className={`rank-number ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                            {index + 1}
                          </span>
                          {index === 0 && <i className="fas fa-crown" style={{ color: '#f59e0b' }}></i>}
                        </div>
                        <div className="ranking-content">
                          <h3>{campus.campusName}</h3>
                          <div className="ranking-score">
                            Overall Score: <strong>{campus.healthScore}/100</strong>
                          </div>
                          <div className="ranking-insights">
                            <div className="insight-tag success">
                              <i className="fas fa-thumbs-up"></i>
                              <span>
                                Strength: {campus.metrics.financial >= 90 ? 'Financial Health' :
                                         campus.metrics.academic >= 85 ? 'Academic Excellence' :
                                         campus.metrics.infrastructure >= 80 ? 'Infrastructure' : 'Faculty Performance'}
                              </span>
                            </div>
                            {(campus.metrics.compliance < 80 || campus.metrics.infrastructure < 75) && (
                              <div className="insight-tag warning">
                                <i className="fas fa-exclamation-triangle"></i>
                                <span>
                                  Needs improvement: {campus.metrics.compliance < 80 ? 'Compliance' : 'Infrastructure'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalHealthDashboard;
