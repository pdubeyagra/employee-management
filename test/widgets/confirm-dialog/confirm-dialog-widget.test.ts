import { expect } from "chai";

import "../../../src/widgets/confirm-dialog/confirm-dialog-widget.ts";
import type { ConfirmDialogWidget } from "../../../src/widgets/confirm-dialog/confirm-dialog-widget.ts";
import { confirmDialogWidgetDefinition } from "../../../src/widgets/confirm-dialog/confirm-dialog-widget.ts";
import type { ConfirmDialog } from "../../../src/components/shared/confirm-dialog.ts";
import type { UiButton } from "../../../src/components/ui/ui-button.ts";
import type { GalleryLog } from "../../../src/components/gallery/gallery-log.ts";
import {
  click,
  mount,
  queryAll,
  queryRequired,
  recordEvents,
  text,
} from "../../helpers/dom.ts";

const confirmOf = (widget: ConfirmDialogWidget) =>
  queryRequired<ConfirmDialog>(widget, "confirm-dialog");

const logEntries = (widget: ConfirmDialogWidget) =>
  queryAll(queryRequired<GalleryLog>(widget, "gallery-log"), ".entry").map(
    text,
  );

const triggerFor = (widget: ConfirmDialogWidget, label: string) => {
  const found = queryAll<UiButton>(widget, "ui-button").find(
    (button) => text(button) === label,
  );

  if (!found) {
    throw new Error(`No trigger labelled "${label}".`);
  }

  return found;
};

async function openScenario(widget: ConfirmDialogWidget, label: string) {
  click(queryRequired<HTMLButtonElement>(triggerFor(widget, label), "button"));

  await widget.updateComplete;
}

async function answer(widget: ConfirmDialogWidget, type: "confirm" | "cancel") {
  confirmOf(widget).dispatchEvent(new CustomEvent(type));

  await widget.updateComplete;
}

describe("<confirm-dialog-widget>", () => {
  describe("the page", () => {
    it("states the address it answers on", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      expect(
        queryRequired(widget, "gallery-page").getAttribute("address"),
      ).to.equal("app://confirm-dialog");
    });

    it("starts with the prompt closed", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      expect(confirmOf(widget).open).to.equal(false);
    });

    it("offers a trigger per scenario", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      const labels = queryAll<UiButton>(widget, "ui-button").map(text);

      expect(labels).to.deep.equal([
        "Delete something",
        "Publish something",
        "Leave with unsaved work",
      ]);
    });
  });

  describe("opening a scenario", () => {
    it("opens the prompt with that scenario's copy", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      await openScenario(widget, "Delete something");

      const prompt = confirmOf(widget);

      expect(prompt.open).to.equal(true);
      expect(prompt.title).to.equal("Delete employee");
      expect(prompt.confirmText).to.equal("Delete");
      expect(prompt.cancelText).to.equal("Cancel");
      expect(prompt.confirmVariant).to.equal("danger");
    });

    it("reuses one prompt for a different scenario", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      await openScenario(widget, "Publish something");

      expect(confirmOf(widget).title).to.equal("Publish changes");
      expect(confirmOf(widget).confirmVariant).to.equal("success");
      expect(queryAll(widget, "confirm-dialog")).to.have.lengthOf(1);
    });
  });

  describe("answering", () => {
    it("closes and records a confirm", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      await openScenario(widget, "Delete something");
      await answer(widget, "confirm");

      expect(confirmOf(widget).open).to.equal(false);
      expect(logEntries(widget)[0]).to.equal('confirm from "delete"');
    });

    it("closes and records a cancel", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      await openScenario(widget, "Publish something");
      await answer(widget, "cancel");

      expect(confirmOf(widget).open).to.equal(false);
      expect(logEntries(widget)[0]).to.equal('cancel from "publish"');
    });

    it("keeps a history of decisions, newest first", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      await openScenario(widget, "Delete something");
      await answer(widget, "cancel");
      await openScenario(widget, "Delete something");
      await answer(widget, "confirm");

      expect(logEntries(widget)).to.deep.equal([
        'confirm from "delete"',
        'cancel from "delete"',
      ]);
    });
  });

  describe("event containment", () => {
    it("keeps its events out of the shell", async () => {
      const widget = await mount<ConfirmDialogWidget>("confirm-dialog-widget");

      const escapedClicks = recordEvents(document.body, "button-click");
      const escapedConfirms = recordEvents(document.body, "confirm");

      await openScenario(widget, "Delete something");
      await answer(widget, "confirm");

      expect(escapedClicks).to.have.lengthOf(0);
      expect(escapedConfirms).to.have.lengthOf(0);
    });
  });

  describe("its widget definition", () => {
    it("answers on app://confirm-dialog", () => {
      expect(confirmDialogWidgetDefinition.id).to.equal("confirm-dialog");
      expect(confirmDialogWidgetDefinition.title).to.equal("Confirm dialog");
    });
  });
});
