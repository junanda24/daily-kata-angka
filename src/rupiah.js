import { terbilang } from './to-words.js';

/**
 * Ubah angka menjadi ejaan rupiah lengkap.
 * Contoh: terbilangRupiah(1500.5) → "seribu lima ratus rupiah lima puluh sen".
 * Pecahan dibulatkan ke sen terdekat (2 digit).
 */
export function terbilangRupiah(nilai) {
  if (typeof nilai !== 'number' || Number.isNaN(nilai)) {
    throw new TypeError('terbilangRupiah: input harus berupa number');
  }
  if (!Number.isFinite(nilai)) {
    throw new RangeError('terbilangRupiah: input harus berupa bilangan hingga');
  }

  const negatif = nilai < 0;
  const totalSen = Math.round(Math.abs(nilai) * 100);
  const rupiah = Math.floor(totalSen / 100);
  const sen = totalSen % 100;
  if (!Number.isSafeInteger(rupiah)) {
    throw new RangeError(
      'terbilangRupiah: nilai di luar rentang safe integer JavaScript',
    );
  }

  let hasil = `${terbilang(rupiah)} rupiah`;
  if (sen > 0) hasil += ` ${terbilang(sen)} sen`;
  return negatif ? `minus ${hasil}` : hasil;
}
