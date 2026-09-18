import type { SelectOption } from "@/components/ui/ui-select.ts";
import type { DataStore, StorageKind } from "@/types/storage-types.ts";

import { createMemoryStore } from "./memory-store.ts";
import { createWebStore, isWebStorageAvailable } from "./web-store.ts";
import { createIndexedStore, isIndexedDbAvailable } from "./indexed-store.ts";

export const STORAGE_KINDS: StorageKind[] = [
  "state",
  "session",
  "local",
  "indexed",
];

export const STORAGE_LABELS: Record<StorageKind, string> = {
  state: "In memory",
  session: "Session storage",
  local: "Local storage",
  indexed: "IndexedDB",
};

export const STORAGE_OPTIONS: SelectOption[] = STORAGE_KINDS.map((kind) => ({
  value: kind,
  label: STORAGE_LABELS[kind],
}));

export function isStorageKind(value: string): value is StorageKind {
  return (STORAGE_KINDS as string[]).includes(value);
}

export function isStorageAvailable(kind: StorageKind): boolean {
  if (kind === "state") {
    return true;
  }

  if (kind === "indexed") {
    return isIndexedDbAvailable();
  }

  return isWebStorageAvailable(kind);
}

export function createStore<T>(kind: StorageKind, key: string): DataStore<T> {
  if (!isStorageAvailable(kind)) {
    return createMemoryStore<T>(key, kind);
  }

  if (kind === "indexed") {
    return createIndexedStore<T>(key);
  }

  if (kind === "session" || kind === "local") {
    return createWebStore<T>(kind, key);
  }

  return createMemoryStore<T>(key, kind);
}
