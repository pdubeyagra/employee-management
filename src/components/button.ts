import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

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

      --button-primary: #2563eb;
      --button-primary-hover: #1d4ed8;

      --button-secondary: #f3f4f6;
      --button-secondary-hover: #e5e7eb;

      --button-danger: #dc2626;
      --button-danger-hover: #b91c1c;

      --button-success: #16a34a;
      --button-success-hover: #15803d;

      --button-text: #ffffff;

      --button-radius: 8px;
      --button-font-size: 14px;
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
      color: #374151;
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
      color: #374151;
    }

    button.ghost:hover:not(:disabled) {
      background: #f3f4f6;
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

    /*
     * =========================
     * Mobile
     * =========================
     *
     * Normal buttons become full width.
     *
     * Icon-only buttons remain square.
     */
    @media (max-width: 600px) {
      :host {
        display: block;
        width: 100%;
      }

      button {
        width: 100%;
        min-height: 44px;
      }

      button.small {
        min-height: 40px;
      }

      button.medium {
        min-height: 44px;
      }

      button.large {
        min-height: 48px;
      }

      /*
       * Keep icon-only buttons square.
       */
      button.icon-only.small {
        width: 40px;
        min-width: 40px;
        height: 40px;
        min-height: 40px;
      }

      button.icon-only.medium {
        width: 44px;
        min-width: 44px;
        height: 44px;
        min-height: 44px;
      }

      button.icon-only.large {
        width: 48px;
        min-width: 48px;
        height: 48px;
        min-height: 48px;
      }

      /*
       * Explicit full-width mode.
       */
      :host([full-width]) {
        width: 100%;
      }

      :host([full-width]) button {
        width: 100%;
      }

      /*
       * Icon-only must still remain square even
       * if full-width was accidentally provided.
       */
      :host([full-width]) button.icon-only.small {
        width: 40px;
      }

      :host([full-width]) button.icon-only.medium {
        width: 44px;
      }

      :host([full-width]) button.icon-only.large {
        width: 48px;
      }
    }

    /*
     * =========================
     * Small phones
     * =========================
     */

    @media (max-width: 380px) {
      button.medium {
        padding: 9px 14px;
      }

      button.large {
        padding: 11px 18px;
      }
    }

    /*
     * =========================
     * Reduced motion
     * =========================
     */

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
