import React, { useState, useEffect } from 'react';
import { Camera, Calendar, User, GraduationCap, Phone, ShieldCheck, HelpCircle, ArrowRight, QrCode, CheckCircle2 } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import { useAuth } from '../context/AuthContext';

export default function Space({ showToast }) {
  const { currentUser } = useAuth();
  const DEFAULT_INSTRUMENTS = [
    {
      id: 'HIMA-ARDU-001',
      name: 'Arduino Uno R3',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Arduino Uno.webp',
      desc: 'Papan mikrokontroler berbasis ATmega328P untuk pengembangan IoT dan elektronika dasar.'
    },
    {
      id: 'HIMA-GERI-002',
      name: 'Mesin Gerinda Tangan',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Gerinda.png',
      desc: 'Mesin gerinda listrik pemotong logam, kayu, atau penghalus material proyek mekanik.'
    },
    {
      id: 'HIMA-SOLD-003',
      name: 'Solder Listrik',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Solder.jpg',
      desc: 'Solder tangan dengan pemanas cepat untuk perakitan dan penyolderan komponen kelistrikan.'
    },
    {
      id: 'HIMA-TIMA-004',
      name: 'Timah Solder (Roll)',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Timah.jpg',
      desc: 'Kawat timah penyambung komponen elektro berkadar rosin flux optimal.'
    },
    {
      id: 'HIMA-BOR-005',
      name: 'Mesin Bor Tangan (Bor)',
      status: 'Available',
      image: '📦',
      desc: 'Alat bor tangan listrik serbaguna untuk melubangi PCB, logam, dan kayu praktikum.'
    }
  ];

  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('hima_instruments');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check if default instruments are missing in user storage
          const existingIds = new Set(parsed.map(i => i.id.toUpperCase()));
          const missingDefaults = DEFAULT_INSTRUMENTS.filter(d => !existingIds.has(d.id.toUpperCase()));
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults];
            localStorage.setItem('hima_instruments', JSON.stringify(merged));
            setInstruments(merged);
          } else {
            setInstruments(parsed);
          }
        } catch (e) {
          localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
          setInstruments(DEFAULT_INSTRUMENTS);
        }
      } else {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
        setInstruments(DEFAULT_INSTRUMENTS);
      }
    };

    loadData();

    // Storage event listener for multi-tab real-time sync
    const handleStorageChange = (e) => {
      if (e.key === 'hima_instruments') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadData);
    };
  }, []);

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
    setSelectedToolId(tool.id);
    setSelectedToolName(tool.name);
    setSubmittedSuccess(null);
    setShowForm(true);
    if (currentUser) {
      if (!borrowerName && currentUser.name) setBorrowerName(currentUser.name);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
    }
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
      showToast(`Scan Berhasil: ${found.name} (${found.id}) terpilih!`, 'success');
    } else {
      setSelectedToolId(cleaned.toUpperCase());
      setSelectedToolName(activeToolName || cleaned);
      setSubmittedSuccess(null);
      setShowForm(true);
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

    const savedUsers = localStorage.getItem('hima_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    const operators = usersList.filter(u => u.role === 'Operator Logistik');

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
        newNotifications.push({
          id: Date.now() + 1 + index,
          recipientEmail: op.email,
          message: `Permohonan Baru! ${borrowerName.trim()} (${prodi.trim()} ${angkatan.trim()}) mengajukan peminjaman alat "${selectedToolName}". Mohon segera ditinjau.`,
          read: false,
          timestamp: Date.now()
        });
      });
    }

    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    localStorage.setItem('hima_notifications', JSON.stringify([...notifsList, ...newNotifications]));

    // Construct text message
    const text = `Halo Admin Aset & Logistik hima einsten.com! 📦\n\nAda permohonan peminjaman alat laboratorium baru dari portal Einsten Space:\n- *Nama Alat:* ${selectedToolName}\n- *ID Alat:* ${selectedToolId}\n\n*Data Peminjam:*\n- *Nama:* ${borrowerName.trim()}\n- *Program Studi:* ${prodi.trim()}\n- *Angkatan:* ${angkatan.trim()}\n- *WhatsApp:* ${phone.trim()}\n- *Tanggal Pengajuan:* ${new Date().toLocaleDateString('id-ID')}\n\nMohon konfirmasi & verifikasi permohonan peminjaman. Terima kasih!`;
    const waNumber = '6282171748617';

    // Direct background sending via serverless WhatsApp Gateway API (No browser redirect/popup)
    try {
      await fetch('/api/send-wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: waNumber, message: text })
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
          body: new URLSearchParams({ target: waNumber, message: text })
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
      phone: phone.trim()
    });

    showToast('Permohonan peminjaman berhasil diajukan & otomatis terkirim ke WhatsApp Admin Logistik!', 'success');
  };

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-gold/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Layanan Praktikum & Riset</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEN SPACE</h1>
        <p className="text-slate-555 text-xs sm:text-sm leading-relaxed font-light">
          Portal peminjaman instrumen laboratorium elektronika milik Himpunan. Scan Barcode/QR Code pada alat fisik atau pilih alat untuk pengisian formulir peminjaman instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Instruments status board in LIST VIEW */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Daftar Ketersediaan Alat
            </h3>
            
            {/* Quick General Scan Button */}
            <button
              onClick={() => handleOpenScanner(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark font-bold text-xs border border-gold/30 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <QrCode className="w-4 h-4 text-gold-dark" /> Scan QR / Barcode Fisik
            </button>
          </div>

          {/* List items container */}
          <div className="bg-white border border-gold-border rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
            {instruments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">Belum ada alat laboratorium yang terdaftar.</div>
            ) : (
              instruments.map((inst) => (
                <div 
                  key={inst.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-all text-left group"
                >
                  {/* Tool Image & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http') || inst.image.startsWith('data:')) ? (
                        <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{inst.image || '📦'}</span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-gold-dark transition-colors truncate">
                          {inst.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-bold border border-slate-200">
                          {inst.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          inst.status === 'Available' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                            : 'bg-rose-50 text-rose-600 border-rose-500/20'
                        }`}>
                          {inst.status === 'Available' ? 'Tersedia' : 'Sedang Dipinjam'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                        {inst.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {inst.status === 'Available' ? (
                      <>
                        <button 
                          onClick={() => handleSelectTool(inst)}
                          className="px-4 py-2 bg-gold hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
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
              ))
            )}
          </div>
        </div>

        {/* Right Column: Reservation form */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5">
            <Calendar className="w-4.5 h-4.5 text-gold" /> Formulir Booking
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden min-h-[250px] flex flex-col justify-center text-slate-800">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>

            {submittedSuccess ? (
              /* SUCCESS CONFIRMATION CARD (No external browser redirect) */
              <div className="text-center py-4 space-y-4 animate-slide-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                    Otomatis Terkirim ke WhatsApp
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Permohonan Berhasil Diajukan!
                  </h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Pemberitahuan peminjaman telah <strong>langsung dikirimkan ke WhatsApp Admin Aset & Logistik (+62 821-7174-8617)</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Alat Lab:</span>
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

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSuccess(null);
                    setShowForm(false);
                  }}
                  className="w-full py-2.5 bg-gold hover:brightness-110 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
                >
                  Pinjam Alat Lain
                </button>
              </div>
            ) : showForm ? (
              <form onSubmit={handleReservationSubmit} className="space-y-3.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5 text-left">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Alat Yang Dipilih</span>
                  <p className="text-xs font-bold text-gold-dark truncate">{selectedToolName}</p>
                  <p className="text-[9px] font-mono text-slate-500">{selectedToolId}</p>
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
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
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
              <div className="text-center py-8 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Belum ada alat laboratorium yang dipilih. Silakan klik tombol <strong className="text-slate-800 font-bold">Pinjam Barang</strong> pada alat yang ingin dipinjam terlebih dahulu.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

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
