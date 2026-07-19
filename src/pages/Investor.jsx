import React from 'react';
import { TrendingUp, ArrowRight, Crosshair, Sparkles, Target, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Investor() {
  return (
    <div className="relative pt-24 pb-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      {/* Background decoration orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-light/5 glow-orb pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10">
        <span className="text-xs font-mono font-semibold text-gold-dark uppercase tracking-widest block">
          [ INVESTASI & PENDANAAN ]
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-gold" /> INVESTOR & PENDANAAN
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-2xl">
          Portal khusus pendanaan riset komersial, program inkubasi bisnis mahasiswa, serta kolaborasi ventura bersama Himpunan Mahasiswa Elektronika Instrumentasi.
        </p>
      </div>

      {/* Main Info Board */}
      <div className="border border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden shadow-sm z-10">
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
      <div className="space-y-6 z-10 relative">
        <div className="text-left space-y-2">
          <h2 className="text-lg font-mono font-semibold text-zinc-900 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-gold" /> PILAR PENDANAAN & INKUBASI BISNIS
          </h2>
          <p className="text-xs text-zinc-500 font-sans font-light">
            Skema dukungan investasi yang kami kelola untuk mendukung kreativitas dan inovasi bisnis mahasiswa Elektronika Instrumentasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Inkubasi Bisnis Mahasiswa</h3>
            <p className="text-xs text-slate-550 leading-relaxed font-light">
              Program pendampingan mentor ahli dan penyediaan modal awal terstruktur bagi ide bisnis inovatif, startup, dan kewirausahaan mandiri bentukan mahasiswa.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Komersialisasi Riset Alat</h3>
            <p className="text-xs text-slate-550 leading-relaxed font-light">
              Mendukung akselerasi prototipe riset mahasiswa (seperti alat detektor radiasi nuklir mandiri, sistem IoT industri) agar siap uji sertifikasi industri dan diproduksi massal.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-gold/30 hover:shadow-md transition-all space-y-4 text-left">
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
  );
}
