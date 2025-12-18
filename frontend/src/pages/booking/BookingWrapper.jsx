import { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartment } from '../../context/DepartmentContext';
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
  FaChevronRight,
  FaInfoCircle
} from 'react-icons/fa';

const BookingWrapper = () => {
  const { deptId, serviceId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: null,
    slotTime: null,
    priorityType: 'NONE',
    notes: ''
  });
  const { currentDepartment } = useDepartment();
  const { currentService, getServiceById } = useService();
  const { clearError } = useBooking();

  useEffect(() => {
    if (deptId && serviceId) {
      getServiceById(deptId, serviceId);
      clearError();
    }
  }, [deptId, serviceId]);

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

  const handleBookingComplete = (finalData) => {
    setBookingData(prev => ({ ...prev, ...finalData }));
    navigate('success');
  };

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-600 text-lg font-medium"
        >
          Loading service details...
        </motion.div>
      </div>
    );
  }

  const progressPercentage = (step / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/departments/${deptId}/services/${serviceId}`)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              <span className="font-medium">Back to Service</span>
            </motion.button>
            <div className="w-px h-6 bg-slate-300"></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FaHome className="text-sm" />
              <span className="font-medium">Home</span>
            </motion.button>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Book Appointment</h1>
          <div className="w-24"></div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{currentService.name}</h2>
          <p className="text-slate-600 flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {currentService.serviceCode}
            </span>
            <span>•</span>
            <span>{currentDepartment?.name}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-semibold text-slate-700">
                  Step {step} of {steps.length}
                </span>
                <span className="text-sm text-slate-500">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  layoutId="progress"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </motion.div>

            {/* Step Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-4 gap-4 mb-12"
            >
              {steps.map((stepItem, idx) => {
                const isActive = stepItem.number === step;
                const isCompleted = stepItem.number < step;
                const Icon = stepItem.icon;

                return (
                  <motion.button
                    key={stepItem.number}
                    onClick={() => {
                      if (stepItem.number <= step) {
                        setStep(stepItem.number);
                        navigate(stepItem.path);
                      }
                    }}
                    disabled={stepItem.number > step}
                    whileHover={stepItem.number < step ? { scale: 1.02 } : {}}
                    whileTap={stepItem.number < step ? { scale: 0.98 } : {}}
                    className={`relative p-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-white border-2 border-blue-200 text-blue-700 hover:border-blue-300 hover:shadow-md'
                        : 'bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`text-lg transition-transform ${
                        isActive ? 'text-white scale-110' : isCompleted ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        <Icon />
                      </div>
                      <span className={`text-xs font-semibold text-center ${
                        isActive ? 'text-white' : isCompleted ? 'text-blue-700' : 'text-slate-500'
                      }`}>
                        {stepItem.title}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Main Form Area */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 min-h-96"
            >
              <Outlet context={{
                bookingData,
                currentService,
                currentDepartment,
                onStepComplete: handleStepComplete,
                onStepBack: handleStepBack,
                onBookingComplete: handleBookingComplete,
                step
              }} />
            </motion.div>
          </div>

          {/* Right Column - Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Service Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
                  <span>Service Summary</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Service</p>
                    <p className="text-slate-900 font-semibold">{currentService.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Service Code</p>
                    <p className="text-blue-600 font-mono text-sm font-bold">{currentService.serviceCode}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Department</p>
                    <p className="text-slate-700">{currentDepartment?.name}</p>
                  </div>
                  {currentService.priorityAllowed && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg"
                    >
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        Priority Service Available
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Selected Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
                  <span>Selected Details</span>
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {bookingData.date ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Date</p>
                            <p className="text-slate-900 font-semibold">
                              {new Date(bookingData.date).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                        <FaChevronRight className="text-blue-400 text-xs" />
                      </motion.div>
                    ) : null}

                    {bookingData.slotTime ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FaClock className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Time Slot</p>
                            <p className="text-slate-900 font-semibold">
                              {bookingData.slotTime.replace('-', ' - ')}
                            </p>
                          </div>
                        </div>
                        <FaChevronRight className="text-blue-400 text-xs" />
                      </motion.div>
                    ) : null}

                    {bookingData.priorityType !== 'NONE' ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                            <FaCheckCircle className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Priority</p>
                            <p className="text-amber-700 font-semibold">
                              {bookingData.priorityType.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <FaChevronRight className="text-amber-400 text-xs" />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {!bookingData.date && !bookingData.slotTime && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-300 text-center"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaInfoCircle className="text-blue-500 text-xl" />
                      </div>
                      <p className="text-sm text-slate-600">
                        Select date and time to see details
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Document Info Card */}
              {currentService.isDocumentUploadRequired && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-white text-sm" />
                    </div>
                    <span>Document Upload</span>
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Documents can be uploaded anytime after booking your appointment.
                  </p>
                  {currentService.requiredDocs?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-2">
                        Required Documents
                      </p>
                      {currentService.requiredDocs.slice(0, 3).map((doc, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 p-2 bg-white/60 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <span className="text-sm text-slate-800">{doc.name}</span>
                          {doc.isMandatory && (
                            <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded font-medium">
                              Required
                            </span>
                          )}
                        </motion.div>
                      ))}
                      {currentService.requiredDocs.length > 3 && (
                        <p className="text-sm text-slate-600 mt-3 pl-3">
                          + {currentService.requiredDocs.length - 3} more documents
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingWrapper;