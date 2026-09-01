import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/employee-table.ts";
import "./components/confirm-dialog.ts";
import "./components/pagination-control.ts";

import type { Employee } from "./components/employee-table.ts";
import { generateThemeCSSVariables } from "./theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "./theme/layout.js";

@customElement("employee-details")
export class EmployeeDetails extends LitElement {
  @property({ type: Array })
  employees: Employee[] = [];

  @state()
  private employeeToDelete: Employee | null = null;

  @state()
  private currentPage = 1;

  private readonly pageSize = 1;

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
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .pagination-wrapper {
      width: 100%;
      min-width: 0;
    }
  `;

  private get totalPages(): number {
    return Math.max(1, Math.ceil(this.employees.length / this.pageSize));
  }

  private get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.employees.slice(start, end);
  }

  private handlePageChange(event: CustomEvent<number>) {
    event.stopPropagation();

    this.currentPage = Math.min(Math.max(1, event.detail), this.totalPages);
  }

  private handleEdit(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent<Employee>("employee-edit", {
        detail: event.detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.employeeToDelete = event.detail;
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
        bubbles: true,
        composed: true,
      }),
    );

    this.employeeToDelete = null;
  }
  render() {
    return html`
      <div class="details-container">
        <employee-table
          .employees=${this.paginatedEmployees}
          @edit=${this.handleEdit}
          @delete=${this.handleDelete}
        ></employee-table>

        <div class="pagination-wrapper">
          <pagination-control
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            .totalItems=${this.employees.length}
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
}
