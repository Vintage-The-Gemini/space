import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Filter, Camera, Zap, Award } from "lucide-react";
import axios from "axios";

const InstrumentObservations = ({
  instrumentId,
  instrumentName,
  instrumentType,
}) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // This would normally fetch from your API
    // For demo purposes, we'll generate sample data based on the instrument
    const fetchObservations = async () => {
      setLoading(true);
      try {
        let observationsData = [];

        // Try to fetch from NASA APIs if possible based on instrument type
        if (
          instrumentName.toLowerCase().includes("webb") ||
          instrumentName.toLowerCase().includes("james webb")
        ) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=james+webb&media_type=image"
            );
            observationsData = response.data.collection.items
              .slice(0, 10)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: item.data[0].nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Deep space observation by James Webb Space Telescope",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance:
                    "First observation of this cosmic feature with this level of detail",
                  published: true,
                };
              });
          } catch (err) {
            console.log("Error fetching NASA API data, using fallback data");
            observationsData = generateSampleData(
              instrumentName,
              instrumentType
            );
          }
        } else if (instrumentName.toLowerCase().includes("hubble")) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=hubble&media_type=image"
            );
            observationsData = response.data.collection.items
              .slice(0, 10)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: item.data[0].nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Deep space observation by Hubble Space Telescope",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance:
                    "Critical observation that enhanced our understanding of the universe",
                  published: true,
                };
              });
          } catch (err) {
            console.log("Error fetching NASA API data, using fallback data");
            observationsData = generateSampleData(
              instrumentName,
              instrumentType
            );
          }
        } else if (
          instrumentName.toLowerCase().includes("perseverance") ||
          instrumentName.toLowerCase().includes("mars")
        ) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=perseverance+mars&media_type=image"
            );
            observationsData = response.data.collection.items
              .slice(0, 10)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: item.data[0].nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Surface observation by Perseverance rover",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance: "Potential evidence of past microbial life",
                  published: true,
                };
              });
          } catch (err) {
            console.log("Error fetching NASA API data, using fallback data");
            observationsData = generateSampleData(
              instrumentName,
              instrumentType
            );
          }
        } else {
          // Fallback to generated data for other instruments
          observationsData = generateSampleData(instrumentName, instrumentType);
        }

        setObservations(observationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching observations:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchObservations();
  }, [instrumentId, instrumentName, instrumentType]);

  const generateSampleData = (instrumentName, instrumentType) => {
    // Generate fake data based on instrument type
    const now = new Date();
    const sampleData = [];

    const observationTypes =
      instrumentType === "Telescope"
        ? [
            "Deep field observation",
            "Spectroscopic analysis",
            "Exoplanet transit",
            "Nebula imaging",
          ]
        : instrumentType === "Rover"
        ? [
            "Surface sample",
            "Geological analysis",
            "Weather recording",
            "Panoramic imaging",
          ]
        : [
            "Data collection",
            "Environmental recording",
            "Signal transmission",
            "Status update",
          ];

    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i * 7); // One observation per week back in time

      const observationType =
        observationTypes[Math.floor(Math.random() * observationTypes.length)];
      const isHistorical = i > 5;

      sampleData.push({
        id: `obs-${Date.now()}-${i}`,
        title: `${observationType} #${i + 1}`,
        date: date.toISOString(),
        description: `This ${observationType.toLowerCase()} by ${instrumentName} ${
          isHistorical ? "revealed" : "is monitoring"
        } important data about ${
          instrumentType === "Telescope"
            ? "the cosmos"
            : instrumentType === "Rover"
            ? "the planetary surface"
            : "its environment"
        }.`,
        imageUrl: `/api/placeholder/${400 + i}/${300 + i}`,
        type: Math.random() > 0.3 ? "image" : "data",
        significance: isHistorical
          ? "This observation changed our understanding significantly"
          : "Ongoing data collection for long-term study",
        published: Math.random() > 0.2,
      });
    }

    return sampleData;
  };

  const filteredObservations = observations.filter((obs) => {
    const matchesSearch =
      obs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "historical" &&
        new Date(obs.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (filter === "recent" &&
        new Date(obs.date) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (filter === "published" && obs.published);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-500">Loading observations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30 text-center">
        <p className="text-red-400">Error loading observations: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
      <h2 className="text-2xl font-light mb-6">Observations & Discoveries</h2>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search observations..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={18} />
          <div className="flex border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 text-sm transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("historical")}
              className={`px-3 py-2 text-sm transition-colors ${
                filter === "historical"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Historical
            </button>
            <button
              onClick={() => setFilter("recent")}
              className={`px-3 py-2 text-sm transition-colors ${
                filter === "recent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-3 py-2 text-sm transition-colors ${
                filter === "published"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Published
            </button>
          </div>
        </div>
      </div>

      {/* Observations List */}
      {filteredObservations.length > 0 ? (
        <div className="space-y-6">
          {filteredObservations.map((observation, index) => (
            <motion.div
              key={observation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800/50"
            >
              <div className="md:flex">
                {observation.type === "image" && (
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={observation.imageUrl}
                      alt={observation.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center bg-black/60 rounded-full px-2 py-1">
                        <Camera className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-xs text-white">Image</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 md:w-2/3">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-medium">{observation.title}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(observation.date).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">
                    {observation.description}
                  </p>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-3">
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-medium text-sm mb-1">
                          Scientific Significance
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {observation.significance}
                        </p>
                      </div>
                    </div>
                  </div>

                  {observation.published && (
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Publication
                        <Zap className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No observations found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstrumentObservations;
