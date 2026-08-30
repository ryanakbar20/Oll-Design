# Panduan Lengkap Recovery Server, Source Code, Uploads & Services

Dokumen ini berisi panduan teknis langkah demi langkah untuk membangun ulang (**full rebuild & disaster recovery**) seluruh komponen server **OllDesign** jika server baru disiapkan atau sistem operasi di-install ulang dari nol.

---

## 🏗️ Arsitektur Infrastruktur & Data Flow

```
[ User Request (HTTPS: 443 / HTTP: 80) ]
                   │
                   ▼
       [ Nginx Reverse Proxy ]
  (SSL Let's Encrypt: olldesign.jp)
                   │  proxy_pass: 127.0.0.1:8000
                   ▼
  [ Systemd Service: laravel.service ]
     (User: www-data, Port: 8000)
         │                    │
         ▼                    ▼
[ MySQL Database (3306) ]   [ Storage Media Uploads ]
   (DB: oll_design)          (/var/www/html/storage/app/public)
                                      ▲ (Symlink)
                             (/var/www/html/public/storage)
```

---

## 📋 Informasi Repository & Spesifikasi

* **Git Repository**: `https://github.com/ryanakbar20/Oll-Design.git`
* **Default Branch**: `master`
* **Root Application Path**: `/var/www/html`
* **PHP Runtime**: PHP 8.2 (CLI & FPM)
* **Node.js**: Node 20.x LTS (untuk build asset Vite)
* **Database**: MySQL 8.0 (`oll_design`)
* **Web Server**: Nginx + Certbot Let's Encrypt
* **SSH Port**: `2212`

---

## 🚀 Prosedur Pemulihan Lengkap (Full Recovery Steps)

### Langkah 1: Update OS & Install Dependensi Dasar
Di server baru (Ubuntu 22.04 LTS):
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y software-properties-common curl git unzip ufw nginx certbot python3-certbot-nginx
```

---

### Langkah 2: Install PHP 8.2 & Composer
```bash
# 1. Tambahkan PPA resmi PHP
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# 2. Install PHP 8.2 dan ekstensi yang dibutuhkan Laravel
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-common \
    php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring \
    php8.2-curl php8.2-xml php8.2-bcmath php8.2-opcache

# 3. Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
```

---

### Langkah 3: Install Node.js & NPM (Untuk Build Frontend Vite)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

### Langkah 4: Git Clone Source Code Aplikasi
Hapus folder default html atau clone langsung ke `/var/www/html`:
```bash
# Bersihkan direktori default jika ada
sudo rm -rf /var/www/html

# Clone repository resmi pada branch master
sudo git clone -b master https://github.com/ryanakbar20/Oll-Design.git /var/www/html
cd /var/www/html
```

---

### Langkah 5: Setup Environment `.env` & Dependensi Composer
```bash
cd /var/www/html

# 1. Salin template .env
sudo cp .env.example .env

# 2. Sesuaikan konfigurasi Database & URL
sudo nano .env
```
*Pastikan konfigurasi berikut terisi:*
```env
APP_NAME=OllDesign
APP_ENV=production
APP_DEBUG=false
APP_URL=https://olldesign.jp

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oll_design
DB_USERNAME=olldesign
DB_PASSWORD=olldesign8806
```

```bash
# 3. Install vendor packages
composer install --no-dev --optimize-autoloader

# 4. Generate Application Encryption Key
php artisan key:generate
```

---

### Langkah 6: Build Frontend Assets (Vite)
Karena direktori `/public/build` diabaikan oleh `.gitignore`, asset Vite harus di-compile:
```bash
cd /var/www/html
npm install
npm run build
```

---

### Langkah 7: Restore Folder Uploads (Media/Gambar) & Binding Storage

File gambar galeri yang di-upload pengguna disimpan di `/var/www/html/storage/app/public/images/`.

#### A. Restore File Gambar Upload dari Backup:
1. Upload file backup `storage_uploads_backup_*.tar.gz` dari komputer lokal ke server:
   ```bash
   # (Jalankan dari komputer lokal)
   scp -i access/id_ed25519 -P 2212 ./backups/storage_uploads_backup_20260830_155032.tar.gz ubuntu@<IP_SERVER>:~/
   ```
2. Ekstrak ke dalam direktori storage server:
   ```bash
   # (Jalankan di server)
   sudo mkdir -p /var/www/html/storage/app/public
   sudo tar -xzvf ~/storage_uploads_backup_20260830_155032.tar.gz -C /var/www/html/storage/app/public/
   ```

#### B. Binding / Symlink Storage Laravel:
Hubungkan folder internal storage ke direktori publik web:
```bash
cd /var/www/html
php artisan storage:link
```
*(Perintah ini membuat symbolic link: `/var/www/html/public/storage` -> `/var/www/html/storage/app/public`)*

#### C. Atur Hak Akses & Permission:
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
```

---

### Langkah 8: Restore Database MySQL
Ikuti panduan lengkap di [`DATABASE_RECOVERY_GUIDE.md`](DATABASE_RECOVERY_GUIDE.md):
```bash
# 1. Buat database & user di MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS oll_design CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'olldesign'@'localhost' IDENTIFIED WITH mysql_native_password BY 'olldesign8806';"
sudo mysql -e "GRANT ALL PRIVILEGES ON oll_design.* TO 'olldesign'@'localhost'; FLUSH PRIVILEGES;"

# 2. Import data backup
gunzip < ~/backups/oll_design_backup_20260830_153359.sql.gz | mysql -u olldesign -polldesign8806 oll_design
```

---

### Langkah 9: Konfigurasi Background Service (`laravel.service`)

1. Buat file service `/etc/systemd/system/laravel.service`:
   ```bash
   sudo nano /etc/systemd/system/laravel.service
   ```
   *Isi dengan:*
   ```ini
   [Unit]
   Description=Laravel Development Server
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/html
   ExecStart=/usr/bin/php artisan serve --host=0.0.0.0 --port=8000
   Restart=always
   RestartSec=5s

   [Install]
   WantedBy=multi-user.target
   ```

2. Aktifkan dan jalankan servicenya:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now laravel
   ```

---

### Langkah 10: Konfigurasi Nginx Web Server & SSL Certbot

1. Buat file konfigurasi `/etc/nginx/sites-available/olldesign`:
   ```bash
   sudo nano /etc/nginx/sites-available/olldesign
   ```
   *Isi konfigurasi:*
   ```nginx
   server {
       listen 80;
       server_name olldesign.jp www.olldesign.jp;
       root /var/www/html/public;

       access_log /var/log/nginx/olldesign.jp.access.log;
       error_log /var/log/nginx/olldesign.jp.error.log;

       location / {
           proxy_pass http://127.0.0.1:8000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location ~ /\.ht {
           deny all;
       }
   }
   ```

2. Aktifkan virtual host dan restart Nginx:
   ```bash
   sudo ln -sf /etc/nginx/sites-available/olldesign /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. Pasang Sertifikat SSL Let's Encrypt:
   ```bash
   sudo certbot --nginx -d olldesign.jp -d www.olldesign.jp
   ```

---

### Langkah 11: Setup Keamanan Firewall (UFW) & Port SSH `2212`

1. Konfigurasi SSH Daemon di `/etc/ssh/sshd_config`:
   ```text
   Port 2212
   ```
2. Buka port firewall dan aktifkan UFW:
   ```bash
   sudo ufw allow 2212/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   sudo systemctl restart ssh
   ```

---

## 📦 Prosedur Backup Lengkap Rutin (Database + File Uploads)

Untuk membuat backup lengkap (Database + Gambar Upload), jalankan script ini di server:

```bash
mkdir -p ~/backups

# 1. Backup Database MySQL
mysqldump -u olldesign -polldesign8806 --no-tablespaces --single-transaction --quick --routines --triggers oll_design | gzip > ~/backups/oll_design_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# 2. Backup Folder File Upload (Images)
tar -czvf ~/backups/storage_uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /var/www/html/storage/app/public images
```

Dan download salinannya ke komputer lokal via SCP:
```bash
scp -i access/id_ed25519 -P 2212 ubuntu@133.167.40.119:~/backups/* ./backups/
```
