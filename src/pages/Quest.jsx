import React, { useState } from 'react';
import { Calendar, Play, Compass, History, Camera, Landmark, Image, Crosshair } from 'lucide-react';

export default function Quest() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const historyEvents = [
    {
      year: '2021',
      title: 'Inisiasi Awal Himpunan',
      desc: 'Pembentukan Komite Khusus persiapan pendirian organisasi mahasiswa Program Studi Elektronika Instrumentasi di Sekolah Tinggi Teknologi Nuklir (STTN-BATAN) Yogyakarta.',
      icon: <Compass className="w-5 h-5 text-amber-550" />
    },
    {
      year: '2023',
      title: 'Deklarasi Resmi & Legalitas',
      desc: 'Pengesahan nama HIMA EINSTEIN.COM secara hukum sebagai Organisasi Mahasiswa resmi di bawah koordinasi kampus yang bertransformasi menjadi Politeknik Teknologi Nuklir Indonesia.',
      icon: <Landmark className="w-5 h-5 text-amber-550" />
    },
    {
      year: '2025',
      title: 'Era Transformasi Riset',
      desc: 'Perluasan cakupan program kerja divisi Riset & Teknologi (Ristek) dengan berfokus pada kolaborasi mikrokontroler IoT dan instrumentasi nuklir otonom.',
      icon: <History className="w-5 h-5 text-amber-550" />
    },
    {
      year: '2026',
      title: 'Kabinet Phótisma',
      desc: 'Era kepengurusan aktif dengan tema Phótisma (Cahaya), memfokuskan program kerja pada digitalisasi administrasi, pengamanan aset, serta kemandirian ekonomi organisasi.',
      icon: <Calendar className="w-5 h-5 text-amber-550" />
    }
  ];

  const alumniMembers = [
    {
      name: 'Dr. Eng. Irfan Pratama',
      batch: 'Elins 2018',
      role: 'Nuclear Research Lead, BATAN',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=500&q=80',
      quote: 'Pondasi elektronika nuklir yang dibangun di HIMA adalah langkah awal penguasaan teknologi nasional.'
    },
    {
      name: 'Riska Wahyuni, M.T.',
      batch: 'Elins 2019',
      role: 'IoT Platform Architect, IoT-Nuklir',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=500&q=80',
      quote: 'Kolaborasi dan keterbukaan dalam penelitian adalah kunci inovasi otonom yang berkelanjutan.'
    },
    {
      name: 'Aditya Nugraha',
      batch: 'Elins 2020',
      role: 'Lead Embedded Systems Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80',
      quote: 'Sistem instrumen yang handal dimulai dari ketelitian tingkat tinggi pada tingkat firmware.'
    },
    {
      name: 'Siti Rahmawati',
      batch: 'Elins 2021',
      role: 'Automation Controls Engineer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=500&q=80',
      quote: 'Digitalisasi administrasi himpunan meletakkan standar efisiensi baru bagi pergerakan mahasiswa.'
    }
  ];

  return (
    <div className="relative pt-24 pb-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      
      {/* Page Header */}
      <div className="text-left space-y-3">
        <span className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-widest block">
          [ ARCHIVE 01.0 // HISTORY QUEST ]
        </span>
        <h1 className="text-4xl font-serif text-zinc-900 tracking-tight">EINSTEIN QUEST</h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-xl">
          Menelusuri linimasa sejarah peradaban digital, pengabdian sosial, dan riset teknologi Himpunan Elektronika Instrumentasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        
        {/* Left Column: Vertical Timeline */}
        <div className="lg:col-span-7 text-left space-y-8 relative">
          
          {/* Vertical line connector */}
          <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gray-200 z-0"></div>

          {historyEvents.map((ev, idx) => (
            <div key={idx} className="flex gap-6 relative z-10 group">
              
              {/* Circular timeline year emblem */}
              <div className="w-12 h-12 rounded bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:border-amber-500 group-hover:bg-amber-50/15 transition-colors duration-300">
                <span className="text-[10px] font-mono font-bold text-amber-600 tracking-widest">{ev.year}</span>
              </div>

              {/* Event card detail */}
              <div className="flex-1 p-6 border border-gray-200 bg-white space-y-2 hover:border-amber-550/20 hover:bg-zinc-50/30 shadow-sm transition-all duration-300 relative">
                <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-350">[ EVT_{ev.year} ]</div>
                <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {ev.title}
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans font-light">
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Documentary Video Teaser */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-left space-y-2 border-l border-amber-500 pl-4 py-1">
            <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Camera className="w-4 h-4 text-amber-500" /> Dokumenter Sejarah
            </h3>
            <p className="text-xs text-zinc-500 font-light font-sans">
              Tonton cuplikan dokumenter perjuangan pendirian Himpunan Mahasiswa Elins Poltek Nuklir.
            </p>
          </div>

          <div className="relative bg-white border border-gray-250 p-2 shadow-sm aspect-video flex items-center justify-center group">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-400"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-400"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-400"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-400"></div>

            {isVideoPlaying ? (
              <iframe 
                className="absolute inset-2 w-[calc(105%_-_16px)] h-[calc(105%_-_16px)] border border-gray-150"
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
                  className="absolute inset-2 w-[calc(100%_-_16px)] h-[calc(100%_-_16px)] object-cover opacity-80 group-hover:scale-[1.01] transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-2 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center relative z-10 shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </>
            )}
          </div>
          <p className="text-[9px] text-zinc-400 font-mono tracking-widest text-left">
            [ ARCHIVAL_MEDIA // TEASER_PLAYABLE ]
          </p>
        </div>

      </div>

      {/* ================= HISTORY / ALUMNI SECTION (POLAROID STYLE) ================= */}
      <div className="border-t border-gray-200 pt-16 space-y-8">
        <div className="text-left space-y-2">
          <span className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-widest block">
            [ ARCHIVE 02.0 // HISTORICAL FIGURES & ALUMNI ]
          </span>
          <h2 className="text-2xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-500" /> JEJAK TOKOH & ALUMNI EINSTEIN
          </h2>
          <p className="text-xs text-zinc-500 font-sans font-light max-w-xl">
            Para pionir angkatan terdahulu yang berkontribusi mendirikan pondasi riset elektronika nuklir serta digitalisasi Himpunan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {alumniMembers.map((alumni, idx) => (
            <div 
              key={idx} 
              className="bg-white p-4 pb-6 border border-gray-200 shadow-md flex flex-col hover:shadow-lg transition-shadow duration-300 relative group"
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-zinc-300 font-mono text-[8px] tracking-widest uppercase select-none">
                [ ALUMNI_REF_{idx + 1} ]
              </div>

              {/* Photo Box */}
              <div className="w-full aspect-[4/5] bg-zinc-50 border border-gray-150 overflow-hidden relative mb-4">
                <img 
                  src={alumni.image} 
                  alt={alumni.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-550 ease-in-out scale-[1.01] group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=500&q=80";
                  }}
                />
              </div>

              {/* Label */}
              <div className="text-left space-y-1 mt-2">
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider block uppercase">
                  {alumni.batch}
                </span>
                <h4 className="text-sm font-serif font-bold text-zinc-900 tracking-tight leading-snug">
                  {alumni.name}
                </h4>
                <p className="text-[10px] font-sans font-semibold text-amber-600 uppercase tracking-wide">
                  {alumni.role}
                </p>
                <div className="border-t border-gray-150 my-2 pt-2">
                  <p className="text-[11px] font-serif italic text-zinc-500 leading-relaxed">
                    "{alumni.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
