import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Target, User, Users } from 'lucide-react';

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

  const divisionsData = [
    {
      title: 'Divisi Riset dan Teknologi (Ristek)',
      kadiv: {
        name: 'Adiguna Nugroho Halomoan',
        nim: '022400025',
        role: 'Kepala Divisi Ristek',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Ristek/Kepala Divisi Riset dan Teknologi_Adiguna Nugroho Halomoan - 022400025.JPG'
      },
      members: [
        { name: 'Reky Destaliansyah Nanda Purnomo', nim: '022400002', role: 'Anggota Divisi Ristek' },
        { name: 'Pasha Octa Perdana', nim: '022400049', role: 'Anggota Divisi Ristek' },
        { name: 'Misbah Muhammad Giani', nim: '022400014', role: 'Anggota Divisi Ristek' },
        { name: 'Muhammad Dzaki Mumtazi', nim: '022400016', role: 'Anggota Divisi Ristek' },
        { name: 'Hana Fitri Annisa', nim: '022400021', role: 'Anggota Divisi Ristek' },
        { name: 'Firryal Nisrina Faiqah', nim: '022400008', role: 'Anggota Divisi Ristek' },
        { name: 'Syamuel Libaas Alfathin Abdilhaq', nim: '022500048', role: 'Anggota Divisi Ristek' },
        { name: 'Agung Fransisco Tampubolon', nim: '022500002', role: 'Anggota Divisi Ristek' },
        { name: 'Rasya Andrew Budi Saputra', nim: '022500043', role: 'Anggota Divisi Ristek' },
        { name: 'Arindo Cahyo Wicaksono', nim: '022500007', role: 'Anggota Divisi Ristek' },
        { name: 'Naila Saumusalamah', nim: '022500035', role: 'Anggota Divisi Ristek' }
      ]
    },
    {
      title: 'Divisi Dana Usaha (Danus)',
      kadiv: {
        name: 'Rabbany Al-Malika Ifadzla',
        nim: '022400006',
        role: 'Kepala Divisi Danus',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Dana Usaha/Kepala Divisi Dana Usaha_Rabbany Al-Malika Ifadzla - 022400006.JPG'
      },
      members: [
        { name: 'Gathfan Darmawan', nim: '022400052', role: 'Anggota Divisi Danus' },
        { name: 'Shira Kane Avicena', nim: '022400043', role: 'Anggota Divisi Danus' },
        { name: 'Azizi Maulidya Pasha', nim: '022400012', role: 'Anggota Divisi Danus' },
        { name: 'Bilbina Balqis', nim: '022400024', role: 'Anggota Divisi Danus' },
        { name: 'Sofia Atifah', nim: '022400026', role: 'Anggota Divisi Danus' },
        { name: 'Candra Nur Hafidh', nim: '022500010', role: 'Anggota Divisi Danus' },
        { name: 'Muchammad Rohmanu Surya Pratama', nim: '022500026', role: 'Anggota Divisi Danus' }
      ]
    },
    {
      title: 'Divisi Aset dan Logistik',
      kadiv: {
        name: 'Rakan Ibrahim Widjisasono',
        nim: '022400031',
        role: 'Kepala Divisi Aset & Logistik',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Aset Dan Logistik/Kepala Divisi Aset dan Logistik_Rakan Ibrahim Widjisasono - 022400031.JPG'
      },
      members: [
        { name: 'Faljarisy Bellyn', nim: '022500015', role: 'Anggota Divisi Aset & Logistik' },
        { name: 'Ininka Atalan Zia Akbar', nim: '022500020', role: 'Anggota Divisi Aset & Logistik' }
      ]
    },
    {
      title: 'Divisi Hubungan Eksternal',
      kadiv: {
        name: 'Kunti Aisyatuzzahra',
        nim: '022400045',
        role: 'Kepala Divisi Eksternal',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/External/Kepala Divisi Eksternal_Kunti Aisyatuzzahra - 022400045.JPG'
      },
      members: [
        { name: 'Ganazel Oktaviano Ramadhan', nim: '022400048', role: 'Anggota Divisi Eksternal' },
        { name: 'Alfi Alaauddin Diov', nim: '022400027', role: 'Anggota Divisi Eksternal' },
        { name: 'Ardranitya Brilian Fery Marchfida', nim: '022400030', role: 'Anggota Divisi Eksternal' },
        { name: 'Blessia Tesalonika Salindeho', nim: '022400009', role: 'Anggota Divisi Eksternal' },
        { name: 'Muhammad Danish Azka Bimoprasetya', nim: '022500029', role: 'Anggota Divisi Eksternal' },
        { name: 'Raffa Dimas Albani', nim: '022500039', role: 'Anggota Divisi Eksternal' },
        { name: 'Ghafirah Dzatusy Syarafah', nim: '022500016', role: 'Anggota Divisi Eksternal' },
        { name: 'Reisya Salsabila', nim: '022500044', role: 'Anggota Divisi Eksternal' },
        { name: 'Malika Dela Safitri', nim: '022500024', role: 'Anggota Divisi Eksternal' }
      ]
    },
    {
      title: 'Divisi Hubungan Internal',
      kadiv: {
        name: 'Hafizh Maulana Wijaya',
        nim: '022400019',
        role: 'Kepala Divisi Internal',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Internal/Kepala Divisi Internal_Hafizh Maulana Wijaya - 022400019.JPG'
      },
      members: [
        { name: 'Mohamad Maulana Subhi', nim: '022400035', role: 'Anggota Divisi Internal' },
        { name: 'Zhakya Aisyah Riswandhita', nim: '022400017', role: 'Anggota Divisi Internal' },
        { name: 'Hanifah Nurul Aqilla', nim: '022400011', role: 'Anggota Divisi Internal' },
        { name: 'Rahmaningrum', nim: '022400003', role: 'Anggota Divisi Internal' },
        { name: 'Muhammad Nur Zidane', nim: '022500032', role: 'Anggota Divisi Internal' },
        { name: 'Muhammad Hanif Al Hasby', nim: '022500030', role: 'Anggota Divisi Internal' },
        { name: 'Made Pryamanaya Satria Dewadatta Ganesha Pooja', nim: '022500023', role: 'Anggota Divisi Internal' },
        { name: 'Ahmad Sheva Bai Mogo', nim: '022500003', role: 'Anggota Divisi Internal' },
        { name: 'Julia Prahana Cipta Hania', nim: '022500021', role: 'Anggota Divisi Internal' },
        { name: 'Orchida Rasti Nugrahani', nim: '022500038', role: 'Anggota Divisi Internal' }
      ]
    },
    {
      title: 'Divisi Komunikasi dan Informasi (Kominfo)',
      kadiv: {
        name: 'Sunniy',
        nim: '022400041',
        role: 'Kepala Divisi Kominfo',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Kominfo/Kepala Divisi Komunikasi dan Informasi_Sunniy - 022400041.JPG'
      },
      members: [
        { name: 'Titania Hanifa Briliana', nim: '022400046', role: 'Anggota Divisi Kominfo' },
        { name: 'Annisa Syakeira Kirana', nim: '022400007', role: 'Anggota Divisi Kominfo' },
        { name: 'Muhammad Rafahdya Diaztiano', nim: '022500033', role: 'Anggota Divisi Kominfo' },
        { name: 'Amalia Syalbiya Qulam', nim: '022500006', role: 'Anggota Divisi Kominfo' },
        { name: 'Lu\'lu Tazkiya Nur\'azizah', nim: '022500022', role: 'Anggota Divisi Kominfo' }
      ]
    },
    {
      title: 'Divisi Pengembangan Mahasiswa (Pema)',
      kadiv: {
        name: 'Farrelega Zhafran Vito Ardhana',
        nim: '022400038',
        role: 'Kepala Divisi Pema',
        photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Pema/Kepala Divisi Pengembangan Mahasiswa_Farrelega Zhafran Vito Ardhana - 022400038.JPG'
      },
      members: [
        { name: 'Muhammad Fattan Hanandory', nim: '022400050', role: 'Anggota Divisi Pema' },
        { name: 'Moh Irghi Islami', nim: '022400044', role: 'Anggota Divisi Pema' },
        { name: 'Shafina Zaidiya Nihrira', nim: '022400015', role: 'Anggota Divisi Pema' },
        { name: 'Rizka Laila Rachmawati', nim: '022400036', role: 'Anggota Divisi Pema' },
        { name: 'Muhammad Alif Zuhar Hasan', nim: '022500027', role: 'Anggota Divisi Pema' },
        { name: 'Muhammad Ba\'iathurrahman Antara', nim: '022500028', role: 'Anggota Divisi Pema' },
        { name: 'Hans Artanta Christoper Ketaren', nim: '022500018', role: 'Anggota Divisi Pema' },
        { name: 'Dahra Anastasya Dwi Zakiyati', nim: '022500012', role: 'Anggota Divisi Pema' },
        { name: 'Nazwa Aulia Rahmah', nim: '022500036', role: 'Anggota Divisi Pema' }
      ]
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'EX';
    const split = name.trim().split(/\s+/);
    if (split.length >= 2) {
      return (split[0][0] + split[1][0]).toUpperCase();
    }
    return split[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative pt-24 space-y-24 overflow-hidden pb-16 text-slate-800 font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>
      <div className="absolute top-80 right-10 w-[500px] h-[500px] rounded-full bg-gold/5 glow-orb"></div>

      {/* ================= HERO SECTION ================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 lg:py-16">
          
          {/* Badge */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-xs font-semibold text-gold-dark tracking-wider uppercase">
            Himpunan Elektronika Instrumentasi
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold uppercase tracking-tight text-slate-900 leading-none max-w-4xl">
            Selamat Datang di Website Resmi <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">HIMA EINSTEN</span> Poltek Nuklir
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
              Tentang Kami
            </a>
            <Link 
              to="/struktur" 
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl active:scale-95 transition-all text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              Lihat Struktur <Users className="w-4 h-4 text-white" />
            </Link>
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
                alt="Pengurus HIMPUNAN EINSTEN.COM" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-left">
                <p className="text-xs font-semibold text-white">Pengurus HIMPUNAN EINSTEN.COM</p>
                <p className="text-[10px] text-gold-light font-medium mt-0.5">Kabinet Phótisma 2026/2027</p>
              </div>
            </div>
          </div>

          {/* Right: History/About */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest block">Tentang Kami</span>
              <h2 className="text-3xl font-extrabold uppercase text-slate-900 mt-1">HIMPUNAN EINSTEN.COM</h2>
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


      {/* ================= EMBEDDED VIDEO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Video Profil</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-900">OFFICIAL TEASER PROFILE</h2>
          <p className="text-xs text-slate-500 font-light">Saksikan sekilas profil dan kegiatan HIMPUNAN EINSTEN.COM</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md relative aspect-video">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/rlw_VDUuNOk" 
            title="Teaser Profile HIMPUNAN EINSTEN.COM"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
}
