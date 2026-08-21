import React from 'react';
import { Handshake, ArrowRight, Crosshair, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Mitra() {
  const primaryPartners = [
    { 
      name: 'Badan Riset dan Inovasi Nasional (BRIN)', 
      tag: 'Lembaga Riset Nasional',
      desc: 'Lembaga pemerintah yang mengoordinasikan riset sains, ketenaganukliran, instrumentasi, dan inovasi nasional di Indonesia.',
      path: '/Media/Logo Instansi/logo brin warna_landscape.jpg', 
      fallback: 'https://placehold.co/200x60/ffffff/000000?text=BRIN' 
    },
    { 
      name: 'Politeknik Teknologi Nuklir Indonesia', 
      tag: 'Institusi Akademik',
      desc: 'Perguruan tinggi kedinasan vokasi teknologi nuklir terapan yang menjadi payung akademis HIMA EINSTEN.',
      path: '/Media/Logo Instansi/Logo Poltek (benar).png', 
      fallback: 'https://placehold.co/200x60/ffffff/000000?text=Poltek+Nuklir' 
    }
  ];

  return (
    <div className="relative pt-28 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700 font-sans">
      {/* Background decoration orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-light/5 glow-orb pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-[11px] font-mono font-semibold text-gold-dark uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
          AFFILIATED PARTNERS & INSTITUTIONS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Handshake className="w-8 h-8 text-gold" /> INSTANSI & MITRA TERAFILIASI
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light font-sans">
          Daftar lembaga riset nasional dan institusi pendidikan resmi yang menaungi serta terafiliasi langsung dengan <strong>hima einsten.com</strong>.
        </p>
      </div>

      {/* Primary Affiliated Partners Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
        {primaryPartners.map((partner, idx) => (
          <div 
            key={idx}
            className="border border-slate-200 bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm hover:border-gold-border hover:shadow-md transition-all space-y-5 text-left group"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-[10px] font-mono font-semibold text-gold-dark uppercase tracking-wider bg-gold/10 px-2.5 py-1 rounded-md">
                {partner.tag}
              </span>
              <span className="text-[10px] font-mono text-slate-400">TERAFILIASI RESMI</span>
            </div>

            <div className="h-16 flex items-center justify-start">
              <img 
                src={partner.path} 
                alt={partner.name}
                className="max-h-14 max-w-[220px] object-contain"
                onError={(e) => {
                  e.target.src = partner.fallback;
                }}
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-gold-dark transition-colors">
                {partner.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {partner.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice for Open Collaboration Portal */}
      <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded">
              Coming Soon
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Portal Sponsorship & Kemitraan Eksternal
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 font-light">
            Sistem pengajuan proposal sponsorship dan kolaborasi industri mandiri saat ini sedang disiapkan oleh Divisi Eksternal.
          </p>
        </div>
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-dark hover:text-gold transition-colors shrink-0"
        >
          Kembali ke Beranda <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
