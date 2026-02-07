import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChevronDown, Upload, CheckCircle, AlertCircle, Clock, MapPin, Phone, Mail, FileText, ArrowLeft, Trash2, Eye, Download, Info, Shield, Bell, Calendar, CheckSquare, Mail as MailIcon, CheckCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import CompletedBookingCard from './CompletedBookingCard';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const {
    getBookingById,
    cancelBooking,
    uploadDocuments,
    loading: apiLoading,
    error: apiError
  } = useBooking();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const containerRef = useRef(null);
  const fileInputRefs = useRef({});
  const [error, setError] = useState(null);

  const statusColors = {
    'PENDING_DOCS': 'amber',
    'DOCS_SUBMITTED': 'blue',
    'UNDER_REVIEW': 'purple',
    'APPROVED': 'green',
    'COMPLETED': 'emerald',
    'CANCELLED': 'gray',
    'REJECTED': 'red'
  };

  const statusLabels = {
    'PENDING_DOCS': 'Pending Docs',
    'DOCS_SUBMITTED': 'Docs Submitted',
    'UNDER_REVIEW': 'Under Review',
    'APPROVED': 'Approved',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'REJECTED': 'Rejected'
  };

  const documentStatusLabels = {
    'NOT_UPLOADED': 'Not Uploaded',
    'UPLOADED': 'Uploaded',
    'PENDING': 'Pending Review',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected'
  };

  const documentStatusColors = {
    'NOT_UPLOADED': 'bg-gray-100 text-gray-700',
    'UPLOADED': 'bg-blue-100 text-blue-700',
    'PENDING': 'bg-amber-100 text-amber-700',
    'APPROVED': 'bg-green-100 text-green-700',
    'REJECTED': 'bg-red-100 text-red-700'
  };

  const colorMap = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100', icon: 'text-amber-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100', icon: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100', icon: 'text-purple-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100', icon: 'text-green-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100', icon: 'text-emerald-600' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100', icon: 'text-gray-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100', icon: 'text-red-600' }
  };

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      toast.error('Invalid booking ID');
      navigate('/my-bookings');
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBookingById(bookingId);
        if (response && response.data) {
          setBooking(response.data);
          setFadeIn(true);
        } else {
          throw new Error('No booking data returned');
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
        setError('Failed to load booking details');
        toast.error('Failed to load booking details', {
          duration: 4000,
          position: 'center-top'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleFileSelect = (docId, index, e) => {
    const input = fileInputRefs.current[docId] || fileInputRefs.current[index];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (docId, index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit', {
          duration: 4000,
          position: 'center-top'
        });
        return;
      }
      setSelectedFiles(prev => ({
        ...prev,
        [docId]: file
      }));
    }
  };

  const handleUploadDocument = async (docId, docName, index) => {
    if (!booking?._id) {
      toast.error('No booking found');
      return;
    }

    const file = selectedFiles[docId];
    if (!file) return;

    setUploadingDocId(docId);

    try {
      const submittedDocs = booking.submittedDocs || [];
      const docToUpload = submittedDocs.find(doc => doc._id === docId);

      if (!docToUpload) {
        throw new Error('Document not found');
      }

      const uploadData = {
        docId: docId,
        file: file,
        name: docName,
        description: docToUpload.description || ''
      };

      await uploadDocuments(booking._id, uploadData);
      const updatedBooking = await getBookingById(bookingId);
      setBooking(updatedBooking.data);

      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[docId];
        return newFiles;
      });

      toast.success(docToUpload.status === 'REJECTED' ? 'Document re-uploaded successfully!' : 'Document uploaded successfully!', {
        duration: 4000,
        position: 'center-top'
      });
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleRemoveFile = (docId) => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docId];
      return newFiles;
    });

    const input = fileInputRefs.current[docId];
    if (input) {
      input.value = '';
    }
  };

  const handleCancelBooking = async () => {
    if (!booking?._id) return;

    setCancelling(true);
    try {
      await cancelBooking(booking._id);
      const updatedBooking = await getBookingById(bookingId);
      setBooking(updatedBooking.data);
      setShowCancelModal(false);
      toast.success('Booking cancelled successfully!');
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleBackToBookings = () => {
    navigate('/my-bookings');
  };

  const getDocumentCounts = () => {
    if (!booking?.submittedDocs) return { total: 0, uploaded: 0, pendingUpload: 0, approved: 0 };

    const submittedDocs = booking.submittedDocs || [];
    const uploadedCount = submittedDocs.filter(doc =>
      doc.status !== 'NOT_UPLOADED'
    ).length;

    const approvedCount = submittedDocs.filter(doc =>
      doc.status === 'APPROVED'
    ).length;

    return {
      total: submittedDocs.length,
      uploaded: uploadedCount,
      pendingUpload: submittedDocs.length - uploadedCount,
      approved: approvedCount
    };
  };

  // Check if all documents are approved
  const areAllDocumentsApproved = () => {
    if (!booking?.submittedDocs) return false;
    const submittedDocs = booking.submittedDocs || [];
    return submittedDocs.length > 0 && submittedDocs.every(doc => doc.status === 'APPROVED');
  };

  const canCancel = booking?.status === 'PENDING_DOCS' || booking?.status === 'DOCS_SUBMITTED';

  const canUploadDocument = (doc, currentBooking = booking) => {
    if (!currentBooking?.metadata?.isDocumentUploadRequired) return false;

    if (currentBooking.status === 'CANCELLED' || currentBooking.status === 'COMPLETED') return false;

    const isBookingInUploadState = currentBooking.status === 'PENDING_DOCS' ||
      currentBooking.status === 'DOCS_SUBMITTED' ||
      currentBooking.status === 'UNDER_REVIEW';

    if (!isBookingInUploadState) return false;

    if (doc.status === 'NOT_UPLOADED') return true;
    if (doc.status === 'REJECTED') return true;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-slate-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-6 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToBookings}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back to My Bookings
          </button>

          <div className="bg-white rounded-xl shadow border border-red-200 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Booking Not Found</h2>
            <p className="text-slate-600 mb-4 text-sm">{error || 'The booking you are looking for does not exist.'}</p>
            <button
              onClick={handleBackToBookings}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm"
            >
              Return to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = colorMap[statusColors[booking.status]];
  const submittedDocs = booking.submittedDocs || [];
  const docCounts = getDocumentCounts();
  const allDocsApproved = areAllDocumentsApproved();
  const formattedDate = booking?.date ? new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-6 pb-10 px-4">
      <div
        ref={containerRef}
        className={`max-w-6xl mx-auto transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
      >

        {/* Back Button - Mobile Optimized */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToBookings}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Bookings</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Status Badge - Mobile Only */}
          <div className="sm:hidden">
            <div className={`px-3 py-1 rounded-full ${statusColor.badge} ${statusColor.text} font-medium text-xs flex items-center gap-1.5`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              {statusLabels[booking.status]}
            </div>
          </div>
        </div>

        {/* Show Completed Booking Card */}
        {booking.status === 'COMPLETED' ? (
          <CompletedBookingCard booking={booking} />
        ) : (
          <>
            {/* All Documents Approved Success Banner */}
            {allDocsApproved && booking.metadata?.isDocumentUploadRequired && booking.status !== 'CANCELLED' && (
              <div className="mb-5 md:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 md:p-5 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCheck className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">All Documents Approved! 🎉</h3>
                      <p className="text-sm text-slate-700">
                        Your token number <span className="font-bold text-emerald-700"></span> has been sent to your registered email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-600" />
                      <span className="text-xs text-slate-700">Appointment Date: <span className="font-medium">{formattedDate}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-600" />
                      <span className="text-xs text-slate-700">Time Slot: <span className="font-medium">{booking.slotTime?.replace('-', ' - ')}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-xs text-slate-700">Documents: <span className="font-medium">{docCounts.approved}/{docCounts.total} Approved</span></span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-800 flex items-start gap-2">
                      <Info size={14} className="mt-0.5 flex-shrink-0" />
                      <span>Please arrive 15 minutes before your appointment time with your token number and original documents for verification.</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-5 md:gap-6">

              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-5 md:space-y-6">

                {/* Header Status Card - Compact */}
                <div className={`rounded-xl border ${statusColor.border} ${statusColor.bg} p-4 md:p-5 shadow`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h1 className="text-lg md:text-xl font-bold text-slate-900 line-clamp-2">{booking.service?.name}</h1>
                        {/* Status Badge - Desktop Only */}
                        <div className="hidden sm:block">
                          <div className={`px-3 py-1.5 rounded-full ${statusColor.badge} ${statusColor.text} font-medium text-sm flex items-center gap-2`}>
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                            {statusLabels[booking.status]}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full font-medium">
                          {booking.service?.serviceCode}
                        </span>
                        <span className="text-xs text-slate-600">{booking.metadata?.departmentName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    <div className="bg-white/60 rounded-lg p-2.5 md:p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="text-purple-600" size={16} />
                        <p className="text-xs text-slate-600">Date</p>
                      </div>
                      <p className="text-slate-900 font-medium text-xs md:text-sm">{formattedDate}</p>
                    </div>

                    <div className="bg-white/60 rounded-lg p-2.5 md:p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="text-green-600" size={16} />
                        <p className="text-xs text-slate-600">Time</p>
                      </div>
                      <p className="text-slate-900 font-medium text-xs md:text-sm">{booking.slotTime?.replace('-', ' - ')}</p>
                    </div>

                    <div className="bg-white/60 rounded-lg p-2.5 md:p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className="text-blue-600" size={16} />
                        <p className="text-xs text-slate-600">Token</p>
                      </div>
                      <p className="text-slate-900 font-medium text-xs md:text-sm">#{booking.tokenNumber}</p>
                    </div>

                    <div className="bg-white/60 rounded-lg p-2.5 md:p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="text-amber-600" size={16} />
                        <p className="text-xs text-slate-600">Est. Time</p>
                      </div>
                      <p className="text-slate-900 font-medium text-xs md:text-sm">{booking.estimatedServiceTime} min</p>
                    </div>
                  </div>
                </div>

                {/* Documents Upload Section */}
                {booking.status === 'CANCELLED' ? (
                  <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="text-gray-600" size={24} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">Booking Cancelled</h3>
                      <p className="text-slate-600 text-sm">Document upload is not available.</p>
                    </div>
                  </div>
                ) : booking.metadata?.isDocumentUploadRequired && submittedDocs.length > 0 ? (
                  <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 md:p-5 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="text-white" size={18} />
                          </div>
                          <div>
                            <h2 className="text-base md:text-lg font-bold text-slate-900">Required Documents</h2>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5">
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                Approved: {docCounts.approved}/{docCounts.total}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                Pending: {docCounts.pendingUpload}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Uploaded: {docCounts.uploaded}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 md:p-5">
                      {/* All Approved Mini Banner */}
                      {allDocsApproved && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-emerald-600" size={18} />
                            <p className="text-sm text-emerald-800 font-medium">
                              All documents have been approved! Your appointment is confirmed.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {submittedDocs.map((doc, idx) => {
                          const docId = doc._id;
                          const isUploaded = doc.status !== 'NOT_UPLOADED';
                          const isUploading = uploadingDocId === docId;
                          const hasSelectedFile = selectedFiles[docId];
                          const isRejected = doc.status === 'REJECTED';
                          const isApproved = doc.status === 'APPROVED';
                          const isPending = doc.status === 'PENDING';
                          const isUploadedStatus = doc.status === 'UPLOADED';
                          const canReupload = canUploadDocument(doc);
                          const showUploadSection = canReupload;

                          return (
                            <div
                              key={docId}
                              className={`rounded-lg p-3 md:p-4 border ${isApproved
                                ? 'bg-green-50 border-green-200'
                                : isRejected
                                  ? 'bg-red-50 border-red-200'
                                  : isUploaded
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                } transition-all`}
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                                <div className="flex items-start gap-2 md:gap-3 flex-1">
                                  <div className={`rounded p-2 flex-shrink-0 ${isApproved
                                    ? 'bg-green-100'
                                    : isRejected
                                      ? 'bg-red-100'
                                      : isUploaded
                                        ? 'bg-blue-100'
                                        : 'bg-slate-100'
                                    }`}>
                                    <FileText size={18} className={
                                      isApproved
                                        ? 'text-green-600'
                                        : isRejected
                                          ? 'text-red-600'
                                          : isUploaded
                                            ? 'text-blue-600'
                                            : 'text-slate-600'
                                    } />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                      <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.name}</h3>
                                      {doc.isMandatory && (
                                        <span className="text-xs bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-600 text-xs mb-2 line-clamp-2">{doc.description}</p>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`text-xs font-medium px-2 py-1 rounded ${documentStatusColors[doc.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {documentStatusLabels[doc.status] || doc.status}
                                      </span>
                                      {doc.uploadedAt && (
                                        <span className="text-xs text-slate-500">
                                          {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* View/Download Options */}
                                {isUploaded && doc.documentUrl && (
                                  <div className="flex justify-end md:justify-start mt-2 md:mt-0">
                                    <a
                                      href={doc.documentUrl}
                                      download
                                      className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 rounded-lg text-xs transition-all font-medium"
                                    >
                                      <Download size={14} />
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Rejection Reason */}
                              {isRejected && doc.rejectionReason && (
                                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                                  <p className="text-red-700 text-xs">
                                    <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                                  </p>
                                </div>
                              )}

                              {/* Upload/Re-upload Flow with Blue Dotted Design */}
                              {showUploadSection && (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    {!hasSelectedFile ? (
                                      <button
                                        onClick={() => handleFileSelect(docId, idx)}
                                        className={`flex-1 min-h-[80px] rounded-lg font-medium transition-all border-2 border-dashed flex flex-col items-center justify-center gap-1.5 ${isRejected
                                          ? 'bg-gradient-to-r from-red-50 to-pink-100 text-red-700 hover:from-red-100 hover:to-pink-200 border-red-200 border-dotted'
                                          : 'bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 hover:from-blue-100 hover:to-blue-200/50 border-blue-300 border-dotted'
                                          }`}
                                      >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRejected ? 'bg-red-100' : 'bg-blue-100'}`}>
                                          <Upload size={16} className={isRejected ? 'text-red-600' : 'text-blue-600'} />
                                        </div>
                                        <span className="text-xs font-medium">
                                          {isRejected ? 'Re-upload Document' : 'Select File'}
                                        </span>
                                        <span className="text-[10px] text-slate-500">PDF, JPG, PNG, DOC</span>
                                      </button>
                                    ) : (
                                      <div className="flex-1 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-blue-600" />
                                            <span className="text-xs text-slate-800 font-medium truncate">
                                              {selectedFiles[docId]?.name}
                                            </span>
                                          </div>
                                          <button
                                            onClick={() => handleRemoveFile(docId)}
                                            className="text-slate-500 hover:text-red-500 transition-colors"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                          <button
                                            onClick={() => handleUploadDocument(docId, doc.name, idx)}
                                            disabled={isUploading}
                                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 ${isUploading
                                              ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                              }`}
                                          >
                                            {isUploading ? (
                                              <>
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Uploading...
                                              </>
                                            ) : (
                                              <>
                                                <CheckCircle size={14} />
                                                Upload
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Document Status Info */}
                              {isPending && (
                                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                                  <p className="text-amber-700 text-xs flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>Pending review by department staff</span>
                                  </p>
                                </div>
                              )}

                              {isApproved && (
                                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                                  <p className="text-green-700 text-xs flex items-center gap-1.5">
                                    <CheckCircle size={14} />
                                    <span>Document has been approved</span>
                                  </p>
                                </div>
                              )}

                              {isUploadedStatus && (
                                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-blue-700 text-xs flex items-center gap-1.5">
                                    <CheckCircle size={14} />
                                    <span>Uploaded and ready for review</span>
                                  </p>
                                </div>
                              )}

                              <input
                                ref={el => fileInputRefs.current[docId] = el}
                                type="file"
                                onChange={(e) => handleFileChange(docId, idx, e)}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Upload Instructions */}
                      {booking.status === 'PENDING_DOCS' && !allDocsApproved && (
                        <div className="mt-5 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                              <Upload className="text-white" size={16} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 mb-2">Upload Instructions</h4>
                              <ul className="text-xs text-slate-600 space-y-1.5">
                                <li className="flex items-start gap-1.5">
                                  <CheckSquare size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Click upload button for each document</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <CheckSquare size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Ensure documents are clear and legible</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <CheckSquare size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Upload before arrival date to avoid delays</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-5 md:space-y-6">

                {/* Important Information Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 md:p-5 shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded flex items-center justify-center">
                      <Info className="text-white" size={18} />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">Important Info</h3>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-start gap-1.5 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>Arrive 15 minutes before appointment</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                      <span>Bring token #{booking.tokenNumber}</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt=1 flex-shrink-0"></div>
                      <span>Upload docs before arrival date</span>
                    </li>
                  </ul>
                </div>

                {/* Document Progress Card */}
                {submittedDocs.length > 0 && booking.status !== 'COMPLETED' && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 md:p-5 shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                        <CheckCircle className="text-white" size={18} />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-slate-900">Document Progress</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-white/70 rounded">
                          <div className="text-lg font-bold text-blue-600">{docCounts.total}</div>
                          <div className="text-[10px] text-slate-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-white/70 rounded">
                          <div className="text-lg font-bold text-green-600">{docCounts.approved}</div>
                          <div className="text-[10px] text-slate-600">Approved</div>
                        </div>
                        <div className="text-center p-2 bg-white/70 rounded">
                          <div className="text-lg font-bold text-amber-600">{docCounts.total - docCounts.approved}</div>
                          <div className="text-[10px] text-slate-600">Pending</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 font-medium">Approval Progress</span>
                          <span className="font-bold text-slate-900">
                            {Math.round((docCounts.approved / docCounts.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${allDocsApproved
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}
                            style={{
                              width: `${(docCounts.approved / docCounts.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Progress Status Message */}
                      {allDocsApproved ? (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
                          <p className="text-xs text-green-700 font-medium">
                            🎉 All documents approved! Appointment confirmed.
                          </p>
                        </div>
                      ) : docCounts.approved > 0 ? (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-center">
                          <p className="text-xs text-blue-700">
                            {docCounts.approved} of {docCounts.total} documents approved
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Quick Actions Card */}
                {booking.status !== 'COMPLETED' && !allDocsApproved && (
                  <div className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-5">
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-3">Quick Actions</h3>

                    <div className="space-y-2">
                      <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={!canCancel || cancelling}
                        className={`w-full py-2.5 px-4 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 ${!canCancel
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : cancelling
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                          }`}
                      >
                        {cancelling ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Cancel Booking
                          </>
                        )}
                      </button>

                      <button className="w-full py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm flex items-center justify-center gap-2">
                        <FileText size={16} />
                        Print Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-md w-full">
            <h3 className="text-base font-bold text-slate-900 mb-2">Cancel Booking</h3>
            <p className="text-slate-600 text-sm mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;