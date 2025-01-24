import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Activity } from 'lucide-react';
import axios from 'axios';

const InstrumentsList = () => {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInstrumentsData = async () => {
            try {
                const [spacenewsResponse] = await Promise.all([
                    axios.get('https://api.spaceflightnewsapi.net/v4/articles?limit=20&contains_tags=instrument,telescope,rover,satellite')
                ]);

                // Base instruments that we know are active
                const baseInstruments = [
                   
                        {
                            _id: '1',
                            name: 'James Webb Space Telescope',
                            type: 'Telescope',
                            status: 'Active',
                            location: 'L2 Orbit',
                            discoveryDate: '2021-12-25',
                            description: 'The largest and most powerful space telescope ever built.',
                            image: 'https://cdn.mos.cms.futurecdn.net/NQRzVz58E3xE3i4Jvopew5.jpg'
                        },
                        {
                            _id: '2',
                            name: 'Perseverance Rover',
                            type: 'Rover',
                            status: 'Active',
                            location: 'Mars',
                            discoveryDate: '2021-02-18',
                            description: 'Exploring Mars for signs of ancient microbial life.',
                            image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQngupDiADyN5ufHCi6cV4cqADCmMsaVu_MIgKwde9itZozNOmG1NavMpvb4VarFUOfXxbK7vYDjFi8-otrffOppmXNsOnEgfKbr5h-tMY'
                        },
                        {
                            _id: '3',
                            name: 'Hubble Space Telescope',
                            type: 'Telescope',
                            status: 'Active',
                            location: 'Low Earth Orbit',
                            discoveryDate: '1990-04-24',
                            description: 'One of NASAs most successful and long-lasting space missions.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSplDDljz93C0kWSQJcgGN7-iwoqwNRoTdPww&sg'
                        },
                        {
                            _id: '4',
                            name: 'GPS IIF',
                            type: 'Satellite',
                            status: 'Active',
                            location: 'MEO',
                            discoveryDate: '2010-05-27',
                            description: 'Part of the Global Positioning System constellation providing navigation services.',
                            image: 'https://www.gps.gov/multimedia/images/constellation.jpg'
                        },
                        {
                            _id: '5',
                            name: 'Chandra X-ray Observatory',
                            type: 'Observatory',
                            status: 'Active',
                            location: 'Elliptical Orbit',
                            discoveryDate: '1999-07-23',
                            description: 'Observes X-ray sources from black holes to galaxy clusters.',
                            image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Chandra_artist_illustration.jpg'
                        },
                        {
                            _id: '6',
                            name: 'GOES-18',
                            type: 'Satellite',
                            status: 'Active',
                            location: 'Geostationary Orbit',
                            discoveryDate: '2022-03-01',
                            description: 'Weather monitoring satellite providing continuous observations.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWCRb0mH7aJIpzjaHls4XAv5Uwd9pNYenw4Q&s'
                        },
                        {
                            _id: '7',
                            name: 'InSight Lander',
                            type: 'Lander',
                            status: 'Inactive',
                            location: 'Mars',
                            discoveryDate: '2018-05-05',
                            description: 'Studying the deep interior of Mars through seismology.',
                            image: 'https://d2pn8kiwq2w21t.cloudfront.net/original_images/missionswebPIA22743-16_vD6Nx99.jpg'
                        },
                        {
                            _id: '8',
                            name: 'SMAP',
                            type: 'Observatory',
                            status: 'Active',
                            location: 'Low Earth Orbit',
                            discoveryDate: '2015-01-31',
                            description: 'Measuring Earth\'s soil moisture and freeze/thaw state.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN_I6B8nLKqY6RDSsGp55d6JigjeEOzVnHZw&s'
                        }
                  
                
                ];

                // Extract any mentioned instruments from news articles
                const newsInstruments = spacenewsResponse.data.results
                    .filter(article => {
                        const text = (article.title + article.summary).toLowerCase();
                        return text.includes('telescope') || text.includes('rover') || 
                               text.includes('satellite') || text.includes('observatory');
                    })
                    .map(article => ({
                        _id: `news-${article.id}`,
                        name: extractInstrumentName(article.title),
                        type: determineType(article.title),
                        status: 'Active',
                        location: determineLocation(article.title),
                        discoveryDate: article.published_at,
                        description: article.summary,
                        image: article.image_url || '/api/placeholder/400/300'
                    }));

                const combinedInstruments = [...baseInstruments, ...newsInstruments];
                setInstruments(combinedInstruments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching instruments:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchInstrumentsData();
        const interval = setInterval(fetchInstrumentsData, 300000);
        return () => clearInterval(interval);
    }, []);

    const extractInstrumentName = (title) => {
        const matches = title.match(/["']([^"']+)["']/) || title.match(/(\w+(?:\s+\w+){0,3}\s+(?:Telescope|Rover|Satellite|Observatory|Lander))/i);
        return matches ? matches[1] : title;
    };

    const determineType = (title) => {
        title = title.toLowerCase();
        if (title.includes('telescope')) return 'Telescope';
        if (title.includes('rover')) return 'Rover';
        if (title.includes('satellite')) return 'Satellite';
        if (title.includes('observatory')) return 'Observatory';
        if (title.includes('lander')) return 'Lander';
        return 'Instrument';
    };

    const determineLocation = (title) => {
        title = title.toLowerCase();
        if (title.includes('mars')) return 'Mars';
        if (title.includes('lunar') || title.includes('moon')) return 'Moon';
        if (title.includes('l2')) return 'L2 Orbit';
        if (title.includes('orbit')) return 'Earth Orbit';
        return 'Space';
    };

    const filterInstruments = (type) => {
        setActiveFilter(type);
    };

    const getFilteredInstruments = () => {
        const filtered = activeFilter === 'all' 
            ? instruments 
            : instruments.filter(instrument => instrument.type === activeFilter);

        return filtered.filter(instrument => 
            instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instrument.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getUniqueTypes = () => {
        const types = new Set(instruments.map(instrument => instrument.type));
        return ['all', ...Array.from(types)];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500 text-lg">Loading space instruments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black">
                <div className="bg-red-600/10 p-6 rounded-lg border border-red-500">
                    <p className="text-red-500">Error: {error}</p>
                </div>
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
                        backgroundImage: 'url("/api/placeholder/1920/1080")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-light mb-8"
                    >
                        Space Instruments
                    </motion.h1>
                    
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search instruments..."
                            className="w-full bg-black/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {getUniqueTypes().map((type) => (
                        <button
                            key={type}
                            onClick={() => filterInstruments(type)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                activeFilter === type 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Instruments Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getFilteredInstruments().map((instrument, index) => (
                        <motion.article
                            key={instrument._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={instrument.image}
                                    alt={instrument.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/400/300';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        instrument.status === 'Active' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {instrument.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-4">{instrument.name}</h3>
                                <p className="text-gray-400 mb-6 line-clamp-3">{instrument.description}</p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-300">
                                        <Activity className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-2">Type:</span>
                                        {instrument.type}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-2">Location:</span>
                                        {instrument.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-2">Launched:</span>
                                        {new Date(instrument.discoveryDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                    View Details
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstrumentsList;