import { useState, Fragment } from 'react';
import './CompanyMatcher.css';
import { useSkills, getStudentSkills, calculateSkillMatch } from '../../../contexts/SkillsContext';

// ==================== INTERFACES ====================

interface PersonalityQuestion {
  id: string;
  question: string;
  options: string[];
  trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

interface PersonalityResults {
  personalityType: string;
  traits: {
    extroversion: number;
    sensing: number;
    thinking: number;
    judging: number;
  };
}

interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'logical' | 'numerical' | 'verbal' | 'spatial';
}

interface AptitudeResults {
  overall: number;
  categories: {
    logical: number;
    numerical: number;
    verbal: number;
    spatial: number;
  };
}

interface JobAnalysisInput {
  method: 'url' | 'manual';
  url?: string;
  title?: string;
  description?: string;
  requirements?: string;
}

interface JobAnalysisResults {
  overallMatch: number;
  personalityFit: number;
  skillsMatch: number;
  aptitudeAlignment: number;
  matchingSkills: string[];
  missingSkills: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  jobTitle: string;
  personalityInsight: string;
}

// ==================== CAREER PATHS INTERFACES ====================

interface SkillRequirement {
  skillName: string;
  requiredLevel: number;
  category: 'Technical' | 'Soft' | 'Domain';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  completed: boolean;
  type: 'skill' | 'project' | 'certification' | 'experience';
}

interface CareerStage {
  id: string;
  title: string;
  level: number;
  yearsRequired: string;
  salary: { min: number; max: number };
  requiredSkills: SkillRequirement[];
  responsibilities: string[];
  milestones: Milestone[];
  growthIndicators: string[];
}

interface CareerPath {
  id: string;
  pathName: string;
  track: 'Technical' | 'Management' | 'Entrepreneurship';
  stages: CareerStage[];
  totalDuration: string;
  description: string;
  suitablePersonalities: string[];
  requiredAptitudes: string[];
  icon: string;
}

// ==================== PERSONALITY QUESTIONS ====================

const personalityQuestions: PersonalityQuestion[] = [
  { id: 'q1', question: 'At a party, would you rather interact with many people or just a few close friends?', options: ['Many people (I gain energy from socializing)', 'Few close friends (I prefer deeper conversations)'], trait: 'E' },
  { id: 'q2', question: 'When making decisions, do you rely more on logic or your feelings?', options: ['Logic and objective analysis', 'Feelings and values'], trait: 'T' },
  { id: 'q3', question: 'Do you prefer to focus on the big picture or specific details?', options: ['Big picture and possibilities', 'Specific details and facts'], trait: 'N' },
  { id: 'q4', question: 'Do you prefer to plan things in advance or be spontaneous?', options: ['Plan in advance', 'Be spontaneous and flexible'], trait: 'J' },
  { id: 'q5', question: 'Do you feel energized after spending time with a large group?', options: ['Yes, very energized', 'No, I need time alone to recharge'], trait: 'E' },
  { id: 'q6', question: 'When solving problems, do you prefer proven methods or trying new approaches?', options: ['Proven methods that work', 'New and innovative approaches'], trait: 'S' },
  { id: 'q7', question: 'In conflicts, do you prioritize being right or maintaining harmony?', options: ['Being right and fair', 'Maintaining harmony'], trait: 'T' },
  { id: 'q8', question: 'Do you like to keep your options open or prefer to have things settled?', options: ['Keep options open', 'Have things settled'], trait: 'P' },
  { id: 'q9', question: 'Do you enjoy working in teams or prefer working independently?', options: ['Working in teams', 'Working independently'], trait: 'E' },
  { id: 'q10', question: 'Do you trust experience more than hunches?', options: ['Yes, experience is more reliable', 'No, hunches can be valuable'], trait: 'S' },
  { id: 'q11', question: 'When criticized, do you focus on the logic or how it makes you feel?', options: ['The logic of the criticism', 'How it makes me feel'], trait: 'T' },
  { id: 'q12', question: 'Do you like to have a daily routine or variety in your schedule?', options: ['Daily routine and structure', 'Variety and flexibility'], trait: 'J' },
  { id: 'q13', question: 'Do you find it easy to introduce yourself to strangers?', options: ['Yes, quite easy', 'No, I find it challenging'], trait: 'E' },
  { id: 'q14', question: 'Are you more interested in what is actual or what is possible?', options: ['What is actual and real', 'What is possible and potential'], trait: 'S' },
  { id: 'q15', question: 'Do you value truth more than tact?', options: ['Truth is more important', 'Tact is more important'], trait: 'T' }
];

// ==================== APTITUDE QUESTIONS ====================

const aptitudeQuestions: AptitudeQuestion[] = [
  // Logical Reasoning (4 questions)
  { id: 'apt1', question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?', options: ['True', 'False', 'Cannot be determined', 'Only sometimes'], correctAnswer: 0, category: 'logical' },
  { id: 'apt2', question: 'What comes next in the sequence: 2, 6, 12, 20, 30, __?', options: ['38', '40', '42', '44'], correctAnswer: 2, category: 'logical' },
  { id: 'apt3', question: 'If some Cats are Dogs, and all Dogs are Animals, which statement must be true?', options: ['All Cats are Animals', 'Some Cats are Animals', 'No Cats are Animals', 'All Animals are Cats'], correctAnswer: 1, category: 'logical' },
  { id: 'apt4', question: 'In a certain code, MOUNTAIN is written as LPVOUBJM. How is VALLEY written?', options: ['UBMMFZ', 'WBMMFZ', 'UBKKHZ', 'WBKKFZ'], correctAnswer: 0, category: 'logical' },

  // Numerical Ability (4 questions)
  { id: 'apt5', question: 'If a shirt costs $45 after a 25% discount, what was the original price?', options: ['$55', '$60', '$65', '$70'], correctAnswer: 1, category: 'numerical' },
  { id: 'apt6', question: 'A train travels 180 km in 3 hours. At the same speed, how far will it travel in 5 hours?', options: ['250 km', '280 km', '300 km', '320 km'], correctAnswer: 2, category: 'numerical' },
  { id: 'apt7', question: 'What is 15% of 240?', options: ['30', '32', '34', '36'], correctAnswer: 3, category: 'numerical' },
  { id: 'apt8', question: 'If x + 5 = 12, what is the value of 2x + 3?', options: ['14', '17', '19', '21'], correctAnswer: 1, category: 'numerical' },

  // Verbal Ability (4 questions)
  { id: 'apt9', question: 'Choose the word that is most similar to "METICULOUS":', options: ['Careless', 'Careful', 'Quick', 'Lazy'], correctAnswer: 1, category: 'verbal' },
  { id: 'apt10', question: 'Complete the analogy: Book is to Reading as Fork is to __?', options: ['Eating', 'Cooking', 'Cleaning', 'Serving'], correctAnswer: 0, category: 'verbal' },
  { id: 'apt11', question: 'Which word does NOT belong: Happy, Joyful, Elated, Angry, Cheerful?', options: ['Happy', 'Joyful', 'Angry', 'Cheerful'], correctAnswer: 2, category: 'verbal' },
  { id: 'apt12', question: 'What is the antonym of "ABUNDANT"?', options: ['Plentiful', 'Scarce', 'Ample', 'Sufficient'], correctAnswer: 1, category: 'verbal' },

  // Spatial Reasoning (3 questions)
  { id: 'apt13', question: 'If you fold a square paper in half twice, how many layers will you have?', options: ['2', '3', '4', '8'], correctAnswer: 2, category: 'spatial' },
  { id: 'apt14', question: 'How many faces does a cube have?', options: ['4', '6', '8', '12'], correctAnswer: 1, category: 'spatial' },
  { id: 'apt15', question: 'If you rotate a triangle 180 degrees, what shape do you get?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correctAnswer: 2, category: 'spatial' }
];

// ==================== MOCK JOB DATA ====================

const mockJobDatabase: Record<string, any> = {
  'linkedin.com/jobs': {
    title: 'Software Engineer',
    description: 'We are looking for a talented Software Engineer to join our team. You will be responsible for developing scalable applications and working with cross-functional teams.',
    requirements: 'React, TypeScript, Node.js, Problem Solving, Team Collaboration, Agile Development',
    keywords: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Git', 'APIs', 'Problem Solving', 'Team Collaboration']
  },
  'indeed.com/jobs': {
    title: 'Data Analyst',
    description: 'Seeking a detail-oriented Data Analyst to interpret complex datasets and provide actionable insights for business decisions.',
    requirements: 'SQL, Python, Excel, Data Visualization, Statistical Analysis, Communication Skills',
    keywords: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics', 'Analytics', 'Communication', 'Attention to Detail']
  },
  'glassdoor.com/job': {
    title: 'Marketing Manager',
    description: 'Dynamic Marketing Manager needed to lead campaigns, manage brand strategy, and drive customer engagement.',
    requirements: 'Marketing Strategy, Content Creation, Social Media, Analytics, Leadership, Creative Thinking',
    keywords: ['Marketing', 'Content Creation', 'Social Media', 'Analytics', 'Leadership', 'Creativity', 'Communication']
  },
  'default': {
    title: 'Product Designer',
    description: 'Creative Product Designer to design user-centered interfaces and experiences for digital products.',
    requirements: 'UI/UX Design, Figma, User Research, Prototyping, Visual Design, Collaboration',
    keywords: ['UI/UX', 'Figma', 'Design', 'Prototyping', 'User Research', 'Creativity', 'Attention to Detail']
  }
};

// ==================== CAREER PATHS DATA ====================

const mockCareerPaths: CareerPath[] = [
  {
    id: 'tech-1',
    pathName: 'Software Engineering Excellence',
    track: 'Technical',
    totalDuration: '8-12 years',
    description: 'Progress from junior developer to technical architect, focusing on deep technical expertise',
    suitablePersonalities: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    requiredAptitudes: ['logical', 'numerical'],
    icon: 'fa-code',
    stages: [
      {
        id: 'stage-1',
        title: 'Junior Software Engineer',
        level: 1,
        yearsRequired: '0-2 years',
        salary: { min: 400000, max: 800000 },
        requiredSkills: [
          { skillName: 'React.js', requiredLevel: 7, category: 'Technical' },
          { skillName: 'TypeScript', requiredLevel: 6, category: 'Technical' },
          { skillName: 'Communication', requiredLevel: 6, category: 'Soft' }
        ],
        responsibilities: ['Write clean code', 'Implement features', 'Debug issues', 'Code reviews'],
        milestones: [
          { id: 'm1', title: 'First feature shipped', description: 'Ship your first production feature', timeframe: '2-3 months', completed: false, type: 'project' }
        ],
        growthIndicators: ['Code quality improves', 'Independent task completion']
      },
      {
        id: 'stage-2',
        title: 'Mid-Level Software Engineer',
        level: 2,
        yearsRequired: '2-4 years',
        salary: { min: 800000, max: 1500000 },
        requiredSkills: [
          { skillName: 'React.js', requiredLevel: 9, category: 'Technical' },
          { skillName: 'System Design', requiredLevel: 6, category: 'Technical' },
          { skillName: 'Leadership', requiredLevel: 5, category: 'Soft' }
        ],
        responsibilities: ['Design features', 'Mentor juniors', 'Architectural decisions', 'Technical planning'],
        milestones: [
          { id: 'm2', title: 'Lead a feature', description: 'Own end-to-end feature development', timeframe: '1 year', completed: false, type: 'project' }
        ],
        growthIndicators: ['Reduced need for guidance', 'Successful feature launches']
      },
      {
        id: 'stage-3',
        title: 'Senior Software Engineer',
        level: 3,
        yearsRequired: '4-7 years',
        salary: { min: 1500000, max: 2500000 },
        requiredSkills: [
          { skillName: 'System Design', requiredLevel: 9, category: 'Technical' },
          { skillName: 'Leadership', requiredLevel: 8, category: 'Soft' },
          { skillName: 'Problem Solving', requiredLevel: 9, category: 'Soft' }
        ],
        responsibilities: ['System architecture', 'Technical leadership', 'Cross-team collaboration', 'Strategic planning'],
        milestones: [
          { id: 'm3', title: 'Design major system', description: 'Lead architecture for critical system', timeframe: '2 years', completed: false, type: 'project' }
        ],
        growthIndicators: ['System-wide impact', 'Technical direction setter']
      }
    ]
  },
  {
    id: 'mgmt-1',
    pathName: 'Engineering Leadership Track',
    track: 'Management',
    totalDuration: '10-15 years',
    description: 'Transition from technical contributor to engineering leader, managing teams and strategy',
    suitablePersonalities: ['ENTJ', 'ENFJ', 'ESTJ', 'ESFJ'],
    requiredAptitudes: ['verbal', 'logical'],
    icon: 'fa-users',
    stages: [
      {
        id: 'stage-1',
        title: 'Senior Engineer (IC)',
        level: 1,
        yearsRequired: '0-3 years',
        salary: { min: 1500000, max: 2500000 },
        requiredSkills: [
          { skillName: 'Technical Skills', requiredLevel: 8, category: 'Technical' },
          { skillName: 'Communication', requiredLevel: 8, category: 'Soft' },
          { skillName: 'Leadership', requiredLevel: 6, category: 'Soft' }
        ],
        responsibilities: ['Deliver projects', 'Mentor others', 'Technical excellence', 'Team collaboration'],
        milestones: [
          { id: 'm1', title: 'Mentor 3+ engineers', description: 'Successfully mentor junior team members', timeframe: '1 year', completed: false, type: 'experience' }
        ],
        growthIndicators: ['Mentorship impact', 'Team influence']
      },
      {
        id: 'stage-2',
        title: 'Engineering Manager',
        level: 2,
        yearsRequired: '3-6 years',
        salary: { min: 2500000, max: 4000000 },
        requiredSkills: [
          { skillName: 'Leadership', requiredLevel: 9, category: 'Soft' },
          { skillName: 'Communication', requiredLevel: 9, category: 'Soft' },
          { skillName: 'Time Management', requiredLevel: 8, category: 'Soft' }
        ],
        responsibilities: ['Manage team', 'Set goals', 'Performance reviews', 'Hiring'],
        milestones: [
          { id: 'm2', title: 'Build high-performing team', description: 'Grow team from 3 to 8+ engineers', timeframe: '2 years', completed: false, type: 'experience' }
        ],
        growthIndicators: ['Team performance', 'Employee satisfaction']
      },
      {
        id: 'stage-3',
        title: 'Director of Engineering',
        level: 3,
        yearsRequired: '6-10 years',
        salary: { min: 4000000, max: 7000000 },
        requiredSkills: [
          { skillName: 'Leadership', requiredLevel: 10, category: 'Soft' },
          { skillName: 'Product Development', requiredLevel: 8, category: 'Domain' },
          { skillName: 'Agile Methodology', requiredLevel: 8, category: 'Domain' }
        ],
        responsibilities: ['Multi-team management', 'Strategic planning', 'Budget management', 'Stakeholder management'],
        milestones: [
          { id: 'm3', title: 'Scale organization', description: 'Manage 30+ engineers across multiple teams', timeframe: '3 years', completed: false, type: 'experience' }
        ],
        growthIndicators: ['Organizational impact', 'Strategic influence']
      }
    ]
  },
  {
    id: 'entre-1',
    pathName: 'Startup Founder Journey',
    track: 'Entrepreneurship',
    totalDuration: '5-10 years',
    description: 'Build and scale your own tech startup from idea to successful exit',
    suitablePersonalities: ['ENTP', 'ENTJ', 'ENFP', 'ESTP'],
    requiredAptitudes: ['logical', 'verbal', 'numerical'],
    icon: 'fa-rocket',
    stages: [
      {
        id: 'stage-1',
        title: 'Solo Founder / Builder',
        level: 1,
        yearsRequired: '0-1 years',
        salary: { min: 0, max: 500000 },
        requiredSkills: [
          { skillName: 'Problem Solving', requiredLevel: 9, category: 'Soft' },
          { skillName: 'Technical Skills', requiredLevel: 8, category: 'Technical' },
          { skillName: 'Communication', requiredLevel: 7, category: 'Soft' }
        ],
        responsibilities: ['Build MVP', 'Find product-market fit', 'Customer discovery', 'Iterate rapidly'],
        milestones: [
          { id: 'm1', title: 'Launch MVP', description: 'Ship first version to users', timeframe: '3-6 months', completed: false, type: 'project' }
        ],
        growthIndicators: ['User traction', 'Product validation']
      },
      {
        id: 'stage-2',
        title: 'Funded Startup CEO',
        level: 2,
        yearsRequired: '1-3 years',
        salary: { min: 500000, max: 2000000 },
        requiredSkills: [
          { skillName: 'Leadership', requiredLevel: 8, category: 'Soft' },
          { skillName: 'Product Development', requiredLevel: 9, category: 'Domain' },
          { skillName: 'Team Collaboration', requiredLevel: 9, category: 'Soft' }
        ],
        responsibilities: ['Raise funding', 'Build team', 'Scale product', 'Drive growth'],
        milestones: [
          { id: 'm2', title: 'Raise seed round', description: 'Secure $1M+ in funding', timeframe: '1 year', completed: false, type: 'experience' }
        ],
        growthIndicators: ['Revenue growth', 'Team size']
      },
      {
        id: 'stage-3',
        title: 'Scale-up CEO',
        level: 3,
        yearsRequired: '3-7 years',
        salary: { min: 2000000, max: 10000000 },
        requiredSkills: [
          { skillName: 'Leadership', requiredLevel: 10, category: 'Soft' },
          { skillName: 'Agile Methodology', requiredLevel: 9, category: 'Domain' },
          { skillName: 'Product Development', requiredLevel: 10, category: 'Domain' }
        ],
        responsibilities: ['Scale to $10M+ ARR', 'Expand team to 50+', 'Strategic partnerships', 'Prepare for exit/IPO'],
        milestones: [
          { id: 'm3', title: 'Series A/B funding', description: 'Raise growth-stage funding', timeframe: '2-3 years', completed: false, type: 'experience' }
        ],
        growthIndicators: ['Market leadership', 'Sustainable growth']
      }
    ]
  }
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate how well a career path fits the user's profile
 * @param path - The career path to evaluate
 * @param personalityResults - User's personality assessment results
 * @param aptitudeResults - User's aptitude assessment results
 * @returns Fit score from 0-100 (40% personality + 60% aptitude match)
 */
const calculatePathFitScore = (
  path: CareerPath,
  personalityResults: PersonalityResults | null,
  aptitudeResults: AptitudeResults | null
): number => {
  let personalityScore = 0;
  let aptitudeScore = 0;

  // Calculate personality match (40% weight)
  if (personalityResults) {
    const userType = personalityResults.type;
    if (path.suitablePersonalities.includes(userType)) {
      personalityScore = 100;
    } else {
      // Partial match: check if first two letters match (E/I and N/S)
      const pathTypeMatch = path.suitablePersonalities.some(
        suitableType => userType.substring(0, 2) === suitableType.substring(0, 2)
      );
      personalityScore = pathTypeMatch ? 60 : 30;
    }
  }

  // Calculate aptitude match (60% weight)
  if (aptitudeResults) {
    const userAptitudes = aptitudeResults.strengths.map(s => s.toLowerCase());
    const requiredAptitudes = path.requiredAptitudes.map(a => a.toLowerCase());

    const matchCount = requiredAptitudes.filter(required =>
      userAptitudes.includes(required)
    ).length;

    if (requiredAptitudes.length > 0) {
      aptitudeScore = (matchCount / requiredAptitudes.length) * 100;
    }
  }

  // Weighted average: 40% personality + 60% aptitude
  const finalScore = (personalityScore * 0.4) + (aptitudeScore * 0.6);
  return Math.round(finalScore);
};

// ==================== MAIN COMPONENT ====================

const CompanyMatcher = () => {
  // Get Career Readiness data from context
  const { skillGaps, swotData, hasCareerReadinessData } = useSkills();

  // Main tab navigation: 'assessments' | 'jobAnalyzer' | 'careerPaths'
  const [mainTab, setMainTab] = useState<'assessments' | 'jobAnalyzer' | 'careerPaths'>('assessments');

  // Assessment phase: 'personality' | 'aptitude' | 'results'
  const [assessmentPhase, setAssessmentPhase] = useState<'personality' | 'aptitude' | 'results'>('personality');

  // Personality assessment state
  const [personalityQuestionIndex, setPersonalityQuestionIndex] = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, number>>({});
  const [personalityResults, setPersonalityResults] = useState<PersonalityResults | null>(null);

  // Aptitude assessment state
  const [aptitudeQuestionIndex, setAptitudeQuestionIndex] = useState(0);
  const [aptitudeAnswers, setAptitudeAnswers] = useState<Record<string, number>>({});
  const [aptitudeResults, setAptitudeResults] = useState<AptitudeResults | null>(null);

  // Job analyzer state
  const [dataSource, setDataSource] = useState<'assessments' | 'careerReadiness'>('careerReadiness');
  const [jobInputMethod, setJobInputMethod] = useState<'url' | 'manual'>('url');
  const [jobUrl, setJobUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobAnalysisResults, setJobAnalysisResults] = useState<JobAnalysisResults | null>(null);

  // Career Paths state
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [careerPathPhase, setCareerPathPhase] = useState<'explorer' | 'timeline' | 'skillGap'>('explorer');
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [selectedStageForGap, setSelectedStageForGap] = useState<number>(0);

  // Current question based on phase
  const currentPersonalityQuestion = personalityQuestions[personalityQuestionIndex];
  const currentAptitudeQuestion = aptitudeQuestions[aptitudeQuestionIndex];

  // Progress tracking
  const personalityProgress = ((personalityQuestionIndex + 1) / personalityQuestions.length) * 100;
  const aptitudeProgress = ((aptitudeQuestionIndex + 1) / aptitudeQuestions.length) * 100;

  // Answer status
  const isPersonalityAnswered = personalityAnswers[currentPersonalityQuestion?.id] !== undefined;
  const isAptitudeAnswered = aptitudeAnswers[currentAptitudeQuestion?.id] !== undefined;

  // Personality handlers
  const handlePersonalityAnswer = (answerIndex: number) => {
    setPersonalityAnswers(prev => ({ ...prev, [currentPersonalityQuestion.id]: answerIndex }));
  };

  const handlePersonalityNext = () => {
    if (personalityQuestionIndex < personalityQuestions.length - 1) {
      setPersonalityQuestionIndex(personalityQuestionIndex + 1);
    } else {
      calculatePersonalityResults();
    }
  };

  const handlePersonalityPrevious = () => {
    if (personalityQuestionIndex > 0) {
      setPersonalityQuestionIndex(personalityQuestionIndex - 1);
    }
  };

  const calculatePersonalityResults = () => {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;

    personalityQuestions.forEach((q) => {
      const answer = personalityAnswers[q.id] || 0;
      if (q.trait === 'E') answer === 0 ? E++ : I++;
      if (q.trait === 'S') answer === 0 ? S++ : N++;
      if (q.trait === 'T') answer === 0 ? T++ : F++;
      if (q.trait === 'J') answer === 0 ? J++ : P++;
    });

    const personalityType = `${E > I ? 'E' : 'I'}${S > N ? 'S' : 'N'}${T > F ? 'T' : 'F'}${J > P ? 'J' : 'P'}`;

    const results: PersonalityResults = {
      personalityType,
      traits: {
        extroversion: Math.round((E / (E + I)) * 100) || 50,
        sensing: Math.round((S / (S + N)) * 100) || 50,
        thinking: Math.round((T / (T + F)) * 100) || 50,
        judging: Math.round((J / (J + P)) * 100) || 50
      }
    };

    setPersonalityResults(results);
    setAssessmentPhase('results');
  };

  // Aptitude handlers
  const handleAptitudeAnswer = (answerIndex: number) => {
    setAptitudeAnswers(prev => ({ ...prev, [currentAptitudeQuestion.id]: answerIndex }));
  };

  const handleAptitudeNext = () => {
    if (aptitudeQuestionIndex < aptitudeQuestions.length - 1) {
      setAptitudeQuestionIndex(aptitudeQuestionIndex + 1);
    } else {
      calculateAptitudeResults();
    }
  };

  const handleAptitudePrevious = () => {
    if (aptitudeQuestionIndex > 0) {
      setAptitudeQuestionIndex(aptitudeQuestionIndex - 1);
    }
  };

  const calculateAptitudeResults = () => {
    let logicalCorrect = 0, logicalTotal = 0;
    let numericalCorrect = 0, numericalTotal = 0;
    let verbalCorrect = 0, verbalTotal = 0;
    let spatialCorrect = 0, spatialTotal = 0;

    aptitudeQuestions.forEach((q) => {
      const userAnswer = aptitudeAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (q.category === 'logical') {
        logicalTotal++;
        if (isCorrect) logicalCorrect++;
      } else if (q.category === 'numerical') {
        numericalTotal++;
        if (isCorrect) numericalCorrect++;
      } else if (q.category === 'verbal') {
        verbalTotal++;
        if (isCorrect) verbalCorrect++;
      } else if (q.category === 'spatial') {
        spatialTotal++;
        if (isCorrect) spatialCorrect++;
      }
    });

    const logicalScore = Math.round((logicalCorrect / logicalTotal) * 100);
    const numericalScore = Math.round((numericalCorrect / numericalTotal) * 100);
    const verbalScore = Math.round((verbalCorrect / verbalTotal) * 100);
    const spatialScore = Math.round((spatialCorrect / spatialTotal) * 100);
    const overallScore = Math.round((logicalScore + numericalScore + verbalScore + spatialScore) / 4);

    const results: AptitudeResults = {
      overall: overallScore,
      categories: {
        logical: logicalScore,
        numerical: numericalScore,
        verbal: verbalScore,
        spatial: spatialScore
      }
    };

    setAptitudeResults(results);
    setAssessmentPhase('results');
  };

  // Continue to aptitude assessment
  const handleContinueToAptitude = () => {
    setAssessmentPhase('aptitude');
  };

  // Navigate to job analyzer
  const handleGoToJobAnalyzer = () => {
    setMainTab('jobAnalyzer');
  };

  // Analyze job
  const handleAnalyzeJob = () => {
    let jobData: any;

    if (jobInputMethod === 'url') {
      // Mock URL analysis - check if URL contains known patterns
      const urlKey = Object.keys(mockJobDatabase).find(key => jobUrl.includes(key));
      jobData = urlKey ? mockJobDatabase[urlKey] : mockJobDatabase['default'];
    } else {
      // Manual entry
      jobData = {
        title: jobTitle,
        description: jobDescription,
        requirements: jobRequirements,
        keywords: jobRequirements.split(',').map(s => s.trim()).filter(s => s.length > 0)
      };
    }

    let results: JobAnalysisResults;

    if (dataSource === 'careerReadiness') {
      // Use Career Readiness data
      const studentSkills = getStudentSkills(skillGaps, 6);
      const skillsMatchData = calculateSkillMatch(studentSkills, jobData.keywords || []);

      // Calculate personality fit from SWOT strengths
      const personalityFit = calculatePersonalityFitFromSWOT(jobData, swotData);

      // Use average skill level as aptitude proxy
      const avgSkillLevel = skillGaps.reduce((sum, skill) => sum + skill.currentLevel, 0) / skillGaps.length;
      const aptitudeAlignment = Math.round((avgSkillLevel / 10) * 100);

      const overallMatch = Math.round(
        (personalityFit * 0.3) +
        (skillsMatchData.percentage * 0.4) +
        (aptitudeAlignment * 0.3)
      );

      results = {
        overallMatch,
        personalityFit,
        skillsMatch: skillsMatchData.percentage,
        aptitudeAlignment,
        matchingSkills: skillsMatchData.matching,
        missingSkills: skillsMatchData.missing,
        salaryRange: getSalaryRange(jobData.title),
        jobTitle: jobData.title,
        personalityInsight: getPersonalityInsightFromSWOT(swotData, jobData.title)
      };
    } else {
      // Use Assessment data
      const personalityFit = calculatePersonalityFit(jobData, personalityResults!);
      const skillsMatchData = calculateSkillsMatch(jobData, aptitudeResults!);
      const aptitudeAlignment = aptitudeResults?.overall || 0;

      const overallMatch = Math.round(
        (personalityFit * 0.3) +
        (skillsMatchData.matchPercentage * 0.4) +
        (aptitudeAlignment * 0.3)
      );

      results = {
        overallMatch,
        personalityFit,
        skillsMatch: skillsMatchData.matchPercentage,
        aptitudeAlignment,
        matchingSkills: skillsMatchData.matching,
        missingSkills: skillsMatchData.missing,
        salaryRange: getSalaryRange(jobData.title),
        jobTitle: jobData.title,
        personalityInsight: getPersonalityInsight(personalityResults!.personalityType, jobData.title)
      };
    }

    setJobAnalysisResults(results);
  };

  // Helper: Calculate personality fit
  const calculatePersonalityFit = (jobData: any, personality: PersonalityResults): number => {
    const type = personality.personalityType;
    // Simple mock logic based on MBTI
    if (jobData.title.includes('Engineer') || jobData.title.includes('Analyst')) {
      return type.includes('T') ? 85 : 70; // Thinking types fit better
    } else if (jobData.title.includes('Manager') || jobData.title.includes('Marketing')) {
      return type.includes('E') ? 90 : 75; // Extroverts fit better
    } else if (jobData.title.includes('Designer')) {
      return type.includes('N') && type.includes('P') ? 88 : 72; // Intuitive Perceivers fit better
    }
    return 75;
  };

  // Helper: Calculate skills match
  const calculateSkillsMatch = (jobData: any, aptitude: AptitudeResults): { matching: string[], missing: string[], matchPercentage: number } => {
    const requiredSkills = jobData.keywords || [];

    // Mock logic: Based on aptitude scores, assign likely skills
    const userSkills: string[] = [];
    if (aptitude.categories.logical > 70) userSkills.push('Problem Solving', 'Analytical Thinking');
    if (aptitude.categories.numerical > 70) userSkills.push('Data Analysis', 'Statistics');
    if (aptitude.categories.verbal > 70) userSkills.push('Communication', 'Writing');
    if (aptitude.categories.spatial > 70) userSkills.push('Design', 'Visualization');

    const matching = requiredSkills.filter((skill: string) =>
      userSkills.some(userSkill =>
        skill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const missing = requiredSkills.filter((skill: string) => !matching.includes(skill));
    const matchPercentage = requiredSkills.length > 0
      ? Math.round((matching.length / requiredSkills.length) * 100)
      : 50;

    return { matching, missing, matchPercentage };
  };

  // Helper: Get salary range
  const getSalaryRange = (title: string): { min: number; max: number } => {
    if (title.includes('Engineer')) return { min: 80000, max: 130000 };
    if (title.includes('Manager')) return { min: 90000, max: 150000 };
    if (title.includes('Analyst')) return { min: 65000, max: 95000 };
    if (title.includes('Designer')) return { min: 70000, max: 110000 };
    return { min: 60000, max: 100000 };
  };

  // Helper: Get personality insight
  const getPersonalityInsight = (mbti: string, jobTitle: string): string => {
    const insights: Record<string, string> = {
      'E': 'Your extroverted nature will help you thrive in collaborative environments and client-facing roles.',
      'I': 'Your introverted nature allows for deep focus and independent work, valuable for technical and analytical tasks.',
      'T': 'Your thinking preference helps with objective decision-making and logical problem-solving.',
      'F': 'Your feeling preference enables strong interpersonal connections and empathetic team collaboration.',
      'N': 'Your intuitive nature drives innovation and helps you see the big picture in complex projects.',
      'S': 'Your sensing preference ensures attention to detail and practical, hands-on execution.'
    };

    const firstLetter = mbti[0];
    const thirdLetter = mbti[2];
    return insights[firstLetter] + ' ' + insights[thirdLetter];
  };

  // Helper: Calculate personality fit from SWOT
  const calculatePersonalityFitFromSWOT = (jobData: any, swotData: any): number => {
    const techStrengths = swotData.strengths.filter((s: any) =>
      s.category === 'Technical' || s.category === 'Soft Skills'
    ).length;

    const weaknessCount = swotData.weaknesses.length;

    // Simple scoring based on strengths/weaknesses ratio
    if (jobData.title.includes('Engineer') || jobData.title.includes('Developer')) {
      return techStrengths >= 3 ? 85 : 70;
    } else if (jobData.title.includes('Manager') || jobData.title.includes('Leader')) {
      const softSkillStrengths = swotData.strengths.filter((s: any) =>
        s.category === 'Soft Skills' || s.title.toLowerCase().includes('leadership')
      ).length;
      return softSkillStrengths >= 2 ? 88 : 72;
    }
    return 75;
  };

  // Helper: Get personality insight from SWOT
  const getPersonalityInsightFromSWOT = (swotData: any, jobTitle: string): string => {
    const strengths = swotData.strengths.map((s: any) => s.title).slice(0, 3).join(', ');
    return `Based on your Career Readiness profile, your key strengths in ${strengths} align well with the ${jobTitle} role. Your SWOT analysis indicates you're well-positioned for this opportunity.`;
  };

  // Reset job analyzer
  const handleResetJobAnalyzer = () => {
    setJobUrl('');
    setJobTitle('');
    setJobDescription('');
    setJobRequirements('');
    setJobAnalysisResults(null);
  };

  // Retake assessment
  const handleRetake = () => {
    setAssessmentPhase('personality');
    setPersonalityQuestionIndex(0);
    setPersonalityAnswers({});
    setPersonalityResults(null);
    setAptitudeQuestionIndex(0);
    setAptitudeAnswers({});
    setAptitudeResults(null);
    setJobAnalysisResults(null);
  };

  return (
    <div className="company-matcher">
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-briefcase"></i>
              Career Intelligence Platform
            </h1>
            <p>Discover your personality type and unlock personalized career insights</p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="main-tabs">
          <button
            className={`main-tab-btn ${mainTab === 'assessments' ? 'active' : ''}`}
            onClick={() => setMainTab('assessments')}
          >
            <i className="fas fa-clipboard-check"></i> Career Assessments
          </button>
          <button
            className={`main-tab-btn ${mainTab === 'jobAnalyzer' ? 'active' : ''}`}
            onClick={() => setMainTab('jobAnalyzer')}
          >
            <i className="fas fa-search"></i> Job Analyzer
          </button>
          <button
            className={`main-tab-btn ${mainTab === 'careerPaths' ? 'active' : ''}`}
            onClick={() => setMainTab('careerPaths')}
          >
            <i className="fas fa-route"></i> Career Paths
          </button>
        </div>
      </div>

      {mainTab === 'assessments' && (
        <>
          <div className="stats-dashboard">
            <div className="stat-card questions">
              <div className="stat-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="stat-content">
                <div className="stat-count">15</div>
                <div className="stat-label">Questions</div>
                <div className="stat-sublabel">Personality Test</div>
              </div>
            </div>

            <div className="stat-card traits">
              <div className="stat-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <div className="stat-content">
                <div className="stat-count">4</div>
                <div className="stat-label">Traits</div>
                <div className="stat-sublabel">MBTI Dimensions</div>
              </div>
            </div>

            <div className="stat-card match">
              <div className="stat-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <div className="stat-content">
                <div className="stat-count">100%</div>
                <div className="stat-label">Accuracy</div>
                <div className="stat-sublabel">Career Match</div>
              </div>
            </div>

            <div className="stat-card time">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <div className="stat-count">5</div>
                <div className="stat-label">Minutes</div>
                <div className="stat-sublabel">To Complete</div>
              </div>
            </div>
          </div>

          {assessmentPhase === 'personality' && (
        <div className="assessment-container">
          <div className="assessment-header">
            <h2>Personality Assessment</h2>
            <p>Answer these questions to discover your MBTI personality type</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${personalityProgress}%` }}></div>
          </div>
          <p className="progress-text">Question {personalityQuestionIndex + 1} of {personalityQuestions.length}</p>

          <div className="question-card">
            <div className="question-number">Question {personalityQuestionIndex + 1}</div>
            <h3 className="question-text">{currentPersonalityQuestion.question}</h3>

            <div className="options-grid">
              {currentPersonalityQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${personalityAnswers[currentPersonalityQuestion.id] === index ? 'selected' : ''}`}
                  onClick={() => handlePersonalityAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-buttons">
            <button
              className="prev-btn"
              onClick={handlePersonalityPrevious}
              disabled={personalityQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <button
              className="next-btn"
              onClick={handlePersonalityNext}
              disabled={!isPersonalityAnswered}
            >
              {personalityQuestionIndex === personalityQuestions.length - 1 ? (
                <>Submit <i className="fas fa-check"></i></>
              ) : (
                <>Next <i className="fas fa-arrow-right"></i></>
              )}
            </button>
          </div>
        </div>
      )}

      {assessmentPhase === 'aptitude' && (
        <div className="assessment-container">
          <div className="assessment-header">
            <h2>Aptitude Assessment</h2>
            <p>Test your logical, numerical, verbal, and spatial abilities</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${aptitudeProgress}%` }}></div>
          </div>
          <p className="progress-text">Question {aptitudeQuestionIndex + 1} of {aptitudeQuestions.length}</p>

          <div className="question-card">
            <div className="question-number">
              <span className={`category-badge ${currentAptitudeQuestion.category}`}>
                {currentAptitudeQuestion.category.toUpperCase()}
              </span>
              {' '}Question {aptitudeQuestionIndex + 1}
            </div>
            <h3 className="question-text">{currentAptitudeQuestion.question}</h3>

            <div className="options-grid">
              {currentAptitudeQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${aptitudeAnswers[currentAptitudeQuestion.id] === index ? 'selected' : ''}`}
                  onClick={() => handleAptitudeAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-buttons">
            <button
              className="prev-btn"
              onClick={handleAptitudePrevious}
              disabled={aptitudeQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <button
              className="next-btn"
              onClick={handleAptitudeNext}
              disabled={!isAptitudeAnswered}
            >
              {aptitudeQuestionIndex === aptitudeQuestions.length - 1 ? (
                <>Submit <i className="fas fa-check"></i></>
              ) : (
                <>Next <i className="fas fa-arrow-right"></i></>
              )}
            </button>
          </div>
        </div>
      )}

      {assessmentPhase === 'results' && (
        <div className="results-container">
          <div className="results-header">
            <i className="fas fa-check-circle success-icon"></i>
            <h2>{aptitudeResults ? 'Complete Assessment Results!' : 'Personality Assessment Complete!'}</h2>
            <p>{aptitudeResults ? 'Your comprehensive career intelligence profile' : 'Your personality profile'}</p>
          </div>

          {/* Personality Results */}
          <div className="personality-type-section">
            <div className="personality-type-badge">{personalityResults?.personalityType}</div>
            <p className="type-description">
              Your personality type reveals unique strengths and career preferences
            </p>
          </div>

          <div className="traits-section">
            <h3>Personality Traits Breakdown</h3>

            <div className="trait-item">
              <div className="trait-header">
                <div className="trait-labels">
                  <span className={`trait-label ${personalityResults!.traits.extroversion >= 50 ? 'dominant' : ''}`}>
                    Extroversion
                  </span>
                  <span className="trait-percentage">{personalityResults?.traits.extroversion}%</span>
                  <span className={`trait-label ${personalityResults!.traits.extroversion < 50 ? 'dominant' : ''}`}>
                    Introversion
                  </span>
                </div>
              </div>
              <div className="trait-bar">
                <div className="trait-fill" style={{ width: `${personalityResults?.traits.extroversion}%` }}></div>
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <div className="trait-labels">
                  <span className={`trait-label ${personalityResults!.traits.sensing >= 50 ? 'dominant' : ''}`}>
                    Sensing
                  </span>
                  <span className="trait-percentage">{personalityResults?.traits.sensing}%</span>
                  <span className={`trait-label ${personalityResults!.traits.sensing < 50 ? 'dominant' : ''}`}>
                    Intuition
                  </span>
                </div>
              </div>
              <div className="trait-bar">
                <div className="trait-fill" style={{ width: `${personalityResults?.traits.sensing}%` }}></div>
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <div className="trait-labels">
                  <span className={`trait-label ${personalityResults!.traits.thinking >= 50 ? 'dominant' : ''}`}>
                    Thinking
                  </span>
                  <span className="trait-percentage">{personalityResults?.traits.thinking}%</span>
                  <span className={`trait-label ${personalityResults!.traits.thinking < 50 ? 'dominant' : ''}`}>
                    Feeling
                  </span>
                </div>
              </div>
              <div className="trait-bar">
                <div className="trait-fill" style={{ width: `${personalityResults?.traits.thinking}%` }}></div>
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <div className="trait-labels">
                  <span className={`trait-label ${personalityResults!.traits.judging >= 50 ? 'dominant' : ''}`}>
                    Judging
                  </span>
                  <span className="trait-percentage">{personalityResults?.traits.judging}%</span>
                  <span className={`trait-label ${personalityResults!.traits.judging < 50 ? 'dominant' : ''}`}>
                    Perceiving
                  </span>
                </div>
              </div>
              <div className="trait-bar">
                <div className="trait-fill" style={{ width: `${personalityResults?.traits.judging}%` }}></div>
              </div>
            </div>
          </div>

          {/* Aptitude Results (if completed) */}
          {aptitudeResults && (
            <div className="aptitude-section">
              <h3>Aptitude Assessment Results</h3>
              <div className="overall-score">
                <div className="score-circle">
                  <svg className="progress-ring" width="180" height="180">
                    <circle
                      className="progress-ring-background"
                      stroke="#e2e8f0"
                      strokeWidth="20"
                      fill="transparent"
                      r="70"
                      cx="90"
                      cy="90"
                    />
                    <circle
                      className="progress-ring-progress"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      fill="transparent"
                      r="70"
                      cx="90"
                      cy="90"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - aptitudeResults.overall / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#094d88" />
                        <stop offset="100%" stopColor="#10ac8b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="score-content">
                    <div className="score-value">{aptitudeResults.overall}%</div>
                    <div className="score-label">Overall Score</div>
                  </div>
                </div>
              </div>

              <div className="aptitude-categories">
                <div className="aptitude-item logical">
                  <div className="aptitude-header">
                    <div className="aptitude-icon">
                      <i className="fas fa-brain"></i>
                    </div>
                    <div className="aptitude-info">
                      <div className="aptitude-name">Logical Reasoning</div>
                      <div className="aptitude-score">{aptitudeResults.categories.logical}%</div>
                    </div>
                  </div>
                  <div className="aptitude-bar">
                    <div className="aptitude-fill logical" style={{ width: `${aptitudeResults.categories.logical}%` }}></div>
                  </div>
                </div>

                <div className="aptitude-item numerical">
                  <div className="aptitude-header">
                    <div className="aptitude-icon">
                      <i className="fas fa-calculator"></i>
                    </div>
                    <div className="aptitude-info">
                      <div className="aptitude-name">Numerical Ability</div>
                      <div className="aptitude-score">{aptitudeResults.categories.numerical}%</div>
                    </div>
                  </div>
                  <div className="aptitude-bar">
                    <div className="aptitude-fill numerical" style={{ width: `${aptitudeResults.categories.numerical}%` }}></div>
                  </div>
                </div>

                <div className="aptitude-item verbal">
                  <div className="aptitude-header">
                    <div className="aptitude-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="aptitude-info">
                      <div className="aptitude-name">Verbal Ability</div>
                      <div className="aptitude-score">{aptitudeResults.categories.verbal}%</div>
                    </div>
                  </div>
                  <div className="aptitude-bar">
                    <div className="aptitude-fill verbal" style={{ width: `${aptitudeResults.categories.verbal}%` }}></div>
                  </div>
                </div>

                <div className="aptitude-item spatial">
                  <div className="aptitude-header">
                    <div className="aptitude-icon">
                      <i className="fas fa-cube"></i>
                    </div>
                    <div className="aptitude-info">
                      <div className="aptitude-name">Spatial Reasoning</div>
                      <div className="aptitude-score">{aptitudeResults.categories.spatial}%</div>
                    </div>
                  </div>
                  <div className="aptitude-bar">
                    <div className="aptitude-fill spatial" style={{ width: `${aptitudeResults.categories.spatial}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="results-actions">
            {!aptitudeResults && (
              <button className="continue-btn" onClick={handleContinueToAptitude}>
                <i className="fas fa-arrow-right"></i> Continue to Aptitude Assessment
              </button>
            )}
            {aptitudeResults && (
              <button className="continue-btn" onClick={handleGoToJobAnalyzer}>
                <i className="fas fa-briefcase"></i> Analyze Job Opportunities
              </button>
            )}
            <button className="retake-btn" onClick={handleRetake}>
              <i className="fas fa-redo"></i> Retake All Assessments
            </button>
          </div>
        </div>
      )}
        </>
      )}

      {mainTab === 'jobAnalyzer' && (
        <div className="job-analyzer-container">
          {!jobAnalysisResults ? (
            <>
              <div className="job-analyzer-header">
                <h2><i className="fas fa-search"></i> Job Opportunity Analyzer</h2>
                <p>Analyze job postings and see how well they match your profile</p>
              </div>

              {/* Data Source Toggle */}
              <div className="data-source-selector">
                <label className="data-source-label">
                  <i className="fas fa-database"></i> Data Source:
                </label>
                <div className="data-source-options">
                  <button
                    className={`data-source-btn ${dataSource === 'careerReadiness' ? 'active' : ''}`}
                    onClick={() => setDataSource('careerReadiness')}
                    disabled={!hasCareerReadinessData}
                  >
                    <i className="fas fa-user-graduate"></i> Career Readiness Profile
                  </button>
                  <button
                    className={`data-source-btn ${dataSource === 'assessments' ? 'active' : ''}`}
                    onClick={() => setDataSource('assessments')}
                    disabled={!personalityResults || !aptitudeResults}
                  >
                    <i className="fas fa-clipboard-list"></i> Assessment Results
                  </button>
                </div>
                {dataSource === 'careerReadiness' && hasCareerReadinessData && (
                  <p className="data-source-info">
                    <i className="fas fa-check-circle"></i> Using skills and SWOT data from your Career Readiness profile
                  </p>
                )}
                {dataSource === 'assessments' && (!personalityResults || !aptitudeResults) && (
                  <p className="data-source-warning">
                    <i className="fas fa-exclamation-triangle"></i> Complete Career Assessments first to use this data source
                  </p>
                )}
              </div>

              {/* Input Method Tabs */}
              <div className="input-method-tabs">
                <button
                  className={`tab-btn ${jobInputMethod === 'url' ? 'active' : ''}`}
                  onClick={() => setJobInputMethod('url')}
                >
                  <i className="fas fa-link"></i> Paste Job URL
                </button>
                <button
                  className={`tab-btn ${jobInputMethod === 'manual' ? 'active' : ''}`}
                  onClick={() => setJobInputMethod('manual')}
                >
                  <i className="fas fa-edit"></i> Manual Entry
                </button>
              </div>

              {/* URL Input */}
              {jobInputMethod === 'url' && (
                <div className="job-input-section">
                  <label className="input-label">Job Posting URL</label>
                  <input
                    type="text"
                    className="job-input"
                    placeholder="https://linkedin.com/jobs/view/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                  <p className="input-hint">
                    <i className="fas fa-info-circle"></i> Paste a URL from LinkedIn, Indeed, Glassdoor, or any job board
                  </p>
                </div>
              )}

              {/* Manual Input */}
              {jobInputMethod === 'manual' && (
                <div className="job-input-section">
                  <div className="input-group">
                    <label className="input-label">Job Title</label>
                    <input
                      type="text"
                      className="job-input"
                      placeholder="e.g., Software Engineer, Marketing Manager"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Job Description</label>
                    <textarea
                      className="job-textarea"
                      rows={4}
                      placeholder="Describe the role and responsibilities..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Required Skills (comma separated)</label>
                    <textarea
                      className="job-textarea"
                      rows={3}
                      placeholder="e.g., React, TypeScript, Communication, Problem Solving"
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <div className="job-analyzer-actions">
                <button
                  className="analyze-btn"
                  onClick={handleAnalyzeJob}
                  disabled={
                    (jobInputMethod === 'url' && !jobUrl) ||
                    (jobInputMethod === 'manual' && (!jobTitle || !jobDescription || !jobRequirements))
                  }
                >
                  <i className="fas fa-chart-line"></i> Analyze Job Match
                </button>
              </div>
            </>
          ) : (
            /* Job Analysis Results */
            <div className="job-analysis-results">
              <div className="analysis-header">
                <h2><i className="fas fa-chart-pie"></i> Job Match Analysis</h2>
                <h3 className="job-title-result">{jobAnalysisResults.jobTitle}</h3>
                <div className="data-source-badge">
                  {dataSource === 'careerReadiness' ? (
                    <span className="badge career-readiness">
                      <i className="fas fa-user-graduate"></i> Based on Career Readiness Profile
                    </span>
                  ) : (
                    <span className="badge assessments">
                      <i className="fas fa-clipboard-check"></i> Based on Assessment Results
                    </span>
                  )}
                </div>
              </div>

              {/* Overall Match Score */}
              <div className="overall-score">
                <div className="score-circle">
                  <svg className="progress-ring" width="180" height="180">
                    <circle
                      className="progress-ring-background"
                      stroke="#e2e8f0"
                      strokeWidth="20"
                      fill="transparent"
                      r="70"
                      cx="90"
                      cy="90"
                    />
                    <circle
                      className="progress-ring-progress"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      fill="transparent"
                      r="70"
                      cx="90"
                      cy="90"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - jobAnalysisResults.overallMatch / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#094d88" />
                        <stop offset="100%" stopColor="#10ac8b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="score-content">
                    <div className="score-value">{jobAnalysisResults.overallMatch}%</div>
                    <div className="score-label">Overall Match</div>
                  </div>
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="match-breakdown">
                <h3>Match Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-card">
                    <div className="breakdown-icon personality">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="breakdown-info">
                      <div className="breakdown-label">Personality Fit</div>
                      <div className="breakdown-value">{jobAnalysisResults.personalityFit}%</div>
                    </div>
                  </div>

                  <div className="breakdown-card">
                    <div className="breakdown-icon skills">
                      <i className="fas fa-cogs"></i>
                    </div>
                    <div className="breakdown-info">
                      <div className="breakdown-label">Skills Match</div>
                      <div className="breakdown-value">{jobAnalysisResults.skillsMatch}%</div>
                    </div>
                  </div>

                  <div className="breakdown-card">
                    <div className="breakdown-icon aptitude">
                      <i className="fas fa-brain"></i>
                    </div>
                    <div className="breakdown-info">
                      <div className="breakdown-label">Aptitude Alignment</div>
                      <div className="breakdown-value">{jobAnalysisResults.aptitudeAlignment}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personality Insight */}
              <div className="insight-section">
                <h3><i className="fas fa-lightbulb"></i> Personality Insight</h3>
                <p className="insight-text">{jobAnalysisResults.personalityInsight}</p>
              </div>

              {/* Skills Analysis */}
              <div className="skills-analysis">
                <h3><i className="fas fa-list-check"></i> Skills Analysis</h3>

                {jobAnalysisResults.matchingSkills.length > 0 && (
                  <div className="skills-group">
                    <h4 className="skills-heading matching">
                      <i className="fas fa-check-circle"></i> Matching Skills
                    </h4>
                    <div className="skills-badges">
                      {jobAnalysisResults.matchingSkills.map((skill, index) => (
                        <span key={index} className="skill-badge matching">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {jobAnalysisResults.missingSkills.length > 0 && (
                  <div className="skills-group">
                    <h4 className="skills-heading missing">
                      <i className="fas fa-exclamation-circle"></i> Skills to Develop
                    </h4>
                    <div className="skills-badges">
                      {jobAnalysisResults.missingSkills.map((skill, index) => (
                        <span key={index} className="skill-badge missing">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Salary Insights */}
              <div className="salary-section">
                <h3><i className="fas fa-dollar-sign"></i> Salary Insights</h3>
                <div className="salary-range">
                  <div className="salary-label">Expected Range</div>
                  <div className="salary-value">
                    ${jobAnalysisResults.salaryRange.min.toLocaleString()} - ${jobAnalysisResults.salaryRange.max.toLocaleString()}
                  </div>
                  <div className="salary-note">Based on industry averages</div>
                </div>
              </div>

              {/* Actions */}
              <div className="job-analyzer-actions">
                <button className="secondary-btn" onClick={handleResetJobAnalyzer}>
                  <i className="fas fa-search"></i> Analyze Another Job
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mainTab === 'careerPaths' && (
        <div className="career-paths-container">
          {/* Career Paths Explorer Phase */}
          {careerPathPhase === 'explorer' && (
            <div className="career-paths-section">
              {/* Header */}
              <div className="career-paths-header">
                <h2><i className="fas fa-route"></i> Your Career Trajectory Options</h2>
                <p>Based on your assessments, here are personalized career paths tailored to your profile</p>
              </div>

              {/* Path Cards Grid */}
              <div className="career-paths-grid">
                {mockCareerPaths.map(path => {
                  const fitScore = calculatePathFitScore(path, personalityResults, aptitudeResults);

                  return (
                    <div
                      key={path.id}
                      className="career-path-card"
                      onClick={() => {
                        setSelectedPath(path);
                        setCareerPathPhase('timeline');
                      }}
                    >
                      <div className="path-card-header">
                        <div className="path-icon">
                          <i className={`fas ${path.icon}`}></i>
                        </div>
                        <div className="path-track-badge">{path.track}</div>
                      </div>

                      <h3 className="path-title">{path.pathName}</h3>
                      <p className="path-description">{path.description}</p>

                      <div className="path-metadata">
                        <div className="path-meta-item">
                          <i className="fas fa-clock"></i>
                          <span>{path.totalDuration}</span>
                        </div>
                        <div className="path-meta-item">
                          <i className="fas fa-layer-group"></i>
                          <span>{path.stages.length} Stages</span>
                        </div>
                      </div>

                      <div className="path-fit-score">
                        <div className="fit-score-label">Fit Score</div>
                        <div className="fit-score-bar">
                          <div
                            className="fit-score-fill"
                            style={{ width: `${fitScore}%` }}
                          ></div>
                        </div>
                        <div className="fit-score-value">{fitScore}%</div>
                      </div>

                      <div className="path-card-footer">
                        <button className="explore-path-btn">
                          Explore Path <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assessment Prompt */}
              {(!personalityResults || !aptitudeResults) && (
                <div className="assessment-prompt">
                  <i className="fas fa-info-circle"></i>
                  <p>Complete both assessments to see personalized fit scores for each career path</p>
                  <button
                    className="primary-btn"
                    onClick={() => setMainTab('assessments')}
                  >
                    <i className="fas fa-clipboard-check"></i> Go to Assessments
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timeline Phase - Career Path Progression Simulator */}
          {careerPathPhase === 'timeline' && selectedPath && (
            <div className="career-timeline-section">
              {/* Header */}
              <div className="timeline-header">
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setCareerPathPhase('explorer');
                    setCurrentStage(0);
                  }}
                >
                  <i className="fas fa-arrow-left"></i> Back to Explorer
                </button>
                <div className="timeline-header-content">
                  <div className="path-icon-large">
                    <i className={`fas ${selectedPath.icon}`}></i>
                  </div>
                  <div className="path-header-text">
                    <h2>{selectedPath.pathName}</h2>
                    <p>{selectedPath.description}</p>
                    <div className="path-header-meta">
                      <span className="path-track-badge">{selectedPath.track}</span>
                      <span className="path-duration">
                        <i className="fas fa-clock"></i> {selectedPath.totalDuration}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="primary-btn"
                  onClick={() => setCareerPathPhase('skillGap')}
                >
                  View Skill Gaps <i className="fas fa-arrow-right"></i>
                </button>
              </div>

              {/* Stage Navigation */}
              <div className="timeline-navigation">
                {selectedPath.stages.map((stage, index) => (
                  <button
                    key={stage.id}
                    className={`stage-nav-btn ${currentStage === index ? 'active' : ''}`}
                    onClick={() => setCurrentStage(index)}
                  >
                    <div className="stage-number">Stage {index + 1}</div>
                    <div className="stage-title">{stage.title}</div>
                    <div className="stage-years">{stage.yearsRequired}</div>
                  </button>
                ))}
              </div>

              {/* Visual Timeline Progression */}
              <div className="timeline-progression">
                {selectedPath.stages.map((stage, index) => (
                  <Fragment key={stage.id}>
                    <div
                      className={`timeline-stage ${currentStage === index ? 'active' : ''} ${currentStage > index ? 'completed' : ''}`}
                      onClick={() => setCurrentStage(index)}
                    >
                      <div className="timeline-stage-circle">
                        {currentStage > index ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="timeline-stage-label">
                        <div className="timeline-stage-title">{stage.title}</div>
                        <div className="timeline-stage-subtitle">{stage.yearsRequired}</div>
                      </div>
                    </div>
                    {index < selectedPath.stages.length - 1 && (
                      <div className={`timeline-connector ${currentStage > index ? 'completed' : ''}`}></div>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Active Stage Details */}
              {selectedPath.stages[currentStage] && (
                <div className="stage-details">
                  <div className="stage-details-grid">
                    {/* Overview Card */}
                    <div className="stage-card stage-overview-card">
                      <div className="stage-card-header">
                        <h3><i className="fas fa-info-circle"></i> Overview</h3>
                      </div>
                      <div className="stage-card-content">
                        <div className="stage-level">
                          <span className="label">Level:</span>
                          <span className="value">Level {selectedPath.stages[currentStage].level}</span>
                        </div>
                        <div className="stage-duration">
                          <span className="label">Duration:</span>
                          <span className="value">{selectedPath.stages[currentStage].yearsRequired}</span>
                        </div>
                        <div className="stage-salary">
                          <div className="salary-label">
                            <i className="fas fa-rupee-sign"></i> Expected Salary Range
                          </div>
                          <div className="salary-range">
                            <span className="salary-min">
                              ₹{(selectedPath.stages[currentStage].salary.min / 100000).toFixed(1)}L
                            </span>
                            <div className="salary-range-bar">
                              <div className="salary-range-fill"></div>
                            </div>
                            <span className="salary-max">
                              ₹{(selectedPath.stages[currentStage].salary.max / 100000).toFixed(1)}L
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Required Skills Card */}
                    <div className="stage-card skills-required-card">
                      <div className="stage-card-header">
                        <h3><i className="fas fa-graduation-cap"></i> Required Skills</h3>
                        <span className="skill-count">{selectedPath.stages[currentStage].requiredSkills.length} Skills</span>
                      </div>
                      <div className="stage-card-content">
                        <div className="skills-list">
                          {selectedPath.stages[currentStage].requiredSkills.map((skill, idx) => (
                            <div key={idx} className="skill-requirement-item">
                              <div className="skill-header">
                                <span className="skill-name">{skill.skillName}</span>
                                <span className={`skill-category ${skill.category.toLowerCase()}`}>
                                  {skill.category}
                                </span>
                              </div>
                              <div className="skill-level-display">
                                <div className="skill-level-bar">
                                  <div
                                    className="skill-level-fill"
                                    style={{ width: `${(skill.requiredLevel / 10) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="skill-level-text">{skill.requiredLevel}/10</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Responsibilities Card */}
                    <div className="stage-card responsibilities-card">
                      <div className="stage-card-header">
                        <h3><i className="fas fa-tasks"></i> Key Responsibilities</h3>
                      </div>
                      <div className="stage-card-content">
                        <ul className="responsibilities-list">
                          {selectedPath.stages[currentStage].responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="responsibility-item">
                              <i className="fas fa-check-circle"></i>
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Milestones Card */}
                    <div className="stage-card milestones-card">
                      <div className="stage-card-header">
                        <h3><i className="fas fa-flag-checkered"></i> Career Milestones</h3>
                        <span className="milestone-count">{selectedPath.stages[currentStage].milestones.length} Milestones</span>
                      </div>
                      <div className="stage-card-content">
                        <div className="milestones-timeline">
                          {selectedPath.stages[currentStage].milestones.map((milestone, idx) => (
                            <div key={milestone.id} className="milestone-item">
                              <div className="milestone-marker">
                                <div className={`milestone-icon ${milestone.type}`}>
                                  {milestone.type === 'skill' && <i className="fas fa-brain"></i>}
                                  {milestone.type === 'project' && <i className="fas fa-project-diagram"></i>}
                                  {milestone.type === 'certification' && <i className="fas fa-certificate"></i>}
                                  {milestone.type === 'experience' && <i className="fas fa-briefcase"></i>}
                                </div>
                                {idx < selectedPath.stages[currentStage].milestones.length - 1 && (
                                  <div className="milestone-connector"></div>
                                )}
                              </div>
                              <div className="milestone-content">
                                <div className="milestone-header">
                                  <h4>{milestone.title}</h4>
                                  <span className={`milestone-type-badge ${milestone.type}`}>
                                    {milestone.type}
                                  </span>
                                </div>
                                <p className="milestone-description">{milestone.description}</p>
                                <span className="milestone-timeframe">
                                  <i className="fas fa-clock"></i> {milestone.timeframe}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Growth Indicators Card */}
                    <div className="stage-card growth-indicators-card">
                      <div className="stage-card-header">
                        <h3><i className="fas fa-chart-line"></i> Growth Indicators</h3>
                      </div>
                      <div className="stage-card-content">
                        <p className="growth-description">
                          You'll know you're ready for the next stage when you demonstrate these capabilities:
                        </p>
                        <ul className="growth-indicators-list">
                          {selectedPath.stages[currentStage].growthIndicators.map((indicator, idx) => (
                            <li key={idx} className="growth-indicator-item">
                              <i className="fas fa-arrow-up"></i>
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Stage Navigation Arrows */}
                  <div className="stage-navigation-arrows">
                    {currentStage > 0 && (
                      <button
                        className="stage-nav-arrow prev"
                        onClick={() => setCurrentStage(currentStage - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                        <span>Previous Stage</span>
                      </button>
                    )}
                    {currentStage < selectedPath.stages.length - 1 && (
                      <button
                        className="stage-nav-arrow next"
                        onClick={() => setCurrentStage(currentStage + 1)}
                      >
                        <span>Next Stage</span>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skill Gap Phase - Placeholder for Phase 4C */}
          {careerPathPhase === 'skillGap' && selectedPath && (
            <div className="career-skillgap-placeholder">
              <h3>Skill Gap Analysis - Coming in Phase 4C</h3>
              <p>Selected Path: {selectedPath.pathName}</p>
              <button
                className="secondary-btn"
                onClick={() => setCareerPathPhase('explorer')}
              >
                <i className="fas fa-arrow-left"></i> Back to Explorer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyMatcher;
