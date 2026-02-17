// contexts/AdminContext.jsx
import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within a AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();






    // Get admins for a department
    const getDepartmentStaff = async (deptId) => {
        try {
            console.log(`REQ REACHED`);
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/admins`);
            setAdmins(response.data.data?.admins || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch admins';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };









    // Assign admin to department
    const assignAdminToDepartment = async (deptId, adminEmail) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/departments/${deptId}/assign-admin`, {
                adminEmail
            });
            
            // Update local state
            setAdmins(prev => [...prev, response.data.data]);
            
            toast.success('Admin assigned successfully!');
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to assign admin';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Remove admin from department
    const removeAdminFromDepartment = async (deptId, adminId) => {
        try {
            setLoading(true);
            setError(null);
            await axiosInstance.delete(`/departments/${deptId}/admins/${adminId}`);
            
            // Update local state
            setAdmins(prev => prev.filter(admin => admin._id !== adminId));
            
            toast.success('Admin removed successfully!');
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to remove admin';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    const value = {
        admins,
        loading,
        error,
        getDepartmentStaff,
        assignAdminToDepartment,
        removeAdminFromDepartment,
        clearError
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};