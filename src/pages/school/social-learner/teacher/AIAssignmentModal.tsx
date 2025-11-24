import { useState, useEffect } from 'react';
import { getAllSubjects, getUnitsForSubject, getTopicsForUnit } from '../../../../services/teacherCurriculumService';
import type { AssignmentConfig, QuestionType, DifficultyLevel, BloomLevel } from '../../../../types/curriculum.types';

interface AIAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: AssignmentConfig) => void;
}

const AIAssignmentModal = ({ isOpen, onClose, onGenerate }: AIAssignmentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);

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
    if (selectedSubjectData && selectedTopics.length > 0 && !assignmentTitle) {
      const topicTitles = availableTopics
        .filter(t => selectedTopics.includes(t.id))
        .map(t => t.title)
        .slice(0, 2)
        .join(' & ');
      setAssignmentTitle(`${selectedSubjectData.name} - ${topicTitles}`);
    }
  }, [selectedSubject, selectedTopics]);

  // Validate percentage distribution
  const totalPercentage = mcqPercent + shortAnswerPercent + longAnswerPercent + practicalPercent;
  const isPercentageValid = totalPercentage === 100;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGenerate = () => {
    if (!selectedSubjectData) return;

    const config: AssignmentConfig = {
      title: assignmentTitle || `${selectedSubjectData.name} Assignment`,
      subject: selectedSubjectData.name,
      subjectId: selectedSubject,
      className: '10th Standard',
      classGrade: 'TN Board - 10th Std',
      unitIds: selectedUnits,
      topicIds: selectedTopics,
      type: assignmentType,
      totalMarks,
      dueDate,
      duration,
      difficulty,
      totalQuestions,
      questionDistribution: {
        mcq: mcqPercent,
        shortAnswer: shortAnswerPercent,
        longAnswer: longAnswerPercent,
        practical: practicalPercent
      },
      includeDiagrams,
      includeRealWorld,
      bloomLevel,
      instructions,
      submissionGuidelines,
      allowLateSubmission,
      showAnswersAfterSubmission
    };

    onGenerate(config);
  };

  const handleUnitToggle = (unitId: string) => {
    setSelectedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
    // Clear topics when units change
    setSelectedTopics([]);
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-magic" style={{ marginRight: '0.75rem' }}></i>
              AI Assignment Creator
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '4px',
                  background: currentStep >= step ? 'white' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
            Step {currentStep} of 5
          </p>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '2rem'
        }}>
          {/* Step 1: Subject & Curriculum Selection */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 600 }}>
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

              {/* Class/Grade Info (Auto-filled) */}
              {selectedSubject && (
                <div style={{
                  background: '#f7fafc',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '2px solid #e2e8f0'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>
                    Class/Grade
                  </p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#2d3748', fontWeight: 600 }}>
                    <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                    {selectedSubjectData?.code} - 10th Standard
                  </p>
                </div>
              )}

              {/* Units Selection */}
              {selectedSubject && units.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                    Select Units/Chapters <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '200px', overflow: 'auto' }}>
                    {units.map(unit => (
                      <div
                        key={unit.id}
                        onClick={() => handleUnitToggle(unit.id)}
                        style={{
                          padding: '1rem',
                          border: '2px solid',
                          borderColor: selectedUnits.includes(unit.id) ? '#094d88' : '#e2e8f0',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: selectedUnits.includes(unit.id) ? '#f0f9ff' : 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            checked={selectedUnits.includes(unit.id)}
                            onChange={() => {}}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>{unit.title}</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                              {unit.topics.length} topics
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Selection */}
              {selectedUnits.length > 0 && availableTopics.length > 0 && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                    Select Topics <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '250px', overflow: 'auto' }}>
                    {availableTopics.map(topic => (
                      <div
                        key={topic.id}
                        onClick={() => handleTopicToggle(topic.id)}
                        style={{
                          padding: '1rem',
                          border: '2px solid',
                          borderColor: selectedTopics.includes(topic.id) ? '#10ac8b' : '#e2e8f0',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: selectedTopics.includes(topic.id) ? '#f0fdf4' : 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic.id)}
                            onChange={() => {}}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '0.25rem' }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>{topic.title}</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                              {topic.description}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                background: topic.difficulty === 'easy' ? '#dcfce7' : topic.difficulty === 'medium' ? '#fef3c7' : '#fee2e2',
                                color: topic.difficulty === 'easy' ? '#15803d' : topic.difficulty === 'medium' ? '#a16207' : '#b91c1c',
                                borderRadius: '6px',
                                fontWeight: 600
                              }}>
                                {topic.difficulty}
                              </span>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                background: '#e0e7ff',
                                color: '#4338ca',
                                borderRadius: '6px',
                                fontWeight: 600
                              }}>
                                {topic.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Assignment Details */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 600 }}>
                Assignment Details
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Assignment Title */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                    Assignment Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder="e.g., Trigonometry Practice Quiz"
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
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                    Assignment Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={assignmentType}
                    onChange={(e) => setAssignmentType(e.target.value as any)}
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
                    <option value="homework">Homework</option>
                    <option value="practice">Practice</option>
                    <option value="quiz">Quiz</option>
                    <option value="unit-test">Unit Test</option>
                    <option value="project">Project</option>
                    <option value="worksheet">Worksheet</option>
                  </select>
                </div>

                {/* Total Marks and Duration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                      Total Marks <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      min="10"
                      max="100"
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
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                      Duration (minutes) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min="15"
                      max="180"
                      step="15"
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
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer'
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
                    <option value="mixed">Mixed (Variety)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Question Configuration */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 600 }}>
                Question Configuration
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Total Questions */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                    Total Questions <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    min="5"
                    max="50"
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
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontWeight: 600 }}>
                    Question Type Distribution (must total 100%)
                  </label>

                  {/* MCQ */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
                        Multiple Choice (MCQ)
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#094d88', fontWeight: 600 }}>
                        {mcqPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={mcqPercent}
                      onChange={(e) => setMcqPercent(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Short Answer */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
                        Short Answer (2-5 marks)
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#094d88', fontWeight: 600 }}>
                        {shortAnswerPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={shortAnswerPercent}
                      onChange={(e) => setShortAnswerPercent(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Long Answer */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
                        Long Answer (5-10 marks)
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#094d88', fontWeight: 600 }}>
                        {longAnswerPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={longAnswerPercent}
                      onChange={(e) => setLongAnswerPercent(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Practical */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
                        Practical/Application
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#094d88', fontWeight: 600 }}>
                        {practicalPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      value={practicalPercent}
                      onChange={(e) => setPracticalPercent(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Total Validation */}
                  <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: isPercentageValid ? '#dcfce7' : '#fee2e2',
                    border: '2px solid',
                    borderColor: isPercentageValid ? '#16a34a' : '#dc2626'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isPercentageValid ? '#15803d' : '#b91c1c'
                    }}>
                      <i className={`fas ${isPercentageValid ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} style={{ marginRight: '0.5rem' }}></i>
                      Total: {totalPercentage}% {isPercentageValid ? '✓' : '(must be 100%)'}
                    </p>
                  </div>
                </div>

                {/* Bloom's Taxonomy Level */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                    Bloom's Taxonomy Level
                  </label>
                  <select
                    value={bloomLevel}
                    onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}
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
                    <option value="remember">Remember (recall facts)</option>
                    <option value="understand">Understand (explain concepts)</option>
                    <option value="apply">Apply (use knowledge)</option>
                    <option value="analyze">Analyze (examine relationships)</option>
                    <option value="evaluate">Evaluate (make judgments)</option>
                    <option value="create">Create (produce new work)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: AI Enhancement Options */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 600 }}>
                AI Enhancement Options
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Checkboxes */}
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={includeDiagrams}
                      onChange={(e) => setIncludeDiagrams(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>Include Diagrams & Illustrations</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                        Add visual elements to questions where applicable
                      </p>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeRealWorld}
                      onChange={(e) => setIncludeRealWorld(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>Include Real-World Applications</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                        Frame questions with practical, real-life scenarios
                      </p>
                    </div>
                  </label>
                </div>

                {/* Instructions */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 600 }}>
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., Focus on numerical problems, include step-by-step solutions..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
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
                    placeholder="e.g., Submit answers in PDF format, show all working..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Additional Settings */}
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={allowLateSubmission}
                      onChange={(e) => setAllowLateSubmission(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>Allow Late Submission</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                        Students can submit after the due date
                      </p>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showAnswersAfterSubmission}
                      onChange={(e) => setShowAnswersAfterSubmission(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>Show Answers After Submission</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                        Reveal answer key and solutions after submission
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Generate */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 600 }}>
                Review & Generate
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Summary Card */}
                <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 600 }}>
                    Assignment Summary
                  </h4>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>Subject:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>
                        {selectedSubjectData?.name} ({selectedSubjectData?.code})
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>Title:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>
                        {assignmentTitle || 'Untitled Assignment'}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>Type:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748', textTransform: 'capitalize' }}>
                        {assignmentType}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#718096' }}>Marks:</span>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>{totalMarks}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#718096' }}>Questions:</span>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>{totalQuestions}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#718096' }}>Duration:</span>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>{duration} min</p>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>Topics Covered:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#2d3748' }}>
                        {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} from {selectedUnits.length} unit{selectedUnits.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>Question Distribution:</span>
                      <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.25rem' }}>
                        {mcqPercent > 0 && <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>MCQ: {mcqPercent}%</p>}
                        {shortAnswerPercent > 0 && <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>Short Answer: {shortAnswerPercent}%</p>}
                        {longAnswerPercent > 0 && <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>Long Answer: {longAnswerPercent}%</p>}
                        {practicalPercent > 0 && <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>Practical: {practicalPercent}%</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div style={{
                  padding: '1rem',
                  background: '#dbeafe',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                    AI will generate questions based on your selected topics and configuration. You can edit individual questions after generation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === 1 ? '#e2e8f0' : 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              color: currentStep === 1 ? '#a0aec0' : '#2d3748',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Previous
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (selectedTopics.length === 0 || !selectedSubject)) ||
                  (currentStep === 2 && (!assignmentTitle || !dueDate)) ||
                  (currentStep === 3 && !isPercentageValid)
                }
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  opacity: (currentStep === 1 && (selectedTopics.length === 0 || !selectedSubject)) ||
                          (currentStep === 2 && (!assignmentTitle || !dueDate)) ||
                          (currentStep === 3 && !isPercentageValid) ? 0.5 : 1
                }}
              >
                Next
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #10ac8b 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(16, 172, 139, 0.3)'
                }}
              >
                <i className="fas fa-magic" style={{ marginRight: '0.5rem' }}></i>
                Generate Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssignmentModal;
