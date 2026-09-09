import { expect } from "chai";

import "../../src/shell/browser-shell.ts";
import type { BrowserShell } from "../../src/shell/browser-shell.ts";
import type { ShellTabStrip } from "../../src/shell/shell-tab-strip.ts";
import type { ShellToolbar } from "../../src/shell/shell-toolbar.ts";
import type { ShellNewTab } from "../../src/shell/shell-new-tab.ts";
import { NEW_TAB_URL } from "../../src/shell/shell-url.ts";
import { makeWidget, useWidgets } from "../helpers/widgets.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  text,
} from "../helpers/dom.ts";

const stripOf = (shell: BrowserShell) =>
  queryRequired<ShellTabStrip>(shell, "shell-tab-strip");

const toolbarOf = (shell: BrowserShell) =>
  queryRequired<ShellToolbar>(shell, "shell-toolbar");

const tabsOf = (shell: BrowserShell) => queryAll(stripOf(shell), ".tab");

const tabTitles = (shell: BrowserShell) =>
  tabsOf(shell).map((tab) => text(query(tab, ".tab-title")));

const activeTabTitle = (shell: BrowserShell) =>
  text(
    query(queryRequired(stripOf(shell), ".tab.active"), ".tab-title"),
  );

/** Panes stay mounted while hidden, so "visible" means the one without [hidden]. */
const panesOf = (shell: BrowserShell) => queryAll(shell, ".pane");

const visiblePane = (shell: BrowserShell) =>
  queryRequired(shell, ".pane:not([hidden])");

const addressOf = (shell: BrowserShell) =>
  queryRequired<HTMLInputElement>(toolbarOf(shell), ".address-input").value;

async function pressTabButton(shell: BrowserShell, selector: string) {
  click(queryRequired<HTMLButtonElement>(stripOf(shell), selector));

  await shell.updateComplete;
}

async function pressToolbarButton(shell: BrowserShell, label: string) {
  click(
    queryRequired<HTMLButtonElement>(
      toolbarOf(shell),
      `.nav-button[aria-label="${label}"]`,
    ),
  );

  await shell.updateComplete;
}

async function typeAddress(shell: BrowserShell, value: string) {
  const toolbar = toolbarOf(shell);
  const input = queryRequired<HTMLInputElement>(toolbar, ".address-input");

  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

  queryRequired<HTMLFormElement>(toolbar, ".address").dispatchEvent(
    new Event("submit", { bubbles: true, composed: true, cancelable: true }),
  );

  await shell.updateComplete;
  await toolbar.updateComplete;
}

async function selectTab(shell: BrowserShell, index: number) {
  click(queryRequired<HTMLButtonElement>(tabsOf(shell)[index]!, ".tab-button"));

  await shell.updateComplete;
}

async function closeTab(shell: BrowserShell, index: number) {
  click(queryRequired<HTMLButtonElement>(tabsOf(shell)[index]!, ".tab-close"));

  await shell.updateComplete;
}

describe("<browser-shell>", () => {
  useWidgets([makeWidget("employees"), makeWidget("reports")]);

  describe("initial state", () => {
    it("opens a single tab on the first registered widget", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(tabTitles(shell)).to.deep.equal(["Employees"]);
      expect(addressOf(shell)).to.equal("app://employees");
    });

    it("shows that widget in the viewport", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(query(visiblePane(shell), "stub-widget-employees")).to.not.equal(
        null,
      );
    });

    it("has nowhere to go back or forward to", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(toolbarOf(shell).canGoBack).to.equal(false);
      expect(toolbarOf(shell).canGoForward).to.equal(false);
    });
  });

  describe("opening tabs", () => {
    it("adds a new tab on the launcher and activates it", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");

      expect(tabTitles(shell)).to.deep.equal(["Employees", "New tab"]);
      expect(activeTabTitle(shell)).to.equal("New tab");
      expect(addressOf(shell)).to.equal(NEW_TAB_URL);
    });

    it("lists every registered widget on the launcher", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");

      const launcher = queryRequired<ShellNewTab>(
        visiblePane(shell),
        "shell-new-tab",
      );

      expect(queryAll(launcher, ".tile-title").map(text)).to.deep.equal([
        "Employees",
        "Reports",
      ]);
    });

    it("opens the widget in that tab when a launcher tile is picked", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");

      const launcher = queryRequired<ShellNewTab>(
        visiblePane(shell),
        "shell-new-tab",
      );

      click(queryAll<HTMLButtonElement>(launcher, ".widget-tile")[1]!);
      await shell.updateComplete;

      expect(tabTitles(shell)).to.deep.equal(["Employees", "Reports"]);
      expect(addressOf(shell)).to.equal("app://reports");
      expect(query(visiblePane(shell), "stub-widget-reports")).to.not.equal(
        null,
      );
    });
  });

  describe("the address bar", () => {
    it("navigates the active tab", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "app://reports");

      expect(activeTabTitle(shell)).to.equal("Reports");
      expect(query(visiblePane(shell), "stub-widget-reports")).to.not.equal(
        null,
      );
    });

    it("accepts a bare widget id", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "reports");

      expect(addressOf(shell)).to.equal("app://reports");
    });

    it("shows a not-found page for an unknown address", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "nope");

      expect(activeTabTitle(shell)).to.equal("Address not found");

      const page = queryRequired<ShellNewTab>(
        visiblePane(shell),
        "shell-new-tab",
      );

      expect(text(query(page, ".launcher-heading"))).to.equal(
        "Address not found",
      );
      expect(text(query(page, ".launcher-message"))).to.have.string(
        "app://nope",
      );
    });

    it("flags an unknown address in the toolbar", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(toolbarOf(shell).resolved).to.equal(true);

      await typeAddress(shell, "nope");

      expect(toolbarOf(shell).resolved).to.equal(false);
    });

    it("offers the registered widgets as a way out of a not-found page", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "nope");

      const page = queryRequired<ShellNewTab>(
        visiblePane(shell),
        "shell-new-tab",
      );

      click(queryAll<HTMLButtonElement>(page, ".widget-tile")[0]!);
      await shell.updateComplete;

      expect(activeTabTitle(shell)).to.equal("Employees");
    });
  });

  describe("history", () => {
    it("goes back to the previous address", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "reports");
      await pressToolbarButton(shell, "Back");

      expect(addressOf(shell)).to.equal("app://employees");
      expect(toolbarOf(shell).canGoForward).to.equal(true);
    });

    it("goes forward again", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "reports");
      await pressToolbarButton(shell, "Back");
      await pressToolbarButton(shell, "Forward");

      expect(addressOf(shell)).to.equal("app://reports");
    });

    it("disables the buttons at the ends of the history", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      const backButton = queryRequired<HTMLButtonElement>(
        toolbarOf(shell),
        '.nav-button[aria-label="Back"]',
      );

      expect(backButton.disabled).to.equal(true);

      await typeAddress(shell, "reports");

      expect(
        queryRequired<HTMLButtonElement>(
          toolbarOf(shell),
          '.nav-button[aria-label="Back"]',
        ).disabled,
      ).to.equal(false);
    });

    it("keeps each tab's history to itself", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await typeAddress(shell, "reports");
      await pressTabButton(shell, ".new-tab");

      expect(toolbarOf(shell).canGoBack).to.equal(false);

      await selectTab(shell, 0);

      expect(toolbarOf(shell).canGoBack).to.equal(true);
    });
  });

  describe("reload", () => {
    it("stays on the same address", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressToolbarButton(shell, "Reload");

      expect(addressOf(shell)).to.equal("app://employees");
    });

    it("builds a fresh widget element", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      const before = query(visiblePane(shell), "stub-widget-employees");

      await pressToolbarButton(shell, "Reload");

      const after = query(visiblePane(shell), "stub-widget-employees");

      expect(after).to.not.equal(null);
      expect(after).to.not.equal(before);
    });
  });

  describe("switching tabs", () => {
    async function shellWithTwo() {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");
      await typeAddress(shell, "reports");

      return shell;
    }

    it("shows exactly one pane at a time", async () => {
      const shell = await shellWithTwo();

      expect(panesOf(shell)).to.have.lengthOf(2);
      expect(queryAll(shell, ".pane:not([hidden])")).to.have.lengthOf(1);
    });

    it("keeps the inactive tab mounted, so its widget keeps its state", async () => {
      const shell = await shellWithTwo();

      const employeeWidget = query(panesOf(shell)[0]!, "stub-widget-employees");

      expect(employeeWidget).to.not.equal(null);

      await selectTab(shell, 0);

      expect(query(panesOf(shell)[0]!, "stub-widget-employees")).to.equal(
        employeeWidget,
      );
    });

    it("moves the address bar to the selected tab", async () => {
      const shell = await shellWithTwo();

      await selectTab(shell, 0);

      expect(addressOf(shell)).to.equal("app://employees");
      expect(activeTabTitle(shell)).to.equal("Employees");
    });
  });

  describe("closing tabs", () => {
    async function shellWithThree() {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");
      await typeAddress(shell, "reports");
      await pressTabButton(shell, ".new-tab");

      return shell;
    }

    it("removes the tab", async () => {
      const shell = await shellWithThree();

      await closeTab(shell, 1);

      expect(tabTitles(shell)).to.deep.equal(["Employees", "New tab"]);
    });

    it("leaves the active tab alone when closing another", async () => {
      const shell = await shellWithThree();

      await closeTab(shell, 0);

      expect(activeTabTitle(shell)).to.equal("New tab");
    });

    it("activates the neighbour when closing the active tab", async () => {
      const shell = await shellWithThree();

      await selectTab(shell, 1);
      await closeTab(shell, 1);

      expect(activeTabTitle(shell)).to.equal("New tab");
    });

    it("opens a fresh tab rather than leaving nothing behind", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await closeTab(shell, 0);

      expect(tabTitles(shell)).to.deep.equal(["New tab"]);
      expect(addressOf(shell)).to.equal(NEW_TAB_URL);
    });
  });

  describe("accessibility", () => {
    it("marks the strip up as a tablist", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(queryRequired(stripOf(shell), ".strip").getAttribute("role")).to.equal(
        "tablist",
      );
    });

    it("marks the active tab as selected", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await pressTabButton(shell, ".new-tab");

      const selected = queryAll(stripOf(shell), '[role="tab"]').map((tab) =>
        tab.getAttribute("aria-selected"),
      );

      expect(selected).to.deep.equal(["false", "true"]);
    });

    it("names each close button after its tab", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      expect(
        queryRequired(tabsOf(shell)[0]!, ".tab-close").getAttribute(
          "aria-label",
        ),
      ).to.equal("Close Employees");
    });
  });

  describe("event containment", () => {
    it("keeps its chrome events out of the host document", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      const escaped: string[] = [];

      for (const type of [
        "tab-select",
        "tab-close",
        "tab-new",
        "navigate",
        "navigate-back",
        "reload",
        "open-widget",
      ]) {
        document.body.addEventListener(type, () => escaped.push(type));
      }

      await pressTabButton(shell, ".new-tab");
      await typeAddress(shell, "reports");
      await pressToolbarButton(shell, "Back");
      await pressToolbarButton(shell, "Reload");
      await selectTab(shell, 0);
      await closeTab(shell, 1);

      expect(escaped).to.deep.equal([]);
    });
  });
});
