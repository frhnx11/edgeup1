import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { ResourceItem } from '../../../utils/deepSearch';

interface DeepSearchResultsProps {
  searchResults: {
    books: ResourceItem[];
    videos: ResourceItem[];
    podcasts: ResourceItem[];
    articles: ResourceItem[];
    summary: string;
  };
  topic?: string;
}

interface ResourceCardProps {
  resource: ResourceItem;
  index: number;
  isBook?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index, isBook = false }) => {
  const [imageError, setImageError] = useState(false);
  
  // Special rendering for books - no links, just title and author
  if (isBook) {
    // Extract author from description or title
    const extractAuthor = () => {
      // Check if "by" is in the title
      if (resource.title.includes(' by ')) {
        const parts = resource.title.split(' by ');
        return { title: parts[0], author: parts[1] };
      }
      // Check description for author info
      if (resource.description.toLowerCase().includes('by ')) {
        const match = resource.description.match(/by\s+([^,\.]+)/i);
        if (match) {
          return { title: resource.title, author: match[1] };
        }
      }
      // Default - use domain name as author if available
      return { title: resource.title, author: resource.domainName !== 'Website' ? resource.domainName : 'Unknown Author' };
    };

    const { title, author } = extractAuthor();

    return (
      <div 
        className="relative bg-gray-50 rounded-lg border border-gray-200 p-3 overflow-hidden"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 text-amber-700">
              <span className="text-xs font-bold">📚</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              by {author}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Regular resource card with link
  return (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 h-full"
      >
        <div className="flex items-start gap-2">
          {/* Website Favicon */}
          <div className="flex-shrink-0 relative">
            {resource.favicon && !imageError ? (
              <div className="w-5 h-5 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={resource.favicon}
                  alt={resource.domainName}
                  className="w-4 h-4 object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div 
                className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: resource.color }}
              >
                <Globe className="w-3 h-3" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-medium text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
              {resource.title}
            </h3>
            
            {/* Domain */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500">
                {resource.domainName}
              </span>
            </div>
            
            {/* Description - only show on hover or larger screens */}
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 hidden sm:block">
              {resource.description}
            </p>
          </div>
          
          {/* External link icon */}
          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
        </div>
      </a>
    </div>
  );
};

interface SectionProps {
  title: string;
  emoji: string;
  resources: ResourceItem[];
  defaultOpen?: boolean;
  isBookSection?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, emoji, resources, defaultOpen = true, isBookSection = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 group mb-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded-full">
            {resources.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
        )}
      </button>
      
      <div className={`transition-all duration-300 ease-out overflow-hidden ${
        isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {resources.map((resource, index) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                index={index} 
                isBook={isBookSection}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No resources found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const DeepSearchResults: React.FC<DeepSearchResultsProps> = ({ searchResults, topic }) => {
  // Handle case where searchResults is not yet loaded
  if (!searchResults) {
    return (
      <div className="deep-search-results">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deep-search-results">
      {/* Summary */}
      {searchResults.summary && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            💡 Summary
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {searchResults.summary.split('\n')[0]}
          </div>
        </div>
      )}

      {/* Resource Sections in 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section
          title="Golden Standard Books"
          emoji="📖"
          resources={searchResults.books?.slice(0, 3) || []}
          defaultOpen={true}
          isBookSection={true}
        />
        
        <Section
          title="Videos"
          emoji="🎥"
          resources={searchResults.videos?.slice(0, 3) || []}
          defaultOpen={true}
        />
        
        <Section
          title="Podcasts"
          emoji="🎧"
          resources={searchResults.podcasts?.slice(0, 3) || []}
          defaultOpen={false}
        />
        
        <Section
          title="Articles"
          emoji="📄"
          resources={searchResults.articles?.slice(0, 3) || []}
          defaultOpen={false}
        />
      </div>
    </div>
  );
};

export default DeepSearchResults;