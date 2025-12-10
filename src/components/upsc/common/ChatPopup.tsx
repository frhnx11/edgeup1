import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Copy, Shield, Bot, Check, Sparkles, Loader2, AlertCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationOverlay } from './NavigationOverlay';
import { ReviewClassesPopup } from './ReviewClassesPopup';

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4';

// Navigation map for the AI agent
const NAVIGATION_MAP = {
  'dashboard': {
    path: 'dashboard',
    tabs: [],
    aliases: ['home', 'overview', 'main', 'start']
  },
  'social-learner': {
    path: 'social-learner',
    tabs: ['reels', 'messages', 'study-groups', 'quizzes'],
    aliases: ['social', 'community', 'friends']
  },
  'study': {
    path: 'study',
    tabs: ['calendar', 'classes', 'performance', 'tasks', 'resources', 'syllabus', 'tests'],
    aliases: ['learning', 'education', 'academics']
  },
  'development': {
    path: 'development',
    tabs: ['skills', 'question-generation', 'exam-correction'],
    aliases: ['develop', 'growth', 'improve']
  },
  'personal': {
    path: 'personal',
    tabs: ['mentor', 'smart-gadgets', 'pasco'],
    aliases: ['me', 'my', 'profile']
  },
  'pasco-features': {
    path: 'pasco-features',
    tabs: ['features-report', 'reels', 'messages', 'study-groups', 'quizzes', 'advanced-analytics', 'leaderboard', 'readiness-score', 'test-analytics', 'mind-maps', 'focus-timer', 'calendar'],
    aliases: ['pasco', 'features', 'my features', 'personalized', 'trait features', 'pasco features']
  }
};

// Tab aliases for natural language understanding
const TAB_ALIASES: Record<string, string> = {
  'videos': 'reels',
  'shorts': 'reels',
  'chat': 'messages',
  'inbox': 'messages',
  'groups': 'study-groups',
  'study group': 'study-groups',
  'quiz': 'quizzes',
  'schedule': 'calendar',
  'timetable': 'calendar',
  'lectures': 'classes',
  'class': 'classes',
  'progress': 'performance',
  'analytics': 'performance',
  'assignments': 'tasks',
  'homework': 'tasks',
  'to-do': 'tasks',
  'materials': 'resources',
  'study materials': 'resources',
  'books': 'resources',
  'curriculum': 'syllabus',
  'topics': 'syllabus',
  'mock tests': 'tests',
  'exams': 'tests',
  'practice tests': 'tests',
  'abilities': 'skills',
  'competencies': 'skills',
  'generate questions': 'question-generation',
  'create questions': 'question-generation',
  'ai questions': 'question-generation',
  'answer check': 'exam-correction',
  'grade answers': 'exam-correction',
  'evaluate': 'exam-correction',
  'tutor': 'mentor',
  'teacher': 'mentor',
  'guide': 'mentor',
  'gadgets': 'smart-gadgets',
  'devices': 'smart-gadgets',
  'wearables': 'smart-gadgets',
  'assessment': 'pasco',
  'profile assessment': 'pasco',
  // PASCO Features aliases
  'my features': 'features-report',
  'trait analysis': 'features-report',
  'personality': 'features-report',
  'performance analytics': 'advanced-analytics',
  'rankings': 'leaderboard',
  'rank': 'leaderboard',
  'compete': 'leaderboard',
  'readiness': 'readiness-score',
  'exam ready': 'readiness-score',
  'preparation score': 'readiness-score',
  'mock analysis': 'test-analytics',
  'test analysis': 'test-analytics',
  'mind map': 'mind-maps',
  'mindmap': 'mind-maps',
  'concept map': 'mind-maps',
  'pomodoro': 'focus-timer',
  'timer': 'focus-timer',
  'focus': 'focus-timer'
};

interface NavigationResult {
  navigate: boolean;
  page: string;
  tab?: string;
  highlightClass?: string;
  message: string;
}

// Class schedule data for AI context
const CLASS_SCHEDULE = `
## Your Class Schedule:

TODAY'S CLASSES:
1. Geography - "Weather Systems & Climate Change" at 9:00 AM with Dr. Ravikumar (id: 0)
2. Geography - "Indian Monsoon System" at 11:30 AM with Dr. Ravikumar (id: 1)
3. History - "Quit India Movement 1942" at 2:30 PM with Dr. Rajesh Sharma (id: 2)
4. Current Affairs - "G20 Summit & Global Economy" at 5:00 PM with Mr. Guna Mathivanan (id: 3)

TOMORROW'S CLASSES:
5. Current Affairs - "International Relations & Global Politics" at 9:30 AM with Dr. Stanly Johny (id: t1)
6. Economics - "Digital Economy & FinTech" at 2:00 PM with Mr. Guna Mathivanan (id: t2)
`;

interface ChatButton {
  label: string;
  action: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
  isError?: boolean;
  buttons?: ChatButton[];
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// System prompt for the AI assistant with navigation capabilities
const SYSTEM_PROMPT = `You are Eustad, a friendly and knowledgeable AI learning assistant for UPSC exam preparation. You help students with:
- Explaining complex concepts in simple terms
- Answering questions about UPSC syllabus topics (History, Geography, Polity, Economy, Science, Current Affairs)
- Providing study tips and strategies
- Motivating and encouraging students
- NAVIGATING the app to different pages and tabs
- Answering questions about their CLASS SCHEDULE

${CLASS_SCHEDULE}

## NAVIGATION CAPABILITY (IMPORTANT!)
You can navigate users to different parts of the app. When a user asks to go somewhere, navigate them, or open a page/tab, you MUST respond with a JSON object.

Available pages and their tabs:
- dashboard (no tabs) - Main overview page
- social-learner (tabs: reels, messages, study-groups, quizzes) - Social features
- study (tabs: calendar, classes, performance, tasks, resources, syllabus, tests) - Study features
- development (tabs: skills, question-generation, exam-correction) - Development features
- personal (tabs: mentor, smart-gadgets, pasco) - Personal features
- pasco-features (tabs: features-report, reels, messages, study-groups, quizzes, advanced-analytics, leaderboard, readiness-score, test-analytics, mind-maps, focus-timer, calendar) - Personalized PASCO features based on learning profile

When user wants to navigate, respond ONLY with this exact JSON format (no other text):
{"navigate": true, "page": "PAGE_NAME", "tab": "TAB_NAME", "message": "Taking you to PAGE/TAB!"}

## CLASS-RELATED QUERIES (IMPORTANT!)
When user asks about their classes (e.g., "when is my next History class?", "show me my Geography class"), you MUST:
1. Navigate to the classes tab
2. Include the class ID in highlightClass field so it gets highlighted

Example for class queries:
- "when is my next History class?" → {"navigate": true, "page": "study", "tab": "classes", "highlightClass": "2", "message": "Your next History class is Quit India Movement 1942 at 2:30 PM today with Dr. Rajesh Sharma!"}
- "show my Geography class" → {"navigate": true, "page": "study", "tab": "classes", "highlightClass": "0", "message": "Here's your Geography class - Weather Systems & Climate Change at 9:00 AM with Dr. Ravikumar!"}
- "what economics class do I have?" → {"navigate": true, "page": "study", "tab": "classes", "highlightClass": "t2", "message": "You have Digital Economy & FinTech tomorrow at 2:00 PM with Mr. Guna Mathivanan!"}

## TEST-RELATED QUERIES (IMPORTANT!)
When user asks about tests (e.g., "when is my next test?", "show my tests"), navigate to tests tab and highlight the Geography test:
- "when is my next test?" → {"navigate": true, "page": "study", "tab": "tests", "highlightClass": "topic-geography-1", "message": "Your next test is Geography - Indian Climate! It has 30 questions and takes 30 minutes. Good luck!"}
- "show my tests" → {"navigate": true, "page": "study", "tab": "tests", "message": "Here are your tests!"}

Navigation Examples:
- "take me to resources" → {"navigate": true, "page": "study", "tab": "resources", "message": "Taking you to Study Resources!"}
- "open my calendar" → {"navigate": true, "page": "study", "tab": "calendar", "message": "Opening your Calendar!"}
- "show quizzes" → {"navigate": true, "page": "social-learner", "tab": "quizzes", "message": "Let's check out the Quizzes!"}
- "go to dashboard" → {"navigate": true, "page": "dashboard", "message": "Taking you to the Dashboard!"}
- "open mentor" → {"navigate": true, "page": "personal", "tab": "mentor", "message": "Connecting you with your Mentor!"}

## PASCO FEATURES NAVIGATION
When user asks about their personalized features, mind maps, focus timer, leaderboard, analytics, etc., navigate to pasco-features:
- "show my features" → {"navigate": true, "page": "pasco-features", "tab": "features-report", "message": "Here are your personalized PASCO features!"}
- "open mind maps" → {"navigate": true, "page": "pasco-features", "tab": "mind-maps", "message": "Opening Mind Maps for visual learning!"}
- "go to leaderboard" → {"navigate": true, "page": "pasco-features", "tab": "leaderboard", "message": "Let's see the rankings!"}
- "start focus timer" → {"navigate": true, "page": "pasco-features", "tab": "focus-timer", "message": "Starting the Focus Timer for productive study!"}
- "show analytics" → {"navigate": true, "page": "pasco-features", "tab": "advanced-analytics", "message": "Opening your Advanced Analytics!"}
- "check readiness score" → {"navigate": true, "page": "pasco-features", "tab": "readiness-score", "message": "Let's check your exam readiness!"}

For NON-navigation questions, respond normally with helpful text.

Guidelines for non-navigation responses:
- Keep responses concise but informative (2-4 paragraphs max unless detail is needed)
- Use bullet points for lists
- Use numbered lists for steps or rankings
- Be encouraging and supportive
- If you don't know something, be honest about it
- Focus on UPSC-relevant information when applicable`;

// Call OpenAI API
async function callOpenAI(messages: Message[], userMessage: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  // Build conversation history for OpenAI
  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
      .filter(msg => !msg.isError)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 800,
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
}

// Parse navigation response from OpenAI
function parseNavigationResponse(response: string): NavigationResult | null {
  try {
    // Try to parse as JSON first
    const trimmed = response.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"navigate"')) {
      const parsed = JSON.parse(trimmed);
      if (parsed.navigate === true && parsed.page) {
        return {
          navigate: true,
          page: parsed.page,
          tab: parsed.tab,
          highlightClass: parsed.highlightClass,
          message: parsed.message || `Taking you to ${parsed.page}${parsed.tab ? ` - ${parsed.tab}` : ''}!`
        };
      }
    }
  } catch (e) {
    // Not a JSON response, that's fine
  }
  return null;
}

// Get human-readable destination name
function getDestinationName(page: string, tab?: string): string {
  const pageNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'social-learner': 'Social Learner',
    'study': 'Study',
    'development': 'Development',
    'personal': 'Personal'
  };

  const tabNames: Record<string, string> = {
    'reels': 'Reels',
    'messages': 'Messages',
    'study-groups': 'Study Groups',
    'quizzes': 'Quizzes',
    'calendar': 'Calendar',
    'classes': 'Classes',
    'performance': 'Performance',
    'tasks': 'Tasks',
    'resources': 'Resources',
    'syllabus': 'Syllabus',
    'tests': 'Tests',
    'skills': 'Skills',
    'question-generation': 'Question Generation',
    'exam-correction': 'Exam Correction',
    'mentor': 'Mentor',
    'smart-gadgets': 'Smart Gadgets',
    'pasco': 'PASCO'
  };

  const pageName = pageNames[page] || page;
  const tabName = tab ? tabNames[tab] || tab : null;

  return tabName ? `${pageName} - ${tabName}` : pageName;
}

export function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNavOverlay, setShowNavOverlay] = useState(false);
  const [navDestination, setNavDestination] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState<{ page: string; tab?: string; highlightClass?: string } | null>(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Use sessionStorage so messages clear on page refresh but persist during navigation
    const saved = sessionStorage.getItem('chatMessages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: '1',
        text: "Hello! I'm Eustad, your AI learning assistant. I can help you with UPSC preparation AND navigate you anywhere in the app! Try saying 'take me to resources' or ask me any question.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages to sessionStorage (clears on page refresh, persists during navigation)
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Check for pending responses after navigation/remount
  useEffect(() => {
    if (isOpen) {
      // Check for pending test response
      const hasPendingTestResponse = sessionStorage.getItem('pendingTestResponse') === 'true';
      if (hasPendingTestResponse) {
        sessionStorage.removeItem('pendingTestResponse');

        // Small delay to let the page render first
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Your next test is on Indian Climate at 5:30 pm today. Have you prepared well?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: "Yes. Prepared", action: "test-prepared-yes" },
              { label: "Help me prepare", action: "test-help-prepare" }
            ]
          };
          setMessages(prev => [...prev, botMessage]);
        }, 500);
      }

      // Check for pending resource response
      const hasPendingResourceResponse = sessionStorage.getItem('pendingResourceResponse') === 'true';
      if (hasPendingResourceResponse) {
        sessionStorage.removeItem('pendingResourceResponse');

        // Small delay to let the page render first
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Here's a great resource for your Geography test preparation - the Geography of India Video Series by Dr. Priya Sharma. It covers Physical Geography, Maps, and Climate!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botMessage]);
        }, 500);
      }
    }
  }, [isOpen]);

  // Handle navigation completion
  const handleNavigationComplete = () => {
    if (pendingNavigation) {
      const userStage = localStorage.getItem('userStage') || 'upsc';
      const basePath = `/${userStage}/student`;

      const { page, tab, highlightClass } = pendingNavigation;

      // Store highlight class in localStorage for ClassesPage to read
      if (highlightClass) {
        localStorage.setItem('highlightClassId', highlightClass);
      }

      // Build URL with only tab param
      const path = tab
        ? `${basePath}/${page}?tab=${tab}`
        : `${basePath}/${page}`;

      // Ensure chat popup stays open after navigation
      localStorage.setItem('chatPopupOpen', 'true');

      navigate(path);
      setShowNavOverlay(false);
      setPendingNavigation(null);
      setIsLoading(false);
    }
  };

  // Handle button clicks for interactive responses
  const handleButtonClick = (action: string, label: string) => {
    // Add user's choice as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: label,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);

    // Remove buttons from the previous bot message to prevent re-clicking
    setMessages(prev => prev.map(msg =>
      msg.buttons ? { ...msg, buttons: undefined } : msg
    ));

    // Add bot response based on action
    setTimeout(() => {
      let botResponse: Message;

      switch (action) {
        case 'test-prepared-yes':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: "Ok. Good job!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        case 'test-help-prepare':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: "No problem! Let me help you. Would you like some study materials?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: "Yes", action: "study-materials-yes" },
              { label: "No", action: "study-materials-no" }
            ]
          };
          break;
        case 'study-materials-yes':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: "Let me find some study resources for you...",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botResponse]);

          // Navigate to resources after showing the message
          setIsLoading(true);
          sessionStorage.setItem('pendingResourceResponse', 'true');

          const resourceDestination = getDestinationName('study', 'resources');
          setNavDestination(resourceDestination);
          setPendingNavigation({ page: 'study', tab: 'resources', highlightClass: 'resource-3' });

          setTimeout(() => {
            setShowNavOverlay(true);
          }, 1000);
          return; // Don't add botResponse again
        case 'study-materials-no':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: "Alright! Good luck with your test!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        default:
          return;
      }

      setMessages(prev => [...prev, botResponse]);
    }, 300);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const userText = inputValue.trim();
    setInputValue('');

    // Check for hardcoded test query - intercept before OpenAI API
    const testQueryPatterns = ['when is my next test', 'my next test', 'upcoming test', 'next test'];
    const isTestQuery = testQueryPatterns.some(p => userText.toLowerCase().includes(p));

    if (isTestQuery) {
      // Show loading state while navigating
      setIsLoading(true);

      // Store the pending test response to show after navigation
      sessionStorage.setItem('pendingTestResponse', 'true');

      // Trigger navigation to tests tab after 1 second delay (to look natural)
      const destination = getDestinationName('study', 'tests');
      setNavDestination(destination);
      setPendingNavigation({ page: 'study', tab: 'tests', highlightClass: 'topic-geography-1' });

      setTimeout(() => {
        setShowNavOverlay(true);
      }, 1000);

      return; // Don't call OpenAI API
    }

    // Check for review classes query
    const reviewQueryPatterns = ['review today', 'review classes', 'what i learnt', 'what did i learn', 'today\'s classes'];
    const isReviewQuery = reviewQueryPatterns.some(p => userText.toLowerCase().includes(p));

    if (isReviewQuery) {
      // Show loading state
      setIsLoading(true);

      // Show loading for 1 second, then open the review popup
      setTimeout(() => {
        setIsLoading(false);
        setShowReviewPopup(true);
      }, 1000);

      return; // Don't call OpenAI API
    }

    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await callOpenAI(messages, userText);

      // Check if this is a navigation response
      const navResult = parseNavigationResponse(response);

      if (navResult) {
        // It's a navigation command
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: navResult.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);

        // Trigger navigation with overlay
        const destination = getDestinationName(navResult.page, navResult.tab);
        setNavDestination(destination);
        setPendingNavigation({ page: navResult.page, tab: navResult.tab, highlightClass: navResult.highlightClass });

        // Small delay to show the message before overlay
        setTimeout(() => {
          setShowNavOverlay(true);
        }, 500);
      } else {
        // Regular response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request. Please check your internet connection and try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format message text with markdown-like styling
  const formatMessage = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((paragraph, pIndex) => {
      // Check if it's a bullet list
      const lines = paragraph.split('\n');
      const isBulletList = lines.some(line => /^[-•*]\s/.test(line.trim()));

      if (isBulletList) {
        return (
          <ul key={pIndex} className="list-none space-y-2 my-3">
            {lines.map((line, lIndex) => {
              const bulletMatch = line.match(/^[-•*]\s(.+)/);
              if (bulletMatch) {
                return (
                  <li key={lIndex} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{formatInlineText(bulletMatch[1])}</span>
                  </li>
                );
              }
              if (line.trim()) {
                return <span key={lIndex} className="block">{formatInlineText(line)}</span>;
              }
              return null;
            })}
          </ul>
        );
      }

      // Check if it's a numbered list
      const isNumberedList = lines.some(line => /^\d+[.)]\s/.test(line.trim()));

      if (isNumberedList) {
        return (
          <ol key={pIndex} className="list-none space-y-2 my-3">
            {lines.map((line, lIndex) => {
              const numberMatch = line.match(/^(\d+)[.)]\s(.+)/);
              if (numberMatch) {
                return (
                  <li key={lIndex} className="flex items-start gap-2.5">
                    <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {numberMatch[1]}
                    </span>
                    <span className="text-gray-700 pt-0.5">{formatInlineText(numberMatch[2])}</span>
                  </li>
                );
              }
              if (line.trim()) {
                return <span key={lIndex} className="block">{formatInlineText(line)}</span>;
              }
              return null;
            })}
          </ol>
        );
      }

      // Regular paragraph - handle single line breaks
      return (
        <p key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
          {lines.map((line, lIndex) => (
            <span key={lIndex}>
              {formatInlineText(line)}
              {lIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  // Format inline text (bold, italic, code)
  const formatInlineText = (text: string) => {
    // Handle **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
      }
      // Handle `code` text
      if (part.includes('`')) {
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((codePart, j) => {
          if (codePart.startsWith('`') && codePart.endsWith('`')) {
            return (
              <code key={`${i}-${j}`} className="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono">
                {codePart.slice(1, -1)}
              </code>
            );
          }
          return codePart;
        });
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Navigation Overlay */}
      <NavigationOverlay
        isVisible={showNavOverlay}
        destination={navDestination}
        onComplete={handleNavigationComplete}
      />

      {/* Review Classes Popup */}
      <ReviewClassesPopup
        isVisible={showReviewPopup}
        onClose={() => setShowReviewPopup(false)}
      />

      <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-44 right-6 sm:bottom-48 sm:right-8 z-[10000] w-[380px] sm:w-[420px] rounded-3xl overflow-hidden"
      style={{
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 12px 30px -8px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 40%, #0D9488 100%)'
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-400/20 rounded-full blur-xl" />

        <div className="flex items-center gap-4 relative z-10">
          {/* Bot Avatar */}
          <div className="relative">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Bot className="w-7 h-7 text-white" />
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-teal-500 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg tracking-tight">Eustad AI</h3>
              <Sparkles className="w-4 h-4 text-teal-200" />
            </div>
            <p className="text-teal-100 text-sm font-medium">
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </span>
              ) : (
                'Always here to help'
              )}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm relative z-10"
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Chat Messages Area */}
      <div
        className="h-[380px] overflow-y-auto p-5 space-y-5"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="flex gap-3 max-w-[88%]">
                  {/* Bot Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                      message.isError ? 'bg-red-500' : ''
                    }`}
                    style={!message.isError ? {
                      background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)'
                    } : {}}
                  >
                    {message.isError ? (
                      <AlertCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`bg-white rounded-2xl rounded-tl-md p-4 shadow-sm ${
                        message.isError ? 'border-red-200' : ''
                      }`}
                      style={{
                        border: message.isError ? '1px solid #fecaca' : '1px solid rgba(0,0,0,0.04)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                      }}
                    >
                      <div className={`text-[15px] leading-relaxed ${
                        message.isError ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {formatMessage(message.text)}
                      </div>

                      {/* Interactive Buttons */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                          {message.buttons.map((btn) => (
                            <motion.button
                              key={btn.action}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleButtonClick(btn.action, btn.label)}
                              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                            >
                              {btn.label}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp and Copy */}
                    <div className="flex items-center gap-3 mt-2 px-1">
                      <span className={`text-xs font-semibold ${
                        message.isError ? 'text-red-400' : 'text-teal-600'
                      }`}>{message.timestamp}</span>
                      {!message.isError && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyMessage(message.id, message.text)}
                          className="text-gray-400 hover:text-teal-500 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {message.sender === 'user' && (
                <div className="flex gap-3 max-w-[85%]">
                  {/* Message Bubble */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="rounded-2xl rounded-tr-md p-4 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                      }}
                    >
                      <p className="text-white text-[15px] leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex justify-end mt-2 px-1">
                      <span className="text-xs text-gray-400 font-medium">{message.timestamp}</span>
                    </div>
                  </div>

                  {/* User Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                    }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)'
                }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div
                className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-sm"
                style={{
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}
              >
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-2.5 h-2.5 bg-teal-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2.5 h-2.5 bg-teal-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                  />
                  <motion.div
                    className="w-2.5 h-2.5 bg-teal-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="bg-white p-4"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Please wait..." : "Ask me anything..."}
              disabled={isLoading}
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-teal-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={!isLoading && inputValue.trim() ? { scale: 1.05 } : {}}
            whileTap={!isLoading && inputValue.trim() ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="h-[52px] px-6 rounded-2xl flex items-center gap-2 text-white font-semibold text-[15px] transition-all disabled:cursor-not-allowed"
            style={{
              background: inputValue.trim() && !isLoading
                ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                : 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)',
              boxShadow: inputValue.trim() && !isLoading
                ? '0 4px 15px rgba(139, 92, 246, 0.4)'
                : 'none',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Wait' : 'Send'}</span>
          </motion.button>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '1px solid #d1fae5'
            }}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-700 font-medium">Your conversations are secure and private</span>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}
