import React, { useState } from 'react';
import { X, QrCode, Upload, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, totalPrice, clearCart } = useCart();
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
    let text = `Halo Admin Danus HIMA EINSTEIN! 🌟\n\n`;
    text += `Saya ingin melakukan pemesanan merchandise resmi:\n`;
    cart.forEach(item => {
      text += `- ${item.name} (${item.quantity}x) : Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    text += `\n*Total Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n`;
    text += `*Bukti Pembayaran:* Terlampir (File: ${proofFile.name})\n\n`;
    text += `Mohon konfirmasi pesanan saya. Terima kasih!`;

    const waNumber = '628123456789'; // Official HIMA Admin WA
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="glass-glow rounded-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh] text-slate-100 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-electricCyan uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-5 h-5" /> CHECKOUT SUMMARY
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order items */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Detail Pesanan</h4>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 divide-y divide-white/5">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 text-sm text-slate-300">
                  <span>{item.name} <span className="text-xs text-slate-500">(x{item.quantity})</span></span>
                  <span className="font-medium text-slate-200">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 font-bold text-sm">
              <span>TOTAL PEMBAYARAN:</span>
              <span className="text-limeGreen text-base">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* QRIS section */}
          <div className="flex flex-col items-center p-4 bg-obsidian-deep/50 border border-white/5 rounded-xl space-y-3">
            <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center relative shadow-lg">
              {/* QR Image Placeholder / Real QRIS */}
              <img 
                src="/Media Einsten/Media Umum/logo kabinet hitam (vertical).png" 
                alt="QRIS HIMA EINSTEIN" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // If QR is missing, show mockup QR code
                  e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DUMMY_HIMA_EINSTEIN_QRIS";
                }}
              />
            </div>
            <p className="text-center text-xs text-slate-400 leading-normal max-w-xs">
              Silakan scan QRIS di atas untuk melakukan transfer pembayaran resmi HIMA EINSTEIN.
            </p>
          </div>

          {/* Upload Receipt */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Bukti Pembayaran</h4>
            
            {/* Drag & Drop Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('receipt-input').click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-electricCyan bg-electricBlue/10' 
                  : proofFile 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
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
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Bukti Transfer Terpilih!</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{proofFile.name}</p>
                    <p className="text-[10px] text-slate-500">({(proofFile.size / 1024).toFixed(1)} KB)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">Klik atau seret gambar bukti pembayaran ke sini</p>
                    <p className="text-xs text-slate-500">Mendukung format PNG, JPG, JPEG (Max. 2MB)</p>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/5 bg-obsidian-deep/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleCheckout}
            disabled={!proofFile}
            className={`px-5 py-2 rounded-xl text-sm font-bold text-obsidian flex items-center gap-1.5 transition-all ${
              proofFile 
                ? 'bg-limeGreen hover:brightness-110 active:scale-95' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Instant Checkout ke WA
          </button>
        </div>
      </div>
    </div>
  );
}
