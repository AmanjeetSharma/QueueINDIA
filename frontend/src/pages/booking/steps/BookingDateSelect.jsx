import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../../context/BookingContext';
import { 
  FaCalendarAlt, 
  FaCheck, 
  FaTimes,
  FaArrowRight
} from 'react-icons/fa';

const BookingDateSelect = () => {
  const { deptId, serviceId } = useParams();
  const { bookingData, onStepComplete } = useOutletContext();
  const navigate = useNavigate();
  
  const { availableDates, getAvailableDates, loading, error } = useBooking();
  const [selectedDate, setSelectedDate] = useState(bookingData.date);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (deptId) {
      getAvailableDates(deptId);
    }
  }, [deptId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleNext = () => {
    if (!selectedDate) {
      alert('Please select a date to continue');
      return;
    }

    onStepComplete({ date: selectedDate });
    navigate('../time');
  };

  const getDateStatus = (date) => {
    if (!date) return 'unknown';
    
    const today = new Date().toISOString().split('T')[0];
    if (date.date === today) return 'today';
    if (date.isClosed) return 'closed';
    if (date.isPast) return 'past';
    return 'available';
  };

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      month: date.toLocaleDateString('en-IN', { month: 'short' })
    };
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading available dates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load dates</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => getAvailableDates(deptId)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaCalendarAlt className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Appointment Date</h2>
        <p className="text-slate-600">Choose a date from the available options below</p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableDates.map((date, index) => {
          const status = getDateStatus(date);
          const isSelected = selectedDate === date.date;
          const formatted = formatDateDisplay(date.date);
          const isDisabled = status === 'closed' || status === 'past';

          return (
            <motion.button
              key={date.date}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isDisabled && handleDateSelect(date.date)}
              disabled={isDisabled}
              className={`relative p-4 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                  : isDisabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md border border-slate-200'
              }`}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              {/* Today Badge */}
              {status === 'today' && !isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Today
                </div>
              )}

              {/* Selected Check */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center">
                  <FaCheck className="text-xs" />
                </div>
              )}

              {/* Date Display */}
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  isSelected ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatted.day}
                </div>
                <div className={`text-sm font-medium ${
                  isSelected ? 'text-blue-100' : 'text-slate-600'
                }`}>
                  {formatted.weekday}
                </div>
                <div className={`text-xs mt-1 ${
                  isSelected ? 'text-blue-200' : 'text-slate-500'
                }`}>
                  {formatted.month}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-3 pt-3 border-t border-opacity-20">
                {status === 'closed' ? (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Closed
                  </span>
                ) : status === 'today' ? (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Available
                  </span>
                ) : (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Available
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full"></div>
          <span className="text-sm text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
          <span className="text-sm text-slate-600">Unavailable</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200">
        <button
          onClick={() => navigate(`/departments/${deptId}/services/${serviceId}`)}
          className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
        
        <motion.button
          onClick={handleNext}
          disabled={!selectedDate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white shadow-lg ${
            selectedDate
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Next: Choose Time
          <FaArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

export default BookingDateSelect;