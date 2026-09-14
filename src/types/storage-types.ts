export type StorageKind = "state" | "session" | "local" | "indexed";

export interface DataStore<T> {
  readonly kind: StorageKind;
  readonly requestedKind: StorageKind;
  read(): Promise<T[]>;
  write(items: T[]): Promise<void>;
  clear(): Promise<void>;
}
