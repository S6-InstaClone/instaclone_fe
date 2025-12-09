import axios from 'axios';

// API Gateway URL for account operations
const API_GATEWAY_URL = 'http://localhost:5000/api/Account';

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

/**
 * Delete the current user's account (GDPR compliant)
 * This will:
 * 1. Delete user from Keycloak
 * 2. Delete user data from Account Service
 * 3. Trigger deletion of all user's posts via RabbitMQ
 */
export const deleteMyAccount = async () => {
    const response = await apiClient.delete('/delete-me');
    return response.data;
};

export default deleteMyAccount;