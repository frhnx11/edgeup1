import { useState } from 'react';
import { ArrowLeft, Search, Plus, Filter, ChevronDown, Users, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  selected: boolean;
}

interface FilterCriteria {
  type: 'fullName' | 'username' | 'email';
  condition: 'contains';
  value: string;
}

interface UploadBulkUsersPageProps {
  onCancel?: () => void;
}

export function UploadBulkUsersPage({ onCancel }: UploadBulkUsersPageProps) {
  const navigate = useNavigate();
  const [blocksEditing, setBlocksEditing] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [newFilter, setNewFilter] = useState<FilterCriteria>({
    type: 'fullName',
    condition: 'contains',
    value: ''
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedAction, setSelectedAction] = useState('');

  // Sample user data
  const [users, setUsers] = useState<User[]>([
    { id: '1', fullName: 'A Raja Mohamed', username: 'arajamohamed', email: 'raja.mohamed@example.com', selected: false },
    { id: '2', fullName: 'A Shahid', username: 'ashahid', email: 'a.shahid@example.com', selected: false },
    { id: '3', fullName: 'A Jamana Jahan', username: 'ajamanajahan', email: 'jamana.jahan@example.com', selected: false },
    { id: '4', fullName: 'A Mohamed Umar', username: 'amohamedumar', email: 'mohamed.umar@example.com', selected: false },
    { id: '5', fullName: 'A AADIL MOHAMMED', username: 'aaadilmohammed', email: 'aadil.mohammed@example.com', selected: false },
    { id: '6', fullName: 'A Abdul Huq', username: 'aabdulhuq', email: 'abdul.huq@example.com', selected: false },
    { id: '7', fullName: 'A Barakath Nasi', username: 'abarakathnasi', email: 'barakath.nasi@example.com', selected: false },
    { id: '8', fullName: 'A Hameedul athif', username: 'ahameedlathif', email: 'hameedul.athif@example.com', selected: false },
    { id: '9', fullName: 'A ahmadhul birhous', username: 'aahmadhulbirhous', email: 'ahmadhul.birhous@example.com', selected: false },
    { id: '10', fullName: 'A Mohamed fateen', username: 'amohamedfateen', email: 'mohamed.fateen@example.com', selected: false },
    { id: '11', fullName: 'A Sajida Begum', username: 'asajidabegum', email: 'sajida.begum@example.com', selected: false },
    { id: '12', fullName: 'A yusmin A yusmin', username: 'ayusmin', email: 'yusmin@example.com', selected: false },
    { id: '13', fullName: 'A azahir fathima', username: 'aazahirfathima', email: 'azahir.fathima@example.com', selected: false },
    { id: '14', fullName: 'Aabitha Sirajudeen', username: 'aabithasirajudeen', email: 'aabitha.sirajudeen@example.com', selected: false },
    { id: '15', fullName: 'Abdul Rahman Khan', username: 'abdulrahmankhan', email: 'abdul.rahman@example.com', selected: false },
    { id: '16', fullName: 'Ahmed Ali Mohamed', username: 'ahmedalimohamed', email: 'ahmed.ali@example.com', selected: false },
    { id: '17', fullName: 'Fatima Zahra Sheikh', username: 'fatimazahrasheikh', email: 'fatima.zahra@example.com', selected: false },
    { id: '18', fullName: 'Hassan Ibrahim Ali', username: 'hassanibrahimali', email: 'hassan.ibrahim@example.com', selected: false },
    { id: '19', fullName: 'Khadija Bibi Begum', username: 'khadijabibibegum', email: 'khadija.bibi@example.com', selected: false },
    { id: '20', fullName: 'Mohamed Yusuf Khan', username: 'mohamedyusufkhan', email: 'mohamed.yusuf@example.com', selected: false }
  ]);

  // Apply filters to users
  const filteredUsers = users.filter(user => {
    if (filters.length === 0) return true;
    
    return filters.every(filter => {
      const fieldValue = user[filter.type].toLowerCase();
      const filterValue = filter.value.toLowerCase();
      return fieldValue.includes(filterValue);
    });
  });

  const addFilter = () => {
    if (newFilter.value.trim()) {
      setFilters([...filters, { ...newFilter }]);
      setNewFilter({ ...newFilter, value: '' });
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const toggleUserSelection = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, selected: !user.selected } : user
    ));
  };

  const addToSelection = () => {
    const usersToAdd = filteredUsers.filter(user => !selectedUsers.find(su => su.id === user.id));
    setSelectedUsers([...selectedUsers, ...usersToAdd]);
  };

  const removeFromSelection = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedUsers(selectedUsers.filter(user => !filteredUserIds.includes(user.id)));
  };

  const addAllUsers = () => {
    setSelectedUsers([...users]);
  };

  const removeAllUsers = () => {
    setSelectedUsers([]);
  };

  const executeAction = () => {
    if (selectedAction && selectedUsers.length > 0) {
      console.log(`Executing action: ${selectedAction} on ${selectedUsers.length} users`);
      // Here you would implement the actual action
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <button 
          onClick={handleCancel} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Upload Bulk Users</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Blocks editing toggle */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Blocks editing</span>
            <button
              onClick={() => setBlocksEditing(!blocksEditing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                blocksEditing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  blocksEditing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New filter</h3>
          
          {/* Add new filter */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              value={newFilter.type}
              onChange={(e) => setNewFilter({...newFilter, type: e.target.value as FilterCriteria['type']})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fullName">User full name</option>
              <option value="username">Username</option>
              <option value="email">Email address</option>
            </select>
            
            <span className="text-gray-500">→</span>
            
            <select
              value={newFilter.condition}
              onChange={(e) => setNewFilter({...newFilter, condition: e.target.value as 'contains'})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="contains">contains</option>
            </select>
            
            <input
              type="text"
              value={newFilter.value}
              onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
              placeholder="Enter filter value"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            
            <button
              onClick={addFilter}
              disabled={!newFilter.value.trim()}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add filter
            </button>
          </div>

          {/* Active filters */}
          {filters.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <span>
                      {filter.type === 'fullName' ? 'User full name' : 
                       filter.type === 'username' ? 'Username' : 'Email address'} 
                      {' '} contains "{filter.value}"
                    </span>
                    <button
                      onClick={() => removeFilter(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show more button */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showMoreFilters ? 'Show less...' : 'Show more...'}
          </button>

          {showMoreFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Additional filter options can be added here for advanced user filtering.
              </p>
            </div>
          )}
        </div>

        {/* Users List and Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users in list */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Users: (All users {filteredUsers.length})
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <input
                    type="checkbox"
                    checked={user.selected}
                    onChange={() => toggleUserSelection(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.username} • {user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected users */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Selected user list ({selectedUsers.length} selected)
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {selectedUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>No users selected</p>
                </div>
              ) : (
                selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center px-4 py-3 border-b border-gray-100">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.username} • {user.email}</div>
                    </div>
                    <button
                      onClick={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={addToSelection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add to selection
            </button>
            <button
              onClick={removeFromSelection}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove from selection
            </button>
            <button
              onClick={addAllUsers}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add all
            </button>
            <button
              onClick={removeAllUsers}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Remove all
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">With selected users...</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose...</option>
              <option value="activate">Activate users</option>
              <option value="deactivate">Deactivate users</option>
              <option value="delete">Delete users</option>
              <option value="export">Export user data</option>
              <option value="assign-role">Assign role</option>
              <option value="send-message">Send message</option>
            </select>
            <button
              onClick={executeAction}
              disabled={!selectedAction || selectedUsers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}