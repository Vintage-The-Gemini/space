import { useState, useEffect } from 'react';
import axios from 'axios';

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Latest Space Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updates.map(update => (
          <div key={update.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {update.imageUrl && (
              <img
                src={update.imageUrl}
                alt={update.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-3 text-white">{update.title}</h2>
              <p className="text-gray-300 mb-4">{update.summary?.slice(0, 150)}...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {new Date(update.publishedAt).toLocaleDateString()}
                </span>
                <a
                  href={update.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-300"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesPage;