import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    name: 'M. Iqbal Nur Huda',
    nim: '022400042',
    email: 'M. Iqbal Nur Huda@einsten.com',
    password: '022400042',
    role: 'Master Admin',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/BPH/Kahim_M. Iqbal Nur Huda - 022400042.JPG',
    status: 'Active'
  },
  {
    name: 'Adiguna Nugroho Halomoan',
    nim: '022400025',
    email: 'Adiguna Nugroho Halomoan@einsten.com',
    password: '022400025',
    role: 'Operator Ristek',
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
    role: 'Operator Logistik',
    photo: '/Media/Pengurus Hima Kabinet Photisma 2026/Aset Dan Logistik/Kepala Divisi Aset dan Logistik_Rakan Ibrahim Widjisasono - 022400031.JPG',
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
    name: 'Regular Member',
    nim: '240055',
    email: 'member@einsten.com',
    password: 'user123',
    role: 'Anggota Biasa',
    status: 'Active'
  },
  {
    name: 'Calon Anggota',
    nim: '240066',
    email: 'calon@einsten.com',
    password: 'user123',
    role: 'Anggota Biasa',
    status: 'Pending'
  },
  {
    name: 'Bendahara Umum',
    nim: '022400099',
    email: 'bendahara@einsten.com',
    password: 'bendahara123',
    role: 'Bendahara Umum',
    status: 'Active'
  },
  {
    name: 'Relvina',
    nim: '022400039',
    email: 'relvina@einsten.com',
    password: '022400039',
    role: 'Bendahara Umum',
    status: 'Active'
  },
  {
    name: 'Rizkiana Ramadhani',
    nim: '022500046',
    email: 'rizkiana@einsten.com',
    password: '022500046',
    role: 'Bendahara Umum',
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
          
          // Merge to ensure new default accounts are loaded while preserving registered accounts
          const userMap = new Map();
          parsed.forEach(u => {
            if (u && u.email) {
              userMap.set(normalizeEmail(u.email), u);
            }
          });
          DEFAULT_USERS.forEach(u => {
            if (u && u.email) {
              userMap.set(normalizeEmail(u.email), u);
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

    localStorage.setItem('hima_users', JSON.stringify(loadedUsers));
    setUsers(loadedUsers);

    const savedUser = sessionStorage.getItem('hima_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
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
        status: 'Pending'
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('hima_users', JSON.stringify(updatedUsers));
      resolve(newUser);
    });
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      const user = users.find(
        u => normalizeEmail(u.email) === normalizeEmail(email) && u.password === password
      );

      if (!user) {
        return reject(new Error('Email atau Password salah!'));
      }

      if (user.status === 'Pending') {
        return reject(new Error('Login gagal. Akun Anda masih dalam status PENDING menunggu persetujuan Admin BPH.'));
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
  const updateUserStatus = (email, status) => {
    const updatedUsers = users.map(u => {
      if (normalizeEmail(u.email) === normalizeEmail(email)) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // If active user is updated, keep their local state synchronized
    if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(email)) {
      const updatedSelf = { ...currentUser, status };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const updateUserRole = (email, role) => {
    const updatedUsers = users.map(u => {
      if (normalizeEmail(u.email) === normalizeEmail(email)) {
        return { ...u, role };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Synchronize if current logged in user role was changed
    if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(email)) {
      const updatedSelf = { ...currentUser, role };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const sendOTP = async (phone, code) => {
    const gatewayUrl = localStorage.getItem('self_hosted_gateway_url') || 'http://localhost:5001';
    
    // 1. Try Self-Hosted WhatsApp Gateway (Baileys Node.js)
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
      console.log('Self-Hosted Gateway unavailable, trying Fonnte fallback...', err.message);
    }

    // 2. Fallback to Fonnte API Gateway if token is set
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

    // 3. Fallback to Simulation Mode if all gateways fail/offline
    console.log(`[SIMULASI OTP] Mengirim OTP ke ${phone}: ${code}`);
    return { 
      success: false, 
      mode: 'simulation', 
      code, 
      reason: 'Server WA Gateway (Self-Hosted & Fonnte) sedang offline/terputus' 
    };
  };

  const updateUserPassword = (email, newPassword) => {
    const updatedUsers = users.map(u => {
      if (normalizeEmail(u.email) === normalizeEmail(email)) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));
  };

  const updateUserProfile = (email, updates) => {
    const updatedUsers = users.map(u => {
      if (normalizeEmail(u.email) === normalizeEmail(email)) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(email)) {
      const updatedSelf = { ...currentUser, ...updates };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const updateUserPhone = (email, phone) => {
    const updatedUsers = users.map(u => {
      if (normalizeEmail(u.email) === normalizeEmail(email)) {
        return { ...u, phone };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Update current user if it matches
    if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(email)) {
      const updatedSelf = { ...currentUser, phone };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      register,
      login,
      logout,
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
