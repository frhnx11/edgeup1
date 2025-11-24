/**
 * Teacher Curriculum Service
 * Provides curriculum data access for teacher module features
 * Includes helpers for assignment creation, grading, and curriculum management
 */

import {
  TN_BOARD_10TH_CURRICULUM,
  getSubjectById,
  getSubjectByName,
  getSubjectUnits,
  getUnitById,
  getUnitTopics,
  getTopicById,
  getTopicsByDifficulty,
  searchTopics
} from '../data/tn-board-10th-curriculum';

import {
  TN_BOARD_10TH_STUDY_RESOURCES,
  TN_BOARD_10TH_TEST_TEMPLATES,
  getResourcesBySubject,
  getResourcesByUnit,
  getResourcesByTopic,
  getTestsBySubject,
  getTestsByUnit
} from '../data/tn-board-10th-resources';

import type {
  CurriculumSubject,
  CurriculumUnit,
  CurriculumTopic,
  StudyResource,
  TestTemplate,
  QuestionType,
  DifficultyLevel,
  BloomLevel
} from '../types/curriculum.types';

/**
 * Get all available subjects for the curriculum
 */
export const getAllSubjects = (): CurriculumSubject[] => {
  return TN_BOARD_10TH_CURRICULUM;
};

/**
 * Get subject information by ID
 */
export const getSubject = (subjectId: string): CurriculumSubject | undefined => {
  return getSubjectById(subjectId);
};

/**
 * Get subject by name (case-insensitive)
 */
export const findSubjectByName = (subjectName: string): CurriculumSubject | undefined => {
  return getSubjectByName(subjectName);
};

/**
 * Get all units for a specific subject
 */
export const getUnitsForSubject = (subjectId: string): CurriculumUnit[] => {
  return getSubjectUnits(subjectId);
};

/**
 * Get unit information
 */
export const getUnit = (subjectId: string, unitId: string): CurriculumUnit | undefined => {
  return getUnitById(subjectId, unitId);
};

/**
 * Get all topics for a unit
 */
export const getTopicsForUnit = (subjectId: string, unitId: string): CurriculumTopic[] => {
  return getUnitTopics(subjectId, unitId);
};

/**
 * Get topic information
 */
export const getTopic = (
  subjectId: string,
  unitId: string,
  topicId: string
): CurriculumTopic | undefined => {
  return getTopicById(subjectId, unitId, topicId);
};

/**
 * Get topics filtered by difficulty level
 */
export const getTopicsByDifficultyLevel = (
  subjectId: string,
  difficulty: DifficultyLevel
): Array<CurriculumTopic & { unitTitle: string }> => {
  return getTopicsByDifficulty(subjectId, difficulty);
};

/**
 * Search topics by keyword across all subjects
 */
export const searchCurriculumTopics = (keyword: string) => {
  return searchTopics(keyword);
};

/**
 * Get suitable question types for a topic
 */
export const getQuestionTypesForTopic = (
  subjectId: string,
  unitId: string,
  topicId: string
): QuestionType[] => {
  const topic = getTopic(subjectId, unitId, topicId);
  return topic?.questionTypes || [];
};

/**
 * Get learning objectives for a topic
 */
export const getLearningObjectives = (
  subjectId: string,
  unitId: string,
  topicId: string
): string[] => {
  const topic = getTopic(subjectId, unitId, topicId);
  return topic?.learningObjectives || [];
};

/**
 * Get key terms for a topic
 */
export const getKeyTerms = (
  subjectId: string,
  unitId: string,
  topicId: string
): string[] => {
  const topic = getTopic(subjectId, unitId, topicId);
  return topic?.keyTerms || [];
};

/**
 * Get Bloom's taxonomy levels for a topic
 */
export const getBloomLevels = (
  subjectId: string,
  unitId: string,
  topicId: string
): BloomLevel[] => {
  const topic = getTopic(subjectId, unitId, topicId);
  return topic?.bloomLevels || [];
};

/**
 * Get all study resources for a subject
 */
export const getResourcesForSubject = (subjectId: string): StudyResource[] => {
  return getResourcesBySubject(subjectId);
};

/**
 * Get study resources for a specific unit
 */
export const getResourcesForUnit = (subjectId: string, unitId: string): StudyResource[] => {
  return getResourcesByUnit(subjectId, unitId);
};

/**
 * Get study resources related to a specific topic
 */
export const getResourcesForTopic = (topicId: string): StudyResource[] => {
  return getResourcesByTopic(topicId);
};

/**
 * Get all tests for a subject
 */
export const getTestsForSubject = (subjectId: string): TestTemplate[] => {
  return getTestsBySubject(subjectId);
};

/**
 * Get tests for a specific unit
 */
export const getTestsForUnit = (subjectId: string, unitId: string): TestTemplate[] => {
  return getTestsByUnit(subjectId, unitId);
};

/**
 * Get suggested topics for assignment creation based on class progress
 * Returns topics that are currently being studied (not completed yet)
 */
export const getSuggestedTopicsForAssignment = (subjectId: string): Array<{
  topic: CurriculumTopic;
  unitTitle: string;
  unitId: string;
}> => {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  const suggestions: Array<{
    topic: CurriculumTopic;
    unitTitle: string;
    unitId: string;
  }> = [];

  for (const unit of subject.units) {
    for (const topic of unit.topics) {
      // Suggest topics that are in progress (not completed)
      if (!topic.completed) {
        suggestions.push({
          topic,
          unitTitle: unit.title,
          unitId: unit.id
        });
      }
    }
  }

  return suggestions;
};

/**
 * Get topic distribution for a subject
 * Useful for understanding curriculum coverage
 */
export const getTopicDistribution = (subjectId: string) => {
  const subject = getSubject(subjectId);
  if (!subject) return null;

  const distribution = {
    total: 0,
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    byUnit: subject.units.map(unit => ({
      unitId: unit.id,
      unitTitle: unit.title,
      topicCount: unit.topics.length
    }))
  };

  for (const unit of subject.units) {
    for (const topic of unit.topics) {
      distribution.total++;
      distribution.byDifficulty[topic.difficulty]++;
    }
  }

  return distribution;
};

/**
 * Get recommended question distribution for a topic based on its metadata
 */
export const getRecommendedQuestionDistribution = (
  subjectId: string,
  unitId: string,
  topicId: string
) => {
  const topic = getTopic(subjectId, unitId, topicId);
  if (!topic) return null;

  const distribution: Record<QuestionType, number> = {
    mcq: 0,
    'short-answer': 0,
    'long-answer': 0,
    practical: 0,
    theory: 0
  };

  // Calculate percentage based on available question types
  const typeCount = topic.questionTypes.length;
  const basePercentage = Math.floor(100 / typeCount);

  topic.questionTypes.forEach((type, index) => {
    distribution[type] = index === 0 ? basePercentage + (100 % typeCount) : basePercentage;
  });

  return distribution;
};

/**
 * Validate if selected topics are from the same subject
 */
export const validateTopicSelection = (topicIds: string[]): {
  valid: boolean;
  message?: string;
  subjectId?: string;
} => {
  if (topicIds.length === 0) {
    return { valid: false, message: 'No topics selected' };
  }

  // Find all topics and check if they belong to the same subject
  const topicSubjects = new Set<string>();

  for (const subject of TN_BOARD_10TH_CURRICULUM) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        if (topicIds.includes(topic.id)) {
          topicSubjects.add(subject.id);
        }
      }
    }
  }

  if (topicSubjects.size === 0) {
    return { valid: false, message: 'Invalid topic IDs' };
  }

  if (topicSubjects.size > 1) {
    return {
      valid: false,
      message: 'Selected topics must be from the same subject'
    };
  }

  return {
    valid: true,
    subjectId: Array.from(topicSubjects)[0]
  };
};

/**
 * Get curriculum statistics for dashboard/overview
 */
export const getCurriculumStats = () => {
  let totalTopics = 0;
  let totalUnits = 0;
  const subjectCount = TN_BOARD_10TH_CURRICULUM.length;

  for (const subject of TN_BOARD_10TH_CURRICULUM) {
    totalUnits += subject.units.length;
    totalTopics += subject.totalTopics;
  }

  return {
    subjects: subjectCount,
    units: totalUnits,
    topics: totalTopics,
    resources: TN_BOARD_10TH_STUDY_RESOURCES.length,
    tests: TN_BOARD_10TH_TEST_TEMPLATES.length
  };
};

/**
 * Export helper functions from curriculum data
 */
export {
  getSubjectById,
  getSubjectByName,
  getSubjectUnits,
  getUnitById,
  getUnitTopics,
  getTopicById,
  getTopicsByDifficulty,
  searchTopics
};

/**
 * Export helper functions from resources data
 */
export {
  getResourcesBySubject,
  getResourcesByUnit,
  getResourcesByTopic,
  getTestsBySubject,
  getTestsByUnit
};
