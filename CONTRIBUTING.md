# Panduan Kontribusi

Siapa pun bisa membantu memperbaiki kamus ini — kamu tidak perlu bisa programming. Kamu cukup menyampaikan apa yang ingin diperbaiki atau ditambahkan dalam bahasa sehari-hari kepada AI agent pilihanmu (bebas pakai apa saja — Claude Code, OpenCode, Codex, Hermes, Cursor, dan lain-lain). Agent-mu yang mengerjakan sisanya.

## Yang bisa kamu lakukan

- Menambahkan kosakata yang belum ada di kamus.
- Membetulkan arti yang kurang tepat.
- Membetulkan bacaan (cara baca) yang keliru.
- Melaporkan masalah bila kamu belum sempat memperbaikinya sendiri.

## Caranya

### 1. Pasang skill wajib di agent-mu

Agar agent-mu tahu cara mengedit data kamus dengan benar, skill berikut wajib terpasang:

```bash
npx skills add philiaspaceai/yomitan-agent-skills
```

Tidak terbiasa dengan perintah di atas? Salin kalimat ini ke agent-mu:

```
Please install the Yomitan agent skills into my setup by running:
npx skills add philiaspaceai/yomitan-agent-skills
```

### 2. Sampaikan keinginanmu

Ceritakan saja maumu dalam bahasa biasa. Contoh kalimat lengkap yang bisa disalin:

```
Bantu saya berkontribusi ke kamus JIDict di GitHub
philiaspaceai/JIDict-yomitan: tambahkan kata "猫" yang dibaca
"ねこ" dengan arti "kucing".
```

Sebutkan nama kamus dan tujuannya seperti contoh di atas supaya agent-mu tahu harus bekerja di mana — selebihnya biar agent-mu yang mengurus.

### 3. Periksa hasilnya

Sebelum perubahan dikirim, periksa kembali: apakah kata, bacaan, dan artinya sudah sesuai maksudmu? Kalau sudah tepat, lanjutkan.

## Perlu diingat

- Fokus pada satu perubahan dalam satu waktu. Jangan campur banyak hal yang tidak berkaitan.
- Dengan berkontribusi, kamu setuju bahwa kontribusimu ikut dilisensikan di bawah [CC BY-NC 4.0](LICENSE), sama seperti kamus ini.

## Setelah itu

Kontribusimu akan diterbitkan pada pembaruan kamus berikutnya agar bisa dipakai semua orang.
