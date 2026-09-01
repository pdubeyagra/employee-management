import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("app-input")
export class AppInput extends LitElement {
  @property()
  label = "";

  @property()
  value = "";

  @property()
  placeholder = "";

  @property()
  type = "text";

  @property()
  inputmode = "";

  @property()
  autocomplete = "";

  @property()
  error = "";

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  invalid = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;

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

    @media (max-width: 600px) {
      input {
        height: 46px;
        font-size: 16px;
      }
    }
  `;

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement;

    this.value = input.value;

    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: {
          value: input.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new CustomEvent("input-blur", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="form-group">
        <label>
          ${this.label}
          ${this.required ? html`<span class="required">*</span>` : ""}
        </label>

        <input
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder}
          inputmode=${this.inputmode || undefined}
          autocomplete=${this.autocomplete || undefined}
          class=${this.invalid ? "invalid" : ""}
          aria-invalid=${this.invalid ? "true" : "false"}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
        />

        <div class="error-message" role="alert">${this.error}</div>
      </div>
    `;
  }
}
