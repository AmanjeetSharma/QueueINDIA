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
  FaPrint
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookingSuccess = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { currentBooking } = useBooking();
  const [booking, setBooking] = useState(currentBooking);

  useEffect(() => {
    if (!booking) {
      navigate('/my-bookings');
    }
  }, [booking, navigate]);

  const handleCopyToken = () => {
    if (booking?.tokenNumber) {
      navigator.clipboard.writeText(`Token: ${booking.tokenNumber}`);
      toast.success('Token number copied!', { duration: 2000 });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Your Appointment Details',
        text: `Your appointment is booked for ${booking?.date} at ${booking?.slotTime}. Token: ${booking?.tokenNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { duration: 2000 });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return null;
  }

  const actions = [
    {
      icon: FaFileUpload,
      label: 'Upload Documents',
      description: 'Submit required documents now',
      color: 'blue',
      onClick: () => navigate(`/bookings/${booking._id}`)
    },
    {
      icon: FaList,
      label: 'View All Bookings',
      description: 'Check your appointment history',
      color: 'green',
      onClick: () => navigate('/my-bookings')
    },
    {
      icon: FaHome,
      label: 'Return Home',
      description: 'Go back to homepage',
      color: 'purple',
      onClick: () => navigate('/')
    }
  ];

  const shareOptions = [
    {
      icon: FaCopy,
      label: 'Copy Token',
      onClick: handleCopyToken
    },
    {
      icon: FaShareAlt,
      label: 'Share',
      onClick: handleShare
    },
    {
      icon: FaPrint,
      label: 'Print',
      onClick: handlePrint
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-lg">{booking.tokenNumber}</span>
          </motion.div>
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-slate-600">
            Your appointment has been successfully booked
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full">
            <FaCalendarAlt />
            <span className="font-medium">Token #{booking.tokenNumber} assigned</span>
          </div>
        </div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <span className="text-slate-600">Service</span>
              <span className="font-bold text-slate-900">{booking.service.name}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <div className="text-sm text-slate-600 mb-1">Date</div>
                <div className="font-bold text-slate-900">
                  {new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <div className="text-sm text-slate-600 mb-1">Time Slot</div>
                <div className="font-bold text-slate-900">{booking.slotTime.replace('-', ' - ')}</div>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <div className="text-sm text-slate-600 mb-1">Department</div>
              <div className="font-bold text-slate-900">{booking.metadata.departmentName}</div>
            </div>
            
            {booking.priorityType !== 'NONE' && (
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">Priority applied for - </div>
                <div className="font-bold text-amber-800">
                  {booking.priorityType.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>

          {/* Share Options */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-center gap-3">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.label}
                  onClick={option.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all"
                >
                  <option.icon className="text-slate-600 text-xl" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Document Upload Reminder */}
        {booking.metadata.serviceRequiresDocs && booking.status === 'PENDING_DOCS' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaFileUpload className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Document Upload Required</h3>
                <p className="text-slate-600">Upload required documents to complete your booking</p>
              </div>
            </div>
            
            <motion.button
              onClick={() => navigate(`/bookings/${booking._id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700"
            >
              Upload Documents Now
            </motion.button>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl bg-gradient-to-br from-white to-${action.color}-50 border border-${action.color}-200 text-left transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg flex items-center justify-center`}>
                  <action.icon className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{action.label}</div>
                  <div className="text-sm text-slate-600">{action.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
          <h3 className="font-bold text-slate-900 mb-3">Important Information</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
              <span>Arrive at least 15 minutes before your scheduled time</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
              <span>Bring your token number and valid ID for verification</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
              <span>Check your email for booking confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
              <span>You can cancel or reschedule up to 2 hours before appointment</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;