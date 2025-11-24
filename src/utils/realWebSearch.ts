// Real web search implementation using actual APIs
import { ResourceItem } from './deepSearch';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  channel?: string;
  duration?: string;
  author?: string;
}

// YouTube Data API search (requires API key)
async function searchYouTube(query: string): Promise<SearchResult[]> {
  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (apiKey) {
      console.log('🎥 Using YouTube Data API v3 for:', query);
      
      // Use YouTube Data API v3 to get actual video results
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `maxResults=5&` +
        `q=${encodeURIComponent(query)}&` +
        `type=video&` +
        `videoEmbeddable=true&` +
        `videoSyndicated=true&` +
        `safeSearch=strict&` +
        `order=relevance&` +
        `key=${apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ YouTube API returned ${data.items?.length || 0} videos`);
        
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => ({
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            description: `${item.snippet.channelTitle} • ${item.snippet.description.substring(0, 100)}...`,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            channel: item.snippet.channelTitle
          }));
        }
      } else {
        const error = await response.json();
        console.error('YouTube API error:', error);
        console.error('Response status:', response.status);
        
        // If YouTube API fails, try Google Custom Search as fallback
        if (import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID) {
          console.log('🔄 Falling back to Google Custom Search for YouTube videos');
          return searchGoogleForYouTube(query);
        }
      }
    }
    
    console.log('⚠️ YouTube API not available, returning empty results');
    return [];
    
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

// Search for YouTube videos using Google Custom Search
async function searchGoogleForYouTube(query: string): Promise<SearchResult[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      return [];
    }
    
    // Search specifically for YouTube videos
    const searchQuery = `${query} site:youtube.com`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      const videos = data.items?.filter((item: any) => 
        item.link.includes('youtube.com/watch?v=') || 
        item.link.includes('youtu.be/')
      ) || [];
      
      console.log(`✅ Google Custom Search found ${videos.length} YouTube videos`);
      
      return videos.slice(0, 5).map((item: any) => ({
        title: item.title.replace(' - YouTube', ''),
        url: item.link,
        description: item.snippet,
        channel: item.pagemap?.metatags?.[0]?.['og:site_name'] || 'YouTube'
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Google YouTube search error:', error);
    return [];
  }
}

// DuckDuckGo search (no API key required)
async function searchDuckDuckGo(query: string, site?: string): Promise<SearchResult[]> {
  try {
    const searchQuery = site ? `${query} site:${site}` : query;
    const proxyUrl = 'https://corsproxy.io/?';
    const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(ddgUrl));
    const html = await response.text();
    
    // Parse search results from HTML
    const results: SearchResult[] = [];
    const resultPattern = /<a class="result__a" href="([^"]+)">([^<]+)<\/a>/g;
    let match;
    
    while ((match = resultPattern.exec(html)) !== null && results.length < 5) {
      results.push({
        title: match[2].trim(),
        url: match[1],
        description: ''
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
}

// Google Custom Search API
async function searchGoogle(query: string, type: 'video' | 'article' | 'podcast' | 'book'): Promise<SearchResult[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.warn('Google API credentials not configured');
      return [];
    }
    
    console.log(`🔍 Using Google Custom Search for ${type}:`, query);
    
    // Enhance query based on type
    let enhancedQuery = query;
    switch (type) {
      case 'video':
        // For videos, use YouTube API instead if available
        if (import.meta.env.VITE_YOUTUBE_API_KEY) {
          return searchYouTube(query);
        }
        enhancedQuery = `${query} site:youtube.com`;
        break;
      case 'podcast':
        enhancedQuery = `${query} podcast episode (site:open.spotify.com OR site:podcasts.apple.com OR site:podcasts.google.com)`;
        break;
      case 'article':
        enhancedQuery = `${query} (site:scholar.google.com OR site:jstor.org OR site:arxiv.org OR site:researchgate.net OR site:pubmed.ncbi.nlm.nih.gov)`;
        break;
      case 'book':
        enhancedQuery = `${query} book (site:goodreads.com OR site:amazon.com OR site:books.google.com)`;
        break;
    }
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(enhancedQuery)}&num=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Google ${type} search returned ${data.items?.length || 0} results`);
      
      if (data.items && data.items.length > 0) {
        // Filter and process results based on type
        let processedResults = data.items;
        
        if (type === 'podcast') {
          // Only include actual podcast episode links
          processedResults = data.items.filter((item: any) => 
            item.link.includes('/episode/') || 
            item.link.includes('/podcasts/') ||
            item.link.includes('/show/')
          );
        } else if (type === 'video') {
          // Only include actual video links
          processedResults = data.items.filter((item: any) => 
            item.link.includes('watch?v=') || 
            item.link.includes('youtu.be/')
          );
        }
        
        return processedResults.slice(0, 5).map((item: any) => ({
          title: item.title,
          url: item.link,
          description: item.snippet,
          author: item.pagemap?.metatags?.[0]?.author || ''
        }));
      }
    }
    
    return [];
    
  } catch (error) {
    console.error('Google search error:', error);
    return [];
  }
}

// Get Spotify podcast episodes using web search
async function searchSpotifyPodcasts(topic: string, subject: string): Promise<SearchResult[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      return [];
    }
    
    // Search specifically for Spotify podcast episodes
    const query = `"${topic}" ${subject} site:open.spotify.com/episode`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      const episodes = data.items?.filter((item: any) => 
        item.link.includes('open.spotify.com/episode/')
      ) || [];
      
      return episodes.slice(0, 5).map((item: any) => ({
        title: item.title,
        url: item.link,
        description: item.snippet,
        channel: 'Spotify Podcast'
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Spotify podcast search error:', error);
    return [];
  }
}

// Get academic articles using Google Scholar
async function searchAcademicArticles(topic: string, subject: string): Promise<SearchResult[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      return [];
    }
    
    // Search for academic articles with PDF links
    const query = `"${topic}" ${subject} filetype:pdf (site:arxiv.org OR site:researchgate.net OR site:academia.edu)`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.items?.slice(0, 5).map((item: any) => ({
        title: item.title,
        url: item.link,
        description: item.snippet,
        author: item.pagemap?.metatags?.[0]?.author || 'Academic Publication'
      })) || [];
    }
    
    return [];
  } catch (error) {
    console.error('Academic article search error:', error);
    return [];
  }
}

// Main search function that tries multiple methods
export async function performRealWebSearch(
  topic: string,
  subject: string,
  type: 'videos' | 'podcasts' | 'articles' | 'books'
): Promise<ResourceItem[]> {
  console.log(`🔍 Performing REAL web search for ${type} about "${topic}" in ${subject}`);
  console.log(`📝 Topic details: "${topic}" | Subject: "${subject}"`);
  
  let results: SearchResult[] = [];
  // Make the query more specific to the actual topic
  const query = `"${topic}" ${subject} educational`;
  
  // Use different search strategies based on content type
  switch (type) {
    case 'videos':
      // Try Google Custom Search first for YouTube videos
      if (import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID) {
        results = await searchGoogleForYouTube(`${topic} ${subject} educational tutorial lecture`);
        console.log(`🎥 Google YouTube search for "${topic}" returned ${results.length} videos`);
      }
      
      // If no results, try YouTube Data API
      if (results.length === 0 && (import.meta.env.VITE_YOUTUBE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY)) {
        results = await searchYouTube(`${topic} ${subject} educational tutorial lecture`);
        console.log(`🎥 YouTube API search for "${topic}" returned ${results.length} videos`);
      }
      break;
      
    case 'podcasts':
      // First try Spotify-specific search
      results = await searchSpotifyPodcasts(topic, subject);
      // If no Spotify results, try general Google search
      if (results.length === 0 && import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID) {
        results = await searchGoogle(`${topic} ${subject} podcast episode`, 'podcast');
      }
      console.log(`🎧 Podcast search for "${topic}" returned ${results.length} episodes`);
      break;
      
    case 'articles':
      // Use specialized academic search
      results = await searchAcademicArticles(topic, subject);
      // Fallback to general article search if needed
      if (results.length === 0 && import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID) {
        results = await searchGoogle(`${topic} ${subject} research paper study`, 'article');
      }
      console.log(`📄 Article search for "${topic}" returned ${results.length} papers`);
      break;
      
    case 'books':
      // Books are now AI-generated, so we don't need web search
      return [];
  }
  
  // If still no results, log it but don't generate fake content
  if (results.length === 0) {
    console.log(`⚠️ No results found for ${type} about "${topic}" in ${subject}`);
  }
  
  console.log(`✅ Found ${results.length} results for ${type}`);
  
  // Convert to ResourceItem format
  return results.map((result, index) => {
    const item: ResourceItem = {
      id: `${type}-${Date.now()}-${index}`,
      title: result.title,
      url: type === 'books' ? '' : result.url,
      description: result.description || `${result.channel || 'Educational'} • ${topic}`,
      favicon: getFavicon(result.url),
      domain: getDomain(result.url),
      domainName: getDomainName(result.url),
      color: getColor(result.url),
      type: type.slice(0, -1) as any
    };
    
    // Special handling for books
    if (type === 'books' && result.author) {
      item.description = `by ${result.author}`;
    }
    
    return item;
  });
}

// Generate fallback content when search fails
function generateFallbackContent(topic: string, subject: string, type: string): SearchResult[] {
  const fallbackContent: { [key: string]: SearchResult[] } = {
    videos: [
      {
        title: `${topic} - Khan Academy ${subject}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent('"' + topic + '" ' + subject + ' khan academy')}`,
        description: `Khan Academy • Educational video on ${topic} in ${subject}`,
        channel: 'Khan Academy'
      },
      {
        title: `${topic} Explained - ${subject} Course`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent('"' + topic + '" ' + subject + ' explained')}`,
        description: `Educational content • Comprehensive overview of ${topic}`,
        channel: 'Educational Channel'
      },
      {
        title: `Understanding ${topic} in ${subject}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent('"' + topic + '" ' + subject + ' lecture')}`,
        description: `University lectures • Academic content on ${topic}`,
        channel: 'University Lectures'
      }
    ],
    podcasts: [
      {
        title: `${topic} in ${subject} - Educational Podcast`,
        url: `https://open.spotify.com/search/${encodeURIComponent('"' + topic + '" ' + subject + ' podcast')}`,
        description: `Educational podcast • Deep dive into ${topic}`,
        channel: 'Educational Podcasts'
      },
      {
        title: `Understanding ${topic} - ${subject} Series`,
        url: `https://podcasts.apple.com/search?term=${encodeURIComponent('"' + topic + '" ' + subject)}`,
        description: `Podcast series • Expert discussions on ${topic}`,
        channel: 'Academic Podcasts'
      }
    ],
    articles: [
      {
        title: `${topic} in ${subject}: A Comprehensive Review`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent('"' + topic + '" ' + subject)}`,
        description: `Academic research on ${topic} in ${subject}`,
        author: 'Research Publications'
      },
      {
        title: `Recent Studies on ${topic} - ${subject}`,
        url: `https://www.researchgate.net/search?q=${encodeURIComponent('"' + topic + '" ' + subject)}`,
        description: `Latest research findings specific to ${topic}`,
        author: 'Academic Community'
      }
    ],
    books: [
      {
        title: `Fundamentals of ${topic}`,
        url: '',
        description: 'Standard textbook covering core concepts',
        author: 'Academic Press'
      },
      {
        title: `${topic}: Theory and Practice`,
        url: '',
        description: 'Comprehensive guide for students',
        author: 'Educational Publishers'
      },
      {
        title: `Mastering ${topic} in ${subject}`,
        url: '',
        description: 'Advanced concepts and applications',
        author: 'Expert Authors'
      }
    ]
  };
  
  return fallbackContent[type] || [];
}

// Helper functions
function getFavicon(url: string): string {
  if (!url) return '';
  
  try {
    const domain = new URL(url).hostname;
    if (domain.includes('youtube.com')) return 'https://www.youtube.com/favicon.ico';
    if (domain.includes('spotify.com')) return 'https://open.spotify.com/favicon.ico';
    if (domain.includes('apple.com')) return 'https://podcasts.apple.com/favicon.ico';
    if (domain.includes('scholar.google')) return 'https://scholar.google.com/favicon.ico';
    if (domain.includes('jstor.org')) return 'https://www.jstor.org/favicon.ico';
    if (domain.includes('arxiv.org')) return 'https://arxiv.org/favicon.ico';
    return `https://${domain}/favicon.ico`;
  } catch {
    return '';
  }
}

function getDomain(url: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function getDomainName(url: string): string {
  if (!url) return 'Resource';
  
  const domain = getDomain(url);
  if (domain.includes('youtube.com')) return 'YouTube';
  if (domain.includes('spotify.com')) return 'Spotify';
  if (domain.includes('apple.com')) return 'Apple Podcasts';
  if (domain.includes('scholar.google')) return 'Google Scholar';
  if (domain.includes('jstor.org')) return 'JSTOR';
  if (domain.includes('arxiv.org')) return 'arXiv';
  if (domain.includes('britannica.com')) return 'Britannica';
  if (domain.includes('stanford.edu')) return 'Stanford';
  return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
}

function getColor(url: string): string {
  if (!url) return '#6B7280';
  
  const domain = getDomain(url);
  if (domain.includes('youtube.com')) return '#FF0000';
  if (domain.includes('spotify.com')) return '#1DB954';
  if (domain.includes('apple.com')) return '#872EC4';
  if (domain.includes('scholar.google')) return '#4285F4';
  if (domain.includes('jstor.org')) return '#990000';
  if (domain.includes('arxiv.org')) return '#B31B1B';
  return '#6B7280';
}

// Export a function to check if real search is available
export function isRealSearchAvailable(): boolean {
  return !!(
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.VITE_SERPSTACK_API_KEY
  );
}