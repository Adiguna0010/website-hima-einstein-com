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
  const particleCount = 45;
  const connectionDistance = 110;
  
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
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
      ctx.fillStyle = '#00E5FF';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00E5FF';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow
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

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.8;
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
    desc: 'Pusat komando, kesekretariatan, dan keuangan Kabinet Phótisma.',
    icon: '⚡',
    render: () => `
      <div class="bph-chart">
        <div class="chart-level">
          <div class="member-node">
            <div class="avatar-placeholder">👨‍💼</div>
            <h4>Kahim HIMA</h4>
            <p>Ketua Himpunan</p>
          </div>
          <div class="member-node">
            <div class="avatar-placeholder">👩‍💼</div>
            <h4>Wakahim HIMA</h4>
            <p>Wakil Ketua Himpunan</p>
          </div>
        </div>
        <div class="chart-level">
          <div class="member-node">
            <div class="avatar-placeholder">📝</div>
            <h4>Sekretaris I & II</h4>
            <p>Administrasi & Arsip</p>
          </div>
          <div class="member-node">
            <div class="avatar-placeholder">🪙</div>
            <h4>Bendahara I & II</h4>
            <p>Manajemen Keuangan</p>
          </div>
        </div>
      </div>
    `
  },
  internal: {
    title: 'Internal',
    desc: 'Menjaga keakraban pengurus, menampung aspirasi, dan mengeratkan hubungan antar-anggota.',
    icon: '🤝',
    render: () => `
      <div class="hub-placeholder">
        <div class="hub-placeholder-icon">🛠️</div>
        <h3>Divisi Internal</h3>
        <p>Program kerja dan fitur interaktif divisi Internal sedang dirumuskan bersama tim untuk menjaga ikatan keakraban seluruh pengurus.</p>
      </div>
    `
  },
  external: {
    title: 'External',
    desc: 'Menghubungkan HIMA EINSTEIN dengan pihak luar, alumni, industri, dan himpunan mahasiswa lainnya.',
    icon: '🌐',
    render: () => `
      <div class="ristek-vault">
        <h4>Hubungan Luar & Kolaborasi</h4>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Daftarkan instansi atau Himpunan Anda untuk mengadakan kunjungan industri, studi banding, atau kemitraan strategis.</p>
        <form class="glass-panel" style="padding: 24px;" onsubmit="alert('Formulir kemitraan berhasil dikirim!'); return false;">
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Instansi / Himpunan</label>
              <input type="text" class="form-control" placeholder="Contoh: HMTC ITS" required>
            </div>
            <div class="form-group">
              <label>Email Kontak</label>
              <input type="email" class="form-control" placeholder="nama@domain.com" required>
            </div>
            <div class="form-group full-width">
              <label>Tujuan Kunjungan / Kerjasama</label>
              <textarea class="form-control" rows="3" placeholder="Jelaskan secara singkat rencana kolaborasi..." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Kirim Pengajuan</button>
        </form>
      </div>
    `
  },
  ristek: {
    title: 'Riset dan Teknologi (Ristek)',
    desc: 'Pusat riset, pengembangan iptek elektronika nuklir, pendaftaran tutor, dan repositori akademik.',
    icon: '🔬',
    render: () => `
      <div class="ristek-container">
        <div class="ristek-tabs">
          <button class="ristek-tab-btn active" onclick="switchRistekTab('vault')">Einstein Vault (Bank Soal)</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('les')">Ristek Mengajar (Tutor)</button>
          <button class="ristek-tab-btn" onclick="switchRistekTab('proyek')">Project Collaboration</button>
        </div>

        <!-- Einstein Vault -->
        <div id="tab-vault" class="ristek-tab-content active">
          <div class="vault-list">
            <div class="vault-item">
              <div class="vault-info">
                <h4>Bank Soal UTS: Mikroprosesor & Mikrokontroler</h4>
                <p>Format: PDF | Ukuran: 2.4 MB | Diunggah: 2 hari lalu</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Soal UTS Mikro...'); return false;">⬇️ Unduh</a>
            </div>
            <div class="vault-item">
              <div class="vault-info">
                <h4>Modul Praktikum: Sensor Radiasi Nuklir & Detektor</h4>
                <p>Format: PDF | Ukuran: 4.8 MB | Diunggah: 1 minggu lalu</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Modul Detektor...'); return false;">⬇️ Unduh</a>
            </div>
            <div class="vault-item">
              <div class="vault-info">
                <h4>Catatan Kuliah: Elektronika Analog Lanjut</h4>
                <p>Format: PDF | Ukuran: 12.1 MB | Diunggah: 3 minggu lalu</p>
              </div>
              <a href="#" class="download-link" onclick="alert('Mengunduh Catatan Elekan...'); return false;">⬇️ Unduh</a>
            </div>
          </div>
        </div>

        <!-- Ristek Mengajar / Guru Les -->
        <div id="tab-les" class="ristek-tab-content">
          <p style="color: var(--text-secondary); margin-bottom: 20px;">Butuh bimbingan belajar tambahan atau ingin mendaftar sebagai tutor sebaya di HIMA EINSTEIN? Daftarkan diri Anda di bawah.</p>
          <form class="glass-panel" style="padding: 24px;" onsubmit="alert('Pendaftaran Ristek Mengajar berhasil dikirim!'); return false;">
            <div class="form-grid">
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" class="form-control" placeholder="Nama Anda" required>
              </div>
              <div class="form-group">
                <label>Pilih Peran</label>
                <select class="form-control" required>
                  <option value="murid">Saya Butuh Tutor (Murid)</option>
                  <option value="tutor">Saya Ingin Mengajar (Tutor)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Mata Kuliah / Bidang</label>
                <input type="text" class="form-control" placeholder="Contoh: Fisika Radiasi, Pemrograman C++" required>
              </div>
              <div class="form-group">
                <label>Kontak WhatsApp</label>
                <input type="text" class="form-control" placeholder="08xxxxxxxxx" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Daftar Sekarang</button>
          </form>
        </div>

        <!-- Project Collaboration -->
        <div id="tab-proyek" class="ristek-tab-content">
          <div class="project-board">
            <div class="project-item">
              <span class="project-tag">IoT & Radiasi</span>
              <h4>Sistem Monitor Radiasi Real-time</h4>
              <p>Membangun modul sensor radiasi Geiger-Müller portabel berbasis ESP32 yang terhubung ke dashboard IoT publik.</p>
              <button class="btn btn-secondary btn-sm" onclick="alert('Terima kasih telah bergabung di proyek Sistem Monitor Radiasi. Ketua proyek akan menghubungi Anda via WhatsApp.');">Gabung Proyek</button>
            </div>
            <div class="project-item">
              <span class="project-tag">Robotika</span>
              <h4>Robot Detektor Kebocoran Lab</h4>
              <p>Desain mobile robot beroda tank untuk melakukan inspeksi laboratorium gas dan lingkungan lab radiasi nuklir secara otonom.</p>
              <button class="btn btn-secondary btn-sm" onclick="alert('Terima kasih telah bergabung di proyek Robot Detektor. Ketua proyek akan menghubungi Anda via WhatsApp.');">Gabung Proyek</button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  pengma: {
    title: 'Pengembangan Mahasiswa (Pengma)',
    desc: 'Pengembangan soft skill, karir, info magang, serta peningkatan kompetensi mahasiswa Elektronika Instrumentasi.',
    icon: '🚀',
    render: () => `
      <div class="pengma-hub">
        <h4 style="margin-bottom: 20px;">Info Pelatihan & Karir Terkini</h4>
        <div class="vault-list">
          <div class="vault-item">
            <div class="vault-info">
              <h4>Pelatihan Sertifikasi PLC Siemens S7-1200</h4>
              <p>Tanggal: 25 Juli 2026 | Kuota: Terbatas | Lokasi: Lab Kendali</p>
            </div>
            <button class="btn btn-primary btn-sm" style="padding: 6px 14px; font-size: 0.85rem;" onclick="alert('Pendaftaran Sertifikasi PLC berhasil!');">Daftar Pelatihan</button>
          </div>
          <div class="vault-item">
            <div class="vault-info">
              <h4>Info Magang: PT. Thorcon Power Indonesia (Instrumentation Intern)</h4>
              <p>Deadline: 1 Agustus 2026 | Kategori: Magang Industri</p>
            </div>
            <button class="btn btn-secondary btn-sm" style="padding: 6px 14px; font-size: 0.85rem;" onclick="alert('Membuka tautan magang Thorcon...');">Detail Lowongan</button>
          </div>
        </div>
      </div>
    `
  },
  danus: {
    title: 'Dana Usaha (Danus)',
    desc: 'Toko online resmi HIMA EINSTEIN menjual merchandise eksklusif dengan checkout WhatsApp.',
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
              <button class="btn btn-primary product-btn" onclick="addToCart('PDH HIMA EINSTEIN 2026', 135000)">+ Keranjang</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🧥</div>
            <div class="product-info">
              <span class="product-name">Jaket Bomber Phótisma</span>
              <span class="product-price">Rp 185.000</span>
              <button class="btn btn-primary product-btn" onclick="addToCart('Jaket Bomber Phótisma', 185000)">+ Keranjang</button>
            </div>
          </div>
          <div class="product-card">
            <div class="product-img">🏷️</div>
            <div class="product-info">
              <span class="product-name">Gantungan Kunci Kayu Logo</span>
              <span class="product-price">Rp 15.000</span>
              <button class="btn btn-primary product-btn" onclick="addToCart('Gantungan Kunci Kayu Logo', 15000)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <!-- Cart Panel -->
        <div class="cart-panel">
          <div class="cart-title">
            <span>🛒 Keranjang Belanja</span>
            <span id="cart-count">0</span>
          </div>
          <div class="cart-items" id="cart-items-list">
            <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px 0;">Keranjang belanja Anda kosong.</p>
          </div>
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total-price">Rp 0</span>
          </div>
          <button class="btn checkout-btn" onclick="checkoutCart()">
            <span>💬 Checkout via WhatsApp</span>
          </button>
        </div>
      </div>
    `
  },
  kominfo: {
    title: 'Komunikasi dan Informasi (Kominfo)',
    desc: 'Pusat publikasi digital, manajemen media sosial, dokumentasi, dan hubungan eksternal digital.',
    icon: '📢',
    render: () => `
      <div class="kominfo-hub">
        <h4 style="margin-bottom: 20px;">Publikasi & Konten Media Einstein</h4>
        <div class="project-board">
          <div class="project-item">
            <span class="project-tag" style="background: rgba(255, 215, 0, 0.1); color: var(--accent-gold);">Podcast Einstein</span>
            <h4>Episode #12: Masa Depan Reaktor Nuklir Modular di Indonesia</h4>
            <p>Mendengarkan diskusi hangat bersama pakar reaktor nuklir BRIN mengenai potensi energi bersih berbasis PLTN.</p>
            <button class="btn btn-secondary btn-sm" onclick="alert('Memutar podcast...');">▶️ Putar Podcast</button>
          </div>
          <div class="project-item">
            <span class="project-tag" style="background: rgba(255, 215, 0, 0.1); color: var(--accent-gold);">Rilis Buletin</span>
            <h4>Buletin EINSTEIN Vol. 7 (Edisi Juli 2026)</h4>
            <p>Rangkuman kegiatan Himpunan selama triwulan pertama Kabinet Phótisma beserta info riset teknologi terbaru.</p>
            <button class="btn btn-secondary btn-sm" onclick="alert('Membuka file Buletin PDF...');">📖 Baca Buletin</button>
          </div>
        </div>
      </div>
    `
  },
  aset_logistik: {
    title: 'Aset dan Logistik',
    desc: 'Pengelolaan, inventarisasi, dan penyediaan alat pendukung kegiatan akademis serta praktikum mahasiswa.',
    icon: '📦',
    render: () => `
      <div class="aset-container">
        <div class="hub-header" style="border-bottom: none; margin-bottom: 15px; padding-bottom: 0;">
          <div class="hub-title-text">
            <p>Daftar inventaris alat Himpunan yang dapat dipinjam untuk kebutuhan praktikum, riset, atau kegiatan HIMA.</p>
          </div>
        </div>
        <div class="asset-grid">
          <div class="asset-card">
            <div class="asset-header">
              <span class="asset-icon">📟</span>
              <span class="asset-status available">Tersedia</span>
            </div>
            <h4>Digital Multimeter Sanwa CD800a</h4>
            <span class="asset-id">ID: HIMA-MULT-002</span>
            <p>Alat ukur tegangan, arus, dan hambatan presisi tinggi untuk praktikum rangkaian listrik.</p>
            <button class="btn btn-primary btn-sm" style="font-size: 0.85rem;" onclick="borrowAsset('Digital Multimeter Sanwa CD800a', 'HIMA-MULT-002')">Ajukan Peminjaman</button>
          </div>
          <div class="asset-card">
            <div class="asset-header">
              <span class="asset-icon">🔥</span>
              <span class="asset-status borrowed">Sedang Dipinjam</span>
            </div>
            <h4>Solder Station Hakko FX-888D</h4>
            <span class="asset-id">ID: HIMA-SOLD-005</span>
            <p>Solder station dengan pengaturan suhu digital konstan untuk pengerjaan PCB.</p>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.85rem;" disabled>Pinjam Alat</button>
          </div>
          <div class="asset-card">
            <div class="asset-header">
              <span class="asset-icon">🔌</span>
              <span class="asset-status available">Tersedia</span>
            </div>
            <h4>Arduino Starter Kit (Uno R3)</h4>
            <span class="asset-id">ID: HIMA-ARDU-011</span>
            <p>Kit berisi Arduino Uno R3, kabel jumper, breadboard, sensor-sensor dasar, dan LED.</p>
            <button class="btn btn-primary btn-sm" style="font-size: 0.85rem;" onclick="borrowAsset('Arduino Starter Kit (Uno R3)', 'HIMA-ARDU-011')">Ajukan Peminjaman</button>
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
  }

  currentActiveDivision = id;
  const data = DIVISION_DATA[id];
  const hubContent = document.getElementById('hub-content-area');
  
  if (data && hubContent) {
    hubContent.innerHTML = `
      <div class="hub-header">
        <div class="hub-title">
          <div class="hub-title-icon">${data.icon}</div>
          <div class="hub-title-text">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
          </div>
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
    list.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px 0;">Keranjang belanja Anda kosong.</p>`;
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
