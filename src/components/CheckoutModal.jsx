import React, { useState } from 'react';
import { X, QrCode, Upload, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STATIC_QRIS = '00020101021126610014COM.GO-JEK.WWW01189360091432097791970210G2097791970303UMI51440014ID.CO.QRIS.WWW0215ID10254006622310303UMI5204762953033605802ID5910At-Service6014KOTA TANGERANG61051515762070703A016304EC70';

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

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, totalPrice, clearCart } = useCart();
  const dynamicQris = generateDynamicQRIS(STATIC_QRIS, totalPrice);
  const [proofFile, setProofFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleCheckout = () => {
    if (!proofFile) {
      setErrorMsg('Silakan unggah bukti transfer QRIS terlebih dahulu.');
      return;
    }

    // Build WA Message
    let text = `Halo Admin Danus HIMPUNAN EINSTEN.COM! 🌟\n\n`;
    text += `Saya ingin melakukan pemesanan merchandise resmi:\n`;
    cart.forEach(item => {
      text += `- ${item.name} (${item.quantity}x) : Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    text += `\n*Total Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n`;
    text += `*Bukti Pembayaran:* Terlampir (File: ${proofFile.name})\n\n`;
    text += `Mohon konfirmasi pesanan saya. Terima kasih!`;

    const waNumber = '6285175420692'; // Official Admin WA
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white border border-gold-border shadow-xl rounded-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh] text-slate-800 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gold-dark uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold" /> CHECKOUT SUMMARY
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
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

          {/* QRIS section */}
          <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center relative shadow-md">
              {/* QR Image Placeholder / Real QRIS */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dynamicQris)}`}
                alt="QRIS HIMPUNAN EINSTEN.COM" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "/Media/QRIS/AT-Service.jpeg";
                }}
              />
            </div>
            <p className="text-center text-xs text-slate-500 leading-normal max-w-xs">
              Silakan scan QRIS di atas untuk melakukan transfer pembayaran resmi HIMPUNAN EINSTEN.COM.
            </p>
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
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleCheckout}
            disabled={!proofFile}
            className={`px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all ${
              proofFile 
                ? 'bg-gold hover:brightness-110 active:scale-95 shadow-md shadow-gold/20' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Instant Checkout ke WA
          </button>
        </div>
      </div>
    </div>
  );
}
