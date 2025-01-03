import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold">Space Explorer</h1>

      {/* Hamburger Menu for Mobile */}
      <button 
        className="md:hidden block text-white focus:outline-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menu Items */}
      <div 
        className={`md:flex md:space-x-4 md:items-center ${isOpen ? "block" : "hidden"} w-full md:w-auto`}
      >
        <Link 
          to="/" 
          className="block md:inline-block hover:text-blue-400 p-2 md:p-0"
        >
          Home
        </Link>
        <Link 
          to="/discoveries" 
          className="block md:inline-block hover:text-blue-400 p-2 md:p-0"
        >
          Discoveries
        </Link>
        <Link 
          to="/updates" 
          className="block md:inline-block hover:text-blue-400 p-2 md:p-0"
        >
          Updates
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
