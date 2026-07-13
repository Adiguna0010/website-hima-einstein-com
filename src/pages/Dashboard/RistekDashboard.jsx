import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ShieldCheck, FileText, Globe } from 'lucide-react';

export default function RistekDashboard({ showToast }) {
  const [vaultItems, setVaultItems] = useState([]);
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('');

  const DEFAULT_VAULT = [
    { id: 1, title: 'UTS: Mikroprosesor & Mikrokontroler', size: '2.4 MB' },
    { id: 2, title: 'Modul Praktikum: Detektor Radiasi Nuklir', size: '4.8 MB' }
  ];

  useEffect(() => {
    const savedVault = localStorage.getItem('hima_vault');
    if (savedVault) {
      setVaultItems(JSON.parse(savedVault));
    } else {
      localStorage.setItem('hima_vault', JSON.stringify(DEFAULT_VAULT));
      setVaultItems(DEFAULT_VAULT);
    }
  }, []);

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!title || !size) {
      showToast('Lengkapi nama dokumen dan ukuran!', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      title,
      size
    };

    const updated = [...vaultItems, newItem];
    setVaultItems(updated);
    localStorage.setItem('hima_vault', JSON.stringify(updated));
    showToast('Dokumen baru berhasil ditambahkan ke Einstein Vault!', 'success');
    
    setTitle('');
    setSize('');
  };

  const handleDeleteFile = (id) => {
    const updated = vaultItems.filter(item => item.id !== id);
    setVaultItems(updated);
    localStorage.setItem('hima_vault', JSON.stringify(updated));
    showToast('Dokumen berhasil dihapus dari Einstein Vault.', 'info');
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-limeGreen font-bold tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5" /> RISTEK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Einstein Vault Manager
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Pengelolaan file modul, bank soal, dan referensi akademik otonom bagi mahasiswa Elektronika Instrumentasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Document list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-limeGreen" /> Daftar Modul Vault Aktif
          </h3>

          <div className="space-y-3">
            {vaultItems.length === 0 ? (
              <div className="text-center py-10 bg-white/5 border border-white/5 rounded-2xl text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Belum ada file terunggah di Vault.</p>
              </div>
            ) : (
              vaultItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-electricCyan transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Format: PDF • Ukuran: {item.size}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(item.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Add Form */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4.5 h-4.5 text-electricCyan" /> Tambah File Baru
          </h3>

          <div className="glass border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-electricCyan/5 rounded-full blur-xl"></div>
            
            <form onSubmit={handleAddFile} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Nama Dokumen</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Kumpulan Soal UAS Sensor & Tranduser"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Ukuran File (Estimasi)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 3.2 MB"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-electricBlue to-electricCyan text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md"
              >
                Unggah ke Vault <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
