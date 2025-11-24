import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Info, UserPlus, Upload, Shield, Users, BookOpen } from 'lucide-react';

// Define the user management resource interface
export interface UserManagementResource {
  id: string;
  title: string;
  type: 'management' | 'admin';
  icon: React.ElementType;
  recommended?: boolean;
}

// Define the props for the modal component
interface ManageUsersModalProps {
  onSelectItem?: (item: string) => void;
}

export function ManageUsersModal({ onSelectItem }: ManageUsersModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserManagementResource[]>([]);
  
  // User management resource data
  const userManagementResources: UserManagementResource[] = [
    { id: '1', title: 'Create User', type: 'management', icon: UserPlus, recommended: true },
    { id: '2', title: 'Upload Bulk Users', type: 'management', icon: Upload, recommended: true },
    { id: '3', title: 'Manage Roles', type: 'admin', icon: Shield, recommended: true },
    { id: '4', title: 'Manage Batches', type: 'management', icon: Users },
    { id: '5', title: 'Manage Courses', type: 'admin', icon: BookOpen, recommended: true }
  ];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('userManagementFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userManagementFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter items based on search query
  useEffect(() => {
    let filtered = [...userManagementResources];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [searchQuery]);

  // Toggle favorite status for an item
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Get icon component
  const getIconComponent = (IconComponent: React.ElementType) => {
    return (
      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
        <IconComponent className="w-6 h-6 text-blue-600" />
      </div>
    );
  };

  // Always render the component when used in ManageUsersPage
  return (
    <div className="w-full h-full flex flex-col">
      {/* Page Header - styled like Activity page */}
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-2">Create and manage users, roles, batches, and courses</p>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className="px-6 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600"
        >
          All
        </button>
      </div>
      
      {/* Grid of Cards */}
      <div className="p-4 overflow-y-auto flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border rounded-lg hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() => {
                if (onSelectItem) {
                  onSelectItem(item.title);
                } else {
                  // Navigate to respective pages when implemented
                  if (item.title === 'Create User') {
                    navigate('/admin/create-user');
                  } else if (item.title === 'Upload Bulk Users') {
                    navigate('/admin/upload-bulk-users');
                  } else if (item.title === 'Manage Roles') {
                    navigate('/admin/manage-roles');
                  } else if (item.title === 'Manage Batches') {
                    navigate('/admin/manage-batches');
                  } else if (item.title === 'Manage Courses') {
                    navigate('/admin/manage-courses');
                  }
                }
              }}
            >
              <div className="relative w-full flex justify-center mb-2 h-12">
                {getIconComponent(item.icon)}
              </div>
              <div className="text-sm font-medium mb-2">{item.title}</div>
              <div className="flex justify-center space-x-3 mt-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};