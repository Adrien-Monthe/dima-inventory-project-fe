import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor → check for 401 errors
api.interceptors.response.use(
    (response) => response, async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // avoid infinite loop

            try {
                const refresh = localStorage.getItem("refresh");
                const res = await axios.post("http://localhost:8000/api/token/refresh/", {
                    refresh,
                });

                const newAccess = res.data.access;
                localStorage.setItem("access", newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
