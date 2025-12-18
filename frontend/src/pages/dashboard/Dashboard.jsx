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
  FaCog,
  FaHistory,
  FaChartLine,
  FaBell,
  FaTicketAlt,
  FaArrowRight,
  FaCalendarCheck,
  FaList,
  FaQrcode,
  FaDownload,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0
  });

  // Mock data - Replace with actual API calls
  const mockBookings = [
    {
      id: 1,
      service: "License Renewal",
      department: "Transport Department",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "upcoming",
      token: "TR2024-00123",
      location: "Sector 17, Chandigarh"
    },
    {
      id: 2,
      service: "Property Registration",
      department: "Revenue Department",
      date: "2024-01-10",
      time: "2:00 PM",
      status: "completed",
      token: "RD2024-04567",
      location: "District Court, Panchkula"
    },
    {
      id: 3,
      service: "PAN Card Application",
      department: "Income Tax Department",
      date: "2024-01-18",
      time: "11:15 AM",
      status: "pending",
      token: "IT2024-07891",
      location: "CBD Belapur, Navi Mumbai"
    },
    {
      id: 4,
      service: "Passport Appointment",
      department: "Passport Office",
      date: "2024-01-05",
      time: "9:45 AM",
      status: "completed",
      token: "PS2024-03456",
      location: "PSK, Delhi"
    }
  ];

  const quickActions = [
    {
      title: "New Booking",
      description: "Book a new service",
      icon: FaCalendarAlt,
      color: "from-blue-500 to-cyan-500",
      link: "/services",
      action: "Book Now"
    },
    {
      title: "My Bookings",
      description: "View all bookings",
      icon: FaCalendarCheck,
      color: "from-purple-500 to-pink-500",
      link: "/my-bookings",
      action: "View All"
    },
    {
      title: "Download Token",
      description: "Get QR code & details",
      icon: FaQrcode,
      color: "from-green-500 to-emerald-500",
      link: "/tokens",
      action: "Download"
    },
    {
      title: "Booking History",
      description: "Past appointments",
      icon: FaHistory,
      color: "from-orange-500 to-red-500",
      link: "/history",
      action: "View History"
    }
  ];

  const departments = [
    { name: "Transport", bookings: 2, color: "bg-blue-100 text-blue-600" },
    { name: "Revenue", bookings: 1, color: "bg-green-100 text-green-600" },
    { name: "Income Tax", bookings: 1, color: "bg-purple-100 text-purple-600" },
    { name: "Passport", bookings: 1, color: "bg-orange-100 text-orange-600" }
  ];

  useEffect(() => {
    // Calculate stats from mock bookings
    const total = mockBookings.length;
    const pending = mockBookings.filter(b => b.status === 'pending').length;
    const completed = mockBookings.filter(b => b.status === 'completed').length;
    const upcoming = mockBookings.filter(b => b.status === 'upcoming').length;
    const cancelled = mockBookings.filter(b => b.status === 'cancelled').length;
    
    setStats({ totalBookings: total, pending, completed, upcoming, cancelled });
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming': return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <FaExclamationCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <FaExclamationCircle className="w-4 h-4 text-red-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/40 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </motion.div>
              
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold"
                >
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 mt-1"
                >
                  Manage your bookings and services in one place
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <FaTicketAlt className="w-8 h-8 text-white/90" />
              <div>
                <p className="text-white/70 text-sm">Next Appointment</p>
                <p className="font-semibold">License Renewal</p>
                <p className="text-white/80 text-sm">Tomorrow, 10:30 AM</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Upcoming</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FaExclamationCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <Link 
                  to="/my-bookings" 
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  View All Bookings
                  <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link
                      to={action.link}
                      className={`block bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className="w-8 h-8" />
                        <FaArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                      <p className="text-white/80 mb-4">{action.description}</p>
                      <span className="inline-flex items-center gap-2 font-medium">
                        {action.action}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                  <Link 
                    to="/my-bookings" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    See All
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {mockBookings.slice(0, 3).map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                        <p className="text-sm text-gray-500">{booking.department}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <FaCalendarAlt className="w-3 h-3" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <FaClock className="w-3 h-3" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <FaMapMarkerAlt className="w-3 h-3" />
                            {booking.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-mono font-semibold text-gray-900">
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

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Link
                  to="/my-bookings"
                  className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2"
                >
                  <FaList className="w-4 h-4" />
                  View All Bookings
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Departments & Notifications */}
          <div className="space-y-8">
            {/* Departments Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Departments</h2>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dept.color.split(' ')[0]} ${dept.color.split(' ')[1]}`}>
                        <FaBuilding className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-sm text-gray-500">Department</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{dept.bookings}</p>
                      <p className="text-xs text-gray-500">bookings</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/departments"
                className="mt-6 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 border-t border-gray-100 pt-4"
              >
                <FaArrowRight className="w-4 h-4" />
                Explore All Departments
              </Link>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FaBell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-white/80 text-sm">Updates & reminders</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="w-5 h-5 text-white/90 mt-0.5" />
                    <div>
                      <p className="font-medium">Upcoming Appointment</p>
                      <p className="text-white/80 text-sm">License renewal tomorrow at 10:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <FaDownload className="w-5 h-5 text-white/90 mt-0.5" />
                    <div>
                      <p className="font-medium">Token Ready</p>
                      <p className="text-white/80 text-sm">Download your appointment token</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <FaChartLine className="w-5 h-5 text-white/90 mt-0.5" />
                    <div>
                      <p className="font-medium">Queue Update</p>
                      <p className="text-white/80 text-sm">Your wait time is approximately 15 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaPhone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Need Help?</h2>
                  <p className="text-white/80 text-sm">We're here for you</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span>Customer Support</span>
                  <span className="font-semibold">1800-123-4567</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span>Email Support</span>
                  <span className="font-semibold">support@queueindia.com</span>
                </div>
              </div>

              <button className="mt-6 w-full bg-white text-green-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;