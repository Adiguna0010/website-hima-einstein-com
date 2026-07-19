import React, { useState, useEffect } from 'react';
import { Download, Send, ListFilter, ClipboardCheck, AlertCircle, CheckCircle, XCircle, Plus, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Secretariat({ showToast }) {
  const { currentUser } = useAuth();
  
  // Data states
  const [letters, setLetters] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [events, setEvents] = useState({});
  
  // Form states (Letter Request)
  const [requester, setRequester] = useState('');
  const [category, setCategory] = useState('Surat Permohonan');
  const [subject, setSubject] = useState('');
  
  // Backoffice states (Template Upload)
  const [newTplName, setNewTplName] = useState('');
  const [newTplFormat, setNewTplFormat] = useState('DOCX');
  const [newTplSize, setNewTplSize] = useState('');
  const [newTplUrl, setNewTplUrl] = useState('');

  // Backoffice states (Event Registration)
  const [eventDate, setEventDate] = useState('2026-07-15');
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('hima');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Letter ACC Form states (for operator)
  const [accLetterId, setAccLetterId] = useState(null);
  const [inputLetterNumber, setInputLetterNumber] = useState('');
  const [inputResponseUrl, setInputResponseUrl] = useState('');

  // Tab state for Backoffice
  const [backofficeTab, setBackofficeTab] = useState('letters');

  // Initial dummy databases
  const DEFAULT_LETTERS = [
    { id: 1, requester: 'Ristek / Dian', category: 'Surat Permohonan', subject: 'Peminjaman Laboratorium Komputasi', status: 'ACC', letterNumber: '001/HIMA-EINSTEN/VII/2026', fileUrl: '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Template Permohonan Peminjaman Ruang Rapat KSTE A. Baiquni.docx' },
    { id: 2, requester: 'Pengma / Budi', category: 'Surat Undangan', subject: 'Undangan Pembicara PLC Siemens', status: 'Pending', letterNumber: '', fileUrl: '' }
  ];

  const DEFAULT_TEMPLATES = [
    { id: 1, name: 'Format Surat Undangan HIMA', format: 'DOCX', size: '130 KB', date: 'Juli 2026', url: '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Surat Peminjaman Alat kepada Ormawa_Hima_UKM.docx' },
    { id: 2, name: 'Format Proposal Kegiatan HIMA', format: 'DOCX', size: '2.5 MB', date: 'Juli 2026', url: '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Template Permohonan Dosen Pendamping.docx' },
    { id: 3, name: 'Format LPJ (Laporan Pertanggungjawaban)', format: 'DOCX', size: '63 KB', date: 'Juli 2026', url: '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Template Permohonan Peminjaman Ruang Rapat KSTE A. Baiquni.docx' }
  ];

  const DEFAULT_EVENTS = {
    '2026-07-15': { title: 'Einsten Festival (E-Fest) 🚀', type: 'hima', desc: 'Festival teknologi, seminar instrumentasi nuklir, dan pameran proyek IoT mahasiswa Elins.', location: 'Auditorium Poltek Nuklir' },
    '2026-07-20': { title: 'Ristek Mengajar Sebaya 🔬', type: 'hima', desc: 'Bimbingan belajar internal pemrograman C++ dan Elektronika dasar untuk mahasiswa baru.', location: 'Lab Kendali Industri' },
    '2026-07-24': { title: 'Musyawarah Perwakilan Mahasiswa 🏛️', type: 'ormawa', desc: 'Sidang evaluasi program kerja ormawa eksternal kampus Politeknik Teknologi Nuklir Indonesia.', location: 'Ruang Rapat KSTE A. Baiquni' },
    '2026-07-28': { title: 'Evaluasi Tengah Tahun Kabinet 🪙', type: 'hima', desc: 'Pemaparan laporan pertanggungjawaban setengah tahun Kabinet Phótisma.', location: 'Sekretariat HIMA Einsten' }
  };

  useEffect(() => {
    // Load Letters
    const savedLetters = localStorage.getItem('hima_letters');
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    } else {
      localStorage.setItem('hima_letters', JSON.stringify(DEFAULT_LETTERS));
      setLetters(DEFAULT_LETTERS);
    }

    // Load Templates
    const savedTemplates = localStorage.getItem('hima_document_templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      localStorage.setItem('hima_document_templates', JSON.stringify(DEFAULT_TEMPLATES));
      setTemplates(DEFAULT_TEMPLATES);
    }

    // Load Events
    const savedEvents = localStorage.getItem('hima_calendar_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      localStorage.setItem('hima_calendar_events', JSON.stringify(DEFAULT_EVENTS));
      setEvents(DEFAULT_EVENTS);
    }
  }, []);

  // Public Form Submit: Request a new letter number
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requester || !subject) {
      showToast('Mohon lengkapi seluruh kolom formulir!', 'error');
      return;
    }

    const newRequest = {
      id: Date.now(),
      requester,
      category,
      subject,
      status: 'Pending',
      userEmail: currentUser?.email || 'guest@einsten.com',
      letterNumber: '',
      fileUrl: ''
    };

    const updated = [...letters, newRequest];
    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));
    showToast('Pengajuan nomor surat berhasil dikirim ke Sekretariat!', 'success');
    
    setRequester('');
    setSubject('');
  };

  // Backoffice: Approve/ACC Letter (Phase 1: Open Form; Phase 2: Save)
  const openAccForm = (letter) => {
    setAccLetterId(letter.id);
    setInputLetterNumber(`00${letters.length + 1}/HIMA-EINSTEN/VII/2026`);
    setInputResponseUrl(letter.fileUrl || '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Surat Peminjaman Alat kepada Ormawa_Hima_UKM.docx');
  };

  const handleConfirmAcc = (e) => {
    e.preventDefault();
    if (!inputLetterNumber) {
      showToast('Mohon masukkan Nomor Surat yang dialokasikan!', 'error');
      return;
    }

    const req = letters.find(l => l.id === accLetterId);

    const updated = letters.map(item => {
      if (item.id === accLetterId) {
        return { 
          ...item, 
          status: 'ACC', 
          letterNumber: inputLetterNumber,
          fileUrl: inputResponseUrl || '#' 
        };
      }
      return item;
    });

    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));

    // Send notification bell alert
    if (req) {
      const newNotification = {
        id: Date.now(),
        recipientEmail: req.userEmail || 'guest@einsten.com',
        message: `Pengajuan ${req.category} (${req.subject}) Anda telah DISETUJUI (ACC) dengan Nomor Surat: ${inputLetterNumber}!`,
        read: false,
        timestamp: Date.now()
      };
      const savedNotifs = localStorage.getItem('hima_notifications');
      const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
      notifsList.push(newNotification);
      localStorage.setItem('hima_notifications', JSON.stringify(notifsList));
    }

    showToast('Surat berhasil disetujui (ACC) dengan Nomor Surat!', 'success');
    setAccLetterId(null);
  };

  const handleRejectLetter = (id) => {
    const updated = letters.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Ditolak' };
      }
      return item;
    });
    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));
    showToast('Pengajuan surat ditolak.', 'info');
  };

  const handleDeleteLetter = (id) => {
    if (window.confirm('Hapus log pengajuan surat ini?')) {
      const updated = letters.filter(item => item.id !== id);
      setLetters(updated);
      localStorage.setItem('hima_letters', JSON.stringify(updated));
      showToast('Log pengajuan surat berhasil dihapus.', 'info');
    }
  };

  // Backoffice: Manage templates (Add / Delete)
  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTplName || !newTplSize) {
      showToast('Mohon lengkapi Nama dan Ukuran template!', 'error');
      return;
    }

    const newTpl = {
      id: Date.now(),
      name: newTplName,
      format: newTplFormat,
      size: newTplSize,
      date: 'Juli 2026',
      url: newTplUrl || '#'
    };

    const updated = [...templates, newTpl];
    setTemplates(updated);
    localStorage.setItem('hima_document_templates', JSON.stringify(updated));
    showToast('Template dokumen baru ditambahkan ke Download Center!', 'success');
    
    setNewTplName('');
    setNewTplSize('');
    setNewTplUrl('');
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Hapus template dokumen ini dari Download Center?')) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem('hima_document_templates', JSON.stringify(updated));
      showToast('Template berhasil dihapus.', 'info');
    }
  };

  // Backoffice: Manage Calendar Events (Add / Delete)
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventDate || !eventTitle || !eventDesc || !eventLocation) {
      showToast('Lengkapi seluruh detail event kalender!', 'error');
      return;
    }

    const updatedEvents = {
      ...events,
      [eventDate]: {
        title: eventTitle,
        type: eventType,
        desc: eventDesc,
        location: eventLocation
      }
    };

    setEvents(updatedEvents);
    localStorage.setItem('hima_calendar_events', JSON.stringify(updatedEvents));
    showToast('Event kalender baru berhasil didaftarkan!', 'success');

    setEventTitle('');
    setEventDesc('');
    setEventLocation('');
  };

  const handleDeleteEvent = (dateKey) => {
    if (window.confirm(`Hapus event pada tanggal ${dateKey}?`)) {
      const updated = { ...events };
      delete updated[dateKey];
      setEvents(updated);
      localStorage.setItem('hima_calendar_events', JSON.stringify(updated));
      showToast('Event kalender berhasil dihapus.', 'info');
    }
  };

  const isOperator = currentUser && (currentUser.role === 'Sekretaris Umum' || currentUser.role === 'Master Admin');

  // RENDER OPERATOR DASHBOARD VIEW
  if (isOperator) {
    const totalLettersPending = letters.filter(l => l.status === 'Pending').length;
    const totalEvents = Object.keys(events).length;

    return (
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
              <ClipboardCheck className="w-3.5 h-3.5 text-gold" /> SECRETARY BACKOFFICE CONSOLE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
              Portal Sekretariat
            </h1>
            <p className="text-xs text-slate-500 font-light">
              Kelola nomor surat BPH, arsipkan dokumen portal, dan daftarkan jadwal program kerja pada Einsten Kalender.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-gold/15 text-gold-dark border border-gold-border font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              Operator: {currentUser.name}
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white border border-gold-border rounded-2xl shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Templates</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">{templates.length} Dokumen</h3>
            </div>
          </div>
          <div className="p-5 bg-white border border-gold-border rounded-2xl shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Antrean Surat</p>
              <h3 className="text-xl font-bold text-slate-850 mt-0.5">{totalLettersPending} Pending</h3>
            </div>
          </div>
          <div className="p-5 bg-white border border-gold-border rounded-2xl shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Agenda</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalEvents} Program Kerja</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setBackofficeTab('letters'); setAccLetterId(null); }}
            className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              backofficeTab === 'letters' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            Antrean Surat BPH
          </button>
          <button
            onClick={() => setBackofficeTab('templates')}
            className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              backofficeTab === 'templates' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            Sediakan File Portal (Templates)
          </button>
          <button
            onClick={() => setBackofficeTab('events')}
            className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              backofficeTab === 'events' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            Kelola Kalender HIMA
          </button>
        </div>

        {/* Tab Contents: Letters */}
        {backofficeTab === 'letters' && (
          <div className="space-y-6">
            {accLetterId && (
              <div className="bg-slate-50 border border-gold-border rounded-2xl p-6 space-y-4 animate-slide-in">
                <h4 className="text-xs font-bold text-gold-dark uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Alokasikan Nomor Surat & File Response
                </h4>
                <form onSubmit={handleConfirmAcc} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nomor Surat Resmi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 003/HIMA-EINSTEN/VII/2026"
                      value={inputLetterNumber}
                      onChange={(e) => setInputLetterNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan / Link Berkas Balasan (Path)</label>
                    <input
                      type="text"
                      placeholder="Contoh: /Media/Template Persuratan/Surat_Peminjaman_ACC.docx"
                      value={inputResponseUrl}
                      onChange={(e) => setInputResponseUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <div className="flex gap-2 col-span-1 md:col-span-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                    >
                      Konfirmasi Setujui (ACC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccLetterId(null)}
                      className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Pengusul / Divisi</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Perihal / Tujuan</th>
                      <th className="px-6 py-4">Status & No. Surat</th>
                      <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {letters.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-455">
                          Belum ada antrean pengajuan surat resmi.
                        </td>
                      </tr>
                    ) : (
                      letters.map((letter) => (
                        <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{letter.requester}</td>
                          <td className="px-6 py-4">{letter.category}</td>
                          <td className="px-6 py-4 max-w-xs truncate">{letter.subject}</td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                letter.status === 'ACC' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-55/20' 
                                  : letter.status === 'Ditolak'
                                    ? 'bg-rose-50 text-rose-600 border-rose-55/20'
                                    : 'bg-amber-50 text-amber-600 border-amber-55/20'
                              }`}>
                                {letter.status === 'ACC' ? 'Approved' : letter.status}
                              </span>
                              {letter.letterNumber && (
                                <p className="text-[10px] font-mono text-slate-500 font-bold">{letter.letterNumber}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-1.5 items-center">
                              {letter.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => openAccForm(letter)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm"
                                  >
                                    <CheckCircle className="w-3 h-3" /> ACC
                                  </button>
                                  <button
                                    onClick={() => handleRejectLetter(letter.id)}
                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 active:scale-95 shadow-sm"
                                  >
                                    <XCircle className="w-3 h-3" /> Tolak
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleDeleteLetter(letter.id)}
                                  className="p-1.5 hover:bg-rose-50 text-rose-550 rounded-lg transition-all active:scale-95"
                                  title="Hapus Log"
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

        {/* Tab Contents: Templates (File Download Management) */}
        {backofficeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Template list */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
                <FileText className="w-4.5 h-4.5 text-gold" /> Daftar Template Dokumen Aktif
              </h3>
              <div className="space-y-3">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between shadow-sm hover:bg-slate-50/50 transition-all group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 group-hover:text-gold-dark transition-colors">{tpl.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Format: {tpl.format} • Ukuran: {tpl.size}
                      </p>
                      {tpl.url && tpl.url !== '#' && (
                        <p className="text-[9px] text-slate-400 font-mono truncate max-w-[300px] mt-0.5">Tautan: {tpl.url}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Template form */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
                <Plus className="w-4.5 h-4.5 text-gold" /> Tambah Template Baru
              </h3>
              <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
                <form onSubmit={handleAddTemplate} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Dokumen</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Format LPJ Terkini 2026"
                      value={newTplName}
                      onChange={(e) => setNewTplName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Format</label>
                      <select
                        value={newTplFormat}
                        onChange={(e) => setNewTplFormat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      >
                        <option value="DOCX">DOCX</option>
                        <option value="PDF">PDF</option>
                        <option value="XLSX">XLSX</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ukuran File</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 120 KB"
                        value={newTplSize}
                        onChange={(e) => setNewTplSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan Unduh / URL Berkas (Path)</label>
                    <input
                      type="text"
                      placeholder="Contoh: /Media/Template Persuratan/Lpj_Format.docx"
                      value={newTplUrl}
                      onChange={(e) => setNewTplUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    Tambahkan ke Portal <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: Calendar Events */}
        {backofficeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Event list */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
                <Calendar className="w-4.5 h-4.5 text-gold" /> Daftar Agenda Kalender HIMA
              </h3>
              <div className="space-y-3">
                {Object.keys(events).length === 0 ? (
                  <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-400">
                    Belum ada agenda di kalender.
                  </div>
                ) : (
                  Object.keys(events).sort().map((dateStr) => {
                    const ev = events[dateStr];
                    return (
                      <div
                        key={dateStr}
                        className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between shadow-sm hover:bg-slate-50/50 transition-all group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-gold/10 text-gold-dark border border-gold/20 px-1.5 py-0.2 rounded">
                              {dateStr.split('-').reverse().join('/')}
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              ev.type === 'hima' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ev.type === 'hima' ? 'Internal' : 'Ormawa'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-850">{ev.title}</h4>
                          <p className="text-[10px] text-slate-500 font-light leading-relaxed">{ev.desc}</p>
                          {ev.location && (
                            <p className="text-[9px] text-slate-400 font-semibold font-sans mt-0.5">
                              Tempat: <span className="text-slate-600">{ev.location}</span>
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(dateStr)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Event form */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
                <Plus className="w-4.5 h-4.5 text-gold" /> Tambah Agenda Agenda Baru
              </h3>
              <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
                <form onSubmit={handleAddEvent} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tanggal Agenda</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Judul Agenda</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rapat Pleno I HIMA 🏛️"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Agenda</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    >
                      <option value="hima">Internal HIMA EINSTEN</option>
                      <option value="ormawa">Ormawa Kampus Eksternal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tempat / Lokasi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Lab Kendali Industri / Zoom Meeting"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi Singkat</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Terangkan singkat rincian program kerja..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    Daftarkan Agenda <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER REGULAR MEMBER / PUBLIC PORTAL VIEW
  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Pengurusan Dokumen Himpunan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">PORTAL SEKRETARIAT</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Unduh berkas template resmi organisasi dan ajukan permohonan nomor surat digital secara praktis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Download Center */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <Download className="w-4.5 h-4.5 text-gold" /> Download Center (Template Dokumen)
          </h3>

          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-400">
                Belum ada template dokumen yang tersedia untuk diunduh.
              </div>
            ) : (
              templates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between hover:bg-slate-50/50 shadow-sm transition-all group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors">
                      {tpl.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Format: {tpl.format} • Ukuran: {tpl.size} • Diperbarui: {tpl.date}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (tpl.url && tpl.url !== '#') {
                        window.open(tpl.url, '_blank');
                        showToast(`Mengunduh file: ${tpl.name}...`, 'success');
                      } else {
                        showToast(`Mengunduh file: ${tpl.name}...`, 'success');
                      }
                    }}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-gold hover:border-gold hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                  >
                    Unduh <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Request Form */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <Send className="w-4.5 h-4.5 text-gold" /> Request Nomor Surat BPH
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl p-6 text-left space-y-4 relative overflow-hidden shadow-md">
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gold/5 rounded-full blur-xl"></div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Pengusul / Divisi</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Ristek / Zacky"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Surat</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 focus:outline-none focus:border-gold"
                >
                  <option value="Surat Permohonan">Surat Permohonan</option>
                  <option value="Surat Undangan">Surat Undangan</option>
                  <option value="Surat Tugas">Surat Tugas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Perihal Surat</label>
                <input 
                  type="text" 
                  required
                  placeholder="Perihal pengajuan dana / izin ruang lab..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gold text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md shadow-gold/25"
              >
                Kirim Request <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* User Table: Letters Status */}
      <div className="space-y-4 pt-4 text-left">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
          <ListFilter className="w-4.5 h-4.5 text-gold" /> Status Pengajuan Surat BPH Anda
        </h3>

        <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Nama Pengaju</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Perihal / Tujuan</th>
                  <th className="px-6 py-4">Status Otoritas</th>
                  <th className="px-6 py-4">Nomor Surat Resmi</th>
                  <th className="px-6 py-4 text-center">Berkas Balasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {letters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      Anda belum pernah mengajukan permohonan surat.
                    </td>
                  </tr>
                ) : (
                  letters.map((letter) => (
                    <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-850">{letter.requester}</td>
                      <td className="px-6 py-4">{letter.category}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]" title={letter.subject}>{letter.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          letter.status === 'ACC' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-55/20' 
                            : letter.status === 'Ditolak'
                              ? 'bg-rose-50 text-rose-600 border-rose-55/20'
                              : 'bg-amber-50 text-amber-600 border-amber-55/20'
                        }`}>
                          {letter.status === 'ACC' ? 'DISETUJUI' : letter.status === 'Ditolak' ? 'DITOLAK' : 'MENUNGGU ACC'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {letter.letterNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {letter.status === 'ACC' && letter.fileUrl && letter.fileUrl !== '#' ? (
                          <a 
                            href={letter.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 hover:bg-gold border border-slate-250 hover:border-gold hover:text-white rounded-lg text-[10px] font-bold transition-all text-slate-700 shadow-sm active:scale-95"
                          >
                            Unduh Surat <Download className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Belum tersedia</span>
                        )}
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
  );
}
