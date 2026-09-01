import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("pagination-control")
export class PaginationControl extends LitElement {
  @property({ type: Number })
  currentPage = 1;

  @property({ type: Number })
  totalPages = 1;

  @property({ type: Number })
  totalItems = 0;

  @property({ type: Number })
  pageSize = 10;

  @property({ type: Boolean })
  showItemCount = true;

  @property({ type: Boolean })
  showFirstLast = true;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: #374151;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      min-width: 0;

      gap: 16px;
      padding: 14px 4px;
    }

    /* =========================
       Item count
       ========================= */

    .item-count {
      flex: 0 1 auto;

      color: #6b7280;

      font-size: 13px;
      line-height: 1.5;

      white-space: nowrap;
    }

    /* =========================
       Controls
       ========================= */

    .controls {
      display: flex;
      align-items: center;

      gap: 5px;

      min-width: 0;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: 36px;
      height: 36px;

      padding: 0 10px;

      color: #374151;
      background: #ffffff;

      border: 1px solid #d1d5db;
      border-radius: 7px;

      font-family: inherit;
      font-size: 13px;
      font-weight: 600;

      cursor: pointer;

      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;
    }

    button:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.2);
      outline-offset: 2px;
    }

    button:disabled {
      color: #d1d5db;
      background: #f9fafb;

      border-color: #e5e7eb;

      cursor: not-allowed;
    }

    .page-button.active {
      color: #ffffff;
      background: #2563eb;
      border-color: #2563eb;
    }

    .page-button.active:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }

    .arrow {
      width: 16px;
      height: 16px;
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 30px;
      height: 36px;

      color: #6b7280;

      font-size: 14px;
      user-select: none;
    }

    /* =========================
       Mobile current page
       ========================= */

    .mobile-page {
      display: none;
    }

    /* =========================
       Tablet
       ========================= */

    @media (max-width: 700px) {
      .pagination {
        gap: 12px;
      }

      .item-count {
        font-size: 12px;
      }

      button {
        min-width: 34px;
        height: 34px;

        padding: 0 8px;
      }
    }

    /* =========================
       Mobile
       ========================= */

    @media (max-width: 600px) {
      .pagination {
        display: flex;
        flex-wrap: wrap;

        justify-content: center;

        gap: 10px;

        padding: 14px 0;
      }

      .item-count {
        width: 100%;

        flex: none;

        text-align: center;

        order: 1;
      }

      .controls {
        width: 100%;

        justify-content: center;

        order: 2;

        gap: 6px;
      }

      /*
       * On mobile hide the long page list.
       * Only previous/current/next are shown.
       */

      .desktop-pages {
        display: none;
      }

      .mobile-page {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-width: 42px;
        height: 40px;

        padding: 0 10px;

        color: #ffffff;
        background: #2563eb;

        border: 1px solid #2563eb;
        border-radius: 7px;

        font-size: 13px;
        font-weight: 600;
      }

      button {
        min-width: 42px;
        height: 40px;
      }

      .first-last {
        display: none;
      }

      .arrow {
        width: 17px;
        height: 17px;
      }
    }

    /* =========================
       Small phones
       ========================= */

    @media (max-width: 380px) {
      .pagination {
        gap: 8px;
      }

      .controls {
        gap: 5px;
      }

      button {
        min-width: 40px;
        height: 40px;

        padding: 0 7px;
      }

      .mobile-page {
        min-width: 40px;
      }

      .item-count {
        font-size: 11px;
      }
    }

    /* =========================
       Very small screens
       ========================= */

    @media (max-width: 320px) {
      .controls {
        gap: 4px;
      }

      button {
        min-width: 38px;
        height: 38px;

        padding: 0 6px;
      }

      .mobile-page {
        min-width: 38px;
      }
    }

    /* =========================
       Reduced motion
       ========================= */

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  private get safeCurrentPage() {
    return Math.min(
      Math.max(1, this.currentPage),
      Math.max(1, this.totalPages),
    );
  }

  private get pages() {
    const total = Math.max(1, this.totalPages);
    const current = this.safeCurrentPage;

    /*
     * Show all pages when there are only a few.
     */
    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const result: Array<number | "ellipsis"> = [];

    /*
     * Always show first page.
     */
    result.push(1);

    /*
     * Left ellipsis.
     */
    if (current > 4) {
      result.push("ellipsis");
    }

    /*
     * Pages around current page.
     */
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let page = start; page <= end; page++) {
      result.push(page);
    }

    /*
     * Right ellipsis.
     */
    if (current < total - 3) {
      result.push("ellipsis");
    }

    /*
     * Always show last page.
     */
    result.push(total);

    /*
     * Remove duplicates.
     */
    return result.filter((item, index, array) => {
      return array.indexOf(item) === index;
    });
  }

  private changePage(page: number) {
    const nextPage = Math.min(Math.max(1, page), Math.max(1, this.totalPages));

    if (nextPage === this.safeCurrentPage) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<number>("page-change", {
        detail: nextPage,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private previousPage() {
    this.changePage(this.safeCurrentPage - 1);
  }

  private nextPage() {
    this.changePage(this.safeCurrentPage + 1);
  }

  private firstPage() {
    this.changePage(1);
  }

  private lastPage() {
    this.changePage(this.totalPages);
  }

  private renderArrow(direction: "previous" | "next") {
    return direction === "previous"
      ? html`
          <svg
            class="arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        `
      : html`
          <svg
            class="arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        `;
  }

  render() {
    const current = this.safeCurrentPage;
    const total = Math.max(1, this.totalPages);

    const startItem =
      this.totalItems === 0 ? 0 : (current - 1) * this.pageSize + 1;

    const endItem =
      this.totalItems === 0
        ? 0
        : Math.min(current * this.pageSize, this.totalItems);

    return html`
      <nav class="pagination" aria-label="Employee table pagination">
        ${this.showItemCount
          ? html`
              <div class="item-count">
                ${this.totalItems === 0
                  ? "No employees"
                  : `Showing ${startItem}-${endItem} of ${this.totalItems}`}
              </div>
            `
          : html`<div></div>`}

        <div class="controls">
          ${this.showFirstLast
            ? html`
                <button
                  type="button"
                  class="first-last"
                  @click=${this.firstPage}
                  ?disabled=${current === 1}
                  aria-label="First page"
                >
                  «
                </button>
              `
            : ""}

          <button
            type="button"
            @click=${this.previousPage}
            ?disabled=${current === 1}
            aria-label="Previous page"
          >
            ${this.renderArrow("previous")}
          </button>

          <!-- Desktop page numbers -->
          <div class="desktop-pages">
            ${this.pages.map((page) =>
              page === "ellipsis"
                ? html` <span class="ellipsis" aria-hidden="true"> … </span> `
                : html`
                    <button
                      type="button"
                      class="page-button ${page === current ? "active" : ""}"
                      @click=${() => this.changePage(page)}
                      aria-current=${page === current ? "page" : "false"}
                      aria-label="Page ${page}"
                    >
                      ${page}
                    </button>
                  `,
            )}
          </div>

          <!-- Mobile current page -->
          <span
            class="mobile-page"
            aria-label="Current page ${current} of ${total}"
          >
            ${current} / ${total}
          </span>

          <button
            type="button"
            @click=${this.nextPage}
            ?disabled=${current === total}
            aria-label="Next page"
          >
            ${this.renderArrow("next")}
          </button>

          ${this.showFirstLast
            ? html`
                <button
                  type="button"
                  class="first-last"
                  @click=${this.lastPage}
                  ?disabled=${current === total}
                  aria-label="Last page"
                >
                  »
                </button>
              `
            : ""}
        </div>
      </nav>
    `;
  }
}
