import { expect } from "chai";

import "@/components/shared/pagination-control.ts";
import type {
  PageSizeChangeDetail,
  PaginationControl,
} from "@/components/shared/pagination-control.ts";
import type { UiSelect } from "@/components/ui/ui-select.ts";
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

const nativeSelectOf = (control: PaginationControl) =>
  queryRequired<HTMLSelectElement>(
    queryRequired<UiSelect>(control, "ui-select"),
    "select",
  );

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

describe("<pagination-control> page size", () => {
  const sizeSelect = (control: PaginationControl) =>
    queryRequired<UiSelect>(control, "ui-select");

  const nativeSizeSelect = (control: PaginationControl) =>
    queryRequired<HTMLSelectElement>(sizeSelect(control), "select");

  function chooseSize(control: PaginationControl, size: number) {
    const select = nativeSizeSelect(control);

    select.value = String(size);

    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  it("offers 1, 5, 10 and 20 rows per page", async () => {
    const control = await mount<PaginationControl>("pagination-control");

    expect(
      queryAll<HTMLOptionElement>(sizeSelect(control), "option")
        .filter((option) => option.value !== "")
        .map((option) => Number(option.value)),
    ).to.deep.equal([1, 5, 10, 20]);
  });

  it("shows the size currently in force", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      pageSize: 5,
    });

    expect(nativeSizeSelect(control).value).to.equal("5");
  });

  it("keeps an unlisted size selectable rather than dropping it", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      pageSize: 25,
    });

    expect(
      queryAll<HTMLOptionElement>(sizeSelect(control), "option")
        .filter((option) => option.value !== "")
        .map((option) => Number(option.value)),
    ).to.deep.equal([1, 5, 10, 20, 25]);
    expect(nativeSizeSelect(control).value).to.equal("25");
  });

  it("takes a custom list of sizes", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      pageSizeOptions: [15, 30],
      pageSize: 15,
    });

    expect(
      queryAll<HTMLOptionElement>(sizeSelect(control), "option")
        .filter((option) => option.value !== "")
        .map((option) => Number(option.value)),
    ).to.deep.equal([15, 30]);
  });

  it("can be hidden", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      showPageSize: false,
    });

    expect(query(control, "ui-select")).to.equal(null);
  });

  it("emits page-size-change with the new size", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 10,
      currentPage: 1,
    });
    const events = recordEvents<PageSizeChangeDetail>(
      control,
      "page-size-change",
    );

    chooseSize(control, 20);

    expect(events).to.have.lengthOf(1);
    expect(events[0]!.detail.pageSize).to.equal(20);
    expect(events[0]!.composed).to.equal(true);
  });

  it("suggests the page that keeps the current first row in view", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 10,
      currentPage: 3,
    });
    const events = recordEvents<PageSizeChangeDetail>(
      control,
      "page-size-change",
    );

    // Page 3 of 10 starts at row 21, which sits on page 2 once rows are 20.
    chooseSize(control, 20);

    expect(events[0]!.detail).to.deep.equal({ pageSize: 20, page: 2 });
  });

  it("moves further out when the size shrinks", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 20,
      currentPage: 2,
    });
    const events = recordEvents<PageSizeChangeDetail>(
      control,
      "page-size-change",
    );

    // Row 21 is the 21st row, which is page 5 when rows are 5 at a time.
    chooseSize(control, 5);

    expect(events[0]!.detail).to.deep.equal({ pageSize: 5, page: 5 });
  });

  it("stays silent when the size did not actually change", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      pageSize: 10,
    });
    const events = recordEvents<PageSizeChangeDetail>(
      control,
      "page-size-change",
    );

    chooseSize(control, 10);

    expect(events).to.have.lengthOf(0);
  });

  it("leaves pageSize to the parent instead of moving itself", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      pageSize: 10,
    });

    chooseSize(control, 20);
    await control.updateComplete;

    expect(control.pageSize).to.equal(10);
  });
});

describe("<pagination-control> server-driven pagination", () => {
  it("works out the page count from a row count", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 95,
      pageSize: 10,
    });

    expect(control.resolvedTotalPages).to.equal(10);
    expect(pageStrip(control)).to.deep.equal([1, 2, ELLIPSIS, 10]);
  });

  it("re-derives the page count when the size changes", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 10,
    });

    expect(control.resolvedTotalPages).to.equal(10);

    await update(control, { pageSize: 20 });

    expect(control.resolvedTotalPages).to.equal(5);
  });

  it("lets an explicit page count win, for sources that report pages", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 95,
      pageSize: 10,
      totalPages: 4,
    });

    expect(control.resolvedTotalPages).to.equal(4);
  });

  it("still shows a single page when the source is empty", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 0,
      pageSize: 10,
    });

    expect(control.resolvedTotalPages).to.equal(1);
  });

  it("disables every control while a page is being fetched", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 10,
      currentPage: 5,
      loading: true,
    });

    for (const label of ["First page", "Previous page", "Next page", "Last page"]) {
      expect(byLabel(control, label).disabled, label).to.equal(true);
    }

    expect(
      queryAll<HTMLButtonElement>(control, ".page-button").every(
        (button) => button.disabled,
      ),
    ).to.equal(true);
    expect(nativeSelectOf(control).disabled).to.equal(true);
  });

  it("refuses to emit a page change while loading", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      totalItems: 100,
      pageSize: 10,
      currentPage: 5,
      loading: true,
    });
    const events = recordEvents<number>(control, "page-change");

    click(byLabel(control, "Next page"));

    expect(events).to.have.lengthOf(0);
  });

  it("announces that it is busy", async () => {
    const control = await mount<PaginationControl>("pagination-control", {
      loading: true,
    });

    expect(queryRequired(control, "nav").getAttribute("aria-busy")).to.equal(
      "true",
    );
  });
});
