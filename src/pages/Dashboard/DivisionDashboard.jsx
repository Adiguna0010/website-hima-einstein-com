import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit, Save, ArrowRight, Info, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export default function DivisionDashboard({ showToast }) {
  const { currentUser } = useAuth();

  // Helper to map operator role to division key
  const getDivisionInfo = (role) => {
    switch (role) {
      case 'Operator BPH':
        return { key: 'bph', name: 'Badan Pengurus Harian' };
      case 'Operator Internal':
        return { key: 'internal', name: 'Internal' };
      case 'Operator External':
        return { key: 'external', name: 'External' };
      case 'Operator Pengma':
        return { key: 'pengma', name: 'Pengembangan Mahasiswa' };
      case 'Operator Kominfo':
        return { key: 'kominfo', name: 'Komunikasi & Informasi' };
      case 'Operator Ristek':
        return { key: 'ristek', name: 'Riset & Teknologi' };
      case 'Operator Danus':
        return { key: 'danus', name: 'Dana Usaha' };
      case 'Operator Logistik':
        return { key: 'logistik', name: 'Aset & Logistik' };
      default:
        return { key: 'unknown', name: 'Unknown Division' };
    }
  };

  const divInfo = getDivisionInfo(currentUser?.role);

  // States
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('Terencana'); // 'Terencana', 'Sedang Berjalan', 'Terlaksana'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Load programs
  useEffect(() => {
    if (divInfo.key !== 'unknown') {
      const saved = localStorage.getItem(`hima_division_programs_${divInfo.key}`);
      if (saved) {
        setPrograms(JSON.parse(saved));
      } else {
        // Starter placeholder program so it doesn't start completely blank and looks nice
        const starter = [
          {
            id: 1,
            name: `Program Kerja Unggulan ${divInfo.name}`,
            desc: `Pemaparan program kerja awal divisi ${divInfo.name} untuk menyelaraskan target Kabinet Photisma HIMA EINSTEN.`,
            status: 'Terencana',
            date: '2026-07-20',
            time: '15.30 - 17.00 WIB',
            location: 'Sekretariat HIMA Einsten'
          }
        ];
        localStorage.setItem(`hima_division_programs_${divInfo.key}`, JSON.stringify(starter));
        setPrograms(starter);
      }
    }
  }, [divInfo.key, divInfo.name]);

  const handleSaveProgram = (e) => {
    e.preventDefault();
    if (!name || !desc) {
      showToast('Mohon lengkapi Nama dan Deskripsi Program Kerja!', 'error');
      return;
    }

    let updated = [];
    if (editingId) {
      // Edit existing
      updated = programs.map(p => {
        if (p.id === editingId) {
          return { ...p, name, desc, status, date, time, location };
        }
        return p;
      });

      // Update in HIMA Calendar too if date is filled
      if (date) {
        const savedEvents = localStorage.getItem('hima_calendar_events');
        const events = savedEvents ? JSON.parse(savedEvents) : {};
        events[date] = {
          title: `${name} 🚀`,
          type: 'hima',
          desc: `${desc} (Waktu: ${time || 'TBA'})`,
          location: location || 'TBA'
        };
        localStorage.setItem('hima_calendar_events', JSON.stringify(events));
      }

      showToast('Program kerja berhasil diperbarui!', 'success');
      setEditingId(null);
    } else {
      // Add new
      const newProg = {
        id: Date.now(),
        name,
        desc,
        status,
        date,
        time,
        location
      };
      updated = [...programs, newProg];

      // Auto add to HIMA calendar if date is filled
      if (date) {
        const savedEvents = localStorage.getItem('hima_calendar_events');
        const events = savedEvents ? JSON.parse(savedEvents) : {};
        events[date] = {
          title: `${name} 🚀`,
          type: 'hima',
          desc: `${desc} (Waktu: ${time || 'TBA'})`,
          location: location || 'TBA'
        };
        localStorage.setItem('hima_calendar_events', JSON.stringify(events));
        showToast('Program kerja ditambahkan & tersinkronisasi ke Kalender Himpunan!', 'success');
      } else {
        showToast('Program kerja baru berhasil ditambahkan!', 'success');
      }
    }

    setPrograms(updated);
    localStorage.setItem(`hima_division_programs_${divInfo.key}`, JSON.stringify(updated));

    // Reset Form
    setName('');
    setDesc('');
    setStatus('Terencana');
    setDate('');
    setTime('');
    setLocation('');
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setDesc(p.desc);
    setStatus(p.status);
    setDate(p.date || '');
    setTime(p.time || '');
    setLocation(p.location || '');
  };

  const handleDeleteProgram = (id) => {
    if (window.confirm('Hapus program kerja ini?')) {
      const updated = programs.filter(p => p.id !== id);
      setPrograms(updated);
      localStorage.setItem(`hima_division_programs_${divInfo.key}`, JSON.stringify(updated));
      showToast('Program kerja berhasil dihapus.', 'info');
      
      if (editingId === id) {
        setEditingId(null);
        setName('');
        setDesc('');
        setStatus('Terencana');
        setDate('');
        setTime('');
        setLocation('');
      }
    }
  };

  if (divInfo.key === 'unknown') {
    return (
      <div className="pt-24 pb-16 max-w-md mx-auto text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Akses Ditolak</h3>
        <p className="text-xs text-slate-500">Akun Anda tidak memiliki peran sebagai Operator Divisi.</p>
      </div>
    );
  }

  return (
    <div className="relative pt-24 pb-16 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <span className="text-xs font-mono font-semibold text-gold-dark uppercase tracking-widest block">
          [ DIVISION CONTROL PANEL // {divInfo.name.toUpperCase()} ]
        </span>
        <h1 className="text-3xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-gold" /> DASHBOARD {divInfo.name.toUpperCase()}
        </h1>
        <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed font-light">
          Selamat datang, Kepala Divisi/Operator <strong>{currentUser?.name}</strong>! Silakan paparkan program-program kerja yang dirancang divisi Anda agar tampil secara resmi di halaman publik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Form Input */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Sparkles className="w-4.5 h-4.5 text-gold" /> 
            {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
          </h3>
          <form onSubmit={handleSaveProgram} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Program Kerja</label>
              <input
                type="text"
                required
                placeholder="Contoh: LDKM Mahasiswa Baru"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi Program</label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan detail tujuan, program kerja, dan sasaran dari program ini."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tanggal Pelaksanaan (Sync Kalender)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Waktu / Jam Pelaksanaan</label>
              <input
                type="text"
                placeholder="Contoh: 08.00 - 12.00 WIB"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tempat / Lokasi</label>
              <input
                type="text"
                placeholder="Contoh: Auditorium Poltek Nuklir"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Status Program</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
              >
                <option value="Terencana">Terencana</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Terlaksana">Terlaksana</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setDesc('');
                    setStatus('Terencana');
                    setDate('');
                    setTime('');
                    setLocation('');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
              >
                {editingId ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>

        {/* List Program Kerja */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-gold" /> Daftar Program Kerja Terancang
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Program kerja berikut akan langsung ditayangkan pada halaman publik divisi {divInfo.name} dan disinkronkan ke kalender ormawa.
            </p>
          </div>

          <div className="space-y-4">
            {programs.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-450">
                Belum ada program kerja yang didefinisikan.
              </div>
            ) : (
              programs.map((p) => (
                <div 
                  key={p.id} 
                  className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold/30 hover:bg-white transition-all group"
                >
                  <div className="space-y-1.5 text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                        p.status === 'Terlaksana'
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-600'
                          : p.status === 'Sedang Berjalan'
                          ? 'bg-amber-50 border-amber-250 text-amber-600'
                          : 'bg-slate-100 border-slate-205 text-slate-550'
                      }`}>
                        {p.status}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                      {p.desc}
                    </p>

                    {p.date && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-400 font-mono pt-1">
                        <span>📅 {p.date}</span>
                        {p.time && <span>🕒 {p.time}</span>}
                        {p.location && <span>📍 {p.location}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-1.5 text-slate-555 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors cursor-pointer"
                      title="Edit Program"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(p.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg hover:text-rose-700 transition-colors cursor-pointer"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
