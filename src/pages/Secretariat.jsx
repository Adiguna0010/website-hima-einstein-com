import React, { useState, useEffect } from 'react';
import { Download, Send, ListFilter, ClipboardCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Secretariat({ showToast }) {
  const { currentUser } = useAuth();
  const [letters, setLetters] = useState([]);
  
  // Form states
  const [requester, setRequester] = useState('');
  const [category, setCategory] = useState('Surat Permohonan');
  const [subject, setSubject] = useState('');
  
  const [showBackoffice, setShowBackoffice] = useState(false);

  // Initial dummy letters database
  const DEFAULT_LETTERS = [
    { id: 1, requester: 'Ristek / Dian', category: 'Surat Permohonan', subject: 'Peminjaman Laboratorium Komputasi', status: 'ACC' },
    { id: 2, requester: 'Pengma / Budi', category: 'Surat Undangan', subject: 'Undangan Pembicara PLC Siemens', status: 'Pending' }
  ];

  useEffect(() => {
    const savedLetters = localStorage.getItem('hima_letters');
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    } else {
      localStorage.setItem('hima_letters', JSON.stringify(DEFAULT_LETTERS));
      setLetters(DEFAULT_LETTERS);
    }
  }, []);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requester || !subject) {
      showToast('Mohon lengkapi seluruh kolom formulir!', 'error');
      return;
    }

    const newRequest = {
      id: Date.now(),
      requester,
      category,
      subject,
      status: 'Pending'
    };

    const updated = [...letters, newRequest];
    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));
    showToast('Pengajuan nomor surat berhasil didaftarkan!', 'success');
    
    setRequester('');
    setSubject('');
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = letters.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));
    showToast(`Status pengajuan surat berhasil diubah menjadi: ${newStatus}!`, 'success');
  };

  const templates = [
    { name: 'Format Surat Undangan HIMA', format: 'DOCX', size: '45 KB', date: 'Juli 2026' },
    { name: 'Format Proposal Kegiatan HIMA', format: 'DOCX', size: '120 KB', date: 'Juli 2026' },
    { name: 'Format LPJ (Laporan Pertanggungjawaban)', format: 'DOCX', size: '95 KB', date: 'Juli 2026' }
  ];

  // User checking for dashboard display authority
  const hasBackofficeAccess = currentUser && (currentUser.role === 'Master Admin' || currentUser.role === 'Sekretaris Umum');

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-electricBlue/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Pengurusan Dokumen Himpunan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">PORTAL SEKRETARIAT</h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
          Unduh berkas template resmi organisasi dan ajukan permohonan nomor surat digital secara praktis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Download Center */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Download className="w-4.5 h-4.5 text-electricCyan" /> Download Center (Template Dokumen)
          </h3>

          <div className="space-y-4">
            {templates.map((tpl, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-electricCyan transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Format: {tpl.format} • Ukuran: {tpl.size} • Diperbarui: {tpl.date}
                  </p>
                </div>
                <button
                  onClick={() => showToast(`Mengunduh file: ${tpl.name}...`, 'success')}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-electricBlue hover:border-electricBlue hover:text-white text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  Unduh <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Request Form */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-left flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Send className="w-4.5 h-4.5 text-limeGreen" /> Request Nomor Surat BPH
          </h3>

          <div className="glass border border-white/10 rounded-2xl p-6 text-left space-y-4 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-limeGreen/5 rounded-full blur-xl"></div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Nama Pengusul / Divisi</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Ristek / Zacky"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Kategori Surat</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
                >
                  <option value="Surat Permohonan">Surat Permohonan</option>
                  <option value="Surat Undangan">Surat Undangan</option>
                  <option value="Surat Tugas">Surat Tugas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Perihal Surat</label>
                <input 
                  type="text" 
                  required
                  placeholder="Perihal pengajuan dana / izin ruang lab..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-obsidian border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-limeGreen text-obsidian font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md"
                >
                  Kirim Request <Send className="w-3.5 h-3.5" />
                </button>

                {hasBackofficeAccess && (
                  <button
                    type="button"
                    onClick={() => setShowBackoffice(!showBackoffice)}
                    className="px-4 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    {showBackoffice ? 'Tutup Panel' : 'Backoffice'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Backoffice Dashboard panel */}
      {hasBackofficeAccess && showBackoffice && (
        <div className="border-t border-white/5 pt-12 space-y-6 animate-slide-in">
          <div className="text-left space-y-1">
            <h2 className="text-lg font-bold uppercase text-white tracking-wide flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-electricCyan" /> DASHBOARD BACKOFFICE SEKRETARIS
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Tinjau, ACC (setujui), atau tolak nomor pengajuan surat resmi BPH secara otonom.
            </p>
          </div>

          <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Pengusul / Divisi</th>
                    <th className="px-6 py-4">Kategori Surat</th>
                    <th className="px-6 py-4">Perihal</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {letters.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                        Belum ada antrean pengajuan surat resmi.
                      </td>
                    </tr>
                  ) : (
                    letters.map((letter) => (
                      <tr key={letter.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{letter.requester}</td>
                        <td className="px-6 py-4">{letter.category}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{letter.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            letter.status === 'ACC' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : letter.status === 'Ditolak'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {letter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2 items-center">
                          {letter.status !== 'ACC' && (
                            <button
                              onClick={() => handleUpdateStatus(letter.id, 'ACC')}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-obsidian text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                            >
                              <CheckCircle className="w-3 h-3" /> ACC
                            </button>
                          )}
                          {letter.status !== 'Ditolak' && (
                            <button
                              onClick={() => handleUpdateStatus(letter.id, 'Ditolak')}
                              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                            >
                              <XCircle className="w-3 h-3" /> Tolak
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
