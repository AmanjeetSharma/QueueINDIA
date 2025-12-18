import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../../context/BookingContext';
import { 
  FaClock, 
  FaCheck, 
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaUserClock
} from 'react-icons/fa';

const BookingTimeSelect = () => {
  const { deptId, serviceId } = useParams();
  const { bookingData, onStepComplete, onStepBack } = useOutletContext();
  const navigate = useNavigate();
  
  const { availableSlots, getAvailableSlots, loading, error, checkSlotAvailability } = useBooking();
  const [selectedSlot, setSelectedSlot] = useState(bookingData.slotTime);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'

  useEffect(() => {
    if (deptId && serviceId && bookingData.date) {
      getAvailableSlots(deptId, serviceId, bookingData.date);
    }
  }, [deptId, serviceId, bookingData.date]);

  const handleSlotSelect = (slot) => {
    if (checkSlotAvailability(slot)) {
      setSelectedSlot(slot.time);
    }
  };

  const handleNext = () => {
    if (!selectedSlot) {
      alert('Please select a time slot to continue');
      return;
    }

    onStepComplete({ slotTime: selectedSlot });
    navigate('../details');
  };

  const handleBack = () => {
    onStepBack();
    navigate('../date');
  };

  const formatTimeDisplay = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const filterSlots = (slots) => {
    if (timeFilter === 'all') return slots;
    
    return slots.filter(slot => {
      const hour = parseInt(slot.start.split(':')[0]);
      
      switch (timeFilter) {
        case 'morning':
          return hour >= 6 && hour < 12;
        case 'afternoon':
          return hour >= 12 && hour < 17;
        case 'evening':
          return hour >= 17 && hour < 21;
        default:
          return true;
      }
    });
  };

  const getSlotAvailability = (slot) => {
    if (!slot.available) return 'full';
    if (slot.remaining <= 3) return 'limited';
    return 'available';
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading available time slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load time slots</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft />
            Back to Dates
          </button>
          <button
            onClick={() => getAvailableSlots(deptId, serviceId, bookingData.date)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredSlots = filterSlots(availableSlots);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaClock className="text-purple-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Time Slot</h2>
        <p className="text-slate-600">
          {bookingData.date && (
            <span className="font-medium text-blue-600">
              {new Date(bookingData.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          )}
        </p>
      </div>

      {/* Time Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              timeFilter === filter
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter === 'all' ? 'All Times' : filter}
          </button>
        ))}
      </div>

      {/* Time Slots Grid */}
      {filteredSlots.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserClock className="text-slate-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No slots available</h3>
          <p className="text-slate-600 mb-4">
            {timeFilter !== 'all' 
              ? 'No slots available for this time period. Try another filter.'
              : 'No available slots for the selected date. Please choose another date.'
            }
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft />
            Back to Dates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSlots.map((slot, index) => {
            const availability = getSlotAvailability(slot);
            const isSelected = selectedSlot === slot.time;
            const isAvailable = checkSlotAvailability(slot);

            return (
              <motion.button
                key={slot.time}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSlotSelect(slot)}
                disabled={!isAvailable}
                className={`relative p-4 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                    : !isAvailable
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md border border-slate-200'
                }`}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
              >
                {/* Selected Check */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center">
                    <FaCheck className="text-xs" />
                  </div>
                )}

                {/* Slot Time */}
                <div className="text-center mb-3">
                  <div className={`text-xl font-bold mb-1 ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatTimeDisplay(slot.start)}
                  </div>
                  <div className={`text-sm ${
                    isSelected ? 'text-blue-100' : 'text-slate-600'
                  }`}>
                    to {formatTimeDisplay(slot.end)}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mt-2 pt-2 border-t border-opacity-20">
                  {!isAvailable ? (
                    <div className="text-center">
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Fully Booked
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`text-xs font-medium ${
                          availability === 'limited'
                            ? 'text-amber-600 bg-amber-50 px-2 py-1 rounded-full'
                            : 'text-green-600 bg-green-50 px-2 py-1 rounded-full'
                        }`}>
                          {availability === 'limited' ? 'Limited' : 'Available'}
                        </span>
                      </div>
                      <div className={`text-xs ${
                        isSelected ? 'text-blue-200' : 'text-slate-500'
                      }`}>
                        {slot.remaining} left
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full"></div>
          <span className="text-sm text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Full</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          <FaArrowLeft />
          Back to Dates
        </motion.button>
        
        <motion.button
          onClick={handleNext}
          disabled={!selectedSlot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white shadow-lg ${
            selectedSlot
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Next: Add Details
          <FaArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

export default BookingTimeSelect;