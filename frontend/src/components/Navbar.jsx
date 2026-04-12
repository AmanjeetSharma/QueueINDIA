import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaDollarSign,
  FaEnvelope,
  FaBuilding,
  FaShieldAlt,
  FaTachometerAlt,
  FaUserShield,
  FaUserTie,
  FaUserCog,
  FaInfoCircle
} from "react-icons/fa";
import { FcAbout } from "react-icons/fc";

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[class*="lg:hidden"]')) {
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
    { to: "/how-things-work", label: "How Things Work", icon: FiTrendingUp },
    { to: "/pricing", label: "Pricing", icon: FaDollarSign },
  ];

  const roleColors = getRoleColors(user?.role);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.1,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">

        {/* Logo - Compact for mobile */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <span className="font-bold text-2xl sm:text-3xl bg-slate-800 bg-clip-text text-transparent select-none">
              Queue
              <span className="font-bold text-2xl sm:text-3xl bg-blue-700 bg-clip-text text-transparent select-none">
                INDIA
              </span>
            </span>
          </Link>
        </div>

        {/* Right Side - Compact for mobile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation Links - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 select-none">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-normal text-xs xl:text-sm transition-colors py-1.5 px-2 xl:px-3 rounded-lg"
              >
                <link.icon className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                <span className="relative whitespace-nowrap">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Dropdown - Hidden on mobile */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            {isAuthenticated ? (
              // Authenticated user dropdown trigger - Compact
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1.5 transition-colors border border-transparent hover:border-gray-200 group"
              >
                {/* User Avatar - INCREASED SIZE */}
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-9 h-9 xl:w-10 xl:h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                      <span className="text-white font-semibold text-sm xl:text-base">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  {/* Online indicator - INCREASED SIZE */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* User Name - Hidden on smaller screens */}
                <div className="hidden xl:block text-left">
                  <p className="text-s font-medium text-slate-900">
                    Hi! {user?.name?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[12px] text-gray-500">Welcome Back</p>
                </div>

                {/* Dropdown Arrow */}
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <FaChevronDown className="w-2.5 h-2.5" />
                </motion.div>
              </button>
            ) : (
              // Non-authenticated user dropdown trigger - Compact
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-1.5 hover:bg-gray-50 rounded-lg p-1.5 transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <FaChevronDown className="w-2.5 h-2.5" />
                </motion.div>
              </button>
            )}

            {/* Animated Dropdown Menu - Same as before */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-64 xl:w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                >
                  {isAuthenticated ? (
                    // Authenticated user menu (same content, compact padding)
                    <>
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FaShieldAlt className={`w-2.5 h-2.5 ${roleColors.shieldColor}`} />
                          <span className={`text-[10px] ${roleColors.textColor} font-medium`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>

                      {/* Role-Specific Panel Links */}
                      {user?.role === 'SUPER_ADMIN' && (
                        <Link
                          to="/super-admin-panel"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-red-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaUserShield className="w-3 h-3 text-red-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">Super Admin Panel</span>
                            <p className="text-[10px] text-gray-500">Full system control</p>
                          </div>
                        </Link>
                      )}

                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin-panel"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-purple-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FaUserCog className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">Admin Panel</span>
                            <p className="text-[10px] text-gray-500">Administration tools</p>
                          </div>
                        </Link>
                      )}

                      {user?.role === 'DEPARTMENT_OFFICER' && (
                        <Link
                          to="/officer-panel"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaUserTie className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">Officer Panel</span>
                            <p className="text-[10px] text-gray-500">Department management</p>
                          </div>
                        </Link>
                      )}

                      {/* Dashboard Link */}
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <FaTachometerAlt className="w-3 h-3 text-indigo-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">Dashboard</span>
                          <p className="text-[10px] text-gray-500">User dashboard</p>
                        </div>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FaEnvelope className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm  font-medium">Contact</span>
                      </Link>

                      <Link
                        to="/about"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FcAbout className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm  font-medium">About</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors group cursor-pointer"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <FaSignOutAlt className="w-3 h-3" />
                        </div>
                        <span className="text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    // Non-authenticated user menu (same content, compact padding)
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <FaSignInAlt className="w-3 h-3 text-indigo-600" />
                        </div>
                        <span className="text-sm">Login</span>
                      </Link>

                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <FaUser className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm">Register</span>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FaEnvelope className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm">Contact</span>
                      </Link>

                      <Link
                        to="/about"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FcAbout className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm">About</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button - More compact */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            ) : (
              <FaBars className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Optimized for small screens */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b shadow-lg z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          >
            <div className="px-2 py-2 space-y-0.5">
              {/* Mobile Navigation Links - Compact */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors group text-sm"
                  onClick={closeMobileMenu}
                >
                  <link.icon className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">{link.label}</span>
                </Link>
              ))}

              {/* Contact & About in mobile menu - Compact */}
              <Link
                to="/contact"
                className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
                onClick={closeMobileMenu}
              >
                <FaEnvelope className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Contact</span>
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
                onClick={closeMobileMenu}
              >
                <FaInfoCircle className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">About</span>
              </Link>

              <div className="border-t border-gray-200 my-2 pt-2">
                {isAuthenticated ? (
                  // Mobile authenticated user menu - Compact
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-gray-50 rounded-lg">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border border-gray-200 flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">Hi! {user?.name?.split(' ')[0] || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FaShieldAlt className={`w-2.5 h-2.5 ${roleColors.shieldColor} flex-shrink-0`} />
                          <span className={`text-[10px] ${roleColors.textColor} font-medium truncate`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Role-Specific Panels in Mobile - Compact */}
                    {user?.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/super-admin-panel"
                        className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-red-50 rounded-lg transition-colors mb-1 text-sm"
                        onClick={closeMobileMenu}
                      >
                        <FaUserShield className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium block truncate">Super Admin Panel</span>
                          <p className="text-[10px] text-gray-500 truncate">Full system control</p>
                        </div>
                      </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin-panel"
                        className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-purple-50 rounded-lg transition-colors mb-1 text-sm"
                        onClick={closeMobileMenu}
                      >
                        <FaUserCog className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium block truncate">Admin Panel</span>
                          <p className="text-[10px] text-gray-500 truncate">Administration tools</p>
                        </div>
                      </Link>
                    )}

                    {user?.role === 'DEPARTMENT_OFFICER' && (
                      <Link
                        to="/officer-panel"
                        className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-blue-50 rounded-lg transition-colors mb-1 text-sm"
                        onClick={closeMobileMenu}
                      >
                        <FaUserTie className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium block truncate">Officer Panel</span>
                          <p className="text-[10px] text-gray-500 truncate">Department management</p>
                        </div>
                      </Link>
                    )}

                    {/* Universal Dashboard in Mobile - Compact */}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors mb-1 text-sm"
                      onClick={closeMobileMenu}
                    >
                      <FaTachometerAlt className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium block truncate">Dashboard</span>
                        <p className="text-[10px] text-gray-500 truncate">User dashboard</p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full text-left py-2.5 px-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 text-sm"
                    >
                      <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // Mobile non-authenticated user menu - Compact
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors mb-1 text-sm"
                      onClick={closeMobileMenu}
                    >
                      <FaSignInAlt className="w-4 h-4 text-gray-600" />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-indigo-50 rounded-lg transition-colors mb-1 text-sm"
                      onClick={closeMobileMenu}
                    >
                      <FaUser className="w-4 h-4 text-gray-600" />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;