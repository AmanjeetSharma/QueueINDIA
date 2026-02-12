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
    Zap,
    Calendar
} from 'lucide-react';
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
            // Silently handle error
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
            toast.success('Token completed', { duration: 1000, position: 'top-center' });
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
        } catch (err) {
            toast.error(err.message || 'Failed to skip token');
        } finally {
            setActionInProgress(null);
        }
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate) {
            navigate(`/officer-panel/queue-management/${departmentId}/${serviceId}?date=${newDate}`);
            setShowDatePicker(false);
        }
    };

    const getPriorityColor = (priorityType) => {
        const colors = {
            'SENIOR_CITIZEN': { bg: 'bg-blue-100', text: 'text-blue-700' },
            'PREGNANT_WOMEN': { bg: 'bg-pink-100', text: 'text-pink-700' },
            'DIFFERENTLY_ABLED': { bg: 'bg-green-100', text: 'text-green-700' },
            'NONE': { bg: 'bg-gray-100', text: 'text-gray-700' }
        };
        return colors[priorityType] || colors['NONE'];
    };

    const getPriorityLabel = (priorityType) => {
        const labels = {
            'SENIOR_CITIZEN': 'Senior Citizen',
            'PREGNANT_WOMEN': 'Pregnant Women',
            'DIFFERENTLY_ABLED': 'Differently Abled',
            'NONE': 'Normal'
        };
        return labels[priorityType] || 'Normal';
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
            {/* Header - Compact */}
            <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/90 backdrop-blur-lg">
                <div className="px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/department/queue-services")}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl font-bold truncate text-white">
                                    Queue Management
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-400 truncate">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing || actionInProgress}
                                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={handleToggleAutoRefresh}
                                disabled={actionInProgress || isRefreshing}
                                className={`p-2 rounded-lg transition-colors ${isAutoRefresh
                                    ? 'bg-green-600'
                                    : 'bg-slate-700 hover:bg-slate-600'
                                    }`}
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
                                                <h3 className="text-xs text-slate-400 mb-2 px-1">Refresh Interval</h3>
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

                    {/* Auto-refresh Status - Compact */}
                    {isAutoRefresh && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Auto-refresh ({refreshInterval}s)</span>
                            <span className="text-slate-500 ml-auto">Last: {formatLastRefreshTime()}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content - Responsive Grid */}
            <main className="p-3 sm:p-4 md:p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Left Column - Queue Display */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Currently Serving - Compact */}
                        <div className="bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="bg-blue-500/10 px-4 py-3 border-b border-slate-700">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    Currently Serving
                                </h2>
                            </div>

                            <div className="p-4 md:p-6">
                                {liveQueue.serving ? (
                                    <div className="space-y-4">
                                        <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 md:p-6 text-center">
                                            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-300 mb-3">
                                                {liveQueue.serving.tokenNumber}
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(liveQueue.serving.priorityType).bg
                                                    } ${getPriorityColor(liveQueue.serving.priorityType).text}`}>
                                                    {getPriorityLabel(liveQueue.serving.priorityType)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons - Stack on mobile */}
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                            <button
                                                onClick={handleCompleteToken}
                                                disabled={actionInProgress}
                                                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="hidden sm:inline">Complete</span>
                                            </button>

                                            <button
                                                onClick={handleSkipToken}
                                                disabled={actionInProgress}
                                                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
                                            >
                                                <SkipForward className="w-4 h-4" />
                                                <span className="hidden sm:inline">Skip</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleServeNext}
                                            disabled={actionInProgress || isRefreshing}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 rounded-lg font-bold transition-colors"
                                        >
                                            <Play className="w-5 h-5" />
                                            Serve Next Token
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 md:py-8">
                                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-slate-200 mb-2">No Active Token</h3>
                                        <p className="text-slate-400 mb-4">Start serving the next token</p>
                                        <button
                                            onClick={handleServeNext}
                                            disabled={actionInProgress || isRefreshing}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
                                        >
                                            Start Serving
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Waiting Queue - Compact */}
                        {/* Waiting Queue - Compact */}
                        <div className="bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="bg-purple-500/10 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    Waiting Queue
                                </h2>
                                <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded-full text-sm font-bold">
                                    {liveQueue.totalWaiting || 0}
                                </span>
                            </div>

                            <div className="p-4">
                                {liveQueue.waiting?.length === 0 ? (
                                    <div className="text-center py-6">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-slate-400">Queue is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[300px] md:max-h-[400px] overflow-y-auto">
                                        {liveQueue.waiting?.map((token, index) => (
                                            <div
                                                key={token._id}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${index === 0
                                                    ? 'bg-purple-500/10 border-purple-400/20'
                                                    : 'bg-slate-700/30 border-slate-600/30'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-slate-600 text-slate-300'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                            <span className="font-bold">
                                                                {token.tokenNumber}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${getPriorityColor(token.priorityType).bg
                                                                } ${getPriorityColor(token.priorityType).text}`}>
                                                                {getPriorityLabel(token.priorityType)}
                                                            </span>
                                                        </div>

                                                        {/* Customer Name */}
                                                        <p className="text-xs text-slate-300 font-medium truncate">
                                                            {token.userName || 'Customer'}
                                                        </p>

                                                        {/* Slot Time */}
                                                        {token.slotTime && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <Clock className="w-3 h-3 text-slate-500" />
                                                                <span className="text-xs text-slate-400">
                                                                    {token.slotTime}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Right Column - Stats & Controls */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Stats - Compact */}
                        {/* Recall Skipped Button - Now visible */}
                        <button
                            onClick={handleRecallSkipped}
                            disabled={actionInProgress}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Recall Skipped Tokens
                        </button>
                        <div className="bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="bg-cyan-500/10 px-4 py-3 border-b border-slate-700">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    Queue Stats
                                </h2>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3">
                                    <p className="text-xs text-green-400 mb-1">Serving</p>
                                    <p className="text-2xl font-bold text-green-300">
                                        {liveQueue.serving ? '1' : '0'}
                                    </p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
                                    <p className="text-xs text-blue-400 mb-1">Waiting</p>
                                    <p className="text-2xl font-bold text-blue-300">
                                        {liveQueue.totalWaiting || 0}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700">
                                    <Clock className="w-3 h-3" />
                                    <span>Last sync: {formatLastRefreshTime()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Compact */}
                        <div className="bg-slate-800 border border-slate-700 rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="bg-indigo-500/10 px-4 py-3 border-b border-slate-700">
                                <h2 className="font-semibold">Quick Actions</h2>
                            </div>

                            <div className="p-4 space-y-2">
                                <button
                                    onClick={() => navigate('/officer-panel/queue-services')}
                                    disabled={actionInProgress || isRefreshing}
                                    className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-between"
                                >
                                    <span>Change Service</span>
                                    <span className="text-slate-400">→</span>
                                </button>

                                <div className="relative" ref={datePickerRef}>
                                    <button
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        disabled={actionInProgress || isRefreshing}
                                        className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>Change Date</span>
                                        </div>
                                        <span className="text-slate-400">→</span>
                                    </button>

                                    {showDatePicker && (
                                        <div className="absolute z-20 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3">
                                            <input
                                                type="date"
                                                defaultValue={date}
                                                onChange={handleDateChange}
                                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Error Alert */}
                        {error && !liveQueue.serving && (
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
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl flex items-center gap-3">
                            <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                            <span className="font-medium text-slate-200">
                                {actionInProgress === 'recall' ? 'Recalling tokens...' :
                                    actionInProgress === 'complete' ? 'Completing...' :
                                        actionInProgress === 'skip' ? 'Skipping...' : 'Processing...'}
                            </span>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Initial Loading State */}
            <AnimatePresence>
                {loading && !pageLoaded && (
                    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
                        <div className="text-center">
                            <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
                            <p className="text-slate-300 font-medium">Loading queue data...</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QueueManagement;