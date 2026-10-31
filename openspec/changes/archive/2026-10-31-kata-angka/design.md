# Design: kata-angka

## Stack

- Bahasa: JavaScript ESM (Node ≥ 18), tanpa build step, tanpa dependency.
- Type: `src/index.d.ts` ditulis tangan (API hanya 3 fungsi, stabil).
- Test: `node:test` + `node:assert/strict` bawaan Node.

## Struktur modul (tanpa god module)

```
src/
  index.js        # re-export publik: terbilang, dariTerbilang, terbilangRupiah
  constants.js    # SATUAN, SKALA, alias se-, pesan error
  to-words.js     # angka → kata (per kelompok 3 digit, dari kanan)
  from-words.js   # kata → angka (tokenisasi → kelompok per skala → gabung)
  rupiah.js       # terbilangRupiah: pisah rupiah/sen, gabungkan
```

## Algoritma inti

**Angka → kata:** ubah nilai absolut jadi string, potong per 3 digit dari
kanan. Tiap kelompok dieja (ratusan/puluhan/satuan dengan aturan
seratus/sepuluh/sebelas), lalu ditempel nama skala (ribu/juta/miliar/
triliun/kuadriliun). Kasus khusus: kelompok ribu bernilai 1 → `"seribu"`.

**Kata → angka:** tokenisasi (lowercase, rapikan spasi). Pisah di `"koma"`
untuk desimal. Bagian bulat diproses per kelompok skala: akumulasi nilai
kelompok dari token satuan/puluh/ratus/belas/se-; saat token skala muncul,
nilai kelompok dikali skala dan ditambahkan ke total. Token `"rupiah"`
diabaikan; token `"sen"` mengubah kelompok berjalan menjadi per-seratus.

## State

Tidak ada state. Semua fungsi murni (input → output), tanpa efek samping,
tanpa I/O. Ini yang membuat package aman dipakai di Node, browser, dan
worker mana pun.
