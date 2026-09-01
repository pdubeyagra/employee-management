import { LitElement, css, html, unsafeCSS } from "lit";
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
import { generateThemeCSSVariables } from "./theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "./theme/layout.js";

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

    .form-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    h2 {
      margin: 0 0 var(--spacing-2xl);
      color: var(--color-text-primary);
      font-size: var(--font-size-3xl);
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .edit-badge {
      display: inline-flex;
      align-items: center;
      margin-left: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-primary);
      background: var(--color-primary-light);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      line-height: 1;
      font-weight: 700;
      vertical-align: middle;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
      width: 100%;
      min-width: 0;
    }

    .form-input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: var(--spacing-lg);
      width: 100%;
      min-width: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
    }

    .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
    }

    app-button {
      flex: 1 1 auto;
      min-width: 120px;
    }

    @supports not (
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))
    ) {
      .form-input-section {
        grid-template-columns: repeat(4, minmax(0, 1fr));
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
