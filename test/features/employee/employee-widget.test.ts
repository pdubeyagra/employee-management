import { expect } from "chai";

import "@/features/employee/employee-widget.ts";
import type { EmployeeWidget } from "@/features/employee/employee-widget.ts";
import type { EmployeeForm } from "@/features/employee/components/employee-form.ts";
import type { EmployeeDetails } from "@/features/employee/components/employee-details.ts";
import type { NewEmployee } from "@/features/employee/employee-types.ts";
import type { UiButton } from "@/components/ui/ui-button.ts";
import type { AppToast } from "@/components/shared/toast.ts";
import {
  click,
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
} from "../../helpers/dom.ts";

const formOf = (widget: EmployeeWidget) =>
  queryRequired<EmployeeForm>(widget, "employee-form");

const detailsOf = (widget: EmployeeWidget) =>
  queryRequired<EmployeeDetails>(widget, "employee-details");

const formPanelOf = (widget: EmployeeWidget) =>
  queryRequired(widget, ".form-panel");

const toastOf = (widget: EmployeeWidget) =>
  queryRequired<AppToast>(widget, "app-toast");

const isFormOpen = (widget: EmployeeWidget) =>
  formPanelOf(widget).className.includes("open");

const roster = (widget: EmployeeWidget) => detailsOf(widget).employees;

const heroButtonOf = (widget: EmployeeWidget) =>
  queryRequired<UiButton>(widget, ".hero-actions ui-button");

async function pressHeroButton(widget: EmployeeWidget) {
  click(queryRequired<HTMLButtonElement>(heroButtonOf(widget), "button"));

  await widget.updateComplete;
}

async function submitNew(widget: EmployeeWidget, employee: NewEmployee) {
  formOf(widget).dispatchEvent(
    new CustomEvent("employee-added", {
      detail: employee,
      bubbles: true,
      composed: true,
    }),
  );

  await widget.updateComplete;
}

async function emitFromForm(
  widget: EmployeeWidget,
  type: string,
  detail?: unknown,
) {
  formOf(widget).dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );

  await widget.updateComplete;
}

async function emitFromDetails(
  widget: EmployeeWidget,
  type: string,
  detail?: unknown,
) {
  detailsOf(widget).dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );

  await widget.updateComplete;
}

const ADA = {
  name: "Ada Lovelace",
  department: "Engineering",
  designation: "Principal Engineer",
  email: "ada@example.com",
};

const GRACE = {
  name: "Grace Hopper",
  department: "Research",
  designation: "Rear Admiral",
  email: "grace@example.com",
};

async function widgetWithTwo() {
  const widget = await mount<EmployeeWidget>("employee-widget");

  await submitNew(widget, ADA);
  await submitNew(widget, GRACE);

  return widget;
}

describe("<employee-widget>", () => {
  describe("initial state", () => {
    it("renders the hero, form and details", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      expect(text(query(widget, ".hero-title"))).to.equal(
        "Employee Management",
      );
      expect(query(widget, "employee-form")).to.not.equal(null);
      expect(query(widget, "employee-details")).to.not.equal(null);
    });

    it("starts with an empty roster and a collapsed, inert form", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      expect(roster(widget)).to.deep.equal([]);
      expect(isFormOpen(widget)).to.equal(false);
      expect(formOf(widget).employeeToEdit).to.equal(null);
      expect(
        queryRequired<HTMLElement>(widget, ".form-panel-inner").hasAttribute(
          "inert",
        ),
        "a collapsed panel must not be reachable by keyboard",
      ).to.equal(true);
    });
  });

  describe("opening the form", () => {
    it("expands the panel when the details view asks to add", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await emitFromDetails(widget, "add-employee");

      expect(isFormOpen(widget)).to.equal(true);
    });

    it("opens in add mode, not edit mode", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await pressHeroButton(widget);

      expect(formOf(widget).employeeToEdit).to.equal(null);
    });
  });

  describe("dismissing the form", () => {
    it("toggles the panel from the hero button", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");
      const button = heroButtonOf(widget);

      await pressHeroButton(widget);

      expect(isFormOpen(widget)).to.equal(true);
      expect(text(button)).to.equal("Close Form");
      expect(button.getAttribute("aria-expanded")).to.equal("true");

      await pressHeroButton(widget);

      expect(isFormOpen(widget)).to.equal(false);
      expect(text(button)).to.equal("+ Add Employee");
      expect(button.getAttribute("aria-expanded")).to.equal("false");
    });

    it("closes the panel from the form's own close button", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await pressHeroButton(widget);
      expect(isFormOpen(widget)).to.equal(true);

      const form = formOf(widget);
      await form.updateComplete;

      const closeButton = queryRequired<UiButton>(
        form,
        ".form-header-close ui-button",
      );

      click(queryRequired<HTMLButtonElement>(closeButton, "button"));
      await widget.updateComplete;

      expect(isFormOpen(widget)).to.equal(false);
    });

    it("gives the icon-only close button an accessible name", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await pressHeroButton(widget);

      const form = formOf(widget);
      await form.updateComplete;

      const inner = queryRequired<HTMLButtonElement>(
        queryRequired<UiButton>(form, ".form-header-close ui-button"),
        "button",
      );

      expect(inner.getAttribute("aria-label")).to.equal("Close form");
    });

    it("drops any edit in progress when the form is closed", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-edit", roster(widget)[0]!);
      expect(formOf(widget).employeeToEdit).to.not.equal(null);

      await pressHeroButton(widget);

      expect(isFormOpen(widget)).to.equal(false);
      expect(formOf(widget).employeeToEdit).to.equal(null);
    });
  });

  describe("adding", () => {
    it("appends the employee with a generated id", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await submitNew(widget, ADA);

      expect(roster(widget)).to.have.lengthOf(1);
      expect(roster(widget)[0]).to.include(ADA);
      expect(roster(widget)[0]!.id)
        .to.be.a("string")
        .and.to.have.length.above(0);
    });

    it("gives each employee a distinct id", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await submitNew(widget, ADA);
      await submitNew(widget, ADA);

      const [first, second] = roster(widget);

      expect(first!.id).to.not.equal(second!.id);
    });

    it("keeps insertion order", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await submitNew(widget, ADA);
      await submitNew(widget, GRACE);

      expect(roster(widget).map((employee) => employee.name)).to.deep.equal([
        "Ada Lovelace",
        "Grace Hopper",
      ]);
    });

    it("collapses the form once the employee is added", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await pressHeroButton(widget);
      await submitNew(widget, ADA);

      expect(isFormOpen(widget)).to.equal(false);
    });
  });

  describe("editing", () => {
    it("opens the form loaded with the chosen employee", async () => {
      const widget = await widgetWithTwo();
      const target = roster(widget)[1]!;

      await emitFromDetails(widget, "employee-edit", target);

      expect(isFormOpen(widget)).to.equal(true);
      expect(formOf(widget).employeeToEdit).to.deep.equal(target);
    });

    it("replaces only the edited employee", async () => {
      const widget = await widgetWithTwo();
      const target = roster(widget)[0]!;

      await emitFromDetails(widget, "employee-edit", target);
      await emitFromForm(widget, "employee-updated", {
        ...target,
        designation: "VP Engineering",
      });

      expect(roster(widget)).to.have.lengthOf(2);
      expect(roster(widget)[0]!.designation).to.equal("VP Engineering");
      expect(roster(widget)[1]!.name).to.equal("Grace Hopper");
    });

    it("closes and clears the form after an update", async () => {
      const widget = await widgetWithTwo();
      const target = roster(widget)[0]!;

      await emitFromDetails(widget, "employee-edit", target);
      await emitFromForm(widget, "employee-updated", {
        ...target,
        name: "Ada L.",
      });

      expect(isFormOpen(widget)).to.equal(false);
      expect(formOf(widget).employeeToEdit).to.equal(null);
    });

    it("closes and clears the form when the edit is cancelled", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-edit", roster(widget)[0]!);
      await emitFromForm(widget, "edit-cancelled");

      expect(isFormOpen(widget)).to.equal(false);
      expect(formOf(widget).employeeToEdit).to.equal(null);
    });

    it("ignores an update for an employee that is no longer on the roster", async () => {
      const widget = await widgetWithTwo();
      const before = [...roster(widget)];

      await emitFromForm(widget, "employee-updated", {
        ...ADA,
        id: "not-on-the-roster",
      });

      expect(roster(widget)).to.deep.equal(before);
    });
  });

  describe("deleting", () => {
    it("removes the employee from the roster", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-delete", roster(widget)[0]!);

      expect(roster(widget).map((employee) => employee.name)).to.deep.equal([
        "Grace Hopper",
      ]);
    });

    it("closes the form when the employee being edited is deleted", async () => {
      const widget = await widgetWithTwo();
      const target = roster(widget)[0]!;

      await emitFromDetails(widget, "employee-edit", target);
      expect(isFormOpen(widget)).to.equal(true);

      await emitFromDetails(widget, "employee-delete", target);

      expect(isFormOpen(widget)).to.equal(false);
      expect(formOf(widget).employeeToEdit).to.equal(null);
    });

    it("leaves an unrelated edit in progress alone", async () => {
      const widget = await widgetWithTwo();
      const beingEdited = roster(widget)[0]!;
      const beingDeleted = roster(widget)[1]!;

      await emitFromDetails(widget, "employee-edit", beingEdited);
      await emitFromDetails(widget, "employee-delete", beingDeleted);

      expect(isFormOpen(widget)).to.equal(true);
      expect(formOf(widget).employeeToEdit).to.deep.equal(beingEdited);
    });

    it("ignores a delete for an employee that is not on the roster", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-delete", {
        ...ADA,
        id: "not-on-the-roster",
      });

      expect(roster(widget)).to.have.lengthOf(2);
    });
  });

  describe("toasts", () => {
    it("stays quiet until something happens", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      expect(toastOf(widget).open).to.equal(false);
    });

    it("confirms a delete", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-delete", roster(widget)[0]!);

      expect(toastOf(widget).open).to.equal(true);
      expect(toastOf(widget).variant).to.equal("success");
      expect(toastOf(widget).message).to.equal("Employee deleted successfully!");
    });

    it("confirms a delete made while that employee was being edited", async () => {
      const widget = await widgetWithTwo();
      const target = roster(widget)[0]!;

      await emitFromDetails(widget, "employee-edit", target);
      await emitFromDetails(widget, "employee-delete", target);

      expect(isFormOpen(widget)).to.equal(false);
      expect(toastOf(widget).message).to.equal("Employee deleted successfully!");
    });

    it("says nothing when the delete removed nobody", async () => {
      const widget = await widgetWithTwo();

      await emitFromDetails(widget, "employee-delete", {
        ...ADA,
        id: "not-on-the-roster",
      });

      expect(toastOf(widget).open).to.equal(false);
    });

    it("leaves the add confirmation to the form's own toast", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");

      await submitNew(widget, ADA);

      expect(
        toastOf(widget).open,
        "the form already confirms adds, so the widget must not double up",
      ).to.equal(false);
    });
  });

  describe("event containment", () => {
    it("keeps the child events from escaping to the host document", async () => {
      const widget = await mount<EmployeeWidget>("employee-widget");
      const escaped = [
        "employee-added",
        "employee-updated",
        "employee-edit",
        "employee-delete",
        "add-employee",
        "form-close",
      ].map((type) => recordEvents(document.body, type));

      await pressHeroButton(widget);
      await submitNew(widget, ADA);
      await emitFromDetails(widget, "employee-edit", roster(widget)[0]!);
      await emitFromDetails(widget, "employee-delete", roster(widget)[0]!);
      await emitFromDetails(widget, "add-employee");
      await emitFromForm(widget, "form-close");

      expect(escaped.map((events) => events.length)).to.deep.equal([
        0, 0, 0, 0, 0, 0,
      ]);
    });
  });
});
