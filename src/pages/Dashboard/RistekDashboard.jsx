import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ShieldCheck, FileText, Download } from 'lucide-react';

export default function RistekDashboard({ showToast }) {
  const [vaultItems, setVaultItems] = useState([]);
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('Dokumen');
  const [url, setUrl] = useState('');

  const DEFAULT_VAULT = [
    { id: 1, title: 'UTS: Mikroprosesor & Mikrokontroler', size: '2.4 MB', type: 'Dokumen', url: '#' },
    { id: 2, title: 'Modul Praktikum: Detektor Radiasi Nuklir', size: '4.8 MB', type: 'Dokumen', url: '#' }
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
      showToast('Lengkapi nama file dan ukuran!', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      title,
      size,
      type,
      url: url || '#'
    };

    const updated = [...vaultItems, newItem];
    setVaultItems(updated);
    localStorage.setItem('hima_vault', JSON.stringify(updated));
    showToast('File baru berhasil ditambahkan ke Einstein Vault!', 'success');
    
    setTitle('');
    setSize('');
    setType('Dokumen');
    setUrl('');
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus file ini dari Vault?')) {
      const updated = vaultItems.filter(item => item.id !== id);
      setVaultItems(updated);
      localStorage.setItem('hima_vault', JSON.stringify(updated));
      showToast('File berhasil dihapus dari Einstein Vault.', 'info');
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5 text-gold" /> RISTEK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Einstein Vault Manager
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan file modul, bank soal, software, dan referensi akademik otonom bagi mahasiswa Elektronika Instrumentasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Document list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Daftar File Vault Aktif
          </h3>

          <div className="space-y-3">
            {vaultItems.length === 0 ? (
              <div className="text-center py-10 bg-white border border-gold-border rounded-2xl text-slate-550 shadow-sm">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-350" />
                <p className="text-xs">Belum ada file terunggah di Vault.</p>
              </div>
            ) : (
              vaultItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 shadow-sm transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1 pr-4">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Tipe: <span className="font-bold text-gold-dark">{item.type || 'Dokumen'}</span> • Ukuran: {item.size}
                    </p>
                    {item.url && item.url !== '#' && (
                      <p className="text-[9px] text-slate-400 font-mono truncate">Tautan: {item.url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.url && item.url !== '#' && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-gold/10 text-gold-dark transition-colors"
                        title="Buka Tautan File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteFile(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                      title="Hapus File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Add Form */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4.5 h-4.5 text-gold" /> Tambah File Baru (Dokumen/Software)
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
            
            <form onSubmit={handleAddFile} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama File / Referensi</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Kumpulan Soal UAS Sensor & Tranduser"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Ukuran File (Estimasi)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 3.2 MB atau 125 MB"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tipe File</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                >
                  <option value="Dokumen">Dokumen (Modul, Bank Soal, Buku)</option>
                  <option value="Software">Software (IDE, Simulator, Tools)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tautan Download / URL File (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: https://link-to-file.com/installer.zip"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md shadow-gold/20"
              >
                Unggah ke Vault <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
