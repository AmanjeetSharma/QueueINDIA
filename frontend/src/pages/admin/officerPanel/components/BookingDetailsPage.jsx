import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartmentOfficer } from '../../../../context/DepartmentOfficerContext';
import { useAuth } from '../../../../context/AuthContext';
import {
    FiArrowLeft,
    FiUser,
    FiCalendar,
    FiClock,
    FiFileText,
    FiCheck,
    FiXCircle,
    FiAlertCircle,
    FiMail,
    FiPhone,
    FiInfo,
    FiDownload,
    FiCopy,
    FiX,
    FiChevronDown,
    FiChevronUp,
    FiEye,
    FiCheckCircle,
    FiClock as FiClockIcon,
    FiShield,
    FiTag,
    FiUsers
} from 'react-icons/fi';
import {
    FaRegFilePdf,
    FaRegFileImage,
    FaRegFileWord,
    FaRegFileAlt,
    FaClipboardCheck,
    FaTimesCircle,
    FaCheckCircle,
    FaBan,
    FaExclamationTriangle,
    FaIdCard,
    FaCalendarAlt,
    FaClock,
    FaUserCircle,
    FaEnvelope,
    FaPhoneAlt,
    FaBuilding
} from 'react-icons/fa';
import { MdPriorityHigh, MdOutlineEmergency } from 'react-icons/md';
import { MdElderly } from "react-icons/md";
import toast from 'react-hot-toast';

const BookingDetailsPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const {
        currentBooking,
        loading,
        error,
        getBookingDetailsForOfficer,
        approveBooking,
        rejectDocument,
        rejectBooking,
        cancelBooking,
        completeBooking,
        clearCurrentBooking
    } = useDepartmentOfficer();

    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('documents');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showDocumentReject, setShowDocumentReject] = useState(null);
    const [copiedId, setCopiedId] = useState(false);
    const [expandedDoc, setExpandedDoc] = useState(null);
    const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);

    useEffect(() => {
        if (bookingId) {
            getBookingDetailsForOfficer(bookingId);
        }
        return () => clearCurrentBooking();
    }, [bookingId, getBookingDetailsForOfficer, clearCurrentBooking]);

    const handleBack = () => navigate('/department/bookings');

    const handleApproveDocument = async (docId) => {
        try {
            await approveBooking(bookingId, docId);
        } catch (err) { }
    };

    const handleRejectDocument = async (docId, reason) => {
        if (!reason?.trim()) {
            return;
        }
        try {
            await rejectDocument(bookingId, docId, reason);
            setShowDocumentReject(null);
            toast.success('Document rejected', { icon: '❌', duration: 2000 });
        } catch (err) { }
    };

    const handleCompleteBooking = async () => {
        try {
            await completeBooking(bookingId);
            toast.success('Booking completed successfully', { icon: '🎉', duration: 2000 });
            setTimeout(() => navigate('/department/bookings'), 1500);
        } catch (err) { }
    };

    const handleCancelBooking = async () => {
        try {
            await cancelBooking(bookingId);
            toast.success('Booking cancelled', { icon: '🚫', duration: 2000 });
            setTimeout(() => navigate('/department/bookings'), 1500);
        } catch (err) { }
    };

    const handleRejectBooking = async () => {
        if (!rejectionReason?.trim()) {
            toast.error('Please provide a rejection reason', { icon: '⚠️', duration: 2000 });
            return;
        }
        try {
            await rejectBooking(bookingId, rejectionReason);
            toast.success('Booking rejected', { icon: '❌', duration: 2000 });
            setShowRejectConfirm(false);
            setTimeout(() => navigate('/department/bookings'), 1500);
        } catch (err) {
            setShowRejectConfirm(false);
        }
    };

    const copyBookingId = () => {
        if (currentBooking?._id) {
            navigator.clipboard.writeText(currentBooking._id);
            setCopiedId(true);
            toast.success('Booking ID copied to clipboard', { icon: '📋', duration: 1500 });
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    const downloadDocument = (doc) => {
        if (doc?.documentUrl) {
            const link = document.createElement('a');
            link.href = doc.documentUrl;
            link.download = doc.name || 'document';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Download started', { icon: '📥', duration: 1500 });
        } else {
            toast.error('Document URL not available', { icon: '❌', duration: 2000 });
        }
    };

    const previewDocument = (doc) => {
        if (doc?.documentUrl) {
            setSelectedDocForPreview(doc);
        } else {
            toast.error('Cannot preview this document', { icon: '🔍', duration: 2000 });
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <FiClockIcon className="w-3 h-3" />, label: 'Pending' },
            'DOCS_SUBMITTED': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <FiFileText className="w-3 h-3" />, label: 'Docs Submitted' },
            'UNDER_REVIEW': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <FiEye className="w-3 h-3" />, label: 'Under Review' },
            'APPROVED': { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <FiCheck className="w-3 h-3" />, label: 'Approved' },
            'REJECTED': { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <FiXCircle className="w-3 h-3" />, label: 'Rejected' },
            'CANCELLED': { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: <FiXCircle className="w-3 h-3" />, label: 'Cancelled' },
            'COMPLETED': { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: <FiCheckCircle className="w-3 h-3" />, label: 'Completed' },
        };
        const config = statusConfig[status] || statusConfig['PENDING'];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.icon}
                <span>{config.label}</span>
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'NORMAL': { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: <FiTag className="w-3 h-3" /> },
            'PRIORITY': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <MdPriorityHigh className="w-3 h-3" /> },
            'EMERGENCY': { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <MdOutlineEmergency className="w-3 h-3" /> },
            'SENIOR_CITIZEN': { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: <MdElderly className="w-3 h-3" /> }
        };
        const config = priorityConfig[priority] || priorityConfig['NORMAL'];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.icon}
                <span>{priority?.replace('_', ' ')}</span>
            </span>
        );
    };

    const getDocumentIcon = (fileName) => {
        if (!fileName) return <FaRegFileAlt className="w-5 h-5 text-gray-500" />;
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FaRegFilePdf className="w-5 h-5 text-red-400" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FaRegFileImage className="w-5 h-5 text-blue-400" />;
        if (['doc', 'docx'].includes(ext)) return <FaRegFileWord className="w-5 h-5 text-blue-400" />;
        return <FaRegFileAlt className="w-5 h-5 text-gray-400" />;
    };

    const getDocumentStatusBadge = (status) => {
        const config = {
            'APPROVED': { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <FaCheckCircle className="w-3 h-3" /> },
            'REJECTED': { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <FaTimesCircle className="w-3 h-3" /> },
            'PENDING': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <FiClockIcon className="w-3 h-3" /> }
        };
        const { color, icon } = config[status] || config['PENDING'];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
                {icon}
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        return timeString;
    };

    const canApproveBooking = currentBooking?.submittedDocs?.every(doc => doc.status === 'APPROVED');
    const hasDocuments = currentBooking?.submittedDocs?.length > 0;
    const hasValidDocumentUrl = (doc) => doc && doc.documentUrl && doc.documentUrl.trim() !== '';

    const approvedCount = currentBooking?.submittedDocs?.filter(d => d.status === 'APPROVED').length || 0;
    const totalDocs = currentBooking?.submittedDocs?.length || 0;
    const progressPct = totalDocs > 0 ? Math.round((approvedCount / totalDocs) * 100) : 0;

    const ease = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

    if (loading && !currentBooking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error && !currentBooking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <button onClick={handleBack} className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mb-4 sm:mb-6 gap-2">
                        <FiArrowLeft /> Back to Bookings
                    </button>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 sm:p-8 text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiXCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-2">Error Loading Booking</h3>
                        <p className="text-sm text-gray-400 mb-6">{error}</p>
                        <button onClick={handleBack} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* ── Sticky Header ─────────────────────────────────── */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-6">
                    <div className="flex items-center h-14 gap-2 sm:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Title + ID */}
                        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                            <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                                Booking Details
                            </h1>
                            <div className="hidden xs:flex sm:hidden lg:flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 rounded-lg border border-gray-600">
                                <span className="text-xs text-gray-400 font-mono">
                                    {currentBooking?._id?.slice(0, 6)}...{currentBooking?._id?.slice(-4)}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyBookingId}
                                    className={`transition-colors ${copiedId ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <FiCopy className="w-3 h-3" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Page Body ─────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-8 sm:pb-10">

                {/* ── Hero Banner ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={ease}
                    className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6"
                >
                    {/* Subtle accent stripe */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500" />

                    <div className="p-4 sm:p-6">
                        {/* User + service row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-white text-sm sm:text-base truncate">{currentBooking?.userName || 'N/A'}</p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {currentBooking?.email || 'No email'} {currentBooking?.phone ? `· ${currentBooking.phone}` : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {currentBooking?.tokenNumber && (
                                    <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <FaIdCard className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-xs font-medium text-blue-300">Token #{currentBooking.tokenNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats strip - 2 columns on mobile, 4 on sm+ */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {[
                                { icon: FaCalendarAlt, label: 'Date', value: formatDate(currentBooking?.date), color: 'text-purple-400' },
                                { icon: FaClock, label: 'Time', value: formatTime(currentBooking?.slotTime), color: 'text-green-400' },
                                { icon: FaBuilding, label: 'Service', value: currentBooking?.service?.name || 'N/A', color: 'text-cyan-400' },
                                { icon: FaUserCircle, label: 'Officer handling', value: user?.name || 'N/A', color: 'text-blue-400' },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="bg-gray-700/30 border border-gray-600/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${item.color}`} />
                                            <span className="text-xs text-gray-400">{item.label}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium truncate">{item.value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── Main Two-Column Layout ─────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                    {/* ── LEFT: Tabs (Documents / Details) + Actions ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...ease, delay: 0.05 }}
                        className="lg:col-span-2 flex flex-col gap-4 sm:gap-5"
                    >
                        {/* Tab Panel */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
                            {/* Tab Bar */}
                            <div className="flex border-b border-gray-700 bg-gray-800/30">
                                {[
                                    { id: 'documents', label: 'Documents', icon: FiFileText, count: totalDocs },
                                    { id: 'details', label: 'Details', icon: FiInfo }
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 py-3 px-3 sm:py-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 relative border-b-2 ${isActive
                                                ? 'text-blue-400 border-blue-500 bg-blue-500/5'
                                                : 'text-gray-400 hover:text-gray-300 border-transparent hover:bg-gray-700/30'
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="hidden xs:inline">{tab.label}</span>
                                            {tab.count > 0 && (
                                                <span className={`text-xs px-1 py-0.5 rounded-full font-medium ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'documents' && (
                                    <motion.div
                                        key="documents"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="p-4 sm:p-5"
                                    >
                                        {/* Docs header with progress */}
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                <FiFileText className="w-4 h-4 text-blue-400" />
                                                <span className="hidden xs:inline">Submitted Documents</span>
                                                <span className="xs:hidden">Docs</span>
                                            </h3>
                                        </div>

                                        {!hasDocuments ? (
                                            <div className="text-center py-10 sm:py-14 border-2 border-dashed border-gray-700 rounded-xl">
                                                <FiFileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-600 mb-3" />
                                                <p className="text-xs sm:text-sm text-gray-400">No documents submitted yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 sm:space-y-2.5">
                                                {currentBooking?.submittedDocs?.map((doc, idx) => (
                                                    <motion.div
                                                        key={doc._id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                                                        className="bg-gray-800/40 border border-gray-700 rounded-lg sm:rounded-xl overflow-hidden"
                                                    >
                                                        {/* Doc row */}
                                                        <div
                                                            className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3.5 cursor-pointer hover:bg-gray-700/30 transition-colors"
                                                            onClick={() => setExpandedDoc(expandedDoc === doc._id ? null : doc._id)}
                                                        >
                                                            <div className="p-1.5 sm:p-2 bg-gray-700/60 rounded-lg flex-shrink-0">
                                                                {getDocumentIcon(doc.name)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs sm:text-sm font-medium truncate">{doc.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    {formatDate(doc.uploadedAt || doc.createdAt)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                                                {getDocumentStatusBadge(doc.status)}
                                                                <motion.span
                                                                    animate={{ rotate: expandedDoc === doc._id ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="text-gray-500"
                                                                >
                                                                    <FiChevronDown className="w-4 h-4" />
                                                                </motion.span>
                                                            </div>
                                                        </div>

                                                        {/* Expanded area */}
                                                        <AnimatePresence>
                                                            {expandedDoc === doc._id && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.22 }}
                                                                    className="border-t border-gray-700"
                                                                >
                                                                    <div className="p-3 sm:p-4 space-y-3">
                                                                        {doc.rejectionReason && (
                                                                            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-2 sm:p-3 rounded-lg">
                                                                                <FaExclamationTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                                                <div>
                                                                                    <p className="font-medium text-xs sm:text-sm mb-0.5">Rejection Reason</p>
                                                                                    <p className="text-xs text-red-300">{doc.rejectionReason}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Preview / Download row */}
                                                                        {hasValidDocumentUrl(doc) && (
                                                                            <div className="flex gap-2">
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.02 }}
                                                                                    whileTap={{ scale: 0.98 }}
                                                                                    onClick={() => previewDocument(doc)}
                                                                                    className="flex-1 px-2 sm:px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                                                >
                                                                                    <FiEye className="w-3.5 h-3.5" />
                                                                                    <span className="hidden xs:inline">Preview</span>
                                                                                </motion.button>
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.02 }}
                                                                                    whileTap={{ scale: 0.98 }}
                                                                                    onClick={() => downloadDocument(doc)}
                                                                                    className="flex-1 px-2 sm:px-3 py-2 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                                                >
                                                                                    <FiDownload className="w-3.5 h-3.5" />
                                                                                    <span className="hidden xs:inline">Download</span>
                                                                                </motion.button>
                                                                            </div>
                                                                        )}

                                                                        {/* Approve / Reject doc */}
                                                                        {doc.status === 'PENDING' && (
                                                                            showDocumentReject === doc._id ? (
                                                                                <div className="space-y-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Enter rejection reason..."
                                                                                        id={`reject-reason-${doc._id}`}
                                                                                        className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 outline-none transition-colors"
                                                                                        autoFocus
                                                                                    />
                                                                                    <div className="flex gap-2">
                                                                                        <motion.button
                                                                                            whileHover={{ scale: 1.02 }}
                                                                                            whileTap={{ scale: 0.98 }}
                                                                                            onClick={() => {
                                                                                                const reason = document.getElementById(`reject-reason-${doc._id}`)?.value || '';
                                                                                                handleRejectDocument(doc._id, reason);
                                                                                            }}
                                                                                            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                                                        >
                                                                                            Submit
                                                                                        </motion.button>
                                                                                        <motion.button
                                                                                            whileHover={{ scale: 1.02 }}
                                                                                            whileTap={{ scale: 0.98 }}
                                                                                            onClick={() => setShowDocumentReject(null)}
                                                                                            className="flex-1 px-3 py-2 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                                                        >
                                                                                            Cancel
                                                                                        </motion.button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.98 }}
                                                                                        onClick={() => handleApproveDocument(doc._id)}
                                                                                        className="px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                                                    >
                                                                                        <FiCheck className="w-3.5 h-3.5" /> Approve
                                                                                    </motion.button>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.98 }}
                                                                                        onClick={() => setShowDocumentReject(doc._id)}
                                                                                        className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                                                    >
                                                                                        <FiXCircle className="w-3.5 h-3.5" /> Reject
                                                                                    </motion.button>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'details' && (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="p-4 sm:p-5 space-y-4 sm:space-y-5"
                                    >
                                        {/* User Info */}
                                        <section>
                                            <h4 className="text-xs font-semibold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <FiUsers className="w-3.5 h-3.5" /> User Information
                                            </h4>
                                            <div className="bg-gray-700/20 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <FaUserCircle className="w-8 h-8 sm:w-9 sm:h-9 text-blue-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{currentBooking?.userName}</p>
                                                        <p className="text-xs text-gray-400">User ID: {currentBooking?.user}</p>
                                                    </div>
                                                </div>
                                                {currentBooking?.email && (
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                        <FaEnvelope className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-gray-300 truncate">{currentBooking.email}</span>
                                                    </div>
                                                )}
                                                {currentBooking?.phone && (
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                        <FaPhoneAlt className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-gray-300">{currentBooking.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Booking Info */}
                                        <section>
                                            <h4 className="text-xs font-semibold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <FiInfo className="w-3.5 h-3.5" /> Booking Information
                                            </h4>
                                            <div className="bg-gray-700/20 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4 gap-y-2 sm:gap-y-3 text-xs sm:text-sm">
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-0.5">Service</p>
                                                        <p className="font-medium">{currentBooking?.service?.name}</p>
                                                    </div>
                                                    {currentBooking?.tokenNumber && (
                                                        <div>
                                                            <p className="text-xs text-gray-400 mb-0.5">Token Number</p>
                                                            <p className="font-medium text-blue-400">#{currentBooking.tokenNumber}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-0.5">Created</p>
                                                        <p className="text-xs sm:text-sm">{formatDate(currentBooking?.createdAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-0.5">Updated</p>
                                                        <p className="text-xs sm:text-sm">{formatDate(currentBooking?.updatedAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Booking Actions Panel ─────────────────── */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-700 bg-gray-800/30">
                                <FiCheckCircle className="w-4 h-4 text-green-400" />
                                <h3 className="text-sm font-semibold text-white">Booking Actions</h3>
                            </div>

                            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                                {/* Complete + Cancel */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCompleteBooking}
                                        disabled={currentBooking?.status !== 'APPROVED' || !canApproveBooking}
                                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2"
                                    >
                                        <FaClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>Complete</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCancelBooking}
                                        disabled={currentBooking?.status === 'COMPLETED' || currentBooking?.status === 'CANCELLED'}
                                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2"
                                    >
                                        <FaBan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>Cancel</span>
                                    </motion.button>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-1 h-px bg-gray-700" />
                                    <span className="text-xs text-gray-500 whitespace-nowrap px-1">or reject entire booking</span>
                                    <div className="flex-1 h-px bg-gray-700" />
                                </div>

                                {/* Reject booking */}
                                <div className="space-y-2 sm:space-y-2.5">
                                    <input
                                        type="text"
                                        placeholder="Enter rejection reason..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-orange-500 outline-none transition-colors"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setShowRejectConfirm(true)}
                                        disabled={!rejectionReason?.trim()}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2"
                                    >
                                        <FaTimesCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        Reject Entire Booking
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── RIGHT: Status sidebar ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...ease, delay: 0.1 }}
                        className="flex flex-col gap-3 sm:gap-4"
                    >
                        {/* Status Overview */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-gray-700 bg-gray-800/30">
                                <FiInfo className="w-4 h-4 text-gray-400" />
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status Overview</h3>
                            </div>
                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-400">Booking Status</span>
                                    {getStatusBadge(currentBooking?.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-400">Priority</span>
                                    {getPriorityBadge(currentBooking?.priorityType)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-400">Documents</span>
                                    <span className="text-xs sm:text-sm font-medium">{approvedCount}/{totalDocs}</span>
                                </div>

                                {hasDocuments && (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Approval Progress</span>
                                            <span className="text-blue-400 font-medium">{progressPct}%</span>
                                        </div>
                                        <div className="h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ duration: 0.4, delay: 0.15 }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-gray-700 bg-gray-800/30">
                                <FiClock className="w-4 h-4 text-gray-400" />
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</h3>
                            </div>
                            <div className="p-2 sm:p-3 space-y-1.5">
                                <motion.button
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBack}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-300 bg-gray-700/40 hover:bg-gray-700 rounded-lg sm:rounded-xl transition-all flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-2">
                                        <FiArrowLeft className="w-4 h-4" />
                                        Back to List
                                    </span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={copyBookingId}
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all flex items-center justify-between ${copiedId ? 'bg-green-600 text-white' : 'text-gray-300 bg-gray-700/40 hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <FiCopy className="w-4 h-4" />
                                        {copiedId ? 'Copied!' : 'Copy Booking ID'}
                                    </span>
                                    {!copiedId && <span className="text-xs text-gray-500">📋</span>}
                                </motion.button>
                            </div>
                        </div>

                        {/* Officer badge */}
                        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiShield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-300">{user?.name || 'N/A'}</p>
                                <p className="text-xs text-blue-400/60">Department Officer</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Document Preview Modal ─────────────────────────── */}
            <AnimatePresence>
                {selectedDocForPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
                        onClick={() => setSelectedDocForPreview(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-4xl bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    {getDocumentIcon(selectedDocForPreview.name)}
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-medium text-white truncate">{selectedDocForPreview.name}</h3>
                                        <p className="text-xs text-gray-400">Document Preview</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDocForPreview(null)}
                                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-900/50 max-h-[60vh] sm:max-h-[70vh] overflow-auto">
                                {selectedDocForPreview.documentUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img
                                        src={selectedDocForPreview.documentUrl}
                                        alt={selectedDocForPreview.name}
                                        className="w-full h-auto rounded-lg sm:rounded-xl"
                                    />
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <FaRegFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3" />
                                        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">Preview not available for this file type</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => downloadDocument(selectedDocForPreview)}
                                            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg inline-flex items-center gap-2"
                                        >
                                            <FiDownload className="w-4 h-4" /> Download to View
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 p-3 sm:p-4 border-t border-gray-700">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => downloadDocument(selectedDocForPreview)}
                                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FiDownload className="w-4 h-4" /> Download
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDocForPreview(null)}
                                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Reject Confirmation Modal ──────────────────────── */}
            <AnimatePresence>
                {showRejectConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
                        onClick={() => setShowRejectConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal accent */}
                            <div className="h-0.5 bg-gradient-to-r from-orange-500 to-red-500" />
                            <div className="p-4 sm:p-6">
                                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-white mb-1">Reject Entire Booking?</h3>
                                        <p className="text-xs sm:text-sm text-gray-400">This action cannot be undone. The user will be notified.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-3.5 mb-4 sm:mb-5">
                                    <p className="text-xs text-gray-400 mb-1">Rejection Reason</p>
                                    <p className="text-xs sm:text-sm text-gray-300">{rejectionReason}</p>
                                </div>
                                <div className="flex gap-2 sm:gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowRejectConfirm(false)}
                                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg sm:rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleRejectBooking}
                                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg sm:rounded-xl transition-all"
                                    >
                                        Reject Booking
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingDetailsPage;