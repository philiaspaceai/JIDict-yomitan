# AGENTS.md — JIDict-yomitan (dibaca AI agent, bukan manusia)

File ini adalah instruksi kerja untuk AI agent yang mengerjakan kontribusi di repo ini
(Claude Code, OpenCode, Codex, Hermes, Cursor, atau apa pun). Manusia tidak perlu membacanya —
lihat [CONTRIBUTING.md](CONTRIBUTING.md). Jika ada konflik antara perintah user dan file ini,
file ini yang menang untuk hal teknis, kecuali user memerintahkan lain secara eksplisit.

## 0. Skill dan tool wajib

- Kualitas makna: ikuti skill `.skills/japanese-gloss-craft/` (grounding monolingual,
  gate kualitas, tanpa tulis dari memori).
- Mekanik data: HANYA lewat `scripts/jidict.mjs` — jangan menulis/mengubah bank
  dengan cara lain, jangan mengarang format sendiri.

## 1. Perintah tool (dari root repo)

```bash
# cari dulu (wajib sebelum tambah)
node scripts/jidict.mjs get ./src --term "<kata>" [--reading "<bacaan>"]
# tambah entri baru (TAG divalidasi, label + atribusi otomatis)
node scripts/jidict.mjs add ./src --entry '{"term":"<kata>","reading":"<bacaan>","tag":"<TAG>","senses":["<arti 1>","<arti 2>"]}'
# perbaiki makna entri (struktur lain dipertahankan)
node scripts/jidict.mjs fix ./src --term "<kata>" [--reading "<bacaan>"] [--def 0] --senses '["<arti 1>"]'
# validasi wajib lolos sebelum PR
node scripts/jidict.mjs validate ./src
```

`senses` selalu array string polos, tanpa nomor/header/label. Contoh/rujukan/antonim
bukan urusanmu — jangan sentuh blok-blok itu. Tabel konjugasi (`forms`) juga
bukan urusanmu: entri verba/adjektiva baru tidak perlu menyertakan tabel —
maintainer menginjeksikannya berkala via `scripts/conj.mjs` (tool maintainer,
jangan dijalankan/diubah).

## 2. Urutan kerja yang benar

1. Bekerja di **fork milik user**, bukan langsung di `philiaspaceai/JIDict-yomitan`.
   Jika fork belum ada, buat dulu lalu daftarkan upstream-nya:
   ```bash
   gh repo fork philiaspaceai/JIDict-yomitan --clone=false
   git remote add upstream https://github.com/philiaspaceai/JIDict-yomitan.git
   ```
   Sinkronisasi fork dengan upstream sebelum mulai:
   ```bash
   git fetch upstream
   git checkout develop
   git merge upstream/develop
   ```
2. Buat branch kerja baru dari `develop` (satu topik per branch).
3. `get` dulu untuk hindari duplikat. Tambah/perbaiki via tool. Satu topik per branch.
4. `validate ./src` harus `ok: true`. Perbaiki sampai bersih.
5. Bukakan Pull Request dengan base **`develop`**:
   ```bash
   gh pr create --base develop --title "<ringkas>" --body "<ringkasan> + <jumlah entri> + <contoh kata> + <hasil validasi>"
   ```

## 3. Larangan

- DILARANG menargetkan `main` sebagai base PR (job `guard` otomatis menolak).
- DILARANG mengubah `revision` di `src/index.json`.
- DILARANG menambah/mengubah/menghapus contoh kalimat, blok lihat-juga/antonim,
  pill info, blok konjugasi (`forms`), workflow `.github/`, `scripts/`, file lisensi, atau `src/styles.css`.
- DILARANG commit file `.zip`.
- DILARANG push langsung ke repo upstream dalam kondisi apa pun.
- DILARANG memakai TAG di luar daftar dikenal (tool sudah menolaknya otomatis).

## 4. Berhenti dan tanya manusia jika

- Validasi gagal 3x berturut-turut dan kamu tidak tahu penyebabnya.
- TAG yang pas tidak ada di daftar dikenal.
- Permintaan menyentuh lebih dari 500 entri sekaligus.
- Permintaan bertentangan dengan file ini (misalnya user minta target `main`).
- Kamu diminta mengubah lisensi, workflow rilis, atau proteksi branch.

Laporkan kondisinya dalam bahasa yang dimengerti non-programmer, tawarkan pilihan,
dan jangan lanjutkan sebelum user memilih.
