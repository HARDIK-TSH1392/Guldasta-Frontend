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
              element={user && user.profileCompleted ? <Navigate to="/home" /> : <Signup />} 
            />
            <Route 
              path="/login" 
              element={user && user.profileCompleted ? <Navigate to="/home" /> : <Login />} 
            />
            
            {/* Profile Route - accessible to logged in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Protected Routes - only for users with completed profiles */}
            <Route element={<ProtectedRoute />}>
              <Route 
                path="/home" 
                element={user && !user.profileCompleted ? <Navigate to="/profile" /> : <Home />} 
              />
              <Route 
                path="/schemes" 
                element={user && !user.profileCompleted ? <Navigate to="/profile" /> : <Schemes />} 
              />
            </Route>
            
            {/* Default Route */}
            <Route 
              path="/" 
              element={
                user 
                  ? (user.profileCompleted ? <Navigate to="/home" /> : <Navigate to="/profile" />)
                  : <Navigate to="/signup" />
              } 
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
