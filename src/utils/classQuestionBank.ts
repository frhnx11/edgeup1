export interface ClassQuestion {
  id: string;
  subject: 'Geography' | 'History' | 'Science' | 'Mathematics' | 'Economics' | 'Indian Polity' | 'Current Affairs';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number;
  correctAnswer: number; // Added for compatibility with Results2Page
  explanation: string;
  type?: 'conceptual' | 'factual' | 'analytical' | 'application' | 'calculation';
  concepts?: string[];
  hasVisual?: boolean;
}

export const classQuestions: ClassQuestion[] = [
  // Geography - Climate System Questions
  {
    id: 'geo-climate-1',
    subject: 'Geography',
    topic: 'Indian Climate Systems',
    difficulty: 'medium',
    question: 'Which of the following best describes the Indian monsoon?',
    options: [
      'Permanent winds throughout the year',
      'Seasonal reversal of wind direction',
      'Local winds affecting coastal areas',
      'High-altitude winds in mountainous regions'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The Indian monsoon is characterized by a seasonal reversal of wind direction, typically occurring twice a year.',
    type: 'conceptual',
    concepts: ['Monsoon', 'Wind patterns', 'Seasonal changes']
  },
  {
    id: 'geo-climate-2',
    subject: 'Geography',
    topic: 'Indian Climate Systems',
    difficulty: 'hard',
    question: 'What is the primary cause of winter rainfall in North India?',
    options: [
      'Southwest Monsoon',
      'Western Disturbances',
      'Bay of Bengal Depression',
      'El Niño'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Western Disturbances bring winter rainfall to North India, particularly important for rabi crops.',
    type: 'factual',
    concepts: ['Western Disturbances', 'Winter rainfall', 'Rabi crops']
  },
  {
    id: 'geo-climate-3',
    subject: 'Geography',
    topic: 'Indian Climate Systems',
    difficulty: 'medium',
    question: 'Which factor does NOT influence the Indian monsoon?',
    options: [
      'Tibetan Plateau',
      'Inter Tropical Convergence Zone',
      'Arctic Oscillation',
      'Indian Ocean Temperature'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Arctic Oscillation has minimal direct influence on the Indian monsoon system.',
    type: 'analytical',
    concepts: ['Monsoon factors', 'ITCZ', 'Ocean temperature']
  },
  {
    id: 'geo-climate-4',
    subject: 'Geography',
    topic: 'Indian Climate Systems',
    difficulty: 'hard',
    question: 'What is the Mango shower associated with?',
    options: [
      'Pre-monsoon rainfall in Kerala',
      'Post-monsoon rainfall in Bengal',
      'Winter rainfall in Punjab',
      'Summer rainfall in Northeast'
    ],
    correct: 0,
    explanation: 'Mango showers are pre-monsoon rainfall events in Kerala that help in the ripening of mangoes.'
  },
  {
    id: 'geo-climate-5',
    subject: 'Geography',
    topic: 'Indian Climate Systems',
    difficulty: 'medium',
    question: 'Which region receives the highest rainfall in India?',
    options: [
      'Mawsynram, Meghalaya',
      'Mumbai, Maharashtra',
      'Mahabaleshwar, Maharashtra',
      'Agumbe, Karnataka'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'Mawsynram in Meghalaya receives the highest rainfall in India.',
    type: 'factual',
    concepts: ['Rainfall', 'Climate zones', 'Meghalaya']
  },

  // History - Freedom Movement Questions
  {
    id: 'hist-freedom-1',
    subject: 'History',
    topic: 'Modern India: Freedom Movement',
    difficulty: 'medium',
    question: 'Which event led to the launch of the Non-Cooperation Movement?',
    options: [
      'Jallianwala Bagh Massacre',
      'Chauri Chaura Incident',
      'Partition of Bengal',
      'Simon Commission'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'The Jallianwala Bagh Massacre was a key factor in launching the Non-Cooperation Movement.',
    type: 'factual',
    concepts: ['Non-Cooperation Movement', 'Jallianwala Bagh', 'Gandhi']
  },
  {
    id: 'hist-freedom-2',
    subject: 'History',
    topic: 'Modern India: Freedom Movement',
    difficulty: 'hard',
    question: 'Who among the following was NOT a part of the Moderate phase of Indian National Congress?',
    options: [
      'Dadabhai Naoroji',
      'Bal Gangadhar Tilak',
      'Gopal Krishna Gokhale',
      'Pherozeshah Mehta'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Bal Gangadhar Tilak was a prominent leader of the Extremist phase, not the Moderate phase.',
    type: 'analytical',
    concepts: ['INC Moderates', 'INC Extremists', 'Tilak']
  },
  {
    id: 'hist-freedom-3',
    subject: 'History',
    topic: 'Modern India: Freedom Movement',
    difficulty: 'medium',
    question: 'Which movement was launched after the failure of the Cripps Mission?',
    options: [
      'Non-Cooperation Movement',
      'Civil Disobedience Movement',
      'Quit India Movement',
      'Swadeshi Movement'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The Quit India Movement was launched in 1942 after the failure of the Cripps Mission.',
    type: 'factual',
    concepts: ['Quit India Movement', 'Cripps Mission', '1942']
  },
  
  // Science - Physics Questions
  {
    id: 'sci-physics-1',
    subject: 'Science',
    topic: 'Laws of Motion',
    difficulty: 'easy',
    question: 'Which of Newton\'s laws states that F = ma?',
    options: [
      'First Law of Motion',
      'Second Law of Motion',
      'Third Law of Motion',
      'Law of Universal Gravitation'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma).',
    type: 'factual',
    concepts: ['Newton\'s Laws', 'Force', 'Mass', 'Acceleration']
  },
  {
    id: 'sci-physics-2',
    subject: 'Science',
    topic: 'Laws of Motion',
    difficulty: 'medium',
    question: 'A car of mass 1000 kg accelerates at 2 m/s². What is the net force acting on it?',
    options: [
      '500 N',
      '1000 N',
      '2000 N',
      '5000 N'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Using F = ma, Force = 1000 kg × 2 m/s² = 2000 N',
    type: 'calculation',
    concepts: ['Force calculation', 'Newton\'s Second Law', 'Applied physics']
  },
  {
    id: 'sci-physics-3',
    subject: 'Science',
    topic: 'Laws of Motion',
    difficulty: 'hard',
    question: 'Two objects of masses 5 kg and 10 kg are connected by a light string over a frictionless pulley. What is the acceleration of the system?',
    options: [
      '3.3 m/s²',
      '6.7 m/s²',
      '5 m/s²',
      '10 m/s²'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'Using a = (m₂ - m₁)g / (m₁ + m₂) = (10-5)×10 / (10+5) = 50/15 = 3.3 m/s²',
    type: 'application',
    concepts: ['Atwood machine', 'Tension', 'System acceleration']
  },
  
  // Science - Chemistry Questions
  {
    id: 'sci-chem-1',
    subject: 'Science',
    topic: 'Periodic Table',
    difficulty: 'easy',
    question: 'Which element has the atomic number 6?',
    options: [
      'Oxygen',
      'Carbon',
      'Nitrogen',
      'Boron'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Carbon has atomic number 6, meaning it has 6 protons in its nucleus.',
    type: 'factual',
    concepts: ['Atomic number', 'Periodic table', 'Elements']
  },
  {
    id: 'sci-chem-2',
    subject: 'Science',
    topic: 'Chemical Reactions',
    difficulty: 'medium',
    question: 'What type of reaction is: 2H₂ + O₂ → 2H₂O?',
    options: [
      'Decomposition reaction',
      'Combination reaction',
      'Displacement reaction',
      'Double displacement reaction'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'This is a combination reaction where hydrogen and oxygen combine to form water.',
    type: 'conceptual',
    concepts: ['Combination reaction', 'Chemical equations', 'Water formation']
  },
  
  // Mathematics Questions
  {
    id: 'math-algebra-1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    difficulty: 'medium',
    question: 'What are the roots of the equation x² - 5x + 6 = 0?',
    options: [
      'x = 1, x = 6',
      'x = 2, x = 3',
      'x = -2, x = -3',
      'x = 0, x = 5'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3',
    type: 'calculation',
    concepts: ['Quadratic equations', 'Factorization', 'Roots']
  },
  {
    id: 'math-algebra-2',
    subject: 'Mathematics',
    topic: 'Linear Equations',
    difficulty: 'easy',
    question: 'Solve for x: 3x + 7 = 22',
    options: [
      'x = 5',
      'x = 10',
      'x = 15',
      'x = 3'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: '3x + 7 = 22 → 3x = 15 → x = 5',
    type: 'calculation',
    concepts: ['Linear equations', 'Algebraic manipulation']
  },
  {
    id: 'math-geometry-1',
    subject: 'Mathematics',
    topic: 'Triangles',
    difficulty: 'hard',
    question: 'In a right triangle with hypotenuse 13 cm and one side 5 cm, what is the length of the other side?',
    options: [
      '8 cm',
      '10 cm',
      '12 cm',
      '14 cm'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Using Pythagorean theorem: a² + b² = c² → 5² + b² = 13² → b² = 169 - 25 = 144 → b = 12',
    type: 'application',
    concepts: ['Pythagorean theorem', 'Right triangles', 'Problem solving']
  },
  {
    id: 'math-stats-1',
    subject: 'Mathematics',
    topic: 'Statistics',
    difficulty: 'medium',
    question: 'What is the mean of the data set: 12, 15, 18, 20, 25?',
    options: [
      '16',
      '17',
      '18',
      '19'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Mean = (12 + 15 + 18 + 20 + 25) / 5 = 90 / 5 = 18',
    type: 'calculation',
    concepts: ['Mean', 'Average', 'Central tendency']
  },
  
  // More Geography Questions
  {
    id: 'geo-resources-1',
    subject: 'Geography',
    topic: 'Natural Resources',
    difficulty: 'medium',
    question: 'Which state in India is the largest producer of coal?',
    options: [
      'Jharkhand',
      'Chhattisgarh',
      'Odisha',
      'West Bengal'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Odisha is currently the largest producer of coal in India.',
    type: 'factual',
    concepts: ['Coal production', 'Mineral resources', 'State-wise production']
  },
  {
    id: 'geo-agri-1',
    subject: 'Geography',
    topic: 'Agriculture',
    difficulty: 'easy',
    question: 'Which crop is known as the "Golden Fiber"?',
    options: [
      'Cotton',
      'Jute',
      'Silk',
      'Wool'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Jute is known as the Golden Fiber due to its golden brown color and economic importance.',
    type: 'factual',
    concepts: ['Cash crops', 'Jute', 'Agricultural products']
  },
  
  // More History Questions
  {
    id: 'hist-ancient-1',
    subject: 'History',
    topic: 'Ancient India',
    difficulty: 'medium',
    question: 'Which Mauryan ruler is known for spreading Buddhism?',
    options: [
      'Chandragupta Maurya',
      'Bindusara',
      'Ashoka',
      'Brihadratha'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Emperor Ashoka embraced Buddhism after the Kalinga War and spread it across his empire.',
    type: 'factual',
    concepts: ['Mauryan Empire', 'Buddhism', 'Ashoka']
  },
  {
    id: 'hist-medieval-1',
    subject: 'History',
    topic: 'Medieval India',
    difficulty: 'hard',
    question: 'The Battle of Tarain (1192) was fought between Muhammad Ghori and which ruler?',
    options: [
      'Prithviraj Chauhan',
      'Jaichand',
      'Bhoja',
      'Anangpal'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'The Second Battle of Tarain in 1192 was fought between Muhammad Ghori and Prithviraj Chauhan.',
    type: 'factual',
    concepts: ['Medieval battles', 'Delhi Sultanate', 'Rajput kingdoms']
  },
  {
    id: 'hist-freedom-4',
    subject: 'History',
    topic: 'Modern India: Freedom Movement',
    difficulty: 'hard',
    question: 'What was the main objective of the Indian National Army?',
    options: [
      'To gain independence through non-violence',
      'To establish a communist state',
      'To liberate India through armed struggle',
      'To negotiate with British for dominion status'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The Indian National Army under Subhas Chandra Bose aimed to liberate India through armed struggle.',
    type: 'factual',
    concepts: ['INA', 'Subhas Chandra Bose', 'Armed struggle']
  },

  // Geography - Weather and Climate Questions (For Mr. ILAN CHEZHIAN's class)
  {
    id: 'geo-weather-1',
    subject: 'Geography',
    topic: 'Weather and Climate',
    difficulty: 'medium',
    question: 'Which atmospheric layer contains most of the weather phenomena?',
    options: [
      'Stratosphere',
      'Troposphere',
      'Mesosphere',
      'Thermosphere'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The troposphere is the lowest atmospheric layer where all weather phenomena occur.',
    type: 'factual',
    concepts: ['Atmospheric layers', 'Weather', 'Troposphere']
  },
  {
    id: 'geo-weather-2',
    subject: 'Geography',
    topic: 'Weather and Climate',
    difficulty: 'hard',
    question: 'What is the primary difference between weather and climate?',
    options: [
      'Weather is regional, climate is global',
      'Weather is short-term atmospheric conditions, climate is long-term average',
      'Weather affects temperature only, climate affects all elements',
      'Weather is predictable, climate is not'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Weather refers to short-term atmospheric conditions while climate is the long-term average of weather patterns.',
    type: 'conceptual',
    concepts: ['Weather vs Climate', 'Atmospheric conditions', 'Time scales']
  },
  {
    id: 'geo-weather-3',
    subject: 'Geography',
    topic: 'Weather and Climate',
    difficulty: 'medium',
    question: 'Which factor is NOT a major control of climate?',
    options: [
      'Latitude',
      'Altitude',
      'Population density',
      'Distance from sea'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Population density is not a natural control of climate, though it may influence local microclimates.',
    type: 'analytical',
    concepts: ['Climate controls', 'Natural factors', 'Human influence']
  },
  {
    id: 'geo-weather-4',
    subject: 'Geography',
    topic: 'Weather and Climate',
    difficulty: 'easy',
    question: 'What instrument is used to measure atmospheric pressure?',
    options: [
      'Thermometer',
      'Barometer',
      'Anemometer',
      'Hygrometer'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'A barometer is used to measure atmospheric pressure.',
    type: 'factual',
    concepts: ['Weather instruments', 'Atmospheric pressure', 'Barometer']
  },
  {
    id: 'geo-weather-5',
    subject: 'Geography',
    topic: 'Weather and Climate',
    difficulty: 'hard',
    question: 'According to Köppen climate classification, what does "Aw" represent?',
    options: [
      'Tropical wet climate',
      'Tropical savanna climate',
      'Arid desert climate',
      'Alpine climate'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'In Köppen classification, "Aw" represents tropical savanna climate with dry winter.',
    type: 'factual',
    concepts: ['Köppen classification', 'Climate types', 'Tropical savanna']
  },

  // Geography - Indian Monsoon System Questions
  {
    id: 'geo-monsoon-1',
    subject: 'Geography',
    topic: 'Indian Monsoon System',
    difficulty: 'medium',
    question: 'When does the southwest monsoon typically arrive in Kerala?',
    options: [
      'April 1st',
      'May 15th',
      'June 1st',
      'July 1st'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The southwest monsoon typically arrives in Kerala around June 1st.',
    type: 'factual',
    concepts: ['Southwest monsoon', 'Monsoon onset', 'Kerala']
  },
  {
    id: 'geo-monsoon-2',
    subject: 'Geography',
    topic: 'Indian Monsoon System',
    difficulty: 'hard',
    question: 'What role does the Tibetan Plateau play in the Indian monsoon?',
    options: [
      'It blocks monsoon winds',
      'It creates high pressure that prevents monsoon',
      'It acts as a heat engine driving monsoon circulation',
      'It has no significant role'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The Tibetan Plateau acts as a heat engine, creating low pressure that helps drive monsoon circulation.',
    type: 'conceptual',
    concepts: ['Tibetan Plateau', 'Monsoon mechanism', 'Heat engine']
  },
  {
    id: 'geo-monsoon-3',
    subject: 'Geography',
    topic: 'Indian Monsoon System',
    difficulty: 'medium',
    question: 'Which phenomenon is associated with weak monsoons in India?',
    options: [
      'La Niña',
      'El Niño',
      'Indian Ocean Dipole (Negative)',
      'Arctic Oscillation'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'El Niño is generally associated with weak monsoons and drought conditions in India.',
    type: 'analytical',
    concepts: ['El Niño', 'Monsoon variability', 'Ocean-atmosphere interaction']
  },
  {
    id: 'geo-monsoon-4',
    subject: 'Geography',
    topic: 'Indian Monsoon System',
    difficulty: 'easy',
    question: 'Which winds bring rainfall to Tamil Nadu during winter?',
    options: [
      'Southwest monsoon',
      'Northeast monsoon',
      'Western disturbances',
      'Kalbaisakhi'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The Northeast monsoon (retreating monsoon) brings rainfall to Tamil Nadu during winter months.',
    type: 'factual',
    concepts: ['Northeast monsoon', 'Tamil Nadu', 'Winter rainfall']
  },
  {
    id: 'geo-monsoon-5',
    subject: 'Geography',
    topic: 'Indian Monsoon System',
    difficulty: 'hard',
    question: 'What percentage of India\'s annual rainfall comes from the Southwest monsoon?',
    options: [
      'About 50%',
      'About 65%',
      'About 75%',
      'About 90%'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The Southwest monsoon contributes about 75% of India\'s total annual rainfall.',
    type: 'factual',
    concepts: ['Southwest monsoon', 'Annual rainfall', 'Monsoon contribution']
  },

  // History - Quit India Movement 1942 Questions
  {
    id: 'hist-quit-1',
    subject: 'History',
    topic: 'Quit India Movement 1942',
    difficulty: 'medium',
    question: 'What was Gandhi\'s famous slogan during the Quit India Movement?',
    options: [
      'Jai Hind',
      'Vande Mataram',
      'Do or Die',
      'Inquilab Zindabad'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Gandhi gave the famous slogan "Do or Die" (Karo ya Maro) during the Quit India Movement.',
    type: 'factual',
    concepts: ['Quit India', 'Gandhi', 'Freedom slogans']
  },
  {
    id: 'hist-quit-2',
    subject: 'History',
    topic: 'Quit India Movement 1942',
    difficulty: 'easy',
    question: 'On which date was the Quit India Resolution passed?',
    options: [
      'August 8, 1942',
      'August 15, 1942',
      'September 1, 1942',
      'October 2, 1942'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'The Quit India Resolution was passed on August 8, 1942, at the Bombay session of AICC.',
    type: 'factual',
    concepts: ['Quit India Resolution', 'AICC', 'August Kranti']
  },
  {
    id: 'hist-quit-3',
    subject: 'History',
    topic: 'Quit India Movement 1942',
    difficulty: 'hard',
    question: 'Which leader gave the alternative slogan "Divide and Quit"?',
    options: [
      'Subhas Chandra Bose',
      'Mohammad Ali Jinnah',
      'B.R. Ambedkar',
      'V.D. Savarkar'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Mohammad Ali Jinnah and the Muslim League gave the slogan "Divide and Quit" opposing the Quit India Movement.',
    type: 'factual',
    concepts: ['Muslim League', 'Jinnah', 'Partition politics']
  },
  {
    id: 'hist-quit-4',
    subject: 'History',
    topic: 'Quit India Movement 1942',
    difficulty: 'medium',
    question: 'Where was Gandhi detained after the launch of Quit India Movement?',
    options: [
      'Cellular Jail, Andaman',
      'Yerwada Jail, Pune',
      'Aga Khan Palace, Pune',
      'Ahmednagar Fort'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Gandhi was detained at Aga Khan Palace in Pune after the launch of Quit India Movement.',
    type: 'factual',
    concepts: ['Gandhi imprisonment', 'Aga Khan Palace', '1942 arrests']
  },
  {
    id: 'hist-quit-5',
    subject: 'History',
    topic: 'Quit India Movement 1942',
    difficulty: 'hard',
    question: 'Which underground radio operated during Quit India Movement?',
    options: [
      'Azad Hind Radio',
      'Congress Radio',
      'Freedom Radio',
      'Voice of Freedom'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Congress Radio operated as an underground radio station during the Quit India Movement.',
    type: 'factual',
    concepts: ['Underground activities', 'Congress Radio', 'Usha Mehta']
  },

  // Economics - Fiscal Policy and Budget Analysis Questions
  {
    id: 'eco-fiscal-1',
    subject: 'Economics',
    topic: 'Fiscal Policy and Budget Analysis',
    difficulty: 'medium',
    question: 'What is fiscal deficit?',
    options: [
      'Total revenue minus total expenditure',
      'Total expenditure minus total revenue',
      'Total expenditure minus total receipts excluding borrowings',
      'Total borrowings of the government'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Fiscal deficit is total expenditure minus total receipts excluding borrowings.',
    type: 'conceptual',
    concepts: ['Fiscal deficit', 'Budget components', 'Government finance']
  },
  {
    id: 'eco-fiscal-2',
    subject: 'Economics',
    topic: 'Fiscal Policy and Budget Analysis',
    difficulty: 'easy',
    question: 'Which article of the Indian Constitution mandates the presentation of Annual Budget?',
    options: [
      'Article 110',
      'Article 111',
      'Article 112',
      'Article 113'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Article 112 of the Indian Constitution mandates the presentation of Annual Financial Statement (Budget).',
    type: 'factual',
    concepts: ['Constitution', 'Article 112', 'Annual Budget']
  },
  {
    id: 'eco-fiscal-3',
    subject: 'Economics',
    topic: 'Fiscal Policy and Budget Analysis',
    difficulty: 'hard',
    question: 'What is the FRBM Act target for fiscal deficit as percentage of GDP?',
    options: [
      '2%',
      '3%',
      '4%',
      '5%'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The FRBM Act targets fiscal deficit at 3% of GDP.',
    type: 'factual',
    concepts: ['FRBM Act', 'Fiscal deficit target', 'GDP percentage']
  },
  {
    id: 'eco-fiscal-4',
    subject: 'Economics',
    topic: 'Fiscal Policy and Budget Analysis',
    difficulty: 'medium',
    question: 'What is revenue deficit?',
    options: [
      'Revenue expenditure minus capital receipts',
      'Revenue expenditure minus revenue receipts',
      'Total expenditure minus total revenue',
      'Capital expenditure minus revenue receipts'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Revenue deficit is revenue expenditure minus revenue receipts.',
    type: 'conceptual',
    concepts: ['Revenue deficit', 'Revenue expenditure', 'Revenue receipts']
  },
  {
    id: 'eco-fiscal-5',
    subject: 'Economics',
    topic: 'Fiscal Policy and Budget Analysis',
    difficulty: 'hard',
    question: 'Which committee recommended the abolition of Planning Commission?',
    options: [
      'Kelkar Committee',
      'Rangarajan Committee',
      'Narasimham Committee',
      'None, it was a government decision'
    ],
    correct: 3,
    correctAnswer: 3,
    explanation: 'The Planning Commission was abolished by government decision in 2014, not based on any committee recommendation.',
    type: 'factual',
    concepts: ['Planning Commission', 'NITI Aayog', 'Economic reforms']
  },

  // Indian Polity - Parliamentary System and Procedures Questions
  {
    id: 'pol-parl-1',
    subject: 'Indian Polity',
    topic: 'Parliamentary System and Procedures',
    difficulty: 'medium',
    question: 'What is the quorum required for Parliament proceedings?',
    options: [
      '1/5th of total members',
      '1/8th of total members',
      '1/10th of total members',
      '1/3rd of total members'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'The quorum for Parliament proceedings is 1/10th of the total members of the House.',
    type: 'factual',
    concepts: ['Quorum', 'Parliamentary procedures', 'House rules']
  },
  {
    id: 'pol-parl-2',
    subject: 'Indian Polity',
    topic: 'Parliamentary System and Procedures',
    difficulty: 'easy',
    question: 'What is Zero Hour in Parliament?',
    options: [
      'First hour of the session',
      'Last hour of the session',
      'Time immediately after Question Hour',
      'Time before Question Hour'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Zero Hour is the time immediately after Question Hour when MPs can raise urgent matters.',
    type: 'factual',
    concepts: ['Zero Hour', 'Parliamentary devices', 'Urgent matters']
  },
  {
    id: 'pol-parl-3',
    subject: 'Indian Polity',
    topic: 'Parliamentary System and Procedures',
    difficulty: 'hard',
    question: 'Which motion does not require prior notice in Parliament?',
    options: [
      'Adjournment Motion',
      'No-Confidence Motion',
      'Calling Attention Motion',
      'Point of Order'
    ],
    correct: 3,
    correctAnswer: 3,
    explanation: 'Point of Order can be raised without prior notice to draw attention to breach of rules.',
    type: 'analytical',
    concepts: ['Parliamentary motions', 'Point of Order', 'House procedures']
  },
  {
    id: 'pol-parl-4',
    subject: 'Indian Polity',
    topic: 'Parliamentary System and Procedures',
    difficulty: 'medium',
    question: 'How many sessions of Parliament are mandatory in a year?',
    options: [
      'One',
      'Two',
      'Three',
      'Four'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The Constitution requires at least two sessions of Parliament per year with not more than 6 months gap.',
    type: 'factual',
    concepts: ['Parliamentary sessions', 'Constitutional requirement', 'Session frequency']
  },
  {
    id: 'pol-parl-5',
    subject: 'Indian Polity',
    topic: 'Parliamentary System and Procedures',
    difficulty: 'hard',
    question: 'What is a "Guillotine" in Parliamentary procedure?',
    options: [
      'Suspension of a member',
      'Termination of debate',
      'Putting all remaining demands of grants to vote at once',
      'Adjournment of the House'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Guillotine refers to putting all remaining demands for grants to vote at once without further discussion.',
    type: 'conceptual',
    concepts: ['Guillotine', 'Budget procedures', 'Demands for grants']
  },

  // Current Affairs - G20 Summit & Global Economy Questions
  {
    id: 'ca-g20-1',
    subject: 'Current Affairs',
    topic: 'G20 Summit & Global Economy',
    difficulty: 'easy',
    question: 'Where was the 2023 G20 Summit held?',
    options: [
      'Mumbai',
      'New Delhi',
      'Bengaluru',
      'Chennai'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The 2023 G20 Summit was held in New Delhi under India\'s presidency.',
    type: 'factual',
    concepts: ['G20 Summit', 'India presidency', 'New Delhi']
  },
  {
    id: 'ca-g20-2',
    subject: 'Current Affairs',
    topic: 'G20 Summit & Global Economy',
    difficulty: 'medium',
    question: 'What was the theme of India\'s G20 Presidency?',
    options: [
      'One Earth, One Family, One Future',
      'Building Back Better',
      'Recover Together, Recover Stronger',
      'Shaping an Interconnected World'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'The theme of India\'s G20 Presidency was "One Earth, One Family, One Future" (Vasudhaiva Kutumbakam).',
    type: 'factual',
    concepts: ['G20 theme', 'Vasudhaiva Kutumbakam', 'India presidency']
  },
  {
    id: 'ca-g20-3',
    subject: 'Current Affairs',
    topic: 'G20 Summit & Global Economy',
    difficulty: 'hard',
    question: 'Which country will host the G20 Summit in 2024?',
    options: [
      'Brazil',
      'South Africa',
      'Japan',
      'Germany'
    ],
    correct: 0,
    correctAnswer: 0,
    explanation: 'Brazil will host the G20 Summit in 2024 after India\'s presidency.',
    type: 'factual',
    concepts: ['G20 rotation', 'Brazil presidency', 'Future summits']
  },
  {
    id: 'ca-g20-4',
    subject: 'Current Affairs',
    topic: 'G20 Summit & Global Economy',
    difficulty: 'medium',
    question: 'What major inclusion happened during India\'s G20 presidency?',
    options: [
      'Addition of ASEAN as permanent member',
      'Inclusion of African Union as permanent member',
      'Addition of Pacific Island nations',
      'Inclusion of SAARC as observer'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The African Union was included as a permanent member of G20 during India\'s presidency.',
    type: 'factual',
    concepts: ['African Union', 'G20 expansion', 'India achievement']
  },
  {
    id: 'ca-g20-5',
    subject: 'Current Affairs',
    topic: 'G20 Summit & Global Economy',
    difficulty: 'easy',
    question: 'What percentage of global GDP does G20 represent?',
    options: [
      'About 60%',
      'About 70%',
      'About 80%',
      'About 90%'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'G20 countries represent about 80% of global GDP.',
    type: 'factual',
    concepts: ['G20 economy', 'Global GDP', 'Economic significance']
  },

  // Science - Climate Change & Sustainability Questions
  {
    id: 'sci-climate-1',
    subject: 'Science',
    topic: 'Climate Change & Sustainability',
    difficulty: 'medium',
    question: 'What is the main greenhouse gas responsible for climate change?',
    options: [
      'Methane',
      'Carbon dioxide',
      'Water vapor',
      'Nitrous oxide'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Carbon dioxide (CO2) is the main greenhouse gas responsible for climate change due to human activities.',
    type: 'factual',
    concepts: ['Greenhouse gases', 'CO2', 'Climate change']
  },
  {
    id: 'sci-climate-2',
    subject: 'Science',
    topic: 'Climate Change & Sustainability',
    difficulty: 'easy',
    question: 'What does the Paris Agreement aim to limit global temperature rise to?',
    options: [
      '1°C above pre-industrial levels',
      '1.5°C above pre-industrial levels',
      '2°C above pre-industrial levels',
      '2.5°C above pre-industrial levels'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'The Paris Agreement aims to limit global temperature rise to 1.5°C above pre-industrial levels.',
    type: 'factual',
    concepts: ['Paris Agreement', 'Temperature targets', 'Climate goals']
  },
  {
    id: 'sci-climate-3',
    subject: 'Science',
    topic: 'Climate Change & Sustainability',
    difficulty: 'hard',
    question: 'What is India\'s target for renewable energy capacity by 2030?',
    options: [
      '175 GW',
      '300 GW',
      '450 GW',
      '500 GW'
    ],
    correct: 3,
    correctAnswer: 3,
    explanation: 'India has set a target of 500 GW renewable energy capacity by 2030.',
    type: 'factual',
    concepts: ['Renewable energy', 'India targets', 'Climate commitments']
  },
  {
    id: 'sci-climate-4',
    subject: 'Science',
    topic: 'Climate Change & Sustainability',
    difficulty: 'medium',
    question: 'Which sector contributes most to global greenhouse gas emissions?',
    options: [
      'Transportation',
      'Agriculture',
      'Energy (electricity/heat)',
      'Manufacturing'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Energy sector (electricity and heat production) contributes most to global greenhouse gas emissions.',
    type: 'analytical',
    concepts: ['Emission sectors', 'Energy emissions', 'Climate contributors']
  },
  {
    id: 'sci-climate-5',
    subject: 'Science',
    topic: 'Climate Change & Sustainability',
    difficulty: 'medium',
    question: 'What is carbon neutrality?',
    options: [
      'Eliminating all carbon emissions',
      'Balancing carbon emissions with carbon removal',
      'Using only renewable energy',
      'Reducing emissions by 50%'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'Carbon neutrality means balancing carbon emissions with carbon removal or offsetting.',
    type: 'conceptual',
    concepts: ['Carbon neutrality', 'Net zero', 'Climate targets']
  },

  // Economics - Digital Economy & FinTech Questions
  {
    id: 'eco-digital-1',
    subject: 'Economics',
    topic: 'Digital Economy & FinTech',
    difficulty: 'easy',
    question: 'What does UPI stand for?',
    options: [
      'Universal Payment Interface',
      'Unified Payments Interface',
      'United Payment Infrastructure',
      'Uniform Payment Initiative'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'UPI stands for Unified Payments Interface, India\'s instant payment system.',
    type: 'factual',
    concepts: ['UPI', 'Digital payments', 'FinTech']
  },
  {
    id: 'eco-digital-2',
    subject: 'Economics',
    topic: 'Digital Economy & FinTech',
    difficulty: 'medium',
    question: 'Which organization developed UPI?',
    options: [
      'Reserve Bank of India',
      'National Payments Corporation of India',
      'State Bank of India',
      'Ministry of Finance'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'National Payments Corporation of India (NPCI) developed the UPI system.',
    type: 'factual',
    concepts: ['NPCI', 'UPI development', 'Payment infrastructure']
  },
  {
    id: 'eco-digital-3',
    subject: 'Economics',
    topic: 'Digital Economy & FinTech',
    difficulty: 'hard',
    question: 'What is the name of RBI\'s digital currency pilot?',
    options: [
      'Digital Rupee',
      'e-Rupee',
      'Crypto Rupee',
      'Virtual Rupee'
    ],
    correct: 1,
    correctAnswer: 1,
    explanation: 'RBI\'s Central Bank Digital Currency (CBDC) is called e-Rupee.',
    type: 'factual',
    concepts: ['CBDC', 'e-Rupee', 'Digital currency']
  },
  {
    id: 'eco-digital-4',
    subject: 'Economics',
    topic: 'Digital Economy & FinTech',
    difficulty: 'medium',
    question: 'What percentage of India\'s GDP is targeted from digital economy by 2025?',
    options: [
      '10%',
      '15%',
      '20%',
      '25%'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'India targets digital economy to contribute 20% of GDP by 2025.',
    type: 'factual',
    concepts: ['Digital economy', 'GDP target', 'Economic goals']
  },
  {
    id: 'eco-digital-5',
    subject: 'Economics',
    topic: 'Digital Economy & FinTech',
    difficulty: 'easy',
    question: 'Which of these is NOT a digital payment method?',
    options: [
      'NEFT',
      'IMPS',
      'Demand Draft',
      'RTGS'
    ],
    correct: 2,
    correctAnswer: 2,
    explanation: 'Demand Draft is a physical instrument, not a digital payment method.',
    type: 'analytical',
    concepts: ['Payment methods', 'Digital vs Physical', 'Banking instruments']
  }
];