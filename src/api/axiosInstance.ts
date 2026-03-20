import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.0.234:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach the access token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 Unauthorized and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Attempt to refresh the token. 
                // NOTE: Confirm and update the URL below to match your backend's refresh endpoint (e.g. /api/token/refresh/)
                const response = await axios.post("http://192.168.0.234:8000/api/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem("access_token", newAccessToken);

                // Update the Authorization header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If token refresh fails, log the user out
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("username");
                localStorage.removeItem("role");

                // Redirect to home or login page
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
