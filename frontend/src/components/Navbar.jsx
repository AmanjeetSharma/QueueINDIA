import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaDollarSign,
  FaConciergeBell,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaShieldAlt
} from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[class*="md:hidden"]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to format role for display
  const formatRole = (role) => {
    if (!role) return '';

    // Convert snake_case to Title Case with spaces
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to get role color and icon color
  const getRoleColors = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          shieldColor: 'text-red-600',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'ADMIN':
        return {
          shieldColor: 'text-purple-600',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'DEPARTMENT_OFFICER':
        return {
          shieldColor: 'text-blue-600',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'USER':
      default:
        return {
          shieldColor: 'text-green-600',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/departments", label: "Departments", icon: FaBuilding },
    { to: "/services", label: "Services", icon: FaConciergeBell },
    { to: "/pricing", label: "Pricing", icon: FaDollarSign },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const roleColors = getRoleColors(user?.role);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo - Extreme Left */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-lg">Q</span>
            </motion.div>
            <motion.span
              className="font-bold text-2xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              QueueINDIA
            </motion.span>
          </Link>
        </motion.div>

        {/* Everything Else - Right Side */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={link.to}
                  className="group flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-normal text-sm transition-all duration-300 py-2 px-3 rounded-lg hover:bg-indigo-50"
                >
                  <link.icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Dropdown */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            {isAuthenticated ? (
              // Authenticated user dropdown trigger with enhanced design
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleDropdown}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-2xl p-3 transition-all duration-300 border border-transparent hover:border-gray-200 group"
              >
                {/* User Avatar with enhanced styling */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 shadow-sm group-hover:border-indigo-300 transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-sm group-hover:border-indigo-300 transition-colors">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </motion.div>

                {/* User Name with animation */}
                <div className="text-left">
                  <motion.p
                    className="text-sm font-semibold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Hi! {user?.name?.split(' ')[0] || 'User'}
                  </motion.p>
                  <p className={`text-xs font-medium`}>Welcome Back</p>
                </div>

                {/* Animated Dropdown Arrow */}
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 group-hover:text-gray-600"
                >
                  <FaChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            ) : (
              // Non-authenticated user dropdown trigger - Only Sign In
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-xl p-2 transition-all duration-300 border border-transparent hover:border-gray-200 group"
              >
                <div className="w-8 h-8 bg-linear-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 group-hover:text-gray-600"
                >
                  <FaChevronDown className="w-3 h-3" />
                </motion.div>
              </motion.button>
            )}

            {/* Animated Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 py-3 z-50"
                >
                  {isAuthenticated ? (
                    // Authenticated user menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaShieldAlt className={`w-3 h-3 ${roleColors.shieldColor}`} />
                          <span className={`text-xs ${roleColors.textColor} font-medium`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>

                      <motion.div variants={itemVariants}>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <FaIdCard className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span>Profile</span>
                        </Link>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Link
                          to="/contact"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaEnvelope className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>Contact</span>
                        </Link>
                      </motion.div>

                      <div className="border-t border-gray-100 my-2"></div>

                      <motion.div variants={itemVariants}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaSignOutAlt className="w-4 h-4" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    // Non-authenticated user menu
                    <>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <FaSignInAlt className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span>Sign In</span>
                        </Link>
                      </motion.div>



                      <motion.div variants={itemVariants}>
                        <Link
                          to="/contact"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaEnvelope className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>Contact</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    closeMobileMenu();
                  }}
                >
                  <FaTimes className="w-6 h-6 text-gray-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="w-6 h-6 text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg z-40 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl transition-colors group"
                    onClick={closeMobileMenu}
                  >
                    <link.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Contact in mobile menu */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/contact"
                  className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl transition-colors group"
                  onClick={closeMobileMenu}
                >
                  <FaEnvelope className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    Contact
                  </span>
                </Link>
              </motion.div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                {isAuthenticated ? (
                  // Mobile authenticated user menu
                  <>
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-indigo-200">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">Hi! {user?.name?.split(' ')[0] || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaShieldAlt className={`w-3 h-3 ${roleColors.shieldColor}`} />
                          <span className={`text-xs ${roleColors.textColor} font-medium`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <FaIdCard className="w-5 h-5 text-gray-600" />
                        <span>Profile</span>
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="visible">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left py-3 px-4 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                      >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                ) : (
                  // Mobile non-authenticated user menu
                  <>
                    <motion.div variants={itemVariants} initial="hidden" animate="visible">
                      <Link
                        to="/login"
                        className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl transition-colors mb-2"
                        onClick={closeMobileMenu}
                      >
                        <FaSignInAlt className="w-5 h-5 text-gray-600" />
                        <span>Sign In</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;