import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserAsync } from "../store/AuthSlice";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUserAsync());
    navigate("/login");
    setShowDropdown(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // You can adjust this value to change when the navbar transforms
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "?";
    return user.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-20 md:h-16 relative">
      <div className="w-full flex justify-center">
        <nav
          className={`px-4 md:px-6 py-4 flex justify-between items-center z-50 transition-all duration-300 ease-in-out ${
            scrolled 
              ? "fixed w-4/5 top-5 rounded-xl bg-purple-600/40 backdrop-blur-md border border-white/20 shadow-lg from-purple-600/40 to-indigo-700/40 bg-gradient-to-r" 
              : "sticky top-0 w-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg text-white"
          }`}
          style={{
            transitionProperty: "width, background-color, backdrop-filter, border-radius, background-opacity",
          }}
        >
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center text-white">
            <span className="text-2xl md:text-3xl mr-2">🌍</span>
            <span className="hidden sm:inline">VisitTogether</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-purple-200 transition duration-150 font-medium text-white">
              Home
            </Link>
            {user && (
              <Link
                to="/create-visit"
                className="hover:text-purple-200 transition duration-150 font-medium text-white"
              >
                Create Visit
              </Link>
            )}
            <Link to="/explore" className="hover:text-purple-200 transition duration-150 font-medium text-white">
              Explore
            </Link>
            <Link to="/about" className="hover:text-purple-200 transition duration-150 font-medium text-white">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-purple-200 transition duration-150 font-medium text-white">
              Contact Us
            </Link>
          </div>

          {/* User Authentication (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="bg-white text-purple-700 pl-3 pr-4 py-2 rounded-full font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-2">
                    {getUserInitials()}
                  </div>
                  <span className="mr-2 truncate max-w-xs">{user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden z-50 border border-purple-100 transition-all duration-200">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm opacity-80 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 hover:bg-purple-50 transition duration-150 border-b border-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/my-visits"
                      className="flex items-center px-4 py-3 hover:bg-purple-50 transition duration-150 border-b border-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      My Visits
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 hover:bg-red-50 transition duration-150 text-red-600"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-purple-700 px-4 py-2 rounded-full hover:bg-purple-50 transition duration-150 font-medium shadow-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-white px-4 py-2 rounded-full hover:bg-purple-500 transition duration-150 font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className={`absolute ${scrolled ? 'top-full' : 'top-16'} left-0 right-0 md:hidden z-40 ${
              scrolled 
                ? 'w-full mx-auto bg-purple-600/80 backdrop-blur-md rounded-b-xl' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-700 w-full'
            } shadow-lg p-4`}>
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="hover:bg-purple-500 py-2 px-3 rounded transition duration-150 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                {user && (
                  <Link
                    to="/create-visit"
                    className="hover:bg-purple-500 py-2 px-3 rounded transition duration-150 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Visit
                  </Link>
                )}
                <Link
                  to="/explore"
                  className="hover:bg-purple-500 py-2 px-3 rounded transition duration-150 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  to="/about"
                  className="hover:bg-purple-500 py-2 px-3 rounded transition duration-150 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="hover:bg-purple-500 py-2 px-3 rounded transition duration-150 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
                <div className="border-t border-purple-400 my-2 pt-2">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 px-3 py-3 bg-purple-500 bg-opacity-30 rounded-lg mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                          {getUserInitials()}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-purple-200 text-sm truncate">{user.email}</div>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="hover:bg-purple-500 py-2 px-3 rounded flex items-center transition duration-150 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-2 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/my-visits"
                        className="hover:bg-purple-500 py-2 px-3 rounded flex items-center transition duration-150 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-2 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        My Visits
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full text-left hover:bg-purple-500 py-2 px-3 rounded flex items-center text-red-200 transition duration-150"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login"
                        className="bg-white text-purple-700 py-2 px-3 rounded text-center font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="border border-white py-2 px-3 rounded text-center text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;