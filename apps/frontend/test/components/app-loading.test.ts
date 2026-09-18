import { expect } from "chai";

import "@/components/shared/app-loading.ts";
import type { AppLoading } from "@/components/shared/app-loading.ts";
import { mount, query, queryAll, queryRequired, text, update } from "../helpers/dom.ts";

const rootOf = (host: AppLoading) => query(host, ".root");

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("<app-loading>", () => {
  describe("variants", () => {
    it("shows a spinning ring by default", async () => {
      const host = await mount<AppLoading>("app-loading");

      expect(host.variant).to.equal("spinner");
      expect(query(host, "svg.ring")).to.not.equal(null);
    });

    it("shows three dots", async () => {
      const host = await mount<AppLoading>("app-loading", { variant: "dots" });

      expect(queryAll(host, ".dot")).to.have.lengthOf(3);
    });

    it("shows a bar", async () => {
      const host = await mount<AppLoading>("app-loading", { variant: "bar" });

      expect(query(host, ".bar-fill")).to.not.equal(null);
    });

    it("shows a pulse", async () => {
      const host = await mount<AppLoading>("app-loading", { variant: "pulse" });

      expect(query(host, ".pulse")).to.not.equal(null);
    });

    it("shows the requested number of skeleton lines", async () => {
      const host = await mount<AppLoading>("app-loading", {
        variant: "skeleton",
        lines: 5,
      });

      expect(queryAll(host, ".skeleton-line")).to.have.lengthOf(5);

      await update(host, { lines: 2 });

      expect(queryAll(host, ".skeleton-line")).to.have.lengthOf(2);
    });

    it("never renders fewer than one skeleton line", async () => {
      const host = await mount<AppLoading>("app-loading", {
        variant: "skeleton",
        lines: 0,
      });

      expect(queryAll(host, ".skeleton-line")).to.have.lengthOf(1);
    });

    it("swaps variants without leaving the old one behind", async () => {
      const host = await mount<AppLoading>("app-loading", { variant: "dots" });

      expect(query(host, ".dot")).to.not.equal(null);

      await update(host, { variant: "pulse" });

      expect(query(host, ".dot")).to.equal(null);
      expect(query(host, ".pulse")).to.not.equal(null);
    });
  });

  describe("determinate progress", () => {
    it("stays indeterminate when no progress is given", async () => {
      const host = await mount<AppLoading>("app-loading", { variant: "bar" });

      expect(host.clampedProgress).to.equal(null);
      expect(
        queryRequired(host, ".bar-fill").className,
      ).to.not.contain("determinate");
      expect(rootOf(host)!.hasAttribute("aria-valuenow")).to.equal(false);
    });

    it("fills the bar to the given percentage", async () => {
      const host = await mount<AppLoading>("app-loading", {
        variant: "bar",
        progress: 40,
      });

      const fill = queryRequired<HTMLElement>(host, ".bar-fill");

      expect(fill.className).to.contain("determinate");
      expect(fill.style.width).to.equal("40%");
      expect(rootOf(host)!.getAttribute("aria-valuenow")).to.equal("40");
      expect(rootOf(host)!.getAttribute("aria-valuemax")).to.equal("100");
    });

    it("clamps out-of-range progress", async () => {
      const host = await mount<AppLoading>("app-loading", {
        variant: "bar",
        progress: 140,
      });

      expect(host.clampedProgress).to.equal(100);

      await update(host, { progress: -20 });

      expect(host.clampedProgress).to.equal(0);
    });

    it("ignores a progress value that is not a number", async () => {
      const host = await mount<AppLoading>("app-loading", {
        variant: "bar",
        progress: Number.NaN,
      });

      expect(host.clampedProgress).to.equal(null);
    });
  });

  describe("delay", () => {
    it("renders straight away with no delay", async () => {
      const host = await mount<AppLoading>("app-loading");

      expect(host.visible).to.equal(true);
      expect(rootOf(host)).to.not.equal(null);
    });

    it("stays blank until the delay elapses", async () => {
      const host = await mount<AppLoading>("app-loading", { delay: 60 });

      expect(host.visible).to.equal(false);
      expect(rootOf(host)).to.equal(null);

      await wait(90);
      await host.updateComplete;

      expect(host.visible).to.equal(true);
      expect(rootOf(host)).to.not.equal(null);
    });
  });

  describe("active", () => {
    it("renders nothing when switched off", async () => {
      const host = await mount<AppLoading>("app-loading", { active: false });

      expect(host.visible).to.equal(false);
      expect(rootOf(host)).to.equal(null);
    });

    it("comes back when switched on again", async () => {
      const host = await mount<AppLoading>("app-loading", { active: false });

      await update(host, { active: true });

      expect(rootOf(host)).to.not.equal(null);
    });
  });

  describe("labelling", () => {
    it("hides the label from sight but keeps it for screen readers", async () => {
      const host = await mount<AppLoading>("app-loading", {
        label: "Fetching employees",
      });

      expect(text(query(host, ".visually-hidden"))).to.equal(
        "Fetching employees",
      );
      expect(query(host, ".label")).to.equal(null);
      expect(rootOf(host)!.getAttribute("aria-label")).to.equal(
        "Fetching employees",
      );
    });

    it("shows the label when asked", async () => {
      const host = await mount<AppLoading>("app-loading", {
        label: "Saving",
        hideLabel: false,
      });

      expect(text(query(host, ".label"))).to.equal("Saving");
      expect(query(host, ".visually-hidden")).to.equal(null);
    });

    it("announces itself politely as a busy status", async () => {
      const host = await mount<AppLoading>("app-loading");
      const root = rootOf(host)!;

      expect(root.getAttribute("role")).to.equal("status");
      expect(root.getAttribute("aria-live")).to.equal("polite");
      expect(root.getAttribute("aria-busy")).to.equal("true");
    });
  });

  describe("custom icon", () => {
    it("replaces the built-in indicator", async () => {
      const host = await mount<AppLoading>("app-loading");

      const icon = document.createElement("svg");
      icon.setAttribute("slot", "icon");
      host.append(icon);

      await host.updateComplete;
      await host.updateComplete;

      expect(query(host, "svg.ring")).to.equal(null);
      expect(query(host, "slot[name='icon']")).to.not.equal(null);
    });
  });
});

describe("<app-loading> style hooks", () => {
  it("reflects the properties its :host styles key off", async () => {
    const host = await mount<AppLoading>("app-loading", {
      variant: "dots",
      size: "large",
      tone: "inverse",
      inline: true,
      overlay: true,
    });

    expect(host.getAttribute("variant")).to.equal("dots");
    expect(host.getAttribute("size")).to.equal("large");
    expect(host.getAttribute("tone")).to.equal("inverse");
    expect(host.hasAttribute("inline")).to.equal(true);
    expect(host.hasAttribute("overlay")).to.equal(true);
  });

  it("drops a boolean attribute when the flag goes away", async () => {
    const host = await mount<AppLoading>("app-loading", { fullscreen: true });

    expect(host.hasAttribute("fullscreen")).to.equal(true);

    await update(host, { fullscreen: false });

    expect(host.hasAttribute("fullscreen")).to.equal(false);
  });
});
