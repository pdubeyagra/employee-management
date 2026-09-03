import { expect } from "chai";

import "../../src/components/confirm-dialog.ts";
import type { ConfirmDialog } from "../../src/components/confirm-dialog.ts";
import type { AppButton } from "../../src/components/button.ts";
import {
  click,
  mount,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

function actionButtons(dialog: ConfirmDialog) {
  const buttons = queryAll<AppButton>(dialog, ".dialog-actions app-button");

  return { cancel: buttons[0]!, confirm: buttons[1]! };
}

function clickAppButton(button: AppButton) {
  click(queryRequired<HTMLButtonElement>(button, "button"));
}

describe("<confirm-dialog>", () => {
  it("uses generic copy by default", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog");
    const { cancel, confirm } = actionButtons(dialog);

    expect(text(queryRequired(dialog, "#dialog-title"))).to.equal("Confirm");
    expect(text(queryRequired(dialog, ".dialog-message"))).to.equal(
      "Are you sure?",
    );
    expect(text(cancel)).to.equal("Cancel");
    expect(text(confirm)).to.equal("Confirm");
  });

  it("renders the supplied title, message and action labels", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", {
      title: "Delete Employee",
      message: "Are you sure you want to delete Ada Lovelace?",
      confirmText: "Delete",
      cancelText: "Keep",
    });

    const { cancel, confirm } = actionButtons(dialog);

    expect(text(queryRequired(dialog, "#dialog-title"))).to.equal(
      "Delete Employee",
    );
    expect(text(queryRequired(dialog, ".dialog-message"))).to.equal(
      "Are you sure you want to delete Ada Lovelace?",
    );
    expect(text(confirm)).to.equal("Delete");
    expect(text(cancel)).to.equal("Keep");
  });

  it("toggles the overlay's open class with the open property", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog");

    expect(queryRequired(dialog, ".overlay").className).to.not.contain("open");

    await update(dialog, { open: true });

    expect(queryRequired(dialog, ".overlay").className).to.contain("open");
  });

  it("exposes the dialog as a labelled modal alertdialog", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", {
      open: true,
      title: "Delete Employee",
    });

    const inner = queryRequired(dialog, ".dialog");

    expect(inner.getAttribute("role")).to.equal("alertdialog");
    expect(inner.getAttribute("aria-modal")).to.equal("true");
    expect(inner.getAttribute("aria-labelledby")).to.equal("dialog-title");
    expect(queryRequired(dialog, "#dialog-title")).to.exist;
  });

  it("emits confirm when the confirm action is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const confirms = recordEvents(dialog, "confirm");
    const cancels = recordEvents(dialog, "cancel");

    clickAppButton(actionButtons(dialog).confirm);

    expect(confirms).to.have.lengthOf(1);
    expect(cancels).to.have.lengthOf(0);
  });

  it("emits cancel when the cancel action is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const confirms = recordEvents(dialog, "confirm");
    const cancels = recordEvents(dialog, "cancel");

    clickAppButton(actionButtons(dialog).cancel);

    expect(cancels).to.have.lengthOf(1);
    expect(confirms).to.have.lengthOf(0);
  });

  it("emits cancel when the header close icon is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const cancels = recordEvents(dialog, "cancel");

    const close = queryRequired(dialog, ".close-icon-button");

    expect(close.getAttribute("aria-label")).to.equal("Close");

    click(close);

    expect(cancels).to.have.lengthOf(1);
  });

  it("emits cancel when the backdrop itself is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const cancels = recordEvents(dialog, "cancel");

    click(queryRequired(dialog, ".overlay"));

    expect(cancels).to.have.lengthOf(1);
  });

  it("ignores clicks that originate inside the dialog body", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const cancels = recordEvents(dialog, "cancel");

    click(queryRequired(dialog, ".dialog-message"));

    expect(cancels).to.have.lengthOf(0);
  });

  it("keeps its events inside the shadow boundary", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const onDocument = recordEvents(document.body, "confirm");

    clickAppButton(actionButtons(dialog).confirm);

    expect(
      onDocument,
      "confirm is a non-bubbling, non-composed event by design",
    ).to.have.lengthOf(0);
  });
});
