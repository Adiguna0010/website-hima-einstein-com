import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ShieldCheck, FileText, Download, CheckCircle, XCircle, Users, Activity } from 'lucide-react';

export default function RistekDashboard({ showToast }) {
  const [vaultItems, setVaultItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('vault');

  // Vault form state
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('Dokumen');
  const [url, setUrl] = useState('');

  const DEFAULT_VAULT = [
    { id: 1, title: 'UTS: Mikroprosesor & Mikrokontroler', size: '2.4 MB', type: 'Dokumen', url: '#' },
    { id: 2, title: 'Modul Praktikum: Detektor Radiasi Nuklir', size: '4.8 MB', type: 'Dokumen', url: '#' }
  ];

  useEffect(() => {
    // Load Vault Items
    const savedVault = localStorage.getItem('hima_vault');
    if (savedVault) {
      setVaultItems(JSON.parse(savedVault));
    } else {
      localStorage.setItem('hima_vault', JSON.stringify(DEFAULT_VAULT));
      setVaultItems(DEFAULT_VAULT);
    }

    // Load Activity Requests
    const savedRequests = localStorage.getItem('hima_ristek_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Vault Handlers
  const handleAddFile = (e) => {
    e.preventDefault();
    if (!title || !size) {
      showToast('Lengkapi nama file dan ukuran!', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      title,
      size,
      type,
      url: url || '#'
    };

    const updated = [...vaultItems, newItem];
    setVaultItems(updated);
    localStorage.setItem('hima_vault', JSON.stringify(updated));
    showToast('File baru berhasil ditambahkan ke Einstein Vault!', 'success');
    
    setTitle('');
    setSize('');
    setType('Dokumen');
    setUrl('');
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus file ini dari Vault?')) {
      const updated = vaultItems.filter(item => item.id !== id);
      setVaultItems(updated);
      localStorage.setItem('hima_vault', JSON.stringify(updated));
      showToast('File berhasil dihapus dari Einstein Vault.', 'info');
    }
  };

  // Activity ACC Handlers
  const handleApproveRequest = (request) => {
    const updated = requests.map(req => {
      if (req.id === request.id) {
        return { ...req, status: 'ACC' };
      }
      return req;
    });
    setRequests(updated);
    localStorage.setItem('hima_ristek_requests', JSON.stringify(updated));

    // Send notification bell alert to user
    const newNotification = {
      id: Date.now(),
      recipientEmail: request.userEmail,
      message: `Pendaftaran ${request.type} (${request.subject}) Anda telah DISETUJUI (ACC) oleh Kadiv Ristek! Anda akan segera dihubungi kembali.`,
      read: false,
      timestamp: Date.now()
    };
    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    notifsList.push(newNotification);
    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));

    showToast(`Permohonan ${request.requesterName} disetujui & notifikasi dikirim!`, 'success');
  };

  const handleRejectRequest = (id) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Ditolak' };
      }
      return req;
    });
    setRequests(updated);
    localStorage.setItem('hima_ristek_requests', JSON.stringify(updated));
    showToast('Permohonan ditolak.', 'info');
  };

  const handleDeleteRequest = (id) => {
    if (window.confirm('Hapus riwayat permohonan ini?')) {
      const updated = requests.filter(req => req.id !== id);
      setRequests(updated);
      localStorage.setItem('hima_ristek_requests', JSON.stringify(updated));
      showToast('Riwayat berhasil dihapus.', 'info');
    }
  };

  const totalPending = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5 text-gold" /> RISTEK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Einstein Ristek Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan file modul, bank soal, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.
          </p>
        </div>
        {totalPending > 0 && (
          <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider animate-pulse">
            {totalPending} Butuh ACC
          </span>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'vault' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Kelola File Vault (Modul/Software)
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'requests' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Persetujuan Kegiatan (ACC Ristek)
          {totalPending > 0 && (
            <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {totalPending}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Vault Management */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Document list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Daftar File Vault Aktif
            </h3>

            <div className="space-y-3">
              {vaultItems.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-550 shadow-sm">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-350" />
                  <p className="text-xs">Belum ada file terunggah di Vault.</p>
                </div>
              ) : (
                vaultItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 shadow-sm transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-4">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Tipe: <span className="font-bold text-gold-dark">{item.type || 'Dokumen'}</span> • Ukuran: {item.size}
                      </p>
                      {item.url && item.url !== '#' && (
                        <p className="text-[9px] text-slate-400 font-mono truncate">Tautan: {item.url}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.url && item.url !== '#' && (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gold/10 text-gold-dark transition-colors"
                          title="Buka Tautan File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteFile(item.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                        title="Hapus File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Add Form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-gold" /> Tambah File Baru (Dokumen/Software)
            </h3>

            <div className="bg-white border border-gold-border rounded-2xl p-6 relative overflow-hidden shadow-md">
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
              
              <form onSubmit={handleAddFile} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama File / Referensi</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Kumpulan Soal UAS Sensor & Tranduser"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ukuran File (Estimasi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: 3.2 MB atau 125 MB"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tipe File</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  >
                    <option value="Dokumen">Dokumen (Modul, Bank Soal, Buku)</option>
                    <option value="Software">Software (IDE, Simulator, Tools)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan Download / URL File (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: https://link-to-file.com/installer.zip"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md shadow-gold/20"
                >
                  Unggah ke Vault <Plus className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Activity Approvals (Ristek Mengajar & Collab) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-gold" /> Permohonan Kegiatan (Ristek Mengajar & Proyek Collab)
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Nama Pengaju</th>
                    <th className="px-6 py-4">Tipe Pendaftaran</th>
                    <th className="px-6 py-4">Detail Peran & Materi</th>
                    <th className="px-6 py-4">No. WhatsApp</th>
                    <th className="px-6 py-4">Status ACC</th>
                    <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                        Belum ada permohonan kegiatan yang diajukan.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-850">{req.requesterName}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{req.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                            req.type === 'Ristek Mengajar' 
                              ? 'bg-amber-50 text-amber-600 border-amber-500/20' 
                              : 'bg-indigo-50 text-indigo-650 border-indigo-500/20'
                          }`}>
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{req.subject}</div>
                          <div className="text-[10px] text-slate-500 italic mt-0.5">Peran: {req.role || 'Anggota'}</div>
                        </td>
                        <td className="px-6 py-4 font-mono">{req.wa}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            req.status === 'ACC' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                              : req.status === 'Ditolak'
                                ? 'bg-rose-50 text-rose-600 border-rose-55/20'
                                : 'bg-amber-50 text-amber-600 border-amber-55/20'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-1.5 items-center">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(req)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm"
                                >
                                  <CheckCircle className="w-3 h-3" /> ACC
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm"
                                >
                                  <XCircle className="w-3 h-3" /> Tolak
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleDeleteRequest(req.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-550 rounded-lg transition-all active:scale-95"
                                title="Hapus Riwayat"
                              >
                                <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  );
}
