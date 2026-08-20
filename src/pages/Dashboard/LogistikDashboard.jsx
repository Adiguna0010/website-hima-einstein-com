import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Box, ToggleLeft, ToggleRight, Radio, ShieldCheck, Plus, Trash2, UserCheck, UserX, Users, FileText,
  QrCode, Upload, Download, FileSpreadsheet, Eye, X, Printer, CheckCircle2, Layers, AlertCircle
} from 'lucide-react';

export default function LogistikDashboard({ showToast }) {
  const [instruments, setInstruments] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  // QR Modal State
  const [selectedQrInstrument, setSelectedQrInstrument] = useState(null);
  const csvInputRef = useRef(null);
  const batchFileInputRef = useRef(null);

  // Form Mode: 'manual' (one-by-one) | 'batch' (spreadsheet table upload)
  const [regMode, setRegMode] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form states for single instrument
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formKey, setFormKey] = useState(Date.now());

  const DEFAULT_INSTRUMENTS = [
    {
      id: 'HIMA-ARDU-001',
      name: 'Arduino Uno R3',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Arduino Uno.webp',
      desc: 'Papan mikrokontroler berbasis ATmega328P untuk pengembangan IoT dan elektronika dasar.'
    },
    {
      id: 'HIMA-GERI-002',
      name: 'Mesin Gerinda Tangan',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Gerinda.png',
      desc: 'Mesin gerinda listrik pemotong logam, kayu, atau penghalus material proyek mekanik.'
    },
    {
      id: 'HIMA-SOLD-003',
      name: 'Solder Listrik',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Solder.jpg',
      desc: 'Solder tangan dengan pemanas cepat untuk perakitan dan penyolderan komponen kelistrikan.'
    },
    {
      id: 'HIMA-TIMA-004',
      name: 'Timah Solder (Roll)',
      status: 'Available',
      image: '/Media/Media Aset dan Logistik/Timah.jpg',
      desc: 'Kawat timah penyambung komponen elektro berkadar rosin flux optimal.'
    },
    {
      id: 'HIMA-BOR-005',
      name: 'Mesin Bor Tangan (Bor)',
      status: 'Available',
      image: '📦',
      desc: 'Alat bor tangan listrik serbaguna untuk melubangi PCB, logam, dan kayu praktikum.'
    }
  ];

  useEffect(() => {
    const loadData = () => {
      // Load instruments
      const savedInst = localStorage.getItem('hima_instruments');
      if (savedInst) {
        try {
          const parsed = JSON.parse(savedInst);
          const existingIds = new Set(parsed.map(i => i.id.toUpperCase()));
          const missingDefaults = DEFAULT_INSTRUMENTS.filter(d => !existingIds.has(d.id.toUpperCase()));
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults];
            localStorage.setItem('hima_instruments', JSON.stringify(merged));
            setInstruments(merged);
          } else {
            setInstruments(parsed);
          }
        } catch (e) {
          localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
          setInstruments(DEFAULT_INSTRUMENTS);
        }
      } else {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
        setInstruments(DEFAULT_INSTRUMENTS);
      }

      // Load borrow requests
      const savedReqs = localStorage.getItem('hima_borrow_requests');
      if (savedReqs) {
        try {
          setBorrowRequests(JSON.parse(savedReqs));
        } catch (e) {
          setBorrowRequests([]);
        }
      } else {
        setBorrowRequests([]);
      }
    };

    loadData();

    // Storage event listener for multi-tab real-time sync
    const handleStorageChange = (e) => {
      if (e.key === 'hima_instruments' || e.key === 'hima_borrow_requests') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const handleToggleStatus = (id) => {
    const updated = instruments.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === 'Available' ? 'Borrowed' : 'Available';
        return { ...inst, status: nextStatus };
      }
      return inst;
    });
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));
    showToast(`Status alat ${id} berhasil diubah!`, 'success');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast('Ukuran foto terlalu besar! Maksimal 1MB.', 'error');
        e.target.value = null;
        setNewImage('');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterInstrument = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newId.trim()) {
      showToast('Nama Alat dan Kode ID wajib diisi!', 'error');
      return;
    }

    const idExists = instruments.some(inst => inst.id.toLowerCase() === newId.trim().toLowerCase());
    if (idExists) {
      showToast(`Kode ID ${newId.trim().toUpperCase()} sudah digunakan!`, 'error');
      return;
    }

    const newInstrument = {
      id: newId.trim().toUpperCase(),
      name: newName.trim(),
      status: 'Available',
      image: newImage || '📦',
      desc: newDesc.trim() || 'Tidak ada deskripsi.'
    };

    const updated = [...instruments, newInstrument];
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));

    // Reset Form
    setNewName('');
    setNewId('');
    setNewImage('');
    setNewDesc('');
    setFormKey(Date.now());
    showToast(`Alat ${newName} berhasil didaftarkan!`, 'success');
  };

  const handleDeleteInstrument = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus alat ${id} dari inventaris?`)) {
      const updated = instruments.filter(inst => inst.id !== id);
      setInstruments(updated);
      localStorage.setItem('hima_instruments', JSON.stringify(updated));
      showToast(`Alat ${id} berhasil dihapus!`, 'success');
    }
  };

  // Spreadsheet (Excel / CSV) Parser & Bulk Import Handlers
  const handleSpreadsheetFile = (file) => {
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length <= 1) {
          showToast('File spreadsheet kosong atau tidak memiliki baris data!', 'error');
          setExcelPreviewData([]);
          return;
        }

        // Find headers from first row
        const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('kode'));
        const nameIdx = headers.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('alat') || h.includes('barang'));
        const descIdx = headers.findIndex(h => h.includes('deskripsi') || h.includes('desc') || h.includes('ket') || h.includes('spesifikasi'));
        const imgIdx = headers.findIndex(h => h.includes('foto') || h.includes('image') || h.includes('gambar') || h.includes('url'));
        const statusIdx = headers.findIndex(h => h.includes('status'));

        const finalNameIdx = nameIdx !== -1 ? nameIdx : (idIdx === 0 ? 1 : 0);

        const parsedItems = [];
        const existingIds = new Set(instruments.map(i => i.id.toUpperCase()));

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;
          
          const rawName = String(row[finalNameIdx] || '').trim();
          if (!rawName) continue;

          let rawId = (idIdx !== -1 && row[idIdx]) ? String(row[idIdx]).trim().toUpperCase() : `HIMA-ALAT-${Date.now().toString().slice(-4)}${i}`;
          let finalId = rawId;
          let counter = 1;
          while (existingIds.has(finalId.toUpperCase())) {
            finalId = `${rawId}-${counter}`;
            counter++;
          }
          existingIds.add(finalId.toUpperCase());

          const desc = (descIdx !== -1 && row[descIdx]) ? String(row[descIdx]).trim() : 'Alat laboratorium terdaftar via Spreadsheet.';
          const img = (imgIdx !== -1 && row[imgIdx]) ? String(row[imgIdx]).trim() : '📦';
          const status = (statusIdx !== -1 && String(row[statusIdx]).toLowerCase().includes('pinjam')) ? 'Borrowed' : 'Available';

          parsedItems.push({
            id: finalId,
            name: rawName,
            status,
            image: img,
            desc
          });
        }

        if (parsedItems.length === 0) {
          showToast('Tidak ada data alat valid yang ditemukan di file!', 'warning');
          setExcelPreviewData([]);
        } else {
          setExcelPreviewData(parsedItems);
          showToast(`Berhasil membaca ${parsedItems.length} alat dari file spreadsheet!`, 'success');
        }
      } catch (err) {
        console.error(err);
        showToast('Gagal membaca file spreadsheet: ' + err.message, 'error');
        setExcelPreviewData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkRegister = () => {
    if (!excelPreviewData || excelPreviewData.length === 0) {
      showToast('Pilih file spreadsheet terlebih dahulu!', 'warning');
      return;
    }

    const updatedList = [...instruments, ...excelPreviewData];
    setInstruments(updatedList);
    localStorage.setItem('hima_instruments', JSON.stringify(updatedList));
    showToast(`Sukses! ${excelPreviewData.length} alat berhasil didaftarkan sekaligus ke inventaris!`, 'success');
    
    // Reset preview
    setExcelFile(null);
    setExcelPreviewData([]);
    if (batchFileInputRef.current) batchFileInputRef.current.value = '';
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  // Download Sample Excel & CSV Template
  const handleDownloadTemplate = (format = 'xlsx') => {
    const templateData = [
      {
        Kode_ID: 'HIMA-OSCI-005',
        Nama_Alat: 'Oscilloscope Digital GW Instek',
        Deskripsi: 'Oscilloscope 2 channel 100MHz untuk pengukuran sinyal frekuensi',
        Status: 'Available',
        Foto: ''
      },
      {
        Kode_ID: 'HIMA-MULT-006',
        Nama_Alat: 'Digital Multimeter Sanwa',
        Deskripsi: 'Multimeter digital presisi tinggi untuk ukur tegangan dan resistansi',
        Status: 'Available',
        Foto: ''
      },
      {
        Kode_ID: 'HIMA-POW-007',
        Nama_Alat: 'DC Power Supply Linear 30V 5A',
        Deskripsi: 'Catu daya variabel teregulasi untuk pengujian modul IoT & sirkuit',
        Status: 'Available',
        Foto: ''
      },
      {
        Kode_ID: 'HIMA-FUNC-008',
        Nama_Alat: 'Function Generator DDS 25MHz',
        Deskripsi: 'Generator sinyal sinus, kotak, dan segitiga untuk kalibrasi',
        Status: 'Available',
        Foto: ''
      }
    ];

    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventaris_Alat');
      XLSX.writeFile(wb, 'template_inventaris_alat_hima.xlsx');
    } else {
      const csvContent = "Kode_ID,Nama_Alat,Deskripsi,Status,Foto\n" +
        templateData.map(r => `"${r.Kode_ID}","${r.Nama_Alat}","${r.Deskripsi}","${r.Status}","${r.Foto}"`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'template_inventaris_alat_hima.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleApproveRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    // Update Request Status to Approved
    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Approved' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    // Update Instrument Status to Borrowed
    const updatedInsts = instruments.map(inst => 
      inst.id === req.instrumentId ? { ...inst, status: 'Borrowed' } : inst
    );
    setInstruments(updatedInsts);
    localStorage.setItem('hima_instruments', JSON.stringify(updatedInsts));

    // Send notification bell alert to borrower
    const newNotification = {
      id: Date.now(),
      recipientEmail: req.userEmail || 'guest@einsten.com',
      message: `Peminjaman alat "${req.instrumentName}" Anda telah DISETUJUI (ACC) oleh Operator Logistik! Silakan ambil alat di Laboratorium.`,
      read: false,
      timestamp: Date.now()
    };
    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    notifsList.push(newNotification);
    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} disetujui (ACC)!`, 'success');
  };

  const handleRejectRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    // Update Request Status to Rejected
    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Rejected' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} ditolak.`, 'info');
  };

  const handleDeleteRequest = (reqId) => {
    const updatedReqs = borrowRequests.filter(r => r.id !== reqId);
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));
    showToast('Riwayat permohonan berhasil dihapus.', 'success');
  };

  // Stats calculation
  const activeBorrowersCount = new Set(
    borrowRequests
      .filter(r => r.status === 'Approved')
      .map(r => r.borrowerNim)
  ).size;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <Box className="w-3.5 h-3.5 text-gold" /> LOGISTIK OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Logistics Inventory & Borrowing Control
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan inventaris alat laboratorium otonom, approval peminjaman mahasiswa, dan monitoring logistik.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Total Inventaris</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">{instruments.length} Unit Alat</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Sedang Dipinjam</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {instruments.filter(i => i.status === 'Borrowed').length} Unit
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gold-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Peminjam Aktif</span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              {activeBorrowersCount} Orang
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid split: Left lists, Right forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Inventory & Borrow requests */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Inventory list */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4 text-gold" /> Daftar Inventaris Alat
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setRegMode('batch');
                    if (batchFileInputRef.current) batchFileInputRef.current.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark text-xs font-bold border border-gold/30 transition-all active:scale-95 cursor-pointer"
                  title="Upload daftar inventaris dari file Excel (.xlsx) / CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gold-dark" /> Upload Tabel Spreadsheet
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('xlsx')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer"
                  title="Unduh contoh template format Excel (.xlsx)"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" /> Template Excel
                </button>
              </div>
            </div>

            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Alat Lab</th>
                      <th className="px-6 py-4">Kode ID</th>
                      <th className="px-6 py-4">QR Code</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Tindakan Otoritas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-750">
                    {instruments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Belum ada alat terdaftar.</td>
                      </tr>
                    ) : (
                      instruments.map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http') || inst.image.startsWith('data:')) ? (
                              <img src={inst.image} alt={inst.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                            ) : (
                              <span className="text-2xl">{inst.image || '📦'}</span>
                            )}
                            <div>
                              <p className="font-bold text-slate-800">{inst.name}</p>
                              <p className="text-[10px] text-slate-500 font-light truncate max-w-[200px]">{inst.desc}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600 font-bold">{inst.id}</td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedQrInstrument(inst)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-gold/10 hover:text-gold-dark text-slate-700 text-[10px] font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer"
                              title="Lihat & Cetak QR Code Alat"
                            >
                              <QrCode className="w-3.5 h-3.5 text-gold-dark" />
                              <span>Lihat QR</span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              inst.status === 'Available' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                                : 'bg-rose-50 text-rose-600 border-rose-500/20'
                            }`}>
                              {inst.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(inst.id)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                                  inst.status === 'Available'
                                    ? 'bg-rose-50 text-rose-600 border-rose-500/20 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-500/20 hover:bg-emerald-100'
                                }`}
                                title={inst.status === 'Available' ? 'Set Dipinjam' : 'Set Tersedia'}
                              >
                                {inst.status === 'Available' ? (
                                  <>
                                    <ToggleLeft className="w-3.5 h-3.5 text-rose-600" /> Dipinjam
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> Tersedia
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteInstrument(inst.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                                title="Hapus Alat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Borrow requests approval list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gold" /> Permohonan Peminjaman (ACC Otoritas)
            </h3>
            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Peminjam</th>
                      <th className="px-6 py-4">Alat Lab</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-750">
                    {borrowRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Belum ada permohonan peminjaman masuk.</td>
                      </tr>
                    ) : (
                      borrowRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{req.borrowerName}</p>
                            {req.prodi && req.angkatan ? (
                              <p className="text-[10px] text-slate-500 font-mono">{req.prodi} ({req.angkatan})</p>
                            ) : (
                              <p className="text-[10px] text-slate-500 font-mono">NIM: {req.borrowerNim}</p>
                            )}
                            {req.phone && (
                              <p className="text-[10px] text-gold-dark font-mono">WA: {req.phone}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{req.instrumentName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {req.instrumentId}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-light">{req.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                              req.status === 'Pending'
                                ? 'bg-amber-50 text-amber-600 border-amber-500/20'
                                : req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20'
                                : 'bg-rose-50 text-rose-600 border-rose-500/20'
                            }`}>
                              {req.status === 'Pending' ? 'Menunggu ACC' : req.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {req.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 border border-emerald-500/25 hover:bg-emerald-500 hover:text-white transition-all text-emerald-600 font-bold rounded-xl text-[10px] active:scale-95"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> ACC
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-500/25 hover:bg-rose-500 hover:text-white transition-all text-rose-600 font-bold rounded-xl text-[10px] active:scale-95"
                                  >
                                    <UserX className="w-3.5 h-3.5" /> Tolak
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-all text-slate-500 font-semibold rounded-xl text-[10px] active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Register form & Batch Spreadsheet Uploader */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setRegMode('manual')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                regMode === 'manual'
                  ? 'bg-white text-gold-dark shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Input Manual
            </button>
            <button
              type="button"
              onClick={() => setRegMode('batch')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                regMode === 'batch'
                  ? 'bg-white text-gold-dark shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Spreadsheet
            </button>
          </div>

          {regMode === 'manual' ? (
            /* MANUAL SINGLE ITEM FORM */
            <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
              
              <div className="mb-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-gold" /> Daftarkan Alat Baru
                </h3>
                <p className="text-[11px] text-slate-500 font-light">Input satu per satu alat laboratorium ke dalam inventaris.</p>
              </div>
              
              <form onSubmit={handleRegisterInstrument} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Nama Alat Lab</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Oscilloscope GW Instek"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Kode ID Inventaris</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: HIMA-OSCI-001"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-850 focus:outline-none focus:border-gold font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">
                    Foto Alat <span className="text-slate-400 font-normal lowercase">(opsional / boleh kosong)</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <input 
                      key={formKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                    />
                    {newImage && (
                      <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden mt-1 bg-slate-50 flex items-center justify-center">
                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Deskripsi Singkat</label>
                  <textarea 
                    placeholder="Tulis spesifikasi singkat atau kegunaan alat..."
                    rows="3"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-850 focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" /> Daftarkan Alat
                </button>
              </form>
            </div>
          ) : (
            /* BATCH SPREADSHEET UPLOAD BOX */
            <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md relative overflow-hidden text-left space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-gold" /> Upload Tabel Spreadsheet
                </h3>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                  Upload file <strong>Excel (.xlsx, .xls)</strong> atau <strong>CSV</strong> untuk mendaftarkan semua alat sekaligus ke sistem.
                </p>
              </div>

              {/* Download template buttons */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unduh Format Tabel:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="flex-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-[10px] border border-emerald-200 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Format Excel (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="flex-1 py-1.5 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-[10px] border border-slate-300 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Format CSV (.csv)
                  </button>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <input 
                type="file"
                ref={batchFileInputRef}
                accept=".xlsx,.xls,.csv,.tsv"
                onChange={(e) => e.target.files && handleSpreadsheetFile(e.target.files[0])}
                className="hidden"
              />

              <div
                onClick={() => batchFileInputRef.current && batchFileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleSpreadsheetFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-gold bg-gold/10 scale-98' 
                    : 'border-slate-300 hover:border-gold hover:bg-slate-50'
                }`}
              >
                <Upload className="w-8 h-8 text-gold mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-700">
                  {excelFile ? excelFile.name : 'Klik untuk Pilih File Spreadsheet'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung file Excel (.xlsx, .xls) & CSV
                </p>
              </div>

              {/* Preview of Parsed Rows */}
              {excelPreviewData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {excelPreviewData.length} Alat Terbaca dari File
                    </span>
                    <button
                      type="button"
                      onClick={() => { setExcelFile(null); setExcelPreviewData([]); }}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  {/* Mini Preview Table */}
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 text-[11px] divide-y divide-slate-200 shadow-inner">
                    {excelPreviewData.map((item, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[9px] font-mono text-slate-500 truncate">{item.id}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">
                          Siap
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Primary Bulk Register Button */}
                  <button
                    type="button"
                    onClick={handleBulkRegister}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" /> Daftarkan {excelPreviewData.length} Alat Sekaligus
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* QR Code Modal for Inventory Tools */}
      {selectedQrInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-gold-border rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4 animate-slide-in">
            <button
              onClick={() => setSelectedQrInstrument(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest block">
                QR Code Alat Laboratorium
              </span>
              <h3 className="text-base font-bold text-slate-900 truncate">
                {selectedQrInstrument.name}
              </h3>
              <p className="text-xs font-mono font-bold text-slate-500 bg-slate-100 py-1 px-2 rounded-lg inline-block">
                {selectedQrInstrument.id}
              </p>
            </div>

            {/* QR Image */}
            <div className="p-4 bg-white border-2 border-dashed border-gold-border/80 rounded-2xl inline-block shadow-inner mx-auto">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(selectedQrInstrument.id)}`}
                alt={`QR Code ${selectedQrInstrument.name}`}
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-500 font-light leading-relaxed">
              Cetak QR Code ini dan tempelkan pada alat fisik. Mahasiswa dapat memindainya langsung di portal <strong className="text-slate-800">Einsten Space</strong>.
            </p>

            <div className="flex gap-2 pt-2">
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedQrInstrument.id)}`}
                target="_blank"
                rel="noreferrer"
                download={`QR_${selectedQrInstrument.id}.png`}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh QR
              </a>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gold hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-gold/20 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak / Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
