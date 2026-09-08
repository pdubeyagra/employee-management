import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

export type DialogRole = "dialog" | "alertdialog";

export type DialogSize = "small" | "medium" | "large";

@customElement("ui-dialog")
export class UiDialog extends LitElement {
  @property({ type: Boolean })
  open = false;

  @property()
  heading = "";

  @property({ type: String })
  size: DialogSize = "medium";

  @property({ type: String, attribute: "dialog-role" })
  dialogRole: DialogRole = "dialog";

  @property({ type: Boolean, attribute: "hide-close" })
  hideClose = false;

  @property({ type: Boolean, attribute: "disable-overlay-close" })
  disableOverlayClose = false;

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
      background: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      max-height: calc(100vh - var(--spacing-2xl) * 2);
      overflow-y: auto;
    }

    .dialog.small {
      max-width: 360px;
    }

    .dialog.medium {
      max-width: 420px;
    }

    .dialog.large {
      max-width: 640px;
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

    .dialog-body {
      min-width: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }
  `;

  private emitClose() {
    this.dispatchEvent(new CustomEvent("dialog-close"));
  }

  private handleCloseClick() {
    this.emitClose();
  }

  private handleOverlayClick(event: MouseEvent) {
    if (this.disableOverlayClose) {
      return;
    }

    if (event.target === event.currentTarget) {
      this.emitClose();
    }
  }

  render() {
    return html`
      <div
        class="overlay ${this.open ? "open" : ""}"
        @click=${this.handleOverlayClick}
        role="presentation"
      >
        <div
          class="dialog ${this.size}"
          role=${this.dialogRole}
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div class="dialog-header">
            <h3 id="dialog-title">${this.heading}</h3>

            ${this.hideClose
              ? nothing
              : html`
                  <button
                    type="button"
                    class="close-icon-button"
                    aria-label="Close"
                    @click=${this.handleCloseClick}
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
                `}
          </div>

          <div class="dialog-body">
            <slot></slot>
          </div>

          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
