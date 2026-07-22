import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Phone, User, ShieldAlert, Loader2, ArrowRight, IdCard, Check, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register({ showToast }) {
  const { register, sendOTP } = useAuth();
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpMode, setOtpMode] = useState('simulation'); // 'simulation' | 'real'

  const navigate = useNavigate();

  // Handles clicking "Daftar Sekarang" -> Triggers OTP sending
  const handlePreSubmit = async (e) => {
    e.preventDefault();
    if (!phone.match(/^08\d{8,11}$/)) {
      showToast('Format nomor telepon salah! Harus diawali dengan 08 dan memiliki panjang 10-13 digit.', 'error');
      return;
    }
    
    setLoading(true);
    // Generate a random 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const response = await sendOTP(phone, code);
      setOtpMode(response.mode);
      setShowOtpModal(true);
      if (response.success && response.mode === 'real') {
        showToast('Kode OTP verifikasi berhasil dikirim via WhatsApp!', 'success');
      } else {
        showToast('WhatsApp Gateway terputus/offline. Kode OTP dialihkan ke Mode Simulasi di layar.', 'warning');
      }
    } catch (err) {
      showToast('Gagal mengirimkan kode OTP: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handles final registration after OTP is successfully verified
  const handleVerifyAndRegister = async () => {
    if (!otpInput.trim() || otpInput.trim() !== generatedOtp) {
      showToast('Kode OTP yang Anda masukkan salah!', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name, nim, phone, password);
      showToast(`Registrasi Berhasil! Akun Anda (${name.trim()}@einsten.com) telah aktif sebagai Anggota Biasa. Silakan masuk.`, 'success');
      setShowOtpModal(false);
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registrasi gagal!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden text-slate-800">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-4">
            <img 
              src="/logo-hima-transparan.png" 
              alt="Logo HIMA EINSTEN" 
              className="h-24 sm:h-32 w-auto object-contain shrink-0"
              onError={(e) => {
                e.target.src = "https://placehold.co/120x45/ffffff/000000?text=EINSTEN";
              }}
            />
            <div className="w-px h-16 sm:h-20 bg-slate-300"></div>
            <img 
              src="/Media Einsten/Media Umum/logo kabinet hitam (horizontal) (1).png" 
              alt="Logo Kabinet Phótisma" 
              className="h-14 sm:h-16 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/ffffff/000000?text=PHÓTISMA";
              }}
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 uppercase tracking-wider">DAFTAR AKUN BARU</h2>
          <p className="text-xs text-slate-500 mt-1">Portal Keanggotaan Kabinet Phótisma</p>
        </div>

        <div className="glass-glow rounded-2xl p-8 relative overflow-hidden shadow-md bg-white border border-gold-border">
          <form onSubmit={handlePreSubmit} className="space-y-4" autoComplete="off">
            {/* Fake inputs to prevent browser autofill */}
            <input type="text" name="prevent_autofill_username" style={{ display: 'none' }} tabIndex={-1} />
            <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} />

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dian Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">NIM (Nomor Induk Mahasiswa)</label>
              <div className="relative">
                <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 240011"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Nomor Telepon WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-700 leading-normal">
                Setelah verifikasi nomor WhatsApp dengan OTP berhasil, akun Anda akan <strong>langsung aktif</strong> sebagai <strong>Anggota Biasa</strong> tanpa perlu persetujuan Admin/Kahim.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl shadow-md shadow-gold/20 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mengirim OTP...
                </>
              ) : (
                <>
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-gold-dark hover:underline font-semibold">
                Masuk ke Portal
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Verification OTP Modal overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gold-border rounded-2xl p-6 w-full max-w-sm text-center shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verifikasi Nomor Telepon</h3>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-2 text-left">
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Kode OTP verifikasi telah dikirimkan ke nomor WhatsApp <strong className="text-slate-880 font-bold">{phone}</strong>. Silakan masukkan kode tersebut di bawah ini:
              </p>
              
              {otpMode === 'simulation' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-0.5">Mode Simulasi Aktif</span>
                  <p className="text-[10px] text-amber-700 leading-normal">
                    WhatsApp Gateway offline/terputus atau token belum aktif. Masukkan kode verifikasi berikut: <strong className="text-slate-900 text-sm font-mono tracking-wider ml-1 bg-white px-2 py-0.5 rounded border border-amber-300">{generatedOtp}</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Kode Verifikasi (OTP)</label>
              <input
                type="text"
                placeholder="Masukkan 6-digit OTP"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center text-lg font-bold font-mono tracking-widest text-slate-800 placeholder-slate-350 focus:outline-none focus:border-gold transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
