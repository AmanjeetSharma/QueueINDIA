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
    FaCalendarAlt,
    FaExclamationTriangle,
    FaIdCard,
    FaCheckCircle,
    FaInfoCircle,
    FaPercentage,
    FaBuilding,
    FaMapMarkerAlt,
    FaHourglassHalf,
    FaFemale,
    FaWheelchair,
    FaUserCheck,
    FaChevronRight,
    FaArrowRight
} from 'react-icons/fa';
import { formatAddress, formatTime } from '../../lib/formatters';

const ServiceDetails = () => {
    const { deptId, serviceId } = useParams();
    const navigate = useNavigate();
    const { currentService, getServiceById, loading } = useService();
    const { currentDepartment, getDepartmentById } = useDepartment();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (deptId && serviceId) {
            getServiceById(deptId, serviceId);
        }
    }, [deptId, serviceId]);

    useEffect(() => {
        if (deptId) {
            getDepartmentById(deptId);
        }
    }, [deptId]);

    const handleStartBooking = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book a slot', {
                duration: 4000,
                position: "bottom-left"
            });
            navigate('/login', { state: { returnTo: `/departments/${deptId}/services/${serviceId}` } });
            return;
        }

        if (!currentDepartment?.isSlotBookingEnabled) {
            toast.error('Online booking is not available for this department', {
                duration: 4000,
                position: "bottom-left"
            });
            return;
        }

        // Navigate to booking flow
        navigate(`/departments/${deptId}/services/${serviceId}/book-slot`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!currentService) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                    <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h2>
                    <p className="text-slate-600 mb-6">The service you're looking for doesn't exist or has been moved.</p>
                    <Link
                        to={`/departments/${deptId}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium shadow-md"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Department
                    </Link>
                </div>
            </div>
        );
    }

    const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;
    const tokenManagement = currentService.tokenManagement || {};
    const requiredDocs = currentService.requiredDocs || [];
    const priorityCriteria = currentDepartment?.priorityCriteria || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <Link
                                to={`/departments/${deptId}`}
                                className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-700/30 mb-4"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                <span className="font-medium">Back to Department</span>
                            </Link>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaCog className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{currentService.name}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                            {currentService.serviceCode}
                                        </span>
                                        {currentService.priorityAllowed && (
                                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-purple-600/30 backdrop-blur-sm rounded-full text-sm font-medium">
                                                <FaPercentage className="w-3 h-3 inline mr-1" />
                                                Priority Service
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${isSlotBookingEnabled
                                                ? 'bg-emerald-500/30 text-emerald-100'
                                                : 'bg-slate-500/30 text-slate-200'
                                            }`}>
                                            {isSlotBookingEnabled ? 'Online Booking' : 'Walk-in Only'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleStartBooking}
                            disabled={!isSlotBookingEnabled}
                            className={`px-8 py-3 rounded-lg transition-all transform hover:scale-105 font-medium shadow-md flex items-center gap-3 ${isSlotBookingEnabled
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                                    : 'bg-slate-500/30 backdrop-blur-sm text-slate-200 cursor-not-allowed'
                                }`}
                        >
                            {isSlotBookingEnabled ? (
                                <>
                                    <span>Start Booking</span>
                                    <FaArrowRight className="w-4 h-4" />
                                </>
                            ) : (
                                'Walk-in Service Only'
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Service Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Description */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                <FaCog className="w-5 h-5 text-blue-600" />
                                Service Overview
                            </h3>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                                {currentService.description || 'No description available for this service.'}
                            </p>
                        </div>

                        {/* Key Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                <FaInfoCircle className="w-5 h-5 text-blue-600" />
                                Key Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                    icon={FaCog}
                                    label="Service Code"
                                    value={currentService.serviceCode}
                                />
                                <InfoItem
                                    icon={FaClock}
                                    label="Queue Type"
                                    value={tokenManagement.queueType || 'Hybrid'}
                                />
                                {currentService.priorityAllowed && (
                                    <InfoItem
                                        icon={FaPercentage}
                                        label="Priority Service"
                                        value="Available for eligible citizens"
                                        highlight={true}
                                    />
                                )}
                                {tokenManagement.timeBtwEverySlot && (
                                    <InfoItem
                                        icon={FaClock}
                                        label="Slot Interval"
                                        value={`${tokenManagement.timeBtwEverySlot} minutes`}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Document Requirements */}
                        {currentService.isDocumentUploadRequired && requiredDocs.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                                <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                    <FaFileAlt className="w-5 h-5 text-amber-600" />
                                    Required Documents
                                </h3>
                                <div className="space-y-3">
                                    {requiredDocs.map((doc, index) => (
                                        <DocumentItem key={index} document={doc} index={index} />
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-700">
                                        <FaExclamationTriangle className="w-4 h-4 inline mr-2" />
                                        You will need to upload these documents during the booking process.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Information */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-6 shadow-lg">
                            <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="w-5 h-5 text-emerald-600" />
                                Ready to Book?
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                                    <h4 className="font-semibold text-slate-900 mb-2">Booking Process:</h4>
                                    <div className="space-y-3">
                                        <StepItem
                                            number="1"
                                            title="Choose Date"
                                            description="Select your preferred appointment date"
                                        />
                                        <StepItem
                                            number="2"
                                            title="Select Time Slot"
                                            description="Pick from available time slots"
                                        />
                                        <StepItem
                                            number="3"
                                            title="Upload Documents"
                                            description="Submit required documents"
                                        />
                                        <StepItem
                                            number="4"
                                            title="Confirm Booking"
                                            description="Review and confirm your appointment"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartBooking}
                                    disabled={!isSlotBookingEnabled}
                                    className={`w-full py-3.5 px-4 rounded-lg transition-all transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-md ${isSlotBookingEnabled
                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <FaCalendarAlt className="w-4 h-4" />
                                    {isSlotBookingEnabled ? 'Start Booking Process' : 'Walk-in Service Only'}
                                </button>

                                {!isAuthenticated && isSlotBookingEnabled && (
                                    <p className="text-sm text-slate-600 text-center">
                                        You'll be asked to login before booking
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Priority Information */}
                        {currentService.priorityAllowed && (
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 p-6">
                                <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                    <FaUserCheck className="w-5 h-5 text-purple-600" />
                                    Priority Eligibility
                                </h3>

                                <div className="space-y-3">
                                    <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                                        <p className="text-sm text-slate-700 mb-2">
                                            This service offers priority access for:
                                        </p>
                                        <div className="space-y-2">
                                            {priorityCriteria.seniorCitizenAge && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaHourglassHalf className="w-4 h-4 text-blue-600" />
                                                    <span>Senior Citizens ({priorityCriteria.seniorCitizenAge}+ years)</span>
                                                </div>
                                            )}
                                            {priorityCriteria.allowPregnantWomen && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaFemale className="w-4 h-4 text-pink-600" />
                                                    <span>Pregnant Women</span>
                                                </div>
                                            )}
                                            {priorityCriteria.allowDifferentlyAbled && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaWheelchair className="w-4 h-4 text-emerald-600" />
                                                    <span>Differently Abled</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        * Valid government ID required for priority access
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Department Info */}
                        {currentDepartment && (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                                <h3 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                                    <FaBuilding className="w-5 h-5 text-blue-600" />
                                    Department Location
                                </h3>

                                <div className="space-y-3">
                                    <InfoItem
                                        icon={FaBuilding}
                                        label="Department"
                                        value={currentDepartment.name}
                                    />
                                    <InfoItem
                                        icon={FaMapMarkerAlt}
                                        label="Address"
                                        value={formatAddress(currentDepartment.address)}
                                    />
                                    {currentDepartment.contact?.phone && (
                                        <InfoItem
                                            icon={FaClock}
                                            label="Contact"
                                            value={currentDepartment.contact.phone}
                                        />
                                    )}
                                </div>

                                <Link
                                    to={`/departments/${deptId}`}
                                    className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View full department details
                                    <FaChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const InfoItem = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
        {Icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-600 font-medium">{label}</p>
            <p className={`font-medium text-slate-900 mt-1 ${highlight ? 'text-emerald-600' : ''}`}>
                {value}
            </p>
        </div>
    </div>
);

const DocumentItem = ({ document, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
    >
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${document.isMandatory ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                <FaIdCard className={`w-5 h-5 ${document.isMandatory ? 'text-red-600' : 'text-blue-600'
                    }`} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-slate-900">{document.name}</h4>
                    {document.isMandatory ? (
                        <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded text-xs font-medium">
                            Required
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded text-xs font-medium">
                            Optional
                        </span>
                    )}
                </div>
                {document.description && (
                    <p className="text-sm text-slate-600">{document.description}</p>
                )}
            </div>
        </div>
    </motion.div>
);

const StepItem = ({ number, title, description }) => (
    <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{number}</span>
        </div>
        <div>
            <h5 className="font-medium text-slate-900">{title}</h5>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    </div>
);

export default ServiceDetails;