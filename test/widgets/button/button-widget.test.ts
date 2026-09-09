import { expect } from "chai";

import "../../../src/widgets/button/button-widget.ts";
import type { ButtonWidget } from "../../../src/widgets/button/button-widget.ts";
import type { UiButton } from "../../../src/components/ui/ui-button.ts";
import type { GalleryLog } from "../../../src/components/gallery/gallery-log.ts";
import { buttonWidgetDefinition } from "../../../src/widgets/button/button-widget.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
} from "../../helpers/dom.ts";

const buttonsOf = (widget: ButtonWidget) =>
  queryAll<UiButton>(widget, "ui-button");

const logEntries = (widget: ButtonWidget) =>
  queryAll(queryRequired<GalleryLog>(widget, "gallery-log"), ".entry").map(
    text,
  );

const buttonLabelled = (widget: ButtonWidget, label: string) => {
  const found = buttonsOf(widget).find(
    (button) => text(button) === label,
  );

  if (!found) {
    throw new Error(`No ui-button labelled "${label}" on the page.`);
  }

  return found;
};

async function press(widget: ButtonWidget, button: UiButton) {
  click(queryRequired<HTMLButtonElement>(button, "button"));

  await widget.updateComplete;
}

describe("<button-widget>", () => {
  describe("the page", () => {
    it("states the address it answers on", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      const page = queryRequired(widget, "gallery-page");

      expect(page.getAttribute("address")).to.equal("app://button");
    });

    it("shows a demo card per facet of the button", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      const labels = queryAll(widget, "gallery-demo").map((demo) =>
        demo.getAttribute("label"),
      );

      expect(labels).to.deep.equal([
        "Variants",
        "Sizes",
        "Shapes",
        "States",
        "Icons",
        "Full width",
        "Events",
      ]);
    });

    it("renders every variant as a live button", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      const variants = buttonsOf(widget)
        .slice(0, 5)
        .map((button) => button.variant);

      expect(variants).to.deep.equal([
        "primary",
        "secondary",
        "danger",
        "success",
        "ghost",
      ]);
    });

    it("uses the full-width attribute, which is what ui-button styles from", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      expect(queryRequired(widget, "ui-button[full-width]")).to.not.equal(null);
    });

    it("puts the slot on the svg itself, so ui-button can size it", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      expect(query(widget, 'svg[slot="icon"]')).to.not.equal(null);
      expect(query(widget, 'svg[slot="icon-only"]')).to.not.equal(null);
    });
  });

  describe("the event log", () => {
    it("starts empty", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      expect(logEntries(widget)).to.deep.equal([]);
    });

    it("records a click on any example", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      await press(widget, buttonLabelled(widget, "primary"));

      expect(logEntries(widget)).to.deep.equal(['button-click from "primary"']);
    });

    it("puts the newest click first", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      await press(widget, buttonLabelled(widget, "primary"));
      await press(widget, buttonLabelled(widget, "danger"));

      expect(logEntries(widget)[0]).to.equal('button-click from "danger"');
    });

    it("stays quiet for a disabled button", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      await press(widget, buttonLabelled(widget, "Disabled"));

      expect(logEntries(widget)).to.deep.equal([]);
    });

    it("stays quiet for a loading button", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      await press(widget, buttonLabelled(widget, "Loading"));

      expect(logEntries(widget)).to.deep.equal([]);
    });

    it("keeps the log short rather than growing without bound", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      for (let index = 0; index < 10; index += 1) {
        await press(widget, buttonLabelled(widget, "primary"));
      }

      expect(logEntries(widget)).to.have.lengthOf(6);
    });
  });

  describe("event containment", () => {
    it("keeps button-click from escaping into the shell", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      const escaped = recordEvents(document.body, "button-click");

      await press(widget, buttonLabelled(widget, "primary"));

      expect(escaped).to.have.lengthOf(0);
    });
  });

  describe("its widget definition", () => {
    it("answers on app://button", () => {
      expect(buttonWidgetDefinition.id).to.equal("button");
    });

    it("renders the element the shell will mount", async () => {
      const widget = await mount<ButtonWidget>("button-widget");

      expect(widget.localName).to.equal("button-widget");
      expect(buttonWidgetDefinition.title).to.equal("Button");
    });
  });
});
