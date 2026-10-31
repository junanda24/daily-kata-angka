# Spec: kata-angka

## Fungsi 1: terbilang(n)

- SHALL menerima number hingga `Number.MAX_SAFE_INTEGER` (positif, negatif,
  nol) dan desimal.
- WHEN n = 0 THEN hasil `"nol"`.
- WHEN n negatif THEN hasil diawali `"minus "`.
- WHEN n desimal THEN bagian pecahan dieja digit per digit setelah `"koma"`
  (mis. 12.5 → `"dua belas koma lima"`).
- WHEN nilai satuan 1 pada kelompok ribu THEN `"seribu"`, bukan
  `"satu ribu"`; 10 → `"sepuluh"`, 11 → `"sebelas"`, 100 → `"seratus"`.
- WHEN kelompok juta/miliar/triliun/kuadriliun bernilai 1 THEN `"satu juta"`,
  `"satu miliar"`, `"satu triliun"`, `"satu kuadriliun"`.
- WHEN input bukan number hingga / di luar safe integer THEN throw
  `TypeError`/`RangeError` dengan pesan jelas.

## Fungsi 2: dariTerbilang(teks)

- SHALL mengembalikan number dari teks Bahasa Indonesia yang valid.
- WHEN teks `"dua juta lima ratus ribu"` THEN 2500000.
- WHEN teks memakai bentuk `se-` (`sepuluh`, `sebelas`, `seratus`,
  `seribu`, `sejuta`, `semiliar`, `setriliun`, `sekuadriliun`) THEN
  dipahami dengan benar.
- WHEN teks memakai `"koma"` THEN bagian setelah koma menjadi desimal
  digit per digit (mis. `"dua belas koma lima"` → 12.5).
- WHEN teks memakai `"minus"`/`"negatif"` di depan THEN hasil negatif.
- WHEN teks mengandung `"rupiah"` THEN kata itu diabaikan; `"sen"`
  diperlakukan sebagai per-seratus (mis. `"lima puluh sen"` → 0.5).
- WHEN teks memakai huruf besar, spasi ganda, atau varian
  `"satu juta"`/`"sejuta"` dan `"satu ribu"`/`"seribu"` THEN tetap dipahami.
- WHEN teks mengandung kata tak dikenal atau kosong THEN throw `Error`
  dengan pesan yang menyebut kata bermasalah.

## Fungsi 3: terbilangRupiah(n)

- SHALL mengembalikan ejaan lengkap dengan akhiran `"rupiah"`.
- WHEN n bulat THEN `"... rupiah"` (mis. 2500000 →
  `"dua juta lima ratus ribu rupiah"`).
- WHEN n punya pecahan THEN pecahan dieja sebagai sen (2 digit, dibulatkan
  ke sen terdekat; mis. 1500.5 → `"seribu lima ratus rupiah lima puluh sen"`).
- WHEN n = 0 THEN `"nol rupiah"`.

## Round-trip

- SHALL berlaku `dariTerbilang(terbilang(n)) === n` untuk semua bilangan
  bulat aman yang diuji, dan `dariTerbilang(terbilangRupiah(n)) === n`
  untuk nilai rupiah bulat.

## Non-fungsional

- SHALL zero dependency, ESM + type definitions (`.d.ts`).
- SHALL `npm test` hijau (node:test bawaan, tanpa framework).
- SHALL `npm pack --dry-run` sukses dan tarball bisa di-install lalu dipakai.
