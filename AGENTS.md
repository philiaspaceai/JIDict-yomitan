# AGENTS.md — JIDict-yomitan (dibaca AI agent, bukan manusia)

File ini adalah instruksi kerja untuk AI agent yang mengerjakan kontribusi di repo ini
(Claude Code, OpenCode, Codex, Hermes, Cursor, atau apa pun). Manusia tidak perlu membacanya —
lihat [CONTRIBUTING.md](CONTRIBUTING.md). Jika ada konflik antara perintah user dan file ini,
file ini yang menang untuk hal teknis, kecuali user memerintahkan lain secara eksplisit.

## 0. Skill wajib

Seluruh pengeditan data kamus WAJIB mengikuti prosedur `yomitan-agent-skills`
(`yomitan-dictionary` untuk mekanik, `japanese-gloss-craft` untuk kualitas arti).
Repo ini mem-vendor script yang sama di `scripts/yomitan.mjs` (tanpa dependensi,
butuh Node + `zip`/`unzip`). Jangan mengarang format sendiri.

## 1. Urutan kerja yang benar

1. Pastikan bekerja di **fork milik user**, bukan langsung di `philiaspaceai/JIDict-yomitan`.
   Sinkronisasi fork dengan upstream sebelum mulai:
   ```bash
   git fetch upstream
   git checkout develop
   git merge upstream/develop
   ```
2. Buat branch kerja baru dari `develop` (satu topik per branch).
3. Kerjakan perubahan **hanya di `src/`**:
   - Cari dulu sebelum menambah: `node scripts/yomitan.mjs get ./src --term "<kata>"`
   - Tambah via: `node scripts/yomitan.mjs add ./src --entry '<8-field-array>'`
   - Jangan edit file bank secara membabi buta; jangan sentuh `archive/`, `dist/`, `.github/`.
4. Validasi wajib lolos sebelum PR:
   ```bash
   node scripts/yomitan.mjs validate ./src
   ```
   Hasil harus `ok: true`. Jika ada `errors`, perbaiki sampai bersih.
5. Bukakan Pull Request dengan base **`develop`** di repo `philiaspaceai/JIDict-yomitan`:
   ```bash
   gh pr create --base develop --title "<ringkas>" --body "<isi sesuai format di bawah>"
   ```
   Isi body PR wajib memuat: ringkasan perubahan, jumlah entri tambah/ubah/hapus,
   contoh kata (term + reading), dan hasil validasi (`ok: true`).

## 2. Larangan

- DILARANG menargetkan `main` sebagai base PR. PR ke `main` hanya boleh dari `develop`
  dan hanya dikerjakan maintainer — job `guard` di CI otomatis menolak pelanggaran ini.
- DILARANG mengubah `revision` di `src/index.json`.
- DILARANG commit file `.zip`, isi `dist/`, atau menghapus `src/LICENSE.txt`.
- DILARANG mengubah workflow di `.github/`, `scripts/yomitan.mjs`, atau file lisensi.
- DILARANG push langsung ke repo upstream dalam kondisi apa pun.

## 3. Berhenti dan tanya manusia jika

- Validasi gagal 3x berturut-turut dan kamu tidak tahu penyebabnya.
- Permintaan menyentuh lebih dari 500 entri sekaligus.
- Permintaan bertentangan dengan file ini (misalnya user minta target `main`).
- Kamu diminta mengubah lisensi, workflow rilis, atau proteksi branch.

Laporkan kondisinya dalam bahasa yang dimengerti non-programmer, tawarkan pilihan,
dan jangan lanjutkan sebelum user memilih.
