import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { 
  Brain, 
  Target, 
  Clock, 
  Calendar,
  Activity, 
  Users,
  Lightbulb, 
  CheckCircle,
  BarChart2,
  FileText,
  Video,
  Headphones,
  PenTool,
  Map
} from 'lucide-react';

interface StudentProfile {
  name: string;
  learningStyle: {
    primary: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    secondary: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  };
  targetExam: string;
  targetYear: string;
  focusAreas: string[];
  studyHours: number;
}

interface DailySchedule {
  day: string;
  sessions: {
    time: string;
    duration: string;
    subject: string;
    topic: string;
    activities: {
      type: string;
      description: string;
    }[];
  }[];
}

interface LearningResource {
  title: string;
  type: 'video' | 'document' | 'audio' | 'interactive';
  style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  url: string;
  duration?: string;
  description: string;
}

export function AILearningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'resources' | 'progress'>('overview');
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const testData = JSON.parse(localStorage.getItem('testData') || '{}');
        const goalData = JSON.parse(localStorage.getItem('goalData') || '{}');

        // Add validation for testData.answers
        if (!userData || !testData || !goalData || !Array.isArray(testData.answers)) {
          navigate('/login');
          return;
        }

        // Calculate VARK profile from test answers
        const varkAnswers = testData.answers.slice(0, 4);
        const varkScores = {
          visual: 0,
          auditory: 0,
          reading: 0,
          kinesthetic: 0
        };

        varkAnswers.forEach((answer: number, index: number) => {
          if (answer === null) return;
          if (answer === 0) varkScores.visual += 25;
          else if (answer === 1) varkScores.auditory += 25;
          else if (answer === 2) varkScores.reading += 25;
          else if (answer === 3) varkScores.kinesthetic += 25;
        });

        // Determine primary and secondary learning styles
        const styles = Object.entries(varkScores)
          .sort(([,a], [,b]) => b - a)
          .map(([style]) => style as 'visual' | 'auditory' | 'reading' | 'kinesthetic');

        const profile: StudentProfile = {
          name: userData.name,
          learningStyle: {
            primary: styles[0],
            secondary: styles[1]
          },
          targetExam: goalData.targetExam || 'UPSC CSE',
          targetYear: goalData.examYear || '2025',
          focusAreas: goalData.subjects || ["Indian Polity", "Geography", "Economics"],
          studyHours: parseInt(goalData.studyHours) || 7
        };

        setStudentProfile(profile);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user profile:', error);
        navigate('/login');
      }
    };

    loadUserProfile();
  }, [navigate]);

  if (loading || !studentProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  // Sample weekly schedule
  const weeklySchedule: Record<string, DailySchedule> = {
    monday: {
      day: "Monday",
      sessions: [
        {
          time: "Morning",
          duration: "3 hours",
          subject: "Modern History",
          topic: "Indian National Movement (1857-1900)",
          activities: [
            { type: "Visual Learning", description: "Study timeline infographics" },
            { type: "Reading", description: "NCERT Chapter 3" },
            { type: "Practice", description: "Create mind maps" },
            { type: "Assessment", description: "10 practice questions" }
          ]
        },
        {
          time: "Afternoon",
          duration: "2 hours",
          subject: "Geography",
          topic: "Climate",
          activities: [
            { type: "Video", description: "Watch lecture on monsoon patterns" },
            { type: "Interactive", description: "Map exercises" },
            { type: "Notes", description: "Color-coded note making" }
          ]
        },
        {
          time: "Evening",
          duration: "2 hours",
          subject: "Current Affairs",
          topic: "Daily Analysis",
          activities: [
            { type: "Audio", description: "News summary" },
            { type: "Reading", description: "Magazine analysis" },
            { type: "Writing", description: "Opinion piece" }
          ]
        }
      ]
    }
    // Add other days similarly
  };

  // Sample learning resources
  const learningResources: LearningResource[] = [
    {
      title: "Introduction to Preamble",
      type: "video",
      style: "visual",
      url: "https://www.youtube.com/watch?v=F3Nfz0--5TQ",
      duration: "1 hour 15 minutes",
      description: "Comprehensive overview of the Indian Constitution's Preamble and its key elements"
    },
    {
      title: "Geography Concept Maps",
      type: "document",
      style: "visual",
      url: "https://example.com/doc1",
      description: "Visual representation of geographical concepts"
    },
    {
      title: "Economics Audio Lectures",
      type: "audio",
      style: "auditory",
      url: "https://example.com/audio1",
      duration: "2 hours",
      description: "Detailed audio explanations of economic concepts"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Personalized UPSC Preparation Plan</h1>
              <p className="opacity-90">AI-powered learning path tailored to your style and goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5" />
                <span>Learning Style</span>
              </div>
              <div className="text-2xl font-bold">{studentProfile.learningStyle.primary}</div>
              <div className="text-sm opacity-80">Primary preference</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span>Target Exam</span>
              </div>
              <div className="text-2xl font-bold">{studentProfile.targetExam}</div>
              <div className="text-sm opacity-80">{studentProfile.targetYear}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span>Study Hours</span>
              </div>
              <div className="text-2xl font-bold">{studentProfile.studyHours}</div>
              <div className="text-sm opacity-80">hours per day</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5" />
                <span>Focus Areas</span>
              </div>
              <div className="text-2xl font-bold">{studentProfile.focusAreas.length}</div>
              <div className="text-sm opacity-80">core subjects</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily Schedule
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'resources'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Learning Resources
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'progress'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Progress Tracking
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Student Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium">{studentProfile.name}</div>
                    <div className="text-sm text-gray-600">{studentProfile.targetExam} Aspirant</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Primary Style</div>
                    <div className="font-medium capitalize">{studentProfile.learningStyle.primary}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Secondary Style</div>
                    <div className="font-medium capitalize">{studentProfile.learningStyle.secondary}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Focus Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium">Current Week</div>
                    <div className="text-sm text-gray-600">February 12 - February 18</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Weekly Goals</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Complete Constitutional Framework fundamentals</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Practice 5 Geography mock tests</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      <span>Revise Economic Reforms chapter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Daily Schedule</h2>
                <div className="flex gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedDay === day
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6">
              {weeklySchedule[selectedDay]?.sessions.map((session, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium">{session.time} Session</div>
                      <div className="text-sm text-gray-600">{session.duration}</div>
                    </div>
                  </div>
                  <div className="ml-16">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{session.subject}</h3>
                          <p className="text-sm text-gray-600">{session.topic}</p>
                        </div>
                        <span className="text-sm text-gray-600">{session.duration}</span>
                      </div>
                      <div className="space-y-2">
                        {session.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                            <span className="font-medium">{activity.type}:</span>
                            <span className="text-gray-600">{activity.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      resource.type === 'video' ? 'bg-blue-50 text-blue-600' :
                      resource.type === 'document' ? 'bg-green-50 text-green-600' :
                      resource.type === 'audio' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                      {resource.type === 'video' && <Video className="w-6 h-6" />}
                      {resource.type === 'document' && <FileText className="w-6 h-6" />}
                      {resource.type === 'audio' && <Headphones className="w-6 h-6" />}
                      {resource.type === 'interactive' && <PenTool className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          resource.style === 'visual' ? 'bg-blue-50 text-blue-600' :
                          resource.style === 'auditory' ? 'bg-green-50 text-green-600' :
                          resource.style === 'reading' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {resource.style} learners
                        </span>
                        {resource.duration && (
                          <span className="text-sm text-gray-600">{resource.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <a
                    href={resource.url}
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      if (resource.type === 'video') {
                        navigate(`/module/indian-polity/topic/constitution/content/content-1`);
                      } else {
                        window.open(resource.url, '_blank');
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Access Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Progress Overview</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                    <div className="text-2xl font-bold">75%</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Subject Progress</span>
                    <span className="text-gray-600">Last Updated: Today</span>
                  </div>
                  <div className="space-y-4">
                    {studentProfile.focusAreas.map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject}</span>
                          <span className="font-medium">
                            {Math.floor(Math.random() * 30) + 70}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Weekly Performance</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Study Hours</div>
                    <div className="text-2xl font-bold">28.5</div>
                    <div className="text-sm text-green-600">+2.5 hrs vs last week</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Tests Taken</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-green-600">85% average score</div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-4">Daily Study Hours</div>
                  <div className="h-40 flex items-end justify-between">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 bg-indigo-600 rounded-t"
                          style={{ height: `${(Math.random() * 100)}px` }}
                        />
                        <span className="text-xs text-gray-600">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}