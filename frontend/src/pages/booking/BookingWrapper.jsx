import { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useService } from '../../context/ServiceContext';
import { useBooking } from '../../context/BookingContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserEdit, 
  FaCheckCircle, 
  FaFileAlt, 
  FaArrowLeft, 
  FaHome,
  FaCheck,
  FaInfoCircle
} from 'react-icons/fa';

const BookingWrapper = () => {
  const { deptId, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: null,
    slotTime: null,
    priorityType: 'NONE',
    notes: ''
  });
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const { currentService, getServiceById } = useService();
  const { clearError } = useBooking();

  useEffect(() => {
    if (deptId && serviceId) {
      getServiceById(deptId, serviceId);
      clearError();
    }
    
    // Reset step based on current path
    const path = location.pathname.split('/').pop();
    const stepMap = {
      'date': 1,
      'time': 2,
      'details': 3,
      'confirm': 4
    };
    if (stepMap[path]) {
      setStep(stepMap[path]);
    }
  }, [deptId, serviceId, location.pathname]);

  const steps = [
    { number: 1, title: 'Select Date', icon: FaCalendarAlt, path: 'date' },
    { number: 2, title: 'Choose Time', icon: FaClock, path: 'time' },
    { number: 3, title: 'Add Details', icon: FaUserEdit, path: 'details' },
    { number: 4, title: 'Confirm', icon: FaCheckCircle, path: 'confirm' },
  ];

  const handleStepComplete = (stepData) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
    const nextStep = step + 1;
    if (nextStep <= steps.length) {
      setStep(nextStep);
      navigate(steps[nextStep - 1].path);
    }
  };

  const handleStepBack = () => {
    const prevStep = step - 1;
    if (prevStep >= 1) {
      setStep(prevStep);
      navigate(steps[prevStep - 1].path);
    }
  };

  const handleBookingComplete = (bookingId) => {
    // Prevent multiple navigations
    if (isNavigatingAway) return;
    
    setIsNavigatingAway(true);
    
    // Clear booking data immediately
    setBookingData({
      date: null,
      slotTime: null,
      priorityType: 'NONE',
      notes: ''
    });
    setStep(1);
    
    // Navigate to external success page with replace to prevent going back
    navigate(`/booking-success/${bookingId}`, { replace: true });
  };

  // Disable all navigation if we're navigating away
  const isNavigationDisabled = isNavigatingAway;

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-600 font-medium"
        >
          Loading service details...
        </motion.div>
      </div>
    );
  }

  const progressPercentage = (step / steps.length) * 100;
  const hasSelectedDetails = bookingData.date || bookingData.slotTime;
  const isPrioritySelected = bookingData.priorityType !== 'NONE';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isNavigationDisabled) return;
                navigate(`/departments/${deptId}/services/${serviceId}`);
              }}
              disabled={isNavigationDisabled}
              className={`flex items-center gap-2 text-sm font-medium ${
                isNavigationDisabled 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <FaArrowLeft className="text-xs" />
              Back
            </button>
            <div className="w-px h-4 bg-slate-300"></div>
            <button
              onClick={() => {
                if (isNavigationDisabled) return;
                navigate('/');
              }}
              disabled={isNavigationDisabled}
              className={`flex items-center gap-2 text-sm font-medium ${
                isNavigationDisabled 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <FaHome className="text-xs" />
              Home
            </button>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Book Appointment</h1>
          <div className="w-16"></div>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentService.name}</h2>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {currentService.serviceCode}
            </span>
            {currentService.priorityAllowed && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Priority Available
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Step {step} of {steps.length}
                </span>
                <span className="text-xs text-slate-500">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {steps.map((stepItem) => {
                const isActive = stepItem.number === step;
                const isCompleted = stepItem.number < step;
                const Icon = stepItem.icon;

                return (
                  <button
                    key={stepItem.number}
                    onClick={() => {
                      if (isNavigationDisabled) return;
                      if (stepItem.number <= step) {
                        setStep(stepItem.number);
                        navigate(stepItem.path);
                      }
                    }}
                    disabled={stepItem.number > step || isNavigationDisabled}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                        : isCompleted
                        ? 'bg-white border border-blue-200 text-blue-700 hover:border-blue-300'
                        : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Icon className={`text-sm ${isActive ? 'scale-110' : ''}`} />
                    <span className="text-xs font-medium mt-2 text-center">
                      {stepItem.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Form Area */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow border border-slate-200 p-6 min-h-80"
            >
              <Outlet context={{
                bookingData,
                currentService,
                onStepComplete: handleStepComplete,
                onStepBack: handleStepBack,
                onBookingComplete: handleBookingComplete,
                step,
                isNavigationDisabled
              }} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Service Summary */}
            <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Service Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Service</p>
                  <p className="text-sm font-medium text-slate-900">{currentService.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Service Code</p>
                  <p className="text-sm font-semibold text-blue-600">{currentService.serviceCode}</p>
                </div>
              </div>
            </div>

            {/* Selected Details */}
            <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Selected Details</h3>
              <div className="space-y-2.5">
                <AnimatePresence>
                  {bookingData.date && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FaCalendarAlt className="text-blue-600 text-xs" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(bookingData.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                      <FaCheck className="text-blue-400 text-xs" />
                    </motion.div>
                  )}

                  {bookingData.slotTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FaClock className="text-blue-600 text-xs" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Time</p>
                        <p className="text-sm font-medium text-slate-900">
                          {bookingData.slotTime.replace('-', ' - ')}
                        </p>
                      </div>
                      <FaCheck className="text-blue-400 text-xs" />
                    </motion.div>
                  )}

                  {isPrioritySelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-2.5 bg-amber-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                        <FaCheckCircle className="text-amber-600 text-xs" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Priority</p>
                        <p className="text-sm font-medium text-amber-700">
                          {bookingData.priorityType.replace('_', ' ')}
                        </p>
                      </div>
                      <FaCheck className="text-amber-400 text-xs" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!hasSelectedDetails && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaInfoCircle className="text-blue-500 text-sm" />
                    </div>
                    <p className="text-xs text-slate-600">
                      Select date and time to see details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Info */}
            {currentService.isDocumentUploadRequired && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <FaFileAlt className="text-blue-600 text-xs" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">Document Upload</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Documents can be uploaded anytime after booking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWrapper;