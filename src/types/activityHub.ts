// Types for Extracurricular Activity Hub

export type ActivityCategory = 'sports' | 'arts' | 'academic' | 'social' | 'tech' | 'cultural' | 'service';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type EnrollmentStatus = 'enrolled' | 'available' | 'full' | 'waitlist';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  instructor: string;
  skillLevel: SkillLevel;
  schedule: string;
  location: string;
  enrollmentStatus: EnrollmentStatus;
  currentParticipants: number;
  maxCapacity: number;
  startDate: string;
  endDate?: string;
  benefits: string[];
  requirements?: string[];
  image?: string;
}

export type EventType = 'competition' | 'workshop' | 'seminar' | 'performance' | 'meeting' | 'social' | 'sports' | 'cultural';
export type RegistrationStatus = 'open' | 'closed' | 'registered' | 'waitlist';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  registrationDeadline: string;
  registrationStatus: RegistrationStatus;
  maxParticipants?: number;
  currentParticipants?: number;
  category: ActivityCategory;
  requirements?: string[];
  benefits?: string[];
  contactEmail?: string;
}

export interface EventReminder {
  eventId: string;
  reminderDate: string;
  enabled: boolean;
}

export type AchievementType = 'certificate' | 'award' | 'completion' | 'participation' | 'leadership';

export interface ActivityAchievement {
  id: string;
  title: string;
  type: AchievementType;
  activityName: string;
  issuedBy: string;
  issuedDate: string;
  description: string;
  category: ActivityCategory;
  certificateUrl?: string;
  verificationCode?: string;
}

export type ApplicationStatus = 'not_applied' | 'applied' | 'under_review' | 'accepted' | 'rejected';
export type PositionType = 'president' | 'vice-president' | 'secretary' | 'treasurer' | 'coordinator' | 'member';

export interface LeadershipPosition {
  id: string;
  positionTitle: PositionType;
  activityName: string;
  activityId: string;
  responsibilities: string[];
  eligibility: string[];
  term: string; // e.g., "2024-2025"
  applicationDeadline: string;
  status: 'open' | 'closed';
  benefits?: string[];
  timeCommitment: string;
}

export interface LeadershipApplication {
  id: string;
  positionId: string;
  studentId: string;
  applicationDate: string;
  status: ApplicationStatus;
  motivation: string;
  experience: string;
  skills: string[];
  references?: string[];
  reviewNotes?: string;
  reviewDate?: string;
}

export type ShowcaseType = 'competition' | 'concert' | 'exhibition' | 'performance' | 'presentation' | 'tournament';
export type PerformanceStatus = 'registered' | 'confirmed' | 'performed' | 'cancelled';

export interface ShowcaseOpportunity {
  id: string;
  title: string;
  type: ShowcaseType;
  date: string;
  time: string;
  venue: string;
  category: ActivityCategory;
  description: string;
  audience: string; // e.g., "Students & Parents", "Public Event"
  registrationDeadline: string;
  slotsAvailable: number;
  totalSlots: number;
  requirements: string[];
  prizes?: string[];
  judgingCriteria?: string[];
}

export interface Performance {
  id: string;
  showcaseId: string;
  studentId: string;
  performanceTitle: string;
  description: string;
  registrationDate: string;
  status: PerformanceStatus;
  slot?: string;
  feedback?: string;
  rating?: number; // 1-5
  mediaUrls?: string[];
}

export interface ActivityHubStats {
  totalActivitiesEnrolled: number;
  totalEventsRegistered: number;
  totalAchievements: number;
  totalLeadershipPositions: number;
  totalPerformances: number;
}

export interface UserActivityData {
  enrolledActivities: string[]; // Activity IDs
  registeredEvents: string[]; // Event IDs
  eventReminders: EventReminder[];
  achievements: ActivityAchievement[];
  applications: LeadershipApplication[];
  performances: Performance[];
}
