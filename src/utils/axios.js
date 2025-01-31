import axios from "axios";import { TOKEN_KEY } from "../constants";
const axiosInstance = axios.create({
  //   baseURL: "http://localhost:5000",
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the environment variable
  headers: {
    "Content-Type": "application/json",
    // You can add other default headers here
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add auth tokens)
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // You can modify the response here
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem(TOKEN_KEY);
//       window.location.href = "/login5";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
