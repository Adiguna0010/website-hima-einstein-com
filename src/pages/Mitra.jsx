import React, { useState } from 'react';
import { Handshake, TrendingUp, ArrowRight, Crosshair, Image, Sparkles, Target, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Mitra() {
  const [activeTab, setActiveTab] = useState('mitra'); // 'mitra' or 'investor'

  const partnerLogos = [
    { name: 'BRIN', path: '/Media/Logo Instansi/logo brin warna_landscape.jpg', fallback: 'https://placehold.co/120x40/ffffff/000000?text=BRIN' },
    { name: 'Poltek Nuklir', path: '/Media/Logo Instansi/Logo Poltek (benar).png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=Poltek+Nuklir' },
    { name: 'PT. Instrumentasi Indonesia', path: '/Media/Logo Mitra/logo_ii.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=PT.+II' },
    { name: 'BATAN Technology', path: '/Media/Logo Mitra/logo_batantek.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=BATAN+Tek' },
    { name: 'IndoPhysics', path: '/Media/Logo Mitra/logo_indophysics.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=IndoPhysics' },
    { name: 'Lab Instrumentasi Pusat', path: '/Media/Logo Mitra/logo_lab.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=Lab+Instr' }
  ];

  return (
    <div className="relative pt-24 pb-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      {/* Background decoration orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-light/5 glow-orb pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10">
        <span className="text-xs font-mono font-semibold text-gold-dark uppercase tracking-widest block">
          [ KEMITRAAN & INVESTASI ]
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <Handshake className="w-8 h-8 text-gold" /> PARTNERSHIP & INVESTMENT
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-2xl">
          Membangun integrasi antara riset kemahasiswaan Politeknik Teknologi Nuklir Indonesia dengan lembaga riset nasional, sektor industri penunjang, serta dukungan pendanaan investor.
        </p>
      </div>

      {/* Premium Tab Switcher */}
      <div className="flex border-b border-zinc-200 relative z-10">
        <button
          onClick={() => setActiveTab('mitra')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'mitra' 
              ? 'text-gold' 
              : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <Handshake className="w-4.5 h-4.5" />
          <span>Sponsor & Mitra Strategis</span>
          {activeTab === 'mitra' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold animate-fade-in" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('investor')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'investor' 
              ? 'text-gold' 
              : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" />
          <span>Investor & Pendanaan</span>
          {activeTab === 'investor' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold animate-fade-in" />
          )}
        </button>
      </div>

      {/* TAB CONTENT: Mitra & Sponsor */}
      {activeTab === 'mitra' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          {/* Main Info Board */}
          <div className="border border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden shadow-sm">
            {/* Technical Corner Ornaments */}
            <div className="absolute -top-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -top-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -bottom-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -bottom-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>

            <div className="lg:col-span-8 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 space-y-6 text-left flex flex-col justify-center">
              <h3 className="text-xl font-serif font-bold text-zinc-900 leading-snug">
                Membuka Peluang Kolaborasi Riset & Dukungan Sponsor
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed font-sans font-light">
                Kami membuka pintu kemitraan bagi instansi pemerintah, perusahaan teknologi, maupun alumni yang ingin bekerja sama dalam program penelitian alat ukur radiasi, otomatisasi stasiun nuklir, program pengabdian masyarakat, serta penyediaan sponsor bagi program kerja Himpunan.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider font-sans shadow-md shadow-gold/10"
                >
                  Hubungi Kami <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 flex flex-col justify-center text-left bg-zinc-50/30">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">[ SPEC_GRID_MITRA ]</span>
              <h4 className="text-sm font-bold text-zinc-800 mt-2">Segera Hadir Portal Sponsorship</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans font-light mt-1">
                Sistem pengajuan sponsorship online dan pelacakan proposal kemitraan saat ini sedang disinkronisasikan oleh divisi Eksternal.
              </p>
            </div>
          </div>

          {/* Mitra Logo Grid */}
          <div className="space-y-6">
            <div className="text-left space-y-2">
              <h2 className="text-lg font-mono font-semibold text-zinc-900 tracking-wider flex items-center gap-2">
                <Image className="w-4 h-4 text-gold" /> AFFILIATED PARTNERS & SPONSORSHIPS
              </h2>
              <p className="text-xs text-zinc-500 font-sans font-light">
                Logo kemitraan resmi Himpunan Mahasiswa Program Studi Elektronika Instrumentasi.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {partnerLogos.map((partner, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-200 bg-white p-4 flex items-center justify-center h-20 shadow-sm relative group rounded-xl hover:border-gold/30 hover:shadow-md transition-all"
                >
                  <div className="absolute top-1 left-1 text-[7px] font-mono text-zinc-300 font-light">[ REF_{idx + 1} ]</div>
                  <img 
                    src={partner.path} 
                    alt={partner.name} 
                    className="max-h-10 max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-350"
                    onError={(e) => {
                      e.target.src = partner.fallback;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Investor & Pendanaan */}
      {activeTab === 'investor' && (
        <div className="space-y-12 animate-in fade-in duration-300 text-left">
          {/* Main Info Board */}
          <div className="border border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden shadow-sm">
            {/* Technical Corner Ornaments */}
            <div className="absolute -top-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -top-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -bottom-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>
            <div className="absolute -bottom-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-gold" /></div>

            <div className="lg:col-span-8 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 space-y-6 text-left flex flex-col justify-center">
              <h3 className="text-xl font-serif font-bold text-zinc-900 leading-snug">
                Pendanaan Riset & Akselerasi Bisnis Mahasiswa
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed font-sans font-light">
                Khusus bagi investor yang ingin mendukung pendanaan proyek komersial, inkubasi bisnis, startup internal mahasiswa, maupun riset aplikatif Himpunan Mahasiswa Program Studi Elektronika Instrumentasi.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider font-sans shadow-md shadow-gold/10"
                >
                  Ajukan Penawaran <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 flex flex-col justify-center text-left bg-zinc-50/30">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">[ SPEC_GRID_INVESTOR ]</span>
              <h4 className="text-sm font-bold text-zinc-800 mt-2">Segera Hadir Portal Investor</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans font-light mt-1">
                Portal khusus transparansi pendanaan riset dan monitoring perkembangan prototipe komersial mahasiswa dalam tahap integrasi ekosistem.
              </p>
            </div>
          </div>

          {/* Incubation & Funding Pillars */}
          <div className="space-y-6">
            <div className="text-left space-y-2">
              <h2 className="text-lg font-mono font-semibold text-zinc-900 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-gold" /> PILAR PENDANAAN & INKUBASI BISNIS
              </h2>
              <p className="text-xs text-zinc-500 font-sans font-light">
                Skema dukungan investasi yang kami kelola untuk mendukung kreativitas dan inovasi bisnis mahasiswa Elektronika Instrumentasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Inkubasi Bisnis Mahasiswa</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-light">
                  Program pendampingan mentor ahli dan penyediaan modal awal terstruktur bagi ide bisnis inovatif, startup, dan kewirausahaan mandiri bentukan mahasiswa.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Komersialisasi Riset Alat</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-light">
                  Mendukung akselerasi prototipe riset mahasiswa (seperti alat detektor radiasi nuklir mandiri, sistem IoT industri) agar siap uji sertifikasi industri dan diproduksi massal.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Kemitraan Ventura Internal</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-light">
                  Kolaborasi jangka panjang bersama korporasi/investor untuk pendaftaran hak cipta paten (IPR) riset stasiun instrumentasi serta akomodasi delegasi perlombaan inovasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
