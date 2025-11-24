import { UPSCHeader } from './UPSCHeader';
import { UPSCActionCards } from './UPSCActionCards';
import { UPSCRecentCourses } from './UPSCRecentCourses';
import { UPSCYourCourses } from './UPSCYourCourses';
import { UPSCGrading } from './UPSCGrading';
import { UPSCTimeline } from './UPSCTimeline';
import { UPSCStatsPanel } from './UPSCStatsPanel';
import { UPSCUpcomingEvents } from './UPSCUpcomingEvents';
import { UPSCLatestBadges } from './UPSCLatestBadges';
import { UPSCCalendar } from './UPSCCalendar';

export function UPSCDashboardContent() {
  // User data - would typically come from authentication context or API
  const userName = "Admin";
  
  return (
    <div className="bg-gray-50">
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
