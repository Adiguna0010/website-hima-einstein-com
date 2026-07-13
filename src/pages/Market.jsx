import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
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
      image: '👕',
      desc: 'Pakaian Dinas Harian resmi mahasiswa Elektronika Instrumentasi dengan bahan Premium Drill dingin.'
    },
    {
      id: 'prod-bomber',
      name: 'Bomber Phótisma',
      price: 185000,
      image: '🧥',
      desc: 'Jaket Bomber eksklusif edisi Kabinet Phótisma dilengkapi bordir logo bersinar.'
    },
    {
      id: 'prod-tshirt',
      name: 'T-Shirt Phótisma',
      price: 85000,
      image: '👕',
      desc: 'Kaos katun Combed 30s premium dengan sablon plastisol grafis Phótisma.'
    },
    {
      id: 'prod-keychain',
      name: 'Gantungan Kunci Acrylic',
      price: 15000,
      image: '🔑',
      desc: 'Gantungan kunci akrilik double-sided logo HIMA EINSTEIN.'
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
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-electricCyan/5 glow-orb"></div>
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Wirausaha Mandiri Danus</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">EINSTEIN MARKET</h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
          Katalog belanja produk dan merchandise resmi HIMA EINSTEIN. Dukung pendanaan mandiri organisasi kami!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Catalog Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-electricBlue/20 hover:bg-white/10 transition-all duration-300 relative group overflow-hidden text-left"
            >
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-electricBlue/5 group-hover:scale-150 transition-transform duration-300 rounded-full blur-xl"></div>
              
              <div className="space-y-3">
                <div className="w-full aspect-video rounded-xl bg-obsidian-deep/50 border border-white/5 flex items-center justify-center text-4xl shadow-inner">
                  {p.image}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-electricCyan transition-colors">
                    {p.name}
                  </h3>
                  <span className="block text-xs text-limeGreen font-semibold mt-1">
                    Rp {p.price.toLocaleString('id-ID')}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-normal mt-2 font-light">
                    {p.desc}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => handleAddToCart(p)}
                className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-limeGreen hover:text-obsidian hover:border-limeGreen text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Keranjang
              </button>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="lg:col-span-4 glass border border-white/10 rounded-2xl p-6 space-y-6 text-left relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-electricCyan/5 rounded-full blur-xl"></div>

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-electricCyan" /> Keranjang Belanja
            </h3>
            <span className="px-2 py-0.5 rounded bg-limeGreen/10 text-[10px] font-bold text-limeGreen border border-limeGreen/20">
              {totalQty} Item
            </span>
          </div>

          {/* Cart list */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Keranjang belanja kosong.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-white/5 border border-white/5 rounded-xl p-3">
                  <div className="flex-1 space-y-1 min-w-0 text-left">
                    <p className="font-bold text-white truncate" title={item.name}>{item.name}</p>
                    <p className="text-[10px] text-limeGreen">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Quantity Adjustment Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold w-4 text-center text-xs">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    
                    <button 
                      onClick={() => removeFromCart(item.name)}
                      className="p-1 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors ml-1"
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
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span>TOTAL HARGA</span>
                <span className="text-limeGreen text-base">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-gradient-to-r from-electricBlue to-electricCyan hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_-3px_rgba(0,82,255,0.4)] active:scale-[0.98] transition-all"
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
