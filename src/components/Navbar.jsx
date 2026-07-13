import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalQty } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSphereOpen, setIsSphereOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setIsSphereOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSphereSelect = (divKey) => {
    navigate(`/sphere/${divKey}`);
    setIsSphereOpen(false);
  };

  const menuItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Einstein Market', path: '/market' },
    { label: 'Einstein Quest', path: '/quest' },
    { label: 'Einstein Space', path: '/space' },
    { label: 'Secretariat', path: '/secretariat' },
    { label: 'Einstein Kalender', path: '/calendar' },
  ];

  const divisions = [
    { label: 'Badan Pengurus Harian', key: 'bph' },
    { label: 'Internal', key: 'internal' },
    { label: 'External', key: 'external' },
    { label: 'Riset & Teknologi', key: 'ristek' },
    { label: 'Pengembangan Mahasiswa', key: 'pengma' },
    { label: 'Dana Usaha', key: 'danus' },
    { label: 'Kominfo', key: 'kominfo' },
    { label: 'Aset & Logistik', key: 'logistik' },
  ];

  const getDashboardPath = (role) => {
    switch (role) {
      case 'Master Admin':
        return '/dashboard/master';
      case 'Operator Danus':
        return '/dashboard/danus';
      case 'Operator Ristek':
        return '/dashboard/ristek';
      case 'Operator Logistik':
        return '/dashboard/logistik';
      case 'Sekretaris Umum':
        return '/secretariat'; // sekretaris umum uses the secretariat page's backoffice
      default:
        return null;
    }
  };

  const dbPath = currentUser ? getDashboardPath(currentUser.role) : null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-gold-border py-3 shadow-md' 
        : 'bg-white/80 backdrop-blur-md border-gold-border/30 py-4 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/Media Einsten/Media Umum/logo kabinet hitam (horizontal) (1).png" 
              alt="HIMA EINSTEIN Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/ffffff/000000?text=EINSTEIN";
              }}
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === '/' ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
              }`}
            >
              Beranda
            </Link>

            {/* Einstein Sphere Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSphereOpen(!isSphereOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === '/sphere' || location.pathname.startsWith('/sphere/') ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
                }`}
              >
                Einstein Sphere <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSphereOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSphereOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-gold-border shadow-xl py-2 z-50 animate-slide-in">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-100 mb-1">Divisi Himpunan</div>
                  {divisions.map((div) => (
                    <button
                      key={div.key}
                      onClick={() => handleSphereSelect(div.key)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-gold-dark hover:bg-slate-50 transition-colors"
                    >
                      {div.label}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      to="/sphere"
                      onClick={() => setIsSphereOpen(false)}
                      className="block px-4 py-2 text-sm text-gold hover:text-gold-dark hover:bg-slate-50 font-medium"
                    >
                      Jelajahi Sphere Hub
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {menuItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm transition-colors relative ${
                  location.pathname === item.path ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
                }`}
              >
                {item.label}
                {item.label === 'Einstein Market' && totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {totalQty}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Controls (Auth) */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-gold-border rounded-xl px-3 py-1.5 pl-2">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-gold-dark flex items-center gap-0.5 font-semibold uppercase">
                    {currentUser.role === 'Master Admin' && <Shield className="w-2.5 h-2.5" />}
                    {currentUser.role}
                  </span>
                </div>
                
                {/* Actions Dashboard & Logout */}
                <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                  {dbPath && (
                    <Link
                      to={dbPath}
                      title="Dashboard Admin/Operator"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-gold-dark hover:bg-slate-100 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-gold to-gold-light text-white rounded-xl shadow-[0_0_15px_-3px_rgba(170,124,17,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            {totalQty > 0 && (
              <Link to="/market" className="relative p-2 text-slate-600 hover:text-slate-900">
                <span className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gold-border shadow-xl z-50 animate-slide-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Beranda
            </Link>

            {/* Sphere Links in Mobile */}
            <div className="py-2 border-t border-b border-slate-100 my-2">
              <span className="block px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Einstein Sphere</span>
              <div className="grid grid-cols-2 gap-1 px-3">
                {divisions.map((div) => (
                  <button
                    key={div.key}
                    onClick={() => handleSphereSelect(div.key)}
                    className="text-left py-1.5 text-sm text-slate-500 hover:text-gold-dark transition-colors"
                  >
                    {div.label}
                  </button>
                ))}
              </div>
            </div>

            {menuItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  location.pathname === item.path ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-slate-100">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-800">{currentUser.name}</h4>
                      <p className="text-xs text-gold-dark uppercase font-semibold">{currentUser.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-3">
                    {dbPath && (
                      <Link
                        to={dbPath}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 hover:text-slate-900"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 hover:text-rose-700"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-sm font-semibold text-white shadow-lg shadow-gold/25"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
