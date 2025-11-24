import type { StudyResource, TestTemplate } from '../types/curriculum.types';

/**
 * TN Board 10th Standard Study Resources
 * All study materials linked to curriculum topics
 */

export const TN_BOARD_10TH_STUDY_RESOURCES: StudyResource[] = [
  // Mathematics Resources
  {
    id: '1',
    title: 'Relations and Functions - Complete Notes',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u1'],
    topicIds: ['t1', 't2', 't3'],
    type: 'pdf',
    size: '2.8 MB',
    uploadedBy: 'Mr. Karthik Subramanian',
    uploadDate: '2024-12-10',
    downloads: 312,
    description: 'Comprehensive notes on relations, functions, and composition of functions for TN Board 10th Std'
  },
  {
    id: '2',
    title: 'Trigonometry Practice Problems Set',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u4'],
    topicIds: ['t9'],
    type: 'pdf',
    size: '1.9 MB',
    uploadedBy: 'Mrs. Priya Raman',
    uploadDate: '2024-12-08',
    downloads: 289,
    description: '100+ practice problems on trigonometric identities, heights and distances with solutions'
  },
  {
    id: '3',
    title: 'Coordinate Geometry Video Lessons',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u4'],
    topicIds: ['t8'],
    type: 'video',
    size: '385 MB',
    uploadedBy: 'Prof. Venkatesh Kumar',
    uploadDate: '2024-12-05',
    downloads: 245,
    description: 'Video series covering straight lines, circles, and parabola with solved examples'
  },
  {
    id: '4',
    title: 'TN Board Mathematics Previous Year Papers (2019-2024)',
    subject: 'Mathematics',
    subjectId: '1',
    type: 'document',
    size: '4.2 MB',
    uploadedBy: 'Mr. Arjun Krishnan',
    uploadDate: '2024-12-01',
    downloads: 456,
    description: 'Collection of last 5 years Board exam question papers with answer keys'
  },

  // Science Resources
  {
    id: '5',
    title: 'Physics - Laws of Motion Study Notes',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u6'],
    topicIds: ['t12', 't13', 't14'],
    type: 'pdf',
    size: '3.1 MB',
    uploadedBy: 'Dr. Lakshmi Narayanan',
    uploadDate: '2024-12-09',
    downloads: 267,
    description: 'Detailed notes on Newton\'s laws, force, momentum, and uniform circular motion'
  },
  {
    id: '6',
    title: 'Chemistry - Periodic Classification Mind Maps',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u10'],
    topicIds: ['t21', 't22'],
    type: 'notes',
    size: '1.5 MB',
    uploadedBy: 'Mrs. Sangeetha Mohan',
    uploadDate: '2024-12-07',
    downloads: 234,
    description: 'Visual mind maps for Periodic Table trends and modern periodic law'
  },
  {
    id: '7',
    title: 'Biology - Reproduction Chapter Video Series',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u14'],
    topicIds: ['t29', 't30'],
    type: 'video',
    size: '420 MB',
    uploadedBy: 'Dr. Ramesh Babu',
    uploadDate: '2024-12-04',
    downloads: 298,
    description: 'Complete video series on asexual and sexual reproduction with diagrams'
  },
  {
    id: '8',
    title: 'Science Lab Manual - All Experiments',
    subject: 'Science',
    subjectId: '2',
    type: 'document',
    size: '6.3 MB',
    uploadedBy: 'Mrs. Divya Prakash',
    uploadDate: '2024-11-30',
    downloads: 378,
    description: 'Complete lab manual with procedures for all Physics, Chemistry, and Biology practicals'
  },
  {
    id: '9',
    title: 'Thermal Physics Numerical Problems',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u9'],
    topicIds: ['t19', 't20'],
    type: 'pdf',
    size: '2.1 MB',
    uploadedBy: 'Mr. Suresh Kumar',
    uploadDate: '2024-11-28',
    downloads: 189,
    description: '50 solved numerical problems on heat transfer and specific heat capacity'
  },

  // Tamil Resources
  {
    id: '10',
    title: 'தமிழ் இலக்கணம் (Grammar) Complete Guide',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u15'],
    topicIds: ['t31', 't32', 't33'],
    type: 'pdf',
    size: '3.5 MB',
    uploadedBy: 'திரு. முருகேசன்',
    uploadDate: '2024-12-06',
    downloads: 324,
    description: 'எழுத்து, சொல், பொருள் - Complete grammar guide with examples'
  },
  {
    id: '11',
    title: 'திருக்குறள் (Thirukkural) Commentary',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u16'],
    topicIds: ['t34'],
    type: 'document',
    size: '2.7 MB',
    uploadedBy: 'திருமதி. கமலா',
    uploadDate: '2024-12-03',
    downloads: 256,
    description: 'Detailed commentary on selected Thirukkural verses with meanings'
  },
  {
    id: '12',
    title: 'பாரதியார் பாடல்கள் (Bharathiyar Songs) Analysis',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u18'],
    topicIds: ['t38'],
    type: 'notes',
    size: '1.8 MB',
    uploadedBy: 'திரு. சிவகுமார்',
    uploadDate: '2024-11-29',
    downloads: 198,
    description: 'Analysis of Bharathiyar\'s patriotic songs with literary devices'
  },

  // English Resources
  {
    id: '13',
    title: 'English Prose and Poetry Analysis',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u20', 'u21'],
    topicIds: ['t42', 't43', 't44'],
    type: 'pdf',
    size: '2.9 MB',
    uploadedBy: 'Mrs. Jennifer Thomas',
    uploadDate: '2024-12-07',
    downloads: 287,
    description: 'Detailed analysis of "Two Gentlemen of Verona", "The Grumble Family" and other texts'
  },
  {
    id: '14',
    title: 'Grammar and Composition Practice Book',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u23'],
    topicIds: ['t48', 't49', 't50'],
    type: 'document',
    size: '3.4 MB',
    uploadedBy: 'Mr. David Raj',
    uploadDate: '2024-12-02',
    downloads: 245,
    description: 'Comprehensive practice on tenses, voice, reported speech, and sentence patterns'
  },
  {
    id: '15',
    title: 'English Writing Skills Workshop',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u24'],
    topicIds: ['t51', 't52', 't53'],
    type: 'video',
    size: '295 MB',
    uploadedBy: 'Ms. Reshma Menon',
    uploadDate: '2024-11-27',
    downloads: 178,
    description: 'Video workshop on letter writing, essay writing, and paragraph construction'
  },

  // Social Science Resources
  {
    id: '16',
    title: 'Indian Freedom Struggle Timeline',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u26'],
    topicIds: ['t56', 't57', 't58'],
    type: 'notes',
    size: '2.2 MB',
    uploadedBy: 'Mr. Vijay Shankar',
    uploadDate: '2024-12-05',
    downloads: 267,
    description: 'Complete timeline of Indian Independence Movement with key events and leaders'
  },
  {
    id: '17',
    title: 'Geography - India Map Practice Workbook',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u28', 'u29'],
    topicIds: ['t61', 't62', 't63', 't64'],
    type: 'pdf',
    size: '4.8 MB',
    uploadedBy: 'Mrs. Meena Sundaram',
    uploadDate: '2024-12-01',
    downloads: 298,
    description: 'Map practice for physiographic divisions, rivers, mountains, and agricultural regions'
  },
  {
    id: '18',
    title: 'Civics - Democratic Politics Video Lectures',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u30', 'u32'],
    topicIds: ['t66', 't67', 't68', 't72', 't73'],
    type: 'video',
    size: '340 MB',
    uploadedBy: 'Dr. Anand Krishnan',
    uploadDate: '2024-11-26',
    downloads: 234,
    description: 'Video lectures on power sharing, federalism, and democracy concepts'
  },
  {
    id: '19',
    title: 'Economics - Development and Sectors Study Guide',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u31'],
    topicIds: ['t69', 't70', 't71'],
    type: 'document',
    size: '2.6 MB',
    uploadedBy: 'Mr. Raghavan Iyer',
    uploadDate: '2024-11-25',
    downloads: 189,
    description: 'Comprehensive guide on economic development and sectors of economy'
  },

  // General Board Exam Prep
  {
    id: '20',
    title: 'TN Board Exam Pattern & Marking Scheme 2025',
    subject: 'General',
    subjectId: '',
    type: 'pdf',
    size: '1.2 MB',
    uploadedBy: 'Directorate of Education, TN',
    uploadDate: '2024-12-12',
    downloads: 523,
    description: 'Official exam pattern, marking scheme, and instructions for 2025 Board exams'
  },
  {
    id: '21',
    title: 'Study Tips for Board Exams',
    subject: 'General',
    subjectId: '',
    type: 'link',
    size: 'Online',
    uploadedBy: 'EdTech Tamil Nadu',
    uploadDate: '2024-12-10',
    downloads: 412,
    description: 'Expert tips and strategies for effective preparation and time management'
  }
];

/**
 * TN Board 10th Standard Test Templates
 * Sample tests and assessments linked to curriculum
 */

export const TN_BOARD_10TH_TEST_TEMPLATES: TestTemplate[] = [
  // Mathematics Tests
  {
    id: '1',
    title: 'Relations and Functions Quiz',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u1'],
    topicIds: ['t1', 't2'],
    type: 'quiz',
    status: 'completed',
    date: '2024-12-01',
    time: '9:00 AM',
    duration: '45 minutes',
    totalMarks: 25,
    obtainedMarks: 23,
    questions: 10,
    teacher: 'Mr. Karthik Subramanian',
    description: 'Assessment on relations, functions, and composition of functions',
    passingMarks: 10,
    questionDistribution: {
      mcq: 40,
      shortAnswer: 40,
      longAnswer: 20
    }
  },
  {
    id: '2',
    title: 'Trigonometry Unit Test',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u4'],
    topicIds: ['t9'],
    type: 'midterm',
    status: 'completed',
    date: '2024-11-10',
    time: '10:00 AM',
    duration: '90 minutes',
    totalMarks: 50,
    obtainedMarks: 46,
    questions: 20,
    teacher: 'Mr. Karthik Subramanian',
    description: 'Comprehensive test on trigonometric identities, heights and distances',
    passingMarks: 20,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 40,
      longAnswer: 30
    }
  },
  {
    id: '3',
    title: 'Coordinate Geometry Assessment',
    subject: 'Mathematics',
    subjectId: '1',
    unitIds: ['u4'],
    topicIds: ['t8'],
    type: 'quiz',
    status: 'upcoming',
    date: '2024-12-18',
    time: '9:00 AM',
    duration: '60 minutes',
    totalMarks: 30,
    questions: 15,
    teacher: 'Mr. Karthik Subramanian',
    description: 'Test covering straight lines, circles, and parabola',
    passingMarks: 12,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 50,
      longAnswer: 20
    }
  },
  {
    id: '4',
    title: 'Mathematics Board Mock Exam',
    subject: 'Mathematics',
    subjectId: '1',
    type: 'final',
    status: 'upcoming',
    date: '2025-01-10',
    time: '10:00 AM',
    duration: '3 hours',
    totalMarks: 100,
    questions: 40,
    teacher: 'Mr. Karthik Subramanian',
    description: 'Full-length mock test for TN Board Mathematics exam covering all chapters',
    passingMarks: 35,
    questionDistribution: {
      mcq: 20,
      shortAnswer: 40,
      longAnswer: 40
    }
  },

  // Science Tests
  {
    id: '5',
    title: 'Physics - Laws of Motion Quiz',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u6'],
    topicIds: ['t12', 't13'],
    type: 'quiz',
    status: 'completed',
    date: '2024-12-01',
    time: '11:00 AM',
    duration: '45 minutes',
    totalMarks: 20,
    obtainedMarks: 18,
    questions: 10,
    teacher: 'Dr. Lakshmi Narayanan',
    description: 'Quick assessment on Newton\'s laws and applications',
    passingMarks: 8,
    questionDistribution: {
      mcq: 50,
      shortAnswer: 30,
      longAnswer: 20
    }
  },
  {
    id: '6',
    title: 'Chemistry - Periodic Table Test',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u10'],
    topicIds: ['t21', 't22'],
    type: 'midterm',
    status: 'completed',
    date: '2024-11-24',
    time: '2:00 PM',
    duration: '75 minutes',
    totalMarks: 35,
    obtainedMarks: 31,
    questions: 15,
    teacher: 'Mrs. Sangeetha Mohan',
    description: 'Test on Periodic classification and trends',
    passingMarks: 14,
    questionDistribution: {
      mcq: 40,
      shortAnswer: 35,
      longAnswer: 25
    }
  },
  {
    id: '7',
    title: 'Biology - Reproduction Chapter Test',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u14'],
    topicIds: ['t29'],
    type: 'quiz',
    status: 'completed',
    date: '2024-11-17',
    time: '1:00 PM',
    duration: '60 minutes',
    totalMarks: 30,
    obtainedMarks: 28,
    questions: 12,
    teacher: 'Dr. Ramesh Babu',
    description: 'Assessment on asexual and sexual reproduction',
    passingMarks: 12,
    questionDistribution: {
      mcq: 35,
      shortAnswer: 40,
      longAnswer: 25
    }
  },
  {
    id: '8',
    title: 'Science Practical Exam',
    subject: 'Science',
    subjectId: '2',
    type: 'assignment',
    status: 'upcoming',
    date: '2024-12-20',
    time: '9:00 AM',
    duration: '3 hours',
    totalMarks: 30,
    questions: 3,
    teacher: 'Dr. Lakshmi Narayanan',
    description: 'Practical examination covering Physics, Chemistry, and Biology experiments',
    passingMarks: 12,
    questionDistribution: {
      practical: 100
    }
  },
  {
    id: '9',
    title: 'Thermal Physics Practice Test',
    subject: 'Science',
    subjectId: '2',
    unitIds: ['u9'],
    topicIds: ['t19', 't20'],
    type: 'practice',
    status: 'upcoming',
    date: '2024-12-16',
    time: '3:00 PM',
    duration: '45 minutes',
    totalMarks: 25,
    questions: 10,
    teacher: 'Mr. Suresh Kumar',
    description: 'Practice problems on heat transfer and specific heat capacity',
    passingMarks: 10,
    questionDistribution: {
      mcq: 40,
      shortAnswer: 60
    }
  },

  // Tamil Tests
  {
    id: '10',
    title: 'தமிழ் இலக்கணம் (Grammar) Test',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u15'],
    topicIds: ['t31', 't32', 't33'],
    type: 'quiz',
    status: 'completed',
    date: '2024-12-06',
    time: '10:00 AM',
    duration: '60 minutes',
    totalMarks: 25,
    obtainedMarks: 22,
    questions: 15,
    teacher: 'திரு. முருகேசன்',
    description: 'Assessment on எழுத்து, சொல், and பொருள்',
    passingMarks: 10,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 50,
      longAnswer: 20
    }
  },
  {
    id: '11',
    title: 'திருக்குறள் (Thirukkural) Analysis Test',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u16'],
    topicIds: ['t34'],
    type: 'midterm',
    status: 'completed',
    date: '2024-11-25',
    time: '11:00 AM',
    duration: '90 minutes',
    totalMarks: 40,
    obtainedMarks: 34,
    questions: 20,
    teacher: 'திருமதி. கமலா',
    description: 'Detailed assessment on selected Thirukkural verses',
    passingMarks: 16,
    questionDistribution: {
      mcq: 25,
      shortAnswer: 40,
      longAnswer: 35
    }
  },
  {
    id: '12',
    title: 'செய்யுள் (Poetry) Assessment',
    subject: 'Tamil',
    subjectId: '3',
    unitIds: ['u18'],
    topicIds: ['t38', 't39'],
    type: 'practice',
    status: 'upcoming',
    date: '2024-12-21',
    time: '2:00 PM',
    duration: '60 minutes',
    totalMarks: 30,
    questions: 12,
    teacher: 'திரு. சிவகுமார்',
    description: 'Practice test on Bharathiyar songs and folk poetry',
    passingMarks: 12,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 45,
      longAnswer: 25
    }
  },

  // English Tests
  {
    id: '13',
    title: 'Prose and Poetry Quiz',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u20', 'u21'],
    topicIds: ['t42', 't43'],
    type: 'quiz',
    status: 'completed',
    date: '2024-12-01',
    time: '1:00 PM',
    duration: '45 minutes',
    totalMarks: 20,
    obtainedMarks: 16,
    questions: 10,
    teacher: 'Mrs. Jennifer Thomas',
    description: 'Assessment on "Two Gentlemen of Verona" and "The Grumble Family"',
    passingMarks: 8,
    questionDistribution: {
      mcq: 50,
      shortAnswer: 50
    }
  },
  {
    id: '14',
    title: 'Grammar and Composition Test',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u23'],
    topicIds: ['t48', 't49', 't50'],
    type: 'midterm',
    status: 'completed',
    date: '2024-11-24',
    time: '10:00 AM',
    duration: '75 minutes',
    totalMarks: 35,
    obtainedMarks: 29,
    questions: 15,
    teacher: 'Mr. David Raj',
    description: 'Comprehensive test on tenses, voice, reported speech, and sentence patterns',
    passingMarks: 14,
    questionDistribution: {
      mcq: 35,
      shortAnswer: 40,
      longAnswer: 25
    }
  },
  {
    id: '15',
    title: 'Supplementary Reading Assessment',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u22'],
    topicIds: ['t46', 't47'],
    type: 'quiz',
    status: 'completed',
    date: '2024-11-17',
    time: '2:00 PM',
    duration: '60 minutes',
    totalMarks: 30,
    obtainedMarks: 26,
    questions: 12,
    teacher: 'Mrs. Jennifer Thomas',
    description: 'Test on "After Twenty Years" and "The Tempest" drama',
    passingMarks: 12,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 40,
      longAnswer: 30
    }
  },
  {
    id: '16',
    title: 'English Writing Skills Practice',
    subject: 'English',
    subjectId: '4',
    unitIds: ['u24'],
    topicIds: ['t51', 't52', 't53'],
    type: 'practice',
    status: 'upcoming',
    date: '2024-12-20',
    time: '1:00 PM',
    duration: '90 minutes',
    totalMarks: 40,
    questions: 5,
    teacher: 'Ms. Reshma Menon',
    description: 'Practice test on letter writing, essay writing, and paragraph construction',
    passingMarks: 16,
    questionDistribution: {
      longAnswer: 60,
      practical: 40
    }
  },

  // Social Science Tests
  {
    id: '17',
    title: 'History - Freedom Struggle Test',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u26'],
    topicIds: ['t56', 't57', 't58'],
    type: 'quiz',
    status: 'completed',
    date: '2024-12-05',
    time: '9:00 AM',
    duration: '60 minutes',
    totalMarks: 25,
    obtainedMarks: 22,
    questions: 12,
    teacher: 'Mr. Vijay Shankar',
    description: 'Assessment on Indian Independence Movement and nationalism',
    passingMarks: 10,
    questionDistribution: {
      mcq: 30,
      shortAnswer: 45,
      longAnswer: 25
    }
  },
  {
    id: '18',
    title: 'Geography Unit Test',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u28', 'u29'],
    topicIds: ['t61', 't62', 't63', 't64'],
    type: 'midterm',
    status: 'completed',
    date: '2024-11-24',
    time: '11:00 AM',
    duration: '90 minutes',
    totalMarks: 40,
    obtainedMarks: 34,
    questions: 18,
    teacher: 'Mrs. Meena Sundaram',
    description: 'Test on physiographic divisions, resources, and water management',
    passingMarks: 16,
    questionDistribution: {
      mcq: 25,
      shortAnswer: 40,
      longAnswer: 20,
      practical: 15
    }
  },
  {
    id: '19',
    title: 'Civics - Democratic Politics Quiz',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u30'],
    topicIds: ['t66', 't67', 't68'],
    type: 'quiz',
    status: 'completed',
    date: '2024-11-17',
    time: '2:00 PM',
    duration: '45 minutes',
    totalMarks: 20,
    obtainedMarks: 18,
    questions: 10,
    teacher: 'Dr. Anand Krishnan',
    description: 'Quick assessment on power sharing and federalism',
    passingMarks: 8,
    questionDistribution: {
      mcq: 50,
      shortAnswer: 50
    }
  },
  {
    id: '20',
    title: 'Map Work Practice Test',
    subject: 'Social Science',
    subjectId: '5',
    unitIds: ['u29'],
    topicIds: ['t63', 't64'],
    type: 'practice',
    status: 'upcoming',
    date: '2024-12-17',
    time: '10:00 AM',
    duration: '60 minutes',
    totalMarks: 20,
    questions: 10,
    teacher: 'Mrs. Meena Sundaram',
    description: 'Practice test on marking rivers, mountains, and agricultural regions of India',
    passingMarks: 8,
    questionDistribution: {
      practical: 100
    }
  },

  // Board Exam Preparation
  {
    id: '21',
    title: 'Full Board Mock Examination - All Subjects',
    subject: 'General',
    subjectId: '',
    type: 'final',
    status: 'upcoming',
    date: '2025-02-05',
    time: '9:00 AM',
    duration: '5 days',
    totalMarks: 500,
    questions: 200,
    teacher: 'All Teachers',
    description: 'Complete mock examination simulating actual TN Board 10th Standard exams for all 5 subjects',
    passingMarks: 175,
    questionDistribution: {
      mcq: 25,
      shortAnswer: 40,
      longAnswer: 30,
      practical: 5
    }
  }
];

// Helper functions for resources
export const getResourcesBySubject = (subjectId: string) => {
  return TN_BOARD_10TH_STUDY_RESOURCES.filter(resource => resource.subjectId === subjectId);
};

export const getResourcesByUnit = (subjectId: string, unitId: string) => {
  return TN_BOARD_10TH_STUDY_RESOURCES.filter(
    resource => resource.subjectId === subjectId && resource.unitIds?.includes(unitId)
  );
};

export const getResourcesByTopic = (topicId: string) => {
  return TN_BOARD_10TH_STUDY_RESOURCES.filter(
    resource => resource.topicIds?.includes(topicId)
  );
};

export const getResourcesByType = (type: 'pdf' | 'video' | 'document' | 'link' | 'notes') => {
  return TN_BOARD_10TH_STUDY_RESOURCES.filter(resource => resource.type === type);
};

// Helper functions for tests
export const getTestsBySubject = (subjectId: string) => {
  return TN_BOARD_10TH_TEST_TEMPLATES.filter(test => test.subjectId === subjectId);
};

export const getTestsByStatus = (status: 'upcoming' | 'live' | 'completed' | 'missed') => {
  return TN_BOARD_10TH_TEST_TEMPLATES.filter(test => test.status === status);
};

export const getTestsByType = (type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'practice') => {
  return TN_BOARD_10TH_TEST_TEMPLATES.filter(test => test.type === type);
};

export const getTestsByUnit = (subjectId: string, unitId: string) => {
  return TN_BOARD_10TH_TEST_TEMPLATES.filter(
    test => test.subjectId === subjectId && test.unitIds?.includes(unitId)
  );
};
