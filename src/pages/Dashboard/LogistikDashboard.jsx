import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { 
  Box, ToggleLeft, ToggleRight, Radio, ShieldCheck, Plus, Trash2, Edit3, UserCheck, UserX, 
  FileText, QrCode, Upload, Download, FileSpreadsheet, X, Printer, CheckCircle2, 
  Layers, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  RefreshCw, Sparkles, Check, Filter, Users, CheckCheck, Clock, RotateCcw
} from 'lucide-react';
import { DEFAULT_INVENTORY_ITEMS, INVENTORY_CATEGORIES, INVENTORY_SIZES } from '../../data/inventoryData';

export default function LogistikDashboard({ showToast }) {
  const [instruments, setInstruments] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Active Tab Panel: 'overview' | 'database' | 'peminjam' | 'input' | 'qr'
  const [activeTab, setActiveTab] = useState('overview');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSize, setSelectedSize] = useState('Semua Ukuran');
  const [selectedCondition, setSelectedCondition] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Borrower Panel States
  const [borrowerSearchQuery, setBorrowerSearchQuery] = useState('');
  const [borrowerStatusFilter, setBorrowerStatusFilter] = useState('Semua');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Single QR Modal State
  const [selectedQrInstrument, setSelectedQrInstrument] = useState(null);
  const [singleQrDataUrl, setSingleQrDataUrl] = useState('');
  const [qrCodeMap, setQrCodeMap] = useState({});

  // Pre-generate all QR codes locally for instant 100% offline print without missing/blank QR codes
  useEffect(() => {
    if (!instruments || instruments.length === 0) return;
    let isMounted = true;
    const generateAllQrs = async () => {
      const map = {};
      await Promise.all(
        instruments.map(async (inst) => {
          try {
            const url = await QRCode.toDataURL(inst.id || inst.name, {
              width: 240,
              margin: 1,
              color: { dark: '#000000', light: '#ffffff' }
            });
            map[inst.id] = url;
          } catch (e) {
            console.error('Failed to generate QR for', inst.id, e);
          }
        })
      );
      if (isMounted) setQrCodeMap(map);
    };
    generateAllQrs();
    return () => { isMounted = false; };
  }, [instruments]);

  // Edit Item Modal State
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState('');
  const [editCategory, setEditCategory] = useState('Elektronik');
  const [editSize, setEditSize] = useState('Medium');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCondition, setEditCondition] = useState('Baik');
  const [editStatus, setEditStatus] = useState('Available');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Registration Sub-Mode ('manual' | 'batch')
  const [regMode, setRegMode] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const csvInputRef = useRef(null);
  const batchFileInputRef = useRef(null);

  // Form states for single instrument registration
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newCategory, setNewCategory] = useState('Elektronik');
  const [newSize, setNewSize] = useState('Medium');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCondition, setNewCondition] = useState('Baik');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formKey, setFormKey] = useState(Date.now());

  // Batch QR Download & ZIP State
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [borrowReqFilter, setBorrowReqFilter] = useState('Semua');

  // Real-Time Broadcast Helper
  const broadcastSync = (type, data) => {
    window.dispatchEvent(new Event('storage'));
    if (type === 'inventory') {
      window.dispatchEvent(new CustomEvent('hima_sync_inventory', { detail: data }));
    } else if (type === 'requests') {
      window.dispatchEvent(new CustomEvent('hima_sync_borrow_requests', { detail: data }));
    } else {
      window.dispatchEvent(new CustomEvent('hima_sync_all', { detail: data }));
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('hima_live_sync_channel');
        bc.postMessage({ type, data, timestamp: Date.now() });
        bc.close();
      } catch (e) {}
    }
  };

  // Load Initial Data & Multi-Tab Real-Time Sync
  useEffect(() => {
    const CURRENT_DATA_VERSION = 'v2026_rekap_master_140_v2';
    const loadData = () => {
      const savedVersion = localStorage.getItem('hima_inventory_data_version');
      const savedInst = localStorage.getItem('hima_instruments');

      let shouldReset = false;
      if (!savedInst || savedVersion !== CURRENT_DATA_VERSION) {
        shouldReset = true;
      } else {
        try {
          const parsed = JSON.parse(savedInst);
          if (!Array.isArray(parsed) || parsed.length <= 10 || parsed.some(i => !i.id || i.id.startsWith('HIMA-') || !i.category)) {
            shouldReset = true;
          } else {
            setInstruments(parsed);
          }
        } catch (e) {
          shouldReset = true;
        }
      }

      if (shouldReset) {
        localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
        localStorage.setItem('hima_inventory_data_version', CURRENT_DATA_VERSION);
        setInstruments(DEFAULT_INVENTORY_ITEMS);
      }

      const savedReqs = localStorage.getItem('hima_borrow_requests');
      if (savedReqs) {
        try {
          let parsedReqs = JSON.parse(savedReqs);
          if (Array.isArray(parsedReqs)) {
            parsedReqs = parsedReqs.map(r => {
              if (r.instrumentId === 'HIMA-ARDU-001') return { ...r, instrumentId: 'ASL-ELK-10-2025' };
              if (r.instrumentId === 'HIMA-GERI-002') return { ...r, instrumentId: 'ASL-ELK-02-2025' };
              if (r.instrumentId === 'HIMA-SOLD-003') return { ...r, instrumentId: 'ASL-ELK-08-2025' };
              if (r.instrumentId === 'HIMA-TIMA-004') return { ...r, instrumentId: 'ASL-ELK-07-2025' };
              return r;
            });
            setBorrowRequests(parsedReqs);
          } else {
            setBorrowRequests([]);
          }
        } catch (e) {
          setBorrowRequests([]);
        }
      } else {
        setBorrowRequests([]);
      }
    };

    loadData();

    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('hima_sync_inventory', handleSync);
    window.addEventListener('hima_sync_borrow_requests', handleSync);
    window.addEventListener('hima_sync_all', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') loadData();
    });

    let bc;
    try {
      bc = new BroadcastChannel('hima_live_sync_channel');
      bc.onmessage = () => loadData();
    } catch (e) {}

    const liveInterval = setInterval(loadData, 1500);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('hima_sync_inventory', handleSync);
      window.removeEventListener('hima_sync_borrow_requests', handleSync);
      window.removeEventListener('hima_sync_all', handleSync);
      window.removeEventListener('focus', handleSync);
      clearInterval(liveInterval);
      if (bc) bc.close();
    };
  }, []);

  // Generate Single QR Code Data URL when selected
  useEffect(() => {
    if (selectedQrInstrument) {
      QRCode.toDataURL(selectedQrInstrument.id, {
        width: 450,
        margin: 2,
        color: { dark: '#0b132b', light: '#ffffff' }
      })
        .then(url => setSingleQrDataUrl(url))
        .catch(err => console.error('Error generating single QR:', err));
    } else {
      setSingleQrDataUrl('');
    }
  }, [selectedQrInstrument]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSize, selectedCondition, selectedStatus, searchQuery, pageSize]);

  // Status toggle handler
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
    broadcastSync('inventory', updated);
    showToast(`Status alat ${id} berhasil diubah!`, 'success');
  };

  // Image Upload handler for new instrument
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
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Upload handler for edit instrument
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast('Ukuran foto terlalu besar! Maksimal 1MB.', 'error');
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (inst) => {
    setEditingInstrument(inst);
    setEditName(inst.name || '');
    setEditId(inst.id || '');
    setEditCategory(inst.category || 'Elektronik');
    setEditSize(inst.size || 'Medium');
    setEditQuantity(Number(inst.quantity) || 1);
    setEditCondition(inst.condition || 'Baik');
    setEditStatus(inst.status || 'Available');
    setEditImage(inst.image || '');
    setEditDesc(inst.desc || '');
  };

  // Save Edit Instrument
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editId.trim()) {
      showToast('Nama Barang dan Kode ID wajib diisi!', 'error');
      return;
    }

    const idExists = instruments.some(
      inst => inst.id.toLowerCase() === editId.trim().toLowerCase() && inst.id.toLowerCase() !== editingInstrument.id.toLowerCase()
    );
    if (idExists) {
      showToast(`Kode ID ${editId.trim().toUpperCase()} sudah digunakan oleh barang lain!`, 'error');
      return;
    }

    const updated = instruments.map(inst => {
      if (inst.id === editingInstrument.id) {
        return {
          ...inst,
          id: editId.trim().toUpperCase(),
          name: editName.trim(),
          category: editCategory,
          size: editSize,
          quantity: Math.max(0, Number(editQuantity) || 0),
          condition: editCondition,
          status: editStatus,
          image: editImage || inst.image || '📦',
          desc: editDesc.trim() || `Barang inventaris HIMA EINSTEN (${editCategory}).`
        };
      }
      return inst;
    });

    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));
    broadcastSync('inventory', updated);
    setEditingInstrument(null);
    showToast(`Data barang ${editName} berhasil diperbarui!`, 'success');
  };

  // Register New Instrument
  const handleRegisterInstrument = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newId.trim()) {
      showToast('Nama Barang dan Kode ID wajib diisi!', 'error');
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

    const updated = [newInstrument, ...instruments];
    setInstruments(updated);
    localStorage.setItem('hima_instruments', JSON.stringify(updated));
    broadcastSync('inventory', updated);

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
    setActiveTab('database');
  };

  // Delete Instrument
  const handleDeleteInstrument = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus barang ${id} dari inventaris?`)) {
      const updated = instruments.filter(inst => inst.id !== id);
      setInstruments(updated);
      localStorage.setItem('hima_instruments', JSON.stringify(updated));
      broadcastSync('inventory', updated);
      showToast(`Barang ${id} berhasil dihapus!`, 'success');
    }
  };

  // Spreadsheet Parser & Bulk Import Handlers
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

        // Check if there are size sheets to build size map
        const sizeMap = new Map();
        ['Besar', 'Medium', 'Kecil'].forEach(sizeName => {
          if (workbook.Sheets[sizeName]) {
            const sizeJson = XLSX.utils.sheet_to_json(workbook.Sheets[sizeName]);
            sizeJson.forEach(r => {
              const bName = r.BENDA || r['NAMA BARANG'] || r.benda || r.nama_barang;
              if (bName) {
                sizeMap.set(String(bName).trim().toLowerCase(), sizeName);
              }
            });
          }
        });

        workbook.SheetNames.forEach(sheetName => {
          // If sheet is purely size sheet and workbook has category sheets, don't duplicate items
          const isPureSizeSheet = ['Besar', 'Medium', 'Kecil'].includes(sheetName);
          const hasCategorySheets = workbook.SheetNames.some(s => ['Elektronik', 'Furniture', 'Properti Kegiatan', 'ATK', 'P3K', 'DANUS', 'Olahraga', 'Pemakaian Bersama'].includes(s));
          if (isPureSizeSheet && hasCategorySheets) return;

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (!jsonData || jsonData.length <= 1) return;

          const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
          const idIdx = headers.findIndex(h => h.includes('code') || h.includes('kode') || h.includes('id'));
          const nameIdx = headers.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('benda') || h.includes('alat') || h.includes('barang'));
          const catIdx = headers.findIndex(h => h.includes('kategori') || h.includes('category') || h.includes('divisi'));
          const sizeIdx = headers.findIndex(h => h.includes('ukuran') || h.includes('size'));
          const qtyIdx = headers.findIndex(h => h.includes('jumlah') || h.includes('qty') || h.includes('stok') || h.includes('stock') || h.includes('total'));
          const condIdx = headers.findIndex(h => h.includes('kondisi') || h.includes('condition'));
          const descIdx = headers.findIndex(h => h.includes('keterangan') || h.includes('deskripsi') || h.includes('desc') || h.includes('ket') || h.includes('spesifikasi'));
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
            if (!INVENTORY_CATEGORIES.includes(cat)) {
              if (cat.toLowerCase().includes('elek')) cat = 'Elektronik';
              else if (cat.toLowerCase().includes('furn')) cat = 'Furniture';
              else if (cat.toLowerCase().includes('prop') || cat.toLowerCase().includes('kegiatan')) cat = 'Properti Kegiatan';
              else if (cat.toLowerCase().includes('atk')) cat = 'ATK';
              else if (cat.toLowerCase().includes('p3k')) cat = 'P3K';
              else if (cat.toLowerCase().includes('danus')) cat = 'DANUS';
              else if (cat.toLowerCase().includes('olahraga')) cat = 'Olahraga';
              else if (cat.toLowerCase().includes('bersama')) cat = 'Pemakaian Bersama';
              else cat = 'Properti Kegiatan';
            }

            let size = (sizeIdx !== -1 && row[sizeIdx]) 
              ? String(row[sizeIdx]).trim() 
              : (sizeMap.get(rawName.toLowerCase()) || (['Besar', 'Medium', 'Kecil'].includes(sheetName) ? sheetName : (['Furniture', 'Properti Kegiatan'].includes(cat) ? 'Besar' : (['ATK', 'P3K', 'Elektronik'].includes(cat) ? 'Kecil' : 'Medium'))));

            let qty = (qtyIdx !== -1 && !isNaN(parseInt(row[qtyIdx]))) ? parseInt(row[qtyIdx]) : 1;
            let cond = (condIdx !== -1 && row[condIdx]) ? String(row[condIdx]).trim() : 'Baik';

            let rawId = (idIdx !== -1 && row[idIdx]) ? String(row[idIdx]).trim().toUpperCase() : `ASL-${cat.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}${i}`;
            let finalId = rawId;
            let counter = 1;
            while (existingIds.has(finalId.toUpperCase())) {
              finalId = `${rawId}-${counter}`;
              counter++;
            }
            existingIds.add(finalId.toUpperCase());

            const rawKet = (descIdx !== -1 && row[descIdx]) ? String(row[descIdx]).trim() : '';
            const desc = rawKet || `${rawName} inventaris HIMA EINSTEN (${cat}).`;

            let img = (imgIdx !== -1 && row[imgIdx]) ? String(row[imgIdx]).trim() : '📦';
            if (img === '📦') {
              const nLower = rawName.toLowerCase();
              if (nLower.includes('arduino')) img = '/Media/Media Aset dan Logistik/Arduino Uno.webp';
              else if (nLower.includes('gerinda')) img = '/Media/Media Aset dan Logistik/Gerinda.png';
              else if (nLower.includes('solder')) img = '/Media/Media Aset dan Logistik/Solder.jpg';
              else if (nLower.includes('timah') || nLower.includes('sedot timah')) img = '/Media/Media Aset dan Logistik/Timah.jpg';
            }

            let status = 'Available';
            if (statusIdx !== -1 && row[statusIdx]) {
              const sVal = String(row[statusIdx]).toLowerCase();
              if (sVal.includes('pinjam')) status = 'Borrowed';
              else if (sVal.includes('tidak') || qty === 0) status = 'Unavailable';
            }

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
    broadcastSync('inventory', updatedList);
    showToast(`Sukses! ${excelPreviewData.length} barang berhasil didaftarkan sekaligus ke inventaris!`, 'success');
    
    setExcelFile(null);
    setExcelPreviewData([]);
    if (batchFileInputRef.current) batchFileInputRef.current.value = '';
    if (csvInputRef.current) csvInputRef.current.value = '';
    setActiveTab('database');
  };

  const handleDownloadTemplate = (format = 'xlsx') => {
    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();

      const sheetsConfig = [
        {
          name: 'Elektronik',
          data: [
            { NO: 1, 'NAMA BARANG': 'Toa', 'CODE NAME': 'ASL-ELK-01-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Gerinda', 'CODE NAME': 'ASL-ELK-02-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Arduino Uno R3', 'CODE NAME': 'ASL-ELK-10-2025', JUMLAH: 4, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'Furniture',
          data: [
            { NO: 1, 'NAMA BARANG': 'Dispenser', 'CODE NAME': 'ASL-FUR-01-2025', JUMLAH: 2, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Galon', 'CODE NAME': 'ASL-FUR-02-2025', JUMLAH: 3, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Kursi', 'CODE NAME': 'ASL-FUR-04-2025', JUMLAH: 3, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'Properti Kegiatan',
          data: [
            { NO: 1, 'NAMA BARANG': 'Banner HIma Einsten', 'CODE NAME': 'ASL-PKG-01-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran (2,5m x 1,5 m)' },
            { NO: 2, 'NAMA BARANG': 'Quecard', 'CODE NAME': 'ASL-PKG-02-2025', JUMLAH: 2, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran A5' },
            { NO: 3, 'NAMA BARANG': 'Bendera HIMA', 'CODE NAME': 'ASL-PKG-03-2025', JUMLAH: 3, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran (150cm x 100cm)' }
          ]
        },
        {
          name: 'ATK',
          data: [
            { NO: 1, 'NAMA BARANG': 'Kertas serut (pack)', 'CODE NAME': 'ASL-ATK-01-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Amplop coklat', 'CODE NAME': 'ASL-ATK-02-2025', JUMLAH: 20, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Gunting', 'CODE NAME': 'ASL-ATK-06-2025', JUMLAH: 6, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'P3K',
          data: [
            { NO: 1, 'NAMA BARANG': 'Kotak P3K', 'CODE NAME': 'ASL-P3K-01-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Sarung tangan', 'CODE NAME': 'ASL-P3K-02-2025', JUMLAH: 3, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Betadine (botol)', 'CODE NAME': 'ASL-P3K-04-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'DANUS',
          data: [
            { NO: 1, 'NAMA BARANG': 'Cup Plastik', 'CODE NAME': 'DNS-01-2025', JUMLAH: 4, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Gayung Es', 'CODE NAME': 'DNS-02-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Kotak Es(hijau)', 'CODE NAME': 'DNS-03-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'Olahraga',
          data: [
            { NO: 1, 'NAMA BARANG': 'Bola kasti', 'CODE NAME': 'PEMA-OR-01-2025', JUMLAH: 4, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 2, 'NAMA BARANG': 'Bola pimpong (slop)', 'CODE NAME': 'PEMA-OR-02-2025', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
            { NO: 3, 'NAMA BARANG': 'Cone', 'CODE NAME': 'PEMA-OR-04-2025', JUMLAH: 16, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
          ]
        },
        {
          name: 'Pemakaian Bersama',
          data: [
            { NO: 1, 'BENDA': 'Banner HIma Einsten', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran (2,5m x 1,5 m)' },
            { NO: 2, 'BENDA': 'Quecard', JUMLAH: 2, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran A5' },
            { NO: 3, 'BENDA': 'Bendera HIMA', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran (150cm x 100cm)' }
          ]
        }
      ];

      sheetsConfig.forEach(s => {
        const ws = XLSX.utils.json_to_sheet(s.data);
        XLSX.utils.book_append_sheet(wb, ws, s.name);
      });

      XLSX.writeFile(wb, 'Template_Rekapitulasi_Inventaris_HIMA.xlsx');
      showToast('Template Excel berhasil diunduh sesuai format Rekapitulasi Inventaris HIMA!', 'success');
    } else {
      const templateData = [
        { NO: 1, NAMA_BARANG: 'Toa', CODE_NAME: 'ASL-ELK-01-2025', KATEGORI: 'Elektronik', UKURAN: 'Besar', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
        { NO: 2, NAMA_BARANG: 'Dispenser', CODE_NAME: 'ASL-FUR-01-2025', KATEGORI: 'Furniture', UKURAN: 'Besar', JUMLAH: 2, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
        { NO: 3, NAMA_BARANG: 'Banner HIma Einsten', CODE_NAME: 'ASL-PKG-01-2025', KATEGORI: 'Properti Kegiatan', UKURAN: 'Besar', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: 'Ukuran (2,5m x 1,5 m)' },
        { NO: 4, NAMA_BARANG: 'Kertas serut (pack)', CODE_NAME: 'ASL-ATK-01-2025', KATEGORI: 'ATK', UKURAN: 'Kecil', JUMLAH: 1, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
        { NO: 5, NAMA_BARANG: 'Cup Plastik', CODE_NAME: 'DNS-01-2025', KATEGORI: 'DANUS', UKURAN: 'Medium', JUMLAH: 4, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' },
        { NO: 6, NAMA_BARANG: 'Bola kasti', CODE_NAME: 'PEMA-OR-01-2025', KATEGORI: 'Olahraga', UKURAN: 'Medium', JUMLAH: 4, KONDISI: 'Baik', STATUS: 'Tersedia', KETERANGAN: '' }
      ];

      const csvContent = "NO,NAMA_BARANG,CODE_NAME,KATEGORI,UKURAN,JUMLAH,KONDISI,STATUS,KETERANGAN\n" +
        templateData.map(r => `"${r.NO}","${r.NAMA_BARANG}","${r.CODE_NAME}","${r.KATEGORI}","${r.UKURAN}","${r.JUMLAH}","${r.KONDISI}","${r.STATUS}","${r.KETERANGAN}"`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Template_Rekapitulasi_Inventaris_HIMA.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Template CSV berhasil diunduh!', 'success');
    }
  };

  const handleExportLiveInventory = () => {
    const wb = XLSX.utils.book_new();

    // 1. Sheet Semua Barang
    const allExportData = instruments.map((inst, index) => ({
      NO: index + 1,
      'NAMA BARANG': inst.name,
      'CODE NAME': inst.id,
      KATEGORI: inst.category || 'Properti Kegiatan',
      UKURAN: inst.size || 'Medium',
      JUMLAH: inst.quantity || 1,
      KONDISI: inst.condition || 'Baik',
      STATUS: inst.status === 'Available' ? 'Tersedia' : (inst.status === 'Borrowed' ? 'Sedang Dipinjam' : 'Tidak Tersedia'),
      KETERANGAN: inst.desc || ''
    }));
    const wsAll = XLSX.utils.json_to_sheet(allExportData);
    XLSX.utils.book_append_sheet(wb, wsAll, 'Semua_Inventaris');

    // 2. Sheets by category (matching Rekapitulasi inventaris HIMA format)
    const validCats = INVENTORY_CATEGORIES.filter(c => c !== 'Semua');
    validCats.forEach(cat => {
      const catItems = instruments.filter(i => i.category === cat);
      if (catItems.length > 0) {
        const catData = catItems.map((inst, idx) => ({
          NO: idx + 1,
          'NAMA BARANG': inst.name,
          'CODE NAME': inst.id,
          JUMLAH: inst.quantity || 1,
          KONDISI: inst.condition || 'Baik',
          STATUS: inst.status === 'Available' ? 'Tersedia' : (inst.status === 'Borrowed' ? 'Sedang Dipinjam' : 'Tidak Tersedia'),
          KETERANGAN: inst.desc || ''
        }));
        const wsCat = XLSX.utils.json_to_sheet(catData);
        const safeSheetName = cat.substring(0, 30);
        XLSX.utils.book_append_sheet(wb, wsCat, safeSheetName);
      }
    });

    XLSX.writeFile(wb, `Rekapitulasi_Inventaris_HIMA_Live_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Data inventaris berhasil diekspor ke file Excel sesuai format Rekapitulasi!', 'success');
  };

  // Borrow Approval Handlers with Notification & Instant Sync
  const handleApproveRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Approved' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    const updatedInsts = instruments.map(inst => 
      inst.id === req.instrumentId ? { ...inst, status: 'Borrowed' } : inst
    );
    setInstruments(updatedInsts);
    localStorage.setItem('hima_instruments', JSON.stringify(updatedInsts));

    broadcastSync('requests', updatedReqs);
    broadcastSync('inventory', updatedInsts);

    // Instant Notification to Student Account (e.g. M. Iqbal Nur Huda)
    let targetEmails = [];
    if (req.userEmail && req.userEmail !== 'guest@einsten.com') {
      targetEmails.push(req.userEmail);
    }
    
    // Look up in hima_users by borrowerName / borrowerNim / phone
    const savedUsersStr = localStorage.getItem('hima_users');
    if (savedUsersStr) {
      try {
        const users = JSON.parse(savedUsersStr);
        const matched = users.find(u => 
          (u.name && req.borrowerName && u.name.toLowerCase() === req.borrowerName.toLowerCase()) ||
          (u.nim && req.borrowerNim && u.nim === req.borrowerNim) ||
          (u.phone && req.phone && u.phone.replace(/[^0-9]/g, '') === req.phone.replace(/[^0-9]/g, ''))
        );
        if (matched && matched.email && !targetEmails.includes(matched.email)) {
          targetEmails.push(matched.email);
        }
      } catch (e) {}
    }

    // Special mapping for Muhammad Iqbal Nur Huda / M. Iqbal Nur Huda
    if (req.borrowerName && (req.borrowerName.toLowerCase().includes('iqbal') || req.borrowerName.toLowerCase().includes('huda'))) {
      ['M. Iqbal Nur Huda@einsten.com', 'Muhammad Iqbal Nur Huda@einsten.com'].forEach(em => {
        if (!targetEmails.includes(em)) targetEmails.push(em);
      });
    }

    if (targetEmails.length === 0) {
      targetEmails.push(req.userEmail || 'guest@einsten.com');
    }

    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];

    targetEmails.forEach((email, idx) => {
      notifsList.push({
        id: Date.now() + idx,
        recipientEmail: email,
        recipientNim: req.borrowerNim || '022400042',
        message: `✅ Permohonan peminjaman alat "${req.instrumentName}" (${req.instrumentId}) Anda telah DISETUJUI (ACC) oleh Operator Logistik! Silakan ambil alat di Laboratorium / Ruang HIMA Einstein.`,
        read: false,
        timestamp: Date.now() + idx
      });
    });

    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));
    broadcastSync('notifications', notifsList);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hima_sync_notifications', { detail: notifsList }));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} disetujui (ACC) & notifikasi terkirim ke akun peminjam!`, 'success');
  };

  const handleRejectRequest = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Rejected' } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));
    broadcastSync('requests', updatedReqs);

    // Notification on reject
    let targetEmails = [];
    if (req.userEmail && req.userEmail !== 'guest@einsten.com') {
      targetEmails.push(req.userEmail);
    }
    const savedUsersStr = localStorage.getItem('hima_users');
    if (savedUsersStr) {
      try {
        const users = JSON.parse(savedUsersStr);
        const matched = users.find(u => 
          (u.name && req.borrowerName && u.name.toLowerCase() === req.borrowerName.toLowerCase()) ||
          (u.nim && req.borrowerNim && u.nim === req.borrowerNim)
        );
        if (matched && matched.email && !targetEmails.includes(matched.email)) {
          targetEmails.push(matched.email);
        }
      } catch (e) {}
    }
    if (req.borrowerName && (req.borrowerName.toLowerCase().includes('iqbal') || req.borrowerName.toLowerCase().includes('huda'))) {
      ['M. Iqbal Nur Huda@einsten.com', 'Muhammad Iqbal Nur Huda@einsten.com'].forEach(em => {
        if (!targetEmails.includes(em)) targetEmails.push(em);
      });
    }
    if (targetEmails.length === 0) targetEmails.push(req.userEmail || 'guest@einsten.com');

    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];

    targetEmails.forEach((email, idx) => {
      notifsList.push({
        id: Date.now() + idx,
        recipientEmail: email,
        recipientNim: req.borrowerNim || '022400042',
        message: `❌ Permohonan peminjaman alat "${req.instrumentName}" (${req.instrumentId}) Anda DITOLAK oleh Operator Logistik. Silakan hubungi bagian Logistik untuk informasi lebih lanjut.`,
        read: false,
        timestamp: Date.now() + idx
      });
    });

    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));
    broadcastSync('notifications', notifsList);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hima_sync_notifications', { detail: notifsList }));

    showToast(`Permohonan peminjaman oleh ${req.borrowerName} ditolak.`, 'info');
  };

  const handleDeleteRequest = (reqId) => {
    const updatedReqs = borrowRequests.filter(r => r.id !== reqId);
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));
    broadcastSync('requests', updatedReqs);
    showToast('Riwayat permohonan berhasil dihapus.', 'success');
  };

  // Mark loan as Returned (Pengembalian Barang)
  const handleMarkReturned = (reqId) => {
    const req = borrowRequests.find(r => r.id === reqId);
    if (!req) return;

    // 1. Update borrow request status to 'Returned'
    const updatedReqs = borrowRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Returned', returnedAt: new Date().toLocaleDateString('id-ID') } : r
    );
    setBorrowRequests(updatedReqs);
    localStorage.setItem('hima_borrow_requests', JSON.stringify(updatedReqs));

    // 2. Set instrument status back to 'Available'
    const updatedInsts = instruments.map(inst => 
      inst.id === req.instrumentId ? { ...inst, status: 'Available' } : inst
    );
    setInstruments(updatedInsts);
    localStorage.setItem('hima_instruments', JSON.stringify(updatedInsts));

    broadcastSync('requests', updatedReqs);
    broadcastSync('inventory', updatedInsts);

    // 3. Send confirmation notification to borrower account
    let targetEmails = [];
    if (req.userEmail && req.userEmail !== 'guest@einsten.com') targetEmails.push(req.userEmail);
    if (req.borrowerName && (req.borrowerName.toLowerCase().includes('iqbal') || req.borrowerName.toLowerCase().includes('huda'))) {
      ['M. Iqbal Nur Huda@einsten.com', 'Muhammad Iqbal Nur Huda@einsten.com'].forEach(em => {
        if (!targetEmails.includes(em)) targetEmails.push(em);
      });
    }
    if (targetEmails.length === 0) targetEmails.push('guest@einsten.com');

    const savedNotifs = localStorage.getItem('hima_notifications');
    const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];

    targetEmails.forEach((email, idx) => {
      notifsList.push({
        id: Date.now() + idx,
        recipientEmail: email,
        recipientNim: req.borrowerNim || '022400042',
        message: `📦 Pengembalian alat "${req.instrumentName}" (${req.instrumentId}) telah DITERIMA dan diverifikasi oleh Operator Logistik. Terima kasih telah meminjam dan menjaga alat inventaris HIMA Einstein.`,
        read: false,
        timestamp: Date.now() + idx
      });
    });

    localStorage.setItem('hima_notifications', JSON.stringify(notifsList));
    broadcastSync('notifications', notifsList);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('hima_sync_notifications', { detail: notifsList }));

    showToast(`Alat "${req.instrumentName}" berhasil ditandai telah dikembalikan & status alat kini Tersedia!`, 'success');
  };

  // Export Borrowers List to Excel
  const handleExportBorrowersList = () => {
    if (borrowRequests.length === 0) {
      showToast('Belum ada data peminjam untuk diekspor!', 'warning');
      return;
    }

    const exportData = borrowRequests.map((r, i) => ({
      'No': i + 1,
      'Nama Peminjam': r.borrowerName || '-',
      'NIM': r.borrowerNim || '-',
      'Program Studi': r.prodi || '-',
      'Angkatan': r.angkatan || '-',
      'No WhatsApp': r.phone || '-',
      'Nama Alat': r.instrumentName || '-',
      'Kode Alat': r.instrumentId || '-',
      'Tanggal Pengajuan': r.date || '-',
      'Tanggal Pengembalian': r.returnedAt || '-',
      'Status': r.status === 'Approved' ? 'Sedang Dipinjam (Aktif)' : r.status === 'Pending' ? 'Menunggu ACC' : r.status === 'Returned' ? 'Sudah Dikembalikan' : 'Ditolak'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Peminjam');
    XLSX.writeFile(wb, `Daftar_Peminjam_Inventaris_HIMA_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Daftar peminjam inventaris berhasil diekspor ke Excel!', 'success');
  };

  // Batch QR Code Download as ZIP
  const handleDownloadAllQrZip = async (targetItems, zipTitle = 'QR_Inventaris_Semua') => {
    if (!targetItems || targetItems.length === 0) {
      showToast('Tidak ada barang untuk di-download QR!', 'warning');
      return;
    }

    try {
      setIsGeneratingZip(true);
      setZipProgress(5);
      showToast(`Sedang men-generate ${targetItems.length} QR Code ke file ZIP...`, 'info');

      const zip = new JSZip();
      const folder = zip.folder('QR_Codes_HIMA_EINSTEN');

      let indexText = `REKAPITULASI QR CODE INVENTARIS HIMA EINSTEN\n`;
      indexText += `Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}\n`;
      indexText += `Total Barang: ${targetItems.length}\n`;
      indexText += `--------------------------------------------------------\n`;

      const total = targetItems.length;

      for (let i = 0; i < total; i++) {
        const item = targetItems[i];
        
        const qrDataUrl = await QRCode.toDataURL(item.id, {
          width: 600,
          margin: 3,
          color: { dark: '#0b132b', light: '#ffffff' }
        });

        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        const safeName = (item.name || 'Barang').replace(/[/\\?%*:|"<>]/g, '_').substring(0, 40);
        const fileName = `[${item.id}]_${safeName}.png`;

        folder.file(fileName, base64Data, { base64: true });
        indexText += `${i + 1}. [${item.id}] ${item.name} | Kategori: ${item.category || '-'} | Stok: ${item.quantity || 1} | File: ${fileName}\n`;

        const currentProgress = Math.round(((i + 1) / total) * 80) + 5;
        setZipProgress(currentProgress);
      }

      folder.file('DAFTAR_BARANG_DAN_KODE_QR.txt', indexText);
      setZipProgress(90);

      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setZipProgress(90 + Math.round(metadata.percent * 0.1));
      });

      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${zipTitle}_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setIsGeneratingZip(false);
      setZipProgress(0);
      showToast(`Sukses! File ZIP berisi ${targetItems.length} QR Code berhasil didownload.`, 'success');
    } catch (err) {
      console.error(err);
      setIsGeneratingZip(false);
      setZipProgress(0);
      showToast('Gagal men-generate file ZIP: ' + err.message, 'error');
    }
  };

  // Metrics
  const totalPhysicalStock = instruments.reduce((sum, inst) => sum + (Number(inst.quantity) || 1), 0);
  const availableCount = instruments.filter(i => i.status === 'Available').length;
  const borrowedCount = instruments.filter(i => i.status !== 'Available').length;
  const pendingRequestsCount = borrowRequests.filter(r => r.status === 'Pending').length;

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Elektronik': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Furniture': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Properti Kegiatan': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ATK': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'P3K': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DANUS': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Olahraga': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSizeBadgeClass = (size) => {
    switch (size) {
      case 'Besar': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Kecil': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Filtered Inventory
  const filteredInstruments = instruments.filter(inst => {
    const matchesCat = selectedCategory === 'Semua' || inst.category === selectedCategory;
    const matchesSize = selectedSize === 'Semua Ukuran' || inst.size === selectedSize;
    const matchesCondition = selectedCondition === 'Semua' || (inst.condition || 'Baik') === selectedCondition;
    const matchesStatus = selectedStatus === 'Semua' 
      ? true 
      : selectedStatus === 'Tersedia' 
        ? inst.status === 'Available' 
        : inst.status !== 'Available';
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (inst.name && inst.name.toLowerCase().includes(q)) || 
      (inst.id && inst.id.toLowerCase().includes(q)) || 
      (inst.category && inst.category.toLowerCase().includes(q)) ||
      (inst.size && inst.size.toLowerCase().includes(q)) ||
      (inst.condition && inst.condition.toLowerCase().includes(q)) ||
      (inst.desc && inst.desc.toLowerCase().includes(q));
    
    return matchesCat && matchesSize && matchesCondition && matchesStatus && matchesSearch;
  });

  // Pagination
  const totalItems = filteredInstruments.length;
  const effectivePageSize = pageSize === 999999 ? (totalItems || 1) : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (validCurrentPage - 1) * effectivePageSize;
  const paginatedInstruments = filteredInstruments.slice(startIdx, startIdx + effectivePageSize);

  // Filtered Borrow Requests (for ACC)
  const filteredBorrowRequests = borrowRequests.filter(req => {
    return borrowReqFilter === 'Semua' || req.status === borrowReqFilter;
  });

  // Borrower Panel Calculations & Filtering
  const activeLoansCount = borrowRequests.filter(r => r.status === 'Approved').length;
  const returnedLoansCount = borrowRequests.filter(r => r.status === 'Returned').length;

  const filteredBorrowersList = borrowRequests.filter(req => {
    const matchesStatus = borrowerStatusFilter === 'Semua' 
      ? true 
      : borrowerStatusFilter === 'Active'
      ? req.status === 'Approved'
      : req.status === borrowerStatusFilter;

    const q = borrowerSearchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (req.borrowerName && req.borrowerName.toLowerCase().includes(q)) ||
      (req.borrowerNim && req.borrowerNim.toLowerCase().includes(q)) ||
      (req.prodi && req.prodi.toLowerCase().includes(q)) ||
      (req.phone && req.phone.includes(q)) ||
      (req.instrumentName && req.instrumentName.toLowerCase().includes(q)) ||
      (req.instrumentId && req.instrumentId.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800 print:pt-0 print:pb-0 print:space-y-3 print:max-w-none print:px-0">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <Box className="w-3.5 h-3.5 text-gold" /> LOGISTIK BACKOFFICE PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Dashboard Logistik & Inventaris
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan database inventaris, registrasi barang baru (manual & spreadsheet), batch download QR code, dan persetujuan (ACC) peminjaman alat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Sinkronkan ulang seluruh data inventaris ke data master Rekapitulasi Inventaris HIMA Excel (140 barang)?')) {
                localStorage.setItem('hima_instruments', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
                localStorage.setItem('hima_inventory_data_version', 'v2026_rekap_master_140_v2');
                setInstruments(DEFAULT_INVENTORY_ITEMS);
                broadcastSync('inventory', DEFAULT_INVENTORY_ITEMS);
                showToast('Database inventaris berhasil disinkronkan ulang ke master data Excel (140 barang)!', 'success');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark text-xs font-bold border border-gold/30 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sinkron Data Master Excel (140)
          </button>

          <button
            type="button"
            onClick={handleExportLiveInventory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor ke Excel
          </button>
        </div>
      </div>

      {/* RISTEK-STYLE TOP TAB MENU (UNDERLINE STYLE) */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-1 print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'overview' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Dashboard Utama & ACC
          {pendingRequestsCount > 0 && (
            <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingRequestsCount} Bth ACC
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'database' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Panel Database Inventaris ({instruments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('peminjam')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'peminjam' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Panel Daftar Peminjam
          {activeLoansCount > 0 && (
            <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              {activeLoansCount} Aktif
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('input')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'input' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Input Barang
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`px-4 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'qr' ? 'text-gold border-gold font-extrabold' : 'text-slate-400 border-transparent hover:text-slate-700'
          }`}
        >
          Batch & Print QR Code
        </button>
      </div>

      {/* Progress Bar for ZIP Generation */}
      {isGeneratingZip && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-col gap-2 animate-fade-in border border-gold/30 print:hidden">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold animate-spin" />
              Men-generate file ZIP QR Code...
            </span>
            <span className="text-gold font-mono">{zipProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gold to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${zipProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL OVERVIEW: DASHBOARD UTAMA LOGISTIK & ACC PEMINJAMAN TERPADU */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('database')}
              className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm hover:border-gold cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jenis Inventaris</span>
                <span className="text-lg font-extrabold text-slate-900 font-heading">{instruments.length} Jenis</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('database')}
              className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm hover:border-gold cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Stok Fisik</span>
                <span className="text-lg font-extrabold text-slate-900 font-heading">{totalPhysicalStock} Unit</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('database')}
              className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm hover:border-gold cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tersedia</span>
                <span className="text-lg font-extrabold text-emerald-700 font-heading">{availableCount} Jenis</span>
              </div>
            </div>

            <div 
              className={`p-4 bg-white border rounded-2xl flex items-center gap-3.5 shadow-sm transition-all ${
                pendingRequestsCount > 0 ? 'border-amber-400 bg-amber-50/20' : 'border-gold-border'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                pendingRequestsCount > 0 ? 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse' : 'bg-rose-50 border border-rose-200 text-rose-600'
              }`}>
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menunggu ACC</span>
                <span className={`text-lg font-extrabold font-heading ${pendingRequestsCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {pendingRequestsCount} Permohonan
                </span>
              </div>
            </div>
          </div>

          {/* COMBINED ACC PERMOHONAN PEMINJAMAN SECTION IN MAIN DASHBOARD */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping"></span>
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold" /> ACC Permohonan Peminjaman Alat
                  </h3>
                  {pendingRequestsCount > 0 && (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-600 text-white animate-pulse">
                      {pendingRequestsCount} Menunggu ACC
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-light">
                  Persetujuan permohonan peminjaman dari mahasiswa. Ketika di-ACC, status alat otomatis menjadi Dipinjam dan notifikasi terkirim.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={borrowReqFilter}
                  onChange={(e) => setBorrowReqFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer shadow-2xs font-semibold"
                >
                  <option value="Semua">Semua Status Permohonan ({borrowRequests.length})</option>
                  <option value="Pending">Menunggu ACC ({pendingRequestsCount})</option>
                  <option value="Approved">Disetujui ({borrowRequests.filter(r => r.status === 'Approved').length})</option>
                  <option value="Rejected">Ditolak ({borrowRequests.filter(r => r.status === 'Rejected').length})</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-gold-border/70 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <th className="px-6 py-3.5">Peminjam</th>
                      <th className="px-6 py-3.5">Alat Lab & Kode</th>
                      <th className="px-6 py-3.5">Tanggal Pengajuan</th>
                      <th className="px-6 py-3.5">Status Otoritas</th>
                      <th className="px-6 py-3.5 text-center">Tindakan ACC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {filteredBorrowRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">Tidak ada permohonan dengan filter ini</p>
                          <p className="text-xs text-slate-400">Permohonan peminjaman dari mahasiswa melalui katalog Space akan muncul otomatis di sini.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBorrowRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 text-sm">{req.borrowerName}</p>
                            {req.prodi && req.angkatan ? (
                              <p className="text-[11px] text-slate-500 font-mono">{req.prodi} ({req.angkatan})</p>
                            ) : (
                              <p className="text-[11px] text-slate-500 font-mono">NIM: {req.borrowerNim}</p>
                            )}
                            {req.phone && (
                              <a
                                href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                💬 WA: {req.phone}
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{req.instrumentName}</p>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] mt-0.5">
                              {req.instrumentId}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">{req.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              req.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-500/30'
                                : req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-500/30'
                                : 'bg-rose-50 text-rose-700 border-rose-500/30'
                            }`}>
                              {req.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                              {req.status === 'Pending' ? 'Menunggu ACC' : req.status === 'Approved' ? 'Disetujui (ACC)' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {req.status === 'Pending' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-emerald-700 font-bold rounded-xl text-xs active:scale-95 cursor-pointer shadow-2xs"
                                  >
                                    <UserCheck className="w-4 h-4" /> ACC / Setujui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all text-rose-700 font-bold rounded-xl text-xs active:scale-95 cursor-pointer shadow-2xs"
                                  >
                                    <UserX className="w-4 h-4" /> Tolak
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-slate-600 font-semibold rounded-xl text-xs active:scale-95 cursor-pointer"
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

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div 
              onClick={() => setActiveTab('database')}
              className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-gold hover:shadow-sm transition-all cursor-pointer shadow-2xs"
            >
              <Box className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-slate-900 text-sm">Panel Database Inventaris</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Cari 140 barang inventaris, edit stok, ganti foto, ubah kondisi, dan status ketersediaan.</p>
              <span className="text-xs font-bold text-gold-dark block pt-1">Buka Database ({instruments.length} Item) &rarr;</span>
            </div>

            <div 
              onClick={() => setActiveTab('peminjam')}
              className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-gold hover:shadow-sm transition-all cursor-pointer shadow-2xs"
            >
              <Users className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-slate-900 text-sm">Panel Daftar Peminjam</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Rekap data siapa saja yang sedang meminjam alat, kontak WA, dan konfirmasi pengembalian.</p>
              <span className="text-xs font-bold text-gold-dark block pt-1">Buka Daftar Peminjam ({activeLoansCount} Aktif) &rarr;</span>
            </div>

            <div 
              onClick={() => setActiveTab('input')}
              className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-gold hover:shadow-sm transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-slate-900 text-sm">Input Barang</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Formulir pendaftaran barang baru atau import file Excel/CSV secara otomatis.</p>
              <span className="text-xs font-bold text-gold-dark block pt-1">Buka Formulir Input &rarr;</span>
            </div>

            <div 
              onClick={() => setActiveTab('qr')}
              className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-gold hover:shadow-sm transition-all cursor-pointer shadow-2xs"
            >
              <QrCode className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-slate-900 text-sm">Batch & Print QR Code</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Generate kode QR untuk label inventaris dan download seluruhnya dalam file ZIP.</p>
              <span className="text-xs font-bold text-gold-dark block pt-1">Buka Panel QR Code &rarr;</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 1: DATABASE INVENTARIS (SEARCH, EDIT STOK, KONDISI, GAMBAR, PAGINATION) */}
      {/* ========================================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Pending ACC Alert Banner in Database Tab */}
          {pendingRequestsCount > 0 && (
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <div>
                  <span className="font-bold text-amber-950">Pemberitahuan ACC: </span>
                  <span>Terdapat <strong>{pendingRequestsCount} permohonan peminjaman baru</strong> dari mahasiswa yang menunggu persetujuan (ACC)!</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <UserCheck className="w-3.5 h-3.5" /> Buka Panel ACC &rarr;
              </button>
            </div>
          )}
          
          {/* Category Filter & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gold" /> Kategori Inventaris ({INVENTORY_CATEGORIES.length - 1}):
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadAllQrZip(filteredInstruments, `QR_Inventaris_${selectedCategory !== 'Semua' ? selectedCategory : 'Terfilter'}`)}
                disabled={isGeneratingZip || filteredInstruments.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Unduh QR Terfilter ({filteredInstruments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('input')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark text-xs font-bold border border-gold/30 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-gold-dark" /> Tambah Barang
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {INVENTORY_CATEGORIES.map(cat => {
              const count = cat === 'Semua' ? instruments.length : instruments.filter(i => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected ? 'bg-gold text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-gold/40 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Multi-Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama barang (misal: pompa portabel), kode ID, kondisi, deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
              >
                {INVENTORY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="Semua">Semua Kondisi</option>
                <option value="Baik">Kondisi: Baik</option>
                <option value="Cukup">Kondisi: Cukup</option>
                <option value="Rusak">Kondisi: Rusak</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Tersedia">Tersedia (Ready)</option>
                <option value="Dipinjam">Sedang Dipinjam</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value={10}>10 per hal</option>
                <option value={15}>15 per hal</option>
                <option value={25}>25 per hal</option>
                <option value={50}>50 per hal</option>
                <option value={100}>100 per hal</option>
                <option value={999999}>Tampilkan Semua</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Barang & Foto</th>
                    <th className="px-5 py-4">Kode ID</th>
                    <th className="px-5 py-4">Klasifikasi</th>
                    <th className="px-5 py-4">Stok Fisik</th>
                    <th className="px-5 py-4">Kondisi</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">QR Code</th>
                    <th className="px-5 py-4 text-center">Edit / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {paginatedInstruments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                        <Box className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-600">Tidak ada barang yang cocok</p>
                        <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau reset filter.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInstruments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {inst.image && (inst.image.startsWith('/') || inst.image.startsWith('http') || inst.image.startsWith('data:')) ? (
                              <img 
                                src={inst.image} 
                                alt={inst.name} 
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleOpenEdit(inst)}
                                title="Klik untuk edit barang & ganti foto"
                              />
                            ) : (
                              <div 
                                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 cursor-pointer hover:bg-gold/10 transition-colors"
                                onClick={() => handleOpenEdit(inst)}
                                title="Klik untuk edit barang"
                              >
                                {inst.image || '📦'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm">{inst.name}</p>
                              {inst.desc && (
                                <p className="text-[11px] text-slate-400 font-light truncate max-w-xs">{inst.desc}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-slate-800 font-bold text-xs bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                            {inst.id}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            {inst.category && (
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(inst.category)}`}>
                                {inst.category}
                              </span>
                            )}
                            {inst.size && (
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getSizeBadgeClass(inst.size)}`}>
                                Ukuran: {inst.size}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-extrabold text-slate-900 text-sm font-heading">{inst.quantity || 1}</span> Unit
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                            (inst.condition || 'Baik') === 'Baik' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : (inst.condition === 'Rusak' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200')
                          }`}>
                            {inst.condition || 'Baik'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            inst.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-500/30' : 'bg-rose-50 text-rose-700 border-rose-500/30'
                          }`}>
                            {inst.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedQrInstrument(inst)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-gold/10 hover:text-gold-dark hover:border-gold/30 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
                          >
                            <QrCode className="w-3.5 h-3.5 text-gold-dark" />
                            <span>QR</span>
                          </button>
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(inst)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Barang</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(inst.id)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                                inst.status === 'Available' ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {inst.status === 'Available' ? <><ToggleLeft className="w-3.5 h-3.5" /> Pinjam</> : <><ToggleRight className="w-3.5 h-3.5" /> Ready</>}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInstrument(inst.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredInstruments.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="font-medium">
                  Menampilkan <strong className="text-slate-900">{startIdx + 1}</strong> – <strong className="text-slate-900">{Math.min(startIdx + effectivePageSize, totalItems)}</strong> dari <strong className="text-slate-900">{totalItems}</strong> barang
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      disabled={validCurrentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={validCurrentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || (p >= validCurrentPage - 2 && p <= validCurrentPage + 2))
                        .map((page, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const hasGap = prevPage && page - prevPage > 1;
                          return (
                            <React.Fragment key={page}>
                              {hasGap && <span className="px-1 text-slate-400">...</span>}
                              <button
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                  validCurrentPage === page ? 'bg-gold text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={validCurrentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={validCurrentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 3: DAFTAR PEMINJAM & RIWAYAT PEMINJAMAN ALAT */}
      {/* ========================================================================= */}
      {activeTab === 'peminjam' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sedang Meminjam</span>
                <span className="text-lg font-extrabold text-emerald-700 font-heading">{activeLoansCount} Orang</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alat Dipinjam</span>
                <span className="text-lg font-extrabold text-blue-700 font-heading">{activeLoansCount} Unit</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menunggu ACC</span>
                <span className="text-lg font-extrabold text-amber-600 font-heading">{pendingRequestsCount} Permohonan</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-gold-border rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <CheckCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sudah Selesai</span>
                <span className="text-lg font-extrabold text-slate-700 font-heading">{returnedLoansCount} Kali</span>
              </div>
            </div>
          </div>

          {/* Search, Filter, and Export Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari peminjam (nama, NIM, prodi, no WA, nama/kode alat)..."
                value={borrowerSearchQuery}
                onChange={(e) => setBorrowerSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:bg-white transition-all"
              />
              {borrowerSearchQuery && (
                <button 
                  onClick={() => setBorrowerSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={borrowerStatusFilter}
                onChange={(e) => setBorrowerStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="Semua">Semua Status ({borrowRequests.length})</option>
                <option value="Active">Sedang Meminjam ({activeLoansCount})</option>
                <option value="Pending">Menunggu ACC ({pendingRequestsCount})</option>
                <option value="Returned">Sudah Dikembalikan ({returnedLoansCount})</option>
                <option value="Rejected">Ditolak ({borrowRequests.filter(r => r.status === 'Rejected').length})</option>
              </select>

              <button
                type="button"
                onClick={handleExportBorrowersList}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor ke Excel
              </button>
            </div>
          </div>

          {/* Table of Borrowers */}
          <div className="bg-white border border-gold-border/70 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="px-6 py-3.5">Identitas Peminjam</th>
                    <th className="px-6 py-3.5">Barang & Kode Alat</th>
                    <th className="px-6 py-3.5">Tanggal Pinjam</th>
                    <th className="px-6 py-3.5">Status Peminjaman</th>
                    <th className="px-6 py-3.5 text-center">Tindakan Logistik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {filteredBorrowersList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-600">Tidak ada data peminjam yang cocok</p>
                        <p className="text-xs text-slate-400">Data mahasiswa yang mengajukan atau sedang meminjam alat akan terdaftar otomatis di sini.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBorrowersList.map((req) => {
                      const isApproved = req.status === 'Approved';
                      const isPending = req.status === 'Pending';
                      const isReturned = req.status === 'Returned';
                      const isRejected = req.status === 'Rejected';

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gold/10 text-gold-dark font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                {(req.borrowerName || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{req.borrowerName}</p>
                                {req.prodi && req.angkatan ? (
                                  <p className="text-[11px] text-slate-500 font-mono">{req.prodi} ({req.angkatan})</p>
                                ) : (
                                  <p className="text-[11px] text-slate-500 font-mono">NIM: {req.borrowerNim}</p>
                                )}
                                {req.phone && (
                                  <a
                                    href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                                  >
                                    💬 WA: {req.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{req.instrumentName}</p>
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] mt-0.5 border border-slate-200">
                              {req.instrumentId}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-slate-700 font-mono text-[11px]">{req.date}</p>
                            {req.returnedAt && (
                              <p className="text-[10px] text-slate-400 font-mono">Kembali: {req.returnedAt}</p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-500/30'
                                : isPending
                                ? 'bg-amber-50 text-amber-700 border-amber-500/30'
                                : isReturned
                                ? 'bg-slate-100 text-slate-700 border-slate-300'
                                : 'bg-rose-50 text-rose-700 border-rose-500/30'
                            }`}>
                              {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                              {isApproved && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                              {isApproved ? 'Sedang Dipinjam' : isPending ? 'Menunggu ACC' : isReturned ? 'Sudah Kembali' : 'Ditolak'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isApproved && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkReturned(req.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 hover:bg-blue-600 hover:text-white transition-all text-blue-700 font-bold rounded-xl text-xs active:scale-95 cursor-pointer shadow-2xs"
                                >
                                  <CheckCheck className="w-4 h-4" /> Tandai Kembali
                                </button>
                              )}

                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-emerald-700 font-bold rounded-xl text-xs active:scale-95 cursor-pointer shadow-2xs"
                                  >
                                    <UserCheck className="w-4 h-4" /> ACC
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all text-rose-700 font-bold rounded-xl text-xs active:scale-95 cursor-pointer shadow-2xs"
                                  >
                                    <UserX className="w-4 h-4" /> Tolak
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(req.id)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-slate-600 font-semibold rounded-xl text-xs active:scale-95 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 2: INPUT BARANG MANUAL & BATCH SPREADSHEET */}
      {/* ========================================================================= */}
      {activeTab === 'input' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-md">
            <button
              type="button"
              onClick={() => setRegMode('manual')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                regMode === 'manual' ? 'bg-white text-gold-dark shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" /> Input Manual (Satu per Satu)
            </button>
            <button
              type="button"
              onClick={() => setRegMode('batch')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                regMode === 'batch' ? 'bg-white text-gold-dark shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Upload Spreadsheet (Excel / CSV)
            </button>
          </div>

          {regMode === 'manual' ? (
            <div className="bg-white border border-gold-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-left max-w-3xl">
              <div className="mb-6 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
                  <Plus className="w-4 h-4 text-gold" /> REGISTRASI SATUAN
                </div>
                <h3 className="text-xl font-bold text-slate-900">Daftarkan Barang Baru ke Inventaris</h3>
                <p className="text-xs text-slate-500">Lengkapi formulir di bawah ini untuk menambahkan barang fisik ke sistem manajemen aset HIMA.</p>
              </div>

              <form onSubmit={handleRegisterInstrument} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Nama Barang / Aset <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Solder Uap, Mesin Bor, Pompa Portabel"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-gold focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Kode ID Inventaris <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: ASL-ELK-10-2025"
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-gold font-mono uppercase focus:bg-white transition-all font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const catCode = newCategory.substring(0, 3).toUpperCase();
                          const randomNum = Math.floor(100 + Math.random() * 900);
                          setNewId(`ASL-${catCode}-${randomNum}-2026`);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-all cursor-pointer"
                      >
                        Auto ID
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      {INVENTORY_CATEGORIES.filter(c => c !== 'Semua').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Ukuran</label>
                    <select
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      {INVENTORY_SIZES.filter(s => s !== 'Semua Ukuran').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Jumlah / Stok Fisik</label>
                    <input 
                      type="number"
                      min="1"
                      required
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kondisi Fisik</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      <option value="Baik">Baik (Normal Operasional)</option>
                      <option value="Cukup">Cukup / Perlu Perawatan</option>
                      <option value="Rusak">Rusak / Tidak Layak Pakai</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Foto Barang <span className="text-slate-400 font-normal lowercase">(opsional, maks 1MB)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        key={formKey}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                      />
                      {newImage && (
                        <div className="relative w-16 h-16 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                          <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewImage('')}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Deskripsi / Spesifikasi / Lokasi Simpan</label>
                    <textarea 
                      placeholder="Tulis keterangan spesifikasi, lokasi penyimpanan di lemari lab, atau fungsi alat..."
                      rows="3"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-gold resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-extrabold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" /> Daftarkan Barang Baru
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-gold-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-left max-w-3xl space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
                  <FileSpreadsheet className="w-4 h-4 text-gold" /> BATCH IMPORT SPREADSHEET
                </div>
                <h3 className="text-xl font-bold text-slate-900">Upload File Spreadsheet (Excel & CSV)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Impor puluhan hingga ratusan inventaris sekaligus secara instan ke sistem.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Unduh Contoh Template Format Tabel:</span>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Format Excel (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Format CSV (.csv)
                  </button>
                </div>
              </div>

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
                className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                  isDragging ? 'border-gold bg-gold/10 scale-98' : 'border-slate-300 hover:border-gold hover:bg-slate-50'
                }`}
              >
                <Upload className="w-10 h-10 text-gold mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-bold text-slate-800">
                  {excelFile ? excelFile.name : 'Klik atau Tarik File Spreadsheet ke Sini'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Mendukung file Excel (.xlsx, .xls) & CSV
                </p>
              </div>

              {excelPreviewData.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {excelPreviewData.length} Barang Terbaca & Siap Didaftarkan
                    </span>
                    <button
                      type="button"
                      onClick={() => { setExcelFile(null); setExcelPreviewData([]); }}
                      className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      Batal / Reset
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl bg-slate-50 text-xs divide-y divide-slate-200 shadow-inner">
                    {excelPreviewData.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">
                            {item.id} • {item.category || 'Properti'} • Ukuran: {item.size || 'Medium'}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                          {item.quantity || 1} Unit ({item.condition || 'Baik'})
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleBulkRegister}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-2xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" /> Daftarkan {excelPreviewData.length} Barang Sekaligus ke Inventaris
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 3: BATCH & PRINT QR CODE */}
      {/* ========================================================================= */}
      {activeTab === 'qr' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-black font-heading text-white">
                Download & Cetak QR Code Inventaris Sekaligus
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Unduh seluruh QR Code untuk <strong>{instruments.length} barang inventaris</strong> dalam satu file arsip <strong>.ZIP</strong> secara langsung dengan resolusi tinggi, atau cetak lembar stiker A4.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadAllQrZip(instruments, 'Semua_QR_Inventaris_HIMA')}
                disabled={isGeneratingZip}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gold/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isGeneratingZip ? `Sedang Membuat ZIP (${zipProgress}%)...` : `Download Semua QR (${instruments.length} Barang) .ZIP`}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gold-light" />
                <span>Cetak Lembar Stiker QR (Print Sheet)</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* PRINT-ONLY OFFICIAL KOP SURAT HEADER */}
            <div className="hidden print:block pb-2 mb-3">
              <div className="flex items-center justify-between gap-4 pb-2 border-b-2 border-slate-900">
                <img 
                  src="/Media/Logo HIma/logo hima warna transparan.png" 
                  alt="Logo HIMA Einsten" 
                  className="h-20 sm:h-24 w-auto object-contain shrink-0" 
                  onError={(e) => {
                    e.target.src = "/logo-hima-transparan.png";
                  }}
                />
                <div className="text-right flex flex-col justify-center">
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 leading-tight">
                    HIMPUNAN MAHASISWA ELEKTRONIKA INSTRUMENTASI
                  </h2>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 leading-tight">
                    POLITEKNIK TEKNOLOGI NUKLIR INDONESIA
                  </h3>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 leading-tight">
                    BADAN RISET DAN INOVASI NASIONAL
                  </h4>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-900">
                  QR CODE ASET DAN LOGISTIK
                </h1>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                  Total: {instruments.length} Unit Inventaris • Dicetak: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between print:hidden">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-gold" /> Preview Lembar Stiker QR ({instruments.length} Barang)
              </h3>
              <span className="text-xs text-slate-500">Format stiker ukuran standar A4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 print:grid-cols-4 print:gap-2.5">
              {instruments.map((inst) => (
                <div 
                  key={inst.id}
                  className="bg-white border border-slate-300 rounded-xl p-2.5 flex flex-col items-center text-center shadow-2xs hover:border-gold/50 transition-all print:border-slate-800 print:rounded-lg print:p-2 print:shadow-none print:break-inside-avoid"
                >
                  <div className="w-full text-left border-b border-slate-200 pb-1 mb-1 print:pb-0.5 print:mb-1">
                    <p className="font-bold text-slate-900 text-xs truncate print:text-[11px] leading-tight" title={inst.name}>{inst.name}</p>
                    <p className="font-mono text-[10px] text-slate-600 font-bold print:text-[9px]">{inst.id}</p>
                  </div>

                  <div className="p-1 bg-white flex items-center justify-center my-auto">
                    {qrCodeMap[inst.id] ? (
                      <img 
                        src={qrCodeMap[inst.id]}
                        alt={inst.name}
                        className="w-24 h-24 object-contain print:w-24 print:h-24 mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        Memuat QR...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* ========================================================================= */}
      {/* MODAL 1: EDIT INVENTARIS ITEM (EDIT STOK, FOTO, KONDISI, STATUS, DLL) */}
      {/* ========================================================================= */}
      {editingInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-gold-border rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative text-left space-y-5 animate-slide-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] text-gold-dark font-bold tracking-widest uppercase">
                  <Edit3 className="w-3.5 h-3.5 text-gold" /> EDIT DATA INVENTARIS
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  Edit: {editingInstrument.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingInstrument(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider block">
                  Nama Barang / Aset <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider block">
                  Kode ID Inventaris <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-gold font-mono uppercase font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                  >
                    {INVENTORY_CATEGORIES.filter(c => c !== 'Semua').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block">Ukuran</label>
                  <select
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                  >
                    {INVENTORY_SIZES.filter(s => s !== 'Semua Ukuran').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block">Jumlah / Stok</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-gold font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block">Kondisi</label>
                  <select
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup / Rawat</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold cursor-pointer font-bold"
                  >
                    <option value="Available">Tersedia (Ready)</option>
                    <option value="Borrowed">Sedang Dipinjam</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider block">
                  Foto Barang <span className="text-slate-400 font-normal lowercase">(upload foto baru)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="flex-1 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer"
                  />
                  {editImage && (
                    <div className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                      {editImage.startsWith('/') || editImage.startsWith('http') || editImage.startsWith('data:') ? (
                        <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">{editImage}</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditImage('📦')}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-rose-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider block">Deskripsi / Spesifikasi / Lokasi</label>
                <textarea 
                  rows="2"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingInstrument(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 bg-gold hover:brightness-110 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SINGLE QR CODE MODAL */}
      {/* ========================================================================= */}
      {selectedQrInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-gold-border rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4 animate-slide-in">
            <button
              onClick={() => setSelectedQrInstrument(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest block">
                QR Code Aset & Logistik HIMA
              </span>
              <h3 className="text-base font-extrabold text-slate-900 truncate">
                {selectedQrInstrument.name}
              </h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 py-0.5 px-2.5 rounded-lg border border-slate-200">
                  {selectedQrInstrument.id}
                </span>
                {selectedQrInstrument.category && (
                  <span className={`text-[10px] font-bold py-0.5 px-2 rounded-lg border ${getCategoryBadgeClass(selectedQrInstrument.category)}`}>
                    {selectedQrInstrument.category}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-dashed border-gold-border rounded-2xl inline-block shadow-inner mx-auto">
              {singleQrDataUrl ? (
                <img 
                  src={singleQrDataUrl}
                  alt={`QR Code ${selectedQrInstrument.name}`}
                  className="w-48 h-48 object-contain mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-gold" />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={singleQrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(selectedQrInstrument.id)}`}
                download={`QR_${selectedQrInstrument.id}_${(selectedQrInstrument.name || 'barang').replace(/\s+/g, '_')}.png`}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh PNG
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
