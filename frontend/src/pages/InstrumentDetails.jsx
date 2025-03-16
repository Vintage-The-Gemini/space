import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Activity,
  ArrowLeft,
  ExternalLink,
  Award,
  Clock,
  Zap,
  Server,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";

// Import the InstrumentObservations component
import InstrumentObservations from "../components/instruments/InstrumentObservations";

const InstrumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchInstrumentDetails = async () => {
      try {
        setLoading(true);

        // Base instruments data for fallback
        const baseInstruments = [
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
          {
            _id: "4",
            name: "GPS IIF",
            type: "Satellite",
            status: "Active",
            location: "MEO",
            discoveryDate: "2010-05-27",
            description:
              "The Global Positioning System (GPS) Block IIF satellites are part of the operational constellation providing precise positioning, navigation, and timing services worldwide for both civilian and military users. These advanced satellites offer improved accuracy, stronger signals, and enhanced capabilities compared to previous generations.",
            specifications: {
              dimensions: {
                length: 4.6,
                width: 2.5,
                height: 2.0,
                unit: "m",
              },
              weight: { value: 1630, unit: "kg" },
              powerSource: "Solar Arrays with Nickel-Hydrogen Batteries",
              operationalLife: "12+ years",
              orbit: "20,200 km circular, 55° inclination",
              signalTypes: "L1, L2, L5",
            },
            mission: {
              name: "Global Positioning System",
              agency: "U.S. Space Force",
              launchVehicle: "Delta IV/Atlas V",
              objectives: [
                "Provide global positioning services",
                "Support military operations",
                "Enable civilian navigation applications",
                "Deliver precise timing signals worldwide",
                "Support search and rescue operations",
              ],
            },
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
              "NASA's flagship X-ray telescope, Chandra observes extremely hot regions of the universe such as exploded stars, clusters of galaxies, and matter surrounding black holes. With its unparalleled X-ray vision, Chandra has revolutionized our understanding of high-energy cosmic phenomena and the invisible universe.",
            specifications: {
              dimensions: {
                length: 13.8,
                width: 4.2,
                height: 4.2,
                unit: "m",
              },
              weight: { value: 4790, unit: "kg" },
              powerSource: "Solar Arrays",
              operatingWavelength: "0.1-10 keV (X-ray)",
              orbitApogee: "139,000 km",
              orbitPerigee: "16,000 km",
              instruments: "ACIS, HRC, LETG, HETG",
            },
            mission: {
              name: "Chandra X-ray Observatory",
              agency: "NASA",
              launchVehicle: "Space Shuttle Columbia (STS-93)",
              objectives: [
                "Study high-energy astrophysical phenomena",
                "Observe black holes and quasars",
                "Examine galaxy clusters and dark matter",
                "Investigate stellar evolution and supernovae",
                "Map hot gas in the universe",
              ],
            },
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
              "GOES-18 (formerly GOES-T) is part of the GOES-R Series of advanced weather satellites operated by NOAA. It monitors Earth's atmosphere, weather patterns, oceans, and environment, providing critical data for weather forecasting, climate monitoring, and space weather prediction.",
            specifications: {
              dimensions: {
                length: 6.1,
                width: 5.6,
                height: 3.9,
                unit: "m",
              },
              weight: { value: 5192, unit: "kg" },
              powerSource: "Solar Arrays",
              orbitHeight: "35,786 km",
              location: "137° West Longitude",
              instruments: "ABI, GLM, SUVI, EXIS, SEISS, MAG",
            },
            mission: {
              name: "Geostationary Operational Environmental Satellite",
              agency: "NOAA/NASA",
              launchVehicle: "Atlas V 541",
              launchSite: "Cape Canaveral SLC-41",
              objectives: [
                "Provide continuous weather imagery and monitoring",
                "Track severe storms and hurricanes",
                "Detect and monitor wildfires",
                "Monitor space weather and solar activity",
                "Support search and rescue operations",
              ],
            },
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
              "The Interior Exploration using Seismic Investigations, Geodesy and Heat Transport (InSight) mission is a robotic lander designed to study the deep interior of Mars. InSight's measurements help scientists understand the formation and evolution of terrestrial planets by investigating the processes that shaped the rocky planets of the inner solar system.",
            specifications: {
              dimensions: {
                length: 6.0,
                width: 2.7,
                height: 1.0,
                unit: "m",
              },
              weight: { value: 358, unit: "kg" },
              powerSource: "Solar Arrays",
              landingSite: "Elysium Planitia",
              instruments: "SEIS, HP3, RISE, IDC, ICC",
            },
            mission: {
              name: "InSight Mars Lander",
              agency: "NASA",
              launchVehicle: "Atlas V 401",
              launchSite: "Vandenberg SFB",
              objectives: [
                "Study the internal structure of Mars",
                "Measure Martian seismic activity",
                "Measure the planet's heat flow",
                "Track the wobble of Mars' rotation",
                "Understand planetary formation",
              ],
            },
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
              "The Soil Moisture Active Passive (SMAP) satellite measures the amount of water in the top 5 cm of soil everywhere on Earth's surface. This data helps improve our understanding of water, carbon, and energy cycles, enhance weather and climate forecasts, and develop better flood prediction and drought monitoring capabilities.",
            specifications: {
              dimensions: {
                diameter: 6.0, // Reflector antenna
                height: 2.5,
                unit: "m",
              },
              weight: { value: 944, unit: "kg" },
              powerSource: "Solar Arrays",
              orbitHeight: "685 km",
              instruments: "L-band Radiometer, Radar (failed after 3 months)",
            },
            mission: {
              name: "Soil Moisture Active Passive",
              agency: "NASA",
              launchVehicle: "Delta II 7320-10C",
              launchSite: "Vandenberg SFB",
              objectives: [
                "Map global soil moisture",
                "Determine freeze/thaw state of soils",
                "Improve weather and climate forecasts",
                "Enhance flood prediction and drought monitoring",
                "Support agricultural productivity research",
              ],
            },
            image:
              "https://smap.jpl.nasa.gov/system/resources/detail_files/189_SMAP_DuskLaunch_hires.jpg",
          },
        ];

        // Find the instrument by id
        let selectedInstrument = baseInstruments.find(
          (inst) => inst._id === id
        );

        if (!selectedInstrument) {
          // For news-based instruments, we need to fetch them again
          if (id.startsWith("news-")) {
            try {
              const articleId = id.replace("news-", "");
              const response = await axios.get(
                `https://api.spaceflightnewsapi.net/v4/articles/${articleId}`
              );
              const article = response.data;

              // Create an instrument from news article
              selectedInstrument = {
                _id: id,
                name: article.title.split(":")[0] || article.title, // Use first part of title as name
                type: determineType(article.title),
                status: "Active",
                location: determineLocation(article.title),
                discoveryDate: article.published_at,
                description: article.summary,
                image: article.image_url,
                specifications: {
                  // Default specs for news-based instruments
                  powerSource: "Unknown",
                  dimensions: {
                    length: "Unknown",
                    width: "Unknown",
                    height: "Unknown",
                  },
                },
                mission: {
                  name: article.title,
                  agency: article.news_site,
                  objectives: ["Information not available"],
                },
              };
            } catch (error) {
              console.error("Error fetching news article:", error);
              setError("Could not find instrument details.");
            }
          } else {
            setError("Instrument not found");
          }
        }

        // Also fetch related news articles
        try {
          const newsResponse = await axios.get(
            `https://api.spaceflightnewsapi.net/v4/articles?title_contains=${
              selectedInstrument.name.split(" ")[0]
            }&limit=4`
          );
          setRelatedArticles(newsResponse.data.results);
        } catch (error) {
          console.log("Could not fetch related articles");
        }

        if (selectedInstrument) {
          setInstrument(selectedInstrument);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchInstrumentDetails:", err);
        setError("Error loading instrument details");
        setLoading(false);
      }
    };

    fetchInstrumentDetails();
  }, [id]);

  // Helper functions for news-based instruments
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 text-lg">Loading instrument details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="bg-red-600/10 p-6 rounded-lg border border-red-500 max-w-lg text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Instruments
          </button>
        </div>
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="text-center text-gray-500">
          <Server className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl mb-4">No instrument data found</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Instruments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url(${instrument.image})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>

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
            {relatedArticles.length > 0 && (
              <button
                onClick={() => setActiveTab("news")}
                className={`px-5 py-4 transition-colors ${
                  activeTab === "news"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                Related News
              </button>
            )}
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
                              {`${
                                instrument.specifications.dimensions.length
                              } × ${
                                instrument.specifications.dimensions.width
                              } × ${
                                instrument.specifications.dimensions.height
                              } ${
                                instrument.specifications.dimensions.unit || ""
                              }`}
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
            <InstrumentObservations
              instrumentId={id}
              instrumentName={instrument.name}
              instrumentType={instrument.type}
            />
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

          {activeTab === "news" && (
            <div>
              <h2 className="text-2xl font-light mb-8 pb-4 border-b border-gray-700/50">
                Related News
              </h2>

              {relatedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((article, index) => (
                    <motion.a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url || "/api/placeholder/400/300"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/400/300";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-xs text-gray-300">
                            {new Date(
                              article.published_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-gray-500">
                            {article.news_site}
                          </span>
                          <span className="text-blue-400 text-sm flex items-center">
                            Read more
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No related news articles found.</p>
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
