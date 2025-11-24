import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Send, Bot, User, Brain, BookOpen, Lightbulb, 
  Sparkles, Layers, Atom, Network, Cpu, ChevronRight,
  GraduationCap, Target, Zap, RefreshCw, Copy, CheckCircle
} from 'lucide-react';
import { createAIService } from '../../../../services/aiService';
import { getAICacheService } from '../../../../services/aiCacheService';
import { AI_CONFIG } from '../../../../config/aiConfig';
import type { AIMessage } from '../../../../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ConceptBreakdown {
  mainConcept: string;
  subConcepts: string[];
  relatedTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function AIConceptLearningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conceptBreakdown, setConceptBreakdown] = useState<ConceptBreakdown | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const topic = searchParams.get('topic') || '';
  const question = searchParams.get('question') || '';

  useEffect(() => {
    // Initial AI greeting and context setup
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI learning assistant. I see you want to learn more about **${topic}**. 

Based on the question you encountered: "${question}"

I'll help you understand this concept deeply. You can ask me:
- To explain the core concepts
- For real-world examples
- How this relates to other topics
- Practice problems to solidify understanding
- Study strategies for this topic

How would you like to start exploring this concept?`,
      timestamp: new Date()
    };

    setMessages([initialMessage]);

    // Generate concept breakdown
    generateConceptBreakdown();
  }, [topic, question]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateConceptBreakdown = () => {
    // Simulate AI analysis of the concept
    const breakdown: ConceptBreakdown = {
      mainConcept: topic,
      subConcepts: [
        'Fundamental principles',
        'Key formulas and definitions',
        'Common applications',
        'Related theories'
      ],
      relatedTopics: [
        'Prerequisites needed',
        'Advanced extensions',
        'Cross-domain connections'
      ],
      difficulty: 'intermediate'
    };
    setConceptBreakdown(breakdown);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add AI message placeholder
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Check if streaming is enabled
      if (AI_CONFIG[AI_CONFIG.defaultProvider].streamEnabled) {
        await handleStreamingResponse(input, aiMessage.id);
      } else {
        // Non-streaming response
        const response = await generateAIResponse(input, topic, question);
        
        // Update message with AI response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: response, isLoading: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: 'I apologize, but I encountered an error. Please try again.', isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingResponse = async (userInput: string, messageId: string) => {
    try {
      const aiService = createAIService(AI_CONFIG.defaultProvider, '');
      
      const systemPrompt = `You are an expert educational AI assistant helping a student understand "${topic}". 
The student encountered this question: "${question}"
Your role is to:
1. Provide clear, accurate explanations tailored to the student's question
2. Use examples and analogies to make complex concepts easier to understand
3. Break down information into digestible parts
4. Be encouraging and supportive
5. Use markdown formatting for better readability
6. Include relevant formulas, diagrams descriptions, or step-by-step explanations when appropriate
7. Always relate your explanation back to the original question when relevant`;

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Student's question: ${userInput}\n\nPlease provide a comprehensive, educational response that helps the student deeply understand this concept.` }
      ];

      let accumulatedResponse = '';
      
      // Stream the response
      for await (const chunk of aiService.streamResponse(messages)) {
        accumulatedResponse += chunk;
        
        // Update message content as it streams
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: accumulatedResponse, isLoading: false }
              : msg
          )
        );
      }

      // Cache the complete response
      const cache = getAICacheService();
      if (AI_CONFIG.cache.enabled) {
        cache.set(topic, question, userInput, accumulatedResponse);
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  };

  const generateAIResponse = async (userInput: string, topic: string, originalQuestion: string): Promise<string> => {
    // Check cache first
    const cache = getAICacheService();
    const cachedResponse = cache.get(topic, originalQuestion, userInput);
    if (cachedResponse && AI_CONFIG.cache.enabled) {
      return cachedResponse;
    }

    // Create a context-aware prompt for the AI
    const systemPrompt = `You are an expert educational AI assistant helping a student understand "${topic}". 
The student encountered this question: "${originalQuestion}"
Your role is to:
1. Provide clear, accurate explanations tailored to the student's question
2. Use examples and analogies to make complex concepts easier to understand
3. Break down information into digestible parts
4. Be encouraging and supportive
5. Use markdown formatting for better readability
6. Include relevant formulas, diagrams descriptions, or step-by-step explanations when appropriate
7. Always relate your explanation back to the original question when relevant`;

    const userPrompt = `Student's question: ${userInput}

Please provide a comprehensive, educational response that helps the student deeply understand this concept.`;

    try {
      // Use real AI service
      const aiService = createAIService(AI_CONFIG.defaultProvider, '');
      
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      // If streaming is enabled and we want real-time response
      if (AI_CONFIG[AI_CONFIG.defaultProvider].streamEnabled) {
        // For now, we'll use non-streaming for simplicity
        // You can implement streaming later for better UX
        const response = await aiService.generateResponse(messages);
        
        // Cache the response
        if (AI_CONFIG.cache.enabled) {
          cache.set(topic, originalQuestion, userInput, response);
        }
        
        return response;
      } else {
        const response = await aiService.generateResponse(messages);
        
        // Cache the response
        if (AI_CONFIG.cache.enabled) {
          cache.set(topic, originalQuestion, userInput, response);
        }
        
        return response;
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback to context-aware response if AI service fails
      const fallbackResponse = await generateContextAwareResponse(userInput, topic, originalQuestion);
      return fallbackResponse;
    }
  };

  // Helper function to generate context-aware responses (fallback)
  const generateContextAwareResponse = async (
    userInput: string, 
    topic: string, 
    originalQuestion: string
  ): Promise<string> => {
    const lowerInput = userInput.toLowerCase();
    
    // Analyze the user's question to provide the most relevant response
    const questionAnalysis = analyzeQuestion(lowerInput);
    
    // Generate response based on question type
    switch (questionAnalysis.type) {
      case 'example':
        return generateExampleResponse(topic, originalQuestion, questionAnalysis.specifics);
      case 'formula':
        return generateFormulaResponse(topic, originalQuestion, questionAnalysis.specifics);
      case 'why':
        return generateImportanceResponse(topic, originalQuestion, questionAnalysis.specifics);
      case 'difficulty':
        return generateDifficultyResponse(topic, originalQuestion, userInput);
      case 'comparison':
        return generateComparisonResponse(topic, originalQuestion, questionAnalysis.specifics);
      case 'application':
        return generateApplicationResponse(topic, originalQuestion, questionAnalysis.specifics);
      case 'definition':
        return generateDefinitionResponse(topic, originalQuestion, questionAnalysis.specifics);
      default:
        return generateComprehensiveResponse(topic, originalQuestion, userInput);
    }
  };

  // Helper function to analyze question type
  const analyzeQuestion = (input: string) => {
    const patterns = {
      example: /example|real world|instance|case|scenario/i,
      formula: /formula|equation|calculate|solve|mathematical/i,
      why: /why|important|significance|purpose|reason/i,
      difficulty: /difficult|struggle|confus|hard|understand|help/i,
      comparison: /difference|compare|versus|vs|similar/i,
      application: /apply|use|when|where|how to/i,
      definition: /what is|define|meaning|explain what/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) {
        return { 
          type, 
          specifics: input.match(pattern)?.[0] || ''
        };
      }
    }

    return { type: 'general', specifics: '' };
  };

  // Specific response generators
  const generateExampleResponse = (topic: string, originalQuestion: string, specifics: string) => {
    const examples = getTopicExamples(topic);
    return `Great question! Let me provide you with concrete examples to understand **${topic}** better:

${examples.map((ex, idx) => `**Example ${idx + 1}: ${ex.title}**
${ex.description}

*How it works:*
${ex.explanation}

*Key takeaway:* ${ex.takeaway}`).join('\n\n')}

**Connecting to Your Question:**
The original question "${originalQuestion}" tests your understanding of how ${topic} works in practice. These examples show ${examples[0].connection || 'the practical application of this concept'}.

Would you like me to:
- Elaborate on any specific example?
- Provide more examples from different contexts?
- Show how to apply this to similar questions?`;
  };

  const generateFormulaResponse = (topic: string, originalQuestion: string, specifics: string) => {
    const formulas = getTopicFormulas(topic);
    return `Here are the essential formulas and equations for **${topic}**:

${formulas.map(f => `**${f.name}**
\`\`\`
${f.formula}
\`\`\`
- **When to use:** ${f.usage}
- **Variables:** ${f.variables}
- **Units:** ${f.units || 'N/A'}`).join('\n\n')}

**Step-by-Step Application:**
1. **Identify** what you're solving for
2. **List** all given values
3. **Choose** the appropriate formula
4. **Substitute** values carefully (check units!)
5. **Calculate** step by step
6. **Verify** your answer makes sense

**For Your Question:**
"${originalQuestion}" likely requires ${formulas[0].applicationHint || 'applying these formulas to find the solution'}.

Would you like me to:
- Work through a practice problem?
- Explain when to use each formula?
- Show common mistakes to avoid?`;
  };

  const generateImportanceResponse = (topic: string, originalQuestion: string, specifics: string) => {
    return `Understanding **${topic}** is crucial for several compelling reasons:

**🎯 Academic Importance:**
- Forms the foundation for [advanced topics]
- Frequently tested in competitive exams
- Essential for understanding [related subjects]

**🌍 Real-World Applications:**
1. **Technology**: Used in [specific technologies]
2. **Industry**: Applied in [industries/fields]
3. **Daily Life**: Helps understand [everyday phenomena]

**🧠 Cognitive Benefits:**
- Develops [specific thinking skills]
- Enhances problem-solving abilities
- Builds analytical reasoning

**📈 Career Relevance:**
- **Engineering**: Essential for [specific applications]
- **Research**: Foundation for [research areas]
- **Innovation**: Enables [types of innovation]

**Why This Matters for Your Question:**
"${originalQuestion}" tests this knowledge because ${topic} is fundamental to [broader concept]. Mastering it will help you:
- Tackle similar problems with confidence
- Build on this for advanced topics
- Apply it in practical scenarios

What specific aspect of ${topic}'s importance would you like to explore further?`;
  };

  const generateDifficultyResponse = (topic: string, originalQuestion: string, userInput: string) => {
    return `I understand you're finding **${topic}** challenging. Let's work through this together! 💪

**🎯 Let's Diagnose the Difficulty:**
Based on your question about "${originalQuestion}", the challenge might be:
- Understanding the core concept
- Applying it to problems
- Remembering key details
- Connecting different ideas

**📚 Simplified Explanation:**
Think of ${topic} like ${getSimpleAnalogy(topic)}. 

**🔍 Breaking It Down:**
1. **Start with the basics**: ${getBasicConcept(topic)}
2. **Build understanding**: ${getBuildingBlock(topic)}
3. **Connect the dots**: ${getConnection(topic)}
4. **Practice application**: ${getApplication(topic)}

**💡 Common Confusion Points:**
- **Mistake 1**: [Common error] → **Fix**: [Solution]
- **Mistake 2**: [Common error] → **Fix**: [Solution]
- **Mistake 3**: [Common error] → **Fix**: [Solution]

**📈 Your Learning Path:**
1. ✅ Master the fundamentals (you're here!)
2. ⏳ Practice with guided examples
3. ⏳ Attempt independent problems
4. ⏳ Teach someone else

**🤝 I'm Here to Help:**
- What specific part is most confusing?
- Would you like me to explain it differently?
- Should we work through an example together?

Remember: Every expert was once a beginner. You're making progress by asking questions! 🌟`;
  };

  const generateComparisonResponse = (topic: string, originalQuestion: string, specifics: string) => {
    return `Let me help you understand the comparisons and distinctions related to **${topic}**:

**📊 Key Comparisons:**

| Aspect | ${topic} | Related Concept |
|--------|-----------|-----------------|
| Definition | [Definition 1] | [Definition 2] |
| When to use | [Use case 1] | [Use case 2] |
| Key feature | [Feature 1] | [Feature 2] |
| Example | [Example 1] | [Example 2] |

**🔍 Important Distinctions:**
1. **Fundamental Difference**: ${topic} focuses on [aspect], while [related] emphasizes [other aspect]
2. **Application**: Use ${topic} when [condition], but use [related] when [other condition]
3. **Results**: ${topic} gives you [outcome], whereas [related] provides [different outcome]

**🎯 For Your Question:**
"${originalQuestion}" requires understanding these differences because [explanation of relevance].

**💡 Memory Tip:**
Remember: ${topic} is like [analogy 1], while [related concept] is like [analogy 2].

Would you like me to:
- Provide more specific comparisons?
- Show examples of each in action?
- Explain when to choose one over the other?`;
  };

  const generateApplicationResponse = (topic: string, originalQuestion: string, specifics: string) => {
    return `Let me show you how to apply **${topic}** effectively:

**🎯 When to Apply ${topic}:**
1. **Scenario 1**: When you see [indicator/condition]
2. **Scenario 2**: If the problem involves [characteristic]
3. **Scenario 3**: When asked about [type of question]

**📝 Application Process:**
\`\`\`
Step 1: Identify the problem type
   ↓
Step 2: Check if ${topic} applies
   ↓
Step 3: Gather necessary information
   ↓
Step 4: Apply the concept/formula
   ↓
Step 5: Verify your result
\`\`\`

**🔧 Practical Application to Your Question:**
For "${originalQuestion}":
1. **Recognize**: This is asking about [specific aspect]
2. **Recall**: The relevant principle is [principle]
3. **Apply**: Use [method/formula]
4. **Solve**: [Step-by-step approach]

**⚡ Pro Tips:**
- Always [tip 1]
- Never forget to [tip 2]
- Double-check [tip 3]

**🎮 Practice Scenarios:**
Try applying this to:
- [Practice scenario 1]
- [Practice scenario 2]
- [Practice scenario 3]

Which application aspect would you like to practice more?`;
  };

  const generateDefinitionResponse = (topic: string, originalQuestion: string, specifics: string) => {
    return `Let me provide a comprehensive understanding of **${topic}**:

**📖 Definition:**
${topic} is ${getComprehensiveDefinition(topic)}

**🔑 Key Components:**
1. **Component 1**: [Explanation]
2. **Component 2**: [Explanation]
3. **Component 3**: [Explanation]

**🎨 Visual Understanding:**
Imagine ${topic} as ${getVisualAnalogy(topic)}

**📊 Characteristics:**
- **Property 1**: [Description]
- **Property 2**: [Description]
- **Property 3**: [Description]

**🔗 Related Concepts:**
- **Prerequisite**: You need to understand [concept] first
- **Related**: This connects to [related topic]
- **Advanced**: This leads to [advanced topic]

**💡 In Simple Terms:**
If I had to explain ${topic} to a 10-year-old, I'd say: ${getSimpleExplanation(topic)}

**🎯 For Your Question:**
"${originalQuestion}" is testing whether you understand that ${topic} ${getQuestionConnection(topic, originalQuestion)}

Would you like me to:
- Elaborate on any specific component?
- Provide more examples?
- Explain how this connects to other topics?`;
  };

  const generateComprehensiveResponse = (topic: string, originalQuestion: string, userInput: string) => {
    return `I'll help you understand **${topic}** in relation to your question.

**📚 Understanding Your Query:**
You asked: "${userInput}"

**🎯 Core Explanation:**
${topic} is fundamentally about ${getCoreExplanation(topic)}. This concept is essential because ${getImportance(topic)}.

**🔍 Breaking It Down:**
1. **Basic Principle**: ${getBasicPrinciple(topic)}
2. **How It Works**: ${getHowItWorks(topic)}
3. **Key Applications**: ${getKeyApplications(topic)}

**📖 Connecting to Your Original Question:**
"${originalQuestion}" 
- Tests your understanding of: ${getTestedConcept(topic)}
- Requires you to: ${getRequiredSkill(topic)}
- Common approach: ${getCommonApproach(topic)}

**💡 Study Strategy:**
1. First, ensure you understand [fundamental concept]
2. Then, practice with [type of problems]
3. Finally, apply to [advanced scenarios]

**🤔 Think About It:**
- How would you explain this to a friend?
- Can you think of a real-world example?
- What would happen if this principle didn't exist?

**Next Steps:**
What would you like to explore further:
- 📝 More examples?
- 🧮 Practice problems?
- 🔗 Related concepts?
- 🎯 Specific applications?

I'm here to help you master this topic! Feel free to ask follow-up questions.`;
  };

  // Helper functions for generating content
  const getTopicExamples = (topic: string) => {
    const topicLower = topic.toLowerCase();
    
    // Weather and Climate specific examples
    if (topicLower.includes('weather') || topicLower.includes('climate')) {
      return [
        {
          title: "Daily Weather Patterns",
          description: "The sea breeze you feel at the beach is a perfect example of local weather phenomena",
          explanation: "During the day, land heats up faster than water. This creates low pressure over land and high pressure over sea, causing wind to blow from sea to land",
          takeaway: "Temperature differences create pressure differences, which drive wind patterns",
          connection: "how temperature and pressure gradients create weather patterns"
        },
        {
          title: "Monsoon Impact on Agriculture",
          description: "Indian farmers plan their crop cycles based on monsoon predictions",
          explanation: "The Southwest monsoon (June-September) brings 75% of India's rainfall, crucial for kharif crops like rice and cotton",
          takeaway: "Understanding climate patterns is essential for food security",
          connection: "the real-world importance of climate systems"
        },
        {
          title: "Urban Heat Islands",
          description: "Cities are typically 2-5°C warmer than surrounding rural areas",
          explanation: "Concrete and asphalt absorb more heat, reduced vegetation means less cooling, and tall buildings trap heat",
          takeaway: "Human activities significantly modify local climate",
          connection: "how human activities influence weather and climate"
        }
      ];
    }
    
    // Indian Monsoon System examples
    if (topicLower.includes('monsoon')) {
      return [
        {
          title: "Monsoon Onset in Kerala",
          description: "The arrival of monsoon in Kerala around June 1st marks the beginning of India's rainy season",
          explanation: "The ITCZ shifts northward, southwest winds from the Indian Ocean bring moisture, and the Western Ghats force these winds upward causing rainfall",
          takeaway: "Geographic features and global wind patterns combine to create monsoons",
          connection: "how multiple factors interact to create monsoon systems"
        },
        {
          title: "Mango Showers",
          description: "Pre-monsoon rainfall in April-May that helps ripen mangoes in Kerala and Karnataka",
          explanation: "These are caused by thunderstorms due to high temperatures and local convection before the main monsoon arrives",
          takeaway: "Not all rainfall is from monsoons - local weather patterns matter too",
          connection: "the diversity of rainfall patterns in India"
        },
        {
          title: "Monsoon Break",
          description: "Sometimes the monsoon 'takes a break' for 10-15 days with no rainfall",
          explanation: "This happens when the monsoon trough shifts to the Himalayan foothills, redirecting rainfall away from central India",
          takeaway: "Monsoons aren't continuous - they have active and break phases",
          connection: "the variability within monsoon systems"
        }
      ];
    }
    
    // History - Quit India Movement examples
    if (topicLower.includes('quit india') || topicLower.includes('1942')) {
      return [
        {
          title: "Do or Die Speech",
          description: "Gandhi's famous 'Do or Die' speech at Gowalia Tank Maidan, Mumbai on August 8, 1942",
          explanation: "Gandhi called for complete independence, asking every Indian to consider themselves free and act accordingly",
          takeaway: "The movement marked a shift from gradual reform to immediate independence",
          connection: "the escalation of the freedom struggle"
        },
        {
          title: "Underground Activities",
          description: "With leaders arrested, underground networks like Congress Radio kept the movement alive",
          explanation: "Usha Mehta ran Congress Radio, underground newspapers spread news, and parallel governments formed in some areas",
          takeaway: "The movement continued despite repression through innovative resistance",
          connection: "how civil disobedience adapted under repression"
        },
        {
          title: "Different Responses",
          description: "Not all groups supported Quit India - Muslim League stayed away, Communist Party initially opposed",
          explanation: "Muslim League wanted separate negotiations, Communists prioritized defeating fascism in WWII",
          takeaway: "The independence movement had multiple voices and strategies",
          connection: "the complexity of India's freedom struggle"
        }
      ];
    }
    
    // Science - Laws of Motion examples
    if (topicLower.includes('motion') || topicLower.includes('newton')) {
      return [
        {
          title: "Car Safety Features",
          description: "Seatbelts and airbags are designed using Newton's First Law (inertia)",
          explanation: "When a car stops suddenly, your body wants to keep moving forward due to inertia. Seatbelts provide the force to stop you with the car",
          takeaway: "Understanding physics saves lives through better safety design",
          connection: "how physics principles guide engineering solutions"
        },
        {
          title: "Rocket Launch",
          description: "Rockets work on Newton's Third Law - for every action, there's an equal and opposite reaction",
          explanation: "Hot gases pushed downward (action) create an upward thrust on the rocket (reaction). The more mass ejected and faster it's ejected, the greater the thrust",
          takeaway: "Space exploration is possible because of fundamental physics laws",
          connection: "how basic principles enable complex achievements"
        },
        {
          title: "Sports Applications",
          description: "A cricket batsman uses Newton's Second Law (F=ma) to hit sixes",
          explanation: "Greater force applied to the ball (with proper technique) results in greater acceleration. The ball's mass is constant, so more force = more acceleration = longer hit",
          takeaway: "Sports performance can be improved by understanding physics",
          connection: "the practical application of force and acceleration"
        }
      ];
    }
    
    // Mathematics examples
    if (topicLower.includes('quadratic') || topicLower.includes('equation')) {
      return [
        {
          title: "Projectile Motion",
          description: "The path of a thrown ball follows a parabola described by a quadratic equation",
          explanation: "Height = initial height + (initial velocity × time) - (0.5 × gravity × time²). This is a quadratic in terms of time",
          takeaway: "Quadratic equations describe many real-world curved paths",
          connection: "how algebra describes physical phenomena"
        },
        {
          title: "Business Profit Optimization",
          description: "Companies use quadratic functions to find optimal pricing for maximum profit",
          explanation: "Profit = Revenue - Cost. Revenue often follows a quadratic pattern: too low price = low profit, too high price = few sales = low profit",
          takeaway: "Mathematics helps make optimal business decisions",
          connection: "the role of mathematics in economics"
        },
        {
          title: "Architecture and Design",
          description: "The Gateway of India arch and many bridges use parabolic shapes",
          explanation: "Parabolic arches distribute weight evenly, making structures stronger. The shape is described by quadratic equations",
          takeaway: "Mathematical beauty often coincides with structural efficiency",
          connection: "how mathematics influences design and engineering"
        }
      ];
    }
    
    // Default examples for other topics
    const defaultExamples = [
      {
        title: "Practical Application",
        description: `Consider how ${topic} appears in everyday situations`,
        explanation: "This principle helps us understand and predict outcomes in real scenarios",
        takeaway: "Theory becomes powerful when applied to solve real problems",
        connection: "the bridge between academic knowledge and practical skills"
      },
      {
        title: "Scientific Understanding",
        description: `${topic} helps explain natural phenomena we observe`,
        explanation: "By understanding the underlying principles, we can make sense of complex observations",
        takeaway: "Science provides frameworks for understanding our world",
        connection: "how systematic study reveals natural patterns"
      },
      {
        title: "Technological Innovation",
        description: `Modern technology often relies on understanding of ${topic}`,
        explanation: "Innovations build upon fundamental concepts to create new solutions",
        takeaway: "Basic knowledge enables advanced applications",
        connection: "the foundation that enables technological progress"
      }
    ];
    
    return defaultExamples;
  };

  const getTopicFormulas = (topic: string) => {
    const topicLower = topic.toLowerCase();
    
    // Physics - Laws of Motion
    if (topicLower.includes('motion') || topicLower.includes('newton') || topicLower.includes('force')) {
      return [
        {
          name: "Newton's Second Law",
          formula: "F = ma",
          usage: "To find force, mass, or acceleration when two are known",
          variables: "F = Force (N), m = mass (kg), a = acceleration (m/s²)",
          units: "Force in Newtons (N)",
          applicationHint: "calculating the net force or resulting acceleration"
        },
        {
          name: "Equations of Motion",
          formula: "v = u + at",
          usage: "For objects with constant acceleration",
          variables: "v = final velocity, u = initial velocity, a = acceleration, t = time",
          units: "Velocity (m/s), Time (s), Acceleration (m/s²)",
          applicationHint: "finding velocity after a certain time"
        },
        {
          name: "Distance Formula",
          formula: "s = ut + ½at²",
          usage: "To find distance traveled under constant acceleration",
          variables: "s = distance, u = initial velocity, t = time, a = acceleration",
          units: "Distance (m)",
          applicationHint: "calculating how far an object travels"
        }
      ];
    }
    
    // Mathematics - Quadratic Equations
    if (topicLower.includes('quadratic')) {
      return [
        {
          name: "Quadratic Formula",
          formula: "x = (-b ± √(b² - 4ac)) / 2a",
          usage: "To find roots of any quadratic equation ax² + bx + c = 0",
          variables: "a, b, c = coefficients of the quadratic equation",
          units: "Dimensionless",
          applicationHint: "solving when factorization is difficult"
        },
        {
          name: "Discriminant",
          formula: "D = b² - 4ac",
          usage: "To determine the nature of roots",
          variables: "D > 0: two real roots, D = 0: one real root, D < 0: complex roots",
          units: "Dimensionless",
          applicationHint: "checking if real solutions exist"
        },
        {
          name: "Sum and Product of Roots",
          formula: "Sum = -b/a, Product = c/a",
          usage: "Quick calculations without finding individual roots",
          variables: "For equation ax² + bx + c = 0",
          units: "Dimensionless",
          applicationHint: "verifying solutions or creating equations"
        }
      ];
    }
    
    // Geography - Climate calculations
    if (topicLower.includes('climate') || topicLower.includes('temperature')) {
      return [
        {
          name: "Temperature Lapse Rate",
          formula: "Temperature drop = 6.5°C per 1000m",
          usage: "To calculate temperature at different altitudes",
          variables: "Normal lapse rate in troposphere",
          units: "°C/km",
          applicationHint: "estimating mountain temperatures"
        },
        {
          name: "Relative Humidity",
          formula: "RH = (Actual vapor pressure / Saturation vapor pressure) × 100%",
          usage: "To measure moisture content in air",
          variables: "RH = Relative Humidity (%)",
          units: "Percentage (%)",
          applicationHint: "predicting precipitation likelihood"
        },
        {
          name: "Pressure-Altitude Relationship",
          formula: "P = P₀ × (1 - 0.0065h/T₀)^5.256",
          usage: "To find atmospheric pressure at any height",
          variables: "P = pressure at height h, P₀ = sea level pressure",
          units: "Pressure (hPa or mb)",
          applicationHint: "understanding weather systems"
        }
      ];
    }
    
    // Default formulas for other topics
    return [
      {
        name: "Core Relationship",
        formula: "Key formula for " + topic,
        usage: "When solving standard problems",
        variables: "Variables specific to the concept",
        units: "Appropriate units",
        applicationHint: "applying the fundamental principle"
      },
      {
        name: "Extended Application",
        formula: "Advanced formula for " + topic,
        usage: "For complex scenarios",
        variables: "Additional parameters for special cases",
        units: "Context-dependent units",
        applicationHint: "handling advanced problems"
      }
    ];
  };

  const getSimpleAnalogy = (topic: string) => {
    // Topic-specific analogies
    const analogies = {
      default: "a tool that helps you solve specific types of problems - just like how a key opens a specific lock"
    };
    return analogies.default;
  };

  const getBasicConcept = (topic: string) => {
    return `The fundamental idea that ${topic} represents a relationship or pattern that helps us understand and predict outcomes`;
  };

  const getBuildingBlock = (topic: string) => {
    return `Once you grasp the basic idea, add layers of complexity gradually, starting with simple cases`;
  };

  const getConnection = (topic: string) => {
    return `See how ${topic} relates to concepts you already know - it's often an extension or application of familiar ideas`;
  };

  const getApplication = (topic: string) => {
    return `Start with textbook problems, then move to real-world scenarios where ${topic} provides solutions`;
  };

  const getComprehensiveDefinition = (topic: string) => {
    return `a fundamental concept that describes the relationship between different elements in a system, allowing us to understand, predict, and manipulate outcomes`;
  };

  const getVisualAnalogy = (topic: string) => {
    return `a bridge connecting two islands of knowledge - it helps you travel from what you know to what you need to understand`;
  };

  const getSimpleExplanation = (topic: string) => {
    return `"It's like a special rule that helps us figure out answers to tricky questions, just like how knowing the rules of a game helps you play better!"`;
  };

  const getQuestionConnection = (topic: string, question: string) => {
    return `is essential for solving this type of problem because it provides the framework for understanding the relationships involved`;
  };

  const getCoreExplanation = (topic: string) => {
    return `understanding patterns and relationships that allow us to solve problems systematically`;
  };

  const getImportance = (topic: string) => {
    return `it forms the foundation for more advanced concepts and has practical applications in various fields`;
  };

  const getBasicPrinciple = (topic: string) => {
    return `At its core, ${topic} establishes a relationship that remains consistent across different scenarios`;
  };

  const getHowItWorks = (topic: string) => {
    return `By identifying key variables and understanding their relationships, we can predict outcomes and solve problems`;
  };

  const getKeyApplications = (topic: string) => {
    return `This concept is used in problem-solving, analysis, design, and understanding complex systems`;
  };

  const getTestedConcept = (topic: string) => {
    return `how well you can identify and apply the relevant principles to solve problems`;
  };

  const getRequiredSkill = (topic: string) => {
    return `analyze the given information, identify the applicable concept, and execute the solution correctly`;
  };

  const getCommonApproach = (topic: string) => {
    return `Read carefully, identify key information, apply the relevant principle, and verify your answer`;
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the user message before this AI message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0 && messages[messageIndex - 1].type === 'user') {
      const userMessage = messages[messageIndex - 1];
      
      // Update the AI message to loading state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isLoading: true, content: '' }
            : msg
        )
      );
      
      setIsLoading(true);
      
      try {
        // Regenerate response
        const response = await generateAIResponse(userMessage.content, topic, question);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: response, isLoading: false }
              : msg
          )
        );
      } catch (error) {
        console.error('Regeneration error:', error);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: 'I apologize, but I encountered an error. Please try again.', isLoading: false }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const suggestedQuestions = [
    "Can you explain this concept in simple terms?",
    "Show me real-world examples",
    "What are common mistakes to avoid?",
    "How does this relate to other topics?",
    "Give me a step-by-step breakdown"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AI Concept Learning</h1>
                  <p className="text-sm text-gray-600">Deep dive into: {topic}</p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Concept Breakdown */}
          <div className="lg:col-span-1 space-y-4">
            {/* Concept Map */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Atom size={20} className="text-brand-primary" />
                Concept Map
              </h3>
              {conceptBreakdown && (
                <div className="space-y-3">
                  <div className="p-3 bg-brand-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-brand-primary">{conceptBreakdown.mainConcept}</p>
                  </div>
                  <div className="space-y-2">
                    {conceptBreakdown.subConcepts.map((concept, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full" />
                        {concept}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Learning Tools */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                >
                  📖 Show Examples
                </button>
                <button
                  onClick={() => navigate(`/skill-exercise?topic=${encodeURIComponent(topic)}`)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                >
                  🎯 Practice Problems
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                  🗺️ Mind Map View
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                  📊 Visual Diagrams
                </button>
              </div>
            </motion.div>

            {/* Related Topics */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Network size={20} className="text-brand-secondary" />
                Related Topics
              </h3>
              <div className="space-y-2">
                {conceptBreakdown?.relatedTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-220px)] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'ai' 
                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary' 
                        : 'bg-gray-200'
                    }`}>
                      {message.type === 'ai' ? (
                        <Bot className="text-white" size={20} />
                      ) : (
                        <User className="text-gray-600" size={20} />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.type === 'ai'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                      }`}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                          </div>
                        )}
                      </div>
                      {message.type === 'ai' && !message.isLoading && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            {copiedId === message.id ? (
                              <>
                                <CheckCircle size={14} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => handleRegenerate(message.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            <RefreshCw size={14} />
                            Regenerate
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(question)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-4">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything about this concept..."
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                    rows={2}
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} />
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIConceptLearningPage;