import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./employee-form.ts";
import "./employee-details.ts";
import "./components/button.ts";

import type { Employee } from "./components/employee-table.ts";
import { generateThemeCSSVariables } from "./theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "./theme/layout.js";

@customElement("employee-page")
export class EmployeePage extends LitElement {
  @state()
  private employees: Employee[] = [];

  @state()
  private employeeBeingEdited: Employee | null = null;

  @state()
  private isFormOpen = false;

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
      flex-shrink: 0;
    }

    .hero-actions app-button {
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
  `;

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

  private handleEmployeeAdded(event: CustomEvent<Omit<Employee, "id">>) {
    event.stopPropagation();

    const employee: Employee = {
      id: crypto.randomUUID(),
      ...event.detail,
    };

    this.employees = [...this.employees, employee];
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

    this.employees = this.employees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee,
    );

    this.closeForm();
  }

  private handleEditCancelled() {
    this.closeForm();
  }

  private handleEmployeeDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const employeeToDelete = event.detail;

    this.employees = this.employees.filter(
      (employee) => employee.id !== employeeToDelete.id,
    );

    if (this.employeeBeingEdited?.id === employeeToDelete.id) {
      this.closeForm();
    }
  }

  private get heroTemplate(): TemplateResult {
    return html`
      <header class="hero-banner">
        <div class="hero-text">
          <h1 class="hero-title">Employee Management</h1>
          <p class="hero-description">Manage your organization employees.</p>
        </div>

        <div class="hero-actions">
          <app-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleAddEmployeeRequested}
          >
            + Add Employee
          </app-button>
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
    `;
  }

  render() {
    return this.template;
  }
}
