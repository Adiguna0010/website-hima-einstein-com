import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldAlert, Loader2, ArrowRight, IdCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register({ showToast }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, nim, email, password);
      showToast('Registrasi Berhasil! Akun Anda sedang menunggu persetujuan (approval) BPH.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registrasi gagal!', 'error');
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
          <h2 className="mt-4 text-2xl font-bold text-white uppercase tracking-wider">DAFTAR AKUN BARU</h2>
          <p className="text-xs text-slate-400 mt-1">Portal Keanggotaan Kabinet Phótisma</p>
        </div>

        <div className="glass-glow rounded-2xl p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dian Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">NIM (Nomor Induk Mahasiswa)</label>
              <div className="relative">
                <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 240011"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Email Mahasiswa</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-electricBlue transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-white/5 border border-white/5 rounded-xl text-left">
              <ShieldAlert className="w-4 h-4 text-limeGreen shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                Akun baru secara default terdaftar sebagai <strong className="text-white">Anggota Biasa</strong> dengan status <strong className="text-white">Pending</strong>. Anda membutuhkan persetujuan Admin/BPH untuk masuk.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-electricBlue to-electricCyan text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mendaftar...
                </>
              ) : (
                <>
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-electricCyan hover:underline font-semibold">
                Masuk ke Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
