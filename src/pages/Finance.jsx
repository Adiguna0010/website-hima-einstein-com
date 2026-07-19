import React, { useState } from 'react';
import { Coins, TrendingUp, TrendingDown, Calendar, FileSpreadsheet, Download, DollarSign, PieChart, Info, ArrowUpRight } from 'lucide-react';

export default function Finance({ showToast }) {
  // Dummy Financial Records Database
  const initialCashFlow = [
    { id: 1, date: '2026-07-18', desc: 'Dana Hibah Kampus Term I', type: 'in', amount: 5000000, category: 'Hibah' },
    { id: 2, date: '2026-07-16', desc: 'Sponsorship CV. MultiTek', type: 'in', amount: 2500000, category: 'Sponsor' },
    { id: 3, date: '2026-07-14', desc: 'Sewa Alat & Komponen (Danus)', type: 'in', amount: 620000, category: 'Danus' },
    { id: 4, date: '2026-07-12', desc: 'Pembelian Arduino & Sensor Elins', type: 'out', amount: 1200000, category: 'Logistik' },
    { id: 5, date: '2026-07-10', desc: 'Biaya Cetak Poster & Banner E-Fest', type: 'out', amount: 450000, category: 'Eksternal' },
    { id: 6, date: '2026-07-08', desc: 'Iuran Wajib Pengurus Bulanan', type: 'in', amount: 980000, category: 'Iuran' },
    { id: 7, date: '2026-07-05', desc: 'Konsumsi Rapat Pleno Tengah Tahun', type: 'out', amount: 600000, category: 'BPH' }
  ];

  const budgetDistribution = [
    { division: 'BPH (Badan Pengurus Harian)', allocated: 3000000, used: 600000, color: 'bg-amber-500' },
    { division: 'Dana Usaha (Danus)', allocated: 1500000, used: 0, color: 'bg-emerald-500' },
    { division: 'Riset & Teknologi (Ristek)', allocated: 4500000, used: 1200000, color: 'bg-blue-500' },
    { division: 'Pengembangan Mahasiswa (Pengma)', allocated: 2000000, used: 0, color: 'bg-purple-500' },
    { division: 'Eksternal (Sponsorship & Humas)', allocated: 2000000, used: 450000, color: 'bg-rose-500' }
  ];

  const reportTemplates = [
    { id: 1, name: 'Laporan Keuangan Kuartal I - 2026', format: 'PDF', size: '1.2 MB', date: 'April 2026' },
    { id: 2, name: 'Buku Kas Umum Semester Ganjil - 2026', format: 'XLSX', size: '340 KB', date: 'Juli 2026' },
    { id: 3, name: 'Rencana Anggaran Biaya (RAB) Kabinet Photisma', format: 'PDF', size: '890 KB', date: 'Maret 2026' }
  ];

  const [records, setRecords] = useState(initialCashFlow);

  // Compute totals
  const totalIn = records.filter(r => r.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = records.filter(r => r.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIn - totalOut;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleDownloadReport = (name) => {
    if (showToast) {
      showToast(`Mengunduh berkas: ${name}...`, 'success');
    } else {
      alert(`Mengunduh berkas: ${name}`);
    }
  };

  return (
    <div className="relative pt-24 pb-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      {/* Background decoration orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-light/5 glow-orb pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-left space-y-3 relative z-10">
        <span className="text-xs font-mono font-semibold text-gold-dark uppercase tracking-widest block">
          [ KEUANGAN & TRANSPARANSI ]
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <Coins className="w-8 h-8 text-gold" /> TRANSPARANSI & KEUANGAN
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-2xl">
          Laporan keuangan transparan, arus kas bulanan, buku kas umum, dan distribusi anggaran program kerja Kabinet Phótisma HIMA EINSTEN.
        </p>
      </div>

      {/* Financial Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Card 1: Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-gold/30 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Saldo Kas HIMA</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(currentBalance)}</h3>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
              <ArrowUpRight className="w-3 h-3" /> Bersih / Tersedia
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total In */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Total Pemasukan</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalIn)}</h3>
            <span className="text-[10px] text-slate-500 font-light">Dari iuran, hibah & sponsor</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Out */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-rose-200 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Total Pengeluaran</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalOut)}</h3>
            <span className="text-[10px] text-slate-500 font-light">Untuk program kerja & sarpras</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Distribution and Download reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Grid: Budget Distribution */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4.5 h-4.5 text-gold" /> Distribusi Anggaran per Divisi
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Pagu anggaran teralokasi dan penggunaan riil kas pertanggungjawaban divisi Kabinet Photisma.
            </p>
          </div>

          <div className="space-y-5">
            {budgetDistribution.map((item, idx) => {
              const pct = Math.round((item.used / item.allocated) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.division}</span>
                    <span className="font-mono text-slate-500">
                      {formatRupiah(item.used)} / {formatRupiah(item.allocated)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Grid: Downloads & Reports */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4.5 h-4.5 text-gold" /> Unduh Laporan Bendahara
              </h3>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">
                Dokumen Laporan Pertanggungjawaban Keuangan (LPJK) resmi bendahara umum HIMA.
              </p>
            </div>

            <div className="space-y-3">
              {reportTemplates.map((report) => (
                <div 
                  key={report.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100/50 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gold/15 text-gold-dark border border-gold/30">{report.format}</span>
                      {report.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">
                      Ukuran: {report.size} • Terbit: {report.date}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDownloadReport(report.name)}
                    className="p-2 bg-white hover:bg-gold hover:text-white rounded-lg border border-slate-200 hover:border-gold text-slate-600 transition-all cursor-pointer shadow-sm"
                    title="Unduh Laporan"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex gap-2.5 items-start mt-4">
            <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 leading-relaxed font-light">
              <strong>Info Aksesibilitas:</strong> Semua laporan keuangan di atas telah diaudit secara internal oleh BPH (Badan Pengurus Harian) dan disetujui oleh Pembina Himpunan.
            </p>
          </div>
        </div>
      </div>

      {/* Cash Flow Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-left relative z-10">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-gold" /> Jurnal Buku Kas Umum (Arus Kas)
          </h3>
          <p className="text-[11px] text-slate-400 font-light mt-0.5">
            Daftar entri jurnal pemasukan dan pengeluaran kas Himpunan secara kronologis.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Deskripsi Transaksi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Debit (In)</th>
                <th className="py-3 px-4 text-right">Kredit (Out)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-550">{record.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{record.desc}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {record.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                    {record.type === 'in' ? '+' + formatRupiah(record.amount) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600 font-bold">
                    {record.type === 'out' ? '-' + formatRupiah(record.amount) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
