import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Calendar, ExternalLink } from 'lucide-react';

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles?limit=10');
        setUpdates(response.data.results);
        setLoading(false);
      } catch (error) {
        setError('Error fetching updates: ' + error.message);
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(update => 
    update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-red-500 bg-red-500/10 p-6 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: 'url("https://images.nasa.gov/images/nasa_news.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-light mb-8"
          >
            Space Mission Updates
          </motion.h1>
          
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search updates..."
              className="w-full bg-black/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Updates Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUpdates.map((update, index) => (
            <motion.article
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={update.image_url || '/api/placeholder/400/300'}
                  alt={update.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(update.published_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-light mb-4 line-clamp-2">{update.title}</h2>
                <p className="text-gray-400 mb-6 line-clamp-3">{update.summary}</p>
                
                <a
                  href={update.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Read Full Article 
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;