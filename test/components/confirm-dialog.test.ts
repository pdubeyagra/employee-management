import { expect } from "chai";

import "../../src/components/shared/confirm-dialog.ts";
import type { ConfirmDialog } from "../../src/components/shared/confirm-dialog.ts";
import type { UiButton } from "../../src/components/ui/ui-button.ts";
import type { UiDialog } from "../../src/components/ui/ui-dialog.ts";
import {
  click,
  mount,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

function shellOf(dialog: ConfirmDialog) {
  return queryRequired<UiDialog>(dialog, "ui-dialog");
}

function actionButtons(dialog: ConfirmDialog) {
  const buttons = queryAll<UiButton>(dialog, ".dialog-actions ui-button");

  return { cancel: buttons[0]!, confirm: buttons[1]! };
}

function clickUiButton(button: UiButton) {
  click(queryRequired<HTMLButtonElement>(button, "button"));
}

describe("<confirm-dialog>", () => {
  it("uses generic copy by default", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog");
    const { cancel, confirm } = actionButtons(dialog);

    expect(text(queryRequired(shellOf(dialog), "#dialog-title"))).to.equal(
      "Confirm",
    );
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

    expect(text(queryRequired(shellOf(dialog), "#dialog-title"))).to.equal(
      "Delete Employee",
    );
    expect(text(queryRequired(dialog, ".dialog-message"))).to.equal(
      "Are you sure you want to delete Ada Lovelace?",
    );
    expect(text(confirm)).to.equal("Delete");
    expect(text(cancel)).to.equal("Keep");
  });

  it("forwards its open state to the dialog shell", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog");

    expect(shellOf(dialog).open).to.equal(false);
    expect(
      queryRequired(shellOf(dialog), ".overlay").className,
    ).to.not.contain("open");

    await update(dialog, { open: true });
    await shellOf(dialog).updateComplete;

    expect(shellOf(dialog).open).to.equal(true);
    expect(queryRequired(shellOf(dialog), ".overlay").className).to.contain(
      "open",
    );
  });

  it("asks the shell to expose itself as an alertdialog", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", {
      open: true,
      title: "Delete Employee",
    });

    const shell = shellOf(dialog);
    const inner = queryRequired(shell, ".dialog");

    expect(shell.dialogRole).to.equal("alertdialog");
    expect(inner.getAttribute("role")).to.equal("alertdialog");
    expect(inner.getAttribute("aria-modal")).to.equal("true");
    expect(inner.getAttribute("aria-labelledby")).to.equal("dialog-title");
  });

  it("renders the confirm action with the requested variant", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", {
      confirmVariant: "primary",
    });

    expect(actionButtons(dialog).confirm.variant).to.equal("primary");
  });

  it("emits confirm when the confirm action is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const confirms = recordEvents(dialog, "confirm");
    const cancels = recordEvents(dialog, "cancel");

    clickUiButton(actionButtons(dialog).confirm);

    expect(confirms).to.have.lengthOf(1);
    expect(cancels).to.have.lengthOf(0);
  });

  it("emits cancel when the cancel action is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const confirms = recordEvents(dialog, "confirm");
    const cancels = recordEvents(dialog, "cancel");

    clickUiButton(actionButtons(dialog).cancel);

    expect(cancels).to.have.lengthOf(1);
    expect(confirms).to.have.lengthOf(0);
  });

  it("emits cancel when the shell requests a close", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const cancels = recordEvents(dialog, "cancel");

    click(queryRequired(shellOf(dialog), ".close-icon-button"));

    expect(cancels).to.have.lengthOf(1);
  });

  it("emits cancel when the backdrop itself is clicked", async () => {
    const dialog = await mount<ConfirmDialog>("confirm-dialog", { open: true });
    const cancels = recordEvents(dialog, "cancel");

    click(queryRequired(shellOf(dialog), ".overlay"));

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

    clickUiButton(actionButtons(dialog).confirm);

    expect(
      onDocument,
      "confirm is a non-bubbling, non-composed event by design",
    ).to.have.lengthOf(0);
  });
});
