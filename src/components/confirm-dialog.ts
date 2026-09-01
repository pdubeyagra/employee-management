import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

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
      z-index: 9999;

      display: block;

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

    /* =========================
       Backdrop
       ========================= */

    .backdrop {
      position: fixed;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      padding: 20px;

      background: rgba(17, 24, 39, 0.55);

      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);

      animation: fade-in 0.15s ease;
    }

    /* =========================
       Dialog
       ========================= */

    .dialog {
      width: 100%;
      max-width: 440px;

      padding: 24px;

      background: #ffffff;

      border: 1px solid #e5e7eb;
      border-radius: 14px;

      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);

      animation: dialog-in 0.15s ease;
    }

    /* =========================
       Icon
       ========================= */

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 44px;
      height: 44px;

      margin-bottom: 16px;

      color: #dc2626;
      background: #fef2f2;

      border-radius: 50%;
    }

    .icon {
      width: 22px;
      height: 22px;
    }

    /* =========================
       Content
       ========================= */

    .title {
      margin: 0 0 8px;

      color: #111827;

      font-size: 20px;
      line-height: 1.3;
      font-weight: 700;
    }

    .message {
      margin: 0;

      color: #6b7280;

      font-size: 14px;
      line-height: 1.6;

      overflow-wrap: anywhere;
    }

    /* =========================
       Actions
       ========================= */

    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      gap: 10px;

      margin-top: 24px;
    }

    button {
      min-height: 40px;

      padding: 9px 16px;

      border-radius: 8px;

      font-family: inherit;
      font-size: 14px;
      font-weight: 600;

      cursor: pointer;

      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        transform 0.1s ease;
    }

    button:active {
      transform: translateY(1px);
    }

    button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.25);
      outline-offset: 2px;
    }

    .cancel-button {
      color: #374151;
      background: #ffffff;

      border: 1px solid #d1d5db;
    }

    .cancel-button:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .confirm-button {
      color: #ffffff;
      background: #dc2626;

      border: 1px solid #dc2626;
    }

    .confirm-button:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    /* =========================
       Mobile
       ========================= */

    @media (max-width: 600px) {
      .backdrop {
        align-items: flex-end;

        padding: 0;
      }

      .dialog {
        width: 100%;
        max-width: none;

        padding: 22px 18px calc(18px + env(safe-area-inset-bottom));

        border-radius: 16px 16px 0 0;

        animation: dialog-mobile-in 0.2s ease;
      }

      .icon-wrapper {
        width: 42px;
        height: 42px;
      }

      .title {
        font-size: 19px;
      }

      .message {
        font-size: 14px;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;

        gap: 10px;

        margin-top: 22px;
      }

      button {
        width: 100%;
        min-height: 44px;
      }
    }

    /* =========================
       Small phones
       ========================= */

    @media (max-width: 380px) {
      .dialog {
        padding: 20px 14px calc(14px + env(safe-area-inset-bottom));
      }

      .actions {
        grid-template-columns: 1fr;
      }

      .confirm-button {
        order: -1;
      }
    }

    /* =========================
       Reduced motion
       ========================= */

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }

      button {
        transition: none;
      }
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
        transform: translateY(-8px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
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
