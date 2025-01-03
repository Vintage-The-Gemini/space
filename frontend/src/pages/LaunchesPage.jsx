import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LaunchesPage = () => {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dummy data for development
    const dummyLaunches = [
        {
            id: 1,
            mission: "Artemis II",
            provider: "NASA",
            date: "2024-11-15T10:00:00Z",
            location: "Kennedy Space Center",
            status: "Scheduled",
            description: "First crewed mission of NASA's Artemis program",
            image: "https://www.nasa.gov/sites/default/files/styles/full_width/public/thumbnails/image/artemis_ii_crew.jpg"
        },
        {
            id: 2,
            mission: "Starship Orbital Test",
            provider: "SpaceX",
            date: "2024-06-20T14:30:00Z",
            location: "Starbase, Texas",
            status: "Upcoming",
            description: "Second orbital flight test of the Starship spacecraft",
            image: "https://www.spacex.com/static/images/starship/STARSHIP_Render_Website.jpg"
        },
        {
            id: 3,
            mission: "Europa Clipper",
            provider: "NASA",
            date: "2024-10-10T08:00:00Z",
            location: "Cape Canaveral",
            status: "In Preparation",
            description: "Mission to study Jupiter's moon Europa",
            image: "https://www.nasa.gov/sites/default/files/thumbnails/image/europa-clipper.jpg"
        }
    ];

    useEffect(() => {
        // Using dummy data for now
        setLaunches(dummyLaunches);
        setLoading(false);

        // Uncomment when API is ready
        /*
        const fetchLaunches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/launches');
                setLaunches(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchLaunches();
        */
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500">Loading launches...</p>
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

    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': 'bg-green-500/20 text-green-400',
            'Upcoming': 'bg-blue-500/20 text-blue-400',
            'In Preparation': 'bg-yellow-500/20 text-yellow-400',
            'Delayed': 'bg-red-500/20 text-red-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Upcoming Space Launches
                </h1>
                <p className="text-xl text-gray-300">
                    Track all upcoming missions and space launches
                </p>
            </motion.div>

            {/* Timeline Section */}
            <div className="max-w-6xl mx-auto">
                <div className="space-y-8">
                    {launches.map((launch, index) => (
                        <motion.div
                            key={launch.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img 
                                        src={launch.image} 
                                        alt={launch.mission}
                                        className="w-full h-48 md:h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 md:w-2/3">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold">{launch.mission}</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(launch.status)}`}>
                                            {launch.status}
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Launch Provider</p>
                                            <p className="text-lg">{launch.provider}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Launch Date</p>
                                            <p className="text-lg">
                                                {new Date(launch.date).toLocaleDateString()} 
                                                {new Date(launch.date).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Location</p>
                                            <p className="text-lg">{launch.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{launch.description}</p>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Launch Calendar */}
            <div className="max-w-7xl mx-auto mt-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Launch Calendar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['This Month', 'Next Month', 'Future'].map((period, index) => (
                        <motion.div
                            key={period}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="bg-gray-800/50 p-6 rounded-lg"
                        >
                            <h3 className="text-lg font-semibold mb-4">{period}</h3>
                            <div className="space-y-3">
                                {launches.slice(0, 2).map(launch => (
                                    <div key={launch.id} className="text-sm">
                                        <p className="text-blue-400">{launch.mission}</p>
                                        <p className="text-gray-400">
                                            {new Date(launch.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LaunchesPage;