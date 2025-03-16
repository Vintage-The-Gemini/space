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

        // Fetch space news articles for potential instruments
        const spacenewsResponse = await axios.get(
          "https://api.spaceflightnewsapi.net/v4/articles?limit=20&contains_tags=instrument,telescope,rover,satellite"
        );

        // Base instruments that we know are active
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
            description: "Exploring Mars for signs of ancient microbial life.",
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

        // Extract any mentioned instruments from news articles
        const newsInstruments = spacenewsResponse.data.results
          .filter((article) => {
            const text = (article.title + article.summary).toLowerCase();
            return (
              text.includes("telescope") ||
              text.includes("rover") ||
              text.includes("satellite") ||
              text.includes("observatory")
            );
          })
          .map((article) => ({
            _id: `news-${article.id}`,
            name: extractInstrumentName(article.title),
            type: determineType(article.title),
            status: "Active",
            location: determineLocation(article.title),
            discoveryDate: article.published_at,
            description: article.summary,
            image: article.image_url || "/api/placeholder/400/300",
          }));

        const combinedInstruments = [...baseInstruments, ...newsInstruments];

        // Log the instruments for debugging
        console.log("Total instruments loaded:", combinedInstruments.length);

        setInstruments(combinedInstruments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instruments:", error);
        // Even if we encounter an error, still use the base instruments
        setInstruments(baseInstruments || []);
        setError(
          "Could not fetch all instrument data. Some instruments may be missing."
        );
        setLoading(false);
      }
    };

    fetchInstrumentsData();
  }, []);

  const extractInstrumentName = (title) => {
    const matches =
      title.match(/["']([^"']+)["']/) ||
      title.match(
        /(\w+(?:\s+\w+){0,3}\s+(?:Telescope|Rover|Satellite|Observatory|Lander))/i
      );
    return matches ? matches[1] : title;
  };

  const determineType = (title) => {
    title = title.toLowerCase();
    if (title.includes("telescope")) return "Telescope";
    if (title.includes("rover")) return "Rover";
    if (title.includes("satellite")) return "Satellite";
    if (title.includes("observatory")) return "Observatory";
    if (title.includes("lander")) return "Lander";
    return "Instrument";
  };

  const determineLocation = (title) => {
    title = title.toLowerCase();
    if (title.includes("mars")) return "Mars";
    if (title.includes("lunar") || title.includes("moon")) return "Moon";
    if (title.includes("l2")) return "L2 Orbit";
    if (title.includes("orbit")) return "Earth Orbit";
    return "Space";
  };

  const filterInstruments = (type) => {
    setActiveFilter(type);
  };

  const getFilteredInstruments = () => {
    if (!instruments || instruments.length === 0) {
      return [];
    }

    const filtered =
      activeFilter === "all"
        ? instruments
        : instruments.filter((instrument) => instrument.type === activeFilter);

    return filtered.filter((instrument) => {
      const nameMatch = instrument.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descMatch =
        instrument.description &&
        instrument.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return nameMatch || descMatch;
    });
  };

  const getUniqueTypes = () => {
    if (!instruments || instruments.length === 0) {
      return ["all"];
    }
    const types = new Set(instruments.map((instrument) => instrument.type));
    return ["all", ...Array.from(types)];
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

  const filteredInstruments = getFilteredInstruments();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url("https://www.nasa.gov/wp-content/uploads/2023/03/main_image_star-forming_region_carina_nircam_final-1.jpg")',
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
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-400">
          Displaying {filteredInstruments.length} instruments
          {activeFilter !== "all" && ` of type "${activeFilter}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Instruments Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstruments.map((instrument, index) => (
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
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
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
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{instrument.name}</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">
                  {instrument.description}
                </p>

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

                <Link
                  to={`/instrument/${instrument._id}`}
                  className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredInstruments.length === 0 && (
          <div className="bg-gray-900/30 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-xl">
              No instruments found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentsList;
