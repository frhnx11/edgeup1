import { useState } from 'react';

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

const LessonPlanGenerator = ({ onBack }: LessonPlanGeneratorProps) => {
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
      setCurrentStep(4); // Skip to review for quick mode
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (formData.mode === 'quick' && currentStep === 4) {
      setCurrentStep(1); // Go back to step 1 for quick mode
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI generation with status updates
    const statuses = [
      '🔍 Analyzing curriculum standards...',
      '📚 Structuring content...',
      '🎯 Adding teaching strategies...',
      '✅ Finalizing your plan...'
    ];

    let statusIndex = 0;
    setGenerationStatus(statuses[0]);

    const statusInterval = setInterval(() => {
      statusIndex++;
      if (statusIndex < statuses.length) {
        setGenerationStatus(statuses[statusIndex]);
      }
    }, 3000);

    // Simulate generation completion after 12 seconds
    setTimeout(() => {
      clearInterval(statusInterval);
      setIsGenerating(false);

      // Mock generated content
      const mockPlan = generateMockPlan();
      setGeneratedPlan(mockPlan);
    }, 12000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { text: chatInput, isUser: true }]);
    const userRequest = chatInput;
    setChatInput('');

    // Simulate AI response after 2 seconds
    setTimeout(() => {
      let aiResponse = '';
      const lowerRequest = userRequest.toLowerCase();

      if (lowerRequest.includes('interactive') || lowerRequest.includes('engaging')) {
        aiResponse = "I've added more interactive elements to your lesson plan, including partner activities, think-pair-share exercises, and hands-on demonstrations. The activities section now emphasizes student participation and collaboration.";
      } else if (lowerRequest.includes('shorter') || lowerRequest.includes('reduce') || lowerRequest.includes('less')) {
        aiResponse = "I've condensed the lesson plan to focus on core concepts. The main instruction time has been reduced, and I've streamlined the activities while maintaining learning effectiveness.";
      } else if (lowerRequest.includes('example') || lowerRequest.includes('more example')) {
        aiResponse = "I've added 3 more real-world examples throughout the lesson plan, particularly in the introduction and main instruction sections. These examples connect the topic to students' daily experiences.";
      } else if (lowerRequest.includes('technology') || lowerRequest.includes('digital')) {
        aiResponse = "I've integrated technology tools including interactive simulations, online collaborative boards, and digital assessment tools. The materials section now includes specific apps and websites to use.";
      } else if (lowerRequest.includes('homework') || lowerRequest.includes('assignment')) {
        aiResponse = "I've modified the homework section to include differentiated assignments with choice boards. Students can now select from various activities that match their learning style and interests.";
      } else {
        aiResponse = "I understand you'd like to refine the lesson plan. I've updated the content to better match your request. Please let me know if you'd like any other specific changes!";
      }

      setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    }, 2000);
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

**Generated with AI Smart Planner** ✨`;
  };

  const totalSteps = formData.mode === 'quick' ? 2 : 4;

  // If generating, show loading modal
  if (isGenerating) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            border: '6px solid #e2e8f0',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
            Generating Your Lesson Plan
          </h2>
          <p style={{ margin: '0 0 2rem 0', color: '#667eea', fontSize: '1.1rem', fontWeight: 600 }}>
            {generationStatus}
          </p>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            This may take 30-60 seconds...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If plan is generated, show results with chat sidebar
  if (generatedPlan) {
    return (
      <div>
        <button
          onClick={() => {
            setGeneratedPlan(null);
            setChatMessages([]);
            setChatInput('');
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            color: '#2d3748',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          <i className="fas fa-arrow-left"></i> Generate Another Plan
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Main Content - Lesson Plan */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
              <h1 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{formData.topic}</h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.375rem 0.75rem', background: '#667eea20', color: '#667eea', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Lesson Plan
                </span>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                  <i className="fas fa-book"></i> {formData.subject}
                </span>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                  <i className="fas fa-school"></i> {formData.grade}
                </span>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                  <i className="fas fa-clock"></i> {formData.duration}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button className="sign-in-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
                <i className="fas fa-save"></i> Save
              </button>
              <button className="sign-in-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="sign-in-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <i className="fas fa-download"></i> Download
              </button>
              <button className="sign-in-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                <i className="fas fa-share"></i> Share
              </button>
              <button className="sign-in-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <i className="fas fa-sync"></i> Regenerate
              </button>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#2d3748' }}>
              {generatedPlan}
            </div>
          </div>

          {/* Right Sidebar - Refine with AI Chat */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
              {/* Chat Header */}
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', color: 'white' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-magic"></i> Refine with AI
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                  Ask me to modify your lesson plan
                </p>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px', maxHeight: '350px' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#718096', padding: '2rem 0' }}>
                    <i className="fas fa-comments" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages yet. Try the examples below!</p>
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
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          background: msg.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc',
                          color: msg.isUser ? 'white' : '#2d3748',
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}
                      >
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '0.25rem', paddingLeft: msg.isUser ? 0 : '1rem', paddingRight: msg.isUser ? '1rem' : 0, textAlign: msg.isUser ? 'right' : 'left' }}>
                        {msg.isUser ? 'You' : 'AI Assistant'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Example Prompts */}
              {chatMessages.length === 0 && (
                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096', marginBottom: '0.25rem' }}>
                    Try these:
                  </div>
                  {[
                    'Make it more interactive',
                    'Add more examples',
                    'Include technology integration',
                    'Reduce homework load'
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExamplePrompt(prompt)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: '#f7fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#4a5568',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea10';
                        e.currentTarget.style.borderColor = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f7fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: '#f7fafc' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Type your request..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: chatInput.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
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

  return (
    <>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            color: '#2d3748',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Smart Planner
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {[1, 2, 3, 4].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            const isSkipped = formData.mode === 'quick' && (step === 2 || step === 3);

            if (isSkipped) return null;

            return (
              <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : isCompleted ? '#10b981' : '#e2e8f0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      marginBottom: '0.5rem'
                    }}
                  >
                    {isCompleted ? <i className="fas fa-check"></i> : step}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isActive ? '#667eea' : '#718096', fontWeight: isActive ? 600 : 400, textAlign: 'center' }}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : step === 3 ? 'Customize' : 'Review'}
                  </div>
                </div>
                {step < (formData.mode === 'quick' ? 2 : 4) && !isSkipped && (
                  <div style={{ width: '100%', height: '2px', background: isCompleted ? '#10b981' : '#e2e8f0', margin: '0 1rem' }}></div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#718096', fontSize: '0.875rem' }}>
            Step {formData.mode === 'quick' && currentStep === 4 ? 2 : currentStep} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
              <i className="fas fa-info-circle"></i> Basic Information
            </h2>
            <p style={{ margin: '0 0 2rem 0', color: '#718096' }}>
              Let's start with the essentials for your lesson plan
            </p>

            {/* Mode Toggle */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.75rem' }}>
                Generation Mode
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'quick' })}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: formData.mode === 'quick' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                    border: `2px solid ${formData.mode === 'quick' ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: formData.mode === 'quick' ? 'white' : '#2d3748',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-bolt"></i> Quick Mode
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                    Minimal inputs, fast generation
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'advanced' })}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: formData.mode === 'advanced' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    border: `2px solid ${formData.mode === 'advanced' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: formData.mode === 'advanced' ? 'white' : '#2d3748',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-sliders-h"></i> Advanced Mode
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                    Detailed inputs, comprehensive output
                  </div>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Grade Level <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Topic/Chapter <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Introduction to Quadratic Equations"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Lesson Duration <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748',
                    background: 'white',
                    cursor: 'pointer'
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
        )}

        {/* Step 2: Details (Advanced Mode Only) */}
        {currentStep === 2 && formData.mode === 'advanced' && (
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
              <i className="fas fa-list-alt"></i> Details & Preferences
            </h2>
            <p style={{ margin: '0 0 2rem 0', color: '#718096' }}>
              Add more context to customize your lesson plan
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Learning Objectives (Optional)
                </label>
                <textarea
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="What should students learn? e.g., Students will be able to solve quadratic equations using factoring method..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  Prerequisites (Optional)
                </label>
                <textarea
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="What should students already know? e.g., Basic algebraic operations, understanding of variables..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                    Teaching Style
                  </label>
                  <select
                    value={formData.teachingStyle}
                    onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#2d3748',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select teaching style</option>
                    {teachingStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                    Curriculum Standard
                  </label>
                  <select
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#2d3748',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select curriculum</option>
                    {curriculums.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customization (Advanced Mode Only) */}
        {currentStep === 3 && formData.mode === 'advanced' && (
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
              <i className="fas fa-cog"></i> Customize Your Plan
            </h2>
            <p style={{ margin: '0 0 2rem 0', color: '#718096' }}>
              Select which sections to include in your lesson plan
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '1rem' }}>
                Sections to Include
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {Object.entries(formData.sectionsToInclude).map(([key, value]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      background: value ? '#667eea10' : '#f7fafc',
                      border: `2px solid ${value ? '#667eea' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        sectionsToInclude: {
                          ...formData.sectionsToInclude,
                          [key]: e.target.checked
                        }
                      })}
                      style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#2d3748', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                Special Requirements (Optional)
              </label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="Any specific instructions? e.g., Include technology integration, Focus on practical applications, Add group work activities..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#2d3748',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Generate */}
        {currentStep === 4 && (
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
              <i className="fas fa-check-circle"></i> Review & Generate
            </h2>
            <p style={{ margin: '0 0 2rem 0', color: '#718096' }}>
              Review your inputs and generate your lesson plan
            </p>

            <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem' }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>Subject:</span>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.subject || 'Not specified'}</div>
                </div>
                <div>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>Grade:</span>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.grade || 'Not specified'}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>Topic:</span>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.topic || 'Not specified'}</div>
                </div>
                <div>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>Duration:</span>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.duration || 'Not specified'}</div>
                </div>
                <div>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>Mode:</span>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.mode === 'quick' ? 'Quick Mode' : 'Advanced Mode'}</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '2px solid #fbbf24', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <i className="fas fa-info-circle" style={{ color: '#f59e0b', marginTop: '0.25rem' }}></i>
                <div>
                  <div style={{ color: '#92400e', fontWeight: 600, marginBottom: '0.25rem' }}>Estimated Generation Time</div>
                  <div style={{ color: '#78350f', fontSize: '0.9rem' }}>30-60 seconds</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === 1 ? '#f7fafc' : 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              color: currentStep === 1 ? '#cbd5e0' : '#2d3748',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.grade || !formData.topic || !formData.duration}
              className="sign-in-btn"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '0.9rem',
                opacity: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 'not-allowed' : 'pointer'
              }}
            >
              <i className="fas fa-magic"></i> Generate with AI ✨
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!formData.subject || !formData.grade || !formData.topic || !formData.duration}
              className="sign-in-btn"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                opacity: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.grade || !formData.topic || !formData.duration) ? 'not-allowed' : 'pointer'
              }}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LessonPlanGenerator;
