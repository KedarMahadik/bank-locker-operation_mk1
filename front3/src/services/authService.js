import apiClient from './apiClient';



export const register = (userData) => {

  return apiClient.post('/auth/register', userData);

};



export const login = (email, password) => {

  const formData = new URLSearchParams();

formData.append('username', email);
formData.append('password', password);
return apiClient.post('/auth/login', formData);

};



export const setupAccount = (credentials) => {
 // Assuming the backend expects JSON for this endpoint
return apiClient.post('/auth/account/setup', credentials);

};



export const logout = () => {

// In a real app, you might have a backend endpoint to invalidate the cookie/token

return Promise.resolve()};