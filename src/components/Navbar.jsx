import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield, 
  ShoppingBag, Compass, History, Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalQty } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileSuiteOpen, setIsMobileSuiteOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const suiteRef = useRef(null);
  const adminRef = useRef(null);

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
    setIsSuiteOpen(false);
    setIsAdminOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suiteRef.current && !suiteRef.current.contains(event.target)) {
        setIsSuiteOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setIsAdminOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSphereSelect = (divKey) => {
    navigate(`/sphere/${divKey}`);
    setIsSuiteOpen(false);
  };

  const divisions = [
    { label: 'BPH', key: 'bph' },
    { label: 'Internal', key: 'internal' },
    { label: 'External', key: 'external' },
    { label: 'Riset & Teknologi', key: 'ristek' },
    { label: 'Pengembangan Mhs', key: 'pengma' },
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
        return '/secretariat';
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
          
          {/* Logo - HIMA logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => navigate('/')}>
            <img 
              src="/Media/Logo HIma/logo hima warna (3)_page-0001.jpg" 
              alt="HIMPUNAN EINSTEIN.COM Logo" 
              className="h-11 w-auto object-contain"
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

            {/* Einstein Suite Mega-Dropdown */}
            <div className="relative" ref={suiteRef}>
              <button
                onClick={() => setIsSuiteOpen(!isSuiteOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  ['/sphere', '/market', '/quest', '/space'].some(p => location.pathname.startsWith(p))
                    ? 'text-gold font-bold' 
                    : 'text-slate-600 hover:text-gold-dark font-medium'
                }`}
              >
                Einstein Suite 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSuiteOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSuiteOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[560px] rounded-2xl bg-white border border-gold-border shadow-xl p-5 z-50 animate-slide-in grid grid-cols-12 gap-5 text-left">
                  
                  {/* Left Column: Einstein Sphere Divisions */}
                  <div className="col-span-6 border-r border-slate-100 pr-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-850 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3 font-bold">
                      <Compass className="w-4 h-4 text-gold" />
                      <span>Einstein Sphere</span>
                    </div>
                    
                    <p className="text-[10px] text-slate-405 mb-3 font-light leading-relaxed">
                      Sektor divisi kerja Himpunan Elektronika Instrumentasi.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      {divisions.map((div) => (
                        <button
                          key={div.key}
                          onClick={() => handleSphereSelect(div.key)}
                          className="w-full text-left px-2 py-1 text-xs text-slate-600 hover:text-gold hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          {div.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Link
                        to="/sphere"
                        onClick={() => setIsSuiteOpen(false)}
                        className="text-[10px] text-gold hover:text-gold-dark font-bold uppercase tracking-wider block"
                      >
                        Jelajahi Sphere Hub &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Other Suite Apps */}
                  <div className="col-span-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Einstein Market */}
                      <Link 
                        to="/market" 
                        onClick={() => setIsSuiteOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 group-hover:border-gold/20 group-hover:bg-gold/5">
                          <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-gold" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            Einstein Market
                            {totalQty > 0 && (
                              <span className="bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                {totalQty}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">
                            Katalog merchandise resmi Dana Usaha.
                          </p>
                        </div>
                      </Link>

                      {/* Einstein Quest */}
                      <Link 
                        to="/quest" 
                        onClick={() => setIsSuiteOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 group-hover:border-gold/20 group-hover:bg-gold/5">
                          <History className="w-4 h-4 text-slate-600 group-hover:text-gold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Einstein Quest</h4>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">
                            Linimasa sejarah, dokumentasi & alumni.
                          </p>
                        </div>
                      </Link>

                      {/* Einstein Space */}
                      <Link 
                        to="/space" 
                        onClick={() => setIsSuiteOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 group-hover:border-gold/20 group-hover:bg-gold/5">
                          <Cpu className="w-4 h-4 text-slate-600 group-hover:text-gold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Einstein Space</h4>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">
                            Peminjaman instrumen lab via QR Scanner.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                </div>
              )}
            </div>

            <Link 
              to="/secretariat" 
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === '/secretariat' ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
              }`}
            >
              Secretariat
            </Link>
            
            <Link 
              to="/calendar" 
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === '/calendar' ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
              }`}
            >
              Kalender
            </Link>

            <Link 
              to="/mitra" 
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === '/mitra' ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
              }`}
            >
              Mitra
            </Link>

            <Link 
              to="/investor" 
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === '/investor' ? 'text-gold font-bold' : 'text-slate-600 hover:text-gold-dark font-medium'
              }`}
            >
              Investor
            </Link>
          </div>

          {/* Desktop Right Controls (Auth & Instansi Logos) */}
          <div className="hidden lg:flex items-center space-x-3 text-left">
            {/* Instansi Penaung Logos (Poltek Nuklir & BRIN) */}
            <div className="flex items-center gap-3 border-r border-slate-200 pr-4 mr-2 h-7 shrink-0">
              <img 
                src="/Media/Logo Instansi/Logo Poltek (benar).png" 
                alt="Logo Poltek Nuklir" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x25/ffffff/000000?text=Poltek+Nuklir";
                }}
              />
              <img 
                src="/Media/Logo Instansi/logo brin warna_landscape.jpg" 
                alt="Logo BRIN" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x25/ffffff/000000?text=BRIN";
                }}
              />
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-gold-border rounded-xl px-3 py-1.5 pl-2 relative" ref={adminRef}>
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center cursor-pointer" onClick={() => setIsAdminOpen(!isAdminOpen)}>
                  <User className="w-4 h-4 text-gold" />
                </div>
                <div className="flex flex-col text-left cursor-pointer" onClick={() => setIsAdminOpen(!isAdminOpen)}>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-gold-dark flex items-center gap-0.5 font-semibold uppercase">
                    {currentUser.role === 'Master Admin' && <Shield className="w-2.5 h-2.5" />}
                    {currentUser.role}
                  </span>
                </div>
                
                {isAdminOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white border border-gold-border shadow-xl py-2 z-50 animate-slide-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-[9px] text-gold-dark uppercase tracking-wider font-semibold mt-0.5 flex items-center gap-1">
                        {currentUser.role === 'Master Admin' && <Shield className="w-2.5 h-2.5" />}
                        {currentUser.role}
                      </p>
                    </div>

                    <div className="py-1 text-left">
                      {dbPath && (
                        <Link
                          to={dbPath}
                          onClick={() => setIsAdminOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-gold-dark transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsAdminOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-650 hover:text-slate-900 transition-colors"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gold-border shadow-xl z-50 text-left animate-slide-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Beranda
            </Link>

            {/* Einstein Suite Accordion in Mobile */}
            <div className="py-1 border-t border-b border-slate-100 my-2">
              <button
                onClick={() => setIsMobileSuiteOpen(!isMobileSuiteOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:text-gold transition-colors"
              >
                <span>Einstein Suite</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileSuiteOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileSuiteOpen && (
                <div className="pl-4 pr-3 py-1.5 space-y-2 bg-slate-50 rounded-xl mt-1">
                  <Link
                    to="/sphere"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-semibold"
                  >
                    Einstein Sphere Hub
                  </Link>
                  <div className="grid grid-cols-2 gap-1 pl-2 border-l border-slate-200 py-1">
                    {divisions.map((div) => (
                      <button
                        key={div.key}
                        onClick={() => {
                          handleSphereSelect(div.key);
                          setIsOpen(false);
                        }}
                        className="text-left py-1 text-[11px] text-slate-500 hover:text-gold transition-colors"
                      >
                        {div.label}
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/market"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-medium flex items-center gap-1.5"
                  >
                    Einstein Market
                    {totalQty > 0 && (
                      <span className="bg-gold text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        {totalQty}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/quest"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-medium"
                  >
                    Einstein Quest (Sejarah)
                  </Link>
                  <Link
                    to="/space"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-medium"
                  >
                    Einstein Space (Scan QR)
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/secretariat"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/secretariat' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Secretariat
            </Link>

            <Link
              to="/calendar"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/calendar' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Kalender
            </Link>

            <Link
              to="/mitra"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/mitra' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Mitra
            </Link>

            <Link
              to="/investor"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                location.pathname === '/investor' ? 'bg-slate-50 text-gold font-bold' : 'text-slate-600 hover:text-gold-dark'
              }`}
            >
              Investor
            </Link>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-slate-105">
              {currentUser ? (
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-gold" />
                    </div>
                    <div>
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
