import React, { useState } from 'react';
import './MentalHealthWellness.css';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

interface AssessmentQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

interface Assessment {
  id: string;
  name: string;
  fullName: string;
  description: string;
  questions: AssessmentQuestion[];
  scoringInfo: {
    minimal: string;
    mild: string;
    moderate: string;
    moderatelySevere?: string;
    severe: string;
  };
}

interface MeditationSession {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  audioUrl?: string;
}

const MentalHealthWellness: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moodNote, setMoodNote] = useState<string>('');
  const [lastPHQ9Score, setLastPHQ9Score] = useState<number>(0);
  const [lastGAD7Score, setLastGAD7Score] = useState<number>(0);
  const [lastPSS10Score, setLastPSS10Score] = useState<number>(0);
  const [showInterventionAlert, setShowInterventionAlert] = useState(false);
  const [interventionReason, setInterventionReason] = useState<string>('');

  // PHQ-9 Depression Assessment
  const phq9: Assessment = {
    id: 'phq9',
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    description: 'A scientifically validated tool for screening depression. This brief questionnaire helps identify depressive symptoms over the past two weeks.',
    questions: [
      {
        id: 1,
        question: 'Little interest or pleasure in doing things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 2,
        question: 'Feeling down, depressed, or hopeless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 3,
        question: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 4,
        question: 'Feeling tired or having little energy',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 5,
        question: 'Poor appetite or overeating',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 6,
        question: 'Feeling bad about yourself or that you are a failure',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 7,
        question: 'Trouble concentrating on things, such as reading or watching TV',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 8,
        question: 'Moving or speaking slowly, or being fidgety or restless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 9,
        question: 'Thoughts that you would be better off dead or hurting yourself',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    scoringInfo: {
      minimal: '0-4: Minimal depression',
      mild: '5-9: Mild depression',
      moderate: '10-14: Moderate depression',
      moderatelySevere: '15-19: Moderately severe depression',
      severe: '20-27: Severe depression'
    }
  };

  // GAD-7 Anxiety Assessment
  const gad7: Assessment = {
    id: 'gad7',
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder-7',
    description: 'A validated screening tool for anxiety disorders. This questionnaire assesses anxiety symptoms experienced over the past two weeks.',
    questions: [
      {
        id: 1,
        question: 'Feeling nervous, anxious, or on edge',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 2,
        question: 'Not being able to stop or control worrying',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 3,
        question: 'Worrying too much about different things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 4,
        question: 'Trouble relaxing',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 5,
        question: 'Being so restless that it is hard to sit still',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 6,
        question: 'Becoming easily annoyed or irritable',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 7,
        question: 'Feeling afraid, as if something awful might happen',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    scoringInfo: {
      minimal: '0-4: Minimal anxiety',
      mild: '5-9: Mild anxiety',
      moderate: '10-14: Moderate anxiety',
      severe: '15-21: Severe anxiety'
    }
  };

  // Perceived Stress Scale (PSS-10)
  const pss10: Assessment = {
    id: 'pss10',
    name: 'PSS-10',
    fullName: 'Perceived Stress Scale',
    description: 'Measures the degree to which situations in your life are perceived as stressful over the past month.',
    questions: [
      {
        id: 1,
        question: 'How often have you been upset because of something that happened unexpectedly?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        id: 2,
        question: 'How often have you felt unable to control important things in your life?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        id: 3,
        question: 'How often have you felt nervous and stressed?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        id: 4,
        question: 'How often have you felt confident about handling personal problems?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        id: 5,
        question: 'How often have you felt things were going your way?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        id: 6,
        question: 'How often have you found that you could not cope with all the things you had to do?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        id: 7,
        question: 'How often have you been able to control irritations in your life?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        id: 8,
        question: 'How often have you felt that you were on top of things?',
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly often' },
          { value: 0, label: 'Very often' }
        ]
      },
      {
        id: 9,
        question: 'How often have you been angered because of things outside your control?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      },
      {
        id: 10,
        question: 'How often have you felt difficulties were piling up so high you could not overcome them?',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly often' },
          { value: 4, label: 'Very often' }
        ]
      }
    ],
    scoringInfo: {
      minimal: '0-13: Low stress',
      mild: '14-26: Moderate stress',
      moderate: '27-40: High perceived stress',
      severe: '27-40: High perceived stress'
    }
  };

  const meditationSessions: MeditationSession[] = [
    {
      id: '1',
      title: '5-Minute Quick Calm',
      duration: '5 min',
      category: 'Quick Relief',
      description: 'A brief meditation perfect for between classes or during study breaks. Focus on breath and release tension.'
    },
    {
      id: '2',
      title: 'Exam Anxiety Relief',
      duration: '10 min',
      category: 'Academic Stress',
      description: 'Specifically designed to calm pre-exam nerves. Visualization techniques to boost confidence.'
    },
    {
      id: '3',
      title: 'Sleep Preparation',
      duration: '15 min',
      category: 'Sleep',
      description: 'Wind down from a busy day. Progressive muscle relaxation to prepare for restful sleep.'
    },
    {
      id: '4',
      title: 'Focus & Concentration',
      duration: '10 min',
      category: 'Study Aid',
      description: 'Enhance your focus before study sessions. Mindfulness techniques for better concentration.'
    },
    {
      id: '5',
      title: 'Body Scan Relaxation',
      duration: '12 min',
      category: 'Stress Relief',
      description: 'Full body awareness meditation. Release physical tension and mental stress.'
    },
    {
      id: '6',
      title: 'Morning Energizer',
      duration: '8 min',
      category: 'Energy',
      description: 'Start your day with positive energy. Breathing exercises to invigorate mind and body.'
    },
    {
      id: '7',
      title: 'Anxiety & Panic SOS',
      duration: '7 min',
      category: 'Emergency',
      description: 'Immediate relief for panic attacks or severe anxiety. Grounding techniques and calming breaths.'
    },
    {
      id: '8',
      title: 'Gratitude Practice',
      duration: '10 min',
      category: 'Positivity',
      description: 'Cultivate appreciation and positive mindset. Reflect on good things in your life.'
    }
  ];

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great', color: '#10b981' },
    { emoji: '🙂', label: 'Good', value: 'good', color: '#84cc16' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: '#eab308' },
    { emoji: '😔', label: 'Low', value: 'low', color: '#f59e0b' },
    { emoji: '😢', label: 'Struggling', value: 'struggling', color: '#ef4444' }
  ];

  const handleStartAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAssessmentAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...assessmentAnswers];
    newAnswers[currentQuestionIndex] = value;
    setAssessmentAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAssessment && currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = calculateScore();

      // Save scores for mental health tracking
      if (selectedAssessment.id === 'phq9') {
        setLastPHQ9Score(score);
      } else if (selectedAssessment.id === 'gad7') {
        setLastGAD7Score(score);
      } else if (selectedAssessment.id === 'pss10') {
        setLastPSS10Score(score);
      }

      setShowResults(true);

      // Check for critical levels
      checkMentalHealthLevel(score, selectedAssessment);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return assessmentAnswers.reduce((sum, answer) => sum + answer, 0);
  };

  const getScoreInterpretation = (score: number, assessment: Assessment) => {
    if (assessment.id === 'phq9') {
      if (score <= 4) return { level: 'Minimal', message: assessment.scoringInfo.minimal, color: '#10b981', recommendation: 'Your scores indicate minimal depressive symptoms. Continue practicing self-care and healthy habits.' };
      if (score <= 9) return { level: 'Mild', message: assessment.scoringInfo.mild, color: '#84cc16', recommendation: 'You may be experiencing mild depression. Consider trying our meditation resources and monitoring your mood regularly.' };
      if (score <= 14) return { level: 'Moderate', message: assessment.scoringInfo.moderate, color: '#eab308', recommendation: 'Your scores suggest moderate depression. We recommend speaking with a counselor. Book an appointment through our counseling services.' };
      if (score <= 19) return { level: 'Moderately Severe', message: assessment.scoringInfo.moderatelySevere || '', color: '#f59e0b', recommendation: 'Your scores indicate moderately severe depression. Professional support is recommended. Please book a counseling session or contact our emergency helpline.' };
      return { level: 'Severe', message: assessment.scoringInfo.severe, color: '#ef4444', recommendation: 'Your scores suggest severe depression. Immediate professional help is important. Please contact our emergency helpline or book an urgent counseling appointment.' };
    } else if (assessment.id === 'gad7') {
      if (score <= 4) return { level: 'Minimal', message: assessment.scoringInfo.minimal, color: '#10b981', recommendation: 'Your anxiety levels are minimal. Keep up your current coping strategies.' };
      if (score <= 9) return { level: 'Mild', message: assessment.scoringInfo.mild, color: '#84cc16', recommendation: 'You may have mild anxiety. Try our breathing exercises and meditation sessions.' };
      if (score <= 14) return { level: 'Moderate', message: assessment.scoringInfo.moderate, color: '#eab308', recommendation: 'Your anxiety is moderate. Consider counseling services and practice daily relaxation techniques.' };
      return { level: 'Severe', message: assessment.scoringInfo.severe, color: '#ef4444', recommendation: 'Severe anxiety detected. Professional help is strongly recommended. Book a counseling session or use emergency helpline.' };
    } else {
      if (score <= 13) return { level: 'Low', message: assessment.scoringInfo.minimal, color: '#10b981', recommendation: 'Your stress levels are well-managed. Continue your current wellness practices.' };
      if (score <= 26) return { level: 'Moderate', message: assessment.scoringInfo.mild, color: '#eab308', recommendation: 'You\'re experiencing moderate stress. Try our stress management resources and meditation sessions.' };
      return { level: 'High', message: assessment.scoringInfo.moderate, color: '#ef4444', recommendation: 'High stress levels detected. Consider counseling and use our stress reduction tools daily.' };
    }
  };

  const handleMoodSubmit = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        date: new Date().toLocaleDateString(),
        mood: selectedMood,
        note: moodNote
      };
      const updatedHistory = [newEntry, ...moodHistory];
      setMoodHistory(updatedHistory);
      setSelectedMood('');
      setMoodNote('');

      // Check for concerning mood patterns
      checkMoodPatterns(updatedHistory);
    }
  };

  // Calculate overall mental health score (0-100, higher is better)
  const calculateOverallMentalHealth = (): number => {
    let healthScore = 100;

    // Depression impact (PHQ-9: 0-27, higher is worse)
    if (lastPHQ9Score > 0) {
      healthScore -= (lastPHQ9Score / 27) * 40; // Max 40 points reduction
    }

    // Anxiety impact (GAD-7: 0-21, higher is worse)
    if (lastGAD7Score > 0) {
      healthScore -= (lastGAD7Score / 21) * 30; // Max 30 points reduction
    }

    // Stress impact (PSS-10: 0-40, higher is worse)
    if (lastPSS10Score > 0) {
      healthScore -= (lastPSS10Score / 40) * 20; // Max 20 points reduction
    }

    // Mood history impact (recent 7 days)
    const recentMoods = moodHistory.slice(0, 7);
    if (recentMoods.length > 0) {
      const lowMoodCount = recentMoods.filter(m => m.mood === 'low' || m.mood === 'struggling').length;
      healthScore -= (lowMoodCount / 7) * 10; // Max 10 points reduction
    }

    return Math.max(0, Math.min(100, healthScore));
  };

  // Get mental health level category
  const getMentalHealthLevel = (score: number): { level: string; color: string; message: string } => {
    if (score >= 80) {
      return {
        level: 'Excellent',
        color: '#10b981',
        message: 'Your mental health is in great shape! Keep up your wellness practices.'
      };
    } else if (score >= 60) {
      return {
        level: 'Good',
        color: '#84cc16',
        message: 'Your mental health is generally good. Continue monitoring and practicing self-care.'
      };
    } else if (score >= 40) {
      return {
        level: 'Fair',
        color: '#eab308',
        message: 'Your mental health needs attention. Consider using our resources and practicing daily wellness activities.'
      };
    } else if (score >= 20) {
      return {
        level: 'Concerning',
        color: '#f59e0b',
        message: 'Your mental health is concerning. We strongly recommend speaking with a counselor.'
      };
    } else {
      return {
        level: 'Critical',
        color: '#ef4444',
        message: 'Your mental health requires immediate attention. Please contact a mental health professional or use our emergency helpline.'
      };
    }
  };

  // Check for critical mental health levels after assessment
  const checkMentalHealthLevel = (score: number, assessment: Assessment) => {
    let shouldAlert = false;
    let reason = '';

    if (assessment.id === 'phq9' && score >= 20) {
      shouldAlert = true;
      reason = 'severe_depression';
    } else if (assessment.id === 'phq9' && score >= 15) {
      shouldAlert = true;
      reason = 'moderately_severe_depression';
    } else if (assessment.id === 'gad7' && score >= 15) {
      shouldAlert = true;
      reason = 'severe_anxiety';
    } else if (assessment.id === 'pss10' && score >= 27) {
      shouldAlert = true;
      reason = 'high_stress';
    }

    // Also check if question 9 of PHQ-9 (suicidal thoughts) was answered positively
    if (assessment.id === 'phq9' && assessmentAnswers[8] >= 1) {
      shouldAlert = true;
      reason = 'suicidal_ideation';
    }

    if (shouldAlert) {
      setInterventionReason(reason);
      setTimeout(() => setShowInterventionAlert(true), 1000);
    }
  };

  // Check for concerning mood patterns
  const checkMoodPatterns = (history: MoodEntry[]) => {
    const recent7Days = history.slice(0, 7);

    // Check for 3+ consecutive low/struggling days
    let consecutiveLow = 0;
    for (const entry of recent7Days) {
      if (entry.mood === 'low' || entry.mood === 'struggling') {
        consecutiveLow++;
        if (consecutiveLow >= 3) {
          setInterventionReason('consecutive_low_moods');
          setTimeout(() => setShowInterventionAlert(true), 1000);
          break;
        }
      } else {
        consecutiveLow = 0;
      }
    }

    // Check if 5+ out of last 7 days are low/struggling
    const lowCount = recent7Days.filter(m => m.mood === 'low' || m.mood === 'struggling').length;
    if (lowCount >= 5) {
      setInterventionReason('persistent_low_mood');
      setTimeout(() => setShowInterventionAlert(true), 1000);
    }
  };

  // Get intervention message based on reason
  const getInterventionMessage = (reason: string): { title: string; message: string; urgent: boolean } => {
    switch (reason) {
      case 'suicidal_ideation':
        return {
          title: 'Immediate Support Needed',
          message: 'Your responses indicate you may be experiencing thoughts of self-harm. Your safety is our top priority. Please reach out to a mental health professional or crisis helpline immediately. You don\'t have to face this alone.',
          urgent: true
        };
      case 'severe_depression':
        return {
          title: 'Severe Depression Detected',
          message: 'Your assessment indicates severe depression symptoms. This level requires professional support. Please consider booking an urgent counseling session or contacting our mental health services.',
          urgent: true
        };
      case 'moderately_severe_depression':
        return {
          title: 'Your Mental Health Needs Attention',
          message: 'Your scores suggest moderately severe depression. It\'s important to slow down and prioritize your mental health. Professional support can make a significant difference.',
          urgent: false
        };
      case 'severe_anxiety':
        return {
          title: 'Severe Anxiety Detected',
          message: 'Your anxiety levels are very high. This can significantly impact your daily life and studies. We strongly recommend speaking with a counselor who can provide appropriate support.',
          urgent: true
        };
      case 'high_stress':
        return {
          title: 'Critical Stress Levels',
          message: 'You\'re experiencing very high stress levels. It\'s time to take a step back and prioritize self-care. Consider reducing your workload and seeking support from a mental health professional.',
          urgent: false
        };
      case 'consecutive_low_moods':
        return {
          title: 'Concerning Mood Pattern',
          message: 'You\'ve been feeling low for several consecutive days. This pattern suggests you may benefit from professional support. Please consider reaching out to a counselor.',
          urgent: false
        };
      case 'persistent_low_mood':
        return {
          title: 'Persistent Low Mood',
          message: 'Most of your recent days have been difficult. It\'s important to address this. Taking time to prioritize your mental health and speaking with a professional can help.',
          urgent: false
        };
      default:
        return {
          title: 'Mental Health Check-in',
          message: 'We noticed some concerning patterns in your mental health. Please consider taking time for self-care and reaching out for support.',
          urgent: false
        };
    }
  };

  const getTodayMood = () => {
    const today = new Date().toLocaleDateString();
    return moodHistory.find(entry => entry.date === today);
  };

  return (
    <div className="mental-health-wellness">
      {/* Emergency SOS Button - Always Visible */}
      <div className="sos-button-container">
        <button className="sos-emergency-btn">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Emergency Help</span>
        </button>
      </div>

      {/* Header */}
      <div className="mh-header">
        <div className="mh-header-content">
          <div className="mh-header-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="mh-header-text">
            <h1>Mental Health & Wellness</h1>
            <p>Your safe space for emotional wellbeing and personal growth</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mh-navigation">
        <button
          className={`mh-nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </button>
        <button
          className={`mh-nav-btn ${activeSection === 'assessments' ? 'active' : ''}`}
          onClick={() => setActiveSection('assessments')}
        >
          <i className="fas fa-clipboard-list"></i>
          <span>Self-Assessments</span>
        </button>
        <button
          className={`mh-nav-btn ${activeSection === 'mood' ? 'active' : ''}`}
          onClick={() => setActiveSection('mood')}
        >
          <i className="fas fa-smile"></i>
          <span>Mood Tracker</span>
        </button>
        <button
          className={`mh-nav-btn ${activeSection === 'meditation' ? 'active' : ''}`}
          onClick={() => setActiveSection('meditation')}
        >
          <i className="fas fa-spa"></i>
          <span>Meditation & Resources</span>
        </button>
      </div>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div className="mh-content">
          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <div className="quick-action-card" onClick={() => setActiveSection('mood')}>
                <div className="qa-icon">
                  <i className="fas fa-smile"></i>
                </div>
                <h3>Check-in Today</h3>
                <p>How are you feeling?</p>
              </div>
              <div className="quick-action-card" onClick={() => setActiveSection('assessments')}>
                <div className="qa-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h3>Take Assessment</h3>
                <p>Understand your mental health</p>
              </div>
              <div className="quick-action-card" onClick={() => setActiveSection('meditation')}>
                <div className="qa-icon">
                  <i className="fas fa-spa"></i>
                </div>
                <h3>Quick Calm</h3>
                <p>5-minute meditation</p>
              </div>
            </div>
          </div>

          {/* Mental Health Level Meter */}
          <div className="mental-health-meter-section">
            <h2>Your Mental Health Level</h2>
            <div className="health-meter-card">
              {(() => {
                const healthScore = calculateOverallMentalHealth();
                const healthLevel = getMentalHealthLevel(healthScore);
                return (
                  <>
                    <div className="health-score-display">
                      <div className="health-gauge">
                        <svg viewBox="0 0 200 120" className="gauge-svg">
                          {/* Background arc */}
                          <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="20"
                            strokeLinecap="round"
                          />
                          {/* Colored arc based on health score */}
                          <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={healthLevel.color}
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                          />
                          {/* Score text */}
                          <text x="100" y="85" textAnchor="middle" fontSize="36" fontWeight="700" fill="#1f2937">
                            {Math.round(healthScore)}
                          </text>
                          <text x="100" y="105" textAnchor="middle" fontSize="14" fill="#6b7280">
                            / 100
                          </text>
                        </svg>
                      </div>
                      <div className="health-level-info">
                        <h3 style={{ color: healthLevel.color }}>{healthLevel.level}</h3>
                        <p>{healthLevel.message}</p>
                        {healthScore < 60 && (
                          <div className="health-warning">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>Consider seeking professional support</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="health-factors">
                      <h4>Contributing Factors:</h4>
                      <div className="factors-list">
                        {lastPHQ9Score > 0 && (
                          <div className="factor-item">
                            <span className="factor-label">Depression (PHQ-9):</span>
                            <span className="factor-value">{lastPHQ9Score}/27</span>
                          </div>
                        )}
                        {lastGAD7Score > 0 && (
                          <div className="factor-item">
                            <span className="factor-label">Anxiety (GAD-7):</span>
                            <span className="factor-value">{lastGAD7Score}/21</span>
                          </div>
                        )}
                        {lastPSS10Score > 0 && (
                          <div className="factor-item">
                            <span className="factor-label">Stress (PSS-10):</span>
                            <span className="factor-value">{lastPSS10Score}/40</span>
                          </div>
                        )}
                        {moodHistory.length > 0 && (
                          <div className="factor-item">
                            <span className="factor-label">Mood Trend (7 days):</span>
                            <span className="factor-value">
                              {moodHistory.slice(0, 7).filter(m => m.mood === 'great' || m.mood === 'good').length}/7 positive days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Wellness Overview */}
          <div className="wellness-overview">
            <h2>Your Wellness Journey</h2>
            <div className="wellness-stats">
              <div className="wellness-stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{moodHistory.length}</span>
                  <span className="stat-label">Mood Check-ins</span>
                </div>
              </div>
              <div className="wellness-stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Assessments Completed</span>
                </div>
              </div>
              <div className="wellness-stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-brain"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Meditation Sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="resources-section">
            <h2>Helpful Resources</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <i className="fas fa-phone-volume"></i>
                <h3>24/7 Crisis Helpline</h3>
                <p>Immediate support when you need it most</p>
                <button className="resource-btn">Access Now</button>
              </div>
              <div className="resource-card">
                <i className="fas fa-calendar-alt"></i>
                <h3>Book Counseling</h3>
                <p>Schedule a confidential session with a professional</p>
                <button className="resource-btn">Book Appointment</button>
              </div>
              <div className="resource-card">
                <i className="fas fa-book-open"></i>
                <h3>Wellness Library</h3>
                <p>Articles, videos, and guides for mental health</p>
                <button className="resource-btn">Explore Resources</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Self-Assessments Section */}
      {activeSection === 'assessments' && !selectedAssessment && (
        <div className="mh-content">
          <div className="assessments-intro">
            <div className="info-banner">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h3>100% Anonymous & Confidential</h3>
                <p>Your responses are private and used only to provide personalized recommendations. No data is shared with faculty or administration.</p>
              </div>
            </div>
          </div>

          <h2>Choose an Assessment</h2>
          <div className="assessments-grid">
            <div className="assessment-card" onClick={() => handleStartAssessment(phq9)}>
              <div className="assessment-header">
                <div className="assessment-icon depression">
                  <i className="fas fa-cloud-sun"></i>
                </div>
                <div className="assessment-meta">
                  <h3>{phq9.name}</h3>
                  <span className="assessment-duration">9 questions • 3 min</span>
                </div>
              </div>
              <h4>{phq9.fullName}</h4>
              <p>{phq9.description}</p>
              <button className="start-assessment-btn">
                <i className="fas fa-play-circle"></i>
                Start Assessment
              </button>
            </div>

            <div className="assessment-card" onClick={() => handleStartAssessment(gad7)}>
              <div className="assessment-header">
                <div className="assessment-icon anxiety">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <div className="assessment-meta">
                  <h3>{gad7.name}</h3>
                  <span className="assessment-duration">7 questions • 2 min</span>
                </div>
              </div>
              <h4>{gad7.fullName}</h4>
              <p>{gad7.description}</p>
              <button className="start-assessment-btn">
                <i className="fas fa-play-circle"></i>
                Start Assessment
              </button>
            </div>

            <div className="assessment-card" onClick={() => handleStartAssessment(pss10)}>
              <div className="assessment-header">
                <div className="assessment-icon stress">
                  <i className="fas fa-brain"></i>
                </div>
                <div className="assessment-meta">
                  <h3>{pss10.name}</h3>
                  <span className="assessment-duration">10 questions • 3 min</span>
                </div>
              </div>
              <h4>{pss10.fullName}</h4>
              <p>{pss10.description}</p>
              <button className="start-assessment-btn">
                <i className="fas fa-play-circle"></i>
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Questions */}
      {activeSection === 'assessments' && selectedAssessment && !showResults && (
        <div className="mh-content">
          <div className="assessment-container">
            <div className="assessment-progress">
              <div className="progress-info">
                <span>Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100)}% Complete</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="assessment-question-card">
              <h2>{selectedAssessment.questions[currentQuestionIndex].question}</h2>
              <p className="question-subtitle">Over the last 2 weeks, how often have you been bothered by this?</p>

              <div className="answer-options">
                {selectedAssessment.questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    className={`answer-option ${assessmentAnswers[currentQuestionIndex] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option.value)}
                  >
                    <div className="option-radio">
                      {assessmentAnswers[currentQuestionIndex] === option.value && (
                        <i className="fas fa-check"></i>
                      )}
                    </div>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="assessment-actions">
                <button
                  className="assessment-btn secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <i className="fas fa-arrow-left"></i>
                  Previous
                </button>
                <button
                  className="assessment-btn primary"
                  onClick={handleNext}
                  disabled={assessmentAnswers[currentQuestionIndex] === undefined}
                >
                  {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                    <>
                      <i className="fas fa-check-circle"></i>
                      Submit
                    </>
                  ) : (
                    <>
                      Next
                      <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Results */}
      {activeSection === 'assessments' && selectedAssessment && showResults && (
        <div className="mh-content">
          <div className="results-container">
            <div className="results-header">
              <i className="fas fa-chart-pie"></i>
              <h2>Your Results: {selectedAssessment.name}</h2>
            </div>

            <div className="score-display">
              <div className="score-circle" style={{ borderColor: getScoreInterpretation(calculateScore(), selectedAssessment).color }}>
                <span className="score-number">{calculateScore()}</span>
                <span className="score-label">Total Score</span>
              </div>
              <div className="score-interpretation">
                <h3 style={{ color: getScoreInterpretation(calculateScore(), selectedAssessment).color }}>
                  {getScoreInterpretation(calculateScore(), selectedAssessment).level}
                </h3>
                <p className="score-message">{getScoreInterpretation(calculateScore(), selectedAssessment).message}</p>
              </div>
            </div>

            <div className="recommendation-box">
              <h3><i className="fas fa-lightbulb"></i> Recommendation</h3>
              <p>{getScoreInterpretation(calculateScore(), selectedAssessment).recommendation}</p>
            </div>

            <div className="results-actions">
              <button className="action-btn primary" onClick={() => setActiveSection('meditation')}>
                <i className="fas fa-spa"></i>
                Try Meditation
              </button>
              <button className="action-btn secondary" onClick={() => {
                setSelectedAssessment(null);
                setShowResults(false);
                setAssessmentAnswers([]);
              }}>
                <i className="fas fa-redo"></i>
                Take Another Assessment
              </button>
              <button className="action-btn tertiary" onClick={() => setActiveSection('dashboard')}>
                Back to Dashboard
              </button>
            </div>

            <div className="privacy-note">
              <i className="fas fa-lock"></i>
              <p>These results are for informational purposes only and do not constitute a diagnosis. For professional evaluation, please consult a healthcare provider.</p>
            </div>
          </div>
        </div>
      )}

      {/* Mood Tracker Section */}
      {activeSection === 'mood' && (
        <div className="mh-content">
          <div className="mood-tracker-section">
            <h2>How are you feeling today?</h2>
            {!getTodayMood() ? (
              <div className="mood-check-in">
                <div className="mood-selector">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      className={`mood-btn ${selectedMood === mood.value ? 'selected' : ''}`}
                      onClick={() => setSelectedMood(mood.value)}
                      style={{ borderColor: selectedMood === mood.value ? mood.color : undefined }}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span className="mood-label">{mood.label}</span>
                    </button>
                  ))}
                </div>

                {selectedMood && (
                  <div className="mood-note-section">
                    <label>Add a note (optional)</label>
                    <textarea
                      placeholder="What's on your mind? How was your day?"
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                      rows={4}
                    />
                    <button className="submit-mood-btn" onClick={handleMoodSubmit}>
                      <i className="fas fa-check-circle"></i>
                      Save Mood Check-in
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mood-recorded">
                <i className="fas fa-check-circle"></i>
                <h3>Today's mood recorded!</h3>
                <p>You're feeling {moods.find(m => m.value === getTodayMood()?.mood)?.label} today</p>
                {getTodayMood()?.note && (
                  <div className="recorded-note">
                    <p>"{getTodayMood()?.note}"</p>
                  </div>
                )}
              </div>
            )}

            {moodHistory.length > 0 && (
              <div className="mood-history">
                <h3>Your Mood History</h3>
                <div className="mood-calendar">
                  {moodHistory.slice(0, 7).map((entry, index) => (
                    <div key={index} className="mood-entry">
                      <div className="entry-date">{entry.date}</div>
                      <div className="entry-mood">
                        <span className="mood-emoji-small">
                          {moods.find(m => m.value === entry.mood)?.emoji}
                        </span>
                        <span>{moods.find(m => m.value === entry.mood)?.label}</span>
                      </div>
                      {entry.note && <div className="entry-note">{entry.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meditation & Resources Section */}
      {activeSection === 'meditation' && (
        <div className="mh-content">
          <div className="meditation-section">
            <h2>Meditation & Mindfulness</h2>
            <p className="section-subtitle">Guided sessions to calm your mind and reduce stress</p>

            <div className="meditation-categories">
              <button className="category-chip active">All Sessions</button>
              <button className="category-chip">Quick Relief</button>
              <button className="category-chip">Academic Stress</button>
              <button className="category-chip">Sleep</button>
              <button className="category-chip">Study Aid</button>
            </div>

            <div className="meditation-grid">
              {meditationSessions.map((session) => (
                <div key={session.id} className="meditation-card">
                  <div className="meditation-header">
                    <div className="meditation-icon">
                      <i className="fas fa-leaf"></i>
                    </div>
                    <span className="meditation-category">{session.category}</span>
                  </div>
                  <h3>{session.title}</h3>
                  <p>{session.description}</p>
                  <div className="meditation-footer">
                    <span className="meditation-duration">
                      <i className="fas fa-clock"></i>
                      {session.duration}
                    </span>
                    <button className="play-btn">
                      <i className="fas fa-play"></i>
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Breathing Exercise */}
            <div className="breathing-exercise-section">
              <h2>Quick Breathing Exercise</h2>
              <div className="breathing-card">
                <div className="breathing-visual">
                  <div className="breathing-circle">
                    <span>Breathe</span>
                  </div>
                </div>
                <div className="breathing-instructions">
                  <h3>4-7-8 Breathing Technique</h3>
                  <ol>
                    <li>Breathe in through your nose for <strong>4 seconds</strong></li>
                    <li>Hold your breath for <strong>7 seconds</strong></li>
                    <li>Exhale slowly through your mouth for <strong>8 seconds</strong></li>
                    <li>Repeat 3-4 times</li>
                  </ol>
                  <button className="breathing-start-btn">
                    <i className="fas fa-wind"></i>
                    Start Guided Breathing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intervention Alert Modal */}
      {showInterventionAlert && (
        <div className="intervention-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !getInterventionMessage(interventionReason).urgent) {
            setShowInterventionAlert(false);
          }
        }}>
          <div className={`intervention-modal ${getInterventionMessage(interventionReason).urgent ? 'intervention-urgent' : ''}`}>
            <div className="intervention-header">
              <i className={`fas ${getInterventionMessage(interventionReason).urgent ? 'fa-exclamation-triangle' : 'fa-hand-paper'}`}></i>
              <h2>{getInterventionMessage(interventionReason).title}</h2>
            </div>
            <div className="intervention-content">
              <p>{getInterventionMessage(interventionReason).message}</p>
            </div>
            <div className="intervention-actions">
              <button className="intervention-btn emergency" onClick={() => {
                window.open('tel:1800-599-0019', '_blank');
              }}>
                <i className="fas fa-phone-volume"></i>
                Emergency Helpline
              </button>
              <button className="intervention-btn primary" onClick={() => {
                setShowInterventionAlert(false);
                setActiveSection('dashboard');
              }}>
                <i className="fas fa-calendar-check"></i>
                Book Counseling
              </button>
              {!getInterventionMessage(interventionReason).urgent && (
                <button className="intervention-btn tertiary" onClick={() => setShowInterventionAlert(false)}>
                  I understand
                </button>
              )}
            </div>
            {getInterventionMessage(interventionReason).urgent && (
              <div className="intervention-footer">
                <p><strong>If you're in immediate danger, please call emergency services (911) or go to the nearest emergency room.</strong></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthWellness;
