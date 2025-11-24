import { useState } from 'react';
import './CareerReadiness.css';

// ==================== INTERFACES ====================

interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

interface SWOTItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ResumeData {
  completeness: number;
  atsScore: number;
  lastUpdated: string;
  sections: ResumeSection[];
}

interface ResumeSection {
  name: string;
  completed: boolean;
  suggestions: string[];
}

interface InterviewModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  locked: boolean;
}

interface Opportunity {
  id: string;
  companyName: string;
  position: string;
  type: 'Internship' | 'Full-time' | 'Part-time';
  location: string;
  stipend: string;
  matchScore: number;
  tags: string[];
  postedDate: string;
  description: string;
}

interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  category: 'Technical' | 'Soft' | 'Domain';
  priority: 'High' | 'Medium' | 'Low';
}

interface Course {
  id: string;
  title: string;
  platform: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  rating: number;
  reviews: number;
  addressesSkill: string;
}

interface Mentor {
  id: string;
  name: string;
  position: string;
  company: string;
  industry: string;
  yearsOfExperience: number;
  expertise: string[];
  matchScore: number;
  availability: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
}

interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  department: string;
  currentPosition: string;
  currentCompany: string;
  location: string;
  sharedInterests: string[];
  connectionReason: string;
  profileImage: string;
}

type TabType = 'resume' | 'interview' | 'opportunities' | 'skills' | 'mentors' | 'alumni';
type ResumeSubTabType = 'build' | 'ats-check' | 'ai-suggestions';
type InterviewSubTabType = 'learn' | 'practice' | 'analytics';

// ==================== MAIN COMPONENT ====================

const CareerReadiness = () => {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [activeResumeSubTab, setActiveResumeSubTab] = useState<ResumeSubTabType>('build');
  const [activeInterviewSubTab, setActiveInterviewSubTab] = useState<InterviewSubTabType>('learn');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [opportunityFilter, setOpportunityFilter] = useState<'all' | 'Internship' | 'Full-time' | 'Part-time'>('all');
  const [opportunitySort, setOpportunitySort] = useState<'match' | 'date' | 'stipend'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'Technical' | 'Soft' | 'Domain'>('all');
  const [mentorSearchQuery, setMentorSearchQuery] = useState('');
  const [mentorSort, setMentorSort] = useState<'match' | 'rating' | 'experience'>('match');
  const [alumniSearchQuery, setAlumniSearchQuery] = useState('');
  const [alumniSort, setAlumniSort] = useState<'year' | 'interests' | 'location'>('year');

  // SWOT Mock Data
  const [swotData] = useState<SWOTData>({
    strengths: [
      { id: 's1', title: 'Strong Technical Skills', description: 'Proficient in React, TypeScript, Node.js', category: 'Technical' },
      { id: 's2', title: 'Good Academic Record', description: 'CGPA: 8.5/10', category: 'Academic' },
      { id: 's3', title: 'Leadership Experience', description: 'Led 2 college tech events', category: 'Soft Skills' },
      { id: 's4', title: 'Problem Solving', description: 'Solved 150+ LeetCode problems', category: 'Technical' },
      { id: 's5', title: 'Team Collaboration', description: 'Worked on 3 group projects successfully', category: 'Soft Skills' },
      { id: 's6', title: 'Quick Learner', description: 'Adapted to new technologies rapidly', category: 'Personal' },
      { id: 's7', title: 'Project Portfolio', description: '4 full-stack projects completed', category: 'Technical' },
      { id: 's8', title: 'Certifications', description: 'AWS Certified Cloud Practitioner', category: 'Professional' },
      { id: 's9', title: 'Communication', description: 'Presented in 3 technical seminars', category: 'Soft Skills' },
      { id: 's10', title: 'Time Management', description: 'Balanced academics and extracurriculars', category: 'Personal' },
      { id: 's11', title: 'Open Source', description: 'Contributed to 2 open source projects', category: 'Technical' },
      { id: 's12', title: 'Networking', description: 'Active on LinkedIn with 500+ connections', category: 'Professional' }
    ],
    weaknesses: [
      { id: 'w1', title: 'Limited Interview Experience', description: 'Only 2 mock interviews completed', category: 'Career Prep' },
      { id: 'w2', title: 'Soft Skills Gap', description: 'Need improvement in public speaking', category: 'Soft Skills' },
      { id: 'w3', title: 'System Design Knowledge', description: 'Weak in scalability concepts', category: 'Technical' },
      { id: 'w4', title: 'Industry Exposure', description: 'No internship experience yet', category: 'Experience' },
      { id: 'w5', title: 'Resume Quality', description: 'ATS score below 80%', category: 'Career Prep' },
      { id: 'w6', title: 'Networking Skills', description: 'Limited professional network', category: 'Professional' },
      { id: 'w7', title: 'Domain Knowledge', description: 'Weak in specific industry domains', category: 'Knowledge' },
      { id: 'w8', title: 'Testing Skills', description: 'Limited experience with unit testing', category: 'Technical' }
    ],
    opportunities: [
      { id: 'o1', title: '50+ Open Internships', description: 'In target companies for summer 2024', category: 'Career' },
      { id: 'o2', title: 'Upcoming Hackathons', description: '3 major hackathons in next 2 months', category: 'Events' },
      { id: 'o3', title: 'Alumni Network', description: '200+ alumni in tech industry', category: 'Networking' },
      { id: 'o4', title: 'Free Courses', description: '10 relevant courses available on Coursera', category: 'Learning' },
      { id: 'o5', title: 'Mentorship Programs', description: '5 senior professionals offering guidance', category: 'Mentoring' },
      { id: 'o6', title: 'Campus Placements', description: '80+ companies visiting for placements', category: 'Career' },
      { id: 'o7', title: 'Industry Seminars', description: '4 tech talks scheduled this semester', category: 'Events' },
      { id: 'o8', title: 'Startup Culture', description: 'Growing startup ecosystem in city', category: 'Market' },
      { id: 'o9', title: 'Remote Opportunities', description: 'Increased remote work positions', category: 'Career' },
      { id: 'o10', title: 'Skill Development', description: 'College offering free certification courses', category: 'Learning' },
      { id: 'o11', title: 'Research Projects', description: 'Professors looking for research assistants', category: 'Academic' },
      { id: 'o12', title: 'Industry Partnerships', description: 'College tied up with 5 tech companies', category: 'Networking' },
      { id: 'o13', title: 'Freelancing', description: 'Growing demand for freelance developers', category: 'Career' },
      { id: 'o14', title: 'Tech Communities', description: 'Active local developer communities', category: 'Networking' },
      { id: 'o15', title: 'Scholarship Programs', description: 'Merit-based industry scholarships available', category: 'Financial' }
    ],
    threats: [
      { id: 't1', title: 'High Competition', description: '500+ students competing for same roles', category: 'Market' },
      { id: 't2', title: 'Skill Obsolescence', description: 'Technologies changing rapidly', category: 'Technical' },
      { id: 't3', title: 'Economic Uncertainty', description: 'Market slowdown affecting hiring', category: 'Market' },
      { id: 't4', title: 'Experience Gap', description: 'Companies prefer experienced candidates', category: 'Career' },
      { id: 't5', title: 'Time Constraints', description: 'Limited time before placement season', category: 'Timeline' }
    ]
  });

  const swotCounts = {
    strengths: swotData.strengths.length,
    weaknesses: swotData.weaknesses.length,
    opportunities: swotData.opportunities.length,
    threats: swotData.threats.length
  };

  // Resume Mock Data
  const resumeStats = {
    completeness: 78,
    atsScore: 85,
    lastUpdated: '2 days ago'
  };

  // Interview Mock Data
  const interviewStats = {
    modulesCompleted: 8,
    practiceSessions: 15,
    avgScore: 78,
    timeSpent: '12h 30m'
  };

  const interviewModules: InterviewModule[] = [
    { id: 'im1', title: 'Introduction & Basics', description: 'Learn interview fundamentals and best practices', duration: '45 min', difficulty: 'Beginner', completed: true, locked: false },
    { id: 'im2', title: 'Tell Me About Yourself', description: 'Master the art of self-introduction', duration: '30 min', difficulty: 'Beginner', completed: true, locked: false },
    { id: 'im3', title: 'Behavioral Questions', description: 'STAR method and common behavioral questions', duration: '60 min', difficulty: 'Intermediate', completed: true, locked: false },
    { id: 'im4', title: 'Technical Screening', description: 'Prepare for technical phone screens', duration: '90 min', difficulty: 'Intermediate', completed: false, locked: false },
    { id: 'im5', title: 'Coding Interviews', description: 'Live coding and problem-solving techniques', duration: '120 min', difficulty: 'Advanced', completed: false, locked: false },
    { id: 'im6', title: 'System Design', description: 'Architecture and scalability discussions', duration: '90 min', difficulty: 'Advanced', completed: false, locked: true },
    { id: 'im7', title: 'Salary Negotiation', description: 'Strategies for negotiating compensation', duration: '40 min', difficulty: 'Intermediate', completed: false, locked: true },
    { id: 'im8', title: 'Follow-up & Thank You', description: 'Post-interview communication best practices', duration: '20 min', difficulty: 'Beginner', completed: false, locked: true }
  ];

  // Opportunities Mock Data
  const opportunities: Opportunity[] = [
    { id: 'op1', companyName: 'Google', position: 'Software Engineering Intern', type: 'Internship', location: 'Bangalore, India', stipend: '₹80,000/month', matchScore: 92, tags: ['React', 'TypeScript', 'Node.js'], postedDate: '2 days ago', description: 'Work on cutting-edge web technologies with our Chrome team.' },
    { id: 'op2', companyName: 'Microsoft', position: 'Full Stack Developer', type: 'Full-time', location: 'Hyderabad, India', stipend: '₹18-22 LPA', matchScore: 88, tags: ['React', 'Azure', 'C#'], postedDate: '5 days ago', description: 'Join our cloud services team building scalable solutions.' },
    { id: 'op3', companyName: 'Amazon', position: 'SDE Intern', type: 'Internship', location: 'Bangalore, India', stipend: '₹75,000/month', matchScore: 85, tags: ['Java', 'AWS', 'Algorithms'], postedDate: '1 week ago', description: 'Build distributed systems powering millions of customers.' },
    { id: 'op4', companyName: 'Flipkart', position: 'Frontend Developer', type: 'Full-time', location: 'Bangalore, India', stipend: '₹15-18 LPA', matchScore: 90, tags: ['React', 'JavaScript', 'Redux'], postedDate: '3 days ago', description: 'Create exceptional shopping experiences for millions of users.' },
    { id: 'op5', companyName: 'Zomato', position: 'Product Intern', type: 'Internship', location: 'Gurugram, India', stipend: '₹40,000/month', matchScore: 72, tags: ['Product Management', 'Analytics'], postedDate: '4 days ago', description: 'Work with product teams on food delivery innovations.' },
    { id: 'op6', companyName: 'Swiggy', position: 'Backend Engineer', type: 'Full-time', location: 'Bangalore, India', stipend: '₹20-25 LPA', matchScore: 82, tags: ['Node.js', 'MongoDB', 'Microservices'], postedDate: '1 week ago', description: 'Build robust backend systems for food delivery platform.' },
    { id: 'op7', companyName: 'PayTM', position: 'Mobile App Developer', type: 'Part-time', location: 'Noida, India', stipend: '₹30,000/month', matchScore: 68, tags: ['React Native', 'Mobile'], postedDate: '6 days ago', description: 'Develop mobile payment solutions for millions of users.' },
    { id: 'op8', companyName: 'Infosys', position: 'Systems Engineer Trainee', type: 'Full-time', location: 'Pune, India', stipend: '₹3.6 LPA', matchScore: 65, tags: ['Java', 'SQL', 'Training'], postedDate: '2 weeks ago', description: 'Start your career with comprehensive training program.' },
    { id: 'op9', companyName: 'Razorpay', position: 'Full Stack Intern', type: 'Internship', location: 'Bangalore, India', stipend: '₹50,000/month', matchScore: 87, tags: ['React', 'Node.js', 'Payments'], postedDate: '3 days ago', description: 'Build payment solutions for modern businesses.' },
    { id: 'op10', companyName: 'Ola', position: 'Data Science Intern', type: 'Internship', location: 'Bangalore, India', stipend: '₹45,000/month', matchScore: 58, tags: ['Python', 'ML', 'Analytics'], postedDate: '1 week ago', description: 'Analyze mobility data and build predictive models.' },
    { id: 'op11', companyName: 'Adobe', position: 'UI/UX Developer', type: 'Full-time', location: 'Noida, India', stipend: '₹22-28 LPA', matchScore: 78, tags: ['React', 'Design', 'Creative Cloud'], postedDate: '4 days ago', description: 'Create beautiful user experiences for creative professionals.' },
    { id: 'op12', companyName: 'PhonePe', position: 'Backend Intern', type: 'Internship', location: 'Bangalore, India', stipend: '₹60,000/month', matchScore: 84, tags: ['Java', 'Spring Boot', 'Payments'], postedDate: '2 days ago', description: 'Work on backend systems for India\'s leading payment app.' }
  ];

  const opportunityStats = {
    totalOpportunities: opportunities.length,
    bestMatches: opportunities.filter(opp => opp.matchScore >= 80).length,
    applicationsSent: 5,
    savedOpportunities: 8
  };

  // Skill Gap Mock Data
  const skillGaps: SkillGap[] = [
    { skillName: 'React.js', currentLevel: 7, requiredLevel: 9, category: 'Technical', priority: 'High' },
    { skillName: 'TypeScript', currentLevel: 5, requiredLevel: 8, category: 'Technical', priority: 'High' },
    { skillName: 'System Design', currentLevel: 3, requiredLevel: 7, category: 'Technical', priority: 'High' },
    { skillName: 'Node.js', currentLevel: 6, requiredLevel: 8, category: 'Technical', priority: 'Medium' },
    { skillName: 'MongoDB', currentLevel: 5, requiredLevel: 7, category: 'Technical', priority: 'Medium' },
    { skillName: 'Docker', currentLevel: 3, requiredLevel: 6, category: 'Technical', priority: 'Medium' },
    { skillName: 'Communication', currentLevel: 6, requiredLevel: 9, category: 'Soft', priority: 'High' },
    { skillName: 'Leadership', currentLevel: 5, requiredLevel: 8, category: 'Soft', priority: 'Medium' },
    { skillName: 'Problem Solving', currentLevel: 7, requiredLevel: 9, category: 'Soft', priority: 'High' },
    { skillName: 'Time Management', currentLevel: 6, requiredLevel: 8, category: 'Soft', priority: 'Low' },
    { skillName: 'Agile Methodology', currentLevel: 4, requiredLevel: 7, category: 'Domain', priority: 'Medium' },
    { skillName: 'Product Development', currentLevel: 3, requiredLevel: 7, category: 'Domain', priority: 'Medium' }
  ];

  const learningResources: Course[] = [
    { id: 'c1', title: 'Advanced React Patterns', platform: 'Udemy', duration: '12 hours', level: 'Advanced', price: '₹499', rating: 4.7, reviews: 12543, addressesSkill: 'React.js' },
    { id: 'c2', title: 'TypeScript Masterclass', platform: 'Coursera', duration: '8 weeks', level: 'Intermediate', price: 'Free', rating: 4.8, reviews: 8921, addressesSkill: 'TypeScript' },
    { id: 'c3', title: 'System Design for Interviews', platform: 'educative.io', duration: '20 hours', level: 'Advanced', price: '₹2,999', rating: 4.9, reviews: 5632, addressesSkill: 'System Design' },
    { id: 'c4', title: 'Node.js Complete Guide', platform: 'Udemy', duration: '15 hours', level: 'Intermediate', price: '₹599', rating: 4.6, reviews: 15234, addressesSkill: 'Node.js' },
    { id: 'c5', title: 'MongoDB University', platform: 'MongoDB', duration: '6 weeks', level: 'Intermediate', price: 'Free', rating: 4.7, reviews: 9876, addressesSkill: 'MongoDB' },
    { id: 'c6', title: 'Docker for Developers', platform: 'Pluralsight', duration: '10 hours', level: 'Beginner', price: '₹1,499', rating: 4.5, reviews: 7654, addressesSkill: 'Docker' },
    { id: 'c7', title: 'Effective Communication Skills', platform: 'LinkedIn Learning', duration: '5 hours', level: 'Beginner', price: 'Free', rating: 4.6, reviews: 11234, addressesSkill: 'Communication' },
    { id: 'c8', title: 'Leadership Fundamentals', platform: 'Coursera', duration: '4 weeks', level: 'Intermediate', price: 'Free', rating: 4.8, reviews: 6543, addressesSkill: 'Leadership' },
    { id: 'c9', title: 'Agile & Scrum Masterclass', platform: 'Udemy', duration: '8 hours', level: 'Beginner', price: '₹399', rating: 4.7, reviews: 9234, addressesSkill: 'Agile Methodology' }
  ];

  const skillGapStats = {
    totalSkills: skillGaps.length,
    highPriority: skillGaps.filter(skill => skill.priority === 'High').length,
    technicalGaps: skillGaps.filter(skill => skill.category === 'Technical').length,
    averageProgress: Math.round(skillGaps.reduce((acc, skill) => acc + (skill.currentLevel / skill.requiredLevel) * 100, 0) / skillGaps.length)
  };

  // Mentor Mock Data
  const mentors: Mentor[] = [
    { id: 'm1', name: 'Priya Sharma', position: 'Senior Software Engineer', company: 'Google', industry: 'Technology', yearsOfExperience: 8, expertise: ['React', 'System Design', 'Leadership'], matchScore: 95, availability: 'Available', rating: 4.9, reviewCount: 127, profileImage: '👩‍💻' },
    { id: 'm2', name: 'Rahul Verma', position: 'Engineering Manager', company: 'Microsoft', industry: 'Technology', yearsOfExperience: 12, expertise: ['Node.js', 'Team Management', 'Architecture'], matchScore: 88, availability: 'Available', rating: 4.8, reviewCount: 93, profileImage: '👨‍💼' },
    { id: 'm3', name: 'Anjali Patel', position: 'Product Manager', company: 'Amazon', industry: 'E-commerce', yearsOfExperience: 6, expertise: ['Product Strategy', 'Agile', 'Analytics'], matchScore: 82, availability: 'Limited', rating: 4.7, reviewCount: 68, profileImage: '👩‍💼' },
    { id: 'm4', name: 'Vikram Singh', position: 'Tech Lead', company: 'Flipkart', industry: 'E-commerce', yearsOfExperience: 10, expertise: ['React', 'TypeScript', 'Mentoring'], matchScore: 92, availability: 'Available', rating: 4.9, reviewCount: 145, profileImage: '👨‍💻' },
    { id: 'm5', name: 'Sneha Reddy', position: 'UX Director', company: 'Adobe', industry: 'Design', yearsOfExperience: 9, expertise: ['UI/UX', 'Design Systems', 'Communication'], matchScore: 75, availability: 'Available', rating: 4.6, reviewCount: 82, profileImage: '👩‍🎨' },
    { id: 'm6', name: 'Arjun Kapoor', position: 'Data Science Lead', company: 'Ola', industry: 'Technology', yearsOfExperience: 7, expertise: ['Machine Learning', 'Python', 'Problem Solving'], matchScore: 68, availability: 'Limited', rating: 4.5, reviewCount: 56, profileImage: '👨‍🔬' },
    { id: 'm7', name: 'Meera Krishnan', position: 'Full Stack Architect', company: 'PayTM', industry: 'Fintech', yearsOfExperience: 11, expertise: ['React', 'Node.js', 'System Design'], matchScore: 90, availability: 'Available', rating: 4.8, reviewCount: 112, profileImage: '👩‍💻' },
    { id: 'm8', name: 'Karan Mehta', position: 'DevOps Engineer', company: 'Razorpay', industry: 'Fintech', yearsOfExperience: 5, expertise: ['Docker', 'AWS', 'CI/CD'], matchScore: 78, availability: 'Available', rating: 4.7, reviewCount: 74, profileImage: '👨‍🔧' },
    { id: 'm9', name: 'Divya Nair', position: 'Mobile Dev Lead', company: 'Swiggy', industry: 'Food Tech', yearsOfExperience: 8, expertise: ['React Native', 'Mobile', 'Leadership'], matchScore: 85, availability: 'Limited', rating: 4.8, reviewCount: 98, profileImage: '👩‍💻' },
    { id: 'm10', name: 'Rohan Desai', position: 'Backend Architect', company: 'Zomato', industry: 'Food Tech', yearsOfExperience: 13, expertise: ['Microservices', 'MongoDB', 'Scalability'], matchScore: 80, availability: 'Available', rating: 4.6, reviewCount: 105, profileImage: '👨‍💼' }
  ];

  const mentorStats = {
    totalMentors: mentors.length,
    bestMatches: mentors.filter(m => m.matchScore >= 85).length,
    available: mentors.filter(m => m.availability === 'Available').length,
    sessionsBooked: 12
  };

  // Alumni Mock Data
  const alumni: Alumni[] = [
    { id: 'a1', name: 'Amit Kumar', graduationYear: 2020, department: 'Computer Science', currentPosition: 'Software Engineer', currentCompany: 'Google', location: 'Bangalore', sharedInterests: ['React', 'System Design', 'Web Dev'], connectionReason: 'Works in your target company and shares technical interests', profileImage: '👨‍💻' },
    { id: 'a2', name: 'Neha Singh', graduationYear: 2019, department: 'Computer Science', currentPosition: 'Senior Developer', currentCompany: 'Microsoft', location: 'Hyderabad', sharedInterests: ['TypeScript', 'Cloud', 'Leadership'], connectionReason: 'Same department, similar career trajectory', profileImage: '👩‍💻' },
    { id: 'a3', name: 'Rajesh Iyer', graduationYear: 2018, department: 'Information Technology', currentPosition: 'Tech Lead', currentCompany: 'Amazon', location: 'Bangalore', sharedInterests: ['Node.js', 'AWS', 'Architecture'], connectionReason: 'Strong technical background in your areas of interest', profileImage: '👨‍💼' },
    { id: 'a4', name: 'Priyanka Sharma', graduationYear: 2021, department: 'Computer Science', currentPosition: 'Frontend Developer', currentCompany: 'Flipkart', location: 'Bangalore', sharedInterests: ['React', 'UI/UX', 'Product'], connectionReason: 'Recent graduate with insights on current job market', profileImage: '👩‍🎨' },
    { id: 'a5', name: 'Sanjay Gupta', graduationYear: 2017, department: 'Electronics', currentPosition: 'Product Manager', currentCompany: 'Zomato', location: 'Gurugram', sharedInterests: ['Product Strategy', 'Analytics', 'Mobile'], connectionReason: 'Transitioned from engineering to product management', profileImage: '👨‍💼' },
    { id: 'a6', name: 'Kavya Reddy', graduationYear: 2020, department: 'Computer Science', currentPosition: 'Full Stack Developer', currentCompany: 'Razorpay', location: 'Bangalore', sharedInterests: ['React', 'Node.js', 'Fintech'], connectionReason: 'Same graduation year and technical stack', profileImage: '👩‍💻' },
    { id: 'a7', name: 'Aditya Patel', graduationYear: 2019, department: 'Information Technology', currentPosition: 'DevOps Engineer', currentCompany: 'Swiggy', location: 'Bangalore', sharedInterests: ['Docker', 'CI/CD', 'Cloud'], connectionReason: 'Specialized in infrastructure and deployment', profileImage: '👨‍🔧' },
    { id: 'a8', name: 'Sneha Menon', graduationYear: 2018, department: 'Computer Science', currentPosition: 'Data Scientist', currentCompany: 'Ola', location: 'Bangalore', sharedInterests: ['Python', 'ML', 'Problem Solving'], connectionReason: 'Expert in data science and analytics', profileImage: '👩‍🔬' },
    { id: 'a9', name: 'Vikram Joshi', graduationYear: 2021, department: 'Computer Science', currentPosition: 'Backend Engineer', currentCompany: 'PhonePe', location: 'Bangalore', sharedInterests: ['Java', 'Microservices', 'Payments'], connectionReason: 'Recent grad working on cutting-edge payment tech', profileImage: '👨‍💻' },
    { id: 'a10', name: 'Ananya Das', graduationYear: 2020, department: 'Computer Science', currentPosition: 'UX Designer', currentCompany: 'Adobe', location: 'Noida', sharedInterests: ['Design', 'User Research', 'Communication'], connectionReason: 'Transitioned from CS to UX, can guide career pivots', profileImage: '👩‍🎨' }
  ];

  const alumniStats = {
    totalAlumni: alumni.length,
    sharedDepartment: alumni.filter(a => a.department === 'Computer Science').length,
    inTargetCompanies: alumni.filter(a => ['Google', 'Microsoft', 'Amazon', 'Flipkart'].includes(a.currentCompany)).length,
    connectionsMade: 8
  };

  // ==================== TAB CONTENT RENDERERS ====================

  const renderResumeBuilder = () => {
    return (
      <div className="resume-builder-container">
        {/* Stats Cards */}
        <div className="resume-stats-grid">
          <div className="resume-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{resumeStats.completeness}%</div>
              <div className="stat-label">Completeness</div>
            </div>
          </div>

          <div className="resume-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{resumeStats.atsScore}/100</div>
              <div className="stat-label">ATS Score</div>
            </div>
          </div>

          <div className="resume-stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{resumeStats.lastUpdated}</div>
              <div className="stat-label">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="resume-sub-tabs">
          <button
            className={`resume-sub-tab-btn ${activeResumeSubTab === 'build' ? 'active' : ''}`}
            onClick={() => setActiveResumeSubTab('build')}
          >
            <i className="fas fa-edit"></i>
            Build Resume
          </button>
          <button
            className={`resume-sub-tab-btn ${activeResumeSubTab === 'ats-check' ? 'active' : ''}`}
            onClick={() => setActiveResumeSubTab('ats-check')}
          >
            <i className="fas fa-search"></i>
            ATS Check
          </button>
          <button
            className={`resume-sub-tab-btn ${activeResumeSubTab === 'ai-suggestions' ? 'active' : ''}`}
            onClick={() => setActiveResumeSubTab('ai-suggestions')}
          >
            <i className="fas fa-magic"></i>
            AI Suggestions
          </button>
        </div>

        {/* Sub-Tab Content */}
        <div className="resume-sub-tab-content">
          {activeResumeSubTab === 'build' && (
            <div className="build-resume-section">
              <div className="resume-preview-section">
                <h3>Resume Preview</h3>
                <div className="resume-preview-placeholder">
                  <i className="fas fa-file-alt"></i>
                  <p>Your resume preview will appear here</p>
                  <button className="preview-btn">
                    <i className="fas fa-eye"></i>
                    Preview Full Resume
                  </button>
                </div>
              </div>

              <div className="swot-suggestions-section">
                <h3>SWOT-Based Suggestions</h3>
                <div className="suggestion-card strength-suggestion">
                  <div className="suggestion-header">
                    <i className="fas fa-trophy"></i>
                    <span>Highlight Your Strength</span>
                  </div>
                  <p>Add "{swotData.strengths[0].title}" to your skills section</p>
                </div>

                <div className="suggestion-card weakness-suggestion">
                  <div className="suggestion-header">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Improve This Area</span>
                  </div>
                  <p>Address "{swotData.weaknesses[0].title}" by adding relevant courses</p>
                </div>

                <div className="suggestion-card opportunity-suggestion">
                  <div className="suggestion-header">
                    <i className="fas fa-bullseye"></i>
                    <span>Leverage Opportunity</span>
                  </div>
                  <p>Mention your interest in "{swotData.opportunities[0].title}"</p>
                </div>
              </div>
            </div>
          )}

          {activeResumeSubTab === 'ats-check' && (
            <div className="ats-check-section">
              <div className="ats-score-display">
                <div className="ats-circular-progress">
                  <svg viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${(resumeStats.atsScore / 100) * 534} 534`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="ats-score-text">
                    <div className="ats-score-number">{resumeStats.atsScore}</div>
                    <div className="ats-score-label">ATS Score</div>
                  </div>
                </div>
                <p className="ats-description">Your resume is well-optimized for Applicant Tracking Systems</p>
              </div>

              <div className="ats-upload-section">
                <div className="upload-box">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h4>Upload Resume for Analysis</h4>
                  <p>Drag & drop your resume or click to browse</p>
                  <button className="upload-btn">
                    <i className="fas fa-upload"></i>
                    Choose File
                  </button>
                </div>
              </div>

              <div className="ats-feedback-grid">
                <div className="ats-issues-section">
                  <h4><i className="fas fa-times-circle"></i> Issues Found (2)</h4>
                  <div className="issue-card">
                    <i className="fas fa-exclamation-circle"></i>
                    <div>
                      <strong>Missing Keywords</strong>
                      <p>Add industry-specific keywords to improve matching</p>
                    </div>
                  </div>
                  <div className="issue-card">
                    <i className="fas fa-exclamation-circle"></i>
                    <div>
                      <strong>Formatting Issue</strong>
                      <p>Use standard section headings for better parsing</p>
                    </div>
                  </div>
                </div>

                <div className="ats-tips-section">
                  <h4><i className="fas fa-check-circle"></i> Optimization Tips (3)</h4>
                  <div className="tip-card">
                    <i className="fas fa-lightbulb"></i>
                    <div>
                      <strong>Great Job!</strong>
                      <p>Your contact information is clearly formatted</p>
                    </div>
                  </div>
                  <div className="tip-card">
                    <i className="fas fa-lightbulb"></i>
                    <div>
                      <strong>Well Done!</strong>
                      <p>Experience section uses strong action verbs</p>
                    </div>
                  </div>
                  <div className="tip-card">
                    <i className="fas fa-lightbulb"></i>
                    <div>
                      <strong>Excellent!</strong>
                      <p>Skills section is comprehensive and relevant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeResumeSubTab === 'ai-suggestions' && (
            <div className="ai-suggestions-section">
              <h3>Personalized AI Recommendations</h3>
              <div className="ai-suggestions-grid">
                <div className="ai-suggestion-card">
                  <div className="suggestion-type">Based on your Strengths</div>
                  <h4>Highlight Technical Skills</h4>
                  <p className="suggestion-detail">
                    Add a dedicated "Technical Skills" section featuring React, TypeScript, and Node.js prominently
                  </p>
                  <div className="suggestion-preview">
                    <strong>Before:</strong> Skills: Various technologies<br />
                    <strong>After:</strong> Technical Skills: React, TypeScript, Node.js, AWS
                  </div>
                  <button className="apply-suggestion-btn">
                    <i className="fas fa-check"></i>
                    Apply Suggestion
                  </button>
                </div>

                <div className="ai-suggestion-card">
                  <div className="suggestion-type">Based on your Weaknesses</div>
                  <h4>Add Relevant Certifications</h4>
                  <p className="suggestion-detail">
                    Include online courses or certifications to address system design knowledge gap
                  </p>
                  <div className="suggestion-preview">
                    <strong>Suggested Addition:</strong> System Design Course - Udemy (In Progress)
                  </div>
                  <button className="apply-suggestion-btn">
                    <i className="fas fa-check"></i>
                    Apply Suggestion
                  </button>
                </div>

                <div className="ai-suggestion-card">
                  <div className="suggestion-type">Based on Opportunities</div>
                  <h4>Emphasize Internship Readiness</h4>
                  <p className="suggestion-detail">
                    Mention your availability for summer 2024 internships in your objective statement
                  </p>
                  <div className="suggestion-preview">
                    <strong>Suggested Text:</strong> "Seeking summer 2024 internship opportunities to apply technical skills..."
                  </div>
                  <button className="apply-suggestion-btn">
                    <i className="fas fa-check"></i>
                    Apply Suggestion
                  </button>
                </div>
              </div>

              <div className="template-suggestions">
                <h4>Recommended Templates</h4>
                <div className="template-grid">
                  <div className="template-card">
                    <div className="template-preview">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <h5>Modern Tech</h5>
                    <p>Perfect for software engineering roles</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                  <div className="template-card">
                    <div className="template-preview">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <h5>Clean Professional</h5>
                    <p>ATS-friendly and minimal design</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                  <div className="template-card">
                    <div className="template-preview">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <h5>Creative</h5>
                    <p>Stand out with modern styling</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInterviewPrep = () => {
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedVideoURL(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Store mediaRecorder in state or ref for stopping later
        (window as any).currentMediaRecorder = mediaRecorder;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please grant permissions.');
      }
    };

    const handleStopRecording = () => {
      const mediaRecorder = (window as any).currentMediaRecorder;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    };

    return (
      <div className="interview-prep-container">
        {/* Stats Cards */}
        <div className="interview-stats-grid">
          <div className="interview-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-book-open"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{interviewStats.modulesCompleted}/12</div>
              <div className="stat-label">Modules Completed</div>
            </div>
          </div>

          <div className="interview-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-video"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{interviewStats.practiceSessions}</div>
              <div className="stat-label">Practice Sessions</div>
            </div>
          </div>

          <div className="interview-stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}>
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{interviewStats.avgScore}%</div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>

          <div className="interview-stat-card">
            <div className="stat-icon" style={{ background: '#8b5cf6' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{interviewStats.timeSpent}</div>
              <div className="stat-label">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="interview-sub-tabs">
          <button
            className={`interview-sub-tab-btn ${activeInterviewSubTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveInterviewSubTab('learn')}
          >
            <i className="fas fa-graduation-cap"></i>
            Learn
          </button>
          <button
            className={`interview-sub-tab-btn ${activeInterviewSubTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveInterviewSubTab('practice')}
          >
            <i className="fas fa-video"></i>
            Practice
          </button>
          <button
            className={`interview-sub-tab-btn ${activeInterviewSubTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveInterviewSubTab('analytics')}
          >
            <i className="fas fa-chart-line"></i>
            Analytics
          </button>
        </div>

        {/* Sub-Tab Content */}
        <div className="interview-sub-tab-content">
          {activeInterviewSubTab === 'learn' && (
            <div className="learn-section">
              <div className="section-header">
                <h3>Interview Preparation Modules</h3>
                <p>Master interview skills through structured learning modules</p>
              </div>

              <div className="modules-grid">
                {interviewModules.map((module) => (
                  <div
                    key={module.id}
                    className={`module-card ${module.locked ? 'locked' : ''} ${module.completed ? 'completed' : ''}`}
                  >
                    {module.locked && (
                      <div className="lock-overlay">
                        <i className="fas fa-lock"></i>
                      </div>
                    )}
                    <div className="module-header">
                      <h4>{module.title}</h4>
                      <span className={`difficulty-badge ${module.difficulty.toLowerCase()}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="module-description">{module.description}</p>
                    <div className="module-footer">
                      <span className="module-duration">
                        <i className="fas fa-clock"></i>
                        {module.duration}
                      </span>
                      <button
                        className="start-module-btn"
                        disabled={module.locked}
                      >
                        {module.completed ? 'Review' : module.locked ? 'Locked' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeInterviewSubTab === 'practice' && (
            <div className="practice-section">
              <div className="practice-layout">
                <div className="video-practice-area">
                  <h3>Mock Interview Practice</h3>
                  <div className="video-container">
                    {!recordedVideoURL ? (
                      <div className="video-preview">
                        <i className="fas fa-video"></i>
                        <p>{isRecording ? 'Recording in progress...' : 'Ready to start your mock interview'}</p>
                      </div>
                    ) : (
                      <video
                        src={recordedVideoURL}
                        controls
                        className="recorded-video"
                      />
                    )}
                  </div>

                  <div className="recording-controls">
                    {!isRecording && !recordedVideoURL && (
                      <button
                        className="record-btn start"
                        onClick={handleStartRecording}
                      >
                        <i className="fas fa-circle"></i>
                        Start Recording
                      </button>
                    )}
                    {isRecording && (
                      <button
                        className="record-btn stop"
                        onClick={handleStopRecording}
                      >
                        <i className="fas fa-stop"></i>
                        Stop Recording
                      </button>
                    )}
                    {recordedVideoURL && !isRecording && (
                      <>
                        <button
                          className="record-btn start"
                          onClick={() => {
                            setRecordedVideoURL(null);
                            handleStartRecording();
                          }}
                        >
                          <i className="fas fa-redo"></i>
                          Record Again
                        </button>
                        <button
                          className="analyze-btn"
                        >
                          <i className="fas fa-brain"></i>
                          Analyze Performance
                        </button>
                      </>
                    )}
                  </div>

                  <div className="question-prompt">
                    <h4><i className="fas fa-comment-dots"></i> Current Question</h4>
                    <p>"Tell me about a challenging project you worked on and how you overcame obstacles."</p>
                    <button className="next-question-btn">
                      <i className="fas fa-forward"></i>
                      Next Question
                    </button>
                  </div>
                </div>

                <div className="ai-feedback-area">
                  <h3>AI Feedback</h3>
                  <div className="feedback-scores">
                    <div className="feedback-score-card">
                      <div className="score-circle" style={{ '--score': '82' } as React.CSSProperties}>
                        <span className="score-value">82%</span>
                      </div>
                      <div className="score-label">Body Language</div>
                      <p className="score-detail">Good eye contact and posture</p>
                    </div>

                    <div className="feedback-score-card">
                      <div className="score-circle" style={{ '--score': '75' } as React.CSSProperties}>
                        <span className="score-value">75%</span>
                      </div>
                      <div className="score-label">Voice Clarity</div>
                      <p className="score-detail">Clear speech, reduce filler words</p>
                    </div>

                    <div className="feedback-score-card">
                      <div className="score-circle" style={{ '--score': '88' } as React.CSSProperties}>
                        <span className="score-value">88%</span>
                      </div>
                      <div className="score-label">Content Quality</div>
                      <p className="score-detail">Strong examples with STAR method</p>
                    </div>
                  </div>

                  <div className="detailed-feedback">
                    <h4><i className="fas fa-lightbulb"></i> Key Insights</h4>
                    <div className="insight-item positive">
                      <i className="fas fa-check-circle"></i>
                      <p>Excellent use of specific examples from your experience</p>
                    </div>
                    <div className="insight-item positive">
                      <i className="fas fa-check-circle"></i>
                      <p>Good pacing and structure in your response</p>
                    </div>
                    <div className="insight-item warning">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>Try to reduce filler words like "um" and "uh"</p>
                    </div>
                    <div className="insight-item warning">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>Make more eye contact with the camera</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeInterviewSubTab === 'analytics' && (
            <div className="analytics-section">
              <div className="analytics-header">
                <h3>Performance Analytics</h3>
                <button className="export-analytics-btn">
                  <i className="fas fa-download"></i>
                  Export Report
                </button>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Performance Trends</h4>
                  <div className="chart-placeholder">
                    <div className="trend-chart">
                      <div className="chart-bars">
                        <div className="bar" style={{ height: '60%' }}><span>Week 1</span></div>
                        <div className="bar" style={{ height: '70%' }}><span>Week 2</span></div>
                        <div className="bar" style={{ height: '65%' }}><span>Week 3</span></div>
                        <div className="bar" style={{ height: '78%' }}><span>Week 4</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Skills Breakdown</h4>
                  <div className="skills-progress">
                    <div className="skill-progress-item">
                      <div className="skill-info">
                        <span>Communication</span>
                        <span className="skill-percentage">85%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '85%', background: '#10b981' }}></div>
                      </div>
                    </div>
                    <div className="skill-progress-item">
                      <div className="skill-info">
                        <span>Technical Knowledge</span>
                        <span className="skill-percentage">78%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '78%', background: '#3b82f6' }}></div>
                      </div>
                    </div>
                    <div className="skill-progress-item">
                      <div className="skill-info">
                        <span>Problem Solving</span>
                        <span className="skill-percentage">72%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '72%', background: '#f59e0b' }}></div>
                      </div>
                    </div>
                    <div className="skill-progress-item">
                      <div className="skill-info">
                        <span>Confidence</span>
                        <span className="skill-percentage">80%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '80%', background: '#8b5cf6' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Recent Practice Sessions</h4>
                  <div className="recent-sessions">
                    <div className="session-item">
                      <div className="session-icon">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="session-info">
                        <div className="session-title">Behavioral Interview</div>
                        <div className="session-date">2 days ago</div>
                      </div>
                      <div className="session-score">82%</div>
                    </div>
                    <div className="session-item">
                      <div className="session-icon">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="session-info">
                        <div className="session-title">Technical Screening</div>
                        <div className="session-date">5 days ago</div>
                      </div>
                      <div className="session-score">75%</div>
                    </div>
                    <div className="session-item">
                      <div className="session-icon">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="session-info">
                        <div className="session-title">Tell Me About Yourself</div>
                        <div className="session-date">1 week ago</div>
                      </div>
                      <div className="session-score">88%</div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Improvement Areas</h4>
                  <div className="improvement-list">
                    <div className="improvement-item">
                      <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>
                      <div>
                        <strong>Most Improved</strong>
                        <p>Body language and confidence</p>
                      </div>
                    </div>
                    <div className="improvement-item">
                      <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                      <div>
                        <strong>Needs Focus</strong>
                        <p>Reducing filler words during responses</p>
                      </div>
                    </div>
                    <div className="improvement-item">
                      <i className="fas fa-target" style={{ color: '#3b82f6' }}></i>
                      <div>
                        <strong>Next Goal</strong>
                        <p>Complete 5 more technical interview practices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOpportunities = () => {
    // Filter and sort opportunities
    let filteredOpportunities = opportunities.filter(opp => {
      const matchesFilter = opportunityFilter === 'all' || opp.type === opportunityFilter;
      const matchesSearch = searchQuery === '' ||
        opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    // Sort opportunities
    filteredOpportunities = [...filteredOpportunities].sort((a, b) => {
      if (opportunitySort === 'match') return b.matchScore - a.matchScore;
      if (opportunitySort === 'date') return 0; // Simplified for now
      if (opportunitySort === 'stipend') return 0; // Simplified for now
      return 0;
    });

    const getMatchScoreColor = (score: number) => {
      if (score >= 80) return '#10b981';
      if (score >= 60) return '#f59e0b';
      return '#9ca3af';
    };

    return (
      <div className="opportunities-container">
        {/* Stats Cards */}
        <div className="opportunities-stats-grid">
          <div className="opportunity-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{opportunityStats.totalOpportunities}</div>
              <div className="stat-label">Total Opportunities</div>
            </div>
          </div>

          <div className="opportunity-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{opportunityStats.bestMatches}</div>
              <div className="stat-label">Best Matches (80%+)</div>
            </div>
          </div>

          <div className="opportunity-stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}>
              <i className="fas fa-paper-plane"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{opportunityStats.applicationsSent}</div>
              <div className="stat-label">Applications Sent</div>
            </div>
          </div>

          <div className="opportunity-stat-card">
            <div className="stat-icon" style={{ background: '#8b5cf6' }}>
              <i className="fas fa-bookmark"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{opportunityStats.savedOpportunities}</div>
              <div className="stat-label">Saved</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="opportunities-controls">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by company, position, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${opportunityFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOpportunityFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${opportunityFilter === 'Internship' ? 'active' : ''}`}
              onClick={() => setOpportunityFilter('Internship')}
            >
              Internships
            </button>
            <button
              className={`filter-btn ${opportunityFilter === 'Full-time' ? 'active' : ''}`}
              onClick={() => setOpportunityFilter('Full-time')}
            >
              Full-time
            </button>
            <button
              className={`filter-btn ${opportunityFilter === 'Part-time' ? 'active' : ''}`}
              onClick={() => setOpportunityFilter('Part-time')}
            >
              Part-time
            </button>
          </div>

          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={opportunitySort} onChange={(e) => setOpportunitySort(e.target.value as any)}>
              <option value="match">Match Score</option>
              <option value="date">Posted Date</option>
              <option value="stipend">Stipend</option>
            </select>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="opportunities-grid">
          {filteredOpportunities.map((opp) => (
            <div key={opp.id} className="opportunity-card">
              <div className="opportunity-header">
                <div className="company-info">
                  <div className="company-logo">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <h4>{opp.companyName}</h4>
                    <p className="position-title">{opp.position}</p>
                  </div>
                </div>
                <span className={`type-badge ${opp.type.toLowerCase().replace('-', '')}`}>
                  {opp.type}
                </span>
              </div>

              <div className="opportunity-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{opp.location}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-rupee-sign"></i>
                  <span>{opp.stipend}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>{opp.postedDate}</span>
                </div>
              </div>

              <p className="opportunity-description">{opp.description}</p>

              <div className="opportunity-tags">
                {opp.tags.map((tag, index) => (
                  <span key={index} className="skill-tag">{tag}</span>
                ))}
              </div>

              <div className="opportunity-footer">
                <div className="match-score-container">
                  <div className="match-score-circle" style={{ '--match-score': opp.matchScore, '--match-color': getMatchScoreColor(opp.matchScore) } as React.CSSProperties}>
                    <span className="match-score-value">{opp.matchScore}%</span>
                  </div>
                  <div className="match-score-label">
                    <span>SWOT Match</span>
                    <i className="fas fa-info-circle" title="Match based on your SWOT profile"></i>
                  </div>
                </div>

                <div className="opportunity-actions">
                  <button className="action-btn save-btn">
                    <i className="fas fa-bookmark"></i>
                  </button>
                  <button className="action-btn apply-btn">
                    <i className="fas fa-paper-plane"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No opportunities found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    );
  };

  const renderSkillsAnalysis = () => {
    // Filter skills based on category
    const filteredSkills = skillCategoryFilter === 'all'
      ? skillGaps
      : skillGaps.filter(skill => skill.category === skillCategoryFilter);

    // Helper function to get priority color
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'High': return '#ef4444';
        case 'Medium': return '#f59e0b';
        case 'Low': return '#10b981';
        default: return '#6b7280';
      }
    };

    // Helper function to get progress percentage
    const getProgressPercentage = (current: number, required: number) => {
      return Math.round((current / required) * 100);
    };

    return (
      <div className="skills-analysis-container">
        {/* Stats Cards */}
        <div className="skills-stats-grid">
          <div className="skill-stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' }}>
              <i className="fas fa-brain"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{skillGapStats.totalSkills}</div>
              <div className="stat-label">Total Skills</div>
            </div>
          </div>

          <div className="skill-stat-card">
            <div className="stat-icon" style={{ background: '#ef4444' }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{skillGapStats.highPriority}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>

          <div className="skill-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-code"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{skillGapStats.technicalGaps}</div>
              <div className="stat-label">Technical Skills</div>
            </div>
          </div>

          <div className="skill-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{skillGapStats.averageProgress}%</div>
              <div className="stat-label">Avg. Progress</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="skills-filter-section">
          <h3>Skill Categories</h3>
          <div className="category-filters">
            <button
              className={`category-filter-btn ${skillCategoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSkillCategoryFilter('all')}
            >
              <i className="fas fa-th"></i> All Skills
            </button>
            <button
              className={`category-filter-btn ${skillCategoryFilter === 'Technical' ? 'active' : ''}`}
              onClick={() => setSkillCategoryFilter('Technical')}
            >
              <i className="fas fa-code"></i> Technical
            </button>
            <button
              className={`category-filter-btn ${skillCategoryFilter === 'Soft' ? 'active' : ''}`}
              onClick={() => setSkillCategoryFilter('Soft')}
            >
              <i className="fas fa-users"></i> Soft Skills
            </button>
            <button
              className={`category-filter-btn ${skillCategoryFilter === 'Domain' ? 'active' : ''}`}
              onClick={() => setSkillCategoryFilter('Domain')}
            >
              <i className="fas fa-briefcase"></i> Domain
            </button>
          </div>
        </div>

        {/* Skill Gap Cards */}
        <div className="skill-gaps-grid">
          {filteredSkills.map((skill, index) => {
            const progressPercentage = getProgressPercentage(skill.currentLevel, skill.requiredLevel);
            const relatedCourses = learningResources.filter(course => course.addressesSkill === skill.skillName);

            return (
              <div key={index} className="skill-gap-card">
                <div className="skill-gap-header">
                  <div className="skill-gap-title-section">
                    <h4>{skill.skillName}</h4>
                    <span className="skill-category-badge" style={{
                      background: skill.category === 'Technical' ? '#3b82f6' :
                                 skill.category === 'Soft' ? '#8b5cf6' : '#f59e0b'
                    }}>
                      {skill.category}
                    </span>
                  </div>
                  <div className="skill-priority-badge" style={{ color: getPriorityColor(skill.priority) }}>
                    <i className="fas fa-flag"></i> {skill.priority}
                  </div>
                </div>

                <div className="skill-levels-section">
                  <div className="skill-level-item">
                    <span className="skill-level-label">Current Level</span>
                    <div className="skill-level-bar-container">
                      <div className="skill-level-bar" style={{
                        width: `${(skill.currentLevel / 10) * 100}%`,
                        background: '#10ac8b'
                      }}></div>
                    </div>
                    <span className="skill-level-value">{skill.currentLevel}/10</span>
                  </div>

                  <div className="skill-level-item">
                    <span className="skill-level-label">Required Level</span>
                    <div className="skill-level-bar-container">
                      <div className="skill-level-bar" style={{
                        width: `${(skill.requiredLevel / 10) * 100}%`,
                        background: '#094d88'
                      }}></div>
                    </div>
                    <span className="skill-level-value">{skill.requiredLevel}/10</span>
                  </div>
                </div>

                <div className="skill-progress-section">
                  <div className="progress-circle-small" style={{
                    background: `conic-gradient(
                      ${progressPercentage >= 70 ? '#10b981' : progressPercentage >= 50 ? '#f59e0b' : '#ef4444'} 0%,
                      ${progressPercentage >= 70 ? '#10b981' : progressPercentage >= 50 ? '#f59e0b' : '#ef4444'} ${progressPercentage}%,
                      #e5e7eb ${progressPercentage}%,
                      #e5e7eb 100%
                    )`
                  }}>
                    <span className="progress-value-small">{progressPercentage}%</span>
                  </div>
                  <div className="progress-text">
                    <span className="progress-label">Overall Progress</span>
                    <span className="gap-indicator">{skill.requiredLevel - skill.currentLevel} levels to go</span>
                  </div>
                </div>

                {relatedCourses.length > 0 && (
                  <div className="recommended-courses-section">
                    <h5><i className="fas fa-graduation-cap"></i> Recommended Courses</h5>
                    {relatedCourses.map(course => (
                      <div key={course.id} className="course-card-mini">
                        <div className="course-info-mini">
                          <div className="course-title-row">
                            <span className="course-title-mini">{course.title}</span>
                            <span className="course-level-badge" style={{
                              background: course.level === 'Beginner' ? '#10b981' :
                                         course.level === 'Intermediate' ? '#f59e0b' : '#ef4444'
                            }}>
                              {course.level}
                            </span>
                          </div>
                          <div className="course-meta-mini">
                            <span><i className="fas fa-desktop"></i> {course.platform}</span>
                            <span><i className="fas fa-clock"></i> {course.duration}</span>
                            <span><i className="fas fa-star"></i> {course.rating} ({course.reviews.toLocaleString()})</span>
                          </div>
                          <div className="course-price-row">
                            <span className="course-price-mini">{course.price}</span>
                            <button className="enroll-btn-mini">
                              <i className="fas fa-play-circle"></i> Start Learning
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMentorMatching = () => {
    // Filter and sort mentors
    let filteredMentors = mentors.filter(mentor =>
      mentor.name.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
      mentor.position.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(mentorSearchQuery.toLowerCase()))
    );

    // Sort mentors
    const sortedMentors = [...filteredMentors].sort((a, b) => {
      switch (mentorSort) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.yearsOfExperience - a.yearsOfExperience;
        default:
          return 0;
      }
    });

    // Helper function to get match score color
    const getMatchScoreColor = (score: number) => {
      if (score >= 85) return '#10b981';
      if (score >= 70) return '#f59e0b';
      return '#6b7280';
    };

    return (
      <div className="mentor-matching-container">
        {/* Stats Cards */}
        <div className="mentor-stats-grid">
          <div className="mentor-stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' }}>
              <i className="fas fa-user-tie"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{mentorStats.totalMentors}</div>
              <div className="stat-label">Total Mentors</div>
            </div>
          </div>

          <div className="mentor-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{mentorStats.bestMatches}</div>
              <div className="stat-label">Best Matches</div>
            </div>
          </div>

          <div className="mentor-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{mentorStats.available}</div>
              <div className="stat-label">Available Now</div>
            </div>
          </div>

          <div className="mentor-stat-card">
            <div className="stat-icon" style={{ background: '#8b5cf6' }}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{mentorStats.sessionsBooked}</div>
              <div className="stat-label">Sessions Booked</div>
            </div>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="mentor-controls">
          <div className="mentor-search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, company, or expertise..."
              value={mentorSearchQuery}
              onChange={(e) => setMentorSearchQuery(e.target.value)}
            />
          </div>

          <div className="mentor-sort-controls">
            <label>Sort by:</label>
            <select value={mentorSort} onChange={(e) => setMentorSort(e.target.value as 'match' | 'rating' | 'experience')}>
              <option value="match">Match Score</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>

        {/* Mentor Cards Grid */}
        <div className="mentors-grid">
          {sortedMentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-card-header">
                <div className="mentor-profile-section">
                  <div className="mentor-avatar">{mentor.profileImage}</div>
                  <div className="mentor-basic-info">
                    <h3>{mentor.name}</h3>
                    <p className="mentor-position">{mentor.position}</p>
                    <p className="mentor-company"><i className="fas fa-building"></i> {mentor.company}</p>
                  </div>
                </div>
                <div className="mentor-match-score" style={{
                  background: `conic-gradient(
                    ${getMatchScoreColor(mentor.matchScore)} 0%,
                    ${getMatchScoreColor(mentor.matchScore)} ${mentor.matchScore}%,
                    #e5e7eb ${mentor.matchScore}%,
                    #e5e7eb 100%
                  )`
                }}>
                  <span className="match-score-value">{mentor.matchScore}%</span>
                </div>
              </div>

              <div className="mentor-card-body">
                <div className="mentor-info-row">
                  <div className="info-item">
                    <i className="fas fa-briefcase"></i>
                    <span>{mentor.yearsOfExperience} years</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-industry"></i>
                    <span>{mentor.industry}</span>
                  </div>
                </div>

                <div className="mentor-info-row">
                  <div className="info-item">
                    <i className="fas fa-star"></i>
                    <span>{mentor.rating} ({mentor.reviewCount} reviews)</span>
                  </div>
                  <div className={`availability-badge ${mentor.availability === 'Available' ? 'available' : 'limited'}`}>
                    <i className={`fas ${mentor.availability === 'Available' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                    {mentor.availability}
                  </div>
                </div>

                <div className="mentor-expertise">
                  <h4><i className="fas fa-lightbulb"></i> Expertise</h4>
                  <div className="expertise-tags">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mentor-card-footer">
                <button className="view-profile-btn">
                  <i className="fas fa-user"></i> View Profile
                </button>
                <button className="request-session-btn">
                  <i className="fas fa-calendar-plus"></i> Request Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedMentors.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No mentors found</h3>
            <p>Try adjusting your search query</p>
          </div>
        )}
      </div>
    );
  };

  const renderAlumniConnect = () => {
    // Filter and sort alumni
    let filteredAlumni = alumni.filter(alum =>
      alum.name.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
      alum.department.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
      alum.currentCompany.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
      alum.currentPosition.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
      alum.location.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
      alum.sharedInterests.some(interest => interest.toLowerCase().includes(alumniSearchQuery.toLowerCase()))
    );

    // Sort alumni
    const sortedAlumni = [...filteredAlumni].sort((a, b) => {
      switch (alumniSort) {
        case 'year':
          return b.graduationYear - a.graduationYear;
        case 'interests':
          return b.sharedInterests.length - a.sharedInterests.length;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return (
      <div className="alumni-connect-container">
        {/* Stats Cards */}
        <div className="alumni-stats-grid">
          <div className="alumni-stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' }}>
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{alumniStats.totalAlumni}</div>
              <div className="stat-label">Total Alumni</div>
            </div>
          </div>

          <div className="alumni-stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{alumniStats.sharedDepartment}</div>
              <div className="stat-label">Same Department</div>
            </div>
          </div>

          <div className="alumni-stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{alumniStats.inTargetCompanies}</div>
              <div className="stat-label">In Target Companies</div>
            </div>
          </div>

          <div className="alumni-stat-card">
            <div className="stat-icon" style={{ background: '#8b5cf6' }}>
              <i className="fas fa-handshake"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{alumniStats.connectionsMade}</div>
              <div className="stat-label">Connections Made</div>
            </div>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="alumni-controls">
          <div className="alumni-search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, department, company, or interests..."
              value={alumniSearchQuery}
              onChange={(e) => setAlumniSearchQuery(e.target.value)}
            />
          </div>

          <div className="alumni-sort-controls">
            <label>Sort by:</label>
            <select value={alumniSort} onChange={(e) => setAlumniSort(e.target.value as 'year' | 'interests' | 'location')}>
              <option value="year">Graduation Year</option>
              <option value="interests">Shared Interests</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>

        {/* Alumni Cards Grid */}
        <div className="alumni-grid">
          {sortedAlumni.map((alum) => (
            <div key={alum.id} className="alumni-card">
              <div className="alumni-card-header">
                <div className="alumni-profile-section">
                  <div className="alumni-avatar">{alum.profileImage}</div>
                  <div className="alumni-basic-info">
                    <h3>{alum.name}</h3>
                    <p className="alumni-grad-info">
                      <i className="fas fa-graduation-cap"></i> {alum.department} • Class of {alum.graduationYear}
                    </p>
                  </div>
                </div>
                <div className="alumni-year-badge">
                  '{alum.graduationYear.toString().slice(-2)}
                </div>
              </div>

              <div className="alumni-card-body">
                <div className="alumni-current-role">
                  <i className="fas fa-briefcase"></i>
                  <div>
                    <p className="role-title">{alum.currentPosition}</p>
                    <p className="role-company">{alum.currentCompany}</p>
                  </div>
                </div>

                <div className="alumni-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{alum.location}</span>
                </div>

                <div className="connection-reason">
                  <div className="reason-header">
                    <i className="fas fa-lightbulb"></i>
                    <span>Why Connect</span>
                  </div>
                  <p>{alum.connectionReason}</p>
                </div>

                <div className="shared-interests-section">
                  <h4><i className="fas fa-star"></i> Shared Interests</h4>
                  <div className="shared-interests-tags">
                    {alum.sharedInterests.map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="alumni-card-footer">
                <button className="connect-btn">
                  <i className="fas fa-user-plus"></i> Connect
                </button>
                <button className="message-btn">
                  <i className="fas fa-comment-dots"></i> Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedAlumni.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No alumni found</h3>
            <p>Try adjusting your search query</p>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER ====================

  return (
    <>
      {/* Header */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-rocket" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Career Readiness Platform
            </h1>
            <p>AI-powered career development tailored to your SWOT profile</p>
          </div>
          <button className="export-btn">
            <i className="fas fa-download"></i>
            Export Career Report
          </button>
        </div>
      </div>

      {/* SWOT Dashboard */}
      <div className="swot-dashboard">
        <div className="swot-card strengths">
          <div className="swot-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="swot-content">
            <div className="swot-count">{swotCounts.strengths}</div>
            <div className="swot-label">Strengths</div>
            <div className="swot-sublabel">Identified</div>
          </div>
        </div>

        <div className="swot-card weaknesses">
          <div className="swot-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="swot-content">
            <div className="swot-count">{swotCounts.weaknesses}</div>
            <div className="swot-label">Weaknesses</div>
            <div className="swot-sublabel">Areas to Improve</div>
          </div>
        </div>

        <div className="swot-card opportunities">
          <div className="swot-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="swot-content">
            <div className="swot-count">{swotCounts.opportunities}</div>
            <div className="swot-label">Opportunities</div>
            <div className="swot-sublabel">Available</div>
          </div>
        </div>

        <div className="swot-card threats">
          <div className="swot-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="swot-content">
            <div className="swot-count">{swotCounts.threats}</div>
            <div className="swot-label">Threats</div>
            <div className="swot-sublabel">To Address</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          <i className="fas fa-file-alt"></i>
          <span>Resume Builder</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          <i className="fas fa-microphone"></i>
          <span>Interview Prep</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          <i className="fas fa-briefcase"></i>
          <span>Opportunities</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <i className="fas fa-chart-bar"></i>
          <span>Skills Analysis</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentors')}
        >
          <i className="fas fa-user-tie"></i>
          <span>Mentors</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'alumni' ? 'active' : ''}`}
          onClick={() => setActiveTab('alumni')}
        >
          <i className="fas fa-users"></i>
          <span>Alumni Network</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {activeTab === 'resume' && renderResumeBuilder()}
        {activeTab === 'interview' && renderInterviewPrep()}
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'skills' && renderSkillsAnalysis()}
        {activeTab === 'mentors' && renderMentorMatching()}
        {activeTab === 'alumni' && renderAlumniConnect()}
      </div>
    </>
  );
};

export default CareerReadiness;
