import React, { useState } from 'react';
import './CareerPathExplorer.css';

interface Exam {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';
  eligibility: string[];
  idealTiming: string;
  duration: string;
  careerOutcomes: string[];
  successRate: string;
  averageSalary: string;
  topRecruiters: string[];
  syllabus: string[];
  recommendedFor: string[];
  costs?: ExamCosts;
  roiData?: ROIData;
}

interface ExamCosts {
  examFee: number;
  coachingMin: number;
  coachingMax: number;
  booksAndMaterials: number;
  mockTests: number;
  totalMin: number;
  totalMax: number;
}

interface ROIData {
  averageStartingSalary: number;
  averageMidCareerSalary: number;
  courseDuration: string;
  breakEvenYears: number;
  fiveYearROI: number;
}

interface QuestionnaireAnswers {
  careerGoal: string;
  studyPreference: string;
  financialCapability: string;
  timeCommitment: string;
  strengthArea: string;
  workExperience: string;
}

interface RoadmapPhase {
  month: number;
  title: string;
  topics: string[];
  milestones: string[];
  studyHours: string;
}

const CareerPathExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    careerGoal: '',
    studyPreference: '',
    financialCapability: '',
    timeCommitment: '',
    strengthArea: '',
    workExperience: ''
  });

  // New feature states
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [roiExam, setROIExam] = useState<Exam | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonExams, setComparisonExams] = useState<Exam[]>([]);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapExam, setRoadmapExam] = useState<Exam | null>(null);

  // Current student profile
  const studentProfile = {
    degree: 'B.Tech',
    specialization: 'Computer Science',
    year: 3,
    cgpa: 8.5,
    interests: ['Technology', 'Business', 'Research']
  };

  const questions = [
    {
      id: 'careerGoal',
      question: 'What is your primary career goal after graduation?',
      options: [
        { value: 'higher-studies-india', label: 'Pursue Higher Studies in India', icon: 'fa-university' },
        { value: 'higher-studies-abroad', label: 'Study Abroad (MS/MBA)', icon: 'fa-plane' },
        { value: 'corporate-job', label: 'Join Corporate Sector', icon: 'fa-briefcase' },
        { value: 'government-job', label: 'Government Job/Civil Services', icon: 'fa-landmark' },
        { value: 'entrepreneurship', label: 'Start My Own Business', icon: 'fa-lightbulb' }
      ]
    },
    {
      id: 'studyPreference',
      question: 'Where would you prefer to pursue higher education?',
      options: [
        { value: 'india', label: 'Within India (IIT/NIT/IIM)', icon: 'fa-flag' },
        { value: 'usa', label: 'United States', icon: 'fa-flag-usa' },
        { value: 'europe', label: 'Europe/UK', icon: 'fa-globe-europe' },
        { value: 'canada-australia', label: 'Canada/Australia', icon: 'fa-globe' },
        { value: 'flexible', label: 'Flexible/Any Location', icon: 'fa-compass' }
      ]
    },
    {
      id: 'financialCapability',
      question: 'What is your financial capability for higher education?',
      options: [
        { value: 'low', label: 'Limited Budget (₹0-5 Lakhs)', icon: 'fa-rupee-sign' },
        { value: 'medium', label: 'Moderate Budget (₹5-20 Lakhs)', icon: 'fa-money-bill' },
        { value: 'high', label: 'High Budget (₹20-50 Lakhs)', icon: 'fa-money-bill-wave' },
        { value: 'very-high', label: 'No Budget Constraints (50L+)', icon: 'fa-coins' },
        { value: 'scholarship', label: 'Planning to Apply for Scholarships', icon: 'fa-graduation-cap' }
      ]
    },
    {
      id: 'timeCommitment',
      question: 'How much time can you dedicate to exam preparation?',
      options: [
        { value: '3-6-months', label: '3-6 Months (Intensive)', icon: 'fa-bolt' },
        { value: '6-12-months', label: '6-12 Months (Moderate)', icon: 'fa-clock' },
        { value: '1-2-years', label: '1-2 Years (Long-term)', icon: 'fa-calendar-alt' },
        { value: 'flexible', label: 'Flexible Timeline', icon: 'fa-hourglass-half' }
      ]
    },
    {
      id: 'strengthArea',
      question: 'What is your strongest area?',
      options: [
        { value: 'quantitative', label: 'Mathematics & Analytics', icon: 'fa-calculator' },
        { value: 'verbal', label: 'Language & Communication', icon: 'fa-comments' },
        { value: 'technical', label: 'Technical/Engineering Skills', icon: 'fa-code' },
        { value: 'reasoning', label: 'Logical Reasoning', icon: 'fa-brain' },
        { value: 'balanced', label: 'Balanced in All Areas', icon: 'fa-balance-scale' }
      ]
    },
    {
      id: 'workExperience',
      question: 'Do you plan to gain work experience before higher studies?',
      options: [
        { value: 'no', label: 'No, Immediately After Graduation', icon: 'fa-fast-forward' },
        { value: '1-2-years', label: 'Yes, 1-2 Years Experience', icon: 'fa-user-tie' },
        { value: '2-3-years', label: 'Yes, 2-3 Years Experience', icon: 'fa-briefcase' },
        { value: '3-plus', label: 'Yes, 3+ Years Experience', icon: 'fa-award' }
      ]
    }
  ];

  const exams: Exam[] = [
    {
      id: 'cat',
      name: 'CAT',
      fullName: 'Common Admission Test',
      icon: 'fa-briefcase',
      category: 'MBA',
      difficulty: 'Very Hard',
      eligibility: ['Bachelor\'s degree with 50% marks', 'Final year students eligible'],
      idealTiming: 'Start in 2nd or 3rd year',
      duration: '180 minutes',
      careerOutcomes: ['MBA from IIM', 'Management Consultant', 'Product Manager', 'Investment Banker', 'Entrepreneur'],
      successRate: '2-3% get into top IIMs',
      averageSalary: '₹20-30 LPA (IIM graduates)',
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'Amazon', 'Google'],
      syllabus: ['Quantitative Ability', 'Verbal Ability', 'Data Interpretation', 'Logical Reasoning'],
      recommendedFor: ['B.Tech', 'B.Com', 'BBA', 'B.Sc']
    },
    {
      id: 'gre',
      name: 'GRE',
      fullName: 'Graduate Record Examination',
      icon: 'fa-graduation-cap',
      category: 'MS Abroad',
      difficulty: 'Hard',
      eligibility: ['Bachelor\'s degree', 'No minimum percentage required'],
      idealTiming: 'Start in 3rd year, attempt in 4th year',
      duration: '3 hours 45 minutes',
      careerOutcomes: ['MS in USA', 'Research Scientist', 'Data Scientist', 'Software Engineer abroad', 'PhD opportunities'],
      successRate: '60-70% get admits with good scores',
      averageSalary: '$80,000-$120,000 (US graduates)',
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Stanford Research Labs'],
      syllabus: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'],
      recommendedFor: ['B.Tech', 'B.Sc', 'B.E', 'BCA']
    },
    {
      id: 'gate',
      name: 'GATE',
      fullName: 'Graduate Aptitude Test in Engineering',
      icon: 'fa-cogs',
      category: 'M.Tech/PSU',
      difficulty: 'Hard',
      eligibility: ['B.E/B.Tech (final year or completed)', 'B.Sc graduates in relevant fields'],
      idealTiming: 'Attempt in final year',
      duration: '3 hours',
      careerOutcomes: ['M.Tech from IIT/NIT', 'PSU Jobs (ONGC, NTPC, BHEL)', 'Research positions', 'Government scientist'],
      successRate: '15-20% qualify',
      averageSalary: '₹12-18 LPA (PSUs), ₹8-15 LPA (M.Tech graduates)',
      topRecruiters: ['ISRO', 'DRDO', 'BARC', 'ONGC', 'NTPC', 'BHEL', 'GAIL'],
      syllabus: ['Engineering Mathematics', 'Core Subject (CS/EC/ME etc.)', 'General Aptitude'],
      recommendedFor: ['B.Tech', 'B.E', 'B.Sc']
    },
    {
      id: 'gmat',
      name: 'GMAT',
      fullName: 'Graduate Management Admission Test',
      icon: 'fa-chart-line',
      category: 'MBA',
      difficulty: 'Very Hard',
      eligibility: ['Bachelor\'s degree', 'Work experience preferred but not mandatory'],
      idealTiming: 'After 2-3 years of work experience',
      duration: '3 hours 7 minutes',
      careerOutcomes: ['MBA from top B-schools globally', 'Management Consultant', 'Investment Banker', 'C-level Executive'],
      successRate: '15-20% score 700+',
      averageSalary: '$100,000-$150,000 (International MBA)',
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Goldman Sachs', 'JP Morgan'],
      syllabus: ['Quantitative Reasoning', 'Verbal Reasoning', 'Integrated Reasoning', 'Analytical Writing'],
      recommendedFor: ['All graduates with work experience']
    },
    {
      id: 'upsc',
      name: 'UPSC CSE',
      fullName: 'Civil Services Examination',
      icon: 'fa-landmark',
      category: 'Government',
      difficulty: 'Very Hard',
      eligibility: ['Bachelor\'s degree', 'Age: 21-32 years', 'Limited attempts: 6 for General'],
      idealTiming: 'Start preparation in 3rd or 4th year',
      duration: 'Prelims: 2 papers, Mains: 9 papers',
      careerOutcomes: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'District Collector', 'Policy Maker'],
      successRate: '0.1% (around 1000 selected from 10 lakh)',
      averageSalary: '₹56,100 - ₹2,50,000 per month',
      topRecruiters: ['Government of India', 'State Governments'],
      syllabus: ['History', 'Geography', 'Polity', 'Economy', 'Science & Tech', 'Current Affairs', 'Essay', 'Ethics'],
      recommendedFor: ['All graduates']
    },
    {
      id: 'cfa',
      name: 'CFA',
      fullName: 'Chartered Financial Analyst',
      icon: 'fa-money-bill-wave',
      category: 'Finance',
      difficulty: 'Very Hard',
      eligibility: ['Bachelor\'s degree or final year', '4 years work experience (can be earned post-degree)'],
      idealTiming: 'Start Level 1 in final year',
      duration: '3 levels over 2-4 years',
      careerOutcomes: ['Investment Analyst', 'Portfolio Manager', 'Risk Manager', 'Financial Advisor', 'Hedge Fund Manager'],
      successRate: '40-50% pass each level',
      averageSalary: '₹8-25 LPA in India, $80,000+ abroad',
      topRecruiters: ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'Citibank', 'HSBC'],
      syllabus: ['Ethics', 'Quantitative Methods', 'Economics', 'Financial Reporting', 'Equity', 'Fixed Income', 'Derivatives', 'Portfolio Management'],
      recommendedFor: ['B.Com', 'BBA', 'B.Tech', 'Economics graduates']
    },
    {
      id: 'ielts',
      name: 'IELTS',
      fullName: 'International English Language Testing System',
      icon: 'fa-globe',
      category: 'Language',
      difficulty: 'Moderate',
      eligibility: ['No formal eligibility', 'Required for study/work abroad'],
      idealTiming: '6-8 months before application deadline',
      duration: '2 hours 45 minutes',
      careerOutcomes: ['Study in UK/Canada/Australia', 'Work permits abroad', 'Immigration eligibility'],
      successRate: '70-80% achieve required band',
      averageSalary: 'Enables higher education abroad',
      topRecruiters: ['Universities worldwide accept IELTS'],
      syllabus: ['Listening', 'Reading', 'Writing', 'Speaking'],
      recommendedFor: ['Students planning to study/work abroad']
    },
    {
      id: 'toefl',
      name: 'TOEFL',
      fullName: 'Test of English as a Foreign Language',
      icon: 'fa-language',
      category: 'Language',
      difficulty: 'Moderate',
      eligibility: ['No formal eligibility', 'Required for US universities'],
      idealTiming: '6-8 months before application deadline',
      duration: '3 hours',
      careerOutcomes: ['Study in USA', 'MS admissions', 'PhD programs'],
      successRate: '75-85% achieve required score',
      averageSalary: 'Gateway to US education',
      topRecruiters: ['US universities require TOEFL'],
      syllabus: ['Reading', 'Listening', 'Speaking', 'Writing'],
      recommendedFor: ['Students targeting US universities']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Exams', icon: 'fa-th' },
    { id: 'MBA', name: 'MBA & Management', icon: 'fa-briefcase' },
    { id: 'MS Abroad', name: 'Higher Studies Abroad', icon: 'fa-plane' },
    { id: 'M.Tech/PSU', name: 'M.Tech & PSU', icon: 'fa-cogs' },
    { id: 'Government', name: 'Government Services', icon: 'fa-landmark' },
    { id: 'Finance', name: 'Finance & Banking', icon: 'fa-money-bill-wave' },
    { id: 'Language', name: 'Language Tests', icon: 'fa-language' }
  ];

  const filteredExams = selectedCategory === 'all'
    ? exams
    : exams.filter(exam => exam.category === selectedCategory);

  const handleAnswerSelect = (value: string) => {
    const currentQ = questions[currentQuestion];
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Submit questionnaire
      handleSubmitQuestionnaire();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuestionnaire = () => {
    setShowQuestionnaire(false);
    setShowLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      setShowLoading(false);
      setShowAIRecommendations(true);
    }, 3000); // 3 seconds loading animation
  };

  const getAIRecommendations = () => {
    const recommendations: any[] = [];
    let baseScore = 50;

    // ========== ANALYZE CAREER GOAL ==========
    if (answers.careerGoal === 'higher-studies-abroad') {
      // Study abroad path
      if (answers.studyPreference === 'usa') {
        // USA specifically
        const greScore = baseScore + 35;
        recommendations.push({
          exam: 'GRE',
          reason: `Perfect match! Your goal to study in the USA aligns with GRE requirements. With your ${studentProfile.specialization} background and CGPA of ${studentProfile.cgpa}, you're competitive for top US universities. ${answers.financialCapability === 'scholarship' ? 'Many scholarships are available for GRE scores above 320.' : ''}`,
          priority: 'High',
          timeline: answers.timeCommitment === '3-6-months' ? 'Start intensive prep now' : 'Start prep in 2-3 months, attempt in 6 months',
          matchScore: greScore + (answers.strengthArea === 'quantitative' || answers.strengthArea === 'balanced' ? 10 : 5)
        });

        recommendations.push({
          exam: 'TOEFL',
          reason: 'Essential for US universities. TOEFL demonstrates English proficiency and is required alongside GRE for most programs.',
          priority: 'High',
          timeline: 'Take 2-3 months before university applications',
          matchScore: baseScore + 30 + (answers.strengthArea === 'verbal' ? 8 : 3)
        });
      } else if (answers.studyPreference === 'europe') {
        // Europe/UK
        const greScore = baseScore + 30;
        recommendations.push({
          exam: 'GRE',
          reason: `Excellent choice for Europe! Many top European universities accept GRE scores. ${answers.financialCapability === 'low' || answers.financialCapability === 'medium' ? 'European universities often have lower tuition than US schools.' : ''}`,
          priority: 'High',
          timeline: 'Start prep now, attempt in 4-6 months',
          matchScore: greScore + (answers.strengthArea === 'quantitative' ? 8 : 4)
        });

        recommendations.push({
          exam: 'IELTS',
          reason: 'Required for UK and many European universities. IELTS is widely accepted across Europe and easier than TOEFL for many students.',
          priority: 'High',
          timeline: 'Take 3-4 months before applications',
          matchScore: baseScore + 28 + (answers.strengthArea === 'verbal' ? 8 : 3)
        });
      } else if (answers.studyPreference === 'canada-australia') {
        // Canada/Australia
        recommendations.push({
          exam: 'GRE',
          reason: `Great fit! Canadian and Australian universities highly value GRE scores. ${answers.financialCapability === 'scholarship' ? 'Excellent scholarship opportunities available.' : 'PR pathways are easier in these countries.'}`,
          priority: 'High',
          timeline: 'Start prep now, attempt in 5-6 months',
          matchScore: baseScore + 32 + (answers.strengthArea === 'quantitative' ? 8 : 4)
        });

        recommendations.push({
          exam: 'IELTS',
          reason: 'Mandatory for Canada and Australia. IELTS also helps with PR applications in these countries.',
          priority: 'High',
          timeline: 'Take 3-4 months before applications',
          matchScore: baseScore + 30 + (answers.strengthArea === 'verbal' ? 7 : 3)
        });
      } else {
        // Flexible location
        recommendations.push({
          exam: 'GRE',
          reason: `Universal choice! GRE opens doors to universities worldwide. Your flexibility gives you access to 1000+ programs globally.`,
          priority: 'High',
          timeline: 'Start prep in 2-3 months',
          matchScore: baseScore + 30 + (answers.strengthArea === 'quantitative' || answers.strengthArea === 'balanced' ? 8 : 4)
        });
      }

      // Add MBA option for abroad with work experience
      if (answers.workExperience !== 'no' && answers.financialCapability !== 'low') {
        recommendations.push({
          exam: 'GMAT',
          reason: `With ${answers.workExperience === '3-plus' ? '3+' : answers.workExperience} years work experience, you're ideal for top global MBA programs. International MBAs offer $100K+ salaries.`,
          priority: 'High',
          timeline: 'Start prep in 3-4 months',
          matchScore: baseScore + 28 + (answers.workExperience === '3-plus' ? 15 : answers.workExperience === '2-3-years' ? 10 : 5)
        });
      }
    }

    if (answers.careerGoal === 'higher-studies-india') {
      // India higher studies
      const gateScore = baseScore + 35;
      recommendations.push({
        exam: 'GATE',
        reason: `Perfect fit! GATE is your gateway to IITs/NITs for M.Tech and high-paying PSU jobs. Your ${studentProfile.specialization} background is ideal. ${answers.financialCapability === 'low' ? 'Cost-effective option with excellent RoI.' : 'Dual benefit: M.Tech admission + PSU recruitment.'}`,
        priority: 'High',
        timeline: answers.timeCommitment === '6-12-months' ? 'Start prep now for next attempt' : 'Attempt in final year',
        matchScore: gateScore + (answers.strengthArea === 'technical' ? 12 : answers.strengthArea === 'balanced' ? 8 : 4)
      });

      // Add CAT for MBA in India
      if (answers.studyPreference === 'india' || answers.studyPreference === 'flexible') {
        recommendations.push({
          exam: 'CAT',
          reason: `Excellent option for IIM MBA! ${answers.workExperience === 'no' ? 'Freshers with good CAT scores get into top IIMs.' : 'Your work experience gives you an edge in IIM admissions.'} ${answers.financialCapability === 'low' ? 'Many scholarships available.' : ''}`,
          priority: answers.workExperience === 'no' ? 'Medium' : 'High',
          timeline: answers.workExperience === 'no' ? 'Start prep now or after 1-2 years work experience' : 'Start prep in 4-6 months',
          matchScore: baseScore + (answers.workExperience === 'no' ? 20 : 30) + (answers.strengthArea === 'quantitative' || answers.strengthArea === 'balanced' ? 10 : 5)
        });
      }
    }

    if (answers.careerGoal === 'corporate-job') {
      // Corporate sector
      if (answers.workExperience !== 'no') {
        // With work experience - MBA is great
        recommendations.push({
          exam: 'CAT',
          reason: `Highly recommended! With ${answers.workExperience === '3-plus' ? '3+' : answers.workExperience} years work experience, you're a strong MBA candidate. IIM graduates with tech background earn ₹20-30 LPA average.`,
          priority: 'High',
          timeline: 'Start prep in 3-4 months, attempt this year',
          matchScore: baseScore + 35 + (answers.workExperience === '3-plus' ? 10 : answers.workExperience === '2-3-years' ? 8 : 5) + (answers.strengthArea === 'quantitative' ? 8 : 4)
        });
      } else {
        // Without work experience
        if (answers.studyPreference === 'india') {
          recommendations.push({
            exam: 'GATE',
            reason: `Best for immediate career growth! GATE qualifies you for high-paying PSU jobs (₹12-18 LPA) right after graduation. No work experience needed.`,
            priority: 'High',
            timeline: 'Attempt in final year',
            matchScore: baseScore + 32 + (answers.strengthArea === 'technical' ? 10 : 5)
          });
        }

        recommendations.push({
          exam: 'CAT',
          reason: 'Strategic move! Consider CAT after gaining 2-3 years corporate experience for better RoI and profile strength.',
          priority: 'Medium',
          timeline: 'Plan for 2-3 years later',
          matchScore: baseScore + 18
        });
      }
    }

    if (answers.careerGoal === 'government-job') {
      // Government job aspirants
      const upscScore = baseScore + 30;
      recommendations.push({
        exam: 'UPSC CSE',
        reason: `Aligned with your goal! UPSC CSE leads to IAS/IPS positions - the most prestigious government roles. ${answers.timeCommitment === '1-2-years' ? 'Your long-term commitment is essential for success.' : 'Requires 1-2 years dedicated preparation.'} ${answers.strengthArea === 'balanced' ? 'Your balanced skillset is perfect for UPSC\'s diverse syllabus.' : ''}`,
        priority: 'High',
        timeline: answers.timeCommitment === '1-2-years' ? 'Start full-time prep now' : 'Start prep now, attempt in 1-2 years',
        matchScore: upscScore + (answers.timeCommitment === '1-2-years' ? 15 : 8) + (answers.strengthArea === 'balanced' ? 8 : 4)
      });

      // GATE for PSU jobs
      if (studentProfile.degree === 'B.Tech') {
        recommendations.push({
          exam: 'GATE',
          reason: `Great alternative! GATE directly qualifies you for PSU jobs (ONGC, NTPC, BHEL) with ₹12-18 LPA packages. Easier than UPSC with faster results.`,
          priority: 'High',
          timeline: 'Attempt in final year',
          matchScore: baseScore + 28 + (answers.strengthArea === 'technical' ? 10 : 5)
        });
      }
    }

    if (answers.careerGoal === 'entrepreneurship') {
      // Entrepreneurship
      if (answers.workExperience !== 'no' && answers.financialCapability !== 'low') {
        recommendations.push({
          exam: 'CAT',
          reason: `Perfect for entrepreneurs! IIM MBA provides business networks, funding access, and management skills crucial for startups. Many successful founders are IIM alumni.`,
          priority: 'High',
          timeline: 'Start prep in 4-6 months',
          matchScore: baseScore + 30 + (answers.workExperience === '3-plus' ? 12 : 8)
        });

        if (answers.studyPreference !== 'india') {
          recommendations.push({
            exam: 'GMAT',
            reason: 'International MBA programs offer global exposure, investor networks, and access to international markets - invaluable for entrepreneurs.',
            priority: 'Medium',
            timeline: 'Consider for future',
            matchScore: baseScore + 25
          });
        }
      } else {
        // No work experience
        recommendations.push({
          exam: 'CAT',
          reason: 'Consider CAT after gaining 2-3 years industry experience. Real-world experience strengthens both your MBA profile and entrepreneurial skills.',
          priority: 'Medium',
          timeline: 'Plan for 2-3 years later',
          matchScore: baseScore + 15
        });
      }
    }

    // ========== ANALYZE FINANCIAL CAPABILITY ==========
    if (answers.financialCapability === 'low' && !recommendations.find(r => r.exam === 'GATE')) {
      if (studentProfile.degree === 'B.Tech') {
        recommendations.push({
          exam: 'GATE',
          reason: 'Budget-friendly option! GATE exam fee is minimal (₹1,500) and leads to excellent career opportunities. M.Tech in IITs offers stipends too.',
          priority: 'High',
          timeline: 'Attempt in final year',
          matchScore: baseScore + 25
        });
      }
    }

    if ((answers.financialCapability === 'high' || answers.financialCapability === 'very-high') && !recommendations.find(r => r.exam === 'GMAT') && answers.workExperience !== 'no') {
      recommendations.push({
        exam: 'GMAT',
        reason: 'With your financial capability and work experience, international MBA programs offer unparalleled global opportunities and $100K+ starting salaries.',
        priority: 'Medium',
        timeline: 'Consider in 6-12 months',
        matchScore: baseScore + 22
      });
    }

    // ========== ANALYZE TIME COMMITMENT ==========
    if (answers.timeCommitment === '3-6-months' && !recommendations.find(r => r.exam === 'CAT' || r.exam === 'GRE')) {
      if (!recommendations.find(r => r.exam === 'GRE')) {
        recommendations.push({
          exam: 'GRE',
          reason: 'Perfect timing! GRE can be cracked in 3-6 months with focused preparation. Opens doors to 1000+ global universities.',
          priority: 'High',
          timeline: 'Start intensive prep now',
          matchScore: baseScore + 28
        });
      }
    }

    // ========== ANALYZE STRENGTH AREA ==========
    if (answers.strengthArea === 'quantitative' && !recommendations.find(r => r.exam === 'CAT')) {
      recommendations.push({
        exam: 'CAT',
        reason: 'Your quantitative strength is perfect for CAT! Quant section carries 34% weightage. Strong quant candidates have higher success rates.',
        priority: 'Medium',
        timeline: 'Start prep 6-8 months before exam',
        matchScore: baseScore + 23
      });
    }

    if (answers.strengthArea === 'verbal' && !recommendations.find(r => r.exam === 'IELTS' || r.exam === 'TOEFL')) {
      if (answers.studyPreference !== 'india') {
        recommendations.push({
          exam: 'IELTS',
          reason: 'Your verbal strength is advantageous! IELTS heavily tests language skills. You can achieve high band scores (7.5+) easily.',
          priority: 'Medium',
          timeline: 'Take 2-3 months prep',
          matchScore: baseScore + 22
        });
      }
    }

    if (answers.strengthArea === 'technical' && !recommendations.find(r => r.exam === 'GATE')) {
      if (studentProfile.degree === 'B.Tech') {
        recommendations.push({
          exam: 'GATE',
          reason: 'Excellent match! GATE heavily focuses on technical/core subjects. Your technical strength gives you a competitive edge.',
          priority: 'High',
          timeline: 'Attempt in final year',
          matchScore: baseScore + 26
        });
      }
    }

    // ========== ENSURE QUALITY RECOMMENDATIONS ==========
    // Remove duplicates and sort by match score
    const uniqueRecs = recommendations.reduce((acc: any[], curr) => {
      if (!acc.find(r => r.exam === curr.exam)) {
        acc.push(curr);
      } else {
        // If duplicate, keep the one with higher score
        const existingIndex = acc.findIndex(r => r.exam === curr.exam);
        if (curr.matchScore > acc[existingIndex].matchScore) {
          acc[existingIndex] = curr;
        }
      }
      return acc;
    }, []);

    // Sort by match score and return top 3
    return uniqueRecs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Moderate': return '#3b82f6';
      case 'Hard': return '#f59e0b';
      case 'Very Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Helper function to get exam costs and ROI data
  const getExamFinancials = (examName: string): { costs: ExamCosts, roi: ROIData } | null => {
    const financialData: Record<string, { costs: ExamCosts, roi: ROIData }> = {
      'CAT': {
        costs: {
          examFee: 2500,
          coachingMin: 30000,
          coachingMax: 150000,
          booksAndMaterials: 5000,
          mockTests: 3000,
          totalMin: 40500,
          totalMax: 160500
        },
        roi: {
          averageStartingSalary: 2000000,
          averageMidCareerSalary: 4000000,
          courseDuration: '2 years',
          breakEvenYears: 1.5,
          fiveYearROI: 850
        }
      },
      'GRE': {
        costs: {
          examFee: 22550,
          coachingMin: 25000,
          coachingMax: 80000,
          booksAndMaterials: 8000,
          mockTests: 5000,
          totalMin: 60550,
          totalMax: 115550
        },
        roi: {
          averageStartingSalary: 8000000,
          averageMidCareerSalary: 15000000,
          courseDuration: '2 years',
          breakEvenYears: 2,
          fiveYearROI: 1200
        }
      },
      'GATE': {
        costs: {
          examFee: 1800,
          coachingMin: 15000,
          coachingMax: 50000,
          booksAndMaterials: 3000,
          mockTests: 2000,
          totalMin: 21800,
          totalMax: 56800
        },
        roi: {
          averageStartingSalary: 1200000,
          averageMidCareerSalary: 2500000,
          courseDuration: '2 years (M.Tech) or Direct PSU',
          breakEvenYears: 1,
          fiveYearROI: 650
        }
      },
      'GMAT': {
        costs: {
          examFee: 28000,
          coachingMin: 40000,
          coachingMax: 200000,
          booksAndMaterials: 10000,
          mockTests: 8000,
          totalMin: 86000,
          totalMax: 246000
        },
        roi: {
          averageStartingSalary: 10000000,
          averageMidCareerSalary: 20000000,
          courseDuration: '2 years',
          breakEvenYears: 2.5,
          fiveYearROI: 1500
        }
      },
      'UPSC CSE': {
        costs: {
          examFee: 100,
          coachingMin: 50000,
          coachingMax: 150000,
          booksAndMaterials: 15000,
          mockTests: 5000,
          totalMin: 70100,
          totalMax: 170100
        },
        roi: {
          averageStartingSalary: 672000,
          averageMidCareerSalary: 2500000,
          courseDuration: '1-2 years preparation',
          breakEvenYears: 3,
          fiveYearROI: 400
        }
      },
      'CFA': {
        costs: {
          examFee: 350000,
          coachingMin: 100000,
          coachingMax: 300000,
          booksAndMaterials: 20000,
          mockTests: 10000,
          totalMin: 480000,
          totalMax: 680000
        },
        roi: {
          averageStartingSalary: 1200000,
          averageMidCareerSalary: 3500000,
          courseDuration: '2-4 years (3 levels)',
          breakEvenYears: 2,
          fiveYearROI: 550
        }
      },
      'IELTS': {
        costs: {
          examFee: 16250,
          coachingMin: 10000,
          coachingMax: 30000,
          booksAndMaterials: 2000,
          mockTests: 1000,
          totalMin: 29250,
          totalMax: 49250
        },
        roi: {
          averageStartingSalary: 6000000,
          averageMidCareerSalary: 12000000,
          courseDuration: 'Gateway exam',
          breakEvenYears: 1,
          fiveYearROI: 2000
        }
      },
      'TOEFL': {
        costs: {
          examFee: 16900,
          coachingMin: 8000,
          coachingMax: 25000,
          booksAndMaterials: 2000,
          mockTests: 1000,
          totalMin: 27900,
          totalMax: 44900
        },
        roi: {
          averageStartingSalary: 6500000,
          averageMidCareerSalary: 13000000,
          courseDuration: 'Gateway exam',
          breakEvenYears: 1,
          fiveYearROI: 2100
        }
      }
    };

    return financialData[examName] || null;
  };

  // Get preparation roadmap for an exam
  const getRoadmap = (examName: string): RoadmapPhase[] => {
    const roadmaps: Record<string, RoadmapPhase[]> = {
      'CAT': [
        {
          month: 1,
          title: 'Foundation Building',
          topics: ['Basic Quantitative Aptitude', 'Grammar Fundamentals', 'Reading Comprehension Basics', 'Logical Reasoning Introduction'],
          milestones: ['Complete basic math concepts', 'Solve 500+ quant problems', 'Read 10 RC passages'],
          studyHours: '3-4 hours/day'
        },
        {
          month: 2,
          title: 'Concept Strengthening',
          topics: ['Advanced Quant (Algebra, Geometry)', 'Para Jumbles', 'Data Interpretation Basics', 'Critical Reasoning'],
          milestones: ['Complete all quant topics', 'Solve 100 DI sets', 'Master grammar rules'],
          studyHours: '4-5 hours/day'
        },
        {
          month: 3,
          title: 'Speed & Accuracy',
          topics: ['Shortcuts & Tricks', 'Advanced DI', 'Sentence Correction', 'Syllogisms & Arrangements'],
          milestones: ['Reduce solving time by 30%', 'Attempt first full mock', 'Score 70+ percentile'],
          studyHours: '5-6 hours/day'
        },
        {
          month: 4,
          title: 'Mock Test Phase',
          topics: ['Full-length mocks', 'Weak area revision', 'Time management', 'Exam strategy'],
          milestones: ['Attempt 15 full mocks', 'Analyze each mock thoroughly', 'Score 85+ percentile'],
          studyHours: '6-7 hours/day'
        },
        {
          month: 5,
          title: 'Final Preparation',
          topics: ['Previous year papers', 'Revision of mistakes', 'Mental conditioning', 'Last-minute tips'],
          milestones: ['Attempt 20+ mocks', 'Score 95+ percentile', 'Master all topics'],
          studyHours: '7-8 hours/day'
        },
        {
          month: 6,
          title: 'Exam Week',
          topics: ['Light revision', 'Formula sheets', 'Confidence building', 'Exam day strategy'],
          milestones: ['Stay calm & focused', 'Review strategy', 'Get adequate rest'],
          studyHours: '2-3 hours/day'
        }
      ],
      'GRE': [
        {
          month: 1,
          title: 'Diagnostic & Foundation',
          topics: ['Take diagnostic test', 'Vocabulary building (start 50 words/day)', 'Basic Quant review', 'AWA introduction'],
          milestones: ['Identify weak areas', 'Learn 1500+ words', 'Review high school math'],
          studyHours: '2-3 hours/day'
        },
        {
          month: 2,
          title: 'Verbal Section Focus',
          topics: ['Text Completion', 'Sentence Equivalence', 'Reading Comprehension strategies', 'Vocab: 3000+ words'],
          milestones: ['Master verbal strategies', 'Solve 500+ verbal questions', 'Improve RC accuracy to 70%'],
          studyHours: '3-4 hours/day'
        },
        {
          month: 3,
          title: 'Quant Section Mastery',
          topics: ['Algebra & Arithmetic', 'Geometry', 'Data Analysis', 'Word Problems'],
          milestones: ['Complete all quant topics', 'Solve 1000+ quant questions', '90%+ accuracy in quant'],
          studyHours: '3-4 hours/day'
        },
        {
          month: 4,
          title: 'AWA & Integration',
          topics: ['Analytical Writing practice', 'Issue essay', 'Argument essay', 'Integrated practice'],
          milestones: ['Write 10 essays', 'Get 4.5+ AWA score', 'Integrate all sections'],
          studyHours: '4-5 hours/day'
        },
        {
          month: 5,
          title: 'Mock Tests & Strategy',
          topics: ['Full-length mocks (ETS official)', 'Time management', 'Section-wise improvement', 'Error analysis'],
          milestones: ['Attempt 8-10 mocks', 'Score 315+ consistently', 'Refine test strategy'],
          studyHours: '5-6 hours/day'
        },
        {
          month: 6,
          title: 'Final Sprint',
          topics: ['Weak area revision', 'Vocab review', 'Formula revision', 'Mental preparation'],
          milestones: ['Score 320+', 'Be exam-ready', 'Book exam slot'],
          studyHours: '4-5 hours/day'
        }
      ],
      'GATE': [
        {
          month: 1,
          title: 'Syllabus Analysis & Planning',
          topics: ['Complete syllabus review', 'Engineering Mathematics basics', 'Core subject fundamentals', 'Previous year analysis'],
          milestones: ['Understand exam pattern', 'Identify high-weightage topics', 'Create study schedule'],
          studyHours: '4-5 hours/day'
        },
        {
          month: 2,
          title: 'Engineering Mathematics',
          topics: ['Linear Algebra', 'Calculus', 'Probability & Statistics', 'Discrete Mathematics'],
          milestones: ['Complete all math topics', 'Solve 500+ math problems', '80% accuracy in math'],
          studyHours: '5-6 hours/day'
        },
        {
          month: 3,
          title: 'Core Subjects - Part 1',
          topics: ['Data Structures', 'Algorithms', 'Programming in C', 'Digital Logic'],
          milestones: ['Master fundamental topics', 'Solve 300+ core problems', 'Clear conceptual doubts'],
          studyHours: '6-7 hours/day'
        },
        {
          month: 4,
          title: 'Core Subjects - Part 2',
          topics: ['Operating Systems', 'DBMS', 'Computer Networks', 'Theory of Computation'],
          milestones: ['Complete all core subjects', 'Solve previous year questions', '75% accuracy'],
          studyHours: '6-7 hours/day'
        },
        {
          month: 5,
          title: 'Advanced Topics & Revision',
          topics: ['Compiler Design', 'Computer Architecture', 'Subject-wise revision', 'Short notes preparation'],
          milestones: ['Complete entire syllabus', 'Create revision notes', 'Identify weak areas'],
          studyHours: '7-8 hours/day'
        },
        {
          month: 6,
          title: 'Mock Tests & Practice',
          topics: ['Full-length mock tests', 'Previous year papers (10 years)', 'Time management', 'Virtual calculator practice'],
          milestones: ['Attempt 15+ mocks', 'Score 55+ marks', 'Master all topics'],
          studyHours: '8-9 hours/day'
        }
      ]
    };

    return roadmaps[examName] || [];
  };

  // Toggle exam in comparison
  const toggleComparison = (exam: Exam) => {
    if (comparisonExams.find(e => e.id === exam.id)) {
      setComparisonExams(comparisonExams.filter(e => e.id !== exam.id));
    } else {
      if (comparisonExams.length < 3) {
        setComparisonExams([...comparisonExams, exam]);
      }
    }
  };

  const currentQ = questions[currentQuestion];
  const isCurrentAnswered = answers[currentQ?.id as keyof QuestionnaireAnswers];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="career-path-explorer">
      {/* Header */}
      <div className="explorer-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-wrapper">
              <i className="fas fa-route"></i>
            </div>
            <div className="header-text">
              <h1>Career Path Explorer</h1>
              <p>Discover your ideal competitive exams with AI-powered personalized recommendations</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Major Exams</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Success Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Trigger Card */}
      <div className="ai-trigger-card">
        <div className="ai-card-content">
          <div className="ai-icon-circle">
            <i className="fas fa-robot"></i>
          </div>
          <div className="ai-text">
            <h3>Get Personalized AI Recommendations</h3>
            <p>Answer a few questions and let our AI analyze the best career paths for you</p>
          </div>
          <button
            className="ai-start-btn"
            onClick={() => {
              setShowQuestionnaire(true);
              setCurrentQuestion(0);
              setAnswers({
                careerGoal: '',
                studyPreference: '',
                financialCapability: '',
                timeCommitment: '',
                strengthArea: '',
                workExperience: ''
              });
            }}
          >
            <i className="fas fa-magic"></i>
            Start Assessment
          </button>
        </div>
      </div>

      {/* Questionnaire Modal */}
      {showQuestionnaire && (
        <div className="questionnaire-modal-overlay">
          <div className="questionnaire-modal">
            <div className="modal-progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="questionnaire-header">
              <div className="question-count">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <button className="close-questionnaire" onClick={() => setShowQuestionnaire(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="questionnaire-content">
              <h2 className="question-title">{currentQ.question}</h2>

              <div className="options-grid">
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className={`option-card ${answers[currentQ.id as keyof QuestionnaireAnswers] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option.value)}
                  >
                    <div className="option-icon">
                      <i className={`fas ${option.icon}`}></i>
                    </div>
                    <span className="option-label">{option.label}</span>
                    {answers[currentQ.id as keyof QuestionnaireAnswers] === option.value && (
                      <div className="selected-check">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="questionnaire-actions">
              <button
                className="nav-btn prev-btn"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <i className="fas fa-arrow-left"></i>
                Previous
              </button>
              <button
                className={`nav-btn next-btn ${!isCurrentAnswered ? 'disabled' : ''}`}
                onClick={handleNext}
                disabled={!isCurrentAnswered}
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <i className="fas fa-check"></i>
                    Submit
                  </>
                ) : (
                  <>
                    Next
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-animation">
              <div className="orbit-spinner">
                <div className="orbit"></div>
                <div className="orbit"></div>
                <div className="orbit"></div>
              </div>
            </div>
            <h2 className="loading-title">Analyzing Your Profile</h2>
            <p className="loading-subtitle">Our AI is processing your responses...</p>
            <div className="loading-steps">
              <div className="loading-step active">
                <i className="fas fa-check-circle"></i>
                <span>Evaluating career goals</span>
              </div>
              <div className="loading-step active">
                <i className="fas fa-check-circle"></i>
                <span>Analyzing strengths</span>
              </div>
              <div className="loading-step">
                <div className="loading-dot"></div>
                <span>Generating recommendations</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {showAIRecommendations && (
        <div className="ai-recommendations-section">
          <div className="recommendations-header">
            <div className="header-left">
              <i className="fas fa-sparkles"></i>
              <h2>Your Personalized Recommendations</h2>
            </div>
            <button className="retake-btn" onClick={() => {
              setShowAIRecommendations(false);
              setShowQuestionnaire(true);
              setCurrentQuestion(0);
            }}>
              <i className="fas fa-redo"></i>
              Retake Assessment
            </button>
          </div>

          <div className="recommendations-grid">
            {getAIRecommendations().map((rec, index) => {
              const exam = exams.find(e => e.name === rec.exam);
              return (
                <div key={index} className={`recommendation-card-new priority-${rec.priority.toLowerCase()} rank-${index + 1}`}>
                  <div className="rec-rank">#{index + 1}</div>
                  <div className="rec-match-score">
                    <div className="match-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path
                          className="circle-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="circle"
                          strokeDasharray={`${rec.matchScore}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="match-percentage">{rec.matchScore}%</div>
                    </div>
                    <span className="match-label">Match</span>
                  </div>

                  <div className="rec-exam-info">
                    <div className="exam-icon-circle">
                      <i className={`fas ${exam?.icon}`}></i>
                    </div>
                    <h3>{rec.exam}</h3>
                    <span className={`priority-tag ${rec.priority.toLowerCase()}`}>
                      {rec.priority} Priority
                    </span>
                  </div>

                  <p className="rec-reason-new">{rec.reason}</p>

                  <div className="rec-timeline-box">
                    <i className="fas fa-calendar-check"></i>
                    <span>{rec.timeline}</span>
                  </div>

                  <button
                    className="view-exam-btn"
                    onClick={() => {
                      const examDetails = exams.find(e => e.name === rec.exam);
                      if (examDetails) setSelectedExam(examDetails);
                    }}
                  >
                    View Exam Details
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="browse-section">
        <h2 className="section-title">Browse All Exams</h2>
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <i className={`fas ${category.icon}`}></i>
              <span>{category.name}</span>
              <span className="exam-count">
                {category.id === 'all' ? exams.length : exams.filter(e => e.category === category.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      <div className="exams-grid">
        {filteredExams.map(exam => (
          <div key={exam.id} className="exam-card-new" onClick={() => setSelectedExam(exam)}>
            <div className="exam-card-header">
              <div className="exam-icon-badge">
                <i className={`fas ${exam.icon}`}></i>
              </div>
              <div className="exam-difficulty-badge" style={{ backgroundColor: getDifficultyColor(exam.difficulty) }}>
                {exam.difficulty}
              </div>
            </div>

            <div className="exam-title-section">
              <h3>{exam.name}</h3>
              <p>{exam.fullName}</p>
            </div>

            <div className="exam-category-badge">{exam.category}</div>

            <div className="exam-quick-info">
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{exam.idealTiming}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-rupee-sign"></i>
                <span>{exam.averageSalary.substring(0, 20)}...</span>
              </div>
            </div>

            <div className="exam-outcomes-preview">
              <strong>Top Outcomes:</strong>
              <ul>
                {exam.careerOutcomes.slice(0, 2).map((outcome, idx) => (
                  <li key={idx}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="exam-card-actions">
              <button className="explore-exam-btn" onClick={(e) => {
                e.stopPropagation();
                setSelectedExam(exam);
              }}>
                <span>Explore Details</span>
                <i className="fas fa-arrow-right"></i>
              </button>

              <div className="quick-actions">
                <button
                  className={`quick-action-btn ${comparisonExams.find(e => e.id === exam.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComparison(exam);
                  }}
                  title="Add to Comparison"
                >
                  <i className="fas fa-balance-scale"></i>
                </button>
                <button
                  className="quick-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const roadmap = getRoadmap(exam.name);
                    if (roadmap.length > 0) {
                      setRoadmapExam(exam);
                      setShowRoadmap(true);
                    }
                  }}
                  title="View Preparation Roadmap"
                >
                  <i className="fas fa-map-marked-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Tool Floating Button */}
      {comparisonExams.length > 0 && (
        <div className="comparison-floating-btn">
          <button
            className="compare-now-btn"
            onClick={() => setShowComparison(true)}
          >
            <i className="fas fa-balance-scale"></i>
            <span>Compare {comparisonExams.length} Exam{comparisonExams.length > 1 ? 's' : ''}</span>
          </button>
        </div>
      )}

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="exam-modal-overlay" onClick={() => setSelectedExam(null)}>
          <div className="exam-modal-new" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedExam(null)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header-new">
              <div className="modal-icon-large">
                <i className={`fas ${selectedExam.icon}`}></i>
              </div>
              <div className="modal-title-section">
                <h1>{selectedExam.name}</h1>
                <p>{selectedExam.fullName}</p>
                <div className="modal-badges">
                  <span className="category-badge">{selectedExam.category}</span>
                  <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(selectedExam.difficulty) }}>
                    {selectedExam.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-content-new">
              {/* Key Stats */}
              <div className="stats-section">
                <div className="stat-card-new">
                  <i className="fas fa-trophy"></i>
                  <div className="stat-info">
                    <span className="stat-label">Success Rate</span>
                    <span className="stat-value">{selectedExam.successRate}</span>
                  </div>
                </div>
                <div className="stat-card-new">
                  <i className="fas fa-rupee-sign"></i>
                  <div className="stat-info">
                    <span className="stat-label">Average Salary</span>
                    <span className="stat-value">{selectedExam.averageSalary}</span>
                  </div>
                </div>
                <div className="stat-card-new">
                  <i className="fas fa-clock"></i>
                  <div className="stat-info">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{selectedExam.duration}</span>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div className="detail-section-new">
                <h3><i className="fas fa-check-circle"></i> Eligibility Criteria</h3>
                <ul className="detail-list-new">
                  {selectedExam.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Timing */}
              <div className="detail-section-new">
                <h3><i className="fas fa-calendar-alt"></i> When to Start</h3>
                <div className="timing-box">{selectedExam.idealTiming}</div>
              </div>

              {/* Career Outcomes */}
              <div className="detail-section-new">
                <h3><i className="fas fa-briefcase"></i> Career Opportunities</h3>
                <div className="outcomes-grid-new">
                  {selectedExam.careerOutcomes.map((outcome, idx) => (
                    <div key={idx} className="outcome-chip">{outcome}</div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="detail-section-new">
                <h3><i className="fas fa-building"></i> Top Recruiters</h3>
                <div className="recruiters-grid-new">
                  {selectedExam.topRecruiters.map((recruiter, idx) => (
                    <div key={idx} className="recruiter-chip">{recruiter}</div>
                  ))}
                </div>
              </div>

              {/* Syllabus */}
              <div className="detail-section-new">
                <h3><i className="fas fa-book"></i> Syllabus Overview</h3>
                <div className="syllabus-grid-new">
                  {selectedExam.syllabus.map((topic, idx) => (
                    <div key={idx} className="syllabus-chip">{topic}</div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions-new">
                <button className="action-btn-new primary">
                  <i className="fas fa-calendar-plus"></i>
                  Create Study Plan
                </button>
                <button className="action-btn-new secondary">
                  <i className="fas fa-book-open"></i>
                  View Resources
                </button>
                <button className="action-btn-new secondary">
                  <i className="fas fa-users"></i>
                  Join Study Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tool Modal */}
      {showComparison && comparisonExams.length > 0 && (
        <div className="comparison-modal-overlay" onClick={() => setShowComparison(false)}>
          <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowComparison(false)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="comparison-header">
              <div className="comparison-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <div className="comparison-title-section">
                <h2>Exam Comparison</h2>
                <p>Comparing {comparisonExams.length} exam{comparisonExams.length > 1 ? 's' : ''}</p>
              </div>
              <button className="clear-comparison-btn" onClick={() => setComparisonExams([])}>
                <i className="fas fa-trash"></i>
                Clear All
              </button>
            </div>

            <div className="comparison-content">
              <div className="comparison-table">
                <div className="comparison-row header">
                  <div className="comparison-cell">Criteria</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell exam-header">
                      <div className="exam-header-content">
                        <i className={`fas ${exam.icon}`}></i>
                        <span>{exam.name}</span>
                        <button
                          className="remove-exam-btn"
                          onClick={() => toggleComparison(exam)}
                          title="Remove from comparison"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Full Name</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">{exam.fullName}</div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Category</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">
                      <span className="category-tag">{exam.category}</span>
                    </div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Difficulty</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">
                      <span className="difficulty-tag" style={{ backgroundColor: getDifficultyColor(exam.difficulty) }}>
                        {exam.difficulty}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Success Rate</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">{exam.successRate}</div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Average Salary</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell highlight-green">{exam.averageSalary}</div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Duration</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">{exam.duration}</div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Ideal Timing</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">{exam.idealTiming}</div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Investment Range</div>
                  {comparisonExams.map((exam) => {
                    const financials = getExamFinancials(exam.name);
                    return (
                      <div key={exam.id} className="comparison-cell">
                        {financials ? `₹${financials.costs.totalMin.toLocaleString()} - ₹${financials.costs.totalMax.toLocaleString()}` : 'N/A'}
                      </div>
                    );
                  })}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Break-even Period</div>
                  {comparisonExams.map((exam) => {
                    const financials = getExamFinancials(exam.name);
                    return (
                      <div key={exam.id} className="comparison-cell">
                        {financials ? `${financials.roi.breakEvenYears} years` : 'N/A'}
                      </div>
                    );
                  })}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Top Career Outcomes</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">
                      <ul className="outcomes-list-compact">
                        {exam.careerOutcomes.slice(0, 3).map((outcome, idx) => (
                          <li key={idx}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="comparison-row">
                  <div className="comparison-cell criteria">Top Recruiters</div>
                  {comparisonExams.map((exam) => (
                    <div key={exam.id} className="comparison-cell">
                      <div className="recruiters-compact">
                        {exam.topRecruiters.slice(0, 3).map((recruiter, idx) => (
                          <span key={idx} className="recruiter-tag-small">{recruiter}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preparation Roadmap Modal */}
      {showRoadmap && roadmapExam && (
        <div className="roadmap-modal-overlay" onClick={() => setShowRoadmap(false)}>
          <div className="roadmap-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowRoadmap(false)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="roadmap-header">
              <div className="roadmap-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="roadmap-title-section">
                <h2>Preparation Roadmap</h2>
                <p>{roadmapExam.name} - 6-Month Strategic Plan</p>
              </div>
            </div>

            <div className="roadmap-content">
              {(() => {
                const roadmap = getRoadmap(roadmapExam.name);
                if (roadmap.length === 0) {
                  return <div className="roadmap-unavailable">
                    <i className="fas fa-info-circle"></i>
                    <p>Detailed roadmap coming soon for {roadmapExam.name}!</p>
                    <p>Currently available for: CAT, GRE, GATE</p>
                  </div>;
                }

                return (
                  <div className="roadmap-timeline">
                    {roadmap.map((phase, index) => (
                      <div key={index} className="roadmap-phase">
                        <div className="phase-marker">
                          <div className="phase-number">{phase.month}</div>
                          <div className="phase-line"></div>
                        </div>
                        <div className="phase-content">
                          <div className="phase-header">
                            <h3>Month {phase.month}: {phase.title}</h3>
                            <span className="study-hours">
                              <i className="fas fa-clock"></i>
                              {phase.studyHours}
                            </span>
                          </div>

                          <div className="phase-topics">
                            <h4><i className="fas fa-book"></i> Topics to Cover</h4>
                            <div className="topics-grid">
                              {phase.topics.map((topic, idx) => (
                                <div key={idx} className="topic-chip">
                                  <i className="fas fa-check-circle"></i>
                                  {topic}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="phase-milestones">
                            <h4><i className="fas fa-flag-checkered"></i> Milestones</h4>
                            <ul className="milestones-list">
                              {phase.milestones.map((milestone, idx) => (
                                <li key={idx}>
                                  <i className="fas fa-star"></i>
                                  {milestone}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="roadmap-footer">
                <div className="roadmap-tips">
                  <h4><i className="fas fa-lightbulb"></i> Pro Tips</h4>
                  <ul>
                    <li>Stick to the timeline but adjust based on your progress</li>
                    <li>Take regular mock tests to track improvement</li>
                    <li>Focus on weak areas identified in practice tests</li>
                    <li>Maintain consistency - daily study is better than cramming</li>
                    <li>Join study groups for motivation and peer learning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathExplorer;
