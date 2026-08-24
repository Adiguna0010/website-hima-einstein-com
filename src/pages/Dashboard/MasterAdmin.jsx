import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, CheckCircle, XCircle, ArrowUpRight, RefreshCw, Users, ShieldCheck, 
  UserPlus, Clock, Laptop, Smartphone, Activity, Trash2, Mail, Phone, Lock, User, X, Check
} from 'lucide-react';

export default function MasterAdmin({ showToast }) {
  const { 
    users, 
    loginLogs, 
    currentUser, 
    updateUserStatus, 
    updateUserRole, 
    syncUsersWithCloud, 
    adminAddUser,
    clearLoginLogs,
    isSyncing, 
    lastSyncedAt 
  } = useAuth();

  const [filterRole, setFilterRole] = useState('All');
  const [fonnteToken, setFonnteToken] = useState(localStorage.getItem('fonnte_token') || '');

  // Add User Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserNim, setNewUserNim] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Anggota Biasa');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const [gatewayUrl, setGatewayUrl] = useState(localStorage.getItem('self_hosted_gateway_url') || 'http://localhost:5001');
  const [gatewayStatus, setGatewayStatus] = useState(null);
  const [checkingGateway, setCheckingGateway] = useState(false);

  const handleManualSync = async () => {
    try {
      const result = await syncUsersWithCloud();
      if (result) {
        showToast(`Sinkronisasi Cloud Berhasil! Total ${result.length} akun & riwayat login termuat.`, 'success');
      } else {
        showToast('Sinkronisasi selesai.', 'info');
      }
    } catch (err) {
      showToast('Gagal sinkronisasi cloud: ' + err.message, 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserNim.trim()) {
      showToast('Nama dan NIM wajib diisi!', 'error');
      return;
    }
    setIsSubmittingUser(true);
    try {
      await adminAddUser({
        name: newUserName.trim(),
        nim: newUserNim.trim(),
        phone: newUserPhone.trim(),
        password: newUserPassword.trim() || newUserNim.trim(),
        role: newUserRole,
        status: 'Active'
      });
      showToast(`Akun ${newUserName.trim()} (${newUserRole}) berhasil ditambahkan dan aktif di Cloud!`, 'success');
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserNim('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserRole('Anggota Biasa');
    } catch (err) {
      showToast('Gagal menambahkan akun: ' + err.message, 'error');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const checkGatewayStatus = async () => {
    setCheckingGateway(true);
    try {
      const res = await fetch(`${gatewayUrl}/status`);
      const data = await res.json();
      setGatewayStatus(data);
    } catch (err) {
      setGatewayStatus({ status: 'offline', phone: null });
    } finally {
      setCheckingGateway(false);
    }
  };

  useEffect(() => {
    checkGatewayStatus();
  }, [gatewayUrl]);

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
    { value: 'Anggota Biasa', label: 'Anggota Biasa (Portal Mahasiswa)', db: null },
    { value: 'Operator Logistik', label: '📦 Operator Logistik (Dashboard Aset & Logistik)', db: '/dashboard/logistik' },
    { value: 'Operator Danus', label: '🛍️ Operator Danus (Dashboard Dana Usaha & Market)', db: '/dashboard/danus' },
    { value: 'Operator Ristek', label: '🔬 Operator Ristek (Dashboard Riset & Teknologi)', db: '/dashboard/ristek' },
    { value: 'Operator Kominfo', label: '📢 Operator Kominfo (Dashboard Komunikasi & Info)', db: '/dashboard/division' },
    { value: 'Operator Internal', label: '🤝 Operator Internal (Dashboard Hubungan Internal)', db: '/dashboard/division' },
    { value: 'Operator External', label: '🌐 Operator External (Dashboard Hubungan Eksternal)', db: '/dashboard/division' },
    { value: 'Operator Pengma', label: '🎓 Operator Pengma (Dashboard Pengembangan Mhs)', db: '/dashboard/division' },
    { value: 'Operator BPH', label: '🏛️ Operator BPH (Dashboard Pengurus Harian)', db: '/dashboard/division' },
    { value: 'Sekretaris Umum', label: '📝 Sekretaris Umum (Dashboard Administrasi & Surat)', db: '/dashboard/sekretaris' },
    { value: 'Bendahara Umum', label: '💰 Bendahara Umum (Dashboard Keuangan & Kas)', db: '/dashboard/bendahara' },
    { value: 'Master Admin', label: '👑 Master Admin (Otoritas Ketua / Wakil Himpunan)', db: '/dashboard/master' }
  ];

  // Filter users
  const filteredUsers = users.filter(u => {
    if (filterRole === 'All') return true;
    return u.role === filterRole;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <span className="inline-flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-gold" /> MASTER CONTROL PANEL</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Cloud DB Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            User Management & Activity Monitor
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Otoritas penuh <strong>Ketua & Wakil Ketua Himpunan (Master Admin)</strong> untuk persetujuan akun, penetapan operator divisi, dan pemantauan login anggota secara real-time.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Akun</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            title="Sinkronkan database dengan Cloud Vercel"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkron Data'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
            >
              <option value="All">Semua Peran</option>
              {rolesList.map((r) => (
                <option key={r.value} value={r.value}>{r.value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Akun</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">{users.length} User</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Antrean Pending</span>
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
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator Divisi</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {users.filter(u => u.role !== 'Anggota Biasa' && u.role !== 'Master Admin').length} User
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aktivitas Login</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {loginLogs?.length || 0} Sesi
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION: REAL-TIME LOGIN MONITORING & ACTIVITY LOGS ── */}
      <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold" /> Log Aktivitas & Monitoring Siapa yang Login
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Notifikasi dan riwayat pendaftaran & akses login anggota ke sistem secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('Bersihkan semua riwayat log login?')) {
                  clearLoginLogs();
                  showToast('Riwayat log login telah dibersihkan.', 'info');
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan Log
            </button>
            <button
              onClick={handleManualSync}
              className="px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold-dark border border-gold/30 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        </div>

        {/* Live Logs Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Peran / Divisi</th>
                <th className="px-4 py-3">Perangkat</th>
                <th className="px-4 py-3">Waktu Login</th>
                <th className="px-4 py-3 text-center">Status Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {(!loginLogs || loginLogs.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-xs">
                    <Activity className="w-6 h-6 mx-auto mb-1.5 text-slate-300 animate-pulse" />
                    Belum ada log aktivitas login anggota tercatat hari ini.
                  </td>
                </tr>
              ) : (
                loginLogs.slice(0, 15).map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gold/15 text-gold-dark font-bold text-[10px] flex items-center justify-center">
                          {log.name ? log.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span>{log.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{log.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{log.nim}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.role === 'Master Admin' ? 'bg-gold/15 text-gold-dark' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        {log.device?.includes('Mobile') || log.device?.includes('Smartphone') ? (
                          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        {log.device || 'Desktop'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {log.timeString || new Date(log.timestamp).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Berhasil Masuk
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION: ALL REGISTERED USERS TABLE ── */}
      <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" /> Daftar Seluruh Akun Mahasiswa Terdaftar
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Data tersimpan terpusat di Cloud Database dan tersinkronisasi di seluruh perangkat.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium font-mono bg-white px-3 py-1 rounded-lg border border-slate-200">
            Total: {filteredUsers.length} Mahasiswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Mahasiswa</th>
                <th className="px-6 py-4">NIM / Student ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Terakhir Login</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4">Peran Aktif (Role)</th>
                <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-450">
                    Tidak ditemukan data pengguna terdaftar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = currentUser && (
                    (currentUser.nim && user.nim && String(currentUser.nim).trim() === String(user.nim).trim()) ||
                    (currentUser.email && user.email && currentUser.email.toLowerCase().replace(/\s+/g, '') === user.email.toLowerCase().replace(/\s+/g, ''))
                  );

                  return (
                    <tr key={user.nim || user.email} className={`hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-gold/5' : ''}`}>
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
                      
                      {/* Last Login Column */}
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                        {user.lastLogin ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {user.lastLogin}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Belum Ada Sesi</span>
                        )}
                      </td>

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
                        {(() => {
                          const roleObj = rolesList.find(r => r.value === user.role);
                          return (
                            <div className="flex flex-col gap-1">
                              <span className={user.role === 'Master Admin' ? 'text-gold-dark font-extrabold' : user.role === 'Anggota Biasa' ? 'text-slate-500 font-normal' : 'text-gold font-bold'}>
                                {user.role}
                              </span>
                              {roleObj?.db && user.role !== 'Master Admin' && (
                                <a
                                  href={roleObj.db}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[9px] text-blue-600 hover:text-blue-800 hover:underline font-mono"
                                  title={`Buka ${roleObj.label}`}
                                >
                                  Buka Dashboard <ArrowUpRight className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          );
                        })()}
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

                          {/* Role Promotion & Demotion for Active accounts */}
                          {user.status === 'Active' && !isSelf && (
                            <div className="flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-gold max-w-[200px]"
                              >
                                {rolesList.map((r) => (
                                  <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                              </select>

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
      <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md text-left space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" /> Pengaturan WhatsApp OTP Gateway (Self-Hosted Baileys)
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Gunakan <strong>Self-Hosted WA Gateway (Gratis 100%)</strong> berbasis Node.js & Baileys yang berjalan di server Anda, atau gunakan Fonnte API sebagai cadangan.
          </p>
        </div>

        {/* Self-Hosted Gateway Status Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Self-Hosted Gateway</span>
              <div className="flex items-center gap-2 mt-1">
                {gatewayStatus?.status === 'connected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5" /> Terhubung ({gatewayStatus.phone})
                  </span>
                )}
                {gatewayStatus?.status === 'connecting' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-extrabold rounded-full border border-amber-300 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Perlu Scan QR Code
                  </span>
                )}
                {(!gatewayStatus || gatewayStatus?.status === 'offline' || gatewayStatus?.status === 'disconnected') && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-700 text-xs font-extrabold rounded-full border border-slate-300">
                    <XCircle className="w-3.5 h-3.5 text-slate-500" /> Gateway Offline / Terputus
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={checkGatewayStatus}
                disabled={checkingGateway}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingGateway ? 'animate-spin' : ''}`} /> Cek Status
              </button>
              <a
                href={`${gatewayUrl}/qr`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm hover:brightness-110 transition-all"
              >
                📱 Buka Halaman Scan QR Code <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">URL Server Gateway:</span>
            <input
              type="text"
              value={gatewayUrl}
              onChange={(e) => {
                setGatewayUrl(e.target.value);
                localStorage.setItem('self_hosted_gateway_url', e.target.value);
              }}
              placeholder="http://localhost:5001"
              className="flex-grow w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Fonnte Token Fallback Card */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">Fonnte API Token (Cadangan / Secondary Gateway):</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="Masukkan Device Token Fonnte (Opsional)..."
              value={fonnteToken}
              onChange={(e) => {
                setFonnteToken(e.target.value);
                localStorage.setItem('fonnte_token', e.target.value);
              }}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => {
                showToast('Pengaturan Token Fonnte berhasil disimpan!', 'success');
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
            >
              Simpan Token
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: TAMBAH AKUN MAHASISWA BARU ── */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gold-border rounded-2xl p-6 w-full max-w-md text-left shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Tambah Akun Mahasiswa</h3>
                  <p className="text-[10px] text-slate-400 font-light">Daftarkan akun anggota langsung ke Cloud Database</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dian Pratama"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">NIM</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 022400088"
                    value={newUserNim}
                    onChange={(e) => setNewUserNim(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">No. WhatsApp</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Peran / Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-gold"
                >
                  {rolesList.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Kata Sandi (Default: NIM)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Kosongkan untuk gunakan NIM sebagai sandi"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-gold/5 border border-gold/20 rounded-xl text-[10px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Email Akun:</span>
                  <span className="font-mono font-bold text-gold-dark">{newUserName.trim() ? `${newUserName.trim()}@einsten.com` : 'nama@einsten.com'}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Simpan & Aktifkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

