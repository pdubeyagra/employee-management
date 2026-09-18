import { expect } from "chai";

import "@/components/ui/ui-dialog.ts";
import type { UiDialog } from "@/components/ui/ui-dialog.ts";
import {
  click,
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

describe("<ui-dialog>", () => {
  it("defaults to a closed, medium, non-alert dialog", async () => {
    const dialog = await mount<UiDialog>("ui-dialog");

    expect(dialog.open).to.equal(false);
    expect(dialog.size).to.equal("medium");
    expect(dialog.dialogRole).to.equal("dialog");
    expect(queryRequired(dialog, ".overlay").className).to.not.contain("open");
    expect(queryRequired(dialog, ".dialog").className).to.contain("medium");
  });

  it("toggles the overlay's open class with the open property", async () => {
    const dialog = await mount<UiDialog>("ui-dialog");

    await update(dialog, { open: true });

    expect(queryRequired(dialog, ".overlay").className).to.contain("open");
  });

  it("renders the heading and reflects the requested size and role", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", {
      open: true,
      heading: "Delete Employee",
      size: "large",
      dialogRole: "alertdialog",
    });

    const inner = queryRequired(dialog, ".dialog");

    expect(text(queryRequired(dialog, "#dialog-title"))).to.equal(
      "Delete Employee",
    );
    expect(inner.className).to.contain("large");
    expect(inner.getAttribute("role")).to.equal("alertdialog");
    expect(inner.getAttribute("aria-modal")).to.equal("true");
    expect(inner.getAttribute("aria-labelledby")).to.equal("dialog-title");
  });

  it("exposes a body slot and a footer slot", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", { open: true });

    expect(queryRequired(dialog, ".dialog-body slot")).to.exist;
    expect(queryRequired(dialog, '.dialog-footer slot[name="footer"]')).to
      .exist;
  });

  it("emits dialog-close when the close icon is clicked", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", { open: true });
    const closes = recordEvents(dialog, "dialog-close");

    const close = queryRequired(dialog, ".close-icon-button");

    expect(close.getAttribute("aria-label")).to.equal("Close");

    click(close);

    expect(closes).to.have.lengthOf(1);
  });

  it("hides the close icon when hideClose is set", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", {
      open: true,
      hideClose: true,
    });

    expect(query(dialog, ".close-icon-button")).to.equal(null);
  });

  it("emits dialog-close when the backdrop itself is clicked", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", { open: true });
    const closes = recordEvents(dialog, "dialog-close");

    click(queryRequired(dialog, ".overlay"));

    expect(closes).to.have.lengthOf(1);
  });

  it("ignores backdrop clicks when overlay closing is disabled", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", {
      open: true,
      disableOverlayClose: true,
    });
    const closes = recordEvents(dialog, "dialog-close");

    click(queryRequired(dialog, ".overlay"));

    expect(closes).to.have.lengthOf(0);
  });

  it("ignores clicks that originate inside the dialog", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", { open: true });
    const closes = recordEvents(dialog, "dialog-close");

    click(queryRequired(dialog, ".dialog-body"));

    expect(closes).to.have.lengthOf(0);
  });

  it("keeps its events inside the shadow boundary", async () => {
    const dialog = await mount<UiDialog>("ui-dialog", { open: true });
    const onDocument = recordEvents(document.body, "dialog-close");

    click(queryRequired(dialog, ".close-icon-button"));

    expect(onDocument).to.have.lengthOf(0);
  });
});
