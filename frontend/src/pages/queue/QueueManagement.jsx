import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import {
    Play,
    CheckCircle,
    SkipForward,
    RefreshCw,
    Users,
    Clock,
    AlertCircle,
    Pause,
    ArrowLeft,
    Loader,
    ChevronRight,
    Settings,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const QueueManagement = () => {
    const { departmentId, serviceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        liveQueue,
        loading,
        error,
        getLiveQueue,
        serveNextToken,
        completeToken,
        skipToken
    } = useQueue();

    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');

    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [showIntervalSettings, setShowIntervalSettings] = useState(false);
    const [showWaitingQueue, setShowWaitingQueue] = useState(true);
    const pollingRef = useRef(null);
    const [lastRefreshTime, setLastRefreshTime] = useState(null);
    const [actionInProgress, setActionInProgress] = useState(false);

    // Fetch queue data when component mounts
    useEffect(() => {
        if (serviceId && date) {
            fetchQueueData();
        }

        return () => {
            stopPolling();
        };
    }, [serviceId, date]);

    // Handle auto-refresh polling
    useEffect(() => {
        if (isAutoRefresh && serviceId && date) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [isAutoRefresh, refreshInterval, serviceId, date]);

    const fetchQueueData = useCallback(async () => {
        if (!serviceId || !date || !departmentId) return;

        try {
            await getLiveQueue(serviceId, date, departmentId);
            setLastRefreshTime(new Date());
        } catch (err) {
            console.error('Failed to fetch queue:', err);
        }
    }, [serviceId, date, departmentId, getLiveQueue]);

    const startPolling = useCallback(() => {
        stopPolling();
        pollingRef.current = setInterval(fetchQueueData, refreshInterval * 1000);
    }, [refreshInterval, fetchQueueData]);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    const handleToggleAutoRefresh = () => {
        if (isAutoRefresh) {
            stopPolling();
            toast.success('Auto-refresh paused', { duration: 1500, position: 'top-left' });
        } else {
            startPolling();
            toast.success(`Auto-refresh enabled (${refreshInterval}s)`, { duration: 1500, position: 'top-left' });
        }
        setIsAutoRefresh(!isAutoRefresh);
    };

    const handleManualRefresh = async () => {
        try {
            await fetchQueueData();
            toast.success('Queue refreshed', { duration: 1500 , position: 'top-left' });
        } catch (error) {
            toast.error('Failed to refresh queue');
        }
    };

    const handleIntervalChange = (interval) => {
        setRefreshInterval(interval);
        setShowIntervalSettings(false);

        if (isAutoRefresh) {
            stopPolling();
            setTimeout(() => startPolling(), 100);
            toast.success(`Refresh interval updated to ${interval}s`, { duration: 1500, position: 'top-left' });
        }
    };

    const handleServeNext = async () => {
        if (!serviceId || !date) return;

        try {
            setActionInProgress('serveNext');
            await serveNextToken(serviceId, date);
            await fetchQueueData();
        } catch (err) {
            toast.error(err.message || 'Failed to serve next token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleCompleteToken = async () => {
        if (!liveQueue.serving?._id) {
            toast.error('No token is currently being served');
            return;
        }

        try {
            setActionInProgress('complete');
            await completeToken(liveQueue.serving._id);
            await fetchQueueData();
            toast.success('Token completed');
        } catch (err) {
            toast.error(err.message || 'Failed to complete token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleSkipToken = async () => {
        if (!liveQueue.serving?._id) {
            toast.error('No token is currently being served');
            return;
        }

        try {
            setActionInProgress('skip');
            await skipToken(liveQueue.serving._id);
            await fetchQueueData();
            toast.success('Token skipped');
        } catch (err) {
            toast.error(err.message || 'Failed to skip token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleCompleteWaiting = async (tokenId) => {
        try {
            setActionInProgress('complete-' + tokenId);
            await completeToken(tokenId);
            await fetchQueueData();
            toast.success('Token completed');
        } catch (err) {
            toast.error(err.message || 'Failed to complete token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleSkipWaiting = async (tokenId) => {
        try {
            setActionInProgress('skip-' + tokenId);
            await skipToken(tokenId);
            await fetchQueueData();
            toast.success('Token skipped');
        } catch (err) {
            toast.error(err.message || 'Failed to skip token');
        } finally {
            setActionInProgress(null);
        }
    };

    const getPriorityColor = (priorityType) => {
        const colors = {
            'PRIORITY': 'bg-purple-100 text-purple-800',
            'VIP': 'bg-yellow-100 text-yellow-800',
            'SENIOR_CITIZEN': 'bg-blue-100 text-blue-800',
            'DISABLED': 'bg-green-100 text-green-800',
            'NORMAL': 'bg-gray-100 text-gray-800'
        };
        return colors[priorityType] || colors['NORMAL'];
    };

    const formatLastRefreshTime = () => {
        if (!lastRefreshTime) return 'Never';

        const now = new Date();
        const diffInSeconds = Math.floor((now - lastRefreshTime) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else {
            return lastRefreshTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const intervalOptions = [
        { value: 10, label: '10 seconds' },
        { value: 30, label: '30 seconds' },
        { value: 60, label: '1 minute' },
        { value: 120, label: '2 minutes' }
    ];

    if (!serviceId || !date) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Missing Parameters</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Please select a service and date from the queue management page.
                    </p>
                    <button
                        onClick={() => navigate('/officer-panel/queue-services')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Go Back to Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Action Loader Overlay */}
            {actionInProgress && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {actionInProgress.startsWith('complete') ? 'Completing...' :
                                actionInProgress.startsWith('skip') ? 'Skipping...' : 'Serving...'}
                        </span>
                    </div>
                </div>
            )}

            {/* Header - Mobile Optimized */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-3 py-3 sm:px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/officer-panel/queue-services')}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-gray-900 truncate">Queue Management</h1>
                                <p className="text-gray-600 text-xs truncate">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Refresh Controls - Compact */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualRefresh}
                                disabled={loading}
                                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                title="Refresh Queue"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={handleToggleAutoRefresh}
                                className={`p-1.5 rounded-lg text-sm transition-colors ${isAutoRefresh
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                title={isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                            >
                                {isAutoRefresh ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Interval Settings - Mobile Optimized */}
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-xs font-medium text-gray-700">
                                Auto-refresh {isAutoRefresh ? 'ON' : 'OFF'}
                            </span>
                            {isAutoRefresh && (
                                <span className="text-xs text-gray-500">({refreshInterval}s)</span>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowIntervalSettings(!showIntervalSettings)}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                                <Settings className="w-3 h-3" />
                                Interval
                            </button>

                            {showIntervalSettings && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowIntervalSettings(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                        <div className="p-2">
                                            <h3 className="text-xs font-medium text-gray-900 mb-1">Refresh Interval</h3>
                                            {intervalOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleIntervalChange(option.value)}
                                                    className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${refreshInterval === option.value
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Mobile First */}
            <div className="p-3 sm:p-4 max-w-7xl mx-auto">
                {/* Auto-refresh Status Bar */}
                {isAutoRefresh && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-blue-800">
                                    Auto-refresh active ({refreshInterval}s)
                                </span>
                            </div>
                            <button
                                onClick={handleToggleAutoRefresh}
                                className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                            >
                                Turn Off
                            </button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !liveQueue.serving && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm text-red-700 truncate">{error}</p>
                            </div>
                            <button
                                onClick={fetchQueueData}
                                className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 flex-shrink-0"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Queue Content - Single Column on Mobile */}
                <div className="space-y-4">
                    {/* Currently Serving Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                            <h2 className="font-semibold text-gray-900">Currently Serving</h2>
                        </div>

                        <div className="p-4">
                            {liveQueue.serving ? (
                                <div className="space-y-4">
                                    {/* Token Display */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-blue-700 mb-2">
                                                {liveQueue.serving.tokenNumber}
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(liveQueue.serving.priorityType)}`}>
                                                    {liveQueue.serving.priorityType}
                                                </span>
                                                {liveQueue.serving.priorityRank > 0 && (
                                                    <span className="text-xs text-gray-600">
                                                        Rank: {liveQueue.serving.priorityRank}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <button
                                                onClick={handleCompleteToken}
                                                disabled={!!actionInProgress}
                                                className="flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Complete
                                            </button>

                                            <button
                                                onClick={handleSkipToken}
                                                disabled={!!actionInProgress}
                                                className="flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                                            >
                                                <SkipForward className="w-4 h-4" />
                                                Skip
                                            </button>
                                        </div>
                                    </div>

                                    {/* Serve Next Button */}
                                    <button
                                        onClick={handleServeNext}
                                        disabled={!!actionInProgress}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-colors text-sm font-medium"
                                    >
                                        <Play className="w-4 h-4" />
                                        Serve Next Token
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">No Active Token</h3>
                                    <p className="text-gray-600 text-sm mb-4">No token is currently being served</p>
                                    <button
                                        onClick={handleServeNext}
                                        disabled={!!actionInProgress}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        Start Serving
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Card - Compact */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Queue Stats</h2>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatLastRefreshTime()}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <p className="text-xs text-green-700 mb-1">Serving</p>
                                    <p className="text-xl font-bold text-green-900">
                                        {liveQueue.serving ? '1' : '0'}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <p className="text-xs text-blue-700 mb-1">Waiting</p>
                                    <p className="text-xl font-bold text-blue-900">
                                        {liveQueue.totalWaiting || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="space-y-2">
                                    <button
                                        onClick={() => navigate('/officer-panel/queue-services')}
                                        className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                    >
                                        <span>Change Service</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newDate = prompt('Enter new date (YYYY-MM-DD):', date);
                                            if (newDate) {
                                                navigate(`/officer-panel/queue-management/${departmentId}/${serviceId}?date=${newDate}`);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                    >
                                        <span>Change Date</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Waiting Queue Card - Collapsible */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            onClick={() => setShowWaitingQueue(!showWaitingQueue)}
                            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <h2 className="font-semibold text-gray-900">Waiting Queue</h2>
                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                    {liveQueue.totalWaiting || 0}
                                </span>
                            </div>
                            {showWaitingQueue ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>

                        {showWaitingQueue && (
                            <div className="p-4">
                                {liveQueue.waiting?.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="text-gray-600 text-sm">Queue is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {liveQueue.waiting?.map((token, index) => (
                                            <div
                                                key={token._id}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${index === 0
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-gray-50 border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        <span className="font-bold text-sm">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1 mb-0.5">
                                                            <span className="font-bold text-gray-900">
                                                                {token.tokenNumber}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(token.priorityType)}`}>
                                                                {token.priorityType}
                                                            </span>
                                                        </div>
                                                        {token.priorityRank > 0 && (
                                                            <p className="text-xs text-gray-500">
                                                                Rank: {token.priorityRank}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    {index === 0 && (
                                                        <button
                                                            onClick={() => handleCompleteWaiting(token._id)}
                                                            disabled={!!actionInProgress}
                                                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleSkipWaiting(token._id)}
                                                        disabled={!!actionInProgress}
                                                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
                                                    >
                                                        Skip
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State for Initial Load */}
                {loading && !liveQueue.serving && (
                    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                        <div className="text-center">
                            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                            <p className="text-gray-600 text-sm">Loading queue data...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueueManagement;