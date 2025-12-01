import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDepartment } from '../../context/DepartmentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaClock,
  FaArrowLeft,
  FaCog,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdCard,
  FaPercentage,
  FaCalendarAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaStar,
  FaBuilding,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaWheelchair,
  FaFemale,
  FaSearch,
  FaFilter,
  FaExternalLinkAlt,
  FaChevronRight
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

  useEffect(() => {
    if (deptId) {
      getDepartmentById(deptId);
    }
  }, [deptId]);

  const services = currentDepartment?.services || [];
  const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;
  const priorityCriteria = currentDepartment?.priorityCriteria || {};
  const workingHours = currentDepartment?.workingHours || [];

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = serviceFilters.search === '' ||
      service.name.toLowerCase().includes(serviceFilters.search.toLowerCase()) ||
      service.serviceCode.toLowerCase().includes(serviceFilters.search.toLowerCase());

    const matchesPriority = !serviceFilters.priorityOnly || service.priorityAllowed;
    const matchesDocs = !serviceFilters.requiresDocs || service.isDocumentUploadRequired;

    return matchesSearch && matchesPriority && matchesDocs;
  });

  const handleServiceClick = (serviceId) => {
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

    if (!isSlotBookingEnabled) {
      toast.error('Online booking is not available for this department', {
        duration: 4000,
        position: "bottom-left"
      });
      return;
    }

    navigate(`/departments/${deptId}/services/${serviceId}/book-slot`);
  };

  if (deptLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Department Not Found</h2>
          <p className="text-slate-600 mb-6">The department you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium shadow-md"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-700/30 mb-4"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Departments</span>
              </Link>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{currentDepartment.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {currentDepartment.departmentCategory}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {currentDepartment.address?.city}, {currentDepartment.address?.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isSlotBookingEnabled
                ? 'bg-emerald-500/20 backdrop-blur-sm text-emerald-100'
                : 'bg-slate-500/20 backdrop-blur-sm text-slate-200'
                }`}>
                {isSlotBookingEnabled ? (
                  <>
                    <FaCalendarCheck className="w-4 h-4" />
                    <span className="font-medium">Online Booking</span>
                  </>
                ) : (
                  <>
                    <FaCalendarTimes className="w-4 h-4" />
                    <span className="font-medium">Walk-in Only</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 transform hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Services</p>
                <p className="text-2xl font-bold text-slate-900">{services.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 transform hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <FaStar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Booking Window</p>
                <p className="text-2xl font-bold text-slate-900">{currentDepartment.bookingWindowDays || 7} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 transform hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Queue Type</p>
                <p className="text-2xl font-bold text-slate-900">{currentDepartment.tokenManagement?.queueType || 'Hybrid'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services */}
          <div className="lg:col-span-2">
            {/* Services Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Available Services</h2>
                  {/* <p className="text-slate-600">
                    {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                  </p> */}
                </div>

                {(user?.role === 'SUPER_ADMIN' || currentDepartment.admins?.includes(user?._id)) && (
                  <button
                    onClick={() => navigate(`/departments/${deptId}/services/new`)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                  >
                    <FaCog className="w-4 h-4" />
                    Add Service
                  </button>
                )}
              </div>

              {/* Services Filter Bar */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={serviceFilters.search}
                      onChange={(e) => setServiceFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={serviceFilters.priorityOnly}
                        onChange={(e) => setServiceFilters(prev => ({ ...prev, priorityOnly: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Priority Only</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={serviceFilters.requiresDocs}
                        onChange={(e) => setServiceFilters(prev => ({ ...prev, requiresDocs: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Requires Docs</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map((service, index) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      index={index}
                      onClick={() => handleServiceClick(service._id)}
                      onBookSlot={handleBookSlot}
                      isSlotBookingEnabled={isSlotBookingEnabled}
                      isAuthenticated={isAuthenticated}
                      canBookSlot={isAuthenticated && isSlotBookingEnabled}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-300">
                  <FaCog className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Services Found</h3>
                  <p className="text-slate-600 max-w-sm mx-auto mb-4">
                    {services.length === 0
                      ? 'This department has no services yet.'
                      : 'No services match your current filters.'}
                  </p>
                  {services.length === 0 && (user?.role === 'SUPER_ADMIN' || currentDepartment.admins?.includes(user?._id)) && (
                    <button
                      onClick={() => navigate(`/departments/${deptId}/services/new`)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                    >
                      <FaCog className="w-4 h-4" />
                      Add First Service
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Department Info */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>

              <div className="space-y-4">
                {currentDepartment.contact?.phone && (
                  <InfoItem icon={FaPhone} label="Phone" value={currentDepartment.contact.phone} />
                )}
                {currentDepartment.contact?.email && (
                  <InfoItem icon={FaEnvelope} label="Email" value={currentDepartment.contact.email} />
                )}
                {currentDepartment.contact?.website && (
                  <InfoItem
                    icon={FaGlobe}
                    label="Website"
                    value={
                      <a
                        href={currentDepartment.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                      >
                        Visit <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    }
                  />
                )}
                {currentDepartment.address && (
                  <InfoItem
                    icon={FaMapMarkerAlt}
                    label="Address"
                    value={formatAddress(currentDepartment.address)}
                  />
                )}
              </div>
            </motion.div>

            {/* Working Hours Card */}
            {workingHours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaClock className="w-5 h-5 text-blue-600" />
                  Working Hours
                </h3>

                <div className="space-y-2">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-slate-700 text-sm">{schedule.day}</span>
                      {schedule.isClosed ? (
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">Closed</span>
                      ) : (
                        <span className="text-slate-600 text-sm font-medium">
                          {formatTime(schedule.openTime)} - {formatTime(schedule.closeTime)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Priority Access Card */}
            {Object.keys(priorityCriteria).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-blue-600" />
                  Priority Access
                </h3>

                <div className="space-y-3">
                  {priorityCriteria.seniorCitizenAge && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FaHourglassHalf className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Senior Citizens</p>
                        <p className="text-sm text-slate-600">Age {priorityCriteria.seniorCitizenAge}+ years</p>
                      </div>
                    </div>
                  )}

                  {priorityCriteria.allowPregnantWomen && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaFemale className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Pregnant Women</p>
                        <p className="text-sm text-emerald-600 font-medium">Priority Access</p>
                      </div>
                    </div>
                  )}

                  {priorityCriteria.allowDifferentlyAbled && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FaWheelchair className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Differently Abled</p>
                        <p className="text-sm text-emerald-600 font-medium">Priority Access</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Simplified Service Card Component
const ServiceCard = ({ service, index, onClick, onBookSlot, isSlotBookingEnabled, isAuthenticated, canBookSlot }) => {
  const requiredDocsCount = service.requiredDocs?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col">
        {/* Header with Icon and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
              <FaCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{service.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {service.serviceCode}
                </span>
                {service.priorityAllowed && (
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <FaPercentage className="w-3 h-3" />
                    Priority
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {service.description || 'No description available for this service.'}
        </p>

        {/* Simple Service Details */}
        <div className="space-y-2 mb-4">
          {/* Document Requirements */}
          {requiredDocsCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded flex items-center justify-center">
                <FaIdCard className="w-3 h-3 text-amber-600" />
              </div>
              <span>{requiredDocsCount} required document{requiredDocsCount !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Document Upload Requirement */}
          {service.isDocumentUploadRequired && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-6 h-6 bg-gradient-to-br from-rose-100 to-rose-200 rounded flex items-center justify-center">
                <FaFileAlt className="w-3 h-3 text-rose-600" />
              </div>
              <span>Document upload required</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={(e) => onBookSlot(service._id, e)}
            disabled={!canBookSlot}
            className={`flex-1 py-2.5 px-4 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 ${canBookSlot
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            <FaCalendarAlt className="w-4 h-4" />
            {canBookSlot ? 'Start Booking' :
              !isAuthenticated ? 'Login to Book' :
                'Walk-in Only'}
          </button>
          <button className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center gap-2 text-slate-700">
            <FaInfoCircle className="w-4 h-4" />
            Details
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Info Item Component
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm font-medium text-slate-900 truncate">{value}</p>
    </div>
  </div>
);

export default DepartmentDetails;