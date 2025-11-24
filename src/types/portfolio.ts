// Types for Portfolio and Resume System

export interface Certificate {
  id: string;
  title: string;
  issuedBy: string;
  issuedDate: string;
  category: CertificateCategory;
  description?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export type CertificateCategory =
  | 'academic'
  | 'technical'
  | 'language'
  | 'sports'
  | 'arts'
  | 'leadership'
  | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  skills: string[];
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress';
  outcomes?: string[];
  links?: {
    type: 'github' | 'demo' | 'video' | 'document';
    url: string;
  }[];
}

export type ProjectCategory =
  | 'coding'
  | 'science'
  | 'robotics'
  | 'research'
  | 'arts'
  | 'business'
  | 'social'
  | 'other';

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  date: string;
  category: CompetitionCategory;
  achievement: string; // "Winner", "Runner-up", "Participant", "Top 10", etc.
  level: 'school' | 'district' | 'state' | 'national' | 'international';
  description?: string;
}

export type CompetitionCategory =
  | 'academic'
  | 'sports'
  | 'coding'
  | 'science'
  | 'arts'
  | 'debate'
  | 'quiz'
  | 'other';

export interface SoftSkill {
  id: string;
  name: 'communication' | 'leadership' | 'teamwork' | 'problem-solving' | 'time-management' | 'creativity';
  level: 1 | 2 | 3 | 4 | 5; // 1=Beginner, 5=Expert
  activities: SoftSkillActivity[];
  lastUpdated: string;
}

export interface SoftSkillActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  reflection?: string;
  endorsedBy?: string; // Teacher/Peer name
}

export interface Portfolio {
  studentId: string;
  certificates: Certificate[];
  projects: Project[];
  competitions: Competition[];
  softSkills: SoftSkill[];
  extracurriculars: string[]; // Imported from Skills component
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: 'Professional' | 'Creative' | 'Minimal' | 'Academic';
  description: string;
  previewImage: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    grade: string;
    school: string;
    email: string;
    phone?: string;
  };
  objective?: string;
  education: {
    grade: string;
    school: string;
    board: string;
    year: string;
    percentage?: number;
  }[];
  certificates: Certificate[];
  projects: Project[];
  competitions: Competition[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  extracurriculars: string[];
  achievements: string[];
}

export interface InternshipProgram {
  id: string;
  title: string;
  organization: string;
  type: 'internship' | 'workshop' | 'bootcamp' | 'summer-program' | 'research';
  duration: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  eligibility: {
    minGrade: number;
    maxGrade: number;
    stream?: 'Science' | 'Commerce' | 'Arts' | 'Any';
  };
  category: InternshipCategory;
  description: string;
  skills: string[];
  deadline: string;
  stipend?: string;
  website?: string;
  featured?: boolean;
}

export type InternshipCategory =
  | 'technology'
  | 'science'
  | 'business'
  | 'arts'
  | 'social'
  | 'research'
  | 'sports'
  | 'other';
