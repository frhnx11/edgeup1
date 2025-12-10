import { useNavigate } from 'react-router-dom';
import AssessmentQuiz from '../../../components/upsc/common/AssessmentQuiz';
import { useUserTraitsStore, generatePersonalityReview } from '../../../store/useUserTraitsStore';
import { calculateNormalizedTraits } from '../../../config/quizTraitMapping';

export function QuizPage() {
  const navigate = useNavigate();
  const { setTraits, setPersonalityReview } = useUserTraitsStore();

  const handleComplete = (archetype: string, rawScores?: Record<string, number>) => {
    // Clear all previous cached data for fresh start
    localStorage.removeItem('goalData');
    localStorage.removeItem('user-traits-storage');

    // Always set stage as UPSC
    localStorage.setItem('userStage', 'upsc');

    // Calculate normalized traits from raw quiz scores
    const normalizedTraits = rawScores && Object.keys(rawScores).length > 0
      ? calculateNormalizedTraits(rawScores)
      : null;

    if (normalizedTraits) {
      // Store traits in Zustand store
      setTraits(normalizedTraits);

      // Generate and store personality review
      const review = generatePersonalityReview(normalizedTraits);
      setPersonalityReview(review);
    }

    localStorage.setItem('goalData', JSON.stringify({
      stage: 'upsc',
      completedAt: new Date().toISOString()
    }));

    // Navigate to personality review page if we have traits
    if (normalizedTraits) {
      navigate('/upsc/personality-review');
    } else {
      // Fallback to unified dashboard if no traits (e.g., skipped quiz)
      navigate('/upsc/student/dashboard');
    }
  };

  return <AssessmentQuiz onComplete={handleComplete} />;
}
