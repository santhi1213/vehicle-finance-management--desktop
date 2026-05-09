import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 Making ${config.method?.toUpperCase()} request to ${config.url}`);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - is the backend running?');
      toast.error('Cannot connect to server. Please check if backend is running on port 5000');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`❌ Error ${error.response.status}:`, error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          toast.error(error.response.data?.message || 'Bad request');
          break;
        case 401:
          toast.error('Unauthorized - please login again');
          break;
        case 403:
          toast.error('Forbidden - insufficient permissions');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error - please try again later');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('📡 No response received:', error.request);
      toast.error('No response from server. Please try again.');
    } else {
      // Something happened in setting up the request
      console.error('⚙️ Request setup error:', error.message);
      toast.error('Request failed: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;