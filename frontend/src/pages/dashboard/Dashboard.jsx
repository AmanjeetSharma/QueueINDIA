import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaBuilding,
  FaArrowRight,
  FaInfoCircle,
  FaHourglassHalf,
  FaFileUpload,
  FaTimes,
  FaShieldAlt,
  FaStar
} from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";

const STATUS_CONFIG = {
  PENDING_DOCS: { label: 'Pending Docs', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  DOCS_SUBMITTED: { label: 'Docs Submitted', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  UNDER_REVIEW: { label: 'Under Review', bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  APPROVED: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  COMPLETED: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  REJECTED: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
};

const ACTION_CARDS = [
  { title: 'My Profile', sub: 'Account settings', icon: FaUser, link: '/profile', gradient: 'from-gray-800 to-slate-600' },
  { title: 'My Bookings', sub: 'View all records', icon: FaCalendarAlt, link: '/my-bookings', gradient: 'from-blue-700 to-blue-500' },
  { title: 'Book Service', sub: 'New appointment', icon: FaStar, link: '/departments', gradient: 'from-orange-500 to-amber-500' },
  { title: 'How It Works', sub: 'Quick guide', icon: FaInfoCircle, link: '/how-things-work', gradient: 'from-green-600 to-emerald-500' },
];

/* ── Status Chip ── */
function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CANCELLED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, accent, icon: Icon, className = '' }) {
  const accentColors = {
    '#1A1F36': 'text-gray-900',
    '#667eea': 'text-indigo-500',
    '#48BB78': 'text-green-500',
    '#ED8936': 'text-orange-500'
  };

  return (
    <div className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
          {label}
        </p>
        <Icon className={`text-xl opacity-80 flex-shrink-0 ${accentColors[accent]}`} />
      </div>
      <p className={`text-3xl font-bold ${accentColors[accent]}`}>
        {value}
      </p>
    </div>
  );
}

/* ── Main Dashboard ── */
const Dashboard = () => {
  const { user } = useAuth();
  const { bookings, getUserBookings, loading } = useBooking();
  const [stats, setStats] = useState({ totalBookings: 0, pending: 0, completed: 0, upcoming: 0 });
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  // Fetch bookings once
  useEffect(() => {
    const fetch = async () => {
      if (isFetching.current || hasFetched.current) return;
      isFetching.current = true;
      try {
        await getUserBookings();
        hasFetched.current = true;
      } catch (e) {
        console.error(e);
      } finally {
        isFetching.current = false;
      }
    };
    fetch();
  }, [getUserBookings]);

  // Calculate stats
  useEffect(() => {
    if (!bookings.length) {
      setStats({ totalBookings: 0, pending: 0, completed: 0, upcoming: 0 });
      return;
    }
    const UPCOMING = ['PENDING_DOCS', 'DOCS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED'];
    setStats({
      totalBookings: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING_DOCS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      upcoming: bookings.filter(b => UPCOMING.includes(b.status)).length,
    });
  }, [bookings]);

  // Memoized values
  const recentBookings = useMemo(() =>
    [...bookings].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 3),
    [bookings]
  );

  const closestUpcoming = useMemo(() => {
    const UPCOMING = ['PENDING_DOCS', 'DOCS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED'];
    const now = new Date();
    return [...bookings]
      .filter(b => UPCOMING.includes(b.status))
      .map(b => ({ ...b, dt: new Date(`${b.date}T${b.slotTime?.split('-')[0] || '00:00'}`) }))
      .filter(b => b.dt > now)
      .sort((a, b) => a.dt - b.dt)[0] || null;
  }, [bookings]);

  // Utility functions
  const formatDate = useCallback((d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  const formatTime = useCallback((slotTime) => {
    if (!slotTime) return '—';
    return slotTime;
  }, []);

  const getDaysUntil = useCallback((d) => {
    if (!d) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(d); target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1) return `In ${diff} days`;
    return 'Past';
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col w-full overflow-x-hidden">
      {/* ── Vibrant Purple to Blue Gradient Header ── */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center hover:border-white/50 transition-colors flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <FaUser className="text-white text-xl" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-lg truncate">
                  Welcome back, {firstName} 👋
                </p>
                <p className="text-white/80 text-xs mt-0.5 truncate">
                  {stats.upcoming > 0
                    ? `${stats.upcoming} active appointment${stats.upcoming !== 1 ? 's' : ''}`
                    : 'Ready to book your next service?'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 flex-shrink-0">
              <AiFillDashboard className="text-white text-sm" />
              <span className="font-mono text-xs font-semibold text-white tracking-wider hidden sm:inline">DASHBOARD</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content Area ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">

          {/* ── Stats Row with Tinted Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 w-full">
            <StatCard
              label="Total"
              value={stats.totalBookings}
              accent="#1A1F36"
              icon={FaCalendarAlt}
              className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:from-slate-100 hover:to-slate-200/50 w-full"
            />
            <StatCard
              label="Upcoming"
              value={stats.upcoming}
              accent="#667eea"
              icon={FaClock}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200/50 w-full"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              accent="#48BB78"
              icon={FaCheckCircle}
              className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 hover:from-green-100 hover:to-green-200/50 w-full"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              accent="#ED8936"
              icon={FaHourglassHalf}
              className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 hover:from-orange-100 hover:to-orange-200/50 w-full"
            />
          </div>

          {/* ── Quick Actions ── */}
          <div className="mb-8 w-full">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 pl-1">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
              {ACTION_CARDS.map((card) => (
                <Link
                  key={card.link}
                  to={card.link}
                  className={`block bg-gradient-to-br ${card.gradient} rounded-xl p-4 sm:p-5 text-white shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 w-full`}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <card.icon className="text-xl sm:text-2xl text-white/90" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaArrowRight className="text-white text-xs" />
                    </div>
                  </div>
                  <p className="font-bold text-sm sm:text-base mb-1 truncate">{card.title}</p>
                  <p className="text-xs text-white/80 truncate">{card.sub}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Two Column Layout ── */}
          <div className="grid lg:grid-cols-3 gap-6 w-full">
            {/* Left Column - Recent Bookings (spans 2 columns) */}
            <div className="lg:col-span-2 w-full">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm sm:text-base">Recent Bookings</p>
                  <Link to="/my-bookings" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-500 hover:text-indigo-600 flex-shrink-0">
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>

                {loading && recentBookings.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Loading your bookings...</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="py-12 px-4 sm:px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                      <FaCalendarAlt className="text-indigo-500 text-2xl" />
                    </div>
                    <p className="font-semibold text-gray-900 mb-2">No bookings yet</p>
                    <p className="text-sm text-gray-400 mb-4">Start by booking your first appointment</p>
                    <Link
                      to="/departments"
                      className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-colors"
                    >
                      <FaCalendarAlt className="text-xs" /> Book Appointment
                    </Link>
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors hover:pl-6 sm:hover:pl-8 w-full">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="text-indigo-500 text-base sm:text-lg" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
                          {booking.service?.name || 'Unknown Service'}
                        </p>
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-3 flex-wrap">
                          <span className="text-xs text-gray-500 truncate max-w-[150px] xs:max-w-none">
                            {booking.metadata?.departmentName || '—'}
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {formatDate(booking.date)} • {formatTime(booking.slotTime)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <StatusChip status={booking.status} />
                        <Link to={`/bookings/${booking._id}`} className="text-gray-400 hover:text-indigo-500 transition-colors">
                          <FaArrowRight className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Next Up */}
            <div className="lg:col-span-1 w-full">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden w-full">
                <div className={`h-1 ${closestUpcoming ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-200'}`} />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4">
                    {closestUpcoming ? 'Next Appointment' : 'No Upcoming'}
                  </p>

                  {closestUpcoming ? (
                    <>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {closestUpcoming.service?.name || 'Appointment'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-5">
                        {closestUpcoming.metadata?.departmentName}
                      </p>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5">
                        {[
                          { icon: FaCalendarAlt, top: formatDate(closestUpcoming.date), sub: getDaysUntil(closestUpcoming.date) },
                          { icon: FaClock, top: formatTime(closestUpcoming.slotTime), sub: 'Time slot' },
                        ].map((item, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <item.icon className="text-indigo-500 text-xs" />
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                {i === 0 ? 'Date' : 'Time'}
                              </span>
                            </div>
                            <p className="font-mono font-semibold text-xs sm:text-sm text-gray-900 break-words">{item.top}</p>
                            {item.sub && <p className="text-[10px] text-indigo-500 font-semibold mt-1">{item.sub}</p>}
                          </div>
                        ))}
                      </div>

                      {closestUpcoming.tokenNumber && (
                        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 mb-5">
                          <p className="text-xs text-indigo-500 mb-1">Token Number</p>
                          <p className="font-mono font-bold text-base sm:text-lg text-indigo-600 break-all">
                            #{closestUpcoming.tokenNumber}
                          </p>
                        </div>
                      )}

                      <div className="mb-5">
                        <StatusChip status={closestUpcoming.status} />
                      </div>

                      <Link
                        to={`/bookings/${closestUpcoming._id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full text-sm transition-colors"
                      >
                        View Details <FaArrowRight className="text-xs" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
                        Ready to book your next service? Browse departments and schedule your appointment today.
                      </p>
                      <Link
                        to="/departments"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full text-sm transition-colors"
                      >
                        Book Now <FaArrowRight className="text-xs" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="text-center mt-10 pt-6 border-t border-gray-100 w-full">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2 flex-wrap px-2">
              <FaShieldAlt className="text-indigo-400 text-xs flex-shrink-0" />
              <span className="truncate">Secure public service portal · By using this service, you agree to our</span>
              <Link to="/terms-of-service" className="text-indigo-500 hover:text-indigo-600 font-medium whitespace-nowrap">Terms</Link>
              <span>&</span>
              <Link to="/privacy-policy" className="text-indigo-500 hover:text-indigo-600 font-medium whitespace-nowrap">Privacy Policy</Link>
              <span>· © 2024 QueueINDIA</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;