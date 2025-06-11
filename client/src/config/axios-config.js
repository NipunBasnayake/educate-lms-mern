import axios from "axios";
import store from "../redux/store-config/store";

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  
  //withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
/* apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        // add Role based headers if needed
        const role = store.getState().auth.user?.role;
        if(role){
            config.headers['X-User-Role'] = role;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
); */

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 Unauthorized (token expired)
    /* if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = store.getState().auth.refreshToken;
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshTokenValue}`,
            },
          }
        );

        const { token: newToken, user } = response.data;
        store.dispatch(refreshToken({ token: newToken, user }));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - logout user
        store.dispatch(logout());
        swal({
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(() => {
          window.location.href = "/login";
        });
        return Promise.reject(refreshError);
      }
    } */

    // Handle 403 Forbidden (role-based access)
    if (status === 403) {
      /* swal({
        title: "Access Denied",
        text: "You don't have permission to access this resource.",
        icon: "error",
        button: "OK",
      }); */
      return Promise.reject(error);
    }

    // Handle other errors
    if (status >= 500) {
      /* swal({
        title: "Server Error",
        text: "Something went wrong on our end. Please try again later.",
        icon: "error",
        button: "OK",
      }); */
    }

    return Promise.reject(error);

  }
);

export default apiClient;