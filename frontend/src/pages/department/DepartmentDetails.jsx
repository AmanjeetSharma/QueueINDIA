import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDepartment } from '../../context/DepartmentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaBuilding,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaCog,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdCard,
  FaEye,
  FaPercentage,
  FaCalendarAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaCalendarTimes
} from 'react-icons/fa';
import { formatAddress, formatServiceDuration } from '../../lib/formatters';

const DepartmentDetails = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { currentDepartment, getDepartmentById, loading: deptLoading } = useDepartment();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (deptId) {
      getDepartmentById(deptId);
    }
  }, [deptId]);

  const services = currentDepartment?.services || [];
  const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Department Not Found</h2>
          <p className="text-slate-600 mb-6">The department you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">Departments</span>
              </Link>
              <div className="w-px h-6 bg-slate-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{currentDepartment.name}</h1>
                <p className="text-slate-600">{currentDepartment.departmentCategory}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentDepartment.status === 'active' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Inactive
                </span>
              )}

              {isSlotBookingEnabled ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <FaCalendarCheck className="w-3 h-3" />
                  Online Booking Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                  <FaCalendarTimes className="w-3 h-3" />
                  Walk-in Only
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FaCog}
            label="Total Services"
            value={services.length}
            color="blue"
          />
          <StatCard
            icon={FaUsers}
            label="Daily Capacity"
            value={currentDepartment.tokenManagement?.maxDailyTokens || 'N/A'}
            color="green"
          />
          <StatCard
            icon={FaClock}
            label="Slot Interval"
            value={`${currentDepartment.tokenManagement?.slotInterval || 'N/A'} mins`}
            color="purple"
          />
          <StatCard
            icon={FaCalendarAlt}
            label="Booking Window"
            value={`${currentDepartment.tokenManagement?.bookingWindowDays || 'N/A'} days`}
            color={isSlotBookingEnabled ? "orange" : "slate"}
          />
        </div>

        {/* Booking Notice */}
        {!isSlotBookingEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <FaInfoCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800">Walk-in Service Only</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Online slot booking is not available for this department. Please visit in person to avail services.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Department Information */}
          <div className="lg:col-span-1 space-y-6">
            <InformationPanel department={currentDepartment} />
          </div>

          {/* Main Content - Services */}
          <div className="lg:col-span-3">
            <ServicesSection
              services={services}
              department={currentDepartment}
              onServiceClick={handleServiceClick}
              onBookSlot={handleBookSlot}
              isSlotBookingEnabled={isSlotBookingEnabled}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 ${colorClasses[color]} transition-all hover:scale-105`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-50`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Consolidated Information Panel
const InformationPanel = ({ department }) => {
  const isSlotBookingEnabled = department?.isSlotBookingEnabled || false;

  return (
    <div className="space-y-6">
      {/* Booking Status */}
      <SectionCard title="Booking Status" icon={isSlotBookingEnabled ? FaCalendarCheck : FaCalendarTimes}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Online Booking</span>
            <span className={`text-sm font-medium ${isSlotBookingEnabled ? 'text-emerald-600' : 'text-slate-600'}`}>
              {isSlotBookingEnabled ? 'Available' : 'Not Available'}
            </span>
          </div>
          {isSlotBookingEnabled && department.tokenManagement && (
            <>
              <div className="border-t border-slate-200 pt-3">
                <InfoItem label="Booking Window" value={`${department.tokenManagement.bookingWindowDays} days`} />
                <InfoItem label="Slot Interval" value={`${department.tokenManagement.slotInterval} minutes`} />
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* Contact Information */}
      <SectionCard title="Contact Information" icon={FaMapMarkerAlt}>
        <div className="space-y-4">
          {department.contact?.phone && (
            <InfoItem icon={FaPhone} label="Phone" value={department.contact.phone} />
          )}
          {department.contact?.email && (
            <InfoItem icon={FaEnvelope} label="Email" value={department.contact.email} />
          )}
          {department.contact?.website && (
            <InfoItem
              icon={FaGlobe}
              label="Website"
              value={
                <a
                  href={department.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Visit Website
                </a>
              }
            />
          )}
          {department.address && (
            <InfoItem
              icon={FaMapMarkerAlt}
              label="Address"
              value={formatAddress(department.address)}
            />
          )}
        </div>
      </SectionCard>

      {/* Working Hours */}
      {department.workingHours && department.workingHours.length > 0 && (
        <SectionCard title="Working Hours" icon={FaClock}>
          <div className="space-y-3">
            {department.workingHours.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="font-medium text-slate-700 text-sm">{schedule.day}</span>
                {schedule.isClosed ? (
                  <span className="text-red-600 text-sm font-medium px-2 py-1 bg-red-50 rounded">Closed</span>
                ) : (
                  <span className="text-slate-600 text-sm">
                    {schedule.openTime} - {schedule.closeTime}
                  </span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Token Management */}
      {department.tokenManagement && (
        <SectionCard title="Token System" icon={FaUsers}>
          <div className="space-y-3">
            <InfoItem label="Max Daily Tokens" value={department.tokenManagement.maxDailyTokens} />
            <InfoItem label="Max Per Slot" value={department.tokenManagement.maxTokensPerSlot} />
            <InfoItem label="Queue Type" value={department.tokenManagement.queueType} />

            {department.tokenManagement.allowPriorityTokens && (
              <div className="pt-2 border-t border-slate-200">
                <InfoItem
                  label="Priority Tokens"
                  value={`${department.tokenManagement.priorityPercentage}% Reserved`}
                  highlight
                />
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Priority Information */}
      {department.tokenManagement?.priorityCriteria && (
        <SectionCard title="Priority Access" icon={FaPercentage}>
          <div className="space-y-2">
            {department.tokenManagement.priorityCriteria.seniorCitizenAge && (
              <InfoItem
                label="Senior Citizen"
                value={`${department.tokenManagement.priorityCriteria.seniorCitizenAge}+ years`}
              />
            )}
            {department.tokenManagement.priorityCriteria.allowPregnantWomen && (
              <InfoItem label="Pregnant Women" value="Eligible" highlight />
            )}
            {department.tokenManagement.priorityCriteria.allowDifferentlyAbled && (
              <InfoItem label="Differently Abled" value="Eligible" highlight />
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

// Services Section
const ServicesSection = ({ services, department, onServiceClick, onBookSlot, isSlotBookingEnabled, isAuthenticated }) => {
  const canBookSlot = isAuthenticated && isSlotBookingEnabled;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Available Services</h2>
          <p className="text-slate-600 mt-1">
            {services.length} service{services.length !== 1 ? 's' : ''} available
            {!isSlotBookingEnabled && ' • Walk-in only'}
          </p>
        </div>

        {department.isDocumentUploadRequired && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <FaInfoCircle className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">Documents Required</span>
          </div>
        )}
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <ServiceCard
              key={service._id}
              service={service}
              index={index}
              onClick={() => onServiceClick(service._id)}
              onBookSlot={onBookSlot}
              isSlotBookingEnabled={isSlotBookingEnabled}
              isAuthenticated={isAuthenticated}
              canBookSlot={canBookSlot}
            />
          ))}
        </div>
      ) : (
        <EmptyServices />
      )}
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, index, onClick, onBookSlot, isSlotBookingEnabled, isAuthenticated, canBookSlot }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <FaCog className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg leading-tight">{service.name}</h3>
          <p className="text-slate-500 text-sm">{service.serviceCode}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        {service.priorityAllowed && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FaPercentage className="w-3 h-3" />
            Priority
          </span>
        )}
      </div>
    </div>

    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
      {service.description || 'No description available for this service.'}
    </p>

    <div className="space-y-2 mb-4">
      {service.avgServiceTime && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FaClock className="w-4 h-4" />
          <span>Average time: {formatServiceDuration(service.avgServiceTime)}</span>
        </div>
      )}

      {service.requiredDocs && service.requiredDocs.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-slate-500">
          <FaIdCard className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Requires {service.requiredDocs.length} document{service.requiredDocs.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {service.maxDailyServiceTokens && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FaUsers className="w-4 h-4" />
          <span>Max {service.maxDailyServiceTokens} tokens per day</span>
        </div>
      )}
    </div>

    <div className="flex gap-2">
      <button
        onClick={(e) => onBookSlot(service._id, e)}
        disabled={!canBookSlot}
        className={`flex-1 py-2.5 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 ${
          canBookSlot
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <FaCalendarAlt className="w-4 h-4" />
        {canBookSlot ? 'Book Slot' : 
         !isAuthenticated ? 'Login to Book' : 
         'Walk-in Only'}
      </button>
      <button className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center gap-2">
        <FaEye className="w-4 h-4" />
        View
      </button>
    </div>
  </motion.div>
);

// Helper Components (SectionCard, InfoItem, EmptyServices remain the same)
const SectionCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
  >
    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5 text-blue-600" />
      {title}
    </h3>
    {children}
  </motion.div>
);

const InfoItem = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />}
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`font-medium text-sm ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  </div>
);

const EmptyServices = () => (
  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
    <FaCog className="w-16 h-16 mx-auto text-slate-300 mb-4" />
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Services Available</h3>
    <p className="text-slate-500 max-w-sm mx-auto">
      This department doesn't have any services available at the moment. Please check back later.
    </p>
  </div>
);

export default DepartmentDetails;