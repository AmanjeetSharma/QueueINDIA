// pages/department-officer/BookingsList.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDepartmentOfficer } from '../../../../context/DepartmentOfficerContext';
import { 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiEye, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
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
  const [expandedBookingId, setExpandedBookingId] = useState(null);

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
    navigate(`/officer-panel/bookings/${bookingId}`);
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
      'PENDING': { 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dot: 'bg-yellow-500'
      },
      'DOCS_SUBMITTED': { 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      },
      'UNDER_REVIEW': { 
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500'
      },
      'APPROVED': { 
        color: 'bg-green-50 text-green-700 border-green-200',
        dot: 'bg-green-500'
      },
      'REJECTED': { 
        color: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500'
      },
      'CANCELLED': { 
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400'
      },
      'COMPLETED': { 
        color: 'bg-teal-50 text-teal-700 border-teal-200',
        dot: 'bg-teal-500'
      },
    };

    const config = statusConfig[status] || { 
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      dot: 'bg-gray-400'
    };

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        <span className="truncate max-w-[80px]">{status.replace('_', ' ')}</span>
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'NORMAL': { bg: 'bg-gray-100 text-gray-700', label: 'Normal' },
      'SENIOR_CITIZEN': { bg: 'bg-orange-100 text-orange-700', label: 'Senior' },
      'PRIORITY': { bg: 'bg-amber-100 text-amber-700', label: 'Priority' },
      'EMERGENCY': { bg: 'bg-red-100 text-red-700', label: 'Emergency' }
    };

    const config = priorityConfig[priority] || { bg: 'bg-gray-100 text-gray-700', label: priority };

    return (
      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded ${config.bg} truncate max-w-[80px]`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleBookingExpand = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-100 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{totalBookings}</span> total bookings • Page{' '}
              <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="mr-2 w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`mr-2 w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Filter Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start">
            <FiXCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error Loading Bookings</h3>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          renderSkeleton()
        ) : departmentBookings.length > 0 ? (
          departmentBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {/* Main Card Content */}
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Section - User Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {booking.userName}
                        </h3>
                        {booking.tokenNumber && (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">
                            Token #{booking.tokenNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {booking.service?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        {booking.slotTime && (
                          <div className="flex items-center gap-1.5">
                            <FiClock className="w-4 h-4 text-gray-400" />
                            <span>{booking.slotTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:items-end xl:items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(booking.status)}
                      {getPriorityBadge(booking.priorityType)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(booking._id)}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="inline sm:hidden">Details</span>
                      </button>
                      <button
                        onClick={() => toggleBookingExpand(booking._id)}
                        className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedBookingId === booking._id ? (
                          <FiChevronUp className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBookingId === booking._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                          Booking Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Booking ID:</span>
                            <span className="text-sm font-mono text-gray-900">
                              {booking._id.slice(0, 12)}...
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Created:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Service Type:</span>
                            <span className="text-sm font-medium text-gray-900">{booking.service?.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                          Quick Actions
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleViewDetails(booking._id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <FiEye className="mr-2 w-4 h-4" />
                            Review Documents
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FiAlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {Object.values(filters).some(f => f) 
                ? "No bookings match your current filters. Try adjusting your search criteria." 
                : "There are no bookings in your department yet."}
            </p>
            {Object.values(filters).some(f => f) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * limit + 1}</span> to{' '}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * limit, totalBookings)}
              </span>{' '}
              of <span className="font-semibold text-gray-900">{totalBookings}</span> bookings
            </div>
            
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
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
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;