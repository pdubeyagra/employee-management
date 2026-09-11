import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@/components/ui/ui-select.ts";

import { generateThemeCSSVariables } from "@/theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "@/theme/layout.js";
import type {
  SelectChangeDetail,
  SelectOption,
} from "@/components/ui/ui-select.ts";

export type PaginationPage = number | "ellipsis";

export type PaginationDirection = "previous" | "next";

export interface PageSizeChangeDetail {
  pageSize: number;

  page: number;
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [1, 5, 10, 20];

@customElement("pagination-control")
export class PaginationControl extends LitElement {
  @property({ type: Number })
  currentPage = 1;

  @property({ type: Number })
  totalPages = 0;

  @property({ type: Number })
  totalItems = 0;

  @property({ type: Number })
  pageSize = 10;

  @property({ attribute: false })
  pageSizeOptions: number[] = DEFAULT_PAGE_SIZE_OPTIONS;

  @property({ type: Boolean })
  showItemCount = true;

  @property({ type: Boolean })
  showFirstLast = true;

  @property({ type: Boolean })
  showPageSize = true;

  @property({ type: Boolean })
  loading = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;

      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};

      color: var(--color-text-secondary);

      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
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
      flex-wrap: wrap;
      width: 100%;
      min-width: 0;
      gap: clamp(var(--spacing-sm), 2vw, var(--spacing-xl));
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .summary {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
      flex-wrap: wrap;
      gap: clamp(var(--spacing-sm), 2vw, var(--spacing-lg));
      min-width: 0;
    }

    .item-count {
      flex: 0 1 auto;

      color: var(--color-text-tertiary);

      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      line-height: var(--line-height-relaxed);

      white-space: nowrap;
    }

    .page-size {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      gap: var(--spacing-sm);
    }

    .page-size-label {
      color: var(--color-text-tertiary);
      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      line-height: var(--line-height-relaxed);
      white-space: nowrap;
    }

    .controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: clamp(2px, 1vw, var(--spacing-md));

      min-width: 0;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: clamp(32px, 5vw, 40px);
      height: clamp(32px, 5vw, 40px);

      padding: 0 clamp(4px, 1vw, var(--spacing-md));

      color: var(--color-text-secondary);
      background: var(--color-background);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);

      font-family: inherit;
      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      font-weight: 600;

      cursor: pointer;

      transition:
        background-color var(--transition-fast) ease,
        border-color var(--transition-fast) ease,
        color var(--transition-fast) ease;
    }

    button:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-text-secondary);
    }

    button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.2);
      outline-offset: 2px;
    }

    button:disabled {
      color: var(--color-border-secondary);
      background: var(--color-background-secondary);

      border-color: var(--color-border);

      cursor: not-allowed;
    }

    .page-button.active {
      color: var(--color-text-inverse);
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    .page-button.active:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
    }

    .arrow {
      width: clamp(14px, 2vw, 18px);
      height: clamp(14px, 2vw, 18px);
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: clamp(24px, 4vw, 32px);
      height: clamp(32px, 5vw, 40px);

      color: var(--color-text-tertiary);

      font-size: clamp(var(--font-size-sm), 1.5vw, var(--font-size-base));
      user-select: none;
    }

    .mobile-page {
      display: none;
    }

    @media (max-width: 768px) {
      .pagination {
        justify-content: center;
      }

      .summary {
        width: 100%;
        justify-content: center;
        order: 1;
      }

      .item-count {
        width: 100%;
        text-align: center;
      }

      .controls {
        width: 100%;
        justify-content: center;
        order: 2;
      }

      .desktop-pages {
        display: none;
      }

      .mobile-page {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-width: clamp(36px, 5vw, 44px);
        height: clamp(36px, 5vw, 44px);

        padding: 0 clamp(4px, 1vw, var(--spacing-md));

        color: var(--color-text-inverse);
        background: var(--color-primary);

        border: 1px solid var(--color-primary);
        border-radius: var(--radius-md);

        font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
        font-weight: 600;
      }

      .first-last {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  get resolvedTotalPages(): number {
    if (this.totalPages > 0) {
      return this.totalPages;
    }

    const size = Math.max(1, this.pageSize);

    return Math.max(1, Math.ceil(Math.max(0, this.totalItems) / size));
  }

  private get safeCurrentPage() {
    return Math.min(Math.max(1, this.currentPage), this.resolvedTotalPages);
  }

  private get pageSizeSelectOptions(): SelectOption[] {
    const sizes = this.pageSizeOptions.includes(this.pageSize)
      ? this.pageSizeOptions
      : [...this.pageSizeOptions, this.pageSize].sort((a, b) => a - b);

    return sizes.map((size) => ({
      value: String(size),
      label: String(size),
    }));
  }

  private get pages() {
    const total = this.resolvedTotalPages;
    const current = this.safeCurrentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const result: PaginationPage[] = [];

    result.push(1);

    if (current > 4) {
      result.push("ellipsis");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let page = start; page <= end; page++) {
      result.push(page);
    }

    if (current < total - 3) {
      result.push("ellipsis");
    }

    result.push(total);

    const seen = new Set<number>();

    return result.filter((item) => {
      if (item === "ellipsis") {
        return true;
      }

      if (seen.has(item)) {
        return false;
      }

      seen.add(item);

      return true;
    });
  }

  private changePage(page: number) {
    if (this.loading) {
      return;
    }

    const nextPage = Math.min(Math.max(1, page), this.resolvedTotalPages);

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

  private handlePageSizeChange(event: CustomEvent<SelectChangeDetail>) {
    event.stopPropagation();

    const nextSize = Number(event.detail.value);

    if (!Number.isFinite(nextSize) || nextSize < 1 || nextSize === this.pageSize) {
      return;
    }

    const firstItemIndex = (this.safeCurrentPage - 1) * this.pageSize;
    const nextPage = Math.floor(firstItemIndex / nextSize) + 1;

    this.dispatchEvent(
      new CustomEvent<PageSizeChangeDetail>("page-size-change", {
        detail: {
          pageSize: nextSize,
          page: nextPage,
        },
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

  private renderArrow(direction: PaginationDirection) {
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

  private get pageSizeTemplate() {
    if (!this.showPageSize) {
      return nothing;
    }

    return html`
      <div class="page-size">

        <span class="page-size-label" aria-hidden="true">Rows per page</span>

        <ui-select
          compact
          label="Rows per page"
          .options=${this.pageSizeSelectOptions}
          .value=${String(this.pageSize)}
          ?disabled=${this.loading}
          @select-change=${this.handlePageSizeChange}
        ></ui-select>
      </div>
    `;
  }

  render() {
    const current = this.safeCurrentPage;
    const total = this.resolvedTotalPages;

    const startItem =
      this.totalItems === 0 ? 0 : (current - 1) * this.pageSize + 1;

    const endItem =
      this.totalItems === 0
        ? 0
        : Math.min(current * this.pageSize, this.totalItems);

    const atStart = current === 1 || this.loading;
    const atEnd = current === total || this.loading;

    return html`
      <nav
        class="pagination"
        aria-label="Employee table pagination"
        aria-busy=${this.loading ? "true" : "false"}
      >
        <div class="summary">
          ${this.showItemCount
            ? html`
                <div class="item-count">
                  ${this.totalItems === 0
                    ? "No employees"
                    : `Showing ${startItem}-${endItem} of ${this.totalItems}`}
                </div>
              `
            : nothing}
          ${this.pageSizeTemplate}
        </div>

        <div class="controls">
          ${this.showFirstLast
            ? html`
                <button
                  type="button"
                  class="first-last"
                  @click=${this.firstPage}
                  ?disabled=${atStart}
                  aria-label="First page"
                >
                  «
                </button>
              `
            : ""}

          <button
            type="button"
            @click=${this.previousPage}
            ?disabled=${atStart}
            aria-label="Previous page"
          >
            ${this.renderArrow("previous")}
          </button>

          <div class="desktop-pages">
            ${this.pages.map((page) =>
              page === "ellipsis"
                ? html` <span class="ellipsis" aria-hidden="true"> … </span> `
                : html`
                    <button
                      type="button"
                      class="page-button ${page === current ? "active" : ""}"
                      @click=${() => this.changePage(page)}
                      ?disabled=${this.loading}
                      aria-current=${page === current ? "page" : "false"}
                      aria-label="Page ${page}"
                    >
                      ${page}
                    </button>
                  `,
            )}
          </div>

          <span
            class="mobile-page"
            aria-label="Current page ${current} of ${total}"
          >
            ${current} / ${total}
          </span>

          <button
            type="button"
            @click=${this.nextPage}
            ?disabled=${atEnd}
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
                  ?disabled=${atEnd}
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
