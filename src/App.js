import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="container-fluid p-0">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/home" /> : <Signup />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/home" /> : <Login />} 
            />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Home />} />
              <Route path="/schemes" element={<Schemes />} />
            </Route>
            
            {/* Default Route */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} 
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
