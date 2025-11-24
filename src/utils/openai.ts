import OpenAI from 'openai';

// Check if we're in demo mode (no API key)
const isDemoMode = !import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (!isDemoMode) {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for demo, in production use backend
  });
}

// Language configuration
const supportedLanguages = {
  en: { name: 'English', voice: 'alloy', code: 'en' },
  hi: { name: 'Hindi', voice: 'shimmer', code: 'hi' },
  ta: { name: 'Tamil', voice: 'nova', code: 'ta' },
  te: { name: 'Telugu', voice: 'echo', code: 'te' },
  ml: { name: 'Malayalam', voice: 'onyx', code: 'ml' }
};

// Map subjects to teachers
const subjectTeachers = {
  'Indian Polity': 'Dr. Rajesh Kumar',
  'Economics': 'Prof. Sarah Williams',
  'Geography': 'Dr. Priya Sharma',
  'History': 'Prof. Arun Kumar',
  'Science': 'Dr. Meera Singh'
};

interface StreamingThought {
  id: string;
  content: string;
  isComplete: boolean;
}

async function analyzeExamPaper(
  text: string,
  subject: string,
  totalMarks: number
): Promise<{
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywordAnalysis?: {
    keyword: string;
    present: boolean;
  }[];
  questionAnalysis?: Array<{
    questionNumber: number;
    score: number;
    feedback: string;
    improvement: string;
  }>;
}> {
  try {
    // Demo mode fallback
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using demo exam analysis');
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // Simulate processing
      
      return {
        score: Math.floor(Math.random() * 30 + 60), // Random score between 60-90
        feedback: `Demo analysis for ${subject}: This is a sample analysis. In the full version, you would get detailed feedback about your performance, writing style, and content accuracy.`,
        strengths: [
          'Good understanding of basic concepts',
          'Clear writing structure',
          'Relevant examples provided'
        ],
        weaknesses: [
          'Could include more specific details',
          'Some concepts need deeper explanation',
          'Time management could be improved'
        ],
        suggestions: [
          'Practice more sample questions',
          'Focus on time management',
          'Review key terminology',
          'Include more real-world examples'
        ],
        keywordAnalysis: [
          { keyword: 'Key concept 1', present: true },
          { keyword: 'Key concept 2', present: false },
          { keyword: 'Key concept 3', present: true }
        ],
        questionAnalysis: [
          {
            questionNumber: 1,
            score: 75,
            feedback: 'Good attempt with room for improvement',
            improvement: 'Include more specific examples'
          }
        ]
      };
    }

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    const prompt = `Analyze this exam answer for ${subject} (total marks: ${totalMarks}):

${text}

Provide a detailed analysis in the following JSON format:
{
  "score": number (0-100),
  "feedback": "Overall feedback about the answers",
  "strengths": ["Strength 1", "Strength 2", ...],
  "weaknesses": ["Weakness 1", "Weakness 2", ...],
  "suggestions": ["Suggestion 1", "Suggestion 2", ...],
  "keywordAnalysis": [
    {
      "keyword": "Required keyword",
      "present": boolean
    }
  ],
  "questionAnalysis": [
    {
      "questionNumber": number,
      "score": number (0-100),
      "feedback": "Specific feedback for this answer",
      "improvement": "How to improve this answer"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const analysis = JSON.parse(response);
      return analysis;
    } catch (parseError) {
      console.error('Error parsing analysis:', parseError);
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Error analyzing exam paper:', error);
    throw error;
  }
}

async function generateThoughtChain(
  subject: string,
  topic: string,
  questionType: string,
  difficulty: string,
  onThoughtUpdate: (thoughts: StreamingThought[]) => void
): Promise<void> {
  try {
    const prompt = `Generate a detailed chain of thought process for creating ${questionType} questions about ${topic} in ${subject} at ${difficulty} difficulty level.

Each thought should be on a new line and end with a period.
Generate 5-7 detailed thoughts that show your reasoning process.

Example format:
Analyzing the fundamental principles of [topic] to identify core concepts...
Evaluating student learning objectives to align question difficulty...
etc...

Make each thought detailed and specific to the subject matter.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    });

    let currentThoughts: StreamingThought[] = [];
    let currentThoughtId = 1;
    let currentThought: StreamingThought = {
      id: `thought-${currentThoughtId}`,
      content: '',
      isComplete: false
    };

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content.includes('\n')) {
        // Complete current thought and start new one
        const parts = content.split('\n').filter(Boolean);
        
        if (parts.length > 0) {
          // Complete current thought
          currentThought.content += parts[0];
          currentThought.isComplete = true;
          currentThoughts = [...currentThoughts, currentThought];

          // Create new thoughts for remaining parts
          for (let i = 1; i < parts.length; i++) {
            currentThoughtId++;
            currentThought = {
              id: `thought-${currentThoughtId}`,
              content: parts[i],
              isComplete: false
            };
            currentThoughts = [...currentThoughts, currentThought];
          }
        }
      } else {
        // Add content to current thought
        currentThought.content += content;
      }

      // Update UI with current state
      onThoughtUpdate([
        ...currentThoughts.filter(t => t.id !== currentThought.id),
        { ...currentThought }
      ]);
    }

    // Mark final thought as complete
    currentThought.isComplete = true;
    onThoughtUpdate([
      ...currentThoughts.filter(t => t.id !== currentThought.id),
      currentThought
    ]);
  } catch (error) {
    console.error('Error generating thoughts:', error);
    onThoughtUpdate(defaultThoughts(subject, topic, difficulty).map((content, index) => ({
      id: `thought-${index + 1}`,
      content,
      isComplete: true
    })));
  }
}

function defaultThoughts(subject: string, topic: string, difficulty: string): string[] {
  return [
    `Analyzing the core concepts of ${subject}, particularly focusing on ${topic}...`,
    `Considering the ${difficulty} difficulty level to calibrate question complexity...`,
    `Identifying key theories and principles that students should understand...`,
    `Designing questions that test both theoretical knowledge and practical application...`,
    `Creating detailed explanations to help students understand the concepts better...`
  ];
}

async function generateFAQs(subject: string, topic: string): Promise<Array<{
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}>> {
  try {
    const prompt = `Generate 5 frequently asked questions and detailed answers about ${topic} in ${subject}.

Each FAQ should be formatted as a JSON object with:
{
  "question": "The question text",
  "answer": "The detailed answer"
}

Return a valid JSON array of these objects.

Focus on:
- Key concepts
- Common misconceptions
- Important relationships
- Real-world applications
- Advanced concepts`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Clean up the response to ensure valid JSON
    const cleanedResponse = response.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\n\s*\n/g, '\n');

    try {
      const faqs = JSON.parse(cleanedResponse);
      if (!Array.isArray(faqs)) {
        throw new Error('Invalid FAQ format');
      }
      
      return faqs.map((faq: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        question: faq.question || 'Question not available',
        answer: faq.answer || 'Answer not available',
        isOpen: false
      }));
    } catch (parseError) {
      console.error('Error parsing FAQs:', parseError);
      return defaultFAQs;
    }
  } catch (error) {
    console.error('Error generating FAQs:', error);
    return defaultFAQs;
  }
}

async function generateQuestions(
  subject: string,
  topic: string,
  type: string,
  difficulty: string,
  count: number
): Promise<Array<{
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  type: string;
  difficulty: string;
  reasoning?: string;
}>> {
  try {
    let prompt = '';
    
    if (type === 'mcq') {
      prompt = `Generate ${count} multiple choice questions about ${topic} in ${subject} at ${difficulty} difficulty level.

Format each question as a JSON object with:
{
  "question": "question text",
  "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
  "correctAnswer": "exact matching option text",
  "explanation": "explanation text",
  "marks": number,
  "reasoning": "reasoning text"
}

Return a JSON array of ${count} questions. Ensure:
- No special characters or line breaks in strings
- Valid JSON formatting
- Each question tests different aspects
- Clear explanations
- Marks between 5-10
- Exactly 4 options
- Correct answer matches an option exactly`;
    } else if (type === 'descriptive') {
      prompt = `Generate ${count} descriptive questions about ${topic} in ${subject} at ${difficulty} difficulty level.

Format each question as a JSON object with:
{
  "question": "question text",
  "correctAnswer": "model answer text",
  "explanation": "explanation text",
  "marks": number,
  "reasoning": "reasoning text"
}

Return a JSON array of ${count} questions. Ensure:
- No special characters or line breaks in strings
- Valid JSON formatting
- Different aspects tested
- Detailed model answers
- Key points included
- Marks between 10-20`;
    } else if (type === 'case-study') {
      prompt = `Generate ${count} case study questions about ${topic} in ${subject} at ${difficulty} difficulty level.

Format each question as a JSON object with:
{
  "question": "case study and questions text",
  "correctAnswer": "analysis and solution text",
  "explanation": "evaluation points text",
  "marks": number,
  "reasoning": "importance text"
}

Return a JSON array of ${count} questions. Ensure:
- No special characters or line breaks in strings
- Valid JSON formatting
- Realistic scenarios
- Clear analysis framework
- Evaluation criteria
- Marks between 20-30`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      // Clean and parse the response
      const cleanedResponse = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/[\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const questions = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      // Validate and format each question
      return questions.map((q: any, index: number) => {
        const baseQuestion = {
          id: `${Date.now()}-${index}`,
          question: q.question?.trim() || 'Question not available',
          correctAnswer: q.correctAnswer?.trim() || 'Answer not available',
          explanation: q.explanation?.trim() || 'Explanation not available',
          marks: q.marks || (type === 'mcq' ? 5 : type === 'descriptive' ? 15 : 25),
          type,
          difficulty,
          reasoning: q.reasoning?.trim()
        };

        if (type === 'mcq') {
          if (!Array.isArray(q.options) || q.options.length !== 4) {
            throw new Error(`Invalid options for MCQ question ${index + 1}`);
          }
          
          const formattedOptions = q.options.map((opt: string) => opt.trim());
          const formattedAnswer = q.correctAnswer.trim();
          
          if (!formattedOptions.includes(formattedAnswer)) {
            throw new Error(`Correct answer doesn't match any option in question ${index + 1}`);
          }
          
          return {
            ...baseQuestion,
            options: formattedOptions
          };
        }

        return baseQuestion;
      });
    } catch (parseError) {
      console.error('Error parsing questions:', parseError);
      // Return fallback question
      return [{
        id: `${Date.now()}-fallback`,
        question: 'What is the main concept of this topic?',
        correctAnswer: type === 'mcq' 
          ? 'A) The main concept'
          : 'This is a model answer explaining the main concept.',
        explanation: 'This is a fallback question due to generation error.',
        marks: type === 'mcq' ? 5 : type === 'descriptive' ? 15 : 25,
        type,
        difficulty,
        reasoning: 'Testing basic understanding',
        ...(type === 'mcq' ? {
          options: [
            'A) The main concept',
            'B) An incorrect option',
            'C) Another incorrect option',
            'D) Yet another incorrect option'
          ]
        } : {})
      }];
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

async function speechToText(audioFile: File): Promise<string> {
  try {
    const lastLanguage = localStorage.getItem('lastUsedLanguage') || 'en';
    const languageCode = supportedLanguages[lastLanguage as keyof typeof supportedLanguages]?.code;

    if (!languageCode) {
      throw new Error('Unsupported language');
    }

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: languageCode
    });

    return response.text;
  } catch (error) {
    console.error('Error in speech to text:', error);
    throw error;
  }
}

let currentAudio: HTMLAudioElement | null = null;

function stopCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.remove();
    currentAudio = null;
  }
}

async function textToSpeech(text: string, language?: string): Promise<void> {
  try {
    if (!text || text.trim() === '') {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';
    const selectedVoice = supportedLanguages[userLanguage as keyof typeof supportedLanguages]?.voice || 'alloy';

    let finalText = text;
    if (userLanguage !== 'en') {
      const translation = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Translate to ${supportedLanguages[userLanguage as keyof typeof supportedLanguages]?.name || 'English'}`
          },
          { role: "user", content: text }
        ]
      });
      finalText = translation.choices[0].message.content || text;
    }

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: selectedVoice,
      input: finalText
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audio.remove();
        currentAudio = null;
        resolve();
      };
      
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        audio.remove();
        currentAudio = null;
        reject(e);
      };
      
      audio.src = audioUrl;
      audio.oncanplaythrough = () => {
        currentAudio = audio;
        audio.play()
          .catch(error => {
            URL.revokeObjectURL(audioUrl);
            audio.remove();
            currentAudio = null;
            reject(error);
          });
      };
    });
  } catch (error) {
    console.error('Error in text to speech:', error);
    stopCurrentAudio();
    throw error;
  }
}

async function getChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  subject: string,
  topic: string,
  language?: string
): Promise<string> {
  try {
    // Demo mode fallback
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using demo chat response');
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // Simulate response time
      
      if (messages.length === 0) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userName = userData.name || 'Student';
        const teacher = subjectTeachers[subject as keyof typeof subjectTeachers] || 'your instructor';
        
        return `👋 Hi ${userName}! I'm your AI learning assistant for ${topic} in ${subject} with ${teacher}. 

How can I help you understand this topic better? You can:

• Ask questions about specific concepts
• Request explanations of difficult terms
• Get help with problem-solving
• Explore real-world applications
• Clarify any doubts

What would you like to learn about ${topic}?

(Demo Mode: This is a sample response. Configure API keys for full AI functionality.)`;
      }
      
      return `This is a demo response about ${topic} in ${subject}. In the full version with API keys configured, you would get comprehensive, personalized explanations from advanced AI models.

Key learning points about ${topic}:
- Understand the fundamental concepts
- Practice with real-world examples
- Connect theory to practical applications
- Ask follow-up questions for clarification

How can I help you learn more about this topic?

(Demo Mode: Configure API keys for full AI functionality.)`;
    }

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    if (messages.length === 0) {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userName = userData.name || 'Student';
      const teacher = subjectTeachers[subject as keyof typeof subjectTeachers] || 'your instructor';
      const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';

      // If non-English language is requested, translate the greeting
      if (userLanguage !== 'en') {
        const translation = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a translator. Translate the following text to ${
                supportedLanguages[userLanguage as keyof typeof supportedLanguages]?.name || 'English'
              }. Keep the emojis and formatting intact. Maintain the same welcoming and helpful tone.`
            },
            {
              role: "user",
              content: `👋 Hi ${userName}! I'm your AI learning assistant for ${topic} in ${subject} with ${teacher}. 

How can I help you understand this topic better? You can:

• Ask questions about specific concepts
• Request explanations of difficult terms
• Get help with problem-solving
• Explore real-world applications
• Clarify any doubts

What would you like to learn about ${topic}?`
            }
          ]
        });
        
        return translation.choices[0].message.content || 'Translation error occurred';
      }

      return `👋 Hi ${userName}! I'm your AI learning assistant for ${topic} in ${subject} with ${teacher}. 

How can I help you understand this topic better? You can:

• Ask questions about specific concepts
• Request explanations of difficult terms
• Get help with problem-solving
• Explore real-world applications
• Clarify any doubts

What would you like to learn about ${topic}?`;
    }

    const userLanguage = language || localStorage.getItem('lastUsedLanguage') || 'en';

    const systemPrompt = `You are an expert AI tutor specializing in ${subject}, particularly knowledgeable about ${topic}. Your responses should be:
    1. Clear and concise
    2. Rich with examples
    3. Brief and focused (max 2-3 sentences per point)
    4. Encouraging critical thinking
    5. Supportive and engaging
    6. Respond in ${supportedLanguages[userLanguage as keyof typeof supportedLanguages]?.name || 'English'}
    
    Keep responses concise and to the point, focusing on the most important information.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content || 
      "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
  }
}

const defaultFAQs = [
  {
    id: '1',
    question: 'What are the fundamental concepts I need to understand?',
    answer: 'The key fundamental concepts include the basic principles, main theories, and core components of the subject matter. Focus on understanding these before moving to advanced topics.',
    isOpen: false
  },
  {
    id: '2',
    question: 'How can I apply this knowledge in practical scenarios?',
    answer: 'Practice with real-world examples, case studies, and problem-solving exercises. Try to connect theoretical concepts with practical applications.',
    isOpen: false
  },
  {
    id: '3',
    question: 'What are the common misconceptions to avoid?',
    answer: 'Be aware of typical misunderstandings and focus on building a clear, accurate understanding of the concepts through careful study and verification.',
    isOpen: false
  }
];

// General purpose OpenAI response function
async function getOpenAIResponse(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  try {
    // Demo mode fallback
    if (isDemoMode || !openai) {
      console.log('Demo mode: Using demo OpenAI response');
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200)); // Simulate response time
      
      return `Demo response: This is a sample AI response to your query. In the full version with API keys configured, you would get detailed, personalized responses from advanced AI models.

Your query was about: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}

Configure OpenAI API keys to enable full AI functionality.`;
    }

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return completion.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get OpenAI response');
  }
}

// Export all functions
export {
  analyzeExamPaper,
  generateThoughtChain,
  generateFAQs,
  generateQuestions,
  speechToText,
  textToSpeech,
  getChatResponse,
  getOpenAIResponse
};