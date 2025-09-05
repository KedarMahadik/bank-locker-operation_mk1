import axios from 'axios';

/**
 * Creates a centralized, pre-configured instance of axios.
 * This instance will be used by all service files to make API requests.
 */
const apiClient = axios.create({
  // Set the base URL for all API requests. It's best practice to use an
  // environment variable for this, with a fallback for local development.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',

  // This is CRITICAL for authentication. It tells axios to send and receive
  // the secure, HttpOnly cookies that the FastAPI backend uses for sessions.
  withCredentials: true,
});


/*
  // OPTIONAL: You can add interceptors for global error handling.
  // This is a good place to handle expired sessions (401 errors).
  apiClient.interceptors.response.use(
    (response) => {
      // If the response is successful, just return it.
      return response;
    },
    (error) => {
      // If the error is a 401 Unauthorized, it means the user's session
      // has expired. We can redirect them to the login page.
      if (error.response && error.response.status === 401) {
        // This is a simple way to force a redirect. A more robust solution
        // would involve the AuthContext.
        window.location = '/auth/login';
      }
      // For all other errors, just pass them along.
      return Promise.reject(error);
    }
  );
*/


export default apiClient;