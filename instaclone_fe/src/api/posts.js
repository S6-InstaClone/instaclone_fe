import axios from 'axios';

// API Gateway URL - all requests go through here
const API_GATEWAY_URL = 'http://localhost:5000/api/Posts';

// Create axios instance with interceptor to add auth token
const apiClient = axios.create({
    baseURL: API_GATEWAY_URL,
});

// Add auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses (token expired/invalid)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear session and redirect to login
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('id_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const getPosts = () => apiClient.get('');

export const getPost = (id) => apiClient.get(`/${id}`);

// Note: No longer need to pass UserId - gateway extracts it from token
export const createPost = (formData) =>
    apiClient.post('', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updatePost = (id, formData) =>
    apiClient.put(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deletePost = (id) => apiClient.delete(`/${id}`);

// Get posts by current user
export const getMyPosts = () => apiClient.get('/my-posts');