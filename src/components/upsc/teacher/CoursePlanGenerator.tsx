import { useState } from 'react';
import { callOpenAI, callOpenAIWithHistory } from '../../../services/openai';
import type { OpenAIMessage } from '../../../services/openai';

interface FormData {
  mode: 'quick' | 'advanced';
  subject: string;
  grade: string;
  courseName: string;
  duration: string;
  weeklyHours: string;
  courseGoals: string;
  prerequisites: string;
  teachingApproach: string;
  curriculum: string;
  sectionsToInclude: {
    syllabus: boolean;
    weeklyBreakdown: boolean;
    assessments: boolean;
    resources: boolean;
    grading: boolean;
    policies: boolean;
  };
  specialRequirements: string;
}

interface CoursePlanGeneratorProps {
  onBack: () => void;
}

const CoursePlanGenerator = ({ onBack }: CoursePlanGeneratorProps) => {
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
    courseName: '',
    duration: '',
    weeklyHours: '',
    courseGoals: '',
    prerequisites: '',
    teachingApproach: '',
    curriculum: '',
    sectionsToInclude: {
      syllabus: true,
      weeklyBreakdown: true,
      assessments: true,
      resources: true,
      grading: true,
      policies: true
    },
    specialRequirements: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const grades = ['Grade 9', 'Grade 10', 'Grade 10A', 'Grade 10B', 'Grade 11', 'Grade 12'];
  const durations = ['1 Semester', '2 Semesters', '1 Year', 'Summer Course', 'Quarter'];
  const weeklyHours = ['2 hours', '3 hours', '4 hours', '5 hours', '6 hours'];
  const teachingApproaches = ['Traditional Lecture', 'Blended Learning', 'Project-Based', 'Flipped Classroom', 'Collaborative'];
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
      '📋 Analyzing course requirements...',
      '📚 Structuring curriculum...',
      '📅 Creating weekly breakdown...',
      '✅ Finalizing your course plan...'
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
      let prompt = `Create a comprehensive course plan with the following details:

Subject: ${formData.subject}
Grade Level: ${formData.grade}
Course Name: ${formData.courseName}
Duration: ${formData.duration}
Weekly Hours: ${formData.weeklyHours}`;

      if (formData.mode === 'advanced') {
        prompt += `
${formData.courseGoals ? `\nCourse Goals: ${formData.courseGoals}` : ''}
${formData.prerequisites ? `\nPrerequisites: ${formData.prerequisites}` : ''}
${formData.teachingApproach ? `\nTeaching Approach: ${formData.teachingApproach}` : ''}
${formData.curriculum ? `\nCurriculum Standard: ${formData.curriculum}` : ''}
${formData.specialRequirements ? `\nSpecial Requirements: ${formData.specialRequirements}` : ''}

Include the following sections: ${Object.entries(formData.sectionsToInclude)
  .filter(([_, value]) => value)
  .map(([key]) => key)
  .join(', ')}`;
      }

      prompt += `

Please generate a detailed, comprehensive course plan in markdown format with:
1. Course overview and description
2. Detailed learning objectives and outcomes
3. Complete syllabus broken down by units/modules
4. Week-by-week breakdown with topics
5. Assessment strategy (formative and summative)
6. Grading policy and rubrics
7. Required resources and materials
8. Course policies (attendance, late work, academic integrity)
9. Support resources for students
10. Course schedule with timeline

Format the plan professionally with clear headings, sections, and tables where appropriate.`;

      const systemPrompt = `You are an experienced curriculum developer and instructional designer specializing in creating comprehensive course plans for academic institutions. Your course plans are:
- Aligned with educational standards and best practices
- Complete with all necessary components (syllabus, schedule, assessments, policies)
- Clear and professionally formatted
- Practical and implementable
- Student-centered with measurable outcomes
- Include diverse assessment strategies
- Consider different learning styles and needs

Generate course plans that academic departments can approve and teachers can immediately implement.`;

      const aiGeneratedPlan = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.8,
        max_tokens: 4000
      });

      clearInterval(statusInterval);
      setIsGenerating(false);
      setGeneratedPlan(aiGeneratedPlan);
    } catch (error) {
      clearInterval(statusInterval);
      setIsGenerating(false);
      console.error('Error generating course plan:', error);
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
          content: `You are an AI assistant helping a teacher refine their course plan. The teacher has generated a course plan and is now requesting modifications. Be helpful, specific, and explain what changes you would make. Keep responses concise but informative.`
        },
        {
          role: 'user',
          content: `Here is the current course plan:\n\n${generatedPlan}\n\nI would like to make a change: ${userMessage}`
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
    return `## Course Plan: ${formData.courseName}

### Subject: ${formData.subject}
### Grade: ${formData.grade}
### Duration: ${formData.duration}
### Weekly Hours: ${formData.weeklyHours}

---

## Course Overview

This comprehensive course plan provides a structured approach to teaching ${formData.subject} for ${formData.grade} students. The course is designed to be delivered over ${formData.duration} with ${formData.weeklyHours} of instruction per week.

---

## Course Goals and Objectives

By the end of this course, students will be able to:
1. Demonstrate mastery of core concepts in ${formData.subject}
2. Apply theoretical knowledge to solve real-world problems
3. Develop critical thinking and analytical skills
4. Collaborate effectively with peers on projects and assignments
5. Communicate ideas clearly through written and oral presentations

---

## Course Syllabus

### Unit 1: Foundation and Introduction (Weeks 1-3)
**Topics:**
- Introduction to fundamental concepts
- Historical context and importance
- Basic terminology and definitions
- Hands-on introductory activities

**Learning Outcomes:**
- Understand the scope and relevance of the subject
- Master foundational vocabulary
- Apply basic concepts to simple problems

---

### Unit 2: Core Concepts Part I (Weeks 4-7)
**Topics:**
- In-depth exploration of primary concepts
- Theoretical frameworks and models
- Practical applications and case studies
- Problem-solving techniques

**Learning Outcomes:**
- Analyze complex problems using learned frameworks
- Synthesize information from multiple sources
- Demonstrate proficiency in core techniques

---

### Unit 3: Core Concepts Part II (Weeks 8-11)
**Topics:**
- Advanced theoretical concepts
- Integration of multiple concepts
- Real-world applications
- Group projects and collaborative work

**Learning Outcomes:**
- Apply concepts to multifaceted scenarios
- Work collaboratively on complex problems
- Present findings and solutions effectively

---

### Unit 4: Advanced Topics and Applications (Weeks 12-15)
**Topics:**
- Specialized topics and current trends
- Research-based learning
- Student-led investigations
- Capstone projects

**Learning Outcomes:**
- Conduct independent research
- Synthesize learning across all units
- Demonstrate mastery through capstone work

---

## Weekly Breakdown

### Sample Weekly Structure:

**Monday (${formData.weeklyHours.split(' ')[0] === '2' ? '1 hour' : '1-2 hours'}):**
- Introduction to weekly topic
- Interactive lecture with multimedia
- Q&A and discussion

**Wednesday (${formData.weeklyHours.split(' ')[0] === '2' ? '1 hour' : '1-2 hours'}):**
- Practical application and activities
- Group work or lab sessions
- Practice problems

**Friday (Optional ${formData.weeklyHours.split(' ')[0] > '3' ? '1-2 hours' : 'review'}):**
- Review and consolidation
- Quizzes or formative assessments
- Preview of next week's content

---

## Assessment Strategy

### Formative Assessments (40%)
- Weekly quizzes (10%)
- Class participation (10%)
- Homework assignments (10%)
- Lab reports/activities (10%)

### Summative Assessments (60%)
- Unit tests (20%)
- Midterm examination (15%)
- Final examination (20%)
- Capstone project (5%)

---

## Grading Policy

**Grade Distribution:**
- A: 90-100%
- B: 80-89%
- C: 70-79%
- D: 60-69%
- F: Below 60%

**Late Work Policy:**
- Assignments submitted within 24 hours: 10% deduction
- Assignments submitted within 48 hours: 25% deduction
- After 48 hours: 50% deduction

**Attendance:**
- Students are expected to attend all sessions
- More than 3 unexcused absences may affect final grade

---

## Required Resources and Materials

### Textbooks:
- Primary textbook: [Course-specific textbook for ${formData.subject}]
- Reference materials as assigned

### Digital Resources:
- Online learning platform access
- Educational videos and simulations
- Interactive tools and software

### Supplies:
- Notebook/binder for notes
- Calculator (if applicable)
- Lab materials (will be provided)

---

## Course Policies

### Academic Integrity:
All work must be original. Plagiarism and cheating will result in serious consequences including failing grades and disciplinary action.

### Classroom Expectations:
- Arrive on time and prepared
- Participate actively in discussions
- Respect all classmates and the instructor
- Electronic devices only for educational purposes

### Communication:
- Office hours: [To be announced]
- Email response time: Within 24-48 hours
- Class announcements via learning platform

---

## Support Resources

**For Struggling Students:**
- Weekly tutoring sessions
- Peer study groups
- One-on-one office hours
- Additional practice materials

**For Advanced Learners:**
- Enrichment activities and challenges
- Independent research opportunities
- Leadership roles in group work

---

## Course Schedule Overview

| Week | Topic | Assessment |
|------|-------|------------|
| 1-3  | Unit 1: Foundations | Quiz 1 |
| 4-7  | Unit 2: Core Concepts I | Test 1, Quiz 2-3 |
| 8    | Midterm Review | Midterm Exam |
| 9-11 | Unit 3: Core Concepts II | Test 2, Quiz 4-5 |
| 12-15| Unit 4: Advanced Topics | Project, Quiz 6 |
| 16   | Final Review | Final Exam |

---

## Additional Notes

- Course content may be adjusted based on student progress and needs
- Guest speakers and field trips may be incorporated when possible
- Regular feedback will be provided throughout the course
- Students are encouraged to ask questions and seek help when needed

---

**Generated with AI Smart Planner** ✨`;
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
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
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
            border: '8px solid #d1fae5',
            borderTopColor: '#10ac8b',
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
            <i className="fas fa-graduation-cap" style={{ color: 'white', fontSize: '1.5rem' }}></i>
          </div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
            Generating Your Course Plan
          </h2>
          <p style={{ margin: '0 0 2.5rem 0', color: '#10ac8b', fontSize: '1.2rem', fontWeight: 600 }}>
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
                  background: '#10ac8b',
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
            color: '#10ac8b',
            border: '2px solid #10ac8b'
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
                  <i className="fas fa-graduation-cap" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>{formData.courseName}</h1>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', opacity: 0.95 }}>
                    <span><i className="fas fa-book"></i> {formData.subject}</span>
                    <span><i className="fas fa-school"></i> {formData.grade}</span>
                    <span><i className="fas fa-calendar"></i> {formData.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              {[
                { icon: 'save', label: 'Save', color: '#10ac8b' },
                { icon: 'edit', label: 'Edit', color: '#094d88' },
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
                      Customize your course plan
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
                      background: '#10ac8b20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-comments" style={{ fontSize: '2rem', color: '#10ac8b' }}></i>
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
                        boxShadow: msg.isUser ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
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
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10ac8b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Try These:
                  </div>
                  {[
                    { icon: 'project-diagram', text: 'Add more projects' },
                    { icon: 'clipboard-check', text: 'Update assessments' },
                    { icon: 'book-reader', text: 'Include more resources' },
                    { icon: 'compress', text: 'Make it more concise' }
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
                        e.currentTarget.style.background = '#10ac8b';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#10ac8b';
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
                    onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
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
                      boxShadow: chatInput.trim() ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
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
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
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
            <i className="fas fa-graduation-cap" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Course Plan Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create comprehensive course plans with AI assistance
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {[1, 2, 3, 4].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            const isSkipped = formData.mode === 'quick' && (step === 2 || step === 3);

            if (isSkipped) return null;

            return (
              <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: isActive ? '70px' : '60px',
                    height: isActive ? '70px' : '60px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : isCompleted
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : '#f7fafc',
                    color: isActive || isCompleted ? 'white' : '#cbd5e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: isActive ? '1.5rem' : '1.25rem',
                    marginBottom: '1rem',
                    transition: 'all 0.3s',
                    boxShadow: isActive ? '0 8px 25px rgba(16, 185, 129, 0.4)' : isCompleted ? '0 6px 20px rgba(16, 185, 129, 0.3)' : 'none',
                    border: isActive || isCompleted ? 'none' : '3px solid #e2e8f0'
                  }}>
                    {isCompleted ? <i className="fas fa-check"></i> : step}
                  </div>
                  <div style={{
                    fontSize: isActive ? '0.95rem' : '0.85rem',
                    color: isActive ? '#10ac8b' : isCompleted ? '#10ac8b' : '#718096',
                    fontWeight: isActive ? 700 : 600,
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : step === 3 ? 'Customize' : 'Review'}
                  </div>
                </div>
                {step < (formData.mode === 'quick' ? 2 : 4) && !isSkipped && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    right: '-50%',
                    top: '28px',
                    height: '4px',
                    background: isCompleted ? 'linear-gradient(90deg, #10ac8b 0%, #10ac8b 100%)' : '#e2e8f0',
                    transition: 'all 0.3s',
                    zIndex: 0
                  }}></div>
                )}
              </div>
            );
          })}
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
          <span style={{ color: '#10ac8b', fontSize: '0.95rem', fontWeight: 700 }}>
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
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-info-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Basic Information
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Let's start with the essentials for your course plan
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quick Mode</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Basic inputs, fast generation
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'advanced' })}
                  style={{
                    padding: '2rem',
                    background: formData.mode === 'advanced'
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    border: `3px solid ${formData.mode === 'advanced' ? '#10ac8b' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    color: formData.mode === 'advanced' ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    boxShadow: formData.mode === 'advanced' ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                    transform: formData.mode === 'advanced' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
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
                    color: '#10ac8b',
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                    color: '#10ac8b',
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                  Course Name <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-graduation-cap" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g., Advanced Mathematics - Full Year"
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                  Course Duration <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-calendar" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Weekly Hours <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-clock" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select weekly hours</option>
                    {weeklyHours.map(hours => (
                      <option key={hours} value={hours}>{hours}</option>
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
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-bullseye" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Advanced Details
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Provide detailed information to enhance your course plan
              </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Course Goals */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-bullseye" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                  Course Goals & Learning Outcomes
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-align-left" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.25rem',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <textarea
                    value={formData.courseGoals}
                    onChange={(e) => setFormData({ ...formData, courseGoals: e.target.value })}
                    placeholder="What should students be able to do by the end of this course? List key learning objectives and outcomes..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.6',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-list-check" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                  Prerequisites & Prior Knowledge
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-check-circle" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.25rem',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    placeholder="What prior knowledge or completed courses do students need? List any prerequisites..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.6',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Teaching Approach */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  <i className="fas fa-chalkboard-teacher" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                  Teaching Approach
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user-tie" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.teachingApproach}
                    onChange={(e) => setFormData({ ...formData, teachingApproach: e.target.value })}
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select teaching approach</option>
                    {teachingApproaches.map(approach => (
                      <option key={approach} value={approach}>{approach}</option>
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
                  <i className="fas fa-book-open" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                  Curriculum Standard
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-graduation-cap" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-sliders-h" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Customize Sections
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Select which sections to include in your course plan
              </p>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#10ac8b', fontSize: '1.25rem' }}></i>
                  <span style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.95rem' }}>Customize Your Plan</span>
                </div>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Toggle the sections you want to include. All sections are enabled by default for a comprehensive course plan.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                {[
                  { key: 'syllabus', label: 'Course Syllabus', icon: 'list-alt', color: '#094d88', desc: 'Detailed breakdown of topics' },
                  { key: 'weeklyBreakdown', label: 'Weekly Breakdown', icon: 'calendar-week', color: '#094d88', desc: 'Week-by-week schedule' },
                  { key: 'assessments', label: 'Assessments', icon: 'clipboard-check', color: '#10ac8b', desc: 'Tests, quizzes, projects' },
                  { key: 'resources', label: 'Resources', icon: 'books', color: '#10ac8b', desc: 'Textbooks and materials' },
                  { key: 'grading', label: 'Grading Policy', icon: 'percentage', color: '#094d88', desc: 'Grade distribution' },
                  { key: 'policies', label: 'Course Policies', icon: 'gavel', color: '#dc3545', desc: 'Rules and expectations' }
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
                      padding: '2rem 1.5rem',
                      background: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                        ? `linear-gradient(135deg, ${section.color} 0%, ${section.color}dd 100%)`
                        : 'white',
                      border: `3px solid ${formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? section.color : '#e2e8f0'}`,
                      borderRadius: '16px',
                      color: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 'white' : '#2d3748',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                        ? `0 8px 25px ${section.color}40`
                        : 'none',
                      transform: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                        ? 'scale(1.02)'
                        : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude]
                        ? 'scale(1.02)'
                        : 'scale(1)';
                    }}
                  >
                    {formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <i className="fas fa-check" style={{ fontSize: '0.9rem' }}></i>
                      </div>
                    )}
                    <div style={{
                      fontSize: '2.5rem',
                      marginBottom: '1rem',
                      opacity: formData.sectionsToInclude[section.key as keyof typeof formData.sectionsToInclude] ? 1 : 0.6
                    }}>
                      <i className={`fas fa-${section.icon}`}></i>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem'
                    }}>
                      {section.label}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      opacity: 0.9
                    }}>
                      {section.desc}
                    </div>
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
                <i className="fas fa-star" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Special Requirements or Notes (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-pen" style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '1.25rem',
                  color: '#10ac8b',
                  fontSize: '1.1rem'
                }}></i>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  placeholder="Any special considerations, lab requirements, field trips, or other notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    color: '#2d3748',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#10ac8b';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
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
                <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Review Your Input
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Verify all details before generating your course plan
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Basic Information Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  margin: '0 0 1.5rem 0',
                  color: '#2d3748',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-info-circle" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                  </div>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Subject
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.subject || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Grade Level
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.grade || 'Not specified'}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Course Name
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.courseName || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Duration
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.duration || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Weekly Hours
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.weeklyHours || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Details Card - Only show in advanced mode */}
              {formData.mode === 'advanced' && (
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h3 style={{
                    margin: '0 0 1.5rem 0',
                    color: '#2d3748',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-bullseye" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                    </div>
                    Advanced Details
                  </h3>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {formData.courseGoals && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Course Goals
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#2d3748', lineHeight: '1.6' }}>
                          {formData.courseGoals}
                        </div>
                      </div>
                    )}
                    {formData.prerequisites && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Prerequisites
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#2d3748', lineHeight: '1.6' }}>
                          {formData.prerequisites}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                      {formData.teachingApproach && (
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Teaching Approach
                          </div>
                          <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                            {formData.teachingApproach}
                          </div>
                        </div>
                      )}
                      {formData.curriculum && (
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Curriculum
                          </div>
                          <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                            {formData.curriculum}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sections Card */}
              {formData.mode === 'advanced' && (
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h3 style={{
                    margin: '0 0 1.5rem 0',
                    color: '#2d3748',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-sliders-h" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                    </div>
                    Included Sections
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {Object.entries(formData.sectionsToInclude).map(([key, value]) => {
                      const sectionLabels: {[key: string]: string} = {
                        syllabus: 'Course Syllabus',
                        weeklyBreakdown: 'Weekly Breakdown',
                        assessments: 'Assessments',
                        resources: 'Resources',
                        grading: 'Grading Policy',
                        policies: 'Course Policies'
                      };
                      return value ? (
                        <span
                          key={key}
                          style={{
                            padding: '0.75rem 1.25rem',
                            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <i className="fas fa-check-circle"></i>
                          {sectionLabels[key]}
                        </span>
                      ) : null;
                    })}
                  </div>
                  {formData.specialRequirements && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Special Requirements
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#2d3748', lineHeight: '1.6' }}>
                        {formData.specialRequirements}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Generation Mode Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  <i className={`fas fa-${formData.mode === 'quick' ? 'bolt' : 'bullseye'}`}></i>
                  {formData.mode === 'quick' ? 'Quick Mode' : 'Advanced Mode'} Generation
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '2px solid #f7fafc'
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
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 1) {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.borderColor = '#10ac8b';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours}
              className="sign-in-btn"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours)
                  ? 'none'
                  : '0 8px 25px rgba(16, 185, 129, 0.4)',
                opacity: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours)
                  ? 'not-allowed'
                  : 'pointer',
                transform: 'scale(1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.grade && formData.courseName && formData.duration && formData.weeklyHours) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <i className="fas fa-magic"></i> Generate with AI ✨
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours}
              className="sign-in-btn"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours)
                  ? 'none'
                  : '0 8px 25px rgba(16, 185, 129, 0.4)',
                opacity: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.courseName || !formData.duration || !formData.weeklyHours)
                  ? 'not-allowed'
                  : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.grade && formData.courseName && formData.duration && formData.weeklyHours) {
                  e.currentTarget.style.transform = 'translateX(5px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlanGenerator;
