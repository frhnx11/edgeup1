/**
 * College Study Resources
 * Curated resources for various engineering subjects
 * Last Updated: December 2024
 */

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'pdf' | 'interactive' | 'research-paper';
  subject: string;
  topic: string;
  url: string;
  description: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  source: string;
  tags: string[];
}

export const COLLEGE_RESOURCES: Resource[] = [
  // Computer Science Resources
  {
    id: 'cs1',
    title: 'Introduction to Data Structures',
    type: 'video',
    subject: 'Data Structures',
    topic: 'Arrays and Linked Lists',
    url: 'https://www.youtube.com/watch?v=example',
    description: 'Comprehensive tutorial on linear data structures',
    duration: '45 min',
    difficulty: 'beginner',
    source: 'MIT OpenCourseWare',
    tags: ['arrays', 'linked lists', 'fundamentals']
  },
  {
    id: 'cs2',
    title: 'Tree Data Structures Explained',
    type: 'article',
    subject: 'Data Structures',
    topic: 'Trees',
    url: 'https://www.geeksforgeeks.org/tree-data-structure',
    description: 'Detailed explanation of tree data structures and traversals',
    difficulty: 'intermediate',
    source: 'GeeksforGeeks',
    tags: ['trees', 'BST', 'traversals']
  },
  {
    id: 'cs3',
    title: 'Algorithm Design Manual',
    type: 'pdf',
    subject: 'Algorithms',
    topic: 'Algorithm Analysis',
    url: 'https://example.com/algorithm-manual.pdf',
    description: 'Comprehensive guide to algorithm design and analysis',
    difficulty: 'advanced',
    source: 'Academic Press',
    tags: ['algorithms', 'complexity', 'design patterns']
  },

  // Mathematics Resources
  {
    id: 'math1',
    title: 'Linear Algebra - MIT Course',
    type: 'video',
    subject: 'Linear Algebra',
    topic: 'Vector Spaces',
    url: 'https://ocw.mit.edu/courses/mathematics',
    description: 'Gilbert Strang\'s famous linear algebra lectures',
    duration: '50 min',
    difficulty: 'intermediate',
    source: 'MIT OpenCourseWare',
    tags: ['vectors', 'matrices', 'linear algebra']
  },
  {
    id: 'math2',
    title: 'Calculus for Engineers',
    type: 'pdf',
    subject: 'Calculus',
    topic: 'Differential Equations',
    url: 'https://example.com/calculus-engineers.pdf',
    description: 'Applied calculus for engineering students',
    difficulty: 'intermediate',
    source: 'Engineering Publications',
    tags: ['calculus', 'differential equations', 'applications']
  },

  // Electronics Resources
  {
    id: 'ece1',
    title: 'Digital Logic Design',
    type: 'interactive',
    subject: 'Digital Electronics',
    topic: 'Boolean Algebra',
    url: 'https://www.electronics-tutorials.ws/',
    description: 'Interactive simulations for digital circuits',
    difficulty: 'beginner',
    source: 'Electronics Tutorials',
    tags: ['digital logic', 'gates', 'circuits']
  },
  {
    id: 'ece2',
    title: 'VLSI Design Principles',
    type: 'research-paper',
    subject: 'VLSI',
    topic: 'Circuit Design',
    url: 'https://ieeexplore.ieee.org/example',
    description: 'Advanced VLSI design techniques',
    difficulty: 'advanced',
    source: 'IEEE Xplore',
    tags: ['VLSI', 'circuits', 'design']
  },

  // Database Resources
  {
    id: 'db1',
    title: 'SQL Tutorial for Beginners',
    type: 'video',
    subject: 'Database Systems',
    topic: 'SQL Basics',
    url: 'https://www.youtube.com/watch?v=sql-tutorial',
    description: 'Complete SQL tutorial from basics to advanced',
    duration: '2 hours',
    difficulty: 'beginner',
    source: 'Programming with Mosh',
    tags: ['SQL', 'database', 'queries']
  },
  {
    id: 'db2',
    title: 'Database Normalization Guide',
    type: 'article',
    subject: 'Database Systems',
    topic: 'Normalization',
    url: 'https://www.studytonight.com/dbms/database-normalization',
    description: 'Step-by-step guide to database normalization',
    difficulty: 'intermediate',
    source: 'StudyTonight',
    tags: ['normalization', '3NF', 'BCNF', 'database design']
  },

  // Operating Systems Resources
  {
    id: 'os1',
    title: 'Operating System Concepts',
    type: 'pdf',
    subject: 'Operating Systems',
    topic: 'Process Management',
    url: 'https://example.com/os-concepts.pdf',
    description: 'Dinosaur book - Classic OS textbook',
    difficulty: 'intermediate',
    source: 'Wiley Publications',
    tags: ['OS', 'processes', 'threads', 'scheduling']
  },
  {
    id: 'os2',
    title: 'Linux Kernel Development',
    type: 'article',
    subject: 'Operating Systems',
    topic: 'Kernel Architecture',
    url: 'https://www.kernel.org/doc/',
    description: 'In-depth guide to Linux kernel internals',
    difficulty: 'advanced',
    source: 'Linux Foundation',
    tags: ['Linux', 'kernel', 'system programming']
  },

  // Web Development Resources
  {
    id: 'web1',
    title: 'Complete Web Development Bootcamp',
    type: 'video',
    subject: 'Web Technologies',
    topic: 'Full Stack Development',
    url: 'https://www.udemy.com/web-bootcamp',
    description: 'From HTML to deployment - complete web dev course',
    duration: '50 hours',
    difficulty: 'beginner',
    source: 'Udemy',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
  },
  {
    id: 'web2',
    title: 'React Documentation',
    type: 'article',
    subject: 'Web Technologies',
    topic: 'React Framework',
    url: 'https://react.dev',
    description: 'Official React documentation and tutorials',
    difficulty: 'intermediate',
    source: 'Meta',
    tags: ['React', 'hooks', 'components', 'state management']
  },

  // Mechanical Engineering Resources
  {
    id: 'mech1',
    title: 'Thermodynamics Fundamentals',
    type: 'video',
    subject: 'Thermodynamics',
    topic: 'Laws of Thermodynamics',
    url: 'https://www.youtube.com/thermodynamics',
    description: 'Complete thermodynamics course for engineers',
    duration: '3 hours',
    difficulty: 'intermediate',
    source: 'NPTEL',
    tags: ['thermodynamics', 'heat transfer', 'entropy']
  },
  {
    id: 'mech2',
    title: 'Fluid Mechanics Handbook',
    type: 'pdf',
    subject: 'Fluid Mechanics',
    topic: 'Fluid Flow',
    url: 'https://example.com/fluid-mechanics.pdf',
    description: 'Comprehensive fluid mechanics reference',
    difficulty: 'advanced',
    source: 'McGraw Hill',
    tags: ['fluid dynamics', 'flow', 'hydraulics']
  },

  // AI/ML Resources
  {
    id: 'ai1',
    title: 'Machine Learning Crash Course',
    type: 'interactive',
    subject: 'Machine Learning',
    topic: 'ML Fundamentals',
    url: 'https://developers.google.com/machine-learning/crash-course',
    description: 'Google\'s fast-paced, practical introduction to ML',
    duration: '15 hours',
    difficulty: 'intermediate',
    source: 'Google Developers',
    tags: ['machine learning', 'tensorflow', 'neural networks']
  },
  {
    id: 'ai2',
    title: 'Deep Learning Specialization',
    type: 'video',
    subject: 'Deep Learning',
    topic: 'Neural Networks',
    url: 'https://www.coursera.org/deeplearning',
    description: 'Andrew Ng\'s comprehensive deep learning course',
    duration: '3 months',
    difficulty: 'advanced',
    source: 'Coursera',
    tags: ['deep learning', 'CNN', 'RNN', 'AI']
  },

  // Research Papers
  {
    id: 'rp1',
    title: 'Attention Is All You Need',
    type: 'research-paper',
    subject: 'Natural Language Processing',
    topic: 'Transformers',
    url: 'https://arxiv.org/abs/1706.03762',
    description: 'Foundational paper on transformer architecture',
    difficulty: 'advanced',
    source: 'arXiv',
    tags: ['NLP', 'transformers', 'attention mechanism']
  },
  {
    id: 'rp2',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    type: 'research-paper',
    subject: 'Blockchain',
    topic: 'Cryptocurrency',
    url: 'https://bitcoin.org/bitcoin.pdf',
    description: 'Satoshi Nakamoto\'s original Bitcoin paper',
    difficulty: 'advanced',
    source: 'Bitcoin.org',
    tags: ['blockchain', 'cryptocurrency', 'distributed systems']
  }
];

export default COLLEGE_RESOURCES;
