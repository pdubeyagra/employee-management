import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type ToastVariant = "success" | "error" | "info";

type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

@customElement("app-toast")
export class AppToast extends LitElement {
  @property({ type: String })
  message = "";

  @property({ type: String })
  variant: ToastVariant = "success";

  @property({ type: Boolean })
  open = false;

  /**
   * Duration in milliseconds.
   *
   * 0 = stays open until manually closed.
   */
  @property({ type: Number })
  duration = 3000;

  /**
   * Whether to display the close button.
   */
  @property({ type: Boolean })
  closable = true;

  /**
   * Toast position on the screen.
   */
  @property({ type: String })
  placement: ToastPlacement = "top-right";

  private timeoutId?: number;

  static styles = css`
    :host {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      box-sizing: border-box;
    }

    /* -------------------------
       Placement
    ------------------------- */

    :host([placement="top-left"]) {
      top: 24px;
      left: 24px;
    }

    :host([placement="top-center"]) {
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="top-right"]) {
      top: 24px;
      right: 24px;
    }

    :host([placement="bottom-left"]) {
      bottom: 24px;
      left: 24px;
    }

    :host([placement="bottom-center"]) {
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="bottom-right"]) {
      bottom: 24px;
      right: 24px;
    }

    /* -------------------------
       Toast
    ------------------------- */

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;

      min-width: 280px;
      max-width: min(420px, calc(100vw - 48px));

      box-sizing: border-box;

      padding: 14px 16px;

      border-radius: 10px;

      color: #ffffff;

      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;

      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.08);

      opacity: 0;
      transform: translateY(-10px);

      transition:
        opacity 0.2s ease,
        transform 0.2s ease;

      pointer-events: none;
    }

    .toast.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* Bottom toast animation */

    :host([placement^="bottom"]) .toast {
      transform: translateY(10px);
    }

    :host([placement^="bottom"]) .toast.open {
      transform: translateY(0);
    }

    /* -------------------------
       Message
    ------------------------- */

    .message {
      flex: 1;
    }

    /* -------------------------
       Close button
    ------------------------- */

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 24px;
      height: 24px;

      padding: 0;

      border: none;
      border-radius: 4px;

      color: inherit;
      background: transparent;

      font-size: 20px;
      line-height: 1;

      cursor: pointer;

      opacity: 0.8;

      transition:
        background-color 0.15s ease,
        opacity 0.15s ease;
    }

    .close-button:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    .close-button:focus-visible {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }

    /* -------------------------
       Variants
    ------------------------- */

    .success {
      background: #16a34a;
    }

    .error {
      background: #dc2626;
    }

    .info {
      background: #2563eb;
    }

    /* -------------------------
       Mobile
    ------------------------- */

    @media (max-width: 600px) {
      :host([placement="top-left"]),
      :host([placement="top-center"]),
      :host([placement="top-right"]) {
        top: 16px;
      }

      :host([placement="bottom-left"]),
      :host([placement="bottom-center"]),
      :host([placement="bottom-right"]) {
        bottom: 16px;
      }

      :host([placement="top-left"]),
      :host([placement="bottom-left"]) {
        left: 16px;
      }

      :host([placement="top-right"]),
      :host([placement="bottom-right"]) {
        right: 16px;
      }

      :host([placement="top-center"]),
      :host([placement="bottom-center"]) {
        left: 16px;
        right: 16px;
        transform: none;
      }

      .toast {
        min-width: 0;
        width: 100%;
        max-width: none;
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

  /**
   * Show the toast.
   */
  show(message: string, variant: ToastVariant = "success") {
    this.message = message;
    this.variant = variant;
    this.open = true;

    this.startTimer();
  }

  /**
   * Manually close the toast.
   */
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

    // duration = 0 means no automatic closing.
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
        <span class="message"> ${this.message} </span>

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
