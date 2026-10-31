import { DIGIT, SE_NILAI, SE_SKALA, SKALA_NILAI } from './constants.js';

function gagal(kata) {
  throw new Error(`dariTerbilang: kata "${kata}" tidak dikenali sebagai bilangan`);
}

// Hitung nilai sekelompok token tanpa nama skala besar
// (mis. ["seratus", "dua", "puluh", "tiga"] → 123).
function hitungKelompok(token) {
  let kelompok = 0;
  let tertunda = null; // digit satuan yang belum ditempel puluh/ratus/belas

  for (const kata of token) {
    if (kata in SE_NILAI) {
      if (tertunda !== null) gagal(kata);
      kelompok += SE_NILAI[kata];
    } else if (kata in DIGIT) {
      if (tertunda !== null) gagal(kata);
      tertunda = DIGIT[kata];
    } else if (kata === 'belas') {
      if (tertunda === null) gagal(kata);
      kelompok += 10 + tertunda;
      tertunda = null;
    } else if (kata === 'puluh') {
      if (tertunda === null) gagal(kata);
      kelompok += tertunda * 10;
      tertunda = null;
    } else if (kata === 'ratus') {
      if (tertunda === null) gagal(kata);
      kelompok += tertunda * 100;
      tertunda = null;
    } else {
      gagal(kata);
    }
  }

  return kelompok + (tertunda ?? 0);
}

// Hitung bagian bulat: gabungkan kelompok-kelompok berskala
// (mis. ["satu", "juta", "dua", "ratus", "ribu"] → 1200000).
function hitungBulat(token) {
  let total = 0;
  let kelompok = 0;
  let tertunda = null;

  const siram = (skala) => {
    const pengali =
      kelompok === 0 && tertunda === null ? 1 : kelompok + (tertunda ?? 0);
    total += pengali * skala;
    kelompok = 0;
    tertunda = null;
  };

  for (const kata of token) {
    if (kata in SE_NILAI) {
      if (tertunda !== null) gagal(kata);
      kelompok += SE_NILAI[kata];
    } else if (kata in SE_SKALA) {
      if (kelompok !== 0 || tertunda !== null) gagal(kata);
      total += SE_SKALA[kata];
    } else if (kata in DIGIT) {
      if (tertunda !== null) gagal(kata);
      tertunda = DIGIT[kata];
    } else if (kata === 'belas') {
      if (tertunda === null) gagal(kata);
      kelompok += 10 + tertunda;
      tertunda = null;
    } else if (kata === 'puluh') {
      if (tertunda === null) gagal(kata);
      kelompok += tertunda * 10;
      tertunda = null;
    } else if (kata === 'ratus') {
      if (tertunda === null) gagal(kata);
      kelompok += tertunda * 100;
      tertunda = null;
    } else if (kata in SKALA_NILAI) {
      siram(SKALA_NILAI[kata]);
    } else {
      gagal(kata);
    }
  }

  total += kelompok + (tertunda ?? 0);
  return total;
}

/**
 * Ubah kata Bahasa Indonesia kembali menjadi angka.
 * Contoh: dariTerbilang("dua juta lima ratus ribu") → 2500000.
 * Toleran terhadap huruf besar, spasi ganda, "rupiah", bentuk "se-",
 * serta "satu ribu"/"satu juta" di samping "seribu"/"sejuta".
 */
export function dariTerbilang(teks) {
  if (typeof teks !== 'string') {
    throw new TypeError('dariTerbilang: input harus berupa string');
  }
  let token = teks.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (token.length === 0) {
    throw new Error('dariTerbilang: teks tidak boleh kosong');
  }

  let negatif = false;
  if (token[0] === 'minus' || token[0] === 'negatif') {
    negatif = true;
    token = token.slice(1);
  }
  if (token.length === 0) {
    throw new Error('dariTerbilang: teks hanya berisi kata "minus"');
  }

  // Pisah bagian "sen" (per-seratus). Nilai sen selalu ditulis SEBELUM
  // kata "sen", dan dipisahkan dari rupiah oleh kata "rupiah" bila ada:
  // "… rupiah lima puluh sen" atau, tanpa rupiah, "lima puluh sen".
  let sen = 0;
  let adaSen = false;
  const idxSen = token.indexOf('sen');
  if (idxSen !== -1) {
    adaSen = true;
    if (idxSen !== token.length - 1) {
      throw new Error('dariTerbilang: kata "sen" harus berada di akhir');
    }
    const idxRupiah = token.indexOf('rupiah');
    const tokenSen =
      idxRupiah !== -1
        ? token.slice(idxRupiah + 1, idxSen)
        : token.slice(0, idxSen);
    if (tokenSen.length === 0) {
      throw new Error('dariTerbilang: tidak ada nilai sebelum kata "sen"');
    }
    sen = hitungKelompok(tokenSen);
    if (sen >= 100) {
      throw new Error('dariTerbilang: nilai sen harus kurang dari seratus');
    }
    token = idxRupiah !== -1 ? token.slice(0, idxRupiah) : [];
  } else {
    // Tanpa "sen": kata "rupiah" hanya boleh di akhir, lalu dibuang.
    const idxRupiah = token.indexOf('rupiah');
    if (idxRupiah !== -1) {
      if (idxRupiah !== token.length - 1) {
        throw new Error(
          'dariTerbilang: kata setelah "rupiah" harus berupa nilai sen',
        );
      }
      token = token.slice(0, idxRupiah);
    }
  }

  // Pisah desimal di "koma" (digit per digit).
  let pecahan = 0;
  let adaKoma = false;
  const idxKoma = token.indexOf('koma');
  if (idxKoma !== -1) {
    adaKoma = true;
    if (token.indexOf('koma', idxKoma + 1) !== -1) {
      throw new Error('dariTerbilang: hanya boleh ada satu kata "koma"');
    }
    const tokenPecahan = token.slice(idxKoma + 1);
    if (tokenPecahan.length === 0) {
      throw new Error('dariTerbilang: tidak ada digit setelah kata "koma"');
    }
    const digit = tokenPecahan.map((kata) => {
      if (!(kata in DIGIT)) gagal(kata);
      return String(DIGIT[kata]);
    });
    pecahan = Number(`0.${digit.join('')}`);
    token = token.slice(0, idxKoma);
  }

  let bulat = 0;
  if (token.length > 0) {
    bulat = hitungBulat(token);
  } else if (!adaSen && !adaKoma) {
    throw new Error('dariTerbilang: tidak ada bilangan yang bisa dibaca');
  }

  const hasil = bulat + sen / 100 + pecahan;
  if (!Number.isSafeInteger(bulat)) {
    throw new RangeError(
      'dariTerbilang: hasil di luar rentang safe integer JavaScript',
    );
  }
  return negatif && hasil !== 0 ? -hasil : hasil;
}
