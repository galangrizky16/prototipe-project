"use client";

import { useState } from "react";
import styles from "@/app/app.module.css";
import {
  JENIS_MITRA,
  STATUS_MITRA,
  type JenisMitra,
  type MitraInput,
  type StatusMitra,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { CheckIcon, CloseIcon } from "./icons";

type FormState = {
  namaMitra: string;
  jenisMitra: JenisMitra;
  penanggungJawab: string;
  telepon: string;
  email: string;
  alamat: string;
  kodeMarketing: string;
  kodeLokasi: string;
  tanggalClosing: string;
  status: StatusMitra;
  catatan: string;
};

function formKosong(kodeMarketing: string, kodeLokasi: string): FormState {
  return {
    namaMitra: "",
    jenisMitra: "Perusahaan",
    penanggungJawab: "",
    telepon: "",
    email: "",
    alamat: "",
    kodeMarketing,
    kodeLokasi,
    tanggalClosing: new Date().toISOString().slice(0, 10),
    status: "Baru",
    catatan: "",
  };
}

export default function MitraForm({ onSelesai }: { onSelesai: () => void }) {
  const { marketing, lokasi, tambahMitra } = useStore();
  const [form, setForm] = useState<FormState>(() =>
    formKosong(marketing[0]?.kode ?? "", lokasi[0]?.kode ?? ""),
  );
  const [error, setError] = useState<Record<string, string>>({});
  const [sukses, setSukses] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validasi(): boolean {
    const err: Record<string, string> = {};
    if (!form.namaMitra.trim()) err.namaMitra = "Nama mitra wajib diisi.";
    if (!form.penanggungJawab.trim())
      err.penanggungJawab = "Nama penanggung jawab wajib diisi.";
    if (!form.telepon.trim()) err.telepon = "Nomor telepon wajib diisi.";
    if (!form.email.trim()) {
      err.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      err.email = "Format email tidak valid.";
    }
    if (!form.alamat.trim()) err.alamat = "Alamat wajib diisi.";
    if (!form.kodeMarketing) err.kodeMarketing = "Pilih marketing.";
    if (!form.kodeLokasi) err.kodeLokasi = "Pilih lokasi.";
    if (!form.tanggalClosing)
      err.tanggalClosing = "Tanggal closing wajib diisi.";
    setError(err);
    return Object.keys(err).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validasi()) {
      setSukses(null);
      return;
    }

    const input: MitraInput = {
      namaMitra: form.namaMitra.trim(),
      jenisMitra: form.jenisMitra,
      penanggungJawab: form.penanggungJawab.trim(),
      telepon: form.telepon.trim(),
      email: form.email.trim(),
      alamat: form.alamat.trim(),
      kodeMarketing: form.kodeMarketing,
      kodeLokasi: form.kodeLokasi,
      tanggalClosing: form.tanggalClosing,
      status: form.status,
      catatan: form.catatan.trim(),
    };

    const dibuat = tambahMitra(input);
    setSukses(
      `Data mitra ${dibuat.namaMitra} berhasil disimpan dengan kode ${dibuat.kodeMitra}.`,
    );
    setForm(formKosong(marketing[0]?.kode ?? "", lokasi[0]?.kode ?? ""));
  }

  return (
    <form className={styles.stack} onSubmit={submit} noValidate>
      {sukses && (
        <div className={styles.alert} data-tone="success">
          <CheckIcon />
          <div>
            <strong>Submit berhasil</strong>
            <p>{sukses}</p>
          </div>
          <button
            type="button"
            className={styles.alertClose}
            onClick={onSelesai}
          >
            Lihat di Database
          </button>
        </div>
      )}

      {Object.keys(error).length > 0 && (
        <div className={styles.alert} data-tone="danger">
          <CloseIcon />
          <div>
            <strong>Periksa kembali data Anda</strong>
            <p>Ada {Object.keys(error).length} kolom yang belum sesuai.</p>
          </div>
        </div>
      )}

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h3>1. Data Mitra</h3>
          <span className={styles.muted}>
            Diisi marketing setelah closing berhasil
          </span>
        </header>
        <div className={styles.formGrid}>
          <Field label="Nama Mitra" error={error.namaMitra} required>
            <input
              className={styles.input}
              value={form.namaMitra}
              onChange={(e) => update("namaMitra", e.target.value)}
              placeholder="Contoh: PT Sinar Abadi"
            />
          </Field>

          <Field label="Jenis Mitra" required>
            <select
              className={styles.input}
              value={form.jenisMitra}
              onChange={(e) =>
                update("jenisMitra", e.target.value as JenisMitra)
              }
            >
              {JENIS_MITRA.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Penanggung Jawab" error={error.penanggungJawab} required>
            <input
              className={styles.input}
              value={form.penanggungJawab}
              onChange={(e) => update("penanggungJawab", e.target.value)}
              placeholder="Nama PIC mitra"
            />
          </Field>

          <Field label="Nomor Telepon" error={error.telepon} required>
            <input
              className={styles.input}
              value={form.telepon}
              onChange={(e) => update("telepon", e.target.value)}
              placeholder="0812-xxxx-xxxx"
            />
          </Field>

          <Field label="Email" error={error.email} required>
            <input
              className={styles.input}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="nama@perusahaan.com"
            />
          </Field>

          <Field
            label="Alamat"
            error={error.alamat}
            required
            full
          >
            <input
              className={styles.input}
              value={form.alamat}
              onChange={(e) => update("alamat", e.target.value)}
              placeholder="Jalan, nomor, kota"
            />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h3>2. Marketing &amp; Lokasi</h3>
          <span className={styles.muted}>
            Kode marketing otomatis menampilkan nama marketing
          </span>
        </header>
        <div className={styles.formGrid}>
          <Field label="Marketing (Kode - Nama)" error={error.kodeMarketing} required>
            <select
              className={styles.input}
              value={form.kodeMarketing}
              onChange={(e) => update("kodeMarketing", e.target.value)}
            >
              <option value="">-- Pilih Marketing --</option>
              {marketing.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Lokasi (Kode - Nama)" error={error.kodeLokasi} required>
            <select
              className={styles.input}
              value={form.kodeLokasi}
              onChange={(e) => update("kodeLokasi", e.target.value)}
            >
              <option value="">-- Pilih Lokasi --</option>
              {lokasi.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tanggal Closing" error={error.tanggalClosing} required>
            <input
              type="date"
              className={styles.input}
              value={form.tanggalClosing}
              onChange={(e) => update("tanggalClosing", e.target.value)}
            />
          </Field>

          <Field label="Status">
            <select
              className={styles.input}
              value={form.status}
              onChange={(e) => update("status", e.target.value as StatusMitra)}
            >
              {STATUS_MITRA.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Catatan" full>
            <textarea
              className={styles.textarea}
              rows={3}
              value={form.catatan}
              onChange={(e) => update("catatan", e.target.value)}
              placeholder="Catatan hasil closing, kesepakatan, atau tindak lanjut"
            />
          </Field>
        </div>
      </section>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => {
            setForm(formKosong(marketing[0]?.kode ?? "", lokasi[0]?.kode ?? ""));
            setError({});
            setSukses(null);
          }}
        >
          Reset Form
        </button>
        <button type="submit" className={styles.btnPrimary}>
          <CheckIcon /> Submit Data Mitra
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  full,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field} data-full={full ? "" : undefined}>
      <span className={styles.fieldLabel}>
        {label} {required && <em>*</em>}
      </span>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </label>
  );
}
