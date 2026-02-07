import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaUsers, FaBuilding, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { RiDashboard3Fill } from "react-icons/ri";

const SuperAdminPanel = () => {
  const { user } = useAuth();

  const adminCards = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "System metrics and analytics",
      icon: <RiDashboard3Fill className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "/super-admin-panel/dashboard",
      color: "from-blue-500 to-cyan-500",
      stats: "Real-time data"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage users and permissions",
      icon: <FaUsers className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "/super-admin-panel/users",
      color: "from-purple-500 to-pink-500",
      stats: "User accounts"
    },
    {
      id: "departments",
      title: "Departments",
      description: "Department and services control",
      icon: <FaBuilding className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "/super-admin-panel/departments",
      color: "from-green-500 to-emerald-500",
      stats: "Configure"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2"
              >
                SUPER ADMIN PANEL
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm sm:text-base text-red-100"
              >
                Full system control interface
              </motion.p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm">SUPER ADMIN</p>
                <p className="text-xs text-white/90 truncate max-w-[120px] sm:max-w-none">
                  {user?.name?.split(' ')[0] || "Admin"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content - Compact */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Welcome👋 dev @{user?.name?.split(' ')[0].toLowerCase() || 'admin'}! ready to manage? 🚀✨</h2>
              <p className="text-sm text-gray-600">
                Full system access. Select management area below. All actions are logged.
              </p>
            </div>
            <div className="bg-red-50 text-red-800 px-3 py-2 rounded-lg border border-red-200 whitespace-nowrap">
              <p className="font-semibold text-sm">Full Access</p>
              <p className="text-xs">All permissions granted</p>
            </div>
          </div>
        </motion.div>

        {/* Management Cards Grid - Compact */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Management Areas</h2>
          <p className="text-sm text-gray-600 mb-4 sm:mb-6">Select section to manage</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {adminCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, type: "spring" }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="h-full"
              >
                <Link
                  to={card.path}
                  className={`block bg-gradient-to-br ${card.color} rounded-xl sm:rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 group h-full`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className="text-xs font-bold bg-white/30 px-2 py-1 rounded-full">
                      {card.stats}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{card.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">{card.description}</p>

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Access</span>
                    <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-yellow-800 text-sm mb-1">Security Notice</h4>
              <p className="text-yellow-700 text-xs sm:text-sm">
                You have full system access. All actions are logged and monitored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;