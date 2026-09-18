import { expect } from "chai";

import "@/components/ui/ui-card.ts";
import type { UiCard } from "@/components/ui/ui-card.ts";
import {
  click,
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

const surfaceOf = (card: UiCard) => queryRequired<HTMLElement>(card, ".card");

async function withSlot(card: UiCard, slot: string, tag = "span") {
  const node = document.createElement(tag);

  node.setAttribute("slot", slot);
  node.textContent = "x";
  card.append(node);

  await card.updateComplete;
  await card.updateComplete;

  return node;
}

describe("<ui-card>", () => {
  describe("structure", () => {
    it("renders a plain surface with no interactive role", async () => {
      const card = await mount<UiCard>("ui-card");
      const surface = surfaceOf(card);

      expect(surface.tagName).to.equal("DIV");
      expect(surface.hasAttribute("role")).to.equal(false);
      expect(surface.hasAttribute("tabindex")).to.equal(false);
    });

    it("renders the heading and subheading", async () => {
      const card = await mount<UiCard>("ui-card", {
        heading: "Ada Lovelace",
        subheading: "Principal Engineer",
      });

      expect(text(query(card, ".heading"))).to.equal("Ada Lovelace");
      expect(text(query(card, ".subheading"))).to.equal("Principal Engineer");
    });

    it("uses a real h3 for the heading", async () => {
      const card = await mount<UiCard>("ui-card", { heading: "Team" });

      expect(queryRequired(card, ".heading").tagName).to.equal("H3");
    });

    it("omits the heading elements when nothing was given", async () => {
      const card = await mount<UiCard>("ui-card");

      expect(query(card, ".heading")).to.equal(null);
      expect(query(card, ".subheading")).to.equal(null);
    });

    it("hides the header region until it has something to show", async () => {
      const card = await mount<UiCard>("ui-card");

      expect(queryRequired<HTMLElement>(card, ".header").hidden).to.equal(true);

      await update(card, { heading: "Team" });

      expect(queryRequired<HTMLElement>(card, ".header").hidden).to.equal(false);
    });

    it("renders a badge", async () => {
      const card = await mount<UiCard>("ui-card", { badge: "New" });

      expect(text(query(card, ".badge"))).to.equal("New");
    });

    it("hides the media and footer regions until they are filled", async () => {
      const card = await mount<UiCard>("ui-card");

      expect(queryRequired<HTMLElement>(card, ".media").hidden).to.equal(true);
      expect(queryRequired<HTMLElement>(card, ".footer").hidden).to.equal(true);

      await withSlot(card, "footer");

      expect(queryRequired<HTMLElement>(card, ".footer").hidden).to.equal(false);
    });

    it("shows the icon frame once an icon is slotted", async () => {
      const card = await mount<UiCard>("ui-card");

      expect(queryRequired<HTMLElement>(card, ".icon-wrap").hidden).to.equal(
        true,
      );

      await withSlot(card, "icon");

      expect(queryRequired<HTMLElement>(card, ".icon-wrap").hidden).to.equal(
        false,
      );
    });

    it("ignores whitespace-only slotted content", async () => {
      const card = await mount<UiCard>("ui-card");

      card.append(document.createTextNode("   "));
      await card.updateComplete;
      await card.updateComplete;

      expect(queryRequired<HTMLElement>(card, ".footer").hidden).to.equal(true);
    });
  });

  describe("appearance", () => {
    it("applies the variant, orientation and state classes", async () => {
      const card = await mount<UiCard>("ui-card", {
        variant: "outlined",
        orientation: "horizontal",
        selected: true,
        dividers: true,
      });

      const className = surfaceOf(card).className;

      expect(className).to.contain("outlined");
      expect(className).to.contain("horizontal");
      expect(className).to.contain("selected");
      expect(className).to.contain("dividers");
    });

    it("defaults to an elevated vertical card", async () => {
      const card = await mount<UiCard>("ui-card");
      const className = surfaceOf(card).className;

      expect(className).to.contain("elevated");
      expect(className).to.contain("vertical");
      expect(className).to.not.contain("selected");
    });
  });

  describe("interactive card", () => {
    it("takes a button role and focus when clickable", async () => {
      const card = await mount<UiCard>("ui-card", { clickable: true });
      const surface = surfaceOf(card);

      expect(surface.getAttribute("role")).to.equal("button");
      expect(surface.getAttribute("tabindex")).to.equal("0");
      expect(card.interactive).to.equal(true);
    });

    it("emits card-click when pressed", async () => {
      const card = await mount<UiCard>("ui-card", { clickable: true });
      const events = recordEvents(card, "card-click");

      click(surfaceOf(card));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.composed).to.equal(true);
    });

    it("activates on Enter and Space", async () => {
      const card = await mount<UiCard>("ui-card", { clickable: true });
      const events = recordEvents(card, "card-click");

      for (const key of ["Enter", " "]) {
        surfaceOf(card).dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        );
      }

      expect(events).to.have.lengthOf(2);
    });

    it("ignores other keys", async () => {
      const card = await mount<UiCard>("ui-card", { clickable: true });
      const events = recordEvents(card, "card-click");

      surfaceOf(card).dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true }),
      );

      expect(events).to.have.lengthOf(0);
    });

    it("stays silent when it is not clickable", async () => {
      const card = await mount<UiCard>("ui-card");
      const events = recordEvents(card, "card-click");

      click(surfaceOf(card));

      expect(events).to.have.lengthOf(0);
    });

    it("reports the selected state to assistive technology", async () => {
      const card = await mount<UiCard>("ui-card", {
        clickable: true,
        selected: true,
      });

      expect(surfaceOf(card).getAttribute("aria-pressed")).to.equal("true");
    });
  });

  describe("link card", () => {
    it("renders an anchor when given an href", async () => {
      const card = await mount<UiCard>("ui-card", { href: "/team/ada" });
      const surface = surfaceOf(card);

      expect(surface.tagName).to.equal("A");
      expect(surface.getAttribute("href")).to.equal("/team/ada");
    });

    it("guards against tab-nabbing on new-tab links", async () => {
      const card = await mount<UiCard>("ui-card", {
        href: "https://example.com",
        target: "_blank",
      });

      expect(surfaceOf(card).getAttribute("rel")).to.equal(
        "noopener noreferrer",
      );
    });

    it("adds no rel for same-tab links", async () => {
      const card = await mount<UiCard>("ui-card", { href: "/team" });

      expect(surfaceOf(card).hasAttribute("rel")).to.equal(false);
    });

    it("falls back to a plain surface when disabled", async () => {
      const card = await mount<UiCard>("ui-card", {
        href: "/team",
        disabled: true,
      });

      expect(surfaceOf(card).tagName).to.equal("DIV");
      expect(card.interactive).to.equal(false);
    });
  });

  describe("disabled", () => {
    it("marks itself disabled and drops out of the tab order", async () => {
      const card = await mount<UiCard>("ui-card", {
        clickable: true,
        disabled: true,
      });
      const surface = surfaceOf(card);

      expect(surface.getAttribute("aria-disabled")).to.equal("true");
      expect(surface.getAttribute("tabindex")).to.equal("-1");
      expect(surface.className).to.contain("disabled");
    });

    it("refuses to emit card-click", async () => {
      const card = await mount<UiCard>("ui-card", {
        clickable: true,
        disabled: true,
      });
      const events = recordEvents(card, "card-click");

      click(surfaceOf(card));

      expect(events).to.have.lengthOf(0);
    });
  });

  describe("loading", () => {
    it("shows no loading layer by default", async () => {
      const card = await mount<UiCard>("ui-card");

      expect(query(card, ".loading-layer")).to.equal(null);
      expect(surfaceOf(card).hasAttribute("aria-busy")).to.equal(false);
    });

    it("covers the card and announces itself as busy", async () => {
      const card = await mount<UiCard>("ui-card", { loading: true });

      expect(query(card, ".loading-layer")).to.not.equal(null);
      expect(query(card, "app-loading")).to.not.equal(null);
      expect(surfaceOf(card).getAttribute("aria-busy")).to.equal("true");
    });

    it("passes its loading label through", async () => {
      const card = await mount<UiCard>("ui-card", {
        loading: true,
        loadingLabel: "Saving employee",
      });

      const spinner = queryRequired(card, "app-loading");

      expect((spinner as { label?: string }).label).to.equal("Saving employee");
    });

    it("refuses to emit card-click while loading", async () => {
      const card = await mount<UiCard>("ui-card", {
        clickable: true,
        loading: true,
      });
      const events = recordEvents(card, "card-click");

      click(surfaceOf(card));

      expect(events).to.have.lengthOf(0);
    });

    it("clears the layer once loading finishes", async () => {
      const card = await mount<UiCard>("ui-card", { loading: true });

      await update(card, { loading: false });

      expect(query(card, ".loading-layer")).to.equal(null);
    });
  });
});

describe("<ui-card> style hooks", () => {
  it("reflects the properties its :host styles key off", async () => {
    const card = await mount<UiCard>("ui-card", {
      variant: "filled",
      padding: "large",
      orientation: "horizontal",
      tone: "success",
      fullHeight: true,
    });

    expect(card.getAttribute("variant")).to.equal("filled");
    expect(card.getAttribute("padding")).to.equal("large");
    expect(card.getAttribute("orientation")).to.equal("horizontal");
    expect(card.getAttribute("tone")).to.equal("success");
    expect(card.hasAttribute("full-height")).to.equal(true);
  });

  it("keeps the accent bar off a default-tone card", async () => {
    const card = await mount<UiCard>("ui-card");

    expect(card.getAttribute("tone")).to.equal("default");
  });
});
