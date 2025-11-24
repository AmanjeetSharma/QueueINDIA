import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useService } from '../../context/ServiceContext';
import { useDepartment } from '../../context/DepartmentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaClock,
    FaCog,
    FaFileAlt,
    FaUsers,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaIdCard,
    FaCheckCircle,
    FaInfoCircle,
    FaPercentage,
    FaBuilding,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { formatServiceDuration, formatAddress } from '../../lib/formatters';

const ServiceDetails = () => {
    const { deptId, serviceId } = useParams();
    const navigate = useNavigate();
    const { currentService, getServiceById, loading } = useService();
    const { currentDepartment, getDepartmentById } = useDepartment();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (deptId && serviceId) {
            getServiceById(deptId, serviceId);
        }
    }, [deptId, serviceId]);

    // Fetch department data when component mounts
    useEffect(() => {
        if (deptId) {
            getDepartmentById(deptId);
        }
    }, [deptId]);

    const handleBookSlot = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book a slot', {
                duration: 4000,
                position: "bottom-left"
            });
            return;
        }

        if (!currentDepartment?.isSlotBookingEnabled) {
            toast.error('Online booking is not available for this department', {
                duration: 4000,
                position: "bottom-left"
            });
            return;
        }

        navigate(`/departments/${deptId}/services/${serviceId}/book-slot`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!currentService) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h2>
                    <p className="text-slate-600 mb-6">The service you're looking for doesn't exist or has been moved.</p>
                    <Link 
                        to={`/departments/${deptId}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Department
                    </Link>
                </div>
            </div>
        );
    }

    const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;
    const canBookSlot = isAuthenticated && isSlotBookingEnabled;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/departments/${deptId}`}
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                <span className="font-medium">Back to Department</span>
                            </Link>
                            <div className="w-px h-6 bg-slate-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{currentService.name}</h1>
                                <p className="text-slate-600">
                                    {currentService.serviceCode} 
                                    {currentDepartment?.name && ` • ${currentDepartment.name}`}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {currentService.priorityAllowed && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    <FaPercentage className="w-3 h-3" />
                                    Priority Available
                                </span>
                            )}
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                isSlotBookingEnabled 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-slate-100 text-slate-800'
                            }`}>
                                <FaCalendarAlt className="w-3 h-3" />
                                {isSlotBookingEnabled ? 'Online Booking' : 'Walk-in Only'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={FaClock}
                        label="Service Time"
                        value={formatServiceDuration(currentService.avgServiceTime)}
                        color="blue"
                    />
                    <StatCard
                        icon={FaCog}
                        label="Service Code"
                        value={currentService.serviceCode}
                        color="green"
                    />
                    {currentService.maxDailyServiceTokens && (
                        <StatCard
                            icon={FaUsers}
                            label="Daily Capacity"
                            value={currentService.maxDailyServiceTokens}
                            color="purple"
                        />
                    )}
                    <StatCard
                        icon={FaCheckCircle}
                        label="Priority"
                        value={currentService.priorityAllowed ? 'Available' : 'Not Available'}
                        color={currentService.priorityAllowed ? 'emerald' : 'slate'}
                    />
                </div>

                {/* Important Notices */}
                <div className="space-y-4 mb-8">
                    {/* Login Notice for Booking */}
                    {isSlotBookingEnabled && !isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <FaInfoCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-800 text-sm">Login Required</h3>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Please login to your account to book a slot for this service.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Document Requirement Notice */}
                    {currentDepartment?.isDocumentUploadRequired && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <FaFileAlt className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-amber-800 text-sm">Document Upload Required</h3>
                                    <p className="text-amber-700 text-sm mt-1">
                                        You need to upload required documents before booking a slot.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content - Service Details */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Service Overview */}
                        <SectionCard title="Service Overview" icon={FaCog}>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Description</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {currentService.description || 'No description available for this service.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        icon={FaClock}
                                        label="Average Service Time"
                                        value={formatServiceDuration(currentService.avgServiceTime)}
                                    />
                                    <InfoItem
                                        icon={FaCog}
                                        label="Service Code"
                                        value={currentService.serviceCode}
                                    />
                                    {currentService.maxDailyServiceTokens && (
                                        <InfoItem
                                            icon={FaUsers}
                                            label="Daily Capacity"
                                            value={`${currentService.maxDailyServiceTokens} tokens`}
                                        />
                                    )}
                                    <InfoItem
                                        icon={FaCheckCircle}
                                        label="Priority Service"
                                        value={currentService.priorityAllowed ? 'Available' : 'Not Available'}
                                        highlight={currentService.priorityAllowed}
                                    />
                                </div>
                            </div>
                        </SectionCard>

                        {/* Required Documents */}
                        {currentService.requiredDocs && currentService.requiredDocs.length > 0 && (
                            <SectionCard title="Required Documents" icon={FaFileAlt}>
                                <div className="space-y-3">
                                    {currentService.requiredDocs.map((doc, index) => (
                                        <DocumentItem key={index} document={doc} />
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                        {/* Department Information */}
                        {currentDepartment && (
                            <SectionCard title="Department Information" icon={FaBuilding}>
                                <div className="space-y-4">
                                    <InfoItem
                                        icon={FaBuilding}
                                        label="Department"
                                        value={currentDepartment.name}
                                    />
                                    <InfoItem
                                        icon={FaMapMarkerAlt}
                                        label="Category"
                                        value={currentDepartment.departmentCategory}
                                    />
                                    {currentDepartment.address && (
                                        <InfoItem
                                            icon={FaMapMarkerAlt}
                                            label="Address"
                                            value={formatAddress(currentDepartment.address)}
                                        />
                                    )}
                                    {currentDepartment.contact?.phone && (
                                        <InfoItem
                                            icon={FaClock}
                                            label="Contact"
                                            value={currentDepartment.contact.phone}
                                        />
                                    )}
                                </div>
                            </SectionCard>
                        )}
                    </div>

                    {/* Sidebar - Actions & Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Book Slot Card */}
                        <SectionCard title="Book Your Slot" icon={FaCalendarAlt}>
                            <div className="space-y-4">
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Reserve your spot for {currentService.name} 
                                    {currentDepartment?.name && ` at ${currentDepartment.name}`}.
                                </p>
                                
                                <button
                                    onClick={handleBookSlot}
                                    disabled={!canBookSlot}
                                    className={`w-full py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                                        canBookSlot
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FaCalendarAlt className="w-4 h-4" />
                                    {canBookSlot ? 'Book Slot Now' : 
                                     !isAuthenticated ? 'Login to Book' : 
                                     'Walk-in Only'}
                                </button>

                                {!isAuthenticated && (
                                    <p className="text-xs text-slate-500 text-center">
                                        Login required for online booking
                                    </p>
                                )}
                            </div>
                        </SectionCard>

                        {/* Service Quick Info */}
                        <SectionCard title="Service Details" icon={FaInfoCircle}>
                            <div className="space-y-3">
                                <FeatureItem
                                    icon={FaClock}
                                    label="Service Time"
                                    value={formatServiceDuration(currentService.avgServiceTime)}
                                />
                                <FeatureItem
                                    icon={FaCog}
                                    label="Service Code"
                                    value={currentService.serviceCode}
                                />
                                {currentService.maxDailyServiceTokens && (
                                    <FeatureItem
                                        icon={FaUsers}
                                        label="Daily Capacity"
                                        value={currentService.maxDailyServiceTokens}
                                    />
                                )}
                                {currentService.requiredDocs && currentService.requiredDocs.length > 0 && (
                                    <FeatureItem
                                        icon={FaFileAlt}
                                        label="Documents Required"
                                        value={currentService.requiredDocs.length}
                                    />
                                )}
                            </div>
                        </SectionCard>

                        {/* Priority Information */}
                        {currentService.priorityAllowed && (
                            <SectionCard title="Priority Service" icon={FaPercentage}>
                                <div className="space-y-3">
                                    <div className="text-sm text-slate-600">
                                        <p>This service offers priority access for eligible citizens.</p>
                                    </div>
                                    {currentDepartment?.tokenManagement?.priorityCriteria && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-900 text-sm">Eligibility:</h4>
                                            <ul className="text-xs text-slate-600 space-y-1">
                                                {currentDepartment.tokenManagement.priorityCriteria.seniorCitizenAge && (
                                                    <li className="flex items-center gap-2">
                                                        <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                                                        Senior citizens ({currentDepartment.tokenManagement.priorityCriteria.seniorCitizenAge}+ years)
                                                    </li>
                                                )}
                                                {currentDepartment.tokenManagement.priorityCriteria.allowPregnantWomen && (
                                                    <li className="flex items-center gap-2">
                                                        <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                                                        Pregnant women
                                                    </li>
                                                )}
                                                {currentDepartment.tokenManagement.priorityCriteria.allowDifferentlyAbled && (
                                                    <li className="flex items-center gap-2">
                                                        <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                                                        Differently-abled
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        )}

                        {/* Important Instructions */}
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                            <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <FaExclamationTriangle className="w-4 h-4 text-amber-600" />
                                Important Instructions
                            </h3>
                            <ul className="text-sm text-amber-800 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Arrive 15 minutes before scheduled time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Bring all required documents</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Late arrivals may need to reschedule</span>
                                </li>
                                {currentService.priorityAllowed && (
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5">•</span>
                                        <span>Priority service available for eligible citizens</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ... (rest of the helper components remain the same)
const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        slate: 'bg-slate-50 text-slate-700 border-slate-200'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-50`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-medium opacity-80">{label}</p>
                    <p className="text-lg font-bold">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

const SectionCard = ({ title, icon: Icon, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
        {Icon && <Icon className={`w-4 h-4 mt-1 flex-shrink-0 ${highlight ? 'text-emerald-600' : 'text-slate-500'}`} />}
        <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-600">{label}</p>
            <p className={`font-medium text-sm ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                {value}
            </p>
        </div>
    </div>
);

const DocumentItem = ({ document }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
        <div className={`p-2 rounded-full ${document.isMandatory ? 'bg-red-100' : 'bg-blue-100'}`}>
            <FaIdCard className={`w-4 h-4 ${document.isMandatory ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900">{document.name}</span>
                {document.isMandatory ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Mandatory
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Optional
                    </span>
                )}
            </div>
            {document.description && (
                <p className="text-sm text-slate-600">{document.description}</p>
            )}
        </div>
    </div>
);

const FeatureItem = ({ icon: Icon, label, value, positive = false }) => (
    <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{label}</span>
        </div>
        <span className="text-sm font-medium text-slate-900">
            {value}
        </span>
    </div>
);

export default ServiceDetails;