import { ClassQuestion, classQuestions } from './classQuestionBank';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateClassQuestions(count: number = 10): ClassQuestion[] {
  // Get the current topic from localStorage
  const topicData = localStorage.getItem('currentLearningTopic');
  
  // If no topic is set, generate a mixed set of questions
  if (!topicData) {
    // Get a balanced mix of questions from different subjects and difficulties
    const subjects = ['Geography', 'History', 'Science', 'Mathematics'];
    const questionsPerSubject = Math.ceil(count / subjects.length);
    const selectedQuestions: ClassQuestion[] = [];
    
    subjects.forEach(subject => {
      const subjectQuestions = classQuestions.filter(q => q.subject === subject);
      const shuffled = shuffleArray(subjectQuestions);
      selectedQuestions.push(...shuffled.slice(0, questionsPerSubject));
    });
    
    return shuffleArray(selectedQuestions).slice(0, count);
  }

  const { subject, topic } = JSON.parse(topicData);
  
  // Filter questions based on the current topic
  const topicQuestions = classQuestions.filter(q => 
    q.subject === subject && q.topic === topic
  );

  // If we don't have enough questions for the topic, pad with other questions from the same subject
  if (topicQuestions.length < count) {
    const subjectQuestions = classQuestions.filter(q => 
      q.subject === subject && q.topic !== topic
    );
    
    // Ensure a good mix of difficulties
    const selectedTopicQuestions = shuffleArray(topicQuestions);
    const additionalQuestions = shuffleArray(subjectQuestions)
      .slice(0, count - topicQuestions.length);

    return shuffleArray([...selectedTopicQuestions, ...additionalQuestions]);
  }

  return shuffleArray(topicQuestions).slice(0, count);
}