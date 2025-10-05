// axiosConfig.js
import axios from 'axios';

// Tạo một instance của axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // API backend Spring Boot của bạn
  timeout: 10000, // Thời gian chờ (ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request (thêm token nếu có)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // hoặc localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response (xử lý chung)
api.interceptors.response.use(
  (response) => response.data, // chỉ lấy data
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
