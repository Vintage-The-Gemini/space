import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Rocket } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "bg-black/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <Rocket className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-light text-white">
              Space Explorer
            </span>
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "Home" },
              { path: "/discoveries", label: "Discoveries" },
              { path: "/instruments", label: "Instruments" },
              { path: "/launches", label: "Launches" },
              { path: "/updates", label: "Updates" },
              { path: "/mission/telemetry", label: "Telemetry" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm uppercase tracking-wider transition-colors duration-300 ${
                  location.pathname === path
                    ? "text-blue-400 font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4">
            {[
              { path: "/", label: "Home" },
              { path: "/discoveries", label: "Discoveries" },
              { path: "/instruments", label: "Instruments" },
              { path: "/launches", label: "Launches" },
              { path: "/updates", label: "Updates" },
              { path: "/mission/telemetry", label: "Telemetry" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`py-2 px-2 rounded transition-colors duration-300 ${
                  location.pathname === path
                    ? "text-blue-400 bg-blue-900/20"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
