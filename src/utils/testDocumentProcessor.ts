/**
 * Test suite for document processor functionality
 * This file contains tests to validate all features work correctly
 */

import { 
  validateFile, 
  extractTextFromFile, 
  processDocumentWithAI,
  generateTimelineFromDocuments,
  generateMindMapFromDocuments,
  generateStudyGuideFromDocuments,
  generateQuizFromDocuments,
  type ProcessedDocument 
} from './documentProcessor';

// Test file validation
export function testFileValidation() {
  console.log('Testing file validation...');
  
  // Test valid file
  const validFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
  const validResult = validateFile(validFile);
  console.log('Valid file test:', validResult.valid ? '✅ PASS' : '❌ FAIL');
  
  // Test oversized file
  const largeFile = new File([new ArrayBuffer(60 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
  const largeResult = validateFile(largeFile);
  console.log('Large file test:', !largeResult.valid ? '✅ PASS' : '❌ FAIL');
  
  // Test invalid file type
  const invalidFile = new File(['content'], 'test.xyz', { type: 'application/xyz' });
  const invalidResult = validateFile(invalidFile);
  console.log('Invalid file test:', !invalidResult.valid ? '✅ PASS' : '❌ FAIL');
}

// Test text extraction
export async function testTextExtraction() {
  console.log('Testing text extraction...');
  
  try {
    // Test plain text file
    const textFile = new File(['Hello world, this is a test document.'], 'test.txt', { type: 'text/plain' });
    const extractedText = await extractTextFromFile(textFile);
    console.log('Text extraction test:', extractedText.includes('Hello world') ? '✅ PASS' : '❌ FAIL');
    console.log('Extracted:', extractedText.substring(0, 50) + '...');
  } catch (error) {
    console.log('Text extraction test: ❌ FAIL', error);
  }
}

// Test AI processing
export async function testAIProcessing() {
  console.log('Testing AI document processing...');
  
  try {
    const testContent = `
    Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines. 
    It has become an essential part of the technology industry. Machine learning, natural language processing, 
    and computer vision are key components of AI. The history of AI dates back to the 1950s when Alan Turing 
    proposed the Turing Test. Today, AI is used in various applications including healthcare, finance, and 
    autonomous vehicles.
    `;
    
    const result = await processDocumentWithAI(testContent, 'test-ai-document.txt');
    
    console.log('AI Processing Results:');
    console.log('Summary:', result.summary ? '✅ Generated' : '❌ Missing');
    console.log('Key Points:', result.keyPoints.length > 0 ? `✅ ${result.keyPoints.length} points` : '❌ None');
    console.log('Topics:', result.topics.length > 0 ? `✅ ${result.topics.length} topics` : '❌ None');
    console.log('Entities:', result.entities.length > 0 ? `✅ ${result.entities.length} entities` : '❌ None');
    
    // Log details
    console.log('\nDetails:');
    console.log('Summary:', result.summary);
    console.log('Topics:', result.topics);
    console.log('Key Points:', result.keyPoints.slice(0, 3));
    
  } catch (error) {
    console.log('AI Processing test: ❌ FAIL', error);
  }
}

// Test timeline generation
export async function testTimelineGeneration() {
  console.log('Testing timeline generation...');
  
  try {
    const mockDocuments: ProcessedDocument[] = [
      {
        id: 'test-1',
        name: 'history.txt',
        type: 'txt',
        size: 1000,
        uploadDate: new Date(),
        content: `
        The World War II began in 1939 when Germany invaded Poland. 
        In 1941, the United States entered the war after Pearl Harbor attack. 
        The war ended in 1945 with the surrender of Japan. 
        The United Nations was established in 1945 to maintain world peace.
        `,
        summary: 'Document about World War II events',
        keyPoints: ['War began in 1939', 'US entered in 1941', 'War ended in 1945'],
        topics: ['World War II', 'History', 'United Nations'],
        entities: ['Germany', 'Poland', 'United States', 'Japan'],
        status: 'ready'
      }
    ];
    
    const timeline = await generateTimelineFromDocuments(mockDocuments);
    
    console.log('Timeline Generation:');
    console.log('Events generated:', timeline.length > 0 ? `✅ ${timeline.length} events` : '❌ None');
    
    if (timeline.length > 0) {
      console.log('\nTimeline Events:');
      timeline.forEach(event => {
        console.log(`- ${event.date}: ${event.title} (${event.importance})`);
      });
    }
    
  } catch (error) {
    console.log('Timeline generation test: ❌ FAIL', error);
  }
}

// Test mind map generation
export async function testMindMapGeneration() {
  console.log('Testing mind map generation...');
  
  try {
    const mockDocuments: ProcessedDocument[] = [
      {
        id: 'test-1',
        name: 'science.txt',
        type: 'txt',
        size: 1000,
        uploadDate: new Date(),
        content: 'Photosynthesis is the process by which plants convert sunlight into energy...',
        summary: 'Document about photosynthesis and plant biology',
        keyPoints: ['Light energy conversion', 'Chlorophyll role', 'Oxygen production'],
        topics: ['Photosynthesis', 'Plant Biology', 'Energy Conversion'],
        entities: ['Chlorophyll', 'Sunlight', 'Oxygen', 'Carbon Dioxide'],
        status: 'ready'
      }
    ];
    
    const mindMap = await generateMindMapFromDocuments(mockDocuments);
    
    console.log('Mind Map Generation:');
    console.log('Mind map created:', mindMap ? '✅ Success' : '❌ Failed');
    
    if (mindMap) {
      console.log('Central topic:', mindMap.central);
      console.log('Branches:', mindMap.branches.length);
      mindMap.branches.forEach(branch => {
        console.log(`- ${branch.title} (${branch.subbranches.length} subbranches)`);
      });
    }
    
  } catch (error) {
    console.log('Mind map generation test: ❌ FAIL', error);
  }
}

// Test study guide generation
export async function testStudyGuideGeneration() {
  console.log('Testing study guide generation...');
  
  try {
    const mockDocuments: ProcessedDocument[] = [
      {
        id: 'test-1',
        name: 'mathematics.txt',
        type: 'txt',
        size: 1000,
        uploadDate: new Date(),
        content: 'Calculus is a branch of mathematics that deals with rates of change and accumulation...',
        summary: 'Introduction to calculus concepts',
        keyPoints: ['Derivatives', 'Integrals', 'Limits', 'Applications'],
        topics: ['Calculus', 'Mathematics', 'Derivatives', 'Integrals'],
        entities: ['Newton', 'Leibniz', 'Functions', 'Graphs'],
        status: 'ready'
      }
    ];
    
    const studyGuide = await generateStudyGuideFromDocuments(mockDocuments);
    
    console.log('Study Guide Generation:');
    console.log('Study guide created:', studyGuide ? '✅ Success' : '❌ Failed');
    
    if (studyGuide) {
      console.log('Title:', studyGuide.title);
      console.log('Reading time:', studyGuide.totalReadTime);
      console.log('Difficulty:', studyGuide.difficulty);
      console.log('Sections:', studyGuide.sections.length);
      
      studyGuide.sections.forEach((section, index) => {
        console.log(`Section ${index + 1}: ${section.title}`);
        console.log(`- Key points: ${section.keyPoints.length}`);
        console.log(`- Examples: ${section.examples.length}`);
        console.log(`- Definitions: ${section.definitions.length}`);
      });
    }
    
  } catch (error) {
    console.log('Study guide generation test: ❌ FAIL', error);
  }
}

// Test quiz generation
export async function testQuizGeneration() {
  console.log('Testing quiz generation...');
  
  try {
    const mockDocuments: ProcessedDocument[] = [
      {
        id: 'test-1',
        name: 'physics.txt',
        type: 'txt',
        size: 1000,
        uploadDate: new Date(),
        content: 'Newton\'s laws of motion describe the relationship between forces and motion...',
        summary: 'Overview of Newton\'s laws of motion',
        keyPoints: ['First law - inertia', 'Second law - F=ma', 'Third law - action-reaction'],
        topics: ['Physics', 'Motion', 'Forces', 'Newton\'s Laws'],
        entities: ['Newton', 'Force', 'Mass', 'Acceleration'],
        status: 'ready'
      }
    ];
    
    const quiz = await generateQuizFromDocuments(mockDocuments);
    
    console.log('Quiz Generation:');
    console.log('Questions generated:', quiz.length > 0 ? `✅ ${quiz.length} questions` : '❌ None');
    
    if (quiz.length > 0) {
      console.log('\nQuiz Questions:');
      quiz.forEach((question, index) => {
        console.log(`Q${index + 1}: ${question.question.substring(0, 60)}...`);
        console.log(`Type: ${question.type}, Difficulty: ${question.difficulty}, Bloom's: ${question.bloomsLevel}`);
        if (question.options) {
          console.log(`Options: ${question.options.length}`);
        }
      });
    }
    
  } catch (error) {
    console.log('Quiz generation test: ❌ FAIL', error);
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🧪 Starting Document Processor Tests...\n');
  
  // Run tests sequentially to avoid API rate limits
  testFileValidation();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testTextExtraction();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testAIProcessing();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testTimelineGeneration();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testMindMapGeneration();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testStudyGuideGeneration();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testQuizGeneration();
  
  console.log('\n✅ All tests completed!');
}

// Export individual test functions for manual testing
export {
  testFileValidation,
  testTextExtraction,
  testAIProcessing,
  testTimelineGeneration,
  testMindMapGeneration,
  testStudyGuideGeneration,
  testQuizGeneration
};