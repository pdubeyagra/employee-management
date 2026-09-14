import "global-jsdom/register";

import { cleanupFixtures } from "./helpers/dom.ts";
import { resetMemoryStores } from "@/storage/memory-store.ts";

const eventConstructors = [
  "Event",
  "EventTarget",
  "CustomEvent",
  "MessageEvent",
] as const;

for (const name of eventConstructors) {
  const implementation = (window as unknown as Record<string, unknown>)[name];

  if (implementation) {
    Object.defineProperty(globalThis, name, {
      value: implementation,
      configurable: true,
      writable: true,
    });
  }
}

export const mochaHooks = {
  afterEach() {
    cleanupFixtures();
    resetMemoryStores();

    try {
      globalThis.localStorage?.clear();
      globalThis.sessionStorage?.clear();
    } catch {
      return;
    }
  },
};
