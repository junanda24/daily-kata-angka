// Kosakata dasar ejaan bilangan Bahasa Indonesia.

export const SATUAN = [
  '',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
];

// Nama skala per kelompok 3 digit, dari kanan: '' , ribu, juta, ...
export const SKALA = ['', 'ribu', 'juta', 'miliar', 'triliun', 'kuadriliun'];

// Kata digit untuk parser (termasuk nol).
export const DIGIT = {
  nol: 0,
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
};

// Kata skala untuk parser. "biliun"/"bilyun" diterima sebagai alias
// "miliar" (pemakaian sehari-hari), tapi tidak pernah dihasilkan.
export const SKALA_NILAI = {
  ribu: 1_000,
  juta: 1_000_000,
  miliar: 1_000_000_000,
  triliun: 1_000_000_000_000,
  kuadriliun: 1_000_000_000_000_000,
  biliun: 1_000_000_000,
  bilyun: 1_000_000_000,
};

// Bentuk "se-" yang berdiri sendiri (nilai absolut, bukan pengali).
export const SE_NILAI = {
  sepuluh: 10,
  sebelas: 11,
  seratus: 100,
};

// Bentuk "se-" yang berperan sebagai skala (satu × skala).
export const SE_SKALA = {
  seribu: 1_000,
  sejuta: 1_000_000,
  semiliar: 1_000_000_000,
  setriliun: 1_000_000_000_000,
  sekuadriliun: 1_000_000_000_000_000,
};
