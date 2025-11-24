// Portfolio Management Service
import type {
  Portfolio,
  Certificate,
  Project,
  Competition,
  SoftSkill,
  ResumeData,
  SoftSkillActivity
} from '../types/portfolio';

const PORTFOLIO_STORAGE_KEY = 'student_portfolio';
const SELECTED_STREAM_KEY = 'selected_career_stream';

/**
 * Get student portfolio from localStorage
 */
export const getPortfolio = (): Portfolio => {
  try {
    const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load portfolio:', error);
  }

  // Return default empty portfolio
  return {
    studentId: 'student-001', // This would come from auth context
    certificates: [],
    projects: [],
    competitions: [],
    softSkills: initializeSoftSkills(),
    extracurriculars: [],
    updatedAt: new Date().toISOString()
  };
};

/**
 * Save portfolio to localStorage
 */
export const savePortfolio = (portfolio: Portfolio): boolean => {
  try {
    portfolio.updatedAt = new Date().toISOString();
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    return true;
  } catch (error) {
    console.error('Failed to save portfolio:', error);
    return false;
  }
};

/**
 * Initialize default soft skills
 */
const initializeSoftSkills = (): SoftSkill[] => {
  return [
    {
      id: 'ss-1',
      name: 'communication',
      level: 3,
      activities: [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ss-2',
      name: 'leadership',
      level: 2,
      activities: [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ss-3',
      name: 'teamwork',
      level: 3,
      activities: [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ss-4',
      name: 'problem-solving',
      level: 3,
      activities: [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ss-5',
      name: 'time-management',
      level: 2,
      activities: [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ss-6',
      name: 'creativity',
      level: 3,
      activities: [],
      lastUpdated: new Date().toISOString()
    }
  ];
};

/**
 * Add certificate to portfolio
 */
export const addCertificate = (certificate: Certificate): boolean => {
  const portfolio = getPortfolio();
  portfolio.certificates.push(certificate);
  return savePortfolio(portfolio);
};

/**
 * Update certificate in portfolio
 */
export const updateCertificate = (certificateId: string, updates: Partial<Certificate>): boolean => {
  const portfolio = getPortfolio();
  const index = portfolio.certificates.findIndex(c => c.id === certificateId);
  if (index !== -1) {
    portfolio.certificates[index] = { ...portfolio.certificates[index], ...updates };
    return savePortfolio(portfolio);
  }
  return false;
};

/**
 * Delete certificate from portfolio
 */
export const deleteCertificate = (certificateId: string): boolean => {
  const portfolio = getPortfolio();
  portfolio.certificates = portfolio.certificates.filter(c => c.id !== certificateId);
  return savePortfolio(portfolio);
};

/**
 * Add project to portfolio
 */
export const addProject = (project: Project): boolean => {
  const portfolio = getPortfolio();
  portfolio.projects.push(project);
  return savePortfolio(portfolio);
};

/**
 * Update project in portfolio
 */
export const updateProject = (projectId: string, updates: Partial<Project>): boolean => {
  const portfolio = getPortfolio();
  const index = portfolio.projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    portfolio.projects[index] = { ...portfolio.projects[index], ...updates };
    return savePortfolio(portfolio);
  }
  return false;
};

/**
 * Delete project from portfolio
 */
export const deleteProject = (projectId: string): boolean => {
  const portfolio = getPortfolio();
  portfolio.projects = portfolio.projects.filter(p => p.id !== projectId);
  return savePortfolio(portfolio);
};

/**
 * Add competition to portfolio
 */
export const addCompetition = (competition: Competition): boolean => {
  const portfolio = getPortfolio();
  portfolio.competitions.push(competition);
  return savePortfolio(portfolio);
};

/**
 * Update competition in portfolio
 */
export const updateCompetition = (competitionId: string, updates: Partial<Competition>): boolean => {
  const portfolio = getPortfolio();
  const index = portfolio.competitions.findIndex(c => c.id === competitionId);
  if (index !== -1) {
    portfolio.competitions[index] = { ...portfolio.competitions[index], ...updates };
    return savePortfolio(portfolio);
  }
  return false;
};

/**
 * Delete competition from portfolio
 */
export const deleteCompetition = (competitionId: string): boolean => {
  const portfolio = getPortfolio();
  portfolio.competitions = portfolio.competitions.filter(c => c.id !== competitionId);
  return savePortfolio(portfolio);
};

/**
 * Update soft skill level
 */
export const updateSoftSkillLevel = (skillName: string, newLevel: 1 | 2 | 3 | 4 | 5): boolean => {
  const portfolio = getPortfolio();
  const skill = portfolio.softSkills.find(s => s.name === skillName);
  if (skill) {
    skill.level = newLevel;
    skill.lastUpdated = new Date().toISOString();
    return savePortfolio(portfolio);
  }
  return false;
};

/**
 * Add soft skill activity
 */
export const addSoftSkillActivity = (skillName: string, activity: SoftSkillActivity): boolean => {
  const portfolio = getPortfolio();
  const skill = portfolio.softSkills.find(s => s.name === skillName);
  if (skill) {
    skill.activities.push(activity);
    skill.lastUpdated = new Date().toISOString();
    return savePortfolio(portfolio);
  }
  return false;
};

/**
 * Get resume data from portfolio
 */
export const getResumeData = (): ResumeData => {
  const portfolio = getPortfolio();

  // This would ideally come from student profile/auth
  const personalInfo = {
    name: 'Student Name',
    grade: 'Class 10',
    school: 'Sample High School',
    email: 'student@example.com',
    phone: '+91 9876543210'
  };

  const education = [
    {
      grade: 'Class 10',
      school: 'Sample High School',
      board: 'CBSE',
      year: '2024',
      percentage: 92
    }
  ];

  // Extract technical skills from projects
  const technicalSkills: string[] = [];
  portfolio.projects.forEach(project => {
    project.skills.forEach(skill => {
      if (!technicalSkills.includes(skill)) {
        technicalSkills.push(skill);
      }
    });
  });

  // Extract soft skills
  const softSkills = portfolio.softSkills
    .map(s => s.name.charAt(0).toUpperCase() + s.name.slice(1).replace('-', ' '))
    .slice(0, 6);

  // Extract achievements from competitions
  const achievements = portfolio.competitions
    .map(c => `${c.achievement} - ${c.name} (${c.level.charAt(0).toUpperCase() + c.level.slice(1)})`)
    .slice(0, 5);

  return {
    personalInfo,
    education,
    certificates: portfolio.certificates.slice(0, 10),
    projects: portfolio.projects.slice(0, 5),
    competitions: portfolio.competitions.slice(0, 5),
    skills: {
      technical: technicalSkills.slice(0, 10),
      soft: softSkills,
      languages: ['English', 'Hindi'] // This could be from profile
    },
    extracurriculars: portfolio.extracurriculars.slice(0, 5),
    achievements
  };
};

/**
 * Save selected career stream
 */
export const saveSelectedStream = (stream: 'Science' | 'Commerce' | 'Arts'): boolean => {
  try {
    localStorage.setItem(SELECTED_STREAM_KEY, stream);
    return true;
  } catch (error) {
    console.error('Failed to save selected stream:', error);
    return false;
  }
};

/**
 * Get selected career stream
 */
export const getSelectedStream = (): 'Science' | 'Commerce' | 'Arts' | null => {
  try {
    const stream = localStorage.getItem(SELECTED_STREAM_KEY);
    return stream as 'Science' | 'Commerce' | 'Arts' | null;
  } catch (error) {
    console.error('Failed to load selected stream:', error);
    return null;
  }
};

/**
 * Generate unique ID
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get portfolio statistics
 */
export const getPortfolioStats = () => {
  const portfolio = getPortfolio();

  return {
    totalCertificates: portfolio.certificates.length,
    totalProjects: portfolio.projects.length,
    totalCompetitions: portfolio.competitions.length,
    completedProjects: portfolio.projects.filter(p => p.status === 'completed').length,
    averageSoftSkillLevel: Math.round(
      portfolio.softSkills.reduce((sum, s) => sum + s.level, 0) / portfolio.softSkills.length
    ),
    lastUpdated: portfolio.updatedAt
  };
};

/**
 * Clear all portfolio data
 */
export const clearPortfolio = (): boolean => {
  try {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    localStorage.removeItem(SELECTED_STREAM_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear portfolio:', error);
    return false;
  }
};
