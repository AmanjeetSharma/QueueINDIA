import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../lib/http';
import toast from 'react-hot-toast';

const QueueContext = createContext();

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};

export const QueueProvider = ({ children }) => {
    const [liveQueue, setLiveQueue] = useState({
        serving: null,
        waiting: [],
        totalWaiting: 0,
    });
    const [queueStats, setQueueStats] = useState(null);
    const [departmentServices, setDepartmentServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();








    // Get live queue for a specific service and date
    const getLiveQueue = useCallback(async (serviceId, date, departmentId = null) => {
        // console.log("request reached");
        // console.log("Fetching live queue with params:", {
        //     serviceId,
        //     date,
        //     departmentId
        // });
        try {
            setLoading(true);
            setError(null);

            const params = {
                serviceId,
                date,
                ...(departmentId && { departmentId })
            };

            const response = await axiosInstance.get('/departments/queue/live', { params });

            setLiveQueue({
                serving: response.data.data.serving,
                waiting: response.data.data.waiting || [],
                totalWaiting: response.data.data.totalWaiting || 0,
                departmentId: response.data.data.departmentId,
                serviceId: response.data.data.serviceId,
                date: response.data.data.date
            });

            // toast.success(response.data.message, {
            //     duration: 3000,
            //     position: 'bottom-left'
            // });

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch live queue';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);









    const recallSkippedTokens = useCallback(async (serviceId, date, departmentId = null) => {
        try {
            setLoading(true);
            setError(null);

            const deptId = departmentId || user?.departmentId;
            if (!deptId) {
                throw new Error('Department ID is required');
            }

            const response = await axiosInstance.post('/queue/tokens/recall-skipped', {
                serviceId,
                date,
                departmentId: deptId
            });

            toast.success(response.data.message, {
                duration: 3000,
                position: 'bottom-left'
            });

            // Refresh queue data after recall
            if (serviceId && date && deptId) {
                await getLiveQueue(serviceId, date, deptId);
            }

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to recall skipped tokens';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user?.departmentId, getLiveQueue]);










    // Serve next token
    const serveNextToken = useCallback(async (serviceId, date) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post('/departments/queue/tokens/serve-next', {
                serviceId,
                date
            });

            toast.success(response.data.message, {
                duration: 3000,
                position: 'bottom-left'
            });

            // Refresh live queue after serving
            if (serviceId && date) {
                getLiveQueue(serviceId, date);
            }

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to serve next token';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getLiveQueue]);







    // Serve specific token by ID
    const serveTokenById = useCallback(async (tokenId, serviceId = null, date = null) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(`/departments/queue/tokens/${tokenId}/serve`);

            toast.success(response.data.message, {
                duration: 3000,
                position: 'bottom-left'
            });

            // Refresh live queue if serviceId and date provided
            if (serviceId && date) {
                getLiveQueue(serviceId, date);
            }

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to serve token';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getLiveQueue]);







    // Complete a token
    const completeToken = useCallback(async (tokenId, serviceId = null, date = null) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(`/departments/queue/tokens/${tokenId}/complete`);

            toast.success(response.data.message, {
                duration: 3000,
                position: 'bottom-left'
            });

            // Refresh live queue if serviceId and date provided
            if (serviceId && date) {
                getLiveQueue(serviceId, date);
            }

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to complete token';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getLiveQueue]);







    // Skip a token
    const skipToken = useCallback(async (tokenId, serviceId = null, date = null) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(`/departments/queue/tokens/${tokenId}/skip`);

            toast.success(response.data.message, {
                duration: 3000,
                position: 'bottom-left'
            });

            // Refresh live queue if serviceId and date provided
            if (serviceId && date) {
                getLiveQueue(serviceId, date);
            }

            return response.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to skip token';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getLiveQueue]);










    // Get queue statistics
    const getQueueStats = useCallback(async (serviceId = null, date = null, departmentId = null) => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (serviceId) params.serviceId = serviceId;
            if (date) params.date = date;
            if (departmentId) params.departmentId = departmentId;

            const response = await axiosInstance.get('/departments/queue/stats', { params });

            setQueueStats(response.data.data);

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch queue statistics';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);









    // Get department services for queue management
    const getDepartmentServicesForQueue = useCallback(async (departmentId = null) => {
        try {
            setLoading(true);
            setError(null);

            const params = departmentId ? { departmentId } : {};

            const response = await axiosInstance.get('/departments/queue/department-services', { params });

            setDepartmentServices(response.data.data.services || []);

            return response.data.data;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch department services';
            setError(errorMsg);
            toast.error(errorMsg, {
                duration: 4000,
                position: 'bottom-left'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);








    // Refresh queue data (convenience function)
    const refreshQueueData = useCallback(async (serviceId, date, departmentId = null) => {
        if (!serviceId || !date) return;

        await getLiveQueue(serviceId, date, departmentId);
        await getQueueStats(serviceId, date, departmentId);
    }, [getLiveQueue, getQueueStats]);

    // Clear all queue data
    const clearQueueData = useCallback(() => {
        setLiveQueue({
            serving: null,
            waiting: [],
            totalWaiting: 0,
        });
        setQueueStats(null);
        setDepartmentServices([]);
        setError(null);
    }, []);

    // Real-time polling for live queue (optional)
    const startQueuePolling = useCallback((serviceId, date, interval = 10000) => {
        if (!serviceId || !date) return null;

        const poll = setInterval(async () => {
            try {
                await getLiveQueue(serviceId, date);
            } catch (error) {
                console.error('Queue polling error:', error);
            }
        }, interval);

        return poll;
    }, [getLiveQueue]);

    const value = {
        liveQueue,
        queueStats,
        departmentServices,
        loading,
        error,
        getLiveQueue,
        recallSkippedTokens,
        serveNextToken,
        serveTokenById,
        completeToken,
        skipToken,
        getQueueStats,
        getDepartmentServicesForQueue,
        refreshQueueData,
        clearQueueData,
        startQueuePolling,
        // Helper functions
        getCurrentServingToken: () => liveQueue.serving,
        getWaitingTokens: () => liveQueue.waiting,
        getTotalWaiting: () => liveQueue.totalWaiting,
        hasActiveQueue: () => liveQueue.serving !== null || liveQueue.totalWaiting > 0,
    };

    return (
        <QueueContext.Provider value={value}>
            {children}
        </QueueContext.Provider>
    );
};