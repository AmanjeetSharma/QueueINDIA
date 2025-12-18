import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
  FaFileUpload,
  FaEye,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const UserBookings = () => {
  const { bookings, getUserBookings, loading, cancelBooking } = useBooking();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    getUserBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filter !== 'all' && booking.status !== filter) return false;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        booking.service.name.toLowerCase().includes(searchLower) ||
        booking.metadata.departmentName.toLowerCase().includes(searchLower) ||
        booking.tokenNumber?.toString().includes(search) ||
        booking._id.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'PENDING_DOCS': { color: 'amber', icon: FaFileUpload, label: 'Pending Documents' },
      'DOCS_SUBMITTED': { color: 'blue', icon: FaHourglassHalf, label: 'Docs Submitted' },
      'UNDER_REVIEW': { color: 'purple', icon: FaHourglassHalf, label: 'Under Review' },
      'APPROVED': { color: 'green', icon: FaCheckCircle, label: 'Approved' },
      'REJECTED': { color: 'red', icon: FaTimes, label: 'Rejected' },
      'CANCELLED': { color: 'gray', icon: FaTimes, label: 'Cancelled' },
      'COMPLETED': { color: 'emerald', icon: FaCheckCircle, label: 'Completed' }
    };
    return configs[status] || { color: 'gray', icon: FaClock, label: status };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (slotTime) => {
    if (!slotTime) return '';
    const [start, end] = slotTime.split('-');
    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">View and manage all your appointments</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by service, department, or token..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-slate-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING_DOCS">Pending Documents</option>
                <option value="DOCS_SUBMITTED">Docs Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-600 mb-4">
              {bookings.length === 0 
                ? "You haven't made any bookings yet."
                : "No bookings match your current filters."
              }
            </p>
            {bookings.length === 0 && (
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <FaCalendarAlt />
                Book an Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking, index) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700 flex items-center gap-1.5`}>
                            <StatusIcon className="text-sm" />
                            {statusConfig.label}
                          </div>
                          {booking.tokenNumber && (
                            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg text-sm font-medium">
                              Token #{booking.tokenNumber}
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {booking.service.name}
                          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded ml-2">
                            {booking.service.serviceCode}
                          </span>
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock />
                            <span>{formatTime(booking.slotTime)}</span>
                          </div>
                          <div>
                            <span className="text-slate-900 font-medium">
                              {booking.metadata.departmentName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                        >
                          <FaEye />
                          View Details
                        </Link>
                        
                        {booking.status === 'PENDING_DOCS' && booking.metadata.serviceRequiresDocs && (
                          <Link
                            to={`/bookings/${booking._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
                          >
                            <FaFileUpload />
                            Upload Docs
                          </Link>
                        )}
                        
                        {['PENDING_DOCS', 'DOCS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <FaTimes />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;