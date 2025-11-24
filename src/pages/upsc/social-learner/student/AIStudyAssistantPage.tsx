import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Loader2,
  Paperclip,
  Image,
  FileText,
  Mic,
  MicOff,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  BookOpen,
  Brain,
  Lightbulb,
  Search,
  MessageSquare,
  History,
  Settings,
  Download,
  Share2,
  Star,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Code,
  Calculator,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  feedback?: 'positive' | 'negative';
  isTyping?: boolean;
  suggestions?: string[];
  references?: Reference[];
}

interface Attachment {
  type: 'image' | 'document';
  name: string;
  url: string;
}

interface Reference {
  title: string;
  source: string;
  page?: number;
  url?: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export function AIStudyAssistantPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'study' | 'solve' | 'explain' | 'revise'>('study');
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample initial message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your AI Study Assistant for Day ${dayNumber}. I'm here to help you with:
        
• Understanding today's concepts
• Solving practice problems
• Clarifying doubts
• Providing study resources
• Creating revision notes

How can I assist you today?`,
        timestamp: new Date(),
        suggestions: [
          "Explain today's key concepts",
          "Give me practice questions",
          "Help me with revision notes",
          "Clarify my doubts"
        ]
      }
    ]);
  }, [dayNumber]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { icon: Brain, label: 'Explain Concept', color: 'from-blue-500 to-blue-600' },
    { icon: Calculator, label: 'Solve Problem', color: 'from-green-500 to-green-600' },
    { icon: BookOpen, label: 'Study Notes', color: 'from-purple-500 to-purple-600' },
    { icon: HelpCircle, label: 'Ask Doubt', color: 'from-orange-500 to-orange-600' }
  ];

  const studyModes = [
    { id: 'study', label: 'Study Mode', icon: BookOpen, description: 'Learn new concepts' },
    { id: 'solve', label: 'Problem Solving', icon: Calculator, description: 'Practice questions' },
    { id: 'explain', label: 'Explain Mode', icon: Lightbulb, description: 'Detailed explanations' },
    { id: 'revise', label: 'Revision Mode', icon: RefreshCw, description: 'Quick revision' }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !fileInputRef.current?.files?.length) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputValue, selectedMode),
        timestamp: new Date(),
        references: [
          { title: 'NCERT History Class 12', source: 'Chapter 2', page: 45 },
          { title: 'Previous Year Questions', source: 'UPSC 2020', url: '#' }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string, mode: string) => {
    // In a real app, this would call an AI API
    const responses: { [key: string]: string } = {
      study: `Based on your query about "${query}", here's a comprehensive explanation:

**Key Concepts:**
1. **Historical Context**: The Mauryan Empire (322-185 BCE) was the first large-scale empire in Indian history.

2. **Administrative System**: 
   - Centralized bureaucracy with the emperor at the apex
   - Provincial administration divided into provinces (Pradesh)
   - District administration with various officials

3. **Economic Structure**:
   - Agriculture as the primary economic activity
   - State control over trade and commerce
   - Sophisticated taxation system

**Important Points to Remember:**
- Chandragupta Maurya founded the empire after defeating the Nandas
- Kautilya's Arthashastra provides insights into Mauryan administration
- Ashoka's edicts are primary sources for understanding his policies

Would you like me to elaborate on any specific aspect?`,
      
      solve: `Let's solve this step by step:

**Problem Analysis:**
Based on your question about "${query}", here's the solution approach:

**Step 1**: Identify the key elements
- What is being asked?
- What information is given?
- What concepts apply?

**Step 2**: Apply the relevant formula/concept
- For Mauryan administration questions, focus on the hierarchical structure
- For economic questions, consider the agrarian base

**Step 3**: Work through the solution
[Detailed solution would go here]

**Answer**: [Final answer]

**Similar Practice Questions:**
1. Explain the role of Dhamma Mahamatras in Ashoka's administration
2. Compare Mauryan and Gupta administrative systems

Would you like to try another problem?`,
      
      explain: `Let me break down "${query}" in simple terms:

**Simple Explanation:**
Think of the Mauryan Empire like a modern corporation:
- The Emperor = CEO
- Ministers (Mantris) = Board of Directors
- Provincial Governors = Regional Managers
- Local Officials = Department Heads

**Real-World Analogy:**
Just like how a company has different departments (HR, Finance, Operations), the Mauryan Empire had:
- Revenue Department (Samaharta)
- Military Department (Senapati)
- Justice Department (Dharmadhyaksha)

**Why This Matters:**
Understanding this structure helps you see how ancient India developed sophisticated governance systems that influenced later periods.

**Memory Tip:**
Remember "CAPE" - Centralized Administration, Provincial Executives

Does this explanation help? Would you like me to use a different analogy?`,
      
      revise: `Quick Revision Points for "${query}":

📌 **Mauryan Empire (322-185 BCE)**
• Founded by: Chandragupta Maurya
• Capital: Pataliputra
• Greatest ruler: Ashoka

📌 **Key Features:**
• First pan-Indian empire
• Centralized administration
• Standing army
• Efficient spy system

📌 **Important Dates:**
• 322 BCE - Foundation
• 269-232 BCE - Ashoka's reign
• 261 BCE - Kalinga War
• 185 BCE - Fall of empire

📌 **Quick Facts:**
✓ 4 provinces: Tosali, Ujjain, Suvarnagiri, Taxila
✓ Dhamma = Ashoka's policy of righteousness
✓ Arthashastra = Administrative manual
✓ Rock Edicts = Primary sources

**Mnemonics:**
"MADE" - Mauryas Administered Dhamma Everywhere

Need revision on any other topic?`
    };

    return responses[mode] || responses.study;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic
      console.log('Files uploaded:', files);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // In a real app, implement voice recording logic
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
  };

  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Chat History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 bg-white border-r border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Chat History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                  </button>
                </div>
                <button
                  onClick={handleNewChat}
                  className="w-full py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                >
                  New Chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setCurrentSessionId(session.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-brand-primary/10 border border-brand-primary'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-gray-800 truncate">{session.title}</p>
                    <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {session.timestamp.toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <History className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">AI Study Assistant</h2>
                    <p className="text-sm text-gray-600">Day {dayNumber} - Always here to help</p>
                  </div>
                </div>
              </div>
              
              {/* Study Mode Selector */}
              <div className="flex items-center gap-2">
                {studyModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id as any)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      selectedMode === mode.id
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={mode.description}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="hidden md:inline text-sm font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gray-200'
                        : 'bg-gradient-to-br from-brand-primary to-brand-secondary'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-gray-700" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                        
                        {message.attachments && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                                {attachment.type === 'image' ? (
                                  <Image className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                                <span className="text-sm">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      {message.role === 'assistant' && !message.isTyping && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleCopyMessage(message.content)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className={`p-1.5 rounded ${
                              message.feedback === 'positive'
                                ? 'text-green-600 bg-green-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className={`p-1.5 rounded ${
                              message.feedback === 'negative'
                                ? 'text-red-600 bg-red-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {/* References */}
                      {message.references && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-medium text-gray-600">References:</p>
                          {message.references.map((ref, idx) => (
                            <a
                              key={idx}
                              href={ref.url || '#'}
                              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{ref.title} - {ref.source} {ref.page && `(p. ${ref.page})`}</span>
                            </a>
                          ))}
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && showSuggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(action.label)}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{action.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask anything about your studies..."
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleVoiceInput}
                      className={`p-1.5 rounded ${
                        isRecording
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Voice input'}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !isLoading}
                className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}