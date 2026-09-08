import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../ui/ui-button.js";
import "../ui/ui-dialog.js";

import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";
import type { ButtonVariant } from "../ui/ui-button.js";
import type { DialogSize } from "../ui/ui-dialog.js";

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

  @property({ type: String, attribute: "confirm-variant" })
  confirmVariant: ButtonVariant = "danger";

  @property({ type: String })
  size: DialogSize = "medium";

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

  private get template(): TemplateResult {
    return html`
      <ui-dialog
        .open=${this.open}
        .heading=${this.title}
        .size=${this.size}
        dialog-role="alertdialog"
        @dialog-close=${this.handleCancel}
      >
        <p class="dialog-message">${this.message}</p>

        <div class="dialog-actions" slot="footer">
          <ui-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleCancel}
          >
            ${this.cancelText}
          </ui-button>

          <ui-button
            .variant=${this.confirmVariant}
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleConfirm}
          >
            ${this.confirmText}
          </ui-button>
        </div>
      </ui-dialog>
    `;
  }

  render() {
    return this.template;
  }
}
