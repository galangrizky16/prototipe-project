"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  buatId,
  generateKodeMitra,
  SEED_LOKASI,
  SEED_MARKETING,
  SEED_MITRA,
  type Lokasi,
  type Marketing,
  type Mitra,
  type MitraInput,
  type StatusMitra,
} from "./data";

const STORAGE_KEY = "prototipe-mitra-v1";

type DataState = {
  mitra: Mitra[];
  marketing: Marketing[];
  lokasi: Lokasi[];
};

type Snapshot = DataState & { hydrated: boolean };

const SERVER_SNAPSHOT: Snapshot = {
  mitra: [],
  marketing: SEED_MARKETING,
  lokasi: SEED_LOKASI,
  hydrated: false,
};

function dataContoh(): DataState {
  return {
    mitra: SEED_MITRA,
    marketing: SEED_MARKETING,
    lokasi: SEED_LOKASI,
  };
}

function muatDariPenyimpanan(): DataState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DataState>;
      return {
        mitra: Array.isArray(parsed.mitra) ? parsed.mitra : [],
        marketing:
          Array.isArray(parsed.marketing) && parsed.marketing.length > 0
            ? parsed.marketing
            : SEED_MARKETING,
        lokasi:
          Array.isArray(parsed.lokasi) && parsed.lokasi.length > 0
            ? parsed.lokasi
            : SEED_LOKASI,
      };
    }
  } catch {
    // localStorage tidak tersedia / data rusak -> pakai data contoh
  }
  return dataContoh();
}

let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Snapshot {
  if (snapshot === null) {
    snapshot = { ...muatDariPenyimpanan(), hydrated: true };
  }
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function simpanKePenyimpanan(next: DataState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage penuh / tidak tersedia -> prototipe tetap jalan di memori
  }
}

function terapkan(updater: (prev: DataState) => DataState) {
  const next = updater(getSnapshot());
  snapshot = { ...next, hydrated: true };
  simpanKePenyimpanan(next);
  listeners.forEach((listener) => listener());
}

function tambahMitra(input: MitraInput): Mitra {
  const dibuat: Mitra = {
    ...input,
    id: buatId(),
    kodeMitra: generateKodeMitra(getSnapshot().mitra),
    createdAt: new Date().toISOString(),
  };
  terapkan((prev) => ({ ...prev, mitra: [dibuat, ...prev.mitra] }));
  return dibuat;
}

function ubahStatusMitra(id: string, status: StatusMitra) {
  terapkan((prev) => ({
    ...prev,
    mitra: prev.mitra.map((item) =>
      item.id === id ? { ...item, status } : item,
    ),
  }));
}

function hapusMitra(id: string) {
  terapkan((prev) => ({
    ...prev,
    mitra: prev.mitra.filter((item) => item.id !== id),
  }));
}

function tambahMarketing(marketing: Marketing): boolean {
  if (getSnapshot().marketing.some((item) => item.kode === marketing.kode)) {
    return false;
  }
  terapkan((prev) => ({ ...prev, marketing: [...prev.marketing, marketing] }));
  return true;
}

function hapusMarketing(kode: string) {
  terapkan((prev) => ({
    ...prev,
    marketing: prev.marketing.filter((item) => item.kode !== kode),
  }));
}

function tambahLokasi(lokasi: Lokasi): boolean {
  if (getSnapshot().lokasi.some((item) => item.kode === lokasi.kode)) {
    return false;
  }
  terapkan((prev) => ({ ...prev, lokasi: [...prev.lokasi, lokasi] }));
  return true;
}

function hapusLokasi(kode: string) {
  terapkan((prev) => ({
    ...prev,
    lokasi: prev.lokasi.filter((item) => item.kode !== kode),
  }));
}

function resetData() {
  terapkan(() => dataContoh());
}

const actions = {
  tambahMitra,
  ubahStatusMitra,
  hapusMitra,
  tambahMarketing,
  hapusMarketing,
  tambahLokasi,
  hapusLokasi,
  resetData,
};

type StoreValue = Snapshot & typeof actions;

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<StoreValue>(() => ({ ...data, ...actions }), [data]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore harus dipakai di dalam StoreProvider");
  }
  return context;
}
