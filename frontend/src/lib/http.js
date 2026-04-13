import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Do NOT refresh for auth endpoints (very important)
        const skipRefresh = [
            "/auth/refresh-token",
            "/auth/login",
            "/auth/register",
            "/oauth2/google-login",
        ];

        if (
            originalRequest._retry ||
            skipRefresh.some(route => originalRequest.url.includes(route))
        ) {
            return Promise.reject(error);
        }

        // If unauthorized → Try refresh ONCE
        if (error.response?.status === 401) {
            originalRequest._retry = true;
            try {
                // console.log("Trying refresh token...");
                await axiosInstance.post("/auth/refresh-token", {}, { withCredentials: true });

                // console.log("Retrying original request after refresh...");
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                // console.warn("Refresh failed: letting AuthContext handle logout");
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export const http = axiosInstance;
