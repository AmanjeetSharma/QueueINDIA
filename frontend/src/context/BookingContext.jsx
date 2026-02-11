import { createContext, useContext, useState, useCallback } from 'react';
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
    const [bookings, setBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();









    // Get available working days for a department
    const getAvailableDates = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/booking/dates`);

            const dates = transformBookingDates(response.data.data);
            setAvailableDates(dates);

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









    // Get available slots for a specific service and date
    const getAvailableSlots = async (deptId, serviceId, date) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/booking/${serviceId}/slots`, {
                params: { date }
            });

            const slots = transformBookingSlots(response.data.data);
            setAvailableSlots(slots);

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








    // Create a new booking
    const createBooking = async (deptId, serviceId, bookingData) => {
        try {
            setLoading(true);
            setError(null);
            const preparedData = prepareBookingData(bookingData);
            console.log("Prepared booking data for API:", preparedData);
            const response = await axiosInstance.post(`/departments/${deptId}/booking/${serviceId}/book`, preparedData);

            const newBooking = transformBookingData(response.data.data);

            // Add to bookings list
            setBookings(prev => [newBooking, ...prev]);
            setCurrentBooking(newBooking);

            toast.success('Your booking has been created successfully!', {
                duration: 3000,
                position: "center-top"
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








    // Get all bookings for the current user
    const getUserBookings = async (filters = {}) => {
        // console.log("🔥 getUserBookings CALLED", filters);
        try {
            setLoading(true);
            setError(null);

            const params = { ...filters };
            const response = await axiosInstance.get('/departments/bookings/user', { params });

            const userBookings = response.data.data.map(transformBookingData);
            setBookings(userBookings);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch bookings';
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








    // Get a specific booking by ID
    const getBookingById = async (bookingId) => {
        // console.log("🔥 getBookingById CALLED", bookingId);
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(`/departments/bookings/${bookingId}`);

            const booking = transformBookingData(response.data.data);
            setCurrentBooking(booking);

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







    // Cancel a booking
    const cancelBooking = async (bookingId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(`departments/bookings/${bookingId}/cancel`);

            const cancelledBooking = transformBookingData(response.data.data);

            // Update bookings list
            setBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? cancelledBooking : booking
                )
            );

            // Update current booking if it's the one being cancelled
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(cancelledBooking);
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








    // Upload documents for a booking
    const uploadDocuments = async (bookingId, { docId, file, name, description }) => {
        try {
            setLoading(true);
            setError(null);

            // Create FormData for single file upload
            const formData = new FormData();
            formData.append('file', file); // Single file field named 'file'
            formData.append('docId', docId); // docId from the document object

            // Note: name and description are already stored in submittedDocs
            // They might not be needed in the request body since they're already in the booking

            const response = await axiosInstance.post(
                `/departments/bookings/${bookingId}/documents/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const updatedBooking = transformBookingData(response.data.data);

            // Update bookings list
            setBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId ? updatedBooking : booking
                )
            );

            // Update current booking
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(updatedBooking);
            }

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to upload document';
            setError(errorMsg);

            toast.error(errorMsg, {
                duration: 4000, // Time in milliseconds for the toast to be visible
                position: 'bottom-left', // Position of the toast on the screen (bottom-left, top-right, etc.)
                style: {
                    background: '#FF4D4D', // Custom background color
                    color: '#FFF', // Text color
                    borderRadius: '8px', // Rounded corners
                    padding: '16px', // Padding inside the toast
                    fontWeight: 'bold', // Bold text
                    fontSize: '16px', // Text size
                },
                icon: '⚠️', // Optional: you can add a custom icon or use a default one
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };
























    // Transform booking dates data
    const transformBookingDates = (dates) => {
        if (!Array.isArray(dates)) return [];

        return dates.map(date => ({
            ...date,
            // Ensure consistent date format
            date: date.date || '',
            // Ensure boolean values
            isClosed: Boolean(date.isClosed),
            isToday: Boolean(date.isToday),
            isPast: Boolean(date.isPast),
            // Format for display
            displayDate: formatDisplayDate(date.date),
            displayDay: formatDisplayDay(date.day)
        }));
    };

    // Transform booking slots data
    const transformBookingSlots = (slots) => {
        if (!Array.isArray(slots)) return [];

        return slots.map(slot => ({
            ...slot,
            // Ensure numeric values
            remaining: Number(slot.remaining) || 0,
            maxTokens: Number(slot.maxTokens) || 0,
            // Ensure boolean values
            available: Boolean(slot.available),
            isFullyBooked: Boolean(slot.isFullyBooked),
            // Add formatted display values
            displayTime: formatSlotTime(slot.time),
            displayStart: formatTimeTo12Hour(slot.start),
            displayEnd: formatTimeTo12Hour(slot.end),
            // Add availability status
            availabilityStatus: slot.remaining > 0 ? 'Available' : 'Full'
        }));
    };

    // Transform booking data
  const transformBookingData = (booking) => {
    if (!booking) return null;

    return {
        ...booking,

        // ✅ FIX: map backend response correctly
        submittedDocs: booking.documents?.required || [],

        metadata: booking.metadata || {
            queueType: "Hybrid",
            isDocumentUploadRequired: true,
            departmentName: "",
            serviceRequiresDocs: true
        },

        // Display helpers
        displayDate: formatDisplayDate(booking.date),
        displayTime: formatSlotTime(booking.slotTime),
        displayStatus: formatBookingStatus(booking.status),

        // Computed flags
        requiresDocumentUpload:
            booking.status === 'PENDING_DOCS' &&
            booking.metadata?.serviceRequiresDocs,

        canCancel: ['PENDING_DOCS', 'DOCS_SUBMITTED', 'UNDER_REVIEW']
            .includes(booking.status)
    };
};


    // Prepare booking data for API
    const prepareBookingData = (data) => {
        return {
            date: data.date,
            slotTime: data.slotTime,
            priorityType: data.priorityType || "NONE",
            notes: data.notes || ""
        };
    };

    // Helper: Format date for display
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Helper: Format day for display
    const formatDisplayDay = (day) => {
        const days = {
            'Mon': 'Monday',
            'Tue': 'Tuesday',
            'Wed': 'Wednesday',
            'Thu': 'Thursday',
            'Fri': 'Friday',
            'Sat': 'Saturday',
            'Sun': 'Sunday'
        };
        return days[day] || day;
    };

    // Helper: Format slot time for display
    const formatSlotTime = (slotTime) => {
        if (!slotTime) return '';
        const [start, end] = slotTime.split('-');
        return `${formatTimeTo12Hour(start)} - ${formatTimeTo12Hour(end)}`;
    };

    // Helper: Convert 24-hour time to 12-hour format
    const formatTimeTo12Hour = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Helper: Format booking status for display
    const formatBookingStatus = (status) => {
        const statusMap = {
            'PENDING_DOCS': 'Pending Documents',
            'DOCS_SUBMITTED': 'Documents Submitted',
            'UNDER_REVIEW': 'Under Review',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed'
        };
        return statusMap[status] || status;
    };

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear current booking
    const clearCurrentBooking = useCallback(() => {
        setCurrentBooking(null);
    }, []);

    // Clear available data
    const clearAvailableData = useCallback(() => {
        setAvailableDates([]);
        setAvailableSlots([]);
    }, []);

    // Check if slot is available
    const checkSlotAvailability = useCallback((slot) => {
        return slot?.available && slot?.remaining > 0;
    }, []);

    // Get upcoming bookings
    const getUpcomingBookings = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(booking =>
            booking.status === 'APPROVED' &&
            booking.date >= today
        );
    }, [bookings]);

    // Get bookings requiring action (document upload)
    const getPendingActionBookings = useCallback(() => {
        return bookings.filter(booking =>
            booking.requiresDocumentUpload &&
            booking.status === 'PENDING_DOCS'
        );
    }, [bookings]);












    const value = {
        // State
        bookings,
        currentBooking,
        availableDates,
        availableSlots,
        loading,
        error,

        // Actions
        getAvailableDates,
        getAvailableSlots,
        createBooking,
        getUserBookings,
        getBookingById,
        cancelBooking,
        uploadDocuments,

        // Helpers
        clearError,
        clearCurrentBooking,
        clearAvailableData,
        checkSlotAvailability,
        getUpcomingBookings,
        getPendingActionBookings,

        // Utility functions (exported for convenience)
        formatDisplayDate,
        formatSlotTime,
        formatTimeTo12Hour,
        formatBookingStatus
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};