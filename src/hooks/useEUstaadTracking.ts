import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEUstaadStore } from '../store/useEUstaadStore';
import { usePASCOStore } from '../store/usePASCOStore';

/**
 * Hook for tracking user activities and triggering eUstaad animations
 * Monitors navigation, clicks, typing, inactivity, and updates PASCO metrics
 */
export function useEUstaadTracking() {
  const location = useLocation();
  const { recordActivity, consentGiven, setAnimationState, totalInteractions } = useEUstaadStore();
  const { recordActivity: recordPASCOActivity } = usePASCOStore();
  const lastActivityTime = useRef(Date.now());
  const learningStartTime = useRef<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Show excited state on first load
  useEffect(() => {
    if (!consentGiven || sessionStarted) return;

    setAnimationState('excited');
    setSessionStarted(true);
  }, [consentGiven]);

  // Track navigation changes
  useEffect(() => {
    if (!consentGiven) return;

    recordActivity({
      type: 'navigation',
      metadata: {
        pathname: location.pathname,
        timestamp: new Date().toISOString()
      }
    });

    lastActivityTime.current = Date.now();
  }, [location.pathname, consentGiven]);

  // Track global click events
  useEffect(() => {
    if (!consentGiven) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked element is a button or link
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a');

      if (isInteractive) {
        recordActivity({
          type: 'click',
          metadata: {
            element: target.tagName,
            text: target.textContent?.substring(0, 50) || '',
            pathname: location.pathname
          }
        });
      }

      lastActivityTime.current = Date.now();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [consentGiven, location.pathname]);

  // Track typing activity
  useEffect(() => {
    if (!consentGiven) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Check if typing in input or textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        setAnimationState('typing');
        lastActivityTime.current = Date.now();

        // Reset to idle after 2 seconds of no typing
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          setAnimationState('idle');
        }, 2000);
      }
    };

    document.addEventListener('keydown', handleTyping);
    return () => {
      document.removeEventListener('keydown', handleTyping);
      clearTimeout(typingTimeout);
    };
  }, [consentGiven]);

  // Track inactivity for sleeping state
  useEffect(() => {
    if (!consentGiven) return;

    const checkInactivity = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime.current;
      const fiveMinutes = 5 * 60 * 1000;

      if (inactiveTime > fiveMinutes) {
        setAnimationState('sleeping');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInactivity);
  }, [consentGiven]);

  // Track learning sessions for learning mode
  useEffect(() => {
    if (!consentGiven) return;

    // Detect if user is on a learning page (classes, resources, tests, etc.)
    const learningPages = ['/class', '/test', '/quiz', '/resource', '/study', '/document-learning', '/audio-learning'];
    const isLearningPage = learningPages.some(page => location.pathname.includes(page));

    if (isLearningPage) {
      if (!learningStartTime.current) {
        learningStartTime.current = Date.now();
      }

      // After 3 minutes of learning, show learning mode
      const learningTimer = setTimeout(() => {
        setAnimationState('learning');
      }, 3 * 60 * 1000);

      return () => {
        clearTimeout(learningTimer);
        learningStartTime.current = null;
      };
    } else {
      learningStartTime.current = null;
    }
  }, [location.pathname, consentGiven]);

  // Check for streaks and celebrate
  useEffect(() => {
    if (!consentGiven) return;

    // Check localStorage for learning streaks
    const checkStreak = () => {
      const lastVisit = localStorage.getItem('eustaad-last-visit');
      const currentStreak = parseInt(localStorage.getItem('eustaad-streak') || '0');
      const today = new Date().toDateString();

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
          // Continuing streak
          const newStreak = currentStreak + 1;
          localStorage.setItem('eustaad-streak', newStreak.toString());
          localStorage.setItem('eustaad-last-visit', today);

          if (newStreak >= 3) {
            setAnimationState('celebrating-streak');
          }
        } else {
          // Streak broken or first visit
          localStorage.setItem('eustaad-streak', '1');
          localStorage.setItem('eustaad-last-visit', today);
        }
      }
    };

    checkStreak();
  }, [consentGiven]);

  return {
    // Helper functions to track specific activities
    trackTestStart: (testId: string) => {
      if (!consentGiven) return;

      recordActivity({
        type: 'test',
        metadata: {
          testId,
          action: 'started',
          timestamp: new Date().toISOString()
        }
      });

      setAnimationState('thinking');
      lastActivityTime.current = Date.now();
    },

    trackTestComplete: (testId: string, score: number, totalQuestions: number) => {
      if (!consentGiven) return;

      const percentage = (score / totalQuestions) * 100;

      recordActivity({
        type: 'test',
        metadata: {
          testId,
          action: 'completed',
          score,
          totalQuestions,
          percentage
        }
      });

      // Update PASCO metrics based on performance
      let impact: any = {};
      if (percentage >= 90) {
        impact = { C: 0.3, A: 0.2, S: 0.2, O: 0.1 };
        setAnimationState('celebrating');
      } else if (percentage >= 75) {
        impact = { C: 0.2, A: 0.1, S: 0.15, O: 0.05 };
        setAnimationState('celebrating');
      } else if (percentage >= 60) {
        impact = { C: 0.1, A: 0.05, S: 0.1 };
        setAnimationState('encouraging');
      } else {
        impact = { C: 0.05, S: 0.05, O: -0.05 };
        setAnimationState('concerned');
      }

      recordPASCOActivity('test_completed', impact, {
        score,
        totalQuestions,
        percentage
      });

      lastActivityTime.current = Date.now();
    },

    trackClassAttendance: (classId: string, duration: number) => {
      if (!consentGiven) return;

      recordActivity({
        type: 'class',
        metadata: {
          classId,
          duration,
          timestamp: new Date().toISOString()
        }
      });

      recordPASCOActivity('class_attended', {
        P: 0.1,
        S: 0.15,
        O: 0.1
      }, {
        duration,
        classId
      });

      setAnimationState('learning');
      lastActivityTime.current = Date.now();
    },

    trackResourceAccess: (resourceId: string, resourceType: string, duration: number) => {
      if (!consentGiven) return;

      recordActivity({
        type: 'resource',
        metadata: {
          resourceId,
          resourceType,
          duration,
          timestamp: new Date().toISOString()
        }
      });

      recordPASCOActivity('resource_accessed', {
        S: 0.05,
        A: 0.05,
        O: 0.02
      }, {
        resourceType,
        duration
      });

      setAnimationState('learning');
      lastActivityTime.current = Date.now();
    },

    trackQuizCompletion: (quizId: string, score: number, passed: boolean) => {
      if (!consentGiven) return;

      recordActivity({
        type: 'quiz',
        metadata: {
          quizId,
          score,
          passed,
          timestamp: new Date().toISOString()
        }
      });

      recordPASCOActivity('quiz_passed', passed
        ? { C: 0.1, S: 0.1, O: 0.05 }
        : { C: 0.02, S: 0.03, O: -0.02 }, {
        score,
        passed
      });

      setAnimationState(passed ? 'celebrating' : 'encouraging');
      lastActivityTime.current = Date.now();
    },

    // New helper functions for new states
    triggerFocusMode: () => {
      if (!consentGiven) return;
      setAnimationState('focus');
    },

    triggerWarning: (message?: string) => {
      if (!consentGiven) return;
      setAnimationState('warning');
    },

    triggerEncouragement: () => {
      if (!consentGiven) return;
      setAnimationState('encouraging');
    }
  };
}

/**
 * Hook for monitoring digital usage time
 */
export function useScreenTimeTracking() {
  const { consentGiven, digitalUsage, updateDigitalUsage } = useEUstaadStore();

  useEffect(() => {
    if (!consentGiven) return;

    // Track active time every minute
    const interval = setInterval(() => {
      updateDigitalUsage({
        totalScreenTime: digitalUsage.totalScreenTime + 1
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [consentGiven, digitalUsage.totalScreenTime]);

  return {
    addLearningTime: (minutes: number) => {
      if (!consentGiven) return;
      updateDigitalUsage({
        learningTime: digitalUsage.learningTime + minutes
      });
    },

    addSocialTime: (minutes: number) => {
      if (!consentGiven) return;
      updateDigitalUsage({
        socialTime: digitalUsage.socialTime + minutes
      });
    },

    addBreakTime: (minutes: number) => {
      if (!consentGiven) return;
      updateDigitalUsage({
        breakTime: digitalUsage.breakTime + minutes
      });
    }
  };
}
