export default async function handler(req, res) {
  // Set CORS headers
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { phone, code, message } = body;

    if (!phone) {
      return res.status(400).json({ success: false, reason: 'Nomor telepon wajib diisi.' });
    }

    const token = process.env.FONNTE_TOKEN || 'oAkLBXzaU41RszNf6j78';
    const textMessage = message || `Kode OTP verifikasi HIMA EINSTEN Anda adalah: ${code}. Gunakan kode ini untuk melanjutkan pendaftaran/pemulihan akun Anda.`;

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        target: phone,
        message: textMessage
      })
    });

    const result = await response.json();
    if (result.status === true) {
      return res.status(200).json({ success: true, mode: 'real', provider: 'fonnte', result });
    } else {
      return res.status(200).json({ 
        success: false, 
        mode: 'simulation', 
        code, 
        reason: result.reason || 'Device Fonnte terputus atau token tidak valid' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      mode: 'simulation', 
      reason: error.message || 'Gagal memproses pengiriman OTP' 
    });
  }
}
