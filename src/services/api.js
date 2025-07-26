import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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

// Reference Data APIs
export const referenceAPI = {
  getReligions: () => api.get('/reference/religions'),
  getCategories: () => api.get('/reference/categories'),
  getCastes: (category) => api.get(`/reference/castes?category=${category}`),
  getSchemes: () => api.get('/reference/schemes'),
  getPCs: () => api.get('/reference/pcs'),
  getACs: (pc) => api.get(`/reference/acs?pc=${pc}`),
  getPanchayats: () => api.get('/reference/panchayats'),
};

// Beneficiary APIs
export const beneficiaryAPI = {
  initiate: (beneficiaryData) => api.post('/beneficiaries/initiate', beneficiaryData),
  verify: (phone, verificationCode) => api.post('/beneficiaries/verify', { phone, verificationCode }),
  getAll: () => api.get('/beneficiaries'),
};

export default api;
