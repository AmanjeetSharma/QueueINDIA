import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { useService } from '../../context/ServiceContext';
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
    FaIdCard
} from 'react-icons/fa';

const SlotBooking = () => {
    const { deptId, serviceId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentDepartment, getDepartmentById } = useDepartment();
    const { currentService, getServiceById } = useService();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingStep, setBookingStep] = useState(1); // 1: Select slot, 2: Confirm booking

    // Mock available slots data
    const mockSlots = [
        { id: 1, time: '09:00 AM - 09:30 AM', available: true, tokens: 5 },
        { id: 2, time: '09:30 AM - 10:00 AM', available: true, tokens: 3 },
        { id: 3, time: '10:00 AM - 10:30 AM', available: false, tokens: 0 },
        { id: 4, time: '10:30 AM - 11:00 AM', available: true, tokens: 8 },
        { id: 5, time: '11:00 AM - 11:30 AM', available: true, tokens: 2 },
        { id: 6, time: '11:30 AM - 12:00 PM', available: true, tokens: 6 },
        { id: 7, time: '02:00 PM - 02:30 PM', available: true, tokens: 4 },
        { id: 8, time: '02:30 PM - 03:00 PM', available: true, tokens: 7 },
        { id: 9, time: '03:00 PM - 03:30 PM', available: false, tokens: 0 },
        { id: 10, time: '03:30 PM - 04:00 PM', available: true, tokens: 1 },
    ];

    useEffect(() => {
        if (deptId && serviceId) {
            getServiceById(deptId, serviceId);
            getDepartmentById(deptId);
        }
    }, [deptId, serviceId]);

    useEffect(() => {
        if (selectedDate) {
            // Simulate API call to fetch available slots
            setLoading(true);
            setTimeout(() => {
                setAvailableSlots(mockSlots);
                setLoading(false);
            }, 1000);
        }
    }, [selectedDate]);

    // Get dates for the next 7 days
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Skip Sundays
            if (date.getDay() !== 0) {
                dates.push({
                    date: date.toISOString().split('T')[0],
                    display: date.toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                    }),
                    isToday: i === 0
                });
            }
        }
        return dates;
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot) => {
        if (slot.available) {
            setSelectedSlot(slot);
        }
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Slot booked successfully!', {
                duration: 5000,
                position: "bottom-left"
            });
            setBookingStep(2);
        }, 2000);
    };

    const handleBackToSlots = () => {
        setBookingStep(1);
        setSelectedSlot(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <FaExclamationTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
                    <p className="text-slate-600 mb-6">Please login to book a slot.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentService || !currentDepartment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    const availableDates = getAvailableDates();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/departments/${deptId}/services/${serviceId}`}
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Back to Service</span>
                        </Link>
                        <div className="w-px h-6 bg-slate-300"></div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Book Your Slot</h1>
                            <p className="text-slate-600">{currentService.name} • {currentDepartment.name}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            1
                        </div>
                        <div className={`ml-2 text-sm font-medium ${bookingStep >= 1 ? 'text-blue-600' : 'text-slate-500'}`}>
                            Select Slot
                        </div>
                    </div>
                    <div className="w-12 h-px bg-slate-300 mx-4"></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            2
                        </div>
                        <div className={`ml-2 text-sm font-medium ${bookingStep >= 2 ? 'text-blue-600' : 'text-slate-500'}`}>
                            Confirm Booking
                        </div>
                    </div>
                </div>

                {bookingStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                        {/* Service Info */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 text-lg mb-2">Service Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-800">Service: {currentService.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-800">Avg. Time: {currentService.avgServiceTime} mins</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaUsers className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-800">Department: {currentDepartment.name}</span>
                                </div>
                                {currentService.priorityAllowed && (
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-green-800">Priority Service Available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-slate-900 text-lg mb-4">Select Date</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {availableDates.map((dateObj) => (
                                    <button
                                        key={dateObj.date}
                                        onClick={() => handleDateSelect(dateObj.date)}
                                        className={`p-3 rounded-lg border-2 text-center transition-all ${selectedDate === dateObj.date
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                            } ${dateObj.isToday ? 'ring-2 ring-blue-200' : ''}`}
                                    >
                                        <div className="font-medium">{dateObj.display.split(' ')[0]}</div>
                                        <div className="text-sm">{dateObj.display.split(' ').slice(1).join(' ')}</div>
                                        {dateObj.isToday && (
                                            <div className="text-xs text-blue-600 mt-1">Today</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slot Selection */}
                        {selectedDate && (
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg mb-4">
                                    Available Slots for {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>

                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                                        <p className="text-slate-600">Loading available slots...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                onClick={() => handleSlotSelect(slot)}
                                                disabled={!slot.available}
                                                className={`p-4 rounded-lg border-2 text-left transition-all ${selectedSlot?.id === slot.id
                                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                        : slot.available
                                                            ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            : 'border-slate-100 bg-slate-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <FaClock className={`w-4 h-4 ${slot.available ? 'text-slate-600' : 'text-slate-400'
                                                            }`} />
                                                        <span className={`font-medium ${slot.available ? 'text-slate-900' : 'text-slate-400'
                                                            }`}>
                                                            {slot.time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaUsers className="w-3 h-3 text-slate-400" />
                                                        <span className="text-sm text-slate-500">
                                                            {slot.tokens} tokens
                                                        </span>
                                                    </div>
                                                </div>
                                                {!slot.available && (
                                                    <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <FaExclamationTriangle className="w-3 h-3" />
                                                        Fully Booked
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Button */}
                        {selectedSlot && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={handleConfirmBooking}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center gap-2"
                                >
                                    <FaCalendarCheck className="w-5 h-5" />
                                    Confirm Booking for {selectedSlot.time}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {bookingStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                        {/* Success Message */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-slate-600">Your slot has been successfully booked.</p>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 mb-6">
                            <h3 className="font-semibold text-slate-900 text-lg mb-4">Booking Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-600">Service</p>
                                    <p className="font-medium text-slate-900">{currentService.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600">Department</p>
                                    <p className="font-medium text-slate-900">{currentDepartment.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600">Date</p>
                                    <p className="font-medium text-slate-900">
                                        {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600">Time Slot</p>
                                    <p className="font-medium text-slate-900">{selectedSlot.time}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600">Booking ID</p>
                                    <p className="font-medium text-slate-900">BK{Date.now().toString().slice(-6)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600">Status</p>
                                    <p className="font-medium text-green-600">Confirmed</p>
                                </div>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
                            <h3 className="font-semibold text-blue-900 text-lg mb-4 flex items-center gap-2">
                                <FaUser className="w-4 h-4" />
                                User Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-blue-700">Name</p>
                                    <p className="font-medium text-blue-900">{user?.name || 'User'}</p>
                                </div>
                                <div>
                                    <p className="text-blue-700">Email</p>
                                    <p className="font-medium text-blue-900">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Important Instructions */}
                        <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                            <h3 className="font-semibold text-amber-900 text-lg mb-4 flex items-center gap-2">
                                <FaInfoCircle className="w-4 h-4" />
                                Important Instructions
                            </h3>
                            <ul className="text-sm text-amber-800 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Arrive at the department 15 minutes before your scheduled time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Bring your government ID proof and all required documents</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Carry a printout or digital copy of this booking confirmation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>Late arrivals may result in cancellation of your slot</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleBackToSlots}
                                className="flex-1 py-3 px-6 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                Book Another Slot
                            </button>
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                View My Bookings
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default SlotBooking;