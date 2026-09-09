import { expect } from "chai";

import "../../../src/widgets/employee/employee-table.ts";
import type { EmployeeTable } from "../../../src/widgets/employee/employee-table.ts";
import type { Employee } from "../../../src/types/employee-types.ts";
import type { UiButton } from "../../../src/components/ui/ui-button.ts";
import { makeEmployee, makeEmployees } from "../../helpers/employees.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  update,
} from "../../helpers/dom.ts";

function rows(table: EmployeeTable) {
  return queryAll<HTMLTableRowElement>(table, "tbody tr");
}

function cellsOf(row: HTMLTableRowElement) {
  return Array.from(row.querySelectorAll("td")).map((cell) => text(cell));
}

function rowAction(row: HTMLTableRowElement, label: string) {
  const button = row.querySelector<UiButton>(
    `ui-button[aria-label="${label}"]`,
  );

  if (!button) {
    throw new Error(`No "${label}" action in this row.`);
  }

  return queryRequired<HTMLButtonElement>(button, "button");
}

describe("<employee-table>", () => {
  describe("with employees", () => {
    it("renders one row per employee under the expected headers", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: makeEmployees(3),
      });

      expect(queryAll(table, "thead th").map((th) => text(th))).to.deep.equal([
        "Name",
        "Department",
        "Designation",
        "Email",
        "Actions",
      ]);
      expect(rows(table)).to.have.lengthOf(3);
    });

    it("renders each field in its own cell", async () => {
      const employee = makeEmployee({
        name: "Ada Lovelace",
        department: "Engineering",
        designation: "Principal Engineer",
        email: "ada@example.com",
      });

      const table = await mount<EmployeeTable>("employee-table", {
        employees: [employee],
      });

      expect(cellsOf(rows(table)[0]!).slice(0, 4)).to.deep.equal([
        "AL Ada Lovelace",
        "Engineering",
        "Principal Engineer",
        "ada@example.com",
      ]);
    });

    it("derives initials from the first and last name parts", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: [
          makeEmployee({ name: "Ada Lovelace" }),
          makeEmployee({ name: "Grace Brewster Murray Hopper" }),
          makeEmployee({ name: "Prince" }),
          makeEmployee({ name: "  spaced   out  " }),
        ],
      });

      expect(
        queryAll(table, ".avatar").map((avatar) => text(avatar)),
      ).to.deep.equal(["AL", "GH", "P", "SO"]);
    });

    it("falls back to a question mark when the name is blank", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: [makeEmployee({ name: "   " })],
      });

      expect(text(query(table, ".avatar"))).to.equal("?");
    });

    it("shows an em dash for any blank field", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: [
          {
            id: "blank",
            name: "",
            department: "",
            designation: "",
            email: "",
          },
        ],
      });

      expect(cellsOf(rows(table)[0]!).slice(0, 4)).to.deep.equal([
        "? —",
        "—",
        "—",
        "—",
      ]);
    });

    it("gives the same name the same avatar colour every time", async () => {
      const first = await mount<EmployeeTable>("employee-table", {
        employees: [makeEmployee({ id: "a", name: "Ada Lovelace" })],
      });
      const second = await mount<EmployeeTable>("employee-table", {
        employees: [makeEmployee({ id: "b", name: "Ada Lovelace" })],
      });

      const variantOf = (table: EmployeeTable) =>
        queryRequired<HTMLElement>(table, ".avatar").className;

      expect(variantOf(first)).to.equal(variantOf(second));
      expect(variantOf(first)).to.match(/\bavatar-[0-5]\b/);
    });

    it("carries the avatar colour on a class, never in a style attribute", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: makeEmployees(6),
      });

      for (const avatar of queryAll<HTMLElement>(table, ".avatar")) {
        expect(avatar.hasAttribute("style")).to.equal(false);
      }
    });

    it("spreads employees across the palette", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: makeEmployees(20),
      });

      const variants = new Set(
        queryAll<HTMLElement>(table, ".avatar").map(
          (avatar) => avatar.className.match(/avatar-(\d)/)?.[1],
        ),
      );

      expect(variants.size).to.be.greaterThan(1);
    });

    it("emits edit with the employee for that row", async () => {
      const employees = makeEmployees(3);
      const table = await mount<EmployeeTable>("employee-table", {
        employees,
      });
      const events = recordEvents<Employee>(table, "edit");

      click(rowAction(rows(table)[1]!, "Edit employee"));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail).to.deep.equal(employees[1]);
      expect(
        events[0]!.composed,
        "employee data must not cross the shadow boundary",
      ).to.equal(false);
    });

    it("emits delete with the employee for that row", async () => {
      const employees = makeEmployees(3);
      const table = await mount<EmployeeTable>("employee-table", {
        employees,
      });
      const events = recordEvents<Employee>(table, "delete");

      click(rowAction(rows(table)[2]!, "Delete employee"));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail).to.deep.equal(employees[2]);
    });

    it("re-renders when the employees property is replaced", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        employees: makeEmployees(2),
      });

      expect(rows(table)).to.have.lengthOf(2);

      await update(table, { employees: makeEmployees(5) });

      expect(rows(table)).to.have.lengthOf(5);
    });
  });

  describe("empty state", () => {
    it("replaces the table with an empty state when there are no employees", async () => {
      const table = await mount<EmployeeTable>("employee-table");

      expect(query(table, "table")).to.equal(null);
      expect(query(table, ".empty-state")).to.not.equal(null);
    });

    it("invites the user to add their first employee", async () => {
      const table = await mount<EmployeeTable>("employee-table");

      expect(text(query(table, ".empty-state"))).to.contain(
        "Add your first employee to get started.",
      );
    });

    it("explains the empty result differently while a search is active", async () => {
      const table = await mount<EmployeeTable>("employee-table", {
        searchActive: true,
      });

      const message = text(query(table, ".empty-state"));

      expect(message).to.not.contain("Add your first employee");
      expect(message.toLowerCase()).to.contain("search");
    });

    it("emits add-employee from the empty state call to action", async () => {
      const table = await mount<EmployeeTable>("employee-table");
      const events = recordEvents(table, "add-employee");
      const cta = queryRequired<UiButton>(table, ".empty-state ui-button");

      click(queryRequired<HTMLButtonElement>(cta, "button"));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.composed, "stays inside the shadow boundary").to.equal(
        false,
      );
    });
  });
});
