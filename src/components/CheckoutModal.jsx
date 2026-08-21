import React, { useState } from 'react';
import { X, QrCode, Upload, CheckCircle2, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STATIC_QRIS = '00020101021126610014COM.GO-JEK.WWW01189360091438247187090210G8247187090303UMI51440014ID.CO.QRIS.WWW0215ID10264859626780303UMI5204573253033605802ID5916Hima Einsten.com6004AGAM61052618162070703A01630482E8';

function generateDynamicQRIS(staticQris, amount) {
  function crc16(str) {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
      let code = str.charCodeAt(c);
      crc ^= (code << 8);
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  let baseQris = staticQris.slice(0, -8);
  
  // Change Tag 01 from 11 (static) to 12 (dynamic)
  baseQris = baseQris.replace('010211', '010212');

  // Parse EMVCo tags to find Tag 54 safely by length
  let index = 0;
  let tag54Info = null;
  while (index < baseQris.length) {
    if (index + 4 > baseQris.length) break;
    let tag = baseQris.substring(index, index + 2);
    let len = parseInt(baseQris.substring(index + 2, index + 4), 10);
    if (isNaN(len)) break;
    if (tag === '54') {
      tag54Info = { index, len };
      break;
    }
    index += 4 + len;
  }

  // If Tag 54 was found, remove it safely
  if (tag54Info) {
    baseQris = baseQris.substring(0, tag54Info.index) + baseQris.substring(tag54Info.index + 4 + tag54Info.len);
  }

  // Construct Tag 54
  let amountStr = Math.round(amount).toString();
  let tag54 = '54' + amountStr.length.toString().padStart(2, '0') + amountStr;
  let newPayload = baseQris + tag54 + '6304';
  let checksum = crc16(newPayload);
  return newPayload + checksum;
}

export default function CheckoutModal({ isOpen, onClose, showToast }) {
  const { cart, totalPrice, clearCart } = useCart();
  const dynamicQris = generateDynamicQRIS(STATIC_QRIS, totalPrice);
  const [proofFile, setProofFile] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Validate type (JPG, PNG)
    const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validExtensions.includes(file.type)) {
      setErrorMsg('Hanya file bertipe JPG, JPEG, atau PNG yang diperbolehkan.');
      setProofFile(null);
      return;
    }

    // Validate size (max 2MB = 2097152 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal adalah 2MB.');
      setProofFile(null);
      return;
    }

    setProofFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCheckout = async () => {
    if (!proofFile) {
      setErrorMsg('Silakan unggah bukti transfer QRIS terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const customerName = buyerName.trim() || 'Pembeli Einsten Market';
    const customerPhone = buyerPhone.trim() || '-';
    const itemsSummary = cart.map(i => `${i.name} (${i.quantity}x)`).join(', ');

    // Build WA Message
    let text = `Halo Admin Danus hima einsten.com! 🌟\n\n`;
    text += `Ada pesanan merchandise baru dari Einsten Market:\n`;
    text += `- *Nama Pembeli:* ${customerName}\n`;
    if (customerPhone !== '-') {
      text += `- *WhatsApp Pembeli:* ${customerPhone}\n`;
    }
    text += `\n*Detail Pesanan:*\n`;
    cart.forEach(item => {
      text += `- ${item.name} (${item.quantity}x) : Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    text += `\n*Total Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n`;
    text += `*Bukti Pembayaran:* Terlampir (File: ${proofFile.name})\n`;
    text += `*Tanggal Pemesanan:* ${new Date().toLocaleDateString('id-ID')}\n\n`;
    text += `Mohon segera konfirmasi & tindak lanjuti pesanan ini. Terima kasih!`;

    const waNumber = '6281381644505'; // Official Admin Danus / Market (+62 813-8164-4505)

    // Save order in Danus Dashboard local storage
    try {
      const savedOrders = localStorage.getItem('hima_orders');
      const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
      const newOrder = {
        id: Date.now(),
        name: customerName,
        items: itemsSummary,
        total: totalPrice,
        file: proofFile.name,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('hima_orders', JSON.stringify([newOrder, ...ordersList]));

      // Save notification for Operator Danus
      const savedNotifs = localStorage.getItem('hima_notifications');
      const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        recipientEmail: 'danus@hima-einsten.com',
        message: `Pesanan Baru Masuk! ${customerName} memesan ${itemsSummary} (Total Rp ${totalPrice.toLocaleString('id-ID')}).`,
        read: false,
        timestamp: Date.now()
      };
      localStorage.setItem('hima_notifications', JSON.stringify([...notifsList, newNotif]));
    } catch (e) {
      console.error('Error saving order local data:', e);
    }

    // Direct background sending via serverless WhatsApp Gateway API (No browser popup / redirect)
    try {
      await fetch('/api/send-wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: waNumber, message: text })
      });
    } catch (err) {
      // Fallback direct request
      try {
        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': 'oAkLBXzaU41RszNf6j78',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ target: waNumber, message: text })
        });
      } catch (e) {
        console.error('WA background send fallback error:', e);
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    clearCart();
    if (showToast) {
      showToast('Pesanan berhasil dibuat & otomatis terkirim ke WhatsApp Admin Danus!', 'success');
    }
  };

  const handleCloseModal = () => {
    setIsSuccess(false);
    setProofFile(null);
    setBuyerName('');
    setBuyerPhone('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleCloseModal}
      />

      {/* Modal Box */}
      <div className="bg-white border border-gold-border shadow-xl rounded-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh] text-slate-800 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gold-dark uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold" /> CHECKOUT SUMMARY
          </h3>
          <button 
            onClick={handleCloseModal} 
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Pesanan Berhasil Diajukan!</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light max-w-md mx-auto">
                Detail pesanan dan bukti pembayaran Anda telah otomatis terkirim langsung ke WhatsApp Admin Danus (<strong>+62 813-8164-4505</strong>).
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Status Pesanan: <span className="text-amber-600 font-bold">Menunggu Verifikasi Admin</span></p>
              <p className="text-[11px] text-slate-500">Admin Danus akan segera memverifikasi bukti pembayaran dan memproses pesanan merchandise Anda.</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              Tutup & Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order items */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-left">Detail Pesanan</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 divide-y divide-slate-200">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 text-sm text-slate-700">
                      <span>{item.name} <span className="text-xs text-slate-450">(x{item.quantity})</span></span>
                      <span className="font-semibold text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-sm text-slate-800">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-gold-dark text-base">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Customer Info (Optional) */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-left">Informasi Pemesan (Opsional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    placeholder="Nomor WhatsApp"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* QRIS section */}
              <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="w-52 h-52 bg-white p-2 rounded-xl flex items-center justify-center relative shadow-md">
                  {/* QR Image Dynamic / Real QRIS */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dynamicQris)}`}
                    alt="QRIS HIMA EINSTEN.COM" 
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "/Media/QRIS/qris-hima-einsten.jpg";
                    }}
                  />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded">
                    NMID: ID1026485962678
                  </span>
                  <p className="text-center text-xs text-slate-500 leading-normal max-w-xs">
                    Silakan scan QRIS di atas untuk melakukan transfer pembayaran resmi <strong>hima einsten.com</strong>.
                  </p>
                </div>
              </div>

              {/* Upload Receipt */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-left">Bukti Pembayaran</h4>
                
                {/* Drag & Drop Area */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('receipt-input').click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-gold bg-gold/5' 
                      : proofFile 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : 'border-slate-200 hover:border-gold/30 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    id="receipt-input"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  
                  {proofFile ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-600">Bukti Transfer Terpilih!</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{proofFile.name}</p>
                        <p className="text-[10px] text-slate-500">({(proofFile.size / 1024).toFixed(1)} KB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Klik atau seret gambar bukti pembayaran ke sini</p>
                        <p className="text-xs text-slate-500">Mendukung format PNG, JPG, JPEG (Max. 2MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {errorMsg}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCheckout}
                disabled={!proofFile || isSubmitting}
                className={`px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all ${
                  proofFile && !isSubmitting
                    ? 'bg-gold hover:brightness-110 active:scale-95 shadow-md shadow-gold/20' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirimkan Pesanan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesanan Langsung</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
