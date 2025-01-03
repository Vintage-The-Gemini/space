import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const DiscoveriesPage = () => {
    const [discoveries, setDiscoveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dummy data for now
    const dummyDiscoveries = [
        {
            id: 1,
            title: "Water Ice Deposits Found on Mars",
            date: "2024-01-15",
            category: "Planetary",
            image: "https://www.nasa.gov/sites/default/files/thumbnails/image/pia23302-16.jpg",
            description: "New findings reveal significant deposits of water ice just below the Martian surface.",
            significance: "Could provide resources for future Mars missions and potential evidence of past life."
        },
        {
            id: 2,
            title: "New Exoplanet in Habitable Zone",
            date: "2024-01-10",
            category: "Exoplanets",
            image: "https://www.nasa.gov/sites/default/files/thumbnails/image/kepler-16b_artwork.jpg",
            description: "Discovery of an Earth-sized planet orbiting within its star's habitable zone.",
            significance: "Potential candidate for hosting life as we know it."
        },
        {
            id: 3,
            title: "Mysterious Radio Signals Detected",
            date: "2024-01-05",
            category: "Astronomy",
            image: "https://www.nasa.gov/sites/default/files/thumbnails/image/swift.jpg",
            description: "Fast radio bursts detected from a previously unknown source in deep space.",
            significance: "May help understand the nature of these enigmatic cosmic events."
        }
    ];

    useEffect(() => {
        // Using dummy data for now
        setDiscoveries(dummyDiscoveries);
        setLoading(false);

        // Uncomment when API is ready
        /*
        const fetchDiscoveries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/discoveries');
                setDiscoveries(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchDiscoveries();
        */
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500">Loading discoveries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Latest Space Discoveries
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-300"
                >
                    Exploring the latest breakthroughs in space exploration
                </motion.p>
            </div>

            {/* Discovery Cards */}
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {discoveries.map((discovery, index) => (
                        <motion.div
                            key={discovery.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="relative">
                                <img 
                                    src={discovery.image} 
                                    alt={discovery.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                        {discovery.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-gray-400 mb-2">
                                    {new Date(discovery.date).toLocaleDateString()}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{discovery.title}</h3>
                                <p className="text-gray-300 mb-4">{discovery.description}</p>
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                        Scientific Significance
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        {discovery.significance}
                                    </p>
                                </div>
                                <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                    Learn More
                                </button>
                            </div>
                        </motion.div>
            ))}
            </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto mt-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {['Planetary', 'Exoplanets', 'Astronomy', 'Deep Space'].map((category, index) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-700/50 transition-all duration-300"
                    >
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">{category}</h3>
                        <p className="text-sm text-gray-300">
                            Explore {category.toLowerCase()} discoveries
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mt-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-2xl"
            >
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="text-gray-300 mb-6">
                    Subscribe to our newsletter for the latest space discoveries
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300">
                        Subscribe
                    </button>
                </div>
            </motion.div>
        </div>
    </div>
);
};

export default DiscoveriesPage;