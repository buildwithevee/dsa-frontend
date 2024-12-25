import axios from 'axios';
import { apiBaseUrl } from '../constants/Constant';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: apiBaseUrl, // Replace with your backend API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach the JWT token to all requests
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage (or any other storage you use)
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach the token
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export { apiClient };
