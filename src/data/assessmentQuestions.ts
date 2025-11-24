// Career Interest and Aptitude Assessment Questions
import type { AssessmentQuestion } from '../types/assessment';

// CAREER INTEREST ASSESSMENT QUESTIONS
export const interestQuestions: AssessmentQuestion[] = [
  {
    id: 'int-1',
    question: 'What type of activities do you enjoy the most in your free time?',
    category: 'creativity',
    options: [
      { id: 'a', text: 'Solving puzzles or brain teasers', score: 3, careerWeights: { 'software-engineer': 2 } },
      { id: 'b', text: 'Drawing, painting, or creating art', score: 3, careerWeights: {} },
      { id: 'c', text: 'Playing sports or physical activities', score: 2 },
      { id: 'd', text: 'Reading books or watching documentaries', score: 3, careerWeights: { 'medical-doctor': 1 } }
    ]
  },
  {
    id: 'int-2',
    question: 'How do you prefer to solve problems?',
    category: 'problem-solving',
    options: [
      { id: 'a', text: 'Breaking them down into logical steps', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Brainstorming creative solutions', score: 3 },
      { id: 'c', text: 'Seeking advice from experts', score: 2, careerWeights: { 'medical-doctor': 1 } },
      { id: 'd', text: 'Using trial and error', score: 2 }
    ]
  },
  {
    id: 'int-3',
    question: 'Which school subjects do you find most interesting?',
    category: 'technical',
    options: [
      { id: 'a', text: 'Mathematics and Computer Science', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Physics and Chemistry', score: 4, careerWeights: { 'software-engineer': 1 } },
      { id: 'c', text: 'Biology and Environmental Science', score: 4, careerWeights: { 'medical-doctor': 3 } },
      { id: 'd', text: 'History and Social Studies', score: 3 }
    ]
  },
  {
    id: 'int-4',
    question: 'What kind of work environment appeals to you?',
    category: 'people',
    options: [
      { id: 'a', text: 'Working independently on technical projects', score: 3, careerWeights: { 'software-engineer': 2 } },
      { id: 'b', text: 'Collaborating with diverse teams', score: 3 },
      { id: 'c', text: 'Helping people directly face-to-face', score: 4, careerWeights: { 'medical-doctor': 3 } },
      { id: 'd', text: 'Leading and managing groups', score: 3 }
    ]
  },
  {
    id: 'int-5',
    question: 'How do you handle stressful situations?',
    category: 'helping',
    options: [
      { id: 'a', text: 'Stay calm and think logically', score: 4, careerWeights: { 'software-engineer': 1, 'medical-doctor': 2 } },
      { id: 'b', text: 'Take quick action to resolve it', score: 3, careerWeights: { 'medical-doctor': 2 } },
      { id: 'c', text: 'Seek support from others', score: 2 },
      { id: 'd', text: 'Take a break and return refreshed', score: 2 }
    ]
  },
  {
    id: 'int-6',
    question: 'What motivates you to learn something new?',
    category: 'research',
    options: [
      { id: 'a', text: 'Building something useful or innovative', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Understanding how things work', score: 4, careerWeights: { 'software-engineer': 1, 'medical-doctor': 2 } },
      { id: 'c', text: 'Making a positive impact on society', score: 3, careerWeights: { 'medical-doctor': 2 } },
      { id: 'd', text: 'Achieving recognition or awards', score: 2 }
    ]
  },
  {
    id: 'int-7',
    question: 'Which type of projects excite you the most?',
    category: 'creativity',
    options: [
      { id: 'a', text: 'Developing apps or websites', score: 5, careerWeights: { 'software-engineer': 4 } },
      { id: 'b', text: 'Conducting scientific experiments', score: 4, careerWeights: { 'medical-doctor': 2 } },
      { id: 'c', text: 'Creating visual or performing arts', score: 3 },
      { id: 'd', text: 'Organizing events or campaigns', score: 3 }
    ]
  },
  {
    id: 'int-8',
    question: 'How do you prefer to spend your study time?',
    category: 'data',
    options: [
      { id: 'a', text: 'Analyzing patterns and solving complex problems', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Memorizing facts and understanding concepts', score: 3, careerWeights: { 'medical-doctor': 2 } },
      { id: 'c', text: 'Creating visual notes or mind maps', score: 3 },
      { id: 'd', text: 'Discussing topics with peers', score: 2 }
    ]
  },
  {
    id: 'int-9',
    question: 'What type of achievements make you proud?',
    category: 'problem-solving',
    options: [
      { id: 'a', text: 'Solving a difficult coding challenge', score: 5, careerWeights: { 'software-engineer': 4 } },
      { id: 'b', text: 'Winning a science competition', score: 4, careerWeights: { 'software-engineer': 1, 'medical-doctor': 2 } },
      { id: 'c', text: 'Helping someone in need', score: 3, careerWeights: { 'medical-doctor': 2 } },
      { id: 'd', text: 'Excelling in sports or arts', score: 3 }
    ]
  },
  {
    id: 'int-10',
    question: 'Which skills do you want to develop further?',
    category: 'technical',
    options: [
      { id: 'a', text: 'Programming and software development', score: 5, careerWeights: { 'software-engineer': 4 } },
      { id: 'b', text: 'Medical and healthcare knowledge', score: 5, careerWeights: { 'medical-doctor': 4 } },
      { id: 'c', text: 'Business and entrepreneurship', score: 4 },
      { id: 'd', text: 'Communication and public speaking', score: 3 }
    ]
  },
  {
    id: 'int-11',
    question: 'What type of impact do you want to have on the world?',
    category: 'helping',
    options: [
      { id: 'a', text: 'Creating technology that improves lives', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Saving lives and improving health', score: 5, careerWeights: { 'medical-doctor': 4 } },
      { id: 'c', text: 'Inspiring others through creativity', score: 3 },
      { id: 'd', text: 'Building businesses and creating jobs', score: 4 }
    ]
  },
  {
    id: 'int-12',
    question: 'How do you approach learning a new topic?',
    category: 'research',
    options: [
      { id: 'a', text: 'Hands-on practice and experimentation', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Reading detailed explanations and theory', score: 3, careerWeights: { 'medical-doctor': 2 } },
      { id: 'c', text: 'Watching videos and tutorials', score: 3 },
      { id: 'd', text: 'Learning from mentors or teachers', score: 2 }
    ]
  },
  {
    id: 'int-13',
    question: 'What kind of challenges excite you?',
    category: 'problem-solving',
    options: [
      { id: 'a', text: 'Building complex systems from scratch', score: 5, careerWeights: { 'software-engineer': 4 } },
      { id: 'b', text: 'Diagnosing and solving health issues', score: 5, careerWeights: { 'medical-doctor': 4 } },
      { id: 'c', text: 'Creating artistic masterpieces', score: 4 },
      { id: 'd', text: 'Leading teams to success', score: 4 }
    ]
  },
  {
    id: 'int-14',
    question: 'Which work-life balance appeals to you?',
    category: 'business',
    options: [
      { id: 'a', text: 'Flexible hours, remote work options', score: 4, careerWeights: { 'software-engineer': 3 } },
      { id: 'b', text: 'Structured schedule with clear responsibilities', score: 3, careerWeights: { 'medical-doctor': 1 } },
      { id: 'c', text: 'Variable hours based on project needs', score: 3 },
      { id: 'd', text: 'High intensity with high rewards', score: 3, careerWeights: { 'medical-doctor': 2 } }
    ]
  },
  {
    id: 'int-15',
    question: 'What drives your career aspirations?',
    category: 'business',
    options: [
      { id: 'a', text: 'Innovation and cutting-edge technology', score: 5, careerWeights: { 'software-engineer': 4 } },
      { id: 'b', text: 'Making a difference in people\'s lives', score: 5, careerWeights: { 'medical-doctor': 4 } },
      { id: 'c', text: 'Financial success and stability', score: 4 },
      { id: 'd', text: 'Creative expression and freedom', score: 4 }
    ]
  }
];

// LOGICAL REASONING APTITUDE QUESTIONS
export const logicalQuestions: AssessmentQuestion[] = [
  {
    id: 'log-1',
    question: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
    category: 'logical',
    options: [
      { id: 'a', text: 'All roses fade quickly', score: 0 },
      { id: 'b', text: 'Some roses may fade quickly', score: 5 },
      { id: 'c', text: 'No roses fade quickly', score: 0 },
      { id: 'd', text: 'All flowers are roses', score: 0 }
    ]
  },
  {
    id: 'log-2',
    question: 'Complete the pattern: 2, 6, 12, 20, 30, ?',
    category: 'logical',
    options: [
      { id: 'a', text: '40', score: 0 },
      { id: 'b', text: '42', score: 5 },
      { id: 'c', text: '44', score: 0 },
      { id: 'd', text: '38', score: 0 }
    ]
  },
  {
    id: 'log-3',
    question: 'If A is taller than B, and B is taller than C, who is the shortest?',
    category: 'logical',
    options: [
      { id: 'a', text: 'A', score: 0 },
      { id: 'b', text: 'B', score: 0 },
      { id: 'c', text: 'C', score: 5 },
      { id: 'd', text: 'Cannot be determined', score: 0 }
    ]
  },
  {
    id: 'log-4',
    question: 'Which shape comes next? ○, △, ○, △, ○, ?',
    category: 'logical',
    options: [
      { id: 'a', text: '○', score: 0 },
      { id: 'b', text: '△', score: 5 },
      { id: 'c', text: '□', score: 0 },
      { id: 'd', text: '◇', score: 0 }
    ]
  },
  {
    id: 'log-5',
    question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    category: 'logical',
    options: [
      { id: 'a', text: '5 minutes', score: 5 },
      { id: 'b', text: '100 minutes', score: 0 },
      { id: 'c', text: '20 minutes', score: 0 },
      { id: 'd', text: '1 minute', score: 0 }
    ]
  },
  {
    id: 'log-6',
    question: 'Find the odd one out: Cat, Dog, Lion, Table, Horse',
    category: 'logical',
    options: [
      { id: 'a', text: 'Cat', score: 0 },
      { id: 'b', text: 'Lion', score: 0 },
      { id: 'c', text: 'Table', score: 5 },
      { id: 'd', text: 'Horse', score: 0 }
    ]
  },
  {
    id: 'log-7',
    question: 'If CODE is written as DPEF, how is MIND written?',
    category: 'logical',
    options: [
      { id: 'a', text: 'MJOE', score: 0 },
      { id: 'b', text: 'NJOE', score: 5 },
      { id: 'c', text: 'NIND', score: 0 },
      { id: 'd', text: 'MINE', score: 0 }
    ]
  },
  {
    id: 'log-8',
    question: 'Complete the series: J, F, M, A, M, ?',
    category: 'logical',
    options: [
      { id: 'a', text: 'J', score: 5 },
      { id: 'b', text: 'N', score: 0 },
      { id: 'c', text: 'S', score: 0 },
      { id: 'd', text: 'A', score: 0 }
    ]
  },
  {
    id: 'log-9',
    question: 'If the day after tomorrow is Monday, what day was yesterday?',
    category: 'logical',
    options: [
      { id: 'a', text: 'Thursday', score: 0 },
      { id: 'b', text: 'Friday', score: 5 },
      { id: 'c', text: 'Saturday', score: 0 },
      { id: 'd', text: 'Sunday', score: 0 }
    ]
  },
  {
    id: 'log-10',
    question: 'Which number does not belong? 2, 3, 6, 7, 8, 14, 15',
    category: 'logical',
    options: [
      { id: 'a', text: '8', score: 5 },
      { id: 'b', text: '6', score: 0 },
      { id: 'c', text: '14', score: 0 },
      { id: 'd', text: '15', score: 0 }
    ]
  }
];

// NUMERICAL APTITUDE QUESTIONS
export const numericalQuestions: AssessmentQuestion[] = [
  {
    id: 'num-1',
    question: 'What is 15% of 200?',
    category: 'numerical',
    options: [
      { id: 'a', text: '25', score: 0 },
      { id: 'b', text: '30', score: 5 },
      { id: 'c', text: '35', score: 0 },
      { id: 'd', text: '40', score: 0 }
    ]
  },
  {
    id: 'num-2',
    question: 'If a book costs ₹480 after a 20% discount, what was the original price?',
    category: 'numerical',
    options: [
      { id: 'a', text: '₹576', score: 0 },
      { id: 'b', text: '₹600', score: 5 },
      { id: 'c', text: '₹560', score: 0 },
      { id: 'd', text: '₹620', score: 0 }
    ]
  },
  {
    id: 'num-3',
    question: 'What is the average of 12, 18, 24, and 30?',
    category: 'numerical',
    options: [
      { id: 'a', text: '20', score: 0 },
      { id: 'b', text: '21', score: 5 },
      { id: 'c', text: '22', score: 0 },
      { id: 'd', text: '24', score: 0 }
    ]
  },
  {
    id: 'num-4',
    question: 'If x + 5 = 12, what is the value of 2x?',
    category: 'numerical',
    options: [
      { id: 'a', text: '12', score: 0 },
      { id: 'b', text: '14', score: 5 },
      { id: 'c', text: '17', score: 0 },
      { id: 'd', text: '24', score: 0 }
    ]
  },
  {
    id: 'num-5',
    question: 'A train travels 120 km in 2 hours. What is its speed in km/h?',
    category: 'numerical',
    options: [
      { id: 'a', text: '50 km/h', score: 0 },
      { id: 'b', text: '60 km/h', score: 5 },
      { id: 'c', text: '70 km/h', score: 0 },
      { id: 'd', text: '80 km/h', score: 0 }
    ]
  },
  {
    id: 'num-6',
    question: 'What is 25² - 15²?',
    category: 'numerical',
    options: [
      { id: 'a', text: '100', score: 0 },
      { id: 'b', text: '200', score: 0 },
      { id: 'c', text: '400', score: 5 },
      { id: 'd', text: '500', score: 0 }
    ]
  },
  {
    id: 'num-7',
    question: 'If 3 pencils cost ₹18, how much do 7 pencils cost?',
    category: 'numerical',
    options: [
      { id: 'a', text: '₹36', score: 0 },
      { id: 'b', text: '₹42', score: 5 },
      { id: 'c', text: '₹48', score: 0 },
      { id: 'd', text: '₹54', score: 0 }
    ]
  },
  {
    id: 'num-8',
    question: 'What is the next number in the series: 3, 9, 27, 81, ?',
    category: 'numerical',
    options: [
      { id: 'a', text: '162', score: 0 },
      { id: 'b', text: '243', score: 5 },
      { id: 'c', text: '324', score: 0 },
      { id: 'd', text: '405', score: 0 }
    ]
  },
  {
    id: 'num-9',
    question: 'If the ratio of boys to girls in a class is 3:2 and there are 30 students, how many are boys?',
    category: 'numerical',
    options: [
      { id: 'a', text: '12', score: 0 },
      { id: 'b', text: '15', score: 0 },
      { id: 'c', text: '18', score: 5 },
      { id: 'd', text: '20', score: 0 }
    ]
  },
  {
    id: 'num-10',
    question: 'What is 0.75 expressed as a fraction in simplest form?',
    category: 'numerical',
    options: [
      { id: 'a', text: '3/4', score: 5 },
      { id: 'b', text: '7/10', score: 0 },
      { id: 'c', text: '75/100', score: 0 },
      { id: 'd', text: '15/20', score: 0 }
    ]
  }
];

// VERBAL REASONING QUESTIONS
export const verbalQuestions: AssessmentQuestion[] = [
  {
    id: 'ver-1',
    question: 'Choose the word most similar to "HAPPY":',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Sad', score: 0 },
      { id: 'b', text: 'Joyful', score: 5 },
      { id: 'c', text: 'Angry', score: 0 },
      { id: 'd', text: 'Tired', score: 0 }
    ]
  },
  {
    id: 'ver-2',
    question: 'Choose the word opposite to "DIFFICULT":',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Hard', score: 0 },
      { id: 'b', text: 'Complex', score: 0 },
      { id: 'c', text: 'Easy', score: 5 },
      { id: 'd', text: 'Challenging', score: 0 }
    ]
  },
  {
    id: 'ver-3',
    question: 'Complete the analogy: Book is to Reading as Fork is to __',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Eating', score: 5 },
      { id: 'b', text: 'Cooking', score: 0 },
      { id: 'c', text: 'Kitchen', score: 0 },
      { id: 'd', text: 'Plate', score: 0 }
    ]
  },
  {
    id: 'ver-4',
    question: 'Which word does NOT belong? Dog, Cat, Lion, Car, Tiger',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Dog', score: 0 },
      { id: 'b', text: 'Cat', score: 0 },
      { id: 'c', text: 'Car', score: 5 },
      { id: 'd', text: 'Tiger', score: 0 }
    ]
  },
  {
    id: 'ver-5',
    question: 'What does "Transparent" mean?',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Opaque or unclear', score: 0 },
      { id: 'b', text: 'See-through or clear', score: 5 },
      { id: 'c', text: 'Colorful', score: 0 },
      { id: 'd', text: 'Heavy', score: 0 }
    ]
  },
  {
    id: 'ver-6',
    question: 'Choose the correctly spelled word:',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Accomodate', score: 0 },
      { id: 'b', text: 'Accommodate', score: 5 },
      { id: 'c', text: 'Acomodate', score: 0 },
      { id: 'd', text: 'Acommodate', score: 0 }
    ]
  },
  {
    id: 'ver-7',
    question: 'Complete the analogy: Doctor is to Hospital as Teacher is to __',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Book', score: 0 },
      { id: 'b', text: 'School', score: 5 },
      { id: 'c', text: 'Student', score: 0 },
      { id: 'd', text: 'Classroom', score: 2 }
    ]
  },
  {
    id: 'ver-8',
    question: 'Which word means "to make better or improve"?',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Deteriorate', score: 0 },
      { id: 'b', text: 'Enhance', score: 5 },
      { id: 'c', text: 'Worsen', score: 0 },
      { id: 'd', text: 'Maintain', score: 0 }
    ]
  },
  {
    id: 'ver-9',
    question: 'Identify the synonym of "BRAVE":',
    category: 'verbal',
    options: [
      { id: 'a', text: 'Cowardly', score: 0 },
      { id: 'b', text: 'Fearful', score: 0 },
      { id: 'c', text: 'Courageous', score: 5 },
      { id: 'd', text: 'Timid', score: 0 }
    ]
  },
  {
    id: 'ver-10',
    question: 'Choose the correct sentence:',
    category: 'verbal',
    options: [
      { id: 'a', text: 'He go to school yesterday', score: 0 },
      { id: 'b', text: 'He went to school yesterday', score: 5 },
      { id: 'c', text: 'He goes to school yesterday', score: 0 },
      { id: 'd', text: 'He going to school yesterday', score: 0 }
    ]
  }
];

// SPATIAL REASONING QUESTIONS (Descriptive - would ideally have images)
export const spatialQuestions: AssessmentQuestion[] = [
  {
    id: 'spa-1',
    question: 'If you rotate a square 90 degrees clockwise, what shape do you get?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'A rectangle', score: 0 },
      { id: 'b', text: 'A square (same shape)', score: 5 },
      { id: 'c', text: 'A triangle', score: 0 },
      { id: 'd', text: 'A circle', score: 0 }
    ]
  },
  {
    id: 'spa-2',
    question: 'How many faces does a cube have?',
    category: 'spatial',
    options: [
      { id: 'a', text: '4', score: 0 },
      { id: 'b', text: '6', score: 5 },
      { id: 'c', text: '8', score: 0 },
      { id: 'd', text: '12', score: 0 }
    ]
  },
  {
    id: 'spa-3',
    question: 'If you fold a piece of paper in half twice, how many sections will you have?',
    category: 'spatial',
    options: [
      { id: 'a', text: '2', score: 0 },
      { id: 'b', text: '3', score: 0 },
      { id: 'c', text: '4', score: 5 },
      { id: 'd', text: '8', score: 0 }
    ]
  },
  {
    id: 'spa-4',
    question: 'Which 3D shape has a circular base and comes to a point at the top?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'Cylinder', score: 0 },
      { id: 'b', text: 'Cone', score: 5 },
      { id: 'c', text: 'Pyramid', score: 0 },
      { id: 'd', text: 'Sphere', score: 0 }
    ]
  },
  {
    id: 'spa-5',
    question: 'If you look at a cube from the top, what shape do you see?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'Circle', score: 0 },
      { id: 'b', text: 'Square', score: 5 },
      { id: 'c', text: 'Triangle', score: 0 },
      { id: 'd', text: 'Rectangle', score: 0 }
    ]
  },
  {
    id: 'spa-6',
    question: 'How many edges does a triangular prism have?',
    category: 'spatial',
    options: [
      { id: 'a', text: '6', score: 0 },
      { id: 'b', text: '9', score: 5 },
      { id: 'c', text: '12', score: 0 },
      { id: 'd', text: '5', score: 0 }
    ]
  },
  {
    id: 'spa-7',
    question: 'Which shape cannot be folded to create a cube?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'A cross-shaped net with 6 squares', score: 0 },
      { id: 'b', text: 'A T-shaped net with 6 squares', score: 0 },
      { id: 'c', text: 'A line of 7 squares', score: 5 },
      { id: 'd', text: 'An L-shaped net with 6 squares', score: 0 }
    ]
  },
  {
    id: 'spa-8',
    question: 'If you slice a cylinder horizontally through the middle, what shape is the cross-section?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'Triangle', score: 0 },
      { id: 'b', text: 'Circle', score: 5 },
      { id: 'c', text: 'Rectangle', score: 0 },
      { id: 'd', text: 'Square', score: 0 }
    ]
  },
  {
    id: 'spa-9',
    question: 'How many vertices (corners) does a rectangular prism have?',
    category: 'spatial',
    options: [
      { id: 'a', text: '6', score: 0 },
      { id: 'b', text: '8', score: 5 },
      { id: 'c', text: '10', score: 0 },
      { id: 'd', text: '12', score: 0 }
    ]
  },
  {
    id: 'spa-10',
    question: 'If you flip a letter "b" horizontally, what does it look like?',
    category: 'spatial',
    options: [
      { id: 'a', text: 'd', score: 5 },
      { id: 'b', text: 'p', score: 0 },
      { id: 'c', text: 'q', score: 0 },
      { id: 'd', text: 'b', score: 0 }
    ]
  }
];

export const allAptitudeQuestions = [
  ...logicalQuestions,
  ...numericalQuestions,
  ...verbalQuestions,
  ...spatialQuestions
];
