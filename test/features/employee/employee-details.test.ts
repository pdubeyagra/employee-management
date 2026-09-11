import { expect } from "chai";

import "@/features/employee/components/employee-details.ts";
import type { EmployeeDetails } from "@/features/employee/components/employee-details.ts";
import type { EmployeeTable } from "@/features/employee/components/employee-table.ts";
import type { Employee } from "@/types/employee-types.ts";
import type { PaginationControl } from "@/components/shared/pagination-control.ts";
import type { ConfirmDialog } from "@/components/shared/confirm-dialog.ts";
import type { UiButton } from "@/components/ui/ui-button.ts";
import type { UiSelect } from "@/components/ui/ui-select.ts";
import type { UiCard } from "@/components/ui/ui-card.ts";
import { makeEmployee, makeEmployees } from "../../helpers/employees.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  typeInto,
  update,
} from "../../helpers/dom.ts";

const tableOf = (details: EmployeeDetails) =>
  queryRequired<EmployeeTable>(details, "employee-table");

const paginationOf = (details: EmployeeDetails) =>
  queryRequired<PaginationControl>(details, "pagination-control");

const dialogOf = (details: EmployeeDetails) =>
  queryRequired<ConfirmDialog>(details, "confirm-dialog");

const searchInputOf = (details: EmployeeDetails) =>
  queryRequired<HTMLInputElement>(details, ".search-input");

const visible = (details: EmployeeDetails) => tableOf(details).employees;

async function search(details: EmployeeDetails, term: string) {
  typeInto(searchInputOf(details), term);

  await details.updateComplete;
}

async function goToPage(details: EmployeeDetails, page: number) {
  paginationOf(details).dispatchEvent(
    new CustomEvent("page-change", {
      detail: page,
      bubbles: true,
      composed: true,
    }),
  );

  await details.updateComplete;
}

async function requestDelete(details: EmployeeDetails, employee: Employee) {
  tableOf(details).dispatchEvent(
    new CustomEvent("delete", {
      detail: employee,
      bubbles: true,
      composed: true,
    }),
  );

  await details.updateComplete;
}

describe("<employee-details>", () => {
  describe("layout", () => {
    it("wires the table, pagination and dialog together", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(3),
      });

      expect(text(query(details, ".details-header h2"))).to.equal(
        "Employee Table",
      );
      expect(visible(details)).to.have.lengthOf(3);
      expect(paginationOf(details).totalItems).to.equal(3);
      expect(dialogOf(details).open).to.equal(false);
    });

    it("labels the search box for screen readers", async () => {
      const details = await mount<EmployeeDetails>("employee-details");

      expect(searchInputOf(details).getAttribute("aria-label")).to.equal(
        "Search employees",
      );
    });
  });

  describe("search", () => {
    const roster = [
      makeEmployee({
        id: "1",
        name: "Ada Lovelace",
        department: "Engineering",
        designation: "Principal Engineer",
        email: "ada@example.com",
      }),
      makeEmployee({
        id: "2",
        name: "Grace Hopper",
        department: "Research",
        designation: "Rear Admiral",
        email: "grace@navy.example",
      }),
      makeEmployee({
        id: "3",
        name: "Alan Turing",
        department: "Research",
        designation: "Cryptanalyst",
        email: "alan@example.com",
      }),
    ];

    it("shows everyone when the query is empty", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "");

      expect(visible(details)).to.have.lengthOf(3);
    });

    it("matches on name", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "Grace");

      expect(visible(details).map((e) => e.id)).to.deep.equal(["2"]);
    });

    it("matches on department, designation and email too", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "Research");
      expect(visible(details).map((e) => e.id)).to.deep.equal(["2", "3"]);

      await search(details, "Cryptanalyst");
      expect(visible(details).map((e) => e.id)).to.deep.equal(["3"]);

      await search(details, "navy.example");
      expect(visible(details).map((e) => e.id)).to.deep.equal(["2"]);
    });

    it("ignores case and surrounding whitespace", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "  ADA  ");

      expect(visible(details).map((e) => e.id)).to.deep.equal(["1"]);
    });

    it("returns nothing when nobody matches", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "zzzz");

      expect(visible(details)).to.have.lengthOf(0);
    });

    it("tells the table a search is active so it can adjust its empty state", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      expect(tableOf(details).searchActive).to.equal(false);

      await search(details, "zzzz");

      expect(tableOf(details).searchActive).to.equal(true);

      await search(details, "   ");

      expect(
        tableOf(details).searchActive,
        "whitespace alone is not a search",
      ).to.equal(false);
    });

    it("counts only the matches in the pagination summary", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: roster,
      });

      await search(details, "Research");

      expect(paginationOf(details).totalItems).to.equal(2);
    });

    it("returns to the first page when the query changes", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      await goToPage(details, 3);
      expect(paginationOf(details).currentPage).to.equal(3);

      await search(details, "Employee");

      expect(paginationOf(details).currentPage).to.equal(1);
    });
  });

  describe("pagination", () => {
    it("shows at most ten employees per page", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      expect(visible(details)).to.have.lengthOf(10);
      expect(visible(details)[0]!.id).to.equal("id-1");
      expect(paginationOf(details).pageSize).to.equal(10);
      expect(paginationOf(details).totalPages).to.equal(3);
    });

    it("moves to the requested page", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      await goToPage(details, 2);

      expect(visible(details).map((e) => e.id)).to.deep.equal(
        Array.from({ length: 10 }, (_, i) => `id-${i + 11}`),
      );
    });

    it("shows the remainder on the final page", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      await goToPage(details, 3);

      expect(visible(details)).to.have.lengthOf(5);
      expect(visible(details)[4]!.id).to.equal("id-25");
    });

    it("clamps a requested page to the available range", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      await goToPage(details, 99);
      expect(paginationOf(details).currentPage).to.equal(3);

      await goToPage(details, -5);
      expect(paginationOf(details).currentPage).to.equal(1);
    });

    it("reports a single page when there are no employees", async () => {
      const details = await mount<EmployeeDetails>("employee-details");

      expect(paginationOf(details).totalPages).to.equal(1);
      expect(paginationOf(details).totalItems).to.equal(0);
    });

    describe("rows per page", () => {
      async function setPageSize(
        details: EmployeeDetails,
        pageSize: number,
        page: number,
      ) {
        paginationOf(details).dispatchEvent(
          new CustomEvent("page-size-change", {
            detail: { pageSize, page },
            bubbles: true,
            composed: true,
          }),
        );

        await details.updateComplete;
      }

      it("re-slices the roster at the new size", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(25),
        });

        await setPageSize(details, 5, 1);

        expect(visible(details)).to.have.lengthOf(5);
        expect(paginationOf(details).pageSize).to.equal(5);
        expect(paginationOf(details).totalPages).to.equal(5);
      });

      it("honours the page the pager worked out", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(25),
        });

        // Page 3 of 10 starts at row 21, which is page 5 once rows are 5.
        await goToPage(details, 3);
        await setPageSize(details, 5, 5);

        expect(paginationOf(details).currentPage).to.equal(5);
        expect(visible(details).map((employee) => employee.id)).to.deep.equal([
          "id-21",
          "id-22",
          "id-23",
          "id-24",
          "id-25",
        ]);
      });

      it("clamps to the last page when the roster no longer reaches", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(25),
        });

        await goToPage(details, 3);
        await setPageSize(details, 20, 2);

        expect(paginationOf(details).currentPage).to.equal(2);

        await setPageSize(details, 20, 9);

        expect(paginationOf(details).currentPage).to.equal(2);
      });

      it("shows every employee at the largest size", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(20),
        });

        await setPageSize(details, 20, 1);

        expect(visible(details)).to.have.lengthOf(20);
        expect(paginationOf(details).totalPages).to.equal(1);
      });

      it("re-slices when the real dropdown is used", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(25),
        });

        await goToPage(details, 3);

        const pager = paginationOf(details);
        await pager.updateComplete;

        const sizeSelect = queryRequired<UiSelect>(pager, "ui-select");
        await sizeSelect.updateComplete;

        const native = queryRequired<HTMLSelectElement>(sizeSelect, "select");

        native.value = "5";
        native.dispatchEvent(
          new Event("change", { bubbles: true, composed: true }),
        );

        await details.updateComplete;

        expect(paginationOf(details).pageSize).to.equal(5);
        // Row 21 was the first row on page 3; it heads page 5 at this size.
        expect(paginationOf(details).currentPage).to.equal(5);
        expect(visible(details)[0]!.id).to.equal("id-21");
      });

      it("keeps the page-size-change event from escaping to the host app", async () => {
        const details = await mount<EmployeeDetails>("employee-details", {
          employees: makeEmployees(25),
        });
        const escaped = recordEvents(document.body, "page-size-change");

        await setPageSize(details, 5, 1);

        expect(escaped).to.have.lengthOf(0);
      });
    });

    it("keeps the page-change event from escaping to the host app", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });
      const escaped = recordEvents(document.body, "page-change");

      await goToPage(details, 2);

      expect(escaped).to.have.lengthOf(0);
    });
  });

  describe("edit", () => {
    it("re-emits the table's edit request to the host app", async () => {
      const employees = makeEmployees(3);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const events = recordEvents<Employee>(details, "employee-edit");

      tableOf(details).dispatchEvent(
        new CustomEvent("edit", {
          detail: employees[1],
          bubbles: true,
          composed: true,
        }),
      );

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail).to.deep.equal(employees[1]);
      expect(
        events[0]!.composed,
        "employee data must not cross the shadow boundary",
      ).to.equal(false);
    });

    it("does not leak the inner edit event under its original name", async () => {
      const employees = makeEmployees(1);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const escaped = recordEvents(document.body, "edit");

      tableOf(details).dispatchEvent(
        new CustomEvent("edit", {
          detail: employees[0],
          bubbles: true,
          composed: true,
        }),
      );

      expect(escaped).to.have.lengthOf(0);
    });
  });

  describe("delete", () => {
    it("asks for confirmation instead of deleting straight away", async () => {
      const employees = makeEmployees(3);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const deletes = recordEvents<Employee>(details, "employee-delete");

      await requestDelete(details, employees[0]!);

      expect(deletes).to.have.lengthOf(0);
      expect(dialogOf(details).open).to.equal(true);
    });

    it("names the employee in the confirmation copy", async () => {
      const employee = makeEmployee({ name: "Ada Lovelace" });
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: [employee],
      });

      await requestDelete(details, employee);

      expect(dialogOf(details).title).to.equal("Delete Employee");
      expect(dialogOf(details).message).to.equal(
        "Are you sure you want to delete Ada Lovelace? This action cannot be undone.",
      );
      expect(dialogOf(details).confirmText).to.equal("Delete");
    });

    it("emits employee-delete once the dialog is confirmed", async () => {
      const employees = makeEmployees(3);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const deletes = recordEvents<Employee>(details, "employee-delete");

      await requestDelete(details, employees[1]!);
      dialogOf(details).dispatchEvent(new CustomEvent("confirm"));
      await details.updateComplete;

      expect(deletes).to.have.lengthOf(1);
      expect(deletes[0]!.detail).to.deep.equal(employees[1]);
      expect(
        deletes[0]!.composed,
        "employee data must not cross the shadow boundary",
      ).to.equal(false);
      expect(dialogOf(details).open).to.equal(false);
    });

    it("emits nothing when the dialog is cancelled", async () => {
      const employees = makeEmployees(3);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const deletes = recordEvents<Employee>(details, "employee-delete");

      await requestDelete(details, employees[1]!);
      dialogOf(details).dispatchEvent(new CustomEvent("cancel"));
      await details.updateComplete;

      expect(deletes).to.have.lengthOf(0);
      expect(dialogOf(details).open).to.equal(false);
    });

    it("forgets the pending employee after confirming, so a stray confirm is a no-op", async () => {
      const employees = makeEmployees(3);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const deletes = recordEvents<Employee>(details, "employee-delete");

      await requestDelete(details, employees[0]!);
      dialogOf(details).dispatchEvent(new CustomEvent("confirm"));
      dialogOf(details).dispatchEvent(new CustomEvent("confirm"));
      await details.updateComplete;

      expect(deletes).to.have.lengthOf(1);
    });
  });

  describe("empty state", () => {
    it("offers to add an employee when the list is empty", async () => {
      const details = await mount<EmployeeDetails>("employee-details");
      const emptyState = queryRequired(details, ".list-view .empty-state");

      expect(text(emptyState)).to.contain("No employees found");
      expect(text(emptyState)).to.contain(
        "Add an employee to see them listed here.",
      );
      expect(query(details, ".list-view .empty-state ui-button")).to.not.equal(
        null,
      );
    });

    it("suggests a different search instead of adding, when a search is active", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(3),
      });

      await search(details, "zzzz");

      const emptyState = queryRequired(details, ".list-view .empty-state");

      expect(text(emptyState)).to.contain("Try a different search term.");
      expect(
        query(details, ".list-view .empty-state ui-button"),
        "adding is not the fix for a search that found nothing",
      ).to.equal(null);
    });

    it("emits add-employee from the empty state call to action", async () => {
      const details = await mount<EmployeeDetails>("employee-details");
      const events = recordEvents(details, "add-employee");
      const cta = queryRequired<UiButton>(
        details,
        ".list-view .empty-state ui-button",
      );

      click(queryRequired<HTMLButtonElement>(cta, "button"));

      expect(events).to.have.lengthOf(1);
      expect(
        events[0]!.composed,
        "employee data must not cross the shadow boundary",
      ).to.equal(false);
    });

    it("re-emits add-employee bubbled up from the table's empty state", async () => {
      const details = await mount<EmployeeDetails>("employee-details");
      const events = recordEvents(details, "add-employee");

      tableOf(details).dispatchEvent(
        new CustomEvent("add-employee", { bubbles: true, composed: true }),
      );

      expect(
        events,
        "the inner event is stopped and re-emitted exactly once",
      ).to.have.lengthOf(1);
    });
  });

  describe("loading", () => {
    it("shows the roster rather than a placeholder by default", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(3),
      });

      expect(query(details, "app-loading")).to.equal(null);
      expect(query(details, "employee-table")).to.not.equal(null);
    });

    it("replaces both views with a skeleton while loading", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(3),
        loading: true,
      });

      expect(queryAll(details, ".loading-state")).to.have.lengthOf(2);
      expect(query(details, "employee-table")).to.equal(null);
      expect(query(details, "ui-card")).to.equal(null);
    });

    it("uses the skeleton variant sized to the page", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        loading: true,
      });

      const skeleton = queryRequired(details, "app-loading") as HTMLElement & {
        variant: string;
        lines: number;
      };

      expect(skeleton.variant).to.equal("skeleton");
      expect(skeleton.lines).to.equal(6);
    });

    it("passes its own label down to the indicator", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        loading: true,
        loadingLabel: "Fetching the team",
      });

      const skeleton = queryRequired(details, "app-loading") as HTMLElement & {
        label: string;
      };

      expect(skeleton.label).to.equal("Fetching the team");
    });

    it("blocks the pager while loading", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
        loading: true,
      });

      expect(paginationOf(details).loading).to.equal(true);

      await update(details, { loading: false });

      expect(paginationOf(details).loading).to.equal(false);
    });

    it("returns to the roster once loading finishes", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(3),
        loading: true,
      });

      await update(details, { loading: false });

      expect(query(details, ".loading-state")).to.equal(null);
      expect(query(details, "employee-table")).to.not.equal(null);
    });
  });

  describe("card list", () => {
    it("renders one card per employee on the current page", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: makeEmployees(25),
      });

      expect(queryAll(details, ".employee-card")).to.have.lengthOf(10);
    });

    it("shows the employee's fields and initials on the card", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: [
          makeEmployee({
            name: "Ada Lovelace",
            department: "Engineering",
            designation: "Principal Engineer",
            email: "ada@example.com",
          }),
        ],
      });

      const card = queryRequired<UiCard>(details, "ui-card.employee-card");

      expect(text(query(details, ".card-avatar"))).to.equal("AL");
      expect(card.heading).to.equal("Ada Lovelace");
      expect(card.badge, "the department reads as a badge").to.equal(
        "Engineering",
      );
      expect(
        queryAll(details, ".card-value").map((value) => text(value)),
      ).to.deep.equal(["Principal Engineer", "ada@example.com"]);
    });

    it("renders the name and department inside the shared card", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: [makeEmployee({ name: "Ada Lovelace" })],
      });

      const card = queryRequired<UiCard>(details, "ui-card.employee-card");
      await card.updateComplete;

      expect(text(query(card, ".heading"))).to.equal("Ada Lovelace");
      expect(text(query(card, ".badge"))).to.equal("Engineering");
    });

    it("slots the avatar into the card's icon frame", async () => {
      const details = await mount<EmployeeDetails>("employee-details", {
        employees: [makeEmployee({ name: "Ada Lovelace" })],
      });

      const card = queryRequired<UiCard>(details, "ui-card.employee-card");
      await card.updateComplete;

      expect(queryRequired<HTMLElement>(card, ".icon-wrap").hidden).to.equal(
        false,
      );
    });

    it("requests an edit from the card's edit action", async () => {
      const employees = makeEmployees(1);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });
      const events = recordEvents<Employee>(details, "employee-edit");

      const editButton = queryRequired<UiButton>(
        details,
        '.employee-card ui-button[aria-label="Edit employee"]',
      );

      click(queryRequired<HTMLButtonElement>(editButton, "button"));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail).to.deep.equal(employees[0]);
    });

    it("opens the confirmation dialog from the card's delete action", async () => {
      const employees = makeEmployees(1);
      const details = await mount<EmployeeDetails>("employee-details", {
        employees,
      });

      const deleteButton = queryRequired<UiButton>(
        details,
        '.employee-card ui-button[aria-label="Delete employee"]',
      );

      click(queryRequired<HTMLButtonElement>(deleteButton, "button"));
      await details.updateComplete;

      expect(dialogOf(details).open).to.equal(true);
      expect(dialogOf(details).message).to.contain(employees[0]!.name);
    });
  });

  it("reacts to the employees property being replaced", async () => {
    const details = await mount<EmployeeDetails>("employee-details");

    expect(visible(details)).to.have.lengthOf(0);

    await update(details, { employees: makeEmployees(4) });

    expect(visible(details)).to.have.lengthOf(4);
    expect(paginationOf(details).totalItems).to.equal(4);
  });
});
