import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
  FaFileUpload,
  FaEye,
  FaFilter,
  FaSearch,
  FaExclamationTriangle,
  FaSync,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaFolderOpen,
  FaFolder
} from 'react-icons/fa';

const UserBookings = () => {
  const { bookings, getUserBookings, loading, cancelBooking } = useBooking();
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    bookingId: null,
    serviceName: '',
    date: '',
    time: ''
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const hasFetchedInitial = useRef(false);

  const ACTIVE_STATUSES = [
    'PENDING_DOCS',
    'DOCS_SUBMITTED',
    'UNDER_REVIEW',
  ];

  const TERMINAL_STATUSES = [
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'COMPLETED',
  ];

  // Auto-fetch on mount
  useEffect(() => {
    const fetchInitialBookings = async () => {
      if (isAuthenticated && !hasFetchedInitial.current) {
        try {
          await getUserBookings();
          hasFetchedInitial.current = true;
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
        }
      }
    };

    fetchInitialBookings();
  }, [isAuthenticated, getUserBookings]);

  const handleRefresh = async () => {
    try {
      await getUserBookings();
    } catch (error) {
      console.error('Failed to refresh bookings:', error);
    }
  };

  // Group bookings by date and sort within each date
  const groupBookingsByDate = (bookingsList) => {
    const grouped = {};
    
    bookingsList.forEach(booking => {
      const dateKey = booking.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });

    // Sort bookings within each date (latest booking first - by createdAt)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        return new Date(b.createdAt || b.bookedAt || b.date) - new Date(a.createdAt || a.bookedAt || a.date);
      });
    });

    // Sort dates in descending order (latest dates first)
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    
    const sortedGrouped = {};
    sortedDates.forEach(date => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false;

    if (search) {
      const searchLower = search.toLowerCase();
      return (
        booking.service?.name?.toLowerCase().includes(searchLower) ||
        booking.metadata?.departmentName?.toLowerCase().includes(searchLower) ||
        booking.tokenNumber?.toString().includes(search) ||
        booking._id?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const groupedBookings = groupBookingsByDate(filteredBookings);

  const handleCancelClick = (booking) => {
    setCancelModal({
      isOpen: true,
      bookingId: booking._id,
      serviceName: booking.service?.name || 'Unknown Service',
      date: formatDate(booking.date),
      time: formatTime(booking.slotTime)
    });
  };

  const handleCancelConfirm = async () => {
    if (!cancelModal.bookingId) return;

    setCancellingId(cancelModal.bookingId);
    try {
      await cancelBooking(cancelModal.bookingId);
      setCancelModal({
        isOpen: false,
        bookingId: null,
        serviceName: '',
        date: '',
        time: ''
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelClose = () => {
    setCancelModal({
      isOpen: false,
      bookingId: null,
      serviceName: '',
      date: '',
      time: ''
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      'PENDING_DOCS': { color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', icon: FaFileUpload, label: 'Pending Docs' },
      'DOCS_SUBMITTED': { color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', icon: FaHourglassHalf, label: 'Docs Submitted' },
      'UNDER_REVIEW': { color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700', icon: FaHourglassHalf, label: 'Under Review' },
      'APPROVED': { color: 'green', bg: 'bg-green-50', text: 'text-green-700', icon: FaCheckCircle, label: 'Approved' },
      'REJECTED': { color: 'red', bg: 'bg-red-50', text: 'text-red-700', icon: FaTimes, label: 'Rejected' },
      'CANCELLED': { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', icon: FaTimes, label: 'Cancelled' },
      'COMPLETED': { color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: FaCheckCircle, label: 'Completed' }
    };
    return configs[status] || { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', icon: FaClock, label: status };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (slotTime) => {
    if (!slotTime) return '';
    return slotTime;
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Show loading only on initial load when there are no bookings
  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center py-12">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-600 text-sm">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header - Compact */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Compact Search and Filter */}
          <div className="mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar with Clear Icon */}
              <div className="flex-1 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaSearch className="text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg 
                   hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                   transition-all duration-200 outline-none placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 
                     transition-colors p-0.5 rounded"
                    aria-label="Clear search"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter with Icon Inside */}
              <div className="relative w-full sm:w-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                  <FaFilter className="text-xs" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-300 
                   rounded-lg hover:border-slate-400 focus:border-blue-500 focus:ring-2 
                   focus:ring-blue-500/20 transition-all duration-200 appearance-none outline-none"
                >
                  <option value="all">All Bookings</option>
                  <option value="PENDING_DOCS">Pending Documents</option>
                  <option value="DOCS_SUBMITTED">Docs Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active filters indicator */}
            {(search || filter !== 'all') && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-slate-500">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    Search: "{search}"
                    <button
                      onClick={() => setSearch('')}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Remove search filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    Status: {filter.replace('_', ' ')}
                    <button
                      onClick={() => setFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Remove status filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading indicator for refresh */}
        {loading && bookings.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 text-xs font-medium">Updating...</span>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow p-6">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCalendarAlt className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">No bookings found</h3>
            <p className="text-slate-500 text-sm mb-4">
              {bookings.length === 0
                ? "You haven't made any bookings yet."
                : "No bookings match your filters."
              }
            </p>
            {bookings.length === 0 && (
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FaCalendarAlt className="text-xs" />
                Book Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedBookings).map(([date, dateBookings]) => {
              const isExpanded = expandedDates[date] || false; // Default to collapsed (false)
              const bookingCount = dateBookings.length;
              
              return (
                <div key={date} className="space-y-3">
                  {/* Date Header - Like Windows Explorer Folder */}
                  <div 
                    className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => toggleDateExpansion(date)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Folder Icon */}
                        <div className="text-amber-500">
                          {isExpanded ? (
                            <FaFolderOpen className="text-2xl" />
                          ) : (
                            <FaFolder className="text-2xl" />
                          )}
                        </div>
                        
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {formatFullDate(date)}
                          </h2>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-500">
                              {bookingCount} booking{bookingCount !== 1 ? 's' : ''}
                            </p>
                            {dateBookings.some(b => b.status === 'PENDING_DOCS') && (
                              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                                Pending action
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Chevron Indicator */}
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        {isExpanded ? (
                          <FaChevronUp className="text-slate-500 text-sm" />
                        ) : (
                          <FaChevronDown className="text-slate-500 text-sm" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bookings Grid - Cards in Grid Layout */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                          {dateBookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                              <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 overflow-hidden group"
                              >
                                <div className="p-4">
                                  {/* Status Badge */}
                                  <div className="mb-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                      <StatusIcon className="text-xs" />
                                      {statusConfig.label}
                                    </div>
                                  </div>

                                  {/* Service Name */}
                                  <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                                    {booking.service?.name || 'Unknown Service'}
                                  </h3>

                                  {/* Department */}
                                  <div className="mb-3">
                                    <p className="text-sm text-slate-600 line-clamp-1">
                                      {booking.metadata?.departmentName || 'Unknown Department'}
                                    </p>
                                    {booking.service?.serviceCode && (
                                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                                        {booking.service.serviceCode}
                                      </span>
                                    )}
                                  </div>

                                  {/* Time and Token */}
                                  <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                      <FaClock className="text-xs text-slate-400" />
                                      <span>{formatTime(booking.slotTime)}</span>
                                    </div>
                                    
                                    {booking.tokenNumber && (
                                      <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">
                                        Token #{booking.tokenNumber}
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    {TERMINAL_STATUSES.includes(booking.status) ? (
                                      <Link
                                        to={`/bookings/${booking._id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm rounded-lg font-medium transition-colors"
                                      >
                                        <FaInfoCircle className="text-xs" />
                                        View Details
                                      </Link>
                                    ) : ACTIVE_STATUSES.includes(booking.status) ? (
                                      <>
                                        <Link
                                          to={`/bookings/${booking._id}`}
                                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${booking.status === 'PENDING_DOCS' || booking.status === 'UNDER_REVIEW'
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                          }`}
                                        >
                                          <FaFileUpload className="text-xs" />
                                          {booking.status === 'PENDING_DOCS' ? 'Upload Docs' : 'View'}
                                        </Link>

                                        <button
                                          onClick={() => handleCancelClick(booking)}
                                          disabled={cancellingId === booking._id}
                                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-red-600 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                                        >
                                          {cancellingId === booking._id ? (
                                            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <>
                                              <FaTimes className="text-xs" />
                                              Cancel
                                            </>
                                          )}
                                        </button>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModal.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 px-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaExclamationTriangle className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Cancel Booking?</h3>
                      <p className="text-slate-500 text-xs">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Service:</span>
                      <span className="text-sm font-semibold text-slate-900">{cancelModal.serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Date:</span>
                      <span className="text-sm font-semibold text-slate-900">{cancelModal.date}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Time:</span>
                      <span className="text-sm font-semibold text-slate-900">{cancelModal.time}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                      ⚠️ You'll need to book a new appointment.
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={handleCancelClose}
                    disabled={cancellingId === cancelModal.bookingId}
                    className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Keep
                  </button>
                  <button
                    onClick={handleCancelConfirm}
                    disabled={cancellingId === cancelModal.bookingId}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {cancellingId === cancelModal.bookingId ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cancelling
                      </>
                    ) : (
                      'Cancel Booking'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBookings;