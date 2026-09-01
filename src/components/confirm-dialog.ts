import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { THEME_COLORS, generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";

@customElement("confirm-dialog")
export class ConfirmDialog extends LitElement {
  @property({ type: Boolean })
  open = false;

  @property({ type: String })
  title = "Delete Employee";

  @property({ type: String })
  message =
    "Are you sure you want to delete this employee? This action cannot be undone.";

  @property({ type: String })
  confirmText = "Delete";

  @property({ type: String })
  cancelText = "Cancel";

  static styles = css`
    :host {
      position: contents;
      inset: 0;
      z-index: var(--z-modal);
      display: block;
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

    .backdrop {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(var(--spacing-md), 4vw, var(--spacing-xl));
      background: rgba(17, 24, 39, 0.55);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: fade-in var(--transition-base) ease;
    }

    .dialog {
      width: 100%;
      max-width: 440px;
      padding: clamp(var(--spacing-xl), 4vw, var(--spacing-2xl));
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      animation: dialog-in var(--transition-base) ease;
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(40px, 8vw, 44px);
      height: clamp(40px, 8vw, 44px);
      margin-bottom: var(--spacing-lg);
      color: var(--color-danger);
      background: ${unsafeCSS(THEME_COLORS.danger[50])};
      border-radius: 50%;
    }

    .icon {
      width: 22px;
      height: 22px;
    }

    .title {
      margin: 0 0 var(--spacing-md);
      color: var(--color-text-primary);
      font-size: clamp(var(--font-size-lg), 4vw, var(--font-size-xl));
      line-height: var(--line-height-normal);
      font-weight: 700;
    }

    .message {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: clamp(var(--font-size-sm), 2vw, var(--font-size-base));
      line-height: var(--line-height-relaxed);
      overflow-wrap: anywhere;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-top: var(--spacing-2xl);
    }

    button {
      min-height: clamp(36px, 6vw, 40px);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: clamp(var(--font-size-sm), 2vw, var(--font-size-base));
      font-weight: 600;
      cursor: pointer;
      transition:
        background-color var(--transition-base),
        border-color var(--transition-base),
        color var(--transition-base),
        transform var(--transition-base);
    }

    button:active {
      transform: translateY(1px);
    }

    button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.25);
      outline-offset: 2px;
    }

    .cancel-button {
      color: var(--color-text-secondary);
      background: var(--color-background);
      border: 1px solid var(--color-border);
    }

    .cancel-button:hover {
      background: var(--color-background-secondary);
      border-color: var(--color-border-secondary);
    }

    .confirm-button {
      color: var(--color-text-inverse);
      background: var(--color-danger);
      border: 1px solid var(--color-danger);
    }

    .confirm-button:hover {
      background: var(--color-danger-hover);
      border-color: var(--color-danger-hover);
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes dialog-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes dialog-mobile-in {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .backdrop {
        align-items: flex-end;
        padding: 0;
      }

      .dialog {
        width: 100%;
        max-width: none;
        padding: clamp(var(--spacing-md), 4vw, var(--spacing-xl))
          clamp(var(--spacing-md), 3vw, var(--spacing-lg))
          calc(
            clamp(var(--spacing-md), 3vw, var(--spacing-lg)) +
              env(safe-area-inset-bottom)
          );
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        animation: dialog-mobile-in var(--transition-base) ease;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: var(--spacing-xl);
      }

      button {
        width: 100%;
        min-height: clamp(40px, 8vw, 44px);
      }
    }

    @media (max-width: 380px) {
      .actions {
        grid-template-columns: 1fr;
      }

      .confirm-button {
        order: -1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }

      button {
        transition: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.handleKeyDown);

    super.disconnectedCallback();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.open) return;

    if (event.key === "Escape") {
      this.close();
    }
  };

  private close() {
    this.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private confirm() {
    this.dispatchEvent(
      new CustomEvent("confirm", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  render() {
    if (!this.open) {
      return html``;
    }

    return html`
      <div
        class="backdrop"
        role="presentation"
        @click=${this.handleBackdropClick}
      >
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-message"
        >
          <div class="icon-wrapper" aria-hidden="true">
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path
                d="M10.3 3.5 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <h2 id="dialog-title" class="title">${this.title}</h2>

          <p id="dialog-message" class="message">${this.message}</p>

          <div class="actions">
            <button type="button" class="cancel-button" @click=${this.close}>
              ${this.cancelText}
            </button>

            <button type="button" class="confirm-button" @click=${this.confirm}>
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
