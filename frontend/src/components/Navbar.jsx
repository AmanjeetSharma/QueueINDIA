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
  FaIdCard,
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
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo - Extreme Left */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">Q</span>
            </div> */}
            <span className="font-bold text-3xl bg-slate-800 bg-clip-text text-transparent select-none">
              Queue
              <span className="font-bold text-3xl bg-blue-600 bg-clip-text text-transparent select-none">
                INDIA
              </span>
            </span>
          </Link>
        </div>

        {/* Everything Else - Right Side */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 select-none">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-normal text-sm transition-colors py-2 px-3 rounded-lg"
              >
                <link.icon className="w-3.5 h-3.5" />
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Dropdown */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            {isAuthenticated ? (
              // Authenticated user dropdown trigger with enhanced design
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors border border-transparent hover:border-gray-200 group"
              >
                {/* User Avatar */}
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* User Name */}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Hi! {user?.name?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Welcome Back</p>
                </div>

                {/* Dropdown Arrow */}
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <FaChevronDown className="w-3 h-3" />
                </motion.div>
              </button>
            ) : (
              // Non-authenticated user dropdown trigger - Only Sign In
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-xl p-2 transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                  <FaUser className="w-3.5 h-3.5 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <FaChevronDown className="w-3 h-3" />
                </motion.div>
              </button>
            )}

            {/* Animated Dropdown Menu - Elevated with shadow */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50"
                >
                  {isAuthenticated ? (
                    // Authenticated user menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaShieldAlt className={`w-3 h-3 ${roleColors.shieldColor}`} />
                          <span className={`text-xs ${roleColors.textColor} font-medium`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>

                      {/* Role-Specific Panel Links */}
                      {user?.role === 'SUPER_ADMIN' && (
                        <Link
                          to="/super-admin-panel"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaUserShield className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">Super Admin Panel</span>
                            <p className="text-xs text-gray-500">Full system control</p>
                          </div>
                        </Link>
                      )}

                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin-panel"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FaUserCog className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium">Admin Panel</span>
                            <p className="text-xs text-gray-500">Administration tools</p>
                          </div>
                        </Link>
                      )}

                      {user?.role === 'DEPARTMENT_OFFICER' && (
                        <Link
                          to="/officer-panel"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaUserTie className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium">Officer Panel</span>
                            <p className="text-xs text-gray-500">Department management</p>
                          </div>
                        </Link>
                      )}

                      {/* Dashboard Link - Universal for all roles */}
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <FaTachometerAlt className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <span className="font-medium">Dashboard</span>
                          <p className="text-xs text-gray-500">User dashboard</p>
                        </div>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FaEnvelope className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>Contact</span>
                      </Link>

                      <Link
                        to="/about"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FcAbout  className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>About</span>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <FaSignOutAlt className="w-4 h-4" />
                        </div>
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    // Non-authenticated user menu
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <FaSignInAlt className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <FaUser className="w-4 h-4 text-green-600" />
                        </div>
                        <span>Register</span>
                      </Link>

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

                      <Link
                        to="/about"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FcAbout  className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>About</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5 text-gray-600" />
            ) : (
              <FaBars className="w-5 h-5 text-gray-600" />
            )}
          </button>
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
            className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-40 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors group"
                  onClick={closeMobileMenu}
                >
                  <link.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">{link.label}</span>
                </Link>
              ))}

              {/* Contact in mobile menu */}
              <Link
                to="/contact"
                className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <FaEnvelope className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Contact</span>
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <FaInfoCircle  className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">About</span>
              </Link>

              <div className="border-t border-gray-200 pt-3 mt-2">
                {isAuthenticated ? (
                  // Mobile authenticated user menu
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border border-gray-200">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Hi! {user?.name?.split(' ')[0] || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaShieldAlt className={`w-3 h-3 ${roleColors.shieldColor}`} />
                          <span className={`text-xs ${roleColors.textColor} font-medium`}>
                            {formatRole(user?.role)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role-Specific Panels in Mobile */}
                    {user?.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/super-admin-panel"
                        className="flex items-center gap-3 py-3 px-4 hover:bg-red-50 rounded-lg transition-colors mb-2"
                        onClick={closeMobileMenu}
                      >
                        <FaUserShield className="w-5 h-5 text-red-600" />
                        <div>
                          <span className="font-medium">Super Admin Panel</span>
                          <p className="text-xs text-gray-500">Full system control</p>
                        </div>
                      </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin-panel"
                        className="flex items-center gap-3 py-3 px-4 hover:bg-purple-50 rounded-lg transition-colors mb-2"
                        onClick={closeMobileMenu}
                      >
                        <FaUserCog className="w-5 h-5 text-purple-600" />
                        <div>
                          <span className="font-medium">Admin Panel</span>
                          <p className="text-xs text-gray-500">Administration tools</p>
                        </div>
                      </Link>
                    )}

                    {user?.role === 'DEPARTMENT_OFFICER' && (
                      <Link
                        to="/officer-panel"
                        className="flex items-center gap-3 py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors mb-2"
                        onClick={closeMobileMenu}
                      >
                        <FaUserTie className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-medium">Officer Panel</span>
                          <p className="text-xs text-gray-500">Department management</p>
                        </div>
                      </Link>
                    )}

                    {/* Universal Dashboard in Mobile */}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors mb-2"
                      onClick={closeMobileMenu}
                    >
                      <FaTachometerAlt className="w-5 h-5 text-gray-600" />
                      <div>
                        <span className="font-medium">Dashboard</span>
                        <p className="text-xs text-gray-500">User dashboard</p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left py-3 px-4 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // Mobile non-authenticated user menu
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors mb-2"
                      onClick={closeMobileMenu}
                    >
                      <FaSignInAlt className="w-5 h-5 text-gray-600" />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-lg transition-colors mb-2"
                      onClick={closeMobileMenu}
                    >
                      <FaUser className="w-5 h-5 text-gray-600" />
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