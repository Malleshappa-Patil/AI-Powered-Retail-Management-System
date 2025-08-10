// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// --- THIS IS THE NEW PART ---
// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response, // Directly return a successful response
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log("Session expired or invalid. Logging out.");
      // Remove the user from local storage
      localStorage.removeItem('user');
      // Redirect to the login page
      window.location.href = '/login';
    }
    // Return any other error so that components can handle it
    return Promise.reject(error);
  }
);

export default api;