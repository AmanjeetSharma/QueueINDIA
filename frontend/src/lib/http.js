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

        // 🔁 Stop retry if already tried OR if refresh call
        if (originalRequest._retry || originalRequest.url.includes("/auth/refresh-token")) {
            return Promise.reject(error);
        }

        // ⛔ If unauthorized → attempt refresh once
        if (error.response?.status === 401) {
            originalRequest._retry = true;
            try {
                // console.log("🔄 Trying refresh token...");
                await axiosInstance.post("/auth/refresh-token", {}, { withCredentials: true });
                // console.log("🔁 Retry original request after refresh");
                return axiosInstance(originalRequest);
            } catch (err) {
                console.warn("❌ Refresh failed");
                return Promise.reject(err); // Handled in AuthContext
            }
        }

        return Promise.reject(error);
    }
);

export const http = axiosInstance;
