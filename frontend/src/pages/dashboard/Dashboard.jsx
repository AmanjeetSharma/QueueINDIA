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
  FaBuilding,
  FaArrowRight,
  FaPhone,
  FaCog,
  FaPlus
} from "react-icons/fa";

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
    switch(status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming': return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <FaExclamationCircle className="w-4 h-4 text-yellow-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
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
      title: "Explore Departments",
      icon: FaBuilding,
      color: "from-green-500 to-emerald-500",
      link: "/departments",
      badge: "Browse"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white/80 to-white backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-sm mb-2">Total Bookings</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>

          <div className="bg-blue-100 to-white backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-sm mb-2">Upcoming</p>
            <p className="text-4xl font-bold text-blue-600">{stats.upcoming}</p>
          </div>

          <div className="bg-green-100 to-white backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-yellow-100 to-white backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg">
            <p className="text-slate-900 text-sm mb-2">Pending</p>
            <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </motion.div>

        {/* Main Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {mainActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{delay: 0.1}}
              whileHover={{ y: -8 }}
            >
              <Link
                to={action.link}
                className={`block bg-gradient-to-br ${action.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group h-full`}
              >
                <div className="flex items-start justify-between mb-6">
                  <action.icon className="w-10 h-10 text-white/90" />
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {action.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <div className="flex items-center gap-2 text-white/80 group-hover:translate-x-2 transition-transform">
                  <span>Go</span>
                  <FaArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link 
                to="/my-bookings" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {mockBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className="px-6 py-4 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <FaBuilding className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                      <p className="text-sm text-gray-600">{booking.department}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
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

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-mono text-gray-600 mb-1">
                        {booking.token}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <Link
                      to={`/booking/${booking.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/my-bookings"
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
              >
                <FaArrowRight className="w-4 h-4" />
                View All Bookings
              </Link>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaPhone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Need Help?</h2>
                <p className="text-white/80 text-sm">24/7 Support</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-white/70 mb-1">Phone</p>
                <p className="font-semibold">1800-123-4567</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-white/70 mb-1">Email</p>
                <p className="font-semibold text-sm">support@queueindia.com</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-2 bg-white text-green-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <FaPhone className="w-4 h-4" />
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
            className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <p className="text-sm text-gray-600 mt-1">Your scheduled services</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 4 }}
                    className="border border-blue-200 rounded-xl p-5 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {upcomingBookings.indexOf(booking) + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{booking.service}</h3>
                            <p className="text-sm text-gray-600">{booking.department}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 ml-11">
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              Date
                            </p>
                            <p className="font-semibold text-gray-900">{booking.date}</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              Time
                            </p>
                            <p className="font-semibold text-gray-900">{booking.time}</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Token</p>
                            <p className="font-mono font-semibold text-blue-600">{booking.token}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/booking/${booking.id}`}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
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
                className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-xl"
              >
                <p className="text-sm text-blue-900">
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