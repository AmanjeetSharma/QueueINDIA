import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDepartmentOfficer } from '../../../../context/DepartmentOfficerContext';
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiClock,
  FiUser,
  FiXCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const BookingsList = () => {
  const navigate = useNavigate();
  const {
    departmentBookings,
    loading,
    error,
    totalBookings,
    totalPages,
    currentPage,
    limit,
    getDepartmentBookings,
    setCurrentPage,
    setLimit
  } = useDepartmentOfficer();

  const [filters, setLocalFilters] = useState({
    status: '',
    date: '',
    serviceId: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, limit]);

  const fetchBookings = () => {
    getDepartmentBookings({
      page: currentPage,
      limit,
      ...filters
    });
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/department/bookings/${bookingId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getDepartmentBookings({
      page: 1,
      limit,
      ...filters
    });
  };

  const clearFilters = () => {
    setLocalFilters({
      status: '',
      date: '',
      serviceId: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
    getDepartmentBookings({ page: 1, limit });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/30', dot: 'bg-yellow-500' },
      'DOCS_SUBMITTED': { color: 'bg-blue-900/30 text-blue-300 border-blue-700/30', dot: 'bg-blue-500' },
      'UNDER_REVIEW': { color: 'bg-purple-900/30 text-purple-300 border-purple-700/30', dot: 'bg-purple-500' },
      'APPROVED': { color: 'bg-green-900/30 text-green-300 border-green-700/30', dot: 'bg-green-500' },
      'REJECTED': { color: 'bg-red-900/30 text-red-300 border-red-700/30', dot: 'bg-red-500' },
      'CANCELLED': { color: 'bg-gray-700/50 text-gray-300 border-gray-600/50', dot: 'bg-gray-400' },
      'COMPLETED': { color: 'bg-teal-900/30 text-teal-300 border-teal-700/30', dot: 'bg-teal-500' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-700/50 text-gray-300 border-gray-600/50', dot: 'bg-gray-400' };

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        <span className="hidden sm:inline truncate">{status.replace('_', ' ')}</span>
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'NORMAL': { bg: 'bg-gray-700/40 text-gray-300', label: 'Normal' },
      'SENIOR_CITIZEN': { bg: 'bg-orange-900/30 text-orange-300', label: 'Senior' },
      'PRIORITY': { bg: 'bg-amber-900/30 text-amber-300', label: 'Priority' },
      'EMERGENCY': { bg: 'bg-red-900/30 text-red-300', label: 'Emergency' }
    };

    const config = priorityConfig[priority] || { bg: 'bg-gray-700/40 text-gray-300', label: priority };

    return (
      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${config.bg}`}>
        <span className="hidden sm:inline">{config.label}</span>
        <span className="inline sm:hidden">{config.label.slice(0, 3)}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gray-800 rounded-lg p-4 h-24"
        />
      ))}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white pb-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20"
      >
        <div className="px-3 sm:px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Left side with back button and title */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Go back to dashboard"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  <p className='px-2'>Back</p>
                </motion.button>

                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Bookings</h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    <span className="text-cyan-400 font-semibold">{totalBookings}</span> total • Page{' '}
                    <span className="text-cyan-400 font-semibold">{currentPage}/{totalPages}</span>
                  </p>
                </div>
              </div>

              {/* Right side with filter and refresh buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2.5 sm:px-3 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchBookings}
                  disabled={loading}
                  className="p-2.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </motion.button>
              </div>
            </div>

            {/* Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white text-sm placeholder-gray-400 rounded-lg focus:border-blue-500 outline-none transition-colors"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-700 overflow-hidden"
          >
            <div className="px-3 sm:px-4 py-4 bg-gray-800/50">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1.5 block">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="DOCS_SUBMITTED">Docs Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1.5 block">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyFilters}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Apply
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Clear
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-3 sm:px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <FiXCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-300 mb-1">Error Loading Bookings</h3>
                    <p className="text-xs text-red-200 mb-2">{error}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchBookings}
                      className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-900/40 hover:bg-red-900/60 rounded transition-colors"
                    >
                      Try Again
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bookings List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {loading ? (
              renderSkeleton()
            ) : departmentBookings.length > 0 ? (
              departmentBookings.map((booking, idx) => (
                <motion.div
                  key={booking._id}
                  variants={itemVariants}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg overflow-hidden transition-all hover:shadow-lg group"
                >
                  {/* Main Content */}
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Left - User Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-600/30 border border-blue-500/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiUser className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-white truncate">
                              {booking.userName}
                            </h3>
                            {booking.tokenNumber && (
                              <span className="text-xs font-bold bg-blue-600/40 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                                #{booking.tokenNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-1.5 truncate">{booking.service?.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-3.5 h-3.5 text-gray-500" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            {booking.slotTime && (
                              <div className="flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5 text-gray-500" />
                                <span>{booking.slotTime}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-gray-500">ID:</span>
                              <span className="font-mono truncate max-w-[80px]">{booking._id.slice(0, 10)}...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Status & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(booking.status)}
                          {getPriorityBadge(booking.priorityType)}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(booking._id)}
                          className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="inline sm:hidden">View</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-8 sm:p-12 text-center"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiAlertCircle className="w-6 h-6 text-gray-500" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">No bookings found</h3>
                <p className="text-gray-400 text-sm mb-4 max-w-sm mx-auto">
                  {Object.values(filters).some(f => f)
                    ? "No bookings match your filters. Try adjusting your search."
                    : "There are no bookings in your department yet."}
                </p>
                {Object.values(filters).some(f => f) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/30 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Showing <span className="text-cyan-400 font-semibold">{(currentPage - 1) * limit + 1}</span> to{' '}
                    <span className="text-cyan-400 font-semibold">
                      {Math.min(currentPage * limit, totalBookings)}
                    </span>{' '}
                    of <span className="text-cyan-400 font-semibold">{totalBookings}</span> bookings
                  </p>

                  <div className="flex items-center justify-center gap-1 overflow-x-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
                      aria-label="Next page"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingsList;