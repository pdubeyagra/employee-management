import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.js";

export interface InputChangeDetail {
  value: string;
  error: string;
}

export interface InputBlurDetail {
  value: string;
  error: string;
}

export interface FieldRules {
  label?: string;
  required?: boolean;
  maxlength?: number;
  minlength?: number;
  type?: string;
  pattern?: RegExp | null;
  patternMessage?: string;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

const DEFAULT_FIELD_LABEL = "This field";

export function validateFieldValue(value: string, rules: FieldRules): string {
  const label = rules.label || DEFAULT_FIELD_LABEL;
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return rules.required ? `${label} is required.` : "";
  }

  if (rules.minlength && trimmedValue.length < rules.minlength) {
    return `${label} must be at least ${rules.minlength} characters.`;
  }

  if (rules.maxlength && trimmedValue.length > rules.maxlength) {
    return `${label} must be ${rules.maxlength} characters or fewer.`;
  }

  if (rules.type === "email" && !EMAIL_PATTERN.test(trimmedValue)) {
    return "Please enter a valid email address.";
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return rules.patternMessage || `${label} is not in the expected format.`;
  }

  return "";
}

@customElement("ui-input")
export class UiInput extends LitElement {
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

  @property({ type: Number })
  maxlength = 0;

  @property({ type: Number })
  minlength = 0;

  @property({ attribute: false })
  pattern: RegExp | null = null;

  @property()
  patternMessage = "";

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  invalid = false;

  @state()
  private selfError = "";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      width: 100%;
      min-width: 0;
    }

    label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 600;
    }

    .required {
      margin-left: var(--spacing-xs);
      color: var(--color-danger);
    }

    .input-wrapper {
      position: relative;
      display: block;
      width: 100%;
      min-width: 0;
    }

    ::slotted([slot="icon"]) {
      position: absolute;
      top: 50%;
      left: var(--spacing-md);
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    input {
      display: block;
      width: 100%;
      min-width: 0;
      height: 44px;
      padding: var(--spacing-md) var(--spacing-md);
      color: var(--color-text-primary);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      outline: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      pointer-events: auto;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .input-wrapper.has-icon input {
      padding-left: calc(var(--spacing-md) * 2 + 16px);
    }

    input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    input.invalid {
      border-color: var(--color-danger);
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }
  `;

  private hasIcon = false;

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
    this.requestUpdate();
  }

  get rules(): FieldRules {
    return {
      label: this.label,
      required: this.required,
      maxlength: this.maxlength,
      minlength: this.minlength,
      type: this.type,
      pattern: this.pattern,
      patternMessage: this.patternMessage,
    };
  }

  validate(): string {
    this.selfError = validateFieldValue(this.value, this.rules);

    return this.selfError;
  }

  get validationMessage(): string {
    return this.error || this.selfError;
  }

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement;

    this.value = input.value;

    const error = this.validate();

    this.dispatchEvent(
      new CustomEvent<InputChangeDetail>("input-change", {
        detail: {
          value: input.value,
          error,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleBlur() {
    const error = this.validate();

    this.dispatchEvent(
      new CustomEvent<InputBlurDetail>("input-blur", {
        detail: {
          value: this.value,
          error,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const message = this.validationMessage;
    const isInvalid = this.invalid || Boolean(message);

    return html`
      <div class="form-group">
        <label>
          ${this.label}
          ${this.required ? html`<span class="required">*</span>` : ""}
        </label>

        <div class="input-wrapper ${this.hasIcon ? "has-icon" : ""}">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

          <input
            type=${this.type}
            .value=${this.value}
            placeholder=${this.placeholder}
            inputmode=${this.inputmode || nothing}
            autocomplete=${this.autocomplete || nothing}
            maxlength=${this.maxlength > 0 ? this.maxlength : nothing}
            class=${isInvalid ? "invalid" : ""}
            aria-invalid=${isInvalid ? "true" : "false"}
            @input=${this.handleInput}
            @blur=${this.handleBlur}
          />
        </div>

        <div class="error-message" role="alert">${message}</div>
      </div>
    `;
  }
}
