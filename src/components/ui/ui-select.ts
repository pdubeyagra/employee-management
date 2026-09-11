import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectChangeDetail {
  value: string;
  error: string;
}

export interface SelectBlurDetail {
  value: string;
  error: string;
}

const DEFAULT_FIELD_LABEL = "This field";

@customElement("ui-select")
export class UiSelect extends LitElement {
  @property()
  label = "";

  @property()
  value = "";

  /**
   * Text for the leading empty option. It stays selectable only while the
   * field is optional, so a required field cannot be reset to "no answer".
   */
  @property()
  placeholder = "Select an option";

  @property({ attribute: false })
  options: SelectOption[] = [];

  @property()
  name = "";

  @property()
  error = "";

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  invalid = false;

  /**
   * Toolbar variant: no visible label and no error region, so the control is
   * only as tall as the select itself. `label` becomes the accessible name.
   */
  @property({ type: Boolean })
  compact = false;

  /**
   * Error produced by this component's own rules. A consumer-supplied `error`
   * takes precedence, so a form that validates centrally keeps full control.
   */
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

    .select-wrapper {
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

    select {
      display: block;
      width: 100%;
      min-width: 0;
      height: 44px;
      /* Room on the right for the chevron. */
      padding: var(--spacing-md) calc(var(--spacing-md) * 2 + 12px)
        var(--spacing-md) var(--spacing-md);
      color: var(--color-text-primary);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      cursor: pointer;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .select-wrapper.has-icon select {
      padding-left: calc(var(--spacing-md) * 2 + 16px);
    }

    select:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    select.invalid {
      border-color: var(--color-danger);
    }

    select:disabled {
      color: var(--color-text-tertiary);
      background: var(--color-background-secondary);
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* Greys the placeholder row the way a text input's placeholder reads. */
    select.placeholder-selected {
      color: var(--color-text-tertiary);
    }

    option {
      color: var(--color-text-primary);
    }

    .chevron {
      position: absolute;
      top: 50%;
      right: var(--spacing-md);
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    :host([compact]) {
      display: inline-block;
      width: auto;
    }

    :host([compact]) .form-group {
      gap: 0;
    }

    :host([compact]) select {
      height: 32px;
      padding: 0 calc(var(--spacing-md) + 12px) 0 var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    :host([compact]) .chevron {
      right: var(--spacing-sm);
      width: 10px;
      height: 10px;
    }

    @media (prefers-reduced-motion: reduce) {
      select {
        transition: none;
      }
    }
  `;

  private hasIcon = false;

  /**
   * Lit commits the bindings on <select> before its <option> children exist, so
   * assigning `value` in the template would silently fail to match an option.
   * Syncing here runs once the options are in the DOM.
   */
  protected updated() {
    const select = this.renderRoot.querySelector("select");

    if (select && select.value !== this.value) {
      select.value = this.value;
    }
  }

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
    this.requestUpdate();
  }

  /** Re-runs the basic rules and returns the resulting message. */
  validate(): string {
    const label = this.label || DEFAULT_FIELD_LABEL;

    this.selfError =
      this.required && !this.value.trim() ? `${label} is required.` : "";

    return this.selfError;
  }

  /** The message actually shown: a consumer-supplied error wins. */
  get validationMessage(): string {
    return this.error || this.selfError;
  }

  /** The option matching the current value, if the value is a known option. */
  get selectedOption(): SelectOption | null {
    return this.options.find((option) => option.value === this.value) ?? null;
  }

  private handleChange(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.value = select.value;

    const error = this.validate();

    this.dispatchEvent(
      new CustomEvent<SelectChangeDetail>("select-change", {
        detail: {
          value: select.value,
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
      new CustomEvent<SelectBlurDetail>("select-blur", {
        detail: {
          value: this.value,
          error,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get optionsTemplate() {
    return this.options.map(
      (option) => html`
        <option value=${option.value} ?disabled=${option.disabled ?? false}>
          ${option.label}
        </option>
      `,
    );
  }

  render() {
    const message = this.validationMessage;
    const isInvalid = this.invalid || Boolean(message);
    const showingPlaceholder = this.value === "";

    const selectClasses = [
      isInvalid ? "invalid" : "",
      showingPlaceholder ? "placeholder-selected" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="form-group">
        ${this.compact
          ? nothing
          : html`
              <label>
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ""}
              </label>
            `}

        <div class="select-wrapper ${this.hasIcon ? "has-icon" : ""}">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

          <select
            class=${selectClasses}
            name=${this.name || nothing}
            ?disabled=${this.disabled}
            aria-label=${this.compact && this.label ? this.label : nothing}
            aria-invalid=${isInvalid ? "true" : "false"}
            @change=${this.handleChange}
            @blur=${this.handleBlur}
          >
            <option value="" ?disabled=${this.required}>
              ${this.placeholder}
            </option>

            ${this.optionsTemplate}
          </select>

          <svg
            class="chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        ${this.compact
          ? nothing
          : html`<div class="error-message" role="alert">${message}</div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-select": UiSelect;
  }
}
