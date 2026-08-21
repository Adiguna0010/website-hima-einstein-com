import React from 'react';
import { Handshake } from 'lucide-react';

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
      desc: 'Perguruan tinggi kedinasan vokasi teknologi nuklir terapan yang menjadi payung akademis hima einsten.',
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
    </div>
  );
}
