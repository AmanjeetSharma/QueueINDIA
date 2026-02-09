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
    MoreVertical,
    Activity,
    TrendingUp,
    Zap
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
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const pollingRef = useRef(null);
    const [lastRefreshTime, setLastRefreshTime] = useState(null);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

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
            toast.success('Auto-refresh paused', { duration: 1500, position: 'top-left' });
        } else {
            startPolling();
            toast.success(`Auto-refresh enabled (${refreshInterval}s)`, { duration: 1500, position: 'top-left' });
        }
        setIsAutoRefresh(!isAutoRefresh);
    };

    const handleManualRefresh = async () => {
        if (isRefreshing) return;
        try {
            await fetchQueueData();
            toast.success('Queue refreshed', { duration: 1500, position: 'top-left' });
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

    const handleRecallSkipped = async () => {
        if (!serviceId || !date) {
            toast.error('Missing service or date information');
            return;
        }
        const confirmed = window.confirm('Recall all skipped tokens back to waiting queue?');
        if (!confirmed) return;
        try {
            setActionInProgress('recall');
            const result = await recallSkippedTokens(serviceId, date, departmentId);
            toast.success(`${result.recalledCount || 0} tokens recalled`, { duration: 6000, position: 'top-left' });
            setShowActionsMenu(false);
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
            await serveNextToken(serviceId, date);
            await fetchQueueData();
        } catch (err) {
            // toast.error(err.message || 'Failed to serve token');
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
            toast.success('Token completed successfully', { duration: 2000, position: 'top-left' });
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

    const getPriorityColor = (priorityType) => {
        const colors = {
            'SENIOR_CITIZEN': { bg: 'bg-blue-100/80', text: 'text-blue-700', badge: 'bg-blue-500' },
            'PREGNANT_WOMEN': { bg: 'bg-pink-100/80', text: 'text-pink-700', badge: 'bg-pink-500' },
            'DIFFERENTLY_ABLED': { bg: 'bg-green-100/80', text: 'text-green-700', badge: 'bg-green-500' },
            'NONE': { bg: 'bg-gray-100/80', text: 'text-gray-700', badge: 'bg-gray-500' }
        };
        return colors[priorityType] || colors['NONE'];
    };

    const getPriorityLabel = (priorityType) => {
        const labels = {
            'SENIOR_CITIZEN': 'Senior Citizen',
            'PREGNANT_WOMEN': 'Pregnant',
            'DIFFERENTLY_ABLED': 'Disabled',
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
        { value: 10, label: '10 seconds' },
        { value: 30, label: '30 seconds' },
        { value: 60, label: '1 minute' },
        { value: 120, label: '2 minutes' }
    ];

    if (!serviceId || !date) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center max-w-md"
                >
                    <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">Missing Parameters</h3>
                    <p className="text-gray-300 mb-6">Please select a service and date from the queue management page.</p>
                    <button
                        onClick={() => navigate('/officer-panel/queue-services')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                        Go Back to Services
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate={pageLoaded ? "visible" : "hidden"}
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
        >
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <motion.header
                variants={itemVariants}
                className="relative z-40 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl sticky top-0"
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/officer-panel/queue-services')}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </motion.button>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Queue Management
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Header Controls */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleManualRefresh}
                                disabled={isRefreshing || !!actionInProgress}
                                className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all"
                            >
                                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleAutoRefresh}
                                disabled={!!actionInProgress || isRefreshing}
                                className={`p-2.5 rounded-lg transition-all ${
                                    isAutoRefresh
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : 'bg-slate-700 hover:bg-slate-600'
                                }`}
                            >
                                {isAutoRefresh ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5" />
                                )}
                            </motion.button>

                            {/* Interval Settings */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowIntervalSettings(!showIntervalSettings)}
                                    disabled={!!actionInProgress || isRefreshing}
                                    className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Settings className="w-5 h-5" />
                                </motion.button>

                                <AnimatePresence>
                                    {showIntervalSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden"
                                        >
                                            <div className="p-3">
                                                <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                                                    Refresh Interval
                                                </h3>
                                                <div className="space-y-1">
                                                    {intervalOptions.map((option) => (
                                                        <motion.button
                                                            key={option.value}
                                                            whileHover={{ x: 4 }}
                                                            onClick={() => handleIntervalChange(option.value)}
                                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                                                                refreshInterval === option.value
                                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                                    : 'text-slate-300 hover:bg-slate-700/50'
                                                            }`}
                                                        >
                                                            {option.label}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Actions Menu */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </motion.button>

                                <AnimatePresence>
                                    {showActionsMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden"
                                        >
                                            <motion.button
                                                whileHover={{ x: 4 }}
                                                onClick={handleRecallSkipped}
                                                disabled={!!actionInProgress}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 transition-colors disabled:opacity-50 border-b border-slate-700"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                <span className="text-sm">Recall Skipped Tokens</span>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Auto-refresh Status */}
                    {isAutoRefresh && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-3 text-sm text-slate-300"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-green-500"
                            />
                            <span>Auto-refresh active ({refreshInterval}s)</span>
                            <span className="text-slate-500 ml-auto">Last sync: {formatLastRefreshTime()}</span>
                        </motion.div>
                    )}
                </div>
            </motion.header>

            {/* Main Content - Split Layout */}
            <div className="relative z-30 px-6 py-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Queue Display (2/3 width) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Currently Serving Card */}
                        <motion.div
                            layout
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-4 border-b border-slate-700">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-cyan-400" />
                                    Currently Serving
                                </h2>
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {liveQueue.serving ? (
                                        <motion.div
                                            key="serving"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-4"
                                        >
                                            {/* Token Number Display */}
                                            <motion.div
                                                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-8 text-center"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 100 }}
                                                    className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"
                                                >
                                                    {liveQueue.serving.tokenNumber}
                                                </motion.div>

                                                <div className="flex flex-wrap items-center justify-center gap-3">
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                            getPriorityColor(liveQueue.serving.priorityType).bg
                                                        } ${getPriorityColor(liveQueue.serving.priorityType).text}`}
                                                    >
                                                        {getPriorityLabel(liveQueue.serving.priorityType)}
                                                    </motion.span>
                                                    {liveQueue.serving.priorityRank > 0 && (
                                                        <motion.span
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="text-xs text-slate-400"
                                                        >
                                                            Priority Rank: {liveQueue.serving.priorityRank}
                                                        </motion.span>
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleCompleteToken}
                                                    disabled={!!actionInProgress}
                                                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    Complete
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleSkipToken}
                                                    disabled={!!actionInProgress}
                                                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    <SkipForward className="w-5 h-5" />
                                                    Skip
                                                </motion.button>
                                            </div>

                                            {/* Serve Next Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleServeNext}
                                                disabled={!!actionInProgress || isRefreshing}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 disabled:opacity-50 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl"
                                            >
                                                <Play className="w-6 h-6" />
                                                Serve Next Token
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="no-token"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-12"
                                        >
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <Users className="w-12 h-12 text-slate-500" />
                                            </motion.div>
                                            <h3 className="text-2xl font-semibold text-slate-200 mb-2">No Active Token</h3>
                                            <p className="text-slate-400 mb-6">Start serving the next token</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleServeNext}
                                                disabled={!!actionInProgress || isRefreshing}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 rounded-xl font-semibold transition-all"
                                            >
                                                Start Serving
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Waiting Queue Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                    Waiting Queue
                                </h2>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm font-bold"
                                >
                                    {liveQueue.totalWaiting || 0}
                                </motion.span>
                            </div>

                            <div className="p-6">
                                <AnimatePresence>
                                    {liveQueue.waiting?.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-12"
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                                            </motion.div>
                                            <p className="text-slate-400 text-lg">Queue is empty</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
                                            layout
                                        >
                                            {liveQueue.waiting?.map((token, index) => (
                                                <motion.div
                                                    key={token._id}
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                                        index === 0
                                                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30'
                                                            : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                                                index === 0
                                                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                                                    : 'bg-slate-600 text-slate-300'
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-lg font-bold text-white">
                                                                    {token.tokenNumber}
                                                                </span>
                                                                <span
                                                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                                        getPriorityColor(token.priorityType).bg
                                                                    } ${getPriorityColor(token.priorityType).text}`}
                                                                >
                                                                    {getPriorityLabel(token.priorityType)}
                                                                </span>
                                                            </div>
                                                            {token.priorityRank > 0 && (
                                                                <p className="text-xs text-slate-400">
                                                                    Rank: {token.priorityRank}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="text-xs text-slate-500"
                                                    >
                                                        #{index + 1}
                                                    </motion.div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Stats & Controls (1/3 width) */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* Quick Stats */}
                        <motion.div
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-4 border-b border-slate-700">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    Queue Stats
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Serving Count */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-4"
                                >
                                    <p className="text-sm text-green-400 mb-2">Currently Serving</p>
                                    <motion.p
                                        key={liveQueue.serving ? 1 : 0}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-4xl font-bold text-green-300"
                                    >
                                        {liveQueue.serving ? '1' : '0'}
                                    </motion.p>
                                </motion.div>

                                {/* Waiting Count */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-4"
                                >
                                    <p className="text-sm text-blue-400 mb-2">Waiting in Queue</p>
                                    <motion.p
                                        key={liveQueue.totalWaiting}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-4xl font-bold text-blue-300"
                                    >
                                        {liveQueue.totalWaiting || 0}
                                    </motion.p>
                                </motion.div>

                                {/* Efficiency Indicator */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/30 rounded-xl p-4"
                                >
                                    <p className="text-sm text-amber-400 mb-2">Queue Health</p>
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <Zap className="w-5 h-5 text-amber-300" />
                                        </motion.div>
                                        <span className="text-lg font-bold text-amber-300">
                                            {liveQueue.totalWaiting > 10 ? 'High Load' : 'Normal'}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Last Refresh Time */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700"
                                >
                                    <Clock className="w-3 h-3" />
                                    <span>Last sync: {formatLastRefreshTime()}</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-6 py-4 border-b border-slate-700">
                                <h2 className="text-lg font-semibold">Quick Actions</h2>
                            </div>

                            <div className="p-6 space-y-3">
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/officer-panel/queue-services')}
                                    disabled={!!actionInProgress || isRefreshing}
                                    className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all text-slate-300 hover:text-white disabled:opacity-50 flex items-center justify-between font-medium"
                                >
                                    <span>Change Service</span>
                                    <span className="text-slate-500">→</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        const newDate = prompt('Enter new date (YYYY-MM-DD):', date);
                                        if (newDate) {
                                            navigate(`/officer-panel/queue-management/${departmentId}/${serviceId}?date=${newDate}`);
                                        }
                                    }}
                                    disabled={!!actionInProgress || isRefreshing}
                                    className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all text-slate-300 hover:text-white disabled:opacity-50 flex items-center justify-between font-medium"
                                >
                                    <span>Change Date</span>
                                    <span className="text-slate-500">→</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Error Alert - Right Column */}
                        <AnimatePresence>
                            {error && !liveQueue.serving && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-400/30 rounded-xl p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-red-300 font-medium mb-2">{error}</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={fetchQueueData}
                                                disabled={!!actionInProgress || isRefreshing}
                                                className="text-xs bg-red-500/30 hover:bg-red-500/50 text-red-200 px-3 py-1 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                Retry
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Action Loader Overlay */}
            <AnimatePresence>
                {actionInProgress && actionInProgress !== 'serveNext' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl flex items-center gap-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader className="w-6 h-6 text-blue-400" />
                            </motion.div>
                            <span className="font-medium text-slate-200">
                                {actionInProgress === 'recall' ? 'Recalling tokens...' :
                                 actionInProgress === 'complete' ? 'Completing token...' :
                                 actionInProgress === 'skip' ? 'Skipping token...' : 'Processing...'}
                            </span>
                        </motion.div>
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
                        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                            >
                                <Loader className="w-8 h-8 animate-spin text-white" />
                            </motion.div>
                            <p className="text-slate-300 font-medium">Loading queue data...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default QueueManagement;