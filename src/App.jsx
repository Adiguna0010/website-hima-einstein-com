import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toast } from './components/Toast';

// Code-split all routes using React.lazy for instant load and lightweight mobile rendering
const Home = lazy(() => import('./pages/Home'));
const Sphere = lazy(() => import('./pages/Sphere'));
const DivisionDetail = lazy(() => import('./pages/DivisionDetail'));
const Market = lazy(() => import('./pages/Market'));
const Space = lazy(() => import('./pages/Space'));
const Secretariat = lazy(() => import('./pages/Secretariat'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Mitra = lazy(() => import('./pages/Mitra'));
const Investor = lazy(() => import('./pages/Investor'));
const Finance = lazy(() => import('./pages/Finance'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CabinetStructure = lazy(() => import('./pages/CabinetStructure'));
const Profile = lazy(() => import('./pages/Profile'));

// Code-split all dashboards
const MasterAdmin = lazy(() => import('./pages/Dashboard/MasterAdmin'));
const DanusDashboard = lazy(() => import('./pages/Dashboard/DanusDashboard'));
const RistekDashboard = lazy(() => import('./pages/Dashboard/RistekDashboard'));
const LogistikDashboard = lazy(() => import('./pages/Dashboard/LogistikDashboard'));
const BendaharaDashboard = lazy(() => import('./pages/Dashboard/BendaharaDashboard'));
const DivisionDashboard = lazy(() => import('./pages/Dashboard/DivisionDashboard'));

// Ultra-lightweight route loading fallback
const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 text-slate-400">
    <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
    <span className="text-[11px] font-mono tracking-widest uppercase">Memuat Halaman...</span>
  </div>
);

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
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomeWrapper showToast={showToast} />} />
                  <Route path="/sphere" element={<Sphere showToast={showToast} />} />
                  <Route path="/sphere/:divisionKey" element={<DivisionDetail showToast={showToast} />} />
                  <Route path="/vault" element={<Navigate to="/sphere/ristek" replace />} />
                  <Route path="/market" element={<Market showToast={showToast} />} />
                  <Route path="/space" element={<Space showToast={showToast} />} />
                  <Route path="/secretariat" element={<Secretariat showToast={showToast} />} />
                  <Route path="/finance" element={<Finance showToast={showToast} />} />
                  <Route path="/calendar" element={<Calendar showToast={showToast} />} />
                  <Route path="/mitra" element={<Mitra />} />
                  <Route path="/investor" element={<Investor />} />
                  <Route path="/struktur" element={<CabinetStructure />} />
                  
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

                  {/* Protected Operator Sekretaris Route */}
                  <Route 
                    path="/dashboard/sekretaris" 
                    element={
                      <ProtectedRoute allowedRoles={['Master Admin', 'Sekretaris Umum']}>
                        <Secretariat showToast={showToast} isDashboard={true} />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Bendahara Route */}
                  <Route 
                    path="/dashboard/bendahara" 
                    element={
                      <ProtectedRoute allowedRoles={['Master Admin', 'Bendahara Umum']}>
                        <BendaharaDashboard showToast={showToast} />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Division Operator Route */}
                  <Route 
                    path="/dashboard/division" 
                    element={
                      <ProtectedRoute allowedRoles={[
                        'Master Admin',
                        'Operator BPH',
                        'Operator Internal',
                        'Operator External',
                        'Operator Ristek',
                        'Operator Pengma',
                        'Operator Danus',
                        'Operator Kominfo',
                        'Operator Logistik'
                      ]}>
                        <DivisionDashboard showToast={showToast} />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Fallback redirect to Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                  {/* Protected Profile Route — all logged-in users */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={['Master Admin','Bendahara Umum','Operator Danus','Operator Logistik','Operator Ristek','Sekretaris Umum','Operator BPH','Operator Internal','Operator External','Operator Pengma','Operator Kominfo','Anggota Hima','Anggota Biasa']}>
                        <Profile showToast={showToast} />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
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
