import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

type ButtonSize = "small" | "medium" | "large";

type ButtonShape = "rounded" | "pill" | "square";

@customElement("app-button")
export class AppButton extends LitElement {
  @property({ type: String })
  variant: ButtonVariant = "primary";

  @property({ type: String })
  size: ButtonSize = "medium";

  @property({ type: String })
  shape: ButtonShape = "rounded";

  @property({
    type: Boolean,
    attribute: "icon-only",
  })
  iconOnly = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  loading = false;

  @property({ type: Boolean })
  fullWidth = false;

  @property({ type: String })
  type: "button" | "submit" | "reset" = "button";

  static styles = css`
    :host {
      display: inline-block;
      width: auto;
      max-width: 100%;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      --button-primary: var(--color-primary);
      --button-primary-hover: var(--color-primary-hover);
      --button-secondary: var(--color-secondary);
      --button-secondary-hover: var(--color-secondary-hover);
      --button-danger: var(--color-danger);
      --button-danger-hover: var(--color-danger-hover);
      --button-success: var(--color-success);
      --button-success-hover: var(--color-success-hover);
      --button-text: var(--color-text-inverse);
      --button-text-secondary: var(--color-text-secondary);
      --button-radius: var(--radius-md);
      --button-font-size: var(--font-size-base);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    /*
     * Explicit full-width mode
     */
    :host([full-width]) {
      display: block;
      width: 100%;
    }

    button {
      box-sizing: border-box;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: auto;
      max-width: 100%;
      min-width: 80px;

      gap: 8px;

      border: none;
      outline: none;

      font-family: inherit;
      font-size: var(--button-font-size);
      font-weight: 600;

      white-space: nowrap;

      cursor: pointer;

      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.1s ease,
        opacity 0.2s ease;
    }

    /*
     * Explicit full-width mode
     */
    :host([full-width]) button {
      width: 100%;
    }

    /*
     * Active
     */
    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    /*
     * Keyboard focus
     */
    button:focus-visible {
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    }

    /*
     * =========================
     * Sizes
     * =========================
     */

    button.small {
      min-height: 32px;
      padding: 6px 12px;
      font-size: 12px;
    }

    button.medium {
      min-height: 40px;
      padding: 9px 16px;
      font-size: 14px;
    }

    button.large {
      min-height: 48px;
      padding: 12px 22px;
      font-size: 16px;
    }

    /*
     * =========================
     * Shapes
     * =========================
     */

    button.rounded {
      border-radius: var(--button-radius);
    }

    button.pill {
      border-radius: 999px;
    }

    button.square {
      border-radius: 0;
    }

    /*
     * =========================
     * Variants
     * =========================
     */

    button.primary {
      background: var(--button-primary);
      color: var(--button-text);
    }

    button.primary:hover:not(:disabled) {
      background: var(--button-primary-hover);
    }

    button.secondary {
      background: var(--button-secondary);
      color: var(--button-text-secondary);
    }

    button.secondary:hover:not(:disabled) {
      background: var(--button-secondary-hover);
    }

    button.danger {
      background: var(--button-danger);
      color: var(--button-text);
    }

    button.danger:hover:not(:disabled) {
      background: var(--button-danger-hover);
    }

    button.success {
      background: var(--button-success);
      color: var(--button-text);
    }

    button.success:hover:not(:disabled) {
      background: var(--button-success-hover);
    }

    button.ghost {
      background: transparent;
      color: var(--button-text-secondary);
    }

    button.ghost:hover:not(:disabled) {
      background: var(--color-background-secondary);
    }

    /*
     * =========================
     * Icon only
     * =========================
     */

    button.icon-only.small {
      width: 32px;
      min-width: 32px;
      height: 32px;
      padding: 0;
    }

    button.icon-only.medium {
      width: 40px;
      min-width: 40px;
      height: 40px;
      padding: 0;
    }

    button.icon-only.large {
      width: 48px;
      min-width: 48px;
      height: 48px;
      padding: 0;
    }

    /*
     * =========================
     * Disabled
     * =========================
     */

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    /*
     * =========================
     * Loading
     * =========================
     */

    .spinner {
      width: 16px;
      height: 16px;

      flex: 0 0 auto;

      border: 2px solid currentColor;
      border-right-color: transparent;

      border-radius: 50%;

      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /*
     * =========================
     * Slotted icons
     * =========================
     */

    ::slotted(svg) {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    button.small ::slotted(svg) {
      width: 16px;
      height: 16px;
    }

    button.large ::slotted(svg) {
      width: 20px;
      height: 20px;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }

      .spinner {
        animation: none;
      }
    }
  `;

  private get buttonClasses(): string {
    return [
      this.variant,
      this.size,
      this.shape,
      this.iconOnly ? "icon-only" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("button-click", {
        bubbles: true,
        composed: true,
      }),
    );
    if (this.type === "submit") {
      this.dispatchEvent(
        new CustomEvent("button-submit", {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <button
        class=${this.buttonClasses}
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
      >
        ${this.loading
          ? html`
              <span class="spinner" aria-label="Loading" role="status"></span>
            `
          : html` <slot name="icon"></slot> `}
        ${this.iconOnly
          ? html` <slot name="icon-only"></slot> `
          : html` <slot></slot> `}
      </button>
    `;
  }
}
