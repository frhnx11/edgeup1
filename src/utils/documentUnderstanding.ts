import { getClaudeChatResponse } from './claude';
import { documentKnowledgeBase } from './documentKnowledgeBase';

/**
 * Advanced Document Understanding System
 * Implements techniques similar to ChatGPT and Claude for document comprehension
 */

export interface DocumentUnderstandingResult {
  // Core understanding
  mainTheme: string;
  summary: string;
  
  // Structured extraction
  concepts: ConceptMap;
  relationships: Relationship[];
  timeline: ChronologicalEvent[];
  
  // Semantic understanding
  keyInsights: string[];
  questions: string[];
  conclusions: string[];
  
  // Contextual information
  context: {
    domain: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    documentType: string;
    targetAudience: string;
  };
  
  // Actionable outputs
  studyNotes: StudyNote[];
  practiceQuestions: PracticeQuestion[];
}

export interface ConceptMap {
  primary: Concept[];
  secondary: Concept[];
  supporting: Concept[];
}

export interface Concept {
  name: string;
  definition: string;
  importance: 'critical' | 'important' | 'supporting';
  relatedConcepts: string[];
  examples: string[];
}

export interface Relationship {
  subject: string;
  predicate: string;
  object: string;
  context: string;
}

export interface ChronologicalEvent {
  date: string;
  event: string;
  significance: string;
}

export interface StudyNote {
  topic: string;
  content: string;
  keyPoints: string[];
  mnemonics?: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[];
}

/**
 * Main document understanding function that mimics ChatGPT/Claude's approach
 */
export async function understandDocument(
  content: string,
  fileName: string,
  options: {
    depth?: 'shallow' | 'normal' | 'deep';
    focusAreas?: string[];
    previousContext?: any;
  } = {}
): Promise<DocumentUnderstandingResult> {
  const { depth = 'normal', focusAreas = [], previousContext } = options;
  
  // Step 1: Initial document analysis
  const documentAnalysis = await analyzeDocumentStructure(content, fileName);
  
  // Step 2: Extract semantic chunks (similar to how ChatGPT processes)
  const semanticChunks = await extractSemanticChunks(content);
  
  // Step 3: Multi-pass understanding
  const understanding = await multiPassUnderstanding(semanticChunks, documentAnalysis, depth);
  
  // Step 4: Generate actionable outputs
  const outputs = await generateActionableOutputs(understanding, focusAreas);
  
  return {
    ...understanding,
    ...outputs
  };
}

/**
 * Analyzes document structure and metadata
 */
async function analyzeDocumentStructure(content: string, fileName: string) {
  // Limit content to prevent token overflow
  const contentPreview = content.substring(0, 1500);
  
  const prompt = `Analyze this document's structure briefly.

Document: "${fileName}"
Content preview: ${contentPreview}

Provide a brief analysis as JSON:
{
  "documentType": "textbook|article|report|notes|other",
  "purpose": "educational|reference|analysis|narrative",
  "complexity": {
    "readingLevel": "elementary|intermediate|advanced|expert",
    "technicalDepth": 1-10
  },
  "domain": "field name",
  "targetAudience": "brief description"
}`;

  const response = await getClaudeChatResponse(
    [{ role: 'user', content: prompt }],
    'Document Analysis',
    'Structure Understanding'
  );
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      documentType: 'unknown',
      purpose: 'general',
      complexity: { readingLevel: 'intermediate', technicalDepth: 5 },
      domain: 'general',
      targetAudience: 'general readers'
    };
  }
}

/**
 * Extracts semantic chunks - this is key to how AI understands documents
 */
async function extractSemanticChunks(content: string): Promise<SemanticChunk[]> {
  const chunks: SemanticChunk[] = [];
  
  // Limit content to prevent memory issues with very large documents
  const maxContentLength = 100000; // ~100KB of text
  const workingContent = content.substring(0, maxContentLength);
  
  // Strategy 1: Paragraph-based chunking with overlap
  const paragraphs = workingContent.split(/\n\n+/);
  const chunkSize = 3; // paragraphs per chunk
  const overlap = 1; // overlapping paragraphs
  const maxChunks = 50; // Limit number of chunks
  
  for (let i = 0; i < Math.min(paragraphs.length, maxChunks * chunkSize); i += (chunkSize - overlap)) {
    const chunkParagraphs = paragraphs.slice(i, i + chunkSize);
    const chunkText = chunkParagraphs.join('\n\n');
    
    if (chunkText.trim().length > 50 && chunkText.length < 2000) {
      chunks.push({
        id: `chunk-${i}`,
        text: chunkText.substring(0, 1500), // Limit chunk size
        position: i,
        type: detectChunkType(chunkText),
        metadata: await extractChunkMetadata(chunkText.substring(0, 1000))
      });
    }
    
    if (chunks.length >= maxChunks) break;
  }
  
  // Strategy 2: Topic-based chunking - skip for very large documents
  if (content.length < 50000) {
    const topicChunks = await extractTopicBasedChunks(workingContent);
    chunks.push(...topicChunks.slice(0, 10)); // Limit topic chunks
  }
  
  return chunks;
}

interface SemanticChunk {
  id: string;
  text: string;
  position: number;
  type: 'definition' | 'example' | 'explanation' | 'narrative' | 'data';
  metadata: {
    topics: string[];
    entities: string[];
    concepts: string[];
    sentiment?: string;
  };
}

/**
 * Detects the type of content in a chunk
 */
function detectChunkType(text: string): SemanticChunk['type'] {
  const lower = text.toLowerCase();
  
  if (lower.includes('define') || lower.includes('means') || lower.includes('refers to')) {
    return 'definition';
  }
  if (lower.includes('for example') || lower.includes('such as') || lower.includes('instance')) {
    return 'example';
  }
  if (lower.includes('because') || lower.includes('therefore') || lower.includes('explains')) {
    return 'explanation';
  }
  if (lower.match(/\d{4}/) || lower.includes('data') || lower.includes('statistics')) {
    return 'data';
  }
  
  return 'narrative';
}

/**
 * Extracts metadata from a chunk
 */
async function extractChunkMetadata(text: string) {
  // Extract entities using regex patterns
  const entities = [];
  
  // People (capitalized names)
  const peoplePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
  const people = text.match(peoplePattern) || [];
  entities.push(...people);
  
  // Dates
  const datePattern = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}\b/g;
  const dates = text.match(datePattern) || [];
  entities.push(...dates);
  
  // Extract key concepts (capitalized terms, technical terms)
  const conceptPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const concepts = (text.match(conceptPattern) || [])
    .filter(c => c.length > 3 && !people.includes(c));
  
  return {
    topics: extractTopics(text),
    entities: [...new Set(entities)],
    concepts: [...new Set(concepts)]
  };
}

/**
 * Extracts topics from text
 */
function extractTopics(text: string): string[] {
  // Simple topic extraction based on noun phrases
  const topics = [];
  
  // Common topic indicators
  const topicIndicators = [
    /about (\w+(?:\s+\w+)*)/gi,
    /concerning (\w+(?:\s+\w+)*)/gi,
    /regarding (\w+(?:\s+\w+)*)/gi,
    /\b(\w+(?:\s+\w+)*) is/gi,
    /the (\w+(?:\s+\w+)*) of/gi
  ];
  
  topicIndicators.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 3) {
        topics.push(match[1].trim());
      }
    }
  });
  
  return [...new Set(topics)];
}

/**
 * Extract topic-based chunks (similar to Claude's approach)
 */
async function extractTopicBasedChunks(content: string): Promise<SemanticChunk[]> {
  // Limit content for API call
  const limitedContent = content.substring(0, 3000);
  
  const prompt = `Identify 3-5 distinct topic sections in this document excerpt. For each topic:
1. Extract a brief excerpt (max 200 chars)
2. Identify the main concept
3. Note the position

Content excerpt: ${limitedContent}

Return as JSON array with this format:
[{"text": "brief excerpt", "mainConcept": "concept name", "position": 0}]`;

  try {
    const response = await getClaudeChatResponse(
      [{ role: 'user', content: prompt }],
      'Topic Extraction',
      'Document Chunking'
    );
    
    const topics = JSON.parse(response);
    return topics.slice(0, 5).map((topic: any, index: number) => ({
      id: `topic-${index}`,
      text: (topic.text || '').substring(0, 500),
      position: topic.position || index,
      type: 'explanation',
      metadata: {
        topics: [topic.mainConcept || 'General'],
        entities: [],
        concepts: topic.relatedConcepts || []
      }
    }));
  } catch {
    return [];
  }
}

/**
 * Multi-pass understanding - the core of how AI comprehends documents
 */
async function multiPassUnderstanding(
  chunks: SemanticChunk[],
  documentAnalysis: any,
  depth: 'shallow' | 'normal' | 'deep'
): Promise<Partial<DocumentUnderstandingResult>> {
  // Pass 1: Extract main theme and summary
  const themeAndSummary = await extractThemeAndSummary(chunks);
  
  // Pass 2: Build concept map
  const concepts = await buildConceptMap(chunks, depth);
  
  // Pass 3: Extract relationships
  const relationships = await extractRelationships(chunks);
  
  // Pass 4: Build timeline if applicable
  const timeline = await extractTimeline(chunks);
  
  // Pass 5: Generate insights
  const insights = await generateInsights(chunks, concepts, relationships);
  
  // Pass 6: Formulate questions
  const questions = await formulateQuestions(concepts, insights);
  
  // Pass 7: Draw conclusions
  const conclusions = await drawConclusions(insights, relationships);
  
  return {
    mainTheme: themeAndSummary.theme,
    summary: themeAndSummary.summary,
    concepts,
    relationships,
    timeline,
    keyInsights: insights,
    questions,
    conclusions,
    context: {
      domain: documentAnalysis.domain || 'general',
      difficulty: documentAnalysis.complexity?.readingLevel || 'intermediate',
      documentType: documentAnalysis.documentType || 'document',
      targetAudience: documentAnalysis.targetAudience || 'general readers'
    }
  };
}

/**
 * Extract theme and summary - similar to ChatGPT's summarization
 */
async function extractThemeAndSummary(chunks: SemanticChunk[]) {
  // Limit text to prevent token overflow (approximately 3000 tokens)
  const maxCharsPerChunk = 500;
  const combinedText = chunks
    .slice(0, 5)
    .map(c => c.text.substring(0, maxCharsPerChunk))
    .join('\n\n');
  
  // Ensure we don't exceed token limits
  const truncatedText = combinedText.substring(0, 4000);
  
  const prompt = `Analyze this document excerpt and provide:
1. Main theme (one sentence)
2. Comprehensive summary (3-5 sentences)
3. Core message

Text excerpt: ${truncatedText}

Format as JSON:
{
  "theme": "main theme",
  "summary": "comprehensive summary",
  "coreMessage": "key takeaway"
}`;

  const response = await getClaudeChatResponse(
    [{ role: 'user', content: prompt }],
    'Theme Extraction',
    'Document Understanding'
  );
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      theme: 'Document analysis',
      summary: 'This document contains educational content requiring further analysis.'
    };
  }
}

/**
 * Build concept map - key to understanding document structure
 */
async function buildConceptMap(
  chunks: SemanticChunk[],
  depth: 'shallow' | 'normal' | 'deep'
): Promise<ConceptMap> {
  const allConcepts = new Set<string>();
  
  // Collect all concepts from chunks
  chunks.forEach(chunk => {
    chunk.metadata.concepts.forEach(concept => allConcepts.add(concept));
  });
  
  // Analyze concept importance and relationships
  const conceptAnalysis = await analyzeConcepts(
    Array.from(allConcepts),
    chunks,
    depth
  );
  
  return {
    primary: conceptAnalysis.filter(c => c.importance === 'critical'),
    secondary: conceptAnalysis.filter(c => c.importance === 'important'),
    supporting: conceptAnalysis.filter(c => c.importance === 'supporting')
  };
}

/**
 * Analyze concepts for importance and relationships
 */
async function analyzeConcepts(
  concepts: string[],
  chunks: SemanticChunk[],
  depth: 'shallow' | 'normal' | 'deep'
): Promise<Concept[]> {
  const analyzedConcepts: Concept[] = [];
  
  // Limit concepts to prevent token overflow
  const maxConcepts = depth === 'deep' ? 20 : depth === 'normal' ? 15 : 10;
  const limitedConcepts = concepts.slice(0, maxConcepts);
  
  // Process in smaller batches
  const batchSize = 5;
  
  for (let i = 0; i < limitedConcepts.length; i += batchSize) {
    const batch = limitedConcepts.slice(i, i + batchSize);
    
    const prompt = `Briefly analyze these ${batch.length} concepts:
${batch.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}

For each, provide a one-line analysis as JSON:
[{
  "name": "concept",
  "definition": "brief definition",
  "importance": "critical|important|supporting",
  "relatedConcepts": ["max 2 related"],
  "examples": ["one example"]
}]`;

    try {
      const response = await getClaudeChatResponse(
        [{ role: 'user', content: prompt }],
        'Concept Analysis',
        'Document Understanding'
      );
      
      const analyzed = JSON.parse(response);
      analyzedConcepts.push(...analyzed);
    } catch {
      // Fallback for failed analysis
      batch.forEach(concept => {
        analyzedConcepts.push({
          name: concept,
          definition: `${concept} as mentioned in the document`,
          importance: 'supporting',
          relatedConcepts: [],
          examples: []
        });
      });
    }
  }
  
  return analyzedConcepts;
}

/**
 * Extract relationships between concepts
 */
async function extractRelationships(chunks: SemanticChunk[]): Promise<Relationship[]> {
  const relationships: Relationship[] = [];
  
  // Look for relationship patterns in chunks
  const relationshipPatterns = [
    /(\w+(?:\s+\w+)*) (?:is|are) (?:a|an|the) (\w+(?:\s+\w+)*)/gi,
    /(\w+(?:\s+\w+)*) (?:causes|leads to|results in) (\w+(?:\s+\w+)*)/gi,
    /(\w+(?:\s+\w+)*) (?:depends on|relies on|requires) (\w+(?:\s+\w+)*)/gi,
    /(\w+(?:\s+\w+)*) (?:consists of|includes|contains) (\w+(?:\s+\w+)*)/gi
  ];
  
  chunks.forEach(chunk => {
    relationshipPatterns.forEach(pattern => {
      const matches = chunk.text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          relationships.push({
            subject: match[1].trim(),
            predicate: match[0].includes('is') ? 'is a' : 
                      match[0].includes('causes') ? 'causes' :
                      match[0].includes('depends') ? 'depends on' : 'includes',
            object: match[2].trim(),
            context: chunk.text.substring(
              Math.max(0, match.index! - 50),
              Math.min(chunk.text.length, match.index! + match[0].length + 50)
            )
          });
        }
      }
    });
  });
  
  return relationships;
}

/**
 * Extract timeline from document
 */
async function extractTimeline(chunks: SemanticChunk[]): Promise<ChronologicalEvent[]> {
  const events: ChronologicalEvent[] = [];
  
  // Find chunks with dates
  const dateChunks = chunks.filter(chunk => 
    chunk.metadata.entities.some(e => e.match(/\d{4}/))
  );
  
  if (dateChunks.length === 0) return events;
  
  // Extract events for each date
  for (const chunk of dateChunks) {
    const dates = chunk.metadata.entities.filter(e => e.match(/\d{4}/));
    
    for (const date of dates) {
      // Find context around date
      const dateIndex = chunk.text.indexOf(date);
      const context = chunk.text.substring(
        Math.max(0, dateIndex - 100),
        Math.min(chunk.text.length, dateIndex + 100)
      );
      
      events.push({
        date,
        event: context.replace(date, '').trim(),
        significance: 'Mentioned in document'
      });
    }
  }
  
  return events.sort((a, b) => {
    const dateA = parseInt(a.date.match(/\d{4}/)?.[0] || '0');
    const dateB = parseInt(b.date.match(/\d{4}/)?.[0] || '0');
    return dateA - dateB;
  });
}

/**
 * Generate insights from the document
 */
async function generateInsights(
  chunks: SemanticChunk[],
  concepts: ConceptMap,
  relationships: Relationship[]
): Promise<string[]> {
  const prompt = `Based on this document analysis, generate 5-7 key insights:

Main concepts: ${concepts.primary.map(c => c.name).join(', ')}
Key relationships: ${relationships.slice(0, 5).map(r => `${r.subject} ${r.predicate} ${r.object}`).join('; ')}

Document excerpts:
${chunks.slice(0, 3).map(c => c.text.substring(0, 200)).join('\n\n')}

Generate actionable, educational insights that help understanding.`;

  const response = await getClaudeChatResponse(
    [{ role: 'user', content: prompt }],
    'Insight Generation',
    'Document Understanding'
  );
  
  // Parse insights from response
  const insights = response.split('\n')
    .filter(line => line.trim().length > 10)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(insight => insight.length > 0);
  
  return insights.slice(0, 7);
}

/**
 * Formulate questions based on understanding
 */
async function formulateQuestions(
  concepts: ConceptMap,
  insights: string[]
): Promise<string[]> {
  const questions: string[] = [];
  
  // Generate questions for primary concepts
  concepts.primary.forEach(concept => {
    questions.push(`What is ${concept.name} and why is it important?`);
    questions.push(`How does ${concept.name} relate to other concepts in this document?`);
  });
  
  // Generate questions from insights
  insights.slice(0, 3).forEach(insight => {
    questions.push(`Based on the insight "${insight.substring(0, 50)}...", what are the implications?`);
  });
  
  return questions.slice(0, 5);
}

/**
 * Draw conclusions from the analysis
 */
async function drawConclusions(
  insights: string[],
  relationships: Relationship[]
): Promise<string[]> {
  const prompt = `Based on these insights and relationships, draw 3-5 meaningful conclusions:

Insights:
${insights.join('\n')}

Key relationships:
${relationships.slice(0, 10).map(r => `- ${r.subject} ${r.predicate} ${r.object}`).join('\n')}

Provide educational conclusions that synthesize the information.`;

  const response = await getClaudeChatResponse(
    [{ role: 'user', content: prompt }],
    'Conclusion Generation',
    'Document Understanding'
  );
  
  return response.split('\n')
    .filter(line => line.trim().length > 20)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 5);
}

/**
 * Generate actionable outputs for studying
 */
async function generateActionableOutputs(
  understanding: Partial<DocumentUnderstandingResult>,
  focusAreas: string[]
): Promise<{
  studyNotes: StudyNote[];
  practiceQuestions: PracticeQuestion[];
}> {
  const studyNotes = await generateStudyNotes(understanding, focusAreas);
  const practiceQuestions = await generatePracticeQuestions(understanding);
  
  return { studyNotes, practiceQuestions };
}

/**
 * Generate study notes
 */
async function generateStudyNotes(
  understanding: Partial<DocumentUnderstandingResult>,
  focusAreas: string[]
): Promise<StudyNote[]> {
  const notes: StudyNote[] = [];
  
  // Generate notes for primary concepts
  if (understanding.concepts?.primary) {
    for (const concept of understanding.concepts.primary) {
      const note: StudyNote = {
        topic: concept.name,
        content: concept.definition,
        keyPoints: [
          `Definition: ${concept.definition}`,
          `Importance: ${concept.importance}`,
          ...concept.examples.map(ex => `Example: ${ex}`)
        ]
      };
      
      // Generate mnemonic if applicable
      if (concept.name.length < 20) {
        note.mnemonics = generateMnemonic(concept.name);
      }
      
      notes.push(note);
    }
  }
  
  // Add notes for focus areas
  focusAreas.forEach(area => {
    const relatedInsights = understanding.keyInsights?.filter(insight => 
      insight.toLowerCase().includes(area.toLowerCase())
    ) || [];
    
    if (relatedInsights.length > 0) {
      notes.push({
        topic: area,
        content: `Key insights about ${area}`,
        keyPoints: relatedInsights
      });
    }
  });
  
  return notes;
}

/**
 * Generate mnemonic for concept
 */
function generateMnemonic(concept: string): string {
  const words = concept.split(' ');
  if (words.length > 1) {
    const acronym = words.map(w => w[0].toUpperCase()).join('');
    return `Remember: ${acronym} = ${concept}`;
  }
  return '';
}

/**
 * Generate practice questions
 */
async function generatePracticeQuestions(
  understanding: Partial<DocumentUnderstandingResult>
): Promise<PracticeQuestion[]> {
  const questions: PracticeQuestion[] = [];
  
  // Generate questions for each concept
  if (understanding.concepts?.primary) {
    for (const concept of understanding.concepts.primary) {
      questions.push({
        question: `Define ${concept.name} and explain its importance.`,
        answer: concept.definition,
        explanation: `${concept.name} is important because it is a critical concept in this subject.`,
        difficulty: 'medium',
        concepts: [concept.name]
      });
      
      if (concept.examples.length > 0) {
        questions.push({
          question: `Provide an example of ${concept.name} and explain how it demonstrates the concept.`,
          answer: concept.examples[0],
          explanation: `This example shows ${concept.name} in practice.`,
          difficulty: 'easy',
          concepts: [concept.name]
        });
      }
    }
  }
  
  // Generate relationship-based questions
  if (understanding.relationships) {
    understanding.relationships.slice(0, 3).forEach(rel => {
      questions.push({
        question: `Explain the relationship between ${rel.subject} and ${rel.object}.`,
        answer: `${rel.subject} ${rel.predicate} ${rel.object}`,
        explanation: rel.context,
        difficulty: 'hard',
        concepts: [rel.subject, rel.object]
      });
    });
  }
  
  return questions;
}

/**
 * Enhanced document Q&A - similar to ChatGPT's document chat
 */
export async function answerQuestionAboutDocument(
  question: string,
  documentId: string,
  conversationHistory: any[] = []
): Promise<string> {
  // Get document from knowledge base
  const searchResults = documentKnowledgeBase.search(question);
  
  if (searchResults.length === 0) {
    return "I couldn't find relevant information in the documents to answer your question.";
  }
  
  // Find most relevant chunks
  const relevantChunks = searchResults
    .flatMap(result => result.chunks)
    .slice(0, 5);
  
  // Build context from chunks
  const context = relevantChunks
    .map(chunk => chunk.content)
    .join('\n\n---\n\n');
  
  // Generate answer using context
  const prompt = `Based on the following document excerpts, answer the user's question.

Document Context:
${context}

Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User Question: ${question}

Provide a comprehensive answer based solely on the document content. If the information isn't in the document, say so.`;

  return await getClaudeChatResponse(
    [{ role: 'user', content: prompt }],
    'Document Q&A',
    'Question Answering'
  );
}

/**
 * Document comparison - useful for studying multiple documents
 */
export async function compareDocuments(
  docIds: string[],
  aspects: string[] = ['themes', 'concepts', 'conclusions']
): Promise<any> {
  // Implementation for comparing multiple documents
  // This would analyze similarities and differences between documents
  return {
    similarities: [],
    differences: [],
    complementaryAspects: []
  };
}