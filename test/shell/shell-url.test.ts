import { expect } from "chai";

import {
  APP_PROTOCOL,
  NEW_TAB_URL,
  isNewTabUrl,
  normalizeUrl,
  widgetIdFromUrl,
  widgetUrl,
} from "../../src/shell/shell-url.ts";

describe("shell-url", () => {
  describe("widgetUrl", () => {
    it("addresses a widget by its id", () => {
      expect(widgetUrl("employees")).to.equal("app://employees");
    });

    it("uses the shared protocol constant", () => {
      expect(widgetUrl("employees")).to.have.string(APP_PROTOCOL);
    });
  });

  describe("normalizeUrl", () => {
    it("adds the protocol to a bare widget id", () => {
      expect(normalizeUrl("employees")).to.equal("app://employees");
    });

    it("leaves an already complete address alone", () => {
      expect(normalizeUrl("app://employees")).to.equal("app://employees");
    });

    it("trims surrounding whitespace", () => {
      expect(normalizeUrl("  employees  ")).to.equal("app://employees");
    });

    it("lowercases the address", () => {
      expect(normalizeUrl("APP://Employees")).to.equal("app://employees");
    });

    it("drops a trailing slash", () => {
      expect(normalizeUrl("app://employees/")).to.equal("app://employees");
    });

    it("drops leading slashes left over from a half-typed protocol", () => {
      expect(normalizeUrl("//employees")).to.equal("app://employees");
    });

    it("falls back to the new tab page for an empty address", () => {
      expect(normalizeUrl("")).to.equal(NEW_TAB_URL);
      expect(normalizeUrl("   ")).to.equal(NEW_TAB_URL);
    });

    it("falls back to the new tab page for a bare protocol", () => {
      expect(normalizeUrl("app://")).to.equal(NEW_TAB_URL);
    });

    it("keeps an unknown host, so the shell can show a not-found page", () => {
      expect(normalizeUrl("nope")).to.equal("app://nope");
    });
  });

  describe("widgetIdFromUrl", () => {
    it("reads the widget id out of an app address", () => {
      expect(widgetIdFromUrl("app://employees")).to.equal("employees");
    });

    it("ignores a trailing slash", () => {
      expect(widgetIdFromUrl("app://employees/")).to.equal("employees");
    });

    it("returns null for a foreign protocol", () => {
      expect(widgetIdFromUrl("https://example.com")).to.equal(null);
    });

    it("returns null when there is no host", () => {
      expect(widgetIdFromUrl("app://")).to.equal(null);
    });
  });

  describe("isNewTabUrl", () => {
    it("recognises the new tab address", () => {
      expect(isNewTabUrl(NEW_TAB_URL)).to.equal(true);
    });

    it("does not mistake a widget for the new tab page", () => {
      expect(isNewTabUrl("app://employees")).to.equal(false);
    });
  });
});
