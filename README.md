# JIDict untuk Yomitan

JIDict adalah kamus elektronik **Jepang → Indonesia** yang dikembangkan untuk digunakan bersama ekstensi peramban [Yomitan](https://yomitan.wiki/). Setelah kamus ini dipasang, pengguna cukup mengarahkan kursor ke kata berbahasa Jepang pada halaman web mana pun untuk langsung melihat artinya dalam bahasa Indonesia, lengkap dengan bacaan (reading) dan kelas kata (Part of Speech) — tanpa perlu membuka situs atau aplikasi kamus terpisah.

## Latar belakang

JIDict pertama kali dipublikasikan pada **17 Juni 2025** di server Discord Philia Space. Proyek ini merupakan kamus Jepang–Indonesia berformat Yomitan **pertama yang dikembangkan di Indonesia**, disusun untuk menjawab kebutuhan pembelajar bahasa Jepang akan kamus yang dapat diakses seketika selama membaca — baik itu artikel berita, dokumentasi teknis, maupun bacaan hiburan seperti light novel.

Pada versi 1.0.2, dilakukan pembersihan terhadap sejumlah bacaan dan definisi yang belum sesuai, serta penambahan kelas kata (Part of Speech) pada setiap kosakata agar setiap entri tidak hanya memuat padanan arti, tetapi juga informasi kebahasaan yang memadai.

## Fitur

- **Cakupan kosakata yang luas.** Versi 1.0.2 memuat 299.801 entri, mencakup kosakata sehari-hari hingga istilah yang jarang ditemui.
- **Bacaan (reading) pada setiap entri.** Pengguna dapat mengetahui cara baca yang benar untuk setiap kata, termasuk yang ditulis dengan kanji.
- **Kelas kata (Part of Speech).** Setiap entri dilengkapi kategori gramatikalnya, sehingga pengguna memahami peran kata tersebut dalam kalimat.
- **Berformat standar Yomitan (format 3).** Berkas kamus mengikuti spesifikasi resmi Yomitan sehingga dapat diimpor langsung tanpa konversi.
- **Dikembangkan secara terbuka.** Seluruh data dan riwayat pengembangannya tersedia di repositori ini; setiap perbaikan dari komunitas diterbitkan pada rilis berikutnya.

## Pemasangan

Prasyarat: peramban yang telah terpasang ekstensi Yomitan.

1. Buka halaman **[Releases](../../releases)** dan unduh berkas versi terbaru (`JIDict-yomitan-vX.Y.Z.zip`).
2. Buka pengaturan Yomitan, masuk ke bagian **Dictionaries**, lalu pilih **Import** dan arahkan ke berkas yang telah diunduh.
3. Setelah impor selesai, pastikan JIDict tercantum dan aktif dalam daftar kamus. Pengujian dapat dilakukan dengan mengarahkan kursor ke kata berbahasa Jepang pada halaman web mana pun.

## Unduhan dan riwayat versi

| Versi | Jumlah entri | Keterangan |
|---|---|---|
| v1.0.2 | 299.801 | Versi terbaru. Pembersihan bacaan dan definisi, penambahan kelas kata. |
| v1.0.1 | 299.833 | Versi arsip, diterbitkan ulang apa adanya sebagai dokumentasi. |

Catatan perubahan selengkapnya tersedia pada halaman masing-masing Release. Berkas-berkas asli kedua versi tersebut juga tersimpan di folder [`archive/original/`](archive/original/) sebagai arsip.

## Berkontribusi

JIDict dikembangkan bersama komunitas. Apabila menemukan padanan arti yang kurang tepat, bacaan yang keliru, atau kosakata yang belum tercakup, kamu bisa membantu memperbaikinya — tanpa perlu bisa programming. Cukup gunakan AI agent pilihanmu yang telah dipasangi skill wajib repo ini, lalu sampaikan keinginanmu dalam bahasa sehari-hari.

Seluruh panduannya ada di **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Lisensi

Kamus ini dilisensikan di bawah [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](LICENSE). Penggunaan, penyebaran ulang, dan pengembangan atas kamus ini diperbolehkan untuk keperluan nonkomersial dengan kewajiban atribusi kepada para pembuatnya. Teks lisensi selengkapnya tersedia pada berkas [LICENSE](LICENSE).

## Kredit

Dikembangkan oleh **Utawnyan** (Founder) dan **Demonkzz** (Contributor).
