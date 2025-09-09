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

  // Set up axios defaults for production
  const API_BASE_URL = 'https://api.voteradhikarpatra.com'; // Production backend URL
  axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Always try to fetch user profile - don't check token expiration
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
      
      // Return the full response including analytics for components that need it
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Don't automatically logout on any error - keep user logged in
      // Only log the error for debugging
      console.log('Profile fetch failed but keeping user logged in:', error.response?.data?.message || error.message);
      
      throw error; // Re-throw for components to handle
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, otp) => {
    try {
      const response = await axios.post('/api/auth/login', { phone, otp });
      const { token, user, isNewUser } = response.data;
      
      // Validate token before storing
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('User logged in successfully:', user.phone);
      return { success: true, user, isNewUser };
    } catch (error) {
      console.error('Login error:', error);
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
      
      // Don't logout on any error - just return the error
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  // Manual logout only - user must click logout button
  const logout = () => {
    console.log('User manually logged out');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Beneficiary functions - no automatic logout on any error
  const initiateBeneficiary = async (beneficiaryData) => {
    try {
      const response = await axios.post('/api/beneficiaries/initiate', beneficiaryData);
      return { success: true, data: response.data };
    } catch (error) {
      // Never logout automatically - just return the error
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to initiate beneficiary registration' 
      };
    }
  };

  const verifyBeneficiaryOTP = async (phone, otp) => {
    try {
      const response = await axios.post('/api/beneficiaries/verify-otp', { phone, otp });
      return { success: true, data: response.data };
    } catch (error) {
      // Never logout automatically - just return the error
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const resendBeneficiaryOTP = async (phone) => {
    try {
      const response = await axios.post('/api/beneficiaries/resend-otp', { phone });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to resend OTP' 
      };
    }
  };

  const registerBeneficiary = async (beneficiaryData) => {
    try {
      const response = await axios.post('/api/beneficiaries/register', beneficiaryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to register beneficiary' 
      };
    }
  };

  const getLeaders = async () => {
    try {
      const response = await axios.get('/api/beneficiaries/leaders');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch leaders' 
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
    initiateBeneficiary,
    verifyBeneficiaryOTP,
    resendBeneficiaryOTP,
    registerBeneficiary,
    getLeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
