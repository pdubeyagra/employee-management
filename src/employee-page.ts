import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./employee-form.ts";
import "./employee-details.ts";

import type { Employee } from "./components/employee-table.ts";

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

      background: #f8fafc;
      color: #1f2937;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .page {
      width: 100%;
      min-height: 100vh;

      padding: 32px;
    }

    .page-container {
      width: 100%;
      max-width: 1400px;

      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;

      margin-bottom: 24px;
    }

    .page-title {
      min-width: 0;
    }

    h1 {
      margin: 0;

      color: #111827;

      font-size: 30px;
      line-height: 1.2;
      font-weight: 700;
    }

    .page-description {
      margin: 8px 0 0;

      color: #6b7280;

      font-size: 15px;
      line-height: 1.5;
    }

    .page-content {
      display: flex;
      flex-direction: column;

      width: 100%;
      min-width: 0;

      gap: 24px;
    }

    employee-form,
    employee-details {
      display: block;

      width: 100%;
      min-width: 0;
    }

    @media (max-width: 900px) {
      .page {
        padding: 24px;
      }

      .page-header {
        margin-bottom: 20px;
      }

      .page-content {
        gap: 20px;
      }

      h1 {
        font-size: 26px;
      }
    }

    @media (max-width: 600px) {
      .page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;

        gap: 8px;

        margin-bottom: 16px;
      }

      .page-content {
        gap: 16px;
      }

      h1 {
        font-size: 23px;
      }

      .page-description {
        margin-top: 5px;

        font-size: 14px;
      }
    }

    @media (max-width: 380px) {
      .page {
        padding: 10px;
      }

      .page-content {
        gap: 12px;
      }

      h1 {
        font-size: 21px;
      }

      .page-description {
        font-size: 13px;
      }
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
