import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <Rocket className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-light text-white">Space Explorer</span>
          </Link>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/discoveries', label: 'Discoveries' },
              { path: '/instruments', label: 'Instruments' },
              { path: '/launches', label: 'Launches' },
              { path: '/updates', label: 'Updates' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-4">
            {[
              { path: '/', label: 'Home' },
              { path: '/discoveries', label: 'Discoveries' },
              { path: '/instruments', label: 'Instruments' },
              { path: '/launches', label: 'Launches' },
              { path: '/updates', label: 'Updates' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
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