import { useEffect, useCallback } from 'react';
import { usePASCOStore, type ActivityType, type PASCOMetrics } from '../store/usePASCOStore';

/**
 * Hook for tracking user activities and updating PASCO metrics
 * Provides easy-to-use functions for common activities
 */
export function usePASCOTracking() {
  const {
    recordActivity,
    applyInactivityPenalty,
    resetDailyMetrics,
    setAnimationState
  } = usePASCOStore();

  // Check for inactivity on mount and periodically
  useEffect(() => {
    // Reset daily metrics on component mount
    resetDailyMetrics();

    // Check for inactivity
    applyInactivityPenalty();

    // Set up periodic inactivity check (every 5 minutes)
    const inactivityInterval = setInterval(() => {
      applyInactivityPenalty();
    }, 5 * 60 * 1000);

    return () => clearInterval(inactivityInterval);
  }, [applyInactivityPenalty, resetDailyMetrics]);

  // Test completion tracking
  const trackTestCompletion = useCallback((score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;

    // Calculate impact based on performance
    let impact: Partial<PASCOMetrics> = {};

    if (percentage >= 90) {
      // Excellent performance
      impact = { C: 0.3, A: 0.2, S: 0.2, O: 0.1 };
    } else if (percentage >= 75) {
      // Good performance
      impact = { C: 0.2, A: 0.1, S: 0.15, O: 0.05 };
    } else if (percentage >= 60) {
      // Average performance
      impact = { C: 0.1, A: 0.05, S: 0.1 };
    } else {
      // Below average - minimal or no gain
      impact = { C: 0.05, S: 0.05, O: -0.05 };
    }

    recordActivity('test_completed', impact, {
      score,
      totalQuestions,
      percentage
    });
  }, [recordActivity]);

  // Class attendance tracking
  const trackClassAttendance = useCallback((duration: number, engagement: 'high' | 'medium' | 'low' = 'medium') => {
    const baseImpact = {
      P: 0.1,
      S: 0.15,
      O: 0.1
    };

    // Adjust based on engagement
    const engagementMultiplier = {
      high: 1.5,
      medium: 1.0,
      low: 0.5
    }[engagement];

    const impact: Partial<PASCOMetrics> = {
      P: baseImpact.P * engagementMultiplier,
      S: baseImpact.S * engagementMultiplier,
      O: baseImpact.O * engagementMultiplier
    };

    recordActivity('class_attended', impact, {
      duration,
      engagement
    });
  }, [recordActivity]);

  // Resource access tracking
  const trackResourceAccess = useCallback((resourceType: 'pdf' | 'video' | 'audio' | 'article', duration: number) => {
    const impact: Partial<PASCOMetrics> = {
      S: 0.05,
      A: 0.05,
      O: 0.02
    };

    // Bonus for longer engagement
    if (duration > 30 * 60) { // More than 30 minutes
      impact.S = (impact.S || 0) + 0.05;
      impact.A = (impact.A || 0) + 0.03;
    }

    recordActivity('resource_accessed', impact, {
      resourceType,
      duration
    });
  }, [recordActivity]);

  // Practice session tracking
  const trackPracticeSession = useCallback((duration: number, questionsAttempted: number, correctAnswers: number) => {
    const accuracy = questionsAttempted > 0 ? (correctAnswers / questionsAttempted) * 100 : 0;

    const impact: Partial<PASCOMetrics> = {
      S: 0.1,
      C: accuracy >= 70 ? 0.15 : 0.08,
      P: 0.05
    };

    // Bonus for consistent practice
    if (duration >= 45 * 60) { // 45+ minutes
      impact.P = (impact.P || 0) + 0.05;
      impact.O = 0.05;
    }

    recordActivity('practice_session', impact, {
      duration,
      questionsAttempted,
      correctAnswers,
      accuracy
    });
  }, [recordActivity]);

  // Assignment completion tracking
  const trackAssignmentCompletion = useCallback((grade: number, maxGrade: number, timeSpent: number) => {
    const percentage = (grade / maxGrade) * 100;

    const impact: Partial<PASCOMetrics> = {
      S: percentage >= 80 ? 0.25 : 0.15,
      A: percentage >= 90 ? 0.2 : 0.1,
      P: 0.15,
      O: 0.05
    };

    recordActivity('assignment_completed', impact, {
      grade,
      maxGrade,
      percentage,
      timeSpent
    });
  }, [recordActivity]);

  // Quiz performance tracking
  const trackQuizPerformance = useCallback((score: number, passed: boolean) => {
    const impact: Partial<PASCOMetrics> = passed
      ? { C: 0.1, S: 0.1, O: 0.05 }
      : { C: 0.02, S: 0.03, O: -0.02 };

    recordActivity('quiz_passed', impact, {
      score,
      passed
    });
  }, [recordActivity]);

  // General activity tracking (for page visits, interactions)
  const trackGeneralActivity = useCallback((activityType: string, metadata?: Record<string, any>) => {
    // Small baseline increase for any activity
    const impact: Partial<PASCOMetrics> = {
      O: 0.01,
      P: 0.01
    };

    recordActivity('resource_accessed', impact, {
      activityType,
      ...metadata
    });
  }, [recordActivity]);

  // Idle detection (called when user goes idle)
  const trackIdle = useCallback(() => {
    setAnimationState('idle');
  }, [setAnimationState]);

  // Activity detection (called when user becomes active)
  const trackActive = useCallback(() => {
    setAnimationState('analyzing');
    // Small boost for returning to activity
    recordActivity('resource_accessed', { O: 0.01 }, { action: 'returned_active' });
  }, [recordActivity, setAnimationState]);

  return {
    // Activity tracking functions
    trackTestCompletion,
    trackClassAttendance,
    trackResourceAccess,
    trackPracticeSession,
    trackAssignmentCompletion,
    trackQuizPerformance,
    trackGeneralActivity,

    // State functions
    trackIdle,
    trackActive
  };
}

/**
 * Hook for automatic idle/active detection
 * Tracks user activity and updates PASCO accordingly
 */
export function useIdleDetection(idleThreshold = 5 * 60 * 1000) { // 5 minutes default
  const { trackIdle, trackActive } = usePASCOTracking();

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let isIdle = false;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);

      // If was idle and now active, track it
      if (isIdle) {
        trackActive();
        isIdle = false;
      }

      // Set new idle timer
      idleTimer = setTimeout(() => {
        trackIdle();
        isIdle = true;
      }, idleThreshold);
    };

    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer);
    });

    // Initialize timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [idleThreshold, trackActive, trackIdle]);
}
