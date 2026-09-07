import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";
import type {
  ToastPlacement,
  ToastVariant,
} from "../../types/toast-types.js";

@customElement("app-toast")
export class AppToast extends LitElement {
  @property({ type: String })
  message = "";

  @property({ type: String })
  variant: ToastVariant = "success";

  @property({ type: Boolean })
  open = false;

  @property({ type: Number })
  duration = 3000;

  @property({ type: Boolean })
  closable = true;

  @property({ type: String })
  placement: ToastPlacement = "top-right";

  private timeoutId?: number;

  static styles = css`
    :host {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    :host([placement="top-left"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="top-center"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="top-right"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      right: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="bottom-left"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="bottom-center"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="bottom-right"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      right: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      min-width: clamp(220px, 90vw, 420px);
      max-width: calc(100vw - var(--spacing-2xl));

      padding: var(--spacing-md) var(--spacing-lg);

      color: var(--color-text-inverse);

      border-radius: var(--radius-lg);

      font-size: clamp(var(--font-size-sm), 2vw, var(--font-size-base));
      font-weight: 500;
      line-height: var(--line-height-normal);

      box-shadow: var(--shadow-lg);

      opacity: 0;
      transform: translateY(-10px);

      transition:
        opacity var(--transition-base) ease,
        transform var(--transition-base) ease;

      pointer-events: none;
    }

    .toast.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    :host([placement^="bottom"]) .toast {
      transform: translateY(10px);
    }

    :host([placement^="bottom"]) .toast.open {
      transform: translateY(0);
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 22px;
      height: 22px;
    }

    .icon svg {
      display: block;

      width: 22px;
      height: 22px;

      fill: none;
      stroke: currentColor;

      stroke-width: 2;

      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .message {
      flex: 1;
      min-width: 0;

      overflow-wrap: anywhere;
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 24px;
      height: 24px;

      padding: 0;

      border: none;
      border-radius: var(--radius-sm);

      color: inherit;
      background: transparent;

      font-size: 20px;
      line-height: 1;

      cursor: pointer;

      opacity: 0.8;

      transition:
        background-color var(--transition-fast) ease,
        opacity var(--transition-fast) ease;
    }

    .close-button:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    .close-button:focus-visible {
      outline: 2px solid var(--color-text-inverse);
      outline-offset: 2px;
    }

    .success {
      background: var(--color-success);
    }

    .error {
      background: var(--color-danger);
    }

    .info {
      background: var(--color-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        transition: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("placement", this.placement);
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("placement")) {
      this.setAttribute("placement", this.placement);
    }

    if (changedProperties.has("open") || changedProperties.has("duration")) {
      if (this.open) {
        this.startTimer();
      } else {
        this.clearTimer();
      }
    }
  }

  show(message: string, variant: ToastVariant = "success") {
    this.message = message;
    this.variant = variant;
    this.open = true;

    this.startTimer();
  }

  close() {
    this.open = false;
    this.clearTimer();

    this.dispatchEvent(
      new CustomEvent("toast-close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private startTimer() {
    this.clearTimer();

    if (!this.open || this.duration <= 0) {
      return;
    }

    this.timeoutId = window.setTimeout(() => {
      this.close();
    }, this.duration);
  }

  private clearTimer() {
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private handleClose() {
    this.close();
  }

  private renderIcon() {
    switch (this.variant) {
      case "success":
        return html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="m8 12 2.5 2.5L16 9"></path>
          </svg>
        `;

      case "error":
        return html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        `;

      case "info":
        return html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 10v6"></path>
            <path d="M12 7h.01"></path>
          </svg>
        `;
    }
  }

  disconnectedCallback() {
    this.clearTimer();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div
        class="toast ${this.variant} ${this.open ? "open" : ""}"
        role="alert"
        aria-live="polite"
        aria-hidden=${this.open ? "false" : "true"}
      >
        <span class="icon" aria-hidden="true"> ${this.renderIcon()} </span>

        <span class="message">${this.message}</span>

        ${this.closable
          ? html`
              <button
                type="button"
                class="close-button"
                aria-label="Close notification"
                @click=${this.handleClose}
              >
                ×
              </button>
            `
          : ""}
      </div>
    `;
  }
}
