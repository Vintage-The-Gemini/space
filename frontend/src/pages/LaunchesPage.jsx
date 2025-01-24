import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, Search, Rocket } from 'lucide-react';
import axios from 'axios';

const LaunchesPage = () => {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/');
                setLaunches(response.data.results);
                setLoading(false);

                // Refresh data every 5 minutes
                const interval = setInterval(async () => {
                    const refreshResponse = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/');
                    setLaunches(refreshResponse.data.results);
                }, 300000);

                return () => clearInterval(interval);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'Go': 'bg-green-500/20 text-green-400',
            'TBD': 'bg-yellow-500/20 text-yellow-400',
            'Hold': 'bg-red-500/20 text-red-400',
            'Success': 'bg-blue-500/20 text-blue-400',
            'Failure': 'bg-red-500/20 text-red-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const filteredLaunches = launches.filter(launch => {
        const matchesSearch = launch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            launch.mission?.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || launch.status?.name === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500">Loading launches...</p>
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
                        backgroundImage: 'url("https://akm-img-a-in.tosshub.com/indiatoday/images/story/202501/falcon-9-launch-gsat-n2-173057987-16x9.jpg?VersionId=vEWxCHv1y4bTjF6S9lVdZzPDKDAbUNQ1&size=690:388")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-light mb-8"
                    >
                        Space Launches
                    </motion.h1>
                    
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search launches..."
                            className="w-full bg-black/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Status Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {['all', 'Go', 'TBD', 'Hold', 'Success'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                selectedStatus === status 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {status === 'all' ? 'All Launches' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Launches Timeline */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="space-y-8">
                    {filteredLaunches.map((launch, index) => (
                        <motion.article
                            key={launch.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="md:flex">
                                <div className="md:w-1/3 relative overflow-hidden">
                                    <img 
                                        src={launch.image || launch.rocket?.configuration?.image_url || '/api/placeholder/400/300'}
                                        alt={launch.name}
                                        className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/400/300';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                </div>
                                <div className="p-6 md:w-2/3">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                        <h2 className="text-2xl font-light">{launch.name}</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(launch.status?.name)}`}>
                                            {launch.status?.name || 'Status Unknown'}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <Rocket className="w-5 h-5 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Launch Provider</p>
                                                <p className="text-lg">{launch.launch_service_provider?.name || 'Unknown'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Calendar className="w-5 h-5 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Launch Date</p>
                                                <p className="text-lg">
                                                    {new Date(launch.net).toLocaleDateString()} 
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Location</p>
                                                <p className="text-lg">{launch.pad?.location?.name || 'Location TBD'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Clock className="w-5 h-5 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Launch Time</p>
                                                <p className="text-lg">
                                                    {new Date(launch.net).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-6">{launch.mission?.description || 'Mission details coming soon.'}</p>

                                    <a
                                        href={launch.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        View Launch Details 
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Launch Calendar */}
            <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-900/30">
                <h2 className="text-3xl font-light mb-12 text-center">Launch Calendar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['This Month', 'Next Month', 'Future Launches'].map((period, index) => (
                        <motion.div
                            key={period}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-gray-800/50"
                        >
                            <h3 className="text-xl font-light mb-6">{period}</h3>
                            <div className="space-y-4">
                                {launches.slice(0, 3).map(launch => (
                                    <div key={launch.id} className="flex items-start space-x-3">
                                        <Calendar className="w-4 h-4 text-blue-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-blue-400">{launch.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(launch.net).toLocaleDateString()}
                                            </p>
                                        </div>
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