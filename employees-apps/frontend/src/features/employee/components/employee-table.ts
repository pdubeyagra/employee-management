import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "@/theme/layout.js";
import type { Employee } from "@/types/employee-types.js";

export const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#059669",
  "#d97706",
  "#0891b2",
] as const;

export const generateAvatarClasses = (selector: string): string => {
  return AVATAR_COLORS.map(
    (color, index) => `${selector}.avatar-${index} { background: ${color}; }`,
  ).join("\n");
};

export const getAvatarVariant = (seed: string): number => {
  let hash = 0;

  for (let index = 0; index < seed.length; index++) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
    hash |= 0;
  }

  return Math.abs(hash) % AVATAR_COLORS.length;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase();
};

@customElement("employee-table")
export class EmployeeTable extends LitElement {
  @property({ type: Array })
  employees: Employee[] = [];

  @property({ type: Boolean, attribute: "search-active" })
  searchActive = false;

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

    .table-wrapper {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      min-width: 680px;
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

    th:nth-child(1),
    td:nth-child(1) {
      width: 24%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 18%;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 19%;
    }

    th:nth-child(4),
    td:nth-child(4) {
      width: 24%;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 15%;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      text-transform: uppercase;
    }

    ${unsafeCSS(generateAvatarClasses(".avatar"))}

    .name {
      color: var(--color-text-primary);
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email {
      color: var(--color-primary);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      white-space: nowrap;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 220px;
      padding: var(--spacing-3xl) var(--spacing-xl);
      color: var(--color-text-secondary);
      text-align: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
      gap: var(--spacing-md);
    }

    .empty-icon {
      width: 56px;
      height: 56px;
      color: var(--color-text-tertiary);
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
      }),
    );
  }

  private handleDelete(employee: Employee) {
    this.dispatchEvent(
      new CustomEvent<Employee>("delete", {
        detail: employee,
      }),
    );
  }

  private handleAddEmployee() {
    this.dispatchEvent(new CustomEvent("add-employee"));
  }

  private get emptyStateTemplate(): TemplateResult {
    return html`
      <div class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
          />
        </svg>

        <p class="empty-title">No employees found</p>

        <p class="empty-description">
          ${this.searchActive
            ? "Try a different search term."
            : "Add your first employee to get started."}
        </p>

        ${this.searchActive
          ? ""
          : html`
              <ui-button
                variant="primary"
                size="medium"
                shape="rounded"
                type="button"
                @button-click=${this.handleAddEmployee}
              >
                + Add Employee
              </ui-button>
            `}
      </div>
    `;
  }

  private renderRow(employee: Employee): TemplateResult {
    const initials = getInitials(employee.name);
    const avatarVariant = getAvatarVariant(employee.name || employee.id);

    return html`
      <tr>
        <td>
          <div class="name-cell">
            <span class="avatar avatar-${avatarVariant}" aria-hidden="true"
              >${initials}</span
            >
            <span class="name">${employee.name || "—"}</span>
          </div>
        </td>

        <td>${employee.department || "—"}</td>

        <td>${employee.designation || "—"}</td>

        <td class="email">${employee.email || "—"}</td>

        <td>
          <div class="actions">
            <ui-button
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
              @button-click=${() => this.handleDelete(employee)}
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
        </td>
      </tr>
    `;
  }

  private get template(): TemplateResult {
    if (this.employees.length === 0) {
      return this.emptyStateTemplate;
    }

    return html`
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
            ${this.employees.map((employee) => this.renderRow(employee))}
          </tbody>
        </table>
      </div>
    `;
  }

  render() {
    return this.template;
  }
}
