import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Shirt, Key, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

export default function Market({ showToast }) {
  const { cart, addToCart, removeFromCart, updateQuantity, totalPrice, totalQty } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const products = [
    {
      id: 'prod-pdh',
      name: 'PDH EINSTEIN 2026',
      price: 135000,
      image: '/Media/Baju PDH Elins/pdh-elins.png',
      desc: 'Pakaian Dinas Harian resmi mahasiswa Elektronika Instrumentasi dengan bahan Premium Drill dingin.'
    },
    {
      id: 'prod-bomber',
      name: 'Bomber Phótisma',
      price: 185000,
      icon: Shirt,
      desc: 'Jaket Bomber eksklusif edisi Kabinet Phótisma dilengkapi bordir logo bersinar.'
    },
    {
      id: 'prod-tshirt',
      name: 'T-Shirt Phótisma',
      price: 85000,
      icon: Shirt,
      desc: 'Kaos katun Combed 30s premium dengan sablon plastisol grafis Phótisma.'
    },
    {
      id: 'prod-keychain',
      name: 'Gantungan Kunci Acrylic',
      price: 15000,
      icon: Key,
      desc: 'Gantungan kunci akrilik double-sided logo HIMA EINSTEIN.'
    },
    {
      id: 'prod-magiccom',
      name: 'Magic Com',
      price: 120000,
      image: '/Media/Media yg dijual/Magiccom 120.000/magiccom.png',
      desc: 'Magic Com penanak nasi praktis, kondisi secondary terawat dan berfungsi normal.'
    },
    {
      id: 'prod-mejabelajar',
      name: 'Meja Belajar',
      price: 150000,
      image: '/Media/Media yg dijual/Meja Belajar 150.000/mejabelajar.png',
      desc: 'Meja belajar minimalis kayu kokoh, nyaman digunakan untuk belajar dan bekerja.'
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product.name, product.price);
    showToast(`${product.name} dimasukkan ke keranjang!`, 'success');
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      showToast('Keranjang belanja Anda masih kosong!', 'error');
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-gold/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Wirausaha Mandiri Danus</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEIN MARKET</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Katalog belanja produk dan merchandise resmi HIMA EINSTEIN. Dukung pendanaan mandiri organisasi kami!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Catalog Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => {
            const Icon = p.icon;
            const hasImage = !!p.image;
            return (
              <div 
                key={p.id} 
                className="p-5 bg-white border border-gold-border rounded-2xl flex flex-col justify-between space-y-4 hover:border-gold/30 hover:bg-slate-50/50 transition-all duration-300 relative group overflow-hidden text-left shadow-sm hover:shadow-md"
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gold/5 group-hover:scale-150 transition-transform duration-300 rounded-full blur-xl"></div>
                
                <div className="space-y-3">
                  {/* Product Image Container */}
                  <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner relative">
                    {hasImage ? (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/10 to-gold-light/5 border border-gold/15 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-gold/60" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">Foto segera hadir</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-850 group-hover:text-gold-dark transition-colors">
                      {p.name}
                    </h3>
                    <span className="block text-xs text-gold-dark font-semibold mt-1">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-light line-clamp-2">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToCart(p)}
                  className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-gold hover:text-white hover:border-gold text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Keranjang
                </button>
              </div>
            );
          })}
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="lg:col-span-4 bg-white border border-gold-border rounded-2xl p-6 space-y-6 text-left relative overflow-hidden shadow-md lg:sticky lg:top-24">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
              <ShoppingBag className="w-4 h-4 text-gold" /> Keranjang Belanja
            </h3>
            <span className="px-2 py-0.5 rounded bg-gold/10 text-[10px] font-bold text-gold-dark border border-gold/20">
              {totalQty} Item
            </span>
          </div>

          {/* Cart list */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">Keranjang belanja kosong.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                  <div className="flex-1 space-y-1 min-w-0 text-left">
                    <p className="font-bold text-slate-800 truncate" title={item.name}>{item.name}</p>
                    <p className="text-[10px] text-gold-dark font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Quantity Adjustment Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold w-4 text-center text-xs text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    
                    <button 
                      onClick={() => removeFromCart(item.name)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Summary */}
          {cart.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800 font-semibold">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>TOTAL HARGA</span>
                <span className="text-gold-dark text-base">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-gold/20 active:scale-[0.98] transition-all"
              >
                Selesaikan Pembayaran <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout QRIS Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
