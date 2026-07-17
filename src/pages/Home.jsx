import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, Target, User } from 'lucide-react';

export default function Home() {
  const metrics = [
    { value: '120+', label: 'Mahasiswa Aktif', highlight: false },
    { value: '100%', label: 'Komitmen Sinergis', highlight: false },
    { value: '8+', label: 'Proyek Riset & IoT', highlight: true }
  ];

  const pembimbing = {
    name: 'Budi Suhendro, S.ST., M.KOM',
    nip: '197206071992121004',
    role: 'Pembimbing Organisasi / Ketua Program Studi',
    detail: 'Elektronika Instrumentasi'
  };

  const bphCore = [
    {
      name: 'M. Iqbal Nur Huda',
      nim: '022400042',
      role: 'Ketua Himpunan',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Kahim_M. Iqbal Nur Huda - 022400042.JPG'
    },
    {
      name: 'Rafie Asfa Raditya Aryanto',
      nim: '022500041',
      role: 'Wakil Ketua Himpunan',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Wakahim_Rafie Asfa Raditya Aryanto - 022500041.JPG'
    },
    {
      name: 'Nailah Qarirah',
      nim: '022400051',
      role: 'Sekretaris I',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 1_Nailah Qarirah - 022400051.JPG'
    },
    {
      name: 'Bunga Nafisya Putri',
      nim: '022500009',
      role: 'Sekretaris II',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 2_Bunga Nafisya Putri - 022500009.JPG'
    },
    {
      name: 'Relvina',
      nim: '022400039',
      role: 'Bendahara I',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 1_Relvina - 022400039.JPG'
    },
    {
      name: 'Rizkiana Ramadhani',
      nim: '022500046',
      role: 'Bendahara II',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 2_Rizkiana Ramadhani - 022500046.JPG'
    }
  ];

  const kadivList = [
    {
      name: 'Adiguna Nugroho Halomoan',
      nim: '022400025',
      role: 'Kadiv Riset & Teknologi',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Ristek/Kepala Divisi Riset dan Teknologi_Adiguna Nugroho Halomoan - 022400025.JPG'
    },
    {
      name: 'Rabbany Al-Malika Ifadzla',
      nim: '022400006',
      role: 'Kadiv Dana Usaha',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Dana Usaha/Kepala Divisi Dana Usaha_Rabbany Al-Malika Ifadzla - 022400006.JPG'
    },
    {
      name: 'Rakan Ibrahim Widjisasono',
      nim: '022400031',
      role: 'Kadiv Aset & Logistik',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Aset Dan Logistik/Kepala Divisi Aset dan Logistik_Rakan Ibrahim Widjisasono - 022400031.JPG'
    },
    {
      name: 'Kunti Aisyatuzzahra',
      nim: '022400045',
      role: 'Kadiv Hubungan Eksternal',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/External/Kepala Divisi Eksternal_Kunti Aisyatuzzahra - 022400045.JPG'
    },
    {
      name: 'Hafizh Maulana Wijaya',
      nim: '022400019',
      role: 'Kadiv Hubungan Internal',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Internal/Kepala Divisi Internal_Hafizh Maulana Wijaya - 022400019.JPG'
    },
    {
      name: 'Sunniy',
      nim: '022400041',
      role: 'Kadiv Komunikasi & Informasi',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Kominfo/Kepala Divisi Komunikasi dan Informasi_Sunniy - 022400041.JPG'
    },
    {
      name: 'Farrelega Zhafran Vito Ardhana',
      nim: '022400038',
      role: 'Kadiv Pengembangan Mahasiswa',
      photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Pema/Kepala Divisi Pengembangan Mahasiswa_Farrelega Zhafran Vito Ardhana - 022400038.JPG'
    }
  ];

  return (
    <div className="relative pt-24 space-y-24 overflow-hidden pb-16 text-slate-800">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>
      <div className="absolute top-80 right-10 w-[500px] h-[500px] rounded-full bg-gold/5 glow-orb"></div>

      {/* ================= HERO SECTION ================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 lg:py-16">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-xs font-semibold text-gold-dark tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold" /> Himpunan Elektronika Instrumentasi
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold uppercase tracking-tight text-slate-900 leading-none max-w-4xl">
            KABINET <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">PHÓTISMA</span>
          </h1>
          
          {/* Description */}
          <p className="text-slate-650 text-base sm:text-lg max-w-2xl leading-relaxed font-light mx-auto">
            Menyatukan pengembangan riset teknologi nuklir, instrumentasi otonom, dan kewirausahaan mandiri di bawah naungan Politeknik Teknologi Nuklir Indonesia.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="#profil" 
              className="px-6 py-3.5 bg-gold text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm shadow-md shadow-gold/25 cursor-pointer"
            >
              Profil Hima
            </a>
            <Link 
              to="/sphere" 
              className="px-6 py-3.5 border border-gold/30 hover:bg-gold/5 text-gold-dark font-semibold rounded-xl active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              Jelajahi Sphere <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-slate-200 w-full max-w-3xl mx-auto">
            {metrics.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-4 sm:p-5 rounded-2xl border text-center transition-all ${
                  m.highlight 
                    ? 'bg-gold/5 border-gold/20 shadow-sm' 
                    : 'bg-slate-50 border-slate-200/60 shadow-sm'
                }`}
              >
                <span className="block text-2xl sm:text-3.5xl font-extrabold text-gold-dark font-heading">{m.value}</span>
                <span className="block text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide mt-1.5">{m.label}</span>
              </div>
            ))}
          </div>

        </div>
      </header>

      {/* ================= PROFIL SECTION ================= */}
      <section id="profil" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Framed group photo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md aspect-video sm:aspect-square">
              <img 
                src="/Media Einsten/Media Umum/Foto Umum Beranda/DSC_7954.JPG" 
                alt="Pengurus HIMPUNAN EINSTEIN.COM" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-left">
                <p className="text-xs font-semibold text-white">Pengurus HIMPUNAN EINSTEIN.COM</p>
                <p className="text-[10px] text-gold-light font-medium mt-0.5">Kabinet Phótisma 2026/2027</p>
              </div>
            </div>
          </div>

          {/* Right: History/About */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest block">Tentang Kami</span>
              <h2 className="text-3xl font-extrabold uppercase text-slate-900 mt-1">HIMPUNAN EINSTEIN.COM</h2>
            </div>
            
            <p className="text-slate-650 text-sm leading-relaxed font-light">
              Himpunan Mahasiswa Program Studi Elektronika Instrumentasi Politeknik Teknologi Nuklir Indonesia dibentuk sebagai wadah pengembangan softskill, kepemimpinan, dan kecakapan riset mahasiswa di bidang instrumentasi nuklir dan otomatisasi industri.
            </p>
            
            <p className="text-slate-650 text-sm leading-relaxed font-light">
              Melalui program kerja inovatif di bawah naungan Kabinet Phótisma, kami berupaya melahirkan lulusan yang tangguh, adaptif, serta menguasai rekayasa sistem otomatisasi, elektronika, instrumentasi nuklir, dan sistem cerdas berbasis IoT.
            </p>

            <div className="border-l-4 border-gold pl-4 py-1 text-slate-500 italic text-xs leading-relaxed">
              "Sinergi riset teknologi nuklir untuk kedaulatan sains dan kemandirian instrumentasi nasional."
            </div>
          </div>

        </div>
      </section>

      {/* ================= KAHIM VISI MISI SECTION (Replacing Values) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Kepemimpinan</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-900">VISI & MISI KETUA HIMPUNAN</h2>
          <p className="text-xs text-slate-500 font-light">Arah pergerakan Himpunan Mahasiswa di bawah pimpinan Kahim Kabinet Phótisma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Kahim Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative bg-white border border-gold-border rounded-2xl p-2.5 shadow-xl overflow-hidden group w-full max-w-sm">
              <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              </div>
              <img 
                src="/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Kahim_M. Iqbal Nur Huda - 022400042.JPG" 
                alt="M. Iqbal Nur Huda - Kahim" 
                className="w-full h-auto object-cover rounded-xl shadow-inner aspect-[3/4]"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800&q=80";
                }}
              />
              <div className="mt-4 text-center">
                <h4 className="text-lg font-bold text-slate-800">M. Iqbal Nur Huda</h4>
                <p className="text-xs text-gold-dark uppercase font-semibold tracking-wider mt-0.5">Ketua Himpunan Mahasiswa (Kahim)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visi & Misi text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Visi */}
            <div className="p-6 rounded-2xl border border-gold-border bg-white shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-gold-dark">
                <Target className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm tracking-wider uppercase font-heading">Visi Ketua Himpunan</h4>
              </div>
              <p className="text-sm text-slate-650 leading-relaxed font-light">
                "Membawa terang bagi sains instrumentasi nuklir Indonesia melalui digitalisasi, ekspansi riset otonom, dan kemitraan berskala nasional."
              </p>
            </div>

            {/* Misi */}
            <div className="p-6 rounded-2xl border border-gold-border bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <Award className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm tracking-wider uppercase font-heading">Misi Strategis</h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-650 font-light pl-1">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Mengotomatisasi birokrasi kemahasiswaan melalui digitalisasi persuratan dan inventarisasi aset.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Mengamankan pengelolaan logistik laboratorium dan aset Himpunan di bawah sistem pengawasan modern.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Mengoptimalkan kemandirian finansial organisasi melalui program kewirausahaan kreatif Dana Usaha.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STRUKTUR KABINET SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Struktur Kabinet</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-900">STRUKTUR ORGANISASI KABINET</h2>
          <p className="text-xs text-slate-500 font-light font-sans">
            Sinergi pembimbing, pimpinan, dan pelaksana program kerja Himpunan Elektronika Instrumentasi.
          </p>
        </div>

        <div className="space-y-16">
          {/* Pembimbing Organisasi */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-center">Pembimbing Organisasi</h4>
            <div className="max-w-md mx-auto bg-white border border-gold-border rounded-3xl p-6 shadow-md hover:scale-[1.02] hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold-dark"></div>
              
              <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <User className="w-10 h-10 text-gold-dark" />
              </div>

              <span className="block text-[9px] font-extrabold text-gold-dark uppercase tracking-widest font-sans">Pembimbing Organisasi</span>
              <h4 className="text-sm font-bold text-slate-800 mt-1 font-sans">{pembimbing.name}</h4>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5 font-sans">Ketua Program Studi {pembimbing.detail}</p>
              <p className="text-[9px] text-slate-400 font-mono mt-1">NIP. {pembimbing.nip}</p>
              
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                <img src="/Media/Logo Instansi/logo brin warna_landscape.jpg" alt="BRIN Logo" className="h-6 w-auto object-contain" />
                <img src="/Media/Logo Instansi/Logo Poltek (benar).png" alt="Poltek Logo" className="h-6 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Core BPH */}
          <div className="space-y-6 pt-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-center">Badan Pengurus Harian (BPH Core)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {bphCore.map((p) => (
                <div 
                  key={p.nim}
                  className="bg-white border border-gold-border rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col group shadow-sm text-left"
                >
                  <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative border-b border-slate-105">
                    <img 
                      src={p.photo} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/150x200/fffbeb/d97706?text=" + encodeURIComponent(p.name);
                      }}
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-[8px] font-extrabold text-gold-dark uppercase tracking-widest leading-none mb-1">{p.role}</span>
                      <h5 className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-snug font-sans">{p.name}</h5>
                    </div>
                    <span className="block text-[8px] text-slate-400 font-mono mt-1 leading-none">NIM: {p.nim}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jajaran Kepala Divisi */}
          <div className="space-y-6 pt-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-center">Jajaran Kepala Divisi (Kadiv)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {kadivList.map((p) => (
                <div 
                  key={p.nim}
                  className="bg-white border border-gold-border rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col group shadow-sm text-left"
                >
                  <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative border-b border-slate-105">
                    <img 
                      src={p.photo} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/150x200/fffbeb/d97706?text=" + encodeURIComponent(p.name);
                      }}
                    />
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-[7px] font-extrabold text-gold-dark uppercase tracking-widest leading-none mb-1">{p.role}</span>
                      <h5 className="text-[9px] font-bold text-slate-800 line-clamp-2 leading-tight font-sans">{p.name}</h5>
                    </div>
                    <span className="block text-[7px] text-slate-400 font-mono mt-1 leading-none">NIM: {p.nim}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= EMBEDDED VIDEO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Video Profil</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-900">OFFICIAL TEASER PROFILE</h2>
          <p className="text-xs text-slate-500 font-light">Saksikan sekilas profil dan kegiatan HIMPUNAN EINSTEIN.COM</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md relative aspect-video">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/rlw_VDUuNOk" 
            title="Teaser Profile HIMPUNAN EINSTEIN.COM"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
}
