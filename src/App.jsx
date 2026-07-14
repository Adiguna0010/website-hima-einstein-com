import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sphere from './pages/Sphere';
import DivisionDetail from './pages/DivisionDetail';
import Market from './pages/Market';
import Quest from './pages/Quest';
import Space from './pages/Space';
import Secretariat from './pages/Secretariat';
import Calendar from './pages/Calendar';
import Mitra from './pages/Mitra';
import Investor from './pages/Investor';
import Login from './pages/Login';
import Register from './pages/Register';
import MasterAdmin from './pages/Dashboard/MasterAdmin';
import DanusDashboard from './pages/Dashboard/DanusDashboard';
import RistekDashboard from './pages/Dashboard/RistekDashboard';
import LogistikDashboard from './pages/Dashboard/LogistikDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toast } from './components/Toast';

// Route Guarding Component
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Save a warning in local storage or trigger via page state
    // Let's redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Show toast is triggered on the destination page or using custom event
    // Redirect back to Home
    return <Navigate to="/" replace state={{ showUnauthorizedToast: true }} />;
  }

  return children;
}

// Wrapper to intercept unauthorized states and trigger toast
function HomeWrapper({ showToast }) {
  const { state } = useLocation();
  React.useEffect(() => {
    if (state?.showUnauthorizedToast) {
      showToast('Akses Ditolak: Anda tidak memiliki wewenang untuk membuka halaman ini!', 'error');
      // Clear route state to prevent repeating toasts
      window.history.replaceState({}, document.title);
    }
  }, [state, showToast]);

  return <Home />;
}

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* Main view spacing wrapper */}
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeWrapper showToast={showToast} />} />
                <Route path="/sphere" element={<Sphere showToast={showToast} />} />
                <Route path="/sphere/:divisionKey" element={<DivisionDetail showToast={showToast} />} />
                <Route path="/market" element={<Market showToast={showToast} />} />
                <Route path="/quest" element={<Quest />} />
                <Route path="/space" element={<Space showToast={showToast} />} />
                <Route path="/secretariat" element={<Secretariat showToast={showToast} />} />
                <Route path="/calendar" element={<Calendar showToast={showToast} />} />
                <Route path="/mitra" element={<Mitra />} />
                <Route path="/investor" element={<Investor />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login showToast={showToast} />} />
                <Route path="/register" element={<Register showToast={showToast} />} />

                {/* Protected Master Admin Route */}
                <Route 
                  path="/dashboard/master" 
                  element={
                    <ProtectedRoute allowedRoles={['Master Admin']}>
                      <MasterAdmin showToast={showToast} />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Operator Danus Route */}
                <Route 
                  path="/dashboard/danus" 
                  element={
                    <ProtectedRoute allowedRoles={['Master Admin', 'Operator Danus']}>
                      <DanusDashboard showToast={showToast} />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Operator Ristek Route */}
                <Route 
                  path="/dashboard/ristek" 
                  element={
                    <ProtectedRoute allowedRoles={['Master Admin', 'Operator Ristek']}>
                      <RistekDashboard showToast={showToast} />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Operator Logistik Route */}
                <Route 
                  path="/dashboard/logistik" 
                  element={
                    <ProtectedRoute allowedRoles={['Master Admin', 'Operator Logistik']}>
                      <LogistikDashboard showToast={showToast} />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            
            {/* Global toast message notifier */}
            {toast && (
              <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={closeToast} 
              />
            )}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
