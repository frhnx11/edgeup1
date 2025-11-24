import { useState, useEffect } from 'react';
import { Search, Star, Info } from 'lucide-react';

// Define the activity resource interface
export interface ActivityResource {
  id: string;
  title: string;
  type: 'activity' | 'resource';
  icon: string;
  recommended?: boolean;
}

export const ActivityResourceContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<ActivityResource[]>([]);
  
  // Activity resource data
  const activityResources: ActivityResource[] = [
    { id: '1', title: 'Assignment', type: 'activity', icon: 'assignment', recommended: true },
    { id: '2', title: 'Attendance', type: 'activity', icon: 'attendance' },
    { id: '3', title: 'Book', type: 'resource', icon: 'book', recommended: true },
    { id: '4', title: 'Chat', type: 'activity', icon: 'chat' },
    { id: '5', title: 'Choice', type: 'activity', icon: 'choice' },
    { id: '6', title: 'Custom certificate', type: 'resource', icon: 'certificate' },
    { id: '7', title: 'Feedback', type: 'activity', icon: 'feedback' },
    { id: '8', title: 'File', type: 'resource', icon: 'file', recommended: true },
    { id: '9', title: 'Folder', type: 'resource', icon: 'folder' },
    { id: '10', title: 'Forum', type: 'activity', icon: 'forum' },
    { id: '11', title: 'Glossary', type: 'resource', icon: 'glossary' },
    { id: '12', title: 'Interactive Content', type: 'resource', icon: 'interactive' },
    { id: '13', title: 'Label', type: 'resource', icon: 'label' },
    { id: '14', title: 'Lesson', type: 'activity', icon: 'lesson', recommended: true },
    { id: '15', title: 'Page', type: 'resource', icon: 'page' },
    { id: '16', title: 'Quiz', type: 'activity', icon: 'quiz', recommended: true },
    { id: '17', title: 'Secure Viewer', type: 'resource', icon: 'secure' },
    { id: '18', title: 'Survey', type: 'activity', icon: 'survey' },
    { id: '19', title: 'URL', type: 'resource', icon: 'url' },
    { id: '20', title: 'Zoom meeting', type: 'activity', icon: 'zoom', recommended: true }
  ];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('activityFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('activityFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter items based on active tab and search query
  useEffect(() => {
    let filtered = [...activityResources];
    
    // Filter by tab
    if (activeTab === 'activities') {
      filtered = filtered.filter(item => item.type === 'activity');
    } else if (activeTab === 'resources') {
      filtered = filtered.filter(item => item.type === 'resource');
    } else if (activeTab === 'recommended') {
      filtered = filtered.filter(item => item.recommended);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [activeTab, searchQuery]);

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

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <img 
          src={`/icons/${iconName}.svg`} 
          alt={iconName} 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            // Fallback for missing icons
            const target = e.target as HTMLImageElement;
            target.src = '/icons/default.svg';
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#094D88] text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
        <h2 className="text-xl font-semibold">ADD AN ACTIVITY OR RESOURCE</h2>
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
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'activities' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'recommended' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
      </div>
      
      {/* Grid of Cards */}
      <div className="p-4 overflow-y-auto flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border rounded hover:shadow-md transition-shadow p-3 flex flex-col items-center text-center">
              <div className="relative w-full flex justify-center mb-2 h-12">
                {getIconComponent(item.icon)}
              </div>
              <div className="text-sm font-medium mb-2">{item.title}</div>
              <div className="flex justify-center space-x-3 mt-auto">
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
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
