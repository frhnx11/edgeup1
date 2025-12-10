import { useState, useEffect } from 'react';
import { Breadcrumb } from '../../../../components/upsc/common/Breadcrumb';
import { ProfileHeader } from '../../../../components/upsc/common/profile/ProfileHeader';
import { CourseDetails } from '../../../../components/upsc/common/profile/CourseDetails';
import { AdminReports } from '../../../../components/upsc/common/profile/AdminReports';
import { LoginActivity } from '../../../../components/upsc/common/profile/LoginActivity';
import { LastAccessedCourses } from '../../../../components/upsc/common/profile/LastAccessedCourses';
import { ProfileSidebar } from '../../../../components/upsc/common/profile/ProfileSidebar';
import { ActivityStats } from '../../../../components/upsc/common/profile/ActivityStats';
import { Footer } from '../../../../components/upsc/common/Footer';
import { useParams } from 'react-router-dom';

// Types for user profile data
interface UserProfile {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  avatar?: string;
  preferredLanguage: string;
  firstAccess: string;
  lastAccess: string;
  coursesTeaching: number;
  coursesEnrolled: number;
  profileViews: number;
}

// Types for course data
interface Course {
  id: string;
  title: string;
  lastAccessed: string;
  image?: string;
  progress: number;
}

export function ProfileViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [lastAccessedCourses, setLastAccessedCourses] = useState<Course[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call with setTimeout
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual API calls
        // Simulated data
        const mockUserProfile: UserProfile = {
          id: userId || '1',
          firstName: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          preferredLanguage: 'English',
          firstAccess: '2023-01-15T10:30:00',
          lastAccess: '2023-06-13T15:45:00',
          coursesTeaching: 5,
          coursesEnrolled: 12,
          profileViews: 245
        };
        
        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'Indian Polity & Constitution',
            lastAccessed: '2023-06-12T14:30:00',
            progress: 65
          },
          {
            id: '2',
            title: 'Economy & Budget Analysis',
            lastAccessed: '2023-06-10T09:15:00',
            progress: 42
          },
          {
            id: '3',
            title: 'Indian History',
            lastAccessed: '2023-06-08T16:45:00',
            progress: 78
          }
        ];
        
        setUserProfile(mockUserProfile);
        setLastAccessedCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading profile data...</div>;
  }

  if (!userProfile) {
    return <div className="p-8 text-center">User profile not found.</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Users', link: '/users' },
    { label: `${userProfile.firstName} ${userProfile.surname}`, link: '' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <ProfileHeader 
            firstName={userProfile.firstName}
            surname={userProfile.surname}
            email={userProfile.email}
            avatar={userProfile.avatar}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <CourseDetails userId={userProfile.id} />
            <AdminReports userId={userProfile.id} />
            <LoginActivity userId={userProfile.id} />
            <LastAccessedCourses courses={lastAccessedCourses} />
          </div>
          
          {/* Right Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <ProfileSidebar 
              firstName={userProfile.firstName}
              surname={userProfile.surname}
              email={userProfile.email}
              preferredLanguage={userProfile.preferredLanguage}
              firstAccess={userProfile.firstAccess}
              lastAccess={userProfile.lastAccess}
            />
            <ActivityStats 
              coursesTeaching={userProfile.coursesTeaching}
              coursesEnrolled={userProfile.coursesEnrolled}
              profileViews={userProfile.profileViews}
            />
          </div>
        </div>
        
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}
