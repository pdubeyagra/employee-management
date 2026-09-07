import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./button.ts";

import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

@customElement("confirm-dialog")
export class ConfirmDialog extends LitElement {
  @property({ type: Boolean })
  open = false;

  @property()
  title = "Confirm";

  @property()
  message = "Are you sure?";

  @property()
  confirmText = "Confirm";

  @property()
  cancelText = "Cancel";

  static styles = css`
    :host {
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg);
      background: rgba(15, 23, 42, 0.5);
    }

    .overlay.open {
      display: flex;
    }

    .dialog {
      width: 100%;
      max-width: 420px;
      background: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
    }

    .dialog-header h3 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      font-weight: 700;
    }

    .close-icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      color: var(--color-text-tertiary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .close-icon-button:hover {
      background: var(--color-background-secondary);
      color: var(--color-text-secondary);
    }

    .close-icon-button:focus-visible {
      outline: 3px solid var(--color-primary-light);
      outline-offset: 2px;
      color: var(--color-text-secondary);
    }

    .close-icon-button svg {
      width: 18px;
      height: 18px;
    }

    .dialog-message {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }
  `;

  private handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  private handleConfirm() {
    this.dispatchEvent(new CustomEvent("confirm"));
  }

  private handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.handleCancel();
    }
  }

  private get template(): TemplateResult {
    return html`
      <div
        class="overlay ${this.open ? "open" : ""}"
        @click=${this.handleOverlayClick}
        role="presentation"
      >
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div class="dialog-header">
            <h3 id="dialog-title">${this.title}</h3>

            <button
              type="button"
              class="close-icon-button"
              aria-label="Close"
              @click=${this.handleCancel}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <p class="dialog-message">${this.message}</p>

          <div class="dialog-actions">
            <app-button
              variant="secondary"
              size="medium"
              shape="rounded"
              type="button"
              @button-click=${this.handleCancel}
            >
              ${this.cancelText}
            </app-button>

            <app-button
              variant="danger"
              size="medium"
              shape="rounded"
              type="button"
              @button-click=${this.handleConfirm}
            >
              ${this.confirmText}
            </app-button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return this.template;
  }
}
