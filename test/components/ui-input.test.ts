import { expect } from "chai";

import "../../src/components/ui/ui-input.ts";
import type { UiInput } from "../../src/components/ui/ui-input.ts";
import {
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
  typeInto,
  update,
} from "../helpers/dom.ts";

async function mountInput(properties: Record<string, unknown> = {}) {
  const host = await mount<UiInput>("ui-input", properties);

  return {
    host,
    input: queryRequired<HTMLInputElement>(host, "input"),
  };
}

describe("<ui-input>", () => {
  it("renders the label and marks required fields with an asterisk", async () => {
    const { host } = await mountInput({ label: "Name" });

    expect(text(query(host, "label"))).to.equal("Name");
    expect(query(host, ".required")).to.equal(null);

    await update(host, { required: true });

    expect(text(query(host, ".required"))).to.equal("*");
  });

  it("passes type, placeholder, inputmode and autocomplete to the native input", async () => {
    const { input } = await mountInput({
      type: "email",
      placeholder: "employee@example.com",
      inputmode: "email",
      autocomplete: "email",
    });

    expect(input.getAttribute("type")).to.equal("email");
    expect(input.getAttribute("placeholder")).to.equal(
      "employee@example.com",
    );
    expect(input.getAttribute("inputmode")).to.equal("email");
    expect(input.getAttribute("autocomplete")).to.equal("email");
  });

  it("omits inputmode and autocomplete when they are unset", async () => {
    const { input } = await mountInput();

    expect(input.hasAttribute("inputmode")).to.equal(false);
    expect(input.hasAttribute("autocomplete")).to.equal(false);
  });

  it("drops the attributes again when they are cleared", async () => {
    const { host, input } = await mountInput({
      inputmode: "email",
      autocomplete: "email",
    });

    expect(input.hasAttribute("inputmode")).to.equal(true);

    await update(host, { inputmode: "", autocomplete: "" });

    expect(input.hasAttribute("inputmode")).to.equal(false);
    expect(input.hasAttribute("autocomplete")).to.equal(false);
  });

  it("seeds the native input from the value property", async () => {
    const { host, input } = await mountInput({ value: "Ada" });

    expect(input.value).to.equal("Ada");

    await update(host, { value: "Grace" });

    expect(input.value).to.equal("Grace");
  });

  it("emits input-change carrying the typed value", async () => {
    const { host, input } = await mountInput();
    const events = recordEvents<{ value: string }>(host, "input-change");

    typeInto(input, "Ada");

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.detail.value).to.equal("Ada");
    expect(events[0]!.composed).to.equal(true);
  });

  it("keeps its own value in sync with what was typed", async () => {
    const { host, input } = await mountInput();

    typeInto(input, "Engineering");

    expect(host.value).to.equal("Engineering");
  });

  it("emits input-blur when the native input loses focus", async () => {
    const { host, input } = await mountInput();
    const events = recordEvents(host, "input-blur");

    input.dispatchEvent(new FocusEvent("blur"));

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.composed).to.equal(true);
  });

  it("shows the error message in an alert region", async () => {
    const { host } = await mountInput({ error: "Name is required." });

    await update(host);

    const message = queryRequired(host, ".error-message");

    expect(message.getAttribute("role")).to.equal("alert");
    expect(text(message)).to.equal("Name is required.");
  });

  it("keeps the alert region present but empty when there is no error", async () => {
    const { host } = await mountInput();

    expect(text(query(host, ".error-message"))).to.equal("");
  });

  it("marks the native input invalid for assistive technology", async () => {
    const { host, input } = await mountInput();

    expect(input.getAttribute("aria-invalid")).to.equal("false");
    expect(input.className).to.not.contain("invalid");

    await update(host, { invalid: true });

    expect(input.getAttribute("aria-invalid")).to.equal("true");
    expect(input.className).to.contain("invalid");
  });
});
