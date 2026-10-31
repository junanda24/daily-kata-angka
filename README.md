# kata-angka

Terbilang dua arah Bahasa Indonesia: **angka menjadi kata, dan kata kembali
menjadi angka** — plus ejaan rupiah lengkap dengan sen. Zero dependency,
murni JavaScript.

```js
import { terbilang, dariTerbilang, terbilangRupiah } from 'kata-angka';

terbilang(2500000);
// → "dua juta lima ratus ribu"

dariTerbilang('dua juta lima ratus ribu');
// → 2500000

terbilangRupiah(1500.5);
// → "seribu lima ratus rupiah lima puluh sen"
```

## Kenapa package ini dibuat

Setiap developer Indonesia yang pernah bikin kwitansi, invoice, kontrak,
atau aplikasi kasir pasti pernah butuh satu fungsi: mengubah angka jadi
kata Bahasa Indonesia. Package yang sudah ada di npm (`terbilang`,
`terbilang-id`) hanya jalan **satu arah**: angka → kata.

`kata-angka` menutup celah itu. Begitu arah baliknya ada, kegunaannya
langsung kebuka:

- **Validasi kwitansi** — cocokkan angka yang diketik manusia dengan
  angka di sistem ("terbilang: dua juta rupiah" vs `2000000`).
- **Ekstraksi dokumen/OCR** — ubah ejaan di dokumen menjadi angka mesin.
- **Chatbot & input suara** — terima angka yang ditulis dengan kata.
- **Kuis matematika** — cek jawaban anak yang ditulis dengan kata.

Satu masalah kecil yang diselesaikan dengan elegan, bukan klon ke-100
dari package yang sama.

## Fitur

- `terbilang(n)` — angka → kata: nol, negatif (`minus …`), desimal
  (`koma …`), dan skala hingga kuadriliun (batas safe integer JavaScript).
- `dariTerbilang(teks)` — kata → angka, dengan parser yang toleran:
  huruf besar, spasi ganda, kata `rupiah`, bentuk `se-` (`seribu`,
  `sejuta`, `semiliar`), varian `satu ribu`/`satu juta`, kata `koma`
  untuk desimal, dan `sen` untuk per-seratus.
- `terbilangRupiah(n)` — ejaan rupiah lengkap, pecahan dibulatkan ke sen
  terdekat (`1500.5` → `"seribu lima ratus rupiah lima puluh sen"`).
- **Round-trip dijamin**: `dariTerbilang(terbilang(n)) === n` untuk semua
  bilangan bulat aman JavaScript.
- Ejaan baku: `sepuluh`, `sebelas`, `seratus`, `seribu` (bukan
  `satu puluh`/`satu ratus`/`satu ribu`); juta ke atas memakai `satu`
  (`satu juta`, `satu miliar`, `satu triliun`).
- Zero dependency, fungsi murni tanpa efek samping — aman dipakai di
  Node, browser, maupun worker.
- Type definitions (`.d.ts`) included.

## Cara install

Package ini **belum dipublish ke npm registry** (publish hanya atas
keputusan pemilik akun). Install langsung dari GitHub:

```bash
npm i github:junanda24/daily-kata-angka
```

Lalu pakai seperti contoh di atas. Node ≥ 18 (ESM).

## Referensi API

### `terbilang(nilai: number): string`

| Input | Output |
| --- | --- |
| `0` | `"nol"` |
| `15` | `"lima belas"` |
| `100` | `"seratus"` |
| `1000` | `"seribu"` |
| `1234` | `"seribu dua ratus tiga puluh empat"` |
| `2500000` | `"dua juta lima ratus ribu"` |
| `-5` | `"minus lima"` |
| `12.5` | `"dua belas koma lima"` |

Melempar `TypeError` bila input bukan number, dan `RangeError` bila
input tak hingga atau bagian bulatnya di luar safe integer.

### `dariTerbilang(teks: string): number`

| Input | Output |
| --- | --- |
| `"dua juta lima ratus ribu"` | `2500000` |
| `"Dua Juta Lima Ratus Ribu"` | `2500000` (toleran huruf besar) |
| `"sejuta"` / `"satu juta"` | `1000000` |
| `"dua juta lima ratus ribu rupiah"` | `2500000` (`rupiah` diabaikan) |
| `"dua belas koma lima"` | `12.5` |
| `"seribu lima ratus rupiah lima puluh sen"` | `1500.5` |
| `"lima puluh sen"` | `0.5` |
| `"minus lima"` | `-5` |

Alias `biliun`/`bilyun` diterima sebagai `miliar` (pemakaian
sehari-hari), tapi tidak pernah dihasilkan. Melempar `Error` yang
menyebut kata bermasalah bila ada kata tak dikenal, dan `TypeError`
bila input bukan string.

### `terbilangRupiah(nilai: number): string`

| Input | Output |
| --- | --- |
| `0` | `"nol rupiah"` |
| `2500000` | `"dua juta lima ratus ribu rupiah"` |
| `1500.5` | `"seribu lima ratus rupiah lima puluh sen"` |
| `999.99` | `"sembilan ratus sembilan puluh sembilan rupiah sembilan puluh sembilan sen"` |

## Cara menjalankan dari source

```bash
npm test   # menjalankan seluruh unit test (node:test bawaan, tanpa framework)
```

Tidak ada build step. `src/index.js` adalah entry point; `src/index.d.ts`
adalah type definitions.

## Tech stack

- JavaScript ESM (Node ≥ 18), tanpa dependency, tanpa build tool.
- Test: `node:test` + `node:assert/strict` bawaan Node.

## Struktur folder

```
daily-kata-angka/
├── src/
│   ├── index.js        # API publik (re-export)
│   ├── index.d.ts      # type definitions
│   ├── constants.js    # kosakata: satuan, skala, alias se-
│   ├── to-words.js     # terbilang (angka → kata)
│   ├── from-words.js   # dariTerbilang (kata → angka)
│   └── rupiah.js       # terbilangRupiah
├── test/
│   └── kata-angka.test.js
├── openspec/changes/2026-10-31-kata-angka/  # proposal, spec, design, tasks
├── package.json
├── LICENSE (MIT)
└── README.md
```

## Link

- Repo: https://github.com/junanda24/daily-kata-angka
- Rilis: 2026-10-31 (program "1 Hari 1 Project")

## Catatan saat build

- Keputusan yang disengaja **tidak** dibuat: tidak ada CLI bawaan
  (package ini memang untuk dipakai sebagai library), dan tidak ada
  dukungan notasi eksponen di output (angka di luar safe integer
  ditolak dengan `RangeError` yang jelas, bukan dibulatkan diam-diam).
- Satu bug parser ketemu saat testing dan sudah diperbaiki: nilai sen
  ditulis *sebelum* kata `sen` (`lima puluh sen`), bukan sesudahnya —
  parser sekarang memakai kata `rupiah` sebagai pembatas antara bagian
  rupiah dan bagian sen.
- Nama `terbilang-id` sudah dipakai package satu arah di npm (dicek
  2026-10-31); nama `kata-angka` terverifikasi belum dipakai.
