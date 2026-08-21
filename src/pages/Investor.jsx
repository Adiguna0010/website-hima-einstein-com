import React from 'react';
import { ArrowRight, Sparkles, Clock, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Investor() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-zinc-700 font-sans overflow-hidden">
      {/* Background decoration glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gold/10 blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-200/20 blur-2xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-gold-light/10 blur-3xl pointer-events-none -z-10"></div>

      {/* Main Centered Coming Soon Container */}
      <div className="w-full max-w-3xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Top Coming Soon Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-xs font-mono font-bold text-gold-dark uppercase tracking-widest shadow-sm">
          <Clock className="w-4 h-4 text-gold animate-spin-slow" />
          <span>COMING SOON // PORTAL PENDANAAN & INVESTOR</span>
        </div>

        {/* Large Decorative Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-50 to-gold/20 border-2 border-gold/30 flex items-center justify-center text-gold-dark shadow-xl shadow-gold/15 transition-transform hover:scale-105">
              <Rocket className="w-12 h-12 sm:w-14 sm:h-14 text-gold" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-gold shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Portal Investor & Pendanaan
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light font-sans max-w-xl mx-auto">
            Halaman kemitraan investor, skema pendanaan ventura riset, dan program inkubasi bisnis mahasiswa <strong>hima einsten.com</strong> saat ini sedang dalam tahap perancangan & pengembangan.
          </p>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Tahap Perancangan & Integrasi Sistem Kabinet Phótisma</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-xs sm:text-sm font-sans shadow-md hover:shadow-lg"
          >
            Kembali ke Beranda <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/mitra"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gold/40 text-gold-dark font-bold rounded-xl hover:bg-gold/5 active:scale-95 transition-all text-xs sm:text-sm font-sans shadow-sm hover:border-gold"
          >
            Lihat Mitra Terafiliasi
          </Link>
        </div>

      </div>
    </div>
  );
}
