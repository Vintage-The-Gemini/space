import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Search,
  Calendar,
  ArrowRight,
  ExternalLink,
  Filter,
  Star,
  Globe,
  AlertTriangle,
  Loader,
} from "lucide-react";

const DiscoveriesPage = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset state when filters change
    setDiscoveries([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    // Use a small timeout to prevent rapid consecutive API calls when switching categories
    const timer = setTimeout(() => {
      fetchDiscoveries();
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const fetchDiscoveries = async () => {
    try {
      setLoading(true);

      // Define preset placeholder images for different categories to avoid loading issues
      const placeholderImages = {
        Exoplanets:
          "https://www.nasa.gov/wp-content/uploads/2019/11/trappist-1e-1.jpg",
        "Black Holes":
          "https://www.nasa.gov/wp-content/uploads/2019/05/stsci-h-p1912a-f-1000x1000.jpg",
        Galaxies:
          "https://esahubble.org/media/archives/images/large/heic0602a.jpg",
        "Stellar Physics":
          "https://www.nasa.gov/wp-content/uploads/2020/01/trumpler14-1.jpg",
        "Planetary Science":
          "https://www.nasa.gov/wp-content/uploads/2021/06/pia24333-1.jpeg",
        Cosmology:
          "https://esahubble.org/media/archives/images/large/heic0916a.jpg",
        "Gravitational Waves":
          "https://www.nasa.gov/wp-content/uploads/2018/06/neutron-star-merger-artists-conception.jpg",
        Astrophysics:
          "https://www.nasa.gov/wp-content/uploads/2019/04/crab_nebula-1.jpg",
        "High Energy Astrophysics":
          "https://www.nasa.gov/wp-content/uploads/2018/11/cygx3-1.jpg",
        Instrumentation:
          "https://www.nasa.gov/wp-content/uploads/2023/09/webb.jpg",
      };

      // Use a default placeholder for any missing categories
      const defaultPlaceholder =
        "https://www.nasa.gov/wp-content/uploads/2019/07/hubble-gallery.jpg";

      // Parallel API calls to different sources - but limit number of sources based on filter
      // This reduces image loading issues when switching categories
      let nasaResponse, arxivResponse, spacenewsResponse;

      // Don't make all API calls at once, prioritize based on category
      try {
        // NASA API for space discoveries
        nasaResponse = await axios.get("https://images-api.nasa.gov/search", {
          params: {
            q:
              selectedCategory === "all"
                ? "discovery astronomy"
                : selectedCategory,
            media_type: "image",
            year_start: "2020", // Recent discoveries
            page_size: 12, // Reduced from 20 to limit images loading at once
          },
          timeout: 5000, // Add timeout to prevent long loading
        });
      } catch (error) {
        console.log("NASA API error:", error);
        nasaResponse = { data: { collection: { items: [] } } };
      }

      try {
        // arXiv API for scientific papers
        arxivResponse = await axios.get("https://export.arxiv.org/api/query", {
          params: {
            search_query:
              selectedCategory === "all"
                ? "cat:astro-ph"
                : `cat:astro-ph AND ${selectedCategory.toLowerCase()}`,
            start: 0,
            max_results: 8, // Reduced from 20
            sortBy: "submittedDate",
            sortOrder: "descending",
          },
          timeout: 5000,
          // arXiv API returns XML
          transformResponse: (data) => {
            // Simple XML parsing - in production use proper XML parser
            const entries = data.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
            return entries.map((entry) => {
              const title =
                entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
              const summary =
                entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || "";
              const published =
                entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] || "";
              const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] || "";
              // Extract categories
              const categoryMatches =
                entry.match(/<category term="([\s\S]*?)"/g) || [];
              const categories = categoryMatches.map(
                (cat) => cat.match(/<category term="([\s\S]*?)"/)?.[1] || ""
              );

              const category = determineCategory(categories);

              return {
                id: id.replace("http://arxiv.org/abs/", "arxiv-"),
                title: title.replace(/\n/g, " ").trim(),
                description: summary.replace(/\n/g, " ").trim(),
                date: published,
                category: category,
                source: "arXiv",
                sourceUrl: id,
                type: "research",
                significance: extractSignificance(summary),
                // Use specific placeholder for category
                image: placeholderImages[category] || defaultPlaceholder,
              };
            });
          },
        });
      } catch (error) {
        console.log("arXiv API error:", error);
        arxivResponse = { data: [] };
      }

      try {
        // Space News API for news articles
        spacenewsResponse = await axios.get(
          "https://api.spaceflightnewsapi.net/v4/articles",
          {
            params: {
              limit: 8, // Reduced from 20
              title_contains:
                selectedCategory === "all" ? "discovery" : selectedCategory,
              _sort: "publishedAt:DESC",
            },
            timeout: 5000,
          }
        );
      } catch (error) {
        console.log("SpaceNews API error:", error);
        spacenewsResponse = { data: { results: [] } };
      }

      // Use the placeholder images defined earlier
      // and the default placeholder for any missing categories

      // Process NASA data with enhanced image handling
      const nasaItems = nasaResponse.data.collection.items.map((item) => {
        const data = item.data[0];
        const category = determineCategory([data.keywords, data.title]);

        // Prefer placeholders over potentially slow-loading NASA images
        const imageUrl = placeholderImages[category] || defaultPlaceholder;

        return {
          id: `nasa-${data.nasa_id}`,
          title: data.title,
          description: data.description || "No description available",
          date: data.date_created,
          category: category,
          image: imageUrl,
          source: "NASA",
          sourceUrl: `https://images.nasa.gov/details-${data.nasa_id}`,
          type: "observation",
          significance: extractSignificance(data.description),
        };
      });

      // Process SpaceNews data
      const newsItems = spacenewsResponse.data.results.map((article) => {
        const category = determineCategory([article.title, article.summary]);
        return {
          id: `news-${article.id}`,
          title: article.title,
          description: article.summary,
          date: article.publishedAt,
          category: category,
          // Use preset placeholders instead of potentially slow news images
          image: placeholderImages[category] || defaultPlaceholder,
          source: article.newsSite,
          sourceUrl: article.url,
          type: "news",
          significance: extractSignificance(article.summary),
        };
      });

      // Combine all sources - but limit the number of items to prevent overloading
      // This helps reduce image loading issues
      const combinedDiscoveries = [
        ...nasaItems.slice(0, 8),
        ...arxivResponse.data.slice(0, 8),
        ...newsItems.slice(0, 8),
      ].filter((item) => item.title && item.description); // Remove any incomplete items

      // Sort by date (newest first)
      const sortedDiscoveries = combinedDiscoveries.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setDiscoveries(sortedDiscoveries);
      setHasMore(sortedDiscoveries.length >= 10);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching discoveries:", error);
      setError("Failed to fetch discovery data. Please try again later.");
      setLoading(false);
    }
  };

  // Helper function to determine the category from various inputs
  const determineCategory = (inputs) => {
    const categoryMap = {
      exoplanet: "Exoplanets",
      planet: "Planetary Science",
      "black hole": "Black Holes",
      "gravitational wave": "Gravitational Waves",
      nova: "Stellar Physics",
      supernova: "Stellar Physics",
      galaxy: "Galaxies",
      star: "Stellar Physics",
      asteroid: "Planetary Science",
      comet: "Planetary Science",
      mars: "Planetary Science",
      jupiter: "Planetary Science",
      moon: "Planetary Science",
      cosmology: "Cosmology",
      "astro-ph.CO": "Cosmology",
      "astro-ph.EP": "Exoplanets",
      "astro-ph.GA": "Galaxies",
      "astro-ph.HE": "High Energy Astrophysics",
      "astro-ph.IM": "Instrumentation",
      "astro-ph.SR": "Stellar Physics",
    };

    // Flatten and join all inputs to search for keywords
    const text = Array.isArray(inputs)
      ? inputs.flat().join(" ").toLowerCase()
      : inputs.toLowerCase();

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (text.includes(keyword)) {
        return category;
      }
    }

    return "Astrophysics"; // Default category
  };

  // Extract potential significance from text
  const extractSignificance = (text) => {
    if (!text) return "Recent astronomical discovery";

    // Look for sentences containing significance indicators
    const significanceKeywords = [
      "first time",
      "breakthrough",
      "discovery",
      "significant",
      "important",
      "reveals",
      "new insight",
      "unprecedented",
      "revolution",
      "milestone",
      "unexpected",
      "surprising",
      "remarkable",
    ];

    // Extract sentences containing these keywords
    const sentences = text.split(/\.\s+/);
    const significantSentences = sentences.filter((sentence) => {
      return significanceKeywords.some((keyword) =>
        sentence.toLowerCase().includes(keyword)
      );
    });

    if (significantSentences.length > 0) {
      // Use the first significant sentence found
      return significantSentences[0].trim() + ".";
    }

    // Fallback: take the first sentence and add a period if needed
    const firstSentence =
      sentences[0]?.trim() || "Recent astronomical discovery";
    return firstSentence.endsWith(".") ? firstSentence : firstSentence + ".";
  };

  const filterDiscoveries = (category) => {
    setSelectedCategory(category);
  };

  const getFilteredDiscoveries = () => {
    return discoveries.filter((discovery) => {
      const matchesSearch =
        discovery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discovery.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
    fetchDiscoveries();
  };

  // Get unique categories from actual data
  const getUniqueCategories = () => {
    if (!discoveries || discoveries.length === 0) {
      // Default categories if no data yet
      return [
        "all",
        "Exoplanets",
        "Black Holes",
        "Galaxies",
        "Stellar Physics",
        "Planetary Science",
        "Cosmology",
        "Gravitational Waves",
        "Astrophysics",
      ];
    }

    const categories = new Set(
      discoveries.map((discovery) => discovery.category)
    );

    return ["all", ...Array.from(categories).sort()];
  };

  const filteredDiscoveries = getFilteredDiscoveries();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url("https://science.nasa.gov/wp-content/uploads/2023/09/30dor_nircam_2023jpg.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-light mb-8"
          >
            Astronomical Discoveries
          </motion.h1>

          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discoveries..."
              className="w-full bg-black/50 backdrop-blur-md border border-gray-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-blue-400 mr-2" />
          <h2 className="text-xl font-light">Filter by Category</h2>
        </div>
        <div className="flex flex-wrap justify-start gap-4">
          {getUniqueCategories().map((category) => (
            <button
              key={category}
              onClick={() => filterDiscoveries(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            Displaying {filteredDiscoveries.length} discoveries
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDiscoveries()}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 bg-blue-900/20 px-3 py-1 rounded-lg"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Discoveries Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && discoveries.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="space-y-4 text-center">
              <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <p className="text-blue-400">Fetching latest discoveries...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDiscoveries.map((discovery, index) => (
                <motion.article
                  key={discovery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    {/* Fixed aspect ratio container with background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />

                    {/* Image with loading state - preserve position regardless of image loading */}
                    <div className="absolute inset-0 bg-gray-800/80">
                      <img
                        src={discovery.image}
                        alt={discovery.title}
                        className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/400/300";
                        }}
                        onLoad={(e) => {
                          e.target.classList.remove("opacity-0");
                          e.target.classList.add("opacity-100");
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay content positioning unchanged */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {discovery.category}
                        </span>
                        <span className="text-sm text-gray-300 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(discovery.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 line-clamp-2">
                      {discovery.title}
                    </h2>
                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {discovery.description}
                    </p>

                    <div className="bg-black/30 p-4 rounded-lg mb-6">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Scientific Significance
                      </h4>
                      <p className="text-sm text-gray-300">
                        {discovery.significance}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm text-gray-400 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        {discovery.source}
                      </span>
                      <a
                        href={discovery.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        Read More
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && filteredDiscoveries.length > 0 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Discoveries
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}

            {filteredDiscoveries.length === 0 && !loading && (
              <div className="bg-gray-900/30 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-xl">
                  No discoveries found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-2xl backdrop-blur-sm border border-gray-800/50"
        >
          <h2 className="text-2xl font-light mb-4 text-center">Stay Updated</h2>
          <p className="text-gray-300 mb-6 text-center">
            Get notified about new astronomical discoveries and breakthroughs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-md px-4 py-2 rounded-lg bg-black/50 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300 flex items-center justify-center">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscoveriesPage;
