import type { CurriculumSubject } from '../types/curriculum.types';

/**
 * College Curriculum Data
 * Sample curriculum for various engineering and science programs
 * Last Updated: December 2024
 */

export const COLLEGE_CURRICULUM: CurriculumSubject[] = [
  // ============================================================================
  // COMPUTER SCIENCE
  // ============================================================================
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CSE301',
    teacher: 'Dr. Priya Sharma',
    color: '#3b82f6',
    icon: 'fa-code',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Introduction to Data Structures',
        topics: [
          {
            id: 't1',
            title: 'Arrays and Linked Lists',
            duration: '2 weeks',
            completed: true,
            description: 'Linear data structures: arrays, linked lists, circular lists',
            difficulty: 'medium',
            questionTypes: ['mcq', 'coding', 'theory'],
            learningObjectives: [
              'Understand array and linked list operations',
              'Implement singly and doubly linked lists',
              'Analyze time complexity of operations'
            ],
            keyTerms: ['array', 'linked list', 'pointer', 'node', 'traversal'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't2',
            title: 'Stacks and Queues',
            duration: '2 weeks',
            completed: true,
            description: 'LIFO and FIFO data structures',
            difficulty: 'medium',
            questionTypes: ['mcq', 'coding', 'theory'],
            learningObjectives: [
              'Implement stack using arrays and linked lists',
              'Implement queue and its variations',
              'Apply stacks and queues to solve problems'
            ],
            keyTerms: ['stack', 'queue', 'LIFO', 'FIFO', 'circular queue'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u2',
        title: 'Module 2: Advanced Data Structures',
        topics: [
          {
            id: 't3',
            title: 'Trees and Binary Search Trees',
            duration: '3 weeks',
            completed: false,
            description: 'Hierarchical data structures',
            difficulty: 'hard',
            questionTypes: ['mcq', 'coding', 'theory'],
            learningObjectives: [
              'Understand tree terminology and properties',
              'Implement BST operations',
              'Perform tree traversals'
            ],
            keyTerms: ['tree', 'BST', 'traversal', 'height', 'depth'],
            bloomLevels: ['understand', 'apply', 'analyze', 'create']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // MATHEMATICS
  // ============================================================================
  {
    id: '2',
    name: 'Linear Algebra',
    code: 'MATH201',
    teacher: 'Prof. Rajesh Kumar',
    color: '#10b981',
    icon: 'fa-calculator',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Vectors and Matrices',
        topics: [
          {
            id: 't1',
            title: 'Vector Spaces',
            duration: '2 weeks',
            completed: true,
            description: 'Introduction to vector spaces and subspaces',
            difficulty: 'medium',
            questionTypes: ['mcq', 'numerical', 'theory'],
            learningObjectives: [
              'Define vector spaces and subspaces',
              'Understand linear independence',
              'Compute basis and dimension'
            ],
            keyTerms: ['vector space', 'subspace', 'basis', 'dimension', 'span'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ELECTRONICS
  // ============================================================================
  {
    id: '3',
    name: 'Digital Electronics',
    code: 'ECE202',
    teacher: 'Dr. Anita Desai',
    color: '#f59e0b',
    icon: 'fa-microchip',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Number Systems and Boolean Algebra',
        topics: [
          {
            id: 't1',
            title: 'Number Systems',
            duration: '1 week',
            completed: true,
            description: 'Binary, octal, hexadecimal number systems',
            difficulty: 'easy',
            questionTypes: ['mcq', 'numerical'],
            learningObjectives: [
              'Convert between number systems',
              'Perform binary arithmetic',
              'Understand signed number representation'
            ],
            keyTerms: ['binary', 'hexadecimal', 'octal', '2s complement'],
            bloomLevels: ['understand', 'apply']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // MECHANICAL
  // ============================================================================
  {
    id: '4',
    name: 'Thermodynamics',
    code: 'MECH301',
    teacher: 'Prof. Vikram Singh',
    color: '#ef4444',
    icon: 'fa-fire',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Fundamental Concepts',
        topics: [
          {
            id: 't1',
            title: 'Laws of Thermodynamics',
            duration: '2 weeks',
            completed: true,
            description: 'First and second laws of thermodynamics',
            difficulty: 'medium',
            questionTypes: ['mcq', 'numerical', 'theory'],
            learningObjectives: [
              'State and apply laws of thermodynamics',
              'Solve problems on heat and work',
              'Understand entropy and enthalpy'
            ],
            keyTerms: ['entropy', 'enthalpy', 'heat', 'work', 'system'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // DATABASE MANAGEMENT
  // ============================================================================
  {
    id: '5',
    name: 'Database Management Systems',
    code: 'CSE401',
    teacher: 'Dr. Meera Nair',
    color: '#8b5cf6',
    icon: 'fa-database',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Database Fundamentals',
        topics: [
          {
            id: 't1',
            title: 'ER Modeling and Normalization',
            duration: '2 weeks',
            completed: false,
            description: 'Entity-Relationship diagrams and database normalization',
            difficulty: 'medium',
            questionTypes: ['mcq', 'diagram', 'theory'],
            learningObjectives: [
              'Design ER diagrams',
              'Normalize databases to 3NF',
              'Identify functional dependencies'
            ],
            keyTerms: ['ER diagram', 'normalization', 'functional dependency', 'primary key'],
            bloomLevels: ['understand', 'apply', 'create']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // OPERATING SYSTEMS
  // ============================================================================
  {
    id: '6',
    name: 'Operating Systems',
    code: 'CSE302',
    teacher: 'Prof. Amit Patel',
    color: '#06b6d4',
    icon: 'fa-server',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Process Management',
        topics: [
          {
            id: 't1',
            title: 'CPU Scheduling Algorithms',
            duration: '2 weeks',
            completed: true,
            description: 'Various CPU scheduling algorithms and their analysis',
            difficulty: 'medium',
            questionTypes: ['mcq', 'numerical', 'theory'],
            learningObjectives: [
              'Understand different scheduling algorithms',
              'Calculate average waiting time',
              'Compare algorithm performance'
            ],
            keyTerms: ['FCFS', 'SJF', 'Round Robin', 'priority scheduling'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // WEB DEVELOPMENT
  // ============================================================================
  {
    id: '7',
    name: 'Web Technologies',
    code: 'CSE501',
    teacher: 'Dr. Sneha Reddy',
    color: '#ec4899',
    icon: 'fa-globe',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Frontend Development',
        topics: [
          {
            id: 't1',
            title: 'HTML, CSS, and JavaScript',
            duration: '3 weeks',
            completed: true,
            description: 'Building responsive web interfaces',
            difficulty: 'easy',
            questionTypes: ['mcq', 'coding', 'project'],
            learningObjectives: [
              'Create semantic HTML structure',
              'Style pages with CSS',
              'Add interactivity with JavaScript'
            ],
            keyTerms: ['HTML5', 'CSS3', 'JavaScript', 'DOM', 'responsive design'],
            bloomLevels: ['understand', 'apply', 'create']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // MACHINE LEARNING
  // ============================================================================
  {
    id: '8',
    name: 'Machine Learning',
    code: 'CSE601',
    teacher: 'Dr. Arjun Malhotra',
    color: '#f97316',
    icon: 'fa-brain',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Introduction to ML',
        topics: [
          {
            id: 't1',
            title: 'Supervised Learning Algorithms',
            duration: '3 weeks',
            completed: false,
            description: 'Linear regression, logistic regression, decision trees',
            difficulty: 'hard',
            questionTypes: ['mcq', 'coding', 'theory'],
            learningObjectives: [
              'Understand supervised learning concepts',
              'Implement classification algorithms',
              'Evaluate model performance'
            ],
            keyTerms: ['regression', 'classification', 'overfitting', 'cross-validation'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // COMPUTER NETWORKS
  // ============================================================================
  {
    id: '9',
    name: 'Computer Networks',
    code: 'CSE303',
    teacher: 'Prof. Kavita Sharma',
    color: '#0ea5e9',
    icon: 'fa-network-wired',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Network Fundamentals',
        topics: [
          {
            id: 't1',
            title: 'OSI and TCP/IP Models',
            duration: '2 weeks',
            completed: true,
            description: 'Understanding network protocol layers',
            difficulty: 'medium',
            questionTypes: ['mcq', 'theory', 'diagram'],
            learningObjectives: [
              'Describe OSI 7-layer model',
              'Compare TCP/IP protocol stack',
              'Understand layer functionalities'
            ],
            keyTerms: ['OSI model', 'TCP/IP', 'protocol', 'encapsulation'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // SOFTWARE ENGINEERING
  // ============================================================================
  {
    id: '10',
    name: 'Software Engineering',
    code: 'CSE402',
    teacher: 'Dr. Ramesh Kumar',
    color: '#a855f7',
    icon: 'fa-project-diagram',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Software Development Life Cycle',
        topics: [
          {
            id: 't1',
            title: 'Agile and Scrum Methodologies',
            duration: '2 weeks',
            completed: false,
            description: 'Modern software development practices',
            difficulty: 'medium',
            questionTypes: ['mcq', 'theory', 'case-study'],
            learningObjectives: [
              'Understand Agile principles',
              'Apply Scrum framework',
              'Manage sprint planning'
            ],
            keyTerms: ['Agile', 'Scrum', 'sprint', 'user story', 'backlog'],
            bloomLevels: ['understand', 'apply', 'create']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTIFICIAL INTELLIGENCE
  // ============================================================================
  {
    id: '11',
    name: 'Artificial Intelligence',
    code: 'CSE602',
    teacher: 'Dr. Pooja Nair',
    color: '#14b8a6',
    icon: 'fa-robot',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Search Algorithms',
        topics: [
          {
            id: 't1',
            title: 'Informed and Uninformed Search',
            duration: '2 weeks',
            completed: false,
            description: 'BFS, DFS, A*, and heuristic search',
            difficulty: 'hard',
            questionTypes: ['mcq', 'coding', 'theory'],
            learningObjectives: [
              'Implement search algorithms',
              'Design heuristic functions',
              'Analyze algorithm complexity'
            ],
            keyTerms: ['BFS', 'DFS', 'A*', 'heuristic', 'admissibility'],
            bloomLevels: ['understand', 'apply', 'analyze', 'create']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ELECTRICAL - CONTROL SYSTEMS
  // ============================================================================
  {
    id: '12',
    name: 'Control Systems',
    code: 'EEE301',
    teacher: 'Prof. Suresh Babu',
    color: '#eab308',
    icon: 'fa-sliders-h',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Transfer Functions',
        topics: [
          {
            id: 't1',
            title: 'Laplace Transforms and System Modeling',
            duration: '3 weeks',
            completed: false,
            description: 'Mathematical modeling of control systems',
            difficulty: 'hard',
            questionTypes: ['mcq', 'numerical', 'theory'],
            learningObjectives: [
              'Apply Laplace transforms',
              'Derive transfer functions',
              'Analyze system stability'
            ],
            keyTerms: ['Laplace', 'transfer function', 'poles', 'zeros', 'stability'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // CIVIL ENGINEERING
  // ============================================================================
  {
    id: '13',
    name: 'Structural Analysis',
    code: 'CIVIL301',
    teacher: 'Prof. Venkat Reddy',
    color: '#84cc16',
    icon: 'fa-building',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Analysis of Determinate Structures',
        topics: [
          {
            id: 't1',
            title: 'Trusses and Beams',
            duration: '3 weeks',
            completed: false,
            description: 'Analysis of statically determinate structures',
            difficulty: 'medium',
            questionTypes: ['mcq', 'numerical', 'diagram'],
            learningObjectives: [
              'Analyze truss structures',
              'Calculate beam reactions',
              'Draw shear and moment diagrams'
            ],
            keyTerms: ['truss', 'beam', 'shear force', 'bending moment', 'support reactions'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  },

  // ============================================================================
  // MANAGEMENT
  // ============================================================================
  {
    id: '14',
    name: 'Engineering Economics',
    code: 'MGMT201',
    teacher: 'Prof. Aditya Singh',
    color: '#22c55e',
    icon: 'fa-chart-pie',
    units: [
      {
        id: 'u1',
        title: 'Module 1: Cost Analysis',
        topics: [
          {
            id: 't1',
            title: 'Time Value of Money',
            duration: '2 weeks',
            completed: false,
            description: 'Financial analysis for engineering projects',
            difficulty: 'medium',
            questionTypes: ['mcq', 'numerical', 'case-study'],
            learningObjectives: [
              'Calculate present and future values',
              'Perform NPV and IRR analysis',
              'Compare project alternatives'
            ],
            keyTerms: ['NPV', 'IRR', 'discount rate', 'cash flow', 'depreciation'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ]
  }
];

// Export default curriculum for backward compatibility
export default COLLEGE_CURRICULUM;
