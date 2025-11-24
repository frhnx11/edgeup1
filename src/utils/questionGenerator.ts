import { MultimediaQuestion, varkQuestions, pascoQuestions, subjectQuestions } from './questionBank';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuestions(): MultimediaQuestion[] {
  // Get 4 VARK questions (multimedia enabled)
  const selectedVarkQuestions = shuffleArray(varkQuestions).slice(0, 4);
  
  // Get 7 PASCO questions (one from each category)
  const selectedPascoQuestions = pascoQuestions;
  
  // Get 7 subject questions
  const selectedSubjectQuestions = shuffleArray(subjectQuestions).slice(0, 7);

  // Combine all questions in the correct order
  return [
    ...selectedVarkQuestions,
    ...selectedPascoQuestions,
    ...selectedSubjectQuestions
  ];
}