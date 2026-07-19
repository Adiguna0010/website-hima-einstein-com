import express from 'express';
import cors from 'cors';
import pino from 'pino';
import QRCode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock = null;
let qrCodeRaw = '';
let qrCodeDataUrl = '';
let connectionStatus = 'disconnected'; // 'disconnected' | 'connecting' | 'connected'
let connectedUserPhone = null;

const logger = pino({ level: 'silent' });

// Function to format Indonesian phone numbers (e.g. 08123456789 -> 628123456789@s.whatsapp.net)
function formatJid(phone) {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  if (!clean.endsWith('@s.whatsapp.net')) {
    return clean + '@s.whatsapp.net';
  }
  return clean;
}

async function connectToWhatsApp() {
  connectionStatus = 'connecting';
  const authFolder = path.join(__dirname, 'auth_info_baileys');
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['HIMA EINSTEN Gateway', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeRaw = qr;
      qrCodeDataUrl = await QRCode.toDataURL(qr);
      connectionStatus = 'connecting';
      console.log('\n======================================================');
      console.log('📱 SCAN QR CODE WA GATEWAY DI BAWAH INI / BUKA HTTP://LOCALHOST:5001/QR');
      console.log('======================================================\n');
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      connectionStatus = 'disconnected';
      qrCodeRaw = '';
      qrCodeDataUrl = '';
      connectedUserPhone = null;

      console.log(`❌ Koneksi WA Terputus (Reason code: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(() => {
          connectToWhatsApp();
        }, 3000);
      }
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      qrCodeRaw = '';
      qrCodeDataUrl = '';
      connectedUserPhone = sock.user?.id ? sock.user.id.split(':')[0] : 'Aktif';
      console.log('\n======================================================');
      console.log(`✅ WHATSAPP GATEWAY BERHASIL TERHUBUNG! Nomor: ${connectedUserPhone}`);
      console.log('======================================================\n');
    }
  });
}

// REST API Endpoints

// 1. Status Endpoint
app.get('/status', (req, res) => {
  res.json({
    status: connectionStatus,
    phone: connectedUserPhone,
    hasQr: !!qrCodeRaw,
    timestamp: new Date().toISOString()
  });
});

// 2. QR Code Web Interface
app.get('/qr', (req, res) => {
  if (connectionStatus === 'connected') {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp Gateway HIMA EINSTEN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; background: #0f172a; color: white; text-align: center; }
          .card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 0.5rem; }
          h2 { margin: 0.5rem 0; color: #10b981; }
          p { color: #94a3b8; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h2>WhatsApp Terhubung!</h2>
          <p>Nomor Terhubung: <strong>${connectedUserPhone || 'Aktif'}</strong></p>
          <p>Gateway HIMA EINSTEN siap menerima & mengirimkan kode OTP secara riil.</p>
        </div>
      </body>
      </html>
    `);
  }

  if (!qrCodeDataUrl) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menyiapkan QR Code...</title>
        <meta http-equiv="refresh" content="2">
        <style>
          body { font-family: system-ui, sans-serif; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; background: #0f172a; color: white; text-align: center; }
        </style>
      </head>
      <body>
        <div>
          <h2>⏳ Menyiapkan Server WhatsApp...</h2>
          <p>Mohon tunggu beberapa detik, halaman akan memuat ulang otomatis.</p>
        </div>
      </body>
      </html>
    `);
  }

  return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Scan QR Code WhatsApp Gateway</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="refresh" content="5">
      <style>
        body { font-family: system-ui, sans-serif; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; background: #0f172a; color: white; text-align: center; }
        .card { background: #1e293b; padding: 2rem; border-radius: 1.5rem; border: 1px solid #334155; max-width: 380px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        img { border-radius: 0.75rem; border: 4px solid white; background: white; margin: 1rem 0; width: 240px; height: 240px; }
        h3 { margin: 0; color: #f59e0b; }
        p { color: #94a3b8; font-size: 0.85rem; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div class="card">
        <h3>📱 SCAN QR CODE WHATSAPP</h3>
        <p>Buka WhatsApp di HP Anda -> Perangkat Tertaut -> Tautkan Perangkat</p>
        <img src="${qrCodeDataUrl}" alt="QR Code WhatsApp" />
        <p><small>Halaman otomatis diperbarui secara berkala.</small></p>
      </div>
    </body>
    </html>
  `);
});

// 3. Send OTP Endpoint
app.post('/send-otp', async (req, res) => {
  try {
    const { phone, code, message } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, reason: 'Nomor telepon wajib diisi.' });
    }

    if (connectionStatus !== 'connected' || !sock) {
      return res.status(503).json({
        success: false,
        reason: 'WhatsApp Gateway belum terhubung. Silakan scan QR code di server terlebih dahulu.'
      });
    }

    const jid = formatJid(phone);
    const textMessage = message || `Kode OTP verifikasi HIMA EINSTEN Anda adalah: ${code}. Gunakan kode ini untuk melanjutkan pendaftaran/pemulihan akun Anda.`;

    const result = await sock.sendMessage(jid, { text: textMessage });

    console.log(`📩 OTP [${code}] berhasil dikirim ke ${phone} (${jid})`);
    return res.json({
      success: true,
      messageId: result.key.id,
      target: phone
    });

  } catch (error) {
    console.error('Error sending WA OTP:', error);
    return res.status(500).json({
      success: false,
      reason: error.message || 'Gagal mengirimkan pesan via WhatsApp.'
    });
  }
});

// Start Express server and connect WhatsApp socket
app.listen(PORT, () => {
  console.log(`🚀 WA Gateway HTTP Server berjalan di http://localhost:${PORT}`);
  connectToWhatsApp().catch(err => console.error('Failed to initialize Baileys:', err));
});
