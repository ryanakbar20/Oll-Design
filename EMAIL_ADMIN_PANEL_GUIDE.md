# Panduan Penggunaan Mail Admin Panel (PostfixAdmin) - Oll-Design

Admin Panel email resmi telah terpasang di server VPS untuk mengelola akun email domain **`olldesign.jp`** secara mandiri melalui web browser.

---

## 🌐 Akses Panel Admin

* **URL Panel**: 🔗 **[https://olldesign.jp/mail-admin/](https://olldesign.jp/mail-admin/)**
* **Username (Email)**: `admin@olldesign.jp`
* **Password**: `AdminOllDesign2026!`

---

## 📋 Fitur Utama & Cara Penggunaan

### 1. Menambahkan Akun Email Baru (Mailbox)
1. Login ke **[https://olldesign.jp/mail-admin/](https://olldesign.jp/mail-admin/)**.
2. Pada menu navigasi atas, klik **Virtual List** > pilih **Add Mailbox** (atau klik menu **Add Mailbox**).
3. Isi data akun baru:
   * **Username**: Masukkan nama email yang diinginkan (contoh: `info`, `support`, `marketing`, `nama.staf`).
   * **Domain**: Pilih `olldesign.jp`.
   * **Password**: Buat kata sandi untuk akun tersebut (dan ulangi di konfirmasi password).
   * **Name**: Nama lengkap pemilik email (contoh: `Customer Support`).
   * **Maildir**: *(Terisi otomatis)*.
4. Klik tombol **Add Mailbox**.
5. **Selesai!** Akun langsung aktif seketika dan pemilik email bisa langsung login di Webmail:
   🔗 **[https://olldesign.jp/mail/](https://olldesign.jp/mail/)**

---

### 2. Mengubah / Reset Kata Sandi Pengguna
1. Di panel admin, klik menu **Virtual List**.
2. Cari alamat email yang ingin diubah kata sandinya pada daftar.
3. Klik tombol **Edit** (ikon pensil) pada baris email tersebut.
4. Masukkan kata sandi baru pada kolom Password, lalu klik **Save Changes**.

---

### 3. Membuat Alias Email (Auto-Forwarding)
Jika Anda ingin email yang masuk ke satu alamat diteruskan otomatis ke email lain (contoh: email ke `billing@olldesign.jp` otomatis masuk ke `admin@olldesign.jp` atau Gmail pribadi):
1. Klik menu **Virtual List** > **Add Alias**.
2. **Alias**: Masukkan nama alias (contoh: `billing`).
3. **To (Forward to)**: Masukkan alamat tujuan penerusan (bisa lebih dari satu, pisahkan dengan koma).
4. Klik **Add Alias**.

---

### 4. Menghapus / Menonaktifkan Akun Email
1. Buka menu **Virtual List**.
2. Pada baris akun email yang bersangkutan:
   * **Nonaktifkan Sementara**: Ubah status tombol **Active** dari *True* menjadi *False*.
   * **Hapus Permanen**: Klik tombol **Delete**.

---

## 🔗 Rangkuman Tautan Penting

| Layanan | Alamat URL | Fungsi |
| :--- | :--- | :--- |
| 🛠️ **Mail Admin Panel** | **[https://olldesign.jp/mail-admin/](https://olldesign.jp/mail-admin/)** | Mendaftarkan & mengelola seluruh akun email domain |
| 📬 **Webmail Klien** | **[https://olldesign.jp/mail/](https://olldesign.jp/mail/)** | Membaca & mengirim email untuk semua pengguna |
