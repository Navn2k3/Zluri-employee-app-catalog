import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Users, Clock, CheckCircle, XCircle, AlertCircle, Plus, Zap, Shield, Briefcase } from 'lucide-react';

interface App {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  accessStatus: 'granted' | 'pending' | 'available' | 'restricted';
  rating: number;
  reviewCount: number;
  usersCount: number;
  tags: string[];
  reviews: Review[];
  lastUsed?: string;
  requestDate?: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  department: string;
}

const mockApps: App[] = [
  {
    id: '1',
    name: 'Slack',
    category: 'Communication',
    description: 'Team communication and collaboration platform',
    icon: '💬',
    accessStatus: 'granted',
    rating: 4.8,
    reviewCount: 324,
    usersCount: 1250,
    tags: ['messaging', 'collaboration', 'productivity'],
    reviews: [
      { id: '1', user: 'Sarah Chen', rating: 5, comment: 'Essential for our team communication. Great integrations!', date: '2024-01-15', helpful: 12, department: 'Engineering' },
      { id: '2', user: 'Mike Rodriguez', rating: 4, comment: 'Very useful but can be distracting with too many channels.', date: '2024-01-10', helpful: 8, department: 'Marketing' }
    ],
    lastUsed: '2 hours ago'
  },
  {
    id: '2',
    name: 'Figma',
    category: 'Design',
    description: 'Collaborative interface design tool',
    icon: '🎨',
    accessStatus: 'available',
    rating: 4.9,
    reviewCount: 189,
    usersCount: 445,
    tags: ['design', 'prototyping', 'collaboration'],
    reviews: [
      { id: '3', user: 'Alex Kim', rating: 5, comment: 'Game-changer for design collaboration. Real-time editing is fantastic!', date: '2024-01-12', helpful: 15, department: 'Design' },
      { id: '4', user: 'Emma Wilson', rating: 5, comment: 'Intuitive interface and powerful features. Love the component system.', date: '2024-01-08', helpful: 10, department: 'Product' }
    ]
  },
  {
    id: '3',
    name: 'Notion',
    category: 'Productivity',
    description: 'All-in-one workspace for notes, docs, and databases',
    icon: '📝',
    accessStatus: 'pending',
    rating: 4.6,
    reviewCount: 267,
    usersCount: 890,
    tags: ['documentation', 'project management', 'notes'],
    reviews: [
      { id: '5', user: 'David Park', rating: 4, comment: 'Great for documentation but has a learning curve.', date: '2024-01-14', helpful: 9, department: 'Operations' }
    ],
    requestDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Adobe Creative Suite',
    category: 'Design',
    description: 'Professional creative applications suite',
    icon: '🎭',
    accessStatus: 'restricted',
    rating: 4.7,
    reviewCount: 156,
    usersCount: 234,
    tags: ['design', 'photo editing', 'video editing'],
    reviews: [
      { id: '6', user: 'Lisa Zhang', rating: 5, comment: 'Industry standard but expensive. Only needed for specific roles.', date: '2024-01-11', helpful: 7, department: 'Marketing' }
    ]
  },
  {
    id: '5',
    name: 'Jira',
    category: 'Project Management',
    description: 'Issue tracking and project management',
    icon: '🔧',
    accessStatus: 'granted',
    rating: 3.9,
    reviewCount: 445,
    usersCount: 756,
    tags: ['project management', 'issue tracking', 'agile'],
    reviews: [
      { id: '7', user: 'Tom Bradley', rating: 4, comment: 'Powerful but complex. Takes time to set up properly.', date: '2024-01-13', helpful: 14, department: 'Engineering' }
    ],
    lastUsed: '1 day ago'
  },
  {
    id: '6',
    name: 'Canva Pro',
    category: 'Design',
    description: 'Easy-to-use graphic design platform',
    icon: '🌈',
    accessStatus: 'available',
    rating: 4.5,
    reviewCount: 223,
    usersCount: 567,
    tags: ['design', 'templates', 'marketing'],
    reviews: [
      { id: '8', user: 'Rachel Green', rating: 5, comment: 'Perfect for quick marketing materials. Love the templates!', date: '2024-01-16', helpful: 11, department: 'Marketing' }
    ]
  }
];

const categories = ['All', 'Communication', 'Design', 'Productivity', 'Project Management'];
const accessStatuses = ['All', 'Granted', 'Available', 'Pending', 'Restricted'];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredApps = useMemo(() => {
    return mockApps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || 
                          (selectedStatus === 'Granted' && app.accessStatus === 'granted') ||
                          (selectedStatus === 'Available' && app.accessStatus === 'available') ||
                          (selectedStatus === 'Pending' && app.accessStatus === 'pending') ||
                          (selectedStatus === 'Restricted' && app.accessStatus === 'restricted');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  const getStatusBadge = (status: string) => {
    const badges = {
      granted: { icon: CheckCircle, text: 'Access Granted', color: 'bg-green-100 text-green-800 border-green-200' },
      pending: { icon: Clock, text: 'Request Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      available: { icon: Plus, text: 'Request Access', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      restricted: { icon: XCircle, text: 'Restricted Access', color: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const badge = badges[status as keyof typeof badges];
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const handleRequestAccess = (app: App) => {
    // Implementation for request access functionality
    alert(`Access request submitted for ${app.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Zluri App Catalog</h1>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search apps, categories, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Insight 3: Powerful Search and Filtering */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Access Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {accessStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total Apps</span>
                      <span className="font-medium">{filteredApps.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Your Apps</span>
                      <span className="font-medium text-green-600">
                        {filteredApps.filter(app => app.accessStatus === 'granted').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockApps.filter(app => app.accessStatus === 'granted').length}
                  </div>
                  <div className="text-sm text-gray-600">Apps You Have</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockApps.filter(app => app.accessStatus === 'available').length}
                  </div>
                  <div className="text-sm text-gray-600">Available to Request</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockApps.filter(app => app.accessStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockApps.reduce((sum, app) => sum + app.usersCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(app => (
                <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                          {app.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Insight 1: Clear Access Status */}
                    <div className="mb-4">
                      {getStatusBadge(app.accessStatus)}
                      {app.accessStatus === 'granted' && app.lastUsed && (
                        <p className="text-xs text-gray-500 mt-1">Last used: {app.lastUsed}</p>
                      )}
                      {app.accessStatus === 'pending' && app.requestDate && (
                        <p className="text-xs text-gray-500 mt-1">Requested: {app.requestDate}</p>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{app.description}</p>

                    {/* Insight 2: Social Proof from Colleagues */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900 ml-1">{app.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({app.reviewCount})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {app.usersCount.toLocaleString()} users
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {app.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      
                      {app.accessStatus === 'available' && (
                        <button
                          onClick={() => handleRequestAccess(app)}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Request Access
                        </button>
                      )}
                      
                      {app.accessStatus === 'granted' && (
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                          Open App
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {selectedApp.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
                    <p className="text-gray-600">{selectedApp.category}</p>
                    <div className="mt-2">{getStatusBadge(selectedApp.accessStatus)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedApp.rating}</div>
                  <div className="flex items-center justify-center mb-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= selectedApp.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{selectedApp.reviewCount} reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedApp.usersCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedApp.tags.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedApp.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What Colleagues Say</h3>
                <div className="space-y-4">
                  {selectedApp.reviews.map(review => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{review.user}</div>
                          <div className="text-sm text-gray-600">{review.department} • {review.date}</div>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-sm text-gray-500">{review.helpful} people found this helpful</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedApp.accessStatus === 'available' && (
                  <button
                    onClick={() => {
                      handleRequestAccess(selectedApp);
                      setSelectedApp(null);
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Request Access
                  </button>
                )}
                {selectedApp.accessStatus === 'granted' && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    Open App
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;