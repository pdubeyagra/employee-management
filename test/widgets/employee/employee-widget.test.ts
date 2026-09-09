import { expect } from "chai";

import "../../../src/widgets/employee/employee-widget.ts";
import type { EmployeeWidget } from "../../../src/widgets/employee/employee-widget.ts";
import type { EmployeeForm } from "../../../src/widgets/employee/employee-form.ts";
import type { EmployeeDetails } from "../../../src/widgets/employee/employee-details.ts";
import type { UiButton } from "../../../src/components/ui/ui-button.ts";
import type { AppToast } from "../../../src/components/shared/toast.ts";
import type { NewEmployee } from "../../../src/types/employee-types.ts";
import { employeeStore } from "../../../src/widgets/employee/employee-store.ts";
import {
  click,
  mount,
  query,
  queryRequired,
  recordEvents,
  text,
} from "../../helpers/dom.ts";

const formOf = (page: EmployeeWidget) =>
  queryRequired<EmployeeForm>(page, "employee-form");

const detailsOf = (page: EmployeeWidget) =>
  queryRequired<EmployeeDetails>(page, "employee-details");

const formPanelOf = (page: EmployeeWidget) => queryRequired(page, ".form-panel");

const toastOf = (page: EmployeeWidget) =>
  queryRequired<AppToast>(page, "app-toast");

const isFormOpen = (page: EmployeeWidget) =>
  formPanelOf(page).className.includes("open");

const roster = (page: EmployeeWidget) => detailsOf(page).employees;

async function pressAddEmployee(page: EmployeeWidget) {
  const button = queryRequired<UiButton>(page, ".hero-actions ui-button");

  click(queryRequired<HTMLButtonElement>(button, "button"));

  await page.updateComplete;
}

async function submitNew(page: EmployeeWidget, employee: NewEmployee) {
  formOf(page).dispatchEvent(
    new CustomEvent("employee-added", {
      detail: employee,
      bubbles: true,
      composed: true,
    }),
  );

  await page.updateComplete;
}

async function emitFromDetails(
  page: EmployeeWidget,
  type: string,
  detail?: unknown,
) {
  detailsOf(page).dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );

  await page.updateComplete;
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

describe("<employee-widget>", () => {
  beforeEach(() => {
    employeeStore.reset();
  });

  describe("initial state", () => {
    it("renders the hero, form and details", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      expect(text(query(page, ".hero-title"))).to.equal("Employee Management");
      expect(query(page, "employee-form")).to.not.equal(null);
      expect(query(page, "employee-details")).to.not.equal(null);
    });

    it("starts with an empty roster and a collapsed form", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      expect(roster(page)).to.deep.equal([]);
      expect(isFormOpen(page)).to.equal(false);
      expect(formOf(page).employeeToEdit).to.equal(null);
    });
  });

  describe("opening the form", () => {
    it("expands the panel when Add Employee is pressed", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await pressAddEmployee(page);

      expect(isFormOpen(page)).to.equal(true);
    });

    it("expands the panel when the details view asks to add", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await emitFromDetails(page, "add-employee");

      expect(isFormOpen(page)).to.equal(true);
    });

    it("opens in add mode, not edit mode", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await pressAddEmployee(page);

      expect(formOf(page).employeeToEdit).to.equal(null);
    });
  });

  describe("adding", () => {
    it("appends the employee with a generated id", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);

      expect(roster(page)).to.have.lengthOf(1);
      expect(roster(page)[0]).to.include(ADA);
      expect(roster(page)[0]!.id).to.be.a("string").and.to.have.length.above(0);
    });

    it("gives each employee a distinct id", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);
      await submitNew(page, ADA);

      const [first, second] = roster(page);

      expect(first!.id).to.not.equal(second!.id);
    });

    it("keeps insertion order", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);
      await submitNew(page, GRACE);

      expect(roster(page).map((employee) => employee.name)).to.deep.equal([
        "Ada Lovelace",
        "Grace Hopper",
      ]);
    });

    it("collapses the form once the employee is added", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await pressAddEmployee(page);
      await submitNew(page, ADA);

      expect(isFormOpen(page)).to.equal(false);
    });
  });

  describe("editing", () => {
    async function pageWithTwo() {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);
      await submitNew(page, GRACE);

      return page;
    }

    it("opens the form loaded with the chosen employee", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[1]!;

      await emitFromDetails(page, "employee-edit", target);

      expect(isFormOpen(page)).to.equal(true);
      expect(formOf(page).employeeToEdit).to.deep.equal(target);
    });

    it("replaces only the edited employee", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[0]!;

      await emitFromDetails(page, "employee-edit", target);

      formOf(page).dispatchEvent(
        new CustomEvent("employee-updated", {
          detail: { ...target, designation: "VP Engineering" },
          bubbles: true,
          composed: true,
        }),
      );

      await page.updateComplete;

      expect(roster(page)).to.have.lengthOf(2);
      expect(roster(page)[0]!.designation).to.equal("VP Engineering");
      expect(roster(page)[1]!.name).to.equal("Grace Hopper");
    });

    it("closes and clears the form after an update", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[0]!;

      await emitFromDetails(page, "employee-edit", target);

      formOf(page).dispatchEvent(
        new CustomEvent("employee-updated", {
          detail: { ...target, name: "Ada L." },
          bubbles: true,
          composed: true,
        }),
      );

      await page.updateComplete;

      expect(isFormOpen(page)).to.equal(false);
      expect(formOf(page).employeeToEdit).to.equal(null);
    });

    it("closes and clears the form when the edit is cancelled", async () => {
      const page = await pageWithTwo();

      await emitFromDetails(page, "employee-edit", roster(page)[0]!);

      formOf(page).dispatchEvent(
        new CustomEvent("edit-cancelled", { bubbles: true, composed: true }),
      );

      await page.updateComplete;

      expect(isFormOpen(page)).to.equal(false);
      expect(formOf(page).employeeToEdit).to.equal(null);
    });

    it("ignores an update for an employee that is no longer on the roster", async () => {
      const page = await pageWithTwo();
      const before = [...roster(page)];

      formOf(page).dispatchEvent(
        new CustomEvent("employee-updated", {
          detail: { ...ADA, id: "not-on-the-roster" },
          bubbles: true,
          composed: true,
        }),
      );

      await page.updateComplete;

      expect(roster(page)).to.deep.equal(before);
    });
  });

  describe("deleting", () => {
    async function pageWithTwo() {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);
      await submitNew(page, GRACE);

      return page;
    }

    it("removes the employee from the roster", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[0]!;

      await emitFromDetails(page, "employee-delete", target);

      expect(roster(page).map((employee) => employee.name)).to.deep.equal([
        "Grace Hopper",
      ]);
    });

    it("closes the form when the employee being edited is deleted", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[0]!;

      await emitFromDetails(page, "employee-edit", target);
      expect(isFormOpen(page)).to.equal(true);

      await emitFromDetails(page, "employee-delete", target);

      expect(isFormOpen(page)).to.equal(false);
      expect(formOf(page).employeeToEdit).to.equal(null);
    });

    it("leaves an unrelated edit in progress alone", async () => {
      const page = await pageWithTwo();
      const beingEdited = roster(page)[0]!;
      const beingDeleted = roster(page)[1]!;

      await emitFromDetails(page, "employee-edit", beingEdited);
      await emitFromDetails(page, "employee-delete", beingDeleted);

      expect(isFormOpen(page)).to.equal(true);
      expect(formOf(page).employeeToEdit).to.deep.equal(beingEdited);
    });

    it("ignores a delete for an employee that is not on the roster", async () => {
      const page = await pageWithTwo();

      await emitFromDetails(page, "employee-delete", {
        ...ADA,
        id: "not-on-the-roster",
      });

      expect(roster(page)).to.have.lengthOf(2);
    });
  });

  describe("toasts", () => {
    async function pageWithTwo() {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);
      await submitNew(page, GRACE);

      return page;
    }

    it("stays quiet until something happens", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      expect(toastOf(page).open).to.equal(false);
    });

    it("confirms a delete", async () => {
      const page = await pageWithTwo();

      await emitFromDetails(page, "employee-delete", roster(page)[0]!);

      expect(toastOf(page).open).to.equal(true);
      expect(toastOf(page).variant).to.equal("success");
      expect(toastOf(page).message).to.equal("Employee deleted successfully!");
    });

    it("confirms a delete made while that employee was being edited", async () => {
      const page = await pageWithTwo();
      const target = roster(page)[0]!;

      await emitFromDetails(page, "employee-edit", target);
      await emitFromDetails(page, "employee-delete", target);

      expect(isFormOpen(page)).to.equal(false);
      expect(toastOf(page).message).to.equal("Employee deleted successfully!");
    });

    it("says nothing when the delete removed nobody", async () => {
      const page = await pageWithTwo();

      await emitFromDetails(page, "employee-delete", {
        ...ADA,
        id: "not-on-the-roster",
      });

      expect(toastOf(page).open).to.equal(false);
    });

    it("leaves the add confirmation to the form's own toast", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");

      await submitNew(page, ADA);

      expect(
        toastOf(page).open,
        "the form already confirms adds, so the page must not double up",
      ).to.equal(false);
    });
  });

  describe("event containment", () => {
    it("keeps the child events from escaping to the host document", async () => {
      const page = await mount<EmployeeWidget>("employee-widget");
      const escaped = [
        "employee-added",
        "employee-updated",
        "employee-edit",
        "employee-delete",
        "add-employee",
      ].map((type) => recordEvents(document.body, type));

      await pressAddEmployee(page);
      await submitNew(page, ADA);
      await emitFromDetails(page, "employee-edit", roster(page)[0]!);
      await emitFromDetails(page, "employee-delete", roster(page)[0]!);
      await emitFromDetails(page, "add-employee");

      expect(escaped.map((events) => events.length)).to.deep.equal([
        0, 0, 0, 0, 0,
      ]);
    });
  });
});
