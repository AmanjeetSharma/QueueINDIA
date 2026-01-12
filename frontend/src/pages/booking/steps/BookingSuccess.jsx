import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../../context/BookingContext';
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaFileUpload,
  FaHome,
  FaList,
  FaShareAlt,
  FaCopy,
  FaWhatsapp,
  FaPrint,
  FaBell,
  FaMapMarkerAlt,
  FaClock,
  FaIdCard,
  FaExclamationTriangle,
  FaEnvelope,
  FaStar,
  FaGift,
  FaUserCheck
} from 'react-icons/fa';
import { GiPartyPopper, GiTrophy } from 'react-icons/gi';
import { MdCelebration, MdLocalOffer } from 'react-icons/md';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getBookingById } = useBooking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      navigate('/my-bookings');
    }

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(confettiTimer);
    };
  }, [bookingId, navigate]);

  const handleCopyToken = () => {
    if (booking?.tokenNumber) {
      navigator.clipboard.writeText(`Token #${booking.tokenNumber}`);
      toast.success('Token number copied!', {
        position: 'top-center',
        duration: 2000,
        icon: '📋'
      });
    }
  };

  const handleShareWhatsApp = () => {
    const message = `✅ Appointment Booked!\n\n📅 Date: ${new Date(booking.date).toLocaleDateString()}\n⏰ Time: ${booking.slotTime.replace('-', ' - ')}\n🎫 Token: #${booking.tokenNumber}\n🏢 Service: ${booking.service.name}\n\nView details: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSetReminder = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const appointmentTime = new Date(`${booking.date}T${booking.slotTime.split('-')[0]}`);
      const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // 1 hour before

      const notification = new Notification('Appointment Reminder Set!', {
        body: `Reminder set for 1 hour before your appointment at ${booking.slotTime.split('-')[0]}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      toast.success('Reminder set successfully!', {
        icon: '⏰',
        duration: 3000
      });
    } else {
      toast('Please enable notifications to set reminders', {
        icon: '🔔'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
            </div>
          </div>
          <p className="text-emerald-700 font-medium">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    {
      icon: FaClock,
      label: 'Estimated Time',
      value: `${booking.estimatedServiceTime} min`,
      color: 'blue'
    },
    {
      icon: FaUserCheck,
      label: 'Priority Type',
      value: booking.priorityType !== 'NONE' ? booking.priorityType.replace('_', ' ') : 'Regular',
      color: 'amber'
    },
    {
      icon: FaStar,
      label: 'Token Number',
      value: `#${booking.tokenNumber}`,
      color: 'emerald'
    }
  ];

  const quickActions = [
    {
      icon: FaFileUpload,
      label: 'Upload Documents',
      description: 'Submit required documents',
      color: 'blue',
      onClick: () => navigate(`/bookings/${booking._id}`),
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FaBell,
      label: 'Set Reminder',
      description: 'Get notified before appointment',
      color: 'purple',
      onClick: handleSetReminder,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: FaList,
      label: 'My Bookings',
      description: 'View all appointments',
      color: 'green',
      onClick: () => navigate('/my-bookings'),
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: FaHome,
      label: 'Home',
      description: 'Return to homepage',
      color: 'gray',
      onClick: () => navigate('/'),
      gradient: 'from-slate-500 to-slate-700'
    }
  ];

  const shareOptions = [
    {
      icon: FaCopy,
      label: 'Copy Token',
      onClick: handleCopyToken,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FaWhatsapp,
      label: 'Share on WhatsApp',
      onClick: handleShareWhatsApp,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FaShareAlt,
      label: 'Share Link',
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied!', { icon: '🔗' });
      },
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: FaPrint,
      label: 'Print Details',
      onClick: handlePrint,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
          colors={['#10b981', '#059669', '#047857', '#065f46', '#0d9488']}
        />
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Celebration Header */}
            <div className="text-center relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center mb-6"
              >
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                    <GiTrophy className="text-white text-5xl" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full"
                  ></motion.div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <GiPartyPopper className="text-white text-2xl" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <GiPartyPopper className="text-white text-xl" />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-3">
                Booking Confirmed! <span className="inline-block animate-bounce">🎉</span>
              </h1>
              <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
                Your appointment has been successfully scheduled. Get ready for your visit!
              </p>

              {/* Token Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="inline-flex items-center gap-3 mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg"
              >
                <FaCalendarAlt className="text-xl" />
                <div>
                  <div className="text-sm font-medium opacity-90">Your Token Number</div>
                  <div className="text-2xl font-bold tracking-wider">#{booking.tokenNumber}</div>
                </div>
                <button
                  onClick={handleCopyToken}
                  className="ml-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <FaCopy className="text-sm" />
                </button>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`text-${stat.color}-600 text-xl`} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                      <div className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Appointment Details</h2>
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Confirmed
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Service Row */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <MdCelebration className="text-white text-2xl" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Service Booked</div>
                        <div className="text-xl font-bold text-slate-900">{booking.service.name}</div>
                        <div className="text-blue-600 font-medium">{booking.service.serviceCode}</div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FaCalendarAlt className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Appointment Date</div>
                          <div className="text-lg font-bold text-emerald-900">{formattedDate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <FaClock className="text-teal-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Time Slot</div>
                          <div className="text-lg font-bold text-teal-900">{booking.slotTime.replace('-', ' - ')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department & Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                          <FaMapMarkerAlt className="text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Department</div>
                          <div className="font-bold text-slate-900">{booking.metadata.departmentName}</div>
                        </div>
                      </div>
                    </div>

                    {booking.priorityType !== 'NONE' && (
                      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FaUserCheck className="text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm text-amber-700">Priority Service</div>
                            <div className="font-bold text-amber-800">
                              {booking.priorityType.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Share & Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Share Options */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Share Your Booking</h3>
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option, index) => (
                    <motion.button
                      key={option.label}
                      onClick={option.onClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`flex items-center justify-center gap-3 p-4 rounded-xl ${option.color} hover:shadow-md transition-all`}
                    >
                      <option.icon className="text-xl" />
                      <span className="font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Document Upload Reminder */}
              {booking.metadata.serviceRequiresDocs && booking.status === 'PENDING_DOCS' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaFileUpload className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Documents Required</h3>
                      <p className="text-slate-600">Upload required documents to complete your booking process</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-3"
                  >
                    <FaFileUpload />
                    Upload Documents Now
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`bg-gradient-to-br ${action.gradient} text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <action.icon className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-1">{action.label}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-amber-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FaExclamationTriangle className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">Important Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 font-bold">1</span>
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 mb-1">Arrival Time</div>
                      <p className="text-amber-700 text-sm">Arrive at least 15 minutes before your scheduled time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 mb-1">Required Documents</div>
                      <p className="text-amber-700 text-sm">Bring your token number and valid ID for verification</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 mb-1">Email Confirmation</div>
                      <p className="text-amber-700 text-sm">Check your email for booking confirmation details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 font-bold">4</span>
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 mb-1">Cancellation Policy</div>
                      <p className="text-amber-700 text-sm">You can cancel or reschedule up to 2 hours before appointment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-300">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-amber-600 text-xl" />
                  <div>
                    <div className="font-bold text-amber-900">Need Help?</div>
                    <p className="text-amber-700 text-sm">Contact support at {booking.department?.contact?.email || 'support@example.com'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
      `}</style>
    </>
  );
};

export default BookingSuccess;