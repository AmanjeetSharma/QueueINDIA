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








    // Get single service by ID (public)
    const getServiceById = async (deptId, serviceId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/departments/${deptId}/services/${serviceId}`);

            // Transform service data
            const serviceData = transformServiceData(response.data.data);
            setCurrentService(serviceData);

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

            const preparedData = prepareServiceData(serviceData);
            const response = await axiosInstance.post(`/departments/${deptId}/services`, preparedData);

            const newService = transformServiceData(response.data.data);

            // Add to services list if we have one
            setServices(prev => [...prev, newService]);

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

            const preparedData = prepareServiceData(updateData);
            const response = await axiosInstance.put(`/departments/${deptId}/services/${serviceId}`, preparedData);

            const updatedService = transformServiceData(response.data.data);

            // Update services list if we have it
            setServices(prev =>
                prev.map(service => service._id === serviceId ? updatedService : service)
            );

            // Update current service if it's the one being updated
            if (currentService?._id === serviceId) {
                setCurrentService(updatedService);
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

            // Remove from services list if we have it
            setServices(prev => prev.filter(service => service._id !== serviceId));

            // Clear current service if it's the one being deleted
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











    // Transform service data for consistency
    const transformServiceData = (service) => {
        if (!service) return null;

        return {
            ...service,
            // Ensure tokenManagement has all required fields
            tokenManagement: service.tokenManagement || {
                maxDailyServiceTokens: null,
                maxTokensPerSlot: 10,
                queueType: "Hybrid",
                timeBtwEverySlot: 15,
                slotStartTime: "10:00",
                slotEndTime: "17:00",
                slotWindows: []
            },
            // Ensure requiredDocs is always an array
            requiredDocs: service.requiredDocs || [],
            // Ensure serviceCode is uppercase
            serviceCode: service.serviceCode?.toUpperCase() || service.serviceCode
        };
    };

    // Prepare service data for API
    const prepareServiceData = (data) => {
        return {
            name: data.name,
            serviceCode: data.serviceCode?.toUpperCase(),
            description: data.description || "",
            priorityAllowed: data.priorityAllowed ?? true,
            isDocumentUploadRequired: data.isDocumentUploadRequired ?? true,
            tokenManagement: data.tokenManagement || {
                maxDailyServiceTokens: null,
                maxTokensPerSlot: 10,
                queueType: "Hybrid",
                timeBtwEverySlot: 15,
                slotStartTime: "10:00",
                slotEndTime: "17:00",
                slotWindows: []
            },
            requiredDocs: data.requiredDocs?.map(doc => ({
                name: doc.name,
                description: doc.description || "",
                isMandatory: doc.isMandatory ?? true
            })) || []
        };
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
        getServiceById,
        addService,
        updateService,
        deleteService,
        clearError,
        clearCurrentService
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};