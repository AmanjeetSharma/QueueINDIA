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
    FiX
} from 'react-icons/fi';
import {
    FaRegFilePdf,
    FaRegFileImage,
    FaRegFileWord,
    FaRegFileAlt,
    FaClipboardCheck,
    FaTimesCircle,
    FaCheckCircle,
    FaBan
} from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';
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

    useEffect(() => {
        if (bookingId) {
            getBookingDetailsForOfficer(bookingId);
        }
        return () => clearCurrentBooking();
    }, [bookingId, getBookingDetailsForOfficer, clearCurrentBooking]);

    const handleBack = () => {
        navigate('/department/bookings');
    };

    const handleApproveDocument = async (docId) => {
        try {
            await approveBooking(bookingId, docId);
        } catch (err) {
            // Error handled in context
        }
    };

    const handleRejectDocument = async (docId, reason) => {
        if (!reason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        try {
            await rejectDocument(bookingId, docId, reason);
            setShowDocumentReject(null);
        } catch (err) {
            // Error handled in context
        }
    };

    const handleCompleteBooking = async () => {
        try {
            await completeBooking(bookingId);
            setTimeout(() => navigate('/department/bookings'), 1000);
        } catch (err) {
            // Error handled in context
        }
    };

    const handleCancelBooking = async () => {
        try {
            await cancelBooking(bookingId);
            setTimeout(() => navigate('/department/bookings'), 1000);
        } catch (err) {
            // Error handled in context
        }
    };

    const handleRejectBooking = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        try {
            await rejectBooking(bookingId, rejectionReason);
            setShowRejectConfirm(false);
            setTimeout(() => navigate('/department/bookings'), 1000);
        } catch (err) {
            setShowRejectConfirm(false);
        }
    };

    const copyBookingId = () => {
        if (currentBooking?._id) {
            navigator.clipboard.writeText(currentBooking._id);
            setCopiedId(true);
            toast.success('Booking ID copied', { duration: 1500, position: 'bottom-center' });
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    const downloadDocument = (doc) => {
        if (doc.documentUrl) {
            const link = document.createElement('a');
            link.href = doc.documentUrl;
            link.download = doc.name || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast.error('Document URL not available', { duration: 2000, position: 'bottom-center' });
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle className="w-3 h-3" /> },
            'DOCS_SUBMITTED': { color: 'bg-blue-100 text-blue-800', icon: <FiFileText className="w-3 h-3" /> },
            'UNDER_REVIEW': { color: 'bg-purple-100 text-purple-800', icon: <FiAlertCircle className="w-3 h-3" /> },
            'APPROVED': { color: 'bg-green-100 text-green-800', icon: <FiCheck className="w-3 h-3" /> },
            'REJECTED': { color: 'bg-red-100 text-red-800', icon: <FiXCircle className="w-3 h-3" /> },
            'CANCELLED': { color: 'bg-gray-100 text-gray-800', icon: <FiXCircle className="w-3 h-3" /> },
            'COMPLETED': { color: 'bg-indigo-100 text-indigo-800', icon: <FiCheck className="w-3 h-3" /> },
        };
        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: <FiAlertCircle className="w-3 h-3" /> };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                <span>{status?.replace('_', ' ')}</span>
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'NORMAL': { color: 'bg-gray-100 text-gray-800' },
            'PRIORITY': { color: 'bg-yellow-100 text-yellow-800' },
            'EMERGENCY': { color: 'bg-red-100 text-red-800' },
            'SENIOR_CITIZEN': { color: 'bg-orange-100 text-orange-800' }
        };
        const config = priorityConfig[priority] || { color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {priority?.replace('_', ' ')}
            </span>
        );
    };

    const getDocumentIcon = (fileName) => {
        if (!fileName) return <FaRegFileAlt className="w-4 h-4 text-gray-500" />;
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FaRegFilePdf className="w-4 h-4 text-red-500" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FaRegFileImage className="w-4 h-4 text-blue-500" />;
        if (['doc', 'docx'].includes(ext)) return <FaRegFileWord className="w-4 h-4 text-blue-600" />;
        return <FaRegFileAlt className="w-4 h-4 text-gray-500" />;
    };

    const getDocumentStatusBadge = (status) => {
        const config = {
            'APPROVED': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="w-3 h-3" /> },
            'REJECTED': { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="w-3 h-3" /> },
            'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle className="w-3 h-3" /> }
        };
        const { color, icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: null };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {icon}
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const canApproveBooking = currentBooking?.submittedDocs?.every(doc => doc.status === 'APPROVED');
    const hasDocuments = currentBooking?.submittedDocs?.length > 0;
    const hasValidDocumentUrl = (doc) => doc && doc.documentUrl && doc.documentUrl.trim() !== '';

    if (loading && !currentBooking) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-center"
                >
                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-cyan-500 animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400">Loading booking details...</p>
                </motion.div>
            </div>
        );
    }

    if (error && !currentBooking) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-900">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
                    <motion.button
                        whileHover={{ x: -4 }}
                        onClick={handleBack}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mb-4"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back
                    </motion.button>
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center"
                    >
                        <FiXCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <h3 className="text-sm font-medium text-gray-100 mb-1">Error Loading Booking</h3>
                        <p className="text-xs text-gray-400 mb-3">{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium"
                        >
                            Go Back
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-900 text-white pb-6"
        >
            {/* Header */}
            <motion.header
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30"
            >
                <div className="px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </motion.button>

                        <div className="flex-1 min-w-0 px-3">
                            <h1 className="text-sm sm:text-base font-bold truncate">Booking Details</h1>
                            <div className="flex items-center gap-1 mt-0.5">
                                <p className="text-xs text-gray-400 truncate">{currentBooking?._id?.slice(0, 12)}...</p>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyBookingId}
                                    className="text-gray-500 hover:text-gray-300 p-0.5"
                                >
                                    <FiCopy className="w-3 h-3" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
                    {/* Quick Info Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
                    >
                        {[
                            { icon: FiUser, label: 'User', value: currentBooking?.userName || 'N/A' },
                            { icon: FiCalendar, label: 'Date', value: formatDate(currentBooking?.date) },
                            { icon: FiClock, label: 'Time', value: currentBooking?.slotTime || '--:--' },
                            { icon: FiFileText, label: 'Service', value: currentBooking?.service?.name || 'N/A' }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-400">{item.label}</p>
                                            <p className="text-xs sm:text-sm font-medium truncate">{item.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Left - Documents & Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-3 sm:space-y-4"
                        >
                            {/* Tabs */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                                <div className="flex border-b border-gray-700">
                                    {[
                                        { id: 'documents', label: 'Documents', icon: FiFileText },
                                        { id: 'details', label: 'Details', icon: FiInfo }
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${activeTab === tab.id
                                                    ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-800/50'
                                                    : 'text-gray-400 hover:text-gray-300'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{tab.label}</span>
                                            </motion.button>
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
                                            className="p-3 sm:p-4"
                                        >
                                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                <span>Submitted Documents</span>
                                                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{currentBooking?.submittedDocs?.length || 0}</span>
                                            </h3>

                                            {!hasDocuments ? (
                                                <motion.div
                                                    initial={{ scale: 0.95 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-center py-6 border-2 border-dashed border-gray-700 rounded-lg"
                                                >
                                                    <FiFileText className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                                                    <p className="text-xs text-gray-400">No documents submitted</p>
                                                </motion.div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {currentBooking?.submittedDocs?.map((doc, idx) => (
                                                        <motion.div
                                                            key={doc._id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="border border-gray-700 rounded-lg p-2.5 sm:p-3 hover:border-gray-600 transition-colors"
                                                        >
                                                            {/* Document Header */}
                                                            <div className="flex items-start gap-2 cursor-pointer" onClick={() => setExpandedDoc(expandedDoc === doc._id ? null : doc._id)}>
                                                                {getDocumentIcon(doc.name)}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                                        <p className="text-xs sm:text-sm font-medium truncate">{doc.name}</p>
                                                                        {getDocumentStatusBadge(doc.status)}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Expanded Details */}
                                                            <AnimatePresence>
                                                                {expandedDoc === doc._id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="mt-3 pt-3 border-t border-gray-700 space-y-2"
                                                                    >
                                                                        {/* Rejection Reason */}
                                                                        {doc.rejectionReason && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                className="text-xs text-red-400 bg-red-900/20 border border-red-700/30 p-2 rounded"
                                                                            >
                                                                                <span className="font-bold">Rejection: </span>{doc.rejectionReason}
                                                                            </motion.div>
                                                                        )}

                                                                        {/* Download Button */}
                                                                        {hasValidDocumentUrl(doc) && (
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.02 }}
                                                                                whileTap={{ scale: 0.98 }}
                                                                                onClick={() => downloadDocument(doc)}
                                                                                className="w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                                                            >
                                                                                <FiDownload className="w-3 h-3" />
                                                                                Download
                                                                            </motion.button>
                                                                        )}

                                                                        {/* Actions for Pending Docs */}
                                                                        {doc.status === 'PENDING' && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                className="space-y-2 pt-2 border-t border-gray-700"
                                                                            >
                                                                                {showDocumentReject === doc._id ? (
                                                                                    <div className="space-y-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Rejection reason..."
                                                                                            id={`reject-reason-${doc._id}`}
                                                                                            className="w-full px-2 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-red-500 outline-none"
                                                                                        />
                                                                                        <div className="flex gap-2">
                                                                                            <motion.button
                                                                                                whileHover={{ scale: 1.02 }}
                                                                                                whileTap={{ scale: 0.98 }}
                                                                                                onClick={() => {
                                                                                                    const reason = document.getElementById(`reject-reason-${doc._id}`)?.value || '';
                                                                                                    handleRejectDocument(doc._id, reason);
                                                                                                }}
                                                                                                className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                                                                                            >
                                                                                                Submit
                                                                                            </motion.button>
                                                                                            <motion.button
                                                                                                whileHover={{ scale: 1.02 }}
                                                                                                whileTap={{ scale: 0.98 }}
                                                                                                onClick={() => setShowDocumentReject(null)}
                                                                                                className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded"
                                                                                            >
                                                                                                Cancel
                                                                                            </motion.button>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex gap-2">
                                                                                        <motion.button
                                                                                            whileHover={{ scale: 1.02 }}
                                                                                            whileTap={{ scale: 0.98 }}
                                                                                            onClick={() => handleApproveDocument(doc._id)}
                                                                                            className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-1"
                                                                                        >
                                                                                            <FiCheck className="w-3 h-3" />
                                                                                            Approve
                                                                                        </motion.button>
                                                                                        <motion.button
                                                                                            whileHover={{ scale: 1.02 }}
                                                                                            whileTap={{ scale: 0.98 }}
                                                                                            onClick={() => setShowDocumentReject(doc._id)}
                                                                                            className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded flex items-center justify-center gap-1"
                                                                                        >
                                                                                            <FiXCircle className="w-3 h-3" />
                                                                                            Reject
                                                                                        </motion.button>
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        )}
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
                                            className="p-3 sm:p-4 space-y-4"
                                        >
                                            {/* User Info */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">User Information</h4>
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Name:</span>
                                                        <span className="font-medium">{currentBooking?.userName}</span>
                                                    </div>
                                                    {currentBooking?.email && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Email:</span>
                                                            <span className="font-medium truncate ml-2">{currentBooking.email}</span>
                                                        </div>
                                                    )}
                                                    {currentBooking?.phone && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Phone:</span>
                                                            <span className="font-medium">{currentBooking.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Booking Info */}
                                            <div className="border-t border-gray-700 pt-3">
                                                <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">Booking Information</h4>
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Service:</span>
                                                        <span className="font-medium">{currentBooking?.service?.name}</span>
                                                    </div>
                                                    {currentBooking?.tokenNumber && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Token:</span>
                                                            <span className="font-medium">#{currentBooking.tokenNumber}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Booking Created on:</span>
                                                        <span className="font-medium">{formatDate(currentBooking?.createdAt)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">User's ID:</span>
                                                        <span className="font-medium">{currentBooking?.user}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Booking Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4"
                            >
                                <h3 className="text-sm font-bold text-white mb-3">Booking Actions</h3>
                                <div className="space-y-2">
                                    {/* Complete & Cancel */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCompleteBooking}
                                            disabled={currentBooking?.status !== 'APPROVED' || !canApproveBooking}
                                            className="flex-1 px-2.5 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center gap-1"
                                        >
                                            <FaClipboardCheck className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Complete</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCancelBooking}
                                            disabled={currentBooking?.status === 'COMPLETED'}
                                            className="flex-1 px-2.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center gap-1"
                                        >
                                            <FaBan className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Cancel</span>
                                        </motion.button>
                                    </div>

                                    {/* Reject Booking */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            placeholder="Rejection reason..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="flex-1 px-2.5 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-red-500 outline-none"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowRejectConfirm(true)}
                                            disabled={!rejectionReason.trim()}
                                            className="px-2.5 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded whitespace-nowrap flex items-center justify-center gap-1"
                                        >
                                            <FaTimesCircle className="w-3 h-3" />
                                            <span className="hidden sm:inline">Reject</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right - Status & Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            {/* Status Card */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4">
                                <h3 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wide">Status Overview</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        {getStatusBadge(currentBooking?.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Priority:</span>
                                        {getPriorityBadge(currentBooking?.priorityType)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Documents:</span>
                                        <span className="font-medium">
                                            {currentBooking?.submittedDocs?.filter(d => d.status === 'APPROVED').length || 0}/{currentBooking?.submittedDocs?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4">
                                <h3 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wide">Quick Actions</h3>
                                <div className="space-y-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBack}
                                        className="w-full px-2.5 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-1"
                                    >
                                        <FiArrowLeft className="w-3 h-3" />
                                        Back to List
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={copyBookingId}
                                        className={`w-full px-2.5 py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1 transition-colors ${copiedId ? 'bg-green-600 text-white' : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                                            }`}
                                    >
                                        <FiCopy className="w-3 h-3" />
                                        {copiedId ? 'Copied!' : 'Copy Booking ID'}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Department Info */}
                            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 sm:p-4">
                                <h3 className="text-xs font-bold text-blue-300 mb-2">Department</h3>
                                <p className="text-xs text-blue-200 truncate mb-2">{currentBooking?.department?.name}</p>
                                <p className="text-xs text-blue-300">Officer: {user?.name?.split(' ')[0]}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Reject Confirmation Modal */}
            <AnimatePresence>
                {showRejectConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                        onClick={() => setShowRejectConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-900/30 border border-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white">Reject Entire Booking?</h3>
                                        <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowRejectConfirm(false)}
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <div className="bg-gray-700/30 border border-gray-600 rounded p-2 mb-4">
                                    <p className="text-xs text-gray-400 mb-1">Reason:</p>
                                    <p className="text-xs text-gray-200">{rejectionReason}</p>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowRejectConfirm(false)}
                                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleRejectBooking}
                                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                                    >
                                        Reject Booking
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BookingDetailsPage;