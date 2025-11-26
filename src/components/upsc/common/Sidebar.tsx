import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Calendar,
  ClipboardCheck as ChalkboardTeacher,
  TrendingUp,
  CheckSquare,
  BookOpen,
  Map,
  Cpu,
  Search,
  LogOut,
  Brain,
  LayoutDashboard,
  GraduationCap,
  FileText,
  ClipboardCheck,
  Target,
  Laptop,
  ChevronDown,
  Shield,
  User,
  Play,
  Users,
  MessageCircle,
  Trophy,
  BarChart3,
  Award,
  Gauge,
  ClipboardList,
  Menu,
  X,
  Volume2,
  VolumeX,
  MessageSquare,
  MessageSquareOff
} from 'lucide-react';
import { useRole } from '../../../contexts/RoleContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const { currentRole, setRole } = useRole();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    return localStorage.getItem('eustad-audio-muted') === 'true';
  });
  const [isTextDisabled, setIsTextDisabled] = useState(() => {
    return localStorage.getItem('eustad-text-disabled') === 'true';
  });

  // Toggle audio mute
  const toggleAudioMute = () => {
    const newMuted = !isAudioMuted;
    setIsAudioMuted(newMuted);
    localStorage.setItem('eustad-audio-muted', String(newMuted));
  };

  // Toggle text popups
  const toggleTextPopups = () => {
    const newDisabled = !isTextDisabled;
    setIsTextDisabled(newDisabled);
    localStorage.setItem('eustad-text-disabled', String(newDisabled));
  };

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user's stage and personality type
  const userStage = localStorage.getItem('userStage') || 'upsc';
  const userStudentType = localStorage.getItem('userStudentType') || 'social-learner';
  // Route based on personality type
  const basePath = `/${userStage}/${userStudentType}/student`;

  // Features ONLY for social-learner
  const socialLearnerOnly = ['Social Learner'];

  // Features ONLY for academic-achiever
  const academicAchieverOnly = ['Academic Achiever'];

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { path: `${basePath}/dashboard`, icon: LayoutDashboard, label: 'Overview' },
        { path: `${basePath}/social-learner`, icon: Users, label: 'Social Learner' },
        { path: `${basePath}/academic-achiever`, icon: Trophy, label: 'Academic Achiever' },
      ]
    },
    {
      title: 'Study',
      items: [
        { path: `${basePath}/study`, icon: BookOpen, label: 'Study' }
      ]
    },
    {
      title: 'Development',
      items: [
        { path: `${basePath}/development`, icon: Target, label: 'Development' }
      ]
    },
    {
      title: 'Personal',
      items: [
        { path: `${basePath}/personal`, icon: User, label: 'Personal' }
      ]
    }
  ].map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (userStudentType === 'academic-achiever') {
        // For academic-achiever: show Academic Achiever, hide Social Learner
        return !socialLearnerOnly.includes(item.label);
      } else {
        // For social-learner: show Social Learner, hide Academic Achiever
        return !academicAchieverOnly.includes(item.label);
      }
    })
  }));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white w-72 h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      {/* Logo with Text & Audio Toggles */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <img
          src="/Logo.png"
          alt="Edgeup Logo"
          className="h-12 object-contain"
        />
        <div className="flex items-center gap-2">
          {/* Text Popup Toggle */}
          <button
            onClick={toggleTextPopups}
            className={`p-2.5 rounded-xl transition-all ${
              isTextDisabled
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
            }`}
            title={isTextDisabled ? 'Enable Text Popups' : 'Disable Text Popups'}
          >
            {isTextDisabled ? (
              <MessageSquareOff className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </button>
          {/* Audio Toggle */}
          <button
            onClick={toggleAudioMute}
            className={`p-2.5 rounded-xl transition-all ${
              isAudioMuted
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
            }`}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 bg-brand-primary/5 mx-4 mt-4 rounded-xl text-center">
        <div className="relative">
          <div
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden"
          >
            {/* Human Vector Outline */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-16 h-16 text-brand-primary/30"
            >
              {/* Head */}
              <circle cx="12" cy="8" r="4" />
              {/* Body */}
              <path d="M12 12c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
            </svg>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">{userData.name || 'Student'}</h3>
        <p className="text-brand-primary font-medium text-sm">UPSC Civil Services</p>
        <p className="text-gray-500 text-sm">Expected: May 2025</p>

        {/* Role Selector Dropdown */}
        <div className="relative mt-4">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white rounded-lg border-2 border-brand-primary/20 hover:border-brand-primary/40 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              {currentRole === 'student' ? (
                <User className="w-4 h-4 text-brand-primary" />
              ) : (
                <Shield className="w-4 h-4 text-purple-600" />
              )}
              <span className="font-medium text-gray-900 capitalize">{currentRole}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showRoleDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border-2 border-gray-200 shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setRole('student');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  currentRole === 'student'
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Student</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {menuSections.map((section, index) => (
          <div key={index}>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === item.path
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-700 hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Monthly Progress */}
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Monthly Progress</h3>
            <span className="text-brand-primary font-semibold">75%</span>
          </div>
          <div className="h-2 bg-brand-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}