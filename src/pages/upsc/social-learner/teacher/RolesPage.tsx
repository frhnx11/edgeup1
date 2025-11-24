import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Shield,
  Search,
  Plus,
  Settings,
  Users,
  BookOpen,
  FileText,
  Brain,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: {
    students: string[];
    courses: string[];
    tests: string[];
    ai: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const roles: Role[] = [
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access and control',
      users: 5,
      permissions: {
        students: ['view', 'create', 'edit', 'delete'],
        courses: ['view', 'create', 'edit', 'delete'],
        tests: ['view', 'create', 'edit', 'delete'],
        ai: ['view', 'configure']
      },
      createdAt: '2025-01-01',
      updatedAt: '2025-02-15'
    },
    {
      id: '2',
      name: 'Teacher',
      description: 'Course and student management',
      users: 12,
      permissions: {
        students: ['view', 'edit'],
        courses: ['view', 'create', 'edit'],
        tests: ['view', 'create'],
        ai: ['view']
      },
      createdAt: '2025-01-15',
      updatedAt: '2025-02-10'
    }
  ];

  const permissionModules = [
    { id: 'students', name: 'Students', icon: Users },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'tests', name: 'Tests', icon: FileText },
    { id: 'ai', name: 'AI Features', icon: Brain }
  ];

  const permissionTypes = [
    { id: 'view', name: 'View' },
    { id: 'create', name: 'Create' },
    { id: 'edit', name: 'Edit' },
    { id: 'delete', name: 'Delete' },
    { id: 'configure', name: 'Configure' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-[#094d88]">Manage access control and user roles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
          />
        </div>

        {/* Roles List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Roles</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {roles.map(role => (
              <div key={role.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {role.users} users
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Settings className="w-4 h-4" />
                          Last updated {new Date(role.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {permissionModules.map(module => (
                    <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <module.icon className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                      </div>
                      <div className="space-y-2">
                        {permissionTypes.map(type => {
                          const hasPermission = role.permissions[module.id as keyof typeof role.permissions]?.includes(type.id);
                          return (
                            <div key={type.id} className="flex items-center gap-2">
                              {hasPermission ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-600">{type.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-6">Add New Role</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
                <div className="space-y-6">
                  {permissionModules.map(module => (
                    <div key={module.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <module.icon className="w-4 h-4" />
                        <h5 className="font-medium">{module.name}</h5>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {permissionTypes.map(type => (
                          <label key={type.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{type.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                >
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Role</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this role? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  /* Handle delete */
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}