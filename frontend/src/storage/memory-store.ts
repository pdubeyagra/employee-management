import type { DataStore, StorageKind } from "@/types/storage-types.ts";

const buckets = new Map<string, unknown[]>();

export function createMemoryStore<T>(
  key: string,
  requestedKind: StorageKind = "state",
): DataStore<T> {
  return {
    kind: "state",
    requestedKind,

    async read() {
      return [...((buckets.get(key) as T[]) ?? [])];
    },

    async write(items: T[]) {
      buckets.set(key, [...items]);
    },

    async clear() {
      buckets.delete(key);
    },
  };
}

export function resetMemoryStores() {
  buckets.clear();
}
