import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface Employee {
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

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: #1f2937;
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
      max-width: 1200px;
      margin: 10px auto;
      padding: 24px;

      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;

      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    /* =========================
       Header
       ========================= */

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 16px;
      margin-bottom: 20px;

      min-width: 0;
    }

    h2 {
      margin: 0;

      color: #111827;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 700;
    }

    .employee-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-height: 30px;
      padding: 5px 10px;

      color: #374151;
      background: #f3f4f6;

      border-radius: 999px;

      font-size: 13px;
      line-height: 1;
      font-weight: 600;

      white-space: nowrap;
      flex-shrink: 0;
    }

    /* =========================
       Table
       ========================= */

    .table-wrapper {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;

      border: 1px solid #e5e7eb;
      border-radius: 10px;

      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      min-width: 800px;

      border-collapse: collapse;
      table-layout: fixed;
    }

    thead {
      background: #f9fafb;
    }

    th {
      padding: 14px 16px;

      color: #374151;

      font-size: 13px;
      line-height: 1.4;
      font-weight: 700;

      text-align: left;

      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 15px 16px;

      color: #4b5563;

      font-size: 14px;
      line-height: 1.5;

      vertical-align: middle;

      border-bottom: 1px solid #e5e7eb;

      overflow-wrap: anywhere;
      word-break: break-word;
    }

    tbody tr {
      transition: background-color 0.15s ease;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    /* =========================
       Column widths
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
       Cell styles
       ========================= */

    .name {
      color: #111827;
      font-weight: 600;
    }

    .email {
      color: #2563eb;
    }

    /* =========================
       Actions
       ========================= */

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;

      white-space: nowrap;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-height: 34px;
      padding: 7px 11px;

      border: 1px solid transparent;
      border-radius: 7px;

      font-family: inherit;
      font-size: 13px;
      line-height: 1;
      font-weight: 600;

      cursor: pointer;

      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        transform 0.1s ease;
    }

    .action-button:active {
      transform: translateY(1px);
    }

    .edit-button {
      color: #1d4ed8;
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .edit-button:hover {
      background: #dbeafe;
      border-color: #93c5fd;
    }

    .delete-button {
      color: #dc2626;
      background: #fef2f2;
      border-color: #fecaca;
    }

    .delete-button:hover {
      background: #fee2e2;
      border-color: #fca5a5;
    }

    .action-button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.25);
      outline-offset: 2px;
    }

    /* =========================
       Empty state
       ========================= */

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      min-height: 180px;
      padding: 30px 20px;

      color: #6b7280;

      text-align: center;

      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #f9fafb;
    }

    .empty-title {
      margin: 0 0 6px;

      color: #374151;

      font-size: 15px;
      font-weight: 600;
    }

    .empty-description {
      margin: 0;

      color: #9ca3af;

      font-size: 13px;
    }

    /* =========================
       Tablet
       ========================= */

    @media (max-width: 900px) {
      .table-container {
        padding: 20px;
      }

      .table-header {
        margin-bottom: 16px;
      }

      h2 {
        font-size: 22px;
      }

      th {
        padding: 12px;
        font-size: 12px;
      }

      td {
        padding: 13px 12px;
        font-size: 13px;
      }

      table {
        min-width: 760px;
      }

      .action-button {
        min-height: 32px;
        padding: 6px 9px;
        font-size: 12px;
      }
    }

    /* =========================
       Mobile
       ========================= */

    @media (max-width: 600px) {
      .table-container {
        width: 100%;
        max-width: none;

        margin: 0;
        padding: 14px;

        border: none;
        border-radius: 0;

        box-shadow: none;
      }

      .table-header {
        align-items: center;

        margin-bottom: 14px;
        gap: 10px;
      }

      h2 {
        min-width: 0;

        font-size: 20px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .employee-count {
        min-height: 28px;
        padding: 5px 8px;

        font-size: 12px;
      }

      /*
       * Mobile card layout.
       */

      .table-wrapper {
        width: 100%;
        max-width: 100%;

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

        width: 100%;
        gap: 12px;
      }

      tbody tr {
        display: block;
        width: 100%;
        min-width: 0;

        padding: 15px;

        background: #ffffff;

        border: 1px solid #e5e7eb;
        border-radius: 10px;

        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }

      tbody tr:hover {
        background: #ffffff;
      }

      td {
        display: grid;

        /*
         * Label column + flexible content column.
         * minmax(0, 1fr) is important for preventing
         * long emails from overflowing.
         */
        grid-template-columns: 90px minmax(0, 1fr);

        gap: 10px;

        width: 100%;
        min-width: 0;

        padding: 7px 0;

        border: none;

        font-size: 14px;
        line-height: 1.5;

        text-align: left;

        overflow-wrap: anywhere;
        word-break: break-word;
      }

      td:first-child {
        padding-top: 0;
      }

      td:last-child {
        padding-bottom: 0;
      }

      /*
       * Mobile labels.
       */

      td::before {
        color: #6b7280;

        font-size: 10px;
        line-height: 1.5;
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
        font-size: 14px;
      }

      .email {
        min-width: 0;

        overflow-wrap: anywhere;
        word-break: break-word;
      }

      /*
       * Mobile action buttons.
       */

      .actions {
        display: flex;
        flex-wrap: wrap;

        gap: 8px;

        width: 100%;
        min-width: 0;
      }

      .action-button {
        flex: 1 1 90px;

        min-height: 40px;
        padding: 9px 12px;

        font-size: 13px;
      }

      .empty-state {
        min-height: 150px;
        padding: 24px 16px;
      }
    }

    /* =========================
       Small phones
       ========================= */

    @media (max-width: 380px) {
      .table-container {
        padding: 12px;
      }

      .table-header {
        align-items: flex-start;
      }

      h2 {
        font-size: 19px;
      }

      .employee-count {
        font-size: 11px;
      }

      tbody {
        gap: 10px;
      }

      tbody tr {
        padding: 12px;
      }

      td {
        grid-template-columns: 78px minmax(0, 1fr);

        gap: 8px;

        font-size: 13px;
      }

      td::before {
        font-size: 9px;
      }

      .action-button {
        flex: 1 1 80px;

        min-height: 38px;
        padding: 8px 10px;

        font-size: 12px;
      }
    }

    /* =========================
       Very small screens
       ========================= */

    @media (max-width: 320px) {
      .table-container {
        padding: 10px;
      }

      .table-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .employee-count {
        align-self: flex-start;
      }

      tbody tr {
        padding: 11px;
      }

      td {
        grid-template-columns: 1fr;
        gap: 3px;
      }

      td::before {
        display: block;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .action-button {
        width: 100%;
      }
    }

    /* =========================
       Reduced motion
       ========================= */

    @media (prefers-reduced-motion: reduce) {
      tbody tr,
      .action-button {
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
                              <button
                                type="button"
                                class="action-button edit-button"
                                @click=${() => this.handleEdit(employee)}
                                aria-label="Edit ${employee.name}"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                class="action-button delete-button"
                                @click=${() => this.handleDelete(employee)}
                                aria-label="Delete ${employee.name}"
                              >
                                Delete
                              </button>
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
