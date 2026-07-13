import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ShieldAlert, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Users, ShieldCheck } from 'lucide-react';

export default function MasterAdmin({ showToast }) {
  const { users, currentUser, updateUserStatus, updateUserRole } = useAuth();
  const [filterRole, setFilterRole] = useState('All');

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
    'Operator Danus',
    'Operator Ristek',
    'Operator Logistik',
    'Sekretaris Umum',
    'Master Admin'
  ];

  // Filter users
  const filteredUsers = users.filter(u => {
    if (filterRole === 'All') return true;
    return u.role === filterRole;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-limeGreen font-bold tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" /> MASTER CONTROL PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            User Management & Permissions
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Otoritas penuh BPH Kabinet Phótisma untuk persetujuan akun anggota dan penetapan operator divisi kemahasiswaan.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter Peran:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-electricBlue"
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
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-electricBlue/10 border border-electricBlue/20 flex items-center justify-center text-electricCyan shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Total Terdaftar</span>
            <span className="text-xl font-extrabold text-white font-heading">{users.length} Akun</span>
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Antrean Pending</span>
            <span className="text-xl font-extrabold text-white font-heading">
              {users.filter(u => u.status === 'Pending').length} Akun
            </span>
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Operator Divisi</span>
            <span className="text-xl font-extrabold text-white font-heading">
              {users.filter(u => u.role !== 'Anggota Biasa' && u.role !== 'Master Admin').length} User
            </span>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Nama Mahasiswa</th>
                <th className="px-6 py-4">NIM / Student ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4">Peran Aktif (Role)</th>
                <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    Tidak ditemukan data pengguna terdaftar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = currentUser && currentUser.email.toLowerCase() === user.email.toLowerCase();

                  return (
                    <tr key={user.email} className={`hover:bg-white/[0.01] transition-colors ${isSelf ? 'bg-electricBlue/5' : ''}`}>
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-1">
                          {user.name}
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded bg-electricBlue/20 text-electricCyan text-[8px] font-bold uppercase border border-electricBlue/30">Anda</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{user.nim}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          user.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : user.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        <span className={user.role === 'Master Admin' ? 'text-limeGreen' : user.role === 'Anggota Biasa' ? 'text-slate-400 font-normal' : 'text-electricCyan'}>
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
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-obsidian text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95 shadow-md"
                              >
                                <CheckCircle className="w-3 h-3" /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(user.email)}
                                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95 shadow-md"
                              >
                                <XCircle className="w-3 h-3" /> Reject
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
                                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-electricBlue"
                              >
                                {rolesList.map((role) => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>

                              {/* Quick demote button back to Anggota Biasa */}
                              {user.role !== 'Anggota Biasa' && (
                                <button
                                  onClick={() => handleDemote(user.email)}
                                  className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-rose-500/20 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-[10px] font-bold rounded-lg transition-all active:scale-95"
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
    </div>
  );
}
