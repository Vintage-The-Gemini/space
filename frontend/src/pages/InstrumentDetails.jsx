import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Activity,
  Server,
  ArrowLeft,
  ExternalLink,
  Award,
  Clock,
  Zap,
} from "lucide-react";

const InstrumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState(null);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchInstrumentDetails = async () => {
      try {
        setLoading(true);

        // Try to fetch from the actual API endpoint
        try {
          const response = await axios.get(
            `https://space-mgph.onrender.com/api/instruments/${id}`
          );
          const instrumentData = response.data.data || response.data;
          setInstrument(instrumentData);

          // Fetch observations for this instrument
          fetchObservations(instrumentData.name, instrumentData.type);
        } catch (apiError) {
          console.log("Could not fetch from API, using fallback data");

          // Fallback data for demonstration if API fails
          const fallbackInstruments = [
            {
              _id: "1",
              name: "James Webb Space Telescope",
              type: "Telescope",
              status: "Active",
              location: "L2 Orbit",
              discoveryDate: "2021-12-25",
              description:
                "The largest and most powerful space telescope ever built, designed to study the universe in infrared light. It can observe objects up to 100 times fainter than Hubble can see. With its 6.5-meter gold-coated primary mirror and suite of infrared instruments, JWST is unveiling the earliest galaxies, star formation hidden within dusty clouds, and the atmospheres of distant exoplanets.",
              specifications: {
                dimensions: {
                  length: 20.197,
                  width: 14.162,
                  height: 8.4,
                  unit: "m",
                },
                weight: { value: 6200, unit: "kg" },
                powerSource: "Solar Array",
                operatingWavelength: "0.6-28.3 micrometers",
                cost: "$9.7 billion",
                primaryMirror: "6.5 meters diameter (21.7 feet)",
                orbitLocation: "L2 Lagrange point, 1.5 million km from Earth",
              },
              mission: {
                name: "JWST Mission",
                agency: "NASA/ESA/CSA",
                launchVehicle: "Ariane 5 ECA",
                launchSite: "Kourou, French Guiana",
                objectives: [
                  "Study first light and reionization after the Big Bang",
                  "Assembly of galaxies in the early universe",
                  "Birth of stars and protoplanetary systems",
                  "Planetary systems and origins of life",
                  "Detailed exoplanet atmosphere characterization",
                ],
              },
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
                "Part of NASA's Mars 2020 mission, Perseverance is searching for signs of ancient microbial life and collecting samples of Martian rock and regolith for a potential return to Earth. The car-sized rover features advanced instruments including the Ingenuity helicopter demonstration and the MOXIE experiment to produce oxygen from the Martian atmosphere.",
              specifications: {
                dimensions: { length: 3, width: 2.7, height: 2.2, unit: "m" },
                weight: { value: 1025, unit: "kg" },
                powerSource: "Radioisotope Thermoelectric Generator",
                maxSpeed: "0.152 km/h",
                communicationSystem: "UHF and X-band direct-to-Earth",
                instruments:
                  "MEDA, MOXIE, PIXL, RIMFAX, SHERLOC, SuperCam, Mastcam-Z",
              },
              mission: {
                name: "Mars 2020",
                agency: "NASA",
                launchVehicle: "Atlas V 541",
                launchSite: "Cape Canaveral SLC-41",
                objectives: [
                  "Search for signs of ancient microbial life",
                  "Characterize the geology and climate of Mars",
                  "Collect and cache Martian rock and regolith samples",
                  "Test oxygen production from the Martian atmosphere",
                  "Demonstrate technology for future robotic and human missions",
                ],
                landingSite: "Jezero Crater",
              },
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
                "One of NASA's most successful and long-lasting space missions, Hubble has revolutionized our understanding of the universe with its deep field observations and detailed images of distant galaxies. Over its three-decade operational lifetime, Hubble has made more than 1.4 million observations, generated over 150 terabytes of data, and featured in over 18,000 scientific papers.",
              specifications: {
                dimensions: {
                  length: 13.2,
                  width: 4.2,
                  height: 4.2,
                  unit: "m",
                },
                weight: { value: 11110, unit: "kg" },
                powerSource: "Solar Arrays",
                operatingWavelength: "0.1-0.8 micrometers",
                orbitHeight: "547 km",
                primaryMirror: "2.4 meters diameter",
                instruments: "ACS, COS, FGS, STIS, WFC3",
              },
              mission: {
                name: "Hubble Space Telescope",
                agency: "NASA/ESA",
                launchVehicle: "Space Shuttle Discovery (STS-31)",
                objectives: [
                  "Study distant galaxies and quasars",
                  "Measure the expansion rate of the universe",
                  "Observe the life cycles of stars",
                  "Study planetary atmospheres within our solar system",
                  "Look for supermassive black holes",
                ],
                servicingMissions: 5,
              },
              image:
                "https://www.nasa.gov/sites/default/files/thumbnails/image/hubble_2009.jpg",
            },
          ];

          const selectedInstrument =
            fallbackInstruments.find((inst) => inst._id === id) ||
            fallbackInstruments[0];
          setInstrument(selectedInstrument);

          // Fetch observations for this instrument
          fetchObservations(selectedInstrument.name, selectedInstrument.type);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchObservations = async (name, type) => {
      try {
        // Try to fetch real observations if possible
        if (
          name.toLowerCase().includes("webb") ||
          name.toLowerCase().includes("james webb")
        ) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=james+webb&media_type=image&year_start=2022"
            );
            const observationsData = response.data.collection.items
              .slice(0, 6)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: data.nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Deep space observation by James Webb Space Telescope",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance:
                    "This observation reveals new details about cosmic structures and star formation.",
                  published: true,
                };
              });
            setObservations(observationsData);
            setLoading(false);
          } catch (err) {
            generateFallbackObservations(name, type);
          }
        } else if (name.toLowerCase().includes("hubble")) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=hubble&media_type=image&year_start=2020"
            );
            const observationsData = response.data.collection.items
              .slice(0, 6)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: data.nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Deep space observation by Hubble Space Telescope",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance:
                    "This image helps astronomers understand the evolution of galaxies and stellar objects.",
                  published: true,
                };
              });
            setObservations(observationsData);
            setLoading(false);
          } catch (err) {
            generateFallbackObservations(name, type);
          }
        } else if (
          name.toLowerCase().includes("perseverance") ||
          name.toLowerCase().includes("mars")
        ) {
          try {
            const response = await axios.get(
              "https://images-api.nasa.gov/search?q=perseverance+mars&media_type=image&year_start=2021"
            );
            const observationsData = response.data.collection.items
              .slice(0, 6)
              .map((item) => {
                const data = item.data[0];
                return {
                  id: data.nasa_id,
                  title: data.title,
                  date: data.date_created,
                  description:
                    data.description ||
                    "Surface observation by Perseverance rover",
                  imageUrl: item.links?.[0]?.href || "/api/placeholder/400/300",
                  type: "image",
                  significance:
                    "This image provides insights into Martian geology and potential signs of past microbial life.",
                  published: true,
                };
              });
            setObservations(observationsData);
            setLoading(false);
          } catch (err) {
            generateFallbackObservations(name, type);
          }
        } else {
          generateFallbackObservations(name, type);
        }
      } catch (error) {
        generateFallbackObservations(name, type);
      }
    };

    const generateFallbackObservations = (name, type) => {
      // Generate fake data based on instrument type
      const now = new Date();
      const sampleData = [];

      const observationTypes =
        type === "Telescope"
          ? [
              "Deep field observation",
              "Spectroscopic analysis",
              "Exoplanet transit",
              "Nebula imaging",
            ]
          : type === "Rover"
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

      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i * 30); // One observation per month back in time

        const observationType =
          observationTypes[Math.floor(Math.random() * observationTypes.length)];
        const isHistorical = i > 2;

        sampleData.push({
          id: `obs-${Date.now()}-${i}`,
          title: `${observationType} #${i + 1}`,
          date: date.toISOString(),
          description: `This ${observationType.toLowerCase()} by ${name} ${
            isHistorical ? "revealed" : "is monitoring"
          } important data about ${
            type === "Telescope"
              ? "the cosmos"
              : type === "Rover"
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

      setObservations(sampleData);
      setLoading(false);
    };

    fetchInstrumentDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
        <div
          className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );

  if (!instrument)
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
        <div className="text-center text-gray-500">No instrument found</div>
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${instrument.image})`,
            opacity: 0.4,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 container mx-auto px-4 max-w-5xl"
        >
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/instruments")}
              className="bg-gray-800/70 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Instruments
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            {instrument.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                instrument.status === "Active"
                  ? "bg-green-500/30 text-green-400"
                  : instrument.status === "Inactive"
                  ? "bg-red-500/30 text-red-400"
                  : "bg-yellow-500/30 text-yellow-400"
              }`}
            >
              {instrument.status}
            </span>
            <span className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              {instrument.location}
            </span>
            <span className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              Launched:{" "}
              {new Date(instrument.discoveryDate).toLocaleDateString()}
            </span>
            <span className="bg-blue-600/70 px-3 py-1 rounded-full text-sm text-white">
              {instrument.type}
            </span>
          </div>
          <p className="text-gray-200 max-w-3xl leading-relaxed">
            {instrument.description}
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 max-w-5xl -mt-6 relative z-20">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-t-xl border border-gray-700/50">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-4 transition-colors ${
                activeTab === "overview"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-5 py-4 transition-colors ${
                activeTab === "specifications"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("observations")}
              className={`px-5 py-4 transition-colors ${
                activeTab === "observations"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
              }`}
            >
              Observations & Discoveries
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-5 py-4 transition-colors ${
                activeTab === "mission"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
              }`}
            >
              Mission
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 max-w-5xl mb-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-b-xl border-x border-b border-gray-700/50 p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-light mb-8 pb-4 border-b border-gray-700/50">
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                  <Calendar className="w-6 h-6 text-blue-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Launch Date</h3>
                  <p className="text-gray-300">
                    {new Date(instrument.discoveryDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                  <MapPin className="w-6 h-6 text-purple-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Current Location</h3>
                  <p className="text-gray-300">{instrument.location}</p>
                  {instrument.specifications?.orbitLocation && (
                    <p className="text-gray-500 text-sm mt-1">
                      {instrument.specifications.orbitLocation}
                    </p>
                  )}
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                  <Activity className="w-6 h-6 text-green-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">
                    Operational Status
                  </h3>
                  <p
                    className={
                      instrument.status === "Active"
                        ? "text-green-400"
                        : instrument.status === "Inactive"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {instrument.status}
                  </p>
                  {instrument.status === "Active" && (
                    <p className="text-gray-500 text-sm mt-1">
                      Currently collecting data
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                <h3 className="text-xl font-medium mb-4">Key Achievements</h3>
                <div className="space-y-4">
                  {instrument.type === "Telescope" && (
                    <>
                      <div className="flex">
                        <div className="bg-blue-500/20 text-blue-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Revolutionary Observations
                          </h4>
                          <p className="text-gray-400 mt-1">
                            Capturing unprecedented images of distant cosmic
                            objects, revealing new details about galaxy
                            formation and stellar evolution.
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-purple-500/20 text-purple-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Scientific Breakthroughs
                          </h4>
                          <p className="text-gray-400 mt-1">
                            Contributing to groundbreaking discoveries about the
                            universe, including exoplanet atmospheres, dark
                            matter, and the early universe.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {instrument.type === "Rover" && (
                    <>
                      <div className="flex">
                        <div className="bg-blue-500/20 text-blue-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Surface Exploration</h4>
                          <p className="text-gray-400 mt-1">
                            Successfully navigating harsh planetary terrain
                            while collecting valuable geological samples and
                            environmental data.
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-green-500/20 text-green-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Scientific Analysis</h4>
                          <p className="text-gray-400 mt-1">
                            Conducting on-site experiments to search for
                            evidence of past habitability and potential
                            biosignatures.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {["Satellite", "Observatory"].includes(instrument.type) && (
                    <>
                      <div className="flex">
                        <div className="bg-blue-500/20 text-blue-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Data Collection</h4>
                          <p className="text-gray-400 mt-1">
                            Continuously gathering essential scientific data and
                            enabling important Earth observation and
                            astronomical research.
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-orange-500/20 text-orange-400 rounded-full min-w-8 h-8 flex items-center justify-center mr-4">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Operational Longevity</h4>
                          <p className="text-gray-400 mt-1">
                            Maintaining consistent performance and exceeding
                            expected operational lifetime through robust
                            engineering and careful management.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <h2 className="text-2xl font-light mb-8 pb-4 border-b border-gray-700/50">
                Technical Specifications
              </h2>

              {instrument.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                      <h3 className="text-xl font-medium mb-4">
                        Physical Properties
                      </h3>

                      {instrument.specifications.dimensions && (
                        <div className="mb-4">
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-24">
                              Dimensions
                            </p>
                            <p className="text-white">
                              {`${instrument.specifications.dimensions.length} × ${instrument.specifications.dimensions.width} × ${instrument.specifications.dimensions.height} ${instrument.specifications.dimensions.unit}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {instrument.specifications.weight && (
                        <div className="flex items-center">
                          <p className="text-gray-400 text-sm w-24">Weight</p>
                          <p className="text-white">
                            {`${instrument.specifications.weight.value.toLocaleString()} ${
                              instrument.specifications.weight.unit
                            }`}
                          </p>
                        </div>
                      )}

                      {instrument.specifications.primaryMirror && (
                        <div className="flex items-center mt-4">
                          <p className="text-gray-400 text-sm w-24">
                            Primary Mirror
                          </p>
                          <p className="text-white">
                            {instrument.specifications.primaryMirror}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                      <h3 className="text-xl font-medium mb-4">
                        Power Systems
                      </h3>
                      <div className="flex items-center">
                        <p className="text-gray-400 text-sm w-24">
                          Power Source
                        </p>
                        <p className="text-white">
                          {instrument.specifications.powerSource}
                        </p>
                      </div>
                    </div>

                    {instrument.specifications.cost && (
                      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                        <h3 className="text-xl font-medium mb-4">Cost</h3>
                        <div className="flex items-center">
                          <p className="text-gray-400 text-sm w-24">
                            Total Budget
                          </p>
                          <p className="text-white">
                            {instrument.specifications.cost}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {instrument.type === "Telescope" && (
                      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                        <h3 className="text-xl font-medium mb-4">
                          Optical Properties
                        </h3>

                        {instrument.specifications.operatingWavelength && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Wavelength Range
                            </p>
                            <p className="text-white">
                              {instrument.specifications.operatingWavelength}
                            </p>
                          </div>
                        )}

                        {instrument.specifications.orbitHeight && (
                          <div className="flex items-center mt-4">
                            <p className="text-gray-400 text-sm w-36">
                              Orbit Height
                            </p>
                            <p className="text-white">
                              {instrument.specifications.orbitHeight}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {instrument.type === "Rover" && (
                      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                        <h3 className="text-xl font-medium mb-4">
                          Mobility & Communication
                        </h3>

                        {instrument.specifications.maxSpeed && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Maximum Speed
                            </p>
                            <p className="text-white">
                              {instrument.specifications.maxSpeed}
                            </p>
                          </div>
                        )}

                        {instrument.specifications.communicationSystem && (
                          <div className="flex items-center mt-4">
                            <p className="text-gray-400 text-sm w-36">
                              Communication
                            </p>
                            <p className="text-white">
                              {instrument.specifications.communicationSystem}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {instrument.specifications.instruments && (
                      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                        <h3 className="text-xl font-medium mb-4">
                          Scientific Instruments
                        </h3>
                        <div className="flex items-start">
                          <p className="text-gray-400 text-sm w-36">
                            Instruments
                          </p>
                          <p className="text-white">
                            {instrument.specifications.instruments}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed specifications not available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "observations" && (
            <div>
              <h2 className="text-2xl font-light mb-8 pb-4 border-b border-gray-700/50">
                Observations & Discoveries
              </h2>

              {observations.length > 0 ? (
                <div className="space-y-8">
                  {observations.map((observation, index) => (
                    <motion.div
                      key={observation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50"
                    >
                      <div className="md:flex">
                        {observation.type === "image" &&
                          observation.imageUrl && (
                            <div className="md:w-2/5 h-60 md:h-auto relative">
                              <img
                                src={observation.imageUrl}
                                alt={observation.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/400/300";
                                }}
                              />
                            </div>
                          )}

                        <div className="p-6 md:w-3/5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <h3 className="text-xl font-medium">
                              {observation.title}
                            </h3>
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
                                View Publication Details
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No observations found for this instrument</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "mission" && (
            <div>
              <h2 className="text-2xl font-light mb-8 pb-4 border-b border-gray-700/50">
                Mission Profile
              </h2>

              {instrument.mission ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                      <h3 className="text-xl font-medium mb-4">
                        Mission Details
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <p className="text-gray-400 text-sm w-36">
                            Mission Name
                          </p>
                          <p className="text-white">
                            {instrument.mission.name}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <p className="text-gray-400 text-sm w-36">
                            Operating Agency
                          </p>
                          <p className="text-white">
                            {instrument.mission.agency}
                          </p>
                        </div>

                        {instrument.mission.launchVehicle && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Launch Vehicle
                            </p>
                            <p className="text-white">
                              {instrument.mission.launchVehicle}
                            </p>
                          </div>
                        )}

                        {instrument.mission.launchSite && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Launch Site
                            </p>
                            <p className="text-white">
                              {instrument.mission.launchSite}
                            </p>
                          </div>
                        )}

                        {instrument.mission.landingSite && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Landing Site
                            </p>
                            <p className="text-white">
                              {instrument.mission.landingSite}
                            </p>
                          </div>
                        )}

                        {instrument.mission.servicingMissions && (
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm w-36">
                              Servicing Missions
                            </p>
                            <p className="text-white">
                              {instrument.mission.servicingMissions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
                    <h3 className="text-xl font-medium mb-4">
                      Mission Objectives
                    </h3>

                    {instrument.mission.objectives &&
                    instrument.mission.objectives.length > 0 ? (
                      <ul className="space-y-4">
                        {instrument.mission.objectives.map(
                          (objective, index) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-blue-500/20 text-blue-400 rounded-full min-w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-gray-300">{objective}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No mission objectives specified
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Mission details not available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetails;
