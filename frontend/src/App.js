// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Page Imports
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import ReportsPage from './pages/ReportsPage';

// Context and Component Imports
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer';

// CSS Imports
import './App.css';

// PrivateRoute wrapper to protect pages that require login
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App-wrapper">
            <div className="content-wrapper">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Private Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/category/:categoryName" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
                
                {/* Wildcard route to redirect any unknown URL to the dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />

              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;