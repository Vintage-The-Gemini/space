import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const InstrumentsList = () => {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const dummyInstruments = [
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
            image: 'https://www.sciencefriday.com/wp-content/uploads/2020/07/perserverance-illustration.png'
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

    useEffect(() => {
        setInstruments(dummyInstruments);
        setLoading(false);
    }, []);

    const filterInstruments = (type) => {
        setActiveFilter(type);
    };

    const getFilteredInstruments = () => {
        if (activeFilter === 'all') return instruments;
        return instruments.filter(instrument => instrument.type === activeFilter);
    };

    const getUniqueTypes = () => {
        const types = new Set(instruments.map(instrument => instrument.type));
        return ['all', ...Array.from(types)];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-lg">Loading space instruments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
                <div className="bg-red-600/10 p-6 rounded-lg border border-red-500">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    Space Exploration Instruments
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Discover the cutting-edge technology that helps us explore the final frontier
                </p>
            </div>

            <div className="max-w-7xl mx-auto mb-12">
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

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getFilteredInstruments().map((instrument, index) => (
                        <motion.div
                            key={instrument._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative h-48">
                                <img
                                    src={instrument.image}
                                    alt={instrument.name}
                                    className="w-full h-full object-cover"
                                />
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
                                <h3 className="text-xl font-bold mb-2">{instrument.name}</h3>
                                <p className="text-gray-400 mb-4">{instrument.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="font-medium mr-2">Type:</span>
                                        {instrument.type}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="font-medium mr-2">Location:</span>
                                        {instrument.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="font-medium mr-2">Launched:</span>
                                        {new Date(instrument.discoveryDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstrumentsList;