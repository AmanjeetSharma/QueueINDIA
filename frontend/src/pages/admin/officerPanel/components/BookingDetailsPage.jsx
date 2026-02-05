// pages/admin/officerPanel/BookingDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    FiExternalLink,
    FiPrinter,
    FiEye
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
    const [showDocumentReject, setShowDocumentReject] = useState(null); // Stores which doc is being rejected

    useEffect(() => {
        if (bookingId) {
            getBookingDetailsForOfficer(bookingId);
        }

        return () => {
            clearCurrentBooking();
        };
    }, [bookingId, getBookingDetailsForOfficer, clearCurrentBooking]);

    const handleBack = () => {
        navigate('/officer-panel/bookings');
    };

    const handleApproveDocument = async (docId) => {
        try {
            await approveBooking(bookingId, docId);
            // Success toast handled in context
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
            setShowDocumentReject(null); // Close reject form
        } catch (err) {
            // Error handled in context
        }
    };

    const handleCompleteBooking = async () => {
        try {
            await completeBooking(bookingId);
            toast.success('Booking marked as completed', {
                duration: 2000,
                position: 'bottom-center'
            });
            setTimeout(() => navigate('/officer-panel/bookings'), 1000);
        } catch (err) {
            // Error handled in context
        }
    };

    const handleCancelBooking = async () => {
        try {
            await cancelBooking(bookingId);
            toast.success('Booking cancelled successfully', {
                duration: 2000,
                position: 'bottom-center'
            });
            setTimeout(() => navigate('/officer-panel/bookings'), 1000);
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
            toast.success('Booking rejected successfully', {
                duration: 2000,
                position: 'bottom-center'
            });
            setTimeout(() => navigate('/officer-panel/bookings'), 1000);
        } catch (err) {
            setShowRejectConfirm(false);
            // Error handled in context
        }
    };

    const getStatusBadge = (status) => {
        if (!status) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <FiAlertCircle className="w-3 h-3" />
                    Loading...
                </span>
            );
        }

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
                <span className="hidden sm:inline">{status.replace('_', ' ')}</span>
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        if (!priority) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    N/A
                </span>
            );
        }

        const priorityConfig = {
            'NORMAL': { color: 'bg-gray-100 text-gray-800', icon: null },
            'PRIORITY': { color: 'bg-yellow-100 text-yellow-800', icon: <MdPriorityHigh className="w-3 h-3" /> },
            'EMERGENCY': { color: 'bg-red-100 text-red-800', icon: <MdPriorityHigh className="w-3 h-3" /> },
            'SENIOR_CITIZEN': { color: 'bg-orange-100 text-orange-800', icon: <FiUser className="w-3 h-3" /> }
        };

        const config = priorityConfig[priority] || { color: 'bg-gray-100 text-gray-800', icon: null };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                <span className="hidden sm:inline">{priority.replace('_', ' ')}</span>
            </span>
        );
    };

    const getDocumentIcon = (fileName) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FaRegFilePdf className="w-5 h-5 text-red-500" />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaRegFileImage className="w-5 h-5 text-blue-500" />;
        if (['doc', 'docx'].includes(ext)) return <FaRegFileWord className="w-5 h-5 text-blue-600" />;
        return <FaRegFileAlt className="w-5 h-5 text-gray-500" />;
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
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeSlot) => {
        return timeSlot || '--:--';
    };

    const canApproveBooking = currentBooking?.submittedDocs?.every(doc => doc.status === 'APPROVED');
    const hasDocuments = currentBooking?.submittedDocs?.length > 0;

    if (loading && !currentBooking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-3 text-sm text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error && !currentBooking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mb-4"
                    >
                        <FiArrowLeft className="mr-1" />
                        Back to Bookings
                    </button>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <FiXCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-900 mb-2">Error Loading Booking</h3>
                        <p className="text-sm text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Back to Bookings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center text-white/80 hover:text-white text-sm"
                            >
                                <FiArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Back to Bookings</span>
                            </button>
                            <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
                            <div>
                                <h1 className="text-base sm:text-lg font-semibold">Booking Details</h1>
                                <p className="text-xs text-blue-100">ID: {bookingId?.substring(0, 8)}...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="bg-white rounded-lg shadow-sm p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">User</p>
                                <p className="text-sm font-semibold truncate">{currentBooking?.userName || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <FiCalendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600">Date</p>
                                <p className="text-sm font-semibold">{formatDate(currentBooking?.date)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                <FiClock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600">Time</p>
                                <p className="text-sm font-semibold">{formatTime(currentBooking?.slotTime)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                                <FiFileText className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">Service</p>
                                <p className="text-sm font-semibold truncate">{currentBooking?.service?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {/* Left Column - Documents & Actions */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    <button
                                        onClick={() => setActiveTab('documents')}
                                        className={`flex-1 min-w-0 py-2.5 px-3 text-center font-medium text-sm whitespace-nowrap ${activeTab === 'documents'
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-1.5">
                                            <FiFileText className="w-4 h-4" />
                                            <span>Documents</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex-1 min-w-0 py-2.5 px-3 text-center font-medium text-sm whitespace-nowrap ${activeTab === 'details'
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-1.5">
                                            <FiInfo className="w-4 h-4" />
                                            <span>Details</span>
                                        </div>
                                    </button>
                                </nav>
                            </div>

                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Submitted Documents</h3>
                                        <p className="text-xs text-gray-500">
                                            {currentBooking?.submittedDocs?.length || 0} doc(s)
                                        </p>
                                    </div>

                                    {!hasDocuments ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                            <FiFileText className="mx-auto h-10 w-10 text-gray-400" />
                                            <h3 className="mt-3 text-sm font-medium text-gray-900">No documents submitted</h3>
                                            <p className="mt-1 text-xs text-gray-600">User hasn't uploaded any documents yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {currentBooking?.submittedDocs?.map((doc) => (
                                                <div key={doc._id} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                                            {getDocumentIcon(doc.name)}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h4>
                                                                    {getDocumentStatusBadge(doc.status)}
                                                                </div>
                                                                {doc.rejectionReason && (
                                                                    <p className="text-xs text-red-600 bg-red-50 p-1.5 rounded">
                                                                        <span className="font-medium">Reason: </span>
                                                                        {doc.rejectionReason}
                                                                    </p>
                                                                )}
                                                                {doc.url && (
                                                                    <a
                                                                        href={doc.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center mt-1 text-xs text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <FiEye className="w-3 h-3 mr-1" />
                                                                        View Document
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Document Actions - Only show for pending documents */}
                                                    {doc.status === 'PENDING' && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            {showDocumentReject === doc._id ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs font-medium text-gray-700">Rejection Reason</span>
                                                                        <button
                                                                            onClick={() => setShowDocumentReject(null)}
                                                                            className="text-xs text-gray-500 hover:text-gray-700"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Enter reason..."
                                                                            id={`reject-reason-${doc._id}`}
                                                                            className="flex-1 block w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                const reason = document.getElementById(`reject-reason-${doc._id}`)?.value || '';
                                                                                handleRejectDocument(doc._id, reason);
                                                                            }}
                                                                            className="inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                                        >
                                                                            <FiXCircle className="w-3 h-3 mr-1" />
                                                                            Submit
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleApproveDocument(doc._id)}
                                                                        disabled={loading}
                                                                        className="flex-1 inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                                                                    >
                                                                        <FiCheck className="w-3 h-3 mr-1" />
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setShowDocumentReject(doc._id)}
                                                                        className="flex-1 inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                                    >
                                                                        <FiXCircle className="w-3 h-3 mr-1" />
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className="p-4 sm:p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* User Information */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">User Information</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{currentBooking?.userName}</p>
                                                        <p className="text-xs text-gray-500">Full Name</p>
                                                    </div>
                                                </div>
                                                {currentBooking?.email && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                            <FiMail className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 truncate">{currentBooking.email}</p>
                                                            <p className="text-xs text-gray-500">Email</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {currentBooking?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                                            <FiPhone className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{currentBooking.phone}</p>
                                                            <p className="text-xs text-gray-500">Phone</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Booking Information */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Information</h4>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600">Booking ID:</span>
                                                    <span className="text-xs font-medium truncate ml-2">{currentBooking?._id?.substring(0, 10)}...</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600">Created:</span>
                                                    <span className="text-xs">
                                                        {currentBooking?.createdAt ? formatDate(currentBooking.createdAt) : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600">Service:</span>
                                                    <span className="text-xs font-medium truncate ml-2">{currentBooking?.service?.name}</span>
                                                </div>
                                                {currentBooking?.tokenNumber && (
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-gray-600">Token:</span>
                                                        <span className="text-xs font-medium">#{currentBooking.tokenNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Booking Actions</h3>
                            <div className="space-y-3">
                                {/* Complete & Cancel */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={handleCompleteBooking}
                                        disabled={currentBooking?.status !== 'APPROVED' || !canApproveBooking}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaClipboardCheck className="w-4 h-4 mr-1.5" />
                                        Complete
                                    </button>
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={currentBooking?.status === 'COMPLETED'}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaBan className="w-4 h-4 mr-1.5" />
                                        Cancel
                                    </button>
                                </div>

                                {/* Reject Booking */}
                                <div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Enter rejection reason..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="block w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowRejectConfirm(true)}
                                            disabled={!rejectionReason.trim()}
                                            className="inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaTimesCircle className="w-4 h-4 mr-1.5" />
                                            Reject Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions & Info */}
                    <div className="space-y-4 sm:space-y-5">
                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={handleBack}
                                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    <FiArrowLeft className="w-4 h-4 mr-1.5" />
                                    Back to List
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    <FiPrinter className="w-4 h-4 mr-1.5" />
                                    Print
                                </button>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Current Status:</span>
                                    {getStatusBadge(currentBooking?.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Priority:</span>
                                    {getPriorityBadge(currentBooking?.priorityType)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Documents:</span>
                                    <span className="text-xs font-medium">
                                        {currentBooking?.submittedDocs?.filter(d => d.status === 'APPROVED').length || 0} / {currentBooking?.submittedDocs?.length || 0} approved
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Department Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-900 mb-1">Department</h3>
                            <p className="text-xs text-blue-800 truncate">
                                {currentBooking?.department?.name || 'Department'}
                            </p>
                            <p className="text-xs text-blue-700 mt-2">
                                Officer: {user?.name?.split(' ')[0] || 'Officer'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Booking Confirmation Modal */}
            {showRejectConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-3 py-4 text-center">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowRejectConfirm(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-5">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                                        <FiAlertCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-base leading-6 font-medium text-gray-900">
                                            Reject Booking?
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                This action cannot be undone.
                                            </p>
                                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                                                <p className="font-medium text-yellow-800">Reason:</p>
                                                <p className="text-yellow-700 mt-0.5">{rejectionReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-5 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleRejectBooking}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto"
                                >
                                    Yes, Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRejectConfirm(false)}
                                    className="mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetailsPage;