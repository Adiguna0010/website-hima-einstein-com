import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash2, ShieldCheck, FileText, Download, CheckCircle, 
  XCircle, Users, Activity, Calendar, Sparkles, Code, Server, MapPin
} from 'lucide-react';

export default function RistekDashboard({ showToast }) {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault', 'schedule', 'projects', 'requests'

  // VAULT STATE
  const [vaultItems, setVaultItems] = useState([]);
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultSize, setVaultSize] = useState('');
  const [vaultType, setVaultType] = useState('Dokumen');
  const [vaultUrl, setVaultUrl] = useState('');

  // SCHEDULE STATE
  const [schedules, setSchedules] = useState([]);
  const [schedDateText, setSchedDateText] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDesc, setSchedDesc] = useState('');
  const [schedTutor, setSchedTutor] = useState('');
  const [schedRoom, setSchedRoom] = useState('');
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [calDateInput, setCalDateInput] = useState(new Date().toISOString().split('T')[0]); // Fallback ISO date for calendar key

  // PROJECTS STATE
  const [projects, setProjects] = useState([]);
  const [projTag, setProjTag] = useState('IoT & Nuklir');
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');

  // REQUESTS STATE
  const [requests, setRequests] = useState([]);

  // Load Database from LocalStorage
  useEffect(() => {
    // Vault
    const savedVault = localStorage.getItem('hima_vault');
    if (savedVault) {
      setVaultItems(JSON.parse(savedVault));
    } else {
      const DEFAULT_VAULT = [
        { id: 1, title: 'UTS: Mikroprosesor & Mikrokontroler', size: '2.4 MB', type: 'Dokumen', url: '#' },
        { id: 2, title: 'Modul Praktikum: Detektor Radiasi Nuklir', size: '4.8 MB', type: 'Dokumen', url: '#' }
      ];
      localStorage.setItem('hima_vault', JSON.stringify(DEFAULT_VAULT));
      setVaultItems(DEFAULT_VAULT);
    }

    // Schedules
    const savedSchedules = localStorage.getItem('hima_ristek_schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      const DEFAULT_SCHEDULES = [
        {
          id: 1,
          date: 'Senin, 20 Juli 2026',
          time: '15.30 - 17.00 WIB',
          title: 'Kelas Dasar Pemrograman C++',
          desc: 'Pengenalan Sintaks Dasar, Variabel, Array, dan Pointers untuk mahasiswa baru.',
          tutor: 'Adiguna Nugroho Halomoan (Kadiv Ristek)',
          room: 'Lab Komputasi 3'
        },
        {
          id: 2,
          date: 'Rabu, 22 Juli 2026',
          time: '13.00 - 15.00 WIB',
          title: 'Praktikum Elektronika Lanjut',
          desc: 'Desain Sirkuit Analog, Penggunaan Osiloskop, & Lab Virtual Proteus.',
          tutor: 'Dian Ristek (Operator)',
          room: 'Laboratorium Elektronika Dasar'
        }
      ];
      localStorage.setItem('hima_ristek_schedules', JSON.stringify(DEFAULT_SCHEDULES));
      setSchedules(DEFAULT_SCHEDULES);
    }

    // Collab Projects
    const savedProjects = localStorage.getItem('hima_ristek_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const DEFAULT_PROJECTS = [
        {
          id: 1,
          tag: 'IoT & Nuklir',
          title: 'Monitor Radiasi Geiger-Müller ESP32',
          desc: 'Membangun alat ukur paparan radiasi portable berbasis sensor IoT otonom terkoneksi database IoT.'
        }
      ];
      localStorage.setItem('hima_ristek_projects', JSON.stringify(DEFAULT_PROJECTS));
      setProjects(DEFAULT_PROJECTS);
    }

    // Requests (Activity registrations)
    const savedRequests = localStorage.getItem('hima_ristek_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Handlers: Vault
  const handleAddFile = (e) => {
    e.preventDefault();
    if (!vaultTitle || !vaultSize) {
      showToast('Lengkapi nama file dan ukuran!', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      title: vaultTitle,
      size: vaultSize,
      type: vaultType,
      url: vaultUrl || '#'
    };

    const updated = [...vaultItems, newItem];
    setVaultItems(updated);
    localStorage.setItem('hima_vault', JSON.stringify(updated));
    showToast('File baru berhasil ditambahkan ke Einsten Vault!', 'success');
    
    setVaultTitle('');
    setVaultSize('');
    setVaultType('Dokumen');
    setVaultUrl('');
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Hapus file ini dari Vault?')) {
      const updated = vaultItems.filter(item => item.id !== id);
      setVaultItems(updated);
      localStorage.setItem('hima_vault', JSON.stringify(updated));
      showToast('File berhasil dihapus dari Einsten Vault.', 'info');
    }
  };

  // Handlers: Schedule
  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!schedDateText || !schedTime || !schedTitle || !schedTutor) {
      showToast('Lengkapi data jadwal mengajar!', 'error');
      return;
    }

    const newSched = {
      id: Date.now(),
      date: schedDateText,
      time: schedTime,
      title: schedTitle,
      desc: schedDesc,
      tutor: schedTutor,
      room: schedRoom || 'Online'
    };

    const updated = [...schedules, newSched];
    setSchedules(updated);
    localStorage.setItem('hima_ristek_schedules', JSON.stringify(updated));

    // Handle adding to Hima calendar
    if (addToCalendar && calDateInput) {
      const savedEvents = localStorage.getItem('hima_calendar_events');
      const events = savedEvents ? JSON.parse(savedEvents) : {};
      
      events[calDateInput] = {
        title: `${schedTitle} 🔬`,
        type: 'hima',
        desc: `${schedDesc} (Tutor: ${schedTutor})`,
        location: schedRoom || 'Online'
      };

      localStorage.setItem('hima_calendar_events', JSON.stringify(events));
      showToast('Jadwal ditambahkan ke Vault & Kalender Himpunan!', 'success');
    } else {
      showToast('Jadwal baru berhasil ditambahkan ke list mengajar!', 'success');
    }

    // Reset Form
    setSchedDateText('');
    setSchedTime('');
    setSchedTitle('');
    setSchedDesc('');
    setSchedTutor('');
    setSchedRoom('');
    setAddToCalendar(false);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Hapus jadwal kegiatan mengajar ini?')) {
      const updated = schedules.filter(s => s.id !== id);
      setSchedules(updated);
      localStorage.setItem('hima_ristek_schedules', JSON.stringify(updated));
      showToast('Jadwal kegiatan berhasil dihapus.', 'info');
    }
  };

  // Handlers: Projects
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projTitle || !projDesc) {
      showToast('Lengkapi judul dan deskripsi proyek collab!', 'error');
      return;
    }

    const newProj = {
      id: Date.now(),
      tag: projTag,
      title: projTitle,
      desc: projDesc
    };

    const updated = [...projects, newProj];
    setProjects(updated);
    localStorage.setItem('hima_ristek_projects', JSON.stringify(updated));
    showToast('Proyek kolaborasi baru berhasil dibuka!', 'success');

    setProjTitle('');
    setProjDesc('');
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Hapus proyek kolaborasi ini?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('hima_ristek_projects', JSON.stringify(updated));
      showToast('Proyek kolaborasi berhasil ditutup.', 'info');
    }
  };

  // Handlers: Requests
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
      message: `Pendaftaran ${request.type} (${request.subject}) Anda telah DISETUJUI (ACC) oleh Kadiv Ristek!`,
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
      showToast('Riwayat permohonan berhasil dihapus.', 'info');
    }
  };

  const totalPending = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5 text-gold" /> RISTEK BACKOFFICE PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Dashboard Riset & Teknologi
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan Einsten Vault, penjadwalan kelas mengajar, proyek kolaborasi, dan persetujuan kegiatan anggota Himpunan.
          </p>
        </div>
        {totalPending > 0 && (
          <span className="w-fit text-[10px] bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider animate-pulse">
            {totalPending} Permohonan Butuh ACC
          </span>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-1">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'vault' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Kelola File Vault
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'schedule' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Jadwal Mengajar
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'projects' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Proyek Collab
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'requests' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          ACC Kegiatan
          {totalPending > 0 && (
            <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {totalPending}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Vault Management */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* List of files */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Daftar File Vault Aktif
            </h3>
            <div className="space-y-3">
              {vaultItems.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-450 shadow-sm">
                  <p className="text-xs">Belum ada file di Vault.</p>
                </div>
              ) : (
                vaultItems.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 shadow-sm transition-colors">
                    <div className="space-y-1 min-w-0 flex-1 pr-4">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Tipe: <span className="font-bold text-gold-dark">{item.type || 'Dokumen'}</span> • Ukuran: {item.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDeleteFile(item.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Add file form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Plus className="w-4.5 h-4.5 text-gold" /> Tambah File Baru
            </h3>
            <form onSubmit={handleAddFile} className="bg-white border border-gold-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama File</label>
                <input 
                  type="text" required placeholder="Contoh: Modul Arduino Elins" value={vaultTitle}
                  onChange={(e) => setVaultTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ukuran File</label>
                <input 
                  type="text" required placeholder="Contoh: 1.5 MB" value={vaultSize}
                  onChange={(e) => setVaultSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tipe File</label>
                <select 
                  value={vaultType} onChange={(e) => setVaultType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                >
                  <option value="Dokumen">Dokumen (Modul, Bank Soal)</option>
                  <option value="Software">Software (IDE, Simulator)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan Download / URL</label>
                <input 
                  type="text" placeholder="Contoh: https://gdrive.com/file.zip" value={vaultUrl}
                  onChange={(e) => setVaultUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all">
                Unggah ke Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Schedule Management */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* List of schedules */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4.5 h-4.5 text-gold" /> List Jadwal Kegiatan Mengajar
            </h3>
            <div className="space-y-3">
              {schedules.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-450 shadow-sm">
                  <p className="text-xs">Belum ada jadwal mengajar terdaftar.</p>
                </div>
              ) : (
                schedules.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between hover:bg-slate-50/50 shadow-sm transition-colors">
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Hari/Tgl: <span className="font-bold text-gold-dark">{item.date}</span> • Waktu: {item.time}
                      </p>
                      <p className="text-[10px] text-slate-550 leading-relaxed font-light mt-0.5">{item.desc}</p>
                      <p className="text-[9px] text-slate-400 font-mono">Tutor: {item.tutor} • Ruang: {item.room}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Add schedule form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Plus className="w-4.5 h-4.5 text-gold" /> Tambah Jadwal Mengajar Baru
            </h3>
            <form onSubmit={handleAddSchedule} className="bg-white border border-gold-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Hari, Tanggal (Teks)</label>
                <input 
                  type="text" required placeholder="Contoh: Senin, 20 Juli 2026" value={schedDateText}
                  onChange={(e) => setSchedDateText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Waktu / Jam (Teks)</label>
                <input 
                  type="text" required placeholder="Contoh: 15.30 - 17.00 WIB" value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Kelas / Mata Kuliah</label>
                <input 
                  type="text" required placeholder="Contoh: Kelas Dasar Pemrograman C++" value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Materi / Deskripsi Kelas</label>
                <textarea 
                  rows={2} placeholder="Contoh: Pengenalan Sintaks Dasar, Variabel, Array..." value={schedDesc}
                  onChange={(e) => setSchedDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tutor / Pengajar</label>
                <input 
                  type="text" required placeholder="Contoh: Adiguna (Kadiv Ristek)" value={schedTutor}
                  onChange={(e) => setSchedTutor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ruang / Kelas</label>
                <input 
                  type="text" placeholder="Contoh: Lab Komputasi 3" value={schedRoom}
                  onChange={(e) => setSchedRoom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Add to Calendar Sync */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" checked={addToCalendar} onChange={(e) => setAddToCalendar(e.target.checked)}
                    className="mt-0.5 border-slate-300 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">Sinkronisasi ke Kalender Himpunan</span>
                    <span className="text-[9px] text-slate-400 leading-normal block">Secara otomatis daftarkan kegiatan mengajar ini ke halaman utama Kalender Himpunan.</span>
                  </div>
                </label>
                {addToCalendar && (
                  <div className="space-y-1 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <label className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Tanggal Kalender Kegiatan</label>
                    <input 
                      type="date" required={addToCalendar} value={calDateInput}
                      onChange={(e) => setCalDateInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all">
                Tambah Jadwal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Collab Projects Management */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* List of projects */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Code className="w-4.5 h-4.5 text-gold" /> Proyek Kolaborasi Aktif
            </h3>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-450 shadow-sm">
                  <p className="text-xs">Belum ada proyek kolaborasi dibuka.</p>
                </div>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="p-5 bg-white border border-gold-border rounded-2xl flex items-center justify-between hover:bg-slate-50/50 shadow-sm transition-colors text-left">
                    <div className="space-y-1.5 flex-1 pr-4">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[9px] font-bold text-gold-dark uppercase tracking-wider">
                        {p.tag}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-normal font-light">{p.desc}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Add project form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Plus className="w-4.5 h-4.5 text-gold" /> Buka Proyek Kolaborasi Baru
            </h3>
            <form onSubmit={handleAddProject} className="bg-white border border-gold-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Proyek / Tag</label>
                <input 
                  type="text" required placeholder="Contoh: IoT & Nuklir atau Web App" value={projTag}
                  onChange={(e) => setProjTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Judul Proyek</label>
                <input 
                  type="text" required placeholder="Contoh: Monitor Radiasi Geiger-Müller" value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi Proyek</label>
                <textarea 
                  required rows={4} placeholder="Jelaskan detail tujuan proyek, target alat/software, dan syarat kolaborasi bagi anggota..." value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold resize-none"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all">
                Buka Proyek Collab
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Activity Requests (ACC Ristek) */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
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
                          <div className="font-bold text-slate-855">{req.requesterName}</div>
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
                        <td className="px-6 py-4 text-left">
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
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm cursor-pointer"
                                >
                                  <CheckCircle className="w-3 h-3" /> ACC
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm cursor-pointer"
                                >
                                  <XCircle className="w-3 h-3" /> Tolak
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleDeleteRequest(req.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-550 rounded-lg transition-all active:scale-95 cursor-pointer"
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
