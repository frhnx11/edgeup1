import { useState } from 'react';
import { ArrowLeft, Edit2, Shield, UserCheck, ToggleLeft, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  description: string;
  shortName: string;
}

interface ManageRolesPageProps {
  onCancel?: () => void;
}

export function ManageRolesPage({ onCancel }: ManageRolesPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage-roles');

  const roles: Role[] = [
    {
      id: '1',
      name: 'Manager',
      description: 'Managers can access courses and modify them, but usually do not participate in them.',
      shortName: 'manager'
    },
    {
      id: '2',
      name: 'Course creator',
      description: 'Course creators can create new courses.',
      shortName: 'coursecreator'
    },
    {
      id: '3',
      name: 'Teacher',
      description: 'Teachers can do anything within a course, including changing the activities and grading students.',
      shortName: 'editingteacher'
    },
    {
      id: '4',
      name: 'Non-editing teacher',
      description: 'Non-editing teachers can teach in courses and grade students, but may not alter activities.',
      shortName: 'teacher'
    },
    {
      id: '5',
      name: 'Student',
      description: 'Students generally have fewer privileges within a course.',
      shortName: 'student'
    },
    {
      id: '6',
      name: 'Guest',
      description: 'Guests have minimal privileges and usually cannot enter text anywhere.',
      shortName: 'guest'
    },
    {
      id: '7',
      name: 'Authenticated user',
      description: 'All logged in users.',
      shortName: 'user'
    },
    {
      id: '8',
      name: 'Authenticated user on frontpage',
      description: 'All logged in users in the frontpage course.',
      shortName: 'frontpage'
    }
  ];

  const tabs = [
    { id: 'manage-roles', label: 'Manage roles', icon: Shield },
    { id: 'allow-assignments', label: 'Allow role assignments', icon: UserCheck },
    { id: 'allow-overrides', label: 'Allow role overrides', icon: Edit2 },
    { id: 'allow-switches', label: 'Allow role switches', icon: ToggleLeft },
    { id: 'allow-view', label: 'Allow role to view', icon: Eye }
  ];

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        {/* Header */}
        <div className="px-6 py-4 flex items-center">
          <button 
            onClick={handleCancel} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Roles</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-t">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'manage-roles' ? (
          <div>
            {/* Roles Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{role.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{role.shortName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => console.log('Edit role:', role.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add new role button */}
            <div className="mt-6">
              <button
                onClick={() => console.log('Add new role')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a new role
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">
              {tabs.find(t => t.id === activeTab)?.label} settings will be configured here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}