import React, { useState, useEffect } from 'react';
import { Box, ToggleLeft, ToggleRight, Radio, ShieldCheck, Plus, Trash2, UserCheck, UserX, Users, FileText } from 'lucide-react';

export default function LogistikDashboard({ showToast }) {
  const [instruments, setInstruments] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Form states for new instrument
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formKey, setFormKey] = useState(Date.now());

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
    }
  ];

  useEffect(() => {
    const loadData = () => {
      // Load instruments
      const savedInst = localStorage.getItem('hima_instruments');
      if (savedInst && (savedInst.includes('HIMA-MULT-002') || savedInst.includes('HIMA-ARDU-011'))) {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
        setInstruments(DEFAULT_INSTRUMENTS);
      } else if (savedInst) {
        setInstruments(JSON.parse(savedInst));
      } else {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
        setInstruments(DEFAULT_INSTRUMENTS);
      }

      // Load borrow requests
      const savedReqs = localStorage.getItem('hima_borrow_requests');
      if (savedReqs) {
        setBorrowRequests(JSON.parse(savedReqs));
      } else {
        setBorrowRequests([]);
      }
    };

    loadData();

    // Storage event listener for multi-tab real-time sync
    const handleStorageChange = (e) => {
      if (e.key === 'hima_instruments' || e.key === 'hima_borrow_requests') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggleStatus = (id) => {
    const updated = instruments.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === 'Available' ? 'Borrowed' : 'Available';
        return { ...inst, status: nextStatus };
      }
      return inst;
    });
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));
    showToast(`Status alat ${id} berhasil diubah!`, 'success');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast('Ukuran foto terlalu besar! Maksimal 1MB.', 'error');
        e.target.value = null;
        setNewImage('');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterInstrument = (e) => {
    e.preventDefault();
    if (!newName || !newId) {
      showToast('Nama Alat dan Kode ID wajib diisi!', 'error');
      return;
    }
    if (!newImage) {
      showToast('Foto alat wajib diupload!', 'error');
      return;
    }

    const idExists = instruments.some(inst => inst.id.toLowerCase() === newId.toLowerCase());
    if (idExists) {
      showToast(`Kode ID ${newId} sudah digunakan!`, 'error');
      return;
    }

    const newInstrument = {
      id: newId.toUpperCase(),
      name: newName,
      status: 'Available',
      image: newImage,
      desc: newDesc || 'Tidak ada deskripsi.'
    };

    const updated = [...instruments, newInstrument];
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));

    // Reset Form
    setNewName('');
    setNewId('');
    setNewImage('');
    setNewDesc('');
    setFormKey(Date.now());
    showToast(`Alat ${newName} berhasil didaftarkan!`, 'success');
  };

  const handleDeleteInstrument = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus alat ${id} dari inventaris?`)) {
      const updated = instruments.filter(inst => inst.id !== id);
      setInstruments(updated);
      localStorage.setItem('hima_instruments', JSON.stringify(updated));
      showToast(`Alat ${id} berhasil dihapus!`, 'success');
    }
  };

  const handleApproveRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    // Update Request Status to Approved
    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Approved' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    // Update Instrument Status to Borrowed
    const updatedInsts = instruments.map(inst => 
      inst.id === req.instrumentId ? { ...inst, status: 'Borrowed' } : inst
    );
    setInstruments(updatedInsts);
    localStorage.setItem('hima_instruments', JSON.stringify(updatedInsts));

    // Send notification bell alert to borrower
    const newNotification = {
      id: Date.now(),
      recipientEmail: req.userEmail || 'guest@einsten.com',
      message: `Peminjaman alat "${req.instrumentName}" Anda telah DISETUJUI (ACC) oleh Operator Logistik! Silakan ambil alat di Laboratorium.`,
      read: false,
      timestamp: Date.now()
    };
    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    notifsList.push(newNotification);
    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} disetujui (ACC)!`, 'success');
  };

  const handleRejectRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    // Update Request Status to Rejected
    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Rejected' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} ditolak.`, 'info');
  };

  const handleDeleteRequest = (reqId) => {
    const updatedReqs = borrowRequests.filter(r => r.id !== reqId);
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));
    showToast('Riwayat permohonan berhasil dihapus.', 'success');
  };

  // Stats calculation
  const activeBorrowersCount = new Set(
    borrowRequests
      .filter(r => r.status === 'Approved')
      .map(r => r.borrowerNim)
  ).size;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <Box className="w-3.5 h-3.5 text-gold" /> LOGISTIK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Logistics Inventory & Borrowing Control
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan inventaris alat laboratorium otonom, approval peminjaman mahasiswa, dan monitoring logistik.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Total Inventaris</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">{instruments.length} Unit Alat</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Sedang Dipinjam</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {instruments.filter(i => i.status === 'Borrowed').length} Unit
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Peminjam Aktif</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {activeBorrowersCount} Orang
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid split: Left lists, Right forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Inventory & Borrow requests */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Inventory list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-4 h-4 text-gold" /> Daftar Inventaris Alat
            </h3>
            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Alat Lab</th>
                      <th className="px-6 py-4">Kode ID</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-750">
                    {instruments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Belum ada alat terdaftar.</td>
                      </tr>
                    ) : (
                      instruments.map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http')) ? (
                              <img src={inst.image} alt={inst.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                            ) : (
                              <span className="text-2xl">{inst.image || '📦'}</span>
                            )}
                            <div>
                              <p className="font-bold text-slate-800">{inst.name}</p>
                              <p className="text-[10px] text-slate-500 font-light truncate max-w-[250px]">{inst.desc}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">{inst.id}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              inst.status === 'Available' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                                : 'bg-rose-50 text-rose-600 border-rose-500/20'
                            }`}>
                              {inst.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(inst.id)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                                  inst.status === 'Available'
                                    ? 'bg-rose-50 text-rose-600 border-rose-500/20 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-500/20 hover:bg-emerald-100'
                                }`}
                                title={inst.status === 'Available' ? 'Set Dipinjam' : 'Set Tersedia'}
                              >
                                {inst.status === 'Available' ? (
                                  <>
                                    <ToggleLeft className="w-3.5 h-3.5 text-rose-600" /> Dipinjam
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> Tersedia
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteInstrument(inst.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all active:scale-95"
                                title="Hapus Alat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Borrow requests approval list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gold" /> Permohonan Peminjaman (ACC Otoritas)
            </h3>
            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Peminjam</th>
                      <th className="px-6 py-4">Alat Lab</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-750">
                    {borrowRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Belum ada permohonan peminjaman masuk.</td>
                      </tr>
                    ) : (
                      borrowRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{req.borrowerName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">NIM: {req.borrowerNim}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{req.instrumentName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {req.instrumentId}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-light">{req.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                              req.status === 'Pending'
                                ? 'bg-amber-50 text-amber-600 border-amber-500/20'
                                : req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20'
                                : 'bg-rose-50 text-rose-600 border-rose-500/20'
                            }`}>
                              {req.status === 'Pending' ? 'Menunggu ACC' : req.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {req.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 border border-emerald-500/25 hover:bg-emerald-500 hover:text-white transition-all text-emerald-600 font-bold rounded-xl text-[10px] active:scale-95"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> ACC
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-500/25 hover:bg-rose-500 hover:text-white transition-all text-rose-600 font-bold rounded-xl text-[10px] active:scale-95"
                                  >
                                    <UserX className="w-3.5 h-3.5" /> Tolak
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-all text-slate-500 font-semibold rounded-xl text-[10px] active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Register form */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-gold" /> Daftarkan Alat Baru
          </h3>
          <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
            
            <form onSubmit={handleRegisterInstrument} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Nama Alat Lab</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Oscilloscope GW Instek"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Kode ID Inventaris</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: HIMA-OSCI-001"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-850 focus:outline-none focus:border-gold font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Foto Alat (Upload)</label>
                <div className="flex flex-col gap-2">
                  <input 
                    key={formKey}
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                  />
                  {newImage && (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden mt-1 bg-slate-50 flex items-center justify-center">
                      <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Deskripsi Singkat</label>
                <textarea 
                  placeholder="Tulis spesifikasi singkat atau kegunaan alat..."
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-850 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-white" /> Daftarkan Alat
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
