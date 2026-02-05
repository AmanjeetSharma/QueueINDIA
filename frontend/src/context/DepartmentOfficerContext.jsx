// contexts/DepartmentOfficerContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const DepartmentOfficerContext = createContext();

export const useDepartmentOfficer = () => {
    const context = useContext(DepartmentOfficerContext);
    if (!context) {
        throw new Error('useDepartmentOfficer must be used within a DepartmentOfficerProvider');
    }
    return context;
};

export const DepartmentOfficerProvider = ({ children }) => {
    const [departmentBookings, setDepartmentBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [filters, setFilters] = useState({});

    const { user } = useAuth();







    // 1. Get all bookings for the department
    const getDepartmentBookings = useCallback(async (params = {}) => {
        // Prevent API call before auth is ready
        if (!user) {
            console.log("User not ready, skipping fetch");
            return;
        }

        try {
            // console.log('User info from context:', user);
            // console.log('Fetching department bookings with params:', params);

            setLoading(true);
            setError(null);

            // Separate pagination from filters
            const { page: p, limit: l, ...rest } = params;

            const activeFilters = Object.fromEntries(
                Object.entries(rest).filter(([_, value]) =>
                    value !== undefined && value !== null && value !== ''
                )
            );

            // Store pagination state
            const page = p || currentPage;
            const limitParam = l || limit;

            setFilters(activeFilters);
            setCurrentPage(page);
            setLimit(limitParam);

            // Build query string
            const queryParams = new URLSearchParams();
            Object.entries({ ...activeFilters, page, limit: limitParam })
                .forEach(([key, value]) => {
                    queryParams.append(key, value);
                });

            const response = await axiosInstance.get(
                `/officer/bookings?${queryParams}`
            );
            const data = response.data.data;

            setDepartmentBookings(data.bookings || []);
            setTotalBookings(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
            setCurrentPage(data.pagination?.page || 1);
            setLimit(data.pagination?.limit || 8);

            return response.data;
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message ||
                'Failed to fetch department bookings';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, currentPage, limit]);















    // 2. Get details of a specific booking
    const getBookingDetailsForOfficer = useCallback(async (bookingId) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const response = await axiosInstance.get(`/officer/bookings/${bookingId}`);
            const data = response.data.data;

            setCurrentBooking(data);
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
    }, []);










    // 3. Approve a booking document
    const approveBooking = useCallback(async (bookingId, docId) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId || !docId) {
                throw new Error('Booking ID and Document ID are required');
            }

            const response = await axiosInstance.post(
                `/officer/bookings/${bookingId}/docs/${docId}/approve`
            );

            // Update local state directly instead of fetching list
            if (currentBooking?._id === bookingId) {
                // Update the specific document status in currentBooking
                setCurrentBooking(prev => {
                    if (!prev) return prev;
                    const updatedDocs = prev.submittedDocs?.map(doc =>
                        doc._id === docId ? { ...doc, status: 'APPROVED' } : doc
                    );
                    return { ...prev, submittedDocs: updatedDocs };
                });
            }

            const message = response.data.message || 'Document approved successfully';
            toast.success(message, {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to approve document';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentBooking]);











    // 4. Reject a document
    const rejectDocument = useCallback(async (bookingId, docId, reason) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId || !docId) {
                throw new Error('Booking ID and Document ID are required');
            }

            const response = await axiosInstance.post(
                `/officer/bookings/${bookingId}/docs/${docId}/reject`,
                { reason }
            );

            // Update local state directly instead of fetching list
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(prev => {
                    if (!prev) return prev;
                    const updatedDocs = prev.submittedDocs?.map(doc =>
                        doc._id === docId ? {
                            ...doc,
                            status: 'REJECTED',
                            rejectionReason: reason
                        } : doc
                    );
                    return { ...prev, submittedDocs: updatedDocs };
                });
            }

            const message = response.data.message || 'Document rejected successfully';
            toast.success(message, {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to reject document';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentBooking]);









    // 5. Reject a booking
    const rejectBooking = useCallback(async (bookingId, reason) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const response = await axiosInstance.post(
                `/officer/bookings/${bookingId}/reject`,
                { reason }
            );

            // Don't fetch list, just update current booking if it matches
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(prev => ({
                    ...prev,
                    status: 'REJECTED',
                    bookingRejectionReason: reason
                }));
            }

            const message = response.data.message || 'Booking rejected successfully';
            toast.success(message, {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to reject booking';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentBooking]);










    // 6. Cancel a booking
    const cancelBooking = useCallback(async (bookingId) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const response = await axiosInstance.post(
                `/officer/bookings/${bookingId}/cancel`
            );

            // Don't fetch list, just update current booking
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(prev => ({
                    ...prev,
                    status: 'CANCELLED'
                }));
            }

            const message = response.data.message || 'Booking cancelled successfully';
            toast.success(message, {
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
    }, [currentBooking]);








    // 7. Complete a booking
    const completeBooking = useCallback(async (bookingId) => {
        try {
            setLoading(true);
            setError(null);

            if (!bookingId) {
                throw new Error('Booking ID is required');
            }

            const response = await axiosInstance.post(
                `/officer/bookings/${bookingId}/complete`
            );

            // Don't fetch list, just update current booking
            if (currentBooking?._id === bookingId) {
                setCurrentBooking(prev => ({
                    ...prev,
                    status: 'COMPLETED'
                }));
            }

            const message = response.data.message || 'Booking completed successfully';
            toast.success(message, {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to complete booking';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentBooking]);










    // Clear current booking
    const clearCurrentBooking = useCallback(() => {
        setCurrentBooking(null);
    }, []);

    // Refresh bookings with current filters
    const refreshBookings = useCallback(() => {
        return getDepartmentBookings({ page: currentPage, ...filters });
    }, [currentPage, filters, getDepartmentBookings]);

    const value = {
        // State
        departmentBookings,
        currentBooking,
        loading,
        error,
        totalBookings,
        totalPages,
        currentPage,
        limit,
        filters,

        // Actions
        getDepartmentBookings,
        getBookingDetailsForOfficer,
        approveBooking,
        rejectDocument,
        rejectBooking,
        cancelBooking,
        completeBooking,
        clearCurrentBooking,
        refreshBookings,

        // Setters
        setCurrentPage,
        setLimit,
        setFilters,
    };

    return (
        <DepartmentOfficerContext.Provider value={value}>
            {children}
        </DepartmentOfficerContext.Provider>
    );
};