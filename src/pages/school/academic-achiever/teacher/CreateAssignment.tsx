import { useState } from 'react';
import { callOpenAI } from '../../services/openai';
import { getAllSubjects, getUnitsForSubject, getTopicsForUnit } from '../../services/teacherCurriculumService';
import { parseAssignmentContent, validateQuestions } from '../../services/questionParser';
import { generateAssignmentPDFs } from '../../services/pdfGenerator';
import type { DeliveryMode, Question } from '../../types/assignment.types';

interface CreateAssignmentProps {
  onBack: () => void;
  onSave?: (assignment: any) => void;
}

type CreationMode = 'delivery-mode' | 'choice' | 'manual' | 'ai';

interface ManualFormData {
  title: string;
  className: string;
  dueDate: string;
  totalMarks: string;
  type: string;
  description: string;
}

interface AIFormData {
  subjectId: string;
  subjectName: string;
  grade: string;
  unitIds: string[];
  topicIds: string[];
  type: string;
  difficulty: string;
  totalMarks: string;
  duration: string;
  specialInstructions: string;
}

const CreateAssignment = ({ onBack, onSave }: CreateAssignmentProps) => {
  const [creationMode, setCreationMode] = useState<CreationMode>('delivery-mode');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('online');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);

  // Get curriculum data
  const subjects = getAllSubjects();

  const [manualForm, setManualForm] = useState<ManualFormData>({
    title: '',
    className: 'Grade 10A',
    dueDate: '',
    totalMarks: '',
    type: 'Homework',
    description: ''
  });

  const [aiForm, setAIForm] = useState<AIFormData>({
    subjectId: '',
    subjectName: '',
    grade: 'TN Board - 10th Std',
    unitIds: [],
    topicIds: [],
    type: 'Homework',
    difficulty: 'Medium',
    totalMarks: '100',
    duration: '60',
    specialInstructions: ''
  });

  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);

  // Get units and topics based on selected subject
  const selectedSubject = subjects.find(s => s.id === aiForm.subjectId);
  const units = aiForm.subjectId ? getUnitsForSubject(aiForm.subjectId) : [];
  const availableTopics = aiForm.unitIds.flatMap(unitId => {
    const topics = getTopicsForUnit(aiForm.subjectId, unitId);
    return topics.map(t => ({ ...t, unitId }));
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manual assignment created:', manualForm);
    if (onSave) {
      onSave({
        ...manualForm,
        deliveryMode: deliveryMode,
        subject: manualForm.className,
        duration: '60' // default duration
      });
    }
    onBack();
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Get selected topic details with learning objectives and key terms
      const selectedTopics = availableTopics.filter(t => aiForm.topicIds.includes(t.id));
      const topicDetails = selectedTopics
        .map(t => `- ${t.title}: ${t.description}\n  Learning Objectives: ${t.learningObjectives?.join(', ') || 'N/A'}\n  Key Terms: ${t.keyTerms?.join(', ') || 'N/A'}`)
        .join('\n\n');

      // Use user-specified number of questions for Quiz and Homework
      const totalMarks = parseInt(aiForm.totalMarks);
      const questionCount = (aiForm.type === 'Quiz' || aiForm.type === 'Homework') ? numberOfQuestions : 5;

      // Create STRICT type-specific prompt
      let typeSpecificInstructions = '';

      if (aiForm.type === 'Quiz') {
        typeSpecificInstructions = `Generate a QUIZ with EXACTLY ${questionCount} MULTIPLE CHOICE QUESTIONS ONLY:

STRICT REQUIREMENTS:
- Generate ONLY MCQ (Multiple Choice Questions) - NO short answer, NO long answer, NO theory questions
- Each question MUST have:
  * Question number (1, 2, 3...)
  * Clear question text
  * EXACTLY 4 options labeled A), B), C), D)
  * Marks allocation (distribute ${totalMarks} marks across ${questionCount} questions)
  * Correct answer clearly marked (e.g., "Answer: B")
- Questions should test understanding and application of concepts
- Vary difficulty level: ${Math.ceil(questionCount/3)} easy, ${Math.ceil(questionCount/3)} medium, ${Math.floor(questionCount/3)} hard
- All questions must be answerable by selecting one option from A/B/C/D

FORMAT EXAMPLE:
Question 1 (2 marks):
[Question text here]
A) [Option 1]
B) [Option 2]
C) [Option 3]
D) [Option 4]
Answer: [Correct option]`;

      } else if (aiForm.type === 'Homework') {
        typeSpecificInstructions = `Generate HOMEWORK with EXACTLY ${questionCount} QUESTIONS/PROBLEMS:

STRICT REQUIREMENTS:
- Generate practice problems and questions suitable for homework
- Types allowed: Numerical problems, Short answer questions (2-5 marks), Application questions
- Each question MUST have:
  * Question number (1, 2, 3...)
  * Complete problem statement or question
  * Marks allocation (distribute ${totalMarks} marks across ${questionCount} questions)
  * Expected answer or solution approach for teacher reference
- Focus on reinforcing concepts and practice
- Include a mix of problem types based on the subject

FORMAT EXAMPLE:
Question 1 (5 marks):
[Problem/Question here]
Expected Answer: [Solution approach or answer]`;

      } else if (aiForm.type === 'Project') {
        typeSpecificInstructions = `Generate a PROJECT assignment:

STRICT REQUIREMENTS:
- Clear project title related to the topics
- Detailed objectives (what students will learn/demonstrate)
- Specific deliverables (5-7 main components students must submit)
- Step-by-step implementation guidelines
- Evaluation rubric with marks breakdown totaling ${totalMarks} marks
- Timeline/deadline suggestions
- Required resources and references
- NO quiz questions, NO MCQs - only project description and guidelines`;

      } else if (aiForm.type === 'Essay') {
        typeSpecificInstructions = `Generate an ESSAY assignment:

STRICT REQUIREMENTS:
- Clear essay topic/question
- Word count requirement (approximately ${totalMarks * 40}-${totalMarks * 60} words)
- 3-5 key themes or arguments to address
- Structure guidelines (introduction, body paragraphs, conclusion)
- Evaluation criteria breakdown (content ${Math.floor(totalMarks*0.4)} marks, organization ${Math.floor(totalMarks*0.3)} marks, language ${Math.floor(totalMarks*0.3)} marks)
- NO quiz questions, NO MCQs - only essay prompt and guidelines`;

      } else if (aiForm.type === 'Lab Report' || aiForm.type === 'Research Paper') {
        typeSpecificInstructions = `Generate a ${aiForm.type.toUpperCase()} assignment:

STRICT REQUIREMENTS:
- Clear topic/experiment title
- Objectives and hypothesis (if applicable)
- Detailed methodology/procedure section
- Data collection and analysis requirements
- Report structure: Title, Abstract, Introduction, Methods, Results, Discussion, Conclusion
- Evaluation rubric totaling ${totalMarks} marks
- Required sections and formatting guidelines
- NO quiz questions, NO MCQs - only report guidelines`;
      }

      const prompt = `Create a complete ${aiForm.type} assignment for Tamil Nadu State Board 10th Standard students.

SUBJECT: ${aiForm.subjectName}
GRADE: ${aiForm.grade}
ASSIGNMENT TYPE: ${aiForm.type}
TOTAL MARKS: ${aiForm.totalMarks}
DURATION: ${aiForm.duration} minutes
DIFFICULTY LEVEL: ${aiForm.difficulty}

TOPICS TO COVER:
${topicDetails}

${aiForm.specialInstructions ? `SPECIAL INSTRUCTIONS: ${aiForm.specialInstructions}\n` : ''}

${typeSpecificInstructions}

IMPORTANT FORMAT REQUIREMENTS:
1. Start with assignment title
2. Include brief instructions for students (2-3 lines)
3. Generate the complete ${aiForm.type.toLowerCase()} content with actual questions/problems (NOT just descriptions)
4. For each question: clearly show question number, marks, and the actual question
5. End with a marking scheme summary

Generate the complete assignment content now:`;

      const systemPrompt = `You are an expert teacher creating actual assignment content for Tamil Nadu State Board 10th Standard.

CRITICAL INSTRUCTIONS:
- Generate REAL questions, problems, or content - not just instructions or summaries
- Make questions directly related to the specific topics provided
- Include answer keys or expected responses for teachers
- Use TN Board exam pattern and terminology
- Ensure questions test the learning objectives mentioned
- Be specific and detailed - generate complete, ready-to-use content`;

      const response = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      // Parse questions for online mode
      let questions: Question[] = [];
      if (deliveryMode === 'online') {
        questions = parseAssignmentContent(response, aiForm.type);
        const validation = validateQuestions(questions);

        if (!validation.valid) {
          console.warn('Question parsing issues:', validation.errors);
          // Still allow but notify
          alert(`Generated assignment, but found ${validation.errors.length} parsing issues. You may need to review the questions.`);
        }

        setParsedQuestions(questions);
      }

      // Generate PDFs for offline mode
      if (deliveryMode === 'offline' && questions.length === 0) {
        // If no questions parsed (offline), parse anyway for PDF generation
        questions = parseAssignmentContent(response, aiForm.type);
        setParsedQuestions(questions);
      }

      setGeneratedContent({
        title: `${aiForm.subjectName} - ${selectedTopics.map(t => t.title).slice(0, 2).join(' & ')}`,
        content: response,
        subject: aiForm.subjectName,
        grade: aiForm.grade,
        type: aiForm.type,
        totalMarks: aiForm.totalMarks,
        topicsCovered: selectedTopics.length,
        duration: aiForm.duration,
        questions: questions.length > 0 ? questions : undefined
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
      // Generate PDFs if offline mode
      if (deliveryMode === 'offline' && parsedQuestions.length > 0) {
        const assignmentData = {
          id: Date.now().toString(),
          title: generatedContent.title,
          subject: generatedContent.subject,
          classGrade: aiForm.grade,
          className: aiForm.grade,
          deliveryMode: 'offline' as const,
          type: aiForm.type,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalMarks: parseInt(aiForm.totalMarks),
          duration: parseInt(aiForm.duration),
          status: 'draft' as const,
          description: generatedContent.content,
          createdBy: 'Teacher',
          createdAt: new Date().toISOString(),
          totalStudents: 0,
          submitted: 0
        };

        generateAssignmentPDFs(assignmentData as any, parsedQuestions);
        alert('PDFs generated! Check your downloads folder for the question paper and answer key.');
      }

      // Save assignment
      onSave({
        title: generatedContent.title,
        subject: generatedContent.subject,
        className: aiForm.grade,
        type: aiForm.type,
        totalMarks: aiForm.totalMarks,
        duration: aiForm.duration,
        deliveryMode: deliveryMode,
        questions: parsedQuestions.length > 0 ? parsedQuestions : undefined,
        description: generatedContent.content,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    onBack();
  };

  // Delivery Mode Selection Screen
  if (creationMode === 'delivery-mode') {
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
            <i className="fas fa-clipboard-list" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
            Choose Assignment Delivery Mode
          </h1>
          <p style={{ margin: 0, color: '#718096', fontSize: '1.1rem' }}>
            How will students complete this assignment?
          </p>
        </div>

        {/* Delivery Mode Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Online Assignment Card */}
          <div
            onClick={() => {
              setDeliveryMode('online');
              setCreationMode('choice');
            }}
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
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10ac8b 0%, #094d88 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto'
            }}>
              <i className="fas fa-laptop" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              Online Assignment
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>
              Students take the assignment interactively in the browser
            </p>
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', padding: '0 1rem', color: '#718096', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Auto-graded MCQ questions
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Instant feedback for students
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Auto-save progress
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                Digital submission tracking
              </li>
            </ul>
            <div style={{
              padding: '1rem',
              background: '#dcfce7',
              borderRadius: '12px',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d', fontWeight: 600 }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
                Best for quizzes and homework
              </p>
            </div>
          </div>

          {/* Offline Assignment Card */}
          <div
            onClick={() => {
              setDeliveryMode('offline');
              setCreationMode('choice');
            }}
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
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.2)';
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
              <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              Offline Assignment (PDF)
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>
              Generate printable PDF for paper-based assignments
            </p>
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', padding: '0 1rem', color: '#718096', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#667eea', marginRight: '0.5rem' }}></i>
                Printable question paper
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#667eea', marginRight: '0.5rem' }}></i>
                Separate teacher answer key
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#667eea', marginRight: '0.5rem' }}></i>
                School branding included
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#667eea', marginRight: '0.5rem' }}></i>
                Traditional classroom format
              </li>
            </ul>
            <div style={{
              padding: '1rem',
              background: '#e0e7ff',
              borderRadius: '12px',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4338ca', fontWeight: 600 }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
                Best for essays and projects
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Subject Dropdown */}
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                  <i className="fas fa-book" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Subject *
                </label>
                <select
                  value={aiForm.subjectId}
                  onChange={(e) => {
                    const subject = subjects.find(s => s.id === e.target.value);
                    setAIForm({
                      ...aiForm,
                      subjectId: e.target.value,
                      subjectName: subject?.name || '',
                      grade: subject?.code || 'TN Board - 10th Std',
                      unitIds: [],
                      topicIds: []
                    });
                  }}
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
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade (Auto-filled) */}
              {aiForm.subjectId && (
                <div style={{
                  background: '#f7fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0'
                }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
                    Grade/Class
                  </p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#2d3748', fontWeight: 600 }}>
                    <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                    {aiForm.grade} - 10th Standard
                  </p>
                </div>
              )}

              {/* Units Selection */}
              {aiForm.subjectId && units.length > 0 && (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                    <i className="fas fa-book-open" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Select Units/Chapters *
                  </label>
                  <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '150px', overflow: 'auto', padding: '0.5rem', background: '#f7fafc', borderRadius: '8px' }}>
                    {units.map(unit => (
                      <label
                        key={unit.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: aiForm.unitIds.includes(unit.id) ? '#e0f2fe' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: aiForm.unitIds.includes(unit.id) ? '#094d88' : '#e2e8f0'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={aiForm.unitIds.includes(unit.id)}
                          onChange={(e) => {
                            const newUnitIds = e.target.checked
                              ? [...aiForm.unitIds, unit.id]
                              : aiForm.unitIds.filter(id => id !== unit.id);
                            setAIForm({...aiForm, unitIds: newUnitIds, topicIds: []});
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: 500 }}>
                          {unit.title} ({unit.topics.length} topics)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Selection */}
              {aiForm.unitIds.length > 0 && availableTopics.length > 0 && (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                    <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Select Topics *
                  </label>
                  <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '200px', overflow: 'auto', padding: '0.5rem', background: '#f7fafc', borderRadius: '8px' }}>
                    {availableTopics.map(topic => (
                      <label
                        key={topic.id}
                        style={{
                          display: 'flex',
                          alignItems: 'start',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: aiForm.topicIds.includes(topic.id) ? '#dcfce7' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: aiForm.topicIds.includes(topic.id) ? '#10ac8b' : '#e2e8f0'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={aiForm.topicIds.includes(topic.id)}
                          onChange={(e) => {
                            const newTopicIds = e.target.checked
                              ? [...aiForm.topicIds, topic.id]
                              : aiForm.topicIds.filter(id => id !== topic.id);
                            setAIForm({...aiForm, topicIds: newTopicIds});
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '0.125rem' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#2d3748', fontWeight: 600 }}>
                            {topic.title}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#718096' }}>
                            {topic.description}
                          </p>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '0.125rem 0.375rem',
                              background: topic.difficulty === 'easy' ? '#dcfce7' : topic.difficulty === 'medium' ? '#fef3c7' : '#fee2e2',
                              color: topic.difficulty === 'easy' ? '#15803d' : topic.difficulty === 'medium' ? '#a16207' : '#b91c1c',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>
                              {topic.difficulty}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Number of Questions - Only for Quiz and Homework */}
              {(aiForm.type === 'Quiz' || aiForm.type === 'Homework') && (
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                    <i className="fas fa-list-ol" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Number of Questions *
                  </label>
                  <input
                    type="number"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    placeholder={aiForm.type === 'Quiz' ? '10' : '8'}
                    min="5"
                    max={aiForm.type === 'Quiz' ? '50' : '30'}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#718096' }}>
                    {aiForm.type === 'Quiz' ? 'Recommended: 10-20 MCQ questions' : 'Recommended: 5-15 problems'}
                  </p>
                </div>
              )}

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
                disabled={isGenerating || aiForm.topicIds.length === 0}
                className="sign-in-btn"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '0.95rem',
                  opacity: (isGenerating || aiForm.topicIds.length === 0) ? 0.5 : 1,
                  cursor: (isGenerating || aiForm.topicIds.length === 0) ? 'not-allowed' : 'pointer'
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
