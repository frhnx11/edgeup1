import { createContext, useContext, useState, ReactNode } from 'react';

// ==================== INTERFACES ====================

export interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  category: 'Technical' | 'Soft' | 'Domain';
  priority: 'High' | 'Medium' | 'Low';
}

export interface SWOTItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

interface SkillsContextType {
  skillGaps: SkillGap[];
  swotData: SWOTData;
  hasCareerReadinessData: boolean;
}

// ==================== MOCK DATA ====================

const mockSkillGaps: SkillGap[] = [
  { skillName: 'React.js', currentLevel: 8, requiredLevel: 9, category: 'Technical', priority: 'High' },
  { skillName: 'TypeScript', currentLevel: 7, requiredLevel: 9, category: 'Technical', priority: 'High' },
  { skillName: 'Node.js', currentLevel: 6, requiredLevel: 8, category: 'Technical', priority: 'High' },
  { skillName: 'System Design', currentLevel: 4, requiredLevel: 8, category: 'Technical', priority: 'High' },
  { skillName: 'MongoDB', currentLevel: 5, requiredLevel: 7, category: 'Technical', priority: 'Medium' },
  { skillName: 'Communication', currentLevel: 7, requiredLevel: 8, category: 'Soft', priority: 'High' },
  { skillName: 'Leadership', currentLevel: 6, requiredLevel: 8, category: 'Soft', priority: 'Medium' },
  { skillName: 'Problem Solving', currentLevel: 8, requiredLevel: 9, category: 'Soft', priority: 'High' },
  { skillName: 'Time Management', currentLevel: 6, requiredLevel: 8, category: 'Soft', priority: 'Medium' },
  { skillName: 'Team Collaboration', currentLevel: 7, requiredLevel: 8, category: 'Soft', priority: 'High' },
  { skillName: 'Agile Methodology', currentLevel: 5, requiredLevel: 7, category: 'Domain', priority: 'Medium' },
  { skillName: 'Product Development', currentLevel: 4, requiredLevel: 7, category: 'Domain', priority: 'Low' }
];

const mockSWOTData: SWOTData = {
  strengths: [
    { id: 's1', title: 'Strong Technical Skills', description: 'Proficient in React, TypeScript, and modern web development', category: 'Technical' },
    { id: 's2', title: 'Problem Solving', description: 'Excellent analytical and problem-solving abilities', category: 'Soft Skills' },
    { id: 's3', title: 'Project Portfolio', description: 'Multiple completed projects demonstrating practical skills', category: 'Technical' },
    { id: 's4', title: 'Quick Learner', description: 'Ability to quickly adapt and learn new technologies', category: 'Personal' },
    { id: 's5', title: 'Team Collaboration', description: 'Experience working in team projects and cross-functional teams', category: 'Soft Skills' }
  ],
  weaknesses: [
    { id: 'w1', title: 'Limited Interview Experience', description: 'Need more practice with technical interviews', category: 'Career Prep' },
    { id: 'w2', title: 'System Design Knowledge', description: 'Gaps in large-scale system architecture', category: 'Technical' },
    { id: 'w3', title: 'Industry Exposure', description: 'Limited real-world industry experience', category: 'Experience' },
    { id: 'w4', title: 'Public Speaking', description: 'Need to improve presentation skills', category: 'Soft Skills' }
  ],
  opportunities: [
    { id: 'o1', title: 'Growing Tech Market', description: 'High demand for software engineers', category: 'Market' },
    { id: 'o2', title: 'Remote Work Options', description: 'More companies offering remote positions', category: 'Flexibility' },
    { id: 'o3', title: 'Online Learning Resources', description: 'Access to courses and certifications', category: 'Learning' },
    { id: 'o4', title: 'Networking Events', description: 'Tech meetups and conferences for connections', category: 'Networking' }
  ],
  threats: [
    { id: 't1', title: 'High Competition', description: 'Many qualified candidates in the market', category: 'Competition' },
    { id: 't2', title: 'Rapidly Changing Technology', description: 'Need to continuously update skills', category: 'Technology' },
    { id: 't3', title: 'Economic Uncertainty', description: 'Potential hiring freezes in tech sector', category: 'Economy' }
  ]
};

// ==================== CONTEXT ====================

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider = ({ children }: { children: ReactNode }) => {
  const [skillGaps] = useState<SkillGap[]>(mockSkillGaps);
  const [swotData] = useState<SWOTData>(mockSWOTData);
  const [hasCareerReadinessData] = useState<boolean>(true); // Mock: always true

  return (
    <SkillsContext.Provider value={{ skillGaps, swotData, hasCareerReadinessData }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
};

// ==================== HELPER FUNCTIONS ====================

export const getStudentSkills = (skillGaps: SkillGap[], minLevel: number = 6): string[] => {
  return skillGaps
    .filter(skill => skill.currentLevel >= minLevel)
    .map(skill => skill.skillName);
};

export const getStudentStrengths = (swotData: SWOTData, category?: string): string[] => {
  if (category) {
    return swotData.strengths
      .filter(s => s.category === category)
      .map(s => s.title);
  }
  return swotData.strengths.map(s => s.title);
};

export const calculateSkillMatch = (
  studentSkills: string[],
  requiredSkills: string[]
): { matching: string[]; missing: string[]; percentage: number } => {
  const matching = requiredSkills.filter(reqSkill =>
    studentSkills.some(studSkill =>
      studSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(studSkill.toLowerCase())
    )
  );

  const missing = requiredSkills.filter(skill => !matching.includes(skill));
  const percentage = requiredSkills.length > 0
    ? Math.round((matching.length / requiredSkills.length) * 100)
    : 0;

  return { matching, missing, percentage };
};
