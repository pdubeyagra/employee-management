import { expect } from "chai";

import "@/components/ui/ui-dropdown.ts";
import type {
  DropdownChangeDetail,
  DropdownOption,
  UiDropdown,
} from "@/components/ui/ui-dropdown.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../helpers/dom.ts";

const OPTIONS: DropdownOption[] = [
  { value: "state", label: "In memory" },
  { value: "session", label: "Session storage" },
  { value: "local", label: "Local storage", description: "Survives a reload" },
  { value: "indexed", label: "IndexedDB", disabled: true },
];

async function mountDropdown(properties: Record<string, unknown> = {}) {
  const host = await mount<UiDropdown>("ui-dropdown", {
    options: OPTIONS,
    label: "Storage",
    ...properties,
  });

  return {
    host,
    trigger: queryRequired<HTMLButtonElement>(host, ".trigger"),
  };
}

const menuOf = (host: UiDropdown) =>
  queryRequired<HTMLElement>(host, ".menu");

const optionsOf = (host: UiDropdown) =>
  queryAll<HTMLElement>(host, ".option");

async function openWith(host: UiDropdown, trigger: HTMLButtonElement) {
  click(trigger);
  await host.updateComplete;
}

function press(host: UiDropdown, key: string) {
  queryRequired<HTMLButtonElement>(host, ".trigger").dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );

  return host.updateComplete;
}

describe("<ui-dropdown>", () => {
  describe("closed state", () => {
    it("shows the placeholder until something is chosen", async () => {
      const { host, trigger } = await mountDropdown({
        placeholder: "Pick a store",
      });

      expect(text(query(host, ".trigger-text"))).to.equal("Pick a store");
      expect(queryRequired(host, ".trigger-text").className).to.contain(
        "placeholder",
      );
      expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    });

    it("shows the label of the selected option", async () => {
      const { host } = await mountDropdown({ value: "local" });

      expect(text(query(host, ".trigger-text"))).to.equal("Local storage");
      expect(queryRequired(host, ".trigger-text").className).to.not.contain(
        "placeholder",
      );
    });

    it("keeps the menu hidden", async () => {
      const { host } = await mountDropdown();

      expect(menuOf(host).hidden).to.equal(true);
      expect(host.isOpen).to.equal(false);
    });

    it("renders its own options rather than native ones", async () => {
      const { host } = await mountDropdown();

      expect(query(host, "select")).to.equal(null);
      expect(optionsOf(host)).to.have.lengthOf(OPTIONS.length);
    });
  });

  describe("opening", () => {
    it("opens on click and marks itself expanded", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);

      expect(host.isOpen).to.equal(true);
      expect(menuOf(host).hidden).to.equal(false);
      expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    });

    it("closes again on a second click", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      await openWith(host, trigger);

      expect(host.isOpen).to.equal(false);
    });

    it("emits open and close events", async () => {
      const { host, trigger } = await mountDropdown();
      const opened = recordEvents(host, "dropdown-open");
      const closed = recordEvents(host, "dropdown-close");

      await openWith(host, trigger);
      await openWith(host, trigger);

      expect(opened).to.have.lengthOf(1);
      expect(closed).to.have.lengthOf(1);
    });

    it("highlights the selected option when it opens", async () => {
      const { host, trigger } = await mountDropdown({ value: "local" });

      await openWith(host, trigger);

      expect(optionsOf(host)[2]!.className).to.contain("active");
    });

    it("highlights the first selectable option with no selection", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);

      expect(optionsOf(host)[0]!.className).to.contain("active");
    });

    it("stays shut when disabled", async () => {
      const { host, trigger } = await mountDropdown({ disabled: true });

      await openWith(host, trigger);

      expect(host.isOpen).to.equal(false);
      expect(trigger.disabled).to.equal(true);
    });
  });

  describe("choosing", () => {
    it("emits dropdown-change with the value and the option", async () => {
      const { host, trigger } = await mountDropdown();
      const events = recordEvents<DropdownChangeDetail>(host, "dropdown-change");

      await openWith(host, trigger);
      click(optionsOf(host)[1]!);
      await host.updateComplete;

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail.value).to.equal("session");
      expect(events[0]!.detail.option.label).to.equal("Session storage");
      expect(events[0]!.composed).to.equal(true);
    });

    it("updates its own value and closes", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      click(optionsOf(host)[1]!);
      await host.updateComplete;

      expect(host.value).to.equal("session");
      expect(host.isOpen).to.equal(false);
      expect(text(query(host, ".trigger-text"))).to.equal("Session storage");
    });

    it("stays silent when the same option is chosen again", async () => {
      const { host, trigger } = await mountDropdown({ value: "session" });
      const events = recordEvents(host, "dropdown-change");

      await openWith(host, trigger);
      click(optionsOf(host)[1]!);
      await host.updateComplete;

      expect(events).to.have.lengthOf(0);
      expect(host.isOpen).to.equal(false);
    });

    it("refuses a disabled option", async () => {
      const { host, trigger } = await mountDropdown();
      const events = recordEvents(host, "dropdown-change");

      await openWith(host, trigger);
      click(optionsOf(host)[3]!);
      await host.updateComplete;

      expect(events).to.have.lengthOf(0);
      expect(host.isOpen).to.equal(true);
    });

    it("ticks only the selected option", async () => {
      const { host, trigger } = await mountDropdown({ value: "local" });

      await openWith(host, trigger);

      const selected = optionsOf(host).map((option) =>
        option.getAttribute("aria-selected"),
      );

      expect(selected).to.deep.equal(["false", "false", "true", "false"]);
      expect(
        queryAll(host, ".check:not(.hidden)"),
        "one visible tick",
      ).to.have.lengthOf(1);
    });

    it("exposes the selected option", async () => {
      const { host } = await mountDropdown({ value: "local" });

      expect(host.selectedOption?.label).to.equal("Local storage");

      await update(host, { value: "nope" });

      expect(host.selectedOption).to.equal(null);
    });
  });

  describe("keyboard", () => {
    it("opens on ArrowDown, ArrowUp, Enter and Space", async () => {
      for (const key of ["ArrowDown", "ArrowUp", "Enter", " "]) {
        const { host } = await mountDropdown();

        await press(host, key);

        expect(host.isOpen, key).to.equal(true);
      }
    });

    it("walks the list with the arrow keys", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      await press(host, "ArrowDown");

      expect(optionsOf(host)[1]!.className).to.contain("active");

      await press(host, "ArrowUp");

      expect(optionsOf(host)[0]!.className).to.contain("active");
    });

    it("skips disabled options while walking", async () => {
      const { host, trigger } = await mountDropdown({ value: "local" });

      await openWith(host, trigger);
      await press(host, "ArrowDown");

      expect(
        optionsOf(host)[2]!.className,
        "IndexedDB is disabled, so it stays put",
      ).to.contain("active");
    });

    it("jumps to the ends with Home and End", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      await press(host, "End");

      expect(
        optionsOf(host)[2]!.className,
        "the last selectable option",
      ).to.contain("active");

      await press(host, "Home");

      expect(optionsOf(host)[0]!.className).to.contain("active");
    });

    it("chooses the highlighted option with Enter", async () => {
      const { host, trigger } = await mountDropdown();
      const events = recordEvents<DropdownChangeDetail>(host, "dropdown-change");

      await openWith(host, trigger);
      await press(host, "ArrowDown");
      await press(host, "Enter");

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail.value).to.equal("session");
      expect(host.isOpen).to.equal(false);
    });

    it("closes on Escape without choosing", async () => {
      const { host, trigger } = await mountDropdown();
      const events = recordEvents(host, "dropdown-change");

      await openWith(host, trigger);
      await press(host, "Escape");

      expect(host.isOpen).to.equal(false);
      expect(events).to.have.lengthOf(0);
    });

    it("closes on Tab so focus can move on", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      await press(host, "Tab");

      expect(host.isOpen).to.equal(false);
    });

    it("jumps to an option by typing while open", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);
      await press(host, "l");

      expect(optionsOf(host)[2]!.className).to.contain("active");
    });

    it("selects by typing while closed", async () => {
      const { host } = await mountDropdown();
      const events = recordEvents<DropdownChangeDetail>(host, "dropdown-change");

      await press(host, "s");

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail.value).to.equal("session");
    });

    it("points aria-activedescendant at the highlighted option", async () => {
      const { host, trigger } = await mountDropdown();

      expect(trigger.hasAttribute("aria-activedescendant")).to.equal(false);

      await openWith(host, trigger);

      const active = queryRequired(host, ".option.active");

      expect(trigger.getAttribute("aria-activedescendant")).to.equal(active.id);
    });
  });

  describe("dismissal", () => {
    it("closes when a pointer lands outside", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);

      document.body.dispatchEvent(
        new Event("pointerdown", { bubbles: true, composed: true }),
      );
      await host.updateComplete;

      expect(host.isOpen).to.equal(false);
    });

    it("stays open for a pointer inside itself", async () => {
      const { host, trigger } = await mountDropdown();

      await openWith(host, trigger);

      trigger.dispatchEvent(
        new Event("pointerdown", { bubbles: true, composed: true }),
      );
      await host.updateComplete;

      expect(host.isOpen).to.equal(true);
    });
  });

  describe("accessibility", () => {
    it("wires the trigger to the listbox", async () => {
      const { host, trigger } = await mountDropdown();
      const menu = menuOf(host);

      expect(trigger.getAttribute("aria-haspopup")).to.equal("listbox");
      expect(trigger.getAttribute("aria-controls")).to.equal(menu.id);
      expect(menu.getAttribute("role")).to.equal("listbox");
      expect(optionsOf(host)[0]!.getAttribute("role")).to.equal("option");
    });

    it("gives each instance its own ids", async () => {
      const first = await mountDropdown();
      const second = await mountDropdown();

      expect(menuOf(first.host).id).to.not.equal(menuOf(second.host).id);
    });

    it("marks a disabled option for assistive technology", async () => {
      const { host } = await mountDropdown();

      expect(optionsOf(host)[3]!.getAttribute("aria-disabled")).to.equal("true");
      expect(optionsOf(host)[0]!.hasAttribute("aria-disabled")).to.equal(false);
    });
  });

  describe("validation", () => {
    it("reports a required field with no value", async () => {
      const { host } = await mountDropdown({ required: true });

      expect(host.validate()).to.equal("Storage is required.");

      await host.updateComplete;

      expect(text(query(host, ".error-message"))).to.equal(
        "Storage is required.",
      );
    });

    it("clears once something is chosen", async () => {
      const { host, trigger } = await mountDropdown({ required: true });

      host.validate();
      await host.updateComplete;

      await openWith(host, trigger);
      click(optionsOf(host)[1]!);
      await host.updateComplete;

      expect(text(query(host, ".error-message"))).to.equal("");
    });

    it("lets a consumer-supplied error win", async () => {
      const { host } = await mountDropdown({
        required: true,
        error: "That store is full.",
      });

      host.validate();
      await host.updateComplete;

      expect(text(query(host, ".error-message"))).to.equal(
        "That store is full.",
      );
    });

    it("stays silent when optional", async () => {
      const { host } = await mountDropdown();

      expect(host.validate()).to.equal("");
    });
  });

  describe("compact", () => {
    it("drops the visible label and error region", async () => {
      const { host, trigger } = await mountDropdown({ compact: true });

      expect(query(host, ".label")).to.equal(null);
      expect(query(host, ".error-message")).to.equal(null);
      expect(trigger.getAttribute("aria-label")).to.equal("Storage");
    });

    it("labels the trigger by the visible label otherwise", async () => {
      const { host, trigger } = await mountDropdown();

      expect(trigger.hasAttribute("aria-label")).to.equal(false);
      expect(trigger.getAttribute("aria-labelledby")).to.equal(
        queryRequired(host, ".label").id,
      );
    });
  });

  describe("empty list", () => {
    it("says so rather than showing a blank panel", async () => {
      const { host, trigger } = await mountDropdown({ options: [] });

      await openWith(host, trigger);

      expect(text(query(host, ".empty"))).to.equal("No options");
      expect(optionsOf(host)).to.have.lengthOf(0);
    });

    it("survives Enter with nothing to choose", async () => {
      const { host, trigger } = await mountDropdown({ options: [] });

      await openWith(host, trigger);
      await press(host, "Enter");

      expect(host.isOpen).to.equal(true);
    });
  });
});

describe("<ui-dropdown> positioning", () => {
  function stubRect(element: Element, rect: Partial<DOMRect>) {
    const full = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
      ...rect,
    } as DOMRect;

    element.getBoundingClientRect = () => full;
  }

  it("escapes ancestor clipping by pinning to the viewport", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, { top: 100, bottom: 140, left: 50, width: 200 });

    await openWith(host, trigger);

    const menu = menuOf(host);

    expect(menu.style.top, "sits just under the trigger").to.equal("144px");
    expect(menu.style.left).to.equal("50px");
  });

  it("matches the trigger width when it is a full-width field", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, { top: 10, bottom: 54, left: 0, width: 320 });

    await openWith(host, trigger);

    expect(menuOf(host).style.width).to.equal("320px");
  });

  it("only sets a floor on the width when compact", async () => {
    const { host, trigger } = await mountDropdown({ compact: true });

    stubRect(trigger, { top: 10, bottom: 42, left: 0, width: 160 });

    await openWith(host, trigger);

    const menu = menuOf(host);

    expect(menu.style.minWidth).to.equal("160px");
    expect(menu.style.width).to.equal("");
  });

  it("flips above the trigger when asked", async () => {
    const { host, trigger } = await mountDropdown({ placement: "top" });

    stubRect(trigger, { top: 300, bottom: 340, left: 20, width: 200 });

    await openWith(host, trigger);

    expect(menuOf(host).style.top).to.equal("296px");
  });

  it("caps its height to the space available", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, {
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 20,
      left: 0,
      width: 200,
    });

    await openWith(host, trigger);

    expect(menuOf(host).style.maxHeight).to.equal("16px");
  });

  it("pulls back from the right edge rather than overflowing", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, {
      top: 10,
      bottom: 50,
      left: window.innerWidth - 40,
      width: 200,
    });

    await openWith(host, trigger);

    const left = Number.parseFloat(menuOf(host).style.left);

    expect(left).to.be.lessThan(window.innerWidth - 40);
    expect(left).to.be.at.least(4);
  });

  it("follows the trigger when the page scrolls", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, { top: 200, bottom: 240, left: 0, width: 200 });
    await openWith(host, trigger);

    expect(menuOf(host).style.top).to.equal("244px");

    stubRect(trigger, { top: 120, bottom: 160, left: 0, width: 200 });
    window.dispatchEvent(new Event("scroll"));

    expect(menuOf(host).style.top).to.equal("164px");
  });

  it("stops following once it closes", async () => {
    const { host, trigger } = await mountDropdown();

    stubRect(trigger, { top: 200, bottom: 240, left: 0, width: 200 });
    await openWith(host, trigger);
    await openWith(host, trigger);

    expect(host.isOpen).to.equal(false);

    stubRect(trigger, { top: 500, bottom: 540, left: 0, width: 200 });
    window.dispatchEvent(new Event("scroll"));

    expect(
      menuOf(host).style.top,
      "a closed menu must not keep recalculating",
    ).to.equal("244px");
  });
});
