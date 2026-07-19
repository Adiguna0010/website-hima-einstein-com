import React, { useEffect, useState, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScannerModal({ isOpen, onClose, activeToolId, activeToolName, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const qrScannerRef = useRef(null);
  const scannerContainerId = 'hima-qr-reader';

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setScannerActive(true);

      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode(scannerContainerId);
          qrScannerRef.current = html5QrCode;

          const config = { fps: 10, qrbox: { width: 220, height: 220 } };

          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              handleScanResult(decodedText);
            },
            () => {
              // Suppress verbose scan failures
            }
          );
        } catch (err) {
          console.error('Camera startup error:', err);
          setErrorMsg('Akses kamera gagal atau tidak tersedia. Pastikan izin kamera telah diberikan di browser Anda.');
          setScannerActive(false);
        }
      }, 300);

    } catch (err) {
      console.error('Scanner init error:', err);
      setErrorMsg('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
      } catch (e) {
        console.error('Failed to stop scanner:', e);
      }
    }
    qrScannerRef.current = null;
    setScannerActive(false);
  };

  const handleScanResult = (resultText) => {
    // Play beep audio
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio Context not supported');
    }

    setSuccessMsg(`Berhasil memindai Kode: ${resultText}`);
    stopScanner();

    setTimeout(() => {
      onScanSuccess(resultText, activeToolName || 'Alat Lab Terpindai');
      setSuccessMsg('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white border border-gold-border shadow-xl rounded-2xl w-full max-w-md overflow-hidden relative z-10 flex flex-col text-slate-800 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gold-dark uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-5 h-5 text-gold" /> BARCODE SCANNER
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-500 text-left">
            Arahkan kamera ke <span className="font-semibold text-slate-700">Barcode / QR Code</span> yang tertempel pada alat laboratorium untuk melanjutkan peminjaman.
          </p>

          {/* Scanner Box */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
            {successMsg && (
              <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce mb-2" />
                <p className="text-sm font-semibold text-white">Scan Berhasil!</p>
                <p className="text-xs text-slate-100 mt-1">{successMsg}</p>
              </div>
            )}

            {/* Laser Line */}
            {scannerActive && !successMsg && (
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-rose-500 animate-pulse shadow-[0_0_10px_2px_rgba(239,68,68,0.7)] z-10" />
            )}

            {/* Html5Qrcode target div */}
            <div
              id={scannerContainerId}
              className={`w-full h-full object-cover ${scannerActive ? 'block' : 'hidden'}`}
            />

            {!scannerActive && !successMsg && (
              <div className="flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
                <Camera className="w-12 h-12 text-slate-300" />
                <span className="text-xs">Kamera dinonaktifkan</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
