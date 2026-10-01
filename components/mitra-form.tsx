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
  nik: string;
  telepon: string;
  email: string;
  alamat: string;
  perencanaLokasi: string;
  kodeMarketing: string;
  namaBank: string;
  nomorRekening: string;
  jumlahDownPayment: string;
  kodeLokasi: string;
  tanggalClosing: string;
  namaPameran: string;
  status: StatusMitra;
  catatan: string;
};

function formKosong(kodeLokasi: string): FormState {
  return {
    namaMitra: "",
    jenisMitra: "Mandiri",
    nik: "",
    telepon: "",
    email: "",
    alamat: "",
    perencanaLokasi: "",
    kodeMarketing: "",
    namaBank: "",
    nomorRekening: "",
    jumlahDownPayment: "",
    kodeLokasi,
    tanggalClosing: new Date().toISOString().slice(0, 10),
    namaPameran: "",
    status: "Baru",
    catatan: "",
  };
}

function formatAngka(value: string): string {
  const digit = value.replace(/\D/g, "");
  if (!digit) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digit));
}

function angkaKeNumber(value: string): number {
  return Number(value.replace(/\D/g, "")) || 0;
}

export default function MitraForm({ onSelesai }: { onSelesai: () => void }) {
  const { marketing, lokasi, tambahMitra } = useStore();
  const [form, setForm] = useState<FormState>(() =>
    formKosong(lokasi[0]?.kode ?? ""),
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
    if (!form.nik.trim()) {
      err.nik = "No. NIK wajib diisi.";
    } else if (!/^\d{16}$/.test(form.nik.replace(/\s/g, ""))) {
      err.nik = "No. NIK harus 16 digit angka.";
    }
    if (!form.telepon.trim()) err.telepon = "No. HP wajib diisi.";
    if (!form.email.trim()) {
      err.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      err.email = "Format email tidak valid.";
    }
    if (!form.alamat.trim()) err.alamat = "Alamat wajib diisi.";
    if (!form.perencanaLokasi.trim())
      err.perencanaLokasi = "Perencana lokasi wajib diisi.";
    if (!form.kodeLokasi) err.kodeLokasi = "Pilih lokasi.";
    if (!form.tanggalClosing)
      err.tanggalClosing = "Tanggal closing wajib diisi.";
    if (!form.namaPameran.trim())
      err.namaPameran = "Nama pameran wajib diisi.";
    if (!form.jumlahDownPayment.trim()) {
      err.jumlahDownPayment = "Jumlah down payment wajib diisi.";
    } else if (angkaKeNumber(form.jumlahDownPayment) <= 0) {
      err.jumlahDownPayment = "Jumlah down payment harus lebih dari 0.";
    }
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
      nik: form.nik.trim(),
      telepon: form.telepon.trim(),
      email: form.email.trim(),
      alamat: form.alamat.trim(),
      perencanaLokasi: form.perencanaLokasi.trim(),
      kodeMarketing: form.kodeMarketing,
      namaBank: form.namaBank.trim(),
      nomorRekening: form.nomorRekening.trim(),
      jumlahDownPayment: angkaKeNumber(form.jumlahDownPayment),
      kodeLokasi: form.kodeLokasi,
      tanggalClosing: form.tanggalClosing,
      namaPameran: form.namaPameran.trim(),
      status: form.status,
      catatan: form.catatan.trim(),
    };

    const dibuat = tambahMitra(input);
    setSukses(
      `Data mitra ${dibuat.namaMitra} berhasil disimpan dengan kode ${dibuat.kodeMitra}.`,
    );
    setForm(formKosong(lokasi[0]?.kode ?? ""));
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

          <Field label="No. NIK" error={error.nik} required>
            <input
              className={styles.input}
              value={form.nik}
              onChange={(e) => update("nik", e.target.value)}
              placeholder="16 digit NIK"
              inputMode="numeric"
              maxLength={16}
            />
          </Field>

          <Field label="No. HP" error={error.telepon} required>
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

          <Field label="Perencana Lokasi" error={error.perencanaLokasi} required>
            <input
              className={styles.input}
              value={form.perencanaLokasi}
              onChange={(e) => update("perencanaLokasi", e.target.value)}
              placeholder="Nama perencana lokasi"
            />
          </Field>

          <Field label="Alamat" error={error.alamat} required full>
            <input
              className={styles.input}
              value={form.alamat}
              onChange={(e) => update("alamat", e.target.value)}
              placeholder="Jalan, nomor, kota"
            />
          </Field>

          <Field label="Nama Bank">
            <input
              className={styles.input}
              value={form.namaBank}
              onChange={(e) => update("namaBank", e.target.value)}
              placeholder="Contoh: BCA"
            />
          </Field>

          <Field label="No. Rek.">
            <input
              className={styles.input}
              value={form.nomorRekening}
              onChange={(e) => update("nomorRekening", e.target.value)}
              placeholder="Nomor rekening"
              inputMode="numeric"
            />
          </Field>

          <Field
            label="Jumlah Down Payment"
            error={error.jumlahDownPayment}
            required
          >
            <input
              className={styles.input}
              value={form.jumlahDownPayment}
              onChange={(e) =>
                update("jumlahDownPayment", formatAngka(e.target.value))
              }
              placeholder="Mis. 10.000.000"
              inputMode="numeric"
            />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h3>2. Marketing &amp; Lokasi</h3>
          <span className={styles.muted}>
            Marketing boleh dikosongkan bila tidak ada
          </span>
        </header>
        <div className={styles.formGrid}>
          <Field label="Marketing (Kode - Nama)">
            <select
              className={styles.input}
              value={form.kodeMarketing}
              onChange={(e) => update("kodeMarketing", e.target.value)}
            >
              <option value="">-- Tanpa Marketing --</option>
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

          <Field
            label="Nama Pameran"
            error={error.namaPameran}
            required
            full
          >
            <input
              className={styles.input}
              value={form.namaPameran}
              onChange={(e) => update("namaPameran", e.target.value)}
              placeholder="Contoh: Jakarta Property Expo"
            />
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
            setForm(formKosong(lokasi[0]?.kode ?? ""));
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
