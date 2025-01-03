import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using the correct API endpoint
        const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles?limit=10');
        setLatestUpdates(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Solar Background */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: 'url("https://media.istockphoto.com/id/1693812103/photo/astronaut-in-tethered-spacewalk-over-earth.jpg?s=1024x1024&w=is&k=20&c=upTi5pwAt-Voy25-StZZPJLR-KhyXmMZsLrg4cthoks=")',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Explore the Cosmos
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Your gateway to real-time space exploration data, scientific discoveries, 
            and mission updates from across the universe.
          </p>
          <Link 
            to="/discoveries" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 inline-block"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/instruments" className="group">
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-3">Space Instruments</h2>
            <p className="text-gray-300">
              Track real-time data from telescopes, satellites, and rovers exploring our universe.
            </p>
          </div>
        </Link>

        <Link to="/discoveries" className="group">
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-3">Latest Discoveries</h2>
            <p className="text-gray-300">
              Stay informed about the newest findings and breakthroughs in space exploration.
            </p>
          </div>
        </Link>

        <Link to="/updates" className="group">
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-3">Mission Updates</h2>
            <p className="text-gray-300">
              Get the latest updates on ongoing space missions and future launches.
            </p>
          </div>
        </Link>
      </section>

      {/* Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Space News</h2>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error loading news: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestUpdates.map(update => (
              <div key={update.id} className="bg-gray-800 rounded-lg overflow-hidden">
                {update.imageUrl && (
                  <img 
                    src={update.imageUrl} 
                    alt={update.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                  <p className="text-gray-300 mb-4">{update.summary?.slice(0, 100)}...</p>
                  <a 
                    href={update.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;