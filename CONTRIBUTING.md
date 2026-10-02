# Panduan Kontribusi

Terima kasih sudah mau membantu memperbaiki JIDict. Semua perubahan masuk lewat **Pull Request ke branch `develop`** — branch `main` terproteksi dan hanya menerima PR dari `develop`.

## Bentuk kontribusi yang diterima

- **Perbaiki arti/terjemahan** yang salah atau kurang tepat.
- **Perbaiki reading (bacaan)** yang keliru.
- **Tambah kosakata baru** yang belum ada di kamus.
- **Perbaiki kelas kata (Part of Speech)** yang tidak sesuai.
- **Laporkan masalah** lewat Issue kalau belum sempat memperbaikinya sendiri (sertakan kata, reading, dan arti yang benar).

## Persiapan

- [Node.js](https://nodejs.org/) versi 18 ke atas.
- Perintah `zip` dan `unzip` (umumnya sudah tersedia di Linux/macOS; Windows via Git Bash).
- Tidak perlu install apa pun — script validasi sudah tersedia di `scripts/yomitan.mjs`.

## Alur kerja

1. **Fork** repo ini, lalu clone fork-mu.
2. Buat branch baru dari `develop` yang terbaru:
   ```bash
   git fetch upstream
   git checkout develop
   git pull upstream develop
   git checkout -b perbaiki-arti-xyz
   ```
3. **Ubah data di `src/`** — di sinilah entri kamus tinggal (hasil unpack rilis stabil). Contoh perintah:
   ```bash
   # cari entri
   node scripts/yomitan.mjs get ./src --term "猫"

   # tambah entri: [kata, reading, tag, rules, skor, [arti], sequence, tag-kata]
   node scripts/yomitan.mjs add ./src --entry '["猫","ねこ","","",0,["kucing"],1,""]'
   ```
   File `term_bank_*.json` berukuran besar — usahakan **satu PR untuk satu topik** (misalnya satu kelompok kata atau satu jenis perbaikan), jangan campur banyak hal sekaligus.
4. **Validasi wajib sebelum push:**
   ```bash
   node scripts/yomitan.mjs validate ./src
   ```
   Hasil harus `ok: true`. Perbaiki dulu kalau ada `errors`.
5. Push branch-mu dan buka PR dengan target **`develop`**. Jelaskan di PR: apa yang diubah, berapa entri, dan hasil validasi.
6. Tunggu review maintainer. Kalau ada komentar, perbaiki di branch yang sama.

## Aturan

- Jangan commit file `.zip` atau isi `dist/` — file rilis dibuat otomatis oleh CI.
- Jangan mengubah `revision` di `src/index.json` pada PR biasa — nomor versi dinaikkan maintainer saat rilis.
- Jangan menghapus entri dalam jumlah besar tanpa diskusi di Issue terlebih dahulu.

## Setelah PR di-merge

Maintainer menggabungkan `develop` ke `main` saat waktunya rilis, lalu membuat tag versi (misalnya `v1.0.3`). CI otomatis membangun file zip dan menerbitkannya di halaman Releases.
