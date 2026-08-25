import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = [
  // ── BPH CORE ──
  {
    name: 'Muhammad Iqbal Nur Huda',
    nim: '022400042',
    email: 'M. Iqbal Nur Huda@einsten.com',
    password: '022400042',
    role: 'Master Admin',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Kahim_M. Iqbal Nur Huda - 022400042.JPG',
    status: 'Active'
  },
  {
    name: 'Rafie Asfa Raditya Aryanto',
    nim: '022500041',
    email: 'Rafie Asfa Raditya Aryanto@einsten.com',
    password: '022500041',
    role: 'Master Admin',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Wakahim_Rafie Asfa Raditya Aryanto - 022500041.JPG',
    status: 'Active'
  },
  {
    name: 'Nailah Qarirah',
    nim: '022400051',
    email: 'Nailah Qarirah@einsten.com',
    password: '022400051',
    role: 'Sekretaris Umum',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 1_Nailah Qarirah - 022400051.JPG',
    status: 'Active'
  },
  {
    name: 'Bunga Nafisya Putri',
    nim: '022500009',
    email: 'Bunga Nafisya Putri@einsten.com',
    password: '022500009',
    role: 'Sekretaris Umum',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Sekretaris 2_Bunga Nafisya Putri - 022500009.JPG',
    status: 'Active'
  },
  {
    name: 'Relvina',
    nim: '022400039',
    email: 'relvina@einsten.com',
    password: '022400039',
    role: 'Bendahara Umum',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 1_Relvina - 022400039.JPG',
    status: 'Active'
  },
  {
    name: 'Rizkiana Ramadhani',
    nim: '022500046',
    email: 'rizkiana@einsten.com',
    password: '022500046',
    role: 'Bendahara Umum',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Bendahara 2_Rizkiana Ramadhani - 022500046.JPG',
    status: 'Active'
  },

  // ── JAJARAN KEPALA DIVISI (KADIV) ──
  {
    name: 'Adiguna Nugroho Halomoan',
    nim: '022400025',
    email: 'Adiguna Nugroho Halomoan@einsten.com',
    password: '022400025',
    role: 'Operator Ristek',
    phone: '085175420692',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Ristek/Kepala Divisi Riset dan Teknologi_Adiguna Nugroho Halomoan - 022400025.JPG',
    status: 'Active'
  },
  {
    name: 'Rabbany Al-Malika Ifadzla',
    nim: '022400006',
    email: 'Rabbany Al-Malika Ifadzla@einsten.com',
    password: '022400006',
    role: 'Operator Danus',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Dana Usaha/Kepala Divisi Dana Usaha_Rabbany Al-Malika Ifadzla - 022400006.JPG',
    status: 'Active'
  },
  {
    name: 'Rakan Ibrahim Widjisasono',
    nim: '022400031',
    email: 'Rakan Ibrahim Widjisasono@einsten.com',
    password: '022400031',
    phone: '082171748617',
    role: 'Operator Logistik',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Aset Dan Logistik/Kepala Divisi Aset dan Logistik_Rakan Ibrahim Widjisasono - 022400031.JPG',
    status: 'Active'
  },
  {
    name: 'Kunti Aisyatuzzahra',
    nim: '022400045',
    email: 'Kunti Aisyatuzzahra@einsten.com',
    password: '022400045',
    role: 'Operator External',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/External/Kepala Divisi Eksternal_Kunti Aisyatuzzahra - 022400045.JPG',
    status: 'Active'
  },
  {
    name: 'Hafizh Maulana Wijaya',
    nim: '022400019',
    email: 'Hafizh Maulana Wijaya@einsten.com',
    password: '022400019',
    role: 'Operator Internal',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Internal/Kepala Divisi Internal_Hafizh Maulana Wijaya - 022400019.JPG',
    status: 'Active'
  },
  {
    name: 'Sunniy',
    nim: '022400041',
    email: 'Sunniy@einsten.com',
    password: '022400041',
    role: 'Operator Kominfo',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Kominfo/Kepala Divisi Komunikasi dan Informasi_Sunniy - 022400041.JPG',
    status: 'Active'
  },
  {
    name: 'Farrelega Zhafran Vito Ardhana',
    nim: '022400038',
    email: 'Farrelega Zhafran Vito Ardhana@einsten.com',
    password: '022400038',
    role: 'Operator Pengma',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Pema/Kepala Divisi Pengembangan Mahasiswa_Farrelega Zhafran Vito Ardhana - 022400038.JPG',
    status: 'Active'
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Robust email normalization (lowercase, strips all spaces, and handles domain aliases)
  const normalizeEmail = (emailStr) => {
    if (!emailStr) return '';
    return emailStr
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/einsten\.com$/, 'einsten.com');
  };

  // Helper to generate a unique key per user (NIM takes precedence, then normalized email)
  const getUserKey = (u) => {
    if (!u) return '';
    if (u.nim && String(u.nim).trim()) return `nim_${String(u.nim).trim()}`;
    if (u.email && u.email.trim()) return `email_${normalizeEmail(u.email)}`;
    return `name_${(u.name || '').trim().toLowerCase()}`;
  };

  // Helper to merge arrays of users without duplicates
  const mergeUserLists = (baseList, incomingList) => {
    const userMap = new Map();
    (baseList || []).forEach(u => {
      if (u) {
        const key = getUserKey(u);
        if (key) {
          const role = u.role === 'Anggota Biasa' ? 'Anggota Hima' : u.role;
          userMap.set(key, { ...u, role });
        }
      }
    });
    (incomingList || []).forEach(u => {
      if (u) {
        const key = getUserKey(u);
        if (key) {
          const defaultUser = userMap.get(key) || {};
          const merged = { ...defaultUser, ...u };
          if (merged.role === 'Anggota Biasa') {
            merged.role = 'Anggota Hima';
          }
          userMap.set(key, merged);
        }
      }
    });
    return Array.from(userMap.values());
  };

  const CLOUD_FALLBACK_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0333097b60c32';

  // Resilient cloud fetcher (tries /api/users, falls back to direct Cloud DB with strict timeouts)
  const fetchFromAnyCloud = async () => {
    // 1. Try Vercel Serverless Function
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/users', { 
        credentials: 'omit',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.success) {
          return {
            users: Array.isArray(data.users) ? data.users : [],
            login_logs: Array.isArray(data.login_logs) ? data.login_logs : []
          };
        }
      }
    } catch (e) {}

    // 2. Direct Cloud DB Object Store Fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(CLOUD_FALLBACK_URL, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          const cloudUsers = Array.isArray(data.data.users) ? data.data.users : [];
          const cloudLogs = Array.isArray(data.data.login_logs) ? data.data.login_logs : [];
          return {
            users: mergeUserLists(DEFAULT_USERS, cloudUsers),
            login_logs: cloudLogs
          };
        }
      }
    } catch (e) {}

    return null;
  };

  // Resilient non-blocking cloud saver
  const saveToAnyCloud = async (allUsersList, allLogsList) => {
    const currentLogs = allLogsList !== undefined ? allLogsList : JSON.parse(localStorage.getItem('hima_login_logs') || '[]');
    
    // 1. Send to Vercel API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: allUsersList, login_logs: currentLogs }),
        signal: controller.signal
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {}

    // 2. Save directly to Cloud DB Object Store
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      fetch(CLOUD_FALLBACK_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'hima_einsten_users_db',
          data: { users: allUsersList, login_logs: currentLogs }
        }),
        signal: controller.signal
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {}
  };

  // Cloud sync function
  const syncUsersWithCloud = async () => {
    setIsSyncing(true);
    try {
      const cloudData = await fetchFromAnyCloud();
      if (cloudData) {
        const currentLocal = JSON.parse(localStorage.getItem('hima_users') || '[]');
        const merged = mergeUserLists(DEFAULT_USERS, mergeUserLists(currentLocal, cloudData.users));
        
        setUsers(merged);
        localStorage.setItem('hima_users', JSON.stringify(merged));

        if (Array.isArray(cloudData.login_logs)) {
          const localLogs = JSON.parse(localStorage.getItem('hima_login_logs') || '[]');
          const combinedLogs = [...cloudData.login_logs, ...localLogs];
          const uniqueLogs = Array.from(new Map(combinedLogs.map(item => [item.id, item])).values())
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, 100);
          setLoginLogs(uniqueLogs);
          localStorage.setItem('hima_login_logs', JSON.stringify(uniqueLogs));
        }

        setLastSyncedAt(new Date());

        // Refresh current user session if updated
        const savedUser = sessionStorage.getItem('hima_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const freshSelf = merged.find(u => 
            (u.nim && parsed.nim && String(u.nim).trim() === String(parsed.nim).trim()) ||
            (u.email && normalizeEmail(u.email) === normalizeEmail(parsed.email))
          );
          if (freshSelf) {
            setCurrentUser(freshSelf);
            sessionStorage.setItem('hima_current_user', JSON.stringify(freshSelf));
          }
        }
        return merged;
      }
    } catch (err) {
      console.log('Cloud sync error:', err.message);
    } finally {
      setIsSyncing(false);
    }
    return null;
  };

  // Initialize DB from LocalStorage & Cloud API
  useEffect(() => {
    const stored = localStorage.getItem('hima_users');
    let loadedUsers = DEFAULT_USERS;
    
    // One-time migration to wipe all existing phone numbers for testing fresh
    const hasWipedPhones = localStorage.getItem('hima_phone_wipe_v1');
    
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out dummy test accounts (Regular Member, Calon Anggota)
          parsed = parsed.filter(u => 
            u && 
            u.nim !== '240055' && 
            u.nim !== '240066' && 
            normalizeEmail(u.email) !== 'member@einsten.com' && 
            normalizeEmail(u.email) !== 'calon@einsten.com' &&
            u.name !== 'Regular Member' &&
            u.name !== 'Calon Anggota'
          );

          if (!hasWipedPhones) {
            parsed = parsed.map(u => {
              if (u) {
                const { phone, ...rest } = u;
                return rest;
              }
              return u;
            });
            localStorage.setItem('hima_phone_wipe_v1', 'true');
            
            const savedUser = sessionStorage.getItem('hima_current_user');
            if (savedUser) {
              const parsedUser = JSON.parse(savedUser);
              if (parsedUser) {
                delete parsedUser.phone;
                sessionStorage.setItem('hima_current_user', JSON.stringify(parsedUser));
              }
            }
          }
          
          loadedUsers = mergeUserLists(DEFAULT_USERS, parsed);
        }
      } catch (e) {
        console.error('Failed to parse hima_users from localStorage:', e);
      }
    } else {
      if (!hasWipedPhones) {
        localStorage.setItem('hima_phone_wipe_v1', 'true');
      }
    }

    // Auto-migrate any previously registered Pending users to Active
    loadedUsers = loadedUsers.map(u => {
      if (u && u.status === 'Pending') {
        return { ...u, status: 'Active' };
      }
      return u;
    });

    localStorage.setItem('hima_users', JSON.stringify(loadedUsers));
    setUsers(loadedUsers);

    const savedUser = sessionStorage.getItem('hima_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const latestUser = loadedUsers.find(u => 
          (u.nim && parsedUser.nim && String(u.nim).trim() === String(parsedUser.nim).trim()) ||
          (u.email && normalizeEmail(u.email) === normalizeEmail(parsedUser.email))
        );
        if (latestUser) {
          setCurrentUser(latestUser);
          sessionStorage.setItem('hima_current_user', JSON.stringify(latestUser));
        } else {
          setCurrentUser(parsedUser);
        }
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }

    // Fetch fresh database from cloud immediately
    syncUsersWithCloud();

    // Setup periodic cloud polling (every 15 seconds)
    const pollInterval = setInterval(() => {
      syncUsersWithCloud();
    }, 15000);

    // Sync on tab focus
    const handleFocus = () => syncUsersWithCloud();
    window.addEventListener('focus', handleFocus);

    // Listen for storage events across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'hima_users' && e.newValue) {
        try {
          const freshUsers = JSON.parse(e.newValue);
          if (Array.isArray(freshUsers)) {
            setUsers(freshUsers);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const register = async (name, nim, phone, password) => {
    const generatedEmail = `${name.trim()}@einsten.com`;
    const emailExists = users.some(u => normalizeEmail(u.email) === normalizeEmail(generatedEmail));
    const nimExists = users.some(u => String(u.nim).trim() === String(nim).trim());
    const phoneExists = phone ? users.some(u => u.phone && String(u.phone).trim() === String(phone).trim()) : false;

    if (emailExists) {
      throw new Error('Nama lengkap ini sudah terdaftar sebagai akun (email sudah ada)!');
    }
    if (nimExists) {
      throw new Error('NIM sudah terdaftar!');
    }
    if (phone && phoneExists) {
      throw new Error('Nomor WhatsApp sudah terdaftar!');
    }

    const newUser = {
      name: name.trim(),
      nim: String(nim).trim(),
      phone: phone ? String(phone).trim() : '',
      email: generatedEmail,
      password: password || String(nim).trim(),
      role: 'Anggota Hima',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Optimistic local update
    const updatedUsers = mergeUserLists(users, [newUser]);
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Save to Cloud (dual-layer API & Cloud DB)
    saveToAnyCloud(updatedUsers);

    // Notify Master Admins about new registration
    try {
      const now = Date.now();
      const savedNotifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
      const adminEmails = [
        'Muhammad Iqbal Nur Huda@einsten.com',
        'M. Iqbal Nur Huda@einsten.com',
        'Rafie Asfa Raditya Aryanto@einsten.com'
      ];
      
      const newNotifs = adminEmails.map((adminEmail, idx) => ({
        id: `notif_reg_${now}_${idx}`,
        recipientEmail: adminEmail,
        message: `👤 PENDAFTARAN BARU: ${newUser.name} (NIM: ${newUser.nim}) baru saja mendaftar akun ke portal. Anda dapat menetapkan peran/divisinya di Master Admin Dashboard.`,
        read: false,
        timestamp: now
      }));

      const allNotifs = [...newNotifs, ...savedNotifs].slice(0, 100);
      localStorage.setItem('hima_notifications', JSON.stringify(allNotifs));
    } catch (e) {}

    return newUser;
  };

  const login = async (emailOrNim, password) => {
    const inputStr = (emailOrNim || '').trim();
    const normInput = normalizeEmail(inputStr);
    const normInputWithDomain = normInput.includes('@') ? normInput : normalizeEmail(`${inputStr}@einsten.com`);

    let user = users.find(
      u => (
        normalizeEmail(u.email) === normInput ||
        normalizeEmail(u.email) === normInputWithDomain ||
        (u.nim && String(u.nim).trim() === inputStr) ||
        (u.name && u.name.trim().toLowerCase() === inputStr.toLowerCase())
      ) && u.password === (password || '').trim()
    );

    // If not found in local cache, try fetching from cloud API before failing
    if (!user) {
      const freshList = await syncUsersWithCloud();
      if (freshList) {
        user = freshList.find(
          u => (
            normalizeEmail(u.email) === normInput ||
            normalizeEmail(u.email) === normInputWithDomain ||
            (u.nim && String(u.nim).trim() === inputStr) ||
            (u.name && u.name.trim().toLowerCase() === inputStr.toLowerCase())
          ) && u.password === (password || '').trim()
        );
      }
    }

    if (!user) {
      throw new Error('Email atau Password salah!');
    }

    if (user.status === 'Pending') {
      user.status = 'Active';
      updateUserStatus(user.email, 'Active');
    }

    if (user.status === 'Rejected') {
      throw new Error('Login gagal. Akun Anda telah ditolak oleh Admin BPH.');
    }

    // ── Log this login activity ──
    const now = Date.now();
    const timeStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    const isMobile = typeof navigator !== 'undefined' && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
    const deviceStr = isMobile ? 'Smartphone (Mobile)' : 'Komputer / Laptop';

    const newLogEntry = {
      id: `log_${now}_${Math.random().toString(36).slice(2, 6)}`,
      name: user.name,
      nim: user.nim || '-',
      email: user.email,
      role: (user.role === 'Anggota Biasa' ? 'Anggota Hima' : user.role) || 'Anggota Hima',
      timestamp: now,
      timeString: timeStr,
      device: deviceStr,
      status: 'Success'
    };

    const updatedLogs = [newLogEntry, ...(loginLogs || []).filter(l => l.id !== newLogEntry.id)].slice(0, 100);
    setLoginLogs(updatedLogs);
    localStorage.setItem('hima_login_logs', JSON.stringify(updatedLogs));

    // Update lastLogin on the user
    const targetKey = getUserKey(user);
    const updatedUsersWithLastLogin = users.map(u => {
      if (getUserKey(u) === targetKey) {
        return { ...u, lastLogin: timeStr };
      }
      return u;
    });
    setUsers(updatedUsersWithLastLogin);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsersWithLastLogin));

    // Save logs and updated users to cloud
    saveToAnyCloud(updatedUsersWithLastLogin, updatedLogs);

    // Notify Master Admins (Kahim & Wakahim) via Navbar Notification Bell
    try {
      const savedNotifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
      const adminEmails = [
        'Muhammad Iqbal Nur Huda@einsten.com',
        'M. Iqbal Nur Huda@einsten.com',
        'Rafie Asfa Raditya Aryanto@einsten.com'
      ];
      
      const newNotifs = adminEmails.map((adminEmail, idx) => ({
        id: `notif_login_${now}_${idx}`,
        recipientEmail: adminEmail,
        message: `🔔 NOTIFIKASI LOGIN: ${user.name} (${user.role} - NIM: ${user.nim}) baru saja masuk ke sistem pada ${timeStr} via ${deviceStr}.`,
        read: false,
        timestamp: now
      }));

      const allNotifs = [...newNotifs, ...savedNotifs].slice(0, 100);
      localStorage.setItem('hima_notifications', JSON.stringify(allNotifs));
    } catch (e) {}

    const updatedUserObj = { ...user, lastLogin: timeStr };
    setCurrentUser(updatedUserObj);
    sessionStorage.setItem('hima_current_user', JSON.stringify(updatedUserObj));
    return updatedUserObj;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('hima_current_user');
  };

  // Admin directly adds or registers a user
  const adminAddUser = async (newUserData) => {
    const generatedEmail = newUserData.email || `${newUserData.name.trim()}@einsten.com`;
    const userToSave = {
      name: newUserData.name.trim(),
      nim: String(newUserData.nim).trim(),
      phone: newUserData.phone ? String(newUserData.phone).trim() : '',
      email: generatedEmail,
      password: newUserData.password || String(newUserData.nim).trim(),
      role: (newUserData.role === 'Anggota Biasa' ? 'Anggota Hima' : newUserData.role) || 'Anggota Hima',
      status: newUserData.status || 'Active',
      createdAt: new Date().toISOString()
    };

    const updated = mergeUserLists(users, [userToSave]);
    setUsers(updated);
    localStorage.setItem('hima_users', JSON.stringify(updated));
    saveToAnyCloud(updated);
    return userToSave;
  };

  const clearLoginLogs = () => {
    setLoginLogs([]);
    localStorage.removeItem('hima_login_logs');
    saveToAnyCloud(users, []);
  };

  // Admin and management actions
  const updateUserStatus = (emailOrNim, status) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && String(u.nim).trim() === searchTarget)) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && String(currentUser.nim).trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, status };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }

    saveToAnyCloud(updatedUsers);
  };

  const updateUserRole = (emailOrNim, role) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    let targetUser = null;

    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && String(u.nim).trim() === searchTarget)) {
        targetUser = { ...u, role };
        return targetUser;
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && String(currentUser.nim).trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, role };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }

    // Send notification to the user about their role change
    if (targetUser && targetUser.email) {
      try {
        const now = Date.now();
        const savedNotifs = JSON.parse(localStorage.getItem('hima_notifications') || '[]');
        const roleNotif = {
          id: `notif_role_${now}_${Math.random().toString(36).slice(2, 6)}`,
          recipientEmail: targetUser.email,
          message: `🎉 TUGAS & PERAN DIPERBARUI: Akun Anda telah ditetapkan sebagai "${role}" oleh Ketua/Wakil Himpunan. Anda sekarang memiliki wewenang membuka Dashboard ${role}!`,
          read: false,
          timestamp: now
        };
        const allNotifs = [roleNotif, ...savedNotifs].slice(0, 100);
        localStorage.setItem('hima_notifications', JSON.stringify(allNotifs));
      } catch (e) {}
    }

    saveToAnyCloud(updatedUsers);
  };

  const sendOTP = async (phone, code) => {
    // 1. Try Vercel Serverless Function (/api/send-otp)
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code,
          message: `Kode OTP verifikasi HIMA EINSTEN Anda adalah: ${code}. Gunakan kode ini untuk melanjutkan pendaftaran/pemulihan akun Anda.`
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.mode === 'real') {
          return { success: true, mode: 'real', provider: result.provider || 'vercel-api', result };
        }
      }
    } catch (err) {
      console.log('Vercel API Gateway unavailable, trying self-hosted...', err.message);
    }

    // 2. Try Self-Hosted WhatsApp Gateway (Baileys Node.js)
    const gatewayUrl = localStorage.getItem('self_hosted_gateway_url') || 'http://localhost:5001';
    try {
      const response = await fetch(`${gatewayUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code,
          message: `Kode OTP verifikasi HIMA EINSTEN Anda adalah: ${code}. Gunakan kode ini untuk melanjutkan pendaftaran/pemulihan akun Anda.`
        })
      });
      const result = await response.json();
      if (result.success) {
        return { success: true, mode: 'real', provider: 'self-hosted', result };
      }
    } catch (err) {
      console.log('Self-Hosted Gateway unavailable, trying direct Fonnte fallback...', err.message);
    }

    // 3. Fallback to Direct Fonnte API Gateway if token is set
    const DEFAULT_FONNTE_TOKEN = 'oAkLBXzaU41RszNf6j78'; 
    const token = localStorage.getItem('fonnte_token') || DEFAULT_FONNTE_TOKEN;
    if (token) {
      try {
        const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            target: phone,
            message: `Kode OTP verifikasi HIMA EINSTEN Anda adalah: ${code}. Gunakan kode ini untuk melanjutkan tindakan pendaftaran/pemulihan akun Anda.`
          })
        });
        const result = await response.json();
        if (result.status === true) {
          return { success: true, mode: 'real', provider: 'fonnte', result };
        }
      } catch (error) {
        console.error('Fonnte send OTP error:', error);
      }
    }

    // 4. Fallback to Simulation Mode if all gateways fail/offline
    console.log(`[SIMULASI OTP] Mengirim OTP ke ${phone}: ${code}`);
    return { 
      success: false, 
      mode: 'simulation', 
      code, 
      reason: 'Server WA Gateway sedang offline/terputus' 
    };
  };

  const updateUserPassword = (emailOrNim, newPassword) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && String(u.nim).trim() === searchTarget)) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    saveToAnyCloud(updatedUsers);
  };

  const updateUserProfile = (emailOrNim, updates) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && String(u.nim).trim() === searchTarget)) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && String(currentUser.nim).trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, ...updates };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }

    saveToAnyCloud(updatedUsers);
  };

  const updateUserPhone = (emailOrNim, phone) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && String(u.nim).trim() === searchTarget)) {
        return { ...u, phone };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && String(currentUser.nim).trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, phone };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }

    saveToAnyCloud(updatedUsers);
  };

  const deleteAccount = (emailOrNim) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.filter(u => 
      (u.email && normalizeEmail(u.email) !== normalizedTarget) && 
      (u.nim ? String(u.nim).trim() !== searchTarget : true)
    );
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && String(currentUser.nim).trim() === searchTarget))) {
      logout();
    }

    saveToAnyCloud(updatedUsers);
  };

  return (
    <AuthContext.Provider value={{
      users,
      loginLogs,
      currentUser,
      isSyncing,
      lastSyncedAt,
      syncUsersWithCloud,
      register,
      adminAddUser,
      clearLoginLogs,
      login,
      logout,
      deleteAccount,
      updateUserStatus,
      updateUserRole,
      sendOTP,
      updateUserPassword,
      updateUserPhone,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
