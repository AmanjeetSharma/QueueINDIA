import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';

const BackendStartupToast = ({ message, onDismiss, onRefresh }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const controls = useAnimation();

    // Smooth progress animation with framer-motion
    useEffect(() => {
        controls.start({
            width: "100%",
            transition: { duration: 60, ease: "linear" }
        });
    }, [controls]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time for display
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    // Calculate progress percentage for display
    const progressPercentage = ((60 - timeLeft) / 60) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-50 border-2 border-amber-400 rounded-xl shadow-lg w-full max-w-xl mx-2 sm:mx-auto mt-2 sm:mt-4 font-sans"
        >
            <div className="p-4 sm:p-6">
                {/* Header - Compact for mobile */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-0.5 sm:mb-1 truncate">
                            Backend Starting Up
                        </h3>
                        <p className="text-amber-800 text-xs sm:text-sm line-clamp-2">
                            {message || "First-time initialization in progress..."}
                        </p>
                    </div>
                </div>

                {/* Progress and Timer - Simplified mobile view */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs sm:text-sm font-medium text-amber-700">
                            Progress
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-amber-900">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Smooth progress bar with framer-motion */}
                    <div className="w-full bg-amber-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                        <motion.div
                            className="bg-amber-500 h-full rounded-full"
                            initial={{ width: "0%" }}
                            animate={controls}
                        />
                    </div>

                    <div className="flex justify-between text-xxs sm:text-xs text-amber-600 mt-1">
                        <span>Initializing...</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                </div>

                {/* Collapsible Info Panel - Hidden on mobile, visible on tap/click */}
                <details className="mb-4 sm:mb-6 group">
                    <summary className="flex items-center gap-2 cursor-pointer list-none">
                        <div className="bg-amber-100 rounded-lg p-2 flex-1 flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs sm:text-sm font-medium text-amber-900">
                                What's happening?
                            </span>
                            <svg className="w-4 h-4 ml-auto text-amber-700 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </summary>

                    <div className="mt-2 bg-amber-100 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                        <div className="flex items-start gap-1.5 sm:gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-amber-800">Cold start in progress (As Per Render Policy)</span>
                        </div>
                        <div className="flex items-start gap-1.5 sm:gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-amber-800">Loading services</span>
                        </div>
                        <div className="flex items-start gap-1.5 sm:gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-amber-800">Render usually takes 60-90 seconds to start up</span>
                        </div>
                    </div>
                </details>

                {/* Action Buttons - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                        onClick={onRefresh}
                        className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-amber-900 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>

                    <button
                        onClick={onDismiss}
                        className="w-full sm:flex-1 border-2 border-amber-400 hover:bg-amber-100 text-amber-700 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base active:scale-95"
                    >
                        Dismiss
                    </button>
                </div>

                {/* Auto-refresh Notice - Compact */}
                <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-xxs sm:text-xs text-amber-600">
                        Auto-retry in {timeLeft}s
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// Helper function with enhanced options
export const showBackendStartupToast = (message = "Failed to connect. Backend is starting up...") => {
    const toastId = toast.custom(
        (t) => (
            <BackendStartupToast
                message={message}
                onDismiss={() => {
                    toast.dismiss(t.id);
                    // Optional: Store dismissal in sessionStorage
                    sessionStorage.setItem('backend-startup-dismissed', 'true');
                }}
                onRefresh={() => {
                    toast.dismiss(t.id);
                    window.location.reload();
                }}
            />
        ),
        {
            duration: 60000, // Auto-dismiss after 60 seconds
            position: "top-center",
            // Better stacking behavior
            className: "!bg-transparent !shadow-none",
            // Prevents duplicate toasts
            id: 'backend-startup-toast',
        }
    );

    setTimeout(() => {
        toast.dismiss(toastId);
    }, 60000);

    return toastId;
};

// Add custom CSS for ultra-small text
const style = document.createElement('style');
style.textContent = `
    .text-xxs {
        font-size: 0.625rem;
        line-height: 0.75rem;
    }
    @media (min-width: 640px) {
        .text-xxs {
            font-size: 0.75rem;
            line-height: 1rem;
        }
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

export default BackendStartupToast;