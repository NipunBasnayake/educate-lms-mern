import axios from "axios";
import store from "../redux/store-config/store";
import { logout, refreshTokenAPI } from "../redux/features/authSlice";

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response Interceptor
apiClient.interceptors.response.use(
  (response) =>  response,
  
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 Unauthorized (token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //const refreshTokenValue = store.getState().auth.refreshToken;
        // const response = await apiClient.post(
        //   `${API_BASE_URL}/api/auth/refresh-token`,
        //   {},
        //   /* {
        //     headers: {
        //       Authorization: `Bearer ${refreshTokenValue}`,
        //     },
        //   } */
        //   {
        //     withCredentials: true,
        //   }
        // );

/*         const response = await store.dispatch(refreshTokenAPI()).unwrap();
        if(response.success){
          console.log("refresh token response success axios config");
          
          return apiClient(originalRequest);
        } */

        /*         const { token: newToken, user } = response.data;
        store.dispatch(refreshToken({ token: newToken, user }));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); */

        // if (response.data.success) {
        //   const { acessToken, user } = response.data.data || response.data;
        //   store.dispatch(refreshTokenSuccess({ user }));
        //   return apiClient(originalRequest);
        // }

      } catch (refreshError) {
        // Refresh token failed - logout user
        store.dispatch(logout());
        window.location.href = "/login"  // Rediret on refresh Failure...

        /* swal({
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(() => {
          window.location.href = "/login";
        }); */
        
        return Promise.reject(refreshError);
      }finally{
        originalRequest._retry = false;
      }
    }

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
