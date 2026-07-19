import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Coins, FileText, Plus, Trash2, Save, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, Loader2, ArrowRight
} from 'lucide-react';

export default function BendaharaDashboard({ showToast }) {
  const { currentUser } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('finance'); // 'finance', 'budget', 'letters'

  // FINANCE STATE
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('in');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Iuran');

  // BUDGET STATE
  const defaultBudgets = [
    { division: 'BPH (Badan Pengurus Harian)', allocated: 0, used: 0, color: 'bg-amber-500' },
    { division: 'Dana Usaha (Danus)', allocated: 0, used: 0, color: 'bg-emerald-500' },
    { division: 'Riset & Teknologi (Ristek)', allocated: 0, used: 0, color: 'bg-blue-500' },
    { division: 'Pengembangan Mahasiswa (Pengma)', allocated: 0, used: 0, color: 'bg-purple-500' },
    { division: 'Eksternal (Sponsorship & Humas)', allocated: 0, used: 0, color: 'bg-rose-500' }
  ];
  const [budgets, setBudgets] = useState(defaultBudgets);

  // LETTERS STATE
  const [letters, setLetters] = useState([]);
  const [accLetterId, setAccLetterId] = useState(null);
  const [inputLetterNumber, setInputLetterNumber] = useState('');
  const [inputResponseUrl, setInputResponseUrl] = useState('');

  // Load data
  useEffect(() => {
    // Finance Cash Flow
    const savedFlow = localStorage.getItem('hima_cashflow');
    if (savedFlow) {
      setRecords(JSON.parse(savedFlow));
    }

    // Budget distribution
    const savedBudgets = localStorage.getItem('hima_budget_allocations');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    // Letters requests list
    const savedLetters = localStorage.getItem('hima_letters');
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    }
  }, []);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Add Finance Entry
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!desc || !amount) {
      showToast('Mohon lengkapi seluruh form transaksi!', 'error');
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

    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem('hima_cashflow', JSON.stringify(updated));
    showToast('Transaksi baru berhasil dicatat!', 'success');

    setDesc('');
    setAmount('');
  };

  // Delete Finance Entry
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Hapus entri transaksi ini?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('hima_cashflow', JSON.stringify(updated));
      showToast('Entri transaksi berhasil dihapus.', 'info');
    }
  };

  // Update Budgets
  const handleBudgetChange = (index, field, value) => {
    const updated = [...budgets];
    updated[index][field] = parseFloat(value) || 0;
    setBudgets(updated);
  };

  const handleSaveBudgets = () => {
    localStorage.setItem('hima_budget_allocations', JSON.stringify(budgets));
    showToast('Alokasi anggaran divisi berhasil diperbarui!', 'success');
  };

  // Letters ACC
  const openAccForm = (letter) => {
    setAccLetterId(letter.id);
    setInputLetterNumber(`00${letters.length + 1}/HIMA-EINSTEN/VII/2026`);
    setInputResponseUrl(letter.fileUrl || '/Media/Template Persuratan-20260715T225003Z-1-001/Template Persuratan/Surat Peminjaman Alat kepada Ormawa_Hima_UKM.docx');
  };

  const handleConfirmAcc = (e) => {
    e.preventDefault();
    if (!inputLetterNumber) {
      showToast('Mohon isi Nomor Surat!', 'error');
      return;
    }

    const req = letters.find(l => l.id === accLetterId);

    const updated = letters.map(item => {
      if (item.id === accLetterId) {
        return { 
          ...item, 
          status: 'ACC', 
          letterNumber: inputLetterNumber,
          fileUrl: inputResponseUrl || '#' 
        };
      }
      return item;
    });

    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));

    // Send notification
    if (req) {
      const newNotification = {
        id: Date.now(),
        recipientEmail: req.userEmail || 'guest@einsten.com',
        message: `Pengajuan ${req.category} (${req.subject}) Anda telah DISETUJUI (ACC) oleh Bendahara dengan Nomor Surat: ${inputLetterNumber}!`,
        read: false,
        timestamp: Date.now()
      };
      const savedNotifs = localStorage.getItem('hima_notifications');
      const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
      notifsList.push(newNotification);
      localStorage.setItem('hima_notifications', JSON.stringify(notifsList));
    }

    showToast('Surat berhasil disetujui (ACC)!', 'success');
    setAccLetterId(null);
  };

  const handleRejectLetter = (id) => {
    const updated = letters.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Ditolak' };
      }
      return item;
    });
    setLetters(updated);
    localStorage.setItem('hima_letters', JSON.stringify(updated));
    showToast('Pengajuan surat ditolak.', 'info');
  };

  return (
    <div className="relative pt-24 pb-16 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-700">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <span className="text-xs font-mono font-semibold text-gold-dark uppercase tracking-widest block">
          [ BACKOFFICE // TREASURER DASHBOARD ]
        </span>
        <h1 className="text-3xl font-serif text-zinc-900 tracking-tight flex items-center gap-2">
          <Coins className="w-8 h-8 text-gold" /> DASHBOARD BENDAHARA
        </h1>
        <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed font-light">
          Selamat datang, <strong>{currentUser?.name}</strong>! Di sini Anda dapat mencatat pengeluaran/pemasukan kas, menyetel alokasi anggaran divisi Himpunan, serta melakukan verifikasi persuratan.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'finance' ? 'text-gold' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <Coins className="w-4 h-4" /> Kelola Jurnal Kas
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'budget' ? 'text-gold' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Kelola Anggaran Divisi
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'letters' ? 'text-gold' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <FileText className="w-4 h-4" /> Verifikasi Persuratan
        </button>
      </div>

      {/* TAB 1: Kelola Jurnal Kas */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-250">
          {/* Form Pencatatan */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Plus className="w-4.5 h-4.5 text-gold" /> Catat Transaksi Baru
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
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
                    <TrendingUp className="w-3.5 h-3.5" /> Pemasukan (In)
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
                    <TrendingDown className="w-3.5 h-3.5" /> Pengeluaran (Out)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
                >
                  {type === 'in' ? (
                    <>
                      <option value="Iuran">Iuran Pengurus</option>
                      <option value="Sponsor">Sponsorship</option>
                      <option value="Hibah">Hibah Kampus</option>
                      <option value="Danus">Kontribusi Danus</option>
                      <option value="Lainnya">Lainnya</option>
                    </>
                  ) : (
                    <>
                      <option value="BPH">Kas BPH</option>
                      <option value="Danus">Modal Danus</option>
                      <option value="Ristek">Riset Ristek</option>
                      <option value="Logistik">Alat Logistik</option>
                      <option value="Eksternal">Humas / Acara</option>
                      <option value="Lainnya">Lainnya</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian Arduino Nano"
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
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
              >
                Catat Transaksi
              </button>
            </form>
          </div>

          {/* Buku Kas Ledger */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-gold" /> Jurnal Buku Kas
              </h3>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">
                Jurnal transaksi keluar-masuk dana yang telah Anda catat.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-105 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Deskripsi</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Debit (In)</th>
                    <th className="py-2.5 px-3 text-right">Kredit (Out)</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Jurnal Buku Kas kosong. Silakan catat transaksi baru.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-550">{record.date}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{record.desc}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-655 border border-slate-200">
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
                            onClick={() => handleDeleteTransaction(record.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg hover:text-rose-700 transition-colors cursor-pointer"
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
      )}

      {/* TAB 2: Kelola Anggaran Divisi */}
      {activeTab === 'budget' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-6 animate-in fade-in duration-250">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4.5 h-4.5 text-gold" /> Konfigurasi Anggaran Divisi
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Setel nominal pagu anggaran teralokasi (Allocated) dan anggaran terpakai (Used) untuk setiap divisi.
            </p>
          </div>

          <div className="divide-y divide-slate-100 space-y-4">
            {budgets.map((item, index) => (
              <div key={index} className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0">
                <div className="space-y-0.5 flex-1 text-left">
                  <h4 className="text-xs font-bold text-slate-800">{item.division}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Index referensi: DIV_{index + 1}</span>
                </div>
                <div className="flex gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Anggaran Dialokasikan (Pagu)</label>
                    <input
                      type="number"
                      value={item.allocated}
                      onChange={(e) => handleBudgetChange(index, 'allocated', e.target.value)}
                      placeholder="Pagu"
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs w-36 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Anggaran Terpakai</label>
                    <input
                      type="number"
                      value={item.used}
                      onChange={(e) => handleBudgetChange(index, 'used', e.target.value)}
                      placeholder="Terpakai"
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs w-36 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveBudgets}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" /> Simpan Anggaran
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Verifikasi Persuratan */}
      {activeTab === 'letters' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-6 animate-in fade-in duration-250">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-gold" /> Validasi & Alokasi Nomor Surat
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Setujui permohonan nomor surat yang diajukan oleh ormawa / divisi Himpunan.
            </p>
          </div>

          {accLetterId && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Form Alokasi Nomor Surat</h4>
                <button 
                  onClick={() => setAccLetterId(null)}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Batal
                </button>
              </div>
              <form onSubmit={handleConfirmAcc} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Alokasikan Nomor Surat</label>
                  <input
                    type="text"
                    required
                    value={inputLetterNumber}
                    onChange={(e) => setInputLetterNumber(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">URL File Respon (Template Surat)</label>
                  <input
                    type="text"
                    value={inputResponseUrl}
                    onChange={(e) => setInputResponseUrl(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Setujui & Kirim Notif
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-105 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                  <th className="py-2.5 px-3">Pemohon</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Hal / Perihal</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Nomor Surat</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {letters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada riwayat pengajuan surat.
                    </td>
                  </tr>
                ) : (
                  letters.map((letter) => (
                    <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-855">{letter.requester}</td>
                      <td className="py-3.5 px-3">{letter.category}</td>
                      <td className="py-3.5 px-3 font-light text-slate-500">{letter.subject}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          letter.status === 'ACC' 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-600' 
                            : letter.status === 'Ditolak'
                            ? 'bg-rose-50 border-rose-250 text-rose-600'
                            : 'bg-amber-55 border-amber-250 text-amber-600'
                        }`}>
                          {letter.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{letter.letterNumber || '-'}</td>
                      <td className="py-3.5 px-3 text-center">
                        {letter.status === 'Pending' ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openAccForm(letter)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all"
                            >
                              ACC
                            </button>
                            <button
                              onClick={() => handleRejectLetter(letter.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
