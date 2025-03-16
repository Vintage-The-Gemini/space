import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Activity,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

const InstrumentsList = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInstrumentsData = async () => {
      try {
        setLoading(true);

        // Try to fetch from the actual API endpoint first
        try {
          const response = await axios.get(
            "https://space-mgph.onrender.com/api/instruments"
          );
          setInstruments(response.data);
          setLoading(false);
        } catch (apiError) {
          console.log("Could not fetch from API, using fallback data");

          // Fallback to static data if API fails
          const baseInstruments = [
            {
              _id: "1",
              name: "James Webb Space Telescope",
              type: "Telescope",
              status: "Active",
              location: "L2 Orbit",
              discoveryDate: "2021-12-25",
              description:
                "The largest and most powerful space telescope ever built.",
              image:
                "https://cdn.mos.cms.futurecdn.net/NQRzVz58E3xE3i4Jvopew5.jpg",
            },
            {
              _id: "2",
              name: "Perseverance Rover",
              type: "Rover",
              status: "Active",
              location: "Mars",
              discoveryDate: "2021-02-18",
              description:
                "Exploring Mars for signs of ancient microbial life.",
              image:
                "https://mars.nasa.gov/layout/mars2020/images/PIA23764-RoverNamePlateonMars-web.jpg",
            },
            {
              _id: "3",
              name: "Hubble Space Telescope",
              type: "Telescope",
              status: "Active",
              location: "Low Earth Orbit",
              discoveryDate: "1990-04-24",
              description:
                "One of NASA's most successful and long-lasting space missions.",
              image:
                "https://www.nasa.gov/sites/default/files/thumbnails/image/hubble_2009.jpg",
            },
            {
              _id: "4",
              name: "GPS IIF",
              type: "Satellite",
              status: "Active",
              location: "MEO",
              discoveryDate: "2010-05-27",
              description:
                "Part of the Global Positioning System constellation providing navigation services.",
              image: "https://www.gps.gov/multimedia/images/constellation.jpg",
            },
            {
              _id: "5",
              name: "Chandra X-ray Observatory",
              type: "Observatory",
              status: "Active",
              location: "Elliptical Orbit",
              discoveryDate: "1999-07-23",
              description:
                "Observes X-ray sources from black holes to galaxy clusters.",
              image:
                "https://upload.wikimedia.org/wikipedia/commons/f/fd/Chandra_artist_illustration.jpg",
            },
            {
              _id: "6",
              name: "GOES-18",
              type: "Satellite",
              status: "Active",
              location: "Geostationary Orbit",
              discoveryDate: "2022-03-01",
              description:
                "Weather monitoring satellite providing continuous observations.",
              image:
                "https://www.nesdis.noaa.gov/sites/default/files/assets/images/goes-r_primary.jpg",
            },
            {
              _id: "7",
              name: "InSight Lander",
              type: "Lander",
              status: "Inactive",
              location: "Mars",
              discoveryDate: "2018-05-05",
              description:
                "Studying the deep interior of Mars through seismology.",
              image:
                "https://d2pn8kiwq2w21t.cloudfront.net/original_images/missionswebPIA22743-16_vD6Nx99.jpg",
            },
            {
              _id: "8",
              name: "SMAP",
              type: "Observatory",
              status: "Active",
              location: "Low Earth Orbit",
              discoveryDate: "2015-01-31",
              description:
                "Measuring Earth's soil moisture and freeze/thaw state.",
              image:
                "https://smap.jpl.nasa.gov/system/resources/detail_files/189_SMAP_DuskLaunch_hires.jpg",
            },
          ];

          setInstruments(baseInstruments);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInstrumentsData();
  }, []);

  const filterInstruments = (type) => {
    setActiveFilter(type);
  };

  const getFilteredInstruments = () => {
    const filtered =
      activeFilter === "all"
        ? instruments
        : instruments.filter((instrument) => instrument.type === activeFilter);

    return filtered.filter(
      (instrument) =>
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getUniqueTypes = () => {
    const types = new Set(instruments.map((instrument) => instrument.type));
    return ["all", ...Array.from(types)];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 text-lg">Loading space instruments...</p>
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
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url("https://www.nasa.gov/wp-content/uploads/2023/03/main_image_star-forming_region_carina_nircam_final-1.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />

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
              className="w-full bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-blue-400 mr-2" />
          <h2 className="text-xl font-light">Filter by Type</h2>
        </div>
        <div className="flex flex-wrap justify-start gap-4">
          {getUniqueTypes().map((type) => (
            <button
              key={type}
              onClick={() => filterInstruments(type)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeFilter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Instruments Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getFilteredInstruments().map((instrument, index) => (
            <motion.div
              key={instrument._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={instrument.image}
                  alt={instrument.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      instrument.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {instrument.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {instrument.type}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-medium mb-4">{instrument.name}</h3>
                <p className="text-gray-300 mb-6 flex-1">
                  {instrument.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-light">{instrument.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-light">
                      Launched:{" "}
                      {new Date(instrument.discoveryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/instrument/${instrument._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 inline-flex items-center justify-center transition-colors duration-300 mt-auto"
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {getFilteredInstruments().length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No instruments found matching your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentsList;
