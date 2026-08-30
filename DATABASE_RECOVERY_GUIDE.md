# Panduan Restore & Disaster Recovery Database OllDesign

Dokumen ini berisi panduan langkah demi langkah untuk melakukan **pemulihan (restore) dan disaster recovery** database MySQL untuk aplikasi **OllDesign Server** dalam berbagai skenario:
1. **Skenario A:** Restore Cepat pada Server yang Masih Berjalan (Data corrupt/terhapus sebagian).
2. **Skenario B:** Full Disaster Recovery pada Server Baru / Fresh Install (Server terhapus atau dibuat ulang dari nol).
3. **Skenario C:** Alternatif Pembuatan Ulang Skema Kosong (Via Laravel Migration).

---

## 📋 Informasi Database & Kredensial Standar

* **Database Engine**: MySQL 8.0+
* **Database Name**: `oll_design`
* **Database User**: `olldesign`
* **Default Password**: `olldesign8806`
* **Host / Port**: `127.0.0.1` / `3306`
* **Character Set & Collation**: `utf8mb4` / `utf8mb4_unicode_ci`

---

## 🔄 Skenario A: Restore Cepat pada Server yang Berjalan

Gunakan skenario ini jika server dan layanan MySQL masih berjalan, tetapi data tabel rusak atau terhapus dan perlu dikembalikan ke titik snapshot backup.

### Langkah 1: Masuk ke Server via SSH
```bash
ssh -i access/id_ed25519 -p 2212 ubuntu@133.167.40.119
```

### Langkah 2: (Opsional) Buat Snapshot Pengaman Data Saat Ini
```bash
mysqldump -u olldesign -polldesign8806 --no-tablespaces oll_design | gzip > ~/backups/pre_restore_snapshot_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Langkah 3: Ekstrak dan Restore File Backup
Pilih file backup `.sql.gz` yang ingin digunakan:
```bash
gunzip < ~/backups/oll_design_backup_20260830_153359.sql.gz | mysql -u olldesign -polldesign8806 oll_design
```

### Langkah 4: Verifikasi Data
Periksa apakah seluruh tabel dan record telah kembali:
```bash
mysql -u olldesign -polldesign8806 oll_design -e "SHOW TABLES; SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema='oll_design';"
```

---

## 🚨 Skenario B: Full Disaster Recovery (Fresh Server / Rebuilt OS)

Gunakan skenario ini jika server VPS terhapus total, di-reinstall OS-nya, atau dipindahkan ke server baru.

### Langkah 1: Install MySQL Server (Jika Belum Terpasang)
Jalankan di server baru (Ubuntu 22.04 LTS):
```bash
sudo apt update
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

### Langkah 2: Buat Database dan User MySQL
Buka MySQL CLI sebagai root:
```bash
sudo mysql
```

Jalankan query SQL berikut:
```sql
-- 1. Buat database baru dengan charset utf8mb4
CREATE DATABASE IF NOT EXISTS oll_design CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Buat user aplikasi dan set kata sandi
CREATE USER IF NOT EXISTS 'olldesign'@'localhost' IDENTIFIED WITH mysql_native_password BY 'olldesign8806';

-- Jika menggunakan MySQL 8 default caching_sha2_password:
-- ALTER USER 'olldesign'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'olldesign8806';

-- 3. Berikan hak akses penuh ke database oll_design
GRANT ALL PRIVILEGES ON oll_design.* TO 'olldesign'@'localhost';

-- 4. Terapkan perubahan hak akses
FLUSH PRIVILEGES;

-- 5. Keluar
EXIT;
```

---

### Langkah 3: Upload File Backup dari Komputer Lokal ke Server
Jalankan perintah ini **dari komputer lokal** Anda (dari folder project `olldesign-server`):

```bash
# Upload file backup ke home directory server
scp -i access/id_ed25519 -P 2212 ./backups/oll_design_backup_20260830_153359.sql.gz ubuntu@<IP_SERVER_BARU>:~/
```

---

### Langkah 4: Import / Restore Database di Server Baru
Login ke server baru via SSH, lalu jalankan perintah import:

```bash
# Pastikan folder backups dibuat
mkdir -p ~/backups
mv ~/oll_design_backup_20260830_153359.sql.gz ~/backups/

# Jalankan proses restore
gunzip < ~/backups/oll_design_backup_20260830_153359.sql.gz | mysql -u olldesign -polldesign8806 oll_design
```

---

### Langkah 5: Hubungkan Kembali dengan Aplikasi Laravel
Pastikan konfigurasi di `/var/www/html/.env` sudah sesuai:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oll_design
DB_USERNAME=olldesign
DB_PASSWORD=olldesign8806
```

Lakukan restart pada background service aplikasi Laravel:
```bash
sudo systemctl restart laravel
sudo systemctl status laravel
```

---

## 🛠️ Skenario C: Inisialisasi Skema Baru (Tanpa Data Lama)

Jika ingin membuat struktur tabel kosong dari source code Laravel tanpa merestore data isi galeri:

```bash
cd /var/www/html

# Jalankan migrasi seluruh tabel dari awal
php artisan migrate:fresh

# (Opsional) Jalankan data seeder jika ada
php artisan db:seed
```

---

## 🧪 Validasi & Audit Pasca Restore

Setelah restore selesai, jalankan query pengecekan berikut di MySQL server:

```bash
mysql -u olldesign -polldesign8806 oll_design -e "
SELECT 'users' AS Tabel, count(*) AS Total_Baris FROM users
UNION ALL SELECT 'galleries', count(*) FROM galleries
UNION ALL SELECT 'imagings', count(*) FROM imagings
UNION ALL SELECT 'tags', count(*) FROM tags
UNION ALL SELECT 'migrations', count(*) FROM migrations;
"
```

**Target Verifikasi Baseline:**
* `users` : min. 2 record
* `galleries` : ~101 record
* `imagings` : ~59 record
* `tags` : 3 record
* `migrations` : 10 record

---

## 💡 Best Practice & Rekomendasi Backup Berkala

Untuk mencegah kehilangan data, pasang script auto-backup harian menggunakan Cron Job di server:

1. Buat script backup otomatis `/home/ubuntu/scripts/auto_backup.sh`:
   ```bash
   mkdir -p ~/scripts ~/backups
   cat << 'EOF' > ~/scripts/auto_backup.sh
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR=/home/ubuntu/backups
   mysqldump -u olldesign -polldesign8806 --no-tablespaces --single-transaction --quick --routines --triggers oll_design | gzip > $BACKUP_DIR/oll_design_$DATE.sql.gz
   # Hapus backup yang lebih lama dari 30 hari
   find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
   EOF
   chmod +x ~/scripts/auto_backup.sh
   ```

2. Tambahkan ke crontab (`crontab -e`):
   ```cron
   # Berjalan otomatis setiap hari pukul 02:00 pagi
   0 2 * * * /home/ubuntu/scripts/auto_backup.sh > /dev/null 2>&1
   ```
