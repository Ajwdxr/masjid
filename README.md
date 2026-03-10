# 🕌 Zahir Digital - Masjid Zahir Management System

**Zahir Digital** adalah sebuah platform pengurusan masjid moden yang direka khas untuk **Masjid Zahir, Alor Setar**. Sistem ini mengintegrasikan portal awam, panel pentadbiran (admin), dan paparan smart TV untuk pendigitalan pengurusan masjid secara menyeluruh.

![License](https://img.shields.io/badge/license-MIT-gold)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-DB%20%7C%20Auth%20%7C%20Storage-emerald)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## 🌟 Ciri-Ciri Utama

### 1. 📺 Smart TV Display (Digital Signage)
Paparan khusus untuk skrin besar di ruang solat masjid:
*   **Waktu Solat Pintar**: Kemaskini automatik dengan kiraan detik (*countdown*) ke Azan dan Iqamah.
*   **Amaran Visual & Audio**: Bunyi amaran (beeping) dan paparan skrin penuh apabila masuk waktu solat.
*   **Pengumuman Dinamik**: Slaid poster pengumuman dengan sistem *intelligent fitting* (tiada gambar yang terpotong).
*   **Hadith Harian & Ticker**: Mesej bergerak (ticker) dan petikan Hadith yang boleh dikemaskini dari admin.
*   **Responsif**: Skala automatik untuk resolusi Full HD (1920x1080).

### 2. 🏛️ Admin Dashboard (Panel Kawalan)
Satu pusat kawalan untuk pihak pengurusan masjid:
*   **Analitik Real-time**: Pantauan jumlah infaq, jumlah aduan, dan status kempen aktif.
*   **Urus Pengumuman**: Tambah/kemaskini pengumuman dengan sokongan muat naik fail atau import dari URL.
*   **Urus Infaq & Kempen**: Cipta kempen sumbangan, pantau kutipan, dan urus rekod penderma.
*   **Sistem Aduan**: Menerima aduan kariah (beserta bukti gambar) dan mengemaskini status penyelesaian.
*   **Konfigurasi TV**: Tukar mesej ticker, hadith harian, dan tema warna TV secara *live*.

### 3. 📱 Portal Awam (Kariah)
Halaman mesra pengguna untuk jemaah:
*   **Infaq Digital**: Pautan terus ke gerbang pembayaran atau paparan QR Code untuk sumbangan pantas.
*   **Semakan Pengumuman**: Melihat aktiviti dan program masjid dalam bentuk kad yang cantik.
*   **Borang Aduan**: Menghantar maklum balas atau aduan kerosakan dengan muat naik gambar bukti.
*   **Penyemak Waktu Solat**: Jadual waktu solat harian yang tepat.

## � Akses Pentadbir (Demo/Admin)

Untuk mengakses panel pentadbiran (**Admin Dashboard**), sila gunakan kredential berikut:
*   **Email**: `admin@zahir.digital`
*   **Password**: `Admin123`

## �🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **Storage**: Supabase Bucket (untuk gambar pengumuman & aduan)
*   **Styling**: Tailwind CSS & Framer Motion
*   **Analytics**: Vercel Analytics
*   **Feedback**: SweetAlert2

## 🚀 Pemasangan (Local Development)

1.  **Klon repository**:
    ```bash
    git clone https://github.com/Ajwdxr/masjid.git
    cd masjid
    ```

2.  **Pasang dependencies**:
    ```bash
    npm install
    ```

3.  **Konfigurasi Persekitaran (.env.local)**:
    Cipta fail `.env.local` dan masukkan kunci Supabase anda:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**:
    Jalankan skrip di `supabase/full_schema.sql` di dalam SQL Editor Supabase anda.

5.  **Jalankan aplikasi**:
    ```bash
    npm run dev
    ```

## 📸 Paparan Skrin
*(Sila tambahkan gambar screenshot di sini)*

## 📄 Lesen
Projek ini dilesenkan di bawah Lesen MIT.

---
Dikembangkan dengan ❤️ untuk **Kariah Masjid Zahir**.
