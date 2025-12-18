import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaUserCheck,
  FaFileAlt,
  FaUpload,
  FaCheckCircle,
  FaTimes,
  FaPrint,
  FaShareAlt,
  FaDownload,
  FaEye
} from 'react-icons/fa';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { currentBooking, getBookingById, uploadDocuments, cancelBooking, loading } = useBooking();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (bookingId) {
      getBookingById(bookingId);
    }
  }, [bookingId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const documents = files.map(file => ({
      name: file.name,
      file: file,
      description: ''
    }));

    setUploading(true);
    try {
      await uploadDocuments(bookingId, documents);
      setFiles([]);
      setShowUploadForm(false);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelling(true);
    try {
      await cancelBooking(bookingId);
      navigate('/my-bookings');
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Booking Not Found</h2>
          <p className="text-slate-600 mb-6">The booking you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <FaArrowLeft />
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

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

  const canUpload = currentBooking.status === 'PENDING_DOCS' && currentBooking.metadata.serviceRequiresDocs;
  const canCancel = ['PENDING_DOCS', 'DOCS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED'].includes(currentBooking.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to My Bookings</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-${statusColors[currentBooking.status]}-100 text-${statusColors[currentBooking.status]}-700`}>
              {statusLabels[currentBooking.status]}
            </span>
            {currentBooking.tokenNumber && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold">
                Token #{currentBooking.tokenNumber}
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Booking Information</h2>
              
              <div className="space-y-6">
                {/* Service Details */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{currentBooking.service.name}</h3>
                      <p className="text-sm text-slate-600">{currentBooking.metadata.departmentName}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg text-sm font-medium">
                        {currentBooking.service.serviceCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Appointment Date</div>
                        <div className="font-bold text-slate-900">
                          {new Date(currentBooking.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center">
                        <FaClock className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Time Slot</div>
                        <div className="font-bold text-slate-900">
                          {currentBooking.slotTime.replace('-', ' - ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <div className="text-sm text-slate-600 mb-1">Priority Type</div>
                    <div className={`font-bold ${
                      currentBooking.priorityType === 'NONE' ? 'text-slate-900' : 'text-amber-700'
                    }`}>
                      {currentBooking.priorityType === 'NONE' ? 'Regular' : currentBooking.priorityType.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <div className="text-sm text-slate-600 mb-1">Estimated Service Time</div>
                    <div className="font-bold text-slate-900">
                      {currentBooking.estimatedServiceTime || 15} minutes
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {currentBooking.notes && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="text-sm text-slate-600 mb-1">Special Notes</div>
                    <div className="text-slate-700 whitespace-pre-wrap">{currentBooking.notes}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload Section */}
            {canUpload && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Upload Required Documents</h2>
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
                  >
                    <FaUpload />
                    {showUploadForm ? 'Cancel Upload' : 'Upload Documents'}
                  </button>
                </div>

                {showUploadForm ? (
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-blue-300 rounded-xl">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <p className="text-sm text-slate-600 mt-2">
                        Accepted formats: PDF, JPG, PNG, DOC (Max 10MB per file)
                      </p>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-900">Selected Files:</h4>
                        <ul className="space-y-1">
                          {files.map((file, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                              <FaFileAlt />
                              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowUploadForm(false)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Upload Documents'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <FaUpload className="text-4xl text-blue-600 mx-auto mb-3" />
                    <p className="text-slate-700">
                      Upload required documents to complete your booking process.
                      Documents can be uploaded anytime after booking.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submitted Documents */}
            {currentBooking.submittedDocs && currentBooking.submittedDocs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Submitted Documents</h2>
                
                <div className="space-y-3">
                  {currentBooking.submittedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.status === 'APPROVED' ? 'bg-gradient-to-br from-green-100 to-emerald-200' :
                            doc.status === 'REJECTED' ? 'bg-gradient-to-br from-red-100 to-red-200' :
                            'bg-gradient-to-br from-amber-100 to-amber-200'
                          }`}>
                            <FaFileAlt className={
                              doc.status === 'APPROVED' ? 'text-green-600' :
                              doc.status === 'REJECTED' ? 'text-red-600' :
                              'text-amber-600'
                            } />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{doc.name}</div>
                            <div className="text-sm text-slate-600">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {doc.status}
                          </span>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <FaEye />
                          </a>
                          <a
                            href={doc.documentUrl}
                            download
                            className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <FaDownload />
                          </a>
                        </div>
                      </div>
                      
                      {doc.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full py-3 px-4 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <FaTimes />
                        Cancel Booking
                      </>
                    )}
                  </button>
                )}
                
                <button className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2">
                  <FaPrint />
                  Print Details
                </button>
                
                <button className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2">
                  <FaShareAlt />
                  Share Booking
                </button>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Important Information</h3>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Arrive 15 minutes before your appointment time</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Bring valid ID and token number for verification</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Upload documents as soon as possible for faster processing</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                  <span>Check your email for updates and notifications</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  For any issues or questions regarding your booking, contact the department directly.
                </p>
                
                <div className="p-3 bg-white/50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Department</div>
                  <div className="font-medium text-slate-900">{currentBooking.metadata.departmentName}</div>
                </div>
                
                <Link
                  to={`/departments/${currentBooking.department}`}
                  className="block text-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium"
                >
                  View Department Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;