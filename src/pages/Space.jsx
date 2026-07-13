import React, { useState } from 'react';
import { Camera, Calendar, User, IdCard, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';

export default function Space({ showToast }) {
  const [instruments, setInstruments] = useState([
    {
      id: 'HIMA-MULT-002',
      name: 'Digital Multimeter Sanwa CD800a',
      status: 'Available',
      image: '📟',
      desc: 'Alat ukur parameter kelistrikan presisi tinggi untuk praktikum kelistrikan.'
    },
    {
      id: 'HIMA-SOLD-005',
      name: 'Solder Station Hakko',
      status: 'Borrowed',
      image: '🔥',
      desc: 'Solder station dengan kontrol panas digital konstan untuk perakitan PCB.'
    },
    {
      id: 'HIMA-ARDU-011',
      name: 'Arduino Uno Starter Kit',
      status: 'Available',
      image: '🔌',
      desc: 'Kit modul development mikrokontroler lengkap beserta modul sensor dasar.'
    }
  ]);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState('');
  const [activeToolName, setActiveToolName] = useState('');
  
  // Reservation Form State
  const [showForm, setShowForm] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerNim, setBorrowerNim] = useState('');
  const [selectedToolId, setSelectedToolId] = useState('');
  const [selectedToolName, setSelectedToolName] = useState('');

  const handleOpenScanner = (tool) => {
    setActiveToolId(tool.id);
    setActiveToolName(tool.name);
    setScannerOpen(true);
  };

  const handleScanSuccess = (scannedId, scannedName) => {
    setScannerOpen(false);
    setSelectedToolId(scannedId);
    setSelectedToolName(scannedName);
    setShowForm(true);
    showToast(`Scan Berhasil: ${scannedName} terpilih!`, 'success');
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!borrowerName || !borrowerNim || !selectedToolId) {
      showToast('Mohon lengkapi seluruh kolom formulir!', 'error');
      return;
    }

    // Build WA URL
    const text = `Halo Admin Logistik HIMPUNAN EINSTEN.COM! 📦\n\nSaya ingin mengajukan permohonan peminjaman alat laboratorium:\n- Nama Alat: ${selectedToolName}\n- ID Alat: ${selectedToolId}\n\nData Peminjam:\n- Nama: ${borrowerName}\n- NIM: ${borrowerNim}\n\n*Reservasi terdaftar melalui Portal Einstein Space.* Mohon konfirmasi pengambilan alat. Terima kasih!`;
    const waNumber = '6285175420692';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    // Reset Form
    setShowForm(false);
    setBorrowerName('');
    setBorrowerNim('');
  };

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-gold/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Layanan Praktikum & Riset</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEIN SPACE</h1>
        <p className="text-slate-555 text-xs sm:text-sm leading-relaxed font-light">
          Portal peminjaman instrumen laboratorium elektronika milik Himpunan. Scan Barcode/QR Code pada alat fisik untuk pengisian formulir instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Instruments status board */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-gold" /> Dashboard Ketersediaan Alat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instruments.map((inst) => (
              <div 
                key={inst.id} 
                className="p-6 bg-white border border-gold-border rounded-2xl flex flex-col justify-between text-left space-y-4 hover:border-gold/30 hover:bg-slate-50/50 transition-all shadow-sm relative overflow-hidden group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {inst.image}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                    inst.status === 'Available' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                      : 'bg-rose-55 text-rose-600 border-rose-500/20'
                  }`}>
                    {inst.status === 'Available' ? 'Tersedia' : 'Sedang Dipinjam'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-gold-dark transition-colors">{inst.name}</h4>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {inst.id}</span>
                  <p className="text-[11px] text-slate-500 leading-normal font-light">{inst.desc}</p>
                </div>

                {inst.status === 'Available' ? (
                  <button 
                    onClick={() => handleOpenScanner(inst)}
                    className="w-full py-2 bg-gold hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all mt-2 shadow-md shadow-gold/20"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" /> Pinjam via Scan
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full py-2 bg-slate-100 text-slate-400 font-semibold rounded-xl text-xs cursor-not-allowed mt-2 border border-slate-200"
                  >
                    Alat Penuh Dipinjam
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reservation form */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left flex items-center gap-1.5">
            <Calendar className="w-4.5 h-4.5 text-gold" /> Formulir Booking
          </h3>

          <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden min-h-[250px] flex flex-col justify-center text-slate-800">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>

            {showForm ? (
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Alat Yang Dipilih</span>
                  <p className="text-xs font-bold text-gold-dark truncate">{selectedToolName}</p>
                  <p className="text-[9px] font-mono text-slate-500">{selectedToolId}</p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nama Peminjam</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      placeholder="Nama Lengkap Anda"
                      value={borrowerName}
                      onChange={(e) => setBorrowerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">NIM Mahasiswa</label>
                  <div className="relative">
                    <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      placeholder="NIM Anda"
                      value={borrowerNim}
                      onChange={(e) => setBorrowerNim(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 shadow-gold/20"
                  >
                    Kirim WA <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Belum ada alat laboratorium yang dipilih. Silakan klik tombol <strong className="text-slate-800 font-bold">Pinjam via Scan</strong> pada alat yang ingin dipinjam terlebih dahulu.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Barcode Web camera Scanner Modal */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        activeToolId={activeToolId}
        activeToolName={activeToolName}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
