import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Box, ToggleLeft, ToggleRight, Radio, ShieldCheck, Plus, Trash2, UserCheck, UserX, Users, FileText,
  QrCode, Upload, Download, FileSpreadsheet, Eye, X, Printer, CheckCircle2, Layers, AlertCircle, Search, Filter, Tag
} from 'lucide-react';
import { DEFAULT_INVENTORY_ITEMS, INVENTORY_CATEGORIES, INVENTORY_SIZES } from '../../data/inventoryData';

export default function LogistikDashboard({ showToast }) {
  const [instruments, setInstruments] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSize, setSelectedSize] = useState('Semua Ukuran');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

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
  const [newCategory, setNewCategory] = useState('Elektronik');
  const [newSize, setNewSize] = useState('Medium');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCondition, setNewCondition] = useState('Baik');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    const loadData = () => {
      const INVENTORY_VERSION = 'v2_rekapitulasi_full_151';
      const storedVersion = localStorage.getItem('hima_inventory_version');

      // Load instruments
      const savedInst = localStorage.getItem('hima_instruments');
      if (storedVersion !== INVENTORY_VERSION || !savedInst) {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
        localStorage.setItem('hima_inventory_version', INVENTORY_VERSION);
        setInstruments(DEFAULT_INVENTORY_ITEMS);
      } else {
        try {
          const parsed = JSON.parse(savedInst);
          if (!Array.isArray(parsed) || parsed.length < 50) {
            localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
            localStorage.setItem('hima_inventory_version', INVENTORY_VERSION);
            setInstruments(DEFAULT_INVENTORY_ITEMS);
          } else {
            setInstruments(parsed);
          }
        } catch (e) {
          localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
          localStorage.setItem('hima_inventory_version', INVENTORY_VERSION);
          setInstruments(DEFAULT_INVENTORY_ITEMS);
        }
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
      category: newCategory,
      size: newSize,
      quantity: Number(newQuantity) || 1,
      condition: newCondition,
      status: 'Available',
      image: newImage || '📦',
      desc: newDesc.trim() || `Barang inventaris HIMA EINSTEN (${newCategory}).`
    };

    const updated = [...instruments, newInstrument];
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));

    // Reset Form
    setNewName('');
    setNewId('');
    setNewCategory('Elektronik');
    setNewSize('Medium');
    setNewQuantity(1);
    setNewCondition('Baik');
    setNewImage('');
    setNewDesc('');
    setFormKey(Date.now());
    showToast(`Barang ${newName} berhasil didaftarkan ke kategori ${newCategory}!`, 'success');
  };

  const handleDeleteInstrument = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus barang ${id} dari inventaris?`)) {
      const updated = instruments.filter(inst => inst.id !== id);
      setInstruments(updated);
      localStorage.setItem('hima_instruments', JSON.stringify(updated));
      showToast(`Barang ${id} berhasil dihapus!`, 'success');
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
        
        let allParsedItems = [];
        const existingIds = new Set(instruments.map(i => i.id.toUpperCase()));

        // Process all sheets if multi-sheet Excel, or the first sheet
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (!jsonData || jsonData.length <= 1) return;

          const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
          const idIdx = headers.findIndex(h => h.includes('id') || h.includes('kode') || h.includes('code'));
          const nameIdx = headers.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('benda') || h.includes('alat') || h.includes('barang'));
          const catIdx = headers.findIndex(h => h.includes('kategori') || h.includes('category') || h.includes('divisi'));
          const sizeIdx = headers.findIndex(h => h.includes('ukuran') || h.includes('size'));
          const qtyIdx = headers.findIndex(h => h.includes('jumlah') || h.includes('qty') || h.includes('stok') || h.includes('stock'));
          const condIdx = headers.findIndex(h => h.includes('kondisi') || h.includes('condition'));
          const descIdx = headers.findIndex(h => h.includes('deskripsi') || h.includes('desc') || h.includes('ket') || h.includes('spesifikasi'));
          const imgIdx = headers.findIndex(h => h.includes('foto') || h.includes('image') || h.includes('gambar') || h.includes('url'));
          const statusIdx = headers.findIndex(h => h.includes('status'));

          const finalNameIdx = nameIdx !== -1 ? nameIdx : (idIdx === 0 ? 1 : 0);

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const rawName = String(row[finalNameIdx] || '').trim();
            if (!rawName) continue;

            let defaultCat = INVENTORY_CATEGORIES.includes(sheetName) ? sheetName : 'Properti Kegiatan';
            let cat = (catIdx !== -1 && row[catIdx]) ? String(row[catIdx]).trim() : defaultCat;
            let size = (sizeIdx !== -1 && row[sizeIdx]) ? String(row[sizeIdx]).trim() : (['Besar', 'Medium', 'Kecil'].includes(sheetName) ? sheetName : 'Medium');
            let qty = (qtyIdx !== -1 && !isNaN(row[qtyIdx])) ? parseInt(row[qtyIdx]) : 1;
            let cond = (condIdx !== -1 && row[condIdx]) ? String(row[condIdx]).trim() : 'Baik';

            let rawId = (idIdx !== -1 && row[idIdx]) ? String(row[idIdx]).trim().toUpperCase() : `ASL-${cat.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}${i}`;
            let finalId = rawId;
            let counter = 1;
            while (existingIds.has(finalId.toUpperCase())) {
              finalId = `${rawId}-${counter}`;
              counter++;
            }
            existingIds.add(finalId.toUpperCase());

            const desc = (descIdx !== -1 && row[descIdx]) ? String(row[descIdx]).trim() : `${rawName} inventaris HIMA EINSTEN (${cat}).`;
            const img = (imgIdx !== -1 && row[imgIdx]) ? String(row[imgIdx]).trim() : '📦';
            const status = (statusIdx !== -1 && String(row[statusIdx]).toLowerCase().includes('pinjam')) ? 'Borrowed' : 'Available';

            allParsedItems.push({
              id: finalId,
              name: rawName,
              category: cat,
              size,
              quantity: qty,
              condition: cond,
              status,
              image: img,
              desc
            });
          }
        });

        if (allParsedItems.length === 0) {
          showToast('Tidak ada data barang valid yang ditemukan di file!', 'warning');
          setExcelPreviewData([]);
        } else {
          setExcelPreviewData(allParsedItems);
          showToast(`Berhasil membaca ${allParsedItems.length} barang dari file spreadsheet!`, 'success');
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
    showToast(`Sukses! ${excelPreviewData.length} barang berhasil didaftarkan sekaligus ke inventaris!`, 'success');
    
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
        Kode_ID: 'ASL-ELK-01-2025',
        Nama_Barang: 'Arduino Uno R3',
        Kategori: 'Elektronik',
        Ukuran: 'Kecil',
        Jumlah: 4,
        Kondisi: 'Baik',
        Deskripsi: 'Mikrokontroler ATmega328P untuk IoT',
        Status: 'Tersedia',
        Foto: ''
      },
      {
        Kode_ID: 'ASL-ELK-02-2025',
        Nama_Barang: 'Mesin Gerinda Tangan',
        Kategori: 'Elektronik',
        Ukuran: 'Medium',
        Jumlah: 1,
        Kondisi: 'Baik',
        Deskripsi: 'Mesin gerinda listrik pemotong',
        Status: 'Tersedia',
        Foto: ''
      },
      {
        Kode_ID: 'ASL-FRN-01-2025',
        Nama_Barang: 'Kursi Lipat',
        Kategori: 'Furniture',
        Ukuran: 'Besar',
        Jumlah: 10,
        Kondisi: 'Baik',
        Deskripsi: 'Kursi lipat sekretariat',
        Status: 'Tersedia',
        Foto: ''
      },
      {
        Kode_ID: 'ASL-ATK-01-2025',
        Nama_Barang: 'Gunting Kertas',
        Kategori: 'ATK',
        Ukuran: 'Kecil',
        Jumlah: 6,
        Kondisi: 'Baik',
        Deskripsi: 'Gunting serbaguna',
        Status: 'Tersedia',
        Foto: ''
      }
    ];

    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Template_Inventaris');
      XLSX.writeFile(wb, 'template_rekapitulasi_inventaris_hima.xlsx');
    } else {
      const csvContent = "Kode_ID,Nama_Barang,Kategori,Ukuran,Jumlah,Kondisi,Deskripsi,Status,Foto\n" +
        templateData.map(r => `"${r.Kode_ID}","${r.Nama_Barang}","${r.Kategori}","${r.Ukuran}","${r.Jumlah}","${r.Kondisi}","${r.Deskripsi}","${r.Status}","${r.Foto}"`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'template_rekapitulasi_inventaris_hima.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export current live database to Excel
  const handleExportLiveInventory = () => {
    const exportData = instruments.map((inst, index) => ({
      No: index + 1,
      Kode_ID: inst.id,
      Nama_Barang: inst.name,
      Kategori: inst.category || 'Properti Kegiatan',
      Ukuran: inst.size || 'Medium',
      Jumlah: inst.quantity || 1,
      Kondisi: inst.condition || 'Baik',
      Status: inst.status === 'Available' ? 'Tersedia' : 'Sedang Dipinjam',
      Deskripsi: inst.desc || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi_Live');
    XLSX.writeFile(wb, `Rekapitulasi_Inventaris_HIMA_Live_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Data inventaris berhasil diekspor ke file Excel!', 'success');
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
  const totalPhysicalStock = instruments.reduce((sum, inst) => sum + (Number(inst.quantity) || 1), 0);
  const availableCount = instruments.filter(i => i.status === 'Available').length;
  const borrowedCount = instruments.filter(i => i.status !== 'Available').length;
  const activeBorrowersCount = new Set(
    borrowRequests
      .filter(r => r.status === 'Approved')
      .map(r => r.borrowerNim)
  ).size;

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Elektronik':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Furniture':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Properti Kegiatan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ATK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'P3K':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DANUS':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Olahraga':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Pemakaian Bersama':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Filtered inventory calculation
  const filteredInstruments = instruments.filter(inst => {
    const matchesCat = selectedCategory === 'Semua' || inst.category === selectedCategory;
    const matchesSize = selectedSize === 'Semua Ukuran' || inst.size === selectedSize;
    const matchesStatus = selectedStatus === 'Semua' 
      ? true 
      : selectedStatus === 'Tersedia' 
        ? inst.status === 'Available' 
        : inst.status !== 'Available';
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      inst.name.toLowerCase().includes(q) || 
      (inst.id && inst.id.toLowerCase().includes(q)) || 
      (inst.category && inst.category.toLowerCase().includes(q)) ||
      (inst.desc && inst.desc.toLowerCase().includes(q));
    return matchesCat && matchesSize && matchesStatus && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <Box className="w-3.5 h-3.5 text-gold" /> LOGISTIK & ASET OPERATOR CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Logistics Inventory & Asset Control
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Rekapitulasi inventaris terpadu HIMA EINSTEN (Elektronik, Furniture, ATK, P3K, Danus, Properti, Olahraga) & approval peminjaman.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportLiveInventory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Ekspor seluruh data inventaris ke file Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor ke Excel
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jenis Inventaris</span>
            <span className="text-lg font-extrabold text-slate-900 font-heading">{instruments.length} Jenis</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Stok Fisik</span>
            <span className="text-lg font-extrabold text-slate-900 font-heading">{totalPhysicalStock} Unit</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tersedia</span>
            <span className="text-lg font-extrabold text-emerald-700 font-heading">
              {availableCount} Jenis
            </span>
          </div>
        </div>

        <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sedang Dipinjam</span>
            <span className="text-lg font-extrabold text-rose-600 font-heading">
              {borrowedCount} Unit
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
                <Box className="w-4 h-4 text-gold" /> Daftar Rekapitulasi Inventaris ({filteredInstruments.length})
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
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gold-dark" /> Upload Spreadsheet
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

            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {INVENTORY_CATEGORIES.map(cat => {
                const count = cat === 'Semua' ? instruments.length : instruments.filter(i => i.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gold text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-gold/40 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Sub-filter bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama barang, kode ID, deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-700 focus:outline-none focus:border-gold"
                >
                  {INVENTORY_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-700 focus:outline-none focus:border-gold"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Dipinjam">Dipinjam</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3.5">Barang & Kategori</th>
                      <th className="px-4 py-3.5">Kode ID</th>
                      <th className="px-4 py-3.5">Stok & Kondisi</th>
                      <th className="px-4 py-3.5">QR Code</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-750">
                    {filteredInstruments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                          Tidak ada barang yang cocok dengan filter / pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredInstruments.map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3.5 flex items-center gap-3">
                            {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http') || inst.image.startsWith('data:')) ? (
                              <img src={inst.image} alt={inst.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                            ) : (
                              <span className="text-2xl shrink-0">{inst.image || '📦'}</span>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800">{inst.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                {inst.category && (
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getCategoryBadgeClass(inst.category)}`}>
                                    {inst.category}
                                  </span>
                                )}
                                {inst.size && (
                                  <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] border border-slate-200">
                                    {inst.size}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-600 font-bold text-[11px]">{inst.id}</td>
                          <td className="px-4 py-3.5">
                            <div className="text-slate-700">
                              <span className="font-bold text-slate-900">{inst.quantity || 1}</span> Unit
                            </div>
                            <span className="text-[10px] text-slate-500 font-light block">
                              {inst.condition || 'Baik'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => setSelectedQrInstrument(inst)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-gold/10 hover:text-gold-dark text-slate-700 text-[10px] font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer"
                              title="Lihat & Cetak QR Code Barang"
                            >
                              <QrCode className="w-3.5 h-3.5 text-gold-dark" />
                              <span>QR</span>
                            </button>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              inst.status === 'Available' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                                : 'bg-rose-50 text-rose-600 border-rose-500/20'
                            }`}>
                              {inst.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleToggleStatus(inst.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                                  inst.status === 'Available'
                                    ? 'bg-rose-50 text-rose-600 border-rose-500/20 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-500/20 hover:bg-emerald-100'
                                }`}
                                title={inst.status === 'Available' ? 'Set Dipinjam' : 'Set Tersedia'}
                              >
                                {inst.status === 'Available' ? (
                                  <>
                                    <ToggleLeft className="w-3 h-3 text-rose-600" /> Pinjam
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-3 h-3 text-emerald-600" /> Ready
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteInstrument(inst.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all active:scale-95 cursor-pointer"
                                title="Hapus Barang"
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
                  <Plus className="w-4 h-4 text-gold" /> Daftarkan Barang Baru
                </h3>
                <p className="text-[11px] text-slate-500 font-light">Input satu per satu barang/aset inventaris HIMA ke dalam sistem.</p>
              </div>
              
              <form onSubmit={handleRegisterInstrument} className="space-y-3.5 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Nama Barang / Aset</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Mesin Bor / Kursi Lipat"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    >
                      {INVENTORY_CATEGORIES.filter(c => c !== 'Semua').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Ukuran</label>
                    <select
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    >
                      {INVENTORY_SIZES.filter(s => s !== 'Semua Ukuran').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Jumlah / Stok</label>
                    <input 
                      type="number"
                      min="1"
                      required
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Kondisi</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Cukup">Cukup / Perlu Rawat</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Kode ID Inventaris</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: ASL-ELK-01-2025"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-gold font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">
                    Foto Barang <span className="text-slate-400 font-normal lowercase">(opsional)</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <input 
                      key={formKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                    />
                    {newImage && (
                      <div className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden mt-1 bg-slate-50 flex items-center justify-center">
                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block text-left">Deskripsi / Keterangan</label>
                  <textarea 
                    placeholder="Tulis keterangan spesifikasi, lokasi simpan, atau fungsi..."
                    rows="2"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" /> Daftarkan Barang
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
                  Upload file <strong>Excel (.xlsx, .xls)</strong> atau <strong>CSV</strong> untuk mendaftarkan semua barang/aset sekaligus ke sistem.
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
                      {excelPreviewData.length} Barang Terbaca dari File
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
                          <p className="text-[9px] font-mono text-slate-500 truncate">{item.id} • {item.category || 'Properti'}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">
                          Siap ({item.quantity || 1} unit)
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
                    <Layers className="w-4 h-4" /> Daftarkan {excelPreviewData.length} Barang Sekaligus
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
                QR Code Aset / Logistik HIMA
              </span>
              <h3 className="text-base font-bold text-slate-900 truncate">
                {selectedQrInstrument.name}
              </h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 py-0.5 px-2 rounded-lg border border-slate-200">
                  {selectedQrInstrument.id}
                </span>
                {selectedQrInstrument.category && (
                  <span className={`text-[10px] font-bold py-0.5 px-2 rounded-lg border ${getCategoryBadgeClass(selectedQrInstrument.category)}`}>
                    {selectedQrInstrument.category}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 py-0.5 px-2 rounded-lg border border-slate-200">
                  Stok: {selectedQrInstrument.quantity || 1}
                </span>
              </div>
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
              Cetak QR Code ini dan tempelkan pada barang fisik. Mahasiswa dapat memindainya langsung di portal <strong className="text-slate-800">Einsten Space</strong>.
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
