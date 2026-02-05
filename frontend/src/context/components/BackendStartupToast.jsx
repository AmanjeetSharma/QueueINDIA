import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BackendStartupToast = ({ message, onDismiss, onRefresh }) => {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown

    useEffect(() => {
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + (100 / 120); // 2 minutes to complete
            });
        }, 1000);

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, []);

    // Format time for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl shadow-lg max-w-2xl w-full mx-auto mt-4 font-sans">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-amber-600"
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
                        <h3 className="text-lg font-semibold text-amber-900 mb-1">
                            Backend Service Initializing
                        </h3>
                        <p className="text-amber-800 text-sm md:text-base">
                            {message || "The backend is starting up. This is normal after deployment or first-time access."}
                        </p>
                    </div>
                </div>

                {/* Progress and Timer */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-amber-700">
                            Initialization Progress
                        </span>
                        <span className="text-sm font-semibold text-amber-900">
                            {formatTime(timeLeft)} remaining
                        </span>
                    </div>

                    <div className="w-full bg-amber-100 rounded-full h-2.5">
                        <div
                            className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-amber-600 mt-1">
                        <span>Starting services...</span>
                        <span>~{Math.round(progress)}% complete</span>
                    </div>
                </div>

                {/* Information Panel */}
                <div className="bg-amber-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-amber-900">What's happening?</span>
                    </div>

                    <div className="space-y-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span>Backend server is starting for the first time or after deployment</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span>Cold starts can take up to 60-90 seconds (As Render does not grant instant startup)</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span>Database connections and services are being initialized</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                            <span>Your data is safe - this is a normal initialization process</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-amber-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Page
                    </button>

                    <button
                        onClick={onDismiss}
                        className="flex-1 border-2 border-amber-400 hover:bg-amber-100 text-amber-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Dismiss & Continue Waiting
                    </button>
                </div>

                {/* Auto-refresh Notice */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-amber-600">
                        Will automatically retry in {timeLeft} seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

// Helper function to show the toast
export const showBackendStartupToast = (message = "Failed to fetch departments. Backend is starting up...") => {
    const toastId = toast.custom(
        (t) => (
            <BackendStartupToast
                message={message}
                onDismiss={() => toast.dismiss(t.id)}
                onRefresh={() => {
                    toast.dismiss(t.id);
                    window.location.reload();
                }}
            />
        ),
        {
            duration: 60000, // 1 minute
            position: "top-center",
        }
    );

    return toastId;
};

export default BackendStartupToast;