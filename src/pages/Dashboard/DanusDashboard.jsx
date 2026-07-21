import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckCircle, Clock, Trash2, ArrowUpRight, DollarSign, Package, 
  Plus, Calendar, TrendingUp, TrendingDown, Coins, Wallet, FileSpreadsheet 
} from 'lucide-react';

export default function DanusDashboard({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [danusRecords, setDanusRecords] = useState([]);
  
  // Form state for Danus Cash Entry
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('in');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Kas Operasional');

  const DEFAULT_ORDERS = [
    { id: 1, name: 'Zacky Elins', items: 'Baju PDH Elins (1x)', total: 180000, file: 'bukti_zacky.png', status: 'Active' },
    { id: 2, name: 'Dian Pratama', items: 'Magic Com (1x), Meja Belajar (1x)', total: 270000, file: 'bukti_dian.jpg', status: 'Pending' }
  ];

  const DEFAULT_DANUS_RECORDS = [
    { id: 101, date: '2026-07-05', desc: 'Suntikan Dana Operasional Usaha', type: 'in', amount: 500000, category: 'Kas Operasional' },
    { id: 102, date: '2026-07-10', desc: 'Modal Pembelian Bahan & Kain PDH', type: 'out', amount: 250000, category: 'Modal Produksi' }
  ];

  useEffect(() => {
    // Load Orders
    const savedOrders = localStorage.getItem('hima_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      localStorage.setItem('hima_orders', JSON.stringify(DEFAULT_ORDERS));
      setOrders(DEFAULT_ORDERS);
    }

    // Load Danus Operational Ledger
    const savedDanusLedger = localStorage.getItem('hima_danus_ledger');
    if (savedDanusLedger) {
      setDanusRecords(JSON.parse(savedDanusLedger));
    } else {
      localStorage.setItem('hima_danus_ledger', JSON.stringify(DEFAULT_DANUS_RECORDS));
      setDanusRecords(DEFAULT_DANUS_RECORDS);
    }
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('hima_orders', JSON.stringify(updated));
    showToast(`Pesanan berhasil diubah menjadi: ${newStatus}!`, 'success');
  };

  const handleAddDanusTransaction = (e) => {
    e.preventDefault();
    if (!desc || !amount) {
      showToast('Mohon lengkapi seluruh form transaksi Danus!', 'error');
      return;
    }

    const newRecord = {
      id: Date.now(),
      date,
      desc,
      type,
      amount: parseFloat(amount),
      category
    };

    const updated = [newRecord, ...danusRecords];
    setDanusRecords(updated);
    localStorage.setItem('hima_danus_ledger', JSON.stringify(updated));
    showToast('Transaksi kas Danus berhasil dicatat!', 'success');

    setDesc('');
    setAmount('');
  };

  const handleDeleteDanusTransaction = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan kas Danus ini?')) {
      const updated = danusRecords.filter(r => r.id !== id);
      setDanusRecords(updated);
      localStorage.setItem('hima_danus_ledger', JSON.stringify(updated));
      showToast('Catatan transaksi Danus telah dihapus.', 'info');
    }
  };

  // Calculations
  const salesEarnings = orders
    .filter(o => o.status === 'Active')
    .reduce((sum, o) => sum + o.total, 0);

  const danusCashIn = danusRecords
    .filter(r => r.type === 'in')
    .reduce((sum, r) => sum + r.amount, 0);

  const danusCashOut = danusRecords
    .filter(r => r.type === 'out')
    .reduce((sum, r) => sum + r.amount, 0);

  const danusNetCash = danusCashIn - danusCashOut;
  const totalDanusConsolidated = salesEarnings + danusNetCash;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <ShoppingBag className="w-3.5 h-3.5 text-gold" /> DANUS OPERATOR & TREASURY CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Merchandise & Danus Financial Board
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan pesanan merchandise, pencatatan kas operasional wirausaha, serta rekapitulasi transparansi keuangan Danus HIMA EINSTEN.
          </p>
        </div>
      </div>

      {/* Financial Overview Cards (2 Stream Breakdown) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stream 1: Hasil Penjualan */}
        <div className="p-5 bg-white border border-gold-border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Hasil Penjualan</span>
            <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              {formatRupiah(salesEarnings)}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> Merchandise Terverifikasi
            </p>
          </div>
        </div>

        {/* Stream 2: Kas Operasional Danus */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Kas Operasional Danus</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              {formatRupiah(danusNetCash)}
            </h3>
            <p className="text-[10px] text-slate-500 font-light mt-0.5">
              Sisa Modal & Arus Kas Operasional
            </p>
          </div>
        </div>

        {/* Combined Total: Portofolio Dana Usaha */}
        <div className="p-5 bg-emerald-50/50 border border-emerald-200/60 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Total Akumulasi Danus</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-emerald-950 font-heading">
              {formatRupiah(totalDanusConsolidated)}
            </h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Konsolidasi Penjualan & Kas
            </p>
          </div>
        </div>

        {/* Order Status Counts */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status Pesanan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              {orders.filter(o => o.status === 'Pending').length} Pending
            </h3>
            <p className="text-[10px] text-slate-500 font-light mt-0.5">
              Dari Total {orders.length} Transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Section: Catat Keuangan Danus & Jurnal Kas Operasional Danus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Form Pencatatan Kas Danus */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-gold" /> Catat Keuangan Danus
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Input arus kas masuk/keluar operasional divisi Danus (modal, cetak merch, dsb).
            </p>
          </div>

          <form onSubmit={handleAddDanusTransaction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Jenis Transaksi</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('in')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    type === 'in'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Kas Masuk (In)
                </button>
                <button
                  type="button"
                  onClick={() => setType('out')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    type === 'out'
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" /> Kas Keluar (Out)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Danus</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              >
                <option value="Kas Operasional">Kas Operasional Danus</option>
                <option value="Modal Produksi">Modal Produksi Merchandise</option>
                <option value="Biaya Kemasan & Pengiriman">Biaya Kemasan & Logistik</option>
                <option value="Suntikan Dana Usaha">Suntikan Dana Usaha</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi Transaksi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Beli kemasan hampers Danus"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nominal (Rupiah)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 150000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm"
            >
              Simpan Transaksi Kas Danus
            </button>
          </form>
        </div>

        {/* Tabel Jurnal Kas Operasional Danus */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4.5 h-4.5 text-gold" /> Jurnal Kas Operasional Danus
              </h3>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">
                Pencatatan arus kas internal operasional Danus yang disinkronkan ke Transparansi Keuangan.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 font-semibold">
              Saldo Kas: {formatRupiah(danusNetCash)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-105 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Deskripsi Transaksi</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Debet (In)</th>
                  <th className="py-2.5 px-3 text-right">Kredit (Out)</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {danusRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Jurnal Kas Danus masih kosong. Silakan catat transaksi baru.
                    </td>
                  </tr>
                ) : (
                  danusRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">{record.date}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{record.desc}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {record.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                        {record.type === 'in' ? '+' + formatRupiah(record.amount) : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-rose-600 font-bold">
                        {record.type === 'out' ? '-' + formatRupiah(record.amount) : '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteDanusTransaction(record.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md space-y-3">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5 text-gold" /> Daftar Pesanan & Validasi QRIS Merchandise
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Validasi bukti transfer pembeli untuk memasukkan dana penjualan ke dalam **Hasil Penjualan Danus**.
            </p>
          </div>
          <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold-dark font-extrabold text-xs rounded-xl font-mono">
            {formatRupiah(salesEarnings)} Lunas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Pembeli</th>
                <th className="px-6 py-4">Item Pesanan</th>
                <th className="px-6 py-4">Total Harga</th>
                <th className="px-6 py-4">Bukti Upload</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4 text-center">Tindakan Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    Belum ada riwayat pesanan masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{order.name}</td>
                    <td className="px-6 py-4">{order.items}</td>
                    <td className="px-6 py-4 font-bold text-gold-dark">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{order.file}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        order.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                          : 'bg-amber-50 text-amber-600 border-amber-500/20'
                      }`}>
                        {order.status === 'Active' ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.status === 'Pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Active')}
                            className="px-3 py-1 bg-gold text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-colors active:scale-95 flex items-center gap-0.5 shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-white" /> Validasi Lunas
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Pending')}
                            className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-[10px] font-bold rounded-lg transition-colors active:scale-95 shadow-sm"
                          >
                            Set Pending
                          </button>
                        )}
                      </div>
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
