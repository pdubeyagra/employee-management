import { expect } from "chai";

import "../../src/components/pagination-control.ts";
import type { PaginationControl } from "../../src/components/pagination-control.ts";
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

function byLabel(element: Element, label: string) {
  return queryRequired<HTMLButtonElement>(element, `[aria-label="${label}"]`);
}

const ELLIPSIS = "…";

function pageStrip(control: PaginationControl): (number | string)[] {
  return queryAll(control, ".desktop-pages > *").map((node) => {
    const label = text(node);

    return label === ELLIPSIS ? ELLIPSIS : Number(label);
  });
}

describe("<pagination-control>", () => {
  describe("page strip", () => {
    it("lists every page while there are seven or fewer", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 7,
        currentPage: 4,
      });

      expect(pageStrip(control)).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
    });

    it("shows a single page when there is nothing to paginate", async () => {
      const control = await mount<PaginationControl>("pagination-control");

      expect(pageStrip(control)).to.deep.equal([1]);
    });

    it("elides only the right side while near the start", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 20,
        currentPage: 2,
      });

      expect(pageStrip(control)).to.deep.equal([1, 2, 3, ELLIPSIS, 20]);
    });

    it("elides both sides while in the middle", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 20,
        currentPage: 10,
      });

      expect(pageStrip(control)).to.deep.equal([
        1,
        ELLIPSIS,
        9,
        10,
        11,
        ELLIPSIS,
        20,
      ]);
    });

    it("keeps both gap markers rather than treating them as duplicates", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 20,
        currentPage: 10,
      });

      expect(
        pageStrip(control).filter((entry) => entry === ELLIPSIS),
      ).to.have.lengthOf(2);
    });

    it("elides only the left side while near the end", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 20,
        currentPage: 19,
      });

      expect(pageStrip(control)).to.deep.equal([1, ELLIPSIS, 18, 19, 20]);
    });

    it("never repeats the first or last page", async () => {
      for (let currentPage = 1; currentPage <= 12; currentPage++) {
        const control = await mount<PaginationControl>("pagination-control", {
          totalPages: 12,
          currentPage,
        });

        const numbers = pageStrip(control).filter(
          (entry) => entry !== ELLIPSIS,
        );

        expect(new Set(numbers).size, `page ${currentPage}`).to.equal(
          numbers.length,
        );
      }
    });

    it("marks the current page as active and aria-current", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 3,
      });

      const active = queryAll(control, ".page-button.active");

      expect(active).to.have.lengthOf(1);
      expect(text(active[0]!)).to.equal("3");
      expect(active[0]!.getAttribute("aria-current")).to.equal("page");
    });
  });

  describe("out-of-range current page", () => {
    it("clamps a page below one up to the first page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 0,
      });

      expect(byLabel(control, "Previous page").disabled).to.equal(true);
      expect(text(queryRequired(control, ".mobile-page"))).to.equal("1 / 5");
    });

    it("clamps a page beyond the last down to the last page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 99,
      });

      expect(byLabel(control, "Next page").disabled).to.equal(true);
      expect(text(queryRequired(control, ".mobile-page"))).to.equal("5 / 5");
    });
  });

  describe("navigation", () => {
    it("emits page-change with the next page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 2,
      });
      const events = recordEvents<number>(control, "page-change");

      click(byLabel(control, "Next page"));

      expect(events).to.have.lengthOf(1);
      expect(events[0]!.detail).to.equal(3);
      expect(events[0]!.composed).to.equal(true);
    });

    it("emits page-change with the previous page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 2,
      });
      const events = recordEvents<number>(control, "page-change");

      click(byLabel(control, "Previous page"));

      expect(events[0]!.detail).to.equal(1);
    });

    it("jumps to the first and last pages", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 9,
        currentPage: 5,
      });
      const events = recordEvents<number>(control, "page-change");

      click(byLabel(control, "First page"));
      click(byLabel(control, "Last page"));

      expect(events.map((event) => event.detail)).to.deep.equal([1, 9]);
    });

    it("emits page-change when a numbered page is clicked", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 1,
      });
      const events = recordEvents<number>(control, "page-change");

      click(byLabel(control, "Page 4"));

      expect(events[0]!.detail).to.equal(4);
    });

    it("stays silent when the requested page is the current one", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 3,
      });
      const events = recordEvents<number>(control, "page-change");

      click(byLabel(control, "Page 3"));

      expect(events).to.have.lengthOf(0);
    });

    it("leaves currentPage to the parent instead of moving itself", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 2,
      });

      click(byLabel(control, "Next page"));
      await control.updateComplete;

      expect(
        control.currentPage,
        "the control is controlled - the parent owns currentPage",
      ).to.equal(2);
    });

    it("disables the backward controls on the first page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 1,
      });

      expect(byLabel(control, "First page").disabled).to.equal(true);
      expect(byLabel(control, "Previous page").disabled).to.equal(true);
      expect(byLabel(control, "Next page").disabled).to.equal(false);
      expect(byLabel(control, "Last page").disabled).to.equal(false);
    });

    it("disables the forward controls on the last page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalPages: 5,
        currentPage: 5,
      });

      expect(byLabel(control, "Next page").disabled).to.equal(true);
      expect(byLabel(control, "Last page").disabled).to.equal(true);
      expect(byLabel(control, "Previous page").disabled).to.equal(false);
    });

    it("disables every direction when there is only one page", async () => {
      const control = await mount<PaginationControl>("pagination-control");

      expect(byLabel(control, "Previous page").disabled).to.equal(true);
      expect(byLabel(control, "Next page").disabled).to.equal(true);
    });
  });

  describe("item count", () => {
    it("reports the slice shown on the current page", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalItems: 25,
        totalPages: 3,
        currentPage: 2,
        pageSize: 10,
      });

      expect(text(query(control, ".item-count"))).to.equal(
        "Showing 11-20 of 25",
      );
    });

    it("caps the last page's range at the total", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalItems: 25,
        totalPages: 3,
        currentPage: 3,
        pageSize: 10,
      });

      expect(text(query(control, ".item-count"))).to.equal(
        "Showing 21-25 of 25",
      );
    });

    it("says so when there are no employees at all", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalItems: 0,
      });

      expect(text(query(control, ".item-count"))).to.equal("No employees");
    });

    it("can be hidden", async () => {
      const control = await mount<PaginationControl>("pagination-control", {
        totalItems: 25,
        showItemCount: false,
      });

      expect(query(control, ".item-count")).to.equal(null);
    });
  });

  it("can hide the first/last shortcuts", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalPages: 5,
      currentPage: 3,
      showFirstLast: false,
    });

    expect(query(control, '[aria-label="First page"]')).to.equal(null);
    expect(query(control, '[aria-label="Last page"]')).to.equal(null);
    expect(query(control, '[aria-label="Previous page"]')).to.not.equal(null);
  });

  it("labels itself for screen readers", async () => {
    const control = await mount<PaginationControl>("pagination-control");

    expect(queryRequired(control, "nav").getAttribute("aria-label")).to.equal(
      "Employee table pagination",
    );
  });

  it("re-renders the strip when the page changes", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalPages: 20,
      currentPage: 1,
    });

    expect(pageStrip(control)).to.deep.equal([1, 2, ELLIPSIS, 20]);

    await update(control, { currentPage: 10 });

    expect(pageStrip(control)).to.deep.equal([
      1,
      ELLIPSIS,
      9,
      10,
      11,
      ELLIPSIS,
      20,
    ]);
  });
});
