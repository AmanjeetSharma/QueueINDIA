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
    Settings,
    RotateCcw,
    Activity,
    TrendingUp,
    Calendar,
    User,
    UserCheck,
    ChevronRight,
    FileText
} from 'lucide-react';
import { MdGeneratingTokens } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
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
        skipToken,
        recallSkippedTokens
    } = useQueue();

    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');

    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [showIntervalSettings, setShowIntervalSettings] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const pollingRef = useRef(null);
    const [lastRefreshTime, setLastRefreshTime] = useState(null);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const datePickerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Find token served by current officer
    const myServingToken = liveQueue.serving?.find(
        (token) => token.servedBy === user?._id
    );

    useEffect(() => {
        if (serviceId && date) {
            fetchQueueData().then(() => setPageLoaded(true));
        }
        return () => stopPolling();
    }, [serviceId, date]);

    useEffect(() => {
        if (isAutoRefresh && serviceId && date) {
            startPolling();
        } else {
            stopPolling();
        }
        return () => stopPolling();
    }, [isAutoRefresh, refreshInterval, serviceId, date]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChangeService = () => {
        if (user.role === 'SUPER_ADMIN') {
            navigate(`/department/${departmentId}/queue-services/`);
        } else {
            navigate(`/department/queue-services`);
        }
    };

    const fetchQueueData = useCallback(async () => {
        if (!serviceId || !date || !departmentId) return;
        try {
            setIsRefreshing(true);
            await getLiveQueue(serviceId, date, departmentId);
            setLastRefreshTime(new Date());
        } catch (err) {
            console.error('Failed to fetch queue:', err);
        } finally {
            setIsRefreshing(false);
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
            toast.success('Auto-refresh paused', { duration: 1000, position: 'top-center' });
        } else {
            startPolling();
            toast.success(`Auto-refresh (${refreshInterval}s)`, { duration: 1000, position: 'top-center' });
        }
        setIsAutoRefresh(!isAutoRefresh);
    };

    const handleManualRefresh = async () => {
        if (isRefreshing) return;
        try {
            await fetchQueueData();
            toast.success('Queue refreshed', { duration: 1000, position: 'top-center' });
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
            toast.success(`Interval: ${interval}s`, { duration: 1000, position: 'top-center' });
        }
    };

    const handleRecallSkipped = async () => {
        if (!serviceId || !date) {
            toast.error('Missing service or date information');
            return;
        }
        try {
            setActionInProgress('recall');
            const result = await recallSkippedTokens(serviceId, date, departmentId);
            toast.success(`${result.recalledCount || 0} tokens recalled`, {
                duration: 3000,
                position: 'top-center'
            });
            await fetchQueueData();
        } catch (err) {
            toast.error(err.message || 'Failed to recall skipped tokens');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleServeNext = async () => {
        if (!serviceId || !date) return;
        try {
            setActionInProgress('serveNext');
            await serveNextToken(serviceId, date, departmentId);
            await fetchQueueData();
        } catch (err) {
            toast.error(err.message || 'Failed to serve token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleCompleteToken = async () => {
        if (!myServingToken?._id) {
            toast.error('No token is currently being served by you');
            return;
        }
        try {
            setActionInProgress('complete');
            await completeToken(myServingToken._id);
            await fetchQueueData();
        } catch (err) {
            toast.error(err.message || 'Failed to complete token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleSkipToken = async () => {
        if (!myServingToken?._id) {
            toast.error('No token is currently being served by you');
            return;
        }
        try {
            setActionInProgress('skip');
            await skipToken(myServingToken._id);
            await fetchQueueData();
        } catch (err) {
            toast.error(err.message || 'Failed to skip token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate) {
            navigate(`/department/queue-management/${departmentId}/${serviceId}?date=${newDate}`);
            setShowDatePicker(false);
        }
    };

    // Navigate to booking details
    const handleViewBooking = (bookingId, e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (bookingId) {
            navigate(`/department/bookings/${bookingId}`);
        } else {
            toast.error('Booking ID not available');
        }
    };

    const getPriorityColor = (priorityType) => {
        const colors = {
            'SENIOR_CITIZEN': { bg: 'bg-blue-100', text: 'text-blue-700', light: 'bg-blue-500/20', border: 'border-blue-400/30' },
            'PREGNANT_WOMEN': { bg: 'bg-pink-100', text: 'text-pink-700', light: 'bg-pink-500/20', border: 'border-pink-400/30' },
            'DIFFERENTLY_ABLED': { bg: 'bg-green-100', text: 'text-green-700', light: 'bg-green-500/20', border: 'border-green-400/30' },
            'NONE': { bg: 'bg-gray-100', text: 'text-gray-700', light: 'bg-gray-500/20', border: 'border-gray-400/30' }
        };
        return colors[priorityType] || colors['NONE'];
    };

    const getPriorityLabel = (priorityType) => {
        const labels = {
            'SENIOR_CITIZEN': 'Senior',
            'PREGNANT_WOMEN': 'Pregnant',
            'DIFFERENTLY_ABLED': 'Disabled',
            'NONE': 'Regular'
        };
        return labels[priorityType] || 'Regular';
    };

    const formatLastRefreshTime = () => {
        if (!lastRefreshTime) return 'Never';

        const diffInSeconds = Math.floor((currentTime - lastRefreshTime.getTime()) / 1000);

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
        { value: 10, label: '10s' },
        { value: 30, label: '30s' },
        { value: 60, label: '1m' },
        { value: 120, label: '2m' }
    ];

    if (!serviceId || !date) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Missing Parameters</h3>
                    <p className="text-gray-300 mb-6">Select service and date from queue management.</p>
                    <button
                        onClick={() => navigate("/department/queue-services")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/95 backdrop-blur-lg">
                <div className="px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/department/queue-services")}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                    Queue Management
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Header Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing || actionInProgress}
                                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={handleToggleAutoRefresh}
                                disabled={actionInProgress || isRefreshing}
                                className={`p-2 rounded-lg transition-colors ${isAutoRefresh ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'
                                    }`}
                                title={isAutoRefresh ? 'Pause Auto-refresh' : 'Start Auto-refresh'}
                            >
                                {isAutoRefresh ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowIntervalSettings(!showIntervalSettings)}
                                    disabled={actionInProgress || isRefreshing}
                                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                                    title="Refresh Interval"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {showIntervalSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20"
                                        >
                                            <div className="p-2">
                                                <h3 className="text-xs text-slate-400 mb-2 px-1">Interval</h3>
                                                <div className="space-y-1">
                                                    {intervalOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => handleIntervalChange(option.value)}
                                                            className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${refreshInterval === option.value
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-slate-300 hover:bg-slate-700'
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Auto-refresh Status */}
                    {isAutoRefresh && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Auto-refresh ({refreshInterval}s)</span>
                            <span className="text-slate-500 ml-auto">Last: {formatLastRefreshTime()}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Queue Display */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Currently Serving */}
                        <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-blue-500/10 px-4 py-3 border-b border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        Currently Serving
                                    </h2>
                                    <span className="text-sm text-slate-400">
                                        {liveQueue.serving?.length || 0} active
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                {liveQueue.serving?.length > 0 ? (
                                    <div className="space-y-3">
                                        {liveQueue.serving.map((token) => {
                                            const isMine = token.servedBy === user?._id;
                                            const priority = getPriorityColor(token.priorityType);

                                            return (
                                                <div
                                                    key={token._id}
                                                    className={`relative rounded-lg border ${isMine
                                                        ? 'border-blue-400/50 bg-blue-500/10'
                                                        : 'border-slate-600/30 bg-slate-700/20'
                                                        }`}
                                                >
                                                    <div className="p-3">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                            {/* Left Section - Token and Priority */}
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-xl font-bold ${isMine ? 'text-blue-300' : 'text-slate-300'
                                                                    }`}>
                                                                    {token.tokenNumber}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                    {getPriorityLabel(token.priorityType)}
                                                                </span>
                                                            </div>

                                                            {/* Right Section - Officer and Time */}
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    {isMine ? (
                                                                        <>
                                                                            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                                                                            <span className="text-xs text-blue-400 font-medium">You</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <User className="w-3.5 h-3.5 text-slate-500" />
                                                                            <span className="text-xs text-slate-400">
                                                                                {token.servedByName || 'Officer'}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {token.slotTime && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                        <span className="text-xs text-slate-400">{token.slotTime}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Customer Name */}
                                                        {token.userName && (
                                                            <p className="text-xs text-slate-400 mt-2">
                                                                {token.userName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-14 h-14 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="w-7 h-7 text-slate-600" />
                                        </div>
                                        <p className="text-sm text-slate-400">No active tokens</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Waiting Queue */}
                        <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-purple-500/10 px-4 py-3 border-b border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        Waiting Queue
                                    </h2>
                                    <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs font-bold">
                                        {liveQueue.totalWaiting || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                {liveQueue.waiting?.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm text-slate-400">Queue is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                        {liveQueue.waiting?.map((token, index) => (
                                            <div
                                                key={token._id}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${index === 0
                                                    ? 'bg-purple-500/10 border-purple-400/20'
                                                    : 'bg-slate-700/20 border-slate-600/30'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    {/* Position Number */}
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${index === 0 ? 'bg-purple-600 text-white' : 'bg-slate-600 text-slate-300'
                                                        }`}>
                                                        {index + 1}
                                                    </div>

                                                    {/* Token Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-sm">
                                                                {token.tokenNumber}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${getPriorityColor(token.priorityType).bg} ${getPriorityColor(token.priorityType).text}`}>
                                                                {getPriorityLabel(token.priorityType)}
                                                            </span>
                                                        </div>

                                                        {/* Customer Name and Time */}
                                                        <div className="flex items-center gap-2 text-xs">
                                                            {token.userName && (
                                                                <span className="text-slate-400 truncate">
                                                                    {token.userName}
                                                                </span>
                                                            )}
                                                            {token.slotTime && (
                                                                <div className="flex items-center gap-1 text-slate-500">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span className="text-xs">{token.slotTime}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Arrow Button */}
                                                {token.booking && (
                                                    <button
                                                        onClick={(e) => handleViewBooking(token.booking, e)}
                                                        className="flex-shrink-0 p-2 bg-slate-700/50 hover:bg-purple-600/20 rounded-lg transition-colors group ml-2 cursor-pointer"
                                                        title="View Booking Details"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-slate-100 group-hover:text-purple-400" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Controls */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Serve Token Button */}
                        {!myServingToken && (
                            <button
                                onClick={handleServeNext}
                                disabled={actionInProgress || isRefreshing || liveQueue.waiting?.length === 0}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                            >
                                {actionInProgress === 'serveNext' ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span className="text-base">Serving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        <span className="text-base">Serve Token</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Your Actions */}
                        {myServingToken && (
                            <div className="bg-slate-800/90 border border-blue-500/30 rounded-xl overflow-hidden">
                                <div className="bg-blue-500/20 px-4 py-3 border-b border-blue-500/30">
                                    <h2 className="font-semibold flex items-center gap-2 text-blue-300">
                                        <MdGeneratingTokens className="w-6 h-6 text-amber-300" />
                                        Your Token Actions
                                    </h2>
                                </div>

                                <div className="p-4">
                                    {/* Your Current Token Summary */}
                                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl font-bold text-blue-300">
                                                    {myServingToken.tokenNumber}
                                                </div>
                                                <div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(myServingToken.priorityType).bg} ${getPriorityColor(myServingToken.priorityType).text}`}>
                                                        {getPriorityLabel(myServingToken.priorityType)}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Arrow Button */}
                                            {myServingToken.booking && (
                                                <button
                                                    onClick={(e) => handleViewBooking(myServingToken.booking, e)}
                                                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors cursor-pointer"
                                                    title="View Booking"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                                </button>
                                            )}
                                        </div>

                                        {myServingToken.userName && (
                                            <p className="text-sm text-slate-300 mt-2">
                                                {myServingToken.userName}
                                            </p>
                                        )}

                                        {myServingToken.slotTime && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{myServingToken.slotTime}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleCompleteToken}
                                            disabled={actionInProgress}
                                            className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Complete</span>
                                        </button>

                                        <button
                                            onClick={handleSkipToken}
                                            disabled={actionInProgress}
                                            className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                        >
                                            <SkipForward className="w-4 h-4" />
                                            <span>Skip</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Card */}
                        <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-cyan-500/10 px-4 py-3 border-b border-slate-700">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    Queue Stats
                                </h2>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3">
                                        <p className="text-xs text-green-400 mb-1">Serving</p>
                                        <p className="text-2xl font-bold text-green-300">
                                            {liveQueue.serving?.length || 0}
                                        </p>
                                        {myServingToken && (
                                            <p className="text-xs text-green-400 mt-1">
                                                (You: 1)
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
                                        <p className="text-xs text-blue-400 mb-1">Waiting</p>
                                        <p className="text-2xl font-bold text-blue-300">
                                            {liveQueue.totalWaiting || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Last synced: {formatLastRefreshTime()}</span>
                                    </div>
                                    <button
                                        onClick={handleRecallSkipped}
                                        disabled={actionInProgress}
                                        className="flex items-center gap-1 px-4 py-1.5 bg-amber-600/40 hover:bg-amber-600/20 rounded text-yellow-500 transition-colors disabled:opacity-50 cursor-pointer"
                                        title="Recall Skipped Tokens"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span className="hidden sm:inline">Recall Skipped Tokens</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-indigo-500/10 px-4 py-3 border-b border-slate-700">
                                <h2 className="font-semibold">Quick Actions</h2>
                            </div>

                            <div className="p-4 space-y-2">
                                <button
                                    onClick={handleChangeService}
                                    disabled={actionInProgress || isRefreshing}
                                    className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-between"
                                >
                                    <span>Change Service</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>

                                <div className="relative" ref={datePickerRef}>
                                    <button
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        disabled={actionInProgress || isRefreshing}
                                        className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Change Date</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </button>

                                    {showDatePicker && (
                                        <div
                                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                                            onClick={() => setShowDatePicker(false)}
                                        >
                                            <div
                                                className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 w-full max-w-[320px]"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <h3 className="text-white font-medium mb-3">Select Date</h3>
                                                <input
                                                    type="date"
                                                    defaultValue={date}
                                                    onChange={handleDateChange}
                                                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    style={{ colorScheme: 'dark' }}
                                                />
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => setShowDatePicker(false)}
                                                        className="px-3 py-1.5 text-sm text-slate-300 hover:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-red-300 font-medium">{error}</p>
                                        <button
                                            onClick={fetchQueueData}
                                            disabled={actionInProgress || isRefreshing}
                                            className="mt-2 text-xs bg-red-500/30 hover:bg-red-500/50 text-red-200 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Action Loader Overlay */}
            <AnimatePresence>
                {actionInProgress && actionInProgress !== 'serveNext' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl flex items-center gap-3">
                            <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                            <span className="text-sm font-medium text-slate-200">
                                {actionInProgress === 'recall' ? 'Recalling tokens...' :
                                    actionInProgress === 'complete' ? 'Completing...' :
                                        actionInProgress === 'skip' ? 'Skipping...' : 'Processing...'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Initial Loading State */}
            <AnimatePresence>
                {loading && !pageLoaded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4"
                    >
                        <div className="text-center">
                            <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
                            <p className="text-sm text-slate-300 font-medium">Loading queue data...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QueueManagement;