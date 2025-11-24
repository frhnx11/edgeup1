import { useState } from 'react';
import { callOpenAI, callOpenAIWithHistory } from '../../services/openai';
import type { OpenAIMessage } from '../../services/openai';
import { generatePlanPDF } from '../../services/planPdfGenerator';

interface FormData {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  curriculum: string;
}

interface LessonPlanGeneratorProps {
  onBack: () => void;
}

const LessonPlanGeneratorNew = ({ onBack }: LessonPlanGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    subject: '',
    grade: '',
    topic: '',
    duration: '',
    curriculum: ''
  });

  // TN Board 10th Standard subjects matching student and teacher module
  const subjects = ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'];
  const grades = ['10th Standard'];
  const durations = ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];
  const curriculums = ['TN Board (Tamil Nadu State Board)'];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Lesson plan specific AI prompt
      const prompt = `Create a detailed, single-session lesson plan for:

Subject: ${formData.subject}
Grade Level: ${formData.grade}
Topic: ${formData.topic}
Duration: ${formData.duration}
Curriculum: ${formData.curriculum}

Please structure the lesson plan with these specific sections:

## Learning Objectives
- List 3-5 clear, measurable learning objectives using action verbs
- Align with curriculum standards for ${formData.curriculum}

## Materials Needed
- Complete list of all required materials, resources, and equipment
- Include both physical materials and digital resources

## Lesson Introduction (Approximate timing)
- Hook/engagement activity to capture student interest
- Connection to prior knowledge
- Overview of lesson objectives

## Main Instruction (Approximate timing)
- Step-by-step teaching sequence
- Key concepts and explanations
- Examples and demonstrations
- Checks for understanding

## Student Activities (Approximate timing)
- Hands-on activities or practice exercises
- Individual, pair, or group work instructions
- Clear step-by-step instructions for students

## Assessment
- Formative assessment strategies during the lesson
- Methods to check student understanding
- Exit ticket or closure activity
- Assessment criteria

## Homework Assignment
- Clear homework instructions
- Purpose of the assignment
- Expected completion time

## Differentiation Strategies
- Modifications for advanced learners
- Support for struggling students
- Accommodations for diverse learning needs

## Teacher Notes
- Important reminders and tips
- Common misconceptions to address
- Troubleshooting advice

Format with clear headings (##) and bullet points. Make it practical and ready to use immediately in the classroom.`;

      const systemPrompt = `You are an expert lesson planning specialist with 15+ years of classroom experience. Create comprehensive, pedagogically sound lesson plans that are:
- Aligned with educational standards and best practices
- Structured for optimal student engagement and learning
- Practical and immediately implementable
- Include timing for each section
- Student-centered with clear learning outcomes
- Based on proven teaching methodologies

Your lesson plans help teachers deliver effective, engaging single-session lessons.`;

      const aiGeneratedPlan = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      setIsGenerating(false);
      setGeneratedPlan(aiGeneratedPlan);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating lesson plan:', error);
      setGeneratedPlan('Error generating lesson plan. Please try again.');
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedPlan) return;

    generatePlanPDF({
      type: 'lesson',
      subject: formData.subject,
      grade: formData.grade,
      title: formData.topic,
      duration: formData.duration,
      curriculum: formData.curriculum,
      content: generatedPlan
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !generatedPlan) return;

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { text: userMessage, isUser: true }]);
    setChatInput('');

    // Show a temporary loading message
    setChatMessages(prev => [...prev, { text: 'Updating your lesson plan...', isUser: false }]);

    try {
      const prompt = `You are an AI assistant helping a teacher refine their lesson plan.

Here is the current lesson plan:
${generatedPlan}

The teacher wants to make this change: ${userMessage}

Please provide the COMPLETE updated lesson plan with the requested changes incorporated. Maintain the same format and structure, but apply the modifications requested. Return ONLY the updated lesson plan, do not add any explanations or comments.`;

      const systemPrompt = `You are an expert educational content editor. When a teacher requests changes to their lesson plan, you modify the plan directly and return the complete updated version. Always maintain professional formatting with clear headings (##) and bullet points.`;

      const updatedPlan = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      // Update the actual plan content
      setGeneratedPlan(updatedPlan);

      // Update the last message to show what changed
      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: `✅ Updated! I've modified your lesson plan based on: "${userMessage}"`,
          isUser: false
        };
        return newMessages;
      });
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: "I'm having trouble processing that request. Please try again.",
          isUser: false
        };
        return newMessages;
      });
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  // Results Page
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

            {/* Action Buttons - Card Style */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              {[
                { icon: 'save', label: 'Save', color: '#094d88', onClick: () => {} },
                { icon: 'edit', label: 'Edit', color: '#10ac8b', onClick: () => {} },
                { icon: 'download', label: 'Download PDF', color: '#094d88', onClick: handleDownloadPDF },
                { icon: 'share-alt', label: 'Share', color: '#6366f1', onClick: () => {} },
                { icon: 'sync-alt', label: 'Regenerate', color: '#10ac8b', onClick: handleGenerate }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}30`;
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${action.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`fas fa-${action.icon}`} style={{
                      fontSize: '1.5rem',
                      color: action.color
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    textAlign: 'center'
                  }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Plan Content */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#2d3748', fontSize: '1rem' }}>
              {generatedPlan}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content', maxHeight: 'calc(100vh - 4rem)' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              maxHeight: '750px'
            }}>
              {/* Chat Header */}
              <div style={{
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                padding: '1.5rem',
                color: 'white',
                flexShrink: 0
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
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '250px',
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
                <div style={{ padding: '0 1.5rem 1.5rem', background: '#f7fafc', flexShrink: 0 }}>
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
              <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: 'white', flexShrink: 0 }}>
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

  // Simple Unified Form
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
              Create comprehensive lesson plans with AI in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Unified Form Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Form Header */}
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
            Lesson Plan Details
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
            Fill in the details below to generate your customized lesson plan
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {/* Subject */}
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

          {/* Grade */}
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

          {/* Topic */}
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

          {/* Duration */}
          <div>
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

          {/* Curriculum */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: '0.75rem'
            }}>
              Curriculum <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-graduation-cap" style={{
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

        {/* Generate Button / Loading State */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          {isGenerating ? (
            <div style={{
              padding: '2rem',
              background: '#f7fafc',
              borderRadius: '12px',
              border: '2px dashed #094d88',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              minWidth: '400px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f0f4ff',
                borderTopColor: '#094d88',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#094d88', marginBottom: '0.5rem' }}>
                  Generating Your Lesson Plan
                </div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  This may take 30-60 seconds...
                </div>
              </div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.grade || !formData.topic || !formData.duration || !formData.curriculum}
              className="sign-in-btn"
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: (!formData.subject || !formData.grade || !formData.topic || !formData.duration || !formData.curriculum)
                  ? '#e2e8f0'
                  : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.subject || !formData.grade || !formData.topic || !formData.duration || !formData.curriculum)
                  ? 'none'
                  : '0 8px 25px rgba(9, 77, 136, 0.4)',
                opacity: (!formData.subject || !formData.grade || !formData.topic || !formData.duration || !formData.curriculum) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.topic || !formData.duration || !formData.curriculum)
                  ? 'not-allowed'
                  : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.grade && formData.topic && formData.duration && formData.curriculum) {
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
              <span>Generate Lesson Plan with AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanGeneratorNew;
