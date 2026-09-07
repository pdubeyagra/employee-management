import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/employee/employee-table.ts";
import "./components/shared/confirm-dialog.ts";
import "./components/shared/pagination-control.ts";
import "./components/ui/ui-button.ts";

import type { Employee } from "./types/employee-types.ts";
import { generateThemeCSSVariables } from "./theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "./theme/layout.js";
import {
  generateAvatarClasses,
  getAvatarVariant,
  getInitials,
} from "./utils/avatar.js";

@customElement("employee-details")
export class EmployeeDetails extends LitElement {
  @property({ type: Array })
  employees: Employee[] = [];

  @state()
  private employeeToDelete: Employee | null = null;

  @state()
  private currentPage = 1;

  @state()
  private searchQuery = "";

  private readonly pageSize = 10;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .details-container {
      width: 100%;
      min-width: 0;
      padding: var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .details-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .details-header h2 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: clamp(var(--font-size-xl), 5vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
      flex: 1 1 auto;
      min-width: 0;
    }

    .search-bar {
      position: relative;
      flex: 0 1 280px;
      min-width: 200px;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: var(--spacing-md);
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm)
        calc(var(--spacing-md) * 2 + 16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background);
      color: var(--color-text-primary);
      font-family: inherit;
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      outline: none;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .search-input::placeholder {
      color: var(--color-text-tertiary);
    }

    .search-input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .table-view {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .list-view {
      display: none;
      width: 100%;
      min-width: 0;
    }

    @media (max-width: 768px) {
      .table-view {
        display: none;
      }

      .list-view {
        display: block;
      }
    }

    .employee-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .employee-card {
      padding: var(--spacing-lg);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
    }

    .card-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      text-transform: uppercase;
    }

    ${unsafeCSS(generateAvatarClasses(".card-avatar"))}

    .card-name {
      min-width: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .employee-card-row {
      display: grid;
      grid-template-columns: 90px minmax(0, 1fr);
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
    }

    .card-label {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-relaxed);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .card-value {
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .card-value.email {
      color: var(--color-primary);
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-border);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      min-height: 200px;
      padding: var(--spacing-2xl) var(--spacing-lg);
      color: var(--color-text-secondary);
      text-align: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
    }

    .empty-title {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-md);
      font-weight: 600;
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    .pagination-wrapper {
      width: 100%;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .search-input {
        transition: none;
      }
    }
  `;

  private get filteredEmployees(): Employee[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.employees;
    }

    return this.employees.filter((employee) =>
      [employee.name, employee.department, employee.designation, employee.email]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  private get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredEmployees.length / this.pageSize),
    );
  }

  private get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredEmployees.slice(start, end);
  }

  private handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchQuery = value;
    this.currentPage = 1;
  }

  private handlePageChange(event: CustomEvent<number>) {
    event.stopPropagation();

    this.currentPage = Math.min(Math.max(1, event.detail), this.totalPages);
  }

  private requestEdit(employee: Employee) {
    this.dispatchEvent(
      new CustomEvent<Employee>("employee-edit", {
        detail: employee,
      }),
    );
  }

  private requestDelete(employee: Employee) {
    this.employeeToDelete = employee;
  }

  private handleEdit(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.requestEdit(event.detail);
  }

  private handleDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.requestDelete(event.detail);
  }

  private handleAddEmployeeBubbled(event: Event) {
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("add-employee"));
  }

  private handleCancelDelete(event: Event) {
    event.stopPropagation();

    this.employeeToDelete = null;
  }

  private handleConfirmDelete(event: Event) {
    event.stopPropagation();

    if (!this.employeeToDelete) {
      return;
    }

    const employee = this.employeeToDelete;
    this.dispatchEvent(
      new CustomEvent<Employee>("employee-delete", {
        detail: employee,
      }),
    );

    this.employeeToDelete = null;
  }

  private get searchBarTemplate(): TemplateResult {
    return html`
      <div class="search-bar">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          type="search"
          class="search-input"
          placeholder="Search employees..."
          .value=${this.searchQuery}
          @input=${this.handleSearchInput}
          aria-label="Search employees"
        />
      </div>
    `;
  }

  private get emptyStateTemplate(): TemplateResult {
    return html`
      <div class="empty-state">
        <p class="empty-title">No employees found</p>
        <p class="empty-description">
          ${this.searchQuery
            ? "Try a different search term."
            : "Add an employee to see them listed here."}
        </p>

        ${this.searchQuery
          ? ""
          : html`
              <ui-button
                variant="primary"
                size="medium"
                shape="rounded"
                type="button"
                @button-click=${this.handleAddEmployeeBubbled}
              >
                + Add Employee
              </ui-button>
            `}
      </div>
    `;
  }

  private renderEmployeeCard(employee: Employee): TemplateResult {
    const initials = getInitials(employee.name);
    const avatarVariant = getAvatarVariant(employee.name || employee.id);

    return html`
      <li class="employee-card">
        <div class="card-top">
          <span class="card-avatar avatar-${avatarVariant}">${initials}</span>
          <span class="card-name">${employee.name || "—"}</span>
        </div>

        <div class="employee-card-row">
          <span class="card-label">Department</span>
          <span class="card-value">${employee.department || "—"}</span>
        </div>

        <div class="employee-card-row">
          <span class="card-label">Designation</span>
          <span class="card-value">${employee.designation || "—"}</span>
        </div>

        <div class="employee-card-row">
          <span class="card-label">Email</span>
          <span class="card-value email">${employee.email || "—"}</span>
        </div>

        <div class="card-actions">
          <ui-button
            variant="primary"
            size="small"
            shape="rounded"
            .iconOnly=${true}
            type="button"
            aria-label="Edit employee"
            @button-click=${() => this.requestEdit(employee)}
          >
            <svg
              slot="icon-only"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </ui-button>

          <ui-button
            variant="danger"
            size="small"
            shape="rounded"
            .iconOnly=${true}
            type="button"
            aria-label="Delete employee"
            @button-click=${() => this.requestDelete(employee)}
          >
            <svg
              slot="icon-only"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>
          </ui-button>
        </div>
      </li>
    `;
  }

  private get listViewTemplate(): TemplateResult {
    if (this.filteredEmployees.length === 0) {
      return this.emptyStateTemplate;
    }

    return html`
      <ul class="employee-list">
        ${this.paginatedEmployees.map((employee) =>
          this.renderEmployeeCard(employee),
        )}
      </ul>
    `;
  }

  private get template(): TemplateResult {
    return html`
      <div class="details-container">
        <div class="details-header">
          <h2>Employee Table</h2>
          ${this.searchBarTemplate}
        </div>

        <div class="table-view">
          <employee-table
            .employees=${this.paginatedEmployees}
            .searchActive=${this.searchQuery.trim().length > 0}
            @edit=${this.handleEdit}
            @delete=${this.handleDelete}
            @add-employee=${this.handleAddEmployeeBubbled}
          ></employee-table>
        </div>

        <div class="list-view">${this.listViewTemplate}</div>

        <div class="pagination-wrapper">
          <pagination-control
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            .totalItems=${this.filteredEmployees.length}
            .pageSize=${this.pageSize}
            @page-change=${this.handlePageChange}
          ></pagination-control>
        </div>

        <confirm-dialog
          .open=${this.employeeToDelete !== null}
          title="Delete Employee"
          .message=${this.employeeToDelete
            ? `Are you sure you want to delete ${this.employeeToDelete.name}? This action cannot be undone.`
            : "Are you sure you want to delete this employee? This action cannot be undone."}
          confirmText="Delete"
          cancelText="Cancel"
          @cancel=${this.handleCancelDelete}
          @confirm=${this.handleConfirmDelete}
        ></confirm-dialog>
      </div>
    `;
  }

  render() {
    return this.template;
  }
}
