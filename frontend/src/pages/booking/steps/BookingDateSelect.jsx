import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../../context/BookingContext';
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import dayjs from 'dayjs';

const BookingDateSelect = () => {
  const { deptId, serviceId } = useParams();
  const { bookingData, onStepComplete } = useOutletContext();
  const navigate = useNavigate();

  const { availableDates, getAvailableDates, loading, error } = useBooking();
  const [selectedDate, setSelectedDate] = useState(bookingData.date);
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [isNavigating, setIsNavigating] = useState(false);


  useEffect(() => {
    if (deptId) {
      getAvailableDates(deptId);
    }
  }, [deptId]);

  // Create a map of available dates for quick lookup
  const availableDatesMap = availableDates.reduce((acc, date) => {
    acc[date.date] = date;
    return acc;
  }, {});

  const handleDateSelect = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    if (availableDatesMap[dateStr] && !availableDatesMap[dateStr].isClosed && !availableDatesMap[dateStr].isPast) {
      setSelectedDate(dateStr);
    }
  };

  const handleNext = () => {
    if (!selectedDate) {
      alert('Please select a date to continue');
      return;
    }

    setIsNavigating(true);

    // Add 2-second delay before navigating
    setTimeout(() => {
      onStepComplete({ date: selectedDate });
      navigate('../time');
      setIsNavigating(false);
    }, 750);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      const newDate = dayjs().year(currentYear).month(currentMonth).subtract(1, 'month');
      setCurrentMonth(newDate.month());
      setCurrentYear(newDate.year());
    } else {
      const newDate = dayjs().year(currentYear).month(currentMonth).add(1, 'month');
      setCurrentMonth(newDate.month());
      setCurrentYear(newDate.year());
    }
  };

  // Generate days for current month view
  const generateCalendarDays = () => {
    const startOfMonth = dayjs().year(currentYear).month(currentMonth).startOf('month');
    const endOfMonth = dayjs().year(currentYear).month(currentMonth).endOf('month');
    const days = [];

    // Add empty cells for days before month start
    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= endOfMonth.date(); i++) {
      const date = dayjs().year(currentYear).month(currentMonth).date(i);
      days.push(date);
    }

    return days;
  };

  const getDateStatus = (date) => {
    if (!date) return 'empty';

    const dateStr = date.format('YYYY-MM-DD');
    const dateData = availableDatesMap[dateStr];

    if (!dateData) return 'unavailable';
    if (dateData.isClosed) return 'closed';
    if (dateData.isPast) return 'past';
    return 'available';
  };

  const isToday = (date) => {
    return date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
  };

  const isSelected = (date) => {
    return date.format('YYYY-MM-DD') === selectedDate;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-600 text-sm">Loading available dates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaTimes className="text-red-600 text-xl" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Unable to load dates</h3>
        <p className="text-slate-600 text-sm mb-3">{error}</p>
        <button
          onClick={() => getAvailableDates(deptId)}
          className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navigation moved to top */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate(`/departments/${deptId}/services/${serviceId}`)}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>

        <motion.button
          onClick={handleNext}
          disabled={!selectedDate || isNavigating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-white text-sm ${selectedDate && !isNavigating
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
              Next: Choose Time
              <FaArrowRight className="text-xs" />
            </>
          )}
        </motion.button>
      </div>

      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <FaCalendarAlt className="text-blue-600 text-xl" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Select Appointment Date</h2>
        <p className="text-slate-600 text-sm">Choose a date from the available calendar</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FaChevronLeft className="text-slate-600 text-sm" />
          </button>

          <h3 className="font-semibold text-slate-900">
            {dayjs().month(currentMonth).format('MMMM')} {currentYear}
          </h3>

          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FaChevronRight className="text-slate-600 text-sm" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 px-2 pt-3">
          {weekdays.map((day) => (
            <div key={day} className="text-center">
              <span className="text-xs font-medium text-slate-500">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 p-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-9"></div>;
            }

            const status = getDateStatus(date);
            const dateStr = date.format('YYYY-MM-DD');
            const today = isToday(date);
            const selected = isSelected(date);
            const isAvailable = status === 'available';
            const isDisabled = status === 'closed' || status === 'past' || status === 'unavailable';
            const day = date.date();

            return (
              <div key={dateStr} className="p-1">
                <motion.button
                  onClick={() => handleDateSelect(date)}
                  disabled={isDisabled}
                  className={`w-full h-9 rounded-lg flex flex-col items-center justify-center relative transition-all
                    ${selected
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white scale-105'
                      : today && !selected
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : isAvailable
                          ? 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm border border-slate-200'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  whileHover={isAvailable && !selected ? { scale: 1.05 } : {}}
                  whileTap={isAvailable && !selected ? { scale: 0.95 } : {}}
                >
                  {/* Day Number */}
                  <span className={`text-sm font-medium ${selected ? 'text-white' : ''}`}>
                    {day}
                  </span>

                  {/* Today Indicator */}
                  {today && !selected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}

                  {/* Selected Indicator */}
                  {selected && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
                      <FaCheck className="text-blue-600 text-xs" />
                    </div>
                  )}

                  {/* Status Dot */}
                  {!selected && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isAvailable ? 'bg-blue-400' :
                      status === 'closed' ? 'bg-red-400' :
                        status === 'past' ? 'bg-slate-400' : 'bg-transparent'
                      }`}></div>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {selectedDate && availableDatesMap[selectedDate] && (
          <div className="px-4 py-3 border-t border-slate-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Selected Date</p>
                <p className="font-medium text-slate-900">
                  {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
                </p>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium">
                Available
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-xs text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-slate-600">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-slate-600">Closed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <span className="text-xs text-slate-600">Past/Unavailable</span>
        </div>
      </div>

      {/* Quick Date Selection */}
      {availableDates.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-slate-600 mb-2 text-center">Quick select available dates:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableDates
              .filter(date => date.isAvailable && !date.isPast && !date.isClosed)
              .slice(0, 5)
              .map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDate === date.date
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {dayjs(date.date).format('MMM D')}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDateSelect;