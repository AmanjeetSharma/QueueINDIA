import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';
import { showBackendStartupToast } from './components/BackendStartupToast';

const DepartmentContext = createContext();

export const useDepartment = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error('useDepartment must be used within a DepartmentProvider');
    }
    return context;
};

export const DepartmentProvider = ({ children }) => {
    const [departments, setDepartments] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [filters, setFilters] = useState({});

    const { user } = useAuth();














    // Get all departments with pagination and filters
    const getDepartments = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            // Store active filters
            const activeFilters = Object.fromEntries(
                Object.entries(params).filter(([_, value]) =>
                    value !== undefined && value !== null && value !== ''
                )
            );

            // Remove pagination from filters for storage
            const { page, limit, ...filterParams } = activeFilters;
            setFilters(filterParams);

            // Build query string
            const queryParams = new URLSearchParams();
            Object.entries(activeFilters).forEach(([key, value]) => {
                queryParams.append(key, value);
            });

            const response = await axiosInstance.get(`/departments/all-departments?${queryParams}`);
            const data = response.data.data;

            setDepartments(data.departments || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.page || 1);
            setLimit(data.limit || 10);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch departments or Backend is starting up as it can take up to 60-90 seconds';
            setError(errorMsg);
            showBackendStartupToast(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);














    // Get single department by ID (public)
    const getDepartmentById = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/department/${deptId}`);

            // Transform the response to match new schema
            const departmentData = transformDepartmentData(response.data.data);
            setCurrentDepartment(departmentData);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch department';
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













    // Create department (SUPER_ADMIN only)
    const createDepartment = async (departmentData) => {
        try {
            console.log('Creating department with data:', departmentData);
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post('/departments/create', departmentData);

            const newDept = transformDepartmentData(response.data.data);
            setDepartments(prev => [...prev, newDept]);

            toast.success('Department created!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to create department';
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












    // Update department (SUPER_ADMIN or assigned ADMIN)
    const updateDepartment = async (deptId, updateData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.patch(`/departments/update/${deptId}`, updateData);

            const updatedDept = transformDepartmentData(response.data.data);
            setDepartments(prev =>
                prev.map(dept => dept._id === deptId ? updatedDept : dept)
            );
            if (currentDepartment?._id === deptId) {
                setCurrentDepartment(updatedDept);
            }

            toast.success('Department updated!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to update department';
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















    // Delete department (SUPER_ADMIN only)
    const deleteDepartment = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            await axiosInstance.delete(`/departments/delete/${deptId}`);
            setDepartments(prev => prev.filter(dept => dept._id !== deptId));
            if (currentDepartment?._id === deptId) {
                setCurrentDepartment(null);
            }

            toast.success('Department deleted!', {
                duration: 3000,
                position: "center-top"
            });

        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to delete department';
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












    // Transform department data to match frontend expectations
    const transformDepartmentData = (department) => {
        if (!department) return null;

        return {
            ...department,
            // Add compatibility fields if needed
            stats: department.stats || {
                totalServices: department.services?.length || 0,
                totalAdmins: department.admins?.length || 0,
                totalRatings: department.ratings?.length || 0,
                averageRating: calculateAverageRating(department.ratings)
            },
            location: department.location || {
                city: department.address?.city,
                state: department.address?.state,
                pincode: department.address?.pincode
            }
        };
    };


    // Calculate average rating
    const calculateAverageRating = (ratings = []) => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + (rating.rating || 0), 0);
        return parseFloat((sum / ratings.length).toFixed(1));
    };


    // Clear error
    const clearError = () => setError(null);

    // Clear current department
    const clearCurrentDepartment = () => setCurrentDepartment(null);

    // Load departments on mount
    const loadDepartments = useCallback(async () => {
        try {
            await getDepartments({ page: 1, limit: 9 });
        } catch (error) {
            console.error('Failed to load departments on mount:', error);
        }
    }, [getDepartments]);

    const value = {
        departments,
        currentDepartment,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        limit,
        filters,
        getDepartments,
        getDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        clearError,
        clearCurrentDepartment,
        setCurrentDepartment
    };

    return (
        <DepartmentContext.Provider value={value}>
            {children}
        </DepartmentContext.Provider>
    );
};