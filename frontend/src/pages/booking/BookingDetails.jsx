import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChevronDown, Upload, CheckCircle, AlertCircle, Clock, MapPin, Phone, Mail, FileText, ArrowLeft, Trash2, Eye, Download, Info, Shield, Bell, Calendar, CheckSquare } from 'lucide-react';
import { useBooking } from '../../context/BookingContext'; // Adjust path as needed
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast
import { useParams, useNavigate } from 'react-router-dom';
import CompletedBookingCard from './CompletedBookingCard'; // Import the new component

const BookingDetails = () => {
  // Get bookingId from URL params
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
    'PENDING_DOCS': 'Pending Documents',
    'DOCS_SUBMITTED': 'Documents Submitted',
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
    // Check if bookingId exists
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
        // Use the existing getBookingById function from context
        const response = await getBookingById(bookingId);
        if (response && response.data) {
          setBooking(response.data);
          setFadeIn(true);
          
          // Debug: Check document statuses
          console.log('Booking data:', {
            status: response.data.status,
            submittedDocs: response.data.submittedDocs,
            docStatuses: response.data.submittedDocs?.map(doc => ({
              name: doc.name,
              status: doc.status,
              canUpload: canUploadDocument(doc, response.data)
            }))
          });
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
        [docId]: file // Use document ID as key
      }));
    }
  };

  const handleUploadDocument = async (docId, docName, index) => {
    if (!booking?._id) {
      toast.error('No booking found', {
        duration: 4000,
        position: 'center-top'
      });
      return;
    }

    const file = selectedFiles[docId];
    if (!file) return;

    setUploadingDocId(docId);

    try {
      // Get the document from submittedDocs array
      const submittedDocs = booking.submittedDocs || [];
      const docToUpload = submittedDocs.find(doc => doc._id === docId);
      
      if (!docToUpload) {
        throw new Error('Document not found');
      }

      // Now we have the proper document ID from the backend!
      const uploadData = {
        docId: docId, // Use the actual document _id from backend
        file: file,
        name: docName,
        description: docToUpload.description || ''
      };

      console.log('Uploading document with proper ID:', uploadData);

      // Call the uploadDocuments API
      await uploadDocuments(booking._id, uploadData);

      // Refresh booking data after successful upload
      const updatedBooking = await getBookingById(bookingId);
      setBooking(updatedBooking.data);

      // Clear selected file
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
      toast.error(err.message || 'Failed to upload document', {
        duration: 4000,
        position: 'center-top'
      });
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

    // Clear file input
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

      // Refresh booking data after cancellation
      const updatedBooking = await getBookingById(bookingId);
      setBooking(updatedBooking.data);

      setShowCancelModal(false);
      toast.success('Booking cancelled successfully!', {
        duration: 4000,
        position: 'center-top'
      });
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error(err.message || 'Failed to cancel booking', {
        duration: 4000,
        position: 'center-top'
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleBackToBookings = () => {
    navigate('/my-bookings');
  };

  // Calculate document counts based on status - UPDATED for submittedDocs
  const getDocumentCounts = () => {
    if (!booking?.submittedDocs) return { total: 0, uploaded: 0, pendingUpload: 0 };

    const submittedDocs = booking.submittedDocs || [];
    const uploadedCount = submittedDocs.filter(doc =>
      doc.status !== 'NOT_UPLOADED'
    ).length;

    return {
      total: submittedDocs.length,
      uploaded: uploadedCount,
      pendingUpload: submittedDocs.length - uploadedCount
    };
  };

  // Determine if document can be uploaded/reuploaded - FIXED VERSION
  const canUploadDocument = (doc, currentBooking = booking) => {
    if (!currentBooking?.metadata?.isDocumentUploadRequired) return false;

    // Check booking status - should allow upload even if rejected for re-upload
    if (currentBooking.status === 'CANCELLED' || currentBooking.status === 'COMPLETED') return false;
    
    // Allow upload if booking is in PENDING_DOCS or if document is REJECTED (for re-upload)
    const isBookingInUploadState = currentBooking.status === 'PENDING_DOCS' || 
                                   currentBooking.status === 'DOCS_SUBMITTED' ||
                                   currentBooking.status === 'UNDER_REVIEW';
    
    if (!isBookingInUploadState) return false;

    // Can upload if not uploaded yet
    if (doc.status === 'NOT_UPLOADED') return true;

    // Can re-upload if rejected - THIS IS THE KEY FIX
    if (doc.status === 'REJECTED') return true;

    // Can't upload if already uploaded and pending/approved
    return false;
  };

  const canUpload = booking?.status === 'PENDING_DOCS' && booking?.metadata?.isDocumentUploadRequired;
  const canCancel = booking?.status === 'PENDING_DOCS' || booking?.status === 'DOCS_SUBMITTED';

  const formattedDate = booking?.date ? new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const docCounts = getDocumentCounts();

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToBookings}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to My Bookings
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h2>
            <p className="text-slate-600 mb-6">{error || 'The booking you are looking for does not exist or has been removed.'}</p>
            <button
              onClick={handleBackToBookings}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-8 pb-12 px-4">
      <div
        ref={containerRef}
        className={`max-w-6xl mx-auto transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
      >

        {/* Back Button */}
        <button
          onClick={handleBackToBookings}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to My Bookings
        </button>

        {/* Show Completed Booking Card */}
        {booking.status === 'COMPLETED' ? (
          <CompletedBookingCard booking={booking} />
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* Header Status Card */}
                <div className={`rounded-2xl border ${statusColor.border} ${statusColor.bg} p-6 shadow-lg`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-1">{booking.service?.name}</h1>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                          {booking.service?.serviceCode}
                        </span>
                        <span className="text-sm text-slate-600">{booking.metadata?.departmentName}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${statusColor.badge} ${statusColor.text} font-semibold flex items-center gap-2`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      {statusLabels[booking.status]}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="text-purple-600" size={18} />
                        <p className="text-sm text-slate-600">Date</p>
                      </div>
                      <p className="text-slate-900 font-semibold text-sm">{formattedDate}</p>
                    </div>

                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-green-600" size={18} />
                        <p className="text-sm text-slate-600">Time</p>
                      </div>
                      <p className="text-slate-900 font-semibold text-sm">{booking.slotTime?.replace('-', ' - ')}</p>
                    </div>

                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="text-blue-600" size={18} />
                        <p className="text-sm text-slate-600">Token</p>
                      </div>
                      <p className="text-slate-900 font-semibold text-sm">#{booking.tokenNumber}</p>
                    </div>

                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-amber-600" size={18} />
                        <p className="text-sm text-slate-600">Est. Time</p>
                      </div>
                      <p className="text-slate-900 font-semibold text-sm">{booking.estimatedServiceTime} minutes</p>
                    </div>
                  </div>
                </div>

                {/* Documents Upload Section - Hide for COMPLETED status */}
                {booking.status === 'CANCELLED' ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-gray-600" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Cancelled</h3>
                      <p className="text-slate-600 mb-4">Document upload is not available for cancelled bookings.</p>
                    </div>
                  </div>
                ) : booking.metadata?.isDocumentUploadRequired && submittedDocs.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <FileText className="text-white" size={22} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">Required Documents</h2>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Uploaded: {docCounts.uploaded}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                Pending: {docCounts.pendingUpload}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Total: {docCounts.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
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
                              className={`bg-gradient-to-r rounded-xl p-5 border ${isApproved
                                  ? 'from-green-50 to-emerald-50 border-green-200'
                                  : isRejected
                                    ? 'from-red-50 to-pink-50 border-red-200'
                                    : isUploaded
                                      ? 'from-blue-50 to-indigo-50 border-blue-200'
                                      : 'from-slate-50 to-slate-100 border-slate-200 hover:border-slate-300'
                                } transition-all`}
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`rounded-lg p-3 flex-shrink-0 ${isApproved
                                      ? 'bg-gradient-to-br from-green-100 to-green-200'
                                      : isRejected
                                        ? 'bg-gradient-to-br from-red-100 to-red-200'
                                        : isUploaded
                                          ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                                          : 'bg-gradient-to-br from-slate-100 to-slate-200'
                                    }`}>
                                    <FileText size={22} className={
                                      isApproved
                                        ? 'text-green-600'
                                        : isRejected
                                          ? 'text-red-600'
                                          : isUploaded
                                            ? 'text-blue-600'
                                            : 'text-slate-600'
                                    } />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-slate-900 font-semibold">{doc.name}</h3>
                                      {doc.isMandatory && (
                                        <span className="text-xs bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-2.5 py-1 rounded-full font-medium">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">{doc.description}</p>

                                    <div className="flex items-center gap-3">
                                      <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${documentStatusColors[doc.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {documentStatusLabels[doc.status] || doc.status}
                                      </span>
                                      {doc.uploadedAt && (
                                        <span className="text-xs text-slate-500">
                                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* View/Download Options */}
                                {isUploaded && doc.documentUrl && (
                                  <div className="flex gap-2">
                                    <a
                                      href={doc.documentUrl}
                                      download
                                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 rounded-lg text-sm transition-all font-medium"
                                    >
                                      <Download size={16} />
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Rejection Reason */}
                              {isRejected && doc.rejectionReason && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-red-700 text-sm">
                                    <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                                  </p>
                                </div>
                              )}

                              {/* Upload/Re-upload Flow - FIXED: Now shows for rejected documents */}
                              {showUploadSection && (
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    {!hasSelectedFile ? (
                                      <button
                                        onClick={() => handleFileSelect(docId, idx)}
                                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all border-2 border-dashed flex items-center justify-center gap-2 ${isRejected
                                            ? 'bg-gradient-to-r from-red-50 to-pink-100 text-red-700 hover:from-red-100 hover:to-pink-200 border-red-200'
                                            : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border-blue-200'
                                          }`}
                                      >
                                        <Upload size={18} />
                                        {isRejected ? 'Re-upload Document' : 'Select File'}
                                      </button>
                                    ) : (
                                      <div className="flex-1 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-slate-800 font-medium truncate">
                                            {selectedFiles[docId]?.name}
                                          </span>
                                          <button
                                            onClick={() => handleRemoveFile(docId)}
                                            className="text-slate-500 hover:text-red-500 transition-colors"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {hasSelectedFile && (
                                    <button
                                      onClick={() => handleUploadDocument(docId, doc.name, idx)}
                                      disabled={isUploading}
                                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isUploading
                                          ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 cursor-not-allowed'
                                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/30'
                                        }`}
                                    >
                                      {isUploading ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          Uploading...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle size={18} />
                                          {isRejected ? 'Re-upload Document' : 'Upload Document'}
                                        </>
                                      )}
                                    </button>
                                  )}

                                  <p className="text-xs text-slate-500">
                                    Accepted: PDF, JPG, PNG, DOC • Max: 10MB
                                  </p>
                                </div>
                              )}

                              {/* Document Status Info */}
                              {isPending && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <p className="text-amber-700 text-sm flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Your document is pending review by department staff.</span>
                                  </p>
                                </div>
                              )}

                              {isApproved && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-green-700 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    <span>Your document has been approved.</span>
                                  </p>
                                </div>
                              )}

                              {isUploadedStatus && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-blue-700 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    <span>Your document has been uploaded and is ready for review.</span>
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
                      {booking.status === 'PENDING_DOCS' && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Upload className="text-white" size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 mb-3">Upload Instructions</h4>
                              <ul className="text-sm text-slate-600 space-y-2">
                                <li className="flex items-start gap-2">
                                  <CheckSquare size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Click the upload button next to each document requirement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckSquare size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Ensure documents are clear, legible, and up-to-date</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckSquare size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Upload your documents before your arrival date to avoid any delays; otherwise, on-spot verification will be required before joining the queue.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckSquare size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>Rejected documents must be re-uploaded with corrections</span>
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
              <div className="space-y-8">

                {/* Important Information Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Info className="text-white" size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Important Information</h3>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Arrive 15 minutes before your appointment time with valid ID</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Bring your token number (#{booking.tokenNumber}) for verification</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Upload your documents before your arrival date for faster process; otherwise, on-spot verification will be required</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Check your email regularly for updates and notifications</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Contact department for any changes or cancellations</span>
                    </li>
                  </ul>
                </div>

                {/* Document Progress Card */}
                {submittedDocs.length > 0 && booking.status !== 'COMPLETED' && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-white" size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Document Progress</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{docCounts.total}</div>
                          <div className="text-xs text-slate-600">Total</div>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{docCounts.uploaded}</div>
                          <div className="text-xs text-slate-600">Uploaded</div>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600">{docCounts.pendingUpload}</div>
                          <div className="text-xs text-slate-600">Pending</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 font-medium">Progress</span>
                          <span className="font-bold text-slate-900">
                            {Math.round((docCounts.uploaded / docCounts.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{
                              width: `${(docCounts.uploaded / docCounts.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions Card */}
                {booking.status !== 'COMPLETED' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>

                    <div className="space-y-3">
                      <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={!canCancel || cancelling}
                        className={`w-full py-3 px-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg ${!canCancel
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                            : cancelling
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30'
                          }`}
                      >
                        {cancelling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} />
                            Cancel Booking
                          </>
                        )}
                      </button>

                      <button className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium flex items-center justify-center gap-2">
                        <FileText size={18} />
                        Print Details
                      </button>

                      <button className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium flex items-center justify-center gap-2">
                        <Bell size={18} />
                        Share Booking
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Booking</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingDetails;