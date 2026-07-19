import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ShieldAlert, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Users, ShieldCheck } from 'lucide-react';

export default function MasterAdmin({ showToast }) {
  const { users, currentUser, updateUserStatus, updateUserRole } = useAuth();
  const [filterRole, setFilterRole] = useState('All');
  const [fonnteToken, setFonnteToken] = useState(localStorage.getItem('fonnte_token') || '');

  const handleApprove = (email) => {
    updateUserStatus(email, 'Active');
    showToast(`Akun dengan email ${email} berhasil disetujui (Active)!`, 'success');
  };

  const handleReject = (email) => {
    updateUserStatus(email, 'Rejected');
    showToast(`Akun dengan email ${email} telah ditolak (Rejected).`, 'error');
  };

  const handleRoleChange = (email, newRole) => {
    updateUserRole(email, newRole);
    showToast(`Peran pengguna ${email} diubah menjadi: ${newRole}!`, 'success');
  };

  const handleDemote = (email) => {
    updateUserRole(email, 'Anggota Biasa');
    showToast(`Peran pengguna ${email} telah diturunkan menjadi Anggota Biasa.`, 'info');
  };

  const rolesList = [
    'Anggota Biasa',
    'Operator BPH',
    'Operator Internal',
    'Operator External',
    'Operator Ristek',
    'Operator Pengma',
    'Operator Danus',
    'Operator Kominfo',
    'Operator Logistik',
    'Sekretaris Umum',
    'Bendahara Umum',
    'Master Admin'
  ];

  // Filter users
  const filteredUsers = users.filter(u => {
    if (filterRole === 'All') return true;
    return u.role === filterRole;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5 text-gold" /> MASTER CONTROL PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            User Management & Permissions
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Otoritas penuh BPH Kabinet Phótisma untuk persetujuan akun anggota dan penetapan operator divisi kemahasiswaan.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter Peran:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
          >
            <option value="All">Semua Peran</option>
            {rolesList.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Total Terdaftar</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">{users.length} Akun</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Antrean Pending</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {users.filter(u => u.status === 'Pending').length} Akun
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Operator Divisi</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {users.filter(u => u.role !== 'Anggota Biasa' && u.role !== 'Master Admin').length} User
            </span>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Mahasiswa</th>
                <th className="px-6 py-4">NIM / Student ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4">Peran Aktif (Role)</th>
                <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-450">
                    Tidak ditemukan data pengguna terdaftar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = currentUser && currentUser.email.toLowerCase() === user.email.toLowerCase();

                  return (
                    <tr key={user.email} className={`hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-gold/5' : ''}`}>
                      <td className="px-6 py-4 font-bold text-slate-800 text-left">
                        <div className="flex items-center gap-1">
                          {user.name}
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold-dark text-[8px] font-bold uppercase border border-gold/30">Anda</span>
                          )}
                        </div>
                        {user.phone && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-normal">
                            Telp: {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">{user.nim}</td>
                      <td className="px-6 py-4 text-slate-650">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          user.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                            : user.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-600 border-rose-500/20'
                              : 'bg-amber-50 text-amber-600 border-amber-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <span className={user.role === 'Master Admin' ? 'text-gold-dark font-extrabold' : user.role === 'Anggota Biasa' ? 'text-slate-500 font-normal' : 'text-gold font-bold'}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Approve/Reject for Pending accounts */}
                          {user.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(user.email)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95 shadow-sm"
                              >
                                <CheckCircle className="w-3 h-3 text-white" /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(user.email)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95 shadow-sm"
                              >
                                <XCircle className="w-3 h-3 text-white" /> Reject
                              </button>
                            </>
                          )}

                          {/* Role Promotion & Demotion for Active accounts (prevent self role modifications) */}
                          {user.status === 'Active' && !isSelf && (
                            <div className="flex items-center gap-2">
                              
                              {/* Promotion selector dropdown */}
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-gold"
                              >
                                {rolesList.map((role) => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>

                              {/* Quick demote button back to Anggota Biasa */}
                              {user.role !== 'Anggota Biasa' && (
                                <button
                                  onClick={() => handleDemote(user.email)}
                                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-rose-500/30 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[10px] font-bold rounded-lg transition-all active:scale-95"
                                  title="Demote to Anggota Biasa"
                                >
                                  Demote
                                </button>
                              )}
                            </div>
                          )}

                          {isSelf && (
                            <span className="text-[10px] text-slate-500 font-mono italic">Tidak dapat diubah</span>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp OTP Gateway Settings */}
      <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md text-left space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" /> Pengaturan WhatsApp OTP Gateway (Fonnte)
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Masukkan Fonnte API Device Token Anda untuk mengaktifkan pengiriman kode OTP verifikasi WhatsApp secara riil. Jika dikosongkan, sistem otomatis menggunakan mode simulasi (gratis & aman untuk demo).
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            placeholder="Masukkan Device Token Fonnte Anda..."
            value={fonnteToken}
            onChange={(e) => {
              setFonnteToken(e.target.value);
              localStorage.setItem('fonnte_token', e.target.value);
            }}
            className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-gold"
          />
          <button
            onClick={() => {
              showToast('Device Token Fonnte berhasil disimpan!', 'success');
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
          >
            Simpan Token
          </button>
        </div>
      </div>
    </div>
  );
}
