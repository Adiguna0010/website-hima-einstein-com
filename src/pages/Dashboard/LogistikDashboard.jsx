import React, { useState, useEffect } from 'react';
import { Box, CheckCircle, HelpCircle, ToggleLeft, ToggleRight, Radio, ShieldCheck } from 'lucide-react';

export default function LogistikDashboard({ showToast }) {
  const [instruments, setInstruments] = useState([]);

  const DEFAULT_INSTRUMENTS = [
    { id: 'HIMA-MULT-002', name: 'Digital Multimeter Sanwa CD800a', status: 'Available', image: '📟' },
    { id: 'HIMA-SOLD-005', name: 'Solder Station Hakko', status: 'Borrowed', image: '🔥' },
    { id: 'HIMA-ARDU-011', name: 'Arduino Uno Starter Kit', status: 'Available', image: '🔌' }
  ];

  useEffect(() => {
    const savedInst = localStorage.getItem('hima_instruments');
    if (savedInst) {
      setInstruments(JSON.parse(savedInst));
    } else {
      localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
      setInstruments(DEFAULT_INSTRUMENTS);
    }
  }, []);

  const handleToggleStatus = (id) => {
    const updated = instruments.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === 'Available' ? 'Borrowed' : 'Available';
        return { ...inst, status: nextStatus };
      }
      return inst;
    });
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));
    showToast(`Status alat ${id} berhasil diubah!`, 'success');
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-limeGreen font-bold tracking-widest uppercase">
            <Box className="w-3.5 h-3.5" /> LOGISTIK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Instrument Inventory & Status Board
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Pengelolaan status peminjaman instrumen laboratorium otonom dan monitoring ketersediaan alat sekretariat.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-limeGreen/10 border border-limeGreen/20 flex items-center justify-center text-limeGreen shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Total Inventaris</span>
            <span className="text-xl font-extrabold text-white font-heading">{instruments.length} Unit Alat</span>
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Sedang Dipinjam</span>
            <span className="text-xl font-extrabold text-white font-heading">
              {instruments.filter(i => i.status === 'Borrowed').length} Unit
            </span>
          </div>
        </div>
      </div>

      {/* Inventory list table */}
      <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Alat Lab</th>
                <th className="px-6 py-4">Kode ID Inventaris</th>
                <th className="px-6 py-4">Status Alat</th>
                <th className="px-6 py-4 text-center">Tindakan Otoritas (Status Toggle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {instruments.map((inst) => (
                <tr key={inst.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="text-2xl">{inst.image}</span>
                    <span className="font-semibold text-white">{inst.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono">{inst.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                      inst.status === 'Available' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {inst.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleToggleStatus(inst.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                          inst.status === 'Available'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {inst.status === 'Available' ? (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-400" /> Set Dipinjam
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-400" /> Set Tersedia
                          </>
                        )}
                      </button>
                    </div>
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
