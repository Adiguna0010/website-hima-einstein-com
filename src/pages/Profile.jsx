import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Camera, Edit3, Save, X, CheckCircle, AlertTriangle,
  Coins, QrCode, Upload, Clock, BadgeCheck, ChevronRight, Shield,
  Phone, CreditCard, Calendar, XCircle, Loader2
} from 'lucide-react';

// ─── Kas Config ──────────────────────────────────────────────
const KAS_SEMESTERS = [
  { id: 'sem1-2026', label: 'Semester 1 — 2026', period: 'Januari – Juni 2026', fee: 70000, dueDate: '2026-06-30' },
  { id: 'sem2-2026', label: 'Semester 2 — 2026', period: 'Juli – Desember 2026', fee: 70000, dueDate: '2026-12-31' },
];
const TOTAL_KAS = KAS_SEMESTERS.reduce((s, k) => s + k.fee, 0); // 140.000

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

const formatDate = (ts) =>
  ts ? new Date(ts).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

export default function Profile({ showToast }) {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profil');

  // ─── Profile State ─────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(currentUser?.photo || '');
  const [newPhoto, setNewPhoto] = useState('');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const fileRef = useRef(null);

  // ─── Kas State ─────────────────────────────────────────────
  const [kasPayments, setKasPayments] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [proofImg, setProofImg] = useState('');
  const [nominalInput, setNominalInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const proofRef = useRef(null);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    setPreviewPhoto(currentUser.photo || '');
    setBio(currentUser.bio || '');

    const saved = localStorage.getItem('hima_kas_payments');
    if (saved) setKasPayments(JSON.parse(saved));
  }, [currentUser]);

  if (!currentUser) return null;

  // ─── Helpers ────────────────────────────────────────────────
  const myPayments = kasPayments.filter(p => p.nim === currentUser.nim);

  const getSemStatus = (semId) => {
    const found = myPayments.find(p => p.semId === semId);
    if (!found) return { status: 'Belum Bayar', payment: null };
    return { status: found.status, payment: found };
    // status: 'Menunggu Verifikasi' | 'Lunas' | 'Ditolak'
  };

  const totalPaid = myPayments
    .filter(p => p.status === 'Lunas')
    .reduce((s, p) => s + p.amount, 0);

  const totalTagihan = KAS_SEMESTERS.reduce((s, sem) => {
    const st = getSemStatus(sem.id).status;
    return st === 'Lunas' ? s : s + sem.fee;
  }, 0);

  const hasUnpaid = totalTagihan > 0;

  // ─── Profile Handlers ────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Foto terlalu besar! Maksimal 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPhoto(reader.result);
      setNewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updates = { bio };
    if (newPhoto) updates.photo = newPhoto;
    updateUserProfile(currentUser.email, updates);
    setEditMode(false);
    setNewPhoto('');
    showToast('Profil berhasil diperbarui!', 'success');
  };

  const handleCancelEdit = () => {
    setPreviewPhoto(currentUser.photo || '');
    setBio(currentUser.bio || '');
    setNewPhoto('');
    setEditMode(false);
  };

  // ─── Kas Handlers ───────────────────────────────────────────
  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran bukti terlalu besar! Maksimal 3MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProofImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!selectedSem) { showToast('Pilih semester yang ingin dibayar!', 'error'); return; }
    if (!proofImg) { showToast('Upload foto bukti pembayaran QRIS!', 'error'); return; }
    const nominal = parseInt(nominalInput.replace(/\D/g, ''), 10);
    if (!nominal || nominal < selectedSem.fee) {
      showToast(`Jumlah yang dibayarkan harus minimal ${formatRupiah(selectedSem.fee)}!`, 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newPayment = {
        id: Date.now(),
        nim: currentUser.nim,
        name: currentUser.name,
        email: currentUser.email,
        semId: selectedSem.id,
        semLabel: selectedSem.label,
        amount: nominal,
        proofImg,
        submittedAt: Date.now(),
        status: 'Menunggu Verifikasi',
      };

      const updated = [...kasPayments, newPayment];
      setKasPayments(updated);
      localStorage.setItem('hima_kas_payments', JSON.stringify(updated));

      // Notif ke Bendahara
      const notifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
      const bendaharaUsers = JSON.parse(localStorage.getItem('hima_users') || '[]')
        .filter(u => u.role === 'Bendahara Umum');
      bendaharaUsers.forEach(b => {
        notifs.push({
          id: Date.now() + Math.random(),
          recipientEmail: b.email,
          message: `💰 Bukti Kas Baru! ${currentUser.name} (NIM: ${currentUser.nim}) mengajukan pembayaran kas ${selectedSem.label} sebesar ${formatRupiah(nominal)}. Silakan verifikasi di Dashboard Bendahara.`,
          read: false,
          timestamp: Date.now(),
        });
      });
      localStorage.setItem('hima_notifications', JSON.stringify(notifs));

      setSubmitting(false);
      setProofImg('');
      setNominalInput('');
      setSelectedSem(null);
      if (proofRef.current) proofRef.current.value = null;
      showToast(`Bukti pembayaran kas ${selectedSem.label} berhasil dikirim! Menunggu verifikasi Bendahara.`, 'success');
    }, 1000);
  };

  const statusBadge = (status) => {
    if (status === 'Lunas') return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full"><CheckCircle className="w-3 h-3" /> Lunas</span>;
    if (status === 'Menunggu Verifikasi') return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full"><Clock className="w-3 h-3" /> Menunggu Verifikasi</span>;
    if (status === 'Ditolak') return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-full"><XCircle className="w-3 h-3" /> Ditolak</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 rounded-full"><AlertTriangle className="w-3 h-3" /> Belum Bayar</span>;
  };

  const roleColor = {
    'Master Admin': 'text-rose-600 bg-rose-50 border-rose-200',
    'Bendahara Umum': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Operator Ristek': 'text-blue-600 bg-blue-50 border-blue-200',
    'Operator Logistik': 'text-orange-600 bg-orange-50 border-orange-200',
    'Operator Danus': 'text-purple-600 bg-purple-50 border-purple-200',
  }[currentUser.role] || 'text-gold-dark bg-gold/10 border-gold/30';

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── HEADER CARD ──────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl text-white p-8">
        {/* decorative orb */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold/5 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 border-gold/40 overflow-hidden bg-slate-700 flex items-center justify-center shadow-xl">
              {previewPhoto ? (
                <img src={previewPhoto} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            {editMode && (
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gold border-2 border-slate-800 flex items-center justify-center hover:brightness-110 transition-all shadow-lg"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-extrabold tracking-tight">{currentUser.name}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border rounded-full ${roleColor}`}>
                {currentUser.role === 'Master Admin' && <Shield className="w-3 h-3" />}
                {currentUser.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">NIM: {currentUser.nim} · {currentUser.email}</p>
            {currentUser.phone && <p className="text-slate-400 text-xs mt-0.5"><Phone className="w-3 h-3 inline mr-1" />{currentUser.phone}</p>}
            <p className="text-slate-300 text-xs mt-2 italic max-w-sm">{currentUser.bio || 'Belum ada bio.'}</p>
          </div>

          {/* Edit Button */}
          <div className="shrink-0">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold hover:bg-white/20 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} className="flex items-center gap-2 px-4 py-2.5 bg-gold rounded-xl text-xs font-bold text-white hover:brightness-110 transition-all">
                  <Save className="w-3.5 h-3.5" /> Simpan
                </button>
                <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold hover:bg-white/20 transition-all">
                  <X className="w-3.5 h-3.5" /> Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio Edit */}
        {editMode && (
          <div className="relative mt-5 pt-5 border-t border-white/10">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Bio Singkat</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
              maxLength={120}
              placeholder="Tulis bio singkat tentang diri Anda..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold resize-none"
            />
          </div>
        )}
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 gap-1">
        {[
          { id: 'profil', label: 'Profil Saya', icon: User },
          { id: 'kas', label: 'Kas & Pembayaran', icon: Coins },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-gold text-gold-dark'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: PROFIL ──────────────────────────────────────── */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {[
            { label: 'Nama Lengkap', value: currentUser.name, icon: User },
            { label: 'NIM', value: currentUser.nim, icon: CreditCard },
            { label: 'Role / Jabatan', value: currentUser.role, icon: BadgeCheck },
            { label: 'Nomor WhatsApp', value: currentUser.phone || 'Belum terdaftar', icon: Phone },
            { label: 'Email Akun', value: currentUser.email, icon: ChevronRight },
            { label: 'Status Akun', value: currentUser.status, icon: Shield },
          ].map(item => (
            <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: KAS ─────────────────────────────────────────── */}
      {activeTab === 'kas' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Summary Card */}
          <div className={`rounded-2xl p-6 border ${hasUnpaid ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasUnpaid ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                  {hasUnpaid ? <AlertTriangle className="w-6 h-6 text-white" /> : <CheckCircle className="w-6 h-6 text-white" />}
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${hasUnpaid ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {hasUnpaid ? '⚠️ Ada Tunggakan Kas' : '✅ Kas Lunas'}
                  </p>
                  <p className={`text-lg font-extrabold mt-0.5 ${hasUnpaid ? 'text-amber-900' : 'text-emerald-900'}`}>
                    {hasUnpaid ? `Tunggakan: ${formatRupiah(totalTagihan)}` : 'Semua kas sudah terbayar'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Total dibayar: {formatRupiah(totalPaid)} dari {formatRupiah(TOTAL_KAS)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Semester Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KAS_SEMESTERS.map(sem => {
              const { status, payment } = getSemStatus(sem.id);
              return (
                <div key={sem.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{sem.label}</p>
                      <p className="text-[10px] text-slate-400">{sem.period}</p>
                    </div>
                    {statusBadge(status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Nominal Kas</p>
                      <p className="text-base font-extrabold text-slate-900">{formatRupiah(sem.fee)}</p>
                    </div>
                    {payment && (
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Dibayar</p>
                        <p className="text-xs font-bold text-emerald-600">{formatRupiah(payment.amount)}</p>
                        <p className="text-[9px] text-slate-400">{formatDate(payment.submittedAt)}</p>
                      </div>
                    )}
                  </div>
                  {status === 'Ditolak' && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-600">
                      Pembayaran ditolak. Silakan coba kembali dengan bukti yang benar.
                    </div>
                  )}
                  {(status === 'Belum Bayar' || status === 'Ditolak') && (
                    <button
                      onClick={() => setSelectedSem(sem)}
                      className="w-full py-2 bg-gradient-to-r from-gold to-gold-light text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all active:scale-95"
                    >
                      Bayar Sekarang →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Payment Form */}
          {selectedSem && (
            <div className="bg-white border-2 border-gold/30 rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-gold to-gold-light px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Pembayaran Kas</p>
                  <h3 className="text-white text-base font-extrabold">{selectedSem.label}</h3>
                </div>
                <button onClick={() => { setSelectedSem(null); setProofImg(''); setNominalInput(''); }} className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* QRIS */}
                  <div className="space-y-3 text-center">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5"><QrCode className="w-4 h-4 text-gold" /> QRIS Pembayaran</p>
                    <div className="border-2 border-dashed border-gold/40 rounded-2xl p-3 bg-slate-50">
                      <img
                        src="/Media/QRIS/AT-Service.jpeg"
                        alt="QRIS HIMA EINSTEN"
                        className="w-full max-w-[200px] mx-auto rounded-xl object-contain"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Scan QRIS di atas menggunakan m-Banking / e-Wallet Anda</p>
                    <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Jumlah yang dibayarkan</p>
                      <p className="text-xl font-extrabold text-gold-dark">{formatRupiah(selectedSem.fee)}</p>
                    </div>
                  </div>

                  {/* Form Upload */}
                  <form onSubmit={handleSubmitPayment} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nominal Dibayarkan (Rp)</label>
                      <input
                        type="text"
                        required
                        placeholder={`Min. ${formatRupiah(selectedSem.fee)}`}
                        value={nominalInput}
                        onChange={e => setNominalInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-mono focus:outline-none focus:border-gold"
                      />
                      <p className="text-[10px] text-slate-400">Masukkan nominal sesuai yang Anda transfer via QRIS.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> Foto Bukti Pembayaran
                      </label>
                      <input
                        ref={proofRef}
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleProofUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                      />
                      {proofImg && (
                        <div className="mt-2 relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                          <img src={proofImg} alt="Bukti Bayar" className="w-full max-h-48 object-contain" />
                          <button type="button" onClick={() => { setProofImg(''); if (proofRef.current) proofRef.current.value = null; }} className="absolute top-2 right-2 w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                            <X className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 space-y-1">
                      <p>✅ Bukti akan diverifikasi oleh Bendahara HIMA</p>
                      <p>✅ Jika sudah diverifikasi, kas otomatis tercatat dalam transparansi keuangan</p>
                      <p>⏱️ Proses verifikasi maks. 1×24 jam</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 transition-all active:scale-95 shadow-md shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : <><CheckCircle className="w-4 h-4" /> Kirim Bukti Pembayaran</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          {myPayments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Riwayat Pembayaran Kas</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {myPayments.map(p => (
                  <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">{p.semLabel}</p>
                      <p className="text-[10px] text-slate-400">Dikirim: {formatDate(p.submittedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">{formatRupiah(p.amount)}</p>
                      {statusBadge(p.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
