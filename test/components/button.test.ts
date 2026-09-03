import { expect } from "chai";

import "../../src/components/button.ts";
import type { AppButton } from "../../src/components/button.ts";
import {
  click,
  mount,
  queryRequired,
  recordEvents,
  update,
} from "../helpers/dom.ts";

async function mountButton(properties: Record<string, unknown> = {}) {
  const button = await mount<AppButton>("app-button", properties);

  return {
    button,
    inner: queryRequired<HTMLButtonElement>(button, "button"),
  };
}

describe("<app-button>", () => {
  it("defaults to a primary, medium, rounded, non-submitting button", async () => {
    const { button, inner } = await mountButton();

    expect(button.variant).to.equal("primary");
    expect(inner.className.split(/\s+/)).to.have.members([
      "primary",
      "medium",
      "rounded",
    ]);
    expect(inner.getAttribute("type")).to.equal("button");
  });

  it("reflects variant, size and shape into the inner button's classes", async () => {
    const { button, inner } = await mountButton({
      variant: "danger",
      size: "large",
      shape: "pill",
    });

    await update(button);

    expect(inner.className.split(/\s+/)).to.have.members([
      "danger",
      "large",
      "pill",
    ]);
  });

  it("adds the icon-only class only when iconOnly is set", async () => {
    const { button, inner } = await mountButton();

    expect(inner.className).to.not.contain("icon-only");

    await update(button, { iconOnly: true });

    expect(inner.className).to.contain("icon-only");
  });

  it("emits button-click, composed so it escapes the shadow root", async () => {
    const { inner } = await mountButton();
    const events = recordEvents(document.body, "button-click");

    click(inner);

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.composed).to.equal(true);
    expect(events[0]!.bubbles).to.equal(true);
  });

  it("emits button-submit alongside button-click only for type=submit", async () => {
    const { button, inner } = await mountButton();
    const clicks = recordEvents(button, "button-click");
    const submits = recordEvents(button, "button-submit");

    click(inner);

    expect(clicks).to.have.lengthOf(1);
    expect(submits).to.have.lengthOf(0);

    await update(button, { type: "submit" });
    click(queryRequired<HTMLButtonElement>(button, "button"));

    expect(clicks).to.have.lengthOf(2);
    expect(submits).to.have.lengthOf(1);
  });

  it("swallows clicks while disabled", async () => {
    const { button, inner } = await mountButton({ disabled: true });
    const events = recordEvents(button, "button-click");

    await update(button);

    const notPrevented = click(inner);

    expect(events).to.have.lengthOf(0);
    expect(notPrevented, "the click should be prevented").to.equal(false);
    expect(inner.hasAttribute("disabled")).to.equal(true);
    expect(inner.getAttribute("aria-disabled")).to.equal("true");
  });

  it("swallows clicks while loading and shows a status spinner", async () => {
    const { button, inner } = await mountButton({ loading: true });
    const events = recordEvents(button, "button-click");

    await update(button);

    click(inner);

    expect(events).to.have.lengthOf(0);
    expect(inner.hasAttribute("disabled")).to.equal(true);

    const spinner = queryRequired(button, ".spinner");

    expect(spinner.getAttribute("role")).to.equal("status");
    expect(spinner.getAttribute("aria-label")).to.equal("Loading");
  });

  it("accepts clicks again once disabled is cleared", async () => {
    const { button } = await mountButton({ disabled: true });
    const events = recordEvents(button, "button-click");

    await update(button, { disabled: false });

    click(queryRequired<HTMLButtonElement>(button, "button"));

    expect(events).to.have.lengthOf(1);
  });

  it("renders the icon slot when idle and replaces it with the spinner when loading", async () => {
    const { button } = await mountButton();

    expect(queryRequired(button, 'slot[name="icon"]')).to.exist;

    await update(button, { loading: true });

    expect(button.shadowRoot!.querySelector('slot[name="icon"]')).to.equal(
      null,
    );
  });

  it("renders the icon-only slot instead of the default slot when iconOnly", async () => {
    const { button } = await mountButton({ iconOnly: true });

    await update(button);

    expect(queryRequired(button, 'slot[name="icon-only"]')).to.exist;
    expect(button.shadowRoot!.querySelector("slot:not([name])")).to.equal(null);
  });
});
