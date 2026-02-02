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
      title: "System Dashboard",
      description: "Overview of all system metrics, analytics, and performance indicators",
      icon: <RiDashboard3Fill className="w-8 h-8" />,
      path: "/super-admin-panel/dashboard",
      color: "from-blue-500 to-cyan-500",
      stats: "View real-time data"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage all users, roles, permissions, and access controls across the platform",
      icon: <FaUsers className="w-8 h-8" />,
      path: "/super-admin-panel/users",
      color: "from-purple-500 to-pink-500",
      stats: "Manage user accounts"
    },
    {
      id: "departments",
      title: "Department Management",
      description: "Control departments, services, and organizational structure",
      icon: <FaBuilding className="w-8 h-8" />,
      path: "/super-admin-panel/departments",
      color: "from-green-500 to-emerald-500",
      stats: "Configure departments"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
              >
                SUPER ADMIN PANEL
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-red-100 max-w-3xl"
              >
                Full system control and management interface
              </motion.p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30"
            >
              <div className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">SUPER ADMIN</p>
                <p className="text-xs text-white/90">{user?.name || "System Admin"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome, {user?.name?.split(' ')[0] || 'Super Admin'}! 🚀
              </h2>
              <p className="text-gray-600 max-w-3xl">
                You have full system access and control. Select a management area below to begin.
                All actions are logged and monitored for security purposes.
              </p>
            </div>
            <div className="bg-red-50 text-red-800 px-4 py-3 rounded-xl border border-red-200">
              <p className="font-semibold">Full System Access</p>
              <p className="text-sm">All permissions granted</p>
            </div>
          </div>
        </motion.div>

        {/* Management Cards Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Management Areas</h2>
          <p className="text-gray-600 mb-8">Select a section to manage</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link
                  to={card.path}
                  className={`block bg-gradient-to-br ${card.color} rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 h-full group`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className="text-xs font-bold bg-white/30 px-3 py-1 rounded-full">
                      {card.stats}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="text-white/80 mb-6">{card.description}</p>

                  <div className="flex items-center gap-2 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Access Panel</span>
                    <FaArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <h3 className="text-xl font-bold mb-4">System Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Total Users</p>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Active Departments</p>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Today's Bookings</p>
              <p className="text-3xl font-bold">156</p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">Security Notice</h4>
              <p className="text-yellow-700">
                You are accessing the super admin panel with full system privileges.
                All actions are logged and monitored. Please ensure you follow security protocols.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;