"use client";

import { useState } from "react";
import styles from "@/app/app.module.css";
import { useStore } from "@/lib/store";
import { PlusIcon, RefreshIcon, TrashIcon } from "./icons";

export default function MasterData() {
  const {
    marketing,
    lokasi,
    mitra,
    tambahMarketing,
    hapusMarketing,
    tambahLokasi,
    hapusLokasi,
    resetData,
  } = useStore();

  const [kodeMarketing, setKodeMarketing] = useState("");
  const [namaMarketing, setNamaMarketing] = useState("");
  const [kodeLokasi, setKodeLokasi] = useState("");
  const [namaLokasi, setNamaLokasi] = useState("");
  const [pesan, setPesan] = useState<{ tone: string; text: string } | null>(
    null,
  );

  function simpanMarketing(event: React.FormEvent) {
    event.preventDefault();
    const kode = kodeMarketing.trim();
    const nama = namaMarketing.trim();
    if (!kode || !nama) {
      setPesan({ tone: "danger", text: "Kode dan nama marketing wajib diisi." });
      return;
    }
    const berhasil = tambahMarketing({ kode, nama });
    if (!berhasil) {
      setPesan({ tone: "danger", text: `Kode marketing ${kode} sudah ada.` });
      return;
    }
    setKodeMarketing("");
    setNamaMarketing("");
    setPesan({ tone: "success", text: `Marketing ${kode} - ${nama} ditambahkan.` });
  }

  function simpanLokasi(event: React.FormEvent) {
    event.preventDefault();
    const kode = kodeLokasi.trim().toUpperCase();
    const nama = namaLokasi.trim();
    if (!kode || !nama) {
      setPesan({ tone: "danger", text: "Kode dan nama lokasi wajib diisi." });
      return;
    }
    const berhasil = tambahLokasi({ kode, nama });
    if (!berhasil) {
      setPesan({ tone: "danger", text: `Kode lokasi ${kode} sudah ada.` });
      return;
    }
    setKodeLokasi("");
    setNamaLokasi("");
    setPesan({ tone: "success", text: `Lokasi ${kode} - ${nama} ditambahkan.` });
  }

  return (
    <div className={styles.stack}>
      {pesan && (
        <div className={styles.alert} data-tone={pesan.tone}>
          <span />
          <div>
            <p>{pesan.text}</p>
          </div>
          <button
            type="button"
            className={styles.alertClose}
            onClick={() => setPesan(null)}
          >
            Tutup
          </button>
        </div>
      )}

      <section className={styles.grid2}>
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Data Marketing</h3>
            <span className={styles.muted}>Kode mengarah ke nama marketing</span>
          </header>

          <form className={styles.inlineForm} onSubmit={simpanMarketing}>
            <input
              className={styles.input}
              value={kodeMarketing}
              onChange={(e) => setKodeMarketing(e.target.value)}
              placeholder="Kode (mis. 006)"
            />
            <input
              className={styles.input}
              value={namaMarketing}
              onChange={(e) => setNamaMarketing(e.target.value)}
              placeholder="Nama marketing"
            />
            <button type="submit" className={styles.btnPrimary}>
              <PlusIcon /> Tambah
            </button>
          </form>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Marketing</th>
                  <th className={styles.right}>Jumlah Mitra</th>
                  <th className={styles.right}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {marketing.map((item) => {
                  const jumlah = mitra.filter(
                    (m) => m.kodeMarketing === item.kode,
                  ).length;
                  return (
                    <tr key={item.kode}>
                      <td>
                        <span className={styles.codeChip}>{item.kode}</span>
                      </td>
                      <td>{item.nama}</td>
                      <td className={styles.right}>{jumlah}</td>
                      <td className={styles.right}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Hapus marketing"
                          onClick={() => hapusMarketing(item.kode)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <header className={styles.cardHead}>
            <h3>Data Lokasi</h3>
            <span className={styles.muted}>Kode mengarah ke nama lokasi</span>
          </header>

          <form className={styles.inlineForm} onSubmit={simpanLokasi}>
            <input
              className={styles.input}
              value={kodeLokasi}
              onChange={(e) => setKodeLokasi(e.target.value)}
              placeholder="Kode (mis. YOG)"
            />
            <input
              className={styles.input}
              value={namaLokasi}
              onChange={(e) => setNamaLokasi(e.target.value)}
              placeholder="Nama lokasi"
            />
            <button type="submit" className={styles.btnPrimary}>
              <PlusIcon /> Tambah
            </button>
          </form>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Lokasi</th>
                  <th className={styles.right}>Jumlah Mitra</th>
                  <th className={styles.right}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lokasi.map((item) => {
                  const jumlah = mitra.filter(
                    (m) => m.kodeLokasi === item.kode,
                  ).length;
                  return (
                    <tr key={item.kode}>
                      <td>
                        <span className={styles.codeChip}>{item.kode}</span>
                      </td>
                      <td>{item.nama}</td>
                      <td className={styles.right}>{jumlah}</td>
                      <td className={styles.right}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Hapus lokasi"
                          onClick={() => hapusLokasi(item.kode)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h3>Data Prototipe</h3>
          <span className={styles.muted}>Tanpa database server</span>
        </header>
        <p className={styles.muted}>
          Semua data mitra, marketing, dan lokasi pada prototipe ini disimpan di
          localStorage browser. Klik tombol di bawah untuk mengembalikan ke data
          contoh awal.
        </p>
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => {
              const yakin = window.confirm(
                "Kembalikan semua data ke contoh awal? Data yang Anda input akan hilang.",
              );
              if (!yakin) return;
              resetData();
              setPesan({ tone: "success", text: "Data prototipe direset ke contoh awal." });
            }}
          >
            <RefreshIcon /> Reset ke Data Contoh
          </button>
        </div>
      </section>
    </div>
  );
}
