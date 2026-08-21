import React from 'react';
import { TrendingUp, ArrowRight, Sparkles, Clock, Coins, Target, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Investor() {
  return (
    <div className="relative pt-28 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700 font-sans">
      {/* Background decoration orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-light/5 glow-orb pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-[11px] font-mono font-semibold text-gold-dark uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          COMING SOON // PORTAL PENDANAAN
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-gold" /> INVESTOR & PENDANAAN
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light font-sans">
          Portal khusus pendanaan riset komersial, program inkubasi bisnis mahasiswa, serta kolaborasi ventura bersama <strong>HIMA EINSTEN.COM</strong>.
        </p>
      </div>

      {/* Main Coming Soon Banner Card */}
      <div className="border border-gold-border/60 bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-lg shadow-gold/5 relative overflow-hidden text-left z-10">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold/10 blur-2xl pointer-events-none"></div>
        
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Rocket className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Portal Investor Sedang Dalam Pengembangan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Fitur transparansi portofolio prototipe teknologi nuklir, skema pendanaan ventura mahasiswa, dan monitoring inkubasi riset saat ini sedang dipersiapkan oleh tim pengembang untuk rilis mendatang.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-xs font-sans shadow-md"
            >
              Kembali ke Beranda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/mitra"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gold/30 text-gold-dark font-bold rounded-xl hover:bg-gold/5 active:scale-95 transition-all text-xs font-sans shadow-sm"
            >
              Lihat Mitra Terafiliasi
            </Link>
          </div>
        </div>
      </div>

      {/* Incubation & Funding Pillars Preview */}
      <div className="space-y-6 z-10 relative">
        <div className="text-left space-y-1">
          <h3 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" /> Rencana Skema Pendanaan Masa Depan
          </h3>
          <p className="text-xs text-slate-500 font-sans font-light">
            Tiga pilar utama yang akan diakomodasi melalui ekosistem digital Himpunan:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Inkubasi Bisnis Mahasiswa</h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-light">
              Pendampingan mentor dan penyediaan modal awal bagi ide bisnis teknologi dan kewirausahaan mandiri mahasiswa.
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Komersialisasi Riset Alat</h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-light">
              Mendukung akselerasi prototipe riset mahasiswa (alat ukur radiasi, otomasi sistem) agar siap uji sertifikasi industri.
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Kemitraan Ventura Riset</h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-light">
              Kolaborasi strategis korporasi untuk pendaftaran paten riset dan partisipasi kompetisi sains nasional & global.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
