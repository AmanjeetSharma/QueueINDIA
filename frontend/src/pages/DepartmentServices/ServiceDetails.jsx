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
    FaArrowRight,
    FaPhone,
    FaEnvelope,
    FaStar,
    FaUpload,
    FaShieldAlt,
    FaCalendarCheck,
    FaFileUpload
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

        navigate(`/departments/${deptId}/services/${serviceId}/book-slot`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading service details...</p>
                </motion.div>
            </div>
        );
    }

    if (!currentService) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-4xl text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Service Not Found</h2>
                    <p className="text-slate-600 mb-6">The service you're looking for doesn't exist or has been moved.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/departments/${deptId}`)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                    >
                        <FaArrowLeft /> Back to Department
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const isSlotBookingEnabled = currentDepartment?.isSlotBookingEnabled || false;
    const tokenManagement = currentService.tokenManagement || {};
    const requiredDocs = currentService.requiredDocs || [];
    const priorityCriteria = currentDepartment?.priorityCriteria || {};
    const canBookSlot = isAuthenticated && isSlotBookingEnabled;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            {/* Enhanced Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/departments/${deptId}`)}
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 group hover:scale-105 transition-transform"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Department</span>
                        </motion.button>
                    </motion.div>

                    {/* Service Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                                    <FaCog className="text-3xl" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                                        {currentService.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                                        >
                                            {currentService.serviceCode}
                                        </motion.span>
                                        {currentService.priorityAllowed && (
                                            <motion.span 
                                                whileHover={{ scale: 1.05 }}
                                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-lg text-sm font-semibold flex items-center gap-1.5 border border-amber-400/30 hover:scale-105 transition-transform"
                                            >
                                                <FaStar className="text-amber-300" />
                                                Priority Service
                                            </motion.span>
                                        )}
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 transition-transform ${
                                                isSlotBookingEnabled
                                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30'
                                                    : 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 border border-slate-400/30'
                                            }`}
                                        >
                                            {isSlotBookingEnabled ? <FaCalendarCheck /> : <FaCheckCircle />}
                                            {isSlotBookingEnabled ? 'Online Booking' : 'Walk-in Only'}
                                        </motion.span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStartBooking}
                                disabled={!canBookSlot}
                                className={`px-8 py-4 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-3 text-lg ${
                                    canBookSlot
                                        ? 'bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:from-blue-50 hover:to-blue-100 hover:shadow-xl border-2 border-white/50'
                                        : 'bg-white/20 text-white/60 cursor-not-allowed backdrop-blur-sm'
                                }`}
                            >
                                {canBookSlot ? (
                                    <>
                                        <FaCalendarAlt />
                                        Start Booking
                                        <FaArrowRight />
                                    </>
                                ) : !isAuthenticated ? (
                                    'Login to Book'
                                ) : (
                                    'Walk-in Only'
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Service Details (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <FaInfoCircle className="text-blue-600 text-xl" />
                                </div>
                                Service Overview
                            </h2>
                            <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                                <p className="text-slate-700 leading-relaxed">
                                    {currentService.description || 'No description available for this service.'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Key Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <FaCheckCircle className="text-green-600 text-xl" />
                                </div>
                                Key Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={FaCog}
                                    label="Service Code"
                                    value={currentService.serviceCode}
                                    bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                                    iconColor="text-blue-600"
                                />
                                <InfoCard
                                    icon={FaClock}
                                    label="Queue Type"
                                    value={tokenManagement.queueType || 'Hybrid'}
                                    bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
                                    iconColor="text-purple-600"
                                />
                                {currentService.priorityAllowed && (
                                    <InfoCard
                                        icon={FaStar}
                                        label="Priority Service"
                                        value="Available"
                                        bgColor="bg-gradient-to-br from-amber-50 to-amber-100"
                                        iconColor="text-amber-600"
                                        highlight={true}
                                    />
                                )}
                                {tokenManagement.timeBtwEverySlot && (
                                    <InfoCard
                                        icon={FaClock}
                                        label="Slot Interval"
                                        value={`${tokenManagement.timeBtwEverySlot} minutes`}
                                        bgColor="bg-gradient-to-br from-green-50 to-emerald-100"
                                        iconColor="text-green-600"
                                    />
                                )}
                            </div>
                        </motion.div>

                        {/* Document Requirements */}
                        {requiredDocs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                        <FaFileAlt className="text-purple-600 text-xl" />
                                    </div>
                                    Required Documents
                                </h2>
                                <div className="space-y-3">
                                    {requiredDocs.map((doc, index) => (
                                        <DocumentCard key={index} document={doc} index={index} />
                                    ))}
                                </div>
                                
                                {/* Document Upload Info Banner */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaUpload className="text-white text-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-800 font-semibold mb-1">
                                                Document Upload Process
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                <span className="font-medium text-blue-700">You can upload required documents after booking your slot.</span> 
                                                Early document submission helps get pre-approval before visiting, making your in-person process faster and smoother.
                                            </p>
                                            {currentService.isDocumentUploadRequired && (
                                                <p className="text-xs text-amber-600 font-medium mt-2 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                                                    ⚠️ Upload is required before your scheduled appointment
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Booking & Info (1/3 width) */}
                    <div className="space-y-6">
                        {/* Booking Process Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl border border-green-200 shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                                    <FaCalendarAlt className="text-white" />
                                </div>
                                Booking Process
                            </h3>

                            <div className="space-y-3 mb-6">
                                <BookingStep
                                    number="1"
                                    title="Choose Date"
                                    description="Select your preferred appointment date"
                                    icon={FaCalendarAlt}
                                />
                                <BookingStep
                                    number="2"
                                    title="Select Time Slot"
                                    description="Pick from available time slots"
                                    icon={FaClock}
                                />
                                <BookingStep
                                    number="3"
                                    title="Review Details"
                                    description="Confirm your booking information"
                                    icon={FaCheckCircle}
                                />
                                <BookingStep
                                    number="4"
                                    title="Upload Documents"
                                    description="Upload required documents after booking"
                                    icon={FaFileUpload}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStartBooking}
                                disabled={!canBookSlot}
                                className={`w-full py-4 px-4 rounded-xl transition-all font-semibold text-base shadow-lg flex items-center justify-center gap-2 ${
                                    canBookSlot
                                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:shadow-xl'
                                        : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <FaCalendarAlt />
                                {canBookSlot ? 'Start Booking Now' : !isAuthenticated ? 'Login to Book' : 'Walk-in Only'}
                            </motion.button>

                            {!isAuthenticated && isSlotBookingEnabled && (
                                <p className="text-sm text-slate-600 text-center mt-3 flex items-center justify-center gap-2">
                                    <FaShieldAlt className="text-slate-400" />
                                    You'll be asked to login before booking
                                </p>
                            )}
                        </motion.div>

                        {/* Document Upload Timeline Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 }}
                            className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200 shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                                    <FaFileUpload className="text-white" />
                                </div>
                                Document Timeline
                            </h3>

                            <div className="space-y-3">
                                <TimelineStep
                                    icon={FaCheckCircle}
                                    title="Book Your Slot First"
                                    description="Secure your appointment before uploading documents"
                                    color="green"
                                />
                                <TimelineStep
                                    icon={FaUpload}
                                    title="Upload After Booking"
                                    description="Submit required documents at your convenience"
                                    color="blue"
                                />
                                <TimelineStep
                                    icon={FaShieldAlt}
                                    title="Get Pre-Approval"
                                    description="Early review before visiting saves time"
                                    color="purple"
                                />
                                <TimelineStep
                                    icon={FaUserCheck}
                                    title="Fast Counter Processing"
                                    description="Quick verification during appointment"
                                    color="emerald"
                                />
                            </div>

                            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-blue-200">
                                <p className="text-xs text-slate-700 flex items-start gap-2">
                                    <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>
                                        <span className="font-semibold text-blue-700">Tip:</span> Upload documents as soon as possible after booking for faster processing.
                                    </span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Priority Access Card */}
                        {currentService.priorityAllowed && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                                        <FaStar className="text-white" />
                                    </div>
                                    Priority Access
                                </h3>

                                <div className="space-y-3">
                                    <p className="text-sm text-slate-700 mb-3">
                                        This service offers priority access for eligible citizens:
                                    </p>
                                    {priorityCriteria.seniorCitizenAge && (
                                        <PriorityTag
                                            icon={FaHourglassHalf}
                                            text={`Senior Citizens (${priorityCriteria.seniorCitizenAge}+ years)`}
                                            color="blue"
                                        />
                                    )}
                                    {priorityCriteria.allowPregnantWomen && (
                                        <PriorityTag
                                            icon={FaFemale}
                                            text="Pregnant Women"
                                            color="pink"
                                        />
                                    )}
                                    {priorityCriteria.allowDifferentlyAbled && (
                                        <PriorityTag
                                            icon={FaWheelchair}
                                            text="Differently Abled"
                                            color="green"
                                        />
                                    )}
                                </div>

                                <div className="mt-4 p-3 bg-white/60 rounded-xl border border-amber-200">
                                    <p className="text-xs text-slate-600 flex items-center gap-2">
                                        <FaIdCard className="text-amber-600" />
                                        Valid government ID required for verification
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Department Info Card */}
                        {currentDepartment && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                                        <FaBuilding className="text-blue-600" />
                                    </div>
                                    Department Info
                                </h3>

                                <div className="space-y-4">
                                    <DepartmentInfoItem
                                        icon={FaBuilding}
                                        label="Department"
                                        value={currentDepartment.name}
                                    />
                                    <DepartmentInfoItem
                                        icon={FaMapMarkerAlt}
                                        label="Address"
                                        value={formatAddress(currentDepartment.address)}
                                    />
                                    {currentDepartment.contact?.phone && (
                                        <DepartmentInfoItem
                                            icon={FaPhone}
                                            label="Phone"
                                            value={currentDepartment.contact.phone}
                                            href={`tel:${currentDepartment.contact.phone}`}
                                        />
                                    )}
                                    {currentDepartment.contact?.email && (
                                        <DepartmentInfoItem
                                            icon={FaEnvelope}
                                            label="Email"
                                            value={currentDepartment.contact.email}
                                            href={`mailto:${currentDepartment.contact.email}`}
                                        />
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(`/departments/${deptId}`)}
                                    className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold group"
                                >
                                    View full department details
                                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const InfoCard = ({ icon: Icon, label, value, bgColor, iconColor, highlight = false }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`${bgColor} rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all`}
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                <Icon className={`${iconColor} text-lg`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 font-medium mb-1">{label}</p>
                <p className={`font-bold text-slate-900 ${highlight ? iconColor : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    </motion.div>
);

const DocumentCard = ({ document, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="p-4 bg-gradient-to-r from-slate-50 to-purple-50 border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
    >
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
                document.isMandatory ? 'bg-gradient-to-br from-red-100 to-red-200' : 'bg-gradient-to-br from-blue-100 to-blue-200'
            } hover:scale-110 transition-transform`}>
                <FaIdCard className={`text-xl ${
                    document.isMandatory ? 'text-red-600' : 'text-blue-600'
                }`} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-bold text-slate-900">{document.name}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold hover:scale-105 transition-transform ${
                        document.isMandatory
                            ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 border border-red-200'
                            : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-200'
                    }`}>
                        {document.isMandatory ? 'Required' : 'Optional'}
                    </span>
                </div>
                {document.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{document.description}</p>
                )}
            </div>
        </div>
    </motion.div>
);

const BookingStep = ({ number, title, description, icon: Icon }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex items-start gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all"
    >
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
            <span className="text-sm font-bold text-white">{number}</span>
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="text-green-600 text-sm" />
                <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
            </div>
            <p className="text-xs text-slate-600">{description}</p>
        </div>
    </motion.div>
);

const TimelineStep = ({ icon: Icon, title, description, color }) => {
    const colorClasses = {
        green: 'bg-gradient-to-br from-green-100 to-emerald-200 border-green-200 text-green-700',
        blue: 'bg-gradient-to-br from-blue-100 to-indigo-200 border-blue-200 text-blue-700',
        purple: 'bg-gradient-to-br from-purple-100 to-violet-200 border-purple-200 text-purple-700',
        emerald: 'bg-gradient-to-br from-emerald-100 to-teal-200 border-emerald-200 text-emerald-700'
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`flex items-center gap-3 p-3 rounded-xl border ${colorClasses[color]} hover:shadow-sm transition-all`}
        >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className={`text-${color}-600`} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{description}</p>
            </div>
        </motion.div>
    );
};

const PriorityTag = ({ icon: Icon, text, color }) => {
    const colorClasses = {
        blue: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 text-blue-700',
        pink: 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200 text-pink-700',
        green: 'bg-gradient-to-br from-green-100 to-emerald-200 border-green-200 text-green-700'
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-3 p-3 rounded-xl border ${colorClasses[color]} hover:shadow-sm transition-all`}
        >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                <Icon className={`text-lg text-${color}-600`} />
            </div>
            <span className="text-sm font-medium">{text}</span>
        </motion.div>
    );
};

const DepartmentInfoItem = ({ icon: Icon, label, value, href }) => (
    <motion.div 
        whileHover={{ scale: 1.01 }}
        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
    >
        <div className="w-8 h-8 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-110 transition-transform">
            <Icon className="text-slate-600 text-sm" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            {href ? (
                <a
                    href={href}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all hover:underline"
                >
                    {value}
                </a>
            ) : (
                <p className="text-sm text-slate-900 font-medium wrap-break-word">{value}</p>
            )}
        </div>
    </motion.div>
);

export default ServiceDetails;