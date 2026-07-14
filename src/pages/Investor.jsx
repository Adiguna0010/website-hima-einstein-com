import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Investor() {
  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gold/5 glow-orb"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold-light/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/10 to-gold-light/10 border border-gold/20 mx-auto">
          <TrendingUp className="w-10 h-10 text-gold" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Investasi & Dukungan</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">INVESTOR EINSTEIN</h1>
          <p className="text-slate-500 text-sm leading-relaxed font-light max-w-lg mx-auto">
            Halaman investor HIMA EINSTEIN sedang dalam tahap pengembangan. 
            Kami mengundang para pendukung untuk berpartisipasi dalam pertumbuhan organisasi kami.
          </p>
        </div>

        <div className="p-8 bg-white border border-gold-border rounded-2xl shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
            <span className="text-2xl font-extrabold text-gold">📈</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Segera Hadir</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Informasi program investasi, pendanaan, dan dukungan finansial akan segera tersedia di halaman ini.
            Jadilah bagian dari perjalanan kami!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-dark transition-colors"
          >
            Kembali ke Beranda <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
