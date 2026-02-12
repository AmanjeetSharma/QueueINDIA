import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Users,
  ArrowRight,
  Loader,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Zap,
  ArrowLeft,
  CalendarDays
} from 'lucide-react';
import { MdOutlineElectricalServices } from "react-icons/md";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QueueListServices = () => {
  const navigate = useNavigate();
  const { departmentId: paramDeptId } = useParams();
  const { user } = useAuth();
  const { departmentServices = [], getDepartmentServicesForQueue, loading, error } = useQueue();

  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const deptId = paramDeptId || user?.departmentId;
        if (deptId) {
          await getDepartmentServicesForQueue(deptId);
        }
        setPageLoaded(true);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setLocalError(err.message);
        setPageLoaded(true);
      }
    };

    fetchServices();
  }, [paramDeptId, user?.departmentId, getDepartmentServicesForQueue]);

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day === null) return;

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${date}`;

    setSelectedDate(dateString);
    setShowCalendar(false);
    toast.success('Date selected', { duration: 1000, position: 'top-center' });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleManageQueue = (service) => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    const deptId = paramDeptId || user?.departmentId;
    navigate(`/department/queue-management/${deptId}/${service._id}?date=${selectedDate}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isTomorrow = selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Loading state
  if (loading && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if ((error || localError) && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to load services</h3>
          <p className="text-slate-300 mb-6">{error || localError || 'An error occurred'}</p>
          <button
            onClick={() => {
              setPageLoaded(false);
              getDepartmentServicesForQueue(paramDeptId || user?.departmentId);
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header - Compact */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/90 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Queue Management
                </h1>
                <p className="text-xs text-slate-400 mt-1">Select service and date</p>
              </div>
            </div>

            {/* Mobile Calendar Toggle */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="sm:hidden p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Date Badge */}

        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar - Hidden on mobile unless toggled */}
            <div className={`${showCalendar ? 'block' : 'hidden'} sm:block lg:w-80 ${showCalendar ? 'fixed inset-4 sm:relative sm:inset-auto z-50 bg-slate-800 p-4 rounded-xl border border-slate-700' : ''}`}>
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                {/* Calendar Header */}
                <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
                  <h2 className="font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Select Date
                  </h2>
                </div>

                {/* Calendar */}
                <div className="p-4">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold text-slate-200 text-center">
                      {monthName}
                    </h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-slate-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const isSelected = day && selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isTodayDate = day && new Date().toISOString().split('T')[0] === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          disabled={!day}
                          className={`aspect-square rounded text-sm transition-colors ${!day
                            ? 'bg-transparent cursor-default'
                            : isSelected
                              ? 'bg-blue-600 text-white'
                              : isTodayDate
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Date Buttons */}
                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setSelectedDate(today);
                        setShowCalendar(false);
                        toast.success('Set to today', { duration: 1000, position: 'top-center' });
                      }}
                      className="w-full px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded text-sm transition-colors"
                    >
                      📅 Today
                    </button>
                    <button
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowStr = tomorrow.toISOString().split('T')[0];
                        setSelectedDate(tomorrowStr);
                        setShowCalendar(false);
                        toast.success('Set to tomorrow', { duration: 1000, position: 'top-center' });
                      }}
                      className="w-full px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded text-sm transition-colors"
                    >
                      ➡️ Tomorrow
                    </button>
                  </div>

                  {/* Close button for mobile */}
                  {showCalendar && (
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                      Close Calendar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="flex-1">
              {/* Services Header */}
              <div className="mb-6">
                {/* Combined Header with Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <MdOutlineElectricalServices className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white">Available Services</h1>
                      {selectedDate ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-blue-300">
                            <CalendarDays className="w-3 h-3" />
                            <span>{formatDateShort(selectedDate)}</span>
                            {(isToday || isTomorrow) && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/30 rounded-full ml-2">
                                {isToday ? 'Today' : 'Tomorrow'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Select a date to begin</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Alert for Missing Date */}
                {!selectedDate && (
                  <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <p className="text-sm text-amber-300">
                        <span className="font-medium">Select a date</span> to manage service queues
                      </p>
                    </div>
                  </div>
                )}

                {/* Services Counter */}
                {selectedDate && (
                  <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-800/20 rounded-lg px-3 py-2">
                    <span>{departmentServices.length} services available</span>
                    <span className="text-xs">✓ Date selected</span>
                  </div>
                )}
              </div>

              {/* Services Grid */}
              {departmentServices.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-300 mb-2">No Services Found</h3>
                  <p className="text-slate-500">No services configured for this department.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentServices.map((service, index) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl overflow-hidden transition-all h-full flex flex-col hover:shadow-lg">
                        {/* Card Header */}
                        <div className="p-4 border-b border-slate-700">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 truncate">{service.serviceCode}</p>
                            </div>

                            {service.priorityAllowed && (
                              <div className="flex-shrink-0">
                                <div className="px-2 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 rounded-full flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  Priority
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-1">
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <div className={`w-2 h-2 rounded-full ${service.isDocumentUploadRequired ? 'bg-green-500' : 'bg-slate-500'}`} />
                              <span>
                                Docs: <span className={service.isDocumentUploadRequired ? 'text-green-300 font-medium' : 'text-slate-500'}>
                                  {service.isDocumentUploadRequired ? 'Required' : 'Optional'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 pt-0">
                          <button
                            onClick={() => handleManageQueue(service)}
                            disabled={!selectedDate}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${selectedDate
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                              }`}
                          >
                            {selectedDate ? (
                              <>
                                <span>Manage Queue</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            ) : (
                              <span>Select Date</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer Info */}
              {selectedDate && departmentServices.length > 0 && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>
                      Managing queue for <span className="text-blue-300 font-medium">{formatDateShort(selectedDate)}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueueListServices;