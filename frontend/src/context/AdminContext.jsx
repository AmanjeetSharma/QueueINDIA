// contexts/AdminContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [staff, setStaff] = useState({
        admins: [],
        officers: []
    });
    const [departmentInfo, setDepartmentInfo] = useState({
        departmentId: null,
        departmentName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);









    // Get all staff (admins + officers) for a department
    const getDepartmentStaff = useCallback(async (deptId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(`/departments/${deptId}/admins`);
            // console.log('RESPONSE RECEIVED', response.data); //Debug log

            // The response structure should be: { data: { departmentId, departmentName, admins, officers } }
            const responseData = response.data.data || response.data;

            setStaff({
                admins: responseData?.admins || [],
                officers: responseData?.officers || []
            });

            setDepartmentInfo({
                departmentId: responseData?.departmentId || deptId,
                departmentName: responseData?.departmentName || ''
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch department staff';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 3000,
                position: 'top-center',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);












    // Assign staff (admin or officer) to department
    const assignStaff = useCallback(async (deptId, email, role) => {
        try {
            console.log('REQ REACHED TO ASSIGN STAFF');
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(`/departments/${deptId}/assign-admin`, {
                email,
                role
            });

            const assignedUser = response.data.data?.assignedUser || response.data.data;

            toast.success('Staff assigned successfully!', {
                duration: 3000,
                position: 'top-center',
            });

            // Refresh staff list to get updated data
            await getDepartmentStaff(deptId);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to assign staff';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 3000,
                position: 'top-center',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getDepartmentStaff]);










    // Remove staff from department
    const removeStaff = useCallback(async (deptId, userId) => {
        try {
            setLoading(true);
            setError(null);
            // console.log(`REQ REACHED TO REMOVE STAFF | Dept ID: ${deptId} | User ID: ${userId}`); // Debug log
            const response = await axiosInstance.delete(`/departments/${deptId}/admins/${userId}`);

            toast.success('Staff removed successfully!', {
                duration: 3000,
                position: 'top-center',
            });

            // Refresh staff list
            await getDepartmentStaff(deptId);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to remove staff';

            // Special handling for last admin error
            if (err?.response?.status === 400 && errorMsg.includes('LAST ADMIN')) {
                toast.error('Cannot remove the last admin. Please assign another admin first.', {
                    duration: 4000,
                    position: 'top-center',
                });
            } else {
                toast.error(errorMsg, {
                    duration: 3000,
                    position: 'top-center',
                });
            }

            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getDepartmentStaff]);











    // Update staff role
    const updateStaffRole = useCallback(async (deptId, userId, newRole) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.put(`/departments/${deptId}/admins/${userId}`, {
                role: newRole
            });

            toast.success('Staff role updated successfully!', {
                duration: 3000,
                position: 'top-center',
            });

            // Refresh staff list
            await getDepartmentStaff(deptId);

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to update staff role';

            // Special handling for last admin error when downgrading
            if (err?.response?.status === 400 && errorMsg.includes('last ADMIN')) {
                toast.error('Cannot downgrade the last admin. Please assign another admin first.', {
                    duration: 4000,
                    position: 'top-center',
                });
            } else {
                toast.error(errorMsg, {
                    duration: 3000,
                    position: 'top-center',
                });
            }

            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getDepartmentStaff]);









    // Get combined staff list with role labels
    const getAllStaff = useCallback(() => {
        return [
            ...staff.admins.map(admin => ({ ...admin, roleType: 'ADMIN' })),
            ...staff.officers.map(officer => ({ ...officer, roleType: 'DEPARTMENT_OFFICER' }))
        ];
    }, [staff]);

    // Get staff counts
    const getStaffCounts = useCallback(() => {
        return {
            total: staff.admins.length + staff.officers.length,
            admins: staff.admins.length,
            officers: staff.officers.length
        };
    }, [staff]);

    // Check if current user is admin of this department
    const isCurrentUserAdmin = useCallback((deptId) => {
        if (!user || !deptId) return false;

        // SUPER_ADMIN is always considered an admin
        if (user.role === 'SUPER_ADMIN') return true;

        // Check if user is in admins list
        return staff.admins.some(admin => admin._id === user._id);
    }, [user, staff.admins]);

    // Check if user can manage staff
    const canManageStaff = useCallback((deptId) => {
        if (!user) return false;

        // SUPER_ADMIN can manage any department
        if (user.role === 'SUPER_ADMIN') return true;

        // ADMIN can only manage if they belong to this department and are in admins list
        if (user.role === 'ADMIN') {
            return user.departmentId?.toString() === deptId?.toString() &&
                isCurrentUserAdmin(deptId);
        }

        return false;
    }, [user, isCurrentUserAdmin]);

    const value = {
        // State
        staff,
        departmentInfo,
        loading,
        error,

        // Getters
        getAllStaff,
        getStaffCounts,
        isCurrentUserAdmin,
        canManageStaff,

        // Actions
        getDepartmentStaff,
        assignStaff,
        removeStaff,
        updateStaffRole,
        clearError
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};