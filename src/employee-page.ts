import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./employee-form.ts";
import "./employee-details.ts";

import type { Employee } from "./components/employee-table.ts";
import { generateThemeCSSVariables } from "./theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "./theme/layout.js";

@customElement("employee-page")
export class EmployeePage extends LitElement {
  @state()
  private employees: Employee[] = [];

  @state()
  private employeeBeingEdited: Employee | null = null;

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

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .page-title {
      min-width: 0;
      flex: 1 1 auto;
    }

    h1 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-4xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .page-description {
      margin: var(--spacing-md) 0 0;
      color: var(--color-text-secondary);
      font-size: clamp(var(--font-size-sm), 3vw, var(--font-size-md));
      line-height: var(--line-height-relaxed);
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

  private handleEmployeeAdded(event: CustomEvent<Omit<Employee, "id">>) {
    event.stopPropagation();
    // console.log("Employee added:", event.detail);
    const employee: Employee = {
      id: crypto.randomUUID(),
      ...event.detail,
    };

    this.employees = [...this.employees, employee];
  }

  private handleEmployeeEdit(event: CustomEvent<Employee>) {
    event.stopPropagation();

    this.employeeBeingEdited = event.detail;

    console.log("Edit employee:", event.detail);
  }

  private handleEmployeeUpdated(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const updatedEmployee = event.detail;

    this.employees = this.employees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee,
    );

    this.employeeBeingEdited = null;

    console.log("Employee updated:", updatedEmployee);
  }

  private handleEditCancelled() {
    this.employeeBeingEdited = null;
  }

  private handleEmployeeDelete(event: CustomEvent<Employee>) {
    event.stopPropagation();

    const employeeToDelete = event.detail;

    this.employees = this.employees.filter(
      (employee) => employee.id !== employeeToDelete.id,
    );
    if (this.employeeBeingEdited?.id === employeeToDelete.id) {
      this.employeeBeingEdited = null;
    }
  }

  render() {
    return html`
      <main class="page">
        <div class="page-container">
          <header class="page-header">
            <div class="page-title">
              <h1>Employees Table</h1>

              <p class="page-description">Add and manage your employees.</p>
            </div>
          </header>

          <section class="page-content">
            <employee-form
              .employeeToEdit=${this.employeeBeingEdited}
              @employee-added=${this.handleEmployeeAdded}
              @employee-updated=${this.handleEmployeeUpdated}
              @edit-cancelled=${this.handleEditCancelled}
            ></employee-form>

            <employee-details
              .employees=${this.employees}
              @employee-delete=${this.handleEmployeeDelete}
              @employee-edit=${this.handleEmployeeEdit}
            ></employee-details>
          </section>
        </div>
      </main>
    `;
  }
}
