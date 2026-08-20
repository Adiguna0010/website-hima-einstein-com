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
    const { phone, message } = body;

    const targetPhone = phone || '6282171748617';
    if (!message) {
      return res.status(400).json({ success: false, reason: 'Pesan wajib diisi.' });
    }

    const token = process.env.FONNTE_TOKEN || 'oAkLBXzaU41RszNf6j78';

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        target: targetPhone,
        message: message
      })
    });

    const result = await response.json();
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      reason: error.message || 'Gagal mengirim pesan WhatsApp' 
    });
  }
}
