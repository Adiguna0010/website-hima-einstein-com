/* ==========================================================================
   KABINET PHÓTISMA WEBSITE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initDivisions();
});

/* ==========================================================================
   NAVBAR LOGIC
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

/* ==========================================================================
   PARTICLE CANVAS (Atomic/Electron style)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  
  const particles = [];
  const particleCount = 40;
  const connectionDistance = 120;
  
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00F0FF';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   DIVISION STATE MANAGER & RENDERER
   ========================================================================== */
const DIVISION_DATA = {
  bph: {
    title: 'Badan Pengurus Harian (BPH)',
    desc: 'Kesekretariatan pusat, perumusan kebijakan anggaran, dan administrasi Himpunan.',
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
    desc: 'Menyelaraskan kekerabatan pengurus Himpunan dan merumuskan kegiatan bonding.',
    icon: '🤝',
    render: () => `
      <div class="hub-placeholder">
        <div class="hub-placeholder-icon"><i class="fa-solid fa-terminal"></i></div>
        <h3>Console Internal: Offline</h3>
        <p>Detail program kerja dan fitur khusus divisi Internal sedang dirumuskan secara mendalam oleh tim pengurus.</p>
      </div>
    `
  },
  external: {
    title: 'External',
    desc: 'Hub relasi luar, kemitraan industri, alumni, dan hubungan antar-himpunan.',
    icon: '🌐',
    render: () => `
      <div class="ristek-vault">
        <p style="color: var(--text-gray); margin-bottom: 24px; font-weight: 300;">Daftarkan instansi atau Himpunan Anda untuk pengajuan kerjasama, studi banding, maupun kemitraan strategis.</p>
        
        <form class="tactical-panel" style="padding: 30px;" onsubmit="alert('Formulir kemitraan berhasil terkirim!'); return false;">
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
              <label>Alamat Email Resmi</label>
              <input type="email" class="form-control" placeholder="nama@domain.com" required>
            </div>
            <div class="form-group full-width">
              <label>Tujuan Kemitraan / Kerjasama</label>
              <textarea class="form-control" rows="3" placeholder="Deskripsikan rencana kolaborasi secara ringkas..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn-ghost btn-cyan" style="margin-top: 30px;">Kirim Pengajuan</button>
        </form>
      </div>
    `
  },
  ristek: {
    title: 'Riset dan Teknologi (Ristek)',
    desc: 'Pengembangan teknologi nuklir instrumentasi, modul pelajaran, dan kolaborasi proyek sains.',
    icon: '🔬',
    render: () => `
      <div class="ristek-container">
        <div class="ristek-tabs">
          <button class="ristek-tab-btn active" onclick="switchRistekTab('vault')">Einstein Vault</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('les')">Ristek Mengajar</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('proyek')">Project Collaboration</button>
        </div>

        <!-- Einstein Vault -->
        <div id="tab-vault" class="ristek-tab-content active">
          <div class="vault-list">
            <div class="vault-item">
              <div class="vault-info">
                <h4>Bank Soal UTS: Mikroprosesor & Mikrokontroler</h4>
                <p>Format: PDF | Ukuran: 2.4 MB | Kategori: Elektronika</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Soal UTS...'); return false;">Unduh File <i class="fa-solid fa-download"></i></a>
            </div>
            <div class="vault-item">
              <div class="vault-info">
                <h4>Modul Praktikum: Sensor Radiasi & Detektor Nuklir</h4>
                <p>Format: PDF | Ukuran: 4.8 MB | Kategori: Instrumentasi Nuklir</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Modul Detektor...'); return false;">Unduh File <i class="fa-solid fa-download"></i></a>
            </div>
            <div class="vault-item">
              <div class="vault-info">
                <h4>Catatan Kuliah: Elektronika Analog Lanjut</h4>
                <p>Format: PDF | Ukuran: 12.1 MB | Kategori: Dasar Eleka</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Catatan Elekan...'); return false;">Unduh File <i class="fa-solid fa-download"></i></a>
            </div>
          </div>
        </div>

        <!-- Ristek Mengajar / Guru Les -->
        <div id="tab-les" class="ristek-tab-content">
          <p style="color: var(--text-gray); margin-bottom: 24px; font-weight: 300;">Daftarkan diri Anda sebagai tutor sebaya atau ajukan permohonan pendampingan belajar mata kuliah instrumentasi.</p>
          
          <form class="tactical-panel" style="padding: 30px;" onsubmit="alert('Pendaftaran Ristek Mengajar berhasil terkirim!'); return false;">
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
                <label>Pilih Kategori Peran</label>
                <select class="form-control" required style="background: var(--color-black);">
                  <option value="murid">Saya Butuh Tutor (Murid)</option>
                  <option value="tutor">Saya Bersedia Mengajar (Tutor)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mata Kuliah / Bidang</label>
                <input type="text" class="form-control" placeholder="Contoh: Pemrograman C++, Fisika Radiasi" required>
              </div>
              <div class="form-group">
                <label>No. WhatsApp Kontak</label>
                <input type="text" class="form-control" placeholder="08xxxxxxxxxx" required>
              </div>
            </div>
            <button type="submit" class="btn-ghost btn-cyan" style="margin-top: 30px;">Daftar Sekarang</button>
          </form>
        </div>

        <!-- Project Collaboration -->
        <div id="tab-proyek" class="ristek-tab-content">
          <div class="project-board">
            <div class="project-item">
              <span class="project-tag">IoT & Radiasi</span>
              <h4>Sistem Monitor Radiasi Real-Time</h4>
              <p>Pengembangan detektor radiasi modular portabel berbasis ESP32 dan tabung Geiger-Müller terintegrasi dashboard cloud.</p>
              <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Terima kasih telah mengajukan kolaborasi proyek. Ketua proyek akan menghubungi Anda via WhatsApp.');">Gabung Proyek</button>
            </div>
            <div class="project-item">
              <span class="project-tag">Robotika</span>
              <h4>Otonom Mobile Robot Inspeksi Lab</h4>
              <p>Membangun robot tank pemantau kebocoran radiasi otonom untuk inspeksi area steril laboratorium nuklir.</p>
              <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Terima kasih telah mengajukan kolaborasi proyek. Ketua proyek akan menghubungi Anda via WhatsApp.');">Gabung Proyek</button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  pengma: {
    title: 'Pengembangan Mahasiswa (Pengma)',
    desc: 'Pengembangan karir, pelatihan kompetensi industri, soft skill, dan info rekrutmen magang.',
    icon: '🚀',
    render: () => `
      <div class="pengma-hub">
        <p style="color: var(--text-gray); margin-bottom: 24px; font-weight: 300;">Daftarkan diri Anda untuk mengikuti agenda peningkatan kompetensi profesional bidang instrumentasi berikut.</p>
        <div class="vault-list">
          <div class="vault-item">
            <div class="vault-info">
              <h4>Pelatihan Sertifikasi PLC Siemens S7-1200</h4>
              <p>Jadwal: 25 Juli 2026 | Lokasi: Lab Kendali Industri | Kuota: 20 Orang</p>
            </div>
            <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Pendaftaran Sertifikasi PLC berhasil dikirim!');">Daftar Pelatihan</button>
          </div>
          <div class="vault-item">
            <div class="vault-info">
              <h4>Instrumentation Intern (Magang) - PT. Thorcon Power Indonesia</h4>
              <p>Deadline: 1 Agustus 2026 | Kategori: Magang Kerja Industri</p>
            </div>
            <button class="btn-ghost" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Membuka tautan portal rekrutmen Thorcon...');">Detail Lowongan</button>
          </div>
        </div>
      </div>
    `
  },
  danus: {
    title: 'Dana Usaha (Danus)',
    desc: 'Store merchandise resmi HIMA EINSTEIN dengan sistem pemesanan langsung terhubung ke WhatsApp.',
    icon: '🛒',
    render: () => `
      <div class="danus-hub">
        <!-- Products Grid -->
        <div class="product-grid">
          <div class="product-card">
            <div class="product-img">👕</div>
            <div class="product-info">
              <span class="product-name">PDH HIMA EINSTEIN 2026</span>
              <span class="product-price">Rp 135.000</span>
              <button class="btn-ghost btn-cyan product-btn" onclick="addToCart('PDH HIMA EINSTEIN 2026', 135000)">+ Tambah</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🧥</div>
            <div class="product-info">
              <span class="product-name">Jaket Bomber Phótisma</span>
              <span class="product-price">Rp 185.000</span>
              <button class="btn-ghost btn-cyan product-btn" onclick="addToCart('Jaket Bomber Phótisma', 185000)">+ Tambah</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🏷️</div>
            <div class="product-info">
              <span class="product-name">Gantungan Kunci Kayu Logo</span>
              <span class="product-price">Rp 15.000</span>
              <button class="btn-ghost btn-cyan product-btn" onclick="addToCart('Gantungan Kunci Kayu Logo', 15000)">+ Tambah</button>
            </div>
          </div>
        </div>

        <!-- Cart Panel -->
        <div class="cart-panel">
          <div class="cart-title">
            <span>Keranjang Belanja</span>
            <span id="cart-count">0</span>
          </div>
          <div class="cart-items" id="cart-items-list">
            <p style="color: var(--text-dark-gray); font-size: 0.85rem; text-align: center; padding: 20px 0; font-family: var(--font-header);">Cart Empty</p>
          </div>
          <div class="cart-total">
            <span>Total Pembayaran:</span>
            <span id="cart-total-price">Rp 0</span>
          </div>
          <button class="checkout-btn" onclick="checkoutCart()">
            <i class="fa-brands fa-whatsapp"></i> Checkout via WhatsApp
          </button>
        </div>
      </div>
    `
  },
  kominfo: {
    title: 'Komunikasi dan Informasi (Kominfo)',
    desc: 'Manajemen penyiaran berita, media publikasi buletin, dan podcast sains terintegrasi.',
    icon: '📢',
    render: () => `
      <div class="kominfo-hub">
        <p style="color: var(--text-gray); margin-bottom: 24px; font-weight: 300;">Simak dan baca publikasi resmi terbaru dari HIMA EINSTEIN.</p>
        <div class="project-board">
          <div class="project-item">
            <span class="project-tag" style="color: var(--accent-gold); border-color: var(--accent-gold);">Podcast Einstein</span>
            <h4>Episode #12: Masa Depan SMR (Small Modular Reactor) di RI</h4>
            <p>Membahas peluang implementasi reaktor nuklir modular kecil sebagai penyuplai energi bersih di Indonesia.</p>
            <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Memutar podcast audio...');">▶️ Putar Podcast</button>
          </div>
          <div class="project-item">
            <span class="project-tag" style="color: var(--accent-gold); border-color: var(--accent-gold);">Rilis Buletin</span>
            <h4>Buletin EINSTEIN Vol. 7 (Edisi Juli 2026)</h4>
            <p>Kompilasi artikel riset instrumentasi dan rilis pers kegiatan Kabinet Phótisma selama triwulan pertama.</p>
            <button class="btn-ghost btn-cyan" style="padding: 10px 20px; font-size: 0.65rem;" onclick="alert('Membuka buletin digital...');">📖 Baca Buletin</button>
          </div>
        </div>
      </div>
    `
  },
  aset_logistik: {
    title: 'Aset dan Logistik',
    desc: 'Portal peminjaman instrumentasi lab Himpunan dan pemantauan ketersediaan aset logistik.',
    icon: '📦',
    render: () => `
      <div class="aset-container">
        <p style="color: var(--text-gray); margin-bottom: 24px; font-weight: 300;">Daftar instrumentasi & modul praktikum milik Himpunan. Pilih alat untuk mengajukan izin peminjaman.</p>
        
        <div class="asset-grid">
          <div class="asset-card">
            <div class="asset-header">
              <span style="font-size: 1.5rem;">📟</span>
              <span class="asset-status available">Tersedia</span>
            </div>
            <h4>Digital Multimeter Sanwa CD800a</h4>
            <span class="asset-id">ID: HIMA-MULT-002</span>
            <p>Instrumen ukur tegangan/arus presisi dengan fitur proteksi overload.</p>
            <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.65rem; width: 100%; margin-top: auto;" onclick="borrowAsset('Digital Multimeter Sanwa CD800a', 'HIMA-MULT-002')">Pinjam Alat</button>
          </div>
          <div class="asset-card">
            <div class="asset-header">
              <span style="font-size: 1.5rem;">🔥</span>
              <span class="asset-status borrowed">Dipinjam</span>
            </div>
            <h4>Solder Station Hakko FX-888D</h4>
            <span class="asset-id">ID: HIMA-SOLD-005</span>
            <p>Solder station dengan pemanas konstan presisi untuk pengerjaan PCB.</p>
            <button class="btn-ghost" style="padding: 8px 16px; font-size: 0.65rem; width: 100%; margin-top: auto;" disabled>Sedang Dipinjam</button>
          </div>
          <div class="asset-card">
            <div class="asset-header">
              <span style="font-size: 1.5rem;">🔌</span>
              <span class="asset-status available">Tersedia</span>
            </div>
            <h4>Arduino Starter Kit (Uno R3)</h4>
            <span class="asset-id">ID: HIMA-ARDU-011</span>
            <p>Kit lengkap development board Uno R3, breadboard, dan modul sensor dasar.</p>
            <button class="btn-ghost btn-cyan" style="padding: 8px 16px; font-size: 0.65rem; width: 100%; margin-top: auto;" onclick="borrowAsset('Arduino Starter Kit (Uno R3)', 'HIMA-ARDU-011')">Pinjam Alat</button>
          </div>
        </div>
      </div>
    `
  }
};

let currentActiveDivision = null;

function initDivisions() {
  const cards = document.querySelectorAll('.divisi-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const divisionId = card.getAttribute('data-divisi');
      selectDivision(divisionId, card);
    });
  });
}

function selectDivision(id, cardElement) {
  // Clear previous active card
  document.querySelectorAll('.divisi-card').forEach(c => c.classList.remove('active'));
  
  // Highlight clicked card
  if (cardElement) {
    cardElement.classList.add('active');
  } else {
    // Find card by division attribute if clicked from header
    const card = document.querySelector(`.divisi-card[data-divisi="${id}"]`);
    if (card) card.classList.add('active');
  }

  currentActiveDivision = id;
  const data = DIVISION_DATA[id];
  const hubContent = document.getElementById('hub-content-area');
  
  if (data && hubContent) {
    hubContent.innerHTML = `
      <div class="hub-header">
        <div class="hub-title-text">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
        </div>
      </div>
      <div class="hub-body-content">
        ${data.render()}
      </div>
    `;

    // Smooth scroll down to interactive hub
    document.getElementById('interactive-hub').scrollIntoView({ behavior: 'smooth' });
    
    // If Danus is selected, render active cart state
    if (id === 'danus') {
      renderCart();
    }
  }
}

/* ==========================================================================
   INTERACTIVE HUB FUNCTIONALITIES: DANA USAHA (CART SYSTEM)
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
    list.innerHTML = `<p style="color: var(--text-dark-gray); font-size: 0.85rem; text-align: center; padding: 20px 0; font-family: var(--font-header);">Cart Empty</p>`;
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
        <div style="display:flex; gap:12px; align-items:center;">
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
   INTERACTIVE HUB FUNCTIONALITIES: RISET & TEKNOLOGI (TABS)
   ========================================================================== */
window.switchRistekTab = function(tabName) {
  const tabs = document.querySelectorAll('.ristek-tab-btn');
  tabs.forEach(btn => btn.classList.remove('active'));
  
  const contents = document.querySelectorAll('.ristek-tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Find active button
  const activeBtn = Array.from(tabs).find(btn => btn.textContent.toLowerCase().includes(tabName === 'vault' ? 'vault' : tabName === 'les' ? 'mengajar' : 'project'));
  if (activeBtn) activeBtn.classList.add('active');

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) activeContent.classList.add('active');
};

/* ==========================================================================
   INTERACTIVE HUB FUNCTIONALITIES: ASET & LOGISTIK (BORROW REQUEST)
   ========================================================================== */
window.borrowAsset = function(assetName, assetId) {
  const name = prompt('Masukkan Nama Lengkap Anda untuk peminjaman:');
  if (!name) return;
  const nim = prompt('Masukkan NIM Anda:');
  if (!nim) return;

  const text = `Halo Logistik HIMA EINSTEIN!\n\nSaya ingin mengajukan peminjaman alat:\n- Nama Alat: ${assetName}\n- ID Alat: ${assetId}\n\nPeminjam:\n- Nama: ${name}\n- NIM: ${nim}\n\nMohon konfirmasi ketersediaan pengambilan alat di Sekretariat. Terima kasih!`;
  const url = `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
