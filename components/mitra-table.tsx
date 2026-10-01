"use client";

import { useMemo, useState } from "react";
import styles from "@/app/app.module.css";
import {
  cariLokasi,
  cariMarketing,
  formatNik,
  formatRupiah,
  formatTanggal,
  labelMarketing,
  STATUS_MITRA,
  type Mitra,
  type SortKey,
  type StatusMitra,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import {
  ArrowUpDownIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "./icons";

const OPSI_SORT: { value: SortKey; label: string }[] = [
  { value: "namaMarketing", label: "Nama Marketing" },
  { value: "kodeMarketing", label: "Kode Marketing" },
  { value: "kodeLokasi", label: "Kode Lokasi" },
  { value: "namaLokasi", label: "Nama Lokasi" },
  { value: "namaMitra", label: "Nama Mitra" },
  { value: "tanggalClosing", label: "Tanggal Closing" },
];

export default function MitraTable({ onTambah }: { onTambah: () => void }) {
  const { mitra, marketing, lokasi, hapusMitra, ubahStatusMitra, hydrated } =
    useStore();

  const [cari, setCari] = useState("");
  const [filterMarketing, setFilterMarketing] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("namaMarketing");
  const [asc, setAsc] = useState(true);
  const [detail, setDetail] = useState<Mitra | null>(null);

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    const tersaring = mitra.filter((item) => {
      if (filterMarketing && item.kodeMarketing !== filterMarketing)
        return false;
      if (filterLokasi && item.kodeLokasi !== filterLokasi) return false;
      if (filterStatus && item.status !== filterStatus) return false;
      if (!kata) return true;

      const marketingNama =
        cariMarketing(marketing, item.kodeMarketing)?.nama ?? "";
      const lokasiNama = cariLokasi(lokasi, item.kodeLokasi)?.nama ?? "";
      return [
        item.kodeMitra,
        item.namaMitra,
        item.jenisMitra,
        item.nik,
        item.telepon,
        item.email,
        item.perencanaLokasi,
        item.kodeMarketing,
        marketingNama,
        item.namaBank,
        item.nomorRekening,
        item.kodeLokasi,
        lokasiNama,
        item.namaPameran,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(kata);
    });

    function nilaiSort(item: Mitra): string {
      switch (sortKey) {
        case "namaMarketing":
          return cariMarketing(marketing, item.kodeMarketing)?.nama ?? "";
        case "namaLokasi":
          return cariLokasi(lokasi, item.kodeLokasi)?.nama ?? "";
        case "namaMitra":
          return item.namaMitra;
        case "tanggalClosing":
          return item.tanggalClosing;
        default:
          return item[sortKey];
      }
    }

    return [...tersaring].sort((a, b) => {
      const hasilBanding = nilaiSort(a).localeCompare(nilaiSort(b), "id", {
        numeric: true,
        sensitivity: "base",
      });
      return asc ? hasilBanding : -hasilBanding;
    });
  }, [
    mitra,
    marketing,
    lokasi,
    cari,
    filterMarketing,
    filterLokasi,
    filterStatus,
    sortKey,
    asc,
  ]);

  const adaFilter =
    cari !== "" ||
    filterMarketing !== "" ||
    filterLokasi !== "" ||
    filterStatus !== "";

  function resetFilter() {
    setCari("");
    setFilterMarketing("");
    setFilterLokasi("");
    setFilterStatus("");
    setSortKey("namaMarketing");
    setAsc(true);
  }

  function konfirmasiHapus(item: Mitra) {
    const yakin = window.confirm(
      `Hapus data mitra "${item.namaMitra}" (${item.kodeMitra})?`,
    );
    if (!yakin) return;
    hapusMitra(item.id);
    setDetail(null);
  }

  if (!hydrated) {
    return <p className={styles.muted}>Memuat data prototipe...</p>;
  }

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              className={styles.searchInput}
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama mitra, NIK, kode, telepon..."
            />
          </div>

          <select
            className={styles.input}
            value={filterMarketing}
            onChange={(e) => setFilterMarketing(e.target.value)}
          >
            <option value="">Semua Marketing</option>
            {marketing.map((item) => (
              <option key={item.kode} value={item.kode}>
                {item.kode} - {item.nama}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={filterLokasi}
            onChange={(e) => setFilterLokasi(e.target.value)}
          >
            <option value="">Semua Lokasi</option>
            {lokasi.map((item) => (
              <option key={item.kode} value={item.kode}>
                {item.kode} - {item.nama}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            {STATUS_MITRA.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.sortGroup}>
            <ArrowUpDownIcon />
            <span className={styles.muted}>Urutkan:</span>
            <select
              className={styles.input}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              {OPSI_SORT.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => setAsc((prev) => !prev)}
              title="Ubah arah urutan"
            >
              {asc ? "A → Z / Lama → Baru" : "Z → A / Baru → Lama"}
            </button>
          </div>

          <div className={styles.toolbarRight}>
            <span className={styles.muted}>
              Menampilkan <strong>{hasil.length}</strong> dari {mitra.length}{" "}
              mitra
            </span>
            {adaFilter && (
              <button
                type="button"
                className={styles.btnGhost}
                onClick={resetFilter}
              >
                Reset Filter
              </button>
            )}
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={onTambah}
            >
              <PlusIcon /> Input Mitra
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Mitra</th>
                <th>Marketing</th>
                <th>Lokasi</th>
                <th>Tgl Closing</th>
                <th>Status</th>
                <th className={styles.right}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((item) => (
                <tr
                  key={item.id}
                  className={styles.clickable}
                  onClick={() => setDetail(item)}
                >
                  <td>
                    <span className={styles.codeChip}>{item.kodeMitra}</span>
                  </td>
                  <td>
                    <div className={styles.cellMain}>{item.namaMitra}</div>
                    <div className={styles.cellSub}>{item.jenisMitra}</div>
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      {cariMarketing(marketing, item.kodeMarketing)?.nama ??
                        "Tanpa Marketing"}
                    </div>
                    <div className={styles.cellSub}>
                      {item.kodeMarketing || "-"}
                    </div>
                  </td>
                  <td>
                    <div className={styles.cellMain}>
                      {cariLokasi(lokasi, item.kodeLokasi)?.nama ??
                        item.kodeLokasi}
                    </div>
                    <div className={styles.cellSub}>{item.kodeLokasi}</div>
                  </td>
                  <td>{formatTanggal(item.tanggalClosing)}</td>
                  <td>
                    <span className={styles.status} data-status={item.status}>
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.right}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      title="Hapus"
                      onClick={(e) => {
                        e.stopPropagation();
                        konfirmasiHapus(item);
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {hasil.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    {mitra.length === 0
                      ? "Belum ada data mitra. Klik Input Mitra untuk menambah."
                      : "Tidak ada data yang cocok dengan pencarian/filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detail && (
        <div className={styles.modalOverlay} onClick={() => setDetail(null)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHead}>
              <div>
                <span className={styles.codeChip}>{detail.kodeMitra}</span>
                <h3>{detail.namaMitra}</h3>
              </div>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setDetail(null)}
                aria-label="Tutup"
              >
                <CloseIcon />
              </button>
            </header>

            <div className={styles.modalBody}>
              <DetailRow label="Jenis Mitra" value={detail.jenisMitra} />
              <DetailRow label="No. NIK" value={formatNik(detail.nik)} />
              <DetailRow label="No. HP" value={detail.telepon} />
              <DetailRow label="Email" value={detail.email} />
              <DetailRow label="Alamat" value={detail.alamat} />
              <DetailRow
                label="Perencana Lokasi"
                value={detail.perencanaLokasi || "-"}
              />
              <DetailRow label="Nama Bank" value={detail.namaBank || "-"} />
              <DetailRow
                label="No. Rek."
                value={detail.nomorRekening || "-"}
              />
              <DetailRow
                label="Jumlah Down Payment"
                value={formatRupiah(detail.jumlahDownPayment)}
              />
              <DetailRow
                label="Marketing"
                value={
                  detail.kodeMarketing
                    ? labelMarketing(marketing, detail.kodeMarketing)
                    : "Tanpa Marketing"
                }
              />
              <DetailRow
                label="Lokasi"
                value={`${detail.kodeLokasi} - ${
                  cariLokasi(lokasi, detail.kodeLokasi)?.nama ?? "-"
                }`}
              />
              <DetailRow
                label="Tanggal Closing"
                value={formatTanggal(detail.tanggalClosing)}
              />
              <DetailRow
                label="Nama Pameran"
                value={detail.namaPameran || "-"}
              />
              <DetailRow
                label="Diinput"
                value={formatTanggal(detail.createdAt)}
              />
              <DetailRow label="Catatan" value={detail.catatan || "-"} />
            </div>

            <footer className={styles.modalFoot}>
              <label className={styles.inlineField}>
                <span>Ubah Status</span>
                <select
                  className={styles.input}
                  value={detail.status}
                  onChange={(e) => {
                    const status = e.target.value as StatusMitra;
                    ubahStatusMitra(detail.id, status);
                    setDetail({ ...detail, status });
                  }}
                >
                  {STATUS_MITRA.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => konfirmasiHapus(detail)}
              >
                <TrashIcon /> Hapus Data
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
