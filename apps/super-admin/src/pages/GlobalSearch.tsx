import { useState, useEffect } from 'react';
import { Search, User, Key, Shield, Settings, AlertTriangle, FileText, BarChart3 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'api-key' | 'permission' | 'setting' | 'alert' | 'log' | 'metric' | 'license';
  category: string;
  path: string;
  relevance: number;
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock search data - in real app this would come from API
  const mockSearchData: SearchResult[] = [
    {
      id: '1',
      title: 'John Smith',
      description: 'Super Admin - john.smith@aivo.edu',
      type: 'user',
      category: 'Users',
      path: '/user-management',
      relevance: 0.95
    },
    {
      id: '2',
      title: 'OpenAI API Key',
      description: 'Primary API key for GPT-4 integration',
      type: 'api-key',
      category: 'API Management',
      path: '/api-management',
      relevance: 0.89
    },
    {
      id: '3',
      title: 'Teacher Permissions',
      description: 'Permissions for teacher portal access',
      type: 'permission',
      category: 'RBAC',
      path: '/rbac',
      relevance: 0.82
    },
    {
      id: '4',
      title: 'System Alert: High CPU Usage',
      description: 'Critical alert from monitoring system',
      type: 'alert',
      category: 'Monitoring',
      path: '/system-monitoring',
      relevance: 0.76
    },
    {
      id: '5',
      title: 'District License: Westfield',
      description: '500 student licenses for Westfield School District',
      type: 'license',
      category: 'Licenses',
      path: '/license-management',
      relevance: 0.88
    }
  ];

  const searchCategories = [
    { value: 'all', label: 'All Results', icon: Search },
    { value: 'users', label: 'Users', icon: User },
    { value: 'api-keys', label: 'API Keys', icon: Key },
    { value: 'permissions', label: 'Permissions', icon: Shield },
    { value: 'settings', label: 'Settings', icon: Settings },
    { value: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { value: 'logs', label: 'Logs', icon: FileText },
    { value: 'metrics', label: 'Metrics', icon: BarChart3 }
  ];

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return User;
      case 'api-key': return Key;
      case 'permission': return Shield;
      case 'setting': return Settings;
      case 'alert': return AlertTriangle;
      case 'log': return FileText;
      case 'metric': return BarChart3;
      case 'license': return FileText;
      default: return Search;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return 'bg-blue-500';
      case 'api-key': return 'bg-green-500';
      case 'permission': return 'bg-purple-500';
      case 'setting': return 'bg-gray-500';
      case 'alert': return 'bg-red-500';
      case 'log': return 'bg-yellow-500';
      case 'metric': return 'bg-indigo-500';
      case 'license': return 'bg-coral-500';
      default: return 'bg-gray-500';
    }
  };

  // Perform search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    const searchTimeout = setTimeout(() => {
      const filtered = mockSearchData.filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || 
          item.type === selectedCategory.slice(0, -1) || // Remove 's' from plural
          (selectedCategory === 'api-keys' && item.type === 'api-key');
        
        return matchesQuery && matchesCategory;
      }).sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, selectedCategory]);

  const handleResultClick = (result: SearchResult) => {
    // In real app, navigate to the specific page
    window.location.href = result.path;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Search</h1>
          <p className="text-gray-400 mt-2">Search across all super-admin resources</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users, API keys, permissions, settings, and more..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none text-lg"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-coral-500"></div>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {searchCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.value
                  ? 'bg-coral-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {searchQuery.trim() === '' ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Start your search</h3>
            <p className="text-gray-500">Type in the search box above to find users, settings, and more</p>
          </div>
        ) : searchResults.length === 0 && !isSearching ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Search Results ({searchResults.length})
              </h3>
            </div>
            
            {searchResults.map((result) => {
              const IconComponent = getTypeIcon(result.type);
              return (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700 hover:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{result.title}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {result.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{result.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Relevance: {Math.round(result.relevance * 100)}%</span>
                        <span>•</span>
                        <span>{result.path}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Tips */}
      {searchQuery.trim() === '' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Search Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Quick Searches:</h4>
              <ul className="space-y-1">
                <li>• "users" - Find all users</li>
                <li>• "api keys" - Find API configurations</li>
                <li>• "alerts" - Find system alerts</li>
                <li>• "permissions" - Find role permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Advanced Searches:</h4>
              <ul className="space-y-1">
                <li>• Use quotes for exact matches</li>
                <li>• Search by email addresses</li>
                <li>• Find by license numbers</li>
                <li>• Search configuration names</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}