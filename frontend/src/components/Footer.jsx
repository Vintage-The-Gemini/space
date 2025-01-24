import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black/50 mt-16 py-12 backdrop-blur-sm border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/instruments" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Instruments
                </Link>
              </li>
              <li>
                <Link to="/discoveries" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Discoveries
                </Link>
              </li>
              <li>
                <Link to="/updates" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Updates
                </Link>
              </li>
              <li>
                <Link to="/launches" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Launches
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Subscribe to our newsletter</h4>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Space Explorer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm">
                Accessibility
              </Link>
              <a 
                href="mailto:contact@spaceexplorer.com" 
                className="text-gray-400 hover:text-white text-sm"
              >
                contact@spaceexplorer.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;