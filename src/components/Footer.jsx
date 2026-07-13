import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-obsidian-deep border-t border-white/5 py-12 mt-20 relative overflow-hidden">
      {/* Decorative Blur Orb */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-electricBlue/5 glow-orb"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/About */}
          <div className="md:col-span-2 space-y-4">
            <img 
              src="/Media Einsten/Media Umum/logo kabinet putih (horizontal).png" 
              alt="HIMA EINSTEIN Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/05070a/ffffff?text=EINSTEIN";
              }}
            />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Website Resmi Himpunan Mahasiswa Program Studi Elektronika Instrumentasi Politeknik Teknologi Nuklir Indonesia - Kabinet Phótisma.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>Yogyakarta, Indonesia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Peta Situs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/sphere" className="text-slate-400 hover:text-white transition-colors">Einstein Sphere</Link>
              </li>
              <li>
                <Link to="/market" className="text-slate-400 hover:text-white transition-colors">Einstein Market</Link>
              </li>
              <li>
                <Link to="/space" className="text-slate-400 hover:text-white transition-colors">Einstein Space</Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Kemitraan & Dukungan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://polteknuklir.ac.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Poltek Nuklir <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://brin.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  BRIN <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HIMA EINSTEIN.COM Kabinet Phótisma. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            <span>Powered by BRIN Yogyakarta</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
