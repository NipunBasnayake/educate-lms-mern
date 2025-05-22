import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(false);
    navigate('/#home');
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const firstName = useMemo(() => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  }, [user]);

  const navLinks = useMemo(
    () => [
      { to: "/#home", label: "Home", isHashLink: true },
      { to: "/courses", label: "Courses", isHashLink: false },
      { to: "/#about", label: "About", isHashLink: true },
      { to: "/#team", label: "Team", isHashLink: true },
      { to: "/#blog", label: "Blog", isHashLink: true },
      { to: "/#contact", label: "Contact", isHashLink: true },
    ],
    []
  );

  const linkStyles = "text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200";

  return (
    <>
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <HashLink
              smooth
              to="/#home"
              className="text-2xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors duration-200"
            >
              EDUCATE
            </HashLink>

            {/* Search Bar - Centered in Desktop */}
            <div className="hidden lg:flex flex-1 justify-center mx-8">
              <div className="relative w-full max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map(({ to, label, isHashLink }) =>
                isHashLink ? (
                  <HashLink key={to} smooth to={to} className={linkStyles}>
                    {label}
                  </HashLink>
                ) : (
                  <Link key={to} to={to} className={linkStyles}>
                    {label}
                  </Link>
                )
              )}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-gray-600 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    {firstName}
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`lg:hidden mt-4 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
          >
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {navLinks.map(({ to, label, isHashLink }) =>
                isHashLink ? (
                  <HashLink
                    key={to}
                    smooth
                    to={to}
                    onClick={toggleMobileMenu}
                    className={`block ${linkStyles} py-2`}
                  >
                    {label}
                  </HashLink>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    onClick={toggleMobileMenu}
                    className={`block ${linkStyles} py-2`}
                  >
                    {label}
                  </Link>
                )
              )}
              {user ? (
                <div className="flex space-x-3 pt-2">
                  <Link
                    to="/dashboard"
                    onClick={toggleMobileMenu}
                    className="flex-1 text-center bg-gray-600 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    {firstName}
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="flex-1 text-center bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3 pt-2">
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="flex-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default Navbar;