import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
}

@customElement("employee-table")
export class EmployeeTable extends LitElement {
  @property({ type: Array })
  employees: Employee[] = [];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
      color: var(--color-text-primary);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    /* =========================
       Container
       ========================= */

    .table-container {
      width: 100%;
      max-width: 100%;
      padding: var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    /* =========================
       Header
       ========================= */

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      min-width: 0;
      flex-wrap: wrap;
    }

    h2 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: clamp(var(--font-size-xl), 5vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
      flex: 1 1 auto;
      min-width: 0;
    }

    .employee-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-text-secondary);
      background: var(--color-background-secondary);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      line-height: 1;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* =========================
       Table Wrapper
       ========================= */

    .table-wrapper {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      -webkit-overflow-scrolling: touch;
    }

    /* =========================
       Table Styling
       ========================= */

    table {
      width: 100%;
      min-width: 800px;
      border-collapse: collapse;
      table-layout: fixed;
    }

    thead {
      background: var(--color-background-secondary);
    }

    th {
      padding: var(--spacing-lg) var(--spacing-md);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 700;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    td {
      padding: var(--spacing-lg) var(--spacing-md);
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      vertical-align: middle;
      border-bottom: 1px solid var(--color-border);
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    tbody tr {
      transition: background-color var(--transition-base);
    }

    tbody tr:hover {
      background: var(--color-background-secondary);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    /* =========================
       Column Widths
       ========================= */

    th:nth-child(1),
    td:nth-child(1) {
      width: 20%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 18%;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 20%;
    }

    th:nth-child(4),
    td:nth-child(4) {
      width: 27%;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 15%;
    }

    /* =========================
       Cell Styles
       ========================= */

    .name {
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .email {
      color: var(--color-primary);
    }

    /* =========================
       Actions
       ========================= */

    .actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      white-space: nowrap;
    }

    /* =========================
       Empty State
       ========================= */

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      padding: var(--spacing-3xl) var(--spacing-xl);
      color: var(--color-text-secondary);
      text-align: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
    }

    .empty-title {
      margin: 0 0 var(--spacing-sm);
      color: var(--color-text-secondary);
      font-size: var(--font-size-md);
      font-weight: 600;
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    /* =========================
       Responsive: Mobile Card Layout
       Uses container queries concept with flexbox
       ========================= */

    @supports (container-type: inline-size) {
      .table-wrapper {
        container-type: inline-size;
      }

      @container (max-width: 600px) {
        .table-wrapper {
          overflow: visible;
          border: none;
          border-radius: 0;
        }

        table,
        thead,
        tbody,
        tr,
        th,
        td {
          display: block;
          width: 100%;
        }

        table {
          min-width: 0;
        }

        thead {
          display: none;
        }

        tbody {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        tbody tr {
          display: block;
          padding: var(--spacing-lg);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }

        tbody tr:hover {
          background: var(--color-background);
        }

        td {
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr);
          gap: var(--spacing-md);
          padding: var(--spacing-md) 0;
          border: none;
          font-size: var(--font-size-base);
          text-align: left;
        }

        td:first-child {
          padding-top: 0;
        }

        td:last-child {
          padding-bottom: 0;
        }

        td::before {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-xs);
          line-height: var(--line-height-relaxed);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        td:nth-child(1)::before {
          content: "Name";
        }

        td:nth-child(2)::before {
          content: "Department";
        }

        td:nth-child(3)::before {
          content: "Designation";
        }

        td:nth-child(4)::before {
          content: "Email";
        }

        td:nth-child(5)::before {
          content: "Actions";
        }

        .name {
          font-size: var(--font-size-base);
        }

        .email {
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          width: 100%;
          min-width: 0;
        }

        .empty-state {
          min-height: 150px;
          padding: var(--spacing-2xl) var(--spacing-lg);
        }
      }
    }

    /* Fallback for browsers without container queries */
    @supports not (container-type: inline-size) {
      @media (max-width: 600px) {
        .table-wrapper {
          overflow: visible;
          border: none;
          border-radius: 0;
        }

        table,
        thead,
        tbody,
        tr,
        th,
        td {
          display: block;
          width: 100%;
        }

        table {
          min-width: 0;
        }

        thead {
          display: none;
        }

        tbody {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        tbody tr {
          display: block;
          padding: var(--spacing-lg);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }

        tbody tr:hover {
          background: var(--color-background);
        }

        td {
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr);
          gap: var(--spacing-md);
          padding: var(--spacing-md) 0;
          border: none;
          font-size: var(--font-size-base);
        }

        td:first-child {
          padding-top: 0;
        }

        td:last-child {
          padding-bottom: 0;
        }

        td::before {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        td:nth-child(1)::before {
          content: "Name";
        }

        td:nth-child(2)::before {
          content: "Department";
        }

        td:nth-child(3)::before {
          content: "Designation";
        }

        td:nth-child(4)::before {
          content: "Email";
        }

        td:nth-child(5)::before {
          content: "Actions";
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          width: 100%;
        }

        .empty-state {
          min-height: 150px;
          padding: var(--spacing-2xl) var(--spacing-lg);
        }
      }
    }

    /* =========================
       Reduced Motion
       ========================= */

    @media (prefers-reduced-motion: reduce) {
      tbody tr {
        transition: none;
      }
    }
  `;

  private handleEdit(employee: Employee) {
    this.dispatchEvent(
      new CustomEvent<Employee>("edit", {
        detail: employee,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleDelete(employee: Employee) {
    this.dispatchEvent(
      new CustomEvent<Employee>("delete", {
        detail: employee,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="table-container">
        <div class="table-header">
          <h2>Employees</h2>

          <span class="employee-count">
            ${this.employees.length}
            ${this.employees.length === 1 ? "Employee" : "Employees"}
          </span>
        </div>

        ${this.employees.length === 0
          ? html`
              <div class="empty-state">
                <p class="empty-title">No employees found</p>

                <p class="empty-description">
                  Add an employee to see them listed here.
                </p>
              </div>
            `
          : html`
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${this.employees.map(
                      (employee) => html`
                        <tr>
                          <td class="name">${employee.name || "—"}</td>

                          <td>${employee.department || "—"}</td>

                          <td>${employee.designation || "—"}</td>

                          <td class="email">${employee.email || "—"}</td>

                          <td>
                            <div class="actions">
                              <app-button
                                variant="primary"
                                size="small"
                                shape="rounded"
                                .iconOnly=${true}
                                type="button"
                                aria-label="Edit employee"
                                @button-click=${() => this.handleEdit(employee)}
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
                                  <path
                                    d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                                  />
                                </svg>
                              </app-button>
                              <app-button
                                variant="danger"
                                size="small"
                                shape="rounded"
                                .iconOnly=${true}
                                type="button"
                                aria-label="Delete employee"
                                @button-click=${() =>
                                  this.handleDelete(employee)}
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
                              </app-button>
                            </div>
                          </td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              </div>
            `}
      </div>
    `;
  }
}
