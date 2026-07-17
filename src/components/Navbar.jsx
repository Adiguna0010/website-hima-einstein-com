import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield, 
  ShoppingBag, Compass, History, Cpu, Bell, MessageSquare, Send, ArrowLeft, Trash2, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalQty } = useCart();

  const normalizeEmail = (emailStr) => {
    if (!emailStr) return '';
    return emailStr
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/einsten\.com$/, 'einsten.com');
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileSuiteOpen, setIsMobileSuiteOpen] = useState(false);
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  
  const suiteRef = useRef(null);
  const adminRef = useRef(null);
  const notifRef = useRef(null);
  const chatRef = useRef(null);

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
    setIsNotifOpen(false);
  }, [location]);

  // Load notifications from localStorage
  const loadNotifications = () => {
    if (currentUser) {
      const saved = localStorage.getItem('hima_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter(n => normalizeEmail(n.recipientEmail) === normalizeEmail(currentUser.email));
        // Sort newest first
        filtered.sort((a, b) => b.id - a.id);
        setNotifications(filtered);
      }
    } else {
      setNotifications([]);
    }
  };

  // Load chat contacts and messages
  const loadChats = () => {
    const savedUsers = localStorage.getItem('hima_users');
    if (savedUsers && currentUser) {
      const parsedUsers = JSON.parse(savedUsers);
      const list = parsedUsers.filter(u => normalizeEmail(u.email) !== normalizeEmail(currentUser.email));
      setChatUsers(list);
    }

    if (currentUser && activeChat) {
      const savedMsgs = localStorage.getItem('hima_chats');
      if (savedMsgs) {
        const parsedMsgs = JSON.parse(savedMsgs);
        const filtered = parsedMsgs.filter(m => 
          (normalizeEmail(m.sender) === normalizeEmail(currentUser.email) && normalizeEmail(m.recipient) === normalizeEmail(activeChat.email)) ||
          (normalizeEmail(m.sender) === normalizeEmail(activeChat.email) && normalizeEmail(m.recipient) === normalizeEmail(currentUser.email))
        );
        setChatMessages(filtered);

        // Update read timestamp for active chat to dismiss unread indicators
        const savedReadTimes = localStorage.getItem('hima_chats_read_timestamps');
        const readTimes = savedReadTimes ? JSON.parse(savedReadTimes) : {};
        readTimes[normalizeEmail(activeChat.email)] = Date.now();
        localStorage.setItem('hima_chats_read_timestamps', JSON.stringify(readTimes));
      } else {
        setChatMessages([]);
      }
    }
  };

  const getRecentConversations = () => {
    if (!currentUser) return [];
    
    const savedChats = localStorage.getItem('hima_chats');
    const allMsgs = savedChats ? JSON.parse(savedChats) : [];
    
    const savedReadTimes = localStorage.getItem('hima_chats_read_timestamps');
    const readTimes = savedReadTimes ? JSON.parse(savedReadTimes) : {};
    
    // Find all unique participants we have chatted with
    const participantsMap = {}; // normalizedEmail -> latestMessage
    
    allMsgs.forEach(msg => {
      const senderNorm = normalizeEmail(msg.sender);
      const recipientNorm = normalizeEmail(msg.recipient);
      const currentNorm = normalizeEmail(currentUser.email);
      
      if (senderNorm === currentNorm) {
        participantsMap[recipientNorm] = msg;
      } else if (recipientNorm === currentNorm) {
        participantsMap[senderNorm] = msg;
      }
    });
    
    const list = Object.keys(participantsMap).map(emailNorm => {
      const user = chatUsers.find(u => normalizeEmail(u.email) === emailNorm);
      const lastMsg = participantsMap[emailNorm];
      const lastReadTime = readTimes[emailNorm] || 0;
      const isUnread = normalizeEmail(lastMsg.sender) !== normalizeEmail(currentUser.email) && lastMsg.timestamp > lastReadTime;
      
      return {
        user: user || { name: emailNorm, email: emailNorm, role: 'Pengguna' },
        lastMsg,
        isUnread
      };
    });
    
    list.sort((a, b) => b.lastMsg.timestamp - a.lastMsg.timestamp);
    return list;
  };

  const getUnreadChatCount = () => {
    const list = getRecentConversations();
    return list.filter(c => c.isUnread).length;
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    loadChats();
    const chatInterval = setInterval(loadChats, 3000);
    return () => clearInterval(chatInterval);
  }, [currentUser, activeChat]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const saved = localStorage.getItem('hima_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      const updated = parsed.map(n => {
        if (n.recipientEmail?.toLowerCase() === currentUser.email?.toLowerCase()) {
          return { ...n, read: true };
        }
        return n;
      });
      localStorage.setItem('hima_notifications', JSON.stringify(updated));
      loadNotifications();
    }
  };

  const handleClearNotifs = () => {
    const saved = localStorage.getItem('hima_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      const updated = parsed.filter(n => n.recipientEmail?.toLowerCase() !== currentUser.email?.toLowerCase());
      localStorage.setItem('hima_notifications', JSON.stringify(updated));
      loadNotifications();
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat || !currentUser) return;

    const newMsg = {
      id: Date.now(),
      sender: currentUser.email,
      recipient: activeChat.email,
      message: chatInput.trim(),
      timestamp: Date.now()
    };

    const savedMsgs = localStorage.getItem('hima_chats');
    const msgsList = savedMsgs ? JSON.parse(savedMsgs) : [];
    msgsList.push(newMsg);
    localStorage.setItem('hima_chats', JSON.stringify(msgsList));

    setChatInput('');
    loadChats();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (suiteRef.current && !suiteRef.current.contains(event.target)) {
        setIsSuiteOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setIsAdminOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsChatOpen(false);
    setActiveChat(null);
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
              alt="HIMPUNAN EINSTEN.COM Logo" 
              className="h-14 sm:h-18 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/ffffff/000000?text=EINSTEN";
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

            {/* Einsten Suite Mega-Dropdown */}
            <div className="relative" ref={suiteRef}>
              <button
                onClick={() => setIsSuiteOpen(!isSuiteOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  ['/sphere', '/market', '/quest', '/space'].some(p => location.pathname.startsWith(p))
                    ? 'text-gold font-bold' 
                    : 'text-slate-600 hover:text-gold-dark font-medium'
                }`}
              >
                Einsten Suite 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSuiteOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSuiteOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[560px] rounded-2xl bg-white border border-gold-border shadow-xl p-5 z-50 animate-slide-in grid grid-cols-12 gap-5 text-left">
                  
                  {/* Left Column: Einsten Sphere Divisions */}
                  <div className="col-span-6 border-r border-slate-100 pr-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-850 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3 font-bold">
                      <Compass className="w-4 h-4 text-gold" />
                      <span>Einsten Sphere</span>
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
                      {/* Einsten Market */}
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
                            Einsten Market
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

                      {/* Einsten Quest */}
                      <Link 
                        to="/quest" 
                        onClick={() => setIsSuiteOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 group-hover:border-gold/20 group-hover:bg-gold/5">
                          <History className="w-4 h-4 text-slate-600 group-hover:text-gold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Einsten Quest</h4>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">
                            Linimasa sejarah, dokumentasi & alumni.
                          </p>
                        </div>
                      </Link>

                      {/* Einsten Space */}
                      <Link 
                        to="/space" 
                        onClick={() => setIsSuiteOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 group-hover:border-gold/20 group-hover:bg-gold/5">
                          <Cpu className="w-4 h-4 text-slate-600 group-hover:text-gold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Einsten Space</h4>
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
            {/* Instansi Penaung Logos (BRIN & Poltek Nuklir) */}
            <div className="flex items-center gap-3 border-r border-slate-200 pr-4 mr-2 h-7 shrink-0">
              <img 
                src="/Media/Logo Instansi/logo brin warna_landscape.jpg" 
                alt="Logo BRIN" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x25/ffffff/000000?text=BRIN";
                }}
              />
              <img 
                src="/Media/Logo Instansi/Logo Poltek (benar).png" 
                alt="Logo Poltek Nuklir" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x25/ffffff/000000?text=Poltek+Nuklir";
                }}
              />
            </div>
            
            {currentUser && (
              <div className="relative mr-1.5" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-all active:scale-95 relative cursor-pointer"
                  title="Notifikasi"
                >
                  <Bell className="w-4 h-4 text-gold-dark animate-none" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-white border border-gold-border shadow-xl py-2.5 z-55 animate-slide-in">
                    <div className="px-4 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-850 uppercase tracking-wider">Notifikasi Akun</p>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-[9px] text-gold-dark hover:underline font-bold">Baca Semua</button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={handleClearNotifs} className="text-[9px] text-rose-600 hover:underline font-bold font-mono">Hapus</button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mt-2 px-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-[10px] text-slate-400">Belum ada notifikasi.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-2 rounded-xl text-[10px] leading-relaxed transition-colors mb-1 ${!n.read ? 'bg-gold/5 font-bold text-slate-900 border-l-2 border-gold' : 'text-slate-500'}`}>
                            <p>{n.message}</p>
                            <span className="text-[8px] text-slate-400 font-mono mt-1 block">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser && (
              <div className="relative mr-1.5" ref={chatRef}>
                <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-650 hover:text-slate-800 transition-all active:scale-95 relative cursor-pointer"
                  title="Einsten Chat"
                >
                  <MessageSquare className="w-4 h-4 text-gold-dark" />
                  {getUnreadChatCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {getUnreadChatCount()}
                    </span>
                  )}
                </button>

                {isChatOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 h-[380px] bg-white border border-gold-border shadow-xl flex flex-col overflow-hidden rounded-2xl z-55 animate-slide-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gold to-gold-light text-white px-4 py-2.5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <MessageCircle className="w-4 h-4 text-white" />
                        <span>Einsten Messenger</span>
                      </div>
                      {activeChat && (
                        <button 
                          onClick={() => setActiveChat(null)}
                          className="px-2 py-0.5 rounded bg-white/20 text-[9px] hover:bg-white/30 text-white font-bold transition-all"
                        >
                          Kembali
                        </button>
                      )}
                      <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {/* Recipient Selector (To: email) - Gmail style */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 text-[10px] shrink-0 bg-slate-50/50">
                      <span className="text-slate-400 font-bold font-sans">Kepada:</span>
                      <select 
                        value={activeChat ? activeChat.email : ''}
                        onChange={(e) => {
                          const selectedUser = chatUsers.find(u => u.email === e.target.value);
                          setActiveChat(selectedUser || null);
                        }}
                        className="flex-1 bg-transparent focus:outline-none font-bold text-slate-700 text-[10px] py-0.5 cursor-pointer font-sans"
                      >
                        <option value="">-- Tulis / Pilih Email Penerima --</option>
                        {chatUsers.map(user => (
                          <option key={user.email} value={user.email}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-2.5 bg-slate-50 space-y-2">
                      {!activeChat ? (
                        /* RECENT CONVERSATIONS LIST */
                        <div className="space-y-1.5 text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1.5 mb-1.5">Percakapan Terbaru</p>
                          {getRecentConversations().length === 0 ? (
                            <div className="text-center py-16 space-y-2 text-slate-400">
                              <MessageCircle className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
                              <p className="text-[10px] leading-normal px-4 font-light">
                                Belum ada obrolan. Pilih email kontak di atas untuk memulai percakapan internal.
                              </p>
                            </div>
                          ) : (
                            getRecentConversations().map(({ user, lastMsg, isUnread }) => (
                              <div
                                key={user.email}
                                onClick={() => setActiveChat(user)}
                                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  isUnread 
                                    ? 'bg-emerald-50/50 border-emerald-300/40 hover:bg-emerald-50 shadow-sm' 
                                    : 'bg-white border-slate-200 hover:border-gold hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 relative">
                                    {user.photo ? (
                                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <User className="w-4 h-4 text-gold" />
                                    )}
                                    {isUnread && (
                                      <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className={`text-[10px] truncate max-w-[120px] ${isUnread ? 'font-extrabold text-slate-900' : 'font-bold text-slate-800'}`}>
                                        {user.name}
                                      </h5>
                                      <span className="text-[7px] text-slate-450 font-mono shrink-0">
                                        {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className={`text-[9px] truncate ${isUnread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                      {lastMsg.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {chatMessages.length === 0 ? (
                            <p className="text-center py-16 text-[9px] text-slate-400 italic">Belum ada percakapan. Kirim pesan pertama!</p>
                          ) : (
                            chatMessages.map((msg) => {
                              const isSelf = normalizeEmail(msg.sender) === normalizeEmail(currentUser.email);
                              return (
                                <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-2xl px-2.5 py-1.5 text-[10px] leading-relaxed shadow-sm ${
                                    isSelf 
                                      ? 'bg-gold text-white rounded-tr-none' 
                                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                  }`}>
                                    <p>{msg.message}</p>
                                    <span className={`text-[7px] block mt-0.5 text-right ${isSelf ? 'text-white/70' : 'text-slate-450'}`}>
                                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Chat Input Footer */}
                    {activeChat && (
                      <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5 shrink-0">
                        <input
                          type="text"
                          required
                          placeholder="Tulis pesan..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] text-slate-850 focus:outline-none focus:border-gold"
                        />
                        <button type="submit" className="p-1.5 bg-gold hover:bg-gold-light text-white rounded-xl active:scale-95 transition-all">
                          <Send className="w-3 h-3 text-white" />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-gold-border rounded-xl px-3 py-1.5 pl-2 relative" ref={adminRef}>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gold/10 border border-gold/20 flex items-center justify-center cursor-pointer" onClick={() => setIsAdminOpen(!isAdminOpen)}>
                  {currentUser.photo ? (
                    <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-gold" />
                  )}
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

            {/* Einsten Suite Accordion in Mobile */}
            <div className="py-1 border-t border-b border-slate-100 my-2">
              <button
                onClick={() => setIsMobileSuiteOpen(!isMobileSuiteOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:text-gold transition-colors"
              >
                <span>Einsten Suite</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileSuiteOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileSuiteOpen && (
                <div className="pl-4 pr-3 py-1.5 space-y-2 bg-slate-50 rounded-xl mt-1">
                  <Link
                    to="/sphere"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-semibold"
                  >
                    Einsten Sphere Hub
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
                    Einsten Market
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
                    Einsten Quest (Sejarah)
                  </Link>
                  <Link
                    to="/space"
                    className="block py-1 text-xs text-slate-600 hover:text-gold font-medium"
                  >
                    Einsten Space (Scan QR)
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
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gold/10 border border-gold/20 flex items-center justify-center">
                      {currentUser.photo ? (
                        <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gold" />
                      )}
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
