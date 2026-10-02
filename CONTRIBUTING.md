# Panduan Kontribusi

Kamu tidak perlu bisa programming untuk berkontribusi di sini. Cukup punya AI agent (bebas pakai apa saja — Claude Code, OpenCode, Codex, Hermes, Cursor, dan lain-lain) dan sampaikan keinginanmu dalam bahasa sehari-hari. Agent-mu yang mengerjakan sisanya.

Satu-satunya syarat teknis: agent-mu **wajib memakai skill resmi repo ini**.

## Syarat wajib: pasang skill Yomitan

Sebelum mulai, pastikan skill berikut terpasang di agent-mu:

```bash
npx skills add philiaspaceai/yomitan-agent-skills
```

Belum tahu cara menjalankannya? Salin kalimat ini ke agent-mu:

```
Please install the Yomitan agent skills into my setup by running:
npx skills add philiaspaceai/yomitan-agent-skills
```

Tanpa skill ini, agent tidak tahu cara mengedit data kamus dengan benar — kontribusi yang masuk tanpa mengikuti standar skill tidak dapat diproses.

## Cara berkontribusi

1. Minta agent-mu untuk bekerja dari branch `develop` yang terbaru.
2. Sampaikan dalam bahasa biasa apa yang kamu mau, misalnya:
   - "Tambahkan kata ... dengan arti ..."
   - "Betulkan arti kata ... menjadi ..."
   - "Betulkan bacaan (reading) kata ..."
3. Minta agent-mu menjalankan validasi sampai lolos dan membukakan Pull Request ke branch `develop`.
4. Periksa kembali hasil kerja agent-mu, lalu kirim PR tersebut.

Contoh perintah lengkap ke agent-mu:

```
Kerjakan dari branch develop terbaru. Tambahkan kata "猫" (dibaca ねこ)
dengan arti "kucing". Jalankan validasi sampai lolos, lalu bukakan
Pull Request ke branch develop.
```

## Aturan

- Satu PR untuk satu keperluan. Jangan campur banyak perubahan yang tidak berkaitan.
- Semua PR ditujukan ke branch `develop`, bukan `main`.
- Jangan mengubah `revision` di `src/index.json` — nomor versi dinaikkan saat rilis.
- Jangan menyertakan file `.zip` atau isi folder `dist/` — berkas rilis dibuat otomatis.
- Dengan mengirim kontribusi, kamu setuju bahwa kontribusimu dilisensikan di bawah [CC BY-NC 4.0](LICENSE), sama seperti kamus ini.

## Setelah PR dikirim

PR yang memenuhi syarat akan digabungkan ke `develop` dan ikut terbit pada rilis berikutnya.
