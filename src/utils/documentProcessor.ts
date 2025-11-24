/**
 * Document Processor - Simplified approach based on Claude's actual behavior
 * This file now acts as a bridge to the simpleDocumentProcessor
 */

import { SimpleDocumentProcessor, DocumentChat, handleDocumentUpload } from './simpleDocumentProcessor';
import type { SimpleDocument } from './simpleDocumentProcessor';
import { getClaudeChatResponse } from './claude';
import { 
  AIDocumentProcessor, 
  processAndStorePDF, 
  getStoredDocument, 
  getAllStoredDocuments,
  searchStoredDocuments,
  type AIProcessedDocument 
} from './aiDocumentProcessor';

// Re-export the simple processor for backward compatibility
export { SimpleDocumentProcessor, DocumentChat, handleDocumentUpload };
export type { SimpleDocument };

// Re-export AI document processor
export { 
  AIDocumentProcessor, 
  processAndStorePDF, 
  getStoredDocument, 
  getAllStoredDocuments,
  searchStoredDocuments 
};
export type { AIProcessedDocument };

// Legacy interface mappings for backward compatibility
export interface ExtractedDocument {
  text: string;
  fileName: string;
  fileType: string;
  extractedAt: Date;
  metadata?: {
    pageCount?: number;
    hasImages?: boolean;
    extractionMethod?: string;
    wordCount?: number;
  };
}

export interface ProcessedDocument {
  id: string;
  name: string;
  content: string;
  type: string;
  uploadedAt: Date;
  extractedAt: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  size: number; // File size in bytes
  metadata: {
    wordCount: number;
    extractionMethod: string;
    isComplete: boolean;
  };
  summary: string; // Made required with default empty string
  entities: any[]; // Made required with default empty array
  topics: string[]; // Made required with default empty array
  keyPoints: string[]; // Added for key points extraction
  errorMessage?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  documentId: string;
  documentName: string;
}

export interface MindMapNode {
  id: string;
  name: string;
  branches: MindMapNode[];
}

export interface StudyGuide {
  title: string;
  sections: Array<{
    title: string;
    content: string;
    keyPoints: string[];
  }>;
  totalReadTime: string; // Added for reading time estimate
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Document storage
const documentStore = new Map<string, ProcessedDocument>();

/**
 * Extract key points from text
 */
function extractKeyPoints(text: string): string[] {
  if (!text) return [];
  
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // Extract potential key points (sentences that likely contain important info)
  const keyPoints: string[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Look for sentences with keywords that indicate key points
    if (
      trimmed.length > 20 && // Not too short
      trimmed.length < 200 && // Not too long
      (
        trimmed.includes('important') ||
        trimmed.includes('key') ||
        trimmed.includes('main') ||
        trimmed.includes('significant') ||
        trimmed.includes('essential') ||
        trimmed.includes('critical') ||
        trimmed.includes('must') ||
        trimmed.includes('should') ||
        trimmed.includes('note') ||
        /^\d+\./.test(trimmed) || // Starts with a number
        /^[•\-\*]/.test(trimmed) // Starts with a bullet point
      )
    ) {
      keyPoints.push(trimmed);
    }
  });
  
  // If no key points found, take first 3 sentences as key points
  if (keyPoints.length === 0 && sentences.length > 0) {
    return sentences.slice(0, 3).map(s => s.trim());
  }
  
  // Limit to 5 key points
  return keyPoints.slice(0, 5);
}

/**
 * Extract text from a file - wrapper around SimpleDocumentProcessor
 */
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const document = await SimpleDocumentProcessor.processFile(file);
    return document.content;
  } catch (error) {
    console.error('Text extraction error:', error);
    throw error;
  }
}

/**
 * Process document - wrapper for backward compatibility
 */
export async function processDocument(file: File): Promise<ExtractedDocument> {
  try {
    const document = await SimpleDocumentProcessor.processFile(file);
    
    return {
      text: document.content,
      fileName: document.fileName,
      fileType: file.type || 'unknown',
      extractedAt: document.extractedAt,
      metadata: {
        wordCount: document.metadata.wordCount,
        extractionMethod: document.metadata.extractionMethod
      }
    };
  } catch (error) {
    console.error('Document processing error:', error);
    throw error;
  }
}

/**
 * Process and store document
 */
export async function processAndStoreDocument(file: File): Promise<ProcessedDocument> {
  try {
    // For PDFs, use AI processor for better results
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      console.log('Using AI processor for PDF:', file.name);
      const aiDoc = await processAndStorePDF(file);
      
      // Extract key points from summary
      const keyPoints = extractKeyPoints(aiDoc.summary || '');
      
      // Convert AI document to ProcessedDocument format
      const processedDoc: ProcessedDocument = {
        id: aiDoc.id,
        name: aiDoc.fileName,
        content: aiDoc.fullText || aiDoc.summary || '',
        type: file.type || 'application/pdf',
        uploadedAt: aiDoc.metadata.uploadedAt,
        extractedAt: aiDoc.metadata.processedAt,
        status: aiDoc.error ? 'error' : 'ready',
        size: file.size,
        metadata: {
          wordCount: aiDoc.metadata.wordCount || 0,
          extractionMethod: aiDoc.metadata.processingMethod,
          isComplete: !aiDoc.error
        },
        summary: aiDoc.summary || '',
        entities: aiDoc.detailedContent.entities || [],
        topics: aiDoc.detailedContent.mainTopics || [],
        keyPoints: keyPoints,
        errorMessage: aiDoc.error
      };
      
      // Store in regular document store too
      documentStore.set(processedDoc.id, processedDoc);
      
      return processedDoc;
    }
    
    // For non-PDF files, use simple processor
    const simpleDoc = await SimpleDocumentProcessor.processFile(file);
    
    // Generate summary
    const chat = new DocumentChat();
    chat.loadDocument(simpleDoc);
    let summary = '';
    
    try {
      summary = await chat.generateSummary();
    } catch (error) {
      console.error('Summary generation failed:', error);
    }
    
    // Extract key points from summary
    const keyPoints = extractKeyPoints(summary || simpleDoc.content.substring(0, 1000));
    
    const processedDoc: ProcessedDocument = {
      id: simpleDoc.id,
      name: simpleDoc.fileName,
      content: simpleDoc.content,
      type: file.type || 'unknown',
      uploadedAt: new Date(),
      extractedAt: simpleDoc.extractedAt,
      status: simpleDoc.metadata.isComplete ? 'ready' : 'error',
      size: file.size,
      metadata: {
        wordCount: simpleDoc.metadata.wordCount,
        extractionMethod: simpleDoc.metadata.extractionMethod,
        isComplete: simpleDoc.metadata.isComplete
      },
      summary: summary || '',
      entities: [],
      topics: [],
      keyPoints: keyPoints
    };
    
    // Store document
    documentStore.set(processedDoc.id, processedDoc);
    
    return processedDoc;
  } catch (error) {
    console.error('Process and store error:', error);
    return {
      id: `error-${Date.now()}`,
      name: file.name,
      content: '',
      type: file.type || 'unknown',
      uploadedAt: new Date(),
      extractedAt: new Date(),
      status: 'error',
      size: file.size,
      metadata: {
        wordCount: 0,
        extractionMethod: 'failed',
        isComplete: false
      },
      summary: '',
      entities: [],
      topics: [],
      keyPoints: [],
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Process document with AI (legacy support)
 */
export async function processDocumentWithAI(text: string, fileName: string): Promise<any> {
  try {
    const prompt = `Analyze this document and provide insights:
    
Document: "${fileName}"
Content: ${text.substring(0, 5000)}

Provide:
1. Main topics
2. Key concepts
3. Summary`;

    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Document Analysis',
      fileName
    );
    
    return { analysis: response };
  } catch (error) {
    console.error('AI processing error:', error);
    throw error;
  }
}

/**
 * Generate timeline from documents
 */
export async function generateTimelineFromDocuments(documents: ProcessedDocument[]): Promise<TimelineEvent[]> {
  if (documents.length === 0) return [];
  
  const combinedContent = documents
    .map(doc => `Document: ${doc.name}\n${doc.content.substring(0, 3000)}`)
    .join('\n\n---\n\n');
  
  const prompt = `Extract chronological events from these documents and create a timeline.

${combinedContent}

Return a JSON array of timeline events with this structure:
[
  {
    "date": "YYYY-MM-DD or descriptive date",
    "title": "Event title",
    "description": "Brief description",
    "documentName": "Source document name"
  }
]

Only include events with clear dates or time references.`;

  try {
    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Timeline Generation',
      'Multiple Documents'
    );
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const events = JSON.parse(jsonMatch[0]);
        return events.map((event: any, index: number) => ({
          id: `event-${Date.now()}-${index}`,
          date: event.date || 'Unknown Date',
          title: event.title || 'Untitled Event',
          description: event.description || '',
          documentId: documents[0].id,
          documentName: event.documentName || documents[0].name
        }));
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback: create a simple timeline from document summaries
        return documents.map((doc, index) => ({
          id: `event-${Date.now()}-${index}`,
          date: doc.uploadedAt.toISOString().split('T')[0],
          title: `Document: ${doc.name}`,
          description: doc.summary.substring(0, 200),
          documentId: doc.id,
          documentName: doc.name
        }));
      }
    }
    
    // If no JSON found, create basic timeline
    return documents.map((doc, index) => ({
      id: `event-${Date.now()}-${index}`,
      date: doc.uploadedAt.toISOString().split('T')[0],
      title: doc.name,
      description: doc.summary.substring(0, 200),
      documentId: doc.id,
      documentName: doc.name
    }));
  } catch (error) {
    console.error('Timeline generation error:', error);
    // Return basic timeline as fallback
    return documents.map((doc, index) => ({
      id: `event-${Date.now()}-${index}`,
      date: doc.uploadedAt.toISOString().split('T')[0],
      title: doc.name,
      description: 'Document uploaded',
      documentId: doc.id,
      documentName: doc.name
    }));
  }
}

/**
 * Create basic mind map from documents
 */
function createBasicMindMap(documents: ProcessedDocument[]): MindMapNode {
  const mainNode: MindMapNode = {
    id: `mindmap-${Date.now()}`,
    name: 'Document Knowledge',
    branches: []
  };
  
  // Create branches for each document
  documents.forEach((doc, index) => {
    const docBranch: MindMapNode = {
      id: `branch-${index}`,
      name: doc.name,
      branches: []
    };
    
    // Add topic branches
    if (doc.topics && doc.topics.length > 0) {
      doc.topics.slice(0, 5).forEach((topic, topicIndex) => {
        docBranch.branches.push({
          id: `topic-${index}-${topicIndex}`,
          name: topic,
          branches: []
        });
      });
    }
    
    // Add key points as branches if no topics
    if (docBranch.branches.length === 0 && doc.keyPoints && doc.keyPoints.length > 0) {
      doc.keyPoints.slice(0, 3).forEach((point, pointIndex) => {
        docBranch.branches.push({
          id: `point-${index}-${pointIndex}`,
          name: point.substring(0, 50) + (point.length > 50 ? '...' : ''),
          branches: []
        });
      });
    }
    
    mainNode.branches.push(docBranch);
  });
  
  return mainNode;
}

/**
 * Generate mind map from documents
 */
export async function generateMindMapFromDocuments(documents: ProcessedDocument[]): Promise<MindMapNode | null> {
  if (documents.length === 0) return null;
  
  const combinedContent = documents
    .map(doc => `Document: ${doc.name}\n${doc.content.substring(0, 3000)}`)
    .join('\n\n---\n\n');
  
  const prompt = `Create a hierarchical mind map structure from these documents.

${combinedContent}

Return a JSON object representing the mind map with this structure:
{
  "name": "Central topic",
  "branches": [
    {
      "name": "Main branch",
      "branches": [
        { "name": "Sub-topic", "branches": [] }
      ]
    }
  ]
}

Focus on key concepts and their relationships.`;

  try {
    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Mind Map Generation',
      'Multiple Documents'
    );
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const mindMap = JSON.parse(jsonMatch[0]);
        return {
          id: `mindmap-${Date.now()}`,
          name: mindMap.name || 'Knowledge Map',
          branches: Array.isArray(mindMap.branches) ? mindMap.branches : []
        };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback: create basic mind map from topics
        return createBasicMindMap(documents);
      }
    }
    
    // If no JSON found, create basic mind map
    return createBasicMindMap(documents);
  } catch (error) {
    console.error('Mind map generation error:', error);
    // Return basic mind map as fallback
    return createBasicMindMap(documents);
  }
}

/**
 * Create basic study guide from documents
 */
function createBasicStudyGuide(documents: ProcessedDocument[]): StudyGuide {
  const sections = documents.map(doc => ({
    title: doc.name,
    content: doc.summary || doc.content.substring(0, 500),
    keyPoints: doc.keyPoints || []
  }));
  
  const totalWords = sections.reduce((sum, section) => 
    sum + section.content.split(/\s+/).length, 0
  );
  const readTimeMinutes = Math.ceil(totalWords / 200);
  const totalReadTime = readTimeMinutes < 60 
    ? `${readTimeMinutes} minute${readTimeMinutes === 1 ? '' : 's'}`
    : `${Math.floor(readTimeMinutes / 60)} hour${Math.floor(readTimeMinutes / 60) === 1 ? '' : 's'} ${readTimeMinutes % 60} minutes`;
  
  return {
    title: 'Document Study Guide',
    sections,
    totalReadTime
  };
}

/**
 * Generate study guide from documents
 */
export async function generateStudyGuideFromDocuments(documents: ProcessedDocument[]): Promise<StudyGuide> {
  if (documents.length === 0) {
    return { title: 'Empty Study Guide', sections: [], totalReadTime: '0 minutes' };
  }
  
  const combinedContent = documents
    .map(doc => `Document: ${doc.name}\n${doc.content.substring(0, 3000)}`)
    .join('\n\n---\n\n');
  
  const prompt = `Create a comprehensive study guide from these documents.

${combinedContent}

Structure the guide with:
1. Clear sections for major topics
2. Key points for each section
3. Important concepts to remember

Format as a structured guide suitable for studying.`;

  try {
    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Study Guide Generation',
      'Multiple Documents'
    );
    
    // Parse the response into sections
    const sections = response.split(/\n#{1,3}\s+/).filter(s => s.trim());
    const parsedSections = sections.slice(1).map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0] || 'Section';
      const content = lines.slice(1).join('\n');
      const keyPoints = lines
        .filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
        .map(l => l.replace(/^[•\-*]\s*/, ''));
      
      return { title, content, keyPoints };
    });
    
    // Calculate total read time based on word count
    const totalWords = parsedSections.reduce((sum, section) => 
      sum + section.content.split(/\s+/).length, 0
    );
    const readTimeMinutes = Math.ceil(totalWords / 200); // Average reading speed: 200 words/min
    const totalReadTime = readTimeMinutes < 60 
      ? `${readTimeMinutes} minute${readTimeMinutes === 1 ? '' : 's'}`
      : `${Math.floor(readTimeMinutes / 60)} hour${Math.floor(readTimeMinutes / 60) === 1 ? '' : 's'} ${readTimeMinutes % 60} minutes`;
    
    return {
      title: sections[0] || 'Study Guide',
      sections: parsedSections,
      totalReadTime
    };
  } catch (error) {
    console.error('Study guide generation error:', error);
    // Fallback: create basic study guide
    return createBasicStudyGuide(documents);
  }
}

/**
 * Create basic quiz from documents
 */
function createBasicQuiz(documents: ProcessedDocument[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  documents.forEach((doc, docIndex) => {
    // Create a question about the document's main topic
    if (doc.topics && doc.topics.length > 0) {
      questions.push({
        id: `q-${Date.now()}-${docIndex}`,
        question: `What is one of the main topics covered in "${doc.name}"?`,
        options: [
          doc.topics[0] || 'Topic A',
          'Unrelated Topic 1',
          'Unrelated Topic 2',
          'Unrelated Topic 3'
        ],
        correctAnswer: 0,
        explanation: `The document "${doc.name}" covers the topic of ${doc.topics[0]}.`
      });
    }
    
    // Create a question from key points if available
    if (doc.keyPoints && doc.keyPoints.length > 0 && questions.length < 5) {
      const keyPoint = doc.keyPoints[0];
      questions.push({
        id: `q-${Date.now()}-${docIndex}-2`,
        question: `Which of the following is a key point from "${doc.name}"?`,
        options: [
          keyPoint.substring(0, 100),
          'This is not mentioned in the document',
          'This contradicts the document',
          'This is from a different source'
        ],
        correctAnswer: 0,
        explanation: `This key point is directly mentioned in the document.`
      });
    }
  });
  
  // Ensure at least one question
  if (questions.length === 0) {
    questions.push({
      id: `q-${Date.now()}-default`,
      question: 'What documents have been uploaded for study?',
      options: [
        documents.map(d => d.name).join(', '),
        'No documents uploaded',
        'Different documents',
        'Unknown documents'
      ],
      correctAnswer: 0,
      explanation: 'These are the documents you uploaded for study.'
    });
  }
  
  return questions.slice(0, 10); // Limit to 10 questions
}

/**
 * Generate quiz from documents
 */
export async function generateQuizFromDocuments(documents: ProcessedDocument[]): Promise<QuizQuestion[]> {
  if (documents.length === 0) return [];
  
  const combinedContent = documents
    .map(doc => `Document: ${doc.name}\n${doc.content.substring(0, 3000)}`)
    .join('\n\n---\n\n');
  
  const prompt = `Create multiple choice quiz questions from these documents.

${combinedContent}

Generate 5-10 questions. Return a JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions that test understanding, not just memorization.`;

  try {
    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Quiz Generation',
      'Multiple Documents'
    );
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0]);
        return questions.map((q: any, index: number) => ({
          id: `q-${Date.now()}-${index}`,
          question: q.question || 'Question not available',
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || 'No explanation provided'
        }));
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback: create basic quiz
        return createBasicQuiz(documents);
      }
    }
    
    // If no JSON found, create basic quiz
    return createBasicQuiz(documents);
  } catch (error) {
    console.error('Quiz generation error:', error);
    // Return basic quiz as fallback
    return createBasicQuiz(documents);
  }
}

/**
 * Search documents
 */
export function searchDocuments(query: string): ProcessedDocument[] {
  const results: ProcessedDocument[] = [];
  const queryLower = query.toLowerCase();
  
  documentStore.forEach(doc => {
    if (doc.content.toLowerCase().includes(queryLower) ||
        doc.name.toLowerCase().includes(queryLower) ||
        doc.summary?.toLowerCase().includes(queryLower)) {
      results.push(doc);
    }
  });
  
  return results;
}

/**
 * Get related documents
 */
export function getRelatedDocuments(documentId: string): ProcessedDocument[] {
  const doc = documentStore.get(documentId);
  if (!doc) return [];
  
  // Simple keyword-based relation
  const keywords = doc.content
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 5)
    .slice(0, 10);
  
  const related: ProcessedDocument[] = [];
  
  documentStore.forEach((otherDoc, otherId) => {
    if (otherId !== documentId) {
      const matches = keywords.filter(keyword => 
        otherDoc.content.toLowerCase().includes(keyword)
      ).length;
      
      if (matches >= 3) {
        related.push(otherDoc);
      }
    }
  });
  
  return related.slice(0, 5);
}

/**
 * Get documents by topic
 */
export function getDocumentsByTopic(topic: string): ProcessedDocument[] {
  const topicLower = topic.toLowerCase();
  return Array.from(documentStore.values()).filter(doc => 
    doc.topics?.some(t => t.toLowerCase().includes(topicLower)) ||
    doc.content.toLowerCase().includes(topicLower)
  );
}

/**
 * Get all entities
 */
export function getAllEntities(): any[] {
  const entities: any[] = [];
  documentStore.forEach(doc => {
    if (doc.entities) {
      entities.push(...doc.entities);
    }
  });
  return entities;
}

/**
 * Get knowledge timeline
 */
export function getKnowledgeTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  
  documentStore.forEach(doc => {
    // Create an upload event for each document
    events.push({
      id: `upload-${doc.id}`,
      date: doc.uploadedAt.toISOString().split('T')[0],
      title: `Document uploaded: ${doc.name}`,
      description: doc.summary || 'Document added to knowledge base',
      documentId: doc.id,
      documentName: doc.name
    });
  });
  
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get file type
 */
export function getFileType(file: File): string {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'PDF';
  if (type.includes('word') || name.match(/\.docx?$/)) return 'Word';
  if (type.startsWith('image/')) return 'Image';
  if (type === 'text/plain' || name.match(/\.(txt|md|rtf)$/)) return 'Text';
  
  return 'Unknown';
}

/**
 * Simple validation function
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` };
  }
  
  const supportedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'text/plain', 'image/png', 'image/jpeg', 'image/jpg'];
  const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.png', '.jpg', '.jpeg'];
  
  const hasValidType = supportedTypes.some(type => file.type.includes(type));
  const hasValidExtension = supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    return { valid: false, error: 'Unsupported file type. Please use PDF, DOCX, TXT, or image files.' };
  }
  
  return { valid: true };
}