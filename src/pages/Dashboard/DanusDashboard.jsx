import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, CheckCircle, Clock, Trash2, ArrowUpRight, Package, 
  Plus, TrendingUp, TrendingDown, Coins, Wallet, FileSpreadsheet,
  Edit3, Image, Upload, Eye, X, Sparkles, Check, Search, RefreshCw
} from 'lucide-react';
import { DEFAULT_MARKET_PRODUCTS } from '../Market';

export default function DanusDashboard({ showToast }) {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('finance'); // 'finance' | 'products' | 'orders'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'Pending' | 'Active'
  const [previewProof, setPreviewProof] = useState(null);

  // Danus Cash Ledger State
  const [danusRecords, setDanusRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('in');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Kas Operasional');

  // Products Management State
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Merchandise',
    desc: '',
    image: '',
    status: 'Tersedia'
  });
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const DEFAULT_ORDERS = [
    { id: 1, name: 'Zacky Elins', items: 'Baju PDH Elins (1x)', total: 180000, file: 'bukti_zacky.png', status: 'Active' },
    { id: 2, name: 'Dian Pratama', items: 'Magic Com (1x), Meja Belajar (1x)', total: 270000, file: 'bukti_dian.jpg', status: 'Pending' }
  ];

  const DEFAULT_DANUS_RECORDS = [
    { id: 101, date: '2026-07-05', desc: 'Suntikan Dana Operasional Usaha', type: 'in', amount: 500000, category: 'Kas Operasional' },
    { id: 102, date: '2026-07-10', desc: 'Modal Pembelian Bahan & Kain PDH', type: 'out', amount: 250000, category: 'Modal Produksi' }
  ];

  // Load Initial Data
  const loadData = () => {
    // 1. Orders
    const savedOrders = localStorage.getItem('hima_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders(DEFAULT_ORDERS);
      }
    } else {
      localStorage.setItem('hima_orders', JSON.stringify(DEFAULT_ORDERS));
      setOrders(DEFAULT_ORDERS);
    }

    // 2. Danus Ledger
    const savedDanusLedger = localStorage.getItem('hima_danus_ledger');
    if (savedDanusLedger) {
      try {
        setDanusRecords(JSON.parse(savedDanusLedger));
      } catch (e) {
        setDanusRecords(DEFAULT_DANUS_RECORDS);
      }
    } else {
      localStorage.setItem('hima_danus_ledger', JSON.stringify(DEFAULT_DANUS_RECORDS));
      setDanusRecords(DEFAULT_DANUS_RECORDS);
    }

    // 3. Products
    const savedProducts = localStorage.getItem('hima_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          localStorage.setItem('hima_products', JSON.stringify(DEFAULT_MARKET_PRODUCTS));
          setProducts(DEFAULT_MARKET_PRODUCTS);
        }
      } catch (e) {
        setProducts(DEFAULT_MARKET_PRODUCTS);
      }
    } else {
      localStorage.setItem('hima_products', JSON.stringify(DEFAULT_MARKET_PRODUCTS));
      setProducts(DEFAULT_MARKET_PRODUCTS);
    }
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('hima_sync_products', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('hima_sync_products', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // ─── ORDER MANAGEMENT HANDLERS ────────────────────────────────
  const handleUpdateStatus = (id, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('hima_orders', JSON.stringify(updated));
    showToast(`Pesanan berhasil diubah menjadi: ${newStatus === 'Active' ? 'Terverifikasi (Lunas)' : 'Pending'}!`, 'success');
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pesanan ini?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('hima_orders', JSON.stringify(updated));
      showToast('Data pesanan telah dihapus.', 'info');
    }
  };

  // ─── CASH LEDGER HANDLERS ─────────────────────────────────────
  const handleAddDanusTransaction = (e) => {
    e.preventDefault();
    if (!desc || !amount) {
      showToast('Mohon lengkapi seluruh form transaksi Danus!', 'error');
      return;
    }

    const newRecord = {
      id: Date.now(),
      date,
      desc,
      type,
      amount: parseFloat(amount),
      category
    };

    const updated = [newRecord, ...danusRecords];
    setDanusRecords(updated);
    localStorage.setItem('hima_danus_ledger', JSON.stringify(updated));
    showToast('Transaksi kas Danus berhasil dicatat!', 'success');

    setDesc('');
    setAmount('');
  };

  const handleDeleteDanusTransaction = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan kas Danus ini?')) {
      const updated = danusRecords.filter(r => r.id !== id);
      setDanusRecords(updated);
      localStorage.setItem('hima_danus_ledger', JSON.stringify(updated));
      showToast('Catatan transaksi Danus telah dihapus.', 'info');
    }
  };

  // ─── PRODUCT CRUD HANDLERS ────────────────────────────────────
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar (maksimal 2MB)!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
        showToast('Foto produk berhasil diunggah!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Nama produk dan harga wajib diisi!', 'error');
      return;
    }

    if (editingProductId) {
      // Update existing product
      const updated = products.map(p => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: productForm.name,
            price: parseFloat(productForm.price),
            category: productForm.category,
            desc: productForm.desc,
            image: productForm.image || p.image,
            status: productForm.status
          };
        }
        return p;
      });

      setProducts(updated);
      localStorage.setItem('hima_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('hima_sync_products'));
      showToast(`Produk "${productForm.name}" berhasil diperbarui!`, 'success');
      resetProductForm();
    } else {
      // Add new product
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        price: parseFloat(productForm.price),
        category: productForm.category,
        desc: productForm.desc,
        image: productForm.image || '/Media/Media yg dijual/Baju PDH Elins 180.000/PDH Einsten.png',
        status: productForm.status
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      localStorage.setItem('hima_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('hima_sync_products'));
      showToast(`Produk baru "${newProduct.name}" berhasil ditambahkan ke Einsten Market!`, 'success');
      resetProductForm();
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category || 'Merchandise',
      desc: product.desc || '',
      image: product.image || '',
      status: product.status || 'Tersedia'
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}" dari Einsten Market?`)) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('hima_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('hima_sync_products'));
      showToast(`Produk "${name}" telah dihapus.`, 'info');
      if (editingProductId === id) resetProductForm();
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      price: '',
      category: 'Merchandise',
      desc: '',
      image: '',
      status: 'Tersedia'
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── CALCULATIONS ─────────────────────────────────────────────
  const salesEarnings = orders
    .filter(o => o.status === 'Active')
    .reduce((sum, o) => sum + o.total, 0);

  const danusCashIn = danusRecords
    .filter(r => r.type === 'in')
    .reduce((sum, r) => sum + r.amount, 0);

  const danusCashOut = danusRecords
    .filter(r => r.type === 'out')
    .reduce((sum, r) => sum + r.amount, 0);

  const danusNetCash = danusCashIn - danusCashOut;
  const totalDanusConsolidated = salesEarnings + danusNetCash;

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const verifiedOrdersCount = orders.filter(o => o.status === 'Active').length;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Filtered Orders for Tab 3
  const filteredOrders = orders.filter(o => {
    const matchFilter = orderFilter === 'all' ? true : o.status === orderFilter;
    const matchSearch = orderSearch.trim() === '' || 
      o.name.toLowerCase().includes(orderSearch.toLowerCase()) || 
      (o.items && o.items.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-bold tracking-widest uppercase">
            <ShoppingBag className="w-3.5 h-3.5 text-gold" /> DANUS OPERATOR & TREASURY CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wider">
            Merchandise & Danus Financial Board
          </h1>
          <p className="text-xs text-slate-500 font-light">
            Pengelolaan arus kas wirausaha, input katalog produk Einsten Market, serta validasi pesanan QRIS merchandise.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-slate-200 shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Sinkron Data
        </button>
      </div>

      {/* ── TOP NAVIGATION BARS / PANEL SWITCHER ── */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-1.5">
          {/* Tab 1: Catatan Keuangan */}
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-205 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Wallet className={`w-4 h-4 ${activeTab === 'finance' ? 'text-gold' : 'text-slate-400'}`} />
            <span>Catatan Keuangan</span>
          </button>

          {/* Tab 2: Input Produk */}
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-205 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-gold' : 'text-slate-400'}`} />
            <span>Input Produk</span>
          </button>

          {/* Tab 3: Verifikasi Pembelian */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-205 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${activeTab === 'orders' ? 'text-gold' : 'text-slate-400'}`} />
            <span>Verifikasi Pembelian</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── PANEL 1: CATATAN KEUANGAN DANUS ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stream 1: Hasil Penjualan */}
            <div className="p-5 bg-white border border-gold-border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Hasil Penjualan</span>
                <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {formatRupiah(salesEarnings)}
                </h3>
                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {verifiedOrdersCount} Pesanan Terverifikasi
                </p>
              </div>
            </div>

            {/* Stream 2: Keuangan Dana Usaha Photisma */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Keuangan Dana Usaha Photisma</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {formatRupiah(danusNetCash)}
                </h3>
                <p className="text-[10px] text-slate-500 font-light mt-0.5">
                  Sisa Modal & Arus Kas Operasional
                </p>
              </div>
            </div>

            {/* Combined Total: Total Photisma Finance */}
            <div className="p-5 bg-emerald-50/50 border border-emerald-200/60 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Total Photisma Finance</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-extrabold text-emerald-950 font-heading">
                  {formatRupiah(totalDanusConsolidated)}
                </h3>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  Konsolidasi Penjualan & Kas
                </p>
              </div>
            </div>

            {/* Order Status Counts */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status Pesanan</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {pendingOrdersCount} Pending
                </h3>
                <p className="text-[10px] text-slate-500 font-light mt-0.5">
                  Dari Total {orders.length} Transaksi
                </p>
              </div>
            </div>
          </div>

          {/* Section: Catat Keuangan Danus & Jurnal Kas Operasional Danus */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Form Pencatatan Kas Danus */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-gold" /> Catat Keuangan Danus
                </h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  Input arus kas masuk/keluar operasional divisi Danus (modal, cetak merch, dsb).
                </p>
              </div>

              <form onSubmit={handleAddDanusTransaction} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Jenis Transaksi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType('in')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        type === 'in'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Kas Masuk (In)
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('out')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        type === 'out'
                          ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingDown className="w-3.5 h-3.5" /> Kas Keluar (Out)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Kategori Danus</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Kas Operasional">Kas Operasional Danus</option>
                    <option value="Modal Produksi">Modal Produksi Merchandise</option>
                    <option value="Biaya Kemasan & Pengiriman">Biaya Kemasan & Logistik</option>
                    <option value="Suntikan Dana Usaha">Suntikan Dana Usaha</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Beli kemasan hampers Danus"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 150000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Simpan Transaksi Kas Danus
                </button>
              </form>
            </div>

            {/* Tabel Jurnal Kas Operasional Danus */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-4.5 h-4.5 text-gold" /> Jurnal Kas Operasional Danus
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">
                    Pencatatan arus kas internal operasional Danus yang disinkronkan ke Transparansi Keuangan.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 font-semibold">
                  Saldo Kas: {formatRupiah(danusNetCash)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-105 text-slate-500 font-mono uppercase tracking-wider text-[9px]">
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Deskripsi Transaksi</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Debet (In)</th>
                      <th className="py-2.5 px-3 text-right">Kredit (Out)</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {danusRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Jurnal Kas Danus masih kosong. Silakan catat transaksi baru.
                        </td>
                      </tr>
                    ) : (
                      danusRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-500">{record.date}</td>
                          <td className="py-3 px-3 font-bold text-slate-800">{record.desc}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {record.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                            {record.type === 'in' ? '+' + formatRupiah(record.amount) : '-'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-rose-600 font-bold">
                            {record.type === 'out' ? '-' + formatRupiah(record.amount) : '-'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleDeleteDanusTransaction(record.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── PANEL 2: INPUT & MANAJEMEN PRODUK MARKET ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === 'products' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Form Input / Edit Produk */}
            <div className="lg:col-span-5 bg-white border border-gold-border rounded-2xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-gold-dark font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-gold" /> {editingProductId ? 'Mode Edit Produk' : 'Katalog Market'}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingProductId ? 'Edit Data Produk' : 'Input Produk Baru'}
                  </h3>
                </div>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Nama Produk */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Nama Produk / Merchandise <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kaos Photisma 2026 / Gantungan Kunci"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Harga & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                      Harga (Rupiah) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 180000"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                      Kategori Produk
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="Merchandise">Merchandise</option>
                      <option value="Pakaian">Pakaian / PDH</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Aksesoris">Aksesoris</option>
                      <option value="Perlengkapan">Perlengkapan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Status Ketersediaan */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Status Ketersediaan
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Tersedia">Tersedia (Ready Stock)</option>
                    <option value="Pre-Order">Sistem Pre-Order (PO)</option>
                    <option value="Habis">Stok Habis</option>
                  </select>
                </div>

                {/* Foto / Gambar Produk */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                      Foto Produk
                    </label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`font-semibold cursor-pointer ${imageInputMode === 'upload' ? 'text-gold-dark font-bold underline' : 'text-slate-400'}`}
                      >
                        Upload Foto
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`font-semibold cursor-pointer ${imageInputMode === 'url' ? 'text-gold-dark font-bold underline' : 'text-slate-400'}`}
                      >
                        URL Gambar
                      </button>
                    </div>
                  </div>

                  {imageInputMode === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="w-full border-2 border-dashed border-slate-200 hover:border-gold bg-slate-50/50 hover:bg-gold/5 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-slate-500"
                      >
                        <Upload className="w-5 h-5 text-gold" />
                        <span className="text-xs font-semibold">Pilih Foto dari Galeri HP / Komputer</span>
                        <span className="text-[10px] text-slate-400 font-light">Format PNG, JPG, JPEG (Maks. 2MB)</span>
                      </label>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="Masukkan URL Gambar (https://...)"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none"
                    />
                  )}

                  {/* Preview Gambar Terpilih */}
                  {productForm.image && (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <img 
                        src={productForm.image} 
                        alt="Preview" 
                        className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-0.5" 
                      />
                      <div className="flex-1 text-[11px] truncate text-slate-600">
                        <span className="font-semibold block text-slate-800">Foto Siap Ditampilkan</span>
                        <span className="text-[10px] text-emerald-600">Preview Berhasil</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProductForm({ ...productForm, image: '' });
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Hapus Foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Deskripsi Produk */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest block">
                    Deskripsi Singkat Produk
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan spesifikasi, ukuran, atau bahan produk..."
                    value={productForm.desc}
                    onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-gold/20 cursor-pointer"
                  >
                    {editingProductId ? (
                      <>
                        <Check className="w-4 h-4" /> Simpan Perubahan
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Tambah ke Market
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Katalog Produk Aktif di Market */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4.5 h-4.5 text-gold" /> Daftar Produk Aktif di Einsten Market
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">
                    Produk yang tampil langsung pada katalog belanja pembeli ({products.length} produk).
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-lg text-[10px] font-mono text-gold-dark font-extrabold">
                  {products.length} Produk
                </span>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400">Belum ada produk di katalog Market. Tambahkan produk sekarang!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-gold/30 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2.5">
                        {/* Image Preview */}
                        <div className="w-full aspect-[4/3] rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                          <img 
                            src={p.image || '/Media/Media yg dijual/Baju PDH Elins 180.000/PDH Einsten.png'} 
                            alt={p.name} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = '/Media/Media yg dijual/Baju PDH Elins 180.000/PDH Einsten.png';
                            }}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-gold/10 text-gold-dark border border-gold/20 uppercase tracking-wider">
                              {p.category || 'Merchandise'}
                            </span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              p.status === 'Habis' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                                : p.status === 'Pre-Order'
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}>
                              {p.status || 'Tersedia'}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1 group-hover:text-gold-dark transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs font-extrabold text-gold-dark font-mono">
                            {formatRupiah(p.price)}
                          </p>
                          <p className="text-[10px] text-slate-500 font-light line-clamp-2 mt-1">
                            {p.desc || 'Tidak ada deskripsi.'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleEditProductClick(p)}
                          className="flex-1 py-1.5 bg-white hover:bg-gold hover:text-white border border-slate-200 hover:border-gold text-slate-700 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── PANEL 3: VERIFIKASI PEMBELIAN & QRIS ── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Pesanan</span>
                <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{orders.length} Transaksi</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">Menunggu Validasi</span>
                <h4 className="text-xl font-extrabold text-amber-900 mt-0.5">{pendingOrdersCount} Pesanan</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Terverifikasi (Lunas)</span>
                <h4 className="text-xl font-extrabold text-emerald-900 mt-0.5">{formatRupiah(salesEarnings)}</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama pembeli atau item..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-gold rounded-xl py-2 pl-10 pr-4 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orderFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('Pending')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orderFilter === 'Pending'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Pending ({pendingOrdersCount})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('Active')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orderFilter === 'Active'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Verified ({verifiedOrdersCount})
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-gold-border rounded-2xl overflow-hidden shadow-md space-y-3">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-gold" /> Validasi QRIS & Pembelian Merchandise
                </h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  Validasi bukti transfer pembeli untuk memasukkan dana penjualan ke dalam **Hasil Penjualan Danus**.
                </p>
              </div>
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold-dark font-extrabold text-xs rounded-xl font-mono">
                {formatRupiah(salesEarnings)} Lunas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Nama Pembeli</th>
                    <th className="px-6 py-4">Item Pesanan</th>
                    <th className="px-6 py-4">Total Harga</th>
                    <th className="px-6 py-4">Bukti Transfer</th>
                    <th className="px-6 py-4">Status Verifikasi</th>
                    <th className="px-6 py-4 text-center">Tindakan Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        Tidak ada riwayat pesanan yang cocok dengan pencarian / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {order.name}
                        </td>
                        <td className="px-6 py-4 max-w-xs">{order.items}</td>
                        <td className="px-6 py-4 font-bold text-gold-dark font-mono">
                          {formatRupiah(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setPreviewProof(order)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-mono font-semibold transition-colors cursor-pointer border border-slate-200"
                          >
                            <Eye className="w-3 h-3 text-slate-500" /> {order.file || 'Bukti.png'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider inline-flex items-center gap-1 ${
                            order.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' 
                              : 'bg-amber-50 text-amber-600 border-amber-500/20'
                          }`}>
                            {order.status === 'Active' ? (
                              <>
                                <Check className="w-3 h-3" /> Verified
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" /> Pending
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {order.status === 'Pending' ? (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Active')}
                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-white" /> Validasi Lunas
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Pending')}
                                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-[10px] font-bold rounded-lg transition-colors active:scale-95 shadow-2xs cursor-pointer"
                              >
                                Set Pending
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Pesanan"
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
      )}

      {/* ── MODAL PREVIEW BUKTI TRANSFER ── */}
      {previewProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest block">Bukti Pembayaran QRIS</span>
                <h3 className="text-base font-extrabold text-slate-900">Pesanan {previewProof.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProof(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Item Pesanan:</span>
                <span className="font-bold text-slate-800">{previewProof.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Nominal:</span>
                <span className="font-bold text-gold-dark font-mono">{formatRupiah(previewProof.total)}</span>
              </div>
            </div>

            <div className="w-full aspect-video bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
              {previewProof.file && (previewProof.file.startsWith('data:image') || previewProof.file.startsWith('http') || previewProof.file.startsWith('/')) ? (
                <img 
                  src={previewProof.file} 
                  alt="Bukti Transfer" 
                  className="max-h-64 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="space-y-2">
                  <Image className="w-10 h-10 text-gold mx-auto" />
                  <p className="text-xs font-bold text-slate-800">{previewProof.file}</p>
                  <p className="text-[10px] text-slate-400">Bukti struk transfer / QRIS yang dilampirkan oleh pembeli.</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewProof(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
              {previewProof.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(previewProof.id, 'Active');
                    setPreviewProof(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Validasi Lunas Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
