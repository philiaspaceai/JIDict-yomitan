# Kontribusi ke JIDict-yomitan

Dokumen ini menjelaskan cara kontribusi yang aman: **tidak ada yang langsung ke `main`**.

## Aturan utama

1. **Jangan push langsung ke `main`.** `main` terproteksi, hanya bisa via Pull Request dari `develop`.
2. **Semua PR kontributor targetnya `develop`.**
3. Satu PR = satu tujuan (misal: tambah 10 entri, atau perbaiki typo). Jangan campur banyak hal.
4. Jangan commit file zip / folder `dist/`. CI yang membangun zip rilis.

## Alur kontribusi

```text
fork repo → branch baru dari develop → edit src/ → PR ke develop → review + CI hijau → merge
```

Langkah detail:

1. Fork repo `philiaspaceai/JIDict-yomitan`, clone fork-mu.
2. Pindah ke `develop` terbaru:
   ```bash
   git fetch upstream
   git checkout develop
   git pull upstream develop
   git checkout -b tambah-kata-xyz
   ```
3. Edit file di `src/` (lihat `src/README.md`). Untuk edit besar, unpack dulu dari zip stabil bila perlu:
   ```bash
   node scripts/yomitan.mjs unpack ./jidict-v1.0.2.zip ./src
   ```
4. Validasi lokal sebelum push (wajib):
   ```bash
   node scripts/yomitan.mjs validate ./src
   ```
   Harus `ok: true`. Kalau ada `errors`, perbaiki dulu.
5. Push branch-mu, buka PR dengan base `develop`. Isi template PR: apa yang ditambah/diubah, jumlah entri, hasil validasi.
6. Tunggu review maintainer + CI hijau. Perbaiki bila ada komentar.

## Yang diperiksa reviewer + CI

- `validate ./src` lolos (format 3, penomoran bank berurutan, tiap entri 8 field untuk term, dsb).
- Tidak ada bank kosong, tidak ada nama file aneh (hanya `index.json`, `*_bank_N.json`, `styles.css`).
- `index.json` → `title` dan `revision` tidak kosong. Jangan naikkan `revision` di PR biasa (maintainer yang menaikkan saat rilis).
- Tidak ada duplikat massal / hapus massal tanpa alasan jelas.

## Rilis (hanya maintainer)

Lihat `docs/RELEASING.md`. Ringkasnya: merge `develop` → `main`, buat tag `vX.Y.Z`, CI membuat zip + Release.

## Butuh bantuan?

Buka Issue dengan contoh kata yang bermasalah (term + reading + arti yang benar).
