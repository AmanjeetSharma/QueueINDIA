import { useState } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaCheckCircle, 
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaFileAlt,
  FaArrowLeft,
  FaCheck,
  FaShieldAlt,
  FaInfoCircle
} from 'react-icons/fa';

const BookingConfirmation = () => {
  const { deptId, serviceId } = useParams();
  const { bookingData, onStepBack, onBookingComplete } = useOutletContext();
  const { user } = useAuth();
  const { createBooking, loading: bookingLoading } = useBooking();
  const navigate = useNavigate();
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleConfirm = async () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }

    setIsConfirming(true);
    try {
      const booking = await createBooking(deptId, serviceId, bookingData);
      onBookingComplete(booking);
      navigate('../success');
    } catch (error) {
      // Error is handled in the booking context
    } finally {
      setIsConfirming(false);
    }
  };

  const handleBack = () => {
    onStepBack();
    navigate('../details');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (slotTime) => {
    if (!slotTime) return '';
    const [start, end] = slotTime.split('-');
    return `${start} - ${end}`;
  };

  const getPriorityLabel = (type) => {
    const labels = {
      'NONE': 'Regular Booking',
      'SENIOR_CITIZEN': 'Senior Citizen Priority',
      'PREGNANT_WOMEN': 'Pregnant Women Priority',
      'DIFFERENTLY_ABLED': 'Differently Abled Priority'
    };
    return labels[type] || 'Regular';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Your Booking</h2>
        <p className="text-slate-600">Please review all details before confirming your appointment</p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 p-6 space-y-6">
        {/* User Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FaUserCheck className="text-blue-600" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">Name</div>
              <div className="font-medium text-slate-900">{user?.name}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">Email</div>
              <div className="font-medium text-slate-900">{user?.email}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">Phone</div>
              <div className="font-medium text-slate-900">{user?.phone || 'Not provided'}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">User ID</div>
              <div className="font-medium text-slate-900 text-sm">{user?.userId}</div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Appointment Details
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{formatDate(bookingData.date)}</div>
                    <div className="text-sm text-slate-600">Appointment Date</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{formatTime(bookingData.slotTime)}</div>
                  <div className="text-sm text-slate-600">Time Slot</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${
                  bookingData.priorityType === 'NONE'
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                    : 'bg-gradient-to-br from-amber-100 to-amber-200'
                } rounded-lg flex items-center justify-center`}>
                  <FaClock className={
                    bookingData.priorityType === 'NONE' ? 'text-blue-600' : 'text-amber-600'
                  } />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {getPriorityLabel(bookingData.priorityType)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {bookingData.priorityType === 'NONE' 
                      ? 'Standard queue time applies'
                      : 'Priority access - reduced waiting time'
                    }
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bookingData.priorityType === 'NONE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {bookingData.priorityType === 'NONE' ? 'Regular' : 'Priority'}
                </div>
              </div>
            </div>

            {bookingData.notes && (
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-slate-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900 mb-1">Special Notes</div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap">{bookingData.notes}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3 mb-3">
            <FaShieldAlt className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Arrive 15 minutes before your scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Bring valid government ID for verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Cancellations must be made at least 2 hours in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Documents can be uploaded anytime after booking</span>
                </li>
              </ul>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded mt-0.5"
            />
            <span className="text-sm text-slate-700">
              I agree to the terms and conditions and understand that my slot will be confirmed only after verification.
            </span>
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200">
        <motion.button
          onClick={handleBack}
          disabled={isConfirming || bookingLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft />
          Back to Details
        </motion.button>
        
        <motion.button
          onClick={handleConfirm}
          disabled={!termsAccepted || isConfirming || bookingLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white shadow-lg ${
            termsAccepted && !isConfirming
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed'
          }`}
        >
          {isConfirming || bookingLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirming Booking...
            </>
          ) : (
            <>
              <FaCheck />
              Confirm & Book Now
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BookingConfirmation;