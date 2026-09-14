import { expect } from "chai";

import {
  STORAGE_KINDS,
  STORAGE_LABELS,
  STORAGE_OPTIONS,
  createStore,
  isStorageAvailable,
  isStorageKind,
} from "@/storage/create-store.ts";
import { isIndexedDbAvailable } from "@/storage/indexed-store.ts";
import type { StorageKind } from "@/types/storage-types.ts";

interface Row {
  id: string;
}

const ROWS: Row[] = [{ id: "a" }, { id: "b" }];

const SYNC_KINDS: StorageKind[] = ["state", "session", "local"];

describe("storage options", () => {
  it("offers memory, session, local and IndexedDB", () => {
    expect(STORAGE_KINDS).to.deep.equal([
      "state",
      "session",
      "local",
      "indexed",
    ]);
  });

  it("builds dropdown options from the kinds", () => {
    expect(STORAGE_OPTIONS.map((option) => option.value)).to.deep.equal(
      STORAGE_KINDS,
    );
    expect(STORAGE_OPTIONS.map((option) => option.label)).to.deep.equal(
      STORAGE_KINDS.map((kind) => STORAGE_LABELS[kind]),
    );
  });

  it("recognises its own kinds and rejects anything else", () => {
    for (const kind of STORAGE_KINDS) {
      expect(isStorageKind(kind), kind).to.equal(true);
    }

    expect(isStorageKind("cookies")).to.equal(false);
    expect(isStorageKind("")).to.equal(false);
  });

  it("always treats memory as available", () => {
    expect(isStorageAvailable("state")).to.equal(true);
  });

  it("reports web storage as available under jsdom", () => {
    expect(isStorageAvailable("session")).to.equal(true);
    expect(isStorageAvailable("local")).to.equal(true);
  });
});

describe("createStore", () => {
  for (const kind of SYNC_KINDS) {
    describe(kind, () => {
      it("starts empty", async () => {
        const store = createStore<Row>(kind, "rows");

        expect(await store.read()).to.deep.equal([]);
      });

      it("round-trips what it was given", async () => {
        const store = createStore<Row>(kind, "rows");

        await store.write(ROWS);

        expect(await store.read()).to.deep.equal(ROWS);
      });

      it("hands back a copy rather than the caller's array", async () => {
        const store = createStore<Row>(kind, "rows");
        const source = [...ROWS];

        await store.write(source);
        source.push({ id: "c" });

        expect(await store.read()).to.have.lengthOf(2);
      });

      it("keeps separate keys apart", async () => {
        const rows = createStore<Row>(kind, "rows");
        const others = createStore<Row>(kind, "others");

        await rows.write(ROWS);

        expect(await others.read()).to.deep.equal([]);
      });

      it("empties on clear", async () => {
        const store = createStore<Row>(kind, "rows");

        await store.write(ROWS);
        await store.clear();

        expect(await store.read()).to.deep.equal([]);
      });

      it("reports the kind it is actually using", async () => {
        const store = createStore<Row>(kind, "rows");

        expect(store.kind).to.equal(kind);
        expect(store.requestedKind).to.equal(kind);
      });
    });
  }

  it("keeps session and local storage independent", async () => {
    const session = createStore<Row>("session", "rows");
    const local = createStore<Row>("local", "rows");

    await session.write(ROWS);

    expect(await local.read()).to.deep.equal([]);
  });

  it("survives a fresh store object over the same backing key", async () => {
    await createStore<Row>("local", "rows").write(ROWS);

    expect(await createStore<Row>("local", "rows").read()).to.deep.equal(ROWS);
  });

  it("recovers from corrupt persisted data instead of throwing", async () => {
    globalThis.localStorage.setItem("rows", "{not json");

    expect(await createStore<Row>("local", "rows").read()).to.deep.equal([]);
  });

  it("ignores persisted data that is not an array", async () => {
    globalThis.localStorage.setItem("rows", JSON.stringify({ id: "a" }));

    expect(await createStore<Row>("local", "rows").read()).to.deep.equal([]);
  });

  describe("unavailable backends", () => {
    it("knows IndexedDB is missing under jsdom", () => {
      expect(isIndexedDbAvailable()).to.equal(false);
      expect(isStorageAvailable("indexed")).to.equal(false);
    });

    it("falls back to memory while remembering what was asked for", async () => {
      const store = createStore<Row>("indexed", "rows");

      expect(store.kind).to.equal("state");
      expect(store.requestedKind).to.equal("indexed");

      await store.write(ROWS);

      expect(await store.read()).to.deep.equal(ROWS);
    });
  });
});
