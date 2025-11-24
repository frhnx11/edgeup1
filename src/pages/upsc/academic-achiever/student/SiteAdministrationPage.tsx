import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CohortsPage from '../../../../components/upsc/common/CohortsPage';
import { ManageUsersPage } from '../../../../components/upsc/common/ManageUsersPage';
import { CreateUserPage } from '../../../../components/upsc/common/CreateUserPage';
import { UploadBulkUsersPage } from '../../../../components/upsc/common/UploadBulkUsersPage';
import { ManageRolesPage } from '../../../../components/upsc/common/ManageRolesPage';

// Define types for section categories and options
interface Option {
  name: string;
  path: string;
}

interface SectionCategory {
  name: string;
  options: Option[];
}

export function SiteAdministrationPage() {
  const [activeTab, setActiveTab] = useState('site');
  const [showCohortsPage, setShowCohortsPage] = useState(false);
  const [showManageUsersPage, setShowManageUsersPage] = useState(false);
  const [showCreateUserPage, setShowCreateUserPage] = useState(false);
  const [showUploadUsersPage, setShowUploadUsersPage] = useState(false);
  const [showManageRolesPage, setShowManageRolesPage] = useState(false);

  // Define all tabs
  const tabs = [
    { id: 'site', name: 'Site administration' },
    { id: 'users', name: 'Users' },
    { id: 'courses', name: 'Courses' },
    { id: 'grades', name: 'Grades' },
    { id: 'plugins', name: 'Plugins' },
    { id: 'reports', name: 'Reports' }
  ];
  
  // Breadcrumb paths based on active tab
  const getBreadcrumbPath = () => {
    switch(activeTab) {
      case 'users':
        return "Dashboard > Site Administration > Users";
      case 'courses':
        return "Dashboard > Site Administration > Courses";
      case 'grades':
        return "Dashboard > Site Administration > Grades";
      case 'plugins':
        return "Dashboard > Site Administration > Plugins";
      case 'reports':
        return "Dashboard > Site Administration > Reports";
      default:
        return "Dashboard > Site Administration";
    }
  };

  // Define site administration section categories and their options
  const siteAdminSectionCategories: SectionCategory[] = [
    {
      name: 'Analytics',
      options: [
        { name: 'Analytics models', path: '/admin/site-administration/analytics/models' }
      ]
    },
    {
      name: 'Competencies',
      options: [
        { name: 'Migrate frameworks', path: '/admin/site-administration/competencies/migrate' },
        { name: 'Import competency framework', path: '/admin/site-administration/competencies/import' },
        { name: 'Export competency framework', path: '/admin/site-administration/competencies/export' },
        { name: 'Competency frameworks', path: '/admin/site-administration/competencies/frameworks' },
        { name: 'Learning plan templates', path: '/admin/site-administration/competencies/templates' }
      ]
    },
    {
      name: 'Badges',
      options: [
        { name: 'Badges settings', path: '/admin/site-administration/badges/settings' },
        { name: 'Manage badges', path: '/admin/site-administration/badges/manage' },
        { name: 'Add a new badge', path: '/admin/site-administration/badges/add' },
        { name: 'Backpack settings', path: '/admin/site-administration/badges/backpack' }
      ]
    },
    {
      name: 'H5P',
      options: [
        { name: 'Manage H5P content types', path: '/admin/site-administration/h5p/content-types' }
      ]
    },
    {
      name: 'Language',
      options: [
        { name: 'Language customisation', path: '/admin/site-administration/language/customize' }
      ]
    },
    {
      name: 'Appearance',
      options: [
        { name: 'Default Dashboard page', path: '/admin/site-administration/appearance/dashboard' },
        { name: 'Default profile page', path: '/admin/site-administration/appearance/profile' },
        { name: 'Manage tags', path: '/admin/site-administration/appearance/tags' },
        { name: 'User tours', path: '/admin/site-administration/appearance/tours' }
      ]
    },
    {
      name: 'Front page',
      options: [
        { name: 'Front page settings', path: '/admin/site-administration/frontpage/settings' }
      ]
    }
  ];

  // Define users section categories and their options
  const usersSectionCategories = [
    {
      name: 'Accounts',
      options: [
        { name: 'Browse list of users', path: '#', onClick: () => setShowManageUsersPage(true) },
        { name: 'Bulk user actions', path: '#', onClick: () => setShowUploadUsersPage(true) },
        { name: 'Add a new user', path: '#', onClick: () => setShowCreateUserPage(true) },
        { name: 'Cohorts', path: '#', onClick: () => setShowCohortsPage(true) },
        { name: 'Upload users', path: '#', onClick: () => setShowUploadUsersPage(true) },
        { name: 'Upload user pictures', path: '/admin/site-administration/users/upload-pictures' }
      ]
    },
    {
      name: 'Permissions',
      options: [
        { name: 'Define roles', path: '#', onClick: () => setShowManageRolesPage(true) },
        { name: 'Assign system roles', path: '/admin/site-administration/users/permissions/assign-system-roles' },
        { name: 'Check system permissions', path: '/admin/site-administration/users/permissions/check' },
        { name: 'Capability overview', path: '/admin/site-administration/users/permissions/capability' },
        { name: 'Assign user roles to cohort', path: '/admin/site-administration/users/permissions/cohort-roles' }
      ]
    }
  ];

  // Define courses section categories and their options
  const coursesSectionCategories: SectionCategory[] = [
    {
      name: 'Courses',
      options: [
        { name: 'Manage courses and categories', path: '/admin/site-administration/courses/manage' },
        { name: 'Add a category', path: '/admin/site-administration/courses/add-category' },
        { name: 'Add a new course', path: '/admin/site-administration/courses/add' },
        { name: 'Restore course', path: '/admin/site-administration/courses/restore' },
        { name: 'Pending requests', path: '/admin/site-administration/courses/pending-requests' }
      ]
    },
    {
      name: 'Activity chooser',
      options: [
        { name: 'Recommended activities', path: '/admin/site-administration/courses/activity-chooser/recommended' },
      ]
    },
    {
      name: 'Backups',
      options: [
        { name: 'General backup defaults', path: '/admin/site-administration/courses/backups/defaults' },
        { name: 'General import defaults', path: '/admin/site-administration/courses/backups/import-defaults' },
        { name: 'Automated backup setup', path: '/admin/site-administration/courses/backups/automated' }
      ]
    }
  ];
  // Define grades section categories and their options
  const gradesSectionCategories: SectionCategory[] = [
    {
      name: 'Grades',
      options: [
        { name: 'General settings', path: '/admin/site-administration/grades/general-settings' },
        { name: 'Grade category settings', path: '/admin/site-administration/grades/category-settings' },
        { name: 'Grade item settings', path: '/admin/site-administration/grades/item-settings' },
        { name: 'Scales', path: '/admin/site-administration/grades/scales' },
        { name: 'Letters', path: '/admin/site-administration/grades/letters' }
      ]
    },
    {
      name: 'Report settings',
      options: [
        { name: 'Grader report', path: '/admin/site-administration/grades/reports/grader' },
        { name: 'Grade history', path: '/admin/site-administration/grades/reports/history' },
        { name: 'Overview report', path: '/admin/site-administration/grades/reports/overview' },
        { name: 'User report', path: '/admin/site-administration/grades/reports/user' }
      ]
    }
  ];
  // Define plugins section categories and their options
  const pluginsSectionCategories: SectionCategory[] = [
    {
      name: 'Plugins',
      options: [] // Empty section as specified
    },
    {
      name: 'Question types',
      options: [
        { name: 'Question preview defaults', path: '/admin/site-administration/plugins/question-types/preview-defaults' },
        { name: 'Multiple choice', path: '/admin/site-administration/plugins/question-types/multiple-choice' }
      ]
    }
  ];
  // Define reports section categories and their options
  const reportsSectionCategories: SectionCategory[] = [
    {
      name: 'Reports',
      options: [
        { name: 'Comments', path: '/admin/site-administration/reports/comments' },
        { name: 'Backups', path: '/admin/site-administration/reports/backups' },
        { name: 'Course overview', path: '/admin/site-administration/reports/course-overview' },
        { name: 'Insights', path: '/admin/site-administration/reports/insights' },
        { name: 'Logs', path: '/admin/site-administration/reports/logs' },
        { name: 'Live logs', path: '/admin/site-administration/reports/live-logs' },
        { name: 'Performance overview', path: '/admin/site-administration/reports/performance' },
        { name: 'Security checks', path: '/admin/site-administration/reports/security' },
        { name: 'Statistics', path: '/admin/site-administration/reports/statistics' },
        { name: 'System status', path: '/admin/site-administration/reports/system-status' },
        { name: 'Event monitoring rules', path: '/admin/site-administration/reports/event-monitoring' }
      ]
    }
  ];

  // Get the appropriate section categories based on active tab
  const getActiveSectionCategories = (): SectionCategory[] => {
    switch(activeTab) {
      case 'users':
        return usersSectionCategories;
      case 'courses':
        return coursesSectionCategories;
      case 'grades':
        return gradesSectionCategories;
      case 'plugins':
        return pluginsSectionCategories;
      case 'reports':
        return reportsSectionCategories;
      default:
        return siteAdminSectionCategories;
    }
  };

  // Get the appropriate left column categories based on active tab
  const getLeftColumnCategories = (): string[] => {
    if (activeTab === 'users') {
      return ['Users', 'Accounts', 'Permissions'];
    }
    
    if (activeTab === 'courses') {
      return ['Courses', 'Activity chooser', 'Backups'];
    }

    if (activeTab === 'grades') {
      return ['Grades', 'Report settings'];
    }

    if (activeTab === 'reports') {
      return ['Reports'];
    }

    if (activeTab === 'plugins') {
      return ['Plugins', 'Question types'];
    }
    
    // For other tabs, return their section category names
    return getActiveSectionCategories().map(category => category.name);
  };

  if (showCohortsPage) {
    return <CohortsPage onCancel={() => setShowCohortsPage(false)} />;
  }

  if (showManageUsersPage) {
    return <ManageUsersPage onCancel={() => setShowManageUsersPage(false)} />;
  }

  if (showCreateUserPage) {
    return <CreateUserPage onCancel={() => setShowCreateUserPage(false)} />;
  }

  if (showUploadUsersPage) {
    return <UploadBulkUsersPage onCancel={() => setShowUploadUsersPage(false)} />;
  }

  if (showManageRolesPage) {
    return <ManageRolesPage onCancel={() => setShowManageRolesPage(false)} />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site administration</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and features</p>
          <div className="text-sm text-gray-500 mt-2">
            {getBreadcrumbPath()}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-[#094d88] text-[#094d88]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Left Column - Section Categories */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow">
              <ul className="divide-y divide-gray-200">
                {getLeftColumnCategories().map((categoryName, index) => (
                  <li key={index} className="px-4 py-3">
                    <h3 className="font-semibold text-gray-900">{categoryName}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Section Options */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {getActiveSectionCategories().map((category, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-lg text-gray-900">{category.name}</h2>
                  </div>
                  {category.options.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {category.options.map((option: any, optIndex: number) => (
                        option.onClick ? (
                          <button
                            key={optIndex}
                            onClick={option.onClick}
                            className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group text-left w-full"
                          >
                            <span className="flex-grow">{option.name}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ) : (
                          <Link key={optIndex} to={option.path} className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                            <span className="flex-grow">{option.name}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-gray-500 italic">
                      No options available for this section
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Copyright © 2025 Professional Institute of Development Studies. Powered by Mellifera. All Rights Reserved.
        </div>
      </div>
    </AdminLayout>
  );
}

export default SiteAdministrationPage;
