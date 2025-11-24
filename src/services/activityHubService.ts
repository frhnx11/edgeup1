// Activity Hub Service - manages user data and interactions
import type { UserActivityData, EventReminder, LeadershipApplication, Performance } from '../types/activityHub';

const STORAGE_KEY = 'activity_hub_data';

const getDefaultData = (): UserActivityData => ({
  enrolledActivities: ['act-1', 'act-2', 'act-6', 'act-11', 'act-17'], // Pre-enrolled in some activities
  registeredEvents: ['evt-2'], // Pre-registered for workshop
  eventReminders: [{ eventId: 'evt-2', reminderDate: '2025-01-27', enabled: true }],
  achievements: [],
  applications: [],
  performances: []
});

export const getUserActivityData = (): UserActivityData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultData();
  } catch {
    return getDefaultData();
  }
};

export const saveUserActivityData = (data: UserActivityData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

export const enrollInActivity = (activityId: string): boolean => {
  const data = getUserActivityData();
  if (!data.enrolledActivities.includes(activityId)) {
    data.enrolledActivities.push(activityId);
    return saveUserActivityData(data);
  }
  return false;
};

export const unenrollFromActivity = (activityId: string): boolean => {
  const data = getUserActivityData();
  data.enrolledActivities = data.enrolledActivities.filter(id => id !== activityId);
  return saveUserActivityData(data);
};

export const registerForEvent = (eventId: string): boolean => {
  const data = getUserActivityData();
  if (!data.registeredEvents.includes(eventId)) {
    data.registeredEvents.push(eventId);
    return saveUserActivityData(data);
  }
  return false;
};

export const unregisterFromEvent = (eventId: string): boolean => {
  const data = getUserActivityData();
  data.registeredEvents = data.registeredEvents.filter(id => id !== eventId);
  data.eventReminders = data.eventReminders.filter(r => r.eventId !== eventId);
  return saveUserActivityData(data);
};

export const setEventReminder = (reminder: EventReminder): boolean => {
  const data = getUserActivityData();
  const existingIndex = data.eventReminders.findIndex(r => r.eventId === reminder.eventId);
  if (existingIndex >= 0) {
    data.eventReminders[existingIndex] = reminder;
  } else {
    data.eventReminders.push(reminder);
  }
  return saveUserActivityData(data);
};

export const submitApplication = (application: LeadershipApplication): boolean => {
  const data = getUserActivityData();
  data.applications.push(application);
  return saveUserActivityData(data);
};

export const registerPerformance = (performance: Performance): boolean => {
  const data = getUserActivityData();
  data.performances.push(performance);
  return saveUserActivityData(data);
};

export const getActivityStats = () => {
  const data = getUserActivityData();
  return {
    totalActivitiesEnrolled: data.enrolledActivities.length,
    totalEventsRegistered: data.registeredEvents.length,
    totalAchievements: data.achievements.length,
    totalLeadershipPositions: data.applications.length,
    totalPerformances: data.performances.length
  };
};
