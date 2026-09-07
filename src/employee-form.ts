import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/ui/button.ts";
import "./components/shared/toast.ts";
import "./components/ui/input.ts";

import {
  FIELD_MAX_LENGTHS,
  validateEmployeeField,
  validateEmployeeForm,
  isEmployeeFormValid,
  type EmployeeErrors,
  type EmployeeField,
} from "./utils/employee-validation.ts";

import type { Employee } from "./components/employee/employee-table.ts";
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
      padding: var(--spacing-xl) var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .form-header h2 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .edit-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-primary);
      background: var(--color-primary-light);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      line-height: 1;
      font-weight: 700;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      width: 100%;
      min-width: 0;
    }

    .form-input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
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

    .field-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--color-text-tertiary);
    }

    .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    app-button {
      flex: 0 1 auto;
      min-width: 120px;
    }

    @supports not (
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr))
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
    event.preventDefault();

    const errors = validateEmployeeForm(this.formData);

    this.errors = errors;

    if (!isEmployeeFormValid(errors)) {
      this.showToast("Please fix the errors in the form.", "error");

      return;
    }

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
      }),
    );

    this.showToast("Employee added successfully!", "success");

    this.handleClear();
  }

  private handleSubmitButton(event: CustomEvent) {
    event.stopPropagation();

    const form = this.renderRoot.querySelector(
      ".employee-form",
    ) as HTMLFormElement | null;

    if (!form) {
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
      this.dispatchEvent(new CustomEvent("edit-cancelled"));
    }
  }

  private showToast(message: string, variant: "success" | "error" | "info") {
    const toast = this.renderRoot.querySelector("app-toast") as HTMLElement & {
      show?: (message: string, variant?: "success" | "error" | "info") => void;
    };

    toast?.show?.(message, variant);
  }

  private get headerTemplate(): TemplateResult | typeof html {
    const isEditing = this.employeeToEdit !== null;

    return html`
      <div class="form-header">
        <h2>${isEditing ? "Edit Employee" : "Employee Form"}</h2>
        ${isEditing ? html`<span class="edit-badge">Editing</span>` : ""}
      </div>
    `;
  }

  private renderFieldIcon(field: EmployeeField): TemplateResult {
    const icons: Record<EmployeeField, TemplateResult> = {
      name: html`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>`,
      department: html`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      </svg>`,
      designation: html`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>`,
      email: html`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>`,
    };

    return icons[field];
  }

  private get template(): TemplateResult {
    const isEditing = this.employeeToEdit !== null;

    return html`
      <div class="form-container">
        ${this.headerTemplate}

        <form class="employee-form" novalidate @submit=${this.handleSubmit}>
          <div class="form-input-section">
            <app-input
              label="Name"
              .maxlength=${FIELD_MAX_LENGTHS.name}
              placeholder="Enter employee name"
              .value=${this.formData.name}
              .error=${this.errors.name}
              .invalid=${Boolean(this.errors.name)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("name", event)}
              @input-blur=${() => this.handleBlur("name")}
            >
              ${this.renderFieldIcon("name")}
            </app-input>

            <app-input
              label="Department"
              .maxlength=${FIELD_MAX_LENGTHS.department}
              placeholder="e.g. Engineering"
              .value=${this.formData.department}
              .error=${this.errors.department}
              .invalid=${Boolean(this.errors.department)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("department", event)}
              @input-blur=${() => this.handleBlur("department")}
            >
              ${this.renderFieldIcon("department")}
            </app-input>

            <app-input
              label="Designation"
              .maxlength=${FIELD_MAX_LENGTHS.designation}
              placeholder="e.g. Software Engineer"
              .value=${this.formData.designation}
              .error=${this.errors.designation}
              .invalid=${Boolean(this.errors.designation)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("designation", event)}
              @input-blur=${() => this.handleBlur("designation")}
            >
              ${this.renderFieldIcon("designation")}
            </app-input>

            <app-input
              label="Email"
              .maxlength=${FIELD_MAX_LENGTHS.email}
              type="email"
              inputmode="email"
              autocomplete="off"
              placeholder="employee@example.com"
              .value=${this.formData.email}
              .error=${this.errors.email}
              .invalid=${Boolean(this.errors.email)}
              required
              @input-change=${(event: CustomEvent) =>
                this.handleInput("email", event)}
              @input-blur=${() => this.handleBlur("email")}
            >
              ${this.renderFieldIcon("email")}
            </app-input>
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

  render() {
    return this.template;
  }
}
