import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/button.ts";
import "./components/toast.ts";

import {
  validateEmployeeField,
  validateEmployeeForm,
  isEmployeeFormValid,
  type EmployeeErrors,
  type EmployeeField,
} from "./utils/employee-validation.ts";

@customElement("employee-form")
export class EmployeeForm extends LitElement {
  @property({ type: String })
  name = "";

  @property({ type: String })
  department = "";

  @property({ type: String })
  designation = "";

  @property({ type: String })
  email = "";

  @state()
  private errors: EmployeeErrors = {
    name: "",
    department: "",
    designation: "",
    email: "",
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
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

    .employee-form {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
    }

    /*
     * Desktop
     * 4 fields per row
     */
    .form-input-section {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      width: 100%;
      min-width: 0;
    }

    h2 {
      margin: 0 0 24px;

      color: #111827;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 700;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      min-width: 0;
      width: 100%;
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

      border: 1px solid #d1d5db;
      border-radius: 8px;

      outline: none;

      color: #111827;
      background: #ffffff;

      font: inherit;
      font-size: 15px;

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    input::placeholder {
      color: #9ca3af;
    }

    input:focus {
      border-color: #2563eb;

      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    input.invalid {
      border-color: #dc2626;
    }

    input.invalid:focus {
      border-color: #dc2626;

      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
    }

    .error-message {
      min-height: 18px;
      margin-top: 5px;

      color: #dc2626;
      font-size: 13px;
      line-height: 1.4;

      overflow-wrap: anywhere;
      word-break: break-word;
    }

    /*
     * Actions
     */
    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;

      gap: 12px;
      width: 100%;

      margin-top: 14px;
    }

    app-button {
      flex: 0 0 auto;
    }

    /*
     * Tablet
     * 2 fields per row
     */
    @media (max-width: 900px) {
      .form-container {
        padding: 22px;
      }

      .form-input-section {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
    }

    /*
     * Mobile
     * 1 field per row
     */
    @media (max-width: 600px) {
      .form-container {
        padding: 18px;
        border-radius: 10px;
      }

      h2 {
        margin-bottom: 20px;
        font-size: 21px;
      }

      .form-input-section {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      label {
        font-size: 13px;
      }

      input {
        height: 44px;
        font-size: 16px;
      }

      .error-message {
        min-height: 17px;
        font-size: 12px;
      }

      /*
       * Full-width buttons on mobile.
       */
      .actions {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
        margin-top: 14px;
      }

      app-button {
        width: 100%;
      }
    }

    /*
     * Small phones
     */
    @media (max-width: 380px) {
      .form-container {
        padding: 14px;
        border-radius: 8px;
      }

      h2 {
        margin-bottom: 18px;
        font-size: 19px;
      }

      .form-input-section {
        gap: 8px;
      }

      input {
        padding: 10px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      input {
        transition: none;
      }
    }
  `;

  private handleInput(event: Event, field: EmployeeField) {
    const input = event.target as HTMLInputElement;

    this[field] = input.value;

    this.errors = {
      ...this.errors,
      [field]: validateEmployeeField(field, input.value),
    };
  }

  private handleBlur(field: EmployeeField) {
    this.errors = {
      ...this.errors,
      [field]: validateEmployeeField(field, this[field]),
    };
  }

  private handleAddEmployeeClick() {
    const form = this.renderRoot.querySelector(
      "form",
    ) as HTMLFormElement | null;

    form?.requestSubmit();
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const data = {
      name: this.name,
      department: this.department,
      designation: this.designation,
      email: this.email,
    };

    const errors = validateEmployeeForm(data);

    this.errors = errors;

    if (!isEmployeeFormValid(errors)) {
      this.showToast("Please fix the errors in the form.", "error");

      return;
    }

    const employee = {
      name: this.name.trim(),
      department: this.department.trim(),
      designation: this.designation.trim(),
      email: this.email.trim(),
    };

    this.dispatchEvent(
      new CustomEvent("employee-added", {
        detail: employee,
        bubbles: true,
        composed: true,
      }),
    );

    console.log("Employee:", {
      name: this.name.trim(),
      department: this.department.trim(),
      designation: this.designation.trim(),
      email: this.email.trim(),
    });

    this.showToast("Employee added successfully!", "success");

    this.handleCancel();
  }

  private handleCancel() {
    this.name = "";
    this.department = "";
    this.designation = "";
    this.email = "";

    this.errors = {
      name: "",
      department: "",
      designation: "",
      email: "",
    };
  }

  private showToast(message: string, variant: "success" | "error" | "info") {
    const toast = this.renderRoot.querySelector("app-toast") as HTMLElement & {
      show?: (message: string, variant?: "success" | "error" | "info") => void;
    };

    toast?.show?.(message, variant);
  }

  render() {
    return html`
      <div class="form-container">
        <h2>Employee Form</h2>

        <form class="employee-form" novalidate @submit=${this.handleSubmit}>
          <div class="form-input-section">
            <!-- Name -->
            <div class="form-group">
              <label for="name">
                Name
                <span class="required">*</span>
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter employee name"
                .value=${this.name}
                class=${this.errors.name ? "invalid" : ""}
                aria-invalid=${this.errors.name ? "true" : "false"}
                aria-describedby="name-error"
                @input=${(event: Event) => this.handleInput(event, "name")}
                @blur=${() => this.handleBlur("name")}
              />

              <div id="name-error" class="error-message" role="alert">
                ${this.errors.name}
              </div>
            </div>

            <!-- Department -->
            <div class="form-group">
              <label for="department">
                Department
                <span class="required">*</span>
              </label>

              <input
                id="department"
                type="text"
                placeholder="e.g. Engineering"
                .value=${this.department}
                class=${this.errors.department ? "invalid" : ""}
                aria-invalid=${this.errors.department ? "true" : "false"}
                aria-describedby="department-error"
                @input=${(event: Event) =>
                  this.handleInput(event, "department")}
                @blur=${() => this.handleBlur("department")}
              />

              <div id="department-error" class="error-message" role="alert">
                ${this.errors.department}
              </div>
            </div>

            <!-- Designation -->
            <div class="form-group">
              <label for="designation">
                Designation
                <span class="required">*</span>
              </label>

              <input
                id="designation"
                type="text"
                placeholder="e.g. Software Engineer"
                .value=${this.designation}
                class=${this.errors.designation ? "invalid" : ""}
                aria-invalid=${this.errors.designation ? "true" : "false"}
                aria-describedby="designation-error"
                @input=${(event: Event) =>
                  this.handleInput(event, "designation")}
                @blur=${() => this.handleBlur("designation")}
              />

              <div id="designation-error" class="error-message" role="alert">
                ${this.errors.designation}
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">
                Email
                <span class="required">*</span>
              </label>

              <input
                id="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="employee@example.com"
                .value=${this.email}
                class=${this.errors.email ? "invalid" : ""}
                aria-invalid=${this.errors.email ? "true" : "false"}
                aria-describedby="email-error"
                @input=${(event: Event) => this.handleInput(event, "email")}
                @blur=${() => this.handleBlur("email")}
              />

              <div id="email-error" class="error-message" role="alert">
                ${this.errors.email}
              </div>
            </div>
          </div>

          <div class="actions">
            <app-button
              size="medium"
              shape="rounded"
              type="button"
              @click=${this.handleAddEmployeeClick}
            >
              Save
            </app-button>

            <app-button
              variant="secondary"
              size="medium"
              shape="rounded"
              type="button"
              @click=${this.handleCancel}
            >
              Clear
            </app-button>
          </div>
        </form>
      </div>

      <app-toast></app-toast>
    `;
  }
}
