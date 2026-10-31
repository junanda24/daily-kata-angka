import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { terbilang, dariTerbilang, terbilangRupiah } from '../src/index.js';

describe('terbilang', () => {
  it('nol, satuan, dan belasan', () => {
    assert.equal(terbilang(0), 'nol');
    assert.equal(terbilang(1), 'satu');
    assert.equal(terbilang(9), 'sembilan');
    assert.equal(terbilang(10), 'sepuluh');
    assert.equal(terbilang(11), 'sebelas');
    assert.equal(terbilang(15), 'lima belas');
    assert.equal(terbilang(19), 'sembilan belas');
  });

  it('puluhan, ratusan, dan ribuan dengan bentuk se-', () => {
    assert.equal(terbilang(21), 'dua puluh satu');
    assert.equal(terbilang(99), 'sembilan puluh sembilan');
    assert.equal(terbilang(100), 'seratus');
    assert.equal(terbilang(101), 'seratus satu');
    assert.equal(terbilang(123), 'seratus dua puluh tiga');
    assert.equal(terbilang(1000), 'seribu');
    assert.equal(terbilang(1001), 'seribu satu');
    assert.equal(terbilang(1234), 'seribu dua ratus tiga puluh empat');
    assert.equal(terbilang(10000), 'sepuluh ribu');
    assert.equal(terbilang(100000), 'seratus ribu');
  });

  it('skala besar', () => {
    assert.equal(terbilang(1000000), 'satu juta');
    assert.equal(terbilang(2500000), 'dua juta lima ratus ribu');
    assert.equal(terbilang(1234567), 'satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh');
    assert.equal(terbilang(1000000000), 'satu miliar');
    assert.equal(terbilang(2500000000), 'dua miliar lima ratus juta');
    assert.equal(terbilang(1000000000000), 'satu triliun');
    assert.equal(terbilang(1000000000000000), 'satu kuadriliun');
    assert.equal(
      terbilang(9007199254740991),
      'sembilan kuadriliun tujuh triliun seratus sembilan puluh sembilan miliar dua ratus lima puluh empat juta tujuh ratus empat puluh ribu sembilan ratus sembilan puluh satu',
    );
  });

  it('negatif dan desimal', () => {
    assert.equal(terbilang(-5), 'minus lima');
    assert.equal(terbilang(-2500000), 'minus dua juta lima ratus ribu');
    assert.equal(terbilang(12.5), 'dua belas koma lima');
    assert.equal(terbilang(0.5), 'nol koma lima');
    assert.equal(terbilang(3.05), 'tiga koma nol lima');
  });

  it('menolak input tidak valid', () => {
    assert.throws(() => terbilang('lima'), TypeError);
    assert.throws(() => terbilang(Number.NaN), TypeError);
    assert.throws(() => terbilang(Infinity), RangeError);
    assert.throws(() => terbilang(2 ** 53), RangeError);
  });
});

describe('dariTerbilang', () => {
  it('membaca bilangan dasar', () => {
    assert.equal(dariTerbilang('nol'), 0);
    assert.equal(dariTerbilang('satu'), 1);
    assert.equal(dariTerbilang('sepuluh'), 10);
    assert.equal(dariTerbilang('sebelas'), 11);
    assert.equal(dariTerbilang('lima belas'), 15);
    assert.equal(dariTerbilang('seratus dua puluh tiga'), 123);
    assert.equal(dariTerbilang('seribu dua ratus tiga puluh empat'), 1234);
    assert.equal(dariTerbilang('dua juta lima ratus ribu'), 2500000);
    assert.equal(dariTerbilang('satu miliar'), 1000000000);
    assert.equal(dariTerbilang('satu triliun'), 1000000000000);
  });

  it('toleran terhadap variasi penulisan', () => {
    assert.equal(dariTerbilang('Dua Juta Lima Ratus Ribu'), 2500000);
    assert.equal(dariTerbilang('dua   juta    lima ratus ribu'), 2500000);
    assert.equal(dariTerbilang('satu ribu'), 1000);
    assert.equal(dariTerbilang('satu juta'), 1000000);
    assert.equal(dariTerbilang('sejuta'), 1000000);
    assert.equal(dariTerbilang('semiliar'), 1000000000);
    assert.equal(dariTerbilang('dua juta lima ratus ribu rupiah'), 2500000);
  });

  it('negatif, koma, dan sen', () => {
    assert.equal(dariTerbilang('minus lima'), -5);
    assert.equal(dariTerbilang('negatif dua belas'), -12);
    assert.equal(dariTerbilang('dua belas koma lima'), 12.5);
    assert.equal(dariTerbilang('nol koma lima'), 0.5);
    assert.equal(dariTerbilang('lima puluh sen'), 0.5);
    assert.equal(dariTerbilang('seribu lima ratus rupiah lima puluh sen'), 1500.5);
  });

  it('menolak teks tidak valid', () => {
    assert.throws(() => dariTerbilang(''), Error);
    assert.throws(() => dariTerbilang('dua apel'), Error);
    assert.throws(() => dariTerbilang('minus'), Error);
    assert.throws(() => dariTerbilang('dua koma'), Error);
    assert.throws(() => dariTerbilang(123), TypeError);
  });
});

describe('terbilangRupiah', () => {
  it('ejaan rupiah lengkap', () => {
    assert.equal(terbilangRupiah(0), 'nol rupiah');
    assert.equal(terbilangRupiah(2500000), 'dua juta lima ratus ribu rupiah');
    assert.equal(terbilangRupiah(1500.5), 'seribu lima ratus rupiah lima puluh sen');
    assert.equal(terbilangRupiah(999.99), 'sembilan ratus sembilan puluh sembilan rupiah sembilan puluh sembilan sen');
    assert.equal(terbilangRupiah(-1000), 'minus seribu rupiah');
  });
});

describe('round-trip', () => {
  it('dariTerbilang(terbilang(n)) === n untuk banyak nilai', () => {
    const nilai = [
      0, 1, 5, 10, 11, 17, 20, 21, 99, 100, 101, 110, 111, 999,
      1000, 1001, 1234, 9999, 10000, 54321, 100000, 999999,
      1000000, 1234567, 2500000, 1000000000, 2500000000,
      1000000000000, 1000000000000000, 9007199254740991,
      -1, -123, -2500000,
    ];
    for (const n of nilai) {
      assert.equal(dariTerbilang(terbilang(n)), n, `gagal round-trip untuk ${n}`);
    }
  });

  it('dariTerbilang(terbilangRupiah(n)) === n untuk nilai rupiah bulat', () => {
    for (const n of [0, 500, 1500, 2500000, 999999999]) {
      assert.equal(dariTerbilang(terbilangRupiah(n)), n);
    }
  });
});
