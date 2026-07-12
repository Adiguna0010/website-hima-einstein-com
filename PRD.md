# Product Requirement Document (PRD)
## HIMA EINSTEIN.COM - Kabinet Phótisma

Rencana kebutuhan produk (PRD) ini menjabarkan fondasi fitur, batasan, target pengguna, dan fungsionalitas sistem yang akan diimplementasikan pada portal website resmi Himpunan Mahasiswa Program Studi Elektronika Instrumentasi (HIMA EINSTEIN) Politeknik Teknologi Nuklir Indonesia.

---

## 1. Problem Statement (Pernyataan Masalah)
HIMA EINSTEIN, khususnya pada masa kepengurusan Kabinet Phótisma, menghadapi beberapa tantangan operasional, manajemen internal, dan optimalisasi pendanaan yang masih bersifat manual serta terfragmentasi. Ketiadaan sebuah sistem digital terintegrasi menimbulkan hambatan kerja pada beberapa aspek utama:
* **Inefisiensi Sistem Administrasi & Persuratan (BPH/Sekretariat):** Anggota himpunan sering mengalami kebingungan karena tidak adanya akses terpusat ke template berkas resmi (Proposal, LPJ, Surat Undangan). Alur pengajuan nomor surat resmi ke BPH serta proses persetujuan (ACC) dari Sekretaris Umum masih manual dan lambat.
* **Kerentanan Manajemen Aset & Logistik:** Divisi Aset & Logistik kesulitan memantau inventaris instrumen laboratorium sekretariat (Multimeter, Solder, Arduino Kit). Peminjaman alat rentan kehilangan karena belum terdata secara otomatis menggunakan ID dan barcode/QR code yang dapat dipindai secara langsung melalui web.
* **Fragmentasi Repositori Pengetahuan & Teknologi (Ristek):** Modul-modul pembelajaran, materi riset, serta bank soal (Software Bank & Einstein Vault / Library) belum terpusat dengan baik, sehingga menyulitkan mahasiswa dalam mengakses referensi akademis secara cepat.
* **Keterbatasan Kanal Penjualan Resmi Divisi Dana Usaha (Danus):** Divisi Danus belum memiliki platform e-commerce terpusat untuk memasarkan produk dan merchandise resmi HIMA EINSTEIN. Proses transaksi yang ada saat ini masih manual, kurang terdata, serta belum memiliki alur pembayaran nontunai (seperti QRIS) yang terintegrasi rapi dengan sistem komunikasi pemesanan guna mempercepat verifikasi sebelum produk dikirim.
* **Hambatan Kemitraan Eksternal & Branding:** Divisi Internal dan External kesulitan meyakinkan pihak sponsor atau mitra luar akibat ketiadaan portal portofolio resmi yang menampilkan linimasa sejarah, dokumentasi, dan sorotan pencapaian himpunan secara profesional.

---

## 2. Goals (Tujuan Produk)
Tujuan utama dari pengembangan platform website HIMA EINSTEIN Kabinet Phótisma adalah membangun ekosistem digital terintegrasi yang mampu mengotomatisasi birokrasi, mengamankan aset, dan meningkatkan kemandirian ekonomi serta branding organisasi melalui pencapaian target berikut:
* **Digitalisasi dan Otomatisasi Administrasi (BPH):**
  * Menyediakan Download Center terpusat yang menyediakan template berkas resmi (Proposal, LPJ, Surat Undangan) yang mudah diakses oleh seluruh anggota.
  * Membangun sistem pengajuan nomor surat dan alur persetujuan (ACC) digital oleh Sekretaris Umum guna memotong waktu birokrasi manual.
* **Modernisasi Manajemen Inventaris dengan Sistem Barcode (Logistik):**
  * Mengimplementasikan sistem pencatatan inventaris berbasis ID unik dan Barcode/QR Code untuk mempermudah Divisi Aset dan Logistik.
  * Menyediakan fitur scanning langsung via web untuk proses peminjaman alat secara real-time guna meminimalisir risiko kehilangan barang.
* **Optimalisasi Pendanaan Mandiri (Danus):**
  * Membangun toko online resmi (Einstein Market) dengan katalog produk dinamis untuk memasarkan merchandise eksklusif.
  * Mengintegrasikan sistem Shopping Cart yang mendukung metode pembayaran via QRIS resmi HIMA, serta tombol checkout langsung ke WhatsApp untuk mempermudah konversi penjualan berbasis bukti pembayaran yang valid sebelum barang dikirim.
* **Pusat Pengetahuan Akademik Terpusat (Ristek):**
  * Menyediakan wadah Einstein Vault (Software Bank dan Library Modul) sebagai repositori digital yang rapi untuk mendukung kebutuhan belajar mahasiswa Elektronika Instrumentasi.
* **Penguatan Media Branding dan Portofolio Organisasi (External):**
  * Menampilkan linimasa sejarah, dokumentasi kegiatan, serta portofolio pencapaian Kabinet Phótisma secara profesional guna meningkatkan kepercayaan pihak sponsor dan mitra luar.

---

## 3. Target User (Pengguna Sasaran)

### A. Kelompok Pengguna Internal (Himpunan & Mahasiswa Elins)
1. **Sekretaris Umum BPH (Badan Pengurus Harian)**
   * *Peran:* Penanggung jawab administrasi dan birokrasi himpunan.
   * *Kebutuhan:* Memvalidasi pengajuan nomor surat, memberikan persetujuan (ACC) berkas, serta mengelola template dokumen resmi di Download Center.
2. **Divisi Aset & Logistik (Staff Logistik)**
   * *Peran:* Pengelola inventaris dan peralatan sekretariat.
   * *Kebutuhan:* Memasukkan data barang baru, membuat ID/Barcode, melihat status ketersediaan alat secara real-time, dan memproses pengembalian barang.
3. **Divisi Dana Usaha (Danus)**
   * *Peran:* Pengelola bisnis dan pendanaan mandiri himpunan.
   * *Kebutuhan:* Memperbarui katalog merchandise di Einstein Market (stok, harga, foto) dan memantau pesanan yang masuk.
4. **Divisi Riset dan Teknologi (Ristek)**
   * *Peran:* Pengelola konten akademis dan edukasi teknologi.
   * *Kebutuhan:* Mengunggah dan merapikan modul pembelajaran, diktat, bank soal, serta software pendukung ke dalam Einstein Vault.
5. **Anggota Himpunan / Mahasiswa Elektronika Instrumentasi**
   * *Peran:* Pengguna umum fasilitas internal.
   * *Kebutuhan:* Mengunduh template surat, mengajukan peminjaman alat dengan scan barcode lewat HP, mengakses materi belajar di Einstein Vault, serta membeli merchandise resmi.

### B. Kelompok Pengguna Eksternal (Pihak Luar)
1. **Calon Sponsor dan Mitra Strategis (Perusahaan/Instansi)**
   * *Peran:* Pihak luar yang berpotensi mendanai atau bekerja sama dengan himpunan.
   * *Kebutuhan:* Melihat profil profesional Kabinet Phótisma, rekam jejak kegiatan, dokumentasi sejarah, serta portofolio pencapaian untuk menilai validitas organisasi sebelum memberikan dana sponsor.
2. **Masyarakat Umum / Ormawa Eksternal**
   * *Peran:* Pengunjung website dari luar program studi atau luar kampus Poltek Nuklir.
   * *Kebutuhan:* Melihat agenda kegiatan bulanan melalui Einstein Kalender dan mengenal profil HIMA EINSTEIN secara umum.

---

## 4. User Stories

### A. Kebutuhan Internal (BPH, Divisi, & Mahasiswa)
* **Sebagai Sekretaris Umum BPH**, saya ingin memiliki dashboard khusus manajemen dokumen supaya saya bisa memeriksa, memberikan nomor surat resmi, dan memberikan ACC secara digital dengan cepat tanpa harus bertatap muka.
* **Sebagai Staf Divisi Aset & Logistik**, saya ingin bisa mendaftarkan barang inventaris dengan ID unik dan mencetak Barcode/QR Code langsung dari sistem supaya proses inventarisasi sekretariat rapi dan pelacakan status barang menjadi lebih mudah.
* **Sebagai Staf Divisi Dana Usaha (Danus)**, saya ingin memiliki fitur manajemen katalog produk (input foto, harga, deskripsi, dan stok) supaya saya bisa memperbarui merchandise Kabinet Phótisma yang dijual di Einstein Market secara dinamis. Saya juga ingin menerima rangkuman pesanan dan bukti transfer QRIS langsung di WhatsApp supaya saya bisa memverifikasi pembayaran terlebih dahulu sebelum menyiapkan dan mengirimkan produk kepada pembeli.
* **Sebagai Staf Divisi Riset dan Teknologi (Ristek)**, saya ingin bisa mengunggah berkas modul, diktat, bank soal, serta link software ke kategori yang terstruktur supaya materi pembelajaran di Einstein Vault tersusun rapi dan mudah dicari.
* **Sebagai Mahasiswa Elektronika Instrumentasi**, saya ingin bisa melakukan scan Barcode/QR Code alat laboratorium langsung lewat kamera HP di website supaya saya bisa meminjam alat sekretariat secara instan dan datanya langsung tercatat resmi di sistem.
* **Sebagai Mahasiswa Elektronika Instrumentasi**, saya ingin bisa mengakses Einstein Vault dan mengunduh template persuratan supaya saya bisa mendapatkan referensi belajar (modul/bank soal) dan mengurus birokrasi kegiatan tanpa kebingungan.

### B. Kebutuhan Eksternal (Mitra & Pengunjung)
* **Sebagai Calon Sponsor / Mitra Eksternal**, saya ingin melihat halaman portofolio pencapaian, rekam jejak program kerja, dan profil profesional Kabinet Phótisma supaya saya bisa menilai kredibilitas dan validitas HIMA EINSTEIN sebelum menyetujui kerja sama atau memberikan dana.
* **Sebagai Pengunjung Umum / Ormawa Lain**, saya ingin melihat Einstein Kalender yang berisi agenda kegiatan bulanan himpunan supaya saya bisa mengetahui jadwal acara terdekat dan menghindari bentrok agenda antarorganisasi.

---

## 5. Functional Requirements (Kebutuhan Fungsional)

* **FR-1: Halaman Beranda (Home) [Priority: P0]**
  * Sistem harus dapat menampilkan profil lengkap HIMA EINSTEIN, sambutan Ketua Himpunan, serta visi & misi Kabinet Phótisma.
  * Sistem harus dapat memutar/menampilkan video profile himpunan yang tersemat (embedded) dari platform video (seperti YouTube).
* **FR-2: Halaman Einstein Sphere (Sektor Divisi Hub) [Priority: P1]**
  * Sistem harus menyediakan komponen Navbar dengan fitur dropdown cepat untuk memilih 8 divisi kerja Himpunan (BPH, Internal, External, Ristek, Pengma, Danus, Kominfo, Logistik).
  * Sistem harus dapat meluncurkan komponen Console Drawer (laci interaktif yang muncul dari kanan layar) ketika pengguna mengklik kartu interaktif divisi, guna menampilkan detail program kerja masing-masing divisi.
* **FR-3: Halaman Einstein Market (Dana Usaha Store) [Priority: P0]**
  * Sistem harus menampilkan katalog produk merchandise resmi (PDH, Kaos, Jaket, Ganci) dalam bentuk Grid produk yang dinamis.
  * Sistem harus memiliki fitur Shopping Cart (Keranjang Belanja) lokal untuk menampung item yang dipilih pengguna sebelum checkout.
  * Sistem harus menyediakan tombol Instant Checkout yang secara otomatis merangkum daftar pesanan di keranjang belanja dan mengarahkannya (redirect) menjadi teks pesan chat langsung ke WhatsApp Admin Danus.
  * Sistem harus menyediakan halaman Checkout Summary yang menampilkan gambar dinamis/statis QRIS resmi HIMA EINSTEIN beserta total harga yang harus dibayar.
  * Sistem harus menyediakan form/input bagi pengguna untuk mengunggah berkas atau tautan bukti pembayaran QRIS mereka.
* **FR-4: Halaman Einstein Quest (Sejarah & Dokumentasi) [Priority: P1]**
  * Sistem harus menyediakan fitur Timeline (Linimasa) interaktif yang memaparkan perjalanan sejarah Himpunan dari tahun berdiri hingga era Kabinet Phótisma.
  * Sistem harus menyediakan galeri arsip foto kegiatan penting dan sorotan pencapaian (portofolio kolektif) yang responsif.
* **FR-5: Halaman Einstein Space (Peminjaman Alat) [Priority: P0]**
  * Sistem harus menampilkan daftar instrumen laboratorium (Multimeter, Solder, Arduino Kit, dll) beserta status ketersediaannya secara real-time (Tersedia / Dipinjam).
  * Sistem harus memiliki fitur akses kamera web (Webcam/Camera API) untuk melakukan scanning Barcode/QR Code langsung dari perangkat pengguna untuk mengidentifikasi ID barang secara instan.
  * Sistem harus menyediakan form reservasi/booking peminjaman yang terintegrasi dengan WhatsApp notifikasi otomatis setelah proses scan berhasil.
* **FR-6: Halaman Sekretariat (Dokumen & Persuratan) [Priority: P0]**
  * Sistem harus menyediakan Download Center khusus anggota untuk mengunduh berkas template resmi (Proposal, LPJ, Surat Undangan) dalam format dokumen (.docx / .pdf).
  * Sistem harus menyediakan formulir digital untuk pengajuan nomor surat resmi ke BPH.
  * Sistem harus menyediakan Dashboard Backoffice bagi Sekretaris Umum untuk mengubah status pengajuan surat menjadi "Disetujui / ACC" atau "Ditolak".
* **FR-7: Halaman Einstein Kalender (Agenda Ormawa) [Priority: P2]**
  * Sistem harus menampilkan kalender agenda bulanan interaktif yang menampilkan jadwal kegiatan internal HIMA EINSTEIN.
  * Sistem harus dapat menampilkan agenda kegiatan luar/ormawa eksternal kampus Politeknik Teknologi Nuklir Indonesia sebagai referensi kolaborasi.

---

## 6. Non-Functional Requirements (Kebutuhan Non-Fungsional)

### NFR-1: Performa & Kecepatan (Performance)
* **Waktu Pemuatan Halaman:** Halaman utama (Home) dan katalog Einstein Market harus dapat dimuat sepenuhnya dalam waktu di bawah 2,5 detik pada koneksi internet standar (4G/Wi-Fi).
* **Optimalisasi Gambar:** Seluruh aset foto dokumentasi di Einstein Quest dan gambar produk merchandise harus dikompresi (misalnya menggunakan format WebP) agar tidak membebani performa bandwidth server.

### NFR-2: Responsivitas & Tampilan (Usability & Responsiveness)
* **Mobile-First Design:** Karena fitur scan barcode di Einstein Space dan akses Einstein Vault akan sering diakses mahasiswa melalui smartphone, seluruh antarmuka website harus 100% responsif dan berfungsi optimal di berbagai ukuran layar (Mobile, Tablet, Desktop).
* **Interaktivitas Komponen:** Animasi peluncuran Console Drawer pada halaman Einstein Sphere harus berjalan lancar tanpa lagging (frame rate konstan).

### NFR-3: Keamanan Data & Sistem (Security)
* **Enkripsi Koneksi:** Website wajib mengimplementasikan protokol HTTPS (SSL/TLS) untuk mengamankan data transaksi checkout dan proses pengiriman formulir persuratan.
* **Validasi Akses Kamera:** Fitur Webcam/Camera API untuk scanning barcode hanya boleh aktif setelah mendapatkan izin eksplisit (permission) dari pengguna, dan data stream kamera tidak boleh disimpan di server (hanya diproses di sisi klien/client-side).
* **Hak Akses (Role-Based Access Control):** Halaman backoffice pengubah status nomor surat dan manajemen inventaris logistik harus dilindungi sistem autentikasi, sehingga hanya Sekretaris Umum dan staf divisi terkait yang dapat mengaksesnya.
* **Enkripsi & Validasi File:** Dokumen bukti pembayaran QRIS yang diunggah oleh pengguna harus divalidasi formatnya (hanya menerima ekstensi .jpg, .jpeg, .png) dengan ukuran maksimal 2MB untuk mencegah malware dan menghemat penyimpanan lokal/cloud.

### NFR-4: Keandalan & Ketersediaan (Availability & Reliability)
* **Uptime Minimum:** Sistem harus memiliki tingkat ketersediaan (uptime) minimal 99.5%, terutama pada masa-masa krusial seperti periode ujian (saat akses bank soal Einstein Vault melonjak) atau masa pemesanan baju PDH.
* **Penanganan Error:** Jika terjadi kegagalan pemindaian barcode akibat kamera buram atau kode rusak, sistem harus menampilkan pesan error yang jelas beserta opsi input ID barang secara manual.

---

## 7. Scope (Ruang Lingkup Proyek)

### A. In Scope (Fitur yang Masuk dalam Pengerjaan)
* **Pengembangan 7 Halaman Utama:** Pembuatan halaman web mandiri sesuai desain (Home, Einstein Sphere dengan Console Drawer, Einstein Market, Einstein Quest dengan Timeline sejarah, Einstein Space dengan fitur scan barcode, Halaman Sekretariat, dan Einstein Kalender).
* **Integrasi Kamera & Scanner Web:** Implementasi modul pembaca Barcode/QR Code berbasis browser memanfaatkan kamera ponsel untuk kebutuhan inventarisasi barang.
* **Sistem Transaksi Semi-Otomatis via QRIS & WhatsApp:** Pembuatan halaman checkout yang menampilkan QRIS HIMA, fitur unggah bukti bayar, dan integrasi pengiriman format teks pesanan ke WhatsApp Admin Danus.
* **Sistem Otomatisasi Surat Sederhana:** Formulir pengajuan nomor surat digital beserta dashboard persetujuan (approval) sederhana khusus untuk peran Sekretaris Umum.
* **Manajemen Konten Terstruktur (Ristek):** Pengorganisasian repositori berkas digital untuk kategori modul, diktat, bank soal, dan tautan software di halaman Einstein Vault.

### B. Out of Scope (Fitur yang DITUNDA / Tidak Dikerjakan pada Tahap Ini)
* **Sistem Pembayaran Otomatis Pihak Ketiga (Payment Gateway API):** Pengecekan mutasi otomatis (seperti callback instan dari Midtrans/Xendit yang otomatis mengubah status pesanan dari Pending ke Success tanpa campur tangan admin) **TIDAK** diimplementasikan. Validasi kelayakan kirim barang tetap dilakukan secara manual oleh Admin Danus setelah mengecek bukti bayar QRIS di WhatsApp.
* **Manajemen Pengiriman Paket & Resi Otomatis:** Sistem pelacakan kurir (JNE, J&T, dll) untuk pembelian merchandise tidak disediakan dalam platform ini.
* **Otomatisasi Tanda Tangan Digital Berbasis Sertifikat:** Proses ACC persuratan oleh Sekretaris Umum hanya berupa perubahan status validasi data di sistem, bukan penerbitan tanda tangan digital tersertifikasi (seperti PDF signing elektronik resmi).
* **Aplikasi Mobile Native:** Pembuatan aplikasi khusus di Play Store (Android) atau App Store (iOS) tidak masuk dalam scope (website dioptimalkan penuh agar responsif saat dibuka lewat browser ponsel).

---

## 8. Alur Transaksi & Validasi Pembayaran (Einstein Market)
1. Pengguna memilih merchandise di Einstein Market $\rightarrow$ Masuk ke keranjang belanja.
2. Di halaman checkout, total harga muncul $\rightarrow$ Pengguna memindai QRIS HIMA yang disediakan di layar $\rightarrow$ Pengguna mengunggah foto bukti transfer.
3. Pengguna mengeklik tombol checkout $\rightarrow$ Diarahkan otomatis ke WhatsApp Admin Danus dengan pesan terformat:
   > *"Halo Admin, saya mau beli Baju PDH, Total Rp135.000. Ini bukti bayar QRIS saya: [Link/Gambar]"*
4. Admin memeriksa mutasi rekening $\rightarrow$ Pembayaran valid $\rightarrow$ Produk dipersiapkan dan dikirim ke pembeli.
