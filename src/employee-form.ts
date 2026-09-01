import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/button.ts";
import "./components/toast.ts";
import "./components/input.ts";

import {
  validateEmployeeField,
  validateEmployeeForm,
  isEmployeeFormValid,
  type EmployeeErrors,
  type EmployeeField,
} from "./utils/employee-validation.ts";

import type { Employee } from "./components/employee-table.ts";

@customElement("employee-form")
export class EmployeeForm extends LitElement {
  @property({ attribute: false })
  employeeToEdit: Employee | null = null;

  @state()
  private formData = {
    name: "",
    department: "",
    designation: "",
    email: "",
  };

  @state()
  private errors: EmployeeErrors = {
    name: "",
    department: "",
    designation: "",
    email: "",
  };

  private previousEmployeeId: string | null = null;

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

    .form-container {
      width: 100%;
      max-width: 1200px;

      margin: 0 auto;
      padding: 24px;

      background: #ffffff;

      border: 1px solid #e5e7eb;
      border-radius: 12px;

      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    h2 {
      margin: 0 0 24px;

      color: #111827;

      font-size: 24px;
      line-height: 1.25;
      font-weight: 700;
    }

    .edit-badge {
      display: inline-flex;
      align-items: center;

      margin-left: 8px;
      padding: 4px 8px;

      color: #1d4ed8;
      background: #eff6ff;

      border-radius: 999px;

      font-size: 11px;
      line-height: 1;
      font-weight: 700;

      vertical-align: middle;
    }

    .employee-form {
      display: flex;
      flex-direction: column;

      width: 100%;
      min-width: 0;
    }

    .form-input-section {
      display: grid;

      grid-template-columns: repeat(4, minmax(0, 1fr));

      gap: 16px;

      width: 100%;
      min-width: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;

      width: 100%;
      min-width: 0;
    }

    label {
      margin-bottom: 7px;

      color: #374151;

      font-size: 14px;
      line-height: 1.4;
      font-weight: 600;
    }

    .required {
      margin-left: 3px;

      color: #dc2626;
    }

    input {
      display: block;

      width: 100%;
      min-width: 0;
      height: 44px;

      padding: 11px 12px;

      color: #111827;
      background: #ffffff;

      border: 1px solid #d1d5db;
      border-radius: 8px;

      outline: none;

      font-family: inherit;
      font-size: 15px;

      pointer-events: auto;

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    input:focus {
      border-color: #2563eb;

      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    input.invalid {
      border-color: #dc2626;
    }

    .error-message {
      min-height: 18px;

      margin-top: 5px;

      color: #dc2626;

      font-size: 13px;
      line-height: 1.4;
    }

    .actions {
      display: flex;
      align-items: center;

      flex-wrap: wrap;

      gap: 12px;

      margin-top: 14px;
    }

    @media (max-width: 900px) {
      .form-container {
        padding: 22px;
      }

      .form-input-section {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .form-container {
        padding: 18px;
      }

      h2 {
        font-size: 21px;
      }

      .form-input-section {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      input {
        height: 46px;
        font-size: 16px;
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
      }

      app-button {
        width: 100%;
      }
    }

    @media (max-width: 380px) {
      .form-container {
        padding: 14px;
      }

      h2 {
        font-size: 19px;
      }
    }
  `;

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("employeeToEdit")) {
      if (this.employeeToEdit) {
        if (this.previousEmployeeId !== this.employeeToEdit.id) {
          this.previousEmployeeId = this.employeeToEdit.id;

          this.formData = {
            name: this.employeeToEdit.name,
            department: this.employeeToEdit.department,
            designation: this.employeeToEdit.designation,
            email: this.employeeToEdit.email,
          };

          this.errors = {
            name: "",
            department: "",
            designation: "",
            email: "",
          };
        }
      } else {
        this.previousEmployeeId = null;
      }
    }
  }

  private handleInput(field: EmployeeField, event: CustomEvent) {
    const value = event.detail.value;

    this.formData = {
      ...this.formData,
      [field]: value,
    };

    this.errors = {
      ...this.errors,
      [field]: validateEmployeeField(field, value),
    };
  }

  private handleBlur(field: EmployeeField) {
    this.errors = {
      ...this.errors,
      [field]: validateEmployeeField(field, this.formData[field]),
    };
  }

  private handleSubmit(event: SubmitEvent) {
    // console.log("Form submit event:", event);
    event.preventDefault();

    const errors = validateEmployeeForm(this.formData);

    this.errors = errors;

    if (!isEmployeeFormValid(errors)) {
      this.showToast("Please fix the errors in the form.", "error");

      return;
    }
    // console.log("Form submitted:", this.formData);

    if (this.employeeToEdit) {
      const updatedEmployee: Employee = {
        id: this.employeeToEdit.id,
        name: this.formData.name.trim(),
        department: this.formData.department.trim(),
        designation: this.formData.designation.trim(),
        email: this.formData.email.trim(),
      };

      this.dispatchEvent(
        new CustomEvent<Employee>("employee-updated", {
          detail: updatedEmployee,
          bubbles: true,
          composed: true,
        }),
      );

      this.showToast("Employee updated successfully!", "success");

      this.handleClear();

      return;
    }

    const newEmployee: Omit<Employee, "id"> = {
      name: this.formData.name.trim(),
      department: this.formData.department.trim(),
      designation: this.formData.designation.trim(),
      email: this.formData.email.trim(),
    };

    this.dispatchEvent(
      new CustomEvent<Omit<Employee, "id">>("employee-added", {
        detail: newEmployee,
        bubbles: true,
        composed: true,
      }),
    );

    this.showToast("Employee added successfully!", "success");

    this.handleClear();
  }

  private handleSubmitButton(event: CustomEvent) {
    event.stopPropagation();

    // console.log("Submit button clicked");

    const form = this.renderRoot.querySelector(
      ".employee-form",
    ) as HTMLFormElement | null;

    if (!form) {
      console.error("Employee form not found");
      return;
    }

    form.requestSubmit();
  }

  private handleClear() {
    this.formData = {
      name: "",
      department: "",
      designation: "",
      email: "",
    };

    this.errors = {
      name: "",
      department: "",
      designation: "",
      email: "",
    };

    if (this.employeeToEdit) {
      this.dispatchEvent(
        new CustomEvent("edit-cancelled", {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private showToast(message: string, variant: "success" | "error" | "info") {
    const toast = this.renderRoot.querySelector("app-toast") as HTMLElement & {
      show?: (message: string, variant?: "success" | "error" | "info") => void;
    };

    toast?.show?.(message, variant);
  }

  render() {
    const isEditing = this.employeeToEdit !== null;

    return html`
      <div class="form-container">
        <h2>
          ${isEditing ? "Edit Employee" : "Employee Form"}
          ${isEditing ? html` <span class="edit-badge"> Editing </span> ` : ""}
        </h2>

        <form class="employee-form" novalidate @submit=${this.handleSubmit}>
          <div class="form-input-section">
            <app-input
              label="Name"
              placeholder="Enter employee name"
              .value=${this.formData.name}
              .error=${this.errors.name}
              .invalid=${Boolean(this.errors.name)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("name", event)}
              @input-blur=${() => this.handleBlur("name")}
            ></app-input>

            <app-input
              label="Department"
              placeholder="e.g. Engineering"
              .value=${this.formData.department}
              .error=${this.errors.department}
              .invalid=${Boolean(this.errors.department)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("department", event)}
              @input-blur=${() => this.handleBlur("department")}
            ></app-input>

            <app-input
              label="Designation"
              placeholder="e.g. Software Engineer"
              .value=${this.formData.designation}
              .error=${this.errors.designation}
              .invalid=${Boolean(this.errors.designation)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("designation", event)}
              @input-blur=${() => this.handleBlur("designation")}
            ></app-input>

            <app-input
              label="Email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="employee@example.com"
              .value=${this.formData.email}
              .error=${this.errors.email}
              .invalid=${Boolean(this.errors.email)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("email", event)}
              @input-blur=${() => this.handleBlur("email")}
            ></app-input>
          </div>

          <div class="actions">
            <app-button
              size="medium"
              @button-submit=${this.handleSubmitButton}
              shape="rounded"
              type="submit"
            >
              ${isEditing ? "Update Employee" : "Save"}
            </app-button>

            <app-button
              variant="secondary"
              size="medium"
              shape="rounded"
              type="button"
              @click=${this.handleClear}
            >
              ${isEditing ? "Cancel" : "Clear"}
            </app-button>
          </div>
        </form>
      </div>

      <app-toast></app-toast>
    `;
  }
}
