import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Terminal, Users, Globe, BookOpen, Rocket, ShoppingCart, Radio, Box, ArrowRight, Download, Send, Check } from 'lucide-react';
import ConsoleDrawer from '../components/ConsoleDrawer';
import { useCart } from '../context/CartContext';

export default function Sphere({ showToast }) {
  const location = useLocation();
  const { addToCart } = useCart();
  const [selectedDivKey, setSelectedDivKey] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form states
  const [extForm, setExtForm] = useState({ name: '', email: '', desc: '' });
  const [ristekForm, setRistekForm] = useState({ name: '', role: 'murid', subject: '', wa: '' });
  const [ristekTab, setRistekTab] = useState('vault');

  const divisions = [
    {
      key: 'bph',
      title: 'BPH (Badan Pengurus Harian)',
      icon: '⚡',
      iconComponent: <Users className="w-6 h-6 text-electricCyan" />,
      desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
    },
    {
      key: 'internal',
      title: 'Internal',
      icon: '🤝',
      iconComponent: <Users className="w-6 h-6 text-limeGreen" />,
      desc: 'Fokus pada penyelarasan kekerabatan pengurus Himpunan, penampungan aspirasi internal, dan perumusan kegiatan kebersamaan.',
    },
    {
      key: 'external',
      title: 'External Division',
      icon: '🌐',
      iconComponent: <Globe className="w-6 h-6 text-electricCyan" />,
      desc: 'Menghubungkan HIMA EINSTEIN dengan alumni, korporasi industri nuklir/kesehatan, BRIN, serta himpunan mahasiswa luar.',
    },
    {
      key: 'ristek',
      title: 'Riset & Teknologi',
      icon: '🔬',
      iconComponent: <BookOpen className="w-6 h-6 text-limeGreen" />,
      desc: 'Mendorong kecakapan mahasiswa di bidang instrumentasi nuklir melalui bank soal terintegrasi, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.',
    },
    {
      key: 'pengma',
      title: 'Pengembangan Mahasiswa',
      icon: '🚀',
      iconComponent: <Rocket className="w-6 h-6 text-electricCyan" />,
      desc: 'Fasilitas sertifikasi industri, persiapan karir, rekrutmen magang, dan kompilasi info prestasi kemahasiswaan.',
    },
    {
      key: 'danus',
      title: 'Dana Usaha',
      icon: '🛒',
      iconComponent: <ShoppingCart className="w-6 h-6 text-limeGreen" />,
      desc: 'Wirausaha mandiri Himpunan. Pembelian produk eksklusif PDH, bomber, dan merchandise resmi HIMA EINSTEIN.',
    },
    {
      key: 'kominfo',
      title: 'Komunikasi & Informasi',
      icon: '📢',
      iconComponent: <Radio className="w-6 h-6 text-electricCyan" />,
      desc: 'Media publikasi berita sains nuklir, dokumentasi kegiatan, rilis buletin triwulan EINSTEIN, dan podcast audio visual.',
    },
    {
      key: 'logistik',
      title: 'Logistik',
      icon: '📦',
      iconComponent: <Box className="w-6 h-6 text-limeGreen" />,
      desc: 'Portal peminjaman alat penunjang praktikum mahasiswa (solder, multimeter, starter kit Arduino) secara transparan.',
    }
  ];

  // Intercept open requests from dropdown
  useEffect(() => {
    if (location.state && location.state.openDivision) {
      const divKey = location.state.openDivision;
      setSelectedDivKey(divKey);
      setDrawerOpen(true);
      
      // Clear location state after opening to prevent reopen on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleCardClick = (key) => {
    setSelectedDivKey(key);
    setDrawerOpen(true);
  };

  const handleExtSubmit = (e) => {
    e.preventDefault();
    showToast(`Formulir kemitraan ${extForm.name} berhasil terkirim!`, 'success');
    setExtForm({ name: '', email: '', desc: '' });
  };

  const handleRistekSubmit = (e) => {
    e.preventDefault();
    showToast(`Pendaftaran Ristek Mengajar untuk ${ristekForm.name} berhasil!`, 'success');
    setRistekForm({ name: '', role: 'murid', subject: '', wa: '' });
  };

  // Content renderers for drawers
  const renderDrawerContent = () => {
    switch (selectedDivKey) {
      case 'bph':
        return (
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Struktur Organisasi Inti</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-bold text-limeGreen">KAHIM</span>
                  <span className="block text-[11px] text-slate-300 mt-1">Ketua Himpunan</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-bold text-limeGreen">WAKAHIM</span>
                  <span className="block text-[11px] text-slate-300 mt-1">Wakil Ketua Himpunan</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-bold text-slate-300">SEKRETARIS I & II</span>
                  <span className="block text-[10px] text-slate-400 mt-1">Administrasi & Persuratan</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-bold text-slate-300">BENDAHARA I & II</span>
                  <span className="block text-[10px] text-slate-400 mt-1">Keuangan & Anggaran</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'internal':
        return (
          <div className="space-y-4 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-limeGreen/10 flex items-center justify-center mx-auto text-limeGreen mb-4">
              <Terminal className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">CONSOL SYSTEM ACTIVE</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Rencana program kerja divisi Internal saat ini sedang dalam proses penyusunan dan sinkronisasi bersama perwakilan pengurus angkatan.
            </p>
          </div>
        );

      case 'external':
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pengajuan Kemitraan</h4>
            <form onSubmit={handleExtSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Nama Instansi/Himpunan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: HMTC ITS"
                  value={extForm.name}
                  onChange={(e) => setExtForm({ ...extForm, name: e.target.value })}
                  className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Email Kontak</label>
                <input 
                  type="email" 
                  required
                  placeholder="nama@domain.com"
                  value={extForm.email}
                  onChange={(e) => setExtForm({ ...extForm, email: e.target.value })}
                  className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Maksud Kolaborasi</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Terangkan maksud kunjungan atau kolaborasi secara ringkas..."
                  value={extForm.desc}
                  onChange={(e) => setExtForm({ ...extForm, desc: e.target.value })}
                  className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-electricBlue to-electricCyan text-white font-bold rounded-lg text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                Kirim Pengajuan <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        );

      case 'ristek':
        return (
          <div className="space-y-6">
            <div className="flex border-b border-white/5">
              <button 
                onClick={() => setRistekTab('vault')}
                className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  ristekTab === 'vault' ? 'text-electricCyan border-b-2 border-electricCyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Einstein Vault
              </button>
              <button 
                onClick={() => setRistekTab('les')}
                className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  ristekTab === 'les' ? 'text-electricCyan border-b-2 border-electricCyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ristek Mengajar
              </button>
              <button 
                onClick={() => setRistekTab('proyek')}
                className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  ristekTab === 'proyek' ? 'text-electricCyan border-b-2 border-electricCyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Proyek Collab
              </button>
            </div>

            {/* Tab: Vault */}
            {ristekTab === 'vault' && (
              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-slate-200">UTS: Mikroprosesor & Mikrokontroler</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Format: PDF • Ukuran: 2.4 MB</p>
                  </div>
                  <button 
                    onClick={() => showToast('Mengunduh soal UTS...', 'success')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-slate-200">Modul Praktikum: Detektor Radiasi Nuklir</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Format: PDF • Ukuran: 4.8 MB</p>
                  </div>
                  <button 
                    onClick={() => showToast('Mengunduh Modul...', 'success')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Les */}
            {ristekTab === 'les' && (
              <form onSubmit={handleRistekSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nama Anda"
                    value={ristekForm.name}
                    onChange={(e) => setRistekForm({ ...ristekForm, name: e.target.value })}
                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Kategori Peran</label>
                  <select
                    value={ristekForm.role}
                    onChange={(e) => setRistekForm({ ...ristekForm, role: e.target.value })}
                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                  >
                    <option value="murid">Butuh Bimbingan (Murid)</option>
                    <option value="tutor">Bersedia Mengajar (Tutor)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Mata Kuliah / Bidang</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Pemrograman C++"
                    value={ristekForm.subject}
                    onChange={(e) => setRistekForm({ ...ristekForm, subject: e.target.value })}
                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">WhatsApp Kontak</label>
                  <input 
                    type="text" 
                    required
                    placeholder="08xxxxxxxxxx"
                    value={ristekForm.wa}
                    onChange={(e) => setRistekForm({ ...ristekForm, wa: e.target.value })}
                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-electricBlue text-slate-200"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-electricBlue to-electricCyan text-white font-bold rounded-lg text-xs hover:brightness-110 active:scale-95 transition-all"
                >
                  Daftar Tutor/Murid
                </button>
              </form>
            )}

            {/* Tab: Proyek */}
            {ristekTab === 'proyek' && (
              <div className="space-y-3">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-left space-y-2 relative group overflow-hidden">
                  <span className="inline-block px-2 py-0.5 rounded bg-limeGreen/10 border border-limeGreen/20 text-[9px] font-semibold text-limeGreen uppercase tracking-wider">IoT & Nuklir</span>
                  <h5 className="text-xs font-bold text-white">Monitor Radiasi Geiger-Müller ESP32</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Membangun alat ukur paparan radiasi portable berbasis sensor IoT otonom terkoneksi database IoT.
                  </p>
                  <button 
                    onClick={() => showToast('Pendaftaran kolaborasi proyek Geiger-Müller diterima!', 'success')}
                    className="px-3 py-1.5 rounded-lg bg-limeGreen text-obsidian text-[10px] font-bold hover:brightness-110 transition-all flex items-center gap-1 active:scale-95 mt-1"
                  >
                    Gabung Proyek <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'pengma':
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Agenda Prestasi & Sertifikasi</h4>
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-left space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-electricBlue/10 border border-electricBlue/20 text-[9px] font-semibold text-electricCyan uppercase tracking-wider">Sertifikasi</span>
              <h5 className="text-xs font-bold text-white">Pelatihan & Sertifikasi PLC Siemens S7-1200</h5>
              <p className="text-[10px] text-slate-400">Jadwal: 25 Juli 2026 | Lokasi: Lab Kendali Industri Poltek Nuklir</p>
              <button 
                onClick={() => showToast('Pendaftaran Sertifikasi PLC berhasil!', 'success')}
                className="px-3 py-1.5 rounded-lg bg-electricBlue text-white text-[10px] font-bold hover:brightness-110 transition-all active:scale-95"
              >
                Daftar Pelatihan
              </button>
            </div>
          </div>
        );

      case 'danus':
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Produk Populer</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col text-left space-y-2">
                <span className="text-2xl text-center">👕</span>
                <span className="text-[11px] font-bold text-slate-200 truncate">PDH HIMA 2026</span>
                <span className="text-[10px] text-limeGreen">Rp 135.000</span>
                <button 
                  onClick={() => {
                    addToCart('PDH EINSTEIN 2026', 135000);
                    showToast('PDH HIMA ditambahkan ke keranjang!', 'success');
                  }}
                  className="w-full py-1 bg-limeGreen text-obsidian text-[10px] font-bold rounded-lg hover:brightness-110 transition-all active:scale-95"
                >
                  + Tambah
                </button>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col text-left space-y-2">
                <span className="text-2xl text-center">🧥</span>
                <span className="text-[11px] font-bold text-slate-200 truncate">Bomber Phótisma</span>
                <span className="text-[10px] text-limeGreen">Rp 185.000</span>
                <button 
                  onClick={() => {
                    addToCart('Bomber Phótisma', 185000);
                    showToast('Bomber Phótisma ditambahkan ke keranjang!', 'success');
                  }}
                  className="w-full py-1 bg-limeGreen text-obsidian text-[10px] font-bold rounded-lg hover:brightness-110 transition-all active:scale-95"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        );

      case 'kominfo':
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Podcast Terkini</h4>
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-left space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-semibold text-rose-400 uppercase tracking-wider">Audio Podcast</span>
              <h5 className="text-xs font-bold text-white">Eps 12: Masa Depan Small Modular Reactor di Indonesia</h5>
              <p className="text-[10px] text-slate-400">Pembicara: Staf Ahli BRIN Yogyakarta</p>
              <button 
                onClick={() => showToast('Memutar podcast episode 12...', 'success')}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-[10px] font-bold hover:brightness-110 transition-all active:scale-95"
              >
                Putar Podcast
              </button>
            </div>
          </div>
        );

      case 'logistik':
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Peminjaman Cepat</h4>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-left">
              <div>
                <h5 className="text-xs font-bold text-slate-200">Multimeter Sanwa CD800a</h5>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold uppercase">Tersedia</span>
              </div>
              <Link
                to="/space"
                className="px-3 py-1.5 bg-limeGreen text-obsidian text-[10px] font-bold rounded-lg hover:brightness-110 transition-all"
              >
                Sewa di Space
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedDiv = divisions.find(d => d.key === selectedDivKey) || {};

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-electricBlue/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Sektor Kepengurusan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">EINSTEIN SPHERE</h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
          Pusat koordinasi 8 divisi Kabinet Phótisma. Pilih divisi di bawah untuk membuka laci konsol program kerja detail.
        </p>
      </div>

      {/* Grid of 8 division cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {divisions.map((div) => (
          <div
            key={div.key}
            onClick={() => handleCardClick(div.key)}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left cursor-pointer hover:border-electricCyan/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group min-h-[180px] shadow-lg relative overflow-hidden"
          >
            {/* Glowing spot */}
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-electricCyan/5 group-hover:bg-electricCyan/10 transition-colors rounded-full blur-xl"></div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {div.iconComponent}
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-electricCyan transition-colors">
                {div.title}
              </h3>
            </div>
            
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold group-hover:text-white transition-colors">
              Buka Console <ArrowRight className="w-3.5 h-3.5 text-limeGreen" />
            </span>
          </div>
        ))}
      </div>

      {/* Right sliding console drawer */}
      <ConsoleDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedDiv.title || ''}
        icon={selectedDiv.icon || ''}
        description={selectedDiv.desc || ''}
      >
        {renderDrawerContent()}
      </ConsoleDrawer>
    </div>
  );
}
