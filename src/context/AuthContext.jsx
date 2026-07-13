import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    name: 'Admin BPH',
    nim: '197001',
    email: 'admin@einstein.com',
    password: 'admin123',
    role: 'Master Admin',
    status: 'Active'
  },
  {
    name: 'Dian Ristek',
    nim: '240011',
    email: 'dian@einstein.com',
    password: 'user123',
    role: 'Operator Ristek',
    status: 'Active'
  },
  {
    name: 'Budi Danus',
    nim: '240022',
    email: 'budi@einstein.com',
    password: 'user123',
    role: 'Operator Danus',
    status: 'Active'
  },
  {
    name: 'Ahmad Logistik',
    nim: '240033',
    email: 'ahmad@einstein.com',
    password: 'user123',
    role: 'Operator Logistik',
    status: 'Active'
  },
  {
    name: 'Siti Sekum',
    nim: '240044',
    email: 'siti@einstein.com',
    password: 'user123',
    role: 'Sekretaris Umum',
    status: 'Active'
  },
  {
    name: 'Regular Member',
    nim: '240055',
    email: 'member@einstein.com',
    password: 'user123',
    role: 'Anggota Biasa',
    status: 'Active'
  },
  {
    name: 'Calon Anggota',
    nim: '240066',
    email: 'calon@einstein.com',
    password: 'user123',
    role: 'Anggota Biasa',
    status: 'Pending'
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize DB from LocalStorage
  useEffect(() => {
    const localUsers = localStorage.getItem('hima_users');
    if (localUsers) {
      setUsers(JSON.parse(localUsers));
    } else {
      localStorage.setItem('hima_users', JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }

    const savedUser = localStorage.getItem('hima_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const register = (name, nim, email, password) => {
    return new Promise((resolve, reject) => {
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      const nimExists = users.some(u => u.nim === nim);

      if (emailExists) {
        return reject(new Error('Email sudah terdaftar!'));
      }
      if (nimExists) {
        return reject(new Error('NIM sudah terdaftar!'));
      }

      const newUser = {
        name,
        nim,
        email: email.toLowerCase(),
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
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
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
      localStorage.setItem('hima_current_user', JSON.stringify(user));
      resolve(user);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hima_current_user');
  };

  // Admin and management actions
  const updateUserStatus = (email, status) => {
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // If active user is updated, keep their local state synchronized
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedSelf = { ...currentUser, status };
      setCurrentUser(updatedSelf);
      localStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
    }
  };

  const updateUserRole = (email, role) => {
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, role };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('hima_users', JSON.stringify(updatedUsers));

    // Synchronize if current logged in user role was changed
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedSelf = { ...currentUser, role };
      setCurrentUser(updatedSelf);
      localStorage.setItem('hima_current_user', JSON.stringify(updatedSelf));
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
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
