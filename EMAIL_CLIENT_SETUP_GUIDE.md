# Panduan Lengkap Login & Setup Email Oll-Design (`admin@olldesign.jp`)

Dokumen ini berisi panduan praktis langkah demi langkah untuk mengakses dan mengonfigurasi akun email **`admin@olldesign.jp`** melalui berbagai platform:
1. [Akses Cepat via Webmail (Browser Laptop / HP)](#1-akses-cepat-via-webmail-browser)
2. [Setup di Aplikasi Gmail (Android & iPhone)](#2-setup-di-aplikasi-gmail-android--iphone)
3. [Setup di Apple Mail (iPhone / iPad / Mac)](#3-setup-di-apple-mail-iphone--mac)
4. [Setup di Microsoft Outlook (Windows / Mac / HP)](#4-setup-di-microsoft-outlook)
5. [Cheat Sheet Parameter Server (IMAP & SMTP)](#5-cheat-sheet-parameter-server-lengkap)

---

## 🔑 Kredensial Akun Email

* **Alamat Email**: `admin@olldesign.jp`
* **Username**: `admin` atau `admin@olldesign.jp`
* **Password**: `AdminOllDesign2026!`
* **Nama Tampilan (Display Name)**: `Oll-Design Admin`

---

## 1. Akses Cepat via Webmail (Browser)

Cara termudah membuka email tanpa perlu instalasi aplikasi apapun:

1. Buka browser (Chrome, Safari, Edge, Firefox) dan kunjungi URL:
   🔗 **[https://olldesign.jp/mail/](https://olldesign.jp/mail/)** *(atau [https://olldesign.jp/webmail/](https://olldesign.jp/webmail/))*
2. Masukkan:
   * **Username**: `admin` (atau `admin@olldesign.jp`)
   * **Password**: `AdminOllDesign2026!`
3. Klik tombol **Login**.
4. Anda langsung masuk ke antarmuka Roundcube Webmail untuk membaca, mencari, dan membalas email customer.

---

## 2. Setup di Aplikasi Gmail (Android & iPhone)

Anda dapat menambahkan email domain `admin@olldesign.jp` ke dalam aplikasi Gmail di HP Anda:

1. Buka aplikasi **Gmail** di HP Anda.
2. Ketuk ikon profil di pojok kanan atas, lalu pilih **"Tambahkan akun lain" (Add another account)**.
3. Pilih opsi **"Lainnya" (Other)**.
4. Masukkan alamat email: `admin@olldesign.jp`, lalu pilih **"Manual Setup"** atau pilih tipe akun **"Personal (IMAP)"**.
5. Masukkan Password: `AdminOllDesign2026!`.
6. **Incoming Server Settings (Server Masuk)**:
   * **Server / Host**: `olldesign.jp`
   * **Port**: `993`
   * **Security Type**: `SSL/TLS`
7. **Outgoing Server Settings (Server Keluar)**:
   * **Require sign-in**: `Aktif (ON)`
   * **Server / Host**: `olldesign.jp`
   * **Port**: `587`
   * **Security Type**: `STARTTLS` (atau `SSL/TLS` pada port `465`)
   * **Username**: `admin`
   * **Password**: `AdminOllDesign2026!`
8. Ketuk **Next / Selesai**. Email sekarang aktif di aplikasi Gmail Anda.

---

## 3. Setup di Apple Mail (iPhone / iPad / Mac)

### A. Pada iPhone / iPad (iOS):
1. Buka menu **Settings (Pengaturan)** > **Mail** > **Accounts (Akun)**.
2. Ketuk **Add Account (Tambah Akun)** > pilih **Other (Lainnya)**.
3. Pilih **Add Mail Account (Tambah Akun Mail)**.
4. Masukkan:
   * **Name**: `Oll-Design Admin`
   * **Email**: `admin@olldesign.jp`
   * **Password**: `AdminOllDesign2026!`
   * **Description**: `Oll-Design`
5. Ketuk **Next** dan pilih tab **IMAP**:
   * **Incoming Mail Server**:
     * Host Name: `olldesign.jp`
     * User Name: `admin`
     * Password: `AdminOllDesign2026!`
   * **Outgoing Mail Server**:
     * Host Name: `olldesign.jp`
     * User Name: `admin`
     * Password: `AdminOllDesign2026!`
6. Ketuk **Save**.

---

## 4. Setup di Microsoft Outlook (Windows / Mac / HP)

1. Buka aplikasi **Outlook**.
2. Pilih **File** > **Add Account** (atau di HP: Pengaturan > Tambah Akun Email).
3. Masukkan `admin@olldesign.jp`, centang opsi *"Let me set up my account manually"*, lalu klik **Connect**.
4. Pilih tipe akun **IMAP**.
5. Masukkan konfigurasi server:
   * **Incoming Mail (IMAP)**:
     * Server: `olldesign.jp`
     * Port: `993`
     * Encryption: `SSL/TLS`
   * **Outgoing Mail (SMTP)**:
     * Server: `olldesign.jp`
     * Port: `587`
     * Encryption: `STARTTLS` (atau `SSL/TLS` port `465`)
6. Masukkan password `AdminOllDesign2026!` dan klik **Connect**.

---

## 5. Cheat Sheet Parameter Server Lengkap

Simpan tabel parameter berikut untuk konfigurasi software mail client apapun (Thunderbird, Spark, Mac Mail, dll.):

| Pengaturan | Parameter Masuk (Incoming IMAP) | Parameter Keluar (Outgoing SMTP) |
| :--- | :--- | :--- |
| **Protokol** | **IMAP** | **SMTP** |
| **Server / Hostname** | `olldesign.jp` | `olldesign.jp` |
| **Port Rekomendasi** | **`993`** (SSL/TLS) | **`587`** (STARTTLS) |
| **Port Alternatif** | `143` (STARTTLS) | `25` |
| **Otentikasi (Auth)** | Wajib (Password Normal / PLAIN) | Wajib (Password Normal / PLAIN) |
| **Username** | `admin` (atau `admin@olldesign.jp`) | `admin` (atau `admin@olldesign.jp`) |
| **Password** | `AdminOllDesign2026!` | `AdminOllDesign2026!` |
| **SSL/TLS Security** | Aktif (SSL/TLS) | Aktif (STARTTLS / TLS) |

---

## 💡 Tips & Keamanan Tambahan:
* **Mengubah Kata Sandi**: Untuk mengganti kata sandi di server sewaktu-waktu, jalankan di terminal VPS:
  ```bash
  echo "admin:PASSWORD_BARU_ANDA" | sudo chpasswd
  ```
* **Alias Email Tambahan**: Email yang dikirim ke `pr_book@olldesign.jp`, `contact@olldesign.jp`, atau `info@olldesign.jp` akan otomatis masuk ke inbox `admin@olldesign.jp`.
