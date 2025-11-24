import type { CurriculumSubject } from '../types/curriculum.types';

/**
 * Tamil Nadu State Board 10th Standard Curriculum
 * Complete curriculum data for all subjects
 * Last Updated: December 2024
 */

export const TN_BOARD_10TH_CURRICULUM: CurriculumSubject[] = [
  // ============================================================================
  // MATHEMATICS
  // ============================================================================
  {
    id: '1',
    name: 'Mathematics',
    code: 'TN Board - 10th Std',
    teacher: 'Mr. Karthik Subramanian',
    color: '#3b82f6',
    icon: 'fa-calculator',
    units: [
      {
        id: 'u1',
        title: 'Chapter 1: Relations and Functions',
        topics: [
          {
            id: 't1',
            title: 'Relations',
            duration: '1 week',
            completed: true,
            description: 'Types of relations, domain, range, and co-domain',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand the concept of relations',
              'Identify domain, range, and co-domain',
              'Classify different types of relations'
            ],
            keyTerms: ['relation', 'domain', 'range', 'co-domain', 'ordered pair'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't2',
            title: 'Functions',
            duration: '1 week',
            completed: true,
            description: 'Definition of functions, types of functions',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Define and identify functions',
              'Distinguish between different types of functions',
              'Determine if a relation is a function'
            ],
            keyTerms: ['function', 'one-to-one', 'onto', 'bijective', 'mapping'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't3',
            title: 'Composition of Functions',
            duration: '1 week',
            completed: false,
            description: 'Composition and inverse of functions',
            difficulty: 'hard',
            questionTypes: ['short-answer', 'long-answer'],
            learningObjectives: [
              'Perform composition of two or more functions',
              'Find inverse of a function',
              'Verify properties of function composition'
            ],
            keyTerms: ['composition', 'inverse function', 'fog', 'gof', 'identity function'],
            bloomLevels: ['apply', 'analyze', 'create']
          }
        ]
      },
      {
        id: 'u2',
        title: 'Chapter 2: Sequences and Series',
        topics: [
          {
            id: 't4',
            title: 'Arithmetic Progression',
            duration: '2 weeks',
            completed: true,
            description: 'AP, nth term, sum of n terms',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Identify arithmetic progressions',
              'Find nth term and sum of AP',
              'Solve real-world problems using AP'
            ],
            keyTerms: ['AP', 'common difference', 'nth term', 'sum formula'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't5',
            title: 'Geometric Progression',
            duration: '2 weeks',
            completed: false,
            description: 'GP, nth term, sum of n terms, infinite GP',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand geometric progressions',
              'Calculate nth term and sum of GP',
              'Work with infinite geometric series'
            ],
            keyTerms: ['GP', 'common ratio', 'nth term', 'infinite series'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u3',
        title: 'Chapter 3: Algebra',
        topics: [
          {
            id: 't6',
            title: 'Polynomials',
            duration: '1 week',
            completed: true,
            description: 'Quadratic equations, roots, and relationships',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Solve quadratic equations',
              'Find sum and product of roots',
              'Form equations from given roots'
            ],
            keyTerms: ['polynomial', 'quadratic', 'roots', 'discriminant', 'factors'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't7',
            title: 'Matrices',
            duration: '2 weeks',
            completed: true,
            description: 'Matrix operations, determinants, inverses',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Perform matrix operations',
              'Calculate determinants',
              'Find inverse of a matrix'
            ],
            keyTerms: ['matrix', 'determinant', 'inverse', 'transpose', 'multiplication'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u4',
        title: 'Chapter 4: Geometry and Trigonometry',
        topics: [
          {
            id: 't8',
            title: 'Coordinate Geometry',
            duration: '2 weeks',
            completed: false,
            description: 'Distance formula, section formula, area of triangle',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Apply distance and section formulas',
              'Calculate area of geometric figures',
              'Solve coordinate geometry problems'
            ],
            keyTerms: ['coordinates', 'distance', 'midpoint', 'section formula', 'area'],
            bloomLevels: ['remember', 'apply', 'analyze']
          },
          {
            id: 't9',
            title: 'Trigonometry',
            duration: '3 weeks',
            completed: false,
            description: 'Trigonometric ratios, identities, heights and distances',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Master trigonometric ratios and identities',
              'Solve problems on heights and distances',
              'Apply trigonometry to real-world scenarios'
            ],
            keyTerms: ['sin', 'cos', 'tan', 'identities', 'angle of elevation', 'angle of depression'],
            bloomLevels: ['understand', 'apply', 'analyze', 'create']
          }
        ]
      },
      {
        id: 'u5',
        title: 'Chapter 5: Statistics and Probability',
        topics: [
          {
            id: 't10',
            title: 'Statistics',
            duration: '2 weeks',
            completed: true,
            description: 'Mean, median, mode, standard deviation',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Calculate measures of central tendency',
              'Find standard deviation and variance',
              'Interpret statistical data'
            ],
            keyTerms: ['mean', 'median', 'mode', 'variance', 'standard deviation'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't11',
            title: 'Probability',
            duration: '2 weeks',
            completed: true,
            description: 'Basic probability, conditional probability, Bayes theorem',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Calculate probability of events',
              'Apply conditional probability',
              'Solve problems using probability theorems'
            ],
            keyTerms: ['probability', 'event', 'sample space', 'conditional', 'independent'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      }
    ],
    totalTopics: 11,
    completedTopics: 6,
    progress: 55
  },

  // ============================================================================
  // SCIENCE
  // ============================================================================
  {
    id: '2',
    name: 'Science',
    code: 'TN Board - 10th Std',
    teacher: 'Dr. Lakshmi Narayanan',
    color: '#10ac8b',
    icon: 'fa-flask',
    units: [
      // Physics Units
      {
        id: 'u6',
        title: 'Physics: Laws of Motion',
        topics: [
          {
            id: 't12',
            title: 'Newton\'s Laws of Motion',
            duration: '2 weeks',
            completed: true,
            description: 'Three laws of motion and applications',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'State and explain Newton\'s three laws',
              'Apply laws to solve numerical problems',
              'Analyze motion in real-world scenarios'
            ],
            keyTerms: ['force', 'mass', 'acceleration', 'inertia', 'momentum'],
            bloomLevels: ['remember', 'understand', 'apply', 'analyze']
          },
          {
            id: 't13',
            title: 'Force and Momentum',
            duration: '1 week',
            completed: true,
            description: 'Conservation of momentum, impulse',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Define and calculate momentum',
              'Apply conservation of momentum',
              'Understand impulse and its applications'
            ],
            keyTerms: ['momentum', 'impulse', 'conservation', 'collision', 'recoil'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't14',
            title: 'Uniform Circular Motion',
            duration: '1 week',
            completed: false,
            description: 'Centripetal force, angular velocity',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand circular motion concepts',
              'Calculate centripetal force and acceleration',
              'Solve problems on circular motion'
            ],
            keyTerms: ['circular motion', 'centripetal force', 'angular velocity', 'radius'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u7',
        title: 'Physics: Optics',
        topics: [
          {
            id: 't15',
            title: 'Reflection of Light',
            duration: '1 week',
            completed: true,
            description: 'Laws of reflection, mirrors, image formation',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'State laws of reflection',
              'Draw ray diagrams for mirrors',
              'Calculate image properties using mirror formula'
            ],
            keyTerms: ['reflection', 'mirror', 'focal length', 'magnification', 'ray diagram'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't16',
            title: 'Refraction of Light',
            duration: '2 weeks',
            completed: true,
            description: 'Snell\'s law, lenses, optical instruments',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Explain refraction and Snell\'s law',
              'Analyze image formation by lenses',
              'Understand working of optical instruments'
            ],
            keyTerms: ['refraction', 'refractive index', 'lens', 'focal point', 'magnification'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u8',
        title: 'Physics: Electricity',
        topics: [
          {
            id: 't17',
            title: 'Electric Current and Circuits',
            duration: '2 weeks',
            completed: false,
            description: 'Ohm\'s law, resistance, series and parallel circuits',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Apply Ohm\'s law to calculate resistance',
              'Analyze series and parallel circuits',
              'Calculate equivalent resistance'
            ],
            keyTerms: ['current', 'voltage', 'resistance', 'Ohm\'s law', 'circuit'],
            bloomLevels: ['remember', 'understand', 'apply', 'analyze']
          },
          {
            id: 't18',
            title: 'Magnetic Effects of Electric Current',
            duration: '2 weeks',
            completed: false,
            description: 'Electromagnetic induction, motors, generators',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Understand electromagnetic induction',
              'Explain working of motors and generators',
              'Apply Fleming\'s rules'
            ],
            keyTerms: ['magnetic field', 'electromagnetic induction', 'motor', 'generator', 'Fleming\'s rule'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u9',
        title: 'Physics: Thermal Physics',
        topics: [
          {
            id: 't19',
            title: 'Heat and Temperature',
            duration: '1 week',
            completed: true,
            description: 'Specific heat capacity, heat transfer methods',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Distinguish between heat and temperature',
              'Calculate heat using specific heat capacity',
              'Identify methods of heat transfer'
            ],
            keyTerms: ['heat', 'temperature', 'specific heat', 'conduction', 'convection', 'radiation'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't20',
            title: 'Thermodynamics',
            duration: '1 week',
            completed: false,
            description: 'Laws of thermodynamics, heat engines',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'State laws of thermodynamics',
              'Understand heat engines and efficiency',
              'Apply thermodynamic principles'
            ],
            keyTerms: ['thermodynamics', 'entropy', 'enthalpy', 'heat engine', 'efficiency'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      // Chemistry Units
      {
        id: 'u10',
        title: 'Chemistry: Periodic Classification of Elements',
        topics: [
          {
            id: 't21',
            title: 'Modern Periodic Table',
            duration: '2 weeks',
            completed: true,
            description: 'Periodic law, groups, periods, and trends',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Explain modern periodic law',
              'Identify groups and periods',
              'Predict element properties using periodic trends'
            ],
            keyTerms: ['periodic table', 'group', 'period', 'atomic number', 'valency'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't22',
            title: 'Periodic Trends',
            duration: '1 week',
            completed: true,
            description: 'Atomic radius, ionization energy, electronegativity',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Define periodic properties',
              'Explain trends across periods and groups',
              'Compare properties of elements'
            ],
            keyTerms: ['atomic radius', 'ionization energy', 'electronegativity', 'electron affinity'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u11',
        title: 'Chemistry: Chemical Reactions and Equations',
        topics: [
          {
            id: 't23',
            title: 'Types of Chemical Reactions',
            duration: '2 weeks',
            completed: true,
            description: 'Combination, decomposition, displacement, redox reactions',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Classify types of chemical reactions',
              'Write balanced chemical equations',
              'Identify oxidation and reduction'
            ],
            keyTerms: ['combination', 'decomposition', 'displacement', 'redox', 'oxidation', 'reduction'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't24',
            title: 'Acids, Bases, and Salts',
            duration: '2 weeks',
            completed: false,
            description: 'pH scale, neutralization, salt formation',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'practical'],
            learningObjectives: [
              'Identify properties of acids and bases',
              'Use pH scale to measure acidity',
              'Understand salt formation through neutralization'
            ],
            keyTerms: ['acid', 'base', 'pH', 'neutralization', 'salt', 'indicator'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u12',
        title: 'Chemistry: Carbon and Its Compounds',
        topics: [
          {
            id: 't25',
            title: 'Organic Chemistry Basics',
            duration: '2 weeks',
            completed: true,
            description: 'Bonding in carbon, hydrocarbons, nomenclature',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Explain bonding in carbon compounds',
              'Name organic compounds using IUPAC rules',
              'Classify hydrocarbons'
            ],
            keyTerms: ['carbon', 'covalent bond', 'hydrocarbon', 'alkane', 'alkene', 'alkyne'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't26',
            title: 'Functional Groups',
            duration: '1 week',
            completed: false,
            description: 'Alcohols, aldehydes, ketones, carboxylic acids',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Identify functional groups',
              'Name compounds with functional groups',
              'Understand properties of organic compounds'
            ],
            keyTerms: ['functional group', 'alcohol', 'aldehyde', 'ketone', 'carboxylic acid'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      // Biology Units
      {
        id: 'u13',
        title: 'Biology: Life Processes',
        topics: [
          {
            id: 't27',
            title: 'Nutrition and Respiration',
            duration: '2 weeks',
            completed: true,
            description: 'Modes of nutrition, digestive system, respiratory system',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Describe modes of nutrition',
              'Explain human digestive process',
              'Understand respiratory mechanisms'
            ],
            keyTerms: ['nutrition', 'digestion', 'respiration', 'enzymes', 'photosynthesis'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't28',
            title: 'Transportation and Excretion',
            duration: '2 weeks',
            completed: true,
            description: 'Circulatory system, excretory system',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Explain blood circulation in humans',
              'Describe excretory system structure',
              'Understand kidney function'
            ],
            keyTerms: ['circulation', 'blood', 'heart', 'excretion', 'kidney', 'nephron'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u14',
        title: 'Biology: Reproduction and Heredity',
        topics: [
          {
            id: 't29',
            title: 'Asexual and Sexual Reproduction',
            duration: '2 weeks',
            completed: false,
            description: 'Modes of reproduction, human reproductive system',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Compare asexual and sexual reproduction',
              'Describe human reproductive system',
              'Understand fertilization and development'
            ],
            keyTerms: ['reproduction', 'asexual', 'sexual', 'gamete', 'fertilization', 'zygote'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't30',
            title: 'Genetics and Evolution',
            duration: '2 weeks',
            completed: false,
            description: 'Mendel\'s laws, DNA, evolution theories',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Apply Mendel\'s laws of inheritance',
              'Understand DNA structure and function',
              'Explain theories of evolution'
            ],
            keyTerms: ['genetics', 'gene', 'chromosome', 'DNA', 'heredity', 'evolution'],
            bloomLevels: ['understand', 'apply', 'analyze', 'evaluate']
          }
        ]
      }
    ],
    totalTopics: 19,
    completedTopics: 11,
    progress: 58
  },

  // ============================================================================
  // TAMIL
  // ============================================================================
  {
    id: '3',
    name: 'Tamil',
    code: 'TN Board - 10th Std',
    teacher: 'திரு. முருகேசன்',
    color: '#ef4444',
    icon: 'fa-language',
    units: [
      {
        id: 'u15',
        title: 'இலக்கணம் (Grammar)',
        topics: [
          {
            id: 't31',
            title: 'எழுத்து (Letters)',
            duration: '1 week',
            completed: true,
            description: 'Tamil letters, classification, and phonetics',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'theory'],
            learningObjectives: [
              'Classify Tamil letters',
              'Understand vowel and consonant sounds',
              'Apply phonetic rules'
            ],
            keyTerms: ['உயிர்', 'மெய்', 'உயிர்மெய்', 'வல்லினம்', 'மெல்லினம்'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't32',
            title: 'சொல் (Words)',
            duration: '1 week',
            completed: true,
            description: 'Word formation, types of words',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'theory'],
            learningObjectives: [
              'Form words using rules',
              'Classify types of words',
              'Understand word etymology'
            ],
            keyTerms: ['தனிச்சொல்', 'பெயர்ச்சொல்', 'வினைச்சொல்', 'இடைச்சொல்'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't33',
            title: 'பொருள் (Meaning)',
            duration: '1 week',
            completed: false,
            description: 'Semantics, figures of speech',
            difficulty: 'hard',
            questionTypes: ['short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Interpret word meanings',
              'Identify figures of speech',
              'Analyze semantic relationships'
            ],
            keyTerms: ['நேர்ப்பொருள்', 'குறிப்புப்பொருள்', 'உவமை', 'உருவகம்'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      },
      {
        id: 'u16',
        title: 'இலக்கியம் (Literature)',
        topics: [
          {
            id: 't34',
            title: 'திருக்குறள் (Thirukkural)',
            duration: '2 weeks',
            completed: true,
            description: 'Selected verses with commentary and interpretation',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Memorize selected kurals',
              'Interpret meanings and context',
              'Apply teachings to modern life'
            ],
            keyTerms: ['குறள்', 'அறம்', 'பொருள்', 'இன்பம்', 'வள்ளுவர்'],
            bloomLevels: ['remember', 'understand', 'apply', 'evaluate']
          },
          {
            id: 't35',
            title: 'சங்க இலக்கியம் (Sangam Literature)',
            duration: '2 weeks',
            completed: true,
            description: 'Introduction to Sangam poetry and themes',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Understand Sangam period literature',
              'Identify akam and puram themes',
              'Analyze poetic devices'
            ],
            keyTerms: ['சங்கம்', 'அகம்', 'புறம்', 'திணை', 'துறை'],
            bloomLevels: ['remember', 'understand', 'analyze']
          }
        ]
      },
      {
        id: 'u17',
        title: 'உரைநடை (Prose)',
        topics: [
          {
            id: 't36',
            title: 'கட்டுரை (Essays)',
            duration: '2 weeks',
            completed: true,
            description: 'Reading comprehension and essay analysis',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Read and comprehend prose passages',
              'Analyze essay structure',
              'Extract main ideas and themes'
            ],
            keyTerms: ['கட்டுரை', 'கருத்து', 'தலைப்பு', 'முடிவுரை'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          },
          {
            id: 't37',
            title: 'கதை (Stories)',
            duration: '1 week',
            completed: false,
            description: 'Short story reading and interpretation',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer'],
            learningObjectives: [
              'Understand narrative structure',
              'Identify characters and themes',
              'Analyze plot development'
            ],
            keyTerms: ['கதை', 'கதைமாந்தர்', 'கருப்பொருள்', 'நிகழ்வு'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      },
      {
        id: 'u18',
        title: 'செய்யுள் (Poetry)',
        topics: [
          {
            id: 't38',
            title: 'பாரதியார் பாடல்கள் (Bharathiyar Songs)',
            duration: '2 weeks',
            completed: true,
            description: 'Patriotic songs and their literary analysis',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Memorize Bharathiyar songs',
              'Understand patriotic themes',
              'Analyze poetic techniques'
            ],
            keyTerms: ['பாரதியார்', 'தேசியம்', 'விடுதலை', 'சமத்துவம்'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't39',
            title: 'நாட்டுப்புறப் பாடல்கள் (Folk Songs)',
            duration: '1 week',
            completed: false,
            description: 'Traditional Tamil folk poetry',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer'],
            learningObjectives: [
              'Appreciate folk literature',
              'Understand cultural context',
              'Identify folk song types'
            ],
            keyTerms: ['நாட்டுப்புறம்', 'தாலாட்டு', 'வேலைப்பாடல்', 'திருவிழாப்பாடல்'],
            bloomLevels: ['remember', 'understand', 'apply']
          }
        ]
      },
      {
        id: 'u19',
        title: 'எழுத்துத் திறன் (Writing Skills)',
        topics: [
          {
            id: 't40',
            title: 'கடிதம் (Letter Writing)',
            duration: '1 week',
            completed: true,
            description: 'Formal and informal letter formats',
            difficulty: 'easy',
            questionTypes: ['long-answer', 'practical'],
            learningObjectives: [
              'Write formal letters',
              'Write informal letters',
              'Follow proper letter format'
            ],
            keyTerms: ['கடிதம்', 'முறைக்கடிதம்', 'அலுவல்கடிதம்', 'முகவரி'],
            bloomLevels: ['remember', 'apply', 'create']
          },
          {
            id: 't41',
            title: 'கட்டுரை எழுதுதல் (Essay Writing)',
            duration: '2 weeks',
            completed: false,
            description: 'Essay composition on various topics',
            difficulty: 'medium',
            questionTypes: ['long-answer', 'practical'],
            learningObjectives: [
              'Organize ideas for essays',
              'Write coherent paragraphs',
              'Develop essay writing skills'
            ],
            keyTerms: ['கட்டுரை', 'முன்னுரை', 'உடல்பாகம்', 'முடிவுரை'],
            bloomLevels: ['apply', 'analyze', 'create']
          }
        ]
      }
    ],
    totalTopics: 11,
    completedTopics: 6,
    progress: 55
  },

  // ============================================================================
  // ENGLISH
  // ============================================================================
  {
    id: '4',
    name: 'English',
    code: 'TN Board - 10th Std',
    teacher: 'Mrs. Jennifer Thomas',
    color: '#8b5cf6',
    icon: 'fa-book',
    units: [
      {
        id: 'u20',
        title: 'Prose',
        topics: [
          {
            id: 't42',
            title: 'Two Gentlemen of Verona',
            duration: '2 weeks',
            completed: true,
            description: 'Story analysis, themes, and character study',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Analyze plot and characters',
              'Identify themes and messages',
              'Develop comprehension skills'
            ],
            keyTerms: ['sacrifice', 'determination', 'war', 'responsibility', 'compassion'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          },
          {
            id: 't43',
            title: 'The Grumble Family',
            duration: '1 week',
            completed: true,
            description: 'Poem and prose analysis on attitude',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer'],
            learningObjectives: [
              'Understand positive thinking',
              'Analyze author\'s perspective',
              'Relate to personal experiences'
            ],
            keyTerms: ['attitude', 'complaining', 'perspective', 'happiness'],
            bloomLevels: ['understand', 'apply', 'evaluate']
          }
        ]
      },
      {
        id: 'u21',
        title: 'Poetry',
        topics: [
          {
            id: 't44',
            title: 'Classical Poetry',
            duration: '2 weeks',
            completed: false,
            description: 'Analysis of classic poems with literary devices',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Identify poetic devices',
              'Interpret figurative language',
              'Analyze rhythm and rhyme'
            ],
            keyTerms: ['metaphor', 'simile', 'alliteration', 'personification', 'rhyme scheme'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          },
          {
            id: 't45',
            title: 'Modern Poetry',
            duration: '1 week',
            completed: false,
            description: 'Contemporary poetry and themes',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer'],
            learningObjectives: [
              'Appreciate modern poetry',
              'Understand contemporary themes',
              'Analyze free verse'
            ],
            keyTerms: ['free verse', 'imagery', 'symbolism', 'tone', 'mood'],
            bloomLevels: ['understand', 'analyze', 'create']
          }
        ]
      },
      {
        id: 'u22',
        title: 'Supplementary Reading',
        topics: [
          {
            id: 't46',
            title: 'After Twenty Years',
            duration: '1 week',
            completed: true,
            description: 'O. Henry\'s short story analysis',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand plot twist technique',
              'Analyze character development',
              'Identify themes of loyalty and duty'
            ],
            keyTerms: ['friendship', 'duty', 'twist ending', 'irony'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          },
          {
            id: 't47',
            title: 'The Tempest (Drama)',
            duration: '2 weeks',
            completed: false,
            description: 'Shakespeare\'s play - scenes and analysis',
            difficulty: 'hard',
            questionTypes: ['short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Understand Shakespearean drama',
              'Analyze plot and characters',
              'Interpret themes and symbolism'
            ],
            keyTerms: ['magic', 'forgiveness', 'power', 'revenge', 'reconciliation'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      },
      {
        id: 'u23',
        title: 'Grammar and Composition',
        topics: [
          {
            id: 't48',
            title: 'Tenses and Voice',
            duration: '2 weeks',
            completed: true,
            description: 'Verb tenses, active and passive voice',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'practical'],
            learningObjectives: [
              'Use correct tenses',
              'Convert active to passive voice',
              'Apply grammar rules'
            ],
            keyTerms: ['present tense', 'past tense', 'future tense', 'active voice', 'passive voice'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't49',
            title: 'Reported Speech',
            duration: '1 week',
            completed: true,
            description: 'Direct and indirect speech conversion',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'practical'],
            learningObjectives: [
              'Convert direct to indirect speech',
              'Apply reporting rules',
              'Use correct tense changes'
            ],
            keyTerms: ['direct speech', 'indirect speech', 'reporting verb', 'tense change'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't50',
            title: 'Sentence Patterns',
            duration: '1 week',
            completed: false,
            description: 'Sentence structure and patterns',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer'],
            learningObjectives: [
              'Identify sentence patterns',
              'Construct correct sentences',
              'Analyze sentence structure'
            ],
            keyTerms: ['subject', 'verb', 'object', 'complement', 'clause'],
            bloomLevels: ['remember', 'understand', 'apply']
          }
        ]
      },
      {
        id: 'u24',
        title: 'Writing Skills',
        topics: [
          {
            id: 't51',
            title: 'Letter Writing',
            duration: '1 week',
            completed: true,
            description: 'Formal and informal letter formats',
            difficulty: 'easy',
            questionTypes: ['long-answer', 'practical'],
            learningObjectives: [
              'Write formal letters',
              'Write informal letters',
              'Follow proper format'
            ],
            keyTerms: ['formal letter', 'informal letter', 'format', 'salutation', 'closing'],
            bloomLevels: ['remember', 'apply', 'create']
          },
          {
            id: 't52',
            title: 'Essay Writing',
            duration: '2 weeks',
            completed: false,
            description: 'Essay composition techniques',
            difficulty: 'medium',
            questionTypes: ['long-answer', 'practical'],
            learningObjectives: [
              'Organize essay structure',
              'Develop coherent arguments',
              'Write effective introductions and conclusions'
            ],
            keyTerms: ['thesis statement', 'body paragraph', 'conclusion', 'transition'],
            bloomLevels: ['apply', 'analyze', 'create']
          },
          {
            id: 't53',
            title: 'Paragraph Writing',
            duration: '1 week',
            completed: false,
            description: 'Topic sentences and paragraph development',
            difficulty: 'easy',
            questionTypes: ['short-answer', 'practical'],
            learningObjectives: [
              'Write topic sentences',
              'Develop supporting details',
              'Create unified paragraphs'
            ],
            keyTerms: ['topic sentence', 'supporting details', 'unity', 'coherence'],
            bloomLevels: ['understand', 'apply', 'create']
          }
        ]
      },
      {
        id: 'u25',
        title: 'Vocabulary and Comprehension',
        topics: [
          {
            id: 't54',
            title: 'Synonyms and Antonyms',
            duration: '1 week',
            completed: true,
            description: 'Word meanings and opposites',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer'],
            learningObjectives: [
              'Identify synonyms',
              'Identify antonyms',
              'Expand vocabulary'
            ],
            keyTerms: ['synonym', 'antonym', 'vocabulary', 'word meaning'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't55',
            title: 'Reading Comprehension',
            duration: '2 weeks',
            completed: false,
            description: 'Unseen passage comprehension',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand main ideas',
              'Identify supporting details',
              'Make inferences'
            ],
            keyTerms: ['main idea', 'inference', 'context clues', 'comprehension'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      }
    ],
    totalTopics: 14,
    completedTopics: 7,
    progress: 50
  },

  // ============================================================================
  // SOCIAL SCIENCE
  // ============================================================================
  {
    id: '5',
    name: 'Social Science',
    code: 'TN Board - 10th Std',
    teacher: 'Mr. Vijay Shankar',
    color: '#f59e0b',
    icon: 'fa-globe',
    units: [
      // History Units
      {
        id: 'u26',
        title: 'History: Indian Freedom Struggle',
        topics: [
          {
            id: 't56',
            title: 'Advent of Europeans',
            duration: '2 weeks',
            completed: true,
            description: 'Portuguese, Dutch, French, and British arrival in India',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Understand reasons for European arrival',
              'Analyze impact of colonialism',
              'Compare European powers in India'
            ],
            keyTerms: ['colonialism', 'East India Company', 'trade', 'Vasco da Gama'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't57',
            title: 'Revolt of 1857',
            duration: '2 weeks',
            completed: true,
            description: 'First War of Independence - causes and consequences',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Identify causes of the revolt',
              'Understand spread and suppression',
              'Analyze consequences'
            ],
            keyTerms: ['sepoy mutiny', 'Mangal Pandey', 'Rani Lakshmibai', 'nationalism'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't58',
            title: 'Indian National Movement',
            duration: '3 weeks',
            completed: true,
            description: 'Formation of INC, Gandhi, Non-cooperation, Civil Disobedience',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Trace evolution of nationalist movement',
              'Understand Gandhi\'s role',
              'Analyze major movements'
            ],
            keyTerms: ['INC', 'Gandhi', 'Satyagraha', 'non-cooperation', 'civil disobedience', 'Quit India'],
            bloomLevels: ['remember', 'understand', 'analyze', 'evaluate']
          }
        ]
      },
      {
        id: 'u27',
        title: 'History: World Wars and After',
        topics: [
          {
            id: 't59',
            title: 'World War I and II',
            duration: '2 weeks',
            completed: false,
            description: 'Causes, events, and outcomes of world wars',
            difficulty: 'hard',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand causes of world wars',
              'Analyze major events and battles',
              'Evaluate global impact'
            ],
            keyTerms: ['World War', 'Hitler', 'Mussolini', 'fascism', 'League of Nations', 'UN'],
            bloomLevels: ['remember', 'understand', 'analyze', 'evaluate']
          },
          {
            id: 't60',
            title: 'Cold War Era',
            duration: '1 week',
            completed: false,
            description: 'US-USSR rivalry and Non-Aligned Movement',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand Cold War dynamics',
              'Analyze role of NAM',
              'Evaluate impact on India'
            ],
            keyTerms: ['Cold War', 'capitalism', 'communism', 'NAM', 'arms race'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      },
      // Geography Units
      {
        id: 'u28',
        title: 'Geography: Resources and Development',
        topics: [
          {
            id: 't61',
            title: 'Land Resources',
            duration: '2 weeks',
            completed: true,
            description: 'Land use patterns, soil types, conservation',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'practical'],
            learningObjectives: [
              'Classify land use patterns',
              'Identify soil types',
              'Suggest conservation methods'
            ],
            keyTerms: ['land use', 'soil', 'erosion', 'conservation', 'agriculture'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't62',
            title: 'Water Resources',
            duration: '1 week',
            completed: true,
            description: 'Rivers, dams, rainwater harvesting, water management',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand water distribution',
              'Analyze water management techniques',
              'Evaluate rainwater harvesting'
            ],
            keyTerms: ['river', 'dam', 'irrigation', 'rainwater harvesting', 'watershed'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u29',
        title: 'Geography: Physical Features',
        topics: [
          {
            id: 't63',
            title: 'Physiographic Divisions',
            duration: '2 weeks',
            completed: true,
            description: 'Mountains, plateaus, and plains of India',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'practical'],
            learningObjectives: [
              'Identify major physical divisions',
              'Locate features on map',
              'Understand formation processes'
            ],
            keyTerms: ['Himalayas', 'plateau', 'plains', 'Western Ghats', 'Eastern Ghats'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't64',
            title: 'Climate and Vegetation',
            duration: '2 weeks',
            completed: false,
            description: 'Monsoon system and natural vegetation',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Explain monsoon mechanism',
              'Classify vegetation types',
              'Relate climate to vegetation'
            ],
            keyTerms: ['monsoon', 'rainfall', 'forest', 'natural vegetation', 'climate zones'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't65',
            title: 'Natural Disasters',
            duration: '1 week',
            completed: true,
            description: 'Earthquakes, floods, and disaster management',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer'],
            learningObjectives: [
              'Understand causes of disasters',
              'Learn disaster preparedness',
              'Evaluate mitigation strategies'
            ],
            keyTerms: ['earthquake', 'flood', 'cyclone', 'disaster management', 'mitigation'],
            bloomLevels: ['understand', 'apply', 'evaluate']
          }
        ]
      },
      // Civics Units
      {
        id: 'u30',
        title: 'Civics: Democratic Politics',
        topics: [
          {
            id: 't66',
            title: 'Power Sharing',
            duration: '1 week',
            completed: true,
            description: 'Forms of power sharing in democracies',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'theory'],
            learningObjectives: [
              'Understand concept of power sharing',
              'Identify forms of power sharing',
              'Analyze importance in democracy'
            ],
            keyTerms: ['power sharing', 'democracy', 'horizontal', 'vertical', 'coalition'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't67',
            title: 'Federalism',
            duration: '2 weeks',
            completed: true,
            description: 'Federal system in India',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Explain federalism concept',
              'Understand Union-State relations',
              'Analyze features of Indian federalism'
            ],
            keyTerms: ['federalism', 'Union', 'State', 'concurrent list', 'residuary powers'],
            bloomLevels: ['understand', 'apply', 'analyze']
          },
          {
            id: 't68',
            title: 'Democracy and Diversity',
            duration: '1 week',
            completed: true,
            description: 'Challenges of cultural diversity',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer'],
            learningObjectives: [
              'Understand cultural diversity',
              'Analyze challenges in democracy',
              'Evaluate accommodating mechanisms'
            ],
            keyTerms: ['diversity', 'multiculturalism', 'tolerance', 'accommodation'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      },
      // Economics Units
      {
        id: 'u31',
        title: 'Economics: Understanding Economic Development',
        topics: [
          {
            id: 't69',
            title: 'Development',
            duration: '1 week',
            completed: true,
            description: 'Meaning and indicators of development',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'theory'],
            learningObjectives: [
              'Define economic development',
              'Identify development indicators',
              'Compare different development measures'
            ],
            keyTerms: ['development', 'GDP', 'per capita income', 'HDI', 'literacy rate'],
            bloomLevels: ['remember', 'understand', 'apply']
          },
          {
            id: 't70',
            title: 'Sectors of Economy',
            duration: '2 weeks',
            completed: true,
            description: 'Primary, secondary, and tertiary sectors',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Classify economic sectors',
              'Understand sector contributions',
              'Analyze employment patterns'
            ],
            keyTerms: ['primary sector', 'secondary sector', 'tertiary sector', 'GDP contribution'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't71',
            title: 'Money and Credit',
            duration: '2 weeks',
            completed: false,
            description: 'Banking system and credit facilities',
            difficulty: 'medium',
            questionTypes: ['mcq', 'short-answer', 'long-answer'],
            learningObjectives: [
              'Understand functions of money',
              'Explain banking system',
              'Analyze credit and loans'
            ],
            keyTerms: ['money', 'bank', 'credit', 'loan', 'interest rate', 'RBI'],
            bloomLevels: ['understand', 'apply', 'analyze']
          }
        ]
      },
      {
        id: 'u32',
        title: 'Civics: Rights and Governance',
        topics: [
          {
            id: 't72',
            title: 'Political Parties',
            duration: '1 week',
            completed: true,
            description: 'Role of political parties in democracy',
            difficulty: 'easy',
            questionTypes: ['mcq', 'short-answer', 'theory'],
            learningObjectives: [
              'Understand role of political parties',
              'Identify types of party systems',
              'Analyze party functions'
            ],
            keyTerms: ['political party', 'opposition', 'coalition', 'manifesto'],
            bloomLevels: ['remember', 'understand', 'analyze']
          },
          {
            id: 't73',
            title: 'Popular Struggles',
            duration: '1 week',
            completed: true,
            description: 'Movements and social struggles',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer'],
            learningObjectives: [
              'Understand people\'s movements',
              'Analyze role of protests',
              'Evaluate democratic struggles'
            ],
            keyTerms: ['movement', 'protest', 'strike', 'civil society', 'pressure group'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          },
          {
            id: 't74',
            title: 'Outcomes of Democracy',
            duration: '1 week',
            completed: true,
            description: 'Evaluating democratic governance',
            difficulty: 'medium',
            questionTypes: ['short-answer', 'long-answer', 'theory'],
            learningObjectives: [
              'Evaluate democratic outcomes',
              'Compare democracy with other forms',
              'Analyze challenges in democracy'
            ],
            keyTerms: ['accountability', 'transparency', 'legitimacy', 'equality', 'dignity'],
            bloomLevels: ['understand', 'analyze', 'evaluate']
          }
        ]
      }
    ],
    totalTopics: 19,
    completedTopics: 13,
    progress: 68
  }
];

// Helper function to get subject by ID
export const getSubjectById = (id: string): CurriculumSubject | undefined => {
  return TN_BOARD_10TH_CURRICULUM.find(subject => subject.id === id);
};

// Helper function to get subject by name
export const getSubjectByName = (name: string): CurriculumSubject | undefined => {
  return TN_BOARD_10TH_CURRICULUM.find(
    subject => subject.name.toLowerCase() === name.toLowerCase()
  );
};

// Helper function to get all units for a subject
export const getSubjectUnits = (subjectId: string) => {
  const subject = getSubjectById(subjectId);
  return subject?.units || [];
};

// Helper function to get a specific unit
export const getUnitById = (subjectId: string, unitId: string) => {
  const subject = getSubjectById(subjectId);
  return subject?.units.find(unit => unit.id === unitId);
};

// Helper function to get all topics for a unit
export const getUnitTopics = (subjectId: string, unitId: string) => {
  const unit = getUnitById(subjectId, unitId);
  return unit?.topics || [];
};

// Helper function to get a specific topic
export const getTopicById = (subjectId: string, unitId: string, topicId: string) => {
  const unit = getUnitById(subjectId, unitId);
  return unit?.topics.find(topic => topic.id === topicId);
};

// Helper function to get topics by difficulty
export const getTopicsByDifficulty = (subjectId: string, difficulty: 'easy' | 'medium' | 'hard') => {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];

  const topics = [];
  for (const unit of subject.units) {
    for (const topic of unit.topics) {
      if (topic.difficulty === difficulty) {
        topics.push({ ...topic, unitTitle: unit.title });
      }
    }
  }
  return topics;
};

// Helper function to search topics by keyword
export const searchTopics = (keyword: string) => {
  const results = [];
  for (const subject of TN_BOARD_10TH_CURRICULUM) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        if (
          topic.title.toLowerCase().includes(keyword.toLowerCase()) ||
          topic.description.toLowerCase().includes(keyword.toLowerCase()) ||
          topic.keyTerms.some(term => term.toLowerCase().includes(keyword.toLowerCase()))
        ) {
          results.push({
            ...topic,
            subjectName: subject.name,
            subjectId: subject.id,
            unitTitle: unit.title,
            unitId: unit.id
          });
        }
      }
    }
  }
  return results;
};
