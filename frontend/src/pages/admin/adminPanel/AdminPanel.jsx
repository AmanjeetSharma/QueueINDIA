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
      description: "Monitor all department queues in real-time and manage flow",
      icon: <MdQueue className="w-5 h-5" />,
      path: `/department/queue-services`,
      bgColor: "bg-purple-600",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-700",
      emoji: "🎫",
    },
    {
      id: "manage-staff",
      title: "Manage Staff",
      description: "Add, edit staff members, assign departments and permissions",
      icon: <MdOutlineManageAccounts className="w-5 h-5" />,
      path: `/department/${user?.departmentId}/admins`,
      bgColor: "bg-blue-600",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700",
      emoji: "👮",
    },
    {
      id: "manage-bookings",
      title: "Manage Bookings",
      description: "View and manage all bookings across departments",
      icon: <BsFillCalendarCheckFill className="w-5 h-5" />,
      path: `/department/bookings`,
      bgColor: "bg-green-600",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-700",
      emoji: "📅",
    },
    {
      id: "manage-department",
      title: "Department",
      description: "Edit department details and manage settings",
      icon: <MdAdminPanelSettings className="w-5 h-5" />,
      path: `/admin-panel/${user?.departmentId}/edit`,
      bgColor: "bg-red-600",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-700",
      emoji: "👑",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "System-wide metrics, reports and data-driven insights",
      icon: <BsGraphUp className="w-5 h-5" />,
      path: "/department/analytics",
      bgColor: "bg-indigo-600",
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
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
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
        <div className="px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Left */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                  System Administration Portal
                </p>
              </div>
            </div>

            {/* Right — badge + time inline on mobile */}
            <div className="flex items-center gap-2">
              {/* Live clock — hide label on very small screens */}
              <div className="hidden xs:flex items-center gap-1.5 bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-1">
                <FiClock className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="font-mono text-xs font-bold text-white tabular-nums">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                <GiQueenCrown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-[10px] sm:text-xs font-medium text-purple-300 hidden xs:inline">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-6 py-3 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">

          {/* Welcome Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                    {getGreeting()}, <span className="text-purple-400">{user?.name?.split(' ')[0] || 'Admin'}</span>
                  </h2>
                  <span className="text-xl">👋</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Welcome to the admin panel. You have full access to manage all department operations.
                </p>
              </div>

              {/* Date — hidden on mobile, shown md+ */}
              <div className="flex-shrink-0 hidden md:block">
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCalendar className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-gray-300 whitespace-nowrap">
                      {currentTime.toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-mono font-bold text-sm text-white tabular-nums">
                      {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admin Cards Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white">Admin Controls</h2>
                <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Manage system operations</p>
              </div>
              <span className="text-xl sm:text-2xl">⚙️</span>
            </div>

            {/* Cards Grid */}
            {/* Mobile: 2-col grid | sm: 2-col | lg: 3-col | xl: 5-col */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {adminCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group h-full"
                >
                  <Link to={card.path} className="block h-full">
                    <div className="bg-gray-800 border border-gray-700 hover:bg-slate-900 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all p-3 sm:p-4 h-full flex flex-col cursor-pointer relative">
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />

                      {/* Icon Row */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${card.bgColor} rounded-lg flex items-center justify-center shadow text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          {card.icon}
                        </div>
                        <span className="text-base sm:text-lg opacity-40 group-hover:opacity-90 transition-opacity">
                          {card.emoji}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-1 leading-tight">
                        {card.title}
                      </h3>

                      {/* Description — hide on smallest screens */}
                      <p className="hidden sm:block text-xs text-gray-400 mb-3 leading-relaxed flex-1">
                        {card.description}
                      </p>

                      {/* CTA */}
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-700/50">
                        <span className="text-[10px] sm:text-xs font-medium text-purple-400 group-hover:text-purple-300 truncate pr-1">
                          Open
                        </span>
                        <motion.div
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-purple-400 group-hover:text-purple-300 flex-shrink-0"
                        >
                          <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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