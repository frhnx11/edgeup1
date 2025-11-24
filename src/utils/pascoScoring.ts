import type {
  PASCOTestState,
  LearnerProfile,
  Insights,
  Recommendations,
  InsightItem,
  LearningStrategy
} from '../types/pasco';

/**
 * Generates a comprehensive learner profile from PASCO test state
 */
export function generateLearnerProfile(testState: PASCOTestState): LearnerProfile {
  const { scores } = testState;

  // Calculate cognitive scores
  const cognitiveScores = scores.cognitive || {};
  const avgCognitive = Object.values(cognitiveScores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(cognitiveScores).length, 1) || 75;

  const fluidIQ = cognitiveScores.fluidIQ || 100 + (Math.random() * 20 - 10);
  const crystallizedIQ = cognitiveScores.crystallizedIQ || 105 + (Math.random() * 20 - 10);
  const overallIQ = Math.round((fluidIQ + crystallizedIQ) / 2);

  // Calculate personality scores
  const personalityScores = scores.personality || {};
  const varkScores = {
    visual: personalityScores.visual || 60 + Math.random() * 30,
    auditory: personalityScores.auditory || 50 + Math.random() * 30,
    reading: personalityScores.reading || 55 + Math.random() * 30,
    kinesthetic: personalityScores.kinesthetic || 45 + Math.random() * 30
  };

  const dominantStyle = Object.entries(varkScores).reduce((a, b) => b[1] > a[1] ? b : a)[0] as any;
  const highScores = Object.values(varkScores).filter(v => v > 70).length;

  // Calculate emotional scores
  const emotionalScores = scores.emotional || {};
  const eqComponents = {
    selfAwareness: emotionalScores.selfAwareness || 65 + Math.random() * 25,
    selfRegulation: emotionalScores.selfRegulation || 70 + Math.random() * 20,
    empathy: emotionalScores.empathy || 75 + Math.random() * 20,
    socialSkills: emotionalScores.socialSkills || 68 + Math.random() * 25,
    motivation: emotionalScores.motivation || 72 + Math.random() * 23
  };

  const overallEQ = Math.round(
    Object.values(eqComponents).reduce((a, b) => a + b, 0) / Object.keys(eqComponents).length
  );

  // Calculate psychological/wellness scores
  const psychScores = scores.psychological || {};
  const engagementScore = psychScores.engagement || 70 + Math.random() * 25;
  const clarityScore = psychScores.clarity || 65 + Math.random() * 30;
  const confidenceScore = psychScores.confidence || 72 + Math.random() * 23;
  const stressLevel = psychScores.stress || 30 + Math.random() * 40;

  const overallWellness = Math.round((engagementScore + clarityScore + confidenceScore + (100 - stressLevel)) / 4);

  // Determine stress indicators
  let stressLevelCategory: 'low' | 'moderate' | 'high' = 'moderate';
  if (stressLevel < 30) stressLevelCategory = 'low';
  else if (stressLevel > 60) stressLevelCategory = 'high';

  const primarySources: string[] = [];
  if (stressLevel > 50) {
    if (psychScores.academicPressure > 60) primarySources.push('Academic pressure');
    if (psychScores.socialConcerns > 60) primarySources.push('Social concerns');
    if (psychScores.timeManagement < 50) primarySources.push('Time management');
  }

  return {
    cognitive: {
      overallIQ,
      fluidIQ: Math.round(fluidIQ),
      crystallizedIQ: Math.round(crystallizedIQ),
      workingMemory: Math.round(cognitiveScores.workingMemory || 70 + Math.random() * 25),
      processingSpeed: Math.round(cognitiveScores.processingSpeed || 72 + Math.random() * 23),
      logicalReasoning: Math.round(cognitiveScores.logicalReasoning || 68 + Math.random() * 27),
      spatialReasoning: Math.round(cognitiveScores.spatialReasoning || 65 + Math.random() * 30),
      verbalComprehension: Math.round(cognitiveScores.verbalComprehension || 75 + Math.random() * 20)
    },
    personality: {
      vark: {
        visual: Math.round(varkScores.visual),
        auditory: Math.round(varkScores.auditory),
        reading: Math.round(varkScores.reading),
        kinesthetic: Math.round(varkScores.kinesthetic),
        dominantStyle,
        multimodal: highScores >= 2
      },
      grit: {
        overall: Math.round(personalityScores.grit || 75 + Math.random() * 20),
        perseverance: Math.round(personalityScores.perseverance || 78 + Math.random() * 18),
        passion: Math.round(personalityScores.passion || 72 + Math.random() * 23),
        resilienceScore: Math.round(personalityScores.resilience || 70 + Math.random() * 25)
      }
    },
    emotional: {
      overallEQ,
      selfAwareness: Math.round(eqComponents.selfAwareness),
      selfRegulation: Math.round(eqComponents.selfRegulation),
      empathy: Math.round(eqComponents.empathy),
      socialSkills: Math.round(eqComponents.socialSkills),
      motivation: Math.round(eqComponents.motivation),
      emotionalRegulation: overallEQ >= 75 ? 'strong' : overallEQ >= 60 ? 'developing' : 'needs_support',
      interpersonalEffectiveness: overallEQ >= 80 ? 'high' : overallEQ >= 65 ? 'moderate' : 'developing'
    },
    psychological: {
      overallWellness,
      engagement: {
        overall: Math.round(engagementScore),
        excitementLevel: Math.round(psychScores.excitement || 72 + Math.random() * 23)
      },
      clarity: {
        overall: Math.round(clarityScore),
        helpSeekingBehavior: clarityScore >= 75 ? 'proactive' : clarityScore >= 55 ? 'moderate' : 'reluctant'
      },
      confidence: {
        overall: Math.round(confidenceScore),
        calibration: Math.round(psychScores.calibration || 68 + Math.random() * 27)
      },
      stressIndicators: {
        level: stressLevelCategory,
        primarySources,
        copingEffectiveness: Math.round(psychScores.coping || 70 + Math.random() * 25)
      },
      needsCheck: {
        supportRecommended: stressLevel > 70 || overallWellness < 50,
        urgency: stressLevel > 80 ? 'high' : stressLevel > 65 ? 'moderate' : overallWellness < 40 ? 'moderate' : 'none'
      }
    },
    aptitude: {
      recommendedFields: generateRecommendedFields(overallIQ, personalityScores, emotionalScores)
    },
    skills: {
      studySkills: {
        timeManagement: Math.round(psychScores.timeManagement || 65 + Math.random() * 30),
        noteTaking: Math.round(psychScores.noteTaking || 70 + Math.random() * 25),
        informationRetention: Math.round(cognitiveScores.memory || 72 + Math.random() * 23),
        conceptApplication: Math.round(cognitiveScores.application || 68 + Math.random() * 27)
      }
    },
    timestamp: new Date()
  };
}

/**
 * Generates recommended career fields based on profile
 */
function generateRecommendedFields(iq: number, personality: any, emotional: any): Array<{field: string; score: number; reasoning: string}> {
  const fields = [
    {
      field: 'STEM (Science, Technology, Engineering, Math)',
      score: Math.min(95, Math.round(iq * 0.75 + (personality.logicalReasoning || 70) * 0.25)),
      reasoning: 'Strong analytical and logical reasoning abilities'
    },
    {
      field: 'Healthcare & Medicine',
      score: Math.min(95, Math.round((emotional.empathy || 70) * 0.4 + iq * 0.35 + (personality.conscientiousness || 70) * 0.25)),
      reasoning: 'High empathy combined with cognitive aptitude'
    },
    {
      field: 'Business & Entrepreneurship',
      score: Math.min(95, Math.round((emotional.socialSkills || 70) * 0.4 + (personality.grit || 70) * 0.35 + iq * 0.25)),
      reasoning: 'Strong social skills and perseverance'
    },
    {
      field: 'Arts & Creative Fields',
      score: Math.min(95, Math.round((personality.openness || 75) * 0.45 + (emotional.selfExpression || 70) * 0.35 + iq * 0.2)),
      reasoning: 'Creative thinking and emotional expressiveness'
    },
    {
      field: 'Education & Training',
      score: Math.min(95, Math.round((emotional.empathy || 70) * 0.35 + (emotional.socialSkills || 70) * 0.35 + iq * 0.3)),
      reasoning: 'Excellent interpersonal and communication abilities'
    }
  ];

  return fields.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Generates personalized insights and recommendations
 */
export function generateInsightsAndRecommendations(profile: LearnerProfile): {
  insights: Insights;
  recommendations: Recommendations;
} {
  const strengths: InsightItem[] = [];
  const growthAreas: InsightItem[] = [];

  // Analyze cognitive strengths/weaknesses
  const cognitiveMetrics = [
    { name: 'Working Memory', score: profile.cognitive.workingMemory },
    { name: 'Processing Speed', score: profile.cognitive.processingSpeed },
    { name: 'Logical Reasoning', score: profile.cognitive.logicalReasoning },
    { name: 'Spatial Reasoning', score: profile.cognitive.spatialReasoning },
    { name: 'Verbal Comprehension', score: profile.cognitive.verbalComprehension }
  ];

  cognitiveMetrics.forEach(metric => {
    if (metric.score >= 80) {
      strengths.push({
        dimension: metric.name,
        score: metric.score,
        description: `Exceptional ${metric.name.toLowerCase()} abilities`,
        actionableAdvice: `Leverage this strength in complex problem-solving tasks`
      });
    } else if (metric.score < 60) {
      growthAreas.push({
        dimension: metric.name,
        score: metric.score,
        description: `${metric.name} can be improved with targeted practice`,
        supportiveGuidance: `Focus on exercises that gradually build this skill`,
        resources: ['Practice exercises', 'Cognitive training apps', 'Tutoring support']
      });
    }
  });

  // Analyze emotional intelligence
  if (profile.emotional.overallEQ >= 75) {
    strengths.push({
      dimension: 'Emotional Intelligence',
      score: profile.emotional.overallEQ,
      description: 'Strong emotional awareness and regulation',
      actionableAdvice: 'Use your EQ to build collaborative relationships and lead teams'
    });
  } else if (profile.emotional.overallEQ < 60) {
    growthAreas.push({
      dimension: 'Emotional Intelligence',
      score: profile.emotional.overallEQ,
      description: 'Developing emotional awareness skills',
      supportiveGuidance: 'Practice mindfulness and reflect on emotional patterns',
      resources: ['Mindfulness exercises', 'Emotional literacy resources', 'Peer support groups']
    });
  }

  // Analyze grit and perseverance
  if (profile.personality.grit.overall >= 75) {
    strengths.push({
      dimension: 'Grit & Perseverance',
      score: profile.personality.grit.overall,
      description: 'Exceptional persistence in pursuing long-term goals',
      actionableAdvice: 'Take on challenging projects that require sustained effort'
    });
  }

  // Analyze study skills
  const avgStudySkill = Object.values(profile.skills.studySkills).reduce((a, b) => a + b, 0) / 4;
  if (avgStudySkill < 65) {
    growthAreas.push({
      dimension: 'Study Skills',
      score: Math.round(avgStudySkill),
      description: 'Opportunity to enhance study effectiveness',
      supportiveGuidance: 'Develop systematic approaches to learning',
      resources: ['Study skills workshops', 'Time management tools', 'Learning strategy guides']
    });
  }

  // Generate learning strategies
  const learningStrategies: LearningStrategy[] = [];

  // Based on VARK style
  const dominantStyle = profile.personality.vark.dominantStyle;
  learningStrategies.push({
    strategy: `${dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} Learning Focus`,
    rationale: `Your dominant learning style is ${dominantStyle}. Use ${
      dominantStyle === 'visual' ? 'diagrams, charts, and visual aids' :
      dominantStyle === 'auditory' ? 'lectures, discussions, and audio materials' :
      dominantStyle === 'reading' ? 'written notes, textbooks, and articles' :
      'hands-on activities and practical exercises'
    } to maximize retention.`,
    priority: 'high'
  });

  // Based on cognitive profile
  if (profile.cognitive.workingMemory < 70) {
    learningStrategies.push({
      strategy: 'Chunking & Spaced Repetition',
      rationale: 'Break information into smaller chunks and review regularly to strengthen memory retention',
      priority: 'high'
    });
  }

  // Based on emotional/wellness
  if (profile.psychological.stressIndicators.level === 'high') {
    learningStrategies.push({
      strategy: 'Stress Management Integration',
      rationale: 'Incorporate relaxation techniques and mindfulness into your study routine',
      priority: 'high'
    });
  }

  // Based on grit
  if (profile.personality.grit.overall >= 75) {
    learningStrategies.push({
      strategy: 'Challenge-Based Learning',
      rationale: 'Your high perseverance makes you well-suited for tackling difficult, long-term projects',
      priority: 'medium'
    });
  }

  // General strategies
  learningStrategies.push({
    strategy: 'Active Recall Practice',
    rationale: 'Test yourself regularly instead of passive review to strengthen long-term retention',
    priority: 'medium'
  });

  learningStrategies.push({
    strategy: 'Interleaved Practice',
    rationale: 'Mix different topics in study sessions to improve problem-solving flexibility',
    priority: 'low'
  });

  // Generate optimal study environment
  const studyEnvironment = {
    optimalSetting: profile.personality.vark.kinesthetic > 70 ? 'Active/Collaborative' :
                    profile.emotional.socialSkills > 75 ? 'Group Study' : 'Quiet Individual',
    timeOfDay: profile.psychological.engagement.overall > 75 ? 'Morning (Peak Energy)' : 'Afternoon/Evening',
    duration: profile.cognitive.processingSpeed > 75 ? '45-60 min blocks' : '25-30 min blocks',
    breakStrategy: profile.personality.grit.resilienceScore > 75 ? '5-10 min breaks' : 'Frequent 3-5 min breaks'
  };

  return {
    insights: {
      strengths,
      growthAreas,
      uniqueTraits: [
        `${dominantStyle} learner with ${profile.personality.vark.multimodal ? 'multimodal' : 'focused'} preferences`,
        `IQ: ${profile.cognitive.overallIQ} (${profile.cognitive.overallIQ >= 115 ? 'Above Average' : 'Average'})`,
        `EQ: ${profile.emotional.overallEQ}% (${profile.emotional.interpersonalEffectiveness} interpersonal effectiveness)`
      ]
    },
    recommendations: {
      learningStrategies,
      studyEnvironment,
      supportServices: profile.psychological.needsCheck.supportRecommended
        ? ['Academic counseling', 'Stress management resources', 'Peer support groups']
        : undefined
    }
  };
}
