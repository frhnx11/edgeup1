import { useState } from 'react';
import { callOpenAI, callOpenAIWithHistory } from '../../../services/openai';
import type { OpenAIMessage } from '../../../services/openai';

interface FormData {
  mode: 'quick' | 'advanced';
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  objectives: string;
  prerequisites: string;
  teachingStyle: string;
  curriculum: string;
  sectionsToInclude: {
    objectives: boolean;
    materials: boolean;
    activities: boolean;
    assessment: boolean;
    homework: boolean;
    differentiation: boolean;
  };
  specialRequirements: string;
}

interface LessonPlanGeneratorProps {
  onBack: () => void;
}

const LessonPlanGeneratorNew = ({ onBack }: LessonPlanGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    mode: 'quick',
    subject: '',
    grade: '',
    topic: '',
    duration: '',
    objectives: '',
    prerequisites: '',
    teachingStyle: '',
    curriculum: '',
    sectionsToInclude: {
      objectives: true,
      materials: true,
      activities: true,
      assessment: true,
      homework: true,
      differentiation: true
    },
    specialRequirements: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const grades = ['Grade 9', 'Grade 10', 'Grade 10A', 'Grade 10B', 'Grade 11', 'Grade 12'];
  const durations = ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];
  const teachingStyles = ['Traditional', 'Interactive', 'Project-based', 'Flipped Classroom', 'Inquiry-based'];
  const curriculums = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'IGCSE'];

  const handleNext = () => {
    if (formData.mode === 'quick' && currentStep === 1) {
      setCurrentStep(4);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (formData.mode === 'quick' && currentStep === 4) {
      setCurrentStep(1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const statuses = [
      'Analyzing curriculum standards...',
      'Structuring content...',
      'Adding teaching strategies...',
      'Finalizing your plan...'
    ];

    let statusIndex = 0;
    setGenerationStatus(statuses[0]);

    const statusInterval = setInterval(() => {
      statusIndex++;
      if (statusIndex < statuses.length) {
        setGenerationStatus(statuses[statusIndex]);
      }
    }, 3000);

    try {
      // Build the prompt based on mode and form data
      let prompt = `Create a comprehensive lesson plan with the following details:

Subject: ${formData.subject}
Grade Level: ${formData.grade}
Topic: ${formData.topic}
Duration: ${formData.duration}`;

      if (formData.mode === 'advanced') {
        prompt += `
${formData.objectives ? `\nLearning Objectives: ${formData.objectives}` : ''}
${formData.prerequisites ? `\nPrerequisites: ${formData.prerequisites}` : ''}
${formData.teachingStyle ? `\nTeaching Style: ${formData.teachingStyle}` : ''}
${formData.curriculum ? `\nCurriculum: ${formData.curriculum}` : ''}
${formData.specialRequirements ? `\nSpecial Requirements: ${formData.specialRequirements}` : ''}

Include the following sections: ${Object.entries(formData.sectionsToInclude)
  .filter(([_, value]) => value)
  .map(([key]) => key)
  .join(', ')}`;
      }

      prompt += `

Please generate a detailed, well-structured lesson plan in markdown format with:
1. Clear learning objectives
2. Required materials and resources
3. Step-by-step lesson activities with timing
4. Assessment strategies
5. Differentiation approaches for various learning levels
6. Homework assignments
7. Teacher notes and tips

Format the plan professionally with clear headings and sections.`;

      const systemPrompt = `You are an experienced educational curriculum designer specializing in creating comprehensive, engaging lesson plans. Your plans are:
- Pedagogically sound and aligned with educational standards
- Practical and easy to implement
- Student-centered with clear learning outcomes
- Include differentiated instruction strategies
- Professionally formatted and detailed

Generate lesson plans that teachers can immediately use in their classrooms.`;

      const aiGeneratedPlan = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.8,
        max_tokens: 3000
      });

      clearInterval(statusInterval);
      setIsGenerating(false);
      setGeneratedPlan(aiGeneratedPlan);
    } catch (error) {
      clearInterval(statusInterval);
      setIsGenerating(false);
      console.error('Error generating lesson plan:', error);
      // Fallback to mock plan if API fails
      const mockPlan = generateMockPlan();
      setGeneratedPlan(mockPlan + '\n\n*Note: This is a sample plan. AI generation encountered an error.*');
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !generatedPlan) return;

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { text: userMessage, isUser: true }]);
    setChatInput('');

    try {
      // Build conversation history
      const conversationHistory: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an AI assistant helping a teacher refine their lesson plan. The teacher has generated a lesson plan and is now requesting modifications. Be helpful, specific, and explain what changes you would make. Keep responses concise but informative.`
        },
        {
          role: 'user',
          content: `Here is the current lesson plan:\n\n${generatedPlan}\n\nI would like to make a change: ${userMessage}`
        }
      ];

      // Add previous chat messages to context
      chatMessages.forEach(msg => {
        conversationHistory.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add the current user message
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const aiResponse = await callOpenAIWithHistory(conversationHistory, {
        temperature: 0.7,
        max_tokens: 500
      });

      setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, {
        text: "I'm having trouble processing that request. Please try rephrasing or try again later.",
        isUser: false
      }]);
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  const generateMockPlan = () => {
    return `## Lesson Plan: ${formData.topic}

### Subject: ${formData.subject}
### Grade: ${formData.grade}
### Duration: ${formData.duration}

---

## Learning Objectives
By the end of this lesson, students will be able to:
1. Understand the fundamental concepts of ${formData.topic}
2. Apply theoretical knowledge to practical examples
3. Demonstrate proficiency through hands-on activities
4. Analyze and evaluate different approaches to problem-solving

---

## Materials Needed
- Textbook: Chapter on ${formData.topic}
- Whiteboard and markers
- Digital projector and laptop
- Student worksheets (provided)
- Calculator (for each student)
- Interactive online simulation tool
- Reference materials and handouts

---

## Lesson Introduction (5 minutes)
**Hook Activity:**
Begin with a real-world scenario that relates to ${formData.topic}. Ask students to share their prior knowledge and experiences. This activates their existing knowledge and creates curiosity about the topic.

**Today's Goals:**
Clearly state the learning objectives and what students will achieve by the end of the lesson.

---

## Main Instruction (25 minutes)

### Part 1: Conceptual Understanding (10 minutes)
- Introduce key terminology and definitions
- Use visual aids and diagrams to illustrate concepts
- Provide examples that connect to students' daily lives
- Check for understanding with quick formative questions

### Part 2: Guided Practice (15 minutes)
- Walk through 2-3 example problems step-by-step
- Think aloud to model problem-solving strategies
- Encourage students to ask questions
- Use the gradual release model (I do, We do, You do)

---

## Student Activities (15 minutes)

### Activity 1: Partner Work
Students work in pairs to solve practice problems. This encourages peer learning and discussion.

**Instructions:**
1. Pair students strategically (mix ability levels)
2. Distribute worksheet with 4-5 problems
3. Circulate to provide support and monitor progress
4. Select pairs to share their solutions

### Activity 2: Application Challenge
Present a real-world problem that requires application of today's concepts. Students must work together to devise a solution.

---

## Assessment (8 minutes)

### Formative Assessment:
- Exit ticket: 2-3 quick questions to gauge understanding
- Observation notes from student activities
- Question and answer session

### Assessment Criteria:
- Can students explain key concepts in their own words?
- Are they able to apply the method correctly?
- Do they recognize when to use this approach?

---

## Homework Assignment
**Practice Problems:** Complete exercises 1-10 from textbook page __
**Extension Task:** Research a real-world application of ${formData.topic} and write a one-page reflection
**Due Date:** Next class session

---

## Differentiation Strategies

### For Advanced Learners:
- Provide challenge problems with higher complexity
- Assign leadership roles during group activities
- Encourage exploration of extensions and connections

### For Struggling Students:
- Offer additional scaffolding and support materials
- Provide step-by-step guides with worked examples
- Allow extra time for practice
- Consider one-on-one or small group instruction

### For English Language Learners:
- Use visual supports and graphic organizers
- Provide vocabulary lists with definitions
- Allow use of translation tools when appropriate
- Pair with supportive peers

---

## Reflection and Closure (2 minutes)
- Review key takeaways from the lesson
- Preview what's coming in the next class
- Answer any remaining questions
- Collect exit tickets

---

## Teacher Notes
- Ensure all technology is tested before class begins
- Have backup activities ready in case of time constraints
- Monitor student engagement throughout
- Adjust pacing based on student needs
- Follow up with students who struggled during activities

---

**Generated with AI Smart Planner**`;
  };

  const totalSteps = formData.mode === 'quick' ? 2 : 4;

  // Loading Modal
  if (isGenerating) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 3rem',
          maxWidth: '550px',
          textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.5s ease-out'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            border: '8px solid #f0f4ff',
            borderTopColor: '#094d88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '-80px auto 2rem',
            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-magic" style={{ color: 'white', fontSize: '1.5rem' }}></i>
          </div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
            Generating Your Lesson Plan
          </h2>
          <p style={{ margin: '0 0 2.5rem 0', color: '#094d88', fontSize: '1.2rem', fontWeight: 600 }}>
            {generationStatus}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#094d88',
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                }}
              ></div>
            ))}
          </div>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>
            This may take 30-60 seconds...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Results Page - Will be redesigned shortly
  if (generatedPlan) {
    return (
      <div>
        <button
          onClick={() => {
            setGeneratedPlan(null);
            setChatMessages([]);
            setChatInput('');
          }}
          className="sign-in-btn"
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88'
          }}
        >
          <i className="fas fa-arrow-left"></i> Generate Another Plan
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '3rem', overflow: 'hidden' }}>
            {/* Plan Header */}
            <div style={{
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              margin: '-3rem -3rem 2.5rem',
              padding: '2.5rem 3rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="fas fa-clipboard" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>{formData.topic}</h1>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', opacity: 0.95 }}>
                    <span><i className="fas fa-book"></i> {formData.subject}</span>
                    <span><i className="fas fa-school"></i> {formData.grade}</span>
                    <span><i className="fas fa-clock"></i> {formData.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              {[
                { icon: 'save', label: 'Save', color: '#094d88' },
                { icon: 'edit', label: 'Edit', color: '#10ac8b' },
                { icon: 'download', label: 'Download', color: '#094d88' },
                { icon: 'share', label: 'Share', color: '#094d88' },
                { icon: 'sync', label: 'Regenerate', color: '#10ac8b' }
              ].map((btn, i) => (
                <button
                  key={i}
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.9rem',
                    padding: '0.75rem 1.5rem',
                    background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}dd 100%)`,
                    boxShadow: `0 4px 12px ${btn.color}40`
                  }}
                >
                  <i className={`fas fa-${btn.icon}`}></i> {btn.label}
                </button>
              ))}
            </div>

            {/* Plan Content */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#2d3748', fontSize: '1rem' }}>
              {generatedPlan}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '650px'
            }}>
              {/* Chat Header */}
              <div style={{
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                padding: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <i className="fas fa-magic" style={{ fontSize: '1.25rem' }}></i>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                      Refine with AI
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                      Customize your plan
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                minHeight: '320px',
                maxHeight: '380px',
                background: '#f7fafc'
              }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 1.5rem',
                      borderRadius: '50%',
                      background: '#094d8820',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-comments" style={{ fontSize: '2rem', color: '#094d88' }}></i>
                    </div>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>
                      Start a conversation with AI!
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                      }}
                    >
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '16px',
                        background: msg.isUser ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)' : 'white',
                        color: msg.isUser ? 'white' : '#2d3748',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        boxShadow: msg.isUser ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#718096',
                        marginTop: '0.5rem',
                        paddingLeft: msg.isUser ? 0 : '1.25rem',
                        paddingRight: msg.isUser ? '1.25rem' : 0,
                        textAlign: msg.isUser ? 'right' : 'left',
                        fontWeight: 600
                      }}>
                        {msg.isUser ? 'You' : 'AI Assistant'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Example Prompts */}
              {chatMessages.length === 0 && (
                <div style={{ padding: '0 2rem 2rem', background: '#f7fafc' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#094d88', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Try These:
                  </div>
                  {[
                    { icon: 'users', text: 'Make it more interactive' },
                    { icon: 'lightbulb', text: 'Add more examples' },
                    { icon: 'laptop-code', text: 'Include technology' },
                    { icon: 'clock', text: 'Reduce homework load' }
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExamplePrompt(prompt.text)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        marginBottom: '0.5rem',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        color: '#4a5568',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s',
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#094d88';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#094d88';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#4a5568';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className={`fas fa-${prompt.icon}`}></i>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div style={{ padding: '2rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Type your request..."
                    style={{
                      flex: 1,
                      padding: '1rem 1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    style={{
                      padding: '1rem 1.5rem',
                      background: chatInput.trim() ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)' : '#e2e8f0',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      boxShadow: chatInput.trim() ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form Pages with Beautiful UI
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header with Back Button */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Smart Planner
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fas fa-clipboard" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Lesson Plan Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create comprehensive lesson plans with AI assistance
            </p>
          </div>
        </div>
      </div>

      {/* Modern Progress Indicator */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2.5rem 3rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'relative' }}>
          {/* Background progress line */}
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '15%',
            right: '15%',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            zIndex: 0
          }}></div>
          {/* Active progress line */}
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '15%',
            width: `${((currentStep - 1) / (totalSteps - 1)) * 70}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
            borderRadius: '2px',
            zIndex: 0,
            transition: 'width 0.4s ease'
          }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {[1, 2, 3, 4].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const isSkipped = formData.mode === 'quick' && (step === 2 || step === 3);

              if (isSkipped) return null;

              return (
                <div key={step} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: isActive ? '70px' : '60px',
                      height: isActive ? '70px' : '60px',
                      borderRadius: '50%',
                      background: isActive || isCompleted
                        ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                        : 'white',
                      color: isActive || isCompleted ? 'white' : '#cbd5e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: isActive ? '1.5rem' : '1.25rem',
                      marginBottom: '1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive
                        ? '0 8px 25px rgba(9, 77, 136, 0.4)'
                        : isCompleted
                        ? '0 6px 20px rgba(16, 172, 139, 0.3)'
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      border: isActive || isCompleted ? 'none' : '3px solid #e2e8f0'
                    }}>
                      {isCompleted ? <i className="fas fa-check"></i> : step}
                    </div>
                    <div style={{
                      fontSize: isActive ? '0.95rem' : '0.85rem',
                      color: isActive ? '#094d88' : isCompleted ? '#10ac8b' : '#718096',
                      fontWeight: isActive ? 700 : 600,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap'
                    }}>
                      {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : step === 3 ? 'Customize' : 'Review'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          background: '#f7fafc',
          borderRadius: '12px',
          display: 'inline-block',
          margin: '1.5rem auto 0',
          width: '100%'
        }}>
          <span style={{ color: '#094d88', fontSize: '0.95rem', fontWeight: 700 }}>
            Step {formData.mode === 'quick' && currentStep === 4 ? 2 : currentStep} of {totalSteps}
          </span>
          <span style={{ color: '#cbd5e0', margin: '0 0.75rem' }}>•</span>
          <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: 500 }}>
            {formData.mode === 'quick' ? 'Quick Mode' : 'Advanced Mode'}
          </span>
        </div>
      </div>

      {/* Form Content Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}>
                <i className="fas fa-info-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Basic Information
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Let's start with the essentials for your lesson plan
              </p>
            </div>

            {/* Mode Toggle */}
            <div style={{ marginBottom: '3rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <i className="fas fa-bolt"></i> Generation Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'quick' })}
                  style={{
                    padding: '2rem',
                    background: formData.mode === 'quick'
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    border: `3px solid ${formData.mode === 'quick' ? '#10ac8b' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    color: formData.mode === 'quick' ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    boxShadow: formData.mode === 'quick' ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                    transform: formData.mode === 'quick' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <i className="fas fa-bolt" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quick Mode</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Minimal inputs, fast generation
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'advanced' })}
                  style={{
                    padding: '2rem',
                    background: formData.mode === 'advanced'
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    border: `3px solid ${formData.mode === 'advanced' ? '#094d88' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    color: formData.mode === 'advanced' ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    boxShadow: formData.mode === 'advanced' ? '0 8px 25px rgba(102, 126, 234, 0.3)' : 'none',
                    transform: formData.mode === 'advanced' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <i className="fas fa-bullseye" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Advanced Mode</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Detailed inputs, comprehensive output
                  </div>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Subject <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-book" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Grade Level <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-school" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Topic/Chapter <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-lightbulb" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Introduction to Quadratic Equations"
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Lesson Duration <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-clock" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select duration</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Advanced Details */}
        {currentStep === 2 && formData.mode === 'advanced' && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}>
                <i className="fas fa-sliders-h" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Advanced Details
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Provide additional context to make your lesson plan more effective
              </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-bullseye"></i> Learning Objectives
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-list-ul" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.25rem',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="What should students be able to do by the end of this lesson? (e.g., Solve quadratic equations using factorization)"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-puzzle-piece"></i> Prerequisites
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-check-circle" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.25rem',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    placeholder="What prior knowledge should students have? (e.g., Understanding of linear equations, basic algebraic operations)"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    <i className="fas fa-chalkboard-teacher"></i> Teaching Style
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-user-graduate" style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#094d88',
                      fontSize: '1.1rem'
                    }}></i>
                    <select
                      value={formData.teachingStyle}
                      onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        color: '#2d3748',
                        background: 'white',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontWeight: 500
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#094d88';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select teaching style</option>
                      {teachingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    <i className="fas fa-graduation-cap"></i> Curriculum
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-bookmark" style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#094d88',
                      fontSize: '1.1rem'
                    }}></i>
                    <select
                      value={formData.curriculum}
                      onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        color: '#2d3748',
                        background: 'white',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontWeight: 500
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#094d88';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select curriculum</option>
                      {curriculums.map(curriculum => (
                        <option key={curriculum} value={curriculum}>{curriculum}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customization */}
        {currentStep === 3 && formData.mode === 'advanced' && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}>
                <i className="fas fa-magic" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Customize Your Plan
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Select which sections to include in your lesson plan
              </p>
            </div>

            <div style={{ display: 'grid', gap: '2.5rem' }}>
              {/* Sections to Include */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '1.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-th-list"></i> Sections to Include
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.25rem'
                }}>
                  {[
                    { key: 'objectives', label: 'Learning Objectives', icon: 'bullseye', color: '#094d88' },
                    { key: 'materials', label: 'Materials Needed', icon: 'tools', color: '#094d88' },
                    { key: 'activities', label: 'Student Activities', icon: 'users', color: '#10ac8b' },
                    { key: 'assessment', label: 'Assessment', icon: 'clipboard-check', color: '#10ac8b' },
                    { key: 'homework', label: 'Homework', icon: 'book-open', color: '#094d88' },
                    { key: 'differentiation', label: 'Differentiation', icon: 'layer-group', color: '#dc3545' }
                  ].map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setFormData({
                        ...formData,
                        sectionsToInclude: {
                          ...formData.sectionsToInclude,
                          [section.key]: !formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                        }
                      })}
                      style={{
                        padding: '1.5rem',
                        background: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                          ? `linear-gradient(135deg, ${section.color} 0%, ${section.color}dd 100%)`
                          : 'white',
                        border: `3px solid ${formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? section.color : '#e2e8f0'}`,
                        borderRadius: '16px',
                        color: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 'white' : '#2d3748',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textAlign: 'center',
                        boxShadow: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                          ? `0 6px 20px ${section.color}40`
                          : 'none',
                        transform: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]) {
                          e.currentTarget.style.borderColor = section.color;
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        margin: '0 auto 1rem',
                        borderRadius: '12px',
                        background: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                          ? 'rgba(255,255,255,0.2)'
                          : `${section.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 'blur(10px)' : 'none'
                      }}>
                        <i className={`fas fa-${section.icon}`} style={{
                          fontSize: '1.5rem',
                          color: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 'white' : section.color
                        }}></i>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                        {section.label}
                      </div>
                      {formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] && (
                        <div style={{ marginTop: '0.5rem', fontSize: '1.25rem' }}>
                          <i className="fas fa-check-circle"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-star"></i> Special Requirements or Notes (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-comment-dots" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.25rem',
                    color: '#094d88',
                    fontSize: '1.1rem'
                  }}></i>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Any special considerations? (e.g., Students with learning disabilities, limited technology access, time constraints)"
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Generate */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-check-double" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Review Your Inputs
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Everything looks good? Click generate to create your lesson plan
              </p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Basic Information Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}>
                    <i className="fas fa-info-circle" style={{ fontSize: '1.25rem', color: 'white' }}></i>
                  </div>
                  <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.3rem', fontWeight: 700 }}>
                    Basic Information
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                  {[
                    { label: 'Subject', value: formData.subject, icon: 'book' },
                    { label: 'Grade', value: formData.grade, icon: 'school' },
                    { label: 'Topic', value: formData.topic, icon: 'lightbulb' },
                    { label: 'Duration', value: formData.duration, icon: 'clock' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <i className={`fas fa-${item.icon}`} style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600 }}>
                        {item.value || <span style={{ color: '#cbd5e0' }}>Not specified</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Details Card - Only for Advanced Mode */}
              {formData.mode === 'advanced' && (
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                      <i className="fas fa-sliders-h" style={{ fontSize: '1.25rem', color: 'white' }}></i>
                    </div>
                    <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.3rem', fontWeight: 700 }}>
                      Advanced Details
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {[
                      { label: 'Teaching Style', value: formData.teachingStyle, icon: 'chalkboard-teacher' },
                      { label: 'Curriculum', value: formData.curriculum, icon: 'graduation-cap' },
                      { label: 'Learning Objectives', value: formData.objectives, icon: 'bullseye', multiline: true },
                      { label: 'Prerequisites', value: formData.prerequisites, icon: 'puzzle-piece', multiline: true }
                    ].map((item, index) => (
                      <div key={index} style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                          <i className={`fas fa-${item.icon}`} style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                          {item.label}
                        </div>
                        <div style={{
                          fontSize: '0.95rem',
                          color: '#2d3748',
                          fontWeight: 500,
                          lineHeight: item.multiline ? '1.6' : 'normal',
                          whiteSpace: item.multiline ? 'pre-wrap' : 'normal'
                        }}>
                          {item.value || <span style={{ color: '#cbd5e0' }}>Not specified</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections & Customization Card - Only for Advanced Mode */}
              {formData.mode === 'advanced' && (
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}>
                      <i className="fas fa-th-list" style={{ fontSize: '1.25rem', color: 'white' }}></i>
                    </div>
                    <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.3rem', fontWeight: 700 }}>
                      Included Sections
                    </h3>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {Object.entries(formData.sectionsToInclude).map(([key, value]) => (
                        value && (
                          <div key={key} style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          }}>
                            <i className="fas fa-check-circle"></i>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  {formData.specialRequirements && (
                    <div style={{
                      background: 'white',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      marginTop: '1rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                        Special Requirements
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#2d3748', fontWeight: 500, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {formData.specialRequirements}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ready to Generate Banner */}
            <div style={{
              marginTop: '2.5rem',
              padding: '2rem',
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}>
              <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
                Ready to Generate!
              </h3>
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
                Your lesson plan will be created using advanced AI in 30-60 seconds
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '2px solid #f7fafc',
          gap: '1rem'
        }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: '1rem 2.5rem',
              background: currentStep === 1 ? '#f7fafc' : 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              color: currentStep === 1 ? '#cbd5e0' : '#2d3748',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '140px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 1) {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.borderColor = '#094d88';
                e.currentTarget.style.color = '#094d88';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              if (currentStep !== 1) e.currentTarget.style.color = '#2d3748';
            }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.grade || !formData.topic || !formData.duration}
              className="sign-in-btn"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.subject || !formData.grade || !formData.topic || !formData.duration)
                  ? 'none'
                  : '0 8px 25px rgba(9, 77, 136, 0.4)',
                opacity: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.topic || !formData.duration)
                  ? 'not-allowed'
                  : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '220px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.grade && formData.topic && formData.duration) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
              }}
            >
              <i className="fas fa-magic"></i>
              <span>Generate with AI</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!formData.subject || !formData.grade || !formData.topic || !formData.duration}
              className="sign-in-btn"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: (!formData.subject || !formData.grade || !formData.topic || !formData.duration)
                  ? '#e2e8f0'
                  : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.subject || !formData.grade || !formData.topic || !formData.duration)
                  ? 'none'
                  : '0 8px 25px rgba(9, 77, 136, 0.4)',
                opacity: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.topic || !formData.duration)
                  ? 'not-allowed'
                  : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.grade && formData.topic && formData.duration) {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
              }}
            >
              <span>Next</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanGeneratorNew;
