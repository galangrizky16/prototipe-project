"use client";

import { useMemo } from "react";
import styles from "@/app/app.module.css";
import { formatTanggal, labelLokasi, labelMarketing } from "@/lib/data";
import { useStore } from "@/lib/store";
import {
  BuildingIcon,
  PinIcon,
  PlusIcon,
  TrendIcon,
  UsersIcon,
} from "./icons";

export default function Dashboard({
  onInputBaru,
  onLihatData,
}: {
  onInputBaru: () => void;
  onLihatData: () => void;
}) {
  const { mitra, marketing, lokasi, hydrated } = useStore();

  const ringkasan = useMemo(() => {
    const namaBulanIni = new Date().toISOString().slice(0, 7);

    const perMarketing = marketing.map((item) => ({
      ...item,
      jumlah: mitra.filter((m) => m.kodeMarketing === item.kode).length,
    }));

    const perLokasi = lokasi.map((item) => ({
      ...item,
      jumlah: mitra.filter((m) => m.kodeLokasi === item.kode).length,
    }));

    return {
      total: mitra.length,
      bulanIni: mitra.filter((m) => m.tanggalClosing.startsWith(namaBulanIni))
        .length,
      aktif: mitra.filter((m) => m.status === "Aktif").length,
      pending: mitra.filter((m) => m.status === "Pending" || m.status === "Baru")
        .length,
      perMarketing: perMarketing.sort((a, b) => b.jumlah - a.jumlah),
      perLokasi: perLokasi.sort((a, b) => b.jumlah - a.jumlah),
      terbaru: [...mitra]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    };
  }, [mitra, marketing, lokasi]);

  const maxMarketing = Math.max(
    1,
    ...ringkasan.perMarketing.map((item) => item.jumlah),
  );

  if (!hydrated) {
    return <p className={styles.muted}>Memuat data prototipe...</p>;
  }

  return (
    <div className={styles.stack}>
      <section className={styles.stats}>
        <StatCard
          Icon={BuildingIcon}
          label="Total Mitra"
          value={ringkasan.total}
          tone="primary"
        />
        <StatCard
          Icon={TrendIcon}
          label="Closing Bulan Ini"
          value={ringkasan.bulanIni}
          tone="accent"
        />
        <StatCard
          Icon={UsersIcon}
          label="Mitra Aktif"
          value={ringkasan.aktif}
          tone="success"
        />
        <StatCard
          Icon={PinIcon}
          label="Perlu Tindak Lanjut"
          value={ringkasan.pending}
          tone="warning"
        />
      </section>

      <section className={styles.heroCard}>
        <div>
          <h2>Alur kerja marketing</h2>
          <ol className={styles.heroFlow}>
            <li>Marketing melakukan closing dan mendapatkan Mitra baru.</li>
            <li>Marketing membuka menu <strong>Input Mitra</strong> lalu mengisi data.</li>
            <li>Klik <strong>Submit</strong> — data langsung masuk ke database prototipe.</li>
          </ol>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btnPrimary} onClick={onInputBaru}>
            <PlusIcon /> Input Mitra Baru
          </button>
          <button type="button" className={styles.btnGhost} onClick={onLihatData}>
            Lihat Database
          </button>
        </div>
      </section>

      <section className={styles.grid2}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Mitra per Marketing</h3>
            <span className={styles.muted}>Kode - Nama</span>
          </header>
          <ul className={styles.barList}>
            {ringkasan.perMarketing.map((item) => (
              <li key={item.kode}>
                <div className={styles.barLabel}>
                  <span className={styles.codeChip}>{item.kode}</span>
                  <span>{item.nama}</span>
                  <strong>{item.jumlah}</strong>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(item.jumlah / maxMarketing) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {ringkasan.perMarketing.length === 0 && (
              <li className={styles.muted}>Belum ada data marketing.</li>
            )}
          </ul>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Mitra per Lokasi</h3>
            <span className={styles.muted}>Kode - Nama</span>
          </header>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Lokasi</th>
                  <th className={styles.right}>Jumlah Mitra</th>
                </tr>
              </thead>
              <tbody>
                {ringkasan.perLokasi.map((item) => (
                  <tr key={item.kode}>
                    <td>
                      <span className={styles.codeChip}>{item.kode}</span>
                    </td>
                    <td>{item.nama}</td>
                    <td className={styles.right}>
                      <strong>{item.jumlah}</strong>
                    </td>
                  </tr>
                ))}
                {ringkasan.perLokasi.length === 0 && (
                  <tr>
                    <td colSpan={3} className={styles.muted}>
                      Belum ada data lokasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h3>Input Terbaru</h3>
          <button type="button" className={styles.btnGhost} onClick={onLihatData}>
            Lihat semua
          </button>
        </header>
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
              </tr>
            </thead>
            <tbody>
              {ringkasan.terbaru.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={styles.codeChip}>{item.kodeMitra}</span>
                  </td>
                  <td>{item.namaMitra}</td>
                  <td>{labelMarketing(marketing, item.kodeMarketing)}</td>
                  <td>{labelLokasi(lokasi, item.kodeLokasi)}</td>
                  <td>{formatTanggal(item.tanggalClosing)}</td>
                  <td>
                    <span className={styles.status} data-status={item.status}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {ringkasan.terbaru.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.muted}>
                    Belum ada mitra yang diinput. Mulai dari menu Input Mitra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: typeof BuildingIcon;
  label: string;
  value: number;
  tone: "primary" | "accent" | "success" | "warning";
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon} data-tone={tone}>
        <Icon />
      </span>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}
