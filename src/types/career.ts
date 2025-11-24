// Shared types for Career Path system

export interface TimelineNode {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface EntranceExam {
  name: string;
  fullName: string;
  pattern: string;
  duration: string;
  dates: string;
  tips: string[];
  resources: string[];
}

export interface College {
  name: string;
  location: string;
  fees: string;
  cutoff: string;
  placement: string;
  ranking: string;
}

export interface ProgressionLevel {
  title: string;
  years: string;
  salary: string;
  responsibilities: string[];
}

export interface CareerData {
  id: string;
  name: string;
  icon: string;
  color: string;
  match: number;
  tagline: string;
  timeline: TimelineNode[];
  roadmap: {
    class11_12: string[];
    entranceExam: string;
    undergraduate: string;
    postgraduate?: string;
    careerEntry: string;
  };
  entranceExams: EntranceExam[];
  topColleges: College[];
  skills: {
    technical: string[];
    subjects: string[];
    certifications: string[];
    softSkills: string[];
  };
  progression: ProgressionLevel[];
  marketInsights: {
    demand: 'High' | 'Medium' | 'Low';
    growth: string;
    startingSalary: string;
    experiencedSalary: string;
  };
  checklist: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  resources: {
    name: string;
    url: string;
    type: 'Official' | 'Learning' | 'Community' | 'Counseling';
  }[];
}
