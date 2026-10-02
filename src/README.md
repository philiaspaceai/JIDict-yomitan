# Sumber data kamus (source of truth)

Folder ini adalah **satu-satunya yang diedit manusia dan CI**.

## Nanti taruh data di sini

Kamu pegang zip Yomitan v1.0.1–v1.0.2. Saat sudah siap, unpack ke sini:

```bash
# dari root repo
rm -f src/term_bank_1.json src/tag_bank_1.json
node scripts/yomitan.mjs unpack /path/ke/JIDict-v1.0.2.zip ./src
node scripts/yomitan.mjs validate ./src
```

Setelah itu `src/` berisi `index.json` + `*_bank_*.json` asli. Contoh placeholder
di bawah akan tertimpa — itu wajar, hapus saja placeholder-nya.

## Aturan

- Hanya boleh ada di root `src/`: `index.json`, `*_bank_N.json`, `styles.css` (opsional).
- Penomoran bank mulai dari 1 dan berurutan tanpa lompat (`term_bank_1.json`, `term_bank_2.json`, …).
- Tiap file bank ≤ 10000 entri (script otomatis split saat `add`).
- Jangan edit file di `dist/` — itu output build.
- Jangan naikkan `revision` di PR kontribusi biasa.

## Perintah yang dipakai

```bash
node scripts/yomitan.mjs validate ./src
node scripts/yomitan.mjs get ./src --term "猫"
node scripts/yomitan.mjs add ./src --entry '["猫","ねこ","n5","",0,["kucing"],1,""]'
node scripts/yomitan.mjs pack ./src ./dist/lokal.zip
```
