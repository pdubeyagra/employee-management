import { expect } from "chai";

import { NEW_TAB_URL } from "../../src/shell/shell-url.ts";
import {
  canGoBack,
  canGoForward,
  closeTab,
  createTab,
  currentUrl,
  findTab,
  goBack,
  goForward,
  navigate,
  paneKey,
  reload,
  replaceTab,
  type ShellTab,
} from "../../src/shell/tab-model.ts";

const tabAt = (id: string, ...urls: string[]): ShellTab =>
  urls.reduce((tab, url) => navigate(tab, url), createTab(id, urls[0]));

describe("tab-model", () => {
  describe("createTab", () => {
    it("opens on the new tab page by default", () => {
      expect(currentUrl(createTab("t1"))).to.equal(NEW_TAB_URL);
    });

    it("opens on the given address", () => {
      expect(currentUrl(createTab("t1", "app://employees"))).to.equal(
        "app://employees",
      );
    });

    it("starts with nowhere to go back or forward to", () => {
      const tab = createTab("t1");

      expect(canGoBack(tab)).to.equal(false);
      expect(canGoForward(tab)).to.equal(false);
    });
  });

  describe("navigate", () => {
    it("moves to the new address", () => {
      const tab = navigate(createTab("t1"), "app://employees");

      expect(currentUrl(tab)).to.equal("app://employees");
    });

    it("records the previous address in history", () => {
      const tab = navigate(createTab("t1"), "app://employees");

      expect(canGoBack(tab)).to.equal(true);
      expect(currentUrl(goBack(tab))).to.equal(NEW_TAB_URL);
    });

    it("does nothing when already at that address", () => {
      const tab = navigate(createTab("t1"), "app://employees");

      expect(navigate(tab, "app://employees")).to.equal(tab);
    });

    it("discards the forward history", () => {
      const tab = tabAt("t1", "app://a", "app://b", "app://c");
      const rewound = goBack(goBack(tab));

      expect(canGoForward(rewound)).to.equal(true);

      const branched = navigate(rewound, "app://d");

      expect(canGoForward(branched)).to.equal(false);
      expect(currentUrl(branched)).to.equal("app://d");
      expect(currentUrl(goBack(branched))).to.equal("app://a");
    });

    it("leaves the original tab untouched", () => {
      const tab = createTab("t1");

      navigate(tab, "app://employees");

      expect(currentUrl(tab)).to.equal(NEW_TAB_URL);
    });
  });

  describe("back and forward", () => {
    it("walks the history in both directions", () => {
      const tab = tabAt("t1", "app://a", "app://b", "app://c");

      expect(currentUrl(goBack(tab))).to.equal("app://b");
      expect(currentUrl(goForward(goBack(tab)))).to.equal("app://c");
    });

    it("stops at the start of the history", () => {
      const tab = createTab("t1");

      expect(goBack(tab)).to.equal(tab);
    });

    it("stops at the end of the history", () => {
      const tab = navigate(createTab("t1"), "app://a");

      expect(goForward(tab)).to.equal(tab);
    });
  });

  describe("reload", () => {
    it("keeps the address but changes the pane key, forcing a remount", () => {
      const tab = navigate(createTab("t1"), "app://employees");
      const reloaded = reload(tab);

      expect(currentUrl(reloaded)).to.equal(currentUrl(tab));
      expect(paneKey(reloaded)).to.not.equal(paneKey(tab));
    });
  });

  describe("paneKey", () => {
    it("is stable while the tab stays put", () => {
      const tab = createTab("t1", "app://employees");

      expect(paneKey(tab)).to.equal(paneKey({ ...tab }));
    });

    it("changes when the tab navigates", () => {
      const tab = createTab("t1", "app://a");

      expect(paneKey(navigate(tab, "app://b"))).to.not.equal(paneKey(tab));
    });

    it("differs between tabs sitting on the same address", () => {
      expect(paneKey(createTab("t1", "app://a"))).to.not.equal(
        paneKey(createTab("t2", "app://a")),
      );
    });
  });

  describe("replaceTab and findTab", () => {
    it("swaps only the matching tab", () => {
      const tabs = [createTab("t1"), createTab("t2")];
      const updated = navigate(tabs[1]!, "app://employees");

      const result = replaceTab(tabs, updated);

      expect(result[0]).to.equal(tabs[0]);
      expect(result[1]).to.equal(updated);
    });

    it("finds a tab by id", () => {
      const tabs = [createTab("t1"), createTab("t2")];

      expect(findTab(tabs, "t2")).to.equal(tabs[1]);
      expect(findTab(tabs, "missing")).to.equal(undefined);
    });
  });

  describe("closeTab", () => {
    const three = () => [createTab("t1"), createTab("t2"), createTab("t3")];

    it("removes the tab", () => {
      const result = closeTab(three(), "t2", "t1");

      expect(result.tabs.map((tab) => tab.id)).to.deep.equal(["t1", "t3"]);
    });

    it("keeps the active tab when closing another one", () => {
      expect(closeTab(three(), "t3", "t1").activeId).to.equal("t1");
    });

    it("activates the right-hand neighbour when closing the active tab", () => {
      expect(closeTab(three(), "t2", "t2").activeId).to.equal("t3");
    });

    it("falls back to the left when the active tab was last", () => {
      expect(closeTab(three(), "t3", "t3").activeId).to.equal("t2");
    });

    it("reports no active tab once the last one closes", () => {
      const result = closeTab([createTab("t1")], "t1", "t1");

      expect(result.tabs).to.deep.equal([]);
      expect(result.activeId).to.equal(null);
    });

    it("ignores an unknown tab id", () => {
      const tabs = three();
      const result = closeTab(tabs, "missing", "t1");

      expect(result.tabs).to.equal(tabs);
      expect(result.activeId).to.equal("t1");
    });
  });
});
