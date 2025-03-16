import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  ArrowRight,
  ExternalLink,
  Filter,
  Star,
  Globe,
} from "lucide-react";

const DiscoveriesPage = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Predefined major astronomical discoveries
  const majorDiscoveries = [
    {
      id: "jwst-exoplanet-atmos",
      title: "JWST Detects Carbon Dioxide in Exoplanet Atmosphere",
      date: "2022-08-25",
      category: "Exoplanets",
      image:
        "https://www.nasa.gov/wp-content/uploads/2023/03/stsci-01g8jz43rrtsqqgz25gcsfqcvw.png",
      description:
        "The James Webb Space Telescope has made the first clear detection of carbon dioxide in the atmosphere of a planet outside our solar system. The finding provides important insights into the composition and formation of the exoplanet WASP-39 b.",
      significance:
        "First definitive detection of CO2 in an exoplanet atmosphere, opening new possibilities for understanding the atmospheric chemistry of distant worlds.",
      source: "NASA",
      sourceUrl:
        "https://www.nasa.gov/feature/goddard/2022/nasa-s-webb-detects-carbon-dioxide-in-exoplanet-atmosphere",
    },
    {
      id: "black-hole-image",
      title: "First Image of a Black Hole",
      date: "2019-04-10",
      category: "Black Holes",
      image:
        "https://www.nasa.gov/wp-content/uploads/2023/03/black-hole-image-release.jpg",
      description:
        "The Event Horizon Telescope (EHT) collaboration revealed the first direct visual evidence of the supermassive black hole at the center of galaxy M87 and its shadow. The image shows a bright ring formed as light bends due to the intense gravity around the black hole.",
      significance:
        "First direct visual confirmation of black holes, validating Einstein's theory of general relativity in extreme conditions.",
      source: "Event Horizon Telescope Collaboration",
      sourceUrl: "https://eventhorizontelescope.org/archives/1",
    },
    {
      id: "gravitational-waves",
      title: "First Detection of Gravitational Waves",
      date: "2016-02-11",
      category: "Astrophysics",
      image: "https://www.ligo.caltech.edu/images/ligo20160211a",
      description:
        "LIGO scientists observed ripples in the fabric of spacetime called gravitational waves, arriving at Earth from a cataclysmic event in the distant universe. This confirms a major prediction of Albert Einstein's 1915 general theory of relativity.",
      significance:
        "Opens an unprecedented new window onto the cosmos and provides new ways to study the violent and extreme universe.",
      source: "LIGO Scientific Collaboration",
      sourceUrl: "https://www.ligo.caltech.edu/news/ligo20160211",
    },
    {
      id: "higgs-boson",
      title: "Discovery of the Higgs Boson",
      date: "2012-07-04",
      category: "Particle Physics",
      image: "https://cds.cern.ch/images/CERN-HOMEWEB-PHO-2017-107-2",
      description:
        "CERN's Large Hadron Collider experiments ATLAS and CMS announced the discovery of a particle consistent with the Higgs boson, a fundamental particle associated with the Higgs field that gives mass to other particles.",
      significance:
        "Confirmed the existence of the Higgs field and completed the Standard Model of particle physics, helping explain how fundamental particles acquire mass.",
      source: "CERN",
      sourceUrl: "https://home.cern/science/physics/higgs-boson",
    },
    {
      id: "exoplanet-discovery",
      title: "First Confirmed Exoplanets Discovered",
      date: "1992-01-22",
      category: "Exoplanets",
      image:
        "https://exoplanets.nasa.gov/system/resources/detail_files/138_PIA23694.gif",
      description:
        "Astronomers Alex Wolszczan and Dale Frail announced the discovery of two planets orbiting the pulsar PSR 1257+12, marking the first confirmed discovery of planets outside our solar system.",
      significance:
        "Opened the field of exoplanet research, leading to the discovery of thousands of worlds beyond our solar system.",
      source: "NASA",
      sourceUrl: "https://exoplanets.nasa.gov/",
    },
    {
      id: "dark-energy",
      title: "Discovery of Accelerating Universe Expansion",
      date: "1998-09-30",
      category: "Cosmology",
      image:
        "https://www.nasa.gov/wp-content/uploads/2021/07/universe_expansion_en_no_lines.jpg",
      description:
        "Two independent teams of astronomers observed that distant supernovae are dimmer than expected, indicating that the universe's expansion is accelerating. This led to the concept of dark energy, a mysterious force pushing the universe apart.",
      significance:
        "Fundamentally changed our understanding of the universe's fate and revealed that about 68% of the universe consists of dark energy.",
      source: "Nobel Prize",
      sourceUrl: "https://www.nobelprize.org/prizes/physics/2011/summary/",
    },
    {
      id: "cosmic-microwave-background",
      title: "Detection of Cosmic Microwave Background",
      date: "1964-05-20",
      category: "Cosmology",
      image:
        "https://www.nasa.gov/wp-content/uploads/2015/03/dmr_cosmic_background_radiation.jpg",
      description:
        "Arno Penzias and Robert Wilson discovered the cosmic microwave background (CMB) radiation, the thermal radiation left over from the Big Bang. The discovery provided substantial evidence for the Big Bang theory of cosmic evolution.",
      significance:
        "One of the strongest pieces of evidence for the Big Bang theory, confirming that the universe began in an extremely hot and dense state.",
      source: "NASA",
      sourceUrl:
        "https://science.nasa.gov/astrophysics/focus-areas/what-powered-the-big-bang/",
    },
    {
      id: "hubble-constant",
      title: "Hubble's Law - The Expanding Universe",
      date: "1929-01-17",
      category: "Cosmology",
      image:
        "https://cdn.spacetelescope.org/archives/images/publicationjpg/heic1819a.jpg",
      description:
        "Edwin Hubble discovered that galaxies are moving away from us with a velocity proportional to their distance. This observation led to the understanding that the universe is expanding, a cornerstone of the Big Bang theory.",
      significance:
        "Revolutionized our understanding of the universe, proving it is not static but expanding, and laid the foundation for modern cosmology.",
      source: "Space Telescope Science Institute",
      sourceUrl:
        "https://hubblesite.org/contents/articles/edwin-hubble-and-the-expanding-universe",
    },
    {
      id: "neutron-star-collision",
      title: "First Observation of Neutron Star Merger",
      date: "2017-08-17",
      category: "Astrophysics",
      image:
        "https://www.nasa.gov/wp-content/uploads/2017/10/neutron-merger-detection.jpg",
      description:
        "Scientists detected gravitational waves from the merger of two neutron stars for the first time, along with gamma rays, visible light, and other electromagnetic radiation. This event marked the birth of multi-messenger astronomy.",
      significance:
        "Confirmed that neutron star collisions produce heavy elements like gold and platinum, and provided a new way to measure the expansion rate of the universe.",
      source: "LIGO/Virgo/NASA",
      sourceUrl:
        "https://www.nasa.gov/press-release/nasa-missions-catch-first-light-from-a-gravitational-wave-event",
    },
    {
      id: "habitable-exoplanets",
      title: "Discovery of Potentially Habitable Exoplanets",
      date: "2020-04-15",
      category: "Exoplanets",
      image:
        "https://exoplanets.nasa.gov/system/resources/detail_files/2241_TOI700d-with-star-FINAL-3.jpg",
      description:
        "NASA's TESS mission has discovered multiple Earth-sized exoplanets in the habitable zones of their stars, where conditions could allow liquid water to exist. These include TOI-700 d, which orbits a small, cool M dwarf star.",
      significance:
        "Expands our understanding of potentially habitable worlds and provides targets for future atmospheric characterization by telescopes like JWST.",
      source: "NASA",
      sourceUrl:
        "https://exoplanets.nasa.gov/news/1612/nasa-planet-hunter-finds-its-1st-earth-size-habitable-zone-world/",
    },
    {
      id: "gw-neutronstar-collision",
      title: "First Gravitational Wave Signal from Binary Neutron Star Merger",
      date: "2017-08-17",
      category: "Gravitational Waves",
      image: "https://www.nasa.gov/wp-content/uploads/2017/10/ed16-315-057.jpg",
      description:
        "LIGO and Virgo detected gravitational waves from two neutron stars spiraling inward and colliding. Unlike previous detections from black holes, this event was also observed across the electromagnetic spectrum, from gamma rays to radio waves.",
      significance:
        "First multi-messenger observation with gravitational waves, confirming neutron star mergers as the source of short gamma-ray bursts and the creation of heavy elements.",
      source: "LIGO/NASA",
      sourceUrl: "https://www.ligo.caltech.edu/page/press-release-gw170817",
    },
    {
      id: "water-on-mars",
      title: "Evidence of Flowing Water on Mars",
      date: "2015-09-28",
      category: "Planetary Science",
      image:
        "https://mars.nasa.gov/system/feature_items/images/3500_MRO-RSL-Main-web.jpg",
      description:
        "NASA's Mars Reconnaissance Orbiter detected signatures of hydrated minerals on slopes where mysterious streaks called recurring slope lineae are observed. This provided strong evidence for flowing liquid water on present-day Mars.",
      significance:
        "Suggests that Mars may still have environments where microbial life could potentially exist today.",
      source: "NASA",
      sourceUrl:
        "https://www.nasa.gov/press-release/nasa-confirms-evidence-that-liquid-water-flows-on-today-s-mars",
    },
    {
      id: "fast-radio-bursts",
      title: "Fast Radio Bursts from Beyond Our Galaxy",
      date: "2007-07-24",
      category: "Radio Astronomy",
      image: "https://www.nrao.edu/images/fast-radio-bursts.jpg",
      description:
        "Astronomers discovered Fast Radio Bursts (FRBs), intense bursts of radio emission that last milliseconds and originate from distant galaxies. Some FRBs have been found to repeat, challenging explanations involving cataclysmic events.",
      significance:
        "May provide new insights into extreme astrophysical environments and could potentially be used as cosmic probes to study the intergalactic medium.",
      source: "National Radio Astronomy Observatory",
      sourceUrl:
        "https://public.nrao.edu/news/2017-02-23-astronomers-trace-cosmic-neutrinos-to-enormous-black-holes/",
    },
    {
      id: "voyager-interstellar",
      title: "Voyager 1 Enters Interstellar Space",
      date: "2012-08-25",
      category: "Space Exploration",
      image: "https://www.nasa.gov/wp-content/uploads/2018/07/vger1.gif",
      description:
        "NASA's Voyager 1 spacecraft became the first human-made object to enter interstellar space, crossing the boundary of our solar system's influence (the heliopause) and entering the region between stars.",
      significance:
        "First direct measurements of the interstellar medium and demonstration of humanity's ability to send objects beyond our solar system.",
      source: "NASA",
      sourceUrl: "https://voyager.jpl.nasa.gov/mission/interstellar-mission/",
    },
    {
      id: "sagittarius-a",
      title: "Confirmation of Supermassive Black Hole at Milky Way's Center",
      date: "2008-12-10",
      category: "Black Holes",
      image: "https://cdn.eso.org/images/screen/eso0846a.jpg",
      description:
        "Astronomers confirmed the existence of a supermassive black hole at the center of our Milky Way galaxy, known as Sagittarius A*, by tracking the orbits of stars around an invisible massive object over 16 years.",
      significance:
        "Provided direct evidence that supermassive black holes exist at the centers of galaxies and offered a laboratory to test Einstein's theory of general relativity.",
      source: "European Southern Observatory",
      sourceUrl: "https://www.eso.org/public/news/eso0846/",
    },
    {
      id: "dark-matter-evidence",
      title: "Evidence for Dark Matter",
      date: "1970-02-10",
      category: "Astrophysics",
      image: "https://www.nasa.gov/wp-content/uploads/2019/10/darkmatter.jpeg",
      description:
        "Vera Rubin and Kent Ford observed that stars at the edges of galaxies move much faster than expected based on visible matter alone, providing strong evidence for the existence of invisible 'dark matter' that dominates the mass of galaxies.",
      significance:
        "Revolutionized our understanding of the universe by revealing that about 85% of matter in the cosmos is invisible and of unknown composition.",
      source: "NASA",
      sourceUrl:
        "https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-dark-matter-58.html",
    },
    {
      id: "first-exoplanet-star",
      title: "First Exoplanet Discovered Around Sun-like Star",
      date: "1995-10-06",
      category: "Exoplanets",
      image:
        "https://www.nasa.gov/wp-content/uploads/2015/03/16278559311_1c0b5ca9cf_o.jpg",
      description:
        "Astronomers Michel Mayor and Didier Queloz announced the discovery of 51 Pegasi b, a Jupiter-sized planet orbiting a Sun-like star. This was the first confirmed discovery of an exoplanet orbiting a main-sequence star.",
      significance:
        "Demonstrated that our solar system is not unique and paved the way for the discovery of thousands of exoplanets, revolutionizing our understanding of planetary systems.",
      source: "Nobel Prize",
      sourceUrl:
        "https://www.nobelprize.org/prizes/physics/2019/press-release/",
    },
    {
      id: "pulsars-discovery",
      title: "Discovery of Pulsars",
      date: "1967-11-28",
      category: "Neutron Stars",
      image: "https://www.nasa.gov/wp-content/uploads/2013/01/crab_nebula.jpg",
      description:
        "Jocelyn Bell Burnell discovered pulsars, rapidly rotating neutron stars that emit regular pulses of radio waves. Initially called 'LGM' (Little Green Men) as a joke about potential alien signals, these objects provided confirmation of neutron stars predicted by theory.",
      significance:
        "Confirmed the existence of neutron stars, the ultra-dense remnants of supernova explosions, providing a natural laboratory for extreme physics.",
      source: "NASA",
      sourceUrl:
        "https://www.nasa.gov/feature/goddard/2018/the-1967-stellar-radio-pulse-discovery",
    },
    {
      id: "jupiter-shoemaker-levy",
      title: "Comet Shoemaker-Levy 9 Impacts Jupiter",
      date: "1994-07-16",
      category: "Planetary Science",
      image: "https://www.nasa.gov/wp-content/uploads/2016/07/pia00139.jpg",
      description:
        "Astronomers observed a comet that had broken into fragments collide with Jupiter, marking the first direct observation of an extraterrestrial collision of Solar System objects. The impacts left dark spots on Jupiter that remained visible for many months.",
      significance:
        "Provided unprecedented insights into the physics of planetary impacts and raised awareness about the potential threat of Earth impacts.",
      source: "NASA",
      sourceUrl:
        "https://www.jpl.nasa.gov/news/25-years-ago-comet-impacts-jupiter-and-helps-assess-impact-threat-to-earth",
    },
    {
      id: "extrasolar-planet-system",
      title: "First Multi-Planet System Beyond Our Solar System",
      date: "1999-04-15",
      category: "Exoplanets",
      image:
        "https://www.nasa.gov/wp-content/uploads/2019/06/upsilon-andromedae.jpg",
      description:
        "Astronomers discovered the first multi-planet system around a main-sequence star other than our Sun. Three giant planets were found orbiting the star Upsilon Andromedae, demonstrating that planetary systems are common in the universe.",
      significance:
        "Showed that complex planetary systems exist beyond our solar system, suggesting that planet formation is a common process around stars.",
      source: "NASA",
      sourceUrl:
        "https://exoplanets.nasa.gov/resources/168/the-upsilon-andromedae-system/",
    },
  ];

  useEffect(() => {
    // We're using only our preset major astronomical discoveries
    // Sort by date, newest first
    const sortedDiscoveries = [...majorDiscoveries].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setDiscoveries(sortedDiscoveries);
    setLoading(false);
  }, []);

  const filterDiscoveries = (category) => {
    setSelectedCategory(category);
  };

  const getFilteredDiscoveries = () => {
    return discoveries.filter((discovery) => {
      const matchesSearch =
        discovery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discovery.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || discovery.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getUniqueCategories = () => {
    if (!discoveries || discoveries.length === 0) {
      return ["all"];
    }
    const categories = new Set(
      discoveries.map((discovery) => discovery.category)
    );
    return ["all", ...Array.from(categories).sort()];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 text-lg">
            Loading astronomical discoveries...
          </p>
        </div>
      </div>
    );
  }

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
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-400">
          Displaying {filteredDiscoveries.length} discoveries
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Discoveries Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDiscoveries.map((discovery, index) => (
            <motion.article
              key={discovery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={discovery.image}
                  alt={discovery.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
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

        {filteredDiscoveries.length === 0 && (
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
