// Career Matching Algorithm Service
import type { AssessmentAnswer, AssessmentResults, CareerMatch, StreamRecommendation, InterestCategory, AptitudeCategory } from '../types/assessment';
import { careerPathsData } from '../data/careerData';
import { emergingCareersData } from '../data/emergingCareers';
import { interestQuestions, allAptitudeQuestions } from '../data/assessmentQuestions';

// Combine all career data
const allCareers = { ...careerPathsData, ...emergingCareersData };

/**
 * Calculate assessment results from answers
 */
export const calculateAssessmentResults = (answers: AssessmentAnswer[]): AssessmentResults => {
  const interestScores: { [key in InterestCategory]: number } = {
    'problem-solving': 0,
    'creativity': 0,
    'people': 0,
    'data': 0,
    'technical': 0,
    'research': 0,
    'business': 0,
    'helping': 0
  };

  const aptitudeScores: { [key in AptitudeCategory]: number } = {
    'logical': 0,
    'numerical': 0,
    'verbal': 0,
    'spatial': 0
  };

  let totalInterestScore = 0;
  let totalAptitudeScore = 0;

  // Calculate scores from answers
  answers.forEach(answer => {
    const question = [...interestQuestions, ...allAptitudeQuestions].find(q => q.id === answer.questionId);
    if (!question) return;

    if (question.category in interestScores) {
      interestScores[question.category as InterestCategory] += answer.score;
      totalInterestScore += answer.score;
    } else if (question.category in aptitudeScores) {
      aptitudeScores[question.category as AptitudeCategory] += answer.score;
      totalAptitudeScore += answer.score;
    }
  });

  // Normalize scores to 0-100
  Object.keys(interestScores).forEach(key => {
    interestScores[key as InterestCategory] = Math.round(
      (interestScores[key as InterestCategory] / (totalInterestScore || 1)) * 100
    );
  });

  Object.keys(aptitudeScores).forEach(key => {
    aptitudeScores[key as AptitudeCategory] = Math.round(
      (aptitudeScores[key as AptitudeCategory] / (totalAptitudeScore || 1)) * 100
    );
  });

  const overallScore = Math.round((totalInterestScore + totalAptitudeScore) / 2);

  return {
    interestScores,
    aptitudeScores,
    overallScore,
    completedAt: new Date().toISOString()
  };
};

/**
 * Match careers based on assessment results
 */
export const matchCareers = (
  answers: AssessmentAnswer[],
  results: AssessmentResults
): CareerMatch[] => {
  const careerMatches: CareerMatch[] = [];

  // Calculate match percentage for each career
  Object.values(allCareers).forEach(career => {
    let matchScore = 0;
    let maxScore = 0;

    // Calculate weighted score based on answers
    answers.forEach(answer => {
      const question = interestQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      const option = question.options.find(o => o.id === answer.optionId);
      if (option && option.careerWeights && option.careerWeights[career.id]) {
        matchScore += option.careerWeights[career.id];
        maxScore += 5; // Max weight per question
      }
    });

    // Calculate match percentage (0-100)
    let matchPercentage = maxScore > 0 ? Math.round((matchScore / maxScore) * 100) : 0;

    // Boost based on aptitude scores
    const aptitudeBoost = Math.round(
      (results.aptitudeScores.logical + results.aptitudeScores.numerical) / 10
    );
    matchPercentage = Math.min(100, matchPercentage + aptitudeBoost);

    // Ensure minimum match for careers
    if (matchPercentage === 0) {
      matchPercentage = Math.floor(Math.random() * 30) + 40; // 40-70% for unmatched
    }

    // Determine recommended stream
    let recommendedStream: 'Science' | 'Commerce' | 'Arts' = 'Science';
    if (career.roadmap.class11_12.some(subject =>
      ['Accounts', 'Business', 'Economics'].includes(subject)
    )) {
      recommendedStream = 'Commerce';
    } else if (career.roadmap.class11_12.some(subject =>
      ['Literature', 'Psychology', 'Sociology'].includes(subject)
    )) {
      recommendedStream = 'Arts';
    }

    // Determine strengths based on high interest scores
    const strengths: string[] = [];
    Object.entries(results.interestScores).forEach(([category, score]) => {
      if (score > 70) {
        strengths.push(category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
      }
    });

    // Determine areas to improve based on low aptitude scores
    const areasToImprove: string[] = [];
    Object.entries(results.aptitudeScores).forEach(([category, score]) => {
      if (score < 50) {
        areasToImprove.push(category.charAt(0).toUpperCase() + category.slice(1) + ' skills');
      }
    });

    careerMatches.push({
      careerId: career.id,
      careerName: career.name,
      matchPercentage,
      icon: career.icon,
      color: career.color,
      tagline: career.tagline,
      recommendedStream,
      strengths: strengths.length > 0 ? strengths.slice(0, 3) : ['Problem-solving', 'Analytical thinking'],
      areasToImprove: areasToImprove.length > 0 ? areasToImprove.slice(0, 2) : []
    });
  });

  // Sort by match percentage (descending)
  return careerMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Get stream recommendations based on results
 */
export const getStreamRecommendations = (
  results: AssessmentResults,
  topCareers: CareerMatch[]
): StreamRecommendation[] => {
  const streamScores = {
    Science: 0,
    Commerce: 0,
    Arts: 0
  };

  // Calculate stream preference based on top careers
  topCareers.slice(0, 5).forEach((career, index) => {
    const weight = 5 - index; // Higher weight for top matches
    streamScores[career.recommendedStream] += career.matchPercentage * weight;
  });

  // Add interest-based bonuses
  if (results.interestScores.technical > 70 || results.interestScores['problem-solving'] > 70) {
    streamScores.Science += 500;
  }
  if (results.interestScores.business > 70 || results.interestScores.data > 70) {
    streamScores.Commerce += 500;
  }
  if (results.interestScores.creativity > 70 || results.interestScores.people > 70) {
    streamScores.Arts += 400;
  }

  // Create recommendations
  const recommendations: StreamRecommendation[] = [
    {
      stream: 'Science',
      matchPercentage: Math.min(100, Math.round((streamScores.Science / 3000) * 100)),
      reasoning: [
        'Strong analytical and problem-solving abilities',
        'Interest in technical and scientific subjects',
        'Suitable for engineering, medical, and research careers'
      ],
      suitableCareers: topCareers
        .filter(c => c.recommendedStream === 'Science')
        .slice(0, 4)
        .map(c => c.careerName),
      requiredSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology/Computer Science']
    },
    {
      stream: 'Commerce',
      matchPercentage: Math.min(100, Math.round((streamScores.Commerce / 3000) * 100)),
      reasoning: [
        'Interest in business and financial concepts',
        'Good analytical and numerical skills',
        'Suitable for business, finance, and management careers'
      ],
      suitableCareers: topCareers
        .filter(c => c.recommendedStream === 'Commerce')
        .slice(0, 4)
        .map(c => c.careerName),
      requiredSubjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics']
    },
    {
      stream: 'Arts',
      matchPercentage: Math.min(100, Math.round((streamScores.Arts / 3000) * 100)),
      reasoning: [
        'Creative and people-oriented interests',
        'Strong communication and expression skills',
        'Suitable for humanities, design, and social science careers'
      ],
      suitableCareers: topCareers
        .filter(c => c.recommendedStream === 'Arts')
        .slice(0, 4)
        .map(c => c.careerName),
      requiredSubjects: ['English', 'History', 'Political Science', 'Psychology/Economics']
    }
  ];

  // Sort by match percentage
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Save assessment results to localStorage
 */
export const saveAssessmentResults = (answers: AssessmentAnswer[], results: AssessmentResults) => {
  try {
    localStorage.setItem('career_assessment_answers', JSON.stringify(answers));
    localStorage.setItem('career_assessment_results', JSON.stringify(results));
    localStorage.setItem('career_assessment_completed', 'true');
  } catch (error) {
    console.error('Failed to save assessment results:', error);
  }
};

/**
 * Load assessment results from localStorage
 */
export const loadAssessmentResults = (): { answers: AssessmentAnswer[]; results: AssessmentResults } | null => {
  try {
    const answersStr = localStorage.getItem('career_assessment_answers');
    const resultsStr = localStorage.getItem('career_assessment_results');

    if (!answersStr || !resultsStr) return null;

    return {
      answers: JSON.parse(answersStr),
      results: JSON.parse(resultsStr)
    };
  } catch (error) {
    console.error('Failed to load assessment results:', error);
    return null;
  }
};

/**
 * Check if assessment is completed
 */
export const isAssessmentCompleted = (): boolean => {
  return localStorage.getItem('career_assessment_completed') === 'true';
};

/**
 * Clear assessment results
 */
export const clearAssessmentResults = () => {
  localStorage.removeItem('career_assessment_answers');
  localStorage.removeItem('career_assessment_results');
  localStorage.removeItem('career_assessment_completed');
};
