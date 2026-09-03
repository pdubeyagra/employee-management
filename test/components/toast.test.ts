import { expect } from "chai";

import "../../src/components/toast.ts";
import type { AppToast } from "../../src/components/toast.ts";
import {
  click,
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

const toastOf = (element: AppToast) => queryRequired(element, ".toast");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("<app-toast>", () => {
  it("starts closed and hidden from assistive technology", async () => {
    const toast = await mount<AppToast>("app-toast");

    expect(toast.open).to.equal(false);
    expect(toastOf(toast).className).to.not.contain("open");
    expect(toastOf(toast).getAttribute("aria-hidden")).to.equal("true");
  });

  it("show() sets the message, variant and open state", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 0 });

    toast.show("Saved!", "success");
    await toast.updateComplete;

    expect(toast.open).to.equal(true);
    expect(text(query(toast, ".message"))).to.equal("Saved!");
    expect(toastOf(toast).className).to.contain("success");
    expect(toastOf(toast).className).to.contain("open");
    expect(toastOf(toast).getAttribute("aria-hidden")).to.equal("false");
  });

  it("show() defaults to the success variant", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 0 });

    toast.show("Saved!");
    await toast.updateComplete;

    expect(toast.variant).to.equal("success");
  });

  it("announces itself as a polite alert", async () => {
    const toast = await mount<AppToast>("app-toast");

    expect(toastOf(toast).getAttribute("role")).to.equal("alert");
    expect(toastOf(toast).getAttribute("aria-live")).to.equal("polite");
  });

  it("renders a distinct icon per variant", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 0 });
    const iconMarkup = (t: AppToast) =>
      queryRequired(t, ".icon svg").innerHTML.replace(/\s+/g, " ").trim();

    const seen = new Set<string>();

    for (const variant of ["success", "error", "info"] as const) {
      await update(toast, { variant });
      seen.add(iconMarkup(toast));
    }

    expect(seen.size).to.equal(3);
  });

  it("close() clears open state and emits toast-close", async () => {
    const toast = await mount<AppToast>("app-toast", {
      open: true,
      duration: 0,
    });
    const events = recordEvents(toast, "toast-close");

    toast.close();
    await toast.updateComplete;

    expect(toast.open).to.equal(false);
    expect(events).to.have.lengthOf(1);
    expect(events[0]!.composed).to.equal(true);
  });

  it("closes when the close button is clicked", async () => {
    const toast = await mount<AppToast>("app-toast", {
      open: true,
      duration: 0,
    });
    const events = recordEvents(toast, "toast-close");

    click(queryRequired(toast, ".close-button"));
    await toast.updateComplete;

    expect(toast.open).to.equal(false);
    expect(events).to.have.lengthOf(1);
  });

  it("hides the close button when closable is false", async () => {
    const toast = await mount<AppToast>("app-toast", { closable: false });

    expect(query(toast, ".close-button")).to.equal(null);
  });

  it("auto-dismisses after the configured duration", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 30 });
    const events = recordEvents(toast, "toast-close");

    toast.show("Saved!");
    await toast.updateComplete;

    expect(toast.open).to.equal(true);

    await sleep(60);

    expect(toast.open).to.equal(false);
    expect(events).to.have.lengthOf(1);
  });

  it("stays open when the duration is zero or negative", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 0 });

    toast.show("Sticky");
    await toast.updateComplete;

    await sleep(40);

    expect(toast.open).to.equal(true);
  });

  it("restarts the timer on a second show(), rather than stacking timers", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 50 });
    const events = recordEvents(toast, "toast-close");

    toast.show("First");
    await sleep(30);
    toast.show("Second");
    await sleep(30);

    expect(toast.open, "still open 30ms into the restarted timer").to.equal(
      true,
    );
    expect(events).to.have.lengthOf(0);

    await sleep(40);

    expect(toast.open).to.equal(false);
    expect(events).to.have.lengthOf(1);
  });

  it("cancels its pending timer when removed from the document", async () => {
    const toast = await mount<AppToast>("app-toast", { duration: 30 });
    const events = recordEvents(toast, "toast-close");

    toast.show("Saved!");
    await toast.updateComplete;

    toast.remove();

    await sleep(60);

    expect(events, "no close should fire after disconnect").to.have.lengthOf(
      0,
    );
  });
});

describe("<app-toast> placement", () => {
  it("reflects the default placement onto the host on connect", async () => {
    const toast = await mount<AppToast>("app-toast");

    expect(toast.getAttribute("placement")).to.equal("top-right");
  });

  it("reflects a placement change onto the host", async () => {
    const toast = await mount<AppToast>("app-toast");

    await update(toast, { placement: "bottom-center" });

    expect(toast.getAttribute("placement")).to.equal("bottom-center");
  });
});
