import React, { useState } from 'react';
import { Calendar, Play, Compass, History, Camera, Landmark, Image } from 'lucide-react';

export default function Quest() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const historyEvents = [
    {
      year: '2021',
      title: 'Inisiasi Awal Himpunan',
      desc: 'Pembentukan Komite Khusus persiapan pendirian organisasi mahasiswa Program Studi Elektronika Instrumentasi di Sekolah Tinggi Teknologi Nuklir (STTN-BATAN) Yogyakarta.',
      icon: <Compass className="w-5 h-5" />
    },
    {
      year: '2023',
      title: 'Deklarasi Resmi & Legalitas',
      desc: 'Pengesahan nama HIMA EINSTEIN.COM secara hukum sebagai Organisasi Mahasiswa resmi di bawah koordinasi kampus yang bertransformasi menjadi Politeknik Teknologi Nuklir Indonesia.',
      icon: <Landmark className="w-5 h-5" />
    },
    {
      year: '2025',
      title: 'Era Transformasi Riset',
      desc: 'Perluasan cakupan program kerja divisi Riset & Teknologi (Ristek) dengan berfokus pada kolaborasi mikrokontroler IoT dan instrumentasi nuklir otonom.',
      icon: <History className="w-5 h-5" />
    },
    {
      year: '2026',
      title: 'Kabinet Phótisma',
      desc: 'Era kepengurusan aktif dengan tema Phótisma (Cahaya), memfokuskan program kerja pada digitalisasi administrasi, pengamanan aset, serta kemandirian ekonomi organisasi.',
      icon: <Calendar className="w-5 h-5" />
    }
  ];

  const galleryImages = [
    { 
      url: '/Media Einsten/Media Umum/Foto Umum Beranda/DSC_7954.JPG', 
      title: 'Rapat Kerja Kabinet Phótisma 2026',
      fallback: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      url: '/Media Einsten/Media Umum/Foto Umum Beranda/IMG-20260707-WA0037.jpg', 
      title: 'Kegiatan Pengabdian Masyarakat Pengma',
      fallback: 'https://images.unsplash.com/photo-1526978152790-db98b7c4636e?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      url: '/Media Einsten/Media Umum/Foto Umum Beranda/IMG_8401.HEIC', 
      title: 'Kolaborasi Riset Instrumentasi Nuklir',
      fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' 
    },
    {
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      title: 'Evaluasi Tengah Tahun Pengurus',
      fallback: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="relative pt-24 pb-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background orb decoration */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Perjalanan Himpunan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEIN QUEST</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Menelusuri linimasa sejarah peradaban digital, pengabdian sosial, dan riset teknologi Himpunan Elektronika Instrumentasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        
        {/* Left Column: Vertical Timeline */}
        <div className="lg:col-span-7 text-left space-y-8 relative">
          
          {/* Vertical line connector */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>

          {historyEvents.map((ev, idx) => (
            <div key={idx} className="flex gap-6 relative z-10 group">
              
              {/* Circular timeline year emblem */}
              <div className="w-12 h-12 rounded-xl bg-white border border-gold-border flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:border-gold group-hover:bg-gold/10 transition-colors duration-300">
                <span className="text-[10px] font-bold text-gold-dark tracking-widest">{ev.year}</span>
              </div>

              {/* Event card detail */}
              <div className="flex-1 p-5 rounded-2xl border border-gold-border bg-white space-y-2 hover:border-gold/30 hover:bg-slate-50/50 shadow-sm transition-all duration-300">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold"></span> {ev.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Documentary Video Teaser */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-left space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4.5 h-4.5 text-gold" /> Dokumenter Sejarah
            </h3>
            <p className="text-xs text-slate-550 font-light">
              Tonton cuplikan dokumenter perjuangan pendirian Himpunan Mahasiswa Elins Poltek Nuklir.
            </p>
          </div>

          <div className="relative bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md aspect-video flex items-center justify-center group">
            {isVideoPlaying ? (
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Dokumenter Sejarah HIMA EINSTEIN"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img 
                  src="/Media Einsten/Media Umum/Foto Umum Beranda/DSC_7954.JPG" 
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-14 h-14 rounded-full bg-gold text-white flex items-center justify-center relative z-10 shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            TEASER DOKUMENTER SEJARAH HIMA (PLAYABLE)
          </p>
        </div>

      </div>

      {/* ================= DOKUMENTASI GALLERY SECTION ================= */}
      <div className="border-t border-slate-200 pt-16 space-y-6">
        <div className="text-left space-y-2">
          <h2 className="text-xl font-bold uppercase text-slate-800 tracking-wide flex items-center gap-2">
            <Image className="w-5 h-5 text-gold" /> ARSIP DOKUMENTASI KEGIATAN
          </h2>
          <p className="text-xs text-slate-500 font-light">
            Kumpulan potret jejak kebersamaan, riset teknologi, dan pengabdian masyarakat oleh anggota himpunan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white border border-gold-border rounded-2xl overflow-hidden shadow-sm aspect-[4/3] flex flex-col justify-end text-left"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  e.target.src = img.fallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] text-gold-light font-semibold uppercase tracking-widest">Dokumentasi</span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5" title={img.title}>
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
