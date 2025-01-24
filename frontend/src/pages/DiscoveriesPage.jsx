import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';
const fetchDiscoveriesData = async () => {
    try {
        // First try to fetch recent space discoveries
        const newsResponse = await axios.get('https://api.spaceflightnewsapi.net/v4/articles', {
            params: {
                limit: 15,
                offset: 0,
                has_launch: false, // Exclude pure launch news
                contains_tags: 'science,discovery,research'
            }
        });

        if (!newsResponse.data.results) {
            throw new Error('No data received from API');
        }

        const formattedDiscoveries = newsResponse.data.results
            .filter(article => 
                article.title && article.summary && article.image_url && 
                !article.title.toLowerCase().includes('launch') // Further filter out launch-related news
            )
            .map(article => ({
                id: article.id,
                title: article.title,
                date: article.published_at,
                category: determineCategory(article.title + ' ' + article.summary),
                image: article.image_url,
                description: article.summary,
                significance: generateSignificance(article.summary),
                url: article.url
            }));

        return formattedDiscoveries;
    } catch (error) {
        console.error('Error fetching discoveries:', error);
        throw new Error('Failed to fetch space discoveries data');
    }
};

const determineCategory = (text) => {
    text = text.toLowerCase();
    if (text.includes('mars') || text.includes('moon') || text.includes('venus') || text.includes('jupiter') || text.includes('saturn')) return 'Planetary';
    if (text.includes('exoplanet') || text.includes('planet')) return 'Exoplanets';
    if (text.includes('star') || text.includes('galaxy') || text.includes('black hole') || text.includes('nebula')) return 'Deep Space';
    return 'Astronomy';
};


const generateSignificance = (summary) => {
    const firstSentence = summary.split('.')[0];
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence + '.';
};

const DiscoveriesPage = () => {
    const [discoveries, setDiscoveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDiscoveriesData();
                setDiscoveries(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        loadData();

        // Refresh every 5 minutes
        const interval = setInterval(loadData, 300000);
        return () => clearInterval(interval);
    }, []);

    const filteredDiscoveries = discoveries.filter(discovery => {
        const matchesSearch = discovery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            discovery.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || discovery.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500">Loading discoveries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="text-red-500 bg-red-500/10 p-6 rounded-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ 
                        backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/051/288/748/small_2x/a-stunning-view-of-the-earth-from-space-with-a-sunrise-illuminating-the-horizon-and-a-star-studded-sky-above-free-video.jpg")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-light mb-8"
                    >
                        Space Discoveries
                    </motion.h1>
                    
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search discoveries..."
                            className="w-full bg-black/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {['all', 'Planetary', 'Exoplanets', 'Astronomy', 'Deep Space'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                selectedCategory === category 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Discovery Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDiscoveries.map((discovery, index) => (
                        <motion.article
                            key={discovery.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={discovery.image || '/api/placeholder/400/300'}
                                    alt={discovery.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/400/300';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex justify-between items-center">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                            {discovery.category}
                                        </span>
                                        <span className="text-sm text-gray-300 flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(discovery.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h2 className="text-xl font-light mb-4 line-clamp-2">{discovery.title}</h2>
                                <p className="text-gray-400 mb-6 line-clamp-3">{discovery.description}</p>
                                
                                <div className="bg-black/30 p-4 rounded-lg mb-6">
                                    <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                        Scientific Significance
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        {discovery.significance}
                                    </p>
                                </div>

                                <a
                                    href={discovery.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center group"
                                >
                                    Read Full Article
                                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="max-w-3xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-2xl backdrop-blur-sm border border-gray-800/50"
                >
                    <h2 className="text-2xl font-light mb-4 text-center">Stay Updated</h2>
                    <p className="text-gray-300 mb-6 text-center">
                        Get notified about new space discoveries and breakthroughs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 max-w-md px-4 py-2 rounded-lg bg-black/50 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                        <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300 flex items-center justify-center">
                            Subscribe
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DiscoveriesPage;