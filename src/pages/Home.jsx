import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, Target, Users, Code, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  const metrics = [
    { value: '120+', label: 'Mahasiswa Aktif', highlight: false },
    { value: '100%', label: 'Komitmen Sinergis', highlight: false },
    { value: '15+', label: 'Proyek Riset & IoT', highlight: true }
  ];

  const values = [
    {
      icon: <Code className="w-5 h-5 text-electricCyan" />,
      title: 'Inovasi Digital',
      desc: 'Mendorong digitalisasi sistem administrasi dan pemanfaatan riset teknologi berbasis otonom.'
    },
    {
      icon: <Activity className="w-5 h-5 text-limeGreen" />,
      title: 'Sinergi Instrumentasi',
      desc: 'Mengintegrasikan keahlian elektronika nuklir dengan kebutuhan industri penunjang nasional.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-electricCyan" />,
      title: 'Integritas & Aset',
      desc: 'Menjaga tata kelola logistik dan transparansi birokrasi himpunan secara profesional.'
    }
  ];

  return (
    <div className="relative pt-24 space-y-24 overflow-hidden pb-16">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-electricBlue/10 glow-orb"></div>
      <div className="absolute top-80 right-10 w-[500px] h-[500px] rounded-full bg-electricCyan/5 glow-orb"></div>

      {/* ================= HERO SECTION ================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-electricBlue/30 bg-electricBlue/10 text-xs font-semibold text-electricCyan tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Himpunan Elektronika Instrumentasi
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
              KABINET <span className="bg-gradient-to-r from-electricBlue via-electricCyan to-limeGreen bg-clip-text text-transparent">PHÓTISMA</span>
            </h1>
            
            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed font-light">
              Menyatukan pengembangan riset teknologi nuklir, instrumentasi otonom, dan kewirausahaan mandiri di bawah naungan Politeknik Teknologi Nuklir Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#profil" 
                className="px-6 py-3 bg-limeGreen text-obsidian font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm shadow-[0_0_20px_-3px_rgba(163,230,53,0.3)]"
              >
                Profil Hima
              </a>
              <Link 
                to="/sphere" 
                className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                Jelajahi Sphere <ArrowRight className="w-4 h-4 text-electricCyan" />
              </Link>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5">
              {metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    m.highlight 
                      ? 'bg-electricBlue/10 border-electricBlue/30 shadow-[0_0_20px_-5px_rgba(0,82,255,0.2)]' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <span className="block text-2xl sm:text-3xl font-extrabold text-white font-heading">{m.value}</span>
                  <span className="block text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide mt-1">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Logo Frame Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-sm w-full">
              {/* Glowing decorative frame background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-electricBlue to-electricCyan rounded-2xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <div className="relative glass border border-white/10 rounded-2xl p-8 flex items-center justify-center aspect-square shadow-2xl overflow-hidden">
                <img 
                  src="/Media Einsten/Media Umum/logo kabinet putih (vertical).png" 
                  alt="Logo Kabinet Phótisma" 
                  className="w-4/5 h-4/5 object-contain animate-pulse-slow"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x300/05070a/ffffff?text=PHOTISMA";
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ================= PROFIL SECTION ================= */}
      <section id="profil" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Framed group photo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-video sm:aspect-square">
              <img 
                src="/Media Einsten/Media Umum/Foto Umum Beranda/DSC_7954.JPG" 
                alt="Pengurus HIMA EINSTEIN" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent p-4 text-left">
                <p className="text-xs font-semibold text-white">Pengurus HIMA EINSTEIN.COM</p>
                <p className="text-[10px] text-limeGreen font-medium mt-0.5">Kabinet Phótisma 2026/2027</p>
              </div>
            </div>
          </div>

          {/* Right: History, Vision, Mission */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold text-electricCyan uppercase tracking-widest block">Tentang Kami</span>
              <h2 className="text-3xl font-extrabold uppercase text-white mt-1">HIMA EINSTEIN.COM</h2>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Himpunan Mahasiswa Program Studi Elektronika Instrumentasi Politeknik Teknologi Nuklir Indonesia dibentuk sebagai wadah pengembangan softskill, kepemimpinan, dan kecakapan riset mahasiswa di bidang instrumentasi nuklir dan otomatisasi industri.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                <div className="flex items-center gap-2 text-electricCyan">
                  <Target className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-sm tracking-wider uppercase font-heading">Visi Kabinet</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Membawa terang bagi sains instrumentasi nuklir Indonesia melalui digitalisasi, ekspansi riset otonom, dan kemitraan berskala nasional.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                <div className="flex items-center gap-2 text-limeGreen">
                  <Award className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-sm tracking-wider uppercase font-heading">Misi Utama</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Mengotomatisasi birokrasi kemahasiswaan, mengamankan pengelolaan aset logistik, dan mengoptimalkan pendanaan mandiri organisasi.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CORE VALUES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Budaya Organisasi</span>
          <h2 className="text-3xl font-extrabold uppercase text-white">NILAI UTAMA (VALUES)</h2>
          <p className="text-xs text-slate-400 font-light">Nilai-nilai luhur yang dipengang oleh seluruh jajaran staf Kabinet Phótisma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-white/5 bg-white/5 text-left hover:border-electricBlue/20 hover:bg-white/10 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-electricBlue/5 group-hover:scale-150 transition-transform duration-300 blur-xl"></div>
              
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EMBEDDED VIDEO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Video Profil</span>
          <h2 className="text-3xl font-extrabold uppercase text-white">OFFICIAL TEASER PROFILE</h2>
          <p className="text-xs text-slate-400 font-light">Saksikan sekilas profil dan kegiatan Himpunan Mahasiswa EINSTEIN</p>
        </div>

        <div className="max-w-4xl mx-auto glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative aspect-video">
          {/* Youtube or placeholder video embedding */}
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Teaser Profile HIMA EINSTEIN"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
}
