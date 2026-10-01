export type Marketing = {
  kode: string;
  nama: string;
};

export type Lokasi = {
  kode: string;
  nama: string;
};

export type StatusMitra = "Baru" | "Aktif" | "Pending" | "Nonaktif";

export type JenisMitra = "Mandiri" | "Auto pilot";

export type Mitra = {
  id: string;
  kodeMitra: string;
  namaMitra: string;
  jenisMitra: JenisMitra;
  nik: string;
  telepon: string;
  email: string;
  alamat: string;
  perencanaLokasi: string;
  kodeMarketing: string;
  namaBank: string;
  nomorRekening: string;
  jumlahDownPayment: number;
  kodeLokasi: string;
  tanggalClosing: string;
  namaPameran: string;
  status: StatusMitra;
  catatan: string;
  createdAt: string;
};

export type MitraInput = Omit<Mitra, "id" | "kodeMitra" | "createdAt">;

export type SortKey =
  | "namaMarketing"
  | "kodeMarketing"
  | "kodeLokasi"
  | "namaLokasi"
  | "namaMitra"
  | "tanggalClosing";

export const STATUS_MITRA: StatusMitra[] = [
  "Baru",
  "Aktif",
  "Pending",
  "Nonaktif",
];

export const JENIS_MITRA: JenisMitra[] = ["Mandiri", "Auto pilot"];

export const SEED_MARKETING: Marketing[] = [
  { kode: "001", nama: "Rio" },
  { kode: "002", nama: "Sinta" },
  { kode: "003", nama: "Andi" },
  { kode: "004", nama: "Maya" },
  { kode: "005", nama: "Budi" },
];

export const SEED_LOKASI: Lokasi[] = [
  { kode: "JKT", nama: "Jakarta" },
  { kode: "BDG", nama: "Bandung" },
  { kode: "SBY", nama: "Surabaya" },
  { kode: "MDN", nama: "Medan" },
  { kode: "MKS", nama: "Makassar" },
  { kode: "DPS", nama: "Denpasar" },
];

export const SEED_MITRA: Mitra[] = [
  {
    id: "seed-1",
    kodeMitra: "MTR-0001",
    namaMitra: "PT Sinar Abadi",
    jenisMitra: "Mandiri",
    nik: "3171012508900001",
    telepon: "0812-1000-0001",
    email: "hendra@sinarabadi.co.id",
    alamat: "Jl. Sudirman No. 12, Jakarta",
    perencanaLokasi: "Andi Pratama",
    kodeMarketing: "001",
    namaBank: "BCA",
    nomorRekening: "1234567890",
    jumlahDownPayment: 10000000,
    kodeLokasi: "JKT",
    tanggalClosing: "2026-08-12",
    namaPameran: "Jakarta Property Expo",
    status: "Aktif",
    catatan: "Sudah tanda tangan kontrak 1 tahun.",
    createdAt: "2026-08-12T09:15:00.000Z",
  },
  {
    id: "seed-2",
    kodeMitra: "MTR-0002",
    namaMitra: "Toko Maju Jaya",
    jenisMitra: "Auto pilot",
    nik: "3273051407920002",
    telepon: "0813-2000-0002",
    email: "majujaya@gmail.com",
    alamat: "Jl. Asia Afrika No. 88, Bandung",
    perencanaLokasi: "Rina Kartika",
    kodeMarketing: "002",
    namaBank: "Mandiri",
    nomorRekening: "9876543210",
    jumlahDownPayment: 5000000,
    kodeLokasi: "BDG",
    tanggalClosing: "2026-09-05",
    namaPameran: "Bandung Expo",
    status: "Baru",
    catatan: "Menunggu verifikasi dokumen.",
    createdAt: "2026-09-05T04:20:00.000Z",
  },
  {
    id: "seed-3",
    kodeMitra: "MTR-0003",
    namaMitra: "CV Karya Mandiri",
    jenisMitra: "Mandiri",
    nik: "3578102209880003",
    telepon: "0812-3000-0003",
    email: "agus@karyamandiri.id",
    alamat: "Jl. Rungkut Industri No. 5, Surabaya",
    perencanaLokasi: "Budi Santoso",
    kodeMarketing: "001",
    namaBank: "BNI",
    nomorRekening: "1122334455",
    jumlahDownPayment: 7500000,
    kodeLokasi: "SBY",
    tanggalClosing: "2026-09-18",
    namaPameran: "Surabaya Fair",
    status: "Pending",
    catatan: "Perlu konfirmasi harga distributor.",
    createdAt: "2026-09-18T07:45:00.000Z",
  },
  {
    id: "seed-4",
    kodeMitra: "MTR-0004",
    namaMitra: "Hendra Perkasa",
    jenisMitra: "Mandiri",
    nik: "1271031107850004",
    telepon: "0811-4000-0004",
    email: "hendra.perkasa@mail.com",
    alamat: "Jl. Gatot Subroto No. 21, Medan",
    perencanaLokasi: "Sari Dewi",
    kodeMarketing: "",
    namaBank: "BRI",
    nomorRekening: "5566778899",
    jumlahDownPayment: 3000000,
    kodeLokasi: "MDN",
    tanggalClosing: "2026-07-22",
    namaPameran: "Medan Fest",
    status: "Aktif",
    catatan: "Repeat order bulanan.",
    createdAt: "2026-07-22T03:10:00.000Z",
  },
  {
    id: "seed-5",
    kodeMitra: "MTR-0005",
    namaMitra: "PT Nusantara Digital",
    jenisMitra: "Auto pilot",
    nik: "3171022006900005",
    telepon: "0821-5000-0005",
    email: "rani@nusantaradigital.com",
    alamat: "Jl. Thamrin No. 10, Jakarta",
    perencanaLokasi: "Dian Permata",
    kodeMarketing: "004",
    namaBank: "BCA",
    nomorRekening: "2233445566",
    jumlahDownPayment: 12000000,
    kodeLokasi: "JKT",
    tanggalClosing: "2026-06-30",
    namaPameran: "Jakarta Digital Expo",
    status: "Nonaktif",
    catatan: "Kerja sama dihentikan sementara.",
    createdAt: "2026-06-30T08:00:00.000Z",
  },
  {
    id: "seed-6",
    kodeMitra: "MTR-0006",
    namaMitra: "Toko Berkah",
    jenisMitra: "Mandiri",
    nik: "7371010803930006",
    telepon: "0852-6000-0006",
    email: "tokoberkah@gmail.com",
    alamat: "Jl. Pettarani No. 45, Makassar",
    perencanaLokasi: "Fajar Nugroho",
    kodeMarketing: "002",
    namaBank: "Mandiri",
    nomorRekening: "6677889900",
    jumlahDownPayment: 4500000,
    kodeLokasi: "MKS",
    tanggalClosing: "2026-08-27",
    namaPameran: "Makassar Expo",
    status: "Aktif",
    catatan: "Mitra prioritas area timur.",
    createdAt: "2026-08-27T06:30:00.000Z",
  },
  {
    id: "seed-7",
    kodeMitra: "MTR-0007",
    namaMitra: "CV Sumber Rejeki",
    jenisMitra: "Auto pilot",
    nik: "5171011509910007",
    telepon: "0813-7000-0007",
    email: "made@sumberrejeki.co.id",
    alamat: "Jl. Sunset Road No. 3, Denpasar",
    perencanaLokasi: "Komang Ayu",
    kodeMarketing: "005",
    namaBank: "BNI",
    nomorRekening: "7788990011",
    jumlahDownPayment: 8000000,
    kodeLokasi: "DPS",
    tanggalClosing: "2026-09-21",
    namaPameran: "Bali Property Expo",
    status: "Baru",
    catatan: "Baru closing, jadwalkan onboarding.",
    createdAt: "2026-09-21T02:55:00.000Z",
  },
  {
    id: "seed-8",
    kodeMitra: "MTR-0008",
    namaMitra: "PT Cahaya Timur",
    jenisMitra: "Mandiri",
    nik: "3578110307870008",
    telepon: "0812-8000-0008",
    email: "dewi@cahayatimur.com",
    alamat: "Jl. Basuki Rahmat No. 77, Surabaya",
    perencanaLokasi: "Yudi Hartono",
    kodeMarketing: "003",
    namaBank: "BRI",
    nomorRekening: "3344556677",
    jumlahDownPayment: 9000000,
    kodeLokasi: "SBY",
    tanggalClosing: "2026-09-02",
    namaPameran: "Surabaya Expo",
    status: "Aktif",
    catatan: "Potensi upgrade paket tahun depan.",
    createdAt: "2026-09-02T05:05:00.000Z",
  },
];

export function cariMarketing(
  list: Marketing[],
  kode: string,
): Marketing | undefined {
  if (!kode) return undefined;
  return list.find((item) => item.kode === kode);
}

export function cariLokasi(list: Lokasi[], kode: string): Lokasi | undefined {
  return list.find((item) => item.kode === kode);
}

export function labelMarketing(
  list: Marketing[],
  kode: string,
): string {
  const marketing = cariMarketing(list, kode);
  return marketing ? `${marketing.kode} - ${marketing.nama}` : kode || "-";
}

export function labelLokasi(list: Lokasi[], kode: string): string {
  const lokasi = cariLokasi(list, kode);
  return lokasi ? `${lokasi.kode} - ${lokasi.nama}` : kode || "-";
}

export function generateKodeMitra(existing: Mitra[]): string {
  let max = 0;
  for (const mitra of existing) {
    const match = /MTR-(\d+)/.exec(mitra.kodeMitra);
    if (match) {
      const nilai = Number.parseInt(match[1], 10);
      if (nilai > max) max = nilai;
    }
  }
  return `MTR-${String(max + 1).padStart(4, "0")}`;
}

export function buatId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatTanggal(value: string): string {
  if (!value) return "-";
  const tanggal = new Date(value);
  if (Number.isNaN(tanggal.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(tanggal);
}

export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNik(value: string): string {
  if (!value) return "-";
  return value.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
