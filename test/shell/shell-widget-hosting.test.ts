import { expect } from "chai";

import "../../src/shell/browser-shell.ts";
import "../../src/widgets/widget-catalog.ts";

import type { BrowserShell } from "../../src/shell/browser-shell.ts";
import type { ShellTabStrip } from "../../src/shell/shell-tab-strip.ts";
import type { ShellToolbar } from "../../src/shell/shell-toolbar.ts";
import type { EmployeeWidget } from "../../src/widgets/employee/employee-widget.ts";
import type { EmployeeDetails } from "../../src/widgets/employee/employee-details.ts";
import type { EmployeeForm } from "../../src/widgets/employee/employee-form.ts";
import { employeeStore } from "../../src/widgets/employee/employee-store.ts";
import { WIDGET_CATALOG } from "../../src/widgets/widget-catalog.ts";
import { useWidgets } from "../helpers/widgets.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  text,
} from "../helpers/dom.ts";

const ADA = {
  name: "Ada Lovelace",
  department: "Engineering",
  designation: "Principal Engineer",
  email: "ada@example.com",
};

const stripOf = (shell: BrowserShell) =>
  queryRequired<ShellTabStrip>(shell, "shell-tab-strip");

const toolbarOf = (shell: BrowserShell) =>
  queryRequired<ShellToolbar>(shell, "shell-toolbar");

const panesOf = (shell: BrowserShell) => queryAll(shell, ".pane");

const widgetInPane = (pane: Element) =>
  queryRequired<EmployeeWidget>(pane, "employee-widget");

const rosterOf = (widget: EmployeeWidget) =>
  queryRequired<EmployeeDetails>(widget, "employee-details").employees;

/** Opens a second tab already pointed at the employee widget. */
async function openSecondEmployeeTab(shell: BrowserShell) {
  click(queryRequired<HTMLButtonElement>(stripOf(shell), ".new-tab"));
  await shell.updateComplete;

  const toolbar = toolbarOf(shell);
  const input = queryRequired<HTMLInputElement>(toolbar, ".address-input");

  input.value = "employees";
  input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

  queryRequired<HTMLFormElement>(toolbar, ".address").dispatchEvent(
    new Event("submit", { bubbles: true, composed: true, cancelable: true }),
  );

  await shell.updateComplete;
}

async function addEmployeeVia(widget: EmployeeWidget) {
  queryRequired<EmployeeForm>(widget, "employee-form").dispatchEvent(
    new CustomEvent("employee-added", {
      detail: ADA,
      bubbles: true,
      composed: true,
    }),
  );

  await widget.updateComplete;
}

describe("browser shell hosting the real widgets", () => {
  useWidgets(WIDGET_CATALOG);

  beforeEach(() => {
    employeeStore.reset();
  });

  it("opens on the employee widget", async () => {
    const shell = await mount<BrowserShell>("browser-shell");

    expect(text(query(stripOf(shell), ".tab-title"))).to.equal("Employees");
    expect(
      query(queryRequired(shell, ".pane:not([hidden])"), "employee-widget"),
    ).to.not.equal(null);
  });

  it("renders the widget's own content inside the viewport", async () => {
    const shell = await mount<BrowserShell>("browser-shell");

    const widget = widgetInPane(queryRequired(shell, ".pane:not([hidden])"));

    expect(text(query(widget, ".hero-title"))).to.equal("Employee Management");
    expect(query(widget, "employee-details")).to.not.equal(null);
  });

  describe("two tabs on the same widget", () => {
    it("shows an employee added in one tab in the other", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await openSecondEmployeeTab(shell);

      const [firstPane, secondPane] = panesOf(shell);
      const firstWidget = widgetInPane(firstPane!);
      const secondWidget = widgetInPane(secondPane!);

      await addEmployeeVia(secondWidget);
      await firstWidget.updateComplete;

      expect(rosterOf(firstWidget).map((employee) => employee.name)).to.deep.equal([
        "Ada Lovelace",
      ]);
      expect(rosterOf(secondWidget)).to.deep.equal(rosterOf(firstWidget));
    });

    it("closes an edit in one tab when the other deletes that employee", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      await openSecondEmployeeTab(shell);

      const [firstPane, secondPane] = panesOf(shell);
      const firstWidget = widgetInPane(firstPane!);
      const secondWidget = widgetInPane(secondPane!);

      await addEmployeeVia(firstWidget);
      await secondWidget.updateComplete;

      const target = rosterOf(firstWidget)[0]!;

      queryRequired<EmployeeDetails>(
        firstWidget,
        "employee-details",
      ).dispatchEvent(
        new CustomEvent("employee-edit", {
          detail: target,
          bubbles: true,
          composed: true,
        }),
      );

      await firstWidget.updateComplete;

      expect(
        queryRequired(firstWidget, ".form-panel").className,
      ).to.have.string("open");

      queryRequired<EmployeeDetails>(
        secondWidget,
        "employee-details",
      ).dispatchEvent(
        new CustomEvent("employee-delete", {
          detail: target,
          bubbles: true,
          composed: true,
        }),
      );

      await secondWidget.updateComplete;
      await firstWidget.updateComplete;

      expect(
        queryRequired(firstWidget, ".form-panel").className,
      ).to.not.have.string("open");
      expect(rosterOf(firstWidget)).to.deep.equal([]);
    });
  });

  describe("leaving and coming back", () => {
    it("keeps the roster when a tab navigates away and back", async () => {
      const shell = await mount<BrowserShell>("browser-shell");

      const widget = widgetInPane(queryRequired(shell, ".pane:not([hidden])"));

      await addEmployeeVia(widget);

      const toolbar = toolbarOf(shell);

      const input = queryRequired<HTMLInputElement>(toolbar, ".address-input");
      input.value = "app://new-tab";
      input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      queryRequired<HTMLFormElement>(toolbar, ".address").dispatchEvent(
        new Event("submit", { bubbles: true, composed: true, cancelable: true }),
      );
      await shell.updateComplete;

      click(
        queryRequired<HTMLButtonElement>(
          toolbarOf(shell),
          '.nav-button[aria-label="Back"]',
        ),
      );
      await shell.updateComplete;

      const revisited = widgetInPane(
        queryRequired(shell, ".pane:not([hidden])"),
      );

      await revisited.updateComplete;

      expect(rosterOf(revisited).map((employee) => employee.name)).to.deep.equal(
        ["Ada Lovelace"],
      );
    });
  });
});
