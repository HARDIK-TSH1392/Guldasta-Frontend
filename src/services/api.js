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

// Reference Data APIs - Updated to use new Bihar-specific endpoints
export const referenceAPI = {
  getReligions: () => api.get('/api/reference/religions'),
  getStates: () => api.get('/api/reference/states'),
  getCategories: (religion) => api.get(`/api/reference/categories?religion=${encodeURIComponent(religion)}`),
  getCastes: (religion, category) => api.get(`/api/reference/castes?religion=${encodeURIComponent(religion)}&category=${encodeURIComponent(category)}`),
  getPCs: (state = 'Bihar') => api.get(`/api/reference/pcs?state=${state}`),
  getACs: (pc) => api.get(`/api/reference/acs?pc=${encodeURIComponent(pc)}`),
};

// Beneficiary APIs
export const beneficiaryAPI = {
  initiate: (beneficiaryData) => api.post('/api/beneficiaries/initiate', beneficiaryData),
  getAll: () => api.get('/api/beneficiaries'),
};

export default api;
