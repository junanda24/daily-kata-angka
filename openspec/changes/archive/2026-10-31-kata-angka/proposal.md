# Proposal: kata-angka — npm package terbilang dua arah

## Apa & kenapa

Setiap developer Indonesia yang pernah bikin kwitansi, invoice, kontrak, atau
aplikasi kasir pasti pernah butuh satu fungsi: mengubah angka jadi kata
Bahasa Indonesia ("Rp2.500.000" → "dua juta lima ratus ribu rupiah").
Package yang sudah ada di npm (`terbilang`, `terbilang-id`) hanya jalan
**satu arah**: angka → kata. Tidak ada yang bisa membalikkan.

`kata-angka` menutup celah itu: **dua arah penuh**.

- `terbilang(2500000)` → `"dua juta lima ratus ribu"`
- `dariTerbilang("dua juta lima ratus ribu")` → `2500000`
- `terbilangRupiah(1500.5)` → `"seribu lima ratus rupiah lima puluh sen"`
- Round-trip dijamin: `dariTerbilang(terbilang(n)) === n` untuk semua
  bilangan bulat aman JavaScript.

## Kenapa ini mengejutkan

"Terbilang" terdengar sepele — sampai orang sadar parser baliknya tidak
pernah ada. Begitu ada, kegunaannya langsung kebuka: validasi kwitansi
(ketikan manusia vs angka), OCR/ekstraksi dokumen ("terbilang: dua juta
rupiah" → angka mesin), chatbot yang menerima input kata, sampai kuis
matematika anak SD. Satu masalah kecil yang diselesaikan dengan elegan,
bukan klon ke-100 dari package yang sama.

## Kenapa bentuk output ini (npm package, bukan web app)

- Masalahnya adalah **fungsi**, bukan antarmuka. Developer memakainya lewat
  `import`, bukan lewat browser.
- Zero dependency, murni komputasi string/angka — tidak ada alasan
  memakai backend, login, atau database.
- API-nya harus enak dipakai dari Node maupun browser (ESM + type
  definitions), dan teruji otomatis (`npm test` hijau).

## Kenapa tanpa backend

Tidak ada data eksternal yang dibutuhkan. Aturan ejaan Indonesia bersifat
deterministik dan statis (ribu/juta/miliar/triliun/kuadriliun). Backend
hanya akan menambah latensi tanpa manfaat.

## Tambahan wajib

- Anti-AI-slop: copy README dan pesan error Bahasa Indonesia natural,
  bukan terjemahan kaku.
- IP check: tidak ada aset pihak ketiga sama sekali — 100% kode original.
- Kepatuhan: modul kecil terpisah (konversi / parsing / rupiah), tanpa
  god module; tanpa secret apa pun (tidak ada credential dalam package ini).
