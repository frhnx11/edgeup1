/**
 * PASCO Feature Components
 *
 * Central export point for all feature components.
 * Features are the ACTUAL tabs from Social Learner, Academic Achiever, and Creative Explorer.
 */

import { lazy, ComponentType } from 'react';

// ============================================
// LAZY LOADED FEATURE COMPONENTS
// ============================================

// Social Learner Features
const ReelsPage = lazy(() =>
  import('../../../pages/upsc/social-learner/student/ReelsPage').then(m => ({ default: m.ReelsPage }))
);

const MessagesPage = lazy(() =>
  import('../../../pages/upsc/social-learner/student/MessagesPage').then(m => ({ default: m.MessagesPage }))
);

const StudyGroupsPage = lazy(() =>
  import('../../../pages/upsc/social-learner/student/StudyGroupsPage').then(m => ({ default: m.StudyGroupsPage }))
);

const QuizzesPage = lazy(() =>
  import('../../../pages/upsc/social-learner/student/QuizzesPage').then(m => ({ default: m.QuizzesPage }))
);

// Academic Achiever Features
const AdvancedAnalyticsPage = lazy(() =>
  import('../../../pages/upsc/academic-achiever/student/AdvancedAnalyticsPage')
);

const LeaderboardPage = lazy(() =>
  import('../../../pages/upsc/academic-achiever/student/LeaderboardPage')
);

const ReadinessScorePage = lazy(() =>
  import('../../../pages/upsc/academic-achiever/student/ReadinessScorePage')
);

const TestAnalyticsPage = lazy(() =>
  import('../../../pages/upsc/academic-achiever/student/TestAnalyticsPage')
);

// Creative Explorer Features
const MindMapStudio = lazy(() =>
  import('../creative-explorer/MindMapStudio').then(m => ({ default: m.MindMapStudio }))
);

const FocusTimer = lazy(() =>
  import('../creative-explorer/FocusTimer').then(m => ({ default: m.FocusTimer }))
);

const SmartCalendar = lazy(() =>
  import('../creative-explorer/SmartCalendar').then(m => ({ default: m.SmartCalendar }))
);

// ============================================
// FEATURE COMPONENT MAP
// ============================================

/**
 * Maps feature component names (from featureRegistry) to actual components.
 * Used by PASCOFeatures to dynamically render features.
 */
export const FEATURE_COMPONENTS: Record<string, ComponentType<any>> = {
  // Social Learner Features
  ReelsPage,
  MessagesPage,
  StudyGroupsPage,
  QuizzesPage,

  // Academic Achiever Features
  AdvancedAnalyticsPage,
  LeaderboardPage,
  ReadinessScorePage,
  TestAnalyticsPage,

  // Creative Explorer Features
  MindMapStudio,
  FocusTimer,
  SmartCalendar,
};

/**
 * Get feature component by name
 */
export function getFeatureComponent(componentName: string): ComponentType<any> | null {
  return FEATURE_COMPONENTS[componentName] || null;
}

// Re-export for convenience
export {
  ReelsPage,
  MessagesPage,
  StudyGroupsPage,
  QuizzesPage,
  AdvancedAnalyticsPage,
  LeaderboardPage,
  ReadinessScorePage,
  TestAnalyticsPage,
  MindMapStudio,
  FocusTimer,
  SmartCalendar,
};
