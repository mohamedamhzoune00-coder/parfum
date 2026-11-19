import API from './axios';

// Admin: Login with email & password
export const loginAdmin = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Admin: Check current authenticated user info
export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};
