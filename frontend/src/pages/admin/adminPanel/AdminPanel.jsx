import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
  FaHome,
} from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";
import { GiQueenCrown } from "react-icons/gi";
import { MdQueue, MdAdminPanelSettings, MdOutlineManageAccounts } from "react-icons/md";
import { BsFillCalendarCheckFill, BsGraphUp } from "react-icons/bs";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const adminCards = [
    {
      id: "queue",
      title: "Live Queue",
      description: "Monitor all department queues in real-time, view waiting times, and manage queue flow efficiently",
      longDescription: "Track active queues, manage waiting times, and optimize customer flow across all departments",
      icon: <MdQueue className="w-7 h-7" />,
      path: "/admin/live-queue",
      bgColor: "bg-purple-600",
      hoverBgColor: "hover:bg-purple-700",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-700",
      emoji: "🎫",
    },
    {
      id: "manage-officers/admins",
      title: "Manage Officers",
      description: "Add, edit, or remove officers, assign departments, and manage permissions across the system",
      longDescription: "Complete control over officer accounts, department assignments, and access levels",
      icon: <MdOutlineManageAccounts className="w-7 h-7" />,
      path: "/admin/officers",
      bgColor: "bg-blue-600",
      hoverBgColor: "hover:bg-blue-700",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700",
      emoji: "👮",
    },
    {
      id: "manage-bookings",
      title: "Manage Bookings",
      description: "View, edit, and manage all bookings across departments with complete oversight",
      longDescription: "Comprehensive booking management with filtering, sorting, and bulk operations",
      icon: <BsFillCalendarCheckFill className="w-7 h-7" />,
      path: "/admin/bookings",
      bgColor: "bg-green-600",
      hoverBgColor: "hover:bg-green-700",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-700",
      emoji: "📅",
    },
    {
      id: "manage-department",
      title: "Manage Department",
      description: "Edit department details, manage department-specific settings, and oversee department",
      longDescription: "Complete control over department configurations and department-specific settings",
      icon: <MdAdminPanelSettings className="w-7 h-7" />,
      path: "/admin/department",
      bgColor: "bg-red-600",
      hoverBgColor: "hover:bg-red-700",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-700",
      emoji: "👑",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "System-wide analytics, performance metrics, and detailed reports for data-driven decisions",
      longDescription: "Comprehensive analytics dashboard with customizable reports and insights",
      icon: <BsGraphUp className="w-7 h-7" />,
      path: "/admin/analytics",
      bgColor: "bg-indigo-600",
      hoverBgColor: "hover:bg-indigo-700",
      gradientFrom: "from-indigo-500",
      gradientTo: "to-indigo-700",
      emoji: "📊",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex flex-col"
    >
      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40"
      >
        <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Left Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                    System Administration Portal
                  </p>
                </div>
              </motion.div>

              {/* Admin Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center"
              >
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                  <GiQueenCrown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-medium text-purple-300">Admin Access</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-sm p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {getGreeting()}, <span className="text-purple-400">{user?.name?.split(' ')[0] || 'Admin'}</span>
                  </h2>
                  <span className="text-2xl sm:text-3xl">👋</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1">
                  Welcome to the system administration panel. You have full access to manage all aspects of the department.
                </p>
              </motion.div>

              {/* Time Display */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-shrink-0 w-full sm:w-auto"
              >
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm text-gray-300">
                      {currentTime.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                    <span className="font-bold text-sm sm:text-base text-white font-mono">
                      {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Admin Cards Section */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Admin Controls</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Manage system operations and configurations</p>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl">⚙️</div>
            </div>

            {/* Cards in single row with vertical layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {adminCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group h-full"
                >
                  <Link to={card.path} className="block h-full">
                    <div className={`bg-gray-800 border border-gray-700 ${card.hoverBgColor} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all p-4 sm:p-5 h-full flex flex-col cursor-pointer relative`}>
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                      {/* Icon & Emoji */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bgColor} rounded-xl flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          {card.icon}
                        </div>
                        <div className="text-xl sm:text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                          {card.emoji}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 leading-relaxed">
                        {card.description}
                      </p>





                      {/* CTA */}
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-700/50">
                        <span className="text-xs sm:text-sm font-medium text-purple-400 group-hover:text-purple-300">
                          Go to {card.title}
                        </span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-purple-400 group-hover:text-purple-300"
                        >
                          <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;