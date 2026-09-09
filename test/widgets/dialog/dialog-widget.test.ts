import { expect } from "chai";

import "../../../src/widgets/dialog/dialog-widget.ts";
import type { DialogWidget } from "../../../src/widgets/dialog/dialog-widget.ts";
import { dialogWidgetDefinition } from "../../../src/widgets/dialog/dialog-widget.ts";
import type { UiButton } from "../../../src/components/ui/ui-button.ts";
import type { UiDialog } from "../../../src/components/ui/ui-dialog.ts";
import type { GalleryLog } from "../../../src/components/gallery/gallery-log.ts";
import {
  click,
  mount,
  queryAll,
  queryRequired,
  recordEvents,
  text,
} from "../../helpers/dom.ts";

const dialogOf = (widget: DialogWidget) =>
  queryRequired<UiDialog>(widget, "ui-dialog");

const logEntries = (widget: DialogWidget) =>
  queryAll(queryRequired<GalleryLog>(widget, "gallery-log"), ".entry").map(
    text,
  );

const openButton = (widget: DialogWidget, label: string) => {
  const found = queryAll<UiButton>(widget, "ui-button").find(
    (button) => text(button) === label,
  );

  if (!found) {
    throw new Error(`No ui-button labelled "${label}".`);
  }

  return found;
};

async function press(widget: DialogWidget, button: UiButton) {
  click(queryRequired<HTMLButtonElement>(button, "button"));

  await widget.updateComplete;
}

async function toggleOption(widget: DialogWidget, index: number) {
  const checkbox = queryAll<HTMLInputElement>(widget, 'input[type="checkbox"]')[
    index
  ]!;

  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));

  await widget.updateComplete;
}

describe("<dialog-widget>", () => {
  describe("the page", () => {
    it("states the address it answers on", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      expect(
        queryRequired(widget, "gallery-page").getAttribute("address"),
      ).to.equal("app://dialog");
    });

    it("starts with the dialog closed", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      expect(dialogOf(widget).open).to.equal(false);
    });
  });

  describe("opening", () => {
    it("opens the dialog at the chosen size", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await press(widget, openButton(widget, "Open large"));

      expect(dialogOf(widget).open).to.equal(true);
      expect(dialogOf(widget).size).to.equal("large");
    });

    it("records the opening in the log", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await press(widget, openButton(widget, "Open small"));

      expect(logEntries(widget)[0]).to.equal('opened at size "small"');
    });

    it("reopens at a different size", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await press(widget, openButton(widget, "Open small"));
      await press(widget, openButton(widget, "Open medium"));

      expect(dialogOf(widget).size).to.equal("medium");
    });
  });

  describe("closing", () => {
    it("closes when the dialog reports dialog-close", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await press(widget, openButton(widget, "Open medium"));

      dialogOf(widget).dispatchEvent(new CustomEvent("dialog-close"));
      await widget.updateComplete;

      expect(dialogOf(widget).open).to.equal(false);
      expect(logEntries(widget)[0]).to.equal("dialog-close");
    });

    it("closes from the footer button", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await press(widget, openButton(widget, "Open medium"));
      await press(widget, openButton(widget, "Close"));

      expect(dialogOf(widget).open).to.equal(false);
      expect(logEntries(widget)[0]).to.equal("closed from the footer");
    });
  });

  describe("options", () => {
    it("passes hide-close through to the dialog", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await toggleOption(widget, 0);

      expect(dialogOf(widget).hideClose).to.equal(true);
    });

    it("passes disable-overlay-close through to the dialog", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      await toggleOption(widget, 1);

      expect(dialogOf(widget).disableOverlayClose).to.equal(true);
    });

    it("switches the dialog role", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      expect(dialogOf(widget).dialogRole).to.equal("dialog");

      await toggleOption(widget, 2);

      expect(dialogOf(widget).dialogRole).to.equal("alertdialog");
    });
  });

  describe("event containment", () => {
    it("keeps button-click from escaping into the shell", async () => {
      const widget = await mount<DialogWidget>("dialog-widget");

      const escaped = recordEvents(document.body, "button-click");

      await press(widget, openButton(widget, "Open medium"));

      expect(escaped).to.have.lengthOf(0);
    });
  });

  describe("its widget definition", () => {
    it("answers on app://dialog", () => {
      expect(dialogWidgetDefinition.id).to.equal("dialog");
      expect(dialogWidgetDefinition.title).to.equal("Dialog");
    });
  });
});
