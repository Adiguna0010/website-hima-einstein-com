import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-gold-border/40 py-12 mt-20 relative overflow-hidden">
      {/* Decorative Blur Orb */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold/5 glow-orb"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-slate-850">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Brand/About */}
          <div className="md:col-span-2 space-y-4">
            <img 
              src="/Media/Logo Kabinet/logo kabinet hitam (horizontal).png" 
              alt="Kabinet Phótisma Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/ffffff/000000?text=KABINET+PHOTISMA";
              }}
            />
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed font-light">
              Website Resmi Himpunan Mahasiswa Program Studi Elektronika Instrumentasi Politeknik Teknologi Nuklir Indonesia - Kabinet Phótisma.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>Yogyakarta, Indonesia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-850 uppercase tracking-widest mb-4 font-bold">Peta Situs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-gold-dark transition-colors font-medium">Beranda</Link>
              </li>
              <li>
                <Link to="/sphere" className="text-slate-600 hover:text-gold-dark transition-colors font-medium">Einsten Sphere</Link>
              </li>
              <li>
                <Link to="/market" className="text-slate-600 hover:text-gold-dark transition-colors font-medium">Einsten Market</Link>
              </li>
              <li>
                <Link to="/space" className="text-slate-600 hover:text-gold-dark transition-colors font-medium">Einsten Space</Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-850 uppercase tracking-widest mb-4 font-bold">Kemitraan & Dukungan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://polteknuklir.ac.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-gold-dark transition-colors flex items-center gap-1 font-medium"
                >
                  Poltek Nuklir <ExternalLink className="w-3 h-3 text-gold" />
                </a>
              </li>
              <li>
                <a 
                  href="https://brin.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-gold-dark transition-colors flex items-center gap-1 font-medium"
                >
                  BRIN <ExternalLink className="w-3 h-3 text-gold" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HIMPUNAN EINSTEN.COM Kabinet Phótisma. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            <span>Powered by BRIN Yogyakarta</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
