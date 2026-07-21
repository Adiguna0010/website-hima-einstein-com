import React, { useState, useEffect } from 'react';
import { 
  Coins, TrendingUp, TrendingDown, Calendar, FileSpreadsheet, Download, 
  DollarSign, PieChart, Info, ArrowUpRight, ShoppingBag, Wallet, Layers, Filter 
} from 'lucide-react';

export default function Finance({ showToast }) {
  const defaultBudgets = [
    { division: 'BPH (Badan Pengurus Harian)', allocated: 0, used: 0, color: 'bg-amber-500' },
    { division: 'Dana Usaha (Danus)', allocated: 0, used: 0, color: 'bg-emerald-500' },
    { division: 'Riset & Teknologi (Ristek)', allocated: 0, used: 0, color: 'bg-blue-500' },
    { division: 'Pengembangan Mahasiswa (Pengma)', allocated: 0, used: 0, color: 'bg-purple-500' },
    { division: 'Eksternal (Sponsorship & Humas)', allocated: 0, used: 0, color: 'bg-rose-500' }
  ];

  const [records, setRecords] = useState([]);
  const [budgets, setBudgets] = useState(defaultBudgets);
  
  // Danus Specific Data States
  const [danusOrders, setDanusOrders] = useState([]);
  const [danusLedger, setDanusLedger] = useState([]);
  const [ledgerFilter, setLedgerFilter] = useState('all'); // 'all' | 'kas_hima' | 'danus'

  useEffect(() => {
    // 1. Load HIMA general cash flow ledger
    const savedFlow = localStorage.getItem('hima_cashflow');
    if (savedFlow) {
      setRecords(JSON.parse(savedFlow));
    } else {
      localStorage.setItem('hima_cashflow', JSON.stringify([]));
      setRecords([]);
    }

    // 2. Load budget allocations
    const savedBudgets = localStorage.getItem('hima_budget_allocations');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      localStorage.setItem('hima_budget_allocations', JSON.stringify(defaultBudgets));
      setBudgets(defaultBudgets);
    }

    // 3. Load Danus Orders (Merchandise Sales)
    const savedOrders = localStorage.getItem('hima_orders');
    if (savedOrders) {
      setDanusOrders(JSON.parse(savedOrders));
    }

    // 4. Load Danus Operational Ledger
    const savedDanusLedger = localStorage.getItem('hima_danus_ledger');
    if (savedDanusLedger) {
      setDanusLedger(JSON.parse(savedDanusLedger));
    }
  }, []);

  const reportTemplates = [
    { id: 1, name: 'Laporan Keuangan Kuartal I - 2026', format: 'PDF', size: '1.2 MB', date: 'April 2026' },
    { id: 2, name: 'Buku Kas Umum Semester Ganjil - 2026', format: 'XLSX', size: '340 KB', date: 'Juli 2026' },
    { id: 3, name: 'Rencana Anggaran Biaya (RAB) Kabinet Photisma', format: 'PDF', size: '890 KB', date: 'Maret 2026' }
  ];

  // HIMA Main Cash Calculations
  const totalInHima = records.filter(r => r.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutHima = records.filter(r => r.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalanceHima = totalInHima - totalOutHima;

  // Danus Dual-Stream Calculations
  // Stream 1: Hasil Penjualan Merchandise (Verified/Active orders)
  const danusSalesEarnings = danusOrders
    .filter(o => o.status === 'Active')
    .reduce((sum, o) => sum + o.total, 0);

  // Stream 2: Kas Operasional & Modal Danus
  const danusCashIn = danusLedger.filter(r => r.type === 'in').reduce((sum, r) => sum + r.amount, 0);
  const danusCashOut = danusLedger.filter(r => r.type === 'out').reduce((sum, r) => sum + r.amount, 0);
  const danusNetOperationalCash = danusCashIn - danusCashOut;

  // Total Consolidated Danus Portfolio
  const totalDanusPortfolio = danusSalesEarnings + danusNetOperationalCash;

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

  // Combine ledgers for display based on filter
  const combinedLedger = () => {
    let list = [];

    if (ledgerFilter === 'all' || ledgerFilter === 'kas_hima') {
      list = list.concat(records.map(r => ({ ...r, source: 'Kas HIMA' })));
    }

    if (ledgerFilter === 'all' || ledgerFilter === 'danus') {
      // Add Danus Operational Ledger entries
      list = list.concat(danusLedger.map(r => ({
        ...r,
        source: 'Kas Danus',
        category: r.category || 'Danus Operasional'
      })));

      // Add Verified Merchandise Orders as Sales Income entries
      const salesEntries = danusOrders
        .filter(o => o.status === 'Active')
        .map(o => ({
          id: `order-${o.id}`,
          date: 'Terverifikasi',
          desc: `Penjualan Merchandise: ${o.items} (${o.name})`,
          type: 'in',
          amount: o.total,
          category: 'Hasil Penjualan Danus',
          source: 'Penjualan Danus'
        }));
      list = list.concat(salesEntries);
    }

    return list;
  };

  const displayRecords = combinedLedger();

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
          <Coins className="w-8 h-8 text-gold" /> TRANSPARANSI & KEUANGAN ORGANISASI
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-3xl">
          Laporan keuangan transparan, transparansi arus kas operasional, pertanggungjawaban portofolio Dana Usaha (Danus), serta alokasi anggaran Kabinet Phótisma HIMA EINSTEN.
        </p>
      </div>

      {/* Main Financial Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Card 1: Balance Kas HIMA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-gold/30 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Saldo Kas Utama HIMA</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(currentBalanceHima)}</h3>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="w-3 h-3" /> Kas Bersih Operasional
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Pemasukan Kas HIMA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Pemasukan Kas HIMA</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalInHima)}</h3>
            <span className="text-[10px] text-slate-500 font-light">Dari iuran kas, hibah & sponsor</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Pengeluaran Kas HIMA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-rose-200 hover:shadow-md transition-all">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Pengeluaran Kas HIMA</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalOutHima)}</h3>
            <span className="text-[10px] text-slate-500 font-light">Untuk program kerja & sarpras</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: TRANSPARANSI & PHOTISMA FINANCE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-left border border-slate-800 space-y-6">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-gold tracking-widest uppercase bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20">
              <ShoppingBag className="w-3.5 h-3.5" /> PHOTISMA FINANCE
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
              Photisma Finance
            </h2>
            <p className="text-slate-400 text-xs font-light">
              Transparansi dua aliran dana: Hasil Penjualan & Keuangan Dana Usaha Photisma.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-3 text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Photisma Finance</span>
            <span className="text-2xl font-extrabold text-gold font-heading">{formatRupiah(totalDanusPortfolio)}</span>
          </div>
        </div>

        {/* 2 Streams Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream 1 Card */}
          <div className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3 hover:border-gold/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gold-light uppercase tracking-wider block">Aliran Dana 1</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Hasil Penjualan
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-gold/10 border border-gold/20 text-gold shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/50 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-white font-heading">{formatRupiah(danusSalesEarnings)}</span>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> Revenue Store Terverifikasi
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {danusOrders.filter(o => o.status === 'Active').length} Transaksi Lunas
              </span>
            </div>
          </div>

          {/* Stream 2 Card */}
          <div className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3 hover:border-blue-400/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Aliran Dana 2</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Keuangan Dana Usaha Photisma
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/50 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-white font-heading">{formatRupiah(danusNetOperationalCash)}</span>
                <p className="text-[10px] text-slate-400 font-light mt-0.5">
                  Debet: {formatRupiah(danusCashIn)} • Kredit: {formatRupiah(danusCashOut)}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {danusLedger.length} Entri Jurnal
              </span>
            </div>
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
            {budgets.map((item, idx) => {
              const pct = item.allocated > 0 ? Math.round((item.used / item.allocated) * 100) : 0;
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

      {/* Integrated Cash Flow Ledger Table with Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 text-left relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-gold" /> Jurnal Transparansi Arus Kas Konsolidasi
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Jurnal entri transaksi kas HIMA dan Danus secara terintegrasi dan real-time.
            </p>
          </div>

          {/* Ledger Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setLedgerFilter('all')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                ledgerFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua Entri ({combinedLedger().length})
            </button>
            <button
              onClick={() => setLedgerFilter('kas_hima')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                ledgerFilter === 'kas_hima'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kas Utama HIMA ({records.length})
            </button>
            <button
              onClick={() => setLedgerFilter('danus')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                ledgerFilter === 'danus'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kas Danus & Sales ({danusLedger.length + danusOrders.filter(o => o.status === 'Active').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4">Sumber / Modul</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Deskripsi Transaksi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Debit (In)</th>
                <th className="py-3 px-4 text-right">Kredit (Out)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Jurnal Buku Kas kosong.
                  </td>
                </tr>
              ) : (
                displayRecords.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                        record.source === 'Penjualan Danus'
                          ? 'bg-gold/15 text-gold-dark border-gold/30'
                          : record.source === 'Kas Danus'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {record.source || 'Kas HIMA'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{record.date}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
