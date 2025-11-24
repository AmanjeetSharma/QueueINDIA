import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

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
    
    const { user } = useAuth();

    // Get all departments with pagination and filters
    const getDepartments = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            // Build query string from params
            const queryParams = new URLSearchParams();
            
            // Add all provided parameters to query
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value);
                }
            });

            // Ensure limit is always set
            if (!params.limit) {
                queryParams.append('limit', limit);
            }

            const response = await axiosInstance.get(`/departments/all-departments?${queryParams}`);
            const data = response.data.data;
            
            setDepartments(data.departments || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.page || 1);
            setLimit(data.limit || 10);
            
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch departments';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [limit]);









    // Get single department by ID (public)
    const getDepartmentById = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/department/${deptId}`);

            // The department data is in response.data.data
            setCurrentDepartment(response.data.data);

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
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post('/departments', departmentData);
            setDepartments(prev => [...prev, response.data.data]);

            toast.success('Department created successfully!', {
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
            const response = await axiosInstance.patch(`/departments/${deptId}`, updateData);
            setDepartments(prev =>
                prev.map(dept => dept._id === deptId ? response.data.data : dept)
            );
            if (currentDepartment?._id === deptId) {
                setCurrentDepartment(response.data.data);
            }

            toast.success('Department updated successfully!', {
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
            await axiosInstance.delete(`/departments/${deptId}`);
            setDepartments(prev => prev.filter(dept => dept._id !== deptId));
            if (currentDepartment?._id === deptId) {
                setCurrentDepartment(null);
            }

            toast.success('Department deleted successfully!', {
                duration: 3000,
                position: "bottom-left"
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










    // Clear error
    const clearError = () => setError(null);

    // Clear current department
    const clearCurrentDepartment = () => setCurrentDepartment(null);

    // Load departments on mount
    const loadDepartments = useCallback(async () => {
        try {
            await getDepartments();
        } catch (error) {
            // Error already handled in getDepartments
            console.error('Failed to load departments on mount:', error);
        }
    }, []);

    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    const value = {
        departments,
        currentDepartment,
        loading,
        error,
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
