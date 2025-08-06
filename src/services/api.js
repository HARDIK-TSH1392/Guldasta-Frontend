import axios from 'axios';

const API_BASE_URL = 'https://api.voteradhikarpatra.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reference Data APIs - Updated to use dynamic state-based endpoints
export const referenceAPI = {
  getReligions: () => api.get('/api/reference/religions'),
  getStates: () => api.get('/api/reference/states'),
  getCategories: (religion) => api.get(`/api/reference/categories?religion=${encodeURIComponent(religion)}`),
  getCastes: (religion, category) => api.get(`/api/reference/castes?religion=${encodeURIComponent(religion)}&category=${encodeURIComponent(category)}`),
  getPCs: () => {
    // Always fetch PCs for Bihar only
    return api.get(`/api/reference/pcs?state=Bihar`);
  },
  getACs: (pc) => {
    if (!pc) {
      throw new Error('PC parameter is required for getACs');
    }
    return api.get(`/api/reference/acs?pc=${encodeURIComponent(pc)}`);
  },
};

// Beneficiary APIs - Updated for 2-step OTP process
export const beneficiaryAPI = {
  initiate: (beneficiaryData) => api.post('/api/beneficiaries/initiate', beneficiaryData),
  verify: (phone, otp) => api.post('/api/beneficiaries/verify', { phone, otp }),
  getAll: () => api.get('/api/beneficiaries'),
};

export default api;
