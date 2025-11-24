// Question Bank Types
export interface Question {
  id: string;
  type: 'multiple-choice';
  section: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

// Question Bank Types with multimedia support
export interface MultimediaQuestion extends Question {
  media?: {
    type: 'image' | 'audio' | 'video' | 'animation';
    url?: string;
    data?: string; // For inline SVG or canvas data
    duration?: number; // For audio/video
    autoplay?: boolean;
  };
  interactive?: {
    type: 'drag-drop' | 'click-sequence' | 'draw' | 'rotate';
    data?: any;
  };
}

// VARK Questions - Advanced multimedia assessments
export const varkQuestions: MultimediaQuestion[] = [
  {
    id: 'vark-1',
    type: 'multiple-choice',
    section: 'VARK - Visual Pattern Recognition',
    difficulty: 'hard',
    text: 'Watch this animated sequence carefully. What comes next in the pattern?',
    media: {
      type: 'animation',
      data: `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.5); } }
          .shape1 { animation: rotate 2s linear infinite; }
          .shape2 { animation: scale 2s ease-in-out infinite; }
        </style>
        <rect class="shape1" x="50" y="25" width="50" height="50" fill="#3B82F6"/>
        <circle class="shape2" cx="175" cy="50" r="25" fill="#EF4444"/>
        <polygon class="shape1" points="275,25 300,75 250,75" fill="#10B981"/>
        <text x="350" y="60" font-size="40" fill="#6B7280">?</text>
      </svg>`
    },
    options: [
      'A scaling square',
      'A rotating circle',
      'A scaling triangle',
      'A rotating pentagon'
    ],
    correct: 0,
    explanation: 'Pattern alternates between rotating and scaling animations with shape progression'
  },
  {
    id: 'vark-2',
    type: 'multiple-choice',
    section: 'VARK - Audio Frequency Analysis',
    difficulty: 'hard',
    text: 'Listen to this audio sequence. Which frequency pattern is being demonstrated?',
    media: {
      type: 'audio',
      url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLYiTcIGWi77eeeTRAMUJzfDl+8',
      autoplay: true,
      duration: 3
    },
    options: [
      'Ascending harmonic series (100Hz, 200Hz, 300Hz)',
      'Descending chromatic scale',
      'Fibonacci frequency sequence',
      'Equal temperament intervals'
    ],
    correct: 0,
    explanation: 'The audio demonstrates an ascending harmonic series pattern'
  },
  {
    id: 'vark-3',
    type: 'multiple-choice',
    section: 'VARK - Visual Memory Test',
    difficulty: 'hard',
    text: 'Study this image for 5 seconds, then answer: Which element was in the bottom-right quadrant?',
    media: {
      type: 'image',
      data: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <style>
          .hide-after { animation: fadeOut 5s forwards; }
          @keyframes fadeOut { 0% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
        </style>
        <g class="hide-after">
          <rect x="0" y="0" width="200" height="200" fill="#FEF3C7"/>
          <circle cx="100" cy="100" r="50" fill="#F59E0B"/>
          <rect x="200" y="0" width="200" height="200" fill="#DBEAFE"/>
          <polygon points="300,50 350,150 250,150" fill="#3B82F6"/>
          <rect x="0" y="200" width="200" height="200" fill="#D1FAE5"/>
          <rect x="50" y="250" width="100" height="100" fill="#10B981"/>
          <rect x="200" y="200" width="200" height="200" fill="#FEE2E2"/>
          <path d="M250,250 Q350,250 350,350 Q250,350 250,250" fill="#EF4444"/>
        </g>
      </svg>`
    },
    options: [
      'Red curved shape',
      'Green square',
      'Blue triangle',
      'Orange circle'
    ],
    correct: 0,
    explanation: 'Tests visual memory - the red curved shape was in the bottom-right quadrant'
  },
  {
    id: 'vark-4',
    type: 'multiple-choice',
    section: 'VARK - Kinesthetic 3D Visualization',
    difficulty: 'hard',
    text: 'If this 3D shape is rotated 90° around the Y-axis, which view would you see?',
    media: {
      type: 'animation',
      data: `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .rotate3d { animation: rotateY 4s linear infinite; transform-style: preserve-3d; }
          @keyframes rotateY { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        </style>
        <g transform="translate(200,150)">
          <g class="rotate3d">
            <rect x="-50" y="-50" width="100" height="100" fill="#3B82F6" opacity="0.8"/>
            <rect x="-30" y="-30" width="60" height="60" fill="#EF4444" opacity="0.8" transform="translate(20,20)"/>
            <circle cx="0" cy="0" r="20" fill="#10B981" opacity="0.8"/>
          </g>
        </g>
      </svg>`
    },
    options: [
      'Circle in front, red square behind',
      'Blue square only',
      'All shapes aligned vertically',
      'Red square in front, circle behind'
    ],
    correct: 3,
    explanation: 'Tests 3D spatial rotation visualization'
  },
  {
    id: 'vark-5',
    type: 'multiple-choice',
    section: 'VARK - Audio-Visual Synchronization',
    difficulty: 'hard',
    text: 'Watch and listen to this multimedia pattern. What is the relationship between the visual and audio elements?',
    media: {
      type: 'video',
      url: '/videos/pattern-sync.mp4',
      duration: 5,
      autoplay: true
    },
    options: [
      'Each shape appears with a corresponding pitch',
      'Colors change with volume',
      'Movement speed matches tempo',
      'Shapes morph with frequency'
    ],
    correct: 0,
    explanation: 'Tests audio-visual pattern correlation and synchronization perception'
  },
  {
    id: 'vark-6',
    type: 'multiple-choice',
    section: 'VARK - Sound Wave Analysis',
    difficulty: 'hard',
    text: 'Analyze this waveform visualization. What type of sound does it represent?',
    media: {
      type: 'animation',
      data: `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          .wave { animation: wave 2s linear infinite; }
          @keyframes wave { 0% { d: path("M0,100 Q100,50 200,100 T400,100"); } 50% { d: path("M0,100 Q100,150 200,100 T400,100"); } 100% { d: path("M0,100 Q100,50 200,100 T400,100"); } }
        </style>
        <path class="wave" d="M0,100 Q100,50 200,100 T400,100" fill="none" stroke="#3B82F6" stroke-width="2"/>
        <path d="M0,100 L400,100" stroke="#E5E7EB" stroke-width="1"/>
      </svg>`
    },
    options: [
      'Pure sine wave (single frequency)',
      'Square wave (odd harmonics)',
      'Sawtooth wave (all harmonics)',
      'White noise (random frequencies)'
    ],
    correct: 0,
    explanation: 'Visual representation shows a pure sine wave pattern'
  },
  {
    id: 'vark-7',
    type: 'multiple-choice',
    section: 'VARK - Interactive Color Theory',
    difficulty: 'hard',
    text: 'Based on this color mixing demonstration, what color would result from combining the shown primaries?',
    media: {
      type: 'animation',
      data: `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="multiply">
            <feBlend mode="multiply"/>
          </filter>
        </defs>
        <circle cx="150" cy="120" r="80" fill="#FF0000" opacity="0.7"/>
        <circle cx="250" cy="120" r="80" fill="#0000FF" opacity="0.7"/>
        <circle cx="200" cy="180" r="80" fill="#FFFF00" opacity="0.7"/>
        <text x="200" y="260" text-anchor="middle" font-size="20">RGB Color Space</text>
      </svg>`
    },
    options: [
      'Black (all colors absorbed)',
      'White (all colors reflected)',
      'Brown (subtractive mixing)',
      'Gray (neutral mixture)'
    ],
    correct: 0,
    explanation: 'In subtractive color mixing, combining all primaries produces black'
  },
  {
    id: 'vark-8',
    type: 'multiple-choice',
    section: 'VARK - Motion Tracking',
    difficulty: 'hard',
    text: 'Track the moving dot and identify its path equation:',
    media: {
      type: 'animation',
      data: `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .dot { animation: parametric 4s linear infinite; }
          @keyframes parametric {
            0% { cx: 200; cy: 150; }
            25% { cx: 300; cy: 100; }
            50% { cx: 200; cy: 50; }
            75% { cx: 100; cy: 100; }
            100% { cx: 200; cy: 150; }
          }
        </style>
        <circle class="dot" r="10" fill="#EF4444"/>
        <circle cx="200" cy="150" r="100" fill="none" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="5,5"/>
      </svg>`
    },
    options: [
      'Circle: x² + y² = r²',
      'Ellipse: x²/a² + y²/b² = 1',
      'Parabola: y = ax²',
      'Lissajous: x = A sin(at), y = B sin(bt)'
    ],
    correct: 0,
    explanation: 'The dot traces a circular path around the center point'
  }
];

// PASCO Questions (7 questions)
export const pascoQuestions: MultimediaQuestion[] = [
  {
    id: 'pasco-1',
    type: 'multiple-choice',
    section: 'PASCO - Logical Reasoning',
    difficulty: 'hard',
    text: 'If all roses are flowers, and some flowers fade quickly, which conclusion can be drawn?',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'All flowers are roses'
    ],
    correct: 1,
    explanation: 'This tests logical deduction and syllogistic reasoning'
  },
  {
    id: 'pasco-2',
    type: 'multiple-choice',
    section: 'PASCO - Analytical Ability',
    difficulty: 'hard',
    text: 'In a sequence: 2, 6, 12, 20, 30, what comes next?',
    options: ['42', '40', '36', '44'],
    correct: 0,
    explanation: 'Pattern: Add 4, then 6, then 8, then 10, then 12'
  },
  {
    id: 'pasco-3',
    type: 'multiple-choice',
    section: 'PASCO - Memory',
    difficulty: 'medium',
    text: 'After reading a passage about climate change, which detail would you most likely remember?',
    options: [
      'Specific temperature data',
      'The overall argument structure',
      'Key statistics and figures',
      'The conclusion and implications'
    ],
    correct: 3,
    explanation: 'Tests memory retention patterns'
  },
  {
    id: 'pasco-4',
    type: 'multiple-choice',
    section: 'PASCO - Spatial Ability',
    difficulty: 'hard',
    text: 'If a cube is painted red and cut into 27 smaller equal cubes, how many small cubes have exactly two red faces?',
    options: ['12', '8', '6', '4'],
    correct: 0,
    explanation: 'Tests spatial visualization'
  },
  {
    id: 'pasco-5',
    type: 'multiple-choice',
    section: 'PASCO - Decision Making',
    difficulty: 'medium',
    text: 'In a time-constrained situation with multiple tasks, which approach is most effective?',
    options: [
      'Complete tasks in order of difficulty',
      'Prioritize based on importance and urgency',
      'Delegate all possible tasks',
      'Work on multiple tasks simultaneously'
    ],
    correct: 1,
    explanation: 'Tests decision-making under pressure'
  },
  {
    id: 'pasco-6',
    type: 'multiple-choice',
    section: 'PASCO - Pattern Recognition',
    difficulty: 'hard',
    text: 'What pattern completes the sequence: AABABC, ABBACD, ABCADE, ?',
    options: ['ABCDAF', 'ABBCDE', 'ABCDEF', 'ACDABE'],
    correct: 0,
    explanation: 'Tests pattern recognition in sequences'
  },
  {
    id: 'pasco-7',
    type: 'multiple-choice',
    section: 'PASCO - Critical Thinking',
    difficulty: 'hard',
    text: 'Which statement best identifies a potential flaw in an argument?',
    options: [
      'Correlation implies causation',
      'Multiple sources cited',
      'Statistical evidence provided',
      'Expert opinions referenced'
    ],
    correct: 0,
    explanation: 'Tests critical analysis of arguments'
  }
];

// Subject Knowledge Questions (7 questions)
export const subjectQuestions: MultimediaQuestion[] = [
  {
    id: 'sub-1',
    type: 'multiple-choice',
    section: 'Indian Polity',
    difficulty: 'medium',
    text: 'Which Article of the Indian Constitution deals with the President\'s power to declare Financial Emergency?',
    options: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
    correct: 2,
    explanation: 'Article 360 deals with Financial Emergency'
  },
  {
    id: 'sub-2',
    type: 'multiple-choice',
    section: 'Economics',
    difficulty: 'hard',
    text: 'Which of the following is NOT a function of the Reserve Bank of India?',
    options: [
      'Banker to the Government',
      'Issue of currency',
      'Credit rating of companies',
      'Lender of last resort'
    ],
    correct: 2,
    explanation: 'Credit rating is done by credit rating agencies, not RBI'
  },
  {
    id: 'sub-3',
    type: 'multiple-choice',
    section: 'Geography',
    difficulty: 'medium',
    text: 'Which river forms the largest peninsular delta in India?',
    options: ['Godavari', 'Krishna', 'Kaveri', 'Mahanadi'],
    correct: 0,
    explanation: 'Godavari forms the largest peninsular delta'
  },
  {
    id: 'sub-4',
    type: 'multiple-choice',
    section: 'History',
    difficulty: 'hard',
    text: 'Who among the following was the founder of the Satya Shodhak Samaj?',
    options: [
      'Jyotirao Phule',
      'B.R. Ambedkar',
      'Savitribai Phule',
      'Rajarshi Shahu'
    ],
    correct: 0,
    explanation: 'Jyotirao Phule founded Satya Shodhak Samaj in 1873'
  },
  {
    id: 'sub-5',
    type: 'multiple-choice',
    section: 'Science',
    difficulty: 'medium',
    text: 'Which of the following is a renewable source of energy?',
    options: ['Coal', 'Natural Gas', 'Geothermal Energy', 'Petroleum'],
    correct: 2,
    explanation: 'Geothermal energy is a renewable source'
  },
  {
    id: 'sub-6',
    type: 'multiple-choice',
    section: 'Current Affairs',
    difficulty: 'medium',
    text: 'Which Indian state implemented the "Mukhyamantri Ladli Behna Yojana" in 2023?',
    options: [
      'Madhya Pradesh',
      'Uttar Pradesh',
      'Rajasthan',
      'Gujarat'
    ],
    correct: 0,
    explanation: 'Madhya Pradesh implemented this scheme for women\'s welfare'
  },
  {
    id: 'sub-7',
    type: 'multiple-choice',
    section: 'International Relations',
    difficulty: 'hard',
    text: 'Which organization launched the "Belt and Road Initiative"?',
    options: [
      'China',
      'European Union',
      'World Bank',
      'United Nations'
    ],
    correct: 0,
    explanation: 'China launched the Belt and Road Initiative in 2013'
  }
];