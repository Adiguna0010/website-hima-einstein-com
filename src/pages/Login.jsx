import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ showToast }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      } else if (user.role === 'Operator Ristek') {
        navigate('/sphere');
      } else if (user.role === 'Operator Logistik') {
        navigate('/space');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'Login gagal!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electricBlue/10 glow-orb"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-electricCyan/5 glow-orb"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="/Media Einsten/Media Umum/logo kabinet putih (horizontal).png" 
              alt="HIMA EINSTEIN" 
              className="h-12 w-auto mx-auto object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/180x45/05070a/ffffff?text=EINSTEIN";
              }}
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white uppercase tracking-wider">MASUK KE PORTAL</h2>
          <p className="text-xs text-slate-400 mt-1">Kabinet Phótisma • Poltek Teknologi Nuklir Indonesia</p>
        </div>

        {/* Card Panel */}
        <div className="glass-glow rounded-2xl p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Email Mahasiswa</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-electricBlue to-electricCyan text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Belum memiliki akun?{' '}
              <Link to="/register" className="text-electricCyan hover:underline font-semibold">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>

        {/* Demo login tips */}
        <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/5 text-left space-y-1.5">
          <p className="text-[10px] font-bold text-limeGreen uppercase tracking-widest">💡 Akun Demo Pengujian:</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>
              <p className="font-semibold text-white">Master Admin:</p>
              <p>Email: admin@einstein.com</p>
              <p>Sandi: admin123</p>
            </div>
            <div>
              <p className="font-semibold text-white">Operator Danus:</p>
              <p>Email: budi@einstein.com</p>
              <p>Sandi: user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
