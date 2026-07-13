import React, { useEffect, useState, useRef } from 'react';
import { X, QrCode, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScannerModal({ isOpen, onClose, activeToolId, activeToolName, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [selectedToolId, setSelectedToolId] = useState(activeToolId);
  const [scannerActive, setScannerActive] = useState(false);
  const qrScannerRef = useRef(null);
  const scannerContainerId = 'hima-qr-reader';

  const toolFallbackOptions = [
    { id: 'HIMA-MULT-002', name: 'Digital Multimeter Sanwa CD800a' },
    { id: 'HIMA-SOLD-005', name: 'Solder Station Hakko' },
    { id: 'HIMA-ARDU-011', name: 'Arduino Uno Starter Kit' },
  ];

  useEffect(() => {
    if (activeToolId) {
      setSelectedToolId(activeToolId);
    }
  }, [activeToolId]);

  useEffect(() => {
    if (isOpen && !successMsg) {
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

      // Give DOM time to render the scanner container
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode(scannerContainerId);
          qrScannerRef.current = html5QrCode;

          const config = { fps: 10, qrbox: { width: 220, height: 220 } };

          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText, decodedResult) => {
              // On success
              handleScanResult(decodedText);
            },
            (errorMessage) => {
              // Verbose logging of search failures is suppressed to prevent UI noise
            }
          );
          setCameraPermission('granted');
        } catch (err) {
          console.error('Camera startup error:', err);
          setErrorMsg('Akses kamera gagal atau tidak tersedia. Silakan gunakan input manual di bawah.');
          setCameraPermission('denied');
          setScannerActive(false);
        }
      }, 300);

    } catch (err) {
      console.error('Scanner init error:', err);
      setErrorMsg('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
      setCameraPermission('denied');
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
    // play mock beep audio using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // Beep frequency
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio Context beep not supported');
    }

    setSuccessMsg(`Berhasil memindai Kode: ${resultText}`);
    stopScanner();

    // Match code with tool list, fallback if none matches
    const matchedTool = toolFallbackOptions.find(t => t.id === resultText) || { id: resultText, name: activeToolName || 'Alat Lab Terpindai' };

    setTimeout(() => {
      onScanSuccess(matchedTool.id, matchedTool.name);
      setSuccessMsg('');
    }, 1500);
  };

  const handleSimulateScan = () => {
    handleScanResult(selectedToolId);
  };

  const handleManualSubmit = () => {
    const selectedItem = toolFallbackOptions.find(t => t.id === selectedToolId) || { id: selectedToolId, name: 'Alat Pilihan Manual' };
    onScanSuccess(selectedItem.id, selectedItem.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="glass-glow rounded-2xl w-full max-w-md overflow-hidden relative z-10 flex flex-col text-slate-100 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-electricCyan uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-5 h-5" /> BARCODE SCANNER
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-400">
            Arahkan kamera ponsel/laptop Anda ke Barcode/QR Code alat laboratorium.
          </p>

          {/* Scanner Box */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-obsidian border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
            {successMsg ? (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce mb-2" />
                <p className="text-sm font-semibold text-emerald-300">Scan Berhasil!</p>
                <p className="text-xs text-slate-300 mt-1">{successMsg}</p>
              </div>
            ) : null}

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
              <div className="flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                <Camera className="w-12 h-12 text-slate-600" />
                <span className="text-xs">Kamera dinonaktifkan</span>
              </div>
            )}
          </div>

          {/* Camera Access Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Fallback Manual Dropdown */}
          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
              Pilih Alat Secara Manual (Cadangan)
            </label>
            <select
              value={selectedToolId}
              onChange={(e) => setSelectedToolId(e.target.value)}
              className="w-full bg-obsidian-deep border border-obsidian-border rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-electricBlue transition-colors"
            >
              {toolFallbackOptions.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.id}: {tool.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-obsidian-deep/50 flex justify-between gap-3">
          <button
            onClick={handleSimulateScan}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
          >
            Simulasikan Scan (3 Detik)
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleManualSubmit}
              className="px-5 py-2 bg-gradient-to-r from-electricBlue to-electricCyan text-white rounded-xl text-xs font-bold shadow-[0_0_15px_-3px_rgba(0,82,255,0.4)] hover:brightness-110 transition-all"
            >
              Gunakan ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
