import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Terminal, Globe, BookOpen, Rocket, ShoppingCart, Radio, Box, Send, Download, Check, ShieldCheck, Shirt, Calendar, Plus, MessageSquare, FileText, Code, Laptop, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_DRIVE_VAULT } from '../data/driveVaultItems';

// Helper component for coming soon sections
function ComingSoon({ title }) {
  return (
    <div className="space-y-3 text-center py-16 max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold text-slate-800 tracking-wider uppercase">
        Segera Hadir
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed font-light">
        Halaman Divisi {title} sedang dalam proses persiapan dan akan segera diperbarui.
      </p>
    </div>
  );
}

function DivisionProgramsView({ divisionKey, divisionName }) {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`hima_division_programs_${divisionKey}`);
    if (saved) {
      setPrograms(JSON.parse(saved));
    } else {
      // Starter program for empty divisions so it looks nice
      const starter = [
        {
          id: 1,
          name: `Program Kerja Unggulan ${divisionName}`,
          desc: `Pemaparan program kerja awal divisi ${divisionName} untuk menyelaraskan target Kabinet Photisma HIMA EINSTEN.`,
          status: 'Terencana'
        }
      ];
      localStorage.setItem(`hima_division_programs_${divisionKey}`, JSON.stringify(starter));
      setPrograms(starter);
    }
  }, [divisionKey, divisionName]);

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Pemaparan Program Kerja Divisi
        </h3>
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
          [ {programs.length} PROGRAM RANCANGAN ]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((p) => (
          <div 
            key={p.id} 
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-3 relative group overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-2 h-full bg-gold/10 group-hover:bg-gold/30 transition-colors"></div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                p.status === 'Terlaksana'
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-600'
                  : p.status === 'Sedang Berjalan'
                  ? 'bg-amber-50 border-amber-250 text-amber-600'
                  : 'bg-slate-100 border-slate-205 text-slate-550'
              }`}>
                {p.status}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 group-hover:text-gold-dark transition-all">
              {p.name}
            </h4>

            <p className="text-[11px] text-slate-555 leading-relaxed font-light">
              {p.desc}
            </p>

            {p.date && (
              <div className="border-t border-slate-100 pt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-550 font-mono">
                <span className="flex items-center gap-1">📅 {p.date}</span>
                {p.time && <span className="flex items-center gap-1">🕒 {p.time}</span>}
                {p.location && <span className="flex items-center gap-1">📍 {p.location}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DivisionDetail({ showToast }) {
  const { divisionKey } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  // Ristek tabs
  const [ristekTab, setRistekTab] = useState('vault');
  const [vaultCategory, setVaultCategory] = useState('materi'); // default to 'materi'
  const [vaultSearch, setVaultSearch] = useState('');

  // Form states
  const [ristekForm, setRistekForm] = useState({ name: currentUser?.name || '', role: 'murid', subject: '', wa: '' });
  const [isSubmittingRistek, setIsSubmittingRistek] = useState(false);
  const [vaultItems, setVaultItems] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);

  const loadVaultItems = () => {
    const VAULT_VERSION = 'v5_clean_plc_items';
    const savedVersion = localStorage.getItem('hima_vault_version');
    const savedVault = localStorage.getItem('hima_vault');
    
    let loadedVault = DEFAULT_DRIVE_VAULT;
    if (savedVersion === VAULT_VERSION && savedVault !== null) {
      try {
        const parsed = JSON.parse(savedVault);
        if (Array.isArray(parsed) && parsed.length > 5) {
          loadedVault = parsed.filter(item => item.id !== 100 && !item.title?.includes('Google Drive Utama') && !item.title?.includes('Google Drive Induk'));
        } else {
          loadedVault = DEFAULT_DRIVE_VAULT;
          localStorage.setItem('hima_vault', JSON.stringify(DEFAULT_DRIVE_VAULT));
          localStorage.setItem('hima_vault_version', VAULT_VERSION);
        }
      } catch (e) {
        console.error('Failed to parse vault:', e);
      }
    } else {
      localStorage.setItem('hima_vault', JSON.stringify(DEFAULT_DRIVE_VAULT));
      localStorage.setItem('hima_vault_version', VAULT_VERSION);
      loadedVault = DEFAULT_DRIVE_VAULT;
    }
    setVaultItems(loadedVault);
  };

  useEffect(() => {
    // Vault Items
    loadVaultItems();

    const handleSync = () => loadVaultItems();
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    const interval = setInterval(loadVaultItems, 1000);

    // Ristek Schedules
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
      setCollabProjects(JSON.parse(savedProjects));
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
      setCollabProjects(DEFAULT_PROJECTS);
    }

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      clearInterval(interval);
    };
  }, []);

  const divisions = {
    bph: {
      title: 'Badan Pengurus Harian',
      icon: '⚡',
      iconComponent: <Users className="w-8 h-8 text-gold" />,
      desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
      renderContent: () => {
        const bphCore = [
          {
            name: 'M. Iqbal Nur Huda',
            nim: '022400042',
            role: 'Ketua Himpunan',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Kahim_M. Iqbal Nur Huda - 022400042.JPG'
          },
          {
            name: 'Rafie Asfa Raditya Aryanto',
            nim: '022500041',
            role: 'Wakil Ketua Himpunan',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Wakahim_Rafie Asfa Raditya Aryanto - 022500041.JPG'
          },
          {
            name: 'Nailah Qarirah',
            nim: '022400051',
            role: 'Sekretaris I',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 1_Nailah Qarirah - 022400051.JPG'
          },
          {
            name: 'Bunga Nafisya Putri',
            nim: '022500009',
            role: 'Sekretaris II',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 2_Bunga Nafisya Putri - 022500009.JPG'
          },
          {
            name: 'Relvina',
            nim: '022400039',
            role: 'Bendahara I',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 1_Relvina - 022400039.JPG'
          },
          {
            name: 'Rizkiana Ramadhani',
            nim: '022500046',
            role: 'Bendahara II',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 2_Rizkiana Ramadhani - 022500046.JPG'
          }
        ];

        const kadivList = [
          {
            name: 'Adiguna Nugroho Halomoan',
            nim: '022400025',
            role: 'Kadiv Riset & Teknologi',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Ristek/Kepala Divisi Riset dan Teknologi_Adiguna Nugroho Halomoan - 022400025.JPG'
          },
          {
            name: 'Rabbany Al-Malika Ifadzla',
            nim: '022400006',
            role: 'Kadiv Dana Usaha',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Dana Usaha/Kepala Divisi Dana Usaha_Rabbany Al-Malika Ifadzla - 022400006.JPG'
          },
          {
            name: 'Rakan Ibrahim Widjisasono',
            nim: '022400031',
            role: 'Kadiv Aset & Logistik',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Aset Dan Logistik/Kepala Divisi Aset dan Logistik_Rakan Ibrahim Widjisasono - 022400031.JPG'
          },
          {
            name: 'Kunti Aisyatuzzahra',
            nim: '022400045',
            role: 'Kadiv Hubungan Eksternal',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/External/Kepala Divisi Eksternal_Kunti Aisyatuzzahra - 022400045.JPG'
          },
          {
            name: 'Hafizh Maulana Wijaya',
            nim: '022400019',
            role: 'Kadiv Hubungan Internal',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Internal/Kepala Divisi Internal_Hafizh Maulana Wijaya - 022400019.JPG'
          },
          {
            name: 'Sunniy',
            nim: '022400041',
            role: 'Kadiv Komunikasi & Informasi',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Kominfo/Kepala Divisi Komunikasi dan Informasi_Sunniy - 022400041.JPG'
          },
          {
            name: 'Farrelega Zhafran Vito Ardhana',
            nim: '022400038',
            role: 'Kadiv Pengembangan Mahasiswa',
            photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Pema/Kepala Divisi Pengembangan Mahasiswa_Farrelega Zhafran Vito Ardhana - 022400038.JPG'
          }
        ];

        return (
          <div className="space-y-10 text-left">
            {/* Core BPH Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-l-2 border-gold pl-2">
                Struktur Organisasi Inti (BPH Core)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {bphCore.map((p) => (
                  <div 
                    key={p.nim}
                    className="bg-white border border-gold-border rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col group shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                      <img 
                        src={p.photo} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x200/fffbeb/d97706?text=" + encodeURIComponent(p.name);
                        }}
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] font-extrabold text-gold-dark uppercase tracking-widest">{p.role}</span>
                        <h5 className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-snug">{p.name}</h5>
                      </div>
                      <span className="block text-[8px] text-slate-400 font-mono mt-1">NIM: {p.nim}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Division Heads Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-l-2 border-gold pl-2">
                Jajaran Kepala Divisi (Kadiv) Himpunan
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {kadivList.map((p) => (
                  <div 
                    key={p.nim}
                    className="bg-white border border-gold-border rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col group shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                      <img 
                        src={p.photo} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x200/fffbeb/d97706?text=" + encodeURIComponent(p.name);
                        }}
                      />
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[7px] font-extrabold text-gold-dark uppercase tracking-widest leading-none mb-1">{p.role}</span>
                        <h5 className="text-[9px] font-bold text-slate-800 line-clamp-2 leading-tight">{p.name}</h5>
                      </div>
                      <span className="block text-[7px] text-slate-400 font-mono mt-1 leading-none">NIM: {p.nim}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    },
    internal: {
      title: 'Internal',
      icon: '🤝',
      iconComponent: <Users className="w-8 h-8 text-gold" />,
      desc: 'Fokus pada penyelarasan kekerabatan pengurus Himpunan, penampungan aspirasi internal, dan perumusan kegiatan kebersamaan.',
      renderContent: () => <DivisionProgramsView divisionKey="internal" divisionName="Internal" />
    },
    external: {
      title: 'External Division',
      icon: '🌐',
      iconComponent: <Globe className="w-8 h-8 text-gold" />,
      desc: 'Menghubungkan HIMA EINSTEN dengan alumni, korporasi industri nuklir/kesehatan, BRIN, serta himpunan mahasiswa luar.',
      renderContent: () => <DivisionProgramsView divisionKey="external" divisionName="External" />
    },
    ristek: {
      title: 'Riset & Teknologi',
      icon: '🔬',
      iconComponent: <BookOpen className="w-8 h-8 text-gold" />,
      desc: 'Mendorong kecakapan mahasiswa di bidang instrumentasi nuklir melalui bank soal terintegrasi, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.',
      renderContent: () => {
        const handleRistekSubmit = async (e) => {
          e.preventDefault();
          if (!ristekForm.name || !ristekForm.subject || !ristekForm.wa) {
            showToast('Mohon lengkapi seluruh kolom formulir!', 'error');
            return;
          }
          setIsSubmittingRistek(true);

          const roleLabel = ristekForm.role === 'tutor' ? 'Bersedia Mengajar (Tutor)' : 'Butuh Bimbingan (Murid)';
          const newRequest = {
            id: Date.now(),
            requesterName: ristekForm.name.trim(),
            userEmail: currentUser?.email || 'guest@einsten.com',
            type: 'Ristek Mengajar',
            role: ristekForm.role,
            subject: ristekForm.subject.trim(),
            wa: ristekForm.wa.trim(),
            status: 'Pending',
            timestamp: Date.now()
          };
          const saved = localStorage.getItem('hima_ristek_requests');
          const list = saved ? JSON.parse(saved) : [];
          const updated = [...list, newRequest];
          localStorage.setItem('hima_ristek_requests', JSON.stringify(updated));

          // Save notification
          const newNotif = {
            id: Date.now() + 1,
            recipientEmail: 'Adiguna Nugroho Halomoan@einsten.com',
            message: `Pendaftaran Baru! ${ristekForm.name.trim()} mendaftar sebagai ${roleLabel} untuk mata kuliah/bidang "${ristekForm.subject.trim()}".`,
            read: false,
            timestamp: Date.now()
          };
          const savedNotifs = localStorage.getItem('hima_notifications');
          const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
          localStorage.setItem('hima_notifications', JSON.stringify([...notifsList, newNotif]));

          // Direct background sending via serverless WhatsApp Gateway API to 085175420692 (6285175420692)
          const text = `Halo Kadiv Riset & Teknologi HIMPUNAN EINSTEN.COM! 🎓\n\nAda pendaftaran baru untuk program *Ristek Mengajar*:\n- *Nama Lengkap:* ${ristekForm.name.trim()}\n- *Kategori Peran:* ${roleLabel}\n- *Mata Kuliah / Bidang:* ${ristekForm.subject.trim()}\n- *WhatsApp Kontak:* ${ristekForm.wa.trim()}\n- *Tanggal Pendaftaran:* ${new Date().toLocaleDateString('id-ID')}\n\nMohon verifikasi & tindak lanjuti pendaftaran kegiatan ini. Terima kasih!`;
          const targetWa = '6285175420692';

          try {
            await fetch('/api/send-wa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: targetWa, message: text })
            });
          } catch (err) {
            try {
              await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: {
                  'Authorization': 'oAkLBXzaU41RszNf6j78',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ target: targetWa, message: text })
              });
            } catch (e) {
              console.error('WA background send error:', e);
            }
          }

          setIsSubmittingRistek(false);
          showToast(`Pendaftaran Ristek Mengajar berhasil & otomatis terkirim ke WhatsApp Kadiv Ristek (085175420692)!`, 'success');
          setRistekForm({ name: currentUser?.name || '', role: 'murid', subject: '', wa: '' });
        };

        const isSoftware = (item) => {
          const t = (item.type || '').toLowerCase();
          const title = (item.title || '').toLowerCase();
          return t.includes('software') || t.includes('aplikasi') || t.includes('tool') || title.includes('labview') || title.includes('proteus') || title.includes('ide') || title.includes('matlab') || title.includes('multisim') || title.includes('cvavr') || title.includes('eagle') || title.includes('fusion') || title.includes('progisp') || title.includes('webots') || title.includes('plc') || title.includes('omron') || title.includes('cx');
        };

        const softwareList = vaultItems.filter(i => isSoftware(i));
        const materiList = vaultItems.filter(i => !isSoftware(i));
        const categoryItems = vaultCategory === 'software' ? softwareList : vaultCategory === 'materi' ? materiList : vaultItems;

        const displayVaultItems = categoryItems.filter(i => {
          if (!vaultSearch) return true;
          const q = vaultSearch.toLowerCase();
          return (i.title || '').toLowerCase().includes(q) || (i.desc || '').toLowerCase().includes(q) || (i.type || '').toLowerCase().includes(q);
        });

        return (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Navigation Tabs: Einsten Vault vs Ristek Mengajar */}
            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none border-b border-slate-200 gap-2 pb-1 justify-center sm:justify-start">
              <button 
                onClick={() => setRistekTab('vault')}
                className={`px-5 pb-3 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  ristekTab === 'vault' ? 'text-gold border-b-2 border-gold font-extrabold' : 'text-slate-400 hover:text-slate-700 border-b-2 border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Einsten Vault
              </button>
              <button 
                onClick={() => setRistekTab('les')}
                className={`px-5 pb-3 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  ristekTab === 'les' ? 'text-gold border-b-2 border-gold font-extrabold' : 'text-slate-400 hover:text-slate-700 border-b-2 border-transparent'
                }`}
              >
                <Users className="w-4 h-4" /> Ristek Mengajar
              </button>
            </div>

            {/* Tab: Einsten Vault (Divided into Materi & Software) */}
            {ristekTab === 'vault' && (
              <div className="space-y-4 text-left animate-in fade-in duration-200">
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    type="text"
                    value={vaultSearch}
                    onChange={(e) => setVaultSearch(e.target.value)}
                    placeholder="Cari software, materi kuliah, bank soal UAS/UTS, modul praktikum..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-gold shadow-sm"
                  />
                  {vaultSearch && (
                    <button 
                      onClick={() => setVaultSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Switcher */}
                <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setVaultCategory('materi')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      vaultCategory === 'materi'
                        ? 'bg-white text-gold-dark shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-gold" /> Bank Soal & Materi Ajar ({materiList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultCategory('software')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      vaultCategory === 'software'
                        ? 'bg-white text-gold-dark shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 text-gold" /> Software Praktikum ({softwareList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      vaultCategory === 'all'
                        ? 'bg-white text-gold-dark shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Semua Berkas ({vaultItems.length})
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {displayVaultItems.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gold-border rounded-2xl text-slate-450 shadow-sm space-y-2">
                      <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">Tidak ada berkas yang cocok dengan pencarian "{vaultSearch}".</p>
                    </div>
                  ) : (
                    displayVaultItems.map((item) => {
                      const itemIsSoftware = isSoftware(item);
                      return (
                        <div 
                          key={item.id} 
                          className="p-4 bg-white border border-gold-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/40 shadow-sm transition-all group hover:shadow-md"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                              itemIsSoftware 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:border-gold group-hover:text-gold' 
                                : 'bg-amber-50 border-amber-200 text-amber-600 group-hover:border-gold group-hover:text-gold'
                            }`}>
                              {itemIsSoftware ? <Code className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  itemIsSoftware
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {itemIsSoftware ? 'Software Praktikum' : 'Materi / Bank Soal'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Ukuran: {item.size}
                                </span>
                              </div>

                              <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-gold-dark transition-colors">
                                {item.title}
                              </h5>

                              {item.desc && (
                                <p className="text-[11px] text-slate-500 font-light leading-snug">
                                  {item.desc}
                                </p>
                              )}
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              if (item.url && item.url !== '#') {
                                window.open(item.url, '_blank');
                                showToast(`Membuka link unduhan: ${item.title}...`, 'success');
                              } else {
                                showToast(`Berkas siap diunduh: ${item.title}`, 'info');
                              }
                            }}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gold hover:brightness-110 text-white font-bold text-xs transition-all active:scale-95 shadow-sm shadow-gold/20 shrink-0 cursor-pointer"
                            title="Unduh Berkas / Software"
                          >
                            <Download className="w-3.5 h-3.5 text-white" /> Download
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* Tab: Ristek Mengajar */}
            {ristekTab === 'les' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left animate-in fade-in duration-200">
                {/* Form column */}
                <div className="md:col-span-5 space-y-3">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5 text-gold" /> Pendaftaran Tutor / Murid
                  </h5>
                  <form onSubmit={handleRistekSubmit} className="space-y-4 p-5 bg-white border border-gold-border rounded-2xl shadow-sm">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nama Anda"
                        value={ristekForm.name}
                        onChange={(e) => setRistekForm({ ...ristekForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Peran</label>
                      <select
                        value={ristekForm.role}
                        onChange={(e) => setRistekForm({ ...ristekForm, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      >
                        <option value="murid">Butuh Bimbingan (Murid)</option>
                        <option value="tutor">Bersedia Mengajar (Tutor)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Mata Kuliah / Bidang</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Contoh: Pemrograman C++"
                        value={ristekForm.subject}
                        onChange={(e) => setRistekForm({ ...ristekForm, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">WhatsApp Kontak</label>
                      <input 
                        type="text" 
                        required
                        placeholder="08xxxxxxxxxx"
                        value={ristekForm.wa}
                        onChange={(e) => setRistekForm({ ...ristekForm, wa: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingRistek}
                      className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingRistek ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mengirim Notifikasi WA...</span>
                        </>
                      ) : (
                        'Daftar Tutor/Murid'
                      )}
                    </button>
                  </form>
                </div>

                {/* Schedule column */}
                <div className="md:col-span-7 space-y-3">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-gold" /> Jadwal Kegiatan Mengajar Sebaya
                  </h5>
                  
                  <div className="space-y-3">
                    {schedules.length === 0 ? (
                      <div className="text-center py-8 bg-white border border-gold-border rounded-2xl text-slate-400">
                        Belum ada jadwal mengajar terdaftar.
                      </div>
                    ) : (
                      schedules.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-4 bg-white border border-gold-border rounded-2xl space-y-2 shadow-sm hover:border-gold/30 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold bg-gold/10 text-gold-dark border border-gold/20 px-2 py-0.5 rounded">
                              {item.date}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {item.time}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                          <p className="text-[10px] text-slate-500 leading-normal font-light">
                            Materi: {item.desc}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">
                            Tutor: {item.tutor} • Ruang: {item.room}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    },
    pengma: {
      title: 'Pengembangan Mahasiswa',
      icon: '🚀',
      iconComponent: <Rocket className="w-8 h-8 text-gold" />,
      desc: 'Fasilitas sertifikasi industri, persiapan karir, rekrutmen magang, dan kompilasi info prestasi kemahasiswaan.',
      renderContent: () => <DivisionProgramsView divisionKey="pengma" divisionName="Pengembangan Mahasiswa" />
    },
    danus: {
      title: 'Dana Usaha',
      icon: '🛒',
      iconComponent: <ShoppingCart className="w-8 h-8 text-gold" />,
      desc: 'Wirausaha mandiri Himpunan. Pembelian produk eksklusif PDH, barang dagangan, dan merchandise resmi HIMA EINSTEN.',
      renderContent: () => (
        <div className="space-y-6 max-w-xl mx-auto">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left">Produk Populer Danus</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gold-border rounded-2xl flex flex-col justify-between text-left space-y-3 shadow-sm hover:border-gold/30 transition-all">
              <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                <img src="/Media/Media yg dijual/Baju PDH Elins 180.000/PDH Einsten.png" alt="Baju PDH Elins" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">Baju PDH Elins</span>
              <span className="text-xs text-gold-dark font-semibold">Rp 180.000</span>
              <button 
                onClick={() => {
                  addToCart('Baju PDH Elins', 180000);
                  showToast('Baju PDH Elins ditambahkan ke keranjang!', 'success');
                }}
                className="w-full py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all active:scale-95"
              >
                + Tambah
              </button>
            </div>
            <div className="p-4 bg-white border border-gold-border rounded-2xl flex flex-col justify-between text-left space-y-3 shadow-sm hover:border-gold/30 transition-all">
              <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                <img src="/Media/Media yg dijual/Magiccom 120.000/magiccom.png" alt="Magic Com" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">Magic Com</span>
              <span className="text-xs text-gold-dark font-semibold">Rp 120.000</span>
              <button 
                onClick={() => {
                  addToCart('Magic Com', 120000);
                  showToast('Magic Com ditambahkan ke keranjang!', 'success');
                }}
                className="w-full py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all active:scale-95"
              >
                + Tambah
              </button>
            </div>
          </div>
          <div className="pt-4 text-center">
            <Link 
              to="/market"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
            >
              Buka Halaman Einsten Market Lengkap
            </Link>
          </div>
        </div>
      )
    },
    kominfo: {
      title: 'Komunikasi & Informasi',
      icon: '📢',
      iconComponent: <Radio className="w-8 h-8 text-gold" />,
      desc: 'Media publikasi berita sains nuklir, dokumentasi kegiatan, rilis buletin triwulan EINSTEN, dan podcast audio visual.',
      renderContent: () => <DivisionProgramsView divisionKey="kominfo" divisionName="Komunikasi & Informasi" />
    },
    logistik: {
      title: 'Logistik',
      icon: '📦',
      iconComponent: <Box className="w-8 h-8 text-gold" />,
      desc: 'Portal peminjaman alat penunjang praktikum mahasiswa (solder, multimeter, starter kit Arduino) secara transparan.',
      renderContent: () => (
        <div className="max-w-md mx-auto space-y-4">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left mb-3">Peminjaman Cepat</h4>
          <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between text-left shadow-sm">
            <div>
              <h5 className="text-xs font-bold text-slate-800">Multimeter Sanwa CD800a</h5>
              <span className="inline-block mt-1 px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded font-bold uppercase tracking-wider">Tersedia</span>
            </div>
            <Link
              to="/space"
              className="px-4 py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-sm"
            >
              Booking Alat
            </Link>
          </div>
        </div>
      )
    }
  };

  const currentDiv = divisions[divisionKey];

  // Safeguard: Redirect if divisionKey is invalid
  useEffect(() => {
    if (!currentDiv) {
      navigate('/sphere');
    }
  }, [divisionKey, currentDiv, navigate]);

  if (!currentDiv) return null;

  return (
    <div className="relative pt-24 pb-16 space-y-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold/5 glow-orb"></div>
      
      {/* Back Button */}
      <div className="text-left relative z-10">
        <Link 
          to="/sphere" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-gold" /> Kembali ke Sphere
        </Link>
      </div>

      {/* Main Panel wrapper */}
      <div className="glass-deep rounded-2xl p-6 md:p-8 space-y-6 relative z-10 text-slate-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 pb-6 text-left">
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-start gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 flex items-center justify-center shadow-inner shrink-0">
                {currentDiv.iconComponent}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-wider text-left">
                {currentDiv.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light max-w-2xl text-left">
              {currentDiv.desc}
            </p>
          </div>
        </div>

        {/* Dynamic Inner Content */}
        <div className="pt-4">
          {currentDiv.renderContent()}
        </div>
      </div>
    </div>
  );
}
