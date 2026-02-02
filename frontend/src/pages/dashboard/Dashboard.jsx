import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaTicketAlt,
  FaBuilding,
  FaArrowRight,
  FaPhone,
  FaCog,
  FaPlus,
  FaInfoCircle
} from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    completed: 0,
    upcoming: 0
  });

  const mockBookings = [
    {
      id: 1,
      service: "License Renewal",
      department: "Transport Department",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "upcoming",
      token: "TR2024-00123"
    },
    {
      id: 2,
      service: "Property Registration",
      department: "Revenue Department",
      date: "2024-01-10",
      time: "2:00 PM",
      status: "completed",
      token: "RD2024-04567"
    },
    {
      id: 3,
      service: "PAN Card Application",
      department: "Income Tax Department",
      date: "2024-01-18",
      time: "11:15 AM",
      status: "pending",
      token: "IT2024-07891"
    }
  ];

  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming');

  useEffect(() => {
    const total = mockBookings.length;
    const pending = mockBookings.filter(b => b.status === 'pending').length;
    const completed = mockBookings.filter(b => b.status === 'completed').length;
    const upcoming = mockBookings.filter(b => b.status === 'upcoming').length;

    setStats({ totalBookings: total, pending, completed, upcoming });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming': return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <FaExclamationCircle className="w-4 h-4 text-yellow-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mainActions = [
    {
      title: "Manage Profile",
      icon: FaUser,
      color: "from-orange-500 to-red-500",
      link: "/profile",
      badge: "Account"
    },
    {
      title: "My Bookings",
      icon: FaCalendarAlt,
      color: "from-purple-500 to-pink-500",
      link: "/my-bookings",
      badge: "View all"
    },
    {
      title: "New Booking",
      icon: FaPlus,
      color: "from-blue-500 to-cyan-500",
      link: "/departments",
      badge: "Start here"
    },
    {
      title: "How Our Service Works & FAQs",
      icon: FaInfoCircle,
      color: "from-green-500 to-emerald-500",
      link: "/how-things-work",
      badge: "Learn"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative flex-shrink-0"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white/30 object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/40 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <FaUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold leading-tight"
                >
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 mt-1 text-sm sm:text-base"
                >
                  Manage your account & bookings from one place
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 w-full sm:w-auto"
            >
              <AiFillDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <div className="text-white font-medium sm:font-bold text-sm sm:text-base">
                DASHBOARD
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          <div className="bg-white/80 to-white backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Total Bookings</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>

          <div className="bg-blue-100 to-white backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Upcoming</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{stats.upcoming}</p>
          </div>

          <div className="bg-green-100 to-white backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Completed</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-yellow-100 to-white backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </motion.div>

        {/* Main Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {mainActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4, sm: -8 }}
              className="h-full"
            >
              <Link
                to={action.link}
                className={`block bg-gradient-to-br ${action.color} rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 group h-full`}
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <action.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white/90" />
                  <span className="text-xs font-semibold bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                    {action.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{action.title}</h3>
                <div className="flex items-center gap-2 text-white/80 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform text-sm sm:text-base">
                  <span>Go</span>
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link
                to="/my-bookings"
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1"
              >
                View All <FaArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {mockBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                      <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{booking.service}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{booking.department}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                    <div className="text-right">
                      <div className="text-xs font-mono text-gray-600 mb-1 truncate">
                        {booking.token}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="truncate">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                      </span>
                    </div>
                    <Link
                      to={`/booking/${booking.id}`}
                      className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                    >
                      <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/my-bookings"
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors text-sm sm:text-base"
              >
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                View All Bookings
              </Link>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <FaPhone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Need Help?</h2>
                <p className="text-white/80 text-xs sm:text-sm">24/7 Support</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-white/70 mb-1">Phone</p>
                <p className="font-semibold text-sm sm:text-base">1800-123-4567</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-white/70 mb-1">Email</p>
                <p className="font-semibold text-xs sm:text-sm">support@queueindia.com</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-2 bg-white text-green-600 font-semibold py-3 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
              Contact Support
            </Link>
          </motion.div>
        </div>

        {/* Upcoming Bookings Section */}
        {upcomingBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Your scheduled services</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {upcomingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 2, sm: 4 }}
                    className="border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                            {upcomingBookings.indexOf(booking) + 1}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{booking.service}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{booking.department}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4 ml-0 sm:ml-11">
                          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              Date
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{booking.date}</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              Time
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{booking.time}</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-gray-500 mb-1">Token</p>
                            <p className="font-mono font-semibold text-blue-600 text-sm sm:text-base truncate">{booking.token}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/booking/${booking.id}`}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        Details
                        <FaArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg sm:rounded-xl"
              >
                <p className="text-xs sm:text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Save your token number and arrive 10-15 minutes early for a smooth experience.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;