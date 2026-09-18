import type { DataStore } from "@/types/storage-types.ts";

const DATABASE_NAME = "employee-management";
const STORE_NAME = "collections";
const VERSION = 1;

export function isIndexedDbAvailable(): boolean {
  try {
    return Boolean(globalThis.indexedDB);
  } catch {
    return false;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = globalThis.indexedDB.open(DATABASE_NAME, VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("IndexedDB upgrade blocked"));
  });
}

function runTransaction<R>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<R>,
): Promise<R> {
  return openDatabase().then(
    (database) =>
      new Promise<R>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const request = action(transaction.objectStore(STORE_NAME));

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onabort = () => {
          database.close();
          reject(transaction.error);
        };
      }),
  );
}

export function createIndexedStore<T>(key: string): DataStore<T> {
  return {
    kind: "indexed",
    requestedKind: "indexed",

    async read() {
      try {
        const value = await runTransaction<unknown>("readonly", (store) =>
          store.get(key),
        );

        return Array.isArray(value) ? (value as T[]) : [];
      } catch {
        return [];
      }
    },

    async write(items: T[]) {
      try {
        await runTransaction("readwrite", (store) =>
          store.put(structuredClone(items), key),
        );
      } catch {
        return;
      }
    },

    async clear() {
      try {
        await runTransaction("readwrite", (store) => store.delete(key));
      } catch {
        return;
      }
    },
  };
}
