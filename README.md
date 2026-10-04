# JIDict — Kamus Jepang–Indonesia untuk Yomitan (Japanese–Indonesian Dictionary)

![JIDict banner](./assets/banner.jpg)

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)
[![Latest release](https://img.shields.io/github/v/release/philiaspaceai/JIDict-yomitan)](../../releases)
[![Validate](https://github.com/philiaspaceai/JIDict-yomitan/actions/workflows/validate.yml/badge.svg)](../../actions)

JIDict (Japanese–Indonesian Dictionary) adalah kamus elektronik **Jepang → Indonesia** untuk ekstensi peramban [Yomitan](https://yomitan.wiki/): kamus popup Jepang Indonesia gratis berisi ratusan ribu kosakata lengkap dengan arti bahasa Indonesia, bacaan (reading), dan kelas kata. Setelah kamus ini dipasang, pengguna cukup mengarahkan kursor ke kata berbahasa Jepang pada halaman web mana pun untuk langsung melihat artinya dalam bahasa Indonesia — tanpa perlu membuka situs atau aplikasi kamus terpisah.

## Latar belakang

JIDict pertama kali dipublikasikan pada **17 Juni 2025** di server Discord Philia Space. Proyek ini merupakan kamus Jepang–Indonesia berformat Yomitan **pertama yang dikembangkan di Indonesia**, disusun untuk menjawab kebutuhan pembelajar bahasa Jepang akan kamus yang dapat diakses seketika selama membaca — baik itu artikel berita, dokumentasi teknis, maupun bacaan hiburan seperti light novel.

Sejak publikasi awal, kamus ini terus disempurnakan: bacaan dan definisi dibersihkan, dan setiap entri dilengkapi kelas kata (Part of Speech) agar tidak hanya memuat padanan arti, tetapi juga informasi kebahasaan yang memadai.

## Fitur

- **Cakupan kosakata yang luas.** Memuat ratusan ribu entri, dari kosakata sehari-hari hingga istilah yang jarang ditemui. Angka pasti setiap versi tercantum di halaman Releases.
- **Bacaan (reading) pada setiap entri.** Pengguna dapat mengetahui cara baca yang benar untuk setiap kata, termasuk yang ditulis dengan kanji.
- **Kelas kata (Part of Speech).** Setiap entri dilengkapi kategori gramatikalnya, sehingga pengguna memahami peran kata tersebut dalam kalimat.
- **Tabel konjugasi.** Verba dan adjektiva-i dilengkapi tabel bentuk konjugasi (kamus, sopan, te, lampau, tara, tai, potensial, perintah, bersyarat, pasif, kausatif, dan lainnya) — lengkap dengan versi sopan untuk bentuk tunggal.
- **Berformat standar Yomitan (format 3).** Berkas kamus mengikuti spesifikasi resmi Yomitan sehingga dapat diimpor langsung tanpa konversi.
- **Dikembangkan secara terbuka.** Seluruh data dan riwayat pengembangannya tersedia di repositori ini; setiap perbaikan dari komunitas diterbitkan pada rilis berikutnya.

## Pemasangan

[![Download JIDict](./assets/download.png)](https://github.com/philiaspaceai/JIDict-yomitan/releases/latest/download/JIDict-yomitan.zip)

Prasyarat: peramban yang telah terpasang ekstensi Yomitan.

1. Tekan tombol **Download** di atas — berkas versi terbaru langsung terunduh otomatis.
2. Buka pengaturan Yomitan, masuk ke bagian **Dictionaries**, lalu pilih **Import** dan arahkan ke berkas yang telah diunduh.
3. Setelah impor selesai, pastikan JIDict tercantum dan aktif dalam daftar kamus. Pengujian dapat dilakukan dengan mengarahkan kursor ke kata berbahasa Jepang pada halaman web mana pun.

## Pembaruan otomatis

Mulai versi 1.0.3, JIDict mendukung pembaruan langsung dari Yomitan — tidak perlu mengunduh dan mengimpor ulang secara manual. Buka pengaturan Yomitan → **Dictionaries** → **Check for Updates**; bila versi baru tersedia, Yomitan akan mengunduh dan memasangnya sendiri.

## Unduhan

Unduh versi terbaru dari halaman **[Releases](../../releases)**. Versi-versi lama tetap tersedia di halaman yang sama, dan berkas-berkas aslinya tersimpan di folder [`archive/original/`](archive/original/) sebagai arsip. Catatan perubahan selengkapnya ada pada halaman masing-masing Release.

## Berkontribusi

![Let's build JIDict together](./assets/contribute-invitation.jpg)

JIDict dikembangkan bersama komunitas. Apabila menemukan padanan arti yang kurang tepat, bacaan yang keliru, atau kosakata yang belum tercakup, kamu bisa membantu memperbaikinya — tanpa perlu bisa programming. Cukup gunakan AI agent pilihanmu yang telah dipasangi skill wajib repo ini, lalu sampaikan keinginanmu dalam bahasa sehari-hari.

Seluruh panduannya ada di **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Lisensi

Kamus ini dilisensikan di bawah [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](LICENSE). Penggunaan, penyebaran ulang, dan pengembangan atas kamus ini diperbolehkan untuk keperluan nonkomersial dengan kewajiban atribusi kepada para pembuatnya. Teks lisensi selengkapnya tersedia pada berkas [LICENSE](LICENSE).

## Kredit

Dikembangkan oleh **Utawnyan** (Founder) dan **Demonkzz** (Contributor).
