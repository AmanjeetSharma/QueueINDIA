import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaWhatsapp,
  FaCalendarAlt,
  FaClock,
  FaHome,
  FaList,
  FaMapMarkerAlt,
  FaUser,
  FaBell,
  FaFileUpload,
  FaIdCard,
  FaEnvelope
} from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import Confetti from 'react-confetti';

const BookingSuccess = ({ bookingData }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Use actual booking data passed as props
  const userBooking = bookingData || {
    name: 'User Name',
    date: new Date().toISOString(),
    timeSlot: 'Time Slot',
    service: 'Service Name',
    department: 'Department',
    location: 'Location',
    bookingId: 'N/A'
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);

  const formattedDate = new Date(userBooking.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleShare = () => {
    const message = `✅ I've booked an appointment for ${userBooking.service}!\n📅 Date: ${formattedDate}\n⏰ Time: ${userBooking.timeSlot}\n📍 Location: ${userBooking.location}\n\nCheck out this service for your needs.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const importantNotes = [
    {
      icon: FaBell,
      title: 'Arrive Early',
      description: 'Please arrive 15 minutes before your appointment time',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaFileUpload,
      title: 'Upload Documents',
      description: 'Upload required documents for faster processing',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: FaIdCard,
      title: 'Bring ID Proof',
      description: 'Carry original ID proof and appointment confirmation',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: FaEnvelope,
      title: 'Check Email',
      description: 'Check your email for confirmation and updates',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const quickActions = [
    {
      icon: FaHome,
      label: 'Home',
      onClick: () => navigate('/')
    },
    {
      icon: FaList,
      label: 'My Bookings',
      onClick: () => navigate('/my-bookings')
    },
    {
      icon: FaWhatsapp,
      label: 'Share',
      onClick: handleShare
    }
  ];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={70}
          gravity={0.15}
          initialVelocityY={1}
          colors={[
            '#ef4444',
            '#0ea5e9',
            '#f59e0b',
            '#10b981',
            '#8b5cf6',
            '#ec4899',
            '#059669'
          ]}
          drawShape={ctx => {
            const size = 3 + Math.random() * 5;
            const shapeType = Math.random();

            ctx.beginPath();

            if (shapeType < 0.5) {
              ctx.arc(0, 0, size, 0, 2 * Math.PI);
            } else if (shapeType < 0.8) {
              ctx.rect(-size, -size, size * 2, size * 2);
            } else {
              ctx.moveTo(0, -size);
              ctx.lineTo(size * 0.8, size * 0.6);
              ctx.lineTo(-size * 0.8, size * 0.6);
              ctx.closePath();
            }

            ctx.fill();
          }}
        />
      )}

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />

      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden"
          >
            {/* Header - Compact */}
            <div className="p-4 sm:p-6 text-center border-b border-slate-100/50">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                className="inline-block mb-3"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <GiPartyPopper className="text-white text-2xl" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 border-2 border-emerald-400/50 border-t-transparent rounded-full"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-slate-900 mb-1"
              >
                Booking Confirmed!
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-sm"
              >
                Kindly upload the necessary documents to avoid any delays in processing your appointment.
              </motion.p>
            </div>

            {/* Compact Details */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3 mb-6">
                {/* Service */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100"
                >
                  <div className="font-bold text-slate-900 text-lg">{userBooking.service}</div>
                  <div className="text-slate-600 text-sm">{userBooking.department}</div>
                  {userBooking.bookingId && (
                    <div className="text-xs text-slate-500 mt-1">
                      Booking ID: <span className="font-mono font-semibold">{userBooking.bookingId}</span>
                    </div>
                  )}
                </motion.div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FaCalendarAlt, label: 'Date', value: formattedDate, color: 'emerald' },
                    { icon: FaClock, label: 'Time', value: userBooking.timeSlot, color: 'emerald' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className={`text-${item.color}-600 text-sm`} />
                        <div className="text-xs font-medium text-slate-700">{item.label}</div>
                      </div>
                      <div className="font-bold text-slate-900">{item.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Location & Name */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FaMapMarkerAlt, label: 'Location', value: userBooking.location, color: 'blue' },
                    { icon: FaUser, label: 'Name', value: userBooking.name, color: 'purple' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className={`text-${item.color}-600 text-sm`} />
                        <div className="text-xs font-medium text-slate-700">{item.label}</div>
                      </div>
                      <div className="text-sm font-medium text-slate-900 truncate">{item.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="mb-6">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"
                >
                  <FaCheckCircle className="text-emerald-500" />
                  Important Notes
                </motion.h3>
                <div className="grid grid-cols-2 gap-3">
                  {importantNotes.map((note, index) => (
                    <motion.div
                      key={note.title}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 1.1 + index * 0.1,
                        type: 'spring',
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className={`bg-gradient-to-br ${note.color} text-white rounded-xl p-3 shadow-md`}
                    >
                      <div className="flex items-start gap-2">
                        <note.icon className="text-white text-sm mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold mb-0.5">{note.title}</div>
                          <div className="text-xs opacity-90 leading-tight">{note.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.onClick}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 1.5 + index * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${index === quickActions.length - 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                  >
                    <action.icon className={index === quickActions.length - 1 ? "text-lg" : "text-sm"} />
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="p-4 border-t border-slate-100/50 bg-slate-50/50"
            >
              <p className="text-xs text-slate-600 text-center">
                Confirmation email sent • Contact support if you have questions
              </p>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-slate-500">
              You can upload documents or cancel your booking from 'My Bookings' section
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Default props as fallback (useful during development/testing)
BookingSuccess.defaultProps = {
  bookingData: null
};

export default BookingSuccess;