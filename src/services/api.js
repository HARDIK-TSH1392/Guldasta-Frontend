import axios from 'axios';

const API_BASE_URL = 'https://api.voteradhikarpatra.com:8080/api';

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
  getReligions: () => api.get('/reference/religions'),
  getStates: () => api.get('/reference/states'),
  getCategories: (religion) => api.get(`/reference/categories?religion=${encodeURIComponent(religion)}`),
  getCastes: (religion, category) => api.get(`/reference/castes?religion=${encodeURIComponent(religion)}&category=${encodeURIComponent(category)}`),
  getPCs: (state = 'Bihar') => api.get(`/reference/pcs?state=${state}`),
  getACs: (pc) => api.get(`/reference/acs?pc=${encodeURIComponent(pc)}`),
};

// Beneficiary APIs
export const beneficiaryAPI = {
  initiate: (beneficiaryData) => api.post('/beneficiaries/initiate', beneficiaryData),
  getAll: () => api.get('/beneficiaries'),
};

export default api;
