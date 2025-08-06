import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults for localhost
  const API_BASE_URL = 'http://localhost:8080';
  axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Only logout if it's an authentication error (401) or token-related error
      if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
        console.log('Authentication error detected, logging out user');
        logout();
      } else {
        // For other errors, just log them but don't logout
        console.log('Profile fetch failed but keeping user logged in:', error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, otp) => {
    try {
      const response = await axios.post('/api/auth/login', { phone, otp });
      const { token, user, isNewUser } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, user, isNewUser };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', {
        phone: userData.phone,
        role: userData.role || 'volunteer'
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      console.log('Profile updated successfully:', response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Don't logout on profile update errors unless it's an auth error
      if (error.response?.status === 401) {
        console.log('Authentication error during profile update, logging out');
        logout();
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Beneficiary functions
  const initiateBeneficiary = async (beneficiaryData) => {
    try {
      const response = await axios.post('/api/beneficiaries/initiate', beneficiaryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to initiate beneficiary registration' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    fetchUserProfile,
    initiateBeneficiary
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
