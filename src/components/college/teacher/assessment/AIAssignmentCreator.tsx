import { useState, useEffect } from 'react';
import { getAllSubjects, getUnitsForSubject, getTopicsForUnit } from '../../../../services/teacherCurriculumService';
import type { AssignmentConfig, DifficultyLevel, BloomLevel } from '../../../types/curriculum.types';
import { callOpenAI } from '../../../../services/openai';

interface AIAssignmentCreatorProps {
  onBack: () => void;
  onSave?: (assignment: any) => void;
}

const AIAssignmentCreator = ({ onBack, onSave }: AIAssignmentCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssignment, setGeneratedAssignment] = useState<string | null>(null);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentType, setAssignmentType] = useState<'homework' | 'practice' | 'quiz' | 'unit-test' | 'project' | 'worksheet'>('homework');
  const [totalMarks, setTotalMarks] = useState(50);
  const [dueDate, setDueDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'mixed'>('medium');
  const [totalQuestions, setTotalQuestions] = useState(10);

  // Question distribution (percentages)
  const [mcqPercent, setMcqPercent] = useState(30);
  const [shortAnswerPercent, setShortAnswerPercent] = useState(40);
  const [longAnswerPercent, setLongAnswerPercent] = useState(30);
  const [practicalPercent, setPracticalPercent] = useState(0);

  // AI settings
  const [includeDiagrams, setIncludeDiagrams] = useState(false);
  const [includeRealWorld, setIncludeRealWorld] = useState(true);
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>('apply');
  const [instructions, setInstructions] = useState('');
  const [submissionGuidelines, setSubmissionGuidelines] = useState('');
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [showAnswersAfterSubmission, setShowAnswersAfterSubmission] = useState(false);

  // Get curriculum data
  const subjects = getAllSubjects();
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const units = selectedSubject ? getUnitsForSubject(selectedSubject) : [];
  const availableTopics = selectedUnits.flatMap(unitId => {
    const topics = getTopicsForUnit(selectedSubject, unitId);
    return topics.map(t => ({ ...t, unitId }));
  });

  // Auto-generate title when subject and topics are selected
  useEffect(() => {
    if (selectedSubject && selectedTopics.length > 0) {
      const subjectName = selectedSubjectData?.name || '';
      const topicNames = availableTopics
        .filter(t => selectedTopics.includes(t.id))
        .map(t => t.name)
        .slice(0, 2)
        .join(', ');

      setAssignmentTitle(`${subjectName} - ${topicNames}${selectedTopics.length > 2 ? ' +more' : ''}`);
    }
  }, [selectedSubject, selectedTopics, selectedSubjectData, availableTopics]);

  const toggleUnit = (unitId: string) => {
    setSelectedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGenerateAssignment = async () => {
    setIsGenerating(true);

    try {
      const selectedTopicDetails = availableTopics.filter(t => selectedTopics.includes(t.id));

      const prompt = `Create a comprehensive assignment for college students:

**Subject:** ${selectedSubjectData?.name}
**Topics:** ${selectedTopicDetails.map(t => t.name).join(', ')}
**Assignment Type:** ${assignmentType}
**Total Marks:** ${totalMarks}
**Duration:** ${duration} minutes
**Difficulty:** ${difficulty}
**Total Questions:** ${totalQuestions}

**Question Distribution:**
- MCQ: ${mcqPercent}%
- Short Answer: ${shortAnswerPercent}%
- Long Answer: ${longAnswerPercent}%
- Practical: ${practicalPercent}%

**AI Enhancements:**
- Include Diagrams: ${includeDiagrams ? 'Yes' : 'No'}
- Include Real-World Applications: ${includeRealWorld ? 'Yes' : 'No'}
- Bloom's Taxonomy Level: ${bloomLevel}

**Special Instructions:** ${instructions || 'None'}

**Submission Guidelines:** ${submissionGuidelines || 'Standard submission'}

Please create a well-structured assignment with clear questions, marking scheme, and learning outcomes.`;

      const response = await callOpenAI(prompt);
      setGeneratedAssignment(response);

      if (onSave) {
        onSave({
          id: `assign-ai-${Date.now()}`,
          title: assignmentTitle,
          type: assignmentType,
          totalMarks,
          dueDate,
          content: response,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error generating assignment:', error);
      alert('Failed to generate assignment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedStep1 = selectedSubject && selectedUnits.length > 0 && selectedTopics.length > 0;
  const canProceedStep2 = assignmentTitle && assignmentType && totalMarks && dueDate && duration;
  const canProceedStep3 = (mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent) === 100;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
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
          <i className="fas fa-arrow-left"></i> Back
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
            <i className="fas fa-robot" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
              color: 'white',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 15px rgba(16, 172, 139, 0.4)'
            }}>
              AI POWERED
            </div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              AI Assignment Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Generate comprehensive assignments based on curriculum and learning outcomes
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '6px',
                background: currentStep >= step ? 'white' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: '3px',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
        <p style={{ margin: '0.75rem 0 0 0', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
          Step {currentStep} of 5
        </p>
      </div>

      {/* Main Content Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '1000px',
        margin: '0 auto 2rem'
      }}>
        {/* Step 1: Subject & Curriculum Selection */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 600 }}>
              <i className="fas fa-book" style={{ marginRight: '0.75rem', color: '#3b82f6' }}></i>
              Select Subject & Topics
            </h3>

            {/* Subject Dropdown */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                Subject <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedUnits([]);
                  setSelectedTopics([]);
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Units Selection */}
            {selectedSubject && units.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                  Units/Chapters <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {units.map(unit => (
                    <div
                      key={unit.id}
                      onClick={() => toggleUnit(unit.id)}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${selectedUnits.includes(unit.id) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: selectedUnits.includes(unit.id) ? '#eff6ff' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedUnits.includes(unit.id)}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.95rem' }}>{unit.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#718096' }}>{unit.topics?.length || 0} topics</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Selection */}
            {selectedUnits.length > 0 && availableTopics.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                  Topics <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
                  {availableTopics.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      style={{
                        padding: '0.875rem',
                        border: `2px solid ${selectedTopics.includes(topic.id) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedTopics.includes(topic.id) ? '#eff6ff' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(topic.id)}
                          onChange={() => {}}
                          style={{ width: '16px', height: '16px', marginTop: '2px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{topic.name}</div>
                          {topic.description && (
                            <div style={{ fontSize: '0.75rem', color: '#718096', lineHeight: 1.4 }}>{topic.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
              <button
                onClick={onBack}
                style={{
                  padding: '0.875rem 1.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedStep1}
                style={{
                  padding: '0.875rem 2rem',
                  border: 'none',
                  borderRadius: '10px',
                  background: canProceedStep1 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#cbd5e0',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: canProceedStep1 ? 'pointer' : 'not-allowed',
                  boxShadow: canProceedStep1 ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                Next: Assignment Details
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Assignment Details */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 600 }}>
              <i className="fas fa-file-alt" style={{ marginRight: '0.75rem', color: '#3b82f6' }}></i>
              Assignment Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Assignment Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Assignment Type */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                  Assignment Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {[
                    { value: 'homework', label: 'Homework', icon: 'fa-home' },
                    { value: 'practice', label: 'Practice', icon: 'fa-pen' },
                    { value: 'quiz', label: 'Quiz', icon: 'fa-question-circle' },
                    { value: 'unit-test', label: 'Unit Test', icon: 'fa-clipboard-check' },
                    { value: 'project', label: 'Project', icon: 'fa-project-diagram' },
                    { value: 'worksheet', label: 'Worksheet', icon: 'fa-file-alt' }
                  ].map(type => (
                    <div
                      key={type.value}
                      onClick={() => setAssignmentType(type.value as any)}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${assignmentType === type.value ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: assignmentType === type.value ? '#eff6ff' : 'white',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className={`fas ${type.icon}`} style={{ fontSize: '1.5rem', color: assignmentType === type.value ? '#3b82f6' : '#718096', marginBottom: '0.5rem' }}></i>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: assignmentType === type.value ? '#3b82f6' : '#2d3748' }}>{type.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Marks */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Total Marks <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Duration (minutes) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Due Date */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Due Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: '0.875rem 1.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedStep2}
                style={{
                  padding: '0.875rem 2rem',
                  border: 'none',
                  borderRadius: '10px',
                  background: canProceedStep2 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#cbd5e0',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: canProceedStep2 ? 'pointer' : 'not-allowed',
                  boxShadow: canProceedStep2 ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                Next: Question Configuration
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Question Configuration */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 600 }}>
              <i className="fas fa-sliders-h" style={{ marginRight: '0.75rem', color: '#3b82f6' }}></i>
              Question Configuration
            </h3>

            {/* Total Questions */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                Total Number of Questions
              </label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Question Type Distribution */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', color: '#4a5568', fontWeight: 600 }}>
                Question Type Distribution (must total 100%)
              </label>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { label: 'MCQ', value: mcqPercent, setter: setMcqPercent, color: '#3b82f6' },
                  { label: 'Short Answer', value: shortAnswerPercent, setter: setShortAnswerPercent, color: '#10ac8b' },
                  { label: 'Long Answer', value: longAnswerPercent, setter: setLongAnswerPercent, color: '#f59e0b' },
                  { label: 'Practical', value: practicalPercent, setter: setPracticalPercent, color: '#8b5cf6' }
                ].map(({ label, value, setter, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2d3748' }}>{label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => setter(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: color }}
                    />
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: (mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent) === 100 ? '#d1fae5' : '#fee2e2',
                border: `2px solid ${(mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent) === 100 ? '#10b981' : '#ef4444'}`,
                textAlign: 'center',
                fontWeight: 600,
                color: (mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent) === 100 ? '#065f46' : '#991b1b'
              }}>
                Total: {mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent}%
                {(mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent) !== 100 && ' (Must equal 100%)'}
              </div>
            </div>

            {/* Bloom's Taxonomy Level */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                Bloom's Taxonomy Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { value: 'remember', label: 'Remember', desc: 'Recall facts' },
                  { value: 'understand', label: 'Understand', desc: 'Explain concepts' },
                  { value: 'apply', label: 'Apply', desc: 'Use knowledge' },
                  { value: 'analyze', label: 'Analyze', desc: 'Break down' },
                  { value: 'evaluate', label: 'Evaluate', desc: 'Make judgments' },
                  { value: 'create', label: 'Create', desc: 'Produce new' }
                ].map(level => (
                  <div
                    key={level.value}
                    onClick={() => setBloomLevel(level.value as BloomLevel)}
                    style={{
                      padding: '0.875rem',
                      border: `2px solid ${bloomLevel === level.value ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: bloomLevel === level.value ? '#eff6ff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: bloomLevel === level.value ? '#3b82f6' : '#2d3748', marginBottom: '0.25rem' }}>{level.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>{level.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  padding: '0.875rem 1.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!canProceedStep3}
                style={{
                  padding: '0.875rem 2rem',
                  border: 'none',
                  borderRadius: '10px',
                  background: canProceedStep3 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#cbd5e0',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: canProceedStep3 ? 'pointer' : 'not-allowed',
                  boxShadow: canProceedStep3 ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                Next: AI Enhancements
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Enhancements */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 600 }}>
              <i className="fas fa-magic" style={{ marginRight: '0.75rem', color: '#3b82f6' }}></i>
              AI Enhancements
            </h3>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Checkbox Options */}
              <div style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                background: includeDiagrams ? '#eff6ff' : 'white'
              }}
              onClick={() => setIncludeDiagrams(!includeDiagrams)}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeDiagrams}
                    onChange={() => {}}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>Include Diagrams & Visuals</div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>Add relevant diagrams, charts, and visual aids to questions</div>
                  </div>
                </label>
              </div>

              <div style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                background: includeRealWorld ? '#eff6ff' : 'white'
              }}
              onClick={() => setIncludeRealWorld(!includeRealWorld)}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeRealWorld}
                    onChange={() => {}}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>Include Real-World Applications</div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>Connect concepts to practical scenarios and industry examples</div>
                  </div>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Any specific requirements for the assignment..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submission Guidelines */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                  Submission Guidelines (Optional)
                </label>
                <textarea
                  value={submissionGuidelines}
                  onChange={(e) => setSubmissionGuidelines(e.target.value)}
                  placeholder="Instructions for how students should submit this assignment..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Settings */}
              <div style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                background: allowLateSubmission ? '#eff6ff' : 'white'
              }}
              onClick={() => setAllowLateSubmission(!allowLateSubmission)}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={allowLateSubmission}
                    onChange={() => {}}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>Allow Late Submission</div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>Students can submit after the due date</div>
                  </div>
                </label>
              </div>

              <div style={{
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                background: showAnswersAfterSubmission ? '#eff6ff' : 'white'
              }}
              onClick={() => setShowAnswersAfterSubmission(!showAnswersAfterSubmission)}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showAnswersAfterSubmission}
                    onChange={() => {}}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>Show Answers After Submission</div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>Reveal correct answers once students submit</div>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  padding: '0.875rem 1.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                style={{
                  padding: '0.875rem 2rem',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
              >
                Next: Review & Generate
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Generate */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 600 }}>
              <i className="fas fa-check-circle" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Review & Generate
            </h3>

            {!generatedAssignment ? (
              <>
                <div style={{
                  background: '#f7fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  marginBottom: '2rem'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>Assignment Summary</h4>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Title:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{assignmentTitle}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Type:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{assignmentType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Subject:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{selectedSubjectData?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Topics:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{selectedTopics.length} selected</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Total Marks:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{totalMarks}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Duration:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{duration} minutes</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Total Questions:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>{totalQuestions}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontWeight: 500 }}>Question Distribution:</span>
                      <span style={{ fontWeight: 600, color: '#2d3748' }}>MCQ:{mcqPercent}% SA:{shortAnswerPercent}% LA:{longAnswerPercent}% P:{practicalPercent}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                  <button
                    onClick={() => setCurrentStep(4)}
                    style={{
                      padding: '0.875rem 1.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      background: 'white',
                      color: '#2d3748',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                    Previous
                  </button>
                  <button
                    onClick={handleGenerateAssignment}
                    disabled={isGenerating}
                    style={{
                      padding: '0.875rem 2.5rem',
                      border: 'none',
                      borderRadius: '10px',
                      background: isGenerating ? '#cbd5e0' : 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      boxShadow: isGenerating ? 'none' : '0 6px 20px rgba(16, 172, 139, 0.4)'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic" style={{ marginRight: '0.5rem' }}></i>
                        Generate Assignment with AI
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div style={{
                  background: '#d1fae5',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ margin: '0.5rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 700 }}>
                    Assignment Generated Successfully!
                  </h4>
                  <p style={{ margin: '0.5rem 0 0', color: '#047857' }}>Your AI-generated assignment is ready.</p>
                </div>

                <div style={{
                  background: '#f7fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  {generatedAssignment}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    onClick={onBack}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      background: 'white',
                      color: '#2d3748',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setGeneratedAssignment(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      border: 'none',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                    Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssignmentCreator;
