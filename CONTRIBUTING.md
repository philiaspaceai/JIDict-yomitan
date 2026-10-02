# Panduan Kontribusi

Kamu tidak perlu bisa programming untuk berkontribusi di sini. Cukup punya AI agent (bebas pakai apa saja — Claude Code, OpenCode, Codex, Hermes, Cursor, dan lain-lain) dan sampaikan keinginanmu dalam bahasa sehari-hari. Agent-mu yang mengerjakan sisanya.

Satu-satunya syarat teknis: agent-mu **wajib memakai skill resmi repo ini**.

## Langkah 1 — Fork repo ini

Buka halaman repo `philiaspaceai/JIDict-yomitan` di browser dan tekan tombol **Fork**. Ini membuat salinan repo di akunmu sendiri — semua pekerjaan agent-mu dilakukan di sana, repo aslinya tidak tersentuh sampai kamu mengirim Pull Request.

## Langkah 2 — Pasang skill wajib di agent-mu

Pastikan skill berikut terpasang di agent-mu:

```bash
npx skills add philiaspaceai/yomitan-agent-skills
```

Belum tahu cara menjalankannya? Salin kalimat ini ke agent-mu:

```
Please install the Yomitan agent skills into my setup by running:
npx skills add philiaspaceai/yomitan-agent-skills
```

Tanpa skill ini, agent tidak tahu cara mengedit data kamus dengan benar — kontribusi yang masuk tanpa mengikuti standar skill tidak dapat diproses.

## Langkah 3 — Sampaikan keinginanmu ke agent-mu

Ceritakan dalam bahasa biasa apa yang kamu mau, misalnya:

- "Tambahkan kata ... dengan arti ..."
- "Betulkan arti kata ... menjadi ..."
- "Betulkan bacaan (reading) kata ..."

Contoh perintah lengkap yang tinggal disalin (ganti bagian yang perlu):

```
Fork repo philiaspaceai/JIDict-yomitan ke akunku kalau belum.
Kerjakan dari branch develop yang terbaru. Tambahkan kata "猫"
(dibaca ねこ) dengan arti "kucing". Ikuti file AGENTS.md di repo.
Jalankan validasi sampai lolos, lalu bukakan Pull Request ke
branch develop di repo aslinya.
```

Aturan teknisnya (biar agent-mu yang mengurus): perubahan dikerjakan dari `develop`, Pull Request ditujukan ke `develop`, bukan `main`. Instruksi rinci untuk agent ada di file [`AGENTS.md`](AGENTS.md) — kamu tidak perlu membacanya.

## Langkah 4 — Periksa dan kirim

Sebelum PR dikirim, periksa kembali hasil kerja agent-mu: apakah kata, bacaan, dan artinya sudah sesuai maksudmu? Kalau sudah, kirim PR tersebut.

## Aturan

- Satu PR untuk satu keperluan. Jangan campur banyak perubahan yang tidak berkaitan.
- Jangan menyertakan file `.zip` — berkas rilis dibuat otomatis.
- Dengan mengirim kontribusi, kamu setuju bahwa kontribusimu dilisensikan di bawah [CC BY-NC 4.0](LICENSE), sama seperti kamus ini.

## Setelah PR dikirim

PR yang memenuhi syarat akan digabungkan dan ikut terbit pada rilis berikutnya.
