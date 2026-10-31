/**
 * Ubah angka menjadi kata Bahasa Indonesia.
 * Contoh: terbilang(2500000) → "dua juta lima ratus ribu".
 * Mendukung nol, negatif ("minus ..."), desimal ("koma ..."),
 * dan bilangan bulat hingga Number.MAX_SAFE_INTEGER.
 */
export function terbilang(nilai: number): string;

/**
 * Ubah kata Bahasa Indonesia kembali menjadi angka.
 * Contoh: dariTerbilang("dua juta lima ratus ribu") → 2500000.
 * Toleran terhadap huruf besar, spasi ganda, kata "rupiah",
 * bentuk "se-" (seribu/sejuta), serta "koma" dan "sen".
 * Melempar Error bila ada kata yang tidak dikenali.
 */
export function dariTerbilang(teks: string): number;

/**
 * Ubah angka menjadi ejaan rupiah lengkap.
 * Contoh: terbilangRupiah(1500.5) → "seribu lima ratus rupiah lima puluh sen".
 * Pecahan dibulatkan ke sen terdekat.
 */
export function terbilangRupiah(nilai: number): string;
