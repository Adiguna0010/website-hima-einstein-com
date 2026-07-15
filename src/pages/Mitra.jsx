import React from 'react';
import { Handshake, ArrowRight, Crosshair, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Mitra() {
  const partnerLogos = [
    { name: 'BRIN', path: '/Media/Logo Instansi/logo brin warna_landscape.jpg', fallback: 'https://placehold.co/120x40/ffffff/000000?text=BRIN' },
    { name: 'Poltek Nuklir', path: '/Media/Logo Instansi/Logo Poltek (benar).png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=Poltek+Nuklir' },
    { name: 'PT. Instrumentasi Indonesia', path: '/Media/Logo Mitra/logo_ii.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=PT.+II' },
    { name: 'BATAN Technology', path: '/Media/Logo Mitra/logo_batantek.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=BATAN+Tek' },
    { name: 'IndoPhysics', path: '/Media/Logo Mitra/logo_indophysics.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=IndoPhysics' },
    { name: 'Lab Instrumentasi Pusat', path: '/Media/Logo Mitra/logo_lab.png', fallback: 'https://placehold.co/120x40/ffffff/000000?text=Lab+Instr' }
  ];

  return (
    <div className="relative pt-24 pb-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      
      {/* Page Header */}
      <div className="text-left space-y-3">
        <span className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-widest block">
          [ SPONSORSHIP // COLLABORATION ]
        </span>
        <h1 className="text-4xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <Handshake className="w-8 h-8 text-amber-500" /> MITRA EINSTEIN
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-xl">
          Membangun integrasi antara riset kemahasiswaan Politeknik Teknologi Nuklir Indonesia dengan lembaga riset nasional serta sektor industri penunjang.
        </p>
      </div>

      {/* Main Info Board */}
      <div className="border border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden shadow-sm">
        {/* Technical Corner Ornaments */}
        <div className="absolute -top-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-amber-500" /></div>
        <div className="absolute -top-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-amber-500" /></div>
        <div className="absolute -bottom-1.5 -left-1.5"><Crosshair className="w-3.5 h-3.5 text-amber-500" /></div>
        <div className="absolute -bottom-1.5 -right-1.5"><Crosshair className="w-3.5 h-3.5 text-amber-500" /></div>

        <div className="lg:col-span-8 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 space-y-6 text-left flex flex-col justify-center">
          <h3 className="text-xl font-serif font-bold text-zinc-900 leading-snug">
            Membuka Peluang Kolaborasi Riset & Dukungan Pendanaan
          </h3>
          <p className="text-zinc-600 text-xs leading-relaxed font-sans font-light">
            Kami membuka pintu kemitraan bagi instansi pemerintah, perusahaan teknologi, maupun alumni yang ingin bekerja sama dalam program penelitian alat ukur radiasi, otomatisasi stasiun nuklir, program pengabdian masyarakat, serta penyediaan sponsor bagi program kerja Himpunan.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-bold rounded hover:bg-amber-600 active:scale-95 transition-all text-xs uppercase tracking-wider font-sans"
            >
              Hubungi Kami <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 p-8 flex flex-col justify-center text-left bg-zinc-50/30">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">[ SPEC_GRID_MITRA ]</span>
          <h4 className="text-sm font-bold text-zinc-800 mt-2">Segera Hadir Portal Sponsorship</h4>
          <p className="text-[11px] text-zinc-550 leading-relaxed font-sans font-light mt-1">
            Sistem pengajuan sponsorship online dan pelacakan proposal kemitraan saat ini sedang disinkronisasikan oleh divisi Eksternal.
          </p>
        </div>
      </div>

      {/* ================= MITRA LOGO GRID SECTION ================= */}
      <div className="space-y-6">
        <div className="text-left space-y-2">
          <h2 className="text-lg font-mono font-semibold text-zinc-900 tracking-wider flex items-center gap-2">
            <Image className="w-4 h-4 text-amber-500" /> AFFILIATED PARTNERS & SPONSORSHIPS
          </h2>
          <p className="text-xs text-zinc-500 font-sans font-light">
            Logo kemitraan resmi Himpunan Mahasiswa Program Studi Elektronika Instrumentasi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partnerLogos.map((partner, idx) => (
            <div 
              key={idx} 
              className="border border-gray-200 bg-white p-4 flex items-center justify-center h-20 shadow-sm relative group"
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
  );
}
