import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { useService } from '../../context/ServiceContext';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaCalendarCheck,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaIdCard,
    FaFileAlt,
    FaUpload,
    FaChevronRight,
    FaChevronLeft,
    FaShieldAlt,
    FaPercentage,
    FaMapMarkerAlt,
    FaBuilding,
    FaRegCalendarCheck
} from 'react-icons/fa';
import { formatTime } from '../../lib/formatters';

const BookingPage = () => {
    const { deptId, serviceId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentDepartment, getDepartmentById } = useDepartment();
    const { currentService, getServiceById } = useService();
    const {
        availableDates,
        availableSlots,
        getAvailableDates,
        getAvailableSlots,
        createBooking,
        loading,
        clearAvailableSlots
    } = useBooking();

    const [bookingStep, setBookingStep] = useState(1); // 1: Date, 2: Time, 3: Details, 4: Confirm
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [priorityType, setPriorityType] = useState('NONE');
    const [userNotes, setUserNotes] = useState('');
    const [isEligibleForPriority, setIsEligibleForPriority] = useState(false);

    useEffect(() => {
        if (deptId && serviceId) {
            getServiceById(deptId, serviceId);
            getDepartmentById(deptId);
            getAvailableDates(deptId);
        }
    }, [deptId, serviceId]);

    useEffect(() => {
        if (deptId && serviceId && selectedDate) {
            getAvailableSlots(deptId, serviceId, selectedDate);
        } else {
            clearAvailableSlots();
        }
    }, [selectedDate]);

    useEffect(() => {
        if (currentService) {
            // Check if user is eligible for priority
            const checkPriorityEligibility = () => {
                if (!currentService.priorityAllowed) {
                    setIsEligibleForPriority(false);
                    setPriorityType('NONE');
                    return;
                }

                const priorityCriteria = currentDepartment?.priorityCriteria || {};
                
                // Check senior citizen eligibility
                if (user?.age && priorityCriteria.seniorCitizenAge && 
                    user.age >= priorityCriteria.seniorCitizenAge) {
                    setIsEligibleForPriority(true);
                    return;
                }

                // Note: For pregnant women and differently abled, 
                // we would need additional user profile fields
                setIsEligibleForPriority(false);
            };

            checkPriorityEligibility();
        }
    }, [currentService, currentDepartment, user]);

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setBookingStep(2); // Move to time selection
    };

    // Handle slot selection
    const handleSlotSelect = (slot) => {
        if (slot.available) {
            setSelectedSlot(slot);
        }
    };

    // Handle priority type change
    const handlePriorityChange = (type) => {
        if (type === 'NONE' || (currentService?.priorityAllowed && isEligibleForPriority)) {
            setPriorityType(type);
        }
    };

    // Validate and submit booking
    const handleSubmitBooking = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.error('Please select date and time slot');
            return;
        }

        try {
            const bookingData = {
                date: selectedDate,
                slotTime: selectedSlot.time,
                priorityType,
                notes: userNotes
            };

            const result = await createBooking(deptId, serviceId, bookingData);
            
            if (result) {
                setBookingStep(4); // Show confirmation
            }
        } catch (error) {
            // Error handled in context
        }
    };

    // Get priority options based on eligibility
    const getPriorityOptions = () => {
        const options = [
            { value: 'NONE', label: 'Regular Service', icon: FaUser }
        ];

        if (currentService?.priorityAllowed) {
            const priorityCriteria = currentDepartment?.priorityCriteria || {};
            
            if (priorityCriteria.seniorCitizenAge && user?.age && user.age >= priorityCriteria.seniorCitizenAge) {
                options.push({
                    value: 'SENIOR_CITIZEN',
                    label: `Senior Citizen (${priorityCriteria.seniorCitizenAge}+ years)`,
                    icon: FaPercentage
                });
            }

            if (priorityCriteria.allowPregnantWomen) {
                options.push({
                    value: 'PREGNANT_WOMEN',
                    label: 'Pregnant Women',
                    icon: FaUser
                });
            }

            if (priorityCriteria.allowDifferentlyAbled) {
                options.push({
                    value: 'DIFFERENTLY_ABLED',
                    label: 'Differently Abled',
                    icon: FaShieldAlt
                });
            }
        }

        return options;
    };

    // Check if service requires document upload
    const requiresDocumentUpload = currentService?.isDocumentUploadRequired || false;

    // Authentication check
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                    <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
                    <p className="text-slate-600 mb-6">Please login to book a slot.</p>
                    <Link
                        to="/login"
                        state={{ returnTo: `/departments/${deptId}/services/${serviceId}/book` }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium shadow-md"
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentService || !currentDepartment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading booking details...</p>
                </div>
            </div>
        );
    }

    const priorityOptions = getPriorityOptions();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/departments/${deptId}/services/${serviceId}`}
                            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-700/30"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Back to Service</span>
                        </Link>
                        <div className="w-px h-6 bg-blue-500"></div>
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Book {currentService.name}</h1>
                            <p className="text-blue-100 text-sm">
                                {currentDepartment.name} • {currentService.serviceCode}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                                bookingStep >= step 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                    : 'bg-slate-200 text-slate-600'
                            }`}>
                                {step}
                            </div>
                            {step < 4 && (
                                <div className={`w-16 h-1 mx-2 ${
                                    bookingStep > step 
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                                        : 'bg-slate-300'
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Labels */}
                <div className="flex justify-between mb-8 text-sm text-slate-600 px-4">
                    <span className={bookingStep >= 1 ? 'font-medium text-blue-600' : ''}>Select Date</span>
                    <span className={bookingStep >= 2 ? 'font-medium text-blue-600' : ''}>Choose Time</span>
                    <span className={bookingStep >= 3 ? 'font-medium text-blue-600' : ''}>Confirm Details</span>
                    <span className={bookingStep >= 4 ? 'font-medium text-blue-600' : ''}>Confirmation</span>
                </div>

                {/* Booking Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                    {/* Step 1: Date Selection */}
                    {bookingStep === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Appointment Date</h2>
                                <p className="text-slate-600">Choose from available working days</p>
                            </div>

                            {/* Service Info Card */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <FaCalendarAlt className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{currentService.name}</h3>
                                        <p className="text-sm text-slate-600 mb-1">{currentService.description}</p>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                {currentService.serviceCode}
                                            </span>
                                            {currentService.priorityAllowed && (
                                                <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded">
                                                    <FaPercentage className="w-3 h-3 inline mr-1" />
                                                    Priority Available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Available Dates */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Available Dates</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                                        <p className="text-slate-600">Loading available dates...</p>
                                    </div>
                                ) : availableDates.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {availableDates.map((date) => (
                                            <button
                                                key={date.date}
                                                onClick={() => handleDateSelect(date.date)}
                                                className={`p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                                                    selectedDate === date.date
                                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                        : date.isClosed || date.isPast
                                                            ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
                                                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                }`}
                                                disabled={date.isClosed || date.isPast}
                                            >
                                                <div className={`text-sm font-medium ${
                                                    selectedDate === date.date ? 'text-blue-700' : 'text-slate-700'
                                                }`}>
                                                    {date.day}
                                                </div>
                                                <div className={`text-lg font-bold mt-1 ${
                                                    selectedDate === date.date ? 'text-blue-800' : 'text-slate-900'
                                                }`}>
                                                    {new Date(date.date).getDate()}
                                                </div>
                                                <div className={`text-xs mt-1 ${
                                                    selectedDate === date.date ? 'text-blue-600' : 'text-slate-500'
                                                }`}>
                                                    {new Date(date.date).toLocaleDateString('en-IN', { month: 'short' })}
                                                </div>
                                                {date.isToday && (
                                                    <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
                                                )}
                                                {date.isClosed && (
                                                    <div className="text-xs text-red-600 font-medium mt-1">Closed</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaCalendarAlt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-600">No dates available for booking</p>
                                    </div>
                                )}
                            </div>

                            {/* Department Info */}
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200">
                                <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                    <FaBuilding className="w-4 h-4 text-blue-600" />
                                    Department Information
                                </h4>
                                <p className="text-sm text-slate-600">
                                    <FaMapMarkerAlt className="w-3 h-3 inline mr-1" />
                                    {currentDepartment.address?.city}, {currentDepartment.address?.state}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Booking window: {currentDepartment.bookingWindowDays || 7} days
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Time Selection */}
                    {bookingStep === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setBookingStep(1)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <FaChevronLeft className="w-4 h-4" />
                                    Change Date
                                </button>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Select Time Slot</h2>
                                    <p className="text-slate-600">
                                        {selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="w-20"></div> {/* Spacer for alignment */}
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                                    <p className="text-slate-600">Loading available time slots...</p>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => handleSlotSelect(slot)}
                                            disabled={!slot.available}
                                            className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                                selectedSlot?.time === slot.time
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                    : slot.available
                                                        ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                        : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FaClock className={`w-4 h-4 ${
                                                        slot.available ? 'text-blue-600' : 'text-slate-400'
                                                    }`} />
                                                    <span className={`font-bold ${
                                                        slot.available ? 'text-slate-900' : 'text-slate-400'
                                                    }`}>
                                                        {formatTime(slot.start)} - {formatTime(slot.end)}
                                                    </span>
                                                </div>
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                    slot.available && !slot.isFullyBooked
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {slot.remaining} left
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center justify-between">
                                                <span>Max {slot.maxTokens} tokens</span>
                                                {!slot.available && (
                                                    <span className="text-red-600">Fully Booked</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-600">No time slots available for this date</p>
                                    <button
                                        onClick={() => setBookingStep(1)}
                                        className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Choose another date
                                    </button>
                                </div>
                            )}

                            {selectedSlot && (
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <button
                                        onClick={() => setBookingStep(3)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium text-lg flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        Continue to Details
                                        <FaChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Confirm Details */}
                    {bookingStep === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setBookingStep(2)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <FaChevronLeft className="w-4 h-4" />
                                    Change Time
                                </button>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Confirm Booking Details</h2>
                                    <p className="text-slate-600">Review and confirm your appointment</p>
                                </div>
                                <div className="w-20"></div>
                            </div>

                            {/* Booking Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                    <FaRegCalendarCheck className="w-5 h-5 text-blue-600" />
                                    Booking Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Service" value={currentService.name} />
                                    <InfoItem label="Service Code" value={currentService.serviceCode} />
                                    <InfoItem 
                                        label="Date" 
                                        value={new Date(selectedDate).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })} 
                                    />
                                    <InfoItem label="Time Slot" value={`${formatTime(selectedSlot?.start)} - ${formatTime(selectedSlot?.end)}`} />
                                    <InfoItem label="Department" value={currentDepartment.name} />
                                    <InfoItem label="Location" value={`${currentDepartment.address?.city}, ${currentDepartment.address?.state}`} />
                                </div>
                            </div>

                            {/* Priority Selection */}
                            <div className="border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-4">Priority Service</h3>
                                <div className="space-y-3">
                                    {priorityOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                priorityType === option.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={option.value}
                                                checked={priorityType === option.value}
                                                onChange={() => handlePriorityChange(option.value)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-900">{option.label}</div>
                                                {option.value !== 'NONE' && (
                                                    <div className="text-sm text-slate-600 mt-1">
                                                        Faster service with priority access
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-4">Additional Notes (Optional)</h3>
                                <textarea
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    placeholder="Add any special requirements or notes for your appointment..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Important Information */}
                            {requiresDocumentUpload && (
                                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-6">
                                    <h3 className="font-bold text-amber-900 text-lg mb-4 flex items-center gap-2">
                                        <FaExclamationTriangle className="w-5 h-5 text-amber-600" />
                                        Document Requirement
                                    </h3>
                                    <p className="text-amber-800 mb-3">
                                        This service requires document upload. After booking, you'll need to upload the following:
                                    </p>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        {currentService.requiredDocs?.map((doc, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <FaFileAlt className="w-3 h-3 flex-shrink-0" />
                                                <span>{doc.name} {doc.isMandatory && '(Mandatory)'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setBookingStep(2)}
                                    className="flex-1 py-3.5 px-6 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmitBooking}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline-block mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {bookingStep === 4 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <FaCheckCircle className="w-10 h-10 text-white" />
                            </div>
                            
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                                <p className="text-slate-600">
                                    Your appointment has been successfully booked
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 p-6 max-w-md mx-auto">
                                <div className="space-y-3">
                                    <InfoItem label="Booking ID" value={`BK${Date.now().toString().slice(-8)}`} />
                                    <InfoItem label="Status" value={<span className="text-emerald-600 font-medium">Confirmed</span>} />
                                    <InfoItem label="Next Steps" value="Check your email for confirmation details" />
                                </div>
                            </div>

                            {requiresDocumentUpload && (
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-6 max-w-md mx-auto">
                                    <h3 className="font-bold text-blue-900 text-lg mb-3 flex items-center justify-center gap-2">
                                        <FaUpload className="w-5 h-5" />
                                        Document Upload Required
                                    </h3>
                                    <p className="text-blue-800 mb-3">
                                        Please upload required documents to complete your booking process.
                                    </p>
                                    <button
                                        onClick={() => navigate('/my-bookings')}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                                    >
                                        Upload Documents
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3 justify-center pt-6">
                                <Link
                                    to={`/departments/${deptId}`}
                                    className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    Back to Department
                                </Link>
                                <Link
                                    to="/my-bookings"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                                >
                                    View My Bookings
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Helper Component
const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
    </div>
);

export default BookingPage;