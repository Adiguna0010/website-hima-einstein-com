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
  const [currentUser, setCurrentUser] = useState(null);

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
    if (u.nim && u.nim.trim()) return `nim_${u.nim.trim()}`;
    if (u.email && u.email.trim()) return `email_${normalizeEmail(u.email)}`;
    return `name_${(u.name || '').trim().toLowerCase()}`;
  };

  // Initialize DB from LocalStorage
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
            
            // Also clean active session user
            const savedUser = sessionStorage.getItem('hima_current_user');
            if (savedUser) {
              const parsedUser = JSON.parse(savedUser);
              if (parsedUser) {
                delete parsedUser.phone;
                sessionStorage.setItem('hima_current_user', JSON.stringify(parsedUser));
              }
            }
          }
          
          // Merge using NIM as primary unique identifier to avoid duplicates when user changes email/name
          const userMap = new Map();
          DEFAULT_USERS.forEach(u => {
            if (u) {
              const key = getUserKey(u);
              if (key) userMap.set(key, u);
            }
          });
          parsed.forEach(u => {
            if (u) {
              const key = getUserKey(u);
              if (key) {
                const defaultUser = userMap.get(key) || {};
                userMap.set(key, { ...defaultUser, ...u });
              }
            }
          });
          loadedUsers = Array.from(userMap.values());
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
          (u.nim && parsedUser.nim && u.nim.trim() === parsedUser.nim.trim()) ||
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

    // Listen for storage events (e.g. Profile edited in another tab or component)
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
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const register = (name, nim, phone, password) => {
    return new Promise((resolve, reject) => {
      const generatedEmail = `${name.trim()}@einsten.com`;
      const emailExists = users.some(u => normalizeEmail(u.email) === normalizeEmail(generatedEmail));
      const nimExists = users.some(u => u.nim === nim);
      const phoneExists = users.some(u => u.phone === phone);

      if (emailExists) {
        return reject(new Error('Nama lengkap ini sudah terdaftar sebagai akun (email sudah ada)!'));
      }
      if (nimExists) {
        return reject(new Error('NIM sudah terdaftar!'));
      }
      if (phone && phoneExists) {
        return reject(new Error('Nomor telepon sudah terdaftar!'));
      }

      const newUser = {
        name,
        nim,
        phone,
        email: generatedEmail,
        password,
        role: 'Anggota Biasa',
        status: 'Active'
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('hima_users', JSON.stringify(updatedUsers));
      resolve(newUser);
    });
  };

  const login = (emailOrNim, password) => {
    return new Promise((resolve, reject) => {
      const inputStr = (emailOrNim || '').trim();
      const user = users.find(
        u => (
          normalizeEmail(u.email) === normalizeEmail(inputStr) ||
          (u.nim && u.nim.trim() === inputStr) ||
          (u.name && u.name.trim().toLowerCase() === inputStr.toLowerCase())
        ) && u.password === (password || '').trim()
      );

      if (!user) {
        return reject(new Error('Email atau Password salah!'));
      }

      if (user.status === 'Pending') {
        // Auto-activate account
        user.status = 'Active';
        const updatedUsers = users.map(u => 
          (u.nim && user.nim && u.nim.trim() === user.nim.trim()) ||
          normalizeEmail(u.email) === normalizeEmail(user.email) 
            ? { ...u, status: 'Active' } 
            : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('hima_users', JSON.stringify(updatedUsers));
      }

      if (user.status === 'Rejected') {
        return reject(new Error('Login gagal. Akun Anda telah ditolak oleh Admin BPH.'));
      }

      setCurrentUser(user);
      sessionStorage.setItem('hima_current_user', JSON.stringify(user));
      resolve(user);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('hima_current_user');
  };

  // Admin and management actions
  const updateUserStatus = (emailOrNim, status) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && u.nim.trim() === searchTarget)) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // If active user is updated, keep their local state synchronized
    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && currentUser.nim.trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, status };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const updateUserRole = (emailOrNim, role) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && u.nim.trim() === searchTarget)) {
        return { ...u, role };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Synchronize if current logged in user role was changed
    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && currentUser.nim.trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, role };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
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
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && u.nim.trim() === searchTarget)) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));
  };

  const updateUserProfile = (emailOrNim, updates) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && u.nim.trim() === searchTarget)) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && currentUser.nim.trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, ...updates };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const updateUserPhone = (emailOrNim, phone) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.map(u => {
      if ((u.email && normalizeEmail(u.email) === normalizedTarget) || (u.nim && u.nim.trim() === searchTarget)) {
        return { ...u, phone };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Update current user if it matches
    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && currentUser.nim.trim() === searchTarget))) {
      const updatedSelf = { ...currentUser, phone };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const deleteAccount = (emailOrNim) => {
    const searchTarget = (emailOrNim || '').trim();
    const normalizedTarget = normalizeEmail(searchTarget);
    const updatedUsers = users.filter(u => 
      (u.email && normalizeEmail(u.email) !== normalizedTarget) && 
      (u.nim ? u.nim.trim() !== searchTarget : true)
    );
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && ((currentUser.email && normalizeEmail(currentUser.email) === normalizedTarget) || (currentUser.nim && currentUser.nim.trim() === searchTarget))) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      register,
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
