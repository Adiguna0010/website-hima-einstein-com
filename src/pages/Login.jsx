import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight, Phone, Check, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ showToast }) {
  const { login, users, sendOTP, updateUserPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password / Account States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Phone Input, 2 = Verify OTP, 3 = View & Reset
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState('');
  const [forgotOtpMode, setForgotOtpMode] = useState('simulation');
  const [forgotUser, setForgotUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      
      // Redirect based on role
      if (user.role === 'Master Admin') {
        navigate('/dashboard/master');
      } else if (user.role === 'Operator Danus') {
        navigate('/dashboard/danus');
      } else if (user.role === 'Operator Logistik') {
        navigate('/dashboard/logistik');
      } else if (user.role === 'Sekretaris Umum') {
        navigate('/dashboard/sekretaris');
      } else if (user.role === 'Bendahara Umum') {
        navigate('/dashboard/bendahara');
      } else if (user.role === 'Operator Ristek') {
        navigate('/dashboard/ristek');
      } else if ([
        'Operator BPH',
        'Operator Internal',
        'Operator External',
        'Operator Pengma',
        'Operator Kominfo'
      ].includes(user.role)) {
        navigate('/dashboard/division');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'Login gagal!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to phone number
  const handleForgotPhoneSubmit = async (e) => {
    e.preventDefault();
    if (!forgotPhone.match(/^08\d{8,11}$/)) {
      showToast('Format nomor telepon salah! Harus diawali dengan 08 dan memiliki panjang 10-13 digit.', 'error');
      return;
    }

    // Find user with this phone
    const matchedUser = users.find(u => u.phone === forgotPhone);
    if (!matchedUser) {
      showToast('Nomor telepon tidak terdaftar pada sistem!', 'error');
      return;
    }

    setLoading(true);
    setForgotUser(matchedUser);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotGeneratedOtp(code);

    try {
      const response = await sendOTP(forgotPhone, code);
      setForgotOtpMode(response.mode);
      setForgotStep(2);
      if (response.success && response.mode === 'real') {
        showToast('Kode OTP berhasil dikirim via WhatsApp!', 'success');
      } else {
        showToast('WhatsApp Gateway terputus/offline. Kode OTP dialihkan ke Mode Simulasi di layar.', 'warning');
      }
    } catch (err) {
      showToast('Gagal mengirim OTP: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyForgotOtp = () => {
    if (!forgotOtpInput.trim() || forgotOtpInput.trim() !== forgotGeneratedOtp) {
      showToast('Kode OTP yang Anda masukkan salah!', 'error');
      return;
    }
    setForgotStep(3);
    showToast('OTP berhasil diverifikasi! Silakan perbarui kata sandi Anda.', 'success');
  };

  // Step 3: Update password
  const handleResetPassword = () => {
    if (newPassword.trim().length < 4) {
      showToast('Kata sandi minimal 4 karakter!', 'error');
      return;
    }

    updateUserPassword(forgotUser.email, newPassword);
    showToast(`Kata sandi untuk ${forgotUser.email} berhasil diperbarui! Silakan login sekarang.`, 'success');
    setShowForgotModal(false);
    // Autofill email field in login form
    setEmail(forgotUser.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden text-slate-850">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 glow-orb"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-4">
            <img 
              src="/Media/Logo HIma/logo hima warna (3)_page-0001.jpg" 
              alt="Logo HIMA EINSTEN" 
              className="h-16 w-auto object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "https://placehold.co/120x45/ffffff/000000?text=EINSTEN";
              }}
            />
            <div className="w-px h-10 bg-slate-300"></div>
            <img 
              src="/Media Einsten/Media Umum/logo kabinet hitam (horizontal) (1).png" 
              alt="Logo Kabinet Phótisma" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/ffffff/000000?text=PHÓTISMA";
              }}
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 uppercase tracking-wider">MASUK KE PORTAL</h2>
          <p className="text-xs text-slate-500 mt-1">Kabinet Phótisma • Poltek Teknologi Nuklir Indonesia</p>
        </div>

        <div className="glass-glow rounded-2xl p-8 relative overflow-hidden shadow-md bg-white border border-gold-border">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Fake inputs to prevent browser autofill */}
            <input type="text" name="prevent_autofill_username" style={{ display: 'none' }} tabIndex={-1} />
            <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} />

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Email Mahasiswa</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="nama@einsten.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setForgotPhone('');
                    setForgotOtpInput('');
                    setNewPassword('');
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] font-bold text-gold-dark hover:underline uppercase tracking-wider focus:outline-none"
                >
                  Lupa Sandi / Akun?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl shadow-md shadow-gold/20 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Masuk Sekarang <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Prompt to register */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Belum memiliki akun?{' '}
              <Link to="/register" className="text-gold-dark hover:underline font-semibold">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password / Account Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gold-border rounded-2xl p-6 w-full max-w-sm text-center shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pemulihan Akun / Sandi</h3>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* STEP 1: Phone input */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotPhoneSubmit} className="space-y-4 text-left">
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Lupa email atau kata sandi? Masukkan nomor telepon WhatsApp yang Anda daftarkan di awal untuk melakukan pemulihan.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Nomor Telepon WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 081234567890"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-1"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />} Lanjut
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {forgotStep === 2 && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Kode OTP pemulihan telah dikirim ke WhatsApp nomor <strong className="text-slate-800 font-bold">{forgotPhone}</strong>. Masukkan kode tersebut di bawah ini:
                </p>
                {forgotOtpMode === 'simulation' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-0.5">Mode Simulasi Aktif</span>
                    <p className="text-[10px] text-amber-700 leading-normal">
                      WhatsApp Gateway offline/terputus atau token belum aktif. Masukkan kode verifikasi berikut: <strong className="text-slate-900 text-sm font-mono tracking-wider ml-1 bg-white px-2 py-0.5 rounded border border-amber-300">{forgotGeneratedOtp}</strong>
                    </p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Kode Verifikasi (OTP)</label>
                  <input
                    type="text"
                    placeholder="Masukkan 6-digit OTP"
                    maxLength={6}
                    value={forgotOtpInput}
                    onChange={(e) => setForgotOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center text-lg font-bold font-mono tracking-widest text-slate-850 placeholder-slate-350 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyForgotOtp}
                    className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Verifikasi
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Show Credentials & Update Password */}
            {forgotStep === 3 && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Akun Anda berhasil diverifikasi. Berikut adalah detail email akun Anda:
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-0.5">Email Mahasiswa Anda</span>
                  <strong className="text-slate-800 text-sm font-mono break-all">{forgotUser?.email}</strong>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">Kata Sandi Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi baru"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" /> Perbarui Sandi & Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
