import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash2, ShieldCheck, FileText, Download, CheckCircle, 
  XCircle, Users, Activity, Calendar, Sparkles, Code, Server, MapPin, Edit, RefreshCw, Search
} from 'lucide-react';
import { DEFAULT_DRIVE_VAULT } from '../../data/driveVaultItems';

export default function RistekDashboard({ showToast }) {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault', 'schedule', 'projects', 'requests', 'programs'

  // VAULT STATE
  const [vaultItems, setVaultItems] = useState([]);
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultSize, setVaultSize] = useState('');
  const [vaultType, setVaultType] = useState('Dokumen');
  const [vaultUrl, setVaultUrl] = useState('');

  const handleSyncDrive = () => {
    const cleanVault = DEFAULT_DRIVE_VAULT.filter(i => i.id !== 100 && !i.title?.includes('Google Drive Utama') && !i.title?.includes('Google Drive Induk'));
    localStorage.setItem('hima_vault', JSON.stringify(cleanVault));
    setVaultItems(cleanVault);
    showToast('Berhasil mengimpor & menyinkronkan 38 berkas dari Google Drive!', 'success');
  };

  // SCHEDULE STATE
  const [schedules, setSchedules] = useState([]);
  const [schedDateText, setSchedDateText] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDesc, setSchedDesc] = useState('');
  const [schedTutor, setSchedTutor] = useState('');
  const [schedRoom, setSchedRoom] = useState('');
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [calDateInput, setCalDateInput] = useState(new Date().toISOString().split('T')[0]);

  // PROJECTS STATE
  const [projects, setProjects] = useState([]);
  const [projTag, setProjTag] = useState('IoT & Nuklir');
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');

  // PROGRAMS STATE (Pemaparan Program Kerja Ristek)
  const [divPrograms, setDivPrograms] = useState([]);
  const [progName, setProgName] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progStatus, setProgStatus] = useState('Terencana');
  const [progDate, setProgDate] = useState('');
  const [progTime, setProgTime] = useState('');
  const [progLocation, setProgLocation] = useState('');
  const [editingId, setEditingId] = useState(null);

  // REQUESTS STATE
  const [requests, setRequests] = useState([]);

  // Load Database from LocalStorage
  useEffect(() => {
    // Vault
    const VAULT_VERSION = 'v4_omron_cx_designer';
    const savedVersion = localStorage.getItem('hima_vault_version');
    const savedVault = localStorage.getItem('hima_vault');
    const cleanDefault = DEFAULT_DRIVE_VAULT.filter(i => i.id !== 100 && !i.title?.includes('Google Drive Utama') && !i.title?.includes('Google Drive Induk'));
    
    let loadedVault = cleanDefault;
    if (savedVersion === VAULT_VERSION && savedVault !== null) {
      try {
        const parsed = JSON.parse(savedVault);
        if (Array.isArray(parsed) && parsed.length > 5) {
          loadedVault = parsed.filter(i => i.id !== 100 && !i.title?.includes('Google Drive Utama') && !i.title?.includes('Google Drive Induk'));
        } else {
          loadedVault = cleanDefault;
          localStorage.setItem('hima_vault', JSON.stringify(cleanDefault));
          localStorage.setItem('hima_vault_version', VAULT_VERSION);
        }
      } catch (e) {
        console.error('Failed to parse vault:', e);
      }
    } else {
      localStorage.setItem('hima_vault', JSON.stringify(cleanDefault));
      localStorage.setItem('hima_vault_version', VAULT_VERSION);
      loadedVault = cleanDefault;
    }
    setVaultItems(loadedVault);

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

    // Division programs
    const savedProgs = localStorage.getItem('hima_division_programs_ristek');
    if (savedProgs) {
      setDivPrograms(JSON.parse(savedProgs));
    } else {
      const DEFAULT_PROGS = [
        {
          id: 1,
          name: 'Program Kerja Unggulan Riset & Teknologi',
          desc: 'Pemaparan program kerja awal divisi Riset & Teknologi untuk menyelaraskan target Kabinet Photisma HIMA EINSTEN.',
          status: 'Terencana',
          date: '2026-07-20',
          time: '15.30 - 17.00 WIB',
          location: 'Lab Komputasi 3'
        }
      ];
      localStorage.setItem('hima_division_programs_ristek', JSON.stringify(DEFAULT_PROGS));
      setDivPrograms(DEFAULT_PROGS);
    }

    // Requests
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
    window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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

  // Handlers: Program Kerja Ristek
  const handleSaveProgram = (e) => {
    e.preventDefault();
    if (!progName || !progDesc) {
      showToast('Lengkapi nama dan deskripsi program kerja!', 'error');
      return;
    }

    let updated = [];
    if (editingId) {
      updated = divPrograms.map(p => {
        if (p.id === editingId) {
          return { 
            ...p, 
            name: progName, 
            desc: progDesc, 
            status: progStatus,
            date: progDate,
            time: progTime,
            location: progLocation
          };
        }
        return p;
      });

      // Update in HIMA Calendar too if date is filled
      if (progDate) {
        const savedEvents = localStorage.getItem('hima_calendar_events');
        const events = savedEvents ? JSON.parse(savedEvents) : {};
        events[progDate] = {
          title: `${progName} 🚀`,
          type: 'hima',
          desc: `${progDesc} (Waktu: ${progTime || 'TBA'})`,
          location: progLocation || 'TBA'
        };
        localStorage.setItem('hima_calendar_events', JSON.stringify(events));
      }

      showToast('Program kerja berhasil diperbarui!', 'success');
      setEditingId(null);
    } else {
      const newProg = {
        id: Date.now(),
        name: progName,
        desc: progDesc,
        status: progStatus,
        date: progDate,
        time: progTime,
        location: progLocation
      };
      updated = [...divPrograms, newProg];

      // Auto add to HIMA calendar if date is filled
      if (progDate) {
        const savedEvents = localStorage.getItem('hima_calendar_events');
        const events = savedEvents ? JSON.parse(savedEvents) : {};
        events[progDate] = {
          title: `${progName} 🚀`,
          type: 'hima',
          desc: `${progDesc} (Waktu: ${progTime || 'TBA'})`,
          location: progLocation || 'TBA'
        };
        localStorage.setItem('hima_calendar_events', JSON.stringify(events));
        showToast('Program kerja ditambahkan & tersinkronisasi ke Kalender Himpunan!', 'success');
      } else {
        showToast('Program kerja baru berhasil ditambahkan!', 'success');
      }
    }

    setDivPrograms(updated);
    localStorage.setItem('hima_division_programs_ristek', JSON.stringify(updated));

    setProgName('');
    setProgDesc('');
    setProgStatus('Terencana');
    setProgDate('');
    setProgTime('');
    setProgLocation('');
  };

  const handleEditProgramClick = (p) => {
    setEditingId(p.id);
    setProgName(p.name);
    setProgDesc(p.desc);
    setProgStatus(p.status);
    setProgDate(p.date || '');
    setProgTime(p.time || '');
    setProgLocation(p.location || '');
  };

  const handleDeleteProgram = (id) => {
    if (window.confirm('Hapus program kerja ini?')) {
      const updated = divPrograms.filter(p => p.id !== id);
      setDivPrograms(updated);
      localStorage.setItem('hima_division_programs_ristek', JSON.stringify(updated));
      showToast('Program kerja berhasil dihapus.', 'info');
      
      if (editingId === id) {
        setEditingId(null);
        setProgName('');
        setProgDesc('');
        setProgStatus('Terencana');
        setProgDate('');
        setProgTime('');
        setProgLocation('');
      }
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
            Pengelolaan Einsten Vault, penjadwalan kelas mengajar, proyek kolaborasi, program kerja divisi, dan persetujuan kegiatan.
          </p>
        </div>
        {totalPending > 0 && (
          <span className="w-fit text-[10px] bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider animate-pulse">
            {totalPending} Permohonan Bth ACC
          </span>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-1">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'vault' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Kelola File Vault (Materi & Software)
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'schedule' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Jadwal Mengajar
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'requests' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          ACC Kegiatan Mengajar
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Daftar File Vault Aktif ({vaultItems.length})
              </h3>
              <button
                type="button"
                onClick={handleSyncDrive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 hover:bg-gold hover:text-white text-gold-dark text-xs font-bold transition-all border border-gold/30 shadow-sm active:scale-95 cursor-pointer"
                title="Sinkronkan seluruh folder dan berkas dari Google Drive Einsten Vault"
              >
                <RefreshCw className="w-3.5 h-3.5" /> ⚡ Sinkronkan Google Drive (38 Berkas)
              </button>
            </div>

            {/* Dashboard Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                placeholder="Cari file atau software di vault..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-gold shadow-sm"
              />
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {vaultItems.filter(item => {
                if (!vaultSearch) return true;
                const q = vaultSearch.toLowerCase();
                return (item.title || '').toLowerCase().includes(q) || (item.desc || '').toLowerCase().includes(q) || (item.type || '').toLowerCase().includes(q);
              }).length === 0 ? (
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-455 shadow-sm">
                  <p className="text-xs">Tidak ada file yang ditemukan.</p>
                </div>
              ) : (
                vaultItems.filter(item => {
                  if (!vaultSearch) return true;
                  const q = vaultSearch.toLowerCase();
                  return (item.title || '').toLowerCase().includes(q) || (item.desc || '').toLowerCase().includes(q) || (item.type || '').toLowerCase().includes(q);
                }).map((item) => {
                  const isSoftware = (item.type || '').toLowerCase().includes('software') || (item.title || '').toLowerCase().includes('labview') || (item.title || '').toLowerCase().includes('proteus') || (item.title || '').toLowerCase().includes('ide') || (item.title || '').toLowerCase().includes('matlab') || (item.title || '').toLowerCase().includes('cvavr') || (item.title || '').toLowerCase().includes('eagle') || (item.title || '').toLowerCase().includes('fusion') || (item.title || '').toLowerCase().includes('progisp') || (item.title || '').toLowerCase().includes('webots') || (item.title || '').toLowerCase().includes('plc') || (item.title || '').toLowerCase().includes('omron') || (item.title || '').toLowerCase().includes('cx');
                  return (
                    <div key={item.id} className="p-3.5 bg-white border border-gold-border rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 shadow-sm transition-colors text-left">
                      <div className="space-y-1 min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            isSoftware ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isSoftware ? 'Software Praktikum' : 'Materi / Bank Soal'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.size}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors truncate">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[280px]">{item.url}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDeleteFile(item.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Hapus file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Add file form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Plus className="w-4.5 h-4.5 text-gold" /> Tambah File / Software Baru
            </h3>
            <form onSubmit={handleAddFile} className="bg-white border border-gold-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama File / Software</label>
                <input 
                  type="text" required placeholder="Contoh: LabVIEW 2026 atau Bank Soal UAS" value={vaultTitle}
                  onChange={(e) => setVaultTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ukuran File</label>
                <input 
                  type="text" required placeholder="Contoh: 1.5 MB atau 4.2 GB" value={vaultSize}
                  onChange={(e) => setVaultSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori / Tipe File</label>
                <select 
                  value={vaultType} onChange={(e) => setVaultType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                >
                  <option value="Materi">📚 Materi Ajar & Bank Soal</option>
                  <option value="Software">💻 Software & Tools Praktikum</option>
                  <option value="Dokumen">📄 Dokumen / Modul Praktikum</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan Download / URL (Google Drive / Direct Link)</label>
                <input 
                  type="text" placeholder="Contoh: https://drive.google.com/..." value={vaultUrl}
                  onChange={(e) => setVaultUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer">
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
                <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-455 shadow-sm">
                  <p className="text-xs">Belum ada jadwal mengajar terdaftar.</p>
                </div>
              ) : (
                schedules.map((s) => (
                  <div key={s.id} className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 shadow-sm transition-colors text-left">
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold bg-gold/10 text-gold-dark border border-gold/20 px-2 py-0.5 rounded">
                          {s.date}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">{s.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{s.title}</h4>
                      <p className="text-[10px] text-slate-500 font-light">{s.desc}</p>
                      <p className="text-[9px] text-slate-400 font-mono">Tutor: {s.tutor} • Ruang: {s.room}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(s.id)}
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
              <Plus className="w-4.5 h-4.5 text-gold" /> Tambah Jadwal Mengajar
            </h3>
            <form onSubmit={handleAddSchedule} className="bg-white border border-gold-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Hari & Tanggal</label>
                <input 
                  type="text" required placeholder="Contoh: Senin, 20 Juli 2026" value={schedDateText}
                  onChange={(e) => setSchedDateText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Jam / Waktu</label>
                <input 
                  type="text" required placeholder="Contoh: 15.30 - 17.00 WIB" value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Judul / Mata Kuliah</label>
                <input 
                  type="text" required placeholder="Contoh: Pemrograman C++ Lanjut" value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi / Materi</label>
                <input 
                  type="text" placeholder="Contoh: Pointers, Dynamic Memory, & Struct" value={schedDesc}
                  onChange={(e) => setSchedDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
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

              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer">
                Tambah Jadwal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Activity Requests (ACC Ristek) */}
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
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-55/20' 
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
