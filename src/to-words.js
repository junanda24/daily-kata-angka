import { SATUAN, SKALA } from './constants.js';

// Eja satu kelompok 0–999 (tanpa nama skala).
function ejaKelompok(nilai) {
  const bagian = [];
  const ratus = Math.floor(nilai / 100);
  const sisa = nilai % 100;

  if (ratus === 1) bagian.push('seratus');
  else if (ratus > 1) bagian.push(`${SATUAN[ratus]} ratus`);

  if (sisa === 0) {
    // tidak ada puluhan/satuan
  } else if (sisa === 10) {
    bagian.push('sepuluh');
  } else if (sisa === 11) {
    bagian.push('sebelas');
  } else if (sisa < 10) {
    bagian.push(SATUAN[sisa]);
  } else if (sisa < 20) {
    bagian.push(`${SATUAN[sisa - 10]} belas`);
  } else {
    const puluh = Math.floor(sisa / 10);
    const satuan = sisa % 10;
    bagian.push(`${SATUAN[puluh]} puluh`);
    if (satuan > 0) bagian.push(SATUAN[satuan]);
  }

  return bagian.join(' ');
}

// Pisahkan representasi desimal dari sebuah number tanpa notasi eksponen.
function keStringDesimal(nilai) {
  const teks = String(nilai);
  if (!/[eE]/.test(teks)) return teks;
  // Hanya terjadi untuk pecahan sangat kecil (mis. 1e-7).
  return nilai.toFixed(20).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Ubah angka menjadi kata Bahasa Indonesia.
 * Contoh: terbilang(2500000) → "dua juta lima ratus ribu".
 */
export function terbilang(nilai) {
  if (typeof nilai !== 'number' || Number.isNaN(nilai)) {
    throw new TypeError('terbilang: input harus berupa number');
  }
  if (!Number.isFinite(nilai)) {
    throw new RangeError('terbilang: input harus berupa bilangan hingga');
  }

  const negatif = nilai < 0;
  const [bilangan, pecahan] = keStringDesimal(Math.abs(nilai)).split('.');
  const bulat = Number(bilangan);
  if (!Number.isSafeInteger(bulat)) {
    throw new RangeError(
      'terbilang: bagian bulat harus berada dalam rentang safe integer JavaScript',
    );
  }

  let hasil;
  if (bulat === 0) {
    hasil = 'nol';
  } else {
    // Potong per 3 digit dari kanan, tempel nama skala.
    const kelompok = [];
    for (let i = bilangan.length; i > 0; i -= 3) {
      kelompok.unshift(bilangan.slice(Math.max(0, i - 3), i));
    }
    const kata = [];
    kelompok.forEach((potong, idx) => {
      const nilaiKelompok = Number(potong);
      if (nilaiKelompok === 0) return;
      const skalaIdx = kelompok.length - 1 - idx;
      if (skalaIdx === 1 && nilaiKelompok === 1) {
        kata.push('seribu');
      } else {
        const ejaan = ejaKelompok(nilaiKelompok);
        kata.push(SKALA[skalaIdx] ? `${ejaan} ${SKALA[skalaIdx]}` : ejaan);
      }
    });
    hasil = kata.join(' ');
  }

  if (pecahan !== undefined) {
    const digit = [...pecahan].map((d) => SATUAN[Number(d)] || 'nol').join(' ');
    hasil = `${hasil} koma ${digit}`;
  }

  return negatif ? `minus ${hasil}` : hasil;
}
