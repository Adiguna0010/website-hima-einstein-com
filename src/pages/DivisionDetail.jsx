import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Terminal, Globe, BookOpen, Rocket, ShoppingCart, Radio, Box, Send, Download, Check, ShieldCheck, Shirt } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function DivisionDetail({ showToast }) {
  const { divisionKey } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Ristek tabs
  const [ristekTab, setRistekTab] = useState('vault');

  // Form states
  const [extForm, setExtForm] = useState({ name: '', email: '', desc: '' });
  const [ristekForm, setRistekForm] = useState({ name: '', role: 'murid', subject: '', wa: '' });

  const divisions = {
    bph: {
      title: 'Badan Pengurus Harian',
      icon: '⚡',
      iconComponent: <Users className="w-8 h-8 text-gold" />,
      desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
      renderContent: () => (
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left">Struktur Organisasi Inti</h4>
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gold-border rounded-2xl text-center shadow-sm">
                <span className="block text-sm font-bold text-gold-dark">KAHIM</span>
                <span className="block text-xs text-slate-500 mt-1">Ketua Himpunan</span>
              </div>
              <div className="p-4 bg-white border border-gold-border rounded-2xl text-center shadow-sm">
                <span className="block text-sm font-bold text-gold-dark">WAKAHIM</span>
                <span className="block text-xs text-slate-500 mt-1">Wakil Ketua Himpunan</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gold-border rounded-2xl text-center shadow-sm">
                <span className="block text-sm font-bold text-slate-700">SEKRETARIS I & II</span>
                <span className="block text-[11px] text-slate-500 mt-1">Administrasi & Persuratan</span>
              </div>
              <div className="p-4 bg-white border border-gold-border rounded-2xl text-center shadow-sm">
                <span className="block text-sm font-bold text-slate-700">BENDAHARA I & II</span>
                <span className="block text-[11px] text-slate-500 mt-1">Keuangan & Anggaran</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    internal: {
      title: 'Internal',
      icon: '🤝',
      iconComponent: <Users className="w-8 h-8 text-gold" />,
      desc: 'Fokus pada penyelarasan kekerabatan pengurus Himpunan, penampungan aspirasi internal, dan perumusan kegiatan kebersamaan.',
      renderContent: () => (
        <div className="space-y-4 text-center py-10 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto text-gold mb-4 shadow-inner">
            <Terminal className="w-8 h-8 animate-pulse" />
          </div>
          <h4 className="text-base font-bold text-slate-800">CONSOL SYSTEM ACTIVE</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rencana program kerja divisi Internal saat ini sedang dalam proses penyusunan dan sinkronisasi bersama perwakilan pengurus angkatan.
          </p>
        </div>
      )
    },
    external: {
      title: 'External Division',
      icon: '🌐',
      iconComponent: <Globe className="w-8 h-8 text-gold" />,
      desc: 'Menghubungkan HIMA EINSTEIN dengan alumni, korporasi industri nuklir/kesehatan, BRIN, serta himpunan mahasiswa luar.',
      renderContent: () => {
        const handleExtSubmit = (e) => {
          e.preventDefault();
          showToast(`Formulir kemitraan ${extForm.name} berhasil terkirim!`, 'success');
          setExtForm({ name: '', email: '', desc: '' });
        };
        return (
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left mb-4">Pengajuan Kemitraan</h4>
            <form onSubmit={handleExtSubmit} className="space-y-4 text-left p-6 bg-white border border-gold-border rounded-2xl shadow-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Nama Instansi / Himpunan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: HMTC ITS"
                  value={extForm.name}
                  onChange={(e) => setExtForm({ ...extForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-gold text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Email Kontak</label>
                <input 
                  type="email" 
                  required
                  placeholder="nama@domain.com"
                  value={extForm.email}
                  onChange={(e) => setExtForm({ ...extForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-gold text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Maksud Kolaborasi</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Terangkan maksud kunjungan atau kolaborasi secara ringkas..."
                  value={extForm.desc}
                  onChange={(e) => setExtForm({ ...extForm, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-gold text-slate-800"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md shadow-gold/20"
              >
                Kirim Pengajuan <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        );
      }
    },
    ristek: {
      title: 'Riset & Teknologi',
      icon: '🔬',
      iconComponent: <BookOpen className="w-8 h-8 text-gold" />,
      desc: 'Mendorong kecakapan mahasiswa di bidang instrumentasi nuklir melalui bank soal terintegrasi, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.',
      renderContent: () => {
        const handleRistekSubmit = (e) => {
          e.preventDefault();
          showToast(`Pendaftaran Ristek Mengajar untuk ${ristekForm.name} berhasil!`, 'success');
          setRistekForm({ name: '', role: 'murid', subject: '', wa: '' });
        };
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setRistekTab('vault')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  ristekTab === 'vault' ? 'text-gold border-b-2 border-gold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Einstein Vault
              </button>
              <button 
                onClick={() => setRistekTab('les')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  ristekTab === 'les' ? 'text-gold border-b-2 border-gold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Ristek Mengajar
              </button>
              <button 
                onClick={() => setRistekTab('proyek')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  ristekTab === 'proyek' ? 'text-gold border-b-2 border-gold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Proyek Collab
              </button>
            </div>

            {/* Tab: Vault */}
            {ristekTab === 'vault' && (
              <div className="space-y-3 text-left">
                <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between shadow-sm hover:border-gold/30 transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">UTS: Mikroprosesor & Mikrokontroler</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Format: PDF • Ukuran: 2.4 MB</p>
                  </div>
                  <button 
                    onClick={() => showToast('Mengunduh soal UTS...', 'success')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between shadow-sm hover:border-gold/30 transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Modul Praktikum: Detektor Radiasi Nuklir</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Format: PDF • Ukuran: 4.8 MB</p>
                  </div>
                  <button 
                    onClick={() => showToast('Mengunduh Modul...', 'success')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Les */}
            {ristekTab === 'les' && (
              <form onSubmit={handleRistekSubmit} className="space-y-4 text-left p-6 bg-white border border-gold-border rounded-2xl shadow-sm max-w-md mx-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Kategori Peran</label>
                  <select
                    value={ristekForm.role}
                    onChange={(e) => setRistekForm({ ...ristekForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="murid">Butuh Bimbingan (Murid)</option>
                    <option value="tutor">Bersedia Mengajar (Tutor)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Mata Kuliah / Bidang</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">WhatsApp Kontak</label>
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
                  className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20"
                >
                  Daftar Tutor/Murid
                </button>
              </form>
            )}

            {/* Tab: Proyek */}
            {ristekTab === 'proyek' && (
              <div className="space-y-3 text-left">
                <div className="p-5 bg-white border border-gold-border rounded-2xl space-y-3 shadow-sm hover:border-gold/30 transition-all">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[9px] font-bold text-gold-dark uppercase tracking-wider">IoT & Nuklir</span>
                  <h5 className="text-sm font-bold text-slate-800">Monitor Radiasi Geiger-Müller ESP32</h5>
                  <p className="text-xs text-slate-500 leading-normal">
                    Membangun alat ukur paparan radiasi portable berbasis sensor IoT otonom terkoneksi database IoT.
                  </p>
                  <button 
                    onClick={() => showToast('Pendaftaran kolaborasi proyek Geiger-Müller diterima!', 'success')}
                    className="px-4 py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-sm"
                  >
                    Gabung Proyek
                  </button>
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
      renderContent: () => (
        <div className="max-w-md mx-auto space-y-4">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left mb-3">Agenda Prestasi & Sertifikasi</h4>
          <div className="p-5 bg-white border border-gold-border rounded-2xl text-left space-y-3 shadow-sm">
            <span className="inline-block px-2.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[9px] font-bold text-gold-dark uppercase tracking-wider">Sertifikasi</span>
            <h5 className="text-sm font-bold text-slate-800">Pelatihan & Sertifikasi PLC Siemens S7-1200</h5>
            <p className="text-xs text-slate-500">Jadwal: 25 Juli 2026 | Lokasi: Lab Kendali Industri Poltek Nuklir</p>
            <button 
              onClick={() => showToast('Pendaftaran Sertifikasi PLC berhasil!', 'success')}
              className="px-4 py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-sm"
            >
              Daftar Pelatihan
            </button>
          </div>
        </div>
      )
    },
    danus: {
      title: 'Dana Usaha',
      icon: '🛒',
      iconComponent: <ShoppingCart className="w-8 h-8 text-gold" />,
      desc: 'Wirausaha mandiri Himpunan. Pembelian produk eksklusif PDH, bomber, dan merchandise resmi HIMA EINSTEIN.',
      renderContent: () => (
        <div className="space-y-6 max-w-xl mx-auto">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left">Produk Populer Danus</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gold-border rounded-2xl flex flex-col justify-between text-left space-y-3 shadow-sm hover:border-gold/30 transition-all">
              <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                <img src="/Media/Baju PDH Elins/pdh-elins.png" alt="PDH HIMA" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">PDH HIMA 2026</span>
              <span className="text-xs text-gold-dark font-semibold">Rp 135.000</span>
              <button 
                onClick={() => {
                  addToCart('PDH EINSTEIN 2026', 135000);
                  showToast('PDH HIMA ditambahkan ke keranjang!', 'success');
                }}
                className="w-full py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all active:scale-95"
              >
                + Tambah
              </button>
            </div>
            <div className="p-4 bg-white border border-gold-border rounded-2xl flex flex-col justify-between text-left space-y-3 shadow-sm hover:border-gold/30 transition-all">
              <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
                <Shirt className="w-8 h-8 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">Bomber Phótisma</span>
              <span className="text-xs text-gold-dark font-semibold">Rp 185.000</span>
              <button 
                onClick={() => {
                  addToCart('Bomber Phótisma', 185000);
                  showToast('Bomber Phótisma ditambahkan ke keranjang!', 'success');
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
              Buka Halaman Einstein Market Lengkap
            </Link>
          </div>
        </div>
      )
    },
    kominfo: {
      title: 'Komunikasi & Informasi',
      icon: '📢',
      iconComponent: <Radio className="w-8 h-8 text-gold" />,
      desc: 'Media publikasi berita sains nuklir, dokumentasi kegiatan, rilis buletin triwulan EINSTEIN, dan podcast audio visual.',
      renderContent: () => (
        <div className="max-w-md mx-auto space-y-4">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-left mb-3">Podcast Terbaru</h4>
          <div className="p-5 bg-white border border-gold-border rounded-2xl text-left space-y-3 shadow-sm">
            <span className="inline-block px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-500 uppercase tracking-wider">Audio Podcast</span>
            <h5 className="text-sm font-bold text-slate-800">Eps 12: Masa Depan Small Modular Reactor di Indonesia</h5>
            <p className="text-xs text-slate-500">Pembicara: Staf Ahli BRIN Yogyakarta</p>
            <button 
              onClick={() => showToast('Memutar podcast episode 12...', 'success')}
              className="px-4 py-2 bg-gold text-white text-xs font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              Putar Podcast
            </button>
          </div>
        </div>
      )
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
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 border-b border-slate-100 pb-6 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center shadow-inner">
                {currentDiv.iconComponent}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wider">
                {currentDiv.title}
              </h1>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-light max-w-2xl">
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
