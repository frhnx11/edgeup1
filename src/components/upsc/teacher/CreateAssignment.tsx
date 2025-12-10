import { useState } from 'react';
import { callOpenAI } from '../../../services/openai';

interface CreateAssignmentProps {
  onBack: () => void;
  onSave?: (assignment: any) => void;
}

type CreationMode = 'choice' | 'manual' | 'ai';

interface ManualFormData {
  title: string;
  className: string;
  dueDate: string;
  totalMarks: string;
  type: string;
  description: string;
}

interface AIFormData {
  subject: string;
  grade: string;
  topic: string;
  type: string;
  difficulty: string;
  totalMarks: string;
  duration: string;
  specialInstructions: string;
}

const CreateAssignment = ({ onBack, onSave }: CreateAssignmentProps) => {
  const [creationMode, setCreationMode] = useState<CreationMode>('choice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const [manualForm, setManualForm] = useState<ManualFormData>({
    title: '',
    className: 'Grade 10A',
    dueDate: '',
    totalMarks: '',
    type: 'Homework',
    description: ''
  });

  const [aiForm, setAIForm] = useState<AIFormData>({
    subject: '',
    grade: 'Grade 10',
    topic: '',
    type: 'Homework',
    difficulty: 'Medium',
    totalMarks: '100',
    duration: '60',
    specialInstructions: ''
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manual assignment created:', manualForm);
    if (onSave) {
      onSave(manualForm);
    }
    onBack();
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const prompt = `Create a detailed assignment with the following specifications:

Subject: ${aiForm.subject}
Grade Level: ${aiForm.grade}
Topic: ${aiForm.topic}
Assignment Type: ${aiForm.type}
Difficulty Level: ${aiForm.difficulty}
Total Marks: ${aiForm.totalMarks}
Suggested Duration: ${aiForm.duration} minutes
${aiForm.specialInstructions ? `Special Instructions: ${aiForm.specialInstructions}` : ''}

Please generate:
1. A clear, engaging assignment title
2. Detailed learning objectives (3-5 objectives)
3. Complete assignment instructions and requirements
4. A marking rubric with clear criteria
5. Suggested resources or references for students

Format the response as a structured assignment document.`;

      const systemPrompt = 'You are an experienced educator creating high-quality assignments. Generate comprehensive, well-structured assignments that are engaging and educational.';

      const response = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.8,
        max_tokens: 2000
      });

      setGeneratedContent({
        title: `${aiForm.subject} - ${aiForm.topic}`,
        content: response,
        subject: aiForm.subject,
        grade: aiForm.grade,
        type: aiForm.type,
        totalMarks: aiForm.totalMarks
      });

      setCreationMode('ai');
    } catch (error) {
      console.error('Error generating assignment:', error);
      alert('Failed to generate assignment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = () => {
    if (generatedContent && onSave) {
      onSave({
        title: generatedContent.title,
        className: aiForm.grade,
        type: aiForm.type,
        totalMarks: aiForm.totalMarks,
        description: generatedContent.content,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 week from now
      });
    }
    onBack();
  };

  // Choice Screen
  if (creationMode === 'choice') {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#094d88';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Assignments</span>
        </button>

        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
            <i className="fas fa-plus-circle" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
            Create New Assignment
          </h1>
          <p style={{ margin: 0, color: '#718096', fontSize: '1.1rem' }}>
            Choose how you'd like to create your assignment
          </p>
        </div>

        {/* Choice Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Manual Creation Card */}
          <div
            onClick={() => setCreationMode('manual')}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '3rem 2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '3px solid transparent',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#094d88';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(9, 77, 136, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto'
            }}>
              <i className="fas fa-edit" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              Manual Creation
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>
              Create your assignment from scratch with complete control over every detail
            </p>
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', padding: '0 1rem', color: '#718096', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Full customization options
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Write your own instructions
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Quick and straightforward
              </li>
            </ul>
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-arrow-right"></i>
              Choose Manual
            </div>
          </div>

          {/* AI Generation Card */}
          <div
            onClick={() => setCreationMode('ai')}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '3rem 2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '3px solid transparent',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10ac8b';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 172, 139, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'linear-gradient(135deg, #10ac8b 0%, #0d9976 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(16, 172, 139, 0.3)'
            }}>
              <i className="fas fa-sparkles" style={{ marginRight: '0.5rem' }}></i>
              AI POWERED
            </div>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto'
            }}>
              <i className="fas fa-brain" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              AI Generation
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>
              Let AI create a comprehensive assignment based on your requirements
            </p>
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', padding: '0 1rem', color: '#718096', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Intelligent content generation
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Detailed rubrics & objectives
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Time-saving & creative
              </li>
            </ul>
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-magic"></i>
              Choose AI
            </div>
          </div>
        </div>
      </>
    );
  }

  // Manual Creation Mode
  if (creationMode === 'manual') {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => setCreationMode('choice')}
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#094d88';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Choice</span>
        </button>

        {/* Manual Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
            <i className="fas fa-edit" style={{ marginRight: '0.75rem', color: '#667eea' }}></i>
            Manual Assignment Creation
          </h2>
          <p style={{ margin: '0 0 2rem 0', color: '#718096' }}>
            Fill in the details to create your assignment
          </p>

          <form onSubmit={handleManualSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-heading" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={manualForm.title}
                  onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                  placeholder="Enter assignment title"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-chalkboard" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Class *
                </label>
                <select
                  value={manualForm.className}
                  onChange={(e) => setManualForm({...manualForm, className: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-tag" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Assignment Type *
                </label>
                <select
                  value={manualForm.type}
                  onChange={(e) => setManualForm({...manualForm, type: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Homework">Homework</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Project">Project</option>
                  <option value="Essay">Essay</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-award" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={manualForm.totalMarks}
                  onChange={(e) => setManualForm({...manualForm, totalMarks: e.target.value})}
                  placeholder="100"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Due Date *
                </label>
                <input
                  type="date"
                  value={manualForm.dueDate}
                  onChange={(e) => setManualForm({...manualForm, dueDate: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-align-left" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Description & Instructions *
                </label>
                <textarea
                  value={manualForm.description}
                  onChange={(e) => setManualForm({...manualForm, description: e.target.value})}
                  placeholder="Enter assignment description and instructions..."
                  rows={6}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCreationMode('choice')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                type="submit"
                className="sign-in-btn"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '0.95rem'
                }}
              >
                <i className="fas fa-check"></i> Create Assignment
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // AI Generation Mode
  if (creationMode === 'ai' && !generatedContent) {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => setCreationMode('choice')}
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#094d88';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Choice</span>
        </button>

        {/* AI Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-brain" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              AI Assignment Generation
            </h2>
            <p style={{ margin: 0, color: '#718096' }}>
              Provide the details and let AI create a comprehensive assignment for you
            </p>
          </div>

          <form onSubmit={handleAIGenerate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-book" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Subject *
                </label>
                <input
                  type="text"
                  value={aiForm.subject}
                  onChange={(e) => setAIForm({...aiForm, subject: e.target.value})}
                  placeholder="e.g., Mathematics, Physics, English"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Grade Level *
                </label>
                <select
                  value={aiForm.grade}
                  onChange={(e) => setAIForm({...aiForm, grade: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Topic / Chapter *
                </label>
                <input
                  type="text"
                  value={aiForm.topic}
                  onChange={(e) => setAIForm({...aiForm, topic: e.target.value})}
                  placeholder="e.g., Quadratic Equations, Newton's Laws, Shakespeare"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-tag" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Assignment Type *
                </label>
                <select
                  value={aiForm.type}
                  onChange={(e) => setAIForm({...aiForm, type: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Homework">Homework</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Project">Project</option>
                  <option value="Essay">Essay</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Research Paper">Research Paper</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-signal" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Difficulty Level *
                </label>
                <select
                  value={aiForm.difficulty}
                  onChange={(e) => setAIForm({...aiForm, difficulty: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-award" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={aiForm.totalMarks}
                  onChange={(e) => setAIForm({...aiForm, totalMarks: e.target.value})}
                  placeholder="100"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={aiForm.duration}
                  onChange={(e) => setAIForm({...aiForm, duration: e.target.value})}
                  placeholder="60"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-clipboard-list" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={aiForm.specialInstructions}
                  onChange={(e) => setAIForm({...aiForm, specialInstructions: e.target.value})}
                  placeholder="Any specific requirements, focus areas, or constraints..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCreationMode('choice')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="sign-in-btn"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '0.95rem',
                  opacity: isGenerating ? 0.7 : 1,
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i> Generate with AI
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Generated Content View
  if (creationMode === 'ai' && generatedContent) {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => {
            setGeneratedContent(null);
            setCreationMode('choice');
          }}
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#094d88';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>

        {/* Generated Assignment Display */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-check-circle" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Assignment Generated Successfully!</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Review and edit if needed, then save</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              {generatedContent.title}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                border: '2px solid #e2e8f0'
              }}>
                <i className="fas fa-book" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                {generatedContent.subject}
              </span>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                border: '2px solid #e2e8f0'
              }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                {generatedContent.grade}
              </span>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                border: '2px solid #e2e8f0'
              }}>
                <i className="fas fa-tag" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                {generatedContent.type}
              </span>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                border: '2px solid #e2e8f0'
              }}>
                <i className="fas fa-award" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
                {generatedContent.totalMarks} marks
              </span>
            </div>
          </div>

          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
              <i className="fas fa-file-alt" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
              Assignment Content
            </h3>
            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              color: '#2d3748',
              fontSize: '0.95rem'
            }}>
              {generatedContent.content}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setGeneratedContent(null);
                setCreationMode('ai');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
                color: '#2d3748',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-redo"></i> Regenerate
            </button>
            <button
              onClick={handleSaveGenerated}
              className="sign-in-btn"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '0.95rem'
              }}
            >
              <i className="fas fa-save"></i> Save Assignment
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default CreateAssignment;
