import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Globe, BookOpen, Rocket, ShoppingCart, Radio, Box, ArrowRight } from 'lucide-react';

export default function Sphere() {
  const navigate = useNavigate();

  const divisions = [
    {
      key: 'bph',
      title: 'BPH (Badan Pengurus Harian)',
      iconComponent: <Users className="w-6 h-6 text-gold" />,
      desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
    },
    {
      key: 'internal',
      title: 'Internal',
      iconComponent: <Users className="w-6 h-6 text-gold" />,
      desc: 'Fokus pada penyelarasan kekerabatan pengurus Himpunan, penampungan aspirasi internal, dan perumusan kegiatan kebersamaan.',
    },
    {
      key: 'external',
      title: 'External Division',
      iconComponent: <Globe className="w-6 h-6 text-gold" />,
      desc: 'Menghubungkan HIMA EINSTEIN dengan alumni, korporasi industri nuklir/kesehatan, BRIN, serta himpunan mahasiswa luar.',
    },
    {
      key: 'ristek',
      title: 'Riset & Teknologi',
      iconComponent: <BookOpen className="w-6 h-6 text-gold" />,
      desc: 'Mendorong kecakapan mahasiswa di bidang instrumentasi nuklir melalui bank soal terintegrasi, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.',
    },
    {
      key: 'pengma',
      title: 'Pengembangan Mahasiswa',
      iconComponent: <Rocket className="w-6 h-6 text-gold" />,
      desc: 'Fasilitas sertifikasi industri, persiapan karir, rekrutmen magang, dan kompilasi info prestasi kemahasiswaan.',
    },
    {
      key: 'danus',
      title: 'Dana Usaha',
      iconComponent: <ShoppingCart className="w-6 h-6 text-gold" />,
      desc: 'Wirausaha mandiri Himpunan. Pembelian produk eksklusif PDH, bomber, dan merchandise resmi HIMA EINSTEIN.',
    },
    {
      key: 'kominfo',
      title: 'Komunikasi & Informasi',
      iconComponent: <Radio className="w-6 h-6 text-gold" />,
      desc: 'Media publikasi berita sains nuklir, dokumentasi kegiatan, rilis buletin triwulan EINSTEIN, dan podcast audio visual.',
    },
    {
      key: 'logistik',
      title: 'Logistik',
      iconComponent: <Box className="w-6 h-6 text-gold" />,
      desc: 'Portal peminjaman alat penunjang praktikum mahasiswa (solder, multimeter, starter kit Arduino) secara transparan.',
    }
  ];

  const handleCardClick = (key) => {
    navigate(`/sphere/${key}`);
  };

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gold/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Sektor Kepengurusan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEIN SPHERE</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Pusat koordinasi 8 divisi Kabinet Phótisma. Pilih divisi di bawah untuk membuka halaman informasi dan program kerja resmi.
        </p>
      </div>

      {/* Grid of 8 division cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {divisions.map((div) => (
          <div
            key={div.key}
            onClick={() => handleCardClick(div.key)}
            className="p-6 bg-white border border-gold-border rounded-3xl text-left cursor-pointer hover:border-gold/30 hover:bg-slate-50/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group min-h-[190px] shadow-sm hover:shadow-md relative overflow-hidden"
          >
            {/* Glowing spot */}
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gold/5 group-hover:bg-gold/10 transition-colors rounded-full blur-xl"></div>
            
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gold/10 flex items-center justify-center shadow-inner">
                {div.iconComponent}
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider group-hover:text-gold-dark transition-colors">
                {div.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light line-clamp-3">
                {div.desc}
              </p>
            </div>
            
            <span className="text-[10px] text-gold-dark flex items-center gap-1 font-bold transition-colors">
              Lihat Detail Halaman <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
