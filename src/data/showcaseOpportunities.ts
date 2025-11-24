// Showcase Opportunities Data
import type { ShowcaseOpportunity } from '../types/activityHub';

export const showcaseOpportunities: ShowcaseOpportunity[] = [
  {
    id: 'show-1',
    title: 'Annual Talent Show',
    type: 'performance',
    date: '2025-03-15',
    time: '6:00 PM',
    venue: 'Main Auditorium',
    category: 'arts',
    description: 'Showcase your talents in singing, dancing, comedy, magic, or any performing art.',
    audience: 'Students, Parents & Guests',
    registrationDeadline: '2025-03-05',
    slotsAvailable: 15,
    totalSlots: 20,
    requirements: ['Audition required', 'Performance duration: 3-5 minutes'],
    prizes: ['Winner: ₹5000', 'Runner-up: ₹3000', 'Certificates for all']
  },
  {
    id: 'show-2',
    title: 'Science Project Exhibition',
    type: 'exhibition',
    date: '2025-02-25',
    time: '10:00 AM',
    venue: 'Science Block',
    category: 'academic',
    description: 'Display innovative science projects and compete for best project award.',
    audience: 'School Community',
    registrationDeadline: '2025-02-15',
    slotsAvailable: 30,
    totalSlots: 40,
    requirements: ['Working project model', 'Presentation poster'],
    judgingCriteria: ['Innovation', 'Scientific accuracy', 'Presentation']
  },
  {
    id: 'show-3',
    title: 'Coding Hackathon',
    type: 'competition',
    date: '2025-02-20',
    time: '9:00 AM',
    venue: 'Computer Lab',
    category: 'tech',
    description: '24-hour coding competition to build innovative software solutions.',
    audience: 'Tech Enthusiasts',
    registrationDeadline: '2025-02-10',
    slotsAvailable: 20,
    totalSlots: 30,
    requirements: ['Team of 2-4 members', 'Own laptop'],
    prizes: ['1st Prize: ₹10000', '2nd Prize: ₹5000']
  }
];
