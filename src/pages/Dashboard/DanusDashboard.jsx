import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, Clock, Trash2, ArrowUpRight, DollarSign, Package } from 'lucide-react';

export default function DanusDashboard({ showToast }) {
  const [orders, setOrders] = useState([]);

  const DEFAULT_ORDERS = [
    { id: 1, name: 'Zacky Elins', items: 'PDH EINSTEIN 2026 (1x)', total: 135000, file: 'bukti_zacky.png', status: 'Active' },
    { id: 2, name: 'Dian Pratama', items: 'Bomber Phótisma (1x), Gantungan Kunci (2x)', total: 215000, file: 'bukti_dian.jpg', status: 'Pending' }
  ];

  useEffect(() => {
    const savedOrders = localStorage.getItem('hima_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      localStorage.setItem('hima_orders', JSON.stringify(DEFAULT_ORDERS));
      setOrders(DEFAULT_ORDERS);
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

  const totalEarnings = orders
    .filter(o => o.status === 'Active')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-limeGreen font-bold tracking-widest uppercase">
            <ShoppingBag className="w-3.5 h-3.5" /> DANUS OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Merchandise & Sales Board
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Pengelolaan pesanan merchandise resmi HIMA EINSTEIN dan validasi bukti transaksi keuangan QRIS.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-limeGreen/10 border border-limeGreen/20 flex items-center justify-center text-limeGreen shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Dana Terkumpul</span>
            <span className="text-xl font-extrabold text-white font-heading">
              Rp {totalEarnings.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-electricBlue/10 border border-electricBlue/20 flex items-center justify-center text-electricCyan shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pesanan</span>
            <span className="text-xl font-extrabold text-white font-heading">{orders.length} Transaksi</span>
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Menunggu Validasi</span>
            <span className="text-xl font-extrabold text-white font-heading">
              {orders.filter(o => o.status === 'Pending').length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Nama Pembeli</th>
                <th className="px-6 py-4">Item Pesanan</th>
                <th className="px-6 py-4">Total Harga</th>
                <th className="px-6 py-4">Bukti Upload</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4 text-center">Tindakan Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    Belum ada riwayat pesanan masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{order.name}</td>
                    <td className="px-6 py-4">{order.items}</td>
                    <td className="px-6 py-4 font-bold text-limeGreen">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{order.file}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        order.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status === 'Active' ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.status === 'Pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Active')}
                            className="px-3 py-1 bg-limeGreen text-obsidian text-[10px] font-bold rounded-lg hover:brightness-110 transition-colors active:scale-95 flex items-center gap-0.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Validasi Lunas
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Pending')}
                            className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg transition-colors active:scale-95"
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
