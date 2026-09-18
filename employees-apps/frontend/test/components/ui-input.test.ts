import { expect } from "chai";

import "@/components/ui/ui-input.ts";
import {
  validateFieldValue,
  type UiInput,
} from "@/components/ui/ui-input.ts";
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

describe("validateFieldValue", () => {
  it("passes anything when no rules are set", () => {
    expect(validateFieldValue("", {})).to.equal("");
    expect(validateFieldValue("anything at all", {})).to.equal("");
  });

  it("reports a missing required value using the field label", () => {
    expect(validateFieldValue("", { label: "Name", required: true })).to.equal(
      "Name is required.",
    );
  });

  it("treats whitespace as missing", () => {
    expect(
      validateFieldValue("  \t\n ", { label: "Name", required: true }),
    ).to.equal("Name is required.");
  });

  it("falls back to a generic label", () => {
    expect(validateFieldValue("", { required: true })).to.equal(
      "This field is required.",
    );
  });

  it("measures the trimmed value against maxlength", () => {
    const rules = { label: "Name", maxlength: 4 };

    expect(validateFieldValue("abcd", rules)).to.equal("");
    expect(validateFieldValue("  abcd  ", rules)).to.equal("");
    expect(validateFieldValue("abcde", rules)).to.equal(
      "Name must be 4 characters or fewer.",
    );
  });

  it("measures the trimmed value against minlength", () => {
    const rules = { label: "Code", minlength: 3 };

    expect(validateFieldValue("abc", rules)).to.equal("");
    expect(validateFieldValue("ab", rules)).to.equal(
      "Code must be at least 3 characters.",
    );
  });

  it("checks email shape only for email fields", () => {
    expect(validateFieldValue("nope", { label: "Email", type: "email" })).to
      .equal("Please enter a valid email address.");
    expect(
      validateFieldValue("ada@example.com", { label: "Email", type: "email" }),
    ).to.equal("");
    expect(validateFieldValue("nope", { label: "Name", type: "text" })).to.equal(
      "",
    );
  });

  it("applies a custom pattern with its own message", () => {
    const rules = {
      label: "Code",
      pattern: /^[A-Z]{3}$/,
      patternMessage: "Use three capital letters.",
    };

    expect(validateFieldValue("ABC", rules)).to.equal("");
    expect(validateFieldValue("abc", rules)).to.equal(
      "Use three capital letters.",
    );
  });

  it("skips every other rule once an optional field is left blank", () => {
    expect(
      validateFieldValue("", { label: "Email", type: "email", minlength: 5 }),
    ).to.equal("");
  });
});

describe("<ui-input> self-validation", () => {
  it("validates on blur from its own properties", async () => {
    const { host, input } = await mountInput({ label: "Name", required: true });

    input.dispatchEvent(new FocusEvent("blur"));
    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal("Name is required.");
    expect(input.getAttribute("aria-invalid")).to.equal("true");
  });

  it("clears its own error as soon as the value becomes valid", async () => {
    const { host, input } = await mountInput({ label: "Name", required: true });

    input.dispatchEvent(new FocusEvent("blur"));
    await host.updateComplete;

    typeInto(input, "Ada");
    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal("");
    expect(input.getAttribute("aria-invalid")).to.equal("false");
  });

  it("reports the error alongside the value on both events", async () => {
    const { host, input } = await mountInput({
      label: "Email",
      type: "email",
      required: true,
    });

    const changes = recordEvents<{ value: string; error: string }>(
      host,
      "input-change",
    );
    const blurs = recordEvents<{ value: string; error: string }>(
      host,
      "input-blur",
    );

    typeInto(input, "nope");
    input.dispatchEvent(new FocusEvent("blur"));

    expect(changes[0]!.detail).to.deep.equal({
      value: "nope",
      error: "Please enter a valid email address.",
    });
    expect(blurs[0]!.detail).to.deep.equal({
      value: "nope",
      error: "Please enter a valid email address.",
    });
  });

  it("lets a consumer-supplied error win over its own", async () => {
    const { host, input } = await mountInput({
      label: "Email",
      required: true,
      error: "That address is already taken.",
    });

    input.dispatchEvent(new FocusEvent("blur"));
    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal(
      "That address is already taken.",
    );
  });

  it("stays silent for an untouched field", async () => {
    const { host } = await mountInput({ label: "Name", required: true });

    expect(text(query(host, ".error-message"))).to.equal("");
  });
});
