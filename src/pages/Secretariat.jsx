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
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Pengurusan Dokumen Himpunan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">PORTAL SEKRETARIAT</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Unduh berkas template resmi organisasi dan ajukan permohonan nomor surat digital secara praktis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Download Center */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <Download className="w-4.5 h-4.5 text-gold" /> Download Center (Template Dokumen)
          </h3>

          <div className="space-y-4">
            {templates.map((tpl, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white border border-gold-border rounded-2xl flex items-center justify-between hover:bg-slate-50/50 shadow-sm transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Format: {tpl.format} • Ukuran: {tpl.size} • Diperbarui: {tpl.date}
                  </p>
                </div>
                <button
                  onClick={() => showToast(`Mengunduh file: ${tpl.name}...`, 'success')}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-gold hover:border-gold hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                >
                  Unduh <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Request Form */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <Send className="w-4.5 h-4.5 text-gold" /> Request Nomor Surat BPH
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl p-6 text-left space-y-4 relative overflow-hidden shadow-md">
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gold/5 rounded-full blur-xl"></div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Pengusul / Divisi</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Ristek / Zacky"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Surat</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 focus:outline-none focus:border-gold"
                >
                  <option value="Surat Permohonan">Surat Permohonan</option>
                  <option value="Surat Undangan">Surat Undangan</option>
                  <option value="Surat Tugas">Surat Tugas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Perihal Surat</label>
                <input 
                  type="text" 
                  required
                  placeholder="Perihal pengajuan dana / izin ruang lab..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gold text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md shadow-gold/25"
                >
                  Kirim Request <Send className="w-3.5 h-3.5" />
                </button>

                {hasBackofficeAccess && (
                  <button
                    type="button"
                    onClick={() => setShowBackoffice(!showBackoffice)}
                    className="px-4 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all"
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
        <div className="border-t border-slate-200 pt-12 space-y-6 animate-slide-in">
          <div className="text-left space-y-1">
            <h2 className="text-lg font-bold uppercase text-slate-800 tracking-wide flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-gold" /> DASHBOARD BACKOFFICE SEKRETARIS
            </h2>
            <p className="text-xs text-slate-500 font-light">
              Tinjau, ACC (setujui), atau tolak nomor pengajuan surat resmi BPH secara otonom.
            </p>
          </div>

          <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Pengusul / Divisi</th>
                    <th className="px-6 py-4">Kategori Surat</th>
                    <th className="px-6 py-4">Perihal</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {letters.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                        Belum ada antrean pengajuan surat resmi.
                      </td>
                    </tr>
                  ) : (
                    letters.map((letter) => (
                      <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{letter.requester}</td>
                        <td className="px-6 py-4">{letter.category}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{letter.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            letter.status === 'ACC' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-55/20' 
                              : letter.status === 'Ditolak'
                                ? 'bg-rose-50 text-rose-600 border-rose-55/20'
                                : 'bg-amber-50 text-amber-600 border-amber-55/20'
                          }`}>
                            {letter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2 items-center">
                          {letter.status !== 'ACC' && (
                            <button
                              onClick={() => handleUpdateStatus(letter.id, 'ACC')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                            >
                              <CheckCircle className="w-3 h-3 text-white" /> ACC
                            </button>
                          )}
                          {letter.status !== 'Ditolak' && (
                            <button
                              onClick={() => handleUpdateStatus(letter.id, 'Ditolak')}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                            >
                              <XCircle className="w-3 h-3 text-white" /> Tolak
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
