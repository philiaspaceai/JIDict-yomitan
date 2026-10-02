# Cara Rilis (maintainer saja)

Hanya pemilik repo (`philiaspaceai`) / maintainer yang melakukan rilis.

## 1. Siapkan `develop`

Pastikan semua PR sudah merge ke `develop` dan CI `validate` hijau.

## 2. Naikkan `revision`

Edit `src/index.json`:

```json
{ "revision": "1.0.3" }
```

Gunakan format `v1.0.2` → tag `v1.0.3`. `revision` di `index.json` tanpa huruf `v`,
tag Git pakai `v` (contoh tag `v1.0.3`).

Commit di `develop`:

```bash
git checkout develop
# edit src/index.json
node scripts/yomitan.mjs validate ./src
git add src/index.json
git commit -m "chore: bump revision to 1.0.3"
git push
```

## 3. Merge ke `main`

Buat PR `develop` → `main`, tunggu CI hijau, merge (squash atau merge biasa, konsisten satu saja).

## 4. Buat tag + Release

```bash
git checkout main
git pull
git tag v1.0.3
git push origin v1.0.3
```

Workflow `.github/workflows/release.yml` (otomatis saat tag `v*` di-push,
atau manual via `gh workflow run release --ref main -f tag=v1.0.3`) akan:

1. `validate ./src`
2. `pack ./src` → `dist/JIDict-yomitan-v1.0.3.zip`
3. Membuat GitHub Release bernama `v1.0.3` dan mengunggah zip tersebut.

Pengguna mengunduh dari halaman Releases, bukan dari `src/`.

> Catatan: auto-trigger push/tag di repo ini sempat tidak berjalan
> (hanya `workflow_dispatch` manual yang jalan). Selama belum normal,
> picu rilis manual seperti di atas, lalu pastikan `v` terbaru ditandai
> Latest (`gh release edit vX.Y.Z --latest`).

## Rilis arsip (versi lama)

Versi lama yang hanya tersedia sebagai file zip asli (misalnya v1.0.1)
diterbitkan apa adanya sebagai dokumentasi:

```bash
gh release create v1.0.1 archive/original/JIDict-v1.0.1.zip \
  --title "v1.0.1" --notes "..."
```

## Darurat (revert)

Jika rilis rusak: buat PR perbaikan ke `develop`, ulangi langkah di atas dengan nomor patch baru
(misal `v1.0.4`). Jangan hapus tag lama yang sudah diunduh orang.
