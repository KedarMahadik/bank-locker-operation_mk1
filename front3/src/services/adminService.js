import apiClient from './apiClient';

export const adminLogin = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  // MODIFIED: Point to the unified login endpoint
  return apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const getPendingRequests = () => {
  return apiClient.get('/admin/requests');
};

export const getApplicationDetails = (userId) => {
  return apiClient.get(`/admin/requests/${userId}`);
};

export const approveRequest = (userId) => {
  return apiClient.post(`/admin/approve/${userId}`);
};
