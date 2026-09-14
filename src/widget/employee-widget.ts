import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@/features/employee/components/employee-form.ts";
import "@/features/employee/components/employee-details.ts";
import "@/components/ui/ui-button.ts";
import "@/components/ui/ui-dropdown.ts";
import "@/components/shared/toast.ts";

import {
  STORAGE_LABELS,
  STORAGE_OPTIONS,
  createStore,
  isStorageKind,
} from "@/storage/create-store.ts";

import type { Employee, NewEmployee } from "@/types/employee-types.ts";
import type { DataStore, StorageKind } from "@/types/storage-types.ts";
import type { DropdownChangeDetail } from "@/components/ui/ui-dropdown.ts";
import type { ToastHost, ToastVariant } from "@/components/shared/toast.ts";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "@/theme/layout.js";

export const EMPLOYEE_STORAGE_KEY = "employees";

@customElement("employee-widget")
export class EmployeeWidget extends LitElement {
  @property({ type: Boolean })
  loading = false;

  @property({ type: String })
  storage: StorageKind = "state";

  @state()
  private employees: Employee[] = [];

  @state()
  private employeeBeingEdited: Employee | null = null;

  @state()
  private isFormOpen = false;

  @state()
  private reading = false;

  private store: DataStore<Employee> = createStore<Employee>(
    "state",
    EMPLOYEE_STORAGE_KEY,
  );

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .page {
      width: 100%;
      min-height: 100vh;
      padding: clamp(var(--spacing-lg), 5vw, var(--spacing-3xl));
      display: flex;
      flex-direction: column;
    }

    .page-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }

    .hero-banner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-xl);
      flex-wrap: wrap;
      padding: clamp(var(--spacing-xl), 4vw, var(--spacing-2xl));
      border-radius: var(--radius-lg);
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        color-mix(in srgb, var(--color-primary) 75%, black) 100%
      );
      box-shadow: var(--shadow-md);
      color: white;
      overflow: hidden;
    }

    .hero-text {
      min-width: 0;
      flex: 1 1 auto;
    }

    .hero-title {
      margin: 0;
      color: white;
      font-size: clamp(var(--font-size-xl), 5vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .hero-description {
      margin: var(--spacing-sm) 0 0;
      color: rgba(255, 255, 255, 0.85);
      font-size: clamp(var(--font-size-sm), 3vw, var(--font-size-md));
      line-height: var(--line-height-relaxed);
    }

    .hero-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      flex-shrink: 0;
    }

    .hero-actions ui-button {
      --color-primary: white;
      --color-text-on-primary: var(--color-primary);
    }

    .storage-picker {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .storage-label {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      white-space: nowrap;
    }

    .storage-picker ui-dropdown {
      min-width: 160px;
    }

    .form-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--transition-base, 0.25s ease);
    }

    .form-panel.open {
      grid-template-rows: 1fr;
    }

    .form-panel-inner {
      overflow: hidden;
      min-height: 0;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      gap: var(--spacing-2xl);
    }

    employee-form,
    employee-details {
      display: block;
      width: 100%;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .form-panel {
        transition: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    void this.adoptStorage(this.storage);
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("storage") && changed.get("storage") !== undefined) {
      void this.adoptStorage(this.storage);
    }
  }

  private loadToken = 0;

  private async adoptStorage(kind: StorageKind) {
    const token = ++this.loadToken;

    this.store = createStore<Employee>(kind, EMPLOYEE_STORAGE_KEY);
    this.reading = true;
    this.closeForm();

    try {
      const items = await this.store.read();

      if (token === this.loadToken) {
        this.employees = items;
      }
    } finally {
      this.reading = false;
    }

    if (this.store.kind !== this.store.requestedKind) {
      this.showToast(
        `${STORAGE_LABELS[kind]} is unavailable here, using memory instead.`,
        "error",
      );
    }
  }

  private async persist(employees: Employee[]) {
    this.loadToken += 1;
    this.employees = employees;

    await this.store.write(employees);
  }

  private handleStorageChange(event: CustomEvent<DropdownChangeDetail>) {
    event.stopPropagation();

    const value = event.detail.value;

    if (!isStorageKind(value) || value === this.storage) {
      return;
    }

    this.storage = value;

    this.dispatchEvent(
      new CustomEvent<StorageKind>("storage-change", {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private openForm() {
    this.isFormOpen = true;
  }

  private closeForm() {
    this.isFormOpen = false;
    this.employeeBeingEdited = null;
  }

  private handleAddEmployeeRequested(event: Event) {
    event.stopPropagation();
    this.openForm();
  }

  private handleToggleFormRequested(event: Event) {
    event.stopPropagation();

    if (this.isFormOpen) {
      this.closeForm();

      return;
    }

    this.openForm();
  }

  private handleFormClose(event: Event) {
    event.stopPropagation();
    this.closeForm();
  }

  private handleEmployeeAdded(event: CustomEvent<NewEmployee>) {
    event.stopPropagation();

    const employee: Employee = {
      id: crypto.randomUUID(),
      ...event.detail,
    };

    void this.persist([...this.employees, employee]);
    this.closeForm();
  }

  private handleEmployeeEdit(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.employeeBeingEdited = event.detail;
    this.isFormOpen = true;
  }

  private handleEmployeeUpdated(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const updatedEmployee = event.detail;

    void this.persist(
      this.employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee,
      ),
    );

    this.closeForm();
  }

  private handleEditCancelled() {
    this.closeForm();
  }

  private handleEmployeeDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const employeeToDelete = event.detail;

    const remaining = this.employees.filter(
      (employee) => employee.id !== employeeToDelete.id,
    );

    if (remaining.length === this.employees.length) {
      return;
    }

    void this.persist(remaining);

    if (this.employeeBeingEdited?.id === employeeToDelete.id) {
      this.closeForm();
    }

    this.showToast("Employee deleted successfully!", "success");
  }

  private showToast(message: string, variant: ToastVariant) {
    const toast = this.renderRoot.querySelector<ToastHost>("app-toast");

    toast?.show?.(message, variant);
  }

  private get heroTemplate(): TemplateResult {
    return html`
      <header class="hero-banner">
        <div class="hero-text">
          <h1 class="hero-title">Employee Management</h1>
          <p class="hero-description">Manage your organization employees.</p>
        </div>

        <div class="hero-actions">
          <div class="storage-picker">
            <span class="storage-label" aria-hidden="true">Store in</span>

            <ui-dropdown
              compact
              tone="inverse"
              label="Storage"
              .options=${STORAGE_OPTIONS}
              .value=${this.storage}
              @dropdown-change=${this.handleStorageChange}
            ></ui-dropdown>
          </div>

          <ui-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            aria-expanded=${this.isFormOpen ? "true" : "false"}
            @button-click=${this.handleToggleFormRequested}
          >
            ${this.isFormOpen ? "Close Form" : "+ Add Employee"}
          </ui-button>
        </div>
      </header>
    `;
  }

  private get formPanelTemplate(): TemplateResult {
    return html`
      <div class="form-panel ${this.isFormOpen ? "open" : ""}">
        <div class="form-panel-inner" ?inert=${!this.isFormOpen}>
          <employee-form
            .employeeToEdit=${this.employeeBeingEdited}
            @employee-added=${this.handleEmployeeAdded}
            @employee-updated=${this.handleEmployeeUpdated}
            @edit-cancelled=${this.handleEditCancelled}
            @form-close=${this.handleFormClose}
          ></employee-form>
        </div>
      </div>
    `;
  }

  private get template(): TemplateResult {
    return html`
      <main class="page">
        <div class="page-container">
          ${this.heroTemplate}

          <section class="page-content">
            ${this.formPanelTemplate}

            <employee-details
              .employees=${this.employees}
              .loading=${this.loading || this.reading}
              @employee-delete=${this.handleEmployeeDelete}
              @employee-edit=${this.handleEmployeeEdit}
              @add-employee=${this.handleAddEmployeeRequested}
            ></employee-details>
          </section>
        </div>
      </main>

      <app-toast></app-toast>
    `;
  }

  render() {
    return this.template;
  }
}
