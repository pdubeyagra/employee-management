import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./employee-form.ts";
import "./employee-details.ts";
import "../../components/ui/ui-button.ts";
import "../../components/shared/toast.ts";

import type { Employee, NewEmployee } from "../../types/employee-types.ts";
import type { WidgetDefinition } from "../widget-registry.ts";
import type { ToastHost, ToastVariant } from "../../components/shared/toast.ts";
import { employeeStore, type Unsubscribe } from "./employee-store.ts";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../../theme/layout.js";

@customElement("employee-widget")
export class EmployeeWidget extends LitElement {
  @state()
  private employees: Employee[] = employeeStore.getAll();

  @state()
  private employeeBeingEdited: Employee | null = null;

  @state()
  private isFormOpen = false;

  private unsubscribeFromStore?: Unsubscribe;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
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
      min-height: 100%;
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
      flex-shrink: 0;
    }

    .hero-actions ui-button {
      --color-primary: white;
      --color-text-on-primary: var(--color-primary);
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

    this.applyEmployees(employeeStore.getAll());

    this.unsubscribeFromStore = employeeStore.subscribe((employees) => {
      this.applyEmployees(employees);
    });
  }

  disconnectedCallback() {
    this.unsubscribeFromStore?.();
    this.unsubscribeFromStore = undefined;

    super.disconnectedCallback();
  }

  /**
   * Another tab may delete the employee this one has open in its form, so the
   * roster arriving from the store is what decides whether the edit survives.
   */
  private applyEmployees(employees: Employee[]) {
    this.employees = employees;

    const beingEdited = this.employeeBeingEdited;

    if (
      beingEdited &&
      !employees.some((employee) => employee.id === beingEdited.id)
    ) {
      this.closeForm();
    }
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

  private handleEmployeeAdded(event: CustomEvent<NewEmployee>) {
    event.stopPropagation();

    employeeStore.add(event.detail);
    this.closeForm();
  }

  private handleEmployeeEdit(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.employeeBeingEdited = event.detail;
    this.isFormOpen = true;
  }

  private handleEmployeeUpdated(event: CustomEvent<Employee>) {
    event.stopPropagation();

    employeeStore.update(event.detail);
    this.closeForm();
  }

  private handleEditCancelled() {
    this.closeForm();
  }

  private handleEmployeeDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const employeeToDelete = event.detail;

    if (!employeeStore.remove(employeeToDelete.id)) {
      return;
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
          <ui-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleAddEmployeeRequested}
          >
            + Add Employee
          </ui-button>
        </div>
      </header>
    `;
  }

  private get formPanelTemplate(): TemplateResult {
    return html`
      <div class="form-panel ${this.isFormOpen ? "open" : ""}">
        <div class="form-panel-inner">
          <employee-form
            .employeeToEdit=${this.employeeBeingEdited}
            @employee-added=${this.handleEmployeeAdded}
            @employee-updated=${this.handleEmployeeUpdated}
            @edit-cancelled=${this.handleEditCancelled}
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

/**
 * How the shell lists, addresses and mounts this widget. A widget folder is
 * self-describing: ship the element and its definition together, then add the
 * definition to the catalog.
 */
export const employeeWidgetDefinition: WidgetDefinition = {
  id: "employees",
  title: "Employees",
  description: "Add, search, edit and remove the people in your organisation.",
  icon: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,
  render: () => html`<employee-widget></employee-widget>`,
};
