// Vercel Serverless Function: /api/users
// Persistent Cloud Synchronization for HIMA EINSTEN Users

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

// Helper: Normalize Email
const normalizeEmail = (emailStr) => {
  if (!emailStr) return '';
  return emailStr
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/einsten\.com$/, 'einsten.com');
};

// Helper: User unique identifier key
const getUserKey = (u) => {
  if (!u) return '';
  if (u.nim && String(u.nim).trim()) return `nim_${String(u.nim).trim()}`;
  if (u.email && u.email.trim()) return `email_${normalizeEmail(u.email)}`;
  return `name_${(u.name || '').trim().toLowerCase()}`;
};

// Primary Storage Object ID on api.restful-api.dev
let CLOUD_OBJECT_ID = process.env.CLOUD_STORE_ID || 'ff8081819ff5b11001a0333097b60c32';
let inMemoryUsersCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 3000; // 3s in-memory cache

// Fetch data from Cloud Store
async function fetchCloudData() {
  const now = Date.now();
  if (inMemoryUsersCache && (now - lastCacheTime < CACHE_TTL_MS)) {
    return inMemoryUsersCache;
  }

  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        const users = Array.isArray(data.data.users) ? data.data.users : [];
        const login_logs = Array.isArray(data.data.login_logs) ? data.data.login_logs : [];
        inMemoryUsersCache = { users, login_logs };
        lastCacheTime = now;
        return inMemoryUsersCache;
      }
    }

    // If not found (404), re-initialize the store object
    if (res.status === 404) {
      console.log('Object not found in store, re-creating cloud store...');
      const createRes = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'hima_einsten_users_db',
          data: { users: [], login_logs: [] }
        })
      });
      if (createRes.ok) {
        const createData = await createRes.json();
        if (createData.id) {
          CLOUD_OBJECT_ID = createData.id;
          inMemoryUsersCache = { users: [], login_logs: [] };
          lastCacheTime = now;
          return inMemoryUsersCache;
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch from cloud store:', err.message);
  }

  return inMemoryUsersCache || { users: [], login_logs: [] };
}

// Save data object to Cloud Store
async function saveCloudData(dataObj) {
  inMemoryUsersCache = dataObj;
  lastCacheTime = Date.now();

  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'hima_einsten_users_db',
        data: dataObj
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok && res.status === 404) {
      // Recreate if lost
      const createRes = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'hima_einsten_users_db',
          data: dataObj
        })
      });
      if (createRes.ok) {
        const createData = await createRes.json();
        if (createData.id) CLOUD_OBJECT_ID = createData.id;
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to save to cloud store:', err.message);
    return false;
  }
}

// Merge cloud registered users with DEFAULT_USERS
function mergeUsers(cloudUsers) {
  const map = new Map();
  // 1. Seed defaults
  DEFAULT_USERS.forEach(u => {
    const key = getUserKey(u);
    if (key) map.set(key, { ...u });
  });

  // 2. Overlay / add cloud users
  if (Array.isArray(cloudUsers)) {
    cloudUsers.forEach(u => {
      if (!u) return;
      const key = getUserKey(u);
      if (key) {
        const existing = map.get(key) || {};
        map.set(key, { ...existing, ...u });
      }
    });
  }

  return Array.from(map.values());
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cloudData = await fetchCloudData();
    const cloudUsers = cloudData.users || [];
    const cloudLogs = cloudData.login_logs || [];

    // ── 1. GET: Fetch all users & login logs ──
    if (req.method === 'GET') {
      const allUsers = mergeUsers(cloudUsers);
      return res.status(200).json({
        success: true,
        users: allUsers,
        total: allUsers.length,
        login_logs: cloudLogs,
        timestamp: new Date().toISOString()
      });
    }

    // ── 2. POST: Register new user OR Record login log ──
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

      // Sub-action: Record Login Log
      if (body.action === 'login_log' || body.log) {
        const logItem = body.log || body;
        const newLog = {
          id: logItem.id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: logItem.name || 'Anggota',
          nim: logItem.nim || '-',
          email: logItem.email || '-',
          role: logItem.role || 'Anggota Biasa',
          timestamp: logItem.timestamp || Date.now(),
          timeString: logItem.timeString || new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          device: logItem.device || 'Web Browser',
          status: logItem.status || 'Success'
        };

        // Keep last 100 logs
        const updatedLogs = [newLog, ...cloudLogs.filter(l => l.id !== newLog.id)].slice(0, 100);

        // Also update lastLogin on the user
        const targetKey = getUserKey({ nim: newLog.nim, email: newLog.email, name: newLog.name });
        let userUpdated = false;
        const updatedCloudUsers = cloudUsers.map(u => {
          if (getUserKey(u) === targetKey) {
            userUpdated = true;
            return { ...u, lastLogin: newLog.timeString };
          }
          return u;
        });

        if (!userUpdated && newLog.email) {
          updatedCloudUsers.push({
            name: newLog.name,
            nim: newLog.nim,
            email: newLog.email,
            role: newLog.role,
            lastLogin: newLog.timeString
          });
        }

        await saveCloudData({ users: updatedCloudUsers, login_logs: updatedLogs });
        const finalAllUsers = mergeUsers(updatedCloudUsers);

        return res.status(201).json({
          success: true,
          message: 'Log login berhasil dicatat ke cloud database!',
          log: newLog,
          login_logs: updatedLogs,
          users: finalAllUsers
        });
      }

      // Action: Register new user / Bulk users save
      if (body.users && Array.isArray(body.users)) {
        await saveCloudData({ users: body.users, login_logs: cloudLogs });
        const finalAllUsers = mergeUsers(body.users);
        return res.status(200).json({
          success: true,
          users: finalAllUsers,
          login_logs: cloudLogs
        });
      }

      const { name, nim, phone, password, role, status } = body;
      if (!name || !nim) {
        return res.status(400).json({ success: false, message: 'Nama dan NIM wajib diisi.' });
      }

      const allUsers = mergeUsers(cloudUsers);
      const generatedEmail = `${name.trim()}@einsten.com`;
      const emailExists = allUsers.some(u => normalizeEmail(u.email) === normalizeEmail(generatedEmail));
      const nimExists = allUsers.some(u => String(u.nim).trim() === String(nim).trim());
      const phoneExists = phone ? allUsers.some(u => u.phone && String(u.phone).trim() === String(phone).trim()) : false;

      if (emailExists) {
        return res.status(409).json({ success: false, message: 'Nama lengkap ini sudah terdaftar sebagai akun (email sudah ada)!' });
      }
      if (nimExists) {
        return res.status(409).json({ success: false, message: 'NIM sudah terdaftar!' });
      }
      if (phone && phoneExists) {
        return res.status(409).json({ success: false, message: 'Nomor WhatsApp sudah terdaftar!' });
      }

      const newUser = {
        name: name.trim(),
        nim: String(nim).trim(),
        phone: phone ? String(phone).trim() : '',
        email: generatedEmail,
        password: password || String(nim).trim(),
        role: role || 'Anggota Biasa',
        status: status || 'Active',
        createdAt: new Date().toISOString()
      };

      const updatedCloudUsers = [...cloudUsers, newUser];
      await saveCloudData({ users: updatedCloudUsers, login_logs: cloudLogs });

      const finalAllUsers = mergeUsers(updatedCloudUsers);

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil dan tersimpan di database cloud!',
        user: newUser,
        users: finalAllUsers,
        login_logs: cloudLogs
      });
    }

    // ── 3. PUT: Update user (Role, Status, Profile, Password, Phone) ──
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { target, updates, status, role, password, phone, profile } = body;

      const identifier = (target || body.email || body.nim || '').trim();
      if (!identifier) {
        return res.status(400).json({ success: false, message: 'Target identifier (email atau NIM) wajib diisi.' });
      }

      const allUsers = mergeUsers(cloudUsers);
      const normalizedTarget = normalizeEmail(identifier);

      const existingUser = allUsers.find(u => 
        (u.email && normalizeEmail(u.email) === normalizedTarget) ||
        (u.nim && String(u.nim).trim() === identifier)
      );

      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      const mergedUpdates = {
        ...existingUser,
        ...(updates || {}),
        ...(profile || {})
      };
      if (status !== undefined) mergedUpdates.status = status;
      if (role !== undefined) mergedUpdates.role = role;
      if (password !== undefined) mergedUpdates.password = password;
      if (phone !== undefined) mergedUpdates.phone = phone;

      const targetKey = getUserKey(existingUser);
      let foundInCloud = false;
      const newCloudUsers = cloudUsers.map(u => {
        if (getUserKey(u) === targetKey) {
          foundInCloud = true;
          return { ...u, ...mergedUpdates };
        }
        return u;
      });

      if (!foundInCloud) {
        newCloudUsers.push(mergedUpdates);
      }

      await saveCloudData({ users: newCloudUsers, login_logs: cloudLogs });
      const finalAllUsers = mergeUsers(newCloudUsers);

      return res.status(200).json({
        success: true,
        message: 'Data pengguna berhasil diperbarui di cloud database!',
        user: mergedUpdates,
        users: finalAllUsers,
        login_logs: cloudLogs
      });
    }

    // ── 4. DELETE: Delete user OR Clear login logs ──
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const action = body.action || req.query.action;

      if (action === 'clear_logs') {
        await saveCloudData({ users: cloudUsers, login_logs: [] });
        return res.status(200).json({
          success: true,
          message: 'Seluruh riwayat login berhasil dibersihkan.',
          login_logs: []
        });
      }

      const identifier = (body.target || body.email || body.nim || req.query.target || req.query.email || req.query.nim || '').trim();
      if (!identifier) {
        return res.status(400).json({ success: false, message: 'Target identifier (email atau NIM) wajib diisi.' });
      }

      const normalizedTarget = normalizeEmail(identifier);
      const updatedCloudUsers = cloudUsers.filter(u => 
        (u.email && normalizeEmail(u.email) !== normalizedTarget) &&
        (u.nim ? String(u.nim).trim() !== identifier : true)
      );

      await saveCloudData({ users: updatedCloudUsers, login_logs: cloudLogs });
      const finalAllUsers = mergeUsers(updatedCloudUsers);

      return res.status(200).json({
        success: true,
        message: 'Pengguna berhasil dihapus dari cloud database.',
        users: finalAllUsers,
        login_logs: cloudLogs
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  } catch (error) {
    console.error('API /api/users Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
}
