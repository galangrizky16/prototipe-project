"use client";

import { useState } from "react";
import styles from "@/app/app.module.css";
import Dashboard from "./dashboard";
import MasterData from "./master-data";
import MitraForm from "./mitra-form";
import MitraTable from "./mitra-table";
import {
  DashboardIcon,
  ListIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
} from "./icons";

type Tab = "dashboard" | "input" | "data" | "master";

const NAV: { id: Tab; label: string; Icon: typeof DashboardIcon }[] = [
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon },
  { id: "input", label: "Input Mitra", Icon: PlusIcon },
  { id: "data", label: "Data Mitra", Icon: ListIcon },
  { id: "master", label: "Master Data", Icon: SettingsIcon },
];

const JUDUL: Record<Tab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Ringkasan data mitra hasil closing marketing.",
  },
  input: {
    title: "Input Data Mitra",
    subtitle: "Marketing mengisi data mitra baru, lalu klik Submit.",
  },
  data: {
    title: "Database Mitra",
    subtitle: "Cari, filter, dan urutkan data mitra yang sudah terinput.",
  },
  master: {
    title: "Master Data",
    subtitle: "Daftar kode marketing dan kode lokasi yang dipakai.",
  },
};

export default function MitraApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false);

  function pindah(next: Tab) {
    setTab(next);
    setSidebarTerbuka(false);
  }

  const { title, subtitle } = JUDUL[tab];

  return (
    <div className={styles.app}>
      <div
        className={styles.overlay}
        data-open={sidebarTerbuka ? "" : undefined}
        onClick={() => setSidebarTerbuka(false)}
      />
      <aside className={styles.sidebar} data-open={sidebarTerbuka ? "" : undefined}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>GM</span>
          <span>
            <strong>GraTech Mitra</strong>
            <small>Prototipe Pendataan Mitra</small>
          </span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={styles.navItem}
              data-active={tab === id ? "" : undefined}
              onClick={() => pindah(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarNote}>
          <strong>Mode Prototipe</strong>
          <p>
            Tanpa database. Data tersimpan otomatis di browser (localStorage)
            pada perangkat ini.
          </p>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setSidebarTerbuka((prev) => !prev)}
            aria-label="Buka menu"
          >
            <MenuIcon />
          </button>
          <div className={styles.topbarText}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>

        <main className={styles.main}>
          {tab === "dashboard" && (
            <Dashboard
              onInputBaru={() => pindah("input")}
              onLihatData={() => pindah("data")}
            />
          )}
          {tab === "input" && <MitraForm onSelesai={() => pindah("data")} />}
          {tab === "data" && <MitraTable onTambah={() => pindah("input")} />}
          {tab === "master" && <MasterData />}
        </main>
      </div>
    </div>
  );
}
