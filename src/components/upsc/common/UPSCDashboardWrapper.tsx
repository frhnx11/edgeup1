import { UPSCHeader } from './upsc/UPSCHeader';
import { UPSCActionCards } from './upsc/UPSCActionCards';
import { UPSCRecentCourses } from './upsc/UPSCRecentCourses';
import { UPSCYourCourses } from './upsc/UPSCYourCourses';
import { UPSCGrading } from './upsc/UPSCGrading';
import { UPSCTimeline } from './upsc/UPSCTimeline';
import { UPSCStatsPanel } from './upsc/UPSCStatsPanel';
import { UPSCUpcomingEvents } from './upsc/UPSCUpcomingEvents';
import { UPSCLatestBadges } from './upsc/UPSCLatestBadges';
import { UPSCCalendar } from './upsc/UPSCCalendar';

/**
 * Wrapper component for UPSC Dashboard to avoid module resolution issues
 */
export function UPSCDashboardWrapper() {
  // User data - would typically come from authentication context or API
  const userName = "Admin";
  
  return (
    <div className="bg-gray-50 p-6">
      {/* Header */}
      <UPSCHeader userName={userName} />
      
      {/* Action Cards */}
      <UPSCActionCards />
      
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        {/* Main Content - Left 2/3 */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Recently Accessed Courses */}
          <UPSCRecentCourses />
          
          {/* Your Courses Grid */}
          <UPSCYourCourses />
        </div>
        
        {/* Right Panel - 1/3 */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Stats Panel */}
          <UPSCStatsPanel />
          
          {/* Grading Panel */}
          <UPSCGrading />
          
          {/* Timeline */}
          <UPSCTimeline />
          
          {/* Upcoming Events */}
          <UPSCUpcomingEvents />
          
          {/* Latest Badges */}
          <UPSCLatestBadges />
          
          {/* Calendar */}
          <UPSCCalendar />
        </div>
      </div>
      
      {/* Footer with copyright info */}
      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>© UPSC Preparation LMS 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}
