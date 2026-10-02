# JIDict-yomitan

Kamus Jepang–Indonesia untuk [Yomitan](https://yomitan.wiki/).

> Repo ini adalah **data kamus**. Repo website (`philiaspaceai/JIDict`) tidak diganggu.

## Unduh

Ambil file `.zip` terbaru dari halaman **[Releases](../../releases)**, lalu di Yomitan:
`Settings → Dictionaries → Import` → pilih file zip.

## Struktur

```text
src/                 ← sumber utama (hasil unpack zip, yang diedit kontributor)
  index.json
  term_bank_*.json
  tag_bank_*.json
scripts/
  yomitan.mjs        ← validasi & packing tanpa install apa pun (butuh `zip`/`unzip`)
dist/                ← hasil build lokal/CI, JANGAN di-commit (di-ignore)
.github/workflows/
  validate.yml       ← validasi otomatis tiap PR
  release.yml        ← build zip + buat GitHub Release tiap tag v*
docs/
  RELEASING.md       ← cara rilis versi baru
```

`src/` adalah **satu-satunya source of truth**. File zip di Releases selalu hasil
`pack` dari `src/` di tag tersebut. Jangan edit langsung file zip.

## Kontribusi

Baca **[CONTRIBUTING.md](CONTRIBUTING.md)**. Intinya:

1. Semua perubahan masuk via Pull Request ke branch `develop` (jangan ke `main`).
2. CI akan menjalankan `node scripts/yomitan.mjs validate ./src`.
3. Maintainer me-review, merge ke `develop`, lalu saat rilis merge `develop` → `main` + buat tag `v*`.

## Branch

- `main` — stabil, terproteksi. Hanya menerima PR dari `develop`. Tiap tag `v*` di `main` otomatis jadi Release.
- `develop` — tempat integrasi semua kontribusi.

## Lisensi

Belum final. Rencana: CC BY-SA 4.0 (umum untuk data kamus).
Lihat [LICENSE](LICENSE).
