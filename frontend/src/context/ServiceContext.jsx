import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const ServiceContext = createContext();

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
};

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Get all services of a department (public)
    const getServices = async (deptId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/services`);
            setServices(response.data.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch services';
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








    // Get single service by ID (public)
    const getServiceById = async (deptId, serviceId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/services/${serviceId}`);
            setCurrentService(response.data.data);
            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch service';
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







    
    // Add a new service to department (SUPER_ADMIN or assigned ADMIN)
    const addService = async (deptId, serviceData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/departments/${deptId}/services`, serviceData);
            setServices(prev => [...prev, response.data.data]);

            toast.success('Service created successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to create service';
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







    // Update service in a department (SUPER_ADMIN or assigned ADMIN)
    const updateService = async (deptId, serviceId, updateData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.patch(`/departments/${deptId}/services/${serviceId}`, updateData);
            setServices(prev =>
                prev.map(service => service._id === serviceId ? response.data.data : service)
            );
            if (currentService?._id === serviceId) {
                setCurrentService(response.data.data);
            }

            toast.success('Service updated successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to update service';
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








    // Delete a service from department (SUPER_ADMIN or assigned ADMIN)
    const deleteService = async (deptId, serviceId) => {
        try {
            setLoading(true);
            setError(null);
            await axiosInstance.delete(`/departments/${deptId}/services/${serviceId}`);
            setServices(prev => prev.filter(service => service._id !== serviceId));
            if (currentService?._id === serviceId) {
                setCurrentService(null);
            }

            toast.success('Service deleted successfully!', {
                duration: 3000,
                position: "bottom-left"
            });

        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to delete service';
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

    // Clear current service
    const clearCurrentService = () => setCurrentService(null);

    const value = {
        services,
        currentService,
        loading,
        error,
        getServices,
        getServiceById,
        addService,
        updateService,
        deleteService,
        clearError,
        clearCurrentService,
        setCurrentService
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};