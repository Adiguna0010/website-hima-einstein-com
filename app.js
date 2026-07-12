/* ==========================================================================
   KABINET PHÓTISMA WEBSITE ENGINE (Aeline SaaS Logical Engine)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initLocalData();
});

/* ==========================================================================
   NAVBAR & SCROLL SPY LOGIC
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('.page-section, .hero-section');
  const navLinks = document.querySelectorAll('.nav-links > li > a');
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   CONSOLE DRAWER CONTROL (Einstein Sphere)
   ========================================================================== */
window.openConsole = function(divisionId) {
  const drawer = document.getElementById('console-drawer');
  const content = document.getElementById('console-drawer-content');
  const data = DIVISION_DATA[divisionId];

  if (data && drawer && content) {
    content.innerHTML = `
      <h3 style="font-family: var(--font-header); font-size: 1.3rem; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
        <span>${data.icon}</span> ${data.title}
      </h3>
      <p style="color: var(--text-gray); font-size: 0.95rem; font-weight: 300; margin-bottom: 30px; line-height: 1.6;">${data.desc}</p>
      <div class="drawer-body-area">
        ${data.render()}
      </div>
    `;
    
    drawer.classList.add('open');

    if (divisionId === 'danus') {
      renderCart();
    }
  }
};

window.closeConsole = function() {
  const drawer = document.getElementById('console-drawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeConsole();
    closeScannerModal();
    closeCheckoutModal();
  }
});

/* ==========================================================================
   DIVISION DATA & RENDERERS FOR DRAWER
   ========================================================================== */
const DIVISION_DATA = {
  bph: {
    title: 'Badan Pengurus Harian',
    desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
    icon: '⚡',
    render: () => `
      <div class="bph-chart">
        <div class="chart-level">
          <div class="member-node" style="border-radius:15px;">
            <h4 style="color: var(--accent-lime);">KAHIM HIMA</h4>
            <p>Ketua Himpunan</p>
          </div>
          <div class="member-node" style="border-radius:15px;">
            <h4 style="color: var(--accent-lime);">WAKAHIM HIMA</h4>
            <p>Wakil Ketua Himpunan</p>
          </div>
        </div>
        <div class="chart-level">
          <div class="member-node" style="border-radius:15px;">
            <h4>SEKRETARIS I & II</h4>
            <p>Administrasi & Pengarsipan</p>
          </div>
          <div class="member-node" style="border-radius:15px;">
            <h4>BENDAHARA I & II</h4>
            <p>Pengelolaan Keuangan & Anggaran</p>
          </div>
        </div>
      </div>
    `
  },
  internal: {
    title: 'Internal',
    desc: 'Fokus pada penyelarasan kekerabatan pengurus Himpunan, penampungan aspirasi internal, dan perumusan kegiatan kebersamaan.',
    icon: '🤝',
    render: () => `
      <div class="tactical-panel" style="text-align: center; padding: 40px 20px; border-radius: 20px;">
        <div class="panel-corner corner-tl"></div>
        <div class="panel-corner corner-tr"></div>
        <div class="panel-corner corner-bl"></div>
        <div class="panel-corner corner-br"></div>
        <div style="font-size: 2.5rem; color: var(--accent-lime); margin-bottom: 20px;"><i class="fa-solid fa-terminal"></i></div>
        <h4 style="font-family: var(--font-header); font-size: 0.85rem; letter-spacing: 0.15em; margin-bottom: 10px;">CONSOL SYSTEM ACTIVE</h4>
        <p style="color: var(--text-gray); font-size: 0.85rem; font-weight: 300;">Rencana program kerja divisi Internal saat ini sedang dalam proses penyusunan bersama perwakilan anggota.</p>
      </div>
    `
  },
  external: {
    title: 'External Division',
    desc: 'Menghubungkan HIMA EINSTEIN dengan alumni, korporasi industri nuklir/kesehatan, BRIN, serta himpunan mahasiswa luar.',
    icon: '🌐',
    render: () => `
      <div>
        <form class="tactical-panel" onsubmit="alert('Formulir kemitraan berhasil terkirim!'); return false;" style="border-radius:20px;">
          <div class="panel-corner corner-tl"></div>
          <div class="panel-corner corner-tr"></div>
          <div class="panel-corner corner-bl"></div>
          <div class="panel-corner corner-br"></div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Instansi / Himpunan</label>
              <input type="text" class="form-control" placeholder="Contoh: HMTC ITS" required style="border-radius:10px;">
            </div>
            <div class="form-group">
              <label>Email Kontak Resmi</label>
              <input type="email" class="form-control" placeholder="nama@domain.com" required style="border-radius:10px;">
            </div>
            <div class="form-group full-width">
              <label>Rencana Kolaborasi / Kunjungan</label>
              <textarea class="form-control" rows="3" placeholder="Jelaskan secara ringkas maksud kerjasama..." required style="border-radius:10px;"></textarea>
            </div>
          </div>
          <button type="submit" class="btn-pill btn-lime" style="margin-top: 24px; padding: 12px 24px; font-size: 0.75rem;">Kirim Pengajuan</button>
        </form>
      </div>
    `
  },
  ristek: {
    title: 'Riset & Teknologi',
    desc: 'Mendorong kecakapan mahasiswa di bidang instrumentasi nuklir melalui bank soal terintegrasi, pendaftaran tutor sebaya, dan kolaborasi proyek IoT otonom.',
    icon: '🔬',
    render: () => `
      <div class="ristek-container">
        <div class="ristek-tabs">
          <button class="ristek-tab-btn active" onclick="switchRistekTab('vault')">Einstein Vault</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('les')">Ristek Mengajar</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('proyek')">Project Collab</button>
        </div>

        <div id="tab-vault" class="ristek-tab-content active">
          <div class="vault-list">
            <div class="vault-item" style="border-radius:15px;">
              <div class="vault-info">
                <h4>UTS: Mikroprosesor & Mikrokontroler</h4>
                <p>Format: PDF | Ukuran: 2.4 MB</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh UTS...'); return false;">Unduh <i class="fa-solid fa-download"></i></a>
            </div>
            <div class="vault-item" style="border-radius:15px;">
              <div class="vault-info">
                <h4>Modul Praktikum: Detektor Radiasi Nuklir</h4>
                <p>Format: PDF | Ukuran: 4.8 MB</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Modul...'); return false;">Unduh <i class="fa-solid fa-download"></i></a>
            </div>
          </div>
        </div>

        <div id="tab-les" class="ristek-tab-content">
          <form class="tactical-panel" onsubmit="alert('Form Ristek Mengajar terkirim!'); return false;" style="border-radius:20px;">
            <div class="panel-corner corner-tl"></div>
            <div class="panel-corner corner-tr"></div>
            <div class="panel-corner corner-bl"></div>
            <div class="panel-corner corner-br"></div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" class="form-control" placeholder="Nama Anda" required style="border-radius:10px;">
              </div>
              <div class="form-group">
                <label>Kategori Peran</label>
                <select class="form-control" required style="background: var(--color-bg-deep); border-radius:10px;">
                  <option value="murid">Butuh Bimbingan (Murid)</option>
                  <option value="tutor">Bersedia Mengajar (Tutor)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mata Kuliah / Bidang</label>
                <input type="text" class="form-control" placeholder="Contoh: Pemrograman C++" required style="border-radius:10px;">
              </div>
              <div class="form-group">
                <label>WhatsApp Kontak</label>
                <input type="text" class="form-control" placeholder="08xxxxxxxxxx" required style="border-radius:10px;">
              </div>
            </div>
            <button type="submit" class="btn-pill btn-lime" style="margin-top: 24px; padding: 12px 24px; font-size: 0.75rem;">Daftar</button>
          </form>
        </div>

        <div id="tab-proyek" class="ristek-tab-content">
          <div class="project-board">
            <div class="project-item" style="border-radius:20px;">
              <span class="project-tag">IoT & Nuklir</span>
              <h4 style="margin-bottom: 5px;">Monitor Radiasi ESP32</h4>
              <p>Membangun detektor radiasi portable Geiger-Müller terkoneksi server IoT realtime.</p>
              <button class="btn-pill btn-lime" style="padding: 8px 16px; font-size: 0.65rem;" onclick="alert('Berhasil mendaftar kolaborasi ESP32.');">Gabung Proyek</button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  pengma: {
    title: 'Pengembangan Mahasiswa',
    desc: 'Fasilitas sertifikasi industri, persiapan karir, rekrutmen magang, dan kompilasi info prestasi kemahasiswaan.',
    icon: '🚀',
    render: () => `
      <div class="vault-list">
        <div class="vault-item" style="border-radius:15px;">
          <div class="vault-info">
            <h4>Pelatihan Sertifikasi PLC Siemens S7-1200</h4>
            <p>Jadwal: 25 Juli 2026 | Lokasi: Lab Kendali Industri</p>
          </div>
          <button class="btn-pill btn-lime" style="padding: 10px 20px; font-size: 0.7rem;" onclick="alert('Pendaftaran Sertifikasi PLC terkirim!');">Daftar</button>
        </div>
      </div>
    `
  },
  danus: {
    title: 'Dana Usaha Store',
    desc: 'Wirausaha mandiri Himpunan. Pembelian produk eksklusif PDH, bomber, dan merchandise resmi HIMA EINSTEIN.',
    icon: '🛒',
    render: () => `
      <div class="danus-hub">
        <div class="product-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="product-card">
            <div class="product-img">👕</div>
            <div class="product-info">
              <span class="product-name" style="font-family:var(--font-header);">PDH EINSTEIN 2026</span>
              <span class="product-price">Rp 135.000</span>
              <button class="btn-pill btn-lime product-btn" style="padding: 8px; font-size: 0.65rem;" onclick="addToCart('PDH EINSTEIN 2026', 135000)">+ Tambah</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🧥</div>
            <div class="product-info">
              <span class="product-name" style="font-family:var(--font-header);">Bomber Phótisma</span>
              <span class="product-price">Rp 185.000</span>
              <button class="btn-pill btn-lime product-btn" style="padding: 8px; font-size: 0.65rem;" onclick="addToCart('Bomber Phótisma', 185000)">+ Tambah</button>
            </div>
          </div>
        </div>

        <div class="cart-panel" style="margin-top: 20px;">
          <div class="cart-title">
            <span>Keranjang Belanja (Drawer)</span>
            <span id="cart-count">0</span>
          </div>
          <div class="cart-items" id="cart-items-list">
            <p style="color: var(--text-gray); font-size: 0.8rem; text-align: center;">Keranjang belanja kosong.</p>
          </div>
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total-price">Rp 0</span>
          </div>
          <button class="checkout-btn" onclick="checkoutCart()">
            <i class="fa-brands fa-whatsapp"></i> Checkout WhatsApp
          </button>
        </div>
      </div>
    `
  },
  kominfo: {
    title: 'Komunikasi & Informasi',
    desc: 'Media publikasi berita sains nuklir, dokumentasi kegiatan, rilis buletin triwulan EINSTEIN, dan podcast audio visual.',
    icon: '📢',
    render: () => `
      <div class="project-board">
        <div class="project-item" style="border-radius:20px;">
          <span class="project-tag">Podcast Einstein</span>
          <h4>Episode #12: Small Modular Reactor di Indonesia</h4>
          <button class="btn-pill btn-lime" style="padding: 8px 16px; font-size: 0.65rem;" onclick="alert('Memutar podcast...');">▶️ Dengar</button>
        </div>
      </div>
    `
  },
  aset_logistik: {
    title: 'Aset & Logistik',
    desc: 'Portal peminjaman alat penunjang praktikum mahasiswa (solder, multimeter, starter kit Arduino) secara transparan.',
    icon: '📦',
    render: () => `
      <div class="asset-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="asset-card">
          <div class="asset-header">
            <span style="font-size: 1.5rem;">📟</span>
            <span class="asset-status available">Tersedia</span>
          </div>
          <h4>Multimeter Sanwa CD800a</h4>
          <span class="asset-id">ID: HIMA-MULT-002</span>
          <button class="btn-pill btn-lime" style="padding: 8px; font-size: 0.65rem; margin-top: 10px;" onclick="borrowAsset('Multimeter Sanwa CD800a', 'HIMA-MULT-002')">Pinjam Alat</button>
        </div>
      </div>
    `
  }
};

/* ==========================================================================
   EINSTEIN MARKET: E-COMMERCE CART ENGINE
   ========================================================================== */
let cart = [];
let uploadedProofFile = null;

window.addToCart = function(productName, price) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }
  renderCart();
};

window.removeFromCart = function(productName) {
  cart = cart.filter(item => item.name !== productName);
  renderCart();
};

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  let totalPrice = 0;
  const itemsHtml = cart.map(item => {
    totalPrice += item.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-name" title="${item.name}">${item.name} (${item.quantity}x)</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
          <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">❌</button>
        </div>
      </div>
    `;
  }).join('');

  // 1. Update Market Slide Cart
  const marketCount = document.getElementById('market-cart-count');
  const marketList = document.getElementById('market-cart-list');
  const marketTotal = document.getElementById('market-cart-total');

  if (marketCount && marketList && marketTotal) {
    marketCount.textContent = totalQty;
    if (cart.length === 0) {
      marketList.innerHTML = `<p style="color: var(--text-gray); font-size: 0.8rem; text-align: center; padding: 20px 0;">Keranjang kosong.</p>`;
      marketTotal.textContent = 'Rp 0';
    } else {
      marketList.innerHTML = itemsHtml;
      marketTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }
  }

  // 2. Update Console Drawer Cart
  const drawerCount = document.getElementById('cart-count');
  const drawerList = document.getElementById('cart-items-list');
  const drawerTotal = document.getElementById('cart-total-price');

  if (drawerCount && drawerList && drawerTotal) {
    drawerCount.textContent = totalQty;
    if (cart.length === 0) {
      drawerList.innerHTML = `<p style="color: var(--text-gray); font-size: 0.8rem; text-align: center;">Keranjang belanja kosong.</p>`;
      drawerTotal.textContent = 'Rp 0';
    } else {
      drawerList.innerHTML = itemsHtml;
      drawerTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }
  }
}

// PRD: Open Checkout Summary modal with QRIS & file upload
window.checkoutCart = function() {
  if (cart.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }

  const modal = document.getElementById('checkout-modal');
  const list = document.getElementById('checkout-items-summary');
  const totalVal = document.getElementById('checkout-total-val');
  const uploadContent = document.getElementById('upload-box-content');
  const confirmBtn = document.getElementById('confirm-checkout-btn');

  if (modal && list && totalVal) {
    let total = 0;
    list.innerHTML = cart.map(item => {
      total += item.price * item.quantity;
      return `
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:6px 0; color:var(--text-gray);">
          <span>${item.name} (x${item.quantity})</span>
          <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
        </div>
      `;
    }).join('');

    totalVal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Reset file upload
    uploadedProofFile = null;
    confirmBtn.disabled = true;
    uploadContent.innerHTML = `
      <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 8px;"></i>
      <p style="font-size: 0.8rem; font-weight: 500;">Klik untuk unggah Bukti Transfer QRIS</p>
      <span style="font-size: 0.7rem; color: var(--text-gray);">Format: PNG, JPG, JPEG (Maks. 2MB)</span>
    `;

    modal.classList.add('open');
  }
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('open');
  }
};

window.handleProofUpload = function(event) {
  const file = event.target.files[0];
  const uploadContent = document.getElementById('upload-box-content');
  const confirmBtn = document.getElementById('confirm-checkout-btn');

  if (!file) return;

  // Validate size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Error: Ukuran file melebihi 2MB!");
    event.target.value = '';
    return;
  }

  // Validate extension
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    alert("Error: Format file harus berupa PNG, JPG, atau JPEG!");
    event.target.value = '';
    return;
  }

  uploadedProofFile = file;
  confirmBtn.disabled = false;
  uploadContent.innerHTML = `
    <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; color: #2ecc71; margin-bottom: 8px;"></i>
    <p style="font-size: 0.8rem; font-weight: 600; color: #2ecc71;">Bukti Berhasil Diunggah!</p>
    <span style="font-size: 0.75rem; color: var(--text-white); font-weight:500;">${file.name} (${(file.size/1024).toFixed(1)} KB)</span>
  `;
};

window.sendOrderToWhatsApp = function() {
  if (!uploadedProofFile) {
    alert('Unggah bukti pembayaran QRIS Anda terlebih dahulu!');
    return;
  }

  let text = 'Halo Admin Danus HIMA EINSTEIN! Saya ingin mengirimkan pemesanan merchandise:\n\n';
  let total = 0;
  cart.forEach(item => {
    text += `- ${item.name} (${item.quantity}x) : Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    total += item.price * item.quantity;
  });
  text += `\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}\n`;
  text += `Bukti Bayar QRIS terlampir: [File: ${uploadedProofFile.name}]\n\nMohon konfirmasi pesanan saya. Terima kasih!`;

  const url = `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');

  // Clear cart and close modal
  cart = [];
  renderCart();
  closeCheckoutModal();
};

/* ==========================================================================
   EINSTEIN SPACE: WEBCAM BARCODE SCANNER
   ========================================================================== */
let activeScanToolName = "";
let activeScanToolId = "";
let webcamStream = null;

window.borrowAsset = function(assetName, assetId) {
  activeScanToolName = assetName;
  activeScanToolId = assetId;
  openScannerModal();
};

function openScannerModal() {
  const modal = document.getElementById('scanner-modal');
  const video = document.getElementById('scanner-video');
  const errMsg = document.getElementById('scanner-error-msg');
  const selectNode = document.getElementById('manual-tool-select');
  const successBadge = document.getElementById('scanner-success-badge');

  if (modal && video) {
    successBadge.style.display = 'none';
    errMsg.style.display = 'none';
    video.style.display = 'block';
    
    // Set manual selector option match
    if (selectNode) {
      selectNode.value = activeScanToolId;
    }

    modal.classList.add('open');

    // Try accessing webcam stream
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        webcamStream = stream;
        video.srcObject = stream;
      })
      .catch(err => {
        console.error("Camera access failed:", err);
        video.style.display = 'none';
        errMsg.style.display = 'block';
      });
  }
}

window.closeScannerModal = function() {
  const modal = document.getElementById('scanner-modal');
  const video = document.getElementById('scanner-video');

  if (modal) {
    modal.classList.remove('open');
  }

  // Stop camera tracks
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (video) {
    video.srcObject = null;
  }
};

window.processMockScan = function() {
  const successBadge = document.getElementById('scanner-success-badge');
  const video = document.getElementById('scanner-video');

  if (successBadge) {
    successBadge.style.display = 'block';
    
    // play a mock scan beep sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000Hz Beep
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {
      console.log("Audio beep unavailable");
    }

    setTimeout(() => {
      closeScannerModal();
      
      // prompt for booking information
      const name = prompt('Masukkan Nama Lengkap Anda:');
      if (!name) return;
      const nim = prompt('Masukkan NIM Anda:');
      if (!nim) return;

      const selectNode = document.getElementById('manual-tool-select');
      const toolId = selectNode ? selectNode.value : activeScanToolId;
      const toolName = toolId === 'HIMA-MULT-002' ? 'Digital Multimeter Sanwa CD800a' : 'Arduino Uno Starter Kit';

      const text = `Halo Logistik HIMA EINSTEIN!\n\nSaya ingin mengajukan peminjaman alat:\n- Nama Alat: ${toolName}\n- ID Alat: ${toolId}\n\nPeminjam:\n- Nama: ${name}\n- NIM: ${nim}\n\nReservasi terdaftar melalui scan barcode sistem. Mohon konfirmasi pengambilan alat. Terima kasih!`;
      const url = `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }, 1500);
  }
};

/* ==========================================================================
   SEKRETARIAT: DOCK SUBMISSIONS & BACKOFFICE DASHBOARD
   ========================================================================== */
function initLocalData() {
  if (!localStorage.getItem('hima_letters')) {
    // Initial dummy data
    const dummy = [
      { requester: 'Ristek / Dian', category: 'Surat Permohonan', subject: 'Peminjaman Laboratorium Komputasi', status: 'ACC' },
      { requester: 'Pengma / Budi', category: 'Surat Undangan', subject: 'Undangan Pembicara PLC Siemens', status: 'Pending' }
    ];
    localStorage.setItem('hima_letters', JSON.stringify(dummy));
  }
}

window.submitLetterRequest = function(event) {
  event.preventDefault();
  const form = event.target;
  const requester = form.querySelector('input[placeholder*="Contoh"]').value;
  const categorySelect = form.querySelector('select');
  const category = categorySelect.options[categorySelect.selectedIndex].text;
  const subject = form.querySelector('input[placeholder*="Perihal"]').value;

  const letters = JSON.parse(localStorage.getItem('hima_letters') || '[]');
  letters.push({ requester, category, subject, status: 'Pending' });
  localStorage.setItem('hima_letters', JSON.stringify(letters));

  alert('Pengajuan nomor surat berhasil didaftarkan ke sistem! Sekretaris BPH akan segera memproses.');
  form.reset();
  
  // Update backoffice lists if opened
  renderBackofficeTable();
};

window.toggleBackoffice = function() {
  const dashboard = document.getElementById('backoffice-dashboard');
  if (dashboard) {
    if (dashboard.style.display === 'none') {
      renderBackofficeTable();
      dashboard.style.display = 'block';
      // scroll down to dashboard
      dashboard.scrollIntoView({ behavior: 'smooth' });
    } else {
      dashboard.style.display = 'none';
    }
  }
};

function renderBackofficeTable() {
  const list = document.getElementById('backoffice-letters-list');
  if (!list) return;

  const letters = JSON.parse(localStorage.getItem('hima_letters') || '[]');
  
  if (letters.length === 0) {
    list.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-gray);">Belum ada antrean pengajuan surat.</td></tr>`;
    return;
  }

  list.innerHTML = letters.map((letObj, index) => {
    let badgeClass = 'pending';
    if (letObj.status === 'ACC') badgeClass = 'acc';
    if (letObj.status === 'Ditolak') badgeClass = 'rejected';

    return `
      <tr>
        <td>${letObj.requester}</td>
        <td>${letObj.category}</td>
        <td>${letObj.subject}</td>
        <td><span class="status-badge ${badgeClass}">${letObj.status}</span></td>
        <td>
          <button class="table-btn btn-acc" onclick="updateLetterStatus(${index}, 'ACC')">ACC</button>
          <button class="table-btn btn-rej" onclick="updateLetterStatus(${index}, 'Ditolak')" style="margin-left:4px;">Tolak</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateLetterStatus = function(index, newStatus) {
  const letters = JSON.parse(localStorage.getItem('hima_letters') || '[]');
  if (letters[index]) {
    letters[index].status = newStatus;
    localStorage.setItem('hima_letters', JSON.stringify(letters));
    renderBackofficeTable();
  }
};

/* ==========================================================================
   RISTEK TABS SWITCHING
   ========================================================================== */
window.switchRistekTab = function(tabName) {
  const tabs = document.querySelectorAll('.ristek-tab-btn');
  tabs.forEach(btn => btn.classList.remove('active'));
  
  const contents = document.querySelectorAll('.ristek-tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Highlight tab
  const activeBtn = Array.from(tabs).find(btn => btn.textContent.toLowerCase().includes(tabName === 'vault' ? 'vault' : tabName === 'les' ? 'mengajar' : 'project' || 'collab'));
  if (activeBtn) activeBtn.classList.add('active');

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) activeContent.classList.add('active');
};
