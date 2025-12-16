import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

export const BookingProvider = ({ children }) => {
    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [departmentBookings, setDepartmentBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // ==================== BOOKING FLOW ====================

    // Step 1: Get available working days for a department
    const getAvailableDates = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/booking/dates`);
            setAvailableDates(response.data.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch available dates';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Get available slots for a specific service and date
    const getAvailableSlots = async (deptId, serviceId, date) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/booking/${serviceId}/slots`, {
                params: { date }
            });
            setAvailableSlots(response.data.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch available slots';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Create a new booking
    const createBooking = async (deptId, serviceId, bookingData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(
                `/departments/${deptId}/booking/${serviceId}/book`,
                bookingData
            );

            const newBooking = response.data.data;

            // Add to user bookings
            setUserBookings(prev => [newBooking, ...prev]);

            toast.success('Booking created successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to create booking';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Upload documents for a booking
    const uploadBookingDocuments = async (bookingId, documents) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/bookings/${bookingId}/documents`, { documents });

            // Update the booking in userBookings
            setUserBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? response.data.data : booking
                )
            );

            // Update current booking if it's the same
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(response.data.data);
            }

            toast.success('Documents uploaded successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to upload documents';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==================== USER BOOKING MANAGEMENT ====================

    // Get all bookings for the logged-in user
    const getUserBookings = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const response = await axiosInstance.get(`/bookings/my-bookings?${queryParams}`);
            setUserBookings(response.data.data?.bookings || response.data.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch your bookings';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get specific booking details
    const getBookingById = async (bookingId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/bookings/booking/${bookingId}`);
            setCurrentBooking(response.data.data);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch booking details';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Cancel a booking (user can cancel before approval)
    const cancelBooking = async (bookingId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.patch(`/bookings/booking/${bookingId}/cancel`);

            // Update in userBookings
            setUserBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? response.data.data : booking
                )
            );

            // Update current booking if it's the same
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(response.data.data);
            }

            toast.success('Booking cancelled successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to cancel booking';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==================== DEPARTMENT ADMIN FUNCTIONS ====================

    // Get all bookings for a department (admin view)
    const getDepartmentBookings = async (deptId, params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const response = await axiosInstance.get(`/bookings/department/${deptId}/bookings?${queryParams}`);
            setDepartmentBookings(response.data.data?.bookings || response.data.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch department bookings';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update booking status (admin only)
    const updateBookingStatus = async (bookingId, statusData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.patch(`/bookings/booking/${bookingId}/status`, statusData);

            // Update in departmentBookings
            setDepartmentBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? response.data.data : booking
                )
            );

            // Update in userBookings if present
            setUserBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? response.data.data : booking
                )
            );

            // Update current booking if it's the same
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(response.data.data);
            }

            toast.success('Booking status updated successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to update booking status';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==================== HELPER FUNCTIONS ====================

    // Check if a date is available for booking
    const isDateAvailable = (dateString) => {
        const date = availableDates.find(d => d.date === dateString);
        return date && !date.isClosed && !date.isPast;
    };

    // Get available slots for a specific date
    const getSlotsForDate = (dateString) => {
        return availableSlots.filter(slot => {
            // Filter slots that are available and not fully booked
            return slot.available && !slot.isFullyBooked;
        });
    };

    // Check if user can cancel a booking
    const canCancelBooking = (booking) => {
        if (!booking) return false;
        return ['PENDING_DOCS', 'DOCS_SUBMITTED'].includes(booking.status);
    };

    // Check if booking requires document upload
    const requiresDocumentUpload = (booking) => {
        if (!booking) return false;
        return booking.status === 'PENDING_DOCS' &&
            booking.metadata?.isDocumentUploadRequired === true;
    };

    // Format booking for display
    const formatBooking = (booking) => {
        if (!booking) return null;

        return {
            ...booking,
            formattedDate: booking.date,
            formattedTime: booking.slotTime?.replace('-', ' - '),
            isPriority: booking.priorityType !== 'NONE',
            priorityLabel: getPriorityLabel(booking.priorityType),
            statusLabel: getStatusLabel(booking.status)
        };
    };

    // Get priority label
    const getPriorityLabel = (priorityType) => {
        const labels = {
            'NONE': 'Regular',
            'SENIOR_CITIZEN': 'Senior Citizen',
            'PREGNANT_WOMEN': 'Pregnant Women',
            'DIFFERENTLY_ABLED': 'Differently Abled'
        };
        return labels[priorityType] || 'Regular';
    };

    // Get status label
    const getStatusLabel = (status) => {
        const labels = {
            'PENDING_DOCS': 'Pending Documents',
            'DOCS_SUBMITTED': 'Documents Submitted',
            'UNDER_REVIEW': 'Under Review',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed'
        };
        return labels[status] || status;
    };

    // Clear states
    const clearAvailableDates = () => setAvailableDates([]);
    const clearAvailableSlots = () => setAvailableSlots([]);
    const clearUserBookings = () => setUserBookings([]);
    const clearDepartmentBookings = () => setDepartmentBookings([]);
    const clearCurrentBooking = () => setCurrentBooking(null);
    const clearError = () => setError(null);

    const value = {
        // State
        availableDates,
        availableSlots,
        userBookings,
        currentBooking,
        departmentBookings,
        loading,
        error,

        // Booking Flow Functions
        getAvailableDates,
        getAvailableSlots,
        createBooking,
        uploadBookingDocuments,

        // User Booking Management
        getUserBookings,
        getBookingById,
        cancelBooking,

        // Department Admin Functions
        getDepartmentBookings,
        updateBookingStatus,

        // Helper Functions
        isDateAvailable,
        getSlotsForDate,
        canCancelBooking,
        requiresDocumentUpload,
        formatBooking,
        getPriorityLabel,
        getStatusLabel,

        // Clear Functions
        clearAvailableDates,
        clearAvailableSlots,
        clearUserBookings,
        clearDepartmentBookings,
        clearCurrentBooking,
        clearError
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};