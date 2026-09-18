import type { DataStore, StorageKind } from "@/types/storage-types.ts";

type WebStorageKind = Extract<StorageKind, "session" | "local">;

function backingStore(kind: WebStorageKind): Storage | null {
  try {
    const storage =
      kind === "local" ? globalThis.localStorage : globalThis.sessionStorage;

    if (!storage) {
      return null;
    }

    const probe = `__probe__${Math.random()}`;

    storage.setItem(probe, "1");
    storage.removeItem(probe);

    return storage;
  } catch {
    return null;
  }
}

export function isWebStorageAvailable(kind: WebStorageKind): boolean {
  return backingStore(kind) !== null;
}

export function createWebStore<T>(
  kind: WebStorageKind,
  key: string,
): DataStore<T> {
  return {
    kind,
    requestedKind: kind,

    async read() {
      const storage = backingStore(kind);

      if (!storage) {
        return [];
      }

      try {
        const raw = storage.getItem(key);

        if (!raw) {
          return [];
        }

        const parsed: unknown = JSON.parse(raw);

        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } catch {
        return [];
      }
    },

    async write(items: T[]) {
      const storage = backingStore(kind);

      if (!storage) {
        return;
      }

      try {
        storage.setItem(key, JSON.stringify(items));
      } catch {
        return;
      }
    },

    async clear() {
      backingStore(kind)?.removeItem(key);
    },
  };
}
