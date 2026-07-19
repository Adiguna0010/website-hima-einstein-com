import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Coins, FileText, Plus, Trash2, Save, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, Loader2, ArrowRight,
  Users, AlertTriangle, BadgeCheck, Clock, Eye
} from 'lucide-react';

// ─── Kas Config ──────────────────────────────────────────────
const KAS_SEMESTERS = [
  { id: 'sem1-2026', label: 'Semester 1 — 2026', period: 'Januari – Juni 2026', fee: 70000 },
  { id: 'sem2-2026', label: 'Semester 2 — 2026', period: 'Juli – Desember 2026', fee: 70000 },
];
const formatRupiahKas = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
const formatDateKas = (ts) =>
  ts ? new Date(ts).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function BendaharaDashboard({ showToast }) {
  const { currentUser } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('finance'); // 'finance', 'budget', 'letters', 'kas'

  // KAS ANGGOTA STATE
  const [kasPayments, setKasPayments] = useState([]);
  const [kasFilter, setKasFilter] = useState('all'); // 'all'|'pending'|'lunas'|'belum'
  const [proofModal, setProofModal] = useState(null); // payment obj

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

    // Kas Anggota
    const savedKas = localStorage.getItem('hima_kas_payments');
    if (savedKas) setKasPayments(JSON.parse(savedKas));
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
      const recordToDelete = records.find(r => r.id === id);
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('hima_cashflow', JSON.stringify(updated));

      // Jika entri kas iuran anggota, reset status hima_kas_payments kembali ke 'Belum Bayar'
      if (recordToDelete && recordToDelete.category === 'Iuran') {
        const kasData = JSON.parse(localStorage.getItem('hima_kas_payments') || '[]');
        // Cari payment yang cocok berdasarkan deskripsi (mengandung NIM)
        const updatedKas = kasData.map(p => {
          if (
            p.status === 'Lunas' &&
            recordToDelete.desc &&
            recordToDelete.desc.includes(p.nim)
          ) {
            return { ...p, status: 'Belum Bayar', verifiedBy: null, verifiedAt: null };
          }
          return p;
        });
        setKasPayments(updatedKas);
        localStorage.setItem('hima_kas_payments', JSON.stringify(updatedKas));
      }

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
        <button
          onClick={() => setActiveTab('kas')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-semibold transition-all relative ${
            activeTab === 'kas' ? 'text-gold' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <Users className="w-4 h-4" /> Kas Anggota
          {kasPayments.filter(p => p.status === 'Menunggu Verifikasi').length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-full">
              {kasPayments.filter(p => p.status === 'Menunggu Verifikasi').length}
            </span>
          )}
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

      {/* TAB 4: Kas Anggota */}
      {activeTab === 'kas' && (() => {
        // Compute per-user kas status
        const allUsers = JSON.parse(localStorage.getItem('hima_users') || '[]')
          .filter(u => u.status === 'Active');

        // Build member kas summary
        const memberSummary = allUsers.map(u => {
          const payments = kasPayments.filter(p => p.nim === u.nim);
          const semStatus = KAS_SEMESTERS.map(sem => {
            // Find latest payment for this semester (most recent)
            const semPayments = payments.filter(p => p.semId === sem.id);
            if (semPayments.length === 0) return { ...sem, status: 'Belum Bayar', payment: null, totalPaid: 0, remaining: sem.fee };
            // Get total paid across all payments for this sem (Lunas + Kurang)
            const paidSoFar = semPayments.filter(p => p.status === 'Lunas' || p.status === 'Kurang').reduce((a, p) => a + (p.amount || 0), 0);
            const latest = semPayments[semPayments.length - 1];
            const remaining = Math.max(0, sem.fee - paidSoFar);
            return {
              ...sem,
              status: latest.status,
              payment: latest,
              totalPaid: paidSoFar,
              remaining,
            };
          });
          const totalOwed = semStatus.reduce((a, s) => a + (s.remaining ?? s.fee), 0);
          const totalPaid = semStatus.reduce((a, s) => a + (s.totalPaid || 0), 0);
          return { ...u, semStatus, totalOwed, totalPaid };
        });

        const filtered = memberSummary.filter(m => {
          if (kasFilter === 'pending') return kasPayments.some(p => p.nim === m.nim && p.status === 'Menunggu Verifikasi');
          if (kasFilter === 'lunas') return m.totalOwed === 0;
          if (kasFilter === 'belum') return m.totalOwed > 0;
          return true;
        });

        const handleAccKas = (payment) => {
          const sem = KAS_SEMESTERS.find(s => s.id === payment.semId);
          const semFee = sem ? sem.fee : 70000;

          // Calculate total already paid for this semester
          const alreadyPaid = kasPayments
            .filter(p => p.nim === payment.nim && p.semId === payment.semId && (p.status === 'Lunas' || p.status === 'Kurang') && p.id !== payment.id)
            .reduce((a, p) => a + (p.amount || 0), 0);
          const totalNow = alreadyPaid + payment.amount;
          const remaining = Math.max(0, semFee - totalNow);
          const newStatus = remaining <= 0 ? 'Lunas' : 'Kurang';

          const updated = kasPayments.map(p => p.id === payment.id
            ? { ...p, status: newStatus, remaining, verifiedBy: currentUser.name, verifiedAt: Date.now() }
            : p
          );
          setKasPayments(updated);
          localStorage.setItem('hima_kas_payments', JSON.stringify(updated));

          // Auto-record in cashflow
          const cashflow = JSON.parse(localStorage.getItem('hima_cashflow') || '[]');
          cashflow.push({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            desc: `Iuran Kas ${payment.semLabel} — ${payment.name} (NIM: ${payment.nim})${remaining > 0 ? ` [Sebagian, sisa: ${formatRupiahKas(remaining)}]` : ''}`,
            type: 'in',
            amount: payment.amount,
            category: 'Iuran',
          });
          localStorage.setItem('hima_cashflow', JSON.stringify(cashflow));
          setRecords(cashflow);

          // Notify anggota
          const notifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
          const msg = remaining > 0
            ? `⚠️ Pembayaran kas ${payment.semLabel} sebesar ${formatRupiahKas(payment.amount)} diverifikasi. Sisa tunggakan: ${formatRupiahKas(remaining)}. Silakan lunasi segera!`
            : `✅ Pembayaran kas ${payment.semLabel} sebesar ${formatRupiahKas(payment.amount)} LUNAS dan tercatat dalam transparansi keuangan HIMA!`;
          notifs.push({ id: Date.now() + 1, recipientEmail: payment.email, message: msg, read: false, timestamp: Date.now() });
          localStorage.setItem('hima_notifications', JSON.stringify(notifs));
          setProofModal(null);
          showToast(`Kas ${payment.name} (${payment.semLabel}) ${newStatus === 'Lunas' ? 'LUNAS' : `dicatat, sisa ${formatRupiahKas(remaining)}`}!`, 'success');
        };

        const handleRejectKas = (payment) => {
          const updated = kasPayments.map(p => p.id === payment.id ? { ...p, status: 'Ditolak' } : p);
          setKasPayments(updated);
          localStorage.setItem('hima_kas_payments', JSON.stringify(updated));
          const notifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
          notifs.push({ id: Date.now() + 1, recipientEmail: payment.email, message: `❌ Pembayaran kas ${payment.semLabel} Anda DITOLAK oleh Bendahara. Silakan coba kembali dengan bukti yang valid.`, read: false, timestamp: Date.now() });
          localStorage.setItem('hima_notifications', JSON.stringify(notifs));
          setProofModal(null);
          showToast('Pembayaran ditolak.', 'info');
        };

        // Batalkan status Lunas — reset ke Belum Bayar
        const handleRevokeKas = (nim, semId) => {
          if (!window.confirm('Batalkan verifikasi pembayaran ini? Status akan kembali ke Belum Bayar.')) return;
          const updated = kasPayments.map(p =>
            p.nim === nim && p.semId === semId && (p.status === 'Lunas' || p.status === 'Kurang')
              ? { ...p, status: 'Belum Bayar', verifiedBy: null, verifiedAt: null, remaining: null }
              : p
          );
          setKasPayments(updated);
          localStorage.setItem('hima_kas_payments', JSON.stringify(updated));
          showToast('Verifikasi kas berhasil dibatalkan. Status kembali ke Belum Bayar.', 'info');
        };

        const pendingCount = kasPayments.filter(p => p.status === 'Menunggu Verifikasi').length;
        const totalCollected = kasPayments.filter(p => p.status === 'Lunas').reduce((a, p) => a + p.amount, 0);

        return (
          <div className="space-y-6 animate-in fade-in duration-250">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Menunggu Verifikasi</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
                <p className="text-[10px] text-slate-400">pembayaran perlu di-ACC</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Terverifikasi</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatRupiahKas(totalCollected)}</p>
                <p className="text-[10px] text-slate-400">sudah tercatat di kas HIMA</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Anggota</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{allUsers.length}</p>
                <p className="text-[10px] text-slate-400">akun aktif terdaftar</p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {[['all','Semua'],['pending','Menunggu Verifikasi'],['belum','Menunggak'],['lunas','Lunas']].map(([val,label]) => (
                <button
                  key={val}
                  onClick={() => setKasFilter(val)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    kasFilter === val
                      ? 'bg-gold text-white border-gold shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-gold/50'
                  }`}
                >
                  {label}
                  {val === 'pending' && pendingCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-bold">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Member Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Anggota</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase">Semester 1</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase">Semester 2</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase">Tunggakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-xs">Tidak ada data.</td></tr>
                    ) : filtered.map(member => (
                      <tr key={member.email} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                              {member.photo
                                ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                : <span className="text-xs font-bold text-gold">{member.name[0]}</span>}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-slate-800">{member.name}</p>
                              <p className="text-[10px] text-slate-400">{member.nim} · {member.role}</p>
                            </div>
                          </div>
                        </td>
                        {member.semStatus.map(sem => {
                          const badge = {
                            'Lunas': (
                              <div className="flex flex-col items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> Lunas</span>
                                <button onClick={() => handleRevokeKas(member.nim, sem.id)} className="text-[9px] text-slate-400 hover:text-rose-500 underline transition-colors">Batalkan</button>
                              </div>
                            ),
                            'Kurang': (
                              <div className="flex flex-col items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-[10px] font-bold"><AlertTriangle className="w-3 h-3" /> Kurang</span>
                                <span className="text-[9px] text-rose-500 font-bold">Sisa: {formatRupiahKas(sem.remaining || 0)}</span>
                                {sem.payment && <button onClick={() => setProofModal(sem.payment)} className="text-[9px] text-amber-600 hover:text-amber-700 underline">Cek Bukti</button>}
                              </div>
                            ),
                            'Menunggu Verifikasi': <button onClick={() => setProofModal(sem.payment)} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-bold hover:bg-amber-100 transition-all"><Clock className="w-3 h-3" /> Cek Bukti</button>,
                            'Ditolak': <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-[10px] font-bold"><XCircle className="w-3 h-3" /> Ditolak</span>,
                            'Belum Bayar': <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full text-[10px] font-bold"><AlertTriangle className="w-3 h-3" /> Belum</span>,
                          }[sem.status] || null;
                          return <td key={sem.id} className="px-4 py-3 text-center">{badge}</td>;
                        })}
                        <td className="px-4 py-3 text-right">
                          {member.totalOwed > 0
                            ? <span className="font-extrabold text-rose-600">{formatRupiahKas(member.totalOwed)}</span>
                            : <span className="font-bold text-emerald-500">Lunas</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Proof Modal */}
            {proofModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProofModal(null)} />
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10">
                  <div className="bg-gradient-to-r from-gold to-gold-light px-6 py-4">
                    <h3 className="text-white font-extrabold text-sm">Verifikasi Bukti Pembayaran Kas</h3>
                    <p className="text-white/80 text-xs mt-0.5">{proofModal.name} — {proofModal.semLabel}</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-xl p-3 text-left">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">NIM</p>
                        <p className="font-bold text-slate-800 mt-0.5">{proofModal.nim}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-left">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nominal</p>
                        <p className="font-extrabold text-gold-dark mt-0.5">{formatRupiahKas(proofModal.amount)}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Foto Bukti Bayar</p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <img src={proofModal.proofImg} alt="Bukti" className="w-full max-h-64 object-contain" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Dikirim: {formatDateKas(proofModal.submittedAt)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRejectKas(proofModal)}
                        className="flex-1 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl text-xs hover:bg-rose-100 transition-all"
                      >
                        ✗ Tolak
                      </button>
                      <button
                        onClick={() => handleAccKas(proofModal)}
                        className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition-all shadow-md"
                      >
                        ✓ ACC &amp; Catat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
