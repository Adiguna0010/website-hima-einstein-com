/* ==========================================================================
   KABINET PHÓTISMA WEBSITE ENGINE (SpaceX Snap-Scroll Engine)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
});

/* ==========================================================================
   NAVBAR & SCROLL SPY LOGIC
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const scrollContainer = document.documentElement; // html node
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // trigger when 50% visible
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
   CONSOLE DRAWER CONTROL
   ========================================================================== */
window.openConsole = function(divisionId) {
  const drawer = document.getElementById('console-drawer');
  const content = document.getElementById('console-drawer-content');
  const data = DIVISION_DATA[divisionId];

  if (data && drawer && content) {
    content.innerHTML = `
      <h3 style="font-family: var(--font-header); font-size: 1.3rem; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.1em; border-bottom: 1px solid var(--color-border); padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
        <span>${data.icon}</span> ${data.title}
      </h3>
      <p style="color: var(--text-gray); font-size: 0.95rem; font-weight: 300; margin-bottom: 30px; line-height: 1.6;">${data.desc}</p>
      <div class="drawer-body-area">
        ${data.render()}
      </div>
    `;
    
    drawer.classList.add('open');

    // If Danus, render cart
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

/* Close drawer on Escape key */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeConsole();
  }
});

/* ==========================================================================
   DIVISION DATA & RENDERERS
   ========================================================================== */
const DIVISION_DATA = {
  bph: {
    title: 'Badan Pengurus Harian',
    desc: 'Pilar komando pusat, administrasi kesekretariatan, pengarsipan surat resmi, serta transparansi pengelolaan anggaran keuangan Himpunan.',
    icon: '⚡',
    render: () => `
      <div class="bph-chart">
        <div class="chart-level">
          <div class="member-node">
            <h4 style="color: var(--accent-cyan);">KAHIM HIMA</h4>
            <p>Ketua Himpunan</p>
          </div>
          <div class="member-node">
            <h4 style="color: var(--accent-cyan);">WAKAHIM HIMA</h4>
            <p>Wakil Ketua Himpunan</p>
          </div>
        </div>
        <div class="chart-level">
          <div class="member-node">
            <h4>SEKRETARIS I & II</h4>
            <p>Administrasi & Pengarsipan</p>
          </div>
          <div class="member-node">
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
      <div class="tactical-panel" style="text-align: center; padding: 40px 20px;">
        <div class="panel-corner corner-tl"></div>
        <div class="panel-corner corner-tr"></div>
        <div class="panel-corner corner-bl"></div>
        <div class="panel-corner corner-br"></div>
        <div style="font-size: 2.5rem; color: var(--accent-cyan); margin-bottom: 20px;"><i class="fa-solid fa-terminal"></i></div>
        <h4 style="font-family: var(--font-header); font-size: 0.85rem; letter-spacing: 0.15em; margin-bottom: 10px;">CONSOL SYSTEM ACTIVE</h4>
        <p style="color: var(--text-gray); font-size: 0.85rem; font-weight: 300;">Rencana program kerja divisi Internal saat ini sedang dalam proses penyusunan bersama perwakilan anggota.</p>
      </div>
    `
  },
  external: {
    title: 'External Division',
    desc: 'Menghubungkan HIMA EINSTEIN dengan alumni, korporasi industri nuklir/kesehatan, BRIN (Badan Riset dan Inovasi Nasional), serta himpunan mahasiswa luar.',
    icon: '🌐',
    render: () => `
      <div>
        <form class="tactical-panel" onsubmit="alert('Formulir kemitraan berhasil terkirim!'); return false;">
          <div class="panel-corner corner-tl"></div>
          <div class="panel-corner corner-tr"></div>
          <div class="panel-corner corner-bl"></div>
          <div class="panel-corner corner-br"></div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Instansi / Himpunan</label>
              <input type="text" class="form-control" placeholder="Contoh: HMTC ITS" required>
            </div>
            <div class="form-group">
              <label>Email Kontak Resmi</label>
              <input type="email" class="form-control" placeholder="nama@domain.com" required>
            </div>
            <div class="form-group full-width">
              <label>Rencana Kolaborasi / Kunjungan</label>
              <textarea class="form-control" rows="3" placeholder="Jelaskan secara ringkas maksud kerjasama..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn-ghost btn-cyan" style="margin-top: 24px; padding: 12px 24px; font-size: 0.65rem;">Kirim Pengajuan</button>
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

        <!-- Einstein Vault -->
        <div id="tab-vault" class="ristek-tab-content active">
          <div class="vault-list">
            <div class="vault-item">
              <div class="vault-info">
                <h4>UTS: Mikroprosesor & Mikrokontroler</h4>
                <p>Format: PDF | Ukuran: 2.4 MB | Kategori: Eleka</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh UTS...'); return false;">Unduh <i class="fa-solid fa-download"></i></a>
            </div>
            <div class="vault-item">
              <div class="vault-info">
                <h4>Modul Praktikum: Detektor Radiasi Nuklir</h4>
                <p>Format: PDF | Ukuran: 4.8 MB | Kategori: Nuklir</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Modul...'); return false;">Unduh <i class="fa-solid fa-download"></i></a>
            </div>
          </div>
        </div>

        <!-- Ristek Mengajar -->
        <div id="tab-les" class="ristek-tab-content">
          <form class="tactical-panel" onsubmit="alert('Form Ristek Mengajar terkirim!'); return false;">
            <div class="panel-corner corner-tl"></div>
            <div class="panel-corner corner-tr"></div>
            <div class="panel-corner corner-bl"></div>
            <div class="panel-corner corner-br"></div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" class="form-control" placeholder="Nama Anda" required>
              </div>
              <div class="form-group">
                <label>Kategori Peran</label>
                <select class="form-control" required style="background: var(--color-black);">
                  <option value="murid">Butuh Bimbingan (Murid)</option>
                  <option value="tutor">Bersedia Mengajar (Tutor)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mata Kuliah / Bidang</label>
                <input type="text" class="form-control" placeholder="Contoh: Pemrograman C++" required>
              </div>
              <div class="form-group">
                <label>WhatsApp Kontak</label>
                <input type="text" class="form-control" placeholder="08xxxxxxxxxx" required>
              </div>
            </div>
            <button type="submit" class="btn-ghost btn-cyan" style="margin-top: 24px; padding: 12px 24px; font-size: 0.65rem;">Daftar</button>
          </form>
        </div>

        <!-- Project Collab -->
        <div id="tab-proyek" class="ristek-tab-content">
          <div class="project-board">
            <div class="project-item">
              <span class="project-tag">IoT & Nuklir</span>
              <h4 style="margin-bottom: 5px;">Monitor Radiasi ESP32</h4>
              <p>Membangun detektor radiasi portable Geiger-Müller terkoneksi server IoT realtime.</p>
              <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.6rem;" onclick="alert('Berhasil mendaftar kolaborasi ESP32.');">Gabung Proyek</button>
            </div>
            <div class="project-item">
              <span class="project-tag">Robotika</span>
              <h4 style="margin-bottom: 5px;">Mobile Robot Inspeksi Lab</h4>
              <p>Mengembangkan robot roda tank pemantau kebocoran lingkungan lab otonom.</p>
              <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.6rem;" onclick="alert('Berhasil mendaftar kolaborasi Robot.');">Gabung Proyek</button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  pengma: {
    title: 'Pengembangan Mahasiswa',
    desc: 'Fasilitas sertifikasi industri, soft-skill leadership, persiapan karir, rekrutmen magang, dan kompilasi info prestasi kemahasiswaan.',
    icon: '🚀',
    render: () => `
      <div class="vault-list">
        <div class="vault-item">
          <div class="vault-info">
            <h4>Pelatihan Sertifikasi PLC Siemens S7-1200</h4>
            <p>Jadwal: 25 Juli 2026 | Lokasi: Lab Kendali Industri</p>
          </div>
          <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Pendaftaran Sertifikasi PLC terkirim!');">Daftar</button>
        </div>
        <div class="vault-item">
          <div class="vault-info">
            <h4>Magang Kerja: PT. Thorcon Power Indonesia (Instrumentation Intern)</h4>
            <p>Deadline: 1 Agustus 2026 | Kategori: Magang Industri</p>
          </div>
          <button class="btn-ghost" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Membuka detail lowongan...');">Detail</button>
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
        <div class="product-grid">
          <div class="product-card">
            <div class="product-img">👕</div>
            <div class="product-info">
              <span class="product-name">PDH EINSTEIN 2026</span>
              <span class="product-price">Rp 135.000</span>
              <button class="btn-ghost btn-cyan product-btn" style="padding: 8px; font-size: 0.6rem;" onclick="addToCart('PDH EINSTEIN 2026', 135000)">+ Tambah</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🧥</div>
            <div class="product-info">
              <span class="product-name">Bomber Phótisma</span>
              <span class="product-price">Rp 185.000</span>
              <button class="btn-ghost btn-cyan product-btn" style="padding: 8px; font-size: 0.6rem;" onclick="addToCart('Bomber Phótisma', 185000)">+ Tambah</button>
            </div>
          </div>
        </div>

        <div class="cart-panel">
          <div class="cart-title">
            <span>Keranjang Belanja</span>
            <span id="cart-count">0</span>
          </div>
          <div class="cart-items" id="cart-items-list">
            <p style="color: var(--text-muted); font-size: 0.8rem; text-align: center;">Keranjang belanja kosong.</p>
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
        <div class="project-item">
          <span class="project-tag">Podcast Einstein</span>
          <h4>Episode #12: Small Modular Reactor di Indonesia</h4>
          <p>Potensi implementasi reaktor mini modular sebagai pemasok energi bersih nasional.</p>
          <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.6rem;" onclick="alert('Memutar podcast...');">▶️ Dengar</button>
        </div>
        <div class="project-item">
          <span class="project-tag">Buletin</span>
          <h4>Buletin EINSTEIN Vol. 7 (Edisi Juli 2026)</h4>
          <p>Kompilasi artikel riset instrumentasi dan rekap kegiatan Himpunan.</p>
          <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.6rem;" onclick="alert('Membuka PDF buletin...');">📖 Baca</button>
        </div>
      </div>
    `
  },
  aset_logistik: {
    title: 'Aset & Logistik',
    desc: 'Portal peminjaman alat penunjang praktikum mahasiswa (solder, multimeter, starter kit Arduino) secara transparan.',
    icon: '📦',
    render: () => `
      <div class="asset-grid">
        <div class="asset-card">
          <div class="asset-header">
            <span style="font-size: 1.5rem;">📟</span>
            <span class="asset-status available">Tersedia</span>
          </div>
          <h4>Multimeter Sanwa CD800a</h4>
          <span class="asset-id">ID: HIMA-MULT-002</span>
          <button class="btn-ghost btn-cyan" style="padding: 6px; font-size: 0.6rem; margin-top: 10px;" onclick="borrowAsset('Multimeter Sanwa CD800a', 'HIMA-MULT-002')">Pinjam Alat</button>
        </div>
        <div class="asset-card">
          <div class="asset-header">
            <span style="font-size: 1.5rem;">🔥</span>
            <span class="asset-status borrowed">Dipinjam</span>
          </div>
          <h4>Solder Station Hakko FX</h4>
          <span class="asset-id">ID: HIMA-SOLD-005</span>
          <button class="btn-ghost" style="padding: 6px; font-size: 0.6rem; margin-top: 10px;" disabled>Pinjam Alat</button>
        </div>
      </div>
    `
  }
};

/* ==========================================================================
   DANA USAHA CART ENGINE
   ========================================================================== */
let cart = [];

window.addToCart = function(productName, price) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }
  renderCart();
  alert(`${productName} ditambahkan ke keranjang.`);
};

window.removeFromCart = function(productName) {
  cart = cart.filter(item => item.name !== productName);
  renderCart();
};

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const count = document.getElementById('cart-count');
  const total = document.getElementById('cart-total-price');
  
  if (!list || !count || !total) return;

  if (cart.length === 0) {
    list.innerHTML = `<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center;">Keranjang belanja kosong.</p>`;
    count.textContent = '0';
    total.textContent = 'Rp 0';
    return;
  }

  count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  let totalPrice = 0;
  list.innerHTML = cart.map(item => {
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

  total.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

window.checkoutCart = function() {
  if (cart.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }

  let text = 'Halo Danus HIMA EINSTEIN! Saya ingin memesan merchandise:\n\n';
  let total = 0;
  cart.forEach(item => {
    text += `- ${item.name} (${item.quantity}x) : Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    total += item.price * item.quantity;
  });
  text += `\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}\n`;
  text += 'Mohon info ketersediaan barang dan tata cara pembayarannya. Terima kasih!';

  const url = `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

/* ==========================================================================
   RISTEK TABS SWITCHING
   ========================================================================== */
window.switchRistekTab = function(tabName) {
  const tabs = document.querySelectorAll('.ristek-tab-btn');
  tabs.forEach(btn => btn.classList.remove('active'));
  
  const contents = document.querySelectorAll('.ristek-tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const activeBtn = Array.from(tabs).find(btn => btn.textContent.toLowerCase().includes(tabName === 'vault' ? 'vault' : tabName === 'les' ? 'mengajar' : 'project' || 'collab'));
  if (activeBtn) activeBtn.classList.add('active');

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) activeContent.classList.add('active');
};

/* ==========================================================================
   ASET LOGISTIK BORROW ENGINE
   ========================================================================== */
window.borrowAsset = function(assetName, assetId) {
  const name = prompt('Nama Lengkap Anda:');
  if (!name) return;
  const nim = prompt('NIM Anda:');
  if (!nim) return;

  const text = `Halo Logistik HIMA EINSTEIN!\n\nSaya ingin mengajukan peminjaman alat:\n- Nama Alat: ${assetName}\n- ID Alat: ${assetId}\n\nPeminjam:\n- Nama: ${name}\n- NIM: ${nim}\n\nMohon konfirmasi ketersediaan pengambilan alat di Sekretariat. Terima kasih!`;
  const url = `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
