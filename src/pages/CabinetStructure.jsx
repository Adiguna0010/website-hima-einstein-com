import React from 'react';
import { User } from 'lucide-react';

export default function CabinetStructure() {
  const pembimbing = {
    name: 'Budi Suhendro, S.ST., M.KOM',
    nip: '197206071992121004',
    role: 'Pembimbing Organisasi / Ketua Program Studi',
    detail: 'Elektronika Instrumentasi'
  };

  const bphCore = [
    {
      name: 'Muhammad Iqbal Nur Huda',
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
    <div className="relative pt-28 space-y-16 pb-16 text-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Struktur Kabinet</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">STRUKTUR ORGANISASI KABINET</h1>
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
            
            {/* Logo Order: BRIN on left, Poltek on right */}
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

        {/* Jajaran Kepala Divisi & Anggota (Struktur Pohon) */}
        <div className="space-y-12 pt-4">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest text-center border-b border-slate-200 pb-4">
            Jajaran Divisi & Anggota Kabinet
          </h4>
          
          {divisionsData.map((div, divIdx) => (
            <div key={divIdx} className="space-y-6 p-6 bg-slate-50/50 border border-slate-200/60 rounded-3xl">
              {/* Division Title */}
              <h5 className="text-xs font-bold text-gold-dark uppercase tracking-widest text-center font-sans">
                {div.title}
              </h5>

              {/* Kepala Divisi (Atas, Centered) */}
              <div className="flex justify-center">
                <div className="bg-white border border-gold-border rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col group shadow-sm text-left w-44">
                  <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative border-b border-slate-105">
                    <img 
                      src={div.kadiv.photo} 
                      alt={div.kadiv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/150x200/fffbeb/d97706?text=" + encodeURIComponent(div.kadiv.name);
                      }}
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-[7px] font-extrabold text-gold-dark uppercase tracking-widest leading-none mb-1">Kepala Divisi</span>
                      <h5 className="text-[9px] font-bold text-slate-800 line-clamp-2 leading-tight font-sans">{div.kadiv.name}</h5>
                    </div>
                    <span className="block text-[8px] text-slate-400 font-mono mt-1 leading-none">NIM: {div.kadiv.nim}</span>
                  </div>
                </div>
              </div>

              {/* Anggota Divisi (Bawah - Centered using flex justify-center) */}
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto pt-2">
                {div.members.map((m) => (
                  <div 
                    key={m.nim}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-gold hover:shadow-sm transition-all duration-300 group shadow-sm w-36 sm:w-40"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold-dark text-xs font-bold font-mono mb-2.5 relative group-hover:scale-105 transition-transform duration-300">
                      {getInitials(m.name)}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center text-[6px] text-white">✓</span>
                    </div>
                    <div className="space-y-1">
                      <h6 className="text-[9px] font-bold text-slate-800 line-clamp-2 leading-tight font-sans min-h-[24px]">{m.name}</h6>
                      <span className="block text-[8px] text-slate-400 font-sans">Anggota Divisi</span>
                    </div>
                    <span className="block text-[8px] text-slate-450 font-mono mt-2 leading-none">NIM: {m.nim}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
