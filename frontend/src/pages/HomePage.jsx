import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import {
  Calendar,
  Rocket,
  Telescope,
  Star,
  Satellite,
  Radio,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// Regular imports since we're not using lazy loading anymore
import NewsSection from "../components/NewsSection";
import MarsPhotos from "../components/MarsPhotos";
import Newsletter from "../components/Newsletter";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);

const HomePage = () => {
  const [data, setData] = useState({
    nasaAPOD: null,
    spaceNews: [],
    marsPhotos: [],
    neoData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/021/968/643/small_2x/space-nebula-night-gallaxy-illustration-cosmos-universe-astronomy-generative-ai-photo.jpg",
      title: "Explore the Cosmos",
      subtitle: "Your gateway to real-time space exploration",
      alt: "Cosmic nebula with stars",
    },
    {
      image: "https://storage.googleapis.com/pod_public/1300/139326.jpg",
      title: "Discover New Worlds",
      subtitle: "Journey through the latest astronomical discoveries",
      alt: "Exoplanet visualization",
    },
    {
      image:
        "https://images.saatchiart.com/saatchi/2181309/art/10250429/9313167-OAIBBJOT-32.jpg",
      title: "Mission Control",
      subtitle: "Track ongoing space missions in real-time",
      alt: "Space mission control center",
    },
  ];
  useEffect(() => {
    const abortController = new AbortController();

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apodRes, newsRes, marsRes, neoRes] = await Promise.all([
          axios.get("https://space-mgph.onrender.com/api/nasa/apod", {
            signal: abortController.signal,
          }),
          axios.get("https://api.spaceflightnewsapi.net/v4/articles?limit=6", {
            signal: abortController.signal,
          }),
          axios.get("https://space-mgph.onrender.com/api/nasa/mars-photos", {
            signal: abortController.signal,
          }),
          axios.get("https://space-mgph.onrender.com/api/nasa/neo", {
            signal: abortController.signal,
          }),
        ]);

        setData({
          nasaAPOD: apodRes.data,
          spaceNews: newsRes.data.results,
          marsPhotos: marsRes.data.latest_photos?.slice(0, 4),
          neoData: neoRes.data,
        });
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching data:", error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      abortController.abort();
      clearInterval(slideInterval);
    };
  }, []);

  const formatNEOData = (neoData) => {
    if (!neoData?.near_earth_objects) return null;
    const today = Object.values(neoData.near_earth_objects)[0];
    return {
      count: today.length,
      closest: today.reduce((prev, current) => {
        const prevDist = parseFloat(
          prev.close_approach_data[0].miss_distance.kilometers
        );
        const currDist = parseFloat(
          current.close_approach_data[0].miss_distance.kilometers
        );
        return prevDist < currDist ? prev : current;
      }),
      hazardous: today.filter((neo) => neo.is_potentially_hazardous_asteroid)
        .length,
    };
  };

  const neoInfo = formatNEOData(data.neoData);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-black flex justify-center items-center"
        role="status"
      >
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="text-blue-500">Loading space data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        role="alert"
      >
        <div className="text-white text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-screen" aria-label="hero">
          <AnimatePresence mode="wait">
            {heroSlides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeSlide ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    opacity: index === activeSlide ? 0.4 : 0,
                  }}
                  role="img"
                  aria-label={slide.alt}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

          <div className="relative h-full flex items-center justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4 max-w-4xl mx-auto"
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="text-2xl md:text-3xl text-gray-200 mb-12">
                {heroSlides[activeSlide].subtitle}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/discoveries"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  aria-label="Start Exploring Space Discoveries"
                >
                  Start Exploring
                </Link>
                <Link
                  to="/instruments"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  aria-label="View Space Instruments"
                >
                  View Instruments
                </Link>
              </div>
            </motion.div>
          </div>

          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3"
            role="navigation"
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide ? "bg-blue-500 w-8" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </section>

        {/* NASA APOD Section */}
        {data.nasaAPOD && (
          <section
            className="max-w-7xl mx-auto px-4 py-16"
            aria-label="Astronomy Picture of the Day"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-96">
                  <img
                    src={data.nasaAPOD.url}
                    alt={data.nasaAPOD.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <Star
                      className="h-6 w-6 text-yellow-400 mr-2"
                      aria-hidden="true"
                    />
                    <h2 className="text-2xl font-bold">
                      Astronomy Picture of the Day
                    </h2>
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    {data.nasaAPOD.title}
                  </h3>
                  <p className="text-gray-300">{data.nasaAPOD.explanation}</p>
                  <time className="mt-4 block text-sm text-gray-400">
                    {new Date(data.nasaAPOD.date).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Feature Highlights */}
        <section className="max-w-7xl mx-auto px-4 py-16" aria-label="Features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Telescope,
                title: "Space Instruments",
                description:
                  "Track real-time data from telescopes, satellites, and rovers exploring our universe.",
                link: "/instruments",
                color: "text-blue-400",
              },
              {
                icon: Calendar,
                title: "Latest Discoveries",
                description:
                  "Stay informed about the newest findings and breakthroughs in space exploration.",
                link: "/discoveries",
                color: "text-purple-400",
              },
              {
                icon: Rocket,
                title: "Mission Updates",
                description:
                  "Get the latest updates on ongoing space missions and future launches.",
                link: "/updates",
                color: "text-green-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Link to={feature.link} className="group block">
                  <div className="bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
                    <feature.icon
                      className={`w-12 h-12 ${feature.color} mb-6`}
                      aria-hidden="true"
                    />
                    <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Lazy-loaded sections */}
        <Suspense fallback={<LoadingSpinner />}>
          {data.marsPhotos.length > 0 && (
            <MarsPhotos photos={data.marsPhotos} />
          )}

          {neoInfo && (
            <section
              className="max-w-7xl mx-auto px-4 py-16"
              aria-label="Near Earth Objects"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <Satellite
                    className="h-8 w-8 text-yellow-400 mr-3"
                    aria-hidden="true"
                  />
                  <h2 className="text-2xl font-bold">
                    Near Earth Objects Today
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {neoInfo.count}
                    </p>
                    <p className="text-gray-300">Objects tracked today</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <p className="text-3xl font-bold text-yellow-400 mb-2">
                      {parseFloat(
                        neoInfo.closest.close_approach_data[0].miss_distance
                          .kilometers
                      ).toLocaleString()}
                      km
                    </p>
                    <p className="text-gray-300">Closest approach</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <p className="text-3xl font-bold text-red-400 mb-2">
                      {neoInfo.hazardous}
                    </p>
                    <p className="text-gray-300">Potentially hazardous</p>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          <NewsSection news={data.spaceNews} />
          <Newsletter />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
