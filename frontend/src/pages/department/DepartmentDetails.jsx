import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartment } from '../../context/DepartmentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaClock, FaArrowLeft, FaPhone, FaEnvelope, FaGlobe,
  FaMapMarkerAlt, FaCalendarAlt, FaWheelchair, FaFemale,
  FaSearch, FaExternalLinkAlt, FaChevronRight, FaUserClock,
  FaFileUpload, FaStar, FaCheckCircle, FaInfoCircle,
  FaTimes, FaPlus, FaFilter, FaUpload, FaFileAlt, FaExclamationTriangle,
  FaShieldAlt
} from 'react-icons/fa';
import { formatAddress, formatTime } from '../../lib/formatters';

const DepartmentDetails = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { currentDepartment, getDepartmentById, loading: deptLoading } = useDepartment();
  const { isAuthenticated, user } = useAuth();

  const [serviceFilters, setServiceFilters] = useState({
    search: '',
    priorityOnly: false,
    requiresDocs: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (deptId) {
      getDepartmentById(deptId);
    }
  }, [deptId]);

  const services = currentDepartment?.services || [];
  const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;
  const priorityCriteria = currentDepartment?.priorityCriteria || {};
  const workingHours = currentDepartment?.workingHours || [];
  const isVerified = user?.isEmailVerified || user?.secondaryEmailVerified || user?.isPhoneVerified;

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = serviceFilters.search === '' ||
      service.name.toLowerCase().includes(serviceFilters.search.toLowerCase()) ||
      service.serviceCode.toLowerCase().includes(serviceFilters.search.toLowerCase());
    const matchesPriority = !serviceFilters.priorityOnly || service.priorityAllowed;
    const matchesDocs = !serviceFilters.requiresDocs || (service.requiredDocs?.length > 0);
    return matchesSearch && matchesPriority && matchesDocs;
  });

  const handleViewDetails = (serviceId) => {
    navigate(`/departments/${deptId}/services/${serviceId}`);
  };

  const handleBookSlot = (serviceId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to book a slot', {
        duration: 4000,
        position: "bottom-left"
      });
      navigate('/login', { state: { returnTo: `/departments/${deptId}` } });
      return;
    }

    // ✅ VERIFICATION CHECK: User must be verified via at least one method
    if (!isVerified) {
      toast.error('Please verify your email or phone number before booking', {
        duration: 6000,
        position: "bottom-left"
      });
      navigate('/profile/verification', {
        state: {
          returnTo: `/departments/${deptId}`,
          message: 'Verification required to book appointments'
        }
      });
      return;
    }

    if (!isSlotBookingEnabled) {
      toast.error('Online booking is not available for this department', {
        duration: 4000,
        position: "bottom-left"
      });
      return;
    }
    navigate(`/departments/${deptId}/services/${serviceId}/book-slot`);
  };

  const clearFilters = () => {
    setServiceFilters({ search: '', priorityOnly: false, requiresDocs: false });
  };

  const activeFiltersCount = (serviceFilters.priorityOnly ? 1 : 0) + (serviceFilters.requiresDocs ? 1 : 0);

  if (deptLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading department details...</p>
        </motion.div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaInfoCircle className="text-4xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Department Not Found</h2>
          <p className="text-slate-600 mb-6">The department you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            <FaArrowLeft /> Back to Departments
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Enhanced Hero Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
          {/* Back Button - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 sm:mb-6 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-sm sm:text-base" />
              <span className="font-medium text-sm sm:text-base">Back to Departments</span>
            </Link>
          </motion.div>

          {/* Department Header Info - Mobile Stacked, Desktop Side-by-side */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                  {currentDepartment.departmentCategory}
                </span>
                <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/90">
                  <FaMapMarkerAlt className="text-xs sm:text-sm" />
                  {currentDepartment.address?.city}, {currentDepartment.address?.state}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
                {currentDepartment.name}
              </h1>

              {currentDepartment.description && (
                <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl line-clamp-2 sm:line-clamp-3">
                  {currentDepartment.description}
                </p>
              )}
            </motion.div>

            {/* Booking Status Badge - Mobile Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:text-right"
            >
              {isSlotBookingEnabled ? (
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-green-500/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-green-400/30">
                  <FaCheckCircle className="text-lg sm:text-xl text-green-300" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm text-green-200 font-medium">Online Booking</div>
                    <div className="text-xs text-green-300">Available Now</div>
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-amber-500/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-amber-400/30">
                  <FaInfoCircle className="text-lg sm:text-xl text-amber-300" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm text-amber-200 font-medium">Walk-in Only</div>
                    <div className="text-xs text-amber-300">Visit in person</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Stats - Mobile Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 lg:mt-8"
          >
            <StatCard
              label="Total Services"
              value={services.length}
              icon={FaCheckCircle}
            />
            <StatCard
              label="Booking Window"
              value={`${currentDepartment.bookingWindowDays || 7} days`}
              icon={FaCalendarAlt}
            />
            <StatCard
              label="Queue Type"
              value={currentDepartment.tokenManagement?.queueType || 'Hybrid'}
              icon={FaUserClock}
              className="col-span-2 lg:col-span-1"
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Services (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Services Header - Mobile Stacked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Available Services</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {(user?.role === 'SUPER_ADMIN' || currentDepartment.admins?.includes(user?._id)) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/departments/${deptId}/services/new`)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base font-medium shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <FaPlus className="text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm">Add Service</span>
                </motion.button>
              )}
            </motion.div>

            {/* Search and Filter Bar - Mobile Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 space-y-3 sm:space-y-4"
            >
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm sm:text-base" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceFilters.search}
                  onChange={(e) => setServiceFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Filter Toggle Button Row - Mobile Compact */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium px-3 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <FaFilter className="text-sm" />
                  <span className="text-sm">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </motion.button>

                {activeFiltersCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="text-xs sm:text-sm text-slate-600 hover:text-red-600 transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-red-50"
                  >
                    Clear all
                  </motion.button>
                )}
              </div>

              {/* Filter Checkboxes - Mobile Compact */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-3 border-t border-slate-200">
                      <label className="inline-flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={serviceFilters.priorityOnly}
                          onChange={(e) => setServiceFilters(prev => ({ ...prev, priorityOnly: e.target.checked }))}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-slate-700">
                          Priority Access Only
                        </span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={serviceFilters.requiresDocs}
                          onChange={(e) => setServiceFilters(prev => ({ ...prev, requiresDocs: e.target.checked }))}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-slate-700">
                          Requires Documents
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Services Grid - Mobile Compact */}
            {filteredServices.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid gap-3 sm:gap-4"
              >
                {filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    index={index}
                    onViewDetails={() => handleViewDetails(service._id)}
                    onBookSlot={(e) => handleBookSlot(service._id, e)}
                    isSlotBookingEnabled={isSlotBookingEnabled}
                    isAuthenticated={isAuthenticated}
                    canBookSlot={isAuthenticated && isSlotBookingEnabled}
                    isVerified={isVerified}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-xl sm:text-2xl lg:text-3xl text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Services Found</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  {services.length === 0
                    ? 'This department has no services yet.'
                    : 'No services match your current filters.'
                  }
                </p>
                {services.length === 0 && (user?.role === 'SUPER_ADMIN' || currentDepartment.admins?.includes(user?._id)) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/departments/${deptId}/services/new`)}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base font-medium shadow-lg w-full sm:w-auto"
                  >
                    <FaPlus /> Add First Service
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column - Department Info (1/3 width) - Mobile Bottom, Desktop Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Information - Mobile Compact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-blue-600 text-sm sm:text-base" />
                </div>
                <span className="text-sm sm:text-base">Contact Information</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {currentDepartment.contact?.phone && (
                  <ContactItem
                    icon={FaPhone}
                    label="Phone"
                    value={currentDepartment.contact.phone}
                    href={`tel:${currentDepartment.contact.phone}`}
                  />
                )}
                {currentDepartment.contact?.email && (
                  <ContactItem
                    icon={FaEnvelope}
                    label="Email"
                    value={currentDepartment.contact.email}
                    href={`mailto:${currentDepartment.contact.email}`}
                  />
                )}
                {currentDepartment.contact?.website && (
                  <ContactItem
                    icon={FaGlobe}
                    label="Website"
                    value="Visit Website"
                    href={currentDepartment.contact.website}
                    external
                  />
                )}
                {currentDepartment.address && (
                  <ContactItem
                    icon={FaMapMarkerAlt}
                    label="Address"
                    value={formatAddress(currentDepartment.address)}
                  />
                )}
              </div>
            </motion.div>

            {/* Working Hours - Mobile Compact */}
            {workingHours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaClock className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <span className="text-sm sm:text-base">Working Hours</span>
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  {workingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 sm:py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-1 sm:px-2 rounded transition-colors"
                    >
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">{schedule.day}</span>
                      {schedule.isClosed ? (
                        <span className="text-xs sm:text-sm text-red-600 font-medium bg-red-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">Closed</span>
                      ) : (
                        <span className="text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          {formatTime(schedule.openTime)} - {formatTime(schedule.closeTime)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Document Upload Info - Mobile Compact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-indigo-100"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <FaUpload className="text-white text-xs sm:text-sm" />
                </div>
                <span className="text-sm sm:text-base">Document Upload</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl hover:bg-white transition-colors">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaCheckCircle className="text-green-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">Upload After Booking</p>
                    <p className="text-xs text-slate-600 mt-0.5">Submit documents anytime after booking</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl hover:bg-white transition-colors">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaFileAlt className="text-blue-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">Early Approval Benefit</p>
                    <p className="text-xs text-slate-600 mt-0.5">Get documents approved before visiting</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Priority Access - Mobile Compact */}
            {Object.keys(priorityCriteria).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-amber-200"
              >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaStar className="text-amber-600 text-sm sm:text-base" />
                  </div>
                  <span className="text-sm sm:text-base">Priority Access</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {priorityCriteria.seniorCitizenAge && (
                    <PriorityItem
                      icon={FaUserClock}
                      title="Senior Citizens"
                      description={`Age ${priorityCriteria.seniorCitizenAge}+ years`}
                    />
                  )}
                  {priorityCriteria.allowPregnantWomen && (
                    <PriorityItem
                      icon={FaFemale}
                      title="Pregnant Women"
                      description="Priority Access"
                    />
                  )}
                  {priorityCriteria.allowDifferentlyAbled && (
                    <PriorityItem
                      icon={FaWheelchair}
                      title="Differently Abled"
                      description="Priority Access"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component - Mobile Compact
const StatCard = ({ label, value, icon: Icon, className = '' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-white/20 hover:border-white/30 transition-all ${className}`}
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="text-base sm:text-lg lg:text-xl text-white" />
      </div>
      <div>
        <div className="text-white/80 text-xs sm:text-sm">{label}</div>
        <div className="text-white text-base sm:text-lg lg:text-xl font-bold">{value}</div>
      </div>
    </div>
  </motion.div>
);

// Enhanced Service Card Component - Mobile Compact
const ServiceCard = ({ service, index, onViewDetails, onBookSlot, isSlotBookingEnabled, isAuthenticated, canBookSlot, isVerified }) => {
  const requiredDocsCount = service.requiredDocs?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden"
    >
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header - Mobile Compact */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-3 mb-1.5 sm:mb-2">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm font-semibold">
                {service.serviceCode}
              </span>
              {service.priorityAllowed && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 rounded text-xs sm:text-sm font-semibold flex items-center gap-1">
                  <FaStar className="text-xs" />
                  <span className="text-xs sm:text-sm">Priority</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 line-clamp-1">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Description - Mobile Compact */}
        <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-2">
          {service.description || 'No description available for this service.'}
        </p>

        {/* Service Info Tags - Mobile Compact */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {requiredDocsCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded text-xs sm:text-sm">
              <FaFileUpload className="text-xs" />
              <span>{requiredDocsCount} required document{requiredDocsCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Document Upload Info Banner - Mobile Compact */}
        {requiredDocsCount > 0 && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <FaUpload className="mt-0.5 flex-shrink-0 text-xs" />
              <span className="font-medium">
                Upload documents after booking for faster processing.
              </span>
            </p>
          </div>
        )}

        {/* Verification Warning - Show if authenticated but not verified */}
        {isAuthenticated && !isVerified && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 flex items-center gap-1.5">
              <FaExclamationTriangle className="text-amber-600 text-xs" />
              <span className="font-medium">Verify account to book appointments</span>
            </p>
          </div>
        )}

        {/* Action Buttons - Mobile Stacked, Desktop Horizontal */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookSlot}
            disabled={!canBookSlot || (isAuthenticated && !isVerified)}
            className={`py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 ${canBookSlot && isVerified
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {canBookSlot && isVerified ? (
              <>
                <FaCalendarAlt className="text-xs sm:text-sm" />
                <span>Book Appointment</span>
              </>
            ) : !isAuthenticated ? (
              'Login to Book'
            ) : !isVerified ? (
              'Verification Required'
            ) : (
              'Walk-in Only'
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="py-2.5 sm:py-3 px-4 border-2 border-slate-200 rounded-lg sm:rounded-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all font-semibold text-xs sm:text-sm text-slate-700 shadow hover:shadow-md flex items-center justify-center gap-2"
          >
            <span>Details</span>
            <FaChevronRight className="text-xs" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Contact Item Component - Mobile Compact
const ContactItem = ({ icon: Icon, label, value, href, external }) => (
  <div className="flex items-start gap-2 sm:gap-3 group hover:bg-slate-50 p-1.5 sm:p-2 rounded-lg transition-colors">
    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="text-slate-600 text-xs sm:text-sm" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 break-all hover:underline"
        >
          {value}
          {external && <FaExternalLinkAlt className="text-xs flex-shrink-0" />}
        </a>
      ) : (
        <div className="text-xs sm:text-sm text-slate-700 break-words">{value}</div>
      )}
    </div>
  </div>
);

// Priority Item Component - Mobile Compact
const PriorityItem = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg sm:rounded-xl hover:bg-white transition-all"
  >
    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="text-amber-600 text-sm" />
    </div>
    <div className="flex-1">
      <div className="text-xs sm:text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-xs text-slate-600 mt-0.5">{description}</div>
    </div>
  </motion.div>
);

export default DepartmentDetails;