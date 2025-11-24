import { useState } from 'react';
import { callOpenAI } from '../../../../services/openai';

interface FlashCard {
  id: number;
  front: string;
  back: string;
}

interface RevisionNote {
  section: string;
  points: string[];
}

interface FlashcardsProps {
  onBack?: () => void;
}

const Flashcards = ({ onBack }: FlashcardsProps) => {
  // Input method state
  const [inputMethod, setInputMethod] = useState<'manual' | 'topic' | 'upload' | 'import'>('manual');

  // Output tab state
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes'>('flashcards');

  // Form data for different input methods
  const [manualText, setManualText] = useState('');
  const [topicData, setTopicData] = useState({
    subject: '',
    grade: '',
    topic: '',
    chapter: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Generated content
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [revisionNotes, setRevisionNotes] = useState<RevisionNote[]>([]);

  // Flash card navigation
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Library state
  const [showLibrary, setShowLibrary] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Business Studies'];
  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const savedPlans = ['Photosynthesis - Biology', 'Quadratic Equations - Math', 'World War II - History'];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Build the content prompt based on input method
      let contentPrompt = '';

      if (inputMethod === 'manual') {
        contentPrompt = manualText;
      } else if (inputMethod === 'topic') {
        contentPrompt = `Create study materials for:
Subject: ${topicData.subject}
Grade: ${topicData.grade}
Topic: ${topicData.topic}
${topicData.chapter ? `Chapter/Section: ${topicData.chapter}` : ''}`;
      } else if (inputMethod === 'upload') {
        // For file upload, we'd need to extract text from the file
        // For now, we'll use a placeholder
        contentPrompt = `Create study materials from the uploaded file: ${uploadedFile?.name}`;
      } else if (inputMethod === 'import') {
        contentPrompt = `Create study materials based on the lesson plan: ${selectedPlan}`;
      }

      // Generate Flash Cards
      const flashcardsPrompt = `Based on the following content, create exactly 8-10 educational flash cards. Each flash card should have a clear question on the front and a comprehensive answer on the back.

Content:
${contentPrompt}

Return the response in this exact JSON format (make sure it's valid JSON):
{
  "flashcards": [
    {"front": "Question here?", "back": "Answer here"},
    {"front": "Question here?", "back": "Answer here"}
  ]
}`;

      const flashcardsResponse = await callOpenAI(
        flashcardsPrompt,
        'You are an expert educational content creator specializing in creating effective study materials. Create clear, concise flash cards that help students learn and retain information. Return only valid JSON.',
        { temperature: 0.7, max_tokens: 2000 }
      );

      // Parse flashcards response
      let generatedCards: FlashCard[] = [];
      try {
        const flashcardsData = JSON.parse(flashcardsResponse);
        generatedCards = flashcardsData.flashcards.map((card: any, index: number) => ({
          id: index + 1,
          front: card.front,
          back: card.back
        }));
      } catch (parseError) {
        console.error('Error parsing flashcards:', parseError);
        // Fallback to extracting Q&A from text
        generatedCards = [
          { id: 1, front: 'Generated from AI', back: flashcardsResponse.substring(0, 200) }
        ];
      }

      // Generate Revision Notes
      const notesPrompt = `Based on the following content, create comprehensive revision notes organized into 4-6 key sections. Each section should have 3-5 concise bullet points.

Content:
${contentPrompt}

Return the response in this exact JSON format (make sure it's valid JSON):
{
  "notes": [
    {
      "section": "Key Concepts",
      "points": ["Point 1", "Point 2", "Point 3"]
    },
    {
      "section": "Important Details",
      "points": ["Detail 1", "Detail 2", "Detail 3"]
    }
  ]
}`;

      const notesResponse = await callOpenAI(
        notesPrompt,
        'You are an expert at creating clear, organized revision notes for students. Create comprehensive but concise notes that cover all key information. Return only valid JSON.',
        { temperature: 0.7, max_tokens: 2000 }
      );

      // Parse notes response
      let generatedNotes: RevisionNote[] = [];
      try {
        const notesData = JSON.parse(notesResponse);
        generatedNotes = notesData.notes;
      } catch (parseError) {
        console.error('Error parsing notes:', parseError);
        // Fallback notes
        generatedNotes = [
          {
            section: 'Overview',
            points: ['AI-generated content', 'Review the material carefully', 'Focus on key concepts']
          }
        ];
      }

      // Set all generated content
      setFlashCards(generatedCards);
      setRevisionNotes(generatedNotes);
      setIsGenerated(true);
      setCurrentCardIndex(0);
      setIsFlipped(false);

    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content with AI. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Library view
  if (showLibrary) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <div style={{
          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
          padding: '2.5rem 3rem',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          boxShadow: '0 8px 32px rgba(9, 77, 136, 0.3)'
        }}>
          <button
            onClick={() => setShowLibrary(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1.5rem',
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
            <i className="fas fa-arrow-left"></i> Back to Generator
          </button>

          <h1 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
            <i className="fas fa-folder-open" style={{ marginRight: '1rem' }}></i>
            My Revision Materials
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            Access all your saved flash cards and revision notes
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Photosynthesis Study Set', type: 'Flash Cards', cards: 15, date: '2024-01-15' },
            { title: 'Cell Structure', type: 'Mind Map', cards: 1, date: '2024-01-14' },
            { title: 'Chemical Reactions', type: 'Revision Notes', cards: 8, date: '2024-01-13' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(9, 77, 136, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <i className={`fas fa-${item.type === 'Flash Cards' ? 'layer-group' : item.type === 'Mind Map' ? 'project-diagram' : 'file-alt'}`}
                   style={{ fontSize: '1.5rem', color: 'white' }}></i>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#f7fafc',
                  borderRadius: '6px',
                  fontWeight: 600,
                  color: '#094d88'
                }}>
                  {item.type}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                <i className="fas fa-calendar"></i> {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main generator view
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(9, 77, 136, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
              <i className="fas fa-brain" style={{ marginRight: '1rem' }}></i>
              Flash Cards & Revision Aids
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Auto-generate visual flash cards and quick revision notes from any content
            </p>
          </div>
          <button
            onClick={() => setShowLibrary(true)}
            className="sign-in-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '16px',
              padding: '1.25rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#094d88',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)';
            }}
          >
            <i className="fas fa-folder-open"></i> My Revision Materials
          </button>
        </div>
      </div>

      {/* Main Content - Split Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '2rem',
        minHeight: '600px'
      }}>
        {/* LEFT PANEL - Input Methods */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            Content Input
          </h2>

          {/* Input Method Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {[
              { key: 'manual', icon: 'keyboard', label: 'Manual Text' },
              { key: 'topic', icon: 'book', label: 'Topic-Based' },
              { key: 'upload', icon: 'upload', label: 'File Upload' },
              { key: 'import', icon: 'file-import', label: 'Import Plans' }
            ].map((method) => (
              <button
                key={method.key}
                onClick={() => setInputMethod(method.key as any)}
                style={{
                  padding: '1rem',
                  background: inputMethod === method.key
                    ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                    : 'white',
                  border: `2px solid ${inputMethod === method.key ? '#094d88' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: inputMethod === method.key ? 'white' : '#2d3748',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className={`fas fa-${method.icon}`} style={{ fontSize: '1.25rem' }}></i>
                <span>{method.label}</span>
              </button>
            ))}
          </div>

          {/* Input Fields - Dynamic based on selected method */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {inputMethod === 'manual' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Enter Your Content <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste or type your content here. You can include notes, textbook excerpts, or any material you want to convert into study aids..."
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    minHeight: '300px'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
            )}

            {inputMethod === 'topic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                  <select
                    value={topicData.subject}
                    onChange={(e) => setTopicData({ ...topicData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Grade <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select
                    value={topicData.grade}
                    onChange={(e) => setTopicData({ ...topicData, grade: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Topic/Chapter <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={topicData.topic}
                    onChange={(e) => setTopicData({ ...topicData, topic: e.target.value })}
                    placeholder="e.g., Photosynthesis, Quadratic Equations"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Specific Chapter/Section (Optional)
                  </label>
                  <input
                    type="text"
                    value={topicData.chapter}
                    onChange={(e) => setTopicData({ ...topicData, chapter: e.target.value })}
                    placeholder="e.g., Chapter 5, Section 2.3"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            )}

            {inputMethod === 'upload' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Upload File <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <div style={{
                    border: '2px dashed #e2e8f0',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#094d88'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#094d88', marginBottom: '1rem', display: 'block' }}></i>
                      <div style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                        PDF, DOC, DOCX, or TXT (Max 10MB)
                      </div>
                    </label>
                  </div>
                </div>
                {uploadedFile && (
                  <div style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-file" style={{ fontSize: '1.5rem', color: '#094d88' }}></i>
                      <div>
                        <div style={{ fontWeight: 600, color: '#2d3748' }}>{uploadedFile.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '1.25rem'
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

            {inputMethod === 'import' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Select Saved Plan <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Choose a saved lesson plan</option>
                    {savedPlans.map(plan => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <i className="fas fa-info-circle" style={{ fontSize: '1.5rem', color: '#094d88' }}></i>
                    <div style={{ fontWeight: 700, color: '#2d3748' }}>Import from Lesson Plans</div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096', lineHeight: 1.6 }}>
                    Import content from your previously created lesson plans, course plans, or other materials to automatically generate flash cards and revision aids.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (
              (inputMethod === 'manual' && !manualText) ||
              (inputMethod === 'topic' && (!topicData.subject || !topicData.grade || !topicData.topic)) ||
              (inputMethod === 'upload' && !uploadedFile) ||
              (inputMethod === 'import' && !selectedPlan)
            )}
            className="sign-in-btn"
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem 2rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: '12px',
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              border: 'none',
              color: 'white',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(9, 77, 136, 0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
            }}
          >
            <i className={`fas fa-${isGenerating ? 'spinner fa-spin' : 'magic'}`}></i>
            <span>{isGenerating ? 'Generating...' : 'Generate All Materials'}</span>
          </button>
        </div>

        {/* RIGHT PANEL - Output Preview */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              Preview & Download
            </h2>
            {isGenerated && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#2d3748',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#094d88';
                    e.currentTarget.style.color = '#094d88';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#2d3748';
                  }}
                >
                  <i className="fas fa-download"></i>
                  Download PDF
                </button>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <i className="fas fa-save"></i>
                  Save to Library
                </button>
              </div>
            )}
          </div>

          {/* Output Type Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #f7fafc',
            paddingBottom: '1rem'
          }}>
            {[
              { key: 'flashcards', icon: 'layer-group', label: 'Flash Cards' },
              { key: 'notes', icon: 'file-alt', label: 'Revision Notes' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: activeTab === tab.key
                    ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: activeTab === tab.key ? 'white' : '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background = '#f7fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <i className={`fas fa-${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Preview Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
            {!isGenerated ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#718096',
                textAlign: 'center'
              }}>
                <i className="fas fa-clipboard-list" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}></i>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 600 }}>
                  No Content Generated Yet
                </h3>
                <p style={{ margin: 0, fontSize: '1rem' }}>
                  Add your content and click "Generate All Materials" to create flash cards and revision notes
                </p>
              </div>
            ) : (
              <>
                {/* Flash Cards Tab */}
                {activeTab === 'flashcards' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '1.5rem', color: '#718096', fontSize: '0.95rem', fontWeight: 600 }}>
                      Card {currentCardIndex + 1} of {flashCards.length}
                    </div>

                    {/* Flash Card */}
                    <div
                      onClick={handleCardFlip}
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: '300px',
                        perspective: '1000px',
                        cursor: 'pointer',
                        marginBottom: '2rem'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                        transition: 'transform 0.6s'
                      }}>
                        {/* Front of card */}
                        <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                          borderRadius: '16px',
                          padding: '2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: '0 8px 30px rgba(9, 77, 136, 0.3)'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', opacity: 0.8 }}>
                            QUESTION
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>
                            {flashCards[currentCardIndex]?.front}
                          </div>
                          <div style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                            Click to flip
                          </div>
                        </div>

                        {/* Back of card */}
                        <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          background: 'white',
                          border: '3px solid #094d88',
                          borderRadius: '16px',
                          padding: '2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2d3748',
                          transform: 'rotateY(180deg)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: '#094d88' }}>
                            ANSWER
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 500, textAlign: 'center', lineHeight: 1.6 }}>
                            {flashCards[currentCardIndex]?.back}
                          </div>
                          <div style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.85rem', color: '#718096' }}>
                            Click to flip back
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <button
                        onClick={handlePrevCard}
                        disabled={currentCardIndex === 0}
                        style={{
                          padding: '1rem 2rem',
                          background: currentCardIndex === 0 ? '#f7fafc' : 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          color: currentCardIndex === 0 ? '#cbd5e0' : '#2d3748',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: currentCardIndex === 0 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          if (currentCardIndex !== 0) {
                            e.currentTarget.style.borderColor = '#094d88';
                            e.currentTarget.style.color = '#094d88';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          if (currentCardIndex !== 0) e.currentTarget.style.color = '#2d3748';
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>
                        Previous
                      </button>

                      <button
                        onClick={handleNextCard}
                        disabled={currentCardIndex === flashCards.length - 1}
                        style={{
                          padding: '1rem 2rem',
                          background: currentCardIndex === flashCards.length - 1 ? '#f7fafc' : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: currentCardIndex === flashCards.length - 1 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: currentCardIndex === flashCards.length - 1 ? 'none' : '0 4px 12px rgba(9, 77, 136, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          if (currentCardIndex !== flashCards.length - 1) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Next
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Revision Notes Tab */}
                {activeTab === 'notes' && (
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {revisionNotes.map((section, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '2rem',
                          padding: '1.5rem',
                          background: '#f7fafc',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0'
                        }}
                      >
                        <h3 style={{
                          margin: '0 0 1rem 0',
                          color: '#094d88',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                          }}></div>
                          {section.section}
                        </h3>
                        <ul style={{
                          margin: 0,
                          paddingLeft: '2rem',
                          listStyle: 'none'
                        }}>
                          {section.points.map((point, pIndex) => (
                            <li
                              key={pIndex}
                              style={{
                                marginBottom: '0.75rem',
                                color: '#2d3748',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                                position: 'relative',
                                paddingLeft: '1.5rem'
                              }}
                            >
                              <i className="fas fa-check-circle" style={{
                                position: 'absolute',
                                left: 0,
                                top: '0.25rem',
                                color: '#10ac8b',
                                fontSize: '0.9rem'
                              }}></i>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
