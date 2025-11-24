// Leadership Positions Data
import type { LeadershipPosition } from '../types/activityHub';

export const leadershipPositions: LeadershipPosition[] = [
  {
    id: 'pos-1',
    positionTitle: 'president',
    activityName: 'Debate Club',
    activityId: 'act-1',
    responsibilities: ['Lead club meetings', 'Organize competitions', 'Mentor members', 'Coordinate with faculty'],
    eligibility: ['Active member for 1+ year', 'Grade 10 or above', 'Strong leadership skills'],
    term: '2025-2026',
    applicationDeadline: '2025-01-31',
    status: 'open',
    timeCommitment: '6-8 hours/week',
    benefits: ['Leadership certificate', 'College application boost', 'Skill development']
  },
  {
    id: 'pos-2',
    positionTitle: 'vice-president',
    activityName: 'Robotics Club',
    activityId: 'act-2',
    responsibilities: ['Assist president', 'Manage projects', 'Train new members'],
    eligibility: ['Active member', 'Technical proficiency', 'Grade 9+'],
    term: '2025-2026',
    applicationDeadline: '2025-02-05',
    status: 'open',
    timeCommitment: '5-7 hours/week'
  },
  {
    id: 'pos-3',
    positionTitle: 'secretary',
    activityName: 'Environmental Club',
    activityId: 'act-5',
    responsibilities: ['Maintain records', 'Coordinate events', 'Communication'],
    eligibility: ['Organizational skills', 'Regular attendance', 'Grade 9+'],
    term: '2025-2026',
    applicationDeadline: '2025-02-10',
    status: 'open',
    timeCommitment: '4-5 hours/week'
  }
];
