import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getPASCOData } from '../../../../services/data/studentData';
import type { PASCOData } from '../../../../types';

type TabType = 'personality' | 'attitude' | 'skills' | 'character' | 'optimization' | 'career';

interface CareerPath {
  id: string;
  title: string;
  category: string;
  matchPercentage: number;
  icon: string;
  description: string;
  salaryRange: { min: number; max: number };
  demandLevel: 'High' | 'Medium' | 'Low';
  educationPath: string[];
  skillGaps: Array<{ skill: string; current: number; required: number }>;
  roadmap: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  entranceExams: string[];
  topColleges: string[];
  keyStrengths: string[];
}

const PASCO = () => {
  const [activeTab, setActiveTab] = useState<TabType>('personality');
  const [data] = useState<PASCOData>(getPASCOData());
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Calculate overall PASCO score
  const overallScore = Math.round(
    (data.overallScores.personality +
      data.overallScores.attitude +
      data.overallScores.skills +
      data.overallScores.character +
      data.overallScores.optimization) / 5
  );

  // Professional color scheme - muted and sophisticated
  const colors = {
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    muted: '#64748b',
    border: '#e2e8f0',
    background: '#f8fafc',
  };

  // Career matching algorithm - Skills-focused (50% skills, 50% others)
  const calculateCareerMatch = (career: CareerPath): number => {
    // Skills match (50% weight)
    const skillsMatch = data.overallScores.skills;

    // Other components (12.5% each)
    const personalityMatch = data.overallScores.personality;
    const attitudeMatch = data.overallScores.attitude;
    const characterMatch = data.overallScores.character;
    const optimizationMatch = data.overallScores.optimization;

    return Math.round(
      (skillsMatch * 0.50) +
      (personalityMatch * 0.125) +
      (attitudeMatch * 0.125) +
      (characterMatch * 0.125) +
      (optimizationMatch * 0.125)
    );
  };

  // Career database - Based on TN Board 10th grade student profile
  const allCareers: CareerPath[] = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      category: 'Engineering & Technology',
      matchPercentage: 0,
      icon: 'fa-laptop-code',
      description: 'Design, develop, and maintain software applications and systems. Work with cutting-edge technologies to solve real-world problems.',
      salaryRange: { min: 600000, max: 2000000 },
      demandLevel: 'High',
      educationPath: ['10th → Science (Maths)', 'JEE Main/Advanced', 'B.Tech Computer Science', 'Optional: M.Tech'],
      skillGaps: [
        { skill: 'Programming & Coding', current: data.skills.technical.skills.find(s => s.name === 'Coding')?.level || 75, required: 90 },
        { skill: 'Problem Solving', current: data.skills.academic.skills.find(s => s.name === 'Problem Solving')?.level || 85, required: 95 },
        { skill: 'Logical Thinking', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 90 }
      ],
      roadmap: {
        shortTerm: ['Master Mathematics (especially Algebra & Trigonometry)', 'Start learning Python basics', 'Practice logical reasoning daily', 'Build small projects (calculator, games)'],
        mediumTerm: ['Choose Science with Computer Science in 11th', 'Prepare for JEE Main', 'Learn Data Structures & Algorithms', 'Participate in coding competitions', 'Build portfolio projects'],
        longTerm: ['Target top NITs/IITs through JEE Advanced', 'Pursue internships in tech companies', 'Contribute to open-source projects', 'Develop specialized skills (AI/ML, Web Dev, etc.)']
      },
      entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE'],
      topColleges: ['IIT Madras', 'NIT Trichy', 'Anna University', 'VIT Vellore', 'SRM University', 'SSN College of Engineering'],
      keyStrengths: ['Strong mathematical skills (90%)', 'Excellent problem-solving (88%)', 'Good technical aptitude (85%)']
    },
    {
      id: 'doctor',
      title: 'Medical Doctor (MBBS)',
      category: 'Medical & Healthcare',
      matchPercentage: 0,
      icon: 'fa-user-md',
      description: 'Diagnose and treat illnesses, provide healthcare to patients, and save lives through medical expertise.',
      salaryRange: { min: 800000, max: 3000000 },
      demandLevel: 'High',
      educationPath: ['10th → Science (Biology)', 'NEET UG', 'MBBS (5.5 years)', 'MD/MS Specialization (3 years)'],
      skillGaps: [
        { skill: 'Biology', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Science')?.level || 88, required: 95 },
        { skill: 'Chemistry', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Science')?.level || 88, required: 92 },
        { skill: 'Communication', current: data.skills.soft.skills.find(s => s.name === 'Communication')?.level || 85, required: 90 }
      ],
      roadmap: {
        shortTerm: ['Excel in Science (Biology, Chemistry, Physics)', 'Develop strong memorization techniques', 'Start NEET preparation early', 'Volunteer at local clinics/hospitals'],
        mediumTerm: ['Choose Science with Biology in 11th', 'Join NEET coaching', 'Score 95%+ in Biology & Chemistry', 'Practice medical case studies', 'Develop empathy and patient care skills'],
        longTerm: ['Crack NEET with high rank', 'Get into top medical colleges', 'Complete MBBS with distinction', 'Choose specialization (MD/MS)', 'Practice medicine with compassion']
      },
      entranceExams: ['NEET UG', 'AIIMS MBBS (merged with NEET)', 'State Medical Entrance Exams'],
      topColleges: ['AIIMS Delhi', 'CMC Vellore', 'Madras Medical College', 'Stanley Medical College', 'Kilpauk Medical College'],
      keyStrengths: ['Excellent Science scores (93%)', 'Strong empathy & character (92%)', 'Good attention to detail (88%)']
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      category: 'Engineering & Technology',
      matchPercentage: 0,
      icon: 'fa-chart-line',
      description: 'Analyze complex data to extract insights, build predictive models, and drive data-driven decision making.',
      salaryRange: { min: 700000, max: 2500000 },
      demandLevel: 'High',
      educationPath: ['10th → Science (Maths)', 'JEE/KCET', 'B.Tech (CS/IT) or B.Sc Statistics', 'M.Sc Data Science'],
      skillGaps: [
        { skill: 'Mathematics & Statistics', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Math')?.level || 92, required: 95 },
        { skill: 'Programming', current: data.skills.technical.skills.find(s => s.name === 'Coding')?.level || 75, required: 88 },
        { skill: 'Analytical Thinking', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 92 }
      ],
      roadmap: {
        shortTerm: ['Master Statistics & Probability', 'Learn Python for data analysis', 'Practice Excel & data visualization', 'Study basic machine learning concepts'],
        mediumTerm: ['Choose Science with Mathematics', 'Learn R, SQL, and Python libraries (Pandas, NumPy)', 'Work on data projects', 'Prepare for JEE/State engineering exams'],
        longTerm: ['Pursue B.Tech or B.Sc Statistics', 'Master ML algorithms', 'Work on real-world datasets', 'Build strong portfolio', 'Get certified (IBM, Google, etc.)']
      },
      entranceExams: ['JEE Main', 'State Engineering Exams', 'University-specific exams'],
      topColleges: ['IIT Madras', 'ISI Kolkata', 'CMI Chennai', 'Anna University', 'IIT Bombay'],
      keyStrengths: ['Outstanding Math skills (92%)', 'Strong problem-solving (88%)', 'Good technical skills (85%)']
    },
    {
      id: 'mechanical-engineer',
      title: 'Mechanical Engineer',
      category: 'Engineering & Technology',
      matchPercentage: 0,
      icon: 'fa-cog',
      description: 'Design, build, and test mechanical devices, systems, and machines for various industries.',
      salaryRange: { min: 500000, max: 1800000 },
      demandLevel: 'Medium',
      educationPath: ['10th → Science (Maths)', 'JEE Main', 'B.Tech Mechanical Engineering', 'Optional: M.Tech'],
      skillGaps: [
        { skill: 'Physics', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Science')?.level || 88, required: 92 },
        { skill: 'Mathematics', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Math')?.level || 92, required: 90 },
        { skill: 'Design Thinking', current: data.skills.academic.skills.find(s => s.name === 'Creativity')?.level || 78, required: 85 }
      ],
      roadmap: {
        shortTerm: ['Excel in Physics & Mathematics', 'Learn CAD software basics', 'Build simple machines/models', 'Understand basic mechanics'],
        mediumTerm: ['Choose Science stream with Mathematics', 'Prepare for JEE Main', 'Learn SolidWorks, AutoCAD', 'Participate in robotics competitions'],
        longTerm: ['Get into top engineering colleges', 'Specialize in automotive/aerospace/robotics', 'Work on industry projects', 'Pursue higher studies or PSU jobs']
      },
      entranceExams: ['JEE Main', 'JEE Advanced', 'State Engineering Exams', 'GATE (for PSUs/M.Tech)'],
      topColleges: ['IIT Madras', 'NIT Trichy', 'PSG College of Technology', 'Anna University', 'Coimbatore Institute of Technology'],
      keyStrengths: ['Strong Math & Physics (92%, 88%)', 'Good problem-solving (88%)', 'Practical skills (85%)']
    },
    {
      id: 'chartered-accountant',
      title: 'Chartered Accountant (CA)',
      category: 'Commerce, Business & Finance',
      matchPercentage: 0,
      icon: 'fa-calculator',
      description: 'Manage finances, taxation, auditing, and provide financial advisory services to businesses and individuals.',
      salaryRange: { min: 700000, max: 3000000 },
      demandLevel: 'High',
      educationPath: ['10th → Commerce/Any', 'CA Foundation', 'CA Intermediate', 'Articleship', 'CA Final'],
      skillGaps: [
        { skill: 'Mathematics & Accounting', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Math')?.level || 92, required: 90 },
        { skill: 'Analytical Thinking', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 90 },
        { skill: 'Attention to Detail', current: data.character.emotionalIntelligence.selfAwareness || 85, required: 95 }
      ],
      roadmap: {
        shortTerm: ['Master Mathematics & basic accounting', 'Understand business concepts', 'Register for CA Foundation', 'Develop calculation speed & accuracy'],
        mediumTerm: ['Choose Commerce in 11th (recommended)', 'Clear CA Foundation & Intermediate', 'Start articleship training', 'Learn taxation & auditing'],
        longTerm: ['Clear CA Final exam', 'Gain practical experience', 'Join reputed CA firms or corporate finance', 'Consider specialization (taxation, audit, etc.)']
      },
      entranceExams: ['CA Foundation', 'CA Intermediate', 'CA Final (all conducted by ICAI)'],
      topColleges: ['ICAI (Institute of Chartered Accountants of India) - All India program'],
      keyStrengths: ['Excellent Math skills (92%)', 'Strong analytical thinking (82%)', 'Good diligence (88%)']
    },
    {
      id: 'civil-services',
      title: 'Civil Services (IAS/IPS/IFS)',
      category: 'Government & Public Services',
      matchPercentage: 0,
      icon: 'fa-landmark',
      description: 'Serve the nation in administrative, police, or foreign services roles, making policies and implementing governance.',
      salaryRange: { min: 800000, max: 2500000 },
      demandLevel: 'High',
      educationPath: ['10th → Any stream', 'Graduate degree (any field)', 'UPSC CSE preparation', 'Clear Prelims, Mains, Interview'],
      skillGaps: [
        { skill: 'General Knowledge & Current Affairs', current: 75, required: 95 },
        { skill: 'Communication & Leadership', current: data.skills.soft.skills.find(s => s.name === 'Leadership')?.level || 80, required: 92 },
        { skill: 'Analytical Writing', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 90 }
      ],
      roadmap: {
        shortTerm: ['Read newspapers daily (The Hindu, Indian Express)', 'Build strong foundation in History, Geography, Polity', 'Develop reading & writing habits', 'Participate in debates & MUN'],
        mediumTerm: ['Choose any stream (Arts/Science/Commerce)', 'Score well in 12th boards', 'Pursue graduation (any subject)', 'Start UPSC preparation in final year'],
        longTerm: ['Clear UPSC CSE (3 stages: Prelims, Mains, Interview)', 'Get top rank for IAS/IPS/IFS', 'Complete LBSNAA training', 'Serve in field postings']
      },
      entranceExams: ['UPSC Civil Services Examination (CSE)'],
      topColleges: ['Any recognized university for graduation', 'LBSNAA Mussoorie (for training after selection)'],
      keyStrengths: ['Strong character & ethics (90%)', 'Good leadership potential (80%)', 'Excellent attitude (88%)']
    },
    {
      id: 'research-scientist',
      title: 'Research Scientist',
      category: 'Pure Sciences & Research',
      matchPercentage: 0,
      icon: 'fa-flask',
      description: 'Conduct research in Physics, Chemistry, Biology, or Mathematics to advance scientific knowledge and innovation.',
      salaryRange: { min: 600000, max: 2000000 },
      demandLevel: 'Medium',
      educationPath: ['10th → Science (Maths/Bio)', 'B.Sc in Science', 'M.Sc', 'Ph.D', 'Post-doctoral research'],
      skillGaps: [
        { skill: 'Scientific Aptitude', current: data.skills.subjectSpecific.skills.find(s => s.name === 'Science')?.level || 88, required: 95 },
        { skill: 'Research Methodology', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 92 },
        { skill: 'Patience & Perseverance', current: data.attitude.metrics.perseverance || 85, required: 95 }
      ],
      roadmap: {
        shortTerm: ['Excel in Science subjects', 'Develop curiosity & questioning mindset', 'Read scientific journals', 'Participate in science exhibitions'],
        mediumTerm: ['Choose Science with Maths/Biology', 'Score high in 12th boards', 'Pursue B.Sc from top institutions', 'Work on research projects during graduation'],
        longTerm: ['Pursue M.Sc & Ph.D', 'Publish research papers', 'Join ISRO, DRDO, BARC, or universities', 'Contribute to scientific innovation']
      },
      entranceExams: ['IIT JAM (for M.Sc)', 'GATE', 'CSIR-UGC NET', 'IISc/TIFR entrance tests'],
      topColleges: ['IISc Bangalore', 'IITs', 'TIFR Mumbai', 'University of Madras', 'Presidency College Chennai'],
      keyStrengths: ['Excellent Science skills (93%)', 'Strong analytical thinking (82%)', 'High perseverance (85%)']
    },
    {
      id: 'business-manager',
      title: 'Business Manager/MBA',
      category: 'Commerce, Business & Finance',
      matchPercentage: 0,
      icon: 'fa-briefcase',
      description: 'Manage business operations, lead teams, develop strategies, and drive organizational growth.',
      salaryRange: { min: 800000, max: 5000000 },
      demandLevel: 'High',
      educationPath: ['10th → Any stream', 'Graduate degree', 'CAT/XAT/GMAT', 'MBA from top B-schools', '2 years'],
      skillGaps: [
        { skill: 'Leadership', current: data.skills.soft.skills.find(s => s.name === 'Leadership')?.level || 80, required: 90 },
        { skill: 'Communication', current: data.skills.soft.skills.find(s => s.name === 'Communication')?.level || 85, required: 92 },
        { skill: 'Strategic Thinking', current: data.skills.academic.skills.find(s => s.name === 'Critical Thinking')?.level || 82, required: 90 }
      ],
      roadmap: {
        shortTerm: ['Develop leadership through school activities', 'Improve communication skills', 'Learn basic business concepts', 'Participate in business competitions'],
        mediumTerm: ['Choose Commerce (or any stream)', 'Pursue B.Com/BBA/Engineering', 'Build work experience', 'Prepare for CAT/XAT'],
        longTerm: ['Get into IIMs or top B-schools', 'Specialize (Finance, Marketing, Operations)', 'Work in MNCs or startups', 'Climb corporate ladder or start own business']
      },
      entranceExams: ['CAT', 'XAT', 'GMAT', 'SNAP', 'NMAT'],
      topColleges: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'ISB Hyderabad', 'XLRI Jamshedpur'],
      keyStrengths: ['Strong communication (85%)', 'Good leadership (80%)', 'Excellent teamwork (90%)']
    }
  ];

  // Calculate match percentages and sort
  const careersWithMatch = allCareers.map(career => ({
    ...career,
    matchPercentage: calculateCareerMatch(career)
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const topCareers = careersWithMatch.slice(0, 3);
  const alternativeCareers = careersWithMatch.slice(3, 10);

  // Set default selected career
  if (!selectedCareer && topCareers.length > 0) {
    setSelectedCareer(topCareers[0]);
  }

  // Tabs configuration
  const tabs = [
    { id: 'personality', label: 'Personality', icon: 'fa-user-circle' },
    { id: 'attitude', label: 'Attitude', icon: 'fa-smile' },
    { id: 'skills', label: 'Skills', icon: 'fa-tools' },
    { id: 'character', label: 'Character', icon: 'fa-heart' },
    { id: 'optimization', label: 'Optimization', icon: 'fa-chart-line' },
    { id: 'career', label: 'Career Insights', icon: 'fa-graduation-cap' }
  ];

  // PERSONALITY SECTION
  const renderPersonalitySection = () => {
    // Big 5 Radar Chart with professional colors
    const big5ChartOption = {
      tooltip: { trigger: 'item' },
      radar: {
        indicator: [
          { name: 'Openness', max: 100 },
          { name: 'Conscientiousness', max: 100 },
          { name: 'Extraversion', max: 100 },
          { name: 'Agreeableness', max: 100 },
          { name: 'Neuroticism', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 5,
        axisName: { color: colors.secondary, fontSize: 11 },
        splitLine: { lineStyle: { color: colors.border } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: colors.border } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [
            data.personality.big5.openness,
            data.personality.big5.conscientiousness,
            data.personality.big5.extraversion,
            data.personality.big5.agreeableness,
            data.personality.big5.neuroticism
          ],
          areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
          lineStyle: { color: colors.accent, width: 2 },
          itemStyle: { color: colors.accent }
        }]
      }]
    };

    // Learning Style Chart
    const learningStyleOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '10%', right: '10%', bottom: '10%', top: '10%' },
      xAxis: {
        type: 'category',
        data: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
        axisLabel: { rotate: 0, fontSize: 10, color: colors.secondary },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: [
          data.personality.learningStyle.visual,
          data.personality.learningStyle.auditory,
          data.personality.learningStyle.kinesthetic,
          data.personality.learningStyle.readingWriting
        ],
        itemStyle: {
          color: colors.accent,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: colors.secondary,
          fontSize: 12,
          fontWeight: 600
        }
      }]
    };

    // Communication Style Chart
    const communicationStyleOption = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}%', fontSize: 11, color: colors.secondary },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: [
          { value: data.personality.communicationStyle.assertive, name: 'Assertive', itemStyle: { color: '#3b82f6' } },
          { value: data.personality.communicationStyle.passive, name: 'Passive', itemStyle: { color: '#64748b' } },
          { value: data.personality.communicationStyle.collaborative, name: 'Collaborative', itemStyle: { color: '#10b981' } },
          { value: data.personality.communicationStyle.independent, name: 'Independent', itemStyle: { color: '#8b5cf6' } }
        ]
      }]
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.5rem', fontWeight: 600 }}>
            Personality Analysis
          </h2>
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem' }}>
            Understanding your personality traits and preferences
          </p>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={big5ChartOption} style={{ height: '350px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={learningStyleOption} style={{ height: '350px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={communicationStyleOption} style={{ height: '350px' }} />
          </div>
        </div>

        {/* Strengths and Preferences */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
              Key Strengths
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.personality.strengths.map((strength, index) => (
                <div
                  key={index}
                  style={{
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: colors.accent,
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ color: colors.secondary, fontSize: '0.875rem' }}>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
              Learning Preferences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.personality.preferences.map((preference, index) => (
                <div
                  key={index}
                  style={{
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: colors.success,
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ color: colors.secondary, fontSize: '0.875rem' }}>{preference}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ATTITUDE SECTION
  const renderAttitudeSection = () => {
    // Attitude Metrics - Using a clean bar chart instead of gauges
    const attitudeMetricsOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '10%', right: '10%', bottom: '10%', top: '10%' },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['', '', '', '', '', ''], // Empty labels
        axisLabel: { show: false },
        axisLine: { lineStyle: { color: colors.border } },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: [
          data.attitude.metrics.growthMindset,
          data.attitude.metrics.motivation,
          data.attitude.metrics.resilience,
          data.attitude.metrics.positiveThinking,
          data.attitude.metrics.perseverance,
          data.attitude.metrics.goalOrientation
        ],
        itemStyle: {
          color: (params: any) => {
            const value = params.value;
            if (value >= 90) return colors.success;
            if (value >= 80) return colors.accent;
            return colors.muted;
          },
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: colors.secondary,
          fontSize: 12,
          fontWeight: 600
        }
      }]
    };

    // Trend Chart with professional styling
    const trendChartOption = {
      tooltip: { trigger: 'axis' },
      grid: { left: '10%', right: '10%', bottom: '10%', top: '10%' },
      xAxis: {
        type: 'category',
        data: data.attitude.trendData.map(d => d.month),
        axisLabel: { color: colors.secondary },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [{
        data: data.attitude.trendData.map(d => d.score),
        type: 'line',
        smooth: true,
        lineStyle: { color: colors.accent, width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        },
        itemStyle: { color: colors.accent },
        symbol: 'circle',
        symbolSize: 6
      }]
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.5rem', fontWeight: 600 }}>
            Attitude Analysis
          </h2>
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem' }}>
            Your mindset, motivation, and resilience metrics
          </p>
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={attitudeMetricsOption} style={{ height: '400px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={trendChartOption} style={{ height: '400px' }} />
          </div>
        </div>

        {/* Insights */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
            Key Insights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
            {data.attitude.insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <i className="fas fa-check-circle" style={{ color: colors.success, marginTop: '0.125rem', fontSize: '0.875rem' }}></i>
                <span style={{ color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.5 }}>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // SKILLS SECTION
  const renderSkillsSection = () => {
    // Academic Skills - Radar Chart (more visually appealing)
    const academicRadarOption = {
      tooltip: { trigger: 'item' },
      radar: {
        indicator: data.skills.academic.skills.map(s => ({ name: s.name, max: 100 })),
        shape: 'circle',
        splitNumber: 4,
        axisName: { color: colors.secondary, fontSize: 10 },
        splitLine: { lineStyle: { color: colors.border } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: colors.border } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: data.skills.academic.skills.map(s => s.level),
          name: 'Academic Skills',
          areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
          lineStyle: { color: colors.accent, width: 2 },
          itemStyle: { color: colors.accent }
        }]
      }]
    };

    // Soft Skills - Horizontal Bar Chart
    const softSkillsOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '25%', right: '15%', bottom: '10%', top: '10%' },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: data.skills.soft.skills.map(s => s.name),
        axisLabel: { color: colors.secondary, fontSize: 11 },
        axisLine: { lineStyle: { color: colors.border } }
      },
      series: [{
        type: 'bar',
        data: data.skills.soft.skills.map(s => s.level),
        itemStyle: {
          color: colors.success,
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: colors.secondary,
          fontSize: 11,
          fontWeight: 600
        }
      }]
    };

    // Technical Skills - Gauge Chart
    const technicalGaugeOption = {
      series: data.skills.technical.skills.map((skill, index) => ({
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        radius: '45%',
        center: [`${25 + (index % 2) * 50}%`, `${30 + Math.floor(index / 2) * 40}%`],
        axisLine: {
          lineStyle: {
            width: 8,
            color: [[skill.level / 100, colors.warning], [1, colors.border]]
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: {
          offsetCenter: [0, '80%'],
          fontSize: 11,
          color: colors.secondary
        },
        detail: {
          fontSize: 18,
          fontWeight: 600,
          offsetCenter: [0, '20%'],
          valueAnimation: true,
          formatter: '{value}%',
          color: colors.primary
        },
        data: [{ value: skill.level, name: skill.name }]
      }))
    };

    // Subject-Specific Skills - Vertical Bar Chart
    const subjectSkillsOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
      xAxis: {
        type: 'category',
        data: data.skills.subjectSpecific.skills.map(s => s.name.split(' ')[0]), // Shorter labels
        axisLabel: { rotate: 15, color: colors.secondary, fontSize: 10 },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: data.skills.subjectSpecific.skills.map(s => s.level),
        itemStyle: {
          color: colors.accent,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: colors.secondary,
          fontSize: 11,
          fontWeight: 600
        }
      }]
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.5rem', fontWeight: 600 }}>
            Skills Analysis
          </h2>
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem' }}>
            Comprehensive breakdown of academic, soft, technical, and subject-specific skills
          </p>
        </div>

        {/* Skill Category Charts - Fixed 2x2 Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={academicRadarOption} style={{ height: '320px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={softSkillsOption} style={{ height: '320px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={technicalGaugeOption} style={{ height: '320px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={subjectSkillsOption} style={{ height: '320px' }} />
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
            Key Insights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
            {[
              'Strong academic foundation with excellent problem-solving abilities',
              'Outstanding teamwork and communication skills',
              'Technical skills show improvement potential, especially in coding',
              'Mathematics and science skills are well-developed',
              'Leadership skills are developing positively'
            ].map((insight, index) => (
              <div
                key={index}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <i className="fas fa-check-circle" style={{ color: colors.success, marginTop: '0.125rem', fontSize: '0.875rem' }}></i>
                <span style={{ color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.5 }}>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // CHARACTER SECTION
  const renderCharacterSection = () => {
    // Core Values Radar
    const coreValuesOption = {
      tooltip: { trigger: 'item' },
      radar: {
        indicator: data.character.coreValues.map(cv => ({ name: cv.name, max: 100 })),
        shape: 'polygon',
        splitNumber: 5,
        axisName: { color: colors.secondary, fontSize: 10 },
        splitLine: { lineStyle: { color: colors.border } },
        splitArea: { show: true, areaStyle: { color: ['rgba(248, 250, 252, 0.5)', 'rgba(255, 255, 255, 0.5)'] } },
        axisLine: { lineStyle: { color: colors.border } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: data.character.coreValues.map(cv => cv.score),
          name: 'Your Values',
          areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
          lineStyle: { color: colors.accent, width: 2 },
          itemStyle: { color: colors.accent }
        }]
      }]
    };

    // Emotional Intelligence & Work Ethic Combined Chart
    const eiWorkEthicOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        data: ['Emotional Intelligence', 'Work Ethic'],
        bottom: 0,
        textStyle: { color: colors.secondary }
      },
      grid: { left: '15%', right: '10%', bottom: '15%', top: '10%' },
      xAxis: {
        type: 'category',
        data: ['Self Awareness', 'Empathy', 'Regulation', 'Social Skills', 'Diligence', 'Punctuality', 'Reliability', 'Commitment'],
        axisLabel: { rotate: 30, fontSize: 10, color: colors.secondary },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [
        {
          name: 'Emotional Intelligence',
          type: 'bar',
          data: [
            data.character.emotionalIntelligence.selfAwareness,
            data.character.emotionalIntelligence.empathy,
            data.character.emotionalIntelligence.emotionalRegulation,
            data.character.emotionalIntelligence.socialSkills,
            null, null, null, null
          ],
          itemStyle: { color: colors.accent, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: 'Work Ethic',
          type: 'bar',
          data: [
            null, null, null, null,
            data.character.workEthic.diligence,
            data.character.workEthic.punctuality,
            data.character.workEthic.reliability,
            data.character.workEthic.commitment
          ],
          itemStyle: { color: colors.success, borderRadius: [4, 4, 0, 0] }
        }
      ]
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.5rem', fontWeight: 600 }}>
            Character Analysis
          </h2>
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem' }}>
            Your core values, emotional intelligence, and work ethic
          </p>
        </div>

        {/* Character Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={coreValuesOption} style={{ height: '350px' }} />
          </div>

          <div style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <ReactECharts option={eiWorkEthicOption} style={{ height: '350px' }} />
          </div>
        </div>

        {/* Core Values Details */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
            Core Values Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {data.character.coreValues.map((value, index) => (
              <div
                key={index}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: colors.primary, fontSize: '0.9rem', fontWeight: 600 }}>
                    {value.name}
                  </h4>
                  <span style={{
                    background: colors.accent,
                    color: 'white',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {value.score}%
                  </span>
                </div>
                <p style={{ margin: 0, color: colors.muted, fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // OPTIMIZATION SECTION (Simplified)
  const renderOptimizationSection = () => {
    // Progress Tracking Chart
    const progressTrackingOption = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['Personality', 'Attitude', 'Skills', 'Character'],
        bottom: 0,
        textStyle: { color: colors.secondary }
      },
      grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
      xAxis: {
        type: 'category',
        data: data.optimization.progressTracking.map(p => p.month),
        axisLabel: { color: colors.secondary },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: colors.secondary },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [
        {
          name: 'Personality',
          type: 'line',
          data: data.optimization.progressTracking.map(p => p.personality),
          smooth: true,
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Attitude',
          type: 'line',
          data: data.optimization.progressTracking.map(p => p.attitude),
          smooth: true,
          lineStyle: { color: '#10b981', width: 2 },
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'Skills',
          type: 'line',
          data: data.optimization.progressTracking.map(p => p.skills),
          smooth: true,
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'Character',
          type: 'line',
          data: data.optimization.progressTracking.map(p => p.character),
          smooth: true,
          lineStyle: { color: '#8b5cf6', width: 2 },
          itemStyle: { color: '#8b5cf6' }
        }
      ]
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.5rem', fontWeight: 600 }}>
            Optimization Metrics
          </h2>
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem' }}>
            Track your growth and improvement areas
          </p>
        </div>

        {/* Progress Tracking Chart */}
        <div style={{
          background: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <ReactECharts option={progressTrackingOption} style={{ height: '350px' }} />
        </div>

        {/* Top 2 Recommendations */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
            Top Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.optimization.recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
                    {rec.title}
                  </h4>
                  <span style={{
                    background: rec.priority === 'high' ? colors.warning : colors.accent,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem'
                  }}>
                    {rec.priority}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.75rem 0', color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {rec.description}
                </p>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: `1px solid rgba(59, 130, 246, 0.2)`,
                  borderRadius: '6px',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.8rem',
                  color: colors.accent,
                  fontWeight: 500
                }}>
                  Expected Impact: {rec.expectedImpact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Goals */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: colors.primary, fontSize: '1rem', fontWeight: 600 }}>
            Active Goals
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {data.optimization.goals.slice(0, 3).map((goal, index) => (
              <div
                key={index}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: colors.primary, fontSize: '0.9rem', fontWeight: 600 }}>
                      {goal.component}
                    </h4>
                    <span style={{ color: colors.muted, fontSize: '0.75rem' }}>
                      {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: colors.muted }}>
                    <span>Progress: {goal.progress}%</span>
                    <span>•</span>
                    <span>Target: {goal.target}%</span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: colors.border,
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(goal.progress / goal.target) * 100}%`,
                    height: '100%',
                    background: colors.accent,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // CAREER INSIGHTS SECTION - FUTURISTIC REDESIGN
  const renderCareerSection = () => {
    const currentCareer = selectedCareer || topCareers[0];

    if (!currentCareer) return null;

    // Enhanced Skill Gap Chart with gradient colors
    const skillGapOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: colors.accent,
        borderWidth: 1,
        textStyle: { color: '#fff', fontSize: 12 }
      },
      legend: {
        show: false
      },
      grid: { left: '20%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          color: colors.secondary,
          fontSize: 11,
          formatter: '{value}%'
        },
        splitLine: { lineStyle: { color: colors.border, type: 'dashed', opacity: 0.3 } },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: currentCareer.skillGaps.map(g => g.skill),
        axisLabel: {
          color: colors.primary,
          fontSize: 11,
          fontWeight: 600,
          margin: 12
        },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [
        {
          name: 'Required',
          type: 'bar',
          data: currentCareer.skillGaps.map(g => g.required),
          itemStyle: {
            color: colors.background,
            borderRadius: [0, 8, 8, 0],
            borderColor: colors.border,
            borderWidth: 2
          },
          barMaxWidth: 28,
          z: 1,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            fontSize: 10,
            color: colors.muted,
            fontWeight: 600
          }
        },
        {
          name: 'Current',
          type: 'bar',
          data: currentCareer.skillGaps.map(g => g.current),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: colors.accent },
                { offset: 1, color: colors.success }
              ]
            },
            borderRadius: [0, 8, 8, 0],
            shadowColor: colors.accent,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          },
          barMaxWidth: 28,
          z: 2,
          label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}%',
            fontSize: 11,
            color: '#fff',
            fontWeight: 700
          }
        }
      ]
    };

    // Enhanced Match Percentage Gauge - Futuristic Style
    const matchGaugeOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          radius: '100%',
          center: ['50%', '65%'],
          axisLine: {
            lineStyle: {
              width: 16,
              color: [
                [0.6, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#ef4444' }, { offset: 1, color: '#f59e0b' }] }],
                [0.8, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#3b82f6' }] }],
                [1, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#10b981' }] }]
              ],
              shadowColor: colors.accent,
              shadowBlur: 15
            }
          },
          pointer: {
            width: 5,
            length: '70%',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: colors.accent },
                  { offset: 1, color: colors.success }
                ]
              },
              shadowColor: colors.accent,
              shadowBlur: 10
            }
          },
          axisTick: {
            length: 8,
            lineStyle: { color: colors.border, width: 1 }
          },
          splitLine: {
            length: 12,
            lineStyle: { color: colors.border, width: 2 }
          },
          axisLabel: {
            distance: 20,
            color: colors.muted,
            fontSize: 10,
            fontWeight: 600
          },
          title: {
            show: false
          },
          detail: {
            fontSize: 48,
            fontWeight: 700,
            offsetCenter: [0, '25%'],
            valueAnimation: true,
            formatter: function(value) {
              return '{a|' + value + '}{b|%}';
            },
            rich: {
              a: {
                fontSize: 52,
                fontWeight: 700,
                color: colors.primary,
                fontFamily: 'Inter, sans-serif'
              },
              b: {
                fontSize: 28,
                fontWeight: 600,
                color: colors.muted,
                fontFamily: 'Inter, sans-serif'
              }
            }
          },
          data: [{ value: currentCareer.matchPercentage }]
        },
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          radius: '85%',
          center: ['50%', '65%'],
          axisLine: {
            lineStyle: {
              width: 2,
              color: [[1, colors.border]]
            }
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false }
        }
      ]
    };

    const toggleSaveCareer = (careerId: string) => {
      if (savedCareers.includes(careerId)) {
        setSavedCareers(savedCareers.filter(id => id !== careerId));
      } else {
        setSavedCareers([...savedCareers, careerId]);
      }
    };

    return (
      <div>
        {/* Futuristic Section Header with Glass Morphism */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 172, 139, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative gradient overlay */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${colors.accent}40`
              }}>
                <i className="fas fa-compass" style={{ color: 'white', fontSize: '1.75rem' }}></i>
              </div>
              <div>
                <h2 style={{ margin: 0, color: colors.primary, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Career Path Navigator
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', color: colors.muted, fontSize: '0.875rem', fontWeight: 500 }}>
                  AI-Powered Career Recommendations
                </p>
              </div>
            </div>
            <p style={{ margin: 0, color: colors.secondary, fontSize: '1rem', lineHeight: 1.7, maxWidth: '800px' }}>
              Based on your <strong>PASCO profile analysis</strong>, we've identified the career paths that align perfectly with your <strong>skills</strong>, <strong>personality</strong>, and <strong>character traits</strong>. Explore personalized roadmaps to achieve your career goals.
            </p>
          </div>
        </div>

        {/* Top 3 Career Cards - Glass Morphism Design */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, color: colors.primary, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              🎯 Top 3 Career Matches
            </h3>
            <div style={{
              background: colors.background,
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              fontSize: '0.875rem',
              color: colors.secondary,
              fontWeight: 600
            }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '0.5rem', color: colors.accent }}></i>
              Skills-Based Matching (50% weight)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
            {topCareers.map((career, index) => (
              <div
                key={career.id}
                onClick={() => setSelectedCareer(career)}
                style={{
                  background: selectedCareer?.id === career.id
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 172, 139, 0.08) 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: selectedCareer?.id === career.id
                    ? `2px solid ${colors.accent}`
                    : `2px solid ${colors.border}`,
                  borderRadius: '24px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  boxShadow: selectedCareer?.id === career.id
                    ? `0 20px 60px ${colors.accent}30, 0 0 0 1px ${colors.accent}20 inset`
                    : '0 4px 20px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 24px 48px ${colors.accent}25`;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  if (selectedCareer?.id !== career.id) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = colors.border;
                  } else {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
              >
                {/* Gradient overlay for selected card */}
                {selectedCareer?.id === career.id && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                    boxShadow: `0 2px 12px ${colors.accent}60`
                  }}></div>
                )}

                {/* Rank Badge - Futuristic */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '48px',
                  height: '48px',
                  background: index === 0
                    ? `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`
                    : index === 1
                    ? `linear-gradient(135deg, ${colors.accent} 0%, #2563eb 100%)`
                    : `linear-gradient(135deg, ${colors.warning} 0%, #d97706 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  boxShadow: `0 8px 20px ${index === 0 ? colors.success : index === 1 ? colors.accent : colors.warning}40`,
                  border: '3px solid rgba(255,255,255,0.3)'
                }}>
                  {index + 1}
                </div>

                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveCareer(career.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    width: '40px',
                    height: '40px',
                    background: savedCareers.includes(career.id) ? colors.warning : 'rgba(255,255,255,0.9)',
                    border: `2px solid ${savedCareers.includes(career.id) ? colors.warning : colors.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                    color: savedCareers.includes(career.id) ? 'white' : colors.muted,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: savedCareers.includes(career.id) ? `0 4px 12px ${colors.warning}40` : 'none'
                  }}
                >
                  <i className={savedCareers.includes(career.id) ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
                </button>

                {/* Career Icon & Title */}
                <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 1.5rem',
                    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 172, 139, 0.15) 100%)`,
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${colors.border}`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      height: '80%',
                      background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 70%)`,
                      borderRadius: '50%'
                    }}></div>
                    <i className={`fas ${career.icon}`} style={{ fontSize: '2.5rem', color: colors.accent, position: 'relative', zIndex: 1 }}></i>
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {career.title}
                  </h4>
                  <p style={{ margin: '0 0 1.5rem 0', color: colors.muted, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {career.category}
                  </p>
                </div>

                {/* Match Percentage - Futuristic Card */}
                <div style={{
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                  padding: '1.25rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: `0 8px 24px ${colors.accent}30`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>
                      {career.matchPercentage}
                      <span style={{ fontSize: '1.5rem', marginLeft: '0.25rem' }}>%</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      PASCO Match
                    </div>
                  </div>
                </div>

                {/* Key Info with Icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{
                    background: colors.background,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: `1px solid ${colors.border}`
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: `${colors.success}15`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-rupee-sign" style={{ color: colors.success, fontSize: '0.875rem' }}></i>
                    </div>
                    <span style={{ color: colors.secondary, fontWeight: 600 }}>
                      {(career.salaryRange.min / 100000).toFixed(1)}L - {(career.salaryRange.max / 100000).toFixed(1)}L/year
                    </span>
                  </div>
                  <div style={{
                    background: colors.background,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: `1px solid ${colors.border}`
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: `${career.demandLevel === 'High' ? colors.success : colors.warning}15`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-chart-line" style={{ color: career.demandLevel === 'High' ? colors.success : colors.warning, fontSize: '0.875rem' }}></i>
                    </div>
                    <span style={{ color: colors.secondary, fontWeight: 600 }}>
                      {career.demandLevel} Demand
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Career Deep Analytics */}
        {currentCareer && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: `2px solid ${colors.border}`,
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative gradient orbs */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-5%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-15%',
              left: '-5%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>

            {/* Career Header */}
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.success}10 100%)`, borderRadius: '20px', marginBottom: '1rem', border: `1px solid ${colors.accent}30` }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {currentCareer.category}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 0.75rem 0', color: colors.primary, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                  {currentCareer.title}
                </h3>
                <p style={{ margin: '0 0 1.5rem 0', color: colors.secondary, fontSize: '1rem', lineHeight: 1.7, maxWidth: '600px' }}>
                  {currentCareer.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {currentCareer.keyStrengths.map((strength, i) => (
                    <div key={i} style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                      padding: '0.625rem 1.125rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      color: colors.secondary,
                      border: `1.5px solid ${colors.success}30`,
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${colors.success}20 0%, ${colors.accent}10 100%)`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <i className="fas fa-check-circle" style={{ color: colors.success, marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '220px', marginLeft: '2rem' }}>
                <ReactECharts option={matchGaugeOption} style={{ height: '180px' }} />
              </div>
            </div>

            {/* Education Path */}
            <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.accent}30`
                }}>
                  <i className="fas fa-route" style={{ color: 'white', fontSize: '0.875rem' }}></i>
                </div>
                Education Pathway
              </h4>
              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {currentCareer.educationPath.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                      color: 'white',
                      padding: '0.875rem 1.5rem',
                      borderRadius: '16px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      boxShadow: `0 6px 20px ${colors.accent}35, 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                      e.currentTarget.style.boxShadow = `0 10px 30px ${colors.accent}45`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accent}35, 0 0 0 1px rgba(255, 255, 255, 0.2) inset`;
                    }}
                    >
                      {/* Subtle shine effect */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        pointerEvents: 'none'
                      }}></div>
                      {step}
                    </div>
                    {i < currentCareer.educationPath.length - 1 && (
                      <div style={{ margin: '0 0.5rem', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-arrow-right" style={{ color: colors.accent, fontSize: '1.125rem', opacity: 0.6 }}></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Entrance Exams & Top Colleges - Side by Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
              {/* Entrance Exams */}
              <div>
                <h4 style={{ margin: '0 0 1.25rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}10 100%)`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1.5px solid ${colors.accent}40`
                  }}>
                    <i className="fas fa-clipboard-list" style={{ color: colors.accent, fontSize: '0.875rem' }}></i>
                  </div>
                  Entrance Exams
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentCareer.entranceExams.map((exam, i) => (
                    <div key={i} style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      padding: '1rem 1.25rem',
                      borderRadius: '14px',
                      fontSize: '0.9rem',
                      color: colors.secondary,
                      border: `2px solid ${colors.border}`,
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(6px)';
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accent}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${colors.accent}30`
                      }}>
                        <i className="fas fa-graduation-cap" style={{ color: 'white', fontSize: '0.875rem' }}></i>
                      </div>
                      {exam}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Colleges */}
              <div>
                <h4 style={{ margin: '0 0 1.25rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: `linear-gradient(135deg, ${colors.warning}20 0%, ${colors.warning}10 100%)`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1.5px solid ${colors.warning}40`
                  }}>
                    <i className="fas fa-university" style={{ color: colors.warning, fontSize: '0.875rem' }}></i>
                  </div>
                  Top Colleges/Institutions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentCareer.topColleges.slice(0, 5).map((college, i) => (
                    <div key={i} style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      padding: '1rem 1.25rem',
                      borderRadius: '14px',
                      fontSize: '0.9rem',
                      color: colors.secondary,
                      border: `2px solid ${colors.border}`,
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(6px)';
                      e.currentTarget.style.borderColor = colors.warning;
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.warning}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${colors.warning}30`
                      }}>
                        <i className="fas fa-star" style={{ color: 'white', fontSize: '0.875rem' }}></i>
                      </div>
                      {college}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis Chart */}
            <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
              <h4 style={{ margin: '0 0 1.25rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.success}15 100%)`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${colors.accent}40`
                }}>
                  <i className="fas fa-chart-bar" style={{ color: colors.accent, fontSize: '0.875rem' }}></i>
                </div>
                Skill Gap Analysis
              </h4>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                border: `2px solid ${colors.border}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
              }}>
                <ReactECharts option={skillGapOption} style={{ height: '300px' }} />
              </div>
            </div>

            {/* Personalized Roadmap */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4 style={{ margin: '0 0 2rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.accent}30`
                }}>
                  <i className="fas fa-map-marked-alt" style={{ color: 'white', fontSize: '0.875rem' }}></i>
                </div>
                Your Personalized Career Roadmap
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', position: 'relative' }}>
                {/* Timeline connector line */}
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: `linear-gradient(90deg, ${colors.success} 0%, ${colors.accent} 50%, ${colors.warning} 100%)`,
                  borderRadius: '2px',
                  opacity: 0.2,
                  zIndex: 0
                }}></div>

                {/* Short Term */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${colors.success}40`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: `0 4px 20px ${colors.success}15`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${colors.success}25`;
                  e.currentTarget.style.borderColor = colors.success;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.success}15`;
                  e.currentTarget.style.borderColor = `${colors.success}40`;
                }}
                >
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.success} 0%, transparent 100%)`,
                    borderRadius: '16px 16px 0 0'
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `linear-gradient(135deg, ${colors.success} 0%, #34d399 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      boxShadow: `0 6px 20px ${colors.success}40, 0 0 0 3px rgba(255, 255, 255, 0.5)`
                    }}>
                      <i className="fas fa-flag" style={{ fontSize: '1.125rem' }}></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: colors.primary, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.3px' }}>Short Term</h5>
                      <p style={{ margin: 0, color: colors.muted, fontSize: '0.825rem', fontWeight: 600 }}>Next 6 months</p>
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.9 }}>
                    {currentCareer.roadmap.shortTerm.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.625rem', fontWeight: 500 }}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Medium Term */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${colors.accent}40`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: `0 4px 20px ${colors.accent}15`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${colors.accent}25`;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent}15`;
                  e.currentTarget.style.borderColor = `${colors.accent}40`;
                }}
                >
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.accent} 0%, transparent 100%)`,
                    borderRadius: '16px 16px 0 0'
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `linear-gradient(135deg, ${colors.accent} 0%, #60a5fa 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      boxShadow: `0 6px 20px ${colors.accent}40, 0 0 0 3px rgba(255, 255, 255, 0.5)`
                    }}>
                      <i className="fas fa-flag" style={{ fontSize: '1.125rem' }}></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: colors.primary, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.3px' }}>Medium Term</h5>
                      <p style={{ margin: 0, color: colors.muted, fontSize: '0.825rem', fontWeight: 600 }}>11th-12th Std</p>
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.9 }}>
                    {currentCareer.roadmap.mediumTerm.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.625rem', fontWeight: 500 }}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Long Term */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 232, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${colors.warning}40`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: `0 4px 20px ${colors.warning}15`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${colors.warning}25`;
                  e.currentTarget.style.borderColor = colors.warning;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.warning}15`;
                  e.currentTarget.style.borderColor = `${colors.warning}40`;
                }}
                >
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.warning} 0%, transparent 100%)`,
                    borderRadius: '16px 16px 0 0'
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      boxShadow: `0 6px 20px ${colors.warning}40, 0 0 0 3px rgba(255, 255, 255, 0.5)`
                    }}>
                      <i className="fas fa-trophy" style={{ fontSize: '1.125rem' }}></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: colors.primary, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.3px' }}>Long Term</h5>
                      <p style={{ margin: 0, color: colors.muted, fontSize: '0.825rem', fontWeight: 600 }}>College & Beyond</p>
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: colors.secondary, fontSize: '0.875rem', lineHeight: 1.9 }}>
                    {currentCareer.roadmap.longTerm.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.625rem', fontWeight: 500 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Careers Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, color: colors.primary, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Alternative Career Options
            </h3>
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              style={{
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 4px 16px ${colors.accent}30`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${colors.accent}30`;
              }}
            >
              {showAlternatives ? 'Hide' : 'Explore'} Alternatives
              <i className={`fas fa-chevron-${showAlternatives ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {showAlternatives && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {alternativeCareers.map((career) => (
                <div
                  key={career.id}
                  onClick={() => {
                    setSelectedCareer(career);
                    setShowAlternatives(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${colors.accent}20`;
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  {/* Top gradient accent bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                    opacity: 0.7
                  }}></div>

                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveCareer(career.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: savedCareers.includes(career.id)
                        ? `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`
                        : colors.background,
                      border: savedCareers.includes(career.id) ? 'none' : `1.5px solid ${colors.border}`,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: savedCareers.includes(career.id) ? 'white' : colors.muted,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: savedCareers.includes(career.id) ? `0 4px 12px ${colors.warning}40` : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className={savedCareers.includes(career.id) ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.success}15 100%)`,
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1.5px solid ${colors.accent}30`
                    }}>
                      <i className={`fas ${career.icon}`} style={{ fontSize: '1.75rem', color: colors.accent }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
                        {career.title}
                      </h4>
                      <p style={{ margin: 0, color: colors.muted, fontSize: '0.8rem', fontWeight: 600 }}>
                        {career.category}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    boxShadow: `0 4px 16px ${colors.accent}30`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Shine effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '50%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      pointerEvents: 'none'
                    }}></div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
                      {career.matchPercentage}%
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.95)', marginLeft: '0.5rem', fontWeight: 600 }}>
                      Match
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: colors.secondary, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      background: `${colors.success}10`,
                      borderRadius: '10px',
                      border: `1px solid ${colors.success}30`
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        background: `linear-gradient(135deg, ${colors.success} 0%, #34d399 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 2px 8px ${colors.success}30`
                      }}>
                        <i className="fas fa-rupee-sign" style={{ color: 'white', fontSize: '0.75rem' }}></i>
                      </div>
                      <span style={{ fontWeight: 600 }}>{(career.salaryRange.min / 100000).toFixed(1)}-{(career.salaryRange.max / 100000).toFixed(1)}L/yr</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      background: career.demandLevel === 'High' ? `${colors.success}10` : `${colors.warning}10`,
                      borderRadius: '10px',
                      border: `1px solid ${career.demandLevel === 'High' ? colors.success : colors.warning}30`
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        background: career.demandLevel === 'High'
                          ? `linear-gradient(135deg, ${colors.success} 0%, #34d399 100%)`
                          : `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: career.demandLevel === 'High' ? `0 2px 8px ${colors.success}30` : `0 2px 8px ${colors.warning}30`
                      }}>
                        <i className="fas fa-chart-line" style={{ color: 'white', fontSize: '0.75rem' }}></i>
                      </div>
                      <span style={{ fontWeight: 600 }}>{career.demandLevel} Demand</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Careers Quick Access */}
        {savedCareers.length > 0 && (
          <div style={{
            marginTop: '2.5rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 232, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '16px',
            border: `2px solid ${colors.warning}30`,
            boxShadow: `0 4px 20px ${colors.warning}15`
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: colors.primary, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.3px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${colors.warning}30`
              }}>
                <i className="fas fa-bookmark" style={{ color: 'white', fontSize: '0.875rem' }}></i>
              </div>
              Your Saved Careers ({savedCareers.length})
            </h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {savedCareers.map(careerId => {
                const career = careersWithMatch.find(c => c.id === careerId);
                if (!career) return null;
                return (
                  <button
                    key={careerId}
                    onClick={() => {
                      setSelectedCareer(career);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${colors.accent}`,
                      padding: '0.875rem 1.5rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: colors.accent,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 2px 8px ${colors.accent}15`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${colors.accent} 0%, ${colors.success} 100%)`;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accent}35`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)';
                      e.currentTarget.style.color = colors.accent;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 2px 8px ${colors.accent}15`;
                    }}
                  >
                    <i className={`fas ${career.icon}`}></i>
                    {career.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personality': return renderPersonalitySection();
      case 'attitude': return renderAttitudeSection();
      case 'skills': return renderSkillsSection();
      case 'character': return renderCharacterSection();
      case 'optimization': return renderOptimizationSection();
      case 'career': return renderCareerSection();
      default: return null;
    }
  };

  return (
    <>
      {/* Hero Section with PASCO Score */}
      <div style={{
        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(9, 77, 136, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Futuristic grid pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${colors.border}20 1px, transparent 1px), linear-gradient(90deg, ${colors.border}20 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.025em' }}>
              PASCO Score
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
              Personality • Attitude • Skills • Character • Optimization
            </p>
          </div>

          {/* Main Score Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '2rem 4rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Overall Score
              </div>
              <div style={{ fontSize: '5rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.5rem' }}>
                {overallScore}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                out of 100
              </div>
            </div>
          </div>

          {/* Component Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              { label: 'Personality', score: data.overallScores.personality, key: 'P' },
              { label: 'Attitude', score: data.overallScores.attitude, key: 'A' },
              { label: 'Skills', score: data.overallScores.skills, key: 'S' },
              { label: 'Character', score: data.overallScores.character, key: 'C' },
              { label: 'Optimization', score: data.overallScores.optimization, key: 'O' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '1rem 0.5rem',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.25rem',
                  opacity: 0.9
                }}>
                  {item.key}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                  {item.score}
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            opacity: 0.7
          }}>
            Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Professional & Futuristic */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          padding: '0.25rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                flex: '1 0 auto',
                minWidth: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.25rem',
                background: activeTab === tab.id ? colors.primary : 'transparent',
                color: activeTab === tab.id ? 'white' : colors.secondary,
                border: activeTab === tab.id ? 'none' : `1px solid ${colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                letterSpacing: '0.025em'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = colors.background;
                  e.currentTarget.style.borderColor = colors.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = colors.border;
                }
              }}
            >
              <i className={`fas ${tab.icon}`} style={{ fontSize: '1rem' }}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </>
  );
};

export default PASCO;
