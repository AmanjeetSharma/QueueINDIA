import axios from "axios";

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,      // http://localhost:3000/api/v1
    withCredentials: true,                           // send/receive http-only cookies
    headers: { "Content-Type": "application/json" }
});

// Response interceptor to auto-refresh access token on 401
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
    pendingQueue.forEach(p => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    pendingQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // If refresh token missing, do NOT retry refresh
        const hasRefreshToken = document.cookie.includes("refreshToken");
        if (!hasRefreshToken) {
            return Promise.reject(error);
        }

        // Ignore refresh attempts for these endpoints
        if (
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register") ||
            originalRequest.url.includes("/auth/refresh-token")
        ) {
            return Promise.reject(error);
        }

        // Perform refresh only on 401 once
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post("/auth/refresh-token");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Clear cookies on failed refresh
                console.warn("❌ Refresh failed. Logging out...");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// Keep http export for backward compatibility
export const http = axiosInstance;