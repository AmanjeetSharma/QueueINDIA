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
      // Create booking and get the booking ID
      const bookingResponse = await createBooking(deptId, serviceId, bookingData);

      // Get the booking ID from the response
      // Adjust this based on your actual API response structure
      const bookingId = bookingResponse.data?._id || bookingResponse._id;

      if (!bookingId) {
        throw new Error('Booking ID not received from server');
      }

      // Pass the booking ID to the wrapper for external success page navigation
      onBookingComplete(bookingId);

      // Note: Navigation is now handled by the wrapper
      // Do NOT navigate here anymore
    } catch (error) {
      // Error is handled in the booking context
      console.error('Booking failed:', error);
      // You might want to show a specific error message here
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
      weekday: 'short',
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

  const getPriorityLabel = (type) => {
    const labels = {
      'NONE': 'Regular Booking',
      'SENIOR_CITIZEN': 'Senior Citizen',
      'PREGNANT_WOMEN': 'Pregnant Women',
      'DIFFERENTLY_ABLED': 'Differently Abled'
    };
    return labels[type] || 'Regular';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <FaCheckCircle className="text-green-600 text-xl" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Confirm Your Booking</h2>
        <p className="text-slate-600 text-xs">Please review all details before confirming</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        {/* User Information */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <FaUserCheck className="text-blue-600 text-xs" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 truncate">Name</div>
              <div className="text-sm font-medium text-slate-900 truncate">{user?.name || '-'}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 truncate">Email</div>
              <div className="text-sm font-medium text-slate-900 truncate">{user?.email || '-'}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 truncate">Phone</div>
              <div className="text-sm font-medium text-slate-900 truncate">{user?.phone || 'Not provided'}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 truncate">Date of Birth</div>
              <div className="text-sm font-medium text-slate-900 truncate">
                {user?.dob
                  ? new Date(user.dob).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                  : 'Not provided'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600 text-xs" />
            Appointment Details
          </h3>
          <div className="space-y-2">
            {/* Date and Time */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600 text-xs" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{formatDate(bookingData.date)}</div>
                    <div className="text-xs text-slate-500">Date</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{formatTime(bookingData.slotTime)}</div>
                  <div className="text-xs text-slate-500">Time</div>
                </div>
              </div>
            </div>

            {/* Priority Type */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${bookingData.priorityType === 'NONE' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                    <FaClock className={
                      bookingData.priorityType === 'NONE' ? 'text-blue-600' : 'text-amber-600'
                    } />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {getPriorityLabel(bookingData.priorityType)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {bookingData.priorityType === 'NONE'
                        ? 'Standard queue'
                        : 'Priority access'
                      }
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${bookingData.priorityType === 'NONE'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
                  }`}>
                  {bookingData.priorityType === 'NONE' ? 'Regular' : 'Priority'}
                </span>
              </div>
            </div>

            {/* Notes - with proper text wrapping */}
            {bookingData.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-slate-500 text-xs mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-900 mb-1">Special Notes</div>
                    <div className="text-xs text-slate-700 whitespace-pre-wrap break-words">
                      {bookingData.notes}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-3">
          <div className="flex items-start gap-2 mb-2">
            <FaShieldAlt className="text-amber-600 text-xs mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Terms & Conditions</h4>
              <ul className="text-xs text-slate-700 space-y-1">
                <li className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="break-words">Arrive 15 minutes before your scheduled time</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="break-words">Bring valid government ID for verification</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="break-words">Cancellations must be made at least 2 hours in advance</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="break-words">Documents can be uploaded anytime after booking</span>
                </li>
              </ul>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded mt-0.5 flex-shrink-0"
            />
            <span className="text-xs text-slate-700 break-words">
              I agree to the terms and conditions and understand that my slot will be confirmed only after verification.
            </span>
          </label>
        </div>
      </div>

      {/* Navigation - Confirm button at bottom */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handleBack}
          disabled={isConfirming || bookingLoading}
          className="inline-flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
        >
          <FaArrowLeft className="text-xs" />
          Back to Details
        </button>

        <motion.button
          onClick={handleConfirm}
          disabled={!termsAccepted || isConfirming || bookingLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-white text-sm ${termsAccepted && !isConfirming
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
        >
          {isConfirming || bookingLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirming...
            </>
          ) : (
            <>
              <FaCheck className="text-xs" />
              Confirm Booking
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BookingConfirmation;