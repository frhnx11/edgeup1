import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  LogOut,
  Award,
  ChevronDown,
  User
} from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
// import { PASCOMeter } from '../components/upsc/common/PASCOMeter';
// import { useIdleDetection } from '../hooks/usePASCOTracking';
// import { usePASCOStore } from '../store/usePASCOStore';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setRole } = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin/mentor-pasco-test', icon: Award, label: 'Mentor PASCO Test' }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 text-xl font-semibold text-[#094d88]">
              <Shield className="w-8 h-8" />
              <span>Admin Panel</span>
            </div>
          </div>

          {/* User Profile with Role Selector */}
          <div className="p-6 bg-[#094d88]/5 mx-4 mt-4 rounded-xl text-center">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                {/* Human Vector Outline */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-16 h-16 text-[#094d88]/30"
                >
                  {/* Head */}
                  <circle cx="12" cy="8" r="4" />
                  {/* Body */}
                  <path d="M12 12c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{userData.name || 'Admin'}</h3>
            <p className="text-[#094d88] font-medium text-sm">Administrator</p>
            <p className="text-gray-500 text-sm">Full Access</p>

            {/* Role Selector Dropdown */}
            <div className="relative mt-4">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white rounded-lg border-2 border-[#094d88]/20 hover:border-[#094d88]/40 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-900 capitalize">Admin</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border-2 border-gray-200 shadow-xl z-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Switching to student role...');
                      setRole('student');
                      setShowRoleDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Student</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 text-purple-600 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuSections.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${location.pathname === item.path
                          ? 'bg-[#094d88] text-white'
                          : 'text-gray-700 hover:bg-[#094d88]/5 hover:text-[#094d88]'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#10ac8b]/10 hover:text-[#10ac8b] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : ''
      }`}>
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* PASCO Monitoring Engine - REMOVED */}
      {/* <PASCOMeter /> */}
    </div>
  );
}