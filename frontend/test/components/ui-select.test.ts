import { expect } from "chai";

import "@/components/ui/ui-select.ts";
import type {
  SelectOption,
  UiSelect,
} from "@/components/ui/ui-select.ts";
import {
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

const DEPARTMENTS: SelectOption[] = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales", disabled: true },
];

async function mountSelect(properties: Record<string, unknown> = {}) {
  const host = await mount<UiSelect>("ui-select", {
    options: DEPARTMENTS,
    ...properties,
  });

  return {
    host,
    select: queryRequired<HTMLSelectElement>(host, "select"),
  };
}

function choose(select: HTMLSelectElement, value: string) {
  select.value = value;

  select.dispatchEvent(
    new Event("change", { bubbles: true, composed: true }),
  );
}

describe("<ui-select>", () => {
  it("renders the label and marks required fields with an asterisk", async () => {
    const { host } = await mountSelect({ label: "Department" });

    expect(text(query(host, "label"))).to.equal("Department");
    expect(query(host, ".required")).to.equal(null);

    await update(host, { required: true });

    expect(text(query(host, ".required"))).to.equal("*");
  });

  it("renders the placeholder ahead of the supplied options", async () => {
    const { host } = await mountSelect({ placeholder: "Pick a team" });

    const options = queryAll<HTMLOptionElement>(host, "option");

    expect(options).to.have.lengthOf(DEPARTMENTS.length + 1);
    expect(options[0]!.value).to.equal("");
    expect(text(options[0]!)).to.equal("Pick a team");
    expect(options.slice(1).map((option) => option.value)).to.deep.equal([
      "engineering",
      "design",
      "sales",
    ]);
  });

  it("carries the disabled flag through to individual options", async () => {
    const { host } = await mountSelect();

    const options = queryAll<HTMLOptionElement>(host, "option");

    expect(options[1]!.disabled).to.equal(false);
    expect(options[3]!.disabled).to.equal(true);
  });

  it("locks the placeholder out once the field is required", async () => {
    const { host } = await mountSelect();

    expect(queryAll<HTMLOptionElement>(host, "option")[0]!.disabled).to.equal(
      false,
    );

    await update(host, { required: true });

    expect(queryAll<HTMLOptionElement>(host, "option")[0]!.disabled).to.equal(
      true,
    );
  });

  it("seeds the native select from the value property", async () => {
    const { host, select } = await mountSelect({ value: "design" });

    expect(select.value).to.equal("design");

    await update(host, { value: "engineering" });

    expect(select.value).to.equal("engineering");
  });

  it("emits select-change carrying the chosen value", async () => {
    const { host, select } = await mountSelect();
    const events = recordEvents<{ value: string; error: string }>(
      host,
      "select-change",
    );

    choose(select, "design");

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.detail.value).to.equal("design");
    expect(events[0]!.composed).to.equal(true);
    expect(host.value).to.equal("design");
  });

  it("emits select-blur when the native select loses focus", async () => {
    const { host, select } = await mountSelect();
    const events = recordEvents(host, "select-blur");

    select.dispatchEvent(new FocusEvent("blur"));

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.composed).to.equal(true);
  });

  it("validates required on its own and clears once a choice is made", async () => {
    const { host, select } = await mountSelect({
      label: "Department",
      required: true,
    });

    expect(host.validate()).to.equal("Department is required.");

    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal(
      "Department is required.",
    );
    expect(select.getAttribute("aria-invalid")).to.equal("true");

    choose(select, "engineering");
    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal("");
    expect(select.getAttribute("aria-invalid")).to.equal("false");
  });

  it("stays silent when the field is optional", async () => {
    const { host } = await mountSelect({ label: "Department" });

    expect(host.validate()).to.equal("");
    expect(text(query(host, ".error-message"))).to.equal("");
  });

  it("lets a consumer-supplied error win over its own", async () => {
    const { host } = await mountSelect({
      label: "Department",
      required: true,
      error: "That team is full.",
    });

    host.validate();
    await host.updateComplete;

    expect(text(query(host, ".error-message"))).to.equal("That team is full.");
  });

  it("exposes the selected option", async () => {
    const { host } = await mountSelect({ value: "design" });

    expect(host.selectedOption).to.deep.equal({
      value: "design",
      label: "Design",
    });

    await update(host, { value: "nope" });

    expect(host.selectedOption).to.equal(null);
  });

  it("shows the error message in an alert region", async () => {
    const { host } = await mountSelect({ error: "Department is required." });

    const message = queryRequired(host, ".error-message");

    expect(message.getAttribute("role")).to.equal("alert");
    expect(text(message)).to.equal("Department is required.");
  });

  it("disables the native select when asked", async () => {
    const { select } = await mountSelect({ disabled: true });

    expect(select.disabled).to.equal(true);
  });
});

describe("<ui-select> compact", () => {
  it("drops the visible label and the error region", async () => {
    const { host } = await mountSelect({ label: "Rows per page", compact: true });

    expect(query(host, "label")).to.equal(null);
    expect(query(host, ".error-message")).to.equal(null);
  });

  it("keeps the label as the accessible name", async () => {
    const { select } = await mountSelect({
      label: "Rows per page",
      compact: true,
    });

    expect(select.getAttribute("aria-label")).to.equal("Rows per page");
  });

  it("still reports the choice", async () => {
    const { host, select } = await mountSelect({ compact: true });
    const events = recordEvents<{ value: string }>(host, "select-change");

    choose(select, "design");

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.detail.value).to.equal("design");
  });

  it("leaves the full field labelled as before", async () => {
    const { host, select } = await mountSelect({ label: "Department" });

    expect(query(host, "label")).to.not.equal(null);
    expect(query(host, ".error-message")).to.not.equal(null);
    expect(select.hasAttribute("aria-label")).to.equal(false);
  });
});
