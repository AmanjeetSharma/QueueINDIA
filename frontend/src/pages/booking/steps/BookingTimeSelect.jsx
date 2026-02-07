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

  const [isNavigating, setIsNavigating] = useState(false);

  const { availableSlots, getAvailableSlots, loading, error, checkSlotAvailability } = useBooking();
  const [selectedSlot, setSelectedSlot] = useState(bookingData.slotTime);
  const [timeFilter, setTimeFilter] = useState('all');

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
      alert('Please select a time slot to proceed.');
      return;
    };

    setIsNavigating(true);

    setTimeout(() => {
      onStepComplete({ slotTime: selectedSlot });
      navigate('../details');
      setIsNavigating(false);
    }, 750);
  }

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
      <div className="py-8 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-600 text-sm">Loading available slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaTimes className="text-red-600 text-xl" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Unable to load time slots</h3>
        <p className="text-slate-600 text-sm mb-3">{error}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>
          <button
            onClick={() => getAvailableSlots(deptId, serviceId, bookingData.date)}
            className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredSlots = filterSlots(availableSlots);

  return (
    <div className="space-y-4">
      {/* Top Navigation with Next Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Choose Your Time</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {bookingData.date && (
              <span>
                {new Date(bookingData.date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            )}
          </p>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={!selectedSlot || isNavigating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-white text-sm ${selectedSlot && !isNavigating
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
        >
          {isNavigating ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </>
          ) : (
            <>
              Next: Choose time
              <FaArrowRight className="text-xs" />
            </>
          )}
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FaClock className="text-white text-sm" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Available Time Slots</h3>
              <p className="text-slate-600 text-xs">Select a convenient time for your appointment</p>
            </div>
          </div>
        </div>

        {/* Time Filters */}
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-700 mb-2">Filter by time</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${timeFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {filter === 'all' ? 'All Times' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots Grid */}
        {filteredSlots.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUserClock className="text-slate-400 text-lg" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No slots available</h3>
            <p className="text-slate-600 text-xs mb-4 max-w-xs mx-auto">
              {timeFilter !== 'all'
                ? 'No time slots available for this time period.'
                : 'No available slots for the selected date.'
              }
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
            >
              <FaArrowLeft className="text-xs" />
              Back to Dates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredSlots.map((slot, index) => {
              const availability = getSlotAvailability(slot);
              const isSelected = selectedSlot === slot.time;
              const isAvailable = checkSlotAvailability(slot);

              return (
                <button
                  key={slot.time}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!isAvailable}
                  className={`relative p-2.5 rounded-lg transition-all ${isSelected
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white scale-105'
                    : !isAvailable
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-300'
                    }`}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center border border-blue-600">
                      <FaCheck className="text-[8px]" />
                    </div>
                  )}

                  {/* Slot Time */}
                  <div className="text-center">
                    <div className={`text-sm font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-slate-900'
                      }`}>
                      {formatTimeDisplay(slot.start)}
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                      to {formatTimeDisplay(slot.end)}
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="mt-1.5 pt-1.5 border-t border-opacity-20">
                    <div className="text-center">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${!isAvailable
                        ? 'text-red-600 bg-red-50'
                        : availability === 'limited'
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-green-600 bg-green-50'
                        }`}>
                        {!isAvailable ? 'Booked' : availability === 'limited' ? 'Limited' : 'Open'}
                      </span>
                      {isAvailable && (
                        <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-blue-200' : 'text-slate-500'
                          }`}>
                          {slot.remaining} slots
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mt-4">
          <p className="text-xs font-medium text-slate-700 mb-2">Status Legend</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-slate-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center pt-4 border-t border-slate-200">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
        >
          <FaArrowLeft className="text-xs" />
          Back to Dates
        </button>
      </div>
    </div>
  );
};

export default BookingTimeSelect;