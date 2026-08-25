import React, { useState, useEffect } from 'react';
import { Camera, Calendar, User, GraduationCap, Phone, ShieldCheck, HelpCircle, ArrowRight, QrCode, CheckCircle2, Search, Filter, Layers, Box, Tag, Sparkles, X, Clock, FileText, CheckCheck } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_INVENTORY_ITEMS, INVENTORY_CATEGORIES, INVENTORY_SIZES } from '../data/inventoryData';

export default function Space({ showToast }) {
  const { currentUser } = useAuth();
  const [instruments, setInstruments] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSize, setSelectedSize] = useState('Semua Ukuran');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(25);
  const lastRawDataRef = React.useRef({ instruments: '', reqs: '' });

  useEffect(() => {
    setDisplayLimit(25);
  }, [selectedCategory, selectedSize, selectedStatus, searchQuery]);

  useEffect(() => {
    const CURRENT_DATA_VERSION = 'v2026_rekap_master_140_v2';
    const loadData = () => {
      const savedVersion = localStorage.getItem('hima_inventory_data_version');
      const saved = localStorage.getItem('hima_instruments');

      let shouldReset = false;
      if (!saved || savedVersion !== CURRENT_DATA_VERSION) {
        shouldReset = true;
      } else if (saved !== lastRawDataRef.current.instruments) {
        try {
          const parsed = JSON.parse(saved);
          if (!Array.isArray(parsed) || parsed.length <= 10 || parsed.some(i => !i.id || i.id.startsWith('HIMA-') || !i.category)) {
            shouldReset = true;
          } else {
            lastRawDataRef.current.instruments = saved;
            setInstruments(parsed);
          }
        } catch (e) {
          shouldReset = true;
        }
      }

      if (shouldReset) {
        const defaultStr = JSON.stringify(DEFAULT_INVENTORY_ITEMS);
        localStorage.setItem('hima_instruments', defaultStr);
        localStorage.setItem('hima_inventory_data_version', CURRENT_DATA_VERSION);
        lastRawDataRef.current.instruments = defaultStr;
        setInstruments(DEFAULT_INVENTORY_ITEMS);
      }

      const savedReqs = localStorage.getItem('hima_borrow_requests');
      if (savedReqs && savedReqs !== lastRawDataRef.current.reqs) {
        try {
          lastRawDataRef.current.reqs = savedReqs;
          setBorrowRequests(JSON.parse(savedReqs));
        } catch (e) {
          setBorrowRequests([]);
        }
      } else if (!savedReqs && lastRawDataRef.current.reqs !== '[]') {
        lastRawDataRef.current.reqs = '[]';
        setBorrowRequests([]);
      }
    };

    loadData();

    // Storage and custom live events listener
    const handleLiveSync = () => loadData();
    window.addEventListener('storage', handleLiveSync);
    window.addEventListener('hima_sync_inventory', handleLiveSync);
    window.addEventListener('hima_sync_borrow_requests', handleLiveSync);
    window.addEventListener('hima_sync_all', handleLiveSync);
    window.addEventListener('focus', handleLiveSync);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') loadData();
    });

    let bc;
    try {
      bc = new BroadcastChannel('hima_live_sync_channel');
      bc.onmessage = () => loadData();
    } catch (e) {}

    // Gentle polling fallback (every 4s) only triggering state if raw JSON changed
    const interval = setInterval(loadData, 4000);

    return () => {
      window.removeEventListener('storage', handleLiveSync);
      window.removeEventListener('hima_sync_inventory', handleLiveSync);
      window.removeEventListener('hima_sync_all', handleLiveSync);
      window.removeEventListener('focus', handleLiveSync);
      clearInterval(interval);
      if (bc) bc.close();
    };
  }, []);

  const [activeTab, setActiveTab] = useState('booking'); // 'booking' | 'katalog' | 'status'
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState('');
  const [activeToolName, setActiveToolName] = useState('');
  
  // Reservation Form State
  const [showForm, setShowForm] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [prodi, setProdi] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedToolId, setSelectedToolId] = useState('');
  const [selectedToolName, setSelectedToolName] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !borrowerName) setBorrowerName(currentUser.name);
      if (currentUser.phone && !phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handleSelectTool = (tool) => {
    if (tool.status !== 'Available') {
      showToast(`Alat "${tool.name}" saat ini sedang dipinjam / tidak tersedia.`, 'error');
      return;
    }
    setSelectedToolId(tool.id);
    setSelectedToolName(tool.name);
    setSubmittedSuccess(null);
    setShowForm(true);
    setActiveTab('booking');
    if (currentUser) {
      if (!borrowerName && currentUser.name) setBorrowerName(currentUser.name);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
    }
    showToast(`Alat "${tool.name}" (${tool.id}) dipilih! Formulir siap diisi.`, 'info');
  };

  const handleResetToolSelection = () => {
    setSelectedToolId('');
    setSelectedToolName('');
    setShowForm(false);
    setSubmittedSuccess(null);
    setActiveTab('booking');
  };

  const handleOpenScanner = (tool) => {
    if (tool) {
      setActiveToolId(tool.id);
      setActiveToolName(tool.name);
    } else {
      setActiveToolId('');
      setActiveToolName('');
    }
    setScannerOpen(true);
  };

  const handleScanSuccess = (scannedText) => {
    setScannerOpen(false);
    const cleaned = scannedText.trim();
    // Find matching instrument by ID or name
    const found = instruments.find(
      inst => inst.id.toLowerCase() === cleaned.toLowerCase() ||
              inst.name.toLowerCase() === cleaned.toLowerCase()
    );

    if (found) {
      setSelectedToolId(found.id);
      setSelectedToolName(found.name);
      setSubmittedSuccess(null);
      setShowForm(true);
      setActiveTab('booking');
      showToast(`Scan Berhasil: ${found.name} (${found.id}) terpilih!`, 'success');
    } else {
      setSelectedToolId(cleaned.toUpperCase());
      setSelectedToolName(activeToolName || cleaned);
      setSubmittedSuccess(null);
      setShowForm(true);
      setActiveTab('booking');
      showToast(`Scan Berhasil: Kode ${cleaned} terpilih!`, 'success');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedToolId) {
      showToast('Mohon pilih alat yang ingin dipinjam!', 'error');
      return;
    }

    if (!borrowerName.trim() || !prodi.trim() || !angkatan.trim() || !phone.trim()) {
      showToast('Mohon lengkapi seluruh data peminjam (Nama, Prodi, Angkatan, No. HP)!', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Save borrow request to localStorage
    const newRequest = {
      id: `req-${Date.now()}`,
      borrowerName: borrowerName.trim(),
      prodi: prodi.trim(),
      angkatan: angkatan.trim(),
      phone: phone.trim(),
      borrowerNim: currentUser?.nim || 'Peminjam Umum',
      userEmail: currentUser?.email || 'guest@einsten.com',
      instrumentId: selectedToolId,
      instrumentName: selectedToolName,
      status: 'Pending',
      date: new Date().toLocaleDateString('id-ID')
    };

    const savedRequests = localStorage.getItem('hima_borrow_requests');
    const requests = savedRequests ? JSON.parse(savedRequests) : [];
    const updatedRequests = [newRequest, ...requests];
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedRequests));

    // Instant real-time live sync broadcast
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hima_sync_borrow_requests', { detail: updatedRequests }));
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('hima_live_sync_channel');
        bc.postMessage({ type: 'requests', data: updatedRequests, timestamp: Date.now() });
        bc.close();
      } catch (e) {}
    }

    // Save notifications
    const newNotifications = [];
    if (currentUser) {
      newNotifications.push({
        id: Date.now(),
        recipientEmail: currentUser.email,
        message: `Peminjaman berhasil diajukan! Permohonan peminjaman alat "${selectedToolName}" sedang menunggu persetujuan (ACC) dari Operator Logistik.`,
        read: false,
        timestamp: Date.now()
      });
    }

    // Save notifications for operators
    const savedUsers = localStorage.getItem('hima_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    const operators = (usersList || []).filter(u => u && u.role === 'Operator Logistik');

    if (operators.length === 0) {
      newNotifications.push({
        id: Date.now() + 1,
        recipientEmail: 'Rakan Ibrahim Widjisasono@einsten.com',
        message: `Permohonan Baru! ${borrowerName.trim()} (${prodi.trim()} ${angkatan.trim()}) mengajukan peminjaman alat "${selectedToolName}". Mohon segera ditinjau.`,
        read: false,
        timestamp: Date.now()
      });
    } else {
      operators.forEach((op, index) => {
        if (op.email) {
          newNotifications.push({
            id: Date.now() + 1 + index,
            recipientEmail: op.email,
            message: `Permohonan Baru! ${borrowerName.trim()} (${prodi.trim()} ${angkatan.trim()}) mengajukan peminjaman alat "${selectedToolName}". Mohon segera ditinjau.`,
            read: false,
            timestamp: Date.now()
          });
        }
      });
    }

    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    localStorage.setItem('hima_notifications', JSON.stringify([...notifsList, ...newNotifications]));

    // Construct text message
    const text = `Halo Admin Aset & Logistik hima einsten.com! 📦\n\nAda permohonan peminjaman alat laboratorium baru dari portal Einsten Space:\n- *Nama Alat:* ${selectedToolName}\n- *ID Alat:* ${selectedToolId}\n\n*Data Peminjam:*\n- *Nama:* ${borrowerName.trim()}\n- *Program Studi:* ${prodi.trim()}\n- *Angkatan:* ${angkatan.trim()}\n- *WhatsApp:* ${phone.trim()}\n- *Tanggal Pengajuan:* ${new Date().toLocaleDateString('id-ID')}\n\nMohon konfirmasi & verifikasi permohonan peminjaman. Terima kasih!`;

    // Extract all operator phone numbers
    const DEFAULT_OPERATOR_PHONES = ['6282171748617'];
    const operatorPhones = Array.from(new Set(
      operators
        .map(u => u.phone ? String(u.phone).replace(/[^0-9]/g, '').replace(/^0/, '62') : '')
        .filter(p => p.length >= 9)
    ));

    const targetPhones = operatorPhones.length > 0 ? operatorPhones : DEFAULT_OPERATOR_PHONES;

    // Direct background sending via serverless WhatsApp Gateway API to ALL Operator Logistik numbers
    try {
      await fetch('/api/send-wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phones: targetPhones, 
          message: text 
        })
      });
    } catch (err) {
      // Fallback direct request
      try {
        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': 'oAkLBXzaU41RszNf6j78',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ target: targetPhones.join(','), message: text })
        });
      } catch (e) {
        console.error('WA background send fallback error:', e);
      }
    }

    setIsSubmitting(false);
    setSubmittedSuccess({
      toolName: selectedToolName,
      toolId: selectedToolId,
      borrowerName: borrowerName.trim(),
      prodi: prodi.trim(),
      angkatan: angkatan.trim(),
      phone: phone.trim(),
      operators: operators.filter(o => o.phone),
      chatText: text
    });

    const operatorCountText = targetPhones.length > 1 ? `ke ${targetPhones.length} nomor Operator Logistik` : 'ke WhatsApp Admin Logistik';
    showToast(`Permohonan peminjaman berhasil diajukan & otomatis terkirim ${operatorCountText}!`, 'success');
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Elektronik':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Furniture':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Properti Kegiatan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ATK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'P3K':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DANUS':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Olahraga':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Pemakaian Bersama':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSizeBadgeClass = (size) => {
    switch (size) {
      case 'Besar':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Kecil':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Filtered inventory calculation
  const filteredInstruments = instruments.filter(inst => {
    const matchesCat = selectedCategory === 'Semua' || inst.category === selectedCategory;
    const matchesSize = selectedSize === 'Semua Ukuran' || inst.size === selectedSize;
    const matchesStatus = selectedStatus === 'Semua' 
      ? true 
      : selectedStatus === 'Tersedia' 
        ? inst.status === 'Available' 
        : inst.status !== 'Available';
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      inst.name.toLowerCase().includes(q) || 
      (inst.id && inst.id.toLowerCase().includes(q)) || 
      (inst.category && inst.category.toLowerCase().includes(q)) ||
      (inst.desc && inst.desc.toLowerCase().includes(q));
    return matchesCat && matchesSize && matchesStatus && matchesSearch;
  });

  return (
    <div className="relative pt-24 pb-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-gold/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEN SPACE</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Portal terpadu peminjaman & katalog inventaris aset, logistik, instrumen laboratorium, ATK, P3K, properti dan perlengkapan HIMA EINSTEN.
        </p>
      </div>

      {/* ── TOP TAB NAVIGATION BAR (OPTIMIZED FOR MOBILE & DESKTOP) ── */}
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('booking')}
          className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            activeTab === 'booking'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Calendar className={`w-3.5 h-3.5 ${activeTab === 'booking' ? 'text-gold' : 'text-slate-400'}`} />
          <span>Peminjaman Alat</span>
          {selectedToolId && (
            <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('katalog')}
          className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'katalog'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Box className={`w-3.5 h-3.5 ${activeTab === 'katalog' ? 'text-gold' : 'text-slate-400'}`} />
          <span>Katalog Barang</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-100 text-slate-600">
            {instruments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'status'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${activeTab === 'status' ? 'text-gold' : 'text-slate-400'}`} />
          <span>Status Pinjam</span>
          {borrowRequests.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
              borrowRequests.some(r => r.status === 'Pending')
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {borrowRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: KATALOG BARANG & ASET ── */}
      {activeTab === 'katalog' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Selected item prompt banner if a tool is active */}
          {selectedToolId && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-gold/40 rounded-2xl flex items-center justify-between gap-3 text-left shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gold text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  📦
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Alat Terpilih: <span className="text-gold-dark font-extrabold">{selectedToolName}</span> ({selectedToolId})
                  </p>
                  <p className="text-[10px] text-slate-500">Siap untuk mengisi formulir peminjaman</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className="px-3.5 py-1.5 bg-gold hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                Isi Formulir <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Kategori Fungsi Chips Filter */}
          <div className="bg-white border border-gold-border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gold" /> Kategori Inventaris ({INVENTORY_CATEGORIES.length - 1}):
              </span>
              <span className="text-xs font-medium text-slate-500">
                Menampilkan <strong className="text-slate-900">{filteredInstruments.length}</strong> dari {instruments.length} barang
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {INVENTORY_CATEGORIES.map(cat => {
                const count = cat === 'Semua' ? instruments.length : instruments.filter(i => i.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-gold to-gold-light text-white shadow-md shadow-gold/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-gold/50 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Sub-filters Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              {/* Search Box */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama barang, kode ID, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Dropdowns & Scan */}
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
                >
                  {INVENTORY_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Dipinjam">Sedang Dipinjam / Tidak Tersedia</option>
                </select>

                <button
                  onClick={() => handleOpenScanner(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark font-bold text-xs border border-gold/30 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <QrCode className="w-3.5 h-3.5 text-gold-dark" /> Scan QR
                </button>
              </div>
            </div>
          </div>

          {/* List items container */}
          <div className="bg-white border border-gold-border rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredInstruments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <Box className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Tidak ada barang yang sesuai dengan filter atau pencarian.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSelectedSize('Semua Ukuran');
                    setSelectedStatus('Semua');
                    setSearchQuery('');
                  }}
                  className="text-gold-dark hover:underline font-semibold text-xs"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                {filteredInstruments.slice(0, displayLimit).map((inst) => (
                  <div 
                    key={inst.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-all text-left group"
                  >
                    {/* Tool Image & Details */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http') || inst.image.startsWith('data:')) ? (
                          <img src={inst.image} alt={inst.name} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{inst.image || '📦'}</span>
                        )}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-gold-dark transition-colors">
                            {inst.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[9px] font-bold border border-slate-200">
                            {inst.id}
                          </span>
                          {inst.category && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getCategoryBadgeClass(inst.category)}`}>
                              {inst.category}
                            </span>
                          )}
                          {inst.size && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getSizeBadgeClass(inst.size)}`}>
                              Ukuran: {inst.size}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            inst.status === 'Available' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                              : 'bg-rose-50 text-rose-600 border-rose-500/20'
                          }`}>
                            {inst.status === 'Available' ? 'Tersedia' : 'Tidak Tersedia'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Stok: <strong className="text-slate-800 font-semibold">{inst.quantity || 1} Unit</strong>
                          </span>
                          <span className={`px-2 py-0.5 rounded border ${
                            (inst.condition || 'Baik') === 'Baik' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            Kondisi: <strong className="font-semibold">{inst.condition || 'Baik'}</strong>
                          </span>
                          {inst.desc && (
                            <span className="text-slate-500 font-light truncate max-w-xs">{inst.desc}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {inst.status === 'Available' ? (
                        <>
                          <button 
                            onClick={() => handleSelectTool(inst)}
                            className="px-4 py-2 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
                          >
                            Pinjam Barang
                          </button>
                          <button 
                            onClick={() => handleOpenScanner(inst)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs flex items-center justify-center active:scale-95 transition-all border border-slate-200 cursor-pointer"
                            title="Scan QR Code Alat Ini"
                          >
                            <Camera className="w-4 h-4 text-slate-600" />
                          </button>
                        </>
                      ) : (
                        <button 
                          disabled
                          className="px-4 py-2 bg-slate-100 text-slate-400 font-semibold rounded-xl text-xs cursor-not-allowed border border-slate-200"
                        >
                          Sedang Dipinjam
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Progressive Load More Controls */}
                {filteredInstruments.length > displayLimit && (
                  <div className="p-4 bg-slate-50/80 text-center flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Menampilkan <strong className="text-slate-900 font-bold">{Math.min(displayLimit, filteredInstruments.length)}</strong> dari <strong className="text-slate-900 font-bold">{filteredInstruments.length}</strong> barang
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setDisplayLimit(prev => prev + 30)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                      >
                        Muat Lebih Banyak (+30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisplayLimit(filteredInstruments.length)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold-dark font-bold rounded-xl text-xs border border-gold/30 active:scale-95 transition-all cursor-pointer"
                      >
                        Tampilkan Semua ({filteredInstruments.length})
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: PEMINJAMAN ALAT (FORMULIR BOOKING) ── */}
      {activeTab === 'booking' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-gold-border rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden min-h-[300px] flex flex-col justify-center text-slate-800">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>

            {submittedSuccess ? (
              /* SUCCESS CONFIRMATION CARD */
              <div className="text-center py-4 space-y-4 animate-slide-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                    Permohonan Peminjaman Terkirim
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Permohonan Berhasil Diajukan!
                  </h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Permohonan peminjaman Anda telah tercatat dan otomatis terkirim via WhatsApp ke seluruh Operator Logistik ({submittedSuccess.operators?.length || 1} operator) untuk ditinjau & di-ACC.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Alat Lab / Barang:</span>
                    <span className="font-bold text-slate-800">{submittedSuccess.toolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Peminjam:</span>
                    <span className="font-bold text-slate-800">{submittedSuccess.borrowerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Prodi / Angkatan:</span>
                    <span className="text-slate-700">{submittedSuccess.prodi} ({submittedSuccess.angkatan})</span>
                  </div>
                </div>

                {submittedSuccess.operators && submittedSuccess.operators.length > 0 && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Kontak WhatsApp Operator Logistik:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {submittedSuccess.operators.map((op, idx) => {
                        const cleanPhone = (op.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
                        return (
                          <a
                            key={idx}
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(submittedSuccess.chatText || '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-between px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 transition-all shadow-2xs"
                          >
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              {op.name}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 font-normal">
                              {op.phone} ↗
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedSuccess(null);
                      setShowForm(false);
                      setSelectedToolId('');
                      setSelectedToolName('');
                      setActiveTab('katalog');
                    }}
                    className="flex-1 py-2.5 bg-gold hover:brightness-110 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
                  >
                    Pinjam Alat Lain
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('status')}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs active:scale-95 transition-all border border-slate-200 cursor-pointer"
                  >
                    Lihat Status Permohonan
                  </button>
                </div>
              </div>
            ) : showForm && selectedToolId ? (
              /* FORMULIR PEMINJAMAN */
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                      Formulir Peminjaman
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Konfirmasi Data Peminjam
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToolSelection}
                    className="text-xs font-semibold text-gold-dark hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Ganti Alat ↺
                  </button>
                </div>

                <div className="p-3.5 bg-gold/5 border border-gold/30 rounded-xl space-y-0.5 text-left">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Alat / Barang Yang Dipilih:</span>
                  <p className="text-sm font-bold text-gold-dark truncate">{selectedToolName}</p>
                  <p className="text-[10px] font-mono text-slate-500 font-bold">ID: {selectedToolId}</p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={borrowerName}
                      onChange={(e) => setBorrowerName(e.target.value)}
                      placeholder="Masukkan nama peminjam"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Program Studi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={prodi}
                      onChange={(e) => setProdi(e.target.value)}
                      placeholder="Contoh: D4 Elektronika Instrumentasi"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Angkatan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={angkatan}
                      onChange={(e) => setAngkatan(e.target.value)}
                      placeholder="Contoh: 2024"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={handleResetToolSelection}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Ganti / Scan Ulang
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 shadow-gold/20 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Pinjam Sekarang'} <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </form>
            ) : (
              /* PROMPT JIKA BELUM ADA ALAT DIPILIH */
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-gold/10 text-gold-dark rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <QrCode className="w-8 h-8 text-gold-dark" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-extrabold text-slate-900">Peminjaman & Booking Alat</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Silakan gunakan kamera HP untuk scan barcode pada alat atau pilih alat yang tersedia dari katalog inventaris.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenScanner(null)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-white" /> Scan QR Barcode Alat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('katalog')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 active:scale-95 transition-all cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-slate-600" /> Buka Katalog Barang ({instruments.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: STATUS & RIWAYAT PEMINJAMAN ── */}
      {activeTab === 'status' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-gold-border rounded-2xl p-5 sm:p-7 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] text-gold-dark font-bold tracking-widest uppercase">
                  <Clock className="w-3.5 h-3.5 text-gold" /> STATUS PERMOHONAN REAL-TIME
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Status & Riwayat Peminjaman Mahasiswa
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono">
                {borrowRequests.length} Permohonan
              </span>
            </div>

            {borrowRequests.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Belum ada riwayat permohonan</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Permohonan peminjaman yang Anda ajukan akan muncul di sini secara real-time beserta status persetujuan (ACC) dari Operator Logistik.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('katalog')}
                  className="mt-2 px-4 py-2 bg-gold hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" /> Ajukan Peminjaman Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {borrowRequests.map((req) => {
                  const isPending = req.status === 'Pending';
                  const isApproved = req.status === 'Approved';
                  const isRejected = req.status === 'Rejected';
                  const isReturned = req.status === 'Returned';

                  return (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs'
                          : isPending
                          ? 'bg-amber-50/40 border-amber-300/80 shadow-2xs'
                          : isRejected
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{req.instrumentName}</h4>
                          <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                            {req.instrumentId}
                          </span>
                        </div>
                        
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 border inline-flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                          {isApproved ? 'Disetujui (ACC)' : isPending ? 'Menunggu ACC' : isRejected ? 'Ditolak' : 'Sudah Kembali'}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Peminjam: <strong className="text-slate-700">{req.borrowerName}</strong></span>
                        <span className="font-mono">{req.date}</span>
                      </div>

                      {isApproved && (
                        <div className="mt-2 p-2.5 bg-emerald-100/70 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Disetujui! Silakan ambil alat di Laboratorium / Ruang HIMA.</span>
                        </div>
                      )}

                      {isPending && (
                        <div className="mt-2 p-2.5 bg-amber-100/70 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Permohonan sedang menunggu persetujuan (ACC) Operator.</span>
                        </div>
                      )}

                      {isReturned && (
                        <div className="mt-2 p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-1.5">
                          <CheckCheck className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Alat telah berhasil dikembalikan ke inventaris.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barcode Web camera Scanner Modal */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        activeToolId={activeToolId}
        activeToolName={activeToolName}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
